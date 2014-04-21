/**
 * BroadcastEventHelper
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventArgs", "media/VisualTreeHelper", "internal/FrameworkObject"], 
		function(declare, Type, RoutedEventArgs, VisualTreeHelper, FrameworkObject){
	
//    private static VisitedCallback<BroadcastEventData> BroadcastDelegate = new VisitedCallback<BroadcastEventData>(OnBroadcastCallback);

//    private struct 
    var BroadcastEventData = declare(Object, {
    	constructor:function(/*DependencyObject*/ root, /*RoutedEvent*/ routedEvent, /*List<DependencyObject>*/ eventRoute) 
        {
            this.Root = root; 
            this.RoutedEvent = routedEvent;
            this.EventRoute = eventRoute;
        }
        
    });
    
    Object.defineProperties(BroadcastEventData, {
//        internal DependencyObject       
        Root:
        {
        	get:function(){
        		return this._Root;
        	},
        	set:function(value){
        		this._Root = value;
        	}
        },
//        internal RoutedEvent            
        RoutedEvent:
        {
        	get:function(){
        		return this._RoutedEvent
        	},
        	set:function(value){
        		this._RoutedEvent = value;
        	}
        },
//        internal List<DependencyObject> 
        EventRoute:
        {
        	get:function(){
        		return this._EventRoute;
        	},
        	set:function(value){
        		this._EventRoute = value;
        	}
        }
    });
    
    var FrameworkElement = null;
    function EnsureFrameworkElement(){
    	if(FrameworkElement == null){
    		FrameworkElement = using("windows/FrameworkElement");
    	}
    	
    	return FrameworkElement;
    }
    
//    var FrameworkObject = null;
//    function EnsureFrameworkObject(){
//    	if(FrameworkObject == null){
//    		FrameworkObject = using("internal/FrameworkObject");
//    	}
//    	
//    	return FrameworkObject;
//    }

    
	var BroadcastEventHelper = declare("BroadcastEventHelper", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(BroadcastEventHelper,{

	});
	
    /// <summary> 
    /// Add the loaded callback to the MediaContext queue
    /// </summary> 
//    internal static void 
    BroadcastEventHelper.AddLoadedCallback = function(/*DependencyObject*/ d, /*DependencyObject*/ logicalParent)
    {
//        Debug.Assert(d is FrameworkElement || d instanceof FrameworkContentElement);

        /*DispatcherOperationCallback*/var loadedCallback = new DispatcherOperationCallback(BroadcastEventHelper.BroadcastLoadedEvent);

        // Add the pending loaded event information to the MediaContext's pending 
        // LoadedOrUnloadedCallbacks list so these can be called pre render
        /*LoadedOrUnloadedOperation*/var loadedOp = MediaContext.From(d.Dispatcher).AddLoadedOrUnloadedCallback(loadedCallback, d); 

        // Post to the dispatcher queue as a backup to fire the broadcast
        // event in case the tree change never triggers a Layout
        /*DispatcherOperation*/var operation = d.Dispatcher.BeginInvoke(DispatcherPriority.Loaded, loadedCallback, d); 

        // Set the LoadedPending property 
        d.SetValue(EnsureFrameworkElement().LoadedPendingPropertyKey, /*new object[]{*/[loadedOp, operation, logicalParent]); 
    };

    /// <summary>
    /// Remove the loaded callback from the MediaContext queue
    /// </summary>
//    internal static void 
    BroadcastEventHelper.RemoveLoadedCallback = function(/*DependencyObject*/ d, /*object[]*/ loadedPending) 
    {
//        Debug.Assert(d is FrameworkElement || d is FrameworkContentElement); 

        if (loadedPending != null)
        { 
//            Debug.Assert(loadedPending.Length == 3);

            // Clear the LoadedPending property
            d.ClearValue(EnsureFrameworkElement().LoadedPendingPropertyKey); 

            // If the dispatcher operation is pending abort it 
            /*DispatcherOperation*/var operation = loadedPending[1]; 
            if (operation.Status == DispatcherOperationStatus.Pending)
            { 
                operation.Abort();
            }

            // Remove the pending loaded information from the MediaContext's pending 
            // LoadedOrUnloadedCallbacks list
            MediaContext.From(d.Dispatcher).RemoveLoadedOrUnloadedCallback(loadedPending[0]); 
        } 
    };

    /// <summary>
    /// Add the unloaded callback to the MediaContext queue
    /// </summary>
//    internal static void 
    BroadcastEventHelper.AddUnloadedCallback = function(/*DependencyObject*/ d, /*DependencyObject*/ logicalParent) 
    {
//        Debug.Assert(d is FrameworkElement || d is FrameworkContentElement); 

        /*DispatcherOperationCallback*/var unloadedCallback = new DispatcherOperationCallback(BroadcastEventHelper.BroadcastUnloadedEvent);

        // Add the pending unloaded event information to the MediaContext's pending
        // LoadedOrUnloadedCallbacks list so these can be called pre render
        /*LoadedOrUnloadedOperation*/var unloadedOp = MediaContext.From(d.Dispatcher).AddLoadedOrUnloadedCallback(unloadedCallback, d);

        // Post to the dispatcher queue as a backup to fire the broadcast
        // event in case the tree change never triggers a Layout 
        /*DispatcherOperation*/var operation = d.Dispatcher.BeginInvoke(DispatcherPriority.Loaded, unloadedCallback, d); 

        // Set the UnloadedPending property 
        d.SetValue(EnsureFrameworkElement().UnloadedPendingPropertyKey, /*new object[]{*/[unloadedOp, operation, logicalParent]);
    };

    /// <summary> 
    /// Remove the unloaded callback from the MediaContext queue
    /// </summary> 
//    internal static void 
    BroadcastEventHelper.RemoveUnloadedCallback = function(/*DependencyObject*/ d, /*object[]*/ unloadedPending) 
    {
//        Debug.Assert(d is FrameworkElement || d is FrameworkContentElement); 

        if (unloadedPending != null)
        {
//            Debug.Assert(unloadedPending.Length == 3); 

            // Clear the UnloadedPending property 
            d.ClearValue(EnsureFrameworkElement().UnloadedPendingPropertyKey); 

            // If the dispatcher operation is pending abort it 
            /*DispatcherOperation*/var operation = unloadedPending[1];
            if (operation.Status == DispatcherOperationStatus.Pending)
            {
                operation.Abort(); 
            }

            // Remove the pending unloaded information from the MediaContext's pending 
            // LoadedOrUnloadedCallbacks list
            MediaContext.From(d.Dispatcher).RemoveLoadedOrUnloadedCallback(unloadedPending[0]); 
        }
    };

    /// <summary> 
    ///     Fire the [Loaded/Unloaded] broadcast events based upon the old and new parent values.
    ///     This method is called from ChangeLogicalParent() and OnVisualParentChanged(). 
    /// </summary> 
    /// <param name="d">
    ///     Node to begin the broadcast 
    /// </param>
    /// <param name="oldParent">
    ///     Old Parent
    /// </param> 
    /// <param name="newParent">
    ///     New Parent 
    /// </param> 
//    internal static void 
    BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent = function(
        /*DependencyObject*/ d, 
        /*DependencyObject*/ oldParent,
        /*DependencyObject*/ newParent)
    {
        // Added to a tree 
        if (oldParent == null && newParent != null)
        { 
            if(IsLoadedHelper(newParent) == true) 
            {
                // Broadcast Loaded event if your new parent is loaded 
                // Note that this broadcast will take place when you are
                // attached to your loaded visual parent
                FireLoadedOnDescendentsHelper(d);
            } 
        }
        // Removed from a tree 
        else if (oldParent != null && newParent == null) 
        {
            if (IsLoadedHelper(oldParent) == true) 
            {
                // Broadcast Unloaded event if your old parent was loaded
                // Note that this broadcast will take place when you are
                // detached from your loaded visual parent 
                FireUnloadedOnDescendentsHelper(d);
            } 
        } 
    };

    /// <summary>
    ///     Broadcast the Loaded event when UI is rendered and ready for user interaction.
    /// </summary>
    /// <param name="root"> 
    ///     Root of the sub-tree that the broadcast will start at
    /// </param> 
//    internal static object 
    BroadcastEventHelper.BroadcastLoadedEvent = function(/*object*/ root) 
    {
        /*DependencyObject*/var rootDO = root; 

        /*object[]*/var loadedPending = rootDO.GetValue(EnsureFrameworkElement().LoadedPendingProperty);

//        // The LoadedPendingProperty must be set if we have reached this far 
//        Debug.Assert(loadedPending != null && loadedPending.Length == 3,
//            "The LoadedPendingProperty must be set if we have reached this far"); 

        var isLoaded = IsLoadedHelper(rootDO);

        // Remove the Loaded callback from the MediaContext's queue
        RemoveLoadedCallback(rootDO, loadedPending);

        BroadcastLoadedSynchronously(rootDO, isLoaded); 

        return null; 
    }; 

//    internal static void 
    BroadcastEventHelper.BroadcastLoadedSynchronously = function(/*DependencyObject*/ rootDO, /*bool*/ isLoaded) 
    {
        // It is possible that the loaded broadcast for a parent caused you to be loaded before
        // your broadcast item got dequeued. In that case simply ignore the operation
        if (!isLoaded) 
        {
            // Broadcast the Loaded event 
            BroadcastEventHelper.BroadcastEvent(rootDO, EnsureFrameworkElement().LoadedEvent); 
        }
    };

    /// <summary>
    ///     Broadcast the Unloaded event when the element is detached from a Loaded Tree
    /// </summary> 
    /// <param name="root">
    ///     Root of the sub-tree that the broadcast will start at 
    /// </param> 
//    internal static object 
    BroadcastEventHelper.BroadcastUnloadedEvent = function(/*object*/ root)
    { 
        /*DependencyObject*/var rootDO = /*(DependencyObject)*/root;

       var unloadedPending = /*(object[])*/rootDO.GetValue(EnsureFrameworkElement().UnloadedPendingProperty);

//        // The UnloadedPendingProperty must be set if we have reached this far
//        Debug.Assert(unloadedPending != null && unloadedPending.Length == 3, 
//            "The UnloadedPendingProperty must be set if we have reached this far"); 

        var isLoaded = IsLoadedHelper(rootDO); 

        // Remove the Unloaded callback from the MediaContext's queue
        RemoveUnloadedCallback(rootDO, unloadedPending);

        BroadcastUnloadedSynchronously(rootDO, isLoaded);

        return null; 
    };

//    internal static void 
    BroadcastEventHelper.BroadcastUnloadedSynchronously = function(/*DependencyObject*/ rootDO, /*bool*/ isLoaded)
    {
        // It is possible that the unloaded broadcast for a parent caused you to be unloaded before
        // your broadcast item got dequeued. In that case simply ignore the operation 
        if (isLoaded)
        { 
            // Broadcast the Unloaded event 
            BroadcastEvent(rootDO, EnsureFrameworkElement().UnloadedEvent);
        } 
    };



    /// <summary>
    ///     Broadcast the Loaded/Unloaded event in the sub-tree starting at the given root
    /// </summary>
    /// <param name="root"> 
    ///     Root of the sub-tree that the event will be broadcast to
    /// </param> 
    /// <param name="routedEvent"> 
    ///     RoutedEventID for the event we wish to broadcast
    /// </param> 
//    private static void 
    function BroadcastEvent(/*DependencyObject*/ root, /*RoutedEvent*/ routedEvent)
    {
        // Broadcast to the tree and collect the set of nodes
        // on which we need fire the Loaded event 
        /*List<DependencyObject>*/ 
         var eventRoute = new List/*<DependencyObject>*/();

        // Create a DescendentsWalker for the broadcast 
        /*DescendentsWalker<BroadcastEventData>*/
        var walker = new DescendentsWalker/*<BroadcastEventData>*/(
            TreeWalkPriority.VisualTree, BroadcastDelegate, new BroadcastEventData(root, routedEvent, eventRoute)); 

        // Start the walk down
        walker.StartWalk(root);

        // Iterate and raise the event on each of the nodes in the tree
        for (var i=0; i< eventRoute.Count; i++) 
        { 
            var d = eventRoute[i];
            /*RoutedEventArgs*/var args = new RoutedEventArgs(routedEvent, d); 
            /*FrameworkObject*/var fo = new FrameworkObject(d, true /*throwIfNeither*/);

            if (routedEvent == EnsureFrameworkElement().LoadedEvent)
            { 
                fo.OnLoaded(args);
            } 
            else 
            {
                fo.OnUnloaded(args); 
            }
        }
    }

    // Callback on visiting each node in the descendency during a broadcast event
//    private static bool 
    function OnBroadcastCallback(/*DependencyObject*/ d, /*BroadcastEventData*/ data, /*bool*/ visitedViaVisualTree) 
    { 
        var root = data.Root;
        /*RoutedEvent*/var routedEvent = data.RoutedEvent; 
        /*List<DependencyObject>*/var eventRoute = data.EventRoute;

        if (EnsureFrameworkElement().DType.IsInstanceOfType(d))
        { 
            // If this is a FrameworkElement
            /*FrameworkElement*/var fe = d; 

            if (fe != root && routedEvent == EnsureFrameworkElement().LoadedEvent && fe.UnloadedPending != null)
            { 
                // If there is a pending Unloaded event wait till we've broadcast
                // that event before we can fire the new Loaded event.

                fe.FireLoadedOnDescendentsInternal(); 
            }
            else if (fe != root && routedEvent == EnsureFrameworkElement().UnloadedEvent && fe.LoadedPending != null) 
            { 
                // If there is a pending Loaded event abort it because we are now
                // being Unloaded. 

                RemoveLoadedCallback(fe, fe.LoadedPending);
            }
            else 
            {
                if (fe != root) 
                { 
                    if (routedEvent == EnsureFrameworkElement().LoadedEvent && fe.LoadedPending != null)
                    { 
                        // If there is a pending Loaded event abort it because we are now
                        // being Loaded.

                        RemoveLoadedCallback(fe, fe.LoadedPending); 
                    }
                    else if (routedEvent == EnsureFrameworkElement().UnloadedEvent && fe.UnloadedPending != null) 
                    { 
                        // If there is a pending Unloaded event abort it because we are now
                        // being Unloaded. 

                        RemoveUnloadedCallback(fe, fe.UnloadedPending);
                    }
                } 

                // If element has handlers fire the event and continue to walk down the tree 
                if (fe.SubtreeHasLoadedChangeHandler) 
                {
                    // We cannot assert this condition here for the following reason. 
                    // If the [Un]LoadedHandler is added to the current node after the parent
                    // for this node has been [Un]Loaded but before the current node has been [Un]Loaded
                    // (example: within the [Un]Loaded handler for the parent), then the IsLoaded
                    // cache on the current node has been updated to match that of the parent, 
                    // and this Assert will be violated. See BroadcastEventHelper.UpdateHasHandlerFlag
                    // for further description. 
                    // Debug.Assert(IsLoaded == [false/true], 
                    //     "Element should have been [Un]loaded before it is [Un]Loaded back again");

                    fe.IsLoadedCache = (routedEvent == EnsureFrameworkElement().LoadedEvent);

                    eventRoute.Add(fe);

                    // Continue walk down subtree
                    return true; 
                } 
            }
        } 
        else
        {
            // If this is a FrameworkContentElement
            /*FrameworkContentElement*/var fce = /*(FrameworkContentElement)*/d; 

            if (fce != root && routedEvent == EnsureFrameworkElement().LoadedEvent && fce.UnloadedPending != null) 
            { 
                // If there is a pending Unloaded event wait till we've broadcast
                // that event before we can fire the new Loaded event. 

                fce.FireLoadedOnDescendentsInternal();
            }
            else if (fce != root && routedEvent == EnsureFrameworkElement().UnloadedEvent && fce.LoadedPending != null) 
            {
                // If there is a pending Loaded event abort it because we are now 
                // being Unloaded. 

                RemoveLoadedCallback(fce, fce.LoadedPending); 
            }
            else
            {
                if (fce != root) 
                {
                    if (routedEvent == EnsureFrameworkElement().LoadedEvent && fce.LoadedPending != null) 
                    { 
                        // If there is a pending Loaded event abort it because we are now
                        // being Loaded. 

                        RemoveLoadedCallback(fce, fce.LoadedPending);
                    }
                    else if (routedEvent == EnsureFrameworkElement().UnloadedEvent && fce.UnloadedPending != null) 
                    {
                        // If there is a pending Unloaded event abort it because we are now 
                        // being Unloaded. 

                        RemoveUnloadedCallback(fce, fce.UnloadedPending); 
                    }
                }

                // If element has handlers fire the event and continue to walk down the tree 
                if (fce.SubtreeHasLoadedChangeHandler)
                { 
                    // We cannot assert this condition here for the following reason. 
                    // If the [Un]LoadedHandler is added to the current node after the parent
                    // for this node has been [Un]Loaded but before the current node has been [Un]Loaded 
                    // (example: within the [Un]Loaded handler for the parent), then the IsLoaded
                    // cache on the current node has been updated to match that of the parent,
                    // and this Assert will be violated. See BroadcastEventHelper.UpdateHasHandlerFlag
                    // for further description. 
                    // Debug.Assert(IsLoaded == [false/true],
                    //     "Element should have been [Un]loaded before it is [Un]Loaded back again"); 

                    fce.IsLoadedCache = (routedEvent == EnsureFrameworkElement().LoadedEvent);

                    eventRoute.Add(fce);

                    // Continue walk down subtree
                    return true; 
                }
            } 
        } 

        // Stop walk down subtree 
        return false;
    }

//    private static bool 
    function SubtreeHasLoadedChangeHandlerHelper(/*DependencyObject*/ d) 
    {
        if (EnsureFrameworkElement().DType.IsInstanceOfType(d)) 
        { 
            return d.SubtreeHasLoadedChangeHandler;
        } 
        else if (FrameworkContentElement.DType.IsInstanceOfType(d))
        {
            return d.SubtreeHasLoadedChangeHandler;
        } 
        return false;
    }

//    private static void 
    function FireLoadedOnDescendentsHelper(/*DependencyObject*/ d)
    { 
//        if (FrameworkElement.DType.IsInstanceOfType(d))
//        {
//            ((FrameworkElement)d).FireLoadedOnDescendentsInternal();
//        } 
//        else
//        { 
//            ((FrameworkContentElement)d).FireLoadedOnDescendentsInternal(); 
//        }
    	d.FireLoadedOnDescendentsInternal(); 
    } 

//    private static void 
    function FireUnloadedOnDescendentsHelper(/*DependencyObject*/ d)
    {
//        if (FrameworkElement.DType.IsInstanceOfType(d)) 
//        {
//            d.FireUnloadedOnDescendentsInternal(); 
//        } 
//        else
//        { 
//            d.FireUnloadedOnDescendentsInternal();
//        }
    	d.FireUnloadedOnDescendentsInternal();
    }

//    private static bool 
    function IsLoadedHelper(/*DependencyObject*/ d)
    { 
        var fo = new FrameworkObject(d); 
        return fo.IsLoaded;
    } 

    // Helper method that recursively queries the parents to see if they are loaded.
    // This method is invoked only when the loaded cache on the given node isn't valid.
//    internal static bool 
    BroadcastEventHelper.IsParentLoaded = function(/*DependencyObject*/ d) 
    {
        var     fo      = new FrameworkObject(d); 
        var    parent  = fo.EffectiveParent; 
        var    visual;

        if (parent != null)
        {
            return IsLoadedHelper(parent); 
        }
//        else if ((visual = d instanceof Visual ? d: null) != null) 
//        { 
//            // If parent is null then this is the root element
//            return SafeSecurityHelper.IsConnectedToPresentationSource(visual); 
//        }
        else
            return false; 
    };


    /// <summary> 
    ///     Check if the Framework Element Factory that produced the Template
    ///    that created this control has a Loaded Change Handler. 
    /// </summary> 
    /// <param name="templatedParent">
    ///     The caller must pass in a non-null templatedParent. 
    /// </param>
//    internal static FrameworkElementFactory 
    BroadcastEventHelper.GetFEFTreeRoot = function(/*DependencyObject*/ templatedParent)
    {
        /*FrameworkObject*/var fo = new FrameworkObject(templatedParent, true); 

//        Debug.Assert( fo.IsFE ); 

        /*FrameworkTemplate*/var templatedParentTemplate = fo.FE.TemplateInternal;
        /*FrameworkElementFactory*/var fefTree = templatedParentTemplate.VisualTree; 

        return fefTree;
    };

    /// <summary>
    ///     Update the Has[Loaded/UnLoaded]Handler flags if required. 
    ///     This method is called from OnNewParent/OnVisualParentChanged. 
    /// </summary>
    /// <param name="d"> 
    ///     Node to begin the update
    /// </param>
    /// <param name="oldParent">
    ///     Old Parent 
    /// </param>
    /// <param name="newParent"> 
    ///     New Parent 
    /// </param>
//    internal static void 
    BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag = function( 
        /*DependencyObject*/ d,
        /*DependencyObject*/ oldParent,
        /*DependencyObject*/ newParent)
    { 
        var hasLoadChangedHandler = SubtreeHasLoadedChangeHandlerHelper(d);

        if(hasLoadChangedHandler) 
        {
            // Attaching to a Parent 
            if (oldParent == null && newParent != null)
            {
                // Subtree with a handler got added
            	BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(newParent); 
            }

            // Detaching from a Parent 
            else if (oldParent != null && newParent == null)
            { 
                // Subtree with a handler got removed
            	BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(oldParent);
            }
        } 
    };

//    internal static void 
    BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry = function(/*DependencyObject*/ d) 
    {
        UpdateHasLoadedChangeHandlerFlagInAncestry(d, true); 
    };

//    internal static void 
    BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry = function(/*DependencyObject*/ d)
    { 
        UpdateHasLoadedChangeHandlerFlagInAncestry(d, false);
    };

    /// <summary>
    ///     Evaluate the HasLoadedChangeHandler flag on the given node by 
    ///   querying its children, and styles, and templates.
    /// </summary>
    /// <param name="fo">
    ///     Node 
    /// </param>
//    private static bool 
    function AreThereLoadedChangeHandlersInSubtree(/*ref FrameworkObject fo*/foRef) 
    { 
        // HasHandler flag can be evaluated only for a FE/FCE.
        if (!foRef.fo.IsValid) 
            return false;

        if (foRef.fo.ThisHasLoadedChangeEventHandler)
            return true; 

        if (foRef.fo.IsFE) 
        { 
            // Check if any of your visual children have the flag set
            /*Visual*/var v = fo.FE; 
            var count = VisualTreeHelper.GetChildrenCount(v);

            for(var i = 0; i < count; i++)
            { 
                /*FrameworkElement*/var child = VisualTreeHelper.GetChild(v, i);
                child = child instanceof EnsureFrameworkElement() ? child : null;
                if (child != null && child.SubtreeHasLoadedChangeHandler) 
                { 
                    return true;
                } 
            }
        }

        // Check if any of your logical children have the flag set 
        for/*each*/(var o in LogicalTreeHelper.GetChildren(fo.DO))
        { 
            /*DependencyObject*/var child = o instanceof DependencyObject ? o :null; 
            if(null != child && SubtreeHasLoadedChangeHandlerHelper(child))
            { 
                return true;
            }
        }

        return false;
    } 

    /// <summary>
    ///   This is a recursive function that walks up the tree Adding or Removing 
    ///   HasLoadedChangeHander bits.   It also inits the IsLoadedCache on Add.
    /// </summary>
    /// <param name="d">
    ///     Node to update 
    /// </param>
    /// <param name="addHandler"> 
    ///     Is it an AddHandler/ Add Child with Handler Operation 
    /// </param>
//    private static void 
    function UpdateHasLoadedChangeHandlerFlagInAncestry(/*DependencyObject*/ d, /*bool*/ addHandler) 
    {
        /*FrameworkObject*/var fo = new FrameworkObject(d);

        if (!addHandler) 
        {
            if ( AreThereLoadedChangeHandlersInSubtree(/*ref fo*/{"fo" : fo}) ) 
                return;  // done 
        }

        if (fo.IsValid)
        {
            if (fo.SubtreeHasLoadedChangeHandler != addHandler)
            { 
                /*DependencyObject*/var coreParent = (fo.IsFE) ? VisualTreeHelper.GetParent(fo.FE) : null;
                /*DependencyObject*/var logicalParent = fo.Parent; 
                /*DependencyObject*/var parent = null; 

                fo.SubtreeHasLoadedChangeHandler = addHandler; 

                // Propagate the change to your visual ancestry
                if (coreParent != null)
                { 
                    UpdateHasLoadedChangeHandlerFlagInAncestry(coreParent, addHandler);
                    parent = coreParent; 
                } 

                // Propagate the change to your logical ancestry 
                if (logicalParent != null && logicalParent != coreParent)
                {
                    UpdateHasLoadedChangeHandlerFlagInAncestry(logicalParent, addHandler);
                    if (fo.IsFCE) 
                        parent = logicalParent;
                } 

                // Propagate the change to your mentor, if any
                if (logicalParent == null && coreParent == null) 
                {
                    parent = Helper.FindMentor(fo.DO.InheritanceContext);
                    if (parent != null)
                    { 
                        fo.ChangeSubtreeHasLoadedChangedHandler(parent);
                    } 
                } 

                if(addHandler) 
                {
                    // The HasLoadedChangeHandler flag is used for two purposes.
                    // 1. To indicate that the sub-tree starting at the current node has
                    //    handlers for Loaded / Unloaded event.  So broadcast logic 
                    //    can walk down that path to fire the events.
                    // 2. To indicate that the IsLoaded cache on the node is valid. 

                    // If we are adding a handler:
                    // On the POP side of the recursion, as we come back down from the root, 
                    // pull the value of IsLoadedCache from the parent in to the child.
                    if (fo.IsFE)
                    {
                        UpdateIsLoadedCache(fo.FE, parent); 
                    }
                    else 
                    { 
                        UpdateIsLoadedCache(fo.FCE, parent);
                    } 
                }
            }
        }
        else  // neither a FE or an FCE 
        {
        	/*DependencyObject*/var coreParent = null; 
            /*Visual*/var v; 
            /*ContentElement*/var ce; 

            // This is neither an FE nor and FCE
            // Propagate the change to your visual ancestry
            if ((v = d instanceof Visual ? d : null) != null) 
            {
                coreParent = VisualTreeHelper.GetParent(v); 
            } 
            else if ((ce = d instanceof ContentElement ? d: null) != null)
            { 
                coreParent = ContentOperations.GetParent(ce);
            }

            if (coreParent != null)
            { 
                UpdateHasLoadedChangeHandlerFlagInAncestry(coreParent, addHandler);
            }
        }
    } 

    /// <summary> 
    ///     Updates the IsLoadedCache on the current FrameworkElement 
    /// </summary>
//    private static void 
    function UpdateIsLoadedCache( 
        /*FrameworkElement*/ fe,
        /*DependencyObject*/ parent)
    {
        if (fe.GetValue(EnsureFrameworkElement().LoadedPendingProperty) == null) 
        {
            // Propagate the change to your visual ancestry 
            if (parent != null) 
            {
                fe.IsLoadedCache = IsLoadedHelper(parent); 
            }

            // This is the root visual.
//            else if ( SafeSecurityHelper.IsConnectedToPresentationSource( fe )) 
//            {
//                fe.IsLoadedCache = true; 
//            } 
            else
            { 
                fe.IsLoadedCache = false;
            }
        }
        else 
        {
            // Clear the cache if Loaded is pending 
            fe.IsLoadedCache = false; 
        }
    } 

    /// <summary>
    ///     Updates the IsLoadedCache on the current FrameworkContentElement
    /// </summary> 
//    private static void 
    function UpdateIsLoadedCache(
        /*FrameworkContentElement*/ fce, 
        /*DependencyObject*/        parent) 
    {
        if (fce.GetValue(EnsureFrameworkElement().LoadedPendingProperty) == null) 
        {
            // Propagate the change to your logical ancestry
            fce.IsLoadedCache = IsLoadedHelper(parent);
        } 
        else
        { 
            // Clear the cache if Loaded is pending 
            fce.IsLoadedCache = false;
        } 
    }
	
	BroadcastEventHelper.Type = new Type("BroadcastEventHelper", BroadcastEventHelper, [Object.Type]);
	return BroadcastEventHelper;
});

