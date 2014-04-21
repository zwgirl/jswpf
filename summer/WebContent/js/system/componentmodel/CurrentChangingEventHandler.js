/**
 * CurrentChangingEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var CurrentChangingEventHandler = declare("CurrentChangingEventHandler", Delegate,{
		constructor:function(target, method){
			this.Combine(new Delegate(target, method));
		}
	});

	
	CurrentChangingEventHandler.Type = new Type("CurrentChangingEventHandler", CurrentChangingEventHandler, [Delegate.Type]);
	return CurrentChangingEventHandler;
});