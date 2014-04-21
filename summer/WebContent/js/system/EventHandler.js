/**
 * EventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var EventHandler = declare("EventHandler", Delegate,{
		constructor:function(){}
	});
	
	EventHandler.Type = new Type("EventHandler", EventHandler, [Delegate.Type]);
	return EventHandler;
});