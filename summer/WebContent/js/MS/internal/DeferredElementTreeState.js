/**
 * DeferredElementTreeState
 */

define(["dojo/_base/declare", "system/Type", "generic/Dictionary"], 
		function(declare, Type, HeaderedContentControl, Dictionary){
	var Visual =null;
	function EnsureVisual(){
		if(Visual == null){
			Visual = using("media/Visual");
		}
		return Visual;
	}
	
	var UIElement =null;
	function EnsureUIElement(){
		if(UIElement == null){
			UIElement = using("windows/UIElement");
		}
		return UIElement;
	}
	
	var ContentElement =null;
	function EnsureContentElement(){
		if(ContentElement == null){
			ContentElement = using("windows/ContentElement");
		}
		return ContentElement;
	}
	
	var DeferredElementTreeState = declare("DeferredElementTreeState", Object,{
		constructor:function(){
//	        private Dictionary<DependencyObject, DependencyObject> 
			this._oldCoreParents = new Dictionary/*<DependencyObject, DependencyObject>*/();
//	        private Dictionary<DependencyObject, DependencyObject> 
			this._oldLogicalParents = new Dictionary/*<DependencyObject, DependencyObject>*/(); 
		},
//		public void 
		SetCoreParent:function(/*DependencyObject*/ element, /*DependencyObject*/ parent)
        {
            if(!this._oldCoreParents.ContainsKey(element))
            { 
                this._oldCoreParents.Set(element, parent);
            } 
        },
        
//        public void 
        SetLogicalParent:function(/*DependencyObject*/ element, /*DependencyObject*/ parent) 
        {
            if(!this._oldLogicalParents.ContainsKey(element))
            {
            	this._oldLogicalParents.Set(element, parent); 
            }
        },
        
//        public void 
        Clear:function() 
        {
            this._oldCoreParents.Clear(); 
            this._oldLogicalParents.Clear();
        }
        
	});
	
	Object.defineProperties(DeferredElementTreeState.prototype,{
//        public bool 
		IsEmpty: 
        {
            get:function() 
            { 
                return this._oldCoreParents.Count == 0 && this._oldLogicalParents.Count == 0;
            } 
        }  
	});
	
//	public static DependencyObject 
	DeferredElementTreeState.GetCoreParent = function(/*DependencyObject*/ element, /*DeferredElementTreeState*/ treeState) 
    {
        /*DependencyObject*/var parent = null;

        if(treeState != null && treeState._oldCoreParents.ContainsKey(element)) 
        {
            parent = treeState._oldCoreParents.Get(element); 
        } 
        else
        { 
//            /*Visual*/var v = element instanceof EnsureVisual() ? element : null;
//            if(v != null)
//            {
//                parent = VisualTreeHelper.GetParent(v); 
//            }
//            else 
//            { 
//                /*ContentElement*/var ce = element instanceof EnsureContentElement() ? element : null;
//                if(ce != null) 
//                {
//                    parent = ContentOperations.GetParent(ce);
//                }
//            } 
        	parent = ContentOperations.GetParent(element);
        }

        return parent; 
    };

//    public static DependencyObject 
    DeferredElementTreeState.GetInputElementParent = function(/*DependencyObject*/ element, /*DeferredElementTreeState*/ treeState)
    {
        /*DependencyObject*/var parent = element;

        while (true)
        { 
            parent = DeferredElementTreeState.GetCoreParent(parent, treeState); 

            if (parent == null || InputElement.IsValid(parent)) 
            {
                break;
            }
        } 

        return parent; 
    };
    
//    public static DependencyObject 
    DeferredElementTreeState.GetLogicalParent = function(/*DependencyObject*/ element, /*DeferredElementTreeState*/ treeState)
    { 
        /*DependencyObject*/var parent = null;

        if(treeState != null && treeState._oldLogicalParents.ContainsKey(element))
        { 
            parent = treeState._oldLogicalParents.Get(element);
        } 
        else 
        {
//            var e = element instanceof EnsureUIElement() ? o :null; 
//            if(e != null)
//            {
//                parent = e.GetUIParentCore();  // Overriden by FrameworkElement.
//            } 
//
//            var ce = element instanceof EnsureContentElement() ? o :null; 
//            if(ce != null) 
//            {
//                parent = ce.GetUIParentCore(); // Overriden by FrameworkContentElement. 
//            }
        	parent = element.GetUIParentCore();
        }

        return parent; 
    };
	
	DeferredElementTreeState.Type = new Type("DeferredElementTreeState", DeferredElementTreeState, [Object.Type]);
	return DeferredElementTreeState;
});
