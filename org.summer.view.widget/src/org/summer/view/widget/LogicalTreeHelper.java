package org.summer.view.widget;

import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
/*
public delegate boolean ParentTraversalCallback(FrameworkElement parentFE, FrameworkContentElement parentFCE, Object data); 
public delegate boolean ChildTraversalCallback(FrameworkElement childFE, FrameworkContentElement childFCE, Object child, Object data); 
*/

/// <summary>
/// Static helper functions for dealing with the logical tree
/// </summary>
public class LogicalTreeHelper 
{
//----------------------------------------------------- 
// 
//  Constructors
// 
//-----------------------------------------------------

//------------------------------------------------------
// 
//  Public Properties
// 
//----------------------------------------------------- 

// None 

//------------------------------------------------------
//
//  Public Methods 
//
//------------------------------------------------------ 

//#region Public Methods

/// <summary>
/// Given an element in the logical tree to start searching from,
/// searches all its descendent nodes in the logical tree a node whose Name
/// matches the specified elementName. 
/// The given DependencyObject must be either a FrameworkElement or FrameworkContentElement.
/// </summary> 
/// <remarks> 
/// We're searching in a depth-first manner.  Review this if this turns out
///  to be a performance problem.  We're doing this first because it's easy 
///  and light on memory usage as compared to breadth-first.
/// (RogerCh):It would be cool if the DFID (depth-first iterative-deepening)
///  algorithm would be useful here.
/// </remarks> 
public static DependencyObject FindLogicalNode( DependencyObject logicalTreeNode, String elementName )
{ 
    if( logicalTreeNode == null ) 
    {
        throw new IllegalArgumentException("logicalTreeNode"); 
    }
    if( elementName == null )
    {
        throw new IllegalArgumentException("elementName"); 
    }
    if( elementName.isEmpty() ) 
    { 
        throw new IllegalArgumentException(/*SR.Get(SRID.StringEmpty), */"elementName");
    } 

    DependencyObject namedElement = null;
    DependencyObject childNode = null;

    // Check given node against named element.
    IFrameworkInputElement selfNode = (IFrameworkInputElement) 
    		(logicalTreeNode instanceof IFrameworkInputElement ? logicalTreeNode : null); 
    if( selfNode != null ) 
    {
        if( selfNode.Name.equals(elementName) ) 
        {
            namedElement = logicalTreeNode;
        }
    } 

    if( namedElement == null ) 
    { 
        // Nope, the given node isn't it.  See if we can check children.
        IEnumerator childEnumerator = null; 

        childEnumerator = LogicalTreeHelper.GetLogicalChildren(logicalTreeNode);

        // If we can enumerate, check the children. 
        if( childEnumerator != null )
        { 
            childEnumerator.Reset(); 
            while( namedElement == null &&
                   childEnumerator.MoveNext() == true) 
            {
                childNode = (DependencyObject) 
                		(childEnumerator.Current instanceof DependencyObject ? childEnumerator.Current : null);

                if( childNode != null ) 
                {
                    namedElement = FindLogicalNode( childNode, elementName ); 
                } 
            }
        } 
    }

    // Return what we can find - may be null.
    return namedElement; 
}

/// <summary> 
/// Get the logical parent of the given DependencyObject.
/// The given DependencyObject must be either a FrameworkElement or FrameworkContentElement 
/// to have a logical parent.
/// </summary>
public static DependencyObject GetParent(DependencyObject current)
{ 
    if (current == null)
    { 
        throw new IllegalArgumentException("current"); 
    }

    FrameworkElement fe = current as FrameworkElement;
    if (fe != null)
    {
        return fe.Parent; 
    }

    FrameworkContentElement fce = current as FrameworkContentElement; 
    if (fce != null)
    { 
        return fce.Parent;
    }

    return null; 
}

/// <summary> 
/// Get the logical children for the given DependencyObject.
/// The given DependencyObject must be either a FrameworkElement or FrameworkContentElement 
/// to have logical children.
/// </summary>
public static IEnumerable GetChildren(DependencyObject current)
{ 
    if (current == null)
    { 
        throw new IllegalArgumentException("current"); 
    }

    FrameworkElement fe = current as FrameworkElement;
    if (fe != null)
    {
        return new EnumeratorWrapper(fe.LogicalChildren); 
    }

    FrameworkContentElement fce = current as FrameworkContentElement; 
    if (fce != null)
    { 
        return new EnumeratorWrapper(fce.LogicalChildren);
    }

    return EnumeratorWrapper.Empty; 
}

/// <summary> 
/// Get the logical children for the given FrameworkElement
/// </summary> 
public static IEnumerable GetChildren(FrameworkElement current)
{
    if (current == null)
    { 
        throw new IllegalArgumentException("current");
    } 

    return new EnumeratorWrapper(current.LogicalChildren);
} 

/// <summary>
/// Get the logical children for the given FrameworkContentElement
/// </summary> 
public static IEnumerable GetChildren(FrameworkContentElement current)
{ 
    if (current == null) 
    {
        throw new IllegalArgumentException("current"); 
    }

    return new EnumeratorWrapper(current.LogicalChildren);
} 

/// <summary> 
/// Attempts to bring this element into view by originating a RequestBringIntoView event. 
/// </summary>
public static void BringIntoView(DependencyObject current) 
{
    if (current == null)
    {
        throw new IllegalArgumentException("current"); 
    }

    FrameworkElement fe = current as FrameworkElement; 
    if (fe != null)
    { 
        fe.BringIntoView();
    }

    FrameworkContentElement fce = current as FrameworkContentElement; 
    if (fce != null)
    { 
        fce.BringIntoView(); 
    }
} 

/*
/// <summary>
// 
*/
//#endregion Public Methods 

//----------------------------------------------------- 
// 
//  Public Events
// 
//------------------------------------------------------

// None

//-----------------------------------------------------
// 
//  Internal Constructors 
//
//----------------------------------------------------- 

// None

//----------------------------------------------------- 
//
//  Internal Properties 
// 
//------------------------------------------------------

// None

//-----------------------------------------------------
// 
//  Internal Methods
// 
//------------------------------------------------------ 

//#region Internal Methods 

/*internal*/public static void AddLogicalChild(DependencyObject parent, Object child)
{
    if (child != null && parent != null) 
    {
        FrameworkElement parentFE = parent as FrameworkElement; 
        if (parentFE != null) 
        {
            parentFE.AddLogicalChild(child); 
        }
        else
        {
            FrameworkContentElement parentFCE = parent as FrameworkContentElement; 
            if (parentFCE != null)
            { 
                parentFCE.AddLogicalChild(child); 
            }
        } 
    }
}

/*internal*/public static void AddLogicalChild(FrameworkElement parentFE, FrameworkContentElement parentFCE, Object child) 
{
    if (child != null) 
    { 
        if (parentFE != null)
        { 
            parentFE.AddLogicalChild(child);
        }
        else if (parentFCE != null)
        { 
            parentFCE.AddLogicalChild(child);
        } 
    } 
}

/*internal*/ public static void RemoveLogicalChild(DependencyObject parent, Object child)
{
    if (child != null && parent != null)
    { 
        FrameworkElement parentFE = parent as FrameworkElement;
        if (parentFE != null) 
        { 
            parentFE.RemoveLogicalChild(child);
        } 
        else
        {
            FrameworkContentElement parentFCE = parent as FrameworkContentElement;
            if (parentFCE != null) 
            {
                parentFCE.RemoveLogicalChild(child); 
            } 
        }
    } 
}

/*internal*/public static void RemoveLogicalChild(FrameworkElement parentFE, FrameworkContentElement parentFCE, Object child)
{ 
    if (child != null)
    { 
//        Debug.Assert(parentFE != null || parentFCE != null, "Either parentFE or parentFCE should be non-null"); 
        if (parentFE != null)
        { 
            parentFE.RemoveLogicalChild(child);
        }
        else
        { 
            parentFCE.RemoveLogicalChild(child);
        } 
    } 
}

/*internal*/ static IEnumerator GetLogicalChildren(DependencyObject current)
{
    FrameworkElement fe = current as FrameworkElement;
    if (fe != null) 
    {
        return fe.LogicalChildren; 
    } 

    FrameworkContentElement fce = current as FrameworkContentElement; 
    if (fce != null)
    {
        return fce.LogicalChildren;
    } 

    return /*MS.Internal.Controls.*/EmptyEnumerator.Instance; 
} 

//#endregion Internal Methods 

//------------------------------------------------------
//
//  Internal Events 
//
//----------------------------------------------------- 

// None

//------------------------------------------------------
//
//  Private Classes
// 
//-----------------------------------------------------

private class EnumeratorWrapper implements IEnumerable 
{
    public EnumeratorWrapper(IEnumerator enumerator) 
    {
        if (enumerator != null)
        {
            _enumerator = enumerator; 
        }
        else 
        { 
            _enumerator = MS.Internal.Controls.EmptyEnumerator.Instance;
        } 
    }

    public IEnumerator /*IEnumerable.*/GetEnumerator()
    { 
        return _enumerator;
    } 

    IEnumerator _enumerator;


    /*internal*/public static EnumeratorWrapper Empty
    {
        get 
        {
            if (_emptyInstance == null) 
            { 
                _emptyInstance = new EnumeratorWrapper(null);
            } 

            return _emptyInstance;
        }
    } 

    static EnumeratorWrapper _emptyInstance; 
} 
}