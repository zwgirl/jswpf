/**
 * IDataErrorInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IDataErrorInfo = declare("IDataErrorInfo", null,{
//		string this[string columnName]
		Get:function(columnName){
			
		}
	});
	
	Object.defineProperties(IDataErrorInfo.prototype,{
//		string 
		Error:
		{
			get:function(){}
		}	  
	});
	
	IDataErrorInfo.Type = new Type("IDataErrorInfo", IDataErrorInfo, [Object.Type]);
	return IDataErrorInfo;
});
