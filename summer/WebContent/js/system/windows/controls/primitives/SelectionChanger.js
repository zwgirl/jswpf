/**
 * from ItemsControl
 * SelectionChanger
 */
define(["dojo/_base/declare", "system/Type", "generic/List", "windows/DependencyProperty", "primitives/InternalSelectedItemsStorage"], 
		function(declare, Type, List, DependencyProperty, InternalSelectedItemsStorage){
	
	var Selector = null;
	function EnsureSelector(){
		if(Selector == null){
			Selecor = using("primitives/Selector");
		}
		
		return Selector;
	}
/// <summary>
    /// Helper class for selection change batching.
    /// </summary>
//    internal class 
    var SelectionChanger = declare(null, {
    	constructor:function(/*Selector*/ s)
        {
    		EnsureSelector();
    		
            this._owner = s;
            this._active = false; 
            this._toSelect = new InternalSelectedItemsStorage(1, Selector.MatchUnresolvedEqualityComparer);
            this._toUnselect = new InternalSelectedItemsStorage(1, Selector.MatchUnresolvedEqualityComparer); 
            this._toDeferSelect = new InternalSelectedItemsStorage(1, Selector.MatchUnresolvedEqualityComparer); 
        },
        
//        private Selector _owner; 
//        private InternalSelectedItemsStorage _toSelect;
//        private InternalSelectedItemsStorage _toUnselect; 
//        private InternalSelectedItemsStorage _toDeferSelect; // Keep the items that cannot be selected because they are not in _owner.Items 
//        private bool _active;
        
        /// <summary> 
        /// Begin tracking selection changes.
        /// </summary>
//        internal void 
        Begin:function()
        { 
//            Debug.Assert(_owner.CheckAccess());
//            Debug.Assert(!_active, SR.Get(SRID.SelectionChangeActive)); 

            this._active = true;
            this._toSelect.Clear(); 
            this._toUnselect.Clear();
        },

        /// <summary> 
        /// Commit selection changes.
        /// </summary> 
//        internal void 
        End:function() 
        {
//            Debug.Assert(_owner.CheckAccess()); 
//            Debug.Assert(_active, "There must be a selection change active when you call SelectionChange.End()");

            /*List<ItemInfo>*/var unselected = new List();
            /*List<ItemInfo>*/var selected = new List(); 

            // We might have been asked to make changes that will put us in an invalid state.  Correct for this. 
            try 
            {
                this.ApplyCanSelectMultiple(); 

                this.CreateDeltaSelectionChange(unselected, selected);

                this._owner.UpdatePublicSelectionProperties(); 
            }
            finally 
            { 
                // End the selection change -- IsActive will be false after this
            	this.Cleanup(); 
            }

            // only raise the event if there were actually any changes applied
            if (unselected.Count > 0 || selected.Count > 0) 
            {
                // see bug 1459509: update Current AFTER selection change and before raising event 
                if (this._owner.IsSynchronizedWithCurrentItemPrivate) 
                	this._owner.SetCurrentToSelected();
                this._owner.InvokeSelectionChanged(unselected, selected); 
            }
        },

//        private void 
        ApplyCanSelectMultiple:function() 
        {
            if (!this._owner.CanSelectMultiple) 
            { 
//                Debug.Assert(_toSelect.Count <= 1, "_toSelect.Count was > 1");

                if (this._toSelect.Count == 1) // this is all that should be selected, unselect _selectedItems
                {
                	this._toUnselect = new InternalSelectedItemsStorage(this._owner._selectedItems);
                } 
                else // _toSelect.Count == 0, and unselect all but one of _selectedItems
                { 
                    // This is when CanSelectMultiple changes from true to false. 
                    if (this._owner._selectedItems.Count > 1 && this._owner._selectedItems.Count != this._toUnselect.Count + 1)
                    { 
                        // they didn't deselect enough; force deselection
                        /*ItemInfo*/var selectedItem = this._owner._selectedItems.Get(0);

                        this._toUnselect.Clear(); 
                        for(var i=0; i< this._owner._selectedItems.Count; i++) //foreach (ItemInfo info in this._owner._selectedItems)
                        { 
                        	var info = this._owner._selectedItems.Get(i);
                            if (info != selectedItem) 
                            {
                            	this._toUnselect.Add(info); 
                            }
                        }
                    }
                } 
            }
        }, 

//        private void 
        CreateDeltaSelectionChange:function(/*List<ItemInfo>*/ unselectedItems, /*List<ItemInfo>*/ selectedItems)
        { 
            for (var i = 0; i < this._toDeferSelect.Count; i++)
            {
                /*ItemInfo*/var info = this._toDeferSelect.Get(i);
                // If defered selected item exists in Items - move it to _toSelect 
                if (this._owner.Items.Contains(info.Item))
                { 
                	this._toSelect.Add(info); 
                	this._toDeferSelect.Remove(info);
                    i--; 
                }
            }

            if (this._toUnselect.Count > 0 || this._toSelect.Count > 0) 
            {
                // Step 1:  process the items to be unselected 
                // 1a:  handle the resolved items first. 
//                using (_owner._selectedItems.DeferRemove())
//                { 
            	var dispose = this._owner._selectedItems.DeferRemove();
                    if (this._toUnselect.ResolvedCount > 0)
                    {
                        for(var i=0; i<this._toUnselect.Count; i++) //foreach (ItemInfo info in _toUnselect)
                        { 
                        	var info = this._toUnselect.Get(i);
                            if (info.IsResolved)
                            { 
                            	this._owner.ItemSetIsSelected(info, false); 
                                if (this._owner._selectedItems.Remove(info))
                                { 
                                    unselectedItems.Add(info);
                                }
                            }
                        } 
                    }

                    // 1b: handle unresolved items second, so they don't steal items 
                    // from _selectedItems that belong to resolved items
                    if (this._toUnselect.UnresolvedCount > 0) 
                    {
                        for(var i=0; i<this._toUnselect.Count; i++) //foreach (ItemInfo info in _toUnselect)
                        {
                        	var info = this._toUnselect.Get(i);
                            if (!info.IsResolved) 
                            {
                                /*ItemInfo*/var match = this._owner._selectedItems.FindMatch(ItemInfo.Key(info)); 
                                if (match != null) 
                                {
                                    this._owner.ItemSetIsSelected(match, false); 
                                    this._owner._selectedItems.Remove(match);
                                    unselectedItems.Add(match);
                                }
                            } 
                        }
                    } 
//                } 
                dispose.Dispose();

                // Step 2:  process items to be selected 
//                using (_toSelect.DeferRemove())
//                {
            	dispose = this._toSelect.DeferRemove();
                    // 2a: handle the resolved items first
                    if (this._toSelect.ResolvedCount > 0) 
                    {
                        /*List<ItemInfo>*/var toRemove = (this._toSelect.UnresolvedCount > 0) 
                            ? new List/*<ItemInfo>*/() : null; 

                        for(var i=0; i<this._toSelect.Count; i++) //foreach (ItemInfo info in _toSelect) 
                        {
                        	var info = this._toSelect.Get(i);
                            if (info.IsResolved)
                            {
                            	this._owner.ItemSetIsSelected(info, true); 
                                if (!this._owner._selectedItems.Contains(info))
                                { 
                                	this._owner._selectedItems.Add(info); 
                                    selectedItems.Add(info);
                                } 

                                if (toRemove != null)
                                    toRemove.Add(info);
                            } 
                        }

                        // remove the resolved items from _toSelect, so that 
                        // it contains only unresolved items for step 2b
                        if (toRemove != null) 
                        {
                            for(var i=0; i<toRemove.Count; i++) //foreach (ItemInfo info in toRemove)
                            {
                            	this._toSelect.Remove(toRemove.Get(i)); 
                            }
                        } 
                    } 

                    // 2b: handle unresolved items second, so they select different 
                    // items than the ones belonging to resolved items
                    if (this._toSelect.UnresolvedCount > 0)
                    {
                        // At this point, _toSelect contains only unresolved items, 
                        // each of which should be resolved to an item that is not
                        // already selected.  We do this by iterating through each 
                        // item (from Items);  any item that matches something in 
                        // _toSelect and is not already selected becomes selected.
                        for (var index = 0; index < this._owner.Items.Count; ++index) 
                        {
                            /*ItemInfo*/var info = this._owner.NewItemInfo(this._owner.Items.Get(index), null, index);
                            /*ItemInfo*/var key = new ItemInfo(info.Item, ItemInfo.KeyContainer, -1);
                            if (this._toSelect.Contains(key) && !this._owner._selectedItems.Contains(info)) 
                            {
                            	this._owner.ItemSetIsSelected(info, true); 
                            	this._owner._selectedItems.Add(info); 
                                selectedItems.Add(info);
                                this._toSelect.Remove(key); 
                            }
                        }

                        // after the loop, _toSelect may still contain leftover items. 
                        // These are just abandoned;  they correspond to attempts to select
                        // (say) 5 instances of some item when Items only contains 3. 
                    } 
                }
//            }
        	dispose.Dispose();
        },

        /// <summary> 
        /// Queue something to be added to the selection.  Does nothing if the item is already selected. 
        /// </summary>
        /// <param name="o"></param> 
        /// <param name="assumeInItemsCollection"></param>
        /// <returns>true if the Selection was queued</returns>
//        internal bool 
        Select:function(/*ItemInfo*/ info, /*bool*/ assumeInItemsCollection)
        { 
//            Debug.Assert(_owner.CheckAccess());
//            Debug.Assert(_active, SR.Get(SRID.SelectionChangeNotActive)); 
//            Debug.Assert(info != null, "parameter info should not be null"); 

            // Disallow selecting !IsSelectable things 
            if (!EnsureSelector().ItemGetIsSelectable(info)) return false;

            // Disallow selecting things not in Items.FlatView
            if (!assumeInItemsCollection) 
            {
                if (!this._owner.Items.Contains(info.Item)) 
                { 
                    // If user selected item is not in the Items yet - defer the selection
                    if (!this._toDeferSelect.Contains(info)) 
                    	this._toDeferSelect.Add(info);
                    return false;
                }
            } 

            /*ItemInfo*/var key = ItemInfo.Key(info); 

            // To support Unselect(o) / Select(o) where o is already selected.
            if (this._toUnselect.Remove(key)) 
            {
                return true;
            }

            // Ignore if the item is already selected
            if (this._owner._selectedItems.Contains(info)) return false; 

            // Ignore if the item has already been requested to be selected.
            if (!key.IsKey && this._toSelect.Contains(key)) return false; 

            // enforce that we only select one thing in the CanSelectMultiple=false case.
            if (!this._owner.CanSelectMultiple && this._toSelect.Count > 0)
            { 
                // If it was the item telling us this, turn around and set IsSelected = false
                // This will basically only happen in a Refresh situation where multiple items in the collection were selected but 
                // CanSelectMultiple = false. 
                for(var i=0; i<this._toSelect.Count; i++) //foreach (ItemInfo item in _toSelect)
                { 
                	this._owner.ItemSetIsSelected(this._toSelect.Get(i), false);
                }
                this._toSelect.Clear();
            } 

            this._toSelect.Add(info); 
            return true; 
        },

        /// <summary>
        /// Queue something to be removed from the selection.  Does nothing if the item is not already selected.
        /// </summary>
        /// <param name="o"></param> 
        /// <returns>true if the item was queued for unselection.</returns>
//        internal bool 
        Unselect:function(/*ItemInfo*/ info) 
        { 
//            Debug.Assert(_owner.CheckAccess());
//            Debug.Assert(_active, SR.Get(SRID.SelectionChangeNotActive)); 
//            Debug.Assert(info != null, "info should not be null");

            /*ItemInfo*/var key = ItemInfo.Key(info);

            this._toDeferSelect.Remove(info);

            // To support Select(o) / Unselect(o) where o is not already selected. 
            if (this._toSelect.Remove(key))
            { 
                return true;
            }

            // Ignore if the item is not already selected 
            if (!this._owner._selectedItems.Contains(key)) return false;

            // Ignore if the item has already been queued for unselection. 
            if (this._toUnselect.Contains(info)) return false;

            this._toUnselect.Add(info);
            return true;
        },

        /// <summary>
        /// Makes sure that the current selection is valid; Performs a SelectionChange it if it's not. 
        /// </summary> 
//        internal void 
        Validate:function()
        { 
        	this.Begin();
        	this.End();
        },

        /// <summary>
        /// Cancels the currently active SelectionChange. 
        /// </summary> 
//        internal void 
        Cancel:function()
        { 

//            Debug.Assert(_owner.CheckAccess());

        	this.Cleanup(); 
        },

//        internal void 
        CleanupDeferSelection:function() 
        {
            if (this._toDeferSelect.Count > 0) 
            {
            	this._toDeferSelect.Clear();
            }
        },

//        internal void 
        Cleanup:function() 
        { 
        	this._active = false;
            if (this._toSelect.Count > 0) 
            {
            	this._toSelect.Clear();
            }
            if (this._toUnselect.Count > 0) 
            {
            	this._toUnselect.Clear(); 
            } 
        },

        /// <summary>
        /// Select just this item; all other items in SelectedItems will be removed.
        /// </summary>
        /// <param name="item"></param> 
        /// <param name="assumeInItemsCollection"></param>
//        internal void 
        SelectJustThisItem:function(/*ItemInfo*/ info, /*bool*/ assumeInItemsCollection) 
        { 
        	this.Begin();
        	this.CleanupDeferSelection(); 

            try
            {
                // was this item already in the selection? 
                var isSelected = false;

                // go backwards in case a selection is rejected; then they'll still have the same SelectedItem 
                for (var i = this._owner._selectedItems.Count - 1; i >= 0; i--)
                { 
                    if (info != this._owner._selectedItems[i])
                    {
                    	this.Unselect(this._owner._selectedItems[i]);
                    } 
                    else
                    { 
                        isSelected = true; 
                    }
                } 

                if (!isSelected && info != null && info.Item != DependencyProperty.UnsetValue)
                {
                	this.Select(info, assumeInItemsCollection); 
                }
            } 
            finally 
            {
            	this.End(); 
            }
        }       

   
    });
    
    Object.defineProperties(SelectionChanger.prototype, {
        /// <summary>
        /// True if there is a SelectionChange currently in progress.
        /// </summary>
//        internal bool 
        IsActive:
        {
            get:function() { return this._active; } 
        } 

    });
 
    SelectionChanger.Type = new Type("SelectionChanger", SelectionChanger, Object.Type);
    return SelectionChanger;
});
