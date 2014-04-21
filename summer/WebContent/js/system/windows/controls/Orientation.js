/**
 * Orientation
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var Orientation = declare("Orientation", null,{

	});
	
	Orientation.Horizontal = 0;
	Orientation.Vertical = 1;
	
//	Orientation.Type = new Type("Orientation", Orientation, [Object.Type]);
	return Orientation;
});
