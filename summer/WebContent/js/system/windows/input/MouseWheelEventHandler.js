/**
 * MouseWheelEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var MouseWheelEventHandler = declare("MouseWheelEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	MouseWheelEventHandler.Type = new Type("MouseWheelEventHandler", MouseWheelEventHandler, [Delegate.Type]);
	return MouseWheelEventHandler;
});
