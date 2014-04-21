package org.summer.view.widget.input;
/// <summary> 
    ///     Allows the handler to cancel the processing of an input event.
    /// </summary> 
    /// <remarks>
    ///     An instance of this class is passed to the handlers of the
    ///     following events:
    ///     <list> 
    ///         <item>
    ///             <see cref="InputManager.PreProcessInput"/> 
    ///         </item> 
    ///     </list>
    /// </remarks> 
    public /*sealed*/ class PreProcessInputEventArgs extends ProcessInputEventArgs
    {
        // Only we can make these.  Note that we cache and reuse instances.
        /*internal*/ public PreProcessInputEventArgs() {} 

        ///<SecurityNote> 
        ///     Critical calls ProcessInputEventArgs.Reset ( critical as it handles InputManager) 
        ///</SecurityNote>
//        [SecurityCritical] 
        /*internal*/ public /*override*/ void Reset(StagingAreaInputItem input, InputManager inputManager)
        {
            _canceled = false;
            super.Reset(input, inputManager); 
        }
 
        /// <summary> 
        ///     Cancels the processing of the input event.
        /// </summary> 
        public void Cancel()
        {
            _canceled = true;
        } 

        /// <summary> 
        ///     Whether or not the input event processing was canceled. 
        /// </summary>
        public boolean Canceled {get {return _canceled;}} 

        private boolean _canceled;
    }