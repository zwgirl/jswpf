package org.summer.view.widget.internal;


import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakEventManager;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.model.PropertyDescriptor;

/// Manager for the Object.ValueChanged event. 
/// </summary> 
/*internal*/ public class ValueChangedEventManager extends WeakEventManager
{ 
//    #region Constructors

    //
    //  Constructors 
    //

    private ValueChangedEventManager() 
    {
    } 

//    #endregion Constructors

//    #region Public Methods 

    // 
    //  Public Methods 
    //

    /// <summary>
    /// Add a listener to the given source's event.
    /// </summary>
    public static void AddListener(Object source, IWeakEventListener listener, PropertyDescriptor pd) 
    {
        if (source == null) 
            throw new IllegalArgumentException("source"); 
        if (listener == null)
            throw new IllegalArgumentException("listener"); 

        CurrentManager.PrivateAddListener(source, listener, pd);
    }

    /// <summary>
    /// Remove a listener to the given source's event. 
    /// </summary> 
    public static void RemoveListener(Object source, IWeakEventListener listener, PropertyDescriptor pd)
    { 
        if (source == null)
            throw new IllegalArgumentException("source");
        if (listener == null)
            throw new IllegalArgumentException("listener"); 

        CurrentManager.PrivateRemoveListener(source, listener, pd); 
    } 

    /// <summary> 
    /// Add a handler for the given source's event.
    /// </summary>
    public static void AddHandler(Object source, EventHandler<ValueChangedEventArgs> handler, PropertyDescriptor pd)
    { 
        if (handler == null)
            throw new IllegalArgumentException("handler"); 
        if (handler.GetInvocationList().Length != 1) 
            throw new NotSupportedException(/*SR.Get(SRID.NoMulticastHandlers)*/);

        CurrentManager.PrivateAddHandler(source, handler, pd);
    }

    /// <summary> 
    /// Remove a handler for the given source's event.
    /// </summary> 
    public static void RemoveHandler(Object source, EventHandler<ValueChangedEventArgs> handler, PropertyDescriptor pd) 
    {
        if (handler == null) 
            throw new IllegalArgumentException("handler");
        if (handler.GetInvocationList().Length != 1)
            throw new NotSupportedException(/*SR.Get(SRID.NoMulticastHandlers)*/);

        CurrentManager.PrivateRemoveHandler(source, handler, pd);
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
        return new ListenerList<ValueChangedEventArgs>();
    } 

    // The next two methods need to be defined, but they're never called. 

    /// <summary>
    /// Listen to the given source for the event. 
    /// </summary>
    protected /*override*/ void StartListening(Object source)
    {
    } 

    /// <summary> 
    /// Stop listening to the given source for the event. 
    /// </summary>
    protected /*override*/ void StopListening(Object source) 
    {
    }

    /// <summary> 
    /// Remove dead entries from the data for the given source.   Returns true if
    /// some entries were actually removed. 
    /// </summary> 
    protected /*override*/ boolean Purge(Object source, Object data, boolean purgeAll)
    { 
        boolean foundDirt = false;

        HybridDictionary dict = (HybridDictionary)data;

        // copy the keys into a separate array, so that later on
        // we can change the dictionary while iterating over the keys 
        ICollection ic = dict.Keys; 
        PropertyDescriptor[] keys = new PropertyDescriptor[ic.Count];
        ic.CopyTo(keys, 0); 

        for (int i=keys.length-1; i>=0; --i)
        {
            // for each key, remove dead entries in its list 
            boolean removeList = purgeAll || source == null;

            ValueChangedRecord record = (ValueChangedRecord)dict[keys[i]]; 

            if (!removeList) 
            {
                if (record.Purge())
                    foundDirt = true;

                removeList = record.IsEmpty;
            } 

            // if there are no more entries, remove the key
            if (removeList) 
            {
                record.StopListening();
                if (!purgeAll)
                { 
                    dict.Remove(keys[i]);
                } 
            } 
        }

        // if there are no more listeners at all, remove the entry from
        // the main table
        if (dict.Count == 0)
        { 
            foundDirt = true;
            if (source != null)     // source may have been GC'd 
            { 
                this.Remove(source);
            } 
        }

        return foundDirt;
    } 

//    #endregion Protected Methods 

//    #region Private Properties

    //
    //  Private Properties
    //

    // get the event manager for the current thread
    private static ValueChangedEventManager CurrentManager 
    { 
        get
        { 
            Type managerType = typeof(ValueChangedEventManager);
            ValueChangedEventManager manager = (ValueChangedEventManager)GetCurrentManager(managerType);

            // at first use, create and register a new manager 
            if (manager == null)
            { 
                manager = new ValueChangedEventManager(); 
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

    // Add a listener to the given property
    private void PrivateAddListener(Object source, IWeakEventListener listener, PropertyDescriptor pd) 
    { 
//        Debug.Assert(listener != null && source != null && pd != null,
//            "Listener, source, and pd of event cannot be null"); 
        AddListener(source, pd, listener, null);
    }

    // Remove a listener to the given property 
    private void PrivateRemoveListener(Object source, IWeakEventListener listener, PropertyDescriptor pd)
    { 
//        Debug.Assert(listener != null && source != null && pd != null, 
//            "Listener, source, and pd of event cannot be null");
        RemoveListener(source, pd, listener, null); 
    }

    // Add a handler for the given property
    private void PrivateAddHandler(Object source, EventHandler<ValueChangedEventArgs> handler, PropertyDescriptor pd) 
    {
        AddListener(source, pd, null, handler); 
    } 

    // Remove a handler for the given property 
    private void PrivateRemoveHandler(Object source, EventHandler<ValueChangedEventArgs> handler, PropertyDescriptor pd)
    {
        RemoveListener(source, pd, null, handler);
    } 

    private void AddListener(Object source, PropertyDescriptor pd, IWeakEventListener listener, EventHandler<ValueChangedEventArgs> handler) 
    { 
//        using (WriteLock)  //cym  comment
        { 
            HybridDictionary dict = (HybridDictionary)this[source];

            if (dict == null)
            { 
                // no entry in the hashtable - add a new one
                dict = new HybridDictionary(); 

                this[source] = dict;
            } 

            ValueChangedRecord record = (ValueChangedRecord)dict[pd];

            if (record == null) 
            {
                // no entry in the dictionary - add a new one 
                record = new ValueChangedRecord(this, source, pd); 

                dict[pd] = record; 
            }

            // add a listener to the list
            record.Add(listener, handler); 

            // schedule a cleanup pass 
            ScheduleCleanup(); 
        }
    } 

    private void RemoveListener(Object source, PropertyDescriptor pd, IWeakEventListener listener, EventHandler<ValueChangedEventArgs> handler)
    {
        using (WriteLock) 
        {
            HybridDictionary dict = (HybridDictionary)this[source]; 

            if (dict != null)
            { 
                ValueChangedRecord record = (ValueChangedRecord)dict[pd];

                if (record != null)
                { 
                    // remove a listener from the list
                    record.Remove(listener, handler); 

                    // when the last listener goes away, remove the list
                    if (record.IsEmpty) 
                    {
                        dict.Remove(pd);
                    }
                } 

                if (dict.Count == 0) 
                { 
                    Remove(source);
                } 
            }
        }
    }

//    #endregion Private Methods

//    #region ValueChangedRecord 

    private class ValueChangedRecord 
    {
        public ValueChangedRecord(ValueChangedEventManager manager, Object source, PropertyDescriptor pd)
        {
            // keep a strong reference to the source.  Normally we avoid this, but 
            // it's OK here since its scope is exactly the same as the strong reference
            // held by the PD:  begins with pd.AddValueChanged, ends with 
            // pd.RemoveValueChanged.   This ensures that we _can_ call RemoveValueChanged 
            // even in cases where the source implements value-semantics (which
            // confuses the PD - see 795205). 
            _manager = manager;
            _source = source;
            _pd = pd;
            _eventArgs = new ValueChangedEventArgs(pd); 

            pd.AddValueChanged(source, new EventHandler(OnValueChanged)); 
        } 

        public boolean IsEmpty 
        {
            get { return _listeners.IsEmpty; }
        }

        // add a listener
        public void Add(IWeakEventListener listener, EventHandler<ValueChangedEventArgs> handler) 
        { 
            // make sure list is ready for writing
            ListenerList list = _listeners; 
            if (ListenerList.PrepareForWriting(/*ref*/ list))
                _listeners = (ListenerList<ValueChangedEventArgs>)list;

            if (handler != null) 
            {
                _listeners.AddHandler(handler); 
            } 
            else
            { 
                _listeners.Add(listener);
            }
        }

        // remove a listener
        public void Remove(IWeakEventListener listener, EventHandler<ValueChangedEventArgs> handler) 
        { 
            // make sure list is ready for writing
            ListenerList list = _listeners; 
            if (ListenerList.PrepareForWriting(/*ref*/ list))
                _listeners = (ListenerList<ValueChangedEventArgs>)list;

            if (handler != null) 
            {
                _listeners.RemoveHandler(handler); 
            } 
            else
            { 
                _listeners.Remove(listener);
            }

            // when the last listener goes away, remove the callback 
            if (_listeners.IsEmpty)
            { 
                StopListening(); 
            }
        } 

        // purge dead entries
        public boolean Purge()
        { 
            ListenerList list = _listeners;
            if (ListenerList.PrepareForWriting(/*ref*/ list)) 
                _listeners = (ListenerList<ValueChangedEventArgs>)list; 

            return _listeners.Purge(); 
        }

        // remove the callback from the PropertyDescriptor
        public void StopListening() 
        {
            if (_source != null) 
            { 
                _pd.RemoveValueChanged(_source, new EventHandler(OnValueChanged));
                _source = null; 
            }
        }

        // forward the ValueChanged event to the listeners 
        private void OnValueChanged(Object sender, EventArgs e)
        { 
            // mark the list of listeners "in use" 
            using (_manager.ReadLock)
            { 
                _listeners.BeginUse();
            }

            // deliver the event, being sure to undo the effect of BeginUse(). 
            try
            { 
                _manager.DeliverEventToList(sender, _eventArgs, _listeners); 
            }
            finally 
            {
                _listeners.EndUse();
            }
        } 

        PropertyDescriptor          _pd; 
        ValueChangedEventManager    _manager; 
        Object                      _source;
        ListenerList<ValueChangedEventArgs> _listeners = new ListenerList<ValueChangedEventArgs>(); 
        ValueChangedEventArgs       _eventArgs;
    }

//    #endregion ValueChangedRecord 
}

