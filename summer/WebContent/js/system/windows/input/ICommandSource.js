/**
 * ICommandSource
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ICommandSource = declare("ICommandSource", null,{
	});
	
	Object.defineProperties(ICommandSource.prototype,{
//		ICommand 
		Command:
		{
			get:function(){}
		},
//		object 
		CommandParameter:
		{
			get:function(){}
		},
//		IInputElement 
		CommandTarget:
		{
			get:function(){}
		}
	});
	
	ICommandSource.Type = new Type("ICommandSource", ICommandSource, [Object.Type], true);
	return ICommandSource;
});
