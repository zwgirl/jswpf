/**
 * ToolTipEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var ToolTipEventHandler = declare("ToolTipEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	ToolTipEventHandler.Type = new Type("ToolTipEventHandler", ToolTipEventHandler, [Delegate.Type]);
	return ToolTipEventHandler;
});
