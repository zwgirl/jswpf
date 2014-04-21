/**
 * FrugalMap
 */
/// <summary>
/// A simple class to handle an array of between 6 and 12 key/value pairs.  It is unsorted 
/// and uses a linear search.  Perf analysis showed that this was the optimal size for both 
/// memory and perf.  The values may need to be adjusted as the CLR and Avalon evolve.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalMapBase", "utility/FrugalMapStoreState", "utility/Entry"], 
		function(declare, Type, FrugalMapBase, FrugalMapStoreState, Entry){    
    // MINSIZE and GROWTH chosen to minimize memory footprint
//    private const int 
    var MINSIZE = 9; 
//    private const int 
    var MAXSIZE = 15; 
//    private const int 
    var GROWTH = 3;
    
	var ArrayObjectMap = declare("ArrayObjectMap", FrugalMapBase,{
		constructor:function(){
//	        // The number of items in the map.
//	        private UInt16 
			this._count = 0;
	//
//	        private bool 
			this._sorted = false; 
//	        private Entry[] 
			this._entries = null;
		},
//        public override FrugalMapStoreState 
        InsertEntry:function(/*int*/ key, /*Object*/ value)
        { 
            // Check to see if we are updating an existing entry
            for (var index = 0; index < this._count; ++index) 
            { 
                if (this._entries[index].Key == key)
                {
                    this._entries[index].Value = value;
                    return FrugalMapStoreState.Success; 
                }
            } 
 
            // New key/value pair
            if (MAXSIZE > this._count) 
            {
                // Space still available to store the value
                if (null != this._entries)
                { 
                    // We are adding an entry to the array, so we may not be sorted any longer
                	this._sorted = false; 
 
                    if (this._entries.length > this._count)
                    { 
                        // Have empty entries, just set the first available
                    }
                    else
                    { 
                        /*Entry[]*/var destEntries = []; //new Entry[_entries.Length + GROWTH];
                        destEntries.length = this._entries.length + GROWTH;
                        // Copy old array 
//                        Array.Copy(_entries, 0, destEntries, 0, _entries.Length);
                        for(var i=0; i<this._entries.length; i++){
                        	destEntries[i] = this._entries[i];
                        }
                        
                        for(var i=0, index=this._entries.length; i<GROWTH; i++){
                        	destEntries[i + index] = new Entry();
                        }
                        this._entries = destEntries; 
                    }
                }
                else
                { 
                	this._entries = []; //new Entry[MINSIZE];
                	for(var i =0; i<MINSIZE; i++){
                		this._entries[i] = new Entry();
                	}
                    // No entries, must be sorted 
                	this._sorted = true;
                } 

                // Stuff in the new key/value pair
                this._entries[this._count].Key = key;
                this._entries[this._count].Value = value; 

                // Bump the count for the entry just added. 
                ++this._count; 

                return FrugalMapStoreState.Success; 
            }
            else
            {
                // Array is full, move to a SortedArray 
                return FrugalMapStoreState.SortedArray;
            } 
        }, 
        
//        public override void 
        RemoveEntry:function(/*int*/ key) 
        {
            for (var index = 0; index < this._count; ++index)
            {
                if (this._entries[index].Key == key) 
                {
                    // Shift entries down 
                    var numToCopy = (this._count - index) - 1; 
                    if (numToCopy > 0)
                    { 
//                        Array.Copy(_entries, index + 1, _entries, index, numToCopy);
                    	for(var i=0; i<numToCopy; i++){
                    		this._entries[index + i] = this._entries[index + i +1];
                    	}
                    }

                    // Wipe out the last entry 
                    this._entries[this._count - 1].Key = FrugalMapBase.INVALIDKEY;
                    this._entries[this._count - 1].Value = Type.UnsetValue; 
                    --this._count; 
                    break;
                } 
            }
        },

//        public override Object 
        Search:function(/*int*/ key) 
        {
            for (var index = 0; index < this._count; ++index) 
            { 
                if (key == this._entries[index].Key)
                { 
                    return this._entries[index].Value;
                }
            }
            return Type.UnsetValue; 
        },
 
//        public override void 
        Sort:function() 
        {
            if ((false == this._sorted) && (this._count > 1)) 
            {
                QSort(0, (this._count - 1));
                this._sorted = true;
            } 
        },
        
        // Compare two Entry nodes in the _entries array
//        private int 
        Compare:function(/*int*/ left, /*int*/ right)
        {
            return (this._entries[left].Key - this._entries[right].Key); 
        },
 
        // Partition the _entries array for QuickSort 
//        private int 
        Partition:function(/*int*/ left, /*int*/ right)
        { 
            /*int*/var pivot = right;
            /*int*/var i = left - 1;
            /*int*/var j = right;
            /*Entry*/var temp; 

            for (;;) 
            { 
                while (Compare(++i, pivot) < 0);
                while (Compare(pivot, --j) < 0) 
                {
                    if (j == left)
                    {
                        break; 
                    }
                } 
                if (i >= j) 
                {
                    break; 
                }
                temp = this._entries[j];
                this._entries[j] = this._entries[i];
                this._entries[i] = temp; 
            }
            temp = this._entries[right]; 
            this._entries[right] = this._entries[i]; 
            this._entries[i] = temp;
            return i; 
        },

        // Sort the _entries array using an index based QuickSort
//        private void 
        QSort:function(/*int*/ left, /*int*/ right) 
        {
            if (left < right) 
            { 
                /*int*/var pivot = this.Partition(left, right);
                this.QSort(left, pivot - 1); 
                this.QSort(pivot + 1, right);
            }
        },
 
//        public override void 
        GetKeyValuePair:function(/*int*/ index, /*out int key*/keyOut, /*out Object value*/valueOut) 
        {
            if (index < this._count) 
            {
            	valueOut.value = this._entries[index].Value;
                keyOut.key = this._entries[index].Key;
            } 
            else
            { 
            	valueOut.value = Type.UnsetValue; 
                keyOut.key = FrugalMapBase.INVALIDKEY;
                throw new ArgumentOutOfRangeException("index"); 
            }
        },

//        public override void 
        Iterate:function(/*ArrayList*/ list, /*FrugalMapIterationCallback*/ callback) 
        {
            if (this._count > 0) 
            { 
                for (var i=0; i< this._count; i++)
                { 
                    callback(list, this._entries[i].Key, this._entries[i].Value);
                }
            }
        },

//        public override void 
        Promote:function(/*FrugalMapBase*/ newMap) 
        { 
            for (var index = 0; index < this._entries.length; ++index)
            { 
                if (FrugalMapStoreState.Success == newMap.InsertEntry(this._entries[index].Key, this._entries[index].Value))
                {
                    continue;
                } 
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap"); 
            } 
        }
	});
	
	Object.defineProperties(ArrayObjectMap.prototype,{
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
	
	
	ArrayObjectMap.Type = new Type("ArrayObjectMap", ArrayObjectMap, [FrugalMapBase.Type]);
	return ArrayObjectMap;
});

