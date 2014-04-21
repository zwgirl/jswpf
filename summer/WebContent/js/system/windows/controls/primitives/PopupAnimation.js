/**
 * PopupAnimation
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var PopupAnimation = declare("PopupAnimation", Object, { 
    });	
    
    PopupAnimation.None = 0,
    PopupAnimation.Fade = 1,
    PopupAnimation.Slide = 2,
    PopupAnimation.Scroll = 3;

//    PopupAnimation.Type = new Type("PopupAnimation", PopupAnimation, [Object.Type]);
    return PopupAnimation;
}); 
