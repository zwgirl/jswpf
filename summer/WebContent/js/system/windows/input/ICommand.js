/**
 * ICommand
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ICommand = declare("ICommand", Object,{
//		bool 
		CanExecute:function(/*object*/ parameter){
			
		},
//		void 
		Execute:function(/*object*/ parameter){
			
		}
	});
	
	Object.defineProperties(ICommand.prototype,{
//		event EventHandler 
		CanExecuteChanged:
		{
			
		}
	});
	
	ICommand.Type = new Type("ICommand", ICommand, [Object.Type], true);
	return ICommand;
});
