/**
 * InheritedPropertyChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var InheritedPropertyChangedEventArgs = declare("InheritedPropertyChangedEventArgs", EventArgs,{
		constructor:function(/*ref InheritablePropertyChangeInfo*/ info) 
        {
            this._info = info;
		}
	});
	
	Object.defineProperties(InheritedPropertyChangedEventArgs.prototype,{
//        internal InheritablePropertyChangeInfo 
		Info:
        { 
            get:function() { return this._info; } 
        }  
	});
	
	InheritedPropertyChangedEventArgs.Type = new Type("InheritedPropertyChangedEventArgs", InheritedPropertyChangedEventArgs,
			[EventArgs.Type]);
	return InheritedPropertyChangedEventArgs;
});

