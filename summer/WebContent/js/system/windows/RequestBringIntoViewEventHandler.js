/**
 * RequestBringIntoViewEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var RequestBringIntoViewEventHandler = declare("RequestBringIntoViewEventHandler", Delegate,{
		constructor:function(target, method){
		}
	});

	
	RequestBringIntoViewEventHandler.Type = new Type("RequestBringIntoViewEventHandler", RequestBringIntoViewEventHandler, [Delegate.Type]);
	return RequestBringIntoViewEventHandler;
});