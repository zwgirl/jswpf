/**
 * IComponentConnector
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IComponentConnector = declare("IComponentConnector", null,{
//		void 
		Connect:function(/*int*/ connectionId, /*object*/ target){},
//		void 
		InitializeComponent:function(){}
	});
	
	Object.defineProperties(IComponentConnector.prototype,{

	});
	
	IComponentConnector.Type = new Type("IComponentConnector", IComponentConnector, [Object.Type], true);
	return IComponentConnector;
});
