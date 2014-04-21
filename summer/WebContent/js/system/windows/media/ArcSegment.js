/**
 * ArcSegment
 */

define(["dojo/_base/declare", "system/Type", "media/PathSegment", "windows/Point", "windows/Size"], 
		function(declare, Type, PathSegment, Point, Size){
	var ArcSegment = declare("ArcSegment", PathSegment,{
		constructor:function(/*Point*/ point, 
	            /*Size*/ size, 
	            /*double*/ rotationAngle,
	            /*bool*/ isLargeArc, 
	            /*SweepDirection*/ sweepDirection,
	            /*bool*/ isStroked){
			
			
			
            this.Size = size; 
            this.RotationAngle = rotationAngle;
            this.IsLargeArc = isLargeArc; 
            this.SweepDirection = sweepDirection; 
            this.Point = point;
            this.IsStroked = isStroked; 
		},
		
        /// <SecurityNote> 
        ///     Critical: This code calls into MilUtility_ArcToBezier which has an unmanaged code elevation 
        ///     TreatAsSafe: Adding a figure is considered safe in partial trust.
        /// </SecurityNote> 
//        internal override void 
        AddToFigure:function(
            /*Matrix*/ matrix,          // The transformation matrid
            /*PathFigure*/ figure,      // The figure to add to 
            /*ref Point current*/currentRef)      // In: Segment start point, Out: Segment endpoint, neither transformed
        { 
            var endPoint = this.Point; 

            if (matrix.IsIdentity) 
            {
                figure.Segments.Add(this);
            }
//            else 
//            {
//                // The arc segment is approximated by up to 4 Bezier segments 
//                unsafe 
//                {
//                    int count; 
//                    Point* points = stackalloc Point[12];
//                    Size    size = Size;
//                    Double  rotation = RotationAngle;
//                    MilMatrix3x2D mat3X2 = CompositionResourceManager.MatrixToMilMatrix3x2D(ref matrix); 
//
//                    Composition.MilCoreApi.MilUtility_ArcToBezier( 
//                        current,    // =start point 
//                        size,
//                        rotation, 
//                        IsLargeArc,
//                        SweepDirection,
//                        endPoint,
//                        &mat3X2, 
//                        points,
//                        out count); // = number of Bezier segments 
// 
//                    Invariant.Assert(count <= 4);
// 
//                    // To ensure no buffer overflows
//                    count = Math.Min(count, 4);
//
//                    bool isStroked = IsStroked; 
//                    bool isSmoothJoin = IsSmoothJoin;
// 
//                    // Add the segments 
//                    if (count > 0)
//                    { 
//                        for (int i = 0; i < count; i++)
//                        {
//                            figure.Segments.Add(new BezierSegment(
//                                    points[3*i], 
//                                    points[3*i + 1],
//                                    points[3*i + 2], 
//                                    isStroked, 
//                                    (i < count - 1) || isSmoothJoin));    // Smooth join between arc pieces
//                        } 
//                    }
//                    else if (count == 0)
//                    {
//                        figure.Segments.Add(new LineSegment(points[0], isStroked, isSmoothJoin)); 
//                    }
//                } 
// 
//                // Update the last point
//                current = endPoint; 
//            }
        },
 
        /// <summary>
        /// SerializeData - Serialize the contents of this Segment to the provided context. 
        /// </summary> 
//        internal override void 
        SerializeData:function(/*StreamGeometryContext*/ ctx)
        { 
            ctx.ArcTo(Point, Size, RotationAngle, IsLargeArc, SweepDirection, IsStroked, IsSmoothJoin);
        },

//        internal override bool 
        IsCurved:function() 
        {
            return true; 
        }, 

        /// <summary> 
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in.
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns> 
        /// A string representation of this object. 
        /// </returns>
//        internal override string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        {
            // Helper to get the numeric list separator for a given culture.
            var separator = " ";
            return String.Format(provider, 
                                 "A{1}{0}{2}{0}{3}{0}{4}{0}{5}",
                                 separator, 
                                 this.Size.ToString(), 
                                 this.RotationAngle,
                                 this.IsLargeArc ? "1" : "0", 
                                 this.SweepDirection == SweepDirection.Clockwise ? "1" : "0",
                                 this.Point.ToString());
        },
        
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new ArcSegment 
        Clone:function()
        {
            return base.Clone();
        },

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new ArcSegment 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue();
        },
        
        
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function()
        { 
            return new ArcSegment();
        } 
	});
	
	Object.defineProperties(ArcSegment.prototype,{
        /// <summary> 
        ///     Point - Point.  Default value is new Point().
        /// </summary> 
//        public Point 
		Point: 
        {
            get:function() 
            {
                return this.GetValue(ArcSegment.PointProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(ArcSegment.PointProperty, value); 
            } 
        },
 
        /// <summary>
        ///     Size - Size.  Default value is new Size().
        /// </summary>
//        public Size 
        Size: 
        {
            get:function() 
            { 
                return this.GetValue(ArcSegment.SizeProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(ArcSegment.SizeProperty, value);
            } 
        },
 
        /// <summary> 
        ///     RotationAngle - double.  Default value is 0.0.
        /// </summary> 
//        public double 
        RotationAngle:
        {
            get:function()
            { 
                return this.GetValue(ArcSegment.RotationAngleProperty);
            }, 
            set:function(value) 
            {
            	this.SetValueInternal(ArcSegment.RotationAngleProperty, value); 
            }
        },

        /// <summary> 
        ///     IsLargeArc - bool.  Default value is false.
        /// </summary> 
//        public bool 
        IsLargeArc: 
        {
            get:function() 
            {
                return this.GetValue(ArcSegment.IsLargeArcProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(ArcSegment.IsLargeArcProperty, value); 
            } 
        },
 
        /// <summary>
        ///     SweepDirection - SweepDirection.  Default value is SweepDirection.Counterclockwise.
        /// </summary>
//        public SweepDirection 
        SweepDirection: 
        {
            get:function() 
            { 
                return this.GetValue(ArcSegment.SweepDirectionProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(ArcSegment.SweepDirectionProperty, value);
            } 
        }  
	});
	
	Object.defineProperties(ArcSegment,{
		  
	});
	
    /// <summary> 
    /// For the purposes of this class, Size.Empty should be treated as if it were Size(0,0). 
    /// </summary>
//    private static object 
	function CoerceSize(/*DependencyObject*/ d, /*object*/ value) 
    {
        if (value.IsEmpty)
        {
            return new Size(0,0); 
        }
        else 
        { 
            return value;
        } 
    }
    
//    internal static Point 
    var s_Point = new Point(); 
//    internal static Size 
    var s_Size = new Size(); 
//    internal const double 
    var c_RotationAngle = 0.0;
//    internal const bool 
    var c_IsLargeArc = false; 
//    internal const SweepDirection 
    var c_SweepDirection = SweepDirection.Counterclockwise;
    
//    static ArcSegment() 
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272)
        //
    	ArcSegment.PointProperty =
              RegisterProperty("Point", 
            		  Point.Type,
                               ArcSegment.Type,
                               new Point(),
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null); 
        ArcSegment.SizeProperty =
              RegisterProperty("Size", 
                               Size.Type,
                               ArcSegment.Type,
                               new Size(),
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ new CoerceValueCallback(null, CoerceSize)); 
        ArcSegment.RotationAngleProperty =
              RegisterProperty("RotationAngle", 
                               Number.Type,
                               ArcSegment.Type,
                               0.0,
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null); 
        ArcSegment.IsLargeArcProperty =
              RegisterProperty("IsLargeArc", 
                               Boolean.Type,
                               ArcSegment.Type,
                               false,
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null); 
        ArcSegment.SweepDirectionProperty =
              RegisterProperty("SweepDirection", 
                               Number.Type,
                               ArcSegment.Type,
                               SweepDirection.Counterclockwise,
                               null, 
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsSweepDirectionValid),
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null); 
    }
	
	ArcSegment.Type = new Type("ArcSegment", ArcSegment, [PathSegment.Type]);
	Initialize();

	return ArcSegment;
});