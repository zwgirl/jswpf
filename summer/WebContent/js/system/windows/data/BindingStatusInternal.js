/**
 * Second Check 12-27
 * 
 * BindingStatusInternal
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var BindingStatusInternal = declare("BindingStatusInternal", Object,{ 
    });	
    
    BindingStatusInternal.Unattached = 0; 
        /// <summary> Binding has not yet been activated </summary>
    BindingStatusInternal.Inactive = 1; 
        /// <summary> Binding has been successfully activated </summary>
    BindingStatusInternal.Active = 2;
        /// <summary> Binding has been detached from its target </summary>
    BindingStatusInternal.Detached = 3; 
        /// <summary> Binding is waiting for an async operation to complete</summary>
    BindingStatusInternal.AsyncRequestPending = 4; 
        /// <summary> error - source path could not be resolved </summary> 
    BindingStatusInternal.PathError = 5;
        /// <summary> error - a legal value could not be obtained from the source</summary> 
    BindingStatusInternal.UpdateTargetError = 6;
        /// <summary> error - the value could not be sent to the source </summary>
    BindingStatusInternal.UpdateSourceError = 7;

    
//    BindingStatusInternal.Type = new Type("BindingStatusInternal",BindingStatusInternal,[Object.Type]);
    return BindingStatusInternal;
}); 