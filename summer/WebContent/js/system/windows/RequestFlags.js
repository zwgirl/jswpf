define(["dojo/_base/declare"], function(declare){

    var RequestFlags=declare("RequestFlags", null,{ 
    });	
    
    RequestFlags.FullyResolved=0;
	RequestFlags.AnimationBaseValue=1;
	RequestFlags.CoercionBaseValue=2;
	RequestFlags.DeferredReferences = 4;
	RequestFlags.SkipDefault = 8;
	RequestFlags.RawEntry = 16;

    
    return RequestFlags;
    
});