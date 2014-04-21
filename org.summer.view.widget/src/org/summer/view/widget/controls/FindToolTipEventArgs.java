package org.summer.view.widget.controls;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.RoutedEventArgs;

/*internal*/ public /*sealed*/ class FindToolTipEventArgs extends RoutedEventArgs 
    {
        /*internal*/ public FindToolTipEventArgs() 
        {
            RoutedEvent = ToolTipService.FindToolTipEvent;
        }
 
        /*internal*/ public DependencyObject TargetElement
        { 
            get { return _targetElement; } 
            set { _targetElement = value; }
        } 

        /*internal*/ public boolean KeepCurrentActive
        {
            get { return _keepCurrentActive; } 
            set { _keepCurrentActive = value; }
        } 
 
        /// <summary>
        ///     Invokes the event handler. 
        /// </summary>
        /// <param name="genericHandler">The delegate to call.</param>
        /// <param name="genericTarget">The target of the event.</param>
        protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget) 
        {
            FindToolTipEventHandler handler = (FindToolTipEventHandler)genericHandler; 
            handler(genericTarget, this); 
        }
 
        private DependencyObject _targetElement;
        private boolean _keepCurrentActive;
    }