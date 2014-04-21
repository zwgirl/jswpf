/**
 * DrillIn
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var DrillIn = declare("DrillIn", null,{ 
    });	
    
    DrillIn.Never = 0;
    DrillIn.IfNeeded = 1;
    DrillIn.Always = 2;

    DrillIn.Type = new Type("DrillIn", DrillIn, [Object.Type]);
    return DrillIn;
});

//internal enum DrillIn { Never, IfNeeded, Always };