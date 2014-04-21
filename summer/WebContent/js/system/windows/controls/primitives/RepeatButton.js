/**
 * RepeatButton
 */
/// <summary>
///     RepeatButton control adds repeating semantics of when the Click event occurs 
/// </summary> 
define(["dojo/_base/declare", "system/Type", "primitives/ButtonBase", "threading/DispatcherTimer", "system/EventHandler",
        "system/TimeSpan", "controls/ClickMode"], 
		function(declare, Type, ButtonBase, DispatcherTimer, EventHandler,
				TimeSpan, ClickMode){
//    private static DependencyObjectType 
	var _dType = null;
	var RepeatButton = declare("RepeatButton", ButtonBase,{
		constructor:function(){
//	        private DispatcherTimer 
			this._timer = null;
		},
		
		/// <summary>
        /// Starts a _timer ticking 
        /// </summary> 
//        private void 
		StartTimer:function()
        { 
            if (this._timer == null)
            {
            	this._timer = new DispatcherTimer();
            	this._timer.Tick.Combine(new EventHandler(null, OnTimeout)); 
            }
            else if (this._timer.IsEnabled) 
                return; 

            this._timer.Interval = TimeSpan.FromMilliseconds(Delay); 
            this._timer.Start();
        },

        /// <summary> 
        /// Stops a _timer that has already started
        /// </summary> 
//        private void 
        StopTimer:function() 
        {
            if (this._timer != null) 
            {
            	this._timer.Stop();
            }
        }, 

        /// <summary> 
        /// This is the handler for when the repeat _timer expires. All we do 
        /// is invoke a click.
        /// </summary> 
        /// <param name="sender">Sender of the event</param>
        /// <param name="e">Event arguments</param>
//        private void 
        OnTimeout:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            /*TimeSpan*/var interval = TimeSpan.FromMilliseconds(this.Interval);
            if (this._timer.Interval != interval) 
            	this._timer.Interval = interval; 

            if (this.IsPressed) 
            {
            	this.OnClick();
            }
        },
        
        /// <summary>
        /// Raises InvokedAutomationEvent and call the base method to raise the Click event 
        /// </summary>
        /// <ExternalAPI/> 
//        protected override void 
        OnClick:function() 
        {
//            if (AutomationPeer.ListenerExists(AutomationEvents.InvokePatternOnInvoked)) 
//            {
//                AutomationPeer peer = UIElementAutomationPeer.CreatePeerForElement(this);
//                if (peer != null)
//                    peer.RaiseAutomationEvent(AutomationEvents.InvokePatternOnInvoked); 
//            }
 
        	ButtonBase.prototype.OnClick.call(this); 
        },
 
        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event.
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
        	ButtonBase.prototype.OnMouseLeftButtonDown.call(this, e); 

            if (this.IsPressed && (this.ClickMode != ClickMode.Hover)) 
            {
            	this.StartTimer();
            }
        }, 

        /// <summary> 
        /// This is the method that responds to the MouseButtonEvent event. 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e)
        {
        	ButtonBase.prototype.OnMouseLeftButtonUp.call(this, e);
 
            if (this.ClickMode != ClickMode.Hover)
            { 
            	this.StopTimer(); 
            }
        }, 

        /// <summary>
        ///     Called when this element loses mouse capture.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnLostMouseCapture:function(/*MouseEventArgs*/ e) 
        { 
        	ButtonBase.prototype.OnLostMouseCapture.call(this, e);
            this.StopTimer(); 
        },

        /// <summary>
        ///     An event reporting the mouse entered this element. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnMouseEnter:function(/*MouseEventArgs*/ e) 
        {
        	ButtonBase.prototype.OnMouseEnter.call(this, e); 
            if (this.HandleIsMouseOverChanged())
            {
                e.Handled = true;
            } 
        },
 
        /// <summary> 
        ///     An event reporting the mouse left this element.
        /// </summary> 
        /// <param name="e">Event arguments</param>
//        protected override void 
        OnMouseLeave:function(/*MouseEventArgs*/ e)
        {
        	ButtonBase.prototype.OnMouseLeave.call(this, e); 
            if (this.HandleIsMouseOverChanged())
            { 
                e.Handled = true; 
            }
        }, 

        /// <summary>
        ///     An event reporting that the IsMouseOver property changed.
        /// </summary> 
//        private bool 
        HandleIsMouseOverChanged:function()
        { 
            if (this.ClickMode == ClickMode.Hover) 
            {
                if (this.IsMouseOver) 
                {
                	this.StartTimer();
                }
                else 
                {
                	this.StopTimer(); 
                } 

                return true; 
            }

            return false;
        }, 

        /// <summary> 
        /// This is the method that responds to the KeyDown event. 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        {
        	ButtonBase.prototype.OnKeyDown.call(this, e);
            if ((e.Key == Key.Space) && (this.ClickMode != ClickMode.Hover)) 
            {
            	this.StartTimer(); 
            } 
        },
 
        /// <summary>
        /// This is the method that responds to the KeyUp event.
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnKeyUp:function(/*KeyEventArgs*/ e)
        { 
            if ((e.Key == Key.Space) && (this.ClickMode != ClickMode.Hover)) 
            {
            	this.StopTimer(); 
            }
            ButtonBase.prototype.OnKeyUp.call(this, e);
        }
	});
	
	Object.defineProperties(RepeatButton.prototype,{
		/// <summary>
        ///     Specifies the amount of time, in milliseconds, to wait before repeating begins. 
        /// Must be non-negative
        /// </summary>
//        public int 
		Delay: 
        {
            get:function() 
            { 
                return this.GetValue(RepeatButton.DelayProperty);
            },
            set:function(value)
            {
            	this.SetValue(RepeatButton.DelayProperty, value);
            } 
        },
 
        /// <summary>
        ///     Specifies the amount of time, in milliseconds, between repeats once repeating starts. 
        /// Must be non-negative
        /// </summary>
//        public int 
        Interval: 
        {
            get:function()
            { 
                return this.GetValue(RepeatButton.IntervalProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(RepeatButton.IntervalProperty, value);
            } 
        },
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        {
            get:function() { return _dType; }
        }
 
	});
	
	Object.defineProperties(RepeatButton,{
        /// <summary> 
        ///     The Property for the Delay property.
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      Depend on SPI_GETKEYBOARDDELAY from SystemMetrics
        /// </summary>
//        public static readonly DependencyProperty 
		DelayProperty:
        {
        	get:function(){
        		if(RepeatButton._DelayProperty === undefined){
        			RepeatButton._DelayProperty = DependencyProperty.Register("Delay", Number.Type, RepeatButton.Type, 
                            /*new FrameworkPropertyMetadata(GetKeyboardDelay())*/
        					FrameworkPropertyMetadata.BuildWithDV(RepeatButton.GetKeyboardDelay()),
                            new ValidateValueCallback(null, IsDelayValid));
        		}
        		
        		return RepeatButton._DelayProperty;
        	}
        },
             
        /// <summary> 
        ///     The Property for the Interval property.
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      Depend on SPI_GETKEYBOARDSPEED from SystemMetrics
        /// </summary>
//        public static readonly DependencyProperty 
		IntervalProperty:
        {
        	get:function(){
        		if(RepeatButton._IntervalProperty === undefined){
        			RepeatButton._IntervalProperty = DependencyProperty.Register("Interval", Number.Type, RepeatButton.Type, 
                            /*new FrameworkPropertyMetadata(GetKeyboardSpeed())*/
        					FrameworkPropertyMetadata.BuildWithDV(RepeatButton.GetKeyboardSpeed()),
                            new ValidateValueCallback(null, IsIntervalValid)); 
        		}
        		
        		return RepeatButton._IntervalProperty;
        	}
        }
             
	});
	
//    private static bool 
	function IsDelayValid(/*object*/ value) { return (value) >= 0; }
//    private static bool 
	function IsIntervalValid(/*object*/ value) { return (value) > 0; }
    
  /// <summary> 
    /// Retrieves the keyboard repeat-delay setting, which is a value in the range from 0 
    /// (approximately 250 ms delay) through 3 (approximately 1 second delay).
    /// The actual delay associated with each value may vary depending on the hardware. 
    /// </summary>
    /// <returns></returns>
//    internal static int 
	RepeatButton.GetKeyboardDelay = function()
    { 
        var delay = SystemParameters.KeyboardDelay;
        // SPI_GETKEYBOARDDELAY 0,1,2,3 correspond to 250,500,750,1000ms 
        if (delay < 0 || delay > 3) 
            delay = 0;
        return (delay + 1) * 250; 
    };

    /// <summary>
    /// Retrieves the keyboard repeat-speed setting, which is a value in the range from 0 
    /// (approximately 2.5 repetitions per second) through 31 (approximately 30 repetitions per second).
    /// The actual repeat rates are hardware-dependent and may vary from a linear scale by as much as 20% 
    /// </summary> 
    /// <returns></returns>
//    internal static int 
    RepeatButton.GetKeyboardSpeed = function() 
    {
        var speed = SystemParameters.KeyboardSpeed;
        // SPI_GETKEYBOARDSPEED 0,...,31 correspond to 1000/2.5=400,...,1000/30 ms
        if (speed < 0 || speed > 31) 
            speed = 31;
        return (31 - speed) * (400 - 1000/30) / 31 + 1000/30; 
    }; 
	
//    static RepeatButton()
	function Initialize()
    { 
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(RepeatButton.Type, /*new FrameworkPropertyMetadata(RepeatButton.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(RepeatButton.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(RepeatButton.Type); 
        ButtonBase.ClickModeProperty.OverrideMetadata(RepeatButton.Type, /*new FrameworkPropertyMetadata(ClickMode.Press)*/
        		FrameworkPropertyMetadata.BuildWithDV(ClickMode.Press)); 
    }
	
	RepeatButton.Type = new Type("RepeatButton", RepeatButton, [ButtonBase.Type]);
	return RepeatButton;
});
