/**
 * From InheritedPropertyChangedEventArgs
 * InheritedPropertyChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var InheritedPropertyChangedEventHandler = declare("InheritedPropertyChangedEventHandler", Delegate,{
		constructor:function(){}
	});
	
	InheritedPropertyChangedEventHandler.Type = new Type("InheritedPropertyChangedEventHandler", InheritedPropertyChangedEventHandler, [Delegate.Type]);
	return InheritedPropertyChangedEventHandler;
});