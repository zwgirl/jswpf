/**
 * IHierarchicalVirtualizationAndScrollInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IHierarchicalVirtualizationAndScrollInfo = declare("IHierarchicalVirtualizationAndScrollInfo", null,{
		constructor:function(){

		}
	});
	
	Object.defineProperties(IHierarchicalVirtualizationAndScrollInfo.prototype,{
		  
//		HierarchicalVirtualizationConstraints 
		Constraints:
		{
			get:function(){},
			set:function(value){}
		},
//		HierarchicalVirtualizationHeaderDesiredSizes 
		HeaderDesiredSizes:
		{
			get:function(){}
		},
//		HierarchicalVirtualizationItemDesiredSizes 
		ItemDesiredSizes:
		{
			get:function(){},
			set:function(value){}
		},
//		Panel 
		ItemsHost:
		{
			get:function(){}
		},
//		bool 
		MustDisableVirtualization:
		{
			get:function(){},
			set:function(value){}
		},
//		bool 
		InBackgroundLayout:
		{
			get:function(){},
			set:function(value){}
		}
	});
	
	IHierarchicalVirtualizationAndScrollInfo.Type = new Type("IHierarchicalVirtualizationAndScrollInfo", 
			IHierarchicalVirtualizationAndScrollInfo, [Object.Type], true);
	return IHierarchicalVirtualizationAndScrollInfo;
});

