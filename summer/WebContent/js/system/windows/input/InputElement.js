/**
 * InputElement
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObjectType"],
		function(declare, Type, DependencyObjectType){
	
    var Visual = null;
    function EnsureVisual(){
    	if(Visual == null){
    		Visual = using("media/Visual");
    	}
    	
    	return Visual;
    }
    
	var InputElement = declare("InputElement", null,{
	});
	
	Object.defineProperties(InputElement,{
        // Caches the ContentElement's DependencyObjectType
//        private static DependencyObjectType 
        ContentElementType:
        {
        	get:function(){
        		if(InputElement._ContentElementType === undefined){
        			InputElement._ContentElementType = DependencyObjectType.FromSystemTypeInternal(ContentElement.Type);
        		}
        		
        		return InputElement._ContentElementType;
        		
        	}
        }, 

        // Caches the UIElement's DependencyObjectType 
//        private static DependencyObjectType 
        UIElementType:
        {
        	get:function(){
        		if(InputElement._UIElementType === undefined){
        			InputElement._UIElementType = DependencyObjectType.FromSystemTypeInternal(UIElement.Type); 
        		}
        		
        		return InputElement._UIElementType;
        	}
            
        },

	});
	
//	// Return whether the InputElement is one of our types. 
////    internal static bool 
//    InputElement.IsValid = function(/*IInputElement*/ e) 
//    {
//        /*DependencyObject*/var o = e instanceof DependencyObject ? o :null; 
//        return IsValid(o);
//    };

//    internal static bool 
    InputElement.IsValid = function(/*DependencyObject*/ o) 
    {
        return this.IsUIElement(o) || this.IsContentElement(o)/* || IsUIElement3D(o)*/; 

    };

    // Returns whether the given DynamicObject is a UIElement or not.
//    internal static bool 
    InputElement.IsUIElement = function(/*DependencyObject*/ o)
    {
        return InputElement.UIElementType.IsInstanceOfType(o); 
    };

    // Returns whether the given DynamicObject is a ContentElement or not. 
//    internal static bool 
    InputElement.IsContentElement = function(/*DependencyObject*/ o)
    { 
        return InputElement.ContentElementType.IsInstanceOfType(o); 
    };

    // Returns the containing input element of the given DynamicObject.
    // If onlyTraverse2D is set to true, then we stop once we see a 3D object and return null
//    internal static DependencyObject 
    InputElement.GetContainingUIElement = function(/*DependencyObject*/ o, /*bool*/ onlyTraverse2D)
    { 
    	
    	if(onlyTraverse2D===undefined){
    		onlyTraverse2D=false;
    	}
        /*DependencyObject*/var container = null;
        /*Visual*/var v; 

        if(o != null) 
        {
            if(this.IsUIElement(o))
            {
                container = o; 
            }
            else if(this.IsContentElement(o))
            {
                /*DependencyObject*/var parent = ContentOperations.GetParent(o);
                if(parent != null) 
                {
                    container = this.GetContainingUIElement(parent, onlyTraverse2D); 
                } 
                else
                { 
                    //
                    parent = o.GetUIParentCore(); 
                    if(parent != null)
                    { 
                        container = this.GetContainingUIElement(parent, onlyTraverse2D); 
                    }
                } 
            }
            else if ((v = (o instanceof EnsureVisual() ? o : null)) != null)
            {
                /*DependencyObject*/var parent = VisualTreeHelper.GetParent(v); 
                if(parent != null)
                { 
                    container = this.GetContainingUIElement(parent, onlyTraverse2D); 
                }
            } 
        } 

        return container;
    };

//    // Returns the containing input element of the given DynamicObject.
////    internal static DependencyObject 
//    InputElement.GetContainingUIElement = function(/*DependencyObject*/ o) 
//    { 
//        return GetContainingUIElement(o, false);
//    } ;


    // Returns the containing input element of the given DynamicObject.
    // If onlyTraverse2D is set to true, then we stop once we see a 3D object and return null 
//    internal static IInputElement 
    InputElement.GetContainingInputElement = function(/*DependencyObject*/ o, /*bool*/ onlyTraverse2D)
    { 
    	if(onlyTraverse2D === undefined){
    		onlyTraverse2D = false;
    	}
        /*IInputElement*/var container = null; 
        /*Visual*/var v;

        if(o != null)
        {
            if(this.IsUIElement(o)) 
            {
                container = /*(UIElement)*/ o; 
            } 
            else if(this.IsContentElement(o))
            { 
                container = /*(ContentElement)*/ o;
            }
            else if((v = o instanceof EnsureVisual() ? o : null) != null) 
            {
                /*DependencyObject*/var parent = VisualTreeHelper.GetParent(v); 
                if(parent != null)
                {
                    container = GetContainingInputElement(parent, onlyTraverse2D);
                } 
            }
        }

        return container; 
    };

//    // Returns the containing input element of the given DynamicObject.
//    //
////    internal static IInputElement 
//    InputElement.GetContainingInputElement = function(/*DependencyObject*/ o)
//    { 
//        return GetContainingInputElement(o, false);
//    }; 

    // Returns the containing visual of the given DynamicObject.
//    internal static DependencyObject 
    InputElement.GetContainingVisual = function(/*DependencyObject*/ o) 
    {
        /*DependencyObject*/var v = null;

        if(o != null) 
        {
            if(this.IsUIElement(o)) 
            { 
                v = /*(Visual)*/o;
            } 
            else if(this.IsContentElement(o))
            { 
                /*DependencyObject*/var parent = ContentOperations.GetParent(o); 
                if(parent != null)
                { 
                    v = this.GetContainingVisual(parent);
                }
                else
                { 
                    //
                    parent = o.GetUIParentCore();
                    if(parent != null) 
                    {
                        v = this.GetContainingVisual(parent);
                    }
                } 
            }
            else 
            { 
                v = o instanceof EnsureVisual() ? o : null;
            }
        } 

        return v;
    }; 

//    // Returns the root visual of the containing element.
////    internal static DependencyObject 
//    InputElement.GetRootVisual(/*DependencyObject*/ o)
//    { 
//        return GetRootVisual(o, true /* enable2DTo3DTransition */);
//    }; 

//    internal static DependencyObject 
    InputElement.GetRootVisual = function(/*DependencyObject*/ o, /*bool*/ enable2DTo3DTransition)
    { 
    	if(enable2DTo3DTransition === undefined){
    		enable2DTo3DTransition = false;
    	}
        /*DependencyObject*/var rootVisual = this.GetContainingVisual(o);
        /*DependencyObject*/var parentVisual;

        while(rootVisual != null && ((parentVisual = VisualTreeHelper.GetParent(rootVisual)) != null)) 
        {
//            // if we are not supposed to transition from 2D to 3D and the root 
//            // is a Visual and the parent is a Visual3D break 
//            if (!enable2DTo3DTransition &&
//                 rootVisual instanceof EnsureVisual() && parentVisual instanceof Visual3D) 
//
//            {
//                break;
//            } 

            rootVisual = parentVisual; 
        } 


        return rootVisual;
    };
    
	InputElement.Type = new Type("InputElement", InputElement, [Object.Type]);
	return InputElement;
});
 

