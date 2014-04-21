/**
 * PenLineCap
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var PenLineCap = declare("PenLineCap", Object, { 
    });	
    
    PenLineCap.Flat = 0;
    PenLineCap.Square=1; 
    PenLineCap.Round=2; 
    PenLineCap.Triangle=3; 

//    PenLineCap.Type = new Type("PenLineCap", PenLineCap, [Object.Type]);
    return PenLineCap;
});
