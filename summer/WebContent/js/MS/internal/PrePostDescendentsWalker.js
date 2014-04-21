/**
 * PrePostDescendentsWalker
 */

define(["dojo/_base/declare", "system/Type", "windows/DescendentsWalker"], 
		function(declare, Type, DescendentsWalker){
	var PrePostDescendentsWalker = declare("PrePostDescendentsWalker", DescendentsWalker,{
		"-chains-": 
		{
		      constructor: "manual"
		},
		
		constructor:function(/*TreeWalkPriority*/ priority, /*VisitedCallback<T>*/ preCallback, /*VisitedCallback<T>*/ postCallback, /*T*/ data)  
        { 
//	        base(priority, preCallback, data);
			DescendentsWalker.prototype.constructor.call(this, priority, preCallback, data);
            this._postCallback = postCallback;
        },
        
        /// <summary>
        ///     Starts the walking process for the given node. 
        /// </summary> 
        /// <param name="startNode">the node to start the walk on</param>
        /// <param name="skipStartNode">whether or not the first node should have the callbacks called on it</param> 
//        public override void 
        StartWalk:function(/*DependencyObject*/ startNode, /*bool*/ skipStartNode)
        {
            try
            { 
            	DescendentsWalker.prototype.StartWalk.call(this, startNode, skipStartNode);
            } 
            finally 
            {
                if (!skipStartNode) 
                {
                    if (this._postCallback != null)
                    {
                        // This type checking is done in DescendentsWalker.  Doing it here 
                        // keeps us consistent.
                        if (FrameworkElement.DType.IsInstanceOfType(startNode) || FrameworkContentElement.DType.IsInstanceOfType(startNode)) 
                        { 
                        	this._postCallback.Invoke(startNode, this.Data, this._priority == TreeWalkPriority.VisualTree);
                        } 
                    }
                }
            }
        },
        
 
        /// <summary> 
        ///     This method is called for every node touched during a walking of
        ///     the tree.  Some nodes may not have this called if the preCallback 
        ///     returns false - thereby preventing its subtree from being visited.
        /// </summary>
        /// <param name="d">the node to visit</param>
//        protected override void 
        _VisitNode:function(/*DependencyObject*/ d, /*bool*/ visitedViaVisualTree) 
        {
            try 
            { 
            	DescendentsWalker.prototype._VisitNode.call(this, d, visitedViaVisualTree);
            } 
            finally
            {
                if (this._postCallback != null)
                { 
                	this._postCallback.Invoke(d, this.Data, visitedViaVisualTree);
                } 
            } 
        }

	});
	
	
	PrePostDescendentsWalker.Type = new Type("PrePostDescendentsWalker", PrePostDescendentsWalker, [DescendentsWalker.Type]);
	return PrePostDescendentsWalker;
});
