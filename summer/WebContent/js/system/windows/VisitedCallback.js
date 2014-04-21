/**
 * VisitedCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var VisitedCallback = declare("VisitedCallback", Delegate,{
		constructor:function(target, method){
			
		}
	});

	
	VisitedCallback.Type = new Type("VisitedCallback", VisitedCallback, [Delegate.Type]);
	return VisitedCallback;
});