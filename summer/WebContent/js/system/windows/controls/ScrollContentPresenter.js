/**
 * ScrollContentPresenter
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentPresenter", "primitives/IScrollInfo"], 
		function(declare, Type, ContentPresenter, IScrollInfo){
	
    // Helper class to hold scrolling data. 
    // This class exists to reduce working set when SCP is delegating to another implementation of ISI.
    // Standard "extra pointer always for less data sometimes" cache savings model: 
    // 
//    private class 
	var ScrollData = declare(Object, { });
	Object.defineProperties(ScrollData.prototype, {
//        internal ScrollViewer 
		_scrollOwner:
		{
			get:function(){return this.__scrollOwner; },
			set:function(value){this.__scrollOwner = value;}
		},

//        internal bool 
		_canHorizontallyScroll:
		{
			get:function(){return this.__canHorizontallyScroll; },
			set:function(value){this.__canHorizontallyScroll = value;}
		},
//        internal bool 
		_canVerticallyScroll:
		{
			get:function(){return this.__canVerticallyScroll; },
			set:function(value){this.__canVerticallyScroll = value;}
		}, 

//        internal Vector 
		_offset:
		{
			get:function(){return this.__offset; },
			set:function(value){this.__offset = value;}
		},            // Set scroll offset of content.  Positive corresponds to a visually upward offset. 
//        internal Vector 
		_computedOffset:
		{
			get:function(){return this.__computedOffset; },
			set:function(value){this.__computedOffset = value;}
		},    // Actual (computed) scroll offset of content. ""  "" 

//        internal Size 
		_viewport:
		{
			get:function(){return this.__viewport; },
			set:function(value){this.__viewport = value;}
		},    // ViewportSize is computed from our FinalSize, but may be in different units. 
//        internal Size 
		_extent:
		{
			get:function(){return this.__extent; },
			set:function(value){this.__extent = value;}
		}      // Extent is the total size of our content.
    });
    
	var ScrollContentPresenter = declare("ScrollContentPresenter", [ContentPresenter, IScrollInfo],{
		constructor:function(){
//			 this._adornerLayer = new AdornerLayer();
		},
		

        /// <summary>
        /// Scroll content by one line to the top. 
        /// </summary>
//        public void 
		LineUp:function() 
        { 
            if (this.IsScrollClient) { this.SetVerticalOffset(this.VerticalOffset - this.ScrollViewer._scrollLineDelta); }
        }, 
        /// <summary>
        /// Scroll content by one line to the bottom.
        /// </summary>
//        public void 
        LineDown:function() 
        {
            if (this.IsScrollClient) { this.SetVerticalOffset(this.VerticalOffset + this.ScrollViewer._scrollLineDelta); } 
        }, 
        /// <summary>
        /// Scroll content by one line to the left. 
        /// </summary>
//        public void 
        LineLeft:function()
        {
            if (this.IsScrollClient) { this.SetHorizontalOffset(this.HorizontalOffset - this.ScrollViewer._scrollLineDelta); } 
        },
        /// <summary> 
        /// Scroll content by one line to the right. 
        /// </summary>
//        public void 
        LineRight:function() 
        {
            if (this.IsScrollClient) { this.SetHorizontalOffset(this.HorizontalOffset + this.ScrollViewer._scrollLineDelta); }
        },
 
        /// <summary>
        /// Scroll content by one page to the top. 
        /// </summary> 
//        public void 
        PageUp:function()
        { 
            if (this.IsScrollClient) { this.SetVerticalOffset(this.VerticalOffset - this.ViewportHeight); }
        },
        /// <summary>
        /// Scroll content by one page to the bottom. 
        /// </summary>
//        public void 
        PageDown:function() 
        { 
            if (this.IsScrollClient) { this.SetVerticalOffset(this.VerticalOffset + this.ViewportHeight); }
        }, 
        /// <summary>
        /// Scroll content by one page to the left.
        /// </summary>
//        public void 
        PageLeft:function() 
        {
            if (this.IsScrollClient) { this.SetHorizontalOffset(this.HorizontalOffset - this.ViewportWidth); } 
        }, 
        /// <summary>
        /// Scroll content by one page to the right. 
        /// </summary>
//        public void 
        PageRight:function()
        {
            if (this.IsScrollClient) { this.SetHorizontalOffset(this.HorizontalOffset + this.ViewportWidth); } 
        },
 
        /// <summary> 
        /// Scroll content by one line to the top.
        /// </summary> 
//        public void 
        MouseWheelUp:function()
        {
            if (this.IsScrollClient) { this.SetVerticalOffset(this.VerticalOffset - this.ScrollViewer._mouseWheelDelta); }
        }, 
        /// <summary>
        /// Scroll content by one line to the bottom. 
        /// </summary> 
//        public void 
        MouseWheelDown:function()
        { 
            if (IsScrollClient) { this.SetVerticalOffset(this.VerticalOffset + this.ScrollViewer._mouseWheelDelta); }
        },
        /// <summary>
        /// Scroll content by one page to the top. 
        /// </summary>
//        public void 
        MouseWheelLeft:function() 
        { 
            if (this.IsScrollClient) { this.SetHorizontalOffset(this.HorizontalOffset - this.ScrollViewer._mouseWheelDelta); }
        }, 
        /// <summary>
        /// Scroll content by one page to the bottom.
        /// </summary>
//        public void 
        MouseWheelRight:function() 
        {
            if (this.IsScrollClient) { this.SetHorizontalOffset(this.HorizontalOffset + this.ScrollViewer._mouseWheelDelta); } 
        }, 

        /// <summary> 
        /// Set the HorizontalOffset to the passed value.
        /// </summary>
//        public void 
        SetHorizontalOffset:function(/*double*/ offset)
        { 
            if (IsScrollClient)
            { 
                var newValue = this.ValidateInputOffset(offset, "HorizontalOffset"); 
                if (!DoubleUtil.AreClose(this.EnsureScrollData()._offset.X, newValue))
                { 
                	this._scrollData._offset.X = newValue;
                	this.InvalidateArrange();
                }
            } 

        }, 
 
        /// <summary>
        /// Set the VerticalOffset to the passed value. 
        /// </summary>
//        public void 
        SetVerticalOffset:function(/*double*/ offset)
        {
            if (IsScrollClient) 
            {
                var newValue = this.ValidateInputOffset(offset, "VerticalOffset"); 
                if (!DoubleUtil.AreClose(this.EnsureScrollData()._offset.Y, newValue)) 
                {
                	this._scrollData._offset.Y = newValue; 
                	this.InvalidateArrange();
                }
            }
        }, 

      /// <summary> 
        /// Returns the child at the specified index.
        /// </summary> 
//        protected override Visual 
        GetVisualChild:function(/*int*/ index)
        {
            //check if there is a TemplateChild on FrameworkElement
            if (base.TemplateChild == null) 
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
            } 
            else
            { 
                switch (index)
                {
                    case 0:
                        return base.TemplateChild; 

                    case 1: 
                        return this._adornerLayer; 

                    default: 
                        throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
                }
            }
         }, 

        /// <summary> 
        /// </summary>
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint) 
        { 
            var desiredSize = new Size();
                var count = this.VisualChildrenCount; 

 
                if (count > 0)
                {
                    // The AdornerLayer is always the size of our surface, and does not contribute to our own size.
                	this._adornerLayer.Measure(constraint); 

                    if (!IsScrollClient) 
                    { 
                        desiredSize = base.MeasureOverride(constraint);
                    } 
                    else
                    {
                        var childConstraint = constraint;
 
                        if (this._scrollData._canHorizontallyScroll) { childConstraint.Width = Double.PositiveInfinity; }
                        if (this._scrollData._canVerticallyScroll) { childConstraint.Height = Double.PositiveInfinity; } 
 
                        desiredSize = base.MeasureOverride(childConstraint);
                    } 
                }

                // If we're handling scrolling (as the physical scrolling client, validate properties.
                if (IsScrollClient) 
                {
                	this.VerifyScrollData(constraint, desiredSize); 
                } 

                desiredSize.Width = Math.min(constraint.Width, desiredSize.Width); 
                desiredSize.Height = Math.min(constraint.Height, desiredSize.Height);
            return desiredSize;
        },

        /// <summary> 
        /// </summary>
//        protected override Size 
        ArrangeOverride:function() 
        { 
            var count = this.VisualChildrenCount; 

            // Verifies IScrollInfo properties & invalidates ScrollViewer if necessary. 
            if (this.IsScrollClient)
            {
            	this.VerifyScrollData(arrangeSize, this._scrollData._extent);
            } 

            if (count > 0) 
            { 
            	this._adornerLayer.Arrange(new Rect(arrangeSize));
 
                var child = this.GetVisualChild(0);
                child = child instanceof UIElement ? child : null;
                if (child != null)
                {
                    var childRect = new Rect(child.DesiredSize); 

                    if (this.IsScrollClient) 
                    { 
                        childRect.X = -this.HorizontalOffset;
                        childRect.Y = -this.VerticalOffset; 
                    }

                    //this is needed to stretch the child to arrange space,
                    childRect.Width = Math.max(childRect.Width, arrangeSize.Width); 
                    childRect.Height = Math.max(childRect.Height, arrangeSize.Height);
 
                    child.Arrange(childRect); 
                }
            } 
            return (arrangeSize); 
        },

        /// <summary>
        /// Override of <seealso cref="UIElement.GetLayoutClip"/>. 
        /// </summary>
        /// <returns>Viewport geometry</returns> 
//        protected override Geometry 
        GetLayoutClip:function(/*Size*/ layoutSlotSize) 
        {
            return new RectangleGeometry(new Rect(RenderSize)); 
        },

        /// <summary>
        /// Called when the Template's tree has been generated 
        /// </summary>
//        public override void 
        OnApplyTemplate:function() 
        { 
            base.OnApplyTemplate();
 

            // Add the AdornerLayer to our visual tree.
            // Iff we have content, we need an adorner layer.
            // It has Content(eg. Button, TextBlock) as its first child and AdornerLayer as its second child 

            // Get our scrolling owner and content talking. 
            this.HookupScrollingComponents(); 
        },
        
        /// <summary>
        /// ScrollContentPresenter implementation of <seealso cref="IScrollInfo.MakeVisible" />.
        /// </summary> 
        /// <param name="visual">The Visual that should become visible</param>
        /// <param name="rectangle">A rectangle representing in the visual's coordinate space to make visible.</param> 
        /// <param name="throwOnError">If true the method throws an exception when an error is encountered, otherwise the method returns Rect.Empty when an error is encountered</param> 
        /// <returns>
        /// A rectangle in the IScrollInfo's coordinate space that has been made visible. 
        /// Other ancestors to in turn make this new rectangle visible.
        /// The rectangle should generally be a transformed version of the input rectangle.  In some cases, like
        /// when the input rectangle cannot entirely fit in the viewport, the return value might be smaller.
        /// </returns> 
//        internal Rect 
        MakeVisible:function(/*Visual*/ visual, /*Rect*/ rectangle, /*bool*/ throwOnError)
        { 
        	if(throwOnError === undefined){
        		throwOnError = true;
        	}
            // 
            //
            // Note: This code presently assumes we/children are layout clean.  See work item 22269 for more detail. 
            // 
            // We can only work on visuals that are us or children. 
            // An empty rect has no size or position.  We can't meaningfully use it.
            if (rectangle.IsEmpty
                || visual == null
                || visual == this 
                || !this.IsAncestorOf(visual))
            { 
                return Rect.Empty; 
            }
 
            // This is a false positive by PreSharp. visual cannot be null because of the 'if' check above
            // Compute the child's rect relative to (0,0) in our coordinate space. 
            var childTransform = visual.TransformToAncestor(this);

            rectangle = childTransform.TransformBounds(rectangle); 

            if (!IsScrollClient || (!throwOnError && rectangle.IsEmpty))
            {
                return rectangle; 
            }
 
            // Initialize the viewport 
            var viewport = new Rect(this.HorizontalOffset, this.VerticalOffset, this.ViewportWidth, this.ViewportHeight);
            rectangle.X += viewport.X; 
            rectangle.Y += viewport.Y;

            // Compute the offsets required to minimally scroll the child maximally into view.
            var minX = ComputeScrollOffsetWithMinimalScroll(viewport.Left, viewport.Right, rectangle.Left, rectangle.Right); 
            var minY = ComputeScrollOffsetWithMinimalScroll(viewport.Top, viewport.Bottom, rectangle.Top, rectangle.Bottom);
 
            // We have computed the scrolling offsets; scroll to them. 
            this.SetHorizontalOffset(minX);
            this.SetVerticalOffset(minY); 

            // Compute the visible rectangle of the child relative to the viewport.
            viewport.X = minX;
            viewport.Y = minY; 
            rectangle.Intersect(viewport);
 
            if (throwOnError) 
            {
                // 
                rectangle.X -= viewport.X;
                rectangle.Y -= viewport.Y;
            } 
            else
            { 
                // 
                if (!rectangle.IsEmpty) 
                {
                    rectangle.X -= viewport.X;
                    rectangle.Y -= viewport.Y;
                } 
            }
 
            // Return the rectangle 
            return rectangle;
        }, 
        
//        private ScrollData 
        EnsureScrollData:function() 
        {
            if (this._scrollData == null) { this._scrollData = new ScrollData(); } 
            return this._scrollData; 
        },
 

        // Helper method to get our ScrollViewer owner and its scrolling content talking.
        // Method introduces the current owner/content, and clears a from any previous content.
//        internal void 
        HookupScrollingComponents:function() 
        {
            // We need to introduce our IScrollInfo to our ScrollViewer (and break any previous links). 
            var scrollContainer = this.TemplatedParent instanceof ScrollViewer ? this.TemplatedParent : null; 

            // If our content is not an IScrollInfo, we should have selected a style that contains one. 
            // This (readonly) style contains an AdornerDecorator with a ScrollArea child.
            if (scrollContainer != null)
            {
                /*IScrollInfo*/var si = null; 

                if (this.CanContentScroll) 
                { 
                    // We need to get an IScrollInfo to introduce to the ScrollViewer.
                    // 1. Try our content... 
                    si = this.Content instanceof IScrollInfo ? this.Content : null;

                    if (si == null)
                    { 
                        var child = this.Content instanceof Visual ? this.Content : null;
                        if (child != null) 
                        { 
                            // 2. Our child might be an ItemsPresenter.  In this case check its child for being an IScrollInfo
                            var itemsPresenter = child instanceof ItemsPresenter ? child : null; 
                            if (itemsPresenter == null)
                            {
                                // 3. With the change in templates for ClearTypeHint the ItemsPresenter is not guranteed to be the
                                // immediate child. We now look for a named element instead of naively walking the descendents. 
                                var templatedParent = scrollContainer.TemplatedParent instanceof FrameworkElement ? scrollContainer.TemplatedParent : null;
                                if (templatedParent != null) 
                                { 
                                    itemsPresenter = templatedParent.GetTemplateChild("ItemsPresenter");
                                    itemsPresenter = itemsPresenter instanceof ItemsPresenter ? itemsPresenter : null;
                                } 
                            }

                            if (itemsPresenter != null)
                            { 
                                itemsPresenter.ApplyTemplate();
 
                                var count = VisualTreeHelper.GetChildrenCount(itemsPresenter); 
                                if(count > 0){
                                    si = VisualTreeHelper.GetChild(itemsPresenter, 0);
                                    si = si instanceof IScrollInfo ? si : null; 
                                }
                            }
                        }
                    }
                } 

                // 4. As a final fallback, we use ourself. 
                if (si == null) 
                {
                    si = /*(IScrollInfo)*/this; 
                    this.EnsureScrollData();
                }

                // Detach any differing previous IScrollInfo from ScrollViewer 
                if (si != this._scrollInfo && this._scrollInfo != null)
                { 
                    if (this.IsScrollClient) { this._scrollData = null; } 
                    else _scrollInfo.ScrollOwner = null;
                } 

                // Introduce our ScrollViewer and IScrollInfo to each other.
                if (si != null)
                { 
                	this._scrollInfo = si;                   // At this point, we pass IsScrollClient if si == this.
                    si.ScrollOwner = scrollContainer; 
                    scrollContainer.ScrollInfo = si; 
                }
            } 

            // We're not really in a valid scrolling scenario.  Break any previous references, and get us
            // back into a totally unlinked state.
            else if (this._scrollInfo != null) 
            {
                if (this._scrollInfo.ScrollOwner != null) { this._scrollInfo.ScrollOwner.ScrollInfo = null; } 
                this._scrollInfo.ScrollOwner = null; 
                this._scrollInfo = null;
                this._scrollData = null; 
            }
        },

        // Verifies scrolling data using the passed viewport and extent as newly computed values. 
        // Checks the X/Y offset and coerces them into the range [0, Extent - ViewportSize]
        // If extent, viewport, or the newly coerced offsets are different than the existing offset, 
        //   cachces are updated and InvalidateScrollInfo() is called. 
//        private void 
        VerifyScrollData:function(/*Size*/ viewport, /*Size*/ extent)
        { 
//            Debug.Assert(IsScrollClient);

            var fValid = true;
 
            // These two lines of code are questionable, but they are needed right now as VSB may return
            //  Infinity size from measure, which is a regression from the old scrolling model. 
            // They also have the incidental affect of probably avoiding reinvalidation at Arrange 
            //   when inside a parent that measures you to Infinity.
            if (Double.IsInfinity(viewport.Width)) viewport.Width = extent.Width; 
            if (Double.IsInfinity(viewport.Height)) viewport.Height = extent.Height;

            fValid &= DoubleUtil.AreClose(viewport, this._scrollData._viewport);
            fValid &= DoubleUtil.AreClose(extent, this._scrollData._extent); 
            this._scrollData._viewport = viewport;
            this._scrollData._extent = extent; 
 
            fValid &= CoerceOffsets();
 
            if (!fValid)
            {
            	this.ScrollOwner.InvalidateScrollInfo();
            } 
        },
        
//        private bool 
        CoerceOffsets:function() 
        {
//            Debug.Assert(IsScrollClient); 
            var computedOffset = new Vector(
                CoerceOffset(_scrollData._offset.X, _scrollData._extent.Width, _scrollData._viewport.Width),
                CoerceOffset(_scrollData._offset.Y, _scrollData._extent.Height, _scrollData._viewport.Height));
 
            var fValid = DoubleUtil.AreClose(_scrollData._computedOffset, computedOffset);
            this._scrollData._computedOffset = computedOffset; 
 
            return fValid;
        },

	});
	
	Object.defineProperties(ScrollContentPresenter.prototype,{
		   /// <summary> 
        /// AdornerLayer on which adorners are rendered. 
        /// Adorners are rendered under the ScrollContentPresenter's clip region.
        /// </summary> 
//        public AdornerLayer 
		AdornerLayer:
        {
            get:function() { return this._adornerLayer; }
        }, 

        /// <summary> 
        /// This property indicates whether the ScrollContentPresenter should try to allow the Content 
        /// to scroll or not.  A true value indicates Content should be allowed to scroll if it supports
        /// IScrollInfo.  A false value will cause ScrollContentPresenter to always act as the scrolling 
        /// client.
        /// </summary>
//        public bool 
		CanContentScroll:
        { 
            get:function() { return this.GetValue(CanContentScrollProperty); },
            set:function(value) { this.SetValue(CanContentScrollProperty, value); } 
        }, 

        /// <summary> 
        /// ScrollContentPresenter reacts to this property by changing it's child measurement algorithm.
        /// If scrolling in a dimension, infinite space is allowed the child; otherwise, available size is preserved.
        /// </summary>
//        public bool 
		CanHorizontallyScroll: 
        {
            get:function() { return (this.IsScrollClient) ? this.EnsureScrollData()._canHorizontallyScroll : false;  },
            set:function(value)
            {
                if (this.IsScrollClient && (this.EnsureScrollData()._canHorizontallyScroll != value)) 
                {
                	this._scrollData._canHorizontallyScroll = value;
                	this.InvalidateMeasure();
                } 
            }
        }, 
 
        /// <summary>
        /// ScrollContentPresenter reacts to this property by changing it's child measurement algorithm. 
        /// If scrolling in a dimension, infinite space is allowed the child; otherwise, available size is preserved.
        /// </summary>
//        public bool 
		CanVerticallyScroll:
        { 
            get:function() { return (this.IsScrollClient) ? this.EnsureScrollData()._canVerticallyScroll : false; },
            set:function(value) 
            { 
                if (this.IsScrollClient && (this.EnsureScrollData()._canVerticallyScroll != value))
                { 
                	this._scrollData._canVerticallyScroll = value;
                	this.InvalidateMeasure();
                }
            } 
        },
 
        /// <summary> 
        /// ExtentWidth contains the horizontal size of the scrolled content element in 1/96"
        /// </summary> 
//        public double 
		ExtentWidth:
        {
            get:function()  { return (this.IsScrollClient) ? this.EnsureScrollData()._extent.Width : 0.0; }
        },
        /// <summary>
        /// ExtentHeight contains the vertical size of the scrolled content element in 1/96" 
        /// </summary> 
//        public double 
		ExtentHeight:
        { 
            get:function()  { return (this.IsScrollClient) ? this.EnsureScrollData()._extent.Height : 0.0; }
        },
        /// <summary>
        /// ViewportWidth contains the horizontal size of content's visible range in 1/96" 
        /// </summary>
//        public double 
		ViewportWidth: 
        { 
            get:function() { return (this.IsScrollClient) ? this.EnsureScrollData()._viewport.Width : 0.0; }
        }, 
        /// <summary>
        /// ViewportHeight contains the vertical size of content's visible range in 1/96"
        /// </summary>
//        public double 
		ViewportHeight: 
        {
            get:function() { return (this.IsScrollClient) ? this.EnsureScrollData()._viewport.Height : 0.0; } 
        }, 

        /// <summary> 
        /// HorizontalOffset is the horizontal offset of the scrolled content in 1/96".
        /// </summary>
//        public double 
		HorizontalOffset: 
        {
            get:function() { return (this.IsScrollClient) ? this.EnsureScrollData()._computedOffset.X : 0.0; } 
        }, 
        /// <summary>
        /// VerticalOffset is the vertical offset of the scrolled content in 1/96". 
        /// </summary>
//        public double 
		VerticalOffset:
        { 
            get:function() { return (this.IsScrollClient) ? this.EnsureScrollData()._computedOffset.Y : 0.0; }
        }, 
 
        /// <summary>
        /// ScrollOwner is the container that controls any scrollbars, headers, etc... that are dependant 
        /// on this ScrollArea's properties.
        /// </summary>
//        public ScrollViewer 
		ScrollOwner: 
        {
            get:function() { return (this.IsScrollClient) ? this._scrollData._scrollOwner: null; },
            set:function(value) { if (this.IsScrollClient) { this._scrollData._scrollOwner = value; } } 
        },
        
        /// <summary> 
        /// Returns the Visual children count.
        /// </summary>
//        protected override int 
        VisualChildrenCount:
        { 
            get:function()
            { 
                // Four states make sense: 
                // 0 Children.  No Content or AdornerLayer.  Valid - do nothing.
                // 2 Children.  Content is first child, AdornerLayer 

                // One for the base.TemplateChild and one for the _adornerlayer.
                return (base.TemplateChild == null) ? 0 : 2;
            } 
        },
        
        /// <summary> 
        /// Gets or sets the template child of the FrameworkElement. 
        /// </summary>
//        override internal UIElement 
        TemplateChild: 
        {
            get:function()
            {
                return base.TemplateChild; 
            },
            set:function(value) 
            { 
                var oldTemplate = base.TemplateChild;
                if (value != oldTemplate) 
                {
                    if (oldTemplate != null && value == null)
                    {
                        // If we used to have a template child and we don't have a 
                        // new template child disconnect the adorner layer.
                        this.RemoveVisualChild(_adornerLayer); 
                    } 

                    base.TemplateChild = value; 

                    if(oldTemplate == null && value != null)
                    {
                        // If we did not use to have a template child, but we have one 
                        // now, attach the adorner layer.
                        this.AddVisualChild(_adornerLayer); 
                    } 
                }
            } 
        },
        
//        private bool 
        IsScrollClient:
        { 
            get:function() { return (_scrollInfo == this); }
        }
 		  
	});
	
	Object.defineProperties(ScrollContentPresenter, {
		 /// <summary>
        /// DependencyProperty for <see cref="CanContentScroll" /> property.
        /// </summary>
//        public static readonly DependencyProperty 
        CanContentScrollProperty:
	    {
	    	get:function(){
	    		if(ItemsPresenter._CornerRadiusProperty == undefined){
	    			ItemsPresenter._CornerRadiusProperty  = 
	                    ScrollViewer.CanContentScrollProperty.AddOwner(
	                    		ScrollContentPresenter.Type, 
	                            /*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnCanContentScrollChanged))*/
	                    		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnCanContentScrollChanged)));  	
	    		}
	    		
	    		return ItemsPresenter._CornerRadiusProperty;
	    	}
	    }
	});
	
//	internal static double 
	ComputeScrollOffsetWithMinimalScroll = function(
            /*double*/ topView,
            /*double*/ bottomView, 
            /*double*/ topChild,
            /*double*/ bottomChild) 
    { 
        var alignTop = false;
        var alignBottom = false; 
        return ComputeScrollOffsetWithMinimalScroll(topView, bottomView, topChild, bottomChild, /*ref alignTop*/alignTopRef, /*ref alignBottom*/alignBottomRef);
    };

//    internal static double 
    ComputeScrollOffsetWithMinimalScroll = function( 
    		/*double*/ topView,
    		/*double*/ bottomView, 
    		/*double*/ topChild, 
    		/*double*/ bottomChild,
        /*ref bool alignTop*/alignTopRef, 
        /*ref bool alignBottom*/alignBottomRef)
    {
        // # CHILD POSITION       CHILD SIZE      SCROLL      REMEDY
        // 1 Above viewport       <= viewport     Down        Align top edge of child & viewport 
        // 2 Above viewport       > viewport      Down        Align bottom edge of child & viewport
        // 3 Below viewport       <= viewport     Up          Align bottom edge of child & viewport 
        // 4 Below viewport       > viewport      Up          Align top edge of child & viewport 
        // 5 Entirely within viewport             NA          No scroll.
        // 6 Spanning viewport                    NA          No scroll. 
        //
        // Note: "Above viewport" = childTop above viewportTop, childBottom above viewportBottom
        //       "Below viewport" = childTop below viewportTop, childBottom below viewportBottom
        // These child thus may overlap with the viewport, but will scroll the same direction/ 

            var fAbove = DoubleUtil.LessThan(topChild, topView) && DoubleUtil.LessThan(bottomChild, bottomView); 
            var fBelow = DoubleUtil.GreaterThan(bottomChild, bottomView) && DoubleUtil.GreaterThan(topChild, topView); 
            var fLarger = (bottomChild - topChild) > (bottomView - topView);
 
            // Handle Cases:  1 & 4 above
            if ((fAbove && !fLarger)
               || (fBelow && fLarger)
               || alignTop) 
            {
                alignTop = true; 
                return topChild; 
            }
 
            // Handle Cases: 2 & 3 above
            else if (fAbove || fBelow || alignBottom)
            {
                alignBottom = true; 
                return (bottomChild - (bottomView - topView));
            } 
 
            // Handle cases: 5 & 6 above.
        return topView; 
    };

//    static internal double 
    ValidateInputOffset = function(/*double*/ offset, /*string*/ parameterName)
    { 
        if (DoubleUtil.IsNaN(offset))
        { 
            throw new ArgumentOutOfRangeException(parameterName, SR.Get(SRID.ScrollViewer_CannotBeNaN, parameterName)); 
        }
        return Math.max(0.0, offset); 
    };
    
    // Returns an offset coerced into the [0, Extent - Viewport] range. 
    // Internal because it is also used by other Avalon ISI implementations (just to avoid code duplication).
//    static internal double 
    CoerceOffset = function(/*double*/ offset, /*double*/ extent, /*double*/ viewport) 
    {
        if (offset > extent - viewport) { offset = extent - viewport; }
        if (offset < 0) { offset = 0; }
        return offset; 
    };
    
    // This property is structurally important; we can't do layout without it set right.
    // So, we synchronously make changes.
//    static private void 
    OnCanContentScrollChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        ScrollContentPresenter scp = (ScrollContentPresenter)d; 
        if (d._scrollInfo == null) 
        {
            return; 
        }

//
        d.HookupScrollingComponents(); 
        d.InvalidateMeasure();
    };
        
	
	ScrollContentPresenter.Type = new Type("ScrollContentPresenter", ScrollContentPresenter, 
			[ContentPresenter.Type, IScrollInfo.Type]);
	return ScrollContentPresenter;
});

//        // Only one of the following will be used. 
//        // The _scrollInfo holds a content IScrollInfo implementation that is given to the ScrollViewer. 
//        // _scrollData holds values for the scrolling properties we use if we are handling IScrollInfo for the ScrollViewer ourself.
//        // ScrollData could implement IScrollInfo, but then the v-table would hurt in the common case as much as we save 
//        //   in the less common case.
//        private IScrollInfo _scrollInfo;
//        private ScrollData _scrollData;
//        // To hold adorners (caret, &c...) under the clipping region of the scroller. 
//        private readonly AdornerLayer _adornerLayer;



