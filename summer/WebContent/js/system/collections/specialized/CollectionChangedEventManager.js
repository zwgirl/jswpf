/**
 * CollectionChangedEventManager
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var CollectionChangedEventManager = declare("CollectionChangedEventManager", null,{
        /// <summary> 
        /// Return a new list to hold listeners to the event.
        /// </summary> 
//        protected override ListenerList 
        NewListenerList:function()
        {
            return new ListenerList/*<NotifyCollectionChangedEventArgs>*/();
        }, 

        /// <summary> 
        /// Listen to the given source for the event. 
        /// </summary>
//        protected override void 
        StartListening:function(/*object*/ source) 
        {
            /*INotifyCollectionChanged*/var typedSource = source;
            typedSource.CollectionChanged += new NotifyCollectionChangedEventHandler(OnCollectionChanged);
        }, 

        /// <summary> 
        /// Stop listening to the given source for the event. 
        /// </summary>
//        protected override void 
        StopListening:function(/*object*/ source) 
        {
            /*INotifyCollectionChanged*/var typedSource = source;
            typedSource.CollectionChanged -= new NotifyCollectionChangedEventHandler(OnCollectionChanged);
        },
 
        // event handler for CollectionChanged event
//        private void 
        OnCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ args) 
        { 
            DeliverEvent(sender, args);
        } 
	});
	
	Object.defineProperties(CollectionChangedEventManager.prototype,{
	});
	
	Object.defineProperties(CollectionChangedEventManager,{

        // get the event manager for the current thread
//        private static CollectionChangedEventManager 
        CurrentManager: 
        { 
            get:function()
            { 
                /*Type*/var managerType = CollectionChangedEventManager.Type;
                /*CollectionChangedEventManager*/
                var manager = GetCurrentManager(managerType);

                // at first use, create and register a new manager 
                if (manager == null)
                { 
                    manager = new CollectionChangedEventManager(); 
                    SetCurrentManager(managerType, manager);
                } 

                return manager;
            }
        } 
	});
	/// <summary>
    /// Add a listener to the given source's event. 
    /// </summary>
//    public static void 
    CollectionChangedEventManager.AddListener = function(/*INotifyCollectionChanged*/ source, /*IWeakEventListener*/ listener) 
    { 
        if (source == null)
            throw new ArgumentNullException("source"); 
        if (listener == null)
            throw new ArgumentNullException("listener");

        CurrentManager.ProtectedAddListener(source, listener); 
    };

    /// <summary> 
    /// Remove a listener to the given source's event.
    /// </summary> 
//    public static void 
    CollectionChangedEventManager.RemoveListener = function(/*INotifyCollectionChanged*/ source, /*IWeakEventListener*/ listener)
    {
        /* for app-compat, allow RemoveListener(null, x) - it's a no-op (see Dev10 796788)
        if (source == null) 
            throw new ArgumentNullException("source");
        */ 
        if (listener == null) 
            throw new ArgumentNullException("listener");

        CurrentManager.ProtectedRemoveListener(source, listener);
    };

    /// <summary> 
    /// Add a handler for the given source's event.
    /// </summary> 
//    public static void 
    CollectionChangedEventManager.AddHandler = function(/*INotifyCollectionChanged*/ source, /*EventHandler<NotifyCollectionChangedEventArgs>*/ handler) 
    {
        if (handler == null) 
            throw new ArgumentNullException("handler");

        CurrentManager.ProtectedAddHandler(source, handler);
    };

    /// <summary> 
    /// Remove a handler for the given source's event. 
    /// </summary>
//    public static void 
    CollectionChangedEventManager.RemoveHandler = function(/*INotifyCollectionChanged*/ source, /*EventHandler<NotifyCollectionChangedEventArgs>*/ handler) 
    {
        if (handler == null)
            throw new ArgumentNullException("handler");

        CurrentManager.ProtectedRemoveHandler(source, handler);
    };
    
	CollectionChangedEventManager.Type = new Type("CollectionChangedEventManager", CollectionChangedEventManager, [Object.Type]);
	return CollectionChangedEventManager;
});

        

