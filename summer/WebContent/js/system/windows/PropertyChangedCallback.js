/**
 * PropertyChangedCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var PropertyChangedCallback = declare("PropertyChangedCallback", Delegate,{
		constructor:function(target, method){
//			if(target !== undefined){
//				this.Combine(new Delegate(target, method));
//			}
		}
	});

	
	PropertyChangedCallback.Type = new Type("PropertyChangedCallback", PropertyChangedCallback, [Delegate.Type]);
	return PropertyChangedCallback;
});
