/**
 * LogicalDirection
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var LogicalDirection = declare("LogicalDirection", Object, { 
    });	
    
    LogicalDirection.Backward = 0;

    LogicalDirection.Forward=1; 

//    LogicalDirection.Type = new Type("LogicalDirection", LogicalDirection, [Object.Type]);
    return LogicalDirection;
});
