/**
 * Slider
 */
/// <summary> 
/// Slider control lets the user select from a range of values by moving a slider. 
/// Slider is used to enable to user to gradually modify a value (range selection).
/// Slider is an easy and natural interface for users, because it provides good visual feedback. 
/// </summary>
/// <seealso cref="RangeBase" />
define(["dojo/_base/declare", "system/Type", "primitives/RangeBase", "input/RoutedCommand",
        "input/KeyEventArgs", "input/ModifierKeys", "windows/FlowDirection", "primitives/AutoToolTipPlacement",
        "windows/EventManager", "windows/FrameworkElement", "input/InputGesture", "input/Mouse",
        "input/MouseButtonEventHandler"], 
		function(declare, Type, RangeBase, RoutedCommand,
				KeyEventArgs, ModifierKeys, FlowDirection, AutoToolTipPlacement,
				EventManager, FrameworkElement, InputGesture, Mouse,
				MouseButtonEventHandler){
//	private class 
	var SliderGesture =declare(InputGesture, 
    { 
        constructor:function(/*Key*/ normal, /*Key*/ inverted, /*bool*/ forHorizontal) 
        {
            this._normal = normal; 
            this._inverted = inverted;
            this._forHorizontal = forHorizontal;
        },

        /// <summary>
        /// Sees if the InputGesture matches the input associated with the inputEventArgs 
        /// </summary> 
//        public override bool 
        Matches:function(/*object*/ targetElement, /*InputEventArgs*/ inputEventArgs)
        { 
            /*KeyEventArgs*/var keyEventArgs = inputEventArgs instanceof KeyEventArgs ? inputEventArgs : null;
            /*Slider*/var slider = targetElement instanceof Slider ? targetElement : null;
            if (keyEventArgs != null && slider != null && Keyboard.Modifiers == ModifierKeys.None)
            { 
                if(this._normal == keyEventArgs.RealKey)
                { 
                    return !this.IsInverted(slider); 
                }
                if (this._inverted == keyEventArgs.RealKey) 
                {
                    return this.IsInverted(slider);
                }
            } 
            return false;
        }, 

//        private bool 
        IsInverted:function(/*Slider*/ slider)
        { 
            if (this._forHorizontal)
            {
                return slider.IsDirectionReversed != (slider.FlowDirection == FlowDirection.RightToLeft);
            } 
            else
            { 
                return slider.IsDirectionReversed; 
            }
        } 

//        private Key _normal, _inverted;
//        private bool _forHorizontal;
    }); 
	
//    private static RoutedCommand 
	var _increaseLargeCommand = null;
//    private static RoutedCommand 
	var _increaseSmallCommand = null; 
//    private static RoutedCommand 
	var _decreaseLargeCommand = null; 
//    private static RoutedCommand 
	var _decreaseSmallCommand = null;
//    private static RoutedCommand 
	var _minimizeValueCommand = null; 
//    private static RoutedCommand 
	var _maximizeValueCommand = null;
	
//    private const string 
	var TrackName = "PART_Track"; 
//    private const string 
	var SelectionRangeElementName = "PART_SelectionRange";
	
//    private static DependencyObjectType 
	var _dType = null; 
    
	var Slider = declare("Slider", RangeBase,{
		constructor:function(){
			
	        // Slider required parts
//	        private FrameworkElement 
			this._selectionRangeElement = null;
//	        private Track 
			this._track = null;
//	        private ToolTip 
			this._autoToolTip = null; 
//	        private object 
			this._thumbOriginalToolTip = null;
		},
		
		/// <summary>
        ///     This method is invoked when the Minimum property changes.
        /// </summary> 
        /// <param name="oldMinimum">The old value of the Minimum property.</param>
        /// <param name="newMinimum">The new value of the Minimum property.</param> 
//        protected override void 
		OnMinimumChanged:function(/*double*/ oldMinimum, /*double*/ newMinimum) 
        {
            CoerceValue(Slider.SelectionStartProperty); 
        },

        /// <summary>
        ///     This method is invoked when the Maximum property changes. 
        /// </summary>
        /// <param name="oldMaximum">The old value of the Maximum property.</param> 
        /// <param name="newMaximum">The new value of the Maximum property.</param> 
//        protected override void 
        OnMaximumChanged:function(/*double*/ oldMaximum, /*double*/ newMaximum)
        { 
            CoerceValue(Slider.SelectionStartProperty);
            CoerceValue(Slider.SelectionEndProperty);
        },
 
        /// <summary>
        /// When IsMoveToPointEneabled is 'true', Slider needs to preview MouseLeftButtonDown event, in order prevent its RepeatButtons 
        /// from handle Left-Click.
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnPreviewMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) 
        {
 
            if (this.IsMoveToPointEnabled && this.Track != null && this.Track.Thumb != null && !this.Track.Thumb.IsMouseOver) 
            {
                // Move Thumb to the Mouse location 

                var pt = e.MouseDevice.GetPosition(this.Track);

                var newValue = Track.ValueFromPoint(pt); 
                if (/*System.Windows.Shapes.*/Shape.IsDoubleFinite(newValue))
                { 
                	this.UpdateValue(newValue); 
                }
                e.Handled = true; 
            }

            base.OnPreviewMouseLeftButtonDown(e);
        },
        
        /// <summary>
        /// Called when user start dragging the Thumb.
        /// This function can be override to customize the way Slider handles Thumb movement.
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
        OnThumbDragStarted:function(/*DragStartedEventArgs*/ e) 
        { 
            // Show AutoToolTip if needed.
            var thumb = e.OriginalSource instanceof Thumb ? e.OriginalSource : null; 

            if ((thumb == null) || (this.AutoToolTipPlacement == AutoToolTipPlacement.None))
            {
                return; 
            }
 
            // Save original tooltip 
            this._thumbOriginalToolTip = thumb.ToolTip;
 
            if (this._autoToolTip == null)
            {
            	this._autoToolTip = new ToolTip();
            	this._autoToolTip.Placement = PlacementMode.Custom; 
                this._autoToolTip.PlacementTarget = thumb;
                this._autoToolTip.CustomPopupPlacementCallback = new CustomPopupPlacementCallback(this.AutoToolTipCustomPlacementCallback); 
            } 

            thumb.ToolTip = _autoToolTip; 
            this._autoToolTip.Content = GetAutoToolTipNumber();
            this._autoToolTip.IsOpen = true;
            this._autoToolTip.Parent.Reposition();
        },

        /// <summary> 
        /// Called when user dragging the Thumb. 
        /// This function can be override to customize the way Slider handles Thumb movement.
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
        OnThumbDragDelta:function(/*DragDeltaEventArgs*/ e)
        {
            var thumb = e.OriginalSource instanceof Thumb ? e.OriginalSource : null; 
            // Convert to Track's co-ordinate
            if (this.Track != null && thumb == this.Track.Thumb) 
            { 

                var newValue = this.Value + Track.ValueFromDistance(e.HorizontalChange, e.VerticalChange); 
                if (/*System.Windows.Shapes.*/Shape.IsDoubleFinite(newValue))
                {
                	this.UpdateValue(newValue);
                } 

                // Show AutoToolTip if needed 
                if (this.AutoToolTipPlacement != Primitives.AutoToolTipPlacement.None) 
                {
                    if (this._autoToolTip == null) 
                    {
                    	this._autoToolTip = new ToolTip();
                    }
 
                    this._autoToolTip.Content = this.GetAutoToolTipNumber();
 
                    if (thumb.ToolTip != this._autoToolTip) 
                    {
                        thumb.ToolTip = this._autoToolTip; 
                    }

                    if (!this._autoToolTip.IsOpen)
                    { 
                    	this._autoToolTip.IsOpen = true;
                    } 
                    this._autoToolTip.Parent.Reposition(); 
                }
            } 
        },

//        private string 
        GetAutoToolTipNumber:function()
        { 
            /*NumberFormatInfo*/var format = NumberFormatInfo.CurrentInfo.Clone();
            format.NumberDecimalDigits = this.AutoToolTipPrecision; 
            return this.Value.ToString("N", format); 
        },
 
        /// <summary>
        /// Called when user stop dragging the Thumb.
        /// This function can be override to customize the way Slider handles Thumb movement.
        /// </summary> 
        /// <param name="e"></param>
//        protected virtual void 
        OnThumbDragCompleted:function(/*DragCompletedEventArgs*/ e) 
        { 
            // Show AutoToolTip if needed.
            var thumb = e.OriginalSource instanceof Thumb ? e.OriginalSource : null; 

            if ((thumb == null) || (this.AutoToolTipPlacement == Primitives.AutoToolTipPlacement.None))
            {
                return; 
            }
 
            if (this._autoToolTip != null) 
            {
            	this._autoToolTip.IsOpen = false; 
            }

            thumb.ToolTip = this._thumbOriginalToolTip;
        }, 

 
//        private CustomPopupPlacement[] 
        AutoToolTipCustomPlacementCallback:function(/*Size*/ popupSize, /*Size*/ targetSize, /*Point*/ offset) 
        {
            switch (this.AutoToolTipPlacement) 
            {
                case Primitives.AutoToolTipPlacement.TopLeft:
                    if (this.Orientation == Orientation.Horizontal)
                    { 
                        // Place popup at top of thumb
                        return /*new CustomPopupPlacement[]{*/[new CustomPopupPlacement( 
                            new Point((targetSize.Width - popupSize.Width) * 0.5, -popupSize.Height), 
                            PopupPrimaryAxis.Horizontal)
                        ]; 
                    }
                    else
                    {
                        // Place popup at left of thumb 
                        return /*new CustomPopupPlacement[] {*/[
                            new CustomPopupPlacement( 
                            new Point(-popupSize.Width, (targetSize.Height - popupSize.Height) * 0.5), 
                            PopupPrimaryAxis.Vertical)
                        ]; 
                    }

                case Primitives.AutoToolTipPlacement.BottomRight:
                    if (Orientation == Orientation.Horizontal) 
                    {
                        // Place popup at bottom of thumb 
                        return /*new CustomPopupPlacement[] {*/[ 
                            new CustomPopupPlacement(
                            new Point((targetSize.Width - popupSize.Width) * 0.5, targetSize.Height) , 
                            PopupPrimaryAxis.Horizontal)
                        ];

                    } 
                    else
                    { 
                        // Place popup at right of thumb 
                        return /*new CustomPopupPlacement[] {*/[
                            new CustomPopupPlacement( 
                            new Point(targetSize.Width, (targetSize.Height - popupSize.Height) * 0.5),
                            PopupPrimaryAxis.Vertical)
                        ];
                    } 

                default: 
                    return /*new CustomPopupPlacement[]{}*/[]; 
            }
        }, 


        /// <summary>
        /// Resize and resposition the SelectionRangeElement. 
        /// </summary>
//        private void 
        UpdateSelectionRangeElementPositionAndSize:function() 
        { 
            var trackSize = new Size(0, 0);
            var thumbSize = new Size(0, 0); 

            if (this.Track == null || DoubleUtil.LessThan(SelectionEnd,SelectionStart))
            {
                return; 
            }
 
            trackSize = this.Track.RenderSize; 
            thumbSize = (this.Track.Thumb != null) ? this.Track.Thumb.RenderSize : new Size(0, 0);
 
            var range = Maximum - Minimum;
            var valueToSize;

            var rangeElement = this.SelectionRangeElement instanceof FrameworkElement ? this.SelectionRangeElement : null; 

            if (rangeElement == null) 
            { 
                return;
            } 

            if (this.Orientation == Orientation.Horizontal)
            {
                // Calculate part size for HorizontalSlider 
                if (DoubleUtil.AreClose(range, 0d) || (DoubleUtil.AreClose(trackSize.Width, thumbSize.Width)))
                { 
                    valueToSize = 0; 
                }
                else 
                {
                    valueToSize = Math.max(0.0, (trackSize.Width - thumbSize.Width) / range);
                }
 
                rangeElement.Width = ((this.SelectionEnd - this.SelectionStart) * valueToSize);
                if (this.IsDirectionReversed) 
                { 
                    Canvas.SetLeft(rangeElement, (thumbSize.Width * 0.5) + Math.max(this.Maximum - this.SelectionEnd, 0) * valueToSize);
                } 
                else
                {
                    Canvas.SetLeft(rangeElement, (thumbSize.Width * 0.5) + Math.max(this.SelectionStart - this.Minimum, 0) * valueToSize);
                } 
            }
            else 
            { 
                // Calculate part size for VerticalSlider
                if (DoubleUtil.AreClose(range, 0d) || (DoubleUtil.AreClose(trackSize.Height, thumbSize.Height))) 
                {
                    valueToSize = 0;
                }
                else 
                {
                    valueToSize = Math.max(0.0, (trackSize.Height - thumbSize.Height) / range); 
                } 

                rangeElement.Height = ((this.SelectionEnd - this.SelectionStart) * valueToSize); 
                if (IsDirectionReversed)
                {
                    Canvas.SetTop(rangeElement, (thumbSize.Height * 0.5) + Math.max(this.SelectionStart - this.Minimum, 0) * valueToSize);
                } 
                else
                { 
                    Canvas.SetTop(rangeElement, (thumbSize.Height * 0.5) + Math.max(this.Maximum - this.SelectionEnd,0) * valueToSize); 
                }
            } 
        },
        
      /// <summary> 
        /// Snap the input 'value' to the closest tick.
        /// If input value is exactly in the middle of 2 surrounding ticks, it will be snapped to the tick that has greater value.
        /// </summary>
        /// <param name="value">Value that want to snap to closest Tick.</param> 
        /// <returns>Snapped value if IsSnapToTickEnabled is 'true'. Otherwise, returns un-snaped value.</returns>
//        private double 
        SnapToTick:function(/*double*/ value) 
        { 
            if (this.IsSnapToTickEnabled)
            { 
                var previous = this.Minimum;
                var next = this.Maximum;

                // This property is rarely set so let's try to avoid the GetValue 
                // caching of the mutable default value
                /*DoubleCollection*/var ticks = null; 
                var hasModifiersOut = {"hasModifiers" : null}; 
                var result= this.GetValueSource(TicksProperty, null, /*out hasModifiers*/hasModifiersOut);
                hasModifiers = hasModifiersOut.hasModifiers;
                if (result != BaseValueSourceInternal.Default || hasModifiers) 
                {
                    ticks = Ticks;
                }
 
                // If ticks collection is available, use it.
                // Note that ticks may be unsorted. 
                if ((ticks != null) && (ticks.Count > 0)) 
                {
                    for (var i = 0; i < ticks.Count; i++) 
                    {
                        var tick = ticks[i];
                        if (DoubleUtil.AreClose(tick, value))
                        { 
                            return value;
                        } 
 
                        if (DoubleUtil.LessThan(tick, value) && DoubleUtil.GreaterThan(tick, previous))
                        { 
                            previous = tick;
                        }
                        else if (DoubleUtil.GreaterThan(tick ,value) && DoubleUtil.LessThan(tick, next))
                        { 
                            next = tick;
                        } 
                    } 
                }
                else if (DoubleUtil.GreaterThan(TickFrequency, 0.0)) 
                {
                    previous = this.Minimum + (Math.round(((value - this.Minimum) / this.TickFrequency)) * this.TickFrequency);
                    next = Math.min(this.Maximum, previous + this.TickFrequency);
                } 

                // Choose the closest value between previous and next. If tie, snap to 'next'. 
                value = DoubleUtil.GreaterThanOrClose(value, (previous + next) * 0.5) ? next : previous; 
            }
 
            return value;
        },

        // Sets Value = SnapToTick(value+direction), unless the result of SnapToTick is Value, 
        // then it searches for the next tick greater(if direction is positive) than value
        // and sets Value to that tick 
//        private void 
        MoveToNextTick:function(/*double*/ direction) 
        {
            if (direction != 0.0) 
            {
                var value = this.Value;

                // Find the next value by snapping 
                var next = SnapToTick(Math.max(this.Minimum, Math.min(this.Maximum, value + direction)));
 
                var greaterThan = direction > 0; //search for the next tick greater than value? 

                // If the snapping brought us back to value, find the next tick point 
                if (next == value
                    && !( greaterThan && value == this.Maximum)  // Stop if searching up if already at Max
                    && !(!greaterThan && value == this.Minimum)) // Stop if searching down if already at Min
                { 
                    // This property is rarely set so let's try to avoid the GetValue
                    // caching of the mutable default value 
                    DoubleCollection ticks = null; 
                    
                    var hasModifiersOut = {"hasModifiers" : null}; 
                    var result= this.GetValueSource(Slider.TicksProperty, null, /*out hasModifiers*/hasModifiersOut);
                    hasModifiers = hasModifiersOut.hasModifiers;
                    
                    if (result != BaseValueSourceInternal.Default || hasModifiers)
                    {
                        ticks = Ticks;
                    } 

                    // If ticks collection is available, use it. 
                    // Note that ticks may be unsorted. 
                    if ((ticks != null) && (ticks.Count > 0))
                    { 
                        for (var i = 0; i < ticks.Count; i++)
                        {
                            var tick = ticks[i];
 
                            // Find the smallest tick greater than value or the largest tick less than value
                            if ((greaterThan && DoubleUtil.GreaterThan(tick, value) && (DoubleUtil.LessThan(tick, next) || next == value)) 
                             ||(!greaterThan && DoubleUtil.LessThan(tick, value) && (DoubleUtil.GreaterThan(tick, next) || next == value))) 
                            {
                                next = tick; 
                            }
                        }
                    }
                    else if (DoubleUtil.GreaterThan(this.TickFrequency, 0.0)) 
                    {
                        // Find the current tick we are at 
                        var tickNumber = Math.round((value - this.Minimum) / this.TickFrequency); 

                        if (greaterThan) 
                            tickNumber += 1.0;
                        else
                            tickNumber -= 1.0;
 
                        next = this.Minimum + tickNumber * this.TickFrequency;
                    } 
                } 

 
                // Update if we've found a better value
                if (next != value)
                {
                    this.SetCurrentValueInternal(ValueProperty, next); 
                }
            } 
        }, 
        
        /// <summary>
        /// Perform arrangement of slider's children 
        /// </summary> 
        /// <param name="finalSize"></param>
//        protected override Size 
        ArrangeOverride:function(/*Size*/ finalSize) 
        {
            var size = RangeBase.prototype.ArrangeOverride.call(this);

            this.UpdateSelectionRangeElementPositionAndSize(); 

//            return size; 
        }, 

        /// <summary> 
        /// Update SelectionRange Length.
        /// </summary>
        /// <param name="oldValue"></param>
        /// <param name="newValue"></param> 
//        protected override void 
        OnValueChanged:function(/*double*/ oldValue, /*double*/ newValue)
        { 
        	RangeBase.prototype.OnValueChanged.call(this, oldValue, newValue); 
            this.UpdateSelectionRangeElementPositionAndSize();
        }, 

        /// <summary>
        /// Slider locates the SelectionRangeElement when its visual tree is created
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
        	RangeBase.prototype.OnApplyTemplate(); 

            this.SelectionRangeElement = GetTemplateChild(this.SelectionRangeElementName);
            this.SelectionRangeElement = this.SelectionRangeElement instanceof FrameworkElement ? this.SelectionRangeElement : null; 
            this.Track = GetTemplateChild(TrackName);
            this.Track = this.Track instanceof Track ? this.Track : null;

            if (this._autoToolTip != null)
            { 
            	this._autoToolTip.PlacementTarget = this.Track != null ? this. Track.Thumb : null;
            } 
        }, 

        /// <summary> 
        /// Call when Slider.IncreaseLarge command is invoked.
        /// </summary> 
//        protected virtual void 
        OnIncreaseLarge:function() 
        {
        	this.MoveToNextTick(this.LargeChange); 
        },

        /// <summary>
        /// Call when Slider.DecreaseLarge command is invoked. 
        /// </summary>
//        protected virtual void 
        OnDecreaseLarge:function() 
        { 
        	this.MoveToNextTick(-this.LargeChange);
        }, 

        /// <summary>
        /// Call when Slider.IncreaseSmall command is invoked.
        /// </summary> 
//        protected virtual void 
        OnIncreaseSmall:function()
        { 
        	this.MoveToNextTick(this.SmallChange); 
        },
 
        /// <summary>
        /// Call when Slider.DecreaseSmall command is invoked.
        /// </summary>
//        protected virtual void 
        OnDecreaseSmall:function() 
        {
        	this.MoveToNextTick(-this.SmallChange); 
        }, 

        /// <summary> 
        /// Call when Slider.MaximizeValue command is invoked.
        /// </summary>
//        protected virtual void 
        OnMaximizeValue:function()
        { 
            this.SetCurrentValueInternal(Slider.ValueProperty, this.Maximum);
        }, 
 
        /// <summary>
        /// Call when Slider.MinimizeValue command is invoked. 
        /// </summary>
//        protected virtual void 
        OnMinimizeValue:function()
        {
            this.SetCurrentValueInternal(Slider.ValueProperty, this.Minimum); 
        },
        /// <summary>
        /// Helper function for value update.
        /// This function will also snap the value to tick, if IsSnapToTickEnabled is true.
        /// </summary> 
        /// <param name="value"></param>
//        private void 
        UpdateValue:function(/*double*/ value) 
        { 
            var snappedValue = SnapToTick(value);
 
            if (snappedValue != Value)
            {
                this.SetCurrentValueInternal(Slider.ValueProperty, Math.max(this.Minimum, Math.min(this.Maximum, snappedValue)));
            } 
        }
	});
	
	Object.defineProperties(Slider.prototype,{
		/// <summary> 
        /// Get/Set Orientation property
        /// </summary> 
//        public Orientation 
		Orientation: 
        {
            get:function() { return this.GetValue(Slider.OrientationProperty); }, 
            set:function(value) { this.SetValue(Slider.OrientationProperty, value); }
        },

 
        /// <summary>
        /// Get/Set IsDirectionReversed property 
        /// </summary> 
//        public bool 
        IsDirectionReversed:
        {
            get:function()
            {
                return this.GetValue(Slider.IsDirectionReversedProperty); 
            },
            set:function(value) 
            { 
            	this.SetValue(Slider.IsDirectionReversedProperty, value);
            } 
        },
        
        /// <summary>
        ///     Specifies the amount of time, in milliseconds, to wait before repeating begins.
        /// Must be non-negative.
        /// </summary> 
//        public int 
        Delay: 
        { 
            get:function()
            { 
                return this.GetValue(Slider.DelayProperty);
            },
            set:function(value)
            { 
            	this.SetValue(Slider.DelayProperty, value);
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
                return this.GetValue(Slider.IntervalProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(Slider.IntervalProperty, value);
            } 
        },
     

        /// <summary> 
        ///     AutoToolTipPlacement property specifies the placement of the AutoToolTip
        /// </summary>
//        public Primitives.AutoToolTipPlacement 
        AutoToolTipPlacement: 
        {
            get:function() 
            { 
                return this.GetValue(Slider.AutoToolTipPlacementProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(Slider.AutoToolTipPlacementProperty, value);
            } 
        },
      /// <summary> 
        ///     Get or set number of decimal digits of Slider's Value shown in AutoToolTip
        /// </summary>
//        public int 
        AutoToolTipPrecision: 
        {
            get:function() 
            { 
                return this.GetValue(Slider.AutoToolTipPrecisionProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(Slider.AutoToolTipPrecisionProperty, value);
            } 
        },
        /// <summary> 
        ///     When 'true', Slider will automatically move the Thumb (and/or change current value) to the closest TickMark.
        /// </summary>
//        public bool 
        IsSnapToTickEnabled: 
        {
            get:function() 
            { 
                return this.GetValue(Slider.IsSnapToTickEnabledProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(Slider.IsSnapToTickEnabledProperty, value);
            } 
        },

        /// <summary> 
        ///     Slider uses this value to determine where to show the Ticks. 
        /// When Ticks is not 'null', Slider will ignore 'TickFrequency', and draw only TickMarks
        /// that specified in Ticks collection. 
        /// </summary>
//        public Primitives.TickPlacement 
        TickPlacement:
        { 
            get:function()
            { 
                return this.GetValue(Slider.TickPlacementProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(Slider.TickPlacementProperty, value);
            }
        },
        
      /// <summary> 
        ///     Slider uses this value to determine where to show the Ticks. 
        /// When Ticks is not 'null', Slider will ignore 'TickFrequency', and draw only TickMarks
        /// that specified in Ticks collection. 
        /// </summary>
//        public double 
        TickFrequency:
        { 
            get:function()
            { 
                return this.GetValue(Slider.TickFrequencyProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(Slider.TickFrequencyProperty, value);
            }
        }, 
        /// <summary> 
        ///     Slider uses this value to determine where to show the Ticks. 
        /// When Ticks is not 'null', Slider will ignore 'TickFrequency', and draw only TickMarks
        /// that specified in Ticks collection. 
        /// </summary>
//        public 
//        DoubleCollection 
        Ticks:
        { 
            get:function()
            { 
                return this.GetValue(Slider.TicksProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(Slider.TicksProperty, value);
            }
        },

        /// <summary> 
        ///     Enable or disable selection support on Slider 
        /// </summary>
//        public bool 
        IsSelectionRangeEnabled:
        {
            get:function()
            { 
                return this.GetValue(Slider.IsSelectionRangeEnabledProperty);
            }, 
            set:function(value) 
            {
            	this.SetValue(Slider.IsSelectionRangeEnabledProperty, value); 
            }
        },
        /// <summary> 
        ///     Get or set starting value of selection. 
        /// </summary>
//        public double 
        SelectionStart:
        {
            get:function() { return this.GetValue(Slider.SelectionStartProperty); },
            set:function(value) { this.SetValue(Slider.SelectionStartProperty, value); } 
        },
        /// <summary>
        ///     Get or set starting value of selection.
        /// </summary> 
//        public double 
        SelectionEnd: 
        { 
            get:function() { return this.GetValue(Slider.SelectionEndProperty); },
            set:function(value) { this.SetValue(Slider.SelectionEndProperty, value); } 
        },
        /// <summary>
        ///     Enable or disable Move-To-Point support on Slider. 
        ///     Move-To-Point feature, enables Slider to immediately move the Thumb directly to the location where user
        /// clicked the Mouse.
        /// </summary>
//        public bool 
        IsMoveToPointEnabled:
        { 
            get:function() 
            {
                return this.GetValue(Slider.IsMoveToPointEnabledProperty); 
            },
            set:function(value)
            {
            	this.SetValue(Slider.IsMoveToPointEnabledProperty, value); 
            }
        },
        
      /// <summary> 
        /// Gets or sets reference to Slider's Track element.
        /// </summary> 
//        internal Track 
        Track: 
        {
            get:function() 
            {
                return this._track;
            },
            set:function(value) 
            {
            	this._track = value; 
            } 
        },

        /// <summary>
        /// Gets or sets reference to Slider's SelectionRange element. 
        /// </summary>
//        internal FrameworkElement 
        SelectionRangeElement: 
        { 
            get:function()
            { 
                return this._selectionRangeElement;
            },
            set:function(value)
            { 
            	this._selectionRangeElement = value;
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
	
	Object.defineProperties(Slider,{
		/// <summary>
        /// Increase Slider value 
        /// </summary>
//        public static RoutedCommand 
		IncreaseLarge: 
        { 
            get:function() { return _increaseLargeCommand; }
        }, 
        /// <summary>
        /// Decrease Slider value
        /// </summary>
//        public static RoutedCommand 
		DecreaseLarge: 
        {
            get:function() { return _decreaseLargeCommand; } 
        }, 
        /// <summary>
        /// Increase Slider value 
        /// </summary>
//        public static RoutedCommand 
		IncreaseSmall:
        {
            get:function() { return _increaseSmallCommand; } 
        },
        /// <summary> 
        /// Decrease Slider value 
        /// </summary>
//        public static RoutedCommand 
		DecreaseSmall: 
        {
            get:function() { return _decreaseSmallCommand; }
        },
        /// <summary> 
        /// Set Slider value to mininum
        /// </summary> 
//        public static RoutedCommand 
		MinimizeValue: 
        {
            get:function() { return _minimizeValueCommand; } 
        },
        /// <summary>
        /// Set Slider value to maximum
        /// </summary> 
//        public static RoutedCommand 
		MaximizeValue:
        { 
            get:function() { return _maximizeValueCommand; } 
        },
        
      /// <summary>
        /// DependencyProperty for <see cref="Orientation" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        OrientationProperty:
        {
        	get:function(){
        		if(RangeBase._OrientationProperty === undefined){
        			RangeBase._OrientationProperty  =
                        DependencyProperty.Register("Orientation", Number.Type, Slider.Type, 
                                /*new FrameworkPropertyMetadata(null, Orientation.Horizontal)*/
                        		FrameworkPropertyMetadata.Build2(null, Orientation.Horizontal),
                                new ValidateValueCallback(null, ScrollBar.IsValidOrientation));  
        		}
        		
        		return RangeBase._OrientationProperty;
        	}
        },
        
        /// <summary> 
        /// Slider ThumbProportion property
        /// </summary> 
//        public static readonly DependencyProperty 
        IsDirectionReversedProperty:
        {
        	get:function(){
        		if(RangeBase._IsDirectionReversedProperty === undefined){
        			RangeBase._IsDirectionReversedProperty = DependencyProperty.Register("IsDirectionReversed", Boolean.Type, Slider.Type,
                            /*new FrameworkPropertyMetadata(false)*/
        					FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return RangeBase._IsDirectionReversedProperty;
        	}
        },
            
        
      /// <summary>
        ///     The Property for the Delay property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        DelayProperty:
        {
        	get:function(){
        		if(RangeBase._DelayProperty === undefined){
        			RangeBase._DelayProperty = RepeatButton.DelayProperty.AddOwner(Slider.Type, 
        					/*new FrameworkPropertyMetadata(RepeatButton.GetKeyboardDelay())*/
        					FrameworkPropertyMetadata.BuildWithDV(RepeatButton.GetKeyboardDelay()));  
        		}
        		
        		return RangeBase._DelayProperty;
        	}
        }, 
 
        /// <summary>
        ///     The Property for the Interval property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IntervalProperty:
        {
        	get:function(){
        		if(RangeBase._IntervalProperty === undefined){
        			RangeBase._IntervalProperty = RepeatButton.IntervalProperty.AddOwner(Slider.Type, 
        					/*new FrameworkPropertyMetadata(RepeatButton.GetKeyboardSpeed())*/
        					FrameworkPropertyMetadata.BuildWithDV(RepeatButton.GetKeyboardSpeed())); 
        		}
        		
        		return RangeBase._IntervalProperty;
        	}
        },  
        /// <summary>
        ///     The DependencyProperty for the AutoToolTipPlacement property.
        /// </summary>
//        public static readonly DependencyProperty 
        AutoToolTipPlacementProperty:
        {
        	get:function(){
        		if(RangeBase._AutoToolTipPlacementProperty === undefined){
        			RangeBase._AutoToolTipPlacementProperty = DependencyProperty.Register("AutoToolTipPlacement", Number.Type, Slider.Type,
                            /*new FrameworkPropertyMetadata(Primitives.AutoToolTipPlacement.None)*/
        					FrameworkPropertyMetadata.BuildWIthDV(AutoToolTipPlacement.None), 
                            new ValidateValueCallback(null, IsValidAutoToolTipPlacement)); 
        		}
        		
        		return RangeBase._AutoToolTipPlacementProperty;
        	}
        }, 
             
        /// <summary> 
        ///     The DependencyProperty for the AutoToolTipPrecision property.
        ///     Flags:              None
        ///     Default Value:      0
        /// </summary> 
//        public static readonly DependencyProperty 
        AutoToolTipPrecisionProperty:
        {
        	get:function(){
        		if(RangeBase._AutoToolTipPrecisionProperty === undefined){
        			RangeBase._AutoToolTipPrecisionProperty = DependencyProperty.Register("AutoToolTipPrecision", Number.Type, Slider.Type, 
        		            /*new FrameworkPropertyMetadata(0)*/FrameworkPropertyMetadata.BuildWithDV(0), 
        		            new ValidateValueCallback(null, IsValidAutoToolTipPrecision)); 
        		}
        		
        		return RangeBase._AutoToolTipPrecisionProperty;
        	}
        },
             
        /// <summary>
        ///     The DependencyProperty for the IsSnapToTickEnabled property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsSnapToTickEnabledProperty:
        {
        	get:function(){
        		if(RangeBase._IsSnapToTickEnabledProperty === undefined){
        			RangeBase._IsSnapToTickEnabledProperty = DependencyProperty.Register("IsSnapToTickEnabled", Boolean.Type, Slider.Type, 
        		            /*new FrameworkPropertyMetadata(false)*/
        					FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return RangeBase._IsSnapToTickEnabledProperty;
        	}
        },
             
        /// <summary> 
        ///     The DependencyProperty for the TickPlacement property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TickPlacementProperty:
        {
        	get:function(){
        		if(RangeBase._TickPlacementProperty === undefined){
        			RangeBase._TickPlacementProperty = DependencyProperty.Register("TickPlacement", Number.Type, Slider.Type,
                            /*new FrameworkPropertyMetadata(Primitives.TickPlacement.None)*/
        					FrameworkPropertyMetadata.BuildWithDV(TickPlacement.None),
                            new ValidateValueCallback(null, IsValidTickPlacement));  
        		}
        		
        		return RangeBase._TickPlacementProperty;
        	}
        },
            
        /// <summary> 
        ///     The DependencyProperty for the TickFrequency property. 
        ///     Default Value is 1.0
        /// </summary> 
//        public static readonly DependencyProperty 
        TickFrequencyProperty:
        {
        	get:function(){
        		if(RangeBase._TickFrequencyProperty === undefined){
        			RangeBase._TickFrequencyProperty = DependencyProperty.Register("TickFrequency", Number.Type, Slider.Type,
        		            /*new FrameworkPropertyMetadata(1.0)*/
        					FrameworkPropertyMetadata.BuildWithDV(1.0),
        		            new ValidateValueCallback(null, IsValidDoubleValue));  
        		}
        		
        		return RangeBase._TickFrequencyProperty;
        	}
        },
            
 
        /// <summary>
        ///     The DependencyProperty for the Ticks property. 
        /// </summary>
//        public static readonly DependencyProperty 
        TicksProperty:
        {
        	get:function(){
        		if(RangeBase._TicksProperty === undefined){
        			RangeBase._TicksProperty = DependencyProperty.Register("Ticks", DoubleCollection.Type, Slider.Type,
        		            /*new FrameworkPropertyMetadata(new FreezableDefaultValueFactory(DoubleCollection.Empty))*/
        					FrameworkPropertyMetadata.BuildWithDV(new FreezableDefaultValueFactory(DoubleCollection.Empty))); 
        		}
        		
        		return RangeBase._TicksProperty;
        	}
        },
             
        /// <summary>
        ///     The DependencyProperty for the IsSelectionRangeEnabled property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsSelectionRangeEnabledProperty:
        {
        	get:function(){
        		if(RangeBase._IsSelectionRangeEnabledProperty === undefined){
        			RangeBase._IsSelectionRangeEnabledProperty = DependencyProperty.Register("IsSelectionRangeEnabled", Boolean.Type, Slider.Type,
        		            /*new FrameworkPropertyMetadata(false)*/
        					FrameworkPropertyMetadata.BuildWithDV(false));  
        		}
        		
        		return RangeBase._IsSelectionRangeEnabledProperty;
        	}
        },
             
        
        /// <summary> 
        ///     The DependencyProperty for the SelectionStart property.
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectionStartProperty:
        {
        	get:function(){
        		if(RangeBase._SelectionStartProperty === undefined){
        			RangeBase._SelectionStartProperty = DependencyProperty.Register("SelectionStart", Number.Type, Slider.Type,
                            /*new FrameworkPropertyMetadata(0.0, 
                                    FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                    new PropertyChangedCallback(OnSelectionStartChanged),
                                    new CoerceValueCallback(CoerceSelectionStart))*/
        					FrameworkPropertyMetadata.Build4(0.0, 
                                    FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                    new PropertyChangedCallback(null, OnSelectionStartChanged),
                                    new CoerceValueCallback(null, CoerceSelectionStart)),
                                new ValidateValueCallback(null, IsValidDoubleValue)); 
        		}
        		
        		return RangeBase._SelectionStartProperty;
        	}
        }, 
             
        
        /// <summary> 
        ///     The DependencyProperty for the SelectionEnd property.
        /// </summary>
//        public static readonly DependencyProperty 
        SelectionEndProperty:
        {
        	get:function(){
        		if(RangeBase._SelectionEndProperty === undefined){
        			RangeBase._SelectionEndProperty = DependencyProperty.Register("SelectionEnd", Number.Type, Slider.Type, 
                            /*new FrameworkPropertyMetadata(0.0,
                                    FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                                    new PropertyChangedCallback(OnSelectionEndChanged), 
                                    new CoerceValueCallback(CoerceSelectionEnd))*/
        					FrameworkPropertyMetadata.Build4(0.0,
                                    FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                                    new PropertyChangedCallback(null, OnSelectionEndChanged), 
                                    new CoerceValueCallback(null, CoerceSelectionEnd)),
                                new ValidateValueCallback(null, IsValidDoubleValue));  
        		}
        		
        		return RangeBase._SelectionEndProperty;
        	}
        },
            
        /// <summary>
        ///     The DependencyProperty for the IsMoveToPointEnabled property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsMoveToPointEnabledProperty:
        {
        	get:function(){
        		if(RangeBase._IsMoveToPointEnabledProperty === undefined){
        			RangeBase._IsMoveToPointEnabledProperty = DependencyProperty.Register("IsMoveToPointEnabled", Boolean.Type, Slider.Type,
                            /*new FrameworkPropertyMetadata(false)*/
        					FrameworkPropertyMetadata.BuildWithDV(false));  
        		}
        		
        		return RangeBase._IsMoveToPointEnabledProperty;
        	}
        }
	});
	
//	private static void 
	function OnIncreaseSmallCommand(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
		var slider = sender instanceof Slider ? sender : null;
        if (slider != null)
        {
            slider.OnIncreaseSmall(); 
        }
    } 

//    private static void 
	function OnDecreaseSmallCommand(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
        var slider = sender instanceof Slider ? sender : null;
        if (slider != null)
        {
            slider.OnDecreaseSmall(); 
        }
    } 

//    private static void 
	function OnMaximizeValueCommand(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
		var slider = sender instanceof Slider ? sender : null;
        if (slider != null)
        {
            slider.OnMaximizeValue(); 
        }
    } 

//    private static void 
	function OnMinimizeValueCommand(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
		var slider = sender instanceof Slider ? sender : null;
        if (slider != null)
        {
            slider.OnMinimizeValue(); 
        }
    } 

//    private static void 
	function OnIncreaseLargeCommand(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
		var slider = sender instanceof Slider ? sender : null;
        if (slider != null)
        {
            slider.OnIncreaseLarge(); 
        }
    } 

//    private static void 
	function OnDecreaseLargeCommand(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
		var slider = sender instanceof Slider ? sender : null;
        if (slider != null)
        {
            slider.OnDecreaseLarge(); 
        }
    } 
	
//    private static bool 
	function IsValidAutoToolTipPlacement(/*object*/ o) 
    {
        /*AutoToolTipPlacement*/var placement = o; 
        return placement == AutoToolTipPlacement.None ||
               placement == AutoToolTipPlacement.TopLeft ||
               placement == AutoToolTipPlacement.BottomRight;
    }
	
    /// <summary> 
    /// Validates AutoToolTipPrecision value
    /// </summary> 
    /// <param name="o"></param>
    /// <returns></returns>
//    private static bool 
	function IsValidAutoToolTipPrecision(/*object*/ o)
    { 
        return o >= 0;
    } 

//    private static bool 
	function IsValidTickPlacement(/*object*/ o) 
    { 
        TickPlacement value = (TickPlacement)o;
        return value == TickPlacement.None || 
               value == TickPlacement.TopLeft ||
               value == TickPlacement.BottomRight ||
               value == TickPlacement.Both;
    } 

//    private static void 
	function OnSelectionStartChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        Slider ctrl = (Slider)d; 
        double oldValue = (double)e.OldValue;
        double newValue = (double)e.NewValue;

        ctrl.CoerceValue(SelectionEndProperty); 
        ctrl.UpdateSelectionRangeElementPositionAndSize();
    } 

//    private static object 
	function CoerceSelectionStart(/*DependencyObject*/ d, /*object*/ value)
    { 
        Slider slider = (Slider)d;
        double selection = (double)value;

        double min = slider.Minimum; 
        double max = slider.Maximum;

        if (selection < min) 
        {
            return min; 
        }
        if (selection > max)
        {
            return max; 
        }
        return value; 
    }
	
//	private static void 
	function OnSelectionEndChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Slider ctrl = (Slider)d;
        d.UpdateSelectionRangeElementPositionAndSize(); 
    } 

//    private static object 
	function CoerceSelectionEnd(/*DependencyObject*/ d, /*object*/ value) 
    {
//        Slider slider = (Slider)d;
        var selection = /*(double)*/value;

        var min = d.SelectionStart;
        var max = d.Maximum; 

        if (selection < min)
        { 
            return min;
        }
        if (selection > max)
        { 
            return max;
        } 
        return value; 
    }
	
	/// <summary>
    /// Listen to Thumb DragStarted event. 
    /// </summary>
    /// <param name="sender"></param> 
    /// <param name="e"></param> 
//    private static void 
	function OnThumbDragStarted(/*object*/ sender, /*DragStartedEventArgs*/ e)
    { 
//        Slider slider = sender as Slider;
        d.OnThumbDragStarted(e);
    }

    /// <summary>
    /// Listen to Thumb DragDelta event. 
    /// </summary> 
    /// <param name="sender"></param>
    /// <param name="e"></param> 
//    private static void 
	function OnThumbDragDelta(/*object*/ sender, /*DragDeltaEventArgs*/ e)
    {
//        Slider slider = sender as Slider;

        d.OnThumbDragDelta(e);
    } 

    /// <summary>
    /// Listen to Thumb DragCompleted event. 
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
//    private static void 
	function OnThumbDragCompleted(/*object*/ sender, /*DragCompletedEventArgs*/ e) 
    {
//        Slider slider = sender as Slider; 
        d.OnThumbDragCompleted(e); 
    }

    /// <summary>
    ///     Called when the value of SelectionEnd is required by the property system.
    /// </summary>
    /// <param name="d">The object on which the property was queried.</param> 
    /// <returns>The value of the SelectionEnd property on "d."</returns>
//    private static object 
	function OnGetSelectionEnd(/*DependencyObject*/ d) 
    { 
        return d.SelectionEnd;
    }
	
	/// <summary>
    /// This is a class handler for MouseLeftButtonDown event.
    /// The purpose of this handle is to move input focus to Slider when user pressed 
    /// mouse left button on any part of slider that is not focusable.
    /// </summary> 
    /// <param name="sender"></param> 
    /// <param name="e"></param>
//    private static void 
	function _OnMouseLeftButtonDown(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        if(e.ChangedButton != MouseButton.Left) return;

//        Slider slider = (Slider)sender; 

        // When someone click on the Slider's part, and it's not focusable 
        // Slider need to take the focus in order to process keyboard correctly 
        if (!d.IsKeyboardFocusWithin)
        { 
            e.Handled = d.Focus() || e.Handled;
        }
    }
    /// <summary> 
    /// Validate input value in Slider (LargeChange, SmallChange, SelectionStart, SelectionEnd, and TickFrequency).
    /// </summary> 
    /// <param name="value"></param>
    /// <returns>Returns False if value is NaN or NegativeInfinity or PositiveInfinity. Otherwise, returns True.</returns>
//    private static bool 
    function IsValidDoubleValue(/*object*/ value)
    { 
//        double d = (double)value;

        return !(DoubleUtil.IsNaN(d) || Number.IsInfinity(d)); 
    }
	
//	static void 
	function InitializeCommands()
    {
        _increaseLargeCommand = new RoutedCommand("IncreaseLarge", Slider.Type);
        _decreaseLargeCommand = new RoutedCommand("DecreaseLarge", Slider.Type); 
        _increaseSmallCommand = new RoutedCommand("IncreaseSmall", Slider.Type);
        _decreaseSmallCommand = new RoutedCommand("DecreaseSmall", Slider.Type); 
        _minimizeValueCommand = new RoutedCommand("MinimizeValue", Slider.Type); 
        _maximizeValueCommand = new RoutedCommand("MaximizeValue", Slider.Type);

        CommandHelpers.RegisterCommandHandler(Slider.Type, _increaseLargeCommand, new ExecutedRoutedEventHandler(OnIncreaseLargeCommand),
                                              new SliderGesture(Key.PageUp, Key.PageDown, false));

        CommandHelpers.RegisterCommandHandler(Slider.Type, _decreaseLargeCommand, new ExecutedRoutedEventHandler(OnDecreaseLargeCommand), 
                                              new SliderGesture(Key.PageDown, Key.PageUp, false));

        CommandHelpers.RegisterCommandHandler(Slider.Type, _increaseSmallCommand, new ExecutedRoutedEventHandler(OnIncreaseSmallCommand), 
                                              new SliderGesture(Key.Up, Key.Down, false),
                                              new SliderGesture(Key.Right, Key.Left, true)); 

        CommandHelpers.RegisterCommandHandler(Slider.Type, _decreaseSmallCommand, new ExecutedRoutedEventHandler(OnDecreaseSmallCommand),
                                              new SliderGesture(Key.Down, Key.Up, false),
                                              new SliderGesture(Key.Left, Key.Right, true)); 

        CommandHelpers.RegisterCommandHandler(Slider.Type, _minimizeValueCommand, new ExecutedRoutedEventHandler(OnMinimizeValueCommand), 
                                              Key.Home); 

        CommandHelpers.RegisterCommandHandler(Slider.Type, _maximizeValueCommand, new ExecutedRoutedEventHandler(OnMaximizeValueCommand), 
                                              Key.End);

    }
	
	/// <summary>
    /// This is the static constructor for the Slider class.  It
    /// simply registers the appropriate class handlers for the input
    /// devices, and defines a default style sheet. 
    /// </summary>
//    static Slider() 
	function Initialize()
    { 
        // Initialize CommandCollection & CommandLink(s)
        InitializeCommands(); 

        // Register all PropertyTypeMetadata
        RangeBase.MinimumProperty.OverrideMetadata(Slider.Type, 
        		/*new FrameworkPropertyMetadata(0.0, FrameworkPropertyMetadataOptions.AffectsMeasure)*/
        		FrameworkPropertyMetadata.Build2(0.0, FrameworkPropertyMetadataOptions.AffectsMeasure));
        RangeBase.MaximumProperty.OverrideMetadata(Slider.Type, 
        		/*new FrameworkPropertyMetadata(10.0, FrameworkPropertyMetadataOptions.AffectsMeasure)*/
        		FrameworkPropertyMetadata.Build2(10.0, FrameworkPropertyMetadataOptions.AffectsMeasure)); 
        RangeBase.ValueProperty.OverrideMetadata(Slider.Type, 
        		/*new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.AffectsMeasure)*/
        		FrameworkPropertyMetadata.Build2(0, FrameworkPropertyMetadataOptions.AffectsMeasure));

        // Register Event Handler for the Thumb 
        EventManager.RegisterClassHandler(Slider.Type, Thumb.DragStartedEvent, new DragStartedEventHandler(Slider.OnThumbDragStarted));
        EventManager.RegisterClassHandler(Slider.Type, Thumb.DragDeltaEvent, new DragDeltaEventHandler(Slider.OnThumbDragDelta)); 
        EventManager.RegisterClassHandler(Slider.Type, Thumb.DragCompletedEvent, new DragCompletedEventHandler(Slider.OnThumbDragCompleted));

        // Listen to MouseLeftButtonDown event to determine if slide should move focus to itself
        EventManager.RegisterClassHandler(Slider.Type, Mouse.MouseDownEvent, new MouseButtonEventHandler(Slider._OnMouseLeftButtonDown),true); 

        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Slider.Type, 
        		/*new FrameworkPropertyMetadata(Slider.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Slider.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(Slider.Type); 
    }
	
	Slider.Type = new Type("Slider", Slider, [RangeBase.Type]);
	Initialize();
	
	return TabISlidertem;
});
