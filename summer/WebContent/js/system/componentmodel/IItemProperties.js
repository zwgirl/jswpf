/**
 * IItemProperties
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IItemProperties = declare("IItemProperties", null,{
	});
	
	Object.defineProperties(IItemProperties.prototype,{
//		ReadOnlyCollection<ItemPropertyInfo> 
		ItemProperties:
		{
			get:function(){}
		}
	});
	
	IItemProperties.Type = new Type("IItemProperties", IItemProperties, [Object.Type]);
	return IItemProperties;
});
