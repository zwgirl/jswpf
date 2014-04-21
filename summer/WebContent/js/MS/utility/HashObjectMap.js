/**
 * HashObjectMap
 */

define(["dojo/_base/declare", "system/Type", "utility/FrugalMapBase"], 
		function(declare, Type, FrugalMapBase){
    // 163 is chosen because it is the first prime larger than 128, the MAXSIZE of SortedObjectMap
//    internal const int
	var MINSIZE = 163; 

    // Hashtable will return null from its indexer if the key is not
    // found OR if the value is null.  To distinguish between these 
    // two cases we insert NullValue instead of null.
//    private static object
	var NullValue = {}; //new object();
    
	var HashObjectMap = declare("HashObjectMap", FrugalMapBase,{
		constructor:function(){
//		       internal Hashtable
			this._entries = null; 
		},
//		public override FrugalMapStoreState 
		InsertEntry:function(/*int*/ key, /*Object*/ value) 
        {
//            Debug.Assert(FrugalMapBase.INVALIDKEY != key);

            if (null != this._entries) 
            {
                // This is done because forward branches 
                // default prediction is not to be taken 
                // making this a CPU win because insert
                // is a common operation. 
            }
            else
            {
            	this._entries = new Hashtable(MINSIZE); 
            }
 
            this._entries[key] = ((value != NullValue) && (value != null)) ? value : NullValue; 
            return FrugalMapStoreState.Success;
        }, 

//        public override void 
        RemoveEntry:function(/*int*/ key)
        {
        	this._entries.Remove(key); 
        },
 
//        public override Object 
        Search:function(/*int*/ key) 
        {
            var value = this._entries[key]; 

            return ((value != NullValue) && (value != null)) ? value : DependencyProperty.UnsetValue;
        },
 
//        public override void 
        Sort:function()
        { 
            // Always sorted. 
        },
 
//        public override void 
        GetKeyValuePair:function(/*int*/ index, /*out int key*/keyOut, /*out Object value*/valueOut)
        {
            if (index < _entries.Count)
            { 
                /*IDictionaryEnumerator*/var myEnumerator = this._entries.GetEnumerator();
 
                // Move to first valid value 
                myEnumerator.MoveNext();
 
                for (var i = 0; i < index; ++i)
                {
                    myEnumerator.MoveNext();
                } 
                keyOut.key = myEnumerator.Key;
                if ((myEnumerator.Value != NullValue) && (myEnumerator.Value != null)) 
                { 
                	valueOut.value = myEnumerator.Value;
                } 
                else
                {
                	valueOut.value = Type.UnsetValue;
                } 
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
            /*IDictionaryEnumerator*/var myEnumerator = _entries.GetEnumerator(); 

            while (myEnumerator.MoveNext()) 
            {
                var key = myEnumerator.Key;
                var value;
                if ((myEnumerator.Value != NullValue) && (myEnumerator.Value != null)) 
                {
                    value = myEnumerator.Value; 
                } 
                else
                { 
                    value = Type.UnsetValue;
                }

                callback(list, key, value); 
            }
        }, 
 
//        public override void 
        Promote:function(/*FrugalMapBase*/ newMap)
        { 
            // Should never get here
            throw new InvalidOperationException(SR.Get(SRID.FrugalMap_CannotPromoteBeyondHashtable));
        }
	});
	
	Object.defineProperties(HashObjectMap.prototype,{
        // Size of this data store
//        public override int 
		Count: 
        { 
            get:function()
            { 
                return this._entries.Count;
            }
        }		  
	});
	
	Object.defineProperties(HashObjectMap,{
		  
	});
	
	HashObjectMap.Type = new Type("HashObjectMap", HashObjectMap, [FrugalMapBase.Type]);
	return HashObjectMap;
});
