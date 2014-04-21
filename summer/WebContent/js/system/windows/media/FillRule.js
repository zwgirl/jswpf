/**
 * FillRule
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var FillRule = declare("FillRule", Object, { 
    });	
    
    FillRule.EvenOdd = 0;
    FillRule.Nonzero=1; 

//    FillRule.Type = new Type("FillRule", FillRule, [Object.Type]);
    return FillRule;
});
