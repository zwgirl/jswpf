define(["dojo/_base/declare"], function(declare){

    var UpdateResult=declare("UpdateResult", null,{ 
    });	
    
    UpdateResult.ValueChanged = 0x01;
    UpdateResult.NotificationSent = 0x02;
    UpdateResult.InheritedValueOverridden = 0x04;
    
    return UpdateResult;
    
});