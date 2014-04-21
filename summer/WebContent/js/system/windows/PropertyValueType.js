/**
 * from StyleHelper
 */

/**
 * PropertyValueType
 */

define(["dojo/_base/declare", "system/Type", "windows/ValueLookupType"], 
		function(declare, Type, ValueLookupType){
	var PropertyValueType = declare("PropertyValueType", null,{

	});
	
	PropertyValueType.Set                       = ValueLookupType.Simple; 
	PropertyValueType.Trigger                   = ValueLookupType.Trigger; 
	PropertyValueType.PropertyTriggerResource   = ValueLookupType.PropertyTriggerResource;
	PropertyValueType.DataTrigger               = ValueLookupType.DataTrigger;
	PropertyValueType.DataTriggerResource       = ValueLookupType.DataTriggerResource;
	PropertyValueType.TemplateBinding           = ValueLookupType.TemplateBinding;
	PropertyValueType.Resource                  = ValueLookupType.Resource;
	
//	PropertyValueType.Type = new Type("PropertyValueType", PropertyValueType, [Object.Type]);
	return PropertyValueType;
});

////
////  Describes the value stored in the PropertyValue structure
////
//internal enum PropertyValueType : int 
//{
//    Set                       = ValueLookupType.Simple, 
//    Trigger                   = ValueLookupType.Trigger, 
//    PropertyTriggerResource   = ValueLookupType.PropertyTriggerResource,
//    DataTrigger               = ValueLookupType.DataTrigger, 
//    DataTriggerResource       = ValueLookupType.DataTriggerResource,
//    TemplateBinding           = ValueLookupType.TemplateBinding,
//    Resource                  = ValueLookupType.Resource,
//} 