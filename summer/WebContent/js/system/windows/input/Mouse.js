/**
 * Mouse
 */

define(["dojo/_base/declare", "system/Type", "windows/EventManager", "windows/RoutingStrategy",
        "input/QueryCursorEventHandler", "input/MouseButtonEventHandler", "input/MouseEventHandler", "input/MouseWheelEventHandler"], 
		function(declare, Type, EventManager, RoutingStrategy,
				QueryCursorEventHandler, MouseButtonEventHandler, MouseEventHandler, MouseWheelEventHandler){

	var UIElement = null;
	function EnsureUIElement(){
		if(UIElement==null){
			UIElement = using("windows/UIElement");
		}
		
		return UIElement;
	}
    
	var Mouse = declare("Mouse", null,{
		constructor:function(){

		}
	});
	
	Object.defineProperties(Mouse,{
	    /// <summary>
	    ///     The number of units the mouse wheel should be rotated to scroll one line. 
	    /// </summary>
	    /// <remarks>
	    ///     The delta was set to 120 to allow Microsoft or other vendors to
	    ///     build finer-resolution wheels in the future, including perhaps 
	    ///     a freely-rotating wheel with no notches. The expectation is
	    ///     that such a device would send more messages per rotation, but 
	    ///     with a smaller value in each message. To support this 
	    ///     possibility, you should either add the incoming delta values
	    ///     until MouseWheelDeltaForOneLine amount is reached (so for a 
	    ///     delta-rotation you get the same response), or scroll partial
	    ///     lines in response to the more frequent messages. You could also
	    ///     choose your scroll granularity and accumulate deltas until it
	    ///     is reached. 
	    /// </remarks>
//	    public const int 
	    MouseWheelDeltaForOneLine:
	    {
	    	get:function(){
	    		return 120;
	    	}
	    },
        /// <summary>
        ///     PreviewMouseMove 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseMoveEvent:
        {
        	get:function(){
        		if(Mouse._PreviewMouseMoveEvent === undefined){
        			Mouse._PreviewMouseMoveEvent = EventManager.RegisterRoutedEvent("PreviewMouseMove", RoutingStrategy.Tunnel, 
        					MouseEventHandler.Type, /*Mouse.Type*/Mouse.Type);  
        		}
        		
        		return Mouse._PreviewMouseMoveEvent;
        	}
        },
 
        /// <summary>
        ///     MouseMove
        /// </summary>
//        public static readonly RoutedEvent 
        MouseMoveEvent:
        {
        	get:function(){
        		if(Mouse._MouseMoveEvent === undefined){
        			Mouse._MouseMoveEvent = EventManager.RegisterRoutedEvent("MouseMove", RoutingStrategy.Bubble, MouseEventHandler.Type, Mouse.Type);  
        		}
        		
        		return Mouse._MouseMoveEvent;
        	}
        }, 
 
        /// <summary>
        ///     MouseDownOutsideCapturedElement 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseDownOutsideCapturedElementEvent:
        {
        	get:function(){
        		if(Mouse._PreviewMouseDownOutsideCapturedElementEvent === undefined){
        			Mouse._PreviewMouseDownOutsideCapturedElementEvent = EventManager.RegisterRoutedEvent("PreviewMouseDownOutsideCapturedElement", 
        					RoutingStrategy.Tunnel, MouseButtonEventHandler.Type, Mouse.Type);  
        		}
        		
        		return Mouse._PreviewMouseDownOutsideCapturedElementEvent;
        	}
        }, 

        /// <summary> 
        ///     MouseUpOutsideCapturedElement 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseUpOutsideCapturedElementEvent:
        {
        	get:function(){
        		if(Mouse._PreviewMouseUpOutsideCapturedElementEvent === undefined){
        			Mouse._PreviewMouseUpOutsideCapturedElementEvent = EventManager.RegisterRoutedEvent("PreviewMouseUpOutsideCapturedElement", 
        					RoutingStrategy.Tunnel, MouseButtonEventHandler.Type, Mouse.Type);   
        		}
        		
        		return Mouse._PreviewMouseUpOutsideCapturedElementEvent;
        	}
        }, 

        /// <summary> 
        ///     PreviewMouseDown
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewMouseDownEvent:
        {
        	get:function(){
        		if(Mouse._PreviewMouseDownEvent === undefined){
        			Mouse._PreviewMouseDownEvent = EventManager.RegisterRoutedEvent("PreviewMouseDown", 
        					RoutingStrategy.Tunnel, MouseButtonEventHandler.Type, Mouse.Type);   
        		}
        		
        		return Mouse._PreviewMouseDownEvent;
        	}
        }, 

        /// <summary>
        ///     MouseDown
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseDownEvent:
        {
        	get:function(){
        		if(Mouse._MouseDownEvent === undefined){
        			Mouse._MouseDownEvent = EventManager.RegisterRoutedEvent("MouseDown", RoutingStrategy.Bubble, 
        					MouseButtonEventHandler.Type, Mouse.Type); 
        		}
        		
        		return Mouse._MouseDownEvent;
        	}
        }, 

        /// <summary> 
        ///     PreviewMouseUp
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseUpEvent:
        {
        	get:function(){
        		if(Mouse._PreviewMouseUpEvent === undefined){
        			Mouse._PreviewMouseUpEvent = EventManager.RegisterRoutedEvent("PreviewMouseUp", RoutingStrategy.Tunnel, 
        					MouseButtonEventHandler.Type, Mouse.Type); 
        		}
        		
        		return Mouse._PreviewMouseUpEvent;
        	}
        }, 
 
        /// <summary> 
        ///     MouseUp
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseUpEvent:
        {
        	get:function(){
        		if(Mouse._MouseUpEvent === undefined){
        			Mouse._MouseUpEvent = EventManager.RegisterRoutedEvent("MouseUp", RoutingStrategy.Bubble, 
        					MouseButtonEventHandler.Type, Mouse.Type);  
        		}
        		
        		return Mouse._MouseUpEvent;
        	}
        }, 
 
        /// <summary>
        ///     PreviewMouseWheel 
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewMouseWheelEvent:
        {
        	get:function(){
        		if(Mouse._PreviewMouseWheelEvent === undefined){
        			Mouse._PreviewMouseWheelEvent = EventManager.RegisterRoutedEvent("PreviewMouseWheel", RoutingStrategy.Tunnel, 
        					MouseWheelEventHandler.Type, Mouse.Type);  
        		}
        		
        		return Mouse._PreviewMouseWheelEvent;
        	}
        }, 

        /// <summary>
        ///     MouseWheel 
        /// </summary>
//        public static readonly RoutedEvent 
        MouseWheelEvent:
        {
        	get:function(){
        		if(Mouse._MouseWheelEvent === undefined){
        			Mouse._MouseWheelEvent = EventManager.RegisterRoutedEvent("MouseWheel", RoutingStrategy.Bubble, 
        					MouseWheelEventHandler.Type, Mouse.Type); 
        		}
        		
        		return Mouse._MouseWheelEvent;
        	}
        },  
 
        /// <summary>
        ///     MouseEnter
        /// </summary>
//        public static readonly RoutedEvent 
        MouseEnterEvent:
        {
        	get:function(){
        		if(Mouse._MouseEnterEvent === undefined){
        			Mouse._MouseEnterEvent = EventManager.RegisterRoutedEvent("MouseEnter", RoutingStrategy.Direct, 
        					MouseEventHandler.Type, Mouse.Type);   
        		}
        		
        		return Mouse._MouseEnterEvent;
        	}
        }, 
 
        /// <summary>
        ///     MouseLeave 
        /// </summary>
//        public static readonly RoutedEvent 
        MouseLeaveEvent:
        {
        	get:function(){
        		if(Mouse._MouseLeaveEvent === undefined){
        			Mouse._MouseLeaveEvent = EventManager.RegisterRoutedEvent("MouseLeave", RoutingStrategy.Direct, 
        					MouseEventHandler.Type, Mouse.Type);  
        		}
        		
        		return Mouse._MouseLeaveEvent;
        	}
        }, 

        /// <summary> 
        ///     GotMouseCapture 
        /// </summary>
//        public static readonly RoutedEvent 
        GotMouseCaptureEvent:
        {
        	get:function(){
        		if(Mouse._GotMouseCaptureEvent === undefined){
        			Mouse._GotMouseCaptureEvent = EventManager.RegisterRoutedEvent("GotMouseCapture", RoutingStrategy.Bubble, 
        					MouseEventHandler.Type, Mouse.Type);   
        		}
        		
        		return Mouse._GotMouseCaptureEvent;
        	}
        }, 

        /// <summary> 
        ///     LostMouseCapture
        /// </summary> 
//        public static readonly RoutedEvent 
        LostMouseCaptureEvent:
        {
        	get:function(){
        		if(Mouse._LostMouseCaptureEvent === undefined){
        			Mouse._LostMouseCaptureEvent = EventManager.RegisterRoutedEvent("LostMouseCapture", RoutingStrategy.Bubble, 
        					MouseEventHandler.Type, Mouse.Type);   
        		}
        		
        		return Mouse._LostMouseCaptureEvent;
        	}
        }, 

        /// <summary>
        ///     QueryCursor
        /// </summary> 
//        public static readonly RoutedEvent 
        QueryCursorEvent:
        {
        	get:function(){
        		if(Mouse._QueryCursorEvent === undefined){
        			Mouse._QueryCursorEvent = EventManager.RegisterRoutedEvent("QueryCursor", RoutingStrategy.Bubble, 
        					QueryCursorEventHandler.Type, Mouse.Type); 
        		}
        		
        		return Mouse._QueryCursorEvent;
        	}
        }, 
        
        /// <summary> 
        ///     Returns the element that the mouse is over.
        /// </summary>
        /// <remarks>
        ///     This will be true if the element has captured the mouse. 
        /// </remarks>
//        public static IInputElement 
        DirectlyOver: 
        { 
            get:function()
            { 

                return Mouse.PrimaryDevice.DirectlyOver;

            } 
        },
 
        /// <summary> 
        ///     Returns the element that has captured the mouse.
        /// </summary> 
//        public static IInputElement 
        Captured:
        {
            get:function()
            { 
                return Mouse.PrimaryDevice.Captured;
            } 
        },

        /// <summary> 
        ///     Returns the element that has captured the mouse.
        /// </summary>
//        internal static CaptureMode 
        CapturedMode:
        { 
            get:function()
            { 
                return Mouse.PrimaryDevice.CapturedMode; 
            }
        },
        
        /// <summary> 
        ///     The state of the left button.
        /// </summary>
//        public static MouseButtonState 
        LeftButton:
        { 
            get:function()
            { 
                return Mouse.PrimaryDevice.LeftButton; 
            }
        },

        /// <summary>
        ///     The state of the right button.
        /// </summary> 
//        public static MouseButtonState 
        RightButton:
        { 
            get:function() 
            {
                return Mouse.PrimaryDevice.RightButton; 
            }
        },

        /// <summary> 
        ///     The state of the middle button.
        /// </summary> 
//        public static MouseButtonState 
        MiddleButton:
        {
            get:function() 
            {
                return Mouse.PrimaryDevice.MiddleButton;
            }
        },
 
        /// <summary>
        ///     The primary mouse device. 
        /// </summary>
        /// <SecurityNote>
        ///     Critical: This code acceses InputManager which is critical
        ///     PublicOK: This data is ok to expose 
        /// </SecurityNote>
//        public static MouseDevice 
        PrimaryDevice: 
        { 
            get:function() 
            {
                /*MouseDevice*/var mouseDevice;
                //there is a link demand on the Current property
                mouseDevice =  InputManager.UnsecureCurrent.PrimaryMouseDevice; 
                return mouseDevice;
            } 
        } 

	});
	
    /// <summary>
    ///     Calculates the position of the mouse relative to
    ///     a particular element.
    /// </summary> 
//    public static Point 
	Mouse.GetPosition = function(/*IInputElement*/ relativeTo)
    { 
//        return Mouse.PrimaryDevice.GetPosition(relativeTo); 
    };
	

    /// <summary>
    ///     Adds a handler for the PreviewMouseMove attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddPreviewMouseMoveHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, Mouse.PreviewMouseMoveEvent, handler); 
    };

    /// <summary> 
    ///     Removes a handler for the PreviewMouseMove attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemovePreviewMouseMoveHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.PreviewMouseMoveEvent, handler); 
    };


    /// <summary> 
    ///     Adds a handler for the MouseMove attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddMouseMoveHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    {
    	EnsureUIElement().AddHandler(element, Mouse.MouseMoveEvent, handler); 
    };

    /// <summary> 
    ///     Removes a handler for the MouseMove attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that removedto this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemoveMouseMoveHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.MouseMoveEvent, handler);
    };


    /// <summary> 
    ///     Adds a handler for the PreviewMouseDownOutsideCapturedElement attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddPreviewMouseDownOutsideCapturedElementHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, Mouse.PreviewMouseDownOutsideCapturedElementEvent, handler);
    };

    /// <summary>
    ///     Removes a handler for the MouseDownOutsideCapturedElement attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemovePreviewMouseDownOutsideCapturedElementHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    {
    	EnsureUIElement().RemoveHandler(element, Mouse.PreviewMouseDownOutsideCapturedElementEvent, handler);
    };


    /// <summary>
    ///     Adds a handler for the MouseUpOutsideCapturedElement attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Mouse.AddPreviewMouseUpOutsideCapturedElementHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, Mouse.PreviewMouseUpOutsideCapturedElementEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the MouseUpOutsideCapturedElement attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemovePreviewMouseUpOutsideCapturedElementHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.PreviewMouseUpOutsideCapturedElementEvent, handler);
    };

    /// <summary> 
    ///     Adds a handler for the PreviewMouseDown attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Mouse.AddPreviewMouseDownHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, Mouse.PreviewMouseDownEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the PreviewMouseDown attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemovePreviewMouseDownHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler) 
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.PreviewMouseDownEvent, handler);
    }; 

    /// <summary> 
    ///     Adds a handler for the MouseDown attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddMouseDownHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, Mouse.MouseDownEvent, handler);
    }; 

    /// <summary>
    ///     Removes a handler for the MouseDown attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemoveMouseDownHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, Mouse.MouseDownEvent, handler); 
    }; 

    /// <summary>
    ///     Adds a handler for the PreviewMouseUp attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Mouse.AddPreviewMouseUpHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    {
    	EnsureUIElement().AddHandler(element, Mouse.PreviewMouseUpEvent, handler);
    }; 

    /// <summary> 
    ///     Removes a handler for the PreviewMouseUp attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemovePreviewMouseUpHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    {
    	EnsureUIElement().RemoveHandler(element, Mouse.PreviewMouseUpEvent, handler); 
    };

    /// <summary>
    ///     Adds a handler for the MouseUp attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Mouse.AddMouseUpHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, Mouse.MouseUpEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the MouseUp attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemoveMouseUpHandler = function(/*DependencyObject*/ element, /*MouseButtonEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, Mouse.MouseUpEvent, handler);
    };

    /// <summary>
    ///     Adds a handler for the PreviewMouseWheel attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddPreviewMouseWheelHandler = function(/*DependencyObject*/ element, /*MouseWheelEventHandler*/ handler) 
    { 
    	EnsureUIElement().AddHandler(element, Mouse.PreviewMouseWheelEvent, handler);
    };

    /// <summary>
    ///     Removes a handler for the PreviewMouseWheel attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemovePreviewMouseWheelHandler = function(/*DependencyObject*/ element, /*MouseWheelEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, Mouse.PreviewMouseWheelEvent, handler); 
    };

    /// <summary>
    ///     Adds a handler for the MouseWheel attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddMouseWheelHandler = function(/*DependencyObject*/ element, /*MouseWheelEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, Mouse.MouseWheelEvent, handler); 
    }; 

    /// <summary> 
    ///     Removes a handler for the MouseWheel attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemoveMouseWheelHandler = function(/*DependencyObject*/ element, /*MouseWheelEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.MouseWheelEvent, handler); 
    };

    /// <summary> 
    ///     Adds a handler for the MouseEnter attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddMouseEnterHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    {
    	EnsureUIElement().AddHandler(element, Mouse.MouseEnterEvent, handler); 
    };

    /// <summary> 
    ///     Removes a handler for the MouseEnter attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemoveMouseEnterHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, MouseEnterEvent, handler);
    }; 

    /// <summary> 
    ///     Adds a handler for the MouseLeave attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddMouseLeaveHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, Mouse.MouseLeaveEvent, handler);
    };

    /// <summary>
    ///     Removes a handler for the MouseLeave attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemoveMouseLeaveHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    {
    	EnsureUIElement().RemoveHandler(element, Mouse.MouseLeaveEvent, handler);
    }; 

    /// <summary>
    ///     Adds a handler for the GotMouseCapture attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Mouse.AddGotMouseCaptureHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, Mouse.GotMouseCaptureEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the GotMouseCapture attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    Mouse.RemoveGotMouseCaptureHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.GotMouseCaptureEvent, handler);
    };

    /// <summary> 
    ///     Adds a handler for the LostMouseCapture attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    Mouse.AddLostMouseCaptureHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, Mouse.LostMouseCaptureEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the LostMouseCapture attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemoveLostMouseCaptureHandler = function(/*DependencyObject*/ element, /*MouseEventHandler*/ handler) 
    { 
    	EnsureUIElement().RemoveHandler(element, Mouse.LostMouseCaptureEvent, handler);
    }; 

    /// <summary> 
    ///     Adds a handler for the QueryCursor attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    Mouse.AddQueryCursorHandler = function(/*DependencyObject*/ element, /*QueryCursorEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, Mouse.QueryCursorEvent, handler);
    }; 

    /// <summary>
    ///     Removes a handler for the QueryCursor attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    Mouse.RemoveQueryCursorHandler = function(/*DependencyObject*/ element, /*QueryCursorEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, QueryCursorEvent, handler); 
    };
    
    /// <summary>
    ///     Captures the mouse to a particular element.
    /// </summary> 
    /// <param name="element">
    ///     The element to capture the mouse to. 
    /// </param> 
////    public static bool 
//    Mouse.Capture = function(/*IInputElement*/ element)
//    { 
//        return Mouse.PrimaryDevice.Capture(element);
//    };

    /// <summary> 
    ///     Captures the mouse to a particular element.
    /// </summary> 
    /// <param name="element"> 
    ///     The element to capture the mouse to.
    /// </param> 
    /// <param name="captureMode">
    ///     The kind of capture to acquire.
    /// </param>
//    public static bool 
    Mouse.Capture = function(/*IInputElement*/ element, /*CaptureMode*/ captureMode) 
    {
        return Mouse.PrimaryDevice.Capture(element, captureMode); 
    };
    
    
	
	Mouse.Type = new Type("Mouse", Mouse, [Object.Type]);
	return Mouse;
});
//    /// <summary>
//    ///     The Mouse class represents the mouse device to the
//    ///     members of a context. 
//    /// </summary>
//    /// <remarks> 
//    ///     The static members of this class simply delegate to the primary 
//    ///     mouse device of the calling thread's input manager.
//    /// </remarks> 
//    public static class Mouse
//    {
//
//
//  
//
//        /// <summary> 
//        ///     Retrieves the history of intermediate Points up to 64 previous coordinates of the mouse or pen.
//        /// </summary>
//        /// <param name="relativeTo">
//        ///     The element relative which the points need to be returned. 
//        /// </param>
//        /// <param name="points"> 
//        ///     Points relative to the first parameter are returned. 
//        /// </param>
//        /// <SecurityNote> 
//        ///     Critical: calls critical method (GetInputProvider) and gets PresentationSource.
//        ///               PublicOK: The PresentationSource and input provider aren't
//        ///               returned or stored.
//        /// </SecurityNote> 
//        public static int GetIntermediatePoints(IInputElement relativeTo, Point[] points) 
//        { 
//            // Security Mitigation: do not give out input state if the device is not active.
//            if(Mouse.PrimaryDevice.IsActive) 
//            {
//                if (relativeTo != null)
//                {
//                    PresentationSource inputSource = PresentationSource.FromDependencyObject(InputElement.GetContainingVisual(relativeTo as DependencyObject)); 
//                    if (inputSource != null)
//                    { 
//                        IMouseInputProvider mouseInputProvider = inputSource.GetInputProvider(typeof(MouseDevice)) as IMouseInputProvider; 
//                        if (null != mouseInputProvider)
//                        { 
//                            return mouseInputProvider.GetIntermediatePoints(relativeTo, points);
//                        }
//                    }
//                } 
//            }
//            return -1; 
//        } 
//
//        /// <summary> 
//        /// The override cursor
//        /// </summary>
//        public static Cursor OverrideCursor
//        { 
//            get
//            { 
//                return Mouse.PrimaryDevice.OverrideCursor; 
//            }
// 
//            set
//            {
//                // forwarding to the MouseDevice, will be validated there.	
//                Mouse.PrimaryDevice.OverrideCursor = value; 
//            }
//        } 
// 
//        /// <summary>
//        ///     Sets the mouse cursor 
//        /// </summary>
//        /// <param name="cursor">The cursor to be set</param>
//        /// <returns>True on success (always the case for Win32)</returns>
//        public static bool SetCursor(Cursor cursor) 
//        {
//            return Mouse.PrimaryDevice.SetCursor(cursor); 
//        } 
//
//
// 
//        /// <summary>
//        ///     Calculates the position of the mouse relative to
//        ///     a particular element.
//        /// </summary> 
//        public static Point GetPosition(IInputElement relativeTo)
//        { 
//            return Mouse.PrimaryDevice.GetPosition(relativeTo); 
//        }
// 
//        /// <summary>
//        ///     Forces the mouse to resynchronize.
//        /// </summary>
//        public static void Synchronize() 
//        {
//            Mouse.PrimaryDevice.Synchronize(); 
//        } 
//
//        /// <summary> 
//        ///     Forces the mouse cursor to be updated.
//        /// </summary>
//        public static void UpdateCursor()
//        { 
//            Mouse.PrimaryDevice.UpdateCursor();
//        } 


