/**
 * ContextMenuEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var ContextMenuEventHandler = declare("ContextMenuEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	ContextMenuEventHandler.Type = new Type("ContextMenuEventHandler", ContextMenuEventHandler, [Delegate.Type]);
	return ContextMenuEventHandler;
});
