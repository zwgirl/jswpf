/**
 * Second Check 12-10
 * CollectionViewGroupRoot
 */

define(["dojo/_base/declare", "system/Type", "data/CollectionViewGroupInternal", "specialized/INotifyCollectionChanged",
        "componentmodel/GroupDescription", "data/CollectionViewGroup", "system/StringComparison"], 
		function(declare, Type, CollectionViewGroupInternal, INotifyCollectionChanged,
				GroupDescription, CollectionViewGroup, StringComparison
		){
	
    var GroupTreeNode = declare(null, {
    	
    });
    
    Object.defineProperties(GroupTreeNode.prototype, {
//        public GroupTreeNode               
        FirstChild: 
        { 
        	get:function(){return this._FirstChild;}, 
        	set:function(value){this._FirstChild = value;} 
        }, 
//        public GroupTreeNode               
        Sibling: 
        { 
        	get:function(){return this._Sibling;}, 
        	set:function(value){this._Sibling = value;} 
        }, 
//        public CollectionViewGroupInternal 
        Group: 
        { 
        	get:function(){return this._Group;}, 
        	set:function(value){this._Group = value;} 
        }, 
//        public bool                        
        ContainsItem: 
        { 
        	get:function(){return this._ContainsItem;}, 
        	set:function(value){this._ContainsItem = value;} 
        },  
//        public bool                        
        ContainsItemDirectly: 
        { 
        	get:function(){return this._ContainsItemDirectly;}, 
        	set:function(value){this._ContainsItemDirectly = value;} 
        }, 
    });
    
//    private class 
    var TopLevelGroupDescription =declare(GroupDescription, {
        // we have to implement this abstract method, but it should never be called 
//        public override object 
        GroupNameFromItem:function(/*object*/ item, /*int*/ level, /*CultureInfo*/ culture)
        {
            throw new NotSupportedException();
        }
    });
    
//    internal class 
    var AbandonedGroupItem =declare(Object,{
        constructor:function(/*LiveShapingItem*/ lsi, /*CollectionViewGroupInternal*/ group)
        {
            this._lsi = lsi; 
            this._group = group;
        } 
    });
    
    Object.defineProperties(AbandonedGroupItem.prototype, {
//        public LiveShapingItem 
    	Item: { get:function() { return this._lsi; } },
//        public CollectionViewGroupInternal 
    	Group: { get:function() { return this._group; } } 
    });

    
//    static GroupDescription 
    var _topLevelGroupDescription = null;
//    static readonly object 
    var UseAsItemDirectly = {"name": "UseAsItemDirectly"}; //new NamedObject("UseAsItemDirectly");
    
	var CollectionViewGroupRoot = declare("CollectionViewGroupRoot", CollectionViewGroupInternal
			/*[CollectionViewGroupInternal, INotifyCollectionChanged]*/, {
		constructor:function(/*CollectionView*/ view) 
        { 
			CollectionViewGroupInternal.prototype.constructor.call(this, "Root", null);
            this._view = view; 

//          CollectionViewGroupInternal.prototype.constructor.apply(this, ["Root", null]);
//          CollectionViewGroup.prototype.constructor.call(this, "Root", null);
          
//          IComparer 
            this._comparer = null;
//          bool 
            this._isDataInGroupOrder = false;
   
//          ObservableCollection<GroupDescription> 
            this._groupBys = new ObservableCollection/*<GroupDescription>*/();
//          GroupDescriptionSelectorCallback 
            this._groupBySelector = null; 
        },
 
        /// <summary> 
        ///     Notify listeners that this View has changed
        /// </summary> 
        /// <remarks>
        ///     CollectionViews (and sub-classes) should take their filter/sort/grouping
        ///     into account before calling this method to forward CollectionChanged events.
        /// </remarks> 
        /// <param name="args">
        ///     The NotifyCollectionChangedEventArgs to be passed to the EventHandler 
        /// </param> 
//        public void 
        OnCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args)
        { 
            if (args == null)
                throw new ArgumentNullException("args");

            if (this.CollectionChanged != null) 
                this.CollectionChanged.Invoke(this, args);
        }, 

        // a group description has changed somewhere in the tree - notify host 
//        protected override void 
        OnGroupByChanged:function()
        {
            if (this.GroupDescriptionChanged != null)
                this.GroupDescriptionChanged.Invoke(this, EventArgs.Empty); 
        },

//        internal void 
        Initialize:function()
        { 
            if (_topLevelGroupDescription == null)
            {
            	_topLevelGroupDescription = new TopLevelGroupDescription();
            } 
            this.InitializeGroup(this, _topLevelGroupDescription, 0);
        }, 

//        internal void 
//        RemoveItemFromSubgroupsByExhaustiveSearch:function(/*object*/ item) 
//        {
//            RemoveItemFromSubgroupsByExhaustiveSearch(this, item);
//        },
        
        // the item did not appear in one or more of the subgroups it
        // was supposed to.  This can happen if the item's properties
        // change so that the group names we used to insert it are 
        // different from the names used to remove it.  If this happens,
        // remove the item the hard way. 
//        void 
        RemoveItemFromSubgroupsByExhaustiveSearch:function(/*CollectionViewGroupInternal*/ group, /*object*/ item) 
        {
        	if(arguments.length == 1){
        		item = group;
        		group = this;
        	}
            // try to remove the item from the direct children 
            if (this.RemoveFromGroupDirectly(group, item))
            {
                // if that didn't work, recurse into each subgroup
                // (loop runs backwards in case an entire group is deleted) 
                for (var k=group.Items.Count-1;  k >= 0;  --k)
                { 
                    /*CollectionViewGroupInternal*/var subgroup = group.Items.Get(k);
                    subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null; 
                    if (subgroup != null)
                    { 
                        this.RemoveItemFromSubgroupsByExhaustiveSearch(subgroup, item);
                    }
                }
            } 
            else
            { 
                // if the item was removed directly, we don't have to look at subgroups. 
                // An item cannot appear both as a direct child and as a deeper descendant.
            } 
        },
 
//        internal void 
        InsertSpecialItem:function(/*int*/ index, /*object*/ item, /*bool*/ loading)
        { 
        	this.ChangeCounts(item, +1); 
        	this.ProtectedItems.Insert(index, item);
 
            if (!loading)
            {
                var globalIndex = this.LeafIndexFromItem(item, index);
                this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, item, globalIndex)); 
            }
        }, 
 
//        internal void 
        RemoveSpecialItem:function(/*int*/ index, /*object*/ item, /*bool*/ loading)
        { 
//            Debug.Assert(Object.Equals(item, ProtectedItems[index]), "RemoveSpecialItem finds inconsistent data");
            var globalIndex = -1;

            if (!loading) 
            {
                globalIndex = this.LeafIndexFromItem(item, index); 
            } 

            this.ChangeCounts(item, -1); 
            this.ProtectedItems.RemoveAt(index);

            if (!loading)
            { 
            	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, item, globalIndex));
            } 
        }, 

//        internal void 
        MoveWithinSubgroups:function(/*object*/ item, /*LiveShapingItem*/ lsi, /*IList*/ list, /*int*/ oldIndex, /*int*/ newIndex) 
        {
            if (lsi == null)
            {
                // recursively descend through the groups, moving the item within 
                // groups it belongs to
            	this.MoveWithinSubgroups(item, this, 0, list, oldIndex, newIndex); 
            } 
            else
            { 
                // when live shaping is in effect, lsi records which groups the item
                // belongs to.  Move the item within those groups

                /*CollectionViewGroupInternal*/var parentGroup = lsi.ParentGroup; 
                if (parentGroup != null)
                { 
                    // 90% case - item belongs to a single group 
                	this.MoveWithinSubgroup(item, parentGroup, list, oldIndex, newIndex);
                } 
                else
                {
                    // 10% case - item belongs to many groups
                    for(var i=0, count = lsi.ParentGroups.Count; i<count; i++) //for/*each*/ (/*CollectionViewGroupInternal*/var group in lsi.ParentGroups) 
                    {
                    	var group = lsi.ParentGroups.Get(i);
                    	this.MoveWithinSubgroup(item, group, list, oldIndex, newIndex); 
                    } 
                }
            } 
        },

//        protected override int 
        FindIndex:function(/*object*/ item, /*object*/ seed, /*IComparer*/ comparer, /*int*/ low, /*int*/ high)
        { 
            // root group needs to adjust the bounds of the search to exclude the
            // placeholder and new item (if any) 
            /*IEditableCollectionView*/
        	var iecv = this._view instanceof IEditableCollectionView ? this._view : null; 
            if (iecv != null)
            { 
                if (iecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
                {
                    ++low;
                    if (iecv.IsAddingNew) 
                    {
                        ++low; 
                    } 
                }
                else 
                {
                    if (iecv.IsAddingNew)
                    {
                        --high; 
                    }
                    if (iecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd) 
                    { 
                        --high;
                    } 
                }
            }

            return CollectionViewGroupInternal.prototype.FindIndex.call(this, item, seed, comparer, low, high);
        },
        
        // for the given item, check its grouping, add it to groups it has newly joined, 
        // and record groups it has newly left in the delete-list
////        internal void 
//        RestoreGrouping:function(/*LiveShapingItem*/ lsi, /*List<AbandonedGroupItem>*/ deleteList) 
//        {
//            /*GroupTreeNode*/var root = this.BuildGroupTree(lsi);
//            root.ContainsItem = true;
//            this.RestoreGrouping(lsi, root, 0, deleteList); 
//        },
 
//        void 
        RestoreGrouping:function(/*LiveShapingItem*/ lsi, /*GroupTreeNode*/ node, /*int*/ level, /*List<AbandonedGroupItem>*/ deleteList) 
        {
        	if(arguments.length == 2){
        		deleteList = node;
        		node = this.BuildGroupTree(lsi);
        		node.ContainsItem = true;
        	}
        	
            if (node.ContainsItem) 
            {
                // item belongs to this group - check subgroups
                /*object*/var name = this.GetGroupName(lsi.Item, node.Group.GroupBy, level);
                if (name != UseAsItemDirectly) 
                {
                    /*ICollection*/var ic = name instanceof ICollection ? name : null; 
                    /*ArrayList*/var names = (ic == null) ? null : new ArrayList(ic); 

                    // find subgroups whose names still match 
                    for (/*GroupTreeNode*/var child = node.FirstChild; child != null; child = child.Sibling)
                    {
                        if (names == null)
                        { 
                            if (Object.Equals(name, child.Group.Name))
                            { 
                                child.ContainsItem = true; 
                                name = DependencyProperty.UnsetValue;   // name is 'seen'
                                break; 
                            }
                        }
                        else
                        { 
                            if (names.Contains(child.Group.Name))
                            { 
                                child.ContainsItem = true; 
                                names.Remove(child.Group.Name);
                            } 
                        }
                    }

                    // for names that don't match, add the item to the new subgroup 
                    if (names == null)
                    { 
                        if (name != DependencyProperty.UnsetValue) 
                        {
                        	this.AddToSubgroup(lsi.Item, lsi, node.Group, level, name, false); 
                        }
                    }
                    else
                    { 
                        for/*each*/ (/*object*/var o in names)
                        { 
                        	this.AddToSubgroup(lsi.Item, lsi, node.Group, level, o, false); 
                        }
                    } 
                }
            }
            else
            { 
                // item doesn't belong to this group - if it used to belong directly,
                // mark it for deletion 
                if (node.ContainsItemDirectly) 
                {
                    deleteList.Add(new AbandonedGroupItem(lsi, node.Group)); 
                }
            }

            // recursively handle children 
            for (/*GroupTreeNode*/var child = node.FirstChild; child != null; child = child.Sibling)
            { 
            	this.RestoreGrouping(lsi, child, level+1, deleteList); 
            }
        }, 

//        GroupTreeNode 
        BuildGroupTree:function(/*LiveShapingItem*/ lsi)
        {
            /*CollectionViewGroupInternal*/var parentGroup = lsi.ParentGroup; 
            /*GroupTreeNode*/var node;
 
            if (parentGroup != null) 
            {
                // 90% case - item belongs to only one group.   Construct tree 
                // the fast way
                node = new GroupTreeNode();
//                            { Group = parentGroup, ContainsItemDirectly = true };
                node.Group = parentGroup;
                node.ContainsItemDirectly = true;
                for (;;) 
                {
                    /*CollectionViewGroupInternal*/var group = parentGroup; 
                    parentGroup = group.Parent; 
                    if (parentGroup == null)
                        break; 

                    /*GroupTreeNode*/
                    var parentNode = new GroupTreeNode();
//                            { Group = parentGroup, FirstChild = node };
                    parentNode.Group = parentGroup;
                    parentNode.FirstChild = node;
                    node = parentNode; 
                }
                return node; 
            } 
            else
            { 
                // item belongs to multiple groups ("categories").   Construct tree
                // the slow way.
                /*List<CollectionViewGroupInternal>*/var parentGroups = lsi.ParentGroups;
                /*List<GroupTreeNode>*/var list = new List/*<GroupTreeNode>*/(parentGroups.Count + 1); 
                /*GroupTreeNode*/var root = null;
 
                // initialize the list with a node for each direct parent group 
                for(var i=0, count=parentGroups.Count; i<count; i++ ) //for/*each*/ (/*CollectionViewGroupInternal*/var group in parentGroups)
                { 
                	var group = parentGroups.Get(i);
                    node = new GroupTreeNode();
//                            { Group = group, ContainsItemDirectly = true };4
                    node.Group = group;
                    node.ContainsItemDirectly = true;
                    list.Add(node);
                } 

                // add each node in the list to the tree 
                for (var index = 0;  index < list.Count; ++index) 
                {
                    node = list.Get(index); 
                    parentGroup = node.Group.Parent;
                    /*GroupTreeNode*/var parentNode = null;

                    // special case for the root 
                    if (parentGroup == null)
                    { 
                        root = node; 
                        continue;
                    } 

                    // search for an existing parent node
                    for (var k=list.Count-1; k>=0; --k)
                    { 
                        if (list.Get(k).Group == parentGroup)
                        { 
                            parentNode = list.Get(k); 
                            break;
                        } 
                    }

                    if (parentNode == null)
                    { 
                        // no existing parent node - create one now
                        parentNode = new GroupTreeNode();
//                                { Group = parentGroup, FirstChild = node }; 
                        parentNode.Group = parentGroup;
                        parentNode.FirstChild = node;
                        list.Add(parentNode);
                    } 
                    else
                    {
                        // add node to existing parent
                        node.Sibling = parentNode.FirstChild; 
                        parentNode.FirstChild = node;
                    } 
                } 

                return root; 
            }
        },

//        internal void 
        DeleteAbandonedGroupItems:function(/*List<AbandonedGroupItem>*/ deleteList) 
        {
            for(var i=0, count=deleteList.Count; i<count; i++) //for/*each*/ (/*AbandonedGroupItem*/var agi in deleteList) 
            { 
            	var agi = deleteList.Get(i);
            	this.RemoveFromGroupDirectly(agi.Group, agi.Item.Item);
                agi.Item.RemoveParentGroup(agi.Group); 
            }
        },
        
        // Initialize the given group
//        void 
        InitializeGroup:function(/*CollectionViewGroupInternal*/ group, /*GroupDescription*/ parentDescription, /*int*/ level) 
        {
            // set the group description for dividing the group into subgroups
            /*GroupDescription*/var groupDescription = this.GetGroupDescription(group, parentDescription, level);
            group.GroupBy = groupDescription; 

            // create subgroups for each of the explicit names 
            /*ObservableCollection<object>*/var explicitNames = 
                        (groupDescription != null) ? groupDescription.GroupNames : null;
            if (explicitNames != null) 
            {
                for (var k=0, n=explicitNames.Count;  k<n;  ++k)
                {
                    /*CollectionViewGroupInternal*/var subgroup = new CollectionViewGroupInternal(explicitNames.Get(k), group); 
                    this.InitializeGroup(subgroup, groupDescription, level+1);
                    group.Add(subgroup); 
                } 
            }
 
            group.LastIndex = 0;
        },
 
        // return the description of how to divide the given group into subgroups
//        GroupDescription 
        GetGroupDescription:function(/*CollectionViewGroup*/ group, /*GroupDescription*/ parentDescription, /*int*/ level) 
        { 
            /*GroupDescription*/var result = null;
            if (group == this) 
            {
                group = null;       // users don't see the synthetic group
            }
 
            if (parentDescription != null)
            { 
//#if GROUPDESCRIPTION_HAS_SUBGROUP 
//                // a. Use the parent description's subgroup description
//                result = parentDescription.Subgroup; 
//#endif // GROUPDESCRIPTION_HAS_SUBGROUP
//
//#if GROUPDESCRIPTION_HAS_SELECTOR
//                // b. Call the parent description's selector 
//                if (result == null && parentDescription.SubgroupSelector != null)
//                { 
//                    result = parentDescription.SubgroupSelector(group, level); 
//                }
//#endif // GROUPDESCRIPTION_HAS_SELECTOR 
            }

            // c. Call the global chooser
            if (result == null && this.GroupBySelector != null) 
            {
                result = this.GroupBySelector(group, level); 
            } 

            // d. Use the global array 
            if (result == null && level < this.GroupDescriptions.Count)
            {
                result = this.GroupDescriptions.Get(level);
            } 

            return result; 
        }, 
        
////      internal void 
//        AddToSubgroups:function(/*object*/ item, /*LiveShapingItem*/ lsi, /*bool*/ loading)
//        { 
//            this.AddToSubgroups(item, lsi, this, 0, loading);
//        },

        // add an item to the desired subgroup(s) of the given group 
//        void 
        AddToSubgroups:function(/*object*/ item, /*LiveShapingItem*/ lsi, /*CollectionViewGroupInternal*/ group, /*int*/ level, /*bool*/ loading)
        {
        	if(arguments.length == 3){
        		loading = group;
        		group = this;
        		level = 0 ;
        	}
            /*object*/var name = this.GetGroupName(item, group.GroupBy, level);
            /*ICollection*/var nameList; 

            if (name == UseAsItemDirectly) 
            { 
                // the item belongs to the group itself (not to any subgroups)
                if (lsi != null) 
                {
                    lsi.AddParentGroup(group);
                }
 
                if (loading)
                { 
                    group.Add(item); 
                }
                else 
                {
                    var localIndex = group.Insert(item, item, this.ActiveComparer);
                    var index = group.LeafIndexFromItem(item, localIndex);
                    this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, item, index)); 
                }
            } 
            else if ((nameList = name instanceof ICollection ? name : null) == null) 
            {
                // the item belongs to one subgroup 
            	this.AddToSubgroup(item, lsi, group, level, name, loading);
            }
            else
            { 
                // the item belongs to multiple subgroups
                for(var i=0, count = nameList.Count; i<count; i++) //for/*each*/ (/*object*/var o in nameList) 
                { 
                	var o = nameList.Get(i);
                	this.AddToSubgroup(item, lsi, group, level, o, loading);
                } 
            }
        },
        
        // add an item to the subgroup with the given name
//        void 
        AddToSubgroup:function(/*object*/ item, /*LiveShapingItem*/ lsi, /*CollectionViewGroupInternal*/ group,
        		/*int*/ level, /*object*/ name, /*bool*/ loading) 
        { 
            /*CollectionViewGroupInternal*/var subgroup;
            var index = (loading && this.IsDataInGroupOrder) ? group.LastIndex : 0; 

            // find the desired subgroup using the map
            /*object*/var groupNameKey = this.GetGroupNameKey(name, group);
            subgroup = group.GetSubgroupFromMap(groupNameKey);
            if ((( subgroup instanceof CollectionViewGroupInternal ? subgroup : null) != null) && 
                group.GroupBy.NamesMatch(subgroup.Name, name))
            { 
                // Try best to set the LastIndex. If not possible reset it to 0. 
                group.LastIndex = (group.Items.Get(index) == subgroup ? index : 0);
 
                // Recursively call the AddToSubgroups method on subgroup.
                this.AddToSubgroups(item, lsi, subgroup, level + 1, loading);
                return;
            } 

            // find the desired subgroup using linear search 
            for (var n = group.Items.Count; index < n; ++index) 
            {
                subgroup = group.Items.Get(index);
                subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null; 
                if (subgroup == null)
                    continue;           // skip children that are not groups

                if (group.GroupBy.NamesMatch(subgroup.Name, name)) 
                {
                    group.LastIndex = index; 
 
                    // Update the name to subgroup map on the group.
                    group.AddSubgroupToMap(groupNameKey, subgroup); 

                    // Recursively call the AddToSubgroups method on subgroup.
                    this.AddToSubgroups(item, lsi, subgroup, level+1, loading);
                    return; 
                }
            } 
 
            // the item didn't match any subgroups.  Create a new subgroup and add the item.
            subgroup = new CollectionViewGroupInternal(name, group); 
            this.InitializeGroup(subgroup, group.GroupBy, level+1);

            if (loading)
            { 
                group.Add(subgroup);
                group.LastIndex = index; 
            } 
            else
            { 
                group.Insert(subgroup, item, ActiveComparer);
            }

            // Update the name to subgroup map on the group. 
            group.AddSubgroupToMap(groupNameKey, subgroup);
 
            // Recursively call the AddToSubgroups method on subgroup. 
            this.AddToSubgroups(item, lsi, subgroup, level+1, loading);
        }, 
        
        // move an item within the desired subgroup(s) of the given group
//        void 
        MoveWithinSubgroups:function(/*object*/ item, /*CollectionViewGroupInternal*/ group, 
        		/*int*/ level, /*IList*/ list, /*int*/ oldIndex, /*int*/ newIndex)
        { 
            /*object*/var name = GetGroupName(item, group.GroupBy, level);
            /*ICollection*/var nameList; 
 
            if (name == UseAsItemDirectly)
            { 
                // the item belongs to the group itself (not to any subgroups)
            	this.MoveWithinSubgroup(item, group, list, oldIndex, newIndex);
            }
            else if ((nameList = name instanceof ICollection ? name : null) == null) 
            {
                // the item belongs to one subgroup 
            	this.MoveWithinSubgroup(item, group, level, name, list, oldIndex, newIndex); 
            }
            else 
            {
                // the item belongs to multiple subgroups
                for/*each*/ (/*object*/var o in nameList)
                { 
                	this.MoveWithinSubgroup(item, group, level, o, list, oldIndex, newIndex);
                } 
            } 
        },
 
        // move an item within the subgroup with the given name
//        void 
        MoveWithinSubgroup:function(/*object*/ item, /*CollectionViewGroupInternal*/ group, /*int*/ level, /*object*/ name,
        		/*IList*/ list, /*int*/ oldIndex, /*int*/ newIndex)
        {
        	if(arguments.length == 5){
        		
        		newIndex = list;
        		oldIndex = name;
        		list = level;
            	var oldIndexRef = {
            		"oldIndex" : oldIndex	
            	};
            	
            	var newIndexRef = {
            		"newIndex" : newIndex	
            	};
            	var result = group.Move(item, list, /*ref oldIndex*/oldIndexRef, /*ref newIndex*/newIndexRef);
            	newIndex = newIndexRef.newIndex;
            	oldIndex = oldIndexRef.oldIndex;
                if (result) 
                {
                	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, item, newIndex, oldIndex));
                }
        	}else if(arguments.length == 7){
        		/*CollectionViewGroupInternal*/var subgroup; 

                // find the desired subgroup using the map 
                /*object*/var groupNameKey = this.GetGroupNameKey(name, group); 
                if (((subgroup = group.GetSubgroupFromMap(groupNameKey)) != null) &&
                    group.GroupBy.NamesMatch(subgroup.Name, name)) 
                {
                    // Recursively call the MoveWithinSubgroups method on subgroup.
                	this.MoveWithinSubgroups(item, subgroup, level + 1, list, oldIndex, newIndex);
                    return; 
                }
     
                // find the desired subgroup using linear search 
                for (var index=0, n=group.Items.Count; index < n; ++index)
                { 
                    subgroup = group.Items[index];
                    subgroup = subgroup instanceof  CollectionViewGroupInternal ? subgroup : null;
                    if (subgroup == null)
                        continue;           // skip children that are not groups
     
                    if (group.GroupBy.NamesMatch(subgroup.Name, name))
                    { 
                        // Update the name to subgroup map on the group. 
                        group.AddSubgroupToMap(groupNameKey, subgroup);
     
                        // Recursively call the MoveWithinSubgroups method on subgroup.
                        this.MoveWithinSubgroups(item, subgroup, level+1, list, oldIndex, newIndex);
                        return;
                    } 
                }
     
                // the item didn't match any subgroups.  Something is wrong. 
                // This could happen if the app changes the item's group name (by changing
                // properties that the name depends on) without notification. 
                // We don't support this - the Move is just a no-op.  But assert (in
                // debug builds) to help diagnose the problem if it arises.
//                Debug.Assert(false, "Failed to find item in expected subgroup after Move");
        	}
            
        }, 

        // move the item within its group 
////        void 
//        MoveWithinSubgroup:function(/*object*/ item, /*CollectionViewGroupInternal*/ group, 
//        		/*IList*/ list, /*int*/ oldIndex, /*int*/ newIndex) 
//        {
//        	
//        	var oldIndexRef = {
//        		"oldIndex" : oldIndex	
//        	};
//        	
//        	var newIndexRef = {
//        		"newIndex" : newIndex	
//        	};
//        	var result = group.Move(item, list, /*ref oldIndex*/oldIndexRef, /*ref newIndex*/newIndexRef);
//        	newIndex = newIndexRef.newIndex;
//        	oldIndex = oldIndexRef.oldIndex;
//            if (result) 
//            {
//            	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOII(NotifyCollectionChangedAction.Move, item, newIndex, oldIndex));
//            }
//        }, 

        /// <summary> 
        ///     Helper method to normalize the group name. 
        ///     Normalization happens only if the cases where
        ///     PropertyGroupDescriptions are used with 
        ///     case insensitive comparisons.
        /// </summary>
//        object 
        GetGroupNameKey:function(/*object*/ name, /*CollectionViewGroupInternal*/ group)
        { 
            /*object*/var groupNameKey = name;
            /*PropertyGroupDescription*/var pgd = group.GroupBy instanceof PropertyGroupDescription ? group.GroupBy : null; 
            if (pgd != null) 
            {
                /*string*/var nameStr = typeof(name) == "string" ? name : null; 
                if (nameStr != null)
                {
                    if (pgd.StringComparison == StringComparison.OrdinalIgnoreCase ||
                        pgd.StringComparison == StringComparison.InvariantCultureIgnoreCase) 
                    {
//                        nameStr = nameStr.ToUpperInvariant(); 
                    	nameStr = nameStr.toUpperCase(); 
                    } 
                    else if (pgd.StringComparison == StringComparison.CurrentCultureIgnoreCase)
                    { 
//                        nameStr = nameStr.ToUpper(CultureInfo.CurrentCulture);
                    	nameStr = nameStr.toUpperCase(CultureInfo.CurrentCulture);
                    }
                    groupNameKey = nameStr;
                } 
            }
            return groupNameKey; 
        }, 
        
////      internal bool 
//        RemoveFromSubgroups:function(/*object*/ item) 
//        {
//            return this.RemoveFromSubgroups(item, this, 0); 
//        }, 

        // remove an item from the desired subgroup(s) of the given group. 
        // Return true if the item was not in one of the subgroups it was supposed to be.
//        bool 
        RemoveFromSubgroups:function(/*object*/ item, /*CollectionViewGroupInternal*/ group, /*int*/ level)
        {
        	if(arguments.length == 1){
        		group = this;
        		level = 0;
        	}
            var itemIsMissing = false; 
            var name = this.GetGroupName(item, group.GroupBy, level);
            /*ICollection*/var nameList; 
 
            if (name == UseAsItemDirectly)
            { 
                // the item belongs to the group itself (not to any subgroups)
                itemIsMissing = this.RemoveFromGroupDirectly(group, item);
            }
            else if ((nameList = name instanceof ICollection ? name : null) == null) 
            {
                // the item belongs to one subgroup 
                if (this.RemoveFromSubgroup(item, group, level, name)) 
                    itemIsMissing = true;
            } 
            else
            {
                // the item belongs to multiple subgroups
                for(var i=0, count = nameList.Count; i<count; i++) //for/*each*/ (/*object*/var o in nameList) 
                {
                	var o = nameList.Get(i);
                    if (this.RemoveFromSubgroup(item, group, level, o)) 
                        itemIsMissing = true; 
                }
            } 

            return itemIsMissing;
        },
        
        // remove an item from the subgroup with the given name. 
        // Return true if the item was not in one of the subgroups it was supposed to be. 
//        bool 
        RemoveFromSubgroup:function(/*object*/ item, /*CollectionViewGroupInternal*/ group, /*int*/ level, /*object*/ name)
        { 
            /*CollectionViewGroupInternal*/var subgroup;

            // find the desired subgroup using the map
            /*object*/var groupNameKey = this.GetGroupNameKey(name, group); 
            subgroup = group.GetSubgroupFromMap(groupNameKey);
            if ((( subgroup instanceof CollectionViewGroupInternal ? subgroup : null) != null) &&
                group.GroupBy.NamesMatch(subgroup.Name, name)) 
            { 
                // Recursively call the RemoveFromSubgroups method on subgroup.
                return RemoveFromSubgroups(item, subgroup, level + 1); 
            }

            // find the desired subgroup using linear search
            for (var index=0, n=group.Items.Count;  index < n;  ++index) 
            {
                subgroup = group.Items.Get(index);
                subgroup = subgroup instanceof CollectionViewGroupInternal ? subgroup : null; 
                if (subgroup == null) 
                    continue;           // skip children that are not groups
 
                if (group.GroupBy.NamesMatch(subgroup.Name, name))
                {
                    // Recursively call the RemoveFromSubgroups method on subgroup.
                    return this.RemoveFromSubgroups(item, subgroup, level + 1); 
                }
            } 
 
            // the item didn't match any subgroups.  It should have.
            return true; 
        },

        // remove an item from the direct children of a group. 
        // Return true if this couldn't be done.
//        bool 
        RemoveFromGroupDirectly:function(/*CollectionViewGroupInternal*/ group, /*object*/ item) 
        { 
            var leafIndex = group.Remove(item, true);
            if (leafIndex >= 0) 
            {
            	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, item, leafIndex));
                return false;
            } 
            else
            { 
                return true; 
            }
        }, 

        // get the group name(s) for the given item 
//        object 
        GetGroupName:function(/*object*/ item, /*GroupDescription*/ groupDescription, /*int*/ level)
        { 
            if (groupDescription != null) 
            {
                return groupDescription.GroupNameFromItem(item, level, this.Culture); 
            }
            else
            {
                return UseAsItemDirectly; 
            }
        }
	});
	
	Object.defineProperties(CollectionViewGroupRoot.prototype,{

        /// <summary> 
        /// The description of grouping, indexed by level.
        /// </summary>
//        public virtual ObservableCollection<GroupDescription> 
        GroupDescriptions:
        { 
            get:function() { return this._groupBys; }
        }, 
 
        /// <summary>
        /// A delegate to select the group description as a function of the 
        /// parent group and its level.
        /// </summary>
//        public virtual GroupDescriptionSelectorCallback 
        GroupBySelector:
        { 
            get:function() { return this._groupBySelector; },
            set:function(value) { this._groupBySelector = value; } 
        }, 
        
        /// <summary>
        /// Raise this event when the (grouped) view changes
        /// </summary> 
//        public event NotifyCollectionChangedEventHandler 
        CollectionChanged:{
        	get:function(){
             	if(this._CollectionChanged === undefined){
            		this._CollectionChanged  = new Delegate();
            	}
            	return this._CollectionChanged;
        	}
        },

//        internal event EventHandler 
        GroupDescriptionChanged:{
        	get:function(){
             	if(this._GroupDescriptionChanged === undefined){
            		this._GroupDescriptionChanged  = new Delegate();
            	}
            	return this._GroupDescriptionChanged;
        	}
        }, 

//        internal IComparer 
        ActiveComparer:
        {
            get:function() { return this._comparer; }, 
            set:function(value) { this._comparer = value; }
        },
 
        /// <summary>
        /// Culture to use during sorting. 
        /// </summary>
//        internal CultureInfo 
        Culture:
        {
            get:function() { return this._view.Culture; } 
        },
 
//        internal bool 
        IsDataInGroupOrder: 
        {
            get:function() { return this._isDataInGroupOrder; }, 
            set:function(value) { this._isDataInGroupOrder = value; }
        }
	});
	
	
	CollectionViewGroupRoot.Type = new Type("CollectionViewGroupRoot", 
			CollectionViewGroupRoot, [CollectionViewGroupInternal.Type, INotifyCollectionChanged.Type]);
	return CollectionViewGroupRoot;
});
