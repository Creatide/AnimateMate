var easing = {

    linearEase: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * currentIteration / totalIterations + startValue;
    },

    easeInQuad: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
    },

    easeOutQuad: function (currentIteration, startValue, changeInValue, totalIterations) {
        return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
    },

    easeInOutQuad: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * currentIteration * currentIteration + startValue;
        }
        return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
    },

    easeInCubic: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
    },

    easeOutCubic: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    },

    easeInOutCubic: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
        }
        return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
    },

    easeInQuart: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
    },

    easeOutQuart: function (currentIteration, startValue, changeInValue, totalIterations) {
        return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
    },

    easeInOutQuart: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
        }
        return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
    },

    easeInQuint: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
    },

    easeOutQuint: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
    },

    easeInOutQuint: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
        }
        return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
    },

    easeInSine: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
    },

    easeOutSine: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
    },

    easeInOutSine: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
    },

    easeInExpo: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
    },

    easeOutExpo: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
    },

    easeInOutExpo: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
        }
        return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
    },

    easeInCirc: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
    },

    easeOutCirc: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
    },

    easeInOutCirc: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
        }
        return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
    },
    easeInElastic: function (currentIteration, startValue, changeInValue, totalIterations) {
        var s = 1.70158;
        var p = 0;
        var a = changeInValue;
        if (currentIteration == 0) return startValue;
        if ((currentIteration /= totalIterations) == 1) return startValue + changeInValue;
        if (!p) p = totalIterations * .3;
        if (a < Math.abs(changeInValue)) {
            a = changeInValue;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(changeInValue / a);
        return -(a * Math.pow(2, 10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p)) + startValue;
    },

    easeOutElastic: function (currentIteration, startValue, changeInValue, totalIterations) {
        var s = 1.70158;
        var p = 0;
        var a = changeInValue;
        if (currentIteration == 0) return startValue;
        if ((currentIteration /= totalIterations) == 1) return startValue + changeInValue;
        if (!p) p = totalIterations * .3;
        if (a < Math.abs(changeInValue)) {
            a = changeInValue;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(changeInValue / a);
        return a * Math.pow(2, -10 * currentIteration) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p) + changeInValue + startValue;
    },

    easeInOutElastic: function (currentIteration, startValue, changeInValue, totalIterations) {
        var s = 1.70158;
        var p = 0;
        var a = changeInValue;
        if (currentIteration == 0) return startValue;
        if ((currentIteration /= totalIterations / 2) == 2) return startValue + changeInValue;
        if (!p) p = totalIterations * (.3 * 1.5);
        if (a < Math.abs(changeInValue)) {
            a = changeInValue;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(changeInValue / a);
        if (currentIteration < 1) return -.5 * (a * Math.pow(2, 10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p)) + startValue;
        return a * Math.pow(2, -10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p) * .5 + changeInValue + startValue;
    },

    easeInBack: function (currentIteration, startValue, changeInValue, totalIterations, s) {
        if (s == undefined) s = 1.70158;
        return changeInValue * (currentIteration /= totalIterations) * currentIteration * ((s + 1) * currentIteration - s) + startValue;
    },

    easeOutBack: function (currentIteration, startValue, changeInValue, totalIterations, s) {
        if (s == undefined) s = 1.70158;
        return changeInValue * ((currentIteration = currentIteration / totalIterations - 1) * currentIteration * ((s + 1) * currentIteration + s) + 1) + startValue;
    },

    easeInOutBack: function (currentIteration, startValue, changeInValue, totalIterations, s) {
        if (s == undefined) s = 1.70158;
        if ((currentIteration /= totalIterations / 2) < 1) return changeInValue / 2 * (currentIteration * currentIteration * (((s *= (1.525)) + 1) * currentIteration - s)) + startValue;
        return changeInValue / 2 * ((currentIteration -= 2) * currentIteration * (((s *= (1.525)) + 1) * currentIteration + s) + 2) + startValue;
    },

    easeInBounce: function (currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue - easing.easeOutBounce(totalIterations - currentIteration, 0, changeInValue, totalIterations) + startValue;
    },

    easeOutBounce: function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations) < (1 / 2.75)) {
            return changeInValue * (7.5625 * currentIteration * currentIteration) + startValue;
        } else if (currentIteration < (2 / 2.75)) {
            return changeInValue * (7.5625 * (currentIteration -= (1.5 / 2.75)) * currentIteration + .75) + startValue;
        } else if (currentIteration < (2.5 / 2.75)) {
            return changeInValue * (7.5625 * (currentIteration -= (2.25 / 2.75)) * currentIteration + .9375) + startValue;
        } else {
            return changeInValue * (7.5625 * (currentIteration -= (2.625 / 2.75)) * currentIteration + .984375) + startValue;
        }
    },

    easeInOutBounce: function (currentIteration, startValue, changeInValue, totalIterations) {
        if (currentIteration < totalIterations / 2) return easing.easeInBounce(currentIteration * 2, 0, changeInValue, totalIterations) * .5 + startValue;
        return easing.easeOutBounce(currentIteration * 2 - totalIterations, 0, changeInValue, totalIterations) * .5 + changeInValue * .5 + startValue;
    }
};

// Returns all available easings
easing.getEasingNames = function () {
    var returnArr = [];
    for (var property in easing) {
        if (easing.hasOwnProperty(property)) {
            returnArr.push(property)
        }
    }
    // Remove this "getEasingNames" and "getEasingValue" properties from list
    returnArr.pop();
    returnArr.pop();
    
    return returnArr;
};

// Shortcut to evaluate to get easing value
easing.getEasingValue = function (currentValue, nextValue, difference, indexValue, easingType, roundValue) {
    var roundValue = roundValue || true;
    var returnValue = currentValue == nextValue ? currentValue : eval('easing.' + easingType + '(' + indexValue + ',' + currentValue + ',' + (nextValue - currentValue) + ',' + difference + ')');
    return roundValue ? Math.round(returnValue * 100) / 100) : returnValue;
};

/*
*
* TERMS OF USE - EASING EQUATIONS
* 
* Open source under the BSD License. 
* 
* Copyright © 2001 Robert Penner
* All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
* Redistributions of source code must retain the above copyright notice, this list of 
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list 
* of conditions and the following disclaimer in the documentation and/or other materials 
* provided with the distribution.
* 
* Neither the name of the author nor the names of contributors may be used to endorse 
* or promote products derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
* OF THE POSSIBILITY OF SUCH DAMAGE. 
*
*/