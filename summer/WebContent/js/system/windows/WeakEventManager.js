/**
 * WeakEventManager
 */

define(["dojo/_base/declare", "system/Type", "threading/DispatcherObject", "internal/WeakEventTable",
        "windows/ListenerList"], 
		function(declare, Type, DispatcherObject, WeakEventTable,
				ListenerList){
	var StaticSource = ListenerList.StaticSource;
	var WeakEventManager = declare("WeakEventManager", DispatcherObject,{
		constructor:function(){
			this._table = WeakEventTable.CurrentWeakEventTable;
		},
		
        /// <summary>
        /// The data associated with the given source.  Subclasses chose 
        /// what to store here;  most commonly it is a ListenerList - a list
        /// of weak references to listeners. 
        /// </summary> 
        Get:function(source) { return this.Table.GetObject(this, source); },
        Set:function(source, value) { this.Table.SetObject(this, source, value); },	

        /// <summary>
        /// Return a new list to hold listeners to the event. 
        /// </summary>
//        protected virtual ListenerList 
        NewListenerList:function() 
        { 
            return new ListenerList();
        }, 

        /// <summary>
        /// Listen to the given source for the event.
        /// </summary> 
//        protected abstract void 
        StartListening:function(/*object*/ source){},
 
        /// <summary> 
        /// Stop listening to the given source for the event.
        /// </summary> 
//        protected abstract void 
        StopListening:function(/*object*/ source){},

        /// <summary>
        /// Discard the data associated with the given source 
        /// </summary>
//        protected void 
        Remove:function(/*object*/ source) 
        { 
            Table.Remove(this, source);
        }, 

        /// <summary>
        /// Add a listener to the given source for the event.
        /// </summary> 
//        protected void 
        ProtectedAddListener:function(/*object*/ source, /*IWeakEventListener*/ listener)
        { 
            if (listener == null) 
                throw new ArgumentNullException("listener");
 
            this.AddListener(source, listener, null);
        },

        /// <summary> 
        /// Remove a listener to the given source for the event.
        /// </summary> 
//        protected void 
        ProtectedRemoveListener:function(/*object*/ source, /*IWeakEventListener*/ listener) 
        {
            if (listener == null) 
                throw new ArgumentNullException("listener");

            this.RemoveListener(source, listener, null);
        }, 

        /// <summary> 
        /// Add a handler to the given source for the event. 
        /// </summary>
//        protected void 
        ProtectedAddHandler:function(/*object*/ source, /*Delegate*/ handler) 
        {
            if (handler == null)
                throw new ArgumentNullException("handler");
 
            this.AddListener(source, null, handler);
        }, 
 
        /// <summary>
        /// Remove a handler to the given source for the event. 
        /// </summary>
//        protected void 
        ProtectedRemoveHandler:function(/*object*/ source, /*Delegate*/ handler)
        {
            if (handler == null) 
                throw new ArgumentNullException("handler");
 
            this.RemoveListener(source, null, handler); 
        },
 
//        private void 
        AddListener:function(/*object*/ source, /*IWeakEventListener*/ listener, /*Delegate*/ handler)
        {
            var sourceKey = (source != null) ? source : StaticSource;
 
            /*ListenerList*/var list = this.Table.Get(this, sourceKey); 

            if (list == null) 
            {
                // no entry in the table - add a new one
                list = this.NewListenerList();
                this.Table.Set(this, sourceKey, list); 

                // listen for the desired event 
                this.StartListening(source); 
            }
 
//                // make sure list is ready for writing
//                if (ListenerList.PrepareForWriting(/*ref*/ list))
//                {
                    this.Table.Set(this, source, list); 
//                }
 
            // add a target to the list of listeners 
            if (handler != null)
            { 
                list.AddHandler(handler);
            }
            else
            { 
                list.Add(listener);
            } 
 
            // schedule a cleanup pass (heuristic (b) described above)
//            ScheduleCleanup(); 
        },

//        private void 
        RemoveListener:function(/*object*/ source, /*object*/ target, /*Delegate*/ handler) 
        {
            var sourceKey = (source != null) ? source : StaticSource; 
 
            /*ListenerList*/var list = this.Table.Get(this, sourceKey);

            if (list != null)
            { 
                // make sure list is ready for writing
                if (ListenerList.PrepareForWriting(/*ref*/ list)) 
                { 
                    Table[this, sourceKey] = list;
                } 

                // remove the target from the list of listeners
                if (handler != null)
                { 
                    list.RemoveHandler(handler);
                } 
                else 
                {
                    list.Remove(/*(IWeakEventListener)*/target); 
                }

                // after removing the last listener, stop listening
                if (list.IsEmpty) 
                {
                    this.Table.Remove(this, sourceKey); 
 
                    this.StopListening(source);
                } 
            }
        },
 
        /// <summary>
        /// Deliver an event to each listener. 
        /// </summary> 
//        protected void 
        DeliverEvent:function(/*object*/ sender, /*EventArgs*/ args)
        { 
            /*ListenerList*/ var list;
            var sourceKey = (sender != null) ? sender : StaticSource;

            // get the list of listeners 
            list = this.Table[this, sourceKey]; 
            if (list == null)
            { 
                list = ListenerList.Empty;
            }

            // mark the list "in use", even outside the read lock, 
            // so that any writers will know not to modify it (they'll
            // modify a clone intead). 
            list.BeginUse(); 
 
            // deliver the event, being sure to undo the effect of BeginUse().
            try
            {
            	this.DeliverEventToList(sender, args, list); 
            }
            finally 
            { 
                list.EndUse();
            } 
        },

        /// <summary>
        /// Deliver an event to the listeners on the given list 
        /// </summary>
//        protected void 
        DeliverEventToList:function(/*object*/ sender, /*EventArgs*/ args, /*ListenerList*/ list) 
        { 
            var foundStaleEntries = list.DeliverEvent(sender, args, this.GetType());
 
            // if we found stale entries, schedule a cleanup (heuristic b)
            if (foundStaleEntries)
            {
//                ScheduleCleanup(); 
            }
        } 
	});
	
	Object.defineProperties(WeakEventManager.prototype,{
//        private WeakEventTable 
        Table: 
        {
            get:function() { return this._table; }
        }
	});
	
	Object.defineProperties(WeakEventManager,{

        /// <summary>
        /// MethodInfo for the DeliverEvent method - used by generic WeakEventManager. 
        /// </summary> 
//        internal static MethodInfo 
		DeliverEventMethodInfo:
        { 
            get:function() { return s_DeliverEventMethodInfo; }
        }
	});
	
    // initialize static fields 
//    static WeakEventManager()
	WeakEventManager.Init = function()
    { 
        s_DeliverEventMethodInfo = typeof(WeakEventManager).GetMethod("DeliverEvent", BindingFlags.NonPublic | BindingFlags.Instance); 
    };

    /// <summary>
    /// Set the current manager for the given manager type. 
    /// </summary>
//    protected static void 
    WeakEventManager.SetCurrentManager = function(/*Type*/ managerType, /*WeakEventManager*/ manager) 
    { 
        var table = WeakEventTable.CurrentWeakEventTable;
        if(arguments.length ===2){
            table.Set(managerType, manager); 
        }else{  //function(/*Type*/ eventSourceType, /*string*/ eventName, /*WeakEventManager*/ manager)
            table.SetEventManager(arguments[0], arguments[1], arguments[2]); 
        }

    };
    
//    /// <summary>
//    /// Set the current manager for the given event. 
//    /// </summary>
////    internal static void 
//    WeakEventManager.SetCurrentManager = function(/*Type*/ eventSourceType, /*string*/ eventName, /*WeakEventManager*/ manager) 
//    { 
//        var table = WeakEventTable.CurrentWeakEventTable;
//        table.Set(eventSourceType, eventName, manager); 
//    };
    
    /// <summary>
    /// Get the current manager for the given manager type. 
    /// </summary>
//    protected static WeakEventManager 
    WeakEventManager.GetCurrentManager = function(/*Type*/ managerType) 
    { 
        /*WeakEventTable*/var table = WeakEventTable.CurrentWeakEventTable;
        if(arguments.length == 1){
            return table.Get(managerType); 
        }else{ //function(/*Type*/ eventSourceType, /*string*/ eventName) 
            return table.GetEventManager(eventSourceType, eventName); 
        }

    };

//    /// <summary>
//    /// Get the current manager for the given event. 
//    /// </summary>
////    internal static WeakEventManager 
//    WeakEventManager.GetCurrentManager = function(/*Type*/ eventSourceType, /*string*/ eventName) 
//    { 
//        /*WeakEventTable*/var table = WeakEventTable.CurrentWeakEventTable;
//        return table.GetEventManager(eventSourceType, eventName); 
//    };
	
	WeakEventManager.Type = new Type("WeakEventManager", WeakEventManager, [DispatcherObject.Type]);
	return WeakEventManager;
});
 






