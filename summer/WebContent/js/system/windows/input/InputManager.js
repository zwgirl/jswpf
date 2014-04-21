/**
 * InputManager
 */

define(["dojo/_base/declare", "system/Type", "threading/DispatcherObject", "input/SynchronizedInputStates",
        "collections/Hashtable", "collections/Stack", "input/MouseDevice", "input/KeyboardDevice"], 
		function(declare, Type, DispatcherObject, SynchronizedInputStates,
				Hashtable, Stack, MouseDevice){
    // Synchronized input automation related fields 

    // Used to indicate whether any element is currently listening for synchronized input.
//    private static bool 
	var _isSynchronizedInput;

    // Element listening for synchronized input.
//    private static DependencyObject 
	var _listeningElement; 

    // Input event the element is listening on.
//    private static RoutedEvent[] 
	var _synchronizedInputEvents; 

    // Complementary pair of input event the element is listening on.
//    private static RoutedEvent[] 
	var _pairedSynchronizedInputEvents;

    // Input type the element is listening on.
//    private static SynchronizedInputType 
	var _synchronizedInputType; 

    // Used to track state of synchronized input.
//    private static SynchronizedInputStates 
	var _synchronizedInputState = SynchronizedInputStates.NoOpportunity; 

    // Used to store the DispatcherOperation that waits until KeyDowns are translated to fire the corresponding AutomationEvent.
//    private static DispatcherOperation 
	var _synchronizedInputAsyncClearOperation;

    // Lock used to serialize access to synchronized input related static fields.
//    private static object _synchronizedInputLock = new object(); 
	
	var InputManager = declare("InputManager", DispatcherObject, {
		constructor:function(){
		     /// <SecurityNote>
	        ///     This table holds critical data not ok to expose
	        /// </SecurityNote> 
//	        private Hashtable 
			this._inputProviders = new Hashtable(); 

	        this._stagingArea = new Stack();

	        this._primaryKeyboardDevice = new KeyboardDevice(this); 
	        this._primaryMouseDevice = new MouseDevice(this);
//	        this._primaryCommandDevice = new CommandDevice(this); 

//	        this._stylusLogic = new StylusLogic(this);
//
//	        this._continueProcessingStagingAreaCallback = new DispatcherOperationCallback(this, ContinueProcessingStagingArea); 
//
	        this._hitTestInvalidatedAsyncOperation = null; 
//	        this._hitTestInvalidatedAsyncCallback = new DispatcherOperationCallback(this, HitTestInvalidatedAsyncCallback); 
//
//	        this._layoutUpdatedCallback = new EventHandler(this, OnLayoutUpdated); //need to cache it, LM only keeps weak ref 
//	        ContextLayoutManager.From(Dispatcher).LayoutEvents.Add(_layoutUpdatedCallback);
//
//	        // Timer used to synchronize the input devices periodically
//	        this._inputTimer = new DispatcherTimer(DispatcherPriority.Background); 
//	        this._inputTimer.Tick += new EventHandler(ValidateInputDevices);
//	        this._inputTimer.Interval = TimeSpan.FromMilliseconds(125); 
	        
	        this._inDragDrop = false;
	        
//	        private InputDevice 
	        this._mostRecentInputDevice = false;
	        
//	        private int 
	        this._menuModeCount = 0;
		},
		
        /// <summary>
        /// Raises the TranslateAccelerator event 
        /// </summary>
        /// <SecurityNote>
        ///     Critical: Accesses critical _translateAccelerator.
        /// </SecurityNote> 
//        internal void 
		RaiseTranslateAccelerator:function(/*KeyEventArgs*/ e) 
        { 
            if (_translateAccelerator != null)
            { 
            	_translateAccelerator(this, e);
            }
        },
 
        /// <summary>
        ///     Registers an input provider with the input manager. 
        /// </summary> 
        /// <param name="inputProvider">
        ///     The input provider to register. 
        /// </param>
        /// <SecurityNote>
        ///     This class will not be available in internet zone.
        ///     Critical: This code acceses and stores critical data (InputProvider) 
        ///     TreatAsSafe: This code demands UIPermission.
        /// </SecurityNote> 
//        internal InputProviderSite 
        RegisterInputProvider:function(/*IInputProvider*/ inputProvider)
        { 
            SecurityHelper.DemandUnrestrictedUIPermission();
//             VerifyAccess();

 
            // Create a site for this provider, and keep track of it.
            var site = new InputProviderSite(this, inputProvider); 
            _inputProviders[inputProvider] = site; 

            return site; 
        },

        /// <SecurityNote>
        ///     This class will not be available in internet zone. 
        ///     Critical: This code acceses critical data in the form of InputProvider
        /// </SecurityNote> 
//        internal void 
        UnregisterInputProvider:function(/*IInputProvider*/ inputProvider)
        { 
            _inputProviders.Remove(inputProvider);
        },
        
        /// <summary>
        ///     Controls call this to enter menu mode. 
        ///</summary>
//        public void 
        PushMenuMode:function(/*PresentationSource*/ menuSite)
        {
            if (menuSite == null) 
            {
                throw new ArgumentNullException("menuSite"); 
            } 
            menuSite.VerifyAccess();
 
            menuSite.PushMenuMode();
            _menuModeCount += 1;

            if (1 == _menuModeCount) 
            {
                var enterMenuMode = EnterMenuMode; 
                if (null != enterMenuMode) 
                {
                    enterMenuMode(null, EventArgs.Empty); 
                }
            }
        },
 
        /// <summary>
        ///     Controls call this to leave menu mode. 
        ///</summary> 
//        public void 
        PopMenuMode:function(/*PresentationSource*/ menuSite)
        { 
            if (menuSite == null)
            {
                throw new ArgumentNullException("menuSite");
            } 
            menuSite.VerifyAccess();
 
            if (_menuModeCount <= 0) 
            {
                throw new InvalidOperationException(); 
            }

            menuSite.PopMenuMode();
            _menuModeCount -= 1; 

            if (0 == _menuModeCount) 
            { 
                var leaveMenuMode = LeaveMenuMode;
                if (null != leaveMenuMode) 
                {
                    leaveMenuMode(null, EventArgs.Empty);
                }
            } 
        },
        
//        internal void 
        NotifyHitTestInvalidated:function() 
        {
//            // The HitTest result may have changed for someone somewhere.
//            // Raise the HitTestInvalidatedAsync event after the next layout.
//            if(this._hitTestInvalidatedAsyncOperation == null) 
//            {
//                // It would be best to re-evaluate anything dependent on the hit-test results 
//                // immediately after layout & rendering are complete.  Unfortunately this can 
//                // lead to an infinite loop.  Consider the following scenario:
//                // 
//                // If the mouse is over an element, hide it.
//                //
//                // This never resolves to a "correct" state.  When the mouse moves over the
//                // element, the element is hidden, so the mouse is no longer over it, so the 
//                // element is shown, but that means the mouse is over it again.  Repeat.
//                // 
//                // We push our re-evaluation to a priority lower than input processing so that 
//                // the user can change the input device to avoid the infinite loops, or close
//                // the app if nothing else works. 
//                //
//            	this._hitTestInvalidatedAsyncOperation = Dispatcher.BeginInvoke(DispatcherPriority.Input,
//                                                                        _hitTestInvalidatedAsyncCallback,
//                                                                        null); 
//            }
//            else if (this._hitTestInvalidatedAsyncOperation.Priority == DispatcherPriority.Inactive) 
//            { 
//                // This means that we are currently waiting for the timer to expire so
//                // that we can promote the current queue item to Input prority. Since 
//                // we are now being told that we need to re-hittest, we simply stop the
//                // timer and promote the queue item right now instead of waiting for expiry.
//
//                ValidateInputDevices(this, EventArgs.Empty); 
//            }
        }, 
 
//        private object 
        HitTestInvalidatedAsyncCallback:function(/*object*/ arg)
        {
        	this._hitTestInvalidatedAsyncOperation = null; 
            if (HitTestInvalidatedAsync != null)
            { 
                HitTestInvalidatedAsync(this, EventArgs.Empty); 
            }
 
            return null;
        },

//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e) 
        {
            NotifyHitTestInvalidated(); 
        }, 

        /// <summary> 
        /// Start the timer that will kick off synchronize
        /// operation on all the input devices upon expiry
        /// </summary>
//        internal void I
        nvalidateInputDevices:function() 
        {
            // If there is no pending ansyc hittest operation 
 
            if (this._hitTestInvalidatedAsyncOperation == null)
            { 
                // Post an inactive item to the queue. When the timer expires
                // we will promote this queue item to Input priority.

            	this._hitTestInvalidatedAsyncOperation = Dispatcher.BeginInvoke(DispatcherPriority.Inactive, 
                                                                        _hitTestInvalidatedAsyncCallback,
                                                                        null); 
 
                // Start the input timer
 
                _inputTimer.IsEnabled = true;
            }
        },
 
        /// <summary>
        /// Synchronize the  input devices 
        /// </summary> 
//        private void 
        ValidateInputDevices:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            // This null check was necessary as a fix for Dev10 bug #453002. It turns out that
            // somehow we get here after the DispatcherOperation has been dispatched and we
            // need to no-op on that.
 
            if (this._hitTestInvalidatedAsyncOperation != null)
            { 
 
                // Promote the pending DispatcherOperation to Input Priority
 
            	this._hitTestInvalidatedAsyncOperation.Priority = DispatcherPriority.Input;

            }
 
            // Stop the input timer
 
            _inputTimer.IsEnabled = false; 
        },
 
        /// <summary>
        ///     Synchronously processes the specified input.
        /// </summary>
        /// <remarks> 
        ///     The specified input is processed by all of the filters and
        ///     monitors, and is finally dispatched to the appropriate 
        ///     element as an input event. 
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API.
        /// </remarks> 
        /// <returns>
        ///     Whether or not any event generated as a consequence of this
        ///     event was handled.
        /// </returns> 
        /// <SecurityNote>
        ///     Critical: This code can cause input to be processed. 
        ///     PublicOK: This code link demands. 
        /// </SecurityNote>
//        public bool 
        ProcessInput:function(/*InputEventArgs*/ input)
        {
//             VerifyAccess(); 

//            if(input == null) 
//            { 
//                throw new ArgumentNullException("input");
//            } 
//
//            // Push a marker indicating the portion of the staging area
//            // that needs to be processed.
//            PushMarker(); 
//
//            // Push the input to be processed onto the staging area. 
//            PushInput(input, null); 
//
//            // Post a work item to continue processing the staging area 
//            // in case someone pushes a dispatcher frame in the middle
//            // of input processing.
//            RequestContinueProcessingStagingArea();
// 
//            // Now drain the staging area up to the marker we pushed.
//            var handled = ProcessStagingArea(); 
//            return handled; 
        },
 
        ///<SecurityNote>
        /// Critical - accesses critical data ( _stagingArea)
        ///</SecurityNote>
//        internal StagingAreaInputItem 
        PushInput:function(/*StagingAreaInputItem*/ inputItem)
        { 
            _stagingArea.Push(inputItem); 
            return inputItem;
        }, 

        ///<SecurityNote>
        /// Critical - accesses critical function ( PushInput)
        ///</SecurityNote> 
//        internal StagingAreaInputItem 
        PushInput:function(/*InputEventArgs*/ input, /*StagingAreaInputItem*/ promote) 
        { 
            var item = new StagingAreaInputItem(false);
            item.Reset(input, promote); 

            return PushInput(item);
        },
 
        ///<SecurityNote>
        /// Critical - calls a critical function ( PushInput). 
        ///</SecurityNote> 
//        internal StagingAreaInputItem 
        PushMarker:function() 
        {
            var item = new StagingAreaInputItem(true);

            return PushInput(item); 
        },
 
        ///<SecurityNote> 
        /// Critical - accesses critical data _stagingArea.
        ///</SecurityNote> 
//        internal StagingAreaInputItem 
        PopInput:function()
        {
            var input = null; 

            if(_stagingArea.Count > 0) 
            { 
                input = _stagingArea.Pop();
            } 

            return input instanceof StagingAreaInputItem ? input : null;
        },
 
        ///<SecurityNote> 
        /// Critical - accesses the _stagingArea critical data. 
        ///</SecurityNote>
//        internal StagingAreaInputItem 
        PeekInput:function()
        {
            var input = null;
 
            if(_stagingArea.Count > 0)
            { 
                input = _stagingArea.Peek(); 
            }
 
            return input instanceof StagingAreaInputItem ? input : null;
        },

        ///<SecurityNote> 
        /// Critical - accesses critical data ( _stagingArea.Count) and calls a critical function - ProcessStagingArea
        ///</SecurityNote> 
//        internal object 
        ContinueProcessingStagingArea:function(/*object*/ unused)
        { 
            _continueProcessingStagingArea = false;

            // It is possible that we can be re-entered by a nested
            // dispatcher frame.  Continue processing the staging 
            // area if we need to.
            if(_stagingArea.Count > 0) 
            { 
                // Before we actually start to drain the staging area, we need
                // to post a work item to process more input.  This enables us 
                // to process more input if we enter a nested pump.
                RequestContinueProcessingStagingArea();

                // Now synchronously drain the staging area. 
                ProcessStagingArea();
            } 
 
            return null;
        }, 
        
        ///<SecurityNote>
        /// Critical: accesses critical data ( PopInput()) and raises events with the user-initiated flag 
        ///</SecurityNote>
//        private bool 
        ProcessStagingArea:function()
        { 
            var handled = false;
 
            // For performance reasons, try to reuse the input event args. 
            // If we are reentrered, we have to start over with fresh event
            // args, so we clear the member variables before continuing. 
            // Also, we cannot simply make an single instance of the
            // PreProcessedInputEventArgs and cast it to NotifyInputEventArgs
            // or ProcessInputEventArgs because a malicious user could upcast
            // the object and call inappropriate methods. 
            var notifyInputEventArgs = (_notifyInputEventArgs != null) ? _notifyInputEventArgs : new NotifyInputEventArgs();
            var processInputEventArgs = (_processInputEventArgs != null) ? _processInputEventArgs : new ProcessInputEventArgs(); 
            var preProcessInputEventArgs = (_preProcessInputEventArgs != null) ? _preProcessInputEventArgs : new PreProcessInputEventArgs(); 
            _notifyInputEventArgs = null;
            _processInputEventArgs = null; 
            _preProcessInputEventArgs = null;

            // Because we can be reentered, we can't just enumerate over the
            // staging area - that could throw an exception if the queue 
            // changes underneath us.  Instead, just loop until we find a
            // frame marker or until the staging area is empty. 
            var item = null; 
            while((item = PopInput()) != null)
            { 
                // If we found a marker, we have reached the end of a
                // "section" of the staging area.  We just return from
                // the synchronous processing of the staging area.
                // If a dispatcher frame has been pushed by someone, this 
                // will not return to the original ProcessInput.  Instead
                // it will unwind to the dispatcher and since we have 
                // already pushed a work item to continue processing the 
                // input, it will simply call back into us to do more
                // processing.  At which point we will continue to drain 
                // the staging area.  This could cause strage behavior,
                // but it is deemed more acceptable than stalling input
                // processing.
                // 

                if(item.IsMarker) 
                {
                    break;
                }
 
                // Pre-Process the input.  This could modify the staging
                // area, and it could cancel the processing of this 
                // input event. 
                //
                // Because we use multi-cast delegates, we always have to 
                // create a new multi-cast delegate when we add or remove
                // a handler.  This means we can just call the current
                // multi-cast delegate instance, and it is safe to iterate
                // over, even if we get reentered. 
                if (_preProcessInput != null)
                { 
                    preProcessInputEventArgs.Reset(item, this); 

                    // Invoke the handlers in reverse order so that handlers that 
                    // users add are invoked before handlers in the system.
                    /*Delegate[]*/var handlers = _preProcessInput.GetInvocationList();
                    for(var i = (handlers.length - 1); i >= 0; i--)
                    { 
                        /*PreProcessInputEventHandler*/var handler = handlers[i];
                        handler.Invoke(this, preProcessInputEventArgs); 
                    } 
                }
 
                if(!preProcessInputEventArgs.Canceled)
                {
                    // Pre-Notify the input.
                    // 
                    // Because we use multi-cast delegates, we always have to
                    // create a new multi-cast delegate when we add or remove 
                    // a handler.  This means we can just call the current 
                    // multi-cast delegate instance, and it is safe to iterate
                    // over, even if we get reentered. 
                    if(_preNotifyInput != null)
                    {
                        notifyInputEventArgs.Reset(item, this);
 
                        // Invoke the handlers in reverse order so that handlers that
                        // users add are invoked before handlers in the system. 
                        /*Delegate[]*/var handlers = _preNotifyInput.GetInvocationList(); 
                        for(var i = (handlers.length - 1); i >= 0; i--)
                        { 
                            /*NotifyInputEventHandler*/var handler = handlers[i];
                            handler.Invoke(this, notifyInputEventArgs);
                        }
                    } 

                    // Raise the input event being processed. 
                    /*InputEventArgs*/var input = item.Input; 

                    // Some input events are explicitly associated with 
                    // an element.  Those that are not are associated with
                    // the target of the input device for this event.
                    var eventSource = input.Source instanceof DependencyObject ? input.Source : null;
                    if(eventSource == null || !InputElement.IsValid(eventSource instanceof IInputElement ? eventSource : null)) 
                    {
                        if (input.Device != null) 
                        { 
                            eventSource = input.Device.Target instanceof DependencyObject ? input.Device.Target : null;
                        } 
                    }

                    // During synchronized input processing, event should be discarded if not listening for this input type.
                    if (_isSynchronizedInput && 
                        SynchronizedInputHelper.IsMappedEvent(input) &&
                        Array.IndexOf(SynchronizedInputEvents, input.RoutedEvent) < 0 && 
                        Array.IndexOf(PairedSynchronizedInputEvents, input.RoutedEvent) < 0) 
                    {
                        if (!SynchronizedInputHelper.ShouldContinueListening(input)) 
                        {
                            // Discard the event
                            _synchronizedInputState = SynchronizedInputStates.Discarded;
                            SynchronizedInputHelper.RaiseAutomationEvents(); 
                            CancelSynchronizedInput();
                        } 
                        else 
                        {
                            _synchronizedInputAsyncClearOperation = Dispatcher.BeginInvoke(/*(Action)delegate*/ function()
                                {
                                    // Discard the event
                                    _synchronizedInputState = SynchronizedInputStates.Discarded;
                                    SynchronizedInputHelper.RaiseAutomationEvents(); 
                                    CancelSynchronizedInput();
                                }, 
                                DispatcherPriority.Background); 
                        }
                    } 
                    else
                    {
                        if (eventSource != null)
                        { 
                            if (InputElement.IsUIElement(eventSource))
                            { 
                                /*UIElement*/var e = eventSource; 

                                e.RaiseEvent(input, true); // Call the "trusted" flavor of RaiseEvent. 
                            }
                            else if (InputElement.IsContentElement(eventSource))
                            {
                                /*ContentElement*/var ce = eventSource; 

                                ce.RaiseEvent(input, true);// Call the "trusted" flavor of RaiseEvent. 
                            } 
                            else if (InputElement.IsUIElement3D(eventSource))
                            { 
                                /*UIElement3D*/var e3D = eventSource;

                                e3D.RaiseEvent(input, true); // Call the "trusted" flavor of RaiseEvent
                            } 

                            // If synchronized input raise appropriate automation event. 
 
                            if (_isSynchronizedInput && SynchronizedInputHelper.IsListening(_listeningElement, input))
                            { 
                                if (!SynchronizedInputHelper.ShouldContinueListening(input))
                                {
                                    SynchronizedInputHelper.RaiseAutomationEvents();
                                    CancelSynchronizedInput(); 
                                }
                                else 
                                { 
                                    _synchronizedInputAsyncClearOperation = Dispatcher.BeginInvoke(/*(Action)delegate*/function()
                                        { 
                                            SynchronizedInputHelper.RaiseAutomationEvents();
                                            CancelSynchronizedInput();
                                        },
                                        DispatcherPriority.Background); 
                                }
                            } 
                        } 
                    }
 
                    // Post-Notify the input.
                    //
                    // Because we use multi-cast delegates, we always have to
                    // create a new multi-cast delegate when we add or remove 
                    // a handler.  This means we can just call the current
                    // multi-cast delegate instance, and it is safe to iterate 
                    // over, even if we get reentered. 
                    if(_postNotifyInput != null)
                    { 
                        notifyInputEventArgs.Reset(item, this);

                        // Invoke the handlers in reverse order so that handlers that
                        // users add are invoked before handlers in the system. 
                        /*Delegate[]*/var handlers = _postNotifyInput.GetInvocationList();
                        for(var i = (handlers.length - 1); i >= 0; i--) 
                        { 
                            /*NotifyInputEventHandler*/var handler = handlers[i];
                            handler.Invoke(this, notifyInputEventArgs); 
                        }
                    }

                    // Post-Process the input.  This could modify the staging 
                    // area.
                    // 
                    // Because we use multi-cast delegates, we always have to 
                    // create a new multi-cast delegate when we add or remove
                    // a handler.  This means we can just call the current 
                    // multi-cast delegate instance, and it is safe to iterate
                    // over, even if we get reentered.
                    if(_postProcessInput != null)
                    { 
                        processInputEventArgs.Reset(item, this);
 
                        RaiseProcessInputEventHandlers(_postProcessInput, processInputEventArgs); 

                        // PreviewInputReport --> InputReport 
                        if(item.Input.RoutedEvent == InputManager.PreviewInputReportEvent)
                        {
                            if(!item.Input.Handled)
                            { 
                                /*InputReportEventArgs*/var previewInputReport = item.Input;
 
                                /*InputReportEventArgs*/var inputReport = new InputReportEventArgs(previewInputReport.Device, previewInputReport.Report); 
                                inputReport.RoutedEvent=InputManager.InputReportEvent;
                                PushInput(inputReport, item); 
                            }
                        }
                    }
 
                    if(input.Handled)
                    { 
                        handled = true; 
                    }
                } 
            }

            // Store our input event args so that we can use them again, and
            // avoid having to allocate more. 
            _notifyInputEventArgs = notifyInputEventArgs;
            _processInputEventArgs = processInputEventArgs; 
            _preProcessInputEventArgs = preProcessInputEventArgs; 

            // Make sure to throw away the contents of the event args so 
            // we don't keep refs around to things we don't mean to.
            _notifyInputEventArgs.Reset(null, null);
            _processInputEventArgs.Reset(null, null);
            _preProcessInputEventArgs.Reset(null, null); 

            return handled; 
        }, 

        ///<SecurityNote> 
        ///  Critical - sets the MarkAsUserInitiated bit.
        ///</SecurityNote>
//        private void 
        RaiseProcessInputEventHandlers:function(/*ProcessInputEventHandler*/ postProcessInput, /*ProcessInputEventArgs*/ processInputEventArgs)
        { 
            processInputEventArgs.StagingItem.Input.MarkAsUserInitiated(); 

            try 
            {
                // Invoke the handlers in reverse order so that handlers that
                // users add are invoked before handlers in the system.
                /*Delegate[]*/var handlers = postProcessInput.GetInvocationList(); 
                for(var i = (handlers.length - 1); i >= 0; i--)
                { 
                    /*ProcessInputEventHandler*/var handler = handlers[i]; 
                    handler.Invoke(this, processInputEventArgs);
                } 
            }
            finally // we do this in a finally block in case of exceptions
            {
                processInputEventArgs.StagingItem.Input.ClearUserInitiated(); 
            }
        }, 
 

//        private void 
        RequestContinueProcessingStagingArea:function() 
        {
            if(!_continueProcessingStagingArea)
            {
                Dispatcher.BeginInvoke(DispatcherPriority.Input, _continueProcessingStagingAreaCallback, null); 
                _continueProcessingStagingArea = true;
            } 
        },
        

//        private DispatcherOperationCallback _continueProcessingStagingAreaCallback; 
//        private bool _continueProcessingStagingArea;
//
//        private NotifyInputEventArgs _notifyInputEventArgs;
//        private ProcessInputEventArgs _processInputEventArgs; 
//        private PreProcessInputEventArgs _preProcessInputEventArgs;
        
	});
	
	Object.defineProperties(InputManager.prototype,{
	       /// <summary></summary> 
        /// <remarks>
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///     Critical: This event lets people subscribe to all events in the system
        ///     PublicOk: Method is link demanded. 
        /// </SecurityNote> 
//        public event PreProcessInputEventHandler 
        PreProcessInput:
        {
        	get:function(){
        		if(this._preProcessInput === null){
        			this._preProcessInput = new PreProcessInputEventHandler();
        		}
        		
        		return this._preProcessInput;
        	}
        },
//        { 
//            add
//            { 
//                _preProcessInput += value;
//            } 
//            remove 
//            {
//                _preProcessInput -= value;
//            }
//        } 

 
        /// <summary></summary> 
        /// <remarks>
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API. 
        /// </remarks>
        /// <SecurityNote>
        ///     Critical: This event lets people subscribe to all events in the system
        ///     Not safe to expose. 
        ///     PublicOk: Method is link demanded.
        /// </SecurityNote> 
//        public event NotifyInputEventHandler 
        PreNotifyInput:
        {
        	get:function(){
        		if(this._preNotifyInput === null){
        			this._preNotifyInput = new NotifyInputEventHandler();
        		}
        		
        		return this._preNotifyInput;
        	}
        }, 
//        {
//            add
//            {
//                _preNotifyInput += value; 
//            }
//            remove
//            { 
//                _preNotifyInput -= value;
//            }
//
//        } 
        /// <summary></summary>
        /// <remarks> 
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///     Critical: This event lets people subscribe to all events in the system
        ///     Not safe to expose.
        ///     PublicOk: Method is link demanded.
        /// </SecurityNote> 
//        public event NotifyInputEventHandler 
        PostNotifyInput:
        {
        	get:function(){
        		if(this._postNotifyInput === null){
        			this._postNotifyInput = new NotifyInputEventHandler();
        		}
        		
        		return this._postNotifyInput;
        	}
        },
//        { 
//            add 
//            {
//                _postNotifyInput += value;
//            }
//            remove 
//            { 
//                _postNotifyInput -= value;
// 
//            }
//        }

        /// <summary></summary> 
        /// <remarks>
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API. 
        /// </remarks> 
        /// <SecurityNote>
        ///     Critical: This event lets people subscribe to all events in the system 
        ///     Not safe to expose.
        ///     PublicOk: Method is link demanded.
        /// </SecurityNote>
//        public event ProcessInputEventHandler 
        PostProcessInput:
        {
        	get:function(){
        		if(this._postProcessInput === null){
        			this._postProcessInput = new ProcessInputEventHandler();
        		}
        		
        		return this._postProcessInput;
        	}
        },
        
//        {
//            add
//            { 
//                _postProcessInput += value;
//            }
//            remove
//            { 
//                _postProcessInput -= value; 
//            }
//        } 

        /// <summary>
        /// This event is raised by the HwndSource.CriticalTranslateAccelerator
        /// on descendent HwndSource instances. The only subscriber to this event 
        /// is KeyboardNavigation.
        /// </summary> 
        /// <SecurityNote> 
        ///     Critical: This event lets people subscribe to all input notifications
        /// </SecurityNote> 
//        internal event KeyEventHandler 
        TranslateAccelerator:
        {
        	get:function(){
        		if(this._translateAccelerator === null){
        			this._translateAccelerator = new KeyEventHandler();
        		}
        		
        		return this._translateAccelerator;
        	}
        },
//        {
//            add
//            { 
//                _translateAccelerator += value; 
//            }
//            remove
//            {
//                _translateAccelerator -= value; 
//            }
//        } 
 
        /// <summary> 
        ///     This event notifies when the input manager enters menu mode.
        ///</summary>
//        public event EventHandler 
        EnterMenuMode:
        {
        	get:function(){
        		if(this._EnterMenuMode === null){
        			this._EnterMenuMode = new EventHandler();
        		}
        		
        		return this._EnterMenuMode;
        	}
        },
 
        /// <summary>
        ///     This event notifies when the input manager leaves menu mode. 
        ///</summary> 
//        public event EventHandler 
        LeaveMenuMode:
        {
        	get:function(){
        		if(this._LeaveMenuMode === null){
        			this._LeaveMenuMode = new EventHandler();
        		}
        		
        		return this._LeaveMenuMode;
        	}
        },
 


        /// <summary>
        ///     An event that is raised whenever the result of a hit-test may 
        ///     have changed.
        /// </summary> 
//        public event EventHandler 
        HitTestInvalidatedAsync:
        {
        	get:function(){
        		if(this._HitTestInvalidatedAsync === null){
        			this._HitTestInvalidatedAsync = new EventHandler();
        		}
        		
        		return this._HitTestInvalidatedAsync;
        	}
        }, 
        
        /// <summary> 
        ///     Returns a collection of input providers registered with the input manager.
        /// </summary> 
        /// <remarks> 
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///     This class will not be available in internet zone.
        ///     Critical: This code exposes InputProviders which are
        ///               considered as critical data 
        ///     PublicOK: This code has a demand on it
        /// </SecurityNote> 
//        public ICollection 
        InputProviders: 
        {
            get:function()
            {
                return this.UnsecureInputProviders; 
            }
        },

        /// <summary> 
        ///     Returns a collection of input providers registered with the input manager.
        /// </summary>
        /// <SecurityNote>
        ///     Critical: This code exposes InputProviders which are considered as critical data 
        ///     This overload exists for perf. improvements in the internet zone since this function is called
        ///     quite often 
        /// </SecurityNote> 
//        internal ICollection 
        UnsecureInputProviders:
        { 
            get:function()
            {
                return this._inputProviders.Keys; 
            }
        }, 
        /// <summary> 
        ///     Read-only access to the primary keyboard device.
        /// </summary> 
//        public KeyboardDevice 
        PrimaryKeyboardDevice:
        {
            get:function() {return this._primaryKeyboardDevice;} 
        },
 
        /// <summary> 
        ///     Read-only access to the primary mouse device.
        /// </summary> 
//        public MouseDevice 
        PrimaryMouseDevice:
        {
            get:function() {return this._primaryMouseDevice;} 
        },
        /// <SecurityNote> 
        ///     Critical, accesses critical member _stylusLogic 
        /// </SecurityNote>
//        internal StylusLogic 
        StylusLogic: 
        {
            get:function() { return this._stylusLogic; }
        }, 

        /// <summary> 
        ///     Read-only access to the primary keyboard device. 
        /// </summary>
//        internal CommandDevice 
        PrimaryCommandDevice:
        {
            get:function() {return this._primaryCommandDevice;}
        },
 
        /// <summary>
        ///     The InDragDrop property represents whether we are currently inside 
        ///     a OLE DragDrop operation. 
        /// </summary>
//        internal bool 
        InDragDrop: 
        {
            get:function() { return this._inDragDrop; },
            set:function(value) { this._inDragDrop = value; }
        }, 

        /// <summary> 
        ///     The MostRecentInputDevice represents the last input device to 
        ///     report an "interesting" user action.  What exactly constitutes
        ///     such an action is up to each device to implement. 
        /// </summary>
//        public InputDevice 
        MostRecentInputDevice:
        {
            get:function() { return this._mostRecentInputDevice; }, 
            /*internal*/ set:function(value) { this._mostRecentInputDevice = value; }
        },
        /// <summary> 
        ///     Returns whether or not the input manager is in menu mode.
        ///</summary> 
//        public bool 
        IsInMenuMode:
        {
            get:function()
            { 
                return (this._menuModeCount > 0);
            } 
        },
        
        
	});
	
	Object.defineProperties(InputManager,{
	    /// <summary> 
        ///     Return the input manager associated with the current context.
        /// </summary>
        /// <remarks>
        ///     Callers must have UIPermission(PermissionState.Unrestricted) to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///     Critical: This class is not ok to expose since SEE apps 
        ///               should not have to deal with this directly and
        ///               it exposes methods that can be use for input spoofing 
        ///
        /// </SecurityNote>
//        public static InputManager 
		Current:
        { 
            get:function() 
            {
                return GetCurrentInputManagerImpl(); 
            }
        },
        /// <summary> 
        ///     A routed event indicating that an input report arrived.
        /// </summary> 
//        internal static readonly RoutedEvent 
		PreviewInputReportEvent:
        {
        	get:function(){
        		if(InputManager._PreviewInputReportEvent === undefined){
        			InputManager._PreviewInputReportEvent = GlobalEventManager.RegisterRoutedEvent("PreviewInputReport", 
        					RoutingStrategy.Tunnel, InputReportEventHandler.Type, InputManager.Type);
        		}
        		
        		return InputManager._PreviewInputReportEvent;
        	}
        }, 
		

        /// <summary>
        ///     A routed event indicating that an input report arrived. 
        /// </summary>
//        internal static readonly RoutedEvent 
		InputReportEvent:
        {
        	get:function(){
        		if(InputManager._InputReportEvent === undefined){
        			InputManager._InputReportEvent = GlobalEventManager.RegisterRoutedEvent("InputReport", 
        					RoutingStrategy.Bubble, InputReportEventHandler.Type, InputManager.Type);
        		}
        		
        		return InputManager._InputReportEvent;
        	}
        }, 
		 
 
        ///<summary> 
        ///     Internal implementation of InputManager.Current.
        ///     Critical but not TAS - for internal's to use. 
        ///     Only exists for perf. The link demand check was causing perf in some XAF scenarios. 
        ///</summary>
        /// <SecurityNote> 
        ///     Critical: This class is not ok to expose since SEE apps
        ///               should not have to deal with this directly and
        ///               it exposes methods that can be use for input spoofing
        /// 
        /// </SecurityNote>
//        internal static InputManager 
		UnsecureCurrent: 
        { 
            get:function()
            {
                return GetCurrentInputManagerImpl();
            } 
        },
 
        ///<summary> 
        /// When true indicates input processing is synchronized.
        ///</summary> 
//        internal static bool 
		IsSynchronizedInput:
        {
            get:function()
            { 
                return _isSynchronizedInput;
            } 
        }, 

        ///<summary> 
        /// Synchronized input event type.
        ///</summary>
//        internal static RoutedEvent[] 
        SynchronizedInputEvents:
        { 
            get:function()
            { 
                return _synchronizedInputEvents; 
            }
        }, 

        ///<summary>
        /// Complementary pair of Synchronized input events.
        ///</summary> 
//        internal static RoutedEvent[] 
        PairedSynchronizedInputEvents:
        { 
            get:function() 
            {
                return _pairedSynchronizedInputEvents; 
            }
        },

        ///<summary> 
        /// Synchronized input type, set by the client.
        ///</summary> 
//        internal static SynchronizedInputType 
        SynchronizeInputType: 
        {
            get:function() 
            {
                return _synchronizedInputType;
            }
        },

        ///<summary> 
        /// Element on which StartListening was called. 
        ///</summary>
//        internal static DependencyObject 
        ListeningElement: 
        {
            get:function()
            {
                return _listeningElement; 
            }
        }, 
 
        ///<summary>
        /// Indicates state of the event during synchronized processing. 
        ///</summary>
//        internal static SynchronizedInputStates 
        SynchronizedInputState:
        {
            get:function() { return _synchronizedInputState; }, 
            set:function(value) { _synchronizedInputState = value; }
        } 
	});
	
	var _INSTANCE = null;
	
    ///<summary>
    ///     Implementation of InputManager.Current 
    ///</summary>
    /// <SecurityNote>
    ///     Critical: This class is not ok to expose since SEE apps
    ///               should not have to deal with this directly and 
    ///               it exposes methods that can be use for input spoofing
    /// </SecurityNote> 
//    private static InputManager 
	function GetCurrentInputManagerImpl()
    { 
//        var inputManager = null;
//        var dispatcher = Dispatcher.CurrentDispatcher;
//        inputManager = dispatcher.InputManager instanceof InputManager ? dispatcher.InputManager : null; 

        if (_INSTANCE == null) 
        { 
        	_INSTANCE = new InputManager();
        }

        return _INSTANCE;
    } 
    ///<SecurityNote> 
    ///     Critical - calls UnsecureCurrent
    ///     TreatAsSafe - notifying the input manager that hit test information needs to be recalced.
    ///                   is considered safe ( and currently this code is transparent).
    ///</SecurityNote> 
//    internal static void 
	InputManager.SafeCurrentNotifyHitTestInvalidated = function() 
    { 
		InputManager.UnsecureCurrent.NotifyHitTestInvalidated();
    }; 

    // When called, InputManager will get into synchronized input processing mode.
//    internal static bool 
    InputManager.StartListeningSynchronizedInput = function(/*DependencyObject*/ d, /*SynchronizedInputType*/ inputType)
    { 
        if (_isSynchronizedInput) 
        {
            return false; 
        }
        else
        {
            _isSynchronizedInput = true; 
            _synchronizedInputState = SynchronizedInputStates.NoOpportunity;
            _listeningElement = d; 
            _synchronizedInputType = inputType; 
            _synchronizedInputEvents = SynchronizedInputHelper.MapInputTypeToRoutedEvents(inputType);
            _pairedSynchronizedInputEvents = SynchronizedInputHelper.MapInputTypeToRoutedEvents(SynchronizedInputHelper.GetPairedInputType(inputType)); 
            return true;
        }
    }; 

    // This method is used to cancel synchronized input processing. 
//    internal static void 
    InputManager.CancelSynchronizedInput = function() 
    {
        _isSynchronizedInput = false;
        _synchronizedInputState = SynchronizedInputStates.NoOpportunity;
        _listeningElement = null; 
        _synchronizedInputEvents = null;
        _pairedSynchronizedInputEvents = null; 

        if (_synchronizedInputAsyncClearOperation != null)
        { 
            _synchronizedInputAsyncClearOperation.Abort();
            _synchronizedInputAsyncClearOperation = null;
        }
    };
     
	
	InputManager.Type = new Type("InputManager", InputManager, [DispatcherObject.Type]);
	return InputManager;
});
