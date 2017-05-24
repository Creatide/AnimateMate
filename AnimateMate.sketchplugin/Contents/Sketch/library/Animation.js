function Animation(layer, animationString, easingType, keyframes, layerID) {
    this.layer = layer;
    this.layerName = layer.name();
    this.layerID = layerID;
    this.layerType = this.setLayerType();
    this.layerLevel = this.getLayerLevel();
    this.layerBaseName = this.layerName.split(animate.layerMarks.start)[0];
    this.originalValues = this.getOriginalValues();
    this.animationString = animationString || undefined;
    this.animationFullString = animate.layerMarks.start + this.animationString + animate.layerMarks.end;
    this.easingType = easingType || animate.defaultEasing;
    this.allKeyframes = [];
    this.keyframes = keyframes || [];
    this.keyframesLength = this.keyframes ? this.keyframes.length : 0;
}


Animation.prototype.updateLayerName = function (newBaseName, newEasingType, overwriteName) {
    
    var newEasingType = newEasingType || this.easingType;
    var rebuildAnimationString = animate.layerMarks.start + newEasingType + animate.layerMarks.groups;
    var keyframesLength = this.keyframes.length;
    
    this.keyframes.sort(utils.sortBy('number', false, parseInt));
    
    for (var i = 0; i < keyframesLength; i++) {
        rebuildAnimationString += utils.objToString(this.keyframes[i]) + animate.layerMarks.groups;
    }
    
    rebuildAnimationString += animate.layerMarks.end;
    
    var newLayerName = this.layerBaseName + rebuildAnimationString;
    
    // Change layer base name if setted
    if (newBaseName) newLayerName = newLayerName.replace(this.layerBaseName, newBaseName);
    
    this.layer.setName(newLayerName);
};


Animation.prototype.setKeyframeValues = function (keyframeNumber, valuesObject, changeKeyframeNumber, loopIndex) {
    
    var refKeyframe = null;
    var loopIndex = loopIndex || null;
    var valuesObject = valuesObject || this.getOriginalValues();
    var duplicates = this.searchDuplicateKeyframes(keyframeNumber);
    
    if (!isNaN(duplicates)) {
        
        refKeyframe = this.keyframes[duplicates];
        
        // Offset animation skip duplicates if not in current loop index
        if (loopIndex && loopIndex != duplicates) {
            refKeyframe = this.keyframes[loopIndex];
        }
        
    } else {
        this.keyframes[this.keyframesLength] = {};
        refKeyframe = this.keyframes[this.keyframesLength];
    }
    
    refKeyframe.number = changeKeyframeNumber ? valuesObject.number : keyframeNumber;
    refKeyframe.x = valuesObject.x;
    refKeyframe.y = valuesObject.y;
    refKeyframe.width = valuesObject.width;
    refKeyframe.height = valuesObject.height;
    
    // Fix rotation issue after 3.8 update
    if ( utils.sketchVersion >= '3.8' ) {
        refKeyframe.rotation = valuesObject.rotation;    
    } else {
        refKeyframe.rotation = valuesObject.rotation >= 360 ? 0 : valuesObject.rotation;
    }
    
    refKeyframe.opacity = Math.min(Math.max(parseFloat(valuesObject.opacity), 0), 1);
};


Animation.prototype.createAllKeyframes = function () {
    
    var keyframesArray = [];

    // Create animation based main keyframes
    for (var i = 0; i < this.keyframesLength; i++) {
        
        var currentKeyframe = this.keyframes[i];
        var nextKeyframe = utils.arrayNext(this.keyframes, i);
        var keyframeDifference = nextKeyframe ? Math.max(0, nextKeyframe.number - currentKeyframe.number - 1) : undefined;

        // Push current keyframe first and also to last keyframe because there is no next available
        keyframesArray.push(currentKeyframe);

        // If there is next keyframe available
        if (nextKeyframe && !isNaN(currentKeyframe.number) && !isNaN(nextKeyframe.number) && keyframeDifference) {
            
            // Calculate rotation direction
            // var rotDirection = (nextKeyframe.rotation - currentKeyframe.rotation + 360) % 360 > 180;
            // if (rotDirection) currentKeyframe.rotation = -(360 - currentKeyframe.rotation); 

            // Crete between keyframes
            for (var j = 1; j <= keyframeDifference; j++) {

                var keyframeObj = {};
                
                keyframeObj.number = parseInt(currentKeyframe.number) + j;
                
                keyframeObj.x = easing.getEasingValue(currentKeyframe.x, nextKeyframe.x, keyframeDifference, j, this.easingType);
                
                keyframeObj.y = easing.getEasingValue(currentKeyframe.y, nextKeyframe.y, keyframeDifference, j, this.easingType);
                
                keyframeObj.width = easing.getEasingValue(currentKeyframe.width, nextKeyframe.width, keyframeDifference, j, this.easingType);
                
                keyframeObj.height = easing.getEasingValue(currentKeyframe.height, nextKeyframe.height, keyframeDifference, j, this.easingType);              
                
                keyframeObj.rotation = easing.getEasingValue(currentKeyframe.rotation, nextKeyframe.rotation, keyframeDifference, j, this.easingType);
                
                keyframeObj.opacity = easing.getEasingValue(currentKeyframe.opacity, nextKeyframe.opacity, keyframeDifference, j, this.easingType);
                
                keyframesArray.push(keyframeObj);
            }
        }        
    }
    
    // Create/duplicate first main keyframes to beginning between (0 - firstKeyframe.number)
    var firstKeyframe = keyframesArray[0];
    if (firstKeyframe.number != 0) {
        
        var tmpLength = firstKeyframe.number - 1;
        
        // Duplicate loop for make same keyframes
        while (tmpLength >= 0) {
            var refKeyframe = utils.cloneObj(firstKeyframe);
            refKeyframe.number = parseInt(tmpLength);
            keyframesArray.unshift(refKeyframe);
            tmpLength--;
        }
    }
        
    this.allKeyframes = keyframesArray;
};


Animation.prototype.searchDuplicateKeyframes = function (keyframeNumber) {
    for (var i = 0; i < this.keyframesLength; i++) {
        if (this.keyframes[i].number == keyframeNumber) {
            return i;
        }
    }
};


Animation.prototype.setLayerType = function () {
    if (this.layer.isMemberOfClass(MSLayerGroup)) {
        return 'group';
    } else if (this.layer.isMemberOfClass(MSArtboardGroup)) {
        return 'artboard';
    } else {
        return 'layer';
    }
};


Animation.prototype.getLayerLevel = function () {
    
    var parent = this.layer.parentGroup();
    var levelNum = 0;
    
    while (parent.isMemberOfClass(MSLayerGroup)) {
        levelNum++;
        parent = parent.parentGroup();
    }
    return levelNum;
};


Animation.prototype.getParentGroups = function (layer) {
    
    var layer = layer || this.layer;
    var parents = {};
    var parentGroups = [];
    
    var parentLoop = function (parent) {
        if (parent.isMemberOfClass(MSLayerGroup)) {
            parentGroups.push(parent)
            parentLoop(parent.parentGroup());
        } else if (parent.isMemberOfClass(MSArtboardGroup)) {
            parents.artboard = parent;
        }
    }
    
    parentLoop(layer.parentGroup());
    parents.groups = parentGroups;
    return parents;
};


Animation.prototype.getParentValues = function (layer) {
    
    var layer = layer || this.layer;
    var animationLayers = null, parents = null, parentGroupValues = null;
    animationLayers = animate.animationLayers;
    parents = this.getParentGroups(layer);
    parentGroupValues = {
        x: 0,
        y: 0
    };
    
    // Create absolute position values by looping parents values
    for (var i = 0; i < parents.groups.length; i++) {
        var groupRect = parents.groups[i].rect();
        parentGroupValues.x += groupRect.origin.x;
        parentGroupValues.y += groupRect.origin.y;
    }
    
    return parentGroupValues;
};


// Note: Nested layers/groups inside of groups are relative position values based to group postion values. 
// These values is made through parent group values. This function effects layer naming and setting layer original values for resetting positions.
// e.g. layer x position inside of group is 0 even group x is something else.
Animation.prototype.getOriginalValues = function (layer) {
    
    var layer = layer || this.layer;
    var parentGroupValues = this.getParentValues();
    var returnObj = {};
    
    // Updated based on this bug report https://github.com/Creatide/AnimateMate/issues/27
    // It seems that changing this one prevents object jumping after exporting, even exported content seems to be ok
    // Tested with Sketch 44 version. Not sure if there is problems with other versions.
    returnObj.x = Math.round((layer.frame().x()) * 100) / 100;
    returnObj.y = Math.round((layer.frame().y()) * 100) / 100;
    
    returnObj.width = Math.round(layer.frame().width() * 100) / 100;
    returnObj.height = Math.round(layer.frame().height() * 100) / 100;
        
    returnObj.rotation = Math.round((360 - layer.rotation()) * 100) / 100;
    returnObj.opacity = Math.round(layer.style().contextSettings().opacity() * 100) / 100;
    
    return returnObj;
};


// Set actual physical position to layer object.
Animation.prototype.setOriginalValues = function (valuesObj, keyframeNumber, referencePoint, keepProportions) {
    
    var refValues = valuesObj || this.originalValues;
    
    // Keep aspect ratio of item if chosen
    if (keepProportions) {
        var originalProportionState = this.layer.frame().constrainProportions();
        this.layer.frame().setConstrainProportions(true);
        this.layer.frame().setWidth(refValues.width);
        // Return original state of proportion lock
        this.layer.frame().setConstrainProportions(originalProportionState);
    } else {
        this.layer.frame().setWidth(refValues.width);
        this.layer.frame().setHeight(refValues.height);
    }
    
    // Calculate center reference point
    if (referencePoint == 'Center') {

        var oldKeyframe = utils.arrayPrev(this.allKeyframes, keyframeNumber);
        oldKeyframe = oldKeyframe || refValues;

        var currentX = !keyframeNumber || refValues.x != oldKeyframe.x ? refValues.x : this.layer.frame().x();
        var currentY = !keyframeNumber || refValues.y != oldKeyframe.y ? refValues.y : this.layer.frame().y();

        this.layer.frame().setX(currentX - ((this.layer.frame().width() - oldKeyframe.width) / 2));
        this.layer.frame().setY(currentY - ((this.layer.frame().height() - oldKeyframe.height) / 2));
    } 
    // Use top left for default reference point
    else {
        this.layer.frame().setX(refValues.x);
        this.layer.frame().setY(refValues.y);
    }

    this.layer.setRotation(360 - refValues.rotation);
    this.layer.style().contextSettings().setOpacity(refValues.opacity);
};

// The MIT License (MIT)
// 
// Copyright (c) 2016 Creatide / Sakari Niittymaa
// creatide.com - hello@creatide.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
