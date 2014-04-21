/**
 * ICustomAttributeProvider
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var ICustomAttributeProvider = declare("ICustomAttributeProvider", Object,{
	});
	
	ICustomAttributeProvider.Type = new Type("ICustomAttributeProvider", ICustomAttributeProvider, [Object.Type], true);
	return ICustomAttributeProvider;
});



//public interface ICustomAttributeProvider
//	{
//		object[] GetCustomAttributes(Type attributeType, bool inherit);
//		object[] GetCustomAttributes(bool inherit);
//		bool IsDefined(Type attributeType, bool inherit);
//	}