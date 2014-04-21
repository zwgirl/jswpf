 /**
 * KeyboardEventArgs
 */

define(["dojo/_base/declare", "system/Type", "input/InputEventArgs"], 
		function(declare, Type, InputEventArgs){
	var KeyboardEventArgs = declare("KeyboardEventArgs", InputEventArgs,{
  	 	"-chains-": {
  	 		constructor: "manual"
  	    },
		constructor:function(event){
			InputEventArgs.prototype.constructor.call(this, InputManager.Current.PrimaryKeyboardDevice, null);
			InputManager.Current.PrimaryKeyboardDevice.DOMEvent = event;
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
        /// <ExternalAPI/> 
//        protected override void 
		InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            /*KeyboardEventHandler*/var handler = genericHandler;

            handler.Invoke(genericTarget, this);
        } 
	});
	
	Object.defineProperties(KeyboardEventArgs.prototype,{

        /// <summary> 
        ///     Read-only access to the logical keyboard device associated with 
        ///     this event.
        /// </summary> 
//        public KeyboardDevice 
		KeyboardDevice:
        {
            get:function() {return this.Device;}
        },
        
	});
	
	Object.defineProperties(KeyboardEventArgs,{
		  
	});
	
	KeyboardEventArgs.Type = new Type("KeyboardEventArgs", KeyboardEventArgs, [InputEventArgs.Type]);
	return KeyboardEventArgs;
});

