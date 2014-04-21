package org.summer.view.widget.utils;
/// <summary>
/// A simple class to handle an array of 7 or more items.  It is unsorted and uses
/// a linear search.
/// </summary>
/*internal*/ /*sealed*/ class ArrayItemList<t> extends FrugalListBase<t>
{
    public ArrayItemList()
    {
    }

    public ArrayItemList(int size)
    {
        // Make size a multiple of GROWTH
        size += (GROWTH - 1);
        size -= (size % GROWTH);
        _entries = new T[size];
    }

    public ArrayItemList(ICollection collection)
    {
        if (collection != null)
        {
            _count = collection.Count;
            _entries = new T[_count];
            collection.CopyTo(_entries, 0);
        }
    }

    public ArrayItemList(ICollection<t> collection)
    {
        if (collection != null)
        {
            _count = collection.Count;
            _entries = new T[_count];
            collection.CopyTo(_entries, 0);
        }
    }

    // Capacity of this store
    public /*override*/ int Capacity
    {
        get
        {
            if (_entries != null)
            {
                return _entries.Length;
            }
            return 0;
        }
    }

    public /*override*/ FrugalListStoreState Add(T value)
    {
        // If we don't have any entries or the existing entry is being overwritten,
        // then we can use this store. Otherwise we have to promote.
        if ((null != _entries) && (_count < _entries.Length))
        {
            _entries[_count] = value;
            ++_count;
        }
        else
        {
            if (null != _entries)
            {
                int size = _entries.Length;

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

                T[] destEntries = new T[size];

                // Copy old array
                Array.Copy(_entries, 0, destEntries, 0, _entries.Length);
                _entries = destEntries;
            }
            else
            {
                _entries = new T[MINSIZE];
            }

            // Insert into new array
            _entries[_count] = value;
            ++_count;
        }
        return FrugalListStoreState.Success;
    }

    public /*override*/ void Clear()
    {
        // Wipe out the info.
        for (int i = 0; i < _count; ++i)
        {
            _entries[i] = default(T);
        }
        _count = 0;
    }

    public /*override*/ boolean Contains(T value)
    {
        return (-1 != IndexOf(value));
    }

    public /*override*/ int IndexOf(T value)
    {
        for (int index = 0; index < _count; ++index)
        {
            if (_entries[index].Equals(value))
            {
                return index;
            }
        }
        return -1;
    }

    public /*override*/ void Insert(int index, T value)
    {
        if ((null != _entries) && (_count < _entries.Length))
        {
            // Move down the required number of items
            Array.Copy(_entries, index, _entries, index + 1, _count - index);

            // Put in the new item at the specified index
            _entries[index] = value;
            ++_count;
            return;
        }
        throw new ArgumentOutOfRangeException("index");
    }

    public /*override*/ void SetAt(int index, T value)
    {
        // Overwrite item at index
        _entries[index] = value;
    }

    public /*override*/ boolean Remove(T value)
    {
        for (int index = 0; index < _count; ++index)
        {
            if (_entries[index].Equals(value))
            {
                RemoveAt(index);
                return true;
            }
        }

        return false;
    }

    public /*override*/ void RemoveAt(int index)
    {
        // Shift entries down
        int numToCopy = (_count - index) - 1;
        if (numToCopy > 0)
        {
            Array.Copy(_entries, index + 1, _entries, index, numToCopy);
        }

        // Wipe out the last entry
        _entries[_count - 1] = default(T);
        --_count;
        return;
    }

    public /*override*/ T EntryAt(int index)
    {
        return _entries[index];
    }

    public /*override*/ void Promote(FrugalListBase<t> oldList)
    {
        for (int index = 0; index < oldList.Count; ++index)
        {
            if (FrugalListStoreState.Success == Add(oldList.EntryAt(index)))
            {
                continue;
            }
            // this list is smaller than oldList
            throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList");
        }
    }

    // Class specific implementation to avoid virtual method calls and additional logic
    public void Promote(SixItemList<t> oldList)
    {
        int oldCount = oldList.Count;
        SetCount(oldList.Count);

        switch (oldCount)
        {
            case 6:
                SetAt(0, oldList.EntryAt(0));
                SetAt(1, oldList.EntryAt(1));
                SetAt(2, oldList.EntryAt(2));
                SetAt(3, oldList.EntryAt(3));
                SetAt(4, oldList.EntryAt(4));
                SetAt(5, oldList.EntryAt(5));
                break;

            case 5:
                SetAt(0, oldList.EntryAt(0));
                SetAt(1, oldList.EntryAt(1));
                SetAt(2, oldList.EntryAt(2));
                SetAt(3, oldList.EntryAt(3));
                SetAt(4, oldList.EntryAt(4));
                break;

            case 4:
                SetAt(0, oldList.EntryAt(0));
                SetAt(1, oldList.EntryAt(1));
                SetAt(2, oldList.EntryAt(2));
                SetAt(3, oldList.EntryAt(3));
                break;

            case 3:
                SetAt(0, oldList.EntryAt(0));
                SetAt(1, oldList.EntryAt(1));
                SetAt(2, oldList.EntryAt(2));
                break;

            case 2:
                SetAt(0, oldList.EntryAt(0));
                SetAt(1, oldList.EntryAt(1));
                break;

            case 1:
                SetAt(0, oldList.EntryAt(0));
                break;

            case 0:
                break;

            default:
                throw new ArgumentOutOfRangeException("oldList");
        }
    }

    // Class specific implementation to avoid virtual method calls and additional logic
    public void Promote(ArrayItemList<t> oldList)
    {
        int oldCount = oldList.Count;
        if (_entries.Length >= oldCount)
        {
            SetCount(oldList.Count);

            for (int index = 0; index < oldCount; ++index)
            {
                SetAt(index, oldList.EntryAt(index));
            }
        }
        else
        {
            // this list is smaller than oldList
            throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList");
        }
    }

    public /*override*/ T[] ToArray()
    {
        T[] array = new T[_count];

        for (int i = 0; i < _count; ++i)
        {
            array[i] = _entries[i];
        }
        return array;
    }

    public /*override*/ void CopyTo(T[] array, int index)
    {
        for (int i = 0; i < _count; ++i)
        {
            array[index+i] = _entries[i];
        }
    }

    public /*override*/ Object Clone()
    {
        ArrayItemList<t> newList = new ArrayItemList<t>(this.Capacity);
        newList.Promote(this);
        return newList;
    }

    private void SetCount(int value)
    {
        if ((value >= 0) && (value <= _entries.Length))
        {
            _count = value;
        }
        else
        {
            throw new ArgumentOutOfRangeException("value");
        }
    }

    // MINSIZE and GROWTH chosen to minimize memory footprint
    private final int MINSIZE = 9;
    private final int GROWTH = 3;
    private final int LARGEGROWTH = 18;

    private T[] _entries;
}