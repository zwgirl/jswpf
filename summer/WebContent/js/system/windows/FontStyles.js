/**
 * FontStyles
 */
/// <summary> 
/// FontStyles contains predefined font style structures for common font styles.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "windows/FontStyle"], 
		function(declare, Type, FontStyle){
	var FontStyles = declare("FontStyles", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(FontStyles,{
		/// <summary>
        /// Predefined font style : Normal. 
        /// </summary>
//        public static FontStyle 
		Normal:       { get:function() { return new FontStyle(0); } }, 
 
        /// <summary>
        /// Predefined font style : Oblique. 
        /// </summary>
//        public static FontStyle 
		Oblique: { get:function() { return new FontStyle(1); } },

        /// <summary> 
        /// Predefined font style : Italic.
        /// </summary> 
//        public static FontStyle 
		Italic: { get:function() { return new FontStyle(2); } }   
	});
	
	FontStyles.Type = new Type("FontStyles", FontStyles, [Object.Type]);
	return FontStyles;
});

