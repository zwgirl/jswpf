/**
 * Dock
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var Dock = declare("Dock", null,{

	});
	
	Dock.Left = 0;
	Dock.Top = 1;
	Dock.Right = 2;
	Dock.Bottom = 3;
	
//	Dock.Type = new Type("Dock", Dock, [Object.Type]);
	return Dock;
});
