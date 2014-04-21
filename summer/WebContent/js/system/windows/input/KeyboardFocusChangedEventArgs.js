/**
 * KeyboardFocusChangedEventArgs
 */
/// <summary>
///     The KeyboardFocusChangedEventArgs class contains information about key states. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "input/KeyboardEventArgs"], 
		function(declare, Type, KeyboardEventArgs){
	var KeyboardFocusChangedEventArgs = declare("KeyboardFocusChangedEventArgs", KeyboardEventArgs,{
        /// <summary> 
        ///     Constructs an instance of the KeyboardFocusChangedEventArgs class.
        /// </summary> 
        /// <param name="keyboard"> 
        ///     The logical keyboard device associated with this event.
        /// </param> 
        /// <param name="timestamp">
        ///     The time when the input occured.
        /// </param>
        /// <param name="oldFocus"> 
        ///     The element that previously had focus.
        /// </param> 
        /// <param name="newFocus"> 
        ///     The element that now has focus.
        /// </param> 
        constructor:function(event, 
        		/*IInputElement*/ oldFocus, /*IInputElement*/ newFocus)
        {
			KeyboardEventArgs.prototype.constructor.call(this, event);
	
            if (oldFocus != null && !InputElement.IsValid(oldFocus))
                throw new InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, oldFocus.GetType())); 

            if (newFocus != null && !InputElement.IsValid(newFocus)) 
                throw new InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, newFocus.GetType())); 

            this._oldFocus = oldFocus; 
            this._newFocus = newFocus;
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
            /*KeyboardFocusChangedEventHandler*/var handler = /*(KeyboardFocusChangedEventHandler)*/ genericHandler;
 
            handler.Invoke(genericTarget, this); 
        }
	});
	
	Object.defineProperties(KeyboardFocusChangedEventArgs.prototype,{
        /// <summary> 
        ///     The element that previously had focus.
        /// </summary> 
//        public IInputElement 
		OldFocus: 
        {
            get:function() {return this._oldFocus;} 
        },

        /// <summary>
        ///     The element that now has focus. 
        /// </summary>
//        public IInputElement 
        NewFocus: 
        { 
            get:function() {return this._newFocus;}
        }  
	});
	
	Object.defineProperties(KeyboardFocusChangedEventArgs,{
		  
	});
	
	KeyboardFocusChangedEventArgs.Type = new Type("KeyboardFocusChangedEventArgs", 
			KeyboardFocusChangedEventArgs, [KeyboardEventArgs.Type]);
	return KeyboardFocusChangedEventArgs;
});

