/**
 * PathFigure
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable"], 
		function(declare, Type, Animatable){
	var PathFigure = declare("PathFigure", Animatable,{
		constructor:function(){
			if(arguments.length == 2){
				var tolerance = arguments[0], type = arguments[1];
				/*PathGeometry*/var geometry = new PathGeometry();
	            geometry.Figures.Add(this); 

	            /*PathGeometry*/var flattenedGeometry = geometry.GetFlattenedPathGeometry(tolerance, type); 
	 
	            var count = flattenedGeometry.Figures.Count;
	 
	            if (count == 0)
	            {
	                return new PathFigure();
	            } 
	            else if (count == 1)
	            { 
	                return flattenedGeometry.Figures.Get(0); 
	            }
	            else 
	            {
	                throw new InvalidOperationException(SR.Get(SRID.PathGeometry_InternalReadBackError));
	            }
			}else if(arguments.length == 3){
				var start = arguments[0], /*IEnumerable<PathSegment>*/ segments = arguments[1], /*bool*/ closed = arguments[2];
				
				this.StartPoint = start;
	            /*PathSegmentCollection*/var mySegments = this.Segments;

	            if (segments != null) 
	            {
	                for(var i=0; i<segments.Count; i++) //foreach (PathSegment item in segments) 
	                { 
	                	var item = collection.Get(i);
	                    mySegments.Add(item);
	                } 
	            }
	            else
	            {
	                throw new ArgumentNullException("segments"); 
	            }
	 
	            this.IsClosed = closed;
			}
		},
		
        /// <summary> 
        /// Approximate this figure with a polygonal PathFigure
        /// </summary> 
        /// <returns>Returns the polygonal approximation as a PathFigure.</returns>
//        public PathFigure 
		GetFlattenedPathFigure:function()
        {
            return GetFlattenedPathFigure(Geometry.StandardFlatteningTolerance, ToleranceType.Absolute); 
        },
 
        /// <summary> 
        /// Returns true if this geometry may have curved segments
        /// </summary>
//        public bool 
        MayHaveCurves:function()
        { 
            /*PathSegmentCollection*/var segments = this.Segments;
 
            if (segments == null) 
            {
                return false; 
            }

            var count = segments.Count;
 
            for (var i = 0; i < count; i++)
            { 
                if (segments.Internal_GetItem(i).IsCurved()) 
                {
                    return true; 
                }
            }

            return false; 
        },
 
//        internal PathFigure 
        GetTransformedCopy:function(/*Matrix*/ matrix)
        { 
            /*PathSegmentCollection*/var segments = this.Segments;

            /*PathFigure*/var result = new PathFigure();
            /*Point*/var current = StartPoint; 
            result.StartPoint = current * matrix;
 
            if (segments != null) 
            {
                var count = segments.Count; 
                for (var i=0; i<count; i++)
                {
                    segments.Internal_GetItem(i).AddToFigure(matrix, result, /*ref*/ current);
                } 
            }
 
            result.IsClosed = IsClosed; 
            result.IsFilled = IsFilled;
 
            return result;
        },
 
        /// <summary>
        /// Creates a string representation of this object based on the current culture. 
        /// </summary> 
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
//        public override string 
        ToString:function()
        {
            ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls.
            return ConvertToString(null /* format string */, null /* format provider */); 
        },

        /// <summary> 
        /// Creates a string representation of this object based on the IFormatProvider
        /// passed in.  If the provider is null, the CurrentCulture is used.
        /// </summary>
        /// <returns> 
        /// A string representation of this object.
        /// </returns> 
//        public string ToString(IFormatProvider provider) 
//        {
//            ReadPreamble(); 
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(null /* format string */, provider);
//        }
 
        /// <summary>
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns>
        /// A string representation of this object.
        /// </returns> 
//        string IFormattable.ToString(string format, IFormatProvider provider)
//        { 
//            ReadPreamble(); 
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(format, provider); 
//        }

        /// <summary>
        /// Can serialze "this" to a string. 
        /// This returns true iff IsFilled == c_isFilled and the segment
        /// collection can be stroked. 
        /// </summary> 
//        internal bool CanSerializeToString()
//        { 
//            PathSegmentCollection segments = Segments;
//            return (IsFilled == c_IsFilled) && ((segments == null) || segments.CanSerializeToString());
//        }
 
        /// <summary>
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns>
        /// A string representation of this object.
        /// </returns> 
//        internal string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
        { 
            /*PathSegmentCollection*/var segments = this.Segments; 
            return "M" +
                (this.StartPoint).ToString(format, provider) + 
                (segments != null ? segments.ConvertToString(format, provider) : "") +
                (this.IsClosed ? "z" : "");
        },
 
        /// <summary>
        /// SerializeData - Serialize the contents of this Figure to the provided context. 
        /// </summary> 
//        internal void SerializeData(StreamGeometryContext ctx)
//        { 
//            ctx.BeginFigure(StartPoint, IsFilled, IsClosed);
//
//            PathSegmentCollection segments = Segments;
// 
//            int pathSegmentCount = segments == null ? 0 : segments.Count;
// 
//            for (int i = 0; i < pathSegmentCount; i++) 
//            {
//                segments.Internal_GetItem(i).SerializeData(ctx); 
//            }
//        },
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new PathFigure 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new PathFigure 
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
            return new PathFigure();
        } 

	});
	
	Object.defineProperties(PathFigure.prototype,{
	    /// <summary> 
        ///     StartPoint - Point.  Default value is new Point().
        /// </summary> 
//        public Point 
		StartPoint: 
        {
            get:function() 
            {
                return this.GetValue(PathFigure.StartPointProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(PathFigure.StartPointProperty, value); 
            } 
        },
 
        /// <summary>
        ///     IsFilled - bool.  Default value is true.
        /// </summary>
//        public bool 
        IsFilled: 
        {
            get:function() 
            { 
                return this.GetValue(PathFigure.IsFilledProperty);
            }, 
            set:function(value) 
            {
            	this.SetValueInternal(PathFigure.IsFilledProperty, value);
            } 
        },
 
        /// <summary> 
        ///     Segments - PathSegmentCollection.  Default value is new FreezableDefaultValueFactory(PathSegmentCollection.Empty).
        /// </summary> 
//        public PathSegmentCollection 
        Segments:
        {
            get:function()
            { 
                return this.GetValue(PathFigure.SegmentsProperty);
            }, 
            set:function(value) 
            {
            	this.SetValueInternal(PathFigure.SegmentsProperty, value); 
            }
        },

        /// <summary> 
        ///     IsClosed - bool.  Default value is false.
        /// </summary> 
//        public bool 
        IsClosed:
        {
            get:function() 
            {
                return this.GetValue(PathFigure.IsClosedProperty);
            }, 
            set:function(value)  
            {
            	this.SetValueInternal(PathFigure.IsClosedProperty, value); 
            } 
        }  
	});
	
	Object.defineProperties(PathFigure,{
		  
	});
	
//	internal static Point 
	var s_StartPoint = new Point();
//	internal const bool 
	var c_IsFilled = true;
//	internal static PathSegmentCollection 
	var s_Segments = PathSegmentCollection.Empty; 
//	internal const bool 
	var c_IsClosed = false;

//	static PathFigure()
	function Initialize()
	{
	    // We check our static default fields which are of type Freezable
	    // to make sure that they are not mutable, otherwise we will throw 
	    // if these get touched by more than one thread in the lifetime
	    // of your app.  (Windows OS Bug #947272) 
	    // 
//	    Debug.Assert(s_Segments == null || s_Segments.IsFrozen,
//	        "Detected context bound default value PathFigure.s_Segments (See OS Bug #947272)."); 

		PathFigure.StartPointProperty =
	          RegisterProperty("StartPoint", 
	        		  Point.Type, 
	                           PathFigure.Type,
	                           new Point(), 
	                           null,
	                           null,
	                           /* isIndependentlyAnimated  = */ false,
	                           /* coerceValueCallback */ null); 
	    PathFigure.IsFilledProperty =
	          RegisterProperty("IsFilled", 
	                           Boolean.Type, 
	                           PathFigure.Type,
	                           true, 
	                           null,
	                           null,
	                           /* isIndependentlyAnimated  = */ false,
	                           /* coerceValueCallback */ null); 
	    PathFigure.SegmentsProperty =
	          RegisterProperty("Segments", 
	                           PathSegmentCollection.Type, 
	                           PathFigure.Type,
	                           new FreezableDefaultValueFactory(PathSegmentCollection.Empty), 
	                           null,
	                           null,
	                           /* isIndependentlyAnimated  = */ false,
	                           /* coerceValueCallback */ null); 
	    PathFigure.IsClosedProperty =
	          RegisterProperty("IsClosed", 
	                           Boolean.Type, 
	                           PathFigure.Type,
	                           false, 
	                           null,
	                           null,
	                           /* isIndependentlyAnimated  = */ false,
	                           /* coerceValueCallback */ null); 
	}   
	
	PathFigure.Type = new Type("PathFigure", PathFigure, [Animatable.Type]);
	Initialize();
	
	return PathFigure;
});


