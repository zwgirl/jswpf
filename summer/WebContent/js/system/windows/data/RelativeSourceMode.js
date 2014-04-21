/**
 * From RelativeSource
 * RelativeSourceMode
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var RelativeSourceMode = declare("RelativeSourceMode", Object,{ 
    });	
    
    RelativeSourceMode.Type = new Type("RelativeSourceMode", RelativeSourceMode, [Object.Type]);
    
    RelativeSourceMode.PreviousData = 0;
    RelativeSourceMode.TemplatedParent = 1;
    RelativeSourceMode.Self = 2;
    RelativeSourceMode.FindAncestor = 3;

    
    return RelativeSourceMode;
});

///// <summary> This enum describes the type of RelativeSource
///// </summary> 
//public enum RelativeSourceMode
//{
//    /// <summary>use the DataContext from the previous scope
//    /// </summary> 
//    PreviousData,
//
//    /// <summary>use the target element's styled parent 
//    /// </summary>
//    TemplatedParent, 
//
//    /// <summary>use the target element itself
//    /// </summary>
//    Self, 
//
//    /// <summary>use the target element's ancestor of a specified Type 
//    /// </summary> 
//    FindAncestor
//} 
