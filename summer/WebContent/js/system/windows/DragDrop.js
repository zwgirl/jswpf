/**
 * DragDrop
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutingStrategy", "windows/EventManager",
        "windows/GiveFeedbackEventHandler", "windows/DragEventHandler", "windows/QueryContinueDragEventHandler"], 
		function(declare, Type, RoutingStrategy, EventManager,  
				GiveFeedbackEventHandler, DragEventHandler, QueryContinueDragEventHandler){
	var UIElement = null;
	function EnsureUIElement(){
		if(UIElement == null){
			UIElement = using("windows/UIElement");
		}
		
		return UIElement;
	}
	
	var DragDrop = declare("DragDrop", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(DragDrop.prototype,{
		  
	});
	
	Object.defineProperties(DragDrop,{
		 /// <summary> 
        /// PreviewQueryContinueDrag 
        /// </summary>
//        public static readonly RoutedEvent 
		PreviewQueryContinueDragEvent:
        {
        	get:function(){
        		if(DragDrop._PreviewQueryContinueDragEvent === undefined){
        			DragDrop._PreviewQueryContinueDragEvent = EventManager.RegisterRoutedEvent("PreviewQueryContinueDrag", 
        	        		RoutingStrategy.Tunnel, 
        	        		QueryContinueDragEventHandler.Type, 
        	        		DragDrop.Type);   
        		}
        		
        		return DragDrop._PreviewQueryContinueDragEvent;
        	}
        },  

        /// <summary> 
        /// QueryContinueDrag
        /// </summary> 
//        public static readonly RoutedEvent 
		QueryContinueDragEvent:
        {
        	get:function(){
        		if(DragDrop._QueryContinueDragEvent === undefined){
        			DragDrop._QueryContinueDragEvent = EventManager.RegisterRoutedEvent("QueryContinueDrag", 
        	        		RoutingStrategy.Bubble, 
        	        		QueryContinueDragEventHandler.Type, 
        	        		DragDrop.Type);   
        		}
        		
        		return DragDrop._QueryContinueDragEvent;
        	}
        }, 

        /// <summary>
        /// PreviewGiveFeedback
        /// </summary> 
//        public static readonly RoutedEvent 
		PreviewGiveFeedbackEvent:
        {
        	get:function(){
        		if(DragDrop._PreviewGiveFeedbackEvent === undefined){
        			DragDrop._PreviewGiveFeedbackEvent = EventManager.RegisterRoutedEvent("PreviewGiveFeedback", 
        	        		RoutingStrategy.Tunnel, 
        	        		GiveFeedbackEventHandler.Type, 
        	        		DragDrop.Type);  
        		}
        		
        		return DragDrop._PreviewGiveFeedbackEvent;
        	}
        }, 

        /// <summary> 
        /// GiveFeedback
        /// </summary>
//        public static readonly RoutedEvent 
		GiveFeedbackEvent:
        {
        	get:function(){
        		if(DragDrop._GiveFeedbackEvent === undefined){
        			DragDrop._GiveFeedbackEvent = EventManager.RegisterRoutedEvent("GiveFeedback", RoutingStrategy.Bubble, 
        	        		GiveFeedbackEventHandler.Type, 
        	        		DragDrop.Type);  
        		}
        		
        		return DragDrop._GiveFeedbackEvent;
        	}
        }, 
 
        /// <summary> 
        /// PreviewDragEnter
        /// </summary> 
//        public static readonly RoutedEvent 
		PreviewDragEnterEvent:
        {
        	get:function(){
        		if(DragDrop._PreviewDragEnterEvent === undefined){
        			DragDrop._PreviewDragEnterEvent = EventManager.RegisterRoutedEvent("PreviewDragEnter", RoutingStrategy.Tunnel, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type);  
        		}
        		
        		return DragDrop._PreviewDragEnterEvent;
        	}
        }, 
 
        /// <summary>
        /// DragEnter 
        /// </summary> 
//        public static readonly RoutedEvent 
		DragEnterEvent:
        {
        	get:function(){
        		if(DragDrop._DragEnterEvent === undefined){
        			DragDrop._DragEnterEvent = EventManager.RegisterRoutedEvent("DragEnter", RoutingStrategy.Bubble,
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type); 
        		}
        		
        		return DragDrop._DragEnterEvent;
        	}
        }, 

        /// <summary>
        /// PreviewDragOver 
        /// </summary>
//        public static readonly RoutedEvent 
		PreviewDragOverEvent:
        {
        	get:function(){
        		if(DragDrop._PreviewDragOverEvent === undefined){
        			DragDrop._PreviewDragOverEvent = EventManager.RegisterRoutedEvent("PreviewDragOver", RoutingStrategy.Tunnel, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type);  
        		}
        		
        		return DragDrop._PreviewDragOverEvent;
        	}
        }, 
 
        /// <summary>
        /// DragOver
        /// </summary>
//        public static readonly RoutedEvent 
		DragOverEvent:
        {
        	get:function(){
        		if(DragDrop._DragOverEvent === undefined){
        			DragDrop._DragOverEvent = EventManager.RegisterRoutedEvent("DragOver", RoutingStrategy.Bubble, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type);    
        		}
        		
        		return DragDrop._DragOverEvent;
        	}
        }, 
 
        /// <summary>
        /// PreviewDragLeave 
        /// </summary>
//        public static readonly RoutedEvent 
		PreviewDragLeaveEvent:
        {
        	get:function(){
        		if(DragDrop._PreviewDragLeaveEvent === undefined){
        			DragDrop._PreviewDragLeaveEvent = EventManager.RegisterRoutedEvent("PreviewDragLeave", 
        	        		RoutingStrategy.Tunnel, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type); 
        		}
        		
        		return DragDrop._PreviewDragLeaveEvent;
        	}
        }, 


        /// <summary> 
        /// DragLeave 
        /// </summary>
//        public static readonly RoutedEvent 
		DragLeaveEvent:
        {
        	get:function(){
        		if(DragDrop._DragLeaveEvent === undefined){
        			DragDrop._DragLeaveEvent = EventManager.RegisterRoutedEvent("DragLeave", 
        	        		RoutingStrategy.Bubble, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type);   
        		}
        		
        		return DragDrop._DragLeaveEvent;
        	}
        }, 

        /// <summary> 
        /// PreviewDrop
        /// </summary> 
//        public static readonly RoutedEvent 
		PreviewDropEvent:
        {
        	get:function(){
        		if(DragDrop._PreviewDropEvent === undefined){
        			DragDrop._PreviewDropEvent = EventManager.RegisterRoutedEvent("PreviewDrop", RoutingStrategy.Tunnel, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type);   
        		}
        		
        		return DragDrop._PreviewDropEvent;
        	}
        }, 

        /// <summary>
        /// Drop
        /// </summary> 
//        public static readonly RoutedEvent 
		DropEvent:
        {
        	get:function(){
        		if(DragDrop._DropEvent === undefined){
        			DragDrop._DropEvent = EventManager.RegisterRoutedEvent("Drop", RoutingStrategy.Bubble, 
        	        		DragEventHandler.Type, 
        	        		DragDrop.Type);   
        		}
        		
        		return DragDrop._DropEvent;
        	}
        }, 

//        internal static readonly RoutedEvent 
		DragDropStartedEvent:
        {
        	get:function(){
        		if(DragDrop._DragDropStartedEvent === undefined){
        			DragDrop._DragDropStartedEvent = EventManager.RegisterRoutedEvent("DragDropStarted", 
        					RoutingStrategy.Bubble, 
        					RoutedEventHandler.Type, 
        					DragDrop.Type);   
        		}
        		
        		return DragDrop._DragDropStartedEvent;
        	}
        },  
//        internal static readonly RoutedEvent 
		DragDropCompletedEvent:
        {
        	get:function(){
        		if(DragDrop._DragDropCompletedEvent === undefined){
        			DragDrop._DragDropCompletedEvent = EventManager.RegisterRoutedEvent("DragDropCompleted", 
        					RoutingStrategy.Bubble, 
        					RoutedEventHandler.Type, 
        					DragDrop.Type);   
        		}
        		
        		return DragDrop._DragDropCompletedEvent;
        	}
        }, 
		  
	});

    /// <summary>
    /// Adds a handler for the PreviewQueryContinueDrag attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
	DragDrop.AddPreviewQueryContinueDragHandler = function(/*DependencyObject*/ element, /*QueryContinueDragEventHandler*/ handler) 
    {
        EnsureUIElement().AddHandler(element, DragDrop.PreviewQueryContinueDragEvent, handler); 
    };

    /// <summary>
    /// Removes a handler for the PreviewQueryContinueDrag attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    DragDrop.RemovePreviewQueryContinueDragHandler = function(/*DependencyObject*/ element, /*QueryContinueDragEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, DragDrop.PreviewQueryContinueDragEvent, handler);
    };

    /// <summary> 
    /// Adds a handler for the QueryContinueDrag attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    DragDrop.AddQueryContinueDragHandler = function(/*DependencyObject*/ element, /*QueryContinueDragEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, DragDrop.QueryContinueDragEvent, handler); 
    };

    /// <summary>
    /// Removes a handler for the QueryContinueDrag attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemoveQueryContinueDragHandler = function(/*DependencyObject*/ element, /*QueryContinueDragEventHandler*/ handler) 
    { 
    	EnsureUIElement().RemoveHandler(element, DragDrop.QueryContinueDragEvent, handler);
    }; 

    /// <summary> 
    /// Adds a handler for the PreviewGiveFeedback attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    DragDrop.AddPreviewGiveFeedbackHandler = function(/*DependencyObject*/ element, /*GiveFeedbackEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, DragDrop.PreviewGiveFeedbackEvent, handler);
    }; 

    /// <summary>
    /// Removes a handler for the PreviewGiveFeedback attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemovePreviewGiveFeedbackHandler = function(/*DependencyObject*/ element, /*GiveFeedbackEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, DragDrop.PreviewGiveFeedbackEvent, handler); 
    }; 

    /// <summary>
    /// Adds a handler for the GiveFeedback attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    DragDrop.AddGiveFeedbackHandler = function(/*DependencyObject*/ element, /*GiveFeedbackEventHandler*/ handler)
    {
    	EnsureUIElement().AddHandler(element, DragDrop.GiveFeedbackEvent, handler);
    }; 

    /// <summary> 
    /// Removes a handler for the GiveFeedback attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemoveGiveFeedbackHandler = function(/*DependencyObject*/ element, /*GiveFeedbackEventHandler*/ handler)
    {
    	EnsureUIElement().RemoveHandler(element, DragDrop.GiveFeedbackEvent, handler); 
    };

    /// <summary>
    /// Adds a handler for the PreviewDragEnter attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    DragDrop.AddPreviewDragEnterHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, DragDrop.PreviewDragEnterEvent, handler);
    };

    /// <summary> 
    /// Removes a handler for the PreviewDragEnter attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemovePreviewDragEnterHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, DragDrop.PreviewDragEnterEvent, handler);
    };

    /// <summary>
    /// Adds a handler for the DragEnter attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    DragDrop.AddDragEnterHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    { 
    	EnsureUIElement().AddHandler(element, DragDrop.DragEnterEvent, handler);
    }; 

    /// <summary>
    /// Removes a handler for the DragEnter attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    DragDrop.RemoveDragEnterHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, DragDrop.DragEnterEvent, handler); 
    };

    /// <summary>
    /// Adds a handler for the PreviewDragOver attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    DragDrop.AddPreviewDragOverHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, DragDrop.PreviewDragOverEvent, handler); 
    }; 

    /// <summary> 
    /// Removes a handler for the PreviewDragOver attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    DragDrop.RemovePreviewDragOverHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, DragDrop.PreviewDragOverEvent, handler); 
    };

    /// <summary> 
    /// Adds a handler for the DragOver attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    DragDrop.AddDragOverHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    {
    	EnsureUIElement().AddHandler(element, DragDrop.DragOverEvent, handler); 
    };

    /// <summary> 
    /// Removes a handler for the DragOver attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemoveDragOverHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, DragOverEvent, handler);
    }; 

    /// <summary> 
    /// Adds a handler for the PreviewDragLeave attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    DragDrop.AddPreviewDragLeaveHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, PreviewDragLeaveEvent, handler);
    };

    /// <summary>
    /// Removes a handler for the PreviewDragLeave attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    DragDrop.RemovePreviewDragLeaveHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    {
    	EnsureUIElement().RemoveHandler(element, PreviewDragLeaveEvent, handler);
    }; 

    /// <summary>
    /// Adds a handler for the DragLeave attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    DragDrop.AddDragLeaveHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    {
    	EnsureUIElement().AddHandler(element, DragLeaveEvent, handler); 
    };

    /// <summary>
    /// Removes a handler for the DragLeave attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void 
    DragDrop.RemoveDragLeaveHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    { 
    	EnsureUIElement().RemoveHandler(element, DragDrop.DragLeaveEvent, handler);
    };

    /// <summary> 
    /// Adds a handler for the PreviewDrop attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    DragDrop.AddPreviewDropHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, DragDrop.PreviewDropEvent, handler); 
    };

    /// <summary>
    /// Removes a handler for the PreviewDrop attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemovePreviewDropHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    { 
    	EnsureUIElement().RemoveHandler(element, DragDrop.PreviewDropEvent, handler);
    }; 

    /// <summary> 
    /// Adds a handler for the Drop attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
//    public static void 
    DragDrop.AddDropHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler)
    { 
    	EnsureUIElement().AddHandler(element, DragDrop.DropEvent, handler);
    }; 

    /// <summary>
    /// Removes a handler for the Drop attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    DragDrop.RemoveDropHandler = function(/*DependencyObject*/ element, /*DragEventHandler*/ handler) 
    {
    	EnsureUIElement().RemoveHandler(element, DragDrop.DropEvent, handler); 
    }; 
    
    /// <summary> 
    /// Begins a drag-and-drop operation.
    /// </summary> 
    /// <param name="dragSource"> 
    /// The drag source object.
    /// </param> 
    /// <param name="data">
    /// The data to drag.
    /// </param>
    /// <param name="allowedEffects"> 
    /// The allowed effects that is one of the DragDropEffects values.
    /// </param> 
    /// <remarks> 
    /// Requires UnmanagedCode permission.
    /// If caller does not have this permission, the dragdrop will not occur. 
    /// </remarks>
    /// <SecurityNote>
    /// Critical - calls critical code (OleDoDragDrop), but this is OK since we won't
    ///            allow the initiate DragDrop operation without the unmanaged code permission. 
    ///            Demand the unmanaged code permission to block initiating DragDrop both
    ///            intranet and internet zone. 
    /// PublicOK - It's disabled in partial trust. 
    /// </SecurityNote>
//    public static DragDropEffects 
    DragDrop.DoDragDrop = function(/*DependencyObject*/ dragSource, /*object*/ data, /*DragDropEffects*/ allowedEffects)
    {
        /*DataObject*/var dataObject;

        // Demand the unmanaged code permission to initiate DragDrop operation.
        SecurityHelper.DemandUnmanagedCode(); 

        if (dragSource == null)
        { 
            throw new ArgumentNullException("dragSource");
        }

        if (data == null) 
        {
            throw new ArgumentNullException("data"); 
        } 

        var args = new RoutedEventArgs(DragDropStartedEvent, dragSource); 

        // Raise the DragDropStarted internal event(Bubble).
//        if (dragSource instanceof UIElement)
//        { 
//            ((UIElement)dragSource).RaiseEvent(args);
//        } 
//        else if (dragSource is ContentElement) 
//        {
//            ((ContentElement)dragSource).RaiseEvent(args); 
//        }
//        else if (dragSource is UIElement3D)
//        {
//            ((UIElement3D)dragSource).RaiseEvent(args); 
//        }
//        else 
//        { 
//            throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "dragSource");
//        } 
        dragSource.RaiseEvent(args);

        dataObject = data instanceof DataObject ? data : null;

        if (dataObject == null) 
        {
            // Create DataObject for DragDrop from the data. 
            dataObject = new DataObject(data); 
        }

        // Call OleDoDragDrop with DataObject.
        /*DragDropEffects*/var ret = OleDoDragDrop(dragSource, dataObject, allowedEffects);

        args = new RoutedEventArgs(DragDropCompletedEvent, dragSource); 

        // Raise the DragDropCompleted internal event(Bubble). 
//        if (dragSource is UIElement) 
//        {
//            ((UIElement)dragSource).RaiseEvent(args); 
//        }
//        else if (dragSource is ContentElement)
//        {
//            ((ContentElement)dragSource).RaiseEvent(args); 
//        }
//        else if (dragSource is UIElement3D) 
//        { 
//            ((UIElement3D)dragSource).RaiseEvent(args);
//        } 
//        else
//        {
//            throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "dragSource");
//        } 
        dragSource.RaiseEvent(args);

        return ret; 
    };

    /// <summary>
    /// Register the drop target which want to a droppable window.
    /// </summary>
    /// <param name="windowHandle"> 
    /// The window handle to be drop target .
    /// </param> 
    /// <SecurityNote> 
    /// Critical - calls critical code (OleRegisterDragDrop), and potentially deals with unmanged code..
    /// 
    /// TreatAsSafe - RegisterDropTarget check the unmanged code permission.
    ///               Demmand the unmanaged code permission to block the register drop target
    ///               both intranet and internet zone.
    /// </SecurityNote> 
//    internal static void 
    DragDrop.RegisterDropTarget = function(/*IntPtr*/ windowHandle) 
    { 
        if (SecurityHelper.CheckUnmanagedCodePermission() && windowHandle != IntPtr.Zero)
        { 
            // Create OleDragSource and call Ole DoDragDrop for starting DragDrop.
            var oleDropTarget = new OleDropTarget(windowHandle);

            // Call OLE RegisterDragDrop and it will get the drop target events during drag-and-drop 
            // operation on the drop target window.
            OleServicesContext.CurrentOleServicesContext.OleRegisterDragDrop( 
                new HandleRef(null, windowHandle), 
                oleDropTarget);
        } 
    };

    /// <summary>
    /// Revoke the drop target which was a droppable window. 
    /// </summary>
    /// <param name="windowHandle"> 
    /// The window handle that can accept drop. 
    /// </param>
    /// <SecurityNote> 
    /// Critical - calls critical code (OleRevokeDragDrop).We do not want this called excessively
    /// TreatAsSafe - RevokeDropTarget check the unmanged code permission.
    ///               Demmand the unmanaged code permission to block the revoke drop target
    ///               both intranet and internet zone. 
    /// </SecurityNote>
//    internal static void 
    DragDrop.RevokeDropTarget = function(/*IntPtr*/ windowHandle) 
    {
        if (SecurityHelper.CheckUnmanagedCodePermission() && windowHandle != IntPtr.Zero) 
        {
            // Call OLE RevokeDragDrop to revoke the droppable target window.
            OleServicesContext.CurrentOleServicesContext.OleRevokeDragDrop(
                new HandleRef(null, windowHandle)); 
        }
    };

    /// <summary>
    /// Validate the dragdrop effects of DragDrop. 
    /// </summary>
//    internal static bool 
    DragDrop.IsValidDragDropEffects = function(/*DragDropEffects*/ dragDropEffects)
    {
        var dragDropEffectsAll; 

        dragDropEffectsAll = (int)(DragDropEffects.None | 
                                   DragDropEffects.Copy | 
                                   DragDropEffects.Move |
                                   DragDropEffects.Link | 
                                   DragDropEffects.Scroll |
                                   DragDropEffects.All);

        if ((dragDropEffects & ~dragDropEffectsAll) != 0) 
        {
            return false; 
        } 

        return true; 
    };

    /// <summary>
    /// Validate the drag action of DragDrop. 
    /// </summary>
//    internal static bool 
    DragDrop.IsValidDragAction = function(/*DragAction*/ dragAction) 
    { 
        if (dragAction == DragAction.Continue ||
            dragAction == DragAction.Drop || 
            dragAction == DragAction.Cancel)
        {
            return true;
        } 
        else
        { 
            return false; 
        }
    }; 

    /// <summary>
    /// Validate the key states of DragDrop.
    /// </summary> 
//    internal static bool 
    DragDrop.IsValidDragDropKeyStates = function(/*DragDropKeyStates*/ dragDropKeyStates)
    { 
        var keyStatesAll; 

        keyStatesAll = (DragDropKeyStates.LeftMouseButton | 
                             DragDropKeyStates.RightMouseButton |
                             DragDropKeyStates.ShiftKey |
                             DragDropKeyStates.ControlKey |
                             DragDropKeyStates.MiddleMouseButton | 
                             DragDropKeyStates.AltKey);

        if ((dragDropKeyStates & ~keyStatesAll) != 0) 
        {
            return false; 
        }

        return true;
    };
    /// <summary> 
    /// Begins a drag-and-drop operation through OLE DoDragDrop.
    /// </summary> 
    /// <param name="dragSource">
    /// The drag source object.
    /// </param>
    /// <param name="dataObject"> 
    /// The data object to drag.
    /// </param> 
    /// <param name="allowedEffects"> 
    /// The allowed effects that is one of the DragDropEffects values.
    /// </param> 
//    private static DragDropEffects 
    function OleDoDragDrop(/*DependencyObject*/ dragSource, /*DataObject*/ dataObject, /*DragDropEffects*/ allowedEffects)
    {
        /*int[]*/var dwEffect; 
        /*OleDragSource*/var oleDragSource;

//        Debug.Assert(dragSource != null, "Invalid dragSource"); 
//        Debug.Assert(dataObject != null, "Invalid dataObject");

        // Create the int array for passing parameter of OLE DoDragDrop
        dwEffect = [];//new int[1];

        // Create OleDragSource and call Ole DoDragDrop for starting DragDrop. 
        oleDragSource = new OleDragSource(dragSource);

        // Call OLE DoDragDrop and it will hanlde all mouse and keyboard input until drop the object. 
        // We don't need to check the error return since PreserveSig attribute is defined as "false"
        // which will pops up the exception automatically. 
        OleServicesContext.CurrentOleServicesContext.OleDoDragDrop(
                                                        /*(IComDataObject)*/dataObject,
                                                        oleDragSource,
                                                        allowedEffects, 
                                                        dwEffect);

        // return the drop effect of DragDrop. 
        return dwEffect[0];
    }

	
	DragDrop.Type = new Type("DragDrop", DragDrop, [Object.Type]);
	return DragDrop;
});

