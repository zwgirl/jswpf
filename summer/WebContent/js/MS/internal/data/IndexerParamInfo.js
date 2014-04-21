/**
 * IndexerParamInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IndexerParamInfo = declare("IndexerParamInfo", null,{
		constructor:function(/*string*/ paren, /*string*/ value){
	        this.parenString = paren;
	        this.valueString = value;
		}
	});
	
	IndexerParamInfo.Type = new Type("IndexerParamInfo", IndexerParamInfo, [Object.Type]);
	return IndexerParamInfo;
});


//internal struct IndexerParamInfo
//{ 
//    // parse each indexer param "(abc)xyz" into two pieces - either can be empty
//    public string parenString; 
//    public string valueString; 
//
//    public IndexerParamInfo(string paren, string value) 
//    {
//        parenString = paren;
//        valueString = value;
//    } 
//}