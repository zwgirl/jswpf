/**
 * TreeViewItem
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedItemsControl", "primitives/IHierarchicalVirtualizationAndScrollInfo",
        "windows/DependencyProperty", "windows/DependencyObjectType", "windows/FrameworkElement", "input/KeyboardNavigation",
        "controls/Control", "windows/UIElement", "windows/UIPropertyMetadata", "windows/EventManager", "windows/RequestBringIntoViewEventHandler",
        "input/MouseButtonEventHandler", "windows/RoutingStrategy", "windows/RoutedEventHandler", "input/ModifierKeys",
        "input/Keyboard", "internal/Helper", "controls/ItemContainerGenerator", "specialized/NotifyCollectionChangedAction",
        "controls/VirtualizingPanel", "windows/FlowDirection", "primitives/Selector"], 
		function(declare, Type, HeaderedItemsControl, IHierarchicalVirtualizationAndScrollInfo,
				DependencyProperty, DependencyObjectType, FrameworkElement, KeyboardNavigation,
				Control, UIElement, UIPropertyMetadata, EventManager, RequestBringIntoViewEventHandler,
				MouseButtonEventHandler, RoutingStrategy, RoutedEventHandler, ModifierKeys,
				Keyboard, Helper, ItemContainerGenerator, NotifyCollectionChangedAction,
				VirtualizingPanel, FlowDirection, Selector){
	
//  private static DependencyObjectType 
    var _dType = null;

//    private const string 
	var HeaderPartName = "PART_Header";
//    private const string 
	var ItemsHostPartName = "ItemsHost";
    
	var TreeViewItem = declare("TreeViewItem", [HeaderedItemsControl, IHierarchicalVirtualizationAndScrollInfo],{
		constructor:function(/*int*/ index, /*boolean*/ found){
        	this._dom = window.document.createElement('div');
        	
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},

        /// <summary>
        ///     Event fired when <see cref="IsExpanded"/> becomes true. 
        /// </summary>
        AddExpandedHandler:function(value) 
        {
            this.AddHandler(TreeViewItem.ExpandedEvent, value);
        },
        
        RemoveExpandedHandler:function(value) 
        {
            this.RemoveHandler(TreeViewItem.ExpandedEvent, value); 
        }, 

        /// <summary>
        ///     Called when <see cref="IsExpanded"/> becomes true.
        ///     Default implementation fires the <see cref="Expanded"/> event. 
        /// </summary>
        /// <param name="e">Event arguments.</param> 
//        protected virtual void 
        OnExpanded:function(/*RoutedEventArgs*/ e) 
        {
            this.RaiseEvent(e); 
        },
        /// <summary>
        ///     Event fired when <see cref="IsExpanded"/> becomes false. 
        /// </summary>
        AddCollapsedHandler:function(value)
        { 
            this.AddHandler(TreeViewItem.CollapsedEvent, value); 
        },

        RemoveCollapsedHandler:function(value)
        {
        	this.RemoveHandler(TreeViewItem.CollapsedEvent, value);
        }, 
 
        /// <summary> 
        ///     Called when <see cref="IsExpanded"/> becomes false.
        ///     Default implementation fires the <see cref="Collapsed"/> event. 
        /// </summary>
        /// <param name="e">Event arguments.</param>
//        protected virtual void 
        OnCollapsed:function(/*RoutedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        }, 

        /// <summary> 
        ///     Event fired when <see cref="IsSelected"/> becomes true.
        /// </summary> 
        AddSelectedHandler:function()
        {
            this.AddHandler(TreeViewItem.SelectedEvent, value);
        }, 

        RemoveSelectedHandler:function() 
        { 
        	this.RemoveHandler(TreeViewItem.SelectedEvent, value);
        }, 

        /// <summary>
        ///     Called when <see cref="IsSelected"/> becomes true. 
        ///     Default implementation fires the <see cref="Selected"/> event.
        /// </summary> 
        /// <param name="e">Event arguments.</param> 
//        protected virtual void 
        OnSelected:function(/*RoutedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        },

        /// <summary> 
        ///     Event fired when <see cref="IsSelected"/> becomes false.
        /// </summary>
        AddUnselectedHandler:function(value) 
        { 
            this.AddHandler(TreeViewItem.UnselectedEvent, value);
        }, 

        RemoveUnselectedHandler:function(value)
        {
        	this.RemoveHandler(TreeViewItem.UnselectedEvent, value); 
        },
 
        /// <summary>
        ///     Called when <see cref="IsSelected"/> becomes false. 
        ///     Default implementation fires the <see cref="Unselected"/> event.
        /// </summary>
        /// <param name="e">Event arguments.</param>
//        protected virtual void 
        OnUnselected:function(/*RoutedEventArgs*/ e) 
        {
        	this.RaiseEvent(e); 
        },

        /// <summary> 
        /// Expands this TreeViewItem and all of the TreeViewItems inside its subtree.
        /// </summary> 
//        public void 
        ExpandSubtree:function() 
        {
            this.ExpandRecursive(this); 
        },
 
        /// <summary> 
        /// Called when the visual parent of this element changes. 
        /// </summary>
        /// <param name="oldParent"></param> 
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent)
        {
            // When TreeViewItem is added to the visual tree we check if IsSelected is set to true
            // In this case we need to update the tree selection 
            if (VisualTreeHelper.GetParent(this) != null)
            { 
                if (this.IsSelected) 
                {
                	this.Select(true); 
                }
            }

            HeaderedItemsControl.prototype.OnVisualParentChanged.call(this, oldParent); 
        },
 
//        private void 
        Select:function(/*bool*/ selected) 
        {
            /*TreeView*/var tree = this.ParentTreeView; 
            /*ItemsControl*/var parent = this.ParentItemsControl;
            if ((tree != null) && (parent != null) && !tree.IsSelectionChangeActive)
            {
                // Give the TreeView a reference to this container and its data 
                var data = parent.GetItemOrContainerFromContainer(this);
                tree.ChangeSelection(data, this, selected); 
 
                // Making focus of TreeViewItem synchronize with selection if needed.
                if (selected && tree.IsKeyboardFocusWithin && !this.IsKeyboardFocusWithin) 
                {
                	this.Focus();
                }
            } 
        },

//        internal void 
        UpdateContainsSelection:function(/*bool*/ selected) 
        {
            /*TreeViewItem*/var parent = this.ParentTreeViewItem; 
            while (parent != null) 
            {
                parent.ContainsSelection = selected; 
                parent = parent.ParentTreeViewItem;
            }
        },

        /// <summary> 
        ///     This method is invoked when the IsFocused property changes to true.
        /// </summary>
        /// <param name="e">Event arguments.</param>
//        protected override void 
        OnGotFocus:function(/*RoutedEventArgs*/ e) 
        {
        	this.Select(true); 
        	HeaderedItemsControl.prototype.OnGotFocus.call(this, e); 
        },
 
        /// <summary>
        ///     Called when the left mouse button is pressed down.
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            if (!e.Handled && this.IsEnabled) 
            {
                var wasFocused = this.IsFocused; 
                if (this.Focus())
                {
                    if (/*wasFocused &&*/ !this.IsSelected) //cym comment
                    { 
                        this.Select(true);
                    } 
                    e.Handled = true; 
                }
 
                if ((e.ClickCount % 2) == 0)
                {
                	this.SetCurrentValueInternal(this.IsExpandedProperty, !this.IsExpanded);
                    e.Handled = true; 
                }
            } 
            HeaderedItemsControl.prototype.OnMouseLeftButtonDown.call(this, e); 
        },
 
        /// <summary>
        ///     Called when a keyboard key is pressed down.
        /// </summary>
        /// <param name="e">Event Arguments</param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
        	HeaderedItemsControl.prototype.OnKeyDown.call(this, e); 
            if (!e.Handled)
            { 
                switch (e.Key)
                {
                    case Key.Add:
                        if (this.CanExpandOnInput && !this.IsExpanded) 
                        {
                        	this.SetCurrentValueInternal(TreeViewItem.IsExpandedProperty, true); 
                            e.Handled = true; 
                        }
                        break; 

                    case Key.Subtract:
                        if (this.CanExpandOnInput && this.IsExpanded)
                        { 
                        	this.SetCurrentValueInternal(TreeViewItem.IsExpandedProperty, false);
                            e.Handled = true; 
                        } 
                        break;
 
                    case Key.Left:
                    case Key.Right:
                        if (this.LogicalLeft(e.Key))
                        { 
                            if (!this.IsControlKeyDown && this.CanExpandOnInput && this.IsExpanded)
                            { 
                                if (this.IsFocused) 
                                {
                                	this.SetCurrentValueInternal(TreeViewItem.IsExpandedProperty, false); 
                                }
                                else
                                {
                                	this.Focus(); 
                                }
                                e.Handled = true; 
                            } 
                        }
                        else 
                        {
                            if (!this.IsControlKeyDown && this.CanExpandOnInput)
                            {
                                if (!this.IsExpanded) 
                                {
                                	this.SetCurrentValueInternal(TreeViewItem.IsExpandedProperty, true); 
                                    e.Handled = true; 
                                }
                                else if (this.HandleDownKey(e)) 
                                {
                                    e.Handled = true;
                                }
                            } 
                        }
                        break; 
 
                    case Key.Down:
                        if (!this.IsControlKeyDown && this.HandleDownKey(e)) 
                        {
                            e.Handled = true;
                        }
                        break; 

                    case Key.Up: 
                        if (!this.IsControlKeyDown && this.HandleUpKey(e)) 
                        {
                            e.Handled = true; 
                        }
                        break;
                }
            } 
        },
 
//        private bool 
        LogicalLeft:function(/*Key*/ key) 
        {
            var invert = (this.FlowDirection == FlowDirection.RightToLeft); 
            return (!invert && (key == Key.Left)) || (invert && (key == Key.Right));
        },


//        internal bool 
        HandleUpKey:function(/*KeyEventArgs*/ e)
        {
            return this.HandleUpDownKey(true, e); 
        },
 
//        internal bool 
        HandleDownKey:function(/*KeyEventArgs*/ e) 
        {
            return this.HandleUpDownKey(false, e); 
        },

//        private bool 
        HandleUpDownKey:function(/*bool*/ up, /*KeyEventArgs*/ e)
        { 
            /*FocusNavigationDirection*/var direction = (up ? FocusNavigationDirection.Up : FocusNavigationDirection.Down);
            if (AllowHandleKeyEvent(direction)) 
            { 
                /*TreeView*/var treeView = this.ParentTreeView;
                /*IInputElement*/var originalFocus = Keyboard.FocusedElement; 
                if (treeView != null)
                {
                    /*FrameworkElement*/var startingContainer = this.HeaderElement;
                    if (startingContainer == null) 
                    {
                        startingContainer = this; 
                    } 
                    /*ItemsControl*/var parentItemsControl = ItemsControl.ItemsControlFromItemContainer(this);
                    /*ItemInfo*/var startingInfo = (parentItemsControl != null) 
                        ? parentItemsControl.ItemInfoFromContainer(this)
                        : null;

                    return treeView.NavigateByLine( 
                        startingInfo,
                        startingContainer, 
                        direction, 
                        new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                } 
            }

            return false; // Not handled
        },

//        private bool 
        AllowHandleKeyEvent:function(/*FocusNavigationDirection*/ direction) 
        { 
            if (!this.IsSelected)
            { 
                return false;
            }

            /*DependencyObject*/
            var currentFocus = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null; 
            if (currentFocus != null && UIElementHelper.IsUIElementOrUIElement3D(currentFocus))
            { 
                /*DependencyObject*/var predict = UIElementHelper.PredictFocus(currentFocus, direction); 
                if (predict != currentFocus)
                { 
                    while (predict != null)
                    {
                        /*TreeViewItem*/var item = predict instanceof TreeViewItem ? predict : null;
                        if (item == this) 
                        {
                            return false; // There is a focusable item in the header 
                        } 
                        else if ((item != null) || (predict instanceof TreeView))
                        { 
                            return true;
                        }

                        predict = VisualTreeHelper.GetParent(predict); 
                    }
                } 
            } 

            return true; 
        },

//        private static void 
        OnMouseButtonDown:function(/*object*/ sender, /*MouseButtonEventArgs*/ e)
        { 
            /*TreeView*/var tv = tvi.ParentTreeView; 
            if (tv != null) 
            {
                tv.HandleMouseButtonDown(); 
            }
        },
//        private static void 
        OnRequestBringIntoView:function(/*object*/ sender, /*RequestBringIntoViewEventArgs*/ e)
        { 
            if (e.TargetObject == sender)
            { 
            	sender.HandleBringIntoView(e); 
            }
        },

//        private void 
        HandleBringIntoView:function(/*RequestBringIntoViewEventArgs*/ e)
        {
            /*TreeViewItem*/var parent = this.ParentTreeViewItem; 
            while (parent != null)
            { 
                if (!parent.IsExpanded) 
                {
                    parent.SetCurrentValueInternal(TreeViewItem.IsExpandedProperty, true); 
                }

                parent = parent.ParentTreeViewItem;
            } 

            // See FrameworkElement.BringIntoView() comments 
            //dmitryt, bug 1126518. On new/updated elements RenderSize isn't yet computed 
            //so we need to postpone the rect computation until layout is done.
            //this is accomplished by passing Empty rect here and then asking for RenderSize 
            //in IScrollInfo when it actually executes an async MakeVisible command.
            if (e.TargetRect.IsEmpty)
            {
                /*FrameworkElement*/var header = this.HeaderElement; 
                if (header != null)
                { 
                    e.Handled = true; 
                    header.BringIntoView();
                } 
                else
                {
                    // Header is not generated yet. Could happen if BringIntoView is called on container before layout. Try later.
                    Dispatcher.BeginInvoke(DispatcherPriority.Loaded, new DispatcherOperationCallback(BringItemIntoView), null); 
                }
            } 
        }, 

//        private object 
        BringItemIntoView:function(/*object*/ args) 
        {
            /*FrameworkElement*/var header = this.HeaderElement;
            if (header != null)
            { 
                header.BringIntoView();
            } 
            return null; 
        },
 
        // returns the HeaderElement, or an approximation.   If no acceptable 
        // candidate is found, return the TreeViewItem itself.
//        internal FrameworkElement 
        TryGetHeaderElement:function()
        {
            // return HeaderElement, if available 
            /*FrameworkElement*/var header = this.HeaderElement;
            if (header != null) 
                return header; 

            // if there's no template yet, return the fallback 
            /*FrameworkTemplate*/var template = this.TemplateInternal;
            if (template == null)
                return this;
 
            // if the template doesn't define the header part, we do something
            // special for compat with 4.0 (see Dev11 369907) 
            var index = StyleHelper.QueryChildIndexFromChildName(HeaderPartName, template.ChildIndexFromChildName); 
            if (index < 0)
            { 
                // In 4.0 keyboard navigation worked even when a custom
                // template failed to define the header part.  We make this work
                // by returning an element from the template that looks like it
                // was intended to be the header.  The heuristic we use is: 
                // pick the element following the ToggleButton
                /*ToggleButton*/var toggleButton = Helper.FindTemplatedDescendant/*<ToggleButton>*/(this, this, ToggleButton.Type); 
                if (toggleButton != null) 
                {
                    /*FrameworkElement*/var parent = VisualTreeHelper.GetParent(toggleButton);
                    parent = parent instanceof FrameworkElement ? parent : null; 
                    if (parent != null)
                    {
                        var count = VisualTreeHelper.GetChildrenCount(parent);
                        for (index=0; index < count-1; ++index) 
                        {
                            if (VisualTreeHelper.GetChild(parent, index) == toggleButton) 
                            { 
                                header = VisualTreeHelper.GetChild(parent, index+1);
                                header = header instanceof FrameworkElement ? header : null;
                                if (header != null) 
                                    return header;
                                break;
                            }
                        } 
                    }
                } 
            } 

            // in all other cases, return the fallback 
            return this;
        },

        /// <summary>
        ///     Returns true if the item is or should be its own container. 
        /// </summary>
        /// <param name="item">The item to test.</param>
        /// <returns>true if its type matches the container type.</returns>
//        protected override bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item) 
        {
            return item instanceof TreeViewItem; 
        },

        /// <summary> 
        ///     Create or identify the element used to display the given item.
        /// </summary>
        /// <returns>The container.</returns>
//        protected override DependencyObject 
        GetContainerForItemOverride:function() 
        {
            return new TreeViewItem(); 
        }, 

//        internal void 
        PrepareItemContainer:function(/*object*/ item, /*ItemsControl*/ parentItemsControl) 
        {
            //
            // Clear previously cached items sizes
            // 
//            Helper.ClearVirtualizingElement(this);
// 
//            TreeViewItem.IsVirtualizingPropagationHelper(parentItemsControl, this); 

            // 
            // ItemValueStorage:  restore saved values for this item onto the new container
            //
            if (VirtualizingPanel.GetIsVirtualizing(parentItemsControl))
            { 
                Helper.SetItemValuesOnContainer(parentItemsControl, this, item);
            } 
        }, 

//        internal void 
        ClearItemContainer:function(/*object*/ item, /*ItemsControl*/ parentItemsControl) 
        {
            if (VirtualizingPanel.GetIsVirtualizing(parentItemsControl))
            {
                // 
                // ItemValueStorage:  save off values for this container if we're a virtualizing TreeView.
                // 
 
                //
                // Right now we have a hard-coded list of DPs we want to save off.  In the future we could provide a 'register' API 
                // so that each ItemsControl could decide what DPs to save on its containers. Maybe we define a virtual method to
                // retrieve a list of DPs the type is interested in.  Alternatively we could have the contract
                // be that ItemsControls use the ItemStorageService inside their ClearContainerForItemOverride by calling into StoreItemValues.
                // 
                Helper.StoreItemValues(parentItemsControl, this, item);
 
                // Tell the panel to clear off all its containers.  This will cause this method to be called 
                // recursively down the tree, allowing all descendent data to be stored before we save off
                // the ItemValueStorage DP for this container. 

                /*VirtualizingPanel*/var vp = this.ItemsHost instanceof VirtualizingPanel ? this.ItemsHost : null;
                if (vp != null)
                { 
                    vp.OnClearChildrenInternal();
                } 
 
                ItemContainerGenerator.RemoveAllInternal(true /*saveRecycleQueue*/);
            } 

            // this container is going away - forget about its selection
            // (Dev11 13828)
            this.ContainsSelection = false; 
        },

        /// <summary> 
        ///     This method is invoked when the Items property changes.
        /// </summary> 
//        protected override void 
        OnItemsChanged:function(/*NotifyCollectionChangedEventArgs*/ e) 
        {
            switch (e.Action) 
            {
                case NotifyCollectionChangedAction.Remove:
                case NotifyCollectionChangedAction.Reset:
                    if (this.ContainsSelection) 
                    {
                        /*TreeView*/var tree = this.ParentTreeView; 
                        if ((tree != null) && !tree.IsSelectedContainerHookedUp) 
                        {
                            this.ContainsSelection = false; 
                            this.Select(true);
                        }
                    }
                    break; 

                case NotifyCollectionChangedAction.Replace: 
                    if (this.ContainsSelection) 
                    {
                        var tree = this.ParentTreeView; 
                        if (tree != null)
                        {
                            // When Selected item is replaced - remove the selection
                            // Revisit the condition when we support duplicate items in Items collection: if e.OldItems[0] is the same as selected items we will unselect the selected item 
                            var selectedItem = tree.SelectedItem;
                            if ((selectedItem != null) && selectedItem.Equals(e.OldItems[0])) 
                            { 
                                tree.ChangeSelection(selectedItem, tree.SelectedContainer, false);
                            } 
                        }
                    }
                    break;
 
                case NotifyCollectionChangedAction.Add:
                case NotifyCollectionChangedAction.Move: 
                    break; 

                default: 
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action));
            }
        },
 
//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions) 
        {
            // Handle the Common states 
            if (!this.IsEnabled) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateDisabled, VisualStates.StateNormal); 
            }
            else if (this.IsMouseOver)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateMouseOver, VisualStates.StateNormal); 
            }
            else 
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateNormal);
            } 

            // Handle the Focused states
            if (this.IsKeyboardFocused)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateFocused, VisualStates.StateUnfocused);
            } 
            else 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateUnfocused); 
            }

            // Handle the Expansion states
            if (this.IsExpanded) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateExpanded); 
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateCollapsed);
            }

            // Handle the HasItems states 
            if (this.HasItems)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateHasItems); 
            }
            else 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateNoItems);
            }
 
            // Handle the Selected states
            if (this.IsSelected) 
            { 
                if (this.IsSelectionActive)
                { 
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateSelected);
                }
                else
                { 
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateSelectedInactive, VisualStates.StateSelected);
                } 
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateUnselected);
            }

            HeaderedItemsControl.prototype.ChangeVisualState.call(this, useTransitions); 
        }
	});
	
	Object.defineProperties(TreeViewItem.prototype,{

        /// <summary> 
        ///     Specifies whether this item has expanded its children or not.
        /// </summary> 
//        public bool 
        IsExpanded: 
        {
            get:function() { return this.GetValue(TreeViewItem.IsExpandedProperty); }, 
            set:function(value) { this.SetValue(TreeViewItem.IsExpandedProperty, value); }
        },

//        private bool 
        CanExpand: 
        {
            get:function() { return this.HasItems; } 
        }, 

        /// <summary> 
        ///     Specifies whether this item is selected or not.
        /// </summary> 
//        public bool 
        IsSelected: 
        {
            get:function() { return this.GetValue(TreeViewItem.IsSelectedProperty); }, 
            set:function(value) { this.SetValue(TreeViewItem.IsSelectedProperty, value); }
        },
        /// <summary> 
        ///     Indicates whether the keyboard focus is within the TreeView.
        ///     When keyboard focus moves to a Menu or Toolbar, then the selection remains active. 
        ///     Use this property to style the TreeViewItem to look different when focus is not within the TreeView.
        /// </summary>
//        public bool 
        IsSelectionActive: 
        {
            get:function() 
            { 
                return this.GetValue(TreeViewItem.IsSelectionActiveProperty);
            } 
        },
 
//        HierarchicalVirtualizationConstraints IHierarchicalVirtualizationAndScrollInfo.
        Constraints: 
        {
            get:function() { return GroupItem.HierarchicalVirtualizationConstraintsField.GetValue(this); }, 
            set:function(value)
            {
                if (value.CacheLengthUnit == VirtualizationCacheLengthUnit.Page)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.PageCacheSizeNotAllowed));
                } 
                GroupItem.HierarchicalVirtualizationConstraintsField.SetValue(this, value); 
            }
        }, 

//        HierarchicalVirtualizationHeaderDesiredSizes IHierarchicalVirtualizationAndScrollInfo.
        HeaderDesiredSizes:
        {
            get:function() 
            {
                /*FrameworkElement*/var headerElement = this.HeaderElement; 
                /*Size*/var pixelHeaderSize = this.IsVisible && headerElement != null ? headerElement.DesiredSize : new Size(); 

                Helper.ApplyCorrectionFactorToPixelHeaderSize(ParentTreeView, this, this.ItemsHost, /*ref*/ pixelHeaderSize); 

                /*Size*/var logicalHeaderSize = new Size(DoubleUtil.GreaterThan(pixelHeaderSize.Width, 0) ? 1 : 0,
                                DoubleUtil.GreaterThan(pixelHeaderSize.Height, 0) ? 1 : 0);
 
                return new HierarchicalVirtualizationHeaderDesiredSizes(logicalHeaderSize, pixelHeaderSize);
            } 
        }, 

//        HierarchicalVirtualizationItemDesiredSizes IHierarchicalVirtualizationAndScrollInfo.
        ItemDesiredSizes: 
        {
            get:function()
            {
                return Helper.ApplyCorrectionFactorToItemDesiredSizes(this, this.ItemsHost); 
            }, 
            set:function(value)
            { 
                GroupItem.HierarchicalVirtualizationItemDesiredSizesField.SetValue(this, value);
            } 
        },

////        Panel IHierarchicalVirtualizationAndScrollInfo.
//        ItemsHost:
//        { 
//            get:function()
//            { 
//                return this.ItemsHost; 
//            }
//        }, 

//        bool IHierarchicalVirtualizationAndScrollInfo.
        MustDisableVirtualization:
        {
            get:function() { return GroupItem.MustDisableVirtualizationField.GetValue(this); }, 
            set:function(value) { GroupItem.MustDisableVirtualizationField.SetValue(this, value); }
        }, 
 
//        bool IHierarchicalVirtualizationAndScrollInfo.
        InBackgroundLayout:
        { 
            get:function() { return GroupItem.InBackgroundLayoutField.GetValue(this); }, 
            set:function(value) { GroupItem.InBackgroundLayoutField.SetValue(this, value); }
        },

        /// <summary>
        ///     Walks up the parent chain of TreeViewItems to the top TreeView.
        /// </summary> 
//        internal TreeView 
        ParentTreeView:
        { 
            get:function() 
            {
                var parent = this.ParentItemsControl; 
                while (parent != null)
                {
                    var tv = parent instanceof TreeView ? parent : null;
                    if (tv != null) 
                    {
                        return tv; 
                    } 

                    parent = ItemsControl.ItemsControlFromItemContainer(parent); 
                }

                return null;
            } 
        },
 
        /// <summary> 
        ///     Returns the immediate parent TreeViewItem. Null if the parent is a TreeView.
        /// </summary> 
//        internal TreeViewItem 
        ParentTreeViewItem:
        {
            get:function()
            { 
                return this.ParentItemsControl instanceof TreeViewItem ? this.ParentItemsControl : null;
            } 
        },

        /// <summary> 
        ///     Returns the immediate parent ItemsControl.
        /// </summary>
//        internal ItemsControl 
        ParentItemsControl:
        { 
            get:function()
            { 
                return ItemsControl.ItemsControlFromItemContainer(this); 
            }
        }, 

 
//        private bool 
        ContainsSelection: 
        {
            get:function() { return this.ReadControlFlag(ControlBoolFlags.ContainsSelection); }, 
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.ContainsSelection, value); }
        },

//        private bool 
        CanExpandOnInput:
        { 
            get:function()
            { 
                return this.CanExpand && this.IsEnabled; 
            }
        }, 
 
//        internal FrameworkElement 
        HeaderElement:
        {
            get:function()
            { 
                var r = this.GetTemplateChild(HeaderPartName);
                return r = r instanceof FrameworkElement ? r : null;
            } 
        },

//        private ItemsPresenter 
        ItemsHostPresenter: 
        {
            get:function() 
            { 
                var r = this.GetTemplateChild(ItemsHostPartName);
                return r = r instanceof ItemsPresenter ? r : null;
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
	
	Object.defineProperties(TreeViewItem,{
	       /// <summary> 
        ///     The DependencyProperty for the <see cref="IsExpanded"/> property.
        ///     Default Value: false
        /// </summary>
//        public static readonly DependencyProperty 
        IsExpandedProperty:
        {
        	get:function(){
        		if(TreeViewItem._IsExpandedProperty === undefined){
        			TreeViewItem._IsExpandedProperty = 
        	            DependencyProperty.Register(
        	                    "IsExpanded", 
        	                    Boolean.Type, 
        	                    TreeViewItem.Type,
        	                    /*new FrameworkPropertyMetadata( 
        	                            false,
        	                            new PropertyChangedCallback(null, OnIsExpandedChanged))*/
        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
        	                            false,
        	                            new PropertyChangedCallback(null, OnIsExpandedChanged)));
        		}
        		
        		return TreeViewItem._IsExpandedProperty;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the <see cref="IsSelected"/> property. 
        ///     Default Value: false
        /// </summary>
//        public static readonly DependencyProperty 
        IsSelectedProperty:
        {
        	get:function(){
        		if(TreeViewItem._IsSelectedProperty === undefined){
        			TreeViewItem._IsSelectedProperty =
        	            DependencyProperty.Register( 
        	                    "IsSelected",
        	                    Boolean.Type, 
        	                    TreeViewItem.Type, 
        	                    /*new FrameworkPropertyMetadata(
        	                            false, 
        	                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
        	                            new PropertyChangedCallback(null, OnIsSelectedChanged))*/
        	                    FrameworkPropertyMetadata.Build3PCCB(
        	                            false, 
        	                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
        	                            new PropertyChangedCallback(null, OnIsSelectedChanged)));
        		}
        		
        		return TreeViewItem._IsSelectedProperty;
        	}
        }, 

        /// <summary>
        ///     DependencyProperty for <see cref="IsSelectionActive" />.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsSelectionActiveProperty:
        {
        	get:function(){
        		if(TreeViewItem._IsSelectionActiveProperty === undefined){
        			TreeViewItem._IsSelectionActiveProperty = Selector.IsSelectionActiveProperty.AddOwner(TreeViewItem.Type);
        		}
        		
        		return TreeViewItem._IsSelectionActiveProperty;
        	}
        }, 
 
          /// <summary> 
        ///     Event fired when <see cref="IsExpanded"/> becomes true.
        /// </summary> 
//        public static readonly RoutedEvent 
        ExpandedEvent:
        {
        	get:function(){
        		if(TreeViewItem._ExpandedEvent === undefined){
        			TreeViewItem._ExpandedEvent = EventManager.RegisterRoutedEvent("Expanded", 
        					RoutingStrategy.Bubble, 
        					RoutedEventHandler.Type, 
        					TreeViewItem.Type);
        		}
        		
        		return TreeViewItem._ExpandedEvent;
        	}
        }, 

        /// <summary>
        ///     Event fired when <see cref="IsExpanded"/> becomes false. 
        /// </summary>
//        public static readonly RoutedEvent 
        CollapsedEvent:
        {
        	get:function(){
        		if(TreeViewItem._CollapsedEvent === undefined){
        			TreeViewItem._CollapsedEvent = EventManager.RegisterRoutedEvent("Collapsed", 
        					RoutingStrategy.Bubble, 
        					RoutedEventHandler.Type, 
        					TreeViewItem.Type);
        		}
        		
        		return TreeViewItem._CollapsedEvent;
        	}
        },  
 
        /// <summary>
        ///     Event fired when <see cref="IsSelected"/> becomes true. 
        /// </summary>
//        public static readonly RoutedEvent 
        SelectedEvent:
        {
        	get:function(){
        		if(TreeViewItem._SelectedEvent === undefined){
        			TreeViewItem._SelectedEvent = EventManager.RegisterRoutedEvent("Selected", 
        					RoutingStrategy.Bubble, 
        					RoutedEventHandler.Type, 
        					TreeViewItem.Type);
        		}
        		
        		return TreeViewItem._SelectedEvent;
        	}
        }, 

        /// <summary> 
        ///     Event fired when <see cref="IsSelected"/> becomes false.
        /// </summary> 
//        public static readonly RoutedEvent 
        UnselectedEvent:
        {
        	get:function(){
        		if(TreeViewItem._UnselectedEvent === undefined){
        			TreeViewItem._UnselectedEvent = EventManager.RegisterRoutedEvent("Unselected", 
        	        		RoutingStrategy.Bubble, 
        	        		RoutedEventHandler.Type, 
        	        		TreeViewItem.Type); 
        		}
        		
        		return TreeViewItem._UnselectedEvent;
        	}
        }, 
        
//        private static bool 
        IsControlKeyDown: 
        {
            get:function() 
            { 
                return ((Keyboard.Modifiers & ModifierKeys.Control) == (ModifierKeys.Control));
            } 
        }
   
	});
	
//    private static void 
    function OnIsExpandedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var isExpanded = e.NewValue;

        /*TreeView*/var tv = d.ParentTreeView;
        if (tv != null) 
        { 
            if (!isExpanded)
            { 
                tv.HandleSelectionAndCollapsed(d);
            }
        }

        /*ItemsPresenter*/var itemsHostPresenter = d.ItemsHostPresenter;
        if (itemsHostPresenter != null) 
        { 
            // In case a TreeViewItem that wasn't previously expanded is now
            // recycled to represent an entity that is expanded or viceversa, we 
            // face a situation where we need to synchronously remeasure the
            // sub tree through the ItemsPresenter leading up to the ItemsHost
            // panel. If we didnt do this the offsets could get skewed.
            d.InvalidateMeasure(); 
            Helper.InvalidateMeasureOnPath(itemsHostPresenter, d, false /*duringMeasure*/);
        } 

        if (isExpanded)
        { 
            d.OnExpanded(new RoutedEventArgs(TreeViewItem.ExpandedEvent, d)); 
        }
        else 
        {
            d.OnCollapsed(new RoutedEventArgs(TreeViewItem.CollapsedEvent, d));
        }

        d.UpdateVisualState();
    } 

//    private static void 
    function OnIsSelectedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var isSelected =  e.NewValue; 

        d.Select(isSelected); 

        if (isSelected)
        { 
            d.OnSelected(new RoutedEventArgs(TreeViewItem.SelectedEvent, d));
        }
        else
        { 
            d.OnUnselected(new RoutedEventArgs(TreeViewItem.UnselectedEvent, d));
        } 

        d.UpdateVisualState();
    } 


//    private static void 
    function OnMouseButtonDown(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
        /*TreeView*/var tv = sender.ParentTreeView; 
        if (tv != null) 
        {
            tv.HandleMouseButtonDown(); 
        }
    }
//    private static void 
    function OnRequestBringIntoView(/*object*/ sender, /*RequestBringIntoViewEventArgs*/ e)
    { 
        if (e.TargetObject == sender)
        { 
            sender.HandleBringIntoView(e); 
        }
    } 

    // Synchronizes the value of the child's IsVirtualizing property with that of the parent's 
//    internal static void 
    TreeViewItem.IsVirtualizingPropagationHelper = function(/*DependencyObject*/ parent, /*DependencyObject*/ element)
    { 
        this.SynchronizeValue(VirtualizingPanel.IsVirtualizingProperty, parent, element);
        this.SynchronizeValue(VirtualizingPanel.IsVirtualizingWhenGroupingProperty, parent, element);
        this.SynchronizeValue(VirtualizingPanel.VirtualizationModeProperty, parent, element);
        this.SynchronizeValue(VirtualizingPanel.ScrollUnitProperty, parent, element); 
    };

//    internal static void 
    TreeViewItem.SynchronizeValue = function(/*DependencyProperty*/ dp, /*DependencyObject*/ parent, /*DependencyObject*/ child) 
    {
        var value = parent.GetValue(dp); 
        child.SetValue(dp, value);
    };

//  static TreeViewItem() 
	function Initialize()
    { 
		_dType = DependencyObjectType.FromSystemTypeInternal(TreeViewItem.Type);
		
		FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(TreeViewItem.Type, 
				/*new FrameworkPropertyMetadata(TreeViewItem.Type)*/
				FrameworkPropertyMetadata.BuildWithDV(TreeViewItem.Type));
//        VirtualizingPanel.IsVirtualizingProperty.OverrideMetadata(TreeViewItem.Type, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); 

        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(TreeViewItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Continue)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Continue));
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(TreeViewItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.None)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.None)); 
        Control.IsTabStopProperty.OverrideMetadata(TreeViewItem.Type, 
        		/*new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));

        UIElement.IsMouseOverPropertyKey.OverrideMetadata(TreeViewItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
        UIElement.IsEnabledProperty.OverrideMetadata(TreeViewItem.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        Selector.IsSelectionActivePropertyKey.OverrideMetadata(TreeViewItem.Type, 
        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged))*/
        		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 

        EventManager.RegisterClassHandler(TreeViewItem.Type, FrameworkElement.RequestBringIntoViewEvent, 
        		new RequestBringIntoViewEventHandler(null, OnRequestBringIntoView));
        EventManager.RegisterClassHandler(TreeViewItem.Type, Mouse.MouseDownEvent, 
        		new MouseButtonEventHandler(null, OnMouseButtonDown), true);
//        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(TreeViewItem.Type, new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip)); 
    };
	
	TreeViewItem.Type = new Type("TreeViewItem", TreeViewItem, [HeaderedItemsControl.Type, IHierarchicalVirtualizationAndScrollInfo.Type]);
	Initialize();
	
	return TreeViewItem;
});
//    /// <summary>
//    ///     A child of a <see cref="TreeView" />. 
//    /// </summary> 
//    [TemplatePart(Name = HeaderPartName, Type = typeof(FrameworkElement))]
//    [TemplatePart(Name = ItemsHostPartName, Type = typeof(ItemsPresenter))] 
//    [StyleTypedProperty(Property = "ItemContainerStyle", StyleTargetType = TreeViewItem.Type)]
//    public class TreeViewItem : HeaderedItemsControl, IHierarchicalVirtualizationAndScrollInfo
//    {


 
 



