/**
 * from StyleHelper
 */

/**
 * ContainerDependent
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ContainerDependent = declare("ContainerDependent", null,{

	});
	
	Object.defineProperties(ContainerDependent.prototype,{
//        internal DependencyProperty         
        Property:
        {
        	get:function(){
        		return this._property;
        	},
        	set:function(value){
        		this._property=value;
        	}
        },
//        internal bool                       
        FromVisualTrigger:{
        	get:function(){
        		return this._fromVisualTrigger;
        	},
        	set:function(value){
        		this._fromVisualTrigger = value;
        	}
        } 
	});
	
	ContainerDependent.Type = new Type("ContainerDependent", ContainerDependent, [Object.Type]);
	return ContainerDependent;
});
////
//    //  Each item in the ContainerDependents list is of this type. Stores the DP on 
//    //  the container that is dependent upon this style and whether that dp was set 
//    //  via Style.SetValue or TriggerBase.SetValue.
//    // 
//    internal struct ContainerDependent
//    {
//        internal DependencyProperty         Property;
//        internal bool                       FromVisualTrigger; 
//    }