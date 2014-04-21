/**
 * DragEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var DragEventHandler = declare("DragEventHandler", Delegate,{
		constructor:function(method){
		}
	});

	
	DragEventHandler.Type = new Type("DragEventHandler", DragEventHandler, [Delegate.Type]);
	return DragEventHandler;
});