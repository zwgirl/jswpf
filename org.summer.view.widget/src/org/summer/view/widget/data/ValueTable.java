package org.summer.view.widget.data;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.INotifyPropertyChanged;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.DictionaryEntry;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.internal.SystemDataHelper;
import org.summer.view.widget.internal.SystemXmlLinqHelper;
import org.summer.view.widget.internal.ValueChangedEventArgs;
import org.summer.view.widget.internal.ValueChangedEventManager;
import org.summer.view.widget.model.PropertyChangedEventArgs;
import org.summer.view.widget.model.PropertyChangedEventManager;
import org.summer.view.widget.model.PropertyDescriptor;

/*internal*/public final class ValueTable implements IWeakEventListener
{ 
    // should we cache the value of the given property from the given item?
    /*internal*/ static boolean ShouldCache(Object item, PropertyDescriptor pd)
    {
        // custom property descriptors returning IBindingList (bug 1190076) 
        if (SystemDataHelper.IsDataSetCollectionProperty(pd))
        { 
            return true; 
        }

        // XLinq's property descriptors for the Elements and Descendants properties
        if (SystemXmlLinqHelper.IsXLinqCollectionProperty(pd))
        {
            return true; 
        }

        return false;       // everything else is treated normally 
    }

    // retrieve the value, using the cache if necessary
    /*internal*/ Object GetValue(Object item, PropertyDescriptor pd, boolean indexerIsNext)
    {
        if (!ShouldCache(item, pd)) 
        {
            // normal case - just get the value the old-fashioned way 
            return pd.GetValue(item); 
        }
        else 
        {
            // lazy creation of the cache
            if (_table == null)
            { 
                _table = new HybridDictionary();
            } 

            // look up the value in the cache
            boolean isXLinqCollectionProperty = SystemXmlLinqHelper.IsXLinqCollectionProperty(pd); 
            ValueTableKey key = new ValueTableKey(item, pd);
            Object value = _table[key];

            // if there's no entry, fetch the value and cache it 
            if (value == null)
            { 
                if (isXLinqCollectionProperty) 
                {
                    // interpose our own value for special XLinq properties 
                    value = new XDeferredAxisSource(item, pd);
                }
                else
                { 
                    value = pd.GetValue(item);
                } 

                if (value == null)
                { 
                    value = CachedNull;     // distinguish a null value from no entry
                }

                _table[key] = value; 
            }

            // decode null, if necessary 
            if (value == CachedNull)
            { 
                value = null;
            }
            else if (isXLinqCollectionProperty && !indexerIsNext)
            { 
                // The XLinq properties need special help.  When the path
                // contains "Elements[Foo]", we should return the interposed 
                // XDeferredAxisSource;  the path worker will then call the XDAS's 
                // indexer with argument "Foo", and obtain the desired
                // ObservableCollection.  But when the path contains "Elements" 
                // with no indexer, we should return an ObservableCollection
                // corresponding to the full set of children.
                // [All this applies to "Descendants" as well.]
                XDeferredAxisSource xdas = (XDeferredAxisSource)value; 
                value = xdas.FullCollection;
            } 

            return value;
        } 
    }

    // listen for changes to a property
    /*internal*/ void RegisterForChanges(Object item, PropertyDescriptor pd, DataBindEngine engine) 
    {
        // lazy creation of the cache 
        if (_table == null) 
        {
            _table = new HybridDictionary(); 
        }

        ValueTableKey key = new ValueTableKey(item, pd);
        Object value = _table[key]; 

        if (value == null) 
        { 
            // new entry needed - add a listener
            INotifyPropertyChanged inpc = item as INotifyPropertyChanged; 
            if (inpc != null)
            {
                PropertyChangedEventManager.AddHandler(inpc, OnPropertyChanged, pd.Name);
            } 
            else
            { 
                ValueChangedEventManager.AddHandler(item, OnValueChanged, pd); 
            }
        } 
    }

    void OnPropertyChanged(Object sender, PropertyChangedEventArgs e)
    { 
        String propertyName = e.PropertyName;
        if (propertyName == null)   // normalize - null and empty mean the same 
        { 
            propertyName = String.Empty;
        } 
        InvalidateCache(sender, propertyName);
    }

    void OnValueChanged(Object sender, ValueChangedEventArgs e) 
    {
        InvalidateCache(sender, e.PropertyDescriptor); 
    } 

    /// <summary> 
    /// Handle events from the centralized event table
    /// </summary>
    public boolean /*IWeakEventListener.*/ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
    { 
        return false;   // this method is no longer used (but must remain, for compat)
    } 

    // invalidate (remove) a cache entry.  Called when the source raises a change event.
    void InvalidateCache(Object item, String name) 
    {
        // when name is empty, invalidate all properties for the given item
        if (name == String.Empty)
        { 
            for/*each*/ (PropertyDescriptor pd1 : GetPropertiesForItem(item))
            { 
                InvalidateCache(item, pd1); 
            }
            return; 
        }

        // regenerate the descriptor from the name
        // (this code matches PropertyPathWorker.GetInfo) 
        PropertyDescriptor pd;
        if (item is ICustomTypeDescriptor) 
        { 
            pd = TypeDescriptor.GetProperties(item)[name];
        } 
        else
        {
            pd = TypeDescriptor.GetProperties(item.GetType())[name];
        } 

        InvalidateCache(item, pd); 
    } 


    // invalidate (remove) a cache entry.  Called when the source raises a change event.
    void InvalidateCache(Object item, PropertyDescriptor pd)
    {
        // ignore changes to special XLinq PD's - leave our interposed Object in the cache 
        if (SystemXmlLinqHelper.IsXLinqCollectionProperty(pd))
            return; 

        ValueTableKey key = new ValueTableKey(item, pd);
        _table.Remove(key); 
    }

    // return all the properties registered for the given item
    IEnumerable<PropertyDescriptor> GetPropertiesForItem(Object item) 
    {
        List<PropertyDescriptor> result = new List<PropertyDescriptor>(); 

        for/*each*/ (DictionaryEntry de : _table)
        { 
            ValueTableKey key = (ValueTableKey)de.Key;
            if (Object.Equals(item, key.Item))
            {
                result.Add(key.PropertyDescriptor); 
            }
        } 

        return result;
    } 

    // remove stale entries from the table
    /*internal*/ boolean Purge()
    { 
        if (_table == null)
            return false; 

        // first see if there are any stale entries.  No sense allocating
        // storage if there's nothing to do. 
        boolean isPurgeNeeded = false;
        ICollection keys = _table.Keys;
        for/*each*/ (ValueTableKey key : keys)
        { 
            if (key.IsStale)
            { 
                isPurgeNeeded = true; 
                break;
            } 
        }

        // if the purge is needed, copy the keys and purge the
        // stale entries.  The copy avoids deletion out from under the 
        // key collection.
        if (isPurgeNeeded) 
        { 
            ValueTableKey[] localKeys = new ValueTableKey[keys.Count];
            keys.CopyTo(localKeys, 0); 

            for (int i=localKeys.length-1;  i >= 0;  --i)
            {
                if (localKeys[i].IsStale) 
                {
                    _table.Remove(localKeys[i]); 
                } 
            }
        } 

        return isPurgeNeeded;   // return true if something happened
    }

    private HybridDictionary _table;
    private static Object CachedNull = new Object(); 

    private class ValueTableKey
    { 
        public ValueTableKey(Object item, PropertyDescriptor pd)
        {
            Invariant.Assert(item != null && pd != null);

            // store weak references to item and pd, so as not to affect their
            // GC behavior.  But remember their hashcode. 
            _item = new WeakReference(item); 
            _descriptor = new WeakReference(pd);
            _hashCode = unchecked(item.GetHashCode() + pd.GetHashCode()); 
        }

        public Object Item
        { 
            get { return _item.Target; }
        } 

        public PropertyDescriptor PropertyDescriptor
        { 
            get { return (PropertyDescriptor)_descriptor.Target; }
        }

        public boolean IsStale 
        {
            get { return Item == null || PropertyDescriptor == null; } 
        } 

        public /*override*/ boolean Equals(Object o) 
        {
            if (o == this)
                return true;    // this allows deletion of stale keys

            ValueTableKey that = o as ValueTableKey;
            if (that != null) 
            { 
                Object item = this.Item;
                PropertyDescriptor descriptor = this.PropertyDescriptor; 
                if (item == null || descriptor == null)
                    return false;   // a stale key matches nothing (except itself)

                return this._hashCode == that._hashCode && 
                        Object.Equals(item, that.Item) &&
                        Object.Equals(descriptor, that.PropertyDescriptor); 
            } 

            return false;   // this doesn't match a non-ValueTableKey 
        }

        public /*override*/ int GetHashCode()
        { 
            return _hashCode;
        } 

        WeakReference _item;
        WeakReference _descriptor; 
        int _hashCode;
    }
}