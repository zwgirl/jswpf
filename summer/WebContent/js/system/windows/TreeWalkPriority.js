/**
 * From DescendentsWalkerBase
 * TreeWalkPriority
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var TreeWalkPriority = declare("TreeWalkPriority", Object, { 
    });	
    
    /**
     * Traverse Logical Tree first
     */
    TreeWalkPriority.LogicalTree = 0;

    /**
     *  Traverse Visual Tree first 
     */
    TreeWalkPriority.VisualTree=1; 

//    Visibility.Type = new Type("Visibility", Visibility, [Object.Type]);
    return TreeWalkPriority;
});
