/**
 * Thickness
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
//	internal const double 
	var DBL_EPSILON  =   2.2204460492503131e-016; /* smallest such that 1.0+DBL_EPSILON != 1.0 */
	var Thickness = declare("Thickness", null,{
		constructor:function(/*double*/ left, /*double*/ top, /*double*/ right, /*double*/ bottom){
			if(arguments.length == 1){
				this._Left = this._Top = this._Right = this._Bottom = left; 
			}else if(arguments.length ==4) {
				this._Left = left; 
				this._Top = top;
				this._Right = right; 
				this._Bottom = bottom;
			}else if(arguments.length==0){
				this._Left = 0; 
				this._Top = 0;
				this._Right = 0; 
				this._Bottom = 0;
			}
		},
		
        /// <summary> 
        /// This function compares to the provided object for type and value equality.
        /// </summary> 
        /// <param name="obj">Object to compare</param>
        /// <returns>True if object is a Thickness and all sides of it are equal to this Thickness'.</returns>
//        public override bool 
        Equals:function(/*object*/ obj)
        { 
            if (obj instanceof Thickness)
            { 
                /*Thickness*/var otherObj = obj; 
                return (this == otherObj);
            } 
            return (false);
        },
        
        /// <summary> 
        /// This function returns a hash code. 
        /// </summary>
        /// <returns>Hash code</returns> 
//        public override int 
        GetHashCode:function()
        {
            return this.Left.GetHashCode() ^ this.Top.GetHashCode() ^ this.Right.GetHashCode() ^ this.Bottom.GetHashCode();
        }, 
        
        /// <summary> 
        /// Compares two thicknesses for fuzzy equality.  This function 
        /// helps compensate for the fact that double values can
        /// acquire error when operated upon 
        /// </summary>
        /// <param name='thickness'>The thickness to compare to this</param>
        /// <returns>Whether or not the two points are equal</returns>
//        internal bool 
        IsClose:function(/*Thickness*/ thickness) 
        {
            return (    DoubleUtil.AreClose(this.Left, thickness.Left) 
                    &&  DoubleUtil.AreClose(this.Top, thickness.Top) 
                    &&  DoubleUtil.AreClose(this.Right, thickness.Right)
                    &&  DoubleUtil.AreClose(this.Bottom, thickness.Bottom)); 
        },

        /// <summary> 
        /// Verifies if this Thickness contains only valid values
        /// The set of validity checks is passed as parameters.
        /// </summary>
        /// <param name='allowNegative'>allows negative values</param> 
        /// <param name='allowNaN'>allows Double.NaN</param>
        /// <param name='allowPositiveInfinity'>allows Double.PositiveInfinity</param> 
        /// <param name='allowNegativeInfinity'>allows Double.NegativeInfinity</param> 
        /// <returns>Whether or not the thickness complies to the range specified</returns>
//        internal bool 
        IsValid:function(/*bool*/ allowNegative, /*bool*/ allowNaN, /*bool*/ allowPositiveInfinity, /*bool*/ allowNegativeInfinity) 
        {
        	if(!allowNegative)
        	{
        		if(this.Left < 0 || this.Right < 0 || this.Top < 0 || this.Bottom < 0) 
	            	  return false;
        	} 

//        	if(!allowNaN)
//        	{ 
//        		if(DoubleUtil.IsNaN(Left) || DoubleUtil.IsNaN(Right) || DoubleUtil.IsNaN(Top) || DoubleUtil.IsNaN(Bottom))
//        			return false;
//        	}
//
//        	if(!allowPositiveInfinity)
//        	{ 
//        		if(Double.IsPositiveInfinity(Left) || Double.IsPositiveInfinity(Right) || Double.IsPositiveInfinity(Top) || Double.IsPositiveInfinity(Bottom)) 
//        		{
//        			return false; 
//        		}
//        	}
//
//        	if(!allowNegativeInfinity) 
//        	{
//        		if(Double.IsNegativeInfinity(Left) || Double.IsNegativeInfinity(Right) || Double.IsNegativeInfinity(Top) || Double.IsNegativeInfinity(Bottom)) 
//        		{ 
//        			return false;
//        		} 
//        	}

         	return true;
        } 

	});
	
	
	
	Object.defineProperties(Thickness.prototype,{
//        internal bool 
        IsZero: 
        { 
            get:function()
            { 
                return      DoubleUtil.IsZero(this.Left)
                        &&  DoubleUtil.IsZero(this.Top)
                        &&  DoubleUtil.IsZero(this.Right)
                        &&  DoubleUtil.IsZero(this.Bottom); 
            }
        },
 
//        internal bool 
        IsUniform:
        { 
            get:function()
            {
                return     DoubleUtil.AreClose(this.Left, this.Top)
                        && DoubleUtil.AreClose(this.Left, this.Right) 
                        && DoubleUtil.AreClose(this.Left, this.Bottom);
            } 
        },
        
        /// <summary>This property is the Length on the thickness' left side</summary>
//        public double 
        Left:
        {
            get:function() { return this._Left; }, 
            set:function(value) { this._Left = value; } 
        },
 
        /// <summary>This property is the Length on the thickness' top side</summary>
//        public double 
        Top:
        {
            get:function() { return this._Top; }, 
            set:function(value) { this._Top = value; }
        }, 
 
        /// <summary>This property is the Length on the thickness' right side</summary>
//        public double 
        Right:
        {
            get:function() { return this._Right; },
            set:function(value) { this._Right = value; }
        }, 

        /// <summary>This property is the Length on the thickness' bottom side</summary> 
//        public double 
        Bottom: 
        {
            get:function() { return this._Bottom; }, 
            set:function(value) { this._Bottom = value; }
        },

//        internal Size 
        Size:
        {
            get:function()
            { 
                return new Size(this._Left + this._Right, this._Top + this._Bottom);
            } 
        }
	});
	
    /// <summary>
    /// Compares two thicknesses for fuzzy equality.  This function 
    /// helps compensate for the fact that double values can
    /// acquire error when operated upon 
    /// </summary> 
    /// <param name='thickness0'>The first thickness to compare</param>
    /// <param name='thickness1'>The second thickness to compare</param> 
    /// <returns>Whether or not the two thicknesses are equal</returns>
//    static internal bool 
	Thickness.AreClose = function(/*Thickness*/ thickness0, /*Thickness*/ thickness1)
    {
        return thickness0.IsClose(thickness1); 
    };
    
	
	Thickness.Type = new Type("Thickness", Thickness, [Object.Type]);
	return Thickness;
});




 



