package org.summer.view.widget;

import org.summer.view.widget.collection.ObservableCollection;

/*internal*/ public class ResourceDictionaryCollection extends ObservableCollection<ResourceDictionary> 
{
//    #region Constructor 

    /*internal*/ public ResourceDictionaryCollection(ResourceDictionary owner)
    {
//        Debug.Assert(owner != null, "ResourceDictionaryCollection's owner cannot be null"); 

        _owner = owner; 
    } 

//    #endregion Constructor 

//    #region ProtectedMethods

    /// <summary> 
    /// Called by base class Collection&lt;T&gt; when the list is being cleared;
    /// raises a CollectionChanged event to any listeners. 
    /// </summary> 
    protected /*override*/ void ClearItems()
    { 
        for (int i=0; i<Count; i++)
        {
            _owner.RemoveParentOwners(this[i]);
        } 

        super.ClearItems(); 
    } 

    /// <summary> 
    /// Called by base class Collection&lt;T&gt; when an item is added to list;
    /// raises a CollectionChanged event to any listeners.
    /// </summary>
    protected /*override*/ void InsertItem(int index, ResourceDictionary item) 
    {
        if (item == null) 
        { 
            throw new ArgumentNullException("item");
        } 

        super.InsertItem(index, item);
    }

    /// <summary>
    /// Called by base class Collection&lt;T&gt; when an item is set in list; 
    /// raises a CollectionChanged event to any listeners. 
    /// </summary>
    protected /*override*/ void SetItem(int index, ResourceDictionary item) 
    {
        if (item == null)
        {
            throw new ArgumentNullException("item"); 
        }

        super.SetItem(index, item); 
    }

//    #endregion ProtectedMethods

//    #region Data

    private ResourceDictionary _owner;

//    #endregion Data 
}