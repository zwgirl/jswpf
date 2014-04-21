/**
 * DayOfWeek
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var DayOfWeek = declare("DayOfWeek", null,{

	});
	
	DayOfWeek.Sunday = 0,
	DayOfWeek.Monday = 1,
	DayOfWeek.Tuesday = 2,
	DayOfWeek.Wednesday = 3,
	DayOfWeek.Thursday = 4,
	DayOfWeek.Friday = 5,
	DayOfWeek.Saturday = 6;
	
//	DayOfWeek.Type = new Type("DayOfWeek", DayOfWeek, [Object.Type]);
	return DayOfWeek;
});
