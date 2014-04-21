/**
 * IHaveResources
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IHaveResources = declare("IHaveResources", Object,{

	});
	Object.defineProperties(IHaveResources.prototype, {
//		ResourceDictionary 
		Resources:
		{
			get:function(){},
			set:function(value){}
		}
	});
	
	IHaveResources.Type = new Type("IHaveResources", IHaveResources, [Object.Type], true);
	return IHaveResources;
});	
