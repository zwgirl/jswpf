/**
 * from CanExecuteRoutedEventArgs
 * CanExecuteRoutedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var CanExecuteRoutedEventHandler = declare("CanExecuteRoutedEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	CanExecuteRoutedEventHandler.Type = new Type("CanExecuteRoutedEventHandler", CanExecuteRoutedEventHandler, [Delegate.Type]);
	return CanExecuteRoutedEventHandler;
});