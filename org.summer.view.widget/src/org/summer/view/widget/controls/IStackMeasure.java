package org.summer.view.widget.controls;
/// <summary> 
///     Internal interface for elements which needs stack like measure
/// </summary> 
/*internal*/ public  interface IStackMeasure 
{
    boolean IsScrolling { get; } 
    UIElementCollection InternalChildren { get; }
    Orientation Orientation { get; }
    boolean CanVerticallyScroll { get; }
    boolean CanHorizontallyScroll { get; } 
    void OnScrollChange();
} 