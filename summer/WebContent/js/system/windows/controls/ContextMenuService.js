/**
 * ContextMenuService
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty", "windows/FrameworkPropertyMetadata", 
        "windows/FrameworkPropertyMetadataOptions", "controls/ContextMenuEventHandler"], 
		function(declare, Type, DependencyProperty, FrameworkPropertyMetadata, 
				FrameworkPropertyMetadataOptions, ContextMenuEventHandler){
	
	var ContextMenu = null;
	function EnsureContextMenu(){
		if(ContextMenu == null){
			ContextMenu = using("controls/ContextMenu");
		}
		
		return ContextMenu;
	}
	
	var ContextMenuService = declare("ContextMenuService", null,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(ContextMenuService, {
		///     The DependencyProperty for the ContextMenu property. 
//		public static readonly DependencyProperty 
		ContextMenuProperty:
		{
			get:function(){
				if(ContextMenuService._ContextMenuProperty === undefined){
					ContextMenuService._ContextMenuProperty =
			             DependencyProperty.RegisterAttached( 
			                     "ContextMenu",              // Name
			                     EnsureContextMenu().Type,        // Type
			                     ContextMenuService.Type, // Owner
			                      new FrameworkPropertyMetadata(/*(ContextMenu)*/null, 
			                              FrameworkPropertyMetadataOptions.None));
				}
				
				return ContextMenuService._ContextMenuProperty;
			}
		},
     
	     ///     The DependencyProperty for the HorizontalOffset property. 
//	     public static readonly DependencyProperty 
	     HorizontalOffsetProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._HorizontalOffsetProperty === undefined){
	    			 ContextMenuService._HorizontalOffsetProperty =
				         	DependencyProperty.RegisterAttached("HorizontalOffset",         // Name 
                                 Number.Type,             // Type
                                 ContextMenuService.Type, // Owner
                                 new FrameworkPropertyMetadata(0)); // Default Value
	    		 }
				
	    		 return ContextMenuService._HorizontalOffsetProperty;
	    	 }
	     }, 
	     
	     ///     The DependencyProperty for the VerticalOffset property. 
//	     public static readonly DependencyProperty 
	     VerticalOffsetProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._VerticalOffsetProperty === undefined){
	    			 ContextMenuService._VerticalOffsetProperty =
	    				 DependencyProperty.RegisterAttached("VerticalOffset",           // Name
			            		Boolean.Type,             // Type 
			                    ContextMenuService.Type, // Owner
			                    new FrameworkPropertyMetadata(0)); // Default Value 
	    		 }
				
	    		 return ContextMenuService._VerticalOffsetProperty;
	    	 }
	     }, 
	     
	     ///     The DependencyProperty for the HasDropShadow property.
//	     public static readonly DependencyProperty 
	     HasDropShadowProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._HasDropShadowProperty === undefined){
	    			 ContextMenuService._HasDropShadowProperty =
	    				 DependencyProperty.RegisterAttached("HasDropShadow",            // Name 
			            		Boolean.Type,               // Type 
			                    ContextMenuService.Type, // Owner
			                    new FrameworkPropertyMetadata(false)); //Default Value
	    		 }
				
	    		 return ContextMenuService._HasDropShadowProperty;
	    	 }
	     }, 
	     
	     ///     The DependencyProperty for the PlacementTarget property. 
//	     public static readonly DependencyProperty 
	     PlacementTargetProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._PlacementTargetProperty === undefined){
	    			 ContextMenuService._PlacementTargetProperty = 
	    				 DependencyProperty.RegisterAttached("PlacementTarget",          // Name 
				            		UIElement.Type,          // Type
				            		ContextMenuService.Type, // Owner 
				                    new FrameworkPropertyMetadata(/*(UIElement)*/null)); // Default Value
	    		 }
					
	    		 return ContextMenuService._PlacementTargetProperty;
	    	 }
	     }, 
	     
	     /// <summary>
	     ///     The DependencyProperty for the PlacementRectangle property. 
	     /// </summary> 
//	        public static readonly DependencyProperty 
	     PlacementRectangleProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._PlacementRectangleProperty === undefined){
	    			 ContextMenuService._PlacementRectangleProperty =
				            DependencyProperty.RegisterAttached("PlacementRectangle",       // Name 
                                    Rect.Type, //typeof(Rect),               // Type
                                    ContextMenuService.Type, // Owner
                                    new FrameworkPropertyMetadata(Rect.Empty)); // Default Value
	    		 }
					
	    		 return ContextMenuService._PlacementRectangleProperty;
	    	 }
	     },
	     
	     /// <summary> 
	     ///     The DependencyProperty for the Placement property.
	     /// </summary> 
//	        public static readonly DependencyProperty 
	     PlacementProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._PlacementProperty === undefined){
	    			 ContextMenuService._PlacementProperty =
	    				 DependencyProperty.RegisterAttached("Placement",                // Name
                                    Number.Type/*typeof(PlacementMode)*/,      // Type
                                    ContextMenuService.Type, // Owner 
                                    new FrameworkPropertyMetadata(PlacementMode.MousePoint)); // Default Value
	    		 	}
					
					return ContextMenuService._PlacementProperty;
	    	 }
	     }, 
	     ///     The DependencyProperty for the ShowOnDisabled property.
//	        public static readonly DependencyProperty 
	     ShowOnDisabledProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._ShowOnDisabledProperty === undefined){
	    			 	ContextMenuService._ShowOnDisabledProperty =
				            DependencyProperty.RegisterAttached("ShowOnDisabled",           // Name 
									Boolean.Type,               // Type
                                    ContextMenuService.Type, // Owner 
                                    new FrameworkPropertyMetadata(false)); // Default Value
	    		 }
					
	    		 return ContextMenuService._ShowOnDisabledProperty;
	    	 }
	     },  
	     ///     The DependencyProperty for the IsEnabled property.
//	        public static readonly DependencyProperty 
	     IsEnabledProperty:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._IsEnabledProperty === undefined){
	    			 	ContextMenuService._IsEnabledProperty =
	    			 		DependencyProperty.RegisterAttached("IsEnabled",                // Name 
                                    Boolean.Type,               // Type 
                                    ContextMenuService.Type, // Owner
                                    new FrameworkPropertyMetadata(true)); // Default Value
	    		 }
					
				 return ContextMenuService._IsEnabledProperty;
	    	 }
	     },  
	     ///     An event that fires just before a ContextMenu should be opened. 
	     ///
	     ///     To manually open and close ContextMenus, mark this event as handled.
	     ///     Otherwise, the value of the the ContextMenu property will be used
	     ///     to automatically open a ContextMenu. 
//	        public static readonly RoutedEvent 
	     ContextMenuOpeningEvent:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._ContextMenuOpeningEvent === undefined){
	    			 ContextMenuService._ContextMenuOpeningEvent = 
	    				 EventManager.RegisterRoutedEvent("ContextMenuOpening", 
                         RoutingStrategy.Bubble,
                         ContextMenuEventHandler.Type, 
                         ContextMenuService.Type);
					
	    			 EventManager.RegisterClassHandler(UIElement.Type, ContextMenuService._ContextMenuOpeningEvent, 
	    					 new ContextMenuEventHandler(OnContextMenuOpening)); 
	    			 EventManager.RegisterClassHandler(ContentElement.Type, ContextMenuService._ContextMenuOpeningEvent, 
	    					 new ContextMenuEventHandler(null, OnContextMenuOpening));
					
	    		 }
				
	    		 return ContextMenuService._ContextMenuOpeningEvent;
			}
		}, 
	     ///     An event that fires just as a ContextMenu closes. 
//	        public static readonly RoutedEvent 
	     ContextMenuClosingEvent:
	     {
	    	 get:function(){
	    		 if(ContextMenuService._ContextMenuClosingEvent === undefined){
					ContextMenuService._ContextMenuClosingEvent =
			            EventManager.RegisterRoutedEvent("ContextMenuClosing", 
                                RoutingStrategy.Bubble,
                                ContextMenuEventHandler.Type,
                                ContextMenuService.Type);
	    		 }
				
	    		 return ContextMenuService._ContextMenuClosingEvent;
	    	 }
	     }
	     
	     
	});
	
    /// <summary> 
    ///     Gets the value of the ContextMenu property on the specified object.
    /// </summary> 
    /// <param name="element">The object on which to query the ContextMenu property.</param>
    /// <returns>The value of the ContextMenu property.</returns>
//    public static ContextMenu 
    ContextMenuService.GetContextMenu = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        /*ContextMenu*/var cm = element.GetValue(ContextMenuService.ContextMenuProperty);

        if ((cm != null) && (element.Dispatcher != cm.Dispatcher)) 
        {
            throw new ArgumentException(SR.Get(SRID.ContextMenuInDifferentDispatcher)); 
        } 

        return cm; 
   };

    /// <summary>
    ///     Sets the ContextMenu property on the specified object. 
    /// </summary>
    /// <param name="element">The object on which to set the ContextMenu property.</param> 
    /// <param name="value"> 
    ///     The value of the ContextMenu property. If the value is of type ContextMenu, then
    ///     that is the ContextMenu that will be used (without any modification). If the value 
    ///     is of any other type, then that value will be used as the content for a ContextMenu
    ///     provided by this service, and the other attached properties of this service
    ///     will be used to configure the ContextMenu.
    /// </param> 
//    public static void 
    ContextMenuService.SetContextMenu = function(/*DependencyObject*/ element, /*ContextMenu*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ContextMenuService.ContextMenuProperty, value);
    };

    /// <summary>
    ///     Gets the value of the HorizontalOffset property. 
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static double 
    ContextMenuService.GetHorizontalOffset = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        return element.GetValue(ContextMenuService.HorizontalOffsetProperty); 
    };

    /// <summary>
    ///     Sets the value of the HorizontalOffset property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param> 
//    public static void 
    ContextMenuService.SetHorizontalOffset = function(/*DependencyObject*/ element, /*double*/ value)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        element.SetValue(ContextMenuService.HorizontalOffsetProperty, value);
    };



    /// <summary>
    ///     Gets the value of the VerticalOffset property. 
    /// </summary>
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns>
//    public static double 
    ContextMenuService.GetVerticalOffset = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ContextMenuService.VerticalOffsetProperty);
    }; 

    /// <summary> 
    ///     Sets the value of the VerticalOffset property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ContextMenuService.SetVerticalOffset = function(/*DependencyObject*/ element, /*double*/ value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(ContextMenuService.VerticalOffsetProperty, value);
    };


    /// <summary>
    ///     Gets the value of the HasDropShadow property.
    /// </summary>
    /// <param name="element">The object on which to query the property.</param> 
    /// <returns>The value of the property.</returns>
//    public static bool 
    ContextMenuService.GetHasDropShadow = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ContextMenuService.HasDropShadowProperty); 
    };

    /// <summary> 
    ///     Sets the value of the HasDropShadow property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ContextMenuService.SetHasDropShadow = function(/*DependencyObject*/ element, /*bool*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ContextMenuService.HasDropShadowProperty, value); 
    };



    /// <summary>
    ///     Gets the value of the PlacementTarget property. 
    /// </summary>
    /// <param name="element">The object on which to query the property.</param> 
    /// <returns>The value of the property.</returns> 
//    public static UIElement 
    ContextMenuService.GetPlacementTarget = function(/*DependencyObject*/ element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        return element.GetValue(ContextMenuService.PlacementTargetProperty); 
    };

    /// <summary> 
    ///     Sets the value of the PlacementTarget property.
    /// </summary>
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param> 
//    public static void 
    ContextMenuService.SetPlacementTarget = function(/*DependencyObject*/ element, /*UIElement*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ContextMenuService.PlacementTargetProperty, value);
    };

    /// <summary>
    ///     Gets the value of the PlacementRectangle property. 
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static Rect 
    ContextMenuService.GetPlacementRectangle = function(/*DependencyObject*/ element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        return element.GetValue(ContextMenuService.PlacementRectangleProperty);
    }; 

    /// <summary>
    ///     Sets the value of the PlacementRectangle property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param> 
//    public static void 
    ContextMenuService.SetPlacementRectangle = function(/*DependencyObject*/ element, /*Rect*/ value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        element.SetValue(ContextMenuService.PlacementRectangleProperty, value); 
    };

    /// <summary> 
    ///     Gets the value of the Placement property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns>
//    public static PlacementMode 
    ContextMenuService.GetPlacement = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ContextMenuService.PlacementProperty);
    };

    /// <summary> 
    ///     Sets the value of the Placement property.
    /// </summary> 
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ContextMenuService.SetPlacement = function(/*DependencyObject*/ element, /*PlacementMode*/ value) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }
        element.SetValue(ContextMenuService.PlacementProperty, value); 
    }; 


    /// <summary> 
    ///     Gets the value of the ShowOnDisabled property.
    /// </summary>
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static bool 
    ContextMenuService.GetShowOnDisabled = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }
        return element.GetValue(ContextMenuService.ShowOnDisabledProperty);
    }; 

    /// <summary> 
    ///     Sets the value of the ShowOnDisabled property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param> 
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ContextMenuService.SetShowOnDisabled = function(/*DependencyObject*/ element, /*bool*/ value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(ContextMenuService.ShowOnDisabledProperty, /*BooleanBoxes.Box(*/value);
    }; 


    /// <summary>
    ///     Gets the value of the IsEnabled property.
    /// </summary> 
    /// <param name="element">The object on which to query the property.</param>
    /// <returns>The value of the property.</returns> 
//    public static bool 
    ContextMenuService.GetIsEnabled = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        return element.GetValue(ContextMenuService.IsEnabledProperty);
    }; 

    /// <summary>
    ///     Sets the value of the IsEnabled property. 
    /// </summary>
    /// <param name="element">The object on which to set the value.</param>
    /// <param name="value">The desired value of the property.</param>
//    public static void 
    ContextMenuService.SetIsEnabled = function(/*DependencyObject*/ element, /*bool*/ value) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 
        element.SetValue(ContextMenuService.IsEnabledProperty, value);
    };


    /// <summary>
    ///     Adds a handler for the ContextMenuOpening attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    ContextMenuService.AddContextMenuOpeningHandler = function(/*DependencyObject*/ element, /*ContextMenuEventHandler*/ handler)
    { 
        UIElement.AddHandler(element, ContextMenuService.ContextMenuOpeningEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the ContextMenuOpening attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    ContextMenuService.RemoveContextMenuOpeningHandler = function(/*DependencyObject*/ element, /*ContextMenuEventHandler*/ handler) 
    {
        UIElement.RemoveHandler(element, ContextMenuService.ContextMenuOpeningEvent, handler);
    };

    /// <summary>
    ///     Adds a handler for the ContextMenuClosing attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    ContextMenuService.AddContextMenuClosingHandler = function(/*DependencyObject*/ element, /*ContextMenuEventHandler*/ handler)
    {
        UIElement.AddHandler(element, ContextMenuService.ContextMenuClosingEvent, handler);
    }; 

    /// <summary> 
    ///     Removes a handler for the ContextMenuClosing attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    ContextMenuService.RemoveContextMenuClosingHandler = function(/*DependencyObject*/ element, /*ContextMenuEventHandler*/ handler)
    {
        UIElement.RemoveHandler(element, ContextMenuService.ContextMenuClosingEvent, handler); 
    };

//    private static void 
    function OnContextMenuOpening(/*object*/ sender, /*ContextMenuEventArgs*/ e)
    { 
        if (e.TargetElement == null) 
        {
            /*DependencyObject*/var o = sender instanceof DependencyObject ? sender : null; 
            if (o != null)
            {
                if (ContextMenuService.ContextMenuIsEnabled(o))
                { 
                    // Store for later
                    e.TargetElement = o; 
                } 
            }
        } 
    }

//    internal static bool 
    ContextMenuService.ContextMenuIsEnabled = function(/*DependencyObject*/ o) 
    {
        var contextMenuIsEnabled = false; 
        /*object*/var menu = GetContextMenu(o);
        if ((menu != null) && GetIsEnabled(o))
        {
            if (PopupControlService.IsElementEnabled(o) || GetShowOnDisabled(o)) 
            {
                contextMenuIsEnabled = true; 
            } 
        }

        return contextMenuIsEnabled;
    };
	
	ContextMenuService.Type = new Type("ContextMenuService", ContextMenuService, [Object.Type]);
	return ContextMenuService;
});

 
 

