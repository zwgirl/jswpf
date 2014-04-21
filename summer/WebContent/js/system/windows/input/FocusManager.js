/**
 * FocusManager
 */
/// <summary> 
///   FocusManager define attached property used for tracking the FocusedElement with a focus scope
/// </summary> 
define(["dojo/_base/declare", "system/Type", "windows/EventManager", "windows/RoutingStrategy", "windows/RoutedEventHandler",
        "windows/PropertyMetadata", "windows/PropertyChangedCallback",
        "media/VisualTreeHelper", "windows/UncommonField"], 
		function(declare, Type, EventManager, RoutingStrategy, RoutedEventHandler,
				PropertyMetadata, PropertyChangedCallback, 
				VisualTreeHelper, UncommonField){
	
	
	
	var UIElement = null;
	function EnsureUIElement(){
		if(UIElement==null){
			UIElement = using("windows/UIElement");
		}
		
		return UIElement;
	}
	
////    private static readonly UncommonField<bool> 
//	var IsFocusedElementSet = new UncommonField/*<bool>*/(); 
////    private static readonly UncommonField<WeakReference> 
//	var FocusedElementWeakCacheField = new UncommonField/*<WeakReference>*/(); 
////    private static readonly UncommonField<bool> 
//	var IsFocusedElementCacheValid = new UncommonField/*<bool>*/();
////    private static readonly UncommonField<WeakReference> 
//	var FocusedElementCache = new UncommonField/*<WeakReference>*/(); 
    
	var FocusManager = declare("FocusManager", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(FocusManager,{
		/// <summary>
        ///     GotFocus event 
        /// </summary> 
//        public static readonly RoutedEvent 
		GotFocusEvent:
        {
        	get:function(){
        		if(FocusManager._GotFocusEvent === undefined){
        			FocusManager._GotFocusEvent = EventManager.RegisterRoutedEvent("GotFocus", 
        					RoutingStrategy.Bubble, RoutedEventHandler.Type, FocusManager.Type);
        		}
        		
        		return FocusManager._GotFocusEvent;
        	}
        }, 
 
        /// <summary>
        ///     LostFocus event 
        /// </summary>
//        public static readonly RoutedEvent 
		LostFocusEvent:
        {
        	get:function(){
        		if(FocusManager._LostFocusEvent === undefined){
        			FocusManager._LostFocusEvent = EventManager.RegisterRoutedEvent("LostFocus", 
        	        		RoutingStrategy.Bubble, RoutedEventHandler.Type, FocusManager.Type); 
        		}
        		
        		return FocusManager._LostFocusEvent;
        	}
        },  
 
        /// <summary> 
        /// The DependencyProperty for the FocusedElement property. This internal property tracks IsActive
        /// element ref inside TrackFocus 
        /// Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
		FocusedElementProperty:
        {
        	get:function(){
        		if(FocusManager._FocusedElementProperty === undefined){
        			FocusManager._FocusedElementProperty =
                        DependencyProperty.RegisterAttached( 
                                "FocusedElement",
                                IInputElement.Type, 
                                FocusManager.Type, 
                                /*new PropertyMetadata(new PropertyChangedCallback(null, OnFocusedElementChanged))*/
                                PropertyMetadata.BuildWithPropChangeCB(new PropertyChangedCallback(null, OnFocusedElementChanged)));
        		}
        		
        		return FocusManager._FocusedElementProperty;
        	}
        }, 
        /// <summary> 
        ///     The DependencyProperty for the IsFocusScope property.
        /// This property is used to mark the special containers (like Window, Menu) so they can 
        /// keep track of the FocusedElement element inside the container. Once focus is set 
        /// on the container - it is delegated to the FocusedElement element
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
		IsFocusScopeProperty:
        {
        	get:function(){
        		if(FocusManager._IsFocusScopeProperty === undefined){
        			FocusManager._IsFocusScopeProperty = DependencyProperty.RegisterAttached("IsFocusScope", Boolean.Type, FocusManager.Type,
                            /*new PropertyMetadata(false)*/
        					PropertyMetadata.BuildWithDefaultValue(false)); 
        		}
        		
        		return FocusManager._IsFocusScopeProperty;
        	}
        }, 
        
	});
	
	/// <summary>
    ///     Adds a handler for the GotFocus attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
	FocusManager.AddGotFocusHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler) 
    { 
		EnsureUIElement().AddHandler(element, FocusManager.GotFocusEvent, handler);
    }; 

    /// <summary>
    ///     Removes a handler for the GotFocus attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    FocusManager.RemoveGotFocusHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, FocusManager.GotFocusEvent, handler); 
    };
    /// <summary>
    ///     Adds a handler for the LostFocus attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    FocusManager.AddLostFocusHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, FocusManager.LostFocusEvent, handler); 
    }; 

    /// <summary> 
    ///     Removes a handler for the LostFocus attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    FocusManager.RemoveLostFocusHandler = function(/*DependencyObject*/ element, /*RoutedEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, FocusManager.LostFocusEvent, handler); 
    };


    /// <summary>
    /// Return the property value of FocusedElement property. 
    /// </summary>
    /// <param name="element"></param> 
    /// <returns></returns> 
//    public static IInputElement 
//    FocusManager.GetFocusedElement = function(/*DependencyObject*/ element) 
//    {
//        return GetFocusedElement(element, false);
//    };
    /// <summary>
    /// Return the property value of FocusedElement property. The return value is validated 
    /// to be in the subtree of element. If FocusedElement element is not a descendant of element this method return null 
    /// </summary>
    /// <param name="element"></param> 
    /// <param name="validate"></param>
    /// <returns></returns>
    /// <SecurityNote>
    ///     Critical: This code accesses PresentationSource.CriticalFromVisual which is critical 
    ///     TreatAsSafe: This code does not expose it and simply uses it for determining if the FocusedElement is valid
    /// </SecurityNote> 
//    internal static IInputElement 
    FocusManager.GetFocusedElement = function(/*DependencyObject*/ element, /*bool*/ validate)
    { 
    	if(validate === undefined){
    		validate = false;
    	}
    	
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        /*DependencyObject*/var focusedElement = element.GetValue(FocusManager.FocusedElementProperty); 

        // Validate FocusedElement wrt to its FocusScope. If the two do not belong to the same PresentationSource
        // then sever this link between them. The classic scenario for this is when an element with logical focus is 
        // dragged out into a floating widow. We want to prevent the MainWindow (focus scope) to point to the
        // element in the floating window as its logical FocusedElement.

        if (validate && focusedElement != null) 
        {
            /*DependencyObject*/var focusScope = element; 

            if (PresentationSource.CriticalFromVisual(focusScope) != PresentationSource.CriticalFromVisual(focusedElement))
            { 
            	FocusManager.SetFocusedElement(focusScope, null);
                focusedElement = null;
            }
        } 

        return focusedElement; 
    }; 

    /// <summary> 
    ///     Set FocusedElement property for element.
    /// </summary>
    /// <param name="element"></param>
    /// <param name="value"></param> 
//    public static void 
    FocusManager.SetFocusedElement = function(/*DependencyObject*/ element, /*IInputElement*/ value)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(FocusManager.FocusedElementProperty, value);
    }; 

    /// <summary> 
    /// Writes the attached property IsFocusScope to the given element. 
    /// </summary>
    /// <param name="element">The element to which to write the attached property.</param> 
    /// <param name="value">The property value to set</param>
//    public static void 
    FocusManager.SetIsFocusScope = function(/*DependencyObject*/ element, /*bool*/ value)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 
        element.SetValue(FocusManager.IsFocusScopeProperty, value);
    }; 

    /// <summary>
    /// Reads the attached property IsFocusScope from the given element.
    /// </summary> 
    /// <param name="element">The element from which to read the attached property.</param>
    /// <returns>The property's value.</returns> 
//    public static bool 
    FocusManager.GetIsFocusScope = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }
        return element.GetValue(FocusManager.IsFocusScopeProperty); 
    };

    /// <summary> 
    /// Find the closest visual ancestor that has IsFocusScope set to true
    /// </summary> 
    /// <param name="element"></param>
    /// <returns></returns>
//    public static DependencyObject 
    FocusManager.GetFocusScope = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }
        return _GetFocusScope(element); 
    };


//    private static void 
    function OnFocusedElementChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*IInputElement*/var newFocusedElement = e.NewValue;
        /*DependencyObject*/var oldVisual = e.OldValue;
        /*DependencyObject*/var newVisual = e.NewValue; 

        if (oldVisual != null) 
        { 
            oldVisual.ClearValue(EnsureUIElement().IsFocusedPropertyKey);
        } 

        if (newVisual != null)
        {
            // set IsFocused on the element.  The element may redirect Keyboard focus 
            // in response to this (e.g. Editable ComboBox redirects to the
            // child TextBox), so detect whether this happens. 
            /*DependencyObject*/var oldFocus = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null; 
            newVisual.SetValue(EnsureUIElement().IsFocusedPropertyKey, true);
            /*DependencyObject*/var newFocus = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null;

            // set the Keyboard focus to the new element, provided that
            //  a) the element didn't already set Keyboard focus
            //  b) Keyboard focus is not already on the new element 
            //  c) the new element is within the same focus scope as the current
            //      holder (if any) of Keyboard focus 
            if (oldFocus == newFocus && newVisual != newFocus && 
                    (newFocus == null || GetRoot(newVisual) == GetRoot(newFocus)))
            { 
                Keyboard.Focus(newFocusedElement);
            }
        }
    }

//    private static DependencyObject 
    function GetRoot(/*DependencyObject*/ element)
    { 
        if (element == null) 
            return null;

        /*DependencyObject*/var parent = null;
        /*DependencyObject*/var dependencyObject = element;

        /*ContentElement*/var ce = element instanceof ContentElement ? element : null; 
        if (ce != null)
            dependencyObject = ce.GetUIParent(); 

        while (dependencyObject != null)
        { 
            parent = dependencyObject;
            dependencyObject = VisualTreeHelper.GetParent(dependencyObject);
        }

        return parent;
    } 
    // Walk up the parent chain to find the closest element with IsFocusScope=true
//    private static DependencyObject 
    function _GetFocusScope(/*DependencyObject*/ d) 
    {
        if (d == null)
            return null;

        if (d.GetValue(FocusManager.IsFocusScopeProperty))
            return d; 

        // Step 1: Walk up the logical tree
        var uiElement = d instanceof EnsureUIElement() ? d : null; 
        if (uiElement != null)
        {
            /*DependencyObject*/var logicalParent = uiElement.GetUIParentCore();
            if (logicalParent != null) 
            {
                return FocusManager.GetFocusScope(logicalParent); 
            } 
        }
        else 
        {
            var ce = d instanceof ContentElement ? d : null;
            if (ce != null)
            { 
                /*DependencyObject*/var logicalParent = ce.GetUIParent(true);
                if (logicalParent != null) 
                { 
                    return _GetFocusScope(logicalParent);
                } 
            }
        }

        // Step 2: Walk up the visual tree 
        if (d instanceof Visual /*|| d is Visual3D*/)
        { 
            var visualParent = VisualTreeHelper.GetParent(d);
            if (visualParent != null)
            {
                return _GetFocusScope(visualParent); 
            }
        } 

        // If visual and logical parent is null - then the element is implicit focus scope
        return d; 
    }
	
	FocusManager.Type = new Type("FocusManager", FocusManager, [Object.Type]);
	return FocusManager;
});

