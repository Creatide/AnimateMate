@import 'library/Animation.js';

var debugLog = true;
var animate = new Animate();
function Animate () {}
 
 
// ---------------------------------------- //
//            Initialize Object             //
// ---------------------------------------- //


Animate.prototype.init = function (layers, loopNestedGroups) {
    
    this.animationLayers = [];
    this.otherLayers = [];
    this.allLayers = [];
    this.keyframeNumbers = [];
    this.startFrameNumber = 0;
    this.endFrameNumber = 0;
    this.exportName = utils.artboardName;
    this.referencePoints = ['Top Left', 'Center'];
    this.easingTypes = easing.getEasingNames();
    this.defaultEasing = this.easingTypes[0];
    this.layerMarks = {
        start: '{:',
        end: '}',
        values: ',',
        groups: ';',
    };
    this.exportFolders = {
        tempFolder: null,
        exportFolder: null
    };
    this.getLayers(layers, loopNestedGroups);
    
    return this.animationLayers.length;
};

 
// ---------------------------------------- //
//            Command Functions             //
// ---------------------------------------- //


Animate.prototype.exportAnimation = function (exportName, exportGif, exportPng, renderStartFrame, renderEndFrame, referencePoint, loopAnimation, delayAnimation) {
    
    // Set base name for exported items
    this.exportName = exportName || this.exportName;
    
    // Set render range values
    var renderStartFrame = parseInt(renderStartFrame);
    var renderEndFrame = parseInt(renderEndFrame);
    if (renderEndFrame > this.endFrameNumber || renderEndFrame < this.startFrameNumber) renderEndFrame = this.endFrameNumber;
    if (renderStartFrame < 0 || renderStartFrame > renderEndFrame) renderStartFrame = 0;
    this.startFrameNumber = renderStartFrame;    
    
    // Get number of digits from animation length for zero paddings. Add needed zero digits even the number is below 10 e.g. 01, 02, 03...
    var digitsCount = parseInt((this.endFrameNumber.toString()).length);
    var digitsNumber = digitsCount < 2 ? digitsCount + 1 : digitsCount;
    
    // Setup folder for animation
    this.createExportFolders();
    // Test if folders is not empty
    if (!this.exportFolders.tempFolder || !this.exportFolders.exportFolder) return;
    
    // Store location of png files
    var pngFilesLocation = exportPng == 0 ? this.exportFolders.tempFolder.folderPath : this.exportFolders.exportFolder.folderPath;
    
    // Start timer and show bottom message about starting rendering process
    if (debugLog) dialog.createBottomMessage(1, utils.benchmarkTime.start());
    
    // Calculate all keyframes and update values to object variable
    for (var j in this.animationLayers) {
        this.animationLayers[j].createAllKeyframes();
    }
    
    var animationLayersLength = this.animationLayers.length;
    
    // Sort by layer level value (from most deepest to root)
    this.animationLayers.sort(utils.sortBy('layerLevel', true, parseInt));    
    
    // Log preprocessing render time
    if (debugLog) dialog.createLogMessage(1, ['pre-processing', utils.benchmarkTime.interval()]);
    
    // Loop animation frame through all frames in selected range
    for (var k = this.startFrameNumber; k <= renderEndFrame; k++) {   
        
        // Loop all animation layers and apply values to layer
        for (var i = 0; i < animationLayersLength; i++) {
            
            var refLayer = this.animationLayers[i];
            
            // Check that keyframe exist or it will crash with different length of animations
            if (refLayer.allKeyframes[k]) {
                refLayer.setOriginalValues(refLayer.allKeyframes[k], k, referencePoint);
            }
        }
        
        // Save PNG base images to selected location
        this.saveImagePNG(utils.zeroPadding(k, digitsNumber), pngFilesLocation);
        
        // Log frame render time
        if (debugLog) dialog.createLogMessage(1, [utils.zeroPadding(k, digitsNumber), utils.benchmarkTime.interval()]);
    }
    
    // Set layer original values back
    for (var l in this.animationLayers) {
        this.animationLayers[l].setOriginalValues();
    }
    
    // Export / Create GIF animation from PNG images
    if (exportGif != 0 && this.exportFolders.tempFolder) {
        // Log GIF starting message
        if (debugLog) dialog.createLogMessage(2);
        this.saveImageGIF(pngFilesLocation, delayAnimation, loopAnimation);
    }
    
    // Remove temporary folder
    this.exportFolders.tempFolder.fileManager.removeItemAtPath_error_(this.exportFolders.tempFolder.folderPath, null);
    
    // Show bottom message about starting rendering process
    if (debugLog) dialog.createBottomMessage(2, utils.benchmarkTime.stop());
};


Animate.prototype.createAnimation = function (easingType, keyframeNumber, changeEasingType) {
    
    var easingType = easingType || this.defaultEasing;
    var selectedEasingType = easingType;
    
    // Combine all layers together for loop
    this.allLayers = this.animationLayers.concat(this.otherLayers);
    var dialogAcceptAll = false;
    
    for (var i in tmpLayer = this.allLayers) {
        
        // If duplicate keyframes found ask user permission to overwrite
        if (!dialogAcceptAll && this.searchDuplicateKeyframe(tmpLayer[i], keyframeNumber)) {
            if (dialog.createDialogMessage(7, keyframeNumber) == 1001) {
                return;
            } else {
                dialogAcceptAll = true;
            }
        }
        
        // Update keyframe object values before build new layer name from those
        tmpLayer[i].setKeyframeValues(keyframeNumber);
        
        // Get random easing from array if not selected any specific
        if (selectedEasingType == 'Random Easing') easingType = this.easingTypes[Math.floor(Math.random() * this.easingTypes.length)];
        
        // If animation exist in layer do not change easing type except user wanted so
        if (changeEasingType == true) {
            tmpLayer[i].updateLayerName(false, easingType);
        } else {
            tmpLayer[i].keyframesLength ? tmpLayer[i].updateLayerName() : tmpLayer[i].updateLayerName(false, easingType);
        }
    }
};


Animate.prototype.removeAnimation = function (removeAll) {
    // Get layers again to loop nested groups and remove all animations
    if (removeAll) this.init(utils.layers, removeAll);
    for (var i in tmpLayer = this.animationLayers) {
        if (tmpLayer[i].layerBaseName.length == 0) {
            tmpLayer[i].layer.setName('EMPTY NAME');
        } else {
            tmpLayer[i].layer.setName(tmpLayer[i].layerBaseName);
        }
    }
};


Animate.prototype.offsetAnimation = function (offsetType, stepSize, responseValues) {
    
    var offsetType = offsetType.toLowerCase() || 'normal';
    utils.objValuesToFloat(responseValues);
    
    // Calculate new values based to Offset type
    var offsetValues = function (originalValues, changeValues, additionalValue) {
        var returnValuesObj = {};
        
        // Keyframe Number
        returnValuesObj.number = originalValues.number + changeValues.number + (changeValues.number != 0 ? changeValues.number < 0 ? -additionalValue : additionalValue : 0);
        
        // Position X
        returnValuesObj.x = originalValues.x + changeValues.x + (changeValues.x != 0 ? changeValues.x < 0 ? -additionalValue : additionalValue : 0);
        
        // Position Y
        returnValuesObj.y = originalValues.y + changeValues.y + (changeValues.y != 0 ? changeValues.y < 0 ? -additionalValue : additionalValue : 0);
        
        // Width
        returnValuesObj.width = originalValues.width + changeValues.width + (changeValues.width != 0 ? changeValues.width < 0 ? -additionalValue : additionalValue : 0);
        
        // Height
        returnValuesObj.height = originalValues.height + changeValues.height + (changeValues.height != 0 ? changeValues.height < 0 ? -additionalValue : additionalValue : 0);
        
        // Rotation
        returnValuesObj.rotation = originalValues.rotation + changeValues.rotation + (changeValues.rotation != 0 ? changeValues.rotation < 0 ? -additionalValue : additionalValue : 0);
        
        // Opacity (0-100 values conversion included)
        returnValuesObj.opacity = ((originalValues.opacity * 100) + changeValues.opacity + (changeValues.opacity != 0 ? changeValues.opacity < 0 ? -additionalValue * 10 : additionalValue * 10 : 0)) / 100;
        
        return returnValuesObj;
    }
    
    // Loop all animations to make chosen offset type for layer names
    for (var i in tmpLayer = this.animationLayers) {
        
        for (var j = 0; j < tmpLayer[i].keyframesLength; j++) {
            
            var refKeyframe = tmpLayer[i].keyframes[j];
            var keyframeNumber = refKeyframe.number;
            
            switch (offsetType) {
                case 'normal':
                    var offsetValuesObj = offsetValues(refKeyframe, responseValues, 0);
                    tmpLayer[i].setKeyframeValues(keyframeNumber, offsetValuesObj, true, j);
                    break;
                case 'stepped (layer)':
                    var offsetValuesObj = offsetValues(refKeyframe, responseValues, j * stepSize);
                    tmpLayer[i].setKeyframeValues(keyframeNumber, offsetValuesObj, true, j);
                    break;
                case 'stepped (selection)':
                    var offsetValuesObj = offsetValues(refKeyframe, responseValues, i * stepSize);
                    tmpLayer[i].setKeyframeValues(keyframeNumber, offsetValuesObj, true, j);
                    break;
            }
        }

        tmpLayer[i].updateLayerName();
    }
};


Animate.prototype.editAnimation = function (baseName, jsonKeyframes) {
    try {
        var convertedKeyframeData = JSON.parse('[' + jsonKeyframes + ']');
        this.animationLayers[0].keyframes = convertedKeyframeData;
        this.animationLayers[0].updateLayerName(baseName, false);    
    } catch (error) {
        dialog.createDialogMessage(9);
        log(error)
    }
};


Animate.prototype.returnKeyframe = function (keyframeNumber) {
    for (var i in tmpLayer = this.animationLayers) {
        var searchIndex = utils.searchObjectArrayIndex(tmpLayer[i].keyframes, 'number', keyframeNumber);
        var refKeyframe = tmpLayer[i].keyframes[searchIndex];
        tmpLayer[i].setOriginalValues(refKeyframe);
    }
};


Animate.prototype.randomAnimation = function (responseValuesObj) {
    
    var easingType = responseValuesObj.easingType || this.defaultEasing;
    var selectedEasingType = easingType;
    
    // Combine all layers together for loop
    this.allLayers = this.animationLayers.concat(this.otherLayers);

    // Convert all keyframe values to float
    utils.objValuesToFloat(responseValuesObj);
    
    // Get how many frames is in total animation length
    var keyframesCount = responseValuesObj.animationLength / responseValuesObj.keyframeSpacing;
    if (isNaN(keyframesCount)) keyframesCount = 0;
    
    // Loop all layers
    for (var l in tmpLayer = this.allLayers) {
        
        // Get random easing from array if not selected any specific
        if (selectedEasingType == 'Random Easing') easingType = this.easingTypes[Math.floor(Math.random() * this.easingTypes.length)];
        
        var keyframesArray = [];
        
        for (var i = 0; i <= keyframesCount; i++) {
            
            var tmpKeyframeObj = {};
            tmpKeyframeObj.number = (i * responseValuesObj.animationLength) / keyframesCount;
            
            // Loop every property in object and make random value
            for (var k in tmpLayer[l].originalValues) {
                
                // If disabled channel then use original values
                if (responseValuesObj[k + 'Disable']) {
                    tmpKeyframeObj[k] = tmpLayer[l].originalValues[k];
                } 
                else {
                    
                    var randomValue = utils.getRandomFloat(responseValuesObj[k + 'Min'], responseValuesObj[k + 'Max']);
                    
                    // If using additive mode
                    if (responseValuesObj[k + 'Additive']) {
                        tmpKeyframeObj[k] = tmpLayer[l].originalValues[k] + randomValue;
                    } else {
                        tmpKeyframeObj[k] = randomValue;
                    }
                }
            }
            
            // If need to keep image scale ratio / proportion
            if (responseValuesObj['scaleRatio']) {
                var aspectRatioValue = utils.getAspectRatio(tmpLayer[l].originalValues.width, tmpLayer[l].originalValues.height, tmpKeyframeObj.width, tmpKeyframeObj.height);
                tmpKeyframeObj.width = aspectRatioValue.width;
                tmpKeyframeObj.height = aspectRatioValue.height;
            }
            
            utils.objValuesToFloat(tmpKeyframeObj);
            keyframesArray.push(tmpKeyframeObj);
        }
        
        // Create looping animation by copying first keyframe to last
        if (responseValuesObj.animationLoop) {
            var tmpNumber = keyframesArray[keyframesArray.length - 1].number;
            keyframesArray[keyframesArray.length - 1] = utils.cloneObj(keyframesArray[0]);
            keyframesArray[keyframesArray.length - 1].number = tmpNumber;
        }
        
        tmpLayer[l].keyframes = keyframesArray; 
        tmpLayer[l].updateLayerName(false, easingType);
    }
};

// ---------------------------------------- //
//                Get Layers                //
// ---------------------------------------- //


// Loop all layers, get animations and create objects
Animate.prototype.getLayers = function (layers, loopNestedGroups) {
    
    // Create array from keyframes
    var keyframeValuesToArray = function (keyframeValues) {

        var keyframeValues = keyframeValues || undefined;

        if (keyframeValues) {

            // Create keyframe object to hold all keyframe data
            var keyframesArray = [];
            for (var i = 0; i < keyframeValues.length; i++) {

                var keyframeObj = {};
                var valuesArray = keyframeValues[i].split(animate.layerMarks.values);
                var valuesArrayLength = valuesArray.length;

                // Loop all values from array and set them to object properties
                for (var k = 0; k < valuesArrayLength; k++) {
                    keyframeObj.number = valuesArray[0];
                    keyframeObj.x = valuesArray[1];
                    keyframeObj.y = valuesArray[2];
                    keyframeObj.width = valuesArray[3];
                    keyframeObj.height = valuesArray[4];
                    keyframeObj.rotation = valuesArray[5];
                    keyframeObj.opacity = valuesArray[6];
                }

                // Convert all keyframe values to float
                utils.objValuesToFloat(keyframeObj);

                // Update keyframe numbers array for dialog dropdown list usage
                animate.keyframeNumbers.push(keyframeObj.number);
                // Remove doubles from keyframe numbers
                animate.keyframeNumbers = utils.uniqueNumber(animate.keyframeNumbers);

                // Update animation end frame
                animate.endFrameNumber = keyframeObj.number > animate.endFrameNumber ? keyframeObj.number : animate.endFrameNumber;

                // Push new keyframe object to array
                keyframesArray.push(keyframeObj);
            }

            // Sort keyframe numbers
            animate.keyframeNumbers.sort(function(a,b){return a - b});

            // Sort array by keyframe numbers
            keyframesArray.sort(utils.sortBy('number', false, parseInt));

            return keyframesArray;
        }
    }
    
    
    // Parse layer name to keyframes and create animation object
    var parseLayerName = function (layer, layerID) {

        // Parse animation from layer name and create Animation object
        var layerName = layer.name();
        if (layerName.search(animate.layerMarks.start) != -1) {

            var animationString = layerName.split(animate.layerMarks.start).pop().split(animate.layerMarks.end)[0];
            var keyframeValues = animationString.split(animate.layerMarks.groups);

            // Remove and create esing type from first item of array
            var easingType = keyframeValues.shift();

            // Remove last empty grp because of last group split mark
            keyframeValues.pop();

            // Create array of keyframes
            var keyframesArray = keyframeValuesToArray(keyframeValues);

            // Create new animation object and add it to animations array
            if (keyframesArray) {
                var animationObj = new Animation(layer, animationString, easingType, keyframesArray, layerID);
                animate.animationLayers.push(animationObj);
            }
        } else {
            var nonAnimatedObj = new Animation(layer, undefined, undefined, undefined, layerID);
            animate.otherLayers.push(nonAnimatedObj);
        }
    }
    

    // Loop all layers
    var loopLayers = function (layers, callback) {
        
        for (var i = 0; i < layers.count(); i++) {
            
            var refLayer = layers.objectAtIndex(i);
            var layerID = NSProcessInfo.processInfo().globallyUniqueString();
            
            if (refLayer.isMemberOfClass(MSLayerGroup)) {
                callback(refLayer);
                parseLayerName(refLayer, layerID);
                if (loopNestedGroups) loopLayers(refLayer.layers(), callback);
            } else {
                callback(refLayer);
                parseLayerName(refLayer, layerID);
            }
        }
    }
    
    loopLayers(layers, function (layer) {});
};


// ---------------------------------------- //
//                Exporting                 //
// ---------------------------------------- //


Animate.prototype.saveImagePNG = function (keyframeNumber, exportFolder) {
    var exportFolder = exportFolder || this.exportFolders.tempFolder.folderPath;
    var fileName = exportFolder.stringByAppendingPathComponent(this.exportName + '_' + keyframeNumber + '.png');
    utils.doc.saveArtboardOrSlice_toFile_(utils.artboard, fileName);
};


Animate.prototype.saveImageGIF = function (pngFilesLocation, loopValue, delayValue) {
    
    var loop = loopValue ? ' -l' : '';
    var delay = parseFloat(delayValue) ? ' -d' + parseFloat(delayValue) : ' -d0';
    var gifExportName = this.exportName + '_' + this.startFrameNumber + '-' + this.endFrameNumber;
    
    // Gifsicle Manual: http://www.lcdf.org/gifsicle/man.html
    var gifConverter = utils.scriptLibraryPath + "/gifsicle";
    
    // Create settings for conversion process
    var convertTask = NSTask.alloc().init();
    var createTask = NSTask.alloc().init();
    var exportFolder = this.exportFolders.exportFolder.folderPath;
    var tmpFolder = this.exportFolders.tempFolder.folderPath;
    
    // Create bash command arguments
    var convertGifImages = "find \"" + pngFilesLocation + "\" -name '*.png' -exec sips -s format gif -o \"" + tmpFolder + "\" {}.gif {} \\;";
    var convertGifAnimation = "find \"" + tmpFolder + "\" -name '*.gif' -execdir bash -c '\"" + gifConverter + "\"" + loop + delay + " '*.gif' -o \"" + exportFolder + '/' + gifExportName + '.gif' + "\"' \\;";
    
    // Create GIF Image Sequence from exist PNG images
    convertTask.setLaunchPath("/bin/bash");
    convertTask.setArguments(["-c", convertGifImages]);
    convertTask.launch();
    convertTask.waitUntilExit();
    
    if (convertTask.terminationStatus() != 0) {
        dialog.createBottomMessage(4, 'GIF images conversion failed');
        return;
    }

    // Create GIF animation from converted images
    createTask.setLaunchPath("/bin/bash");
    createTask.setArguments(["-c", convertGifAnimation]);
    createTask.launch();
    createTask.waitUntilExit();
    
    if (createTask.terminationStatus() == 0) {
        dialog.createBottomMessage(3, this.exportFolders.exportFolder.folderPath);
    } else {
        dialog.createBottomMessage(4, 'GIF animation conversion failed');
    }  
};


Animate.prototype.createExportFolders = function () {
    
    var createNewFolder = function (setCustomPath) {
        
        var newFolderPath, uniqueString;
        var fileManager = NSFileManager.defaultManager();
        var returnObj = {};
        
        // Create export path dialog
        if (setCustomPath) {
            newFolderPath = dialog.setExportPath();
            if (newFolderPath == -1) {
                dialog.createBottomMessage(4, 'Export path selection canceled');
                return false;
            }
        } 
        // Temporary directory if custom path is false
        else {
            var tmpPathUrl = NSTemporaryDirectory();
            uniqueString = NSProcessInfo.processInfo().globallyUniqueString();
            newFolderPath = tmpPathUrl.stringByAppendingPathComponent(uniqueString);
            fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(newFolderPath, true, null, null);
        }
        
        returnObj.fileManager = fileManager;
        returnObj.folderPath = newFolderPath;
        
        // Check that export location is valid and show error if not
        if (!returnObj.fileManager.fileExistsAtPath(newFolderPath)) {
            dialog.createDialogMessage(6);
            return null;
        }
        
        return returnObj;
    }
    
    // Update export folders to object properties
    this.exportFolders.exportFolder = createNewFolder(true);
    this.exportFolders.tempFolder = createNewFolder();
};


// ---------------------------------------- //
//                  Helpers                 //
// ---------------------------------------- //


Animate.prototype.searchDuplicateKeyframe = function (layer, searchNumber) {
    for (var i = 0; i < layer.keyframesLength; i++) {
        if (layer.keyframes[i].number == searchNumber) {
            return true;
        }
    }
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