/**
 * InheritablePropertyChangeInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
//	struct
	var InheritablePropertyChangeInfo = declare("InheritablePropertyChangeInfo", null,{
		constructor:function( 
	            /*DependencyObject*/ rootElement,
	            /*DependencyProperty*/  property, 
	            /*EffectiveValueEntry*/ oldEntry,
	            /*EffectiveValueEntry*/ newEntry)
	    {
            this._rootElement = rootElement; 
            this._property = property;
            this._oldEntry = oldEntry; 
            this._newEntry = newEntry; 
	    },
	    
	});
	
	Object.defineProperties(InheritablePropertyChangeInfo.prototype,{
//	  	internal DependencyObject 
	  	RootElement:
        { 
            get:function() { return this._rootElement; } 
        },
 
//        internal DependencyProperty 
        Property:
        {
            get:function() { return this._property; }
        }, 

//        internal EffectiveValueEntry 
        OldEntry: 
        { 
            get:function() { return this._oldEntry; }
        }, 

//        internal EffectiveValueEntry 
        NewEntry:
        {
            get:function() { return this._newEntry; } 
        }
	});
	
	InheritablePropertyChangeInfo.Type = new Type("InheritablePropertyChangeInfo", InheritablePropertyChangeInfo, [Object.Type]);
	return InheritablePropertyChangeInfo;
});

