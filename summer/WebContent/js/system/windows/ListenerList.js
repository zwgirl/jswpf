define(["dojo/_base/declare", "system/Type", "windows/WeakEventManager", "generic/Dictionary"], 
		function(declare, Type, WeakEventManager, Dictionary){
	var StaticSource = {"name" : "StaticSource"}; //new NamedObject("StaticSource");	
//    internal struct 
    var Listener = declare(Object, { 
        constructor:function(/*object*/ target, /*Delegate*/ handler) 
        {
        	if(handler === undefined){
        		handler = null;
        	}
        	
            if (target == null) 
                this._target = StaticSource;
            else
            	this._target = target; 
            
            this._handler = handler; 
        },

//        public bool 
        Matches:function(/*object*/ target, /*Delegate*/ handler)
        {
            return Object.ReferenceEquals(target, this.Target) &&
                    Object.Equals(handler, this.Handler); 
        }
    });
    
    Object.defineProperties(Listener.prototype, {
//        public object
    	Target: { get:function() { return this._target; } }, 
//        public Delegate 
    	Handler: { get:function() { return this._handler;} },
//        public bool 
    	HasHandler: { get:function() { return this._handler != null; } }
    });

    /// <summary> 
    /// This class implements the most common data that a simple manager 
    /// might want to store for a given source:  a list of weak references
    /// to the listeners. 
    /// </summary>
//    protected class 
    var ListenerList = declare(null,{
        /// <summary> 
        /// Create a new instance of ListenerList.
        /// </summary> 
        constructor:function() 
        {
            this._list = new FrugalObjectList/*<Listener>*/(); 
        },
        
        Get:function(index) { return this._list.Get(index); }, 

//        internal Listener 
        GetListener:function(/*int*/ index)
        {
            return this._list.Get(index);
        }, 

        /// <summary>
        /// Add the given listener to the list. 
        /// </summary>
//        public void 
        Add:function(/*IWeakEventListener*/ listener) 
        { 
            this._list.Add(new Listener(listener)); 
        },

        /// <summary>
        /// Remove the given listener from the list. 
        /// </summary>
//        public void 
        Remove:function(/*IWeakEventListener*/ listener) 
        { 
            for (var i=_list.Count-1; i>=0; --i) 
            {
                if (this._list.Get(i).Target == listener)
                {
                	this._list.RemoveAt(i); 
                    break;
                } 
            } 
        },

//        public void 
        AddHandler:function(/*Delegate*/ handler)
        {
            var target = handler.Target;
            if (target == null) 
                target = StaticSource; 

            // add a record to the main list 
            this._list.Add(new Listener(target, handler));

            this.AddHandlerToCWT(target, handler);
        }, 

//        void 
        AddHandlerToCWT:function(/*object*/ target, /*Delegate*/ handler) 
        { 
//            // add the handler to the CWT - this keeps the handler alive throughout
//            // the lifetime of the target, without prolonging the lifetime of 
//            // the target
//            var value;
//            if (!this._cwt.TryGetValue(target, /*out value*/valueOut))
//            { 
//                // 99% case - the target only listens once
//            	this._cwt.Add(target, handler); 
//            } 
//            else
//            { 
//                // 1% case - the target listens multiple times
//                // we store the delegates in a list
//                /*List<Delegate>*/var list = value instanceof List/*<Delegate>*/ ? value : null;
//                if (list == null) 
//                {
//                    // lazily allocate the list, and add the old handler 
//                    /*Delegate*/var oldHandler = value instanceof Delegate ? value : null; 
//                    list = new List/*<Delegate>*/();
//                    list.Add(oldHandler); 
//
//                    // install the list as the CWT value
//                    this._cwt.Remove(target);
//                    this._cwt.Add(target, list); 
//                }
//
//                // add the new handler to the list 
//                list.Add(handler);
//            } 
        },

//        public void 
        RemoveHandler:function(/*Delegate*/ handler)
        { 
            var value; 
            var target = handler.Target;
            if (target == null) 
                target = StaticSource;

            // remove the record from the main list
            for (var i=this._list.Count-1; i>=0; --i) 
            {
                if (this._list.Get(i).Matches(target, handler)) 
                { 
                	this._list.RemoveAt(i);
                    break; 
                }
            }

            // remove the handler from the CWT 
            if (this._cwt.TryGetValue(target, /*out value*/valueOut))
            { 
                /*List<Delegate>*/var list = value instanceof List/*<Delegate>*/ ? value : null; 
                if (list == null)
                { 
                    // 99% case - the target is removing its single handler
                	this._cwt.Remove(target);
                }
                else 
                {
                    // 1% case - the target had multiple handlers, and is removing one 
                    list.Remove(handler); 
                    if (list.Count == 0)
                    { 
                    	this._cwt.Remove(target);
                    }
                }
            } 
            else
            { 
                // target has been GC'd.  This probably can't happen, since the 
                // target initiates the Remove.  But if it does, there's nothing
                // to do - the target is removed from the CWT automatically, 
                // and the weak-ref in the main list will be removed
                // at the next Purge.
            }
        }, 

        /// <summary> 
        /// Add the given listener to the list. 
        /// </summary>
//        internal void 
        Add:function(/*Listener*/ listener) 
        {
            // no need to add if the listener has been GC'd 
            var target = listener.Target;
            if (target == null) 
                return; 

            this._list.Add(listener); 
            if (listener.HasHandler)
            {
            	this.AddHandlerToCWT(target, listener.Handler);
            } 
        },



//        public virtual bool 
        DeliverEvent:function(/*object*/ sender, /*EventArgs*/ args, /*Type*/ managerType)
        { 
            var foundStaleEntries = false;

            for (var k=0, n=this.Count; k<n; ++k) 
            {
                /*Listener*/var listener = this.GetListener(k); 
                foundStaleEntries |= this.DeliverEvent1(/*ref*/ listener, sender, args, managerType);
            }

            return foundStaleEntries; 
        },

//        internal bool 
        DeliverEvent1:function(/*ref Listener*/ listener, /*object*/ sender, /*EventArgs*/ args, /*Type*/ managerType) 
        {
            var target = listener.Target; 
            var entryIsStale = (target == null);

            if (!entryIsStale)
            { 
                if (listener.HasHandler)
                { 
                    /*EventHandler*/var handler = listener.Handler; 
                    if (handler != null)
                    { 
                        handler.Invoke(sender, args);
                    }
                }
//                else 
//                {
//                    // legacy (4.0) 
//                    /*IWeakEventListener*/var iwel = target instanceof IWeakEventListener ? target : null; 
//                    if (iwel != null)
//                    { 
//                        var handled = iwel.ReceiveWeakEvent(managerType, sender, args);
//
//                        // if the event isn't handled, something is seriously wrong.  This
//                        // means a listener registered to receive the event, but refused to 
//                        // handle it when it was delivered.  Such a listener is coded incorrectly.
//                        if (!handled) 
//                        { 
//                            Invariant.Assert(handled,
//                                        SR.Get(SRID.ListenerDidNotHandleEvent), 
//                                        SR.Get(SRID.ListenerDidNotHandleEventDetail, iwel.GetType(), managerType));
//                        }
//                    }
//                } 
            }

            return entryIsStale; 
        },

//        /// <summary>
//        /// Purge the list of stale entries.  Returns true if any stale
//        /// entries were purged.
//        /// </summary> 
////        public bool 
//        Purge:function()
//        { 
//            var foundDirt = false;
//
//            for (var j=_list.Count-1; j>=0; --j)
//            {
//                if (this._list[j].Target == null)
//                { 
//                	this._list.RemoveAt(j);
//                    foundDirt = true; 
//                } 
//            }
//
//            return foundDirt;
//        },

//        /// <summary> 
//        /// Return a copy of the list.
//        /// </summary> 
////        public virtual ListenerList 
//        Clone:function() 
//        {
//            /*ListenerList*/var result = new ListenerList(); 
//            CopyTo(result);
//            return result;
//        },

//        protected void 
        CopyTo:function(/*ListenerList*/ newList)
        { 
            /*IWeakEventListener*/var iwel; 

            for (var k=0, n=Count; k<n; ++k) 
            {
                /*Listener*/var listener = this.GetListener(k);
                if (listener.Target != null)
                { 
                    if (listener.HasHandler)
                    { 
                        /*Delegate*/var handler = listener.Handler; 
                        if (handler != null)
                        { 
                            newList.AddHandler(handler);
                        }
                    }
                    else if ((iwel = listener.Target instanceof IWeakEventListener ? listener.Target : null) != null) 
                    {
                        newList.Add(iwel); 
                    } 
                }
            } 
        },

//        /// <summary>
//        /// Mark the list as 'in use'.  An event manager should call BeginUse() 
//        /// before iterating through the list to deliver an event to the listeners,
//        /// and should call EndUse() when it is done.  This prevents another 
//        /// user from modifying the list while the iteration is in progress. 
//        /// </summary>
//        /// <returns> True if the list is already in use.</returns> 
////        public bool 
//        BeginUse:function()
//        {
//            return (Interlocked.Increment(/*ref*/ _users) != 1);
//        }, 
//
//        /// <summary> 
//        /// Undo the effect of BeginUse(). 
//        /// </summary>
////        public void 
//        EndUse:function() 
//        {
//            Interlocked.Decrement(/*ref*/ _users);
//        }

//        private FrugalObjectList<Listener> _list;  // list of listeners
//        private int _users;     // number of active users 
//        private System.Runtime.CompilerServices.ConditionalWeakTable<object, object> 
//            _cwt = new System.Runtime.CompilerServices.ConditionalWeakTable<object, object>();
//
//        private static ListenerList s_empty = new ListenerList();
    });
    
    Object.defineProperties(ListenerList.prototype, {
    	     /// <summary> 
        /// Return the number of listeners. 
        /// </summary>
//        public int 
    	Count: 
        {
            get:function() { return this._list.Count; }
        },

        /// <summary>
        /// Return true if there are no listeners. 
        /// </summary> 
//        public bool 
    	IsEmpty:
        { 
            get:function() { return this._list.Count == 0; }
        },

        /// <summary> 
        /// An empty list of listeners.
        /// </summary> 
//        public static ListenerList 
        Empty: 
        {
            get:function() { return s_empty; } 
        }
    });
    
    ListenerList.StaticSource = StaticSource;
    
    ListenerList.Type = new Type("ListenerList", ListenerList, [Object.Type]);
    return ListenerList;
});
    
    /// <summary> 
    /// If the given list is in use (which means an event is currently
    /// being delivered), replace it with a clone.  The existing 
    /// users will finish delivering the event to the original list,
    /// without interference from changes to the new list.
    /// </summary>
    /// <returns> 
    /// True if the list was cloned.  Callers will probably want to
    /// insert the new list in their own data structures. 
    /// </returns> 
//    public static bool 
//    ListenerList.PrepareForWriting = function(/*ref ListenerList*/ list)
//    { 
//        var inUse = list.BeginUse();
//        list.EndUse();
//
//        if (inUse) 
//        {
//            list = list.Clone(); 
//        } 
//
//        return inUse; 
//    };
