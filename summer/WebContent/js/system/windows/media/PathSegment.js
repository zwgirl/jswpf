/**
 * PathSegment
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable"], 
		function(declare, Type, Animatable){
//    internal const bool 
	var c_isStrokedDefault = true;
	
//    internal const bool 
	var c_IsStroked = true;
//    internal const bool 
	var c_IsSmoothJoin = false; 
    
	var PathSegment = declare("PathSegment", Animatable,{
		constructor:function(){
		},
		
//		internal abstract void AddToFigure(
//	            Matrix matrix,          // The transformation matrid 
//	            PathFigure figure,      // The figure to add to 
//	            ref Point current);     // In: Segment start point, Out: Segment endpoint
	                                    //     not transformed 
//        internal virtual bool 
		IsEmpty:function() 
        {
            return false; 
        }, 

//        internal abstract bool IsCurved(); 

        /// <summary>
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary> 
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
//        internal abstract string ConvertToString(string format, IFormatProvider provider);
        /// <summary> 
        /// SerializeData - Serialize the contents of this Segment to the provided context.
        /// </summary> 
//        internal abstract void SerializeData(StreamGeometryContext ctx);


        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new PathSegment 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new PathSegment 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue();
        } 

	});
	
	Object.defineProperties(PathSegment.prototype,{
		/// <summary> 
        ///     IsStroked - bool.  Default value is true.
        /// </summary> 
//        public bool 
		IsStroked:
        {
            get:function() 
            {
                return this.GetValue(PathSegment.IsStrokedProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(PathSegment.IsStrokedProperty, value); 
            } 
        },
 
        /// <summary>
        ///     IsSmoothJoin - bool.  Default value is false.
        /// </summary>
//        public bool 
        IsSmoothJoin: 
        {
            get:function() 
            { 
                return this.GetValue(PathSegment.IsSmoothJoinProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(PathSegment.IsSmoothJoinProperty, value);
            } 
        }  
	});
	
	Object.defineProperties(PathSegment,{
		  
	});
	
//    static PathSegment()
    function Initialize()
    {
        // We check our static default fields which are of type Freezable 
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272) 
        //
        // Initializations
    	PathSegment.IsStrokedProperty = 
              RegisterProperty("IsStroked",
            		  Boolean.Type, 
                               PathSegment.Type, 
                               true,
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null);
        PathSegment.IsSmoothJoinProperty = 
              RegisterProperty("IsSmoothJoin",
                               Boolean.Type, 
                               PathSegment.Type, 
                               false,
                               null, 
                               null,
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null);
    } 
	
	PathSegment.Type = new Type("PathSegment", PathSegment, [Animatable.Type]);
	Initialize();
	
	return PathSegment;
});
 




