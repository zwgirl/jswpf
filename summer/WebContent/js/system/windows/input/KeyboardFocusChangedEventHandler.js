/**
 * KeyboardFocusChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var KeyboardFocusChangedEventHandler = declare("KeyboardFocusChangedEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	KeyboardFocusChangedEventHandler.Type = new Type("KeyboardFocusChangedEventHandler", KeyboardFocusChangedEventHandler, [Delegate.Type]);
	return KeyboardFocusChangedEventHandler;
});
