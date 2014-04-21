/**
 * AlternativeExpressionStorageCallback
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], 
		function(declare, Type, Delegate){
	var AlternativeExpressionStorageCallback = declare("AlternativeExpressionStorageCallback", Delegate,{
		constructor:function(){

		}
	});
	
	AlternativeExpressionStorageCallback.Type =new Type("AlternativeExpressionStorageCallback", AlternativeExpressionStorageCallback,
			[Delegate.Type]);
	return AlternativeExpressionStorageCallback;
});