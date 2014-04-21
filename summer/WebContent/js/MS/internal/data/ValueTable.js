/**
 * ValueTable
 */

define(["dojo/_base/declare", "system/Type", "windows/IWeakEventListener", "specialized/HybridDictionary"], 
		function(declare, Type, IWeakEventListener, HybridDictionary){
//	private static object 
	var CachedNull = {}; //new Object(); 
//	private class 
	var ValueTableKey = declare(null, { 
        constructor:function(/*object*/ item, /*PropertyDescriptor*/ pd)
        {
//            Invariant.Assert(item != null && pd != null);

            // store weak references to item and pd, so as not to affect their
            // GC behavior.  But remember their hashcode. 
            this._item = item; //new WeakReference(item); 
            this._descriptor = pd; //new WeakReference(pd);
            this._hashCode = item.GetHashCode() + pd.GetHashCode(); 
        },

//        public override bool 
        Equals:function(/*object*/ o) 
        {
            if (o == this)
                return true;    // this allows deletion of stale keys

            var that = o instanceof ValueTableKey ? o : null;
            if (that != null) 
            { 
                var item = this.Item;
                var descriptor = this.PropertyDescriptor; 
                if (item == null || descriptor == null)
                    return false;   // a stale key matches nothing (except itself)

                return this._hashCode == that._hashCode && 
                        Object.Equals(item, that.Item) &&
                        Object.Equals(descriptor, that.PropertyDescriptor); 
            } 

            return false;   // this doesn't match a non-ValueTableKey 
        },

//        public override int 
        GetHashCode:function()
        { 
            return this._hashCode;
        } 

//        WeakReference _item;
//        WeakReference _descriptor; 
//        int _hashCode;
    });
	
	Object.defineProperties(ValueTableKey.prototype, {
//		 public object 
		Item:
        { 
            get:function() { return this._item; }
        }, 

//        public PropertyDescriptor 
        PropertyDescriptor:
        { 
            get:function() { return this._descriptor; }
        },

//        public bool 
        IsStale: 
        {
            get:function() { return this.Item == null || this.PropertyDescriptor == null; } 
        } 
	});
	
	var ValueTable = declare("ValueTable", IWeakEventListener,{
		constructor:function( ){

		},
		
		// retrieve the value, using the cache if necessary
//        internal object 
		GetValue:function(/*object*/ item, /*PropertyDescriptor*/ pd, /*bool*/ indexerIsNext)
        {
            if (!this.ShouldCache(item, pd)) 
            {
                // normal case - just get the value the old-fashioned way 
                return pd.GetValue(item); 
            }
            else 
            {
                // lazy creation of the cache
                if (this._table == null)
                { 
                	this._table = new HybridDictionary();
                } 
 
                // look up the value in the cache
//                var isXLinqCollectionProperty = SystemXmlLinqHelper.IsXLinqCollectionProperty(pd); 
                var key = new ValueTableKey(item, pd);
                var value = this._table.Get(key);

                // if there's no entry, fetch the value and cache it 
                if (value == null)
                { 
//                    if (isXLinqCollectionProperty) 
//                    {
//                        // interpose our own value for special XLinq properties 
//                        value = new XDeferredAxisSource(item, pd);
//                    }
//                    else
//                    { 
                    value = pd.GetValue(item);
//                    } 
 
                    if (value == null)
                    { 
                        value = CachedNull;     // distinguish a null value from no entry
                    }

                    this._table.Set(key, value); 
                }
 
                // decode null, if necessary 
                if (value == CachedNull)
                { 
                    value = null;
                }
//                else if (isXLinqCollectionProperty && !indexerIsNext)
//                { 
//                    // The XLinq properties need special help.  When the path
//                    // contains "Elements[Foo]", we should return the interposed 
//                    // XDeferredAxisSource;  the path worker will then call the XDAS's 
//                    // indexer with argument "Foo", and obtain the desired
//                    // ObservableCollection.  But when the path contains "Elements" 
//                    // with no indexer, we should return an ObservableCollection
//                    // corresponding to the full set of children.
//                    // [All this applies to "Descendants" as well.]
//                    XDeferredAxisSource xdas = (XDeferredAxisSource)value; 
//                    value = xdas.FullCollection;
//                } 
 
                return value;
            } 
        },

        // listen for changes to a property
//        internal void 
        RegisterForChanges:function(/*object*/ item, /*PropertyDescriptor*/ pd, /*DataBindEngine*/ engine) 
        {
            // lazy creation of the cache 
            if (this._table == null) 
            {
            	this._table = new HybridDictionary(); 
            }

            var key = new ValueTableKey(item, pd);
            var value = this._table.Get(key); 

            if (value == null) 
            { 
                // new entry needed - add a listener
                var inpc = item instanceof INotifyPropertyChanged ? item : null; 
                if (inpc != null)
                {
                    PropertyChangedEventManager.AddHandler(inpc, this.OnPropertyChanged, pd.Name);
                } 
                else
                { 
                    ValueChangedEventManager.AddHandler(item, this.OnValueChanged, pd); 
                }
            } 
        },

//        void 
        OnPropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e)
        { 
            var propertyName = e.PropertyName;
            if (propertyName == null)   // normalize - null and empty mean the same 
            { 
                propertyName = String.Empty;
            } 
            this.InvalidateCache(sender, propertyName);
        },

//        void 
        OnValueChanged:function(/*object*/ sender, /*ValueChangedEventArgs*/ e) 
        {
        	this.InvalidateCache(sender, e.PropertyDescriptor); 
        }, 

        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary>
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        { 
            return false;   // this method is no longer used (but must remain, for compat)
        }, 
 
        // invalidate (remove) a cache entry.  Called when the source raises a change event.
//        void 
        InvalidateCache:function(/*object*/ item, /*string*/ name) 
        {
            // when name is empty, invalidate all properties for the given item
            if (name == String.Empty)
            { 
            	var properties = this.GetPropertiesForItem(item);
                for/*each*/ (var i=0; i<properties.Count; i++)// PropertyDescriptor pd1 in GetPropertiesForItem(item))
                { 
                	var pd1 = properties.Get(i);
                    this.InvalidateCache(item, pd1); 
                }
                return; 
            }

            // regenerate the descriptor from the name
            // (this code matches PropertyPathWorker.GetInfo) 
            /*PropertyDescriptor*/var pd;
            if (item instanceof ICustomTypeDescriptor) 
            { 
                pd = TypeDescriptor.GetProperties(item)[name];
            } 
            else
            {
                pd = TypeDescriptor.GetProperties(item.GetType())[name];
            } 

            this.InvalidateCache(item, pd); 
        },

 
        // invalidate (remove) a cache entry.  Called when the source raises a change event.
//        void 
        InvalidateCache:function(/*object*/ item, /*PropertyDescriptor*/ pd)
        {
//            // ignore changes to special XLinq PD's - leave our interposed object in the cache 
//            if (SystemXmlLinqHelper.IsXLinqCollectionProperty(pd))
//                return; 
 
            /*ValueTableKey*/var key = new ValueTableKey(item, pd);
            this._table.Remove(key); 
        },

        // return all the properties registered for the given item
//        IEnumerable<PropertyDescriptor> 
        GetPropertiesForItem:function(/*object*/ item) 
        {
            /*List<PropertyDescriptor>*/var result = new List/*<PropertyDescriptor>*/(); 
 
            for/*each*/ (var i=0; i<this._table.Count; i++ ) //DictionaryEntry de in _table)
            { 
                var de = this._table.Get(i);
                /*ValueTableKey*/var key = de.Key;
                if (Object.Equals(item, key.Item))
                {
                    result.Add(key.PropertyDescriptor); 
                }
            } 
 
            return result;
        }, 

//        // remove stale entries from the table
////        internal bool 
//        Purge:function()
//        { 
//            if (_table == null)
//                return false; 
// 
//            // first see if there are any stale entries.  No sense allocating
//            // storage if there's nothing to do. 
//            var isPurgeNeeded = false;
//            /*ICollection*/var keys = this._table.Keys;
//            for/*each*/ (var i =0 ; i<keys.Count; i++) //ValueTableKey key in keys)
//            { 
//                if (key.IsStale)
//                { 
//                    isPurgeNeeded = true; 
//                    break;
//                } 
//            }
//
//            // if the purge is needed, copy the keys and purge the
//            // stale entries.  The copy avoids deletion out from under the 
//            // key collection.
//            if (isPurgeNeeded) 
//            { 
//                /*ValueTableKey[]*/var localKeys = new ValueTableKey[keys.Count];
//                keys.CopyTo(localKeys, 0); 
//
//                for (var i=localKeys.length-1;  i >= 0;  --i)
//                {
//                    if (localKeys[i].IsStale) 
//                    {
//                        this._table.Remove(localKeys[i]); 
//                    } 
//                }
//            } 
//
//            return isPurgeNeeded;   // return true if something happened
//        }
	});
	
	Object.defineProperties(ValueTable.prototype,{

	});
	
	// should we cache the value of the given property from the given item?
//    internal static bool 
	ShouldCache = function(/*object*/ item, /*PropertyDescriptor*/ pd)
    {
        // custom property descriptors returning IBindingList (bug 1190076) 
        if (SystemDataHelper.IsDataSetCollectionProperty(pd))
        { 
            return true; 
        }

//        // XLinq's property descriptors for the Elements and Descendants properties
//        if (SystemXmlLinqHelper.IsXLinqCollectionProperty(pd))
//        {
//            return true; 
//        }

        return false;       // everything else is treated normally 
    };

	
	ValueTable.Type = new Type("ValueTable", ValueTable, [IWeakEventListener.Type]);
	return ValueTable;
});
