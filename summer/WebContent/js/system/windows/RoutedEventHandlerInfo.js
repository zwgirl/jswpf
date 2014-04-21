/**
 * Second check 12-17
 * RoutedEventHandlerInfo
 */
//public struct 
define(["dojo/_base/declare", "system/Type", "windows/RoutedEventHandler"], 
		function(declare, Type, RoutedEventHandler){
	var RoutedEventHandlerInfo = declare("RoutedEventHandlerInfo", null,{
		constructor:function(/*Delegate*/ handler, /*bool*/ handledEventsToo)
        { 
            this._handler = handler;
            this._handledEventsToo = handledEventsToo;
		},
		
        // Invokes handler instance as per specified 
        // invocation preferences
//        internal void 
        InvokeHandler:function(/*object*/ target, /*RoutedEventArgs*/ routedEventArgs) 
        {
            if ((routedEventArgs.Handled == false) || (this._handledEventsToo == true))
            {
                if (this._handler instanceof RoutedEventHandler) 
                {
                    // Generic RoutedEventHandler is called directly here since 
                    //  we don't need the InvokeEventHandler override to cast to 
                    //  the proper type - we know what it is.
                    this._handler.Invoke(target, routedEventArgs); 
                }
                else
                {
                    // NOTE: Cannot call protected method InvokeEventHandler directly 
                    routedEventArgs.InvokeHandler(this._handler, target);
                } 
            } 
        },
        
        /// <summary>
        ///     Is the given object equivalent to the current one
        /// </summary>
//        public override bool 
        Equals:function(/*object*/ obj) 
        {
            if (obj == null || !(obj instanceof RoutedEventHandlerInfo)) 
                return false; 

            return this._handler == obj._handler && this._handledEventsToo == obj._handledEventsToo; 
        },

        /// <summary>
        ///     Serves as a hash function for a particular type, suitable for use in
        ///     hashing algorithms and data structures like a hash table 
        /// </summary>
//        public override int 
        GetHashCode:function() 
        { 
            return Object.prototype.GetHashCode.call(this);
        } 
	});
	
	Object.defineProperties(RoutedEventHandlerInfo.prototype,{
        /// <summary> 
        ///     Returns associated handler instance
        /// </summary>
//        public Delegate 
        Handler:
        { 
            get:function() {return this._handler;}
        }, 
 
        /// <summary>
        ///     Returns HandledEventsToo Flag 
        /// </summary>
//        public bool 
        InvokeHandledEventsToo:
        {
            get:function() {return this._handledEventsToo;} 
        }
	});
	
	RoutedEventHandlerInfo.Type = new Type("RoutedEventHandlerInfo", RoutedEventHandlerInfo, [Object.Type]);
	return RoutedEventHandlerInfo;
});

