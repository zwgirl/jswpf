/**
 * ITypeDescriptorContext
 */

define(["dojo/_base/declare", "system/Type", "system/IServiceProvider"], 
		function(declare, Type, IServiceProvider){
	var ITypeDescriptorContext = declare("ITypeDescriptorContext", IServiceProvider,{
	});
	
	ITypeDescriptorContext.Type = new Type("ITypeDescriptorContext", ITypeDescriptorContext, [IServiceProvider.Type]);
	return ITypeDescriptorContext;
});



//	public interface ITypeDescriptorContext : IServiceProvider
//	{
//		IContainer Container
//		{
//			get;
//		}
//		object Instance
//		{
//			get;
//		}
//		PropertyDescriptor PropertyDescriptor
//		{
//			get;
//		}
//		bool OnComponentChanging();
//		void OnComponentChanged();
//	}