/**
 * RoutedPropertyChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs"], 
		function(declare, Type, RoutedEventArgs){
	var RoutedPropertyChangedEventArgs = declare("RoutedPropertyChangedEventArgs", RoutedEventArgs,{
   	 	"-chains-": {
   	 		constructor: "manual"
	    },
		constructor:function(/*T*/ oldValue, /*T*/ newValue, /*RoutedEvent*/ routedEvent){
			RoutedEventArgs.prototype.constructor.call(this);
			if(routedEvent === undefined){
				routedEvent = null;
			}
            this._oldValue = oldValue;
            this._newValue = newValue; 
            
            this.RoutedEvent = routedEvent;
		},
		
        /// <summary> 
        /// This method is used to perform the proper type casting in order to 
        /// call the type-safe RoutedPropertyChangedEventHandler delegate for the IsCheckedChangedEvent event.
        /// </summary> 
        /// <param name="genericHandler">The handler to invoke.</param>
        /// <param name="genericTarget">The current object along the event's route.</param>
        /// <returns>Nothing.</returns>
        /// <seealso cref="RoutedPropertyChangedEventHandler<T>" /> 
//        protected override void 
		InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            /*RoutedPropertyChangedEventHandler<T>*/var handler = genericHandler; 
            handler.Invoke(genericTarget, this);
        } 
	});
	
	Object.defineProperties(RoutedPropertyChangedEventArgs.prototype,{
        /// <summary>
        /// Return the old value 
        /// </summary>
//        public T
		OldValue:
        {
            get:function() { return this._oldValue; } 
        },
 
        /// <summary> 
        /// Return the new value
        /// </summary> 
//        public T 
		NewValue:
        {
            get:function() { return this._newValue; }
        } 		  
	});
	
	Object.defineProperties(RoutedPropertyChangedEventArgs,{
		  
	});
	
	RoutedPropertyChangedEventArgs.Type = new Type("RoutedPropertyChangedEventArgs", 
			RoutedPropertyChangedEventArgs, [RoutedEventArgs.Type]);
	return RoutedPropertyChangedEventArgs;
});

