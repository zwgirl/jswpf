/**
 * Time
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Time = declare("Time", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("time");
		},
	});
	
	Object.defineProperties(Time.prototype,{
	});
	
	Time.Type = new Type("Time", Time, [DOMElement.Type, IAddChild.Type]);
	return Time;
});