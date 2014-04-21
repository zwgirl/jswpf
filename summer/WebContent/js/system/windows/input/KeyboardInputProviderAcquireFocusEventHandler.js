/**
 * KeyboardInputProviderAcquireFocusEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var KeyboardInputProviderAcquireFocusEventHandler = declare("KeyboardInputProviderAcquireFocusEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	KeyboardInputProviderAcquireFocusEventHandler.Type = new Type("KeyboardInputProviderAcquireFocusEventHandler", 
			KeyboardInputProviderAcquireFocusEventHandler, [Delegate.Type]);
	return KeyboardInputProviderAcquireFocusEventHandler;
});
