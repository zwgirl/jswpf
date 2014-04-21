/**
 * MouseButton
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var MouseButton = declare("MouseButton", null,{

	});
	
	MouseButton.Left = 0;
	MouseButton.Middle = 1;
	MouseButton.Right = 2;
	MouseButton.XButton1 = 3;
	MouseButton.XButton2 = 4;
	
//	MouseButton.Type = new Type("MouseButton", MouseButton, [Object.Type]);
	return MouseButton;
});
