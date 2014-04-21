/**
 * IProvideValueTarget
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var IProvideValueTarget = declare("IProvideValueTarget", Object,{
	});
	
	Object.defineProperties(IProvideValueTarget.prototype,{
//		object 
		TargetObject:
		{
			get:function(){}
		},
//		object 
		TargetProperty:
		{
			get:function(){}
		} 
	});
	
	IProvideValueTarget.Type = new Type("IProvideValueTarget", IProvideValueTarget, [Object.Type], true);
	return IProvideValueTarget;
});
