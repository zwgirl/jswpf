/**
 * VirtualizationCacheLengthUnit
 */
define(["dojo/_base/declare"], function(declare){
    var VirtualizationCacheLengthUnit = declare("VirtualizationCacheLengthUnit", null,{ 
    });	
    
    VirtualizationCacheLengthUnit.Pixel = 0;
    VirtualizationCacheLengthUnit.Item = 1;
	VirtualizationCacheLengthUnit.Page = 2;
	
    return VirtualizationCacheLengthUnit;
});
