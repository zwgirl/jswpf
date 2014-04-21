/**
 * VisualTreeHelper
 */

define(["dojo/_base/declare", "system/Type", "media/VisualTreeUtils"], 
		function(declare, Type, VisualTreeUtils){
	var VisualTreeHelper = declare("VisualTreeHelper", null,{
	});
	
//    private static void 
    function CheckVisualReferenceArgument(/*DependencyObject*/ reference)
    {
        if (reference == null) 
        {
            throw new ArgumentNullException("reference"); 
        } 
    }

    /// <summary>
    /// Return true if the given DependencyObject is a non-null visual type.
    /// This is useful as a precondition for many of the VisualTreeHelper methods,
    /// to avoid exceptions. 
    /// </summary>
    // 
//    internal static bool 
    VisualTreeHelper.IsVisualType = function(/*DependencyObject*/ reference)
    { 
        return (reference instanceof EnsureVisual());
    };

    /// <summary> 
    /// Get the number of children of the specified Visual.
    /// </summary> 
//    public static int 
    VisualTreeHelper.GetChildrenCount = function(/*DependencyObject*/ reference) 
    {
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        }; 

        VisualTreeUtils.AsNonNullVisual(reference, visualOut/*out visual*/);
        visual = visualOut.visual;
        //
        // Even though visual is a 2D visual, it still may have
        // 3D children. 
        //
        return visual.InternalVisualChildrenCount; //InternalVisual2DOr3DChildrenCount; 
    }; 

    /// <summary> 
    /// Returns the child of Visual visual at the specified index.
    /// </summary>
//    public static DependencyObject 
    VisualTreeHelper.GetChild = function(/*DependencyObject*/ reference, /*int*/ childIndex)
    { 
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        }; 

        VisualTreeUtils.AsNonNullVisual(reference, visualOut/*out visual*/);
        visual = visualOut.visual;
        // 
        // Even though visual is a 2D visual, it still may have
        // 3D children. 
        //
//        return visual.InternalGet2DOr3DVisualChild(childIndex);
        return visual.InternalGetVisualChild(childIndex);
    };

    /// <summary>
    /// Visual parent of this Visual. 
    /// </summary> 
//    public static DependencyObject 
    VisualTreeHelper.GetParent = function(/*DependencyObject*/ reference)
    { 
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        }; 

        VisualTreeUtils.AsNonNullVisual(reference, visualOut/*out visual*/);
        visual = visualOut.visual;


        return visual.InternalVisualParent;
    }; 

    /// <summary> 
    /// Equivalent to GetParent except that it does not VerifyAccess and only asserts 
    /// in
//    internal static DependencyObject 
    VisualTreeHelper.GetParentInternal = function(/*DependencyObject*/ reference)
    { 
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        }; 

        VisualTreeUtils.AsVisualInternal(reference, visualOut/*out visual*/);
        visual = visualOut.visual;

        if (visual != null)
        { 
            return visual.InternalVisualParent;
        } 

        return null; 
    }; 

    /// <summary> 
    /// Returns the closest Visual that contains the given DependencyObject
    /// </summary>
//    internal static Visual 
    VisualTreeHelper.GetContainingVisual2D = function(/*DependencyObject*/ reference)
    { 
        var visual = null;

        while (reference != null) 
        {
            visual = reference instanceof EnsureVisual() ? reference : null; 

            if (visual != null) break;

            reference = VisualTreeHelper.GetParent(reference); 
        }

        return visual; 
    };


//    internal static bool 
    VisualTreeHelper.IsAncestorOf = function(/*DependencyObject*/ reference, /*DependencyObject*/ descendant)
    {
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        }; 

        VisualTreeUtils.AsNonNullVisual(reference, visualOut/*out visual*/);
        visual = visualOut.visual;

        return visual.IsAncestorOf(descendant); 
    };

    // a version of IsAncestorOf that stops looking when it finds an ancestor 
    // of the given type
//    internal static bool 
    VisualTreeHelper.IsAncestorOf = function(/*DependencyObject*/ ancestor, /*DependencyObject*/ descendant, /*Type*/ stopType)
    {
        if (ancestor == null) 
        {
            throw new ArgumentNullException("ancestor"); 
        } 
        if (descendant == null)
        { 
            throw new ArgumentNullException("descendant");
        }

        VisualTreeUtils.EnsureVisual(ancestor); 
        VisualTreeUtils.EnsureVisual(descendant);

        // Walk up the parent chain of the descendant until we run out of parents, 
        // or we find the ancestor, or we reach a node of the given type.
        /*DependencyObject*/var current = descendant; 

        while ((current != null) && (current != ancestor) && !stopType.IsInstanceOfType(current))
        {
            var visual; 

            if ((visual = current instanceof EnsureVisual() ? current : null) != null) 
            {
                current = visual.InternalVisualParent; 
            }
            else 
            { 
                current = null;
            } 
        }

        return current == ancestor;
    }; 

//    internal static DependencyObject 
    VisualTreeHelper.FindCommonAncestor = function(/*DependencyObject*/ reference, /*DependencyObject*/ otherVisual) 
    { 
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        }; 

        VisualTreeUtils.AsNonNullVisual(reference, visualOut/*out visual*/);
        visual = visualOut.visual;

        return visual.FindCommonVisualAncestor(otherVisual);
    };


    /// <summary> 
    /// Gets the opacity of the Visual.
    /// </summary> 
//    public static double 
    VisualTreeHelper.GetOpacity = function(/*Visual*/ reference) 
    {
        return reference.VisualOpacity;
    };
    
    var Visual = null;
    function EnsureVisual(){
    	if(Visual == null){
    		Visual = using("media/Visual");
    	}
    	
    	return Visual;
    }

	
	VisualTreeHelper.Type = new Type("VisualTreeHelper", VisualTreeHelper, [Object.Type]);
	return VisualTreeHelper;
});
 


