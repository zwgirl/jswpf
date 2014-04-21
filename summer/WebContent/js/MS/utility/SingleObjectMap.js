/**
 * Second check 12-16
 * SingleObjectMap
 */
/// <summary>
/// A simple class to handle a single key/value pair
/// </summary> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalMapBase", "utility/FrugalMapStoreState", "utility/Entry"], 
		function(declare, Type, FrugalMapBase, FrugalMapStoreState, Entry){
	var SingleObjectMap = declare("SingleObjectMap", FrugalMapBase,{
		constructor:function(){
			this._loneEntry = new Entry();
			this._loneEntry.Key = FrugalMapBase.INVALIDKEY; 
			this._loneEntry.Value = Type.UnsetValue;
		},
//		 public override FrugalMapStoreState 
		InsertEntry:function(/*int*/ key, /*Object*/ value) 
        {
            // If we don't have any entries or the existing entry is being overwritten, 
            // then we can use this map.  Otherwise we have to promote. 
            if ((FrugalMapBase.INVALIDKEY == this._loneEntry.Key) || (key == this._loneEntry.Key))
            { 
//                Debug.Assert(INVALIDKEY != key);

                this._loneEntry.Key = key;
                this._loneEntry.Value = value; 
                return FrugalMapStoreState.Success;
            } 
            else 
            {
                // Entry already used, move to an ThreeObjectMap 
                return FrugalMapStoreState.ThreeObjectMap;
            }
        },
 
//        public override void 
        RemoveEntry:function(/*int*/ key)
        { 
            // Wipe out the info in the only entry if it matches the key. 
            if (key == this._loneEntry.Key)
            { 
            	this._loneEntry.Key = FrugalMapBase.INVALIDKEY;
            	this._loneEntry.Value = Type.UnsetValue;
            }
        }, 
//        public override Object 
        Search:function(/*int*/ key) 
        { 
            if (key == this._loneEntry.Key)
            { 
                return this._loneEntry.Value;
            }
            return Type.UnsetValue;
        }, 
//        public override void 
        Sort:function() 
        { 
            // Single items are already sorted.
        }, 

//        public override void 
        GetKeyValuePair:function(/*int*/ index, /*out int key*/keyOut, /*out Object value*/valueOut)
        {
            if (0 == index) 
            {
            	valueOut.value = this._loneEntry.Value; 
                keyOut.key = this._loneEntry.Key; 
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
            if (Count == 1)
            {
                callback(list, this._loneEntry.Key, this._loneEntry.Value);
            } 
        },

//        public override void 
        Promote:function(/*FrugalMapBase*/ newMap) 
        {
            if (FrugalMapStoreState.Success == newMap.InsertEntry(this._loneEntry.Key, this._loneEntry.Value)) 
            {
            }
            else
            { 
                // newMap is smaller than previous map
                throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap"); 
            } 
        }
	});
	
	Object.defineProperties(SingleObjectMap.prototype,{
        // Size of this data store
//        public override int 
		Count:
        {
            get:function() 
            {
                if (FrugalMapBase.INVALIDKEY != this._loneEntry.Key) 
                { 
                    return 1;
                } 
                else
                {
                    return 0;
                } 
            }
        } 	
	});
	
	SingleObjectMap.Type = new Type("SingleObjectMap", SingleObjectMap, [FrugalMapBase.Type]);
	return SingleObjectMap;
});
