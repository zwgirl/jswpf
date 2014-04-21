/**
 * DependencyPropertyChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var DependencyPropertyChangedEventHandler = declare("DependencyPropertyChangedEventHandler", Delegate,{
		constructor:function(target, method){
		}
	});

	
	DependencyPropertyChangedEventHandler.Type = new Type("DependencyPropertyChangedEventHandler", 
			DependencyPropertyChangedEventHandler, [Delegate.Type]);
	return DependencyPropertyChangedEventHandler;
});
