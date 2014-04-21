/**
 * Ellipse
 */
/// <summary> 
/// The ellipse shape element
/// This element (like all shapes) belongs under a Canvas, 
/// and will be presented by the parent canvas.
/// </summary>
/// <ExternalAPI/>
define(["dojo/_base/declare", "system/Type", "shapes/Shape"], 
		function(declare, Type, Shape){
	var Ellipse = declare("Ellipse", Shape,{
		constructor:function(){
//	        private Rect 
			this._rect = Rect.Empty; 
			this._shape = document.createElementNS(Shape.SVG_NS, "circle");
			this.BuildRectangle();
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		BuildRectangle:function(){
			this._shape._source = this;
			this._shape.setAttribute("width",11);
			this._shape.setAttribute("height",11);
			
			this.SetupStroke(this._shape);
			
			this._dom.appendChild(this._shape); 
		},
 
		 /// <summary>
        /// Updates DesiredSize of the Ellipse.  Called by parent UIElement.  This is the first pass of layout.
        /// </summary>
        /// <param name="constraint">Constraint size is an "upper limit" that Ellipse should not exceed.</param> 
        /// <returns>Ellipse's desired size.</returns>
//        protected override Size 
		MeasureOverride:function(/*Size*/ constraint) 
        { 
//            if (Stretch == Stretch.UniformToFill)
//            { 
//            	var width = constraint.Width;
//                var height = constraint.Height;
//
//                if (Double.IsInfinity(width) && Double.IsInfinity(height)) 
//                {
//                    return GetNaturalSize(); 
//                } 
//                else if (Double.IsInfinity(width) || Double.IsInfinity(height))
//                { 
//                    width = Math.Min(width, height);
//                }
//                else
//                { 
//                    width = Math.Max(width, height);
//                } 
// 
//                return new Size(width, width);
//            } 
//
//            return GetNaturalSize();
        },
 
        /// <summary>
        /// Returns the final size of the shape and caches the bounds. 
        /// </summary> 
//        protected override Size
        ArrangeOverride:function(/*Size*/ finalSize)
        { 
            // We construct the rectangle to fit finalSize with the appropriate Stretch mode.  The rendering
            // transformation will thus be the identity.

//            var penThickness = GetStrokeThickness(); 
//            var margin = penThickness / 2;
// 
//            this._rect = new Rect( 
//                margin, // X
//                margin, // Y 
//                Math.Max(0, finalSize.Width - penThickness),    // Width
//                Math.Max(0, finalSize.Height - penThickness));  // Height
//
//            switch (Stretch) 
//            {
//                case Stretch.None: 
//                    // A 0 Rect.Width and Rect.Height rectangle 
//                    _rect.Width = _rect.Height = 0;
//                    break; 
//
//                case Stretch.Fill:
//                    // The most common case: a rectangle that fills the box.
//                    // _rect has already been initialized for that. 
//                    break;
// 
//                case Stretch.Uniform: 
//                    // The maximal square that fits in the final box
//                    if (_rect.Width > _rect.Height) 
//                    {
//                        _rect.Width = _rect.Height;
//                    }
//                    else  // _rect.Width <= _rect.Height 
//                    {
//                        _rect.Height = _rect.Width; 
//                    } 
//                    break;
// 
//                case Stretch.UniformToFill:
//
//                    // The minimal square that fills the final box
//                    if (_rect.Width < _rect.Height) 
//                    {
//                        _rect.Width = _rect.Height; 
//                    } 
//                    else  // _rect.Width >= _rect.Height
//                    { 
//                        _rect.Height = _rect.Width;
//                    }
//                    break;
//            } 
//
//            ResetRenderedGeometry(); 
// 
//            return finalSize;
        }, 

        /// <summary> 
        /// Render callback.
        /// </summary>
//        protected override void 
        OnRender:function(/*DrawingContext*/ drawingContext)
        { 
            if (!_rect.IsEmpty)
            { 
                /*Pen*/var pen = GetPen(); 
                drawingContext.DrawGeometry(Fill, pen, new EllipseGeometry(_rect));
            } 
        },
        
//        internal override void 
        CacheDefiningGeometry:function() 
        {
            var margin = GetStrokeThickness() / 2; 

            this._rect = new Rect(margin, margin, 0, 0);
        },
 
        /// <summary>
        /// Get the natural size of the geometry that defines this shape 
        /// </summary> 
//        internal override Size 
        GetNaturalSize:function()
        { 
            var strokeThickness = GetStrokeThickness();
            return new Size(strokeThickness, strokeThickness);
        },
 
        /// <summary>
        /// Get the bonds of the rectangle that defines this shape 
        /// </summary> 
//        internal override Rect 
        GetDefiningGeometryBounds:function()
        { 
            return this._rect;
        }
	});
	
	Object.defineProperties(Ellipse.prototype,{
		 
        // For an Ellipse, RenderedGeometry = defining geometry and GeometryTransform = Identity
 
        /// <summary>
        /// The RenderedGeometry property returns the final rendered geometry
        /// </summary>
//        public override Geometry 
		RenderedGeometry: 
        {
            get:function() 
            { 
                // RenderedGeometry = defining geometry
                return this.DefiningGeometry; 
            }
        },

        /// <summary> 
        /// Return the transformation applied to the geometry before rendering
        /// </summary> 
//        public override Transform 
        GeometryTransform: 
        {
            get:function() 
            {
                return this.Transform.Identity;
            }
        },
        
        /// <summary>
        /// Get the ellipse that defines this shape
        /// </summary> 
//        protected override Geometry 
        DefiningGeometry:
        { 
            get:function() 
            {
                if (this._rect.IsEmpty) 
                {
                    return this.Geometry.Empty;
                }
 
                return new EllipseGeometry(this._rect);
            } 
        } 
        
	});
	
    // The default stretch mode of Ellipse is Fill 
//    static Ellipse() 
    function Initialize(){ 
        Shape.StretchProperty.OverrideMetadata(Ellipse.Type, 
        		/*new FrameworkPropertyMetadata(Stretch.Fill)*/
        		FrameworkPropertyMetadata.BuildWithDV(Stretch.Fill));
    }
	
	Ellipse.Type = new Type("Ellipse", Ellipse, [Shape.Type]);
	Initialize();
	
	return Ellipse;
});



