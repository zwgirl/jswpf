/**
 * KeyEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var KeyEventHandler = declare("KeyEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	KeyEventHandler.Type = new Type("KeyEventHandler", KeyEventHandler, [Delegate.Type]);
	return KeyEventHandler;
});
