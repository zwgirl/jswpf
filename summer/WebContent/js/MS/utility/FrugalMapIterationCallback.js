/**
 * From FrugalMap
 * FrugalMapIterationCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var FrugalMapIterationCallback = declare("FrugalMapIterationCallback", Delegate,{
		constructor:function(){}
	});
	
	FrugalMapIterationCallback.Type = new Type("FrugalMapIterationCallback", FrugalMapIterationCallback, [Delegate.Type]);
	return FrugalMapIterationCallback;
});