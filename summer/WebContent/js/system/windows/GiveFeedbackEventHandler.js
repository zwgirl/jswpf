/**
 * GiveFeedbackEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var GiveFeedbackEventHandler = declare("GiveFeedbackEventHandler", Delegate,{
		constructor:function(method){
		}
	});

	
	GiveFeedbackEventHandler.Type = new Type("GiveFeedbackEventHandler", GiveFeedbackEventHandler, [Delegate.Type]);
	return GiveFeedbackEventHandler;
});