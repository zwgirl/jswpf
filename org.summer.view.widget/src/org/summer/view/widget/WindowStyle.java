package org.summer.view.widget;
//#region Enums

/// <summary>
/// WindowStyle
/// </summary>
public enum WindowStyle 
{
    /// <summary> 
    /// no border at all  also implies no caption 
    /// </summary>
    None = 0,                                               // no border at all  also implies no caption 

    /// <summary>
    /// SingleBorderWindow
    /// </summary> 
    SingleBorderWindow = 1,                                    // WS_BORDER

    /// <summary> 
    /// 3DBorderWindow
    /// </summary> 
    ThreeDBorderWindow = 2,                                    // WS_BORDER | WS_EX_CLIENTEDGE

    /// <summary>
    /// FixedToolWindow 
    /// </summary>
    ToolWindow = 3,                                           // WS_BORDER | WS_EX_TOOLWINDOW 

    // NOTE: if you add or remove any values in this enum, be sure to update Window.IsValidWindowStyle()
} 