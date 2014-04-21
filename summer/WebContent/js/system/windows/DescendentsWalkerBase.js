/**
 * DescendentsWalkerBase
 */

define(["dojo/_base/declare", "system/Type", "utility/FrugalStructList", "media/VisualTreeHelper"], 
		function(declare, Type, FrugalStructList, VisualTreeHelper){
	
	var FrameworkElement = null;
	function EnsureFrameworkElement(){
		if(FrameworkElement == null){
			FrameworkElement = using("windows/FrameworkElement");
		}
		
		return FrameworkElement;
	}
	
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
 
            while ((ancestor != this._startNode) && (ancestor != null))
            { 
                /*DependencyObject*/var logicalParent; 

                if (EnsureFrameworkElement().DType.IsInstanceOfType(ancestor)) 
                {
                    /*FrameworkElement*/
                	var fe = ancestor instanceof EnsureFrameworkElement() ? ancestor : null;
                    logicalParent = fe.Parent;
                    // FrameworkElement 
                    /*DependencyObject*/var dependencyObjectParent = VisualTreeHelper.GetParent(fe);
                    if (dependencyObjectParent != null && logicalParent != null && dependencyObjectParent != logicalParent) 
                    { 
                        return this._nodes.Contains(ancestor);
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
 
 