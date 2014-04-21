/**
 * WindowStartupLocation
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var WindowStartupLocation = declare("WindowStartupLocation", Object, { 
    });	
    
    /// <summary> 
    /// Uses the values specified by Left and Top properties to position the Window
    /// </summary>
    WindowStartupLocation.Manual = 0,

    /// <summary>
    /// Centers the Window on the screen.  If there are more than one monitors, then 
    /// the Window is centered on the monitor that has the mouse on it 
    /// </summary>
    WindowStartupLocation.CenterScreen = 1, 

    /// <summary>
    /// Centers the Window on its owner.  If there is no owner window defined or if
    /// it is not possible to center it on the owner, then defaults to Manual 
    /// </summary>
    WindowStartupLocation.CenterOwner = 2;

//    WindowStartupLocation.Type = new Type("WindowStartupLocation", WindowStartupLocation, [Object.Type]);
    return WindowStartupLocation;
}); 
