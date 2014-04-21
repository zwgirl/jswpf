/**
 * ItemContainerTemplateKey
 */

define(["dojo/_base/declare", "system/Type", "windows/TemplateKey"], 
		function(declare, Type, TemplateKey){
	var ItemContainerTemplateKey = declare("ItemContainerTemplateKey", TemplateKey,{
   	 	"-chains-": {
    	      constructor: "manual"
    	    },
		constructor:function(/*object*/ dataType){
			if(dataType === undefined){
				dataType = null;
			}
			TemplateKey.prototype.constructor.call(this, TemplateKey.TemplateType.TableTemplate, dataType);
			
		}
	});
	
	ItemContainerTemplateKey.Type = new Type("ItemContainerTemplateKey", ItemContainerTemplateKey, [TemplateKey.Type]);
	return ItemContainerTemplateKey;
});


