package org.summer.view.widget.utils;
/// <summary>
/// A simple class to handle a single object with 3 key/value pairs.  The pairs are stored unsorted
/// and uses a linear search.  Perf analysis showed that this yielded better memory locality and
/// perf than an object and an array.
/// </summary>
/// <remarks>
/// This map inserts at the last position.  Any time we add to the map we set _sorted to false. If you need
/// to iterate through the map in sorted order you must call Sort before using GetKeyValuePair.
/// </remarks>
public class ThreeObjectMap extends FrugalMapBase
{
    public override FrugalMapStoreState InsertEntry(int key, Object value)
    {
        // Check to see if we are updating an existing entry
        Debug.Assert(INVALIDKEY != key);

        // First check if the key matches the key of one of the existing entries.
        // If it does, overwrite the existing value and return success.
        switch (_count)
        {
            case 1:
                if (_entry0.Key == key)
                {
                    _entry0.Value = value;
                    return FrugalMapStoreState.Success;
                }
                break;

            case 2:
                if (_entry0.Key == key)
                {
                    _entry0.Value = value;
                    return FrugalMapStoreState.Success;
                }
                if (_entry1.Key == key)
                {
                    _entry1.Value = value;
                    return FrugalMapStoreState.Success;
                }
                break;

            case 3:
                if (_entry0.Key == key)
                {
                    _entry0.Value = value;
                    return FrugalMapStoreState.Success;
                }
                if (_entry1.Key == key)
                {
                    _entry1.Value = value;
                    return FrugalMapStoreState.Success;
                }
                if (_entry2.Key == key)
                {
                    _entry2.Value = value;
                    return FrugalMapStoreState.Success;
                }
                break;

            default:
                break;
        }

        // If we got past the above switch, that means this key
        // doesn't exist in the map already so we should add it.
        // Only add it if we're not at the size limit; otherwise
        // we have to promote.
        if (SIZE > _count)
        {
            // Space still available to store the value. Insert
            // into the entry at _count (the next available slot).
            switch (_count)
            {
                case 0:
                    _entry0.Key = key;
                    _entry0.Value = value;
                    _sorted = true;
                    break;

                case 1:
                    _entry1.Key = key;
                    _entry1.Value = value;
                    // We have added an entry to the array, so we may not be sorted any longer
                    _sorted = false;
                    break;

                case 2:
                    _entry2.Key = key;
                    _entry2.Value = value;
                    // We have added an entry to the array, so we may not be sorted any longer
                    _sorted = false;
                    break;
            }
            ++_count;

            return FrugalMapStoreState.Success;
        }
        else
        {
            // Array is full, move to a SixObjectMap
            return FrugalMapStoreState.SixObjectMap;
        }
    }

    public override void RemoveEntry(int key)
    {
        // If the key matches an existing entry, wipe out the last
        // entry and move all the other entries up.  Because we only
        // have three entries we can just unravel all the cases.
        switch (_count)
        {
            case 1:
                if (_entry0.Key == key)
                {
                    _entry0.Key = INVALIDKEY;
                    _entry0.Value = DependencyProperty.UnsetValue;
                    --_count;
                    return;
                }
                break;

            case 2:
                if (_entry0.Key == key)
                {
                    _entry0 = _entry1;
                    _entry1.Key = INVALIDKEY;
                    _entry1.Value = DependencyProperty.UnsetValue;
                    --_count;
                    break;
                }
                if (_entry1.Key == key)
                {
                    _entry1.Key = INVALIDKEY;
                    _entry1.Value = DependencyProperty.UnsetValue;
                    --_count;
                }
                break;

            case 3:
                if (_entry0.Key == key)
                {
                    _entry0 = _entry1;
                    _entry1 = _entry2;
                    _entry2.Key = INVALIDKEY;
                    _entry2.Value = DependencyProperty.UnsetValue;
                    --_count;
                    break;
                }
                if (_entry1.Key == key)
                {
                    _entry1 = _entry2;
                    _entry2.Key = INVALIDKEY;
                    _entry2.Value = DependencyProperty.UnsetValue;
                    --_count;
                    break;
                }
                if (_entry2.Key == key)
                {
                    _entry2.Key = INVALIDKEY;
                    _entry2.Value = DependencyProperty.UnsetValue;
                    --_count;
                    break;
                }
                break;

            default:
                break;
        }
    }

    public override Object Search(int key)
    {
        Debug.Assert(INVALIDKEY != key);
        if (_count > 0)
        {
            if (_entry0.Key == key)
            {
                return _entry0.Value;
            }
            if (_count > 1)
            {
                if (_entry1.Key == key)
                {
                    return _entry1.Value;
                }
                if ((_count > 2) && (_entry2.Key == key))
                {
                    return _entry2.Value;
                }
            }
        }
        return DependencyProperty.UnsetValue;
    }

    public override void Sort()
    {
        // If we're unsorted and we have entries to sort, do a simple
        // sort.  Sort the pairs (0,1), (1,2) and then (0,1) again.
        if ((false == _sorted) && (_count > 1))
        {
            Entry temp;
            if (_entry0.Key > _entry1.Key)
            {
                temp = _entry0;
                _entry0 = _entry1;
                _entry1 = temp;
            }
            if (_count > 2)
            {
                if (_entry1.Key > _entry2.Key)
                {
                    temp = _entry1;
                    _entry1 = _entry2;
                    _entry2 = temp;

                    if (_entry0.Key > _entry1.Key)
                    {
                        temp = _entry0;
                        _entry0 = _entry1;
                        _entry1 = temp;
                    }
                }
            }
            _sorted = true;
        }
    }

    public override void GetKeyValuePair(int index, out int key, out Object value)
    {
        if (index < _count)
        {
            switch (index)
            {
                case 0:
                    key = _entry0.Key;
                    value = _entry0.Value;
                    break;

                case 1:
                    key = _entry1.Key;
                    value = _entry1.Value;
                    break;

                case 2:
                    key = _entry2.Key;
                    value = _entry2.Value;
                    break;

                default:
                    key = INVALIDKEY;
                    value = DependencyProperty.UnsetValue;
                    break;
            }
        }
        else
        {
            key = INVALIDKEY;
            value = DependencyProperty.UnsetValue;
            throw new ArgumentOutOfRangeException("index");
        }
    }

    public override void Iterate(ArrayList list, FrugalMapIterationCallback callback)
    {
        if (_count > 0)
        {
            if (_count >= 1)
            {
                callback(list, _entry0.Key, _entry0.Value);
            }
            if (_count >= 2)
            {
                callback(list, _entry1.Key, _entry1.Value);
            }
            if (_count == 3)
            {
                callback(list, _entry2.Key, _entry2.Value);
            }
        }
    }

    public override void Promote(FrugalMapBase newMap)
    {
        if (FrugalMapStoreState.Success != newMap.InsertEntry(_entry0.Key, _entry0.Value))
        {
            // newMap is smaller than previous map
            throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
        }
        if (FrugalMapStoreState.Success != newMap.InsertEntry(_entry1.Key, _entry1.Value))
        {
            // newMap is smaller than previous map
            throw new ArgumentException(SR.Get(SRID.FrugalMap_TargetMapCannotHoldAllData, this.ToString(), newMap.ToString()), "newMap");
        }
        if (FrugalMapStoreState.Success != newMap.InsertEntry(_entry2.Key, _entry2.Value))
        {
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

    private const int SIZE = 3;

    // The number of items in the map.
    private UInt16 _count;

    private bool _sorted;
    private Entry _entry0;
    private Entry _entry1;
    private Entry _entry2;
}