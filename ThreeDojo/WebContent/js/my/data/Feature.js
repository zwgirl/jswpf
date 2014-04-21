define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) { 
  return  {
	FallbackValue:0,
	StringFormat:1, 
	TargetNullValue:2,
	BindingGroupName:3, 
	Delay:4, 
	
	// Binding 
	XPath:5,
	Culture:6,
	AsyncState:7,
	ObjectSource:8, 
	RelativeSource:9,
	ElementSource:10, 
	Converter:11, 
	ConverterParameter:12,
	ValidationRules:13, 
	ExceptionFilterCallback:14,
	AttachedPropertiesInPath:15,

// MultiBinding 

// PriorityBinding 

// Sentinel, for error checking.   Must be last.
    LastFeatureId:32
  };
});
	    