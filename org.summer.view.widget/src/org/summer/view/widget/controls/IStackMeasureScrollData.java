package org.summer.view.widget.controls;
/// <summary>
///     Internal interface for scrolling information of elements which 
///     need stack like measure.
/// </summary>
/*internal*/ public  interface IStackMeasureScrollData
{ 
    Vector Offset { get; set; }
    Size Viewport { get; set; } 
    Size Extent { get; set; } 
    Vector ComputedOffset { get; set; }
    void SetPhysicalViewport(double value); 
}