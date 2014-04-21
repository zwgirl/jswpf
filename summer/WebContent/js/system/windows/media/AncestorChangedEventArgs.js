/**
 * AncestorChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var AncestorChangedEventArgs = declare("AncestorChangedEventArgs", Object,{
		constructor:function(/*DependencyObject*/ subRoot, /*DependencyObject*/ oldParent) 
        { 
            this._subRoot = subRoot;
            this._oldParent = oldParent; 
        }
	});
	
	Object.defineProperties(AncestorChangedEventArgs.prototype,{
//        public DependencyObject 
        Ancestor:
        { 
            get:function() { return this._subRoot; }
        }, 
 
//        public DependencyObject
        OldParent:
        { 
            get:function() { return this._oldParent; }
        }
	});
	
	AncestorChangedEventArgs.Type = new Type("AncestorChangedEventArgs", AncestorChangedEventArgs, [Object.Type]);
	return AncestorChangedEventArgs;
});
