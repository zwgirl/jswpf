/**
 * FontStretch
 */

define(["dojo/_base/declare", "system/Type", "system/IFormattable"], 
		function(declare, Type, IFormattable){
	var FontStretch = declare("FontStretch", IFormattable,{
		constructor:function(/*int*/ stretch)
        { 
//            Debug.Assert(1 <= stretch && stretch <= 9);
 
            // We want the default zero value of new FontStretch() to correspond to FontStretches.Normal. 
            // Therefore, the _stretch value is shifted by 5 relative to the OpenType stretch value.
            this._stretch = stretch; 
        },

        /// <summary> 
        /// Checks whether an object is equal to another character hit object. 
        /// </summary>
        /// <param name="obj">FontStretch object to compare with.</param> 
        /// <returns>Returns true when the object is equal to the input object,
        /// and false otherwise.</returns>
//        public override bool 
        Equals:function(/*object*/ obj)
        { 
            if (!(obj instanceof FontStretch))
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
            return this.RealStretch; 
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
        	switch (this._stretch)
            {
            case 1:
                return "UltraCondensed"; 
            case 2: 
                return "ExtraCondensed"; 
            case 3: 
                return "Condensed";
            case 4:
                return "SemiCondensed"; 
            case 5: 
                return "Normal"; 
            case 6: 
                return "SemiExpanded";
            case 7:
                return "Expanded"; 
            case 8: 
                return "ExtraExpanded"; 
            case 9: 
                return "UltraExpanded";
            }
        }
	});
	
	
	FontStretch.Type = new Type("FontStretch", FontStretch, [IFormattable.Type]);
	return FontStretch;
});


 
 



