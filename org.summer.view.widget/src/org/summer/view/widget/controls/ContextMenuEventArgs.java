package org.summer.view.widget.controls;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.RoutedEventArgs;

/// <summary>
/// The data sent on a ContextMenuEvent 
/// </summary>
public /*sealed*/ class ContextMenuEventArgs extends RoutedEventArgs 
{ 
    /*internal*/ public ContextMenuEventArgs(Object source, boolean opening)
    {
        this(source, opening, -1.0, -1.0) ;
    }

    /*internal*/ public ContextMenuEventArgs(Object source, boolean opening, double left, double top) 
    {
        _left = left; 
        _top = top; 
        RoutedEvent =(opening ? ContextMenuService.ContextMenuOpeningEvent : ContextMenuService.ContextMenuClosingEvent);
        Source = source; 
    }

    /// <summary>
    ///     Position (horizontal) that context menu should displayed 
    /// </summary>
    public double CursorLeft 
    { 
        get { return _left; }
    } 

    /// <summary>
    /// Position (vertical) that context menu should displayed
    /// </summary> 
    public double CursorTop
    { 
        get { return _top; } 
    }

    /*internal*/ public DependencyObject TargetElement
    {
        get { return _targetElement; }
        set { _targetElement = value; } 
    }

    /// <summary> 
    /// Support DynamicInvoke for ContextMenuEvent
    /// </summary> 
    /// <param name="genericHandler"></param>
    /// <param name="genericTarget"></param>
    protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget)
    { 
        ContextMenuEventHandler handler = (ContextMenuEventHandler)genericHandler;
        handler(genericTarget, this); 
    } 

    private double _left; 
    private double _top;
    private DependencyObject _targetElement;
}