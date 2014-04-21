/**
 * InputEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], 
		function(declare, Type, RoutedEventArgs){
	var InputEventArgs = declare("InputEventArgs", RoutedEventArgs,{
  	 	"-chains-": {
  	 		constructor: "manual"
  	    },
		constructor:function(/*InputDevice*/ inputDevice, /*int*/ timestamp) 
        {
			RoutedEventArgs.prototype.constructor.call(this);
            /* inputDevice parameter being null is valid*/ 
 	    /* timestamp parameter is valuetype, need not be checked */
            this._inputDevice = inputDevice;
            this._timestamp = timestamp;
        },
        
        /// <summary> 
        ///     The mechanism used to call the type-specific handler on the
        ///     target. 
        /// </summary>
        /// <param name="genericHandler">
        ///     The generic handler to call in a type-specific way.
        /// </param> 
        /// <param name="genericTarget">
        ///     The target to call the handler on. 
        /// </param> 
//        protected override void 
        InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            /*InputEventHandler*/var handler =  genericHandler;
            handler.Invoke(genericTarget, this);
        }
	});
	
	Object.defineProperties(InputEventArgs.prototype,{
	       /// <summary> 
        ///     Read-only access to the input device that initiated this 
        ///     event.
        /// </summary> 
//        public InputDevice 
		Device:
        {
            get:function() {return this._inputDevice;},
            /*internal */set:function(value) {this._inputDevice = value;} 
        },
 
        /// <summary> 
        ///     Read-only access to the input timestamp.
        /// </summary> 
//        public int 
        Timestamp:
        {
            get:function() {return this._timestamp;}
        } 		  
	});
	
	InputEventArgs.Type = new Type("InputEventArgs", InputEventArgs, [RoutedEventArgs.Type]);
	return InputEventArgs;
});
