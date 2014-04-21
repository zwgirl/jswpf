/**
 * CalendarSelectionMode
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var CalendarSelectionMode = declare("CalendarSelectionMode", null,{

	});
	
	CalendarSelectionMode.SingleDate = 0;
	CalendarSelectionMode.SingleRange = 1;
	CalendarSelectionMode.MultipleRange = 2;
	CalendarSelectionMode.None = 3;
	
//	CalendarSelectionMode.Type = new Type("CalendarSelectionMode", CalendarSelectionMode, [Object.Type]);
	return CalendarSelectionMode;
});
