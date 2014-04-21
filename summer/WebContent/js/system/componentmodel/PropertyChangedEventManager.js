/**
 * PropertyChangedEventManager
 */

define(["dojo/_base/declare", "system/Type", "windows/WeakEventManager", "componentmodel/PropertyChangedEventHandler",
        "windows/ListenerList"], 
		function(declare, Type, WeakEventManager, PropertyChangedEventHandler,
				ListenerList){
//	static readonly string 
	var AllListenersKey = "<All Listeners>"; // not a legal property name
	var PropertyChangedEventManager = declare("PropertyChangedEventManager", WeakEventManager,{
		constructor:function(){
//	        ListenerList 
			this._proposedAllListenersList = null;
		},
		
        /// <summary>
        /// Listen to the given source for the event. 
        /// </summary>
//        protected override void 
		StartListening:function(/*object*/ source) 
        { 
//            /*INotifyPropertyChanged*/var typedSource = source;
            source.PropertyChanged.Combine(new PropertyChangedEventHandler(this, this.OnPropertyChanged)); 
        },

        /// <summary>
        /// Stop listening to the given source for the event. 
        /// </summary>
//        protected override void 
		StopListening:function(/*object*/ source) 
        { 
//            /*INotifyPropertyChanged*/var typedSource = source;
			source.PropertyChanged.Remove(new PropertyChangedEventHandler(this, this.OnPropertyChanged)); 
        },

//        /// <summary>
//        /// Remove dead entries from the data for the given source.   Returns true if 
//        /// some entries were actually removed.
//        /// </summary> 
////        protected override bool 
//        Purge:function(object source, object data, bool purgeAll) 
//        {
//            bool foundDirt = false; 
//
//            if (!purgeAll)
//            {
//                HybridDictionary dict = (HybridDictionary)data; 
//
//                // copy the keys into a separate array, so that later on 
//                // we can change the dictionary while iterating over the keys 
//                ICollection ic = dict.Keys;
//                String[] keys = new String[ic.Count]; 
//                ic.CopyTo(keys, 0);
//
//                for (int i=keys.Length-1; i>=0; --i)
//                { 
//                    if (keys[i] == AllListenersKey)
//                        continue;       // ignore the special entry for now 
// 
//                    // for each key, remove dead entries in its list
//                    bool removeList = purgeAll || source == null; 
//
//                    if (!removeList)
//                    {
//                        ListenerList list = (ListenerList)dict[keys[i]]; 
//
//                        if (ListenerList.PrepareForWriting(ref list)) 
//                            dict[keys[i]] = list; 
//
//                        if (list.Purge()) 
//                            foundDirt = true;
//
//                        removeList = (list.IsEmpty);
//                    } 
//
//                    // if there are no more entries, remove the key 
//                    if (removeList) 
//                    {
//                        dict.Remove(keys[i]); 
//                    }
//                }
//
//                if (dict.Count == 0) 
//                {
//                    // if there are no more listeners at all, remove the entry from 
//                    // the main table, and prepare to stop listening 
//                    purgeAll = true;
//                    if (source != null)     // source may have been GC'd 
//                    {
//                        this.Remove(source);
//                    }
//                } 
//                else if (foundDirt)
//                { 
//                    // if any entries were purged, invalidate the special entry 
//                    dict.Remove(AllListenersKey);
//                    _proposedAllListenersList = null; 
//                }
//            }
//
//            if (purgeAll) 
//            {
//                // stop listening.  List cleanup is handled by Purge() 
//                if (source != null) // source may have been GC'd 
//                {
//                    StopListening(source); 
//                }
//                foundDirt = true;
//            }
// 
//            return foundDirt;
//        },
 
        // PropertyChanged is a special case - we superimpose per-property granularity 
        // on top of this event, by keeping separate lists of listeners for
        // each property. 

        // Add a listener to the named property (empty means "any property")
//        private void 
        PrivateAddListener:function(/*INotifyPropertyChanged*/ source, /*IWeakEventListener*/ listener, /*string*/ propertyName)
        { 
        	this.AddListener(source, propertyName, listener, null);
        }, 

        // Remove a listener to the named property (empty means "any property")
//        private void 
        PrivateRemoveListener:function(/*INotifyPropertyChanged*/ source, /*IWeakEventListener*/ listener, /*string*/ propertyName)
        { 
        	this.RemoveListener(source, propertyName, listener, null);
        }, 

        // Add a handler for the named property (empty means "any property")
//        private void 
        PrivateAddHandler:function(/*INotifyPropertyChanged*/ source, /*EventHandler<PropertyChangedEventArgs>*/ handler, /*string*/ propertyName)
        { 
        	this.AddListener(source, propertyName, null, handler);
        }, 
 
        // Remove a handler for the named property (empty means "any property")
//        private void 
        PrivateRemoveHandler:function(/*INotifyPropertyChanged*/ source, /*EventHandler<PropertyChangedEventArgs>*/ handler, /*string*/ propertyName) 
        {
        	this.RemoveListener(source, propertyName, null, handler);
        },
 
//        private void 
        AddListener:function(/*INotifyPropertyChanged*/ source, /*string*/ propertyName, /*IWeakEventListener*/ listener, 
        		/*EventHandler<PropertyChangedEventArgs>*/ handler)
        { 
            /*HybridDictionary*/var dict = this.Get(source); 

            if (dict == null)
            {
                // no entry in the hashtable - add a new one 
                dict = new HybridDictionary(true /* case insensitive */);
 
                this.Set(source, dict); 

                // listen for the desired events 
                this.StartListening(source);
            }

            /*ListenerList*/var list = dict.Get(propertyName); 

            if (list == null) 
            { 
            // no entry in the dictionary - add a new one
                list = new ListenerList/*<PropertyChangedEventArgs>*/(); 

                dict.Set(propertyName, list);
            }
 
            // make sure list is ready for writing
//            if (ListenerList.PrepareForWriting(/*ref*/ list)) 
//            { 
                dict.Set(propertyName, list);
//            } 

            // add a listener to the list
            if (handler != null)
            { 
//                /*ListenerList<PropertyChangedEventArgs>*/var hlist = list;
            	list.AddHandler(handler); 
            } 
            else
            { 
                list.Add(listener);
            }

            dict.Remove(AllListenersKey);   // invalidate list of all listeners 
            this._proposedAllListenersList = null;
 
            // schedule a cleanup pass 
//            ScheduleCleanup();
        },

//        private void 
        RemoveListener:function(/*INotifyPropertyChanged*/ source, /*string*/ propertyName, /*IWeakEventListener*/ listener, 
        		/*EventHandler<PropertyChangedEventArgs>*/ handler)
        { 
            /*HybridDictionary*/var dict = this.Get(source); 

            if (dict != null) 
            {
                /*ListenerList*/var list = dict.Get(propertyName);

                if (list != null) 
                {
                    // make sure list is ready for writing 
//                    if (ListenerList.PrepareForWriting(/*ref*/ list)) 
//                    {
                        dict.Set(propertyName, list); 
//                    }

                    // remove a listener from the list
                    if (handler != null) 
                    {
//                        /*ListenerList<PropertyChangedEventArgs>*/var hlist = list; 
                    	list.RemoveHandler(handler); 
                    }
                    else 
                    {
                        list.Remove(listener);
                    }
 
                        // when the last listener goes away, remove the list
                    if (list.IsEmpty) 
                    { 
                        dict.Remove(propertyName);
                    } 
                }

                if (dict.Count == 0)
                { 
                    this.StopListening(source);
 
                    this.Remove(source); 
                }
 
                dict.Remove(AllListenersKey);   // invalidate list of all listeners
                this._proposedAllListenersList = null;
            }
        },
 
        // event handler for PropertyChanged event 
//        private void 
        OnPropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ args)
        { 
            /*ListenerList*/var list;
            var propertyName = args.PropertyName;

            // get the list of listeners 
            // look up the list of listeners 
            /*HybridDictionary*/var dict = this.Get(sender);
 
            if (dict == null)
            {
                // this can happen when the last listener stops listening, but the
                // source raises the event on another thread after the dictionary 
                // has been removed (bug 1235351)
                list = ListenerList.Empty; 
            } 
            else if (!String.IsNullOrEmpty(propertyName))
            { 
                // source has changed a particular property.  Notify targets
                // who are listening either for this property or for all properties.
                /*ListenerList<PropertyChangedEventArgs>*/var listeners = dict.Get(propertyName);
                /*ListenerList<PropertyChangedEventArgs>*/var genericListeners = dict.Get(String.Empty); 

                if (genericListeners == null) 
                { 
                    if (listeners != null)
                    { 
                        list = listeners;           // only specific listeners
                    }
                    else
                    { 
                        list = ListenerList.Empty;  // no listeners at all
                    } 
                } 
                else
                { 
                    if (listeners != null)
                    {
                        // there are both specific and generic listeners -
                        // combine the two lists. 
                        list = new ListenerList/*<PropertyChangedEventArgs>*/(listeners.Count + genericListeners.Count);
                        for (var i=0, n=listeners.Count; i<n; ++i) 
                            list.Add(listeners.GetListener(i)); 
                        for (var i=0, n=genericListeners.Count; i<n; ++i)
                            list.Add(genericListeners.GetListener(i)); 
                    }
                    else
                    {
                        list = genericListeners;    // only generic listeners 
                    }
                } 
            } 
            else
            { 
                // source has changed all properties.  Notify all targets.
                // Use previously calculated combined list, if available.
                list = dict.Get(AllListenersKey);
 
                if (list == null)
                { 
                        // make one pass to compute the size of the combined list. 
                    // This avoids expensive reallocations.
                    var size = 0; 
                    for/*each*/(var i=0; i<dict.Count; i++) // (DictionaryEntry de in dict)
                    {
//                        Debug.Assert((String)de.Key != AllListenersKey, "special key should not appear");
                         size += dict.Get(i).Value.Count; 
                    }
 
                    // create the combined list 
                    list = new ListenerList/*<PropertyChangedEventArgs>*/(size);
 
                        // fill in the combined list
                    for/*each*/ (var i=0; i<dict.Count; i++) // (DictionaryEntry de in dict)
                    {
                        /*ListenerList*/var listeners = dict.Get(i).Value; 
                        for (var i=0, n=listeners.Count;  i<n;  ++i)
                        { 
                            list.Add(listeners.GetListener(i)); 
                        }
                    } 

                    // save the result for future use (see below)
                    this._proposedAllListenersList = list;
                } 
            }
 
            // mark the list "in use", even outside the read lock, 
            // so that any writers will know not to modify it (they'll
            // modify a clone intead). 
//            list.BeginUse();

            // deliver the event, being sure to undo the effect of BeginUse(). 
            try
            { 
                this.DeliverEventToList(sender, args, list); 
            }
            finally 
            {
//                list.EndUse();
            }
 
            // if we calculated an AllListeners list, we should now try to store
            // it in the dictionary so it can be used in the future.  This must be 
            // done under a WriteLock - which is why we didn't do it immediately. 
            if (this._proposedAllListenersList == list)
            { 
                // test again, in case another thread changed _proposedAllListersList.
                if (this._proposedAllListenersList == list) 
                {
                    /*HybridDictionary*/var dict = this.Get(sender); 
                    if (dict != null) 
                    {
                        dict.Set(AllListenersKey, list); 
                    }

                    this._proposedAllListenersList = null;
                } 

                // Another thread could have changed _proposedAllListersList 
                // since we set it (earlier in this method), either 
                // because it calculated a new one while handling a PropertyChanged(""),
                // or because it added/removed/purged a listener. 
                // In that case, we will simply abandon our proposed list and we'll
                // have to compute it again the next time.  But that only happens
                // if there's thread contention.  It's not worth doing something
                // more complicated just for that case. 
            } 
        } 
	});
	
	Object.defineProperties(PropertyChangedEventManager.prototype,{
		  
	});
	
	Object.defineProperties(PropertyChangedEventManager,{
        // get the event manager for the current thread 
//        private static PropertyChangedEventManager 
		CurrentManager:
        { 
            get:function()
            {
                var managerType = PropertyChangedEventManager.Type;
                var manager = WeakEventManager.GetCurrentManager(managerType); 

                // at first use, create and register a new manager 
                if (manager == null) 
                {
                    manager = new PropertyChangedEventManager(); 
                    WeakEventManager.SetCurrentManager(managerType, manager);
                }

                return manager; 
            }
        }   
	});
	
	/// <summary> 
    /// Add a listener to the given source's event.
    /// </summary>
//    public static void 
	PropertyChangedEventManager.AddListener = function(/*INotifyPropertyChanged*/ source, /*IWeakEventListener*/ listener, /*string*/ propertyName)
    { 
        if (source == null)
            throw new ArgumentNullException("source"); 
        if (listener == null) 
            throw new ArgumentNullException("listener");

        PropertyChangedEventManager.CurrentManager.PrivateAddListener(source, listener, propertyName);
    };

    /// <summary> 
    /// Remove a listener to the given source's event.
    /// </summary> 
//    public static void 
    PropertyChangedEventManager.RemoveListener = function(/*INotifyPropertyChanged*/ source, /*IWeakEventListener*/ listener, /*string*/ propertyName) 
    {
        /* for app-compat, allow RemoveListener(null, x) - it's a no-op (see Dev10 796788) 
        if (source == null)
            throw new ArgumentNullException("source");
        */
        if (listener == null) 
            throw new ArgumentNullException("listener");

        PropertyChangedEventManager.CurrentManager.PrivateRemoveListener(source, listener, propertyName); 
    };

    /// <summary>
    /// Add a handler for the given source's event.
    /// </summary>
//    public static void 
    PropertyChangedEventManager.AddHandler = function(/*INotifyPropertyChanged*/ source, /*EventHandler<PropertyChangedEventArgs>*/ handler, /*string*/ propertyName) 
    {
        if (handler == null) 
            throw new ArgumentNullException("handler"); 

        PropertyChangedEventManager.CurrentManager.PrivateAddHandler(source, handler, propertyName); 
    };

    /// <summary>
    /// Remove a handler for the given source's event. 
    /// </summary>
//    public static void 
    PropertyChangedEventManager.RemoveHandler = function(/*INotifyPropertyChanged*/ source, /*EventHandler<PropertyChangedEventArgs>*/ handler, /*string*/ propertyName) 
    { 
        if (handler == null)
            throw new ArgumentNullException("handler"); 

        PropertyChangedEventManager.CurrentManager.PrivateRemoveHandler(source, handler, propertyName);
    };
	
	PropertyChangedEventManager.Type = new Type("PropertyChangedEventManager", PropertyChangedEventManager, [WeakEventManager.Type]);
	return PropertyChangedEventManager;
});

       
 

