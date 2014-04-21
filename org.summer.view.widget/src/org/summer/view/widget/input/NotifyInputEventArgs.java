package org.summer.view.widget.input;

import org.summer.view.widget.EventArgs;

/// <summary> 
    ///     Provides information about an input event being processed by the
    ///     input manager.
    /// </summary>
    /// <remarks> 
    ///     An instance of this class, or a derived class, is passed to the
    ///     handlers of the following events: 
    ///     <list> 
    ///     </list>
    /// </remarks> 
    public class NotifyInputEventArgs extends EventArgs
    {
        // Only we can make these.  Note that we cache and reuse instances.
        /*internal*/ public NotifyInputEventArgs() {} 

        ///<SecurityNote> 
        ///     Critical - InputManager passed in is critical data. 
        ///</SecurityNote>
        /*internal*/ public /*virtual*/ void Reset(StagingAreaInputItem input, InputManager inputManager)
        {
            _input = input;
            _inputManager = inputManager; 
        }
 
        /// <summary> 
        ///     The staging area input item being processed by the input
        ///     manager. 
        /// </summary>
        public StagingAreaInputItem StagingItem {get {return _input;}}

        /// <summary> 
        ///     The input manager processing the input event.
        /// </summary> 
        /// <remarks> 
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API.
        /// </remarks> 
        ///<SecurityNote>
        ///     Critical - input manager is critical
        ///     PublicOK - there's a demand.
        ///</SecurityNote> 
        public InputManager InputManager
        { 
            get
            { 
                SecurityHelper.DemandUnrestrictedUIPermission();
                return _inputManager;
            }
        } 

        /// <summary> 
        ///     The input manager processing the input event. 
        ///     *** FOR INTERNAL USE ONLY ****
        /// </summary> 
        ///<SecurityNote>
        ///     Critical - input manager is critical
        ///</SecurityNote>
        /*internal*/ public InputManager UnsecureInputManager 
        {
            get 
            {
                return _inputManager; 
            }
        }

        private StagingAreaInputItem _input; 

        ///<SecurityNote> 
        ///     Critical data as InputManager ctor is critical. 
        ///</SecurityNote>
        private InputManager _inputManager;

    }