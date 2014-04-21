package org.summer.view.wpf4;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.INotifyPropertyChanged;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.data.IComparer;
import org.summer.view.widget.model.GroupDescription;
import org.summer.view.widget.model.PropertyChangedEventArgs;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;

/*internal*/ public class CollectionViewGroupInternal extends CollectionViewGroup
    { 
//        #region Constructors
 
        //----------------------------------------------------- 
        //
        //  Constructors 
        //
        //-----------------------------------------------------

        /*internal*/ public CollectionViewGroupInternal(Object name, CollectionViewGroupInternal parent) 
        {
        	super(name) ;
            _parentGroup = parent; 
        } 

//        #endregion Constructors 

//        #region Public Properties

        //------------------------------------------------------ 
        //
        //  Public Properties 
        // 
        //-----------------------------------------------------
 
        /// <summary>
        /// Is this group at the bottom level (not further subgrouped).
        /// </summary>
        public /*override*/ boolean IsBottomLevel 
        {
            get { return (_groupBy == null); } 
        } 

//        #endregion  Public Properties 

//        #region Internal Properties

        //------------------------------------------------------ 
        //
        //  Internal Properties 
        // 
        //------------------------------------------------------
 
        // how this group divides into subgroups
        /*internal*/ public GroupDescription GroupBy
        {
            get { return _groupBy; } 
            set
            { 
                boolean oldIsBottomLevel = IsBottomLevel; 

                if (_groupBy != null) 
                    ((INotifyPropertyChanged)_groupBy).PropertyChanged -= new PropertyChangedEventHandler(OnGroupByChanged);

                _groupBy = value;
 
                if (_groupBy != null)
                    ((INotifyPropertyChanged)_groupBy).PropertyChanged += new PropertyChangedEventHandler(OnGroupByChanged); 
 
                if (oldIsBottomLevel != IsBottomLevel)
                { 
                    OnPropertyChanged(new PropertyChangedEventArgs("IsBottomLevel"));
                }
            }
        } 

        // the number of items and groups in the subtree under this group 
        /*internal*/ public int FullCount 
        {
            get { return _fullCount; } 
            set { _fullCount = value; }
        }

        // the most recent index where actvity took place 
        /*internal*/ public int LastIndex
        { 
            get { return _lastIndex; } 
            set { _lastIndex = value; }
        } 

        // the first item (leaf) added to this group.  If this can't be determined,
        // DependencyProperty.UnsetValue.
        /*internal*/ public Object SeedItem 
        {
            get 
            { 
                if (ItemCount > 0 && (GroupBy == null || GroupBy.GroupNames.Count == 0))
                { 
                    // look for first item, child by child
                    for (int k=0, n=Items.Count; k<n; ++k)
                    {
                        CollectionViewGroupInternal subgroup = Items[k] as CollectionViewGroupInternal; 
                        if (subgroup == null)
                        { 
                            // child is an item - return it 
                            return Items[k];
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
        }

//        #endregion Properties 

//        #region Internal methods 
 
        //-----------------------------------------------------
        // 
        //  Internal methods
        //
        //------------------------------------------------------
 
        /*internal*/ public void Add(Object item)
        { 
            ChangeCounts(item, +1); 
            ProtectedItems.Add(item);
        } 

        /*internal*/ public int Remove(Object item, boolean returnLeafIndex)
        {
            int index = -1; 
            int localIndex = ProtectedItems.IndexOf(item);
 
            if (localIndex >= 0) 
            {
                if (returnLeafIndex) 
                {
                    index = LeafIndexFromItem(null, localIndex);
                }
 
                ChangeCounts(item, -1);
                ProtectedItems.RemoveAt(localIndex); 
            } 

            return index; 
        }

        /*internal*/ public void Clear()
        { 
            FullCount = 1;
            ProtectedItemCount = 0; 
            ProtectedItems.Clear(); 
        }
 
        // return the index of the given item within the list of leaves governed
        // by this group
        /*internal*/ public int LeafIndexOf(Object item)
        { 
            int leaves = 0;         // number of leaves we've passed over so far
            for (int k=0, n=Items.Count;  k<n;  ++k) 
            { 
                CollectionViewGroupInternal subgroup = Items[k] as CollectionViewGroupInternal;
                if (subgroup != null) 
                {
                    int subgroupIndex = subgroup.LeafIndexOf(item);
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
                    if (Object.Equals(item, Items[k])) 
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
        }

        // return the index of the given item within the list of leaves governed
        // by the full group structure.  The item must be a (direct) child of this 
        // group.  The caller provides the index of the item within this group,
        // if known, or -1 if not. 
        /*internal*/ public int LeafIndexFromItem(Object item, int index) 
        {
            int result = 0; 

            // accumulate the number of predecessors at each level
            for (CollectionViewGroupInternal group = this;
                    group != null; 
                    item = group, group = group.Parent, index = -1)
            { 
                // accumulate the number of predecessors at the level of item 
                for (int k=0, n=group.Items.Count;  k < n;  ++k)
                { 
                    // if we've reached the item, move up to the next level
                    if ((index < 0 && Object.Equals(item, group.Items[k])) ||
                        index == k)
                    { 
                        break;
                    } 
 
                    // accumulate leaf count
                    CollectionViewGroupInternal subgroup = group.Items[k] as CollectionViewGroupInternal; 
                    result += (subgroup == null) ? 1 : subgroup.ItemCount;
                }
            }
 
            return result;
        } 
 

        // return the item at the given index within the list of leaves governed 
        // by this group
        /*internal*/ public Object LeafAt(int index)
        {
            for (int k=0, n=Items.Count;  k<n;  ++k) 
            {
                CollectionViewGroupInternal subgroup = Items[k] as CollectionViewGroupInternal; 
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
                        return Items[k]; 
                    } 
                    else
                    { 
                        index -= 1;
                    }
                }
            } 

            // the loop should have found the index.  We shouldn't get here. 
            throw new ArgumentOutOfRangeException("index"); 
        }
 
        // return an enumerator over the leaves governed by this group
        /*internal*/ public IEnumerator GetLeafEnumerator()
        {
            return new LeafEnumerator(this); 
        }
 
        // insert a new item or subgroup and return its index.  Seed is a 
        // representative from the subgroup (or the item itself) that
        // is used to position the new item/subgroup w.r.t. the order given 
        // by the comparer.  (If comparer is null, just add at the end).
        /*internal*/ public int Insert(Object item, Object seed, IComparer comparer)
        {
            // never insert the new item/group before the explicit subgroups 
            int low = (GroupBy == null) ? 0 : GroupBy.GroupNames.Count;
            int index = FindIndex(item, seed, comparer, low, ProtectedItems.Count); 
 
            // now insert the item
            ChangeCounts(item, +1); 
            ProtectedItems.Insert(index, item);

            return index;
        } 

        protected virtual int FindIndex(Object item, Object seed, IComparer comparer, int low, int high) 
        { 
            int index;
 
            if (comparer != null)
            {
                IListComparer ilc = comparer as IListComparer;
                if (ilc != null) 
                {
                    // reset the IListComparer before each search.  This cannot be done 
                    // any less frequently (e.g. in Root.AddToSubgroups), due to the 
                    // possibility that the item may appear in more than one subgroup.
                    ilc.Reset(); 
                }

                for (index=low;  index < high;  ++index)
                { 
                    CollectionViewGroupInternal subgroup = ProtectedItems[index] as CollectionViewGroupInternal;
                    Object seed1 = (subgroup != null) ? subgroup.SeedItem : ProtectedItems[index]; 
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
        }

        // the group's description has changed - notify parent
        protected virtual void OnGroupByChanged() 
        {
            if (Parent != null) 
                Parent.OnGroupByChanged(); 
        }
 
//        #endregion Internal methods

//        #region Internal Types
 
        // this comparer is used to insert an item into a group in a position consistent
        // with a given IList.  It only works when used in the pattern that FindIndex 
        // uses, namely first call Reset(), then call Compare(item, x) any number of 
        // times with the same item (the new item) as the first argument, and a sequence
        // of x's as the second argument that appear in the IList in the same sequence. 
        // This makes the total search time linear in the size of the IList.  (To give
        // the correct answer regardless of the sequence of arguments would involve
        // calling IndexOf and leads to O(N^2) total search time.)
 
        /*internal*/ public class IListComparer : IComparer
        { 
            /*internal*/ public IListComparer(IList list) 
            {
                ResetList(list); 
            }

            /*internal*/ public void Reset()
            { 
                _index = 0;
            } 
 
            /*internal*/ public void ResetList(IList list)
            { 
                _list = list;
                _index = 0;
            }
 
            public int Compare(Object x, Object y)
            { 
                if (Object.Equals(x, y)) 
                    return 0;
 
                // advance the index until seeing one x or y
                int n = (_list != null) ? _list.Count : 0;
                for (; _index < n; ++_index)
                { 
                    Object z = _list[_index];
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

            int _index;
            IList _list; 
        }
 
//        #endregion Internal Types 

//        #region Private Properties 

        //-----------------------------------------------------
        //
        //  Private Properties 
        //
        //----------------------------------------------------- 
 
        private CollectionViewGroupInternal Parent
        { 
            get { return _parentGroup; }
        }

//        #endregion Private Properties 

//        #region Private methods 
 
        //-----------------------------------------------------
        // 
        //  Private methods
        //
        //------------------------------------------------------
 
        protected void ChangeCounts(Object item, int delta)
        { 
            boolean changeLeafCount = !(item instanceof CollectionViewGroup); 

            for (   CollectionViewGroupInternal group = this; 
                    group != null;
                    group = group._parentGroup )
            {
                group.FullCount += delta; 
                if (changeLeafCount)
                { 
                    group.ProtectedItemCount += delta; 

                    if (group.ProtectedItemCount == 0) 
                    {
                        RemoveEmptyGroup(group);
                    }
                } 
            }
 
            unchecked {++_version;}     // this invalidates enumerators 
        }
 
        void RemoveEmptyGroup(CollectionViewGroupInternal group)
        {
            CollectionViewGroupInternal parent = group.Parent;
 
            if (parent != null)
            { 
                GroupDescription groupBy = parent.GroupBy; 
                int index = parent.ProtectedItems.IndexOf(group);
 
                // remove the subgroup unless it is one of the explicit groups
                if (index >= groupBy.GroupNames.Count)
                {
                    parent.Remove(group, false); 
                }
            } 
        } 

        void OnGroupByChanged(Object sender, /*System.ComponentModel.*/PropertyChangedEventArgs e) 
        {
            OnGroupByChanged();
        }
 
//        #endregion Private methods
 
//        #region Private fields 

        //----------------------------------------------------- 
        //
        //  Private fields
        //
        //------------------------------------------------------ 

        GroupDescription    _groupBy; 
        CollectionViewGroupInternal _parentGroup; 
        int                 _fullCount = 1;
        int                 _lastIndex; 
        int                 _version;       // for detecting stale enumerators

//        #endregion Private fields
 
//        #region Private classes
 
        //------------------------------------------------------ 
        //
        //  Private classes 
        //
        //-----------------------------------------------------

        private class LeafEnumerator implements IEnumerator 
        {
            public LeafEnumerator(CollectionViewGroupInternal group) 
            { 
                _group = group;
                DoReset();  // don't call virtual Reset in ctor 
            }

            void IEnumerator.Reset()
            { 
                DoReset();
            } 
 
            void DoReset()
            { 
                _version = _group._version;
                _index = -1;
                _subEnum = null;
            } 

            boolean IEnumerator.MoveNext() 
            { 
                // check for invalidated enumerator
                if (_group._version != _version) 
                    throw new InvalidOperationException();

                // move forward to the next leaf
                while (_subEnum == null || !_subEnum.MoveNext()) 
                {
                    // done with the current top-level item.  Move to the next one. 
                    ++ _index; 
                    if (_index >= _group.Items.Count)
                        return false; 

                    CollectionViewGroupInternal subgroup = _group.Items[_index] as CollectionViewGroupInternal;
                    if (subgroup == null)
                    { 
                        // current item is a leaf - it's the new Current
                        _current = _group.Items[_index]; 
                        _subEnum = null; 
                        return true;
                    } 
                    else
                    {
                        // current item is a subgroup - get its enumerator
                        _subEnum = subgroup.GetLeafEnumerator(); 
                    }
                } 
 
                // the loop terminates only when we have a subgroup enumerator
                // positioned at the new Current item 
                _current = _subEnum.Current;
                return true;
            }
 
            Object IEnumerator.Current
            { 
                get 
                {
                    if (_index < 0  ||  _index >= _group.Items.Count) 
                        throw new InvalidOperationException();
                    return _current;
                }
            } 

            CollectionViewGroupInternal _group; // parent group 
            int                 _version;   // parent group's version at ctor 
            int                 _index;     // current index into Items
            IEnumerator         _subEnum;   // enumerator over current subgroup 
            Object              _current;   // current item
        }

//        #endregion Private classes 
    }