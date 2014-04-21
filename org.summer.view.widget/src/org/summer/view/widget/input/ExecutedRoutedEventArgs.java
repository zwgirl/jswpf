package org.summer.view.widget.input;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.RoutedEventArgs;
 /// <summary>
    ///     Event handler for the Executed events. 
    /// </summary>
//    public delegate void ExecutedRoutedEventHandler(Object sender, ExecutedRoutedEventArgs e); 
 
    /// <summary>
    ///     Event arguments for the Executed events. 
    /// </summary>
    public final class ExecutedRoutedEventArgs extends RoutedEventArgs
    {
//        #region Constructor 

        /// <summary> 
        ///     Initializes a new instance of this class. 
        /// </summary>
        /// <param name="command">The command that is being executed.</param> 
        /// <param name="parameter">The parameter that was passed when executing the command.</param>
        private ExecutedRoutedEventArgs(ICommand command, Object parameter)
        {
            if (command == null) 
            {
                throw new ArgumentNullException("command"); 
            } 

            _command = command; 
            _parameter = parameter;
        }

//        #endregion 
//
//        #region Public Properties 
 
        /// <summary>
        ///     The command being executed. 
        /// </summary>
        public ICommand Command
        {
            get { return _command; } 
        }
 
        /// <summary> 
        ///     The parameter passed when executing the command.
        /// </summary> 
        public Object Parameter
        {
            get { return _parameter; }
        } 

//        #endregion 
// 
//        #region Protected Methods
 
        /// <summary>
        ///     Calls the handler.
        /// </summary>
        /// <param name="genericHandler">Handler delegate to invoke</param> 
        /// <param name="target">Target element</param>
        protected void InvokeEventHandler(Delegate genericHandler, Object target) 
        { 
            ExecutedRoutedEventHandler handler = (ExecutedRoutedEventHandler)genericHandler;
            handler(target as DependencyObject, this); 
        }

//        #endregion
// 
//        #region Data
 
        private ICommand _command; 
        private Object _parameter;
 
//        #endregion
    }