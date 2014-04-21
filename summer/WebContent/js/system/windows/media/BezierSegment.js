/**
 * BezierSegment
 */

define(["dojo/_base/declare", "system/Type", "media/PathSegment"], 
		function(declare, Type, PathSegment){
	var BezierSegment = declare("BezierSegment", PathSegment,{
		constructor:function(/*Point*/ point1, /*Point*/ point2, /*Point*/ point3, /*bool*/ isStroked, /*bool*/ isSmoothJoin){
			
			if(point1 === undefined){
				point1 = null;
			}
			
			if(point2 === undefined){
				point2 = null;
			}
			
			if(point3 === undefined){
				point3 = null;
			}
			
			if(isStroked === undefined){
				isStroked = null;
			}
			
			if(isSmoothJoin === undefined){
				isSmoothJoin = null;
			}
			
            this.Point1 = point1;
            this.Point2 = point2; 
            this.Point3 = point3;
            this.IsStroked = isStroked; 
            this.IsSmoothJoin = isSmoothJoin; 
		},
//        internal override void 
        AddToFigure:function(
            /*Matrix*/ matrix,          // The transformation matrid 
            /*PathFigure*/ figure,      // The figure to add to
            /*ref Point current*/currentRef)      // Out: Segment endpoint, not transformed 
        { 
        	currentRef.current = Point3;
 
            if (matrix.IsIdentity)
            {
                figure.Segments.Add(this);
            } 
            else
            { 
                var pt1 = this.Point1; 
                pt1 *= matrix;
 
                var pt2 = this.Point2;
                pt2 *= matrix;

                var pt3 = current; 
                pt3 *= matrix;
                figure.Segments.Add(new BezierSegment(pt1, pt2, pt3, IsStroked, IsSmoothJoin)); 
            } 
        },

        /// <summary> 
        /// SerializeData - Serialize the contents of this Segment to the provided context.
        /// </summary> 
//        internal override void 
        SerializeData:function(/*StreamGeometryContext*/ ctx) 
        {
            ctx.BezierTo(Point1, Point2, Point3, IsStroked, IsSmoothJoin); 
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
                                 "C{1}{0}{2}{0}{3}", 
                                 separator,
                                 this.Point1.ToString(), 
                                 this.Point2.ToString(), 
                                 this.Point3.ToString()
                                 ); 
        },

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new BezierSegment 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new BezierSegment 
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
            return new BezierSegment();
        }
	});
	
	Object.defineProperties(BezierSegment.prototype,{
        /// <summary> 
        ///     Point1 - Point.  Default value is new Point().
        /// </summary> 
//        public Point 
		Point1: 
        {
            get:function() 
            {
                return this.GetValue(BezierSegment.Point1Property);
            },
            set:function(value) 
            {
            	this.SetValueInternal(BezierSegment.Point1Property, value); 
            } 
        },
 
        /// <summary>
        ///     Point2 - Point.  Default value is new Point().
        /// </summary>
//        public Point 
        Point2: 
        {
            get:function() 
            { 
                return this.GetValue(BezierSegment.Point2Property);
            },
            set:function(value)
            {
            	this.SetValueInternal(BezierSegment.Point2Property, value);
            } 
        },
 
        /// <summary> 
        ///     Point3 - Point.  Default value is new Point().
        /// </summary> 
//        public Point 
        Point3:
        {
            get:function()
            { 
                return this.GetValue(BezierSegment.Point3Property);
            },
            set:function(value) 
            {
            	this.SetValueInternal(BezierSegment.Point3Property, value); 
            }
        }		  
	});
	
	Object.defineProperties(BezierSegment,{
		  
	});
	
//	internal static Point 
	var s_Point1 = new Point();
//    internal static Point 
	var s_Point2 = new Point();
//    internal static Point 
	var s_Point3 = new Point();

//    static BezierSegment()
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272) 
        //


        // Initializations
    	BezierSegment.Point1Property =
              RegisterProperty("Point1",
            		  Point.Type,
                               BezierSegment.Type, 
                               new Point(),
                               null, 
                               null, 
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null); 
    	BezierSegment.Point2Property =
              RegisterProperty("Point2",
            		  Point.Type,
                               BezierSegment.Type, 
                               new Point(),
                               null, 
                               null, 
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null); 
    	BezierSegment.Point3Property =
              RegisterProperty("Point3",
            		  Point.Type,
                               BezierSegment.Type, 
                               new Point(),
                               null, 
                               null, 
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null); 
    }
	
	BezierSegment.Type = new Type("BezierSegment", BezierSegment, [PathSegment.Type]);
	Initialize();
	
	return BezierSegment;
});
 

