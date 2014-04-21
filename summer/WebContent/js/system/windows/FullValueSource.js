define(["dojo/_base/declare"], function(declare){

    var FullValueSource=declare("FullValueSource", null,{ 
    });	
    
    // Bit used to store BaseValueSourceInternal = 0x01 
    // Bit used to store BaseValueSourceInternal = 0x02
    // Bit used to store BaseValueSourceInternal = 0x04
    // Bit used to store BaseValueSourceInternal = 0x08
 
	FullValueSource.ValueSourceMask     = 0x000F;
	FullValueSource.ModifiersMask       = 0x0070; 
	FullValueSource.IsExpression        = 0x0010; 
	FullValueSource.IsAnimated          = 0x0020;
	FullValueSource.IsCoerced           = 0x0040; 
	FullValueSource.IsPotentiallyADeferredReference = 0x0080;
	FullValueSource.HasExpressionMarker = 0x0100;
	FullValueSource.IsCoercedWithCurrentValue = 0x200;

    
    return FullValueSource;
});