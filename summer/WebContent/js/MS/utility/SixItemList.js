/**
 * TabItem
 */
/// <summary>
    /// A simple class to handle a list with 6 items. 
    /// </summary> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalListBase", "utility/FrugalListStoreState",
        "utility/ThreeItemList"], 
		function(declare, Type, FrugalListBase, FrugalListStoreState,
				ThreeItemList){
//    private const int 
	var SIZE = 6;
	var SixItemList = declare("SixItemList", FrugalListBase,{
		constructor:function(){
//	        private T 
			this._entry0 = null;
//	        private T 
			this._entry1 = null; 
//	        private T 
			this._entry2 = null; 
//	        private T 
			this._entry3 = null;
//	        private T 
			this._entry4 = null; 
//	        private T 
			this._entry5 = null;
		},
		
//		public override FrugalListStoreState 
		Add:function(/*T*/ value)
        {
            switch (this._count)
            { 
                case 0:
                	this._entry0 = value; 
                    break; 

                case 1: 
                	this._entry1 = value;
                    break;

                case 2: 
                	this._entry2 = value;
                    break; 
 
                case 3:
                	this._entry3 = value; 
                    break;

                case 4:
                	this._entry4 = value; 
                    break;
 
                case 5: 
                	this._entry5 = value;
                    break; 

                default:
                    // We have to promote
                    return FrugalListStoreState.Array; 
            }
            ++this._count; 
            return FrugalListStoreState.Success; 
        },
 
//        public override void 
        Clear:function()
        {
            // Wipe out the info.
        	this._entry0 = null; //default(T); 
            this._entry1 = null; // default(T);
            this._entry2 = null; // default(T); 
            this._entry3 = null; // default(T); 
            this._entry4 = null; // default(T);
            this._entry5 = null; // default(T); 
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
            if (this._entry0.Equals(value))
            {
                return 0; 
            }
            if (this._count > 1) 
            { 
                if (this._entry1.Equals(value))
                { 
                    return 1;
                }
                if (this._count > 2)
                { 
                    if (this._entry2.Equals(value))
                    { 
                        return 2; 
                    }
                    if (this._count > 3) 
                    {
                        if (this._entry3.Equals(value))
                        {
                            return 3; 
                        }
                        if (this._count > 4) 
                        { 
                            if (this._entry4.Equals(value))
                            { 
                                return 4;
                            }
                            if ((6 == this._count) && (this._entry5.Equals(value)))
                            { 
                                return 5;
                            } 
                        } 
                    }
                } 
            }
            return -1;
        },
 
//        public override void 
        Insert:function(/*int*/ index, /*T*/ value)
        { 
            // Should only get here if count is less than SIZE 
            if (this._count < SIZE)
            { 
                switch (index)
                {
                    case 0:
                    	this._entry5 = this._entry4; 
                    	this._entry4 = this._entry3;
                    	this._entry3 = this._entry2; 
                    	this._entry2 = this._entry1; 
                    	this._entry1 = this._entry0;
                    	this._entry0 = value; 
                        break;

                    case 1:
                    	this._entry5 = this._entry4; 
                        this._entry4 = this._entry3;
                        this._entry3 = this._entry2; 
                        this._entry2 = this._entry1; 
                        this._entry1 = value;
                        break; 

                    case 2:
                    	this._entry5 = this._entry4;
                        this._entry4 = this._entry3; 
                        this._entry3 = this._entry2;
                        this._entry2 = value; 
                        break; 

                    case 3: 
                    	this._entry5 = this._entry4;
                    	this._entry4 = this._entry3;
                    	this._entry3 = value;
                        break; 

                    case 4: 
                    	this._entry5 = this._entry4; 
                        this._entry4 = value;
                        break; 

                    case 5:
                    	this._entry5 = value;
                        break; 

                    default: 
                        throw new ArgumentOutOfRangeException("index"); 
                }
                ++this._count; 
                return;
            }
            throw new ArgumentOutOfRangeException("index");
        },

//        public override void 
        SetAt:function(/*int*/ index, /*T*/ value) 
        { 
            // Overwrite item at index
            switch (index) 
            {
                case 0:
                	this._entry0 = value;
                    break; 

                case 1: 
                	this._entry1 = value; 
                    break;
 
                case 2:
                	this._entry2 = value;
                    break;
 
                case 3:
                	this._entry3 = value; 
                    break; 

                case 4: 
                	this._entry4 = value;
                    break;

                case 5: 
                	this._entry5 = value;
                    break; 
 
                default:
                    throw new ArgumentOutOfRangeException("index"); 
            }
        },

//        public override bool 
        Remove:function(/*T*/ value) 
        {
            // If the item matches an existing entry, wipe out the last 
            // entry and move all the other entries up.  Because we only 
            // have six entries we can just unravel all the cases.
            if (this._entry0.Equals(value)) 
            {
            	this.RemoveAt(0);
                return true;
            } 
            else if (this._count > 1)
            { 
                if (this._entry1.Equals(value)) 
                {
                	this.RemoveAt(1); 
                    return true;
                }
                else if (this._count > 2)
                { 
                    if (this._entry2.Equals(value))
                    { 
                    	this.RemoveAt(2); 
                        return true;
                    } 
                    else if (this._count > 3)
                    {
                        if (this._entry3.Equals(value))
                        { 
                        	this.RemoveAt(3);
                            return true; 
                        } 
                        else if (this._count > 4)
                        { 
                            if (this._entry4.Equals(value))
                            {
                            	this.RemoveAt(4);
                                return true; 
                            }
                            else if ((6 == this._count) && (this._entry5.Equals(value))) 
                            { 
                            	this.RemoveAt(5);
                                return true; 
                            }
                        }
                    }
                } 
            }
 
            return false; 
        },
 
//        public override void 
        RemoveAt:function(/*int*/ index)
        {
            // Remove entry at index, wipe out the last entry and move
            // all the other entries up. Because we only have six 
            // entries we can just unravel all the cases.
            switch (index) 
            { 
                case 0:
                	this._entry0 = this._entry1; 
                    this._entry1 = this._entry2;
                    this._entry2 = this._entry3;
                    this._entry3 = this._entry4;
                    this._entry4 = this._entry5; 
                    break;
 
                case 1: 
                	this._entry1 = this._entry2;
                	this._entry2 = this._entry3; 
                	this._entry3 = this._entry4;
                	this._entry4 = this._entry5;
                    break;
 
                case 2:
                	this._entry2 = this._entry3; 
                	this._entry3 = this._entry4; 
                	this._entry4 = this._entry5;
                    break; 

                case 3:
                	this._entry3 = this._entry4;
                    this._entry4 = this._entry5; 
                    break;
 
                case 4: 
                	this._entry4 = this._entry5;
                    break; 

                case 5:
                    break;
 
                default:
                    throw new ArgumentOutOfRangeException("index"); 
            } 
            this._entry5 = null; //default(T);
            --this._count; 
        },

//        public override T 
        EntryAt:function(/*int*/ index)
        { 
            switch (index)
            { 
                case 0: 
                    return this._entry0;
 
                case 1:
                    return this._entry1;

                case 2: 
                    return this._entry2;
 
                case 3: 
                    return this._entry3;
 
                case 4:
                    return this._entry4;

                case 5: 
                    return this._entry5;
 
                default: 
                    throw new ArgumentOutOfRangeException("index");
            } 
        },

//        public override void 
        Promote0:function(/*FrugalListBase<T>*/ oldList)
        { 
            var oldCount = oldList.Count;
            if (SIZE >= oldCount) 
            { 
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
            }
            else 
            {
                // this list is smaller than oldList 
                throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList"); 
            }
        }, 

        // Class specific implementation to avoid virtual method calls and additional logic
//        public void 
        Promote3:function(/*ThreeItemList<T>*/ oldList)
        { 
            var oldCount = oldList.Count;
            if (SIZE >= oldCount) 
            { 
            	this.SetCount(oldList.Count);
 
                switch (oldCount)
                {
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
            } 
            else 
            {
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
        
        Promote:function(oldList){
        	if(oldList instanceof ThreeItemList){
        		this.Promote3(oldList);
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
 
            if (this._count >= 1)
            {
                array[0] = this._entry0;
                if (this._count >= 2) 
                {
                    array[1] = this._entry1; 
                    if (this._count >= 3) 
                    {
                        array[2] = this._entry2; 
                        if (this._count >= 4)
                        {
                            array[3] = this._entry3;
                            if (this._count >= 5) 
                            {
                                array[4] = this._entry4; 
                                if (this._count == 6) 
                                {
                                    array[5] = this._entry5; 
                                }
                            }
                        }
                    } 
                }
            } 
            return array; 
        },
 
//        public override void 
        CopyTo:function(/*T[]*/ array, /*int*/ index)
        {
            if (this._count >= 1)
            { 
                array[index] = this._entry0;
                if (this._count >= 2) 
                { 
                    array[index+1] = this._entry1;
                    if (this._count >= 3) 
                    {
                        array[index+2] = this._entry2;
                        if (this._count >= 4)
                        { 
                            array[index+3] = this._entry3;
                            if (this._count >= 5) 
                            { 
                                array[index+4] = this._entry4;
                                if (this._count == 6) 
                                {
                                    array[index+5] = this._entry5;
                                }
                            } 
                        }
                    } 
                } 
            }
        }, 

//        public override object 
        Clone:function()
        {
            /*SixItemList<T>*/var newList = new SixItemList/*<T>*/(); 
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
	
	Object.defineProperties(SixItemList.prototype,{
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
	
	Object.defineProperties(SixItemList,{
		  
	});
	
	SixItemList.Type = new Type("SixItemList", SixItemList, [FrugalListBase.Type]);
	return SixItemList;
});


