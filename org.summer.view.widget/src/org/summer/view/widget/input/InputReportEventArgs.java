package org.summer.view.widget.input;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Delegate;
/// <summary> 
    ///     The InputReportEventArgs class contains information about an input 
    ///     report that is being processed.
    /// </summary> 
//    [FriendAccessAllowed]
    /*internal*/public class InputReportEventArgs extends InputEventArgs
    {
        /// <summary> 
        ///     Initializes a new instance of the InputReportEventArgs class.
        /// </summary> 
        /// <param name="inputDevice"> 
        ///     The input device to associate this input with.
        /// </param> 
        /// <param name="report">
        ///     The input report being processed.
        /// </param>
        public InputReportEventArgs(InputDevice inputDevice, 
                                    InputReport report) 
        { 
        	super(inputDevice, ((report != null) ? report.Timestamp : -1));
            if (report == null) 
                throw new ArgumentNullException("report");
 
            _report = report;
        }

        /// <summary> 
        ///     Read-only access to the input report being processed.
        /// </summary> 
        public InputReport Report 
        {
            get {return _report;} 
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
        protected /*override*/ void InvokeEventHandler(Delegate genericHandler, object genericTarget) 
        {
            InputReportEventHandler handler = (InputReportEventHandler) genericHandler; 
            handler(genericTarget, this); 
        }
 
        private InputReport _report;
    }