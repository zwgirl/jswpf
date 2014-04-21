/**
 * FreezeValueCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var FreezeValueCallback = declare("FreezeValueCallback", Delegate,{
		constructor:function(target, method){
		}
	});

	
	FreezeValueCallback.Type = new Type("FreezeValueCallback", FreezeValueCallback, [Delegate.Type]);
	return FreezeValueCallback;
});
