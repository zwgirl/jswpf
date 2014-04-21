/**
 * Second Check 2014-01-16
 * Point
 */

define(["dojo/_base/declare", "system/Type", "system/IFormattable"], 
		function(declare, Type, IFormattable){
//	public partial struct
	var Point = declare("Point", IFormattable,{
		constructor:function(/*double*/ x, /*double*/ y) 
        {
            this._x = x; 
            this._y = y; 
        },
        
        /// <summary>
        /// Offset - update the location by adding offsetX to X and offsetY to Y 
        /// </summary> 
        /// <param name="offsetX"> The offset in the x dimension </param>
        /// <param name="offsetY"> The offset in the y dimension </param> 
//        public void 
        Offset:function(/*double*/ offsetX, /*double*/ offsetY)
        {
            this._x += offsetX;
            this._y += offsetY; 
        },
        
        /// <summary>
        /// Equals - compares this Point with the passed in object.  In this equality
        /// Double.NaN is equal to itself, unlike in numeric equality.
        /// Note that double values can acquire error when operated upon, such that 
        /// an exact comparison between two values which
        /// are logically equal may fail. 
        /// </summary> 
        /// <returns>
        /// bool - true if the object is an instance of Point and if it's equal to "this". 
        /// </returns>
        /// <param name='o'>The object to compare to "this"</param>
//        public override bool 
        Equals:function(/*object*/ o)
        { 
            if ((null == o) || !(o instanceof Point))
            { 
                return false; 
            }
 
            return Point.Equals(this,o);
        },
 
        /// Returns the HashCode for this Point
        /// </summary> 
        /// <returns>
        /// int - the HashCode for this Point 
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
//            char separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider);
//            return String.Format(provider, 
//                                 "{1:" + format + "}{0}{2:" + format + "}", 
//                                 separator,
//                                 _x, 
//                                 _y);
        	this._x + "," + this._y;
        }

	});
	
	Object.defineProperties(Point.prototype,{
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

            set:function(value) 
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
 
            set:function(value)
            { 
            	this._y = value;
            }

        }		  
	});
	
    /// <summary>
    /// Compares two Point instances for object equality.  In this equality
    /// Double.NaN is equal to itself, unlike in numeric equality.
    /// Note that double values can acquire error when operated upon, such that 
    /// an exact comparison between two values which
    /// are logically equal may fail. 
    /// </summary> 
    /// <returns>
    /// bool - true if the two Point instances are exactly equal, false otherwise 
    /// </returns>
    /// <param name='point1'>The first Point to compare</param>
    /// <param name='point2'>The second Point to compare</param>
//    public static bool 
	Point.Equals = function (/*Point*/ point1, /*Point*/ point2) 
    {
        return point1.X.Equals(point2.X) && 
               point1.Y.Equals(point2.Y); 
    };
    

    /// <summary>
    /// Add: Point + Vector
    /// </summary> 
    /// <returns>
    /// Point - The result of the addition 
    /// </returns> 
    /// <param name="point"> The Point to be added to the Vector </param>
    /// <param name="vector"> The Vector to be added to the Point </param> 
//    public static Point 
    Point.Add = function(/*Point*/ point, /*Vector*/ vector)
    {
        return new Point(point._x + vector._x, point._y + vector._y);
    }; 

    /// <summary>
    /// Subtract: Point - Vector
    /// </summary>
    /// <returns> 
    /// Point - The result of the subtraction
    /// </returns> 
    /// <param name="point"> The Point from which the Vector is subtracted </param> 
    /// <param name="vector"> The Vector which is subtracted from the Point </param>
//    public static Point 
    Point.Subtract = function(/*Point*/ point, /*Vector*/ vector) 
    {
        return new Point(point._x - vector._x, point._y - vector._y);
    };

    /// <summary> 
    /// Subtract: Point - Point
    /// </summary>
    /// <returns>
    /// Vector - The result of the subtraction 
    /// </returns>
    /// <param name="point1"> The Point from which point2 is subtracted </param> 
    /// <param name="point2"> The Point subtracted from point1 </param> 
//    public static Vector 
    Point.Subtract = function(/*Point*/ point1, /*Point*/ point2)
    { 
        return new Vector(point1._x - point2._x, point1._y - point2._y);
    };

    /// <summary>
    /// Multiply: Point * Matrix 
    /// </summary>
//    public static Point 
    Point.Multiply = function(/*Point*/ point, /*Matrix*/ matrix) 
    { 
        return matrix.Transform(point);
    }; 
	
	Point.Type = new Type("Point", Point, [IFormattable.Type]);
	return Point;
});




