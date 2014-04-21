/**
 * FindToolTipEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var FindToolTipEventHandler = declare("FindToolTipEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	FindToolTipEventHandler.Type = new Type("FindToolTipEventHandler", FindToolTipEventHandler, [Delegate.Type]);
	return FindToolTipEventHandler;
});
