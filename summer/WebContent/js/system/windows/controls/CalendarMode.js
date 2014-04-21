/**
 * CalendarMode
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var CalendarMode = declare("CalendarMode", null,{

	});
	
	CalendarMode.Month = 0;
	CalendarMode.Year = 1;
	CalendarMode.Decade = 2;
	
//	CalendarMode.Type = new Type("CalendarMode", CalendarMode, [Object.Type]);
	return CalendarMode;
});
