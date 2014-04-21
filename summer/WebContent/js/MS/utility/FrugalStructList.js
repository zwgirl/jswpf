/**
 * FrugalStructList
 */
//Use FrugalStructList when only one reference to the list is needed.
// The "struct" in FrugalStructList refers to the list itself, not what the list contains. 
define(["dojo/_base/declare", "system/Type", "objectmodel/Collection",
        "utility/FrugalListStoreState", "utility/SingleItemList",
        "utility/ThreeItemList", "utility/SixItemList", "utility/ArrayItemList"], 
		function(declare, Type, Collection,
				FrugalListStoreState, SingleItemList,
				ThreeItemList, SixItemList, ArrayItemList){
	var FrugalStructList = declare("FrugalStructList", null,{
		constructor:function(/*int*/ size) 
	    {
			if(typeof size =="number"){
		        this._listStore = null;
		        this.Capacity = size; 
			}else if(size instanceof Collection){
				var collection = size;
		        if (collection.Count > 6)
		        {
		            this._listStore = new ArrayItemList/*<T>*/(collection); 
		        }
		        else 
		        { 
		            this._listStore = null;
		            this.Capacity = collection.Count; 
		            for(var i=0, count = collection.Count; i<count; i++) //foreach (T item in collection)
		            {
		            	var item = collection.Get(i);
		                this.Add(item);
		            } 
		        }
			}
	    },
		
        Get:function(index)
        {
            // If no entry, default(T) is returned
            if ((null != this._listStore) && ((index < this._listStore.Count) && (index >= 0)))
            { 
                return this._listStore.EntryAt(index);
            } 
            throw new Error('ArgumentOutOfRangeException("index")'); 
        },

        Set:function(index, value)
        {
            if ((null != this._listStore) && ((index < this._listStore.Count) && (index >= 0))) 
            {
            	this._listStore.SetAt(index, value); 
                return; 
            }
            throw new Error('ArgumentOutOfRangeException("index")'); 
        },
        
//        public int 
        Add:function(/*T*/ value) 
        {
            if (null != this._listStore) 
            { 
                // This is done because forward branches
                // default prediction is not to be taken 
                // making this a CPU win because Add is
                // a common operation.
            }
            else 
            {
            	this._listStore = new SingleItemList/*<T>*/(); 
            } 

            /*FrugalListStoreState*/var myState = this._listStore.Add(value); 
            if (FrugalListStoreState.Success == myState)
            {
            }
            else 
            {
                // Need to move to a more complex storage 
                // Allocate the store, promote, and add using the derived classes 
                // to avoid virtual method calls

                if (FrugalListStoreState.ThreeItemList == myState)
                {
                    var newStore = new ThreeItemList/*<T>*/();

                    // Extract the values from the old store and insert them into the new store
                    newStore.Promote(this._listStore); 

                    // Insert the new item
                    newStore.Add(value); 
                    this._listStore = newStore;
                }
                else if (FrugalListStoreState.SixItemList == myState)
                { 
                    var newStore = new SixItemList/*<T>*/();

                    // Extract the values from the old store and insert them into the new store 
                    newStore.Promote(this._listStore);
                    this._listStore = newStore; 

                    // Insert the new item
                    newStore.Add(value);
                    this._listStore = newStore; 
                }
                else if (FrugalListStoreState.Array == myState) 
                { 
                    var newStore = new ArrayItemList/*<T>*/(this._listStore.Count + 1);

                    // Extract the values from the old store and insert them into the new store
                    newStore.Promote(this._listStore);
                    this._listStore = newStore;

                    // Insert the new item
                    newStore.Add(value); 
                    this._listStore = newStore; 
                }
                else 
                {
                    throw new InvalidOperationException(SR.Get(SRID.FrugalList_CannotPromoteBeyondArray));
                }
            } 
            return this._listStore.Count - 1;
        }, 
        

//        public void 
        Clear:function()
        { 
            if (null != this._listStore)
            {
            	this._listStore.Clear();
            } 
        },
//        public bool 
        Contains:function(/*T*/ value) 
        {
            if ((null != this._listStore) && (this._listStore.Count > 0)) 
            {
                return this._listStore.Contains(value);
            }
            return false; 
        },

//        public int 
        IndexOf:function(/*T*/ value) 
        {
            if ((null != this._listStore) && (this._listStore.Count > 0)) 
            {
                return this._listStore.IndexOf(value);
            }
            return -1; 
        },
//        public void 
        Insert:function(/*int*/ index, /*T*/ value) 
        {
            if ((index == 0) || ((null != this._listStore) && ((index <= this._listStore.Count) && (index >= 0)))) 
            {
                // Make sure we have a place to put the item
                var minCapacity = 1;

                if ((null != this._listStore) && (this._listStore.Count == this._listStore.Capacity))
                { 
                    // Store is full 
                    minCapacity = this.Capacity + 1;
                } 

                // Make the Capacity at *least* this big
                this.Capacity = minCapacity;

                this._listStore.Insert(index, value);
                return; 
            } 
            throw new ArgumentOutOfRangeException("index");
        }, 

//        public bool 
        Remove:function(/*T*/ value)
        {
            if ((null != this._listStore) && (this._listStore.Count > 0)) 
            {
                return this._listStore.Remove(value); 
            } 
            return false;
        },
//        public void 
        RemoveAt:function(/*int*/ index)
        {
            if ((null != this._listStore) && ((index < this._listStore.Count) && (index >= 0))) 
            {
            	this._listStore.RemoveAt(index); 
                return; 
            }
            throw new ArgumentOutOfRangeException("index"); 
        },

//        public T[] 
        ToArray:function()
        { 
            if ((null != this._listStore) && (this._listStore.Count > 0))
            {
                return this._listStore.ToArray();
            } 
            return null;
        },
        /// <summary>
        /// Ensures the index.
        /// </summary>
        /// <param name="index">The index.</param>
//        public void 
        EnsureIndex:function(/*int*/ index, item)
        {
            if (index >= 0)
            { 
                var delta = (index + 1) - this.Count; 
                if (delta > 0)
                { 
                    // Grow the store
                	this.Capacity = index + 1;

//                    /*T*/var filler = null; //default(T); 

                    // Insert filler structs or objects 
                    for (var i = 0; i < delta; ++i) 
                    {
//                    	this._listStore.Add(filler); 
                    	this._listStore.Add(new item()); 
                    }
                }
                return;
            } 
            throw new ArgumentOutOfRangeException("index");
        },
//        public void 
        CopyTo:function(/*T[]*/ array, /*int*/ index)
        { 
            if ((null != this._listStore) && (this._listStore.Count > 0))
            {
            	this._listStore.CopyTo(array, index);
            } 
        },

//        public FrugalStructList<T> 
        Clone:function() 
        {
            var myClone = new FrugalStructList/*<T>*/(); 

            if (null != this._listStore)
            {
                myClone._listStore = /*(FrugalListBase<T>)*/this._listStore.Clone(); 
            }

            return myClone; 
        }
	});
	
	Object.defineProperties(FrugalStructList.prototype,{
//	    public int 
		Count:
	    { 
	        get:function()
	        { 
	            if (null != this._listStore) 
	            {
	                return this._listStore.Count; 
	            }
	            return 0;
	        }
	    },
	    
//	    public int 
	    Capacity: 
	    {
	        get:function() 
	        {
	            if (null != this._listStore)
	            {
	                return this._listStore.Capacity; 
	            }
	            return 0; 
	        }, 
	        set:function(value)
	        { 
	            var capacity = 0;
	            if (null != this._listStore)
	            {
	                capacity = this._listStore.Capacity; 
	            }
	            if (capacity < value) 
	            { 
	                // Need to move to a more complex storage
	                /*FrugalListBase<T>*/var newStore; 

	                if (value == 1)
	                {
	                    newStore = new SingleItemList/*<T>*/(); 
	                }
	                else if (value <= 3) 
	                { 
	                    newStore = new ThreeItemList/*<T>*/();
	                } 
	                else if (value <= 6)
	                {
	                    newStore = new SixItemList/*<T>*/();
	                } 
	                else
	                { 
	                    newStore = new ArrayItemList/*<T>*/(value); 
	                }

	                if (null != this._listStore)
	                {
	                    // Move entries in the old store to the new one
	                    newStore.Promote(this._listStore); 
	                }

	                this._listStore = newStore; 
	            }
	        } 
	    }

	});
	
	FrugalStructList.Type = new Type("FrugalStructList", FrugalStructList, [Object.Type]);
	return FrugalStructList;
});
