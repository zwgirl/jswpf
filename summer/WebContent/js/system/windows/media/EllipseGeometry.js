/**
 * EllipseGeometry
 */

define(["dojo/_base/declare", "system/Type", "media/Geometry"], 
		function(declare, Type, Geometry){
//    internal const double 
	var c_RadiusX = 0.0;
//    internal const double
	var c_RadiusY = 0.0;
//    internal static Point 
	var s_Center = new Point(); 
	
    // Approximating a 1/4 circle with a Bezier curve                _
//    internal const double 
	var c_arcAsBezier = 0.5522847498307933984; // =( \/2 - 1)*4/3 

//    private const UInt32 
	var c_segmentCount = 4; 
//    private const UInt32 
	var c_pointCount = 13; 

    
	var EllipseGeometry = declare("EllipseGeometry", Geometry,{
		constructor:function(){
			if(arguments.length == 1){
				var rect = arguments[0];
				if (rect.IsEmpty)
	            { 
	                throw new System.ArgumentException(SR.Get(SRID.Rect_Empty, "rect"));
	            } 
	 
	            this.RadiusX = (rect.Right - rect.X) * (1.0 / 2.0);
	            this.RadiusY = (rect.Bottom - rect.Y) * (1.0 / 2.0); 
	            this.Center = new Point(rect.X + RadiusX, rect.Y + RadiusY);
			}else if(arguments.length == 3){
				this.Center = arguments[0];
				this.RadiusX = arguments[1]; 
				this.RadiusY = arguments[2];
			}else if(arguments.length == 4){
				this.Center = arguments[0];
				this.RadiusX = arguments[1]; 
				this.RadiusY = arguments[2];
				this.Transform = arguments[3];
			}
		},
		
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new EllipseGeometry 
		Clone:function()
        {
            return (EllipseGeometry)base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new EllipseGeometry 
        CloneCurrentValue:function()
        {
            return (EllipseGeometry)base.CloneCurrentValue();
        },
        
//        private byte[] 
        GetTypeList:function() { return s_roundedPathTypes; }, 
//        private uint 
        GetPointCount:function() { return c_pointCount; }, 
//        private uint 
        GetSegmentCount:function() { return c_segmentCount; }
	});
	
	Object.defineProperties(EllipseGeometry.prototype,{
		/// <summary> 
        ///     RadiusX - double.  Default value is 0.0. 
        /// </summary>
//        public double 
		RadiusX: 
        {
            get:function()
            {
                return this.GetValue(EllipseGeometry.RadiusXProperty); 
            },
            set:function(value) 
            { 
            	this.SetValueInternal(EllipseGeometry.RadiusXProperty, value);
            } 
        },

        /// <summary>
        ///     RadiusY - double.  Default value is 0.0. 
        /// </summary>
//        public double 
        RadiusY: 
        { 
            get:function()
            { 
                return this.GetValue(EllipseGeometry.RadiusYProperty);
            },
            set:function(value)
            { 
            	this.SetValueInternal(EllipseGeometry.RadiusYProperty, value);
            } 
        }, 

        /// <summary> 
        ///     Center - Point.  Default value is new Point().
        /// </summary>
//        public Point 
        Center:
        { 
            get:function()
            { 
                return this.GetValue(EllipseGeometry.CenterProperty); 
            },
            set:function(value)
            {
            	this.SetValueInternal(EllipseGeometry.CenterProperty, value);
            }
        },
      /// <summary> 
        /// Gets the bounds of this Geometry as an axis-aligned bounding box
        /// </summary> 
//        public override Rect 
        Bounds: 
        {
            get:function() 
            {
                this.ReadPreamble();

                var boundsRect; 

                var transform = Transform; 
 
                if (transform == null || transform.IsIdentity)
                { 
                    var currentCenter = Center;
                    var currentRadiusX = RadiusX;
                    var currentRadiusY = RadiusY;
 
                    boundsRect = new Rect(
                        currentCenter.X - Math.Abs(currentRadiusX), 
                        currentCenter.Y - Math.Abs(currentRadiusY), 
                        2.0 * Math.Abs(currentRadiusX),
                        2.0 * Math.Abs(currentRadiusY)); 
                }
                else
                {
                    // 
                    //
                	var geometryMatrix;

                    Transform.GetTransformValue(transform, /*out geometryMatrix*/geometryMatrixOut); 

                    boundsRect = EllipseGeometry.GetBoundsHelper( 
                        null /* no pen */, 
                        Matrix.Identity,
                        Center, 
                        RadiusX,
                        RadiusY,
                        geometryMatrix,
                        StandardFlatteningTolerance, 
                        ToleranceType.Absolute);
                } 
 
                return boundsRect;
            } 
        },
        
      /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary> 
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function()
        {
            return new EllipseGeometry(); 
        },

        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying
        /// the supplied transform (if non-null). 
        /// </summary> 
//        internal override Rect 
        GetBoundsInternal:function(/*Pen*/ pen, /*Matrix*/ matrix, /*double*/ tolerance, /*ToleranceType*/ type)
        { 
            Matrix geometryMatrix;

            Transform.GetTransformValue(Transform, /*out geometryMatrix*/geometryMatrix);
 
            return EllipseGeometry.GetBoundsHelper(
                pen, 
                matrix, 
                Center,
                RadiusX, 
                RadiusY,
                geometryMatrix,
                tolerance,
                type); 
        },

        /// <SecurityNote> 
        /// Critical - contains unsafe block and calls critical method Geometry.ContainsInternal.
        /// TreatAsSafe - as this doesn't expose anything sensitive.
        /// </SecurityNote>
//        internal override bool 
        ContainsInternal:function(/*Pen*/ pen, /*Point*/ hitPoint, /*double*/ tolerance, /*ToleranceType*/ type)
        { 
//            unsafe 
//            {
//                Point *pPoints = stackalloc Point[(int)GetPointCount()]; 
//                EllipseGeometry.GetPointList(pPoints, GetPointCount(), Center, RadiusX, RadiusY);
//
//                fixed (byte* pTypes = GetTypeList())
//                { 
//                    return ContainsInternal(
//                        pen, 
//                        hitPoint, 
//                        tolerance,
//                        type, 
//                        pPoints,
//                        GetPointCount(),
//                        pTypes,
//                        GetSegmentCount()); 
//                }
//            } 
        }, 

        /// <summary>
        /// Returns true if this geometry is empty
        /// </summary> 
//        public override bool 
        IsEmpty:function()
        { 
            return false; 
        },
 
        /// <summary>
        /// Returns true if this geometry may have curved segments
        /// </summary>
//        public override bool 
        MayHaveCurves:function() 
        {
            return true; 
        }, 

        /// <summary> 
        /// Gets the area of this geometry
        /// </summary>
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - realtive or absolute</param> 
//        public override double 
        GetArea:function(/*double*/ tolerance, /*ToleranceType*/ type)
        { 
            ReadPreamble(); 

            double area = Math.Abs(RadiusX * RadiusY) * Math.PI; 

            // Adjust to internal transformation
            Transform transform = Transform;
            if (transform != null && !transform.IsIdentity) 
            {
                area *= Math.Abs(transform.Value.Determinant); 
            } 

            return area; 
        },
 
//        internal override PathFigureCollection 
        GetTransformedFigureCollection:function(/*Transform*/ transform)
        { 
            /*Point []*/var points = GetPointList(); 

            // Get the combined transform argument with the internal transform 
            /*Matrix*/var matrix = GetCombinedMatrix(transform);
            if (!matrix.IsIdentity)
            {
                for (var i=0; i<points.Length; i++) 
                {
                    points[i] *= matrix; 
                } 
            }
 
            /*PathFigureCollection*/var figureCollection = new PathFigureCollection();
            figureCollection.Add(
                new PathFigure(
                    points[0], 
//                    new PathSegment[]{
                    [
                    new BezierSegment(points[1], points[2], points[3], true, true), 
                    new BezierSegment(points[4], points[5], points[6], true, true), 
                    new BezierSegment(points[7], points[8], points[9], true, true),
                    new BezierSegment(points[10], points[11], points[12], true, true)], 
                    true
                    )
                );
 
            return figureCollection;
        }, 
 
        /// <summary>
        /// GetAsPathGeometry - return a PathGeometry version of this Geometry 
        /// </summary>
//        internal override PathGeometry 
        GetAsPathGeometry:function()
        {
            PathStreamGeometryContext ctx = new PathStreamGeometryContext(FillRule.EvenOdd, Transform); 
            PathGeometry.ParsePathGeometryData(GetPathGeometryData(), ctx);
 
            return ctx.GetPathGeometry(); 
        },
 
        /// <summary>
        /// GetPathGeometryData - returns a byte[] which contains this Geometry represented
        /// as a path geometry's serialized format.
        /// </summary> 
//        internal override PathGeometryData 
        GetPathGeometryData:function()
        { 
            if (IsObviouslyEmpty()) 
            {
                return Geometry.GetEmptyPathGeometryData(); 
            }

            /*PathGeometryData*/var data = new PathGeometryData();
            data.FillRule = FillRule.EvenOdd; 
            data.Matrix = CompositionResourceManager.TransformToMilMatrix3x2D(Transform);
 
            /*Point[]*/var points = GetPointList(); 

            /*ByteStreamGeometryContext*/var ctx = new ByteStreamGeometryContext(); 

            ctx.BeginFigure(points[0], true /* is filled */, true /* is closed */);

            // i == 0, 3, 6, 9 
            for (var i = 0; i < 12; i += 3)
            { 
                ctx.BezierTo(points[i + 1], points[i + 2], points[i + 3], true /* is stroked */, true /* is smooth join */); 
            }
 
            ctx.Close();
            data.SerializedData = ctx.GetData();

            return data; 
        },
 
        /// <summary> 
        /// </summary>
        /// <returns></returns> 
        /// <SecurityNote>
        /// Critical - Calls critical code
        /// TreatAsSafe - returning a EllipseGeometry's point list is considered safe
        /// </SecurityNote> 
//        private Point[] 
        GetPointList:function() 
        { 
            /*Point[]*/var points = [GetPointCount()]; new Point[GetPointCount()];
 
//            unsafe
//            {
//                fixed(Point *pPoints = points)
//                { 
//                    EllipseGeometry.GetPointList(pPoints, GetPointCount(), Center, RadiusX, RadiusY);
//                } 
//            } 

            return points; 
        }

  
	});
	
	Object.defineProperties(EllipseGeometry,{
		  
	});
	
//	private static void 
	function RadiusXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        EllipseGeometry target = ((EllipseGeometry) d);
        d.PropertyChanged(RadiusXProperty); 
    }
//    private static void 
	function RadiusYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        EllipseGeometry target = ((EllipseGeometry) d);
        d.PropertyChanged(RadiusYProperty);
    }
//    private static void 
	function CenterPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        EllipseGeometry target = ((EllipseGeometry) d); 
        d.PropertyChanged(CenterProperty); 
    }
	
    /// <SecurityNote> 
    /// Critical - it calls a critical method, Geometry.GetBoundsHelper and has an unsafe block
    /// TreatAsSafe - returning an EllipseGeometry's bounds is considered safe 
    /// </SecurityNote>
//    internal static Rect 
	GetBoundsHelper = function(/*Pen*/ pen, /*Matrix*/ worldMatrix, /*Point*/ center, /*double*/ radiusX, /*double*/ radiusY,
                                         /*Matrix*/ geometryMatrix, /*double*/ tolerance, /*ToleranceType*/ type) 
    {
        var rect; 

//        Debug.Assert(worldMatrix != null);
//        Debug.Assert(geometryMatrix != null); 

        if ( (pen == null || pen.DoesNotContainGaps) &&
            worldMatrix.IsIdentity && geometryMatrix.IsIdentity)
        { 
            var strokeThickness = 0.0;

            if (Pen.ContributesToBounds(pen)) 
            {
                strokeThickness = Math.Abs(pen.Thickness); 
            }

            rect = new Rect(
                center.X - Math.Abs(radiusX)-0.5*strokeThickness, 
                center.Y - Math.Abs(radiusY)-0.5*strokeThickness,
                2.0 * Math.Abs(radiusX)+strokeThickness, 
                2.0 * Math.Abs(radiusY)+strokeThickness); 
        }
        else 
        {
//            unsafe
//            {
//                Point * pPoints = stackalloc Point[(int)c_pointCount]; 
//                EllipseGeometry.GetPointList(pPoints, c_pointCount, center, radiusX, radiusY);
//
//                fixed (byte *pTypes = EllipseGeometry.s_roundedPathTypes) 
//                {
//                    rect = Geometry.GetBoundsHelper( 
//                        pen,
//                        &worldMatrix,
//                        pPoints,
//                        pTypes, 
//                        c_pointCount,
//                        c_segmentCount, 
//                        &geometryMatrix, 
//                        tolerance,
//                        type, 
//                        false); // skip hollows - meaningless here, this is never a hollow
//                }
//            }
        } 

        return rect; 
    } 
	
	/// <SecurityNote>
    /// Critical - Accepts pointer arguments 
    /// </SecurityNote>
//    private unsafe static void 
	function GetPointList(/*Point **/ points, /*uint*/ pointsCount, /*Point*/ center, /*double*/ radiusX, /*double*/ radiusY) 
    {
//        Invariant.Assert(pointsCount >= c_pointCount); 

        radiusX = Math.Abs(radiusX);
        radiusY = Math.Abs(radiusY);

        // Set the X coordinates
        double mid = radiusX * c_arcAsBezier; 

        points[0].X = points[1].X = points[11].X = points[12].X = center.X + radiusX;
        points[2].X = points[10].X = center.X + mid; 
        points[3].X = points[9].X = center.X;
        points[4].X = points[8].X = center.X - mid;
        points[5].X = points[6].X = points[7].X = center.X - radiusX;

        // Set the Y coordinates
        mid = radiusY * c_arcAsBezier; 

        points[2].Y = points[3].Y = points[4].Y = center.Y + radiusY;
        points[1].Y = points[5].Y = center.Y + mid; 
        points[0].Y = points[6].Y = points[12].Y = center.Y;
        points[7].Y = points[11].Y = center.Y - mid;
        points[8].Y = points[9].Y = points[10].Y = center.Y - radiusY;
    }
	
//    private const byte 
	var c_smoothBezier = MILCoreSegFlags.SegTypeBezier  | 
                                          MILCoreSegFlags.SegIsCurved    |
                                          MILCoreSegFlags.SegSmoothJoin;

//    private static readonly byte[] 
	var s_roundedPathTypes = [ 
        MILCoreSegFlags.SegTypeBezier |
        MILCoreSegFlags.SegIsCurved   | 
        MILCoreSegFlags.SegSmoothJoin | 
        MILCoreSegFlags.SegClosed,
        c_smoothBezier, 
        c_smoothBezier,
        c_smoothBezier
    ];
	
//	static EllipseGeometry() 
    function Initialize(){
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272)
        // 
        // Initializations 
        RadiusXProperty =
              RegisterProperty("RadiusX",
            		  Number.Type, 
                               EllipseGeometry.Type,
                               0.0, 
                               new PropertyChangedCallback(null, RadiusXPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null);
        RadiusYProperty =
              RegisterProperty("RadiusY",
            		  Number.Type, 
                               EllipseGeometry.Type,
                               0.0, 
                               new PropertyChangedCallback(null, RadiusYPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null);
        CenterProperty =
              RegisterProperty("Center",
            		  Point.Type, 
                               EllipseGeometry.Type,
                               new Point(), 
                               new PropertyChangedCallback(null, CenterPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null);
    }
	
	EllipseGeometry.Type = new Type("EllipseGeometry", EllipseGeometry, [Geometry.Type]);
	return EllipseGeometry;
});
