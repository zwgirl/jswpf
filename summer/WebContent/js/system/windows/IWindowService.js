/**
 * IWindowService
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IWindowService = declare("IWindowService", null,{
	});
	
	Object.defineProperties(IWindowService.prototype,{
//		string 
		Title:
		{
//			get;
//			set;
		},
//		double 
		Height:
		{
//			get;
//			set;
		},
//		double 
		Width:
		{
//			get;
//			set;
		},
//		bool 
		UserResized:
		{
//			get;
		},  
	});
	
	IWindowService.Type = new Type("IWindowService", IWindowService, [Object.Type], true);
	return IWindowService;
});

