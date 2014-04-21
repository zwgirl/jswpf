/**
 * IndexerParameterInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IndexerParameterInfo = declare("IndexerParameterInfo", null,{
		constructor:function(){
			this.type = null;
			this.value = null;
		}
	});
	
	Object.defineProperties(IndexerParameterInfo.prototype,{
		
	});
	
	IndexerParameterInfo.Type = new Type("IndexerParameterInfo", IndexerParameterInfo, [Object.Type]);
	return IndexerParameterInfo;
});

//
//
//internal struct IndexerParameterInfo
//{ 
//    public Type type;       // user-specified type
//    public object value;    // string or strongly typed value 
//} 

