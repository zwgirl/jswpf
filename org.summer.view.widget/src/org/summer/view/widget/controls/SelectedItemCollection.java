package org.summer.view.widget.controls;

import org.summer.view.widget.IDisposable;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.controls.primitives.Selector;

/// <summary>
/// This class represent the collection of SelectedItems in Selector. It extends the ObservableCollection by providing methods for bulk selection. 
/// </summary> 
/*internal*/ public class SelectedItemCollection extends ObservableCollection<Object>
{ 
//    #region Contructors
    /// <summary>
    /// Create a new SelectedItemCollection Object which keeps a reference to the corresponding Selector
    /// </summary> 
    /// <param name="selector"></param>
    public SelectedItemCollection(Selector selector) 
    { 
        _selector = selector;
        _changer = new Changer(this); 
    }
//    #endregion

//    #region Protected Methods 

    /// <summary> 
    /// Clear all items from the selection. This method modifies the behavior of IList.Clear() 
    /// </summary>
    protected /*override*/ void ClearItems() 
    {
        if (_updatingSelectedItems)
        {
            foreach (ItemsControl.ItemInfo current in _selector._selectedItems) 
            {
                _selector.SelectionChange.Unselect(current); 
            } 
        }
        else 
        {
            using (ChangeSelectedItems())
            {
                base.ClearItems(); 
            }
        } 
    } 

    /// <summary> 
    /// Removes an item from the selection. This method modifies the behavior of IList.Remove() and IList.RemoveAt()
    /// </summary>
    protected /*override*/ void RemoveItem(int index)
    { 
        if (_updatingSelectedItems)
        { 
            _selector.SelectionChange.Unselect(_selector.NewItemInfo(this[index])); 
        }
        else 
        {
            using (ChangeSelectedItems())
            {
                base.RemoveItem(index); 
            }
        } 
    } 

    /// <summary> 
    /// Inserts an item in the selection
    /// </summary>
    protected /*override*/ void InsertItem(int index, Object item)
    { 
        if (_updatingSelectedItems)
        { 
            // For defered selection we should allow only Add method 
            if (index == Count)
            { 
                _selector.SelectionChange.Select(_selector.NewItemInfo(item), true /* assumeInItemsCollection */);
            }
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.InsertInDeferSelectionActive));
            } 
        } 
        else
        { 
            using (ChangeSelectedItems())
            {
                base.InsertItem(index, item);
            } 
        }
    } 

    /// <summary>
    /// Sets an item on specified index 
    /// </summary>
    protected /*override*/ void SetItem(int index, Object item)
    {
        if (_updatingSelectedItems) 
        {
            throw new InvalidOperationException(SR.Get(SRID.SetInDeferSelectionActive)); 
        } 
        else
        { 
            using (ChangeSelectedItems())
            {
                base.SetItem(index, item);
            } 
        }
    } 

    /// <summary>
    /// Movea an item from one position to another 
    /// </summary>
    /// <param name="oldIndex">index of the column which is being moved</param>
    /// <param name="newIndex">index of the column to be move to</param>
    protected /*override*/ void MoveItem(int oldIndex, int newIndex) 
    {
        if (oldIndex != newIndex) 
        { 
            if (_updatingSelectedItems)
            { 
                throw new InvalidOperationException(SR.Get(SRID.MoveInDeferSelectionActive));
            }
            else
            { 
                using (ChangeSelectedItems())
                { 
                    super.MoveItem(oldIndex, newIndex); 
                }
            } 
        }
    }

//    #endregion 

//    #region Reentrant changes 

    /*internal*/ public boolean IsChanging { get { return (_changeCount > 0); } }

    private IDisposable ChangeSelectedItems()
    {
        ++_changeCount;
        return _changer; 
    }

    private void FinishChange() 
    {
        if (--_changeCount == 0) 
        {
            _selector.FinishSelectedItemsChange();
        }
    } 

    private class Changer implements IDisposable 
    { 
        public Changer(SelectedItemCollection owner)
        { 
            _owner = owner;
        }

        public void Dispose() 
        {
            _owner.FinishChange(); 
        } 

        SelectedItemCollection _owner; 
    }

    int _changeCount;
    Changer _changer; 

//    #endregion Reentrant changes 

//    #region MultiSelector methods

    /// <summary>
    /// Begin tracking selection changes. SelectedItems.Add/Remove will queue up the changes but not commit them until EndUpdateSelecteditems is called.
    /// </summary>
    /*internal*/ public void BeginUpdateSelectedItems() 
    {
        if (_selector.SelectionChange.IsActive || _updatingSelectedItems) 
        { 
            throw new InvalidOperationException(SR.Get(SRID.DeferSelectionActive));
        } 
        _updatingSelectedItems = true;
        _selector.SelectionChange.Begin();
    }

    /// <summary>
    /// Commit selection changes. 
    /// </summary> 
    /*internal*/ public void EndUpdateSelectedItems()
    { 
        if (!_selector.SelectionChange.IsActive || !_updatingSelectedItems)
        {
            throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive));
        } 
        _updatingSelectedItems = false;
        _selector.SelectionChange.End(); 
    } 

    /// <summary> 
    /// Returns true after BeginUpdateSelectedItems is called
    /// </summary>
    /*internal*/ public boolean IsUpdatingSelectedItems
    { 
        get
        { 
            return _selector.SelectionChange.IsActive || _updatingSelectedItems; 
        }
    } 

    /// <summary>
    /// Add an ItemInfo to the deferred selection
    /// </summary> 
    /*internal*/ public void Add(ItemInfo info)
    { 
        if (!_selector.SelectionChange.IsActive || !_updatingSelectedItems) 
        {
            throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive)); 
        }

        _selector.SelectionChange.Select(info, true /* assumeInItemsCollection */);
    } 

    /// <summary> 
    /// Remove an ItemInfo from the deferred selection 
    /// </summary>
    /*internal*/ public void Remove(ItemInfo info) 
    {
        if (!_selector.SelectionChange.IsActive || !_updatingSelectedItems)
        {
            throw new InvalidOperationException(SR.Get(SRID.DeferSelectionNotActive)); 
        }

        _selector.SelectionChange.Unselect(info); 
    }

//    #endregi//on

//    #region Private data

    // Keep a reference for Selector owner
    private Selector _selector; 

    // We need a flag for indicating user bulk selection mode. We cannot re-use SelectionChange.IsActive because there are cases when SelectionChange.IsActive==true and SelectedItems.Add is called internally (End()) to update the collection
    // When EndUpdateSelectedItems() is called we first reset this flag to allow SelectedItems.Add to change the collection 
    private boolean _updatingSelectedItems;
//    #endregion
}