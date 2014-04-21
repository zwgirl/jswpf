/**
 * IQueryAmbient
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IQueryAmbient = declare("INameScope", Object,{
//		bool 
		IsAmbientPropertyAvailable:function(/*string*/ propertyName){}
	});
	
	
	IQueryAmbient.Type = new Type("IQueryAmbient", IQueryAmbient, [Object.Type], true);
	return IQueryAmbient;
});
