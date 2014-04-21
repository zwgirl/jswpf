/**
 * FontStyle
 */

define(["dojo/_base/declare", "system/Type", "system/IFormattable"], 
		function(declare, Type, IFormattable){
	var FontStyle = declare("FontStyle", IFormattable,{
		constructor:function(/*int*/ style) 
        { 
//            Debug.Assert(0 <= style && style <= 2);
 
            this._style = style;
        },
        

        /// <summary>
        /// Checks whether an object is equal to another character hit object. 
        /// </summary>
        /// <param name="obj">FontStyle object to compare with.</param> 
        /// <returns>Returns true when the object is equal to the input object, 
        /// and false otherwise.</returns>
//        public override bool 
        Equals:function(/*object*/ obj) 
        {
            if (!(obj instanceof FontStyle))
                return false;
            return this == obj; 
        },
 
        /// <summary> 
        /// Compute hash code for this object.
        /// </summary> 
        /// <returns>A 32-bit signed integer hash code.</returns>
//        public override int 
        GetHashCode:function()
        {
            return this._style; 
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
            return this.ConvertToString(null, null); 
        },
 
        /// <summary> 
        /// This method is used only in type converter for construction via reflection.
        /// </summary> 
        /// <returns>THe value of _style member.</returns>
//        internal int 
        GetStyleForInternalConstruction:function()
        {
//            Debug.Assert(0 <= _style && _style <= 2); 
            return this._style;
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
//        private string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
        { 
            if (this._style == 0)
                return "normal";
            if (this._style == 1)
                return "oblique"; 
//            Debug.Assert(_style == 2);
            return "italic"; 
        } 
	});
	
	FontStyle.Type = new Type("FontStyle", FontStyle, [IFormattable.Type]);
	return FontStyle;
});



