/**
 * Feature
 */

define(["dojo/_base/declare"], function(declare){

    var Feature=declare(null,{ 
    });	

    Feature.FallbackValue = 0;
    Feature.StringFormat= 1; 
    Feature.TargetNullValue= 2;
    Feature.BindingGroupName= 3; 
    Feature.Delay= 4; 

    // Binding 
    Feature.XPath= 5;
    Feature.Culture= 6;
    Feature.AsyncState= 7;
    Feature.ObjectSource= 8; 
    Feature.RelativeSource= 9;
    Feature.ElementSource= 10; 
    Feature.Converter= 11; 
    Feature.ConverterParameter= 12;
    Feature.ValidationRules= 13; 
    Feature.ExceptionFilterCallback= 14;
    Feature.AttachedPropertiesInPath= 15;

    // MultiBinding 

    // PriorityBinding 
 
    // Sentinel, for error checking.   Must be last.
    Feature.LastFeatureId = 16;

        
    return Feature;
        
});