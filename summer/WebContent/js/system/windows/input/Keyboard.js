/**
 * Keyboard
 */

define(["dojo/_base/declare", "system/Type", "windows/EventManager", "windows/RoutingStrategy", 
        "input/KeyboardFocusChangedEventHandler", "input/KeyEventHandler", "input/KeyboardInputProviderAcquireFocusEventHandler"], 
		function(declare, Type, EventManager, RoutingStrategy, 
				KeyboardFocusChangedEventHandler, KeyEventHandler, KeyboardInputProviderAcquireFocusEventHandler){
	
	var UIElement = null;
	function EnsureUIElement(){
		if(UIElement==null){
			UIElement = using("windows/UIElement");
		}
		
		return UIElement;
	}
	
	var InputManager = null;
	function EnsureInputManager(){
		if(InputManager==null){
			InputManager = using("input/InputManager");
		}
		
		return InputManager;
	}
	
	var Keyboard = declare("Keyboard", null,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(Keyboard, {
	       /// <summary>
        ///     PreviewKeyDown
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewKeyDownEvent:
        {
        	get:function(){
        		if(Keyboard._PreviewKeyDownEvent === undefined){
        			Keyboard._PreviewKeyDownEvent = EventManager.RegisterRoutedEvent("PreviewKeyDown", RoutingStrategy.Tunnel, 
        					KeyEventHandler.Type, Keyboard.Type);
        		}
        		
        		return Keyboard._PreviewKeyDownEvent;
        	}
        },

        /// <summary> 
        ///     KeyDown
        /// </summary>
//        public static readonly RoutedEvent 
        KeyDownEvent:
        {
        	get:function(){
        		if(Keyboard._KeyDownEvent === undefined){
        			Keyboard._KeyDownEvent = EventManager.RegisterRoutedEvent("KeyDown", RoutingStrategy.Bubble,
        					KeyEventHandler.Type, Keyboard.Type);
        		}
        		
        		return Keyboard._KeyDownEvent;
        	}
        }, 
 
        /// <summary> 
        ///     PreviewKeyUp
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewKeyUpEvent:
        {
        	get:function(){
        		if(Keyboard._PreviewKeyUpEvent === undefined){
        			Keyboard._PreviewKeyUpEvent = EventManager.RegisterRoutedEvent("PreviewKeyUp", RoutingStrategy.Tunnel, 
        					KeyEventHandler.Type, Keyboard.Type);
        		}
        		
        		return Keyboard._PreviewKeyUpEvent;
        	}
        }, 

        /// <summary>
        ///     KeyUp 
        /// </summary> 
//        public static readonly RoutedEvent 
        KeyUpEvent:
        {
        	get:function(){
        		if(Keyboard._KeyUpEvent === undefined){
        			Keyboard._KeyUpEvent = EventManager.RegisterRoutedEvent("KeyUp", RoutingStrategy.Bubble, KeyEventHandler.Type, Keyboard.Type);
        		}
        		
        		return Keyboard._KeyUpEvent;
        	}
        }, 

        /// <summary>
        ///     PreviewGotKeyboardFocus 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewGotKeyboardFocusEvent:
        {
        	get:function(){
        		if(Keyboard._PreviewGotKeyboardFocusEvent === undefined){
        			Keyboard._PreviewGotKeyboardFocusEvent = EventManager.RegisterRoutedEvent("PreviewGotKeyboardFocus", RoutingStrategy.Tunnel, 
        					KeyboardFocusChangedEventHandler.Type, Keyboard.Type);
        		}
        		
        		return Keyboard._PreviewGotKeyboardFocusEvent;
        	}
        },  
 
        /// <summary>
        ///     PreviewKeyboardInputProviderAcquireFocus
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewKeyboardInputProviderAcquireFocusEvent:
        {
        	get:function(){
        		if(Keyboard._PreviewKeyboardInputProviderAcquireFocusEvent === undefined){
        			Keyboard._PreviewKeyboardInputProviderAcquireFocusEvent = EventManager.RegisterRoutedEvent("PreviewKeyboardInputProviderAcquireFocus", RoutingStrategy.Tunnel, 
        					KeyboardInputProviderAcquireFocusEventHandler.Type, Keyboard.Type); 
        		}
        		
        		return Keyboard._PreviewKeyboardInputProviderAcquireFocusEvent;
        	}
        }, 

        /// <summary>
        ///     KeyboardInputProviderAcquireFocus 
        /// </summary>
//        public static readonly RoutedEvent 
        KeyboardInputProviderAcquireFocusEvent:
        {
        	get:function(){
        		if(Keyboard._KeyboardInputProviderAcquireFocusEvent === undefined){
        			Keyboard._KeyboardInputProviderAcquireFocusEvent = EventManager.RegisterRoutedEvent("KeyboardInputProviderAcquireFocus", RoutingStrategy.Bubble,
        	        		KeyboardInputProviderAcquireFocusEventHandler.Type, Keyboard.Type);

        		}
        		
        		return Keyboard._KeyboardInputProviderAcquireFocusEvent;
        	}
        }, 
        /// <summary> 
        ///     GotKeyboardFocus 
        /// </summary>
//        public static readonly RoutedEvent 
        GotKeyboardFocusEvent:
        {
        	get:function(){
        		if(Keyboard._GotKeyboardFocusEvent === undefined){
        			Keyboard._GotKeyboardFocusEvent = EventManager.RegisterRoutedEvent("GotKeyboardFocus", RoutingStrategy.Bubble, 
        	        		KeyboardFocusChangedEventHandler.Type, Keyboard.Type); 
        		}
        		
        		return Keyboard._GotKeyboardFocusEvent;
        	}
        }, 

        /// <summary> 
        ///     PreviewLostKeyboardFocus
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewLostKeyboardFocusEvent:
        {
        	get:function(){
        		if(Keyboard._PreviewLostKeyboardFocusEvent === undefined){
        			Keyboard._PreviewLostKeyboardFocusEvent = EventManager.RegisterRoutedEvent("PreviewLostKeyboardFocus", RoutingStrategy.Tunnel, 
        	        		KeyboardFocusChangedEventHandler.Type, Keyboard.Type); 
        		}
        		
        		return Keyboard._PreviewLostKeyboardFocusEvent;
        	}
        }, 

        /// <summary>
        ///     LostKeyboardFocus
        /// </summary> 
//        public static readonly RoutedEvent 
        LostKeyboardFocusEvent:
        {
        	get:function(){
        		if(Keyboard._LostKeyboardFocusEvent === undefined){
        			Keyboard._LostKeyboardFocusEvent = EventManager.RegisterRoutedEvent("LostKeyboardFocus", RoutingStrategy.Bubble,
        	        		KeyboardFocusChangedEventHandler.Type, Keyboard.Type);
        		}
        		
        		return Keyboard._LostKeyboardFocusEvent;
        	}
        }, 
        
        /// <summary> 
        ///     Returns the element that the keyboard is focused on.
        /// </summary>
//        public static IInputElement 
        FocusedElement:
        { 
            get:function()
            { 
                return Keyboard.PrimaryDevice.FocusedElement; 
            }
 
        },
        
        /// <summary> 
        ///     The default mode for restoring focus.
        /// <summary> 
//        public static RestoreFocusMode 
        DefaultRestoreFocusMode: 
        {
            get:function() 
            {
                return Keyboard.PrimaryDevice.DefaultRestoreFocusMode;
            },
 
            set:function(value)
            { 
                Keyboard.PrimaryDevice.DefaultRestoreFocusMode = value; 
            }
        },

        /// <summary>
        ///     The set of modifier keys currently pressed.
        /// </summary> 
//        public static ModifierKeys 
        Modifiers:
        { 
            get:function() 
            {
                return Keyboard.PrimaryDevice.Modifiers; 
            }
        },

        /// <summary> 
        ///     The primary keyboard device.
        /// </summary>
        /// <SecurityNote>
        ///     Critical: This code accesses the InputManager which causes an elevation 
        ///     PublicOK: It is ok to return the primary device
        /// </SecurityNote> 
//        public static KeyboardDevice 
        PrimaryDevice:
        {
            get:function()
            {
                /*KeyboardDevice*/var keyboardDevice = EnsureInputManager().UnsecureCurrent.PrimaryKeyboardDevice;
                return keyboardDevice; 
            }
        }, 
        
	});
	
    /// <summary> 
    ///     Adds a handler for the PreviewKeyDown attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
	Keyboard.AddPreviewKeyDownHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler)
    { 
		EnsureUIElement().AddHandler(element, Keyboard.PreviewKeyDownEvent, handler);
    };

    /// <summary>
    ///     Removes a handler for the PreviewKeyDown attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Keyboard.RemovePreviewKeyDownHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, Keyboard.PreviewKeyDownEvent, handler); 
    }; 

    /// <summary>
    ///     Adds a handler for the KeyDown attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Keyboard.AddKeyDownHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler)
    {
    	EnsureUIElement().AddHandler(element, Keyboard.KeyDownEvent, handler);
    } ;

    /// <summary> 
    ///     Removes a handler for the KeyDown attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Keyboard.RemoveKeyDownHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler)
    {
    	EnsureUIElement().RemoveHandler(element, Keyboard.KeyDownEvent, handler); 
    };

    /// <summary>
    ///     Adds a handler for the PreviewKeyUp attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Keyboard.AddPreviewKeyUpHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, Keyboard.PreviewKeyUpEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the PreviewKeyUp attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Keyboard.RemovePreviewKeyUpHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, Keyboard.PreviewKeyUpEvent, handler);
    };

    /// <summary>
    ///     Adds a handler for the KeyUp attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Keyboard.AddKeyUpHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler) 
    { 
    	EnsureUIElement().AddHandler(element, Keyboard.KeyUpEvent, handler);
    }; 

    /// <summary>
    ///     Removes a handler for the KeyUp attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Keyboard.RemoveKeyUpHandler = function(/*DependencyObject*/ element, /*KeyEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, Keyboard.KeyUpEvent, handler); 
    };

    /// <summary>
    ///     Adds a handler for the PreviewGotKeyboardFocus attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Keyboard.AddPreviewGotKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler) 
    {
        EnsureUIElement().AddHandler(element, Keyboard.PreviewGotKeyboardFocusEvent, handler); 
    }; 

    /// <summary> 
    ///     Removes a handler for the PreviewGotKeyboardFocus attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Keyboard.RemovePreviewGotKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler)
    { 
        EnsureUIElement().RemoveHandler(element, Keyboard.PreviewGotKeyboardFocusEvent, handler); 
    };

    /// <summary> 
    ///     Adds a handler for the PreviewKeyboardInputProviderAcquireFocus attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Keyboard.AddPreviewKeyboardInputProviderAcquireFocusHandler = function(/*DependencyObject*/ element, /*KeyboardInputProviderAcquireFocusEventHandler*/ handler)
    {
        EnsureUIElement().AddHandler(element, Keyboard.PreviewKeyboardInputProviderAcquireFocusEvent, handler); 
    };

    /// <summary> 
    ///     Removes a handler for the PreviewKeyboardInputProviderAcquireFocus attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Keyboard.RemovePreviewKeyboardInputProviderAcquireFocusHandler = function(/*DependencyObject*/ element, /*KeyboardInputProviderAcquireFocusEventHandler*/ handler)
    { 
        EnsureUIElement().RemoveHandler(element, Keyboard.PreviewKeyboardInputProviderAcquireFocusEvent, handler);
    };

    /// <summary> 
    ///     Adds a handler for the KeyboardInputProviderAcquireFocus attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Keyboard.AddKeyboardInputProviderAcquireFocusHandler = function(/*DependencyObject*/ element, /*KeyboardInputProviderAcquireFocusEventHandler*/ handler) 
    {
        EnsureUIElement().AddHandler(element, Keyboard.KeyboardInputProviderAcquireFocusEvent, handler);
    };

    /// <summary>
    ///     Removes a handler for the KeyboardInputProviderAcquireFocus attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Keyboard.RemoveKeyboardInputProviderAcquireFocusHandler = function(/*DependencyObject*/ element, /*KeyboardInputProviderAcquireFocusEventHandler*/ handler)
    {
        EnsureUIElement().RemoveHandler(element, Keyboard.KeyboardInputProviderAcquireFocusEvent, handler);
    }; 

    /// <summary>
    ///     Adds a handler for the GotKeyboardFocus attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Keyboard.AddGotKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler) 
    {
        EnsureUIElement().AddHandler(element, Keyboard.GotKeyboardFocusEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the GotKeyboardFocus attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Keyboard.RemoveGotKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler)
    { 
        EnsureUIElement().RemoveHandler(element, Keyboard.GotKeyboardFocusEvent, handler);
    };

    /// <summary> 
    ///     Adds a handler for the PreviewLostKeyboardFocus attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Keyboard.AddPreviewLostKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler)
    { 
        EnsureUIElement().AddHandler(element, Keyboard.PreviewLostKeyboardFocusEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the PreviewLostKeyboardFocus attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Keyboard.RemovePreviewLostKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler) 
    { 
        EnsureUIElement().RemoveHandler(element, Keyboard.PreviewLostKeyboardFocusEvent, handler);
    };

    /// <summary> 
    ///     Adds a handler for the LostKeyboardFocus attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Keyboard.AddLostKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler)
    { 
        EnsureUIElement().AddHandler(element, Keyboard.LostKeyboardFocusEvent, handler);
    };

    /// <summary>
    ///     Removes a handler for the LostKeyboardFocus attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that removedto this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Keyboard.RemoveLostKeyboardFocusHandler = function(/*DependencyObject*/ element, /*KeyboardFocusChangedEventHandler*/ handler) 
    {
        EnsureUIElement().RemoveHandler(element, Keyboard.LostKeyboardFocusEvent, handler); 
    };
    
    /// <summary>
    ///     Clears focus. 
    /// </summary>
//    public static void 
    Keyboard.ClearFocus = function() 
    { 
        Keyboard.PrimaryDevice.ClearFocus();
    };

    /// <summary>
    ///     Focuses the keyboard on a particular element.
    /// </summary> 
    /// <param name="element">
    ///     The element to focus the keyboard on. 
    /// </param> 
//    public static IInputElement 
    Keyboard.Focus = function(/*IInputElement*/ element)
    { 
        return Keyboard.PrimaryDevice.Focus(element);
    };

    /// <summary> 
    ///     Returns whether or not the specified key is down.
    /// </summary> 
//    public static bool 
    Keyboard.IsKeyDown = function(/*Key*/ key) 
    {
        return Keyboard.PrimaryDevice.IsKeyDown(key); 
    };

    /// <summary>
    ///     Returns whether or not the specified key is up. 
    /// </summary>
//    public static bool 
    Keyboard.IsKeyUp = function(/*Key*/ key) 
    { 
        return Keyboard.PrimaryDevice.IsKeyUp(key);
    };

    /// <summary>
    ///     Returns whether or not the specified key is toggled.
    /// </summary> 
//    public static bool 
    Keyboard.IsKeyToggled = function(/*Key*/ key)
    { 
        return Keyboard.PrimaryDevice.IsKeyToggled(key); 
    };

    /// <summary>
    ///     Returns the state of the specified key.
    /// </summary>
//    public static KeyStates 
    Keyboard.GetKeyStates = function(/*Key*/ key) 
    {
        return Keyboard.PrimaryDevice.GetKeyStates(key); 
    };
    


    // Check for Valid enum, as any int can be casted to the enum.
//    internal static bool 
    Keyboard.IsValidKey = function(/*Key*/ key) 
    {
        return (key >= Key.None && key <= Key.OemClear);
    };

    /// <SecurityNote>
    ///     Critical: This code accesses critical data(_activeSource) 
    ///     TreatAsSafe: Although it accesses critical data it does not modify or expose it, only compares against it. 
    /// </SecurityNote>
//    internal static bool 
    Keyboard.IsFocusable = function(/*DependencyObject*/ element)
    {
        // CODE
        if(element == null) 
        {
            return false; 
        }

        /*UIElement*/var uie = element instanceof EnsureUIElement() ? element : null;
        if(uie != null) 
        {
            if(uie.IsVisible == false) 
            { 
                return false;
            } 
        }

        if(element.GetValue(EnsureUIElement().IsEnabledProperty) == false)
        { 
            return false;
        } 

        // CODE
        /*bool*/var hasModifiers = false; 
        var hasModifiersOut = {
        	"hasModifiers" : hasModifiers	
        };
        /*BaseValueSourceInternal*/var valueSource = element.GetValueSource(EnsureUIElement().FocusableProperty, null, /*out hasModifiers*/hasModifiersOut);
        hasModifiers = hasModifiersOut.hasModifiers;
        /*bool*/var focusable = element.GetValue(EnsureUIElement().FocusableProperty);

        if(!focusable && valueSource == BaseValueSourceInternal.Default && !hasModifiers)
        {
            // The Focusable property was not explicitly set to anything.
            // The default value is generally false, but true in a few cases. 

            if(FocusManager.GetIsFocusScope(element)) 
            { 
                // Focus scopes are considered focusable, even if
                // the Focusable property is false. 
                return true;
            }
            else if(uie != null && uie.InternalVisualParent == null)
            { 
                /*PresentationSource*/var presentationSource = PresentationSource.CriticalFromVisual(uie);
                if(presentationSource != null) 
                { 
                    // A UIElements that is the root of a PresentationSource is considered focusable.
                    return true; 
                }
            }
        }

        return focusable;
    };
	
	Keyboard.Type = new Type("Keyboard", Keyboard, [Object.Type]);
	return Keyboard;
});

