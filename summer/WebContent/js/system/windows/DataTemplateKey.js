/**
 * DataTemplateKey
 */

define(["dojo/_base/declare", "system/Type", "windows/TemplateKey"], 
		function(declare, Type, TemplateKey){
	var DataTemplateKey = declare("DataTemplateKey", TemplateKey,{
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
	
	DataTemplateKey.Type = new Type("DataTemplateKey", DataTemplateKey, [TemplateKey.Type]);
	return DataTemplateKey;
});


