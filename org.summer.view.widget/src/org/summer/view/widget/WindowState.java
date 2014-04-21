package org.summer.view.widget;
/// <summary>
/// WindowState 
/// </summary>
public enum WindowState 
{ 
    /// <summary>
    /// Default size 
    /// </summary>
    Normal = 0,

    /// <summary> 
    /// Minimized
    /// </summary> 
    Minimized = 1,   // WS_MINIMIZE 

    /// <summary> 
    /// Maximized
    /// </summary>
    Maximized = 2   // WS_MAXIMIZE

    // NOTE: if you add or remove any values in this enum, be sure to update Window.IsValidWindowState()

//#if THEATRE_FULLSCREEN 
    // The following Two are not Implement yet
    /// <summary> 
    /// Theatre
    /// </summary>
    Theatre = 3,

    /// <summary>
    /// FullScreen 
    /// </summary> 
    FullScreen = 4
//#endif //THEATRE_FULLSCREEN 
}