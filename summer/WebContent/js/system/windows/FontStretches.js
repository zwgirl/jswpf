/**
 * FontStretches
 */

define(["dojo/_base/declare", "system/Type", "windows/FontStretch"], 
		function(declare, Type, FontStretch){
	var FontStretches = declare("FontStretches", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(FontStretches,{
		/// <summary>
        /// Predefined font stretch : Ultra-condensed. 
        /// </summary>
//        public static FontStretch 
		UltraCondensed:    { get:function() { return new FontStretch(1); } }, 
 
        /// <summary>
        /// Predefined font stretch : Extra-condensed. 
        /// </summary>
//        public static FontStretch 
		ExtraCondensed: { get:function() { return new FontStretch(2); } },

        /// <summary> 
        /// Predefined font stretch : Condensed.
        /// </summary> 
//        public static FontStretch
		Condensed: { get:function() { return new FontStretch(3); } }, 

        /// <summary> 
        /// Predefined font stretch : Semi-condensed.
        /// </summary>
//        public static FontStretch 
		SemiCondensed:      { get:function() { return new FontStretch(4); } },
 
        /// <summary>
        /// Predefined font stretch : Normal. 
        /// </summary> 
//        public static FontStretch 
		Normal:     { get:function() { return new FontStretch(5); } },
 
        /// <summary>
        /// Predefined font stretch : Medium.
        /// </summary>
//        public static FontStretch 
		Medium:     { get:function() { return new FontStretch(5); } }, 

        /// <summary> 
        /// Predefined font stretch : Semi-expanded. 
        /// </summary>
//        public static FontStretch 
		SemiExpanded:  { get:function() { return new FontStretch(6); } }, 

        /// <summary>
        /// Predefined font stretch : Expanded.
        /// </summary> 
//        public static FontStretch 
		Expanded:  { get:function() { return new FontStretch(7); } },
 
        /// <summary> 
        /// Predefined font stretch : Extra-expanded.
        /// </summary> 
//        public static FontStretch 
		ExtraExpanded:  { get:function() { return new FontStretch(8); } },

        /// <summary>
        /// Predefined font stretch : Ultra-expanded. 
        /// </summary>
//        public static FontStretch 
		UltraExpanded:  { get:function() { return new FontStretch(9); } }   
	});
	
	FontStretches.Type = new Type("FontStretches", FontStretches, [Object.Type]);
	return FontStretches;
});
