/**
 * IEqualityComparer
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IEqualityComparer = declare("IEqualityComparer", null,{
//		bool 
		Equals:function(/*object*/ x, /*object*/ y){},
//		int 
		GetHashCode:function(/*object*/ obj){}
	});
	
	
	IEqualityComparer.Type = new Type("IEqualityComparer", IEqualityComparer, [Object.Type]);
	return IEqualityComparer;
});
