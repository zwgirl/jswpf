/**
 * MenuBase
 */

define(["dojo/_base/declare", "system/Type", "controls/ItemsControl", "controls/Separator", "input/MouseButton", 
        "input/MouseButtonState", "input/KeyboardNavigation", "input/Key", "windows/RoutedPropertyChangedEventHandler"], 
		function(declare, Type, ItemsControl, Separator, MouseButton,
				MouseButtonState, KeyboardNavigation, Key, RoutedPropertyChangedEventHandler){
	
	var MenuItem = null;
	function EnsureMenuItem(){
		if(MenuItem == null){
			MenuItem = using("controls/MenuItem");
		}
		
		return MenuItem;
	}
	
    var MenuBaseFlags = declare(null, {});
    MenuBaseFlags.IgnoreNextLeftRelease  = 0x01; 
    MenuBaseFlags.IgnoreNextRightRelease = 0x02;
    MenuBaseFlags.IsMenuMode             = 0x04; 
    MenuBaseFlags.OpenOnMouseEnter       = 0x08;
    MenuBaseFlags.IsAcquireFocusMenuMode = 0x10;
    
	var MenuBase = declare("MenuBase", ItemsControl,{
		constructor:function(){
			  
			 
//	        private PresentationSource _pushedMenuMode; 
//
//	        private MenuItem _currentSelection;
//	        private BitVector32 _bitFlags = new BitVector32(0);
		},
        /// <summary>
        ///     Called when any mouse button is pressed or released on this subtree 
        /// </summary> 
        /// <param name="e">Event arguments.</param>
//        protected virtual void 
        HandleMouseButton:function(/*MouseButtonEventArgs*/ e) 
        {
        },

//        private void 
        OnClickThrough:function(/*MouseButtonEventArgs*/ e) 
        {
            if (e.ChangedButton == MouseButton.Left || e.ChangedButton == MouseButton.Right)
            {
                if (this.HasCapture) 
                {
                    var close = true; 
 
                    if (e.ButtonState == MouseButtonState.Released)
                    { 
                        // Check to see if we should ignore the this mouse release
                        if (e.ChangedButton == MouseButton.Left && this.IgnoreNextLeftRelease)
                        {
                        	this.IgnoreNextLeftRelease = false; 
                            close = false; // don't close
                        } 
                        else if (e.ChangedButton == MouseButton.Right && this.IgnoreNextRightRelease) 
                        {
                        	this.IgnoreNextRightRelease = false; 
                            close = false; // don't close
                        }
                    }
 
                    if (close)
                    { 
                    	this.IsMenuMode = false; 
                    }
                } 
            }
        },
 
        /// <summary> 
        ///     Called when IsMouseOver changes on this element.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnMouseLeave:function(/*MouseEventArgs*/ e)
        {
        	ItemsControl.prototype.OnMouseLeave.call(this, e); 

            // if we don't have capture and the mouse left (but the item isn't selected), then we shouldn't have anything selected. 
            if (!this.HasCapture && !this.IsMouseOver && this.CurrentSelection != null && !this.CurrentSelection.IsKeyboardFocused && !this.CurrentSelection.IsSubmenuOpen) 
            {
            	this.CurrentSelection = null; 
            }
        },

        /// <summary>
        /// Called when the focus is no longer on or within this element.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        { 
        	ItemsControl.prototype.OnIsKeyboardFocusWithinChanged.call(this, e);
 
            if (this.IsKeyboardFocusWithin)
            {
                // When focus enters the menu, we should enter menu mode.
                if (!this.IsMenuMode) 
                {
                	this.IsMenuMode = true; 
                	this.OpenOnMouseEnter = false; 
                }
 
                if (KeyboardNavigation.IsKeyboardMostRecentInputDevice())
                {
                    // Turn on keyboard cues b/c we took focus with the keyboard
                    KeyboardNavigation.EnableKeyboardCues(this, true); 
                }
            } 
            else 
            {
                // Turn off keyboard cues 
                KeyboardNavigation.EnableKeyboardCues(this, false);

                if (this.IsMenuMode)
                { 
                    // When showing a ContextMenu of a MenuItem, the ContextMenu will take focus
                    // out of this menu's subtree.  The ContextMenu takes capture before taking 
                    // focus, so if we are in MenuMode but don't have capture then we are waiting 
                    // for the context menu to close.  Thus, we should only exit menu mode when
                    // we have capture. 
                    if (this.HasCapture)
                    {
                    	this.IsMenuMode = false;
                    } 
                }
                else 
                { 
                    // Okay, we weren't in menu mode but we could have had a selection (mouse hovering), so clear that
                    if (this.CurrentSelection != null) 
                    {
                    	this.CurrentSelection = null;
                    }
                } 
            }
 
            this.InvokeMenuOpenedClosedAutomationEvent(IsKeyboardFocusWithin); 
        },
 

//        private bool 
        IsDescendant:function(/*DependencyObject*/ node) 
        {
            return this.IsDescendant(this, node); 
        }, 


        /// <summary>
        ///     This is the method that responds to the KeyDown event. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e) 
        {
        	ItemsControl.prototype.OnKeyDown.call(this, e); 
            var key = e.Key;
            switch (key)
            {
                case Key.Escape: 
                    {
                        if (this.CurrentSelection != null && this.CurrentSelection.IsSubmenuOpen) 
                        { 
                        	this.CurrentSelection.SetCurrentValueInternal(EnsureMenuItem().IsSubmenuOpenProperty, BooleanBoxes.FalseBox);
                        	this.OpenOnMouseEnter = false; 
                            e.Handled = true;
                        }
                        else
                        { 
                        	this.KeyboardLeaveMenuMode();
 
                            e.Handled = true; 
                        }
                    } 
                    break;

                case Key.System:
                    if ((e.SystemKey == Key.LeftAlt) || 
                        (e.SystemKey == Key.RightAlt) ||
                        (e.SystemKey == Key.F10)) 
                    { 
                    	this.KeyboardLeaveMenuMode();
 
                        e.Handled = true;
                    }
                    break;
            } 
        },
 
        /// <summary> 
        /// Return true if the item is (or is eligible to be) its own ItemUI
        /// </summary>
//        protected override bool 
        IsItemItsOwnContainerOverride:function(/*object*/ item)
        { 
            var ret = (item instanceof EnsureMenuItem()) || (item instanceof Separator);
            if (!ret) 
            { 
                _currentItem = item;
            } 

            return ret;
        },
 
//        protected override DependencyObject 
        GetContainerForItemOverride:function()
        { 
            var currentItem = _currentItem; 
            this._currentItem = null;
 
            if (this.UsesItemContainerTemplate)
            {
                /*DataTemplate*/var itemContainerTemplate = ItemContainerTemplateSelector.SelectTemplate(currentItem, this);
                if (itemContainerTemplate != null) 
                {
                    /*object*/var itemContainer = itemContainerTemplate.LoadContent(); 
                    if (itemContainer instanceof EnsureMenuItem() || itemContainer instanceof Separator) 
                    {
                        return itemContainer instanceof DependencyObject ? itemContainer : null; 
                    }
                    else
                    {
                        throw new InvalidOperationException(SR.Get(SRID.InvalidItemContainer, this.GetType().Name, MenuItem.Type.Name, typeof(Separator).Name, itemContainer)); 
                    }
                } 
            } 

            return new EnsureMenuItem()(); 
        },


        ///<SecurityNote> 
        ///     Critical - Accesses HwndSource
        ///     TreatAsSafe - No information exposed. Simply decides whether or not to restore focus.
        ///</SecurityNote>
//        private void 
        RestorePreviousFocus:function()
        { 
            // Only restore focus if focus is still within the menu.  If 
            // focus has already been moved outside of the menu, then
            // we don't want to disturb it. 
            if (this.IsKeyboardFocusWithin)
            {
                // Only restore WPF focus if the HWND with focus is an
                // HwndSource.  This enables child HWNDs, other top-level 
                // non-WPF HWNDs, or even child HWNDs of other WPF top-level
                // windows to retain focus when menus are dismissed. 
                /*IntPtr*/var hwndWithFocus = MS.Win32.UnsafeNativeMethods.GetFocus(); 
                /*HwndSource*/var hwndSourceWithFocus = hwndWithFocus != IntPtr.Zero ? HwndSource.CriticalFromHwnd(hwndWithFocus) : null;
                if(hwndSourceWithFocus != null) 
                {
                    // We restore focus by setting focus to the parent's focus
                    // scope.  This may not seem correct, because it presumes
                    // the focus came from the logical-focus element of the 
                    // parent scope.  In fact, it could have come from any
                    // number of places.  However, we have not figured out a 
                    // better solution for restoring focus across scenarios 
                    // such as:
                    // 
                    // 1) A context menu of a menu item.
                    // 2) Two menus side-by-side
                    // 3) A menu and a toolbar side-by-side
                    // 
                    // Simply remembering the last element with focus and
                    // restoring focus to it does not work.  For example, 
                    // two menus side-by-side will end up remembering each 
                    // other, and you can get stuck in an infinite loop.
                    // 
                    // Restoring focus through the parent's focus scope will
                    // not directly work if you open one window's menu from
                    // another window. Visual Studio, as an example, will
                    // intercept the focus change events and forward 
                    // appropriately for the scenario of restoring focus to
                    // an element in a different top-level window. 
 
 					// DependencyObject parent = Parent;
                    // if (parent == null) 
                    // {
                        // If there is no logical parent, use the visual parent.
                    //     parent = VisualTreeHelper.GetParent(this);
                    // } 

                    // if (parent != null) 
                    // { 
                    //     IInputElement parentScope = FocusManager.GetFocusScope(parent) as IInputElement;
                    //     if (parentScope != null) 
                    //     {
                    //         Keyboard.Focus(parentScope);
                    //     }
                    // } 

					// Unfortunately setting focus to the parent focusscope tripped up VS in the scenario where 
					// Menus are contained within ToolBars. In this case when the Menu is dismissed they want 
					// focus to be restored to the element in the main window that previously had focus. However
 					// since ToolBar is  the parent focusscope for the Menu we end up restoring focus to its 
					// focusedelment. It is also noted that this implementation is a behavioral change from .Net 3.5.
 					// Hence we are putting back the old behavior which is to set Keyboard.Focus to null which will
 					// delegate focus through the main window to its focusedelement.
 
					Keyboard.Focus(null);
 
 					 
                }
                else 
                {
                    // In the case where Win32 focus is not on a WPF
                    // HwndSource, we just clear WPF focus completely.
                    // 
                    // Note that calling Focus(null) will set focus to the root
                    // element of the active source, which is not what we want. 
                    Keyboard.ClearFocus(); 
                }
            } 
        },

//        internal void 
        KeyboardLeaveMenuMode:function() 
        {
            // If we're in MenuMode, exit.  This will relinquish capture, 
            // clear CurrentSelection, and RestorePreviousFocus 
            if (this.IsMenuMode)
            { 
            	this.IsMenuMode = false;
            }
            else
            { 
            	this.CurrentSelection = null;
            	this.RestorePreviousFocus(); 
            }
        }, 

        ///<SecurityNote> 
        ///     Critical - Accesses PresentationSource 
        ///     TreatAsSafe - No information exposed. Simply notifies the
        ///                   PresentationSource to enter/leave menu mode. 
        ///</SecurityNote>
//        private void 
        PushMenuMode:function(/*bool*/ isAcquireFocusMenuMode)
        { 
//            Debug.Assert(_pushedMenuMode == null);
        	this._pushedMenuMode = PresentationSource.CriticalFromVisual(this); 
//            Debug.Assert(_pushedMenuMode != null); 
        	this.IsAcquireFocusMenuMode = isAcquireFocusMenuMode;
            InputManager.UnsecureCurrent.PushMenuMode(_pushedMenuMode); 
        },

        ///<SecurityNote>
        ///     Critical - Accesses PresentationSource 
        ///     TreatAsSafe - No information exposed. Simply notifies the
        ///                   PresentationSource to enter/leave menu mode. 
        ///</SecurityNote> 
//        private void 
        PopMenuMode:function() 
        {
//            Debug.Assert(_pushedMenuMode != null);

            /*PresentationSource*/ var pushedMenuMode = this._pushedMenuMode; 
            this._pushedMenuMode = null;
            this.IsAcquireFocusMenuMode = false; 
            InputManager.UnsecureCurrent.PopMenuMode(pushedMenuMode); 
        },
	});
	
	Object.defineProperties(MenuBase.prototype,{

        /// <summary>
        ///     UsesItemContainerTemplate property which says whether the ItemContainerTemplateSelector property is to be used.
        /// </summary> 
//        public bool 
        UsesItemContainerTemplate:
        { 
            get:function() { return this.GetValue(MenuBase.UsesItemContainerTemplateProperty); }, 
            set:function(value) { this.SetValue(MenuBase.UsesItemContainerTemplateProperty, value); }
        }, 


        /// <summary> 
        ///     Currently selected item in this menu or submenu.
        /// </summary>
        /// <value></value>
//        internal MenuItem 
        CurrentSelection :
        {
            get:function() 
            { 
                return this._currentSelection;
            }, 
            set:function(value)
            {
                // Even if we don't have capture we should move focus when one item is already focused.
                var wasFocused = false; 

                if (this._currentSelection != null) 
                { 
                    wasFocused = this._currentSelection.IsKeyboardFocused;
                    this._currentSelection.SetCurrentValueInternal(EnsureMenuItem().IsSelectedProperty, BooleanBoxes.FalseBox); 
                }

                this._currentSelection = value;
                if (this._currentSelection != null) 
                {
                	this._currentSelection.SetCurrentValueInternal(EnsureMenuItem().IsSelectedProperty, BooleanBoxes.TrueBox); 
                    if (wasFocused) 
                    {
                    	this._currentSelection.Focus(); 
                    }
                }
            }
        },

//        internal bool 
        HasCapture : 
        { 
            get:function()
            { 
                return Mouse.Captured == this;
            }
        },
 
//        internal bool 
        IgnoreNextLeftRelease:
        { 
            get:function() { return this._bitFlags[MenuBaseFlags.IgnoreNextLeftRelease]; }, 
            set:function(value) { this._bitFlags[MenuBaseFlags.IgnoreNextLeftRelease] = value; }
        },

//        internal bool 
        IgnoreNextRightRelease:
        {
            get:function() { return this._bitFlags[MenuBaseFlags.IgnoreNextRightRelease]; }, 
            set:function(value) { this._bitFlags[MenuBaseFlags.IgnoreNextRightRelease] = value; }
        }, 
 
//        internal bool 
        IsMenuMode:
        { 
            get:function()
            {
                return this._bitFlags[MenuBaseFlags.IsMenuMode];
            }, 
            set:function(value)
            { 
//                Debug.Assert(CheckAccess(), "IsMenuMode requires context access");
                var isMenuMode = this._bitFlags[MenuBaseFlags.IsMenuMode]; 
                if (isMenuMode != value)
                {
                    isMenuMode = this._bitFlags[MenuBaseFlags.IsMenuMode] = value;
 
                    if (isMenuMode)
                    { 
                        // Take capture so that all mouse messages stay below the menu. 
                        if (!this.IsDescendant(this, Mouse.Captured instanceof Visual ? Mouse.Captured : null) 
                        		&& !Mouse.Capture(this, CaptureMode.SubTree))
                        { 
                            // If we're unable to take capture, leave menu mode immediately.
                            isMenuMode = this._bitFlags[MenuBaseFlags.IsMenuMode] = false;
                        }
                        else 
                        {
                            // If we haven't pushed the menu mode yet (which 
                            // should have already happened if keyboard focus 
                            // is set within the menu), push it now.
                            if (!this.HasPushedMenuMode) 
                            {
                            	this.PushMenuMode(/*isAcquireFocusMenuMode*/ false);
                            }
 
                            this.RaiseClrEvent(InternalMenuModeChangedKey, EventArgs.Empty);
                        } 
                    } 

                    if (!isMenuMode) 
                    {
                        var wasSubmenuOpen = false;

                        if (this.CurrentSelection != null) 
                        {
                            wasSubmenuOpen = this.CurrentSelection.IsSubmenuOpen; 
                            this.CurrentSelection.IsSubmenuOpen = false; 
                            this.CurrentSelection = null;
                        } 

                        // Note that this code path is also used to cleanup
                        // the case where setting IsMenuMode=true fails due
                        // to failure to gain capture. We pop out of the menu 
                        // mode irrespective of where it was pushed.
                        if (this.HasPushedMenuMode) 
                        { 
                            // Call PopMenuMode before we do much else, so that
                            // focus changes will properly activate windows. 
                        	this.PopMenuMode();
                        }

                        if (!value) 
                        {
                            // Fire the event before capture is released and after submenus have been closed. 
                        	this.RaiseClrEvent(InternalMenuModeChangedKey, EventArgs.Empty); 
                        }
 
                        // Clear suspending animation flags on all descendant menuitems
                        this.SetSuspendingPopupAnimation(this, null, false);

                        if (this.HasCapture) 
                        {
                            Mouse.Capture(null);
                        }
 
                        this.RestorePreviousFocus();
                    } 
 
                    // Assume menu items should open when the mouse hovers over them
                    this.OpenOnMouseEnter = isMenuMode; 
                }
            }
        },
 
        // This bool is used by top level menu items to
        // determine if they should open on mouse enter 
        // Menu items shouldn't open if the use hit Alt 
        // to get in menu mode and then hovered over the item
//        internal bool 
        OpenOnMouseEnter: 
        {
            get:function() { return this._bitFlags[MenuBaseFlags.OpenOnMouseEnter]; }, 
            set:function(value) { this._bitFlags[MenuBaseFlags.OpenOnMouseEnter] = value; }
        },

 
        ///<SecurityNote>
        ///     Critical - Accesses PresentationSource
        ///     TreatAsSafe - No information exposed. Simply returns
        ///                   whether or not we have pushed menu mode. 
        ///</SecurityNote>
//        private bool 
        HasPushedMenuMode: 
        { 
            get:function() 
            {
                return _pushedMenuMode != null;
            }
        },

        /// <summary> 
        ///     This boolean determines if the PushMenuMode was 
        ///     performed due to acquire focus or due to programmatic
        ///     set of IsMenuMode. 
        /// </summary>
//        private bool 
        IsAcquireFocusMenuMode:
        {
            get:function() { return this._bitFlags[MenuBaseFlags.IsAcquireFocusMenuMode]; }, 
            set:function(value) { his._bitFlags[MenuBaseFlags.IsAcquireFocusMenuMode] = value; }
        } 
	});
	
	Object.defineProperties(MenuBase,{
	      /// <summary>
        ///     DependencyProperty for ItemContainerTemplateSelector property.
        /// </summary>
//        public static readonly DependencyProperty 
        ItemContainerTemplateSelectorProperty:
        {
        	get:function(){
        		if(MenuBase._ItemContainerTemplateSelectorProperty === undefined){
        			MenuBase._ItemContainerTemplateSelectorProperty = 
        	            DependencyProperty.Register(
        	                    "ItemContainerTemplateSelector", 
        	                    ItemContainerTemplateSelector.Type, 
        	                    MenuBase.Type,
        	                    new FrameworkPropertyMetadata(new DefaultItemContainerTemplateSelector())); 
        		}
        		
        		return MenuBase._ItemContainerTemplateSelectorProperty;
        	}
        },

        /// <summary>
        ///     DependencyProperty for UsesItemContainerTemplateSelector property.
        /// </summary> 
//        public static readonly DependencyProperty 
        UsesItemContainerTemplateProperty:
        {
        	get:function(){
        		if(MenuBase._UsesItemContainerTemplateProperty === undefined){
        			MenuBase._UsesItemContainerTemplateProperty =
        	            DependencyProperty.Register( 
        	                    "UsesItemContainerTemplate", 
        	                    Boolean.Type,
        	                    MenuBase.Type); 
        		}
        		
        		return MenuBase._UsesItemContainerTemplateProperty;
        	}
        }, 

//        internal static readonly RoutedEvent 
        IsSelectedChangedEvent:
        {
        	get:function(){
        		if(MenuBase._IsSelectedChangedEvent === undefined){
        			MenuBase._IsSelectedChangedEvent = EventManager.RegisterRoutedEvent( 
        		            "IsSelectedChanged", RoutingStrategy.Bubble, RoutedPropertyChangedEventHandler.Type, MenuBase.Type);
        		}
        		
        		return MenuBase._IsSelectedChangedEvent;
        	}
        }, 

 
//        private static readonly EventPrivateKey 
        InternalMenuModeChangedKey:
        {
        	get:function(){
        		if(MenuBase._InternalMenuModeChangedKey === undefined){
        			MenuBase._InternalMenuModeChangedKey = new EventPrivateKey(); 
        		}
        		
        		return MenuBase._InternalMenuModeChangedKey;
        	}
        }, 

	});
	
    /// <summary>
    ///     Called when any mouse button is pressed on this subtree 
    /// </summary>
    /// <param name="sender">Sender of the event.</param> 
    /// <param name="e">Event arguments.</param> 
//    private static void 
    function OnMouseButtonDown(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
        sender.HandleMouseButton(e);
    }

    /// <summary> 
    ///     Called when any mouse right button is released on this subtree
    /// </summary> 
    /// <param name="sender">Sender of the event.</param> 
    /// <param name="e">Event arguments.</param>
//    private static void 
    function OnMouseButtonUp(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
    	sender.HandleMouseButton(e);
    }

//    private static void 
    function OnClickThroughThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
    	sender.OnClickThrough(e); 
    } 

    // This is called on MouseLeftButtonDown, MouseLeftButtonUp, MouseRightButtonDown, MouseRightButtonUp 
//    private static void 
    function OnPromotedMouseButton(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
        if (e.ChangedButton == MouseButton.Left) 
        {
            // If it wasn't outside the subtree, we should handle the mouse event. 
            // This makes things consistent so that just in case one of our children
            // didn't handle the event, it doesn't escape the menu hierarchy.
            e.Handled = true;
        } 
    }

    // This method ensures that whenever focus is given to an element 
    // within a menu, that the menu enters menu mode.  This can't be
    // done with a simple IsFocusWithin changed handler because we 
    // need to actually enter menu mode before focus changes. 
//    private static void 
    function OnPreviewKeyboardInputProviderAcquireFocus(/*object*/ sender, /*KeyboardInputProviderAcquireFocusEventArgs*/ e)
    { 
        /*MenuBase*/var menu =  sender;

        // If we haven't already pushed menu mode, we need to do it before
        // focus enters the menu for the first time 
        if (!menu.IsKeyboardFocusWithin && !menu.HasPushedMenuMode)
        { 
            // Call PushMenuMode just before focus enters the menu... 
            menu.PushMenuMode(/*isAcquireFocusMenuMode*/ true);
        } 
    }

    // This method ensures that whenever focus is not acquired
    // but MenuMode has been pushed with the expection, a 
    // corresponding PopMenu is performed.
//    private static void 
    function OnKeyboardInputProviderAcquireFocus(/*object*/ sender, /*KeyboardInputProviderAcquireFocusEventArgs*/ e) 
    { 
        var menu = /*(MenuBase)*/ sender;
        if (!menu.IsKeyboardFocusWithin && !e.FocusAcquired && menu.IsAcquireFocusMenuMode) 
        {
//            Debug.Assert(menu.HasPushedMenuMode);
            // The input provider did not acquire focus.  So we will not
            // succeed in setting focus to the desired element within the 
            // menu.
            menu.PopMenuMode(); 
        } 
    }


//    private static void 
    function OnIsSelectedChanged(/*object*/ sender, /*RoutedPropertyChangedEventArgs<bool>*/ e)
    { 
        // We assume that within a menu the only top-level menu items are direct children of
        // the one and only top-level menu. 
        /*MenuItem*/var newSelectedMenuItem = e.OriginalSource;
        newSelectedMenuItem = newSelectedMenuItem instanceof EnsureMenuItem() ? newSelectedMenuItem : null; 

        if (newSelectedMenuItem != null) 
        {
            var menu = /*(MenuBase)*/sender;

            // If the selected item is a child of ours, make it the current selection. 
            // If the selection changes from a top-level menu item with its submenu
            // open to another, the new selection's submenu should be open. 
            if (e.NewValue) 
            {
                if ((menu.CurrentSelection != newSelectedMenuItem) && (newSelectedMenuItem.LogicalParent == menu)) 
                {
                    var wasSubmenuOpen = false;

                    if (menu.CurrentSelection != null) 
                    {
                        wasSubmenuOpen = menu.CurrentSelection.IsSubmenuOpen; 
                        menu.CurrentSelection.SetCurrentValueInternal(EnsureMenuItem().IsSubmenuOpenProperty, false); 
                    }

                    menu.CurrentSelection = newSelectedMenuItem;
                    if (menu.CurrentSelection != null && wasSubmenuOpen)
                    {
                        // Only open the submenu if it's a header (i.e. has items) 
                        /*MenuItemRole*/var role = menu.CurrentSelection.Role;

                        if (role == MenuItemRole.SubmenuHeader || role == MenuItemRole.TopLevelHeader) 
                        {
                            if (menu.CurrentSelection.IsSubmenuOpen != wasSubmenuOpen) 
                            {
                                menu.CurrentSelection.SetCurrentValueInternal(EnsureMenuItem().IsSubmenuOpenProperty, wasSubmenuOpen);
                            }
                        } 
                    }
                } 
            } 
            else
            { 
                // As in MenuItem.OnIsSelectedChanged, if the item is deselected
                // and it's our current selection, set CurrentSelection to null.
                if (menu.CurrentSelection == newSelectedMenuItem)
                { 
                    menu.CurrentSelection = null;
                } 
            } 

            e.Handled = true; 
        }
    }

//    internal static bool 
    MenuBase.IsDescendant = function(/*DependencyObject*/ reference, /*DependencyObject*/ node) 
    {
        var success = false;

        /*DependencyObject*/var curr = node; 

        while (curr != null) 
        { 
            if (curr == reference)
            { 
                success = true;
                break;
            }

            // Find popup if curr is a PopupRoot
            /*PopupRoot*/var popupRoot = curr instanceof PopupRoot ? curr : null; 
            if (popupRoot != null) 
            {
                //Now Popup does not have a visual link to its parent (for context menu) 
                //it is stored in its parent's arraylist (DP)
                //so we get its parent by looking at PlacementTarget
                /*Popup*/var popup = popupRoot.Parent instanceof Popup ? popupRoot.Parent : null;

                curr = popup;

                if (popup != null) 
                {
                    // Try the poup Parent 
                    curr = popup.Parent;

                    // Otherwise fall back to placement target
                    if (curr == null) 
                    {
                        curr = popup.PlacementTarget; 
                    } 
                }
            } 
            else // Otherwise walk tree
            {
                curr = PopupControlService.FindParent(curr);

            }

        } 

        return success; 
    };

    /// <summary> 
    ///     Called when this element loses capture.
    /// </summary> 
//    private static void 
    function OnLostMouseCapture(/*object*/ sender, /*MouseEventArgs*/ e) 
    {
        /*MenuBase*/var menu = sender instanceof MenuBase ? sender : null; 

        //

        // Use the same technique employed in ComoboBox.OnLostMouseCapture to allow another control in the 
        // application to temporarily take capture and then take it back afterwards.

        if (Mouse.Captured != menu) 
        {
            if (e.OriginalSource == menu) 
            {
                // If capture is null or it's not below the menu, close.
                // More workaround for task 22022 -- check if it's a descendant (following Logical links too)
                if (Mouse.Captured == null || !MenuBase.IsDescendant(menu, Mouse.Captured instanceof DependencyObject ? Mouse.Captured : null)) 
                {
                    menu.IsMenuMode = false; 
                } 
            }
            else 
            {
                if (MenuBase.IsDescendant(menu, e.OriginalSource instanceof DependencyObject ? e.OriginalSource : null))
                {
                    // Take capture if one of our children gave up capture 
                    if (menu.IsMenuMode && Mouse.Captured == null && MS.Win32.SafeNativeMethods.GetCapture() == IntPtr.Zero)
                    { 
                        Mouse.Capture(menu, CaptureMode.SubTree); 
                        e.Handled = true;
                    } 
                }
                else
                {
                    menu.IsMenuMode = false; 
                }
            } 
        } 
    }

    /// <summary>
    ///     Called when any menu item within this subtree got clicked.
    ///     Closes all submenus in this tree.
    /// </summary> 
    /// <param name="sender"></param>
    /// <param name="e"></param> 
//    private static void 
    function OnMenuItemPreviewClick(/*object*/ sender, /*RoutedEventArgs*/ e) 
    {
//        var menu = ((MenuBase)sender); 

        /*MenuItem*/var menuItemSource = e.OriginalSource instanceof EnsureMenuItem() ? e.OriginalSource : null;

        if ((menuItemSource != null) && !menuItemSource.StaysOpenOnClick) 
        {
            /*MenuItemRole*/var role = menuItemSource.Role; 

            if (role == MenuItemRole.TopLevelItem || role == MenuItemRole.SubmenuItem)
            { 
            	sender.IsMenuMode = false;
                e.Handled = true;
            }
        } 
    }


    // From all of our children, set the InMenuMode property
    // If turning this property off, recurse to all submenus 
//    internal static void 
    MenuBase.SetSuspendingPopupAnimation = function(/*ItemsControl*/ menu, /*MenuItem*/ ignore, /*bool*/ suspend)
    { 
        // menu can be either a MenuBase or MenuItem 
        if (menu != null)
        { 
            var itemsCount = menu.Items.Count;

            for (var i = 0; i < itemsCount; i++)
            { 
                /*MenuItem*/var mi = menu.ItemContainerGenerator.ContainerFromIndex(i);
                mi = mi instanceof EnsureMenuItem() ? mi : null;

                if (mi != null && mi != ignore && mi.IsSuspendingPopupAnimation != suspend) 
                {
                    mi.IsSuspendingPopupAnimation = suspend; 

                    // If leaving menu mode, clear property on all
                    // submenus of this menu
                    if (!suspend) 
                    {
                    	MenuBase.SetSuspendingPopupAnimation(mi, null, suspend); 
                    } 
                }
            } 
        }
    };
    
    // From all of our children, set the InMenuMode property
    // If turning this property off, recurse to all submenus 
//    internal static void 
    MenuBase.SetSuspendingPopupAnimation = function(/*ItemsControl*/ menu, /*MenuItem*/ ignore, /*bool*/ suspend)
    { 
        // menu can be either a MenuBase or MenuItem 
        if (menu != null)
        { 
            var itemsCount = menu.Items.Count;

            for (var i = 0; i < itemsCount; i++)
            { 
                /*MenuItem*/var mi = menu.ItemContainerGenerator.ContainerFromIndex(i);
                mi = mi  instanceof EnsureMenuItem() ? mi : null;

                if (mi != null && mi != ignore && mi.IsSuspendingPopupAnimation != suspend) 
                {
                    mi.IsSuspendingPopupAnimation = suspend; 

                    // If leaving menu mode, clear property on all
                    // submenus of this menu
                    if (!suspend) 
                    {
                    	MenuBase.SetSuspendingPopupAnimation(mi, null, suspend); 
                    } 
                }
            } 
        }
    };
    
//    static MenuBase()
    function Initialize()
    { 
//        EventManager.RegisterClassHandler(MenuBase.Type, EnsureMenuItem().PreviewClickEvent, new RoutedEventHandler(null, OnMenuItemPreviewClick));
    	//cym comment, put the line to static init of menuItem
    	
        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.MouseDownEvent, new MouseButtonEventHandler(null, OnMouseButtonDown));
        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.MouseUpEvent, new MouseButtonEventHandler(null, OnMouseButtonUp));
        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.LostMouseCaptureEvent, new MouseEventHandler(null, OnLostMouseCapture)); 
        EventManager.RegisterClassHandler(MenuBase.Type, MenuBase.IsSelectedChangedEvent, 
        		new RoutedPropertyChangedEventHandler/*<bool>*/(null, OnIsSelectedChanged));

        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.MouseDownEvent, new MouseButtonEventHandler(null, OnPromotedMouseButton)); 
        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.MouseUpEvent, new MouseButtonEventHandler(null, OnPromotedMouseButton));

        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.PreviewMouseDownOutsideCapturedElementEvent, 
        		new MouseButtonEventHandler(null, OnClickThroughThunk));
        EventManager.RegisterClassHandler(MenuBase.Type, Mouse.PreviewMouseUpOutsideCapturedElementEvent, 
        		new MouseButtonEventHandler(null, OnClickThroughThunk));

        EventManager.RegisterClassHandler(MenuBase.Type, Keyboard.PreviewKeyboardInputProviderAcquireFocusEvent, 
        		new KeyboardInputProviderAcquireFocusEventHandler(null, OnPreviewKeyboardInputProviderAcquireFocus), true); 
        EventManager.RegisterClassHandler(MenuBase.Type, Keyboard.KeyboardInputProviderAcquireFocusEvent, 
        		new KeyboardInputProviderAcquireFocusEventHandler(null, OnKeyboardInputProviderAcquireFocus), true);

        FocusManager.IsFocusScopeProperty.OverrideMetadata(MenuBase.Type, 
        		/*new FrameworkPropertyMetadata(true)*/
        		FrameworkPropertyMetadata.BuildWithDV(true)); 

//        // While the menu is opened, Input Method should be suspended. 
//        // the docusmen focus of Cicero should not be changed but key typing should not be
//        // dispatched to IME/TIP.
//        InputMethod.IsInputMethodSuspendedProperty.OverrideMetadata(MenuBase.Type, 
//        		/*new FrameworkPropertyMetadata(true, FrameworkPropertyMetadataOptions.Inherits)*/
//        		FrameworkPropertyMetadata.Build2(true, FrameworkPropertyMetadataOptions.Inherits));
    } 

	
	MenuBase.Type = new Type("MenuBase", MenuBase, [ItemsControl.Type]);
	Initialize();
	
	return MenuBase;
});
 






