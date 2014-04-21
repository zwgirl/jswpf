/**
 * RoutedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var RoutedEventHandler = declare("RoutedEventHandler", Delegate,{
		constructor:function(target, method){
		}
	});

	
	RoutedEventHandler.Type = new Type("RoutedEventHandler", RoutedEventHandler, [Delegate.Type]);
	return RoutedEventHandler;
});
