/**
 * SixObjectMap
 */
/// <summary>
    /// A simple class to handle a single object with 6 key/value pairs.  The pairs are stored unsorted 
    /// and uses a linear search.  Perf analysis showed that this yielded better memory locality and
    /// perf than an object and an array.
    /// </summary>
    /// <remarks> 
    /// This map inserts at the last position.  Any time we add to the map we set _sorted to false. If you need
    /// to iterate through the map in sorted order you must call Sort before using GetKeyValuePair. 
    /// </remarks> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalMapBase", "utility/Entry", "utility/FrugalMapStoreState"], 
		function(declare, Type, FrugalMapBase, Entry, FrugalMapStoreState){
//    private const int 
	var SIZE = 6; 
	var SixObjectMap = declare("SixObjectMap", FrugalMapBase,{
		constructor:function(){
	        // The number of items in the map.
//	        private UInt16 
			this._count = 0;
	 
//	        private bool 
			this._sorted = false;
//	        private Entry 
			this._entry0 = new Entry(); 
//	        private Entry 
			this._entry1 = new Entry(); 
//	        private Entry 
			this._entry2 = new Entry();
//	        private Entry 
			this._entry3 = new Entry(); 
//	        private Entry 
			this._entry4 = new Entry();
//	        private Entry 
			this._entry5 = new Entry();
		},
		
//		public override FrugalMapStoreState 
		InsertEntry:function(/*int*/ key, /*Object*/ value)
        {
            // Check to see if we are updating an existing entry
//            Debug.Assert(FrugalMapBase.INVALIDKEY != key); 

            // First check if the key matches the key of one of the existing entries. 
            // If it does, overwrite the existing value and return success. 
            if (this._count > 0)
            { 
                if (this._entry0.Key == key)
                {
                    this._entry0.Value = value;
                    return FrugalMapStoreState.Success; 
                }
                if (this._count > 1) 
                { 
                    if (this._entry1.Key == key)
                    { 
                        this._entry1.Value = value;
                        return FrugalMapStoreState.Success;
                    }
                    if (this._count > 2) 
                    {
                        if (this._entry2.Key == key) 
                        { 
                            this._entry2.Value = value;
                            return FrugalMapStoreState.Success; 
                        }
                        if (this._count > 3)
                        {
                            if (this._entry3.Key == key) 
                            {
                                this._entry3.Value = value; 
                                return FrugalMapStoreState.Success; 
                            }
                            if (this._count > 4) 
                            {
                                if (this._entry4.Key == key)
                                {
                                    this._entry4.Value = value; 
                                    return FrugalMapStoreState.Success;
                                } 
                                if ((this._count > 5) && (this._entry5.Key == key)) 
                                {
                                    this._entry5.Value = value; 
                                    return FrugalMapStoreState.Success;
                                }
                            }
                        } 
                    }
                } 
            } 

            // If we got past the above switch, that means this key 
            // doesn't exist in the map already so we should add it.
            // Only add it if we're not at the size limit; otherwise
            // we have to promote.
            if (SIZE > this._count) 
            {
                // We are adding an entry to the array, so we may not be sorted any longer 
                this._sorted = false; 

                // Space still available to store the value. Insert 
                // into the entry at this._count (the next available slot).
                switch (this._count)
                {
                    case 0: 
                        this._entry0.Key = key;
                        this._entry0.Value = value; 
 
                        // Single entries are always sorted
                        this._sorted = true; 
                        break;

                    case 1:
                        this._entry1.Key = key; 
                        this._entry1.Value = value;
                        break; 
 
                    case 2:
                        this._entry2.Key = key; 
                        this._entry2.Value = value;
                        break;

                    case 3: 
                        this._entry3.Key = key;
                        this._entry3.Value = value; 
                        break; 

                    case 4: 
                        this._entry4.Key = key;
                        this._entry4.Value = value;
                        break;
 
                    case 5:
                        this._entry5.Key = key; 
                        this._entry5.Value = value; 
                        break;
                } 
                ++this._count;

                return FrugalMapStoreState.Success;
            } 
            else
            { 
                // Array is full, move to a Array 
                return FrugalMapStoreState.Array;
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
                        this._entry0.Value = Type.UnsetValue;
                        --this._count; 
                        return; 
                    }
                    break; 

                case 2:
                    if (this._entry0.Key == key)
                    { 
                        this._entry0 = this._entry1;
                        this._entry1.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry1.Value = Type.UnsetValue; 
                        --this._count;
                        break; 
                    }
                    if (this._entry1.Key == key)
                    {
                        this._entry1.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry1.Value = Type.UnsetValue;
                        --this._count; 
                    } 
                    break;
 
                case 3:
                    if (this._entry0.Key == key)
                    {
                        this._entry0 = this._entry1; 
                        this._entry1 = this._entry2;
                        this._entry2.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry2.Value = Type.UnsetValue; 
                        --this._count;
                        break; 
                    }
                    if (this._entry1.Key == key)
                    {
                        this._entry1 = this._entry2; 
                        this._entry2.Key = FrugalMapBase.INVALIDKEY;
                        this._entry2.Value = Type.UnsetValue; 
                        --this._count; 
                        break;
                    } 
                    if (this._entry2.Key == key)
                    {
                        this._entry2.Key = FrugalMapBase.INVALIDKEY;
                        this._entry2.Value = Type.UnsetValue; 
                        --this._count;
                        break; 
                    } 
                    break;
 
                case 4:
                    if (this._entry0.Key == key)
                    {
                        this._entry0 = this._entry1; 
                        this._entry1 = this._entry2;
                        this._entry2 = this._entry3; 
                        this._entry3.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry3.Value = Type.UnsetValue;
                        --this._count; 
                        break;
                    }
                    if (this._entry1.Key == key)
                    { 
                        this._entry1 = this._entry2;
                        this._entry2 = this._entry3; 
                        this._entry3.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry3.Value = Type.UnsetValue;
                        --this._count; 
                        break;
                    }
                    if (this._entry2.Key == key)
                    { 
                        this._entry2 = this._entry3;
                        this._entry3.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry3.Value = Type.UnsetValue; 
                        --this._count;
                        break; 
                    }
                    if (this._entry3.Key == key)
                    {
                        this._entry3.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry3.Value = Type.UnsetValue;
                        --this._count; 
                        break; 
                    }
                    break; 

                case 5:
                    if (this._entry0.Key == key)
                    { 
                        this._entry0 = this._entry1;
                        this._entry1 = this._entry2; 
                        this._entry2 = this._entry3; 
                        this._entry3 = this._entry4;
                        this._entry4.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry4.Value = Type.UnsetValue;
                        --this._count;
                        break;
                    } 
                    if (this._entry1.Key == key)
                    { 
                        this._entry1 = this._entry2; 
                        this._entry2 = this._entry3;
                        this._entry3 = this._entry4; 
                        this._entry4.Key = FrugalMapBase.INVALIDKEY;
                        this._entry4.Value = Type.UnsetValue;
                        --this._count;
                        break; 
                    }
                    if (this._entry2.Key == key) 
                    { 
                        this._entry2 = this._entry3;
                        this._entry3 = this._entry4; 
                        this._entry4.Key = FrugalMapBase.INVALIDKEY;
                        this._entry4.Value = Type.UnsetValue;
                        --this._count;
                        break; 
                    }
                    if (this._entry3.Key == key) 
                    { 
                        this._entry3 = this._entry4;
                        this._entry4.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry4.Value = Type.UnsetValue;
                        --this._count;
                        break;
                    } 
                    if (this._entry4.Key == key)
                    { 
                        this._entry4.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry4.Value = Type.UnsetValue;
                        --this._count; 
                        break;
                    }
                    break;
 
                case 6:
                    if (this._entry0.Key == key) 
                    { 
                        this._entry0 = this._entry1;
                        this._entry1 = this._entry2; 
                        this._entry2 = this._entry3;
                        this._entry3 = this._entry4;
                        this._entry4 = this._entry5;
                        this._entry5.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry5.Value = Type.UnsetValue;
                        --this._count; 
                        break; 
                    }
                    if (this._entry1.Key == key) 
                    {
                        this._entry1 = this._entry2;
                        this._entry2 = this._entry3;
                        this._entry3 = this._entry4; 
                        this._entry4 = this._entry5;
                        this._entry5.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry5.Value = Type.UnsetValue; 
                        --this._count;
                        break; 
                    }
                    if (this._entry2.Key == key)
                    {
                        this._entry2 = this._entry3; 
                        this._entry3 = this._entry4;
                        this._entry4 = this._entry5; 
                        this._entry5.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry5.Value = Type.UnsetValue;
                        --this._count; 
                        break;
                    }
                    if (this._entry3.Key == key)
                    { 
                        this._entry3 = this._entry4;
                        this._entry4 = this._entry5; 
                        this._entry5.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry5.Value = Type.UnsetValue;
                        --this._count; 
                        break;
                    }
                    if (this._entry4.Key == key)
                    { 
                        this._entry4 = this._entry5;
                        this._entry5.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry5.Value = Type.UnsetValue; 
                        --this._count;
                        break; 
                    }
                    if (this._entry5.Key == key)
                    {
                        this._entry5.Key = FrugalMapBase.INVALIDKEY; 
                        this._entry5.Value = Type.UnsetValue;
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
                    if (this._count > 2) 
                    {
                        if (this._entry2.Key == key) 
                        { 
                            return this._entry2.Value;
                        } 
                        if (this._count > 3)
                        {
                            if (this._entry3.Key == key)
                            { 
                                return this._entry3.Value;
                            } 
                            if (this._count > 4) 
                            {
                                if (this._entry4.Key == key) 
                                {
                                    return this._entry4.Value;
                                }
                                if ((this._count > 5) && (this._entry5.Key == key)) 
                                {
                                    return this._entry5.Value; 
                                } 
                            }
                        } 
                    }
                }
            }
            return Type.UnsetValue; 
        },
 
//        public override void 
        Sort:function() 
        {
            // If we're unsorted and we have entries to sort, do a simple 
            // bubble sort. Sort the pairs, 0..5, and then again until we no
            // longer do any swapping.
            if ((false == this._sorted) && (this._count > 1))
            { 
                var swapped;
 
                do 
                {
                    swapped = false; 

                    var temp;
                    if (this._entry0.Key > this._entry1.Key)
                    { 
                        temp = this._entry0;
                        this._entry0 = this._entry1; 
                        this._entry1 = temp; 
                        swapped = true;
                    } 
                    if (this._count > 2)
                    {
                        if (this._entry1.Key > this._entry2.Key)
                        { 
                            temp = this._entry1;
                            this._entry1 = this._entry2; 
                            this._entry2 = temp; 
                            swapped = true;
                        } 
                        if (this._count > 3)
                        {
                            if (this._entry2.Key > this._entry3.Key)
                            { 
                                temp = this._entry2;
                                this._entry2 = this._entry3; 
                                this._entry3 = temp; 
                                swapped = true;
                            } 
                            if (this._count > 4)
                            {
                                if (this._entry3.Key > this._entry4.Key)
                                { 
                                    temp = this._entry3;
                                    this._entry3 = this._entry4; 
                                    this._entry4 = temp; 
                                    swapped = true;
                                } 
                                if (this._count > 5)
                                {
                                    if (this._entry4.Key > this._entry5.Key)
                                    { 
                                        temp = this._entry4;
                                        this._entry4 = this._entry5; 
                                        this._entry5 = temp; 
                                        swapped = true;
                                    } 
                                }
                            }
                        }
                    } 
                }
                while (swapped); 
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
 
                    case 3:
                        keyOut.key = this._entry3.Key; 
                        valueOut.value = this._entry3.Value; 
                        break;
 
                    case 4:
                        keyOut.key = this._entry4.Key;
                        valueOut.value = this._entry4.Value;
                        break; 

                    case 5: 
                        keyOut.key = this._entry5.Key; 
                        valueOut.value = this._entry5.Value;
                        break; 

                    default:
                        keyOut.key = FrugalMapBase.INVALIDKEY;
                        valueOut.value = Type.UnsetValue; 
                        break;
                } 
            } 
            else
            { 
                keyOut.key = FrugalMapBase.INVALIDKEY;
                valueOut.value = Type.UnsetValue;
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
                if (this._count >= 3)
                {
                    callback(list, this._entry2.Key, this._entry2.Value);
                } 
                if (this._count >= 4)
                { 
                    callback(list, this._entry3.Key, this._entry3.Value); 
                }
                if (this._count >= 5) 
                {
                    callback(list, this._entry4.Key, this._entry4.Value);
                }
                if (this._count == 6) 
                {
                    callback(list, this._entry5.Key, this._entry5.Value); 
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
            if (FrugalMapStoreState.Success != newMap.InsertEntry(this._entry3.Key, this._entry3.Value))
            {
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap"); 
            }
            if (FrugalMapStoreState.Success != newMap.InsertEntry(this._entry4.Key, this._entry4.Value)) 
            { 
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap"); 
            }
            if (FrugalMapStoreState.Success != newMap.InsertEntry(this._entry5.Key, this._entry5.Value))
            {
                // newMap is smaller than previous map 
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
            } 
        } 

	});
	
	Object.defineProperties(SixObjectMap.prototype,{
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
	
	SixObjectMap.Type = new Type("SixObjectMap", SixObjectMap, [FrugalMapBase.Type]);
	return SixObjectMap;
});
