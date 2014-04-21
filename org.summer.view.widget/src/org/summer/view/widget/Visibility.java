package org.summer.view.widget;
/// <summary>
/// Visibility - Enum which describes 3 possible visibility options.
/// </summary>
/// <seealso cref="UIElement" /> 
public enum Visibility //: byte
{ 
    /**
     * Normally visible.
     */
    Visible ,//= 0,

    /**
     * Occupies space in the layout, but is not visible (completely transparent). 
     */
    Hidden, 

    /**
     *  Not visible and does not occupy any space in layout, as if it doesn't exist. 
     */
    Collapsed,
}
