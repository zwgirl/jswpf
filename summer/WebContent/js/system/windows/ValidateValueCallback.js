/**
 * ValidateValueCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var ValidateValueCallback = declare("ValidateValueCallback", Delegate,{
		constructor:function(method){
			this.Combine(new Delegate(null, method));
		},
		
		Call:function(){
			if(this.Method !== undefined && this.Method != null){
				return this.Method.apply(this.Target, arguments);
			}
			
			return true;
		},
	});

	
	ValidateValueCallback.Type = new Type("ValidateValueCallback", ValidateValueCallback, [Delegate.Type]);
	return ValidateValueCallback;
});
