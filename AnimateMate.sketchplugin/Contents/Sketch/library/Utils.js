@import 'library/easing.js';
@import 'library/Animate.js';

var utils = new Utils();

function Utils () {
    // General values
    this.scriptName = 'AnimateMate';
    this.scriptPath = null;
    this.scriptPathRoot = null;
    this.scriptResourcesPath = null;
    this.scriptLibraryPath = null,
    this.scriptURL = null;
    this.doc = null;
    this.page = null;
    this.artboard = null;
    this.selection = null;
    this.layers = null;
    this.layersCount = 0;
    this.answerBtn = [1000, false];
}

Utils.prototype.init = function (context, loopNestedGroups, forceContinue) {
    
    this.scriptPath = context.scriptPath;
    this.scriptPathRoot = this.scriptPath.stringByDeletingLastPathComponent();
    this.scriptResourcesPath = this.scriptPathRoot.stringByDeletingLastPathComponent() + '/Resources';
    this.scriptLibraryPath = this.scriptPathRoot + '/library';
    this.scriptURL = context.scriptURL;
    this.doc = context.document;
    this.selection = context.selection;
    this.page = this.doc.currentPage();
    this.artboard = this.page.currentArtboard();
    this.allLayersActive = false;

    if (this.artboard) {

        // Set artboard name
        this.artboardName = this.artboard.name();
        
        // Get artboard rect for size
        this.artboardRect = this.artboard.rect();
        this.artboardSize = {
            width: this.artboardRect.size.width,
            height: this.artboardRect.size.height
        };

        if (this.selection.count() > 0) {
            this.layers = this.selection;
            // If artboard is selected use all layers from that
            if (this.selection.firstObject().isMemberOfClass(MSArtboardGroup)) {
                this.layers = this.artboard.layers();
                this.allLayersActive = true;
            }
        }
        // If nothing is selected use all layers from artboard
        else {
            this.layers = this.artboard.layers();
            this.allLayersActive = true;
        }

        // Update layers count number
        this.layersCount = this.layers.count();
        
        // Init main animate object
        animate.init(this.layers, loopNestedGroups);
        
        // Force continue to return true even there is no animation layers or all layers is selected
        if (forceContinue) return true;

        // Initialize animation layers in conditional and check if there is all layers active
        if (!animate && this.allLayersActive) {
            dialog.createDialogMessage(3);
            return false;
        }

        return true;

    } else {
        // No artboard selected warning
        dialog.createDialogMessage(1);
        return false;
    }
};


// ---------------------------------------- //
//                  Helpers                 //
// ---------------------------------------- //

Utils.prototype.getRandomFloat = function (min, max, round) {
    var round = round || true,
        randomNum = Math.random() * (max - min) + min;
    if (round) randomNum = Math.round(randomNum * 100) / 100;
    return randomNum;
};

Utils.prototype.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Utils.prototype.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

Utils.prototype.allNumbers = function (arr) {
    for (i in arr) {
        if (utils.isNumeric(arr[i])) return true;
    }
    return false;
};

Utils.prototype.arrayNext = function (arr, i) {
    return arr[++i];
};

Utils.prototype.arrayPrev = function (arr, i) {
    return arr[--i];
};

Utils.prototype.zeroPadding = function (num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

// http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
Utils.prototype.cloneObj = function (obj) {
    var target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
};

// http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
Utils.prototype.sortBy = function (field, reverse, primer) {

    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
};

// http://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
Utils.prototype.sortByMulti = function () {
    var fields = [].slice.call(arguments),
        n_fields = fields.length;

    return function (A, B) {
        var a, b, field, key, primer, reverse, result, i;

        for (i = 0; i < n_fields; i++) {
            result = 0;
            field = fields[i];

            key = typeof field === 'string' ? field : field.name;

            a = A[key];
            b = B[key];

            if (typeof field.primer !== 'undefined') {
                a = field.primer(a);
                b = field.primer(b);
            }

            reverse = (field.reverse) ? -1 : 1;

            if (a < b) result = reverse * -1;
            if (a > b) result = reverse * 1;
            if (result !== 0) break;
        }
        return result;
    }
};

// http://stackoverflow.com/questions/7364150/find-object-by-id-in-array-of-javascript-objects
Utils.prototype.searchObjectArrayIndex = function (array, key, value) {
    var arrayLength = array.length;
    for (var i = 0; i < arrayLength; i++) {
        if (array[i][key] == value) return i;
    }
    return null;
};

// http://stackoverflow.com/questions/5612787/converting-an-object-to-a-string
Utils.prototype.objToString = function (obj, incPropertyName) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (incPropertyName) str += p + ':';
            str += obj[p] + ',';
        }
    }
    str = str.slice(0, -1);
    return str;
};


// http://stackoverflow.com/questions/8072323/best-way-to-prevent-handle-divide-by-0-in-javascript
Utils.prototype.notZero = function (n) {
    n = +n;
    if (!n) {
        n = 0;
    }
    return n;
};


// Convert all values to float and round by two decimals
Utils.prototype.objValuesToFloat = function (obj) {
    for (var p in obj) {
        try {
            obj[p] = Math.round(parseFloat(obj[p]) * 100) / 100;
        } catch (e) {
            log(e);
        }
    }
};


Utils.prototype.uniqueNumber = function (a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
};


// http://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
Utils.prototype.getAspectRatio = function (srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
};


Utils.prototype.formatTime = function (ms) {    
    var days, hours, minutes, seconds, milliseconds;
    milliseconds = Math.floor((ms / 10) % 100);
    seconds = Math.floor(((ms / 1000) % 60));
    minutes = Math.floor((((ms / 1000) / 60) % 60));
    hours = Math.floor(((((ms / 1000) / 60) / 60) % 24));

    if (hours < 10) { hours   = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if (milliseconds < 10) { milliseconds = "0" + milliseconds; }
    var time = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
    return time;
};


// ---------------------------------------- //
//                   Debug                  //
// ---------------------------------------- //


Utils.prototype.logObjProperties = function (obj) {
    for (var p in obj) {
        log(p + ": " + obj[p] );
    }
};


Utils.prototype.benchmarkTime = {
    startTime: null,
    intervalTime: null,
    endTime: null,
    start: function () {
        this.startTime = new Date();
        this.intervalTime = this.startTime;
    },
    interval: function () {
        var currentTime = null, soloRenderTime = null, renderTimePoint = null;
        currentTime = new Date();
        soloRenderTime = Math.abs(this.intervalTime - currentTime);
        renderTimePoint = Math.abs(this.intervalTime - this.startTime) + soloRenderTime;
        this.intervalTime = currentTime;
        return [utils.formatTime(soloRenderTime), utils.formatTime(renderTimePoint)];
    },
    stop: function () {
        this.endTime = new Date();
        return utils.formatTime(Math.abs(this.endTime - this.startTime));
    }
};

 
Utils.prototype.benchmarkLoop = {
    startTime: null,
    endTime: null,
    runStatus: false,
    start: function (currentIndex, endIndex, logIndexes) {
        if (logIndexes) {
            var tempTime = new Date();
            log(utils.scriptName + " INDEX: " + currentIndex + " TIME: " + utils.formatTime(Math.abs(tempTime - this.startTime)));
        }
        if (!this.runStatus){
            this.runStatus = true;
            this.startTime = new Date();
        }
        if (currentIndex == endIndex - 1) {
            this.endTime = new Date();
            log(utils.scriptName + " loop benchmark time: " + utils.formatTime(Math.abs(this.endTime - this.startTime)));
            this.reset();
        }
    },
    reset: function () {
        this.startTime = null;
        this.endTime = null;
        this.runStatus = false;
    }
};