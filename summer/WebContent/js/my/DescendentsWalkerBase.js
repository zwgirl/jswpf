/**
 * DescendentsWalkerBase
 */

define(["dojo/_base/declare", "system/Type", "utility/FrugalStructList", "media/VisualTreeHelper"], 
		function(declare, Type, FrugalStructList, VisualTreeHelper){
	var DescendentsWalkerBase = declare("DescendentsWalkerBase", null,{
		constructor:function(/*TreeWalkPriority*/ priority) 
        {
            this._startNode = null;
            this._priority = priority;
            this._recursionDepth = 0; 
            this._nodes = new FrugalStructList/*<DependencyObject>*/();
        },
        
//        internal bool 
        WasVisited:function(/*DependencyObject*/ d)
        {
            /*DependencyObject*/var ancestor = d;
 
            while ((ancestor != _startNode) && (ancestor != null))
            { 
                /*DependencyObject*/var logicalParent; 

                if (FrameworkElement.DType.IsInstanceOfType(ancestor)) 
                {
                    /*FrameworkElement*/
                	var fe = ancestor instanceof FrameworkElement ? ancestor : null;
                    logicalParent = fe.Parent;
                    // FrameworkElement 
                    /*DependencyObject*/var dependencyObjectParent = VisualTreeHelper.GetParent(fe);
                    if (dependencyObjectParent != null && logicalParent != null && dependencyObjectParent != logicalParent) 
                    { 
                        return _nodes.Contains(ancestor);
                    } 

                    // Follow visual tree if not null otherwise we follow logical tree
                    if (dependencyObjectParent != null)
                    { 
                        ancestor = dependencyObjectParent;
                        continue; 
                    } 
                }
                else 
                {
                    // FrameworkContentElement
                    /*FrameworkContentElement*/
                	var ancestorFCE = ancestor instanceof FrameworkContentElement ? ancestor : null;
                    logicalParent = (ancestorFCE != null) ? ancestorFCE.Parent : null; 
                }
                ancestor = logicalParent; 
            } 
            return (ancestor != null);
        } 
	});
	
	DescendentsWalkerBase.Type = new Type("DescendentsWalkerBase", DescendentsWalkerBase, [Object.Type]);
	return DescendentsWalkerBase;
});

using System; 
using System.Collections;
using System.Diagnostics;
using System.Windows;
using System.Windows.Media; 
using MS.Utility;
 
namespace System.Windows 
{
    /// <summary> 
    ///     This is a base class to the DescendentsWalker. It is factored out so that
    ///     FrameworkContextData can store and retrieve it from context local storage
    ///     in a type agnostic manner.
    /// </summary> 
    internal class DescendentsWalkerBase
    { 
        #region Construction 

        protected DescendentsWalkerBase(TreeWalkPriority priority) 
        {
            _startNode = null;
            _priority = priority;
            _recursionDepth = 0; 
            _nodes = new FrugalStructList<DependencyObject>();
        } 
 
        #endregion Construction
 
        internal bool WasVisited(DependencyObject d)
        {
            DependencyObject ancestor = d;
 
            while ((ancestor != _startNode) && (ancestor != null))
            { 
                DependencyObject logicalParent; 

                if (FrameworkElement.DType.IsInstanceOfType(ancestor)) 
                {
                    FrameworkElement fe = ancestor as FrameworkElement;
                    logicalParent = fe.Parent;
                    // FrameworkElement 
                    DependencyObject dependencyObjectParent = VisualTreeHelper.GetParent(fe);
                    if (dependencyObjectParent != null && logicalParent != null && dependencyObjectParent != logicalParent) 
                    { 
                        return _nodes.Contains(ancestor);
                    } 

                    // Follow visual tree if not null otherwise we follow logical tree
                    if (dependencyObjectParent != null)
                    { 
                        ancestor = dependencyObjectParent;
                        continue; 
                    } 
                }
                else 
                {
                    // FrameworkContentElement
                    FrameworkContentElement ancestorFCE = ancestor as FrameworkContentElement;
                    logicalParent = (ancestorFCE != null) ? ancestorFCE.Parent : null; 
                }
                ancestor = logicalParent; 
            } 
            return (ancestor != null);
        } 


        internal DependencyObject _startNode;
        internal TreeWalkPriority _priority; 

        internal FrugalStructList<DependencyObject> _nodes; 
        internal int _recursionDepth; 
    }
 
    /// <summary>
    ///     Enum specifying whether visual tree needs
    ///     to be travesed first or the logical tree
    /// </summary> 
    internal enum TreeWalkPriority
    { 
        /// <summary> 
        ///     Traverse Logical Tree first
        /// </summary> 
        LogicalTree,

        /// <summary>
        ///     Traverse Visual Tree first 
        /// </summary>
        VisualTree 
    } 
}
 
 