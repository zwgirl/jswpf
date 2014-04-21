/**
 * Second Check 12-08
 * ItemsControl
 */

define(["dojo/_base/declare", "system/Type", "controls/Control", "markup/IAddChild", "controls/IGeneratorHost",
        "controls/VirtualizingPanel", "controls/ItemCollection", "specialized/NotifyCollectionChangedEventHandler",
        "controls/ItemContainerGenerator", "controls/ItemInfo", "controls/GroupStyleSelector", "objectmodel/ObservableCollection",
        "controls/ItemsPanelTemplate", "controls/StyleSelector", "data/BindingGroup",
        "windows/UncommonField", "controls/ItemNavigateArgs"], 
		function(declare, Type, Control, IAddChild, IGeneratorHost,
				VirtualizingPanel, ItemCollection, NotifyCollectionChangedEventHandler,
				ItemContainerGenerator, ItemInfo, GroupStyleSelector, ObservableCollection,
				ItemsPanelTemplate, StyleSelector, BindingGroup,
				UncommonField, ItemNavigateArgs){
	
	var TreeViewItem = null;
	function EnsureTreeViewItem(){
		if(TreeViewItem == null){
			TreeViewItem = using("controls/TreeViewItem");
		}
		
		return TreeViewItem;
	}
	
	var TreeView = null;
	function EnsureTreeView(){
		if(TreeView == null){
			TreeView = using("controls/TreeView");
		}
		
		return TreeView;
	}
    
//    internal enum 
    var ElementViewportPosition = declare("ElementViewportPosition", null, {});
    ElementViewportPosition.None =0; 
    ElementViewportPosition.BeforeViewport = 1;
    ElementViewportPosition.PartiallyInViewport = 2; 
    ElementViewportPosition.CompletelyInViewport = 3;
    ElementViewportPosition.AfterViewport = 4;
    
//    private static DependencyObjectType 
    var _dType = null;
//    private static readonly UncommonField<bool> 
    var ShouldCoerceScrollUnitField = new UncommonField(); 
//    private static readonly UncommonField<bool> 
    var ShouldCoerceCacheSizeField = new UncommonField();
    
    var ItemsControl = declare("ItemsControl", [Control, IAddChild, IGeneratorHost/*, IContainItemStorage*/],{
		constructor:function(){
			ShouldCoerceCacheSizeField.SetValue(this, true);
            this.CoerceValue(VirtualizingPanel.CacheLengthUnitProperty);
            this._groupStyle = new ObservableCollection/*<GroupStyle>*/();
            
//            private ItemInfo _focusedInfo; 
//            private ItemCollection _items;                      // Cache for Items property
//            private ItemContainerGenerator _itemContainerGenerator; 
//            private Panel _itemsHost;
//            private ScrollViewer _scrollHost;
		},
		
//        private void 
        CreateItemCollectionAndGenerator:function() 
        { 
            this._items = new ItemCollection(this);
 
            // ItemInfos must get adjusted before the generator's change handler is called,
            // so that any new ItemInfos arising from the generator don't get adjusted by mistake
            // (see Win8 690623).
            /*((INotifyCollectionChanged)_items)*/this._items.CollectionChanged.Combine(
            		new NotifyCollectionChangedEventHandler(this, this.OnItemCollectionChanged1)); 

            // the generator must attach its collection change handler before 
            // the control itself, so that the generator is up-to-date by the 
            // time the control tries to use it (bug 892806 et al.)
            this._itemContainerGenerator = new ItemContainerGenerator(this); 

            this._itemContainerGenerator.ChangeAlternationCount();

            /*((INotifyCollectionChanged)_items)*/this._items.CollectionChanged.Combine(
            		new NotifyCollectionChangedEventHandler(this, this.OnItemCollectionChanged2)); 

            if (this.IsInitPending) 
            { 
            	this._items.BeginInit();
            } 
            else if (this.IsInitialized)
            {
            	this._items.BeginInit();
            	this._items.EndInit(); 
            }
 
            /*((INotifyCollectionChanged)_groupStyle)*/this._groupStyle.CollectionChanged.Combine(
            		new NotifyCollectionChangedEventHandler(this, this.OnGroupStyleChanged)); 
        },
        
        /// <summary> 
        /// Called when the value of ItemsSource changes.
        /// </summary> 
//        protected virtual void 
        OnItemsSourceChanged:function(/*IEnumerable*/ oldValue, /*IEnumerable*/ newValue) 
        {
        },
        
        // this is called before the generator's change handler 
//        private void 
        OnItemCollectionChanged1:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
        	
        	this.AdjustItemInfoOverride(e); 
        },

        // this is called after the generator's change handler
//        private void 
        OnItemCollectionChanged2:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            this.SetValue(ItemsControl.HasItemsPropertyKey, (this._items != null) && !this._items.IsEmpty); 
 
            // If the focused item is removed, drop our reference to it.
            if (this._focusedInfo != null && this._focusedInfo.Index < 0) 
            {
            	this._focusedInfo = null;
            }
 
            // on Reset, discard item storage
            if (e.Action == NotifyCollectionChangedAction.Reset) 
            { 
                /*((IContainItemStorage)this)*/this.Clear();
            } 

            this.OnItemsChanged(e);
        },
 
        /// <summary>
        ///     This method is invoked when the Items property changes. 
        /// </summary> 
//        protected virtual void 
        OnItemsChanged:function(/*NotifyCollectionChangedEventArgs*/ e)
        { 
        },

        /// <summary>
        ///     Adjust ItemInfos when the Items property changes. 
        /// </summary>
//        internal virtual void 
        AdjustItemInfoOverride:function(/*NotifyCollectionChangedEventArgs*/ e) 
        { 
        	this.AdjustItemInfo(e, this._focusedInfo);
        },
        
        // DisplayMemberPath and ItemStringFormat use the ItemTemplateSelector property 
        // to achieve the desired result.  When either of these properties change,
        // update the ItemTemplateSelector property here. 
//        private void 
        UpdateDisplayMemberTemplateSelector:function() 
        {
            /*string*/var displayMemberPath = this.DisplayMemberPath; 
            /*string*/var itemStringFormat = this.ItemStringFormat;

            if (!String.IsNullOrEmpty(displayMemberPath) || !String.IsNullOrEmpty(itemStringFormat))
            { 
                // One or both of DisplayMemberPath and ItemStringFormat are desired.
                // Set ItemTemplateSelector to an appropriate object, provided that 
                // this doesn't conflict with the user's own setting. 
                /*DataTemplateSelector*/var itemTemplateSelector = this.ItemTemplateSelector;
                if (itemTemplateSelector != null && !(itemTemplateSelector instanceof DisplayMemberTemplateSelector)) 
                {
                    // if ITS was actually set to something besides a DisplayMember selector,
                    // it's an error to overwrite it with a DisplayMember selector
                    // unless ITS came from a style and DMP is local 
                    if (this.ReadLocalValue(ItemsControl.ItemTemplateSelectorProperty) != DependencyProperty.UnsetValue ||
                    		this.ReadLocalValue(ItemsControl.DisplayMemberPathProperty) == DependencyProperty.UnsetValue) 
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.DisplayMemberPathAndItemTemplateSelectorDefined));
                    } 
                }

                // now set the ItemTemplateSelector to use the new DisplayMemberPath and ItemStringFormat
                this.ItemTemplateSelector = new DisplayMemberTemplateSelector(this.DisplayMemberPath, this.ItemStringFormat); 
            }
            else 
            { 
                // Neither property is desired.  Clear the ItemTemplateSelector if
                // we had set it earlier. 
                if (this.ItemTemplateSelector instanceof DisplayMemberTemplateSelector)
                {
                	this.ClearValue(ItemsControl.ItemTemplateSelectorProperty);
                } 
            }
        }, 
 
        /// <summary>
        ///     This method is invoked when the DisplayMemberPath property changes. 
        /// </summary>
        /// <param name="oldDisplayMemberPath">The old value of the DisplayMemberPath property.</param>
        /// <param name="newDisplayMemberPath">The new value of the DisplayMemberPath property.</param>
//        protected virtual void 
        OnDisplayMemberPathChanged:function(/*string*/ oldDisplayMemberPath, /*string*/ newDisplayMemberPath) 
        {
        }, 
 
        /// <summary> 
        ///     This method is invoked when the ItemTemplate property changes.
        /// </summary> 
        /// <param name="oldItemTemplate">The old value of the ItemTemplate property.</param>
        /// <param name="newItemTemplate">The new value of the ItemTemplate property.</param>
//        protected virtual void 
        OnItemTemplateChanged:function(/*DataTemplate*/ oldItemTemplate, /*DataTemplate*/ newItemTemplate)
        { 
            this.CheckTemplateSource();
 
            if (this._itemContainerGenerator != null) 
            {
            	this._itemContainerGenerator.Refresh(); 
            }
        },

        /// <summary> 
        ///     This method is invoked when the ItemTemplateSelector property changes.
        /// </summary>
        /// <param name="oldItemTemplateSelector">The old value of the ItemTemplateSelector property.</param>
        /// <param name="newItemTemplateSelector">The new value of the ItemTemplateSelector property.</param> 
//        protected virtual void 
        OnItemTemplateSelectorChanged:function(/*DataTemplateSelector*/ oldItemTemplateSelector, /*DataTemplateSelector*/ newItemTemplateSelector)
        { 
        	this.CheckTemplateSource(); 

            if ((this._itemContainerGenerator != null) && (this.ItemTemplate == null)) 
            {
            	this._itemContainerGenerator.Refresh();
            }
        }, 

        /// <summary> 
        ///     This method is invoked when the ItemStringFormat property changes.
        /// </summary>
        /// <param name="oldItemStringFormat">The old value of the ItemStringFormat property.</param>
        /// <param name="newItemStringFormat">The new value of the ItemStringFormat property.</param> 
//        protected virtual void 
        OnItemStringFormatChanged:function(/*String*/ oldItemStringFormat, /*String*/ newItemStringFormat)
        { 
        }, 

        /// <summary> 
        ///     This method is invoked when the ItemBindingGroup property changes.
        /// </summary> 
        /// <param name="oldItemBindingGroup">The old value of the ItemBindingGroup property.</param> 
        /// <param name="newItemBindingGroup">The new value of the ItemBindingGroup property.</param>
//        protected virtual void 
        OnItemBindingGroupChanged:function(/*BindingGroup*/ oldItemBindingGroup, /*BindingGroup*/ newItemBindingGroup) 
        {
        },

 
        /// <summary>
        /// Throw if more than one of DisplayMemberPath, xxxTemplate and xxxTemplateSelector 
        /// properties are set on the given element. 
        /// </summary>
//        private void 
        CheckTemplateSource:function() 
        {
            if (String.IsNullOrEmpty(this.DisplayMemberPath))
            {
                Helper.CheckTemplateAndTemplateSelector("Item", ItemsControl.ItemTemplateProperty, ItemsControl.ItemTemplateSelectorProperty, this); 
            }
            else 
            { 
                if (!(this.ItemTemplateSelector instanceof DisplayMemberTemplateSelector))
                { 
                    throw new InvalidOperationException(SR.Get(SRID.ItemTemplateSelectorBreaksDisplayMemberPath));
                }
                if (Helper.IsTemplateDefined(ItemsControl.ItemTemplateProperty, this))
                { 
                    throw new InvalidOperationException(SR.Get(SRID.DisplayMemberPathAndItemTemplateDefined));
                } 
            } 
        },
        /// <summary>
        ///     This method is invoked when the ItemContainerStyle property changes.
        /// </summary>
        /// <param name="oldItemContainerStyle">The old value of the ItemContainerStyle property.</param> 
        /// <param name="newItemContainerStyle">The new value of the ItemContainerStyle property.</param>
//        protected virtual void 
        OnItemContainerStyleChanged:function(/*Style*/ oldItemContainerStyle, /*Style*/ newItemContainerStyle) 
        { 
            Helper.CheckStyleAndStyleSelector("ItemContainer", ItemsControl.ItemContainerStyleProperty, ItemsControl.ItemContainerStyleSelectorProperty, this);
 
            if (this._itemContainerGenerator != null)
            {
            	this._itemContainerGenerator.Refresh();
            } 
        },
        /// <summary>
        ///     This method is invoked when the ItemContainerStyleSelector property changes. 
        /// </summary>
        /// <param name="oldItemContainerStyleSelector">The old value of the ItemContainerStyleSelector property.</param> 
        /// <param name="newItemContainerStyleSelector">The new value of the ItemContainerStyleSelector property.</param> 
//        protected virtual void 
        OnItemContainerStyleSelectorChanged:function(/*StyleSelector*/ oldItemContainerStyleSelector, /*StyleSelector*/ newItemContainerStyleSelector)
        { 
            Helper.CheckStyleAndStyleSelector("ItemContainer", ItemsControl.ItemContainerStyleProperty, ItemsControl.ItemContainerStyleSelectorProperty, this);

            if ((this._itemContainerGenerator != null) && (this.ItemContainerStyle == null))
            { 
            	this._itemContainerGenerator.Refresh();
            } 
        }, 

        /// <summary>
        ///     This method is invoked when the ItemsPanel property changes. 
        /// </summary> 
        /// <param name="oldItemsPanel">The old value of the ItemsPanel property.</param>
        /// <param name="newItemsPanel">The new value of the ItemsPanel property.</param> 
//        protected virtual void 
        OnItemsPanelChanged:function(/*ItemsPanelTemplate*/ oldItemsPanel, /*ItemsPanelTemplate*/ newItemsPanel)
        {
            this.ItemContainerGenerator.OnPanelChanged();
        }, 

//        internal virtual void 
        OnIsGroupingChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        { 
        	ShouldCoerceScrollUnitField.SetValue(this, true);
//            CoerceValue(VirtualizingStackPanel.ScrollUnitProperty);  //cym comment

            ShouldCoerceCacheSizeField.SetValue(this, true);
//            CoerceValue(VirtualizingPanel.CacheLengthUnitProperty); //cym comment
 
            /*((IContainItemStorage)this)*/this.Clear();
        }, 

//        private void 
        OnGroupStyleChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (this._itemContainerGenerator != null) 
            { 
            	this._itemContainerGenerator.Refresh();
            } 
        },
 
        /// <summary> 
        ///     This method is invoked when the GroupStyleSelector property changes.
        /// </summary>
        /// <param name="oldGroupStyleSelector">The old value of the GroupStyleSelector property.</param>
        /// <param name="newGroupStyleSelector">The new value of the GroupStyleSelector property.</param> 
//        protected virtual void 
        OnGroupStyleSelectorChanged:function(/*GroupStyleSelector*/ oldGroupStyleSelector, /*GroupStyleSelector*/ newGroupStyleSelector)
        { 
            if (this._itemContainerGenerator != null) 
            {
            	this._itemContainerGenerator.Refresh(); 
            }
        },
 
        /// <summary> 
        ///     This method is invoked when the AlternationCount property changes.
        /// </summary> 
        /// <param name="oldAlternationCount">The old value of the AlternationCount property.</param>
        /// <param name="newAlternationCount">The new value of the AlternationCount property.</param>
//        protected virtual void 
        OnAlternationCountChanged:function(/*int*/ oldAlternationCount, /*int*/ newAlternationCount)
        { 
        	this.ItemContainerGenerator.ChangeAlternationCount();
        }, 

        ///<summary>
        /// Return the container belonging to the current ItemsControl that owns
        /// the given container element.  Return null if no such container exists. 
        ///</summary>
//        public DependencyObject 
        ContainerFromElement:function(/*DependencyObject*/ element) 
        { 
            return ItemsControl.ContainerFromElement(this, element);
        }, 

        /// <summary> 
        ///  Add an object child to this control 
        /// </summary>
//        protected virtual void 
        AddChild:function(/*object*/ value) 
        {
        	this.Items.Add(value);
        },
 
        /// <summary> 
        ///  Add a text string to this control
        /// </summary> 
//        protected virtual void 
        AddText:function(/*string*/ text)
        {
        	this.Items.Add(text);
        }, 

        /// <summary>
        /// Return the element used to display the given item 
        /// </summary> 
//        DependencyObject IGeneratorHost.
        GetContainerForItem:function(/*object*/ item)
        { 
            /*DependencyObject*/var container;

            // use the item directly, if possible (bug 870672)
            if (this.IsItemItsOwnContainerOverride(item)) 
                container = item instanceof DependencyObject ? item : null;
            else 
                container = this.GetContainerForItemOverride(); 

            // the container might have a parent from a previous 
            // generation (bug 873118).  If so, clean it up before using it again.
            //
            // Note: This assumes the container is about to be added to a new parent,
            // according to the ItemsControl/Generator/Container pattern. 
            // If someone calls the generator and doesn't add the container to
            // a visual parent, unexpected things might happen. 
            /*Visual*/var visual = container instanceof Visual ? container : null; 
            if (visual != null)
            { 
                /*Visual*/var parent = VisualTreeHelper.GetParent(visual);
                parent = parent instanceof Visual ? parent : null;
                if (parent != null)
                {
                    /*Panel*/var p = parent instanceof Panel ? parent : null;
                    if (p != null && (visual instanceof UIElement)) 
                    { 
                        p.Children.RemoveNoVerify(visual);
                    } 
                    else
                    {
                        /*((FrameworkElement)parent)*/parent.TemplateChild = null;
                    } 
                }
            } 
 
            return container;
        }, 

        /// <summary>
        /// Prepare the element to act as the ItemContainer for the corresponding item.
        /// </summary> 
//        void IGeneratorHost.
        PrepareItemContainer:function(/*DependencyObject*/ container, /*object*/ item)
        { 
            // GroupItems are special - their information comes from a different place 
            /*GroupItem*/var groupItem = container instanceof  GroupItem ? container : null;
            if (groupItem != null) 
            {
                groupItem.PrepareItemContainer(item, this);
                return;
            } 

            if (this.ShouldApplyItemContainerStyle(container, item)) 
            { 
                // apply the ItemContainer style (if any)
            	this.ApplyItemContainerStyle(container, item); 
            }

            // forward ItemTemplate, et al.
            this.PrepareContainerForItemOverride(container, item); 

            // set up the binding group 
            if (!Helper.HasUnmodifiedDefaultValue(this, ItemsControl.ItemBindingGroupProperty) && 
                Helper.HasUnmodifiedDefaultOrInheritedValue(container, FrameworkElement.BindingGroupProperty))
            { 
                /*BindingGroup*/var itemBindingGroup = this.ItemBindingGroup;
                /*BindingGroup*/var containerBindingGroup =
                    (itemBindingGroup != null)  ? new BindingGroup(itemBindingGroup)
                                                : null; 
                container.SetValue(FrameworkElement.BindingGroupProperty, containerBindingGroup);
            } 
            
            EnsureTreeViewItem();
            if(TreeViewItem != null){
                var treeViewItem = container instanceof TreeViewItem ? container : null; 
                if (treeViewItem != null)
                {
                    treeViewItem.PrepareItemContainer(item, this);
                } 
            }
        },
 
        /// <summary> 
        /// Undo any initialization done on the element during GetContainerForItem and PrepareItemContainer
        /// </summary> 
//        void IGeneratorHost.
        ClearContainerForItem:function(/*DependencyObject*/ container, /*object*/ item)
        {
            // This method no longer does most of the work it used to (bug 1445288).
            // It is called when a container is removed from the tree;  such a 
            // container will be GC'd soon, so there's no point in changing
            // its properties. 
            // 
            // We still call the override method, to give subclasses a chance
            // to clean up anything they may have done during Prepare (bug 1561206). 

            /*GroupItem*/var groupItem = container instanceof GroupItem ? container : null;
            if (groupItem == null)
            { 
                this.ClearContainerForItemOverride(container, item);
 
//                /*TreeViewItem*/var treeViewItem = container instanceof EnsureTreeViewItem() ? container : null; 
//                if (treeViewItem != null)
//                { 
//                    treeViewItem.ClearItemContainer(item, this);
//                }
                
                EnsureTreeViewItem();
                if(TreeViewItem != null){
                    var treeViewItem = container instanceof TreeViewItem ? container : null; 
                    if (treeViewItem != null)
                    {
                        treeViewItem.PrepareItemContainer(item, this);
                    } 
                }
            }
            else 
            {
                // GroupItems are special - their information comes from a different place 
                // Recursively clear the sub-generators, so that ClearContainerForItemOverride 
                // is called on the bottom-level containers.
                groupItem.ClearItemContainer(item, this); 
            }
        },

        /// <summary> 
        /// Determine if the given element was generated for this host as an ItemContainer. 
        /// </summary>
//        bool IGeneratorHost.
        IsHostForItemContainer:function(/*DependencyObject*/ container) 
        {
            // If ItemsControlFromItemContainer can determine who owns the element,
            // use its decision.
            /*ItemsControl*/var ic = ItemsControl.ItemsControlFromItemContainer(container); 
            if (ic != null)
                return (ic == this); 
 
            // If the element is in my items view, and if it can be its own ItemContainer,
            // it's mine.  Contains may be expensive, so we avoid calling it in cases 
            // where we already know the answer - namely when the element has a
            // logical parent (ItemsControlFromItemContainer handles this case).  This
            // leaves only those cases where the element belongs to my items
            // without having a logical parent (e.g. via ItemsSource) and without 
            // having been generated yet. HasItem indicates if anything has been generated.
            /*DependencyObject*/var parent = LogicalTreeHelper.GetParent(container); 
            if (parent == null) 
            {
                return this.IsItemItsOwnContainerOverride(container) && 
                this.HasItems && this.Items.Contains(container);
            }

            // Otherwise it's not mine 
            return false;
        }, 
 
        /// <summary>
        /// Return the GroupStyle (if any) to use for the given group at the given level. 
        /// </summary>
//        GroupStyle IGeneratorHost.
        GetGroupStyle:function(/*CollectionViewGroup*/ group, /*int*/ level)
        {
            /*GroupStyle*/var result = null; 

            // a. Use global selector 
            if (this.GroupStyleSelector != null) 
            {
                result = this.GroupStyleSelector(group, level); 
            }

            // b. lookup in GroupStyle list
            if (result == null) 
            {
                // use last entry for all higher levels 
                if (level >= this.GroupStyle.Count) 
                {
                    level = this.GroupStyle.Count - 1; 
                }

                if (level >= 0)
                { 
                    result = this.GroupStyle.Get(level);
                } 
            } 

            return result; 
        },

        /// <summary>
        /// Communicates to the host that the generator is using grouping. 
        /// </summary>
//        void IGeneratorHost.
        SetIsGrouping:function(/*bool*/ isGrouping) 
        { 
        	this.SetValue(ItemsControl.IsGroupingPropertyKey, isGrouping);
        }, 

        /// <summary>
        ///     Initialization of this element is about to begin
        /// </summary>
//        public override void 
        BeginInit:function() 
        {
            Control.prototype.BeginInit.call(this); 
 
            if (this._items != null)
            { 
            	this._items.BeginInit();
            }
        },
 
        /// <summary>
        ///     Initialization of this element has completed 
        /// </summary> 
//        public override void 
        EndInit:function()
        { 
            if (this.IsInitPending)
            {
                if (this._items != null)
                { 
                	this._items.EndInit();
                } 
 
                Control.prototype.EndInit.call(this);
            } 
        },

        /// <summary> 
        /// Return true if the item is (or should be) its own item container 
        /// </summary>
//        public bool 
        IsItemItsOwnContainer:function(/*object*/ item) 
        {
            return this.IsItemItsOwnContainerOverride(item);
        },
        
//      /// <summary> 
//      /// Return true if the item is (or is eligible to be) its own ItemContainer 
//      /// </summary>
////      bool IGeneratorHost.
//      IsItemItsOwnContainer:function(/*object*/ item) 
//      {
//          return this.IsItemItsOwnContainer(item);
//      },
 
        /// <summary>
        /// Return true if the item is (or should be) its own item container 
        /// </summary> 
//        protected virtual bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item)
        { 
            return (item instanceof UIElement);
        },

        /// <summary> Create or identify the element used to display the given item. </summary> 
//        protected virtual DependencyObject 
        GetContainerForItemOverride:function()
        { 
            return new ContentPresenter(); 
        },
 
        /// <summary>
        /// Prepare the element to display the item.  This may involve
        /// applying styles, setting bindings, etc.
        /// </summary> 
//        protected virtual void 
        PrepareContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item)
        { 
            // Each type of "ItemContainer" element may require its own initialization. 
            // We use explicit polymorphism via internal methods for this.
            // 
            // Another way would be to define an interface IGeneratedItemContainer with
            // corresponding virtual "core" methods.  Base classes (ContentControl,
            // ItemsControl, ContentPresenter) would implement the interface
            // and forward the work to subclasses via the "core" methods. 
            //
            // While this is better from an OO point of view, and extends to 
            // 3rd-party elements used as containers, it exposes more public API. 
            // Management considers this undesirable, hence the following rather
            // inelegant code. 

            /*HeaderedContentControl*/var hcc;
            /*ContentControl*/var cc;
            /*ContentPresenter*/var cp; 
            /*ItemsControl*/var ic;
            /*HeaderedItemsControl*/var hic; 
 
            if ((hcc = element instanceof HeaderedContentControl ? element : null) != null)
            { 
                hcc.PrepareHeaderedContentControl(item, this.ItemTemplate, this.ItemTemplateSelector, this.ItemStringFormat);
            }
            else if ((cc = element instanceof ContentControl ? element : null) != null)
            { 
                cc.PrepareContentControl(item, this.ItemTemplate, this.ItemTemplateSelector, this.ItemStringFormat);
            } 
            else if ((cp = element instanceof ContentPresenter ? element : null) != null) 
            {
                cp.PrepareContentPresenter(item, this.ItemTemplate, this.ItemTemplateSelector, this.ItemStringFormat); 
            }
            else if ((hic = element instanceof HeaderedItemsControl ? element : null) != null)
            {
                hic.PrepareHeaderedItemsControl(item, this); 
            }
            else if ((ic = element instanceof ItemsControl ? element : null) != null) 
            { 
                if (ic != this)
                { 
                    ic.PrepareItemsControl(item, this);
                }
            }
        }, 

        /// <summary> 
        /// Undo the effects of PrepareContainerForItemOverride. 
        /// </summary>
//        protected virtual void 
        ClearContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item) 
        {
            /*HeaderedContentControl*/var hcc;
            /*ContentControl*/var cc;
            /*ContentPresenter*/var cp; 
            /*ItemsControl*/var ic;
            /*HeaderedItemsControl*/var hic; 
 
            if ((hcc = element instanceof HeaderedContentControl ? element : null) != null)
            { 
                hcc.ClearHeaderedContentControl(item);
            }
            else if ((cc = element instanceof ContentControl ? element : null) != null)
            { 
                cc.ClearContentControl(item);
            } 
            else if ((cp = element instanceof ContentPresenter ? element : null) != null) 
            {
                cp.ClearContentPresenter(item); 
            }
            else if ((hic = element instanceof HeaderedItemsControl ? element : null) != null)
            {
                hic.ClearHeaderedItemsControl(item); 
            }
            else if ((ic = element instanceof ItemsControl ? element : null) != null) 
            { 
                if (ic != this)
                { 
                    ic.ClearItemsControl(item);
                }
            }
        },
        /// <summary> 
        ///     Called when a TextInput event is received. 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnTextInput:function(/*TextCompositionEventArgs*/ e)
        {
            Control.prototype.OnTextInput.call(this, e);
 
            // Only handle text from ourselves or an item container
            if (!String.IsNullOrEmpty(e.Text) && this.IsTextSearchEnabled && 
                (e.OriginalSource == this 
                		|| ItemsControl.ItemsControlFromItemContainer(e.OriginalSource instanceof DependencyObject ? e.OriginalSource : null) == this)) 
            {
                /*TextSearch*/var instance = TextSearch.EnsureInstance(this); 

                if (instance != null)
                {
                    instance.DoSearch(e.Text); 
                    // Note: we always want to handle the event to denote that we
                    // actually did something.  We wouldn't want an AccessKey 
                    // to get invoked just because there wasn't a match here. 
                    e.Handled = true;
                } 
            }
        },

        /// <summary> 
        ///     Called when a KeyDown event is received.
        /// </summary> 
        /// <param name="e"></param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
            Control.prototype.OnKeyDown.call(this, e);
            if (this.IsTextSearchEnabled)
            {
                // If the pressed the backspace key, delete the last character 
                // in the TextSearch current prefix.
                if (e.Key == Key.Back) 
                { 
                    /*TextSearch*/var instance = TextSearch.EnsureInstance(this);
 
                    if (instance != null)
                    {
                        instance.DeleteLastCharacter();
                    } 
                }
            } 
        },

//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate, /*FrameworkTemplate*/ newTemplate) 
        {
            // Forget about the old ItemsHost we had when the style changes
        	this._itemsHost = null;
        	this._scrollHost = null; 
        	this.WriteControlFlag(ControlBoolFlags.ScrollHostValid, false);
 
            Control.prototype.OnTemplateChangedInternal.call(this, oldTemplate, newTemplate); 
        },
 
        /// <summary>
        /// Determine whether the ItemContainerStyle/StyleSelector should apply to the container
        /// </summary>
        /// <returns>true if the ItemContainerStyle should apply to the item</returns> 
//        protected virtual bool 
        ShouldApplyItemContainerStyle:function(/*DependencyObject*/ container, /*object*/ item)
        { 
            return true; 
        },
 
        /// <summary>
        /// Prepare to display the item.
        /// </summary> 
//        internal void 
        PrepareItemsControl:function(/*object*/ item, /*ItemsControl*/ parentItemsControl)
        { 
            if (item != this) 
            {
                // copy templates and styles from parent ItemsControl 
                /*DataTemplate*/var itemTemplate = parentItemsControl.ItemTemplate;
                /*DataTemplateSelector*/var itemTemplateSelector = parentItemsControl.ItemTemplateSelector;
                /*string*/var itemStringFormat = parentItemsControl.ItemStringFormat;
                /*Style*/var itemContainerStyle = parentItemsControl.ItemContainerStyle; 
                /*StyleSelector*/var itemContainerStyleSelector = parentItemsControl.ItemContainerStyleSelector;
                /*int*/var alternationCount = parentItemsControl.AlternationCount; 
                /*BindingGroup*/var itemBindingGroup = parentItemsControl.ItemBindingGroup; 

                if (itemTemplate != null) 
                {
                    this.SetValue(ItemsControl.ItemTemplateProperty, itemTemplate);
                }
                if (itemTemplateSelector != null) 
                {
                	this.SetValue(ItemsControl.ItemTemplateSelectorProperty, itemTemplateSelector); 
                } 
                if (itemStringFormat != null &&
                    Helper.HasDefaultValue(this, ItemsControl.ItemStringFormatProperty)) 
                {
                	this.SetValue(ItemsControl.ItemStringFormatProperty, itemStringFormat);
                }
                if (itemContainerStyle != null && 
                    Helper.HasDefaultValue(this, ItemsControl.ItemContainerStyleProperty))
                { 
                	this.SetValue(ItemsControl.ItemContainerStyleProperty, itemContainerStyle); 
                }
                if (itemContainerStyleSelector != null && 
                    Helper.HasDefaultValue(this, ItemsControl.ItemContainerStyleSelectorProperty))
                {
                	this.SetValue(ItemsControl.ItemContainerStyleSelectorProperty, itemContainerStyleSelector);
                } 
                if (alternationCount != 0 &&
                    Helper.HasDefaultValue(this, ItemsControl.AlternationCountProperty)) 
                { 
                	this.SetValue(ItemsControl.AlternationCountProperty, alternationCount);
                } 
                if (itemBindingGroup != null &&
                    Helper.HasDefaultValue(this, ItemsControl.ItemBindingGroupProperty))
                {
                	this.SetValue(ItemsControl.ItemBindingGroupProperty, itemBindingGroup); 
                }
            } 
        }, 

        /// <summary> 
        /// Undo the effect of PrepareItemsControl.
        /// </summary>
//        internal void 
        ClearItemsControl:function(/*object*/ item)
        { 
            if (item != this)
            { 
                // nothing to do 
            }
        }, 

//        /// <summary>
//        /// Bringing the item passed as arg into view. If item is virtualized it will become realized.
//        /// </summary> 
//        /// <param name="arg"></param>
//        /// <returns></returns> 
////        internal object 
//        OnBringItemIntoView:function(/*object*/ arg) 
//        {
//            return this.OnBringItemIntoView(this.NewItemInfo(arg)); 
//        },
//
////        internal object 
//        OnBringItemIntoView:function(/*ItemInfo*/ info)
//        { 
//            /*FrameworkElement*/var element = info.Container instanceof FrameworkElement ? info.Container : null;
//            if (element != null) 
//            { 
//                element.BringIntoView();
//            } 
//            else if ((info = this.LeaseItemInfo(info, true)).Index >= 0)
//            {
//                // We might be virtualized, try to de-virtualize the item.
//                // Note: There is opportunity here to make a public OM. 
//                /*VirtualizingPanel*/var itemsHost = this.ItemsHost instanceof VirtualizingPanel ? this.ItemsHost : null;
//                if (itemsHost != null) 
//                { 
//                    itemsHost.BringIndexIntoView(info.Index);
//                } 
//            }
//
//            return null;
//        }, 
        
        /// <summary>
        /// Bringing the item passed as arg into view. If item is virtualized it will become realized.
        /// </summary> 
        /// <param name="arg"></param>
        /// <returns></returns> 
//        internal object 
        OnBringItemIntoView:function(/*object*/ arg) 
        {
             
        },

//        internal object 
        OnBringItemIntoView:function(/*ItemInfo*/ info)
        { 
        	if(info instanceof ItemInfo){
        		/*FrameworkElement*/var element = info.Container instanceof FrameworkElement ? info.Container : null;
                if (element != null) 
                { 
                    element.BringIntoView();
                } 
                else if ((info = this.LeaseItemInfo(info, true)).Index >= 0)
                {
                    // We might be virtualized, try to de-virtualize the item.
                    // Note: There is opportunity here to make a public OM. 
                    /*VirtualizingPanel*/var itemsHost = this.ItemsHost instanceof VirtualizingPanel ? this.ItemsHost : null;
                    if (itemsHost != null) 
                    { 
                        itemsHost.BringIndexIntoView(info.Index);
                    } 
                }

                return null;
        	}else{
        		return this.OnBringItemIntoView(this.NewItemInfo(arg));
        	}
        }, 
////        internal bool 
//        NavigateByLine:function(/*FocusNavigationDirection*/ direction, /*ItemNavigateArgs*/ itemNavigateArgs)
//        {
//            return this.NavigateByLine(this.FocusedInfo, 
//            		Keyboard.FocusedElement instanceof FrameworkElement ? Keyboard.FocusedElement : null, direction, itemNavigateArgs); 
//        },
//        
////      internal bool 
//        NavigateByLine:function(/*ItemInfo*/ startingInfo,
//            /*FocusNavigationDirection*/ direction, 
//            /*ItemNavigateArgs*/ itemNavigateArgs) 
//        {
//            return this.NavigateByLine(startingInfo, null, direction, itemNavigateArgs); 
//        },
////        internal bool 
//        NavigateByLine:function(/*ItemInfo*/ startingInfo,
//            /*FrameworkElement*/ startingElement, 
//            /*FocusNavigationDirection*/ direction,
//            /*ItemNavigateArgs*/ itemNavigateArgs) 
//        { 
//            if (this.ItemsHost == null)
//            { 
//                return false;
//            }
//
//            // If the focused container/item has been scrolled out of view and they want to 
//            // start navigating again, scroll it back into view.
//            if (startingElement != null) 
//            { 
//            	this.MakeVisible(startingElement, direction, false);
//            } 
//            else
//            {
//            	var startingElementOut = {
//                		"startingElement" : startingElement
//                	};
//                this.MakeVisible(startingInfo, direction, /*out startingElement*/startingElementOut); 
//                startingElement=startingElementOut.startingElement;
//            } 
//
//            /*object*/var startingItem = (startingInfo != null) ? startingInfo.Item : null; 
// 
//            // When we get here if startingItem is non-null, it must be on the visible page.
//            /*FrameworkElement*/var container; 
//            return NavigateByLineInternal(startingItem,
//                direction,
//                startingElement,
//                itemNavigateArgs, 
//                true /*shouldFocus*/,
//                /*out container*/{"container" : container}); 
//        }, 
        
//      internal bool 
        
//        internal bool 
        NavigateByLine:function(/*ItemInfo*/ startingInfo,
            /*FrameworkElement*/ startingElement, 
            /*FocusNavigationDirection*/ direction,
            /*ItemNavigateArgs*/ itemNavigateArgs) 
        { 
        	if(arguments.length == 4){
        		if (this.ItemsHost == null)
                { 
                    return false;
                }

                // If the focused container/item has been scrolled out of view and they want to 
                // start navigating again, scroll it back into view.
                if (startingElement != null) 
                { 
                	this.MakeVisible(startingElement, direction, false);
                } 
                else
                {
                	var startingElementOut = {
                    		"startingElement" : startingElement
                    	};
                    this.MakeVisible(startingInfo, direction, /*out startingElement*/startingElementOut); 
                    startingElement=startingElementOut.startingElement;
                } 

                /*object*/var startingItem = (startingInfo != null) ? startingInfo.Item : null; 
     
                // When we get here if startingItem is non-null, it must be on the visible page.
                /*FrameworkElement*/var container; 
                return this.NavigateByLineInternal(startingItem,
                    direction,
                    startingElement,
                    itemNavigateArgs, 
                    true /*shouldFocus*/,
                    /*out container*/{"container" : container});
        	}else if(arguments.length == 3){
    	        itemNavigateArgs = direction;
    	        direction = startingElement;
        	        
        		return this.NavigateByLine(startingInfo, null, direction, itemNavigateArgs); 
        	}else if(arguments.length == 2){
            	itemNavigateArgs = startingElement;
            	direction = startingInfo;
        		return this.NavigateByLine(this.FocusedInfo, 
                		Keyboard.FocusedElement instanceof FrameworkElement ? Keyboard.FocusedElement : null, direction, itemNavigateArgs); 
        	}
             
        }, 
 
//        internal void 
        PrepareNavigateByLine:function(/*ItemInfo*/ startingInfo, 
            /*FrameworkElement*/ startingElement,
            /*FocusNavigationDirection*/ direction, 
            /*ItemNavigateArgs*/ itemNavigateArgs,
            /*out FrameworkElement*/ containerOut)
        {
        	containerOut.container = null; 
            if (this.ItemsHost == null)
            { 
                return; 
            }
 
            // If the focused container/item has been scrolled out of view and they want to
            // start navigating again, scroll it back into view.
            if (startingElement != null)
            { 
            	this.MakeVisible(startingElement, direction, false);
            } 
            else 
            {
            	var startingElementOut = {
            		"startingElement" : startingElement
            	};
            	this.MakeVisible(startingInfo, direction, /*out startingElement*/startingElementOut); 
            	startingElement=startingElementOut.startingElement;
            }

            /*object*/var startingItem = (startingInfo != null) ? startingInfo.Item : null;
 
            // When we get here if startingItem is non-null, it must be on the visible page.
            this.NavigateByLineInternal(startingItem, 
                direction, 
                startingElement,
                itemNavigateArgs, 
                false /*shouldFocus*/,
                /*out container*/containerOut);
        },
        
//        private bool 
        NavigateByLineInternal:function(/*object*/ startingItem, 
            /*FocusNavigationDirection*/ direction,
            /*FrameworkElement*/ startingElement,
            /*ItemNavigateArgs*/ itemNavigateArgs,
            /*bool*/ shouldFocus, 
            /*out FrameworkElement container*/containerOut)
        { 
        	containerOut.container = null; 

            // 
            // If there is no starting item, just navigate to the first item.
            //
            if (startingItem == null &&
                (startingElement == null || startingElement == this)) 
            {
                return this.NavigateToStartInternal(itemNavigateArgs, shouldFocus, /*out container*/containerOut); 
            } 
            else
            { 
                /*FrameworkElement*/var nextElement = null;

                //
                // If the container isn't there, it might have been degenerated or 
                // it might have been scrolled out of view.  Either way, we
                // should start navigation from the ItemsHost b/c we know it 
                // is visible. 
                // The generator could have given us an element which isn't
                // actually visually connected.  In this case we should use 
                // the ItemsHost as well.
                //
                if (startingElement == null || !this.ItemsHost.IsAncestorOf(startingElement))
                { 
                    //
                    // Bug 991220 makes it so that we have to start from the ScrollHost. 
                    // If we try to start from the ItemsHost it will always skip the first item. 
                    //
                    startingElement = this.ScrollHost; 
                }
                else
                {
                    // if the starting element is with in an element with contained or cycle scope 
                    // then let the default keyboard navigation logic kick in.
                    /*DependencyObject*/var startingParent = VisualTreeHelper.GetParent(startingElement); 
                    while (startingParent != null && 
                        startingParent != this.ItemsHost)
                    { 
                        /*KeyboardNavigationMode*/var mode = KeyboardNavigation.GetDirectionalNavigation(startingParent);
                        if (mode == KeyboardNavigationMode.Contained ||
                            mode == KeyboardNavigationMode.Cycle)
                        { 
                            return false;
                        } 
                        startingParent = VisualTreeHelper.GetParent(startingParent); 
                    }
                } 

                var isHorizontal = (this.ItemsHost != null 
                		&& this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal);
                
                //the follow code modified byu cym 
                var treeViewNavigation = false;
                EnsureTreeView();
                if(TreeView != null){
                	treeViewNavigation = (this instanceof TreeView);
                }
//                var treeViewNavigation = (this instanceof TreeView);
                nextElement = KeyboardNavigation.Current.PredictFocusedElement(startingElement, 
                    direction,
                    treeViewNavigation);
                nextElement =nextElement instanceof FrameworkElement ? nextElement : null; 
 
                if (this.ScrollHost != null)
                { 
                    var didScroll = false;
                    /*FrameworkElement*/var viewport = GetViewportElement();
                    /*VirtualizingPanel*/var virtualizingPanel = this.ItemsHost instanceof VirtualizingPanel ? this.ItemsHost : null;
                    var isCycle = KeyboardNavigation.GetDirectionalNavigation(this) == KeyboardNavigationMode.Cycle; 

                    while (true) 
                    { 
                        if (nextElement != null)
                        { 
                            if (virtualizingPanel != null &&
                                this.ScrollHost.CanContentScroll &&
                                VirtualizingPanel.GetIsVirtualizing(this))
                            { 
                                /*Rect*/var currentRect;
                                var currentRectOut = {
                                	"currentRect" : currentRect
                                };
                                var ele = ItemsControl.TryGetTreeViewItemHeader(nextElement);
                                ele =ele instanceof FrameworkElement ? ele : null;
                                /*ElementViewportPosition*/var elementPosition = this.GetElementViewportPosition(viewport, 
                                    /*TryGetTreeViewItemHeader(nextElement) as FrameworkElement*/ele, 
                                    direction,
                                    false /*fullyVisible*/, 
                                    /*out currentRect*/currentRectOut);
                                currentRect = currentRectOut.currentRect;
                                if (elementPosition == ElementViewportPosition.CompletelyInViewport ||
                                    elementPosition == ElementViewportPosition.PartiallyInViewport)
                                { 
                                    if (!isCycle)
                                    { 
                                        break; 
                                    }
                                    else 
                                    {
                                        /*Rect*/var startingRect;
                                        var startingRectOut = {
                                        	"startingRect" : startingRect
                                        };
                                        
                                        GetElementViewportPosition(viewport,
                                            startingElement, 
                                            direction,
                                            false /*fullyVisible*/, 
                                            /*out startingRect*/startingRectOut); 
                                        startingRect= startingRectOut.startingRect;
                                        var isInDirection = this.IsInDirectionForLineNavigation(startingRect, currentRect, direction, isHorizontal);
                                        if (isInDirection) 
                                        {
                                            // If the next element in cycle mode is in direction
                                            // then this is a valid candidate, If not then try
                                            // scrolling. 
                                            break;
                                        } 
                                    } 
                                }
                            } 
                            else
                            {
                                break;
                            } 

                            // 
                            // We are disregarding the previously predicted element because 
                            // it is outside the viewport extents of a VirtualizingPanel
                            // 
                            nextElement = null;
                        }

                        /*double*/var oldHorizontalOffset = this.ScrollHost.HorizontalOffset; 
                        /*double*/var oldVerticalOffset = this.ScrollHost.VerticalOffset;
 
                        switch (direction) 
                        {
                            case FocusNavigationDirection.Down: 
                                {
                                    didScroll = true;
                                    if (isHorizontal)
                                    { 
                                        this.ScrollHost.LineRight();
                                    } 
                                    else 
                                    {
                                        this.ScrollHost.LineDown(); 
                                    }
                                }
                                break;
                            case FocusNavigationDirection.Up: 
                                {
                                    didScroll = true; 
                                    if (isHorizontal) 
                                    {
                                        this.ScrollHost.LineLeft(); 
                                    }
                                    else
                                    {
                                        this.ScrollHost.LineUp(); 
                                    }
                                } 
                                break; 
                        }
 
                        this.ScrollHost.UpdateLayout();

                        // If offset does not change - exit the loop
                        if (DoubleUtil.AreClose(oldHorizontalOffset, ScrollHost.HorizontalOffset) && 
                            DoubleUtil.AreClose(oldVerticalOffset, ScrollHost.VerticalOffset))
                        { 
                            if (isCycle) 
                            {
                                if (direction == FocusNavigationDirection.Up) 
                                {
                                    // If scrollviewer cannot be scrolled any further,
                                    // then cycle and navigate to end.
                                    return NavigateToEndInternal(itemNavigateArgs, true, /*out container*/containerOut); 
                                }
                                else if (direction == FocusNavigationDirection.Down) 
                                { 
                                    // If scrollviewer cannot be scrolled any further,
                                    // then cycle and navigate to start. 
                                    return NavigateToStartInternal(itemNavigateArgs, true, /*out container*/containerOut);
                                }
                            }
                            break; 
                        }
 
                        nextElement = KeyboardNavigation.Current.PredictFocusedElement(startingElement, 
                            direction,
                            treeViewNavigation);
                        nextElement = nextElement instanceof FrameworkElement ? nextElement : null; 
                    }

                    if (didScroll && nextElement != null && this.ItemsHost.IsAncestorOf(nextElement))
                    { 
                        // Adjust offset so that the nextElement is aligned to the edge
                        this.AdjustOffsetToAlignWithEdge(nextElement, direction); 
                    } 
                }
 
                // We can only navigate there if the target element is in the items host.
                if ((nextElement != null) && (this.ItemsHost.IsAncestorOf(nextElement)))
                {
                    /*ItemsControl*/var itemsControl = null; 
                    var itemsControlOut = {"itemsControl" :itemsControl };
                    
                    /*object*/var nextItem = GetEncapsulatingItem(nextElement, 
                    		/*out container*/containerOut, /*out itemsControl*/itemsControlOut);
                    itemsControl = itemsControlOut.itemsControl;
                    containerOut.container = nextElement; 
 
                    if (shouldFocus)
                    { 
                        if (nextItem == DependencyProperty.UnsetValue || nextItem instanceof CollectionViewGroupInternal)
                        {
                            return nextElement.Focus();
                        } 
                        else if (itemsControl != null)
                        { 
                            return itemsControl.FocusItem(this.NewItemInfo(nextItem, containerOut.container), itemNavigateArgs); 
                        }
                    } 
                    else
                    {
                        return false;
                    } 
                }
            } 
            return false; 
        },
        
//        internal void 
        PrepareToNavigateByPage:function(/*ItemInfo*/ startingInfo,
            /*FrameworkElement*/ startingElement,
            /*FocusNavigationDirection*/ direction,
            /*ItemNavigateArgs*/ itemNavigateArgs, 
            /*out FrameworkElement container*/containerOut)
        { 
        	containerOut.container = null; 

            if (ItemsHost == null) 
            {
                return;
            }
 
            // If the focused container/item has been scrolled out of view and they want to
            // start navigating again, scroll it back into view. 
            if (startingElement != null) 
            {
                this.MakeVisible(startingElement, direction, /*alwaysAtTopOfViewport*/ false); 
            }
            else
            {
            	var startingElementOut = {
            		"startingElement" : startingElement
            	};
            	this.MakeVisible(startingInfo, direction, /*out startingElement*/startingElementOut); 
            	startingElement = startingElementOut.startingElement;
            }
 
            var startingItem = (startingInfo != null) ? startingInfo.Item : null; 

            // When we get here if startingItem is non-null, it must be on the visible page. 
            this.NavigateByPageInternal(startingItem,
                direction,
                startingElement,
                itemNavigateArgs, 
                false /*shouldFocus*/,
                /*out container*/containerOut); 
        }, 
        
////        internal bool 
//        NavigateByPage:function(/*FocusNavigationDirection*/ direction, /*ItemNavigateArgs*/ itemNavigateArgs) 
//        {
//            return this.NavigateByPage(this.FocusedInfo, 
//            		Keyboard.FocusedElement instanceof FrameworkElement ? Keyboard.FocusedElement : null, direction, itemNavigateArgs);
//        },
// 
////        internal bool 
//        NavigateByPage:function(
//            /*ItemInfo*/ startingInfo, 
//            /*FocusNavigationDirection*/ direction, 
//            /*ItemNavigateArgs*/ itemNavigateArgs)
//        { 
//            return this.NavigateByPage(startingInfo, null, direction, itemNavigateArgs);
//        },
//
////        internal bool 
//        NavigateByPage:function( 
//            /*ItemInfo*/ startingInfo,
//            /*FrameworkElement*/ startingElement, 
//            /*FocusNavigationDirection*/ direction, 
//            /*ItemNavigateArgs*/ itemNavigateArgs)
//        { 
//            if (this.ItemsHost == null)
//            {
//                return false;
//            } 
//
//            // If the focused container/item has been scrolled out of view and they want to 
//            // start navigating again, scroll it back into view. 
//            if (startingElement != null)
//            { 
//            	this.MakeVisible(startingElement, direction, /*alwaysAtTopOfViewport*/ false);
//            }
//            else
//            { 
////            	this.MakeVisible(startingInfo, direction, out startingElement);
//            	var startingElementOut = {
//                		"startingElement" : startingElement
//                	};
//                this.MakeVisible(startingInfo, direction, /*out startingElement*/startingElementOut); 
//                startingElement = startingElementOut.startingElement;
//            } 
// 
//            /*object*/var startingItem = (startingInfo != null) ? startingInfo.Item : null;
// 
//            // When we get here if startingItem is non-null, it must be on the visible page.
//            /*FrameworkElement*/var container;
//            return NavigateByPageInternal(startingItem,
//                direction, 
//                startingElement,
//                itemNavigateArgs, 
//                true /*shouldFocus*/, 
//                /*out container*/{"container" : container});
//        }, 

//        internal bool 
        NavigateByPage:function( 
            /*ItemInfo*/ startingInfo,
            /*FrameworkElement*/ startingElement, 
            /*FocusNavigationDirection*/ direction, 
            /*ItemNavigateArgs*/ itemNavigateArgs)
        { 
        	if(arguments.length == 4){
        		if (this.ItemsHost == null)
                {
                    return false;
                } 

                // If the focused container/item has been scrolled out of view and they want to 
                // start navigating again, scroll it back into view. 
                if (startingElement != null)
                { 
                	this.MakeVisible(startingElement, direction, /*alwaysAtTopOfViewport*/ false);
                }
                else
                { 
//                	this.MakeVisible(startingInfo, direction, out startingElement);
                	var startingElementOut = {
                    		"startingElement" : startingElement
                    	};
                    this.MakeVisible(startingInfo, direction, /*out startingElement*/startingElementOut); 
                    startingElement = startingElementOut.startingElement;
                } 
     
                /*object*/var startingItem = (startingInfo != null) ? startingInfo.Item : null;
     
                // When we get here if startingItem is non-null, it must be on the visible page.
                /*FrameworkElement*/var container;
                return NavigateByPageInternal(startingItem,
                    direction, 
                    startingElement,
                    itemNavigateArgs, 
                    true /*shouldFocus*/, 
                    /*out container*/{"container" : container});
        	}else if(arguments.length == 3){
        		itemNavigateArgs = direction;
        		direction = startingElement;
                return this.NavigateByPage(startingInfo, null, direction, itemNavigateArgs);
        	}else if(arguments.length == 2){
        		itemNavigateArgs = startingElement;
        		direction = startingInfo;
                return this.NavigateByPage(this.FocusedInfo, 
                		Keyboard.FocusedElement instanceof FrameworkElement ? Keyboard.FocusedElement : null, direction, itemNavigateArgs);	
        	}
            
        }, 

//        private bool 
        NavigateByPageInternal:function(/*object*/ startingItem,
            /*FocusNavigationDirection*/ direction,
            /*FrameworkElement*/ startingElement, 
            /*ItemNavigateArgs*/ itemNavigateArgs,
            /*bool*/ shouldFocus, 
            /*out FrameworkElement container*/containerOut) 
        {
        	containerOut.container = null; 

            //
            // Move to the last guy on the page if we're not already there.
            // 
            if (startingItem == null &&
                (startingElement == null || startingElement == this)) 
            { 
                return NavigateToFirstItemOnCurrentPage(startingItem, direction, itemNavigateArgs, 
                		shouldFocus, /*out container*/containerOut);
            } 
            else
            {
                //
                // See if the currently focused guy is the first or last one one the page 
                //
                /*FrameworkElement*/var firstElement; 
                var firstElementOut = {
                	"firstElement":firstElement
                }
                var firstItem = GetFirstItemOnCurrentPage(startingElement, direction, /*out firstElement*/firstElementOut); 
                firstElement =firstElementOut.firstElement;

                if ((Object.Equals(startingItem, firstItem) || 
                    Object.Equals(startingElement, firstElement)) &&
                    this.ScrollHost != null)
                {
                    var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal); 

                    do 
                    { 
                        var oldHorizontalOffset = this.ScrollHost.HorizontalOffset;
                        var oldVerticalOffset = this.ScrollHost.VerticalOffset; 

                        switch (direction)
                        {
                            case FocusNavigationDirection.Up: 
                                {
                                    if (isHorizontal) 
                                    { 
                                    	this.ScrollHost.PageLeft();
                                    } 
                                    else
                                    {
                                    	this.ScrollHost.PageUp();
                                    } 
                                }
                                break; 
 
                            case FocusNavigationDirection.Down:
                                { 
                                    if (isHorizontal)
                                    {
                                    	this.ScrollHost.PageRight();
                                    } 
                                    else
                                    { 
                                    	this.ScrollHost.PageDown(); 
                                    }
                                } 
                                break;
                        }

                        this.ScrollHost.UpdateLayout(); 

                        // If offset does not change - exit the loop 
                        if (DoubleUtil.AreClose(oldHorizontalOffset, ScrollHost.HorizontalOffset) && 
                            DoubleUtil.AreClose(oldVerticalOffset, ScrollHost.VerticalOffset))
                            break; 

                        firstItem = GetFirstItemOnCurrentPage(startingElement, direction, /*out firstElement*/firstElementOut);
                        firstElement = firstElementOut.firstElement;
                    }
                    while (firstItem == DependencyProperty.UnsetValue); 
                }
 
                containerOut.container = firstElement; 
                if (shouldFocus)
                { 
                    if (firstElement != null &&
                        (firstItem == DependencyProperty.UnsetValue || firstItem instanceof CollectionViewGroupInternal))
                    {
                        return firstElement.Focus(); 
                    }
                    else 
                    { 
                        /*ItemsControl*/var itemsControl = GetEncapsulatingItemsControl(firstElement);
                        if (itemsControl != null) 
                        {
                            return itemsControl.FocusItem(this.NewItemInfo(firstItem, firstElement), itemNavigateArgs);
                        }
                    } 
                }
            } 
            return false; 
        },
        
//        internal void 
        NavigateToStart:function(/*ItemNavigateArgs*/ itemNavigateArgs)
        {
            /*FrameworkElement*/var container;
            this.NavigateToStartInternal(itemNavigateArgs, true /*shouldFocus*/, /*out container*/{"container" : container}); 
        },
//        internal bool 
        NavigateToStartInternal:function(/*ItemNavigateArgs*/ itemNavigateArgs, 
        		/*bool*/ shouldFocus, /*out FrameworkElement container*/containerOut) 
        {
        	containerOut.container = null; 

            if (this.ItemsHost != null)
            {
                if (this.ScrollHost != null) 
                {
                    var oldHorizontalOffset = 0.0; 
                    var oldVerticalOffset = 0.0; 
                    var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal);
 
                    do
                    {
                        oldHorizontalOffset = this.ScrollHost.HorizontalOffset;
                        oldVerticalOffset = this.ScrollHost.VerticalOffset; 

                        if (isHorizontal) 
                        { 
                        	this.ScrollHost.ScrollToLeftEnd();
                        } 
                        else
                        {
                        	this.ScrollHost.ScrollToTop();
                        } 

                        // Wait for layout 
                        this.ItemsHost.UpdateLayout(); 
                    }
                    // If offset does not change - exit the loop 
                    while (!DoubleUtil.AreClose(oldHorizontalOffset, ScrollHost.HorizontalOffset) ||
                           !DoubleUtil.AreClose(oldVerticalOffset, ScrollHost.VerticalOffset));
                }
 
                /*FrameworkElement*/var firstElement;
                var firstElementOut = {
                	"firstElement" : firstElement
                };
                /*FrameworkElement*/var hopefulFirstElement = this.FindEndFocusableLeafContainer(this.ItemsHost, false /*last*/); 
                var firstItem = this.GetFirstItemOnCurrentPage(hopefulFirstElement, 
                    FocusNavigationDirection.Up,
                    /*out firstElement*/firstElementOut); 
                firstElement = firstElementOut.firstElement;
                containerOut.container = firstElement;
                if (shouldFocus)
                {
                    if (firstElement != null && 
                        (firstItem == DependencyProperty.UnsetValue || firstItem instanceof CollectionViewGroupInternal))
                    { 
                         return firstElement.Focus(); 
                    }
                    else 
                    {
                        /*ItemsControl*/var itemsControl = GetEncapsulatingItemsControl(firstElement);
                        if (itemsControl != null)
                        { 
                            return itemsControl.FocusItem(NewItemInfo(firstItem, firstElement), itemNavigateArgs);
                        } 
                    } 
                }
            } 
            return false;
        },

//        internal void 
        NavigateToEnd:function(/*ItemNavigateArgs*/ itemNavigateArgs) 
        {
            /*FrameworkElement*/var container; 
            this.NavigateToEndInternal(itemNavigateArgs, true /*shouldFocus*/, /*out container*/{"container" : container}); 
        },
//        internal bool 
        NavigateToEndInternal:function(/*ItemNavigateArgs*/ itemNavigateArgs, 
        		/*bool*/ shouldFocus, /*out FrameworkElement container*/containerOut)
        {
        	containerOut.container = null;
 
            if (this.ItemsHost != null)
            { 
                if (this.ScrollHost != null) 
                {
                    var oldHorizontalOffset = 0.0; 
                    var oldVerticalOffset = 0.0;
                    var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal);

                    do 
                    {
                        oldHorizontalOffset = this.ScrollHost.HorizontalOffset; 
                        oldVerticalOffset = this.ScrollHost.VerticalOffset; 

                        if (isHorizontal) 
                        {
                        	this.ScrollHost.ScrollToRightEnd();
                        }
                        else 
                        {
                        	this.ScrollHost.ScrollToBottom(); 
                        } 

                        // Wait for layout 
                        this.ItemsHost.UpdateLayout();
                    }
                    // If offset does not change - exit the loop
                    while (!DoubleUtil.AreClose(oldHorizontalOffset, this.ScrollHost.HorizontalOffset) || 
                           !DoubleUtil.AreClose(oldVerticalOffset, this.ScrollHost.VerticalOffset));
                } 
 
                /*FrameworkElement*/var lastElement;
                var lastElementOut = {
                	"firstElement" : lastElement
                };
                /*FrameworkElement*/var hopefulLastElement = this.FindEndFocusableLeafContainer(this.ItemsHost, true /*last*/); 
                var lastItem = this.GetFirstItemOnCurrentPage(hopefulLastElement,
                    FocusNavigationDirection.Down,
                    /*out lastElement*/lastElementOut);
                lastElement = lastElementOut.firstElement;
                containerOut.container = lastElement; 
                if (shouldFocus)
                { 
                    if (lastElement != null && 
                        (lastItem == DependencyProperty.UnsetValue || lastItem instanceof CollectionViewGroupInternal))
                    { 
                        return lastElement.Focus();
                    }
                    else
                    { 
                        /*ItemsControl*/var itemsControl = GetEncapsulatingItemsControl(lastElement);
                        if (itemsControl != null) 
                        { 
                            return itemsControl.FocusItem(NewItemInfo(lastItem, lastElement), itemNavigateArgs);
                        } 
                    }
                }
            }
            return false; 
        },
 
//        private FrameworkElement 
        FindEndFocusableLeafContainer:function(/*Panel*/ itemsHost, /*bool*/ last) 
        {
            if (itemsHost == null) 
            {
                return null;
            }
            /*UIElementCollection*/var children = itemsHost.Children; 
            if (children != null)
            { 
                var count = children.Count; 
                var i = (last ? count - 1 : 0);
                var incr = (last ? -1 : 1); 
                while (i >= 0 && i < count)
                {
                    /*FrameworkElement*/var fe = children[i];
                    fe = fe instanceof FrameworkElement ? fe : null
                    if (fe != null) 
                    {
                        /*ItemsControl*/var itemsControl = fe instanceof ItemsControl ? fe : null; 
                        /*FrameworkElement*/var result = null; 
                        if (itemsControl != null)
                        { 
                            if (itemsControl.ItemsHost != null)
                            {
                                result = this.FindEndFocusableLeafContainer(itemsControl.ItemsHost, last);
                            } 
                        }
                        else 
                        { 
                            /*GroupItem*/var groupItem = fe instanceof GroupItem ? fe : null;
                            if (groupItem != null && groupItem.ItemsHost != null) 
                            {
                                result = this.FindEndFocusableLeafContainer(groupItem.ItemsHost, last);
                            }
                        } 
                        if (result != null)
                        { 
                            return result; 
                        }
                        else if (KeyboardNavigation.IsFocusableInternal(fe)) 
                        {
                            return fe;
                        }
                    } 
                    i += incr;
                } 
            } 
            return null;
        }, 
        
////        internal void 
//        NavigateToItem:function(/*ItemInfo*/ info, /*ItemNavigateArgs*/ itemNavigateArgs, /*bool*/ alwaysAtTopOfViewport/*=false*/)
//        {
//        	if(alwaysAtTopOfViewport === undefined){
//        		alwaysAtTopOfViewport = false;
//        	}
//        	
//            if (info != null) 
//            {
//                this.NavigateToItem(info.Item, info.Index, itemNavigateArgs, alwaysAtTopOfViewport); 
//            } 
//        },
// 
////        internal void 
//        NavigateToItem:function(/*object*/ item, /*ItemNavigateArgs*/ itemNavigateArgs)
//        {
//        	this.NavigateToItem(item, -1, itemNavigateArgs, false /* alwaysAtTopOfViewport */);
//        }, 
//
////        internal void 
//        NavigateToItem:function(/*object*/ item, /*int*/ itemIndex, /*ItemNavigateArgs*/ itemNavigateArgs) 
//        { 
//        	this.NavigateToItem(item, itemIndex, itemNavigateArgs, false /* alwaysAtTopOfViewport */);
//        }, 
//
////        internal void 
//        NavigateToItem:function(/*object*/ item, /*ItemNavigateArgs*/ itemNavigateArgs, /*bool*/ alwaysAtTopOfViewport)
//        {
//        	this.NavigateToItem(item, -1, itemNavigateArgs, alwaysAtTopOfViewport); 
//        },
////        private void 
//        NavigateToItem:function(/*object*/ item, /*int*/ elementIndex, /*ItemNavigateArgs*/ itemNavigateArgs, /*bool*/ alwaysAtTopOfViewport) 
//        {
//            // 
//
//            // Perhaps the container isn't generated yet.  In this case we try to shift the view,
//            // wait for measure, and then call it again.
//            if (item == DependencyProperty.UnsetValue) 
//            {
//                return; 
//            } 
//
//            if (elementIndex == -1) 
//            {
//                elementIndex = this.Items.IndexOf(item);
//                if (elementIndex == -1)
//                    return; 
//            }
// 
//            var isHorizontal = false; 
//            if (ItemsHost != null)
//            { 
//                isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal);
//            }
//
//            /*FrameworkElement*/ var container; 
//            var containerOut={
//            	"container" : container
//            };
//            /*FocusNavigationDirection*/var direction = isHorizontal ? FocusNavigationDirection.Right : FocusNavigationDirection.Down;
//            this.MakeVisible(elementIndex, direction, alwaysAtTopOfViewport, /*out container*/containerOut); 
//            container = containerOut.container;
//            this.FocusItem(this.NewItemInfo(item, container), itemNavigateArgs);
//        }, 
        
//        private void 
        NavigateToItem:function(/*object*/ item, /*int*/ elementIndex, /*ItemNavigateArgs*/ itemNavigateArgs, /*bool*/ alwaysAtTopOfViewport) 
        {
            if(arguments.length == 4){
            	// Perhaps the container isn't generated yet.  In this case we try to shift the view,
                // wait for measure, and then call it again.
                if (item == DependencyProperty.UnsetValue) 
                {
                    return; 
                } 

                if (elementIndex == -1) 
                {
                    elementIndex = this.Items.IndexOf(item);
                    if (elementIndex == -1)
                        return; 
                }
     
                var isHorizontal = false; 
                if (this.ItemsHost != null)
                { 
                    isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal);
                }

                /*FrameworkElement*/ var container; 
                var containerOut={
                	"container" : container
                };
                /*FocusNavigationDirection*/var direction = isHorizontal ? FocusNavigationDirection.Right : FocusNavigationDirection.Down;
                this.MakeVisible(elementIndex, direction, alwaysAtTopOfViewport, /*out container*/containerOut); 
                container = containerOut.container;
                this.FocusItem(this.NewItemInfo(item, container), itemNavigateArgs);
            }else if(arguments.length == 3){
            	if(item instanceof ItemInfo){
            		alwaysAtTopOfViewport = itemNavigateArgs;
            		itemNavigateArgs = elementIndex;
            		if(alwaysAtTopOfViewport === undefined){
                		alwaysAtTopOfViewport = false;
                	}
                	
                    if (info != null) 
                    {
                        this.NavigateToItem(item.Item, item.Index, itemNavigateArgs, alwaysAtTopOfViewport); 
                    }
            	}else if(typeof(elementIndex) == "number"){
            		
            		this.NavigateToItem(item, elementIndex, itemNavigateArgs, false /* alwaysAtTopOfViewport */);
            	}else{
            		alwaysAtTopOfViewport = itemNavigateArgs;
            		itemNavigateArgs = elementIndex;
            		this.NavigateToItem(item, -1, itemNavigateArgs, alwaysAtTopOfViewport);
            	}
            }else if(arguments.length == 2) {
                itemNavigateArgs = elementIndex;
               	this.NavigateToItem(item, -1, itemNavigateArgs, false /* alwaysAtTopOfViewport */);
            }
        }, 

//        private object 
        FindFocusable:function(/*int*/ startIndex, /*int*/ direction, 
        		/*out int foundIndex*/foundIndexOut, /*out FrameworkElement foundContainer*/foundContainerOut)
        {
            // HasItems may be wrong when underlying collection does not notify, but this function 
            // only cares about what's been generated and is consistent with ItemsControl state.
            if (this.HasItems) 
            { 
                var count = this.Items.Count;
                for (; startIndex >= 0 && startIndex < count; startIndex += direction) 
                {
                    /*FrameworkElement*/var container = this.ItemContainerGenerator.ContainerFromIndex(startIndex);
                    container= container instanceof FrameworkElement ? container : null;

                    // If the UI is non-null it must meet some minimum requirements to consider it for 
                    // navigation (focusable, enabled).  If it has no UI we can make no judgements about it
                    // at this time, so it is navigable. 
                    if (container == null || Keyboard.IsFocusable(container)) 
                    {
                    	foundIndexOut.foundIndex = startIndex; 
                        foundContainerOut.foundContainer = container;
                        return this.Items.Get(startIndex);
                    }
                } 
            }
 
            foundIndexOut.foundIndex = -1; 
            foundIndexOut.foundContainer = null;
            return null; 
        },
        
//        private void 
        AdjustOffsetToAlignWithEdge:function(/*FrameworkElement*/ element, /*FocusNavigationDirection*/ direction)
        { 
//            Debug.Assert(ScrollHost != null, "This operation to adjust the offset along an edge is only possible when there is a ScrollHost available");
 
            if (VirtualizingPanel.GetScrollUnit(this) != ScrollUnit.Item) 
            {
                /*ScrollViewer*/var scrollHost = this.ScrollHost; 
                /*FrameworkElement*/var viewportElement = this.GetViewportElement();
                element = ItemsControl.TryGetTreeViewItemHeader(element);
                element=element instanceof FrameworkElement ? element : null;
                /*Rect*/var elementBounds = new Rect(new Point(), element.RenderSize);
                elementBounds = element.TransformToAncestor(viewportElement).TransformBounds(elementBounds); 
                var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal);
 
                if (direction == FocusNavigationDirection.Down) 
                {
                    // Align with the bottom edge of viewport 
                    if (isHorizontal)
                    {
                        scrollHost.ScrollToHorizontalOffset(scrollHost.HorizontalOffset - scrollHost.ViewportWidth + elementBounds.Right);
                    } 
                    else
                    { 
                        scrollHost.ScrollToVerticalOffset(scrollHost.VerticalOffset - scrollHost.ViewportHeight + elementBounds.Bottom); 
                    }
                } 
                else if (direction == FocusNavigationDirection.Up)
                {
                    // Align with the top edge of viewport
                    if (isHorizontal) 
                    {
                        scrollHost.ScrollToHorizontalOffset(scrollHost.HorizontalOffset + elementBounds.Left); 
                    } 
                    else
                    { 
                        scrollHost.ScrollToVerticalOffset(scrollHost.VerticalOffset + elementBounds.Top);
                    }
                }
            } 
        },
        
//        // 
//        // Shifts the viewport to make the given index visible.
//        // 
////        private void 
//        MakeVisible:function(/*int*/ index, /*FocusNavigationDirection*/ direction,
//        		/*bool*/ alwaysAtTopOfViewport, /*out FrameworkElement container*/containerOut)
//        {
//        	containerOut.container = null;
// 
//            if (index >= 0)
//            { 
//            	containerOut.container = this.ItemContainerGenerator.ContainerFromIndex(index);
//            	containerOut.container = containerOut.container instanceof FrameworkElement ? containerOut.container : null; 
//                if (containerOut.container == null)
//                { 
//                    // In case of VirtualizingPanel, the container might not have been
//                    // generated yet. Hence try generating it.
//                    /*VirtualizingPanel*/var virtualizingPanel = this.ItemsHost instanceof VirtualizingPanel ? this.ItemsHost : null;
//                    if (virtualizingPanel != null) 
//                    {
//                        virtualizingPanel.BringIndexIntoView(index); 
//                        this.UpdateLayout(); 
//                        containerOut.container = this.ItemContainerGenerator.ContainerFromIndex(index);
//                        containerOut.container = containerOut.container instanceof FrameworkElement ? containerOut.container : null;
//                    } 
//                }
//                this.MakeVisible(container, direction, alwaysAtTopOfViewport);
//            }
//        }, 
//
//        // 
//        // Shifts the viewport to make the given item visible. 
//        //
////        private void 
//        MakeVisible:function(/*ItemInfo*/ info, /*FocusNavigationDirection*/ direction, /*out FrameworkElement container*/containerOut) 
//        {
//            if (info != null)
//            {
//                this.MakeVisible(info.Index, direction, false /*alwaysAtTopOfViewport*/, /*out container*/containerOut); 
//                info.Container = containerOut.container;
//            } 
//            else 
//            {
//                this.MakeVisible(-1, direction, false /*alwaysAtTopOfViewport*/, /*out container*/containerOut); 
//            }
//        },
//        // 
//        // Shifts the viewport to make the given index visible.
//        // 
////        internal void 
//        MakeVisible:function(/*FrameworkElement*/ container, /*FocusNavigationDirection*/ direction, /*bool*/ alwaysAtTopOfViewport) 
//        {
//            if (this.ScrollHost != null && this.ItemsHost != null) 
//            {
//                var oldHorizontalOffset;
//                var oldVerticalOffset;
// 
//                /*FrameworkElement*/var viewportElement = this.GetViewportElement();
// 
//                while (container != null && !this.IsOnCurrentPage(viewportElement, container, direction, false /*fullyVisible*/)) 
//                {
//                    oldHorizontalOffset = this.ScrollHost.HorizontalOffset; 
//                    oldVerticalOffset = this.ScrollHost.VerticalOffset;
//
//                    container.BringIntoView();
// 
//                    // Wait for layout
//                    this.ItemsHost.UpdateLayout(); 
// 
//                    // If offset does not change - exit the loop
//                    if (DoubleUtil.AreClose(oldHorizontalOffset, this.ScrollHost.HorizontalOffset) && 
//                        DoubleUtil.AreClose(oldVerticalOffset, this.ScrollHost.VerticalOffset))
//                        break;
//                }
// 
//                if (container != null && alwaysAtTopOfViewport)
//                { 
//                    var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal); 
//
//                    /*FrameworkElement*/var firstElement; 
//                    this.GetFirstItemOnCurrentPage(container, FocusNavigationDirection.Up, /*out firstElement*/firstElementOut);
//                    firstElement = firstElementOut.firstElement;
//                    while (firstElement != container)
//                    {
//                        oldHorizontalOffset = this.ScrollHost.HorizontalOffset; 
//                        oldVerticalOffset = this.ScrollHost.VerticalOffset;
// 
//                        if (isHorizontal) 
//                        {
//                            this.ScrollHost.LineRight(); 
//                        }
//                        else
//                        {
//                        	this.ScrollHost.LineDown(); 
//                        }
// 
//                        this.ScrollHost.UpdateLayout(); 
//
//                        // If offset does not change - exit the loop 
//                        if (DoubleUtil.AreClose(oldHorizontalOffset, ScrollHost.HorizontalOffset) &&
//                            DoubleUtil.AreClose(oldVerticalOffset, ScrollHost.VerticalOffset))
//                            break;
// 
//                        this.GetFirstItemOnCurrentPage(container, FocusNavigationDirection.Up, /*out firstElement*/firstElementOut);
//                    } 
//                } 
//            }
//        }, 

        // 
        // Shifts the viewport to make the given index visible.
        // 
//        private void 
        MakeVisible:function(/*int*/ index, /*FocusNavigationDirection*/ direction,
        		/*bool*/ alwaysAtTopOfViewport, /*out FrameworkElement container*/containerOut)
        {
        	if(arguments.length == 4){
        		containerOut.container = null;
        		 
                if (index >= 0)
                { 
                	containerOut.container = this.ItemContainerGenerator.ContainerFromIndex(index);
                	containerOut.container = containerOut.container instanceof FrameworkElement ? containerOut.container : null; 
                    if (containerOut.container == null)
                    { 
                        // In case of VirtualizingPanel, the container might not have been
                        // generated yet. Hence try generating it.
                        /*VirtualizingPanel*/var virtualizingPanel = this.ItemsHost instanceof VirtualizingPanel ? this.ItemsHost : null;
                        if (virtualizingPanel != null) 
                        {
                            virtualizingPanel.BringIndexIntoView(index); 
                            this.UpdateLayout(); 
                            containerOut.container = this.ItemContainerGenerator.ContainerFromIndex(index);
                            containerOut.container = containerOut.container instanceof FrameworkElement ? containerOut.container : null;
                        } 
                    }
                    this.MakeVisible(containerOut.container, direction, alwaysAtTopOfViewport);
                }
        	}else if(arguments.length == 3){
        		if(index instanceof ItemInfo){
               		info = index;
        			containerOut = alwaysAtTopOfViewport;
                    if (info != null)
                    {
                        this.MakeVisible(info.Index, direction, false /*alwaysAtTopOfViewport*/, /*out container*/containerOut); 
                        info.Container = containerOut.container;
                    } 
                    else 
                    {
                        this.MakeVisible(-1, direction, false /*alwaysAtTopOfViewport*/, /*out container*/containerOut); 
                    }
        		}else{
        			container = index;
        			if (this.ScrollHost != null && this.ItemsHost != null) 
                    {
                        var oldHorizontalOffset;
                        var oldVerticalOffset;
         
                        /*FrameworkElement*/var viewportElement = this.GetViewportElement();
         
                        while (container != null && !this.IsOnCurrentPage(viewportElement, container, direction, false /*fullyVisible*/)) 
                        {
                            oldHorizontalOffset = this.ScrollHost.HorizontalOffset; 
                            oldVerticalOffset = this.ScrollHost.VerticalOffset;

                            container.BringIntoView();
         
                            // Wait for layout
                            this.ItemsHost.UpdateLayout(); 
         
                            // If offset does not change - exit the loop
                            if (DoubleUtil.AreClose(oldHorizontalOffset, this.ScrollHost.HorizontalOffset) && 
                                DoubleUtil.AreClose(oldVerticalOffset, this.ScrollHost.VerticalOffset))
                                break;
                        }
         
                        if (container != null && alwaysAtTopOfViewport)
                        { 
                            var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal); 

                            var firstElementOut = {"firstElement": null};
                            this.GetFirstItemOnCurrentPage(container, FocusNavigationDirection.Up, /*out firstElement*/firstElementOut);
                            /*FrameworkElement*/var firstElement = firstElementOut.firstElement;
                            while (firstElement != container)
                            {
                                oldHorizontalOffset = this.ScrollHost.HorizontalOffset; 
                                oldVerticalOffset = this.ScrollHost.VerticalOffset;
         
                                if (isHorizontal) 
                                {
                                    this.ScrollHost.LineRight(); 
                                }
                                else
                                {
                                	this.ScrollHost.LineDown(); 
                                }
         
                                this.ScrollHost.UpdateLayout(); 

                                // If offset does not change - exit the loop 
                                if (DoubleUtil.AreClose(oldHorizontalOffset, ScrollHost.HorizontalOffset) &&
                                    DoubleUtil.AreClose(oldVerticalOffset, ScrollHost.VerticalOffset))
                                    break;
         
                                this.GetFirstItemOnCurrentPage(container, FocusNavigationDirection.Up, /*out firstElement*/firstElementOut);
                            } 
                        } 
                    }
        		}
        	}
        }, 
        
//        private bool 
        NavigateToFirstItemOnCurrentPage:function(/*object*/ startingItem, /*FocusNavigationDirection*/ direction, 
        		/*ItemNavigateArgs*/ itemNavigateArgs, /*bool*/ shouldFocus, /*out FrameworkElement container*/containerOut)
        {
        	var ele = ItemContainerGenerator.ContainerFromItem(startingItem);
        	ele = ele instanceof FrameworkElement ? ele : null;
            var firstItem = this.GetFirstItemOnCurrentPage(ele, 
                direction,
                /*out container*/containerOut); 
 
            if (firstItem != DependencyProperty.UnsetValue)
            { 
                if (shouldFocus)
                {
                    return this.FocusItem(this.NewItemInfo(firstItem, containerOut.container), itemNavigateArgs);
                } 
            }
            return false; 
        }, 
//        private object 
        GetFirstItemOnCurrentPage:function(/*FrameworkElement*/ startingElement, 
            /*FocusNavigationDirection*/ direction,
            /*out FrameworkElement firstElement*/firstElementOut)
        {
//            Debug.Assert(direction == FocusNavigationDirection.Up || direction == FocusNavigationDirection.Down, "Can only get the first item on a page using North or South"); 

            var isHorizontal = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Horizontal); 
            var isVertical = (this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Vertical); 

            if (this.ScrollHost != null && 
            		this.ScrollHost.CanContentScroll &&
            		this.VirtualizingPanel.GetScrollUnit(this) == ScrollUnit.Item &&
                !(this instanceof TreeView) &&
                !this.IsGrouping) 
            {
                var foundIndex = -1; 
                var foundIndexOut = {
                	"foundIndex" : foundIndex	
                };
                
                if (isVertical) 
                {
                    if (direction == FocusNavigationDirection.Up) 
                    {
                        return this.FindFocusable(this.ScrollHost.VerticalOffset, 1, 
                        		/*out foundIndex*/foundIndexOut, /*out firstElement*/firstElementOut);
                    }
                    else 
                    {
                        return FindFocusable((this.ScrollHost.VerticalOffset + Math.max(this.ScrollHost.ViewportHeight - 1, 0)), 
                            -1, 
                            /*out foundIndex*/foundIndexOut,
                            /*out firstElement*/firstElementOut); 
                    }
                }
                else if (isHorizontal)
                { 
                    if (direction == FocusNavigationDirection.Up)
                    { 
                        return FindFocusable(this.ScrollHost.HorizontalOffset, 1, /*out foundIndex*/foundIndexOut, /*out firstElement*/firstElementOut); 
                    }
                    else 
                    {
                        return FindFocusable((this.ScrollHost.HorizontalOffset + Math.max(ScrollHost.ViewportWidth - 1, 0)),
                            -1,
                            /*out foundIndex*/foundIndexOut, 
                            /*out firstElement*/firstElementOut);
                    } 
                } 
            }
 
            //
            // We assume we're physically scrolling in both directions now.
            //
            if (startingElement != null) 
            {
                /*FrameworkElement*/var currentElement = startingElement; 
                if (isHorizontal) 
                {
                    // In horizontal orientation left/right directions must used to 
                    // predict the focus.
                    if (direction == FocusNavigationDirection.Up)
                    {
                        direction = FocusNavigationDirection.Left; 
                    }
                    else if (direction == FocusNavigationDirection.Down) 
                    { 
                        direction = FocusNavigationDirection.Right;
                    } 
                }

                /*FrameworkElement*/var viewportElement = this.GetViewportElement();
//                var treeViewNavigation = (this instanceof TreeView); 
                var treeViewNavigation = false;
                EnsureTreeView();
                if(TreeView != null){
                	treeViewNavigation = (this instanceof TreeView); 
                }
                
                
                currentElement = KeyboardNavigation.Current.PredictFocusedElementAtViewportEdge(startingElement,
                    direction, 
                    treeViewNavigation, 
                    viewportElement,
                    viewportElement);
                currentElement = currentElement instanceof FrameworkElement ? currentElement : null; 

                var returnItem = null;
                firstElementOut.firstElement = null;
 
                if (currentElement != null)
                { 
                    returnItem = GetEncapsulatingItem(currentElement, /*out firstElement*/firstElementOut); 
                }
 
                if (currentElement == null || returnItem == DependencyProperty.UnsetValue)
                {
                    // Try the startingElement as a candidate.
                    /*ElementViewportPosition*/var elementPosition = GetElementViewportPosition(viewportElement, 
                        startingElement,
                        direction, 
                        false /*fullyVisible*/); 
                    if (elementPosition == ElementViewportPosition.CompletelyInViewport ||
                        elementPosition == ElementViewportPosition.PartiallyInViewport) 
                    {
                        currentElement = startingElement;
                        returnItem = GetEncapsulatingItem(currentElement, /*out firstElement*/firstElementOut);
                    } 
                }
 
                if (returnItem != null && returnItem instanceof CollectionViewGroupInternal) 
                {
                	firstElementOut.firstElement = currentElement; 
                }
                return returnItem;
            }
 
            firstElement = null;
            return null; 
        },

//        internal FrameworkElement 
        GetViewportElement:function() 
        {
            // NOTE: When ScrollHost is non-null, we use ScrollHost instead of
            //       ItemsHost because ItemsHost in the physically scrolling
            //       case will just have its layout offset shifted, and all 
            //       items will always be within the bounding box of the ItemsHost,
            //       and we want to know if you can actually see the element. 
            /*FrameworkElement*/var viewPort = this.ScrollHost; 
            if (viewPort == null)
            { 
                viewPort = this.ItemsHost;
            }
            else
            { 
                // Try use the ScrollContentPresenter as the viewport it is it available
                // because that is more representative of the viewport in case of 
                // DataGrid when the ColumnHeaders need to be excluded from the 
                // dimensions of the viewport.
                /*ScrollContentPresenter*/
            	var scp = viewPort.GetTemplateChild(ScrollViewer.ScrollContentPresenterTemplateName);
            	scp = scp instanceof ScrollContentPresenter ? scp : null; 
                if (scp != null)
                {
                    viewPort = scp;
                } 
            }
 
            return viewPort; 
        },
        
//        /// <summary>
//        /// Determines if the given item is on the current visible page.
//        /// </summary>
////        private bool 
//        IsOnCurrentPage:function(/*object*/ item, /*FocusNavigationDirection*/ axis) 
//        {
//            /*FrameworkElement*/var container = this.ItemContainerGenerator.ContainerFromItem(item);
//            container = container instanceof FrameworkElement ? container : null; 
// 
//            if (container == null)
//            { 
//                return false;
//            }
//
//            return (this.GetElementViewportPosition(this.GetViewportElement(), container, axis, false) == ElementViewportPosition.CompletelyInViewport); 
//        },
//
////        private bool 
//        IsOnCurrentPage:function(/*FrameworkElement*/ element, /*FocusNavigationDirection*/ axis) 
//        {
//            return (this.GetElementViewportPosition(this.GetViewportElement(), element, axis, false) == ElementViewportPosition.CompletelyInViewport); 
//        },
//        /// <summary>
//        /// Determines if the given element is on the current visible page. 
//        /// The element must be completely on the page on the given axis, but need
//        /// not be completely contained on the page in the perpendicular axis. 
//        /// For example, if axis == North, then the element's Top and Bottom must 
//        /// be completely contained on the page.
//        /// </summary> 
////        private bool 
//        IsOnCurrentPage:function(/*FrameworkElement*/ viewPort, /*FrameworkElement*/ element, /*FocusNavigationDirection*/ axis, /*bool*/ fullyVisible)
//        {
//            return (this.GetElementViewportPosition(viewPort, element, axis, fullyVisible) == ElementViewportPosition.CompletelyInViewport);
//        }, 
        /// <summary>
        /// Determines if the given element is on the current visible page. 
        /// The element must be completely on the page on the given axis, but need
        /// not be completely contained on the page in the perpendicular axis. 
        /// For example, if axis == North, then the element's Top and Bottom must 
        /// be completely contained on the page.
        /// </summary> 
//        private bool 
        IsOnCurrentPage:function(/*FrameworkElement*/ viewPort, /*FrameworkElement*/ element, /*FocusNavigationDirection*/ axis, /*bool*/ fullyVisible)
        {
        	if(arguments.length == 4){
                return (this.GetElementViewportPosition(viewPort, element, axis, fullyVisible) == ElementViewportPosition.CompletelyInViewport);
        	}else if(arguments.length == 2){
        		if(viewPort instanceof FrameworkElement){
            		axis = element;
            		element = viewPort;
            		return (this.GetElementViewportPosition(this.GetViewportElement(), element, axis, false) == ElementViewportPosition.CompletelyInViewport);
        		}else {
        			item = viewPort;
        			axis = element;
                    /*FrameworkElement*/var container = this.ItemContainerGenerator.ContainerFromItem(item);
                    container = container instanceof FrameworkElement ? container : null; 
         
                    if (container == null)
                    { 
                        return false;
                    }

                    return (this.GetElementViewportPosition(this.GetViewportElement(), container, axis, false) == ElementViewportPosition.CompletelyInViewport); 
        		}
        	}
        },

//        private bool 
        IsInDirectionForLineNavigation:function(/*Rect*/ fromRect, /*Rect*/ toRect, /*FocusNavigationDirection*/ direction, /*bool*/ isHorizontal) 
        {
//            Debug.Assert(direction == FocusNavigationDirection.Up || 
//                direction == FocusNavigationDirection.Down);

            if (direction == FocusNavigationDirection.Down)
            { 
                if (isHorizontal)
                { 
                    // Right 
                    return DoubleUtil.GreaterThanOrClose(toRect.Left, fromRect.Left);
                } 
                else
                {
                    // Down
                    return DoubleUtil.GreaterThanOrClose(toRect.Top, fromRect.Top); 
                }
            } 
            else if (direction == FocusNavigationDirection.Up) 
            {
                if (isHorizontal) 
                {
                    // Left
                    return DoubleUtil.LessThanOrClose(toRect.Right, fromRect.Right);
                } 
                else
                { 
                    // UP 
                    return DoubleUtil.LessThanOrClose(toRect.Bottom, fromRect.Bottom);
                } 
            }
            return false;
        },
 
        //
//        internal virtual bool 
        FocusItem:function(/*ItemInfo*/ info, /*ItemNavigateArgs*/ itemNavigateArgs) 
        {
            /*object*/var item = info.Item;
            var returnValue = false;
 
            if (item != null)
            { 
                /*UIElement*/var container =  info.Container instanceof UIElement ? info.Container : null; 
                if (container != null)
                { 
                    returnValue = container.Focus();
                }
            }
            if (itemNavigateArgs.DeviceUsed instanceof KeyboardDevice) 
            {
                KeyboardNavigation.ShowFocusVisual(); 
            } 
            return returnValue;
        }, 

////        internal void 
//        DoAutoScroll:function() 
//        {
//            this.DoAutoScroll(this.FocusedInfo); 
//        },

//        internal void 
        DoAutoScroll:function(/*ItemInfo*/ startingInfo)
        { 
        	if(startingInfo === undefined){
        		startingInfo = this.FocusedInfo;
        	}
        	
            // Attempt to compute positions based on the ScrollHost.
            // If that doesn't exist, use the ItemsHost. 
            /*FrameworkElement*/var relativeTo = this.ScrollHost != null ? this.ScrollHost : this.ItemsHost; 
            if (relativeTo != null)
            { 
                // Figure out where the mouse is w.r.t. the ItemsControl.

                /*Point*/var mousePosition = Mouse.GetPosition(relativeTo);
 
                // Take the bounding box of the ListBox and scroll against that
                /*Rect*/var bounds = new Rect(new Point(), relativeTo.RenderSize); 
                var focusChanged = false; 

                if (mousePosition.Y < bounds.Top) 
                {
                	this.NavigateByLine(startingInfo, FocusNavigationDirection.Up, new ItemNavigateArgs(Mouse.PrimaryDevice, Keyboard.Modifiers));
                    focusChanged = startingInfo != FocusedInfo;
                } 
                else if (mousePosition.Y >= bounds.Bottom)
                { 
                	this.NavigateByLine(startingInfo, FocusNavigationDirection.Down, new ItemNavigateArgs(Mouse.PrimaryDevice, Keyboard.Modifiers)); 
                    focusChanged = startingInfo != this.FocusedInfo;
                } 

                // Try horizontal scroll if vertical scroll did not happen
                if (!focusChanged)
                { 
                    if (mousePosition.X < bounds.Left)
                    { 
                        /*FocusNavigationDirection*/var direction = FocusNavigationDirection.Left; 
                        if (this.IsRTL(relativeTo))
                        { 
                            direction = FocusNavigationDirection.Right;
                        }

                        this.NavigateByLine(startingInfo, direction, new ItemNavigateArgs(Mouse.PrimaryDevice, Keyboard.Modifiers)); 
                    }
                    else if (mousePosition.X >= bounds.Right) 
                    { 
                        /*FocusNavigationDirection*/var direction = FocusNavigationDirection.Right;
                        if (this.IsRTL(relativeTo)) 
                        {
                            direction = FocusNavigationDirection.Left;
                        }
 
                        this.NavigateByLine(startingInfo, direction, new ItemNavigateArgs(Mouse.PrimaryDevice, Keyboard.Modifiers));
                    } 
                } 
            }
        }, 

//        private bool 
        IsRTL:function(/*FrameworkElement*/ element)
        {
            /*FlowDirection*/var flowDirection = element.FlowDirection; 
            return (flowDirection == FlowDirection.RightToLeft);
        }, 

//        private void 
        ApplyItemContainerStyle:function(/*DependencyObject*/ container, /*object*/ item)
        { 
            /*FrameworkObject*/var foContainer = new FrameworkObject(container);
 
            // don't overwrite a locally-defined style (bug 1018408) 
            if (!foContainer.IsStyleSetFromGenerator &&
                container.ReadLocalValue(FrameworkElement.StyleProperty) != DependencyProperty.UnsetValue) 
            {
                return;
            }
 
            // Control's ItemContainerStyle has first stab
            /*Style*/var style = this.ItemContainerStyle; 
 
            // no ItemContainerStyle set, try ItemContainerStyleSelector
            if (style == null) 
            {
                if (this.ItemContainerStyleSelector != null)
                {
                    style = this.ItemContainerStyleSelector.SelectStyle(item, container); 
                }
            } 
 
            // apply the style, if found
            if (style != null) 
            {
                // verify style is appropriate before applying it
                if (!style.TargetType.IsInstanceOfType(container))
                    throw new InvalidOperationException(SR.Get(SRID.StyleForWrongType, style.TargetType.Name, container.GetType().Name)); 

                foContainer.Style = style; 
                foContainer.IsStyleSetFromGenerator = true; 
            }
            else if (foContainer.IsStyleSetFromGenerator) 
            {
                // if Style was formerly set from ItemContainerStyle, clear it
                foContainer.IsStyleSetFromGenerator = false;
                container.ClearValue(FrameworkElement.StyleProperty); 
            }
        }, 
//        private void 
        RemoveItemContainerStyle:function(/*DependencyObject*/ container)
        { 
            /*FrameworkObject*/var foContainer = new FrameworkObject(container);

            if (foContainer.IsStyleSetFromGenerator)
            { 
                container.ClearValue(FrameworkElement.StyleProperty);
            } 
        }, 
 
//        internal object 
        GetItemOrContainerFromContainer:function(/*DependencyObject*/ container)
        {
            /*object*/var item = this.ItemContainerGenerator.ItemFromContainer(container);
 
            if (item == DependencyProperty.UnsetValue
                && ItemsControl.ItemsControlFromItemContainer(container) == this 
                && (/*(IGeneratorHost)*/this).IsItemItsOwnContainer(container)) 
            {
                item = container; 
            }

            return item;
        }, 
 
        // create an ItemInfo with as much information as can be deduced
//        internal ItemInfo 
        NewItemInfo:function(/*object*/ item, /*DependencyObject*/ container/*=null*/, /*int*/ index/*=-1*/)
        {
        	if(container === undefined){
        		container = null;
        	}
        	
        	if(index === undefined){
        		index = -1;
        	}
        	
            return new ItemInfo(item, container, index).Refresh(this.ItemContainerGenerator); 
        },
 
        // create an ItemInfo for the given container 
//        internal ItemInfo 
        ItemInfoFromContainer:function(/*DependencyObject*/ container)
        { 
            return this.NewItemInfo(this.ItemContainerGenerator.ItemFromContainer(container), 
            		container, this.ItemContainerGenerator.IndexFromContainer(container));
        },

        // create an ItemInfo for the given index 
//        internal ItemInfo 
        ItemInfoFromIndex:function(/*int*/ index)
        { 
            return (index >= 0) ? this.NewItemInfo(this.Items.Get(index), this.ItemContainerGenerator.ContainerFromIndex(index), index) 
                                : null;
        }, 

        // create an unresolved ItemInfo
//        internal ItemInfo 
        NewUnresolvedItemInfo:function(/*object*/ item)
        { 
            return new ItemInfo(item, ItemInfo.UnresolvedContainer, -1);
        }, 
 
        // return the container corresponding to an ItemInfo
//        internal DependencyObject 
        ContainerFromItemInfo:function(/*ItemInfo*/ info) 
        {
            /*DependencyObject*/var container = info.Container;
            if (container == null)
            { 
                if (info.Index >= 0)
                { 
                    container = this.ItemContainerGenerator.ContainerFromIndex(info.Index); 
                    info.Container = container;
                } 
                else
                {
                    container = this.ItemContainerGenerator.ContainerFromItem(info.Item);
                    // don't change info.Container - info is potentially shared by different ItemsControls 
                }
            } 
 
            return container;
        }, 

        // adjust ItemInfos after a generator status change
//        internal void 
        AdjustItemInfoAfterGeneratorChange:function(/*ItemInfo*/ info)
        { 
            if (info != null)
            { 
//                /*ItemInfo[]*/var a = [info]; //new ItemInfo[]{info}; 
                var a = new List();
                a.Add(info);
                this.AdjustItemInfosAfterGeneratorChange(a, /*claimUniqueContainer:*/false);
            } 
        },

        // adjust ItemInfos after a generator status change
//        internal void 
        AdjustItemInfosAfterGeneratorChange:function(/*IEnumerable<ItemInfo>*/ list, /*bool*/ claimUniqueContainer) 
        {
        	if(claimUniqueContainer === undefined){
        		claimUniqueContainer = false;
        	}

            // detect discarded containers and mark the ItemInfo accordingly 
            // (also see if there are infos awaiting containers) 
            var resolvePendingContainers = false;
            for(var i=0; i<list.Count; i++) //for/*each*/ (/*ItemInfo*/var info in list) 
            {
            	var info = list.Get(i);
                /*DependencyObject*/var container = info.Container;
                if (container == null)
                { 
                    resolvePendingContainers = true;
                } 
                else if (!Object.Equals(info.Item, 
                            container.ReadLocalValue(ItemContainerGenerator.ItemForItemContainerProperty)))
                { 
                    info.Container = null;
                    resolvePendingContainers = true;
                }
            } 

            // if any of the ItemInfos correspond to containers 
            // that are now realized, record the container in the ItemInfo 
            if (resolvePendingContainers)
            { 
                // first find containers that are already claimed by the list
                /*List<DependencyObject>*/var claimedContainers = new List/*<DependencyObject>*/();
                if (claimUniqueContainer)
                { 
                    for(var i=0; i<list.Count; i++) //for/*each*/ (/*ItemInfo*/var info in list)
                    { 
                    	var info = list.Get(i);
                        /*DependencyObject*/var container = info.Container; 
                        if (container != null)
                        { 
                            claimedContainers.Add(container);
                        }
                    }
                } 

                // now try to match the pending items with an unclaimed container 
                for(var i=0; i<list.Count; i++)//foreach(ItemInfo info in list) 
                {
                	var info = list.Get(i);
                    /*DependencyObject*/var container = info.Container; 
                    if (container == null)
                    {
                        var index = info.Index;
                        if (index >= 0) 
                        {
                            // if we know the index, see if the container exists 
                            container = this.ItemContainerGenerator.ContainerFromIndex(index); 
                        }
                        else 
                        {
                            // otherwise see if an unclaimed container matches the item
                            var item = info.Item;
                            var containerOut = {
                            	"container" : container
                            };
                            
                            var indexOut = {
                            	"itemIndex" : index
                            };
                           	
                            this.ItemContainerGenerator.FindItem( 
                                function(/*object*/ o, /*DependencyObject*/ d)
                                    { return Object.Equals(o, item) && 
                                        !claimedContainers.Contains(d); }, 
                                /*out container*/containerOut, /*out index*/indexOut);
                            container = containerOut.container;
                            index = indexOut.itemIndex;
                        } 

                        if (container != null)
                        {
                            // update ItemInfo and claim the container 
                            info.Container = container;
                            info.Index = index; 
                            if (claimUniqueContainer) 
                            {
                                claimedContainers.Add(container); 
                            }
                        }
                    }
                } 
            }
        }, 
 
        // correct the indices in the given ItemInfo, in response to a collection change event
//        internal void 
        AdjustItemInfo:function(/*NotifyCollectionChangedEventArgs*/ e, /*ItemInfo*/ info) 
        {
            if (info != null)
            {
//                /*ItemInfo[]*/var a = [info]; //new ItemInfo[]{info}; 
                var a = new List();
                a.Add(info);
                this.AdjustItemInfos(e, a);
            } 
        }, 

        // correct the indices in the given ItemInfos, in response to a collection change event 
//        internal void 
        AdjustItemInfos:function(/*NotifyCollectionChangedEventArgs*/ e, /*IEnumerable<ItemInfo>*/ list)
        {
            switch (e.Action)
            { 
                case NotifyCollectionChangedAction.Add:
                    // items at NewStartingIndex and above have moved up 1 
                    for(var i=0; i<list.Count; i++) //foreach(ItemInfo info in list) 
                    {
                    	var info = list.Get(i);
                        var index = info.Index; 
                        if (index >= e.NewStartingIndex)
                        {
                            info.Index = index + 1;
                        } 
                    }
                break; 
 
                case NotifyCollectionChangedAction.Remove:
                    // items at OldStartingIndex and above have moved down 1 
                	for(var i=0; i<list.Count; i++) //foreach(ItemInfo info in list) 
                    {
                		var info = list.Get(i);
                        var index = info.Index;
                        if (index > e.OldStartingIndex) 
                        {
                            info.Index = index - 1; 
                        } 
                        else if (index == e.OldStartingIndex)
                        { 
                            info.Index = -1;
                        }
                    }
                break; 

                case NotifyCollectionChangedAction.Move: 
                    // items between New and Old have moved.  The direction and 
                    // exact endpoints depends on whether New comes before Old.
                    var left, right, delta; 
                    if (e.OldStartingIndex < e.NewStartingIndex)
                    {
                        left = e.OldStartingIndex + 1;
                        right = e.NewStartingIndex; 
                        delta = -1;
                    } 
                    else 
                    {
                        left = e.NewStartingIndex; 
                        right = e.OldStartingIndex - 1;
                        delta = 1;
                    }
 
                    for(var i=0; i<list.Count; i++) //foreach(ItemInfo info in list) 
                    {
                		var info = list.Get(i);
                        var index = info.Index; 
                        if (index == e.OldStartingIndex)
                        { 
                            info.Index = e.NewStartingIndex;
                        }
                        else if (left <= index && index <= right)
                        { 
                            info.Index = index + delta;
                        } 
                    } 
                break;
 
                case NotifyCollectionChangedAction.Replace:
                    // nothing to do
                break;
 
                case NotifyCollectionChangedAction.Reset:
                    // the indices are no longer valid 
                	for(var i=0; i<list.Count; i++) //foreach(ItemInfo info in list) 
                    {
                		var info = list.Get(i);
                        info.Index = -1; 
                    }
                break;
            }
        }, 

        // return an ItemInfo like the input one, but owned by this ItemsControl 
//        internal ItemInfo 
        LeaseItemInfo:function(/*ItemInfo*/ info, /*bool*/ ensureIndex/*=false*/) 
        {
        	if(ensureIndex === undefined){
        		ensureIndex = false;
        	}
        	
            // if the original has index data, it's already good enough 
            if (info.Index < 0)
            {
                // otherwise create a new info from the original's item
                info = this.NewItemInfo(info.Item); 
                if (ensureIndex && info.Index < 0)
                { 
                    info.Index = this.Items.IndexOf(info.Item); 
                }
            } 

            return info;
        },
 
        // refresh an ItemInfo
//        internal void 
        RefreshItemInfo:function(/*ItemInfo*/ info) 
        { 
            if (info != null)
            { 
                info.Refresh(this.ItemContainerGenerator);
            }
        },
 
//        object IContainItemStorage.
        ReadItemValue:function(/*object*/ item, /*DependencyProperty*/ dp) 
        {
            return Helper.ReadItemValue(this, item, dp.GlobalIndex); 
        },


//        void IContainItemStorage.
        StoreItemValue:function(/*object*/ item, /*DependencyProperty*/ dp, /*object*/ value) 
        {
            Helper.StoreItemValue(this, item, dp.GlobalIndex, value); 
        }, 

//        void IContainItemStorage.
        ClearItemValue:function(/*object*/ item, /*DependencyProperty*/ dp) 
        {
            Helper.ClearItemValue(this, item, dp.GlobalIndex);
        },
 
//        void IContainItemStorage.
        ClearValue:function(/*DependencyProperty*/ dp)
        { 
            Helper.ClearItemValueStorage(this, [dp.GlobalIndex]); 
        },
 
//        void IContainItemStorage.
        Clear:function()
        {
            Helper.ClearItemValueStorage(this);
        }, 

 
        /// <summary>
        ///     Returns a string representation of this object.
        /// </summary>
        /// <returns></returns> 
//        public override string 
        ToString:function()
        { 
            // HasItems may be wrong when underlying collection does not notify, 
            // but this function should try to return what's consistent with ItemsControl state.
            var itemsCount = this.HasItems ? this.Items.Count : 0; 
            return SR.Get(SRID.ToStringFormatString_ItemsControl, this.GetType(), itemsCount);
        },
        
//      internal virtual bool 
        FocusItem:function(/*ItemInfo*/ info, /*ItemNavigateArgs*/ itemNavigateArgs) 
        {
            var item = info.Item;
            var returnValue = false;
 
            if (item != null)
            { 
                /*UIElement*/var container =  info.Container instanceof UIElement ? info.Container : null; 
                if (container != null)
                { 
                    returnValue = container.Focus();
                }
            }
            if (itemNavigateArgs.DeviceUsed instanceof KeyboardDevice) 
            {
                KeyboardNavigation.ShowFocusVisual(); 
            } 
            return returnValue;
        }


 
	});
	
	Object.defineProperties(ItemsControl.prototype,{
	       /// <summary>
        ///     Items is the collection of data that is used to generate the content 
        ///     of this control. 
        /// </summary>
//        public ItemCollection 
        Items:
        {
            get:function() 
            {
                if (this._items == null) 
                { 
                    this.CreateItemCollectionAndGenerator();
                } 

                return this._items;
            }
        },
        
        /// <summary>
        ///     ItemsSource specifies a collection used to generate the content of
        /// this control.  This provides a simple way to use exactly one collection 
        /// as the source of content for this control.
        /// </summary> 
        /// <remarks> 
        ///     Any existing contents of the Items collection is replaced when this
        /// property is set. The Items collection will be made ReadOnly and FixedSize. 
        ///     When ItemsSource is in use, setting this property to null will remove
        /// the collection and restore use to Items (which will be an empty ItemCollection).
        ///     When ItemsSource is not in use, the value of this property is null, and
        /// setting it to null has no effect. 
        /// </remarks>
//        public IEnumerable 
        ItemsSource:
        { 
            get:function() { return this.Items.ItemsSource; },
            set:function(value)
            {
                if (value == null) 
                {
                    this.ClearValue(ItemsControl.ItemsSourceProperty); 
                } 
                else
                { 
                    this.SetValue(ItemsControl.ItemsSourceProperty, value);
                }
            }
        }, 

        /// <summary> 
        /// The ItemContainerGenerator associated with this control 
        /// </summary>
//        public ItemContainerGenerator 
        ItemContainerGenerator:
        {
            get:function()
            { 
                if (this._itemContainerGenerator == null)
                { 
                    this.CreateItemCollectionAndGenerator(); 
                }
 
                return this._itemContainerGenerator;
            }
        },
 
        /// <summary>
        ///     Returns enumerator to logical children 
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function()
            {
                if (!this.HasItems)
                { 
                    return EmptyEnumerator.Instance;
                } 
 
                // Items in direct-mode of ItemCollection are the only model children.
                // note: the enumerator walks the ItemCollection.InnerList as-is, 
                // no flattening of any content on model children level!
                return this.Items.LogicalChildren;
            }
        },
        
        /// <summary>
        ///     True if Items.Count > 0, false otherwise. 
        /// </summary>
//        public bool 
        HasItems: 
        {
            get:function() { return this.GetValue(ItemsControl.HasItemsProperty); } 
        },
 
        /// <summary>
        ///     DisplayMemberPath is a simple way to define a default template 
        ///     that describes how to convert Items into UI elements by using
        ///     the specified path.
        /// </summary>
//        public string 
        DisplayMemberPath:
        { 
            get:function() { return this.GetValue(ItemsControl.DisplayMemberPathProperty); }, 
            set:function(value) { this.SetValue(ItemsControl.DisplayMemberPathProperty, value); }
        },
        
        /// <summary>
        ///     ItemTemplate is the template used to display each item. 
        /// </summary> 
//        public DataTemplate 
        ItemTemplate: 
        {
            get:function() { return this.GetValue(ItemsControl.ItemTemplateProperty); },
            set:function(value) { this.SetValue(ItemsControl.ItemTemplateProperty, value); }
        }, 

        /// <summary>
        ///     ItemTemplateSelector allows the application writer to provide custom logic
        ///     for choosing the template used to display each item. 
        /// </summary>
        /// <remarks> 
        ///     This property is ignored if <seealso cref="ItemTemplate"/> is set. 
        /// </remarks>
//        public DataTemplateSelector 
        ItemTemplateSelector:
        {
            get:function() { return this.GetValue(ItemsControl.ItemTemplateSelectorProperty); },
            set:function(value) { this.SetValue(ItemsControl.ItemTemplateSelectorProperty, value); }
        },
 
        /// <summary> 
        ///     ItemStringFormat is the format used to display an item (or a
        ///     property of an item, as declared by DisplayMemberPath) as a string. 
        ///     This arises only when no template is available. 
        /// </summary>
//        public String 
        ItemStringFormat:
        {
            get:function() { return this.GetValue(ItemsControl.ItemStringFormatProperty); },
            set:function(value) { this.SetValue(ItemsControl.ItemStringFormatProperty, value); } 
        },
 
        /// <summary>
        ///     ItemBindingGroup declares a BindingGroup to be used as a "master" 
        ///     for the generated containers.  Each container's BindingGroup is set
        ///     to a copy of the master, sharing the same set of validation rules,
        ///     but managing its own collection of bindings.
        /// </summary> 
//        public BindingGroup 
        ItemBindingGroup: 
        { 
            get:function() { return this.GetValue(ItemsControl.ItemBindingGroupProperty); },
            set:function(value) { this.SetValue(ItemsControl.ItemBindingGroupProperty, value); } 
        },

        /// <summary> 
        ///     ItemContainerStyle is the style that is applied to the container element generated
        ///     for each item. 
        /// </summary>
//        public Style 
        ItemContainerStyle:
        { 
            get:function() { return this.GetValue(ItemsControl.ItemContainerStyleProperty); },
            set:function(value) { this.SetValue(ItemsControl.ItemContainerStyleProperty, value); } 
        }, 

        /// <summary>
        ///     ItemContainerStyleSelector allows the application writer to provide custom logic 
        ///     to choose the style to apply to each generated container element. 
        /// </summary>
        /// <remarks> 
        ///     This property is ignored if <seealso cref="ItemContainerStyle"/> is set.
        /// </remarks>
//        public StyleSelector 
        ItemContainerStyleSelector:
        { 
            get:function() { return this.GetValue(ItemsControl.ItemContainerStyleSelectorProperty); }, 
            set:function(value) { this.SetValue(ItemsControl.ItemContainerStyleSelectorProperty, value); }
        }, 

        /// <summary>
        ///     ItemsPanel is the panel that controls the layout of items.
        ///     (More precisely, the panel that controls layout is created
        ///     from the template given by ItemsPanel.) 
        /// </summary>
//        public ItemsPanelTemplate 
        ItemsPanel: 
        {
            get:function() { return this.GetValue(ItemsControl.ItemsPanelProperty); }, 
            set:function(value) { this.SetValue(ItemsControl.ItemsPanelProperty, value); }
        },

        /// <summary> 
        ///     Returns whether the control is using grouping. 
        /// </summary>
//        public bool 
        IsGrouping:
        {
            get:function() 
            {
                return this.GetValue(ItemsControl.IsGroupingProperty); 
            } 
        },
 
        /// <summary>
        /// The collection of GroupStyle objects that describes the display of 
        /// each level of grouping.  The entry at index 0 describes the top level
        /// groups, the entry at index 1 describes the next level, and so forth.
        /// If there are more levels of grouping than entries in the collection,
        /// the last entry is used for the extra levels. 
        /// </summary>
//        public ObservableCollection<GroupStyle> 
        GroupStyle:
        {
            get:function() { return this._groupStyle; } 
        },

        /// <summary>
        ///     GroupStyleSelector allows the app writer to provide custom selection logic 
        ///     for a GroupStyle to apply to each group collection. 
        /// </summary>
//        public GroupStyleSelector 
        GroupStyleSelector:
        {
            get:function() { return this.GetValue(ItemsControl.GroupStyleSelectorProperty); }, 
            set:function(value) { this.SetValue(ItemsControl.GroupStyleSelectorProperty, value); }
        },
 
        /// <summary> 
        ///     AlternationCount controls the range of values assigned to the
        ///     AlternationIndex property attached to each generated container.  The
        ///     default value 0 means "do not set AlternationIndex".  A positive
        ///     value means "assign AlternationIndex in the range [0, AlternationCount) 
        ///     so that adjacent containers receive different values".
        /// </summary> 
        /// <remarks> 
        ///     By referring to AlternationIndex in a trigger or binding (typically
        ///     in the ItemContainerStyle), you can make the appearance of items 
        ///     depend on their position in the display.  For example, you can make
        ///     the background color of the items in ListBox alternate between
        ///     blue and white.
        /// </remarks> 
//        public int 
        AlternationCount: 
        { 
            get:function() { return this.GetValue(ItemsControl.AlternationCountProperty); },
            set:function(value) { this.SetValue(ItemsControl.AlternationCountProperty, value); } 
        },
        
        /// <summary>
        /// The AlternationCount
        /// <summary> 
//        int IGeneratorHost.AlternationCount { get { return AlternationCount; } }

        /// <summary> 
        ///     Whether TextSearch is enabled or not on this ItemsControl 
        /// </summary>
//        public bool 
        IsTextSearchEnabled:
        {
            get:function() { return this.GetValue(ItemsControl.IsTextSearchEnabledProperty); },
            set:function(value) { this.SetValue(ItemsControl.IsTextSearchEnabledProperty, value); }
        }, 

        /// <summary>
        ///     Whether TextSearch is case sensitive or not on this ItemsControl 
        /// </summary>
//        public bool 
        IsTextSearchCaseSensitive:
        {
            get:function() { return this.GetValue(ItemsControl.IsTextSearchCaseSensitiveProperty); }, 
            set:function(value) { this.SetValue(ItemsControl.IsTextSearchCaseSensitiveProperty, value); }
        }, 
 
        /// <summary> 
        /// The view of the data
        /// </summary> 
//        ItemCollection IGeneratorHost.
        View:
        {
            get:function() { return this.Items; }
        }, 

//        private bool 
        IsInitPending:
        { 
            get:function()
            { 
                return this.ReadInternalFlag(InternalFlags.InitPending); 
            }
        }, 

 
//        internal Panel 
        ItemsHost:
        { 
            get:function()
            {
                return this._itemsHost;
            }, 
            set:function(value) { this._itemsHost = value; }
        }, 
 
        /// <summary>
        /// The item corresponding to the UI container which has focus.
        /// Virtualizing panels remove visual children you can't see. 
        /// When you scroll the focused element out of view we throw
        /// focus back on to the items control and remember the item which 
        /// was focused.  When it scrolls back into view (and focus is 
        /// still on the ItemsControl) we'll focus it.
        /// </summary> 
//        internal ItemInfo 
        FocusedInfo:
        {
            get:function() { return this._focusedInfo; }
        },
        
        //

        // ISSUE: IsLogicalVertical and IsLogicalHorizontal are rough guesses as to whether
        //        the ItemsHost is virtualizing in a particular direction.  Ideally this
        //        would be exposed through the IScrollInfo. 
//        internal bool 
        IsLogicalVertical: 
        {
            get:function() 
            {
                return (this.ItemsHost != null && this.ItemsHost.HasLogicalOrientation && this.ItemsHost.LogicalOrientation == Orientation.Vertical &&
                        this.ScrollHost != null && this.ScrollHost.CanContentScroll &&
                        this.VirtualizingStackPanel.GetScrollUnit(this) == ScrollUnit.Item); 
            }
        }, 
 
//        internal bool 
        IsLogicalHorizontal:
        { 
            get:function()
            {
                return (this.ItemsHost != null && this.ItemsHost.HasLogicalOrientation 
                		&& this.ItemsHost.LogicalOrientation == Orientation.Horizontal &&
                        this.ScrollHost != null && ScrollHost.CanContentScroll && 
                        this.VirtualizingStackPanel.GetScrollUnit(this) == ScrollUnit.Item);
            } 
        }, 

//        internal ScrollViewer 
        ScrollHost: 
        {
            get:function()
            {
                if (!this.ReadControlFlag(ControlBoolFlags.ScrollHostValid)) 
                {
                    if (this._itemsHost == null) 
                    { 
                        return null;
                    } 
                    else
                    {
                        // We have an itemshost, so walk up the tree looking for the ScrollViewer
                        for (/*DependencyObject*/var current = this._itemsHost; current != this && current != null; 
                        	current = VisualTreeHelper.GetParent(current)) 
                        {
                            /*ScrollViewer*/var scrollViewer = current instanceof ScrollViewer ? current : null; 
                            if (scrollViewer != null) 
                            {
                            	this._scrollHost = scrollViewer; 
                                break;
                            }
                        }
 
                        this.WriteControlFlag(ControlBoolFlags.ScrollHostValid, true);
                    } 
                } 

                return this._scrollHost; 
            }
        },

//        internal static TimeSpan 
        AutoScrollTimeout: 
        {
            get:function() 
            { 
                // NOTE: NtUser does the following (file: windows/ntuser/kernel/sysmet.c)
                //     gpsi->dtLBSearch = dtTime * 4;            // dtLBSearch   =  4  * gdtDblClk 
                //     gpsi->dtScroll = gpsi->dtLBSearch / 5;  // dtScroll     = 4/5 * gdtDblClk

                return TimeSpan.FromMilliseconds(MS.Win32.SafeNativeMethods.GetDoubleClickTime() * 0.8);
            } 
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        {
            get:function() { return _dType; } 
        } 


	});
	
	Object.defineProperties(ItemsControl, {
			    /// <summary> 
	    ///     The DependencyProperty for the ItemsSource property.
	    ///     Flags:              None 
	    ///     Default Value:      null
	    /// </summary>
//	    public static readonly DependencyProperty 
	    ItemsSourceProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemsSourceProperty === undefined){
	    			ItemsControl._ItemsSourceProperty = DependencyProperty.Register("ItemsSource", IEnumerable.Type, ItemsControl.Type,
                            /*new FrameworkPropertyMetadata(null, 
                                    new PropertyChangedCallback(null, OnItemsSourceChanged))*/
	    					FrameworkPropertyMetadata.BuildWithDVandPCCB(null, 
                                    new PropertyChangedCallback(null, OnItemsSourceChanged)));
	    		}
	    		
	    		return ItemsControl._ItemsSourceProperty;
	    	}
	    },
	    
        /// <summary>
        ///     The key needed set a read-only property.
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        HasItemsPropertyKey:
	    {
	    	get:function(){
	    		if(ItemsControl._HasItemsPropertyKey === undefined){
	    			ItemsControl._HasItemsPropertyKey =
	                    DependencyProperty.RegisterReadOnly( 
	                            "HasItems", 
	                            Boolean.Type,
	                            ItemsControl.Type, 
	                            /*new FrameworkPropertyMetadata(false, Control.OnVisualStatePropertyChanged)*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(false, 
	                            		new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
	    		}
	    		
	    		return ItemsControl._HasItemsPropertyKey;
	    	}
	    },

        /// <summary>
        ///     The DependencyProperty for the HasItems property. 
        ///     Flags:              None
        ///     Other:              Read-Only 
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
        HasItemsProperty:
	    {
	    	get:function(){
	    		return ItemsControl.HasItemsPropertyKey.DependencyProperty;
	    	}
	    },
        /// <summary>
        ///     The DependencyProperty for the DisplayMemberPath property. 
        ///     Flags:              none
        ///     Default Value:      string.Empty 
        /// </summary> 
//        public static readonly DependencyProperty 
        DisplayMemberPathProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._DisplayMemberPathProperty === undefined){
	    			ItemsControl._DisplayMemberPathProperty =
	                    DependencyProperty.Register( 
	                            "DisplayMemberPath",
	                            String.Type,
	                            ItemsControl.Type,
	                            /*new FrameworkPropertyMetadata( 
	                                    String.Empty,
	                                    new PropertyChangedCallback(null, Control.OnDisplayMemberPathChanged))*/
	                            FrameworkPropertyMetadata.Build3PCCB( 
	                                    String.Empty,
	                                    new PropertyChangedCallback(null, OnDisplayMemberPathChanged))); 
	    		}
	    		
	    		return ItemsControl._DisplayMemberPathProperty;
	    	}
	    },
        
        /// <summary>
        ///     The DependencyProperty for the ItemTemplate property. 
        ///     Flags:              none
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        ItemTemplateProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemTemplateProperty === undefined){
	    			ItemsControl._ItemTemplateProperty =
	                    DependencyProperty.Register( 
	                            "ItemTemplate", 
	                            DataTemplate.Type,
	                            ItemsControl.Type, 
	                            /*new FrameworkPropertyMetadata(
	                                    null,
	                                    new PropertyChangedCallback(null, Control.OnItemTemplateChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(
	                                    null,
	                                    new PropertyChangedCallback(null, OnItemTemplateChanged)));
	    		}
	    		
	    		return ItemsControl._ItemTemplateProperty;
	    	}
	    },
 
        /// <summary>
        ///     The DependencyProperty for the ItemTemplateSelector property. 
        ///     Flags:              none 
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
        ItemTemplateSelectorProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemTemplateSelectorProperty === undefined){
	    			ItemsControl._ItemTemplateSelectorProperty =
	                    DependencyProperty.Register(
	                            "ItemTemplateSelector", 
	                            DataTemplateSelector.Type,
	                            ItemsControl.Type, 
	                            /*new FrameworkPropertyMetadata( 
	                                    null,
	                                    new PropertyChangedCallback(null, Control.OnItemTemplateSelectorChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB( 
	                                    null,
	                                    new PropertyChangedCallback(null, OnItemTemplateSelectorChanged))); 
	    		}
	    		
	    		return ItemsControl._ItemTemplateSelectorProperty;
	    	}
	    },

        /// <summary> 
        ///     The DependencyProperty for the ItemStringFormat property. 
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ItemStringFormatProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemStringFormatProperty === undefined){
	    			ItemsControl._ItemStringFormatProperty =
	                    DependencyProperty.Register( 
	                            "ItemStringFormat",
	                            String.Type, 
	                            ItemsControl.Type, 
	                            /*new FrameworkPropertyMetadata(
	                                    null, 
	                                  new PropertyChangedCallback(null, Control.OnItemStringFormatChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(
	                                    null, 
	                                  new PropertyChangedCallback(null, OnItemStringFormatChanged)));
	    		}
	    		
	    		return ItemsControl._ItemStringFormatProperty;
	    	}
	    },

        /// <summary>
        ///     The DependencyProperty for the ItemBindingGroup property.
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ItemBindingGroupProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemBindingGroupProperty === undefined){
	    			ItemsControl._ItemBindingGroupProperty = 
	                    DependencyProperty.Register(
	                            "ItemBindingGroup", 
	                            BindingGroup.Type,
	                            ItemsControl.Type,
	                            /*new FrameworkPropertyMetadata(
	                                    (BindingGroup) null, 
	                                  new PropertyChangedCallback(null, Control.OnItemBindingGroupChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(
	                                    null, 
	                                  new PropertyChangedCallback(null, OnItemBindingGroupChanged)));
	    		}
	    		
	    		return ItemsControl._ItemBindingGroupProperty;
	    	}
	    },
 
        /// <summary>
        ///     The DependencyProperty for the ItemContainerStyle property.
        ///     Flags:              none
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ItemContainerStyleProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemContainerStyleProperty === undefined){
	    			ItemsControl._ItemContainerStyleProperty = 
	                    DependencyProperty.Register(
	                            "ItemContainerStyle", 
	                            Style.Type,
	                            ItemsControl.Type,
	                            /*new FrameworkPropertyMetadata(
	                                    (Style) null, 
	                                    new PropertyChangedCallback(null, Control.OnItemContainerStyleChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(
	                                    null, 
	                                    new PropertyChangedCallback(null, OnItemContainerStyleChanged)));
	    		}
	    		
	    		return ItemsControl._ItemContainerStyleProperty;
	    	}
	    },
        /// <summary>
        ///     The DependencyProperty for the ItemContainerStyleSelector property. 
        ///     Flags:              none
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        ItemContainerStyleSelectorProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemContainerStyleSelectorProperty === undefined){
	    			ItemsControl._ItemContainerStyleSelectorProperty =
	                    DependencyProperty.Register( 
	                            "ItemContainerStyleSelector", 
	                            StyleSelector.Type,
	                            ItemsControl.Type, 
	                            /*new FrameworkPropertyMetadata(
	                                    (StyleSelector) null,
	                                    new PropertyChangedCallback(null, Control.OnItemContainerStyleSelectorChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(
	                                    null,
	                                    new PropertyChangedCallback(null, OnItemContainerStyleSelectorChanged)));
	    		}
	    		
	    		return ItemsControl._ItemContainerStyleSelectorProperty;
	    	}
	    },
 
        /// <summary>
        ///     The DependencyProperty for the ItemsPanel property.
        ///     Flags:              none
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ItemsPanelProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._ItemsPanelProperty === undefined){
//	    			ItemsControl._ItemsPanelProperty = DependencyProperty.Register("ItemsPanel", ItemsPanelTemplate.Type, ItemsControl.Type,
//                            /*new FrameworkPropertyMetadata(GetDefaultItemsPanelTemplate(), 
//                                    new PropertyChangedCallback(null, Control.OnItemsPanelChanged))*/
//	    					FrameworkPropertyMetadata.BuildWithDVandPCCB(GetDefaultItemsPanelTemplate(), 
//                                    new PropertyChangedCallback(null, Control.OnItemsPanelChanged)));
	    			
	  /*  	        private static ItemsPanelTemplate GetDefaultItemsPanelTemplate()
	    	        { 
	    	            ItemsPanelTemplate template = new ItemsPanelTemplate(new FrameworkElementFactory(typeof(StackPanel)));
	    	            template.Seal(); 
	    	            return template; 
	    	        }*/
	    			/*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type));
//	    			template.Seal();
	    			
	    			ItemsControl._ItemsPanelProperty = DependencyProperty.Register("ItemsPanel", ItemsPanelTemplate.Type, ItemsControl.Type,
                            /*new FrameworkPropertyMetadata(GetDefaultItemsPanelTemplate(), 
                                    new PropertyChangedCallback(null, Control.OnItemsPanelChanged))*/
	    					FrameworkPropertyMetadata.BuildWithDVandPCCB(template, 
                                    new PropertyChangedCallback(null, OnItemsPanelChanged)));
	    			
	    		    template.Seal(); 
	    		}
	    		
	    		return ItemsControl._ItemsPanelProperty;
	    	}
	    }, 
          
 
//        private static readonly DependencyPropertyKey 
        IsGroupingPropertyKey:
	    {
	    	get:function(){
	    		if(ItemsControl._IsGroupingPropertyKey === undefined){
	    			ItemsControl._IsGroupingPropertyKey = 
	    	            DependencyProperty.RegisterReadOnly("IsGrouping", Boolean.Type, ItemsControl.Type, 
	    	            		/*new FrameworkPropertyMetadata(false, new PropertyChangedCallback(null, Control.OnIsGroupingChanged))*/
	    	            		FrameworkPropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, OnIsGroupingChanged)));
	    		}
	    		
	    		return ItemsControl._IsGroupingPropertyKey;
	    	}
	    },
 
        /// <summary>
        ///     The DependencyProperty for the IsGrouping property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsGroupingProperty:
	    {
	    	get:function(){
	    		return ItemsControl.IsGroupingPropertyKey.DependencyProperty;
	    	}
	    },

        /// <summary> 
        ///     The DependencyProperty for the GroupStyleSelector property.
        ///     Flags:              none 
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        GroupStyleSelectorProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._GroupStyleSelectorProperty === undefined){
	    			ItemsControl._GroupStyleSelectorProperty = DependencyProperty.Register("GroupStyleSelector", GroupStyleSelector.Type, ItemsControl.Type,
                            /*new FrameworkPropertyMetadata(null,
                                    new PropertyChangedCallback(OnGroupStyleSelectorChanged))*/
	    					FrameworkPropertyMetadata.BuildWithDVandPCCB(null,
                                    new PropertyChangedCallback(null, OnGroupStyleSelectorChanged)));
	    		}
	    		
	    		return ItemsControl._GroupStyleSelectorProperty;
	    	}
	    }, 
 
        /// <summary> 
        ///     The DependencyProperty for the AlternationCount property.
        ///     Flags:              none 
        ///     Default Value:      0 
        /// </summary>
//        public static readonly DependencyProperty 
        AlternationCountProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._AlternationCountProperty === undefined){
	    			ItemsControl._AlternationCountProperty = 
	                    DependencyProperty.Register(
	                            "AlternationCount",
	                            Number.Type,
	                            ItemsControl.Type, 
	                            /*new FrameworkPropertyMetadata(
	                                    0, 
	                                    new PropertyChangedCallback(null, OnAlternationCountChanged))*/
	                            FrameworkPropertyMetadata.BuildWithDVandPCCB(
	                                    0, 
	                                    new PropertyChangedCallback(null, OnAlternationCountChanged))); 
	    		}
	    		
	    		return ItemsControl._AlternationCountProperty;
	    	}
	    },
 
//        private static readonly DependencyPropertyKey 
        AlternationIndexPropertyKey:
	    {
	    	get:function(){
	    		if(ItemsControl._AlternationIndexPropertyKey === undefined){
	    			ItemsControl._AlternationIndexPropertyKey =
                    DependencyProperty.RegisterAttachedReadOnly( 
                                "AlternationIndex",
                                Number.Type,
                                ItemsControl.Type,
                                /*new FrameworkPropertyMetadata(0)*/
                                FrameworkPropertyMetadata.BuildWithDV(0)); 
	    		}
	    		
	    		return ItemsControl._AlternationIndexPropertyKey;
	    	}
	    },

        /// <summary> 
        /// AlternationIndex is set on containers generated for an ItemsControl, when 
        /// the ItemsControl's AlternationCount property is positive.  The AlternationIndex
        /// lies in the range [0, AlternationCount), and adjacent containers always get 
        /// assigned different values.
        /// </summary>
//        public static readonly DependencyProperty 
        AlternationIndexProperty:
	    {
	    	get:function(){
	    		return ItemsControl.AlternationIndexPropertyKey.DependencyProperty;
	    	}
	    },

        /// <summary> 
        ///     The DependencyProperty for the IsTextSearchEnabled property.
        ///     Default Value:      false 
        /// </summary> 
//        public static readonly DependencyProperty 
        IsTextSearchEnabledProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._IsTextSearchEnabledProperty === undefined){
	    			ItemsControl._IsTextSearchEnabledProperty =
	                    DependencyProperty.Register( 
	                            "IsTextSearchEnabled",
	                            Boolean.Type,
	                            ItemsControl.Type,
	                            /*new FrameworkPropertyMetadata(false)*/
	                            FrameworkPropertyMetadata.BuildWithDV(false)); 
	    		}
	    		
	    		return ItemsControl._IsTextSearchEnabledProperty;
	    	}
	    },

        /// <summary> 
        ///     The DependencyProperty for the IsTextSearchCaseSensitive property. 
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
        IsTextSearchCaseSensitiveProperty:
	    {
	    	get:function(){
	    		if(ItemsControl._IsTextSearchCaseSensitiveProperty === undefined){
	    			ItemsControl._IsTextSearchCaseSensitiveProperty =
	                    DependencyProperty.Register(
	                            "IsTextSearchCaseSensitive",
	                            Boolean.Type, 
	                            ItemsControl.Type,
	                            /*new FrameworkPropertyMetadata(false)*/
	                            FrameworkPropertyMetadata.BuildWithDV(false)); 
	    		}
	    		
	    		return ItemsControl._IsTextSearchCaseSensitiveProperty;
	    	}
	    }
	    
	});
	
//    private static void 
    function OnScrollingModeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
    	ShouldCoerceScrollUnitField.SetValue(d, true);
        d.CoerceValue(VirtualizingStackPanel.ScrollUnitProperty);
    }

//    private static object 
    function CoerceScrollingMode(/*DependencyObject*/ d, /*object*/ baseValue)
    { 
        if (ShouldCoerceScrollUnitField.GetValue(d)) 
        {
        	ShouldCoerceScrollUnitField.SetValue(d, false); 
            /*BaseValueSource*/var baseValueSource = DependencyPropertyHelper.GetValueSource(d, VirtualizingStackPanel.ScrollUnitProperty).BaseValueSource;
            if (/*((ItemsControl)d)*/d.IsGrouping && baseValueSource == BaseValueSource.Default)
            {
                return ScrollUnit.Pixel; 
            }
        } 

        return baseValue;
    } 

//    private static void 
    function OnCacheSizeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        ShouldCoerceCacheSizeField.SetValue(d, true); 
        d.CoerceValue(e.Property);
    } 

    //default VCLU will be Item for the flat non-grouping case
//    private static object 
    function CoerceVirtualizationCacheLengthUnit(/*DependencyObject*/ d, /*object*/ baseValue) 
    {
        if (ShouldCoerceCacheSizeField.GetValue(d))
        {
        	ShouldCoerceCacheSizeField.SetValue(d, false); 
            /*BaseValueSource*/
            var baseValueSource = DependencyPropertyHelper.GetValueSource(d, VirtualizingStackPanel.CacheLengthUnitProperty).BaseValueSource;
            if ( !/*((ItemsControl)d)*/d.IsGrouping && !(d instanceof TreeView) && baseValueSource == BaseValueSource.Default ) 
            { 
                return VirtualizationCacheLengthUnit.Item;
            } 
        }

        return baseValue;
    }
//    private static void 
    function OnItemsSourceChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*ItemsControl*/var ic =  d;
        /*IEnumerable*/var oldValue = e.OldValue;
        /*IEnumerable*/var newValue = e.NewValue; 

        /*((IContainItemStorage)ic)*/ic.Clear(); 

        /*BindingExpressionBase*/var beb = BindingOperations.GetBindingExpressionBase(d, ItemsControl.ItemsSourceProperty);
        if (beb != null) 
        {
            // ItemsSource is data-bound.   Always go to ItemsSource mode.
            // Also, extract the source item, to supply as context to the
            // CollectionRegistering event 
            ic.Items.SetItemsSource(newValue, function(x){beb.GetSourceItem(x);} );

        } 
        else if (e.NewValue != null)
        { 
            // ItemsSource is non-null, but not data-bound.  Go to ItemsSource mode
            ic.Items.SetItemsSource(newValue);
        }
        else 
        {
            // ItemsSource is explicitly null.  Return to normal mode. 
            ic.Items.ClearItemsSource(); 
        }

        ic.OnItemsSourceChanged(oldValue, newValue);
    }

    /// <summary>
    ///     Called when DisplayMemberPathProperty is invalidated on "d."
    /// </summary> 
//    private static void 
    function OnDisplayMemberPathChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.OnDisplayMemberPathChanged(e.OldValue, e.NewValue); 
        d.UpdateDisplayMemberTemplateSelector();
    }
    
    /// <summary> 
    ///     Called when ItemTemplateProperty is invalidated on "d." 
    /// </summary>
    /// <param name="d">The object on which the property was invalidated.</param> 
    /// <param name="e">EventArgs that contains the old and new values for this property</param>
//    private static void 
    function OnItemTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.OnItemTemplateChanged(e.OldValue, e.NewValue); 
    }

    /// <summary>
    ///     Called when ItemTemplateSelectorProperty is invalidated on "d." 
    /// </summary>
    /// <param name="d">The object on which the property was invalidated.</param>
    /// <param name="e">EventArgs that contains the old and new values for this property</param>
//    private static void 
    function OnItemTemplateSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.OnItemTemplateSelectorChanged(e.OldValue, e.NewValue); 
    } 

    /// <summary> 
    ///     Called when ItemStringFormatProperty is invalidated on "d."
    /// </summary> 
//    private static void 
    function OnItemStringFormatChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.OnItemStringFormatChanged(e.OldValue, e.NewValue);
        d.UpdateDisplayMemberTemplateSelector(); 
    } 

    /// <summary>
    ///     Called when ItemBindingGroupProperty is invalidated on "d." 
    /// </summary>
//    private static void 
    function OnItemBindingGroupChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.OnItemBindingGroupChanged( e.OldValue, /*(BindingGroup)*/ e.NewValue);
    }

    /// <summary> 
    ///     Called when ItemContainerStyleProperty is invalidated on "d."
    /// </summary>
    /// <param name="d">The object on which the property was invalidated.</param>
    /// <param name="e">EventArgs that contains the old and new values for this property</param> 
//    private static void 
    function OnItemContainerStyleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.OnItemContainerStyleChanged(/*(Style) */e.OldValue, /*(Style)*/ e.NewValue); 
    }

    /// <summary>
    ///     Called when ItemContainerStyleSelectorProperty is invalidated on "d."
    /// </summary> 
    /// <param name="d">The object on which the property was invalidated.</param>
    /// <param name="e">EventArgs that contains the old and new values for this property</param> 
//    private static void 
    function OnItemContainerStyleSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
       d.OnItemContainerStyleSelectorChanged(/*(StyleSelector)*/ e.OldValue, /*(StyleSelector)*/ e.NewValue); 
    }

    /// <summary> 
    ///     Returns the ItemsControl for which element is an ItemsHost.
    ///     More precisely, if element is marked by setting IsItemsHost="true"
    ///     in the style for an ItemsControl, or if element is a panel created
    ///     by the ItemsPresenter for an ItemsControl, return that ItemsControl. 
    ///     Otherwise, return null.
    /// </summary> 
//    public static ItemsControl 
    ItemsControl.GetItemsOwner = function(/*DependencyObject*/ element) 
    {
        /*ItemsControl*/var container = null; 
        /*Panel*/var panel = element instanceof Panel ? element : null;

        if (panel != null && panel.IsItemsHost)
        { 
            // see if element was generated for an ItemsPresenter
            /*ItemsPresenter*/var ip = ItemsPresenter.FromPanel(panel); 

            if (ip != null)
            { 
                // if so use the element whose style begat the ItemsPresenter
                container = ip.Owner;
            }
            else 
            {
                // otherwise use element's templated parent 
                container = panel.TemplatedParent instanceof ItemsControl  ? panel.TemplatedParent : null; 
            }
        } 

        return container;
    };


////    internal static DependencyObject 
//    ItemsControl.GetItemsOwnerInternal = function(/*DependencyObject*/ element)
//    { 
//        /*ItemsControl*/var temp; 
//        return GetItemsOwnerInternal(element, /*out temp*/{"temp" : temp});
//    }; 

    /// <summary>
    /// Different from public GetItemsOwner
    /// Returns ip.TemplatedParent instead of ip.Owner 
    /// More accurate when we want to distinguish if owner is a GroupItem or ItemsControl
    /// </summary> 
    /// <param name="element"></param> 
    /// <returns></returns>
//    internal static DependencyObject 
    ItemsControl.GetItemsOwnerInternal = function(/*DependencyObject*/ element, /*out ItemsControl itemsControl*/itemsControlOut) 
    {
    	if(itemsControlOut === undefined){
    		itemsControlOut = {
    			"itemsControl" : null
    		};
    	};
    	
        /*DependencyObject*/var container = null;
        /*Panel*/var panel = element instanceof Panel ? element : null;
        itemsControlOut.itemsControl = null; 

        if (panel != null && panel.IsItemsHost) 
        { 
            // see if element was generated for an ItemsPresenter
            /*ItemsPresenter*/var ip = ItemsPresenter.FromPanel(panel); 

            if (ip != null)
            {
                // if so use the element whose style begat the ItemsPresenter 
                container = ip.TemplatedParent;
                itemsControlOut.itemsControl = ip.Owner; 
            } 
            else
            { 
                // otherwise use element's templated parent
                container = panel.TemplatedParent;
                itemsControlOut.itemsControl = container instanceof ItemsControl ? container : null;
            } 
        }

        return container; 
    };

//    private static ItemsPanelTemplate 
    function GetDefaultItemsPanelTemplate()
    { 
        /*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type));
        template.Seal(); 
        return template; 
    }

    /// <summary> 
    ///     Called when ItemsPanelProperty is invalidated on "d."
    /// </summary> 
    /// <param name="d">The object on which the property was invalidated.</param> 
    /// <param name="e">EventArgs that contains the old and new values for this property</param>
//    private static void 
    function OnItemsPanelChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.OnItemsPanelChanged(/*(ItemsPanelTemplate)*/ e.OldValue, /*(ItemsPanelTemplate)*/ e.NewValue);
    }

//    private static void 
    function OnIsGroupingChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.OnIsGroupingChanged(e);
    } 

    /// <summary>
    ///     Called when GroupStyleSelectorProperty is invalidated on "d." 
    /// </summary>
    /// <param name="d">The object on which the property was invalidated.</param>
    /// <param name="e">EventArgs that contains the old and new values for this property</param>
//    private static void 
    function OnGroupStyleSelectorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.OnGroupStyleSelectorChanged(/*(GroupStyleSelector)*/ e.OldValue, /*(GroupStyleSelector)*/ e.NewValue); 
    } 

    /// <summary>
    ///     Called when AlternationCountProperty is invalidated on "d." 
    /// </summary>
//    private static void 
    function OnAlternationCountChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        var oldAlternationCount = /*(int) */e.OldValue;
        var newAlternationCount = /*(int) */e.NewValue;

        d.OnAlternationCountChanged(oldAlternationCount, newAlternationCount); 
    }

    /// <summary> 
    /// Static getter for the AlternationIndex attached property. 
    /// </summary>
//    public static int 
    ItemsControl.GetAlternationIndex = function(/*DependencyObject*/ element) 
    {
        if (element == null)
            throw new ArgumentNullException("element");

        return element.GetValue(ItemsControl.AlternationIndexProperty);
    }; 

    // internal setter for AlternationIndex.  This property is not settable by
    // an app, only by internal code 
//    internal static void 
    ItemsControl.SetAlternationIndex = function(/*DependencyObject*/ d, /*int*/ value)
    {
        d.SetValue(ItemsControl.AlternationIndexPropertyKey, value);
    }; 

    // internal clearer for AlternationIndex.  This property is not settable by 
    // an app, only by internal code 
//    internal static void 
    ItemsControl.ClearAlternationIndex = function(/*DependencyObject*/ d)
    { 
        d.ClearValue(ItemsControl.AlternationIndexPropertyKey);
    };

    ///<summary>
    /// Return the ItemsControl that owns the given container element 
    ///</summary>
//    public static ItemsControl 
    ItemsControl.ItemsControlFromItemContainer = function(/*DependencyObject*/ container) 
    { 
        /*UIElement*/var ui = container instanceof UIElement ? container : null;
        if (ui == null) 
            return null;

        // ui appeared in items collection
        /*ItemsControl*/var ic = LogicalTreeHelper.GetParent(ui);
        ic = ic instanceof ItemsControl ? ic : null; 
        if (ic != null)
        { 
            // this is the right ItemsControl as long as the item 
            // is (or is eligible to be) its own container
//            /*IGeneratorHost*/var host = ic instanceof IGeneratorHost ? ic : null; 
        	/*IGeneratorHost*/var host = ic.isInstanceOf(IGeneratorHost) ? ic : null; 
            if (host.IsItemItsOwnContainer(ui))
                return ic;
            else
                return null; 
        }

        ui = VisualTreeHelper.GetParent(ui);
        ui = ui instanceof UIElement ? ui : null; 

        return ItemsControl.GetItemsOwner(ui); 
    };

    ///<summary>
    /// Return the container that owns the given element.  If itemsControl 
    /// is not null, return a container that belongs to the given ItemsControl.
    /// If itemsControl is null, return the closest container belonging to 
    /// any ItemsControl.  Return null if no such container exists. 
    ///</summary>
//    public static DependencyObject 
    ItemsControl.ContainerFromElement = function(/*ItemsControl*/ itemsControl, /*DependencyObject*/ element) 
    {
        if (element == null)
            throw new ArgumentNullException("element");

        // if the element is itself the desired container, return it
        if (IsContainerForItemsControl(element, itemsControl)) 
        { 
            return element;
        } 

        // start the tree walk at the element's parent
        /*FrameworkObject*/var fo = new FrameworkObject(element);
        fo.Reset(fo.GetPreferVisualParent(true).DO); 

        // walk up, stopping when we reach the desired container 
        while (fo.DO != null) 
        {
            if (IsContainerForItemsControl(fo.DO, itemsControl)) 
            {
                break;
            }

            fo.Reset(fo.PreferVisualParent.DO);
        } 

        return fo.DO;
    };
    
    // helper method used by ContainerFromElement
//    private static bool 
    function IsContainerForItemsControl(/*DependencyObject*/ element, /*ItemsControl*/ itemsControl)
    { 
        // is the element a container?
        if (element.ContainsValue(ItemContainerGenerator.ItemForItemContainerProperty)) 
        { 
            // does the element belong to the itemsControl?
            if (itemsControl == null || itemsControl == ItemsControl.ItemsControlFromItemContainer(element)) 
            {
                return true;
            }
        } 

        return false; 
    }


//    internal static ElementViewportPosition 
//    ItemsControl.GetElementViewportPosition = function(/*FrameworkElement*/ viewPort, 
//        /*UIElement*/ element, 
//        /*FocusNavigationDirection*/ axis,
//        /*bool*/ fullyVisible) 
//    {
//        /*Rect*/var elementRect;
//        return GetElementViewportPosition(viewPort, element, axis, fullyVisible, /*out elementRect*/{"elementRect" : elementRect});
//    }; 

    /// <summary> 
    /// Determines if the given element is 
    ///     1) Completely in the current visible page along the given axis.
    ///     2) Partially in the current visible page. 
    ///     3) Before the current page along the given axis.
    ///     4) After the current page along the given axis.
    /// fullyVisible parameter specifies if the element needs to be completely
    /// in the current visible page along the perpendicular axis (if it is 
    /// completely in the page along the major axis)
    /// </summary> 
//    internal static ElementViewportPosition 
    ItemsControl.GetElementViewportPosition = function(/*FrameworkElement*/ viewPort, 
        /*UIElement*/ element,
        /*FocusNavigationDirection*/ axis, 
        /*bool*/ fullyVisible,
        /*out Rect elementRect*/elementRectOut)
    {
    	if(elementRectOut === undefined){
    		elementRectOut = {"elementRect":null};
    	}
    	if(arguments.length == 5){
    		elementRectOut.elementRect = Rect.Empty; 

            // If there's no ScrollHost or ItemsHost, the element is not on the page 
            if (viewPort == null) 
            {
                return ElementViewportPosition.None; 
            }

            if (element == null || !viewPort.IsAncestorOf(element))
            { 
                return ElementViewportPosition.None;
            } 

            /*Rect*/var viewPortBounds = new Rect(new Point(), viewPort.RenderSize);
            /*Rect*/var elementBounds = new Rect(new Point(), element.RenderSize); 
            elementBounds = element.TransformToAncestor(viewPort).TransformBounds(elementBounds);
            var northSouth = (axis == FocusNavigationDirection.Up || axis == FocusNavigationDirection.Down);
            var eastWest = (axis == FocusNavigationDirection.Left || axis == FocusNavigationDirection.Right);

            elementRect = elementBounds;

            // Return true if the element is completely contained within the page along the given axis. 

            if (fullyVisible) 
            {
                if (viewPortBounds.Contains(elementBounds))
                {
                    return ElementViewportPosition.CompletelyInViewport; 
                }
            } 
            else 
            {
                if (northSouth) 
                {
                    if (DoubleUtil.LessThanOrClose(viewPortBounds.Top, elementBounds.Top)
                        && DoubleUtil.LessThanOrClose(elementBounds.Bottom, viewPortBounds.Bottom))
                    { 
                        return ElementViewportPosition.CompletelyInViewport;
                    } 
                } 
                else if (eastWest)
                { 
                    if (DoubleUtil.LessThanOrClose(viewPortBounds.Left, elementBounds.Left)
                        && DoubleUtil.LessThanOrClose(elementBounds.Right, viewPortBounds.Right))
                    {
                        return ElementViewportPosition.CompletelyInViewport; 
                    }
                } 
            } 

            if (ElementIntersectsViewport(viewPortBounds, elementBounds)) 
            {
                return ElementViewportPosition.PartiallyInViewport;
            }
            else if ((northSouth && DoubleUtil.LessThanOrClose(elementBounds.Bottom, viewPortBounds.Top)) || 
                (eastWest && DoubleUtil.LessThanOrClose(elementBounds.Right, viewPortBounds.Left)))
            { 
                return ElementViewportPosition.BeforeViewport; 
            }
            else if ((northSouth && DoubleUtil.LessThanOrClose(viewPortBounds.Bottom, elementBounds.Top)) || 
                (eastWest && DoubleUtil.LessThanOrClose(viewPortBounds.Right, elementBounds.Left)))
            {
                return ElementViewportPosition.AfterViewport;
            } 
            return ElementViewportPosition.None;
    	}
    	
    }; 

//    private static bool 
    function ElementIntersectsViewport(/*Rect*/ viewportRect, /*Rect*/ elementRect)
    { 
        if (viewportRect.IsEmpty || elementRect.IsEmpty)
        {
            return false;
        } 

        if (DoubleUtil.LessThan(elementRect.Right, viewportRect.Left) || LayoutDoubleUtil.AreClose(elementRect.Right, viewportRect.Left) || 
            DoubleUtil.GreaterThan(elementRect.Left, viewportRect.Right) || LayoutDoubleUtil.AreClose(elementRect.Left, viewportRect.Right) || 
            DoubleUtil.LessThan(elementRect.Bottom, viewportRect.Top) || LayoutDoubleUtil.AreClose(elementRect.Bottom, viewportRect.Top) ||
            DoubleUtil.GreaterThan(elementRect.Top, viewportRect.Bottom) || LayoutDoubleUtil.AreClose(elementRect.Top, viewportRect.Bottom)) 
        {
            return false;
        }
        return true; 
    }

//    private bool 
    function IsInDirectionForLineNavigation(/*Rect*/ fromRect, /*Rect*/ toRect, /*FocusNavigationDirection*/ direction, /*bool*/ isHorizontal) 
    {
//        Debug.Assert(direction == FocusNavigationDirection.Up || 
//            direction == FocusNavigationDirection.Down);

        if (direction == FocusNavigationDirection.Down)
        { 
            if (isHorizontal)
            { 
                // Right 
                return DoubleUtil.GreaterThanOrClose(toRect.Left, fromRect.Left);
            } 
            else
            {
                // Down
                return DoubleUtil.GreaterThanOrClose(toRect.Top, fromRect.Top); 
            }
        } 
        else if (direction == FocusNavigationDirection.Up) 
        {
            if (isHorizontal) 
            {
                // Left
                return DoubleUtil.LessThanOrClose(toRect.Right, fromRect.Right);
            } 
            else
            { 
                // UP 
                return DoubleUtil.LessThanOrClose(toRect.Bottom, fromRect.Bottom);
            } 
        }
        return false;
    }

//    private static void 
    function OnGotFocus(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e)
    { 
        /*ItemsControl*/var itemsControl = sender; 
        /*UIElement*/var focusedElement = e.OriginalSource instanceof UIElement ? e.OriginalSource : null;
        if ((focusedElement != null) && (focusedElement != itemsControl)) 
        {
            var item = itemsControl.ItemContainerGenerator.ItemFromContainer(focusedElement);
            if (item != DependencyProperty.UnsetValue)
            { 
                itemsControl._focusedInfo = itemsControl.NewItemInfo(item, focusedElement);
            } 
            else if (itemsControl._focusedInfo != null) 
            {
                /*UIElement*/var itemContainer = itemsControl._focusedInfo.Container;
                itemContainer = itemContainer instanceof UIElement ? itemContainer : null; 
                if (itemContainer == null ||
                    !Helper.IsAnyAncestorOf(itemContainer, focusedElement))
                {
                    itemsControl._focusedInfo = null; 
                }
            } 
        } 
    }
    
//    private static ItemsControl 
    function GetEncapsulatingItemsControl(/*FrameworkElement*/ element)
    { 
        while (element != null)
        {
            /*ItemsControl*/var itemsControl = ItemsControl.ItemsControlFromItemContainer(element);
            if (itemsControl != null) 
            {
                return itemsControl; 
            } 
            element = VisualTreeHelper.GetParent(element);
            element = element instanceof FrameworkElement ? element : null;
        } 
        return null;
    }

//    private static object 
//    function GetEncapsulatingItem(/*FrameworkElement*/ element, /*out FrameworkElement container*/containerOut) 
//    {
//        /*ItemsControl*/var itemsControl = null; 
//        return GetEncapsulatingItem(element, /*out container*/containerOut, /*out itemsControl*/{"itemsControl" : itemsControl}); 
//    }

//    private static object 
    function GetEncapsulatingItem(/*FrameworkElement*/ element, /*out FrameworkElement container*/containerOut, 
    		/*out ItemsControl itemsControl*/itemsControlOut)
    {
    	if(itemsControlOut === undefined){
    		itemsControlOut = {"itemsControl" : null};
    	}
        /*object*/var item = DependencyProperty.UnsetValue;
        itemsControlOut.itemsControl = null; 

        while (element != null) 
        { 
        	itemsControlOut.itemsControl = ItemsControl.ItemsControlFromItemContainer(element);
            if (itemsControlOut.itemsControl != null) 
            {
                item = itemsControlOut.itemsControl.ItemContainerGenerator.ItemFromContainer(element);

                if (item != DependencyProperty.UnsetValue) 
                {
                    break; 
                } 
            }

            element = VisualTreeHelper.GetParent(element);
            element = element instanceof FrameworkElement ? element : null;
        }

        containerOut.container = element; 
        return item;
    } 

//    internal static DependencyObject 
    ItemsControl.TryGetTreeViewItemHeader = function(/*DependencyObject*/ element)
    { 
//        /*TreeViewItem*/var treeViewItem = element instanceof EnsureTreeViewItem() ? element : null;
//        if (treeViewItem != null)
//        {
//            return treeViewItem.TryGetHeaderElement(); 
//        }
        
        EnsureTreeViewItem();
        if(TreeViewItem != null){
            var treeViewItem = element instanceof TreeViewItem ? element : null;
            if (treeViewItem != null)
            {
                return treeViewItem.TryGetHeaderElement(); 
            }
        }
        
        return element; 
    };

//  static ItemsControl() 
	function Initialize()
    { 
        //
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ItemsControl.Type, 
        		/*new FrameworkPropertyMetadata(ItemsControl.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(ItemsControl.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(ItemsControl.Type);
        
        EventManager.RegisterClassHandler(ItemsControl.Type, Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnGotFocus));
//        VirtualizingStackPanel.ScrollUnitProperty.OverrideMetadata(ItemsControl.Type, 
//        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnScrollingModeChanged), 
//        				new CoerceValueCallback(null, CoerceScrollingMode))*/
//        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(new PropertyChangedCallback(null, OnScrollingModeChanged), 
//        				new CoerceValueCallback(null, CoerceScrollingMode)));
//        
//        VirtualizingPanel.CacheLengthProperty.OverrideMetadata(ItemsControl.Type, 
//        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnCacheSizeChanged))*/
//        		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnCacheSizeChanged))); 
//        
//        VirtualizingPanel.CacheLengthUnitProperty.OverrideMetadata(null, ItemsControl.Type, 
//        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnCacheSizeChanged), 
//        				new CoerceValueCallback(null, CoerceVirtualizationCacheLengthUnit))*/
//        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(new PropertyChangedCallback(null, OnCacheSizeChanged), 
//        				new CoerceValueCallback(null, CoerceVirtualizationCacheLengthUnit)));
    };
    
	ItemsControl.Type = new Type("ItemsControl", ItemsControl, [Control.Type, IAddChild.Type, IGeneratorHost.Type/*, IContainItemStorage.Type*/]);
	Initialize();
	
	return ItemsControl;
});
