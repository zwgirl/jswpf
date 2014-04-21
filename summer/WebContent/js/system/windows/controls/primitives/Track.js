/**
 * Track
 */
/// <summary> 
/// Track handles layout of the parts of a ScrollBar and Slider.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement"], 
		function(declare, Type, FrameworkElement){
	var Track = declare("Track", FrameworkElement,{
		constructor:function(){
			
//	        private RepeatButton 
	        this._increaseButton = null;
//	        private RepeatButton 
	        this._decreaseButton = null;
//	        private Thumb 
	        this._thumb = null;
//	        private Visual[] _visualChildren; 
	//
//	        // Density of scrolling units present in 1/96" of track (not thumb).  Computed during ArrangeOverride. 
//	        // Note that density default really *is* NaN.  This corresponds to no track having been computed/displayed. 
//	        private double 
	        this._density = Number.NaN;
//	        private double 
	        this._thumbCenterOffset = Number.NaN; 
		},
		
		/// <summary> 
        /// Calculate the value from given Point. The input point is relative to TopLeft conner of Track.
        /// </summary> 
        /// <param name="pt">Point (in Track's co-ordinate).</param> 
//        public virtual double 
		ValueFromPoint:function(/*Point*/ pt)
        { 
            var val;
            // Find distance from center of thumb to given point.
            if (this.Orientation == Orientation.Horizontal)
            { 
                val = this.Value + this.ValueFromDistance(pt.X - this.ThumbCenterOffset, pt.Y - (this.RenderSize.Height * 0.5));
            } 
            else 
            {
                val = this.Value + this.ValueFromDistance(pt.X - (this.RenderSize.Width * 0.5), pt.Y - this.ThumbCenterOffset); 
            }
            return Math.max(this.Minimum, Math.min(this.Maximum, val));
        },
 
        /// <summary>
        /// This function returns the delta in value that would be caused by moving the thumb the given pixel distances. 
        /// The returned delta value is not guaranteed to be inside the valid Value range. 
        /// </summary>
        /// <param name="horizontal">Total horizontal distance that the Thumb has moved.</param> 
        /// <param name="vertical">Total vertical distance that the Thumb has moved.</param>
//        public virtual double 
        ValueFromDistance:function(/*double*/ horizontal, /*double*/ vertical)
        {
            var scale = this.IsDirectionReversed ? -1 : 1; 
            //
            // Note: To implement 'Snap-Back' feature, we could check whether the point is far away from center of the track. 
            // If so, just return current value (this should move the Thumb back to its original localtion). 
            //
            if (this.Orientation == Orientation.Horizontal) 
            {
                return scale * horizontal * this.Density;
            }
            else 
            {
                // Increases in y cause decreases in Sliders value 
                return -1 * scale * vertical * this.Density; 
            }
        },

//        private void 
        UpdateComponent:function(/*Control*/ oldValue, /*Control*/ newValue)
        { 
            if (oldValue != newValue)
            { 
                if (this._visualChildren == null) 
                {
                	this._visualChildren = new Visual[3]; 
                }

                if (oldValue != null)
                { 
                    // notify the visual layer that the old component has been removed.
                	this.RemoveVisualChild(oldValue); 
                } 

                // Remove the old value from our z index list and add new value to end 
                var i = 0;
                while (i < 3)
                {
                    // Array isn't full, break 
                    if (this._visualChildren[i] == null)
                        break; 
 
                    // found the old value
                    if (this._visualChildren[i] == oldValue) 
                    {
                        // Move values down until end of array or a null element
                        while (i < 2 && this._visualChildren[i + 1] != null)
                        { 
                        	this._visualChildren[i] = this._visualChildren[i + 1];
                            i++; 
                        } 
                    }
                    else 
                    {
                        i++;
                    }
                } 
                // Add newValue at end of z-order
                this._visualChildren[i] = newValue; 
 
                this.AddVisualChild(newValue);
 
                this.InvalidateMeasure();
                this.InvalidateArrange();
            }
        },
        
        /// <summary>
        ///   Derived class must implement to support Visual children. The method must return 
        ///    the child at the specified index. Index must be between 0 and GetVisualChildrenCount-1.
        ///
        ///    By default a Visual does not have any children.
        /// 
        ///  Remark:
        ///       During this virtual call it is not valid to modify the Visual tree. 
        /// </summary> 
//        protected override Visual 
        GetVisualChild:function(/*int*/ index)
        { 
            if (this._visualChildren == null || this._visualChildren[index] == null)
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
            } 
            return this._visualChildren[index];
        }, 

        /// <summary>
        /// The desired size of a Track is the width (if vertically oriented) or height (if horizontally 
        /// oriented) of the Thumb.
        /// 
        /// When ViewportSize is NaN: 
        ///    The thumb is measured to find the other dimension.
        /// Otherwise: 
        ///    Zero size is returned; Track can scale to any size along its children.
        ///    This means that it will occupy no space (and not display) unless made larger by a parent or specified size.
        /// <seealso cref="FrameworkElement.MeasureOverride" />
        /// </summary> 
//        protected override Size 
        MeasureOverride:function(/*Size*/ availableSize)
        { 
//            Size desiredSize = new Size(0.0, 0.0); 

            // Only measure thumb 
            // Repeat buttons will be sized based on thumb
            if (this.Thumb != null)
            {
            	this.Thumb.Measure(availableSize); 
                desiredSize = Thumb.DesiredSize;
            } 
 
            if (!Number.IsNaN(this.ViewportSize))
            { 
                // ScrollBar can shrink to 0 in the direction of scrolling
                if (this.Orientation == Orientation.Vertical)
                    desiredSize.Height = 0.0;
                else 
                    desiredSize.Width = 0.0;
            } 
 
//            return desiredSize;
        },
        
      /// <summary> 
        /// Children will be stretched to fit horizontally (if vertically oriented) or vertically (if horizontally 
        /// oriented).
        /// 
        /// There are essentially three possible layout states:
        /// 1. The track is enabled and the thumb is proportionally sizing.
        /// 2. The track is enabled and the thumb has reached its minimum size.
        /// 3. The track is disabled or there is not enough room for the thumb. 
        ///    Track elements are not displayed, and will not be arranged.
        /// <seealso cref="FrameworkElement.ArrangeOverride" /> 
        /// </summary> 
//        protected override Size 
        ArrangeOverride:function(/*Size*/ arrangeSize)
        { 
            var decreaseButtonLength = 0, thumbLength = 0, increaseButtonLength = 0;
            
            var decreaseButtonLengthOut = {"decreaseButtonLength" : decreaseButtonLength};
            var thumbLengthOut = {"thumbLength" : thumbLength};
            var increaseButtonLengthOut = {"increaseButtonLength" : increaseButtonLength};

            var isVertical = (this.Orientation == Orientation.Vertical);
 

            var viewportSize = Math.max(0.0, this.ViewportSize); 
 
            // If viewport is NaN, compute thumb's size based on its desired size,
            // otherwise compute the thumb base on the viewport and extent properties 
            if (Number.IsNaN(viewportSize))
            {
            	this.ComputeSliderLengths(arrangeSize, isVertical, 
            			decreaseButtonLengthOut/*out decreaseButtonLength*/, thumbLengthOut/*out thumbLength*/, 
            			increaseButtonLengthOut/*out increaseButtonLength*/);
               	decreaseButtonLength=decreaseButtonLengthOut.decreaseButtonLength;
            	thumbLength=thumbLengthOut.thumbLength;
            	increaseButtonLength=increaseButtonLengthOut.increaseButtonLength;
            } 
            else
            { 
            	var result = this.ComputeScrollBarLengths(arrangeSize, viewportSize, isVertical, 
                		decreaseButtonLengthOut/*out decreaseButtonLength*/, thumbLengthOut/*out thumbLength*/, 
                		increaseButtonLengthOut/*out increaseButtonLength*/);
            	decreaseButtonLength=decreaseButtonLengthOut.decreaseButtonLength;
            	thumbLength=thumbLengthOut.thumbLength;
            	increaseButtonLength=increaseButtonLengthOut.increaseButtonLength;
            	
                // Don't arrange if there's not enough content or the track is too small 
                if (!result)
                { 
                    return arrangeSize;
                }
            }
 
            // Layout the pieces of track
 
            var offset = new Point(); 
            var pieceSize = arrangeSize;
            var isDirectionReversed = IsDirectionReversed; 

            if (isVertical)
            {
                // Vertical Normal   :    |Inc Button | 
                //                        |Thumb      |
                //                        |Dec Button | 
                // Vertical Reversed :    |Dec Button | 
                //                        |Thumb      |
                //                        |Inc Button | 

                CoerceLength(/*ref decreaseButtonLength*/decreaseButtonLengthOut, arrangeSize.Height);
                decreaseButtonLength = decreaseButtonLengthOut.decreaseButtonLength;
                
                CoerceLength(/*ref increaseButtonLength*/increaseButtonLengthOut, arrangeSize.Height);
                increaseButtonLength = increaseButtonLengthOut.increaseButtonLength;
                
                CoerceLength(/*ref thumbLength*/thumbLengthOut, arrangeSize.Height); 
                thumbLength = thumbLengthOut.thumbLength;

                offset.Y = isDirectionReversed ? decreaseButtonLength + thumbLength : 0.0; 
                pieceSize.Height = increaseButtonLength; 

                if (IncreaseRepeatButton != null) 
                    IncreaseRepeatButton.Arrange(new Rect(offset, pieceSize));


                offset.Y = isDirectionReversed ? 0.0 : increaseButtonLength + thumbLength; 
                pieceSize.Height = decreaseButtonLength;
 
                if (DecreaseRepeatButton != null) 
                    DecreaseRepeatButton.Arrange(new Rect(offset, pieceSize));
 

                offset.Y = isDirectionReversed ? decreaseButtonLength : increaseButtonLength;
                pieceSize.Height = thumbLength;
 
                if (this.Thumb != null)
                	this.Thumb.Arrange(new Rect(offset, pieceSize)); 
 
                this.ThumbCenterOffset = offset.Y + (thumbLength * 0.5);
            } 
            else
            {
                // Horizontal Normal   :    |Dec Button |Thumb| Inc Button|
                // Horizontal Reversed :    |Inc Button |Thumb| Dec Button| 

                CoerceLength(/*ref decreaseButtonLength*/decreaseButtonLengthOut, arrangeSize.Width); 
                decreaseButtonLength = decreaseButtonLengthOut.decreaseButtonLength;
                
                CoerceLength(/*ref increaseButtonLength*/increaseButtonLengthOut, arrangeSize.Width); 
                increaseButtonLength = increaseButtonLengthOut.increaseButtonLength;
                
                CoerceLength(/*ref thumbLength*/thumbLengthOut, arrangeSize.Width);
                thumbLength = thumbLengthOut.thumbLength;
 
                offset.X = isDirectionReversed ? increaseButtonLength + thumbLength : 0.0;
                pieceSize.Width = decreaseButtonLength;

                if (this.DecreaseRepeatButton != null) 
                	this.DecreaseRepeatButton.Arrange(new Rect(offset, pieceSize));
 
 
                offset.X = isDirectionReversed ? 0.0 : decreaseButtonLength + thumbLength;
                pieceSize.Width = increaseButtonLength; 

                if (this.IncreaseRepeatButton != null)
                	this.IncreaseRepeatButton.Arrange(new Rect(offset, pieceSize));
 

                offset.X = isDirectionReversed ? increaseButtonLength : decreaseButtonLength; 
                pieceSize.Width = thumbLength; 

                if (this.Thumb != null) 
                	this.Thumb.Arrange(new Rect(offset, pieceSize));

                this.ThumbCenterOffset = offset.X + (thumbLength * 0.5);
            } 

            return arrangeSize; 
        }, 

 
        // Computes the length of the decrease button, thumb and increase button
        // Thumb's size is based on it's desired size
//        private void 
        ComputeSliderLengths:function(/*Size*/ arrangeSize, /*bool*/ isVertical, 
        		/*out double decreaseButtonLength*/decreaseButtonLengthOut, /*out double thumbLength*/thumbLengthOut, 
        		/*out double increaseButtonLength*/increaseButtonLengthOut)
        { 
            var min = this.Minimum;
            var range = Math.max(0.0, this.Maximum - min); 
            var offset = Math.min(range, this.Value - min); 

            var trackLength; 

            // Compute thumb size
            if (isVertical)
            { 
                trackLength = arrangeSize.Height;
                thumbLength = Thumb == null ? 0 : this.Thumb.DesiredSize.Height; 
            } 
            else
            { 
                trackLength = arrangeSize.Width;
                thumbLengthOut.thumbLength = Thumb == null ? 0 : this.Thumb.DesiredSize.Width;
            }
 
            CoerceLength(/*ref thumbLength*/thumbLengthOut, trackLength);
 
            var remainingTrackLength = trackLength - thumbLength; 

            decreaseButtonLength = remainingTrackLength * offset / range; 
            CoerceLength(/*ref decreaseButtonLength*/decreaseButtonLengthOut, remainingTrackLength);

            increaseButtonLength = remainingTrackLength - decreaseButtonLength;
            CoerceLength(/*ref increaseButtonLength*/increaseButtonLengthOut, remainingTrackLength); 

//            Debug.Assert(decreaseButtonLength >= 0.0 && decreaseButtonLength <= remainingTrackLength, "decreaseButtonLength is outside bounds"); 
//            Debug.Assert(increaseButtonLength >= 0.0 && increaseButtonLength <= remainingTrackLength, "increaseButtonLength is outside bounds"); 

            this.Density = range / remainingTrackLength; 
        },

        // Computes the length of the decrease button, thumb and increase button
        // Thumb's size is based on viewport and extent 
        // returns false if the track should be hidden
//        private bool 
        ComputeScrollBarLengths:function(/*Size*/ arrangeSize, /*double*/ viewportSize, /*bool*/ isVertical, 
        		/*out double decreaseButtonLength*/decreaseButtonLengthOut, 
        		/*out double thumbLength*/thumbLengthOut, /*out double increaseButtonLength*/increaseButtonLengthOut) 
        { 
            var min = Minimum;
            var range = Math.Max(0.0, Maximum - min); 
            var offset = Math.Min(range, Value - min);

//            Debug.Assert(DoubleUtil.GreaterThanOrClose(offset, 0.0), "Invalid offest (negative value).");
 
            var extent = Math.Max(0.0, range) + viewportSize;
 
            var trackLength; 

            // Compute thumb size 
            var thumbMinLength;
            if (isVertical)
            {
                trackLength = arrangeSize.Height; 
                // Try to use the apps resource if it exists, fall back to SystemParameters if it doesn't
                var buttonHeightResource = TryFindResource(SystemParameters.VerticalScrollBarButtonHeightKey); 
                var buttonHeight = buttonHeightResource instanceof double ? buttonHeightResource : SystemParameters.VerticalScrollBarButtonHeight; 
                thumbMinLength = Math.Floor(buttonHeight * 0.5);
            } 
            else
            {
                trackLength = arrangeSize.Width;
                // Try to use the apps resource if it exists, fall back to SystemParameters if it doesn't 
                var buttonWidthResource = TryFindResource(SystemParameters.HorizontalScrollBarButtonWidthKey);
                var buttonWidth = buttonWidthResource instanceof double ? buttonWidthResource : SystemParameters.HorizontalScrollBarButtonWidth; 
                thumbMinLength = Math.Floor(buttonWidth * 0.5); 
            }
 
            thumbLength =  trackLength * viewportSize / extent;
            CoerceLength(/*ref thumbLength*/thumbLengthOut, trackLength);

            thumbLength = Math.Max(thumbMinLength, thumbLength); 

 
            // If we don't have enough content to scroll, disable the track. 
            var notEnoughContentToScroll = DoubleUtil.LessThanOrClose(range, 0.0);
            var thumbLongerThanTrack = thumbLength > trackLength; 

            // if there's not enough content or the thumb is longer than the track,
            // hide the track and don't arrange the pieces
            if (notEnoughContentToScroll || thumbLongerThanTrack) 
            {
                if (this.Visibility != Visibility.Hidden) 
                { 
                	this.Visibility = Visibility.Hidden;
                } 

                this.ThumbCenterOffset = Number.NaN;
                this.Density = Double.NaN;
                decreaseButtonLength = 0.0; 
                increaseButtonLength = 0.0;
                return false; // don't arrange 
            } 
            else if (this.Visibility != Visibility.Visible)
            { 
            	this.Visibility = Visibility.Visible;
            }

            // Compute lengths of increase and decrease button 
            var remainingTrackLength = trackLength - thumbLength;
            decreaseButtonLength = remainingTrackLength * offset / range; 
            CoerceLength(/*ref decreaseButtonLength*/decreaseButtonLengthOut, remainingTrackLength); 

            increaseButtonLength = remainingTrackLength - decreaseButtonLength; 
            CoerceLength(/*ref increaseButtonLength*/increaseButtonLengthOut, remainingTrackLength);

            this.Density = range / remainingTrackLength;
 
            return true;
        },
 

        // Bind track to templated parent 
//        private void 
        BindToTemplatedParent:function(/*DependencyProperty*/ target, /*DependencyProperty*/ source)
        {
            if (!this.HasNonDefaultValue(target))
            { 
                var binding = new Binding();
                binding.RelativeSource = RelativeSource.TemplatedParent; 
                binding.Path = new PropertyPath(source); 
                SetBinding(target, binding);
            } 
        },

        // Bind thumb or repeat button to templated parent
//        private void 
        BindChildToTemplatedParent:function(/*FrameworkElement*/ element, /*DependencyProperty*/ target, /*DependencyProperty*/ source) 
        {
            if (element != null && !element.HasNonDefaultValue(target)) 
            { 
                var binding = new Binding();
                binding.Source = this.TemplatedParent; 
                binding.Path = new PropertyPath(source);
                element.SetBinding(target, binding);
            }
        }, 

        /// <summary> 
        /// Track automatically sets bindings to its templated parent 
        /// to aid styling
        /// </summary> 
//        internal override void 
        OnPreApplyTemplate:function()
        {
        	FrameworkElement.prototype.OnPreApplyTemplate.call(this);
 
            var rangeBase = this.TemplatedParent instanceof RangeBase ? this.TemplatedParent : null;
 
            if (rangeBase != null) 
            {
                BindToTemplatedParent(Track.MinimumProperty, RangeBase.MinimumProperty); 
                BindToTemplatedParent(Track.MaximumProperty, RangeBase.MaximumProperty);
                BindToTemplatedParent(Track.ValueProperty, RangeBase.ValueProperty);

                // Setup ScrollBar specific bindings 
                /*ScrollBar*/var scrollBar = rangeBase instanceof ScrollBar ? rangeBase : null;
 
                if (scrollBar != null) 
                {
                    BindToTemplatedParent(Track.ViewportSizeProperty, ScrollBar.ViewportSizeProperty); 
                    BindToTemplatedParent(Track.OrientationProperty, ScrollBar.OrientationProperty);
                }
                else
                { 
                    // Setup Slider specific bindings
                    Slider slider = rangeBase instanceof Slider ? rangeBase : null; 
 
                    if (slider != null)
                    { 
                        BindToTemplatedParent(Track.OrientationProperty, Slider.OrientationProperty);
                        BindToTemplatedParent(Track.IsDirectionReversedProperty, Slider.IsDirectionReversedProperty);

                        BindChildToTemplatedParent(DecreaseRepeatButton, RepeatButton.DelayProperty, Slider.DelayProperty); 
                        BindChildToTemplatedParent(DecreaseRepeatButton, RepeatButton.IntervalProperty, Slider.IntervalProperty);
                        BindChildToTemplatedParent(IncreaseRepeatButton, RepeatButton.DelayProperty, Slider.DelayProperty); 
                        BindChildToTemplatedParent(IncreaseRepeatButton, RepeatButton.IntervalProperty, Slider.IntervalProperty); 
                    }
                } 
            }
        },
        
	});
	
	Object.defineProperties(Track.prototype,{
		/// <summary> 
        /// The RepeatButton used to decrease the Value 
        /// </summary>
//        public RepeatButton 
		DecreaseRepeatButton: 
        {
            get:function()
            {
                return this._decreaseButton; 
            },
            set:function(value) 
            { 
                if (this._increaseButton == value)
                { 
                    throw new NotSupportedException(SR.Get(SRID.Track_SameButtons));
                }
                this.UpdateComponent(this._decreaseButton, value);
                this._decreaseButton = value; 

                if (this._decreaseButton != null) 
                { 
                    CommandManager.InvalidateRequerySuggested(); // Should post an idle queue item to update IsEnabled on button
                } 
            }
        },

        /// <summary> 
        /// The Thumb in the Track
        /// </summary> 
//        public Thumb
        Thumb:
        {
            get:function() 
            {
                return this._thumb;
            },
            set:function(value) 
            {
            	this.UpdateComponent(this._thumb, value); 
            	this._thumb = value; 
            }
        }, 

        /// <summary>
        /// The RepeatButton used to increase the Value
        /// </summary> 
//        public RepeatButton 
        IncreaseRepeatButton:
        { 
            get:function() 
            {
                return this._increaseButton; 
            },
            set:function(value)
            {
                if (this._decreaseButton == value) 
                {
                    throw new NotSupportedException(SR.Get(SRID.Track_SameButtons)); 
                } 
                this.UpdateComponent(_increaseButton, value);
                this._increaseButton = value; 

                if (this._increaseButton != null)
                {
                    CommandManager.InvalidateRequerySuggested(); // Should post an idle queue item to update IsEnabled on button 
                }
            } 
        },
        /// <summary> 
        /// This property represents the Track layout orientation: Vertical or Horizontal.
        /// On vertical ScrollBars, the thumb moves up and down.  On horizontal bars, the thumb moves left to right.
        /// </summary>
//        public Orientation 
        Orientation: 
        {
            get:function() { return this.GetValue(Track.OrientationProperty); }, 
            set:function(value) { this.SetValue(Track.OrientationProperty, value); } 
        },
        
        /// <summary>
        /// The Minimum value of the Slider or ScrollBar
        /// </summary>
//        public double 
        Minimum: 
        {
            get:function() { return this.GetValue(Track.MinimumProperty); }, 
            set:function(value) { this.SetValue(Track.MinimumProperty, value); } 
        },
        
      /// <summary>
        /// The Maximum value of the Slider or ScrollBar
        /// </summary>
//        public double 
        Maximum: 
        {
            get:function() { return this.GetValue(Track.MaximumProperty); }, 
            set:function(value) { this.SetValue(Track.MaximumProperty, value); } 
        },
        
        /// <summary>
        /// The current value of the Slider or ScrollBar
        /// </summary>
//        public double 
        Value: 
        {
            get:function() { return this.GetValue(Track.ValueProperty); }, 
            set:function(value) { this.SetValue(Track.ValueProperty, value); } 
        },

        /// <summary> 
        /// ViewportSize is the amount of the scrolled extent currently visible.  For most scrolled content, this value
        /// will be bound to one of <see cref="ScrollViewer" />'s ViewportSize properties. 
        /// This property is in logical scrolling units. 
        ///
        /// Setting this value to NaN will turn off automatic sizing of the thumb 
        /// </summary>
//        public double 
        ViewportSize:
        {
            get:function() { return this.GetValue(Track.ViewportSizeProperty); }, 
            set:function(value) { this.SetValue(Track.ViewportSizeProperty, value); }
        },
        
        /// <summary> 
        /// Indicates if the location of the DecreaseRepeatButton and IncreaseRepeatButton
        /// should be swapped. 
        /// </summary>
//        public bool 
        IsDirectionReversed:
        {
            get:function() { return this.GetValue(Track.IsDirectionReversedProperty); }, 
            set:function(value) { this.SetValue(Track.IsDirectionReversedProperty, value); }
        },
        
        /// <summary>
        ///  Derived classes override this property to enable the Visual code to enumerate 
        ///  the Visual children. Derived classes need to return the number of children
        ///  from this method.
        ///
        ///    By default a Visual does not have any children. 
        ///
        ///  Remark: During this virtual method the Visual tree must not be modified. 
        /// </summary> 
//        protected override int 
        VisualChildrenCount:
        { 
            get:function()
            {
                if (this._visualChildren == null || this._visualChildren[0] == null)
                { 
//                    Debug.Assert(_visualChildren == null || _visualChildren[1] == null, "Child[1] should be null if Child[0] == null)");
//                    Debug.Assert(_visualChildren == null || _visualChildren[2] == null, "Child[2] should be null if Child[0] == null)"); 
                    return 0; 
                }
                else if (this._visualChildren[1] == null) 
                {
//                    Debug.Assert(_visualChildren[2] == null, "Child[2] should be null if Child[1] == null)");
                    return 1;
                } 
                else
                { 
                    return this._visualChildren[2] == null ? 2 : 3; 
                }
            } 
        },
        
//        private double 
        ThumbCenterOffset: 
        { 
            get:function() { return this._thumbCenterOffset; },
            set:function(value) { this._thumbCenterOffset = value; } 
        },
//        private double 
        Density:
        {
            get:function() { return this._density; }, 
            set:function(value) { this._density = value; }
        }
	});
	
	Object.defineProperties(Track,{
        /// <summary> 
        /// DependencyProperty for <see cref="Orientation" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		OrientationProperty:
        {
        	get:function(){
        		if(Track._OrientationProperty === undefined){
        			Track._OrientationProperty = 
                        DependencyProperty.Register("Orientation", Number.Type, Track.Type,
                                /*new FrameworkPropertyMetadata(Orientation.Horizontal, FrameworkPropertyMetadataOptions.AffectsMeasure)*/
                        		FrameworkPropertyMetadata.Build2(Orientation.Horizontal, FrameworkPropertyMetadataOptions.AffectsMeasure), 
                                new ValidateValueCallback(null, ScrollBar.IsValidOrientation)); 
        		}
        		
        		return Track._OrientationProperty;
        	}
        },  
        /// <summary>
        /// DependencyProperty for <see cref="Minimum" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		MinimumProperty:
        {
        	get:function(){
        		if(Track._MinimumProperty === undefined){
        			Track._MinimumProperty = 
                        RangeBase.MinimumProperty.AddOwner(Track.Type, 
                                /*new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.AffectsArrange)*/
                        		FrameworkPropertyMetadata.Build2(0, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        		}
        		
        		return Track._MinimumProperty;
        	}
        }, 
        /// <summary>
        /// DependencyProperty for <see cref="Maximum" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		MaximumProperty:
        {
        	get:function(){
        		if(Track._MaximumProperty === undefined){
        			Track._MaximumProperty = 
                        RangeBase.MaximumProperty.AddOwner(Track.Type, 
                                /*new FrameworkPropertyMetadata(1, FrameworkPropertyMetadataOptions.AffectsArrange)*/
                        		FrameworkPropertyMetadata.Build2(1, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        		}
        		
        		return Track._MaximumProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for <see cref="Value" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		ValueProperty:
        {
        	get:function(){
        		if(Track._ValueProperty === undefined){
        			Track._ValueProperty = 
                        RangeBase.ValueProperty.AddOwner(Track.Type, 
                                /*new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault
                                		| FrameworkPropertyMetadataOptions.AffectsArrange)*/
                        		FrameworkPropertyMetadata.Build2(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault
                                		| FrameworkPropertyMetadataOptions.AffectsArrange)); 
        		}
        		
        		return Track._ValueProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for <see cref="ViewportSize" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		ViewportSizeProperty:
        {
        	get:function(){
        		if(Track._ViewportSizeProperty === undefined){
        			Track._ViewportSizeProperty = 
                        DependencyProperty.Register("ViewportSize", 
                                Number.Type,
                                Track.Type, 
                                /*new FrameworkPropertyMetadata(Number.NaN, FrameworkPropertyMetadataOptions.AffectsArrange)*/
                                FrameworkPropertyMetadata.Build2(Number.NaN, FrameworkPropertyMetadataOptions.AffectsArrange),
                                new ValidateValueCallback(null, IsValidViewport)); 
        		}
        		
        		return Track._ViewportSizeProperty;
        	}
        }, 
        /// <summary> 
        /// DependencyProperty for <see cref="IsDirectionReversed" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		IsDirectionReversedProperty:
        {
        	get:function(){
        		if(Track._IsDirectionReversedProperty === undefined){
        			Track._IsDirectionReversedProperty =
                        DependencyProperty.Register("IsDirectionReversed",
                                Boolean.Type,
                                Track.Type, 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return Track._IsDirectionReversedProperty;
        	}
        }
 
	});
	
//    private static bool 
	function IsValidViewport(/*object*/ o)
    { 
//        double d = (double)o;
        return o >= 0.0 || Number.IsNaN(o);
    }
    
 // Force length of one of track's pieces to be > 0 and less than tracklength
//    private static void 
	function CoerceLength(/*ref double componentLength*/componentLengthRef, /*double*/ trackLength)
    { 
        if (componentLengthRef.componentLength < 0)
        { 
        	componentLengthRef.componentLength = 0.0; 
        }
        else if (componentLengthRef.componentLength > trackLength || Number.IsNaN(componentLength)) 
        {
        	componentLengthRef.componentLength = trackLength;
        }
    } 
    
//    private static void 
	function OnIsEnabledChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        // When IsEnabled of UIElement changes the InputManager.HitTestInvalidatedAsync is
        // queued to be executed at input priority. This execution will eventually call Mouse.Synchronize 
        // which may result in addition of new elements to the route of routed events from that moment.
        // Tracks are usually associated with triggers which enables them when IsMouseOver is true.
        // A combination of all these works good for Mouse and pen based stylus, because MouseMoves are generated
        // beforehand independent of respective 'Down' events due to firsthand Mouse moves/ InRange pen moves, 
        // and hence HitTestInvalidatedAsync gets executed much before the 'Down' event appears. This is not true for
        // Touch because there is no equivalent of InRange pen moves in touch. 
        // 
        //  Pen based event flow
        //      StylusInRange 
        //          |
        //          V
        //      StylusMove --> Generates a Mouse Move --> enqueues HitTestInvalidatedAsync
        //          | 
        //          V
        //      HitTestInvalidatedAsync (an input priority dispactcher operation) 
        //          | 
        //          V
        //      StylusDown --> Generates MouseDown (at this moment Track is already in the route) 
        //
        //
        //  Finger based event flow
        //      StylusDown --> Generates a Mouse Move (to [....] the cursor) --> enqueues HitTestInvalidatedAsync --> Followed by TouchDown --> Followed by MouseDown 
        //          |
        //          V 
        //      HitTestInvalidatedAsync (an input priority dispactcher operation) 
        //
        // 
        // Note that in pen based stylus, the HitTestInvalidatedAsync gets executed before the MouseDown, and hence the track is
        // included into its route and things work fine. Where as in finger based stylus, since the MouseMove is generated due to
        // StylusDown, HitTestInvalidateAsync (which is the next operation in the queue) doesnt get executed till after MouseDown is routed
        // (which happens in the same dispatcher operation) and hence the Track doesn't get included into the route of MouseDown and things dont work. 
        // The fix here is to do the Mouse.Synchronize ourselves synchrounously when IsEnabled of Track changes, instead of waiting
        // for the next input dispatcher operation to happen. 
        if (e.NewValue) 
        {
            Mouse.Synchronize(); 
        }
    }
//    static Track() 
	function Initialize()
    {
        UIElement.IsEnabledProperty.OverrideMetadata(Track.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnIsEnabledChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnIsEnabledChanged)));
    }
	
	Track.Type = new Type("Track", Track, [FrameworkElement.Type]);
	return Track;
});
