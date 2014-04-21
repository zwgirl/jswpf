package org.summer.view.widget.controls;
//#region ScrollBarVisibility enum 

/// <summary> 
/// ScrollBarVisibilty defines the visibility behavior of a scrollbar.
/// </summary>
public enum ScrollBarVisibility
{ 
    /// <summary>
    /// No scrollbars and no scrolling in this dimension. 
    /// </summary> 
    Disabled ,//= 0,
    /// <summary> 
    /// The scrollbar should be visible only if there is more content than fits in the viewport.
    /// </summary>
    Auto,
    /// <summary> 
    /// The scrollbar should never be visible.  No space should ever be reserved for the scrollbar.
    /// </summary> 
    Hidden, 
    /// <summary>
    /// The scrollbar should always be visible.  Space should always be reserved for the scrollbar. 
    /// </summary>
    Visible,

    // NOTE: if you add or remove any values in this enum, be sure to update ScrollViewer.IsValidScrollBarVisibility() 
}

//#endregion 