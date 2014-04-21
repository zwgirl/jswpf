/**
 * LogicalTreeHelper
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerable", "windows/FrameworkElement"], 
		function(declare, Type, IEnumerable, FrameworkElement){
	

    var EnumeratorWrapper = declare("EnumeratorWrapper", IEnumerable,{
		constructor:function(/*IEnumerator*/ enumerator) 
        {
            if (enumerator != null)
            {
                this._enumerator = enumerator; 
            }
            else 
            { 
                _enumerator = MS.Internal.Controls.EmptyEnumerator.Instance;
            } 
		},
		
//        IEnumerator IEnumerable.
        GetEnumerator:function()
        { 
            return this._enumerator;
        } 
	});
    
    Object.defineProperties(EnumeratorWrapper, {
//    	internal static EnumeratorWrapper 
    	Empty:
        {
            get:function()
            {
                if (EnumeratorWrapper_emptyInstance == null) 
                { 
                	EnumeratorWrapper_emptyInstance = new EnumeratorWrapper(null);
                } 

                return EnumeratorWrapper_emptyInstance;
            }
        }
    });
    
  
	
	var LogicalTreeHelper = declare("LogicalTreeHelper", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){

		}
	});
	
	Object.defineProperties(LogicalTreeHelper.prototype,{

	});
	
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
//    public static DependencyObject 
	LogicalTreeHelper.FindLogicalNode = function( /*DependencyObject*/ logicalTreeNode, /*string*/ elementName )
    { 
        if( logicalTreeNode == null ) 
        {
            throw new ArgumentNullException("logicalTreeNode"); 
        }
        if( elementName == null )
        {
            throw new ArgumentNullException("elementName"); 
        }
        if( elementName == String.Empty ) 
        { 
            throw new ArgumentException(SR.Get(SRID.StringEmpty), "elementName");
        } 

        /*DependencyObject*/var namedElement = null;
        /*DependencyObject*/var childNode = null;
 
        // Check given node against named element.
        /*IFrameworkInputElement*/var selfNode = logicalTreeNode instanceof IFrameworkInputElement ? logicalTreeNode : null; 
        if( selfNode != null ) 
        {
            if( selfNode.Name == elementName ) 
            {
                namedElement = logicalTreeNode;
            }
        } 

        if( namedElement == null ) 
        { 
            // Nope, the given node isn't it.  See if we can check children.
            /*IEnumerator*/ 
        	var childEnumerator = null; 

            childEnumerator = LogicalTreeHelper.GetLogicalChildren(logicalTreeNode);

            // If we can enumerate, check the children. 
            if( childEnumerator != null )
            { 
                childEnumerator.Reset(); 
                while( namedElement == null &&
                       childEnumerator.MoveNext() == true) 
                {
                    childNode = childEnumerator.Current;
                    child = child instanceof DependencyObject ? child : null;

                    if( childNode != null ) 
                    {
                        namedElement = FindLogicalNode( childNode, elementName ); 
                    } 
                }
            } 
        }

        // Return what we can find - may be null.
        return namedElement; 
    };
 
    /// <summary> 
    /// Get the logical parent of the given DependencyObject.
    /// The given DependencyObject must be either a FrameworkElement or FrameworkContentElement 
    /// to have a logical parent.
    /// </summary>
//    public static DependencyObject 
    LogicalTreeHelper.GetParent = function(/*DependencyObject*/ current)
    { 
        if (current == null)
        { 
            throw new ArgumentNullException("current"); 
        }
 
//      FrameworkElement 
        var fe = current instanceof FrameworkElement ? current : null;
        if (fe != null)
        {
            return fe.Parent; 
        }
 
        /*FrameworkContentElement*/
    	var fce = current instanceof FrameworkContentElement ? current : null;
        if (fce != null)
        { 
            return fce.Parent;
        }

        return null; 
    };
 
    /// <summary> 
    /// Get the logical children for the given DependencyObject.
    /// The given DependencyObject must be either a FrameworkElement or FrameworkContentElement 
    /// to have logical children.
    /// </summary>
//    public static IEnumerable 
    LogicalTreeHelper.GetChildren = function(/*DependencyObject*/ current)
    { 
        if (current == null)
        { 
            throw new ArgumentNullException("current"); 
        }
 
//      FrameworkElement 
        var fe = current instanceof FrameworkElement ? current : null; 
        if (fe != null)
        {
            return new EnumeratorWrapper(fe.LogicalChildren); 
        }
 
        /*FrameworkContentElement*/
    	var fce = current instanceof FrameworkContentElement ? current : null;
        if (fce != null)
        { 
            return new EnumeratorWrapper(fce.LogicalChildren);
        }

        return EnumeratorWrapper.Empty; 
    };
 
    /// <summary> 
    /// Get the logical children for the given FrameworkElement
    /// </summary> 
////    public static IEnumerable 
//    LogicalTreeHelper.GetChildren = function(/*FrameworkElement*/ current)
//    {
//        if (current == null)
//        { 
//            throw new ArgumentNullException("current");
//        } 
// 
//        return new EnumeratorWrapper(current.LogicalChildren);
//    }; 

//    /// <summary>
//    /// Get the logical children for the given FrameworkContentElement
//    /// </summary> 
////    public static IEnumerable 
//    LogicalTreeHelper.GetChildren = function(/*FrameworkContentElement*/ current)
//    { 
//        if (current == null) 
//        {
//            throw new ArgumentNullException("current"); 
//        }
//
//        return new EnumeratorWrapper(current.LogicalChildren);
//    }; 

    /// <summary> 
    /// Attempts to bring this element into view by originating a RequestBringIntoView event. 
    /// </summary>
//    public static void 
    LogicalTreeHelper.BringIntoView = function(/*DependencyObject*/ current) 
    {
        if (current == null)
        {
            throw new ArgumentNullException("current"); 
        }
 
//        FrameworkElement 
        var fe = current instanceof FrameworkElement ? current : null; 
        if (fe != null)
        { 
            fe.BringIntoView();
        }

        /*FrameworkContentElement*/
    	var fce = current instanceof FrameworkContentElement ? current : null;
        if (fce != null)
        { 
            fce.BringIntoView(); 
        }
    };


////    internal static void 
//    LogicalTreeHelper.AddLogicalChild = function(/*DependencyObject*/ parent, /*object*/ child)
//    {
//
//        if (child != null && parent != null) 
//        {
//            /*FrameworkElement*/
//        	var parentFE = parent instanceof FrameworkElement ? parent : null; 
//            if (parentFE != null) 
//            {
//                parentFE.AddLogicalChild(child); 
//            }
//            else
//            {
//                /*FrameworkContentElement*/
//            	var parentFCE = parent instanceof FrameworkContentElement ? parent : null;
//                if (parentFCE != null)
//                { 
//                    parentFCE.AddLogicalChild(child); 
//                }
//            } 
//        }
//    };

//    internal static void 
    LogicalTreeHelper.AddLogicalChild = function(/*FrameworkElement*/ parentFE, /*FrameworkContentElement*/ parentFCE, /*object*/ child) 
    {
    	if(arguments.length == 2){
            if (parentFCE != null && parentFE != null) 
            {
                /*FrameworkElement*/
            	parentFE = parentFE instanceof FrameworkElement ? parentFE : null; 
                if (parentFE != null) 
                {
                    parentFE.AddLogicalChild(child); 
                }
                else
                {
                    /*FrameworkContentElement*/
                	parentFCE = parentFE instanceof FrameworkContentElement ? parentFE : null;
                    if (parentFCE != null)
                    { 
                        parentFCE.AddLogicalChild(child); 
                    }
                } 
            }
    	}else if(arguments.length == 3){
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

    };
 
////    internal static void 
//    LogicalTreeHelper.RemoveLogicalChild = function(/*DependencyObject*/ parent, /*object*/ child)
//    {
//        if (child != null && parent != null)
//        { 
//            /*FrameworkElement*/
//        	var parentFE = parent instanceof FrameworkElement ? parent : null;
//            if (parentFE != null) 
//            { 
//                parentFE.RemoveLogicalChild(child);
//            } 
//            else
//            {
//                /*FrameworkContentElement*/
//            	var parentFCE = parent instanceof FrameworkContentElement ? parent : null;
//                if (parentFCE != null) 
//                {
//                    parentFCE.RemoveLogicalChild(child); 
//                } 
//            }
//        } 
//    };

//    internal static void 
    LogicalTreeHelper.RemoveLogicalChild = function(/*FrameworkElement*/ parentFE, 
    		/*FrameworkContentElement*/ parentFCE, /*object*/ child)
    { 
    	if(arguments.length == 2){
            if (parentFCE != null && parentFE != null)
            { 
                /*FrameworkElement*/
            	parentFE = parentFE instanceof FrameworkElement ? parentFE : null;
                if (parentFE != null) 
                { 
                    parentFE.RemoveLogicalChild(child);
                } 
                else
                {
                    /*FrameworkContentElement*/
                	var parentFCE = parentFE instanceof FrameworkContentElement ? parentFE : null;
                    if (parentFCE != null) 
                    {
                        parentFCE.RemoveLogicalChild(child); 
                    } 
                }
            } 
    	}else if(arguments.length == 3){
            if (child != null)
            { 
//                Debug.Assert(parentFE != null || parentFCE != null, "Either parentFE or parentFCE should be non-null"); 
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

    };
 
//    internal static IEnumerator 
    LogicalTreeHelper.GetLogicalChildren = function(/*DependencyObject*/ current)
    {
//      FrameworkElement 
        var fe = current instanceof FrameworkElement ? current : null; 
        if (fe != null) 
        {
            return fe.LogicalChildren; 
        } 

        /*FrameworkContentElement*/
    	var fce = current instanceof FrameworkContentElement ? current : null; 
        if (fce != null)
        {
            return fce.LogicalChildren;
        } 

        return EmptyEnumerator.Instance; 
    };
	
	LogicalTreeHelper.Type = new Type("LogicalTreeHelper", LogicalTreeHelper, [Object.Type]);
	return LogicalTreeHelper;
});
 

