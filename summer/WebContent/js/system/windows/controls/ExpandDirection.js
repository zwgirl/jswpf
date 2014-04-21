/**
 * ExpandDirection
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ExpandDirection = declare("ExpandDirection", Object,{

	});
	
	ExpandDirection.Down = 0;
	ExpandDirection.Up = 1;
	ExpandDirection.Left = 0;
	ExpandDirection.Right = 1;
	
//	ExpandDirection.Type = new Type("ExpandDirection", ExpandDirection, [Object.Type]);
	return ExpandDirection;
});
