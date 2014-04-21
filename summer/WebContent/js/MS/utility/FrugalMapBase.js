/**
 * FrugalMapBase
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
//	abstract class 
    var FrugalMapBase = declare("FrugalMapBase", null,{});
    
//    protected const int 
    FrugalMapBase.INVALIDKEY = 0x7FFFFFFF;
    
    FrugalMapBase.Type = new Type("FrugalMapBase", FrugalMapBase, [Object.Type]);
	return FrugalMapBase;
});
