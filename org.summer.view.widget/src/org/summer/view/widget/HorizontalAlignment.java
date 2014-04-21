package org.summer.view.widget;
/// <summary>
    /// HorizontalAlignment - The HorizontalAlignment enum is used to describe 
    /// how element is positioned or stretched horizontally within a parent's layout slot. 
    /// </summary>
    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] 
    public enum HorizontalAlignment
    {
        /// <summary>
        /// Left - Align element towards the left of a parent's layout slot. 
        /// </summary>
        Left = 0, 
 
        /// <summary>
        /// Center - Center element horizontally. 
        /// </summary>
        Center = 1,

        /// <summary> 
        /// Right - Align element towards the right of a parent's layout slot.
        /// </summary> 
        Right = 2, 

        /// <summary> 
        /// Stretch - Stretch element horizontally within a parent's layout slot.
        /// </summary>
        Stretch = 3,
    } 

    /// <summary> 
    /// VerticalAlignment - The VerticalAlignment enum is used to describe 
    /// how element is positioned or stretched vertically within a parent's layout slot.
    /// </summary> 
    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)]
    