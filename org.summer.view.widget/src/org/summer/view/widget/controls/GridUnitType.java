package org.summer.view.widget.controls;
/// <summary>
    /// GridUnitType enum is used to indicate what kind of value the 
    /// GridLength is holding. 
    /// </summary>
    // Note: Keep the GridUnitType enum in [....] with the string representation 
    //       of units (GridLengthConverter._unitString).
    public enum GridUnitType
    {
        /// <summary> 
        /// The value indicates that content should be calculated without constraints.
        /// </summary> 
        Auto ,//= 0, 
        /// <summary>
        /// The value is expressed as a pixel. 
        /// </summary>
        Pixel,
        /// <summary>
        /// The value is expressed as a weighted proportion of available space. 
        /// </summary>
        Star, 
    } 

