/**
 * Second Check 12-27
 * BindingMode
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var BindingMode = declare("BindingMode", Object,{ 
    });	
    
    /// <summary> Data flows from source to target and vice-versa </summary>
    BindingMode.TwoWay = 0;
    /// <summary> Data flows from source to target, source changes cause data flow </summary>
    BindingMode.OneWay = 1;
    /// <summary> Data flows from source to target once, source changes are ignored </summary> 
    BindingMode.OneTime = 2;
    /// <summary> Data flows from target to source, target changes cause data flow </summary> 
    BindingMode.OneWayToSource = 3;
    /// <summary> Data flow is obtained from target property default </summary>
    BindingMode.Default = 4;
    
//    BindingMode.Type = new Type("BindingMode", BindingMode, [Object.Type]);
    return BindingMode;
}); 
