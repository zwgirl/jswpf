/**
 * Thumb
 */
/// <summary> 
///     The thumb control enables basic drag-movement functionality for scrollbars and window resizing widgets.
/// </summary> 
/// <remarks> 
///     The thumb can receive mouse focus but it cannot receive keyboard focus.
/// As well, there is no threshhold at which the control stops firing its DragDeltaEvent. 
/// Once in mouse capture, the DragDeltaEvent fires until the mouse button is released.
/// </remarks>
define(["dojo/_base/declare", "system/Type", "controls/Control", "windows/EventManager",
        "windows/RoutingStrategy", "input/MouseButtonState", "windows/FrameworkPropertyMetadata",
        "windows/UIElement", "primitives/DragCompletedEventHandler", "primitives/DragCompletedEventArgs",
        "input/Mouse", "windows/PropertyChangedCallback", "input/MouseEventHandler", "windows/UIPropertyMetadata"], 
		function(declare, Type, Control, EventManager,
				RoutingStrategy, MouseButtonState, FrameworkPropertyMetadata,
				UIElement, DragCompletedEventHandler, DragCompletedEventArgs,
				Mouse, PropertyChangedCallback, MouseEventHandler, UIPropertyMetadata){
	
//    private static DependencyObjectType 
	var _dType = null; 
    
	var Thumb = declare("Thumb", Control,{
		constructor:function(){
	        /// <summary>
	        /// The point where the mouse was clicked down (Thumb's co-ordinate). 
	        /// </summary> 
//	        private Point 
			this._originThumbPoint = null; //
	 
	        /// <summary>
	        /// The position of the mouse (screen co-ordinate) where the mouse was clicked down.
	        /// </summary>
//	        private Point 
			this._originScreenCoordPosition = null; 

	        /// <summary> 
	        /// The position of the mouse (screen co-ordinate) when the previous DragDelta event was fired 
	        /// </summary>
//	        private Point 
			this._previousScreenCoordPosition = null; 
		},
		
		/// <summary>
        ///     This method cancels the dragging operation. 
        /// </summary> 
//        public void 
		CancelDrag:function()
        { 
            if (this.IsDragging)
            {
                if (this.IsMouseCaptured)
                { 
                	this.ReleaseMouseCapture();
                } 
                this.ClearValue(Thumb.IsDraggingPropertyKey); 
                this.RaiseEvent(new DragCompletedEventArgs(this._previousScreenCoordPosition.X - this._originScreenCoordPosition.X, 
                		this._previousScreenCoordPosition.Y - this._originScreenCoordPosition.Y, true));
            } 
        },
        /// <summary>
        ///     This method is invoked when the IsDragging property changes. 
        /// </summary>
        /// <param name="e">DependencyPropertyChangedEventArgs for IsDragging property.</param>
//        protected virtual void 
        OnDraggingChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        },

        /// <summary>
        ///     Change to the correct visual state for the ButtonBase.
        /// </summary> 
        /// <param name="useTransitions">
        ///     true to use transitions when updating the visual state, false to 
        ///     snap directly to the new visual state. 
        /// </param>
//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions) 
        {
            // See ButtonBase.ChangeVisualState.
            // This method should be exactly like it, except we use IsDragging instead of IsPressed for the pressed state
            if (!this.IsEnabled) 
            {
                VisualStateManager.GoToState(this, VisualStates.StateDisabled, useTransitions); 
            } 
            else if (this.IsDragging)
            { 
                VisualStateManager.GoToState(this, VisualStates.StatePressed, useTransitions);
            }
            else if (this.IsMouseOver)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions);
            } 
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions); 
            }

            if (this.IsKeyboardFocused)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateFocused, useTransitions);
            } 
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions); 
            }

            Control.prototype.ChangeVisualState.call(this, useTransitions);
        }, 
 
        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event. 
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) 
        {
            if (!this.IsDragging)
            {
                e.Handled = true; 
                this.Focus();
                this.CaptureMouse(); 
                this.SetValue(IsDraggingPropertyKey, true); 
                this._originThumbPoint = e.GetPosition(this);
                this._previousScreenCoordPosition = this._originScreenCoordPosition = SafeSecurityHelper.ClientToScreen(this, this._originThumbPoint); 
                var exceptionThrown = true;
                try
                {
                	this.RaiseEvent(new DragStartedEventArgs(this._originThumbPoint.X, this._originThumbPoint.Y)); 
                    exceptionThrown = false;
                } 
                finally 
                {
                    if (exceptionThrown) 
                    {
                    	this.CancelDrag();
                    }
                } 
            }
            else 
            { 
                // This is weird, Thumb shouldn't get MouseLeftButtonDown event while dragging.
                // This may be the case that something ate MouseLeftButtonUp event, so Thumb never had a chance to 
                // reset IsDragging property
//                Debug.Assert(false,"Got MouseLeftButtonDown event while dragging!");
            }
            Control.prototype.OnMouseLeftButtonDown.call(this, e); 
        },
 
 
        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event. 
        /// </summary>
        /// <param name="e"></param>
//        protected override void
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e)
        { 
            if (this.IsMouseCaptured && IsDragging)
            { 
                e.Handled = true; 
                this.ClearValue(IsDraggingPropertyKey);
                this.ReleaseMouseCapture(); 
                var pt = SafeSecurityHelper.ClientToScreen(this, e.MouseDevice.GetPosition(this));
                this.RaiseEvent(new DragCompletedEventArgs(pt.X - this._originScreenCoordPosition.X, pt.Y - this._originScreenCoordPosition.Y, false));
            }
            Control.prototype.OnMouseLeftButtonUp.call(this, e); 
        },
        
      /// <summary> 
        /// This is the method that responds to the MouseEvent event.
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnMouseMove:function(/*MouseEventArgs*/ e) 
        {
        	Control.prototype.OnMouseMove.call(this, e); 
 
            if (this.IsDragging)
            { 
                if (e.MouseDevice.LeftButton == MouseButtonState.Pressed)
                {
                    var thumbCoordPosition = e.GetPosition(this);
                    // Get client point then convert to screen point 
                    var screenCoordPosition = SafeSecurityHelper.ClientToScreen(this, thumbCoordPosition);
 
                    // We will fire DragDelta event only when the mouse is really moved 
                    if (screenCoordPosition != _previousScreenCoordPosition)
                    { 
                    	this._previousScreenCoordPosition = screenCoordPosition;
                        e.Handled = true;
                        this.RaiseEvent(new DragDeltaEventArgs(thumbCoordPosition.X - _originThumbPoint.X,
                                                          thumbCoordPosition.Y - _originThumbPoint.Y)); 
                    }
                } 
                else 
                {
                    if (e.MouseDevice.Captured == this) 
                    	this.ReleaseMouseCapture();
                    this.ClearValue(IsDraggingPropertyKey);
                    this._originThumbPoint.X = 0;
                    this._originThumbPoint.Y = 0; 
                }
            } 
        },
        
		/// <summary> 
        /// Add / Remove DragStartedEvent handler
        /// </summary> 
//        public event DragStartedEventHandler 
//		DragStarted { }
        
        AddDragStarted:function(value) { this.AddHandler(Thumb.DragStartedEvent, value); },
        RemoveDragStarted:function(value) { this.RemoveHandler(Thumb.DragStartedEvent, value); },

        /// <summary> 
        /// Add / Remove DragDeltaEvent handler
        /// </summary> 
//        public event DragDeltaEventHandler 
//		DragDelta { add { AddHandler(DragDeltaEvent, value); } remove { RemoveHandler(DragDeltaEvent, value); } }
        AddDragDelta:function(value) { this.AddHandler(Thumb.DragDeltaEvent, value); }, 
        RemoveDragDelta:function(value) { this.RemoveHandler(Thumb.DragDeltaEvent, value); },
 
        /// <summary>
        /// Add / Remove DragCompletedEvent handler
        /// </summary>
//        public event DragCompletedEventHandler 
//		DragCompleted { add { AddHandler(DragCompletedEvent, value); } remove { RemoveHandler(DragCompletedEvent, value); } }
        AddDragCompleted:function(value) { this.AddHandler(Thumb.DragCompletedEvent, value); }, 
        RemoveDragCompleted:function(value) { this.RemoveHandler(Thumb.DragCompletedEvent, value); }
	});
	
	Object.defineProperties(Thumb.prototype,{
   
        /// <summary> 
        ///     IsDragging indicates that left mouse button is pressed over the thumb. 
        /// </summary>
//        public bool 
		IsDragging:
        {
            get:function() { return this.GetValue(Thumb.IsDraggingProperty); },
            /*protected*/ set:function(value) { this.SetValue(Thumb.IsDraggingPropertyKey, value); } 
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return _dType; }
        }
	});
	
	Object.defineProperties(Thumb,{
		/// <summary>
        ///     Event fires when user press mouse's left button on the thumb.
        /// </summary>
//        public static readonly RoutedEvent 
		DragStartedEvent:
        {
        	get:function(){
        		if(Thumb._DragStartedEvent === undefined){
        			Thumb._DragStartedEvent = EventManager.RegisterRoutedEvent("DragStarted", 
        					RoutingStrategy.Bubble, DragStartedEventHandler.Type, Thumb.Type);
        		}
        		
        		return Thumb._DragStartedEvent;
        	}
        },  

        /// <summary> 
        ///     Event fires when the thumb is in a mouse capture state and the user moves the mouse around. 
        /// </summary>
//        public static readonly RoutedEvent 
		DragDeltaEvent:
        {
        	get:function(){
        		if(Thumb._DragDeltaEvent === undefined){
        			Thumb._DragDeltaEvent = EventManager.RegisterRoutedEvent("DragDelta", 
        					RoutingStrategy.Bubble, DragDeltaEventHandler.Type, Thumb.Type);
        		}
        		
        		return Thumb._DragDeltaEvent;
        	}
        },  

        /// <summary>
        ///     Event fires when user released mouse's left button or when CancelDrag method is called.
        /// </summary> 
//        public static readonly RoutedEvent 
		DragCompletedEvent:
        {
        	get:function(){
        		if(Thumb._DragCompletedEvent === undefined){
        			Thumb._DragCompletedEvent  = EventManager.RegisterRoutedEvent("DragCompleted",
        					RoutingStrategy.Bubble, DragCompletedEventHandler.Type, Thumb.Type);
        		}
        		
        		return Thumb._DragCompletedEvent;
        	}
        },
//        private static readonly DependencyPropertyKey 
		IsDraggingPropertyKey:
        {
        	get:function(){
        		if(Thumb._IsDraggingPropertyKey === undefined){
        			Thumb._IsDraggingPropertyKey =
        	            DependencyProperty.RegisterReadOnly( 
        	                    "IsDragging",
        	                    Boolean.Type,
        	                    Thumb.Type,
        	                    /*new FrameworkPropertyMetadata( 
        	                            false,
        	                            new PropertyChangedCallback(null, OnIsDraggingPropertyChanged))*/
        	                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
        	                            false,
        	                            new PropertyChangedCallback(null, OnIsDraggingPropertyChanged)));  
        		}
        		
        		return Thumb._IsDraggingPropertyKey;
        	}
        }, 

    /// <summary>
    ///     DependencyProperty for the IsDragging property. 
    ///     Flags:              None
    ///     Default Value:      false
    /// </summary>
//    public static readonly DependencyProperty 
        IsDraggingProperty:
        {
    		get:function(){
            	return Thumb.IsDraggingPropertyKey.DependencyProperty; 
    		}
        }
	});
	
    /// <summary> 
    ///     Called when IsDraggingProperty is changed on "d."
    /// </summary>
    /// <param name="d">The object on which the property was changed.</param>
    /// <param name="e">EventArgs that contains the old and new values for this property</param> 
//    private static void 
	function OnIsDraggingPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        var thumb = (Thumb)d; 
        d.OnDraggingChanged(e);
        d.UpdateVisualState(); 
    }
    
 // Cancel Drag if we lost capture 
//    private static void 
	function OnLostMouseCapture(/*object*/ sender, /*MouseEventArgs*/ e)
    { 
//        Thumb thumb = (Thumb)sender;

        if (Mouse.Captured != sender)
        { 
        	sender.CancelDrag();
        } 
    } 
	
//	static Thumb()
	function Initialize()
    {
        // Register metadata for dependency properties 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Thumb.Type, /*new FrameworkPropertyMetadata(Thumb.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Thumb.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(Thumb.Type); 
        UIElement.FocusableProperty.OverrideMetadata(Thumb.Type, 
        		/*new FrameworkPropertyMetadata(false)*/FrameworkPropertyMetadata.BuildWithDV(false)); 

        EventManager.RegisterClassHandler(Thumb.Type, Mouse.LostMouseCaptureEvent, new MouseEventHandler(null, OnLostMouseCapture)); 

        UIElement.IsEnabledProperty.OverrideMetadata(Thumb.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
        UIElement.IsMouseOverPropertyKey.OverrideMetadata(Thumb.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
    }
	
	Thumb.Type = new Type("Thumb", Thumb, [Control.Type]);
	Initialize();
	
	return Thumb;
});
