/**
 * IUriContext
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IUriContext = declare("IUriContext", Object,{
	});
	
	Object.defineProperties(IUriContext.prototype, {
//		Uri 
		BaseUri:
		{
		}
	});
	
	IUriContext.Type = new Type("IUriContext", IUriContext, [Object.Type], true);
	return IUriContext;
});
