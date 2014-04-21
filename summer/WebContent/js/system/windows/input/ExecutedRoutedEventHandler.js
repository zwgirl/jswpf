/**
 * from ExecutedRoutedEventArgs
 * ExecutedRoutedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var ExecutedRoutedEventHandler = declare("ExecutedRoutedEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	ExecutedRoutedEventHandler.Type = new Type("ExecutedRoutedEventHandler", ExecutedRoutedEventHandler, [Delegate.Type]);
	return ExecutedRoutedEventHandler;
});
