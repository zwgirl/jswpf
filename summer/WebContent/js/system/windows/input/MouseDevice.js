/**
 * MouseDevice
 */

define(["dojo/_base/declare", "system/Type", "input/InputDevice", "internal/DeferredElementTreeState", 
        "windows/DependencyObject", "input/CaptureMode", "windows/Point"], 
		function(declare, Type, InputDevice, DeferredElementTreeState, 
				DependencyObject, CaptureMode, Point){
	var UIElement = null;
	function EnsureUIElement(){
		if(UIElement == null){
			UIElement = using("windows/UIElement");
		}
		
		return UIElement;
	}
	
	var ContentElement = null;
	function EnsureContentElement(){
		if(ContentElement == null){
			ContentElement = using("windows/ContentElement");
		}
		
		return ContentElement;
	}
	var MouseDevice = declare("MouseDevice", InputDevice,{
		constructor:function(/*InputManager*/ inputManager){
//			private IInputElement 
			this._mouseOver = null; 
//	        private DeferredElementTreeState 
	        this._mouseOverTreeState = null;
	        this._inputManager = inputManager; 
			 
//           _inputManager.Value.PreProcessInput += new PreProcessInputEventHandler(PreProcessInput);
//           _inputManager.Value.PreNotifyInput += new NotifyInputEventHandler(PreNotifyInput); 
//           _inputManager.Value.PostProcessInput += new ProcessInputEventHandler(PostProcessInput);
//
//           // Get information about how far two clicks of a double click can be considered
//           // to be in the "same place and time". 
//           //
//           // The call here goes into the safe helper calls, more of a consistency in approach 
//           // 
//           _doubleClickDeltaX = SafeSystemMetrics.DoubleClickDeltaX;
//           _doubleClickDeltaY = SafeSystemMetrics.DoubleClickDeltaY; 
//           _doubleClickDeltaTime = SafeNativeMethods.GetDoubleClickTime();
//
//           _overIsEnabledChangedEventHandler = new DependencyPropertyChangedEventHandler(OnOverIsEnabledChanged);
//           _overIsVisibleChangedEventHandler = new DependencyPropertyChangedEventHandler(OnOverIsVisibleChanged); 
//           _overIsHitTestVisibleChangedEventHandler  = new DependencyPropertyChangedEventHandler(OnOverIsHitTestVisibleChanged);
//           _reevaluateMouseOverDelegate = new DispatcherOperationCallback(ReevaluateMouseOverAsync); 
//           _reevaluateMouseOverOperation = null; 
//
//           _captureIsEnabledChangedEventHandler = new DependencyPropertyChangedEventHandler(OnCaptureIsEnabledChanged); 
//           _captureIsVisibleChangedEventHandler = new DependencyPropertyChangedEventHandler(OnCaptureIsVisibleChanged);
//           _captureIsHitTestVisibleChangedEventHandler  = new DependencyPropertyChangedEventHandler(OnCaptureIsHitTestVisibleChanged);
//           _reevaluateCaptureDelegate = new DispatcherOperationCallback(ReevaluateCaptureAsync);
//           _reevaluateCaptureOperation = null; 
//
//           _inputManager.Value.HitTestInvalidatedAsync += new EventHandler(OnHitTestInvalidatedAsync); 
		},
		
	     /// <summary> 
        ///     Gets the current state of the specified button from the device from either the underlying system or the StylusDevice
        /// </summary>
        /// <param name="mouseButton">
        ///     The mouse button to get the state of 
        /// </param>
        /// <returns> 
        ///     The state of the specified mouse button 
        /// </returns>
//        protected MouseButtonState 
		GetButtonState:function(/*MouseButton*/ mouseButton) 
        {
            return this.GetButtonStateFromSystem(mouseButton);
        },
 
        /// <summary>
        ///     Gets the current position of the mouse in screen co-ords from either the underlying system or the StylusDevice 
        /// </summary>
        /// <returns>
        ///     The current mouse location in screen co-ords
        /// </returns> 
//        protected Point 
        GetScreenPosition:function()
        { 
            return this.GetScreenPositionFromSystem();
        },

        /// <summary> 
        ///     Gets the current state of the specified button from the device from the underlying system
        /// </summary> 
        /// <param name="mouseButton"> 
        ///     The mouse button to get the state of
        /// </param> 
        /// <returns>
        ///     The state of the specified mouse button
        /// </returns>
//        internal abstract MouseButtonState 
        GetButtonStateFromSystem:function(/*MouseButton*/ mouseButton){
        	switch(mouseButton){
        	case MouseButton.Left:{
        		return this._domEvent.button == 0;
        	}
        	case MouseButton.Middle: {
        		return this._domEvent.button == 1;
        	}
        	case MouseButton.Right: {
        		return this._domEvent.button == 2;
        	}
        	case MouseButton.XButton1: {
        		
        	}
        	case MouseButton.XButton2: {
        		
        	}
        	}
        }, 

        /// <summary> 
        ///     Gets the current position of the mouse in screen co-ords from the underlying system 
        /// </summary>
        /// <returns> 
        ///     The current mouse location in screen co-ords
        /// </returns>
        /// <SecurityNote>
        ///     Critical: accesses critical data (CriticalActiveSource) 
        ///     TreatAsSafe: doesn't expose critical data, just returns screen coordinates of non-critical data
        /// </SecurityNote> 
//        internal Point 
        GetScreenPositionFromSystem:function()
        { 
            return new Point(this._domEvent.screenX, this._domEvent.screenY); 
        }, 

        /// <summary> 
        ///     Gets the current position of the mouse in client co-ords of the current PresentationSource
        /// </summary>
        /// <returns>
        ///     The current mouse position in client co-ords 
        /// </returns>
        /// <SecurityNote> 
        ///     Critical: Accesses SecurityCritical data CriticalActiveSource 
        ///     TreatAsSafe: Only uses it to pass to through to overloaded version of this method which
        ///                  in turn only uses it to pass to PointUtil.ScreenToClient to convert mouse 
        ///                  position from screen to client co-ords
        /// </SecurityNote>
//        protected Point 
        GetClientPosition:function() 
        {
        	return new Point(this._domEvent.clientX, this._domEvent.clientY); 
        }, 
        
        /// <summary> 
        ///     Captures the mouse to a particular element.
        /// </summary> 
//        public bool 
//        Capture:function(/*IInputElement*/ element)
//        {
//            return Capture(element, CaptureMode.Element);
//        },

        /// <summary> 
        ///     Captures the mouse to a particular element. 
        /// </summary>
        /// <SecurityNote> 
        ///     Critical: This element acceses PresentationSource , MouseInputProvider (critical data)
        ///     PublicOK: This operation is inherently safe and does not store or expose the critical data
        /// </SecurityNote>
//        public bool 
        Capture:function(/*IInputElement*/ element, /*CaptureMode*/ captureMode)
        { 
        	if(captureMode === undefined){
        		captureMode = CaptureMode.Element;
        	}
//            var timeStamp = Environment.TickCount; 
//             VerifyAccess();
 
            if (!(captureMode == CaptureMode.None || captureMode == CaptureMode.Element || captureMode == CaptureMode.SubTree))
            {
                throw new System.ComponentModel.InvalidEnumArgumentException("captureMode", captureMode, typeof(CaptureMode));
            } 

            if (element == null) 
            { 
                captureMode = CaptureMode.None;
            } 

            if (captureMode == CaptureMode.None)
            {
                element = null; 
            }
 
            // Validate that elt is either a UIElement or a ContentElement 
            /*DependencyObject*/var eltDO = element instanceof DependencyObject ? element : null;
            if (eltDO != null && !InputElement.IsValid(element)) 
            {
                throw new InvalidOperationException(SR.Get(SRID.Invalid_IInputElement, eltDO.GetType()));
            }
 
            var success = false;
 
            // The element we are capturing to must be both enabled and visible. 
            if (element instanceof EnsureUIElement())
            { 
                var e = element instanceof EnsureUIElement() ? element : null;

                if(e.IsVisible && e.IsEnabled) 
                {
                    success = true; 
                } 
            }
            else if (element instanceof EnsureContentElement()) 
            {
                var ce = element instanceof EnsureContentElement() ? element : null;

                if(ce.IsEnabled) // There is no IsVisible property for ContentElement
                { 
                    success = true; 
                }
            } 
            else
            {
                // Setting capture to null. 
                success = true;
            } 
 
//            if(success)
//            { 
//                success = false;
//
//                // Find a mouse input provider that provides input for either
//                // the new element (if taking capture) or the existing capture 
//                // element (if releasing capture).
//                IMouseInputProvider mouseInputProvider = null; 
//                if (element != null) 
//                {
//                    DependencyObject containingVisual = InputElement.GetContainingVisual(eltDO); 
//                    if (containingVisual != null)
//                    {
//                        PresentationSource captureSource = PresentationSource.CriticalFromVisual(containingVisual);
//                        if (captureSource != null) 
//                        {
//                            mouseInputProvider = captureSource.GetInputProvider(typeof(MouseDevice)) as IMouseInputProvider; 
//                        } 
//                    }
//                } 
//                else if (_mouseCapture != null)
//                {
//                    mouseInputProvider = _providerCapture.Value;
//                } 
//
//                // If we found a mouse input provider, ask it to either capture 
//                // or release the mouse for us. 
//                if(mouseInputProvider != null)
//                { 
//                    if (element != null)
//                    {
//                        success = mouseInputProvider.CaptureMouse();
// 
//                        if (success)
//                        { 
//                            ChangeMouseCapture(element, mouseInputProvider, captureMode, timeStamp); 
//                        }
//                    } 
//                    else
//                    {
//                        mouseInputProvider.ReleaseMouseCapture();
// 
//                        // If we had capture, the input provider will release it.  That will
//                        // cause a RawMouseAction.CancelCapture to be processed, which will 
//                        // update our internal states. 
//                        success = true;
//                    } 
//                }
//            }

            return success; 
        },
 
   
        
        /// <summary> 
        /// Set the cursor
        /// </summary> 
        /// <param ref="cursor">The new cursor</param>
        /// <remarks>Note that this cursor doesn't apply any particular UIElement, it applies
        ///          to the whole desktop.
        /// </remarks> 
        /// <SecurityNote>
        ///     Critical: Cause an elevation to unmanaged Code permission, also accesses critical data MouseInputProvider 
        ///     PublicOK: Calling SetCursor is a safe operation since it only affects current app.Also it does not 
        ///     expose critical data (IMouseInputProvider)
        /// </SecurityNote> 
//        public bool 
        SetCursor:function(/*Cursor*/ cursor)
        {
            // Override the cursor if one is set. 
            if (this._overrideCursor != null) 
            {
                cursor = this._overrideCursor; 
            }

            if (cursor == null)
            { 
                cursor = Cursors.None;
            } 
 
        },
        
//        private bool 
        ValidateUIElementForCapture:function(/*UIElement*/ element)
        { 
            if (element.IsEnabled == false)
                return false; 
 
            if (element.IsVisible == false)
                return false; 

            if (element.IsHitTestVisible == false)
                return false;
 
            return true;
        }, 

 
//        private bool 
        ValidateContentElementForCapture:function(/*ContentElement*/ element)
        { 
            if (element.IsEnabled == false) 
                return false;
 
            // NOTE: there are no IsVisible or IsHitTestVisible properties for ContentElements.

            return true;
        }, 

 
        /// <summary> 
        ///     Forces the mouse cursor to be updated.
        /// </summary> 
//        public void 
        UpdateCursor:function()
        {
            // Call Forwarded
//            UpdateCursorPrivate(); 
        },
        
        /// <summary> 
        /// </summary>
        /// <param name="arg"></param> 
        /// <returns></returns> 
//        private Object 
        ReevaluateMouseOverAsync:function(/*Object*/ arg)
        { 
            // Refresh MouseOverProperty so that ReverseInherited Flags are updated.
            // 
            // We only need to do this is there is any information about the old 
            // tree state.  This is because it is possible (even likely) that
            // Synchronize() would have already done this if we hit-tested to a 
            // different element.
            if (this._mouseOverTreeState != null && !this._mouseOverTreeState.IsEmpty)
            {
            	EnsureUIElement().MouseOverProperty.OnOriginValueChanged(this._mouseOver, this._mouseOver, /*ref _mouseOverTreeState*/mouseOverTreeStateRef); 
            }
 
            return null; 
        },
        
        /// <summary> 
        /// </summary>
//        /*internal*/ public void 
        ReevaluateMouseOver:function(/*DependencyObject*/ element, /*DependencyObject*/ oldParent, /*boolean*/ isCoreParent) 
        { 
            if (element != null)
            { 
                if (isCoreParent)
                {
                    this.MouseOverTreeState.SetCoreParent(element, oldParent);
                } 
                else
                { 
                	this.MouseOverTreeState.SetLogicalParent(element, oldParent); 
                }
            } 
        },
        
        /// <SecurityNote>
        ///     Critical: This code accesses link demanded method PresentationSource.AddSourcechangedhandler 
        ///     and remove for the same
        ///     TreatAsSafe: This code does not expose the PresentationSource and simply changes the mouse over element 
        /// </SecurityNote> 
//        [SecurityCritical,SecurityTreatAsSafe]
//        private void 
        ChangeMouseOver:function(/*IInputElement*/ mouseOver, /*int*/ timestamp) 
        {
            /*DependencyObject*/var o = null;

            if (this._mouseOver != mouseOver) 
            {
                // Console.WriteLine("ChangeMouseOver(" + mouseOver + ")"); 
 
                // Update the critical piece of data.
                /*IInputElement*/var oldMouseOver = this._mouseOver; 
                this._mouseOver = mouseOver;

                // Oddly enough, update the IsMouseOver property first.  This is 
                // so any callbacks will see the more-common IsMouseOver property
                // set correctly. 
                var mouseOverTreeStateRef = {
                	"oldTreeState" : this._mouseOverTreeState
                };
                
                EnsureUIElement().MouseOverProperty.OnOriginValueChanged(oldMouseOver, this._mouseOver, /*ref _mouseOverTreeState*/mouseOverTreeStateRef); 
                this._mouseOverTreeState = mouseOverTreeStateRef.oldTreeState; 
                // Invalidate the IsMouseDirectlyOver property. 
                if (oldMouseOver != null)
                {
                    o = oldMouseOver instanceof DependencyObject ? oldMouseOver : null;
                    o.SetValue(EnsureUIElement().IsMouseDirectlyOverPropertyKey, false); // Same property for ContentElements 
                }
                if (this._mouseOver != null) 
                { 
                    o = this._mouseOver instanceof DependencyObject ? this._mouseOver : null;
                    o.SetValue(EnsureUIElement().IsMouseDirectlyOverPropertyKey, true); // Same property for ContentElements 
                }
                
                
            }
        },

        OnMouseOver:function(event){
//			alert("MouseEnterEvent");
			var mouseEventArgs = new MouseEventArgs(event);
			mouseEventArgs.RoutedEvent = Mouse.MouseEnterEvent;
			
			if(InputManager.Current.PrimaryMouseDevice.DirectlyOver === this._source){
				return;
			}
			
			InputManager.Current.PrimaryMouseDevice.ChangeMouseOver(this._source, event.timeStamp);
//			
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
        },
        
        OnMouseOut:function(event){
//			alert("MouseEnterEvent");
			var mouseEventArgs = new MouseEventArgs(event);
			mouseEventArgs.RoutedEvent = Mouse.MouseLeaveEvent;
			
			if(input._mouseOver === this._source){
				return;
			}
			
//			InputManager.Current.PrimaryMouseDevice.ChangeMouseOver(this._source, event.timeStamp);
//			
			mouseEventArgs.Source = this._source;
			this._source.RaiseEvent(mouseEventArgs);
        },
        
      /// <summary>
        ///     Calculates the position of the mouse relative to
        ///     a particular element.
        /// </summary> 
        ///<SecurityNote>
        ///     Critical - accesses critical data _inputSource.Value 
        ///     PublicOK - we do the elevation of _inputSource to get RootVisual. 
        ///</SecurityNote>
//        [SecurityCritical  ] 
//        public Point 
        GetPosition:function(/*IInputElement*/ relativeTo)
        {
            return new Point(0, 0); 
        }
        
	});
	
	Object.defineProperties(MouseDevice.prototype,{
	      /// <summary>
        ///     Returns the element that input from this device is sent to.
        /// </summary> 
//        public override IInputElement 
		Target:
        { 
            get:function()
            {
//                 VerifyAccess(); 

                // Return the element that the mouse is over.  If the mouse
                // has been captured, the mouse will be considered "over"
                // the capture point if the mouse is outside of the 
                // captured element (or subtree).
                return this._mouseOver; 
            } 
        },
 
        /// <summary>
        ///     Returns the PresentationSource that is reporting input for this device.
        /// </summary>
        /// <remarks> 
        ///     Callers must have UIPermission(UIPermissionWindow.AllWindows) to call this API.
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
                if (this._inputSource != null) 
                {
                    return this._inputSource.Value;
                }
                return null; 
            }
        },
 
        /// <summary>
        ///     Returns the PresentationSource that is reporting input for this device. 
        /// </summary>
        /// <SecurityNote>
        ///     Critical - accesses critical data (_inputSource) and returns it.
        /// </SecurityNote> 
//        internal PresentationSource 
        CriticalActiveSource:
        { 
            get:function()
            { 
                if (this._inputSource != null)
                {
                    return this._inputSource.Value;
                } 
                return null;
            } 
        }, 

        /// <summary> 
        ///     Returns the element that the mouse is over.
        /// </summary>
        /// <remarks>
        ///     The mouse is considered directly over an element if the mouse 
        ///     has been captured to that element.
        /// </remarks> 
//        public IInputElement 
        DirectlyOver: 
        {
            get:function() 
            {
                return this._mouseOver;
            } 
        },
 
        /// <summary> 
        ///     Returns the element that the mouse is over regardless of
        ///     its IsEnabled state. 
        /// </summary>
//        internal IInputElement 
        RawDirectlyOver:
        { 
            get:function()
            { 
                if (this._rawMouseOver != null) 
                {
                    /*IInputElement*/var rawMouseOver = this._rawMouseOver.Target; 
                    if (rawMouseOver != null)
                    {
                        return rawMouseOver;
                    } 
                }
 
                return this.DirectlyOver; 
            }
        }, 

        /// <summary>
        ///     Returns the element that has captured the mouse.
        /// </summary> 
//        public IInputElement 
        Captured:
        { 
            get:function() 
            {
//                 VerifyAccess(); 
                return this._mouseCapture;
            }
        },
 
        /// <summary>
        ///     Returns the element that has captured the mouse. 
        /// </summary> 
//        internal CaptureMode 
        CapturedMode:
        { 
            get:function()
            {
                return this._captureMode;
            } 
        },
        
        /// <summary> 
        /// The override cursor
        /// </summary> 
//        public Cursor 
        OverrideCursor: 
        {
            get:function() 
            {
                return this._overrideCursor; 
            },
 
            set:function(value) 
            {
            	this._overrideCursor = value;
            	this.UpdateCursorPrivate();
            } 
        },
        
        /// <summary> 
        ///     The state of the left button.
        /// </summary>
//        public MouseButtonState 
        LeftButton:
        { 
            get:function()
            { 
                return this.GetButtonState(MouseButton.Left); 
            }
        }, 

        /// <summary>
        ///     The state of the right button.
        /// </summary> 
//        public MouseButtonState 
        RightButton:
        { 
            get:function() 
            {
                return this.GetButtonState(MouseButton.Right); 
            }
        },

        /// <summary> 
        ///     The state of the middle button.
        /// </summary> 
//        public MouseButtonState 
        MiddleButton: 
        {
            get:function() 
            {
                return this.GetButtonState(MouseButton.Middle);
            }
        }, 

        /// <summary> 
        ///     The state of the first extended button. 
        /// </summary>
//        public MouseButtonState 
        XButton1: 
        {
            get:function()
            {
                return this.GetButtonState(MouseButton.XButton1); 
            }
        }, 
 
        /// <summary>
        ///     The state of the second extended button. 
        /// </summary>
//        public MouseButtonState 
        XButton2:
        {
            get:function() 
            {
                return this.GetButtonState(MouseButton.XButton2); 
            } 
        },
//        internal Point 
        PositionRelativeToOver: 
        { 
            get:function()
            { 
                return this._positionRelativeToOver;
            }
        },
 
//        internal Point 
        NonRelativePosition:
        { 
            get:function() 
            {
                return this._lastPosition; 
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
                return this._inputSource != null && this._inputSource.Value != null; 
            }
        }, 

//        private DeferredElementTreeState 
        MouseOverTreeState: 
        {
            get:function() 
            { 
                if (this._mouseOverTreeState == null)
                { 
                	this._mouseOverTreeState = new DeferredElementTreeState();
                }

                return this._mouseOverTreeState; 
            }
        }, 
 
//        private DeferredElementTreeState 
        MouseCaptureWithinTreeState:
        { 
            get:function()
            {
                if (this._mouseCaptureWithinTreeState == null)
                { 
                	this._mouseCaptureWithinTreeState = new DeferredElementTreeState();
                } 
 
                return this._mouseCaptureWithinTreeState;
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
	
	Object.defineProperties(MouseDevice,{
		  
	});
	
	MouseDevice.Type = new Type("MouseDevice", MouseDevice, [InputDevice.Type]);
	return MouseDevice;
});
//    /// <summary>
//    ///     The MouseDevice class represents the mouse device to the
//    ///     members of a context.
//    /// </summary> 
//    public abstract class MouseDevice : InputDevice
//    { 
//        /// <SecurityNote> 
//        /// Critical - This is code that elevates AND creates the mouse device which
//        ///             happens to hold the callback to filter mouse messages 
//        /// TreatAsSafe: This constructor handles critical data but does not expose it
//        ///             It stores instance but there are demands on the instances.
//        /// </SecurityNote>
//       internal MouseDevice(InputManager inputManager)
//       { 
//            _inputManager = new SecurityCriticalData<InputManager>(inputManager); 
//            _inputManager.Value.PreProcessInput += new PreProcessInputEventHandler(PreProcessInput);
//            _inputManager.Value.PreNotifyInput += new NotifyInputEventHandler(PreNotifyInput); 
//            _inputManager.Value.PostProcessInput += new ProcessInputEventHandler(PostProcessInput);
//
//            // Get information about how far two clicks of a double click can be considered
//            // to be in the "same place and time". 
//            //
//            // The call here goes into the safe helper calls, more of a consistency in approach 
//            // 
//            _doubleClickDeltaX = SafeSystemMetrics.DoubleClickDeltaX;
//            _doubleClickDeltaY = SafeSystemMetrics.DoubleClickDeltaY; 
//            _doubleClickDeltaTime = SafeNativeMethods.GetDoubleClickTime();
//
//            _overIsEnabledChangedEventHandler = new DependencyPropertyChangedEventHandler(OnOverIsEnabledChanged);
//            _overIsVisibleChangedEventHandler = new DependencyPropertyChangedEventHandler(OnOverIsVisibleChanged); 
//            _overIsHitTestVisibleChangedEventHandler  = new DependencyPropertyChangedEventHandler(OnOverIsHitTestVisibleChanged);
//            _reevaluateMouseOverDelegate = new DispatcherOperationCallback(ReevaluateMouseOverAsync); 
//            _reevaluateMouseOverOperation = null; 
//
//            _captureIsEnabledChangedEventHandler = new DependencyPropertyChangedEventHandler(OnCaptureIsEnabledChanged); 
//            _captureIsVisibleChangedEventHandler = new DependencyPropertyChangedEventHandler(OnCaptureIsVisibleChanged);
//            _captureIsHitTestVisibleChangedEventHandler  = new DependencyPropertyChangedEventHandler(OnCaptureIsHitTestVisibleChanged);
//            _reevaluateCaptureDelegate = new DispatcherOperationCallback(ReevaluateCaptureAsync);
//            _reevaluateCaptureOperation = null; 
//
//            _inputManager.Value.HitTestInvalidatedAsync += new EventHandler(OnHitTestInvalidatedAsync); 
//        } 
//
//
//        /// <SecurityNote>
//        ///     This data is not safe to expose as it holds refrence to PresentationSource 
//        /// </SecurityNote>
//        private SecurityCriticalDataClass<PresentationSource> _inputSource; 
// 
//        /// <SecurityNote>
//        ///     This data is not safe to expose as it holds refrence to PresentationSource 
//        /// </SecurityNote>
//        private SecurityCriticalData<InputManager> _inputManager;
//
//        private IInputElement _mouseOver; 
//        private DeferredElementTreeState _mouseOverTreeState;
//        private bool _isPhysicallyOver; 
//        private WeakReference _rawMouseOver; 
//
//        private IInputElement _mouseCapture; 
//        private DeferredElementTreeState _mouseCaptureWithinTreeState;
//        private SecurityCriticalDataClass<IMouseInputProvider> _providerCapture;
//        private CaptureMode _captureMode;
// 
//        private DependencyPropertyChangedEventHandler _overIsEnabledChangedEventHandler;
//        private DependencyPropertyChangedEventHandler _overIsVisibleChangedEventHandler; 
//        private DependencyPropertyChangedEventHandler _overIsHitTestVisibleChangedEventHandler; 
//        private DispatcherOperationCallback _reevaluateMouseOverDelegate;
//        private DispatcherOperation _reevaluateMouseOverOperation; 
//
//        private DependencyPropertyChangedEventHandler _captureIsEnabledChangedEventHandler;
//        private DependencyPropertyChangedEventHandler _captureIsVisibleChangedEventHandler;
//        private DependencyPropertyChangedEventHandler _captureIsHitTestVisibleChangedEventHandler; 
//        private DispatcherOperationCallback _reevaluateCaptureDelegate;
//        private DispatcherOperation _reevaluateCaptureOperation; 
// 
//        // Device state we track
//        private Point _positionRelativeToOver = new Point(); 
//        private Point _lastPosition = new Point();
//        private bool _forceUpdateLastPosition = false;
//
//        // Data tags for information we pass around the staging area. 
//        private object _tagNonRedundantActions = new object();
//        private object _tagStylusDevice = new object(); 
//        private object _tagRootPoint = new object(); 
//
//        // Information used to distinguish double-clicks (actually, multi clicks) from 
//        // multiple independent clicks.
//        private Point _lastClick = new Point();
//        private MouseButton _lastButton;
//        private int _clickCount; 
//        private int _lastClickTime;
//        private int _doubleClickDeltaTime; 
//        private int _doubleClickDeltaX; 
//        private int _doubleClickDeltaY;
// 
//        private Cursor _overrideCursor;
//
//        // Reference to StylusDevice to defer to for physical mouse state (position/button state)
//        private StylusDevice _stylusDevice = null; 


