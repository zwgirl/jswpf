/**
 * MouseEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var MouseEventHandler = declare("MouseEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	MouseEventHandler.Type = new Type("MouseEventHandler", MouseEventHandler, [Delegate.Type]);
	return MouseEventHandler;
});
