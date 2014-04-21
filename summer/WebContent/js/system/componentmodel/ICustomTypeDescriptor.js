/**
 * ICustomTypeDescriptor
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var ICustomTypeDescriptor = declare("ICustomTypeDescriptor", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(ICustomTypeDescriptor.prototype,{
		  
	});
	
	Object.defineProperties(ICustomTypeDescriptor,{
		  
	});
	
	ICustomTypeDescriptor.Type = new Type("ICustomTypeDescriptor", ICustomTypeDescriptor, [Object.Type], true);
	return ICustomTypeDescriptor;
});


//public interface ICustomTypeDescriptor
//	{
//		AttributeCollection GetAttributes();
//		string GetClassName();
//		string GetComponentName();
//		TypeConverter GetConverter();
//		EventDescriptor GetDefaultEvent();
//		PropertyDescriptor GetDefaultProperty();
//		object GetEditor(Type editorBaseType);
//		EventDescriptorCollection GetEvents();
//		EventDescriptorCollection GetEvents(Attribute[] attributes);
//		PropertyDescriptorCollection GetProperties();
//		PropertyDescriptorCollection GetProperties(Attribute[] attributes);
//		object GetPropertyOwner(PropertyDescriptor pd);
//	}