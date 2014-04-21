/**
 * TickBar
 */
/// <summary>
/// TickBar is an element that use for drawing Slider's Ticks. 
/// </summary> 
define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement"], 
		function(declare, Type, FrameworkElement){
	var TickBar = declare("TickBar", FrameworkElement, {
		constructor:function(){
		},
		
		/// <summary>
        /// Draw ticks. 
        /// Ticks can be draw in 8 diffrent ways depends on Placment property and IsDirectionReversed property.
        /// 
        /// This function also draw selection-tick(s) if IsSelectionRangeEnabled is 'true' and 
        /// SelectionStart and SelectionEnd are valid.
        /// 
        /// The primary ticks (for Mininum and Maximum value) height will be 100% of TickBar's render size (use Width or Height
        /// depends on Placement property).
        ///
        /// The secondary ticks (all other ticks, including selection-tics) height will be 75% of TickBar's render size. 
        ///
        /// Brush that use to fill ticks is specified by Shape.Fill property. 
        /// 
        /// Pen that use to draw ticks is specified by Shape.Pen property.
        /// </summary> 
//        protected override void 
		OnRender:function(/*DrawingContext*/ dc)
        {
            var size = new Size(ActualWidth,ActualHeight);
            var range = Maximum - Minimum; 
            var tickLen = 0.0d;  // Height for Primary Tick (for Mininum and Maximum value)
            var tickLen2;        // Height for Secondary Tick 
            var logicalToPhysical = 1.0; 
            var progression = 1.0d;
            var startPoint = new Point(0d,0d); 
            var endPoint = new Point(0d, 0d);

            // Take Thumb size in to account
            var halfReservedSpace = ReservedSpace * 0.5; 

            switch(Placement) 
            { 
                case TickBarPlacement.Top:
                    if (DoubleUtil.GreaterThanOrClose(ReservedSpace, size.Width)) 
                    {
                        return;
                    }
                    size.Width -= ReservedSpace; 
                    tickLen = - size.Height;
                    startPoint = new Point(halfReservedSpace, size.Height); 
                    endPoint = new Point(halfReservedSpace + size.Width, size.Height); 
                    logicalToPhysical = size.Width / range;
                    progression = 1; 
                    break;

                case TickBarPlacement.Bottom:
                    if (DoubleUtil.GreaterThanOrClose(ReservedSpace, size.Width)) 
                    {
                        return; 
                    } 
                    size.Width -= ReservedSpace;
                    tickLen = size.Height; 
                    startPoint = new Point(halfReservedSpace, 0d);
                    endPoint = new Point(halfReservedSpace + size.Width, 0d);
                    logicalToPhysical = size.Width / range;
                    progression = 1; 
                    break;
 
                case TickBarPlacement.Left: 
                    if (DoubleUtil.GreaterThanOrClose(ReservedSpace, size.Height))
                    { 
                        return;
                    }
                    size.Height -= ReservedSpace;
                    tickLen = -size.Width; 
                    startPoint = new Point(size.Width, size.Height + halfReservedSpace);
                    endPoint = new Point(size.Width, halfReservedSpace); 
                    logicalToPhysical = size.Height / range * -1; 
                    progression = -1;
                    break; 

                case TickBarPlacement.Right:
                    if (DoubleUtil.GreaterThanOrClose(ReservedSpace, size.Height))
                    { 
                        return;
                    } 
                    size.Height -= ReservedSpace; 
                    tickLen = size.Width;
                    startPoint = new Point(0d, size.Height + halfReservedSpace); 
                    endPoint = new Point(0d, halfReservedSpace);
                    logicalToPhysical = size.Height / range * -1;
                    progression = -1;
                    break; 
            };
 
            tickLen2 = tickLen * 0.75; 

            // Invert direciton of the ticks 
            if (IsDirectionReversed)
            {
                progression = -progression;
                logicalToPhysical *= -1; 

                // swap startPoint & endPoint 
                var pt = startPoint; 
                startPoint = endPoint;
                endPoint = pt; 
            }

            var pen = new Pen(Fill, 1.0d);
 
            var snapsToDevicePixels = SnapsToDevicePixels;
            var xLines = snapsToDevicePixels ? new DoubleCollection() : null; 
            var yLines = snapsToDevicePixels ? new DoubleCollection() : null; 

            // Is it Vertical? 
            if ((Placement == TickBarPlacement.Left) || (Placement == TickBarPlacement.Right))
            {
                // Reduce tick interval if it is more than would be visible on the screen
            	var interval = TickFrequency; 
                if (interval > 0.0)
                { 
                    var minInterval = (Maximum - Minimum) / size.Height; 
                    if (interval < minInterval)
                    { 
                        interval = minInterval;
                    }
                }
 
                // Draw Min & Max tick
                dc.DrawLine(pen, startPoint, new Point(startPoint.X + tickLen, startPoint.Y)); 
                dc.DrawLine(pen, new Point(startPoint.X, endPoint.Y), 
                                 new Point(startPoint.X + tickLen, endPoint.Y));
 
                if (snapsToDevicePixels)
                {
                    xLines.Add(startPoint.X);
                    yLines.Add(startPoint.Y - 0.5); 
                    xLines.Add(startPoint.X + tickLen);
                    yLines.Add(endPoint.Y - 0.5); 
                    xLines.Add(startPoint.X + tickLen2); 
                }
 
                // This property is rarely set so let's try to avoid the GetValue
                // caching of the mutable default value
                /*DoubleCollection*/var ticks = null;
                var hasModifiers; 
                if (GetValueSource(TicksProperty, null, /*out hasModifiers*/hasModifiersOut)
                    != BaseValueSourceInternal.Default || hasModifiers) 
                { 
                    ticks = Ticks;
                } 

                // Draw ticks using specified Ticks collection
                if ((ticks != null) && (ticks.Count > 0))
                { 
                    for (var i = 0; i < ticks.Count; i++)
                    { 
                        if (DoubleUtil.LessThanOrClose(ticks[i],Minimum) || DoubleUtil.GreaterThanOrClose(ticks[i],Maximum)) 
                        {
                            continue; 
                        }

                        var adjustedTick = ticks[i] - Minimum;
 
                        var y = adjustedTick * logicalToPhysical + startPoint.Y;
                        dc.DrawLine(pen, 
                            new Point(startPoint.X, y), 
                            new Point(startPoint.X + tickLen2, y));
 
                        if (snapsToDevicePixels)
                        {
                            yLines.Add(y - 0.5);
                        } 
                    }
                } 
                // Draw ticks using specified TickFrequency 
                else if (interval > 0.0)
                { 
                    for (var i = interval; i < range; i += interval)
                    {
                    	var y = i * logicalToPhysical + startPoint.Y;
 
                        dc.DrawLine(pen,
                            new Point(startPoint.X, y), 
                            new Point(startPoint.X + tickLen2, y)); 

                        if (snapsToDevicePixels) 
                        {
                            yLines.Add(y - 0.5);
                        }
                    } 
                }
 
                // Draw Selection Ticks 
                if (IsSelectionRangeEnabled)
                { 
                	var y0 = (SelectionStart - Minimum) * logicalToPhysical + startPoint.Y;
                	var pt0 = new Point(startPoint.X, y0);
                	var pt1 = new Point(startPoint.X + tickLen2, y0);
                	var pt2 = new Point(startPoint.X + tickLen2, y0 + Math.Abs(tickLen2) * progression); 

                    /*PathSegment[]*/var segments = /*new PathSegment[] {*/[ 
                        new LineSegment(pt2, true), 
                        new LineSegment(pt0, true),
                    ]; 
                    var geo = new PathGeometry(/*new PathFigure[] {*/[ new PathFigure(pt1, segments, true) ]);

                    dc.DrawGeometry(Fill, pen, geo);
 
                    y0 = (SelectionEnd - Minimum) * logicalToPhysical + startPoint.Y;
                    pt0 = new Point(startPoint.X, y0); 
                    pt1 = new Point(startPoint.X + tickLen2, y0); 
                    pt2 = new Point(startPoint.X + tickLen2, y0 - Math.Abs(tickLen2) * progression);
 
                    segments = /*new PathSegment[]*/ [
                        new LineSegment(pt2, true),
                        new LineSegment(pt0, true),
                    ]; 
                    geo = new PathGeometry(/*new PathFigure[]*/ [ new PathFigure(pt1, segments, true) ]);
                    dc.DrawGeometry(Fill, pen, geo); 
                } 
            }
            else  // Placement == Top || Placement == Bottom 
            {
                // Reduce tick interval if it is more than would be visible on the screen
            	var interval = TickFrequency;
                if (interval > 0.0) 
                {
                    var minInterval = (Maximum - Minimum) / size.Width; 
                    if (interval < minInterval) 
                    {
                        interval = minInterval; 
                    }
                }

                // Draw Min & Max tick 
                dc.DrawLine(pen, startPoint, new Point(startPoint.X, startPoint.Y + tickLen));
                dc.DrawLine(pen, new Point(endPoint.X, startPoint.Y), 
                                 new Point(endPoint.X, startPoint.Y + tickLen)); 

                if (snapsToDevicePixels) 
                {
                    xLines.Add(startPoint.X - 0.5);
                    yLines.Add(startPoint.Y);
                    xLines.Add(startPoint.X - 0.5); 
                    yLines.Add(endPoint.Y + tickLen);
                    yLines.Add(endPoint.Y + tickLen2); 
                } 

                // This property is rarely set so let's try to avoid the GetValue 
                // caching of the mutable default value
                /*DoubleCollection*/var ticks = null;
                var hasModifiers;
                if (GetValueSource(TicksProperty, null, /*out hasModifiers*/hasModifiersOut) 
                    != BaseValueSourceInternal.Default || hasModifiers)
                { 
                    ticks = Ticks; 
                }
 
                // Draw ticks using specified Ticks collection
                if ((ticks != null) && (ticks.Count > 0))
                {
                    for (var i = 0; i < ticks.Count; i++) 
                    {
                        if (DoubleUtil.LessThanOrClose(ticks[i],Minimum) || DoubleUtil.GreaterThanOrClose(ticks[i],Maximum)) 
                        { 
                            continue;
                        } 
                        var adjustedTick = ticks[i] - Minimum;

                        var x = adjustedTick * logicalToPhysical + startPoint.X;
                        dc.DrawLine(pen, 
                            new Point(x, startPoint.Y),
                            new Point(x, startPoint.Y + tickLen2)); 
 
                        if (snapsToDevicePixels)
                        { 
                            xLines.Add(x - 0.5);
                        }
                    }
                } 
                // Draw ticks using specified TickFrequency
                else if (interval > 0.0) 
                { 
                    for (var i = interval; i < range; i += interval)
                    { 
                        var x = i * logicalToPhysical + startPoint.X;
                        dc.DrawLine(pen,
                            new Point(x, startPoint.Y),
                            new Point(x, startPoint.Y + tickLen2)); 

                        if (snapsToDevicePixels) 
                        { 
                            xLines.Add(x - 0.5);
                        } 
                    }
                }

                // Draw Selection Ticks 
                if (IsSelectionRangeEnabled)
                { 
                    var x0 = (SelectionStart - Minimum) * logicalToPhysical + startPoint.X; 
                    var pt0 = new Point(x0, startPoint.Y);
                    var pt1 = new Point(x0, startPoint.Y + tickLen2); 
                    var pt2 = new Point(x0 + Math.Abs(tickLen2) * progression, startPoint.Y + tickLen2);

                    /*PathSegment[]*/var segments = /*new PathSegment[] {*/[
                        new LineSegment(pt2, true), 
                        new LineSegment(pt0, true),
                    ]; 
                    /*PathGeometry*/var geo = new PathGeometry(/*new PathFigure[] {*/[ new PathFigure(pt1, segments, true) ]); 

                    dc.DrawGeometry(Fill, pen, geo); 

                    x0 = (SelectionEnd - Minimum) * logicalToPhysical + startPoint.X;
                    pt0 = new Point(x0, startPoint.Y);
                    pt1 = new Point(x0, startPoint.Y + tickLen2); 
                    pt2 = new Point(x0 - Math.Abs(tickLen2) * progression, startPoint.Y + tickLen2);
 
                    segments = /*new PathSegment[] {*/[ 
                        new LineSegment(pt2, true),
                        new LineSegment(pt0, true), 
                    ];
                    geo = new PathGeometry(/*new PathFigure[] {*/[ new PathFigure(pt1, segments, true) ]);
                    dc.DrawGeometry(Fill, pen, geo);
                } 
            }
 
            if (snapsToDevicePixels) 
            {
                xLines.Add(ActualWidth); 
                yLines.Add(ActualHeight);
                VisualXSnappingGuidelines = xLines;
                VisualYSnappingGuidelines = yLines;
            } 
            return;
        }, 
 
//        private void 
        BindToTemplatedParent:function(/*DependencyProperty*/ target, /*DependencyProperty*/ source)
        { 
            if (!HasNonDefaultValue(target))
            {
                var binding = new Binding();
                binding.RelativeSource = RelativeSource.TemplatedParent; 
                binding.Path = new PropertyPath(source);
                SetBinding(target, binding); 
            } 
        },
 
        /// <summary>
        /// TickBar sets bindings on its properties to its TemplatedParent if the
        /// properties are not already set.
        /// </summary> 
//        internal override void 
        OnPreApplyTemplate:function()
        { 
            base.OnPreApplyTemplate(); 

            /*Slider*/var parent = this.TemplatedParent instanceof Slider ? this.TemplatedParent : null; 
            if (parent != null)
            {
                BindToTemplatedParent(TicksProperty, Slider.TicksProperty);
                BindToTemplatedParent(TickFrequencyProperty, Slider.TickFrequencyProperty); 
                BindToTemplatedParent(IsSelectionRangeEnabledProperty, Slider.IsSelectionRangeEnabledProperty);
                BindToTemplatedParent(SelectionStartProperty, Slider.SelectionStartProperty); 
                BindToTemplatedParent(SelectionEndProperty, Slider.SelectionEndProperty); 
                BindToTemplatedParent(MinimumProperty, Slider.MinimumProperty);
                BindToTemplatedParent(MaximumProperty, Slider.MaximumProperty); 
                BindToTemplatedParent(IsDirectionReversedProperty, Slider.IsDirectionReversedProperty);

                if (!HasNonDefaultValue(ReservedSpaceProperty) && parent.Track != null)
                { 
                    var binding = new Binding();
                    binding.Source = parent.Track.Thumb; 
 
                    if (parent.Orientation == Orientation.Horizontal)
                    { 
                        binding.Path = new PropertyPath(Thumb.ActualWidthProperty);
                    }
                    else
                    { 
                        binding.Path = new PropertyPath(Thumb.ActualHeightProperty);
                    } 
 
                    SetBinding(ReservedSpaceProperty, binding);
                } 
            }
        }
	});
	
	Object.defineProperties(TickBar.prototype,{

        /// <summary> 
        /// Fill property 
        /// </summary>
//        public Brush 
		Fill: 
        {
            get:function()
            {
                return this.GetValue(TickBar.FillProperty); 
            },
            set:function(value) 
            { 
            	this.SetValue(TickBar.FillProperty, value);
            } 
        },
        
        /// <summary> 
        ///     Logical position where the Minimum Tick will be drawn
        /// </summary> 
//        public double 
        Minimum:
        { 
            get:function() { return this.GetValue(TickBar.MinimumProperty); },
            set:function(value) { this.SetValue(TickBar.MinimumProperty, value); }
        },
        
      /// <summary> 
        ///     Logical position where the Maximum Tick will be drawn 
        /// </summary>
//        public double
        Maximum:
        {
            get:function() { return this.GetValue(TickBar.MaximumProperty); },
            set:function(value) { this.SetValue(TickBar.MaximumProperty, value); } 
        },
        
        /// <summary>
        ///     Logical position where the SelectionStart Tick will be drawn 
        /// </summary>
//        public double 
        SelectionStart:
        { 
            get:function() { return this.GetValue(TickBar.SelectionStartProperty); },
            set:function(value) { this.SetValue(TickBar.SelectionStartProperty, value); } 
        },
        
        /// <summary>
        ///     Logical position where the SelectionEnd Tick will be drawn
        /// </summary>
//        public double 
        SelectionEnd:
        { 
            get:function() { return this.GetValue(TickBar.SelectionEndProperty); }, 
            set:function(value) { this.SetValue(TickBar.SelectionEndProperty, value); }
        }, 

        /// <summary>
        ///     IsSelectionRangeEnabled specifies whether to draw SelectionStart Tick and SelectionEnd Tick or not. 
        /// </summary>
//        public bool 
        IsSelectionRangeEnabled: 
        {
            get:function() { return this.GetValue(TickBar.IsSelectionRangeEnabledProperty); }, 
            set:function(value) { this.SetValue(TickBar.IsSelectionRangeEnabledProperty, BooleanBoxes.Box(value)); }
        },

        /// <summary>
        /// TickFrequency property defines how the tick will be drawn. 
        /// </summary> 
//        public double 
        TickFrequency: 
        {
            get:function() { return this.GetValue(TickBar.TickFrequencyProperty); },
            set:function(value) { this.SetValue(TickBar.TickFrequencyProperty, value); }
        }, 
 
        /// <summary> 
        /// The Ticks property contains collection of value of type Double which
        /// are the logical positions use to draw the ticks. 
        /// The property value is a <see cref="DoubleCollection" />.
        /// </summary>
//        public DoubleCollection 
        Ticks: 
        {
            get:function() { return this.GetValue(TickBar.TicksProperty); }, 
            set:function(value) { this.SetValue(TickBar.TicksProperty, value); } 
        },

        /// <summary>
        /// The IsDirectionReversed property defines the direction of value incrementation.
        /// By default, if Tick's orientation is Horizontal, ticks will be drawn from left to right. 
        /// (And, bottom to top for Vertical orientation).
        /// If IsDirectionReversed is 'true' the direction of the drawing will be in opposite direction. 
        /// Ticks property contains collection of value of type Double which 
        /// </summary>
//        public bool 
        IsDirectionReversed:
        {
            get:function() { return this.GetValue(TickBar.IsDirectionReversedProperty); },
            set:function(value) { this.SetValue(TickBar.IsDirectionReversedProperty, BooleanBoxes.Box(value)); } 
        },

        /// <summary>
        /// Placement property specified how the Tick will be placed.
        /// This property affects the way ticks are drawn. 
        /// This property has type of <see cref="TickBarPlacement" />.
        /// </summary> 
//        public TickBarPlacement 
        Placement:
        { 
            get:function() { return this.GetValue(TickBar.PlacementProperty); },
            set:function(value) { this.SetValue(TickBar.PlacementProperty, value); }
        },
        
        /// <summary>
        /// TickBar will use ReservedSpaceProperty for left and right spacing (for horizontal orientation) or 
        /// tob and bottom spacing (for vertical orienation).
        /// The space on both sides of TickBar is half of specified ReservedSpace.
        /// This property has type of <see cref="double" />.
        /// </summary> 
//        public double 
        ReservedSpace: 
        { 
            get:function() { return this.GetValue(TickBar.ReservedSpaceProperty); },
            set:function(value) { this.SetValue(TickBar.ReservedSpaceProperty, value); } 
        }
	});
	
	Object.defineProperties(TickBar,{
        /// <summary> 
        /// Fill property
        /// </summary>
//        public static readonly DependencyProperty 
		FillProperty:
        {
        	get:function(){
        		if(Thumb._FillProperty === undefined){
        			Thumb._FillProperty = DependencyProperty.Register( 
        	                "Fill",
        	                Brush.Type, 
        	                TickBar.Type, 
        	                new FrameworkPropertyMetadata(
        	                    null, 
        	                    FrameworkPropertyMetadataOptions.AffectsRender,
        	                    null,
        	                    null)
        	                );  
        		}
        		
        		return Thumb._FillProperty;
        	}
        },
            
        /// <summary>
        ///     The DependencyProperty for the <see cref="Minimum"/> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        MinimumProperty:
        {
        	get:function(){
        		if(Thumb._MinimumProperty === undefined){
        			Thumb._MinimumProperty = 
                        RangeBase.MinimumProperty.AddOwner( 
                                TickBar.Type,
                                new FrameworkPropertyMetadata( 
                                        0.0,
                                        FrameworkPropertyMetadataOptions.AffectsRender));  
        		}
        		
        		return Thumb._MinimumProperty;
        	}
        }, 
        
        /// <summary>
        ///     The DependencyProperty for the <see cref="Maximum"/>  property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        MaximumProperty:
        {
        	get:function(){
        		if(Thumb._MaximumProperty === undefined){
        			Thumb._MaximumProperty =
                        RangeBase.MaximumProperty.AddOwner( 
                                TickBar.Type,
                                new FrameworkPropertyMetadata(
                                        100.0,
                                        FrameworkPropertyMetadataOptions.AffectsRender));  
        		}
        		
        		return Thumb._MaximumProperty;
        	}
        }, 
        
        /// <summary> 
        ///     The DependencyProperty for the <see cref="SelectionStart"/>  property.
        /// </summary> 
//        public static readonly DependencyProperty 
        SelectionStartProperty:
        {
        	get:function(){
        		if(Thumb._SelectionStartProperty === undefined){
        			Thumb._SelectionStartProperty =
                        Slider.SelectionStartProperty.AddOwner(
                                TickBar.Type,
                                new FrameworkPropertyMetadata( 
                                        -1.0,
                                        FrameworkPropertyMetadataOptions.AffectsRender));   
        		}
        		
        		return Thumb._SelectionStartProperty;
        	}
        },
        

        /// <summary> 
        ///     The DependencyProperty for the <see cref="SelectionEnd"/>  property.
        /// </summary>
//        public static readonly DependencyProperty 
        SelectionEndProperty:
        {
        	get:function(){
        		if(Thumb._SelectionEndProperty === undefined){
        			Thumb._SelectionEndProperty =
                        Slider.SelectionEndProperty.AddOwner( 
                                TickBar.Type,
                                new FrameworkPropertyMetadata( 
                                        -1.0, 
                                        FrameworkPropertyMetadataOptions.AffectsRender));  
        		}
        		
        		return Thumb._SelectionEndProperty;
        	}
        }, 
        
        /// <summary> 
        /// DependencyProperty for <see cref="TickFrequency" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        TickFrequencyProperty:
        {
        	get:function(){
        		if(Thumb._TickFrequencyProperty === undefined){
        			Thumb._TickFrequencyProperty = 
                        Slider.TickFrequencyProperty.AddOwner(
                                TickBar.Type, 
                                new FrameworkPropertyMetadata(
                                        1.0,
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return Thumb._TickFrequencyProperty;
        	}
        }, 
        
        /// <summary>
        ///     The DependencyProperty for the <see cref="IsSelectionRangeEnabled"/>  property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsSelectionRangeEnabledProperty:
        {
        	get:function(){
        		if(Thumb._IsSelectionRangeEnabledProperty === undefined){
        			Thumb._IsSelectionRangeEnabledProperty =
                        Slider.IsSelectionRangeEnabledProperty.AddOwner( 
                                TickBar.Type, 
                                new FrameworkPropertyMetadata(
                                        BooleanBoxes.FalseBox, 
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return Thumb._IsSelectionRangeEnabledProperty;
        	}
        }, 

        /// <summary> 
        /// DependencyProperty for <see cref="Ticks" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        TicksProperty:
        {
        	get:function(){
        		if(Thumb._TicksProperty === undefined){
        			Thumb._TicksProperty = 
                        Slider.TicksProperty.AddOwner(
                                TickBar.Type,
                                new FrameworkPropertyMetadata(
                                        new FreezableDefaultValueFactory(DoubleCollection.Empty), 
                                        FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return Thumb._TicksProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for IsDirectionReversed property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsDirectionReversedProperty:
        {
        	get:function(){
        		if(Thumb._IsDirectionReversedProperty === undefined){
        			Thumb._IsDirectionReversedProperty = 
                        Slider.IsDirectionReversedProperty.AddOwner(
                                TickBar.Type, 
                                new FrameworkPropertyMetadata( 
                                        BooleanBoxes.FalseBox,
                                        FrameworkPropertyMetadataOptions.AffectsRender));  
        		}
        		
        		return Thumb._IsDirectionReversedProperty;
        	}
        },  
        
        /// <summary> 
        /// DependencyProperty for <see cref="Placement" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        PlacementProperty:
        {
        	get:function(){
        		if(Thumb._PlacementProperty === undefined){
        			Thumb._PlacementProperty =
                        DependencyProperty.Register(
                                "Placement",
                                Number.Type, 
                                TickBar.Type,
                                new FrameworkPropertyMetadata( 
                                        TickBarPlacement.Top, 
                                        FrameworkPropertyMetadataOptions.AffectsRender),
                                new ValidateValueCallback(IsValidTickBarPlacement));   
        		}
        		
        		return Thumb._PlacementProperty;
        	}
        }, 
        
        /// <summary>
        /// DependencyProperty for ReservedSpace property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        ReservedSpaceProperty:
        {
        	get:function(){
        		if(Thumb._ReservedSpaceProperty === undefined){
        			Thumb._ReservedSpaceProperty =
                        DependencyProperty.Register( 
                                "ReservedSpace",
                                Number.Type,
                                TickBar.Type,
                                new FrameworkPropertyMetadata( 
                                        0,
                                        FrameworkPropertyMetadataOptions.AffectsRender));  
        		}
        		
        		return Thumb._ReservedSpaceProperty;
        	}
        },  
	});
	
//	private static bool 
	function IsValidTickBarPlacement(/*object*/ o)
    { 
        TickBarPlacement placement = (TickBarPlacement)o; 
        return placement == TickBarPlacement.Left ||
               placement == TickBarPlacement.Top || 
               placement == TickBarPlacement.Right ||
               placement == TickBarPlacement.Bottom;
    }
	
//    static TickBar() 
	function Initialize()
    {
        SnapsToDevicePixelsProperty.OverrideMetadata(TickBar.Type, new FrameworkPropertyMetadata(true));
    }
	
	TickBar.Type = new Type("TickBar", TickBar, [FrameworkElement.Type]);
	return TickBar;
});

