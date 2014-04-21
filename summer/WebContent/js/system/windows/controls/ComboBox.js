/**
 * ComboBox
 */

define(["dojo/_base/declare", "system/Type", "primitives/Selector", "specialized/BitVector32", "controls/TextChangedEventHandler"], 
		function(declare, Type, Selector, BitVector32, TextChangedEventHandler){
//    private const string 
	var EditableTextBoxTemplateName = "PART_EditableTextBox"; 
//    private const string 
	var PopupTemplateName = "PART_Popup";
	
//    private enum 
    var CacheBits = declare(null, {});
    CacheBits.IsMouseOverItemsHost        = 0x01;
    CacheBits.HasMouseEnteredItemsHost    = 0x02;
    CacheBits.IsContextMenuOpen           = 0x04; 
    CacheBits.UpdatingText                = 0x08;
    CacheBits.UpdatingSelectedItem        = 0x10; 
    
//    private static DependencyObjectType 
    var _dType = null; 
    
	var ComboBox = declare("ComboBox", Selector,{
		constructor:function(){
            this.Initialize1(); 
            
//            private TextBox 
            this._editableTextBoxSite = null;
//            private Popup 
            this._dropDownPopup = null;
//            private int 
            this._textBoxSelectionStart = 0; // the location of selection before call to TextUpdated.
//            private BitVector32 
            this._cacheValid = new BitVector32(0);   // Condense boolean bits 
//            private ItemInfo 
            this._highlightedInfo = null; // info about the ComboBoxItem which is "highlighted"
//            private DispatcherTimer 
            this._autoScrollTimer = null; 
//            private UIElement 
            this._clonedElement = null; 
//            private DispatcherOperation 
            this._updateTextBoxOperation = null;
            
	        this._dom = window.document.createElement("div");
	        this._dom.id = "ComboBox";
	        this._dom._source = this;
	        //this._dom.style.height = "300px"; 
	        //this._dom.style.overflowY = "auto"; 
	        //this._dom.style.overflowX = "auto";
	        //this._dom.style.border= "1px solid";
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
//      private void 
        Initialize1:function() 
        {
        	this.CanSelectMultiple = false;
        },
        
        /// <summary> 
        ///     DropDown Open event
        /// </summary> 
//        public event EventHandler 
//        DropDownOpened: 
//        {
        AddDropDownOpenedHandler:function(value) { this.EventHandlersStoreAdd(ComboBox.DropDownOpenedKey, value); }, 
        RemoveDropDownOpenedHandler:function(value) { this.EventHandlersStoreRemove(ComboBox.DropDownOpenedKey, value); },
//        },
        /// <summary>
        ///     DropDown Close event 
        /// </summary> 
//        public event EventHandler 
//        DropDownClosed:
//        { 
        AddDropDownClosedHandler:function() { this.EventHandlersStoreAdd(ComboBox.DropDownClosedKey, value); },
        RemoveDropDownClosedHandler:function() { this.EventHandlersStoreRemove(ComboBox.DropDownClosedKey, value); },
//        },
 
//        private void 
		RegisterToOpenOnLoad:function() 
        {
            this.AddLoadedHandler(new RoutedEventHandler(this, this.OpenOnLoad)); 
        },

//        private void 
		OpenOnLoad:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
            // Open combobox after it has rendered (Loaded is fired before 1st render)
//            Dispatcher.BeginInvoke(DispatcherPriority.Input, new DispatcherOperationCallback(/*delegate*/function(/*object*/ param) 
//            { 
                this.CoerceValue(ComboBox.IsDropDownOpenProperty);
 
//                return null;
//            }), null);
        },
 
        /// <summary>
        /// 
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
		OnDropDownOpened:function(/*EventArgs*/ e) 
        {
			this.RaiseClrEvent(ComboBox.DropDownOpenedKey, e);
        },
 
        /// <summary>
        /// 
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
		OnDropDownClosed:function(/*EventArgs*/ e) 
        {
			this.RaiseClrEvent(ComboBox.DropDownClosedKey, e);
        },
 
//        private void 
		OnPopupClosed:function(/*object*/ source, /*EventArgs*/ e)
        { 
			this.OnDropDownClosed(EventArgs.Empty); 
        },

        // Combo Box has several methods of input for selecting items
        //   * Selector.OnSelectionChanged
        //   * ComboBox.Text Changed
        //   * Editable Text Box changed 
        // When any one of these inputs change, the other two must be updated to reflect
        // the third. 
        // 
        // When Text changes, TextUpdated() tries searching (if TextSearch is enabled) for an
        //   item that exactly matches the new value of Text.  If it finds one, it sets 
        //   selected index to that item.  This will cause OnSelectionChanged to update
        //   the SelectionBoxItem.  Finally TextUpdated() updates the TextBox.
        //
        // When the TextBox text changes, TextUpdated() tries searching (if TextSearch is enabled) 
        //   for an item that partially matches the new value of Text.  If it finds one, it updates
        //   The textbox and selects the remaining portion of text.  Then it sets the selected index 
        //   which will cause OnSelectionChanged to update the SelectionBoxItem.  Finally 
        //   TextUpdated() updates ComboBox.Text property.
        // 
        // When Selection changes, SelectedItemUpdated() will update the ComboBox.Text property
        //   and then update the SelectionBoxItem or EditableTextBox.Text depending on edit mode
        //
 
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

            this.SelectedItemUpdated(); 
 
            if (this.IsDropDownOpen)
            { 
                /*ItemInfo*/var selectedInfo = this.InternalSelectedInfo;
                if (selectedInfo != null)
                {
                	this.NavigateToItem(selectedInfo, ItemNavigateArgs.Empty); 
                }
            } 
        },
 
        // When the selected item (or its content) changes, update
        // The SelectedItem property and the Text properties
        // ComboBoxItem also calls this method when its content changes
//        internal void 
		SelectedItemUpdated:function() 
        {
            try 
            { 
            	this.UpdatingSelectedItem = true;
 
                // If the selection changed as a result of Text or the TextBox
                // changing, don't update the Text property - TextUpdated() will
                if (!this.UpdatingText)
                { 
                    // Don't change the text in the TextBox unless there is an item selected.
                    var text = TextSearch.GetPrimaryTextFromItem(this, this.InternalSelectedItem); 
 
                    if (this.Text != text)
                    { 
                    	this.SetCurrentValueInternal(TextProperty, text);
                    }
                }
 
                // Update SelectionItem/TextBox
                this.Update(); 
            } 
            finally
            { 
            	this.UpdatingSelectedItem = false;
            }
        },

        // When the user types in the TextBox, search for an item that partially
        // matches the new text and set the selected index to that item 
//        private void 
		OnEditableTextBoxTextChanged:function(/*object*/ sender, /*TextChangedEventArgs*/ e)
        { 
//            Debug.Assert(_editableTextBoxSite == sender); 

            if (!this.IsEditable) 
            {
                // Don't do any work if we're not editable.
                return;
            } 

            this.TextUpdated(EditableTextBoxSite.Text, true); 
        }, 

        // When selection changes, save the location of the selection start 
        // (ignoring changes during compositions)
//        private void 
		OnEditableTextBoxSelectionChanged:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            if (!Helper.IsComposing(EditableTextBoxSite)) 
            {
            	this._textBoxSelectionStart = this.EditableTextBoxSite.SelectionStart; 
            } 
        },
 
        // If TextSearch is enabled search for an item matching the new text
        // (partial search if user is typing, exact search if setting Text)
//        private void 
		TextUpdated:function(/*string*/ newText, /*bool*/ textBoxUpdated)
        { 
            // Only process this event if it is coming from someone outside setting Text directly
            if (!this.UpdatingText && !this.UpdatingSelectedItem && !Helper.IsComposing(EditableTextBoxSite)) 
            { 
                try
                { 
                    // Set the updating flags so we don't reenter this function
                	this.UpdatingText = true;

                    // Try searching for an item matching the new text 
                    if (this.IsTextSearchEnabled)
                    { 
                        if (this._updateTextBoxOperation != null) 
                        {
                            // cancel any pending async update of the textbox 
                        	this._updateTextBoxOperation.Abort();
                        	this._updateTextBoxOperation = null;
                        }
 
                        var matchedIndex = TextSearch.FindMatchingPrefix(this, newText);
 
                        if (matchedIndex >= 0) 
                        {
                            // Allow partial matches when updating textbox 
                            if (textBoxUpdated)
                            {
                                var selectionStart = this.EditableTextBoxSite.SelectionStart;
                                // Perform type search when the selection is at the end 
                                // of the textbox and the selection start increased
                                if (selectionStart == newText.Length && 
                                    selectionStart > this._textBoxSelectionStart) 
                                {
                                    // Replace the currently typed text with the text 
                                    // from the matched item
                                    var matchedText = TextSearch.GetPrimaryTextFromItem(this, this.Items.Get(matchedIndex));

                                    if (this.ShouldPreserveUserEnteredPrefix) 
                                    {
                                        // Retain the user entered prefix in the matched text. 
                                        matchedText = String.Concat(newText, matchedText.Substring(newText.Length)); 
                                    }
 
                                    // If there's an IME, do the replacement asynchronously so that
                                    // it doesn't get confused with the IME's undo stack.
                                    /*MS.Internal.Documents.UndoManager*/var undoManager =
                                        EditableTextBoxSite.TextContainer.UndoManager; 
                                    if (undoManager != null &&
                                        undoManager.OpenedUnit != null && 
                                        undoManager.OpenedUnit.GetType() != typeof(TextParentUndoUnit)) 
                                    {
                                        _updateTextBoxOperation = Dispatcher.BeginInvoke(DispatcherPriority.Normal, 
                                            new DispatcherOperationCallback(UpdateTextBoxCallback),
                                            [matchedText, newText] );
                                    }
                                    else 
                                    {
                                        // when there's no IME, do it synchronously 
                                    	this.UpdateTextBox(matchedText, newText); 
                                    }
 

                                    // ComboBox's text property should be updated with the matched text
                                    newText = matchedText;
                                } 
                            }
                            else //Text Property Set 
                            { 
                                // Require exact matches when setting TextProperty
                                var matchedText = TextSearch.GetPrimaryTextFromItem(this, this.Items.Get(matchedIndex)); 
                                if (!String.Equals(newText, matchedText, StringComparison.CurrentCulture))
                                {
                                    // Strings not identical, no match
                                    matchedIndex = -1; 
                                }
                            } 
                        } 

                        // Update SelectedIndex if it changed 
                        if (matchedIndex != this.SelectedIndex)
                        {
                            // OnSelectionChanged will update the SelectedItem
                            this.SetCurrentValueInternal(SelectedIndexProperty, matchedIndex); 
                        }
                    } 
 
                    // Update TextProperty when TextBox changes and TextBox when TextProperty changes
                    if (textBoxUpdated) 
                    {
                    	this.SetCurrentValueInternal(TextProperty, newText);
                    }
                    else if (this.EditableTextBoxSite != null) 
                    {
                    	this.EditableTextBoxSite.Text = newText; 
                    } 
                }
                finally 
                {
                    // Clear the updating flag
                	this.UpdatingText = false;
                } 
            }
        }, 
 
//        object 
		UpdateTextBoxCallback:function(/*object*/ arg)
        { 
			this._updateTextBoxOperation = null;

            /*object[]*/var args = arg;
            var matchedText = args[0]; 
            var newText = args[1];
 
            try 
            {
            	this.UpdatingText = true; 
            	this.UpdateTextBox(matchedText, newText);
            }
            finally
            { 
            	this.UpdatingText = false;
            } 
 
            return null;
        }, 

//        void 
		UpdateTextBox:function(/*string*/ matchedText, /*string*/ newText)
        {
            // Replace the TextBox's text with the matched text and 
            // select the text beyond what the user typed
			this.EditableTextBoxSite.Text = matchedText; 
			this.EditableTextBoxSite.SelectionStart = newText.Length; 
			this.EditableTextBoxSite.SelectionLength = matchedText.Length - newText.Length;
        }, 

        // Updates:
        //    SelectionBox if not editable
        //    EditableTextBox.Text if editable 
//        private void 
        Update:function()
        { 
            if (this.IsEditable) 
            {
            	this.UpdateEditableTextBox(); 
            }
            else
            {
            	this.UpdateSelectionBoxItem(); 
            }
        }, 
 
        // Update the editable TextBox to match combobox text
//        private void 
        UpdateEditableTextBox:function() 
        {
            if (!this.UpdatingText)
            {
                try 
                {
                	this.UpdatingText = true; 
 
                    var text = Text;
 
                    // Copy ComboBox.Text to the editable TextBox
                    if (this.EditableTextBoxSite != null && this.EditableTextBoxSite.Text != text)
                    {
                    	this.EditableTextBoxSite.Text = text; 
                    	this.EditableTextBoxSite.SelectAll();
                    } 
                } 
                finally
                { 
                	this.UpdatingText = false;
                }
            }
        }, 

        /// <summary> 
        /// This function updates the selected item in the "selection box". 
        /// This is called when selection changes or when the combobox
        /// switches from editable to non-editable or vice versa. 
        /// This will also get called in ApplyTemplate in case selection
        /// is set prior to the control being measured.
        /// </summary>
//        private void 
        UpdateSelectionBoxItem:function() 
        {
            // propagate the new selected item to the SelectionBoxItem property; 
            // this displays it in the selection box 
            var item = this.InternalSelectedItem;
            /*DataTemplate*/var itemTemplate = this.ItemTemplate; 
            var stringFormat = this.ItemStringFormat;

            // if Items contains an explicit ContentControl, use its content instead
            // (this handles the case of ComboBoxItem) 
            /*ContentControl*/var contentControl = item instanceof ContentControl ? item : null;
 
            if (contentControl != null) 
            {
                item = contentControl.Content; 
                itemTemplate = contentControl.ContentTemplate;
                stringFormat = contentControl.ContentStringFormat;
            }
 
            if (this._clonedElement != null)
            { 
            	this._clonedElement.LayoutUpdated -= CloneLayoutUpdated; 
            	this._clonedElement = null;
            } 

            if (itemTemplate == null && this.ItemTemplateSelector == null && stringFormat == null)
            {
                // if the item is a logical element it cannot be displayed directly in 
                // the selection box because it already belongs to the tree (in the dropdown box).
                // Instead, try to extract some useful text from the visual. 
                /*DependencyObject*/var logicalElement = item instanceof DependencyObject ? item : null; 

                if (logicalElement != null) 
                {
                    // If the item is a UIElement, create a copy using a visual brush
                	this._clonedElement = logicalElement instanceof UIElement ? logicalElement : null;
 
                    if (this._clonedElement != null)
                    { 
                        // Create visual copy of selected element 
                        /*VisualBrush*/var visualBrush = new VisualBrush(this._clonedElement);
                        visualBrush.Stretch = Stretch.None; 

                        //Set position and dimension of content
                        visualBrush.ViewboxUnits = BrushMappingMode.Absolute;
                        visualBrush.Viewbox = new Rect(this._clonedElement.RenderSize); 

                        //Set position and dimension of tile 
                        visualBrush.ViewportUnits = BrushMappingMode.Absolute; 
                        visualBrush.Viewport = new Rect(this._clonedElement.RenderSize);
 
                        // We need to check if the item acquires a mirror transform through the visual tree
                        // below the ComboBox. If it does then the same mirror transform needs to be applied
                        // to the VisualBrush so that the item shows identically with the selection box as it does
                        // within the dropdown. Eg. 
                        // ComboBox - LTR
                        //      |                \ 
                        //      |          ComboBoxItem-RTL 
                        //      |                /
                        // TextBlock (item) - LTR 
                        // This TextBlock (item) will need to be mirrored through the VisualBrush, to appear the
                        // same as it does through the ComboBoxItem's mirror transform.
                        //
                        /*DependencyObject*/
                        var parent = VisualTreeHelper.GetParent(this._clonedElement); 
                        /*FlowDirection*/
                        var parentFD = parent == null ? FlowDirection.LeftToRight : parent.GetValue(FlowDirectionProperty);
                        if (this.FlowDirection != parentFD) 
                        { 
                            visualBrush.Transform = new MatrixTransform(new Matrix(-1.0, 0.0, 0.0, 1.0, _clonedElement.RenderSize.Width, 0.0));
                        } 

                        // Apply visual brush to a rectangle
                        /*Rectangle*/var rect = new Rectangle();
                        rect.Fill = visualBrush; 
                        rect.Width = this._clonedElement.RenderSize.Width;
                        rect.Height = this._clonedElement.RenderSize.Height; 
 
                        this._clonedElement.LayoutUpdated += CloneLayoutUpdated;
 
                        item = rect;
                        itemTemplate = null;
                    }
                    else 
                    {
                        item = this.ExtractString(logicalElement); 
                        itemTemplate = ContentPresenter.StringContentTemplate; 
                    }
                } 
            }

            // display a null item by an empty string
            if (item == null) 
            {
                item = String.Empty; 
                itemTemplate = ContentPresenter.StringContentTemplate; 
            }
 
            this.SelectionBoxItem = item;
            this.SelectionBoxItemTemplate = itemTemplate;
            this.SelectionBoxItemStringFormat = stringFormat;
        }, 

        // Update our clone's size to match the actual object's size 
//        private void 
        CloneLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            /*Rectangle*/var rect = this.SelectionBoxItem; 
            rect.Width = this._clonedElement.RenderSize.Width;
            rect.Height = this._clonedElement.RenderSize.Height;

            /*VisualBrush*/var visualBrush = rect.Fill; 
            visualBrush.Viewbox = new Rect(this._clonedElement.RenderSize);
            visualBrush.Viewport = new Rect(this._clonedElement.RenderSize); 
        }, 

        /// <summary> 
        /// Change to the correct visual state.
        /// </summary> 
        /// <param name="useTransitions"> 
        /// true to use transitions when updating the visual state, false to snap directly to the new visual state.
        /// </param> 
//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        {
            // Common States Group
            if (!this.IsEnabled) 
            {
                VisualStateManager.GoToState(this, VisualStates.StateDisabled, useTransitions); 
            } 
            else if (this.IsMouseOver)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions);
            }
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions);
            } 
 
            // Focus States Group
            if (!Selector.GetIsSelectionActive(this)) 
            {
                VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions);
            }
            else if (this.IsDropDownOpen) 
            {
                VisualStateManager.GoToState(this, VisualStates.StateFocusedDropDown, useTransitions); 
            } 
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateFocused, useTransitions);
            }

            // Edit States Group 
            if (this.IsEditable)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateEditable, useTransitions); 
            }
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateUneditable, useTransitions);
            }
 
            Selector.prototype.ChangeVisualState.call(this, useTransitions);
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
            this.AdjustItemInfo(e, this._highlightedInfo); 
            Selector.prototype.AdjustItemInfoOverride.call(this, e);
        }, 

        /// <summary>
        ///     Called when an item is being focused
        /// </summary>
//        internal override bool 
        FocusItem:function(/*ItemInfo*/ info, /*ItemNavigateArgs*/ itemNavigateArgs) 
        {
            var returnValue = false; 
            // The base implementation sets focus, and we don't want to do that 
            // if we're editable.
            if (!this.IsEditable) 
            {
                returnValue = Selector.prototype.FocusItem.call(this, info, itemNavigateArgs);
            }
 
            /*ComboBoxItem*/var cbi = info.Container instanceof ComboBoxItem ? info.Container : null;
            this.HighlightedInfo = (cbi != null) ? info : null; 
 
            // When IsEditable is 'true', we'll always want to commit the selection. e.g. when user press KeyUp/Down.
            // However, when IsEditable is 'false' and Dropdown is open, we could get here when user navigate to 
            // the item using ITS. In this case, we don't want to commit the selection.
            if ((this.IsEditable || (!this.IsDropDownOpen)) && itemNavigateArgs.DeviceUsed instanceof KeyboardDevice)
            {
                var index = info.Index; 

                if (index < 0) 
                { 
                    index = this.Items.IndexOf(info.Item);
                } 

                this.SetCurrentValueInternal(ComboBox.SelectedIndexProperty, index);

                returnValue = true; 
            }
            return returnValue; 
        }, 

 
        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed.
        /// </summary>
//        protected override void
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        {
        	Selector.prototype.OnIsKeyboardFocusWithinChanged.call(this, e); 
 
            // This is for the case when focus goes elsewhere and the popup is still open; make sure it is closed.
            if (this.IsDropDownOpen && !this.IsKeyboardFocusWithin) 
            {
                // IsKeyboardFocusWithin still flickers under certain conditions.  The case
                // we care about is focus going from the ComboBox to a ComboBoxItem.
                // Here we can just check if something has focus and if it's a child 
                // of ours or is a context menu that opened below us.
                /*DependencyObject*/var currentFocus = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null; 
                if (currentFocus == null || (!this.IsContextMenuOpen && ItemsControl.ItemsControlFromItemContainer(currentFocus) != this)) 
                {
                	this.Close(); 
                }
            }

            this.CoerceValue(ComboBox.IsSelectionBoxHighlightedProperty); 
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

        // Helper function called by ComboBoxItem when it receives a MouseDown
//        internal void 
        NotifyComboBoxItemMouseDown:function(/*ComboBoxItem*/ comboBoxItem)
        { 
        },
 
        // Helper function called by ComboBoxItem when it receives a MouseUp 
//        internal void 
        NotifyComboBoxItemMouseUp:function(/*ComboBoxItem*/ comboBoxItem)
        { 
            var item = ItemContainerGenerator.ItemFromContainer(comboBoxItem);
            if (item != null)
            {
                SelectionChange.SelectJustThisItem(this.NewItemInfo(item, comboBoxItem), true /* assumeInItemsCollection */); 
            }
 
            this.Close(); 
        },
 
        // Called when Item is entered via mouse or keyboard focus
//        internal void
        NotifyComboBoxItemEnter:function(/*ComboBoxItem*/ item)
        {
            // When a ComboBoxItem is entered, it should be highlighted (and focused). 
            // Note: We may reach this before a nested combo box can grab capture
            //       if one of its items releases capture.  In this case, ignore the 
            //       enter event 
            if (this.IsDropDownOpen && Mouse.Captured == this && this.DidMouseMove())
            { 
                this.HighlightedInfo = this.ItemInfoFromContainer(item);
                if (!this.IsEditable && !item.IsKeyboardFocusWithin)
                {
                    item.Focus(); 
                }
            } 
        }, 

        /// <summary> 
        /// Return true if the item is (or is eligible to be) its own ItemUI
        /// </summary>
//        protected override bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item)
        { 
            return (item instanceof ComboBoxItem);
        }, 
 
        /// <summary> Create or identify the element used to display the given item. </summary>
//        protected override DependencyObject 
        GetContainerForItemOverride:function() 
        {
            return new ComboBoxItem();
        },

        /// <summary>
        ///     An event reporting a key was pressed 
        /// </summary> 
//        protected override void 
        OnPreviewKeyDown:function(/*KeyEventArgs*/ e)
        { 
            // Only process preview key events if they going to our editable text box
            if (this.IsEditable && e.OriginalSource == this.EditableTextBoxSite)
            {
            	this.KeyDownHandler(e); 
            }
        }, 
 
        /// <summary>
        ///     An event reporting a key was pressed 
        /// </summary>
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        {
        	this.KeyDownHandler(e); 
        },
 
//        private void 
        KeyDownHandler:function(/*KeyEventArgs*/ e) 
        {
            var handled = false; 
            var key = e.Key;

            // We want to handle Alt key. Get the real key if it is Key.System.
            if (key == Key.System) 
            {
                key = e.SystemKey; 
            } 

            // In Right to Left mode we switch Right and Left keys 
            var isRTL = (this.FlowDirection == FlowDirection.RightToLeft);

            switch (key)
            { 
                case Key.Up:
                    handled = true; 
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) == ModifierKeys.Alt) 
                    {
                    	this.KeyboardToggleDropDown(true /* commitSelection */); 
                    }
                    else
                    {
                        // When the drop down isn't open then focus is on the ComboBox 
                        // and we can't use KeyboardNavigation.
                        if (this.IsItemsHostVisible) 
                        { 
                        	this.NavigateByLine(HighlightedInfo, FocusNavigationDirection.Up, new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                        } 
                        else
                        {
                        	this.SelectPrev();
                        } 
                    }
 
                    break; 

                case Key.Down: 
                    handled = true;
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) == ModifierKeys.Alt)
                    {
                    	this.KeyboardToggleDropDown(true /* commitSelection */); 
                    }
                    else 
                    { 
                        if (this.IsItemsHostVisible)
                        { 
                        	this.NavigateByLine(this.HighlightedInfo, FocusNavigationDirection.Down, new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                        }
                        else
                        { 
                        	this.SelectNext();
                        } 
                    } 

                    break; 

                case Key.F4:
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) == 0)
                    { 
                    	this.KeyboardToggleDropDown(true /* commitSelection */);
                        handled = true; 
                    } 
                    break;
 
                case Key.Escape:
                    if (this.IsDropDownOpen)
                    {
                    	this.KeyboardCloseDropDown(false /* commitSelection */); 
                        handled = true;
                    } 
                    break; 

                case Key.Enter: 
                    if (this.IsDropDownOpen)
                    {
                    	this.KeyboardCloseDropDown(true /* commitSelection */);
                        handled = true; 
                    }
                    break; 
 
                case Key.Home:
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) != ModifierKeys.Alt && !IsEditable) 
                    {
                        if (this.IsItemsHostVisible)
                        {
                        	this.NavigateToStart(new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                        }
                        else 
                        { 
                        	this.SelectFirst();
                        } 
                        handled = true;
                    }
                    break;
 
                case Key.End:
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) != ModifierKeys.Alt && !IsEditable) 
                    { 
                        if (this.IsItemsHostVisible)
                        { 
                        	this.NavigateToEnd(new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                        }
                        else
                        { 
                        	this.SelectLast();
                        } 
                        handled = true; 
                    }
                    break; 

                case Key.Right:
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) != ModifierKeys.Alt && !IsEditable)
                    { 
                        if (this.IsItemsHostVisible)
                        { 
                        	this.NavigateByLine(this.HighlightedInfo, FocusNavigationDirection.Right, new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                        }
                        else 
                        {
                            if (!isRTL)
                            {
                            	this.SelectNext(); 
                            }
                            else 
                            { 
                                // If it's RTL then Right should go backwards
                                SelectPrev(); 
                            }
                        }
                        handled = true;
                    } 
                    break;
 
                case Key.Left: 
                    if ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) != ModifierKeys.Alt && !IsEditable)
                    { 
                        if (this.IsItemsHostVisible)
                        {
                        	this.NavigateByLine(this.HighlightedInfo, FocusNavigationDirection.Left, new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                        } 
                        else
                        { 
                            if (!isRTL) 
                            {
                            	this.SelectPrev(); 
                            }
                            else
                            {
                                // If it's RTL then Left should go the other direction 
                            	this.SelectNext();
                            } 
                        } 
                        handled = true;
                    } 
                    break;

                case Key.PageUp:
                    if (this.IsItemsHostVisible) 
                    {
                    	this.NavigateByPage(this.HighlightedInfo, FocusNavigationDirection.Up, new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                        handled = true; 
                    }
                    break; 

                case Key.PageDown:
                    if (this.IsItemsHostVisible)
                    { 
                    	this.NavigateByPage(this.HighlightedInfo, FocusNavigationDirection.Down, new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                        handled = true; 
                    } 
                    break;
 
                case Key.Oem5:
                    if (Keyboard.Modifiers == ModifierKeys.Control)
                    {
                        // If Control is pressed (without Alt, Shift or Windows being pressed) 
                        // Scroll into view the selected item -- we want to highlight the item
                        // that we scroll in, so we should navigate to it. 
                    	this.NavigateToItem(InternalSelectedInfo, ItemNavigateArgs.Empty); 
                        handled = true;
                    } 
                    break;

                default:
                    handled = false; 
                    break;
            } 
            if (handled) 
            {
                e.Handled = true; 
            }
        },

//        private void 
        SelectPrev:function() 
        {
            if (!this.Items.IsEmpty) 
            { 
                var selectedIndex = this.InternalSelectedIndex;
 
                // Search backwards from SelectedIndex - 1 but don't start before the beginning.
                // If SelectedIndex is less than 0, there is nothing to select before this item.
                if (selectedIndex > 0)
                { 
                    this.SelectItemHelper(selectedIndex - 1, -1, -1);
                } 
            } 
        },
 
//        private void 
        SelectNext:function()
        {
            var count = this.Items.Count;
            if (count > 0) 
            {
                var selectedIndex = this.InternalSelectedIndex; 
 
                // Search forwards from SelectedIndex + 1 but don't start past the end.
                // If SelectedIndex is before the last item then there is potentially 
                // something afterwards that we could select.
                if (selectedIndex < count - 1)
                {
                	this.SelectItemHelper(selectedIndex + 1, +1, count); 
                }
            } 
        }, 

//        private void 
        SelectFirst:function() 
        {
        	this.SelectItemHelper(0, +1, this.Items.Count);
        },
 
//        private void 
        SelectLast:function()
        { 
        	this.SelectItemHelper(this.Items.Count - 1, -1, -1); 
        },
 
        // Walk in the specified direction until we get to a selectable
        // item or to the stopIndex.
        // NOTE: stopIndex is not inclusive (it should be one past the end of the range)
//        private void 
        SelectItemHelper:function(/*int*/ startIndex, /*int*/ increment, /*int*/ stopIndex) 
        {
//            Debug.Assert((increment > 0 && startIndex <= stopIndex) || (increment < 0 && startIndex >= stopIndex), "Infinite loop detected"); 
 
            for (var i = startIndex; i != stopIndex; i += increment)
            { 
                // If the item is selectable and the wrapper is selectable, select it.
                // Need to check both because the user could set any combination of
                // IsSelectable and IsEnabled on the item and wrapper.
                var item = this.Items[i]; 
                /*DependencyObject*/var container = this.ItemContainerGenerator.ContainerFromIndex(i);
                if (this.IsSelectableHelper(item) && this.IsSelectableHelper(container)) 
                { 

                    this.SelectionChange.SelectJustThisItem(this.NewItemInfo(item, container, i), true /* assumeInItemsCollection */); 
                    break;
                }
            }
        }, 

//        private bool 
        IsSelectableHelper:function(/*object*/ o) 
        { 
            /*DependencyObject*/var d = o instanceof DependencyObject ? o : null;
            // If o is not a DependencyObject, it is just a plain 
            // object and must be selectable and enabled.
            if (d == null)
            {
                return true; 
            }
            // It's selectable if IsSelectable is true and IsEnabled is true. 
            return d.GetValue(FrameworkElement.IsEnabledProperty); 
        },
 
        /// <summary>
        /// Called when the Template's tree has been generated
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
        	Selector.prototype.OnApplyTemplate.call(this); 

            if (this._dropDownPopup != null) 
            {
            	this._dropDownPopup.Closed -= OnPopupClosed;
            }
 
            this.EditableTextBoxSite = this.GetTemplateChild(EditableTextBoxTemplateName);
            this.EditableTextBoxSite = this.EditableTextBoxSite instanceof TextBox ? this.EditableTextBoxSite : null;
            this._dropDownPopup = this.GetTemplateChild(PopupTemplateName);
            this._dropDownPopup = this._dropDownPopup instanceof Popup ? this._dropDownPopup : null; 
 
            // EditableTextBoxSite should have been set by now if it's in the visual tree
            if (this.EditableTextBoxSite != null) 
            {
            	this.EditableTextBoxSite.TextChanged += new TextChangedEventHandler(this, this.OnEditableTextBoxTextChanged);
            	this.EditableTextBoxSite.SelectionChanged += new RoutedEventHandler(this, this.OnEditableTextBoxSelectionChanged);
            } 

            if (this._dropDownPopup != null) 
            { 
            	this._dropDownPopup.Closed += this.OnPopupClosed;
            } 

            this.Update();
        },
 
//        internal override void 
        OnTemplateChangedInternal:function(/*FrameworkTemplate*/ oldTemplate, /*FrameworkTemplate*/ newTemplate)
        { 
        	Selector.prototype.OnTemplateChangedInternal.call(this, oldTemplate, newTemplate); 

            // This is called when a template is applied but before the new template has been inflated. 

            // If we had a style before, detach from event handlers
            if (this.EditableTextBoxSite != null)
            { 
            	this.EditableTextBoxSite.TextChanged -= new TextChangedEventHandler(this, this.OnEditableTextBoxTextChanged);
            	this.EditableTextBoxSite.SelectionChanged -= new RoutedEventHandler(this, this.OnEditableTextBoxSelectionChanged); 
            } 
        },
 
        /// <summary>
        ///     An event reporting the left mouse button was released. 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) 
        {
            // Ignore the first mouse button up if we haven't gone over the popup yet 
            // And ignore all mouse ups over the items host.
            if (this.HasMouseEnteredItemsHost && !this.IsMouseOverItemsHost)
            {
                if (this.IsDropDownOpen) 
                {
                	this.Close(); 
                    e.Handled = true; 
//                    Debug.Assert(!CheckAccess() || Mouse.Captured != this, "On the dispatcher thread, ComboBox should not have capture after closing the dropdown");
                } 
            }

            Selector.prototype.OnMouseLeftButtonUp.call(this, e);
        }, 

        /// <summary>
        /// Called to toggle the DropDown using the keyboard. 
        /// </summary>
//        private void 
        KeyboardToggleDropDown:function(/*bool*/ commitSelection) 
        { 
            this.KeyboardToggleDropDown(!this.IsDropDownOpen, commitSelection);
        }, 

        /// <summary>
        /// Called to close the DropDown using the keyboard.
        /// </summary> 
//        private void 
        KeyboardCloseDropDown:function(/*bool*/ commitSelection)
        { 
        	this.KeyboardToggleDropDown(false /* openDropDown */, commitSelection); 
        },
 
//        private void 
        KeyboardToggleDropDown:function(/*bool*/ openDropDown, /*bool*/ commitSelection)
        {
            // Close the dropdown and commit the selection if requested.
            // Make sure to set the selection after the dropdown has closed 
            // so we don't trigger any unnecessary navigation as a result
            // of changing the selection. 
            /*ItemInfo*/var infoToSelect = null; 
            if (commitSelection)
            { 
                infoToSelect = this.HighlightedInfo;
            }

            this.SetCurrentValueInternal(ComboBox.IsDropDownOpenProperty, openDropDown); 

            if (openDropDown == false && commitSelection && (infoToSelect != null)) 
            { 
            	this.SelectionChange.SelectJustThisItem(infoToSelect, true /* assumeInItemsCollection */);
            } 
        },

//        private void 
        CommitSelection:function()
        { 
            /*ItemInfo*/var infoToSelect = this.HighlightedInfo;
            if (infoToSelect != null) 
            { 
            	this.SelectionChange.SelectJustThisItem(infoToSelect, true /* assumeInItemsCollection */);
            } 
        },

//        private void 
        OnAutoScrollTimeout:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            if (Mouse.LeftButton == MouseButtonState.Pressed
                && this.HasMouseEnteredItemsHost) 
            { 
            	this.DoAutoScroll(this.HighlightedInfo);
            } 
        },

//        private void 
        Close:function()
        { 
            if (this.IsDropDownOpen)
            { 
            	this.SetCurrentValueInternal(ComboBox.IsDropDownOpenProperty, false); 
            }
        } 
		
	});
	
	Object.defineProperties(ComboBox.prototype,{

        /// <summary>
        ///     The maximum height of the popup 
        /// </summary>
//        public double 
        MaxDropDownHeight:
        { 
            get:function()
            {
                return this.GetValue(ComboBox.MaxDropDownHeightProperty);
            }, 
            set:function(value)
            { 
            	this.SetValue(ComboBox.MaxDropDownHeightProperty, value); 
            }
        }, 
        /// <summary> 
        /// Whether or not the "popup" for this control is currently open
        /// </summary> 
//        public bool 
        IsDropDownOpen:
        {
            get:function() { return this.GetValue(ComboBox.IsDropDownOpenProperty); }, 
            set:function(value) { this.SetValue(ComboBox.IsDropDownOpenProperty, value); }
        }, 
 
        /// <summary>
        /// Whether or not the user entered prefix should be preserved in auto lookup matched text. 
        /// </summary>
//        public bool 
        ShouldPreserveUserEnteredPrefix: 
        { 
            get:function() { return this.GetValue(ComboBox.ShouldPreserveUserEnteredPrefixProperty); },
            set:function(value) { this.SetValue(ComboBox.ShouldPreserveUserEnteredPrefixProperty, BooleanBoxes.Box(value));  } 
        },
        /// <summary>
        ///     True if this ComboBox is editable. 
        /// </summary> 
        /// <value></value>
//        public bool 
        IsEditable: 
        {
            get:function() { return this.GetValue(ComboBox.IsEditableProperty); },
            set:function(value) { this.SetValue(ComboBox.IsEditableProperty, value); }
        }, 

        /// <summary> 
        ///     The text of the currently selected item.  When there is no SelectedItem and IsEditable is true
        ///     this is the text entered in the text box.  When IsEditable is false, this value represent the string version of the selected item.
        /// </summary>
        /// <value></value> 
//        public string 
        Text:
        { 
            get:function() { return this.GetValue(ComboBox.TextProperty); }, 
            set:function(value) { this.SetValue(ComboBox.TextProperty, value); }
        }, 
 
        /// <summary>
        ///     When the ComboBox is Editable, if the TextBox within it is read only. 
        /// </summary>
//        public bool 
        IsReadOnly:
        {
            get:function() { return this.GetValue(ComboBox.IsReadOnlyProperty); }, 
            set:function(value) { SetValue(ComboBox.IsReadOnlyProperty, value); }
        }, 

        /// <summary>
        /// Used to display the selected item 
        /// </summary>
//        public object 
        SelectionBoxItem: 
        { 
            get:function() { return this.GetValue(ComboBox.SelectionBoxItemProperty); },
            /*private*/ set:function(value) { this.SetValue(ComboBox.SelectionBoxItemPropertyKey, value); } 
        },

        /// <summary>
        /// Used to set the item DataTemplate 
        /// </summary>
//        public DataTemplate 
        SelectionBoxItemTemplate: 
        { 
            get:function() { return this.GetValue(ComboBox.SelectionBoxItemTemplateProperty); },
            /*private*/ set:function(value) { this.SetValue(ComboBox.SelectionBoxItemTemplatePropertyKey, value); } 
        },

        /// <summary>
        /// Used to set the item DataStringFormat 
        /// </summary>
//        public String 
        SelectionBoxItemStringFormat: 
        { 
            get:function() { return this.GetValue(ComboBox.SelectionBoxItemStringFormatProperty); }, 
            set:function(value) { this.SetValue(ComboBox.SelectionBoxItemStringFormatPropertyKey, value); } 
        },
        /// <summary>
        ///     Determines whether the ComboBox will remain open when clicking on
        ///     the text box when the drop down is open
        /// </summary> 
        /// <value></value>
//        public bool 
        StaysOpenOnEdit: 
        { 
            get:function()
            { 
                return this.GetValue(ComboBox.StaysOpenOnEditProperty);
            }, 
            set:function(value)
            { 
            	this.SetValue(ComboBox.StaysOpenOnEditProperty, value);
            } 
        }, 

        /// <summary>
        /// Indicates the SelectionBox area should be highlighted 
        /// </summary>
//        public bool 
        IsSelectionBoxHighlighted:
        { 
            get:function() { return this.GetValue(ComboBox.IsSelectionBoxHighlightedProperty); }
        }, 


   
        /// <summary>
        ///     If control has a scrollviewer in its style and has a custom keyboard scrolling behavior when HandlesScrolling should return true. 
        /// Then ScrollViewer will not handle keyboard input and leave it up to the control.
        /// </summary>
//        protected internal override bool 
        HandlesScrolling:
        { 
            get:function() { return true; }
        }, 
 
        /// <summary> 
        ///     Determines if the ComboBox effectively has focus or not
        ///     based on IsEditable and EditableTextBoxSite.IsKeyboardFocused.
        /// </summary>
//        protected internal override bool 
        HasEffectiveKeyboardFocus: 
        {
            get:function() 
            { 
                if (this.IsEditable && this.EditableTextBoxSite != null)
                { 
                    return this.EditableTextBoxSite.HasEffectiveKeyboardFocus;
                }
                return ComboBox.prototype.HasEffectiveKeyboardFocus;
            } 
        },

//        internal TextBox 
        EditableTextBoxSite:
        {
            get:function() 
            {
                return this._editableTextBoxSite; 
            }, 
            set:function(value)
            { 
            	this._editableTextBoxSite = value;
            }
        },
 
//        private bool 
        HasCapture:
        { 
            get:function() 
            {
                return Mouse.Captured == this; 
            }
        },

        /// <summary> 
        /// Returns true if the ItemsHost is visually connected to the RootVisual of its PresentationSource.
        /// </summary> 
        /// <value></value> 
        /// <SecurityNote>
        ///     Critical: This code accesses HwndSource from the call PresentationSource.CriticalFromVisual 
        ///     TreatAsSafe: It does not expose the critical data
        /// </SecurityNote>
//        private bool 
        IsItemsHostVisible:
        { 
            get:function() 
            { 
                var itemsHost = this.ItemsHost;
                if (itemsHost != null) 
                {
                	// cym comment
//                    /*HwndSource*/var source = PresentationSource.CriticalFromVisual(itemsHost);
//                    source = source instanceof HwndSource ? source: null;
//
//                    if (source != null && !source.IsDisposed && source.RootVisual != null) 
//                    {
//                        return source.RootVisual.IsAncestorOf(itemsHost); 
//                    } 
                	
                	return true;
                }
 
                return false;
            }
        },
 
//        private ItemInfo 
        HighlightedInfo:
        { 
            get:function() { return this._highlightedInfo; }, 
            set:function(value)
            { 
                /*ComboBoxItem*/
            	var cbi = (this._highlightedInfo != null) ? 
            			(this._highlightedInfo.Container instanceof ComboBoxItem ? this._highlightedInfo.Container : null): null;
                if (cbi != null)
                {
                    cbi.SetIsHighlighted(false); 
                }
 
                this._highlightedInfo = value; 

                cbi = (this._highlightedInfo != null) ? 
                		(this._highlightedInfo.Container instanceof ComboBoxItem ? this._highlightedInfo.Container : null) : null; 
                if (cbi != null)
                {
                    cbi.SetIsHighlighted(true);
                } 

                this.CoerceValue(ComboBox.IsSelectionBoxHighlightedProperty); 
            } 
        },
 
//        private ComboBoxItem 
        HighlightedElement:
        {
            get:function() { return (this._highlightedInfo == null) ? null : 
            	(this._highlightedInfo.Container instanceof ComboBoxItem ? this._highlightedInfo.Container : null); }
        }, 

//        private bool 
        IsMouseOverItemsHost: 
        { 
            get:function() { return this._cacheValid.Get(CacheBits.IsMouseOverItemsHost); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.IsMouseOverItemsHost, value); } 
        },

//        private bool 
        HasMouseEnteredItemsHost:
        { 
            get:function() { return this._cacheValid.Get(CacheBits.HasMouseEnteredItemsHost); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.HasMouseEnteredItemsHost, value); } 
        }, 

//        private bool 
        IsContextMenuOpen:
        {
            get:function() { return this._cacheValid.Get(CacheBits.IsContextMenuOpen); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.IsContextMenuOpen, value); }
        }, 

        // Used to indicate that the Text Properties are changing 
        // Don't reenter callbacks 
//        private bool 
        UpdatingText:
        { 
            get:function() { return this._cacheValid.Get(CacheBits.UpdatingText); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.UpdatingText, value); }
        },
 
        // Selected item is being updated; Don't reenter callbacks
//        private bool 
        UpdatingSelectedItem: 
        { 
            get:function() { return this._cacheValid.Get(CacheBits.UpdatingSelectedItem); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.UpdatingSelectedItem, value); } 
        },
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        { 
            get:function() { return _dType; }
        } 

	});
	
	Object.defineProperties(ComboBox,{

        /// <summary> 
        ///     DependencyProperty for MaxDropDownHeight
        /// </summary> 
        // 
//        public static readonly DependencyProperty 
        MaxDropDownHeightProperty:
        {
        	get:function(){
        		if(ComboBox._MaxDropDownHeightProperty === undefined){
        			ComboBox._MaxDropDownHeightProperty = DependencyProperty.Register("MaxDropDownHeight", Number.Type, ComboBox.Type, 
                            new FrameworkPropertyMetadata(SystemParameters.PrimaryScreenHeight / 3, OnVisualStatePropertyChanged));
        		}
        		
        		return ComboBox._MaxDropDownHeightProperty;
        	}
        },
            

        /// <summary>
        /// DependencyProperty for IsDropDownOpen
        /// </summary> 
//        public static readonly DependencyProperty 
        IsDropDownOpenProperty:
        {
        	get:function(){
        		if(ComboBox._IsDropDownOpenProperty === undefined){
        			ComboBox._IsDropDownOpenProperty =
                        DependencyProperty.Register( 
                                "IsDropDownOpen", 
                                Boolean.Type,
                                ComboBox.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsDropDownOpenChanged), 
                                        new CoerceValueCallback(null, CoerceIsDropDownOpen))*/
                                FrameworkPropertyMetadata.Build4(
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsDropDownOpenChanged), 
                                        new CoerceValueCallback(null, CoerceIsDropDownOpen)));
        		}
        		
        		return ComboBox._IsDropDownOpenProperty;
        	}
        }, 
 
        /// <summary>
        /// DependencyProperty for ShouldPreserveUserEnteredPrefix. 
        /// </summary>
        ///

//        public static readonly DependencyProperty 
        ShouldPreserveUserEnteredPrefixProperty:
        {
        	get:function(){
        		if(ComboBox._ShouldPreserveUserEnteredPrefixProperty === undefined){
        			ComboBox._ShouldPreserveUserEnteredPrefixProperty = 
        	               DependencyProperty.Register(
        	                       "ShouldPreserveUserEnteredPrefix", 
        	                       Boolean.Type, 
        	                       ComboBox.Type,
        	                       /*new FrameworkPropertyMetadata(false)*/
        	                       FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return ComboBox._ShouldPreserveUserEnteredPrefixProperty;
        	}
        },

 
        /// <summary>
        /// DependencyProperty for IsEditable
        /// </summary>
//        public static readonly DependencyProperty 
        IsEditableProperty:
        {
        	get:function(){
        		if(ComboBox._IsEditableProperty === undefined){
        			ComboBox._IsEditableProperty = 
                        DependencyProperty.Register(
                                "IsEditable", 
                                Boolean.Type, 
                                ComboBox.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        new PropertyChangedCallback(null, OnIsEditableChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        false,
                                        new PropertyChangedCallback(null, OnIsEditableChanged)));
        		}
        		
        		return ComboBox._IsEditableProperty;
        	}
        }, 

        /// <summary>
        ///     DependencyProperty for Text 
        /// </summary> 
//        public static readonly DependencyProperty 
        TextProperty:
        {
        	get:function(){
        		if(ComboBox._TextProperty === undefined){
        			ComboBox._TextProperty =
                        DependencyProperty.Register( 
                                "Text",
                                String.Type,
                                ComboBox.Type,
                                /*new FrameworkPropertyMetadata( 
                                        String.Empty,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnTextChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        String.Empty,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnTextChanged))); 
        		}
        		
        		return ComboBox._TextProperty;
        	}
        }, 


        /// <summary>
        ///     DependencyProperty for the IsReadOnlyProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        IsReadOnlyProperty:
        {
        	get:function(){
        		if(ComboBox._IsReadOnlyProperty === undefined){
        			ComboBox._IsReadOnlyProperty =
                        TextBox.IsReadOnlyProperty.AddOwner(ComboBox.Type); 
        		}
        		
        		return ComboBox._IsReadOnlyProperty;
        	}
        }, 
 
//        private static readonly DependencyPropertyKey 
        SelectionBoxItemPropertyKey:
        {
        	get:function(){
        		if(ComboBox._SelectionBoxItemPropertyKey === undefined){
        			ComboBox._SelectionBoxItemPropertyKey =
        	            DependencyProperty.RegisterReadOnly("SelectionBoxItem", Object.Type, ComboBox.Type, 
                                /*new FrameworkPropertyMetadata(String.Empty)*/
        	            		FrameworkPropertyMetadata.BuildWithDV(String.Empty));
        		}
        		
        		return ComboBox._SelectionBoxItemPropertyKey;
        	}
        }, 

        // This property is used as a Style Helper.
        // When the SelectedItem is a UIElement a VisualBrush is created and set to the Fill property 
        // of a Rectangle. Then we set SelectionBoxItem to that rectangle.
        // For data items, SelectionBoxItem is set to a string. 
        /// <summary> 
        /// The DependencyProperty for the SelectionBoxItemProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectionBoxItemProperty:
        {
        	get:function(){
        		return ComboBox.SelectionBoxItemPropertyKey.DependencyProperty;
        	}
        }, 


//        private static readonly DependencyPropertyKey 
        SelectionBoxItemTemplatePropertyKey:
        {
        	get:function(){
        		if(ComboBox._SelectionBoxItemTemplatePropertyKey === undefined){
        			ComboBox._SelectionBoxItemTemplatePropertyKey =
        	            DependencyProperty.RegisterReadOnly("SelectionBoxItemTemplate", DataTemplate.Type, ComboBox.Type, 
                                /*new FrameworkPropertyMetadata(null)*/
        	            		FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return ComboBox._SelectionBoxItemTemplatePropertyKey;
        	}
        },
 
        /// <summary> 
        /// The DependencyProperty for the SelectionBoxItemProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectionBoxItemTemplateProperty:
        {
        	get:function(){
        		return ComboBox.SelectionBoxItemTemplatePropertyKey.DependencyProperty;
        	}
        },


//        private static readonly DependencyPropertyKey 
        SelectionBoxItemStringFormatPropertyKey:
        {
        	get:function(){
        		if(ComboBox._SelectionBoxItemStringFormatPropertyKey === undefined){
        			ComboBox._SelectionBoxItemStringFormatPropertyKey =
        	            DependencyProperty.RegisterReadOnly("SelectionBoxItemStringFormat", String.Type, ComboBox.Type, 
                                /*new FrameworkPropertyMetadata(null)*/
        	            		FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return ComboBox._SelectionBoxItemStringFormatPropertyKey;
        	}
        },
 
        /// <summary> 
        /// The DependencyProperty for the SelectionBoxItemProperty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectionBoxItemStringFormatProperty:
        {
        	get:function(){
        		return ComboBox.SelectionBoxItemStringFormatPropertyKey.DependencyProperty;
        	}
        },


        /// <summary>
        ///     DependencyProperty for StaysOpenOnEdit 
        /// </summary>
//        public static readonly DependencyProperty 
        StaysOpenOnEditProperty:
        {
        	get:function(){
        		if(ComboBox._StaysOpenOnEditProperty === undefined){
        			ComboBox._StaysOpenOnEditProperty = DependencyProperty.Register("StaysOpenOnEdit", Boolean.Type, ComboBox.Type, 
                            new FrameworkPropertyMetadata(false));
        		}
        		
        		return ComboBox._StaysOpenOnEditProperty;
        	}
        }, 
            
//        private static readonly DependencyPropertyKey 
        IsSelectionBoxHighlightedPropertyKey:
        {
        	get:function(){
        		if(ComboBox._IsSelectionBoxHighlightedPropertyKey === undefined){
        			ComboBox._IsSelectionBoxHighlightedPropertyKey  =
                        DependencyProperty.RegisterReadOnly("IsSelectionBoxHighlighted", Boolean.Type, ComboBox.Type,
                                /*new FrameworkPropertyMetadata(false,
                                                              null, 
                                                              new CoerceValueCallback(null, CoerceIsSelectionBoxHighlighted))*/
                        		FrameworkPropertyMetadata.Build3CVCB(false,
                                                              null, 
                                                              new CoerceValueCallback(null, CoerceIsSelectionBoxHighlighted)));
        		}
        		
        		return ComboBox._IsSelectionBoxHighlightedPropertyKey;
        	}
        },
 
        /// <summary> 
        /// The DependencyProperty for the IsSelectionBoxHighlighted Property
        /// </summary> 
//        private static readonly DependencyProperty 
        IsSelectionBoxHighlightedProperty:
        {
        	get:function(){
        		return ComboBox.IsSelectionBoxHighlightedPropertyKey.DependencyProperty;
        	}
        },

//        private static readonly EventPrivateKey 
        DropDownOpenedKey:
        {
        	get:function(){
        		if(ComboBox._DropDownOpenedKey === undefined){
        			ComboBox._DropDownOpenedKey = new EventPrivateKey();
        		}
        		
        		return ComboBox._DropDownOpenedKey;
        	}
        }, 
 
//        private static readonly EventPrivateKey 
        DropDownClosedKey:
        {
        	get:function(){
        		if(ComboBox._DropDownClosedKey === undefined){
        			ComboBox._DropDownClosedKey = new EventPrivateKey();
        		}
        		
        		return ComboBox._DropDownClosedKey;
        	}
        }  
	});
    
//    private static object 
    function CoerceIsDropDownOpen(/*DependencyObject*/ d, /*object*/ value) 
    {
//        if (value) 
//        { 
//            if (!d.IsLoaded) 
//            {
//                d.RegisterToOpenOnLoad();
//                return false;
//            } 
//        }

        return value; 
    }

//    private static object 
    function CoerceToolTipIsEnabled(/*DependencyObject*/ d, /*object*/ value)
    {
        return d.IsDropDownOpen ? false : value; 
    }

//    private static void 
    function OnIsDropDownOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.HasMouseEnteredItemsHost = false; 

        var newValue = e.NewValue;
        var oldValue = !newValue;

        if (newValue)
        { 
            // When the drop down opens, take capture
            Mouse.Capture(d, CaptureMode.SubTree); 

            // Select text if editable
            if (d.IsEditable && d.EditableTextBoxSite != null) 
                d.EditableTextBoxSite.SelectAll();

//            if (d._clonedElement != null && VisualTreeHelper.GetParent(d._clonedElement) == null)
//            { 
//                d.Dispatcher.BeginInvoke(
//                    DispatcherPriority.Loaded, 
//                    /*(DispatcherOperationCallback) delegate*/function(/*object*/ arg) 
//                    {
//                        /*ComboBox*/var cb = arg; 
//                        cb.UpdateSelectionBoxItem();
//
//                        if (cb._clonedElement != null)
//                        { 
//                            cb._clonedElement.CoerceValue(FrameworkElement.FlowDirectionProperty);
//                        } 
//
//                        return null;
//                    }, 
//                    d);
//            }
            d.UpdateSelectionBoxItem();

//            if (cb._clonedElement != null)
//            { 
//                cb._clonedElement.CoerceValue(FrameworkElement.FlowDirectionProperty);
//            } 

            // Popup.IsOpen is databound to IsDropDownOpen.  We can't know 
            // if IsDropDownOpen will be invalidated before Popup.IsOpen.
            // If we are invalidated first and we try to focus the item, we 
            // might succeed (b/c there's a logical link from the item to 
            // a PresentationSource).  When the popup finally opens, Focus
            // will be sent to null because Core doesn't know what else to do. 
            // So, we must focus the element only after we are sure the popup
            // has opened.  We will queue an operation (at Send priority) to
            // do this work -- this is the soonest we can make this happen.
//            d.Dispatcher.BeginInvoke( 
//                DispatcherPriority.Send,
//                /*(DispatcherOperationCallback) delegate*/function(/*object*/ arg) 
//                { 
//                    /*ComboBox*/var cb = arg;
//                    if (cb.IsItemsHostVisible) 
//                    {
//                        cb.NavigateToItem(cb.InternalSelectedInfo, ItemNavigateArgs.Empty, true /* alwaysAtTopOfViewport */);
//                    }
//                    return null; 
//                },
//                d); 
            
            if (d.IsItemsHostVisible) 
            {
                d.NavigateToItem(d.InternalSelectedInfo, ItemNavigateArgs.Empty, true /* alwaysAtTopOfViewport */);
            }

            d.OnDropDownOpened(EventArgs.Empty);
        } 
        else
        {
            // If focus is within the subtree, make sure we have the focus so that focus isn't in the disposed hwnd
            if (d.IsKeyboardFocusWithin) 
            {
                if (d.IsEditable) 
                { 
                    if (d.EditableTextBoxSite != null && !d.EditableTextBoxSite.IsKeyboardFocusWithin)
                    { 
                        d.Focus();
                    }
                }
                else 
                {
                    // It's not editable, make sure the combobox has focus 
                    d.Focus(); 
                }
            } 

            // Make sure to clear the highlight when the dropdown closes
            d.HighlightedInfo = null;

            if (d.HasCapture)
            { 
                Mouse.Capture(null); 
            }

            // No Popup in the style so fire closed now
            if (d._dropDownPopup == null)
            {
                d.OnDropDownClosed(EventArgs.Empty); 
            }
        } 

        d.CoerceValue(ComboBox.IsSelectionBoxHighlightedProperty);
        d.CoerceValue(ToolTipService.IsEnabledProperty); 

        d.UpdateVisualState();
    }

//    private static void 
    function OnIsEditableChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.Update();
        d.UpdateVisualState();
    }

//    private static object 
    function CoerceIsSelectionBoxHighlighted(/*object*/ o, /*object*/ value)
    {
        return (!o.IsDropDownOpen && o.IsKeyboardFocusWithin) ||
               (o.HighlightedInfo != null && o.HighlightedElement.Content == o._clonedElement); 
    } 

    // When the Text Property changes, search for an item exactly
    // matching the new text and set the selected index to that item 
//    private static void 
    function OnTextChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.TextUpdated(e.NewValue, false);

    }

    /// <summary>
    ///     Called when this element or any below gets focus.
    /// </summary> 
//    private static void 
    function OnGotFocus(/*object*/ sender, /*RoutedEventArgs*/ e)
    { 
        // If we're an editable combobox, forward focus to the TextBox element
        if (!e.Handled)
        {
            if (sender.IsEditable && sender.EditableTextBoxSite != null) 
            {
                if (e.OriginalSource == sender) 
                { 
                	sender.EditableTextBoxSite.Focus();
                    e.Handled = true; 
                }
                else if (e.OriginalSource == sender.EditableTextBoxSite)
                {
                	sender.EditableTextBoxSite.SelectAll(); 
                }
            } 
        } 
    }

    /// <summary> 
    ///     An event reporting a mouse wheel rotation.
    /// </summary> 
//    private static void 
    function OnMouseWheel(/*object*/ sender, /*MouseWheelEventArgs*/ e)
    {
        // If we get a mouse wheel event we should scroll when the
        // drop down is closed and eat the mouse wheel when it's open. 
        // (If the drop down is open and has a scrollviewer, the scrollviewer 
        // will handle it before we get here).
        // We should only do this when focus is within the combobox, 
        // otherwise we could severely confuse the user.
        if (sender.IsKeyboardFocusWithin)
        {
            if (!sender.IsDropDownOpen) 
            {
                // Negative delta means "down", which means we should move next in that case. 
                if (e.Delta < 0) 
                {
                	sender.SelectNext(); 
                }
                else
                {
                	sender.SelectPrev(); 
                }
            } 

            e.Handled = true;
        } 
        else
        {
            // If focus isn't within the combobox (say, we're not focusable)
            // but we get a mouse wheel event, we should do nothing unless 
            // the drop down is open, in which case we should eat it.
            if (sender.IsDropDownOpen) 
            { 
                e.Handled = true;
            } 
        }
    }

//    private static void 
    function OnContextMenuOpen(/*object*/ sender, /*ContextMenuEventArgs*/ e) 
    {
    	sender.IsContextMenuOpen = true; 
    } 

//    private static void 
    function OnContextMenuClose(/*object*/ sender, /*ContextMenuEventArgs*/ e) 
    {
    	sender.IsContextMenuOpen = false;
    }

//    private static string 
    function ExtractString(/*DependencyObject*/ d)
    {
        /*TextBlock*/var text;
        /*Visual*/var visual; 
        /*TextElement*/var textElement;
        var strValue = String.Empty; 

        if ((text = d instanceof TextBlock ? d : null) != null)
        { 
            strValue = text.Text;
        }
        else if ((visual = d instanceof Visual ? d : null) != null)
        { 
            var count = VisualTreeHelper.GetChildrenCount(visual);
            for(var i = 0; i < count; i++) 
            { 
                strValue += ExtractString(VisualTreeHelper.GetChild(visual, i));
            } 
        }
        else if ((textElement = d instanceof TextElement ? d : null) != null)
        {
            strValue += TextRangeBase.GetTextInternal(textElement.ContentStart, textElement.ContentEnd); 
        }

        return strValue; 
    }

//    private static void 
    function OnLostMouseCapture(/*object*/ sender, /*MouseEventArgs*/ e)
    { 
        // ISSUE (jevansa) -- task 22022: 
        //        We need a general mechanism to do this, or at the very least we should
        //        share it amongst the controls which need it (Popup, MenuBase, ComboBox). 
        if (Mouse.Captured != sender)
        {
            if (e.OriginalSource == sender)
            { 
                // If capture is null or it's not below the combobox, close.
                // More workaround for task 22022 -- check if it's a descendant (following Logical links too) 
                if (Mouse.Captured == null || !MenuBase.IsDescendant(sender, Mouse.Captured instanceof DependencyObject ? Mouse.Captured : null )) 
                {
                	sender.Close(); 
                }
            }
            else
            { 
                if (MenuBase.IsDescendant(sender, e.OriginalSource instanceof DependencyObject ? e.OriginalSource : null))
                { 
                    // Take capture if one of our children gave up capture (by closing their drop down) 
                    if (sender.IsDropDownOpen && Mouse.Captured == null && MS.Win32.SafeNativeMethods.GetCapture() == IntPtr.Zero)
                    { 
                        Mouse.Capture(sender, CaptureMode.SubTree);
                        e.Handled = true;
                    }
                } 
                else
                { 
                	sender.Close(); 
                }
            } 
        }
    }

//    private static void 
    function OnMouseButtonDown(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        // If we (or one of our children) are clicked, claim the focus (don't steal focus if our context menu is clicked)
        if (!sender.IsContextMenuOpen && !sender.IsKeyboardFocusWithin) 
        {
        	sender.Focus();
        }

        e.Handled = true;   // Always handle so that parents won't take focus away

        // Note: This half should be moved into OnMouseDownOutsideCapturedElement 
        // When we have capture, all clicks off the popup will have the combobox as
        // the OriginalSource.  So when the original source is the combobox, that 
        // means the click was off the popup and we should dismiss.
        if (Mouse.Captured == sender && e.OriginalSource == sender)
        {
        	sender.Close(); 
//            Debug.Assert(!comboBox.CheckAccess() || Mouse.Captured != comboBox, "On the dispatcher thread, ComboBox should not have capture after closing the dropdown");
        } 
    } 

//    private static void 
    function OnPreviewMouseButtonDown(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        if (sender.IsEditable) 
        {
            var originalSource = e.OriginalSource instanceof Visual ? e.OriginalSource : null; 
            /*Visual*/var textBox = sender.EditableTextBoxSite; 

            if (originalSource != null && textBox != null 
                && textBox.IsAncestorOf(originalSource))
            {
                if (sender.IsDropDownOpen && !sender.StaysOpenOnEdit)
                { 
                    // When combobox is not editable, clicks anywhere outside
                    // the combobox will close it.  When the combobox is editable 
                    // then clicking the text box should close the combobox as well. 
                	sender.Close();
                } 
                else if (!sender.IsContextMenuOpen && !sender.IsKeyboardFocusWithin)
                {
                    // If textBox is clicked, claim focus
                	sender.Focus(); 
                    e.Handled = true;   // Handle so that textbox won't try to update cursor position
                } 
            } 
        }
    } 


//    private static void 
    function OnMouseMove(/*object*/ sender, /*MouseEventArgs*/ e) 
    { 
        // The mouse moved, see if we're over the items host yet
        if (sender.IsDropDownOpen)
        {
            var isMouseOverItemsHost = sender.ItemsHost != null ? sender.ItemsHost.IsMouseOver : false; 

            // When mouse enters items host, start tracking mouse movements 
            if (isMouseOverItemsHost && !sender.HasMouseEnteredItemsHost) 
            {
            	sender.SetInitialMousePosition(); 
            }

            sender.IsMouseOverItemsHost = isMouseOverItemsHost;
            sender.HasMouseEnteredItemsHost |= isMouseOverItemsHost; 
        }

        // If we get a mouse move and we have capture, then the mouse was 
        // outside the ComboBox.  We should autoscroll.
        if (Mouse.LeftButton == MouseButtonState.Pressed && sender.HasMouseEnteredItemsHost) 
        {
            if (Mouse.Captured == sender)
            {
                if (Mouse.LeftButton == MouseButtonState.Pressed) 
                {
                	sender.DoAutoScroll(sender.HighlightedInfo); 
                } 
                else
                { 
                    // We missed the mouse up, release capture
                	sender.ReleaseMouseCapture();
                	sender.ResetLastMousePosition();
                } 


                e.Handled = true; 
            }
        } 
    }
    
//  static ComboBox() 
	function Initialize()
    {
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Local)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Local)); 
        
        KeyboardNavigation.ControlTabNavigationProperty.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.None)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.None));
        
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.None)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.None));

        // Disable tooltips on combo box when it is open 
        ToolTipService.IsEnabledProperty.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(null, new CoerceValueCallback(this, this.CoerceToolTipIsEnabled))*/
        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null, new CoerceValueCallback(this, this.CoerceToolTipIsEnabled)));

        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(ComboBox.Type)*/FrameworkPropertyMetadata.BuildWithDV(ComboBox.Type)); 
        
        _dType = DependencyObjectType.FromSystemTypeInternal(ComboBox.Type); 

        ItemsControl.IsTextSearchEnabledProperty.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(true)*/FrameworkPropertyMetadata.BuildWithDV(true));

        EventManager.RegisterClassHandler(ComboBox.Type, Mouse.LostMouseCaptureEvent, new MouseEventHandler(this, this.OnLostMouseCapture));
        EventManager.RegisterClassHandler(ComboBox.Type, Mouse.MouseDownEvent, new MouseButtonEventHandler(this, this.OnMouseButtonDown), true); // call us even if the transparent button in the style gets the click. 
        EventManager.RegisterClassHandler(ComboBox.Type, Mouse.MouseMoveEvent, new MouseEventHandler(this, this.OnMouseMove));
        EventManager.RegisterClassHandler(ComboBox.Type, Mouse.PreviewMouseDownEvent, new MouseButtonEventHandler(this, this.OnPreviewMouseButtonDown)); 
        EventManager.RegisterClassHandler(ComboBox.Type, Mouse.MouseWheelEvent, new MouseWheelEventHandler(this, this.OnMouseWheel), true); // call us even if textbox in the style gets the click. 
        EventManager.RegisterClassHandler(ComboBox.Type, UIElement.GotFocusEvent, new RoutedEventHandler(this, this.OnGotFocus)); // call us even if textbox in the style get focus

        // Listen for ContextMenu openings/closings
        EventManager.RegisterClassHandler(ComboBox.Type, ContextMenuService.ContextMenuOpeningEvent, new ContextMenuEventHandler(this, this.OnContextMenuOpen), true);
        EventManager.RegisterClassHandler(ComboBox.Type, ContextMenuService.ContextMenuClosingEvent, new ContextMenuEventHandler(this, this.OnContextMenuClose), true);

        UIElement.IsEnabledProperty.OverrideMetadata(ComboBox.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(this, this.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(this, this.OnVisualStatePropertyChanged)));
        
        UIElement.IsMouseOverPropertyKey.OverrideMetadata(ComboBox.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(this, this.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(this, this.OnVisualStatePropertyChanged))); 
        
        Selector.IsSelectionActivePropertyKey.OverrideMetadata(ComboBox.Type, 
        		/*new FrameworkPropertyMetadata(new PropertyChangedCallback(this, this.OnVisualStatePropertyChanged))*/
        		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(this, this.OnVisualStatePropertyChanged))); 
    };
	
	ComboBox.Type = new Type("ComboBox", ComboBox, [Selector.Type]);
	Initialize();
	
	return ComboBox;
});
