/**
 * PropertyPathStatus
 */
define(["dojo/_base/declare"], function(declare){
	
    var PropertyPathStatus = declare("PropertyPathStatus", null,{ 
    });	
    
    PropertyPathStatus.Inactive = 0;
    PropertyPathStatus.Active = 1;
    PropertyPathStatus.PathError = 2;
    PropertyPathStatus.AsyncRequestPending = 3;

//    PropertyPathStatus.Type = new Type("PropertyPathStatus", PropertyPathStatus, Object.Type);
    return PropertyPathStatus;
});

//internal enum PropertyPathStatus : byte { Inactive, Active, PathError, AsyncRequestPending }