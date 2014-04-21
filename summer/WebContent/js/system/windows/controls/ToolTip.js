/**
 * ToolTip
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentControl"/*, "controls/PopupControlService"*/,
        "windows/SystemColors", "controls/Control"], 
		function(declare, Type, ContentControl, /*PopupControlService,*/
				SystemColors, Control){
	
//	private static DependencyObjectType 
	var _dType = null;
	
	var ToolTip = declare("ToolTip", ContentControl,{
		constructor:function(){
//	        private Popup 
	        this._parentPopup = null;
	        
	        this._dom = document.createElement("div");
		},
		
	      /// <summary>
        ///     Add/Remove event handler for Opened event
        /// </summary> 
        /// <value></value>
//        public event RoutedEventHandler Opened 
//        { 
//            add
//            { 
//                AddHandler(ToolTip.OpenedEvent, value);
//            }
//            remove
//            { 
//                RemoveHandler(ToolTip.OpenedEvent, value);
//            } 
//        } 
		
        AddOpenedHandler:function(value)
        { 
            this.AddHandler(ToolTip.OpenedEvent, value);
        },
        RemoveOpenedHandler:function(value)
        { 
            this.RemoveHandler(ToolTip.OpenedEvent, value);
        }, 

        /// <summary> 
        ///     Called when the Tooltip is opened. Also raises the OpenedEvent.
        /// </summary>
        /// <param name="e">Generic routed event arguments.</param>
//        protected virtual void 
        OnOpened:function(/*RoutedEventArgs*/ e) 
        {
            this.RaiseEvent(e); 
        }, 

        /// <summary> 
        ///     Add/Remove event handler for Closed event 
        /// </summary>
        /// <value></value> 
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
        
        AddClosedHandler:function(value)
        { 
        	this.AddHandler(ToolTip.ClosedEvent, value);
        }, 
        RemoveClosedHandler:function(value) 
        {
        	this.RemoveHandler(ToolTip.ClosedEvent, value); 
        },

        /// <summary> 
        ///     Called when the ToolTip is closed. Also raises the ClosedEvent.
        /// </summary> 
        /// <param name="e">Generic routed event arguments.</param> 
//        protected virtual void 
        OnClosed:function(/*RoutedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        },
 
         /// <summary>
        ///     Change to the correct visual state for the ButtonBase. 
        /// </summary>
        /// <param name="useTransitions">
        ///     true to use transitions when updating the visual state, false to
        ///     snap directly to the new visual state. 
        /// </param>
//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions) 
        { 
            if (this.IsOpen)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateOpen, useTransitions);
            }
            else
            { 
                VisualStateManager.GoToState(this, VisualStates.StateClosed, useTransitions);
            } 
 
            ContentControl.prototype.ChangeVisualState.call(this, useTransitions);
        }, 

        /// <summary>
        /// Called when this element's visual parent changes
        /// </summary> 
        /// <param name="oldParent"></param>
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent) 
        { 
        	ContentControl.prototype.OnVisualParentChanged.call(this, oldParent);
 
            if (!Popup.IsRootedInPopup(this._parentPopup, this))
            {
                throw new InvalidOperationException(SR.Get(SRID.ElementMustBeInPopup, "ToolTip"));
            } 
        },
 
//        internal override void
        OnAncestorChanged:function() 
        {
        	ContentControl.prototype.OnAncestorChanged.call(this); 

            if (!Popup.IsRootedInPopup(this._parentPopup, this))
            {
                throw new InvalidOperationException(SR.Get(SRID.ElementMustBeInPopup, "ToolTip")); 
            }
        }, 

//        protected override void 
        OnContentChanged:function(/*object*/ oldContent, /*object*/ newContent)
        { 
            /*PopupControlService*/var popupControlService = PopupControlService.Current;
 
            // Whenever the tooltip for a control is not an instance of a ToolTip, the framework creates a wrapper 
            // ToolTip instance. Such a ToolTip is tagged ServiceOwned and its Content property is bound to the
            // ToolTipProperty of the Owner element. So while such a ServiceOwned ToolTip is visible if the 
            // ToolTipProperty on the Owner changes to be a real ToolTip instance then it causes a crash
            // complaining that the ServiceOwned ToolTip is wrapping another nested ToolTip. The condition here
            // detects this case and merely dismisses the old ToolTip and displays the new ToolTip instead thus
            // avoiding the use of a wrapper ToolTip. 

            if (this == popupControlService.CurrentToolTip && 
                this.GetValue(PopupControlService.ServiceOwnedProperty) && 
                newContent instanceof ToolTip)
            { 
                popupControlService.OnRaiseToolTipClosingEvent(null, EventArgs.Empty);
                popupControlService.OnRaiseToolTipOpeningEvent(null, EventArgs.Empty);
            }
            else 
            {
            	ContentControl.prototype.OnContentChanged.call(this, oldContent, newContent); 
            } 
        },
 
//        private void 
        HookupParentPopup:function()
        {
//            Debug.Assert(_parentPopup == null, "_parentPopup should be null");
 
            this._parentPopup = new Popup();
 
            this._parentPopup.AllowsTransparency = true; 

            // When StaysOpen is true (default), make the popup window WS_EX_Transparent 
            // to allow mouse input to go through the tooltip
            this._parentPopup.HitTestable = !this.StaysOpen;

            // Coerce HasDropShadow property in case popup can't be transparent 
            this.CoerceValue(ToolTip.HasDropShadowProperty);
 
            // Listening to the Opened and Closed events lets us guarantee that 
            // the popup is actually opened when we perform those functions.
            this._parentPopup.AddOpened(new EventHandler(this, this.OnPopupOpened)); 
            this._parentPopup.AddClosed(new EventHandler(this, this.OnPopupClosed));
            this._parentPopup.PopupCouldClose.Combine(new EventHandler(this, this.OnPopupCouldClose));

            this._parentPopup.SetResourceReference(Popup.PopupAnimationProperty, SystemParameters.ToolTipPopupAnimationKey); 

            // Hooks up the popup properties from this menu to the popup so that 
            // setting them on this control will also set them on the popup. 
            Popup.CreateRootPopup(this._parentPopup, this);
        }, 

//        internal void 
        ForceClose:function()
        {
            if (this._parentPopup != null) 
            {
                this._parentPopup.ForceClose(); 
            } 
        },
 
//        private void 
        OnPopupCouldClose:function(/*object*/ sender, /*EventArgs*/ e)
        {
            this.SetCurrentValueInternal(ToolTip.IsOpenProperty, false);
        }, 

//        private void 
        OnPopupOpened:function(/*object*/ source, /*EventArgs*/ e) 
        { 
            this.OnOpened(new RoutedEventArgs(ToolTip.OpenedEvent, this));
        }, 
 
//        private void 
        OnPopupClosed:function(/*object*/ source, /*EventArgs*/ e)
        { 
        	this.OnClosed(new RoutedEventArgs(ToolTip.ClosedEvent, this));
        }
	});
	
	Object.defineProperties(ToolTip.prototype,{
	    /// <summary> 
        /// Horizontal offset from the default location when this ToolTIp is displayed 
        /// </summary>
//        public double 
		HorizontalOffset:
        {
            get:function() 
            {
                return this.GetValue(ToolTip.HorizontalOffsetProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValue(ToolTip.HorizontalOffsetProperty, value);
            }
        },
        /// <summary>
        /// Vertical offset from the default location when this ToolTip is displayed
        /// </summary>
//        public double 
		VerticalOffset: 
        { 
            get:function()
            { 
                return this.GetValue(ToolTip.VerticalOffsetProperty);
            },
            set:function(value)
            { 
            	this.SetValue(ToolTip.VerticalOffsetProperty, value);
            } 
        },
        
        /// <summary>
        /// Whether or not this ToolTip is visible 
        /// </summary>
//        public bool 
        IsOpen:
        { 
            get:function() { return this.GetValue(ToolTip.IsOpenProperty); },
            set:function(value) { this.SetValue(ToolTip.IsOpenProperty, value); }
        },
        
        /// <summary>
        ///     Whether the control has a drop shadow. 
        /// </summary>
//        public bool 
        HasDropShadow:
        {
            get:function() { return this.GetValue(ToolTip.HasDropShadowProperty); }, 
            set:function(value) { this.SetValue(ToolTip.HasDropShadowProperty, value); }
        },
        
        /// <summary>
        /// The UIElement relative to which this ToolTip will be displayed. 
        /// </summary> 
//        public UIElement 
        PlacementTarget:
        {
            get:function() { return this.GetValue(ToolTip.PlacementTargetProperty); },
            set:function(value) { this.SetValue(ToolTip.PlacementTargetProperty, value); } 
        },
        /// <summary>
        /// Get or set PlacementRectangle property of the ToolTip
        /// </summary> 
//        public Rect 
        PlacementRectangle: 
        { 
            get:function() { return this.GetValue(ToolTip.PlacementRectangleProperty); },
            set:function(value) { this.SetValue(ToolTip.PlacementRectangleProperty, value); } 
        },
 
        /// <summary>
        ///     Chooses the behavior of where the Popup should be placed on screen. 
        /// </summary>
//        public PlacementMode 
        Placement:
        { 
            get:function() { return this.GetValue(ToolTip.PlacementProperty); },
            set:function(value) { this.SetValue(ToolTip.PlacementProperty, value); } 
        }, 
 
        /// <summary>
        ///     Chooses the behavior of where the Popup should be placed on screen. 
        /// </summary>
//        public CustomPopupPlacementCallback 
        CustomPopupPlacementCallback:
        { 
            get:function() { return this.GetValue(ToolTip.CustomPopupPlacementCallbackProperty); },
            set:function(value) { this.SetValue(ToolTip.CustomPopupPlacementCallbackProperty, value); } 
        }, 

        /// <summary> 
        ///     Chooses the behavior of when the Popup should automatically close.
        /// </summary>
//        public bool 
        StaysOpen: 
        {
            get:function() { return this.GetValue(ToolTip.StaysOpenProperty); }, 
            set:function(value) { this.SetValue(ToolTip.StaysOpenProperty, value); } 
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        {
            get:function() { return _dType; } 
        }

        
	});
	
	Object.defineProperties(ToolTip,{
	    /// <summary>
        /// The DependencyProperty for the HorizontalOffset property.
        /// Default: Length(0.0)
        /// </summary> 
//        public static readonly DependencyProperty 
		HorizontalOffsetProperty:
        {
        	get:function(){
        		if(ToolTip._HorizontalOffsetProperty === undefined){
        			ToolTip._HorizontalOffsetProperty =
        	            ToolTipService.HorizontalOffsetProperty.AddOwner(ToolTip.Type, 
                                /*new FrameworkPropertyMetadata(null, 
                                                              new CoerceValueCallback(null, CoerceHorizontalOffset))*/
        	            		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null, 
                                        new CoerceValueCallback(null, CoerceHorizontalOffset)));
        		}
        		
        		return ToolTip._HorizontalOffsetProperty;
        	}
        },  
        
        /// <summary>
        /// The DependencyProperty for the VerticalOffset property. 
        /// Default: Length(0.0) 
        /// </summary>
//        public static readonly DependencyProperty 
		VerticalOffsetProperty:
        {
        	get:function(){
        		if(ToolTip._VerticalOffsetProperty === undefined){
        			ToolTip._VerticalOffsetProperty = 
        	            ToolTipService.VerticalOffsetProperty.AddOwner(ToolTip.Type,
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(null, CoerceVerticalOffset))*/
        	            		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                        new CoerceValueCallback(null, CoerceVerticalOffset)));
        		}
        		
        		return ToolTip._VerticalOffsetProperty;
        	}
        }, 
        
        /// <summary> 
        /// DependencyProperty for the IsOpen property
        /// Default value: false
        /// </summary>
//        public static readonly DependencyProperty 
		IsOpenProperty:
        {
        	get:function(){
        		if(ToolTip._IsOpenProperty === undefined){
        			ToolTip._IsOpenProperty = 
                    DependencyProperty.Register(
                                "IsOpen", 
                                Boolean.Type, 
                                ToolTip.Type,
                                /*new FrameworkPropertyMetadata( 
                                            false,
                                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                            new PropertyChangedCallback(null, OnIsOpenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(false,
                                            FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                            new PropertyChangedCallback(null, OnIsOpenChanged)));
        		}
        		
        		return ToolTip._IsOpenProperty;
        	}
        }, 
        
        /// <summary>
        ///     The DependencyProperty for HasDropShadow 
        /// </summary> 
//        public static readonly DependencyProperty 
		HasDropShadowProperty:
        {
        	get:function(){
        		if(ToolTip._HasDropShadowProperty === undefined){
        			ToolTip._HasDropShadowProperty =
                        ToolTipService.HasDropShadowProperty.AddOwner( 
                                ToolTip.Type,
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(null, CoerceHasDropShadow))*/
                                FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                        new CoerceValueCallback(null, CoerceHasDropShadow)));
        		}
        		
        		return ToolTip._HasDropShadowProperty;
        	}
        },
 
        /// <summary> 
        ///     The DependencyProperty for the PlacementRectangle property.
        /// </summary> 
//        public static readonly DependencyProperty 
		PlacementRectangleProperty:
        {
        	get:function(){
        		if(ToolTip._PlacementRectangleProperty === undefined){
        			ToolTip._PlacementRectangleProperty =
                        ToolTipService.PlacementRectangleProperty.AddOwner(ToolTip.Type,
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(null, CoercePlacementRectangle))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                        new CoerceValueCallback(null, CoercePlacementRectangle))); 
        		}
        		
        		return ToolTip._PlacementRectangleProperty;
        	}
        }, 
        /// <summary>
        /// The DependencyProperty for the Placement property 
        /// Default value: null
        /// </summary> 
//        public static readonly DependencyProperty 
		PlacementProperty:
        {
        	get:function(){
        		if(ToolTip._PlacementProperty === undefined){
        			ToolTip._PlacementProperty = 
                        ToolTipService.PlacementProperty.AddOwner(ToolTip.Type,
                                /*new FrameworkPropertyMetadata(null, 
                                                              new CoerceValueCallback(null, CoercePlacement))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null, 
                                        new CoerceValueCallback(null, CoercePlacement)));
        		}
        		
        		return ToolTip._PlacementProperty;
        	}
        }, 
        
        /// <summary>
        /// The DependencyProperty for the PlacementTarget property 
        /// Default value: null
        /// </summary>
//        public static readonly DependencyProperty 
		PlacementTargetProperty:
        {
        	get:function(){
        		if(ToolTip._PlacementTargetProperty === undefined){
        			ToolTip._PlacementTargetProperty =
                        ToolTipService.PlacementTargetProperty.AddOwner(ToolTip.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                                              new CoerceValueCallback(null, CoercePlacementTarget))*/
                        		FrameworkPropertyMetadata.BuildWithPCCBandCVCB(null,
                                        new CoerceValueCallback(null, CoercePlacementTarget)));
        		}
        		
        		return ToolTip._PlacementTargetProperty;
        	}
        },  

        /// <summary> 
        ///     The DependencyProperty for the CustomPopupPlacementCallback property.
        ///     Flags:              None
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
		CustomPopupPlacementCallbackProperty:
        {
        	get:function(){
        		if(ToolTip._CustomPopupPlacementCallbackProperty === undefined){
        			ToolTip._CustomPopupPlacementCallbackProperty =
                        Popup.CustomPopupPlacementCallbackProperty.AddOwner(ToolTip.Type); 
        		}
        		
        		return ToolTip._CustomPopupPlacementCallbackProperty;
        	}
        }, 

        /// <summary> 
        ///     The DependencyProperty for the StaysOpen property.
        ///     When false, the tool tip will close on the next mouse click
        ///     Flags:              None
        ///     Default Value:      true 
        /// </summary>
//        public static readonly DependencyProperty 
		StaysOpenProperty:
        {
        	get:function(){
        		if(ToolTip._StaysOpenProperty === undefined){
        			ToolTip._StaysOpenProperty = 
                        Popup.StaysOpenProperty.AddOwner(ToolTip.Type); 
        		}
        		
        		return ToolTip._StaysOpenProperty;
        	}
        }, 
 
        /// <summary>
        ///     Opened event 
        /// </summary> 
//        public static readonly RoutedEvent 
		OpenedEvent:
        {
        	get:function(){
        		if(ToolTip._OpenedEvent === undefined){
        			ToolTip._OpenedEvent =
        	            EventManager.RegisterRoutedEvent("Opened", RoutingStrategy.Bubble, RoutedEventHandler.Type, ToolTip.Type); 
        		}
        		
        		return ToolTip._OpenedEvent;
        	}
        },
        
        /// <summary> 
        ///     Closed event
        /// </summary>
//        public static readonly RoutedEvent 
		ClosedEvent:
        {
        	get:function(){
        		if(ToolTip._ClosedEvent === undefined){
        			ToolTip._ClosedEvent  =
        	            EventManager.RegisterRoutedEvent("Closed", RoutingStrategy.Bubble, RoutedEventHandler.Type, ToolTip.Type); 
        		}
        		
        		return ToolTip._ClosedEvent;
        	}
        }

	});
	

    
//    private static object 
	function CoerceHorizontalOffset(/*DependencyObject*/ d, /*object*/ value)
    {
        return PopupControlService.CoerceProperty(d, value, ToolTipService.HorizontalOffsetProperty);
    } 

//    private static object 
	function CoerceVerticalOffset(/*DependencyObject*/ d, /*object*/ value)
    { 
        return PopupControlService.CoerceProperty(d, value, ToolTipService.VerticalOffsetProperty); 
    }

//    private static void 
	function OnIsOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//                ToolTip tt = (ToolTip)d;  

        if (e.NewValue) 
        {
            if (d._parentPopup == null)
            {
                d.HookupParentPopup(); 
            }
        } 
//        else 
//        {
//            // When ToolTip is about to close but still hooked up - we need to raise Accessibility event 
//            if (AutomationPeer.ListenerExists(AutomationEvents.ToolTipClosed))
//            {
//                AutomationPeer peer = UIElementAutomationPeer.CreatePeerForElement(t);
//                if (peer != null) 
//                    peer.RaiseAutomationEvent(AutomationEvents.ToolTipClosed);
//            } 
//        } 

        Control.OnVisualStatePropertyChanged(d, e); 
    }

//    private static object 
	function CoerceHasDropShadow(/*DependencyObject*/ d, /*object*/ value)
    { 
//        ToolTip tt = (ToolTip)d; 

        if (d._parentPopup == null || !d._parentPopup.AllowsTransparency || !SystemParameters.DropShadow) 
        {
            return false;
        }

        return PopupControlService.CoerceProperty(d, value, ToolTipService.HasDropShadowProperty);
    } 

//    private static object 
	function CoercePlacementTarget(/*DependencyObject*/ d, /*object*/ value)
    { 
        return PopupControlService.CoerceProperty(d, value, ToolTipService.PlacementTargetProperty);
    }

//    private static object 
	function CoercePlacementRectangle(/*DependencyObject*/ d, /*object*/ value) 
    { 
        return PopupControlService.CoerceProperty(d, value, ToolTipService.PlacementRectangleProperty);
    } 

//    private static object 
	function CoercePlacement(/*DependencyObject*/ d, /*object*/ value)
    { 
        return PopupControlService.CoerceProperty(d, value, ToolTipService.PlacementProperty);
    } 
	
//  static ToolTip() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ToolTip.Type, 
        		/*new FrameworkPropertyMetadata(ToolTip.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(ToolTip.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(ToolTip.Type);
        Control.BackgroundProperty.OverrideMetadata(ToolTip.Type, 
        		/*new FrameworkPropertyMetadata(SystemColors.InfoBrush)*/
        		FrameworkPropertyMetadata.BuildWithDV(SystemColors.InfoBrush)); 
        UIElement.FocusableProperty.OverrideMetadata(ToolTip.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
    }
	
	ToolTip.Type = new Type("ToolTip", ToolTip, [ContentControl.Type]);
	Initialize();
	
	return ToolTip;
});

