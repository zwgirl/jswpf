/**
 * GridUnitType
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var GridUnitType = declare("GridUnitType", Object, { 
    });	
    
    GridUnitType.Auto = 0;
    GridUnitType.Pixel=1; 
    GridUnitType.Star=2; 

//    GridUnitType.Type = new Type("GridUnitType", GridUnitType, [Object.Type]);
    return GridUnitType;
});
