/**
 * FontWeight
 */

define(["dojo/_base/declare", "system/Type", "system/IFormattable"], 
		function(declare, Type, IFormattable){
	var FontWeight = declare("FontWeight", IFormattable,{
		constructor:function(/*int*/ weight) 
        {
            this._weight = weight; 
        },

        /// <summary>
        /// Checks whether an object is equal to another character hit object.
        /// </summary> 
        /// <param name="obj">FontWeight object to compare with.</param>
        /// <returns>Returns true when the object is equal to the input object, 
        /// and false otherwise.</returns> 
//        public override bool 
        Equals:function(/*object*/ obj)
        { 
            if (!(obj instanceof FontWeight))
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
            return this._weight;
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
        	switch (this._weight)
            {
                case 100:
                    return "Thin"; 
                case 200: 
                    return "ExtraLight"; 
                case 300: 
                    return "Light";
                case 400:
                    return "Normal"; 
                case 500: 
                    return "Medium"; 
                case 600: 
                    return "SemiBold";
                case 700:
                    return "Bold"; 
                case 800: 
                    return "ExtraBold"; 
                case 900: 
                    return "Black";
                case 950:
                    return "ExtraBlack"; 
            }
        } 
        
	});
	
	FontWeight.Type = new Type("FontWeight", FontWeight, [IFormattable.Type]);
	return FontWeight;
});

