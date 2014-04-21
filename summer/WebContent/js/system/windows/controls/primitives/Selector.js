/**
 * Second Check 12-06
 * Selector
 */

define(["dojo/_base/declare", "system/Type", "controls/ItemsControl", "internal.data/BindingExpressionUncommonField",
        "windows/FrameworkElement", "generic/Dictionary", "collections/IEnumerable", "windows/RequestFlags",
        "internal.data/CollectionViewSource", "windows/UIElement", "generic/List", "windows/DependencyProperty",
        "windows/PropertyPath", "data/BindingExpression", "data/BindingExpressionBase", "system/EventHandler",
        "input/KeyboardNavigation", "specialized/BitVector32", "controls/SelectedItemCollection",
        "specialized/NotifyCollectionChangedEventHandler", "collections/IEqualityComparer",
        "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback",
        "controls/DeferredSelectedIndexReference", "controls/Separator", "primitives/InternalSelectedItemsStorage",
        "controls/SelectionChangedEventArgs", "controls/SelectionChangedEventHandler"], 
		function(declare, Type, ItemsControl, BindingExpressionUncommonField,
				FrameworkElement, Dictionary, IEnumerable, RequestFlags, 
				CollectionViewSource, UIElement, List, DependencyProperty, 
				PropertyPath, BindingExpression, BindingExpressionBase, EventHandler,
				KeyboardNavigation, BitVector32, SelectedItemCollection,
				NotifyCollectionChangedEventHandler, IEqualityComparer,
				FrameworkPropertyMetadata, PropertyChangedCallback,
				DeferredSelectedIndexReference, Separator, InternalSelectedItemsStorage,
				SelectionChangedEventArgs, SelectionChangedEventHandler){
	
    var CacheBits = declare(null, {
    	
    });
        // This flag is true while syncing the selection and the currency.  It 
        // is used to avoid reentrancy:  e.g. when the currency changes we want
        // to change the selection accordingly, but that selection change should 
        // not try to change currency. 
    CacheBits.SyncingSelectionAndCurrency    = 0x00000001;
    CacheBits.CanSelectMultiple              = 0x00000002; 
    CacheBits.IsSynchronizedWithCurrentItem  = 0x00000004;
    CacheBits.SkipCoerceSelectedItemCheck    = 0x00000008;
    CacheBits.SelectedValueDrivesSelection   = 0x00000010;
    CacheBits.SelectedValueWaitsForItems     = 0x00000020; 
    CacheBits.NewContainersArePending        = 0x00000040;
    
//  private class 
    var ChangeInfo = declare(null, {
    	constructor:function(/*InternalSelectedItemsStorage*/ toAdd, /*InternalSelectedItemsStorage*/ toRemove) 
        {
            this._toAdd = toAdd; 
            this._toRemove = toRemove;
        }
    });

    Object.defineProperties(ChangeInfo.prototype, {
//        public InternalSelectedItemsStorage 
        ToAdd: 
        {
        	get:function()
        	{ 
        		return this._toAdd;
        	},
        	/*private */set:function(value){
        		this._toAdd = value;
        	} 
        }, 
//        public InternalSelectedItemsStorage 
        ToRemove: 
        {    
        	get:function()
        	{ 
        		return this._toRemove;
        	},
        	/*private */set:function(value){
        		this._toRemove = value;
        	} 
        }
    });
    
//    private static readonly UncommonField<ChangeInfo> 
    var ChangeInfoField = new UncommonField();
    
//    private class 
    var ItemInfoEqualityComparer =declare(IEqualityComparer, { 
        constructor:function(/*bool */matchUnresolved)
        { 
            this._matchUnresolved = matchUnresolved; 
        },

//        bool IEqualityComparer<ItemInfo>.
    	Equals:function(/*ItemInfo*/ x, /*ItemInfo*/ y)
        {
            if (Object.ReferenceEquals(x, y))
                return true; 
            return (x == null) ? (y == null) : x.Equals(y, this._matchUnresolved);
        }, 

//        int IEqualityComparer<ItemInfo>.
        GetHashCode:function(/*ItemInfo*/ x)
        { 
            return x.GetHashCode();
        }
    });

//    private static readonly ItemInfoEqualityComparer 
    var MatchExplicitEqualityComparer = new ItemInfoEqualityComparer(false); 
//    private static readonly ItemInfoEqualityComparer 
    var MatchUnresolvedEqualityComparer = new ItemInfoEqualityComparer(true);
    
  /// <summary>
    /// Helper class for selection change batching.
    /// </summary>
//    internal class 
    var SelectionChanger = declare(null, {
    	constructor:function(/*Selector*/ s)
        {
            this._owner = s;
            this._active = false; 
            this._toSelect = new InternalSelectedItemsStorage(1, MatchUnresolvedEqualityComparer);
            this._toUnselect = new InternalSelectedItemsStorage(1, MatchUnresolvedEqualityComparer); 
            this._toDeferSelect = new InternalSelectedItemsStorage(1, MatchUnresolvedEqualityComparer); 
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
                    
                	dispose.Dispose();
                }
//            }
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
            if (!Selector.ItemGetIsSelectable(info)) return false;

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
                    if (info != this._owner._selectedItems.Get(i))
                    {
                    	this.Unselect(this._owner._selectedItems.Get(i));
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
 
    SelectionChanger.Type = new Type("SelectionChanger", SelectionChanger, [Object.Type]);
    
    var ListBox = null;
    function EnsureListBox(){
    	if(ListBox == null){
    		ListBox = using("controls/ListBox");
    	}
    	
    	return ListBox;
    }
    
//    var SelectionChanger = null;
    function EnsureSelectionChanger(){
    	if(SelectionChanger == null){
    		SelectionChanger = using("primitives/SelectionChanger");
    	}
    	
    	return SelectionChanger;
    }
    
    
 // used to retrieve the value of an item, according to the SelectedValuePath
//    private static readonly BindingExpressionUncommonField 
    var ItemValueBindingExpression = new BindingExpressionUncommonField();
    
	var Selector = declare("Selector", ItemsControl,{
		constructor:function(){
	        this.Items.CurrentChanged.Combine(new EventHandler(this, this.OnCurrentChanged)); 
	        this.ItemContainerGenerator.StatusChanged.Combine(new EventHandler(this, this.OnGeneratorStatusChanged));
	        this._focusEnterMainFocusScopeEventHandler = new EventHandler(this, this.OnFocusEnterMainFocusScope);
//            KeyboardNavigation.Current.FocusEnterMainFocusScope.Combine(this._focusEnterMainFocusScopeEventHandler); 

            /*ObservableCollection<object>*/
            var selectedItems = new SelectedItemCollection(this); 
            this.SetValue(Selector.SelectedItemsPropertyKey, selectedItems); 
            selectedItems.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnSelectedItemsCollectionChanged));
 
            // to prevent this inherited property from bleeding into nested selectors, set this locally to
            // false at construction time
            this.SetValue(Selector.IsSelectionActivePropertyKey, false);
            
//          private BitVector32 
            this._cacheValid = new BitVector32(CacheBits.CanSelectMultiple);
            
         // The selected items that we interact with.  Most of the time when SelectedItems 
            // is in use, this is identical to the value of the SelectedItems property, but
            // differs in type, and will differ in content in the case where you set or modify
            // SelectedItems and we need to switch our selection to what was just provided.
            // This is our internal representation of the selection and generally should be modified 
            // only by SelectionChanger.  Internal classes may read this for efficiency's sake
            // to avoid putting SelectedItems "in use" but we can't really expose this externally. 
//            internal InternalSelectedItemsStorage 
            this._selectedItems = new InternalSelectedItemsStorage(1, MatchExplicitEqualityComparer);
            // the container that is being cleared.   It doesn't require much action.
//            private DependencyObject 
            this._clearingContainer = null;
            
            // see comment on SelectionChange property 
//            private SelectionChanger 
            this._selectionChangeInstance = null;
            
            // Used by ListBox and ComboBox to determine if the mouse actually entered the 
            // List/ComboBoxItem before it focus which calls BringIntoView
//            private Point 
//            this._lastMousePosition = new Point();
		},
 
        /// <summary>
        ///     An event fired when the selection changes.
        /// </summary>
//        public event SelectionChangedEventHandler 
        AddSelectionChangedHandler:function(value){
        	this.AddHandler(Selector.SelectionChangedEvent, value);
		},
		
        RemoveSelectionChangedHandler:function(value){
        	this.RemoveHandler(Selector.SelectionChangedEvent, value);
		},
//        { 
//            add { AddHandler(SelectionChangedEvent, value); } 
//            remove { RemoveHandler(SelectionChangedEvent, value); }
//        }, 

//        private void 
        SetSynchronizationWithCurrentItem:function()
        { 
            /*bool?*/var isSynchronizedWithCurrentItem = this.IsSynchronizedWithCurrentItem;
            var oldSync = this.IsSynchronizedWithCurrentItemPrivate; 
            var newSync; 

            if (isSynchronizedWithCurrentItem) 
            {
                // if there's a value, use it
                newSync = isSynchronizedWithCurrentItem;
            } 
            else
            { 
                // don't do the default logic until the end of initialization. 
                // This reduces the dependence on the order of property-setting.
                if (!this.IsInitialized) 
                    return;

                // when the value is null, synchronize iff selection mode is Single
                // and there's a non-default view. 
                /*SelectionMode*/var mode = this.GetValue(EnsureListBox().SelectionModeProperty);
                newSync = (mode == SelectionMode.Single) && 
                            !CollectionViewSource.IsDefaultView(this.Items.CollectionView); 
            }
 
            this.IsSynchronizedWithCurrentItemPrivate = newSync;

            if (!oldSync && newSync)
            { 
                // if the selection has already been set, honor it and bring currency
                // into [....].  (Typical case:  <ListBox SelectedItem=x IsSync=true/>) 
                // Otherwise, bring selection into [....] with currency. 
                if (this.SelectedItem != null)
                { 
                	this.SetCurrentToSelected();
                }
                else
                { 
                	this.SetSelectedToCurrent();
                } 
            } 
        },
        
        // Select an item whose value matches the given value
//        private object 
        SelectItemWithValue:function(/*object*/ value) 
        {
        	this._cacheValid.Set(CacheBits.SelectedValueDrivesSelection, true); 
 
            /*object*/var item;
 
            // look through the items for one whose value matches the given value
            if (this.HasItems)
            {
                var index; 
                var indexOut = {
                	"index" : index
                };
                item = this.FindItemWithValue(value, /*out index*/indexOut);
                index = indexOut.index;
 
                // We can assume it's in the collection because we just searched 
                // through the collection to find it.
                this.SelectionChange.SelectJustThisItem(this.NewItemInfo(item, null, index), true /* assumeInItemsCollection */); 
            }
            else
            {
                // if there are no items, protect SelectedValue from being overwritten 
                // until items show up.  This enables a SelectedValue set from markup
                // to set the initial selection when the items eventually appear. 
                item = DependencyProperty.UnsetValue; 
                this._cacheValid.Set(CacheBits.SelectedValueWaitsForItems, true);
            } 

            this._cacheValid.Set(CacheBits.SelectedValueDrivesSelection, false);
            return item;
        },

//        private object 
        FindItemWithValue:function(/*object*/ value, /*out int index*/indexOut) 
        { 
        	indexOut.index = -1;
 
            if (!this.HasItems)
                return DependencyProperty.UnsetValue;

            // use a representative item to determine which kind of binding to use (XML vs. CLR) 
            /*BindingExpression*/var bindingExpr = this.PrepareItemValueBinding(this.Items.GetRepresentativeItem());
 
            if (bindingExpr == null) 
                return DependencyProperty.UnsetValue;   // no suitable item found
 
            // optimize for case where there is no SelectedValuePath (meaning
            // that the value of the item is the item itself, or the InnerText
            // of the item)
            if (String.IsNullOrEmpty(this.SelectedValuePath)) 
            {
                // when there's no SelectedValuePath, the binding's Path 
                // is either empty (CLR) or "/InnerText" (XML) 
                var path = bindingExpr.ParentBinding.Path.Path;
//                Debug.Assert(String.IsNullOrEmpty(path) || path == "/InnerText"); 
                if (String.IsNullOrEmpty(path))
                {
                    // CLR - item is its own selected value
                	indexOut.index = this.Items.IndexOf(value); 
                    if (indexOut.index >= 0)
                        return value; 
                    else 
                        return DependencyProperty.UnsetValue;
                } 
                else
                {
                    // XML - use the InnerText as the selected value
                    return SystemXmlHelper.FindXmlNodeWithInnerText(Items, value, indexOut); 
                }
            } 
 
            /*Type*/var selectedType = (value != null) ?  value.GetType() : null;
            /*object*/var selectedValue = value; 
            /*DynamicValueConverter*/var converter = new DynamicValueConverter(false);

            indexOut.index = 0;
            for(var i=0; i<this.Items.Count; i++) //foreach (objectv current in Items) 
            {
            	var current =this.Items.Get(i);
                bindingExpr.Activate(current); 
                /*object*/var itemValue = bindingExpr.Value; 
                if (this.VerifyEqual(value, selectedType, itemValue, converter))
                { 
                    bindingExpr.Deactivate();
                    return current;
                }
                ++indexOut.index; 
            }
            bindingExpr.Deactivate(); 
 
            indexOut.index = -1;
            return DependencyProperty.UnsetValue; 
        },

//        private bool 
        VerifyEqual:function(/*object*/ knownValue, /*Type*/ knownType, /*object*/ itemValue, /*DynamicValueConverter*/ converter)
        { 
            /*object*/var tempValue = knownValue;
 
            if (knownType != null && itemValue != null) 
            {
                /*Type*/var itemType = itemValue.GetType(); 

                // determine if selectedValue is comparable to itemValue, convert if necessary
                // using a DefaultValueConverter
                if (!knownType.IsAssignableFrom(itemType)) 
                {
                    tempValue = converter.Convert(knownValue, itemType); 
                    if (tempValue == DependencyProperty.UnsetValue) 
                    {
                        // can't convert, keep original value for the following object comparison 
                        tempValue = knownValue;
                    }
                }
            } 

            return Object.Equals(tempValue, itemValue); 
        },

        /// <summary> 
        /// Prepare the binding on the ItemValue property, creating it if necessary.
        /// Use the item to decide what kind of binding (XML vs. CLR) to use.
        /// </summary>
        /// <param name="item"></param> 
//        private BindingExpression 
        PrepareItemValueBinding:function(/*object*/ item)
        { 
            if (item == null) 
                return null;
 
            /*Binding*/var binding;
            var useXml = false; //SystemXmlHelper.IsXmlNode(item);

            /*BindingExpression*/var bindingExpr = ItemValueBindingExpression.GetValue(this); 

            // replace existing binding if it's the wrong kind 
            if (bindingExpr != null) 
            {
                binding = bindingExpr.ParentBinding; 
                var usesXml = (binding.XPath != null);
                if ((!usesXml && useXml) || (usesXml && !useXml))
                {
                    ItemValueBindingExpression.ClearValue(this); 
                    bindingExpr = null;
                } 
            } 

            if (bindingExpr == null) 
            {
                // create the binding
                binding = new Binding();
 
                // Set source to null so binding does not use ambient DataContext
                binding.Source = null; 
 
                if (useXml)
                { 
                    binding.XPath = this.SelectedValuePath;
                    binding.Path = new PropertyPath("/InnerText");
                }
                else 
                {
                    binding.Path = new PropertyPath(this.SelectedValuePath); 
                } 

                bindingExpr = BindingExpressionBase.CreateUntargetedBindingExpression(this, binding); 
                ItemValueBindingExpression.SetValue(this, bindingExpr);
            }

            return bindingExpr; 
        },
 
        /// <summary>
        /// Select multiple items.
        /// </summary>
        /// <param name="selectedItems">Collection of items to be selected.</param> 
        /// <returns>true if all items have been selected.</returns>
//        internal bool 
        SetSelectedItemsImpl:function(/*IEnumerable*/ selectedItems) 
        { 
            var succeeded = false;
 
            if (!this.SelectionChange.IsActive)
            {
            	this.SelectionChange.Begin();
            	this.SelectionChange.CleanupDeferSelection(); 
                /*ObservableCollection<object>*/var oldSelectedItems = this.GetValue(Selector.SelectedItemsImplProperty);
 
                try 
                {
                    // Unselect everything in oldSelectedItems. 
                    if (oldSelectedItems != null)
                    {
//                        for/*each*/ (/*object*/var currentlySelectedItem in oldSelectedItems)
                        for/*each*/ (/*object*/var i=0; i<oldSelectedItems.Count; i++)
                        { 
                        	this.SelectionChange.Unselect(this.NewUnresolvedItemInfo(oldSelectedItems.Get(i)));
                        } 
                    } 

                    if (selectedItems != null) 
                    {
                        // Make sure that we can select every items.
//                        for/*each*/ (/*object*/var item in selectedItems)
                    	for/*each*/ (/*object*/var i=0; i<selectedItems.Count; i++) //item in selectedItems)
                        { 
                            if (!SelectionChange.Select(this.NewUnresolvedItemInfo(selectedItems.Get(i)), false /* assumeInItemsCollection */))
                            { 
                            	this.SelectionChange.Cancel(); 
                                return false;
                            } 
                        }
                    }

                    this.SelectionChange.End(); 
                    succeeded = true;
                } 
                finally 
                {
                    if (!succeeded) 
                    {
                    	this.SelectionChange.Cancel();
                    }
                } 
            }
 
            return succeeded; 
        },
 
//        private void 
        OnSelectedItemsCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
            // Ignore selection changes we're causing.
            if (this.SelectionChange.IsActive) 
            {
                return; 
            } 

            if (!this.CanSelectMultiple) 
            {
                throw new InvalidOperationException(SR.Get(SRID.ChangingCollectionNotSupported));
            }
 
            this.SelectionChange.Begin();
            var succeeded=false; 
            try 
            {
                switch (e.Action) 
                {
                    case NotifyCollectionChangedAction.Add:
                        if (e.NewItems.Count != 1)
                            throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 

                        this.SelectionChange.Select(this.NewUnresolvedItemInfo(e.NewItems.Get(0)), false /* assumeInItemsCollection */); 
                        break; 

                    case NotifyCollectionChangedAction.Remove: 
                        if (e.OldItems.Count != 1)
                            throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));

                        this.SelectionChange.Unselect(this.NewUnresolvedItemInfo(e.OldItems.Get(0))); 
                        break;
 
                    case NotifyCollectionChangedAction.Reset: 
                    	this.SelectionChange.CleanupDeferSelection();
                        for (var i = 0; i < this._selectedItems.Count; i++) 
                        {
                        	this.SelectionChange.Unselect(this._selectedItems.Get(i));
                        }
 
                        /*ObservableCollection<object>*/var userSelectedItems = sender;
 
                        for (var i = 0; i < userSelectedItems.Count; i++) 
                        {
                        	this.SelectionChange.Select(this.NewUnresolvedItemInfo(userSelectedItems.Get(i)), false /* assumeInItemsCollection */); 
                        }
                        break;

                    case NotifyCollectionChangedAction.Replace: 
                        if (e.NewItems.Count != 1 || e.OldItems.Count != 1)
                            throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
 
                        this.SelectionChange.Unselect(this.NewUnresolvedItemInfo(e.OldItems.Get(0)));
                        this.SelectionChange.Select(this.NewUnresolvedItemInfo(e.NewItems.Get(0)), false /* assumeInItemsCollection */); 
                        break;

                    case NotifyCollectionChangedAction.Move:
                        break;  // order within SelectedItems doesn't matter 

                    default: 
                        throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 
                }
 
                this.SelectionChange.End();
                succeeded = true;
            }
            finally 
            {
                if (!succeeded) 
                { 
                	this.SelectionChange.Cancel();
                } 
            }
        },
        
        /// <summary>
        /// Clear the IsSelected property from containers that are no longer used.  This is done for container recycling; 
        /// If we ever reuse a container with a stale IsSelected value the UI will incorrectly display it as selected.
        /// </summary>
//        protected override void 
        ClearContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item)
        { 
        	ItemsControl.prototype.ClearContainerForItemOverride.call(this, element, item);
 
            //This check ensures that selection is cleared only for generated containers. 
            if ( !this.IsItemItsOwnContainer(item))
            { 
                try
                {
                    this._clearingContainer = element;
                    element.ClearValue(Selector.IsSelectedProperty); 
                }
                finally 
                { 
                    this._clearingContainer = null;
                } 
            }
        },

//        internal void 
        SetInitialMousePosition:function()
        {
            this._lastMousePosition = Mouse.GetPosition(this);
        }, 

        // Tracks mouse movement. 
        // Returns true if the mouse moved from the last time this method was called. 
//        internal bool 
        DidMouseMove:function()
        { 
            /*Point*/
        	var newPosition = Mouse.GetPosition(this);
            if (newPosition != this._lastMousePosition)
            {
                this._lastMousePosition = newPosition; 
                return true;
            } 
 
            return false;
        }, 

//        internal void 
        ResetLastMousePosition:function()
        {
//            this._lastMousePosition = new Point(); //cym comment
        },
 
        /// <summary> 
        /// Select all items in the collection.
        /// Assumes that CanSelectMultiple is true 
        /// </summary>
//        internal virtual void 
        SelectAllImpl:function()
        {
//        	 Debug.Assert(CanSelectMultiple, "CanSelectMultiple should be true when calling SelectAllImpl"); 
        	this.SelectionChange.Begin(); 
        	this.SelectionChange.CleanupDeferSelection(); 
            try
            { 
                for/*each*/ (var i=0; i<this.Items.Count; i++) ///*object*/var current in Items)
                {
                	var current =this.Items.Get(i);
                    /*ItemInfo*/var info = this.NewItemInfo(current, null, i); 
                    this.SelectionChange.Select(info, true /* assumeInItemsCollection */);
                } 
            } 
            finally
            { 
            	this.SelectionChange.End();
            }
        },

 
        /// <summary>
        /// Unselect all items in the collection. 
        /// </summary> 
//        internal virtual void 
        UnselectAllImpl:function()
        { 
        	this.SelectionChange.Begin();
        	this.SelectionChange.CleanupDeferSelection();
            try
            { 
                /*object*/var selectedItem = this.InternalSelectedItem;
 
                for(var i=0; i<this._selectedItems.Count; i++) ///*each*/ (/*ItemInfo*/var info in this._selectedItems) 
                {
                	this.SelectionChange.Unselect(this._selectedItems.Get(i)); 
                }
            }
            finally
            { 
            	this.SelectionChange.End();
            } 
        },
 
        /// <summary>
        /// Updates the current selection when Items has changed
        /// </summary>
        /// <param name="e">Information about what has changed</param> 
//        protected override void 
        OnItemsChanged:function(/*NotifyCollectionChangedEventArgs*/ e)
        { 
            // When items become available, reevaluate the choice of algorithm 
            // used by _selectedItems.
            if (e.Action == NotifyCollectionChangedAction.Reset || 
                (e.Action == NotifyCollectionChangedAction.Add &&
                 e.NewStartingIndex == 0))
            {
            	this.ResetSelectedItemsAlgorithm(); 
            }
 
            ItemsControl.prototype.OnItemsChanged.call(this, e); 

            // Do not coerce the SelectedIndexProperty if it holds a DeferredSelectedIndexReference 
            // because this deferred reference object is guaranteed to produce a pre-coerced value.
            // Also if you did coerce it then you will lose the attempted performance optimization
            // because it will get dereferenced immediately in order to supply a baseValue for coersion.
 
            /*EffectiveValueEntry*/var entry = this.GetValueEntry(
                        this.LookupEntry(Selector.SelectedIndexProperty.GlobalIndex), 
                        Selector.SelectedIndexProperty, 
                        null,
                        RequestFlags.DeferredReferences); 

            if (!entry.IsDeferredReference ||
                !(entry.Value instanceof DeferredSelectedIndexReference))
            { 
                this.CoerceValue(Selector.SelectedIndexProperty);
            } 
 
            this.CoerceValue(Selector.SelectedItemProperty);
 
            if (this._cacheValid.Get(CacheBits.SelectedValueWaitsForItems) &&
                !Object.Equals(this.SelectedValue, this.InternalSelectedValue))
            {
                // This sets the selection from SelectedValue when SelectedValue 
                // was set prior to the arrival of any items to select, provided
                // that SelectedIndex or SelectedItem didn't already do it. 
            	this.SelectItemWithValue(SelectedValue); 
            }
 
            switch (e.Action)
            {
                case NotifyCollectionChangedAction.Add:
                { 
                	this.SelectionChange.Begin();
                    try 
                    { 
                        /*ItemInfo*/var info = this.NewItemInfo(e.NewItems.Get(0), null, e.NewStartingIndex);
                        // If we added something, see if it was set be selected and [....]. 
                        if (this.InfoGetIsSelected(info))
                        {
                        	this.SelectionChange.Select(info, true /* assumeInItemsCollection */);
                        } 
                    }
                    finally 
                    { 
                    	this.SelectionChange.End();
                    } 
                    break;
                }

                case NotifyCollectionChangedAction.Replace: 
                {
                    // RemoveFromSelection works, with one wrinkle.  If the 
                    // replaced item was selected, the old item is in _selectedItems, 
                    // but its container now holds the new item.  The Remove code will
                    // update _selectedItems correctly, except for the step that 
                    // sets container.IsSelected=false.   We do that here as a special case.
                	this.ItemSetIsSelected(this.ItemInfoFromIndex(e.NewStartingIndex), false);
                	this.RemoveFromSelection(e);
                    break; 
                }
 
                case NotifyCollectionChangedAction.Remove: 
                {
                	this.RemoveFromSelection(e); 
                    break;
                }

                case NotifyCollectionChangedAction.Move: 
                {
                	this.SelectionChange.Validate(); 
                    break; 
                }
 
                case NotifyCollectionChangedAction.Reset:
                {
                    // catastrophic update -- need to resynchronize everything.
 
                    // If we remove all the items we clear the deferred selection
                    if (this.Items.IsEmpty) 
                    	this.SelectionChange.CleanupDeferSelection(); 

                    // This is to support the MasterDetail scenario. 
                    // When the Items is refreshed, Items.Current could be the old selection for this view.
                    if (this.Items.CurrentItem != null && this.IsSynchronizedWithCurrentItemPrivate == true)
                    {
                        // 
                    	this.SetSelectedToCurrent(); 
                    } 
                    else
                    { 
                    	this.SelectionChange.Begin();
                        try
                        {
                            // Find where previously selected items have moved to 
                        	this.LocateSelectedItems(null, /*deselectMissingItems:*/true);
 
                            // Select everything in Items that is selected but isn't in the _selectedItems. 
                            if (this.ItemsSource == null)
                            { 
                                for (var i = 0; i < this.Items.Count; i++)
                                {
                                    /*ItemInfo*/var info = this.ItemInfoFromIndex(i);
 
                                    // This only works for items that know they're selected:
                                    // items that are UI elements or items that have had their UI generated. 
                                    if (this.InfoGetIsSelected(info)) 
                                    {
                                        if (!this._selectedItems.Contains(info)) 
                                        {
                                        	this.SelectionChange.Select(info, true /* assumeInItemsCollection */);
                                        }
                                    } 
                                }
                            } 
                        } 
                        finally
                        { 
                        	this.SelectionChange.End();
                        }
                    }
                    break; 
                }
                default: 
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 
            }
        }, 
        

        /// <summary>
        ///     Adjust ItemInfos when the Items property changes.
        /// </summary> 
//        internal override void 
        AdjustItemInfoOverride:function(/*NotifyCollectionChangedEventArgs*/ e)
        { 
        	this.AdjustItemInfos(e, this._selectedItems); 
        	ItemsControl.prototype.AdjustItemInfoOverride.call(this, e);
        }, 

//        void 
        RemoveFromSelection:function(/*NotifyCollectionChangedEventArgs*/ e)
        {
            this.SelectionChange.Begin(); 
            try
            { 
                // if they removed something in a selection, remove it. 
                // When End() commits the changes it will update SelectedIndex.
                /*ItemInfo*/
            	var info = this.NewItemInfo(e.OldItems.Get(0), ItemInfo.SentinelContainer, e.OldStartingIndex); 

                if (this._selectedItems.Contains(info))
                {
                    this.SelectionChange.Unselect(info); 
                }
            } 
            finally 
            {
                // Here SelectedIndex will be fixed to point to the first thing in _selectedItems, so 
                // the case of removing something before SelectedIndex is taken care of.
                this.SelectionChange.End();
            }
        }, 

        /// <summary> 
        /// A virtual function that is called when the selection is changed. Default behavior 
        /// is to raise a SelectionChangedEvent
        /// </summary> 
        /// <param name="e">The inputs for this event. Can be raised (default behavior) or processed
        ///   in some other way.</param>
//        protected virtual void 
        OnSelectionChanged:function(/*SelectionChangedEventArgs*/ e)
        { 
        	console.log("OnSelectionChanged");
            this.RaiseEvent(e);
        }, 
 
        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed. 
        /// </summary>
//        protected override void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
        	ItemsControl.prototype.OnIsKeyboardFocusWithinChanged.call(this, e); 

            // When focus within changes we need to update the value of IsSelectionActive property. 
            // In case focus is within the selector then IsSelectionActive is true. 
            // In case focus is within the current visual root but in a different FocusScope
            // (e.g. Menu, Toolbar, ContextMenu) then IsSelectionActive is true. 
            // In all other cases IsSelectionActive is false.
            var isSelectionActive = false;
            if (e.NewValue)
            { 
                isSelectionActive = true;
            } 
            else 
            {
                /*DependencyObject*/
            	var currentFocus = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null; 
                if (currentFocus != null)
                {
                    /*UIElement*/
                	var root = KeyboardNavigation.GetVisualRoot(this)
                    root = root instanceof UIElement ? root : null;
                    if (root != null && root.IsKeyboardFocusWithin) 
                    {
                        if (FocusManager.GetFocusScope(currentFocus) != FocusManager.GetFocusScope(this)) 
                        { 
                            isSelectionActive = true;
                        } 
                    }
                }
            }
 
            if (isSelectionActive)
            { 
                this.SetValue(Selector.IsSelectionActivePropertyKey, true); 
            }
            else 
            {
            	this.SetValue(Selector.IsSelectionActivePropertyKey, false);
            }
        }, 

//        private void 
        OnFocusEnterMainFocusScope:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
            // When KeyboardFocus comes back to the main focus scope and the Selector does not have focus within - clear IsSelectionActivePrivateProperty
            if (!this.IsKeyboardFocusWithin) 
            {
            	this.ClearValue(Selector.IsSelectionActivePropertyKey);
            }
        }, 

        /// <summary> 
        /// Called when the value of ItemsSource changes. 
        /// </summary>
//        protected override void 
        OnItemsSourceChanged:function(/*IEnumerable*/ oldValue, /*IEnumerable*/ newValue) 
        {
            this.SetSynchronizationWithCurrentItem();
        },
 
        /// <summary>
        /// Prepare the element to display the item.  This may involve 
        /// applying styles, setting bindings, etc. 
        /// </summary>
//        protected override void 
        PrepareContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item) 
        {
        	ItemsControl.prototype.PrepareContainerForItemOverride.call(this, element, item);

            // In some cases, the current TabOnceActiveElement will be pointing to an orphaned container. 
            // This causes problems with restoring focus, so to work around this we'll reset it whenever
            // the selected item is prepared. 
            if (item == this.SelectedItem) 
            {
                KeyboardNavigation.Current.UpdateActiveElement(this, element); 
            }

            // when grouping, all new containers go through this codepath, while only
            // the top-level containers are covered by the OnGeneratorStatusChanged 
            // codepath.   In either case, we potentially need to adjust selection
            // properties and ItemInfos involving the new containers. 
            this.OnNewContainer(); 
        },
 
        // when initialization is complete (so that all properties from markup have
        // been set), act on IsSynchronized
//        protected override void 
        OnInitialized:function(/*EventArgs*/ e)
        { 
            ItemsControl.prototype.OnInitialized.call(this, e);
            this.SetSynchronizationWithCurrentItem(); 
        }, 

        /// <summary>
        /// Adds/Removes the given item to the collection.  Assumes the item is in the collection. 
        /// </summary> 
//        private void 
        SetSelectedHelper:function(/*object*/ item, /*FrameworkElement*/ UI, /*bool*/ selected)
        { 
//            Debug.Assert(!SelectionChange.IsActive, "SelectionChange is already active -- use SelectionChange.Select or Unselect");
            var selectable;
 
            selectable = Selector.ItemGetIsSelectable(item);
 
            if (selectable == false && selected) 
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotSelectNotSelectableItem)); 
            }

            this.SelectionChange.Begin();
            try 
            {
                /*ItemInfo*/var info = this.NewItemInfo(item, UI); 
 
                if (selected)
                { 
                	this.SelectionChange.Select(info, true /* assumeInItemsCollection */);
                }
                else
                { 
                	this.SelectionChange.Unselect(info);
                } 
            } 
            finally
            { 
            	this.SelectionChange.End();
            }
        },
 
//        private void 
        OnCurrentChanged:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            if (this.IsSynchronizedWithCurrentItemPrivate)
            	this.SetSelectedToCurrent(); 
        },

        // when new containers arrive, schedule work for LayoutUpdated time.
        // (we might actually do it sooner - see OnGeneratorStatusChanged). 
//        private void 
        OnNewContainer:function()
        { 
            if (this._cacheValid.Get(CacheBits.NewContainersArePending)) 
                return;
 
            this._cacheValid.Set(CacheBits.NewContainersArePending, true);
//            this.LayoutUpdated.Combine(this.OnLayoutUpdated);
        },
 
//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e)
        { 
        	this.AdjustNewContainers(); 
        },
 
//        private void 
        OnGeneratorStatusChanged:function(/*object*/ sender, /*EventArgs*/ e)
        {
            if (this.ItemContainerGenerator.Status == GeneratorStatus.ContainersGenerated)
            { 
            	this.AdjustNewContainers();
            } 
        }, 

//        private void 
        AdjustNewContainers:function() 
        {
            // remove the LayoutUpdate handler, if we'd set one earlier
            if (this._cacheValid.Get(CacheBits.NewContainersArePending))
            { 
                //this.LayoutUpdated.Remove(this.OnLayoutUpdated);
                this._cacheValid.Set(CacheBits.NewContainersArePending, false); 
            } 

            this.AdjustItemInfosAfterGeneratorChangeOverride(); 

            if (this.HasItems)
            {
            	this.SelectionChange.Begin(); 
                try 
                {
                    // Things could have been added to _selectedItems before the containers were generated, so now push 
                    // the IsSelected state down onto those items.
                    for (var i = 0; i < this._selectedItems.Count; i++)
                    {
                        // This could send messages back from the children, but we will ignore them b/c the selectionchange is active. 
                    	this.ItemSetIsSelected(this._selectedItems.Get(i), true);
                    } 
 
                }
                finally 
                {
                	this.SelectionChange.Cancel();
                }
            } 
        },
        
//        internal virtual void 
        AdjustItemInfosAfterGeneratorChangeOverride:function() 
        {
        	this.AdjustItemInfosAfterGeneratorChange(this._selectedItems, /*claimUniqueContainer:*/true); 
        },

//        private void 
        SetSelectedToCurrent:function()
        { 
            if (!this._cacheValid.Get(CacheBits.SyncingSelectionAndCurrency)) 
            { 
            	this._cacheValid.Set(CacheBits.SyncingSelectionAndCurrency, true);
 
                try
                {
                    /*object*/
                	var item = this.Items.CurrentItem;
 
                    if (item != null && Selector.ItemGetIsSelectable(item))
                    { 
                        this.SelectionChange.SelectJustThisItem(this.NewItemInfo(item, null, this.Items.CurrentPosition), true /* assumeInItemsCollection */); 
                    }
                    else 
                    {
                        // Select nothing if Currency is not set.
                    	this.SelectionChange.SelectJustThisItem(null, false);
                    } 
                }
                finally 
                { 
                	this._cacheValid.Set(CacheBits.SyncingSelectionAndCurrency, false);
                } 
            }
        },

//        private void 
        SetCurrentToSelected:function() 
        {
//            Debug.Assert(IsSynchronizedWithCurrentItemPrivate); 
            if (!this._cacheValid.Get(CacheBits.SyncingSelectionAndCurrency)) 
            {
            	this._cacheValid.Set(CacheBits.SyncingSelectionAndCurrency, true); 

                try
                {
                    if (this._selectedItems.Count == 0) 
                    {
                        // this avoid treating null as an item 
                    	this.Items.MoveCurrentToPosition(-1); 
                    }
                    else 
                    {
                        var index = this._selectedItems.Get(0).Index;
                        if (index >= 0)
                        { 
                            // use the index if we have it, to disambiguate duplicates
                        	this.Items.MoveCurrentToPosition(index); 
                        } 
                        else
                        { 
                        	this.Items.MoveCurrentTo(this.InternalSelectedItem);
                        }
                    }
                } 
                finally
                { 
                	this._cacheValid.Set(CacheBits.SyncingSelectionAndCurrency, false); 
                }
            } 
        },
        

        // called by SelectedItemsCollection after every change event 
//        internal void 
        FinishSelectedItemsChange:function() 
        {
            // if we've deferred an inner change, do it now 
            /*ChangeInfo*/var changeInfo = ChangeInfoField.GetValue(this);
            if (changeInfo != null)
            {
                // make sure the selection change is active 
                var inSelectionChange = this.SelectionChange.IsActive;
 
                if (!inSelectionChange) 
                {
                	this.SelectionChange.Begin(); 
                }

                this.UpdateSelectedItems(changeInfo.ToAdd, changeInfo.ToRemove);
 
                if (!inSelectionChange)
                { 
                	this.SelectionChange.End(); 
                }
            } 
        },
        
////      private void 
//        UpdateSelectedItems:function() 
//        {
//            // Update SelectedItems.  We don't want to invalidate the property 
//            // because that defeats the ability of bindings to be able to listen 
//            // for collection changes on that collection.  Instead we just want
//            // to add all the items which are not already in the collection. 
//
//            // Note: This is currently only called from SelectionChanger where SC.IsActive will be true.
//            // If this is ever called from another location, ensure that SC.IsActive is true.
////            Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true"); 
//
//            /*SelectedItemCollection*/var userSelectedItems = this.SelectedItemsImpl; 
//            if (userSelectedItems != null) 
//            {
//                /*InternalSelectedItemsStorage*/
//            	var toAdd = new InternalSelectedItemsStorage(0, Selector.MatchExplicitEqualityComparer); 
//                /*InternalSelectedItemsStorage*/
//            	var toRemove = new InternalSelectedItemsStorage(userSelectedItems.Count, Selector.MatchExplicitEqualityComparer);
//                toAdd.UsesItemHashCodes = this._selectedItems.UsesItemHashCodes;
//                toRemove.UsesItemHashCodes = this._selectedItems.UsesItemHashCodes;
// 
//                // copy the current SelectedItems list into a fast table, attaching
//                // the 1's-complement of the index to each item.  The sentinel 
//                // container ensures that these are treated as separate items 
//                for (var i=0; i < userSelectedItems.Count; ++i)
//                { 
//                	this.toRemove.Add(userSelectedItems[i], ItemInfo.SentinelContainer, ~i);
//                }
//
//                // for each entry in _selectedItems, see if it's already in SelectedItems 
////                using (toRemove.DeferRemove())
////                { 
//                    /*ItemInfo*/var itemInfo = new ItemInfo(null, null, -1); 
//                    for/*each*/ (/*ItemInfo*/var e in _selectedItems)
//                    { 
//                        itemInfo.Reset(e.Item);
//                        if (toRemove.Contains(itemInfo))
//                        {
//                            // already present - don't remove it 
//                            toRemove.Remove(itemInfo);
//                        } 
//                        else 
//                        {
//                            // not present - mark it to be added 
//                            toAdd.Add(e);
//                        }
//                    }
////                } 
//
//                // Now make the changes, if any 
//                if (toAdd.Count > 0 || toRemove.Count > 0) 
//                {
//                    // if SelectedItems is in the midst of an app-initiated change, 
//                    // wait for the outer change to finish, then make the inner change.
//                    // Otherwise, do it now.
//                    if (userSelectedItems.IsChanging)
//                    { 
//                        Selector.ChangeInfoField.SetValue(this, new ChangeInfo(toAdd, toRemove));
//                    } 
//                    else 
//                    {
//                    	this.UpdateSelectedItems(toAdd, toRemove); 
//                    }
//                }
//            }
//        },
//
////        private void 
//        UpdateSelectedItems:function(/*InternalSelectedItemsStorage*/ toAdd, /*InternalSelectedItemsStorage*/ toRemove)
//        { 
////            Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true");
//            /*IList*/var userSelectedItems = this.SelectedItemsImpl; 
// 
//            Selector.ChangeInfoField.ClearValue(this);
// 
//            // Do the adds first, to avoid a transient empty state
//            for (var i=0; i<toAdd.Count; ++i)
//            {
//                userSelectedItems.Add(toAdd[i].Item); 
//            }
// 
//            // Now do the removals in reverse order, so that the indices we saved are valid 
//            for (var i=toRemove.Count-1; i>=0; --i)
//            { 
//                userSelectedItems.RemoveAt(~toRemove[i].Index);
//            }
//        },
        
//      private void 
        UpdateSelectedItems:function(/*InternalSelectedItemsStorage*/ toAdd, /*InternalSelectedItemsStorage*/ toRemove) 
        {
        	if(arguments.length == 2){
//              Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true");
                /*IList*/var userSelectedItems = this.SelectedItemsImpl; 
     
                ChangeInfoField.ClearValue(this);
     
                // Do the adds first, to avoid a transient empty state
                for (var i=0; i<toAdd.Count; ++i)
                {
                    userSelectedItems.Add(toAdd.Get(i).Item); 
                }
     
                // Now do the removals in reverse order, so that the indices we saved are valid 
                for (var i=toRemove.Count-1; i>=0; --i)
                { 
                    userSelectedItems.RemoveAt(~toRemove.Get(i).Index);
                }
        	}else{
	            // Update SelectedItems.  We don't want to invalidate the property 
	            // because that defeats the ability of bindings to be able to listen 
	            // for collection changes on that collection.  Instead we just want
	            // to add all the items which are not already in the collection. 
	
	            // Note: This is currently only called from SelectionChanger where SC.IsActive will be true.
	            // If this is ever called from another location, ensure that SC.IsActive is true.
	//            Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true"); 
	
	            /*SelectedItemCollection*/var userSelectedItems = this.SelectedItemsImpl; 
	            if (userSelectedItems != null) 
	            {
	                /*InternalSelectedItemsStorage*/
	            	toAdd = new InternalSelectedItemsStorage(0, MatchExplicitEqualityComparer); 
	                /*InternalSelectedItemsStorage*/
	            	toRemove = new InternalSelectedItemsStorage(userSelectedItems.Count, MatchExplicitEqualityComparer);
	                toAdd.UsesItemHashCodes = this._selectedItems.UsesItemHashCodes;
	                toRemove.UsesItemHashCodes = this._selectedItems.UsesItemHashCodes;
	 
	                // copy the current SelectedItems list into a fast table, attaching
	                // the 1's-complement of the index to each item.  The sentinel 
	                // container ensures that these are treated as separate items 
	                for (var i=0; i < userSelectedItems.Count; ++i)
	                { 
	                	toRemove.Add(userSelectedItems.Get(i), ItemInfo.SentinelContainer, ~i);
	                }
	
	                // for each entry in _selectedItems, see if it's already in SelectedItems 
	//                using (toRemove.DeferRemove())
	//                { 
	                var dispose = toRemove.DeferRemove();
	                    /*ItemInfo*/var itemInfo = new ItemInfo(null, null, -1); 
	                    for/*each*/ (var i=0; i<this._selectedItems.Count; i++) ///*ItemInfo*/var e in _selectedItems)
	                    { 
	                    	var e = this._selectedItems.Get(i);
	                        itemInfo.Reset(e.Item);
	                        if (toRemove.Contains(itemInfo))
	                        {
	                            // already present - don't remove it 
	                            toRemove.Remove(itemInfo);
	                        } 
	                        else 
	                        {
	                            // not present - mark it to be added 
	                            toAdd.Add(e);
	                        }
	                    }
	//                } 
	                
	                dispose.Dispose();
	                    
	                // Now make the changes, if any 
	                if (toAdd.Count > 0 || toRemove.Count > 0) 
	                {
	                    // if SelectedItems is in the midst of an app-initiated change, 
	                    // wait for the outer change to finish, then make the inner change.
	                    // Otherwise, do it now.
	                    if (userSelectedItems.IsChanging)
	                    { 
	                        Selector.ChangeInfoField.SetValue(this, new ChangeInfo(toAdd, toRemove));
	                    } 
	                    else 
	                    {
	                    	this.UpdateSelectedItems(toAdd, toRemove); 
	                    }
	                }
	            }
        	}
        },
 
        // called by SelectionChanger
//        internal void 
        UpdatePublicSelectionProperties:function() 
        { 
            /*EffectiveValueEntry*/var entry = this.GetValueEntry(
                        this.LookupEntry(Selector.SelectedIndexProperty.GlobalIndex), 
                        Selector.SelectedIndexProperty,
                        null,
                        RequestFlags.DeferredReferences);
 
            if (!entry.IsDeferredReference)
            { 
                // these are important checks to make before calling SetValue -- they 
                // ensure that we are not going to clobber a coerced value
                var selectedIndex = entry.Value; 
                if ((selectedIndex > this.Items.Count - 1)
                    || (selectedIndex == -1 && this._selectedItems.Count > 0)
                    || (selectedIndex > -1
                        && (this._selectedItems.Count == 0 || selectedIndex != this._selectedItems.Get(0).Index))) 
                {
                    // Use a DeferredSelectedIndexReference instead of calculating the new 
                    // value now for better performance.  Most of the time no 
                    // one cares what the new is, and calculating InternalSelectedIndex
                    // be expensive because of the Items.IndexOf call 
                    this.SetCurrentDeferredValue(Selector.SelectedIndexProperty, new DeferredSelectedIndexReference(this));
                }
            }
 
            if (this.SelectedItem != this.InternalSelectedItem)
            { 
                try 
                {
                    // We know that InternalSelectedItem is a correct value for SelectedItemProperty and 
                    // should skip the coerce callback because it is expensive to call IndexOf and Contains
                    this.SkipCoerceSelectedItemCheck = true;
                    this.SetCurrentValueInternal(Selector.SelectedItemProperty, this.InternalSelectedItem);
                } 
                finally
                { 
                	this.SkipCoerceSelectedItemCheck = false; 
                }
            } 

            if (this._selectedItems.Count > 0)
            {
                // an item has been selected, so turn off the delayed 
                // selection by SelectedValue (bug 452619)
            	this._cacheValid.Set(CacheBits.SelectedValueWaitsForItems, false); 
            } 

            if (!this._cacheValid.Get(CacheBits.SelectedValueDrivesSelection) && 
                !this._cacheValid.Get(CacheBits.SelectedValueWaitsForItems))
            {
                /*object*/var desiredSelectedValue = this.InternalSelectedValue;
                if (desiredSelectedValue == DependencyProperty.UnsetValue) 
                {
                    desiredSelectedValue = null; 
                } 

                if (!Object.Equals(this.SelectedValue, desiredSelectedValue)) 
                {
                	this.SetCurrentValueInternal(Selector.SelectedValueProperty, desiredSelectedValue);
                }
            } 

            this.UpdateSelectedItems(); 
        }, 

        /// <summary> 
        /// Raise the SelectionChanged event.
        /// </summary>
//        private void 
        InvokeSelectionChanged:function(/*List<ItemInfo>*/ unselectedInfos, /*List<ItemInfo>*/ selectedInfos)
        { 
            /*SelectionChangedEventArgs*/var selectionChanged = new SelectionChangedEventArgs(unselectedInfos, selectedInfos);
 
            selectionChanged.Source=this; 

            this.OnSelectionChanged(selectionChanged); 
        },

        /// <summary>
        /// Returns true if FrameworkElement (container) representing the item 
        /// has Selector.IsSelectedProperty set to true.
        /// </summary> 
        /// <param name="container"></param> 
        /// <param name="item"></param>
        /// <returns></returns> 
//        private bool 
        InfoGetIsSelected:function(/*ItemInfo*/ info)
        {
            /*DependencyObject*/var container = info.Container;
            if (container != null) 
            {
                return container.GetValue(Selector.IsSelectedProperty); 
            } 

            // In the case where the elements added *are* the containers, read it off the item could work too 
            //
            if (this.IsItemItsOwnContainerOverride(info.Item))
            {
                /*DependencyObject*/var element = info.Item instanceof DependencyObject ? info.Item : null; 

                if (element != null) 
                { 
                    return element.GetValue(Selector.IsSelectedProperty);
                } 
            }

            return false;
        }, 

//        private void 
        ItemSetIsSelected:function(/*ItemInfo*/ info, /*bool*/ value) 
        { 
            if (info == null) return;
 
            /*DependencyObject*/var container = info.Container;

            if (container != null)
            { 
                // First check that the value is different and then set it.
                if (Selector.GetIsSelected(container) != value) 
                { 
                    container.SetCurrentValueInternal(Selector.IsSelectedProperty, value);
                } 
            }
            else
            {
                // In the case where the elements added *are* the containers, set it on the item instead of doing nothing 
                //
                /*object*/var item = info.Item; 
                if (this.IsItemItsOwnContainerOverride(item)) 
                {
                    /*DependencyObject*/var element = item instanceof DependencyObject ? item : null; 

                    if (element != null)
                    {
                        if (Selector.GetIsSelected(element) != value) 
                        {
                            element.SetCurrentValueInternal(Selector.IsSelectedProperty, value); 
                        } 
                    }
                } 
            }
        },
 
        /// <summary>
        /// Called by handlers of Selected/Unselected or CheckedChanged events to indicate that the selection state 
        /// on the item has changed and selector needs to update accordingly. 
        /// </summary>
        /// <param name="container"></param> 
        /// <param name="selected"></param>
        /// <param name="e"></param>
        /// <returns></returns>
//        internal void 
        NotifyIsSelectedChanged:function(/*FrameworkElement*/ container, /*bool*/ selected, /*RoutedEventArgs*/ e) 
        {
            // The selectionchanged event will fire at the end of the selection change. 
            // We are here because this change was requested within the SelectionChange. 
            // If there isn't a selection change going on now, we should do a SelectionChange.
            if (this.SelectionChange.IsActive || container == this._clearingContainer) 
            {
                // We cause this property to change, so mark it as handled
                e.Handled = true;
            } 
            else
            { 
                if (container != null) 
                {
                    /*object*/var item = this.GetItemOrContainerFromContainer(container); 
                    if (item != DependencyProperty.UnsetValue)
                    {
                        this.SetSelectedHelper(item, container, selected);
                        e.Handled = true; 
                    }
                } 
            } 
        },

        // use the first item to decide whether items support hashing correctly. 
        // Reset the algorithm used by _selectedItems accordingly.
//        void 
        ResetSelectedItemsAlgorithm:function()
        {
            if (!this.Items.IsEmpty) 
            {
            	this._selectedItems.UsesItemHashCodes = this.Items.CollectionView.HasReliableHashCodes(); 
            } 
        },
 
        // Locate the selected items - i.e. assign an index to each ItemInfo in _selectedItems.
        // (This is called after a Reset event from the Items collection.)
        // If the caller provides a list, fill it with ranges describing the selection;
        // each range has the form <offset, length>. 
        // Optionally remove from _selectedItems any entry for which no index can be found
//        internal void 
        LocateSelectedItems:function(/*List<Tuple<int,int>>*/ ranges/* = null*/, /*bool*/ deselectMissingItems/*=false*/) 
        { 
        	if(deselectMissingItems === undefined ){
        		deselectMissingItems =fasle;
        	}
        	
        	if(ranges === undefined){
        		ranges = null;
        	}
        	
            /*List<int>*/var knownIndices = new List/*<int>*/(this._selectedItems.Count);
            var unknownCount = 0; 
            var knownCount;

            // Step 1.  Find the known indices.
            for(var i=0; i<this._selectedItems.Count; i++) ///*each*/ (/*ItemInfo*/var info in this._selectedItems) 
            {
            	var info = this._selectedItems.Get(i);
                if (info.Index < 0) 
                { 
                    ++ unknownCount;
                } 
                else
                {
                    knownIndices.Add(info.Index);
                } 
            }
 
            // sort the list, and remember its size.   We'll be adding more to the 
            // list, but we only need to search up to its current size.
            knownCount = knownIndices.Count; 
            knownIndices.Sort();

            // Step 2. Walk through the Items collection, to fill in the unknown indices.
            /*ItemInfo*/var key = new ItemInfo(null, ItemInfo.KeyContainer, -1); 
            for (var i=0; unknownCount > 0 && i<this.Items.Count; ++i)
            { 
                // skip items whose index is already known 
                if (knownIndices.BinarySearch(0, knownCount, i, null) >= 0)
                { 
                    continue;
                }

                // see if the current item appears in _selectedItems 
                key.Reset(Items[i]);
                key.Index = i; 
                /*ItemInfo*/var info = this._selectedItems.FindMatch(key); 

                if (info != null) 
                {
                    // record the match
                    info.Index = i;
                    knownIndices.Add(i); 
                    --unknownCount;
                } 
            } 

            // Step 3. Report the selection as a list of ranges 
            if (ranges != null)
            {
                ranges.Clear();
                knownIndices.Sort(); 
                knownIndices.Add(-1);   // sentinel, to emit the last range
                var startRange = -1, endRange = -2; 
 
                for(var i=0; i<knownIndices.Count; i++) ///*each*/ (var index in knownIndices)
                { 
                	var index= knownIndices.Get(i);
                    if (index == endRange + 1)
                    {
                        // extend the current range
                        endRange = index; 
                    }
                    else 
                    { 
                        // emit the current range
                        if (startRange >= 0) 
                        {
                            ranges.Add(new Tuple/*<int, int>*/(startRange, endRange-startRange+1));
                        }
 
                        // start a new range
                        startRange = endRange = index; 
                    } 
                }
            } 

            // Step 4.  Remove missing items from _selectedItems
            if (deselectMissingItems)
            { 
                // Note: This is currently only called from SelectionChanger where SC.IsActive will be true.
                // If this is ever called from another location, ensure that SC.IsActive is true. 
//                Debug.Assert(SelectionChange.IsActive, "SelectionChange.IsActive should be true"); 

                for(var i=0; i<this._selectedItems.Count; i++) ///*each*/ (/*ItemInfo*/var info in _selectedItems) 
                {
                	var info = this._selectedItems.Get(i);
                    if (info.Index < 0)
                    {
                    	this.SelectionChange.Unselect(info); 
                    }
                } 
            } 
        }
        
	});
	
	Object.defineProperties(Selector.prototype,{
        
        /// <summary>
        /// Whether this Selector should keep SelectedItem in [....] with the ItemCollection's current item. 
        /// </summary>
//        public bool? 
        IsSynchronizedWithCurrentItem: 
        {
            get:function() { return this.GetValue(Selector.IsSynchronizedWithCurrentItemProperty); },
            set:function(value) { this.SetValue(Selector.IsSynchronizedWithCurrentItemProperty, value); }
        }, 
 
        /// <summary> 
        ///     The index of the first item in the current selection or -1 if the selection is empty.
        /// </summary> 
//        public int 
        SelectedIndex:
        { 
            get:function() { return this.GetValue(Selector.SelectedIndexProperty); },
            set:function(value) { this.SetValue(Selector.SelectedIndexProperty, value); } 
        }, 

        /// <summary>
        ///  The first item in the current selection, or null if the selection is empty. 
        /// </summary>
//        public object 
        SelectedItem:
        { 
            get:function() { return this.GetValue(Selector.SelectedItemProperty); },
            set:function(value) { this.SetValue(Selector.SelectedItemProperty, value); } 
        }, 

        /// <summary> 
        ///  The value of the SelectedItem, obtained using the SelectedValuePath.
        /// </summary> 
        /// <remarks>
        /// <p>Setting SelectedValue to some value x attempts to select an item whose
        /// "value" evaluates to x, using the current setting of <seealso cref="SelectedValuePath"/>.
        /// If no such item can be found, the selection is cleared.</p> 
        ///
        /// <p>Getting the value of SelectedValue returns the "value" of the <seealso cref="SelectedItem"/>, 
        /// using the current setting of <seealso cref="SelectedValuePath"/>, or null 
        /// if there is no selection.</p>
        /// 
        /// <p>Note that these rules imply that getting SelectedValue immediately after
        /// setting it to x will not necessarily return x.  It might return null,
        /// if no item with value x can be found.</p>
        /// </remarks> 
//        public object 
        SelectedValue:
        {
            get:function() { return this.GetValue(Selector.SelectedValueProperty); },
            set:function(value) { this.SetValue(Selector.SelectedValueProperty, value); }
        },

        /// <summary>
        ///  The path used to retrieve the SelectedValue from the SelectedItem 
        /// </summary> 
//        public string 
        SelectedValuePath:
        {
            get:function() { return this.GetValue(Selector.SelectedValuePathProperty); },
            set:function(value) { this.SetValue(Selector.SelectedValuePathProperty, value); } 
        },
  
        /// <summary>
        /// The currently selected items.
        /// </summary>
//        internal IList 
        SelectedItemsImpl: 
        {
            get:function() { return this.GetValue(Selector.SelectedItemsImplProperty); } 
        }, 

        /// <summary> 
        /// Whether this Selector can select more than one item at once 
        /// </summary>
//        internal bool 
        CanSelectMultiple: 
        {
            get:function() { return this._cacheValid.Get(CacheBits.CanSelectMultiple); },
            set:function(value)
            { 
                if (this._cacheValid.Get(CacheBits.CanSelectMultiple) != value)
                { 
                	this._cacheValid.Set(CacheBits.CanSelectMultiple, value); 
                    if (!value && (this._selectedItems.Count > 1))
                    { 
                    	this.SelectionChange.Validate();
                    }
                }
            } 
        },
        // True if we're really synchronizing selection and current item
//        private bool 
        IsSynchronizedWithCurrentItemPrivate: 
        { 
            get:function() { return this._cacheValid.Get(CacheBits.IsSynchronizedWithCurrentItem); },
            set:function(value) { this._cacheValid.Set(CacheBits.IsSynchronizedWithCurrentItem, value); } 
        },

//        private bool 
        SkipCoerceSelectedItemCheck:
        { 
            get:function() { return this._cacheValid.Get(CacheBits.SkipCoerceSelectedItemCheck); },
            set:function(value) { this._cacheValid.Set(CacheBits.SkipCoerceSelectedItemCheck, value); } 
        }, 
 
        /// <summary>
        /// Allows batch processing of selection changes so that only one SelectionChanged event is fired and
        /// SelectedIndex is changed only once (if necessary).
        /// </summary> 
//        internal SelectionChanger 
        SelectionChange:
        { 
            get:function() 
            {
                if (this._selectionChangeInstance == null) 
                {
                	this._selectionChangeInstance = new (EnsureSelectionChanger())(this);
                }
 
                return this._selectionChangeInstance;
            } 
        }, 
        // The selected items that we interact with.  Most of the time when SelectedItems 
        // is in use, this is identical to the value of the SelectedItems property, but
        // differs in type, and will differ in content in the case where you set or modify
        // SelectedItems and we need to switch our selection to what was just provided.
        // This is our internal representation of the selection and generally should be modified 
        // only by SelectionChanger.  Internal classes may read this for efficiency's sake
        // to avoid putting SelectedItems "in use" but we can't really expose this externally. 
//        internal InternalSelectedItemsStorage 
        _selectedItems:
        {
        	get:function(){
        		if(this.__selectedItems === undefined){
        			this.__selectedItems = new InternalSelectedItemsStorage(1, MatchExplicitEqualityComparer);
        		}
        		
        		return this.__selectedItems;
        	} 
        },

        // Gets the selected item but doesn't use SelectedItem (avoids putting it "in use") 
//        internal object 
        InternalSelectedItem:
        {
            get:function()
            { 
                return (this._selectedItems.Count == 0) ? null : this._selectedItems.Get(0).Item;
            } 
        }, 

//        internal ItemInfo 
        InternalSelectedInfo: 
        {
            get:function() { return (this._selectedItems.Count == 0) ? null : this._selectedItems.Get(0); }
        },
 
        /// <summary>
        /// Index of the first item in SelectedItems or (-1) if SelectedItems is empty. 
        /// </summary> 
        /// <value></value>
//        internal int 
        InternalSelectedIndex:
        {
            get:function()
            {
                if (this._selectedItems.Count == 0) 
                    return -1;
 
                var index = this._selectedItems.Get(0).Index; 
                if (index < 0)
                { 
                    index = this.Items.IndexOf(this._selectedItems.Get(0).Item);
                    this._selectedItems.Get(0).Index = index;
                }
 
                return index;
            } 
        }, 
//        private object 
        InternalSelectedValue: 
        {
            get:function()
            {
                var item = this.InternalSelectedItem; 
                var selectedValue;
 
                if (item != null) 
                {
                    /*BindingExpression*/var bindingExpr = this.PrepareItemValueBinding(item); 

                    if (String.IsNullOrEmpty(this.SelectedValuePath))
                    {
                        // when there's no SelectedValuePath, the binding's Path 
                        // is either empty (CLR) or "/InnerText" (XML)
                        var path = bindingExpr.ParentBinding.Path.Path; 
//                        Debug.Assert(String.IsNullOrEmpty(path) || path == "/InnerText"); 

                        if (String.IsNullOrEmpty(path)) 
                        {
                            selectedValue = item;   // CLR - the item is its own selected value
                        }
                        else 
                        {
                            selectedValue = SystemXmlHelper.GetInnerText(item); // XML - use the InnerText as the selected value 
                        } 
                    }
                    else 
                    {
                        // apply the SelectedValuePath to the item
                        bindingExpr.Activate(item);
                        selectedValue = bindingExpr.Value; 
                        bindingExpr.Deactivate();
                    } 
                } 
                else
                { 
                    // no selected item - use UnsetValue (to distinguish from null, a legitimate value for the SVP)
                    selectedValue = DependencyProperty.UnsetValue;
                }
 
                return selectedValue;
            } 
        } 
	});
	
	Object.defineProperties(Selector, {

        /// <summary> 
        ///     An event fired when the selection changes.
        /// </summary> 
//        public static readonly RoutedEvent 
        SelectionChangedEvent:
        {
        	get:function(){
        		if(Selector._SelectionChangedEvent === undefined){
        			Selector._SelectionChangedEvent = EventManager.RegisterRoutedEvent( 
        		            "SelectionChanged", RoutingStrategy.Bubble, SelectionChangedEventHandler.Type, Selector.Type); 
        		}
        		return Selector._SelectionChangedEvent;
        	}
        },
 

        /// <summary>
        ///     An event fired by UI children when the IsSelected property changes to true.
        ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
        /// </summary>
//        public static readonly RoutedEvent 
        SelectedEvent:
        {
        	get:function(){
        		if(Selector._SelectedEvent === undefined){
        			Selector._SelectedEvent = EventManager.RegisterRoutedEvent( 
        		            "Selected", RoutingStrategy.Bubble, RoutedEventHandler.Type, Selector.Type);  
        		}
        		return Selector._SelectedEvent;
        	}
        },
        
        /// <summary> 
        ///     An event fired by UI children when the IsSelected property changes to false.
        ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
        /// </summary> 
//        public static readonly RoutedEvent 
        UnselectedEvent:
        {
        	get:function(){
        		if(Selector._UnselectedEvent === undefined){
        			Selector._UnselectedEvent = EventManager.RegisterRoutedEvent(
        		            "Unselected", RoutingStrategy.Bubble, RoutedEventHandler.Type, Selector.Type);  
        		}
        		return Selector._UnselectedEvent;
        	}
        },


        /// <summary>
        ///     Property key for IsSelectionActiveProperty.
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        IsSelectionActivePropertyKey:
        {
        	get:function(){
        		if(Selector._IsSelectionActivePropertyKey === undefined){
        			Selector._IsSelectionActivePropertyKey =
                        DependencyProperty.RegisterAttachedReadOnly( 
                                "IsSelectionActive", 
                                Boolean.Type, 
                                Selector.Type, 
                                /*new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(false, FrameworkPropertyMetadataOptions.Inherits));
        		}
        		return Selector._IsSelectionActivePropertyKey;
        	}
        },
        
        /// <summary>
        ///     Indicates whether the keyboard focus is within the Selector. 
        /// In case when focus goes to Menu/Toolbar then selection is active too.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsSelectionActiveProperty:
        {
        	get:function(){
        		return Selector.IsSelectionActivePropertyKey.DependencyProperty; 
        	}
        },
            

        /// <summary> 
        ///     Specifies whether a UI container for an item in a Selector should appear selected. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsSelectedProperty:
        {
        	get:function(){
        		if(Selector._IsSelectedProperty === undefined){
        			Selector._IsSelectedProperty = 
                        DependencyProperty.RegisterAttached(
                                "IsSelected",
                                Boolean.Type, 
                                Selector.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault)*/
                                FrameworkPropertyMetadata.Build2(false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault)); 
        		}
        		return Selector._IsSelectedProperty;
        	}
        }, 
        /// <summary> 
        /// Whether this Selector should keep SelectedItem in [....] with the ItemCollection's current item.
        /// </summary>
//        public static readonly DependencyProperty 
        IsSynchronizedWithCurrentItemProperty:
        {
        	get:function(){
        		if(Selector._IsSynchronizedWithCurrentItemProperty === undefined){
        			Selector._IsSynchronizedWithCurrentItemProperty =
                        DependencyProperty.Register( 
                                "IsSynchronizedWithCurrentItem",
                                Boolean.Type, 
                                Selector.Type, 
                                /*new FrameworkPropertyMetadata(
                                        null, 
                                        new PropertyChangedCallback(OnIsSynchronizedWithCurrentItemChanged)*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(null, 
                                        new PropertyChangedCallback(null, OnIsSynchronizedWithCurrentItemChanged))); 
        		}
        		return Selector._IsSynchronizedWithCurrentItemProperty;
        	}
        }, 

        /// <summary>
        ///     SelectedIndex DependencyProperty
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedIndexProperty:
        {
        	get:function(){
        		if(Selector._SelectedIndexProperty === undefined){
        			Selector._SelectedIndexProperty = 
                        DependencyProperty.Register(
                                "SelectedIndex", 
                                Number.Type, 
                                Selector.Type,
                                /*new FrameworkPropertyMetadata( 
                                        -1,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(OnSelectedIndexChanged),
                                        new CoerceValueCallback(CoerceSelectedIndex)), */
                                
                                FrameworkPropertyMetadata.Build4(-1,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(null, OnSelectedIndexChanged),
                                        new CoerceValueCallback(null, CoerceSelectedIndex))
                                 		); 
        		}
        		return Selector._SelectedIndexProperty;
        	}
        },

        /// <summary>
        ///     SelectedItem DependencyProperty 
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedItemProperty:
        {
        	get:function(){
        		if(Selector._SelectedItemProperty === undefined){
        			Selector._SelectedItemProperty = 
                        DependencyProperty.Register( 
                                "SelectedItem",
                                Object.Type, 
                                Selector.Type,
                                /*new FrameworkPropertyMetadata(
                                        null,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                                        new PropertyChangedCallback(OnSelectedItemChanged),
                                        new CoerceValueCallback(CoerceSelectedItem))*/
                                FrameworkPropertyMetadata.Build4(null,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                                        new PropertyChangedCallback(null, OnSelectedItemChanged),
                                        new CoerceValueCallback(null, CoerceSelectedItem))); 
        		}
        		return Selector._SelectedItemProperty;
        	}
        },
 
        /// <summary>
        ///     SelectedValue DependencyProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectedValueProperty:
        {
        	get:function(){
        		if(Selector._SelectedValueProperty === undefined){
        			Selector._SelectedValueProperty =
                        DependencyProperty.Register( 
                                "SelectedValue", 
                                Object.Type,
                                Selector.Type, 
                                /*new FrameworkPropertyMetadata(
                                        null,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(OnSelectedValueChanged), 
                                        new CoerceValueCallback(CoerceSelectedValue))*/
                                FrameworkPropertyMetadata.Build4(null,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnSelectedValueChanged), 
                                        new CoerceValueCallback(null, CoerceSelectedValue)));
        		}
        		return Selector._SelectedValueProperty;
        	}
        }, 

        /// <summary>
        ///     SelectedValuePath DependencyProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectedValuePathProperty:
        {
        	get:function(){
        		if(Selector._SelectedValuePathProperty === undefined){
        			Selector._SelectedValuePathProperty =
                        DependencyProperty.Register( 
                                "SelectedValuePath", 
                                String.Type,
                                Selector.Type, 
                                /*new FrameworkPropertyMetadata(
                                        String.Empty,
                                        new PropertyChangedCallback(OnSelectedValuePathChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(String.Empty,
                                        new PropertyChangedCallback(null, OnSelectedValuePathChanged)));
        		}
        		return Selector._SelectedValuePathProperty;
        	}
        }, 
        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
//        private static readonly DependencyPropertyKey 
        SelectedItemsPropertyKey:
        {
        	get:function(){
        		if(Selector._SelectedItemsPropertyKey === undefined){
        			Selector._SelectedItemsPropertyKey  =
                        DependencyProperty.RegisterReadOnly( 
                                "SelectedItems",
                                IList.Type, 
                                Selector.Type, 
                                /*new FrameworkPropertyMetadata(
                                         null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));  
        		}
        		return Selector._SelectedItemsPropertyKey;
        	}
        },
        
        /// <summary>
        /// A read-only IList containing the currently selected items 
        /// </summary>
//        internal static final DependencyProperty 
        SelectedItemsImplProperty:
        {
        	get:function(){
        		return Selector.SelectedItemsPropertyKey.DependencyProperty;  
        	}
        }, 

        // used to retrieve the value of an item, according to the SelectedValuePath
//        private static readonly BindingExpressionUncommonField 
        ItemValueBindingExpression:
        {
        	get:function(){
        		if(Selector._ItemValueBindingExpression === undefined){
        			Selector._ItemValueBindingExpression = new BindingExpressionUncommonField(); 
        		}
        		
        		return Selector._ItemValueBindingExpression;
        	}
        },
        
////        private static readonly ItemInfoEqualityComparer 
//        MatchExplicitEqualityComparer:
//        {
//        	get:function(){
//        		if(Selector._MatchExplicitEqualityComparer === undefined){
//        			Selector._MatchExplicitEqualityComparer = new ItemInfoEqualityComparer(false);  
//        		}
//        		
//        		return Selector._MatchExplicitEqualityComparer;
//        	}
//        },
////        private static readonly ItemInfoEqualityComparer 
//        MatchUnresolvedEqualityComparer:
//        {
//        	get:function(){
//        		if(Selector._MatchUnresolvedEqualityComparer === undefined){
//        			Selector._MatchUnresolvedEqualityComparer = new ItemInfoEqualityComparer(true);
//        		}
//        		
//        		return Selector._MatchUnresolvedEqualityComparer;
//        	}
//        }, 
 
//        private static readonly UncommonField<ChangeInfo> 
        ChangeInfoField:
        {
        	get:function(){
        		if(Selector._ChangeInfoField === undefined){
        			Selector._ChangeInfoField  = new UncommonField/*<ChangeInfo>*/();
        		}
        		
        		return Selector._ChangeInfoField;
        	}
        },
	});

    /// <summary> 
    ///     Adds a handler for the SelectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead.
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
	Selector.AddSelectedHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler) 
    { 
        FrameworkElement.AddHandler(element, Selector.SelectedEvent, handler);
    }; 

    /// <summary>
    ///     Removes a handler for the SelectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Selector.RemoveSelectedHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler)
    { 
        FrameworkElement.RemoveHandler(element, Selector.SelectedEvent, handler);
    };

    /// <summary>
    ///     Adds a handler for the UnselectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Selector.AddUnselectedHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler)
    { 
        FrameworkElement.AddHandler(element, Selector.UnselectedEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the UnselectedEvent attached event
    ///     For listening to selection state changes use <see cref="SelectionChangedEvent" /> instead. 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Selector.RemoveUnselectedHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler)
    {
        FrameworkElement.RemoveHandler(element, Selector.UnselectedEvent, handler);
    }; 

    /// <summary>
    ///     Get IsSelectionActive property
    /// </summary>
    /// <param name="element"></param> 
    /// <returns></returns>
//    public static bool 
    Selector.GetIsSelectionActive = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return element.GetValue(Selector.IsSelectionActiveProperty);
    }; 

    /// <summary> 
    ///     Retrieves the value of the attached property.
    /// </summary>
    /// <param name="element">The DependencyObject on which to query the property.</param>
    /// <returns>The value of the attached property.</returns> 
//    public static bool 
    Selector.GetIsSelected = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return element.GetValue(Selector.IsSelectedProperty); 
    };


    /// <summary>
    ///     Sets the value of the attached property. 
    /// </summary>
    /// <param name="element">The DependencyObject on which to set the property.</param>
    /// <param name="isSelected">The new value of the attached property.</param>
//    public static void 
    Selector.SetIsSelected = function(/*DependencyObject*/ element, /*bool*/ isSelected) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(Selector.IsSelectedProperty, isSelected);
    };

//    private static void 
    function OnIsSynchronizedWithCurrentItemChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.SetSynchronizationWithCurrentItem(); 
    }

//    private static void 
    function OnSelectedIndexChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        // If we're in the middle of a selection change, ignore all changes 
        if (!d.SelectionChange.IsActive)
        { 
            var newIndex =  e.NewValue; 
            d.SelectionChange.SelectJustThisItem(d.ItemInfoFromIndex(newIndex), true /* assumeInItemsCollection */);
        } 
    }

//    private static bool 
    function ValidateSelectedIndex(/*object*/ o)
    { 
        return o >= -1;
    } 

//    private static object 
    function CoerceSelectedIndex(/*DependencyObject*/ d, /*object*/ value)
    { 
        if ((typeof(value) == "number") && value >= d.Items.Count)
        {
            return DependencyProperty.UnsetValue; 
        }

        return value; 
    }

//    private static void 
    function OnSelectedItemChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (!d.SelectionChange.IsActive) 
        {
            d.SelectionChange.SelectJustThisItem(d.NewItemInfo(e.NewValue), false /* assumeInItemsCollection */); 
        } 
    }

//    private static object 
    function CoerceSelectedItem(/*DependencyObject*/ d, /*object*/ value)
    {
        if (value == null || d.SkipCoerceSelectedItemCheck) 
             return value;

        var selectedIndex = d.SelectedIndex; 

        if ( (selectedIndex > -1 && selectedIndex < d.Items.Count && d.Items.Get(selectedIndex) == value) 
            || d.Items.Contains(value))
        {
            return value;
        } 

        return DependencyProperty.UnsetValue; 
    } 

    /// <summary> 
    /// This could happen when SelectedValuePath has changed,
    /// SelectedItem has changed, or someone is setting SelectedValue. 
    /// </summary> 
//    private static void 
    function OnSelectedValueChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
    }

//    private static object 
    function CoerceSelectedValue(/*DependencyObject*/ d, /*object*/ value)
    {
//        Selector s = (Selector)d;

        if (d.SelectionChange.IsActive)
        { 
            // If we're in the middle of a selection change, accept the value 
            d._cacheValid.Set(CacheBits.SelectedValueDrivesSelection, false);
        } 
        else
        {
            // Otherwise, this is a user-initiated change to SelectedValue.
            // Find the corresponding item. 
            var item = d.SelectItemWithValue(value);

            // if the search fails, coerce the value to null.  Unless there 
            // are no items at all, in which case wait for the items to appear
            // and search again. 
            if (item == DependencyProperty.UnsetValue && d.HasItems)
            {
                value = null;
            } 
        }

        return value; 
    }

//    private static void 
    function OnSelectedValuePathChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        /*Selector*/var s = d; 
        // discard the current ItemValue binding
        ItemValueBindingExpression.ClearValue(d);

        // select the corresponding item 
        /*EffectiveValueEntry*/var entry = d.GetValueEntry(
                    d.LookupEntry(SelectedValueProperty.GlobalIndex), 
                    Selector.SelectedValueProperty, 
                    null,
                    RequestFlags.RawEntry); 
        if (entry.IsCoerced || d.SelectedValue != null)
        {
            // Coercing SelectedValue will retry a previously-set value that had
            // been coerced to null.  (Dev10 513711) 
            d.CoerceValue(Selector.SelectedValueProperty);
        } 
    } 

    /// <summary> 
    /// Returns false if FrameworkElement representing this item has Selector.SelectableProperty set to false.  True otherwise.
    /// </summary> 
    /// <param name="item"></param> 
    /// <returns></returns>
//    internal static bool 
    Selector.ItemGetIsSelectable = function(/*object*/ item) 
    {
        if (item != null)
        {
            return !(item instanceof Separator); 
        }

        return false; 
    };

//    internal static bool 
    Selector.UiGetIsSelectable = function(/*DependencyObject*/ o)
    {
        if (o != null)
        { 
            if (!Selector.ItemGetIsSelectable(o))
            { 
                return false; 
            }
            else 
            {
                // Check the data item
                /*ItemsControl*/var itemsControl = ItemsControl.ItemsControlFromItemContainer(o);
                if (itemsControl != null) 
                {
                    /*object*/var data = itemsControl.ItemContainerGenerator.ItemFromContainer(o); 
                    if (data != o) 
                    {
                        return Selector.ItemGetIsSelectable(data); 
                    }
                    else
                    {
                        return true; 
                    }
                } 
            } 
        }

        return false;
    };

//    private static void 
    function OnSelected(/*object*/ sender, /*RoutedEventArgs*/ e) 
    {
        sender.NotifyIsSelectedChanged(e.OriginalSource instanceof FrameworkElement ? e.OriginalSource : null, true, e); 
    } 

//    private static void  
    function OnUnselected(/*object*/ sender, /*RoutedEventArgs*/ e) 
    {
        sender.NotifyIsSelectedChanged(e.OriginalSource instanceof FrameworkElement ? e.OriginalSource : null, false, e);
    }
    
//    static Selector() 
    function Initialize()
    {	 
    	EventManager.RegisterClassHandler(Selector.Type, Selector.SelectedEvent, new RoutedEventHandler(null, Selector.OnSelected));
    	EventManager.RegisterClassHandler(Selector.Type, Selector.UnselectedEvent, new RoutedEventHandler(null, Selector.OnUnselected)); 
    }

	
	Selector.Type = new Type("Selector", Selector, [ItemsControl.Type]);
	Initialize();
	
	return Selector;
});


 