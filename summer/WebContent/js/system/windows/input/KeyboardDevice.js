/**
 * KeyboardDevice
 */

define(["dojo/_base/declare", "system/Type", "input/InputDevice", "internal/DeferredElementTreeState",
        "input/InputElement", "windows/DependencyObject", "input/Keyboard", "input/ModifierKeys", "input/KeyStates",
        "input/KeyboardFocusChangedEventArgs"], 
		function(declare, Type, InputDevice, DeferredElementTreeState,
				InputElement, DependencyObject, Keyboard, ModifierKeys, KeyStates,
				KeyboardFocusChangedEventArgs){
	
	
	var InputManager = null;
	function EnsureInputManager(){
		if(InputManager == null){
			InputManager = using("input/InputManager");
		}
		
		return InputManager;
	}
	
//    private class 
	var ScanCode = declare(null, { 
        construcor:function(/*int*/ code, /*bool*/ isExtended) 
        {
            this._code = code; 
            this._isExtended = isExtended;
        }

    });
	
	Object.defineProperties(ScanCode.prototype, {
//        internal int 
		Code: {get:function() {return this._code;}}, 
//        internal bool 
		IsExtended: {get:function() {return this._isExtended;}}
	});
    
	var KeyboardDevice = declare("KeyboardDevice", InputDevice,{
		constructor:function(/*InputManager*/ inputManager)
        { 
            this._inputManager = inputManager;
//            _inputManager.PreProcessInput += new PreProcessInputEventHandler(PreProcessInput); 
//            _inputManager.PreNotifyInput += new NotifyInputEventHandler(PreNotifyInput); 
//            _inputManager.PostProcessInput += new ProcessInputEventHandler(PostProcessInput);
// 
//            _isEnabledChangedEventHandler = new DependencyPropertyChangedEventHandler(OnIsEnabledChanged);
//            _isVisibleChangedEventHandler = new DependencyPropertyChangedEventHandler(OnIsVisibleChanged);
//            _focusableChangedEventHandler = new DependencyPropertyChangedEventHandler(OnFocusableChanged);
// 
//            _reevaluateFocusCallback = new DispatcherOperationCallback(ReevaluateFocusCallback);
//            _reevaluateFocusOperation = null; 
// 
//            //
// 
//
//            _TsfManager = new SecurityCriticalDataClass<TextServicesManager>(new TextServicesManager(inputManager));
//            _textcompositionManager = new SecurityCriticalData<TextCompositionManager>(new TextCompositionManager(inputManager));
		},
		
        /// <summary> 
        ///     Gets the current state of the specified key from the device from the underlying system 
        /// </summary>
        /// <param name="key"> 
        ///     Key to get the state of
        /// </param>
        /// <returns>
        ///     The state of the specified key 
        /// </returns>
//        protected abstract KeyStates 
		GetKeyStatesFromSystem:function( /*Key*/ key ){
			
		},
        /// <summary>
        ///     Clears focus. 
        /// </summary>
//        public void 
		ClearFocus:function()
        {
            this.Focus(null, false, false, false); 
        },
 
        /// <summary> 
        ///     Focuses the keyboard on a particular element.
        /// </summary> 
        /// <param name="element">
        ///     The element to focus the keyboard on.
        /// </param>
        /// <SecurityNote> 
        ///     Critical: This code accesses _activeSource.Value.
        ///     PublicOK: Moving focus within an app is safe and this does not expose 
        ///               the critical data. 
        /// </SecurityNote>
//        public IInputElement 
//        Focus:function(/*IInputElement*/ element)
//        {
//            /*DependencyObject*/var oFocus = null;
//            var forceToNullIfFailed = false; 
//
//            // Validate that if elt is either a UIElement or a ContentElement. 
//            if(element != null) 
//            {
//                if(!InputElement.IsValid(element)) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, element.GetType()));
//                } 
//
//                oFocus =  element; 
//            } 
//
//            // If no element is given for focus, use the root of the active source. 
//            if(oFocus == null && this._activeSource != null)
//            {
//                oFocus = this._activeSource.Value.RootVisual instanceof DependencyObject ? this._activeSource.Value.RootVisual : null;
//                forceToNullIfFailed = true; 
//            }
// 
//            this.Focus(oFocus, true, true, forceToNullIfFailed); 
//
//            return this._focus; 
//        },
        
        /// <SecurityNote>
        ///     Critical: This code calls into PresentationSource. which is not safe to expose.
        ///     Additonally it retrieves the keyboard input provider 
        ///     TreatAsSafe: Moving focus within an app is safe and this does not expose
        ///     the critical data. 
        /// </SecurityNote> 
//        private void 
        Focus:function(/*DependencyObject*/ focus, /*bool*/ askOld, /*bool*/ askNew, /*bool*/ forceToNullIfFailed) 
        {
        	if(arguments.length == 1){
        		/*DependencyObject*/var oFocus = null;
                forceToNullIfFailed = false; 

                // Validate that if elt is either a UIElement or a ContentElement. 
                if(focus != null) 
                {
                    if(!InputElement.IsValid(focus)) 
                    {
                        throw new InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, element.GetType()));
                    } 

                    oFocus =  focus; 
                } 

                // If no element is given for focus, use the root of the active source. 
                if(oFocus == null && this._activeSource != null)
                {
                    oFocus = this._activeSource.Value.RootVisual instanceof DependencyObject ? this._activeSource.Value.RootVisual : null;
                    forceToNullIfFailed = true; 
                }
     
                this.Focus(oFocus, true, true, forceToNullIfFailed); 

                return this._focus; 
        	}
        	
            // Make sure that the element is valid for receiving focus.
            var isValid = true;
            if(focus != null) 
            {
                isValid = Keyboard.IsFocusable(focus); 
 
                if(!isValid && forceToNullIfFailed)
                { 
                    focus = null;
                    isValid = true;
                }
            } 

            if(isValid) 
            { 
                // Get the keyboard input provider that provides input for the active source.
                var keyboardInputProvider = null; 
//                /*DependencyObject*/var containingVisual = InputElement.GetContainingVisual(focus);
//                if(containingVisual != null)
//                {
//                    /*PresentationSource*/var source = PresentationSource.CriticalFromVisual(containingVisual); 
//                    if (source != null)
//                    { 
//                        keyboardInputProvider = /*(IKeyboardInputProvider)*/source.GetInputProvider(KeyboardDevice.Type); 
//                    }
//                } 

                // Start the focus-change operation.
                this.TryChangeFocus(focus, keyboardInputProvider, askOld, askNew, forceToNullIfFailed);
            } 
        },
        /// <summary> 
        /// There is a proscription against using Enum.IsDefined().  (it is slow)
        /// so we write these PRIVATE validate routines instead. 
        /// </summary>
//        private void 
        Validate_Key:function(/*Key*/ key)
        {
            if( 256 <= key || key <= 0) 
                throw new  System.ComponentModel.InvalidEnumArgumentException("key", key, typeof(Key));
        },
 
        /// <summary>
        /// This is the core private method that returns whether or not the specified key 
        ///  is down.  It does it without the extra argument validation and context checks.
        /// </summary>
//        private bool 
        IsKeyDown_private:function(/*Key*/ key)
        { 
            return ( ( this.GetKeyStatesFromSystem(key) & KeyStates.Down ) == KeyStates.Down );
        }, 
 
        /// <summary>
        ///     Returns whether or not the specified key is down. 
        /// </summary>
//        public bool 
        IsKeyDown:function(/*Key*/ key)
        {
//             VerifyAccess(); 
            this.Validate_Key(key);
            return this.IsKeyDown_private(key); 
        }, 

        /// <summary> 
        ///     Returns whether or not the specified key is up.
        /// </summary>
//        public bool 
        IsKeyUp:function(/*Key*/ key)
        { 
//             VerifyAccess();
            this.Validate_Key(key); 
            return (!this.IsKeyDown_private(key)); 
        },
 
        /// <summary>
        ///     Returns whether or not the specified key is toggled.
        /// </summary>
//        public bool 
        IsKeyToggled:function(/*Key*/ key) 
        {
//             VerifyAccess(); 
            this.Validate_Key(key); 
            return( ( this.GetKeyStatesFromSystem(key) & KeyStates.Toggled ) == KeyStates.Toggled );
        }, 

        /// <summary>
        ///     Returns the state of the specified key.
        /// </summary> 
//        public KeyStates 
        GetKeyStates:function(/*Key*/ key)
        { 
//             VerifyAccess(); 
            this.Validate_Key(key);
            return this.GetKeyStatesFromSystem(key); 
        },
        /// <SecurityNote>
        ///     Critical: This code accesses critical data (inputManager) and 
        ///               causes a change of focus.
        ///     TreatAsSafe:This code is safe to expose 
        /// </SecurityNote> 
//        private void 
        TryChangeFocus:function(/*DependencyObject*/ newFocus, /*IKeyboardInputProvider*/ keyboardInputProvider, 
        		/*bool*/ askOld, /*bool*/ askNew, /*bool*/ forceToNullIfFailed) 
        {
            var changeFocus = true;
            var timeStamp = new Date().getMilliseconds(); //Environment.TickCount ;
            /*DependencyObject*/var oldFocus = this._focus; // This is required, used below to see if focus has been delegated 

            if(newFocus != this._focus) 
            { 
                // If requested, and there is currently something with focus
                // Send the PreviewLostKeyboardFocus event to see if the object losing focus want to cancel it. 
                // - no need to check "changeFocus" here as it was just previously unconditionally set to true
                if(askOld && this._focus != null)
                {
                    var previewLostFocus = new KeyboardFocusChangedEventArgs(this.DOMEvent, this._focus, this.newFocus); 
                    previewLostFocus.RoutedEvent=Keyboard.PreviewLostKeyboardFocusEvent;
                    previewLostFocus.Source= this._focus; 
                    if(this._inputManager != null) 
                    	this._inputManager.ProcessInput(previewLostFocus);
 
                    //
                    if(previewLostFocus.Handled)
                    {
                        changeFocus = false; 
                    }
                } 
                // If requested, and there is an object to specified to take focus 
                // Send the PreviewGotKeyboardFocus event to see if the object gaining focus want to cancel it.
                // - must also check "changeFocus", no point in checking if the "previewLostFocus" event 
                //   above already cancelled it
                if(askNew && changeFocus && newFocus != null)
                {
                    var previewGotFocus = new KeyboardFocusChangedEventArgs(this.DOMEvent, this._focus, this.newFocus); 
                    previewGotFocus.RoutedEvent=Keyboard.PreviewGotKeyboardFocusEvent;
                    previewGotFocus.Source= newFocus; 
                    if(this._inputManager != null) 
                    	this._inputManager.ProcessInput(previewGotFocus);
 
                    //
                    if(previewGotFocus.Handled)
                    {
                        changeFocus = false; 
                    }
                } 
 
                // If we are setting the focus to an element, see if the InputProvider
                // can take focus for us. 
                if(changeFocus && newFocus != null)
                {
                    if (keyboardInputProvider != null && Keyboard.IsFocusable(newFocus))
                    { 
                        // Tell the element we are about to acquire focus through
                        // the input provider.  The element losing focus and the 
                        // element receiving focus have all agreed to the 
                        // transaction.  This is used by menus to configure the
                        // behavior of focus changes. 
                        var acquireFocus = new KeyboardInputProviderAcquireFocusEventArgs(this, timeStamp, changeFocus);
                        acquireFocus.RoutedEvent = Keyboard.PreviewKeyboardInputProviderAcquireFocusEvent;
                        acquireFocus.Source= newFocus;
                        if(this._inputManager != null) 
                        	this._inputManager.ProcessInput(acquireFocus);
 
                        // Acquire focus through the input provider. 
                        changeFocus = keyboardInputProvider.AcquireFocus(false);
 
                        // Tell the element whether or not we were able to
                        // acquire focus through the input provider.
                        acquireFocus = new KeyboardInputProviderAcquireFocusEventArgs(this, timeStamp, changeFocus);
                        acquireFocus.RoutedEvent = Keyboard.KeyboardInputProviderAcquireFocusEvent; 
                        acquireFocus.Source= newFocus;
                        if(this._inputManager != null) 
                        	this._inputManager.ProcessInput(acquireFocus); 
                    }
                    else 
                    {
                        changeFocus = false;
                    }
                } 

                // If the ChangeFocus operation was cancelled or the AcquireFocus operation failed 
                // and the "ForceToNullIfFailed" flag was set, we set focus to null 
                if( !changeFocus && forceToNullIfFailed && oldFocus == this._focus /* Focus is not delegated */ )
                { 
                    // focus might be delegated (e.g. during PreviewGotKeyboardFocus)
                    // without actually changing, if it was already on the delegated
                    // element (see bug 1794057).  We can't test for this directly,
                    // but if focus is within the desired element we'll assume this 
                    // is what happened.
                    var newFocusElement = newFocus instanceof IInputElement ? newFocus : null; 
                    if (newFocusElement == null || !newFocusElement.IsKeyboardFocusWithin) 
                    {
                        newFocus = null; 
                        changeFocus = true;
                    }
                }
 
                // If both the old and new focus elements allowed it, and the
                // InputProvider has acquired it, go ahead and change our internal 
                // sense of focus to the desired element. 
//                if(changeFocus)
//                { 
                    this.ChangeFocus(newFocus, timeStamp);
//                }
            }
        },
        /// <SecurityNote>
        ///     Critical: This code accesses critical data (inputManager,_TsfManager,_inputManager) and 
        ///               is not OK to expose 
        ///     TreatAsSafe: This changes focus within an app
        /// </SecurityNote> 
//        private void 
        ChangeFocus:function(/*DependencyObject*/ focus, /*int*/ timestamp)
        {
            /*DependencyObject*/var o = null; 

            if(focus != this._focus) 
            { 
                // Update the critical pieces of data.
                /*DependencyObject*/var oldFocus = this._focus; 
                this._focus = focus;
                this._focusRootVisual = InputElement.GetRootVisual(focus);

//                using(Dispatcher.DisableProcessing()) // Disable reentrancy due to locks taken 
//                {
//                    // Adjust the handlers we use to track everything. 
//                    if(oldFocus != null) 
//                    {
//                        o = oldFocus; 
//                        if (InputElement.IsUIElement(o))
//                        {
//                            ((UIElement)o).IsEnabledChanged -= _isEnabledChangedEventHandler;
//                            ((UIElement)o).IsVisibleChanged -= _isVisibleChangedEventHandler; 
//                            ((UIElement)o).FocusableChanged -= _focusableChangedEventHandler;
//                        } 
//                        else if (InputElement.IsContentElement(o)) 
//                        {
//                            ((ContentElement)o).IsEnabledChanged -= _isEnabledChangedEventHandler; 
//                            // NOTE: there is no IsVisible property for ContentElements.
//                            ((ContentElement)o).FocusableChanged -= _focusableChangedEventHandler;
//                        }
//                        else 
//                        {
//                            ((UIElement3D)o).IsEnabledChanged -= _isEnabledChangedEventHandler; 
//                            ((UIElement3D)o).IsVisibleChanged -= _isVisibleChangedEventHandler; 
//                            ((UIElement3D)o).FocusableChanged -= _focusableChangedEventHandler;
//                        } 
//                    }
//                    if(_focus != null)
//                    {
//                        o = _focus; 
//                        if (InputElement.IsUIElement(o))
//                        { 
//                            ((UIElement)o).IsEnabledChanged += _isEnabledChangedEventHandler; 
//                            ((UIElement)o).IsVisibleChanged += _isVisibleChangedEventHandler;
//                            ((UIElement)o).FocusableChanged += _focusableChangedEventHandler; 
//                        }
//                        else if (InputElement.IsContentElement(o))
//                        {
//                            ((ContentElement)o).IsEnabledChanged += _isEnabledChangedEventHandler; 
//                            // NOTE: there is no IsVisible property for ContentElements.
//                            ((ContentElement)o).FocusableChanged += _focusableChangedEventHandler; 
//                        } 
//                        else
//                        { 
//                            ((UIElement3D)o).IsEnabledChanged += _isEnabledChangedEventHandler;
//                            ((UIElement3D)o).IsVisibleChanged += _isVisibleChangedEventHandler;
//                            ((UIElement3D)o).FocusableChanged += _focusableChangedEventHandler;
//                        } 
//                    }
//                } 
 
                // Oddly enough, update the FocusWithinProperty properties first.  This is
                // so any callbacks will see the more-common FocusWithinProperty properties 
                // set correctly.
                var focusTreeStateRef = {
                	"oldTreeState" : this._focusTreeState
                };
                UIElement.FocusWithinProperty.OnOriginValueChanged(oldFocus, this._focus, /*ref _focusTreeState*/focusTreeStateRef);
                this._focusTreeState = focusTreeStateRef.oldTreeState;

                // Invalidate the IsKeyboardFocused properties. 
                if(oldFocus != null)
                { 
                    o = oldFocus; 
                    o.SetValue(UIElement.IsKeyboardFocusedPropertyKey, false); // Same property for ContentElements
                } 
                if(this._focus != null)
                {
                    // Invalidate the IsKeyboardFocused property.
                    o = this._focus; 
                    o.SetValue(UIElement.IsKeyboardFocusedPropertyKey, true); // Same property for ContentElements
                } 
 
                // Call TestServicesManager change the focus of the InputMethod is enable/disabled accordingly
                // so it's ready befere the GotKeyboardFocusEvent handler is invoked. 
                if (this._TsfManager != null)
                	this._TsfManager.Focus(this._focus);

                // InputLanguageManager checks the preferred input languages. 
                // This should before GotEvent because the preferred input language
                // should be set at the event handler. 
//                InputLanguageManager.Current.Focus(this._focus, oldFocus); 

                // Send the LostKeyboardFocus and GotKeyboardFocus events. 
                if(oldFocus != null)
                {
                    var lostFocus = new KeyboardFocusChangedEventArgs(this.DOMEvent,  oldFocus, focus);
                    lostFocus.RoutedEvent=Keyboard.LostKeyboardFocusEvent; 
                    lostFocus.Source= oldFocus;
                    if(this._inputManager != null) 
                    	this._inputManager.ProcessInput(lostFocus); 
                }
                if(this._focus != null) 
                {
                    var gotFocus = new KeyboardFocusChangedEventArgs(this.DOMEvent, oldFocus, this._focus);
                    gotFocus.RoutedEvent=Keyboard.GotKeyboardFocusEvent;
                    gotFocus.Source= this._focus; 
                    if(this._inputManager!=null)
                    	this._inputManager.ProcessInput(gotFocus); 
                } 

                // InputMethod checks the preferred ime state. 
//                // The preferred input methods should be applied after Cicero TIP gots SetFocus callback.
//                InputMethod.Current.GotKeyboardFocus(this._focus);

//                //Could be also built-in into IsKeyboardFocused_Changed static on UIElement and ContentElement 
//                //However the Automation likes to go immediately back on us so it would be better be last one...
//                AutomationPeer.RaiseFocusChangedEventHelper(this._focus); 
            } 
        },
 
//        private void 
        OnIsEnabledChanged:function(/*object*/ sender, /*DependencyPropertyChangedEventArgs*/ e)
        {
            // The element with focus just became disabled.
            // 
            // We can't leave focus on a disabled element, so move it.
        	this.ReevaluateFocusAsync(null, null, false); 
        },

//        private void 
        OnIsVisibleChanged:function(/*object*/ sender, /*DependencyPropertyChangedEventArgs*/ e) 
        {
            // The element with focus just became non-visible (collapsed or hidden).
            //
            // We can't leave focus on a non-visible element, so move it. 
        	this.ReevaluateFocusAsync(null, null, false);
        }, 
 
//        private void 
        OnFocusableChanged:function(/*object*/ sender, /*DependencyPropertyChangedEventArgs*/ e)
        { 
            // The element with focus just became unfocusable.
            //
            // We can't leave focus on an unfocusable element, so move it.
        	this.ReevaluateFocusAsync(null, null, false); 
        },
 
        /// <summary> 
        ///     Determines if we can remain focused on the element we think has focus
        /// </summary> 
        /// <remarks>
        ///     Queues an invocation of ReevaluateFocusCallback to do the actual work.
        ///         - that way if the object that had focus has only been temporarily
        ///           removed, disable, etc. and will eventually be valid again, we 
        ///           avoid needlessly killing focus.
        /// </remarks> 
//        internal void 
        ReevaluateFocusAsync:function(/*DependencyObject*/ element, /*DependencyObject*/ oldParent, /*bool*/ isCoreParent) 
        {
            if(element != null) 
            {
                if(isCoreParent)
                {
                    FocusTreeState.SetCoreParent(element, oldParent); 
                }
                else 
                { 
                    FocusTreeState.SetLogicalParent(element, oldParent);
                } 
            }

            // It would be best to re-evaluate anything dependent on the hit-test results
            // immediately after layout & rendering are complete.  Unfortunately this can 
            // lead to an infinite loop.  Consider the following scenario:
            // 
            // If the mouse is over an element, hide it. 
            //
            // This never resolves to a "correct" state.  When the mouse moves over the 
            // element, the element is hidden, so the mouse is no longer over it, so the
            // element is shown, but that means the mouse is over it again.  Repeat.
            //
            // We push our re-evaluation to a priority lower than input processing so that 
            // the user can change the input device to avoid the infinite loops, or close
            // the app if nothing else works. 
            // 
            if(_reevaluateFocusOperation == null)
            { 
                _reevaluateFocusOperation = Dispatcher.BeginInvoke(DispatcherPriority.Input, _reevaluateFocusCallback, null);
            }
        },
 
        /// <summary>
        ///     Determines if we can remain focused on the element we think has focus 
        /// </summary> 
        /// <remarks>
        ///     Invoked asynchronously by ReevaluateFocusAsync. 
        ///     Confirms that the element we think has focus is:
        ///         - still enabled
        ///         - still visible
        ///         - still in the tree 
        /// </remarks>
        ///<SecurityNote> 
        ///     Critical:    accesses critical data ( _activeSource) 
        ///     TreatAsSafe: Moving focus within an app is safe and this does not expose
        ///                  the critical data. 
        ///</SecurityNote>
//        private object 
        ReevaluateFocusCallback:function(/*object*/ arg)
        { 
        	this._reevaluateFocusOperation = null;
 
            if( this._focus == null ) 
            {
                return null; 
            }

            //
            // Reevaluate the eligability of the focused element to actually 
            // have focus.  If that element is no longer focusable, then search
            // for an ancestor that is. 
            // 
            /*DependencyObject*/var element = this._focus;
            while(element != null) 
            {
                if(Keyboard.IsFocusable(element))
                {
                    break; 
                }
 
                // Walk the current tree structure. 
                element = DeferredElementTreeState.GetCoreParent(element, null);
            } 

            // Get the PresentationSource that contains the element to be focused.
            var presentationSource = null;
            /*DependencyObject*/var visualContainer = InputElement.GetContainingVisual(element); 
            if(visualContainer != null)
            { 
                presentationSource = PresentationSource.CriticalFromVisual(visualContainer); 
            }
 
            // The default action is to reset focus to the root element
            // of the active presentation source.
            var moveFocus = true;
            /*DependencyObject*/var moveFocusTo = null; 

            if(presentationSource != null) 
            { 
                /*IKeyboardInputProvider*/var keyboardProvider = presentationSource.GetInputProvider(KeyboardDevice.Type);
                keyboardProvider = keyboardProvider instanceof IKeyboardInputProvider ? keyboardProvider : null;
                if(keyboardProvider != null) 
                {
                    // Confirm with the keyboard provider for this
                    // presentation source that it has acquired focus.
                    if(keyboardProvider.AcquireFocus(true)) 
                    {
                        if(element == _focus) 
                        { 
                            // The focus element is still good.
                            moveFocus = false; 
                        }
                        else
                        {
                            // The focus element is no longer focusable, but we found 
                            // an ancestor that is, so move focus there.
                            moveFocus = true; 
                            moveFocusTo = element; 
                        }
                    } 
                }
            }

            if(moveFocus) 
            {
                if(moveFocusTo == null && this._activeSource != null) 
                { 
                    moveFocusTo = this._activeSource.Value.RootVisual;
                    moveFocusTo = moveFocusTo instanceof DependencyObject ? moveFocusTo : null;
                } 


                Focus(moveFocusTo, /*askOld=*/ false, /*askNew=*/ true, /*forceToNullIfFailed=*/ true);
            } 
            else
            { 
                // Refresh FocusWithinProperty so that ReverseInherited Flags are updated. 
                //
                // We only need to do this if there is any information about the old 
                // tree structure.
                if(this._focusTreeState != null && !this._focusTreeState.IsEmpty)
                {
                    var focusTreeStateRef = {
                    	"oldTreeState" : this._focusTreeState
                    };
                    UIElement.FocusWithinProperty.OnOriginValueChanged(this._focus, this._focus, /*ref _focusTreeState*/focusTreeStateRef); 
                    this._focusTreeState = focusTreeStateRef.oldTreeState;
                }
            } 
 
            return null;
        },

        /// <SecurityNote>
        ///     Critical: accesses e.StagingItem.Input
        /// </SecurityNote> 
//        private void 
        PreProcessInput:function(/*object*/ sender, /*PreProcessInputEventArgs*/ e) 
        { 
            /*RawKeyboardInputReport*/var keyboardInput = this.ExtractRawKeyboardInputReport(e, EnsureInputManager().PreviewInputReportEvent);
            if(keyboardInput != null) 
            {
                // Claim the input for the keyboard.
                e.StagingItem.Input.Device = this;
            } 
        },
 
        /// <SecurityNote> 
        ///     Critical: This code can be used for input spoofing,
        ///               It also stores critical data InputSource 
        ///               accesses e.StagingItem.Input
        /// </SecurityNote>
//        private void 
        PreNotifyInput:function(/*object*/ sender, /*NotifyInputEventArgs*/ e) 
        {
            /*RawKeyboardInputReport*/var keyboardInput = this.ExtractRawKeyboardInputReport(e, EnsureInputManager().PreviewInputReportEvent); 
            if(keyboardInput != null) 
            {
            	this.CheckForDisconnectedFocus(); 

                // Activation
                //
                // MITIGATION: KEYBOARD_STATE_OUT_OF_[....] 
                //
                // It is very important that we allow multiple activate events. 
                // This is how we deal with the fact that Win32 sometimes sends 
                // us a WM_SETFOCUS message BEFORE it has updated it's internal
                // internal keyboard state information.  When we get the 
                // WM_SETFOCUS message, we activate the keyboard with the
                // keyboard state (even though it could be wrong).  Then when
                // we get the first "real" keyboard input event, we activate
                // the keyboard again, since Win32 will have updated the 
                // keyboard state correctly by then.
                // 
                if((keyboardInput.Actions & RawKeyboardActions.Activate) == RawKeyboardActions.Activate) 
                {
                    //if active source is null, no need to do special-case handling 
                    if(_activeSource == null)
                    {
                        // we are now active.
                    	this._activeSource = keyboardInput.InputSource; 
                    }
                    else if(this._activeSource != keyboardInput.InputSource) 
                    { 
                        /*IKeyboardInputProvider*/var toDeactivate = 
                        	this._activeSource.GetInputProvider(KeyboardDevice.Type);
                        toDeactivate = toDeactivate instanceof IKeyboardInputProvider ? toDeactivate : null;
 
                        // we are now active.
                        this._activeSource = keyboardInput.InputSource;

                        if(toDeactivate != null) 
                        {
                            toDeactivate.NotifyDeactivate(); 
                        } 
                    }
                } 

                // Generally, we need to check against redundant actions.
                // We never prevet the raw event from going through, but we
                // will only generate the high-level events for non-redundant 
                // actions.  We store the set of non-redundant actions in
                // the dictionary of this event. 
 
                // If the input is reporting a key down, the action is never
                // considered redundant. 
                if((keyboardInput.Actions & RawKeyboardActions.KeyDown) == RawKeyboardActions.KeyDown)
                {
                    /*RawKeyboardActions*/var actions = this.GetNonRedundantActions(e);
                    actions |= RawKeyboardActions.KeyDown; 
                    e.StagingItem.SetData(_tagNonRedundantActions, actions);
 
                    // Pass along the key that was pressed, and update our state. 
                    /*Key*/var key = KeyInterop.KeyFromVirtualKey(keyboardInput.VirtualKey);
                    e.StagingItem.SetData(this._tagKey, key); 
                    e.StagingItem.SetData(this._tagScanCode, new ScanCode(keyboardInput.ScanCode, keyboardInput.IsExtendedKey));

                    // Tell the InputManager that the MostRecentDevice is us.
                    if(this._inputManager!=null) 
                    	this._inputManager.Value.MostRecentInputDevice = this;
                } 
 
                //
                if((keyboardInput.Actions & RawKeyboardActions.KeyUp) == RawKeyboardActions.KeyUp) 
                {
                    /*RawKeyboardActions*/var actions = GetNonRedundantActions(e);
                    actions |= RawKeyboardActions.KeyUp;
                    e.StagingItem.SetData(this._tagNonRedundantActions, actions); 

                    // Pass along the key that was pressed, and update our state. 
                    /*Key*/var key = KeyInterop.KeyFromVirtualKey(keyboardInput.VirtualKey); 
                    e.StagingItem.SetData(this._tagKey, key);
                    e.StagingItem.SetData(this._tagScanCode, new ScanCode(keyboardInput.ScanCode, keyboardInput.IsExtendedKey)); 

                    // Tell the InputManager that the MostRecentDevice is us.
                    if(this._inputManager!=null)
                    	this._inputManager.Value.MostRecentInputDevice = this; 
                }
            } 
 
            // On KeyDown, we might need to set the Repeat flag
 
            if(e.StagingItem.Input.RoutedEvent == Keyboard.PreviewKeyDownEvent)
            {
            	this.CheckForDisconnectedFocus();
 
                /*KeyEventArgs*/var args = e.StagingItem.Input;
 
                // Is this the same as the previous key?  (Look at the real key, e.g. TextManager 
                // might have changed args.Key it to Key.TextInput.)
 
                if (this._previousKey == args.RealKey)
                {
                    // Yes, this is a repeat (we got the keydown for it twice, with no KeyUp in between)
                    args.SetRepeat(true); 
                }
 
                // Otherwise, keep this key to check against next time. 
                else
                { 
                	this._previousKey = args.RealKey;
                    args.SetRepeat(false);
                }
            } 

            // On KeyUp, we clear Repeat flag 
            else if(e.StagingItem.Input.RoutedEvent == Keyboard.PreviewKeyUpEvent) 
            {
            	this.CheckForDisconnectedFocus(); 

                /*KeyEventArgs*/var args = e.StagingItem.Input;
                args.SetRepeat(false);
 
                // Clear _previousKey, so that down/up/down/up doesn't look like a repeat
                this._previousKey = Key.None; 
            } 
        },
 
        /// <SecurityNote>
        ///     Critical - calls critical functions PushInput, KeyEventArgs.UnsafeInputSource
        ///                and KeyEventArgs ctor.
        ///                accesses e.StagingItem.Input 
        /// </SecurityNote>
//        private void 
        PostProcessInput:function(/*object*/ sender, /*ProcessInputEventArgs*/ e) 
        {
            // PreviewKeyDown --> KeyDown 
            if(e.StagingItem.Input.RoutedEvent == Keyboard.PreviewKeyDownEvent)
            {
            	this.CheckForDisconnectedFocus();
 
                if(!e.StagingItem.Input.Handled)
                { 
                    /*KeyEventArgs*/var previewKeyDown = e.StagingItem.Input; 

                    // Dig out the real key. 
                    var isSystemKey = false;
                    var isImeProcessed = false;
                    var isDeadCharProcessed = false;
                    var key = previewKeyDown.Key; 
                    if (key == Key.System)
                    { 
                        isSystemKey = true; 
                        key = previewKeyDown.RealKey;
                    } 
                    else if (key == Key.ImeProcessed)
                    {
                        isImeProcessed = true;
                        key = previewKeyDown.RealKey; 
                    }
                    else if (key == Key.DeadCharProcessed) 
                    { 
                        isDeadCharProcessed = true;
                        key = previewKeyDown.RealKey; 
                    }

                    var keyDown = new KeyEventArgs(this, previewKeyDown.UnsafeInputSource, previewKeyDown.Timestamp, key);
                    keyDown.SetRepeat( previewKeyDown.IsRepeat ); 

                    // Mark the new event as SystemKey as appropriate. 
                    if (isSystemKey) 
                    {
                        keyDown.MarkSystem(); 
                    }
                    else if (isImeProcessed)
                    {
                        // Mark the new event as ImeProcessed as appropriate. 
                        keyDown.MarkImeProcessed();
                    } 
                    else if (isDeadCharProcessed) 
                    {
                        keyDown.MarkDeadCharProcessed(); 
                    }

                    keyDown.RoutedEvent=Keyboard.KeyDownEvent;
                    keyDown.ScanCode = previewKeyDown.ScanCode; 
                    keyDown.IsExtendedKey = previewKeyDown.IsExtendedKey;
                    e.PushInput(keyDown, e.StagingItem); 
                } 
            }
 
            // PreviewKeyUp --> KeyUp
            if(e.StagingItem.Input.RoutedEvent == Keyboard.PreviewKeyUpEvent)
            {
            	this.CheckForDisconnectedFocus(); 

                if(!e.StagingItem.Input.Handled) 
                { 
                    /*KeyEventArgs*/var previewKeyUp = e.StagingItem.Input;
 
                    // Dig out the real key.
                    var isSystemKey = false;
                    var isImeProcessed = false;
                    var isDeadCharProcessed = false; 
                    /*Key*/var key = previewKeyUp.Key;
                    if (key == Key.System) 
                    { 
                        isSystemKey = true;
                        key = previewKeyUp.RealKey; 
                    }
                    else if (key == Key.ImeProcessed)
                    {
                        isImeProcessed = true; 
                        key = previewKeyUp.RealKey;
                    } 
                    else if(key == Key.DeadCharProcessed) 
                    {
                        isDeadCharProcessed = true; 
                        key = previewKeyUp.RealKey;
                    }

                    var keyUp = new KeyEventArgs(this, previewKeyUp.UnsafeInputSource, previewKeyUp.Timestamp, key); 

                    // Mark the new event as SystemKey as appropriate. 
                    if (isSystemKey) 
                    {
                        keyUp.MarkSystem(); 
                    }
                    else if (isImeProcessed)
                    {
                        // Mark the new event as ImeProcessed as appropriate. 
                        keyUp.MarkImeProcessed();
                    } 
                    else if (isDeadCharProcessed) 
                    {
                        keyUp.MarkDeadCharProcessed(); 
                    }

                    keyUp.RoutedEvent=Keyboard.KeyUpEvent;
                    keyUp.ScanCode = previewKeyUp.ScanCode; 
                    keyUp.IsExtendedKey = previewKeyUp.IsExtendedKey;
                    e.PushInput(keyUp, e.StagingItem); 
                } 
            }
 
            /*RawKeyboardInputReport*/var keyboardInput = ExtractRawKeyboardInputReport(e, EnsureInputManager().InputReportEvent);
            if(keyboardInput != null)
            {
            	this.CheckForDisconnectedFocus(); 

                if(!e.StagingItem.Input.Handled) 
                { 
                    // In general, this is where we promote the non-redundant
                    // reported actions to our premier events. 
                    /*RawKeyboardActions*/var actions = this.GetNonRedundantActions(e);

                    // Raw --> PreviewKeyDown
                    if((actions & RawKeyboardActions.KeyDown) == RawKeyboardActions.KeyDown) 
                    {
                        /*Key*/var key = e.StagingItem.GetData(this._tagKey); 
                        if(key != Key.None) 
                        {
                            var previewKeyDown = new KeyEventArgs(this, keyboardInput.InputSource, keyboardInput.Timestamp, key); 
                            /*ScanCode*/var scanCode = e.StagingItem.GetData(_tagScanCode);
                            previewKeyDown.ScanCode = scanCode.Code;
                            previewKeyDown.IsExtendedKey = scanCode.IsExtended;
                            if (keyboardInput.IsSystemKey) 
                            {
                                previewKeyDown.MarkSystem(); 
                            } 
                            previewKeyDown.RoutedEvent=Keyboard.PreviewKeyDownEvent;
                            e.PushInput(previewKeyDown, e.StagingItem); 
                        }
                    }

                    // Raw --> PreviewKeyUp 
                    if((actions & RawKeyboardActions.KeyUp) == RawKeyboardActions.KeyUp)
                    { 
                        /*Key*/var key = e.StagingItem.GetData(this._tagKey); 
                        if(key != Key.None)
                        { 
                            var previewKeyUp = new KeyEventArgs(this, keyboardInput.InputSource, keyboardInput.Timestamp, key);
                            /*ScanCode*/var scanCode = e.StagingItem.GetData(this._tagScanCode);
                            previewKeyUp.ScanCode = scanCode.Code;
                            previewKeyUp.IsExtendedKey = scanCode.IsExtended; 
                            if (keyboardInput.IsSystemKey)
                            { 
                                previewKeyUp.MarkSystem(); 
                            }
                            previewKeyUp.RoutedEvent=Keyboard.PreviewKeyUpEvent; 
                            e.PushInput(previewKeyUp, e.StagingItem);
                        }
                    }
                } 

                // Deactivate 
                if((keyboardInput.Actions & RawKeyboardActions.Deactivate) == RawKeyboardActions.Deactivate) 
                {
                    if(this.IsActive) 
                    {
                    	this._activeSource = null;

                        // Even if handled, a keyboard deactivate results in a lost focus. 
                    	this.ChangeFocus(null, e.StagingItem.Input.Timestamp);
                    } 
                } 
            }
        }, 

        /// <SecurityNote>
        ///     Critical: accesses the StagingInput
        /// </SecurityNote> 
//        private RawKeyboardInputReport 
        ExtractRawKeyboardInputReport:function(/*NotifyInputEventArgs*/ e, /*RoutedEvent*/ Event) 
        { 
            /*RawKeyboardInputReport*/var keyboardInput = null;
 
            /*InputReportEventArgs*/var input = e.StagingItem.Input;
            input = input instanceof InputReportEventArgs ? input : null;
            if(input != null)
            {
                if(input.Report.Type == InputType.Keyboard && input.RoutedEvent == Event) 
                {
                    keyboardInput = input.Report instanceof RawKeyboardInputReport ? input.Report : null; 
                } 
            }
 
            return keyboardInput;
        },

//        private RawKeyboardActions 
        GetNonRedundantActions:function(/*NotifyInputEventArgs*/ e) 
        {
            /*RawKeyboardActions*/var actions; 
 
            // The CLR throws a null-ref exception if it tries to unbox a
            // null.  So we have to special case that. 
            var o = e.StagingItem.GetData(_tagNonRedundantActions);
            if(o != null)
            {
                actions =  o; 
            }
            else 
            { 
                actions = new RawKeyboardActions();
            } 

            return actions;
        },
 
        //
//        private bool 
        CheckForDisconnectedFocus:function() 
        {
            var wasDisconnected = false;

            if(InputElement.GetRootVisual (this._focus instanceof DependencyObject ? this._focus : null) != _focusRootVisual) 
            {
                wasDisconnected = true; 
                Focus (null); 
            }
 
            return wasDisconnected;
        },
        
        
	});
	
	Object.defineProperties(KeyboardDevice.prototype,{
		/// <summary>
        ///     Returns the element that input from this device is sent to. 
        /// </summary>
//        public override IInputElement 
		Target:
        {
            get:function()
            {
                //VerifyAccess(); 
                if(null != this.ForceTarget) 
                    return this.ForceTarget;
 
                return this.FocusedElement;
            }
        },
 
//        internal IInputElement 
        ForceTarget:
        { 
            get:function() 
            {
                return this._forceTarget; 
            },
            set:function(value)
            {
            	this._forceTarget = value instanceof DependencyObject ? value : null; 
            }
        }, 
 
        /// <summary>
        ///     Returns the PresentationSource that is reporting input for this device. 
        /// </summary>
        /// <remarks>
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API.
        /// </remarks> 
        ///<SecurityNote>
        /// Critical - accesses critical data ( _activeSource) 
        /// PublicOK - there is a demand. 
        ///</SecurityNote>
 
//        public override PresentationSource 
        ActiveSource:
        {
            get:function() 
            {
                if (this._activeSource != null) 
                {
                    return this._activeSource;
                }
 
                return null;
            } 
        }, 

        /// <summary> 
        ///     The default mode for restoring focus.
        /// <summary>
//        public RestoreFocusMode 
        DefaultRestoreFocusMode: {get:function(){}, set:function(value){}},
 
        /// <summary>
        ///     Returns the element that the keyboard is focused on. 
        /// </summary> 
//        public IInputElement 
        FocusedElement:
        { 
            get:function()
            {
//                 VerifyAccess();
                return this._focus; 
            }
        },
        
        /// <summary> 
        ///     Returns the set of modifier keys currently pressed as determined by querying our keyboard state cache
        /// </summary> 
//        public ModifierKeys 
        Modifiers:
        {
            get:function()
            { 
                var modifiers = ModifierKeys.None; 
                if(!this._domEvent){
                	return modifiers;
                }
                if(this._domEvent.altKey)
                { 
                    modifiers |= ModifierKeys.Alt;
                }
                if(this._domEvent.ctrlKey)
                { 
                    modifiers |= ModifierKeys.Control;
                } 
                if(this._domEvent.shiftKey) 
                {
                    modifiers |= ModifierKeys.Shift; 
                }

                return modifiers;
            } 
        },
        /// <SecurityNote>
        ///     Critical:This entity is not safe to give out 
        /// </SecurityNote>
//        internal TextServicesManager 
        TextServicesManager: 
        { 
           get:function() 
           {
               return _TsfManager;
           } 
        },
 
 
       /// <SecurityNote>
       ///     Critical:This entity is not safe to give out 
       /// </SecurityNote>
//       internal TextCompositionManager 
        TextCompositionManager:
        {
           get:function()
           { 
               return _textcompositionManager;
           } 
        },
        
        /// <SecurityNote> 
        ///     Critical: accesses critical data (_inputSource)
        ///     TreatAsSafe: doesn't expose critical data, just returns true/false. 
        /// </SecurityNote> 
//        internal bool 
        IsActive:
        { 
            get:function()
            {
                return this._activeSource != null; 
            }
        }, 
 
//        private DeferredElementTreeState 
        FocusTreeState:
        { 
            get:function()
            {
                if (this._focusTreeState == null)
                { 
                	this._focusTreeState = new DeferredElementTreeState();
                } 
 
                return this._focusTreeState;
            } 
        },
        DOMEvent:{
        	get:function(){
        		return this._domEvent;
        	},
        	set:function(value){
        		this._domEvent = value;
        	}
        }
 
	});
	
	Object.defineProperties(KeyboardDevice,{
		  
	});
	
	KeyboardDevice.Type = new Type("KeyboardDevice", KeyboardDevice, [InputDevice.Type]);
	return KeyboardDevice;
});
