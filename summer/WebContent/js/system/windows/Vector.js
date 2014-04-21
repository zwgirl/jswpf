/**
 * Vector
 */
/// <summary>
/// Vector - A value type which defined a vector in terms of X and Y
/// </summary> 
define(["dojo/_base/declare", "system/Type" ], 
		function(declare, Type){
//	 public partial struct Vector
	var Vector = declare("Vector", Object,{
		constructor:function(/*double*/ x, /*double*/ y)
        { 
            this._x = x; 
            this._y = y;
		},
		
		/// <summary>
        /// Normalize - Updates this Vector to maintain its direction, but to have a length
        /// of 1.  This is equivalent to dividing this Vector by Length
        /// </summary> 
//        public void 
		Normalize:function()
        { 
            // Avoid overflow 
//            this /= Math.max(Math.abs(this._x),Math.abs(this._y));
			Vector.Divide(this, Math.max(Math.abs(this._x),Math.abs(this._y)));
//            this /= this.Length; 
			Vector.Divide(this, this.Length);
        },
        /// <summary> 
        /// Negates the values of X and Y on this Vector
        /// </summary> 
//        public void 
        Negate:function()
        {
        	this._x = -this._x;
        	this._y = -this._y; 
        },
 
        /// <summary>
        /// Equals - compares this Vector with the passed in object.  In this equality
        /// Double.NaN is equal to itself, unlike in numeric equality.
        /// Note that double values can acquire error when operated upon, such that 
        /// an exact comparison between two values which
        /// are logically equal may fail. 
        /// </summary> 
        /// <returns>
        /// bool - true if the object is an instance of Vector and if it's equal to "this". 
        /// </returns>
        /// <param name='o'>The object to compare to "this"</param>
//        public override bool 
        Equals:function(/*object*/ o)
        { 
            if ((null == o) || !(o instanceof Vector))
            { 
                return false; 
            }
 
            return Vector.Equals(this,o);
        },
        /// <summary>
        /// Returns the HashCode for this Vector
        /// </summary> 
        /// <returns>
        /// int - the HashCode for this Vector 
        /// </returns> 
//        public override int 
        GetHashCode:function()
        { 
            // Perform field-by-field XOR of HashCodes
            return this.X.GetHashCode() ^
            this.Y.GetHashCode();
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

            // Delegate to the internal method which implements all ToString calls. 
            return this.ConvertToString(null /* format string */, null /* format provider */);
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
//        internal string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
        {
            // Helper to get the numeric list separator for a given culture. 
            var separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider);
            return String.Format(provider, 
                                 "{1:" + format + "}{0}{2:" + format + "}", 
                                 separator,
                                 this._x, 
                                 this._y);
        }
	});
	
	Object.defineProperties(Vector.prototype,{
		 /// <summary> 
        /// Length Property - the length of this Vector 
        /// </summary>
//        public double 
		Length: 
        {
            get:function()
            {
                return Math.sqrt(this._x * this._x + this._y * this._y); 
            }
        }, 
 
        /// <summary>
        /// LengthSquared Property - the squared length of this Vector 
        /// </summary>
//        public double 
		LengthSquared:
        {
            get:function() 
            {
                return this._x * this._x + this._y * this._y; 
            } 
        },
      /// <summary>
        ///     X - double.  Default value is 0. 
        /// </summary>
//        public double 
        X:
        {
            get:function() 
            {
                return this._x; 
            },
            set:function() 
            {
            	this._x = value;
            }
        },
 
        /// <summary> 
        ///     Y - double.  Default value is 0.
        /// </summary> 
//        public double 
        Y:
        {
            get:function()
            { 
                return this._y;
            },
            set:function()
            { 
            	this._y = value;
            }

        } 
	});
	
	/// <summary>
    /// CrossProduct - Returns the cross product: vector1.X*vector2.Y - vector1.Y*vector2.X 
    /// </summary>
    /// <returns> 
    /// Returns the cross product: vector1.X*vector2.Y - vector1.Y*vector2.X 
    /// </returns>
    /// <param name="vector1"> The first Vector </param> 
    /// <param name="vector2"> The second Vector </param>
//    public static double 
	CrossProduct = function(/*Vector*/ vector1, /*Vector*/ vector2)
    {
        return vector1._x * vector2._y - vector1._y * vector2._x; 
    };

    /// <summary> 
    /// AngleBetween - the angle between 2 vectors
    /// </summary> 
    /// <returns>
    /// Returns the the angle in degrees between vector1 and vector2
    /// </returns>
    /// <param name="vector1"> The first Vector </param> 
    /// <param name="vector2"> The second Vector </param>
//    public static double 
    AngleBetween = function(/*Vector*/ vector1, /*Vector*/ vector2) 
    { 
        var sin = vector1._x * vector2._y - vector2._x * vector1._y;
        var cos = vector1._x * vector2._x + vector1._y * vector2._y; 

        return Math.atan2(sin, cos) * (180 / Math.PI);
    };
    
//  /// <summary> 
//    /// Add: Vector + Vector
//    /// </summary> 
////    public static Vector 
//    Vector.Add = function(/*Vector*/ vector1, /*Vector*/ vector2)
//    {
//        return new Vector(vector1._x + vector2._x,
//                          vector1._y + vector2._y); 
//    };
//    
//    /// <summary> 
//    /// Add: Vector + Point 
//    /// </summary>
////    public static Point 
//    Vector.Add = function(/*Vector*/ vector, /*Point*/ point) 
//    {
//        return new Point(point._x + vector._x, point._y + vector._y);
//    };
    
    /// <summary> 
    /// Add: Vector + Vector
    /// </summary> 
//    public static Vector 
    Vector.Add = function(/*Vector*/ vector1, /*Vector*/ vector2)
    {
    	if(vector2 instanceof Vector ){
            return new Vector(vector1._x + vector2._x,
                    vector1._y + vector2._y);
    	}else if(vector2 instanceof Point ){
    		var point = vector2;
            return new Point(point._x + vector._x, point._y + vector._y);
    	}
    };

    /// <summary> 
    /// Subtract: Vector - Vector
    /// </summary> 
//    public static Vector 
    Vector.Subtract = function(/*Vector*/ vector1, /*Vector*/ vector2)
    {
        return new Vector(vector1._x - vector2._x,
                          vector1._y - vector2._y); 
    };

//    /// <summary>
//    /// Multiply: Vector * double 
//    /// </summary> 
////    public static Vector 
//    Vector.Multiply = function(/*Vector*/ vector, /*double*/ scalar)
//    { 
//        return new Vector(vector._x * scalar,
//                          vector._y * scalar);
//    };
//
//    /// <summary>
//    /// Multiply: double * Vector 
//    /// </summary> 
////    public static Vector 
//    Vector.Multiply = function(/*double*/ scalar, /*Vector*/ vector)
//    { 
//        return new Vector(vector._x * scalar,
//                          vector._y * scalar);
//    };
//    
//    /// <summary>
//    /// Multiply: Vector * Matrix
//    /// </summary> 
////    public static Vector 
//    Vector.Multiply = function(/*Vector*/ vector, /*Matrix*/ matrix)
//    { 
//        return matrix.Transform(vector); 
//    };
//    /// <summary> 
//    /// Multiply - Returns the dot product: vector1.X*vector2.X + vector1.Y*vector2.Y
//    /// </summary>
//    /// <returns>
//    /// Returns the dot product: vector1.X*vector2.X + vector1.Y*vector2.Y 
//    /// </returns>
//    /// <param name="vector1"> The first Vector </param> 
//    /// <param name="vector2"> The second Vector </param> 
////    public static double 
//    Vector.Multiply = function(/*Vector*/ vector1, /*Vector*/ vector2)
//    { 
//        return vector1._x * vector2._x + vector1._y * vector2._y;
//    };
    
    /// <summary>
    /// Multiply: Vector * double 
    /// </summary> 
//    public static Vector 
    Vector.Multiply = function(/*Vector*/ vector, /*double*/ scalar)
    { 
    	if(vector instanceof Vector && (typeof scalar == "number")){
            return new Vector(vector._x * scalar,
                    vector._y * scalar);
    	}else if((typeof vector == "number") && scalar instanceof Vector){
            return new Vector(scalar._x * vector,
            		scalar._y * vector);
    	}else if(vector instanceof Vector && scalar instanceof matrix){
            return scalar.Transform(vector); 
    	}else if(vector instanceof Vector && (scalar instanceof Vector)){
    		return vector._x * scalar._x + vector._y * scalar._y;
    	}

    };

    /// <summary> 
    /// Multiply: Vector / double
    /// </summary> 
//    public static Vector 
    Divide = function(/*Vector*/ vector, /*double*/ scalar) 
    {
        return vector * (1.0 / scalar); 
    };

    /// <summary> 
    /// Determinant - Returns the determinant det(vector1, vector2)
    /// </summary> 
    /// <returns> 
    /// Returns the determinant: vector1.X*vector2.Y - vector1.Y*vector2.X
    /// </returns> 
    /// <param name="vector1"> The first Vector </param>
    /// <param name="vector2"> The second Vector </param>
//    public static double 
    Vector.Determinant = function(/*Vector*/ vector1, /*Vector*/ vector2)
    { 
        return vector1._x * vector2._y - vector1._y * vector2._x;
    }; 

    /// <summary>
    /// Explicit conversion to Point 
    /// </summary>
    /// <returns> 
    /// Point - A Point equal to this Vector 
    /// </returns>
    /// <param name="vector"> Vector - the Vector to convert to a Point </param> 
//    public static explicit operator 
    Vector.Point = function(/*Vector*/ vector)
    {
        return new Point(vector._x, vector._y);
    }; 
    /// <summary>
    /// Compares two Vector instances for object equality.  In this equality
    /// Double.NaN is equal to itself, unlike in numeric equality.
    /// Note that double values can acquire error when operated upon, such that 
    /// an exact comparison between two values which
    /// are logically equal may fail. 
    /// </summary> 
    /// <returns>
    /// bool - true if the two Vector instances are exactly equal, false otherwise 
    /// </returns>
    /// <param name='vector1'>The first Vector to compare</param>
    /// <param name='vector2'>The second Vector to compare</param>
//    public static bool 
    Vector.Equals = function(/*Vector*/ vector1, /*Vector*/ vector2) 
    {
        return vector1.X.Equals(vector2.X) && 
               vector1.Y.Equals(vector2.Y); 
    };
	
	Vector.Type = new Type("Vector", Vector, [Object.Type]);
	return Vector;
});
