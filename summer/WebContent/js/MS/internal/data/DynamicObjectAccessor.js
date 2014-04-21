/**
 * DynamicObjectAccessor
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var DynamicObjectAccessor = declare("DynamicObjectAccessor", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(DynamicObjectAccessor.prototype,{
		  
	});
	
	Object.defineProperties(DynamicObjectAccessor,{
		  
	});
	
	DynamicObjectAccessor.Type = new Type("DynamicObjectAccessor", DynamicObjectAccessor, [Object.Type]);
	return DynamicObjectAccessor;
});


