/**
 * SingleItemList
 */
/// <summary> 
    /// A simple class to handle a single item
    /// </summary> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalListBase", "utility/FrugalListStoreState"], 
		function(declare, Type, FrugalListBase, FrugalListStoreState){
//    private const int 
	var SIZE = 1;
	var SingleItemList = declare("SingleItemList", FrugalListBase,{
		constructor:function(){
//			private T 
			this._loneEntry = null; 
		},
		
//		public override FrugalListStoreState 
		Add:function(/*T*/ value) 
        {
            // If we don't have any entries or the existing entry is being overwritten,
            // then we can use this store. Otherwise we have to promote.
            if (0 == this._count) 
            {
                this._loneEntry = value; 
                ++this._count; 
                return FrugalListStoreState.Success;
            } 
            else
            {
                // Entry already used, move to an ThreeItemList
                return FrugalListStoreState.ThreeItemList; 
            }
        }, 
//        public override void 
        Clear:function()
        { 
            // Wipe out the info
        	this._loneEntry = null; //default(T);
        	this._count = 0;
        },

//        public override bool 
        Contains:function(/*T*/ value) 
        { 
            return this._loneEntry.Equals(value);
        }, 

//        public override int 
        IndexOf:function(/*T*/ value)
        {
            if (this._loneEntry.Equals(value)) 
            {
                return 0; 
            } 
            return -1;
        }, 
//        public override void 
        Insert:function(/*int*/ index, /*T*/ value)
        {
            // Should only get here if count and index are 0 
            if ((this._count < SIZE) && (index < SIZE))
            { 
            	this._loneEntry = value; 
                ++this._count;
                return; 
            }
            throw new ArgumentOutOfRangeException("index");
        },
//        public override void 
        SetAt:function(/*int*/ index, /*T*/ value)
        { 
            // Overwrite item at index 
        	this._loneEntry = value;
        }, 

//        public override bool 
        Remove:function(/*T*/ value)
        {
            // Wipe out the info in the only entry if it matches the item. 
            if (this._loneEntry.Equals(value))
            { 
            	this._loneEntry = null; //default(T); 
                --this._count;
                return true; 
            }

            return false;
        },
//        public override void 
        RemoveAt:function(/*int*/ index) 
        { 
            // Wipe out the info at index
            if (0 == index) 
            {
            	this._loneEntry = null; //default(T);
                --this._count;
            } 
            else
            { 
                throw new ArgumentOutOfRangeException("index"); 
            }
        }, 

//        public override T 
        EntryAt:function(/*int*/ index)
        {
            return this._loneEntry; 
        },
//        public override void 
        Promote0:function(/*FrugalListBase<T>*/ oldList) 
        {
            if (SIZE == oldList.Count) 
            {
            	this.SetCount(SIZE);
            	this.SetAt(0, oldList.EntryAt(0));
            } 
            else
            { 
                // this list is smaller than oldList 
                throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList");
            } 
        },

        // Class specific implementation to avoid virtual method calls and additional logic
//        public void 
        Promote1:function(/*SingleItemList<T>*/ oldList) 
        {
        	this.SetCount(oldList.Count); 
        	this.SetAt(0, oldList.EntryAt(0)); 
        },
        
        Promote:function(oldList) 
        {
        	if(oldList instanceof SingleItemList){
            	this.Promote0(oldList);
        	}else if(oldList instanceof FrugalListBase){
        		this.Promote1(oldList);
        	}
        },
 
//        public override T[] 
        ToArray:function()
        {
            /*T[]*/var array = []; //new T[1];
            array[0] = this._loneEntry; 
            return array;
        }, 
//        public override void 
        CopyTo:function(/*T[]*/ array, /*int*/ index)
        { 
            array[index] = this._loneEntry;
        },

//        public override object 
        Clone:function() 
        {
            /*SingleItemList<T>*/var newList = new SingleItemList/*<T>*/(); 
            newList.Promote(this); 
            return newList;
        }, 
//        private void 
        SetCount:function(/*int*/ value)
        {
            if ((value >= 0) && (value <= SIZE)) 
            {
            	this._count = value; 
            } 
            else
            { 
                throw new ArgumentOutOfRangeException("value");
            }
        }
	});
	
	Object.defineProperties(SingleItemList.prototype,{
        // Capacity of this store 
//        public override int 
		Capacity:
        {
            get:function()
            { 
                return SIZE;
            } 
        }	  
	});
	
	Object.defineProperties(SingleItemList,{
		  
	});
	
	SingleItemList.Type = new Type("SingleItemList", SingleItemList, [FrugalListBase.Type]);
	return SingleItemList;
});
