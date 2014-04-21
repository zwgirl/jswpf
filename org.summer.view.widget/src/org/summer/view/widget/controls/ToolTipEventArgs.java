package org.summer.view.widget.controls;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.RoutedEventArgs;

/// <summary>
///     Event arguments for the events when a ToolTip should open or close. 
/// </summary>
public /*sealed*/ class ToolTipEventArgs extends RoutedEventArgs
{
    /// <summary> 
    ///     Called internally to create opening or closing event arguments.
    /// </summary> 
    /// <param name="opening">Whether this is the opening or closing event.</param> 
    /*internal*/ public ToolTipEventArgs(boolean opening)
    { 
        if (opening)
        {
            RoutedEvent = ToolTipService.ToolTipOpeningEvent;
        } 
        else
        { 
            RoutedEvent = ToolTipService.ToolTipClosingEvent; 
        }
    } 

    /// <summary>
    ///     Invokes the event handler.
    /// </summary> 
    /// <param name="genericHandler">The delegate to call.</param>
    /// <param name="genericTarget">The target of the event.</param> 
    protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget) 
    {
        ToolTipEventHandler handler = (ToolTipEventHandler)genericHandler; 
        handler(genericTarget, this);
    }
}

