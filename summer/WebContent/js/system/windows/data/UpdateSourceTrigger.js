/**
 * Second Check 12-27
 * UpdateSourceTrigger
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var UpdateSourceTrigger = declare("UpdateSourceTrigger", Object,{ 
    });	
    
    /**
     * Obtain trigger from target property default 
     */
    UpdateSourceTrigger.Default = 0;

	/**
	 * Update whenever the target property changes
	 */
    UpdateSourceTrigger.PropertyChanged = 1;
    
    /**
     * Update only when target element loses focus, or when Binding deactivates
     */ 
    UpdateSourceTrigger.LostFocus = 2; 

	/**
	 * Update only by explicit call to BindingExpression.UpdateSource()
	 */
    UpdateSourceTrigger.Explicit = 3;
    
    UpdateSourceTrigger.Type = new Type("UpdateSourceTrigger", UpdateSourceTrigger, [Object.Type]);
    return UpdateSourceTrigger;
});