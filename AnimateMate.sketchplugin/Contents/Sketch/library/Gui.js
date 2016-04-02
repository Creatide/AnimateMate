var gui = new Gui();

// ---------------------------------------- //
//             UI Style Settings            //
// ---------------------------------------- //

function Gui () {
    this.defaults = {
        rectX: 0,
        rectY: 0,
        rectW: 300,
        rectH: 25,
        itemMarginX: 6,
        itemMarginY: 5,
        inputHeight: 25,
        labelHeight: 20,
        fontSize: 12,
        fontColor: '#000000',
        groupLabelFontSize: 13,
        groupLabelFontColor: '#969696',
        emptyTitle: 'Title',
        emptyMessage: 'Message',
        emptyLabel: 'Label',
        emptyArrayValues: ['First Item', 'Second Item', 'Third Item'],
        autoIdSplitter: ':'
    }
}


// ---------------------------------------- //
//                 UI Parts                 //
// ---------------------------------------- //

// Alert window base setup
Gui.prototype.makeBaseDialog = function (useCancelBtn, useResetBtn) {
    var alert = COSAlertWindow.new();
    alert.addButtonWithTitle('OK');
    if (useCancelBtn) alert.addButtonWithTitle('Cancel');
    if (useResetBtn) alert.addButtonWithTitle('Reset Defaults');
    return alert;
};

// Label
Gui.prototype.makeLabel = function (text, fontSize, fontColor, bold, frameArray) {
    var text = text || this.defaults.emptyLabel;
    var fontSize = fontSize || this.defaults.fontSize;
    var fontColor = hexToRgb(fontColor);
    var bold = bold || false;
    var frameArray = frameArray || [this.defaults.rectX, this.defaults.rectY, this.defaults.rectW, this.defaults.inputHeight];
    var frame = NSMakeRect(frameArray[0], frameArray[1], frameArray[2], frameArray[3]);
    var label = NSTextField.alloc().initWithFrame(frame);
    label.setStringValue(text);
    label.textColor = NSColor.colorWithDeviceRed_green_blue_alpha_(fontColor[0], fontColor[1], fontColor[2], 1.0);
    label.setFont((bold) ? NSFont.boldSystemFontOfSize(fontSize) : NSFont.systemFontOfSize(fontSize));
    label.setEditable(false);
    label.setSelectable(false);
    label.setDrawsBackground(false);
    label.setBezeled(false);
    return label;
};

// Textbox
Gui.prototype.makeTextbox = function (text, fontSize, bold, selectable, editable, frameArray) {
    var text = text || this.defaults.emptyMessage;
    var fontSize = fontSize || this.defaults.fontSize;
    var bold = bold || false;
    var frameArray = frameArray || [this.defaults.rectX, this.defaults.rectY, this.defaults.rectW, this.defaults.inputHeight];    
    var frame = NSMakeRect(frameArray[0], frameArray[1], frameArray[2], frameArray[3]);
    var textbox = NSTextField.alloc().initWithFrame(frame);
    textbox.setStringValue(text);
    textbox.setFont((bold) ? NSFont.boldSystemFontOfSize(fontSize) : NSFont.systemFontOfSize(fontSize));
    textbox.setEditable(editable);
    textbox.setSelectable(selectable);
    return textbox;
};

// Dropdown
Gui.prototype.makeDropdown = function (valuesArray, frameArray) {
    var valuesArray = valuesArray || this.defaults.emptyArrayValues;
    var frameArray = frameArray || [this.defaults.rectX, this.defaults.rectY, this.defaults.rectW, this.defaults.inputHeight];
    var frame = NSMakeRect(frameArray[0], frameArray[1], frameArray[2], frameArray[3]);
    var combo = NSComboBox.alloc().initWithFrame(frame);
    combo.addItemsWithObjectValues(valuesArray);
    return combo;
};

// Checkbox
Gui.prototype.makeCheckbox = function (text, checked, frameArray) {
    var checked = (checked == false) ? NSOffState : NSOnState;
    var frameArray = frameArray || [this.defaults.rectX, this.defaults.rectY, this.defaults.rectW, this.defaults.inputHeight];
    var frame = NSMakeRect(frameArray[0], frameArray[1], frameArray[2], frameArray[3]);
    var checkbox = NSButton.alloc().initWithFrame(frame);
    checkbox.setTitle(text);
    checkbox.setState(checked);
    checkbox.setButtonType(NSSwitchButton);
    checkbox.setBezelStyle(0);
    return checkbox;
};


// ---------------------------------------- //
//            UI Windows - Simple           //
// ---------------------------------------- //

// Info Message to Bottom of Screen
Gui.prototype.createInfoMessage = function (message) {
    var message = message || this.defaults.emptyMessage;
    utils.doc.showMessage(message);
};

// Basic dialog message
Gui.prototype.createDialogMessage = function (title, message, useCancelBtn, iconName) {
    
    // Make dialog base
    var alert = this.makeBaseDialog(useCancelBtn);
    var title = title || this.defaults.emptyTitle;
    var message = message || this.defaults.emptyMessage;
    if (title) alert.setMessageText(title);
    if (message) alert.setInformativeText(message);
    
    // Set custom icon for window
    if (iconName) {
        var icon = NSImage.alloc().initByReferencingFile(utils.scriptResourcesPath + '/' + iconName);
        alert.setIcon(icon);
    }

    var responseCode = alert.runModal();

    return responseCode;
}

// Create single dropdown dialog
Gui.prototype.createDropdownDialog = function (title, message, valuesArray, defaultIndex, useCancelBtn, iconName) {
    
    // Make dialog base
    var alert = this.makeBaseDialog(useCancelBtn);
    var title = title || this.defaults.emptyTitle;
    var message = message || this.defaults.emptyMessage;
    var valuesArray = valuesArray || this.defaults.emptyArrayValues;
    var defaultIndex = defaultIndex || 0;
    if (title) alert.setMessageText(title);
    if (message) alert.setInformativeText(message);

    var dropdown = this.makeDropdown(valuesArray);
    dropdown.selectItemAtIndex(defaultIndex);
    alert.addAccessoryView(dropdown);
    
    // Set custom icon for window
    if (iconName) {
        var icon = NSImage.alloc().initByReferencingFile(utils.scriptResourcesPath + '/' + iconName);
        alert.setIcon(icon);
    }

    var responseCode = alert.runModal();
    var inputs = [dropdown.indexOfSelectedItem()];

    return [responseCode, inputs];
};


// ---------------------------------------- //
//         UI Windows - Custom Form         //
// ---------------------------------------- //

// Create custom inputs form
Gui.prototype.createCustomForm = function (inputObjectsArray, useCancelBtn, useResetBtn) {

    // Window porperties
    var winObj, winWidth;
    var winHeight = 0;

    // Separate window object from array and update width
    if (inputObjectsArray[0].group == 'window') {
        winObj = inputObjectsArray.shift();
        winWidth = winObj.width || this.defaults.rectW;
    }

    // Create arrays to hold data for later in build dialog
    var groupArray = [];
    var inputCollector = [];

    // GROUP loop
    var objLength = inputObjectsArray.length;
    for (var i = 0; i < objLength; i++) {
        
        // Create label for group if there is custom value other than 'window' or 'group'
        if (inputObjectsArray[i].group.toLowerCase() != 'window' && inputObjectsArray[i].group.toLowerCase() != 'group' && inputObjectsArray[i].group != null && inputObjectsArray[i].group != '') {
            
            var grpLabelFontSize = inputObjectsArray[i].fontSize || this.defaults.groupLabelFontSize;
            var grpLabelFontColor = inputObjectsArray[i].fontColor || this.defaults.groupLabelFontColor;
            var grpLabelFontBold = inputObjectsArray[i].fontBold || false;
            var grpLabelHeight = inputObjectsArray[i].height || this.defaults.rectH;
            var grpLabel = inputObjectsArray[i].uppercase ? inputObjectsArray[i].group.toUpperCase() : inputObjectsArray[i].group;
            
            groupArray.push(this.makeLabel(grpLabel, grpLabelFontSize, grpLabelFontColor, grpLabelFontBold, [0, 0 + this.defaults.itemMarginY, this.defaults.rectW, grpLabelHeight]));
        }        
        
        // Create object to hold data for group
        var newGrp = [];
        var columnsArray = [];
        var groupHeight = 0;

        // Create new group rect
        var refGroup = inputObjectsArray[i];

        // COLUMNS loop
        for (var j = 0; j < refGroup.columns; j++) {

            var itemsArray = [];
            var columnWidth = winWidth / refGroup.columns;
            var columnHeight = 0;

            // Reverse array to get items right order in window
            var refItems = refGroup.items.reverse();

            // ITEMS loop
            for (var k = 0; k < refItems.length; k++) {

                var refItem = refGroup.items[k];

                // Pick only target columns
                if (refItem.column == j) {
                    
                    // Create automatic ID selector for input (group:column:input)
                    var autoInputID = i.toString() + this.defaults.autoIdSplitter + j.toString() + this.defaults.autoIdSplitter + k.toString();

                    // Basic values for item
                    var itemHeight = refItem.height || this.defaults.inputHeight;
                    var fontSize = refItem.fontSize || this.defaults.fontSize;
                    var fontColor = refItem.fontColor || this.defaults.fontColor;
                    var fontBold = refItem.fontBold || false;
                    var fontUppercase = refItem.uppercase || false;
                    var textSelectable = refItem.selectable || true;
                    var textEditable = refItem.editable || true;
                    var labelText = fontUppercase ? refItem.label.toUpperCase() : refItem.label;

                    // Make UI items base them input type
                    switch (refItem.type.toLowerCase()) {

                    case 'label':
                        var newItem = this.makeLabel(refItem.value, fontSize, fontColor, fontBold, [0, columnHeight + this.defaults.itemMarginY, columnWidth - this.defaults.itemMarginX, itemHeight]);
                        // Push item to arrays
                        itemsArray.push(newItem);
                        columnHeight += itemHeight + this.defaults.itemMarginY;
                        break;

                    case 'input':
                        var newItem = NSTextField.alloc().initWithFrame(NSMakeRect(0, columnHeight + this.defaults.itemMarginY, columnWidth - this.defaults.itemMarginX, itemHeight));
                        // Set default value if values exist
                        newItem.setStringValue((refItem.value != null) ? refItem.value : "");
                        // Push item to arrays
                        itemsArray.push(newItem);
                        inputCollector.push({id: autoInputID, item: newItem});
                        columnHeight += itemHeight + this.defaults.itemMarginY;
                        // If label exist
                        if (labelText) {
                            itemsArray.push(this.makeLabel(labelText, fontSize, fontColor, fontBold, [0, columnHeight, columnWidth - this.defaults.itemMarginX, this.defaults.labelHeight]));
                            columnHeight += this.defaults.labelHeight;
                        }
                        break;
                            
                    case 'textbox':
                            var newItem = this.makeTextbox(refItem.value, fontSize, fontBold, textSelectable, textEditable, [0, columnHeight + this.defaults.itemMarginY, columnWidth - this.defaults.itemMarginX, itemHeight]);
                        // Push item to arrays
                        itemsArray.push(newItem);
                        inputCollector.push({id: autoInputID, item: newItem});
                        columnHeight += itemHeight + this.defaults.itemMarginY;
                        // If label exist
                        if (labelText) {
                            itemsArray.push(this.makeLabel(labelText, fontSize, fontColor, fontBold, [0, columnHeight, columnWidth - this.defaults.itemMarginX, this.defaults.labelHeight]));
                            columnHeight += this.defaults.labelHeight;
                        }
                        break;

                    case 'dropdown':
                        var defaultIndex = refItem.default || 0;
                        var newItem = this.makeDropdown(refItem.value, [0, columnHeight + this.defaults.itemMarginY, columnWidth - this.defaults.itemMarginX, itemHeight]);
                        // Set default index value to item
                        newItem.selectItemAtIndex(defaultIndex);
                        // Push item to arrays
                        itemsArray.push(newItem);
                        inputCollector.push({id: autoInputID, item: newItem});
                        columnHeight += itemHeight + this.defaults.itemMarginY;
                        // If label exist
                        if (labelText) {
                            itemsArray.push(this.makeLabel(labelText, fontSize, fontColor, fontBold, [0, columnHeight, columnWidth - this.defaults.itemMarginX, this.defaults.labelHeight]));
                            columnHeight += this.defaults.labelHeight;
                        }
                        break;

                    case 'checkbox':
                        var checkedState = refItem.checked || false;
                        var newItem = this.makeCheckbox(refItem.value, checkedState, [0, columnHeight + this.defaults.itemMarginY, columnWidth - this.defaults.itemMarginX, itemHeight]);
                        // Push item to arrays
                        itemsArray.push(newItem);
                        inputCollector.push({id: autoInputID, item: newItem});
                        columnHeight += itemHeight + this.defaults.itemMarginY;
                        // If label exist
                            if (labelText) {
                                itemsArray.push(this.makeLabel(labelText, fontSize, fontColor, fontBold, [0, columnHeight, columnWidth - this.defaults.itemMarginX, this.defaults.labelHeight]));
                            columnHeight += this.defaults.labelHeight;
                        }
                        break;

                    }
                }
            }

            // Push column rect to array stack before join items to it
            var newColumn = NSView.alloc().initWithFrame(NSMakeRect(columnWidth * j, 0, columnWidth, columnHeight));

            // Get highest columns height for group height
            groupHeight = groupHeight < columnHeight ? columnHeight : groupHeight;

            // Make subviews for column from items
            for (var l = 0; l < itemsArray.length; l++) {
                newColumn.addSubview(itemsArray[l]);
            }

            // Push column to array for later use in groups
            columnsArray.push(newColumn);
        }

        // Create new group
        var newGroup = NSView.alloc().initWithFrame(NSMakeRect(0, winHeight, this.defaults.rectW, groupHeight));

        // Make subviews for group from columns
        for (var m = 0; m < columnsArray.length; m++) {
            newGroup.addSubview(columnsArray[m]);
        }

        // Push new group to array for later use in main dialog
        groupArray.push(newGroup);

        // Update window size value
        winHeight += groupHeight;
    }

    // Make dialog base
    var alert = this.makeBaseDialog(useCancelBtn, useResetBtn);
    var title = winObj.title || this.defaults.emptyTitle;
    var message = winObj.description || this.defaults.emptyMessage;
    var iconName = winObj.icon || false;
    if (title) alert.setMessageText(title);
    if (message) alert.setInformativeText(message);
    
    // Set custom icon for window
    if (iconName) {
        var icon = NSImage.alloc().initByReferencingFile(utils.scriptResourcesPath + '/' + iconName);
        alert.setIcon(icon);
    }

    // Loop all groups and drop those in order to window
    for (var i = 0; i < groupArray.length; i++) {
        alert.addAccessoryView(groupArray[i]);
    }

    // Get return code and call window
    var responseCode = alert.runModal();

    // Generate inputs to readable return objects with answers
    for (var n = 0; n < inputCollector.length; n++) {
        inputCollector[n].value = inputCollector[n].item.stringValue();
    }

    return [responseCode, inputCollector];
};


// ---------------------------------------- //
//                  Helpers                 //
// ---------------------------------------- //

// Convert hex values to RGB values in range of 0-1
function hexToRgb(hex, returnStringVal) {
    var hex = hex.replace('#', '');
    var returnStringVal = returnStringVal || false;
    var bigint = parseInt(hex, 16);
    var r = +(1 / 255 * ((bigint >> 16) & 255)).toFixed(2);
    var g = +(1 / 255 * ((bigint >> 8) & 255)).toFixed(2);
    var b = +(1 / 255 * (bigint & 255)).toFixed(2);
    return returnStringVal ? [r, g, b].join() : [r, g, b];
}

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