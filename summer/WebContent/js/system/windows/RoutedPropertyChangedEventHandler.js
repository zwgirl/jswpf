/**
 * RoutedPropertyChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var RoutedPropertyChangedEventHandler = declare("RoutedPropertyChangedEventHandler", Delegate,{
		constructor:function(target, method){
		}
	});

	
	RoutedPropertyChangedEventHandler.Type = new Type("RoutedPropertyChangedEventHandler", RoutedPropertyChangedEventHandler, [Delegate.Type]);
	return RoutedPropertyChangedEventHandler;
});
