/**
 * FrugalMap
 */

define(["dojo/_base/declare", "system/Type", "utility/SingleObjectMap", "utility/FrugalMapStoreState",
        "utility/ThreeObjectMap", "utility/SixObjectMap", "utility/ArrayObjectMap", "utility/SortedObjectMap",
        "utility/HashObjectMap"], 
		function(declare, Type, SingleObjectMap, FrugalMapStoreState, 
				ThreeObjectMap, SixObjectMap, ArrayObjectMap, SortedObjectMap,
				HashObjectMap){
//	internal struct 
	var FrugalMap = declare("FrugalMap", null, {
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
                	this._mapStore = new SingleObjectMap(); 
                }

                /*FrugalMapStoreState*/var myState = this._mapStore.InsertEntry(key, value);
                if (FrugalMapStoreState.Success == myState) 
                {
                    return; 
                } 
                else
                { 
                    // Need to move to a more complex storage
                    /*FrugalMapBase*/var newStore;

                    if (FrugalMapStoreState.ThreeObjectMap == myState) 
                    {
                        newStore = new ThreeObjectMap(); 
                    } 
                    else if (FrugalMapStoreState.SixObjectMap == myState)
                    { 
                        newStore = new SixObjectMap();
                    }
                    else if (FrugalMapStoreState.Array == myState)
                    { 
                        newStore = new ArrayObjectMap();
                    } 
                    else if (FrugalMapStoreState.SortedArray == myState) 
                    {
                        newStore = new SortedObjectMap(); 
                    }
                    else if (FrugalMapStoreState.Hashtable == myState)
                    {
                        newStore = new HashObjectMap(); 
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
 
    Object.defineProperties(FrugalMap.prototype, {
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
	
	
	FrugalMap.Type = new Type("FrugalMap", FrugalMap, [Object.Type]);
	return FrugalMap;
});



