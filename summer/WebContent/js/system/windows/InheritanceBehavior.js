/**
 * InheritanceBehavior
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var InheritanceBehavior = declare("InheritanceBehavior", null,{

	});
	
	InheritanceBehavior.Default = 0;
	InheritanceBehavior.SkipToAppNow = 1;
	InheritanceBehavior.SkipToAppNext = 2;
	InheritanceBehavior.SkipToThemeNow = 3;
	InheritanceBehavior.SkipToThemeNext = 4;
	InheritanceBehavior.SkipAllNow = 5;
	InheritanceBehavior.SkipAllNext = 6;
	
	return InheritanceBehavior;
});

	