/**
 * DoubleUtil
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
    // Const values come from sdk\inc\crt\float.h
//    internal const double 
	var DBL_EPSILON  =   2.2204460492503131e-016; /* smallest such that 1.0+DBL_EPSILON != 1.0 */
//    internal const float  
	var FLT_MIN      =   1.175494351e-38/*F*/; /* Number close to zero, where float.MinValue is -float.MaxValue */ 
    
	var DoubleUtil = declare("DoubleUtil", Object,{
		constructor:function(){
		}
	});
	
    /// <summary> 
    /// LessThan - Returns whether or not the first double is less than the second double.
    /// That is, whether or not the first is strictly less than *and* not within epsilon of 
    /// the other number.  Note that this epsilon is proportional to the numbers themselves 
    /// to that AreClose survives scalar multiplication.  Note,
    /// There are plenty of ways for this to return false even for numbers which 
    /// are theoretically identical, so no code calling this should fail to work if this
    /// returns false.  This is important enough to repeat:
    /// NB: NO CODE CALLING THIS FUNCTION SHOULD DEPEND ON ACCURATE RESULTS - this should be
    /// used for optimizations *only*. 
    /// </summary>
    /// <returns> 
    /// bool - the result of the LessThan comparision. 
    /// </returns>
    /// <param name="value1"> The first double to compare. </param> 
    /// <param name="value2"> The second double to compare. </param>
//    public static bool 
    DoubleUtil.LessThan = function(/*double*/ value1, /*double*/ value2)
    {
        return (value1 < value2) && !DoubleUtil.AreClose(value1, value2); 
    };


    /// <summary>
    /// GreaterThan - Returns whether or not the first double is greater than the second double. 
    /// That is, whether or not the first is strictly greater than *and* not within epsilon of
    /// the other number.  Note that this epsilon is proportional to the numbers themselves
    /// to that AreClose survives scalar multiplication.  Note,
    /// There are plenty of ways for this to return false even for numbers which 
    /// are theoretically identical, so no code calling this should fail to work if this
    /// returns false.  This is important enough to repeat: 
    /// NB: NO CODE CALLING THIS FUNCTION SHOULD DEPEND ON ACCURATE RESULTS - this should be 
    /// used for optimizations *only*.
    /// </summary> 
    /// <returns>
    /// bool - the result of the GreaterThan comparision.
    /// </returns>
    /// <param name="value1"> The first double to compare. </param> 
    /// <param name="value2"> The second double to compare. </param>
//    public static bool 
    DoubleUtil.GreaterThan = function(/*double*/ value1, /*double*/ value2) 
    { 
        return (value1 > value2) && !DoubleUtil.AreClose(value1, value2);
    }; 

    /// <summary>
    /// LessThanOrClose - Returns whether or not the first double is less than or close to
    /// the second double.  That is, whether or not the first is strictly less than or within 
    /// epsilon of the other number.  Note that this epsilon is proportional to the numbers
    /// themselves to that AreClose survives scalar multiplication.  Note, 
    /// There are plenty of ways for this to return false even for numbers which 
    /// are theoretically identical, so no code calling this should fail to work if this
    /// returns false.  This is important enough to repeat: 
    /// NB: NO CODE CALLING THIS FUNCTION SHOULD DEPEND ON ACCURATE RESULTS - this should be
    /// used for optimizations *only*.
    /// </summary>
    /// <returns> 
    /// bool - the result of the LessThanOrClose comparision.
    /// </returns> 
    /// <param name="value1"> The first double to compare. </param> 
    /// <param name="value2"> The second double to compare. </param>
//    public static bool 
    DoubleUtil.LessThanOrClose = function(/*double*/ value1, /*double*/ value2) 
    {
        return (value1 < value2) || DoubleUtil.AreClose(value1, value2);
    };

    /// <summary>
    /// GreaterThanOrClose - Returns whether or not the first double is greater than or close to 
    /// the second double.  That is, whether or not the first is strictly greater than or within 
    /// epsilon of the other number.  Note that this epsilon is proportional to the numbers
    /// themselves to that AreClose survives scalar multiplication.  Note, 
    /// There are plenty of ways for this to return false even for numbers which
    /// are theoretically identical, so no code calling this should fail to work if this
    /// returns false.  This is important enough to repeat:
    /// NB: NO CODE CALLING THIS FUNCTION SHOULD DEPEND ON ACCURATE RESULTS - this should be 
    /// used for optimizations *only*.
    /// </summary> 
    /// <returns> 
    /// bool - the result of the GreaterThanOrClose comparision.
    /// </returns> 
    /// <param name="value1"> The first double to compare. </param>
    /// <param name="value2"> The second double to compare. </param>
//    public static bool 
    DoubleUtil.GreaterThanOrClose = function(/*double*/ value1, /*double*/ value2)
    { 
        return (value1 > value2) || DoubleUtil.AreClose(value1, value2);
    };

    /// <summary>
    /// IsOne - Returns whether or not the double is "close" to 1.  Same as AreClose(double, 1), 
    /// but this is faster.
    /// </summary>
    /// <returns>
    /// bool - the result of the AreClose comparision. 
    /// </returns>
    /// <param name="value"> The double to compare to 1. </param> 
//    public static bool 
    DoubleUtil.IsOne = function(/*double*/ value) 
    {
        return Math.abs(value-1.0) < 10.0 * DBL_EPSILON; 
    };

    /// <summary>
    /// IsZero - Returns whether or not the double is "close" to 0.  Same as AreClose(double, 0), 
    /// but this is faster.
    /// </summary> 
    /// <returns> 
    /// bool - the result of the AreClose comparision.
    /// </returns> 
    /// <param name="value"> The double to compare to 0. </param>
//    public static bool 
    DoubleUtil.IsZero = function(/*double*/ value)
    {
        return Math.abs(value) < 10.0 * DBL_EPSILON; 
    };
    
//    /// <summary> 
//    /// AreClose - Returns whether or not two doubles are "close".  That is, whether or 
//    /// not they are within epsilon of each other.  Note that this epsilon is proportional
//    /// to the numbers themselves to that AreClose survives scalar multiplication. 
//    /// There are plenty of ways for this to return false even for numbers which
//    /// are theoretically identical, so no code calling this should fail to work if this
//    /// returns false.  This is important enough to repeat:
//    /// NB: NO CODE CALLING THIS FUNCTION SHOULD DEPEND ON ACCURATE RESULTS - this should be 
//    /// used for optimizations *only*.
//    /// </summary> 
//    /// <returns> 
//    /// bool - the result of the AreClose comparision.
//    /// </returns> 
//    /// <param name="value1"> The first double to compare. </param>
//    /// <param name="value2"> The second double to compare. </param>
////    public static bool 
//	DoubleUtil.AreClose = function(/*double*/ value1, /*double*/ value2)
//    { 
//        //in case they are Infinities (then epsilon check does not work)
//        if(value1 == value2) return true; 
//        // This computes (|value1-value2| / (|value1| + |value2| + 10.0)) < DBL_EPSILON 
//        var eps = (Math.abs(value1) + Math.abs(value2) + 10.0) * DBL_EPSILON;
//        var delta = value1 - value2; 
//        return(-eps < delta) && (eps > delta);
//    };
//
//    // The Point, Size, Rect and Matrix class have moved to WinCorLib.  However, we provide 
//    // internal AreClose methods for our own use here.
//
//    /// <summary>
//    /// Compares two points for fuzzy equality.  This function
//    /// helps compensate for the fact that double values can
//    /// acquire error when operated upon 
//    /// </summary>
//    /// <param name='point1'>The first point to compare</param> 
//    /// <param name='point2'>The second point to compare</param> 
//    /// <returns>Whether or not the two points are equal</returns>
////    public static bool 
//    DoubleUtil.AreClose = function(/*Point*/ point1, /*Point*/ point2) 
//    {
//        return DoubleUtil.AreClose(point1.X, point2.X) &&
//        DoubleUtil.AreClose(point1.Y, point2.Y);
//    }; 
//
//    /// <summary> 
//    /// Compares two Size instances for fuzzy equality.  This function 
//    /// helps compensate for the fact that double values can
//    /// acquire error when operated upon 
//    /// </summary>
//    /// <param name='size1'>The first size to compare</param>
//    /// <param name='size2'>The second size to compare</param>
//    /// <returns>Whether or not the two Size instances are equal</returns> 
////    public static bool 
//    DoubleUtil.AreClose = function(/*Size*/ size1, /*Size*/ size2)
//    { 
//        return DoubleUtil.AreClose(size1.Width, size2.Width) && 
//               DoubleUtil.AreClose(size1.Height, size2.Height);
//    };
//
//    /// <summary>
//    /// Compares two Vector instances for fuzzy equality.  This function
//    /// helps compensate for the fact that double values can 
//    /// acquire error when operated upon
//    /// </summary> 
//    /// <param name='vector1'>The first Vector to compare</param> 
//    /// <param name='vector2'>The second Vector to compare</param>
//    /// <returns>Whether or not the two Vector instances are equal</returns> 
////    public static bool 
//    DoubleUtil.AreClose = function(/*System.Windows.Vector*/ vector1, /*System.Windows.Vector*/ vector2)
//    {
//        return DoubleUtil.AreClose(vector1.X, vector2.X) &&
//               DoubleUtil.AreClose(vector1.Y, vector2.Y); 
//    };
//
//    /// <summary> 
//    /// Compares two rectangles for fuzzy equality.  This function
//    /// helps compensate for the fact that double values can 
//    /// acquire error when operated upon
//    /// </summary>
//    /// <param name='rect1'>The first rectangle to compare</param>
//    /// <param name='rect2'>The second rectangle to compare</param> 
//    /// <returns>Whether or not the two rectangles are equal</returns>
////    public static bool 
//    DoubleUtil.AreClose = function(/*Rect*/ rect1, /*Rect*/ rect2) 
//    { 
//        // If they're both empty, don't bother with the double logic.
//        if (rect1.IsEmpty) 
//        {
//            return rect2.IsEmpty;
//        }
//
//        // At this point, rect1 isn't empty, so the first thing we can test is
//        // rect2.IsEmpty, followed by property-wise compares. 
//
//        return (!rect2.IsEmpty) &&
//            DoubleUtil.AreClose(rect1.X, rect2.X) && 
//            DoubleUtil.AreClose(rect1.Y, rect2.Y) &&
//            DoubleUtil.AreClose(rect1.Height, rect2.Height) &&
//            DoubleUtil.AreClose(rect1.Width, rect2.Width);
//    }; 
    
    /// <summary> 
    /// AreClose - Returns whether or not two doubles are "close".  That is, whether or 
    /// not they are within epsilon of each other.  Note that this epsilon is proportional
    /// to the numbers themselves to that AreClose survives scalar multiplication. 
    /// There are plenty of ways for this to return false even for numbers which
    /// are theoretically identical, so no code calling this should fail to work if this
    /// returns false.  This is important enough to repeat:
    /// NB: NO CODE CALLING THIS FUNCTION SHOULD DEPEND ON ACCURATE RESULTS - this should be 
    /// used for optimizations *only*.
    /// </summary> 
    /// <returns> 
    /// bool - the result of the AreClose comparision.
    /// </returns> 
    /// <param name="value1"> The first double to compare. </param>
    /// <param name="value2"> The second double to compare. </param>
//    public static bool 
	DoubleUtil.AreClose = function(/*double*/ value1, /*double*/ value2)
    { 

    };

    // The Point, Size, Rect and Matrix class have moved to WinCorLib.  However, we provide 
    // internal AreClose methods for our own use here.

    /// <summary>
    /// Compares two points for fuzzy equality.  This function
    /// helps compensate for the fact that double values can
    /// acquire error when operated upon 
    /// </summary>
    /// <param name='point1'>The first point to compare</param> 
    /// <param name='point2'>The second point to compare</param> 
    /// <returns>Whether or not the two points are equal</returns>
//    public static bool 
    DoubleUtil.AreClose = function(/*Point*/ point1, /*Point*/ point2) 
    {
        return DoubleUtil.AreClose(point1.X, point2.X) &&
        DoubleUtil.AreClose(point1.Y, point2.Y);
    }; 

    /// <summary> 
    /// Compares two Size instances for fuzzy equality.  This function 
    /// helps compensate for the fact that double values can
    /// acquire error when operated upon 
    /// </summary>
    /// <param name='size1'>The first size to compare</param>
    /// <param name='size2'>The second size to compare</param>
    /// <returns>Whether or not the two Size instances are equal</returns> 
//    public static bool 
    DoubleUtil.AreClose = function(/*Size*/ size1, /*Size*/ size2)
    { 
        return DoubleUtil.AreClose(size1.Width, size2.Width) && 
               DoubleUtil.AreClose(size1.Height, size2.Height);
    };

    /// <summary>
    /// Compares two Vector instances for fuzzy equality.  This function
    /// helps compensate for the fact that double values can 
    /// acquire error when operated upon
    /// </summary> 
    /// <param name='vector1'>The first Vector to compare</param> 
    /// <param name='vector2'>The second Vector to compare</param>
    /// <returns>Whether or not the two Vector instances are equal</returns> 
//    public static bool 
    DoubleUtil.AreClose = function(/*System.Windows.Vector*/ vector1, /*System.Windows.Vector*/ vector2)
    {
        return DoubleUtil.AreClose(vector1.X, vector2.X) &&
               DoubleUtil.AreClose(vector1.Y, vector2.Y); 
    };

    /// <summary> 
    /// Compares two rectangles for fuzzy equality.  This function
    /// helps compensate for the fact that double values can 
    /// acquire error when operated upon
    /// </summary>
    /// <param name='rect1'>The first rectangle to compare</param>
    /// <param name='rect2'>The second rectangle to compare</param> 
    /// <returns>Whether or not the two rectangles are equal</returns>
//    public static bool 
    DoubleUtil.AreClose = function(/*Rect*/ rect1, /*Rect*/ rect2) 
    { 
    	if(rect1 instanceof Rect){
            // If they're both empty, don't bother with the double logic.
            if (rect1.IsEmpty) 
            {
                return rect2.IsEmpty;
            }

            // At this point, rect1 isn't empty, so the first thing we can test is
            // rect2.IsEmpty, followed by property-wise compares. 

            return (!rect2.IsEmpty) &&
                DoubleUtil.AreClose(rect1.X, rect2.X) && 
                DoubleUtil.AreClose(rect1.Y, rect2.Y) &&
                DoubleUtil.AreClose(rect1.Height, rect2.Height) &&
                DoubleUtil.AreClose(rect1.Width, rect2.Width);
    	}else if(typeof rect1 == "number"){
    		var  value1 = rect1, value2 = rect2;
            //in case they are Infinities (then epsilon check does not work)
            if(value1 == value2) return true; 
            // This computes (|value1-value2| / (|value1| + |value2| + 10.0)) < DBL_EPSILON 
            var eps = (Math.abs(value1) + Math.abs(value2) + 10.0) * DBL_EPSILON;
            var delta = value1 - value2; 
            return(-eps < delta) && (eps > delta);
    	}else if (rect1 instanceof Size){
    		var  size1 = rect1, size2 = rect2;
	        return DoubleUtil.AreClose(size1.Width, size2.Width) && 
	               DoubleUtil.AreClose(size1.Height, size2.Height);
    	}else if (rect1 instanceof Point){
    		var  point1 = rect1, point2 = rect2;
            return DoubleUtil.AreClose(point1.X, point2.X) &&
            DoubleUtil.AreClose(point1.Y, point2.Y);
    	}else if (rect1 instanceof Vector){
    		var  vector1 = rect1, vector2 = rect2;
            return DoubleUtil.AreClose(vector1.X, vector2.X) &&
            DoubleUtil.AreClose(vector1.Y, vector2.Y); 
    	}

    };

    /// <summary> 
    /// 
    /// </summary>
    /// <param name="val"></param> 
    /// <returns></returns>
//    public static bool 
    DoubleUtil.IsBetweenZeroAndOne = function(/*double*/ val)
    {
        return (DoubleUtil.GreaterThanOrClose(val, 0) && DoubleUtil.LessThanOrClose(val, 1)); 
    };

    /// <summary> 
    ///
    /// </summary> 
    /// <param name="val"></param>
    /// <returns></returns>
//    public static int 
    DoubleUtil.DoubleToInt = function(/*double*/ val)
    { 
        return (0 < val) ? Math.round(val + 0.5) : Math.round(val - 0.5);
    };


    /// <summary> 
    /// rectHasNaN - this returns true if this rect has X, Y , Height or Width as NaN.
    /// </summary>
    /// <param name='r'>The rectangle to test</param>
    /// <returns>returns whether the Rect has NaN</returns> 
//    public static bool 
    DoubleUtil.RectHasNaN = function(/*Rect*/ r)
    { 
        if (    DoubleUtil.IsNaN(r.X) 
             || DoubleUtil.IsNaN(r.Y)
             || DoubleUtil.IsNaN(r.Height) 
             || DoubleUtil.IsNaN(r.Width) )
        {
            return true;
        } 
        return false;
    }; 
	
	DoubleUtil.Type = new Type("DoubleUtil", DoubleUtil, [Object.Type]);
	return DoubleUtil;
});
