package org.summer.view.widget.controls;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.internal.EventHandler;

/// <summary>
/// EventArgs for ValidationError event. 
/// </summary>
public class ValidationErrorEventArgs extends RoutedEventArgs
{
    /// <summary> 
    /// Constructor
    /// </summary> 
    /*internal*/ public ValidationErrorEventArgs(ValidationError validationError, ValidationErrorEventAction action) 
    {
//        Invariant.Assert(validationError != null); 

        RoutedEvent = Validation.ErrorEvent;
        _validationError = validationError;
        _action = action; 
    }


    /// <summary>
    ///     The ValidationError that caused this ValidationErrorEvent to 
    ///     be raised.
    /// </summary>
    public ValidationError Error
    { 
        get
        { 
            return _validationError; 
        }
    } 

    /// <summary>
    ///     Action indicates whether the <seealso cref="Error"/> is a new error
    ///     or a previous error that has now been cleared. 
    /// </summary>
    public ValidationErrorEventAction Action 
    { 
        get
        { 
            return _action;
        }
    }


    /// <summary> 
    ///     The mechanism used to call the type-specific handler on the 
    ///     target.
    /// </summary> 
    /// <param name="genericHandler">
    ///     The generic handler to call in a type-specific way.
    /// </param>
    /// <param name="genericTarget"> 
    ///     The target to call the handler on.
    /// </param> 
    protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget) 
    {
        EventHandler<ValidationErrorEventArgs> handler = (EventHandler<ValidationErrorEventArgs>) genericHandler; 

        handler(genericTarget, this);
    }


    private ValidationError _validationError; 
    private ValidationErrorEventAction _action; 

} 