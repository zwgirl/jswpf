/**
 * ContextMenu
 */

define(["dojo/_base/declare", "system/Type", "primitives/MenuBase", "input/AccessKeyManager"
        ], 
        function(declare, Type, MenuBase, AccessKeyManager){
//    private static DependencyObjectType 
	var _dType;
	var ContextMenu = declare("ContextMenu", MenuBase,{
		
		constructor:function(){
            Initialize2(); 
		},
		
//      private void 
        Initialize2:function()
        { 
            // We have to set this locally in order for inheritance to work 
            MenuItem.SetInsideContextMenuProperty(this, true);
 
            this.InternalMenuModeChanged.Combine(new EventHandler(this, this.OnIsMenuModeChanged));
            
//            private Popup 
            this._parentPopup = null;
//            private WeakReference<IInputElement> 
            this._weakRefToPreviousFocus = null; // Keep the previously focused element before CM to open 
        },
 
//        /// <summary>
//        ///     Event that fires when the popup opens. 
//        /// </summary>
//        public event RoutedEventHandler Opened
//        {

//        }
        AddOpened:function(value) 
        {
        	this.AddHandler(ContextMenu.OpenedEvent, value); 
        }, 
        RemoveOpened:function(value)
        { 
        	this.RemoveHandler(ContextMenu.OpenedEvent, value);
        },
 
        /// <summary>
        ///     Called when the OpenedEvent fires. 
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
        OnOpened:function(/*RoutedEventArgs*/ e) 
        {
            this.RaiseEvent(e);
        },
        
        /// <summary>
        ///     Event that fires when the popup closes
        /// </summary>
//        public event RoutedEventHandler Closed 
//        {
//
//        }
        AddClosed:function(value) 
        { 
            this.AddHandler(ContextMenu.ClosedEvent, value);
        }, 
        RemoveClosed:function(value)
        {
        	this.RemoveHandler(ContextMenu.ClosedEvent, value);
        }, 
        /// <summary> 
        ///     Called when the ClosedEvent fires.
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
        OnClosed:function(/*RoutedEventArgs*/ e)
        {
        	this.RaiseEvent(e); 
        },
 
        /// <summary>
        /// Prepare the element to display the item.  This may involve 
        /// applying styles, setting bindings, etc.
        /// </summary>
//        protected override void 
        PrepareContainerForItemOverride:function(/*DependencyObject*/ element, /*object*/ item)
        { 
        	MenuBase.prototype.PrepareContainerForItemOverride.call(this, element, item);
 
            MenuItem.PrepareMenuItem(element, item); 
        },
 
        /// <summary>
        ///     This is the method that responds to the KeyDown event.
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
        	MenuBase.prototype.OnKeyDown.call(this, e); 
            if (e.Handled || !IsOpen)
            { 
                // Ignore if the event was already handled or if the menu closed. This might happen
                // if input events get queued up and one in the middle caused the menu to close.
                return;
            } 

            /*Key*/var key = e.Key; 
 
            switch (key)
            { 
                case Key.Down:
                    if (CurrentSelection == null)
                    {
                        NavigateToStart(new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                        e.Handled = true;
                    } 
 
                    break;
 
                case Key.Up:
                    if (CurrentSelection == null)
                    {
                        NavigateToEnd(new ItemNavigateArgs(e.Device, Keyboard.Modifiers)); 
                        e.Handled = true;
                    } 
 
                    break;
            } 
        },

        /// <summary>
        ///     This is the method that responds to the KeyUp event. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnKeyUp:function(/*KeyEventArgs*/ e) 
        {
        	MenuBase.prototype.OnKeyUp.call(this, e); 
            if (!e.Handled && IsOpen && e.Key == Key.Apps)
            {
            	this.KeyboardLeaveMenuMode();
                    e.Handled = true; 
            }
        }, 

//        private void 
        HookupParentPopup:function() 
        {
//            Debug.Assert(_parentPopup == null, "_parentPopup should be null"); 
 
        	this._parentPopup = new Popup();
 
        	this._parentPopup.AllowsTransparency = true;

            // Coerce HasDropShadow property in case popup can't be transparent
            CoerceValue(HasDropShadowProperty); 

            this._parentPopup.DropOpposite = false; 
 
            // Listening to the Opened and Closed events lets us guarantee that
            // the popup is actually opened when we perform those functions. 
            this._parentPopup.AddOpened(new EventHandler(this, this.OnPopupOpened));
            this._parentPopup.AddClosed(new EventHandler(this, this.OnPopupClosed));
            this._parentPopup.PopupCouldClose.Combine(new EventHandler(this, this.OnPopupCouldClose));
 
            this._parentPopup.SetResourceReference(Popup.PopupAnimationProperty, SystemParameters.MenuPopupAnimationKey);
 
            // Hooks up the popup properties from this menu to the popup so that 
            // setting them on this control will also set them on the popup.
            Popup.CreateRootPopup(this._parentPopup, this); 
        },

//        private void 
        OnPopupCouldClose:function(/*object*/ sender, /*EventArgs*/ e)
        { 
        	this.SetCurrentValueInternal(ContextMenu.IsOpenProperty, false);
        },
 
//        private void 
        OnPopupOpened:function(/*object*/ source, /*EventArgs*/ e)
        { 
            if (this.CurrentSelection != null)
            {
            	this.CurrentSelection = null;
            } 
            this.IsMenuMode = true;
 
            // When we open, if the Left or Right buttons are pressed, MenuBase should not 
            // dismiss when it sees the up for those buttons.
            if (Mouse.LeftButton == MouseButtonState.Pressed) 
            {
            	this.IgnoreNextLeftRelease = true;
            }
            if (Mouse.RightButton == MouseButtonState.Pressed) 
            {
            	this.IgnoreNextRightRelease = true; 
            } 

            this.OnOpened(new RoutedEventArgs(OpenedEvent, this)); 
        },

//        private void 
        OnPopupClosed:function(/*object*/ source, /*EventArgs*/ e)
        { 
            // Clear out any state we stored for this time around
        	this.IgnoreNextLeftRelease = false; 
        	this.IgnoreNextRightRelease = false; 

            this.IsMenuMode = false; 
            this.OnClosed(new RoutedEventArgs(ClosedEvent, this));
        },

//        private void 
        ClosingMenu:function() 
        {
            if (this._parentPopup != null) 
            { 
            	this._parentPopup.Unloaded.Remove(new RoutedEventHandler(this, this.OnPopupUnloaded));
 
                // As the menu closes, we need the parent connection to be maintained
                // while we do things like release capture so that notifications
                // go up the tree correctly. Post this for later.
                Dispatcher.BeginInvoke(DispatcherPriority.Normal, 
                   /* (DispatcherOperationCallback)*//*delegate*/function(/*object*/ arg)
                    { 
                        /*ContextMenu*/var cm = arg; 
                        if (!cm.IsOpen) // Check that the menu is still closed
                        { 
                            // Prevent focus scoping from remembering the last focused element.
                            // The next time the menu opens, we want to start clean.
                            FocusManager.SetFocusedElement(cm, null);
                        } 
                        return null;
                    }, 
                    this); 
            }
        },

//        private void 
        OnPopupUnloaded:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            // The tree that the ContextMenu is in is being torn down, close the menu. 

            if (this.IsOpen) 
            { 
                // This will be called during a tree walk, closing the menu will cause a tree change,
                // so post for later. 
                Dispatcher.BeginInvoke(DispatcherPriority.Send,
                    /*(DispatcherOperationCallback)delegate*/function(/*object*/ arg)
                    {
                        /*ContextMenu*/var cm = arg; 
                        if (cm.IsOpen) // Check that the menu is still open
                        { 
                            cm.SetCurrentValueInternal(ContextMenu.IsOpenProperty, false); 
                        }
                        return null; 
                    },
                    this);
            }
        },

        /// <summary> 
        ///     Called when IsMenuMode changes on this class 
        /// </summary>
//        private void 
        OnIsMenuModeChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            // IsMenuMode changed from false to true
            if (this.IsMenuMode)
            { 
                // Keep the previous focus
                if (Keyboard.FocusedElement != null) 
                { 
//                    this._weakRefToPreviousFocus = new WeakReference/*<IInputElement>*/(Keyboard.FocusedElement);
                	this._weakRefToPreviousFocus = Keyboard.FocusedElement;
                } 

                // Take focus so we get keyboard events.
                this.Focus();
            } 
            else // IsMenuMode changed from true to false
            { 
            	this.SetCurrentValueInternal(IsOpenProperty, false); 

                if(this._weakRefToPreviousFocus != null) 
                {
                    /*IInputElement*/var previousFocus = this._weakRefToPreviousFocus;
//                    if (this._weakRefToPreviousFocus.TryGetTarget(previousFocusOut/*out previousFocus*/))
//                    { 
                        // Previous focused element is still alive, so return focus to it.
                        previousFocus.Focus(); 
//                    } 

                    this._weakRefToPreviousFocus = null; 
                }
            }
        },
 
//        protected override void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            // If keyboard focus moves out from within the ContextMenu, the 
            // ContextMenu will be dismissed.  We do not want to restore focus
            // in this case. 
            //
            // See MenuBase.OnIsKeyboardFocusWithinChanged
            if(e.NewValue == false)
            { 
            	this._weakRefToPreviousFocus = null;
            } 
 
            // Allow the base class to dismiss us as needed.
            base.OnIsKeyboardFocusWithinChanged(e); 
        },

//        internal override bool 
        IgnoreModelParentBuildRoute:function(/*RoutedEventArgs*/ e)
        { 
            // Context menus are logically connected to their host element.  Generally, we don't
            // want input events to route out of the context menu.  Consider the sitituation where 
            // a TextBox has a ContextMenu.  It is confusing for the text box to move the cursor 
            // when I press the arrow keys while the context menu is being displayed.
            // 
            // For now we only block keyboard events and ToolTip events.  What about mouse & stylus events?
            //
            // Note: This will cause the route to not follow the logical link, but it will still
            // follow the visual link.  At the time of writing this comment, the visual link 
            // contained things like an adorner decorator.  Eventually the visual ancestory lead
            // to a PopupRoot, which also has a logical link over to the Popup element.  Since 
            // the PopupRoot does not override this virtual, the route continues through its logical 
            // link and ends up escaping into the larger logical tree anyways.
            // 
            // The solution is that the PopupRoot element (on the top of this visual tree) will
            // defer back to this method to determine if it should route any further.
            //
            return (e instanceof KeyEventArgs) || (e instanceof FindToolTipEventArgs); 
        },
 
        /// <summary> 
        /// Called when this element's visual parent changes
        /// </summary> 
        /// <param name="oldParent"></param> 
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent)
        { 
            base.OnVisualParentChanged(oldParent);

            if (!Popup.IsRootedInPopup(_parentPopup, this))
            { 
                throw new InvalidOperationException(SR.Get(SRID.ElementMustBeInPopup, "ContextMenu"));
            } 
        }, 

//        internal override void 
        OnAncestorChanged:function() 
        {
            base.OnAncestorChanged();

            if (!Popup.IsRootedInPopup(this._parentPopup, this)) 
            {
                throw new InvalidOperationException(SR.Get(SRID.ElementMustBeInPopup, "ContextMenu")); 
            } 
        }
	});
	
	Object.defineProperties(ContextMenu.prototype,{
        /// <summary> 
        /// Get or set X offset of the ContextMenu
        /// </summary> 
//        public double 
        HorizontalOffset:
        { 
            get:function() { return this.GetValue(ContextMenu.HorizontalOffsetProperty); },
            set:function(value) { this.SetValue(ContextMenu.HorizontalOffsetProperty, value); } 
        },

        /// <summary> 
        /// Get or set Y offset of the ContextMenu
        /// </summary> 
//        public double 
        VerticalOffset: 
        {
            get:function() { return this.GetValue(ContextMenu.VerticalOffsetProperty); },
            set:function(value) { this.SetValue(ContextMenu.VerticalOffsetProperty, value); }
        }, 

        /// <summary>
        /// Get or set IsOpen property of the ContextMenu 
        /// </summary>
//        public bool 
        IsOpen: 
        {
            get:function() { return this.GetValue(ContextMenu.IsOpenProperty); },
            set:function(value) { this.SetValue(ContextMenu.IsOpenProperty, value); } 
        },
 
        /// <summary>
        /// Get or set PlacementTarget property of the ContextMenu
        /// </summary>
//        public UIElement 
        PlacementTarget: 
        { 
            get:function() { return this.GetValue(ContextMenu.PlacementTargetProperty); },
            set:function(value) { this.SetValue(ContextMenu.PlacementTargetProperty, value); } 
        },

        /// <summary> 
        /// Get or set PlacementRectangle property of the ContextMenu
        /// </summary> 
//        public Rect 
        PlacementRectangle:
        {
            get:function() { return this.GetValue(ContextMenu.PlacementRectangleProperty); },
            set:function(value) { this.SetValue(ContextMenu.PlacementRectangleProperty, value); }
        },
 
        /// <summary>
        /// Get or set Placement property of the ContextMenu 
        /// </summary>
//        public PlacementMode 
        Placement: 
        {
            get:function() { return this.GetValue(ContextMenu.PlacementProperty); },
            set:function(value) { this.SetValue(ContextMenu.PlacementProperty, value); }
        },

        /// <summary> 
        ///     Whether the control has a drop shadow.
        /// </summary> 
//        public bool 
        HasDropShadow:
        {
            get:function() { return this.GetValue(ContextMenu.HasDropShadowProperty); },
            set:function(value) { this.SetValue(ContextMenu.HasDropShadowProperty, value); } 
        },
 
        /// <summary> 
        ///     Chooses the behavior of where the ContextMenu should be placed on screen. 
        /// </summary>
//        public CustomPopupPlacementCallback 
        CustomPopupPlacementCallback:
        {
            get:function() { return this.GetValue(ContextMenu.CustomPopupPlacementCallbackProperty); },
            set:function(value) { this.SetValue(ContextMenu.CustomPopupPlacementCallbackProperty, value); } 
        },
 
        /// <summary> 
        ///     Chooses the behavior of when the ContextMenu should automatically close.
        /// </summary> 
//        public bool 
        StaysOpen:
        {
            get:function() { return this.GetValue(ContextMenu.StaysOpenProperty); },
            set:function(value) { this.SetValue(ContextMenu.StaysOpenProperty, value); }
        }, 
 
//        /// <summary>
//        ///     Event that fires when the popup opens. 
//        /// </summary>
//        public event RoutedEventHandler Opened
//        {
//            add 
//            {
//                AddHandler(OpenedEvent, value); 
//            } 
//            remove
//            { 
//                RemoveHandler(OpenedEvent, value);
//            }
//        }
 
//        /// <summary>
//        ///     Event that fires when the popup closes
//        /// </summary>
//        public event RoutedEventHandler Closed 
//        {
//            add 
//            { 
//                AddHandler(ClosedEvent, value);
//            } 
//            remove
//            {
//                RemoveHandler(ClosedEvent, value);
//            } 
//        }
 
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
	

	Object.defineProperties(ContextMenu,{

        /// <summary>
        ///     The DependencyProperty for the HorizontalOffset property. 
        /// </summary>
//        public static readonly DependencyProperty 
        HorizontalOffsetProperty:
        {
        	get:function(){
        		if(ContextMenu._HorizontalOffsetProperty === undefined){
        			ContextMenu._HorizontalOffsetProperty = 
                        ContextMenuService.HorizontalOffsetProperty.AddOwner(ContextMenu.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(CoerceHorizontalOffset))*/
                        		InsideContextMenuProperty.BuildWithPCCBandCVCB(null,
                                        new CoerceValueCallback(null, CoerceHorizontalOffset)));
        		}
        		
        		return ContextMenu._HorizontalOffsetProperty;
        	}
        },

        /// <summary> 
        ///     The DependencyProperty for the VerticalOffset property.
        /// </summary>
//        public static readonly DependencyProperty 
        VerticalOffsetProperty:
        {
        	get:function(){
        		if(ContextMenu._VerticalOffsetProperty === undefined){
        			ContextMenu._VerticalOffsetProperty  =
                        ContextMenuService.VerticalOffsetProperty.AddOwner(ContextMenu.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(CoerceVerticalOffset))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                        new CoerceValueCallback(null, CoerceVerticalOffset))); 
        		}
        		
        		return ContextMenu._VerticalOffsetProperty;
        	}
        },

        /// <summary> 
        /// DependencyProperty for IsOpen property 
        /// </summary>
//        public static readonly DependencyProperty 
        IsOpenProperty:
        {
        	get:function(){
        		if(ContextMenu._IsOpenProperty === undefined){
        			ContextMenu._IsOpenProperty = 
                        Popup.IsOpenProperty.AddOwner(
                        		ContextMenu.Type,
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsOpenChanged))*/
                        		FrameworkPropertyMetadata.Build3PCCB(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, OnIsOpenChanged))); 
        		}
        		
        		return ContextMenu._IsOpenProperty;
        	}
        },
        /// <summary>
        ///     The DependencyProperty for the PlacementTarget property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        PlacementTargetProperty:
        {
        	get:function(){
        		if(ContextMenu._PlacementTargetProperty === undefined){
        			ContextMenu._PlacementTargetProperty =
                        ContextMenuService.PlacementTargetProperty.AddOwner( 
                        		ContextMenu.Type,
                                    /*new FrameworkPropertyMetadata(null,
                                                                  new CoerceValueCallback(CoercePlacementTarget))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                                                  new CoerceValueCallback(null, CoercePlacementTarget)));
        		}
        		
        		return ContextMenu._PlacementTargetProperty;
        	}
        }, 
        /// <summary>
        ///     The DependencyProperty for the PlacementRectangle property. 
        /// </summary>
//        public static readonly DependencyProperty 
        PlacementRectangleProperty:
        {
        	get:function(){
        		if(ContextMenu._PlacementRectangleProperty === undefined){
        			ContextMenu._PlacementRectangleProperty = 
                        ContextMenuService.PlacementRectangleProperty.AddOwner(ContextMenu.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(CoercePlacementRectangle))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                                              new CoerceValueCallback(null, CoercePlacementRectangle)));
        		}
        		
        		return ContextMenu._PlacementRectangleProperty;
        	}
        },  

        /// <summary>
        ///     The DependencyProperty for the Placement property. 
        /// </summary>
//        public static readonly DependencyProperty 
        PlacementProperty:
        {
        	get:function(){
        		if(ContextMenu._PlacementProperty === undefined){
        			ContextMenu._PlacementProperty =
                        ContextMenuService.PlacementProperty.AddOwner(ContextMenu.Type,
                                /*new FrameworkPropertyMetadata(null, 
                                                              new CoerceValueCallback(CoercePlacement))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null, 
                                                              new CoerceValueCallback(null, CoercePlacement)));
        		}
        		
        		return ContextMenu._PlacementProperty;
        	}
        }, 
 
        /// <summary> 
        ///     The DependencyProperty for HasDropShadow
        /// </summary> 
//        public static readonly DependencyProperty 
        HasDropShadowProperty:
        {
        	get:function(){
        		if(ContextMenu._HasDropShadowProperty === undefined){
        			ContextMenu._HasDropShadowProperty = 
                        ContextMenuService.HasDropShadowProperty.AddOwner(
                        		ContextMenu.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(CoerceHasDropShadow))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                                              new CoerceValueCallback(null, CoerceHasDropShadow)));
        		}
        		
        		return ContextMenu._HasDropShadowProperty;
        	}
        },

        ///     The DependencyProperty for the CustomPopupPlacementCallback property.
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        CustomPopupPlacementCallbackProperty:
        {
        	get:function(){
        		if(ContextMenu._CustomPopupPlacementCallbackProperty === undefined){
        			ContextMenu._CustomPopupPlacementCallbackProperty =
                        Popup.CustomPopupPlacementCallbackProperty.AddOwner(ContextMenu.Type); 
        		}
        		
        		return ContextMenu._CustomPopupPlacementCallbackProperty;
        	}
        },

        /// <summary> 
        ///     The DependencyProperty for the StaysOpen property.
        ///     Indicates that, once opened, ContextMenu should stay open until IsOpenProperty changed to 'false'. 
        ///     Flags:              None
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty 
        StaysOpenProperty:
        {
        	get:function(){
        		if(ContextMenu._StaysOpenProperty === undefined){
        			ContextMenu._StaysOpenProperty = 
                        Popup.StaysOpenProperty.AddOwner(ContextMenu.Type);
        		}
        		
        		return ContextMenu._StaysOpenProperty;
        	}
        },
 
        /// <summary>
        ///     Opened event 
        /// </summary>
//        public static readonly RoutedEvent 
        OpenedEvent:
        {
        	get:function(){
        		if(ContextMenu._OpenedEvent === undefined){
        			ContextMenu._OpenedEvent = PopupControlService.ContextMenuOpenedEvent.AddOwner(ContextMenu.Type); 
        		}
        		
        		return ContextMenu._OpenedEvent;
        	}
        }, 
 
        /// <summary>
        ///     Closed event 
        /// </summary> 
//        public static readonly RoutedEvent 
        ClosedEvent:
        {
        	get:function(){
        		if(ContextMenu._ClosedEvent === undefined){
        			ContextMenu._ClosedEvent = PopupControlService.ContextMenuClosedEvent.AddOwner(ContextMenu.Type);
        		}
        		
        		return ContextMenu._ClosedEvent;
        	}
        }, 
 

//        private static readonly DependencyProperty 
        InsideContextMenuProperty:
        {
        	get:function(){
        		if(ContextMenu._InsideContextMenuProperty === undefined){
        			ContextMenu._InsideContextMenuProperty =
        	            MenuItem.InsideContextMenuProperty.AddOwner(ContextMenu.Type, 
                        new FrameworkPropertyMetadata(true,
                                                      FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return ContextMenu._InsideContextMenuProperty;
        	}
        }, 
	});

//    private static object 
    function CoerceHorizontalOffset(/*DependencyObject*/ d, /*object*/ value)
    {
        return PopupControlService.CoerceProperty(d, value, ContextMenuService.HorizontalOffsetProperty); 
    }

//    private static object 
    function CoerceVerticalOffset(/*DependencyObject*/ d, /*object*/ value)
    { 
        return PopupControlService.CoerceProperty(d, value, ContextMenuService.VerticalOffsetProperty);
    }

//    private static void 
    function OnIsOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*ContextMenu*/var ctrl =  d;

        if ( e.NewValue)
        { 
            if (ctrl._parentPopup == null) 
            {
                ctrl.HookupParentPopup(); 
            }

            ctrl._parentPopup.Unloaded += new RoutedEventHandler(ctrl.OnPopupUnloaded);

            // Turn on keyboard cues in case ContextMenu was opened with the keyboard
            ctrl.SetValue(KeyboardNavigation.ShowKeyboardCuesProperty, KeyboardNavigation.IsKeyboardMostRecentInputDevice()); 
        } 
        else
        { 
            ctrl.ClosingMenu();
        }
    }

//    private static object 
    function CoercePlacementTarget(/*DependencyObject*/ d, /*object*/ value)
    { 
        return PopupControlService.CoerceProperty(d, value, ContextMenuService.PlacementTargetProperty); 
    }

//    private static object 
    function CoercePlacementRectangle(/*DependencyObject*/ d, /*object*/ value)
    {
        return PopupControlService.CoerceProperty(d, value, ContextMenuService.PlacementRectangleProperty); 
    }

//    private static object 
    function CoercePlacement(/*DependencyObject*/ d, /*object*/ value) 
    {
        return PopupControlService.CoerceProperty(d, value, ContextMenuService.PlacementProperty); 
    }

//    private static object 
    function CoerceHasDropShadow(/*DependencyObject*/ d, /*object*/ value) 
    {
        /*ContextMenu*/var cm = /*(ContextMenu)*/d; 

        if (cm._parentPopup == null || !cm._parentPopup.AllowsTransparency || !SystemParameters.DropShadow)
        { 
            return false;
        }

        return PopupControlService.CoerceProperty(d, value, ContextMenuService.HasDropShadowProperty); 
    }


//    private static void 
    function OnAccessKeyPressed(/*object*/ sender, /*AccessKeyPressedEventArgs*/ e) 
    {
        e.Scope = sender; 
        e.Handled = true;
    }
//    static ContextMenu()
    function Initialize()
    { 

        EventManager.RegisterClassHandler(ContextMenu.Type, AccessKeyManager.AccessKeyPressedEvent, 
        		new AccessKeyPressedEventHandler(null, OnAccessKeyPressed));

        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ContextMenu.Type, 
        		/*new FrameworkPropertyMetadata(ContextMenu.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(ContextMenu.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(ContextMenu.Type);

        KeyboardNavigation.IsTabStopProperty.OverrideMetadata(ContextMenu.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false)); 
        
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(ContextMenu.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Cycle));
        
        KeyboardNavigation.ControlTabNavigationProperty.OverrideMetadata(ContextMenu.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Contained)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Contained)); 
        
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(ContextMenu.Type, 
        		/*new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle)*/
        		FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Cycle));

        // Disable the default focus visual for ContextMenu
        FrameworkElement.FocusVisualStyleProperty.OverrideMetadata(ContextMenu.Type, 
        		/*new FrameworkPropertyMetadata((object)null  default value )*/
        		FrameworkPropertyMetadata.BuildWithDV(null)); 
    }
	
	ContextMenu.Type = new Type("ContextMenu", ContextMenu, [MenuBase.Type]);
	Initialize();
	
	return ContextMenu;
});
