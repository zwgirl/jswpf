/**
 * InsertionSortMap
 */
// This is a variant of FrugalMap that always uses an array as the underlying store. 
// This avoids the virtual method calls that are present when the store morphs through
// the size efficient store classes normally used. It is appropriate only when we know the
// store will always be populated and individual elements will be accessed in a tight loop.
define(["dojo/_base/declare", "system/Type", "utility/LargeSortedObjectMap"], 
		function(declare, Type, LargeSortedObjectMap){
	var InsertionSortMap = declare("InsertionSortMap", Object,{
		constructor:function(){
//		    internal LargeSortedObjectMap 
			this._mapStore = null; 
		},
		
		Get:function(key)
        { 
            // If no entry, DependencyProperty.UnsetValue is returned
            if (null != this._mapStore)
            {
                return this._mapStore.Search(key); 
            }
            return Type.UnsetValue; 
        }, 

        Set:function(key, value) 
        {
            if (value != Type.UnsetValue)
            {
                // If not unset value, ensure write success 
                if (null != this._mapStore)
                { 
                    // This is done because forward branches 
                    // default prediction is not to be taken
                    // making this a CPU win because set is 
                    // a common operation.
                }
                else
                { 
                    this._mapStore = new LargeSortedObjectMap();
                } 

                /*FrugalMapStoreState*/var myState = this._mapStore.InsertEntry(key, value);
                if (FrugalMapStoreState.Success == myState) 
                {
                    return;
                }
                else 
                {
                    // Need to move to a more complex storage 
                    /*LargeSortedObjectMap*/var newStore; 

                    if (FrugalMapStoreState.SortedArray == myState) 
                    {
                        newStore =  new LargeSortedObjectMap();
                    }
                    else 
                    {
                        throw new InvalidOperationException(SR.Get(SRID.FrugalMap_CannotPromoteBeyondHashtable)); 
                    } 

                    // Extract the values from the old store and insert them into the new store 
                    this._mapStore.Promote(newStore);

                    // Insert the new value
                    this._mapStore = newStore; 
                    this._mapStore.InsertEntry(key, value);
                } 
            } 
            else
            { 
                // DependencyProperty.UnsetValue means remove the value
                if (null != this._mapStore)
                {
                	this._mapStore.RemoveEntry(key); 
                    if (this._mapStore.Count == 0)
                    { 
                        // Map Store is now empty ... throw it away 
                    	this._mapStore = null;
                    } 
                }
            }
        },
        
//        public void 
        Sort:function() 
        { 
            if (null != this._mapStore)
            { 
                this._mapStore.Sort();
            }
        },
//        public void 
        GetKeyValuePair:function(/*int*/ index, /*out int key*/keyOut, /*out Object value*/valueOut)
        { 
            if (null != this._mapStore) 
            {
            	this._mapStore.GetKeyValuePair(index, /*out key*/keyOut, /*out value*/valueOut); 
            }
            else
            {
                throw new ArgumentOutOfRangeException("index"); 
            }
        },
 
//        public void 
        Iterate:function(/*ArrayList*/ list, /*FrugalMapIterationCallback*/ callback)
        { 
            if (null != callback)
            {
                if (null != list)
                { 
                    if (this._mapStore != null)
                    { 
                    	this._mapStore.Iterate(list, callback); 
                    }
                } 
                else
                {
                    throw new ArgumentNullException("list");
                } 
            }
            else 
            { 
                throw new ArgumentNullException("callback");
            } 
        }
        
	});
	
	Object.defineProperties(InsertionSortMap.prototype,{
//        public int 
		Count:
        { 
            get:function()
            { 
                if (null != this._mapStore) 
                {
                    return this._mapStore.Count; 
                }
                return 0;
            }
        } 
	});
	
	InsertionSortMap.Type = new Type("InsertionSortMap", InsertionSortMap, [Object.Type]);
	return InsertionSortMap;
});
