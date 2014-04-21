/**
 * RoutedEventArgs
 */
/// <summary> 
///     The container for all state associated
///     with a RoutedEvent 
/// </summary> 
/// <remarks>
///     <see cref="RoutedEventArgs"/> 
///     constitutes the <para/>
///     <see cref="RoutedEventArgs.RoutedEvent"/>, <para/>
///     <see cref="RoutedEventArgs.Handled"/>, <para/>
///     <see cref="RoutedEventArgs.Source"/> and <para/> 
///     <see cref="RoutedEventArgs.OriginalSource"/> <para/>
///     <para/> 
/// 
///     Different <see cref="RoutedEventArgs"/>
///     can be used with a single <see cref="RoutedEvent"/> <para/> 
///     <para/>
///
///     The <see cref="RoutedEventArgs"/> is responsible
///     for packaging the <see cref="RoutedEvent"/>, 
///     providing extra event state info, and invoking the
///     handler associated with the RoutedEvent 
/// </remarks> 
define(["dojo/_base/declare", "system/Type", "system/EventArgs", "specialized/BitVector32"],
		function(declare, Type, EventArgs, BitVector32){

//    private const int 
	var HandledIndex = 1; 
//    private const int 
	var UserInitiatedIndex = 2;
//    private const int 
	var InvokingHandlerIndex = 4; 
	
	var RoutedEventArgs = declare("RoutedEventArgs", EventArgs, {
		constructor:function(/*RoutedEvent*/ routedEvent, /*object*/ source)
        { 
			if(routedEvent === undefined){
				routedEvent = null;
			}
			
			if(source === undefined){
				source = null;
			}
			
            this._routedEvent = routedEvent;
            this._source = this._originalSource = source;
            
//          private const int 
            this._handled   = false; 
//            private const int 
            this._userInitiated = false;
//            private const int 
            this._invokingHandler  = false; 

            ///<SecurityNote> 
            /// Critical - the UserInitiated flag value is critical.
            ///</SecurityNote> 
//            private BitVector32          
            this._flags = new BitVector32();
		},
		
	       /// <summary>
        ///     Changes the RoutedEvent assocatied with these RoutedEventArgs
        /// </summary>
        /// <remarks> 
        ///     Only used internally.  Added to support cracking generic MouseButtonDown/Up events
        ///     into MouseLeft/RightButtonDown/Up events. 
        /// </remarks> 
        /// <param name="newRoutedEvent">
        ///     The new RoutedEvent to associate with these RoutedEventArgs 
        /// </param>
//        internal void 
        OverrideRoutedEvent:function( /*RoutedEvent*/ newRoutedEvent )
        {
            this._routedEvent = newRoutedEvent; 
        },

        /// <summary> 
        ///     Changes the Source assocatied with these RoutedEventArgs
        /// </summary> 
        /// <remarks> 
        ///     Only used internally.  Added to support cracking generic MouseButtonDown/Up events
        ///     into MouseLeft/RightButtonDown/Up events. 
        /// </remarks>
        /// <param name="source">
        ///     The new object to associate as the source of these RoutedEventArgs
        /// </param> 
//        internal void 
        OverrideSource:function( /*object*/ source )
        { 
        	this._source = source; 
        },
        
        /// <summary> 
        ///     Invoked when the source of the event is set
        /// </summary> 
        /// <remarks>
        ///     Changing the source of an event can often
        ///     require updating the data within the event.
        ///     For this reason, the OnSource=  method is 
        ///     protected virtual and is meant to be
        ///     overridden by sub-classes of 
        ///     <see cref="RoutedEventArgs"/> <para/> 
        ///     Also see <see cref="RoutedEventArgs.Source"/>
        /// </remarks> 
        /// <param name="source">
        ///     The new value that the SourceProperty is being set to
        /// </param>
//        protected virtual void 
        OnSetSource:function(/*object*/ source) 
        {
        },
 
        /// <summary>
        ///     Invokes the generic handler with the 
        ///     appropriate arguments
        /// </summary>
        /// <remarks>
        ///     Is meant to be overridden by sub-classes of 
        ///     <see cref="RoutedEventArgs"/> to provide
        ///     more efficient invocation of their delegate 
        /// </remarks> 
        /// <param name="genericHandler">
        ///     Generic Handler to be invoked 
        /// </param>
        /// <param name="genericTarget">
        ///     Target on whom the Handler will be invoked
        /// </param> 
//        protected virtual void 
        InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget)
        { 
            if (genericHandler == null) 
            {
                throw new Error('ArgumentNullException("genericHandler")'); 
            }

            if (genericTarget == null)
            { 
                throw new Error('ArgumentNullException("genericTarget")');
            } 
 
            if (this._routedEvent == null)
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.RoutedEventArgsMustHaveRoutedEvent)');
            }

            this.InvokingHandler = true; 
            try
            { 
                if (genericHandler instanceof RoutedEventHandler) 
                {
                    /*((RoutedEventHandler)*/genericHandler.Invoke(genericTarget, this); 
                }
                else
                {
                    // Restricted Action - reflection permission required 
                    genericHandler.DynamicInvoke(/*new object[]*/ [genericTarget, this]);
                }
            } 
            finally
            { 
                this.InvokingHandler = false;
            }
        },

        // Calls the InvokeEventHandler protected
        // virtual method
        //
        // This method is needed because 
        // delegates are invoked from
        // RoutedEventHandler which is not a 
        // sub-class of RoutedEventArgs 
        // and hence cannot invoke protected
        // method RoutedEventArgs.FireEventHandler 
//        internal void 
        InvokeHandler:function(/*Delegate*/ handler, /*object*/ target)
        {
        	this.InvokingHandler = true;
 
            try
            { 
                this.InvokeEventHandler(handler, target); 
            }
            finally 
            {
            	this.InvokingHandler = false;
            }
        },

        /// <SecurityNote> 
        ///     Critical - access critical information, if this is a user initiated command 
        /// </SecurityNote>
//        internal void 
        MarkAsUserInitiated:function()
        {
            this._flags.Set(UserInitiatedIndex, true);
        }, 
        /// <SecurityNote> 
        ///     Critical - access critical information, if this is a user initiated command 
        ///     TreatAsSafe - clearing user initiated bit considered safe.
        /// </SecurityNote> 
//        internal void 
        ClearUserInitiated:function()
        {
        	this._flags.Set(UserInitiatedIndex, false); 
        }
	});
	
	Object.defineProperties(RoutedEventArgs.prototype,{
        /// <summary>
        ///     Returns the <see cref="RoutedEvent"/> associated 
        ///     with this <see cref="RoutedEventArgs"/>
        /// </summary>
        /// <remarks>
        ///     The <see cref="RoutedEvent"/> cannot be null 
        ///     at any time
        /// </remarks> 
//        public RoutedEvent 
        RoutedEvent: 
        {
            get:function() {return this._routedEvent;}, 
            set:function(value)
            {
                if (this.UserInitiated && this.InvokingHandler)
                    throw new Error('InvalidOperationException(SR.Get(SRID.RoutedEventCannotChangeWhileRouting)'); 

                this._routedEvent = value; 
            }
        },
        
        /// <summary> 
        ///     Returns a boolean flag indicating if or not this
        ///     RoutedEvent has been handled this far in the route 
        /// </summary>
        /// <remarks>
        ///     Initially starts with a false value before routing
        ///     has begun 
        /// </remarks>
        ///<SecurityNote> 
        /// Critical - _flags is critical due to UserInitiated value. 
        /// PublicOK - in this function we're not setting UserInitiated - we're setting Handled.
        ///</SecurityNote> 
//        public bool 
        Handled:
        {
            get:function() 
            {
                return this._handled ; 
            },

            set:function(value)
            {
                if (this._routedEvent == null)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.RoutedEventArgsMustHaveRoutedEvent)');
                } 
 

                // Note: We need to allow the caller to change the handled value
                // from true to false.
                // 
                // We are concerned about scenarios where a child element
                // listens to a high-level event (such as TextInput) while a 
                // parent element listens tp a low-level event such as KeyDown. 
                // In these scenarios, we want the parent to not respond to the
                // KeyDown event, in deference to the child. 
                //
                // Internally we implement this by asking the parent to only
                // respond to KeyDown events if they have focus.  This works
                // around the problem and is an example of an unofficial 
                // protocol coordinating the two elements.
                // 
                // But we imagine that there will be some cases we miss or 
                // that third parties introduce.  For these cases, we expect
                // that the application author may need to mark the KeyDown 
                // as handled in the child, and then reset the event to
                // being unhandled after the parent, so that default processing
                // and promotion still occur.
                // 
                // For more information see the following task:
                // 20284: Input promotion breaks down when lower level input is intercepted 
 
                this._handled = value;
                
                // Note: We need to allow the caller to change the handled value
                // from true to false.
                // 
                // We are concerned about scenarios where a child element
                // listens to a high-level event (such as TextInput) while a 
                // parent element listens tp a low-level event such as KeyDown. 
                // In these scenarios, we want the parent to not respond to the
                // KeyDown event, in deference to the child. 
                //
                // Internally we implement this by asking the parent to only
                // respond to KeyDown events if they have focus.  This works
                // around the problem and is an example of an unofficial 
                // protocol coordinating the two elements.
                // 
                // But we imagine that there will be some cases we miss or 
                // that third parties introduce.  For these cases, we expect
                // that the application author may need to mark the KeyDown 
                // as handled in the child, and then reset the event to
                // being unhandled after the parent, so that default processing
                // and promotion still occur.
                // 
                // For more information see the following task:
                // 20284: Input promotion breaks down when lower level input is intercepted 
 
                this._flags.Set(HandledIndex, value);
            }
        },
        /// <summary> 
        ///     Returns Source object that raised the RoutedEvent
        /// </summary> 
//        public object 
        Source: 
        {
            get:function() {return this._source;},
            set:function(value)
            {

                if (this.InvokingHandler && this.UserInitiated) 
                    throw new Error('InvalidOperationException(SR.Get(SRID.RoutedEventCannotChangeWhileRouting)');
 
                if (this._routedEvent == null) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.RoutedEventArgsMustHaveRoutedEvent)'); 
                }


                var source = value ; 
                if (this._source == null && this._originalSource == null)
                { 
                    // Gets here when it is the first time that the source is set. 
                    // This implies that this is also the original source of the event
                	this._source = this._originalSource = source; 
                	this.OnSetSource(source);
                }
                else if (this._source != source)
                { 
                    // This is the actiaon taken at all other times when the
                    // source is being set to a different value from what it was 
                	this._source = source; 
                	this.OnSetSource(source);
                } 
            }
        },
        
        /// <summary>
        ///     Returns OriginalSource object that raised the RoutedEvent
        /// </summary>
        /// <remarks> 
        ///     Always returns the OriginalSource object that raised the
        ///     RoutedEvent unlike <see cref="RoutedEventArgs.Source"/> 
        ///     that may vary under specific scenarios <para/> 
        ///     This property acquires its value once before the event
        ///     handlers are invoked and never changes then on 
        /// </remarks>
//        public object 
        OriginalSource:
        {
            get:function() {return this._originalSource;} 
        },
        
        ///<SecurityNote> 
        ///     Critical - access critical information, if this is a user initiated command 
        ///     TreatAsSafe - checking user initiated bit considered safe.
        ///</SecurityNote> 
//        internal bool 
        UserInitiated:
        {
            get:function()
            { 
            	if (this._flags.Get(UserInitiatedIndex)) 
                {
                    return true; //SecurityHelper.CallerHasUserInitiatedRoutedEventPermission(); 
                }
                return false;
            }
        },
        ///<SecurityNote> 
        /// Critical - _flags is critical due to UserInitiated value.
        /// TreatAsSafe - in this function we're not setting UserInitiated - we're setting InvokingHandler. 
        ///</SecurityNote>
//        private bool 
        InvokingHandler:
        {
            get:function()
            { 
            	return this._flags.Get(InvokingHandlerIndex); 
            },
            set:function(value)
            {
            	return this._flags.Set(InvokingHandlerIndex, value);
            } 
        }
	});
	
	RoutedEventArgs.Type = new Type("RoutedEventArgs", RoutedEventArgs, [EventArgs.Type]);
	return RoutedEventArgs;
});
