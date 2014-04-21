package org.summer.view.widget.input;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.RoutedEventArgs;

/// <summary>
///     Event handler associated with the CanExecute events. 
/// </summary>
//public delegate void CanExecuteRoutedEventHandler(Object sender, CanExecuteRoutedEventArgs e); 

/// <summary>
///     Event arguments for the CanExecute events. 
/// </summary>
public /*sealed*/ class CanExecuteRoutedEventArgs extends RoutedEventArgs
{
//    #region Constructors 

    /// <summary> 
    ///     Initializes a new instance of this class. 
    /// </summary>
    /// <param name="command">The command that is being executed.</param> 
    /// <param name="parameter">The parameter that was passed when executing the command.</param>
    /*internal*/ public CanExecuteRoutedEventArgs(ICommand command, Object parameter)
    {
        if (command == null) 
        {
            throw new ArgumentNullException("command"); 
        } 

        _command = command; 
        _parameter = parameter;
    }

//    #endregion 

//    #region Public Properties 

    /// <summary>
    ///     The command that could be executed. 
    /// </summary>
    public ICommand Command
    {
        get { return _command; } 
    }

    /// <summary> 
    ///     The parameter passed when considering executing the command.
    /// </summary> 
    public Object Parameter
    {
        get { return _parameter; }
    } 

    /// <summary> 
    ///     Whether the command with the specified parameter can be executed. 
    /// </summary>
    public boolean CanExecute 
    {
        get { return _canExecute; }
        set { _canExecute = value; }
    } 

    /// <summary> 
    ///     Whether the input event (if any) that caused the command 
    ///     should continue its route.
    /// </summary> 
    public boolean ContinueRouting
    {
        get { return _continueRouting; }
        set { _continueRouting = value; } 
    }

//    #endregion 

//    #region Protected Methods 

    /// <summary>
    ///     Calls the handler.
    /// </summary> 
    /// <param name="genericHandler">Handler delegate to invoke</param>
    /// <param name="target">Target element</param> 
    protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object target) 
    {
        CanExecuteRoutedEventHandler handler = (CanExecuteRoutedEventHandler)genericHandler; 
        handler(target as DependencyObject, this);
    }

//    #endregion 

//    #region Data 

    private ICommand _command;
    private Object _parameter; 
    private boolean _canExecute;       // Defaults to false
    private boolean _continueRouting;  // Defaults to false

//    #endregion 
}