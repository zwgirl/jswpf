/**
 * PlacementMode
 */
define(["dojo/_base/declare"], function(declare){

    var PlacementMode=declare("PlacementMode", null,{ 
    });	
    
    PlacementMode.Absolute = 0,
    PlacementMode.Relative = 1,
    PlacementMode.Bottom = 2,
    PlacementMode.Center = 3,
    PlacementMode.Right = 4,
    PlacementMode.AbsolutePoint = 5,
    PlacementMode.RelativePoint = 6,
	PlacementMode.Mouse = 7,
	PlacementMode.MousePoint = 8,
	PlacementMode.Left = 9,
	PlacementMode.Top = 10,
	PlacementMode.Custom = 11;
    
    return PlacementMode;
});
