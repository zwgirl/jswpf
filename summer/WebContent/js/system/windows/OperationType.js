/**
 * Second check 2013-12-15
 * OperationType
 * From DependencyPropertyChangedEventArgs
 */
define(["dojo/_base/declare"], function(declare){

    var OperationType=declare("OperationType", null,{ 
    });	
    
    OperationType.Unknown = 0;
    OperationType.AddChild = 1;
    OperationType.RemoveChild = 2;
    OperationType.Inherit = 3;
    OperationType.ChangeMutableDefaultValue = 4;
    
    return OperationType;
    
});
