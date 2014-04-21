/**
 * MouseButtonState
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var MouseButtonState = declare("MouseButtonState", null,{

	});
	
	MouseButtonState.Released = 0;
	MouseButtonState.Pressed = 1;
	
//	MouseButtonState.Type = new Type("MouseButtonState", MouseButtonState, [Object.Type]);
	return MouseButtonState;
});
