/**
 * QueryCursorEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var QueryCursorEventHandler = declare("QueryCursorEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	QueryCursorEventHandler.Type = new Type("QueryCursorEventHandler", QueryCursorEventHandler, [Delegate.Type]);
	return QueryCursorEventHandler;
});
