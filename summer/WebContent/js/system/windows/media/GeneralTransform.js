/**
 * GeneralTransform
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable"], 
		function(declare, Type, Animatable){
	var GeneralTransform = declare("GeneralTransform", Animatable,{
		constructor:function(){
		},
		
		 /// <summary> 
        /// Transform a point
        /// </summary>
        /// <param name="inPoint">Input point</param>
        /// <param name="result">Output point</param> 
        /// <returns>True if the point was transformed successfuly, false otherwise</returns>
//        public abstract bool TryTransform(Point inPoint, out Point result); 
 
        /// <summary>
        /// Transform a point 
        ///
        /// If the transformation does not succeed, this will throw an InvalidOperationException.
        /// If you don't want to try/catch, call TryTransform instead and check the boolean it
        /// returns. 
        ///
        /// Note that this method will always succeed when called on a subclass of Transform 
        /// </summary> 
        /// <param name="point">Input point</param>
        /// <returns>The transformed point</returns> 
//        public Point 
		Transform:function(/*Point*/ point)
        {
            /*Point*/var transformedPointOut = {"transformedPoint" : null};
 
            if (!TryTransform(point, /*out transformedPoint*/transformedPointOut))
            { 
                throw new InvalidOperationException(SR.Get(SRID.GeneralTransform_TransformFailed, null)); 
            }
 
            return transformedPointOut.transformedPoint;
        },

        /// <summary> 
        /// Transforms the bounding box to the smallest axis aligned bounding box
        /// that contains all the points in the original bounding box 
        /// </summary> 
        /// <param name="rect">Bounding box</param>
        /// <returns>The transformed bounding box</returns> 
//        public abstract Rect TransformBounds(Rect rect);
        
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new GeneralTransform 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new GeneralTransform 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue();
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
//        public string 
        ToString:function(/*IFormatProvider*/ provider) 
        { 
            ReadPreamble();
            // Delegate to the internal method which implements all ToString calls. 
            return ConvertToString(null /* format string */, provider);
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
//        string IFormattable.
        ToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        {
            ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls. 
            return ConvertToString(format, provider);
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
//        internal virtual string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
        {
            return base.ToString(); 
        }
	});
	
	Object.defineProperties(GeneralTransform.prototype,{
        /// <summary> 
        /// Returns the inverse transform if it has an inverse, null otherwise
        /// </summary> 
//        public abstract GeneralTransform 
		Inverse: { get:function(){} }, 

        /// <summary> 
        /// Returns a best effort affine transform
        /// </summary>
//        internal virtual Transform 
		AffineTransform:
        { 
            get:function() { return null; } 
        } 
	});
	
	Object.defineProperties(GeneralTransform,{
		  
	});
	
	GeneralTransform.Type = new Type("GeneralTransform", GeneralTransform, [Animatable.Type]);
	return GeneralTransform;
});


