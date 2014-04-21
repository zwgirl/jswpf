/**
 * from StyleHelper
 */

/**
 * DeferredAction
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var DeferredAction = declare("DeferredAction", Object,{
	});
	
	Object.defineProperties(DeferredAction.prototype,{
//        internal TriggerBase 
        TriggerBase:
        {
        	get:function(){
        		return this._triggerBase;
        	},
        	set:function(value){
        		this._triggerBase = value;
        	}
        },
//        internal TriggerActionCollection 
        TriggerActionCollection:
        {
        	get:function(){
        		return this._triggerActionCollection;
        	},
        	set:function(value){
        		this._triggerActionCollection = value;
        	}
        }
	});
	
	DeferredAction.Type = new Type("DeferredAction", DeferredAction, [Object.Type]);
	return DeferredAction;
});

//   // 
//    // This struct represents a list of actions associated with a trigger whose
//    //  conditions have fired but could not execute immediately.  The original 
//    //  motivation is to address the scenario where the actions want to manipulate 
//    //  the templated children but the template expansion hasn't happened yet.
//    // 
//    internal struct DeferredAction
//    {
//        internal TriggerBase TriggerBase;
//        internal TriggerActionCollection TriggerActionCollection; 
//    }