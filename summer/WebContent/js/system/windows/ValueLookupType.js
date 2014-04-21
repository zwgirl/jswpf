/**
 * from StyleHelper
 */

/**
 * ValueLookupType
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ValueLookupType = declare("ValueLookupType", null,{

	});
	
	ValueLookupType.Simple = 0; 
	ValueLookupType.Trigger = 1; 
	ValueLookupType.PropertyTriggerResource =2;
	ValueLookupType.DataTrigger =3; 
	ValueLookupType.DataTriggerResource =4;
	ValueLookupType.TemplateBinding =5;
	ValueLookupType.Resource =6;
	
	ValueLookupType.Type = new Type("ValueLookupType", ValueLookupType, [Object.Type]);
	return ValueLookupType;
});

//    //
//    //  Describes the value stored in the ChildValueLookup structure
//    //
//    internal enum ValueLookupType : int 
//    {
//        Simple, 
//        Trigger, 
//        PropertyTriggerResource,
//        DataTrigger, 
//        DataTriggerResource,
//        TemplateBinding,
//        Resource
//    } 