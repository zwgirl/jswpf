/**
 * KeyStates
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var KeyStates = declare("KeyStates", null,{

	});
	
	KeyStates.None = 0;
	KeyStates.Down = 1;
	KeyStates.Toggled = 2;
	
//	KeyStates.Type = new Type("KeyStates", KeyStates, [Object.Type]);
	return KeyStates;
});
