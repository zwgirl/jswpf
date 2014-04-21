/**
 * MouseButtonEventArgs
 */

define(["dojo/_base/declare", "system/Type", "input/MouseEventArgs"], 
		function(declare, Type, MouseEventArgs){
	var MouseButtonEventArgs = declare("MouseButtonEventArgs", MouseEventArgs,{
  	 	"-chains-": {
  	      constructor: "manual"
  	    },
		constructor:function(event, state) 
		{ 
			InputEventArgs.prototype.constructor.call(this, InputManager.Current.PrimaryMouseDevice, event.timestamp);
			//MouseButtonUtilities.Validate(button); 
			
			this._button = event.button; 
			this._count = 1;
			this._state = state;
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
            /*MouseButtonEventHandler*/var handler = genericHandler;
            handler.Invoke(genericTarget, this); 
        } 
	});
	
	Object.defineProperties(MouseButtonEventArgs.prototype,{
		/// <summary>
        ///     Read-only access to the button being described. 
        /// </summary>
//        public MouseButton 
		ChangedButton: 
        { 
            get:function() {return this._button;}
        },

        /// <summary>
        ///     Read-only access to the button state.
        /// </summary> 
//        public MouseButtonState 
        ButtonState:
        { 
            get:function() 
            {
                switch(this._button)
                {
                    case MouseButton.Left: 
                        return this._state;
 
                    case MouseButton.Right:
                    	return this._state;

                    case MouseButton.Middle:
                    	return this._state;
 
                    case MouseButton.XButton1: 
                    	return this._state; 

                    case MouseButton.XButton2:
                    	return this._state;
                }
            }
        }, 

        /// <summary>
        ///     Read access to the button click count.
        /// </summary> 
//        public int 
        ClickCount:
        { 
            get:function() {return this._count;}, 
//            internal 
        	set:function(value) { this._count = value;}
        } 		  
	});
	
	Object.defineProperties(MouseButtonEventArgs,{
		  
	});
	
	MouseButtonEventArgs.Type = new Type("MouseButtonEventArgs", MouseButtonEventArgs, [MouseEventArgs.Type]);
	return MouseButtonEventArgs;
});


