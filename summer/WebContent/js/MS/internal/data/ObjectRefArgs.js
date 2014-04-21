/**
 * Second Check 12-27
 * From ObjectRef
 * ObjectRefArgs
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ObjectRefArgs = declare("ObjectRefArgs", null,{
		constructor:function( ){
			this._isTracing = false;
			this._resolveNamesInTemplate = false;
			this._nameResolvedInOuterScope = false;
		}
	});
	
	Object.defineProperties(ObjectRefArgs.prototype,{
//	    internal bool 
	    IsTracing:
	    { 
	    	get:function(){
	    		return this._isTracing;
	    	},
	    	set:function(value){
	    		this._isTracing = value;
	    	}
	    }, 
//	    internal bool 
	    ResolveNamesInTemplate:
	    { 
	    	get:function(){
	    		return this._resolveNamesInTemplate;
	    	},
	    	set:function(value){
	    		this._resolveNamesInTemplate = value;
	    	}
	    },
//	    internal bool 
	    NameResolvedInOuterScope:
	    { 
	    	get:function(){
	    		return this._nameResolvedInOuterScope;
	    	},
	    	set:function(value){
	    		this._nameResolvedInOuterScope = value;
	    	}
	    }

	});
	
	ObjectRefArgs.Type = new Type("ObjectRefArgs", ObjectRefArgs, [Object.Type]);
	return ObjectRefArgs;
});
