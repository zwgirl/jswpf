/**
 * VisualTreeUtils
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var VisualTreeUtils = declare("VisualTreeUtils", null,{
	});
	
    /// <summary> 
    ///     This walks up the Visual tree setting the given flags starting at the
    ///     given element. 
    /// </summary>
//    internal static void 
	VisualTreeUtils.PropagateFlags = function(
        /*DependencyObject*/ element,
        /*VisualFlags*/ flags, 
        /*VisualProxyFlags*/ proxyFlags)
    { 
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        };

        VisualTreeUtils.AsVisualInternal(element, visualOut/*out visual*/);
        visual = visualOut.visual;

        if (visual != null)
        { 
        	EnsureVisual2().PropagateFlags(visual, flags, proxyFlags);
        } 
    };

    /// <summary> 
    ///     Walks up the Visual tree setting or clearing the given flags.  Unlike
    ///     PropagateFlags this does not terminate when it reaches node with 
    ///     the flags already set.  It always walks all the way to the root. 
    /// </summary>
//    internal static void 
    VisualTreeUtils.SetFlagsToRoot = function(/*DependencyObject*/ element, /*bool*/ value, /*VisualFlags*/ flags) 
    {
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        };

        VisualTreeUtils.AsVisualInternal(element, visualOut/*out visual*/);
        visual = visualOut.visual;
        
        if (visual != null) 
        {
            visual.SetFlagsToRoot(value, flags); 
        }
    };

    /// <summary>
    ///     Finds the first ancestor of the given element which has the given 
    ///     flags set.
    /// </summary>
//    internal static DependencyObject 
    VisualTreeUtils.FindFirstAncestorWithFlagsAnd = function(/*DependencyObject*/ element, /*VisualFlags*/ flags)
    { 
        /*Visual*/var visual;
        var visualOut = {
        	"visual" : visual
        };
        VisualTreeUtils.AsVisualInternal(element, visualOut/*out visual*/);
        visual = visualOut.visual;

        if (visual != null)
        {
            return visual.FindFirstAncestorWithFlagsAnd(flags);
        } 

        return null;
    };


    /// <summary> 
    ///     Throws if the given element is null or is not a Visual or Visual3D
    ///     or if the Visual is on the wrong thread. 
    /// </summary>
//    internal static void 
    VisualTreeUtils.EnsureNonNullVisual = function(/*DependencyObject*/ element)
    {
        EnsureVisual(element, /* allowNull = */ false); 
    };

    /// <summary> 
    ///     Throws if the given element is null or is not a Visual or Visual3D
    ///     or if the Visual is on the wrong thread. 
    /// </summary>
//    internal static void 
    VisualTreeUtils.EnsureVisual = function(/*DependencyObject*/ element)
    {
        EnsureVisual(element, /* allowNull = */ true); 
    };

    /// <summary> 
    ///     Throws if the given element is not a Visual or Visual3D
    ///     or if the Visual is on the wrong thread. 
    /// </summary>
//    private static void 
    function EnsureVisual(/*DependencyObject*/ element, /*bool*/ allowNull)
    {
        if (element == null) 
        {
            if (!allowNull) 
            { 
                throw new ArgumentNullException("element");
            } 

            return;
        }

        //
        if (!(element instanceof EnsureVisual2())) 
        { 
            throw new ArgumentException(SR.Get(SRID.Visual_NotAVisual));
        } 

//        element.VerifyAccess();
    }

    /// <summary>
    ///     Throws if the given element is null or not a visual type, otherwise 
    ///     either visual or visual3D will be non-null on exit. 
    /// </summary>
//    internal static void 
    VisualTreeUtils.AsNonNullVisual = function(/*DependencyObject*/ element, visualOut/*out Visual visual*/) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        VisualTreeUtils.AsVisual(element, visualOut/*out visual*/); 
    };

    /// <summary> 
    ///     Returns null if the given element is null, otherwise visual or visual3D
    ///     will be the strong visual type on exit. 
    /// 
    ///     Throws an exception if element is a non-Visual type.
    /// </summary> 
//    internal static void 
    VisualTreeUtils.AsVisual = function(/*DependencyObject*/ element, visualOut/*out Visual visual*/)
    {
        var castSucceeded = AsVisualHelper(element, visualOut/*out visual*/);

        if (element != null)
        { 
            if (!castSucceeded) 
            {
                throw new System.InvalidOperationException(SR.Get(SRID.Visual_NotAVisual, element.GetType())); 
            }

//            element.VerifyAccess(); 
        } 
    };

    /// <summary> 
    ///     Internal helper to cast to DO to Visual or Visual3D.  Asserts 
    ///     that the DO is really a Visual type.  Null is allowed.  Does not
    ///     VerifyAccess. 
    ///
    ///     Caller is responsible for guaranteeing that element is a Visual type.
    /// </summary>
//    internal static bool 
    VisualTreeUtils.AsVisualInternal = function(/*DependencyObject*/ element, visualOut/*out Visual visual*/) 
    {
        /*bool*/var castSucceeded = AsVisualHelper(element, visualOut/*out visual*/); 

        return castSucceeded; 
    }; 

    // Common code for AsVisual and AsVisualInternal -- Don't call this.
//    private static bool 
    function AsVisualHelper(/*DependencyObject*/ element, visualOut/*out Visual visual*/) 
    { 
        /*Visual*/ elementAsVisual = element instanceof EnsureVisual2() ? element : null;

        if (elementAsVisual != null)
        {
        	visualOut.visual = elementAsVisual;
            return true;
        } 


        visualOut.visual = null;
        return false;
    }
    
    var Visual = null;
    
    function EnsureVisual2(){
    	if(Visual == null){
    		Visual = using("media/Visual");
    	}
    	
    	return Visual;
    }
	
	VisualTreeUtils.Type = new Type("VisualTreeUtils", VisualTreeUtils, [Object.Type]);
	return VisualTreeUtils;
});

 

