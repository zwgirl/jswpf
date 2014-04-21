/**
 * InputGesture
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var InputGesture = declare("InputGesture", Object,{
//		public abstract bool 
		Matches:function(/*object*/ targetElement, /*InputEventArgs*/ inputEventArgs){}
	});
	
	InputGesture.Type = new Type("InputGesture", InputGesture, [Object.Type]);
	return InputGesture;
});
