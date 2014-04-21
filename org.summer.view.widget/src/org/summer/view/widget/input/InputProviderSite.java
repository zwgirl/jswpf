package org.summer.view.widget.input;

import org.summer.view.internal.SecurityCriticalDataClass;
import org.summer.view.widget.IDisposable;
 /// <summary> 
    ///     The object which input providers use to report input to the input
    ///     manager. 
    /// </summary> 
    /*internal*/ public class InputProviderSite implements IDisposable
    { 
        /// <SecurityNote>
        ///     Critical: This code creates critical data in the form of InputManager and InputProvider
        /// </SecurityNote>
//        [SecurityCritical] 
        /*internal*/ public InputProviderSite(InputManager inputManager, IInputProvider inputProvider)
        { 
            _inputManager = new SecurityCriticalDataClass<InputManager>(inputManager); 
            _inputProvider = new SecurityCriticalDataClass<IInputProvider>(inputProvider);
        } 

        /// <summary>
        ///     Returns the input manager that this site is attached to.
        /// </summary> 
        /// <SecurityNote>
        ///     Critical: We do not want to expose the Input manager in the SEE 
        ///     TreatAsSafe: This code has a demand in it 
        /// </SecurityNote>
        public InputManager InputManager 
        {
//            [SecurityCritical,SecurityTreatAsSafe]
            get
            { 
                SecurityHelper.DemandUnrestrictedUIPermission();
                return CriticalInputManager; 
            } 
        }
 
        /// <summary>
        ///     Returns the input manager that this site is attached to.
        /// </summary>
        /// <SecurityNote> 
        ///     Critical: We do not want to expose the Input manager in the SEE
        /// </SecurityNote> 
        /*internal*/ public InputManager CriticalInputManager 
        {
//            [SecurityCritical] 
            get
            {
                return _inputManager.Value;
            } 
        }
 
        /// <summary> 
        ///     Unregisters this input provider.
        /// </summary> 
        /// <SecurityNote>
        ///     Critical: This code accesses critical data (InputManager and InputProvider).
        ///     TreatAsSafe: The critical data is not exposed outside this call
        /// </SecurityNote> 
//        [SecurityCritical,SecurityTreatAsSafe]
        public void Dispose() 
        { 
            GC.SuppressFinalize(this);
            if (!_isDisposed) 
            {
                _isDisposed = true;

                if (_inputManager != null && _inputProvider != null) 
                {
                    _inputManager.Value.UnregisterInputProvider(_inputProvider.Value); 
                } 
                _inputManager = null;
                _inputProvider = null; 
            }
        }

        /// <summary> 
        /// Returns true if the CompositionTarget is disposed.
        /// </summary> 
        public boolean IsDisposed 
        {
            get 
            {
                return _isDisposed;
            }
        } 

        /// <summary> 
        ///     Reports input to the input manager. 
        /// </summary>
        /// <returns> 
        ///     Whether or not any event generated as a consequence of this
        ///     event was handled.
        /// </returns>
        /// <SecurityNote> 
        ///     Critical:This code is critical and can be used in event spoofing. It also accesses
        ///     InputManager and calls into ProcessInput which is critical. 
         /// </SecurityNote> 
        //
 
//        [SecurityCritical ]
//        [UIPermissionAttribute(SecurityAction.LinkDemand,Unrestricted = true)]
        public boolean ReportInput(InputReport inputReport)
        { 
            if(IsDisposed)
            { 
                throw new ObjectDisposedException(/*SR.Get(SRID.InputProviderSiteDisposed)*/); 
            }
 
            boolean handled = false;

            InputReportEventArgs input = new InputReportEventArgs(null, inputReport);
            input.RoutedEvent=InputManager.PreviewInputReportEvent; 

            if(_inputManager != null) 
            { 
                handled = _inputManager.Value.ProcessInput(input);
            } 

            return handled;
        }
 
        private boolean _isDisposed;
        /// <SecurityNote> 
        ///     Critical: This object should not be exposed in the SEE as it can be 
        ///     used for input spoofing
        /// </SecurityNote> 
        private SecurityCriticalDataClass<InputManager> _inputManager;
        /// <SecurityNote>
        ///     Critical: This object should not be exposed in the SEE as it can be
        ///     used for input spoofing 
        /// </SecurityNote>
        private SecurityCriticalDataClass<IInputProvider> _inputProvider; 
    } 