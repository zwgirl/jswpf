/**
 * IndependentlyAnimatedPropertyMetadata
 */

define(["dojo/_base/declare", "system/Type", "windows/UIPropertyMetadata"], 
		function(declare, Type, UIPropertyMetadata){
	var IndependentlyAnimatedPropertyMetadata = declare("IndependentlyAnimatedPropertyMetadata", UIPropertyMetadata,{
		constructor:function(/*object*/ defaultValue,
	            /*PropertyChangedCallback*/ propertyChangedCallback, /*CoerceValueCallback*/ coerceValueCallback){
			if(propertyChangedCallback === undefined){
				propertyChangedCallback =null;
			}
			
			if(coerceValueCallback === undefined){
				coerceValueCallback =null;
			}
			
			this.InitWithDVandPCCBandCVCB(defaultValue, propertyChangedCallback, coerceValueCallback);
		},
		
        /// <summary> 
        ///     Creates a new instance of this property metadata.  This method is used
        ///     when metadata needs to be cloned.  After CreateInstance is called the
        ///     framework will call Merge to merge metadata into the new instance.
        ///     Deriving classes must override this and return a new instance of 
        ///     themselves.
        /// </summary> 
//        internal override PropertyMetadata 
		CreateInstance:function() { 
            return new IndependentlyAnimatedPropertyMetadata(this.DefaultValue);
        } 
	});
	
	IndependentlyAnimatedPropertyMetadata.Type = new Type("IndependentlyAnimatedPropertyMetadata", 
			IndependentlyAnimatedPropertyMetadata, [UIPropertyMetadata.Type]);
	return IndependentlyAnimatedPropertyMetadata;
});
