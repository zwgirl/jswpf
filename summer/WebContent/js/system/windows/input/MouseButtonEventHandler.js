/**
 * MouseButtonEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var MouseButtonEventHandler = declare("MouseButtonEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	MouseButtonEventHandler.Type = new Type("MouseButtonEventHandler", MouseButtonEventHandler, [Delegate.Type]);
	return MouseButtonEventHandler;
});
