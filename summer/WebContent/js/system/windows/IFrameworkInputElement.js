/**
 * IFrameworkInputElement
 */

define(["dojo/_base/declare", "system/Type", "windows/IInputElement"], 
		function(declare, Type, IInputElement){
	var IFrameworkInputElement = declare("IFrameworkInputElement", IInputElement,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(IFrameworkInputElement.prototype,{
//		string 
		Name:
		{
		} 
	});
	
	
	IFrameworkInputElement.Type = new Type("IFrameworkInputElement", IFrameworkInputElement, [IInputElement.Type]);
	return IFrameworkInputElement;
});

