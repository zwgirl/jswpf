/**
 * ThreeObjectMap
 */
/// <summary>
/// A simple class to handle a single object with 3 key/value pairs.  The pairs are stored unsorted 
/// and uses a linear search.  Perf analysis showed that this yielded better memory locality and
/// perf than an object and an array. 
/// </summary> 
/// <remarks>
/// This map inserts at the last position.  Any time we add to the map we set _sorted to false. If you need 
/// to iterate through the map in sorted order you must call Sort before using GetKeyValuePair.
/// </remarks>
define(["dojo/_base/declare", "system/Type", "utility/FrugalMapBase", "utility/FrugalMapStoreState", "utility/Entry"], 
		function(declare, Type, FrugalMapBase, FrugalMapStoreState, Entry){
	
//    private const int
	var SIZE = 3; 

	var ThreeObjectMap = declare("ThreeObjectMap", FrugalMapBase,{
		constructor:function(){
		    // The number of items in the map.
//		    private UInt16 
			this._count = 0; 

//		    private bool 
		    this._sorted = false;
//		    private Entry 
		    this._entry0 = new Entry();
//		    private Entry 
		    this._entry1 = new Entry(); 
//		    private Entry 
		    this._entry2 = new Entry();
		},
		
//		public override FrugalMapStoreState 
		InsertEntry:function(/*int*/ key, /*Object*/ value)
        { 
            // Check to see if we are updating an existing entry 
//            Debug.Assert(FrugalMapBase.INVALIDKEY != key);
 
            // First check if the key matches the key of one of the existing entries.
            // If it does, overwrite the existing value and return success.
            switch (this._count)
            { 
                case 1:
                    if (this._entry0.Key == key) 
                    { 
                    	this._entry0.Value = value;
                        return FrugalMapStoreState.Success; 
                    }
                    break;

                case 2: 
                    if (this._entry0.Key == key)
                    { 
                    	this._entry0.Value = value; 
                        return FrugalMapStoreState.Success;
                    } 
                    if (this._entry1.Key == key)
                    {
                    	this._entry1.Value = value;
                        return FrugalMapStoreState.Success; 
                    }
                    break; 
 
                case 3:
                    if (this._entry0.Key == key) 
                    {
                    	this._entry0.Value = value;
                        return FrugalMapStoreState.Success;
                    } 
                    if (this._entry1.Key == key)
                    { 
                    	this._entry1.Value = value; 
                        return FrugalMapStoreState.Success;
                    } 
                    if (this._entry2.Key == key)
                    {
                    	this._entry2.Value = value;
                        return FrugalMapStoreState.Success; 
                    }
                    break; 
 
                default:
                    break; 
            }

            // If we got past the above switch, that means this key
            // doesn't exist in the map already so we should add it. 
            // Only add it if we're not at the size limit; otherwise
            // we have to promote. 
            if (SIZE > this._count) 
            {
                // Space still available to store the value. Insert 
                // into the entry at _count (the next available slot).
                switch (this._count)
                {
                    case 0: 
                    	this._entry0.Key = key;
                    	this._entry0.Value = value; 
                    	this._sorted = true; 
                        break;
 
                    case 1:
                    	this._entry1.Key = key;
                    	this._entry1.Value = value;
                        // We have added an entry to the array, so we may not be sorted any longer 
                    	this._sorted = false;
                        break; 
 
                    case 2:
                    	this._entry2.Key = key; 
                    	this._entry2.Value = value;
                        // We have added an entry to the array, so we may not be sorted any longer
                    	this._sorted = false;
                        break; 
                }
                ++this._count; 
 
                return FrugalMapStoreState.Success;
            } 
            else
            {
                // Array is full, move to a SixObjectMap
                return FrugalMapStoreState.SixObjectMap; 
            }
        }, 
 
//        public override void 
        RemoveEntry:function(/*int*/ key)
        { 
            // If the key matches an existing entry, wipe out the last
            // entry and move all the other entries up.  Because we only
            // have three entries we can just unravel all the cases.
            switch (this._count) 
            {
                case 1: 
                    if (this._entry0.Key == key) 
                    {
                    	this._entry0.Key = FrugalMapBase.INVALIDKEY; 
                    	this._entry0.Value = DependencyProperty.UnsetValue;
                        --this._count;
                        return;
                    } 
                    break;
 
                case 2: 
                    if (this._entry0.Key == key)
                    { 
                    	this._entry0 = _entry1;
                    	this._entry1.Key = FrugalMapBase.INVALIDKEY;
                    	this._entry1.Value = DependencyProperty.UnsetValue;
                        --this._count; 
                        break;
                    } 
                    if (this._entry1.Key == key) 
                    {
                    	this._entry1.Key = FrugalMapBase.INVALIDKEY; 
                    	this._entry1.Value = DependencyProperty.UnsetValue;
                        --this._count;
                    }
                    break; 

                case 3: 
                    if (_entry0.Key == key) 
                    {
                    	this._entry0 = _entry1; 
                    	this._entry1 = _entry2;
                    	this._entry2.Key = FrugalMapBase.INVALIDKEY;
                    	this._entry2.Value = DependencyProperty.UnsetValue;
                        --this._count; 
                        break;
                    } 
                    if (this._entry1.Key == key) 
                    {
                    	this._entry1 = _entry2; 
                    	this._entry2.Key = FrugalMapBase.INVALIDKEY;
                    	this._entry2.Value = DependencyProperty.UnsetValue;
                        --this._count;
                        break; 
                    }
                    if (this._entry2.Key == key) 
                    { 
                    	this._entry2.Key = FrugalMapBase.INVALIDKEY;
                    	this._entry2.Value = DependencyProperty.UnsetValue; 
                        --this._count;
                        break;
                    }
                    break; 

                default: 
                    break; 
            }
        }, 

//        public override Object 
        Search:function(/*int*/ key)
        {
//            Debug.Assert(FrugalMapBase.INVALIDKEY != key); 
            if (this._count > 0)
            { 
                if (this._entry0.Key == key) 
                {
                    return this._entry0.Value; 
                }
                if (this._count > 1)
                {
                    if (this._entry1.Key == key) 
                    {
                        return this._entry1.Value; 
                    } 
                    if ((this._count > 2) && (this._entry2.Key == key))
                    { 
                        return this._entry2.Value;
                    }
                }
            } 
            return Type.UnsetValue;
        }, 
 
//        public override void 
        Sort:function()
        { 
            // If we're unsorted and we have entries to sort, do a simple
            // sort.  Sort the pairs (0,1), (1,2) and then (0,1) again.
            if ((false == this._sorted) && (this._count > 1))
            { 
                /*Entry*/var temp;
                if (this._entry0.Key > this._entry1.Key) 
                { 
                    temp = this._entry0;
                    this._entry0 = _entry1; 
                    this._entry1 = temp;
                }
                if (this._count > 2)
                { 
                    if (this._entry1.Key > this._entry2.Key)
                    { 
                        temp = this._entry1; 
                        this._entry1 = this._entry2;
                        this._entry2 = temp; 

                        if (this._entry0.Key > this._entry1.Key)
                        {
                            temp = this._entry0; 
                            this._entry0 = this._entry1;
                            this._entry1 = temp; 
                        } 
                    }
                } 
                this._sorted = true;
            }
        },
 
//        public override void 
        GetKeyValuePair:function(/*int*/ index, /*out int key*/keyOut, /*out Object value*/valueOut)
        { 
            if (index < this._count) 
            {
                switch (index) 
                {
                    case 0:
                    	keyOut.key = this._entry0.Key;
                    	valueOut.value = this._entry0.Value; 
                        break;
 
                    case 1: 
                    	keyOut.key = this._entry1.Key;
                    	valueOut.value = this._entry1.Value; 
                        break;

                    case 2:
                    	keyOut.key = this._entry2.Key; 
                    	valueOut.value = this._entry2.Value;
                        break; 
 
                    default:
                    	keyOut.key = FrugalMapBase.INVALIDKEY; 
                    valueOut.value = Type.UnsetValue;
                        break;
                }
            } 
            else
            { 
                key = FrugalMapBase.INVALIDKEY; 
                value = Type.UnsetValue;
                throw new ArgumentOutOfRangeException("index"); 
            }
        },

//        public override void 
        Iterate:function(/*ArrayList*/ list, /*FrugalMapIterationCallback*/ callback) 
        {
            if (this._count > 0) 
            { 
                if (this._count >= 1)
                { 
                    callback(list, this._entry0.Key, this._entry0.Value);
                }
                if (this._count >= 2)
                { 
                    callback(list, this._entry1.Key, this._entry1.Value);
                } 
                if (this._count == 3) 
                {
                    callback(list, this._entry2.Key, this._entry2.Value); 
                }
            }
        },
 
//        public override void 
        Promote:function(/*FrugalMapBase*/ newMap)
        { 
            if (FrugalMapStoreState.Success != newMap.InsertEntry(this._entry0.Key, this._entry0.Value)) 
            {
                // newMap is smaller than previous map 
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
            }
            if (FrugalMapStoreState.Success != newMap.InsertEntry(this._entry1.Key, this._entry1.Value))
            { 
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap"); 
            } 
            if (FrugalMapStoreState.Success != newMap.InsertEntry(this._entry2.Key, this._entry2.Value))
            { 
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
            }
        } 
	});
	
	Object.defineProperties(ThreeObjectMap.prototype,{
        // Size of this data store 
//        public override int 
		Count: 
        {
            get:function() 
            {
                return this._count;
            }
        }   
	});
	
	ThreeObjectMap.Type = new Type("ThreeObjectMap", ThreeObjectMap, [FrugalMapBase.Type]);
	return ThreeObjectMap;
});
