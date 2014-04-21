/**
 * ScrollBar
 */

define(["dojo/_base/declare", "system/Type", "primitives/RangeBase"], function(declare, Type, RangeBase){
	
    /// <summary>
    /// Type of scrolling that causes ScrollEvent.
    /// </summary>
//    public enum 
    var ScrollEventType = declare(Object, {});
    /// Thumb has stopped moving. 
    ScrollEventType.EndScroll = 0; 
    /// Thumb was moved to the Minimum position.
    ScrollEventType.First = 1; 
    /// Thumb was moved a large distance. The user clicked the scroll bar to the left(horizontal) or above(vertical) the scroll box. 
    ScrollEventType.LargeDecrement = 2;
    /// Thumb was moved a large distance. The user clicked the scroll bar to the right(horizontal) or below(vertical) the scroll box.
    ScrollEventType.LargeIncrement = 3;
    /// Thumb was moved to the Maximum position
    ScrollEventType.Last = 4; 
    /// Thumb was moved a small distance. The user clicked the left(horizontal) or top(vertical) scroll arrow. 
    ScrollEventType.SmallDecrement = 5;
    /// Thumb was moved a small distance. The user clicked the right(horizontal) or bottom(vertical) scroll arrow. 
    ScrollEventType.SmallIncrement = 6; 
    /// Thumb was moved.
    ScrollEventType.ThumbPosition = 7;
    /// Thumb is currently being moved.
    ScrollEventType.ThumbTrack = 8;
    
    
    // Maximum distance you can drag from thumb before it snaps back 
//    private const double 
    var MaxPerpendicularDelta = 150;
//    private const string 
    var TrackName = "PART_Track"; 
	
	var ScrollBar = declare("ScrollBar", RangeBase,{
		constructor:function(/*int*/ index, /*boolean*/ found){
//			private Track 
			this._track = null;

//			private Point 
			this._latestRightButtonClickPoint = new Point(-1,-1); 

//			private bool 
			this._canScroll = true;  // Maximum > Minimum by default 
//			private bool 
			this._hasScrolled = false;  // Has the thumb been dragged 
//			private bool 
			this._isStandalone = true;
//			private bool 
			this._openingContextMenu = false; 
//			private double 
			this._previousValue = 0;
//			private Vector 
			this._thumbOffset = 0;
		},
 
        /// <summary>
        /// ScrollBar supports 'Move-To-Point' by pre-processes Shift+MouseLeftButton Click.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnPreviewMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) 
        { 
            this._thumbOffset = new Vector();
            if ((this.Track != null) && 
                (this.Track.IsMouseOver) &&
                ((Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift))
            {
                // Move Thumb to the Mouse location 
                /*Point*/var pt = e.MouseDevice.GetPosition(this.Track);
                /*double*/var newValue = this.Track.ValueFromPoint(pt); 
                if (System.Windows.Shapes.Shape.IsDoubleFinite(newValue)) 
                {
                	this.ChangeValue(newValue, false /* defer */); 
                }

                if (this.Track.Thumb != null && this.Track.Thumb.IsMouseOver)
                { 
                    /*Point*/var thumbPoint = e.MouseDevice.GetPosition(this.Track.Thumb);
                    this._thumbOffset = thumbPoint - new Point(this.Track.Thumb.ActualWidth * 0.5, this.Track.Thumb.ActualHeight * 0.5); 
                } 
                else
                { 
                    e.Handled = true;
                }
            } 
 
            base.OnPreviewMouseLeftButtonDown(e);
        },

        /// <summary>
        /// ScrollBar need to remember the point which ContextMenu is invoke in order to perform 'Scroll Here' command correctly.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnPreviewMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e) 
        { 
            if (this.Track != null)
            { 
                // Remember the mouse point (relative to Track's co-ordinate).
                this._latestRightButtonClickPoint = e.MouseDevice.GetPosition(/*(IInputElement)*/this.Track);
            }
            else 
            {
                // Clear the mouse point 
            	this._latestRightButtonClickPoint = new Point(-1,-1); 
            }
 
            base.OnPreviewMouseRightButtonUp(e);
        },

        /// <summary>
        /// ScrollBar locates the Track element when its visual tree is created
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        { 
            base.OnApplyTemplate(); 
            this._track = GetTemplateChild(TrackName);
            this._track = this._track instanceof Track ? this._track : null;
        }, 
        // Update ScrollBar Value based on the Thumb drag delta.
        // Deal with pixel -> logical scrolling unit conversion, and restrict the value to within [Minimum, Maximum].
//        private void 
        UpdateValue:function(/*double*/ horizontalDragDelta, /*double*/ verticalDragDelta)
        { 
            if (this.Track != null)
            { 
                /*double*/var valueDelta = Track.ValueFromDistance(horizontalDragDelta, verticalDragDelta); 
                if (    System.Windows.Shapes.Shape.IsDoubleFinite(valueDelta)
                    &&  !DoubleUtil.IsZero(valueDelta)) 
                {
                    /*double*/var currentValue = this.Value;
                    /*double*/var newValue = currentValue + valueDelta;
 
                    /*double*/var perpendicularDragDelta;
 
                    // Compare distances from thumb for horizontal and vertical orientations 
                    if (this.Orientation == Orientation.Horizontal)
                    { 
                        perpendicularDragDelta = Math.Abs(verticalDragDelta);
                    }
                    else //Orientation == Orientation.Vertical
                    { 
                        perpendicularDragDelta = Math.Abs(horizontalDragDelta);
                    } 
 
                    if (DoubleUtil.GreaterThan(perpendicularDragDelta, MaxPerpendicularDelta))
                    { 
                        newValue = this._previousValue;
                    }

                    if (!DoubleUtil.AreClose(currentValue, newValue)) 
                    {
                    	this._hasScrolled = true; 
                        this.ChangeValue(newValue, true /* defer */); 
                        this.RaiseScrollEvent(ScrollEventType.ThumbTrack);
                    } 
                }
            }
        },
 
//        private void 
        FinishDrag:function() 
        {
            /*double*/var value = this.Value; 
            /*IInputElement*/var target = this.CommandTarget;
            /*RoutedCommand*/var command = (this.Orientation == Orientation.Horizontal) ? 
            		DeferScrollToHorizontalOffsetCommand : DeferScrollToVerticalOffsetCommand;

            if (command.CanExecute(value, target)) 
            {
                // If we were reporting drag commands, we need to give a final scroll command 
            	this.ChangeValue(value, false /* defer */); 
            }
        }, 


//        private void 
        ChangeValue:function(/*double*/ newValue, /*bool*/ defer)
        { 
            newValue = Math.min(Math.Max(newValue, this.Minimum), this.Maximum);
            if (this.IsStandalone) { this.Value = newValue; } 
            else 
            {
                /*IInputElement*/var target = this.CommandTarget; 
                /*RoutedCommand*/var command = null;
                var horizontal = (this.Orientation == Orientation.Horizontal);

                // Fire the deferred (drag) version of the command 
                if (defer)
                { 
                    command = horizontal ? DeferScrollToHorizontalOffsetCommand : DeferScrollToVerticalOffsetCommand; 
                    if (command.CanExecute(newValue, target))
                    { 
                        // The defer version of the command is enabled, fire this command and not the scroll version
                        command.Execute(newValue, target);
                    }
                    else 
                    {
                        // The defer version of the command is not enabled, reset and try the scroll version 
                        command = null; 
                    }
                } 

                if (command == null)
                {
                    // Either we're not dragging or the drag command is not enabled, try the scroll version 
                    command = horizontal ? ScrollBar.ScrollToHorizontalOffsetCommand : ScrollBar.ScrollToVerticalOffsetCommand;
                    if (command.CanExecute(newValue, target)) 
                    { 
                        command.Execute(newValue, target);
                    } 
                }
            }
        },
 
        /// <summary>
        /// Scroll to the position where ContextMenu was invoked. 
        /// </summary> 
//        internal void 
        ScrollToLastMousePoint:function()
        { 
            var pt = new Point(-1,-1);
            if ((this.Track != null) && (trhis._latestRightButtonClickPoint != pt))
            {
                /*double*/var newValue = Track.ValueFromPoint(this._latestRightButtonClickPoint); 
                if (System.Windows.Shapes.Shape.IsDoubleFinite(newValue))
                { 
                    this.ChangeValue(newValue, false /* defer */); 
                    this. _latestRightButtonClickPoint = pt;
                    this.RaiseScrollEvent(ScrollEventType.ThumbPosition); 
                }
            }
        },
 
//        internal void 
        RaiseScrollEvent:function(/*ScrollEventType*/ scrollEventType)
        { 
            /*ScrollEventArgs*/var newEvent = new ScrollEventArgs(scrollEventType, Value); 
            newEvent.Source=this;
            this.RaiseEvent(newEvent); 
        },

 
//        private void 
        SmallDecrement:function() 
        {
            /*double*/var newValue = Math.max(this.Value - this.SmallChange, this.Minimum); 
            if (Value != newValue)
            {
            	this.Value = newValue;
            	this.RaiseScrollEvent(ScrollEventType.SmallDecrement); 
            }
        },
//        private void 
        SmallIncrement:function() 
        {
            var newValue = Math.min(this.Value + this.SmallChange, this.Maximum); 
            if (this.Value != newValue)
            {
            	this.Value = newValue;
            	this.RaiseScrollEvent(ScrollEventType.SmallIncrement); 
            }
        },
//        private void 
        LargeDecrement:function() 
        {
            var newValue = Math.max(this.Value - this.LargeChange, this.Minimum); 
            if (this.Value != newValue)
            {
            	this.Value = newValue;
            	this.RaiseScrollEvent(ScrollEventType.LargeDecrement); 
            }
        }, 
//        private void 
        LargeIncrement:function() 
        {
            /*double*/var newValue = Math.min(this.Value + this.LargeChange, this.Maximum); 
            if (this.Value != newValue)
            {
            	this.Value = newValue;
            	this.RaiseScrollEvent(ScrollEventType.LargeIncrement); 
            }
        },
//        private void 
        ToMinimum:function() 
        {
            if (this.Value != this.Minimum) 
            {
            	this.Value = this.Minimum;
            	this.RaiseScrollEvent(ScrollEventType.First);
            } 
        },
//        private void 
        ToMaximum:function() 
        { 
            if (this.Value != this.Maximum)
            { 
            	this.Value = this.Maximum;
                this.RaiseScrollEvent(ScrollEventType.Last);
            }
        },
//        private void 
        LineUp:function()
        { 
        	this.SmallDecrement(); 
        },
//        private void 
        LineDown:function() 
        {
        	this.SmallIncrement();
        },
//        private void 
        PageUp:function() 
        {
        	this.LargeDecrement(); 
        }, 
//        private void 
        PageDown:function()
        { 
        	this.LargeIncrement();
        },
//        private void 
        ScrollToTop:function()
        { 
        	this.ToMinimum();
        }, 
//        private void 
        ScrollToBottom:function() 
        {
        	this.ToMaximum(); 
        },
//        private void 
        LineLeft:function()
        {
        	this.SmallDecrement(); 
        },
//        private void 
        LineRight:function() 
        { 
        	this.SmallIncrement();
        }, 
//        private void 
        PageLeft:function()
        {
        	this.LargeDecrement();
        }, 
//        private void 
        PageRight:function()
        { 
            this.LargeIncrement(); 
        },
//        private void 
        ScrollToLeftEnd:function() 
        {
        	this.ToMinimum();
        },
//        private void 
        ScrollToRightEnd:function() 
        {
        	this.ToMaximum(); 
        }, 

        /// <summary>
        ///     Called when ContextMenuOpening is raised on this element. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnContextMenuOpening:function(/*ContextMenuEventArgs*/ e) 
        {
            base.OnContextMenuOpening(e); 

            if (!e.Handled)
            {
            	this._openingContextMenu = true; 
            	this.CoerceValue(ScrollBar.ContextMenuProperty);
            } 
        },

        /// <summary> 
        ///     Called when ContextMenuOpening is raised on this element.
        /// </summary>
        /// <param name="e">Event arguments</param>
//        protected override void 
        OnContextMenuClosing:function(/*ContextMenuEventArgs*/ e) 
        {
            base.OnContextMenuClosing(e); 
 
            this._openingContextMenu = false;
            this.CoerceValue(ScrollBar.ContextMenuProperty); 
        }
	});
	
	Object.defineProperties(ScrollBar.prototype,{
        /// <summary>
        /// Add / Remove Scroll event handler 
        /// </summary> 
//        public event ScrollEventHandler 
        Scroll:
        {
        	get:function(){
        		if(this.scroll === undefined){
        			this.scroll =new Delegate();
        		}
        		
        		return this.scroll;
        	}
        },
//        { add { AddHandler(ScrollEvent, value); } remove { RemoveHandler(ScrollEvent, value); } } 

        /// <summary>
        /// This property represents the ScrollBar's <see cref="Orientation" />: Vertical or Horizontal.
        /// On vertical ScrollBars, the thumb moves up and down.  On horizontal bars, the thumb moves left to right. 
        /// </summary>
//        public Orientation 
        Orientation: 
        { 
            get:function() { return this.GetValue(ScrollBar.OrientationProperty); },
            set:function(value) { this.SetValue(ScrollBar.OrientationProperty, value); } 
        },

        /// <summary>
        /// ViewportSize is the amount of the scrolled extent currently visible.  For most scrolled content, this value 
        /// will be bound to one of <see cref="ScrollViewer" />'s ViewportSize properties.
        /// This property is in logical scrolling units. 
        /// </summary> 
//        public double 
        ViewportSize: 
        {
            get:function() { return this.GetValue(ScrollBar.ViewportSizeProperty); },
            set:function(value) { this.SetValue(ScrollBar.ViewportSizeProperty, value); }
        }, 

        /// <summary> 
        /// Gets reference to ScrollBar's Track element. 
        /// </summary>
//        public Track 
        Track:
        {
            get:function()
            {
                return this._track; 
            }
        }, 
 
        /// <summary>
        ///     Fetches the value of the IsEnabled property 
        /// </summary> 
        /// <remarks>
        ///     The reason this property is overridden is so that ScrollBar 
        ///     could infuse the value for EnoughContentToScroll into it.
        /// </remarks>
//        protected override bool 
        IsEnabledCore:
        { 
            get:function()
            { 
                return base.IsEnabledCore && this._canScroll; 
            }
        }, 

//        private IInputElement 
        CommandTarget:
        {
            get:function() 
            {
                /*IInputElement*/var target = this.TemplatedParent instanceof IInputElement ? this.TemplatedParent : null; 
                if (target == null) 
                {
                    target = this; 
                }

                return target;
            } 
        },

        // Is the scrollbar outside of a scrollviewer? 
//        internal bool 
        IsStandalone:
        {
            get:function() { return this._isStandalone; },
            set:function(value) { this._isStandalone = value; } 
        },
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        {
            get:function() { return this._dType; } 
        } 

	});
	
	Object.defineProperties(ScrollBar, {
        /// <summary> 
        ///     Event fires when user press mouse's left button on the thumb.
        /// </summary>
//        public static readonly RoutedEvent 
        ScrollEvent:
        {
        	get:function(){
        		if(ScrollBar._ScrollEvent === undefined){
        			ScrollBar._ScrollEvent = EventManager.RegisterRoutedEvent("Scroll", RoutingStrategy.Bubble, 
        					ScrollEventHandler.Type, ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollEvent;
        	}
        },

        /// <summary> 
        /// DependencyProperty for <see cref="Orientation" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        OrientationProperty:
        {
        	get:function(){
        		if(ScrollBar._OrientationProperty === undefined){
        			ScrollBar._OrientationProperty = DependencyProperty.Register("Orientation", Number.Type, ScrollBar.Type,
                            new FrameworkPropertyMetadata(Orientation.Vertical),
                            new ValidateValueCallback(IsValidOrientation));
        		}
        		
        		return ScrollBar._OrientationProperty;
        	}
        }, 
 

        /// <summary> 
        /// DependencyProperty for <see cref="ViewportSize" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        ViewportSizeProperty:
        {
        	get:function(){
        		if(ScrollBar._ViewportSizeProperty === undefined){
        			ScrollBar._ViewportSizeProperty = DependencyProperty.Register("ViewportSize", Number.Type, ScrollBar.Type,
                            new FrameworkPropertyMetadata(0.0),
                            new ValidateValueCallback(/*System.Windows.Shapes.*/Shape.IsDoubleFiniteNonNegative));
        		}
        		
        		return ScrollBar._ViewportSizeProperty;
        	}
        }, 

        /// <summary> 
        /// Scroll content by one line to the top.
        /// </summary> 
//        public static readonly RoutedCommand 
        LineUpCommand:
        {
        	get:function(){
        		if(ScrollBar._LineUpCommand === undefined){
        			ScrollBar._LineUpCommand = new RoutedCommand("LineUp", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._LineUpCommand;
        	}
        },
        /// <summary>
        /// Scroll content by one line to the bottom. 
        /// </summary>
//        public static readonly RoutedCommand 
        LineDownCommand:
        {
        	get:function(){
        		if(ScrollBar._LineDownCommand === undefined){
        			ScrollBar._LineDownCommand = new RoutedCommand("LineDown", ScrollBar.Type);
        		}
        		
        		return ScrollBar._LineDownCommand;
        	}
        },
        /// <summary>
        /// Scroll content by one line to the left. 
        /// </summary>
//        public static readonly RoutedCommand 
        LineLeftCommand:
        {
        	get:function(){
        		if(ScrollBar._LineLeftCommand === undefined){
        			ScrollBar._LineLeftCommand = new RoutedCommand("LineLeft", ScrollBar.Type);  
        		}
        		
        		return ScrollBar._LineLeftCommand;
        	}
        },
        /// <summary> 
        /// Scroll content by one line to the right.
        /// </summary> 
//        public static readonly RoutedCommand 
        LineRightCommand:
        {
        	get:function(){
        		if(ScrollBar._LineRightCommand === undefined){
        			ScrollBar._LineRightCommand = new RoutedCommand("LineRight", ScrollBar.Type);
        		}
        		
        		return ScrollBar._LineRightCommand;
        	}
        },
        /// <summary>
        /// Scroll content by one page to the top.
        /// </summary> 
//        public static readonly RoutedCommand 
        PageUpCommand:
        {
        	get:function(){
        		if(ScrollBar._PageUpCommand === undefined){
        			ScrollBar._PageUpCommand = new RoutedCommand("PageUp", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._PageUpCommand;
        	}
        },
        /// <summary> 
        /// Scroll content by one page to the bottom. 
        /// </summary>
//        public static readonly RoutedCommand 
        PageDownCommand:
        {
        	get:function(){
        		if(ScrollBar._PageDownCommand === undefined){
        			ScrollBar._PageDownCommand = new RoutedCommand("PageDown", ScrollBar.Type);  
        		}
        		
        		return ScrollBar._PageDownCommand;
        	}
        },
        /// <summary>
        /// Scroll content by one page to the left.
        /// </summary>
//        public static readonly RoutedCommand 
        PageLeftCommand:
        {
        	get:function(){
        		if(ScrollBar._PageLeftCommand === undefined){
        			ScrollBar._PageLeftCommand = new RoutedCommand("PageLeft", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._PageLeftCommand;
        	}
        },
        /// <summary>
        /// Scroll content by one page to the right. 
        /// </summary> 
//        public static readonly RoutedCommand 
        PageRightCommand:
        {
        	get:function(){
        		if(ScrollBar._PageRightCommand === undefined){
        			ScrollBar._PageRightCommand = new RoutedCommand("PageRight", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._PageRightCommand;
        	}
        },
        /// <summary> 
        /// Horizontally scroll to the beginning of the content.
        /// </summary>
//        public static readonly RoutedCommand 
        ScrollToEndCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToEndCommand === undefined){
        			ScrollBar._ScrollToEndCommand = new RoutedCommand("ScrollToEnd", ScrollBar.Type);
        		}
        		
        		return ScrollBar._ScrollToEndCommand;
        	}
        },
        /// <summary> 
        /// Horizontally scroll to the end of the content.
        /// </summary> 
//        public static readonly RoutedCommand 
        ScrollToHomeCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToHomeCommand === undefined){
        			ScrollBar._ScrollToHomeCommand = new RoutedCommand("ScrollToHome", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToHomeCommand;
        	}
        },
        /// <summary>
        /// Horizontally scroll to the beginning of the content. 
        /// </summary>
//        public static readonly RoutedCommand 
        ScrollToRightEndCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToRightEndCommand === undefined){
        			ScrollBar._ScrollToRightEndCommand = new RoutedCommand("ScrollToRightEnd", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToRightEndCommand;
        	}
        },
        /// <summary>
        /// Horizontally scroll to the end of the content. 
        /// </summary>
//        public static readonly RoutedCommand 
        ScrollToLeftEndCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToLeftEndCommand === undefined){
        			ScrollBar._ScrollToLeftEndCommand = new RoutedCommand("ScrollToLeftEnd", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToLeftEndCommand;
        	}
        },
        /// <summary> 
        /// Vertically scroll to the beginning of the content.
        /// </summary> 
//        public static readonly RoutedCommand 
        ScrollToTopCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToTopCommand === undefined){
        			ScrollBar._ScrollToTopCommand = new RoutedCommand("ScrollToTop", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToTopCommand;
        	}
        },
        /// <summary>
        /// Vertically scroll to the end of the content.
        /// </summary> 
//        public static readonly RoutedCommand 
        ScrollToBottomCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToBottomCommand === undefined){
        			ScrollBar._ScrollToBottomCommand = new RoutedCommand("ScrollToBottom", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToBottomCommand;
        	}
        },
        /// <summary> 
        /// Scrolls horizontally to the double value provided in <see cref="System.Windows.Input.ExecutedRoutedEventArgs.Parameter" />. 
        /// </summary>
//        public static readonly RoutedCommand 
        ScrollToHorizontalOffsetCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToHorizontalOffsetCommand === undefined){
        			ScrollBar._ScrollToHorizontalOffsetCommand = new RoutedCommand("ScrollToHorizontalOffset", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToHorizontalOffsetCommand;
        	}
        },
        /// <summary>
        /// Scrolls vertically to the double value provided in <see cref="System.Windows.Input.ExecutedRoutedEventArgs.Parameter" />.
        /// </summary>
//        public static readonly RoutedCommand 
        ScrollToVerticalOffsetCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollToVerticalOffsetCommand === undefined){
        			ScrollBar._ScrollToVerticalOffsetCommand = new RoutedCommand("ScrollToVerticalOffset", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._ScrollToVerticalOffsetCommand;
        	}
        }, 
        /// <summary>
        /// Scrolls horizontally by dragging to the double value provided in <see cref="System.Windows.Input.ExecutedRoutedEventArgs.Parameter" />. 
        /// </summary> 
//        public static readonly RoutedCommand 
        DeferScrollToHorizontalOffsetCommand:
        {
        	get:function(){
        		if(ScrollBar._DeferScrollToHorizontalOffsetCommand === undefined){
        			ScrollBar._DeferScrollToHorizontalOffsetCommand = new RoutedCommand("DeferScrollToToHorizontalOffset", ScrollBar.Type);
        		}
        		
        		return ScrollBar._DeferScrollToHorizontalOffsetCommand;
        	}
        },
        /// <summary> 
        /// Scrolls vertically by dragging to the double value provided in <see cref="System.Windows.Input.ExecutedRoutedEventArgs.Parameter" />.
        /// </summary>
//        public static readonly RoutedCommand 
        DeferScrollToVerticalOffsetCommand:
        {
        	get:function(){
        		if(ScrollBar._DeferScrollToVerticalOffsetCommand === undefined){
        			ScrollBar._DeferScrollToVerticalOffsetCommand = new RoutedCommand("DeferScrollToVerticalOffset", ScrollBar.Type); 
        		}
        		
        		return ScrollBar._DeferScrollToVerticalOffsetCommand;
        	}
        },
 
        /// <summary>
        /// Scroll to the point where user invoke ScrollBar ContextMenu.  This command is always handled by ScrollBar. 
        /// </summary> 
//        public static readonly RoutedCommand 
        ScrollHereCommand:
        {
        	get:function(){
        		if(ScrollBar._ScrollHereCommand === undefined){
        			ScrollBar._ScrollHereCommand  = new RoutedCommand("ScrollHere", ScrollBar.Type);
        		}
        		
        		return ScrollBar._ScrollHereCommand;
        	}
        },
 
//        private static DependencyObjectType 
        _dType:
        {
        	get:function(){
        		if(ScrollBar.__dType === undefined){
        			ScrollBar.__dType = DependencyObjectType.FromSystemTypeInternal(ScrollBar.Type); 
        		}
        	
        		return ScrollBar.__dType;
        	}
        },


//        private static ContextMenu 
        VerticalContextMenu:
        { 
            get:function()
            { 
                /*ContextMenu*/var verticalContextMenu = new ContextMenu(); 
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollHere, "ScrollHere", ScrollBar.ScrollHereCommand));
                verticalContextMenu.Items.Add(new Separator()); 
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_Top, "Top", ScrollBar.ScrollToTopCommand));
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_Bottom, "Bottom", ScrollBar.ScrollToBottomCommand));
                verticalContextMenu.Items.Add(new Separator());
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_PageUp, "PageUp", ScrollBar.PageUpCommand)); 
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_PageDown, "PageDown", ScrollBar.PageDownCommand));
                verticalContextMenu.Items.Add(new Separator()); 
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollUp, "ScrollUp", ScrollBar.LineUpCommand)); 
                verticalContextMenu.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollDown, "ScrollDown", ScrollBar.LineDownCommand));
                return verticalContextMenu; 
            }
        },

        // LeftToRight menu 
//        private static ContextMenu 
        HorizontalContextMenuLTR:
        { 
            get:function() 
            {
                /*ContextMenu*/var horizontalContextMenuLeftToRight = new ContextMenu(); 
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollHere, "ScrollHere", ScrollBar.ScrollHereCommand));
                horizontalContextMenuLeftToRight.Items.Add(new Separator());
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_LeftEdge, "LeftEdge", ScrollBar.ScrollToLeftEndCommand));
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_RightEdge, "RightEdge", ScrollBar.ScrollToRightEndCommand)); 
                horizontalContextMenuLeftToRight.Items.Add(new Separator());
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_PageLeft, "PageLeft", ScrollBar.PageLeftCommand)); 
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_PageRight, "PageRight", ScrollBar.PageRightCommand)); 
                horizontalContextMenuLeftToRight.Items.Add(new Separator());
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollLeft, "ScrollLeft", ScrollBar.LineLeftCommand)); 
                horizontalContextMenuLeftToRight.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollRight, "ScrollRight", ScrollBar.LineRightCommand));
                return horizontalContextMenuLeftToRight;
            }
        }, 

        // RightToLeft menu 
//        private static ContextMenu 
        HorizontalContextMenuRTL: 
        {
            get:function() 
            {
                /*ContextMenu*/var horizontalContextMenuRightToLeft = new ContextMenu();
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollHere, "ScrollHere", ScrollBar.ScrollHereCommand));
                horizontalContextMenuRightToLeft.Items.Add(new Separator()); 
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_LeftEdge, "LeftEdge", ScrollBar.ScrollToRightEndCommand));
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_RightEdge, "RightEdge", ScrollBar.ScrollToLeftEndCommand)); 
                horizontalContextMenuRightToLeft.Items.Add(new Separator()); 
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_PageLeft, "PageLeft", ScrollBar.PageRightCommand));
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_PageRight, "PageRight", ScrollBar.PageLeftCommand)); 
                horizontalContextMenuRightToLeft.Items.Add(new Separator());
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollLeft, "ScrollLeft", ScrollBar.LineRightCommand));
                horizontalContextMenuRightToLeft.Items.Add(CreateMenuItem(SRID.ScrollBar_ContextMenu_ScrollRight, "ScrollRight", ScrollBar.LineLeftCommand));
                return horizontalContextMenuRightToLeft; 
            }
        } 
	});

//    private static void 
    function OnThumbDragStarted(/*object*/ sender, /*DragStartedEventArgs*/ e)
    {
        /*ScrollBar*/var scrollBar = sender instanceof ScrollBar ? sender : null;
        if (scrollBar == null) { return; } 

        scrollBar._hasScrolled = false; 
        scrollBar._previousValue = scrollBar.Value; 
    }

    // Event handler to listen to thumb events.
//    private static void 
    function OnThumbDragDelta(/*object*/ sender, /*DragDeltaEventArgs*/ e)
    {
        var scrollBar = sender instanceof ScrollBar ? sender : null; 
        if (scrollBar == null) { return; }

        scrollBar.UpdateValue(e.HorizontalChange + scrollBar._thumbOffset.X, e.VerticalChange + scrollBar._thumbOffset.Y); 
    }

    /// <summary>
    /// Listen to Thumb DragCompleted event. 
    /// </summary> 
    /// <param name="sender"></param>
    /// <param name="e"></param> 
//    private static void 
    function OnThumbDragCompleted(/*object*/ sender, /*DragCompletedEventArgs*/ e)
    {
        sender.OnThumbDragCompleted(e);
    } 

//    private static void 
    function OnScrollCommand(/*object*/ target, /*ExecutedRoutedEventArgs*/ args)
    { 
        /*ScrollBar*/var scrollBar = (/*(ScrollBar)*/target);
        if (args.Command == ScrollBar.ScrollHereCommand) 
        { 
            scrollBar.ScrollToLastMousePoint();
        } 

        if (scrollBar.IsStandalone)
        {
            if (scrollBar.Orientation == Orientation.Vertical) 
            {
                if (args.Command == ScrollBar.LineUpCommand) 
                { 
                    scrollBar.LineUp();
                } 
                else if (args.Command == ScrollBar.LineDownCommand)
                {
                    scrollBar.LineDown();
                } 
                else if (args.Command == ScrollBar.PageUpCommand)
                { 
                    scrollBar.PageUp(); 
                }
                else if (args.Command == ScrollBar.PageDownCommand) 
                {
                    scrollBar.PageDown();
                }
                else if (args.Command == ScrollBar.ScrollToTopCommand) 
                {
                    scrollBar.ScrollToTop(); 
                } 
                else if (args.Command == ScrollBar.ScrollToBottomCommand)
                { 
                    scrollBar.ScrollToBottom();
                }
            }
            else //Horizontal 
            {
                if (args.Command == ScrollBar.LineLeftCommand) 
                { 
                    scrollBar.LineLeft();
                } 
                else if (args.Command == ScrollBar.LineRightCommand)
                {
                    scrollBar.LineRight();
                } 
                else if (args.Command == ScrollBar.PageLeftCommand)
                { 
                    scrollBar.PageLeft(); 
                }
                else if (args.Command == ScrollBar.PageRightCommand) 
                {
                    scrollBar.PageRight();
                }
                else if (args.Command == ScrollBar.ScrollToLeftEndCommand) 
                {
                    scrollBar.ScrollToLeftEnd(); 
                } 
                else if (args.Command == ScrollBar.ScrollToRightEndCommand)
                { 
                    scrollBar.ScrollToRightEnd();
                }
            }
        } 
    }

//    private static void 
    function OnQueryScrollHereCommand(/*object*/ target, /*CanExecuteRoutedEventArgs*/ args) 
    {
        args.CanExecute = (args.Command == ScrollBar.ScrollHereCommand);
    }

//    private static void 
    function OnQueryScrollCommand(/*object*/ target, /*CanExecuteRoutedEventArgs*/ args)
    { 
        args.CanExecute = target.IsStandalone; 
    }



//    private static void 
    function ViewChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*ScrollBar*/var scrollBar = /*(ScrollBar)*/d; 

        var canScrollNew = scrollBar.Maximum > scrollBar.Minimum; 

        if (canScrollNew != scrollBar._canScroll)
        {
            scrollBar._canScroll = canScrollNew; 
            scrollBar.CoerceValue(IsEnabledProperty);
        } 
    } 

    // Consider adding a verify for ViewportSize to check > 0.0 

//    internal static bool 
    ScrollBar.IsValidOrientation = function(/*object*/ o)
    {
        /*Orientation*/var value = /*(Orientation)*/o; 
        return value == Orientation.Horizontal
            || value == Orientation.Vertical; 
    };

//    private static object 
    function CoerceContextMenu(/*DependencyObject*/ o, /*object*/ value) 
    { 
        /*bool*/var hasModifiers;
        /*ScrollBar*/var sb = /*(ScrollBar)*/o; 
        var hasModifiersOut = {
        	"hasModifiers" : hasModifiers
        };
        var source = sb.GetValueSource(ScrollBar.ContextMenuProperty, null, /*out hasModifiers*/hasModifiersOut);
        hasModifiers = hasModifiersOut.hasModifiers;
        
        if (sb._openingContextMenu &&
        		source== BaseValueSourceInternal.Default && !hasModifiers)
        {
            // Use a default menu 
            if (sb.Orientation == Orientation.Vertical)
            { 
                return VerticalContextMenu; 
            }
            else if (sb.FlowDirection == FlowDirection.LeftToRight) 
            {
                return HorizontalContextMenuLTR;
            }
            else 
            {
                return HorizontalContextMenuRTL; 
            } 
        }
        return value; 
    }

//    private static MenuItem 
    function CreateMenuItem(/*string*/ name, /*string*/ automationId, /*RoutedCommand*/ command)
    { 
        /*MenuItem*/var menuItem = new MenuItem();
        menuItem.Header = name; ///*SR.Get(name)*/;
        menuItem.Command = command;
        AutomationProperties.SetAutomationId(menuItem, automationId); 

        /*Binding*/var binding = new Binding(); 
        binding.Path = new PropertyPath(ContextMenu.PlacementTargetProperty); 
        binding.Mode = BindingMode.OneWay;
        binding.RelativeSource = new RelativeSource(RelativeSourceMode.FindAncestor, typeof(ContextMenu), 1); 
        menuItem.SetBinding(MenuItem.CommandTargetProperty, binding);

        return menuItem;
    } 
    
  //static ScrollBar()
    function Initliazed()
    { 
    	DefaultStyleKeyProperty.OverrideMetadata(ScrollBar.Type, new FrameworkPropertyMetadata(ScrollBar.Type));
    	_dType = DependencyObjectType.FromSystemTypeInternal(ScrollBar.Type); 
  
    	var onScrollCommand = new ExecutedRoutedEventHandler(null, OnScrollCommand);
    	var onQueryScrollCommand = new CanExecuteRoutedEventHandler(null, OnQueryScrollCommand); 
  
    	FocusableProperty.OverrideMetadata(ScrollBar.Type, new FrameworkPropertyMetadata(false));
  
    	// Register Event Handler for the Thumb 
    	EventManager.RegisterClassHandler(ScrollBar.Type, Thumb.DragStartedEvent, new DragStartedEventHandler(OnThumbDragStarted));
    	EventManager.RegisterClassHandler(ScrollBar.Type, Thumb.DragDeltaEvent, new DragDeltaEventHandler(OnThumbDragDelta)); 
    	EventManager.RegisterClassHandler(ScrollBar.Type, Thumb.DragCompletedEvent, new DragCompletedEventHandler(OnThumbDragCompleted)); 
  
    	// ScrollBar has common handler for ScrollHere command. 
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.ScrollHereCommand, onScrollCommand, new CanExecuteRoutedEventHandler(null, OnQueryScrollHereCommand));
    	// Vertical Commands
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.LineUpCommand, onScrollCommand, onQueryScrollCommand, Key.Up);
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.LineDownCommand, onScrollCommand, onQueryScrollCommand, Key.Down); 
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.PageUpCommand, onScrollCommand, onQueryScrollCommand, Key.PageUp);
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.PageDownCommand, onScrollCommand, onQueryScrollCommand, Key.PageDown); 
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.ScrollToTopCommand, onScrollCommand, onQueryScrollCommand, new KeyGesture(Key.Home, ModifierKeys.Control)); 
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.ScrollToBottomCommand, onScrollCommand, onQueryScrollCommand, new KeyGesture(Key.End, ModifierKeys.Control));
    	// Horizontal Commands 
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.LineLeftCommand, onScrollCommand, onQueryScrollCommand, Key.Left);
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.LineRightCommand, onScrollCommand, onQueryScrollCommand, Key.Right);
    	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.PageLeftCommand, onScrollCommand, onQueryScrollCommand);
      	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.PageRightCommand, onScrollCommand, onQueryScrollCommand); 
      	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.ScrollToLeftEndCommand, onScrollCommand, onQueryScrollCommand, Key.Home);
      	CommandHelpers.RegisterCommandHandler(ScrollBar.Type, ScrollBar.ScrollToRightEndCommand, onScrollCommand, onQueryScrollCommand, Key.End); 
  
      	MaximumProperty.OverrideMetadata(ScrollBar.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(null, ViewChanged)));
      	MinimumProperty.OverrideMetadata(ScrollBar.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(null, ViewChanged))); 
  
      	ContextMenuProperty.OverrideMetadata(ScrollBar.Type, new FrameworkPropertyMetadata(null, new CoerceValueCallback(null, CoerceContextMenu)));
    };
	
	ScrollBar.Type = new Type("ScrollBar", ScrollBar, [RangeBase.Type]);
	return ScrollBar;
});





