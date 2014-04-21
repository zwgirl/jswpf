/**
 * EventHandlersStore
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventHandlerInfo", "utility/FrugalMap"], 
		function(declare, Type, RoutedEventHandlerInfo, FrugalMap){
	var EventHandlersStore = declare("EventHandlersStore", null,{
		constructor:function(/*EventHandlersStore*/ source)
        {
			if(source !==undefined){
				this._entries = source._entries;
			}else{
				this._entries = new FrugalMap();
			}
		},
		
          
        /// <summary>
        ///     Adds a Clr event handler for the
        ///     given EventPrivateKey to the store 
        /// </summary>
        /// <param name="key"> 
        ///     Private key for the event 
        /// </param>
        /// <param name="handler"> 
        ///     Event handler
        /// </param>
//        public void 
        Add:function(/*EventPrivateKey*/ key, /*Delegate*/ handler)
        { 
            if (key == null)
            { 
                throw new ArgumentNullException("key"); 
            }
            if (handler == null) 
            {
                throw new ArgumentNullException("handler");
            }
 
            // Get the entry corresponding to the given key
            var existingDelegate = this.Get(key); 
 
            if (existingDelegate == null)
            { 
                this._entries.Set(key.GlobalIndex, handler);
            }
            else
            { 
            	this._entries.Set(key.GlobalIndex, Delegate.Combine(existingDelegate, handler));
            } 
        }, 
        
//        // Returns Handlers for the given key 
//        internal FrugalObjectList<RoutedEventHandlerInfo> this[RoutedEvent key]
//        { 
//            get
//            {
//                Debug.Assert(key != null, "Search key cannot be null");
// 
//                object list = _entries[key.GlobalIndex];
//                if (list == DependencyProperty.UnsetValue) 
//                { 
//                    return null;
//                } 
//                else
//                {
//                    return (FrugalObjectList<RoutedEventHandlerInfo>)list;
//                } 
//            }
//        } 
        
        Get:function(/*RoutedEvent or EventPrivateKey*/ key)
        {
        	if(key instanceof RoutedEvent){
                var list = this._entries.Get(key.GlobalIndex);
                if (list == DependencyProperty.UnsetValue) 
                { 
                    return null;
                } 
                else
                {
                    return list;
                } 
        	} else if(key instanceof EventPrivateKey){
                var existingDelegate = this._entries.Get(key.GlobalIndex);
                if (existingDelegate == DependencyProperty.UnsetValue) 
                { 
                    return null;
                } 
                else
                {
                    return existingDelegate;
                } 
        	}
        	
        	throw new Error();
        },
        
//        internal Delegate this[EventPrivateKey key]
//        { 
//            get
//            {
//                Debug.Assert(key != null, "Search key cannot be null");
// 
//                object existingDelegate = _entries[key.GlobalIndex];
//                if (existingDelegate == DependencyProperty.UnsetValue) 
//                { 
//                    return null;
//                } 
//                else
//                {
//                    return (Delegate)existingDelegate;
//                } 
//            }
//        } 
        
//        Get:function(/*EventPrivateKey*/ key)
//        {
//            var existingDelegate = this._entries.Get(key.GlobalIndex);
//            if (existingDelegate == DependencyProperty.UnsetValue) 
//            { 
//                return null;
//            } 
//            else
//            {
//                return existingDelegate;
//            } 
//        },
        
        /// <summary>
        ///     Removes an instance of the specified
        ///     Clr event handler for the given
        ///     EventPrivateKey from the store 
        /// </summary>
        /// <param name="key"> 
        ///     Private key for the event 
        /// </param>
        /// <param name="handler"> 
        ///     Event handler
        /// </param>
        /// <remarks>
        ///     NOTE: This method does nothing if no 
        ///     matching handler instances are found
        ///     in the store 
        /// </remarks> 
//        public void 
        Remove:function(/*EventPrivateKey*/ key, /*Delegate*/ handler)
        { 
            if (key == null)
            {
                throw new ArgumentNullException("key");
            } 
            if (handler == null)
            { 
                throw new ArgumentNullException("handler"); 
            }
 
            // Get the entry corresponding to the given key
            /*Delegate*/var existingDelegate =  this.Get(key);
            if (existingDelegate != null)
            { 
                existingDelegate = Delegate.Remove(existingDelegate, handler);
                if (existingDelegate == null) 
                { 
                    // last handler for this event was removed -- reclaim space in
                    // underlying FrugalMap by setting value to DependencyProperty.UnsetValue 
                    this._entries.Set(key.GlobalIndex, DependencyProperty.UnsetValue);
                }
                else
                { 
                    this._entries.Set(key.GlobalIndex, existingDelegate);
                } 
            } 
        },
 
        /// <summary>
        ///     Adds a routed event handler for the given 
        ///     RoutedEvent to the store
        /// </summary> 
//        public void 
        AddRoutedEventHandler:function( 
            /*RoutedEvent*/ routedEvent,
            /*Delegate*/ handler, 
            /*bool*/ handledEventsToo)
        {
            if (routedEvent == null)
            { 
                throw new ArgumentNullException("routedEvent");
            } 
            if (handler == null) 
            {
                throw new ArgumentNullException("handler"); 
            }
            if (!routedEvent.IsLegalHandler(handler))
            {
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
            }
 
            // Create a new RoutedEventHandler 
            /*RoutedEventHandlerInfo*/var routedEventHandlerInfo =
                new RoutedEventHandlerInfo(handler, handledEventsToo); 

            // Get the entry corresponding to the given RoutedEvent
            /*FrugalObjectList<RoutedEventHandlerInfo>*/var handlers = this.Get(routedEvent);
            if (handlers == null) 
            {
                this._entries.Set(routedEvent.GlobalIndex, handlers = new FrugalObjectList/*<RoutedEventHandlerInfo>*/(1)); 
            } 

            // Add the RoutedEventHandlerInfo to the list 
            handlers.Add(routedEventHandlerInfo);
        },

        /// <summary> 
        ///     Removes an instance of the specified
        ///     routed event handler for the given 
        ///     RoutedEvent from the store 
        /// </summary>
        /// <remarks> 
        ///     NOTE: This method does nothing if no
        ///     matching handler instances are found
        ///     in the store
        /// </remarks> 
//        public void 
        RemoveRoutedEventHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
        { 
            if (routedEvent == null) 
            {
                throw new ArgumentNullException("routedEvent"); 
            }
            if (handler == null)
            {
                throw new ArgumentNullException("handler"); 
            }
            if (!routedEvent.IsLegalHandler(handler)) 
            { 
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal));
            } 

            // Get the entry corresponding to the given RoutedEvent
            /*FrugalObjectList<RoutedEventHandlerInfo>*/var handlers = this.Get(routedEvent);
            if (handlers != null && handlers.Count > 0) 
            {
                if ((handlers.Count == 1) && (handlers.Get(0).Handler == handler)) 
                { 
                    // this is the only handler for this event and it's being removed
                    // reclaim space in underlying FrugalMap by setting value to 
                    // DependencyProperty.UnsetValue
                    this._entries.Set(routedEvent.GlobalIndex, DependencyProperty.UnsetValue);
                }
                else 
                {
                    // When a matching instance is found remove it 
                    for (var i = 0; i < handlers.Count; i++) 
                    {
                        if (handlers.Get(i).Handler == handler) 
                        {
                            handlers.RemoveAt(i);
                            break;
                        } 
                    }
                } 
            } 
        },
 

        /// <summary>
        ///     Determines whether the given
        ///     RoutedEvent exists in the store. 
        /// </summary>
        /// <param name="routedEvent"> 
        ///     the RoutedEvent of the event. 
        /// </param>
 
//        public bool 
        Contains:function(/*RoutedEvent*/ routedEvent)
        {
            if (routedEvent == null)
            { 
                throw new ArgumentNullException("routedEvent");
            } 
 
            /*FrugalObjectList<RoutedEventHandlerInfo>*/var handlers = this.Get(routedEvent);
 
            return handlers != null && handlers.Count != 0;
        },
        
        /// <summary> 
        ///     Get all the event handlers in this store for the given routed event 
        /// </summary>
//        public RoutedEventHandlerInfo[] 
        GetRoutedEventHandlers:function(/*RoutedEvent*/ routedEvent) 
        {
            if (routedEvent == null)
            {
                throw new ArgumentNullException("routedEvent"); 
            }
 
            /*FrugalObjectList<RoutedEventHandlerInfo>*/ handlers = this.Get(routedEvent); 
            if (handlers != null)
            { 
                return handlers.ToArray();
            }

            return null; 
        }
 
 
	});
	
	Object.defineProperties(EventHandlersStore.prototype,{
		 
//        internal int 
        Count:
        { 
            get:function()
            {
                return this._entries.Count;
            } 
        }
	});
	
//    private static void 
//	function OnEventHandlersIterationCallback(/*ArrayList*/ list, /*int*/ key, /*object*/ value) 
//    { 
//        /*RoutedEvent*/var routedEvent = GlobalEventManager.EventFromGlobalIndex(key);
//        routedEvent = routedEvent instanceof RoutedEvent ? routedEvent : null;
//        if (routedEvent != null && (/*(FrugalObjectList<RoutedEventHandlerInfo>)*/value).Count > 0) 
//        {
//            list.Add(routedEvent);
//        }
//    }
	
	EventHandlersStore.Type = new Type("EventHandlersStore", EventHandlersStore, [Object.Type]);
	return EventHandlersStore;
});
//        private static FrugalMapIterationCallback _iterationCallback = new FrugalMapIterationCallback(OnEventHandlersIterationCallback);


