/**
 * FontFamily
 */
/// <summary>
/// Represents a family of related fonts. Fonts in a FontFamily differ only in style, 
/// weight, or stretch. 
/// </summary>
define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var FontFamily = declare("FontFamily", Object,{
		constructor:function(/*string*/ familyName ){
			if(familyName == null || String.IsNullOrEmpty(familyName)){
				throw new InvalidFontFamilyNameException(); 
			}
			this.familyName = familyName;
		},
		
		 /// <summary>
        /// Equality check 
        /// </summary>
//        public override bool 
		Equals:function(/*object*/ o)
        {
            var f = o instanceof FontFamily; 
            if (f == null)
            { 
                // different types or o == null 
                return false;
            } 
            return this.FamilyName == f.FamilyName;
        },
        /// <summary> 
        /// Create correspondent hash code for the object
        /// </summary> 
        /// <returns>object hash code</returns>
//        public override int 
        GetHashCode:function()
        {
            // unnamed family: hash is based on object identity
            return this.FamilyName.GetHashCode();
        },
        ToString:function(){
        	return this.FamilyName;
        }
	});
	
	Object.defineProperties(FontFamily.prototype,{
		FamilyName:
		{
			get:function(){
				return this.familyName;
			}
		}
	});
	
	FontFamily.Type = new Type("FontFamily", FontFamily, [Object.Type]);
	return FontFamily;
});

