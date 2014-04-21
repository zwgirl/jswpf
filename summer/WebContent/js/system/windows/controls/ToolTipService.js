/**
 * ToolTipService
 */

define(["dojo/_base/declare", "system/Type", "primitives/PlacementMode", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata", "windows/ValidateValueCallback", "windows/EventManager",
        "controls/FindToolTipEventHandler", "windows/UIElement", "windows/ContentElement",
        "windows/SystemParameters", "controls/ToolTipEventHandler"], 
		function(declare, Type, PlacementMode, DependencyProperty,
				FrameworkPropertyMetadata, ValidateValueCallback, EventManager,
				FindToolTipEventHandler, UIElement, ContentElement,
				SystemParameters, ToolTipEventHandler){
	var ToolTipService = declare("ToolTipService", null,{

	});
	
	Object.defineProperties(ToolTipService,{
        /// <summary> 
        ///     The DependencyProperty for the ToolTip property. 
        /// </summary>
//        public static readonly DependencyProperty 
        ToolTipProperty:
        {
        	get:function(){
        		if(ToolTipService._ToolTipProperty === undefined){
        			ToolTipService._ToolTipProperty = 
                        DependencyProperty.RegisterAttached(
                                "ToolTip",              // Name
                                Object.Type,         // Type
                                ToolTipService.Type, // Owner 
                                new FrameworkPropertyMetadata( null));
        		}
        		
        		return ToolTipService._ToolTipProperty;
        	}
        },	
        /// <summary> 
        ///     The DependencyProperty for the HorizontalOffset property. 
        /// </summary>
//        public static readonly DependencyProperty 
        HorizontalOffsetProperty:
        {
        	get:function(){
        		if(ToolTipService._HorizontalOffsetProperty === undefined){
        			ToolTipService._HorizontalOffsetProperty = 
        	            DependencyProperty.RegisterAttached("HorizontalOffset",     // Name
        	            		Number.Type,         // Type
                                ToolTipService.Type, // Owner
                                new FrameworkPropertyMetadata(0)); // Default Value 
        		}
        		
        		return ToolTipService._HorizontalOffsetProperty;
        	}
        }, 
        /// <summary> 
        ///     The DependencyProperty for the VerticalOffset property.
        /// </summary>
//        public static readonly DependencyProperty 
        VerticalOffsetProperty:
        {
        	get:function(){
        		if(ToolTipService._VerticalOffsetProperty === undefined){
        			ToolTipService._VerticalOffsetProperty  =
        	            DependencyProperty.RegisterAttached("VerticalOffset",       // Name 
                                Number.Type,         // Type
                                ToolTipService.Type, // Owner 
                                /*new FrameworkPropertyMetadata(0)*/
                                FrameworkPropertyMetadata.BuildWithDV(0)); // Default Value 
        		}
        		
        		return ToolTipService._VerticalOffsetProperty;
        	}
        },
        /// <summary>
        ///     The DependencyProperty for HasDropShadow 
        /// </summary>
//        public static readonly DependencyProperty 
        HasDropShadowProperty:
        {
        	get:function(){
        		if(ToolTipService._HasDropShadowProperty === undefined){
        			ToolTipService._HasDropShadowProperty = 
        	            DependencyProperty.RegisterAttached("HasDropShadow",        // Name 
                                Boolean.Type,           // Type
                                ToolTipService.Type, // Owner 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); // Default Value
        		}
        		
        		return ToolTipService._HasDropShadowProperty;
        	}
        },
        
        /// <summary>
        ///     The DependencyProperty for the PlacementTarget property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        PlacementTargetProperty:
        {
        	get:function(){
        		if(ToolTipService._PlacementTargetProperty === undefined){
        			ToolTipService._PlacementTargetProperty =
        	            DependencyProperty.RegisterAttached("PlacementTarget",      // Name 
        	            		UIElement.Type,      // Type
                                ToolTipService.Type, // Owner
                                /*new FrameworkPropertyMetadata(null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null)); // Default Value
        		}
        		
        		return ToolTipService._PlacementTargetProperty;
        	}
        },
        
        /// <summary> 
        ///     The DependencyProperty for the PlacementRectangle property.
        /// </summary> 
//        public static readonly DependencyProperty 
        PlacementRectangleProperty:
        {
        	get:function(){
        		if(ToolTipService._PlacementRectangleProperty === undefined){
        			ToolTipService._PlacementRectangleProperty =
        	            DependencyProperty.RegisterAttached("PlacementRectangle",   // Name
                                Rect.Type,           // Type
                                ToolTipService.Type, // Owner 
                                /*new FrameworkPropertyMetadata(Rect.Empty)*/
                                FrameworkPropertyMetadata.BuildWithDV(Rect.Empty)); // Default Value 
        		}
        		
        		return ToolTipService._PlacementRectangleProperty;
        	}
        },
        
        /// <summary> 
        ///     The DependencyProperty for the Placement property.
        /// </summary>
//        public static readonly DependencyProperty 
        PlacementProperty:
        {
        	get:function(){
        		if(ToolTipService._PlacementProperty === undefined){
        			ToolTipService._PlacementProperty =
        	            DependencyProperty.RegisterAttached("Placement",            // Name 
                                Number.Type,  // Type
                                ToolTipService.Type, // Owner 
                                /*new FrameworkPropertyMetadata(PlacementMode.Mouse)*/
                                FrameworkPropertyMetadata.BuildWithDV(PlacementMode.Mouse)); // Default Value 
        		}
        		
        		return ToolTipService._PlacementProperty;
        	}
        },
        /// <summary>
        ///     The DependencyProperty for the ShowOnDisabled property.
        /// </summary> 
//        public static readonly DependencyProperty 
        ShowOnDisabledProperty:
        {
        	get:function(){
        		if(ToolTipService._ShowOnDisabledProperty === undefined){
        			ToolTipService._ShowOnDisabledProperty =
        	            DependencyProperty.RegisterAttached("ShowOnDisabled",       // Name 
        	            		Boolean.Type,           // Type 
                                ToolTipService.Type, // Owner
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); // Default Value 
        		}
        		
        		return ToolTipService._ShowOnDisabledProperty;
        	}
        },
        /// <summary> 
        ///     Read-only Key Token for the IsOpen property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
        IsOpenPropertyKey:
        {
        	get:function(){
        		if(ToolTipService._IsOpenPropertyKey === undefined){
        			ToolTipService._IsOpenPropertyKey = 
        	            DependencyProperty.RegisterAttachedReadOnly("IsOpen",               // Name
                                Boolean.Type,           // Type 
                                ToolTipService.Type, // Owner
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); // Default Value
        		}
        		
        		return ToolTipService._IsOpenPropertyKey;
        	}
        },

        /// <summary> 
        ///     The DependencyProperty for the IsOpen property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsOpenProperty:
        {
        	get:function(){
        		if(ToolTipService._IsOpenProperty === undefined){
        			ToolTipService._IsOpenProperty = ToolTipService.IsOpenPropertyKey.DependencyProperty;
        		}
        		
        		return ToolTipService._IsOpenProperty;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the IsEnabled property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsEnabledProperty:
        {
        	get:function(){
        		if(ToolTipService._IsEnabledProperty === undefined){
        			ToolTipService._IsEnabledProperty =
        	            DependencyProperty.RegisterAttached("IsEnabled",            // Name 
                                Boolean.Type,           // Type 
                                ToolTipService.Type, // Owner
                                /*new FrameworkPropertyMetadata(true)*/
                                FrameworkPropertyMetadata.BuildWithDV(true)); // Default Value 
        		}
        		
        		return ToolTipService._IsEnabledProperty;
        	}
        },
        /// <summary> 
        ///     The DependencyProperty for the ShowDuration property.
        /// </summary>
//        public static readonly DependencyProperty 
        ShowDurationProperty:
        {
        	get:function(){
        		if(ToolTipService._ShowDurationProperty === undefined){
        			ToolTipService._ShowDurationProperty =
        	            DependencyProperty.RegisterAttached("ShowDuration",         // Name 
                                Number.Type,            // Type
                                ToolTipService.Type, // Owner 
                                /*new FrameworkPropertyMetadata(5000)*/
                                FrameworkPropertyMetadata.BuildWithDV(5000),    // Default Value 
                                new ValidateValueCallback(null, PositiveValueValidation));    // Value validation
        		}
        		
        		return ToolTipService._ShowDurationProperty;
        	}
        },
        /// <summary>
        ///     The DependencyProperty for the InitialShowDelay property. 
        /// </summary>
//        public static readonly DependencyProperty 
        InitialShowDelayProperty:
        {
        	get:function(){
        		if(ToolTipService._InitialShowDelayProperty === undefined){
        			ToolTipService._InitialShowDelayProperty = 
        	            DependencyProperty.RegisterAttached("InitialShowDelay",     // Name 
                                Number.Type,            // Type
                                ToolTipService.Type, // Owner 
                                /*new FrameworkPropertyMetadata(SystemParameters.MouseHoverTimeMilliseconds)*/
                                FrameworkPropertyMetadata.BuildWithDV(SystemParameters.MouseHoverTimeMilliseconds), // Default Value
                                new ValidateValueCallback(null, PositiveValueValidation));    // Value validation
        		}
        		
        		return ToolTipService._InitialShowDelayProperty;
        	}
        },
        /// <summary> 
        ///     The DependencyProperty for the BetweenShowDelay property. 
        /// </summary>
//        public static readonly DependencyProperty 
        BetweenShowDelayProperty:
        {
        	get:function(){
        		if(ToolTipService._BetweenShowDelayProperty === undefined){
        			ToolTipService._BetweenShowDelayProperty = 
        	            DependencyProperty.RegisterAttached("BetweenShowDelay",     // Name
                                Number.Type,            // Type
                                ToolTipService.Type, // Owner
                                /*new FrameworkPropertyMetadata(100)*/
                                FrameworkPropertyMetadata.BuildWithDV(100),   // Default Value 
                                new ValidateValueCallback(null, PositiveValueValidation));    // Value validation
        		}
        		
        		return ToolTipService._BetweenShowDelayProperty;
        	}
        },
        /// <summary> 
        ///     The event raised when a ToolTip is going to be shown on an element.
        /// 
        ///     Mark the event as handled if manually showing a ToolTip. 
        ///
        ///     Replacing the value of the ToolTip property is allowed 
        ///     (example: for delay-loading). Do not mark the event as handled
        ///     in this case if the system is to show the ToolTip.
        /// </summary>
//        public static readonly RoutedEvent 
        ToolTipOpeningEvent:
        {
        	get:function(){
        		if(ToolTipService._ToolTipOpeningEvent === undefined){
        			ToolTipService._ToolTipOpeningEvent = 
        	            EventManager.RegisterRoutedEvent("ToolTipOpening",
                                RoutingStrategy.Direct, 
                                ToolTipEventHandler.Type, 
                                ToolTipService.Type);
        		}
        		
        		return ToolTipService._ToolTipOpeningEvent;
        	}
        },
        /// <summary>
        ///     The event raised when a ToolTip on an element that was shown 
        ///     should now be hidden.
        /// </summary> 
//        public static readonly RoutedEvent 
        ToolTipClosingEvent:
        {
        	get:function(){
        		if(ToolTipService._ToolTipClosingEvent === undefined){
        			ToolTipService._ToolTipClosingEvent = 
        	            EventManager.RegisterRoutedEvent("ToolTipClosing",
                                RoutingStrategy.Direct, 
                                ToolTipEventHandler.Type,
                                ToolTipService.Type);
        		}
        		
        		return ToolTipService._ToolTipClosingEvent;
        	}
        },
//        internal static readonly RoutedEvent 
        FindToolTipEvent:
        {
        	get:function(){
        		if(ToolTipService._FindToolTipEvent === undefined){
        			ToolTipService._FindToolTipEvent =
        	            EventManager.RegisterRoutedEvent("FindToolTip",
                                RoutingStrategy.Bubble, 
                                FindToolTipEventHandler.Type,
                                ToolTipService.Type); 
        		}
        		
        		return ToolTipService._FindToolTipEvent;
        	}
        },

	});
	
    /// <summary> 
    ///     Gets the value of the ToolTip property on the specified object.
    /// </summary> 
    /// <param name="element">The object on which to query the ToolTip property.</param>
    /// <returns>The value of the ToolTip property.</returns>
//    public static object 
    ToolTipService.GetToolTip = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.ToolTipProperty);
    };

    /// <summary> 
    ///     Sets the ToolTip property on the specified object.
    /// </summary> 
    /// <param name="element">The object on which to set the ToolTip property.</param> 
    /// <param name="value">
    ///     The value of the ToolTip property. If the value is of type ToolTip, then 
    ///     that is the ToolTip that will be used (without any modification). If the value
    ///     is of any other type, then that value will be used as the content for a ToolTip
    ///     provided by this service, and the other attached properties of this service
    ///     will be used to configure the ToolTip. 
    /// </param>
//    public static void 
    ToolTipService.SetToolTip = function(/*DependencyObject*/ element, /*object*/ value) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        element.SetValue(ToolTipService.ToolTipProperty, value);
    }; 

    /// <summary> 
    ///     Gets the value of the HorizontalOffset property. 
    /// </summary>
    /// <param name="element">The object on which to query the property.</param> 
    /// <returns>The value of the property.</returns>
//    public static double 
    ToolTipService.GetHorizontalOffset = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.HorizontalOffsetProperty);
    };

    /// <summary> 
    ///     Sets the value of the HorizontalOffset property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetHorizontalOffset = function(/*DependencyObject*/ element, /*double*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ToolTipService.HorizontalOffsetProperty, value); 
    }; 

    /// <summary> 
    ///     Gets the value of the VerticalOffset property.
    /// </summary>
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static double 
    ToolTipService.GetVerticalOffset = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ToolTipService.VerticalOffsetProperty); 
    };

    /// <summary> 
    ///     Sets the value of the VerticalOffset property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetVerticalOffset = function(/*DependencyObject*/ element, /*double*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ToolTipService.VerticalOffsetProperty, value); 
    };

    /// <summary>
    ///     Gets the value of the HasDropShadow property. 
    /// </summary>
    /// <param name="element">The object on which to query the property.</param> 
    /// <returns>The value of the property.</returns> 
//    public static bool 
    ToolTipService.GetHasDropShadow = function(/*DependencyObject*/ element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        return element.GetValue(ToolTipService.HasDropShadowProperty); 
    }; 

    /// <summary> 
    ///     Sets the value of the HasDropShadow property.
    /// </summary>
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param> 
//    public static void 
    ToolTipService.SetHasDropShadow = function(/*DependencyObject*/ element, /*bool*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ToolTipService.HasDropShadowProperty, value);
    };

    /// <summary>
    ///     Gets the value of the PlacementTarget property. 
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static UIElement 
    ToolTipService.GetPlacementTarget = function(/*DependencyObject*/ element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        return element.GetValue(ToolTipService.PlacementTargetProperty);
    }; 

    /// <summary>
    ///     Sets the value of the PlacementTarget property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param> 
//    public static void 
    ToolTipService.SetPlacementTarget = function(/*DependencyObject*/ element, /*UIElement*/ value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        element.SetValue(ToolTipService.PlacementTargetProperty, value); 
    };

    /// <summary> 
    ///     Gets the value of the PlacementRectangle property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns>
//    public static Rect 
    ToolTipService.GetPlacementRectangle = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.PlacementRectangleProperty);
    };

    /// <summary> 
    ///     Sets the value of the PlacementRectangle property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetPlacementRectangle = function(/*DependencyObject*/ element, /*Rect*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ToolTipService.PlacementRectangleProperty, value); 
    };

    /// <summary> 
    ///     Gets the value of the Placement property.
    /// </summary>
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static PlacementMode 
    ToolTipService.GetPlacement = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ToolTipService.PlacementProperty);
    }; 

    /// <summary> 
    ///     Sets the value of the Placement property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetPlacement = function(/*DependencyObject*/ element, /*PlacementMode*/ value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(ToolTipService.PlacementProperty, value);
    };


    /// <summary>
    ///     Gets the value of the ShowOnDisabled property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static bool 
    ToolTipService.GetShowOnDisabled = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.ShowOnDisabledProperty);
    }; 

    /// <summary>
    ///     Sets the value of the ShowOnDisabled property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetShowOnDisabled = function(/*DependencyObject*/ element, /*bool*/ value) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        element.SetValue(ToolTipService.ShowOnDisabledProperty, value);
    };

    /// <summary> 
    ///     Gets the value of the IsOpen property.
    /// </summary>
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static bool 
    ToolTipService.GetIsOpen = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ToolTipService.IsOpenProperty);
    };

    /// <summary>
    ///     Gets the value of the IsEnabled property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static bool 
    ToolTipService.GetIsEnabled = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.IsEnabledProperty);
    }; 

    /// <summary>
    ///     Sets the value of the IsEnabled property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetIsEnabled = function(/*DependencyObject*/ element, /*bool*/ value) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        element.SetValue(ToolTipService.IsEnabledProperty, value);
    };

//    private static bool 
    function PositiveValueValidation(/*object*/ o) 
    {
        return o >= 0; 
    } 
    /// <summary> 
    ///     Sets the value of the IsOpen property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    private static void 
    function SetIsOpen(/*DependencyObject*/ element, /*bool*/ value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(ToolTipService.IsOpenPropertyKey, value);
    } 


    /// <summary>
    ///     Gets the value of the ShowDuration property.
    /// </summary>
    /// <param name="element">The object on which to query the property.</param> 
    /// <returns>The value of the property.</returns>
//    public static int 
    ToolTipService.GetShowDuration = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ToolTipService.ShowDurationProperty); 
    };

    /// <summary> 
    ///     Sets the value of the ShowDuration property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetShowDuration = function(/*DependencyObject*/ element, /*int*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ToolTipService.ShowDurationProperty, value); 
    };


    /// <summary> 
    ///     Gets the value of the InitialShowDelay property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param> 
    /// <returns>The value of the property.</returns>
//    public static int 
    ToolTipService.GetInitialShowDelay = function(/*DependencyObject*/ element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.InitialShowDelayProperty); 
    };

    /// <summary>
    ///     Sets the value of the InitialShowDelay property.
    /// </summary>
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetInitialShowDelay = function(/*DependencyObject*/ element, /*int*/ value) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        element.SetValue(ToolTipService.InitialShowDelayProperty, value);
    };

    /// <summary> 
    ///     Gets the value of the BetweenShowDelay property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns>
//    public static int 
    ToolTipService.GetBetweenShowDelay = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ToolTipService.BetweenShowDelayProperty);
    };

    /// <summary> 
    ///     Sets the value of the BetweenShowDelay property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ToolTipService.SetBetweenShowDelay = function(/*DependencyObject*/ element, /*int*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ToolTipService.BetweenShowDelayProperty, value); 
    }; 

    /// <summary>
    ///     Adds a handler for the ToolTipOpening attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    ToolTipService.AddToolTipOpeningHandler = function(/*DependencyObject*/ element, /*ToolTipEventHandler*/ handler) 
    { 
        UIElement.AddHandler(element, ToolTipService.ToolTipService.ToolTipOpeningEvent, handler);
    }; 

    /// <summary>
    ///     Removes a handler for the ToolTipOpening attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    ToolTipService.RemoveToolTipOpeningHandler = function(/*DependencyObject*/ element, /*ToolTipEventHandler*/ handler) 
    {
        UIElement.RemoveHandler(element, ToolTipService.ToolTipService.ToolTipOpeningEvent, handler); 
    };


    /// <summary>
    ///     Adds a handler for the ToolTipClosing attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    ToolTipService.AddToolTipClosingHandler = function(/*DependencyObject*/ element, /*ToolTipEventHandler*/ handler)
    {
        UIElement.AddHandler(element, ToolTipService.ToolTipClosingEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the ToolTipClosing attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    ToolTipService.RemoveToolTipClosingHandler = function(/*DependencyObject*/ element, /*ToolTipEventHandler*/ handler)
    {
        UIElement.RemoveHandler(element, ToolTipService.ToolTipClosingEvent, handler); 
    };


//    private static void 
    function OnFindToolTip(/*object*/ sender, /*FindToolTipEventArgs*/ e) 
    { 
        if (e.TargetElement == null)
        { 
            /*DependencyObject*/var o = sender instanceof DependencyObject ? sender : null;
            if (o != null)
            {
                if (PopupControlService.Current.StopLookingForToolTip(o)) 
                {
                    // Stop looking 
                    e.Handled = true; 
                    e.KeepCurrentActive = true;
                } 
                else
                {
                    if (ToolTipIsEnabled(o))
                    { 
                        // Store for later
                        e.TargetElement = o; 
                        e.Handled = true; 
                    }
                } 
            }
        }
    }

//    private static bool 
    function ToolTipIsEnabled(/*DependencyObject*/ o)
    { 
        if ((ToolTipService.GetToolTip(o) != null) && ToolTipService.GetIsEnabled(o)) 
        {
            if (PopupControlService.IsElementEnabled(o) || ToolTipService.GetShowOnDisabled(o)) 
            {
                return true;
            }
        } 

        return false; 
    } 
    
//    static ToolTipService()
    function Initialize()
    { 
        EventManager.RegisterClassHandler(UIElement.Type, ToolTipService.FindToolTipEvent, new FindToolTipEventHandler(null, OnFindToolTip));
        EventManager.RegisterClassHandler(ContentElement.Type, ToolTipService.FindToolTipEvent, new FindToolTipEventHandler(null, OnFindToolTip));
//        EventManager.RegisterClassHandler(typeof(UIElement3D), FindToolTipEvent, new FindToolTipEventHandler(OnFindToolTip));
    } 
	
	ToolTipService.Type = new Type("ToolTipService", ToolTipService, [Object.Type]);
	Initialize();
	
	return ToolTipService;
});

 


