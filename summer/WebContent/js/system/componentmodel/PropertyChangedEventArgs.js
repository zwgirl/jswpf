/**
 * Second Check 12-19
 * PropertyChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], function(declare, Type, EventArgs){
	var PropertyChangedEventArgs = declare("PropertyChangedEventArgs", EventArgs,{
		constructor:function(/*string*/ propName) { 
            this.propertyName = propName; 
        }
	});
	
	Object.defineProperties(PropertyChangedEventArgs.prototype,{
		PropertyName:
		{
			get:function(){
				return this.propertyName; 
			}
		}
	});
	
	PropertyChangedEventArgs.Type = new Type("PropertyChangedEventArgs", PropertyChangedEventArgs, [EventArgs.Type]);
	return PropertyChangedEventArgs;
});

