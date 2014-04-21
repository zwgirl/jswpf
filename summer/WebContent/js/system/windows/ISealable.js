/**
 * ISealable
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ISealable = declare("ISealable", null,{

//		void 
		Seal:function(){}
	});
	
	Object.defineProperties(ISealable, {
		CanSeal:
		{
			set:function(){},get:function(){}
		},
		IsSealed:
		{
			set:function(){},get:function(){}
		}
	});
	
	ISealable.Type = new Type("ISealable", ISealable, [Object.Type], true);
	return ISealable;
});
