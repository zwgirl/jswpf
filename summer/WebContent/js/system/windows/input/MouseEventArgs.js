/**
 * MouseEventArgs
 */

define(["dojo/_base/declare", "system/Type", "input/InputEventArgs", "input/InputManager"], 
		function(declare, Type, InputEventArgs, InputManager){
	var MouseEventArgs = declare("MouseEventArgs", InputEventArgs,{
  	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(/*MouseDevice mouse,*/event){
			InputEventArgs.prototype.constructor.call(this, InputManager.Current.PrimaryMouseDevice, event.timestamp);
			InputManager.Current.PrimaryMouseDevice.DOMEvent = event;
		},
		
        /// <summary>
        ///     Calculates the position of the mouse relative to 
        ///     a particular element. 
        /// </summary>
//        public Point 
        GetPosition:function(/*IInputElement*/ relativeTo) 
        {
            return this.MouseDevice.GetPosition(relativeTo);
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
            /*MouseEventHandler*/var handler = genericHandler; 
            handler.Invoke(genericTarget, this);
        }
	});
	
	Object.defineProperties(MouseEventArgs.prototype,{
	      /// <summary> 
        ///     Read-only access to the mouse device associated with this 
        ///     event.
        /// </summary> 
//        public MouseDevice 
		MouseDevice:
        {
            get:function() {return this.Device;}
        }, 
 
        /// <summary>
        ///     The state of the left button. 
        /// </summary> 
//        public MouseButtonState 
        LeftButton:
        { 
            get:function()
            {
                return this.MouseDevice.LeftButton;
            } 
        },
 
        /// <summary> 
        ///     The state of the right button.
        /// </summary> 
//        public MouseButtonState 
        RightButton:
        {
            get:function()
            { 
                return this.MouseDevice.RightButton;
            } 
        }, 

        /// <summary> 
        ///     The state of the middle button.
        /// </summary>
//        public MouseButtonState 
        MiddleButton:
        { 
            get:function()
            { 
                return this.MouseDevice.MiddleButton; 
            }
        }, 

        /// <summary>
        ///     The state of the first extended button.
        /// </summary> 
//        public MouseButtonState 
        XButton1:
        { 
            get:function() 
            {
                return this.MouseDevice.XButton1; 
            }
        },

        /// <summary> 
        ///     The state of the second extended button.
        /// </summary> 
//        public MouseButtonState 
        XButton2: 
        {
            get:function() 
            {
                return this.MouseDevice.XButton2;
            }
        } 
	});
	
	Object.defineProperties(MouseEventArgs,{
		  
	});
	
	MouseEventArgs.Type = new Type("MouseEventArgs", MouseEventArgs, [InputEventArgs.Type]);
	return MouseEventArgs;
});



