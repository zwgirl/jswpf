/**
 * Second Check 12-27
 * BindingStatus
 */
define(null, function(){
	
    var BindingStatus = declare("BindingStatus", null,{ 
    });	


    /// <summary> Binding has not yet been attached to its target </summary>
    BindingStatus.Unattached = 0;
	/// <summary> Binding has not yet been activated </summary>
    BindingStatus.Inactive = 1; 
	/// <summary> Binding has been successfully activated </summary>
    BindingStatus.Active = 2; 
	/// <summary> Binding has been detached from its target </summary> 
    BindingStatus.Detached = 3;
	/// <summary> Binding is waiting for an async operation to complete</summary> 
    BindingStatus.AsyncRequestPending = 4;
	/// <summary> error - source path could not be resolved </summary>
    BindingStatus.PathError = 5;
	/// <summary> error - a legal value could not be obtained from the source</summary> 
    BindingStatus.UpdateTargetError = 6;
	/// <summary> error - the value could not be sent to the source </summary> 
    BindingStatus.UpdateSourceError = 7; 

//    BindingStatus.Type = new Type("BindingStatus",BindingStatus,[Object.Type]);
    
    return BindingStatus;
}); 

 