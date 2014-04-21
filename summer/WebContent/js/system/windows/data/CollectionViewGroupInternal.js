/**
 * Second Check 12-10
 * CollectionViewGroupInternal
 */

define(["dojo/_base/declare", "system/Type", "data/CollectionViewGroup", "collections/IComparer",
        "componentmodel/PropertyChangedEventHandler"], 
		function(declare, Type, CollectionViewGroup, IComparer,
				PropertyChangedEventHandler){
	
	// this comparer is used to insert an item into a group in a position consistent
    // with a given IList.  It only works when used in the pattern that FindIndex 
    // uses, namely first call Reset(), then call Compare(item, x) any number of
    // times with the same item (the new item) as the first argument, and a sequence 
    // of x's as the second argument that appear in the IList in the same sequence. 
    // This makes the total search time linear in the size of the IList.  (To give
    // the correct answer regardless of the sequence of arguments would involve 
    // calling IndexOf and leads to O(N^2) total search time.)

//    internal class 
	var IListComparer =declare(IComparer, 
    { 
        constructor:function(/*IList*/ list)
        { 
            this.ResetList(list); 
        },

//        internal void 
        Reset:function()
        {
            this._index = 0;
        }, 

//        internal void 
        ResetList:function(/*IList*/ list) 
        { 
            this._list = list;
            this._index = 0; 
        },

//        public int 
        Compare:function(/*object*/ x, /*object*/ y)
        { 
            if (Object.Equals(x, y))
                return 0; 

            // advance the index until seeing one x or y
            var n = (this._list != null) ? this._list.Count : 0; 
            for (; this._index < n; ++this._index)
            {
                var z = this._list.Get(this._index);
                if (Object.Equals(x, z)) 
                {
                    return -1;  // x occurs first, so x < y 
                } 
                else if (Object.Equals(y, z))
                { 
                    return +1;  // y occurs first, so x > y
                }
            }

            // if we don't see either x or y, declare x > y.
            // This has the effect of putting x at the end of the list. 
            return + 1; 
        }

//        int _index;
//        IList _list;
    });
	
	IListComparer.Type =new Type("IListComparer", IListComparer, [IComparer.Type]);
    
//    private class 
    var LeafEnumerator =declare(IEnumerator, {
    	constructor:function(/*CollectionViewGroupInternal*/ group) 
        {
            this._group = group; 
            this.DoReset();  // don't call virtual Reset in ctor
        },
//        void IEnumerator.
        Reset:function() 
        {
            this.DoReset(); 
        },
        
//        void 
        DoReset:function() 
        {
            this._version = this._group._version;
            this._index = -1;
            this._subEnum = null; 
        },
        
//        bool IEnumerator.
        MoveNext:function() 
        {
            // check for invalidated enumerator 
            if (this._group._version != this._version)
                throw new InvalidOperationException();

            // move forward to the next leaf 
            while (this._subEnum == null || !this._subEnum.MoveNext())
            { 
                // done with the current top-level item.  Move to the next one. 
                ++ this._index;
                if (this._index >= this._group.Items.Count) 
                    return false;

                /*CollectionViewGroupInternal*/var subgroup = this._group.Items.Get(this._index);
                subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null;
                if (subgroup == null) 
                {
                    // current item is a leaf - it's the new Current 
                	this._current = this._group.Items.Get(this._index); 
                	this._subEnum = null;
                    return true; 
                }
                else
                {
                    // current item is a subgroup - get its enumerator 
                	this._subEnum = subgroup.GetLeafEnumerator();
                } 
            } 

            // the loop terminates only when we have a subgroup enumerator 
            // positioned at the new Current item
            this._current = this._subEnum.Current;
            return true;
        } 
        
    });

    Object.defineProperties(LeafEnumerator.prototype, {
//    	 object IEnumerator.
    	 Current:
         { 
             get:function()
             { 
                 if (this._index < 0  ||  this._index >= this._group.Items.Count)
                     throw new InvalidOperationException();
                 return this._current;
             } 
         }
    });

//        CollectionViewGroupInternal _group; // parent group 
//        int                 _version;   // parent group's version at ctor
//        int                 _index;     // current index into Items 
//        IEnumerator         _subEnum;   // enumerator over current subgroup
//        object              _current;   // current item
//    }
    
//	static NamedObject  
	var _nullGroupNameKey = {"name" : "NullGroupNameKey"}; // new NamedObject("NullGroupNameKey");
    
	var CollectionViewGroupInternal = declare("CollectionViewGroupInternal", CollectionViewGroup,{
		constructor:function(/*object*/ name, /*CollectionViewGroupInternal*/ parent) 
        { 
			CollectionViewGroup.prototype.constructor.call(this, name);
//			base(name);
            this._parentGroup = parent;
            
//            GroupDescription    
            this._groupBy = null; 
//            int                 
            this._fullCount = 1; 
//            int                 
            this._lastIndex = 0; 
//            int                 
            this._version = 0;       // for detecting stale enumerators
//            Hashtable           
            this._nameToGroupMap = null; // To cache the mapping between name and subgroup 
//            bool                _mapCleanupScheduled = false;
        },
        
//        internal void 
        Add:function(/*object*/ item) 
        {
            this.ChangeCounts(item, +1); 
            this.ProtectedItems.Add(item);
        },

//        internal int 
        Remove:function(/*object*/ item, /*bool*/ returnLeafIndex) 
        {
            var index = -1; 
            var localIndex = this.ProtectedItems.IndexOf(item); 

            if (localIndex >= 0) 
            {
                if (returnLeafIndex)
                {
                    index = this.LeafIndexFromItem(null, localIndex); 
                }
 
                /*CollectionViewGroupInternal*/var subGroup = item instanceof CollectionViewGroupInternal ? item : null; 
                if (subGroup != null)
                { 
                    // Remove from the name to group map.
                    this.RemoveSubgroupFromMap(subGroup);
                }
                this.ChangeCounts(item, -1); 
                this.ProtectedItems.RemoveAt(localIndex);
            } 
 
            return index;
        },

//        internal void 
        Clear:function()
        {
        	this.FullCount = 1; 
        	this.ProtectedItemCount = 0;
        	this.ProtectedItems.Clear(); 
            if (this._nameToGroupMap != null) 
            {
            	this._nameToGroupMap.Clear(); 
            }
        },

        // return the index of the given item within the list of leaves governed 
        // by this group
//        internal int 
        LeafIndexOf:function(/*object*/ item) 
        { 
            var leaves = 0;         // number of leaves we've passed over so far
            for (var k=0, n=this.Items.Count;  k<n;  ++k) 
            {
                /*CollectionViewGroupInternal*/var subgroup = this.Items.Get(k);
                subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null;
                if (subgroup != null)
                { 
                    var subgroupIndex = subgroup.LeafIndexOf(item);
                    if (subgroupIndex < 0) 
                    { 
                        leaves += subgroup.ItemCount;       // item not in this subgroup
                    } 
                    else
                    {
                        return (leaves + subgroupIndex);    // item is in this subgroup
                    } 
                }
                else 
                { 
                    // current item is a leaf - compare it directly
                    if (Object.Equals(item, this.Items.Get(k))) 
                    {
                        return leaves;
                    }
                    else 
                    {
                        leaves += 1; 
                    } 
                }
            } 

            // item not found
            return -1;
        },

        // return the index of the given item within the list of leaves governed 
        // by the full group structure.  The item must be a (direct) child of this 
        // group.  The caller provides the index of the item within this group,
        // if known, or -1 if not. 
//        internal int 
        LeafIndexFromItem:function(/*object*/ item, /*int*/ index)
        {
            var result = 0;
 
            // accumulate the number of predecessors at each level
            for (/*CollectionViewGroupInternal*/var group = this; 
                    group != null; 
                    item = group, group = group.Parent, index = -1)
            { 
                // accumulate the number of predecessors at the level of item
                for (var k=0, n=group.Items.Count;  k < n;  ++k)
                {
                    // if we've reached the item, move up to the next level 
                    if ((index < 0 && Object.Equals(item, group.Items.Get(k))) ||
                        index == k) 
                    { 
                        break;
                    } 

                    // accumulate leaf count
                    /*CollectionViewGroupInternal*/var subgroup = group.Items.Get(k);
                    subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null;
                    result += (subgroup == null) ? 1 : subgroup.ItemCount; 
                }
            } 
 
            return result;
        }, 
        
        // return the item at the given index within the list of leaves governed
        // by this group 
//        internal object 
        LeafAt:function(/*int*/ index)
        { 
            for (var k=0, n=this.Items.Count;  k<n;  ++k) 
            {
                /*CollectionViewGroupInternal*/var subgroup = this.Items.Get(k);
                subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null; 
                if (subgroup != null)
                {
                    // current item is a group - either drill in, or skip over
                    if (index < subgroup.ItemCount) 
                    {
                        return subgroup.LeafAt(index); 
                    } 
                    else
                    { 
                        index -= subgroup.ItemCount;
                    }
                }
                else 
                {
                    // current item is a leaf - see if we're done 
                    if (index == 0) 
                    {
                        return this.Items.Get(k); 
                    }
                    else
                    {
                        index -= 1; 
                    }
                } 
            } 

            // the loop should have found the index.  We shouldn't get here. 
            throw new ArgumentOutOfRangeException("index");
        },

        // return an enumerator over the leaves governed by this group 
//        internal IEnumerator 
        GetLeafEnumerator:function()
        { 
            return new LeafEnumerator(this); 
        },
 
        // insert a new item or subgroup and return its index.  Seed is a
        // representative from the subgroup (or the item itself) that
        // is used to position the new item/subgroup w.r.t. the order given
        // by the comparer.  (If comparer is null, just add at the end). 
//        internal int 
        Insert:function(/*object*/ item, /*object*/ seed, /*IComparer*/ comparer)
        { 
            // never insert the new item/group before the explicit subgroups 
            var low = (this.GroupBy == null) ? 0 : this.GroupBy.GroupNames.Count;
            var index = this.FindIndex(item, seed, comparer, low, this.ProtectedItems.Count); 

            // now insert the item
            this.ChangeCounts(item, +1);
            this.ProtectedItems.Insert(index, item); 

            return index; 
        },

//        protected virtual int 
        FindIndex:function(/*object*/ item, /*object*/ seed, /*IComparer*/ comparer, /*int*/ low, /*int*/ high) 
        {
            var index;

            if (comparer != null) 
            {
                /*IListComparer*/var ilc = comparer instanceof IListComparer ? comparer : null; 
                if (ilc != null) 
                {
                    // reset the IListComparer before each search.  This cannot be done 
                    // any less frequently (e.g. in Root.AddToSubgroups), due to the
                    // possibility that the item may appear in more than one subgroup.
                    ilc.Reset();
                } 

                for (index=low;  index < high;  ++index) 
                { 
                    /*CollectionViewGroupInternal*/var subgroup = this.ProtectedItems.Get(index);
                    subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null;
                    /*object*/var seed1 = (subgroup != null) ? subgroup.SeedItem : this.ProtectedItems.Get(index); 
                    if (seed1 == DependencyProperty.UnsetValue)
                        continue;
                    if (comparer.Compare(seed, seed1) < 0)
                        break; 
                }
            } 
            else 
            {
                index = high; 
            }

            return index;
        }, 

        // move an item and return true if it really moved. 
        // Also translate the indices to "leaf" coordinates 
//        internal bool 
        Move:function(/*object*/ item, /*IList*/ list, /*ref int oldIndex*/oldIndexRef, /*ref int newIndex*/newIndexRef)
        { 
            var oldIndexLocal = -1, newIndexLocal = -1;
            var localIndex = 0;
            var n = this.ProtectedItems.Count;
 
            // the input is in "full" coordinates.  Find the corresponding local coordinates
            for (var fullIndex=0; ; ++fullIndex) 
            { 
                if (fullIndex == oldIndex)
                { 
                    oldIndexLocal = localIndex;
                    if (newIndexLocal >= 0)
                        break;
                    ++ localIndex; 
                }
 
                if (fullIndex == newIndex) 
                {
                    newIndexLocal = localIndex; 
                    if (oldIndexLocal >= 0)
                    {
                        -- newIndexLocal;
                        break; 
                    }
                    ++ fullIndex; 
                    ++ oldIndex; 
                }
 
                if (localIndex < n && Object.Equals(this.ProtectedItems.Get(localIndex), list.Get(fullIndex)))
                    ++ localIndex;
            }
 
            // the move may be a no-op w.r.t. this group
            if (oldIndexLocal == newIndexLocal) 
                return false; 

            // translate to "leaf" coordinates 
            var low, high, lowLeafIndex, delta=0;
            if (oldIndexLocal < newIndexLocal)
            {
                low = oldIndexLocal + 1; 
                high = newIndexLocal + 1;
                lowLeafIndex = this.LeafIndexFromItem(null, oldIndexLocal); 
            } 
            else
            { 
                low = newIndexLocal;
                high = oldIndexLocal;
                lowLeafIndex = this.LeafIndexFromItem(null, newIndexLocal);
            } 

            for (var i=low; i<high; ++i) 
            { 
                /*CollectionViewGroupInternal*/
            	var subgroup = this.Items.Get(i) instanceof CollectionViewGroupInternal ? this.Items.Get(i) : null;
                delta += (subgroup == null) ? 1 : subgroup.ItemCount; 
            }

            if (oldIndexLocal < newIndexLocal)
            { 
            	oldIndexRef.oldIndex = lowLeafIndex;
            	newIndexRef.newIndex = oldIndex + delta; 
            } 
            else
            { 
            	newIndexRef.newIndex = lowLeafIndex;
                oldIndexRef. oldIndex = newIndex + delta;
            }
 
            // do the actual move
            this.ProtectedItems.Move(oldIndexLocal, newIndexLocal); 
            return true; 
        },
 
        // the group's description has changed - notify parent
//        protected virtual void 
        OnGroupByChanged:function()
        {
            if (this.Parent != null) 
                this.Parent.OnGroupByChanged();
        }, 
        
////      void 
//        OnGroupByChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e) 
//        {
//            OnGroupByChanged(); 
//        }
 
        /// <summary>
        ///     Maps the given name with the given subgroup 
        /// </summary>
//        internal void 
        AddSubgroupToMap:function(/*object*/ nameKey, /*CollectionViewGroupInternal*/ subgroup)
        {
//            Debug.Assert(subgroup != null); 
            if (nameKey == null)
            { 
                // use null name place holder. 
                nameKey = this._nullGroupNameKey;
            } 
            if (this._nameToGroupMap == null)
            {
            	this._nameToGroupMap = new Hashtable();
            } 
            // Add to the map. Use WeakReference to avoid memory leaks
            // in case some one calls ProtectedItems.Remove instead of 
            // CollectionViewGroupInternal.Remove 
            this._nameToGroupMap.Set(nameKey, subgroup); //new WeakReference(subgroup));
            this.ScheduleMapCleanup(); 
        },

        /// <summary>
        ///     Removes the given subgroup from the name to group map. 
        /// </summary>
//        private void 
        RemoveSubgroupFromMap:function(/*CollectionViewGroupInternal*/ subgroup) 
        { 
//            Debug.Assert(subgroup != null);
            if (this._nameToGroupMap == null) 
            {
                return;
            }
            /*object*/var keyToBeRemoved = null; 

            // Search for the subgroup in the map. 
            for(var i=0, count = this._nameToGroupMap.Keys; i<count; i++) //for/*each*/ (/*object*/var key in this._nameToGroupMap.Keys) 
            {
//                /*WeakReference*/var weakRef = _nameToGroupMap[key] instanceof WeakReference ? _nameToGroupMap[key] : null; 
//                if (weakRef != null &&
//                    weakRef.Target == subgroup)
//                {
//                    keyToBeRemoved = key; 
//                    break;
//                } 
            	var key = this._nameToGroupMap.Keys.Get(i);
                /*WeakReference*/var keyToBeRemoved = this._nameToGroupMap.Get(key);
                if (keyToBeRemoved == subgroup)
                {
                	keyToBeRemoved = key; 
                	break;
                } 
            } 
            if (keyToBeRemoved != null)
            { 
                this._nameToGroupMap.Remove(keyToBeRemoved);
            }
            this.ScheduleMapCleanup();
        },
        
        /// <summary> 
        ///     Tries to find the subgroup for the name from the map. 
        /// </summary>
//        internal CollectionViewGroupInternal 
        GetSubgroupFromMap:function(/*object*/ nameKey) 
        {
            if (this._nameToGroupMap != null)
            {
                if (nameKey == null) 
                {
                    // use null name place holder. 
                    nameKey = this._nullGroupNameKey; 
                }
                // Find and return the subgroup 
//                /*WeakReference*/
//                var weakRef = _nameToGroupMap[nameKey] instanceof WeakReference ? _nameToGroupMap[nameKey] : null;
//                if (weakRef != null)
//                {
//                    return (weakRef.Target instanceof CollectionViewGroupInternal ? weakRef.Target : null); 
//                }
                
                /*WeakReference*/
                var group = this._nameToGroupMap.Get(nameKey);
                if (group != null)
                {
                    return (group instanceof CollectionViewGroupInternal ? group : null); 
                }
            } 
            return null; 
        },
        
        /// <summary>
        ///     Schedules a dispatcher operation to clean up the map
        ///     of garbage collected weak references.
        /// </summary> 
//        private void 
        ScheduleMapCleanup:function()
        { 
//            if (!_mapCleanupScheduled) 
//            {
//                _mapCleanupScheduled = true; 
//                Dispatcher.CurrentDispatcher.BeginInvoke(
//                    (Action)delegate()
//                    {
//                        _mapCleanupScheduled = false; 
//                        if (_nameToGroupMap != null)
//                        { 
//                            ArrayList keysToBeRemoved = new ArrayList(); 
//                            foreach (object key in _nameToGroupMap.Keys)
//                            { 
//                                WeakReference weakRef = _nameToGroupMap[key] as WeakReference;
//                                if (weakRef == null || !weakRef.IsAlive)
//                                {
//                                    keysToBeRemoved.Add(key); 
//                                }
//                            } 
//                            foreach (object key in keysToBeRemoved) 
//                            {
//                                _nameToGroupMap.Remove(key); 
//                            }
//                        }
//                    },
//                    DispatcherPriority.ContextIdle); 
//            }
        },
        
//        protected void 
        ChangeCounts:function(/*object*/ item, /*int*/ delta)
        { 
            var changeLeafCount = !(item instanceof CollectionViewGroup);
 
            for (/*CollectionViewGroupInternal*/var group = this; 
                    group != null;
                    group = group._parentGroup ) 
            {
                group.FullCount += delta;
                if (changeLeafCount)
                { 
                    group.ProtectedItemCount += delta;
 
                    if (group.ProtectedItemCount == 0) 
                    {
                        this.RemoveEmptyGroup(group); 
                    }
                }
            }
 
//            unchecked {++_version;}     // this invalidates enumerators
            ++this._version;
        },
        
//        void 
        RemoveEmptyGroup:function(/*CollectionViewGroupInternal*/ group)
        { 
            /*CollectionViewGroupInternal*/var parent = group.Parent;

            if (parent != null)
            { 
                /*GroupDescription*/var groupBy = parent.GroupBy;
                var index = parent.ProtectedItems.IndexOf(group); 
 
                // remove the subgroup unless it is one of the explicit groups
                if (index >= groupBy.GroupNames.Count) 
                {
                    parent.Remove(group, false);
                }
            } 
        },
 


	});
	
	Object.defineProperties(CollectionViewGroupInternal.prototype,{
        /// <summary>
        /// Is this group at the bottom level (not further subgrouped). 
        /// </summary>
//        public override bool 
        IsBottomLevel: 
        { 
            get:function() { return (this._groupBy == null); }
        }, 

        // how this group divides into subgroups
//        internal GroupDescription 
        GroupBy: 
        {
            get:function() { return this._groupBy; },
            set:function(value) 
            {
                var oldIsBottomLevel = this.IsBottomLevel; 

                if (this._groupBy != null)
//                    PropertyChangedEventManager.RemoveHandler(this._groupBy, this.OnGroupByChanged, String.Empty);
                	this._groupBy.PropertyChanged.Remove(new PropertyChangedEventHandler(this, this.OnGroupByChanged));
 
                this._groupBy = value;
 
                if (this._groupBy != null) 
//                    PropertyChangedEventManager.AddHandler(this._groupBy, this.OnGroupByChanged, String.Empty);
                	this._groupBy.PropertyChanged.Combine(new PropertyChangedEventHandler(this, this.OnGroupByChanged));
 
                if (oldIsBottomLevel != this.IsBottomLevel)
                {
                    this.OnPropertyChanged(new PropertyChangedEventArgs("IsBottomLevel"));
                } 
            }
        }, 
 
        // the number of items and groups in the subtree under this group
//        internal int 
        FullCount: 
        {
            get:function() { return this._fullCount; },
            set:function(value) { this._fullCount = value; }
        }, 

        // the most recent index where actvity took place 
//        internal int 
        LastIndex: 
        {
            get:function() { return this._lastIndex; },
            set:function(value) { this._lastIndex = value; }
        },

        // the first item (leaf) added to this group.  If this can't be determined, 
        // DependencyProperty.UnsetValue.
//        internal object 
        SeedItem:
        { 
            get:function()
            { 
                if (this.ItemCount > 0 && (GroupBy == null || this.GroupBy.GroupNames.Count == 0))
                {
                    // look for first item, child by child
                    for (var k=0, n=Items.Count; k<n; ++k) 
                    {
                        /*CollectionViewGroupInternal*/
                    	var subgroup = this.Items.Get(k);
                    	subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null; 
                        if (subgroup == null) 
                        {
                            // child is an item - return it 
                            return this.Items.Get(k);
                        }
                        else if (subgroup.ItemCount > 0)
                        { 
                            // child is a nonempty subgroup - ask it
                            return subgroup.SeedItem; 
                        } 
                        // otherwise child is an empty subgroup - go to next child
                    } 

                    // we shouldn't get here, but just in case...
                    return DependencyProperty.UnsetValue;
                } 
                else
                { 
                    // the group is empty, or it has explicit subgroups. 
                    // In either case, we cannot determine the first item -
                    // it could have gone into any of the subgroups. 
                    return DependencyProperty.UnsetValue;
                }
            }
        },

//        internal CollectionViewGroupInternal 
        Parent: 
        { 
            get:function() { return this._parentGroup; }
        } 

	});
	
	CollectionViewGroupInternal.IListComparer = IListComparer;
	
	CollectionViewGroupInternal.Type = new Type("CollectionViewGroupInternal", CollectionViewGroupInternal, [CollectionViewGroup.Type]);
	return CollectionViewGroupInternal;
});
