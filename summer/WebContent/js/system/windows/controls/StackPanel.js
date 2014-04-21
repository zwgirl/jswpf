/**
 * StackPanel
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel", "controls/Orientation", "windows/FrameworkPropertyMetadata",
        "windows/ValidateValueCallback", "windows/PropertyChangedCallback", "primitives/ScrollBar",
        "windows/Size", "windows/Rect"], 
		function(declare, Type, Panel, Orientation, FrameworkPropertyMetadata,
				ValidateValueCallback, PropertyChangedCallback, ScrollBar,
				Size, Rect){
	
	
	var StackPanel = declare("StackPanel", Panel,{
		constructor:function(){
	        // Logical scrolling and virtualization data. 
//	        private ScrollData 
	        this._scrollData = null; 
	        
	        this._dom = window.document.createElement("div");
        	this._dom._source = this;
            this._dom.id = "StackPanel";
	        this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
	       /// <summary>
        /// Scroll content by one line to the top.
        /// </summary> 
//        public void 
        LineUp:function()
        { 
        	this.SetVerticalOffset(this.VerticalOffset - ((this.Orientation == Orientation.Vertical) ? 1.0 : this.ScrollViewer._scrollLineDelta)); 
        },
 
        /// <summary>
        /// Scroll content by one line to the bottom.
        /// </summary>
//        public void 
        LineDown:function() 
        {
        	this.SetVerticalOffset(this.VerticalOffset + ((this.Orientation == Orientation.Vertical) ? 1.0 : this.ScrollViewer._scrollLineDelta)); 
        } ,

        /// <summary> 
        /// Scroll content by one line to the left.
        /// </summary>
//        public void 
        LineLeft:function()
        { 
            this.SetHorizontalOffset(this.HorizontalOffset - ((this.Orientation == Orientation.Horizontal) ? 1.0 : this.ScrollViewer._scrollLineDelta));
        } ,
 
        /// <summary>
        /// Scroll content by one line to the right. 
        /// </summary>
//        public void 
        LineRight:function()
        {
        	this.SetHorizontalOffset(this.HorizontalOffset + ((this.Orientation == Orientation.Horizontal) ? 1.0 : this.ScrollViewer._scrollLineDelta)); 
        },
 
        /// <summary> 
        /// Scroll content by one page to the top.
        /// </summary> 
//        public void 
        PageUp:function()
        {
        	this.SetVerticalOffset(this.VerticalOffset - this.ViewportHeight);
        }, 

        /// <summary> 
        /// Scroll content by one page to the bottom. 
        /// </summary>
//        public void 
        PageDown:function() 
        {
        	this.SetVerticalOffset(this.VerticalOffset + this.ViewportHeight);
        },
 
        /// <summary>
        /// Scroll content by one page to the left. 
        /// </summary> 
//        public void 
        PageLeft:function()
        { 
        	this.SetHorizontalOffset(this.HorizontalOffset - this.ViewportWidth);
        },

        /// <summary> 
        /// Scroll content by one page to the right.
        /// </summary> 
//        public void 
        PageRight:function() 
        {
        	this.SetHorizontalOffset(this.HorizontalOffset + this.ViewportWidth); 
        },

        /// <summary>
        /// Scroll content by one page to the top. 
        /// </summary>
//        public void 
        MouseWheelUp:function() 
        { 
        	this.SetVerticalOffset(this.VerticalOffset - SystemParameters.WheelScrollLines * ((this.Orientation == Orientation.Vertical) ? 1.0 : this.ScrollViewer._scrollLineDelta));
        }, 

        /// <summary>
        /// Scroll content by one page to the bottom.
        /// </summary> 
//        public void 
        MouseWheelDown:function()
        { 
        	this.SetVerticalOffset(this.VerticalOffset + SystemParameters.WheelScrollLines * ((this.Orientation == Orientation.Vertical) ? 1.0 : this.ScrollViewer._scrollLineDelta)); 
        },
 
        /// <summary>
        /// Scroll content by one page to the left.
        /// </summary>
//        public void 
        MouseWheelLeft:function() 
        {
        	this.SetHorizontalOffset(this.HorizontalOffset - 3.0 * ((this.Orientation == Orientation.Horizontal) ? 1.0 : this.ScrollViewer._scrollLineDelta)); 
        }, 

        /// <summary> 
        /// Scroll content by one page to the right.
        /// </summary>
//        public void 
        MouseWheelRight:function()
        { 
        	this.SetHorizontalOffset(this.HorizontalOffset + 3.0 * ((this.Orientation == Orientation.Horizontal) ? 1.0 : this.ScrollViewer._scrollLineDelta));
        }, 
 
        /// <summary>
        /// Set the HorizontalOffset to the passed value. 
        /// </summary>
//        public void 
        SetHorizontalOffset:function(/*double*/ offset)
        {
        },

        /// <summary> 
        /// Set the VerticalOffset to the passed value.
        /// </summary> 
//        public void 
        SetVerticalOffset:function(/*double*/ offset) 
        {
        } ,

        /// <summary>
        /// General StackPanel layout behavior is to grow unbounded in the "stacking" direction (Size To Content). 
        /// Children in this dimension are encouraged to be as large as they like.  In the other dimension,
        /// StackPanel will assume the maximum size of its children.
        /// </summary>
        /// <remarks> 
        /// When scrolling, StackPanel will not grow in layout size but effectively add the children on a z-plane which
        /// will probably be clipped by some parent (typically a ScrollContentPresenter) to Stack's size. 
        /// </remarks> 
        /// <param name="constraint">Constraint</param>
        /// <returns>Desired size</returns> 
//        protected override Size 
        MeasureOverride:function()
        {
            //  Iterate through children. 
            //  While we still supported virtualization, this was hidden in a child iterator (see source history).
            // 
            for (var i = 0, count = this.InternalChildren.Count; i < count; ++i) 
            {
                // Get next child. 
                /*UIElement*/var child = this.InternalChildren.Get(i);

                if (child == null) { continue; }

                // Measure the child.
                child.Measure(); 
            } 
        },
        
        OnAddChild:function(child){
        	if(this.ArrangeDirty){
        		return;
        	}
        	child.Arrange();
        	this._dom.appendChild(child._dom);
        },
        
        OnRemoveChild:function(child){
        	if(this.ArrangeDirty){
        		return;
        	}
//        	child.Arrange();
        	this._dom.removeChild(child._dom);
        },
        
//        /// <summary>
//        /// Content arrangement.
//        /// </summary> 
//        /// <param name="arrangeSize">Arrange size</param>
////        protected override Size 
//        ArrangeOverride:function() 
//        { 
//         	if(this.ArrangeDirty){
//         		this.ArrangeDirty = false;
//         		
//                // Arrange and Position Children. 
//                //
//                if(this.Orientation == Orientation.Vertical){
//                    for (var i = 0, count = this.InternalChildren.Count; i < count; ++i) 
//                    { 
//                        var child = this.InternalChildren.Get(i);
//
//                        if (child == null) { continue; }
//     
//                        child.Arrange(); 
//                        
//                        this._dom.appendChild(child._dom);
//                    }
//                }else{
//                	var table = document.createElement("table");
//                	this._dom.appendChild(table);
//                	var tr = document.createElement("tr");
//                	table.appendChild(tr);
//                	
//                	for(var i = 0, count = this.InternalChildren.Count; i < count; ++i){
//                		var child = this.InternalChildren.Get(i);
//                		var td  = document.createElement("td");
//                		child.Arrange(); 
//                		child._parentDom = td;
//                		td.appendChild(child._dom);
//                		tr.appendChild(td);
//                	}
//                }
//        	}
//
//        },
        
        /// <summary>
        /// Content arrangement.
        /// </summary> 
        /// <param name="arrangeSize">Arrange size</param>
//        protected override Size 
        ArrangeOverride:function() 
        { 
     		this.ArrangeDirty = false;
     		this._dom.style.setProperty("display", "flex");
     		
            // Arrange and Position Children. 
            //
            if(this.Orientation == Orientation.Vertical){
            	this._dom.style.setProperty("flex-flow", "column");
            }else{
            	this._dom.style.setProperty("flex-flow", "row");
            }
            
            this._dom.style.setProperty("justify-content", "center");
            this._dom.style.setProperty("align-items", "center");
            
            for (var i = 0, count = this.InternalChildren.Count; i < count; ++i) 
            { 
                var child = this.InternalChildren.Get(i);

                if (child == null) { continue; }

                child.Arrange(); 
//                child._dom.style.setProperty("flex-");
                
                this._dom.appendChild(child._dom);
            }

        },
        
//        private void 
        EnsureScrollData:function() 
        {
            if (this._scrollData == null) { this._scrollData = new ScrollData(); } 
        },

        // OnScrollChange is an override called whenever the IScrollInfo exposed scrolling state changes on this element.
        // At the time this method is called, scrolling state is in its new, valid state. 
//        private void 
        OnScrollChange:function() 
        {
            if (this.ScrollOwner != null) { this.ScrollOwner.InvalidateScrollInfo(); } 
        },

//

	});
	
	Object.defineProperties(StackPanel.prototype,{
	      /// <summary> 
        /// Specifies dimension of children stacking. 
        /// </summary>
//        public Orientation 
        Orientation:
        {
            get:function() { return this.GetValue(StackPanel.OrientationProperty); },
            set:function(value) { this.SetValue(StackPanel.OrientationProperty, value); }
        },
        
        /// <summary>
        /// This property is always true because this panel has vertical or horizontal orientation
        /// </summary> 
//        protected internal override bool 
        HasLogicalOrientation:
        { 
            get:function() { return true; } 
        },
 
        /// <summary>
        ///     Orientation of the panel if its layout is in one dimension.
        /// Otherwise HasLogicalOrientation is false and LogicalOrientation should be ignored
        /// </summary> 
//        protected internal override Orientation 
        LogicalOrientation:
        { 
            get:function() { return this.Orientation; } 
        },
 
        /// <summary> 
        /// StackPanel reacts to this property by changing it's child measurement algorithm. 
        /// If scrolling in a dimension, infinite space is allowed the child; otherwise, available size is preserved.
        /// </summary> 
//        public bool 
        CanHorizontallyScroll:
        {
            get:function() 
            {
                if (this._scrollData == null) { return false; } 
                return this._scrollData._allowHorizontal; 
            },
            set:function(value) 
            {
                this.EnsureScrollData();
                if (this._scrollData._allowHorizontal != value)
                { 
                	this._scrollData._allowHorizontal = value;
                	this.InvalidateMeasure(); 
                } 
            }
        },

        /// <summary>
        /// StackPanel reacts to this property by changing it's child measurement algorithm.
        /// If scrolling in a dimension, infinite space is allowed the child; otherwise, available size is preserved. 
        /// </summary>
//        public bool 
        CanVerticallyScroll: 
        {
            get:function() 
            {
                if (this._scrollData == null) { return false; }
                return this._scrollData._allowVertical;
            }, 
            set:function(value)
            { 
            	this.EnsureScrollData(); 
                if (this._scrollData._allowVertical != value)
                { 
                	this._scrollData._allowVertical = value;
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
            get:function()
            { 
                if (this._scrollData == null) { return 0.0; }
                return this._scrollData._extent.Width; 
            } 
        },
 
        /// <summary>
        /// ExtentHeight contains the vertical size of the scrolled content element in 1/96"
        /// </summary>
//        public double 
        ExtentHeight: 
        {
            get:function() 
            { 
                if (this._scrollData == null) { return 0.0; }
                return this._scrollData._extent.Height; 
            }
        },

        /// <summary> 
        /// ViewportWidth contains the horizontal size of content's visible range in 1/96"
        /// </summary> 
//        public double 
        ViewportWidth: 
        {
            get:function() 
            {
                if (this._scrollData == null) { return 0.0; }
                return this._scrollData._viewport.Width;
            } 
        },
 
        /// <summary> 
        /// ViewportHeight contains the vertical size of content's visible range in 1/96"
        /// </summary> 
//        public double 
        ViewportHeight:
        {
            get:function()
            { 
                if (this._scrollData == null) { return 0.0; }
                return this._scrollData._viewport.Height; 
            } 
        },
 
        /// <summary>
        /// HorizontalOffset is the horizontal offset of the scrolled content in 1/96".
        /// </summary>
//        public double 
        HorizontalOffset:
        { 
            get:function() 
            {
                if (this._scrollData == null) { return 0.0; } 
                return this._scrollData._computedOffset.X;
            }
        },
 
        /// <summary>
        /// VerticalOffset is the vertical offset of the scrolled content in 1/96". 
        /// </summary> 
//        public double 
        VerticalOffset: 
        {
            get:function()
            {
                if (this._scrollData == null) { return 0.0; } 
                return this._scrollData._computedOffset.Y;
            } 
        }, 

        /// <summary> 
        /// ScrollOwner is the container that controls any scrollbars, headers, etc... that are dependant
        /// on this IScrollInfo's properties.
        /// </summary>
//        public ScrollViewer 
        ScrollOwner:
        { 
            get:function() 
            {
            	this.EnsureScrollData(); 
                return this._scrollData._scrollOwner;
            },
            set:function(value)
            { 
            	this.EnsureScrollData();
                if (value != this._scrollData._scrollOwner) 
                { 
                	this.ResetScrolling(this);
                	this._scrollData._scrollOwner = value; 
                }
            }
        },
        
 
//        private bool 
        IsScrolling:
        {
            get:function() { return (this._scrollData != null) && (this._scrollData._scrollOwner != null); } 
        },
 

////        UIElementCollection IStackMeasure.
//        InternalChildren: 
//        {
//            get:function() { return this.InternalChildren; } 
//        } 

	});
	
	Object.defineProperties(StackPanel, {
		  /// <summary> 
        /// DependencyProperty for <see cref="Orientation" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
        OrientationProperty:
        {
        	get:function(){
        		if(StackPanel._OrientationProperty === undefined){
        			StackPanel._OrientationProperty = 
                        DependencyProperty.Register(
                                "Orientation",
                                Number.Type,
                                StackPanel.Type, 
                                /*new FrameworkPropertyMetadata(
                                        Orientation.Vertical, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnOrientationChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        Orientation.Vertical, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, OnOrientationChanged)),
                                new ValidateValueCallback(null, ScrollBar.IsValidOrientation));  
        		}
        		
        		return StackPanel._OrientationProperty;
        	}
        }
	});
	
//    static private int 
    function CoerceOffsetToInteger(/*double*/ offset, /*int*/ numberOfItems)
    { 
        var iNewOffset;

        if (Number.IsNegativeInfinity(offset))
        { 
            iNewOffset = 0;
        } 
        else if (Number.IsPositiveInfinity(offset)) 
        {
            iNewOffset = numberOfItems - 1; 
        }
        else
        {
            iNewOffset = offset; 
            iNewOffset = Math.max(Math.min(numberOfItems - 1, iNewOffset), 0);
        } 

        return iNewOffset;
    } 

    /// <summary> 
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/>
    /// </summary> 
//    private static void 
    function OnOrientationChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        // Since Orientation is so essential to logical scrolling/virtualization, we synchronously check if
        // the new value is different and clear all scrolling data if so. 
        ResetScrolling(d instanceof StackPanel ? d : null);
    }
    
//  private static void 
    function ResetScrolling(/*StackPanel*/ element)
    { 
        element.InvalidateMeasure();

        // Clear scrolling data.  Because of thrash (being disconnected & reconnected, &c...), we may 
        if (element.IsScrolling)
        { 
//            element._scrollData.ClearLayout();
        }
    }
 
	
	StackPanel.Type = new Type("StackPanel", StackPanel, [Panel.Type]);
	return StackPanel;
});
//    /// <summary> 
//    ///     Internal interface for elements which needs stack like measure
//    /// </summary> 
//    internal interface IStackMeasure 
//    {
//        bool IsScrolling { get; } 
//        UIElementCollection InternalChildren { get; }
//        Orientation Orientation { get; }
//        bool CanVerticallyScroll { get; }
//        bool CanHorizontallyScroll { get; } 
//        void OnScrollChange();
//    } 
// 
//    /// <summary>
//    ///     Internal interface for scrolling information of elements which 
//    ///     need stack like measure.
//    /// </summary>
//    internal interface IStackMeasureScrollData
//    { 
//        Vector Offset { get; set; }
//        Size Viewport { get; set; } 
//        Size Extent { get; set; } 
//        Vector ComputedOffset { get; set; }
//        void SetPhysicalViewport(double value); 
//    }
//
//    /// <summary>
//    /// StackPanel is used to arrange children into single line. 
//    /// </summary>
//    public class StackPanel : Panel, IScrollInfo, IStackMeasure 
//    { 
      
