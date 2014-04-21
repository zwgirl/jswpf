/**
 * FrugalObjectList
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var FrugalObjectList = declare("FrugalObjectList", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(FrugalObjectList.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	FrugalObjectList.Type = new Type("FrugalObjectList", FrugalObjectList, [Object.Type]);
	return FrugalObjectList;
});


// Use FrugalObjectList when more than one reference to the list is needed.
    // The "object" in FrugalObjectLIst refers to the list itself, not what the list contains. 

#if !SYSTEM_XAML 
    [FriendAccessAllowed] // Built into Core, also used by Framework. 
#endif
    internal class FrugalObjectList<T> 
    {
        public FrugalObjectList()
        {
        } 

        public FrugalObjectList(int size) 
        { 
            Capacity = size;
        } 

        public int Capacity
        {
            get 
            {
                if (null != _listStore) 
                { 
                    return _listStore.Capacity;
                } 
                return 0;
            }
            set
            { 
                int capacity = 0;
                if (null != _listStore) 
                { 
                    capacity = _listStore.Capacity;
                } 
                if (capacity < value)
                {
                    // Need to move to a more complex storage
                    FrugalListBase<T> newStore; 

                    if (value == 1) 
                    { 
                        newStore = new SingleItemList<T>();
                    } 
                    else if (value <= 3)
                    {
                        newStore = new ThreeItemList<T>();
                    } 
                    else if (value <= 6)
                    { 
                        newStore = new SixItemList<T>(); 
                    }
                    else 
                    {
                        newStore = new ArrayItemList<T>(value);
                    }
 
                    if (null != _listStore)
                    { 
                        // Move entries in the old store to the new one 
                        newStore.Promote(_listStore);
                    } 

                    _listStore = newStore;
                }
            } 
        }
 
        public int Count 
        {
            get 
            {
                if (null != _listStore)
                {
                    return _listStore.Count; 
                }
                return 0; 
            } 
        }
 

        public T this[int index]
        {
            get 
            {
                // If no entry, default(T) is returned 
                if ((null != _listStore) && ((index < _listStore.Count) && (index >= 0))) 
                {
                    return _listStore.EntryAt(index); 
                }
                throw new ArgumentOutOfRangeException("index");
            }
 
            set
            { 
                // Ensure write success 
                if ((null != _listStore) && ((index < _listStore.Count) && (index >= 0)))
                { 
                    _listStore.SetAt(index, value);
                    return;
                }
                throw new ArgumentOutOfRangeException("index"); 
            }
        } 
 
        public int Add(T value)
        { 
            if (null != _listStore)
            {
                // This is done because forward branches
                // default prediction is not to be taken 
                // making this a CPU win because Add is
                // a common operation. 
            } 
            else
            { 
                _listStore = new SingleItemList<T>();
            }

            FrugalListStoreState myState = _listStore.Add(value); 
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
                    ThreeItemList<T> newStore = new ThreeItemList<T>(); 

                    // Extract the values from the old store and insert them into the new store 
                    newStore.Promote(_listStore);

                    // Insert the new item
                    newStore.Add(value); 
                    _listStore = newStore;
                } 
                else if (FrugalListStoreState.SixItemList == myState) 
                {
                    SixItemList<T> newStore = new SixItemList<T>(); 

                    // Extract the values from the old store and insert them into the new store
                    newStore.Promote(_listStore);
                    _listStore = newStore; 

                    // Insert the new item 
                    newStore.Add(value); 
                    _listStore = newStore;
                } 
                else if (FrugalListStoreState.Array == myState)
                {
                    ArrayItemList<T> newStore = new ArrayItemList<T>(_listStore.Count + 1);
 
                    // Extract the values from the old store and insert them into the new store
                    newStore.Promote(_listStore); 
                    _listStore = newStore; 

                    // Insert the new item 
                    newStore.Add(value);
                    _listStore = newStore;
                }
                else 
                {
                    throw new InvalidOperationException(SR.Get(SRID.FrugalList_CannotPromoteBeyondArray)); 
                } 
            }
            return _listStore.Count - 1; 
        }

        public void Clear()
        { 
            if (null != _listStore)
            { 
                _listStore.Clear(); 
            }
        } 

        public bool Contains(T value)
        {
            if ((null != _listStore) && (_listStore.Count > 0)) 
            {
                return _listStore.Contains(value); 
            } 
            return false;
        } 

        public int IndexOf(T value)
        {
            if ((null != _listStore) && (_listStore.Count > 0)) 
            {
                return _listStore.IndexOf(value); 
            } 
            return -1;
        } 

        public void Insert(int index, T value)
        {
            if ((index == 0) || ((null != _listStore) && ((index <= _listStore.Count) && (index >= 0)))) 
            {
                // Make sure we have a place to put the item 
                int minCapacity = 1; 

                if ((null != _listStore) && (_listStore.Count == _listStore.Capacity)) 
                {
                    // Store is full
                    minCapacity = Capacity + 1;
                } 

                // Make the Capacity at *least* this big 
                Capacity = minCapacity; 

                _listStore.Insert(index, value); 
                return;
            }
            throw new ArgumentOutOfRangeException("index");
        } 

        public bool Remove(T value) 
        { 
            if ((null != _listStore) && (_listStore.Count > 0))
            { 
                return _listStore.Remove(value);
            }
            return false;
        } 

        public void RemoveAt(int index) 
        { 
            if ((null != _listStore) && ((index < _listStore.Count) && (index >= 0)))
            { 
                _listStore.RemoveAt(index);
                return;
            }
            throw new ArgumentOutOfRangeException("index"); 
        }
 
        public void EnsureIndex(int index) 
        {
            if (index >= 0) 
            {
                int delta = (index + 1) - Count;
                if (delta > 0)
                { 
                    // Grow the store
                    Capacity = index + 1; 
 
                    T filler = default(T);
 
                    // Insert filler structs or objects
                    for (int i = 0; i < delta; ++i)
                    {
                        _listStore.Add(filler); 
                    }
                } 
                return; 
            }
            throw new ArgumentOutOfRangeException("index"); 
        }

        public T[] ToArray()
        { 
            if ((null != _listStore) && (_listStore.Count > 0))
            { 
                return _listStore.ToArray(); 
            }
            return null; 
        }

        public void CopyTo(T[] array, int index)
        { 
            if ((null != _listStore) && (_listStore.Count > 0))
            { 
                _listStore.CopyTo(array, index); 
            }
        } 

        public FrugalObjectList<T> Clone()
        {
            FrugalObjectList<T> myClone = new FrugalObjectList<T>(); 

            if (null != _listStore) 
            { 
                myClone._listStore = (FrugalListBase<T>)_listStore.Clone();
            } 

            return myClone;
        }
 
        internal FrugalListBase<T> _listStore;
 
        #region Compacter 
        // helper class - compacts the valid entries, while removing the invalid ones.
        // Usage: 
        //      Compacter compacter = new Compacter(this, newCount);
        //      compacter.Include(start, end);      // repeat as necessary
        //      compacter.Finish();
        // newCount is the expected number of valid entries - used to help choose 
        //  a target array of appropriate capacity
        // Include(start, end) moves the entries in positions start, ..., end-1 toward 
        //  the beginning, appending to the end of the "valid" area.  Successive calls 
        //  must be monotonic - i.e. the next 'start' must be >= the previous 'end'.
        //  Also, the sum of the block sizes (end-start) cannot exceed newCount. 
        // Finish() puts the provisional target array into permanent use.

        protected class Compacter
        { 
            public Compacter(FrugalObjectList<T> list, int newCount)
            { 
                _list = list; 

                FrugalListBase<T> store = _list._listStore; 
                _storeCompacter = (store != null) ? store.NewCompacter(newCount) : null;
            }

            public void Include(int start, int end) 
            {
                _storeCompacter.Include(start, end); 
            } 

            public void Finish() 
            {
                if (_storeCompacter != null)
                {
                    _list._listStore = _storeCompacter.Finish(); 
                }
            } 
 
            FrugalObjectList<T> _list;
            FrugalListBase<T>.Compacter _storeCompacter; 
        }
        #endregion Compacter
    }