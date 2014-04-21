/**
 * Rectangle
 */

define(["dojo/_base/declare", "system/Type", "shapes/Shape", "media/Stretch"], 
		function(declare, Type, Shape, Stretch){
	
	var Rectangle = declare("Rectangle", Shape,{
		constructor:function(){
//			private Rect 
			this._rect = Rect.Empty;
			
			this._shape = document.createElementNS(Shape.SVG_NS, "rect");
			this.BuildRectangle();
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},
		
		BuildRectangle:function(){
			this._shape._source = this;
			this._shape.setAttribute("width",20);
			this._shape.setAttribute("height",20);
			this._shape.setAttribute("x",0);
			this._shape.setAttribute("x",0);
			
//			this._shape.setAttribute("rx",2);
//			this._shape.setAttribute("rx",2);
			this._shape.setAttribute('fill',"#FF00FF");
			this._shape.setAttribute('fill-opacity',"0.3");
			this._shape.setAttribute('stroke',"#000000");
			this._shape.setAttribute('stroke-width',1);
			this._dom.appendChild(this._shape); 

		},
 
        /// <summary>
        /// Updates DesiredSize of the Rectangle.  Called by parent UIElement.  This is the first pass of layout. 
        /// </summary>
        /// <param name="constraint">Constraint size is an "upper limit" that Rectangle should not exceed.</param>
        /// <returns>Rectangle's desired size.</returns>
//        protected override Size 
		MeasureOverride:function() 
        {
			
//            if (this.Stretch == Stretch.UniformToFill) 
//            { 
//                var width = constraint.Width;
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
//            return this.GetNaturalSize(); 
        },

        /// <summary>
        /// Returns the final size of the shape and cachnes the bounds. 
        /// </summary>
//        protected override Size 
        ArrangeOverride:function() 
        { 
//        	parent.appendChild(this._dom);
//            // Since we do NOT want the RadiusX and RadiusY to change with the rendering transformation, we
//            // construct the rectangle to fit finalSize with the appropriate Stretch mode.  The rendering 
//            // transformation will thus be the identity.
//
//            var penThickness = GetStrokeThickness();
//            var margin = penThickness / 2; 
//
//            this._rect = new Rect( 
//                margin, // X 
//                margin, // Y
//                Math.Max(0, finalSize.Width - penThickness),    // Width 
//                Math.Max(0, finalSize.Height - penThickness));  // Height
//
//            switch (this.Stretch)
//            { 
//                case Stretch.None:
//                    // A 0 Rect.Width and Rect.Height rectangle 
//                	this._rect.Width = this._rect.Height = 0; 
//                    break;
// 
//                case Stretch.Fill:
//                    // The most common case: a rectangle that fills the box.
//                    // _rect has already been initialized for that.
//                    break; 
//
//                case Stretch.Uniform: 
//                    // The maximal square that fits in the final box 
//                    if (this._rect.Width > this._rect.Height)
//                    { 
//                    	this._rect.Width = this._rect.Height;
//                    }
//                    else  // _rect.Width <= _rect.Height
//                    { 
//                    	this._rect.Height = this._rect.Width;
//                    } 
//                    break; 
//
//                case Stretch.UniformToFill: 
//
//                    // The minimal square that fills the final box
//                    if (this._rect.Width < this._rect.Height)
//                    { 
//                    	this._rect.Width = this._rect.Height;
//                    } 
//                    else  // _rect.Width >= _rect.Height 
//                    {
//                    	this._rect.Height = this._rect.Width; 
//                    }
//                    break;
//            }
// 
//
//            this.ResetRenderedGeometry(); 
// 
//            return finalSize;
        },

        /// <summary> 
        /// Render callback.
        /// </summary> 
//        protected override void 
        OnRender:function(/*DrawingContext*/ drawingContext) 
        {
            var pen = GetPen(); 
            drawingContext.DrawRoundedRectangle(this.Fill, pen, this._rect, this.RadiusX, this.RadiusY);
        },
 
//        internal override void 
        CacheDefiningGeometry:function()
        { 
            var margin = this.GetStrokeThickness() / 2;

            this._rect = new Rect(margin, margin, 0, 0);
        }, 

 
        /// <summary> 
        /// Get the natural size of the geometry that defines this shape
        /// </summary> 
//        internal override Size 
        GetNaturalSize:function()
        {
            var strokeThickness = this.GetStrokeThickness();
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
	
	Object.defineProperties(Rectangle.prototype,{
        /// <summary> 
        /// Provide public access to RadiusX property.
        /// <seealso cref="RadiusXProperty"/> 
        /// </summary>
        /// <ExternalAPI/>
//        public double 
		RadiusX:
        {
            get:function() 
            { 
                return this.GetValue(Rectangle.RadiusXProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(Rectangle.RadiusXProperty, value);
            } 
        },

        /// <summary> 
        /// Provide public access to RadiusY property. 
        /// <seealso cref="RadiusYProperty"/>
        /// </summary> 
        /// <ExternalAPI/>
//        public double 
		RadiusY:
        { 
            get:function()
            { 
                return this.GetValue(Rectangle.RadiusYProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(Rectangle.RadiusYProperty, value);
            }
        }, 

        // For a Rectangle, RenderedGeometry = defining geometry and GeometryTransform = Identity 
 
        /// <summary>
        /// The RenderedGeometry property returns the final rendered geometry 
        /// </summary>
//        public override Geometry 
		RenderedGeometry:
        {
            get:function() 
            {
                // RenderedGeometry = defining geometry 
                return new RectangleGeometry(this._rect, this.RadiusX, this.RadiusY); 
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
        /// Get the rectangle that defines this shape
        /// </summary> 
//        protected override Geometry 
		DefiningGeometry:
        { 
            get:function() 
            {
                return new RectangleGeometry(this._rect, this.RadiusX, this.RadiusY); 
            }
        }

	});
	
	Object.defineProperties(Rectangle,{
        /// <summary>
        /// RadiusX Dynamic Property - if set, this rectangle becomes rounded 
        /// </summary>
        /// <ExternalAPI/>
//        public static readonly DependencyProperty 
		RadiusXProperty:
        {
        	get:function(){
        		if(Rectangle._RadiusXProperty === undefined){
        			Rectangle._RadiusXProperty =
        	            DependencyProperty.Register( "RadiusX", Number.Type, Rectangle.Type, 
        	                    /*new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.AffectsRender)*/
        	            		FrameworkPropertyMetadata.Build2(0, FrameworkPropertyMetadataOptions.AffectsRender));
        		}
        		
        		return Rectangle._RadiusXProperty;
        	}
        },
 
        /// <summary> 
        /// RadiusY Dynamic Property - if set, this rectangle becomes rounded
        /// </summary> 
        /// <ExternalAPI/>
//        public static readonly DependencyProperty 
		RadiusYProperty:
        {
        	get:function(){
        		if(Rectangle._RadiusXProperty === undefined){
        			Rectangle._RadiusXProperty =
        	            DependencyProperty.Register( "RadiusY", Number.Type, Rectangle.Type,
        	                    /*new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.AffectsRender)*/
        	            		FrameworkPropertyMetadata.Build2(0, FrameworkPropertyMetadataOptions.AffectsRender)); 
        		}
        		
        		return Rectangle._RadiusXProperty;
        	}
        }
	  
	});
	
    // The default stretch mode of Rectangle is Fill 
//    static Rectangle()
	function Initialize()
    { 
        Shape.StretchProperty.OverrideMetadata(Rectangle.Type, /*new FrameworkPropertyMetadata(Stretch.Fill)*/
        		FrameworkPropertyMetadata.BuildWithDV(Stretch.Fill));
    };
	
	Rectangle.Type = new Type("Rectangle", Rectangle, [Shape.Type]);
	Initialize();
	
	return Rectangle;
});

        

