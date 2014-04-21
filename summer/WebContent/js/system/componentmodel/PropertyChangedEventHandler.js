/**
 * PropertyChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var PropertyChangedEventHandler = declare("PropertyChangedEventHandler", Delegate,{
		constructor:function(target, method){
			this.Combine(new Delegate(target, method));
		}
	});

	
	PropertyChangedEventHandler.Type = new Type("PropertyChangedEventHandler", PropertyChangedEventHandler, [Delegate.Type]);
	return PropertyChangedEventHandler;
});
