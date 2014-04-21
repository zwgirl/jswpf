/**
 * LineGeometry
 */

define(["dojo/_base/declare", "system/Type", "media/Geometry", "windows/Point"], 
		function(declare, Type, Geometry, Point){
	
//    private const UInt32 
	var c_segmentCount = 1;
//    private const UInt32 
	var c_pointCount = 2;
	
//    internal static Point 
	var s_StartPoint = new Point(); 
//    internal static Point 
	var s_EndPoint = new Point();


//    private static byte[] s_lineTypes = new byte[] { (byte)MILCoreSegFlags.SegTypeLine }; 
    
	var LineGeometry = declare("LineGeometry", Geometry,{
		constructor:function(){
			if(arguments.length == 2){
	            this.StartPoint = arguments[0];
	            this.EndPoint = arguments[1]; 
			}else if(arguments.length == 2){
	            this.StartPoint = arguments[0];
	            this.EndPoint = arguments[1]; 
	            this.Transform = arguments[2]; 
			}
		},

		 /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new LineGeometry 
		Clone:function()
        {
            return Geometry.prototype.Clone.call();
        },

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new LineGeometry 
        CloneCurrentValue:function()
        {
            return Geometry.prototype.CloneCurrentValue.call(this);
        },
 
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns> 
//        protected override Freezable 
        CreateInstanceCore:function() 
        {
            return new LineGeometry(); 
        },
        
        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying 
        /// the supplied transform (if non-null).
        /// </summary> 
//        internal override Rect 
        GetBoundsInternal:function(/*Pen*/ pen, /*Matrix*/ worldMatrix, /*double*/ tolerance, /*ToleranceType*/ type)
        {
            /*Matrix*/var geometryMatrix;

            Transform.GetTransformValue(Transform, /*out geometryMatrix*/geometryMatrixOut);

            return LineGeometry.GetBoundsHelper( 
                   pen,
                   worldMatrix, 
                   StartPoint,
                   EndPoint,
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
//                Point *pPoints = stackalloc Point[2]; 
//                pPoints[0] = StartPoint;
//                pPoints[1] = EndPoint; 
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
            return false; 
        },

        /// <summary>
        /// Gets the area of this geometry 
        /// </summary>
        /// <param name="tolerance">The computational error tolerance</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
//        public override double 
        GetArea:function(/*double*/ tolerance, /*ToleranceType*/ type)
        { 
            return 0.0;
        },

//        private byte[] 
        GetTypeList:function() { return s_lineTypes; },
        
//        private uint 
        GetPointCount:function() { return c_pointCount; },

//        private uint 
        GetSegmentCount:function() { return c_segmentCount; },

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

//        internal override PathFigureCollection 
        GetTransformedFigureCollection:function(/*Transform*/ transform)
        { 
            // This is lossy for consistency with other GetPathFigureCollection() implementations 
            // however this limitation doesn't otherwise need to exist for LineGeometry.

            /*Point*/var startPoint = StartPoint;
            /*Point*/var endPoint = EndPoint;

            // Apply internal transform 
            /*Transform*/var internalTransform = Transform;

            if (internalTransform != null && !internalTransform.IsIdentity) 
            {
                /*Matrix*/var matrix = internalTransform.Value; 

                startPoint *= matrix;
                endPoint *= matrix;
            } 

            // Apply external transform 
            if (transform != null && !transform.IsIdentity) 
            {
                Matrix matrix = transform.Value; 

                startPoint *= matrix;
                endPoint *= matrix;
            } 

            PathFigureCollection collection = new PathFigureCollection(); 
            collection.Add( 
                new PathFigure(
                startPoint, 
                /*new PathSegment[]{*/[new LineSegment(endPoint, true)],
                false // ==> not closed
                )
            ); 

            return collection; 
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

            PathGeometryData data = new PathGeometryData();
            data.FillRule = FillRule.EvenOdd;
            data.Matrix = CompositionResourceManager.TransformToMilMatrix3x2D(Transform); 

            ByteStreamGeometryContext ctx = new ByteStreamGeometryContext(); 

            ctx.BeginFigure(StartPoint, true /* is filled */, false /* is closed */);
            ctx.LineTo(EndPoint, true /* is stroked */, false /* is smooth join */); 

            ctx.Close();
            data.SerializedData = ctx.GetData();

            return data;
        } 
	});
	
	Object.defineProperties(LineGeometry.prototype,{
		/// <summary>
        ///     StartPoint - Point.  Default value is new Point(). 
        /// </summary>
//        public Point 
		StartPoint:
        {
            get:function()
            {
                return this.GetValue(LineGeometry.StartPointProperty); 
            },
            set:function(value)
            { 
            	this.SetValueInternal(LineGeometry.StartPointProperty, value);
            }
        },
 
        /// <summary>
        ///     EndPoint - Point.  Default value is new Point(). 
        /// </summary> 
//        public Point 
        EndPoint:
        { 
            get:function()
            {
                return this.GetValue(LineGeometry.EndPointProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(LineGeometry.EndPointProperty, value); 
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

                /*Rect*/var rect = new Rect(this.StartPoint, this.EndPoint);

                /*Transform*/var transform = this.Transform; 

                if (transform != null && !transform.IsIdentity) 
                { 
                    transform.TransformRect(/*ref*/ rect);
                } 

                return rect;
            }
        } 
	});
	
	Object.defineProperties(LineGeometry,{
		  
	});
	
	 /// <SecurityNote>
    /// Critical - it calls a critical method, Geometry.GetBoundsHelper and has an unsafe block 
    /// TreatAsSafe - returning a LineGeometry's bounds is considered safe
    /// </SecurityNote>
//    internal static Rect 
	LineGeometry.GetBoundsHelper = function(/*Pen*/ pen, /*Matrix*/ worldMatrix, /*Point*/ pt1, /*Point*/ pt2, 
                                         /*Matrix*/ geometryMatrix, /*double*/ tolerance, /*ToleranceType*/ type)
    { 
//        Debug.Assert(worldMatrix != null); 
//        Debug.Assert(geometryMatrix != null);

        if (pen == null  &&  worldMatrix.IsIdentity && geometryMatrix.IsIdentity)
        {
            return new Rect(pt1, pt2);
        } 
        else
        { 
//            unsafe 
//            {
//                Point* pPoints = stackalloc Point[2]; 
//                pPoints[0] = pt1;
//                pPoints[1] = pt2;
//
//                fixed (byte *pTypes = LineGeometry.s_lineTypes) 
//                {
//                    return Geometry.GetBoundsHelper( 
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
    };
	
//	private static void 
	function StartPointPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        LineGeometry target = ((LineGeometry) d);
        d.PropertyChanged(StartPointProperty); 
    }
    
//    private static void
    function EndPointPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        LineGeometry target = ((LineGeometry) d);
        d.PropertyChanged(EndPointProperty);
    }
	
//  static LineGeometry() 
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272)
        //


        // Initializations 
        Type typeofThis = typeof(LineGeometry); 
        LineGeometry.StartPointProperty =
              RegisterProperty("StartPoint", 
                               typeof(Point),
                               typeofThis,
                               new Point(),
                               new PropertyChangedCallback(StartPointPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null); 
        LineGeometry.EndPointProperty =
              RegisterProperty("EndPoint", 
                               typeof(Point),
                               typeofThis,
                               new Point(),
                               new PropertyChangedCallback(EndPointPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null); 
    }
	
	LineGeometry.Type = new Type("LineGeometry", LineGeometry, [Geometry.Type]);
	Initialize();
	
	return LineGeometry;
});

