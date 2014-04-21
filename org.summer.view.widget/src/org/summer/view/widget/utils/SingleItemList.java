package org.summer.view.widget.utils;

import org.summer.view.widget.ArgumentException;
    /// <summary>
    /// A simple class to handle a single item
    /// </summary>
/*internal*/ /*sealed*/public class SingleItemList<t> extends FrugalListBase<t>
{
    // Capacity of this store
    public /*override*/ int Capacity
    {
        get
        {
            return SIZE;
        }
    }

    public /*override*/ FrugalListStoreState Add(T value)
    {
        // If we don't have any entries or the existing entry is being overwritten,
        // then we can use this store. Otherwise we have to promote.
        if (0 == _count)
        {
            _loneEntry = value;
            ++_count;
            return FrugalListStoreState.Success;
        }
        else
        {
            // Entry already used, move to an ThreeItemList
            return FrugalListStoreState.ThreeItemList;
        }
    }

    public /*override*/ void Clear()
    {
        // Wipe out the info
        _loneEntry = default(T);
        _count = 0;
    }

    public /*override*/ boolean Contains(T value)
    {
        return _loneEntry.Equals(value);
    }

    public /*override*/ int IndexOf(T value)
    {
        if (_loneEntry.Equals(value))
        {
            return 0;
        }
        return -1;
    }

    public /*override*/ void Insert(int index, T value)
    {
        // Should only get here if count and index are 0
        if ((_count < SIZE) && (index < SIZE))
        {
            _loneEntry = value;
            ++_count;
            return;
        }
        throw new ArgumentOutOfRangeException("index");
    }

    public /*override*/ void SetAt(int index, T value)
    {
        // Overwrite item at index
        _loneEntry = value;
    }

    public /*override*/ boolean Remove(T value)
    {
        // Wipe out the info in the only entry if it matches the item.
        if (_loneEntry.Equals(value))
        {
            _loneEntry = default(T);
            --_count;
            return true;
        }

        return false;
    }

    public /*override*/ void RemoveAt(int index)
    {
        // Wipe out the info at index
        if (0 == index)
        {
            _loneEntry = default(T);
            --_count;
        }
        else
        {
            throw new ArgumentOutOfRangeException("index");
        }
    }

    public /*override*/ T EntryAt(int index)
    {
        return _loneEntry;
    }

    public /*override*/ void Promote(FrugalListBase<t> oldList)
    {
        if (SIZE == oldList.Count)
        {
            SetCount(SIZE);
            SetAt(0, oldList.EntryAt(0));
        }
        else
        {
            // this list is smaller than oldList
            throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList");
        }
    }

    // Class specific implementation to avoid virtual method calls and additional logic
    public void Promote(SingleItemList<t> oldList)
    {
        SetCount(oldList.Count);
        SetAt(0, oldList.EntryAt(0));
    }

    public /*override*/ T[] ToArray()
    {
        T[] array = new T[1];
        array[0] = _loneEntry;
        return array;
    }

    public /*override*/ void CopyTo(T[] array, int index)
    {
        array[index] = _loneEntry;
    }

    public /*override*/ Object Clone()
    {
        SingleItemList<t> newList = new SingleItemList<t>();
        newList.Promote(this);
        return newList;
    }

    private void SetCount(int value)
    {
        if ((value >= 0) && (value <= SIZE))
        {
            _count = value;
        }
        else
        {
            throw new ArgumentOutOfRangeException("value");
        }
    }

    private final int SIZE = 1;

    private T _loneEntry;
}
 
 
