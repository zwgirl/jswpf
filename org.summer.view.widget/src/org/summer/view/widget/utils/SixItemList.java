package org.summer.view.widget.utils;
/// <summary>
/// A simple class to handle a list with 6 items.
/// </summary>
/*internal*/ /*sealed*/public class SixItemList<t> extends FrugalListBase<t>
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
        switch (_count)
        {
            case 0:
                _entry0 = value;
                break;

            case 1:
                _entry1 = value;
                break;

            case 2:
                _entry2 = value;
                break;

            case 3:
                _entry3 = value;
                break;

            case 4:
                _entry4 = value;
                break;

            case 5:
                _entry5 = value;
                break;

            default:
                // We have to promote
                return FrugalListStoreState.Array;
        }
        ++_count;
        return FrugalListStoreState.Success;
    }

    public /*override*/ void Clear()
    {
        // Wipe out the info.
        _entry0 = default(T);
        _entry1 = default(T);
        _entry2 = default(T);
        _entry3 = default(T);
        _entry4 = default(T);
        _entry5 = default(T);
        _count = 0;
    }

    public /*override*/ boolean Contains(T value)
    {
        return (-1 != IndexOf(value));
    }

    public /*override*/ int IndexOf(T value)
    {
        if (_entry0.Equals(value))
        {
            return 0;
        }
        if (_count > 1)
        {
            if (_entry1.Equals(value))
            {
                return 1;
            }
            if (_count > 2)
            {
                if (_entry2.Equals(value))
                {
                    return 2;
                }
                if (_count > 3)
                {
                    if (_entry3.Equals(value))
                    {
                        return 3;
                    }
                    if (_count > 4)
                    {
                        if (_entry4.Equals(value))
                        {
                            return 4;
                        }
                        if ((6 == _count) && (_entry5.Equals(value)))
                        {
                            return 5;
                        }
                    }
                }
            }
        }
        return -1;
    }

    public /*override*/ void Insert(int index, T value)
    {
        // Should only get here if count is less than SIZE
        if (_count < SIZE)
        {
            switch (index)
            {
                case 0:
                    _entry5 = _entry4;
                    _entry4 = _entry3;
                    _entry3 = _entry2;
                    _entry2 = _entry1;
                    _entry1 = _entry0;
                    _entry0 = value;
                    break;

                case 1:
                    _entry5 = _entry4;
                    _entry4 = _entry3;
                    _entry3 = _entry2;
                    _entry2 = _entry1;
                    _entry1 = value;
                    break;

                case 2:
                    _entry5 = _entry4;
                    _entry4 = _entry3;
                    _entry3 = _entry2;
                    _entry2 = value;
                    break;

                case 3:
                    _entry5 = _entry4;
                    _entry4 = _entry3;
                    _entry3 = value;
                    break;

                case 4:
                    _entry5 = _entry4;
                    _entry4 = value;
                    break;

                case 5:
                    _entry5 = value;
                    break;

                default:
                    throw new ArgumentOutOfRangeException("index");
            }
            ++_count;
            return;
        }
        throw new ArgumentOutOfRangeException("index");
    }

    public /*override*/ void SetAt(int index, T value)
    {
        // Overwrite item at index
        switch (index)
        {
            case 0:
                _entry0 = value;
                break;

            case 1:
                _entry1 = value;
                break;

            case 2:
                _entry2 = value;
                break;

            case 3:
                _entry3 = value;
                break;

            case 4:
                _entry4 = value;
                break;

            case 5:
                _entry5 = value;
                break;

            default:
                throw new ArgumentOutOfRangeException("index");
        }
    }

    public /*override*/ boolean Remove(T value)
    {
        // If the item matches an existing entry, wipe out the last
        // entry and move all the other entries up.  Because we only
        // have six entries we can just unravel all the cases.
        if (_entry0.Equals(value))
        {
            RemoveAt(0);
            return true;
        }
        else if (_count > 1)
        {
            if (_entry1.Equals(value))
            {
                RemoveAt(1);
                return true;
            }
            else if (_count > 2)
            {
                if (_entry2.Equals(value))
                {
                    RemoveAt(2);
                    return true;
                }
                else if (_count > 3)
                {
                    if (_entry3.Equals(value))
                    {
                        RemoveAt(3);
                        return true;
                    }
                    else if (_count > 4)
                    {
                        if (_entry4.Equals(value))
                        {
                            RemoveAt(4);
                            return true;
                        }
                        else if ((6 == _count) && (_entry5.Equals(value)))
                        {
                            RemoveAt(5);
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    public /*override*/ void RemoveAt(int index)
    {
        // Remove entry at index, wipe out the last entry and move
        // all the other entries up. Because we only have six
        // entries we can just unravel all the cases.
        switch (index)
        {
            case 0:
                _entry0 = _entry1;
                _entry1 = _entry2;
                _entry2 = _entry3;
                _entry3 = _entry4;
                _entry4 = _entry5;
                break;

            case 1:
                _entry1 = _entry2;
                _entry2 = _entry3;
                _entry3 = _entry4;
                _entry4 = _entry5;
                break;

            case 2:
                _entry2 = _entry3;
                _entry3 = _entry4;
                _entry4 = _entry5;
                break;

            case 3:
                _entry3 = _entry4;
                _entry4 = _entry5;
                break;

            case 4:
                _entry4 = _entry5;
                break;

            case 5:
                break;

            default:
                throw new ArgumentOutOfRangeException("index");
        }
        _entry5 = default(T);
        --_count;
    }

    public /*override*/ T EntryAt(int index)
    {
        switch (index)
        {
            case 0:
                return _entry0;

            case 1:
                return _entry1;

            case 2:
                return _entry2;

            case 3:
                return _entry3;

            case 4:
                return _entry4;

            case 5:
                return _entry5;

            default:
                throw new ArgumentOutOfRangeException("index");
        }
    }

    public /*override*/ void Promote(FrugalListBase<t> oldList)
    {
        int oldCount = oldList.Count;
        if (SIZE >= oldCount)
        {
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
        else
        {
            // this list is smaller than oldList
            throw new ArgumentException(SR.Get(SRID.FrugalList_TargetMapCannotHoldAllData, oldList.ToString(), this.ToString()), "oldList");
        }
    }

    // Class specific implementation to avoid virtual method calls and additional logic
    public void Promote(ThreeItemList<t> oldList)
    {
        int oldCount = oldList.Count;
        if (SIZE <= oldCount)
        {
            SetCount(oldList.Count);

            switch (oldCount)
            {
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
        else
        {
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

    public /*override*/ T[] ToArray()
    {
        T[] array = new T[_count];

        if (_count >= 1)
        {
            array[0] = _entry0;
            if (_count >= 2)
            {
                array[1] = _entry1;
                if (_count >= 3)
                {
                    array[2] = _entry2;
                    if (_count >= 4)
                    {
                        array[3] = _entry3;
                        if (_count >= 5)
                        {
                            array[4] = _entry4;
                            if (_count == 6)
                            {
                                array[5] = _entry5;
                            }
                        }
                    }
                }
            }
        }
        return array;
    }

    public /*override*/ void CopyTo(T[] array, int index)
    {
        if (_count >= 1)
        {
            array[index] = _entry0;
            if (_count >= 2)
            {
                array[index+1] = _entry1;
                if (_count >= 3)
                {
                    array[index+2] = _entry2;
                    if (_count >= 4)
                    {
                        array[index+3] = _entry3;
                        if (_count >= 5)
                        {
                            array[index+4] = _entry4;
                            if (_count == 6)
                            {
                                array[index+5] = _entry5;
                            }
                        }
                    }
                }
            }
        }
    }

    public /*override*/ Object Clone()
    {
        SixItemList<t> newList = new SixItemList<t>();
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

    private final int SIZE = 6;

    private T _entry0;
    private T _entry1;
    private T _entry2;
    private T _entry3;
    private T _entry4;
    private T _entry5;
}
  
 
  
 
