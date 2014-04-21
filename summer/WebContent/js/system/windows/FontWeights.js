/**
 * FontWeights
 */

define(["dojo/_base/declare", "system/Type", "windows/FontWeight"], 
		function(declare, Type, FontWeight){
	var FontWeights = declare("FontWeights", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(FontWeights.prototype,{
		  
	});
	
	Object.defineProperties(FontWeights,{
		/// <summary>
        /// Predefined font weight : Thin. 
        /// </summary>
//        public static FontWeight 
		Thin:       { get:function() { return new FontWeight(100); } }, 
 
        /// <summary>
        /// Predefined font weight : Extra-light. 
        /// </summary>
//        public static FontWeight 
		ExtraLight: { get:function() { return new FontWeight(200); } },

        /// <summary> 
        /// Predefined font weight : Ultra-light.
        /// </summary> 
//        public static FontWeight 
		UltraLight: { get:function() { return new FontWeight(200); } }, 

        /// <summary> 
        /// Predefined font weight : Light.
        /// </summary>
//        public static FontWeight 
		Light:      { get:function() { return new FontWeight(300); } },
 
        /// <summary>
        /// Predefined font weight : Normal. 
        /// </summary> 
//        public static FontWeight 
		Normal:     { get:function() { return new FontWeight(400); } },
 
        /// <summary>
        /// Predefined font weight : Regular.
        /// </summary>
//        public static FontWeight 
		Regular:    { get:function() { return new FontWeight(400); } }, 

        /// <summary> 
        /// Predefined font weight : Medium. 
        /// </summary>
//        public static FontWeight 
		Medium:     { get:function() { return new FontWeight(500); } }, 

        /// <summary>
        /// Predefined font weight : Demi-bold.
        /// </summary> 
//        public static FontWeight 
		DemiBold:   { get:function() { return new FontWeight(600); } },
 
        /// <summary> 
        /// Predefined font weight : Semi-bold.
        /// </summary> 
//        public static FontWeight 
		SemiBold:  { get:function() { return new FontWeight(600); } },

        /// <summary>
        /// Predefined font weight : Bold. 
        /// </summary>
//        public static FontWeight 
		Bold:       { get:function() { return new FontWeight(700); } }, 
 
        /// <summary>
        /// Predefined font weight : Extra-bold. 
        /// </summary>
//        public static FontWeight 
		ExtraBold:  { get:function() { return new FontWeight(800); } },

        /// <summary> 
        /// Predefined font weight : Ultra-bold.
        /// </summary> 
//        public static FontWeight 
		UltraBold:  { get:function() { return new FontWeight(800); } }, 

        /// <summary> 
        /// Predefined font weight : Black.
        /// </summary>
//        public static FontWeight 
		Black:      { get:function() { return new FontWeight(900); } },
 
        /// <summary>
        /// Predefined font weight : Heavy. 
        /// </summary> 
//        public static FontWeight
		Heavy:      { get:function() { return new FontWeight(900); } },
 
        /// <summary>
        /// Predefined font weight : ExtraBlack.
        /// </summary>
//        public static FontWeight 
		ExtraBlack: { get:function() { return new FontWeight(950); } }, 

        /// <summary> 
        /// Predefined font weight : UltraBlack. 
        /// </summary>
//        public static FontWeight 
		UltraBlack: { get :function(){ return new FontWeight(950); } }   
	});

	
	FontWeights.Type = new Type("FontWeights", FontWeights, [Object.Type]);
	return FontWeights;
});


