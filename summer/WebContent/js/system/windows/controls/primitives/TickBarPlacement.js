/**
 * from TickBar
 * TickBarPlacement
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var TickBarPlacement = declare("TickBarPlacement", Object,{
	});
	
	/// <summary> 
    /// Position this tick at the left of target element.
    /// </summary>
	TickBarPlacement.Left = 0,

    /// <summary>
    /// Position this tick at the top of target element. 
    /// </summary> 
	TickBarPlacement.Top = 1,

    /// <summary>
    /// Position this tick at the right of target element.
    /// </summary>
	TickBarPlacement.Right = 2, 

    /// <summary> 
    /// Position this tick at the bottom of target element. 
    /// </summary>
	TickBarPlacement.Bottom = 3; 
	
	TickBarPlacement.Type = new Type("TickBarPlacement", TickBarPlacement, [Object.Type]);
	return TickBarPlacement;
});
