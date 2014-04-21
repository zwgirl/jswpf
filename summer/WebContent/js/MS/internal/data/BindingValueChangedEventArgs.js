/**
 * BindingValueChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var BindingValueChangedEventArgs = declare("BindingValueChangedEventArgs", EventArgs,{
		constructor:function(/*object*/ oldValue, /*object*/ newValue) 
        {
            this._oldValue = oldValue;
            this._newValue = newValue;
        } 
	});
	
	Object.defineProperties(BindingValueChangedEventArgs.prototype,{
        /// <summary>
        /// The old value of the binding. 
        /// </summary>
//        public object 
		OldValue: 
        { 
            get:function() { return this._oldValue; }
        }, 

        /// <summary>
        /// The new value of the binding.
        /// </summary> 
//        public object 
        NewValue:
        { 
            get:function() { return this._newValue; } 
        }		  
	});
	
	BindingValueChangedEventArgs.Type = new Type("BindingValueChangedEventArgs", BindingValueChangedEventArgs,
			[EventArgs.Type]);
	return BindingValueChangedEventArgs;
});


