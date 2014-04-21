/**
 * LineSegment
 */

define(["dojo/_base/declare", "system/Type", "media/PathSegment"], 
		function(declare, Type, PathSegment){
	var LineSegment = declare("LineSegment", PathSegment,{
		constructor:function(/*Point*/ point, /*bool*/ isStroked, /*bool*/ isSmoothJoin){
			if(point === undefined){
				point = null;
			}
			
			if(isStroked === undefined){
				isStroked = false;
			}
			
			if(isSmoothJoin === undefined){
				isSmoothJoin = false;
			}
			
            this.Point = point;
            this.IsStroked = isStroked;
            this.IsSmoothJoin = isSmoothJoin;
			
		},
//        internal override void 
        AddToFigure:function(
                /*Matrix*/ matrix,          // The transformation matrid
                /*PathFigure*/ figure,      // The figure to add to
                /*ref Point current*/currentRef)      // Out: Segment endpoint, not transformed 
            {
        	currentRef.current = Point; 
     
                if (matrix.IsIdentity)
                { 
                    figure.Segments.Add(this);
                }
                else
                { 
                    /*Point*/var pt = currentRef.current;
                    pt *= matrix; 
                    figure.Segments.Add(new LineSegment(pt, this.IsStroked, this.IsSmoothJoin)); 
                }
            }, 

//            internal override bool 
            IsCurved:function()
            {
                return false; 
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
//            internal override string 
            ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
            {
                return "L" + (/*(IFormattable)*/this.Point).ToString(format, provider); 
            },

            /// <summary> 
            ///     Shadows inherited Clone() with a strongly typed 
            ///     version for convenience.
            /// </summary> 
//            public new LineSegment 
            Clone:function()
            {
                return base.Clone();
            }, 

            /// <summary> 
            ///     Shadows inherited CloneCurrentValue() with a strongly typed 
            ///     version for convenience.
            /// </summary> 
//            public new LineSegment 
            CloneCurrentValue:function()
            {
                return base.CloneCurrentValue();
            }, 


            /// <summary>
            /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
            /// </summary> 
            /// <returns>The new Freezable.</returns>
//            protected override Freezable 
            CreateInstanceCore:function() 
            { 
                return new LineSegment();
            } 
        
	});
	
	Object.defineProperties(LineSegment.prototype,{
        /// <summary> 
        ///     Point - Point.  Default value is new Point().
        /// </summary> 
//        public Point 
		Point: 
        {
            get:function() 
            {
                return this.GetValue(LineSegment.PointProperty);
            },
            set:function() 
            {
            	this.SetValueInternal(LineSegment.PointProperty, value); 
            } 
        }  
	});
	
	Object.defineProperties(LineSegment,{
		  
	});
//    internal static Point 
	var s_Point = new Point(); 

//    static LineSegment()
    function Initialize()
    {
        // We check our static default fields which are of type Freezable 
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272) 
        //
        // Initializations
    	LineSegment.PointProperty = 
              RegisterProperty("Point",
            		  Point.Type, 
                               LineSegment.Type, 
                               new Point(),
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null);
    } 
	
	LineSegment.Type = new Type("LineSegment", LineSegment, [PathSegment.Type]);
	Initialize();
	
	return LineSegment;
});
