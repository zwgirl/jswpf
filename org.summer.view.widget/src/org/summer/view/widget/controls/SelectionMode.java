package org.summer.view.widget.controls;
/// <summary> 
///     The selection behavior for the ListBox.
/// </summary>
public enum SelectionMode
{ 
    /// <summary>
    ///     Only one item can be selected at a time. 
    /// </summary> 
    Single,
    /// <summary> 
    ///     Items can be toggled selected.
    /// </summary>
    Multiple,
    /// <summary> 
    ///     Items can be selected in groups using the SHIFT and mouse or arrow keys.
    /// </summary> 
    Extended 

    // NOTE: if you add or remove any values in this enum, be sure to update ListBox.IsValidSelectionMode() 
}