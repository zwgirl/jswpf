/**
 * IEquatable
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IEquatable = declare("IEquatable", null,{
//		bool 
		Equals:function(/*T*/ other){
			
		}
	});
	
	IEquatable.Type = new Type("IEquatable", IEquatable, [Object.Type], true);
	return IEquatable;
});
