/**
 * Second Check 12-29
 * TaskOps
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var TaskOps = declare("TaskOps", Object,{ 
    });	
    
    TaskOps.TransferValue=0; 
    TaskOps.UpdateValue=1;
    TaskOps.AttachToContext=2; 
    TaskOps.VerifySourceReference=3;
    TaskOps.RaiseTargetUpdatedEvent=4;

    TaskOps.Type = new Type("TaskOps", TaskOps, [Object.Type]);
    return TaskOps;
});
