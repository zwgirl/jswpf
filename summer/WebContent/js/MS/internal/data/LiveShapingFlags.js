/**
 * LiveShapingFlags
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var LiveShapingFlags = declare("LiveShapingFlags", null,{ 
    });	
    
    LiveShapingFlags.Sorting = 0;
    LiveShapingFlags.Filtering = 2;
    LiveShapingFlags.Grouping = 4;

    LiveShapingFlags.Type = new Type("LiveShapingFlags", LiveShapingFlags, [Object.Type]);
    return LiveShapingFlags;
});
