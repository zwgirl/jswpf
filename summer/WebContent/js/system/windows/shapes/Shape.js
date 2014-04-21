/**
 * Shape
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "media/Stretch"], 
		function(declare, Type, FrameworkElement, Stretch){
	var Shape = declare("Shape", FrameworkElement,{
		constructor:function(){
			
			this._dom = document.createElementNS(Shape.SVG_NS, 'svg');
			this.BuildSVG();
		},
		
		BuildSVG:function(){
			this._dom._source = this;
			this._dom.setAttribute("height",'20');
			this._dom.setAttribute("width",'20'); 
//			this._dom.setAttribute("height", this.Height);
//			this._dom.setAttribute("width",this.Width); 
//			this._dom.setAttribute("style",'border:1px solid red; margin:1px; padding:1px;'); 
		},
		
		ApplyTemplate:function(){
			FrameworkElement.prototype.ApplyTemplate.call(this);
		},
		
		SetupStroke:function(shape){
			shape.setAttribute('fill',"#FF00FF");
			shape.setAttribute('stroke',"#000000");
			shape.setAttribute('stroke-width',1);
		},

        /// <summary> 
        /// Updates DesiredSize of the shape.  Called by parent UIElement during is the first pass of layout.
        /// </summary> 
        /// <param name="constraint">Constraint size is an "upper limit" that should not exceed.</param> 
        /// <returns>Shape's desired size.</returns>
//        protected override Size 
		MeasureOverride:function() 
        {
//			this.CacheDefiningGeometry();
//
//            var newSize; 
//
//            var mode = this.Stretch; 
// 
//            if (mode == Stretch.None)
//            { 
//                newSize = this.GetNaturalSize();
//            }
//            else
//            { 
//                newSize = this.GetStretchedRenderSize(mode, GetStrokeThickness(), constraint, GetDefiningGeometryBounds());
//            } 
// 
//            if (this.SizeIsInvalidOrEmpty(newSize))
//            { 
//                // We've encountered a numerical error. Don't draw anything.
//                newSize = new Size(0,0);
//                this._renderedGeometry = Geometry.Empty;
//            } 
//
//            return newSize; 
			
        }, 

        /// <summary> 
        /// Compute the rendered geometry and the stretching transform.
        /// </summary>
//        protected override Size 
		ArrangeOverride:function()
        { 
//            var newSize;
// 
//            var mode = this.Stretch; 
//
//            if (mode == Stretch.None) 
//            {
//                StretchMatrixField.ClearValue(this);
//
//                ResetRenderedGeometry(); 
//
//                newSize = finalSize; 
//            } 
//            else
//            { 
//                newSize = this.GetStretchedRenderSizeAndSetStretchMatrix(
//                    mode, this.GetStrokeThickness(), finalSize, this.GetDefiningGeometryBounds());
//            }
// 
//            if (SizeIsInvalidOrEmpty(newSize))
//            { 
//                // We've encountered a numerical error. Don't draw anything. 
//                newSize = new Size(0,0);
//                this._renderedGeometry = Geometry.Empty; 
//            }
//
//            return newSize;
        }, 

        /// <summary> 
        /// Render callback. 
        /// </summary>
//        protected override void 
		OnRender:function(/*DrawingContext*/ drawingContext) 
        {
			this.EnsureRenderedGeometry();

            if (this._renderedGeometry != Geometry.Empty) 
            {
                drawingContext.DrawGeometry(Fill, GetPen(), this._renderedGeometry); 
            } 
        },

//        internal double 
		GetStrokeThickness:function() 
        { 
            if (this.IsPenNoOp)
            { 
                return 0;
            }
            else
            { 
                return Math.abs(StrokeThickness);
            } 
 
        },
 
//        internal Pen 
		GetPen:function()
        {
            if (this.IsPenNoOp)
            { 
                return null;
            } 
 
            if (this._pen == null)
            { 
                var thickness = 0.0;
                var strokeThickness = this.StrokeThickness;

                thickness = Math.abs(strokeThickness); 

                // This pen is internal to the system and 
                // must not participate in freezable treeness 
                this._pen = new Pen();
                this._pen.CanBeInheritanceContext = false; 

                this._pen.Thickness = thickness;
                this._pen.Brush = this.Stroke;
                this._pen.StartLineCap = this.StrokeStartLineCap; 
                this._pen.EndLineCap = this.StrokeEndLineCap;
                this._pen.DashCap = this.StrokeDashCap; 
                this._pen.LineJoin = this.StrokeLineJoin; 
                this._pen.MiterLimit = this.StrokeMiterLimit;
 
                // StrokeDashArray is usually going to be its default value and GetValue
                // on a mutable default has a per-instance cost associated with it so we'll
                // try to avoid caching the default value
                /*DoubleCollection*/var strokeDashArray = null; 
                var hasModifiers;
                var hasModifiersOut = {"hasModifiers" : hasModifiers};
                if (this.GetValueSource(StrokeDashArrayProperty, null, /*out hasModifiers*/hasModifiersOut) 
                    != BaseValueSourceInternal.Default || hasModifiersOut.hasModifiers/*hasModifiers*/) 
                {
                    strokeDashArray = this.StrokeDashArray; 
                }

                // Avoid creating the DashStyle if we can
                var strokeDashOffset = this.StrokeDashOffset; 
                if (strokeDashArray != null || strokeDashOffset != 0.0)
                { 
                	this._pen.DashStyle = new DashStyle(strokeDashArray, strokeDashOffset); 
                }
            } 

            return this._pen;
        },

//        internal virtual void 
		CacheDefiningGeometry:function() {}, 

//        internal Size 
		GetStretchedRenderSize:function(/*Stretch*/ mode, /*double*/ strokeThickness, /*Size*/ availableSize, /*Rect*/ geometryBounds) 
        { 
            var xScale, yScale, dX, dY;
            var renderSize; 

            this.GetStretchMetrics(mode, strokeThickness, availableSize, geometryBounds,
                /*out xScale*/xScaleOut, /*out yScale*/yScaleOut, /*out dX*/dXOut, /*out dY*/dYOut, /*out renderSize*/renderSizeOut);
 
            return renderSize;
        }, 
 
//        internal Size 
        GetStretchedRenderSizeAndSetStretchMatrix:function(/*Stretch*/ mode, /*double*/ strokeThickness, /*Size*/ availableSize, /*Rect*/ geometryBounds)
        { 
            var xScale, yScale, dX, dY;
            var renderSize;

            GetStretchMetrics(mode, strokeThickness, availableSize, geometryBounds, 
            		/*out xScale*/xScaleOut, /*out yScale*/yScaleOut, /*out dX*/dXOut, /*out dY*/dYOut, /*out renderSize*/renderSizeOut);
 
            // Construct the matrix 
            var stretchMatrix = Matrix.Identity;
            stretchMatrix.ScaleAt(xScale, yScale, geometryBounds.Location.X, geometryBounds.Location.Y); 
            stretchMatrix.Translate(dX, dY);
            StretchMatrixField.SetValue(this, new BoxedMatrix(stretchMatrix));

            ResetRenderedGeometry(); 

            return renderSize; 
        }, 

//        internal void 
        ResetRenderedGeometry:function() 
        {
            // reset rendered geometry
            this._renderedGeometry = null;
        }, 

//        internal void 
        GetStretchMetrics:function(/*Stretch*/ mode, /*double*/ strokeThickness, 
        		/*Size*/ availableSize, /*Rect*/ geometryBounds, 
                                             /*out double xScale*/xScaleOut, 
                                             /*out double yScale*/yScaleOut,
                                             /*out double dX*/dXOut, 
                                             /*out double dY*/dYOut, 
                                             /*out Size stretchedSize*/stretchedSizeOut) 
        {
            if (!geometryBounds.IsEmpty) 
            {
                var margin = strokeThickness / 2;
                var hasThinDimension = false;
 
                // Initialization for mode == Fill
                xScale = Math.Max(availableSize.Width - strokeThickness, 0); 
                yScale = Math.Max(availableSize.Height - strokeThickness, 0); 
                dX = margin - geometryBounds.Left;
                dY = margin - geometryBounds.Top; 

                // Compute the scale factors from the geometry to the size.
                // The scale factors are ratios, and they have already been initialize to the numerators.
                // To prevent fp overflow, we need to make sure that numerator / denomiator < limit; 
                // To do that without actually deviding, we check that denominator > numerator / limit.
                // We take 1/epsilon as the limit, so the check is denominator > numerator * epsilon 
 
                // See Dev10 bug #453150.
                // If the scale is infinite in both dimensions, return the natural size. 
                // If it's infinite in only one dimension, for non-fill stretch modes we constrain the size based
                // on the unconstrained dimension.
                // If our shape is "thin", i.e. a horizontal or vertical line, we can ignore non-fill stretches.
                if (geometryBounds.Width > xScale * Double.Epsilon) 
                {
                    xScale /= geometryBounds.Width; 
                } 
                else
                { 
                    xScale = 1;
                    // We can ignore uniform and uniform-to-fill stretches if we have a vertical line.
                    if (geometryBounds.Width == 0)
                    { 
                        hasThinDimension = true;
                    } 
                } 

                if (geometryBounds.Height > yScale * Double.Epsilon) 
                {
                    yScale /= geometryBounds.Height;
                }
                else 
                {
                    yScale = 1; 
                    // We can ignore uniform and uniform-to-fill stretches if we have a horizontal line. 
                    if (geometryBounds.Height == 0)
                    { 
                        hasThinDimension = true;
                    }
                }
 
                // Because this case was handled by the caller
//                Debug.Assert(mode != Stretch.None); 
 
                // We are initialized for Fill, but for the other modes
                // If one of our dimensions is thin, uniform stretches are 
                // meaningless, so we treat the stretch as fill.
                if (mode != Stretch.Fill && !hasThinDimension)
                {
                    if (mode == Stretch.Uniform) 
                    {
                        if (yScale > xScale) 
                        { 
                            // Resize to fit the size's width
                            yScale = xScale; 
                        }
                        else // if xScale >= yScale
                        {
                            // Resize to fit the size's height 
                            xScale = yScale;
                        } 
                    } 
                    else
                    { 
//                        Debug.Assert(mode == Stretch.UniformToFill);

                        if (xScale > yScale)
                        { 
                            // Resize to fill the size vertically, spilling out horizontally
                            yScale = xScale; 
                        } 
                        else // if yScale >= xScale
                        { 
                            // Resize to fill the size horizontally, spilling out vertically
                            xScale = yScale;
                        }
                    } 
                }
 
                stretchedSize = new Size(geometryBounds.Width * xScale + strokeThickness, geometryBounds.Height * yScale + strokeThickness); 
            }
            else 
            {
                xScale = yScale = 1;
                dX = dY = 0;
                stretchedSize = new Size(0,0); 
            }
        }, 
 
        /// <summary>
        /// Get the natural size of the geometry that defines this shape 
        /// </summary>
//        internal virtual Size 
        GetNaturalSize:function()
        {
            var geometry = this.DefiningGeometry; 

//            Debug.Assert(geometry != null); 
 
            //
            // For the purposes of computing layout size, don't consider dashing. This will give us 
            // slightly different bounds, but the computation will be faster and more stable.
            //
            // NOTE: If GetPen() is ever made public, we will need to change this logic so the user
            // isn't affected by our surreptitious change of DashStyle. 
            //
            var pen = GetPen(); 
            /*DashStyle*/var style = null; 

            if (pen != null) 
            {
                style = pen.DashStyle;

                if (style != null) 
                {
                    pen.DashStyle = null; 
                } 
            }
 
            var bounds = geometry.GetRenderBounds(pen);

            if (style != null)
            { 
                pen.DashStyle = style;
            } 
 
            return new Size(Math.max(bounds.Right, 0),
                Math.max(bounds.Bottom, 0)); 
        },

        /// <summary>
        /// Get the bonds of the geometry that defines this shape 
        /// </summary>
//        internal virtual Rect 
        GetDefiningGeometryBounds:function() 
        { 
            var geometry = this.DefiningGeometry;
 
//            Debug.Assert(geometry != null);

            return geometry.Bounds;
        }, 

//        internal void 
        EnsureRenderedGeometry:function() 
        { 
            if (this._renderedGeometry == null)
            { 
            	this._renderedGeometry = DefiningGeometry;

//                Debug.Assert(_renderedGeometry != null);
 
                if (this.Stretch != Stretch.None)
                { 
                    /*Geometry*/var currentValue = this._renderedGeometry.CloneCurrentValue(); 
                    if (Object.ReferenceEquals(this._renderedGeometry, currentValue))
                    { 
                    	this._renderedGeometry = currentValue.Clone();
                    }
                    else
                    { 
                    	this._renderedGeometry = currentValue;
                    } 
 
                    var renderedTransform  = _renderedGeometry.Transform;
 
                    var boxedStretchMatrix = StretchMatrixField.GetValue(this);
                    var stretchMatrix = (boxedStretchMatrix == null) ? Matrix.Identity : boxedStretchMatrix.Value;
                    if (renderedTransform == null || renderedTransform.IsIdentity)
                    { 
                        _renderedGeometry.Transform = new MatrixTransform(stretchMatrix);
                    } 
                    else 
                    {
                        _renderedGeometry.Transform = new MatrixTransform(renderedTransform.Value * stretchMatrix); 
                    }
                }
            }
        } 
	});
	
	Object.defineProperties(Shape.prototype,{

        /// <summary>
        /// The Stretch property determines how the shape may be stretched to accommodate shape size 
        /// </summary>
//        public Stretch 
		Stretch: 
        { 
            get:function() { return this.GetValue(Shape.StretchProperty); },
            set:function(value) { this.SetValue(Shape.StretchProperty, value); } 
        },

        /// <summary>
        /// The RenderedGeometry property returns the final rendered geometry 
        /// </summary>
//        public virtual Geometry 
		RenderedGeometry: 
        { 
            get:function()
            { 
                EnsureRenderedGeometry();

                var geometry = _renderedGeometry.CloneCurrentValue();
                if (geometry == null ||  geometry == Geometry.Empty) 
                {
                    return Geometry.Empty; 
                } 

                // We need to return a frozen copy 
                if (Object.ReferenceEquals(geometry, _renderedGeometry))
                {
                    // geometry is a reference to _renderedGeometry, so we need to copy
                    geometry = geometry.Clone(); 
                    geometry.Freeze();
                } 
 
                return geometry;
            } 
        },

        /// <summary>
        /// Return the transformation applied to the geometry before rendering 
        /// </summary>
//        public virtual Transform 
		GeometryTransform: 
        { 
            get:function()
            { 
                var stretchMatrix = StretchMatrixField.GetValue(this);

                if (stretchMatrix == null)
                { 
                    return Transform.Identity;
                } 
                else 
                {
                    return new MatrixTransform(stretchMatrix.Value); 
                }
            }
        },
        /// <summary>
        /// Fill property 
        /// </summary>
//        public Brush 
		Fill:
        {
            get:function() { return this.GetValue(Shape.FillProperty); },
            set:function(value) { this.SetValue(Shape.FillProperty, value); }
        }, 

        /// <summary> 
        /// Stroke property 
        /// </summary>
//        public Brush 
		Stroke: 
        {
            get:function() { return this.GetValue(Shape.StrokeProperty); },
            set:function(value) { this.SetValue(Shape.StrokeProperty, value); }
        }, 

        /// <summary>
        /// StrokeThickness property
        /// </summary> 
//        public double 
		StrokeThickness: 
        { 
            get:function() { return this.GetValue(Shape.StrokeThicknessProperty); },
            set:function(value) { this.SetValue(Shape.StrokeThicknessProperty, value); } 
        },
        /// <summary>
        /// StrokeStartLineCap property 
        /// </summary>
//        public PenLineCap 
		StrokeStartLineCap:
        {
            get:function() { return this.GetValue(Shape.StrokeStartLineCapProperty); },
            set:function(value) { this.SetValue(Shape.StrokeStartLineCapProperty, value); }
        }, 
        /// <summary>
        /// StrokeEndLineCap property 
        /// </summary> 
//        public PenLineCap 
		StrokeEndLineCap:
        { 
            get:function() { return this.GetValue(Shape.StrokeEndLineCapProperty); },
            set:function(value) { this.SetValue(Shape.StrokeEndLineCapProperty, value); }
        },
 

        /// <summary>
        /// StrokeDashCap property
        /// </summary> 
//        public PenLineCap 
		StrokeDashCap:
        { 
            get:function() { return this.GetValue(Shape.StrokeDashCapProperty); },
            set:function(value) { this.SetValue(Shape.StrokeDashCapProperty, value); }
        }, 
        /// <summary> 
        /// StrokeLineJoin property
        /// </summary> 
//        public PenLineJoin 
		StrokeLineJoin:
        {
            get:function() { return this.GetValue(Shape.StrokeLineJoinProperty); },
            set:function(value) { this.SetValue(Shape.StrokeLineJoinProperty, value); } 
        },
 

        /// <summary>
        /// StrokeMiterLimit property
        /// </summary> 
//        public double 
		StrokeMiterLimit:
        { 
            get:function() { return this.GetValue(Shape.StrokeMiterLimitProperty); },
            set:function(value) { this.SetValue(Shape.StrokeMiterLimitProperty, value); }
        }, 


        /// <summary> 
        /// StrokeDashOffset property 
        /// </summary>
//        public double 
		StrokeDashOffset: 
        {
            get:function() { return this.GetValue(Shape.StrokeDashOffsetProperty); },
            set:function(value) { this.SetValue(Shape.StrokeDashOffsetProperty, value); }
        }, 

 
        /// <summary>
        /// StrokeDashArray property
        /// </summary>
//        public DoubleCollection 
		StrokeDashArray: 
        {
            get:function() { return this.GetValue(Shape.StrokeDashArrayProperty); },
            set:function(value) { this.SetValue(Shape.StrokeDashArrayProperty, value); } 
        },
        /// <summary>
        /// Get the geometry that defines this shape 
        /// </summary> 
//        protected abstract Geometry 
		DefiningGeometry:
        { 
            get:function(){}
        },

//        internal bool 
        IsPenNoOp: 
        { 
            get:function()
            { 
                var strokeThickness = this.StrokeThickness;
                return (Stroke == null) || DoubleUtil.IsNaN(strokeThickness) || DoubleUtil.IsZero(strokeThickness);
            }
        },

  
	});
	
	Object.defineProperties(Shape,{
		/// <summary>
        /// DependencyProperty for the Stretch property.
        /// </summary> 
//        public static readonly DependencyProperty 
		StretchProperty:
        {
        	get:function(){
        		if(Shape._StretchProperty === undefined){
        			Shape._StretchProperty  = DependencyProperty.Register( 
        	                "Stretch",                  // Property name 
        	                Number.Type,            // Property type
        	                Shape.Type,              // Property owner 
        	            new FrameworkPropertyMetadata(Stretch.None, FrameworkPropertyMetadataOptions.AffectsMeasure 
        	            		| FrameworkPropertyMetadataOptions.AffectsArrange));
        		}
        		
        		return Shape._StretchProperty;
        	}
        },
           

          /// <summary>
        /// Fill property 
        /// </summary>
//        public static readonly DependencyProperty 
		FillProperty:
        {
        	get:function(){
        		if(Shape._FillProperty === undefined){
        			Shape._FillProperty = 
                        DependencyProperty.Register(
                                "Fill", 
                                Brush.Type,
                                Shape.Type,
                                /*new FrameworkPropertyMetadata(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsRender |
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender)*/
                                FrameworkPropertyMetadata.Build2(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsRender |
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender));
        		}
        		
        		return Shape._FillProperty;
        	}
        },  
 
 
        /// <summary>
        /// Stroke property 
        /// </summary>
//        public static readonly DependencyProperty 
		StrokeProperty:
        {
        	get:function(){
        		if(Shape._StrokeProperty === undefined){
        			Shape._StrokeProperty =
                        DependencyProperty.Register( 
                                "Stroke",
                                Brush.Type, 
                                Shape.Type, 
                                /*new FrameworkPropertyMetadata(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure |
                                        FrameworkPropertyMetadataOptions.AffectsRender |
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender,
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        null, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure |
                                        FrameworkPropertyMetadataOptions.AffectsRender |
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender,
                                        new PropertyChangedCallback(null, OnPenChanged))); 
        		}
        		
        		return Shape._StrokeProperty;
        	}
        }, 

        /// <summary> 
        /// StrokeThickness property 
        /// </summary>
//        public static readonly DependencyProperty 
		StrokeThicknessProperty:
        {
        	get:function(){
        		if(Shape._StrokeThicknessProperty === undefined){
        			Shape._StrokeThicknessProperty =
                        DependencyProperty.Register(
                                "StrokeThickness",
                                Number.Type, 
                                Shape.Type,
                                /*new FrameworkPropertyMetadata( 
                                        1.0, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        1.0, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPenChanged))); 
        		}
        		
        		return Shape._StrokeThicknessProperty;
        	}
        }, 

          /// <summary>
        /// StrokeStartLineCap property 
        /// </summary>
//        public static readonly DependencyProperty 
		StrokeStartLineCapProperty:
        {
        	get:function(){
        		if(Shape._StrokeStartLineCapProperty === undefined){
        			Shape._StrokeStartLineCapProperty = 
                        DependencyProperty.Register( 
                                "StrokeStartLineCap",
                                Number.Type, 
                                Shape.Type,
                                /*new FrameworkPropertyMetadata(
                                        PenLineCap.Flat,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        PenLineCap.Flat,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPenChanged)),
                                new ValidateValueCallback(Shape, System.Windows.Media.ValidateEnums.IsPenLineCapValid)); 
        		}
        		
        		return Shape._StrokeStartLineCapProperty;
        	}
        },  
 
        /// <summary> 
        /// StrokeEndLineCap property
        /// </summary>
//        public static readonly DependencyProperty 
		StrokeEndLineCapProperty:
        {
        	get:function(){
        		if(Shape._StrokeEndLineCapProperty === undefined){
        			Shape._StrokeEndLineCapProperty =
                        DependencyProperty.Register( 
                                "StrokeEndLineCap",
                                Number.Type, 
                                Shape.Type, 
                                /*new FrameworkPropertyMetadata(
                                        PenLineCap.Flat, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        PenLineCap.Flat, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPenChanged)),
                                new ValidateValueCallback(null, System.Windows.Media.ValidateEnums.IsPenLineCapValid));
        		}
        		
        		return Shape._StrokeEndLineCapProperty;
        	}
        }, 
        /// <summary> 
        /// StrokeDashCap property 
        /// </summary>
//        public static readonly DependencyProperty 
		StrokeDashCapProperty:
        {
        	get:function(){
        		if(Shape._StrokeDashCapProperty === undefined){
        			Shape._StrokeDashCapProperty = 
                        DependencyProperty.Register(
                                "StrokeDashCap",
                                Number.Type,
                                Shape.Type, 
                                /*new FrameworkPropertyMetadata(
                                        PenLineCap.Flat, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        PenLineCap.Flat, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPenChanged)),
                                new ValidateValueCallback(null, System.Windows.Media.ValidateEnums.IsPenLineCapValid));
        		}
        		
        		return Shape._StrokeDashCapProperty;
        	}
        },  

 
        /// <summary>
        /// StrokeLineJoin property
        /// </summary> 
//        public static readonly DependencyProperty
		StrokeLineJoinProperty:
        {
        	get:function(){
        		if(Shape._StrokeLineJoinProperty === undefined){
        			Shape._StrokeLineJoinProperty =
                        DependencyProperty.Register( 
                                "StrokeLineJoin", 
                                Number.Type,
                                Shape.Type, 
                                /*new FrameworkPropertyMetadata(
                                        PenLineJoin.Miter,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        PenLineJoin.Miter,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPenChanged)), 
                                new ValidateValueCallback(null, System.Windows.Media.ValidateEnums.IsPenLineJoinValid));
        		}
        		
        		return Shape._StrokeLineJoinProperty;
        	}
        },
  
        /// <summary> 
        /// StrokeMiterLimit property
        /// </summary> 
//        public static readonly DependencyProperty
		StrokeMiterLimitProperty:
        {
        	get:function(){
        		if(Shape._StrokeMiterLimitProperty === undefined){
        			Shape._StrokeMiterLimitProperty =
                        DependencyProperty.Register(
                                "StrokeMiterLimit",
                                Number.Type, 
                                Shape.Type,
                                /*new FrameworkPropertyMetadata( 
                                        10.0, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        10.0, 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPenChanged))); 
        		}
        		
        		return Shape._StrokeMiterLimitProperty;
        	}
        },

        /// <summary>
        /// StrokeDashOffset property
        /// </summary> 
//        public static readonly DependencyProperty 
		StrokeDashOffsetProperty:
        {
        	get:function(){
        		if(Shape._StrokeDashOffsetProperty === undefined){
        			Shape._StrokeDashOffsetProperty =
                        DependencyProperty.Register( 
                                "StrokeDashOffset", 
                                Number.Type,
                                Shape.Type, 
                                /*new FrameworkPropertyMetadata(
                                        0.0,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        0.0,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender,
                                        new PropertyChangedCallback(null, OnPenChanged))); 
        		}
        		
        		return Shape._StrokeDashOffsetProperty;
        	}
        },

          /// <summary> 
        /// StrokeDashArray property 
        /// </summary>
//        public static readonly DependencyProperty 
		StrokeDashArrayProperty:
        {
        	get:function(){
        		if(Shape._StrokeDashArrayProperty === undefined){
        			Shape._StrokeDashArrayProperty = 
                        DependencyProperty.Register(
                                "StrokeDashArray",
                                DoubleCollection.Type,
                                Shape.Type, 
                                /*new FrameworkPropertyMetadata(
                                        new FreezableDefaultValueFactory(DoubleCollection.Empty), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(Shape, OnPenChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB(
                                        new FreezableDefaultValueFactory(DoubleCollection.Empty), 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure 
                                        | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnPenChanged)));
        		}
        		
        		return Shape._StrokeDashArrayProperty;
        	}
        },
        
//        private static UncommonField<BoxedMatrix> 
        StretchMatrixField:
        {
        	get:function(){
        		if(Shape._StretchMatrixField === undefined){
        			Shape._StretchMatrixField = new UncommonField/*<BoxedMatrix>*/(null);
        		}
        		
        		return Shape._StretchMatrixField;
        	}
        }
 	  
	});
	

//    private static void 
	function OnPenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        // Called when any of the Stroke properties is invalidated. 
        // That means that the cached pen should be recalculated.
        d._pen = null; 
    }

    // Double verification helpers.  Property system will verify type for us; we only need to verify the value.
//    internal static bool 
	Shape.IsDoubleFiniteNonNegative = function(/*object*/ o) 
    { 
        return !(Number.IsInfinity(o) || Number.IsNaN(o) || o < 0.0); 
    };
//    internal static bool 
    Shape.IsDoubleFinite = function(/*object*/ o)
    {
        return !(Number.IsInfinity(o) || Number.IsNaN(o));
    } ;
//    internal static bool 
    Shape.IsDoubleFiniteOrNaN = function(/*object*/ o) 
    {
        return !(Number.IsInfinity(o));
    };

    Shape.SVG_NS = 'http://www.w3.org/2000/svg';
	
	Shape.Type = new Type("Shape", Shape, [FrameworkElement.Type]);
	return Shape;
});

