/**
 * IndexedEnumerable
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerable"], 
		function(declare, Type, IEnumerable){
	
//    private class 
    var FilteredEnumerator = declare([IEnumerator, IDisposable], { 
        constructor:function(/*IndexedEnumerable*/ indexedEnumerable, /*IEnumerable*/ enumerable, /*Predicate<object>*/ filterCallback)
        { 
            this._enumerable = enumerable; 
            this._enumerator = _enumerable.GetEnumerator();
            this._filterCallback = filterCallback; 
            this._indexedEnumerable = indexedEnumerable;
            
            
        },
        

//        void IEnumerator.
        Reset:function() 
        {
            if (this._indexedEnumerable._enumerable == null) 
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 

            this.Dispose(); 
            this._enumerator = this._enumerable.GetEnumerator();
        },

//        bool IEnumerator.
        MoveNext:function() 
        {
            var returnValue; 

            if (this._indexedEnumerable._enumerable == null)
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 

            if (this._filterCallback == null)
            {
                returnValue = this._enumerator.MoveNext(); 
            }
            else 
            { 
                while ( (returnValue = this._enumerator.MoveNext()) && !this._filterCallback(this._enumerator.Current))
                    ; 
            }

            return returnValue;
        }, 

//        public void 
        Dispose:function()
        { 
            var d = _enumerator instanceof IDisposable ? this._enumerator : null; 
            if (d != null)
            { 
                d.Dispose();
            }
            this._enumerator = null;
        }, 

//        IEnumerable _enumerable; 
//        IEnumerator _enumerator; 
//        IndexedEnumerable _indexedEnumerable;
//        Predicate<object> _filterCallback; 
    });
    
    Object.defineProperties(FilteredEnumerator.prototype, {

//      object IEnumerator.
		Current: 
		{ 
			get:function()
			{ 
				return this._enumerator.Current;
			}
		},

    });
    
	var IndexedEnumerable = declare("IndexedEnumerable", IEnumerable,{
		constructor:function(/*IEnumerable*/ collection, /*Predicate<Object>*/ filterCallback) 
        {
			if(filterCallback === undefined){
				filterCallback = null;
			}
            this._filterCallback = filterCallback; 
            this.SetCollection(collection);

            // observe source collection for changes to invalidate enumerators
            // for IList we can get all information directly from the source collection, 
            // no need to track changes, no need to hook notification
            if (this.List == null) 
            { 
                /*INotifyCollectionChanged*/var icc = collection instanceof INotifyCollectionChanged ? collection : null;
                if (icc != null) 
                {
                    CollectionChangedEventManager.AddHandler(icc, OnCollectionChanged);
                }
            } 
            
            
//            private IEnumerable _enumerable; 
//            private IEnumerator _enumerator;
//            private IEnumerator _changeTracker; 
//            private ICollection _collection; 
//            private IList       _list;
//            private CollectionView _collectionView; 
//
//            private int     _enumeratorVersion;
//            private object  _cachedItem;
//            private int     _cachedIndex = -1; 
//            private int     _cachedVersion = -1;
//            private int     _cachedCount = -1; 
//            private bool?   _cachedIsEmpty; 
//
//            private PropertyInfo    _reflectedCount; 
//            private PropertyInfo    _reflectedItemAt;
//            private MethodInfo      _reflectedIndexOf;
//
//            private Predicate<object> _filterCallback; 
		},
		
	     /// <summary> Determines the index of a specific value in the collection. </summary>
        ///<remarks>if a FilterCallback is set, it will be reflected in the returned index</remarks> 
//        internal int 
		IndexOf:function(/*object*/ item) 
        {
            // try if source collection has a IndexOf method 
            var index;
            if (this.GetNativeIndexOf(item, /*out index*/indexOut))
            {
                return index; 
            }
 
            // if the enumerator is still valid, then we can 
            // just use the cached item.
            if (this.EnsureCacheCurrent()) 
            {
                if (item == this._cachedItem)
                    return this._cachedIndex;
            } 

            // If item != cached item, that doesn’t mean that the enumerator 
            // is `blown, it just means we have to go find the item represented by item. 
            index = -1;
            // only ask for fresh enumerator if current enumerator already was moved before 
            if (this._cachedIndex >= 0)
            {
                // force a new enumerator
                Uthis.seNewEnumerator(); 
            }
            var i = 0; 
            while (this._enumerator.MoveNext()) 
            {
                if (Object.Equals(this._enumerator.Current, item)) 
                {
                    index = i;
                    break;
                } 
                ++i;
            } 
 
            // update cache if item was found
            if (index >= 0) 
            {
            	this.CacheCurrentItem(index, this._enumerator.Current);
            }
            else 
            {
                // item not found and moved enumerator to end -> release it 
            	this.ClearAllCaches(); 
//            	this.DisposeEnumerator(ref _enumerator);
                var ieRef ={
                	"ie" : this._enumerator
                };
                this.DisposeEnumerator(/*ref _enumerator*/ieRef); 
                this._enumerator = ieRef.ie;
            } 

            return index;
        },
 
        /// <summary> Return an enumerator for the collection. </summary> 
//        public IEnumerator 
		GetEnumerator:function()
        { 
            return new FilteredEnumerator(this, Enumerable, FilterCallback);
        },
//        internal void 
		Invalidate:function()
        { 
			this.ClearAllCaches(); 

            // only track changes if source collection isn't already of type IList 
            if (this.List == null)
            {
                /*INotifyCollectionChanged*/
            	var icc = this.Enumerable instanceof INotifyCollectionChanged;
                if (icc != null) 
                {
                    CollectionChangedEventManager.RemoveHandler(icc, OnCollectionChanged); 
                } 
            }
 
            this._enumerable = null;
//            this.DisposeEnumerator(ref _enumerator);
            var ieRef ={
                	"ie" : this._enumerator
            };
            this.DisposeEnumerator(/*ref _enumerator*/ieRef); 
            this._enumerator = ieRef.ie;
            
//            this.DisposeEnumerator(ref _changeTracker);
            var ieRef ={
            	"ie" : this._changeTracker
            };
            this.DisposeEnumerator(/*ref _enumerator*/ieRef); 
            this._changeTracker = ieRef.ie;
                
            this._collection = null; 
            this._list = null;
            this._filterCallback = null; 
        }, 

//        private void 
		CacheCurrentItem:function(/*int*/ index, /*object*/ item) 
        { 
			this._cachedIndex = index;
			this._cachedItem = item; 
			this._cachedVersion = this._enumeratorVersion;
        },

        // checks and returns if cached values are still current 
//        private bool 
		EnsureCacheCurrent:function()
        { 
            var version = this.EnsureEnumerator(); 

            if (version != this._cachedVersion) 
            {
            	this.ClearAllCaches();
            	this._cachedVersion = version;
            } 
            var isCacheCurrent = (version == this._cachedVersion) && (this._cachedIndex >= 0);
 
            return isCacheCurrent; 
        },
 
 
        // returns the current EnumeratorVersion to indicate
        // whether any cached values may be valid. 
//        private int 
		EnsureEnumerator:function()
        {
            if (this._enumerator == null)
            { 
            	this.UseNewEnumerator();
            } 
            else 
            {
                try 
                {
                	this._changeTracker.MoveNext();
                }
                catch (InvalidOperationException) 
                {
                    // collection was changed - start over with a new enumerator 
                	this.UseNewEnumerator(); 
                }
            } 

            return this._enumeratorVersion;
        },
 
//        private void 
		UseNewEnumerator:function()
        { 
            // if _enumeratorVersion exceeds MaxValue, then it 
            // will roll back to MinValue, and continue on from there.
			++ this._enumeratorVersion;

//			this.DisposeEnumerator(ref _changeTracker);
            var ieRef ={
                	"ie" : this._changeTracker
                };
            this.DisposeEnumerator(/*ref _enumerator*/ieRef); 
			
			this._changeTracker = _enumerable.GetEnumerator();
			
//			this.DisposeEnumerator(ref _enumerator); 
            var ieRef ={
                	"ie" : this._enumerator
                };
            this.DisposeEnumerator(/*ref _enumerator*/ieRef); 
			
			this._enumerator = GetEnumerator();
			this._cachedIndex = -1;    // will force at least one MoveNext 
			this._cachedItem = null; 
        },
 
//        private void 
		InvalidateEnumerator:function()
        {
            // if _enumeratorVersion exceeds MaxValue, then it
            // will roll back to MinValue, and continue on from there. 
            ++ this._enumeratorVersion;
 
            var ieRef ={
            	"ie" : this._enumerator
            };
            this.DisposeEnumerator(/*ref _enumerator*/ieRef); 
            this._enumerator = ieRef.ie;
            
            this.ClearAllCaches();
        }, 

//        private void 
		DisposeEnumerator:function(/*ref IEnumerator ie*/ ieRef)
        {
            var d = ieRef.ie instanceof IDisposable ? ieRef.ie : null; 
            if (d != null)
            { 
                d.Dispose(); 
            }
 
            ieRef.ie = null;
        },

//        private void 
		ClearAllCaches:function() 
        {
            this._cachedItem = null; 
            this._cachedIndex = -1; 
            this._cachedCount = -1;
        }, 

//        private void 
		SetCollection:function(/*IEnumerable*/ collection)
        {
//            Invariant.Assert(collection != null); 
			this._enumerable = collection;
			this._collection = collection instanceof ICollection ? collection : null; 
			this._list = collection instanceof IList ? collection : null; 
			this._collectionView = collection instanceof CollectionView ? collection : null;
 
            // try finding Count, IndexOf and indexer members via reflection
            if ((this.List == null) && (this.CollectionView == null))
            {
                var srcType = collection.GetType(); 
                // try reflection for IndexOf(object)
                var mi = srcType.GetMethod("IndexOf", [Object.Type]); 
                if ((mi != null) && (mi.ReturnType == Number.Type)) 
                {
                	this._reflectedIndexOf = mi; 
                }

                // find matching indexer
                /*MemberInfo[]*/var defaultMembers = srcType.GetDefaultMembers(); 
                for (var i = 0; i <= defaultMembers.Length - 1; i++)
                { 
                    /*PropertyInfo*/var pi = defaultMembers[i] instanceof PropertyInfo ? defaultMembers[i] : null; 
                    if (pi != null)
                    { 
                        /*ParameterInfo[]*/var indexerParameters = pi.GetIndexParameters();
                        if (indexerParameters.Length == 1)
                        {
                            if (indexerParameters[0].ParameterType.IsAssignableFrom(typeof(int))) 
                            {
                                _reflectedItemAt = pi; 
                                break; 
                            }
                        } 
                    }
                }

                if (this.Collection == null) 
                {
                    // try reflection for Count property 
                    /*PropertyInfo*/var pi = srcType.GetProperty("Count", typeof(int)); 
                    if (pi != null)
                    { 
                    	this._reflectedCount = pi;
                    }
                }
            } 
        },
 
        // to avoid slower calculation walking a IEnumerable, 
        // try retreiving the requested value from source collection
        // if it implements ICollection, IList or CollectionView 
//        private bool 
		GetNativeCount:function(/*out int value*/valueOut)
        {
            var isNativeValue = false;
            valueOut.value = -1; 
            if (Collection != null)
            { 
            	valueOut.value = Collection.Count; 
                isNativeValue = true;
            } 
            else if (CollectionView != null)
            {
            	valueOut.value = CollectionView.Count;
                isNativeValue = true; 
            }
            else if (this._reflectedCount != null) 
            { 
                try
                { 
                	valueOut.value = this._reflectedCount.GetValue(this.Enumerable, null);
                    isNativeValue = true;
                }
                catch (MethodAccessException ) 
                {
                    // revert to walking the IEnumerable 
                    // under partial trust, some properties are not accessible even though they are public 
                    // see bug 1415832
                    this._reflectedCount = null; 
                    isNativeValue = false;
                }
            }
            return isNativeValue; 
        },
 
//        private bool 
		GetNativeIsEmpty:function(/*out bool isEmpty*/isEmptyOut) 
        {
            var isNativeValue = false; 
            isEmptyOut.isEmpty = true;
            if (Collection != null)
            {
            	isEmptyOut.isEmpty = (this.Collection.Count == 0); 
                isNativeValue = true;
            } 
            else if (this.CollectionView != null) 
            {
            	isEmptyOut.isEmpty= this.CollectionView.IsEmpty; 
                isNativeValue = true;
            }
            else if (this._reflectedCount != null)
            { 
                try
                { 
                	isEmptyOut.isEmpty = (this._reflectedCount.GetValue(this.Enumerable, null) == 0); 
                    isNativeValue = true;
                } 
                catch (MethodAccessException )
                {
                    // revert to walking the IEnumerable
                    // under partial trust, some properties are not accessible even though they are public 
                    // see bug 1415832
                    this._reflectedCount = null; 
                    isNativeValue = false; 
                }
            } 
            return isNativeValue;
        },

//        private bool 
		GetNativeIndexOf:function(/*object*/ item, /*out int value*/valueOut) 
        {
            var isNativeValue = false; 
            valueOut.value = -1; 
            if ((this.List != null) && (this.FilterCallback == null))
            { 
            	valueOut.value = this.List.IndexOf(item);
                isNativeValue = true;
            }
            else if (CollectionView != null) 
            {
            	valueOut.value = this.CollectionView.IndexOf(item); 
                isNativeValue = true; 
            }
            else if (this._reflectedIndexOf != null) 
            {
                try
                {
                	valueOut.value = this._reflectedIndexOf.Call(this.Enumerable, [ item ]); 
                    isNativeValue = true;
                } 
                catch (MethodAccessException ) 
                {
                    // revert to walking the IEnumerable 
                    // under partial trust, some properties are not accessible even though they are public
                    // see bug 1415832
                	this._reflectedIndexOf = null;
                    isNativeValue = false; 
                }
            } 
            return isNativeValue; 
        },
 
//        private bool 
		GetNativeItemAt:function(/*int*/ index, /*out object value*/valueOut)
        {
            var isNativeValue = false;
            valueOut.value = null; 
            if (List != null)
            { 
            	valueOut.value = this.List[index]; 
                isNativeValue = true;
            } 
            else if (CollectionView != null)
            {
            	valueOut.value = this.CollectionView.GetItemAt(index);
                isNativeValue = true; 
            }
            else if (_reflectedItemAt!= null) 
            { 
                try
                { 
                	valueOut.value = this._reflectedItemAt.GetValue(this.Enumerable, [ index ]);
                    isNativeValue = true;
                }
                catch (MethodAccessException ) 
                {
                    // revert to walking the IEnumerable 
                    // under partial trust, some properties are not accessible even though they are public 
                    // see bug 1415832
                    this._reflectedItemAt = null; 
                    isNativeValue = false;
                }
            }
            return isNativeValue; 
        },

        /// <summary>
        /// Handle events from the centralized event table 
        /// </summary>
//        protected virtual bool 
		ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e) 
        { 
            return false;   // this method is no longer used (but must remain, for compat)
        },

//        void 
		OnCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
			this.InvalidateEnumerator(); 
        },
        
        Get:function(index)
        {
            // try if source collection has a indexer 
            var value;
            if (this.GetNativeItemAt(index, /*out value*/valueOut)) 
            { 
                return value;
            }

            if (index < 0) {
                throw new ArgumentOutOfRangeException("index"); // validating the index argument 
            }

            var moveBy = (index - _cachedIndex); 
            if (moveBy < 0)
            { 
                // new index is before current position, need to reset enumerators
                UseNewEnumerator(); // recreate a new enumerator, must not call .Reset anymore
                moveBy = index + 1; // force at least one MoveNext
            } 

            // if the enumerator is still valid, then we can 
            // just use the cached value. 
            if (EnsureCacheCurrent())
            { 
                if (index == _cachedIndex)
                    return _cachedItem;
            }
            else 
            {
                // there are new enumerators, caches were cleared, recalculate moveBy 
                moveBy = index + 1; // force at least one MoveNext 
            }

            // position enumerator at new index:
            while ((moveBy > 0) && _enumerator.MoveNext())
            {
                moveBy--; 
            }

            // moved beyond the end of the enumerator? 
            if (moveBy != 0) {
                throw new ArgumentOutOfRangeException("index"); // validating the index argument
            }

            CacheCurrentItem(index, _enumerator.Current); 
            return _cachedItem;
        } 
	});
	
	Object.defineProperties(IndexedEnumerable.prototype,{

        ///<summary> Gets the number of elements in the collection. </summary> 
        ///<remarks>if a FilterCallback is set, it will be reflected in the returned Count</remarks> 
//        internal int 
		Count:
        { 
            get:function()
            {
                this.EnsureCacheCurrent();
 
                // try if source collection has a Count property
                var count = 0; 
                if (this.GetNativeCount(/*out count*/countOut)) 
                {
                    return count; 
                }

                // use a previously calculated Count
                if (this._cachedCount >= 0) 
                {
                    return this._cachedCount; 
                } 

                // calculate and cache current Count value, using (filtered) enumerator 
                count = 0;
                var e = this._enumerator;
                while(e.MoveNext()){
                	++count;
                };
                
//                for/*each*/ (object unused in this)
//                {
//                    ++count; 
//                }
 
                this._cachedCount = count; 
                this._cachedIsEmpty = (this._cachedCount == 0);
                return count; 
            }
        },

        // cheaper than (Count == 0) 
//        internal bool 
		IsEmpty:
        { 
            get:function() 
            {
                // try if source collection has a IsEmpty property 
                var isEmpty;
                var isEmptyOut= {
                	"isEmpty" : isEmpty
                }
                var r = this.GetNativeIsEmpty(/*out isEmpty*/isEmptyOut);
                isEmpty = isEmptyOut.isEmpty;
                if (r)
                {
                    return isEmpty; 
                }
 
                if (this._cachedIsEmpty.HasValue) 
                {
                    return this._cachedIsEmpty.Value; 
                }

                // determine using (filtered) enumerator
                var ie = this.GetEnumerator(); 
                this._cachedIsEmpty = !ie.MoveNext();
 
                var d = ie instanceof IDisposable ? ie : null; 
                if (d != null)
                { 
                    d.Dispose();
                }

                if (_cachedIsEmpty.Value) 
                    _cachedCount = 0;
                return _cachedIsEmpty.Value; 
            } 
        },
 
        /// <summary>
        /// The enumerable collection wrapped by this indexer.
        /// </summary>
//        internal IEnumerable 
        Enumerable: 
        {
            get:function() { return this._enumerable; } 
        }, 

        /// <summary> 
        /// The collection wrapped by this indexer.
        /// </summary>
//        internal ICollection 
        Collection:
        { 
            get:function() { return this._collection; }
        }, 
 
        /// <summary>
        /// The list wrapped by this indexer. 
        /// </summary>
//        internal IList 
        List:
        {
            get:function() { return this._list; } 
        },
 
        /// <summary> 
        /// The CollectionView wrapped by this indexer.
        /// </summary> 
//        internal CollectionView 
        CollectionView:
        {
            get:function() { return _collectionView; }
        }, 

 
//        private Predicate<object> 
        FilterCallback: 
        {
            get:function() 
            {
                return _filterCallback;
            }
        } 

	});
	
	Object.defineProperties(IndexedEnumerable,{

	});
	
    ///<summary> 
    /// Copies all the elements of the current collection to the specified one-dimensional Array.
    ///</summary> 
//    internal static void 
	IndexedEnumerable.CopyTo = function(/*IEnumerable*/ collection, /*Array*/ array, /*int*/ index) 
    {
//        Invariant.Assert(collection != null, "collection is null"); 
//        Invariant.Assert(array != null, "target array is null");
//        Invariant.Assert(array.Rank == 1, "expected array of rank=1");
//        Invariant.Assert(index >= 0, "index must be positive");

        /*ICollection*/var ic = collection instanceof ICollection ? collection : null;
        if (ic != null) 
        { 
            ic.CopyTo(array, index);
        } 
        else
        {
            /*IList*/var list = array;

            for/*each*/ (var i=0; i<collection.Count; i++)
            { 
                if (index < array.length) 
                {
                    list.Set(index, collection.Get(i)); 
                    ++index;
                }
                else
                { 
                    // The number of elements in the source ICollection is greater than
                    // the available space from index to the end of the destination array. 
                    throw new ArgumentException(SR.Get(SRID.CopyToNotEnoughSpace), "index"); 
                }
            } 
        }
    };

	
	IndexedEnumerable.Type = new Type("IndexedEnumerable", IndexedEnumerable, [IEnumerable.Type]);
	return IndexedEnumerable;
});
 
   




