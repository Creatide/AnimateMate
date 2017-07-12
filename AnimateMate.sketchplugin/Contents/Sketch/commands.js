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

function nextKeyframe(context) {
    if (utils.init(context, true)) {
        var keyframe = utils.closestValueAbove(
            utils.getKeyframeNumber(), animate.keyframeNumbers
        );
        utils.setKeyframeNumber(keyframe);
        animate.returnKeyframe(keyframe);
        dialog.createBottomMessage(5, keyframe);
    }
}

function previousKeyframe(context) {
    if (utils.init(context, true)) {
        var keyframe = utils.closestValueBelow(
            utils.getKeyframeNumber(), animate.keyframeNumbers
        );
        utils.setKeyframeNumber(keyframe);
        animate.returnKeyframe(keyframe);
        dialog.createBottomMessage(5, keyframe);
    }
}

function updateKeyframeValues(context) {
    if (utils.init(context, true)) {
        for (var i in tmpLayer = animate.animationLayers) {
            var animation = tmpLayer[i];
            animation.setKeyframeValues(utils.getKeyframeNumber());
            animation.updateLayerName();
        }
    }
}
function reverseKeyframes(context) {
    if (utils.init(context)) {
        dialog.reverseKeyframes();
    }
}