package org.summer.view.widget;

import org.summer.view.widget.collection.FrugalStructList;
import org.summer.view.widget.media.VisualTreeHelper;
/// <summary> 
///     This is a base class to the DescendentsWalker. It is factored out so that
///     FrameworkContextData can store and retrieve it from context local storage
///     in a type agnostic manner.
/// </summary> 
/*internal*/ public class DescendentsWalkerBase
{ 
//    #region Construction 

    protected DescendentsWalkerBase(TreeWalkPriority priority) 
    {
        _startNode = null;
        _priority = priority;
        _recursionDepth = 0; 
        _nodes = new FrugalStructList<DependencyObject>();
    } 

//    #endregion Construction

    /*internal*/ public boolean WasVisited(DependencyObject d)
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


    /*internal*/ public DependencyObject _startNode;
    /*internal*/ public TreeWalkPriority _priority; 

    /*internal*/ public FrugalStructList<DependencyObject> _nodes; 
    /*internal*/ public int _recursionDepth; 
}
 
    