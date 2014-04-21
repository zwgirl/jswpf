/**
 * QuadraticBezierSegment
 */

define(["dojo/_base/declare", "system/Type", "media/PathSegment"], 
		function(declare, Type, PathSegment){
	var QuadraticBezierSegment = declare("QuadraticBezierSegment", PathSegment,{
		constructor:function(){
		},
		
		/// <summary>
        /// 
        /// </summary>
        public QuadraticBezierSegment()
        {
        }, 

        /// <summary> 
        /// 
        /// </summary>
        public QuadraticBezierSegment(Point point1, Point point2, bool isStroked) 
        {
            Point1 = point1;
            Point2 = point2;
            IsStroked = isStroked; 
        },
 
        /// <summary> 
        ///
        /// </summary> 
        internal QuadraticBezierSegment(Point point1, Point point2, bool isStroked, bool isSmoothJoin)
        {
            Point1 = point1;
            Point2 = point2; 
            IsStroked = isStroked;
            IsSmoothJoin = isSmoothJoin; 
        }, 

        internal override void AddToFigure(
            Matrix matrix,          // The transformation matrid 
            PathFigure figure,      // The figure to add to
            ref Point current)      // Out: Segment endpoint, not transformed 
        { 
            current = Point2;
 
            if (matrix.IsIdentity)
            {
                figure.Segments.Add(this);
            } 
            else
            { 
                Point pt1 = Point1; 
                pt1 *= matrix;
 
                Point pt2 = current;
                pt2 *= matrix;
                figure.Segments.Add(new QuadraticBezierSegment(pt1, pt2, IsStroked, IsSmoothJoin));
            } 
        },
 
        /// <summary>
        /// SerializeData - Serialize the contents of this Segment to the provided context.
        /// </summary>
        internal override void SerializeData(StreamGeometryContext ctx) 
        {
            ctx.QuadraticBezierTo(Point1, Point2, IsStroked, IsSmoothJoin); 
        }, 

        internal override bool IsCurved()
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
        internal override string ConvertToString(string format, IFormatProvider provider) 
        {
            // Helper to get the numeric list separator for a given culture. 
            char separator = " ";
            return String.Format(provider,
                                 "Q{1}{0}{2}",
                                 separator, 
                                 this.Point1.ToString(),
                                 this.Point2.ToString()); 
        },
        
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new QuadraticBezierSegment Clone()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new QuadraticBezierSegment CloneCurrentValue()
        {
            return base.CloneCurrentValue();
        },
        
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns>
        protected override Freezable CreateInstanceCore()
        { 
            return new QuadraticBezierSegment();
        } 
	});
	
	Object.defineProperties(QuadraticBezierSegment.prototype,{
		 /// <summary> 
        ///     Point1 - Point.  Default value is new Point().
        /// </summary> 
//        public Point 
		Point1 
        {
            get:function() 
            {
                return this.GetValue(QuadraticBezierSegment.Point1Property);
            },
            set:function(value) 
            {
            	this.SetValueInternal(QuadraticBezierSegment.Point1Property, value); 
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
                return this.GetValue(QuadraticBezierSegment.Point2Property);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(QuadraticBezierSegment.Point2Property, value);
            } 
        }  
	});
	
	Object.defineProperties(QuadraticBezierSegment,{
		  
	});
	
//	internal static Point 
	var s_Point1 = new Point();
//	internal static Point 
	var s_Point2 = new Point(); 

//	static QuadraticBezierSegment() 
	function Initialize()
	{
	    // We check our static default fields which are of type Freezable
	    // to make sure that they are not mutable, otherwise we will throw
	    // if these get touched by more than one thread in the lifetime 
	    // of your app.  (Windows OS Bug #947272)
	    // 
		QuadraticBezierSegment.Point1Property =
	          RegisterProperty("Point1",
	                           Point.Type, 
	                           QuadraticBezierSegment.Type,
	                           new Point(), 
	                           null, 
	                           null,
	                           /* isIndependentlyAnimated  = */ false, 
	                           /* coerceValueCallback */ null);
	    QuadraticBezierSegment.Point2Property =
	          RegisterProperty("Point2",
	        		  Point.Type, 
	                           QuadraticBezierSegment.Type,
	                           new Point(), 
	                           null, 
	                           null,
	                           /* isIndependentlyAnimated  = */ false, 
	                           /* coerceValueCallback */ null);
	}
	
	QuadraticBezierSegment.Type = new Type("QuadraticBezierSegment", QuadraticBezierSegment, [PathSegment.Type]);
	Initialize();
	
	return QuadraticBezierSegment;
});
        

     

