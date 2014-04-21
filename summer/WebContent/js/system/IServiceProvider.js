/**
 * IServiceProvider
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IServiceProvider = declare("IServiceProvider", null,{
//		object 
		GetService:function(/*Type*/ serviceType){}
	});
	
	IServiceProvider.Type = new Type("IServiceProvider", IServiceProvider, [Object.Type], true);
	return IServiceProvider;
});
