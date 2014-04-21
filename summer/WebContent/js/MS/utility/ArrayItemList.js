/**
 * ArrayItemList
 */
/// <summary> 
    /// A simple class to handle an array of 7 or more items.  It is unsorted and uses
    /// a linear search. 
    /// </summary> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalListBase"], 
		function(declare, Type, FrugalListBase){
	
	 // array-based implementation - compacts in-place or into a new array 
//    internal class 
	var ArrayCompacter =declare(FrugalListBase.Compacter, {
   	 	"-chains-": {
	      constructor: "manual"
	    },
        constructor:function(/*ArrayItemList<T>*/ store, /*int*/ newCount) 
        {
//        	: base(store, newCount)
        	FrugalListBase.Compacter.prototype.constructor.call(store, newCount);

            this._sourceArray = store._entries;

            // compute capacity for target array
            // the first term agrees with AIL.Add, which grows by 5/4 
            var newCapacity = Math.max(newCount + (newCount >> 2), MINSIZE); 

            if (newCapacity + (newCapacity >> 2) >= this._sourceArray.length) 
            {
                // if there's not much space to be reclaimed, compact in place
            	this._targetStore = store;
            } 
            else
            { 
                // otherwise, compact into a smaller array 
            	this._targetStore = new ArrayItemList/*<T>*/(newCapacity);
            } 

            this._targetArray = this._targetStore._entries;
        },

//        protected override void 
        IncludeOverride:function(/*int*/ start, /*int*/ end)
        { 
            // bulk move 
            var size = end - start;
//            Array.Copy(_sourceArray, start, _targetArray, _validItemCount, size); 
            for(var i=0; i<size; i++){
            	this._targetArray[i + this._validItemCount] = this._sourceArray[i + start];
            }
            this._validItemCount += size;
        },
//        public override FrugalListBase<T> 
        Finish:function()
        { 
            // clear out vacated entries in the source
            /*T*/var filler = null; //default(T); 
            if (this._sourceArray == this._targetArray) 
            {
                // in-place array source 
                for (var i=this._validItemCount, n=this._store.Count; i<n; ++i)
                {
                	this._sourceArray[i] = filler;
                } 
            }

            // reset Count and return target store
            this._targetStore._count = this._validItemCount; 
            return this._targetStore;
        }

//        ArrayItemList<T> _targetStore; 
//        T[] _sourceArray;
//        T[] _targetArray; 
    }); 
	
    // MINSIZE and GROWTH chosen to minimize memory footprint
//    private const int 
	var MINSIZE = 9;
//    private const int 
	var GROWTH = 3;
//    private const int 
	var LARGEGROWTH = 18; 
	var ArrayItemList = declare("ArrayItemList", FrugalListBase,{
		constructor:function(size){
			if(typeof size == "number"){
	            // Make size a multiple of GROWTH 
	            size += (GROWTH - 1);
	            size -= (size % GROWTH); 
	            this._entries = []; //new T[size];
	            this._entries.length = size;
			}else if(size instanceof ICollection){
				var collection = size;
				this._count = collection.Count;
				this._entries = []; //new T[_count]; 
                collection.CopyTo(this._entries, 0);
			}
		},
		
//		public override FrugalListStoreState 
		Add:function(/*T*/ value)
        {
            // If we don't have any entries or the existing entry is being overwritten,
            // then we can use this store. Otherwise we have to promote. 
            if ((null != this._entries) && (this._count < this._entries.length))
            { 
            	this._entries[this._count] = value; 
                ++this._count;
            } 
            else
            {
                if (null != this._entries)
                { 
                    var size = this._entries.length;
 
                    // Grow the list slowly while it is small but 
                    // faster once it reaches the LARGEGROWTH size
                    if (size < LARGEGROWTH) 
                    {
                        size += GROWTH;
                    }
                    else 
                    {
                        size += size >> 2; 
                    } 

                    /*T[]*/var destEntries = []; //new T[size]; 
                    destEntries.length = size;

                    // Copy old array
//                    Array.Copy(_entries, 0, destEntries, 0, _entries.length);
                    for(var i=0; i<this._entries.length; i++){
                    	destEntries[i] = this._entries[i];
                    }
                    this._entries = destEntries; 
                }
                else 
                { 
                	this._entries = [];//new T[MINSIZE];
                	this._entries.length = MINSIZE;
                } 

                // Insert into new array
                this._entries[this._count] = value;
                ++this._count; 
            }
            return FrugalListStoreState.Success; 
        }, 

//        public override void 
        Clear:function() 
        {
            // Wipe out the info.
            for (var i = 0; i < this._count; ++i)
            { 
            	this._entries[i] = null; //default(T);
            } 
            this._count = 0; 
        },
 
//        public override bool 
        Contains:function(/*T*/ value)
        {
            return (-1 != this.IndexOf(value));
        }, 

//        public override int 
        IndexOf:function(/*T*/ value) 
        { 
            for (var index = 0; index < this._count; ++index)
            { 
                if (this._entries[index].Equals(value))
                {
                    return index;
                } 
            }
            return -1; 
        }, 

//        public override void 
        Insert:function(/*int*/ index, /*T*/ value) 
        {
            if ((null != this._entries) && (this._count < this._entries.length))
            {
                // Move down the required number of items 
//                Array.Copy(_entries, index, _entries, index + 1, _count - index);
            	for(var i=this._count - index -1; i>=0; i--){
            		this._entries[i+index+1] = this._entries[i+index];
            	}
 
                // Put in the new item at the specified index 
                this._entries[index] = value;
                ++this._count; 
                return;
            }
            throw new ArgumentOutOfRangeException("index");
        }, 

//        public override void
        SetAt:function(/*int*/ index, /*T*/ value) 
        { 
            // Overwrite item at index
        	this._entries[index] = value; 
        },

//        public override bool 
        Remove:function(/*T*/ value)
        { 
            for (var index = 0; index < this._count; ++index)
            { 
                if (this._entries[index].Equals(value)) 
                {
                	this.RemoveAt(index); 
                    return true;
                }
            }
 
            return false;
        }, 
 
//        public override void 
        RemoveAt:function(/*int*/ index)
        { 
            // Shift entries down
            var numToCopy = (this._count - index) - 1;
            if (numToCopy > 0)
            { 
//                Array.Copy(this._entries, index + 1, _entries, index, numToCopy);
            	for(var i=0; i<numToCopy; i++){
            		this._entries[i + index] = this._entries[i + index + 1];
            	}
            } 
 
            // Wipe out the last entry
            this._entries[this._count - 1] = null; //default(T); 
            --this._count;
            return;
        },
 
//        public override T 
        EntryAt:function(/*int*/ index)
        { 
            return this._entries[index]; 
        },
 
//        public override void 
        Promote0:function(/*FrugalListBase<T>*/ oldList)
        {
            for (var index = 0; index < oldList.Count; ++index)
            { 
                if (FrugalListStoreState.Success == this.Add(oldList.EntryAt(index)))
                { 
                    continue; 
                }
                // this list is smaller than oldList 
                throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList");
            }
        },
 
        // Class specific implementation to avoid virtual method calls and additional logic
//        public void 
        Promote6:function(/*SixItemList<T>*/ oldList) 
        { 
            var oldCount = oldList.Count;
            this.SetCount(oldList.Count); 

            switch (oldCount)
            {
                case 6: 
                	this.SetAt(0, oldList.EntryAt(0));
                	this.SetAt(1, oldList.EntryAt(1)); 
                	this.SetAt(2, oldList.EntryAt(2)); 
                	this.SetAt(3, oldList.EntryAt(3));
                	this.SetAt(4, oldList.EntryAt(4)); 
                	this.SetAt(5, oldList.EntryAt(5));
                    break;

                case 5: 
                	this.SetAt(0, oldList.EntryAt(0));
                	this.SetAt(1, oldList.EntryAt(1)); 
                	this.SetAt(2, oldList.EntryAt(2)); 
                	this.SetAt(3, oldList.EntryAt(3));
                	this.SetAt(4, oldList.EntryAt(4)); 
                    break;

                case 4:
                	this.SetAt(0, oldList.EntryAt(0)); 
                	this.SetAt(1, oldList.EntryAt(1));
                	this.SetAt(2, oldList.EntryAt(2)); 
                	this.SetAt(3, oldList.EntryAt(3)); 
                    break;
 
                case 3:
                	this.SetAt(0, oldList.EntryAt(0));
                	this.SetAt(1, oldList.EntryAt(1));
                	this.SetAt(2, oldList.EntryAt(2)); 
                    break;
 
                case 2: 
                	this.SetAt(0, oldList.EntryAt(0));
                	this.SetAt(1, oldList.EntryAt(1)); 
                    break;

                case 1:
                	this.SetAt(0, oldList.EntryAt(0)); 
                    break;
 
                case 0: 
                    break;
 
                default:
                    throw new ArgumentOutOfRangeException("oldList");
            }
        }, 

        // Class specific implementation to avoid virtual method calls and additional logic 
//        public void 
        PromoteA:function(/*ArrayItemList<T>*/ oldList) 
        {
            var oldCount = oldList.Count; 
            if (this._entries.length >= oldCount)
            {
            	this.SetCount(oldList.Count);
 
                for (var index = 0; index < oldCount; ++index)
                { 
                	this.SetAt(index, oldList.EntryAt(index)); 
                }
            } 
            else
            {
                // this list is smaller than oldList
                throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList"); 
            }
        },
        
        Promote:function(oldList) 
        {
        	if(oldList instanceof ArrayItemList){
            	this.PromoteA(oldList);
        	}else if(oldList instanceof SixItemList){
        		this.Promote6(oldList);
        	}else if(oldList instanceof FrugalListBase){
        		this.Promote0(oldList);
        	}
        },
 
//        public override T[] 
        ToArray:function()
        { 
            /*T[]*/var array = []; //new T[_count];

            for (var i = 0; i < this._count; ++i)
            { 
                array[i] = this._entries[i];
            } 
            return array; 
        },
 
//        public override void 
        CopyTo:function(/*T[]*/ array, /*int*/ index)
        {
            for (var i = 0; i < this._count; ++i)
            { 
                array[index + i] = this._entries[i + index];
            } 
        }, 

//        public override object 
        Clone:function() 
        {
            var newList = new ArrayItemList/*<T>*/(this.Capacity);
            newList.Promote(this);
            return newList; 
        },
 
//        private void 
        SetCount:function(/*int*/ value) 
        {
            if ((value >= 0) && (value <= this._entries.length)) 
            {
            	this._count = value;
            }
            else 
            {
                throw new ArgumentOutOfRangeException("value"); 
            } 
        },
//        public override Compacter 
        NewCompacter:function(/*int*/ newCount)
        {
            return new ArrayCompacter(this, newCount);
        } 
	});
	
	Object.defineProperties(ArrayItemList.prototype,{
        // Capacity of this store 
//        public override int 
		Capacity: 
        {
            get:function() 
            {
                if (this._entries != null)
                {
                    return this._entries.length; 
                }
                return 0; 
            } 
        }		  
	});
	
	ArrayItemList.Type = new Type("ArrayItemList", ArrayItemList, [FrugalListBase.Type]);
	return ArrayItemList;
});
