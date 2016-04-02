@import 'library/Gui.js';

var dialog = new Dialog();
function Dialog () {}

// ---------------------------------------- //
//              Command Dialogs             //
// ---------------------------------------- //

// EXPORT ANIMATION / RENDER ANIMATION
// "shortcut": "ctrl option cmd a"
Dialog.prototype.exportAnimation = function () {

    var elements = [
        {
            group: 'window',
            title: 'Export Animation',
            description: 'Export selected item(s) to animation. If there is nothing selected everything that have animation in current artboard is included the final animation export.',
            icon: 'icon.icns',
            reset: true
        },
        {
            group: 'Export Settings',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'exportGif',
                    type: 'checkbox',
                    value: 'GIF Animation',
                    checked: false,
                    column: 0
                },
                {
                    defaultId: 'exportPng',
                    type: 'checkbox',
                    value: 'PNG Sequence',
                    checked: true,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 1,
            items: [
                {
                    type: 'input',
                    value: animate.exportName,
                    label: 'Export Base Name',
                    column: 0
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    type: 'input',
                    label: 'Start Frame',
                    value: 0,
                    column: 0
                },
                {
                    type: 'input',
                    label: 'End Frame',
                    value: animate.endFrameNumber,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 1,
            items: [
                {
                    defaultId: 'exportAnchorPoint',
                    default: 0,
                    type: 'dropdown',
                    label: 'Anchor Point',
                    value: animate.referencePoints,
                    column: 0
                }
            ]
        },
        {
            group: 'GIF Settings',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'exportGifDelay',
                    type: 'input',
                    label: 'GIF Delay',
                    value: 3,
                    column: 0
                },
                {
                    defaultId: 'exportGifLoop',
                    type: 'checkbox',
                    label: 'GIF Loop',
                    value: 'Enable Loop',
                    checked: true,
                    column: 1
                }
            ]
        },
        {
            group: 'Selection Info',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    type: 'label',
                    value: 'Active Selection',
                    height: 16,
                    column: 0
                },
                {
                    type: 'label',
                    value: utils.allLayersActive ? 'All layers selected' : utils.selection.count() + ' layers selected',
                    fontBold: true,
                    height: 16,
                    fontColor: utils.selection.count() > 0 ? '#ff0000' : '#00aaff',
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    type: 'label',
                    value: 'Animation Length',
                    height: 16,
                    column: 0
                },
                {
                    type: 'label',
                    value: animate.endFrameNumber + ' frames',
                    fontBold: true,
                    height: 16,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    type: 'label',
                    value: 'Animated Layers',
                    height: 16,
                    column: 0
                },
                {
                    type: 'label',
                    value: animate.animationLayers.length + ' layers',
                    fontBold: true,
                    height: 16,
                    column: 1
                }
            ]
        }
    ];

    // Warn user if nothing or artboard is selected
    var selectedAnswer = 1000;
    if (!utils.allLayersActive) {
        selectedAnswer = dialog.createDialogMessage(5);
    }

    if (selectedAnswer == 1000) {

        // Load default values before create dialog window
        var elementsDefaults = dialog.defaultValues(elements);

        var response = gui.createCustomForm(elements, true, true);
        
        if (response[0] == 1000) {

            // Save new default values
            dialog.defaultValues(elements, response[1]);

            animate.exportAnimation(response[1][2].value, response[1][0].value, response[1][1].value, response[1][3].value, response[1][4].value, response[1][5].value, response[1][6].value, response[1][7].value);
        } else if (response[0] == 1002) {
            dialog.defaultValues(elements, undefined, elementsDefaults[1]);
        }
    }
};

// CREATE ANIMATION / CREATE NEW KEYFRAME
// "shortcut": "ctrl option cmd k"
Dialog.prototype.createAnimation = function () {

    // Add random easing to easing array dropdown list
    animate.easingTypes.push('Random Easing');

    var elements = [
        {
            group: 'window',
            title: 'Create New Animation(s)',
            description: 'Select "Easing Type" and set "Keyframe number". Easing type only setted for the first time when creating animation to layer.',
            icon: 'icon.icns'
        },
        {
            group: 'Animation Values',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'createKfNumber',
                    type: 'input',
                    label: 'Keyframe Number',
                    value: 0,
                    column: 0
                },
                {
                    defaultId: 'createEasingType',
                    type: 'dropdown',
                    default: 0,
                    value: animate.easingTypes,
                    label: 'Easing Type',
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 1,
            items: [
                {
                    defaultId: 'createChangeEasingType',
                    type: 'checkbox',
                    value: 'Change Easing Type',
                    checked: false,
                    column: 0
                }
            ]
        }
    ];

    // Warn user if nothing or artboard is selected 
    if (utils.allLayersActive) {
        dialog.createDialogMessage(4);
        return false;
    } else {
        
        // Load default values before create dialog window
        var elementsDefaults = dialog.defaultValues(elements);

        var response = gui.createCustomForm(elements, true, true);

        // Remove extra easing type (Random Easing) from array that was made for dialog
        animate.easingTypes.pop();

        if (response[0] == 1000){

            // Save new default values
            dialog.defaultValues(elements, response[1]);
            
            animate.createAnimation(response[1][1].value, response[1][0].value, response[1][2].value);
        }
        else if (response[0] == 1002) {
            dialog.defaultValues(elements, undefined, elementsDefaults[1]);
        }
    }
};

// REMOVE ANIMATION
// "shortcut": "ctrl option cmd d"
Dialog.prototype.removeAnimation = function () {

    var elements = [
        {
            group: 'window',
            title: 'Remove All Animations',
            description: 'You not have anything selected. This remove all animations from current artboard. Do you want to remove all animations?',
            icon: 'icon.icns'
        }
    ];

    var removeAll = false;
    var response;

    if (utils.artboard && utils.selection.count()) {
        response = [1000];
    } else {
        removeAll = true;
        response = gui.createCustomForm(elements, true)
    }

    if (response[0] == 1000) animate.removeAnimation(removeAll);
    //log(response)
};

// EDIT ANIMATION
// "shortcut": "ctrl option cmd l"
Dialog.prototype.editAnimation = function () {

    // Warn user about no animation and stop editing
    if (animate.animationLayers.length == 0) {
        dialog.createDialogMessage(3);
        return false;
    } else {
        // Build JSON string for edit textbox and remove firs/last marks and whitespace
        var jsonData = JSON.stringify(animate.animationLayers[0].keyframes, null, ' ').slice(2, -2).replace(/ /g, '');
    }

    var elements = [
        {
            group: 'window',
            title: 'Edit Animation',
            description: 'Edit animation values through panel by setting custom values to chosen frame. You can edit only one animation at the time.',
            icon: 'icon.icns'
        },
        {
            group: 'Layer Base Name',
            columns: 1,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    type: 'input',
                    value: animate.animationLayers[0].layerBaseName,
                    column: 0
                }
            ]
        },
        {
            group: 'Animation Values',
            columns: 1,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    type: 'textbox',
                    value: jsonData,
                    height: 400,
                    column: 0
                }
            ]
        }
    ];

    // Warn user if there is more than one layer selected 
    if (utils.selection.count() > 1 || utils.allLayersActive) {
        dialog.createDialogMessage(8);
        return false;
    }

    var response = gui.createCustomForm(elements, true);
    if (response[0] == 1000) animate.editAnimation(response[1][0].value, response[1][1].value);
};

// OFFSET ANIMATION
// "shortcut": "ctrl option cmd o"
Dialog.prototype.offsetAnimation = function () {

    var elements = [
        {
            group: 'window',
            title: 'Offset Animation(s)',
            description: 'Offset selected animations by custom values.',
            icon: 'icon.icns'
        },
        {
            group: 'Offset Type',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'offsetOffsetType',
                    type: 'dropdown',
                    default: 0,
                    value: ['Normal', 'Stepped (Layer)', 'Stepped (Selection)'],
                    label: 'Offset Type',
                    column: 0
                },
                {
                    defaultId: 'offsetStepSize',
                    type: 'input',
                    label: 'Step Size',
                    value: 0,
                    column: 1
                }
            ]
        },
        {
            group: 'Keyframes',
            columns: 1,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'offsetOffsetKfNumbers',
                    type: 'input',
                    label: 'Offset Keyframe Numbers',
                    value: 0,
                    column: 0
                }
            ]
        },
        {
            group: 'Offset Values',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'offsetPosX',
                    type: 'input',
                    label: 'Position X',
                    value: 0,
                    column: 0
                },
                {
                    defaultId: 'offsetPosY',
                    type: 'input',
                    label: 'Position Y',
                    value: 0,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'offsetWidth',
                    type: 'input',
                    label: 'Width',
                    value: 0,
                    column: 0
                },
                {
                    defaultId: 'offsetHeight',
                    type: 'input',
                    label: 'Height',
                    value: 0,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'offsetRotation',
                    type: 'input',
                    label: 'Rotation (º)',
                    value: 0,
                    column: 0
                },
                {
                    defaultId: 'offsetOpacity',
                    type: 'input',
                    label: 'Opacity',
                    value: 0,
                    column: 1
                }
            ]
        }
    ];
    
    // Load default values before create dialog window
    var elementsDefaults = dialog.defaultValues(elements);
    
    var response = gui.createCustomForm(elements, true, true);
    var offsetType = response[1][0].value;
    var stepSize = response[1][1].value;
    var responseValuesObj = {
        number: response[1][2].value,
        x: response[1][3].value,
        y: response[1][4].value,
        width: response[1][5].value,
        height: response[1][6].value,
        rotation: response[1][7].value,
        opacity: response[1][8].value,
    }
    
    // Remove periods from input values
    utils.objRemovePropertyCharacter(responseValuesObj, ',');

    if (response[0] == 1000) {
        
        // Save new default values
        dialog.defaultValues(elements, response[1]);
        
        animate.offsetAnimation(offsetType, stepSize, responseValuesObj);
    } 
    else if (response[0] == 1002) {
        dialog.defaultValues(elements, undefined, elementsDefaults[1]);
    }
};


// RESTORE KEYFRAME TO ITEM
// "shortcut": "ctrl option cmd r"
Dialog.prototype.returnKeyframe = function () {

    var elements = [
        {
            group: 'window',
            title: 'Restore Keyframe to Item',
            description: 'This will restore selected keyframe values to item. This is good for checking visually item states in different keyframes. This feature is also pretty useful with using custom states and jumping between those.',
            icon: 'icon.icns'
        },
        {
            group: 'Keyframe Number',
            columns: 1,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    type: 'dropdown',
                    default: 0,
                    value: animate.keyframeNumbers,
                    column: 0
                }
            ]
        }
    ];

    // Warn if there is no animation in selected
    if (animate.animationLayers.length == 0) {
        dialog.createDialogMessage(3);
        return false;
    }

    // Warn user if there is more than one layer selected 
    if (utils.selection.count() > 1 || utils.allLayersActive) {
        dialog.createDialogMessage(10);
    }

    var response = gui.createCustomForm(elements, true);
    if (response[0] == 1000) animate.returnKeyframe(response[1][0].value);

    //log(response)
};


// RANDOM ANIMATION
// "shortcut": "ctrl option cmd g"
Dialog.prototype.randomAnimation = function () {

    // Add random easing to easing array dropdown list
    animate.easingTypes.unshift('Random Easing');

    var elements = [
        {
            group: 'window',
            title: 'Random Animation',
            description: 'Generate random animation to selected layers by custom values.',
            icon: 'icon.icns'
        },
        {
            group: 'Animation',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'randomAnimationLength',
                    type: 'input',
                    label: 'Animation Length',
                    value: 30,
                    column: 0
                },
                {
                    defaultId: 'randomKfSpacing',
                    type: 'input',
                    label: 'Keyframe Spacing',
                    value: 10,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'randomEasingType',
                    type: 'dropdown',
                    default: 0,
                    value: animate.easingTypes,
                    label: 'Easing Type',
                    column: 0
                },
                {
                    defaultId: 'randomLoopAnimation',
                    type: 'checkbox',
                    label: 'Looping',
                    value: 'Loop Animation',
                    checked: false,
                    column: 1
                }
            ]
        },
        {
            group: 'Position',
            columns: 4,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'randomPosMinX',
                    type: 'input',
                    label: 'Min X',
                    value: 0,
                    column: 0
                },
                {
                    defaultId: 'randomPosMaxX',
                    type: 'input',
                    label: 'Max X',
                    value: utils.artboardSize.width,
                    column: 1
                },
                {
                    defaultId: 'randomPosMinY',
                    type: 'input',
                    label: 'Min Y',
                    value: 0,
                    column: 2
                },
                {
                    defaultId: 'randomPosMaxY',
                    type: 'input',
                    label: 'Max Y',
                    value: utils.artboardSize.height,
                    column: 3
                }
            ]
        },
        {
            group: 'group',
            columns: 3,
            items: [
                {
                    defaultId: 'randomPosDisableX',
                    type: 'checkbox',
                    value: 'Disable X',
                    checked: false,
                    column: 0
                },
                {
                    defaultId: 'randomPosDisableY',
                    type: 'checkbox',
                    value: 'Disable Y',
                    checked: false,
                    column: 1
                },
                {
                    defaultId: 'randomPosAdditive',
                    type: 'checkbox',
                    value: 'Additive',
                    checked: false,
                    column: 2
                }
            ]
        },
        {
            group: 'Scale',
            columns: 4,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'randomScaleMinX',
                    type: 'input',
                    label: 'Min Width',
                    value: 100,
                    column: 0
                },
                {
                    defaultId: 'randomScaleMaxX',
                    type: 'input',
                    label: 'Max Width',
                    value: 120,
                    column: 1
                },
                {
                    defaultId: 'randomScaleMinY',
                    type: 'input',
                    label: 'Min Height',
                    value: 100,
                    column: 2
                },
                {
                    defaultId: 'randomScaleMaxY',
                    type: 'input',
                    label: 'Max Height',
                    value: 120,
                    column: 3
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'randomScaleDisableX',
                    type: 'checkbox',
                    value: 'Disable Width',
                    checked: true,
                    column: 0
                },
                {
                    defaultId: 'randomScaleDisableY',
                    type: 'checkbox',
                    value: 'Disable Height',
                    checked: true,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'randomScaleKeepAspect',
                    type: 'checkbox',
                    value: 'Keep Aspect Ratio',
                    checked: false,
                    column: 0
                },
                {
                    defaultId: 'randomScaleAdditive',
                    type: 'checkbox',
                    value: 'Additive',
                    checked: false,
                    column: 1
                }
            ]
        },
        {
            group: 'Rotation',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'randomRotMinRot',
                    type: 'input',
                    label: 'Min Rotation',
                    value: 0,
                    column: 0
                },
                {
                    defaultId: 'randomRotMaxRot',
                    type: 'input',
                    label: 'Max Rotation',
                    value: 90,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'randomRotDisableRot',
                    type: 'checkbox',
                    value: 'Disable Rotation',
                    checked: true,
                    column: 0
                },
                {
                    defaultId: 'randomRotAdditive',
                    type: 'checkbox',
                    value: 'Additive',
                    checked: false,
                    column: 1
                }
            ]
        },
        {
            group: 'Opacity',
            columns: 2,
            fontSize: 10,
            fontBold: true,
            uppercase: true,
            height: 15,
            items: [
                {
                    defaultId: 'randomOpacityMinOpacity',
                    type: 'input',
                    label: 'Min Opacity',
                    value: 1,
                    column: 0
                },
                {
                    defaultId: 'randomOpacityMaxOpacity',
                    type: 'input',
                    label: 'Max Opacity',
                    value: 1,
                    column: 1
                }
            ]
        },
        {
            group: 'group',
            columns: 2,
            items: [
                {
                    defaultId: 'randomOpacityDisableOpacity',
                    type: 'checkbox',
                    value: 'Disable Opacity',
                    checked: true,
                    column: 0
                },
                {
                    defaultId: 'randomOpacityAdditive',
                    type: 'checkbox',
                    value: 'Additive',
                    checked: false,
                    column: 1
                }
            ]
        }
    ];

    // Load default values before create dialog window
    var elementsDefaults = dialog.defaultValues(elements);
    
    var response = gui.createCustomForm(elements, true, true);
    var responseValuesObj = {
        animationLength: response[1][0].value,
        keyframeSpacing: response[1][1].value,
        easingType: response[1][2].value,
        animationLoop: response[1][3].value,
        xMin: response[1][4].value,
        xMax: response[1][5].value,
        yMin: response[1][6].value,
        yMax: response[1][7].value,
        xDisable: response[1][8].value,
        yDisable: response[1][9].value,
        xAdditive: response[1][10].value,
        yAdditive: response[1][10].value,
        widthMin: response[1][11].value,
        widthMax: response[1][12].value,
        heightMin: response[1][13].value,
        heightMax: response[1][14].value,
        widthDisable: response[1][15].value,
        heightDisable: response[1][16].value,
        scaleRatio: response[1][17].value,
        widthAdditive: response[1][18].value,
        heightAdditive: response[1][18].value,
        rotationMin: response[1][19].value,
        rotationMax: response[1][20].value,
        rotationDisable: response[1][21].value,
        rotationAdditive: response[1][22].value,
        opacityMin: response[1][23].value,
        opacityMax: response[1][24].value,
        opacityDisable: response[1][25].value,
        opacityAdditive: response[1][26].value
    }
    
    // Remove periods from input values
    utils.objRemovePropertyCharacter(responseValuesObj, ',');

    // Remove extra easing type (Random Easing) from array that was made for dialog
    animate.easingTypes.shift();

    if (response[0] == 1000) {

        // Save new default values
        dialog.defaultValues(elements, response[1]);
        animate.randomAnimation(responseValuesObj);
    } 
    else if (response[0] == 1002) {
        dialog.defaultValues(elements, undefined, elementsDefaults[1]);
    }
        
};


// ---------------------------------------- //
//          Remember Dialog Values          //
// ---------------------------------------- //

// Got this idea from: https://github.com/abynim/SketchPlugin-Remember
// Thanks: @abynim
// Used in dialogs: Export, Create, Offset, Random

Dialog.prototype.defaultValues = function (elements, responseValues, resetDefaults) {

    var uiDefaults = {};
    var userDefaults = {};
    var storedDefaults = {};

    // Get / Update stored default values to memory
    function getStoredDefaults(initialValues) {

        var refPluginDomain = utils.pluginDomain;
        var defaults = [[NSUserDefaults standardUserDefaults] objectForKey: refPluginDomain];
        var defaultValues = {};
        var defaulVal;

        for (var key in defaults) {
            defaultValues[key] = defaults[key];
        }

        for (var key in initialValues) {
            defaulVal = defaultValues[key];
            if (defaulVal == null) defaultValues[key] = initialValues[key];
        }

        storedDefaults = defaultValues;
    }

    // Save new default values to memory
    function saveDefaults(newValues) {

        var refPluginDomain = utils.pluginDomain;

        if (refPluginDomain) {

            var defaults = [[NSUserDefaults standardUserDefaults] objectForKey: refPluginDomain];
            var defaultValues = {};
            var defaulVal;

            for (var key in defaults) {
                defaultValues[key] = defaults[key];
            }

            for (var key in newValues) {
                defaulVal = defaultValues[key];
                if (defaulVal != newValues[key]) {
                    defaultValues[key] = newValues[key];
                }
            }

            // Replace defaults with ne object
            var defaultsRef = [NSUserDefaults standardUserDefaults];
            [defaultsRef setObject: defaultValues forKey: refPluginDomain];

            storedDefaults = defaults;
        }
    }

    // Collect values for UI and USER defined presets
    function getDefaultPresets() {

        var foundObjectsArr = utils.findObjByProperty(elements, 'defaultId', 'items', true);

        // Search pairs from submitted values and default values
        function searchMatchResponseValues(tmpId) {
            for (var i = 0; i < responseValues.length; i++) {
                var refObjId = tmpId.join('');
                var responseId = (responseValues[i]['id'].split(':')).slice(0, -1).join('');
                if (refObjId == responseId) return responseValues[i].value;
            }
        }

        // Update default values to objects
        for (var obj in foundObjectsArr) {

            var refObj = foundObjectsArr[obj];

            switch (refObj.type) {
                case 'input':
                    uiDefaults[refObj.defaultId] = refObj.value;
                    if (responseValues) userDefaults[refObj.defaultId] = searchMatchResponseValues(refObj.searchId);
                    break;
                case 'checkbox':
                    uiDefaults[refObj.defaultId] = refObj.checked;
                    if (responseValues) userDefaults[refObj.defaultId] = searchMatchResponseValues(refObj.searchId);
                    break;
                case 'dropdown':
                    uiDefaults[refObj.defaultId] = refObj.value[refObj.default];
                    //uiDefaults[refObj.defaultId] = refObj.default;
                    if (responseValues) userDefaults[refObj.defaultId] = searchMatchResponseValues(refObj.searchId);
                    break;
            }
        }

        // Initialize stored defaults
        getStoredDefaults(uiDefaults);

        // Save new values / Reset values
        if (resetDefaults) {
            saveDefaults(resetDefaults);
        } else if (responseValues) { 
            saveDefaults(userDefaults);
        }
    }

    // Replace object property values with other object property values if there's same property names
    function updateElements (origObj, newValObj) {

        var refObj = origObj;

        function getObject(refObj) {
            if (refObj instanceof Array) {
                for (var i = 0; i < refObj.length; i++) {
                    getObject(refObj[i]);
                }
            } else {
                for (var oldProp in refObj) {
                    if (refObj[oldProp] instanceof Array) {
                        for (var i = 0; i < refObj[oldProp].length; i++) {
                            getObject(refObj[oldProp][i]);
                        }
                    }
                    for (var newProp in newValObj) {
                        if (refObj[oldProp] == newProp) {                            
                            switch (refObj.type) {
                                case 'input':
                                    refObj.value = newValObj[newProp];
                                    break;
                                case 'checkbox':
                                    refObj.checked = newValObj[newProp];
                                    break;
                                case 'dropdown':
                                    //log(refObj.value[refObj.default] + "  " + newValObj[newProp])
                                    var newDropdownIndex = utils.searchArrayIndex(refObj.value, newValObj[newProp]);
                                    refObj.default = newDropdownIndex;
                                    break;
                            }
                        }
                    }
                }
            }
        }
        getObject(refObj);
        return refObj;
    }

    getDefaultPresets();
    // Return array 1: updated elements 2: original element defaults
    return [updateElements(elements, storedDefaults), uiDefaults];
};


// ---------------------------------------- //
//               Export Path                //
// ---------------------------------------- //


Dialog.prototype.setExportPath = function () {

    var openDialog = NSOpenPanel.openPanel();

    openDialog.setCanChooseDirectories(true);
    openDialog.setCanChooseFiles(false);
    openDialog.setAllowsMultipleSelection(false);
    openDialog.setCanCreateDirectories(true);
    //openDialog.showsResizeIndicator();
    //openDialog.showsHiddenFiles();
    //openDialog.setAllowedFileTypes(["gif, png"]);
    openDialog.setTitle('Export');
    openDialog.setMessage('Export Animation to Folder');
    openDialog.setPrompt('Select Folder');

    if (openDialog.runModal() == NSOKButton) {
        return openDialog.URL().path();
    } else {
        return -1;
    }
};


// ---------------------------------------- //
//                  Messages                //
// ---------------------------------------- //

// Pop-up dialog messages
Dialog.prototype.createDialogMessage = function (messageId, optionalMessage) {

    switch (messageId) {

    case 1:
        gui.createDialogMessage("Alert", "You do not have any artboard active. Active one artboard to continue.", false, 'icon.icns');
        break;

    case 2:
        gui.createDialogMessage("Error", "There was an error in animation data string in layer name. Every animation have keyframes and those contains as many values. If you have edited animation keyframes manually this can lead errors if there is not all values in place.", false, 'icon.icns');
        break;

    case 3:
        gui.createDialogMessage("Info", "There is no any animations in selected layers or document. Create new animation or select layer or artboard that have animations", false, 'icon.icns');
        break;

    case 4:
        gui.createDialogMessage("Alert", "You not have anything selected or artboard is selected. Select layer or group to make new animation.", false, 'icon.icns');
        break;

    case 5:
        return gui.createDialogMessage("Export Specific Layer(s)", "You have selected individual layer(s) to export. This will export only selected layers animations and others will be static. Deselect all or select artboard to export all animations.", true, 'icon.icns');
        break;

    case 6:
        gui.createDialogMessage("Export Location Error", "There is problem with export location. Please try again and select proper folder to export animation.", false, 'icon.icns');
        break;

    case 7:
        return gui.createDialogMessage("Overwrite", "There is already keyframe in number " + optionalMessage + ".\nDo you want to overwrite exist keyframe?", true, 'icon.icns');
        break;

    case 8:
        gui.createDialogMessage("Select Only One", "You've selected multiple layers or animations. You can use this function only with one animation at the time. Select one layer with animation and try again.", false, 'icon.icns');
        break;

    case 9:
        gui.createDialogMessage("Data Failure", "There was an error in data conversion process. You've wrong parameters or missing values in input text. Please try again.", false, 'icon.icns');
        break;

    case 10:
        gui.createDialogMessage("Multiple Item Selected", "You've selected multiple layers or animations. All available keyframes will be shown but only items with same keyframe numbers will be affected.", false, 'icon.icns');
        break;

    case 11:
        gui.createDialogMessage("Export Failed", "Export process failed.", false, 'icon.icns');
        break;
    }
};


// Bottom show text only messages
Dialog.prototype.createBottomMessage = function (messageId, optionalMessage) {

    switch (messageId) {

    case 1:
        gui.createInfoMessage("Rendering Images. (" + optionalMessage + ")");
        log(utils.scriptName + " rendering process started...");
        break;

    case 2:
        gui.createInfoMessage("Rendering complete in time: " + optionalMessage);
        log(utils.scriptName + " export process complete (" + optionalMessage + ")");
        break;

    case 3:
        gui.createInfoMessage("Animated GIF created succesfully to: " + optionalMessage);
        log(utils.scriptName + " created animated GIF succesfully (" + optionalMessage + ")");
        break;

    case 4:
        gui.createInfoMessage("Process Failed. (" + optionalMessage + ")");
        log(utils.scriptName + " Process Failed (" + optionalMessage + ")");
        break;
    }
};

// Log messages
Dialog.prototype.createLogMessage = function (messageId, optionalMessage) {

    switch (messageId) {

    case 1:
        log(utils.scriptName + " frame " + optionalMessage[0] + " done in " + optionalMessage[1][0] + " (Total: " + optionalMessage[1][1] + ")");
        break;

    case 2:
        log(utils.scriptName + " starting GIF conversion process. It could take long time to complete. GIF file flickering while processing, so do not panic!");
        break;
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