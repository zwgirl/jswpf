/**
 * from ItemsControl
 * Selector
 */

define(["dojo/_base/declare", "system/Type", "generic/List", "generic/Dictionary", "collections/IEnumerable"], 
		function(declare, Type, List, Dictionary, IEnumerable){
	
//	private class 
	var BatchRemoveHelper =declare(IDisposable,  
    {
        constructor:function(/*InternalSelectedItemsStorage*/ owner) 
        {
            this._owner = owner;
            this._RemovedCount = 0;
            this._level = 0;
        },

//        public void 
        Enter:function()
        { 
            ++ this._level;
        },

//        public void 
        Leave:function() 
        {
            if (this._level > 0) 
            { 
                if (--this._level == 0 && this._RemovedCount > 0)
                { 
                	this._owner.DoBatchRemove();
                	this._RemovedCount = 0;
                }
            } 
        },

//        public void 
        Dispose:function() 
        {
            this.Leave(); 
        }

//        InternalSelectedItemsStorage _owner;
//        int _level; 
    });
	
	Object.defineProperties(BatchRemoveHelper.prototype, {
//        public bool 
		IsActive: { get:function() { return this._level > 0; } },
//        public int 
		RemovedCount: { get:function(){return this._RemovedCount;}, set:function(value){this._RemovedCount = value;} } 
	});

	
//  internal class 
    var InternalSelectedItemsStorage =declare(IEnumerable/*<ItemInfo>*/, {
//        internal 
        constructor:function(/* InternalSelectedItemsStorage collection or int*/ capacity, /*IEqualityComparer<ItemInfo>*/ equalityComparer) 
        {
        	this._resolvedCount = 0; 
            this._unresolvedCount = 0;
            this._set = null;
            this._batchRemove=null;
            
        	if(typeof(capacity) == "number"){
            	this._equalityComparer = equalityComparer;
            	this._list = new List/*<ItemInfo>*/(capacity);
            	this._set = new Dictionary/*<ItemInfo, ItemInfo>*/(capacity, equalityComparer); 
        	}else{
                this._equalityComparer = (equalityComparer ===undefined ? capacity._equalityComparer : equalityComparer); 

                this._list = new List/*<ItemInfo>*/(capacity._list);

                if (capacity.UsesItemHashCodes) 
                {
                    this._set = new Dictionary/*<ItemInfo, ItemInfo>*/(capacity._set, this._equalityComparer); 
                } 

                this._resolvedCount = capacity._resolvedCount; 
                this._unresolvedCount = capacity._unresolvedCount;
        	}
        },
        
//        public void 
        Add:function(/*object*/ item, /*DependencyObject*/ container, /*int*/ index) 
        {
        	if(arguments.length==3){
                this.Add(new ItemInfo(item, container, index)); 
        	}else if(arguments.length==1){
                if (this._set != null)
                {
                	this._set.Add(item, item); 
                }
                this._list.Add(item); 

                if (item.IsResolved) {
                	++this._resolvedCount;
            	}else {
            		++this._unresolvedCount; 
            	}                  
        	}
        },
        
//        public bool 
        Remove:function(/*ItemInfo*/ e)
        { 
            var removed = false;
            if (this._set != null) 
            { 
                var realInfoOut = {
                	"value" : null	
                };
                var result = this._set.TryGetValue(e, /*out realInfo*/realInfoOut);
                /*ItemInfo*/var realInfo = realInfoOut.value;
                if (result) 
                {
                    removed = true;
                    this._set.Remove(e);     // remove from hash table

                    if (this.RemoveIsDeferred)
                    { 
                        // mark as removed - the real removal comes later 
                        realInfo.Container = this.ItemInfo.RemovedContainer;
                        ++ this._batchRemove.RemovedCount; 
                    }
                    else
                    {
                    	this.RemoveFromList(e); 
                    }
                } 
            } 
            else
            { 
                removed = this.RemoveFromList(e);
            }

            if (removed) 
            {
                if (e.IsResolved)   --this._resolvedCount; 
                else                --this._unresolvedCount; 
            }

            return removed;
        },
//        private bool 
        RemoveFromList:function(/*ItemInfo*/ e) 
        {
            var removed = false; 
            var index = this.LastIndexInList(e); // removals tend to happen from the end of the list 
            if (index >= 0)
            { 
                this._list.RemoveAt(index);
                removed = true;
            }
            return removed; 
        },

//        public bool 
        Contains:function(/*ItemInfo*/ e) 
        {
            if (this._set != null) 
            {
                return this._set.ContainsKey(e);
            }
            else 
            {
                return (this.IndexInList(e) >= 0); 
            } 
        },
//        public void 
        Clear:function() 
        {
        	this._list.Clear();
            if (this._set != null)
            { 
            	this._set.Clear();
            } 

            this._resolvedCount = this._unresolvedCount = 0;
        },
        // using (storage.DeferRemove()) {...} defers the actual removal
        // of entries from _list until leaving the scope.   At that point, 
        // the removal can be done more efficiently.
//        public IDisposable 
        DeferRemove:function() 
        { 
            if (this._batchRemove == null)
            { 
            	this._batchRemove = new BatchRemoveHelper(this);
            }

            this._batchRemove.Enter(); 
            return this._batchRemove;
        }, 

        // do the actual removal of entries marked as Removed
//        private void 
        DoBatchRemove:function() 
        {
            var j=0, n=this._list.Count;

            // copy the surviving entries to the front of the list 
            for (var i=0; i<n; ++i)
            { 
                /*ItemInfo*/var info = this._list.Get(i); 
                if (!info.IsRemoved)
                { 
                    if (j < i)
                    {
                    	this._list.Set(j, this._list.Get(i));
                    } 
                    ++j;
                } 
            } 

            // remove the remaining unneeded entries 
            this._list.RemoveRange(j, n-j);
        },

//        IEnumerator IEnumerable.
        GetEnumerator:function()
        { 
            return this._list.GetEnumerator();
        },
//        public ItemInfo 
        FindMatch:function(/*ItemInfo*/ info)
        { 
            /*ItemInfo*/var result = null; 
            if (this._set != null) 
            {
            	var resultOut={
            		"value" :null
            	};
            	
                if (!this._set.TryGetValue(info, /*out result*/resultOut))
                {
                    result = null; 
                }
                result = resultOut.value;
            } 
            else 
            {
                var index = this.IndexInList(info); 
                result = (index < 0) ? null : this._list.Get(index);
            }

            return result; 
        },
        // like IndexOf, but uses the equality comparer 
//        private int 
        IndexInList:function(/*ItemInfo*/ info)
        { 
        	var comparer = this._equalityComparer;
            return this._list.FindIndex( /*(ItemInfo x) =>*/function(x) { return comparer.Equals(info, x); } );
        },
        // like LastIndexOf, but uses the equality comparer 
//        private int 
        LastIndexInList:function(/*ItemInfo*/ info)
        { 
        	var comparer = this._equalityComparer;
            return this._list.FindLastIndex( /*(ItemInfo x) =>*/function(x) { return comparer.Equals(info, x); } ); 
        },

//        public ItemInfo 
        Get:function(index){
    	   return this._list.Get(index);
    	}
    });
    
    Object.defineProperties(InternalSelectedItemsStorage.prototype, {
//	    public int 
	    Count:
	    {
	        get:function()
	        {
	            return this._list.Count; 
	        } 
	    },

//	    public bool 
	    RemoveIsDeferred: { get:function() { return this._batchRemove != null && this._batchRemove.IsActive; } },
//	    public int 
	    ResolvedCount: { get:function() { return this._resolvedCount; } }, 
//	    public int 
	    UnresolvedCount: { get:function() { return this._unresolvedCount; } },
	    // If the underlying items don't implement GetHashCode according to
	    // guidelines (i.e. if an item's hashcode can change during the item's 
	    // lifetime) we can't use any hash-based data structures like Dictionary,
	    // Hashtable, etc.  The principal offender is DataRowView.  (bug 1583080)
//	    public bool 
	    UsesItemHashCodes:
	    { 
	        get:function() { return this._set != null; },
	        set:function(value) 
	        { 
	            if (value == true && this._set == null)
	            { 
	            	this._set = new Dictionary/*<ItemInfo, ItemInfo>*/(this._list.Count);
	                for (var i=0; i<this._list.Count; ++i)
	                {
	                	var info = this._list.Get(i);
	                	this._set.Add(info, info); 
	                }
	            } 
	            else if (value == false) 
	            {
	            	this._set = null; 
	            }
	        }
	    }
    });
    
    InternalSelectedItemsStorage.Type = new Type("InternalSelectedItemsStorage", InternalSelectedItemsStorage, [IEnumerable.Type]);
    return InternalSelectedItemsStorage;
});
