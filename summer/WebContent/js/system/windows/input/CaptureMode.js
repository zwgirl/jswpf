/**
 * CaptureMode
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var CaptureMode = declare("CaptureMode", null,{

	});
	
	CaptureMode.None = 0;
	CaptureMode.Element = 1;
	CaptureMode.SubTree = 2;
	
//	CaptureMode.Type = new Type("CaptureMode", CaptureMode, [Object.Type]);
	return CaptureMode;
});
