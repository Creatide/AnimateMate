@import 'library/Dialog.js';
@import 'library/Utils.js';

function exportAnimation(context) {
    if (utils.init(context, true)) {
        dialog.exportAnimation();
    }
}

function createAnimation(context) {
    if (utils.init(context)) {
        dialog.createAnimation();
    }
}

function removeAnimation(context) {
    if (utils.init(context, false, true)) {
        dialog.removeAnimation();
    }
}

function editAnimation(context) {
    if (utils.init(context)) {
        dialog.editAnimation();
    }
}   

function offsetAnimation(context) {
    if (utils.init(context)) {
        dialog.offsetAnimation();
    }
}

function randomAnimation(context) {
    if (utils.init(context)) {
        dialog.randomAnimation();
    }
}

function returnKeyframe(context) {
    if (utils.init(context, true)) {
        dialog.returnKeyframe();
    }
} 

function reverseKeyframes(context) {
    if (utils.init(context)) {
        dialog.reverseKeyframes();
    }
} 