/**
 * SortedObjectMap
 */
// A sorted array of key/value pairs. A binary search is used to minimize the cost of insert/search.
define(["dojo/_base/declare", "system/Type", "utility/FrugalMapBase"], 
		function(declare, Type, FrugalMapBase){
	
    // MINSIZE chosen to be larger than MAXSIZE of the ArrayObjectMap with some extra space for new values
    // The MAXSIZE and GROWTH are chosen to minimize memory usage as we grow the array 
//    private const int 
	var MINSIZE = 16;
//    private const int 
	var MAXSIZE = 128; 
//    private const int 
	var GROWTH = 8; 
    
	var SortedObjectMap = declare("SortedObjectMap", FrugalMapBase,{
		constructor:function(){
	        // The number of items in the map. 
//	        internal int 
			this._count = 0;

//	        private int 
			this._lastKey = FrugalMapBase.INVALIDKEY;
//	        private Entry[] 
			this._entries = null; 
		},
		
//		public override FrugalMapStoreState 
		InsertEntry:function(/*int*/ key, /*Object*/ value)
        { 
//            Debug.Assert(INVALIDKEY != key); 

            var foundOut = {"found" : null};
            // Check to see if we are updating an existing entry 
            var index = this.FindInsertIndex(key, /*out found*/foundOut);
            var found = foundOut.found;
            
            if (found)
            {
                this._entries[index].Value = value; 
                return FrugalMapStoreState.Success;
            } 
            else 
            {
                // New key/value pair 
                if (MAXSIZE > this._count)
                {
                    // Less than the maximum array size
                    if (null != this._entries) 
                    {
                        if (this._entries.length > _count) 
                        { 
                            // Have empty entries, just set the first available
                        } 
                        else
                        {
                            /*Entry[]*/var destEntries = []; //new Entry[_entries.Length + GROWTH];
 
                            // Copy old array
//                            Array.Copy(_entries, 0, destEntries, 0, _entries.Length); 
                            for(var i=0; i<this._entries.length; i++){
                            	destEntries[i] = this._entries[i];
                            }
                            
                            for(var i=0, pos = this._entries.length; i<GROWTH; i++){
                            	destEntries[i + pos] = new Entry();
                            }
                            
                            this._entries = destEntries; 
                        }
                    } 
                    else
                    {
                    	this._entries = []; //new Entry[MINSIZE];
                    	for(var i=0; i<MINSIZE; i++){
                    		this._entries[i] = new Entry();
                    	}
                    } 

                    // Inserting into the middle of the existing entries? 
                    if (index < this._count) 
                    {
                        // Move higher valued keys to make room for the new key 
//                        Array.Copy(_entries, index, _entries, index + 1, (_count - index));
                        for(var i= this._count - index -1; i>=0; i--){
                        	this._entries[i + index + 1] = this._entries[i + index];
                        }
                    }
                    else
                    { 
                    	this._lastKey = key;
                    } 
 
                    // Stuff in the new key/value pair
                    this._entries[index] = new Entry();
                    this._entries[index].Key = key; 
                    this._entries[index].Value = value;
                    ++this._count;
                    return FrugalMapStoreState.Success;
                } 
                else
                { 
                    // SortedArray is full, move to a hashtable 
                    return FrugalMapStoreState.Hashtable;
                } 
            }
        },
        
//        public override void 
        RemoveEntry:function(/*int*/ key) 
        {
//            Debug.Assert(INVALIDKEY != key);
 
            var foundOut = {"found" : null};
            var index = this.FindInsertIndex(key, /*out found*/foundOut);
            var found = foundOut.found;

            if (found)
            { 
                // Shift entries down
                var numToCopy = (this._count - index) - 1; 
                if (numToCopy > 0) 
                {
//                    Array.Copy(_entries, index + 1, _entries, index, numToCopy); 
                	for(var i=0; i<numToCopy; i++){
                		this._entries[i + index] = this._entries[i + index + 1];
                	}
                }
                else
                {
                    // If we're not copying anything, then it means we are 
                    //  going to remove the last entry.  Update _lastKey so
                    //  that it reflects the key of the new "last entry" 
                    if( this._count > 1 ) 
                    {
                        // Next-to-last entry will be the new last entry 
                    	this._lastKey = this._entries[this._count - 2].Key;
                    }
                    else
                    { 
                        // Unless there isn't a next-to-last entry, in which
                        //  case the key is reset to INVALIDKEY. 
                    	this._lastKey = INVALIDKEY; 
                    }
                } 

                // Wipe out the last entry
                this._entries[this._count - 1].Key = INVALIDKEY;
                this._entries[this._count - 1].Value = Type.UnsetValue; 

                --this._count; 
            } 
        },
 
//        public override Object 
        Search:function(/*int*/ key)
        {
            var foundOut = {"found" : null};
            var index = this.FindInsertIndex(key, /*out found*/foundOut);
            var found = foundOut.found;
            if (found) 
            { 
                return this._entries[index].Value;
            } 
            return Type.UnsetValue;
        },

//        public override void 
        Sort:function() 
        {
            // Always sorted. 
        },

//        public override void 
        GetKeyValuePair:function(/*int*/ index, /*out int key*/keyOut, /*out Object value*/valueOut) 
        {
            if (index < this._count)
            {
                value = this._entries[index].Value; 
                key = this._entries[index].Key;
            } 
            else 
            {
                value = Type.UnsetValue; 
                key = INVALIDKEY;
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
            for (var index = 0; index < this._entries.Length; ++index)
            {
                if (FrugalMapStoreState.Success == newMap.InsertEntry(this._entries[index].Key, this._entries[index].Value))
                { 
                    continue;
                } 
                // newMap is smaller than previous map 
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
            } 
        },

//        private int 
        FindInsertIndex:function(/*int*/ key, /*out bool found*/foundOut)
        { 
            var iLo = 0;
 
            // Only do the binary search if there is a chance of finding the key 
            // This also speeds insertion because we tend to insert at the end.
            if ((this._count > 0) && (key <= this._lastKey)) 
            {
                // The array index used for insertion is somewhere between 0
                //  and _count-1 inclusive
                var iHi = this._count-1; 

                // Do a binary search to find the insertion point 
                do 
                {
                    var iPv = Math.floor((iHi + iLo) / 2); 
                    if (key <= this._entries[iPv].Key)
                    {
                        iHi = iPv;
                    } 
                    else
                    { 
                        iLo = iPv + 1; 
                    }
                } 
                while (iLo < iHi);
                foundOut.found = (key == this._entries[iLo].Key);
            }
            else 
            {
                // Insert point is at the end 
                iLo = this._count; 
                foundOut.found = false;
            } 
            return iLo;
        }
	});
	
	Object.defineProperties(SortedObjectMap.prototype,{
//        public override int 
		Count:
        {
            get:function() 
            { 
                return this._count;
            } 
        }  
	});
	
	Object.defineProperties(SortedObjectMap,{
		  
	});
	
	SortedObjectMap.Type = new Type("SortedObjectMap", SortedObjectMap, [FrugalMapBase.Type]);
	return SortedObjectMap;
});

