/**
 * TreeView
 */

define(["dojo/_base/declare", "system/Type", "controls/ItemsControl", "windows/EventManager", "windows/DependencyProperty",
        "system/EventHandler", "input/KeyboardNavigation", "windows/DependencyObjectType", "windows/FrameworkPropertyMetadata",
        "specialized/BitVector32", "media/VisualTreeHelper", "windows/FrameworkElement", "input/KeyboardNavigation",
        "windows/RoutedPropertyChangedEventArgs", "data/Binding", "windows/PropertyPath", "specialized/BitVector32",
        "specialized/NotifyCollectionChangedAction", "controls/TreeViewItem",
        "controls/ItemNavigateArgs", "input/FocusNavigationDirection", "windows/RoutedPropertyChangedEventHandler"], 
		function(declare, Type, ItemsControl, EventManager, DependencyProperty,
				EventHandler, KeyboardNavigation, DependencyObjectType, FrameworkPropertyMetadata,
				BitVector32, VisualTreeHelper, FrameworkElement, KeyboardNavigation,
				RoutedPropertyChangedEventArgs, Binding, PropertyPath, BitVector32,
				NotifyCollectionChangedAction, TreeViewItem,
				ItemNavigateArgs, FocusNavigationDirection, RoutedPropertyChangedEventHandler){
	
//  private static DependencyObjectType 
    var _dType = null;

    
//    private enum 
    var Bits = declare(null, {});
    Bits.IsSelectionChangeActive     = 0x1; 
    
//    private static readonly BindingExpressionUncommonField 
    var SelectedValuePathBindingExpression = new BindingExpressionUncommonField(); 
    
	var TreeView = declare("TreeView", ItemsControl,{
		constructor:function(){
			//// Packed boolean information
			//private BitVector32 
            this._bits = new BitVector32(0);
            //
            //private TreeViewItem 
	        this._selectedContainer = null; 
	            
            this._focusEnterMainFocusScopeEventHandler = new EventHandler(this, this.OnFocusEnterMainFocusScope);
//            KeyboardNavigation.Current.FocusEnterMainFocusScope += _focusEnterMainFocusScopeEventHandler;   //cymcomment
            
        	this._dom = window.document.createElement('div');
        	this._dom.id = "TreeView";
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
 
//        private void 
		SetSelectedItem:function(/*object*/ data)
        { 
            if (this.SelectedItem != data) 
            {
                this.SetValue(TreeView.SelectedItemPropertyKey, data); 
            }
        },
 
//        private void 
		SetSelectedValue:function(/*object*/ data) 
        {
            if (this.SelectedValue != data) 
            {
                this.SetValue(TreeView.SelectedValuePropertyKey, data);
            }
        }, 
        /// <summary> 
        ///     Event fired when <see cref="SelectedItem"/> changes.
        /// </summary>
        AddSelectedItemChangedHandler:function(value){
        	this.AddHandler(TreeView.SelectedItemChangedEvent, value);
        },
        
        RemoveSelectedItemChangedHandler:function(value){
        	this.RemoveHandler(TreeView.SelectedItemChangedEvent, value); 
        },
 
        /// <summary>
        ///     Called when <see cref="SelectedItem"/> changes. 
        ///     Default implementation fires the <see cref="SelectedItemChanged"/> event.
        /// </summary>
        /// <param name="e">Event arguments.</param>
//        protected virtual void 
        OnSelectedItemChanged:function(/*RoutedPropertyChangedEventArgs<object>*/ e) 
        {
            // 
            this.RaiseEvent(e); 
        },
 
//        internal void 
        ChangeSelection:function(/*object*/ data, /*TreeViewItem*/ container, /*bool*/ selected) 
        {
            if (this.IsSelectionChangeActive) 
            {
                return;
            }
 
            var oldValue = null;
            var newValue = null; 
            var changed = false; 
//            /*TreeViewItem*/var oldContainer = this._selectedContainer; // Saved for the automation event
 
            this.IsSelectionChangeActive = true;

            try
            { 
                if (selected)
                { 
                    if (container != this._selectedContainer) 
                    {
                        oldValue = this.SelectedItem; 
                        newValue = data;

                        if (this._selectedContainer != null)
                        { 
                        	this._selectedContainer.IsSelected = false;
                        	this._selectedContainer.UpdateContainsSelection(false); 
                        } 
                        this._selectedContainer = container;
                        this._selectedContainer.UpdateContainsSelection(true); 
                        this.SetSelectedItem(data);
                        this.UpdateSelectedValue(data);
                        changed = true;
                    } 
                }
                else 
                { 
                    if (container == this._selectedContainer)
                    { 
                    	this._selectedContainer.UpdateContainsSelection(false);
                    	this._selectedContainer = null;
                    	this.SetSelectedItem(null);
 
                        oldValue = data;
                        changed = true; 
                    } 
                }
 
                if (container.IsSelected != selected)
                {
                    container.IsSelected = selected;
                } 
            }
            finally 
            { 
            	this.IsSelectionChangeActive = false;
            } 

            if (changed)
            {
                /*RoutedPropertyChangedEventArgs<object>*/
            	var e = new RoutedPropertyChangedEventArgs/*<object>*/(oldValue, newValue, TreeView.SelectedItemChangedEvent);
                this.OnSelectedItemChanged(e);
            } 
        },
//        private void 
        UpdateSelectedValue:function(/*object*/ selectedItem) 
        {
            /*BindingExpression*/var expression = this.PrepareSelectedValuePathBindingExpression(selectedItem); 
 
            if (expression != null)
            { 
                expression.Activate(selectedItem);
                var selectedValue = expression.Value;
                expression.Deactivate();
 
                this.SetValue(TreeView.SelectedValuePropertyKey, selectedValue);
            } 
            else 
            {
                this.ClearValue(TreeView.SelectedValuePropertyKey); 
            }
        },
//        private BindingExpression 
        PrepareSelectedValuePathBindingExpression:function(/*object*/ item) 
        {
            if (item == null) 
            { 
                return null;
            } 

            var binding;
            var useXml = false; //SystemXmlHelper.IsXmlNode(item); cym comment
  
            /*BindingExpression*/var bindingExpr = SelectedValuePathBindingExpression.GetValue(this);
 
//            // replace existing binding if it's the wrong kind 
//            if (bindingExpr != null)
//            { 
//                binding = bindingExpr.ParentBinding;
//                var usesXml = (binding.XPath != null);
//                if (usesXml != useXml)
//                { 
//                    bindingExpr = null;
//                } 
//            } 
//
//            if (bindingExpr == null) 
//            {
//                // create the binding
//                binding = new Binding();
//                binding.Source = item; 
//
//                if (useXml) 
//                { 
//                    binding.XPath = this.SelectedValuePath;
//                    binding.Path = new PropertyPath("/InnerText"); 
//                }
//                else
//                {
//                    binding.Path = new PropertyPath(this.SelectedValuePath); 
//                }
// 
//                bindingExpr = BindingExpression.CreateUntargetedBindingExpression(this, binding); 
//                SelectedValuePathBindingExpression.SetValue(this, bindingExpr);
//            } 

            return bindingExpr;
        },
 
//        internal void 
        HandleSelectionAndCollapsed:function(/*TreeViewItem*/ collapsed)
        { 
            if ((this._selectedContainer != null) && (this._selectedContainer != collapsed)) 
            {
                // Check if current selection is under the collapsed element 
                /*TreeViewItem*/var current = this._selectedContainer;
                do
                {
                    current = current.ParentTreeViewItem; 
                    if (current == collapsed)
                    { 
                        /*TreeViewItem*/var oldContainer = this._selectedContainer; 

                        this.ChangeSelection(collapsed.ParentItemsControl.ItemContainerGenerator.ItemFromContainer(collapsed), collapsed, true); 

                        if (oldContainer.IsKeyboardFocusWithin)
                        {
                            // If the oldContainer had focus then move focus to the newContainer instead 
                        	this._selectedContainer.Focus();
                        } 
 
                        break;
                    } 
                }
                while (current != null);
            }
        }, 

        // This method is called when MouseButonDown on TreeViewItem and also listen for handled events too 
        // The purpose is to restore focus on TreeView when mouse is clicked and focus was outside the TreeView 
        // Focus goes either to selected item (if any) or treeview itself
//        internal void 
        HandleMouseButtonDown:function() 
        {
            if (!this.IsKeyboardFocusWithin)
            {
                if (this._selectedContainer != null) 
                {
                    if (!this._selectedContainer.IsKeyboardFocused) 
                    	this._selectedContainer.Focus(); 
                }
                else 
                {
                    // If we don't have a selection - just focus the treeview
                    this.Focus();
                } 
            }
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
                    if ((this.SelectedItem != null) && !this.IsSelectedContainerHookedUp) 
                    {
                    	this.SelectFirstItem(); 
                    } 
                    break;
 
                case NotifyCollectionChangedAction.Replace:
                    {
                        // If old item is selected - remove the selection
                        // Revisit the condition when we support duplicate items in Items collection: if e.OldItems[0] is the same as selected items we will unselect the selected item 
                        var selectedItem = this.SelectedItem;
                        if ((selectedItem != null) && selectedItem.Equals(e.OldItems.Get(0))) 
                        { 
                        	this.ChangeSelection(selectedItem, this._selectedContainer, false);
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

//        private void 
        SelectFirstItem:function() 
        {
            var itemOut = {"item" : null};
            
            var containerOut = {"container" : null};
            
            var selected = this.GetFirstItem(/*out item*/itemOut, /*out container*/containerOut);
            var item = itemOut.item; 
            /*TreeViewItem*/var container = containerOut.container;
            if (!selected) 
            {
                item = this.SelectedItem;
                container = this._selectedContainer;
            } 

            this.ChangeSelection(item, container, selected); 
        }, 
//        private bool 
        GetFirstItem:function(/*out object item*/itemOut, /*out TreeViewItem container*/containerOut) 
        {
            if (this.HasItems)
            {
                item = this.Items.Get(0); 
                container = this.ItemContainerGenerator.ContainerFromIndex(0);
                container = container instanceof TreeViewItem ? container : null;
                return ((item != null) && (container != null)); 
            } 
            else
            { 
                item = null;
                container = null;
                return false;
            } 
        },

        /// <summary> 
        ///     Called when a keyboard key is pressed down.
        /// </summary>
        /// <param name="e">Event Arguments</param>
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e) 
        {
        	ItemsControl.prototype.OnKeyDown.call(this, e); 
            if (!e.Handled) 
            {
                if (this.IsControlKeyDown) 
                {
                    switch (e.Key)
                    {
                        case Key.Up: 
                        case Key.Down:
                        case Key.Left: 
                        case Key.Right: 
                        case Key.Home:
                        case Key.End: 
                        case Key.PageUp:
                        case Key.PageDown:
                            if (this.HandleScrollKeys(e.Key))
                            { 
                                e.Handled = true;
                            } 
                            break; 
                    }
                } 
                else
                {
                    switch (e.Key)
                    { 
                        case Key.Up:
                        case Key.Down: 
                            if ((this._selectedContainer == null) && this.FocusFirstItem()) 
                            {
                                e.Handled = true; 
                            }
                            break;

                        case Key.Home: 
                            if (this.FocusFirstItem())
                            { 
                                e.Handled = true; 
                            }
                            break; 

                        case Key.End:
                            if (this.FocusLastItem())
                            { 
                                e.Handled = true;
                            } 
                            break; 

                        case Key.PageUp: 
                        case Key.PageDown:
                            if (this._selectedContainer == null)
                            {
                                if (this.FocusFirstItem()) 
                                {
                                    e.Handled = true; 
                                } 
                            }
                            else if (this.HandleScrollByPage(e)) 
                            {
                                e.Handled = true;
                            }
                            break; 

                        case Key.Tab: 
                            if (this.IsShiftKeyDown && this.IsKeyboardFocusWithin) 
                            {
                                // SHIFT-TAB behavior for KeyboardNavigation needs to happen at the TreeView level 
                                if (this.MoveFocus(new TraversalRequest(FocusNavigationDirection.Previous)))
                                {
                                    e.Handled = true;
                                } 
                            }
                            break; 
 
                        case Key.Multiply:
                            if (this.ExpandSubtree(this._selectedContainer)) 
                            {
                                e.Handled = true;
                            }
                            break; 
                    }
                } 
            } 
        },
//        private bool 
        FocusFirstItem:function()
        { 
            /*FrameworkElement*/var container;
            return this.NavigateToStartInternal(new ItemNavigateArgs(Keyboard.PrimaryDevice, Keyboard.Modifiers), 
            		true /*shouldFocus*/, /*out container*/{"container" : container});
        },
 
//        private bool 
        FocusLastItem:function() 
        { 
            /*FrameworkElement*/var container;
            return this.NavigateToEndInternal(new ItemNavigateArgs(Keyboard.PrimaryDevice, Keyboard.Modifiers), 
            		true /*shouldFocus*/, /*out container*/{"container" : container}); 
        },

//        private bool 
        HandleScrollKeys:function(/*Key*/ key)
        { 
            /*ScrollViewer*/var scroller = this.ScrollHost;
            if (scroller != null) 
            { 
                var invert = (FlowDirection == FlowDirection.RightToLeft);
                switch (key) 
                {
                    case Key.Up:
                        scroller.LineUp();
                        return true; 

                    case Key.Down: 
                        scroller.LineDown(); 
                        return true;
 
                    case Key.Left:
                        if (invert)
                        {
                            scroller.LineRight(); 
                        }
                        else 
                        { 
                            scroller.LineLeft();
                        } 
                        return true;

                    case Key.Right:
                        if (invert) 
                        {
                            scroller.LineLeft(); 
                        } 
                        else
                        { 
                            scroller.LineRight();
                        }
                        return true;
 
                    case Key.Home:
                        scroller.ScrollToTop(); 
                        return true; 

                    case Key.End: 
                        scroller.ScrollToBottom();
                        return true;

                    case Key.PageUp: 
                        //if vertically scrollable - go vertical, otherwise horizontal
                        if(DoubleUtil.GreaterThan(scroller.ExtentHeight, scroller.ViewportHeight)) 
                        { 
                            scroller.PageUp();
                        } 
                        else
                        {
                            scroller.PageLeft();
                        } 
                        return true;
 
                    case Key.PageDown: 
                        //if vertically scrollable - go vertical, otherwise horizontal
                        if(DoubleUtil.GreaterThan(scroller.ExtentHeight, scroller.ViewportHeight)) 
                        {
                            scroller.PageDown();
                        }
                        else 
                        {
                            scroller.PageRight(); 
                        } 
                        return true;
 
                }
            }

            return false; 
        },
 
//        private bool 
        HandleScrollByPage:function(/*KeyEventArgs*/ e) 
        {
            /*IInputElement*/var originalFocusedElement = Keyboard.FocusedElement; 
            /*ItemsControl*/var parentItemsControl = ItemsControl.ItemsControlFromItemContainer(this._selectedContainer);
            /*ItemInfo*/var startingInfo = (parentItemsControl != null)
                ? parentItemsControl.ItemInfoFromContainer(this._selectedContainer)
                : null; 

            /*FrameworkElement*/var startingContainer = this._selectedContainer.HeaderElement; 
            if (startingContainer == null) 
            {
                startingContainer = this._selectedContainer; 
            }

            return this.NavigateByPage(startingInfo,
                startingContainer, 
                (e.Key == Key.PageUp ? FocusNavigationDirection.Up : FocusNavigationDirection.Down),
                new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
        }, 

        /// <summary> 
        /// Recursively expands all the nodes under the given item.
        /// </summary>
        /// <returns>true if the subtree was expanded, false otherwise.</returns>
        /// <remarks>This can be overriden to modify/disable the numpad-* behavior.</remarks> 
//        protected virtual bool 
        ExpandSubtree:function(/*TreeViewItem*/ container)
        { 
            if (container != null) 
            {
                container.ExpandSubtree(); 
                return true;
            }

            return false; 
        },

        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed.
        /// </summary> 
//        protected override void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        	ItemsControl.prototype.OnIsKeyboardFocusWithinChanged.call(this, e); 

            // When focus within changes we need to update the value of IsSelectionActive. 
            var isSelectionActive = false;
            var isKeyboardFocusWithin = this.IsKeyboardFocusWithin;
            if (isKeyboardFocusWithin)
            { 
                // Keyboard focus is within the control, selection should appear active.
                isSelectionActive = true; 
            } 
            else
            { 
                /*DependencyObject*/
            	var currentFocus = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null;
                if (currentFocus != null)
                {
                    /*UIElement*/
                	var root = KeyboardNavigation.GetVisualRoot(this);
                	root = root instanceof UIElement ? root : null; 
                    if (root != null && root.IsKeyboardFocusWithin)
                    { 
                        if (FocusManager.GetFocusScope(currentFocus) != root) 
                        {
                            isSelectionActive = true; 
                        }
                    }
                }
            } 

            if (this.GetValue(Selector.IsSelectionActiveProperty) != isSelectionActive) 
            { 
                // The value changed, set the new value.
                this.SetValue(Selector.IsSelectionActivePropertyKey, isSelectionActive); 
            }

            if (isKeyboardFocusWithin && this.IsKeyboardFocused && (this._selectedContainer != null) && !this._selectedContainer.IsKeyboardFocusWithin)
            { 
                this._selectedContainer.Focus();
            } 
        }, 

        /// <summary> 
        ///     Polymorphic method which gets called when control gets focus.
        ///     Passes on the focus to an inner TreeViewItem if necessary.
        /// </summary>
//        protected override void 
        OnGotFocus:function(/*RoutedEventArgs*/ e) 
        {
        	ItemsControl.prototype.OnGotFocus.call(this, e); 
 
            // Pass on the focus to selecteContainer if TreeView recieves focus
            // but its IsKeyboardFocusWithin doesnt change. 
            if (this.IsKeyboardFocusWithin && this.IsKeyboardFocused && (this._selectedContainer != null) 
            		&& !this._selectedContainer.IsKeyboardFocusWithin)
            {
            	this._selectedContainer.Focus();
            } 
        },
 
//        private void 
        OnFocusEnterMainFocusScope:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            // When KeyboardFocus comes back to the main focus scope and the TreeView does not have focus within- clear IsSelectionActivePrivateProperty 
            if (!this.IsKeyboardFocusWithin)
            {
            	this.ClearValue(Selector.IsSelectionActivePropertyKey);
            } 
        },
 
//        private static DependencyObject 
        FindParent:function(/*DependencyObject*/ o) 
        {
            var v = o instanceof Visual ? o : null; 
            var ce = (v == null) ? (o instanceof ContentElement ? o : null) : null;

            if (ce != null)
            { 
                o = ContentOperations.GetParent(ce);
                if (o != null) 
                { 
                    return o;
                } 
                else
                {
                    /*FrameworkContentElement*/
                	var fce = ce instanceof FrameworkContentElement ? ce : null;
                    if (fce != null) 
                    {
                        return fce.Parent; 
                    } 
                }
            } 
            else if (v != null)
            {
                return VisualTreeHelper.GetParent(v);
            } 

            return null; 
        } 
	});
	
	Object.defineProperties(TreeView.prototype,{

        /// <summary>
        ///     Specifies the selected item.
        /// </summary> 
//        public object 
        SelectedItem:
        { 
            get:function()
            { 
                return this.GetValue(TreeView.SelectedItemProperty);
            }
        },
        /// <summary> 
        ///     Specifies the a value on the selected item as defined by <see cref="SelectedValuePath" />.
        /// </summary> 
//        public object 
        SelectedValue:
        { 
            get:function()
            {
                return this.GetValue(TreeView.SelectedValueProperty);
            } 
        },
 
        /// <summary>
        ///     Specifies the path to query on <see cref="SelectedItem" /> to calculate <see cref="SelectedValue" />.
        /// </summary>
//        public string 
        SelectedValuePath:
        { 
            get:function() { return this.GetValue(TreeView.SelectedValuePathProperty); }, 
            set:function(value) { this.SetValue(TreeView.SelectedValuePathProperty, value); }
        }, 
 
//        internal bool 
        IsSelectionChangeActive: 
        {
            get:function() { return this._bits[Bits.IsSelectionChangeActive]; }, 
            set:function(value) { this._bits[Bits.IsSelectionChangeActive] = value; }
        },

//        internal bool 
        IsSelectedContainerHookedUp: 
        {
            get:function() 
            {
                return (this._selectedContainer != null) && (this._selectedContainer.ParentTreeView == this);
            }
        }, 

//        internal TreeViewItem 
        SelectedContainer: 
        { 
            get:function()
            { 
                return this._selectedContainer;
            }
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
 
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType
        DTypeThemeStyleKey: 
        {
            get:function() { return _dType; }
        }
	});
	
	Object.defineProperties(TreeView,{
//		private static readonly DependencyPropertyKey 
		SelectedItemPropertyKey:
        {
        	get:function(){
        		if(TreeView._SelectedItemPropertyKey === undefined){
        			TreeView._SelectedItemPropertyKey  =
        	            DependencyProperty.RegisterReadOnly("SelectedItem", 
        	            		Object.Type, 
        	            		TreeView.Type, 
        	            		/*new FrameworkPropertyMetadata(null)*/
        	            		FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return TreeView._SelectedItemPropertyKey;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the <see cref="SelectedItem"/> property. 
        ///     Default Value: null 
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedItemProperty:
        {
        	get:function(){
        		return TreeView.SelectedItemPropertyKey.DependencyProperty;
        	}
        },  


//        private static readonly DependencyPropertyKey 
        SelectedValuePropertyKey:
        {
        	get:function(){
        		if(TreeView._SelectedValuePropertyKey === undefined){
        			TreeView._SelectedValuePropertyKey = 
        	            DependencyProperty.RegisterReadOnly("SelectedValue", 
        	            		Object.Type, TreeView.Type,
        	            		/*new FrameworkPropertyMetadata((object)null)*/
        	            		FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return TreeView._SelectedValuePropertyKey;
        	}
        },  
 
        /// <summary> 
        ///     The DependencyProperty for the <see cref="SelectedValue"/> property.
        ///     Default Value: null 
        /// </summary>
//        public static readonly DependencyProperty 
        SelectedValueProperty:
        {
        	get:function(){
        		return TreeView.SelectedValuePropertyKey.DependencyProperty;
        	}
        },  

        /// <summary> 
        ///     The DependencyProperty for the <see cref="SelectedValuePath"/> property. 
        ///     Default Value: String.Empty
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectedValuePathProperty:
        {
        	get:function(){
        		if(TreeView._SelectedValuePathProperty === undefined){
        			TreeView._SelectedValuePathProperty =
        	            DependencyProperty.Register(
        	                    "SelectedValuePath",
        	                    String.Type, 
        	                    TreeView.Type,
        	                    /*new FrameworkPropertyMetadata( 
        	                            String.Empty, 
        	                            new PropertyChangedCallback(null, OnSelectedValuePathChanged))*/
        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB(String.Empty, 
        	                            new PropertyChangedCallback(null, OnSelectedValuePathChanged)));
        		}
        		
        		return TreeView._SelectedValuePathProperty;
        	}
        },  
 

        /// <summary> 
        ///     Event fired when <see cref="SelectedItem"/> changes.
        /// </summary> 
//        public static readonly RoutedEvent 
        SelectedItemChangedEvent:
        {
        	get:function(){
        		if(TreeView._SelectedItemChangedEvent === undefined){
        			TreeView._SelectedItemChangedEvent = EventManager.RegisterRoutedEvent("SelectedItemChanged", RoutingStrategy.Bubble, 
        					RoutedPropertyChangedEventHandler.Type, 
        	        		TreeView.Type); 
        		}
        		
        		return TreeView._SelectedItemChangedEvent;
        	}
        },  
        
//      private static bool 
        IsControlKeyDown:
        {
            get:function()
            { 
                return ((Keyboard.Modifiers & ModifierKeys.Control) == (ModifierKeys.Control));
            } 
        }, 

//        private static bool 
        IsShiftKeyDown: 
        {
            get:function()
            {
                return ((Keyboard.Modifiers & ModifierKeys.Shift) == (ModifierKeys.Shift)); 
            }
        }, 

	});
	
//    private static void 
    function OnSelectedValuePathChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        SelectedValuePathBindingExpression.ClearValue(d);
        d.UpdateSelectedValue(d.SelectedItem); 
    } 

//    private static DependencyObject 
    function FindParent(/*DependencyObject*/ o) 
    {
        var v = o instanceof Visual ? o : null; 
        /*ContentElement*/var ce = (v == null) ? (o instanceof ContentElement ? o : null) : null;

        if (ce != null)
        { 
            o = ContentOperations.GetParent(ce);
            if (o != null) 
            { 
                return o;
            } 
            else
            {
                /*FrameworkContentElement*/var fce = ce instanceof FrameworkContentElement ? ce : null;
                if (fce != null) 
                {
                    return fce.Parent; 
                } 
            }
        } 
        else if (v != null)
        {
            return VisualTreeHelper.GetParent(v);
        } 

        return null; 
    } 
    
//  static TreeView()
	function Initialize()
    { 
		_dType = DependencyObjectType.FromSystemTypeInternal(TreeView.Type);
		
		FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(TreeView.Type, 
				/*new FrameworkPropertyMetadata(TreeView.Type)*/
				FrameworkPropertyMetadata.BuildWithDV(TreeView.Type)); 
//        VirtualizingPanel.IsVirtualizingProperty.OverrideMetadata(TreeView.Type, 
//        		/*new FrameworkPropertyMetadata(false)*/
//        		FrameworkPropertyMetadata.BuildWithDV(false));

        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(TreeView.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained));
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(TreeView.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.None)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.None));
//        VirtualizingStackPanel.ScrollUnitProperty.OverrideMetadata(TreeView.Type, 
//        		/*new FrameworkPropertyMetadata(ScrollUnit.Pixel)*/
//        		FrameworkPropertyMetadata.BuildWithDV(ScrollUnit.Pixel)); 
    };
	
	TreeView.Type = new Type("TreeView", TreeView, [ItemsControl.Type]);
	Initialize();
	
	return TreeView;
});
 
