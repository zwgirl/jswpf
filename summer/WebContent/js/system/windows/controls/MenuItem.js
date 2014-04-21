/**
 * MenuItem
 */
/// <summary> 
///     A child item of Menu.
///     MenuItems can be selected to invoke commands.
///     MenuItems can be headers for submenus.
///     MenuItems can be checked or unchecked. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl", "input/ICommandSource",
        "input/AccessKeyManager", "primitives/MenuBase", "windows/RoutedPropertyChangedEventHandler"], 
		function(declare, Type, HeaderedContentControl, ICommandSource,
				AccessKeyManager, MenuBase, RoutedPropertyChangedEventHandler){
//    private enum
	var BoolField = declare(Object, {});
	
	BoolField.OpenedWithKeyboard = 0x01,
	BoolField.IgnoreNextMouseLeave = 0x02, 
	BoolField.IgnoreMouseEvents = 0x04, 
	BoolField.MouseEnterOnMouseMove = 0x08,
	BoolField.CanExecuteInvalid = 0x10;

//    private static ComponentResourceKey 
	var _topLevelItemTemplateKey = null; 
//    private static ComponentResourceKey 
	var _topLevelHeaderTemplateKey = null;
//    private static ComponentResourceKey 
    var _submenuItemTemplateKey = null; 
//    private static ComponentResourceKey 
    var _submenuHeaderTemplateKey = null; 
    
//    private const string 
    var PopupTemplateName = "PART_Popup";

//    private static DependencyObjectType 
    var _dType;
    
	var MenuItem = declare("MenuItem", HeaderedContentControl,{
		constructor:function(){
//		    private MenuItem 
			this._currentSelection = null;
//		    private Popup 
			this._submenuPopup = null;

//		    DispatcherTimer 
			this._openHierarchyTimer = null; 
//		    DispatcherTimer 
			this._closeHierarchyTimer = null;

		    /// <SecurityNote> 
		    ///     Critical: Setting this to true indicates that the mouse down was user initiated
		    /// </SecurityNote> 
//		    private bool 
			this._userInitiatedPress = false;
		    
//	        private object 
			this._currentItem = null;
		},
        /// <summary>
        ///     Add / Remove Click handler 
        /// </summary> 
//        public event RoutedEventHandler Click 
//        {
//            add
//            {
//                AddHandler(MenuItem.ClickEvent, value); 
//            }
// 
//            remove 
//            {
//                RemoveHandler(MenuItem.ClickEvent, value); 
//            }
//        }
        AddClick:function(value)
        {
            this.AddHandler(MenuItem.ClickEvent, value); 
        },

        RemoveClick:function(value) 
        {
        	this.RemoveHandler(MenuItem.ClickEvent, value); 
        },

        /// <summary>
        ///     Add / Remove Checked handler
        /// </summary> 
//        public event RoutedEventHandler Checked 
//        { 
//
//        }
        AddChecked:function(value)
        { 
            AddHandler(CheckedEvent, value);
        },

        RemoveChecked:function(value) 
        {
            RemoveHandler(CheckedEvent, value); 
        }, 
 
        /// <summary>
        ///     Add / Remove Unchecked handler
        /// </summary>
//        public event RoutedEventHandler Unchecked
//        { 
//
//        } 
        AddUnchecked:function(value) 
        {
            AddHandler(UncheckedEvent, value); 
        },

        RemoveUnchecked:function(value)
        { 
            RemoveHandler(UncheckedEvent, value);
        }, 

        /// <summary> 
        ///     Add / Remove SubmenuOpenedEvent handler
        /// </summary> 
//        public event RoutedEventHandler SubmenuOpened
//        { 
//
//        } 
        AddSubmenuOpened:function(value)
        {
            AddHandler(SubmenuOpenedEvent, value);
        }, 
        RemoveSubmenuOpened:function(value)
        { 
            RemoveHandler(SubmenuOpenedEvent, value); 
        },

        /// <summary>
        ///     Add / Remove SubmenuClosedEvent handler
        /// </summary> 
//        public event RoutedEventHandler SubmenuClosed 
//        { 
//
//        } 
        Add:function(value)
        { 
            AddHandler(SubmenuClosedEvent, value);
        },
        Remove:function(value)
        { 
            RemoveHandler(SubmenuClosedEvent, value);
        }, 
 
//        private void 
        OnCommandChanged:function(/*ICommand*/ oldCommand, /*ICommand*/ newCommand) 
        {
            if (oldCommand != null) 
            {
            	this.UnhookCommand(oldCommand);
            }
            if (newCommand != null) 
            {
            	this.HookCommand(newCommand); 
            } 

            CoerceValue(HeaderProperty); 
            CoerceValue(InputGestureTextProperty);
        },

//        private void 
        UnhookCommand:function(/*ICommand*/ command) 
        {
            CanExecuteChangedEventManager.RemoveHandler(command, OnCanExecuteChanged); 
            this.UpdateCanExecute(); 
        },
 
//        private void 
        HookCommand:function(/*ICommand*/ command)
        {
            CanExecuteChangedEventManager.AddHandler(command, OnCanExecuteChanged);
            this.UpdateCanExecute(); 
        },
 
//        private void 
        OnCanExecuteChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        {
        	this.UpdateCanExecute(); 
        },

//        private void 
        UpdateCanExecute:function()
        { 
            MenuItem.SetBoolField(this, BoolField.CanExecuteInvalid, false);
            if (Command != null) 
            { 
                // Perf optimization - only raise CanExecute event if the menu is open
                /*MenuItem*/var parent = ItemsControl.ItemsControlFromItemContainer(this);
                parent instanceof MenuItem ? parent : null; 
                if (parent == null || parent.IsSubmenuOpen)
                {
                    this.CanExecute = /*MS.Internal.Commands.*/CommandHelpers.CanExecuteCommandSource(this);
                } 
                else
                { 
                	this.CanExecute = true; 
                    MenuItem.SetBoolField(this, BoolField.CanExecuteInvalid, true);
                } 
            }
            else
            {
            	this.CanExecute = true; 
            }
        }, 
 
//        private void 
        RegisterToOpenOnLoad:function()
        { 
        	this.Loaded += new RoutedEventHandler(OpenOnLoad); 
        },
 
//        private void 
        OpenOnLoad:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            // Open menu after it has rendered (Loaded is fired before 1st render)
            Dispatcher.BeginInvoke(DispatcherPriority.Input, new DispatcherOperationCallback(/*delegate*/function(/*object*/ param) 
            {
                CoerceValue(MenuItem.IsSubmenuOpenProperty); 
 
                return null;
            }), null); 
        },
 
//        private void 
        OnPopupClosed:function(/*object*/ source, /*EventArgs*/ e)
        { 
        	this.OnSubmenuClosed(new RoutedEventArgs(MenuItem.SubmenuClosedEvent, this));
        },

        /// <summary> 
        ///
        /// </summary> 
        /// <param name="e"></param> 
//        protected virtual void 
        OnSubmenuOpened:function(/*RoutedEventArgs*/ e)
        { 
        	this.RaiseEvent(e);
        },

        /// <summary> 
        ///
        /// </summary> 
        /// <param name="e"></param> 
//        protected virtual void 
        OnSubmenuClosed:function(/*RoutedEventArgs*/ e)
        { 
        	this.RaiseEvent(e);
        },

//        private void 
        UpdateRole:function() 
        {
            /*MenuItemRole*/var type; 
 
            if (!this.IsCheckable && this.HasItems)
            { 
                if (LogicalParent instanceof Menu)
                {
                    type = MenuItemRole.TopLevelHeader;
                } 
                else
                { 
                    type = MenuItemRole.SubmenuHeader; 
                }
            } 
            else
            {
                if (this.LogicalParent instanceof Menu)
                { 
                    type = MenuItemRole.TopLevelItem;
                } 
                else 
                {
                    type = MenuItemRole.SubmenuItem; 
                }
            }

            this.SetValue(MenuItem.RolePropertyKey, type); 
        },

//        private void 
        UpdateIsPressed:function()
        {
            /*Rect*/var itemBounds = new Rect(new Point(), RenderSize); 

            if ((Mouse.LeftButton == MouseButtonState.Pressed) && 
            		this.IsMouseOver && 
                itemBounds.Contains(Mouse.GetPosition(this)))
            { 
            	this.IsPressed = true;
            }
            else
            { 
            	this.ClearValue(MenuItem.IsPressedPropertyKey);
            } 
        }, 

        /// <summary>
        ///     Called when IsChecked becomes true. 
        /// </summary>
        /// <param name="e">Event arguments for the routed event that is raised by the default implementation of this method.</param>
//        protected virtual void 
        OnChecked:function(/*RoutedEventArgs*/ e)
        { 
        	this.RaiseEvent(e);
        }, 
 
        /// <summary>
        ///     Called when IsChecked becomes false. 
        /// </summary>
        /// <param name="e">Event arguments for the routed event that is raised by the default implementation of this method.</param>
//        protected virtual void 
        OnUnchecked:function(/*RoutedEventArgs*/ e)
        { 
        	this.RaiseEvent(e);
        }, 

        // When opening the menu item, tell all other menu items at the same
        // level that their submenus should not animate 
//        private void 
        NotifySiblingsToSuspendAnimation:function()
        { 
            // Don't need to set this property if it is already false 
            if (!this.IsSuspendingPopupAnimation)
            { 
                var openedWithKeyboard = MenuItem.GetBoolField(this, BoolField.OpenedWithKeyboard);

                // When opened by the keyboard, don't animate - set menumode on all items
                // otherwise ignore this MenuItem so it animates when opening 
                /*MenuItem*/var ignore = openedWithKeyboard ? null : this;
 
                /*ItemsControl*/var parent = ItemsControl.ItemsControlFromItemContainer(this); 
                MenuBase.SetSuspendingPopupAnimation(parent, ignore, true);
 
                if (!openedWithKeyboard)
                {
                    // Delay setting InMenuMode on this until after bindings have done their
                    // work and opened the popup (if it exists) 
                    Dispatcher.BeginInvoke(DispatcherPriority.Input,
                            /*(DispatcherOperationCallback)delegate*/function(/*object*/ arg) 
                            { 
                                (/*(MenuItem)*/arg).IsSuspendingPopupAnimation = true;
                                return null; 
                            },
                            this);
                }
                else 
                {
                    MenuItem.SetBoolField(this, BoolField.OpenedWithKeyboard, false); 
                } 
            }
        }, 

        // Set IsSuspendingAnimation=false on all our children
//        private void 
        NotifyChildrenToResumeAnimation:function()
        { 
            MenuBase.SetSuspendingPopupAnimation(this, null, false);
        }, 

        /// <summary> 
        ///     This virtual method in called when IsInitialized is set to true and it raises an Initialized event
        /// </summary> 
//        protected override void 
        OnInitialized:function(/*EventArgs*/ e) 
        {
            base.OnInitialized(e); 
            this.UpdateRole();
        },
 
        /// <summary> 
        /// Prepare the element to display the item.  This may involve
        /// applying styles, setting bindings, etc. 
        /// </summary>
//        protected override void 
        PrepareContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item)
        {
            base.PrepareContainerForItemOverride(element, item); 

            MenuItem.PrepareMenuItem(element, item); 
        }, 

        /// <summary>
        /// This virtual method in called when the MenuItem is clicked and it raises a Click event
        /// </summary> 
        /// <SecurityNote>
        /// Critical - Calls OnClickImple which sets the userInitiated bit on a command, which is used 
        ///            for security purposes later. 
        /// TreatAsSafe - passes false for userInitiated
        /// </SecurityNote> 
//        protected virtual void 
        OnClick:function()
        {
        	this.OnClickImpl(false); 
        },
 
        /// <SecurityNote> 
        /// Critical - accepts a parameter which may be used to set the userInitiated
        ///             bit on a command, which is used for security purposes later. 
        /// </SecurityNote>
//        internal virtual void 
        OnClickCore:function(/*bool*/ userInitiated)
        { 
        	this.OnClick();
        }, 
 
        /// <SecurityNote>
        /// Critical - Calls InvokeClickAfterRender which sets the userInitiated 
        ///             bit on a command, which is used for security purposes later.
        /// </SecurityNote>
//        internal void 
        OnClickImpl:function(/*bool*/ userInitiated) 
        {
            if (this.IsCheckable) 
            { 
            	this.SetCurrentValueInternal(MenuItem.IsCheckedProperty, !this.IsChecked);
            } 
            // Sub menu items will always be focused if they are moused over or keyboard navigated onto.
            // When you click on a top-level menu item it should take focus.
            // Sub menu items will not be focused if the mouse has moved out of
            // the active hierarchy and has not settled on a new hierarchy yet. 
            if (!this.IsKeyboardFocusWithin)
            { 
            	this.FocusOrSelect(); 
            }
 
            // Raise the preview click.  This will be handled by the parent menu and cause this submenu to disappear.
            // It will also block until render-priority queue items have completed.
            this.RaiseEvent(new RoutedEventArgs(MenuItem.PreviewClickEvent, this));
 
            // Raise the automation event first *before* raising the Click event -
            // otherwise automation may not get the event until after raising the click 
            // event returns, which could be problematic if the handler for that event 
            // displayed a modal dialog or did other significant work.
//            if (AutomationPeer.ListenerExists(AutomationEvents.InvokePatternOnInvoked)) 
//            {
//                AutomationPeer peer = UIElementAutomationPeer.CreatePeerForElement(this);
//                if (peer != null)
//                    peer.RaiseAutomationEvent(AutomationEvents.InvokePatternOnInvoked); 
//            }
 
            // We have just caused all the popup windows to be hidden and queued for async 
            // destroy (at < render priority).  Hiding the window will cause the underlying windows
            // to be queued for repaint -- we need to wait for any windows in our context to repaint. 
            Dispatcher.BeginInvoke(DispatcherPriority.Render, new DispatcherOperationCallback(InvokeClickAfterRender), userInitiated);
        },

        /// <SecurityNote> 
        /// Critical - sets the userInitiated bit on a command, which is used
        ///            for security purposes later. 
        /// </SecurityNote> 
//        private object 
        InvokeClickAfterRender:function(/*object*/ arg) 
        {
            var userInitiated = /*(bool)*/arg;
            this.RaiseEvent(new RoutedEventArgs(MenuItem.ClickEvent, this));
            /*MS.Internal.Commands.*/CommandHelpers.CriticalExecuteCommandSource(this, userInitiated); 
            return null;
        }, 
 

        /// <summary> 
        ///        Called when the left mouse button is pressed.
        /// </summary>
        /// <param name="e"></param>
        /// <SecurityNote> 
        ///     Critical: Sets an internal variable in case input was user initiated and button was pressed
        ///     TreatAsSafe: The variable is not exposed and there is a demand for UserInitiatedRoutedEvent permission 
        ///                 before setting the variable 
        /// </SecurityNote>
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        {
            if (!e.Handled)
            { 
            	this.HandleMouseDown(e);
            	this.UpdateIsPressed(); 
                if (e.UserInitiated) 
                {
                	this._userInitiatedPress = true; 
                }
            }
            base.OnMouseLeftButtonDown(e);
        }, 

 
        /// <summary> 
        ///        Called when the right mouse button is pressed.
        /// </summary> 
        /// <param name="e"></param>
        /// <SecurityNote>
        ///     Critical: Sets an internal variable in case input was user initiated and button was pressed
        ///     TreatAsSafe: The variable is not exposed and there is a demand for UserInitiatedRoutedEvent permission 
        ///                 before setting the variable
        /// </SecurityNote> 
//        protected override void 
        OnMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            if (!e.Handled)
            {
            	this.HandleMouseDown(e);
                if (e.UserInitiated) 
                {
                	this._userInitiatedPress = true; 
                } 
            }
            base.OnMouseRightButtonDown(e); 
        },

        /// <summary>
        ///        Called when the left mouse button is released. 
        /// </summary>
        /// <param name="e"></param> 
        /// <SecurityNote> 
        /// Critical - sets _userInitiatedPress
        /// TreatAsSafe - setting this to false is safe 
        /// </SecurityNote>
//        protected override void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e)
        { 
            if (!e.Handled)
            { 
            	this.HandleMouseUp(e); 
                this.UpdateIsPressed();
                this._userInitiatedPress = false; 
            }
            base.OnMouseLeftButtonUp(e);
        },
 
        /// <summary>
        ///        Called when the right mouse button is released. 
        /// </summary> 
        /// <param name="e"></param>
        /// <SecurityNote> 
        /// Critical - sets _userInitiatedPress
        /// TreatAsSafe - setting this to false is safe
        /// </SecurityNote>
//        protected override void 
        OnMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e)
        { 
            if (!e.Handled) 
            {
            	this.HandleMouseUp(e); 
            	this._userInitiatedPress = false;
            }
            base.OnMouseRightButtonUp(e);
        }, 

//        private void 
        HandleMouseDown:function(/*MouseButtonEventArgs*/ e) 
        { 
            // ((0, 0), RenderSize) is the closest we can get to checking if the
            // mouse event was on the header portion of the MenuItem (i.e. not on 
            // any part of the submenu)
            /*Rect*/var r = new Rect(new Point(), this.RenderSize);

            if (r.Contains(e.GetPosition(this))) 
            {
                if (e.ChangedButton == MouseButton.Left || (e.ChangedButton == MouseButton.Right && this.InsideContextMenu)) 
                { 
                    // Click happens on down for headers
                    /*MenuItemRole*/var role = this.Role; 

                    if (role == MenuItemRole.TopLevelHeader || role == MenuItemRole.SubmenuHeader)
                    {
                    	this.ClickHeader(); 
                    }
                } 
            } 
            // Handle mouse messages b/c they were over me, I just didn't use it
            e.Handled = true; 
        },

        /// <SecurityNote>
        /// Critical - Calls ClickItem, setting the userInitiated 
        ///             bit, which is used for security purposes later.
        /// TreatAsSafe - e.UserInitiated can always be trusted 
        /// </SecurityNote> 
//        private void 
        HandleMouseUp:function(/*MouseButtonEventArgs*/ e) 
        {
            // See comment above in HandleMouseDown.
            /*Rect*/var r = new Rect(new Point(), this.RenderSize);
 
            if (r.Contains(e.GetPosition(this)))
            { 
                if (e.ChangedButton == MouseButton.Left || (e.ChangedButton == MouseButton.Right && this.InsideContextMenu)) 
                {
                    // Click happens on up for items 
                    /*MenuItemRole*/var role = this.Role;

                    if (role == MenuItemRole.TopLevelItem || role == MenuItemRole.SubmenuItem)
                    { 
                        if (_userInitiatedPress == true)
                        { 
                        	this.ClickItem(e.UserInitiated); 
                        }
                        else 
                        {
                            // This is the case where the mouse down happend on a different element
                            // but the moust up is happening on the menuitem. this is to prevent spoofing
                            // attacks where someone substitutes an element with a menu item 
                        	this.ClickItem(false);
                        } 
                    } 

                    // 
                    /*
                    // Click happens on up for top level items that are already open
                    if (role == MenuItemRole.TopLevelHeader && IsSubmenuOpen)
                    { 
                        ClickHeader();
                        e.Handled = true; 
                    } 
                    */
                } 
            }

            if (e.ChangedButton != MouseButton.Right || this.InsideContextMenu)
            { 
                // Handle all clicks unless there's a possibility of a ContextMenu inside a Menu.
                e.Handled = true; 
            } 
        },
 
        /// <summary>
        ///     An event reporting the mouse entered or left this element. 
        /// </summary>
//        protected override void 
        OnMouseLeave:function(/*MouseEventArgs*/  e)
        {
            base.OnMouseLeave(e); 

            /*MenuItemRole*/var role = this.Role; 
 
            // When we're a top-level menuitem we have to check if the menu has capture.
            // If it doesn't we fall to the else below where we are just mousing around 
            // the top-level menuitems.
            // (Note that Submenu items/headers do not have to look for capture.)
            if (((role == MenuItemRole.TopLevelHeader || role == MenuItemRole.TopLevelItem) && this.IsInMenuMode)
                || (role == MenuItemRole.SubmenuHeader || role == MenuItemRole.SubmenuItem)) 
            {
            	this.MouseLeaveInMenuMode(role); 
            } 
            else
            { 
                // Here we don't have capture and we're just mousing over
                // top-level menu items.  IsSelected should correspond to IsMouseOver.
                if (this.IsMouseOver != this.IsSelected)
                { 
                	this.SetCurrentValueInternal(IsSelectedProperty, BooleanBoxes.Box(IsMouseOver));
                } 
            } 

            this.UpdateIsPressed(); 
        },

        /// <summary>
        /// This is the method that responds to the MouseEvent event. 
        /// </summary>
//        protected override void 
        OnMouseMove:function(/*MouseEventArgs*/ e) 
        { 
            // Ignore any mouse moves on ourselves while the popup is opening.
            /*MenuItem*/var parent = ItemsControl.ItemsControlFromItemContainer(this);
            parent = parent instanceof MenuItem ? parent : null; 
            if (parent != null &&
                MenuItem.GetBoolField(parent, BoolField.MouseEnterOnMouseMove))
            {
                MenuItem.SetBoolField(parent, BoolField.MouseEnterOnMouseMove, false); 
                this.MouseEnterHelper();
            } 
        }, 

        /// <summary> 
        ///     An event reporting the mouse entered or left this element.
        /// </summary>
//        protected override void 
        OnMouseEnter:function(/*MouseEventArgs*/  e)
        { 
            base.OnMouseEnter(e);
            this.MouseEnterHelper(); 
        }, 

//        private void 
        MouseEnterHelper:function() 
        {
            /*ItemsControl*/var parent = ItemsControl.ItemsControlFromItemContainer(this);
            // Do not enter and highlight this item until the popup has opened
            // This prevents immediately selecting a submenu item when opening the menu 
            // because the mouse was already where the menu item appeared
            if (parent == null || !MenuItem.GetBoolField(parent, BoolField.IgnoreMouseEvents)) 
            { 
                /*MenuItemRole*/var role = this.Role;
 
                // When we're a top-level menuitem we have to check if the menu has capture.
                // If it doesn't we fall to the else below where we are just mousing around
                // the top-level menuitems.
                // (Note that Submenu items/headers do not have to look for capture.) 
                if (((role == MenuItemRole.TopLevelHeader || role == MenuItemRole.TopLevelItem) && OpenOnMouseEnter)
                    || (role == MenuItemRole.SubmenuHeader || role == MenuItemRole.SubmenuItem)) 
                { 
                	this.MouseEnterInMenuMode(role);
                } 
                else
                {
                    // Here we don't have capture and we're just mousing over
                    // top-level menu items.  IsSelected should correspond to IsMouseOver. 
                    if (this.IsMouseOver != this.IsSelected)
                    { 
                    	this.SetCurrentValueInternal(IsSelectedProperty, this.IsMouseOver); 
                    }
                } 

                this.UpdateIsPressed();
            }
            else if (parent instanceof MenuItem) 
            {
                MenuItem.SetBoolField(parent, BoolField.MouseEnterOnMouseMove, true); 
            } 
        },
 
//        private void 
        MouseEnterInMenuMode:function(/*MenuItemRole*/ role)
        {
            switch (role)
            { 
                case MenuItemRole.TopLevelHeader:
                case MenuItemRole.TopLevelItem: 
                    { 
                        // When mousing over a top-level hierarchy, it should open immediately.
                        if (!this.IsSubmenuOpen) 
                        {
                        	this.OpenHierarchy(role);
                        }
                    } 
                    break;
 
                case MenuItemRole.SubmenuHeader: 
                case MenuItemRole.SubmenuItem:
                    { 
                        // If the current sibling has an open hierarchy, we cannot
                        // move focus/selection immediately.  Instead we must set
                        // a timer to open after MenuShowDelay ms.  If the sibling has
                        // no hierarchy open, it is safe to select the item immediately. 
                        /*MenuItem*/var sibling = this.CurrentSibling;
 
                        if (sibling == null || !sibling.IsSubmenuOpen) 
                        {
                            if (!this.IsSubmenuOpen) 
                            {
                                // Try to focus/select this item.
                            	this.FocusOrSelect();
                            } 
                            else
                            { 
                                // If the submenu is open, then it should already be selected. 
//                                Debug.Assert(IsSelected, "When IsSubmenuOpen = true, IsSelected should be true as well");
 
                                // Need to make sure that when we leave the hierarchy and come back
                                // that the item is highlighted.
                                this.IsHighlighted = true;
                            } 
                        }
                        else 
                        { 
                            // Highlight this item and remove the highlight
                            // from its sibling selected MenuItem 
                            sibling.IsHighlighted = false;
                            this.IsHighlighted = true;
                        }
 
                        // If the submenu isn't open already, OpenHierarchy after MenuShowDelay ms
                        if (!this.IsSelected || !this.IsSubmenuOpen) 
                        { 
                            // When the timout happens, OpenHierarchy will select this item
                        	this.SetTimerToOpenHierarchy(); 
                        }
                    }
                    break;
            } 

 
            // Now that we're over this menu hierarchy with the mouse, we 
            // should stop any timers which might cause this hierarchy to close.
            var timerRef = {"timer" :  this._closeHierarchyTimer};
            StopTimer(/*ref _closeHierarchyTimer*/timerRef);
            this._closeHierarchyTimer = timerRef.timer;
        },

//        private void 
        MouseLeaveInMenuMode:function(/*MenuItemRole*/ role)
        { 
            // When mouse moves out of a submenu item, we should deselect
            // the item.  This is what Win32 does, and our menus don't 
            // feel right without it. 
            if (role == MenuItemRole.SubmenuHeader || role == MenuItemRole.SubmenuItem)
            { 
                if (MenuItem.GetBoolField(this, BoolField.IgnoreNextMouseLeave))
                {
                    // The mouse was within a submenu that closed. A submenu header is receiving this
                    // message, but we want to ignore this one. 
                    MenuItem.SetBoolField(this, BoolField.IgnoreNextMouseLeave, false);
                } 
                else 
                {
                    if (!this.IsSubmenuOpen) 
                    {
                        // When the submenu isn't open we can deselect the item right away.
                        if (this.IsSelected)
                        { 
                        	this.SetCurrentValueInternal(IsSelectedProperty, false);
                        } 
                        else 
                        {
                            // If it's not selected it might just be highlighted, 
                            // so remove the highlight.
                        	this.IsHighlighted = false;
                        }
 
                        if (this.IsKeyboardFocusWithin)
                        { 
                            /*ItemsControl*/var parent = ItemsControl.ItemsControlFromItemContainer(this); 
                            if (parent != null)
                            { 
                                parent.Focus();
                            }
                        }
                    } 
                    else
                    { 
                        // If the submenu is open and the mouse moved to some sibling 
                        // hierarchy, we need to delay and deselect the item after
                        // MenuShowDelay ms, as long as the item doesn't get re-selected. 
                        if (this.IsMouseOverSibling)
                        {
                            SetTimerToCloseHierarchy();
                        } 
                    }
                } 
            } 

            // No matter what, we've left the menu item and we should 
            // stop any timer which would cause the item to open.
            var timerRef = {"timer" :  this._openHierarchyTimer};
            StopTimer(/*ref _openHierarchyTimer*/timerRef);
            this._openHierarchyTimer = timerRef.timer;
        },
 
        /// <summary>
        ///     An event announcing that the keyboard is focused on this element. 
        /// </summary> 
//        protected override void 
        OnGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e)
        { 
            base.OnGotKeyboardFocus(e);

            // Focus drives selection.  If a MenuItem is focused, it should
            // select itself. 
            if (!e.Handled && e.NewFocus == this)
            { 
            	this.SetCurrentValueInternal(MenuItem.IsSelectedProperty, true); 
            }
        }, 

        /// <summary>
        /// Called when the focus is no longer on or within this element.
        /// </summary> 
//        protected override void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            base.OnIsKeyboardFocusWithinChanged(e); 

            if (this.IsKeyboardFocusWithin && !this.IsSelected) 
            {
                // If an item within us got focus (probably programatically), we need to become selected
            	this.SetCurrentValueInternal(MenuItem.IsSelectedProperty, true);
            } 
        },
 
        /// <summary> 
        ///     This is the method that responds to the KeyDown event.
        /// </summary> 
        /// <param name="e">Event arguments</param>
        /// <SecurityNote>
        /// Critical - Calls ClickItem, setting the userInitiated
        ///             bit, which is used for security purposes later. 
        /// PublicOK - e.UserInitiated can always be trusted
        /// </SecurityNote> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
            base.OnKeyDown(e);

            var handled = false;
 
            /*Key*/var key = e.Key;
            /*MenuItemRole*/var role = this.Role; 
            /*FlowDirection*/var flowDirection = this.FlowDirection; 

            // In Right to Left mode we switch Right and Left keys 
            if (flowDirection == FlowDirection.RightToLeft)
            {
                if (key == Key.Right)
                { 
                    key = Key.Left;
                } 
                else if (key == Key.Left) 
                {
                    key = Key.Right; 
                }
            }

            switch (key) 
            {
                case Key.Tab: 
                    if (role == MenuItemRole.SubmenuHeader && this.IsSubmenuOpen && this.CurrentSelection == null) 
                    {
                        if ((Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift) 
                        {
                        	this.NavigateToEnd(new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                        }
                        else 
                        {
                        	this.NavigateToStart(new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                        } 

                        handled = true; 
                    }
                    break;

                case Key.Right: 
                    if ((role == MenuItemRole.SubmenuHeader) && !this.IsSubmenuOpen)
                    { 
                    	this.OpenSubmenuWithKeyboard(); 
                        handled = true;
                    } 
                    break;

                case Key.Enter:
                    { 
                        if (((role == MenuItemRole.SubmenuItem) || (role == MenuItemRole.TopLevelItem)))
                        { 
//                            Debug.Assert(IsHighlighted, "MenuItem got Key.Enter but was not highlighted -- focus did not follow highlight?"); 
                            this.ClickItem(e.UserInitiated);
                            handled = true; 
                        }
                        else if (role == MenuItemRole.TopLevelHeader)
                        {
                            // 
                        	this.OpenSubmenuWithKeyboard();
                            handled = true; 
                        } 
                        else if (role == MenuItemRole.SubmenuHeader && !IsSubmenuOpen)
                        { 
                        	this.OpenSubmenuWithKeyboard();
                            handled = true;
                        }
                    } 
                    break;
 
                // If a menuitem gets a down or up key and the submenu is open, we should focus the first or last 
                // item in the submenu (respectively).  If the submenu is not opened, this will be handled by Menu.
                case Key.Down: 
                    {
                        if (role == MenuItemRole.SubmenuHeader && this.IsSubmenuOpen && this.CurrentSelection == null)
                        {
                        	this.NavigateToStart(new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                            handled = true;
                        } 
                    } 
                    break;
 
                case Key.Up:
                    {
                        if (role == MenuItemRole.SubmenuHeader && this.IsSubmenuOpen && this.CurrentSelection == null)
                        { 
                        	this.NavigateToEnd(new ItemNavigateArgs(e.Device, Keyboard.Modifiers));
                            handled = true; 
                        } 
                    }
                    break; 

                case Key.Left:
                case Key.Escape:
                    { 
                        // If Left or Escape is pressed on a Submenu Item or Header, the submenu should be closed.
                        // Closing the submenu will move focus out of the submenu and onto the parent MenuItem. 
                        if ((role != MenuItemRole.TopLevelHeader) && (role != MenuItemRole.TopLevelItem)) 
                        {
                            if (this.IsSubmenuOpen) 
                            {
                            	this.SetCurrentValueInternal(IsSubmenuOpenProperty, false);
                                handled = true;
                            } 
                        }
                    } 
                    break; 
            }
 

            if (!handled)
            {
                /*ItemsControl*/var parent = ItemsControl.ItemsControlFromItemContainer(this); 
                /*
                 * This sets the ignore flag and adds a dispatcher that will run after all rendering has completed. 
                 * parent can be null when this is in the visual tree but not in an ItemsList.  Not recomended but still possible. 
                 * The IgnoreFlag could be set if multiple KeyPresses happen before the key ups.  There only needs to be one dispatcher
                 * on the queue. 
                 * */
                if ((parent != null) && (!MenuItem.GetBoolField(parent, BoolField.IgnoreMouseEvents)))
                {
                    //Ignore Mouse Events 
                    MenuItem.SetBoolField(parent, BoolField.IgnoreMouseEvents, true);
 
                    // MenuItem should ignore any mouse enter or move events until the menu has fully 
                    // moved.  So this is added to the Dispatcher with Background
                    parent.Dispatcher.BeginInvoke(DispatcherPriority.Background, 
                    		new DispatcherOperationCallback(/*delegate*/function(/*object*/ param) 
                    {
                        MenuItem.SetBoolField(parent, BoolField.IgnoreMouseEvents, false);
                        return null;
                    }), null); 
                }
 
                // Use the unadulterated e.Key here because the later translation 
                // to FocusNavigationDirection takes this into account.
                handled = this.MenuItemNavigate(e.Key, e.KeyboardDevice.Modifiers); 
            }

            if (handled)
            { 
                e.Handled = true;
            } 
        }, 

        /// <summary> 
        /// The Access key for this control was invoked.
        /// </summary>
        /// <SecurityNote>
        /// Critical - Calls ClickItem, setting the userInitiated 
        ///             bit, which is used for security purposes later.
        /// PublicOK - e.UserInitiated can always be trusted 
        /// </SecurityNote> 
//        protected override void 
        OnAccessKey:function(/*AccessKeyEventArgs*/ e) 
        {
            base.OnAccessKey(e);

            if (!e.IsMultiple) 
            {
                /*MenuItemRole*/var type = Role; 
 
                switch (type)
                { 
                    case MenuItemRole.TopLevelItem:
                    case MenuItemRole.SubmenuItem:
                        {
                            this.ClickItem(e.UserInitiated); 
                        }
                        break; 
 
                    case MenuItemRole.TopLevelHeader :
                    case MenuItemRole.SubmenuHeader : 
                        {
                    	this.OpenSubmenuWithKeyboard();
                        }
                        break; 
                }
            } 
        },

        /// <summary> 
        ///     This method is invoked when the Items property changes.
        /// </summary>
//        protected override void 
        OnItemsChanged:function(/*NotifyCollectionChangedEventArgs*/ e)
        { 
            // We use visual triggers to place the popup based on RoleProperty.
            // Update the RoleProperty when Items property changes so popup can be placed accordingly. 
            this.UpdateRole(); 
            base.OnItemsChanged(e);
        }, 

        /// <summary> 
        /// Return true if the item is (or is eligible to be) its own ItemUI
        /// </summary> 
//        protected override bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item) 
        {
            var ret = (item instanceof MenuItem) || (item instanceof Separator); 
            if (!ret)
            {
                this._currentItem = item;
            } 

            return ret; 
        }, 

        /// <summary> 
        /// Determine whether the ItemContainerStyle/StyleSelector should apply to the item or not
        /// </summary>
//        protected override bool 
        ShouldApplyItemContainerStyle:function(/*DependencyObject*/ container, /*object*/ item)
        { 
            if (item instanceof Separator)
            { 
                return false; 
            }
            else 
            {
                return base.ShouldApplyItemContainerStyle(container, item);
            }
        }, 

        /// <summary> Create or identify the element used to display the given item. </summary> 
//        protected override DependencyObject 
        GetContainerForItemOverride:function() 
        {
            var currentItem = this._currentItem; 
            this._currentItem = null;

            if (this.UsesItemContainerTemplate)
            { 
                /*DataTemplate*/var itemContainerTemplate = ItemContainerTemplateSelector.SelectTemplate(currentItem, this);
                if (itemContainerTemplate != null) 
                { 
                    var itemContainer = itemContainerTemplate.LoadContent();
                    if (itemContainer instanceof MenuItem || itemContainer instanceof Separator) 
                    {
                        return itemContainer instanceof DependencyObject ? itemContainer : null;
                    }
                    else 
                    {
                        throw new InvalidOperationException(SR.Get(SRID.InvalidItemContainer, this.GetType().Name, MenuItem.Type.Name, typeof(Separator).Name, itemContainer)); 
                    } 
                }
            } 

            return new MenuItem();
        },
 
        /// <summary>
        ///     Called when the parent of the Visual has changed. 
        /// </summary> 
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param>
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent) 
        {
            base.OnVisualParentChanged(oldParent);
            this.UpdateRole();
 
            // Windows OS bug:1988393; DevDiv bug:107459
            // MenuItem template contains ItemsPresenter where Grid.IsSharedSizeScope="true" and need to inherits PrivateSharedSizeScopeProperty value 
            // Property inheritance walk the locial tree if possible and skip the visual tree where ItemsPresenter is 
            // Workaround here will be to copy the property value from MenuItem visual parent
 
            /*DependencyObject*/var newParent = VisualTreeHelper.GetParentInternal(this);

            // logical parent != null
            // visual parent != null 
            // logical parent != visual parent <-- we are in the MenuItem is a logical child of a MenuItem case, not a data container case
            // --- Set one-way binding with visual parent for DefinitionBase.PrivateSharedSizeScopeProperty 
            // NOTE: It seems impossible to get shared size scope to work in this hierarchical scenario 
            // under normal conditions, so putting this binding here without respecting an author's desire for
            // shared size scope on the MenuItem container should be OK, since they wouldn't be able to 
            // get it to work anyway.
            if (this.Parent != null && newParent != null && this.Parent != newParent)
            {
                var binding = new Binding(); 
                binding.Path = new PropertyPath(DefinitionBase.PrivateSharedSizeScopeProperty);
                binding.Mode = BindingMode.OneWay; 
                binding.Source = newParent; 
                BindingOperations.SetBinding(this, DefinitionBase.PrivateSharedSizeScopeProperty, binding);
            } 

            // visual parent == null
            // --- Clear binding for DefinitionBase.PrivateSharedSizeScopeProperty
            if (newParent == null) 
            {
                BindingOperations.ClearBinding(this, DefinitionBase.PrivateSharedSizeScopeProperty); 
            } 

        }, 

        /// <summary>
        /// Called when the Template's tree has been generated
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
            base.OnApplyTemplate(); 

            if (this._submenuPopup != null) 
            {
            	this._submenuPopup.Closed -= OnPopupClosed;
            }
 
            this._submenuPopup = this.GetTemplateChild(PopupTemplateName);
            this._submenuPopup = this._submenuPopup instanceof Popup ? this._submenuPopup : null;
 
            if (this._submenuPopup != null) 
            {
            	this._submenuPopup.Closed += OnPopupClosed; 
            }
        },

 
//        private void 
        SetMenuMode:function(/*bool*/ menuMode)
        { 
//            Debug.Assert(Role == MenuItemRole.TopLevelHeader || Role == MenuItemRole.TopLevelItem, "MenuItem was not top-level"); 

            var parentMenu = this.LogicalParent instanceof MenuBase ? this.LogicalParent : null; 

            if (parentMenu != null)
            {
                if (parentMenu.IsMenuMode != menuMode) 
                {
                    parentMenu.IsMenuMode = menuMode; 
                } 
            }
        }, 
        /// <SecurityNote> 
        /// Critical - Calls ClickItem, setting the userInitiated
        ///             bit, which is used for security purposes later. 
        /// TreatAsSafe - passes false. 
        /// </SecurityNote>
//        internal void 
//        ClickItem:function()
//        {
//        	this.ClickItem(false);
//        }, 
        /// <SecurityNote>
        /// Critical - Calls OnClickCore, setting the userInitiated 
        ///             bit, which is used for security purposes later. 
        /// </SecurityNote>
//        private void 
        ClickItem:function(/*bool*/ userInitiated)
        {
        	if(userInitiated === undefined){
        		userInitiated = false;
        	}
            try
            { 
            	this.OnClickCore(userInitiated);
            } 
            finally 
            {
                // When you click a top-level item, we need to exit menu mode. 
                if (this.Role == MenuItemRole.TopLevelItem && !this.StaysOpenOnClick)
                {
                	this.SetMenuMode(false);
                } 
            }
        }, 
 
//        internal void
        ClickHeader:function()
        { 
            if (!this.IsKeyboardFocusWithin)
            {
            	this.FocusOrSelect();
            } 

            if (IsSubmenuOpen) 
            { 
                if (this.Role == MenuItemRole.TopLevelHeader)
                { 
                	this.SetMenuMode(false);
                }
            }
            else 
            {
                // Immediately open the menu when it's clicked. This will stop any 
                // timers to open or close the submenu. 
            	this.OpenMenu();
            } 
        },

//        internal bool 
        OpenMenu:function()
        { 
            if (!this.IsSubmenuOpen)
            { 
                // Verify that the parent of the MenuItem is valid; 
                /*ItemsControl*/var owner = ItemsControl.ItemsControlFromItemContainer(this);
                if (owner == null) 
                {
                    owner = VisualTreeHelper.GetParent(this);
                    owner = owner instanceof ItemsControl ? owner : null;
                }
 
                if ((owner != null) && ((owner instanceof MenuItem) || (owner instanceof MenuBase)))
                { 
                    // Parent must be MenuItem or MenuBase in order for menus to open. 
                    // Otherwise, odd behavior will occur.
                	this.SetCurrentValueInternal(IsSubmenuOpenProperty, true); 
                    return true; // The value was actually changed
                }
            }
 
            return false;
        }, 
 
        /// <summary>
        ///     Set IsSubmenuOpen = true and select the first item. 
        /// </summary>
//        internal void 
        OpenSubmenuWithKeyboard:function()
        {
            MenuItem.SetBoolField(this, BoolField.OpenedWithKeyboard, true); 
            if (this.OpenMenu())
            { 
                this.NavigateToStart(new ItemNavigateArgs(Keyboard.PrimaryDevice, Keyboard.Modifiers)); 
            }
        }, 

        /// <summary>
        /// Navigate from one MenuItem to a sibling.
        /// </summary> 
        /// <param name="key">Raw key that was pressed (RTL is respected within this method).</param>
        /// <param name="modifiers"></param> 
        /// <returns>true if navigation was successful.</returns> 
//        private bool 
        MenuItemNavigate:function(/*Key*/ key, /*ModifierKeys*/ modifiers)
        { 
            if (key == Key.Left || key == Key.Right || key == Key.Up || key == Key.Down)
            {
                /*ItemsControl*/var parent = ItemsControlFromItemContainer(this);
                if (parent != null) 
                {
                    if (!parent.HasItems) 
                    { 
                        return false;
                    } 

                    var count = parent.Items.Count;

                    // Optimize for the case where the submenu contains one item. 

                    if (count == 1 && !(parent instanceof Menu)) 
                    { 
                        // Return true if we were navigating up/down (we cycled around).
                        if (key == Key.Up && key == Key.Down) 
                        {
                            return true;
                        }
                    } 

                    var previousFocus = Keyboard.FocusedElement; 
                    parent.NavigateByLine(parent.FocusedInfo, KeyboardNavigation.KeyToTraversalDirection(key), new ItemNavigateArgs(Keyboard.PrimaryDevice, modifiers)); 
                    var currentFocus = Keyboard.FocusedElement;
                    if ((currentFocus != previousFocus) && (currentFocus != this)) 
                    {
                        return true;
                    }
                } 
            }
 
            return false; 
        },
 
        /// <summary> 
        ///     Select this item and expand the hierarchy below it.
        /// </summary> 
        /// <param name="role"></param>
//        private void 
        OpenHierarchy:function(/*MenuItemRole*/ role)
        {
            this.FocusOrSelect(); 

            if (role == MenuItemRole.TopLevelHeader || role == MenuItemRole.SubmenuHeader) 
            { 
            	this.OpenMenu();
            } 
        },

        /// <summary>
        ///     Focus this item or, if that fails, just mark it selected. 
        /// </summary>
//        private void 
        FocusOrSelect:function() 
        { 
            // Setting focus will cause the item to be selected,
            // but if we fail to focus we should still select. 
            // (This is to help enable focusless menus).
            // Check IsKeyboardFocusWithin to allow rich content within the menuitem.
            if (!this.IsKeyboardFocusWithin)
            { 
            	this.Focus();
            } 
 
            if (!this.IsSelected)
            { 
                // If it's already focused, make sure it's also selected.
            	this.SetCurrentValueInternal(MenuItem.IsSelectedProperty, true);
            }
 
            // If the item is selected we should ensure that it's highlighted.
            if (this.IsSelected && !this.IsHighlighted) 
            { 
            	this.IsHighlighted = true;
            } 
        },

//        private void 
        SetTimerToOpenHierarchy:function()
        { 
            if (this._openHierarchyTimer == null)
            { 
            	this._openHierarchyTimer = new DispatcherTimer(/*DispatcherPriority.Normal*/); 
            	
            	var item = this;
            	this._openHierarchyTimer.Tick.Combine(/*(EventHandler)delegate*/new EventHandler(item, function(/*object*/ sender, /*EventArgs*/ e)
                { 
            		item.OpenHierarchy(item.Role);
                 	var timerRef = {"timer":item._closeHierarchyTimer};
                 	item.StopTimer(timerRef); 
                 	item._closeHierarchyTimer = timerRef.timer;
                }));
            } 
            else
            { 
            	this._openHierarchyTimer.Stop(); 
            }
 
            this.StartTimer(this._openHierarchyTimer);
        },

//        private void 
        SetTimerToCloseHierarchy:function() 
        {
            if (this._closeHierarchyTimer == null) 
            { 
            	this._closeHierarchyTimer = new DispatcherTimer(/*DispatcherPriority.Normal*/);
            	var item = this;
            	this._closeHierarchyTimer.Tick.Combine(new EventHandler(item, /*delegate*/function(/*object*/ sender, /*EventArgs*/ e) 
                {
                    // Deselect the item; will remove highlight and collapse hierarchy.
            		item.SetCurrentValueInternal(MenuItem.IsSelectedProperty, false);
                	var timerRef = {"timer":item._closeHierarchyTimer};
                	item.StopTimer(timerRef); 
                	item._closeHierarchyTimer = timerRef.timer;
                }));
            } 
            else 
            {
            	this._closeHierarchyTimer.Stop(); 
            }

            this.StartTimer(this._closeHierarchyTimer);
        }, 

//        private void 
        StopTimer:function(/*ref DispatcherTimer timer*/timerRef) 
        { 
            if (timerRef.timer != null)
            { 
            	timerRef.timer.Stop();
            	timerRef.timer = null;
            }
        },

//        private void
        StartTimer:function(/*DispatcherTimer*/ timer) 
        { 
//            Debug.Assert(timer != null, "timer should not be null.");
//            Debug.Assert(!timer.IsEnabled, "timer should not be running."); 

            timer.Interval = TimeSpan.FromMilliseconds(SystemParameters.MenuShowDelay);
            timer.Start();
        } 

	});
	
	Object.defineProperties(MenuItem.prototype,{
 
        /// <summary>
        ///     The MenuItem's Command. 
        /// </summary>
//        public ICommand 
		Command: 
        {
            get:function() { return this.GetValue(MenuItem.CommandProperty); }, 
            set:function(value) { this.SetValue(MenuItem.CommandProperty, value); } 
        },
        /// <summary>
        ///     Fetches the value of the IsEnabled property 
        /// </summary>
        /// <remarks>
        ///     The reason this property is overridden is so that MenuItem
        ///     can infuse the value for CanExecute into it. 
        /// </remarks>
//        protected override bool 
        IsEnabledCore: 
        { 
            get:function()
            { 
                return /*base*/this.IsEnabledCore && this.CanExecute;
            }
        },
 
        /// <summary> 
        ///     The parameter to pass to MenuItem's Command.
        /// </summary> 
//        public object 
        CommandParameter:
        { 
            get:function() { return this.GetValue(MenuItem.CommandParameterProperty); },
            set:function(value) { this.SetValue(MenuItem.CommandParameterProperty, value); } 
        }, 
 
        /// <summary>
        ///     The target element on which to fire the command.
        /// </summary>
//        public IInputElement 
        CommandTarget:
        { 
            get:function() { return this.GetValue(MenuItem.CommandTargetProperty); }, 
            set:function(value) { this.SetValue(MenuItem.CommandTargetProperty, value); }
        }, 
        /// <summary>
        ///     When the MenuItem's submenu is visible. 
        /// </summary>
//        public bool 
        IsSubmenuOpen: 
        {
            get:function() { return this.GetValue(MenuItem.IsSubmenuOpenProperty); },
            set:function(value) { this.SetValue(MenuItem.IsSubmenuOpenProperty, BooleanBoxes.Box(value)); } 
        },
 

        /// <summary> 
        ///     What the role of the menu item is: TopLevelItem, TopLevelHeader, SubmenuItem, SubmenuHeader.
        /// </summary> 
//        public MenuItemRole 
        Role:
        { 
            get:function() { return this.GetValue(MenuItem.RoleProperty); }
        },

        /// <summary>
        ///     IsCheckable determines the user ability to check/uncheck the item. 
        /// </summary>
//        public bool 
        IsCheckable: 
        {
            get:function() { return this.GetValue(MenuItem.IsCheckableProperty); }, 
            set:function(value) { this.SetValue(MenuItem.IsCheckableProperty, value); }
        },

        /// <summary>
        ///     When the MenuItem is pressed.
        /// </summary>
//        public bool 
        IsPressed:
        { 
            get:function() { return this.GetValue(MenuItem.IsPressedProperty); }, 
            /*protected*/ set:function(value) { this.SetValue(MenuItem.IsPressedPropertyKey, value); }
        }, 

        /// <summary> 
        ///     Whether the MenuItem should be highlighted.
        /// </summary>
//        public bool 
        IsHighlighted: 
        {
            get:function() { return this.GetValue(MenuItem.IsHighlightedProperty); }, 
            /*protected*/ set:function(value) { this.SetValue(MenuItem.IsHighlightedPropertyKey, value); } 
        },
 
        /// <summary> 
        ///     When the MenuItem is checked.
        /// </summary> 
//        public bool 
        IsChecked:
        {
            get:function() { return this.GetValue(MenuItem.IsCheckedProperty); }, 
            set:function(value) { this.SetValue(MenuItem.IsCheckedProperty, value); }
        }, 
 
        /// <summary>
        ///     Indicates that the submenu that this MenuItem is within should not close when this item is clicked.
        /// </summary>
//        public bool 
        StaysOpenOnClick:
        { 
            get:function() { return this.GetValue(MenuItem.StaysOpenOnClickProperty); }, 
            set:function(value) { this.SetValue(MenuItem.StaysOpenOnClickProperty, value); }
        }, 

        /// <summary>
        ///     True if this MenuItem is the current MenuItem of its parent.
        ///     Focus drives Selection, but not vice versa.  This will enable 
        ///     focusless menus.
        /// </summary> 
//        internal bool 
        IsSelected: 
        {
            get:function() { return this.GetValue(MenuItem.IsSelectedProperty); }, 
            set:function(value) { this.SetValue(MenuItem.IsSelectedProperty, value); }
        },

        /// <summary>
        ///     Text describing an input gesture that will invoke the command tied to this item.
        /// </summary> 
//        public string 
        InputGestureText: 
        { 
            get:function() { return this.GetValue(MenuItem.InputGestureTextProperty); },
            set:function(value) { this.SetValue(MenuItem.InputGestureTextProperty, value); } 
        },

        /// <summary>
        ///     Text describing an input gesture that will invoke the command tied to this item. 
        /// </summary>
//        public object 
        Icon: 
        {
            get:function() { return this.GetValue(MenuItem.IconProperty); }, 
            set:function(value) { this.SetValue(MenuItem.IconProperty, value); }
        },
        /// <summary>
        /// Returns true if the Menu should suspend animations on its popup 
        /// </summary> 
//        public bool 
        IsSuspendingPopupAnimation:
        {
            get:function()
            {
                return this.GetValue(MenuItem.IsSuspendingPopupAnimationProperty); 
            },
            /*internal*/ set:function(value) 
            { 
            	this.SetValue(MenuItem.IsSuspendingPopupAnimationPropertyKey, value);
            } 
        },
 
        /// <summary> 
        ///     DataTemplateSelector property which provides the DataTemplate to be used to create an instance of the ItemContainer.
        /// </summary> 
//        public ItemContainerTemplateSelector 
        ItemContainerTemplateSelector:
        {
            get:function() { return this.GetValue(ItemContainerTemplateSelectorProperty); },
            set:function(value) { this.SetValue(ItemContainerTemplateSelectorProperty, value); } 
        },
 
        /// <summary> 
        ///     UsesItemContainerTemplate property which says whether the ItemContainerTemplateSelector property is to be used.
        /// </summary> 
//        public bool
        UsesItemContainerTemplate: 
        {
            get:function() { return this.GetValue(UsesItemContainerTemplateProperty); }, 
            set:function(value) { this.SetValue(UsesItemContainerTemplateProperty, value); }
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
        /// Returns true if the parent has capture.  Does not work for submenu items/headers.
        /// </summary> 
//        private bool 
        IsInMenuMode:
        { 
            get:function() 
            {
                var parentMenu = this.LogicalParent;
                parentMenu = parentMenu instanceof MenuBase ? parentMenu : null; 
                if (parentMenu != null)
                {
                    return parentMenu.IsMenuMode;
                } 

                return false; 
            } 
        },
 
        /// <summary>
        /// Returns true if the top level header should open when the mouse enters it
        /// </summary>
//        private bool 
        OpenOnMouseEnter: 
        {
            get:function() 
            { 
                var parentMenu = this.LogicalParent;
                parentMenu = parentMenu instanceof MenuBase ? parentMenu : null; 
                if (parentMenu != null) 
                {
//                    Debug.Assert(!parentMenu.OpenOnMouseEnter || parentMenu.IsMenuMode, "OpenOnMouseEnter can only be true when IsMenuMode is true");
                    return parentMenu.OpenOnMouseEnter;
                } 

                return false; 
            } 
        },

//        private bool 
        InsideContextMenu: 
        {
            get:function() 
            {
                return this.GetValue(InsideContextMenuProperty);
            }
        }, 
 
        /// <summary>
        ///     Returns logical parent; either Parent or ItemsControlFromItemContainer(this).
        /// </summary>
        /// <value></value> 
//        internal object 
        LogicalParent:
        { 
            get:function() 
            {
                if (this.Parent != null) 
                {
                    return this.Parent;
                }
 
                return ItemsControlFromItemContainer(this);
            } 
        }, 

        /// <summary> 
        ///     Return the current sibling of this MenuItem -- the
        ///     CurrentSelection of the parent as long as it isn't us.
        /// </summary>
//        private MenuItem 
        CurrentSibling: 
        {
            get:function() 
            { 
                var parent = this.LogicalParent;
                var menuItemParent = parent instanceof MenuItem ? parent : null; 
                /*MenuItem*/var sibling = null;

                if (menuItemParent != null)
                { 
                    sibling = menuItemParent.CurrentSelection;
                } 
                else 
                {
                    var menuParent = parent instanceof MenuBase ? parent : null; 

                    if (menuParent != null)
                    {
                        sibling = menuParent.CurrentSelection; 
                    }
                } 
 
                if (sibling == this)
                { 
                    sibling = null;
                }

                return sibling; 
            }
        }, 
 
        /// <summary>
        ///     Returns true if the mouse is somewhere in the hierarchy 
        ///     but not over this node.  Note that this is slightly different
        ///     from CurrentSibling.IsMouseOver because there are regions in
        ///     the menu which are not occupied by siblings and we're interested
        ///     in that case too. 
        /// </summary>
//        private bool 
        IsMouseOverSibling: 
        { 
            get:function()
            { 
                var parent = this.LogicalParent instanceof FrameworkElement ? this.LogicalParent : null;

                // If the mouse is over our parent but not over us, then
                // the mouse must be somewhere in a sibling hierarchy. 
                //
                // NOTE: If this check were changed to CurrentSibling.IsMouseOver 
                //       then our behavior becomes identical to the behavior 
                //       of the start menu, where a menu doesn't close unless
                //       you have settled on another hierarchy.  Here we will 
                //       close unless you are settled on this item's hierarchy.
                if (parent != null && this.IsMouseReallyOver(parent) && !this.IsMouseOver)
                {
                    return true; 
                }
 
                return false; 
            }
        }, 

        /// <summary>
        ///     Tracks the current selection in the items collection (i.e. submenu) 
        ///     of this MenuItem.
        /// </summary> 
//        private MenuItem
        CurrentSelection: 
        {
            get:function() 
            {
                return this._currentSelection;
            },
            set:function(value)
            { 
                if (this._currentSelection != null) 
                {
                	this._currentSelection.SetCurrentValueInternal(MenuItem.IsSelectedProperty, false); 
                }

                this._currentSelection = value;
 
                if (this._currentSelection != null)
                { 
                	this._currentSelection.SetCurrentValueInternal(MenuItem.IsSelectedProperty, true); 
                }
 
                // NOTE: (Win32 disparity) If CurrentSelection changes to null
                //       and the focus was within the old CurrentSelection, we
                //       the parent should take focus back.  In Win32 the "virtual"
                //       focus was tracked by way of the currently selected guy in 
                //       If you were selected but none of your children were, you
                //       were effectively selected.  It should be relatively easy to 
                //       enable this behavior by checking if IsKeyboardFocusWithin is true 
                //       on the previous child and then setting Focus to ourselves
                //       when _currentSelection becomes null.  We would need to do this 
                //       here and in MenuBase.CurrentSelection.
            }
        },
 
//        private bool 
        CanExecute: 
        {
            get:function() { return !this.ReadControlFlag(ControlBoolFlags.CommandDisabled); }, 
            set:function(value) 
            {
                if (value != this.CanExecute) 
                {
                	this.WriteControlFlag(ControlBoolFlags.CommandDisabled, !value);
                	this.CoerceValue(MenuItem.IsEnabledProperty);
                } 
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
	
	Object.defineProperties(MenuItem,{
        /// <summary>
        /// Key used to mark the template for use by TopLevel MenuItems 
        /// </summary>
//        public static ResourceKey 
		TopLevelItemTemplateKey: 
        { 
            get:function()
            { 
                if (_topLevelItemTemplateKey == null)
                {
                    _topLevelItemTemplateKey = new ComponentResourceKey(MenuItem.Type, "TopLevelItemTemplateKey");
                } 

                return _topLevelItemTemplateKey; 
            } 
        },
 
        /// <summary>
        /// Key used to mark the template for use by TopLevel Menu Header
        /// </summary>
//        public static ResourceKey 
		TopLevelHeaderTemplateKey: 
        {
            get:function() 
            { 
                if (_topLevelHeaderTemplateKey == null)
                { 
                    _topLevelHeaderTemplateKey = new ComponentResourceKey(MenuItem.Type, "TopLevelHeaderTemplateKey");
                }

                return _topLevelHeaderTemplateKey; 
            }
        }, 
 
        /// <summary>
        /// Key used to mark the template for use by Submenu Item 
        /// </summary>
//        public static ResourceKey 
		SubmenuItemTemplateKey:
        {
            get:function() 
            {
                if (_submenuItemTemplateKey == null) 
                { 
                    _submenuItemTemplateKey = new ComponentResourceKey(MenuItem.Type, "SubmenuItemTemplateKey");
                } 

                return _submenuItemTemplateKey;
            }
        }, 

        /// <summary> 
        /// Key used to mark the template for use by Submenu Header 
        /// </summary>
//        public static ResourceKey 
		SubmenuHeaderTemplateKey: 
        {
            get:function()
            {
                if (_submenuHeaderTemplateKey == null) 
                {
                    _submenuHeaderTemplateKey = new ComponentResourceKey(MenuItem.Type, "SubmenuHeaderTemplateKey"); 
                } 

                return _submenuHeaderTemplateKey; 
            }
        },

        /// <summary> 
        ///     Event corresponds to left mouse button click
        /// </summary>
//        public static readonly RoutedEvent 
		ClickEvent:
        {
        	get:function(){
        		if(MenuItem._ClickEvent === undefined){
        			MenuItem._ClickEvent = EventManager.RegisterRoutedEvent("Click", 
        					RoutingStrategy.Bubble, RoutedEventHandler.Type, MenuItem.Type); 
        		}
        		
        		return MenuItem._ClickEvent;
        	}
			
        }, 
 
        /// <summary> 
        ///     Event that is fired when mouse button is pressed down but before menus are closed.
        ///     This event should be handled by the parent menu and used to know when to close all submenus. 
        /// </summary> 
//        internal static readonly RoutedEvent 
		PreviewClickEvent:
        {
        	get:function(){
        		if(MenuItem._PreviewClickEvent === undefined){
        			MenuItem._PreviewClickEvent = EventManager.RegisterRoutedEvent("PreviewClick", 
        					RoutingStrategy.Bubble, RoutedEventHandler.Type, MenuItem.Type); 
        		}
        		
        		return MenuItem._PreviewClickEvent;
        	}
			
        }, 
 
        /// <summary>
        ///     Checked event
        /// </summary>
//        public static readonly RoutedEvent 
		CheckedEvent:
        {
        	get:function(){
        		if(MenuItem._CheckedEvent === undefined){
        			MenuItem._CheckedEvent = EventManager.RegisterRoutedEvent("Checked", 
        					RoutingStrategy.Bubble, RoutedEventHandler.Type, MenuItem.Type);  
        		}
        		
        		return MenuItem._CheckedEvent;
        	}
			
        }, 

        /// <summary> 
        ///     Unchecked event 
        /// </summary>
//        public static readonly RoutedEvent 
		UncheckedEvent:
        {
        	get:function(){
        		if(MenuItem._UncheckedEvent === undefined){
        			MenuItem._UncheckedEvent = EventManager.RegisterRoutedEvent("Unchecked", 
        					RoutingStrategy.Bubble, RoutedEventHandler.Type, MenuItem.Type); 
        		}
        		
        		return MenuItem._UncheckedEvent;
        	}
			
        }, 

        /// <summary>
        ///     Event fires when submenu opens
        /// </summary>
//        public static readonly RoutedEvent 
		SubmenuOpenedEvent:
        {
        	get:function(){
        		if(MenuItem._SubmenuOpenedEvent === undefined){
        			MenuItem._SubmenuOpenedEvent = 
        	            EventManager.RegisterRoutedEvent("SubmenuOpened", RoutingStrategy.Bubble, RoutedEventHandler.Type, MenuItem.Type);
        		}
        		
        		return MenuItem._SubmenuOpenedEvent;
        	}
			
        }, 
 
        /// <summary> 
        ///     Event fires when submenu closes
        /// </summary> 
//        public static readonly RoutedEvent 
		SubmenuClosedEvent:
        {
        	get:function(){
        		if(MenuItem._SubmenuClosedEvent === undefined){
        			MenuItem._SubmenuClosedEvent =
        	            EventManager.RegisterRoutedEvent("SubmenuClosed", RoutingStrategy.Bubble, RoutedEventHandler.Type, MenuItem.Type);
        		}
        		
        		return MenuItem._SubmenuClosedEvent;
        	}
			
        }, 

        /// <summary>
        ///     The DependencyProperty for the RoutedCommand. 
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
		CommandProperty:
        {
        	get:function(){
        		if(MenuItem._CommandProperty === undefined){
        			MenuItem._CommandProperty =
                        ButtonBase.CommandProperty.AddOwner(
                                MenuItem.Type,
                                /*new FrameworkPropertyMetadata( 
                                        (ICommand)null,
                                        new PropertyChangedCallback(null, OnCommandChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        /*(ICommand)*/null,
                                        new PropertyChangedCallback(null, OnCommandChanged)));
        		}
        		
        		return MenuItem._CommandProperty;
        	}
			
        },  

        /// <summary> 
        ///     The DependencyProperty for the RoutedCommand's parameter. 
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
		CommandParameterProperty:
        {
        	get:function(){
        		if(MenuItem._CommandParameterProperty === undefined){
        			MenuItem._CommandParameterProperty =
                        ButtonBase.CommandParameterProperty.AddOwner(
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata((object) null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return MenuItem._CommandParameterProperty;
        	}
			
        }, 
 
        /// <summary> 
        ///     The DependencyProperty for Target property
        ///     Flags:              None
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
		CommandTargetProperty:
        {
        	get:function(){
        		if(MenuItem._CommandTargetProperty === undefined){
        			MenuItem._CommandTargetProperty =
                        ButtonBase.CommandTargetProperty.AddOwner( 
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata((IInputElement) null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null)); 
        		}
        		
        		return MenuItem._CommandTargetProperty;
        	}
			
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the IsSubmenuOpen property.
        ///     Flags:              None 
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
		IsSubmenuOpenProperty:
        {
        	get:function(){
        		if(MenuItem._IsSubmenuOpenProperty === undefined){
        			MenuItem._IsSubmenuOpenProperty = 
                        DependencyProperty.Register(
                                "IsSubmenuOpen", 
                                Boolean.Type,
                                MenuItem.Type,
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsSubmenuOpenChanged), 
                                        new CoerceValueCallback(null, CoerceIsSubmenuOpen))*/
                                FrameworkPropertyMetadata.Build4(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsSubmenuOpenChanged), 
                                        new CoerceValueCallback(null, CoerceIsSubmenuOpen)));  
        		}
        		
        		return MenuItem._IsSubmenuOpenProperty;
        	}
			
        }, 

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		RolePropertyKey:
        {
        	get:function(){
        		if(MenuItem._RolePropertyKey === undefined){
        			MenuItem._RolePropertyKey = 
                        DependencyProperty.RegisterReadOnly(
                                "Role", 
                                Number.Type,
                                MenuItem.Type,
                                /*new FrameworkPropertyMetadata(MenuItemRole.TopLevelItem)*/
                                FrameworkPropertyMetadata.BuildWithDV(MenuItemRole.TopLevelItem)); 
        		}
        		
        		return MenuItem._RolePropertyKey;
        	}
			
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the Role property. 
        ///     Flags:              None 
        ///     Default Value:      MenuItemRole.TopLevelItem
        /// </summary> 
//        public static readonly DependencyProperty 
		RoleProperty:
        {
        	get:function(){
        		return MenuItem.RolePropertyKey.DependencyProperty;
        	}
        }, 

        /// <summary> 
        ///     The DependencyProperty for the IsCheckable property.
        ///     Flags:              None 
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty 
		IsCheckableProperty:
        {
        	get:function(){
        		if(MenuItem._IsCheckableProperty === undefined){
        			MenuItem._IsCheckableProperty =
                        DependencyProperty.Register( 
                                "IsCheckable",
                                Boolean.Type, 
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        new PropertyChangedCallback(null, OnIsCheckableChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                        false, 
                                        new PropertyChangedCallback(null, OnIsCheckableChanged))); 
        		}
        		
        		return MenuItem._IsCheckableProperty;
        	}
			
        }, 

        /// <summary> 
        ///     The DependencyPropertyKey for the IsPressed property.
        ///     Flags:              None
        ///     Default Value:      false
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		IsPressedPropertyKey:
        {
        	get:function(){
        		if(MenuItem._IsPressedPropertyKey === undefined){
        			MenuItem._IsPressedPropertyKey =
                        DependencyProperty.RegisterReadOnly( 
                                "IsPressed", 
                                Boolean.Type,
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return MenuItem._IsPressedPropertyKey;
        	}
			
        }, 

        /// <summary>
        ///     The DependencyProperty for the IsPressed property. 
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary> 
//        public static readonly DependencyProperty 
		IsPressedProperty:
        {
        	get:function(){
        		return MenuItem.IsPressedPropertyKey.DependencyProperty;
        	}
			
        }, 
 
        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
//        private static readonly DependencyPropertyKey 
		IsHighlightedPropertyKey:
        {
        	get:function(){
        		if(MenuItem._IsHighlightedPropertyKey === undefined){
        			MenuItem._IsHighlightedPropertyKey =
                        DependencyProperty.RegisterReadOnly( 
                                "IsHighlighted",
                                Boolean.Type, 
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return MenuItem._IsHighlightedPropertyKey;
        	}
			
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the IsHighlighted property.
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
		IsHighlightedProperty:
        {
        	get:function(){
        		return MenuItem.IsHighlightedPropertyKey.DependencyProperty; 
        	}
        },  

        /// <summary>
        ///     The DependencyProperty for the IsChecked property.
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
		IsCheckedProperty:
        {
        	get:function(){
        		if(MenuItem._IsCheckedProperty === undefined){
        			MenuItem._IsCheckedProperty = 
                        DependencyProperty.Register( 
                                "IsChecked",
                                Boolean.Type, 
                                MenuItem.Type,
                                /*new FrameworkPropertyMetadata(
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnIsCheckedChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                        new PropertyChangedCallback(null, OnIsCheckedChanged))); 
        		}
        		
        		return MenuItem._IsCheckedProperty;
        	}
			
        }, 
 
        /// <summary> 
        ///     The DependencyProperty for the StaysOpenOnClick property.
        ///     Flags:              None 
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty 
		StaysOpenOnClickProperty:
        {
        	get:function(){
        		if(MenuItem._StaysOpenOnClickProperty === undefined){
        			MenuItem._StaysOpenOnClickProperty =
                        DependencyProperty.Register( 
                                "StaysOpenOnClick",
                                Boolean.Type, 
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return MenuItem._StaysOpenOnClickProperty;
        	}
			
        }, 

        /// <summary> 
        ///     DependencyProperty for IsSelected property.
        /// </summary> 
//        internal static readonly DependencyProperty 
		IsSelectedProperty:
        {
        	get:function(){
        		if(MenuItem._IsSelectedProperty === undefined){
        			MenuItem._IsSelectedProperty = 
                        Selector.IsSelectedProperty.AddOwner(
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsSelectedChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        false,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsSelectedChanged))); 
        		}
        		
        		return MenuItem._IsSelectedProperty;
        	}
			
        },  

        /// <summary> 
        ///     The DependencyProperty for the InputGestureText property.
        ///     Default Value:      String.Empty 
        /// </summary>
//        public static readonly DependencyProperty 
		InputGestureTextProperty:
        {
        	get:function(){
        		if(MenuItem._InputGestureTextProperty === undefined){
        			MenuItem._InputGestureTextProperty =
                        DependencyProperty.Register(
                                "InputGestureText", 
                                String.Type,
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata(String.Empty, 
                                                              new PropertyChangedCallback(null, OnInputGestureTextChanged),
                                                              new CoerceValueCallback(CoerceInputGestureText))*/
                                FrameworkPropertyMetadata.Build3CVCB(String.Empty, 
                                                              new PropertyChangedCallback(null, OnInputGestureTextChanged),
                                                              new CoerceValueCallback(null, CoerceInputGestureText))); 
        		}
        		
        		return MenuItem._InputGestureTextProperty;
        	}
			
        }, 

        /// <summary>
        ///     The DependencyProperty for the Icon property.
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
		IconProperty:
        {
        	get:function(){
        		if(MenuItem._IconProperty === undefined){
        			MenuItem._IconProperty =
                        DependencyProperty.Register( 
                                "Icon", 
                                Object.Type,
                                MenuItem.Type, 
                                /*new FrameworkPropertyMetadata((object)null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null)); 
        		}
        		
        		return MenuItem._IconProperty;
        	}
			
        }, 

        // This is used to disable animations after the menu has displayed once 
//        private static readonly DependencyPropertyKey 
		IsSuspendingPopupAnimationPropertyKey:
        {
        	get:function(){
        		if(MenuItem._IsSuspendingPopupAnimationPropertyKey === undefined){
        			MenuItem._IsSuspendingPopupAnimationPropertyKey = DependencyProperty.RegisterReadOnly("IsSuspendingPopupAnimation", 
        					Boolean.Type, MenuItem.Type, 
                            /*new FrameworkPropertyMetadata(false)*/
        					FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return MenuItem._IsSuspendingPopupAnimationPropertyKey;
        	}
			
        },
             

        /// <summary> 
        /// Returns true if the Menu should suspend animations on its popup
        /// </summary>
//        public static readonly DependencyProperty 
		IsSuspendingPopupAnimationProperty:
        {
        	get:function(){
        		return MenuItem.IsSuspendingPopupAnimationPropertyKey.DependencyProperty;
        	}
			
        }, 
 
        /// <summary>
        ///     DependencyProperty for ItemContainerTemplateSelector property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ItemContainerTemplateSelectorProperty:
        {
        	get:function(){
        		if(MenuItem._ItemContainerTemplateSelectorProperty === undefined){
        			MenuItem._ItemContainerTemplateSelectorProperty =
        	            MenuBase.ItemContainerTemplateSelectorProperty.AddOwner(
        	                    MenuItem.Type, 
        	                    /*new FrameworkPropertyMetadata(new DefaultItemContainerTemplateSelector())*/
        	                    FrameworkPropertyMetadata.BuildWithDV(new DefaultItemContainerTemplateSelector()));
        		}
        		
        		return MenuItem._ItemContainerTemplateSelectorProperty;
        	}
			
        }, 
 
 
        /// <summary> 
        ///     DependencyProperty for UsesItemContainerTemplate property.
        /// </summary> 
//        public static readonly DependencyProperty 
		UsesItemContainerTemplateProperty:
        {
        	get:function(){
        		if(MenuItem._UsesItemContainerTemplateProperty === undefined){
        			MenuItem._UsesItemContainerTemplateProperty =
        	            MenuBase.UsesItemContainerTemplateProperty.AddOwner(MenuItem.Type);
        		}
        		
        		return MenuItem._UsesItemContainerTemplateProperty;
        	}
			
        }, 


        // This is so that MenuItems inside a ContextMenu can behave differently
//        internal static readonly DependencyProperty 
		InsideContextMenuProperty:
        {
        	get:function(){
        		if(MenuItem._InsideContextMenuProperty === undefined){
        			MenuItem._InsideContextMenuProperty = DependencyProperty.RegisterAttached("InsideContextMenu", Boolean.Type, MenuItem.Type,
                            /*new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.Inherits)*/
        					FrameworkPropertyMetadata.Build2(false, FrameworkPropertyMetadataOptions.Inherits));
        		}
        		
        		return MenuItem._InsideContextMenuProperty;
        	}
			
        },
             

//        private static readonly DependencyProperty 
		BooleanFieldStoreProperty:
        {
        	get:function(){
        		if(MenuItem._BooleanFieldStoreProperty === undefined){
        			MenuItem._BooleanFieldStoreProperty  = DependencyProperty.RegisterAttached(
        		            "BooleanFieldStore", 
        		            Number.Type, 
        		            MenuItem.Type,
        		            /*new FrameworkPropertyMetadata(new BoolField()BoolField.OpenedWithKeyboard)*/ 
        		            FrameworkPropertyMetadata.BuildWithDV(BoolField.OpenedWithKeyboard)
        		            ); 
        		}
        		
        		return MenuItem._BooleanFieldStoreProperty;
        	}
			
        },

        /// <summary>
        ///     Resource Key for the SeparatorStyle
        /// </summary>
//        public static ResourceKey 
		SeparatorStyleKey: 
        {
            get:function()
            { 
                return SystemResourceKey.MenuItemSeparatorStyleKey;
            } 
        } 
	});

    // Set the header to the command text if no header has been explicitly specified
//    private static object 
	function CoerceHeader(/*DependencyObject*/ d, /*object*/ value)
    {
        /*MenuItem*/var menuItem = /*(MenuItem)*/d; 
        /*RoutedUICommand*/var uiCommand;

        // If no header has been set, use the command's text 
        if (value == null && !menuItem.HasNonDefaultValue(HeaderProperty))
        { 
            uiCommand = menuItem.Command instanceof RoutedUICommand ? menuItem.Command : null;
            if (uiCommand != null)
            {
                value = uiCommand.Text; 
            }
            return value; 
        } 

        // If the header had been set to a UICommand by the ItemsControl, replace it with the command's text 
        uiCommand = value instanceof RoutedUICommand ? value : null;

        if (uiCommand != null)
        { 
            // The header is equal to the command.
            // If this MenuItem was generated for the command, then go ahead and overwrite the header 
            // since the generator automatically set the header. 
            /*ItemsControl*/var parent = ItemsControl.ItemsControlFromItemContainer(menuItem);
            if (parent != null) 
            {
                var originalItem = parent.ItemContainerGenerator.ItemFromContainer(menuItem);

                if (originalItem == value) 
                {
                    return uiCommand.Text; 
                } 
            }
        } 

        return value;
    }

//    private static void 
    function OnCommandChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*MenuItem*/var item = /*(MenuItem)*/ d;
        item.OnCommandChanged(/*(ICommand)*/ e.OldValue, /*(ICommand)*/ e.NewValue); 
    }

//    private static object 
    function CoerceIsSubmenuOpen(/*DependencyObject*/ d, /*object*/ value)
    {
        if (/*(bool)*/ value)
        { 
            /*MenuItem*/var mi = /*(MenuItem)*/ d;
            if (!mi.IsLoaded) 
            { 
                mi.RegisterToOpenOnLoad();
                return false; 
            }
        }

        return value; 
    }

    // Disable tooltips on opened menu items 
//    private static object 
    function CoerceToolTipIsEnabled(/*DependencyObject*/ d, /*object*/ value)
    { 
        /*MenuItem*/var mi = /*(MenuItem)*/ d;
        return mi.IsSubmenuOpen ? false : value;
    }

    /// <summary>
    ///     Called when IsSubmenuOpenID is invalidated on "d." 
    /// </summary>
//    private static void 
    function OnIsSubmenuOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        /*MenuItem*/var menuItem = /*(MenuItem)*/d;

        var oldValue = /*(bool)*/ e.OldValue;
        var newValue = /*(bool)*/ e.NewValue;
        // The IsSubmenuOpen value has changed; this should stop any timers
        // we may have set to open/close the menus.
        var timerRef = {"timer" : menuItem._openHierarchyTimer};
        menuItem.StopTimer(/*ref menuItem._openHierarchyTimer*/timerRef);
        menuItem._openHierarchyTimer = timerRef.timer;
        
        var timerRef1 = {"timer" : menuItem._closeHierarchyTimer};
        menuItem.StopTimer(/*ref menuItem._closeHierarchyTimer*/timerRef1); 
        menuItem._closeHierarchyTimer = timerRef1.timer;

//        MenuItemAutomationPeer peer = UIElementAutomationPeer.FromElement(menuItem) as MenuItemAutomationPeer;
//        if (peer != null) 
//        {
//            peer.ResetChildrenCache();
//            peer.RaiseExpandCollapseAutomationEvent(oldValue, newValue);
//        } 

        if (newValue) 
        { 
            CommandManager.InvalidateRequerySuggested(); // Should post an idle queue item to update IsEnabled on commands

            // When menuitem's submenu opens, it should be selected.
            menuItem.SetCurrentValueInternal(MenuItem.IsSelectedProperty, true);

            /*MenuItemRole*/var role = menuItem.Role; 
            if (role == MenuItemRole.TopLevelHeader)
            { 
                menuItem.SetMenuMode(true); 
            }
            menuItem.CurrentSelection = null; 

            // When our submenu opens, update our siblings so they do not animate
            menuItem.NotifySiblingsToSuspendAnimation();

            // Force update of CanExecute when opening menu.
            for (var i = 0; i < menuItem.Items.Count; i++) 
            { 
                /*MenuItem*/var subItem = menuItem.ItemContainerGenerator.ContainerFromIndex(i);
                subItem = subItem instanceof MenuItem ? subItem : null;
                if (subItem != null && MenuItem.GetBoolField(subItem, BoolField.CanExecuteInvalid)) 
                {
                    subItem.UpdateCanExecute();
                }
            } 

            menuItem.OnSubmenuOpened(new RoutedEventArgs(MenuItem.SubmenuOpenedEvent, menuItem)); 


            MenuItem.SetBoolField(menuItem, BoolField.IgnoreMouseEvents, true); 
            MenuItem.SetBoolField(menuItem, BoolField.MouseEnterOnMouseMove, false);

            // MenuItem should ignore any mouse enter or move events until the menu has fully
            // opened.  Otherwise we may highlight a menu item under the mouse even though 
            // the user opened the menu with the keyboard
            // This is fired below input priority so any mouse events happen before setting the flag 
            menuItem.Dispatcher.BeginInvoke(DispatcherPriority.Background, new DispatcherOperationCallback(
            		/*delegate*/function(/*object*/ param) 
            {
                MenuItem.SetBoolField(menuItem, BoolField.IgnoreMouseEvents, false); 
                return null;
            }), null);
        }
        else 
        {
            // Our submenu is closing, so close our submenu's submenu 
            if (menuItem.CurrentSelection != null) 
            {
                // We're about to close the submenu -- if focus is within 
                // the subtree, we need to take it back so that Focus isn't
                // left in an orphaned tree.
                if (menuItem.CurrentSelection.IsKeyboardFocusWithin)
                { 
                    menuItem.Focus();
                } 

                if (menuItem.CurrentSelection.IsSubmenuOpen)
                { 
                    menuItem.CurrentSelection.SetCurrentValueInternal(MenuItem.IsSubmenuOpenProperty, false);
                }
            }
            else 
            {
                // We need to take focus out of the subtree if we close 
                // the submenu.  Above we can be sure that focus will be 
                // on the selected item so we just need to check if IsFocusWithin
                // is true on the selected item.  If we have no CurrentSelection, 
                // we have to be a little more aggressive and take focus
                // back if IsFocusWithin is true.
                //
                // NOTE: This could potentially steal focus back from something 
                //       within the menuitem's header (say, a TextBox) but it is
                //       unlikely that focus will be within a header while the submenu 
                //       is open. 

                if (menuItem.IsKeyboardFocusWithin) 
                {
                    if (!menuItem.Focus())
                    {
                        // Shoot, we couldn't take focus out of the submenu 
                        // and put it back on ourselves.  Now focus is in a
                        // disconnected subtree.  Ultimately core input will 
                        // disallow this, presumably by setting focus to null. 
                        // For now we won't handle this case.
                    } 
                }
            }

            menuItem.CurrentSelection = null; 

            if ((menuItem.IsMouseOver) && (menuItem.Role == MenuItemRole.SubmenuHeader)) 
            { 
                // If the mouse is inside the subtree, then we will get a mouse leave, but we want to ignore it
                // to maintain the highlight. 
                MenuItem.SetBoolField(menuItem, BoolField.IgnoreNextMouseLeave, true);
            }

            // When our submenu closes, update our children so they will animate 
            menuItem.NotifyChildrenToResumeAnimation();

            // No Popup in the style so fire closed now 
            if (menuItem._submenuPopup == null)
            { 
                menuItem.OnSubmenuClosed(new RoutedEventArgs(MenuItem.SubmenuClosedEvent, menuItem));
            }
        }

        menuItem.CoerceValue(ToolTipService.IsEnabledProperty);
    } 

//    private static void 
    function OnIsCheckableChanged(/*DependencyObject*/ target, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        (/*(MenuItem) */target).UpdateRole(); 
    } 

    /// <summary>
    ///     Called when IsCheckedProperty is invalidated on "d." 
    /// </summary>
//    private static void 
    function OnIsCheckedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        MenuItem menuItem = (MenuItem) d; 

        if (/*(bool) */e.NewValue) 
        { 
            d.OnChecked(new RoutedEventArgs(MenuItem.CheckedEvent));
        } 
        else
        {
            d.OnUnchecked(new RoutedEventArgs(MenuItem.UncheckedEvent));
        } 
    }

//    private static void 
    function OnIsSelectedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        MenuItem menuItem = (MenuItem)d;
        // When IsSelected changes, IsHighlighted should reflect IsSelected 
        // Note: it is okay for IsHighlighted and IsSelected to be different.
        //       Selection and highlight will separate when mousing around in
        //       a submenu when any timers are active.  Until you hover long
        //       enough and your selection is "committed", selection and highlight 
        //       can disagree.
        d.SetValue(IsHighlightedPropertyKey, e.NewValue); 

        // If IsSelected is changing to false, make sure to close
        // our submenu before doing anything. 
        if (/*(bool)*/ e.OldValue)
        {
            if (d.IsSubmenuOpen)
            { 
                d.SetCurrentValueInternal(MenuItem.IsSubmenuOpenProperty, false);
            } 

            // Also stop any timers immediately when we become deselected.
            var timerRef = {"timer" : menuItem._openHierarchyTimer};
            menuItem.StopTimer(/*ref menuItem._openHierarchyTimer*/timerRef);
            menuItem._openHierarchyTimer = timerRef.timer;
            
            var timerRef1 = {"timer" : menuItem._closeHierarchyTimer};
            menuItem.StopTimer(/*ref menuItem._closeHierarchyTimer*/timerRef1); 
            menuItem._closeHierarchyTimer = timerRef1.timer;
        }

        menuItem.RaiseEvent(new RoutedPropertyChangedEventArgs/*<bool>*/(/*(bool)*/ e.OldValue, /*(bool)*/ e.NewValue, MenuBase.IsSelectedChangedEvent)); 
    }

    /// <summary> 
    ///     Called when IsSelected changed on this element or any descendant.
    /// </summary> 
//    private static void 
    function OnIsSelectedChanged(/*object*/ sender, /*RoutedPropertyChangedEventArgs<bool>*/ e)
    {
        // If IsSelected changed on a child of the MenuItem, change CurrentSelection
        // to the element that sent the event and handle the event. 
        if (sender != e.OriginalSource)
        { 
            /*MenuItem*/var menuItem = /*(MenuItem)*/sender; 
            /*MenuItem*/var source = e.OriginalSource instanceof MenuItem ? e.OriginalSource : null;

            if (source != null)
            {
                if (e.NewValue)
                { 
                    // If the item is now selected, we should stop any timers which will
                    // close the submenu.  This is for the case where one mouses out of 
                    // the current selection but then comes back. 
                    if (menuItem.CurrentSelection == source)
                    { 
                        var timerRef = {"timer" : menuItem._closeHierarchyTimer};
                        menuItem.StopTimer(/*ref menuItem._closeHierarchyTimer*/timerRef);
                        menuItem._closeHierarchyTimer = timerRef.timer;
                    }

                    // If the MenuItem is selected and it's a new item that's a child of ours, 
                    // change the CurrentSelection.
                    if (menuItem.CurrentSelection != source && source.LogicalParent == menuItem) 
                    { 
                        if (menuItem.CurrentSelection != null && menuItem.CurrentSelection.IsSubmenuOpen)
                        { 
                            menuItem.CurrentSelection.SetCurrentValueInternal(IsSubmenuOpenProperty, false);
                        }

                        menuItem.CurrentSelection = source; 
                    }
                } 
                else 
                {
                    // If the item is no longer selected 
                    // If the MenuItem has been deselected and it's the CurrentSelection,
                    // set our CurrentSelection to null.
                    if (menuItem.CurrentSelection == source)
                    { 
                        menuItem.CurrentSelection = null;
                    } 
                } 

                // Mark the event as handled as long as it came from a MenuItem underneath us 
                // even if we didn't necessarily do anything.
                e.Handled = true;
            }
        } 
    }

//    private static void 
    function OnInputGestureTextChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
    }

    // Gets the input gesture text from the command text if it hasn't been explicitly specified
//    private static object 
    function CoerceInputGestureText(/*DependencyObject*/ d, /*object*/ value)
    {
        /*MenuItem*/var menuItem = /*(MenuItem)*/d; 
        /*RoutedCommand*/var routedCommand;

        if (String.IsNullOrEmpty(value) && !menuItem.HasNonDefaultValue(InputGestureTextProperty) 
            && (routedCommand = menuItem.Command instanceof RoutedCommand ? menuItem.Command : null) != null )
        { 
            /*InputGestureCollection*/var col = routedCommand.InputGestures;
            if ((col != null) && (col.Count >= 1))
            {
                // Search for the first key gesture 
                for (var i = 0; i < col.Count; i++)
                { 
                    /*KeyGesture*/var keyGesture = /*(IList)*/col.Get(i);
                    keyGesture = keyGesture instanceof KeyGesture ? keyGesture : null; 
                    if (keyGesture != null)
                    { 
                        return keyGesture.GetDisplayStringForCulture(CultureInfo.CurrentCulture);
                    }
                }
            } 
        }

        return value; 
    }

    /// <summary> 
    ///     Automatically set the Command property if the data item that this MenuItem represents is a command.
    /// </summary>
//    internal static void 
    MenuItem.PrepareMenuItem = function(/*DependencyObject*/ element, /*object*/ item)
    { 
        /*MenuItem*/var menuItem = element instanceof MenuItem ? element : null;
        if (menuItem != null) 
        { 
            /*ICommand*/var command = item instanceof ICommand ? item : null;
            if (command != null) 
            {
                if (!menuItem.HasNonDefaultValue(MenuItem.CommandProperty))
                {
                    menuItem.Command = command; 
                }
            } 

            if (MenuItem.GetBoolField(menuItem, BoolField.CanExecuteInvalid))
            { 
                menuItem.UpdateCanExecute();
            }
        }
        else 
        {
            /*Separator*/var separator = item instanceof Separator ? item : null; 
            if (separator != null) 
            {
//                var hasModifiers; 
                /*BaseValueSourceInternal*/var vs = separator.GetValueSource(StyleProperty, null, /*out hasModifiers*/{"hasModifiers" : null});
                if (vs <= BaseValueSourceInternal.ImplicitReference)
                    separator.SetResourceReference(StyleProperty, SeparatorStyleKey);

                separator.DefaultStyleKey = SeparatorStyleKey;
            } 
        } 

    }; 

//    private static void 
    function OnAccessKeyPressed(/*object*/ sender, /*AccessKeyPressedEventArgs*/ e)
    {
        /*MenuItem*/var menuItem = sender instanceof MenuItem ? sender : null;
        var isScope = false; 

        if (e.Target == null) 
        { 
            // MenuItem access key should not work if something else beside MenuBase has capture
            if (Mouse.Captured == null || Mouse.Captured instanceof MenuBase) 
            {
                e.Target = menuItem;

                // special case is if we are the original source and our submenu is open, 
                // this is the case where the mouse moved over the header and focus is on
                // the menu item but really you want to access key processing to be in your 
                // submenu. 
                // This assumes that no one will ever directly register a MenuItem with the AKM.
                if (e.OriginalSource == menuItem && menuItem.IsSubmenuOpen) 
                {
                    isScope = true;
                }
            } 
            else
            { 
                e.Handled = true; 
            }
        } 
        else if (e.Scope == null)
        {
            // We want menu items to be a scope, but not for any AKs in its header.

            // If e.Target is already filled in, check if it's a MenuItem.
            // If it is and it's not us, we are its scope (i.e. we're the first MenuItem 
            // above it in the chain).  If it's not a MenuItem, we have to take the long way. 
            if (e.Target != menuItem && e.Target instanceof MenuItem)
            { 
                isScope = true;
            }
            else
            { 
                // This case handles when you have some non-MenuItem in a menu that can be
                // the target of access keys, like a Button. 

                // MenuItems are a scope for all access keys which are outside of themselves.
                // e.Source is the logical element in which the event was raised. 
                // If we can walk from the source to ourselves, then we are not correct
                // scope of this access key; some parent should be.

                /*DependencyObject*/var source = e.Source instanceof DependencyObject ? e.Source : null; 

                while (source != null) 
                { 
                    // If we walk up to this Menuitem, we are not the scope.
                    if (source == menuItem) 
                    {
                        break;
                    }

                    /*UIElement*/var uiElement = source instanceof UIElement ? source : null;

                    // If we walk up to an item which is one of our children, we are their scope. 
                    if ((uiElement != null) && (ItemsControlFromItemContainer(uiElement) == menuItem))
                    { 
                        isScope = true;
                        break;
                    }

                    source = GetFrameworkParent(source);
                } 
            } 
        }

        if (isScope)
        {
            e.Scope = menuItem;
            e.Handled = true; 
        }
    } 

//    internal static void 
    MenuItem.SetInsideContextMenuProperty = function(/*UIElement*/ element, /*bool*/ value) 
    { 
        element.SetValue(MenuItem.InsideContextMenuProperty, value);
    }; 

    /// <summary>
    ///     Performs an IsMouseOver test but accounts for elements that have capture
    ///     and instead checks their children. 
    /// </summary>
    /// <param name="elem">The element to test.</param> 
    /// <returns>True if the mouse is over the element, regardless of capture. False otherwise.</returns> 
//    private static bool 
    function IsMouseReallyOver(/*FrameworkElement*/ elem)
    { 
        var isMouseOver = elem.IsMouseOver;

        if (isMouseOver)
        { 
            if ((Mouse.Captured == elem) && (Mouse.DirectlyOver == elem))
            { 
                // The mouse is not over any of the children of this captured element. 
                // Assuming that this means that the mouse is not really over the element.
                return false; 
            }
        }

        return isMouseOver; 
    }

//    private static object 
    function OnCoerceAcceleratorKey(/*DependencyObject*/ d, /*object*/ value) 
    { 
        if (value == null)
        { 
            var inputGestureText = d.InputGestureText;
            if (inputGestureText != String.Empty)
            {
                value = inputGestureText; 
            }
        } 

        return value;
    } 

//    private static bool 
    function GetBoolField(/*UIElement*/ element, /*BoolField*/ field)
    { 
        return ((/*(BoolField)*/element.GetValue(MenuItem.BooleanFieldStoreProperty)) & field) != 0;
    } 

//    private static void 
    function SetBoolField(/*UIElement*/ element, /*BoolField*/ field, /*bool*/ value)
    { 
        if (value)
        {
            element.SetValue(BooleanFieldStoreProperty, (/*(BoolField)*/element.GetValue(MenuItem.BooleanFieldStoreProperty)) | field);
        } 
        else
        { 
            element.SetValue(BooleanFieldStoreProperty, (/*(BoolField)*/element.GetValue(MenuItem.BooleanFieldStoreProperty)) & (~field)); 
        }
    }
    
//    static MenuItem()
    function Initialize()
    { 
    	//cym comment£º this line from MenuBase 
    	EventManager.RegisterClassHandler(MenuBase.Type, MenuItem.PreviewClickEvent, new RoutedEventHandler(null, MenuBase.OnMenuItemPreviewClick));
    	
    	HeaderedContentControl.HeaderProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(null, new CoerceValueCallback(null, CoerceHeader))*/
        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null, new CoerceValueCallback(null, CoerceHeader)));

        EventManager.RegisterClassHandler(MenuItem.Type, AccessKeyManager.AccessKeyPressedEvent,
        		new AccessKeyPressedEventHandler(null, OnAccessKeyPressed));
        EventManager.RegisterClassHandler(MenuItem.Type, MenuBase.IsSelectedChangedEvent,
        		new RoutedPropertyChangedEventHandler/*<bool>*/(null, OnIsSelectedChanged)); 

        Control.ForegroundProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(SystemColors.MenuTextBrush)*/
        		FrameworkPropertyMetadata.BuildWithDV(SystemColors.MenuTextBrush)); 
        Control.FontFamilyProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(SystemFonts.MessageFontFamily)*/
        		FrameworkPropertyMetadata.BuildWithDV(SystemFonts.MessageFontFamily)); 
        Control.FontSizeProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(SystemFonts.MessageFontSize)*/
        		FrameworkPropertyMetadata.BuildWithDV(SystemFonts.MessageFontSize));
        Control.FontStyleProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(SystemFonts.MessageFontStyle)*/
        		FrameworkPropertyMetadata.BuildWithDV(SystemFonts.MessageFontStyle)); 
        Control.FontWeightProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(SystemFonts.MessageFontWeight)*/
        		FrameworkPropertyMetadata.BuildWithDV(SystemFonts.MessageFontWeight));

        // Disable tooltips on menu item when submenu is open
        ToolTipService.IsEnabledProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(null, new CoerceValueCallback(null, CoerceToolTipIsEnabled))*/
        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null, new CoerceValueCallback(null, CoerceToolTipIsEnabled))); 


        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(MenuItem.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(MenuItem.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(MenuItem.Type);

        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.None)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.None)); 

        // Disable default focus visual for MenuItem. 
        FrameworkElement.FocusVisualStyleProperty.OverrideMetadata(MenuItem.Type, 
        		/*new FrameworkPropertyMetadata(null  default value )*/
        		FrameworkPropertyMetadata.BuildWithDV(null)); 


//        // While the menu is opened, Input Method should be suspended.
//        // the docusmen focus of Cicero should not be changed but key typing should not be
//        // dispatched to IME/TIP.
//        InputMethod.IsInputMethodSuspendedProperty.OverrideMetadata(MenuItem.Type, 
//        		/*new FrameworkPropertyMetadata(true, FrameworkPropertyMetadataOptions.Inherits)*/
//        		FrameworkPropertyMetadata.Build2(true, FrameworkPropertyMetadataOptions.Inherits)); 
//        AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(MenuItem.Type, 
//        		/*new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip)*/
//        		FrameworkPropertyMetadata.BuildWithDV(IsOffscreenBehavior.FromClip));
    } 
	
	MenuItem.Type = new Type("MenuItem", MenuItem, [HeaderedContentControl.Type, ICommandSource.Type]);
	Initialize();
	
	return MenuItem;
});

 

