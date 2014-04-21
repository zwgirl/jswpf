/**
 * GridLength
 */

define(["dojo/_base/declare", "system/Type", "system/IEquatable", "windows/GridUnitType"], 
		function(declare, Type, IEquatable, GridUnitType){

	var GridLength = declare("GridLength", IEquatable,{
		constructor:function(/*double*/ value, /*GridUnitType*/ type)
        { 
			if(type === undefined){
				type = GridUnitType.Pixel;
			}
            if (Number.NaN === value)
            { 
                throw new ArgumentException(SR.Get(SRID.InvalidCtorParameterNoNaN, "value")); 
            }
            if (Number.Infinity ===value) 
            {
                throw new ArgumentException(SR.Get(SRID.InvalidCtorParameterNoInfinity, "value"));
            }
            if (    type != GridUnitType.Auto 
                &&  type != GridUnitType.Pixel
                &&  type != GridUnitType.Star   ) 
            { 
                throw new ArgumentException(SR.Get(SRID.InvalidCtorParameterUnknownGridUnitType, "type"));
            } 

            this._unitValue = (type == GridUnitType.Auto) ? 0.0 : value;
            this._unitType = type;
        },
        
        /// <summary> 
        /// Compares this instance of GridLength with another object. 
        /// </summary>
        /// <param name="oCompare">Reference to an object for comparison.</param> 
        /// <returns><c>true</c>if this GridLength instance has the same value
        /// and unit type as oCompare.</returns>
//        override public bool 
        Equals:function(/*object*/ oCompare)
        { 
            if(oCompare instanceof GridLength)
            { 
                return (this == l);
            } 
            else
                return false;
        },
 
        /// <summary> 
        /// <see cref="Object.GetHashCode"/>
        /// </summary> 
        /// <returns><see cref="Object.GetHashCode"/></returns>
//        public override int 
        GetHashCode:function()
        {
            return _unitValue + _unitType; 
        }
	});
	
	Object.defineProperties(GridLength.prototype,{
		  /// <summary> 
        /// Returns <c>true</c> if this GridLength instance holds
        /// an absolute (pixel) value. 
        /// </summary>
//        public bool 
		IsAbsolute: { get:function() { return (this._unitType == GridUnitType.Pixel); } },

        /// <summary> 
        /// Returns <c>true</c> if this GridLength instance is
        /// automatic (not specified). 
        /// </summary> 
//        public bool 
		IsAuto: { get:function() { return (this._unitType == GridUnitType.Auto); } },
 
        /// <summary>
        /// Returns <c>true</c> if this GridLength instance holds weighted propertion
        /// of available space.
        /// </summary> 
//        public bool 
		IsStar: { get:function() { return (this._unitType == GridUnitType.Star); } },
 
        /// <summary> 
        /// Returns value part of this GridLength instance.
        /// </summary> 
//        public double 
		Value: { get:function() { return ((this._unitType == GridUnitType.Auto) ? 1.0 : this._unitValue); } },

        /// <summary>
        /// Returns unit type of this GridLength instance. 
        /// </summary>
//        public GridUnitType
		GridUnitType: { get:function() { return this._unitType; } } 	  
	});
	
	Object.defineProperties(GridLength,{
        /// <summary>
        /// Returns initialized Auto GridLength value. 
        /// </summary>
//        public static GridLength 
		Auto:
        {
            get:function() { return (s_auto); } 
        }		  
	});
	
//  static instance of Auto GridLength
//  private static readonly GridLength 
	var s_auto = new GridLength(1.0, GridUnitType.Auto);
	
	GridLength.Type = new Type("GridLength", GridLength, [IEquatable.Type]);
	return GridLength;
});
 
//        /// Returns the string representation of this object. 
//        /// </summary>
//        public override string ToString()
//        {
//            return GridLengthConverter.ToString(this, CultureInfo.InvariantCulture); 
//        }
//
//
//        private double _unitValue;      //  unit value storage 
//        private GridUnitType _unitType; //  unit type storage
 
        
