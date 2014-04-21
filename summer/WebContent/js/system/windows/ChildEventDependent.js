/**
 * from StyleHelper
 */

/**
 * ChildEventDependent
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ChildEventDependent = declare("ChildEventDependent", Object,{
	});
	
	Object.defineProperties(ChildEventDependent.prototype,{
//        internal int                
        ChildIndex:
        {
        	get:function(){
        		return this._childIndex;
        	},
        	set:function(value){
        		this._childIndex = value;
        	}
        },
//        internal EventHandlersStore 
        EventHandlersStore:
        {
        	get:function(){
        		return this._eventHandlersStore;
        	},
        	set:function(value){
        		this._eventHandlersStore = value;
        	}
        }
	});
	
	ChildEventDependent.Type = new Type("ChildEventDependent", ChildEventDependent, [Object.Type]);
	return ChildEventDependent;
});
//// 
//    //  Each item in the ChildEventDependents list is of this type. Stores the the
//    //  EventHandlersStore corresponding the a childIndex. 
//    //
//    internal struct ChildEventDependent
//    {
//        internal int                ChildIndex; 
//        internal EventHandlersStore EventHandlersStore;
//    } 