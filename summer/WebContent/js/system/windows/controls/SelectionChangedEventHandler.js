/**
 * SelectionChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var SelectionChangedEventHandler = declare("SelectionChangedEventHandler", Delegate,{
		constructor:function(){

		}
	});

	SelectionChangedEventHandler.Type = new Type("SelectionChangedEventHandler", SelectionChangedEventHandler, [Delegate.Type]);
	return SelectionChangedEventHandler;
});