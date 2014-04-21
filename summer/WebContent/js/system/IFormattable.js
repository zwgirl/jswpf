/**
 * IFormattable
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IFormattable = declare("IFormattable", null,{
//		string 
		ToString:function(/*string*/ format, /*IFormatProvider*/ formatProvider){}
	});
	
	IFormattable.Type = new Type("IFormattable", IFormattable, [Object.Type], true);
	return IFormattable;
});