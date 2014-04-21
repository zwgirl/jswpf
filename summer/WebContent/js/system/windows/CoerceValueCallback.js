/**
 * CoerceValueCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var CoerceValueCallback = declare("CoerceValueCallback", Delegate,{
		constructor:function(){

		}
	});

	
	CoerceValueCallback.Type = new Type("CoerceValueCallback", CoerceValueCallback, [Delegate.Type]);
	return CoerceValueCallback;
});