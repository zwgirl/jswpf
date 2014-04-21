/**
 * ResizeMode
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var ResizeMode = declare("ResizeMode", Object, { 
    });	
    
    /// <summary>
    ///     User cannot resize the Window. Maximize and Minimize boxes 
    ///     do not show in the caption bar.
    /// </summary>
    ResizeMode.NoResize = 0,

    /// <summary>
    ///     User can only minimize the Window.  Minimize box is shown and enabled 
    ///     in the caption bar while the Maximize box is disabled. 
    /// </summary>
    ResizeMode.CanMinimize = 1, 

    /// <summary>
    ///     User can fully resize the Window including minimize and maximize.
    ///     Both Maximize and Minimize boxes are shown and enabled in the caption 
    ///     bar.
    /// </summary> 
    ResizeMode.CanResize = 2, 

    /// <summary> 
    ///     Same as CanResize and ResizeGrip will show
    /// </summary>
    ResizeMode.CanResizeWithGrip = 3;

//    ResizeMode.Type = new Type("ResizeMode", ResizeMode, [Object.Type]);
    return ResizeMode;
}); 
