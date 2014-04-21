/**
 * IContainItemStorage
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IContainItemStorage = declare("IContainItemStorage", null,{
//		void 
		StoreItemValue:function(/*object*/ item, /*DependencyProperty*/ dp, /*object*/ value){},
//		object 
		ReadItemValue:function(/*object*/ item, /*DependencyProperty*/ dp){},
//		void 
		ClearItemValue:function(/*object*/ item, /*DependencyProperty*/ dp){},
//		void 
		ClearValue:function(/*DependencyProperty*/ dp){},
//		void 
		Clear:function(){},
	});
	
	IContainItemStorage.Type = new Type("IContainItemStorage", IContainItemStorage, [Object.Type], true);
	return IContainItemStorage;
});
