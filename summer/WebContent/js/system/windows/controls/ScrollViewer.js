/**
 * ScrollViewer
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentControl", "windows/FrameworkElementFactory",
        "input/ExecutedRoutedEventHandler", "input/CanExecuteRoutedEventHandler", "internal.commands/CommandHelpers", 
        "data/Binding", "data/BindingMode", "windows/FrameworkPropertyMetadata", "windows/RequestBringIntoViewEventHandler",
        "input/KeyboardNavigation", "windows/TemplateBindingExtension", "primitives/ScrollBar"], 
		function(declare, Type, ContentControl, FrameworkElementFactory,
				ExecutedRoutedEventHandler, CanExecuteRoutedEventHandler, CommandHelpers, 
				Binding, BindingMode, FrameworkPropertyMetadata, RequestBringIntoViewEventHandler,
				KeyboardNavigation, TemplateBindingExtension, ScrollBar){
	
//    private enum 
	var Flags =declare(null, {});
	Flags.None                            = 0x0000;
	Flags.InvalidatedMeasureFromArrange   = 0x0001;
	Flags.InChildInvalidateMeasure        = 0x0002;
	Flags.HandlesMouseWheelScrolling      = 0x0004; 
	Flags.ForceNextManipulationComplete   = 0x0008;
	Flags.ManipulationBindingsInitialized = 0x0010; 
	Flags.CompleteScrollManipulation      = 0x0020; 
	Flags.InChildMeasurePass1             = 0x0040;
	Flags.InChildMeasurePass2             = 0x0080; 
	Flags.InChildMeasurePass3             = 0x00C0;
	
	
    

//    public const double 
	var PrePanTranslation = 3;
//    public const double 
	var MaxInertiaBoundaryTranslation = 50; 
//    public const double 
	var PreFeedbackTranslationX = 8;
//    public const double 
	var PreFeedbackTranslationY = 5; 
//    public const int 
	var InertiaBoundryMinimumTicks = 100; 
	
//	private class 
	var PanningInfo = declare(null, {});
	Object.defineProperties(PanningInfo.prototype, {
//		public PanningMode 
		PanningMode: 
        { 
            get:function() {return this._PanningMode;},
            set:function(value) {this._PanningMode = value;}
        },

//        public double 
        OriginalHorizontalOffset:
        { 
        	get:function() {return this._OriginalHorizontalOffset;},
            set:function(value) {this._OriginalHorizontalOffset = value;}
        }, 

//        public double 
        OriginalVerticalOffset: 
        {
        	get:function() {return this._OriginalVerticalOffset;},
            set:function(value) {this._OriginalVerticalOffset = value;}
        }, 

//        public double 
        DeltaPerHorizontalOffet: 
        { 
        	get:function() {return this._DeltaPerHorizontalOffet;},
            set:function(value) {this._DeltaPerHorizontalOffet = value;}
        },

//        public double 
        DeltaPerVerticalOffset:
        { 
        	get:function() {return this._DeltaPerVerticalOffset;},
            set:function(value) {this._DeltaPerVerticalOffset = value;}
        }, 

//        public bool 
        IsPanning: 
        {
        	get:function() {return this._IsPanning;},
            set:function(value) {this._IsPanning = value;}
        }, 

//        public Vector 
        UnusedTranslation: 
        { 
        	get:function() {return this._UnusedTranslation;},
            set:function(value) {this._UnusedTranslation = value;}
        },

//        public bool 
        InHorizontalFeedback:
        { 
        	get:function() {return this._InHorizontalFeedback;},
            set:function(value) {this._InHorizontalFeedback = value;}
        }, 

//        public bool 
        InVerticalFeedback: 
        {
        	get:function() {return this._InVerticalFeedback;},
            set:function(value) {this._InVerticalFeedback = value;}
        }, 

//        public int 
        InertiaBoundaryBeginTimestamp: 
        { 
        	get:function() {return this._InertiaBoundaryBeginTimestamp;},
            set:function(value) {this._InertiaBoundaryBeginTimestamp = value;} 
        },	
	});

//	private enum 
	var Commands = declare(null, {});
	Commands.Invalid = 0;
	Commands.LineUp = 1; 
	Commands.LineDown = 2;
	Commands.LineLeft = 3; 
	Commands.LineRight = 4; 
	Commands.PageUp = 5;
	Commands.PageDown = 6;
	Commands.PageLeft = 7;
	Commands.PageRight = 8;
	Commands.SetHorizontalOffset = 9;
	Commands.SetVerticalOffset = 10; 
	Commands.MakeVisible = 11;

//    private struct 
	var Command = declare(null, {
		constructor:function(/*Commands*/ code, /*double*/ param, /*MakeVisibleParams*/ mvp)
        {
			if(arguments.length == 0){
	            this.Code = null;
	            this.Param = null; 
	            this.MakeVisibleParam = null;
			}else{
	            this.Code = code;
	            this.Param = param; 
	            this.MakeVisibleParam = mvp;
        	}
        } 
	});
	
	Object.defineProperties(Command.prototype, { 
       

//        internal Commands 
		Code: 
        { 
        	get:function() {return this.code;},
            set:function() {this.code = value;} 
        },
//        internal double 
		Param: 
        { 
        	get:function() {return this._Param;},
            set:function() {this._Param = value;} 
        }, 
//        internal MakeVisibleParams 
		MakeVisibleParam: 
        { 
        	get:function() {return this._MakeVisibleParam;},
            set:function() {this._MakeVisibleParam = value;} 
        },
    });


//    private class 
	var MakeVisibleParams = declare(null, {
		constructor:function(/*Visual*/ child, /*Rect*/ targetRect) 
        { 
            this.Child = child;
            this.TargetRect = targetRect; 
        }
	});
	
	Object.defineProperties(Command.prototype, { 
//        internal Visual 
		Child: 
        { 
        	get:function() {return this._Child;},
            set:function() {this._Child = value;} 
        },
//        internal Rect
        TargetRect: 
        { 
        	get:function() {return this._TargetRect;},
            set:function() {this._TargetRect = value;} 
        },
    });

//    private const int 
	var _capacity = 32; 
	// implements ring buffer of commands 
//    private struct 
	var CommandQueue = declare(null, {

        //returns false if capacity is used up and entry ignored
//        internal void 
		Enqueue:function(/*Command*/ command)
        { 
            if(this._lastWritePosition == this._lastReadPosition) //buffer is empty
            { 
            	this._array = []; //new Command[_capacity]; 
            	for(var i=0; i<_capacity; i++){
            		this._array[i] = new Command();
            	}
            	this._lastWritePosition = this._lastReadPosition = 0;
            } 

            if(!this.OptimizeCommand(command)) //regular insertion, if optimization didn't happen
            {
            	this._lastWritePosition = (this._lastWritePosition + 1) % _capacity; 

                if(this._lastWritePosition == this._lastReadPosition) //buffer is full 
                { 
                    // throw away the oldest entry and continue to accumulate fresh input
                	this._lastReadPosition = (this._lastReadPosition + 1) % _capacity; 
                }

                this._array[this._lastWritePosition] = command;
            } 
        },

        // this tries to "merge" the incoming command with the accumulated queue 
        // for example, if we get SetHorizontalOffset incoming, all "horizontal"
        // commands in the queue get removed and replaced with incoming one, 
        // since horizontal position is going to end up at the specified offset anyways.
//        private bool 
        OptimizeCommand:function(/*Command*/ command)
        {
            if(this._lastWritePosition != this._lastReadPosition) //buffer has something 
            {

                if(   (   command.Code == Commands.SetHorizontalOffset 
                       && this._array[_lastWritePosition].Code == Commands.SetHorizontalOffset)
                   || (   command.Code == Commands.SetVerticalOffset 
                       && this._array[_lastWritePosition].Code == Commands.SetVerticalOffset)
                   || (command.Code == Commands.MakeVisible
                       && this._array[_lastWritePosition].Code == Commands.MakeVisible))
                { 
                    //if the last command was "set offset" or "make visible", simply replace it and
                    //don't insert new command 
                	this._array[_lastWritePosition].Param = command.Param; 
                	this._array[_lastWritePosition].MakeVisibleParam = command.MakeVisibleParam;
                    return true; 
                }
            }
            return false;
        }, 

        // returns Invalid command if there is no more commands 
//        internal Command 
        Fetch:function() 
        {
            if(this._lastWritePosition == this._lastReadPosition) //buffer is empty 
            {
                return new Command(Commands.Invalid, 0, null);
            }
            this._lastReadPosition = (this._lastReadPosition + 1) % _capacity; 

            //array exists always if writePos != readPos 
            var command = this._array[this._lastReadPosition]; 
            this._array[this._lastReadPosition].MakeVisibleParam = null; //to release the allocated object

            if(this._lastWritePosition == this._lastReadPosition) //it was the last command
            {
            	this._array = null; // make GC work. Hopefully the whole queue is processed in Gen0
            } 
            return command;
        }, 

//        internal bool 
        IsEmpty:function()
        { 
            return (this._lastWritePosition == this._lastReadPosition);
        }

//        private int _lastWritePosition; 
//        private int _lastReadPosition;
//        private Command[] _array; 

    });   
     
//    private static DependencyObjectType 
    var _dType; 
    
    // Scrolling physical "line" metrics.
//    internal const double 
    var _scrollLineDelta = 16.0;   // Default physical amount to scroll with one Up/Down/Left/Right key 
//    internal const double 
    var _mouseWheelDelta = 48.0;   // Default physical amount to scroll with one MouseWheel.

//    private const string 
    var HorizontalScrollBarTemplateName = "PART_HorizontalScrollBar"; 
//    private const string 
    var VerticalScrollBarTemplateName = "PART_VerticalScrollBar";
//    internal const string 
    var ScrollContentPresenterTemplateName = "PART_ScrollContentPresenter"; 
    
	var ScrollViewer = declare("ScrollViewer", ContentControl,{
		constructor:function(){
	        // Property caching
//	        private Visibility 
			this._scrollVisibilityX;
//	        private Visibility 
			this._scrollVisibilityY; 

	        // Scroll property values - cache of what was computed by ISI 
//	        private double 
			this._xPositionISI = 0; 
//	        private double 
			this._yPositionISI = 0;
//	        private double 
			this._xExtent = 0; 
//	        private double 
			this._yExtent = 0;
//	        private double 
			this._xSize = 0;
//	        private double 
			this._ySize = 0;
	 
	        // Event/infrastructure
//	        private EventHandler 
			this._layoutUpdatedHandler = null; 
//	        private IScrollInfo 
			this._scrollInfo = null; 

//	        private CommandQueue 
			this._queue = null; 

//	        private PanningInfo 
			this._panningInfo = null;
//	        private Flags 
			this._flags = Flags.HandlesMouseWheelScrolling;
		},
		
	    /// <summary>
        /// Scroll content by one line to the top.
        /// </summary>
//        public void 
		LineUp:function() { this.EnqueueCommand(Commands.LineUp, 0, null); }, 
        /// <summary>
        /// Scroll content by one line to the bottom. 
        /// </summary> 
//        public void 
		LineDown:function() { this.EnqueueCommand(Commands.LineDown, 0, null); },
        /// <summary> 
        /// Scroll content by one line to the left.
        /// </summary>
//        public void 
		LineLeft:function() { this.EnqueueCommand(Commands.LineLeft, 0, null); },
        /// <summary> 
        /// Scroll content by one line to the right.
        /// </summary> 
//        public void 
		LineRight:function() { this.EnqueueCommand(Commands.LineRight, 0, null); }, 

        /// <summary> 
        /// Scroll content by one page to the top.
        /// </summary>
//        public void 
		PageUp:function() { this.EnqueueCommand(Commands.PageUp, 0, null); },
        /// <summary> 
        /// Scroll content by one page to the bottom.
        /// </summary> 
//        public void 
		PageDown:function() { this.EnqueueCommand(Commands.PageDown, 0, null); }, 
        /// <summary>
        /// Scroll content by one page to the left. 
        /// </summary>
//        public void 
		PageLeft:function() { this.EnqueueCommand(Commands.PageLeft, 0, null); },
        /// <summary>
        /// Scroll content by one page to the right. 
        /// </summary>
//        public void 
		PageRight:function() { this.EnqueueCommand(Commands.PageRight, 0, null); }, 
 
        /// <summary>
        /// Horizontally scroll to the beginning of the content. 
        /// </summary>
//        public void 
		ScrollToLeftEnd:function() { this.EnqueueCommand(Commands.SetHorizontalOffset, Double.NegativeInfinity, null); },
        /// <summary>
        /// Horizontally scroll to the end of the content. 
        /// </summary>
//        public void 
		ScrollToRightEnd:function() { this.EnqueueCommand(Commands.SetHorizontalOffset, Double.PositiveInfinity, null); }, 
 
        /// <summary>
        /// Scroll to Top-Left of the content. 
        /// </summary>
//        public void 
		ScrollToHome:function()
        {
			this.EnqueueCommand(Commands.SetHorizontalOffset, Double.NegativeInfinity, null); 
			this.EnqueueCommand(Commands.SetVerticalOffset, Double.NegativeInfinity, null);
        }, 
        /// <summary> 
        /// Scroll to Bottom-Left of the content.
        /// </summary> 
//        public void 
        ScrollToEnd:function()
        {
        	this.EnqueueCommand(Commands.SetHorizontalOffset, Double.NegativeInfinity, null);
        	this.EnqueueCommand(Commands.SetVerticalOffset, Double.PositiveInfinity, null); 
        },
 
        /// <summary> 
        /// Vertically scroll to the beginning of the content.
        /// </summary> 
//        public void 
        ScrollToTop:function() { this.EnqueueCommand(Commands.SetVerticalOffset, Double.NegativeInfinity, null); },
        /// <summary>
        /// Vertically scroll to the end of the content.
        /// </summary> 
//        public void 
        ScrollToBottom:function() { this.EnqueueCommand(Commands.SetVerticalOffset, Double.PositiveInfinity, null); },
 
        /// <summary> 
        /// Scroll horizontally to specified offset. Not guaranteed to end up at the specified offset though.
        /// </summary> 
//        public void 
        ScrollToHorizontalOffset:function(/*double*/ offset)
        {
            var validatedOffset = ScrollContentPresenter.ValidateInputOffset(offset, "offset");
 
            // Queue up the scroll command, which tells the content to scroll.
            // Will lead to an update of all offsets (both live and deferred). 
            this.EnqueueCommand(Commands.SetHorizontalOffset, validatedOffset, null); 
        },
 
        /// <summary>
        /// Scroll vertically to specified offset. Not guaranteed to end up at the specified offset though.
        /// </summary>
//        public void 
        ScrollToVerticalOffset:function(/*double*/ offset) 
        {
            var validatedOffset = ScrollContentPresenter.ValidateInputOffset(offset, "offset"); 
 
            // Queue up the scroll command, which tells the content to scroll.
            // Will lead to an update of all offsets (both live and deferred). 
            this.EnqueueCommand(Commands.SetVerticalOffset, validatedOffset, null);
        },

//        private void 
        DeferScrollToHorizontalOffset:function(/*double*/ offset) 
        {
            var validatedOffset = ScrollContentPresenter.ValidateInputOffset(offset, "offset"); 
 
            // Update the offset property but not the deferred (content offset)
            // property, which will be updated when the drag operation is complete. 
            this.HorizontalOffset = validatedOffset;
        },

//        private void 
        DeferScrollToVerticalOffset:function(/*double*/ offset) 
        {
            var validatedOffset = ScrollContentPresenter.ValidateInputOffset(offset, "offset"); 
 
            // Update the offset property but not the deferred (content offset)
            // property, which will be updated when the drag operation is complete. 
            this.VerticalOffset = validatedOffset;
        },

//        internal void 
        MakeVisible:function(/*Visual*/ child, /*Rect*/ rect) 
        {
            var p = new MakeVisibleParams(child, rect); 
            this.EnqueueCommand(Commands.MakeVisible, 0, p); 
        },
 
//        private void 
        EnsureLayoutUpdatedHandler:function()
        {
            if (this._layoutUpdatedHandler == null)
            { 
            	this._layoutUpdatedHandler = new EventHandler(this, this.OnLayoutUpdated);
                this.LayoutUpdated.Combine( this._layoutUpdatedHandler); 
            } 
            this.InvalidateArrange(); //can be that there is no outstanding need to do layout - make sure it is.
        }, 

//        private void 
        ClearLayoutUpdatedHandler:function()
        {
            // If queue is not empty - then we still need that handler to make sure queue is being processed. 
            if ((this._layoutUpdatedHandler != null) && (this._queue.IsEmpty()))
            { 
            	this.LayoutUpdated.Remove(this._layoutUpdatedHandler); 
            	this._layoutUpdatedHandler = null;
            } 
        },

        /// <summary>
        /// This function is called by an IScrollInfo attached to this ScrollViewer when any values 
        /// of scrolling properties (Offset, Extent, and ViewportSize) change.  The function schedules
        /// invalidation of other elements like ScrollBars that are dependant on these properties. 
        /// </summary> 
//        public void 
        InvalidateScrollInfo:function()
        { 
            var isi = this.ScrollInfo;

            //STRESS 1627654: anybody can call this method even if we don't have ISI...
            if(isi == null) 
                return;
 
            // This is a public API, and is expected to be called by the 
            // IScrollInfo implementation when any of the scrolling properties
            // change.  Sometimes this is done independently (not as a result 
            // of laying out this ScrollViewer) and that means we should re-run
            // the logic of determining visibility of autoscrollbars, if any.
            //
            // However, invalidating measure during arrange is dangerous 
            // because it could lead to layout never settling down.  This has
            // been observed with the layout rounding feature and non-standard 
            // DPIs causing ScrollViewer to never settle on the visibility of 
            // autoscrollbars.
            // 
            // To guard against this condition, we only allow measure to be
            // invalidated from arrange once.
            //
            // We also don't invalidate measure if we are in the middle of the 
            // measure pass, as the ScrollViewer will already be updating the
            // visibility of the autoscrollbars. 
            if(!this.MeasureInProgress && 
               (!this.ArrangeInProgress || !this.InvalidatedMeasureFromArrange))
            { 
                //
                // Check if we should remove/add scrollbars.
                //
                var extent = ScrollInfo.ExtentWidth; 
                var viewport = ScrollInfo.ViewportWidth;
 
                if (    this.HorizontalScrollBarVisibility == ScrollBarVisibility.Auto 
                    && (    (   this._scrollVisibilityX == Visibility.Collapsed
                            &&  DoubleUtil.GreaterThan(extent, viewport)) 
                        || (    this._scrollVisibilityX == Visibility.Visible
                            &&  DoubleUtil.LessThanOrClose(extent, viewport))))
                {
                	this.InvalidateMeasure(); 
                }
                else 
                { 
                    extent = ScrollInfo.ExtentHeight;
                    viewport = ScrollInfo.ViewportHeight; 

                    if (this.VerticalScrollBarVisibility == ScrollBarVisibility.Auto
                        && ((this._scrollVisibilityY == Visibility.Collapsed
                                && DoubleUtil.GreaterThan(extent, viewport)) 
                            || (this._scrollVisibilityY == Visibility.Visible
                                && DoubleUtil.LessThanOrClose(extent, viewport)))) 
                    { 
                    	this.InvalidateMeasure();
                    } 
                }
            }

 
            // If any scrolling properties have actually changed, fire public events post-layout
            if (        !DoubleUtil.AreClose(this.HorizontalOffset, ScrollInfo.HorizontalOffset) 
                    ||  !DoubleUtil.AreClose(this.VerticalOffset, ScrollInfo.VerticalOffset) 
                    ||  !DoubleUtil.AreClose(this.ViewportWidth, ScrollInfo.ViewportWidth)
                    ||  !DoubleUtil.AreClose(this.ViewportHeight, ScrollInfo.ViewportHeight) 
                    ||  !DoubleUtil.AreClose(this.ExtentWidth, ScrollInfo.ExtentWidth)
                    ||  !DoubleUtil.AreClose(this.ExtentHeight, ScrollInfo.ExtentHeight))
            {
                this.EnsureLayoutUpdatedHandler(); 
            }
        },
        
        /// <summary>
        /// OnScrollChanged is an override called whenever scrolling state changes on this ScrollViewer.
        /// </summary> 
        /// <remarks>
        /// OnScrollChanged fires the ScrollChangedEvent.  Overriders of this method should call 
        /// base.OnScrollChanged(args) if they want the event to be fired. 
        /// </remarks>
        /// <param name="e">ScrollChangedEventArgs containing information about the change in scrolling state.</param> 
//        protected virtual void 
        OnScrollChanged:function(/*ScrollChangedEventArgs*/ e)
        {
            // Fire the event.
            this.RaiseEvent(e); 
        },
 
        /// <summary> 
        /// ScrollViewer always wants to be hit even when transparent so that it gets input such as MouseWheel.
        /// </summary> 
//        protected override HitTestResult 
        HitTestCore:function(/*PointHitTestParameters*/ hitTestParameters)
        {
            // Assumptions:
            // 1. Input comes after layout, so Actual* are valid at this point 
            // 2. The clipping part of scrolling is on the SCP, not SV.  Thus, Actual* not taking clipping into
            //    account is okay here, barring psychotic styles. 
            var rc = new Rect(0, 0, this.ActualWidth, this.ActualHeight); 
            if (rc.Contains(hitTestParameters.HitPoint))
            { 
                return new PointHitTestResult(this, hitTestParameters.HitPoint);
            }
            else
            { 
                return null;
            } 
        }, 

        /// <summary> 
        /// ScrollArea handles keyboard scrolling events.
        /// ScrollArea handles:  Left, Right, Up, Down, PageUp, PageDown, Home, End
        /// </summary>
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e) 
        {
            if (e.Handled) 
                return; 

            var templatedParentControl = this.TemplatedParent instanceof Control ? this.TemplatedParent : null; 
            if (templatedParentControl != null && templatedParentControl.HandlesScrolling)
                return;

            // If the ScrollViewer has focus or other that arrow key is pressed 
            // then it only scrolls
            if (e.OriginalSource == this) 
            { 
            	this.ScrollInDirection(e);
            } 
            // Focus is on the element within the ScrollViewer
            else
            {
                // If arrow key is pressed 
                if (e.Key == Key.Left || e.Key == Key.Right || e.Key == Key.Up || e.Key == Key.Down)
                { 
                    var viewPort = GetTemplateChild(ScrollContentPresenterTemplateName);
                    viewPort = viewPort instanceof ScrollContentPresenter ? viewPort : null; 
                    // If style changes and ConentSite cannot be found - just scroll and exit
                    if (viewPort == null) 
                    {
                        this.ScrollInDirection(e);
                        return;
                    } 

                    /*FocusNavigationDirection*/var direction = KeyboardNavigation.KeyToTraversalDirection(e.Key); 
                    /*DependencyObject*/var predictedFocus = null; 
                    var focusedElement = Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null;
                    var isFocusWithinViewport = IsInViewport(viewPort, focusedElement); 

                    if (isFocusWithinViewport)
                    {
                        // Navigate from current focused element 
                        var currentFocusUIElement = focusedElement instanceof UIElement ? focusedElement : null;
                        if (currentFocusUIElement != null) 
                        { 
                            predictedFocus = currentFocusUIElement.PredictFocus(direction);
                        } 
                        else
                        {
                            var currentFocusContentElement = focusedElement instanceof ContentElement ? focusedElement : null;
                            if (currentFocusContentElement != null) 
                            {
                                predictedFocus = currentFocusContentElement.PredictFocus(direction); 
                            } 
//                            else
//                            { 
//                                UIElement3D currentFocusUIElement3D = focusedElement as UIElement3D;
//                                if (currentFocusUIElement3D != null)
//                                {
//                                    predictedFocus = currentFocusUIElement3D.PredictFocus(direction); 
//                                }
//                            } 
                        } 
                    }
                    else 
                    { // Navigate from current viewport
                        predictedFocus = viewPort.PredictFocus(direction);
                    }
 
                    if (predictedFocus == null)
                    { 
                        // predictedFocus is null - just scroll 
                    	this.ScrollInDirection(e);
                    } 
                    else
                    {
                        // Case 1: predictedFocus is entirely in current view port
                        // Action: Set focus to predictedFocus, handle the event and exit 
                        if (this.IsInViewport(viewPort, predictedFocus))
                        { 
                            (/*(IInputElement)*/predictedFocus).Focus(); 
                            e.Handled = true;
                        } 
                        // Case 2: else - predictedFocus is not entirely in the viewport
                        // Scroll in the direction
                        // If predictedFocus is in the new viewport - set focus
                        // handle the event and exit 
                        else
                        { 
                        	this.ScrollInDirection(e); 
                        	this.UpdateLayout();
                            if (this.IsInViewport(viewPort, predictedFocus)) 
                            {
                                (/*(IInputElement)*/predictedFocus).Focus();
                            }
                        } 
                    }
                } 
                else // If other than arrow Key is down 
                {
                    this.ScrollInDirection(e); 
                }
            }
        },
 

        // Returns true only if element is partly visible in the current viewport 
//        private bool 
        IsInViewport:function(/*ScrollContentPresenter*/ scp, /*DependencyObject*/ element) 
        {
            var baseRoot = KeyboardNavigation.GetVisualRoot(scp); 
            var elementRoot = KeyboardNavigation.GetVisualRoot(element);

            // If scp and element are not under the same root, find the
            // parent of root of element and try with it instead and so on. 
            while (baseRoot != elementRoot)
            { 
                if (elementRoot == null) 
                {
                    return false; 
                }

                var fe = elementRoot instanceof FrameworkElement ? elementRoot : null;
                if (fe == null) 
                {
                    return false; 
                } 

                element = fe.Parent; 
                if (element == null)
                {
                    return false;
                } 

                elementRoot = KeyboardNavigation.GetVisualRoot(element); 
            } 

            var viewPortRect = KeyboardNavigation.GetRectangle(scp); 
            var elementRect = KeyboardNavigation.GetRectangle(element);
            return viewPortRect.IntersectsWith(elementRect);
        },
 
//        internal void 
        ScrollInDirection:function(/*KeyEventArgs*/ e)
        { 
            var fControlDown = ((e.KeyboardDevice.Modifiers & ModifierKeys.Control) != 0); 
            var fAltDown = ((e.KeyboardDevice.Modifiers & ModifierKeys.Alt) != 0);
 
            // We don't handle Alt + Key
            if (!fAltDown)
            {
                var fInvertForRTL = (FlowDirection == FlowDirection.RightToLeft); 
                switch (e.Key)
                { 
                    case Key.Left: 
                        if (fInvertForRTL) this.LineRight(); else LineLeft();
                        e.Handled = true; 
                        break;
                    case Key.Right:
                        if (fInvertForRTL) this.LineLeft(); else LineRight();
                        e.Handled = true; 
                        break;
                    case Key.Up: 
                    	this.LineUp(); 
                        e.Handled = true;
                        break; 
                    case Key.Down:
                    	this.LineDown();
                        e.Handled = true;
                        break; 
                    case Key.PageUp:
                    	this.PageUp(); 
                        e.Handled = true; 
                        break;
                    case Key.PageDown: 
                    	this.PageDown();
                        e.Handled = true;
                        break;
                    case Key.Home: 
                        if (fControlDown) this.ScrollToTop(); else ScrollToLeftEnd();
                        e.Handled = true; 
                        break; 
                    case Key.End:
                        if (fControlDown) this.ScrollToBottom(); else ScrollToRightEnd(); 
                        e.Handled = true;
                        break;
                }
            } 
        },
 
        /// <summary> 
        /// This is the method that responds to the MouseWheel event.
        /// </summary> 
        /// <param name="e">Event Arguments</param>
//        protected override void 
        OnMouseWheel:function(/*MouseWheelEventArgs*/ e)
        {
            if (e.Handled) { return; } 

            if (!this.HandlesMouseWheelScrolling) 
            { 
                return;
            } 

            if (this.ScrollInfo != null)
            {
                if (e.Delta < 0) { ScrollInfo.MouseWheelDown(); } 
                else { ScrollInfo.MouseWheelUp(); }
            } 
 
            e.Handled = true;
        }, 

        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) 
        { 
            if (this.Focus())
                e.Handled = true; 
            base.OnMouseLeftButtonDown(e);
        },

        /// <summary> 
        /// Updates DesiredSize of the ScrollViewer.  Called by parent UIElement.  This is the first pass of layout.
        /// </summary> 
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param> 
        /// <returns>The ScrollViewer's desired size.</returns>
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint) 
        {
        	this.InChildInvalidateMeasure = false;
            /*IScrollInfo*/var isi = this.ScrollInfo;
            var count = this.VisualChildrenCount; 

            var child = (count > 0) ? (this.GetVisualChild(0) instanceof UIElement ? this.GetVisualChild(0) : null) : null; 
            /*ScrollBarVisibility*/var vsbv = this.VerticalScrollBarVisibility; 
            /*ScrollBarVisibility*/var hsbv = this.HorizontalScrollBarVisibility;
            var desiredSize = new Size(); 

            if (child != null)
            {
                	var vsbAuto = (vsbv == ScrollBarVisibility.Auto);
                	var hsbAuto = (hsbv == ScrollBarVisibility.Auto); 
                	var vDisableScroll = (vsbv == ScrollBarVisibility.Disabled);
                	var hDisableScroll = (hsbv == ScrollBarVisibility.Disabled); 
                    /*Visibility*/var vv = (vsbv == ScrollBarVisibility.Visible) ? Visibility.Visible : Visibility.Collapsed; 
                    /*Visibility*/var hv = (hsbv == ScrollBarVisibility.Visible) ? Visibility.Visible : Visibility.Collapsed;
 
                    if (this._scrollVisibilityY != vv)
                    {
                        this._scrollVisibilityY = vv;
                        this.SetValue(ComputedVerticalScrollBarVisibilityPropertyKey, this._scrollVisibilityY); 
                    }
                    if (this._scrollVisibilityX != hv) 
                    { 
                    	this._scrollVisibilityX = hv;
                    	this.SetValue(ComputedHorizontalScrollBarVisibilityPropertyKey, this._scrollVisibilityX); 
                    }

                    if (isi != null)
                    { 
                        isi.CanHorizontallyScroll = !hDisableScroll;
                        isi.CanVerticallyScroll = !vDisableScroll; 
                    } 

                    try 
                    {
                        // Measure our visual tree.
                    	this.InChildMeasurePass1 = true;
                        child.Measure(constraint); 
                    }
                    finally 
                    { 
                    	this.InChildMeasurePass1 = false;
                    } 

                    //it could now be here as a result of visual template expansion that happens during Measure
                    isi = this.ScrollInfo;
 
                    if (isi != null && (hsbAuto || vsbAuto))
                    { 
                    	var makeHorizontalBarVisible = hsbAuto && DoubleUtil.GreaterThan(isi.ExtentWidth, isi.ViewportWidth); 
                    	var makeVerticalBarVisible = vsbAuto && DoubleUtil.GreaterThan(isi.ExtentHeight, isi.ViewportHeight);
 
                        if (makeHorizontalBarVisible)
                        {
                            if (this._scrollVisibilityX != Visibility.Visible)
                            { 
                            	this._scrollVisibilityX = Visibility.Visible;
                            	this.SetValue(ComputedHorizontalScrollBarVisibilityPropertyKey, _scrollVisibilityX); 
                            } 
                        }
 
                        if (makeVerticalBarVisible)
                        {
                            if (this._scrollVisibilityY != Visibility.Visible)
                            { 
                            	this._scrollVisibilityY = Visibility.Visible;
                            	this.SetValue(ComputedVerticalScrollBarVisibilityPropertyKey, this._scrollVisibilityY); 
                            } 
                        }
 
                        if (makeHorizontalBarVisible || makeVerticalBarVisible)
                        {
                            // Remeasure our visual tree.
                            // Requires this extra invalidation because we need to remeasure Grid which is not neccessarily dirty now 
                            // since we only invlaidated scrollbars but we don't have LayoutUpdate loop at our disposal here
                        	this.InChildInvalidateMeasure = true; 
                            child.InvalidateMeasure(); 

                            try 
                            {
                            	this.InChildMeasurePass2 = true;
                            	this.child.Measure(constraint);
                            } 
                            finally
                            { 
                            	this.InChildMeasurePass2 = false; 
                            }
                        } 

                        //if both are Auto, then appearance of one scrollbar may causes appearance of another.
                        //If we don't re-check here, we get some part of content covered by auto scrollbar and can never reach to it since
                        //another scrollbar may not appear (in cases when viewport==extent) - bug 1199443 
                        if(hsbAuto && vsbAuto && (makeHorizontalBarVisible != makeVerticalBarVisible))
                        { 
                        	var makeHorizontalBarVisible2 = !makeHorizontalBarVisible && DoubleUtil.GreaterThan(isi.ExtentWidth, isi.ViewportWidth); 
                        	var makeVerticalBarVisible2 = !makeVerticalBarVisible && DoubleUtil.GreaterThan(isi.ExtentHeight, isi.ViewportHeight);
 
                            if(makeHorizontalBarVisible2)
                            {
                                if (this._scrollVisibilityX != Visibility.Visible)
                                { 
                                	this._scrollVisibilityX = Visibility.Visible;
                                	this.SetValue(ComputedHorizontalScrollBarVisibilityPropertyKey, _scrollVisibilityX); 
                                } 
                            }
                            else if (makeVerticalBarVisible2) //only one can be true 
                            {
                                if (this._scrollVisibilityY != Visibility.Visible)
                                {
                                	this._scrollVisibilityY = Visibility.Visible; 
                                	this.SetValue(ComputedVerticalScrollBarVisibilityPropertyKey, _scrollVisibilityY);
                                } 
                            } 

                            if (makeHorizontalBarVisible2 || makeVerticalBarVisible2) 
                            {
                                // Remeasure our visual tree.
                                // Requires this extra invalidation because we need to remeasure Grid which is not neccessarily dirty now
                                // since we only invlaidated scrollbars but we don't have LayoutUpdate loop at our disposal here 
                            	this.InChildInvalidateMeasure = true;
                                child.InvalidateMeasure(); 
 
                                try
                                { 
                                	this.InChildMeasurePass3 = true;
                                	this.child.Measure(constraint);
                                }
                                finally 
                                {
                                	this.InChildMeasurePass3 = false; 
                                } 
                            }
 
                        }
                    }

                desiredSize = child.DesiredSize; 
            }
 
 
            if(!ArrangeDirty && InvalidatedMeasureFromArrange)
            { 
                // If we invalidated measure from a previous arrange pass, but
                // if after the following measure pass we are not dirty for
                // arrange, then ArrangeOverride will not get called, and we
                // need to clean up our state here. 
            	this.InvalidatedMeasureFromArrange = false;
            } 
 
            return desiredSize;
        }, 

//        protected override Size 
        ArrangeOverride:function()
        {
            var previouslyInvalidatedMeasureFromArrange = this.InvalidatedMeasureFromArrange; 

            var size = base.ArrangeOverride(arrangeSize); 
 
            if(previouslyInvalidatedMeasureFromArrange)
            { 
                // If we invalidated measure from a previous arrange pass,
                // then we are not supposed to invalidate measure this time.
                Debug.Assert(!MeasureDirty);
                this.InvalidatedMeasureFromArrange = false; 
            }
            else 
            { 
                this.InvalidatedMeasureFromArrange = this.MeasureDirty;
            } 

            return size;
        },
 
//        private void 
        BindToTemplatedParent:function(/*DependencyProperty*/ property)
        { 
            if (!this.HasNonDefaultValue(property)) 
            {
                var binding = new Binding(); 
                binding.RelativeSource = RelativeSource.TemplatedParent;
                binding.Path = new PropertyPath(property);
                this.SetBinding(property, binding);
            } 
        },
 
        /// <summary> 
        /// ScrollViewer binds to the TemplatedParent's attached properties
        /// if they are not set directly on the ScrollViewer 
        /// </summary>
//        internal override void 
        OnPreApplyTemplate:function()
        {
            base.OnPreApplyTemplate(); 

            if (TemplatedParent != null) 
            { 
                this.BindToTemplatedParent(ScrollViewer.HorizontalScrollBarVisibilityProperty);
                this.BindToTemplatedParent(ScrollViewer.VerticalScrollBarVisibilityProperty); 
                this.BindToTemplatedParent(ScrollViewer.CanContentScrollProperty);
                this.BindToTemplatedParent(ScrollViewer.IsDeferredScrollingEnabledProperty);
                this.BindToTemplatedParent(ScrollViewer.PanningModeProperty);
            } 
        },
 
        /// <summary> 
        /// Called when the Template's tree has been generated
        /// </summary> 
//        public override void 
        OnApplyTemplate:function()
        {
            base.OnApplyTemplate();
 
            var scrollBar = this.GetTemplateChild(HorizontalScrollBarTemplateName);
            scrollBar = scrollBar instanceof ScrollBar ? scrollBar : null;
 
            if (scrollBar != null) 
                scrollBar.IsStandalone = false;
 
            scrollBar = this.GetTemplateChild(VerticalScrollBarTemplateName);
            scrollBar = scrollBar instanceof ScrollBar ? scrollBar : null;

            if (scrollBar != null)
                scrollBar.IsStandalone = false; 

            this.OnPanningModeChanged(); 
        }, 
        
        /// <summary>
        ///     Method which sets IsManipulationEnabled
        ///     property based on the PanningMode
        /// </summary> 
//        private void 
        OnPanningModeChanged:function()
        { 
            if (!this.HasTemplateGeneratedSubTree) 
            {
                return; 
            }
            var mode = this.PanningMode;

            // Call InvalidateProperty for IsManipulationEnabledProperty 
            // to reset previous SetCurrentValueInternal if any.
            // Then call SetCurrentValueInternal to 
            // set the value of these properties if needed. 
            this.InvalidateProperty(ScrollViewer.IsManipulationEnabledProperty);
 
            if (mode != PanningMode.None)
            {
            	this.SetCurrentValueInternal(ScrollViewer.IsManipulationEnabledProperty, true);
            } 
        },
        
//        protected override void 
        OnManipulationStarting:function(/*ManipulationStartingEventArgs*/ e) 
        {
        	this._panningInfo = null; 
            /*PanningMode*/var panningMode = this.PanningMode;
            if (panningMode != PanningMode.None)
            {
                this.CompleteScrollManipulation = false; 
                /*ScrollContentPresenter*/var viewport = this.GetTemplateChild(ScrollContentPresenterTemplateName);
                viewport = viewport instanceof ScrollContentPresenter ? viewport : null;
 
                if (this.ShouldManipulateScroll(e, viewport)) 
                {
                    // Set Manipulation mode and container 
                    if (panningMode == PanningMode.HorizontalOnly)
                    {
                        e.Mode = ManipulationModes.TranslateX;
                    } 
                    else if (panningMode == PanningMode.VerticalOnly)
                    { 
                        e.Mode = ManipulationModes.TranslateY; 
                    }
                    else 
                    {
                        e.Mode = ManipulationModes.Translate;
                    }
                    e.ManipulationContainer = this; 

                    // initialize _panningInfo 
                    this._panningInfo = new PanningInfo(); 
                	this._panningInfo.OriginalHorizontalOffset = this.HorizontalOffset, 
                	this._panningInfo.OriginalVerticalOffset = this.VerticalOffset,
                	this._panningInfo.PanningMode = panningMode
 
                    // Determine pixels per offset value. This is useful when performing non-pixel scrolling.
 
                    var viewportWidth = this.ViewportWidth + 1; // Using +1 to account for last partially visible item in viewport 
                    var viewportHeight = this.ViewportHeight + 1; // Using +1 to account for last partially visible item in viewport
                    if (viewport != null) 
                    {
                    	this._panningInfo.DeltaPerHorizontalOffet = (DoubleUtil.AreClose(viewportWidth, 0) ? 0 : viewport.ActualWidth / viewportWidth);
                    	this._panningInfo.DeltaPerVerticalOffset = (DoubleUtil.AreClose(viewportHeight, 0) ? 0 : viewport.ActualHeight / viewportHeight);
                    } 
                    else
                    { 
                    	this._panningInfo.DeltaPerHorizontalOffet = (DoubleUtil.AreClose(viewportWidth, 0) ? 0 : ActualWidth / viewportWidth); 
                    	this._panningInfo.DeltaPerVerticalOffset = (DoubleUtil.AreClose(viewportHeight, 0) ? 0 : ActualHeight / viewportHeight);
                    } 

                    // Template bind other Scroll Manipulation properties if needed.
                    if (!ManipulationBindingsInitialized)
                    { 
                    	this.BindToTemplatedParent(PanningDecelerationProperty);
                    	this.BindToTemplatedParent(PanningRatioProperty); 
                    	this.ManipulationBindingsInitialized = true; 
                    }
                } 
                else
                {
                    e.Cancel();
                    ForceNextManipulationComplete = false; 
                }
                e.Handled = true; 
            } 
        },
 
//        private bool 
        ShouldManipulateScroll:function(/*ManipulationStartingEventArgs*/ e, /*ScrollContentPresenter*/ viewport)
        {
            // If the original source is not from the same PresentationSource as of ScrollViewer,
            // then do not start the manipulation. 
            if (!PresentationSource.UnderSamePresentationSource(e.OriginalSource instanceof DependencyObject ? e.OriginalSource : null, this))
            { 
                return false; 
            }
 
            if (viewport == null)
            {
                // If there is no ScrollContentPresenter, then always start Manipulation
                return true; 
            }
 
            // Dont start the manipulation if any of the manipulator positions 
            // does not lie inside the viewport.
            /*GeneralTransform*/var viewportTransform = TransformToDescendant(viewport); 
            var viewportWidth = viewport.ActualWidth;
            var viewportHeight = viewport.ActualHeight;
            for/*each*/ (var i=0; i< e.Manipulators.Count; i++) //IManipulator manipulator in e.Manipulators)
            { 
            	var manipulator = e.Manipulators.Get(i);
            	var manipulatorPosition = viewportTransform.Transform(manipulator.GetPosition(this));
                if (DoubleUtil.LessThan(manipulatorPosition.X, 0) || 
                    DoubleUtil.LessThan(manipulatorPosition.Y, 0) || 
                    DoubleUtil.GreaterThan(manipulatorPosition.X, viewportWidth) ||
                    DoubleUtil.GreaterThan(manipulatorPosition.Y, viewportHeight)) 
                {
                    return false;
                }
            } 
            return true;
        },
 
//        protected override void 
        OnManipulationDelta:function(/*ManipulationDeltaEventArgs*/ e)
        { 
            if (_panningInfo != null)
            {
                if (e.IsInertial && CompleteScrollManipulation)
                { 
                    e.Complete();
                } 
                else 
                {
                    var cancelManipulation = false; 
                    if (_panningInfo.IsPanning)
                    {
                        // Do the scrolling if we already started it.
                        ManipulateScroll(e); 
                    }
                    else if (CanStartScrollManipulation(e.CumulativeManipulation.Translation, /*out cancelManipulation*/cancelManipulationOut)) 
                    { 
                        // Check if we can start the scrolling and do accordingly
                        _panningInfo.IsPanning = true; 
                        ManipulateScroll(e);
                    }
                    else if (cancelManipulation)
                    { 
                        e.Cancel();
                        _panningInfo = null; 
                    } 
                }
 
                e.Handled = true;
            }
        },
 
//        private void 
        ManipulateScroll:function(/*ManipulationDeltaEventArgs*/ e)
        { 
            Debug.Assert(_panningInfo != null); 
            var panningMode = _panningInfo.PanningMode;
            if (panningMode != PanningMode.VerticalOnly) 
            {
                // Scroll horizontally unless the mode is VerticalOnly
                ManipulateScroll(e.DeltaManipulation.Translation.X, e.CumulativeManipulation.Translation.X, true);
            } 

            if (panningMode != PanningMode.HorizontalOnly) 
            { 
                // Scroll vertically unless the mode is HorizontalOnly
                ManipulateScroll(e.DeltaManipulation.Translation.Y, e.CumulativeManipulation.Translation.Y, false); 
            }

            if (e.IsInertial && IsPastInertialLimit())
            { 
                e.Complete();
            } 
            else 
            {
                var unusedX = _panningInfo.UnusedTranslation.X; 
                if (!_panningInfo.InHorizontalFeedback &&
                    DoubleUtil.LessThan(Math.Abs(unusedX), PanningInfo.PreFeedbackTranslationX))
                {
                    unusedX = 0; 
                }
                _panningInfo.InHorizontalFeedback = (!DoubleUtil.AreClose(unusedX, 0)); 
 
                var unusedY = _panningInfo.UnusedTranslation.Y;
                if (!_panningInfo.InVerticalFeedback && 
                    DoubleUtil.LessThan(Math.Abs(unusedY), PanningInfo.PreFeedbackTranslationY))
                {
                    unusedY = 0;
                } 
                _panningInfo.InVerticalFeedback = (!DoubleUtil.AreClose(unusedY, 0));
 
                if (_panningInfo.InHorizontalFeedback || _panningInfo.InVerticalFeedback) 
                {
                    // Report boundary feedback if needed 
                    e.ReportBoundaryFeedback(new ManipulationDelta(new Vector(unusedX, unusedY), 0.0, new Vector(1.0, 1.0), new Vector()));

                    if (e.IsInertial && _panningInfo.InertiaBoundaryBeginTimestamp == 0)
                    { 
                        _panningInfo.InertiaBoundaryBeginTimestamp = Environment.TickCount;
                    } 
                } 
            }
        },

//        private void 
        ManipulateScroll:function(/*double*/ delta, /*double*/ cumulativeTranslation, /*bool*/ isHorizontal)
        {
            var unused = (isHorizontal ? _panningInfo.UnusedTranslation.X : _panningInfo.UnusedTranslation.Y); 
            var offset = (isHorizontal ? HorizontalOffset : VerticalOffset);
            var scrollableLength = (isHorizontal ? ScrollableWidth : ScrollableHeight); 
 
            if (DoubleUtil.AreClose(scrollableLength, 0))
            { 
                // If the Scrollable length in this direction is 0,
                // then we should neither scroll nor report the boundary feedback
                unused = 0;
                delta = 0; 
            }
            else if ((DoubleUtil.GreaterThan(delta, 0) && DoubleUtil.AreClose(offset, 0)) || 
                (DoubleUtil.LessThan(delta, 0) && DoubleUtil.AreClose(offset, scrollableLength))) 
            {
                // If we are past the boundary and the delta is in the same direction, 
                // then add the delta to the unused vector
                unused += delta;
                delta = 0;
            } 
            else if (DoubleUtil.LessThan(delta, 0) && DoubleUtil.GreaterThan(unused, 0))
            { 
                // If we are past the boundary in positive direction 
                // and the delta is in negative direction,
                // then compensate the delta from unused vector. 
                var newUnused = Math.Max(unused + delta, 0);
                delta += unused - newUnused;
                unused = newUnused;
            } 
            else if (DoubleUtil.GreaterThan(delta, 0) && DoubleUtil.LessThan(unused, 0))
            { 
                // If we are past the boundary in negative direction 
                // and the delta is in positive direction,
                // then compensate the delta from unused vector. 
                var newUnused = Math.Min(unused + delta, 0);
                delta += unused - newUnused;
                unused = newUnused;
            } 

            if (isHorizontal) 
            { 
                if (!DoubleUtil.AreClose(delta, 0))
                { 
                    // if there is any delta left, then re-evalute the horizontal offset
                    ScrollToHorizontalOffset(_panningInfo.OriginalHorizontalOffset -
                        Math.Round(PanningRatio * cumulativeTranslation / _panningInfo.DeltaPerHorizontalOffet));
                } 
                _panningInfo.UnusedTranslation = new Vector(unused, _panningInfo.UnusedTranslation.Y);
            } 
            else 
            {
                if (!DoubleUtil.AreClose(delta, 0)) 
                {
                    // if there is any delta left, then re-evalute the vertical offset
                    ScrollToVerticalOffset(_panningInfo.OriginalVerticalOffset -
                        Math.Round(PanningRatio * cumulativeTranslation / _panningInfo.DeltaPerVerticalOffset)); 
                }
                _panningInfo.UnusedTranslation = new Vector(_panningInfo.UnusedTranslation.X, unused); 
            } 
        },
 
        /// <summary>
        ///     Translation due to intertia past the boundary is restricted to a certain limit.
        ///     This method checks if the unused vector falls beyound that limit
        /// </summary> 
        /// <returns></returns>
//        private bool 
        IsPastInertialLimit:function() 
        { 
            if (Math.Abs(Environment.TickCount - _panningInfo.InertiaBoundaryBeginTimestamp) < PanningInfo.InertiaBoundryMinimumTicks)
            { 
                return false;
            }

            return (DoubleUtil.GreaterThanOrClose(Math.Abs(_panningInfo.UnusedTranslation.X), PanningInfo.MaxInertiaBoundaryTranslation) || 
                DoubleUtil.GreaterThanOrClose(Math.Abs(_panningInfo.UnusedTranslation.Y), PanningInfo.MaxInertiaBoundaryTranslation));
        }, 
 
        /// <summary>
        ///     Scrolling due to manipulation can start only if there is a considerable delta 
        ///     in the direction based on the mode. This method makes sure that the delta is
        ///     considerable.
        /// </summary>
//        private bool 
        CanStartScrollManipulation:function(/*Vector*/ translation, /*out bool cancelManipulation*/cancelManipulationOut) 
        {
            Debug.Assert(_panningInfo != null); 
            cancelManipulation = false; 
            var panningMode = _panningInfo.PanningMode;
            if (panningMode == PanningMode.None) 
            {
                cancelManipulation = true;
                return false;
            } 

            var validX = (DoubleUtil.GreaterThan(Math.Abs(translation.X), PanningInfo.PrePanTranslation)); 
            var validY = (DoubleUtil.GreaterThan(Math.Abs(translation.Y), PanningInfo.PrePanTranslation)); 

            if (((panningMode == PanningMode.Both) && (validX || validY)) || 
                (panningMode == PanningMode.HorizontalOnly && validX) ||
                (panningMode == PanningMode.VerticalOnly && validY))
            {
                return true; 
            }
            else if (panningMode == PanningMode.HorizontalFirst) 
            { 
                var biggerX = (DoubleUtil.GreaterThanOrClose(Math.Abs(translation.X), Math.Abs(translation.Y)));
                if (validX && biggerX) 
                {
                    return true;
                }
                else if (validY) 
                {
                    cancelManipulation = true; 
                    return false; 
                }
            } 
            else if (panningMode == PanningMode.VerticalFirst)
            {
                var biggerY = (DoubleUtil.GreaterThanOrClose(Math.Abs(translation.Y), Math.Abs(translation.X)));
                if (validY && biggerY) 
                {
                    return true; 
                } 
                else if (validX)
                { 
                    cancelManipulation = true;
                    return false;
                }
            } 

            return false; 
        }, 

//        protected override void 
        OnManipulationInertiaStarting:function(/*ManipulationInertiaStartingEventArgs*/ e) 
        {
            if (_panningInfo != null)
            {
                if (!_panningInfo.IsPanning && !ForceNextManipulationComplete) 
                {
                    // If the inertia starts and we are not scrolling yet, then cancel the manipulation. 
                    e.Cancel(); 
                    _panningInfo = null;
                } 
                else
                {
                    e.TranslationBehavior.DesiredDeceleration = PanningDeceleration;
                } 
                e.Handled = true;
            } 
        }, 

//        protected override void 
        OnManipulationCompleted:function(/*ManipulationCompletedEventArgs*/ e) 
        {
            if (_panningInfo != null)
            {
                if (!(e.IsInertial && CompleteScrollManipulation)) 
                {
                    if (e.IsInertial && 
                        !DoubleUtil.AreClose(e.FinalVelocities.LinearVelocity, new Vector()) && 
                        !IsPastInertialLimit())
                    { 
                        // if an inertial manipualtion gets completed without its LinearVelocity reaching 0,
                        // then most probably it was forced to complete by other manipulation.
                        // In such case we dont want the next manipulation to ever cancel.
                        ForceNextManipulationComplete = true; 
                    }
                    else 
                    { 
                        if (!e.IsInertial && !_panningInfo.IsPanning && !ForceNextManipulationComplete)
                        { 
                            // If we are not scrolling yet and the manipulation gets completed, then cancel the manipulation.
                            e.Cancel();
                        }
                        ForceNextManipulationComplete = false; 
                    }
                } 
                _panningInfo = null; 
                CompleteScrollManipulation = false;
                e.Handled = true; 
            }
        },
        
        //returns true if there was a command sent to ISI
//        private bool
        ExecuteNextCommand:function()
        {
            var isi = this.ScrollInfo; 
            if(isi == null) return false;
 
            var cmd = _queue.Fetch(); 
            switch(cmd.Code)
            { 
                case Commands.LineUp:    isi.LineUp();    break;
                case Commands.LineDown:  isi.LineDown();  break;
                case Commands.LineLeft:  isi.LineLeft();  break;
                case Commands.LineRight: isi.LineRight(); break; 

                case Commands.PageUp:    isi.PageUp();    break; 
                case Commands.PageDown:  isi.PageDown();  break; 
                case Commands.PageLeft:  isi.PageLeft();  break;
                case Commands.PageRight: isi.PageRight(); break; 

                case Commands.SetHorizontalOffset: isi.SetHorizontalOffset(cmd.Param); break;
                case Commands.SetVerticalOffset:   isi.SetVerticalOffset(cmd.Param);   break;
 
                case Commands.MakeVisible:
                { 
                    var child = cmd.MakeVisibleParam.Child; 
                    var visi = isi instanceof Visual ? isi : null;
 
                    if (    child != null
                        &&  visi != null
                        &&  (visi == child || visi.IsAncestorOf(child))
                        //  bug 1616807. ISI could be removed from visual tree, 
                        //  but ScrollViewer.ScrollInfo may not reflect this yet.
                        &&  this.IsAncestorOf(visi) ) 
                    { 
                        var targetRect = cmd.MakeVisibleParam.TargetRect;
                        if(targetRect.IsEmpty) 
                        {
                            var uie = child instanceof UIElement ? child : null;
                            if(uie != null)
                                targetRect = new Rect(uie.RenderSize); 
                            else
                                targetRect = new Rect(); //not a good idea to invoke ISI with Empty rect 
                        } 

                        // 



                        var rcNew; 
                        if(isi.GetType() == typeof(System.Windows.Controls.ScrollContentPresenter))
                        { 
                            rcNew = (/*(System.Windows.Controls.ScrollContentPresenter)*/isi).MakeVisible(child, targetRect, false); 
                        }
                        else 
                        {
                            rcNew = isi.MakeVisible(child, targetRect);
                        }
 
                        if (!rcNew.IsEmpty)
                        { 
                            var t = visi.TransformToAncestor(this); 
                            rcNew = t.TransformBounds(rcNew);
                        } 

                        BringIntoView(rcNew);
                    }
                } 
                break;
 
                case Commands.Invalid: return false; 
            }
            return true; 
        },

//        private void 
        EnqueueCommand:function(/*Commands*/ code, /*double*/ param, /*MakeVisibleParams*/ mvp)
        { 
            _queue.Enqueue(new Command(code, param, mvp));
            EnsureQueueProcessing(); 
        }, 

//        private void 
        EnsureQueueProcessing:function() 
        {
            if(!_queue.IsEmpty())
            {
                EnsureLayoutUpdatedHandler(); 
            }
        }, 
 
        // LayoutUpdated event handler.
        // 1. executes next queued command, if any 
        // 2. If no commands to execute, updates properties and fires events
//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e)
        {
            // if there was a command, execute it and leave the handler for the next pass 
            if(ExecuteNextCommand())
            { 
                InvalidateArrange(); 
                return;
            } 

            var oldActualHorizontalOffset = this.HorizontalOffset;
            var oldActualVerticalOffset = this.VerticalOffset;
 
            var oldViewportWidth = this.ViewportWidth;
            var oldViewportHeight = this.ViewportHeight; 
 
            var oldExtentWidth = this.ExtentWidth;
            var oldExtentHeight = this.ExtentHeight; 

            var oldScrollableWidth = this.ScrollableWidth;
            var oldScrollableHeight = this.ScrollableHeight;
 
            var changed = false;
 
            // 
            // Go through scrolling properties updating values.
            // 
            if (ScrollInfo != null && !DoubleUtil.AreClose(oldActualHorizontalOffset, ScrollInfo.HorizontalOffset))
            {
                _xPositionISI = ScrollInfo.HorizontalOffset;
                this.HorizontalOffset = _xPositionISI; 
                this.ContentHorizontalOffset = _xPositionISI;
                changed = true; 
            } 

            if (ScrollInfo != null && !DoubleUtil.AreClose(oldActualVerticalOffset, ScrollInfo.VerticalOffset)) 
            {
            	this._yPositionISI = ScrollInfo.VerticalOffset;
                this.VerticalOffset = _yPositionISI;
                this.ContentVerticalOffset = _yPositionISI; 
                changed = true;
            } 
 
            if (ScrollInfo != null && !DoubleUtil.AreClose(oldViewportWidth, ScrollInfo.ViewportWidth))
            { 
            	this._xSize = ScrollInfo.ViewportWidth;
            	this.SetValue(ViewportWidthPropertyKey, _xSize);
                changed = true;
            } 

            if (ScrollInfo != null && !DoubleUtil.AreClose(oldViewportHeight, ScrollInfo.ViewportHeight)) 
            { 
            	this._ySize = ScrollInfo.ViewportHeight;
            	this.SetValue(ViewportHeightPropertyKey, _ySize); 
                changed = true;
            }

            if (ScrollInfo != null && !DoubleUtil.AreClose(oldExtentWidth, ScrollInfo.ExtentWidth)) 
            {
            	this._xExtent = ScrollInfo.ExtentWidth; 
                this.SetValue(ExtentWidthPropertyKey, _xExtent); 
                changed = true;
            } 

            if (ScrollInfo != null && !DoubleUtil.AreClose(oldExtentHeight, ScrollInfo.ExtentHeight))
            {
            	this._yExtent = ScrollInfo.ExtentHeight; 
            	this.SetValue(ExtentHeightPropertyKey, _yExtent);
                changed = true; 
            } 

            // ScrollableWidth/Height are dependant on Viewport and Extent set above.  This check must be done after those. 
            var scrollableWidth = ScrollableWidth;
            if (!DoubleUtil.AreClose(oldScrollableWidth, ScrollableWidth))
            {
            	this.SetValue(ScrollableWidthPropertyKey, scrollableWidth); 
                changed = true;
            } 
 
            var scrollableHeight = ScrollableHeight;
            if (!DoubleUtil.AreClose(oldScrollableHeight, ScrollableHeight)) 
            {
            	this.SetValue(ScrollableHeightPropertyKey, scrollableHeight);
                changed = true;
            } 

            Debug.Assert(DoubleUtil.GreaterThanOrClose(_xSize, 0.0) && DoubleUtil.GreaterThanOrClose(_ySize, 0.0), "Negative size for scrolling viewport.  Bad IScrollInfo implementation."); 
 

            // 
            // Fire scrolling events.
            //
            if(changed)
            { 
                // Fire ScrollChange event
                var args = new ScrollChangedEventArgs( 
                    new Vector(HorizontalOffset, VerticalOffset), 
                    new Vector(HorizontalOffset - oldActualHorizontalOffset, VerticalOffset - oldActualVerticalOffset),
                    new Size(ExtentWidth, ExtentHeight), 
                    new Vector(ExtentWidth - oldExtentWidth, ExtentHeight - oldExtentHeight),
                    new Size(ViewportWidth, ViewportHeight),
                    new Vector(ViewportWidth - oldViewportWidth, ViewportHeight - oldViewportHeight));
                args.RoutedEvent = ScrollChangedEvent; 
                args.Source = this;
 
                try 
                {
 
                	this.OnScrollChanged(args);

//                    // Fire automation events if automation is active.
//                    ScrollViewerAutomationPeer peer = UIElementAutomationPeer.FromElement(this) as ScrollViewerAutomationPeer; 
//                    if(peer != null)
//                    { 
//                        peer.RaiseAutomationEvents(oldExtentWidth, 
//                                                   oldExtentHeight,
//                                                   oldViewportWidth, 
//                                                   oldViewportHeight,
//                                                   oldActualHorizontalOffset,
//                                                   oldActualVerticalOffset);
//                    } 
                }
                finally 
                { 
                    //
                    // Disconnect the layout listener. 
                    //
                	this.ClearLayoutUpdatedHandler();
                }
            } 

            this.ClearLayoutUpdatedHandler(); 
        },
        
//        private void 
        SetFlagValue:function(/*Flags*/ flag, /*bool*/ value) 
        {
            if (value) 
            { 
                this._flags |= flag;
            } 
            else
            {
            	this._flags &= ~flag;
            } 
        },
	});
	
	Object.defineProperties(ScrollViewer.prototype,{

        /// <summary> 
        /// This property indicates whether the Content should handle scrolling if it can.
        /// A true value indicates Content should be allowed to scroll if it supports IScrollInfo.
        /// A false value will always use the default physically scrolling handler.
        /// </summary> 
//        public bool 
		CanContentScroll:
        { 
            get:function() { return this.GetValue(CanContentScrollProperty); }, 
            set:function(value) { this.SetValue(CanContentScrollProperty, value); }
        }, 

        /// <summary>
        /// HorizonalScollbarVisibility is a <see cref="System.Windows.Controls.ScrollBarVisibility" /> that
        /// determines if a horizontal scrollbar is shown. 
        /// </summary>
//        public ScrollBarVisibility 
        HorizontalScrollBarVisibility: 
        {
            get:function() { return this.GetValue(HorizontalScrollBarVisibilityProperty); }, 
            set:function(value) { this.SetValue(HorizontalScrollBarVisibilityProperty, value); }
        },

        /// <summary> 
        /// VerticalScrollBarVisibility is a <see cref="System.Windows.Controls.ScrollBarVisibility" /> that
        /// determines if a vertical scrollbar is shown. 
        /// </summary> 
//        public ScrollBarVisibility 
        VerticalScrollBarVisibility: 
        {
            get:function() { return this.GetValue(VerticalScrollBarVisibilityProperty); },
            set:function(value) { this.SetValue(VerticalScrollBarVisibilityProperty, value); }
        }, 

        /// <summary> 
        /// ComputedHorizontalScrollBarVisibility contains the ScrollViewer's current calculation as to 
        /// whether or not scrollbars should be displayed.
        /// </summary> 
//        public Visibility 
        ComputedHorizontalScrollBarVisibility:
        {
            get:function() { return this._scrollVisibilityX; }
        }, 
        /// <summary>
        /// ComputedVerticalScrollBarVisibility contains the ScrollViewer's current calculation as to 
        /// whether or not scrollbars should be displayed. 
        /// </summary>
//        public Visibility 
        ComputedVerticalScrollBarVisibility: 
        {
            get:function() { return this._scrollVisibilityY; }
        },
 
        /// <summary>
        /// Actual HorizontalOffset contains the ScrollViewer's current horizontal offset. 
        /// This is a computed value, derived from viewport/content size and previous scroll commands 
        /// </summary>
//        public double 
        HorizontalOffset: 
        {
            // _xPositionISI is a local cache of GetValue(HorizontalOffsetProperty)
            // In the future, it could be replaced with the GetValue call.
            get:function() { return this._xPositionISI; }, 
            /*private*/ set:function(value) { this.SetValue(HorizontalOffsetPropertyKey, value); }
        }, 
 
        /// <summary>
        /// Actual VerticalOffset contains the ScrollViewer's current Vertical offset. 
        /// This is a computed value, derived from viewport/content size and previous scroll commands
        /// </summary>
//        public double 
        VerticalOffset:
        { 
            // _yPositionISI is a local cache of GetValue(VerticalOffsetProperty)
            // In the future, it could be replaced with the GetValue call. 
            get:function() { return this._yPositionISI; },
            /*private*/ set:function(value) { this.SetValue(VerticalOffsetPropertyKey, value); }
        }, 

        /// <summary>
        /// ExtentWidth contains the horizontal size of the scrolled content element.
        /// </summary> 
        /// <remarks>
        /// ExtentWidth is only an output property; it can effectively be set by specifying 
        /// <see cref="System.Windows.FrameworkElement.Width" /> on the content element. 
        /// </remarks>
//        public double 
        ExtentWidth:
        {
            get:function() { return this._xExtent; }
        },
        /// <summary>
        /// ExtentHeight contains the vertical size of the scrolled content element. 
        /// </summary> 
        /// <remarks>
        /// ExtentHeight is only an output property; it can effectively be set by specifying 
        /// <see cref="System.Windows.FrameworkElement.Height" /> on the content element.
        /// </remarks>
//        public double 
        ExtentHeight: 
        {
            get:function() { return this._yExtent; } 
        }, 

        /// <summary> 
        /// ScrollableWidth contains the horizontal size of the content element that can be scrolled.
        /// </summary>
//        public double 
        ScrollableWidth:
        { 
            get:function() { return Math.max(0.0, this.ExtentWidth - this.ViewportWidth); }
        }, 
 
        /// <summary>
        /// ScrollableHeight contains the vertical size of the content element that can be scrolled. 
        /// </summary>
//        public double 
        ScrollableHeight:
        {
            get:function() { return Math.max(0.0, this.ExtentHeight - this.ViewportHeight); } 
        },
 
        /// <summary> 
        /// ViewportWidth contains the horizontal size of the scrolling viewport.
        /// </summary> 
        /// <remarks>
        /// ExtentWidth is only an output property; it can effectively be set by specifying
        /// <see cref="System.Windows.FrameworkElement.Width" /> on this element.
        /// </remarks> 
//        public double 
        ViewportWidth: 
        { 
            get:function() { return this._xSize; }
        },
        /// <summary>
        /// ViewportHeight contains the vertical size of the scrolling viewport.
        /// </summary>
        /// <remarks> 
        /// ViewportHeight is only an output property; it can effectively be set by specifying
        /// <see cref="System.Windows.FrameworkElement.Height" /> on this element. 
        /// </remarks> 
//        public double 
        ViewportHeight: 
        {
            get:function() { return this._ySize; }
        },
        
        /// <summary>
        ///     When not doing live scrolling, this is the offset value where the
        ///     content is visually located. 
        /// </summary>
//        public double 
        ContentVerticalOffset: 
        { 
            get:function()
            { 
                return this.GetValue(ContentVerticalOffsetProperty);
            },

            /*private*/ set:function(value) 
            {
            	this.SetValue(ContentVerticalOffsetPropertyKey, value); 
            } 
        },
        
        /// <summary> 
        ///     When not doing live scrolling, this is the offset value where the
        ///     content is visually located.
        /// </summary>
//        public double 
        ContentHorizontalOffset: 
        {
            get:function() 
            { 
                return this.GetValue(ContentHorizontalOffsetProperty);
            }, 

            /*private*/ set:function(value)
            {
            	this.SetValue(ContentHorizontalOffsetPropertyKey, value); 
            }
        }, 
        
        /// <summary> 
        ///     Indicates whether the ScrollViewer should scroll contents
        ///     immediately during a thumb drag or defer until a drag completes. 
        /// </summary>
//        public bool 
        IsDeferredScrollingEnabled:
        {
            get:function() 
            {
                return this.GetValue(IsDeferredScrollingEnabledProperty); 
            }, 

            set:function(value) 
            {
            	this.SetValue(IsDeferredScrollingEnabledProperty, BooleanBoxes.Box(value));
            }
        }, 
        
      /// <summary>
        /// Event handler registration for the event fired when scrolling state changes. 
        /// </summary>
//        public event 
//        ScrollChangedEventHandler 
        ScrollChanged:
        {
        	get:function(){
        		if(this._ScrollChanged === undefined){
        			this._ScrollChanged = new ScrollChangedEventHandler();	
        		}
        		
        		return this._ScrollChanged;
        	}
        },
//        { 
//            add { AddHandler(ScrollChangedEvent, value); }
//            remove { RemoveHandler(ScrollChangedEvent, value); } 
//        },
        
        /// <summary> 
        ///     If control has a scrollviewer in its style and has a custom keyboard scrolling behavior when HandlesScrolling should return true.
        /// Then ScrollViewer will not handle keyboard input and leave it up to the control.
        /// </summary>
//        protected internal override bool 
        HandlesScrolling: 
        {
            get:function() { return true; } 
        }, 
        
        /// <summary>
        /// The ScrollInfo is the source of scrolling properties (Extent, Offset, and ViewportSize)
        /// for this ScrollViewer and any of its components like scrollbars. 
        /// </summary>
//        protected internal IScrollInfo 
        ScrollInfo: 
        { 
            get:function() { return _scrollInfo; },
            set:function(value) 
            {
            	this._scrollInfo = value;
                if (this._scrollInfo != null)
                { 
                	this._scrollInfo.CanHorizontallyScroll = (this.HorizontalScrollBarVisibility != ScrollBarVisibility.Disabled);
                	this._scrollInfo.CanVerticallyScroll = (this.VerticalScrollBarVisibility != ScrollBarVisibility.Disabled); 
                	this.EnsureQueueProcessing(); 
                }
            } 
        },
 
        /// <summary> 
        ///     The mode of manipulation based panning
        /// </summary> 
//        public PanningMode 
        PanningMode:
        {
            get:function() { return this.GetValue(PanningModeProperty); },
            set:function(value) { this.SetValue(PanningModeProperty, value); } 
        },
        
        /// <summary> 
        ///     The inertial linear deceleration of manipulation based scrolling
        /// </summary> 
//        public double 
        PanningDeceleration:
        {
            get:function() { return this.GetValue(PanningDecelerationProperty); },
            set:function(value) { this.SetValue(PanningDecelerationProperty, value); } 
        },
        
        /// <summary>
        ///     The Scroll pixels to panning pixels. 
        /// </summary>
//        public double 
        PanningRatio:
        {
            get:function() { return this.GetValue(PanningRatioProperty); }, 
            set:function(value) { this.SetValue(PanningRatioProperty, value); }
        },
 
        /// <summary>
        /// Whether or not the ScrollViewer should handle mouse wheel events.  This property was
        /// specifically introduced for TextBoxBase, to prevent mouse wheel scrolling from "breaking" 
        /// if the mouse pointer happens to land on a TextBoxBase with no more content in the direction
        /// of the scroll, as with a single-line TextBox.  In that scenario, ScrollViewer would 
        /// try to scroll the TextBoxBase and not allow the scroll event to bubble up to an outer 
        /// control even though the TextBoxBase doesn't scroll.
        /// 
        /// This property defaults to true.  TextBoxBase sets it to false.
        /// </summary>
//        internal bool 
        HandlesMouseWheelScrolling:
        { 
            get:function()
            { 
                return ((this._flags & Flags.HandlesMouseWheelScrolling) == Flags.HandlesMouseWheelScrolling); 
            },
            set:function(value) 
            {
            	this.SetFlagValue(Flags.HandlesMouseWheelScrolling, value);
            }
        }, 

//        internal bool 
        InChildInvalidateMeasure: 
        { 
            get:function()
            { 
                return ((this._flags & Flags.InChildInvalidateMeasure) == Flags.InChildInvalidateMeasure);
            },
            set:function(value)
            { 
            	this.SetFlagValue(Flags.InChildInvalidateMeasure, value);
            } 
        },
        
//        private bool 
        InvalidatedMeasureFromArrange: 
        {
            get:function() 
            {
                return ((this._flags & Flags.InvalidatedMeasureFromArrange) == Flags.InvalidatedMeasureFromArrange);
            },
            set:function(value) 
            {
            	this.SetFlagValue(Flags.InvalidatedMeasureFromArrange, value); 
            } 
        },
 
//        private bool 
        ForceNextManipulationComplete:
        {
            get:function()
            { 
                return ((this._flags & Flags.ForceNextManipulationComplete) == Flags.ForceNextManipulationComplete);
            }, 
            set:function(value) 
            {
            	this.SetFlagValue(Flags.ForceNextManipulationComplete, value); 
            }
        },

//        private bool 
        ManipulationBindingsInitialized: 
        {
            get:function()
            { 
                return ((this._flags & Flags.ManipulationBindingsInitialized) == Flags.ManipulationBindingsInitialized);
            }, 
            set:function(value)
            {
            	this.SetFlagValue(Flags.ManipulationBindingsInitialized, value);
            } 
        },
 
//        private bool 
        CompleteScrollManipulation: 
        {
            get:function() 
            {
                return ((this._flags & Flags.CompleteScrollManipulation) == Flags.CompleteScrollManipulation);
            },
            set:function(value) 
            {
            	this.SetFlagValue(Flags.CompleteScrollManipulation, value); 
            } 
        },
 
//        internal bool 
        InChildMeasurePass1:
        {
            get:function()
            { 
                return ((this._flags & Flags.InChildMeasurePass1) == Flags.InChildMeasurePass1);
            }, 
            set:function(value) 
            {
            	this.SetFlagValue(Flags.InChildMeasurePass1, value); 
            }
        },

//        internal bool 
        InChildMeasurePass2: 
        {
            get:function() 
            { 
                return ((this._flags & Flags.InChildMeasurePass2) == Flags.InChildMeasurePass2);
            }, 
            set:function(value)
            {
            	this.SetFlagValue(Flags.InChildMeasurePass2, value);
            } 
        },
 
//        internal bool 
        InChildMeasurePass3:
        {
            get:function() 
            {
                return ((this._flags & Flags.InChildMeasurePass3) == Flags.InChildMeasurePass3);
            },
            set:function(value) 
            {
            	this.SetFlagValue(Flags.InChildMeasurePass3, value); 
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
	
	Object.defineProperties(ScrollViewer,{
        /// <summary>
        /// DependencyProperty for <see cref="CanContentScroll" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		CanContentScrollProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._CanContentScrollProperty == undefined){
	    			ScrollViewer._CanContentScrollProperty = 
	                    DependencyProperty.RegisterAttached(
	                            "CanContentScroll",
	                            Boolean.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(false));  
	    		}
	    		
	    		return ScrollViewer._CanContentScrollProperty;
	    	}
	    }, 
        
        /// <summary> 
        /// DependencyProperty for <see cref="HorizontalScrollBarVisibility" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		HorizontalScrollBarVisibilityProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._HorizontalScrollBarVisibilityProperty == undefined){
	    			ScrollViewer._HorizontalScrollBarVisibilityProperty =
	                    DependencyProperty.RegisterAttached(
	                            "HorizontalScrollBarVisibility",
	                            Number.Type, 
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata( 
	                                    ScrollBarVisibility.Disabled, 
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure),
	                            new ValidateValueCallback(IsValidScrollBarVisibility));   
	    		}
	    		
	    		return ScrollViewer._HorizontalScrollBarVisibilityProperty;
	    	}
	    },  
        /// <summary>
        /// DependencyProperty for <see cref="VerticalScrollBarVisibility" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		VerticalScrollBarVisibilityProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._VerticalScrollBarVisibilityProperty == undefined){
	    			ScrollViewer._VerticalScrollBarVisibilityProperty =
	                    DependencyProperty.RegisterAttached( 
	                            "VerticalScrollBarVisibility", 
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(
	                                    ScrollBarVisibility.Visible,
	                                    FrameworkPropertyMetadataOptions.AffectsMeasure),
	                            new ValidateValueCallback(IsValidScrollBarVisibility));   
	    		}
	    		
	    		return ScrollViewer._VerticalScrollBarVisibilityProperty;
	    	}
	    },  
        
      /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		ComputedHorizontalScrollBarVisibilityPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ComputedHorizontalScrollBarVisibilityPropertyKey == undefined){
	    			ScrollViewer._ComputedHorizontalScrollBarVisibilityPropertyKey =
	                    DependencyProperty.RegisterReadOnly( 
	                            "ComputedHorizontalScrollBarVisibility",
	                            Number.Type,
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(Visibility.Visible));  
	    		}
	    		
	    		return ScrollViewer._ComputedHorizontalScrollBarVisibilityPropertyKey;
	    	}
	    },  
        
        /// <summary> 
        /// Dependency property that indicates whether horizontal scrollbars should display.  The 
        /// value of this property is computed by ScrollViewer; it can be controlled via the
        /// <see cref="HorizontalScrollBarVisibilityProperty" /> 
        /// </summary>
//        public static readonly DependencyProperty 
		ComputedHorizontalScrollBarVisibilityProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ComputedHorizontalScrollBarVisibilityProperty == undefined){
	    			ScrollViewer._ComputedHorizontalScrollBarVisibilityProperty =
	                    ComputedHorizontalScrollBarVisibilityPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return ScrollViewer._ComputedHorizontalScrollBarVisibilityProperty;
	    	}
	    },  
 
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		ComputedVerticalScrollBarVisibilityPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ComputedVerticalScrollBarVisibilityPropertyKey == undefined){
	    			ScrollViewer._ComputedVerticalScrollBarVisibilityPropertyKey =
	                    DependencyProperty.RegisterReadOnly( 
	                            "ComputedVerticalScrollBarVisibility",
	                            Number.Type,
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(Visibility.Visible));  
	    		}
	    		
	    		return ScrollViewer._ComputedVerticalScrollBarVisibilityPropertyKey;
	    	}
	    },  

        /// <summary> 
        /// Dependency property that indicates whether vertical scrollbars should display.  The 
        /// value of this property is computed by ScrollViewer; it can be controlled via the
        /// <see cref="VerticalScrollBarVisibilityProperty" /> 
        /// </summary>
//        public static readonly DependencyProperty 
		ComputedVerticalScrollBarVisibilityProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ComputedVerticalScrollBarVisibilityProperty == undefined){
	    			ScrollViewer._ComputedVerticalScrollBarVisibilityProperty =
	                    ComputedVerticalScrollBarVisibilityPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return ScrollViewer._ComputedVerticalScrollBarVisibilityProperty;
	    	}
	    },  
 

        /// <summary> 
        ///     Actual VerticalOffset. 
        /// </summary>
//        private static readonly DependencyPropertyKey 
		VerticalOffsetPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._VerticalOffsetPropertyKey == undefined){
	    			ScrollViewer._VerticalOffsetPropertyKey = 
	    	            DependencyProperty.RegisterReadOnly(
	                            "VerticalOffset",
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._VerticalOffsetPropertyKey;
	    	}
	    },  
 
        /// <summary> 
        /// DependencyProperty for <see cref="VerticalOffset" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		VerticalOffsetProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._VerticalOffsetProperty == undefined){
	    			ScrollViewer._VerticalOffsetProperty =
	    	            VerticalOffsetPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return ScrollViewer._VerticalOffsetProperty;
	    	}
	    },  

 
        /// <summary>
        ///     HorizontalOffset. 
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		HorizontalOffsetPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._HorizontalOffsetPropertyKey == undefined){
	    			ScrollViewer._HorizontalOffsetPropertyKey =
	    	            DependencyProperty.RegisterReadOnly( 
	                            "HorizontalOffset",
	                            Number.Type,
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._HorizontalOffsetPropertyKey;
	    	}
	    },  

        /// <summary> 
        /// DependencyProperty for <see cref="HorizontalOffset" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		HorizontalOffsetProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._HorizontalOffsetProperty == undefined){
	    			ScrollViewer._HorizontalOffsetProperty = 
	    	            HorizontalOffsetPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return ScrollViewer._HorizontalOffsetProperty;
	    	}
	    },  

        /// <summary>
        ///     When not doing live scrolling, this is the offset value where the 
        ///     content is visually located.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		ContentVerticalOffsetPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ContentVerticalOffsetPropertyKey == undefined){
	    			ScrollViewer._ContentVerticalOffsetPropertyKey = 
	    	            DependencyProperty.RegisterReadOnly(
	                            "ContentVerticalOffset", 
	                            Number.Type,
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._ContentVerticalOffsetPropertyKey;
	    	}
	    },  
 
        /// <summary>
        ///     DependencyProperty for <see cref="ContentVerticalOffset" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		ContentVerticalOffsetProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ContentVerticalOffsetProperty == undefined){
	    			ScrollViewer._ContentVerticalOffsetProperty =
	    	            ContentVerticalOffsetPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return ScrollViewer._ContentVerticalOffsetProperty;
	    	}
	    },  
        
        /// <summary>
        ///     When not doing live scrolling, this is the offset value where the
        ///     content is visually located.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		ContentHorizontalOffsetPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ContentHorizontalOffsetPropertyKey == undefined){
	    			ScrollViewer._ContentHorizontalOffsetPropertyKey =
	    	            DependencyProperty.RegisterReadOnly( 
	                            "ContentHorizontalOffset", 
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(0)); 
	    		}
	    		
	    		return ScrollViewer._ContentHorizontalOffsetPropertyKey;
	    	}
	    },  

        /// <summary>
        ///     DependencyProperty for <see cref="ContentHorizontalOffset" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ContentHorizontalOffsetProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ContentHorizontalOffsetProperty == undefined){
	    			ScrollViewer._ContentHorizontalOffsetProperty = 
	    	            ContentHorizontalOffsetPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return ScrollViewer._ContentHorizontalOffsetProperty;
	    	}
	    },   

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        private static readonly DependencyPropertyKey 
		ExtentWidthPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ExtentWidthPropertyKey == undefined){
	    			ScrollViewer._ExtentWidthPropertyKey =
	                    DependencyProperty.RegisterReadOnly(
	                            "ExtentWidth", 
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._ExtentWidthPropertyKey;
	    	}
	    },   

        /// <summary> 
        /// DependencyProperty for <see cref="ExtentWidth" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		ExtentWidthProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ExtentWidthProperty == undefined){
	    			ScrollViewer._ExtentWidthProperty =
	    	            ExtentWidthPropertyKey.DependencyProperty;   
	    		}
	    		
	    		return ScrollViewer._ExtentWidthProperty;
	    	}
	    },  

        /// <summary> 
        ///     The key needed set a read-only property. 
        /// </summary>
//        private static readonly DependencyPropertyKey 
		ExtentHeightPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ExtentHeightPropertyKey == undefined){
	    			ScrollViewer._ExtentHeightPropertyKey = 
	                    DependencyProperty.RegisterReadOnly(
	                            "ExtentHeight",
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._ExtentHeightPropertyKey;
	    	}
	    },  
 
        /// <summary> 
        /// DependencyProperty for <see cref="ExtentHeight" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		ExtentHeightProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ExtentHeightProperty == undefined){
	    			ScrollViewer._ExtentHeightProperty =
	    	            ExtentHeightPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return ScrollViewer._ExtentHeightProperty;
	    	}
	    },  

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		ScrollableWidthPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ScrollableWidthPropertyKey == undefined){
	    			ScrollViewer._ScrollableWidthPropertyKey = 
	                    DependencyProperty.RegisterReadOnly(
	                            "ScrollableWidth", 
	                            Number.Type,
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._ScrollableWidthPropertyKey;
	    	}
	    },  
 
        /// <summary>
        /// DependencyProperty for <see cref="ScrollableWidth" /> property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		ScrollableWidthProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ScrollableWidthProperty == undefined){
	    			ScrollViewer._ScrollableWidthProperty =
	    	            ScrollableWidthPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return ScrollViewer._ScrollableWidthProperty;
	    	}
	    },  

        /// <summary>
        ///     The key needed set a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
		ScrollableHeightPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ScrollableHeightPropertyKey == undefined){
	    			ScrollViewer._ScrollableHeightPropertyKey =
	                    DependencyProperty.RegisterReadOnly( 
	                            "ScrollableHeight", 
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(0));  
	    		}
	    		
	    		return ScrollViewer._ScrollableHeightPropertyKey;
	    	}
	    },  

        /// <summary>
        /// DependencyProperty for <see cref="ScrollableHeight" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		ScrollableHeightProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ScrollableHeightProperty == undefined){
	    			ScrollViewer._ScrollableHeightProperty = 
	    	            ScrollableHeightPropertyKey.DependencyProperty;   
	    		}
	    		
	    		return ScrollViewer._ScrollableHeightProperty;
	    	}
	    },  

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
//        private static readonly DependencyPropertyKey 
		ViewportWidthPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._ViewportWidthPropertyKey == undefined){
	    			ScrollViewer._ViewportWidthPropertyKey =
	                    DependencyProperty.RegisterReadOnly( 
	                            "ViewportWidth",
	                            Number.Type, 
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(0)); 
	    		}
	    		
	    		return ScrollViewer._ViewportWidthPropertyKey;
	    	}
	    },  
 
        /// <summary>
        /// DependencyProperty for <see cref="ViewportWidth" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		ViewportWidthProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._ViewportWidthProperty == undefined){
	    			ScrollViewer._ViewportWidthProperty = 
	    	            ViewportWidthPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return ScrollViewer._ViewportWidthProperty;
	    	}
	    },  
 
        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
		ViewportHeightPropertyKey:
	    {
	    	get:function(){
	    		if(ScrollViewer._CanContentScrollProperty == undefined){
	    			ScrollViewer._CanContentScrollProperty =
	                    DependencyProperty.RegisterReadOnly(
	                            "ViewportHeight",
	                            Number.Type, 
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(0));   
	    		}
	    		
	    		return ScrollViewer._CanContentScrollProperty;
	    	}
	    },  
 

        /// <summary> 
        /// DependencyProperty for <see cref="ViewportHeight" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
		ViewportHeightProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._CanContentScrollProperty == undefined){
	    			ScrollViewer._CanContentScrollProperty =
	    	            ViewportHeightPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return ScrollViewer._CanContentScrollProperty;
	    	}
	    },  

        /// <summary> 
        ///     DependencyProperty that indicates whether the ScrollViewer should 
        ///     scroll contents immediately during a thumb drag or defer until
        ///     a drag completes. 
        /// </summary>
//        public static readonly DependencyProperty 
		IsDeferredScrollingEnabledProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._IsDeferredScrollingEnabledProperty == undefined){
	    			ScrollViewer._IsDeferredScrollingEnabledProperty = DependencyProperty.RegisterAttached("IsDeferredScrollingEnabled", 
	    		    		Boolean.Type, ScrollViewer.Type, new FrameworkPropertyMetadata(false));  
	    		}
	    		
	    		return ScrollViewer._IsDeferredScrollingEnabledProperty;
	    	}
	    },  

        /// <summary> 
        /// Event ID that corresponds to a change in scrolling state.
        /// See ScrollChangeEvent for the corresponding event handler. 
        /// </summary>
//        public static readonly RoutedEvent 
		ScrollChangedEvent:
	    {
	    	get:function(){
	    		if(ScrollViewer._ScrollChangedEvent == undefined){
	    			ScrollViewer._ScrollChangedEvent = EventManager.RegisterRoutedEvent(
	    		            "ScrollChanged",
	    		            RoutingStrategy.Bubble, 
	    		            ScrollChangedEventHandler.Type,
	    		            ScrollViewer.Type);   
	    		}
	    		
	    		return ScrollViewer._ScrollChangedEvent;
	    	}
	    },  
        
        /// <summary> 
        ///     Dependency property for PanningMode property
        /// </summary> 
//        public static readonly DependencyProperty 
		PanningModeProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._PanningModeProperty == undefined){
	    			ScrollViewer._PanningModeProperty =
	                    DependencyProperty.RegisterAttached(
	                            "PanningMode",
	                            Number.Type, 
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(PanningMode.None, new PropertyChangedCallback(OnPanningModeChanged))); 
	    		}
	    		
	    		return ScrollViewer._PanningModeProperty;
	    	}
	    },  
        
      /// <summary> 
        ///     Dependency property for PanningDeceleration
        /// </summary> 
//        public static readonly DependencyProperty 
		PanningDecelerationProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._PanningDecelerationProperty == undefined){
	    			ScrollViewer._PanningDecelerationProperty =
	                    DependencyProperty.RegisterAttached(
	                            "PanningDeceleration",
	                            Number.Type, 
	                            ScrollViewer.Type,
	                            new FrameworkPropertyMetadata(0.001), 
	                            new ValidateValueCallback(CheckFiniteNonNegative));  
	    		}
	    		
	    		return ScrollViewer._PanningDecelerationProperty;
	    	}
	    },  
 
        /// <summary>
        ///      Dependency property for PanningRatio. 
        /// </summary>
//        public static readonly DependencyProperty 
		PanningRatioProperty:
	    {
	    	get:function(){
	    		if(ScrollViewer._PanningRatioProperty == undefined){
	    			ScrollViewer._PanningRatioProperty =
	                    DependencyProperty.RegisterAttached(
	                            "PanningRatio", 
	                            Number.Type,
	                            ScrollViewer.Type, 
	                            new FrameworkPropertyMetadata(1), 
	                            new ValidateValueCallback(CheckFiniteNonNegative));  
	    		}
	    		
	    		return ScrollViewer._PanningRatioProperty;
	    	}
	    },  
	});
	
    /// <summary> 
    /// Helper for setting CanContentScroll property.
    /// </summary> 
//    public static void 
	ScrollViewer.SetCanContentScroll = function(/*DependencyObject*/ element, /*bool*/ canContentScroll)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(CanContentScrollProperty, canContentScroll);
    };

    /// <summary>
    /// Helper for reading CanContentScroll property.
    /// </summary> 
//    public static bool 
    ScrollViewer.GetCanContentScroll = function(/*DependencyObject*/ element)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        return (element.GetValue(CanContentScrollProperty));
    };
    
    /// <summary>
    /// Helper for setting HorizontalScrollBarVisibility property.
    /// </summary> 
//    public static void 
    ScrollViewer.SetHorizontalScrollBarVisibility = function(/*DependencyObject*/ element, /*ScrollBarVisibility*/ horizontalScrollBarVisibility)
    { 
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(HorizontalScrollBarVisibilityProperty, horizontalScrollBarVisibility);
    }; 

    /// <summary> 
    /// Helper for reading HorizontalScrollBarVisibility property. 
    /// </summary>
//    public static ScrollBarVisibility 
    ScrollViewer.GetHorizontalScrollBarVisibility = function(/*DependencyObject*/ element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        return (element.GetValue(HorizontalScrollBarVisibilityProperty)); 
    };
    
    /// <summary> 
    /// Helper for setting VerticalScrollBarVisibility property. 
    /// </summary>
//    public static void 
    ScrollViewer.SetVerticalScrollBarVisibility = function(/*DependencyObject*/ element, /*ScrollBarVisibility*/ verticalScrollBarVisibility) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(VerticalScrollBarVisibilityProperty, verticalScrollBarVisibility); 
    };

    /// <summary>
    /// Helper for reading VerticalScrollBarVisibility property.
    /// </summary>
//    public static ScrollBarVisibility 
    ScrollViewer.GetVerticalScrollBarVisibility = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return (element.GetValue(VerticalScrollBarVisibilityProperty));
    };
    
  /// <summary> 
    ///     Gets the value of IsDeferredScrollingEnabled.
    /// </summary> 
    /// <param name="element">The element on which to query the property.</param> 
    /// <returns>The value of the property.</returns>
//    public static bool 
    ScrollViewer.GetIsDeferredScrollingEnabled = function(/*DependencyObject*/ element) 
    {
        if (element == null)
        {
            throw new ArgumentNullException("element"); 
        }

        return element.GetValue(IsDeferredScrollingEnabledProperty); 
    };

    /// <summary>
    ///     Sets the value of IsDeferredScrollingEnabled.
    /// </summary>
    /// <param name="element">The element on which to set the property.</param> 
    /// <param name="value">The new value of the property.</param>
//    public static void 
    ScrollViewer.SetIsDeferredScrollingEnabled = function(/*DependencyObject*/ element, /*bool*/ value) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        element.SetValue(IsDeferredScrollingEnabledProperty, BooleanBoxes.Box(value)); 
    };
    
    /// <summary>
    ///     Set method for PanningMode 
    /// </summary>
//    public static void 
    ScrollViewer.SetPanningMode = function(/*DependencyObject*/ element, /*PanningMode*/ panningMode)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        element.SetValue(PanningModeProperty, panningMode); 
    };

    /// <summary>
    ///     Get method for PanningMode 
    /// </summary>
//    public static PanningMode 
    ScrollViewer.GetPanningMode = function(/*DependencyObject*/ element) 
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        return (element.GetValue(PanningModeProperty)); 
    };

    /// <summary> 
    ///     Property changed callback for PanningMode.
    /// </summary> 
//    private static void 
    function OnPanningModeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        var sv = d instanceof ScrollViewer ? d : null;
        if (sv != null) 
        {
            sv.OnPanningModeChanged(); 
        } 
    };
    
    /// <summary> 
    ///     Set method for PanningDeceleration property
    /// </summary>
//    public static void 
    ScrollViewer.SetPanningDeceleration = function(/*DependencyObject*/ element, /*double*/ value)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(PanningDecelerationProperty, value);
    };

    /// <summary> 
    ///     Get method for PanningDeceleration property.
    /// </summary> 
//    public static double 
    ScrollViewer.GetPanningDeceleration = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        return (element.GetValue(PanningDecelerationProperty));
    }; 
    
   

    /// <summary>
    ///     Set method for PanningRatio property.
    /// </summary>
//    public static void 
    ScrollViewer.SetPanningRatio = function(/*DependencyObject*/ element, /*double*/ value) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(PanningRatioProperty, value);
    };

    /// <summary>
    ///     Get method for PanningRatio property 
    /// </summary> 
//    public static double 
    ScrollViewer.GetPanningRatio = function(/*DependencyObject*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        return (element.GetValue(PanningRatioProperty)); 
    }; 

//    private static bool 
    function CheckFiniteNonNegative(/*object*/ value) 
    {
        return (DoubleUtil.GreaterThanOrClose(doubleValue, 0) &&
            !double.IsInfinity(value)); 
    }
    
    /// <summary> 
    /// OnRequestBringIntoView is called from the event handler ScrollViewer registers for the event.
    /// The default implementation checks to make sure the visual is a child of the IScrollInfo, and then
    /// delegates to a method there
    /// </summary> 
    /// <param name="sender">The instance handling the event.</param>
    /// <param name="e">RequestBringIntoViewEventArgs indicates the element and region to scroll into view.</param> 
//    private static void 
    function OnRequestBringIntoView(/*object*/ sender, /*RequestBringIntoViewEventArgs*/ e) 
    {
        var sv = sender instanceof ScrollViewer ? sender : null; 
        var child = e.TargetObject instanceof Visual ? e.TargetObject : null;

        if (child != null)
        { 
            //the event starts from the elemetn itself, so if it is an SV.BringINtoView we would
            //get an SV trying to bring into view itself  - this does not work obviously 
            //so don't handle if the request is about ourselves, the event will bubble 
            if (child != sv && child.IsDescendantOf(sv))
            { 
                e.Handled = true;
                sv.MakeVisible(child, e.TargetRect);
            }
        } 
        else
        { 
            var contentElement = e.TargetObject instanceof ContentElement ? e.TargetObject : null; 
            if (contentElement != null)
            { 
                // We need to find the containing Visual and the bounding box for this element.
                var contentHost = ContentHostHelper.FindContentHost(contentElement);
                child = contentHost instanceof Visual ? contentHost : null;

                if (child != null && child.IsDescendantOf(sv))
                { 
                    /*ReadOnlyCollection<Rect>*/var rects = contentHost.GetRectangles(contentElement); 
                    if (rects.Count > 0)
                    { 
                        e.Handled = true;
                        sv.MakeVisible(child, rects.Get(0));
                    }
                } 
            }
        } 
    } 

//    private static void 
    function OnScrollCommand(/*object*/ target, /*ExecutedRoutedEventArgs*/ args) 
    {
        if (args.Command == ScrollBar.DeferScrollToHorizontalOffsetCommand)
        {
            if (args.Parameter instanceof Number) { (target).DeferScrollToHorizontalOffset(args.Parameter); } 
        }
        else if (args.Command == ScrollBar.DeferScrollToVerticalOffsetCommand) 
        { 
            if (args.Parameter instanceof Number) { (target).DeferScrollToVerticalOffset(args.Parameter); }
        } 
        else if (args.Command == ScrollBar.LineLeftCommand)
        {
            (target).LineLeft();
        } 
        else if (args.Command == ScrollBar.LineRightCommand)
        { 
            (target).LineRight(); 
        }
        else if (args.Command == ScrollBar.PageLeftCommand) 
        {
            (target).PageLeft();
        }
        else if (args.Command == ScrollBar.PageRightCommand) 
        {
            (target).PageRight(); 
        } 
        else if (args.Command == ScrollBar.LineUpCommand)
        { 
            (target).LineUp();
        }
        else if (args.Command == ScrollBar.LineDownCommand)
        { 
            (target).LineDown();
        } 
        else if (   args.Command == ScrollBar.PageUpCommand 
                ||  args.Command == ComponentCommands.ScrollPageUp  )
        { 
            (target).PageUp();
        }
        else if (   args.Command == ScrollBar.PageDownCommand
                ||  args.Command == ComponentCommands.ScrollPageDown    ) 
        {
            (target).PageDown(); 
        } 
        else if (args.Command == ScrollBar.ScrollToEndCommand)
        { 
            (target).ScrollToEnd();
        }
        else if (args.Command == ScrollBar.ScrollToHomeCommand)
        { 
            (target).ScrollToHome();
        } 
        else if (args.Command == ScrollBar.ScrollToLeftEndCommand) 
        {
            (target).ScrollToLeftEnd(); 
        }
        else if (args.Command == ScrollBar.ScrollToRightEndCommand)
        {
            (target).ScrollToRightEnd(); 
        }
        else if (args.Command == ScrollBar.ScrollToTopCommand) 
        { 
            (target).ScrollToTop();
        } 
        else if (args.Command == ScrollBar.ScrollToBottomCommand)
        {
            (target).ScrollToBottom();
        } 
        else if (args.Command == ScrollBar.ScrollToHorizontalOffsetCommand)
        { 
            if (args.Parameter instanceof Number) { (target).ScrollToHorizontalOffset(args.Parameter); } 
        }
        else if (args.Command == ScrollBar.ScrollToVerticalOffsetCommand) 
        {
            if (args.Parameter instanceof Number) { (target).ScrollToVerticalOffset(args.Parameter); }
        }

        var sv = target instanceof ScrollViewer ? target : null;
        if (sv != null) 
        { 
            // If any of the ScrollBar scroll commands are raised while
            // scroll manipulation is in its inertia, then the manipualtion 
            // should be completed.
            sv.CompleteScrollManipulation = true;
        }
    } 

//    private static void 
    function OnQueryScrollCommand(/*object*/ target, /*CanExecuteRoutedEventArgs*/ args) 
    { 
        args.CanExecute = true;

        //  ScrollViewer is capable of execution of the majority of commands.
        //  The only special case is the component commands below.
        //  When scroll viewer is a primitive / part of another control
        //  capable to handle scrolling - scroll viewer leaves it up 
        //  to the control to deal with component commands...
        if (    args.Command == ComponentCommands.ScrollPageUp 
            ||  args.Command == ComponentCommands.ScrollPageDown    ) 
        {
            var scrollViewer = target instanceof ScrollViewer ? target : null;
            var templatedParentControl = scrollViewer != null ? 
            		(scrollViewer.TemplatedParent instanceof Control ? scrollViewer.TemplatedParent : null) : null;

            if (    templatedParentControl != null
                &&  templatedParentControl.HandlesScrolling ) 
            {
                args.CanExecute = false; 
                args.ContinueRouting = true; 

                // It is important to handle this event to prevent any 
                // other ScrollViewers in the ancestry from claiming it.
                args.Handled = true;
            }
        } 
        else if ((args.Command == ScrollBar.DeferScrollToHorizontalOffsetCommand) ||
                 (args.Command == ScrollBar.DeferScrollToVerticalOffsetCommand)) 
        { 
            // The scroll bar has indicated that a drag operation is in progress.
            // If deferred scrolling is disabled, then mark the command as 
            // not executable so that the scroll bar will fire the regular scroll
            // command, and the scroll viewer will do live scrolling.
            var scrollViewer = target instanceof ScrollViewer ? target : null;
            if ((scrollViewer != null) && !scrollViewer.IsDeferredScrollingEnabled) 
            {
                args.CanExecute = false; 

                // It is important to handle this event to prevent any
                // other ScrollViewers in the ancestry from claiming it. 
                args.Handled = true;
            }
        }
    } 

//    private static void 
    function InitializeCommands() 
    { 
        var executeScrollCommandEventHandler = new ExecutedRoutedEventHandler(null, OnScrollCommand);
        var canExecuteScrollCommandEventHandler = new CanExecuteRoutedEventHandler(null, OnQueryScrollCommand); 

        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.LineLeftCommand,          executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.LineRightCommand,         executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.PageLeftCommand,          executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.PageRightCommand,         executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.LineUpCommand,            executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.LineDownCommand,          executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.PageUpCommand,            executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.PageDownCommand,          executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToLeftEndCommand,   executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToRightEndCommand,  executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToEndCommand,       executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToHomeCommand,      executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToTopCommand,       executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToBottomCommand,    executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToHorizontalOffsetCommand,  executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.ScrollToVerticalOffsetCommand,    executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.DeferScrollToHorizontalOffsetCommand, executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ScrollBar.DeferScrollToVerticalOffsetCommand,   executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);

        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ComponentCommands.ScrollPageUp,     executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler);
        CommandHelpers.RegisterCommandHandler(ScrollViewer.Type, ComponentCommands.ScrollPageDown,   executeScrollCommandEventHandler, canExecuteScrollCommandEventHandler); 
    }

    // Creates the default control template for ScrollViewer. 
//    private static ControlTemplate 
    function CreateDefaultControlTemplate()
    { 
        var template = null;

        // Our default style is a 2x2 grid:
        // <Grid Columns="*,Auto" Rows="*,Auto">        // Grid 
        //   <ColumnDefinition Width="*" />
        //   <ColumnDefinition Width="Auto" /> 
        //   <RowDefinition Height="*" /> 
        //   <RowDefinition Height="Auto" />
        //   <Border>                                   // Cell 1-2, 1-2 
        //     <ScrollContentPresenter />
        //   </Border>
        //   <VerticalScrollBar  />                     // Cell 1, 2
        //   <HorizontalScrollBar />                    // Cell 2, 1 
        // </Grid> 
        var grid = new FrameworkElementFactory(Grid.Type, "Grid"); 
        var gridColumn1 = new FrameworkElementFactory(ColumnDefinition.Type, "ColumnDefinitionOne"); 
        var gridColumn2 = new FrameworkElementFactory(ColumnDefinition.Type, "ColumnDefinitionTwo");
        var gridRow1 = new FrameworkElementFactory(RowDefinition.Type, "RowDefinitionOne"); 
        var gridRow2 = new FrameworkElementFactory(RowDefinition.Type, "RowDefinitionTwo");
        var vsb = new FrameworkElementFactory(ScrollBar.Type, VerticalScrollBarTemplateName);
        var hsb = new FrameworkElementFactory(ScrollBar.Type, HorizontalScrollBarTemplateName);
        var content = new FrameworkElementFactory(ScrollContentPresenter.Type, ScrollContentPresenterTemplateName); 
        var corner = new FrameworkElementFactory(Rectangle.Type, "Corner");

        // Bind Actual HorizontalOffset to HorizontalScrollBar.Value 
        // Bind Actual VerticalOffset to VerticalScrollbar.Value
        var bindingHorizontalOffset = new Binding("HorizontalOffset"); 
        bindingHorizontalOffset.Mode = BindingMode.OneWay;
        bindingHorizontalOffset.RelativeSource = RelativeSource.TemplatedParent;
        var bindingVerticalOffset = new Binding("VerticalOffset");
        bindingVerticalOffset.Mode = BindingMode.OneWay; 
        bindingVerticalOffset.RelativeSource = RelativeSource.TemplatedParent;

        grid.SetValue(Grid.BackgroundProperty, new TemplateBindingExtension(BackgroundProperty)); 
        grid.AppendChild(gridColumn1);
        grid.AppendChild(gridColumn2); 
        grid.AppendChild(gridRow1);
        grid.AppendChild(gridRow2);
        grid.AppendChild(corner);
        grid.AppendChild(content); 
        grid.AppendChild(vsb);
        grid.AppendChild(hsb); 

        gridColumn1.SetValue(ColumnDefinition.WidthProperty, new GridLength(1.0, GridUnitType.Star));
        gridColumn2.SetValue(ColumnDefinition.WidthProperty, new GridLength(1.0, GridUnitType.Auto)); 
        gridRow1.SetValue(RowDefinition.HeightProperty, new GridLength(1.0, GridUnitType.Star));
        gridRow2.SetValue(RowDefinition.HeightProperty, new GridLength(1.0, GridUnitType.Auto));

        content.SetValue(Grid.ColumnProperty, 0); 
        content.SetValue(Grid.RowProperty, 0);
        content.SetValue(ContentPresenter.MarginProperty, new TemplateBindingExtension(PaddingProperty)); 
        content.SetValue(ContentProperty, new TemplateBindingExtension(ContentProperty)); 
        content.SetValue(ContentTemplateProperty, new TemplateBindingExtension(ContentTemplateProperty));
        content.SetValue(CanContentScrollProperty, new TemplateBindingExtension(CanContentScrollProperty)); 

        hsb.SetValue(ScrollBar.OrientationProperty, Orientation.Horizontal);
        hsb.SetValue(Grid.ColumnProperty, 0);
        hsb.SetValue(Grid.RowProperty, 1); 
        hsb.SetValue(RangeBase.MinimumProperty, 0.0);
        hsb.SetValue(RangeBase.MaximumProperty, new TemplateBindingExtension(ScrollableWidthProperty)); 
        hsb.SetValue(ScrollBar.ViewportSizeProperty, new TemplateBindingExtension(ViewportWidthProperty)); 
        hsb.SetBinding(RangeBase.ValueProperty, bindingHorizontalOffset);
        hsb.SetValue(UIElement.VisibilityProperty, new TemplateBindingExtension(ComputedHorizontalScrollBarVisibilityProperty)); 
        hsb.SetValue(FrameworkElement.CursorProperty, Cursors.Arrow);
        hsb.SetValue(AutomationProperties.AutomationIdProperty, "HorizontalScrollBar");

        vsb.SetValue(Grid.ColumnProperty, 1); 
        vsb.SetValue(Grid.RowProperty, 0);
        vsb.SetValue(RangeBase.MinimumProperty, 0.0); 
        vsb.SetValue(RangeBase.MaximumProperty, new TemplateBindingExtension(ScrollableHeightProperty)); 
        vsb.SetValue(ScrollBar.ViewportSizeProperty, new TemplateBindingExtension(ViewportHeightProperty));
        vsb.SetBinding(RangeBase.ValueProperty, bindingVerticalOffset); 
        vsb.SetValue(UIElement.VisibilityProperty, new TemplateBindingExtension(ComputedVerticalScrollBarVisibilityProperty));
        vsb.SetValue(FrameworkElement.CursorProperty, Cursors.Arrow);
        vsb.SetValue(AutomationProperties.AutomationIdProperty, "VerticalScrollBar");

        corner.SetValue(Grid.ColumnProperty, 1);
        corner.SetValue(Grid.RowProperty, 1); 
        corner.SetResourceReference(Rectangle.FillProperty, SystemColors.ControlBrushKey); 

        template = new ControlTemplate(ScrollViewer.Type); 
        template.VisualTree = grid;
        template.Seal();

        return (template); 
    }
    
//    static ScrollViewer() 
    function Initialize()
    { 
        DefaultStyleKeyProperty.OverrideMetadata(ScrollViewer.Type, new FrameworkPropertyMetadata(ScrollViewer.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(ScrollViewer.Type); 

        InitializeCommands();

        var template = CreateDefaultControlTemplate(); 
        Control.TemplateProperty.OverrideMetadata(ScrollViewer.Type, new FrameworkPropertyMetadata(template));
        IsTabStopProperty.OverrideMetadata(ScrollViewer.Type, new FrameworkPropertyMetadata(false)); 
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(ScrollViewer.Type, new FrameworkPropertyMetadata(KeyboardNavigationMode.Local)); 

        EventManager.RegisterClassHandler(ScrollViewer.Type, RequestBringIntoViewEvent, new RequestBringIntoViewEventHandler(null, OnRequestBringIntoView)); 
    }

//    private static bool 
    function IsValidScrollBarVisibility(/*object*/ o)
    { 
//        ScrollBarVisibility value = (ScrollBarVisibility)o;
        return (o == ScrollBarVisibility.Disabled 
            || o == ScrollBarVisibility.Auto 
            || o == ScrollBarVisibility.Hidden
            || o == ScrollBarVisibility.Visible); 
    }
    
 
	
	ScrollViewer.Type = new Type("ScrollViewer", ScrollViewer, [ContentControl.Type]);
	return ScrollViewer;
});
