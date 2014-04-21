/**
 * WindowStyle
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var WindowStyle = declare("WindowStyle", Object, { 
    });	
    
    /// <summary> 
    /// no border at all  also implies no caption 
    /// </summary>
    WindowStyle.None = 0,                                               // no border at all  also implies no caption 

    /// <summary>
    /// SingleBorderWindow
    /// </summary> 
    WindowStyle.SingleBorderWindow = 1,                                    // WS_BORDER

    /// <summary> 
    /// 3DBorderWindow
    /// </summary> 
    WindowStyle.ThreeDBorderWindow = 2,                                    // WS_BORDER | WS_EX_CLIENTEDGE

    /// <summary>
    /// FixedToolWindow 
    /// </summary>
    WindowStyle.ToolWindow = 3;  

//    WindowStyle.Type = new Type("WindowStyle", WindowStyle, [Object.Type]);
    return WindowStyle;
});
