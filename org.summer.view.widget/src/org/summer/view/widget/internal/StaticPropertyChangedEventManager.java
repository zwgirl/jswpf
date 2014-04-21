package org.summer.view.widget.internal;


import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakEventManager;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.model.PropertyChangedEventArgs;
import org.summer.view.widget.reflection.EventInfo;
import org.summer.view.widget.reflection.MethodInfo;
/// <summary>
/// Manager for the INotifyPropertyChanged.PropertyChanged event. 
/// </summary>
/*internal*/ public class StaticPropertyChangedEventManager extends WeakEventManager 
{ 
//    #region Constructors

    //
    //  Constructors
    //

    private StaticPropertyChangedEventManager()
    { 
    } 

//    #endregion Constructors 

//    #region Public Methods

    // 
    //  Public Methods
    // 

    /// <summary>
    /// Add a handler for the given source's event. 
    /// </summary>
    public static void AddHandler(Type type, EventHandler<PropertyChangedEventArgs> handler, String propertyName)
    {
        if (type == null) 
            throw new ArgumentNullException("type");
        if (handler == null) 
            throw new ArgumentNullException("handler"); 

        CurrentManager.PrivateAddHandler(type, handler, propertyName); 
    }

    /// <summary>
    /// Remove a handler for the given source's event. 
    /// </summary>
    public static void RemoveHandler(Type type, EventHandler<PropertyChangedEventArgs> handler, String propertyName) 
    { 
        if (type == null)
            throw new ArgumentNullException("type"); 
        if (handler == null)
            throw new ArgumentNullException("handler");

        CurrentManager.PrivateRemoveHandler(type, handler, propertyName); 
    }

//    #endregion Public Methods 

//    #region Protected Methods 

    //
    //  Protected Methods
    // 

    /// <summary> 
    /// Return a new list to hold listeners to the event. 
    /// </summary>
    protected /*override*/ ListenerList NewListenerList() 
    {
        return new ListenerList<PropertyChangedEventArgs>();
    }

    /// <summary>
    /// Listen to the given source for the event. 
    /// </summary> 
    protected /*override*/ void StartListening(Object source)
    { 
        Debug.Assert(false, "Should never get here");
    }

    /// <summary> 
    /// Stop listening to the given source for the event.
    /// </summary> 
    protected /*override*/ void StopListening(Object source) 
    {
        Debug.Assert(false, "Should never get here"); 
    }

    /// <summary>
    /// Remove dead entries from the data for the given source.   Returns true if 
    /// some entries were actually removed.
    /// </summary> 
    protected /*override*/ boolean Purge(Object source, Object data, boolean purgeAll) 
    {
        TypeRecord typeRecord = (TypeRecord)data; 
        boolean foundDirt = typeRecord.Purge(purgeAll);

        if (!purgeAll && typeRecord.IsEmpty)
        { 
            Remove(typeRecord.Type);
        } 

        return foundDirt;
    } 

//    #endregion Protected Methods

//    #region Private Properties 

    // 
    //  Private Properties 
    //

    // get the event manager for the current thread
    private static StaticPropertyChangedEventManager CurrentManager
    {
        get 
        {
            Type managerType = typeof(StaticPropertyChangedEventManager); 
            StaticPropertyChangedEventManager manager = (StaticPropertyChangedEventManager)GetCurrentManager(managerType); 

            // at first use, create and register a new manager 
            if (manager == null)
            {
                manager = new StaticPropertyChangedEventManager();
                SetCurrentManager(managerType, manager); 
            }

            return manager; 
        }
    } 

//    #endregion Private Properties

//    #region Private Methods 

    // 
    //  Private Methods 
    //

    // PropertyChanged is a special case - we superimpose per-property granularity
    // on top of this event, by keeping separate lists of listeners for
    // each property.

    // Add a listener to the named property (empty means "any property")
    private void PrivateAddHandler(Type type, EventHandler<PropertyChangedEventArgs> handler, String propertyName) 
    { 
        Debug.Assert(handler != null && type != null && propertyName != null,
            "Handler, type, and propertyName of event cannot be null"); 

        using (WriteLock)
        {
            TypeRecord tr = (TypeRecord)this[type]; 

            if (tr == null) 
            { 
                // no entry in the hashtable - add a new one
                tr = new TypeRecord(type, this); 

                this[type] = tr;

                // listen for the desired events 
                tr.StartListening();
            } 

            tr.AddHandler(handler, propertyName);
        } 
    }

    // Remove a handler to the named property (empty means "any property")
    private void PrivateRemoveHandler(Type type, EventHandler<PropertyChangedEventArgs> handler, String propertyName) 
    {
        Debug.Assert(handler != null && type != null && propertyName != null, 
            "Handler, type, and propertyName of event cannot be null"); 

        using (WriteLock) 
        {
            TypeRecord tr = (TypeRecord)this[type];

            if (tr != null) 
            {
                tr.RemoveHandler(handler, propertyName); 

                if (tr.IsEmpty)
                { 
                    tr.StopListening();
                    Remove(tr.Type);
                }
            } 
        }
    } 


    // event handler for PropertyChanged event 
    private void OnStaticPropertyChanged(TypeRecord typeRecord, PropertyChangedEventArgs args)
    {
        ListenerList list;

        // get the list of listeners
        using (ReadLock) 
        { 
            list = typeRecord.GetListenerList(args.PropertyName);

            // mark the list "in use", even outside the read lock,
            // so that any writers will know not to modify it (they'll
            // modify a clone intead).
            list.BeginUse(); 
        }

        // deliver the event, being sure to undo the effect of BeginUse(). 
        try
        { 
            DeliverEventToList(null, args, list);
        }
        finally
        { 
            list.EndUse();
        } 

        // if we calculated an AllListeners list, we should now try to store
        // it in the dictionary so it can be used in the future.  This must be 
        // done under a WriteLock - which is why we didn't do it immediately.
        if (list == typeRecord.ProposedAllListenersList)
        {
            using (WriteLock) 
            {
                typeRecord.StoreAllListenersList((ListenerList<PropertyChangedEventArgs>)list); 
            } 
        }
    } 

//    #endregion Private Methods

    static final String AllListenersKey = "<All Listeners>"; // not a legal property name 
    static final String StaticPropertyChanged = "StaticPropertyChanged";

//    #region TypeRecord 

    class TypeRecord 
    {
        public TypeRecord(Type type, StaticPropertyChangedEventManager manager)
        {
            _type = type; 
            _manager = manager;
            _dict = new HybridDictionary(true); 
        } 

        public Type Type { get { return _type; } } 
        public boolean IsEmpty { get { return (_dict.Count == 0); } }
        public ListenerList ProposedAllListenersList { get { return _proposedAllListenersList; } }

        static MethodInfo OnStaticPropertyChangedMethodInfo 
        {
            get 
            { 
                return typeof(TypeRecord).GetMethod("OnStaticPropertyChanged", BindingFlags.Instance | BindingFlags.NonPublic);
            } 
        }

        public void StartListening()
        { 
            EventInfo spcEvent = _type.GetEvent(StaticPropertyChanged, BindingFlags.Public | BindingFlags.Static);
            if (spcEvent != null) 
            { 
                Delegate d = Delegate.CreateDelegate(spcEvent.EventHandlerType, this, OnStaticPropertyChangedMethodInfo);
                spcEvent.AddEventHandler(null, d); 
            }
        }

        public void StopListening() 
        {
            EventInfo spcEvent = _type.GetEvent(StaticPropertyChanged, BindingFlags.Public | BindingFlags.Static); 
            if (spcEvent != null) 
            {
                Delegate d = Delegate.CreateDelegate(spcEvent.EventHandlerType, this, OnStaticPropertyChangedMethodInfo); 
                spcEvent.RemoveEventHandler(null, d);
            }
        }

        void OnStaticPropertyChanged(Object sender, PropertyChangedEventArgs e)
        { 
            HandleStaticPropertyChanged(e); 
        }

        public void HandleStaticPropertyChanged(PropertyChangedEventArgs e)
        {
            _manager.OnStaticPropertyChanged(this, e);
        } 

        public void AddHandler(EventHandler<PropertyChangedEventArgs> handler, String propertyName) 
        { 
            PropertyRecord pr = (PropertyRecord)_dict[propertyName];

            if (pr == null)
            {
                // no entry in the dictionary - add a new one
                pr = new PropertyRecord(propertyName, this); 
                _dict[propertyName] = pr;
                pr.StartListening(_type); 
            } 

            pr.AddHandler(handler); 

            // invalidate list of all listeners
            _dict.Remove(AllListenersKey);
            _proposedAllListenersList = null; 

            // schedule a cleanup pass 
            _manager.ScheduleCleanup(); 
        }

        public void RemoveHandler(EventHandler<PropertyChangedEventArgs> handler, String propertyName)
        {
            PropertyRecord pr = (PropertyRecord)_dict[propertyName];

            if (pr != null)
            { 
                pr.RemoveHandler(handler); 

                if (pr.IsEmpty) 
                {
                    _dict.Remove(propertyName);
                }

                // invalidate list of all listeners
                _dict.Remove(AllListenersKey); 
                _proposedAllListenersList = null; 
            }
        } 

        public ListenerList GetListenerList(String propertyName)
        {
            ListenerList list; 

            if (!String.IsNullOrEmpty(propertyName)) 
            { 
                // source has changed a particular property.  Notify targets
                // who are listening either for this property or for all properties. 
                PropertyRecord pr = (PropertyRecord)_dict[propertyName];
                ListenerList<PropertyChangedEventArgs> listeners = (pr == null) ? null : pr.List;
                PropertyRecord genericRecord = (PropertyRecord)_dict[String.Empty];
                ListenerList<PropertyChangedEventArgs> genericListeners = (genericRecord == null) ? null : genericRecord.List; 

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
                        list = new ListenerList<PropertyChangedEventArgs>(listeners.Count + genericListeners.Count);
                        for (int i=0, n=listeners.Count; i<n; ++i) 
                            list.Add(listeners[i]); 
                        for (int i=0, n=genericListeners.Count; i<n; ++i)
                            list.Add(genericListeners[i]); 
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
                PropertyRecord pr = (PropertyRecord)_dict[AllListenersKey];
                ListenerList<PropertyChangedEventArgs> pcList = (pr == null) ? null : pr.List; 

                if (pcList == null) 
                { 
                    // make one pass to compute the size of the combined list.
                    // This avoids expensive reallocations. 
                    int size = 0;
                    foreach (DictionaryEntry de in _dict)
                    {
                        Debug.Assert((String)de.Key != AllListenersKey, "special key should not appear"); 
                        size += ((PropertyRecord)de.Value).List.Count;
                    } 

                    // create the combined list
                    pcList = new ListenerList<PropertyChangedEventArgs>(size); 

                    // fill in the combined list
                    foreach (DictionaryEntry de in _dict)
                    { 
                        ListenerList listeners = ((PropertyRecord)de.Value).List;
                        for (int i=0, n=listeners.Count;  i<n;  ++i) 
                        { 
                            pcList.Add(listeners.GetListener(i));
                        } 
                    }

                    // save the result for future use (see below)
                    _proposedAllListenersList = pcList; 
                }

                list = pcList; 
            }

            return list;
        }

        public void StoreAllListenersList(ListenerList<PropertyChangedEventArgs> list) 
        {
            // test again, in case another thread changed _proposedAllListersList. 
            if (_proposedAllListenersList == list) 
            {
                _dict[AllListenersKey] = new PropertyRecord(AllListenersKey, this, list); 

                _proposedAllListenersList = null;
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

        public boolean Purge(boolean purgeAll) 
        { 
            boolean foundDirt = false;

            if (!purgeAll)
            {
                // copy the keys into a separate array, so that later on
                // we can change the dictionary while iterating over the keys 
                ICollection ic = _dict.Keys;
                String[] keys = new String[ic.Count]; 
                ic.CopyTo(keys, 0); 

                for (int i=keys.Length-1; i>=0; --i) 
                {
                    if (keys[i] == AllListenersKey)
                        continue;       // ignore the special entry for now

                    // for each key, remove dead entries in its list
                    PropertyRecord pr = (PropertyRecord)_dict[keys[i]]; 
                    if (pr.Purge()) 
                    {
                        foundDirt = true; 
                    }

                    // if there are no more entries, remove the key
                    if (pr.IsEmpty) 
                    {
                        pr.StopListening(_type); 
                        _dict.Remove(keys[i]); 
                    }
                } 

                if (foundDirt)
                {
                    // if any entries were purged, invalidate the special entry 
                    _dict.Remove(AllListenersKey);
                    _proposedAllListenersList = null; 
                } 

                if (IsEmpty) 
                {
                    StopListening();
                }
            } 
            else
            { 
                // stop listening.  List cleanup is handled by Purge() 
                foundDirt = true;
                StopListening(); 

                foreach (DictionaryEntry de in _dict)
                {
                    PropertyRecord pr = (PropertyRecord)de.Value; 
                    pr.StopListening(_type);
                } 
            } 

            return foundDirt; 
        }

        Type _type;                 // the type whose static property-changes we're listening to
        HybridDictionary _dict;     // Property-name -> PropertyRecord 
        StaticPropertyChangedEventManager _manager; // owner
        ListenerList<PropertyChangedEventArgs> _proposedAllListenersList; 
    } 

    #endregion TypeRecord 

    #region PropertyRecord

    class PropertyRecord 
    {
        public PropertyRecord(String propertyName, TypeRecord owner) 
            : this(propertyName, owner, new ListenerList<PropertyChangedEventArgs>()) 
        {
        } 

        public PropertyRecord(String propertyName, TypeRecord owner, ListenerList<PropertyChangedEventArgs> list)
        {
            _propertyName = propertyName; 
            _typeRecord = owner;
            _list = list; 
        } 

        public boolean IsEmpty { get { return _list.IsEmpty; } } 
        public ListenerList<PropertyChangedEventArgs> List { get { return _list; } }

        static MethodInfo OnStaticPropertyChangedMethodInfo
        { 
            get
            { 
                return typeof(PropertyRecord).GetMethod("OnStaticPropertyChanged", BindingFlags.Instance | BindingFlags.NonPublic); 
            }
        } 

        public void StartListening(Type type)
        {
            String eventName = _propertyName + "Changed"; 
            EventInfo eventInfo = type.GetEvent(eventName, BindingFlags.Public | BindingFlags.Static);
            if (eventInfo != null) 
            { 
                Delegate d = Delegate.CreateDelegate(eventInfo.EventHandlerType, this, OnStaticPropertyChangedMethodInfo);
                eventInfo.AddEventHandler(null, d); 
            }
        }

        public void StopListening(Type type) 
        {
            String eventName = _propertyName + "Changed"; 
            EventInfo eventInfo = type.GetEvent(eventName, BindingFlags.Public | BindingFlags.Static); 
            if (eventInfo != null)
            { 
                Delegate d = Delegate.CreateDelegate(eventInfo.EventHandlerType, this, OnStaticPropertyChangedMethodInfo);
                eventInfo.RemoveEventHandler(null, d);
            }
        } 

        void OnStaticPropertyChanged(Object sender, EventArgs e) 
        { 
            _typeRecord.HandleStaticPropertyChanged(new PropertyChangedEventArgs(_propertyName));
        } 

        public void AddHandler(EventHandler<PropertyChangedEventArgs> handler)
        {
            // make sure list is ready for writing 
            ListenerList list = _list;
            if (ListenerList.PrepareForWriting(ref list)) 
                _list = (ListenerList<PropertyChangedEventArgs>)list; 

            // add a listener to the list 
            _list.AddHandler(handler);
        }

        public void RemoveHandler(EventHandler<PropertyChangedEventArgs> handler) 
        {
            // make sure list is ready for writing 
            ListenerList list = _list; 
            if (ListenerList.PrepareForWriting(/*ref*/ list))
                _list = (ListenerList<PropertyChangedEventArgs>)list; 

            // remove a listener from the list
            _list.RemoveHandler(handler);
        } 

        public boolean Purge() 
        { 
            ListenerList list = _list;
            if (ListenerList.PrepareForWriting(/*ref*/ list)) 
                _list = (ListenerList<PropertyChangedEventArgs>)list;

            return _list.Purge();
        } 

        String          _propertyName; 
        ListenerList<PropertyChangedEventArgs> _list; 
        TypeRecord      _typeRecord;
    } 

//    #endregion PropertyRecord
}