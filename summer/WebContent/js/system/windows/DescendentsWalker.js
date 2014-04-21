/**
 * DescendentsWalker
 */

define(["dojo/_base/declare", "system/Type", "windows/DescendentsWalkerBase", "windows/TreeWalkPriority",
        "windows/ContextLayoutManager"], 
		function(declare, Type, DescendentsWalkerBase, TreeWalkPriority,
				ContextLayoutManager){
	
	var FrameworkContentElement = null;
	function EnsureFrameworkContentElement(){
		if(FrameworkContentElement == null){
			FrameworkContentElement = using("windows/FrameworkContentElement");
		}
		
		return FrameworkContentElement;
	}
	
	var FrameworkElement = null;
	function EnsureFrameworkElement(){
		if(FrameworkElement == null){
			FrameworkElement = using("windows/FrameworkElement");
		}
		
		return FrameworkElement;
	}
	
	
	var DescendentsWalker = declare("DescendentsWalker", DescendentsWalkerBase,{
		"-chains-": 
		{
			constructor: "manual"
		},
		constructor:function(/*TreeWalkPriority*/ priority, /*VisitedCallback<T>*/ callback, /*T*/ data)
        {
			DescendentsWalkerBase.prototype.constructor.call(this, priority);
			
			if(data === undefined){
				data = null;
			}
//            : base(priority) 
            this._callback = callback;
            this._data = data;
            this._recursionDepth = 0;
        }, 
        
        /// <summary>
        ///     Start Iterating through the current subtree 
        /// </summary>
//        public virtual void 
        StartWalk:function(/*DependencyObject*/ startNode, /*bool*/ skipStartNode)
        {
        	if(skipStartNode === undefined){
        		skipStartNode = false;
        	}
        	
            this._startNode = startNode; 
            var continueWalk = true;
 
            if (!skipStartNode) 
            {
                if (EnsureFrameworkElement().DType.IsInstanceOfType(this._startNode) || 
                		EnsureFrameworkContentElement().DType.IsInstanceOfType(this._startNode))
                {
                    // Callback for the root of the subtree
                    continueWalk = this._callback.Call(this._startNode, this._data, this._priority == TreeWalkPriority.VisualTree); 
                }
            } 
 
            if (continueWalk)
            { 
                // Iterate through the children of the root
            	this.IterateChildren(this._startNode);
            }
        }, 

        /// <summary> 
        ///     Given a DependencyObject, see if it's any of the types we know 
        /// to have children.  If so, call VisitNode on each of its children.
        /// </summary> 
//        private void 
        IterateChildren:function(/*DependencyObject*/ d)
        {
        	this._recursionDepth++;
 
            if (EnsureFrameworkElement().DType.IsInstanceOfType(d))
            { 
                /*FrameworkElement*/var fe = d; 
                var hasLogicalChildren = fe.HasLogicalChildren;
 
                // FrameworkElement have both a visual and a logical tree.
                //  Sometimes we want to hit Visual first, sometimes Logical.

                if (this._priority == TreeWalkPriority.VisualTree) 
                {
                    this.WalkFrameworkElementVisualThenLogicalChildren(fe, hasLogicalChildren); 
                } 
                else if (this._priority == TreeWalkPriority.LogicalTree)
                { 
                	this.WalkFrameworkElementLogicalThenVisualChildren(fe, hasLogicalChildren);
                }
                else
                { 
//                    Debug.Assert( false, "Tree walk priority should be Visual first or Logical first - but this instance of DescendentsWalker has an invalid priority setting that's neither of the two." );
                } 
            } 
            else if (EnsureFrameworkContentElement().DType.IsInstanceOfType(d))
            { 
                // FrameworkContentElement only has a logical tree, so we
                // Walk logical children
                /*FrameworkContentElement*/var fce = d instanceof EnsureFrameworkContentElement() ? d : null;
                if (fce.HasLogicalChildren) 
                {
                	this.WalkLogicalChildren( null, fce, fce.LogicalChildren ); 
                } 
            }
            else 
            {
                // Neither a FrameworkElement nor FrameworkContentElement.  See
                //  if it's a Visual and if so walk the Visual collection
                /*Visual*/var v = d instanceof Visual ? d : null; 
                if (v != null)
                { 
                	this.WalkVisualChildren(v); 
                }
//                else 
//                {
//                    Visual3D v3D = d as Visual3D;
//                    if (v3D != null)
//                    { 
//                        WalkVisualChildren(v3D);
//                    } 
//                } 
            }
 
            this._recursionDepth--;
        },

        /// <summary> 
        ///     Given a object of type Visual, call VisitNode on each of its
        /// Visual children. 
        /// </summary> 
//        private void 
        WalkVisualChildren:function( /*Visual*/ v )
        { 
            v.IsVisualChildrenIterationInProgress = true;

            try
            { 
                var count = v.InternalVisual2DOr3DChildrenCount;
                for(var i = 0; i < count; i++) 
                { 
                    /*DependencyObject*/var childVisual = v.InternalGet2DOr3DVisualChild(i);
                    if (childVisual != null) 
                    {
                        var visitedViaVisualTree = true;
                        this.VisitNode(childVisual, visitedViaVisualTree);
                    } 
                }
            } 
            finally 
            {
                v.IsVisualChildrenIterationInProgress = false; 
            }
        },
        
//        /// <summary> 
//        ///     Given a object of type Visual3D, call VisitNode on each of its
//        ///     children. 
//        /// </summary> 
//        private void WalkVisualChildren( Visual3D v )
//        { 
//            v.IsVisualChildrenIterationInProgress = true;
//
//            try
//            { 
//                int count = v.InternalVisual2DOr3DChildrenCount;
//                for(int i = 0; i < count; i++) 
//                { 
//                    DependencyObject childVisual = v.InternalGet2DOr3DVisualChild(i);
//                    if (childVisual != null) 
//                    {
//                        bool visitedViaVisualTree = true;
//                        VisitNode(childVisual, visitedViaVisualTree);
//                    } 
//                }
//            } 
//            finally 
//            {
//                v.IsVisualChildrenIterationInProgress = false; 
//            }
//        }


        /// <summary> 
        ///     Given an enumerator for Logical children, call VisitNode on each
        /// of the nodes in the enumeration. 
        /// </summary> 
//        private void 
        WalkLogicalChildren:function(
            /*FrameworkElement*/        feParent, 
            /*FrameworkContentElement*/ fceParent,
            /*IEnumerator*/             logicalChildren )
        {
            if (feParent != null) 
                feParent.IsLogicalChildrenIterationInProgress = true;
            else 
                fceParent.IsLogicalChildrenIterationInProgress = true; 

            try 
            {
                if (logicalChildren != null)
                {
                    while (logicalChildren.MoveNext()) 
                    {
                        /*DependencyObject*/
                    	var child = logicalChildren.Current instanceof DependencyObject ? logicalChildren.Current : null; 
                        if (child != null) 
                        {
                            var visitedViaVisualTree = false; 
                            this.VisitNode(child, visitedViaVisualTree);
                        }
                    }
                } 
            }
            finally 
            { 
                if (feParent != null)
                    feParent.IsLogicalChildrenIterationInProgress = false; 
                else
                    fceParent.IsLogicalChildrenIterationInProgress = false;
            }
        }, 
        
        /// <summary> 
        ///     FrameworkElement objects have both a visual and a logical tree. 
        /// This variant walks the visual children first
        /// </summary> 
        /// <remarks>
        ///     It calls the generic WalkVisualChildren, but doesn't call the
        /// generic WalkLogicalChildren because there are shortcuts we can take
        /// to be smarter than the generic logical children walk. 
        /// </remarks>
//        private void 
        WalkFrameworkElementVisualThenLogicalChildren:function( 
            /*FrameworkElement*/ feParent, /*bool*/ hasLogicalChildren ) 
        {
        	this.WalkVisualChildren( feParent ); 

            //
            // If a popup is attached to the framework element visit each popup node.
            // 
            /*List<Popup>*/var registeredPopups = Popup.RegisteredPopupsField.GetValue(feParent);
 
            if (registeredPopups != null) 
            {
                for/*each*/ (var i = 0; i <registeredPopups.Count; i++) //(Popup p in registeredPopups) 
                {
                    var visitedViaVisualTree = false;
                    VisitNode(registeredPopups.Get(i), visitedViaVisualTree);
                } 
            }
 
            feParent.IsLogicalChildrenIterationInProgress = true; 
 
            try
            {
                // Optimized variant of WalkLogicalChildren
                if (hasLogicalChildren) 
                {
                    /*IEnumerator*/var logicalChildren = feParent.LogicalChildren; 
                    if (logicalChildren != null) 
                    {
                        while (logicalChildren.MoveNext()) 
                        {
                            var current = logicalChildren.Current;
                            /*FrameworkElement*/
                            var fe = current instanceof EnsureFrameworkElement() ? current : null;
                            if (fe != null) 
                            {
                                // For the case that both parents are identical, this node should 
                                // have already been visited when walking through visual 
                                // children, hence we short-circuit here
                                if (VisualTreeHelper.GetParent(fe) != fe.Parent) 
                                {
                                    var visitedViaVisualTree = false;
                                    this.VisitNode(fe, visitedViaVisualTree);
                                } 
                            }
                            else 
                            { 
                                /*FrameworkContentElement*/
                            	var fce = current instanceof EnsureFrameworkContentElement() ? current : null;
                                if (fce != null) 
                                {
                                    var visitedViaVisualTree = false;
                                    this.VisitNode(fce, visitedViaVisualTree);
                                } 
                            }
                        } 
                    } 
                }
            } 
            finally
            {
                feParent.IsLogicalChildrenIterationInProgress = false;
            } 
        },

        /// <summary> 
        ///     FrameworkElement objects have both a visual and a logical tree.
        /// This variant walks the logical children first 
        /// </summary>
        /// <remarks>
        ///     It calls the generic WalkLogicalChildren, but doesn't call the
        /// generic WalkVisualChildren because there are shortcuts we can take 
        /// to be smarter than the generic visual children walk.
        /// </remarks> 
//        private void 
        WalkFrameworkElementLogicalThenVisualChildren:function( 
            /*FrameworkElement*/ feParent, /*bool*/ hasLogicalChildren)
        { 
            if (hasLogicalChildren)
            {
            	this.WalkLogicalChildren( feParent, null, feParent.LogicalChildren );
            } 

            feParent.IsVisualChildrenIterationInProgress = true; 
 
            try
            { 
                // Optimized variant of WalkVisualChildren
                var count = feParent.InternalVisualChildrenCount;

                for(var i = 0; i < count; i++) 
                {
                    /*Visual*/var child = feParent.InternalGetVisualChild(i); 
                    if (child != null && EnsureFrameworkElement().DType.IsInstanceOfType(child)) 
                    {
                        // For the case that both parents are identical, this node should 
                        // have already been visited when walking through logical
                        // children, hence we short-circuit here
                        if (VisualTreeHelper.GetParent(child) != child.Parent)
                        { 
                            var visitedViaVisualTree = true;
                            this.VisitNode(child, visitedViaVisualTree); 
                        } 
                    }
                } 
            }
            finally
            {
                feParent.IsVisualChildrenIterationInProgress = false; 
            }
 
            // 
            // If a popup is attached to the framework element visit each popup node.
            // 
            /*List<Popup>*/var registeredPopups = Popup.RegisteredPopupsField.GetValue(feParent);

            if (registeredPopups != null)
            { 
                for/*each*/ (var i =0; i<registeredPopups.Count; i++)
                { 
                    var visitedViaVisualTree = false; 
                    this.VisitNode(p, visitedViaVisualTree);
                } 
            }

        },

        ////        private void 
//        VisitNode:function(/*FrameworkElement*/ fe, /*bool*/ visitedViaVisualTree)
//        { 
//            if (this._recursionDepth <= ContextLayoutManager.s_LayoutRecursionLimit) 
//            {
//                // For the case when the collection contains the node 
//                // being visted, we do not need to visit it again. Also
//                // this node will not be visited another time because
//                // any node can be reached at most two times, once
//                // via its visual parent and once via its logical parent 
//
//                var index = this._nodes.IndexOf(fe); 
// 
//                // If index is not -1, then fe was in the list, remove it
//                if (index != -1) 
//                {
//                    this._nodes.RemoveAt(index);
//                }
//                else 
//                {
//                    // A node will be visited a second time only if it has 
//                    // different non-null logical and visual parents. 
//                    // Hence that is the only case that we need to
//                    // remember this node, to avoid duplicate callback for it 
//
//                    /*DependencyObject*/var dependencyObjectParent = VisualTreeHelper.GetParent(fe);
//                    /*DependencyObject*/var logicalParent = fe.Parent;
//                    if (dependencyObjectParent != null && logicalParent != null && dependencyObjectParent != logicalParent) 
//                    {
//                        this._nodes.Add(fe); 
//                    } 
//
//                    this._VisitNode(fe, visitedViaVisualTree); 
//                }
//            }
//            else
//            { 
//                // We suspect a loop here because the recursion
//                // depth has exceeded the MAX_TREE_DEPTH expected 
//                throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
//            }
//        },
//
////        private void 
//        VisitNode:function(/*DependencyObject*/ d, /*bool*/ visitedViaVisualTree)
//        {
//            if (this._recursionDepth <= ContextLayoutManager.s_LayoutRecursionLimit) 
//            {
//                if (EnsureFrameworkElement().DType.IsInstanceOfType(d)) 
//                { 
//                	this.VisitNode(d instanceof EnsureFrameworkElement() ? d : null, visitedViaVisualTree);
//                } 
//                else if (EnsureFrameworkContentElement().DType.IsInstanceOfType(d))
//                {
//                	this._VisitNode(d, visitedViaVisualTree);
//                } 
//                else
//                { 
//                    // Iterate through the children of this node 
//                	this.IterateChildren(d);
//                } 
//            }
//            else
//            {
//                // We suspect a loop here because the recursion 
//                // depth has exceeded the MAX_TREE_DEPTH expected
//                throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
//            } 
//
//        }, 
        
//        private void 
        VisitNode:function(/*FrameworkElement*/ fe, /*bool*/ visitedViaVisualTree)
        { 
        	if(fe instanceof FrameworkElement){
        		if (this._recursionDepth <= ContextLayoutManager.s_LayoutRecursionLimit) 
                {
                    // For the case when the collection contains the node 
                    // being visted, we do not need to visit it again. Also
                    // this node will not be visited another time because
                    // any node can be reached at most two times, once
                    // via its visual parent and once via its logical parent 

                    var index = this._nodes.IndexOf(fe); 
     
                    // If index is not -1, then fe was in the list, remove it
                    if (index != -1) 
                    {
                        this._nodes.RemoveAt(index);
                    }
                    else 
                    {
                        // A node will be visited a second time only if it has 
                        // different non-null logical and visual parents. 
                        // Hence that is the only case that we need to
                        // remember this node, to avoid duplicate callback for it 

                        /*DependencyObject*/var dependencyObjectParent = VisualTreeHelper.GetParent(fe);
                        /*DependencyObject*/var logicalParent = fe.Parent;
                        if (dependencyObjectParent != null && logicalParent != null && dependencyObjectParent != logicalParent) 
                        {
                            this._nodes.Add(fe); 
                        } 

                        this._VisitNode(fe, visitedViaVisualTree); 
                    }
                }
                else
                { 
                    // We suspect a loop here because the recursion
                    // depth has exceeded the MAX_TREE_DEPTH expected 
                    throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
                }
        	}else{
        		if (this._recursionDepth <= ContextLayoutManager.s_LayoutRecursionLimit) 
                {
                    if (EnsureFrameworkElement().DType.IsInstanceOfType(fe)) 
                    { 
                    	this.VisitNode(fe instanceof EnsureFrameworkElement() ? fe : null, visitedViaVisualTree);
                    } 
                    else if (EnsureFrameworkContentElement().DType.IsInstanceOfType(fe))
                    {
                    	this._VisitNode(fe, visitedViaVisualTree);
                    } 
                    else
                    { 
                        // Iterate through the children of this node 
                    	this.IterateChildren(fe);
                    } 
                }
                else
                {
                    // We suspect a loop here because the recursion 
                    // depth has exceeded the MAX_TREE_DEPTH expected
                    throw new InvalidOperationException(SR.Get(SRID.LogicalTreeLoop)); 
                } 
        	}
            
        },

//        protected virtual void 
        _VisitNode:function(/*DependencyObject*/ d, /*bool*/ visitedViaVisualTree)
        {
            // Callback for this node of the subtree 
            var continueWalk = this._callback.Call(d, this._data, visitedViaVisualTree);
            if (continueWalk) 
            { 
                // Iterate through the children of this node
            	this.IterateChildren(d); 
            }
        }
	});
	
	Object.defineProperties(DescendentsWalker.prototype,{
//        protected T 
        Data: 
        {
            get:function() 
            { 
                return this._data;
            } 
        }
	});
	
	DescendentsWalker.Type = new Type("DescendentsWalker", DescendentsWalker, [DescendentsWalkerBase.Type]);
	return DescendentsWalker;
});


