/**
 * PropertyDescriptor
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var PropertyDescriptor = declare("PropertyDescriptor", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(PropertyDescriptor.prototype,{
		  
	});
	
	Object.defineProperties(PropertyDescriptor,{
		  
	});
	
	PropertyDescriptor.Type = new Type("PropertyDescriptor", PropertyDescriptor, [Object.Type]);
	return PropertyDescriptor;
});


