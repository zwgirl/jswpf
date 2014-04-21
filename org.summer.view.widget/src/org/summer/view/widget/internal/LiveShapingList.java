package org.summer.view.widget.internal;

import java.lang.reflect.Array;

import javax.swing.Action;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.collection.Collection;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.data.BindingOperations;
import org.summer.view.widget.data.IComparer;
import org.summer.view.widget.data.PropertyGroupDescription;
import org.summer.view.widget.model.GroupDescription;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.model.ICollectionViewLiveShaping;
import org.summer.view.widget.model.SortDescriptionCollection;

/*internal*/public class LiveShapingList implements IList 
{
    /*internal*/ LiveShapingList(ICollectionViewLiveShaping view, LiveShapingFlags flags, IComparer comparer)
    {
        _view = view; 
        _comparer = comparer;
        _isCustomSorting = !(comparer instanceof SortFieldComparer); 
        _dpFromPath = new DPFromPath(); 
        _root = new LiveShapingTree(this);

        if (comparer != null)
            _root.Comparison = CompareLiveShapingItems;

        _sortDirtyItems = new List<LiveShapingItem>(); 
        _filterDirtyItems = new List<LiveShapingItem>();
        _groupDirtyItems = new List<LiveShapingItem>(); 

        SetLiveShapingProperties(flags);
    } 

    /*internal*/public ICollectionViewLiveShaping View { get { return _view; } }

    /*internal*/public Dictionary<String, DependencyProperty> ObservedProperties 
    {
        get { return _dpFromPath; } 
    } 

    // reset the collections of properties to observe, and their 
    // corresponding DPs
    /*internal*/public void SetLiveShapingProperties(LiveShapingFlags flags)
    {
        int k, n; 
        String path;

        _dpFromPath.BeginReset(); 

        // Sorting // 

        // get the properties used for comparison
        SortDescriptionCollection sdc = ((ICollectionView)View).SortDescriptions;
        n = sdc.Count; 
        _compInfos = new LivePropertyInfo[n];
        for (k=0; k<n; ++k) 
        { 
            path = NormalizePath(sdc[k].PropertyName);
            _compInfos[k] = new LivePropertyInfo(path, _dpFromPath.GetDP(path)); 
        }


        if (TestLiveShapingFlag(flags, LiveShapingFlags.Sorting)) 
        {
            // get the list of property paths to observe 
            Collection<String> sortProperties = View.LiveSortingProperties; 

            if (sortProperties.Count == 0) 
            {
                // use the sort description properties
                _sortInfos = _compInfos;
            } 
            else
            { 
                // use the explicit list of properties 
                n = sortProperties.Count;
                _sortInfos = new LivePropertyInfo[n]; 
                for (k=0; k<n; ++k)
                {
                    path = NormalizePath(sortProperties[k]);
                    _sortInfos[k] = new LivePropertyInfo(path, _dpFromPath.GetDP(path)); 
                }
            } 
        } 
        else
        { 
            _sortInfos = new LivePropertyInfo[0];
        }


        // Filtering //

        if (TestLiveShapingFlag(flags, LiveShapingFlags.Filtering)) 
        {
            // get the list of property paths to observe 
            Collection<String> filterProperties = View.LiveFilteringProperties;
            n = filterProperties.Count;
            _filterInfos = new LivePropertyInfo[n];
            for (k=0; k<n; ++k) 
            {
                path = NormalizePath(filterProperties[k]); 
                _filterInfos[k] = new LivePropertyInfo(path, _dpFromPath.GetDP(path)); 
            }

            _filterRoot = new LiveShapingTree(this);
        }
        else
        { 
            _filterInfos = new LivePropertyInfo[0];
            _filterRoot = null; 
        } 


        // Grouping //

        if (TestLiveShapingFlag(flags, LiveShapingFlags.Grouping))
        { 
            // get the list of property paths to observe
            Collection<String> groupingProperties = View.LiveGroupingProperties; 

            if (groupingProperties.Count == 0)
            { 
                // if no explicit list, use the group description properties
                groupingProperties = new Collection<String>();
                ICollectionView icv = View as ICollectionView;
                ObservableCollection<GroupDescription> groupDescriptions = (icv != null) ? icv.GroupDescriptions : null; 

                if (groupDescriptions != null) 
                { 
                    for/*each*/ (GroupDescription gd : groupDescriptions)
                    { 
                        PropertyGroupDescription pgd = gd as PropertyGroupDescription;
                        if (pgd != null)
                        {
                            groupingProperties.Add(pgd.PropertyName); 
                        }
                    } 
                } 
            }

            n = groupingProperties.Count;
            _groupInfos = new LivePropertyInfo[n];
            for (k=0; k<n; ++k)
            { 
                path = NormalizePath(groupingProperties[k]);
                _groupInfos[k] = new LivePropertyInfo(path, _dpFromPath.GetDP(path)); 
            } 
        }
        else 
        {
            _groupInfos = new LivePropertyInfo[0];
        }

        _dpFromPath.EndReset();
    } 

    boolean TestLiveShapingFlag(LiveShapingFlags flags, LiveShapingFlags flag)
    { 
        return (flags & flag) != 0;
    }

    // Search for value in the slice of the list starting at index with length count, 
    // using the given comparer.  The list is assumed to be sorted w.r.t. the
    // comparer.  Return the index if found, or the bit-complement 
    // of the index where it would belong. 
    /*internal*/ int Search(int index, int count, Object value)
    { 
        LiveShapingItem temp = new LiveShapingItem(value, this, true, null, true);
        RBFinger<LiveShapingItem> finger = _root.BoundedSearch(temp, index, index+count);
        ClearItem(temp);

        return finger.Found ? finger.Index : ~finger.Index;
    } 

    // Sort the list, using the comparer supplied at creation
    /*internal*/ void Sort() 
    {
        _root.Sort();
    }

    /*internal*/ int CompareLiveShapingItems(LiveShapingItem x, LiveShapingItem y)
    { 
//        #if LiveShapingInstrumentation 
        ++_comparisons;
//        #endif 

        if (x == y || Object.Equals(x.Item, y.Item))
            return 0;

        int result = 0;

        if (!_isCustomSorting) 
        {
            // intercept SortFieldComparer, and do the comparisons here. 
            // The LiveShapingItems will cache the field values.
            SortFieldComparer sfc = _comparer as SortFieldComparer;
            SortDescriptionCollection sdc = ((ICollectionView)View).SortDescriptions;
//            Debug.Assert(sdc.Count >= _compInfos.Length, "SortDescriptions don't match LivePropertyInfos"); 
            int n = _compInfos.Length;

            for (int k=0; k<n; ++k) 
            {
                Object v1 = x.GetValue(_compInfos[k].Path, _compInfos[k].Property); 
                Object v2 = y.GetValue(_compInfos[k].Path, _compInfos[k].Property);

                result = sfc.BaseComparer.Compare(v1, v2);
                if (sdc[k].Direction == ListSortDirection.Descending) 
                    result = -result;

                if (result != 0) 
                    break;
            } 
        }
        else
        {
            // for custom comparers, just compare items the normal way 
            result = _comparer.Compare(x.Item, y.Item);
        } 

        return result;
    } 

    // Move an item from one position to another
    /*internal*/ void Move(int oldIndex, int newIndex)
    { 
        _root.Move(oldIndex, newIndex);
    } 

    // Restore sorted order by insertion sort, raising an event for each move
    /*internal*/ void RestoreLiveSortingByInsertionSort(Action<NotifyCollectionChangedEventArgs,int,int> RaiseMoveEvent) 
    {
        // the collection view suppresses some actions while we're restoring sorted order
        _isRestoringLiveSorting = true;
        _root.RestoreLiveSortingByInsertionSort(RaiseMoveEvent); 
        _isRestoringLiveSorting = false;
    } 

    // Add an item to the filtered list
    /*internal*/ void AddFilteredItem(Object item) 
    {
        LiveShapingItem lsi = new LiveShapingItem(item, this, true) { FailsFilter = true };
        _filterRoot.Insert(_filterRoot.Count, lsi);
    } 

    // Add an item to the filtered list 
    /*internal*/ void AddFilteredItem(LiveShapingItem lsi) 
    {
        InitializeItem(lsi, lsi.Item, true, false); 
        lsi.FailsFilter = true;
        _filterRoot.Insert(_filterRoot.Count, lsi);
    }

    // if item appears on the filtered list, set its LSI's starting index
    // to the given value.  This supports duplicate items in the original list; 
    // when a property changes, all the duplicates may become un-filtered at 
    // the same time, and we need to insert the copies at different places.
    /*internal*/ void SetStartingIndexForFilteredItem(Object item, int value) 
    {
        for/*each*/ (LiveShapingItem lsi : _filterDirtyItems)
        {
            if (Object.Equals(item, lsi.Item)) 
            {
                lsi.StartingIndex = value; 
                return; 
            }
        } 
    }

    // Remove an item from the filtered list
    /*internal*/ void RemoveFilteredItem(LiveShapingItem lsi) 
    {
        _filterRoot.RemoveAt(_filterRoot.IndexOf(lsi)); 
        ClearItem(lsi); 
    }

    // Remove an item from the filtered list
    /*internal*/ void RemoveFilteredItem(Object item)
    {
        LiveShapingItem lsi = _filterRoot.FindItem(item); 
        if (lsi != null)
        { 
            RemoveFilteredItem(lsi); 
        }
    } 

    // Replace an item in the filtered list
    /*internal*/ void ReplaceFilteredItem(Object oldItem, Object newItem)
    { 
        LiveShapingItem lsi = _filterRoot.FindItem(oldItem);
        if (lsi != null) 
        { 
            ClearItem(lsi);
            InitializeItem(lsi, newItem, true, false); 
        }
    }

    // Find a given LiveShapingItem 
    /*internal*/ int IndexOf(LiveShapingItem lsi)
    { 
        return _root.IndexOf(lsi); 
    }


    // initialize a new LiveShapingItem
    /*internal*/ void InitializeItem(LiveShapingItem lsi, Object item, boolean filtered, boolean oneTime)
    { 
        lsi.Item = item;

        if (!filtered) 
        {
            for/*each*/ (LivePropertyInfo info : _sortInfos) 
            {
                lsi.SetBinding(info.Path, info.Property, oneTime, true);
            }
            for/*each*/ (LivePropertyInfo info : _groupInfos) 
            {
                lsi.SetBinding(info.Path, info.Property, oneTime); 
            } 
        }

        for/*each*/ (LivePropertyInfo info : _filterInfos)
        {
            lsi.SetBinding(info.Path, info.Property, oneTime);
        } 

        lsi.ForwardChanges = !oneTime; 
    } 


    // clear a LiveShapingItem
    /*internal*/ void ClearItem(LiveShapingItem lsi)
    {
        lsi.ForwardChanges = false; 

        for/*each*/ (DependencyProperty dp : ObservedProperties.Values) 
        { 
            BindingOperations.ClearBinding(lsi, dp);
        } 
    }


    String NormalizePath(String path) 
    {
        return String.IsNullOrEmpty(path) ? String.Empty : path; 
    } 


    /*internal*/ void OnItemPropertyChanged(LiveShapingItem lsi, DependencyProperty dp)
    {
        if (ContainsDP(_sortInfos, dp) && !lsi.FailsFilter && !lsi.IsSortPendingClean)
        { 
            lsi.IsSortDirty = true;
            lsi.IsSortPendingClean = true; 
            _sortDirtyItems.Add(lsi); 
            OnLiveShapingDirty();

//            #if DEBUG
            _root.CheckSort = false;
//            #endif
        } 

        if (ContainsDP(_filterInfos, dp) && !lsi.IsFilterDirty) 
        { 
            lsi.IsFilterDirty = true;
            _filterDirtyItems.Add(lsi); 
            OnLiveShapingDirty();
        }

        if (ContainsDP(_groupInfos, dp) && !lsi.FailsFilter && !lsi.IsGroupDirty) 
        {
            lsi.IsGroupDirty = true; 
            _groupDirtyItems.Add(lsi); 
            OnLiveShapingDirty();
        } 
    }

    // called when a property change affecting lsi occurs on a foreign thread
    /*internal*/ void OnItemPropertyChangedCrossThread(LiveShapingItem lsi, DependencyProperty dp) 
    {
        // we only care about DPs that affect sorting, when a custom sort is in 
        // effect.  In that case, we must mark the item as dirty so that it doesn't 
        // participate in comparisons.
        // For all other cases, we can wait until the change arrives on the UI 
        // thread.   This is even true for sorting, when using the SortFieldComparer,
        // because in that case the comparisons use the lsi's cached property values
        // which don't change until the UI thread gets the underlying item's
        // property-change. 

        if (_isCustomSorting && ContainsDP(_sortInfos, dp) && !lsi.FailsFilter) 
        { 
            lsi.IsSortDirty = true;

//            #if DEBUG
            _root.CheckSort = false;
//            #endif
        } 
    }

    /*internal*/ /*event*/ EventHandler LiveShapingDirty; 

    void OnLiveShapingDirty() 
    {
        if (LiveShapingDirty != null)
            LiveShapingDirty(this, EventArgs.Empty);
    } 

    boolean ContainsDP(LivePropertyInfo[] infos, DependencyProperty dp) 
    { 
        for (int k=0; k<infos.Length; ++k)
        { 
            if (infos[k].Property == dp ||
                (dp == null && String.IsNullOrEmpty(infos[k].Path)))
            {
                return true; 
            }
        } 

        return false;
    } 

    /*internal*/ void FindPosition(LiveShapingItem lsi, /*out*/ int oldIndex, /*out*/ int newIndex)
    {
        _root.FindPosition(lsi, /*out*/ oldIndex, /*out*/ newIndex); 
    }

    /*internal*/ List<LiveShapingItem> SortDirtyItems { get { return _sortDirtyItems; } } 
    /*internal*/ List<LiveShapingItem> FilterDirtyItems { get { return _filterDirtyItems; } }
    /*internal*/ List<LiveShapingItem> GroupDirtyItems { get { return _groupDirtyItems; } } 

    /*internal*/ LiveShapingItem ItemAt(int index) { return _root[index]; }

    /*internal*/ boolean IsRestoringLiveSorting { get { return _isRestoringLiveSorting; } } 

//    #region IList Members 

    public int Add(Object value)
    { 
        Insert(Count, value);
        return Count;
    }

    public void Clear()
    { 
        ForEach( (x) => { ClearItem(x); } ); 
        _root = new LiveShapingTree(this);
    } 

    public boolean Contains(Object value)
    {
        return (IndexOf(value) >= 0); 
    }

    public int IndexOf(Object value) 
    {
        int result = 0; 
        ForEachUntil( (x) =>
            {
                if (Object.Equals(value, x.Item))
                    return true; 
                ++ result;
                return false; 
            }); 
        return (result < Count) ? result : -1;
    } 

    public void Insert(int index, Object value)
    {
        _root.Insert(index, new LiveShapingItem(value, this)); 
    }

    public boolean IsFixedSize 
    {
        get { return false; } 
    }

    public boolean IsReadOnly
    { 
        get { return false; }
    } 

    public void Remove(Object value)
    { 
        int index = IndexOf(value);
        if (index >= 0)
        {
            RemoveAt(index); 
        }
    } 

    public void RemoveAt(int index)
    { 
        LiveShapingItem lsi = _root[index];
        _root.RemoveAt(index);
        ClearItem(lsi);
        lsi.IsDeleted = true; 
    }

    public Object this[int index] 
    {
        get 
        {
            return _root[index].Item;
        }
        set 
        {
            _root.ReplaceAt(index, value); 
        } 
    }

//    #endregion

//    #if LiveShapingInstrumentation

    public void ResetComparisons()
    { 
        _comparisons = 0; 
    }

    public void ResetCopies()
    {
        _root.ResetCopies();
    } 

    public void ResetAverageCopy() 
    { 
        _root.ResetAverageCopy();
    } 

    public int GetComparisons()
    {
        return _comparisons; 
    }

    public int GetCopies() 
    {
        return _root.GetCopies(); 
    }

    public double GetAverageCopy()
    { 
        return _root.GetAverageCopy();
    } 

    int _comparisons;

//    #endif // LiveShapingInstrumentation

//    #region ICollection Members

    public void CopyTo(Array array, int index)
    { 
        throw new NotImplementedException(); 
    }

    public int Count
    {
        get { return _root.Count; }
    } 

    public boolean IsSynchronized 
    { 
        get { return false; }
    } 

    public Object SyncRoot
    {
        get { return null; } 
    }

//    #endregion 

//    #region IEnumerable Members 

    public IEnumerator GetEnumerator()
    {
        return new ItemEnumerator(_root.GetEnumerator()); 
    }

//    #endregion 

//    #region Private Methods 

    void ForEach(Action<LiveShapingItem> action)
    {
        _root.ForEach(action); 
    }

    void ForEachUntil(Func<LiveShapingItem, Boolean> action) 
    {
        _root.ForEachUntil(action); 
    }

//    #endregion

//    #region Debugging
//    #if DEBUG 

    /*internal*/ boolean VerifyLiveSorting(LiveShapingItem lsi)
    { 
        if (lsi == null)
        {   // the list should now be fully sorted again
            _root.CheckSort = true;
            return _root.Verify(_root.Count); 
        }
        else 
        { 
            return _root.VerifyPosition(lsi);
        } 
    }

//    #else
    /*internal*/public boolean VerifyLiveSorting(LiveShapingItem lsi) { return true; } 
//    #endif // DEBUG
//    #endregion Debugging 

//    #region Private Types

    class DPFromPath extends Dictionary<String, DependencyProperty>
    {
        public void BeginReset()
        { 
            _unusedKeys = new List<String>(this.Keys);
            _dpIndex = 0; 
        } 

        public void EndReset() 
        {
            for/*each*/ (String s : _unusedKeys)
            {
                Remove(s); 
            }

            _unusedKeys = null; 
        }

        public DependencyProperty GetDP(String path)
        {
            DependencyProperty dp;

            if (TryGetValue(path, /*out*/ dp))
            { 
                // we've seen this path before - use the same DP 
                _unusedKeys.Remove(path);
                return dp; 
            }
            else
            {
                // for a new path, get an unused DP 
                ICollection<DependencyProperty> usedDPs = this.Values;
                for (; _dpIndex < s_dpList.Count; ++_dpIndex) 
                { 
                    dp = s_dpList[_dpIndex];
                    if (!usedDPs.Contains(dp)) 
                    {
                        this[path] = dp;
                        return dp;
                    } 
                }

                // no unused DPs available - allocate a new DP 
                /*lock*/synchronized (s_/*[....]*/)
                { 
                    dp = DependencyProperty.RegisterAttached(
                        String.Format(System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS,
                                        "LiveSortingTargetProperty{0}",
                                        s_dpList.Count), 
                        typeof(Object),
                        typeof(LiveShapingList)); 

                    s_dpList.Add(dp);
                } 

                this[path] = dp;
                return dp;
            } 
        }

        List<String> _unusedKeys; 
        int         _dpIndex;
    } 

    class ItemEnumerator implements IEnumerator
    {
        public ItemEnumerator(IEnumerator<LiveShapingItem> ie) 
        {
            _ie = ie; 
        } 

        public void /*IEnumerator.*/Reset() 
        {
            _ie.Reset();
        }

        public boolean /*IEnumerator.*/MoveNext()
        { 
            return _ie.MoveNext(); 
        }

        public Object /*IEnumerator.*/Current
        {
            get { return _ie.Current.Item; }
        } 

        IEnumerator<LiveShapingItem> _ie; 
    } 

//    #endregion 

//    #region Private Data

    ICollectionViewLiveShaping  _view;          // my owner 
    DPFromPath                  _dpFromPath;    // map of Path -> DP
    LivePropertyInfo[]          _compInfos;     // properties for comparing 
    LivePropertyInfo[]          _sortInfos;     // properties for sorting 
    LivePropertyInfo[]          _filterInfos;   // properties for filtering
    LivePropertyInfo[]          _groupInfos;    // properties for grouping 
    IComparer                   _comparer;      // comparer - for sort/search

    LiveShapingTree             _root;          // root of the balanced tree
    LiveShapingTree             _filterRoot;    // root of tree for filtered items 

    List<LiveShapingItem>       _sortDirtyItems;    // list of items needing sorting fixup 
    List<LiveShapingItem>       _filterDirtyItems;  // list of items needing filtering fixup 
    List<LiveShapingItem>       _groupDirtyItems;   // list of items needing grouping fixup

    boolean                        _isRestoringLiveSorting;    // true while restoring order
    boolean                        _isCustomSorting;   // true if not using SortFieldComparer

    static List<DependencyProperty> s_dpList = new List<DependencyProperty>(); 
                                    // static list of DPs, shared by all instances of lists
    static Object               s_/*[....]*/ = new Object();  // lock for s_dpList 

//    #endregion
} 