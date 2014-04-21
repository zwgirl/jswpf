/**
 * Canvas
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel", "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback",
        "windows/ValidateValueCallback", "shapes/Shape"], 
		function(declare, Type, Panel, FrameworkPropertyMetadata, PropertyChangedCallback,
				Shape){
	var Canvas = declare("Canvas", Panel,{
		constructor:function(){
			this._dom = window.document.createElement('div');
			this._dom.setAttribute("id", "canvas");
			
			this._dom.style.setProperty("position", "relative");
			this._dom.style.setProperty("overflow", "auto");
		},
		
	       /// <summary>
        /// Updates DesiredSize of the Canvas.  Called by parent UIElement.  This is the first pass of layout. 
        /// </summary>
        /// <param name="constraint">Constraint size is an "upper limit" that Canvas should not exceed.</param>
        /// <returns>Canvas' desired size.</returns>
//        protected override Size 
		MeasureOverride:function() 
        {
            for (var i =0, count = this.InternalChildren.Count; i<count; i++)
            { 
            	var child = this.InternalChildren.Get(i);
                if (child == null) { continue; }
                child.Measure();
            }
        }, 
 
        /// <summary>
        /// Canvas computes a position for each of its children taking into account their margin and 
        /// attached Canvas properties: Top, Left.
        ///
        /// Canvas will also arrange each of its children.
        /// </summary> 
        /// <param name="arrangeSize">Size that Canvas will assume to position children.</param>
//        protected override Size 
		ArrangeOverride:function() 
        { 
//			parent.appendChild(this._dom);
            //Canvas arranges children at their DesiredSize.
            //This means that Margin on children is actually respected and added 
            //to the size of layout partition for a child.
            //Therefore, is Margin is 10 and Left is 20, the child's ink will start at 30.

            for (var i =0, count = this.InternalChildren.Count; i<count; i++)
            { 
            	var child = this.InternalChildren.Get(i);
            	
                if (child == null) { continue; } 
 
                child.Arrange(this._dom);
                child._dom.style.setProperty("position", "absolute");
                this._dom.appendChild(child._dom);
            }
        }, 

        /// <summary> 
        /// Override of <seealso cref="UIElement.GetLayoutClip"/>. 
        /// </summary>
        /// <returns>Geometry to use as additional clip if LayoutConstrained=true</returns> 
//        protected override Geometry 
        GetLayoutClip:function(/*Size*/ layoutSlotSize)
        {
            //Canvas only clips to bounds if ClipToBounds is set,
            //  no automatic clipping 
            if(this.ClipToBounds)
                return new RectangleGeometry(new Rect(RenderSize)); 
            else 
                return null;
        } 
	});
	
	Object.defineProperties(Canvas.prototype,{
		  
	});
	
	Object.defineProperties(Canvas,{

        /// <summary> 
        /// This is the dependency property registered for the Canvas' Left attached property. 
        ///
        /// The Left property is read by a Canvas on its children to determine where to position them. 
        /// The child's offset from this property does not have an effect on the Canvas' own size.
        /// Conflict between the Left and Right properties is resolved in favor of Left.
        /// </summary>
//        public static readonly DependencyProperty 
		LeftProperty:
        {
        	get:function(){
        		if(Canvas._LeftProperty === undefined){
        			Canvas._LeftProperty = DependencyProperty.RegisterAttached("Left", String.Type, 
        					Canvas.Type,
                            /*new FrameworkPropertyMetadata(Number.NaN, new PropertyChangedCallback(null, OnPositioningChanged))*/
        					FrameworkPropertyMetadata.Build3PCCB(null, FrameworkPropertyMetadataOptions.AffectsRender, new PropertyChangedCallback(null, OnPositioningChanged)), 
                            new ValidateValueCallback(Shape.IsDoubleFiniteOrNaN)); 
        			Canvas._LeftProperty._cssName = "left";
        		}
        		
        		return Canvas._LeftProperty;
        	}
        }, 
           

        /// <summary> 
        /// This is the dependency property registered for the Canvas' Top attached property.
        ///
        /// The Top property is read by a Canvas on its children to determine where to position them.
        /// The child's offset from this property does not have an effect on the Canvas' own size. 
        /// </summary>
//        public static readonly DependencyProperty 
		TopProperty:
        {
        	get:function(){
        		if(Canvas._TopProperty === undefined){
        			Canvas._TopProperty = DependencyProperty.RegisterAttached("Top", String.Type, Canvas.Type, 
                            /*new FrameworkPropertyMetadata(Number.NaN, new PropertyChangedCallback(null, OnPositioningChanged))*/
        					FrameworkPropertyMetadata.Build3PCCB(null, FrameworkPropertyMetadataOptions.AffectsRender, new PropertyChangedCallback(null, OnPositioningChanged)),
                            new ValidateValueCallback(Shape.IsDoubleFiniteOrNaN)); 
        			Canvas._TopProperty._cssName = "top";
 
        		}
        		
        		return Canvas._TopProperty;
        	}
        }, 
            
        /// <summary>
        /// This is the dependency property registered for the Canvas' Right attached property.
        /// 
        /// The Right property is read by a Canvas on its children to determine where to position them.
        /// The child's offset from this property does not have an effect on the Canvas' own size. 
        /// Conflict between the Left and Right properties is resolved in favor of Left. 
        /// </summary>
//        public static readonly DependencyProperty 
		RightProperty:
        {
        	get:function(){
        		if(Canvas._RightProperty === undefined){
        			Canvas._RightProperty = DependencyProperty.RegisterAttached("Right", String.Type, Canvas.Type,
                            /*new FrameworkPropertyMetadata(Number.NaN, new PropertyChangedCallback(null, OnPositioningChanged))*/
        					FrameworkPropertyMetadata.Build3PCCB(null, FrameworkPropertyMetadataOptions.AffectsRender, new PropertyChangedCallback(null, OnPositioningChanged)),
                            new ValidateValueCallback(Shape.IsDoubleFiniteOrNaN)); 
        			Canvas._RightProperty._cssName = "right";
        		}
        		
        		return Canvas._RightProperty;
        	}
        }, 
            
 
        /// <summary>
        /// This is the dependency property registered for the Canvas' Bottom attached property. 
        /// 
        /// The Bottom property is read by a Canvas on its children to determine where to position them.
        /// The child's offset from this property does not have an effect on the Canvas' own size. 
        /// </summary>
//        public static readonly DependencyProperty 
		BottomProperty:
        {
        	get:function(){
        		if(Canvas._BottomProperty === undefined){
        			Canvas._BottomProperty = DependencyProperty.RegisterAttached("Bottom", String.Type, Canvas.Type,
                            /*new FrameworkPropertyMetadata(Number.NaN, new PropertyChangedCallback(null, OnPositioningChanged))*/
        					FrameworkPropertyMetadata.Build3PCCB(null, FrameworkPropertyMetadataOptions.AffectsRender, new PropertyChangedCallback(null, OnPositioningChanged)), 
                            new ValidateValueCallback(Shape.IsDoubleFiniteOrNaN)); 
        			Canvas._BottomProperty._cssName = "bottom";
        		}
        		
        		return Canvas._BottomProperty;
        	}
        },
            		  
	});
	

    /// <summary>
    /// Reads the attached property Left from the given element.
    /// </summary>
    /// <param name="element">The element from which to read the Left attached property.</param> 
    /// <returns>The property's value.</returns>
    /// <seealso cref="Canvas.LeftProperty" /> 
//    public static double 
	Canvas.GetLeft = function(/*UIElement*/ element) 
    {
        if (element == null) { throw new ArgumentNullException("element"); }
        return element.GetValue(Canvas.LeftProperty);
    }; 

    /// <summary> 
    /// Writes the attached property Left to the given element. 
    /// </summary>
    /// <param name="element">The element to which to write the Left attached property.</param> 
    /// <param name="length">The length to set</param>
    /// <seealso cref="Canvas.LeftProperty" />
//    public static void 
    Canvas.SetLeft = function(/*UIElement*/ element, /*double*/ length)
    { 
        if (element == null) { throw new ArgumentNullException("element"); }
        element.SetValue(Canvas.LeftProperty, length); 
    }; 

    /// <summary> 
    /// Reads the attached property Top from the given element.
    /// </summary>
    /// <param name="element">The element from which to read the Top attached property.</param>
    /// <returns>The property's value.</returns> 
    /// <seealso cref="Canvas.TopProperty" />
//    public static double 
    Canvas.GetTop = function(/*UIElement*/ element)
    { 
        if (element == null) { throw new ArgumentNullException("element"); }
        return element.GetValue(Canvas.TopProperty);
    };

    /// <summary>
    /// Writes the attached property Top to the given element. 
    /// </summary> 
    /// <param name="element">The element to which to write the Top attached property.</param>
    /// <param name="length">The length to set</param> 
    /// <seealso cref="Canvas.TopProperty" />
//    public static void 
    Canvas.SetTop = function(/*UIElement*/ element, /*double*/ length)
    {
        if (element == null) { throw new ArgumentNullException("element"); } 
        element.SetValue(Canvas.TopProperty, length);
    }; 

    /// <summary>
    /// Reads the attached property Right from the given element. 
    /// </summary>
    /// <param name="element">The element from which to read the Right attached property.</param>
    /// <returns>The property's Length value.</returns>
    /// <seealso cref="Canvas.RightProperty" /> 
//    public static double 
    Canvas.GetRight = function(/*UIElement*/ element) 
    {
        if (element == null) { throw new ArgumentNullException("element"); } 
        return element.GetValue(Canvas.RightProperty);
    };

    /// <summary> 
    /// Writes the attached property Right to the given element.
    /// </summary> 
    /// <param name="element">The element to which to write the Right attached property.</param> 
    /// <param name="length">The Length to set</param>
    /// <seealso cref="Canvas.RightProperty" /> 
//    public static void 
    Canvas.SetRight = function(/*UIElement*/ element, /*double*/ length)
    {
        if (element == null) { throw new ArgumentNullException("element"); }
        element.SetValue(Canvas.RightProperty, length); 
    };

    /// <summary> 
    /// Reads the attached property Bottom from the given element.
    /// </summary> 
    /// <param name="element">The element from which to read the Bottom attached property.</param>
    /// <returns>The property's Length value.</returns>
    /// <seealso cref="Canvas.BottomProperty" />
//    public static double 
    Canvas.GetBottom = function(/*UIElement*/ element) 
    { 
        if (element == null) { throw new ArgumentNullException("element"); }
        return element.GetValue(Canvas.BottomProperty); 
    };

    /// <summary>
    /// Writes the attached property Bottom to the given element. 
    /// </summary>
    /// <param name="element">The element to which to write the Bottom attached property.</param> 
    /// <param name="length">The Length to set</param> 
    /// <seealso cref="Canvas.BottomProperty" />
//    public static void 
    Canvas.SetBottom = function(/*UIElement*/ element, /*double*/ length) 
    {
        if (element == null) { throw new ArgumentNullException("element"); }
        element.SetValue(Canvas.BottomProperty, length);
    };

    //having this invalidate callback allows to host UIElements in Canvas and still 
    //receive invalidations when Left/Top/Bottom/Right properties change -
    //registering the attached properties with AffectsParentArrange flag would be a mistake
    //because those flags only work for FrameworkElements
//    private static void 
    function OnPositioningChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var uie = d instanceof UIElement ? d : null; 
        if(uie != null) 
        {
            var p = VisualTreeHelper.GetParent(uie);
            p = p instanceof Canvas ? p :null; 
            if(p != null){
            	 p.InvalidateArrange();
            }
        }
     } 
	
	Canvas.Type = new Type("Canvas", Canvas, [Panel.Type]);
	return Canvas;
});
