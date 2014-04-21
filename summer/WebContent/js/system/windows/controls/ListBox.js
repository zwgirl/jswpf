/**
 * ListBox
 */

define(["dojo/_base/declare", "system/Type", "primitives/Selector", "controls/Separator", "controls/SelectionMode",
        "input/ModifierKeys", "input/Keyboard", "controls/ItemsPanelTemplate", "input/RoutedUICommand",
        "controls/ItemsControl", "controls/ItemNavigateArgs"], 
		function(declare, Type, Selector, Separator, SelectionMode,
				ModifierKeys, Keyboard, ItemsPanelTemplate, RoutedUICommand,
				ItemsControl, ItemNavigateArgs){
	var ListBox = declare("ListBox", Selector,{
		constructor:function(){
            this.Initialize1(); 
//            private ItemInfo 
            this._anchorItem = null;
            
	        this._dom = window.document.createElement("div");
	        this._dom._source = this;
//	        this._dom.style.height = "300px"; 
//	        this._dom.style.overflowY = "scroll"; 
//	        this._dom.style.overflowX = "auto";
	        this._dom.style.border= "1px solid";
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
        // common code for all constructors 
//        private void 
        Initialize1:function()
        { 
            var mode = ListBox.SelectionModeProperty.GetDefaultValue(this.DependencyObjectType);
            this.ValidateSelectionMode(mode);
        },
        
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint)
        { 
//        	this._dom = this.VisualParent._dom;

        	ItemsControl.prototype.MeasureOverride.call(this, constraint);
        },
 

//        protected override Size 
        ArrangeOverride:function()
        { 
          	if(this.ArrangeDirty){
         		this.ArrangeDirty = false;
//         		if(this._parentDom !== parent){
//         			if(this._parentDom){ this._parentDom.removeChild(this._dom); }
//         			parent.appendChild(this._dom);
//         			this._parentDom = parent;
//         		}
//            	this._dom = parent;
            	ItemsControl.prototype.ArrangeOverride.call(this, this._dom);
        	}

        },

        /// <summary>
        ///     Select all the items
        /// </summary> 
//        public void 
        SelectAll:function()
        { 
            if (this.CanSelectMultiple) 
            {
            	this.SelectAllImpl(); 
            }
            else
            {
                throw new NotSupportedException(SR.Get(SRID.ListBoxSelectAllSelectionMode)); 
            }
        }, 
 
        /// <summary>
        ///     Clears all of the selected items. 
        /// </summary>
//        public void 
        UnselectAll:function()
        {
        	this.UnselectAllImpl(); 
        },
 
        /// <summary> 
        /// Causes the object to scroll into view.  If it is not visible, it is aligned either at the top or bottom of the viewport.
        /// </summary> 
        /// <param name="item"></param>
//        public void 
        ScrollIntoView:function(/*object*/ item)
        {
            if (this.ItemContainerGenerator.Status == GeneratorStatus.ContainersGenerated) 
            {
            	this.OnBringItemIntoView(item); 
            } 
            else
            { 
                // The items aren't generated, try at a later time
                Dispatcher.BeginInvoke(DispatcherPriority.Loaded, new DispatcherOperationCallback(OnBringItemIntoView), item);
            }
        }, 

//        private void 
        ValidateSelectionMode:function(/*SelectionMode*/ mode) 
        {
        	this.CanSelectMultiple = (mode != SelectionMode.Single); 
        }, 

        /// <summary>
        /// Select multiple items. 
        /// </summary>
        /// <param name="selectedItems">Collection of items to be selected.</param>
        /// <returns>true if all items have been selected.</returns>
//        protected bool 
        SetSelectedItems:function(/*IEnumerable*/ selectedItems) 
        {
            return this.SetSelectedItemsImpl(selectedItems); 
        }, 

        /// <summary> 
        /// Prepare the element to display the item.  This may involve
        /// applying styles, setting bindings, etc.
        /// </summary>
//        protected override void 
        PrepareContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item) 
        {
            Selector.prototype.PrepareContainerForItemOverride.call(this, element, item); 
 
            if (item instanceof Separator)
                Separator.PrepareContainer(element instanceof Control ? element : null); 
        },

        /// <summary>
        ///     Adjust ItemInfos when the Items property changes. 
        /// </summary>
//        internal override void 
        AdjustItemInfoOverride:function(/*NotifyCollectionChangedEventArgs*/ e) 
        { 
            this.AdjustItemInfo(e, this._anchorItem);
            Selector.prototype.AdjustItemInfoOverride.call(this, e); 
        },

        /// <summary>
        ///     Adjust ItemInfos when the generator finishes. 
        /// </summary>
//        internal override void 
        AdjustItemInfosAfterGeneratorChangeOverride:function() 
        { 
        	this.AdjustItemInfoAfterGeneratorChange(this._anchorItem);
        	Selector.prototype.AdjustItemInfosAfterGeneratorChangeOverride.call(this); 
        },

        /// <summary> 
        /// A virtual function that is called when the selection is changed. Default behavior
        /// is to raise a SelectionChangedEvent 
        /// </summary> 
        /// <param name="e">The inputs for this event. Can be raised (default behavior) or processed
        ///   in some other way.</param> 
//        protected override void 
        OnSelectionChanged:function(/*SelectionChangedEventArgs*/ e)
        {
        	Selector.prototype.OnSelectionChanged.call(this, e);
 
            // In a single selection mode we want to move anchor to the selected element
            if (this.SelectionMode == SelectionMode.Single) 
            { 
                /*ItemInfo*/var info = this.InternalSelectedInfo;
                /*ListBoxItem*/var listItem = (info != null) ? (info.Container instanceof ListBoxItem ? info.Container : null) : null; 

                if (listItem != null)
                    this.UpdateAnchorAndActionItem(info);
            } 

        }, 
 
        /// <summary>
        ///     This is the method that responds to the KeyDown event. 
        /// </summary>
        /// <param name="e">Event Arguments</param>
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
            var handled = true;
            /*Key*/var key = e.Key; 
            switch (key) 
            {
                case Key.Divide: 
                case Key.Oem2:
                    // Ctrl-Fowardslash = Select All
                    if (((Keyboard.Modifiers & ModifierKeys.Control) == (ModifierKeys.Control)) && (SelectionMode == SelectionMode.Extended))
                    { 
                    	this.SelectAll();
                    } 
                    else 
                    {
                        handled = false; 
                    }

                    break;
 
                case Key.Oem5:
                    // Ctrl-Backslash = Select the item with focus. 
                    if (((Keyboard.Modifiers & ModifierKeys.Control) == (ModifierKeys.Control)) && (SelectionMode == SelectionMode.Extended)) 
                    {
                        /*ListBoxItem*/var focusedItemUI = (FocusedInfo != null) ? 
                        		(FocusedInfo.Container instanceof ListBoxItem ? FocusedInfo.Container : null) : null; 
                        if (focusedItemUI != null)
                        {
                            this.MakeSingleSelection(focusedItemUI);
                        } 
                    }
                    else 
                    { 
                        handled = false;
                    } 

                    break;

                case Key.Up: 
                case Key.Left:
                case Key.Down: 
                case Key.Right: 
                    {
                        KeyboardNavigation.ShowFocusVisual(); 

                        // Depend on logical orientation we decide to move focus or just scroll
                        // shouldScroll also detects if we can scroll more in this direction
                        var shouldScroll = this.ScrollHost != null; 
                        if (shouldScroll)
                        { 
                            shouldScroll = 
                                ((key == Key.Down && this.IsLogicalHorizontal && DoubleUtil.GreaterThan(this.ScrollHost.ScrollableHeight, this.ScrollHost.VerticalOffset))) ||
                                ((key == Key.Up   && this.IsLogicalHorizontal && DoubleUtil.GreaterThan(this.ScrollHost.VerticalOffset, 0))) || 
                                ((key == Key.Right&& this.IsLogicalVertical && DoubleUtil.GreaterThan(this.ScrollHost.ScrollableWidth, this.ScrollHost.HorizontalOffset))) ||
                                ((key == Key.Left && this.IsLogicalVertical && DoubleUtil.GreaterThan(this.ScrollHost.HorizontalOffset, 0)));
                        }
 
                        if (shouldScroll)
                        { 
                        	this.ScrollHost.ScrollInDirection(e); 
                        }
                        else 
                        {
                            if ((this.ItemsHost != null && this.ItemsHost.IsKeyboardFocusWithin) || this.IsKeyboardFocused)
                            {
                                if (!this.NavigateByLine(KeyboardNavigation.KeyToTraversalDirection(key), 
                                        new ItemNavigateArgs(e.Device, Keyboard.Modifiers)))
                                { 
                                    handled = false; 
                                }
                            } 
                            else
                            {
                                handled = false;
                            } 
                        }
                    } 
                    break; 

                case Key.Home: 
                    this.NavigateToStart(new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                    break;

                case Key.End: 
                	this.NavigateToEnd(new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                    break; 
 
                case Key.Space:
                case Key.Enter: 
                    {
                        if (e.Key == Key.Enter && this.GetValue(KeyboardNavigation.AcceptsReturnProperty) == false)
                        {
                            handled = false; 
                            break;
                        } 
 
                        // If the event came from a ListBoxItem that's a child of ours, then look at it.
                        var source = e.OriginalSource instanceof ListBoxItem ? e.OriginalSource : null; 

                        // If ALT is down & Ctrl is up, then we shouldn't handle this. (system menu)
                        if ((Keyboard.Modifiers & (ModifierKeys.Control|ModifierKeys.Alt)) == ModifierKeys.Alt)
                        { 
                            handled = false;
                            break; 
                        } 

                        // If the user hits just "space" while text searching, do not handle the event 
                        // Note: Space cannot be the first character in a string sent to ITS.
                        if (this.IsTextSearchEnabled && Keyboard.Modifiers == ModifierKeys.None)
                        {
                            /*TextSearch*/var instance = TextSearch.EnsureInstance(this); 
                            // If TextSearch enabled and Prefix is not empty
                            // then let this SPACE go so ITS can process it. 
                            if (instance != null && (instance.GetCurrentPrefix() != String.Empty)) 
                            {
                                handled = false; 
                                break;
                            }
                        }
 
                        if (source != null && ItemsControl.ItemsControlFromItemContainer(source) == this)
                        { 
                            switch (this.SelectionMode) 
                            {
                                case SelectionMode.Single: 
                                    if ((Keyboard.Modifiers & ModifierKeys.Control) == ModifierKeys.Control)
                                    {
                                        this.MakeToggleSelection(source);
                                    } 
                                    else
                                    { 
                                    	this.MakeSingleSelection(source); 
                                    }
 
                                    break;

                                case SelectionMode.Multiple:
                                	this.MakeToggleSelection(source); 
                                    break;
 
                                case SelectionMode.Extended: 
                                    if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Shift)) == ModifierKeys.Control)
                                    { 
                                        // Only CONTROL
                                    	this.MakeToggleSelection(source);
                                    }
                                    else if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Shift)) == ModifierKeys.Shift) 
                                    {
                                        // Only SHIFT 
                                    	this.MakeAnchorSelection(source, true /* clearCurrent */); 
                                    }
                                    else if ((Keyboard.Modifiers & ModifierKeys.Shift) == 0) 
                                    {
                                    	this.MakeSingleSelection(source);
                                    }
                                    else 
                                    {
                                        handled = false; 
                                    } 

                                    break; 
                            }
                        }
                        else
                        { 
                            handled = false;
                        } 
                    } 
                    break;
 
                case Key.PageUp:
                    NavigateByPage(FocusNavigationDirection.Up, new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                    break;
 
                case Key.PageDown:
                    NavigateByPage(FocusNavigationDirection.Down, new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                    break; 

                default: 
                    handled = false;
                    break;
            }
            if (handled) 
            {
                e.Handled = true; 
            } 
            else
            { 
                Selector.prototype.OnKeyDown.call(this, e);
            }

        },

        /// <summary> 
        ///     An event reporting a mouse move. 
        /// </summary>
//        protected override void 
        OnMouseMove:function(/*MouseEventArgs*/ e) 
        {
            // If we get a mouse move and we have capture, then the mouse was
            // outside the ListBox.  We should autoscroll.
            if (e.OriginalSource == this && Mouse.Captured == this) 
            {
                if (Mouse.LeftButton == MouseButtonState.Pressed) 
                { 
                	this.DoAutoScroll();
                } 
                else
                {
                    // We missed the mouse up, release capture
                	this.ReleaseMouseCapture(); 
                	this.ResetLastMousePosition();
                } 
            } 

            Selector.prototype.OnMouseMove.call(this, e); 
        },
 
        /// <summary>
        /// Called when IsMouseCaptured changes on this element. 
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnIsMouseCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            // When we take capture, we should start a timer to call
            // us back and do auto scrolling behavior. 
            if (this.IsMouseCaptured) 
            {
//                Debug.Assert(_autoScrollTimer == null, "IsMouseCaptured went from true to true"); 
                if (this._autoScrollTimer == null)
                {
                	this._autoScrollTimer = new DispatcherTimer(DispatcherPriority.SystemIdle);
                	this._autoScrollTimer.Interval = AutoScrollTimeout; 
                	this._autoScrollTimer.Tick += new EventHandler(OnAutoScrollTimeout);
                	this._autoScrollTimer.Start(); 
                } 
            }
            else 
            {
                if (this._autoScrollTimer != null)
                {
                	this._autoScrollTimer.Stop(); 
                	this._autoScrollTimer = null;
                } 
            } 

            Selector.prototype.OnIsMouseCapturedChanged.call(this, e); 
        },


 
        /// <summary>
        /// Return true if the item is (or is eligible to be) its own ItemContainer 
        /// </summary> 
//        protected override bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item)
        { 
            return (item instanceof ListBoxItem);
        },

        /// <summary> Create or identify the element used to display the given item. </summary> 
//        protected override DependencyObject 
        GetContainerForItemOverride:function()
        { 
            return new ListBoxItem(); 
        },
 
//        internal void 
        NotifyListItemClicked:function(/*ListBoxItem*/ item, /*MouseButton*/ mouseButton)
        { 
            // When a ListBoxItem is left clicked, we should take capture 
            // so we can auto scroll through the list.
            if (mouseButton == MouseButton.Left && Mouse.Captured != this) 
            {
                Mouse.Capture(this, CaptureMode.SubTree);
                this.SetInitialMousePosition(); // Start tracking mouse movement
            } 

            switch (this.SelectionMode) 
            { 
                case SelectionMode.Single:
                    { 
                        if (!item.IsSelected)
                        {
                            item.SetCurrentValueInternal(Selector.IsSelectedProperty, true);
                        } 
                        else if ((Keyboard.Modifiers & ModifierKeys.Control) == ModifierKeys.Control)
                        { 
                            item.SetCurrentValueInternal(Selector.IsSelectedProperty, false); 
                        }
 
                        this.UpdateAnchorAndActionItem(this.ItemInfoFromContainer(item));
                    }
                    break;
 
                case SelectionMode.Multiple:
                	this.MakeToggleSelection(item); 
                    break; 

                case SelectionMode.Extended: 
                    // Extended selection works only with Left mouse button
                    if (mouseButton == MouseButton.Left)
                    {
                        if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Shift)) == (ModifierKeys.Control | ModifierKeys.Shift)) 
                        {
                        	this.MakeAnchorSelection(item, false); 
                        } 
                        else if ((Keyboard.Modifiers & ModifierKeys.Control) == ModifierKeys.Control)
                        { 
                        	this.MakeToggleSelection(item);
                        }
                        else if ((Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift)
                        { 
                        	this.MakeAnchorSelection(item, true);
                        } 
                        else 
                        {
                        	this.MakeSingleSelection(item); 
                        }
                    }
                    else if (mouseButton == MouseButton.Right) // Right mouse button
                    { 
                        // Shift or Control combination should not trigger any action
                        // If only Right mouse button is pressed we should move the anchor 
                        // and select the item only if element under the mouse is not selected 
                        if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Shift)) == 0)
                        { 
                            if (item.IsSelected)
                            	this.UpdateAnchorAndActionItem(this.ItemInfoFromContainer(item));
                            else
                            	this.MakeSingleSelection(item); 
                        }
                    } 
 
                    break;
            } 
        },

//        internal void 
        NotifyListItemMouseDragged:function(/*ListBoxItem*/ listItem)
        { 
            if ((Mouse.Captured == this) && DidMouseMove())
            { 
            	this.NavigateToItem(this.ItemInfoFromContainer(listItem), new ItemNavigateArgs(Mouse.PrimaryDevice, Keyboard.Modifiers)); 
            }
        }, 

//        private void 
        UpdateAnchorAndActionItem:function(/*ItemInfo*/ info)
        {
            var item = info.Item; 
            var listItem = info.Container instanceof ListBoxItem ? info.Container : null;
 
            if (item == DependencyProperty.UnsetValue) 
            {
                this.AnchorItemInternal = null; 
                this.LastActionItem = null;
            }
            else
            { 
            	this.AnchorItemInternal = info;
            	this.LastActionItem = listItem; 
            } 
            KeyboardNavigation.SetTabOnceActiveElement(this, listItem);
        }, 

//        private void 
        MakeSingleSelection:function(/*ListBoxItem*/ listItem)
        {
            if (ItemsControl.ItemsControlFromItemContainer(listItem) == this) 
            {
                /*ItemInfo*/var info = this.ItemInfoFromContainer(listItem); 
 
                this.SelectionChange.SelectJustThisItem(info, true /* assumeInItemsCollection */);
 
                listItem.Focus();

                this.UpdateAnchorAndActionItem(info);
            } 
        },
 
//        private void 
        MakeToggleSelection:function(/*ListBoxItem*/ item) 
        {
            var select = !item.IsSelected; 

            item.SetCurrentValueInternal(Selector.IsSelectedProperty, select);

            this.UpdateAnchorAndActionItem(this.ItemInfoFromContainer(item)); 
        },
 
//        private void 
        MakeAnchorSelection:function(/*ListBoxItem*/ actionItem, /*bool*/ clearCurrent) 
        {
            /*ItemInfo*/var anchorInfo = this.AnchorItemInternal; 

            if (anchorInfo == null)
            {
                if (this._selectedItems.Count > 0) 
                {
                    // If we haven't set the anchor, then just use the last selected item 
                	this.AnchorItemInternal = this._selectedItems.Get(this._selectedItems.Count - 1); 
                }
                else 
                {
                    // There was nothing selected, so take the first child element
                	this.AnchorItemInternal = this.NewItemInfo(Items[0], null, 0);
                } 

                if ((anchorInfo = this.AnchorItemInternal) == null) 
                { 
                    // Can't do anything
                    return; 
                }
            }

            // Find the indexes of the elements 
            var start, end;
 
            start = this.ElementIndex(actionItem); 
            end = this.AnchorItemInternal.Index;
 
            // Ensure start is before end
            if (start > end)
            {
                var index = start; 

                start = end; 
                end = index; 
            }
 
            var beganSelectionChange = false;
            if (!this.SelectionChange.IsActive)
            {
                beganSelectionChange = true; 
                this.SelectionChange.Begin();
            } 
            try 
            {
 
                if (clearCurrent)
                {
                    // Unselect items not within the selection range
                    for (var index = 0; index < this._selectedItems.Count; index++) 
                    {
                        /*ItemInfo*/var info = this._selectedItems.Get(index); 
                        var itemIndex = info.Index; 

                        if ((itemIndex < start) || (end < itemIndex)) 
                        {
                        	this.SelectionChange.Unselect(info);
                        }
                    } 
                }
 
                // Select the children in the selection range 
                var enumerator = this.Items.GetEnumerator();
                for (var index = 0; index <= end; index++) 
                {
                    enumerator.MoveNext();
                    if (index >= start)
                    { 
                    	this.SelectionChange.Select(this.NewItemInfo(enumerator.Current, null, index), true /* assumeInItemsCollection */);
                    } 
                } 

                var d = enumerator instanceof IDisposable ? enumerator : null; 
                if (d != null)
                {
                    d.Dispose();
                } 

            } 
            finally 
            {
                if (beganSelectionChange) 
                {
                    this.SelectionChange.End();
                }
            } 

            this.LastActionItem = actionItem; 
//            GC.KeepAlive(anchorInfo); 
        },
 
//        private void 
        MakeKeyboardSelection:function(/*ListBoxItem*/ item)
        {
            if (item == null)
            { 
                return;
            } 
 
            switch (this.SelectionMode)
            { 
                case SelectionMode.Single:
                    // Navigating when control is down shouldn't select the item
                    if ((Keyboard.Modifiers & ModifierKeys.Control) == 0)
                    { 
                    	this.MakeSingleSelection(item);
                    } 
                    break; 

                case SelectionMode.Multiple: 
                	this.UpdateAnchorAndActionItem(ItemInfoFromContainer(item));
                    break;

                case SelectionMode.Extended: 
                    if ((Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift)
                    { 
                        var clearCurrentSelection = (Keyboard.Modifiers & ModifierKeys.Control) == 0; 
                        this.MakeAnchorSelection(item, clearCurrentSelection);
                    } 
                    else if ((Keyboard.Modifiers & ModifierKeys.Control) == 0)
                    {
                    	this.MakeSingleSelection(item);
                    } 

                    break; 
            } 
        },
 
//        private int 
        ElementIndex:function(/*ListBoxItem*/ listItem)
        {
            return this.ItemContainerGenerator.IndexFromContainer(listItem);
        }, 

//        private ListBoxItem 
        ElementAt:function(/*int*/ index) 
        { 
            var r =  this.ItemContainerGenerator.ContainerFromIndex(index);
            return r instanceof ListBoxItem ? r : null;
        }, 

//        private object 
        GetWeakReferenceTarget:function(/*ref WeakReference*/ weakReference)
        {
            if (weakReference != null) 
            {
                return weakReference.Target; 
            } 

            return null; 
        },

//        private void 
        OnAutoScrollTimeout:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            if (Mouse.LeftButton == MouseButtonState.Pressed)
            { 
                this.DoAutoScroll(); 
            }
        }, 

        /// <summary>
        ///     Called when an item is being focused
        /// </summary> 
//        internal override bool 
        FocusItem:function(/*ItemInfo*/ info, /*ItemNavigateArgs*/ itemNavigateArgs)
        { 
            // Base will actually focus the item 
            var returnValue = Selector.prototype.FocusItem.call(this, info, itemNavigateArgs);
 
            var listItem = info.Container instanceof ListBoxItem ? info.Container : null;

            if (listItem != null)
            { 
                this.LastActionItem = listItem;
 
                // 
                this.MakeKeyboardSelection(listItem);
            } 
            return returnValue;
        }
	});
	
	Object.defineProperties(ListBox.prototype,{
        /// <summary>
        ///     Indicates the selection behavior for the ListBox.
        /// </summary> 
//        public SelectionMode 
        SelectionMode:
        { 
            get:function() { return this.GetValue(ListBox.SelectionModeProperty); }, 
            set:function(value) { this.SetValue(ListBox.SelectionModeProperty, value); }
        }, 
 
        /// <summary>
        /// The currently selected items. 
        /// </summary> 
//        public IList 
        SelectedItems: 
        {
            get:function()
            {
                return this.SelectedItemsImpl; 
            }
        }, 
 
        /// <summary>
        ///     If control has a scrollviewer in its style and has a custom keyboard scrolling behavior when HandlesScrolling should return true.
        /// Then ScrollViewer will not handle keyboard input and leave it up to the control.
        /// </summary> 
//        protected internal override bool 
        HandlesScrolling:
        { 
            get:function() 
            {
                return true; 
            }
        },
 
 
//        protected object 
        AnchorItem:
        { 
            get:function() { return this.AnchorItemInternal; }, 
            set:function(value)
            {
                if (value != null && value != DependencyProperty.UnsetValue)
                {
                    var info = this.NewItemInfo(value); 
                    var listBoxItem = info.Container instanceof ListBoxItem ? info.Container : null;
                    if (listBoxItem == null) 
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.ListBoxInvalidAnchorItem, value));
                    } 

                    this.AnchorItemInternal = info;
                    this.LastActionItem = listBoxItem;
                } 
                else
                { 
                	this.AnchorItemInternal = null; 
                	this.LastActionItem = null;
                } 
            }
        },

        /// <summary> 
        ///     "Anchor" of the selection.  In extended selection, it is the pivot/anchor of the extended selection.
        /// </summary> 
//        internal ItemInfo 
        AnchorItemInternal: 
        {
            get:function() { return this._anchorItem; }, 
            set:function(value) { this._anchorItem = (value != null) ? value.Clone() : null; }   // clone, so that adjustments to selection and anchor don't double-adjust
        },

        /// <summary> 
        ///     Last item to be acted upon -- and the element that has focus while selection is happening.
        ///     AnchorItemInternal != null implies LastActionItem != null. 
        /// </summary> 
//        internal ListBoxItem 
        LastActionItem:
        { 
            get:function()
            {
//                return GetWeakReferenceTarget(ref _lastActionItem) as ListBoxItem;
            	 return this._lastActionItem instanceof ListBoxItem ? this._lastActionItem : null;
            }, 
            set:function(value)
            { 
//            	this._lastActionItem = new WeakReference(value);
            	this._lastActionItem = value;
            }
        }, 

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return ListBox._dType; }
        }
	});
	
	Object.defineProperties(ListBox,{
		 
        /// <summary> 
        ///     SelectionMode DependencyProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectionModeProperty:
        {
        	get:function(){
        		if(ListBox._SelectionModeProperty === undefined){
        			ListBox._SelectionModeProperty =
                        DependencyProperty.Register(
                                "SelectionMode",
                                Number.Type, 
                                ListBox.Type,
                                /*new FrameworkPropertyMetadata( 
                                        SelectionMode.Single, 
                                        new PropertyChangedCallback(OnSelectionModeChanged)),
                                new ValidateValueCallback(IsValidSelectionMode)*/
                                FrameworkPropertyMetadata.Build3CVCB(SelectionMode.Single, 
                                        new PropertyChangedCallback(OnSelectionModeChanged)),
                                        new ValidateValueCallback(IsValidSelectionMode));  
        		}
        		
        		return ListBox._SelectionModeProperty;
        	}
        },

        /// <summary> 
        /// A read-only IList containing the currently selected items
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedItemsProperty:
        {
        	get:function(){
        		if(ListBox._SelectedItemsProperty === undefined){
        			ListBox._SelectedItemsProperty = Selector.SelectedItemsImplProperty;  
        		}
        		
        		return ListBox._SelectedItemsProperty;
        	}
        }, 
 
 
//        private static RoutedUICommand 
        SelectAllCommand:
        {
        	get:function(){
        		if(ListBox._SelectAllCommand === undefined){
        			ListBox._SelectAllCommand =
//        	            new RoutedUICommand(SR.Get(SRID.ListBoxSelectAllText), "SelectAll", ListBox.Type); 
        			RoutedUICommand.BuildSST("SelectAll", "SelectAll", ListBox.Type);
        		}
        		
        		return ListBox._SelectAllCommand;
        	}
        },
        
        _dType:
        {
        	get:function(){
        		if(ListBox.__dType === undefined){
        			ListBox.__dType = DependencyObjectType.FromSystemTypeInternal(ListBox.Type); 
        		}
        		
        		return ListBox.__dType;
        	}
        },
        
	});


//    private static void 
    function OnSelectionModeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        listBox.ValidateSelectionMode(d.SelectionMode);
    } 

//    private static object 
    function OnGetSelectionMode(/*DependencyObject*/ d)
    { 
        return d.SelectionMode;
    }


//    private static bool 
    function IsValidSelectionMode(/*object*/ o)
    { 
        return o == SelectionMode.Single
            || o == SelectionMode.Multiple 
            || o == SelectionMode.Extended;
    }


//    private static void 
    function OnMouseButtonUp(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
        if (e.ChangedButton == MouseButton.Left)
        { 
        	sender.ReleaseMouseCapture(); 
        	sender.ResetLastMousePosition();
        }
    }

//    private static void 
    function OnGotKeyboardFocus(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e)
    { 
        // Focus drives the selection when keyboardnavigation is used 
        if (!KeyboardNavigation.IsKeyboardMostRecentInputDevice())
            return;

        // Only in case focus moves from one ListBoxItem to another we want the selection to follow focus 
        var newListBoxItem = e.NewFocus instanceof ListBoxItem ? e.NewFocus : null;
        if (newListBoxItem != null && ItemsControl.ItemsControlFromItemContainer(newListBoxItem) == sender) 
        { 
            var oldFocus = e.OldFocus instanceof DependencyObject ? e.OldFocus : null;
            var visualOldFocus = oldFocus instanceof Visual ? oldFocus : null; 
            if (visualOldFocus == null)
            {
                var ce = oldFocus instanceof ContentElement ? oldFocus : null;
                if (ce != null) 
                    visualOldFocus = KeyboardNavigation.GetParentUIElementFromContentElement(ce);
            } 

            if ((visualOldFocus != null && sender.IsAncestorOf(visualOldFocus))
                || oldFocus == sender) 
            {
            	sender.LastActionItem = newListBoxItem;
            	sender.MakeKeyboardSelection(newListBoxItem);
            } 
        }
    } 


//    private static void 
    function OnQueryStatusSelectAll(/*object*/ target, /*CanExecuteRoutedEventArgs*/ args)
    { 
        if (target.SelectionMode == SelectionMode.Extended)
        { 
            args.CanExecute = true;
        }
    }

//    private static void 
    function OnSelectAll(/*object*/ target, /*ExecutedRoutedEventArgs*/ args)
    { 
        if (target.SelectionMode == SelectionMode.Extended)
        { 
        	target.SelectAll();
        }
    }

//  static ListBox()
    function Initialize()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ListBox.Type, new FrameworkPropertyMetadata(ListBox.Type)); 
        

        Control.IsTabStopProperty.OverrideMetadata(ListBox.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(ListBox.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained));
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(ListBox.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Once)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Once));

        ItemsControl.IsTextSearchEnabledProperty.OverrideMetadata(ListBox.Type, 
        		/*new FrameworkPropertyMetadata(true)*/
        		FrameworkPropertyMetadata.BuildWithDV(true));

        /*ItemsPanelTemplate*/
//        var template = new ItemsPanelTemplate(new FrameworkElementFactory(VirtualizingStackPanel.Type)); 
        var template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type)); 
        template.Seal();
        ItemsControl.ItemsPanelProperty.OverrideMetadata(ListBox.Type, /*new FrameworkPropertyMetadata(template)*/
        		FrameworkPropertyMetadata.BuildWithDV(template)); 

        // Need handled events too here because any mouse up should release our mouse capture
        EventManager.RegisterClassHandler(ListBox.Type, Mouse.MouseUpEvent, 
        		new MouseButtonEventHandler(null, OnMouseButtonUp), true);
        EventManager.RegisterClassHandler(ListBox.Type, Keyboard.GotKeyboardFocusEvent, 
        		new KeyboardFocusChangedEventHandler(null, OnGotKeyboardFocus)); 

//        CommandHelpers.RegisterCommandHandler(ListBox.Type, 
//        		ListBox.SelectAllCommand, new ExecutedRoutedEventHandler(null, OnSelectAll), 
//        		new CanExecuteRoutedEventHandler(null, OnQueryStatusSelectAll), 
//        		KeyGesture.CreateFromResourceStrings(SR.Get(SRID.ListBoxSelectAllKey), SR.Get(SRID.ListBoxSelectAllKeyDisplayString))); 

    };
	
	ListBox.Type = new Type("ListBox", ListBox, [Selector.Type]);
	Initialize();
	
	return ListBox;
});






