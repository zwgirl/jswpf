/**
 * Second check 2013-12-15
 * EventRoute
 */
/// <summary>
///     Container for the route to be followed 
///     by a RoutedEvent when raised
/// </summary> 
/// <remarks> 
///     EventRoute constitues <para/>
///     a non-null <see cref="RoutedEvent"/> 
///     and <para/>
///     an ordered list of (target object, handler list)
///     pairs <para/>
///     <para/> 
///
///     It facilitates adding new entries to this list 
///     and also allows for the handlers in the list 
///     to be invoked
/// </remarks> 
define(["dojo/_base/declare", "system/Type", "utility/FrugalStructList", "windows/RouteItem", 
        "windows/RoutedEventHandlerInfo", "windows/RoutingStrategy", "windows/SourceItem", "collections/Stack"
        ], 
		function(declare, Type, FrugalStructList, RouteItem, 
				RoutedEventHandlerInfo, RoutingStrategy, SourceItem, Stack){
    // A BranchNode indicates a point in the tree where the logical and 
    // visual structure might diverge.  When building a route, we store
    // this branch node for every logical link we find.  Along with the
    // node where the possible divergence occurred, we store the source
    // that the event should use.  This is so that the source of an 
    // event will always be in the logical tree of the element handling
    // the event. 
    
    var BranchNode = declare("BranchNode", null,{
	});
    
	Object.defineProperties(BranchNode.prototype,{
//        public object 
        Node:
        {
        	get:function(){
        		return this._node;
        	},
        	set:function(value){
        		this._node = value;
        	}
        },
//        public object 
        Source:
        {
        	get:function(){
        		return this._source;
        	},
        	set:function(value){
        		this._source = value;
        	}
        }
	});

	
	var EventRoute = declare("EventRoute", null,{
		constructor:function(/*RoutedEvent*/ routedEvent) 
        {
            if (routedEvent == null) 
            { 
                throw new Error('ArgumentNullException("routedEvent")');
            } 

            this._routedEvent = routedEvent;

            // Changed the initialization size to 16 
            // to achieve performance gain based
            // on standard app behavior 
            this._routeItemList = new FrugalStructList/*<RouteItem>*/(16); 
            this._sourceItemList = new FrugalStructList/*<SourceItem>*/(16);
            
//            private Stack<BranchNode> 
            this._branchNodeStack = null;
            
        },
        

        /// <summary> 
        ///     Adds this handler for the 
        ///     specified target to the route
        /// </summary> 
        /// <remarks>
        ///     NOTE: It is not an error to add a
        ///     handler for a particular target instance
        ///     twice (handler will simply be called twice). 
        /// </remarks>
        /// <param name="target"> 
        ///     Target object whose handler is to be 
        ///     added to the route
        /// </param> 
        /// <param name="handler">
        ///     Handler to be added to the route
        /// </param>
        /// <param name="handledEventsToo"> 
        ///     Flag indicating whether or not the listener wants to
        ///     hear about events that have already been handled 
        /// </param> 
//        public void 
        Add:function(/*object*/ target, /*Delegate*/ handler, /*bool*/ handledEventsToo)
        { 
            if (target == null)
            {
                throw new Error('ArgumentNullException("target")');
            } 

            if (handler == null) 
            { 
                throw new Error('ArgumentNullException("handler")');
            } 

            /*RouteItem*/
            var routeItem = new RouteItem(target, new RoutedEventHandlerInfo(handler, handledEventsToo));

            this._routeItemList.Add(routeItem); 
        },
 
        /// <summary> 
        ///     Invokes all the handlers that have been
        ///     added to the route 
        /// </summary>
        /// <remarks>
        ///     NOTE: If the <see cref="RoutingStrategy"/>
        ///     of the associated <see cref="RoutedEvent"/> 
        ///     is <see cref="RoutingStrategy.Bubble"/>
        ///     the last handlers added are the 
        ///     last ones invoked <para/> 
        ///     However if the <see cref="RoutingStrategy"/>
        ///     of the associated <see cref="RoutedEvent"/> 
        ///     is <see cref="RoutingStrategy.Tunnel"/>,
        ///     the last handlers added are the
        ///     first ones invoked
        /// </remarks> 
        /// <param name="source">
        ///     <see cref="RoutedEventArgs.Source"/> 
        ///     that raised the RoutedEvent 
        /// </param>
        /// <param name="args"> 
        ///     <see cref="RoutedEventArgs"/> that carry
        ///     all the details specific to this RoutedEvent
        /// </param>
//        internal void 
        InvokeHandlers:function(/*object*/ source, /*RoutedEventArgs*/ args) 
        {
            this.InvokeHandlersImpl(source, args, false); 
        }, 
//        internal void 
        ReInvokeHandlers:function(/*object*/ source, /*RoutedEventArgs*/ args) 
        {
        	this.InvokeHandlersImpl(source, args, true);
        },
      
//        private void 
        InvokeHandlersImpl:function(/*object*/ source, /*RoutedEventArgs*/ args, /*bool*/ reRaised)
        { 
            if (source == null) 
            {
                throw new Error('ArgumentNullException("source")'); 
            }

            if (args == null)
            { 
                throw new Error('ArgumentNullException("args")');
            } 
 
            if (args.Source == null)
            { 
                throw new Error('ArgumentException(SR.Get(SRID.SourceNotSet)');
            }

            if (args.RoutedEvent != this._routedEvent) 
            {
                throw new Error('ArgumentException(SR.Get(SRID.Mismatched_RoutedEvent)'); 
            } 
            // Check RoutingStrategy to know the order of invocation 
            if (args.RoutedEvent.RoutingStrategy == RoutingStrategy.Bubble ||
                args.RoutedEvent.RoutingStrategy == RoutingStrategy.Direct)
            {
                /*int*/var endSourceChangeIndex = 0; 

                // If the RoutingStrategy of the associated is 
                // Bubble the handlers for the last target 
                // added are the last ones invoked
                // Invoke class listeners 
                for (var i=0; i<this._routeItemList.Count; i++)
                {
                    // Query for new source only if we are
                    // past the range of the previous source change 
                    if (i >= endSourceChangeIndex)
                    { 
                    	var endSourceChangeIndexOut = {
                    		"endIndex" : endSourceChangeIndex	
                    	};
                        // Get the source at this point in the bubble route and also 
                        // the index at which this source change seizes to apply
                        /*object*/
                    	var newSource = this.GetBubbleSource(i, endSourceChangeIndexOut/*out endSourceChangeIndex*/); 
                        endSourceChangeIndex = endSourceChangeIndexOut.endIndex;
                        // Set appropriate source
                        // The first call to setsource seems redundant
                        // but is necessary because the source could have 
                        // been modified during BuildRoute call and hence
                        // may need to be reset to the original source. 
                        // Note: we skip this logic if reRaised is set, which is done when we're trying 
                        //       to convert MouseDown/Up into a MouseLeft/RightButtonDown/Up
                        if(!reRaised) 
                        {
                            if (newSource == null)
                                args.Source=source;
                            else 
                                args.Source=newSource;
                        } 
                    } 

                    // Invoke listeners 

                    this._routeItemList.Get(i).InvokeHandler(args); 
                }
            } 
            else
            {
                /*int*/var startSourceChangeIndex = this._routeItemList.Count;
                /*int*/var endTargetIndex =this._routeItemList.Count-1; 
                /*int*/var startTargetIndex = 0;
 
                // If the RoutingStrategy of the associated is 
                // Tunnel the handlers for the last target
                // added are the first ones invoked 
                while (endTargetIndex >= 0)
                {
                    // For tunnel events we need to invoke handlers for the last target first.
                    // However the handlers for that individual target must be fired in the right order. 
                    // Eg. Class Handlers must be fired before Instance Handlers.
                    /*object*/var currTarget = this._routeItemList.Get(endTargetIndex).Target; 
                    for (startTargetIndex=endTargetIndex; startTargetIndex>=0; startTargetIndex--) 
                    {
                        if (this._routeItemList.Get(startTargetIndex).Target != currTarget) 
                        {
                            break;
                        }
                    } 

                    for (var i=startTargetIndex+1; i<=endTargetIndex; i++) 
                    { 
                        // Query for new source only if we are
                        // past the range of the previous source change 
                        if (i < startSourceChangeIndex)
                        {
                        	var startSourceChangeIndexOut ={
                        		"startIndex" : startSourceChangeIndex
                        	};
                            // Get the source at this point in the tunnel route and also
                            // the index at which this source change seizes to apply 
                            /*object*/var newSource = this.GetTunnelSource(i, startSourceChangeIndexOut/*out startSourceChangeIndex*/);
                            startSourceChangeIndex = startSourceChangeIndexOut.startIndex;
                            
                            // Set appropriate source 
                            // The first call to setsource seems redundant
                            // but is necessary because the source could have 
                            // been modified during BuildRoute call and hence
                            // may need to be reset to the original source.
                            if (newSource == null)
                                args.Source=source; 
                            else
                                args.Source=newSource; 
                        } 

                        // Invoke listeners
                        this._routeItemList.Get(i).InvokeHandler(args);
                    } 
 
                    endTargetIndex = startTargetIndex;
                } 
            }
        },

        /// <summary> 
        ///     Pushes the given node at the top of the stack of branches.
        /// </summary> 
        /// <remarks> 
        ///     If a node in the tree has different visual and logical,
        ///     FrameworkElement will store the node on this stack of 
        ///     branches.  If the route ever returns to the same logical
        ///     tree, the event source will be restored.
        ///     <para/>
        ///     NOTE: This method needs to be public because it is used 
        ///     by FrameworkElement.
        /// </remarks> 
        /// <param name="node"> 
        ///     The node where the visual parent is different from the logical
        ///     parent. 
        /// </param>
        /// <param name="source">
        ///     The source that is currently being used, and which should be
        ///     restored when this branch is popped off the stack. 
        /// </param>
//        public void 
        PushBranchNode:function(/*object*/ node, /*object*/ source) 
        {
            /*BranchNode*/
        	var branchNode = new BranchNode(); 
            branchNode.Node = node;
            branchNode.Source = source;

            this.BranchNodeStack.Push(branchNode); 
        },
        /// <summary> 
        ///     Pops the given node from the top of the stack of branches.
        /// </summary> 
        /// <remarks>
        ///     If a node in the tree has different visual and logical,
        ///     FrameworkElement will store the node on this stack of
        ///     branches.  If the route ever returns to the same logical 
        ///     tree, the event source will be restored.
        ///     <para/> 
        ///     NOTE: This method needs to be public because it is used 
        ///     by FrameworkElement.
        /// </remarks> 
        /// <returns>
        ///     The node where the visual parent was different from the
        ///     logical parent.
        /// </returns> 
//        public object 
        PopBranchNode:function() 
        { 
            if (this.BranchNodeStack.Count == 0)
                return null; 

            /*BranchNode*/
            var branchNode = this.BranchNodeStack.Pop();

            return branchNode.Node; 
        },
 
        /// <summary> 
        ///     Peeks the given node from the top of the stack of branches.
        /// </summary> 
        /// <remarks>
        ///     If a node in the tree has different visual and logical,
        ///     FrameworkElement will store the node on this stack of
        ///     branches.  If the route ever returns to the same logical 
        ///     tree, the event source will be restored.
        ///     <para/> 
        ///     NOTE: This method needs to be public because it is used 
        ///     by FrameworkElement.
        /// </remarks> 
        /// <returns>
        ///     The node where the visual parent was different from the
        ///     logical parent.
        /// </returns> 
//        public object 
        PeekBranchNode:function() 
        { 
            if (this.BranchNodeStack.Count == 0)
                return null; 

            /*BranchNode*/
            var branchNode = this.BranchNodeStack.Peek();

            return branchNode.Node; 
        },
 
        /// <summary> 
        ///     Peeks the given source from the top of the stack of branches.
        /// </summary> 
        /// <remarks>
        ///     If a node in the tree has different visual and logical,
        ///     FrameworkElement will store the node on this stack of
        ///     branches.  If the route ever returns to the same logical 
        ///     tree, the event source will be restored.
        ///     <para/> 
        ///     NOTE: This method needs to be public because it is used 
        ///     by FrameworkElement.
        /// </remarks> 
        /// <returns>
        ///     The source that was stored along with the node where the
        ///     visual parent was different from the logical parent.
        /// </returns> 
//        public object 
        PeekBranchSource:function() 
        { 
            if (this.BranchNodeStack.Count == 0)
                return null; 

            /*BranchNode*/
            var branchNode = this.BranchNodeStack.Peek();

            return branchNode.Source; 
        },
        // Add the given source to the source item list 
        // indicating what the source will be this point
        // onwards in the route
//        internal void 
        AddSource:function(/*object*/ source)
        { 
            /*int*/var startIndex = this._routeItemList.Count;
            this._sourceItemList.Add(new SourceItem(startIndex, source)); 
        }, 
        // Determine what the RoutedEventArgs.Source should be, at this 
        // point in the bubble. Also the endIndex output parameter tells
        // you the exact index of the handlersList at which this source
        // change ceases to apply
//        private object 
        GetBubbleSource:function(/*int*/ index, endIndexOut/*out int endIndex*/) 
        {
            // If the Source never changes during the route execution, 
            // then we're done (just return null). 
            if (this._sourceItemList.Count == 0)
            { 
            	endIndexOut.endIndex = this._routeItemList.Count;
                return null;
            }
 
            // Similarly, if we're not to the point of the route of the first Source
            // change, simply return null. 
            if (index < this._sourceItemList.Get(0).StartIndex) 
            {
            	endIndexOut.endIndex = this._sourceItemList.Get(0).StartIndex; 
                return null;
            }

            // See if we should be using one of the intermediate 
            // sources
            for (var i=0; i<this._sourceItemList.Count -1; i++) 
            { 
                if (index >= this._sourceItemList.Get(i).StartIndex &&
                    index < this._sourceItemList.Get(i+1).StartIndex) 
                {
                	endIndexOut.endIndex = this._sourceItemList.Get(i+1).StartIndex;
                    return this._sourceItemList.Get(i).Source;
                } 
            }
 
            // If we get here, we're on the last one, 
            // so return that.
            endIndexOut.endIndex = this._routeItemList.Count; 
            return this._sourceItemList.Get(this._sourceItemList.Count -1).Source;
        },

        // Determine what the RoutedEventArgs.Source should be, at this 
        // point in the tunnel. Also the startIndex output parameter tells
        // you the exact index of the handlersList at which this source 
        // change starts tapply 
//        private object 
        GetTunnelSource:function(/*int*/ index, startIndexOut/*out int startIndex*/)
        { 
            // If the Source never changes during the route execution,
            // then we're done (just return null).
            if (this._sourceItemList.Count == 0)
            { 
            	startIndexOut.startIndex = 0;
                return null; 
            } 

            // Similarly, if we're past the point of the route of the first Source 
            // change, simply return null.
            if (index < this._sourceItemList.Get(0).StartIndex)
            {
            	startIndexOut.startIndex = 0; 
                return null;
            } 
 
            // See if we should be using one of the intermediate
            // sources 
            for (var i=0; i<this._sourceItemList.Count -1; i++)
            {
                if (index >= this._sourceItemList.Get(i).StartIndex &&
                    index < this._sourceItemList.Get(i+1).StartIndex) 
                {
                	startIndexOut.startIndex = this._sourceItemList.Get(i).StartIndex; 
                    return this._sourceItemList.Get(i).Source; 
                }
            } 

            // If we get here, we're on the last one, so return that.
            startIndexOut.startIndex = this._sourceItemList.Get(this._sourceItemList.Count -1).StartIndex;
            return this._sourceItemList.Get(this._sourceItemList.Count -1).Source; 
        },
        
        /// <summary> 
        ///     Cleanup all the references within the data
        /// </summary> 
//        internal void 
        Clear:function()
        {
        	this._routedEvent = null;
 
        	this._routeItemList.Clear();
 
            if (this._branchNodeStack != null) 
            {
            	this._branchNodeStack.Clear(); 
            }

            this._sourceItemList.Clear();
        } 
	});
	
	Object.defineProperties(EventRoute.prototype,{
	       // Return associated RoutedEvent
//        internal RoutedEvent 
        RoutedEvent:
        { 
            get:function() {return this._routedEvent;},
            set:function(value) { this._routedEvent = value; } 
        }, 


        // Branch nodes are stored on a stack, which we create on-demand. 
//        private Stack<BranchNode> 
        BranchNodeStack:
        { 
            get:function() 
            {
                if (this._branchNodeStack == null) 
                {
                	this._branchNodeStack = new Stack/*<BranchNode>*/(1);
                }
 
                return this._branchNodeStack;
            } 
        } 
	});
	
	EventRoute.Type = new Type("EventRoute", EventRoute, [Object.Type]);
	return EventRoute;
});
