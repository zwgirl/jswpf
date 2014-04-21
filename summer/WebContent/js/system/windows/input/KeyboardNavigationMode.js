/**
 * from KeyboardNavigation
 */
/**
 * KeyboardNavigationMode
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var KeyboardNavigationMode = declare("KeyboardNavigationMode", null,{

	});
	
	KeyboardNavigationMode.Continue = 0;
	KeyboardNavigationMode.Once = 1;
	KeyboardNavigationMode.Cycle = 2;
	KeyboardNavigationMode.None = 3;
	KeyboardNavigationMode.Contained = 4;
	KeyboardNavigationMode.Local = 5;
	
	
//	KeyboardNavigationMode.Type = new Type("KeyboardNavigationMode", KeyboardNavigationMode, [Object.Type]);
	return KeyboardNavigationMode;
});
