/**
 * WindowState
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var WindowState = declare("WindowState", Object, { 
    });	
    
    /// <summary>
    /// Default size 
    /// </summary>
    WindowState.Normal = 0,

    /// <summary> 
    /// Minimized
    /// </summary> 
    WindowState.Minimized = 1,   // WS_MINIMIZE 

    /// <summary> 
    /// Maximized
    /// </summary>
    WindowState.Maximized = 2;   // WS_MAXIMIZE 

//    WindowState.Type = new Type("WindowState", WindowState, [Object.Type]);
    return WindowState;
});
