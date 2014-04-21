/**
 * from StyleHelper
 */

/**
 * BindingValueCache
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var BindingValueCache = declare("BindingValueCache", Object,{
	});
	
	Object.defineProperties(BindingValueCache.prototype,{
//        internal readonly Type   
        BindingValueType:
        {
        	get:function(){
        		return this._bindingValueType;
        	},
        	set:function(value){
        		this._bindingValueType = value;
        	}
        },
//        internal readonly object 
        ValueAsBindingValueType:
        {
        	get:function(){
        		return this._valueAsBindingValueType;
        	},
        	set:function(value){
        		this._valueAsBindingValueType = value;
        	}
        }
	});
	
	BindingValueCache.Type = new Type("BindingValueCache", BindingValueCache, [Object.Type]);
	return BindingValueCache;
});
//    // 
//    //  This is a data-structure used to prevent threading issues while setting 
//    //  BindingValueType and ValueAsBindingValueType as separate members.
//    // 
//    internal class BindingValueCache
//    {
//        internal BindingValueCache(Type bindingValueType, object valueAsBindingValueType)
//        { 
//            BindingValueType = bindingValueType;
//            ValueAsBindingValueType = valueAsBindingValueType; 
//        } 
//
//        internal readonly Type   BindingValueType; 
//        internal readonly object ValueAsBindingValueType;
//    }