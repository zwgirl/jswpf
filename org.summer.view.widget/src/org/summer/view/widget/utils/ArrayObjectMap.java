package org.summer.view.widget.utils;


/// <summary>
/// A simple class to handle an array of between 6 and 12 key/value pairs.  It is unsorted
/// and uses a linear search.  Perf analysis showed that this was the optimal size for both
/// memory and perf.  The values may need to be adjusted as the CLR and Avalon evolve.
/// </summary>
public final class ArrayObjectMap extends FrugalMapBase
{
    public override FrugalMapStoreState InsertEntry(int key, Object value)
    {
        // Check to see if we are updating an existing entry
        for (int index = 0; index < _count; ++index)
        {
            Debug.Assert(INVALIDKEY != key);

            if (_entries[index].Key == key)
            {
                _entries[index].Value = value;
                return FrugalMapStoreState.Success;
            }
        }

        // New key/value pair
        if (MAXSIZE > _count)
        {
            // Space still available to store the value
            if (null != _entries)
            {
                // We are adding an entry to the array, so we may not be sorted any longer
                _sorted = false;

                if (_entries.Length > _count)
                {
                    // Have empty entries, just set the first available
                }
                else
                {
                    Entry[] destEntries = new Entry[_entries.Length + GROWTH];

                    // Copy old array
                    Array.Copy(_entries, 0, destEntries, 0, _entries.Length);
                    _entries = destEntries;
                }
            }
            else
            {
                _entries = new Entry[MINSIZE];

                // No entries, must be sorted
                _sorted = true;
            }

            // Stuff in the new key/value pair
            _entries[_count].Key = key;
            _entries[_count].Value = value;

            // Bump the count for the entry just added.
            ++_count;

            return FrugalMapStoreState.Success;
        }
        else
        {
            // Array is full, move to a SortedArray
            return FrugalMapStoreState.SortedArray;
        }
    }

    public override void RemoveEntry(int key)
    {
        for (int index = 0; index < _count; ++index)
        {
            if (_entries[index].Key == key)
            {
                // Shift entries down
                int numToCopy = (_count - index) - 1;
                if (numToCopy > 0)
                {
                    Array.Copy(_entries, index + 1, _entries, index, numToCopy);
                }

                // Wipe out the last entry
                _entries[_count - 1].Key = INVALIDKEY;
                _entries[_count - 1].Value = DependencyProperty.UnsetValue;
                --_count;
                break;
            }
        }
    }

    public override Object Search(int key)
    {
        for (int index = 0; index < _count; ++index)
        {
            if (key == _entries[index].Key)
            {
                return _entries[index].Value;
            }
        }
        return DependencyProperty.UnsetValue;
    }

    public override void Sort()
    {
        if ((false == _sorted) && (_count > 1))
        {
            QSort(0, (_count - 1));
            _sorted = true;
        }
    }

    public override void GetKeyValuePair(int index, out int key, out Object value)
    {
        if (index < _count)
        {
            value = _entries[index].Value;
            key = _entries[index].Key;
        }
        else
        {
            value = DependencyProperty.UnsetValue;
            key = INVALIDKEY;
            throw new ArgumentOutOfRangeException("index");
        }
    }

    public override void Iterate(ArrayList list, FrugalMapIterationCallback callback)
    {
        if (_count > 0)
        {
            for (int i=0; i< _count; i++)
            {
                callback(list, _entries[i].Key, _entries[i].Value);
            }
        }
    }

    public override void Promote(FrugalMapBase newMap)
    {
        for (int index = 0; index < _entries.Length; ++index)
        {
            if (FrugalMapStoreState.Success == newMap.InsertEntry(_entries[index].Key, _entries[index].Value))
            {
                continue;
            }
            // newMap is smaller than previous map
            throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
        }
    }

    // Size of this data store
    public override int Count
    {
        get
        {
            return _count;
        }
    }

    // Compare two Entry nodes in the _entries array
    private int Compare(int left, int right)
    {
        return (_entries[left].Key - _entries[right].Key);
    }

    // Partition the _entries array for QuickSort
    private int Partition(int left, int right)
    {
        int pivot = right;
        int i = left - 1;
        int j = right;
        Entry temp;

        for (;;)
        {
            while (Compare(++i, pivot) < 0);
            while (Compare(pivot, --j) < 0)
            {
                if (j == left)
                {
                    break;
                }
            }
            if (i >= j)
            {
                break;
            }
            temp = _entries[j];
            _entries[j] = _entries[i];
            _entries[i] = temp;
        }
        temp = _entries[right];
        _entries[right] = _entries[i];
        _entries[i] = temp;
        return i;
    }

    // Sort the _entries array using an index based QuickSort
    private void QSort(int left, int right)
    {
        if (left < right)
        {
            int pivot = Partition(left, right);
            QSort(left, pivot - 1);
            QSort(pivot + 1, right);
        }
    }

    // MINSIZE and GROWTH chosen to minimize memory footprint
    private const int MINSIZE = 9;
    private const int MAXSIZE = 15;
    private const int GROWTH = 3;

    // The number of items in the map.
    private UInt16 _count;

    private bool _sorted;
    private Entry[] _entries;
}