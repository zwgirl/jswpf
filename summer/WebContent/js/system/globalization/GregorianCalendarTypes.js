/**
 * GregorianCalendarTypes
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var GregorianCalendarTypes = declare("GregorianCalendarTypes", null,{

	});
	
	GregorianCalendarTypes.Localized = 1,
	GregorianCalendarTypes.USEnglish = 2,
	GregorianCalendarTypes.MiddleEastFrench = 9,
	GregorianCalendarTypes.Arabic = 10,
	GregorianCalendarTypes.TransliteratedEnglish = 11,
	GregorianCalendarTypes.TransliteratedFrench = 12;
	
//	GregorianCalendarTypes.Type = new Type("GregorianCalendarTypes", GregorianCalendarTypes, [Object.Type]);
	return GregorianCalendarTypes;
});


//public enum GregorianCalendarTypes
//	{
//		Localized = 1,
//		USEnglish,
//		MiddleEastFrench = 9,
//		Arabic,
//		TransliteratedEnglish,
//		TransliteratedFrench
//	}