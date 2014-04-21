package org.summer.view.widget.utils;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.collection.ArrayList;


// A sorted array of key/value pairs. A binary search is used to minimize the cost of insert/search.

/*sealed*/public class LargeSortedObjectMap extends FrugalMapBase
{
    public FrugalMapStoreState InsertEntry(int key, Object value)
    {
        boolean found;

//        Debug.Assert(INVALIDKEY != key);

        // Check to see if we are updating an existing entry
        int index = FindInsertIndex(key, /*out*/ found);
        if (found)
        {
            _entries[index].Value = value;
            return FrugalMapStoreState.Success;
        }
        else
        {
            // New key/value pair
            if (null != _entries)
            {
                if (_entries.length > _count)
                {
                    // Have empty entries, just set the first available
                }
                else
                {
                    int size = _entries.length;
                    Entry[] destEntries = new Entry[size + (size >> 1)];

                    // Copy old array
                    Array.Copy(_entries, 0, destEntries, 0, _entries.length);
                    _entries = destEntries;
                }
            }
            else
            {
                _entries = new Entry[MINSIZE];
            }

            // Inserting into the middle of the existing entries?
            if (index < _count)
            {
                // Move higher valued keys to make room for the new key
                Array.Copy(_entries, index, _entries, index + 1, (_count - index));
            }
            else
            {
                _lastKey = key;
            }

            // Stuff in the new key/value pair
            _entries[index].Key = key;
            _entries[index].Value = value;
            ++_count;
            return FrugalMapStoreState.Success;
        }
    }

    public void RemoveEntry(int key)
    {
        boolean found;

        Debug.Assert(INVALIDKEY != key);

        int index = FindInsertIndex(key, /*out*/ found);

        if (found)
        {
            // Shift entries down
            int numToCopy = (_count - index) - 1;
            if (numToCopy > 0)
            {
                Array.Copy(_entries, index + 1, _entries, index, numToCopy);
            }
            else
            {
                // If we're not copying anything, then it means we are
                //  going to remove the last entry.  Update _lastKey so
                //  that it reflects the key of the new "last entry"
                if( _count > 1 )
                {
                    // Next-to-last entry will be the new last entry
                    _lastKey = _entries[_count - 2].Key;
                }
                else
                {
                    // Unless there isn't a next-to-last entry, in which
                    //  case the key is reset to INVALIDKEY.
                    _lastKey = INVALIDKEY;
                }
            }

            // Wipe out the last entry
            _entries[_count - 1].Key = INVALIDKEY;
            _entries[_count - 1].Value = DependencyProperty.UnsetValue;

            --_count;
        }
    }

    public Object Search(int key)
    {
        boolean found;

        int index = FindInsertIndex(key, /*out*/ found);
        if (found)
        {
            return _entries[index].Value;
        }
        return DependencyProperty.UnsetValue;
    }

    public void Sort()
    {
        // Always sorted.
    }

    public void GetKeyValuePair(int index, /*out*/ int key, /*out*/ Object value)
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

    public void Iterate(ArrayList list, FrugalMapIterationCallback callback)
    {
        if (_count > 0)
        {
            for (int i=0; i< _count; i++)
            {
                callback(list, _entries[i].Key, _entries[i].Value);
            }
        }
    }

    public void Promote(FrugalMapBase newMap)
    {
        for (int index = 0; index < _entries.length; ++index)
        {
            if (FrugalMapStoreState.Success == newMap.InsertEntry(_entries[index].Key, _entries[index].Value))
            {
                continue;
            }
            // newMap is smaller than previous map
            throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
        }
    }

    private int FindInsertIndex(int key, /*out*/ boolean found)
    {
        int iLo = 0;

        // Only do the binary search if there is a chance of finding the key
        // This also speeds insertion because we tend to insert at the end.
        if ((_count > 0) && (key <= _lastKey))
        {
            // The array index used for insertion is somewhere between 0
            //  and _count-1 inclusive
            int iHi = _count-1;

            // Do a binary search to find the insertion point
            do
            {
                int iPv = (iHi + iLo) / 2;
                if (key <= _entries[iPv].Key)
                {
                    iHi = iPv;
                }
                else
                {
                    iLo = iPv + 1;
                }
            }
            while (iLo < iHi);
            found = (key == _entries[iLo].Key);
        }
        else
        {
            // Insert point is at the end
            iLo = _count;
            found = false;
        }
        return iLo;
    }

    public int Count
    {
        get
        {
            return _count;
        }
    }

    // MINSIZE chosen to be small, growth rate of 1.5 is slow at small sizes, but increasingly agressive as
    // the array grows
    private /*const*/static final int MINSIZE = 2;

    // The number of items in the map.
    int _count;

    private int _lastKey = INVALIDKEY;
    private Entry[] _entries;
}