package org.summer.view.widget;
/// <summary>
///     ResizeMode
/// </summary> 
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)]
public enum ResizeMode 
{ 
    /// <summary>
    ///     User cannot resize the Window. Maximize and Minimize boxes 
    ///     do not show in the caption bar.
    /// </summary>
    NoResize = 0,

    /// <summary>
    ///     User can only minimize the Window.  Minimize box is shown and enabled 
    ///     in the caption bar while the Maximize box is disabled. 
    /// </summary>
    CanMinimize = 1, 

    /// <summary>
    ///     User can fully resize the Window including minimize and maximize.
    ///     Both Maximize and Minimize boxes are shown and enabled in the caption 
    ///     bar.
    /// </summary> 
    CanResize = 2, 

    /// <summary> 
    ///     Same as CanResize and ResizeGrip will show
    /// </summary>
    CanResizeWithGrip = 3

    // NOTE: if you add or remove any values in this enum, be sure to update Window.IsValidResizeMode()
} 
//#endregion Enums 