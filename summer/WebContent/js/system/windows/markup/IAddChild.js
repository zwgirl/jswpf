/**
 * IAddChild
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IAddChild = declare("IAddChild", Object,{
//		void 
		AddChild:function(/*object*/ value){},
//		void 
		AddText:function(/*string*/ text){}
	});
	
	IAddChild.Type = new Type("IAddChild", IAddChild, [Object.Type], true);
	return IAddChild;
});
