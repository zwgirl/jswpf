/**
 * INameScope
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var INameScope = declare("INameScope", Object,{
//		void 
		RegisterName:function(/*string*/ name, /*object*/ scopedElement){},
//		void 
		UnregisterName:function(/*string*/ name) {},
//		object 
		FindName:function(/*string*/ name) {}
	});
	
	
	INameScope.Type = new Type("INameScope", INameScope, [Object.Type], true);
	return INameScope;
});
