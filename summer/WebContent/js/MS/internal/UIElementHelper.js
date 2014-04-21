/**
 * UIElementHelper
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var UIElementHelper = declare("UIElementHelper", null,{

	});
	
	var UIElement = null;
	function EnsureUIElement(){
		if(UIElement == null){
			UIElement = using("windows/UIElement");
		}
		
		return UIElement;
	}
	
//	internal static bool 
	UIElementHelper.IsHitTestVisible = function(/*DependencyObject*/ o) 
    { 
        /*UIElement*/var oAsUIElement = o instanceof EnsureUIElement() ? o : null;
        if (oAsUIElement != null)
        {
            return oAsUIElement.IsHitTestVisible; 
        }
    };

//    internal static bool 
    UIElementHelper.IsVisible = function(/*DependencyObject*/ o) 
    {
        /*UIElement*/var oAsUIElement = o instanceof EnsureUIElement() ? o : null;
        if (oAsUIElement != null) 
        {
            return oAsUIElement.IsVisible;
        }
    };

//    internal static DependencyObject 
    UIElementHelper.PredictFocus = function(/*DependencyObject*/ o, /*FocusNavigationDirection*/ direction)
    {
        /*UIElement*/var oAsUIElement = o instanceof EnsureUIElement() ? o : null; 
        if (oAsUIElement != null) 
        {
            return oAsUIElement.PredictFocus(direction); 
        }
    }; 

//    internal static UIElement 
    UIElementHelper.GetContainingUIElement2D = function(/*DependencyObject*/ reference) 
    {
        /*UIElement*/var element = null;

        while (reference != null) 
        {
            element = reference instanceof EnsureUIElement() ? reference : null; 

            if (element != null) break;

            reference = VisualTreeHelper.GetParent(reference);
        }

        return element; 
    };


//    internal static DependencyObject 
    UIElementHelper.GetUIParent = function(/*DependencyObject*/ child, /*bool*/ continuePastVisualTree) 
    {
    	if(continuePastVisualTree === undefined){
    		continuePastVisualTree= false;
    	}
        /*DependencyObject*/var parent = null; 
        /*DependencyObject*/var myParent = null;

        // Try to find a UIElement parent in the visual ancestry.
        if (child instanceof Visual) 
        {
            myParent = child.InternalVisualParent; 
        } 

        parent = InputElement.GetContainingUIElement(myParent);
        parent = parent instanceof DependencyObject ? parent : null;  

        // If there was no UIElement parent in the visual ancestry, 
        // check along the logical branch. 
        if(parent == null && continuePastVisualTree)
        { 
            /*UIElement*/var childAsUIElement = child instanceof EnsureUIElement() ? child : null;
            if (childAsUIElement != null)
            {
                parent = InputElement.GetContainingInputElement(childAsUIElement.GetUIParentCore());
                parent = parent instanceof DependencyObject ? parent : null; 
            }
        }

        return parent; 
    };

//    internal static bool 
    UIElementHelper.IsUIElementOrUIElement3D = function(/*DependencyObject*/ o)
    {
        return (o instanceof EnsureUIElement()); 
    };
	
	UIElementHelper.Type = new Type("UIElementHelper", UIElementHelper, [Object.Type]);
	return UIElementHelper;
});
    


