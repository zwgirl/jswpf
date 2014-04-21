/**
 * DynamicPropertyAccessor
 */
define(["dojo/_base/declare", "system/Type", "internal.data/DynamicObjectAccessor"], 
		function(declare, Type, DynamicObjectAccessor){
	var DynamicPropertyAccessor = declare("DynamicPropertyAccessor", DynamicObjectAccessor,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(DynamicPropertyAccessor.prototype,{
		  
	});
	
	Object.defineProperties(DynamicPropertyAccessor,{
		  
	});
	
	DynamicPropertyAccessor.Type = new Type("DynamicPropertyAccessor", DynamicPropertyAccessor, [DynamicObjectAccessor.Type]);
	return DynamicPropertyAccessor;
});