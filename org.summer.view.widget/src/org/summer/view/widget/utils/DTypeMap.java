package org.summer.view.widget.utils;

import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.ItemStructList;
import org.summer.view.widget.collection.Hashtable;

//[FriendAccessAllowed] // Built into Core, also used by Framework. 
/*internal*/ public class DTypeMap
{

    public DTypeMap(int entryCount) 
    {
        // Constant Time Lookup entries (array size) 
        _entryCount = entryCount; 
        _entries = new Object[_entryCount];
        _activeDTypes = new ItemStructList<DependencyObjectType>(128); 
    }

    public Object this[DependencyObjectType dType]
    { 
        get
        { 
            if (dType.Id < _entryCount) 
            {
                return _entries[dType.Id]; 
            }
            else
            {
                if (_overFlow != null) 
                {
                    return _overFlow[dType]; 
                } 

                return null; 
            }
        }

        set 
        {
            if (dType.Id < _entryCount) 
            { 
                _entries[dType.Id] = value;
            } 
            else
            {
                if (_overFlow == null)
                { 
                    _overFlow = new Hashtable();
                } 

                _overFlow[dType] = value;
            } 

            _activeDTypes.Add(dType);
        }
    } 

    // Return list of non-null DType mappings 
    public ItemStructList<DependencyObjectType> ActiveDTypes 
    {
        get { return _activeDTypes; } 
    }

    // Clear the data-structures to be able to start over
    public void Clear() 
    {
        for (int i=0; i<_entryCount; i++) 
        { 
            _entries[i] = null;
        } 

        for (int i=0; i<_activeDTypes.Count; i++)
        {
            _activeDTypes.List[i] = null; 
        }

        if (_overFlow != null) 
        {
            _overFlow.Clear(); 
        }
    }

    private int _entryCount; 
    private Object[] _entries;
    private Hashtable _overFlow; 
    private ItemStructList<DependencyObjectType> _activeDTypes; 
}