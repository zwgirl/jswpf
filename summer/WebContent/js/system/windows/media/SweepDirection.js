/**
 * SweepDirection
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var SweepDirection = declare("SweepDirection", Object, { 
    });	
    
    SweepDirection.Counterclockwise = 0;
    SweepDirection.Clockwise=1; 

//    SweepDirection.Type = new Type("SweepDirection", SweepDirection, [Object.Type]);
    return SweepDirection;
});
