/**
 * from StyleHelper
 */

/**
 * ChildPropertyDependent
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ChildPropertyDependent = declare("ChildPropertyDependent", Object,{
	});
	
	Object.defineProperties(ChildPropertyDependent.prototype,{
//        public int                          
        ChildIndex:
        {
        	get:function(){
        		return this._childIndex;
        	},
        	set:function(value)
        	{
        		this._childIndex = value;
        	}
        },
//        public DependencyProperty           
        Property:
        {
        	get:function(){
        		return this._property;
        	},
        	set:function(value)
        	{
        		this._property = value;
        	}
        },	
//        public object                       
        Name: // When storing ResourceDependent, the name of the resource.
        {
        	get:function(){
        		return this._name;
        	},
        	set:function(value)
        	{
        		this._name = value;
        	}
        }
	});
	
	ChildPropertyDependent.Type = new Type("ChildPropertyDependent", ChildPropertyDependent, [Object.Type]);
	return ChildPropertyDependent;
});

//    //
//    //  Each item in the ChildPropertyDependents list and the ResourceDependents 
//    //  list is of this type.
//    //
//    //  PERF: Name is used only when storing a ResourceDependent.
//    //       Listener is used only when a Trigger has an invalidation listener 
//    //  Both are relatively rare.  Is there an optimization here?
//    internal struct ChildPropertyDependent 
//    { 
//        public int                          ChildIndex;
//        public DependencyProperty           Property; 
//        public object                       Name; // When storing ResourceDependent, the name of the resource.
//    }