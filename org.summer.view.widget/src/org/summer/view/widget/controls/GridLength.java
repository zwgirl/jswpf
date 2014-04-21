package org.summer.view.widget.controls;
    /// <summary> 
    /// GridLength is the type used for various length-like properties in the system,
    /// that explicitely support Star unit type. For example, "Width", "Height"
    /// properties of ColumnDefinition and RowDefinition used by Grid.
    /// </summary> 
//    [TypeConverter(typeof(GridLengthConverter))]
    public class GridLength implements IEquatable<GridLength> 
    { 
        //-----------------------------------------------------
        // 
        //  Constructors
        //
        //-----------------------------------------------------
 
//        #region Constructors
 
        /// <summary> 
        /// Constructor, initializes the GridLength as absolute value in pixels.
        /// </summary> 
        /// <param name="pixels">Specifies the number of 'device-independent pixels'
        /// (96 pixels-per-inch).</param>
        /// <exception cref="ArgumentException">
        /// If <c>pixels</c> parameter is <c>double.NaN</c> 
        /// or <c>pixels</c> parameter is <c>double.NegativeInfinity</c>
        /// or <c>pixels</c> parameter is <c>double.PositiveInfinity</c>. 
        /// </exception> 
        public GridLength(double pixels)
        {
        	super(pixels, GridUnitType.Pixel) ;
        }

        /// <summary> 
        /// Constructor, initializes the GridLength and specifies what kind of value
        /// it will hold. 
        /// </summary> 
        /// <param name="value">Value to be stored by this GridLength
        /// instance.</param> 
        /// <param name="type">Type of the value to be stored by this GridLength
        /// instance.</param>
        /// <remarks>
        /// If the <c>type</c> parameter is <c>GridUnitType.Auto</c>, 
        /// then passed in value is ignored and replaced with <c>0</c>.
        /// </remarks> 
        /// <exception cref="ArgumentException"> 
        /// If <c>value</c> parameter is <c>double.NaN</c>
        /// or <c>value</c> parameter is <c>double.NegativeInfinity</c> 
        /// or <c>value</c> parameter is <c>double.PositiveInfinity</c>.
        /// </exception>
        public GridLength(double value, GridUnitType type)
        { 
            if (DoubleUtil.IsNaN(value))
            { 
                throw new ArgumentException(SR.Get(SRID.InvalidCtorParameterNoNaN, "value")); 
            }
            if (double.IsInfinity(value)) 
            {
                throw new ArgumentException(SR.Get(SRID.InvalidCtorParameterNoInfinity, "value"));
            }
            if (    type != GridUnitType.Auto 
                &&  type != GridUnitType.Pixel
                &&  type != GridUnitType.Star   ) 
            { 
                throw new ArgumentException(SR.Get(SRID.InvalidCtorParameterUnknownGridUnitType, "type"));
            } 

            _unitValue = (type == GridUnitType.Auto) ? 0.0 : value;
            _unitType = type;
        } 

//        #endregion Constructors 
 
        //------------------------------------------------------
        // 
        //  Public Methods
        //
        //-----------------------------------------------------
 
//        #region Public Methods
 
        /// <summary> 
        /// Overloaded operator, compares 2 GridLength's.
        /// </summary> 
        /// <param name="gl1">first GridLength to compare.</param>
        /// <param name="gl2">second GridLength to compare.</param>
        /// <returns>true if specified GridLengths have same value
        /// and unit type.</returns> 
        public static boolean operator == (GridLength gl1, GridLength gl2)
        { 
            return (    gl1.GridUnitType == gl2.GridUnitType 
                    &&  gl1.Value == gl2.Value  );
        } 

        /// <summary>
        /// Overloaded operator, compares 2 GridLength's.
        /// </summary> 
        /// <param name="gl1">first GridLength to compare.</param>
        /// <param name="gl2">second GridLength to compare.</param> 
        /// <returns>true if specified GridLengths have either different value or 
        /// unit type.</returns>
        public static boolean operator != (GridLength gl1, GridLength gl2) 
        {
            return (    gl1.GridUnitType != gl2.GridUnitType
                    ||  gl1.Value != gl2.Value  );
        } 

        /// <summary> 
        /// Compares this instance of GridLength with another Object. 
        /// </summary>
        /// <param name="oCompare">Reference to an Object for comparison.</param> 
        /// <returns><c>true</c>if this GridLength instance has the same value
        /// and unit type as oCompare.</returns>
        /*override*/ public boolean Equals(Object oCompare)
        { 
            if(oCompare is GridLength)
            { 
                GridLength l = (GridLength)oCompare; 
                return (this == l);
            } 
            else
                return false;
        }
 
        /// <summary>
        /// Compares this instance of GridLength with another instance. 
        /// </summary> 
        /// <param name="gridLength">Grid length instance to compare.</param>
        /// <returns><c>true</c>if this GridLength instance has the same value 
        /// and unit type as gridLength.</returns>
        public boolean Equals(GridLength gridLength)
        {
            return (this == gridLength); 
        }
 
        /// <summary> 
        /// <see cref="Object.GetHashCode"/>
        /// </summary> 
        /// <returns><see cref="Object.GetHashCode"/></returns>
        public /*override*/ int GetHashCode()
        {
            return ((int)_unitValue + (int)_unitType); 
        }
 
        /// <summary> 
        /// Returns <c>true</c> if this GridLength instance holds
        /// an absolute (pixel) value. 
        /// </summary>
        public boolean IsAbsolute { get { return (_unitType == GridUnitType.Pixel); } }

        /// <summary> 
        /// Returns <c>true</c> if this GridLength instance is
        /// automatic (not specified). 
        /// </summary> 
        public boolean IsAuto { get { return (_unitType == GridUnitType.Auto); } }
 
        /// <summary>
        /// Returns <c>true</c> if this GridLength instance holds weighted propertion
        /// of available space.
        /// </summary> 
        public boolean IsStar { get { return (_unitType == GridUnitType.Star); } }
 
        /// <summary> 
        /// Returns value part of this GridLength instance.
        /// </summary> 
        public double Value { get { return ((_unitType == GridUnitType.Auto) ? 1.0 : _unitValue); } }

        /// <summary>
        /// Returns unit type of this GridLength instance. 
        /// </summary>
        public GridUnitType GridUnitType { get { return (_unitType); } } 
 
        /// <summary>
        /// Returns the string representation of this Object. 
        /// </summary>
        public /*override*/ String ToString()
        {
            return GridLengthConverter.ToString(this, CultureInfo.InvariantCulture); 
        }
 
//        #endregion Public Methods 

        //------------------------------------------------------ 
        //
        //  Public Properties
        //
        //------------------------------------------------------ 

//        #region Public Properties 
 
        /// <summary>
        /// Returns initialized Auto GridLength value. 
        /// </summary>
        public static GridLength Auto
        {
            get { return (s_auto); } 
        }
 
//        #endregion Public Properties 

        //----------------------------------------------------- 
        //
        //  Private Fields
        //
        //------------------------------------------------------ 

//        #region Private Fields 
        private double _unitValue;      //  unit value storage 
        private GridUnitType _unitType; //  unit type storage
 
        //  static instance of Auto GridLength
        private static final GridLength s_auto = new GridLength(1.0, GridUnitType.Auto);
//        #endregion Private Fields
    } 