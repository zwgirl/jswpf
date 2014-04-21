/**
 * SourceValueInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SourceValueInfo = declare("SourceValueInfo", Object,{
		constructor:function(/*SourceValueType*/ t, /*DrillIn*/ d,  /*string n or FrugalObjectList<IndexerParamInfo> list*/ arg){
			if(arg == null || arg.constructor ===String){
		        this.type = t; 
		        this.drillIn = d;
		        this.name = arg; 
		        this.paramList = null; 
		        this.propertyName = null;
			}else{
		        this.type = t; 
		        this.drillIn = d;
		        this.name = null; 
		        this.paramList = arg; 
		        this.propertyName = null;
			}
		}
	});
	
	SourceValueInfo.Type = new Type("SourceValueInfo", SourceValueInfo, [Object.Type]);
	return SourceValueInfo;
});


//internal struct SourceValueInfo
//{ 
//    public SourceValueType type;
//    public DrillIn drillIn; 
//    public string name;                 // the name the user supplied - could be "(0)" 
//    public FrugalObjectList<IndexerParamInfo> paramList;    // params for indexer
//    public string propertyName;         // the real name - could be "Width" 
//
//    public SourceValueInfo(SourceValueType t, DrillIn d, string n)
//    {
//        type = t; 
//        drillIn = d;
//        name = n; 
//        paramList = null; 
//        propertyName = null;
//    } 
//
//    public SourceValueInfo(SourceValueType t, DrillIn d, FrugalObjectList<IndexerParamInfo> list)
//    {
//        type = t; 
//        drillIn = d;
//        name = null; 
//        paramList = list; 
//        propertyName = null;
//    } 
//}