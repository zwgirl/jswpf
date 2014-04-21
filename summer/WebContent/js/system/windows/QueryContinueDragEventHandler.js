/**
 * QueryContinueDragEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var QueryContinueDragEventHandler = declare("QueryContinueDragEventHandler", Delegate,{
		constructor:function(method){
		}
	});

	
	QueryContinueDragEventHandler.Type = new Type("QueryContinueDragEventHandler", QueryContinueDragEventHandler, [Delegate.Type]);
	return QueryContinueDragEventHandler;
});