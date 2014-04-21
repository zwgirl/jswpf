package org.summer.view.widget.utils;

import org.summer.view.widget.collection.ICollection;

// Use FrugalStructList when only one reference to the list is needed.
// The "struct" in FrugalStructList refers to the list itself, not what the list contains.
/*internal*/ class FrugalStructList<t>
{
    public FrugalStructList(int size)
    {
        _listStore = null;
        Capacity = size;
    }

    public FrugalStructList(ICollection collection)
    {
        if (collection.Count > 6)
        {
            _listStore = new ArrayItemList<t>(collection);
        }
        else
        {
            _listStore = null;
            Capacity = collection.Count;
            foreach (T item in collection)
            {
                Add(item);
            }
        }
    }

    public FrugalStructList(ICollection<t> collection)
    {
        if (collection.Count > 6)
        {
            _listStore = new ArrayItemList<t>(collection);
        }
        else
        {
            _listStore = null;
            Capacity = collection.Count;
            foreach (T item in collection)
            {
                Add(item);
            }
        }
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
                FrugalListBase<t> newStore;

                if (value == 1)
                {
                    newStore = new SingleItemList<t>();
                }
                else if (value <= 3)
                {
                    newStore = new ThreeItemList<t>();
                }
                else if (value <= 6)
                {
                    newStore = new SixItemList<t>();
                }
                else
                {
                    newStore = new ArrayItemList<t>(value);
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
            _listStore = new SingleItemList<t>();
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
                ThreeItemList<t> newStore = new ThreeItemList<t>();

                // Extract the values from the old store and insert them into the new store
                newStore.Promote(_listStore);

                // Insert the new item
                newStore.Add(value);
                _listStore = newStore;
            }
            else if (FrugalListStoreState.SixItemList == myState)
            {
                SixItemList<t> newStore = new SixItemList<t>();

                // Extract the values from the old store and insert them into the new store
                newStore.Promote(_listStore);
                _listStore = newStore;

                // Insert the new item
                newStore.Add(value);
                _listStore = newStore;
            }
            else if (FrugalListStoreState.Array == myState)
            {
                ArrayItemList<t> newStore = new ArrayItemList<t>(_listStore.Count + 1);

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

    public boolean Contains(T value)
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

    public boolean Remove(T value)
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

    public FrugalStructList<t> Clone()
    {
        FrugalStructList<t> myClone = new FrugalStructList<t>();

        if (null != _listStore)
        {
            myClone._listStore = (FrugalListBase<t>)_listStore.Clone();
        }

        return myClone;
    }

    /*internal*/ FrugalListBase<t> _listStore;
}