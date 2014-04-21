package org.summer.view.widget;
/*internal*/ public  class InstanceValueKey
{ 
//    #region Construction

    /*internal*/ public  InstanceValueKey(int childIndex, int dpIndex, int index) 
    {
        _childIndex = childIndex; 
        _dpIndex = dpIndex;
        _index = index;
    }

//    #endregion Construction

    public /*override*/ boolean Equals(Object o) 
    {
        InstanceValueKey key = o as InstanceValueKey; 
        if (key != null)
            return (_childIndex == key._childIndex) && (_dpIndex == key._dpIndex) && (_index == key._index);
        else
            return false; 
    }

    public /*override*/ int GetHashCode() 
    {
        return (20000*_childIndex + 20*_dpIndex + _index); 
    }

    // the origin of the instance value in the container's style:
    int _childIndex;    // the childIndex of the target element 
    int _dpIndex;       // the global index of the target DP
    int _index;         // the index in the ItemStructList<ChildValueLookup> 
}