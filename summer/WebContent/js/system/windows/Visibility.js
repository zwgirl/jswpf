/**
 * Visibility
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var Visibility = declare("Visibility", Object, { 
    });	
    
    /// Normally visible.
    Visibility.Visible = 0;

    /// Occupies space in the layout, but is not visible (completely transparent). 
    Visibility.Hidden=1; 

    /// Not visible and does not occupy any space in layout, as if it doesn't exist. 
    Visibility.Collapsed=2;

//    Visibility.Type = new Type("Visibility", Visibility, [Object.Type]);
    return Visibility;
});
