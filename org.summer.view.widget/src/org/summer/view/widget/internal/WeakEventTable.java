package org.summer.view.widget.internal;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakEventManager;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.internal.WeakEventTable.EventNameKey;
import org.summer.view.widget.threading.DispatcherObject;

/// <summary> 
/// This class manages the correspondence between event types and 
/// event managers, in support of the "weak event listener" pattern.
/// It also stores data on behalf of the managers;  a manager can store 
/// data of its own choosing, indexed by the pair (manager, source).
/// </summary>
/*internal*/ public class WeakEventTable extends DispatcherObject
{ 
//    #region Constructors

    // 
    //  Constructors
    // 

    /// <summary>
    /// Create a new instance of WeakEventTable.
    /// </summary> 
    /// <SecurityNote>
    ///     Critical: This code calls into Link demanded methods 
    ///         (AppDomain.DomainUnload and AppDomain.ProcessExit) to attach handlers 
    ///     TreatAsSafe: This code does not take any parameter or return state.
    ///     It simply attaches private call back. 
    /// </SecurityNote>
//    [SecurityCritical,SecurityTreatAsSafe]
    private WeakEventTable()
    { 
        WeakEventTableShutDownListener listener = new WeakEventTableShutDownListener(this);
    } 

//    #endregion Constructors

//    #region Internal Properties

    //
    //  Internal Properties 
    //

    /// <summary> 
    /// Return the WeakEventTable for the current thread
    /// </summary> 
    /*internal*/ public static WeakEventTable CurrentWeakEventTable
    {
        get
        { 
            // _currentTable is [ThreadStatic], so there's one per thread
            if (_currentTable == null) 
            { 
                _currentTable = new WeakEventTable();
            } 

            return _currentTable;
        }
    } 

    /// <summary> 
    /// Take a read-lock on the table, and return the IDisposable. 
    /// Queries to the table should occur within a
    /// "using (Table.ReadLock) { ... }" clause, except for queries 
    /// that are already within a write lock.
    /// </summary>
    /*internal*/ public IDisposable ReadLock
    { 
        get { return _lock.ReadLock; }
    } 

    /// <summary>
    /// Take a write-lock on the table, and return the IDisposable. 
    /// All modifications to the table should occur within a
    /// "using (Table.WriteLock) { ... }" clause.
    /// </summary>
    /*internal*/ public IDisposable WriteLock 
    {
        get { return _lock.WriteLock; } 
    } 

    /// <summary> 
    /// Get or set the manager instance for the given type.
    /// </summary>
    /*internal*/ public WeakEventManager this[Type managerType]
    { 
        get { return (WeakEventManager)_managerTable[managerType]; }
        set { _managerTable[managerType] = value; } 
    } 

    /// <summary> 
    /// Get or set the manager instance for the given event.
    /// </summary>
    /*internal*/ public WeakEventManager this[Type eventSourceType, String eventName]
    { 
        get
        { 
            EventNameKey key = new EventNameKey(eventSourceType, eventName); 
            return (WeakEventManager)_eventNameTable[key];
        } 

        set
        {
            EventNameKey key = new EventNameKey(eventSourceType, eventName); 
            _eventNameTable[key] = value;
        } 
    } 

    /// <summary> 
    /// Get or set the data stored by the given manager for the given source.
    /// </summary>
    /*internal*/ public Object this[WeakEventManager manager, Object source]
    { 
        get
        { 
            EventKey key = new EventKey(manager, source); 
            Object result = _dataTable[key];
            return result; 
        }

        set
        { 
            EventKey key = new EventKey(manager, source, true);
            _dataTable[key] = value; 
        } 
    }

    /// <summary>
    /// Indicates whether cleanup is enabled.
    /// </summary>
    /// <remarks> 
    /// Normally cleanup is always enabled, but a perf test environment might
    /// want to disable cleanup so that it doesn't interfere with the real 
    /// perf measurements. 
    /// </remarks>
    /*internal*/ public boolean IsCleanupEnabled 
    {
        get { return _cleanupEnabled; }
        set { _cleanupEnabled = value; }
    } 

//    #endregion Internal Properties 

//    #region Internal Methods

    //
    //  Internal Methods
    //

    /// <summary>
    /// Remove the data for the given manager and source. 
    /// </summary> 
    /*internal*/ public void Remove(WeakEventManager manager, Object source)
    { 
        EventKey key = new EventKey(manager, source);
        _dataTable.Remove(key);
    }

    /// <summary>
    /// Schedule a cleanup pass.  This can be called from any thread. 
    /// </summary> 
    /*internal*/ public void ScheduleCleanup()
    { 
        // only the first request after a previous cleanup should schedule real work
        if (Interlocked.Increment(/*ref*/ _cleanupRequests) == 1)
        {
            Dispatcher.BeginInvoke(DispatcherPriority.ContextIdle, new DispatcherOperationCallback(CleanupOperation), null); 
        }
    } 

    /// <summary>
    /// Perform a cleanup pass. 
    /// </summary>
    /*internal*/ public static boolean Cleanup()
    {
        return CurrentWeakEventTable.Purge(false); 
    }

//    #endregion Internal Methods 
//
//    #region Private Methods 

    //
    //  Private Methods
    // 

    // run a cleanup pass 
    private Object CleanupOperation(Object arg) 
    {
        // allow new requests, even if cleanup is disabled 
        Interlocked.Exchange(/*ref*/ _cleanupRequests, 0);

        if (IsCleanupEnabled)
        { 
            Purge(false);
        } 

        return null;
    } 

    // remove dead entries.  When purgeAll is true, remove all entries.
    private boolean Purge(boolean purgeAll)
    { 
        boolean foundDirt = false;

        using (this.WriteLock) 
        {
            // copy the keys into a separate array, so that later on 
            // we can change the table while iterating over the keys
            ICollection ic = _dataTable.Keys;
            EventKey[] keys = new EventKey[ic.Count];
            ic.CopyTo(keys, 0); 

            for (int i=keys.length-1; i>=0; --i) 
            { 
                Object data = _dataTable[keys[i]];
                // a purge earlier in the loop may have removed keys[i], 
                // in which case there's nothing more to do
                if (data != null)
                {
                    Object source = keys[i].Source; 
                    foundDirt |= keys[i].Manager.PurgeInternal(source, data, purgeAll);

                    // if source has been GC'd, remove its data 
                    if (!purgeAll && source == null)
                    { 
                        _dataTable.Remove(keys[i]);
                    }
                }
            } 

            if (purgeAll) 
            { 
                _managerTable.Clear();
                _dataTable.Clear(); 
            }
        }

        return foundDirt; 
    }


    // do the final cleanup when the Dispatcher or AppDomain is shut down
    private void OnShutDown() 
    {
        Purge(true);

        // remove the table from thread storage 
        _currentTable = null;
    } 

//    #endregion Private Methods

//    #region Private Fields

    //
    //  Private Fields 
    //

    private Hashtable _managerTable = new Hashtable();  // maps manager type -> instance 
    private Hashtable _dataTable = new Hashtable();     // maps EventKey -> data
    private Hashtable _eventNameTable = new Hashtable(); // maps <Type,name> -> manager 

    ReaderWriterLockWrapper     _lock = new ReaderWriterLockWrapper();
    private int                 _cleanupRequests;
    private boolean                _cleanupEnabled = true; 

//    [ThreadStatic] 
    private static WeakEventTable   _currentTable;  // one table per thread 

//    #endregion Private Fields 

//    #region WeakEventTableShutDownListener

    /*private*/ /*sealed*/ class WeakEventTableShutDownListener extends ShutDownListener 
    {
        /// <SecurityNote> 
        ///     Critical: accesses AppDomain.DomainUnload event 
        ///     TreatAsSafe: This code does not take any parameter or return state.
        ///                  It simply attaches private callbacks. 
        /// </SecurityNote>
//        [SecurityCritical,SecurityTreatAsSafe]
        public WeakEventTableShutDownListener(WeakEventTable target) 
        { 
        	super(target);
        }

        /*internal*/ public /*override*/ void OnShutDown(Object target, Object sender, EventArgs e) 
        {
            WeakEventTable table = (WeakEventTable)target; 
            table.OnShutDown();
        }
    }

//    #endregion WeakEventTableShutDownListener

//    #region Table Keys 

    // the key for the data table:  <manager, ((source)), hashcode> 
    private class EventKey
    {
        /*internal*/ public EventKey(WeakEventManager manager, Object source, boolean useWeakRef)
        { 
            _manager = manager;
            _source = new WeakReference(source); 
            _hashcode = unchecked(manager.GetHashCode() + RuntimeHelpers.GetHashCode(source)); 
        }

        /*internal*/ public EventKey(WeakEventManager manager, Object source)
        {
            _manager = manager;
            _source = source; 
            _hashcode = unchecked(manager.GetHashCode() + RuntimeHelpers.GetHashCode(source));
        } 

        /*internal*/ public Object Source
        { 
            get { return ((WeakReference)_source).Target; }
        }

        /*internal*/ public WeakEventManager Manager 
        {
            get { return _manager; } 
        } 

        public /*override*/ int GetHashCode() 
        {
//#if DEBUG
//            WeakReference wr = _source as WeakReference;
//            Object source = (wr != null) ? wr.Target : _source; 
//            if (source != null)
//            { 
//                int hashcode = unchecked(_manager.GetHashCode() + RuntimeHelpers.GetHashCode(source)); 
//                Debug.Assert(hashcode == _hashcode, "hashcodes disagree");
//            } 
//#endif

            return _hashcode;
        } 

        public /*override*/ boolean Equals(Object o) 
        { 
            if (o instanceof EventKey)
            { 
                WeakReference wr;
                EventKey ek = (EventKey)o;

                if (_manager != ek._manager || _hashcode != ek._hashcode) 
                    return false;

                wr = this._source as WeakReference; 
                Object s1 = (wr != null) ? wr.Target : this._source;
                wr = ek._source as WeakReference; 
                Object s2 = (wr != null) ? wr.Target : ek._source;

                if (s1!=null && s2!=null)
                    return (s1 == s2); 
                else
                    return (_source == ek._source); 
            } 
            else
            { 
                return false;
            }
        }

        public static boolean operator==(EventKey key1, EventKey key2)
        { 
            return key1.Equals(key2); 
        }

        public static boolean operator!=(EventKey key1, EventKey key2)
        {
            return !key1.Equals(key2);
        } 

        WeakEventManager _manager; 
        Object _source;             // lookup: direct ref;  In table: WeakRef 
        int _hashcode;              // cached, in case source is GC'd
    } 

    // the key for the event name table:  <ownerType, eventName>
    class EventNameKey
    { 
        public EventNameKey(Type eventSourceType, String eventName)
        { 
            _eventSourceType = eventSourceType; 
            _eventName = eventName;
        } 

        public /*override*/ int GetHashCode()
        {
            return unchecked(_eventSourceType.GetHashCode() + _eventName.GetHashCode()); 
        }

        public /*override*/ boolean Equals(Object o) 
        {
            if (o instanceof EventNameKey) 
            {
                EventNameKey that = (EventNameKey)o;
                return (this._eventSourceType == that._eventSourceType && this._eventName == that._eventName);
            } 
            else
                return false; 
        } 

        public static boolean operator==(EventNameKey key1, EventNameKey key2) 
        {
            return key1.Equals(key2);
        }

        public static boolean operator!=(EventNameKey key1, EventNameKey key2)
        { 
            return !key1.Equals(key2); 
        }

        Type _eventSourceType;
        String _eventName;
    }

//    #endregion Table Keys
}