/**
 * MouseWheelEventArgs
 */

define(["dojo/_base/declare", "system/Type", "input/MouseEventArgs"], 
		function(declare, Type, MouseEventArgs){
	
//	 private static int 
	var _delta = 0;
	var MouseWheelEventArgs = declare("MouseWheelEventArgs", MouseEventArgs,{
  	 	"-chains-": {
  	      constructor: "manual"
  	    },
		constructor:function(/*MouseDevice mouse,*/ event/*int timestamp, int delta*/)
        { 
			MouseEventArgs.prototype.constructor.call(this, event);
            _delta = event.wheelDelta;
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
            /*MouseWheelEventHandler*/var handler = genericHandler;
            handler.Invoke(genericTarget, this);
        }
	});
	
	Object.defineProperties(MouseWheelEventArgs.prototype,{
        /// <summary>
        ///     Read-only access to the amount the mouse wheel turned. 
        /// </summary>
//        public int 
		Delta:
        {
            get:function(){return _delta;} 
        }  
	});
	
	MouseWheelEventArgs.Type = new Type("MouseWheelEventArgs", MouseWheelEventArgs, [MouseEventArgs.Type]);
	return MouseWheelEventArgs;
});

