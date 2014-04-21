/**
 * LiveShapingList
 */
/*
    A collection view that does live shaping needs to support the following operations:
        1. Initialize from raw list of items 
        2. Sort, according to the view's comparer
        3. Filter, according to the view's filter predicate 
        4. Listen for changes to properties in the LiveShapingProperties lists 
        5. Maintain a list of dirty items (whose properties have changed)
        6. Move dirty items to their correct position (making them clean) 
        7. Expose the items as an IList (obeying the desired shaping)
        8. Raise CollectionChanged events to inform the view's clients

    This data structure helps do all of this.   It has the following features: 

    A) A list of LiveShapingItems, one for each item in the source collection 
    that pass the view's filter (if any).   This list is implemented as a 
    set of LiveShapingBlocks, each holding a bounded number of LSItems, that are
    glued together as a balanced tree with order statistics.  The capacity of a block 
    was chosen by experiment, to achieve a good tradeoff between low-overhead
    O(capacity) array-based operations within a block, and higher-overhead O(log N)
    operations of a balanced tree.  So it's fast for most individual changes,
    but still scales well when the data set is large. 

    B) A second list, for the items that don't pass the filter.   This list is only 
    needed when live filtering is enabled.   A property change can cause an item to 
    move from one list to the other.
 
    C) Fingers into the list.  A finger knows its position.  When the list moves LSItems
    between blocks, the active fingers stick to their positions.

    D) Each LSItem listens to the relevant property-change events, and notifies the 
    view.
*/ 
define(["dojo/_base/declare", "system/Type", "collections/IList", "generic/Dictionary",
        "collections/IEnumerator", "generic/List"], 
		function(declare, Type, IList, Dictionary,
				IEnumerator, List){
//  static List<DependencyProperty> 
	var s_dpList = new List/*<DependencyProperty>*/(); 
	
//    internal struct 
	var LivePropertyInfo = declare(Object, 
    {
        constructor:function(/*string*/ path, /*DependencyProperty*/ dp) 
        { 
            this._path = path;
            this._dp = dp; 
        },

//        string _path;
//        DependencyProperty _dp; 

    });
	
	Object.defineProperties(LivePropertyInfo.prototype, {
//        public string 
		Path: { get:function() { return this._path; } },
//        public DependencyProperty 
		Property: { get:function() { return this._dp; } } 
	});
 
//    internal enum 
	var LiveShapingFlags = declare(Object, {});
	LiveShapingFlags.Sorting     = 0x0001, 
	LiveShapingFlags.Filtering   = 0x0002,
	LiveShapingFlags.Grouping    = 0x0004;
	
//	class 
	var DPFromPath = declare(Dictionary/*<String, DependencyProperty>*/,
    {
//        public void 
		BeginReset:function()
        { 
            this._unusedKeys = new List/*<string>*/(this.Keys);
            this._dpIndex = 0; 
        }, 

//        public void 
        EndReset:function() 
        {
            for(var i=0; i<this._unusedKeys.Count; i++) //foreach (string s in _unusedKeys)
            {
            	var s = this._unusedKeys.Get(i);
                this.Remove(s); 
            }

            this._unusedKeys = null; 
        },

//        public DependencyProperty 
        GetDP:function(/*string*/ path)
        {
            
            var dpOut = {"dp" : null};
            var result = TryGetValue(path, /*out dp*/dpOut);
            /*DependencyProperty*/var dp = dpOut.dp;
            if (result)
            	
            { 
                // we've seen this path before - use the same DP 
            	this._unusedKeys.Remove(path);
                return dp; 
            }
            else
            {
                // for a new path, get an unused DP 
                /*ICollection<DependencyProperty>*/var usedDPs = this.Values;
                for (; this._dpIndex < s_dpList.Count; ++this._dpIndex) 
                { 
                    dp = s_dpList.Get(this._dpIndex);
                    if (!usedDPs.Contains(dp)) 
                    {
                        this.Set(path, dp);
                        return dp;
                    } 
                }

                // no unused DPs available - allocate a new DP 
//                lock (s_[....])
//                { 
                    dp = DependencyProperty.RegisterAttached(
                        String.Format(System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS,
                                        "LiveSortingTargetProperty{0}",
                                        s_dpList.Count), 
                        typeof(object),
                        typeof(LiveShapingList)); 

                    s_dpList.Add(dp);
//                } 

                this.Set(path, dp);
                return dp;
            } 
        }

//        List<string> _unusedKeys; 
//        int         _dpIndex;
    });

//    class 
	var ItemEnumerator =declare(IEnumerator, 
    {
        constructor:function(/*IEnumerator<LiveShapingItem>*/ ie) 
        {
            this._ie = ie; 
        }, 

//        void IEnumerator.
        Reset:function() 
        {
            this._ie.Reset();
        },

//        bool IEnumerator.
        MoveNext:function()
        { 
            return this._ie.MoveNext(); 
        }
//        IEnumerator<LiveShapingItem> _ie; 
    });
	
	Object.defineProperties(ItemEnumerator.prototype, {
//        object IEnumerator.
		Current:
        {
            get:function() { return this._ie.Current.Item; }
        } 
	});
    
	
    // static list of DPs, shared by all instances of lists
	var LiveShapingList = declare("LiveShapingList", IList,{
		constructor:function(/*ICollectionViewLiveShaping*/ view, /*LiveShapingFlags*/ flags, /*IComparer*/ comparer)
        {
            this._view = view; 
            this._comparer = comparer;
            this._isCustomSorting = !(comparer instanceof SortFieldComparer); 
            this._dpFromPath = new DPFromPath(); 
            this._root = new LiveShapingTree(this);
 
            if (comparer != null)
            	this._root.Comparison = this.CompareLiveShapingItems;

            this._sortDirtyItems = new List/*<LiveShapingItem>*/(); 
            this._filterDirtyItems = new List/*<LiveShapingItem>*/();
            this._groupDirtyItems = new List/*<LiveShapingItem>*/(); 
 
//            int 
            this._comparisons = 0;
//            LivePropertyInfo[]          _compInfos;     // properties for comparing 
//            LivePropertyInfo[]          _sortInfos;     // properties for sorting 
//            LivePropertyInfo[]          _filterInfos;   // properties for filtering
//            LivePropertyInfo[]          _groupInfos;    // properties for grouping 
//            LiveShapingTree             
            this._filterRoot = null;    // root of tree for filtered items 
//            bool                        
            this._isRestoringLiveSorting = false;    // true while restoring order
            
            this.SetLiveShapingProperties(flags);
            
		},
		// reset the collections of properties to observe, and their 
        // corresponding DPs
//        internal void 
		SetLiveShapingProperties:function(/*LiveShapingFlags*/ flags)
        {
            var k, n; 
            /*string*/var path;
 
            this._dpFromPath.BeginReset(); 

            // Sorting // 

            // get the properties used for comparison
            /*SortDescriptionCollection*/var sdc = this.View.SortDescriptions;
            n = sdc.Count; 
            this._compInfos = []; //new LivePropertyInfo[n];
            for (k=0; k<n; ++k) 
            { 
                path = this.NormalizePath(sdc.Get(k).PropertyName);
                this._compInfos[k] = new LivePropertyInfo(path, this._dpFromPath.GetDP(path)); 
            }


            if (this.TestLiveShapingFlag(flags, LiveShapingFlags.Sorting)) 
            {
                // get the list of property paths to observe 
                /*Collection<string>*/var sortProperties = View.LiveSortingProperties; 

                if (sortProperties.Count == 0) 
                {
                    // use the sort description properties
                	this._sortInfos = this._compInfos;
                } 
                else
                { 
                    // use the explicit list of properties 
                    n = sortProperties.Count;
                    this._sortInfos = []; //new LivePropertyInfo[n]; 
                    for (k=0; k<n; ++k)
                    {
                        path = this.NormalizePath(sortProperties.Get(k));
                        this._sortInfos[k] = new LivePropertyInfo(path, this._dpFromPath.GetDP(path)); 
                    }
                } 
            } 
            else
            { 
            	this._sortInfos = []; //new LivePropertyInfo[0];
            }

 
            // Filtering //
 
            if (this.TestLiveShapingFlag(flags, LiveShapingFlags.Filtering)) 
            {
                // get the list of property paths to observe 
                /*Collection<string>*/var filterProperties = this.View.LiveFilteringProperties;
                n = filterProperties.Count;
                this._filterInfos = []; //new LivePropertyInfo[n];
                for (k=0; k<n; ++k) 
                {
                    path = NormalizePath(filterProperties[k]); 
                    this._filterInfos.Set(k, new LivePropertyInfo(path, this._dpFromPath.GetDP(path))); 
                }
 
                this._filterRoot = new LiveShapingTree(this);
            }
            else
            { 
                this._filterInfos = []; //new LivePropertyInfo[0];
                this._filterRoot = null; 
            } 

 
            // Grouping //

            if (TestLiveShapingFlag(flags, LiveShapingFlags.Grouping))
            { 
                // get the list of property paths to observe
                /*Collection<string>*/var groupingProperties = this.View.LiveGroupingProperties; 
 
                if (groupingProperties.Count == 0)
                { 
                    // if no explicit list, use the group description properties
                    groupingProperties = new Collection/*<string>*/();
                    /*ICollectionView*/var icv = this.View instanceof ICollectionView ? this.View : null;
                    /*ObservableCollection<GroupDescription>*/var groupDescriptions = (icv != null) ? icv.GroupDescriptions : null; 

                    if (groupDescriptions != null) 
                    { 
                        for(var i=0; i<groupDescriptions.Count; i++) //foreach (GroupDescription gd in groupDescriptions)
                        { 
                        	var gd = groupDescriptions.Get(i);
                            /*PropertyGroupDescription*/var pgd = gd instanceof PropertyGroupDescription ? gd : null;
                            if (pgd != null)
                            {
                                groupingProperties.Add(pgd.PropertyName); 
                            }
                        } 
                    } 
                }
 
                n = groupingProperties.Count;
                this._groupInfos = []; //new LivePropertyInfo[n];
                for (k=0; k<n; ++k)
                { 
                    path = NormalizePath(groupingProperties.Get(k));
                    this._groupInfos.Set(k, new LivePropertyInfo(path, _dpFromPath.GetDP(path))); 
                } 
            }
            else 
            {
            	this._groupInfos = []; //new LivePropertyInfo[0];
            }
 
            this._dpFromPath.EndReset();
        },
 
//        bool 
        TestLiveShapingFlag:function(/*LiveShapingFlags*/ flags, /*LiveShapingFlags*/ flag)
        { 
            return (flags & flag) != 0;
        },

        // Search for value in the slice of the list starting at index with length count, 
        // using the given comparer.  The list is assumed to be sorted w.r.t. the
        // comparer.  Return the index if found, or the bit-complement 
        // of the index where it would belong. 
//        internal int 
        Search:function(/*int*/ index, /*int*/ count, /*object*/ value)
        { 
            /*LiveShapingItem*/var temp = new LiveShapingItem(value, this, true, null, true);
            /*RBFinger<LiveShapingItem>*/var finger = this._root.BoundedSearch(temp, index, index+count);
            this.ClearItem(temp);
 
            return finger.Found ? finger.Index : ~finger.Index;
        }, 
 
        // Sort the list, using the comparer supplied at creation
//        internal void 
        Sort:function() 
        {
        	this._root.Sort();
        },
 
//        internal int 
        CompareLiveShapingItems:function(/*LiveShapingItem*/ x, /*LiveShapingItem*/ y)
        { 
//            #if LiveShapingInstrumentation 
//            ++_comparisons;
//            #endif 

            if (x == y || Object.Equals(x.Item, y.Item))
                return 0;
 
            var result = 0;
 
            if (!this._isCustomSorting) 
            {
                // intercept SortFieldComparer, and do the comparisons here. 
                // The LiveShapingItems will cache the field values.
                /*SortFieldComparer*/var sfc = this._comparer instanceof SortFieldComparer ? this._comparer : null;
                /*SortDescriptionCollection*/var sdc = this.View.SortDescriptions;
//                Debug.Assert(sdc.Count >= _compInfos.Length, "SortDescriptions don't match LivePropertyInfos"); 
                var n = this._compInfos.Length;
 
                for (var k=0; k<n; ++k) 
                {
                    var v1 = x.GetValue(this._compInfos[k].Path, this._compInfos[k].Property); 
                    var v2 = y.GetValue(this._compInfos[k].Path, this._compInfos[k].Property);

                    result = sfc.BaseComparer.Compare(v1, v2);
                    if (sdc.Get(k).Direction == ListSortDirection.Descending) 
                        result = -result;
 
                    if (result != 0) 
                        break;
                } 
            }
            else
            {
                // for custom comparers, just compare items the normal way 
                result = this._comparer.Compare(x.Item, y.Item);
            } 
 
            return result;
        }, 

        // Move an item from one position to another
//        internal void 
        Move:function(/*int*/ oldIndex, /*int*/ newIndex)
        { 
        	this._root.Move(oldIndex, newIndex);
        }, 
 
        // Restore sorted order by insertion sort, raising an event for each move
//        internal void 
        RestoreLiveSortingByInsertionSort:function(/*Action<NotifyCollectionChangedEventArgs,int,int>*/ RaiseMoveEvent) 
        {
            // the collection view suppresses some actions while we're restoring sorted order
        	this._isRestoringLiveSorting = true;
        	this._root.RestoreLiveSortingByInsertionSort(RaiseMoveEvent); 
        	this._isRestoringLiveSorting = false;
        },
 
        // Add an item to the filtered list
//        internal void 
        AddFilteredItem:function(/*object*/ item) 
        {
            /*LiveShapingItem*/var lsi = new LiveShapingItem(item, this, true);
//            { this.FailsFilter = true };
            lsi.FailsFilter = true;
            
            this._filterRoot.Insert(this._filterRoot.Count, lsi);
        }, 

        // Add an item to the filtered list 
//        internal void 
        AddFilteredItem:function(/*LiveShapingItem*/ lsi) 
        {
        	this.InitializeItem(lsi, lsi.Item, true, false); 
            lsi.FailsFilter = true;
            this._filterRoot.Insert(this._filterRoot.Count, lsi);
        },
 
        // if item appears on the filtered list, set its LSI's starting index
        // to the given value.  This supports duplicate items in the original list; 
        // when a property changes, all the duplicates may become un-filtered at 
        // the same time, and we need to insert the copies at different places.
//        internal void 
        SetStartingIndexForFilteredItem:function(/*object*/ item, /*int*/ value) 
        {
        	for(var i=0; i<this._filterDirtyItems.Count; i++) //foreach (LiveShapingItem lsi in _filterDirtyItems)
            {
        		var lsi = this._filterDirtyItems.Get(i);
                if (Object.Equals(item, lsi.Item)) 
                {
                    lsi.StartingIndex = value; 
                    return; 
                }
            } 
        },

        // Remove an item from the filtered list
//        internal void 
        RemoveFilteredItem:function(/*LiveShapingItem*/ lsi) 
        {
        	this._filterRoot.RemoveAt(this._filterRoot.IndexOf(lsi)); 
        	this.ClearItem(lsi); 
        },
 
        // Remove an item from the filtered list
//        internal void 
        RemoveFilteredItem:function(/*object*/ item)
        {
            /*LiveShapingItem*/var lsi = this._filterRoot.FindItem(item); 
            if (lsi != null)
            { 
            	this.RemoveFilteredItem(lsi); 
            }
        }, 

        // Replace an item in the filtered list
//        internal void 
        ReplaceFilteredItem:function(/*object*/ oldItem, /*object*/ newItem)
        { 
            /*LiveShapingItem*/var lsi = this._filterRoot.FindItem(oldItem);
            if (lsi != null) 
            { 
            	this.ClearItem(lsi);
            	this.InitializeItem(lsi, newItem, true, false); 
            }
        },

        // Find a given LiveShapingItem 
//        internal int 
        IndexOf:function(/*LiveShapingItem*/ lsi)
        { 
            return this._root.IndexOf(lsi); 
        },
 

        // initialize a new LiveShapingItem
//        internal void 
        InitializeItem:function(/*LiveShapingItem*/ lsi, /*object*/ item, /*bool*/ filtered, /*bool*/ oneTime)
        { 
            lsi.Item = item;
 
            if (!filtered) 
            {
            	for(var i=0; i<this._sortInfos.Count; i++) //foreach (LivePropertyInfo info in _sortInfos) 
                {
            		var info = this._sortInfos.Get(i);
                    lsi.SetBinding(info.Path, info.Property, oneTime, true);
                }
            	for(var i=0; i<this._groupInfos.Count; i++) //foreach (LivePropertyInfo info in _groupInfos) 
                {
            		var info = this._groupInfos.Get(i);
                    lsi.SetBinding(info.Path, info.Property, oneTime); 
                } 
            }
 
            for(var i=0; i<this._filterInfos.Count; i++) //foreach (LivePropertyInfo info in _filterInfos)
            {
            	var info = this._filterInfos.Get(i);
                lsi.SetBinding(info.Path, info.Property, oneTime);
            } 

            lsi.ForwardChanges = !oneTime; 
        }, 

 
        // clear a LiveShapingItem
//        internal void 
        ClearItem:function(/*LiveShapingItem*/ lsi)
        {
            lsi.ForwardChanges = false; 

            for(var i=0; i<this.ObservedProperties.Values.Count; i++) //foreach (DependencyProperty dp in ObservedProperties.Values) 
            { 
            	var dp = this.ObservedProperties.Values.Get(i);
                BindingOperations.ClearBinding(lsi, dp);
            } 
        },


//        string 
        NormalizePath:function(/*string*/ path) 
        {
            return String.IsNullOrEmpty(path) ? String.Empty : path; 
        }, 

 
//        internal void 
        OnItemPropertyChanged:function(/*LiveShapingItem*/ lsi, /*DependencyProperty*/ dp)
        {
            if (this.ContainsDP(this._sortInfos, dp) && !lsi.FailsFilter && !lsi.IsSortPendingClean)
            { 
                lsi.IsSortDirty = true;
                lsi.IsSortPendingClean = true; 
                this._sortDirtyItems.Add(lsi); 
                this.OnLiveShapingDirty();
 
//                #if DEBUG
//                _root.CheckSort = false;
//                #endif
            } 

            if (this.ContainsDP(this._filterInfos, dp) && !lsi.IsFilterDirty) 
            { 
                lsi.IsFilterDirty = true;
                this._filterDirtyItems.Add(lsi); 
                this.OnLiveShapingDirty();
            }

            if (this.ContainsDP(this._groupInfos, dp) && !lsi.FailsFilter && !lsi.IsGroupDirty) 
            {
                lsi.IsGroupDirty = true; 
                this._groupDirtyItems.Add(lsi); 
                this.OnLiveShapingDirty();
            } 
        },

        // called when a property change affecting lsi occurs on a foreign thread
//        internal void 
        OnItemPropertyChangedCrossThread:function(/*LiveShapingItem*/ lsi, /*DependencyProperty*/ dp) 
        {
            // we only care about DPs that affect sorting, when a custom sort is in 
            // effect.  In that case, we must mark the item as dirty so that it doesn't 
            // participate in comparisons.
            // For all other cases, we can wait until the change arrives on the UI 
            // thread.   This is even true for sorting, when using the SortFieldComparer,
            // because in that case the comparisons use the lsi's cached property values
            // which don't change until the UI thread gets the underlying item's
            // property-change. 

            if (this._isCustomSorting && ContainsDP(this._sortInfos, dp) && !lsi.FailsFilter) 
            { 
                lsi.IsSortDirty = true;
 
//                #if DEBUG
//                _root.CheckSort = false;
//                #endif
            } 
        },

//        void 
        OnLiveShapingDirty:function() 
        {
            if (this.LiveShapingDirty != null)
                this.LiveShapingDirty.Invoke(this, EventArgs.Empty);
        }, 

//        bool 
        ContainsDP:function(/*LivePropertyInfo[]*/ infos, /*DependencyProperty*/ dp) 
        { 
            for (var k=0; k<infos.length; ++k)
            { 
                if (infos[k].Property == dp ||
                    (dp == null && String.IsNullOrEmpty(infos[k].Path)))
                {
                    return true; 
                }
            } 
 
            return false;
        }, 

//        internal void 
        FindPosition:function(/*LiveShapingItem*/ lsi, /*out int oldIndex*/oldIndexOut, /*out int newIndex*/newIndexOut)
        {
        	this._root.FindPosition(lsi, /*out oldIndex*/oldIndexOut, /*out newIndex*/newIndexOut); 
        },
//        internal LiveShapingItem 
        ItemAt:function(/*int*/ index) { return this._root.Get(index); },

        
//        public int 
        Add:function(/*object*/ value)
        { 
        	this.Insert(Count, value);
            return Count;
        },
 
//        public void 
        Clear:function()
        { 
            this.ForEach( /*(x) =>*/function(x) { this.ClearItem(x); } ); 
            this._root = new LiveShapingTree(this);
        }, 

//        public bool 
        Contains:function(/*object*/ value)
        {
            return (this.IndexOf(value) >= 0); 
        },
 
//        public int 
        IndexOf:function(/*object*/ value) 
        {
            var result = 0; 
            ForEachUntil( /*(x) =>*/function(x)
                {
                    if (Object.Equals(value, x.Item))
                        return true; 
                    ++ result;
                    return false; 
                }); 
            return (result < Count) ? result : -1;
        }, 

//        public void 
        Insert:function(/*int*/ index, /*object*/ value)
        {
        	this._root.Insert(index, new LiveShapingItem(value, this)); 
        },
 
//        public void 
        Remove:function(/*object*/ value)
        { 
            var index = this.IndexOf(value);
            if (index >= 0)
            {
            	this.RemoveAt(index); 
            }
        }, 
 
//        public void 
        RemoveAt:function(/*int*/ index)
        { 
            /*LiveShapingItem*/var lsi = this._root.Get(index);
            this._root.RemoveAt(index);
            this.ClearItem(lsi);
            lsi.IsDeleted = true; 
        },
//        public object this[int index] 
//    	{
//
//	    },
        Get:function(index) 
        {
            return this._root.Get(index).Item;
        },
        Set:function(index, value) 
        {
        	this._root.ReplaceAt(index, value); 
        },
//	    public void 
        ResetComparisons:function()
        { 
            this._comparisons = 0; 
        },
 
//        public void 
        ResetCopies:function()
        {
        	this._root.ResetCopies();
        }, 

//        public void 
        ResetAverageCopy:function() 
        { 
        	this._root.ResetAverageCopy();
        }, 

//        public int 
        GetComparisons:function()
        {
            return this._comparisons; 
        },
 
//        public int
        GetCopies:function() 
        {
            return this._root.GetCopies(); 
        },

//        public double 
        GetAverageCopy:function()
        { 
            return this._root.GetAverageCopy();
        },
//        public void 
        CopyTo:function(/*Array*/ array, /*int*/ index)
        { 
            throw new NotImplementedException(); 
        },
 
//        public IEnumerator 
        GetEnumerator:function()
        {
            return new ItemEnumerator(this._root.GetEnumerator()); 
        },

//        void 
        ForEach:function(/*Action<LiveShapingItem>*/ action)
        {
        	this._root.ForEach(action); 
        },
 
//        void 
        ForEachUntil:function(/*Func<LiveShapingItem, bool>*/ action) 
        {
        	this._root.ForEachUntil(action); 
        },

//        internal bool 
        VerifyLiveSorting:function(/*LiveShapingItem*/ lsi) { return true; } 
        
	});
	
	Object.defineProperties(LiveShapingList.prototype,{
//        internal ICollectionViewLiveShaping 
		View: { get:function() { return this._view; } }, 
//        internal Dictionary<string, DependencyProperty> 
		ObservedProperties: 
        {
            get:function() { return this._dpFromPath; }, 
        },
//        internal event EventHandler 
        LiveShapingDirty:{
        	get:function(){
        		if(this._LiveShapingDirty === undefined){
        			this._LiveShapingDirty = new EventHandler();
        		}
        		
        		return this._LiveShapingDirty;
        	}
        },
        
//        internal List<LiveShapingItem> 
        SortDirtyItems: { get:function() { return this._sortDirtyItems; } }, 
//        internal List<LiveShapingItem> 
        FilterDirtyItems: { get:function() { return this._filterDirtyItems; } },
//        internal List<LiveShapingItem> 
        GroupDirtyItems: { get:function() { return this._groupDirtyItems; } }, 
//        internal bool 
        IsRestoringLiveSorting: { get:function() { return this._isRestoringLiveSorting; } }, 
//        public bool 
        IsFixedSize: 
        {
            get:function() { return false; } 
        },

//        public bool 
        IsReadOnly:
        { 
            get:function() { return false; }
        },
//        public int 
        Count:
        {
            get:function() { return this._root.Count; }
        } 

	});
	
	Object.defineProperties(LiveShapingList,{
		  
	});
	
	LiveShapingList.Type = new Type("LiveShapingList", LiveShapingList, [IList.Type]);
	return LiveShapingList;
});
