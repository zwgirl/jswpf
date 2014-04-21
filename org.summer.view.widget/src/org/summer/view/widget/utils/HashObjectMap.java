package org.summer.view.widget.utils;

import org.summer.view.widget.DependencyProperty;

public class HashObjectMap extends FrugalMapBase
{
    public FrugalMapStoreState InsertEntry(int key, Object value)
    {
//        Debug.Assert(INVALIDKEY != key);

        if (null != _entries)
        {
            // This is done because forward branches
            // default prediction is not to be taken
            // making this a CPU win because insert
            // is a common operation.
        }
        else
        {
            _entries = new Hashtable(MINSIZE);
        }

        _entries[key] = ((value != NullValue) && (value != null)) ? value : NullValue;
        return FrugalMapStoreState.Success;
    }

    public void RemoveEntry(int key)
    {
        _entries.Remove(key);
    }

    public Object Search(int key)
    {
        Object value = _entries[key];

        return ((value != NullValue) && (value != null)) ? value : DependencyProperty.UnsetValue;
    }

    public void Sort()
    {
        // Always sorted.
    }

    public void GetKeyValuePair(int index, /*out*/ int key, /*out*/ Object value)
    {
        if (index < _entries.Count)
        {
            IDictionaryEnumerator myEnumerator = _entries.GetEnumerator();

            // Move to first valid value
            myEnumerator.MoveNext();

            for (int i = 0; i < index; ++i)
            {
                myEnumerator.MoveNext();
            }
            key = (int)myEnumerator.Key;
            if ((myEnumerator.Value != NullValue) && (myEnumerator.Value != null))
            {
                value = myEnumerator.Value;
            }
            else
            {
                value = DependencyProperty.UnsetValue;
            }
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
        IDictionaryEnumerator myEnumerator = _entries.GetEnumerator();

        while (myEnumerator.MoveNext())
        {
            int key = (int)myEnumerator.Key;
            Object value;
            if ((myEnumerator.Value != NullValue) && (myEnumerator.Value != null))
            {
                value = myEnumerator.Value;
            }
            else
            {
                value = DependencyProperty.UnsetValue;
            }

            callback(list, key, value);
        }
    }

    public void Promote(FrugalMapBase newMap)
    {
        // Should never get here
        throw new InvalidOperationException(SR.Get(SRID.FrugalMap_CannotPromoteBeyondHashtable));
    }

    // Size of this data store
    public int Count
    {
        get
        {
            return _entries.Count;
        }
    }

    // 163 is chosen because it is the first prime larger than 128, the MAXSIZE of SortedObjectMap
    final int MINSIZE = 163;

    // Hashtable will return null from its indexer if the key is not
    // found OR if the value is null.  To distinguish between these
    // two cases we insert NullValue instead of null.
    private static Object NullValue = new Object();

    Hashtable _entries;
}

