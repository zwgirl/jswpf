/**
 * PenLineJoin
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var PenLineJoin = declare("PenLineJoin", Object, { 
    });	
    
    PenLineJoin.Miter = 0;
    PenLineJoin.Bevel=1; 
    PenLineJoin.Round=2; 

//    PenLineJoin.Type = new Type("PenLineJoin", PenLineJoin, [Object.Type]);
    return PenLineJoin;
});
