/**
 * NotifyCollectionChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var NotifyCollectionChangedEventHandler = declare("NotifyCollectionChangedEventHandler", Delegate,{
		constructor:function(target, method){
			this.Combine(new Delegate(target, method));
		}
	});

	
	NotifyCollectionChangedEventHandler.Type = new Type("NotifyCollectionChangedEventHandler", NotifyCollectionChangedEventHandler, [Delegate.Type]);
	return NotifyCollectionChangedEventHandler;
});
