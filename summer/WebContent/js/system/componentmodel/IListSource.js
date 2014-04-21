/**
 * IListSource
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IListSource = declare("IListSource", null,{
//		IList 
		GetList:function(){}
	});
	
	Object.defineProperties(IListSource.prototype,{
//		bool 
		ContainsListCollection:
		{
			get:function(){}
		}	  
	});
	
	IListSource.Type = new Type("IListSource", IListSource, [Object.Type]);
	return IListSource;
});

