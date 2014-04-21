/**
 * DateTimeKind
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var DateTimeKind = declare("DateTimeKind", null,{

	});
	
	DateTimeKind.Unspecified = 0,
	DateTimeKind.Utc = 1,
	DateTimeKind.Local = 2;
	
//	DateTimeKind.Type = new Type("DateTimeKind", DateTimeKind, [Object.Type]);
	return DateTimeKind;
});
