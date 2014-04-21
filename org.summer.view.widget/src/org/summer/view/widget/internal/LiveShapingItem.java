package org.summer.view.widget.internal;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.INotifyPropertyChanged;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingExpressionBase;
import org.summer.view.widget.data.BindingMode;
import org.summer.view.widget.data.BindingOperations;
import org.summer.view.widget.data.CollectionViewGroupInternal;
import org.summer.view.widget.model.PropertyChangedEventArgs;
import org.summer.view.widget.model.PropertyChangedEventManager;
/*internal*/public class LiveShapingItem extends DependencyObject
{ 
    /*internal*/ LiveShapingItem(Object item, LiveShapingList list, 
    		boolean filtered/*=false*/, LiveShapingBlock block/*=null*/, boolean oneTime/*=false*/)
    { 
        _block = block; 

        list.InitializeItem(this, item, filtered, oneTime); 

        ForwardChanges = !oneTime;
    }

    /*internal*/ Object Item { get { return _item; } set { _item = value; } }
    /*internal*/ LiveShapingBlock Block { get { return _block; } set { _block = value; } } 
    LiveShapingList List { get { return Block.List; } } 

    /*internal*/ boolean IsSortDirty 
    {
        get { return TestFlag(PrivateFlags.IsSortDirty); }
        set { ChangeFlag(PrivateFlags.IsSortDirty, value); }
    } 

    /*internal*/ boolean IsSortPendingClean 
    { 
        get { return TestFlag(PrivateFlags.IsSortPendingClean); }
        set { ChangeFlag(PrivateFlags.IsSortPendingClean, value); } 
    }

    /*internal*/ boolean IsFilterDirty
    { 
        get { return TestFlag(PrivateFlags.IsFilterDirty); }
        set { ChangeFlag(PrivateFlags.IsFilterDirty, value); } 
    } 

    /*internal*/ boolean IsGroupDirty 
    {
        get { return TestFlag(PrivateFlags.IsGroupDirty); }
        set { ChangeFlag(PrivateFlags.IsGroupDirty, value); }
    } 

    /*internal*/ boolean FailsFilter 
    { 
        get { return TestFlag(PrivateFlags.FailsFilter); }
        set { ChangeFlag(PrivateFlags.FailsFilter, value); } 
    }

    /*internal*/ boolean ForwardChanges
    { 
        get { return TestFlag(PrivateFlags.ForwardChanges); }
        set { ChangeFlag(PrivateFlags.ForwardChanges, value); } 
    } 

    /*internal*/ boolean IsDeleted 
    {
        get { return TestFlag(PrivateFlags.IsDeleted); }
        set { ChangeFlag(PrivateFlags.IsDeleted, value); }
    } 

    /*internal*/ void FindPosition(/*out*/ RBFinger<LiveShapingItem> oldFinger, /*out*/ RBFinger<LiveShapingItem> newFinger, Comparison<LiveShapingItem> comparison) 
    { 
        Block.FindPosition(this, /*out*/ oldFinger, /*out*/ newFinger, comparison);
    } 

    /*internal*/ RBFinger<LiveShapingItem> GetFinger()
    {
        return Block.GetFinger(this); 
    }

    private static final DependencyProperty StartingIndexProperty = 
        DependencyProperty.Register("StartingIndex", typeof(int), typeof(LiveShapingItem));

    /*internal*/ int StartingIndex
    {
        get { return (int)GetValue(StartingIndexProperty); }
        set { SetValue(StartingIndexProperty, value); } 
    }

    /*internal*/ int GetAndClearStartingIndex() 
    {
        int result = StartingIndex; 
        ClearValue(StartingIndexProperty);
        return result;
    }

    /*internal*/ void SetBinding(String path, DependencyProperty dp, boolean oneTime/*=false*/, boolean enableXT/*=false*/)
    { 
        if (enableXT && oneTime) 
            enableXT = false;

        if (!LookupEntry(dp.GlobalIndex).Found)
        {
            if (!String.IsNullOrEmpty(path))
            { 
                Binding binding;
                if (SystemXmlHelper.IsXmlNode(_item)) 
                { 
                    binding = new Binding();
                    binding.XPath = path; 
                }
                else
                {
                    binding = new Binding(path); 
                }

                binding.Source = _item; 
                if (oneTime)
                    binding.Mode = BindingMode.OneTime; 
                BindingExpressionBase beb = BindingOperations.SetBinding(this, dp, binding);
                if (enableXT)
                    beb.TargetWantsCrossThreadNotifications = true;
            } 
            else if (!oneTime)
            { 
                // when the path is empty, react to any property change 
                INotifyPropertyChanged inpc = Item as INotifyPropertyChanged;
                if (inpc != null) 
                {
                    PropertyChangedEventManager.AddHandler(inpc, OnPropertyChanged, String.Empty);
                }
            } 
        }
    } 

    /*internal*/ Object GetValue(String path, DependencyProperty dp)
    { 
        if (!String.IsNullOrEmpty(path))
        {
            SetBinding(path, dp, false, false);       // set up the binding, if not already done
            return GetValue(dp);        // return the value 
        }
        else 
        { 
            // when the path is empty, just return the item itself
            return Item; 
        }
    }

    /*internal*/ void Clear() 
    {
        List.ClearItem(this); 
    } 

    // if a sort property changes on a foreign thread, we must mark the item 
    // as sort-dirty immediately, in case the UI thread is trying to restore
    // live sorting.   The item is no longer necessarily in the right position,
    // and so should not participate in comparisons.
    /*internal*/ void OnCrossThreadPropertyChange(DependencyProperty dp) 
    {
        List.OnItemPropertyChangedCrossThread(this, dp); 
    } 

    private static final DependencyProperty ParentGroupsProperty = 
        DependencyProperty.Register("ParentGroups", typeof(Object), typeof(LiveShapingItem));

    /*internal*/public void AddParentGroup(CollectionViewGroupInternal group)
    { 
        Object o = GetValue(ParentGroupsProperty);
        List<CollectionViewGroupInternal> list; 

        if (o == null)
        {   // no parents yet, store a singleton 
            SetValue(ParentGroupsProperty, group);
        }
        else if ((list = o as List<CollectionViewGroupInternal>) == null)
        {   // one parent, store a list 
            list = new List<CollectionViewGroupInternal>(2);
            list.Add(o as CollectionViewGroupInternal); 
            list.Add(group); 
            SetValue(ParentGroupsProperty, list);
        } 
        else
        {   // many parents, add to the list
            list.Add(group);
        } 
    }

    /*internal*/public void RemoveParentGroup(CollectionViewGroupInternal group) 
    {
        Object o = GetValue(ParentGroupsProperty); 
        List<CollectionViewGroupInternal> list = o as List<CollectionViewGroupInternal>;

        if (list == null)
        {   // one parent, remove it 
            if (o == group)
            { 
                ClearValue(ParentGroupsProperty); 
            }
        } 
        else
        {   // many parents, remove from the list
            list.Remove(group);
            if (list.Count == 1) 
            {   // collapse a singleton list
                SetValue(ParentGroupsProperty, list[0]); 
            } 
        }
    } 

    /*internal*/public List<CollectionViewGroupInternal> ParentGroups
    {
        get { return GetValue(ParentGroupsProperty) as List<CollectionViewGroupInternal>; } 
    }

    /*internal*/ CollectionViewGroupInternal ParentGroup 
    {
        get { return GetValue(ParentGroupsProperty) as CollectionViewGroupInternal; } 
    }

    protected /*override*/ void OnPropertyChanged(DependencyPropertyChangedEventArgs e)
    { 
        if (ForwardChanges)
        { 
            List.OnItemPropertyChanged(this, e.Property); 
        }
    } 

    private void OnPropertyChanged(Object sender, PropertyChangedEventArgs e)
    {
        List.OnItemPropertyChanged(this, null); 
    }

    private boolean TestFlag(PrivateFlags flag) 
    {
        return (_flags & flag) != 0; 
    }

    private void ChangeFlag(PrivateFlags flag, boolean value)
    { 
        if (value)  _flags |=  flag;
        else        _flags &= ~flag; 
    } 

//    [Flags] 
    private enum PrivateFlags
    {
        IsSortDirty             ,//= 0x00000001,   // sort property has changed (even cross-thread)
        IsSortPendingClean      ,//= 0x00000002,   // item is on the SortDirtyItems list 
        IsFilterDirty           ,//= 0x00000004,   // filter property has changed
        IsGroupDirty            ,//= 0x00000008,   // grouping property has changed 
        FailsFilter             ,//= 0x00000010,   // item fails the filter 
        ForwardChanges          ,//= 0x00000020,   // inform list of changes
        IsDeleted               ,//= 0x00000040,   // item is deleted - no live shaping needed 
    }

    LiveShapingBlock _block;    // the block where I appear
    Object          _item;      // the source item I represent 
    PrivateFlags    _flags;
}