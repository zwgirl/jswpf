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


//------------------------------------------------------------------------------ 
//
// <copyright file="PrePostDescendentsWalker.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// Description: 
//     A simple subclass of DescendentsWalker which introduces a second callback 
//     which is called after a node's children have been visited.
// 
// History:
//  04/13/2004: rruiz:  Introduces class.
//  10/20/2004: rruiz:  Moved class to MS.Internal.
// 
//-----------------------------------------------------------------------------
using System; 
using System.Diagnostics; 
using System.Windows;
using MS.Utility; 

namespace MS.Internal
{
    /// <summary> 
    ///     A simple subclass of DescendentsWalker which introduces a second callback
    ///     which is called after a node's children have been visited. 
    /// </summary> 
    internal class PrePostDescendentsWalker<T> : DescendentsWalker<T>
    { 
        //-----------------------------------------------------
        //
        //  Constructors
        // 
        //-----------------------------------------------------
 
        #region Constructors 

        /// <summary> 
        ///     Creates an instances of PrePostDescendentsWalker.
        /// </summary>
        /// <param name="priority">specifies which tree should be visited first</param>
        /// <param name="preCallback">the callback to be called before a node's children are visited</param> 
        /// <param name="postCallback">the callback to be called after a node's children are visited</param>
        /// <param name="data">the data passed to each callback</param> 
        public PrePostDescendentsWalker(TreeWalkPriority priority, VisitedCallback<T> preCallback, VisitedCallback<T> postCallback, T data) : 
            base(priority, preCallback, data)
        { 
            _postCallback = postCallback;
        }

        #endregion Constructors 

        //------------------------------------------------------ 
        // 
        //  Public Methods
        // 
        //-----------------------------------------------------

        #region Public Methods
 
        /// <summary>
        ///     Starts the walking process for the given node. 
        /// </summary> 
        /// <param name="startNode">the node to start the walk on</param>
        /// <param name="skipStartNode">whether or not the first node should have the callbacks called on it</param> 
        public override void StartWalk(DependencyObject startNode, bool skipStartNode)
        {
            try
            { 
                base.StartWalk(startNode, skipStartNode);
            } 
            finally 
            {
                if (!skipStartNode) 
                {
                    if (_postCallback != null)
                    {
                        // This type checking is done in DescendentsWalker.  Doing it here 
                        // keeps us consistent.
                        if (FrameworkElement.DType.IsInstanceOfType(startNode) || FrameworkContentElement.DType.IsInstanceOfType(startNode)) 
                        { 
                            _postCallback(startNode, this.Data, _priority == TreeWalkPriority.VisualTree);
                        } 
                    }
                }
            }
        } 

        #endregion Public Methods 
 
        //------------------------------------------------------
        // 
        //  Protected Methods
        //
        //------------------------------------------------------
 
        #region Protected Methods
 
        /// <summary> 
        ///     This method is called for every node touched during a walking of
        ///     the tree.  Some nodes may not have this called if the preCallback 
        ///     returns false - thereby preventing its subtree from being visited.
        /// </summary>
        /// <param name="d">the node to visit</param>
        protected override void _VisitNode(DependencyObject d, bool visitedViaVisualTree) 
        {
            try 
            { 
                base._VisitNode(d, visitedViaVisualTree);
            } 
            finally
            {
                if (_postCallback != null)
                { 
                    _postCallback(d, this.Data, visitedViaVisualTree);
                } 
            } 
        }
 
        #endregion Protected Methods

        //-----------------------------------------------------
        // 
        //  Private Properties
        // 
        //------------------------------------------------------ 

        #region Private Properties 

        private VisitedCallback<T> _postCallback;

        #endregion Private Properties 

    } 
} 
