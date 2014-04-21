/**
 * Div
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Div = declare("Div", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("div");
		},
	});
	
	Object.defineProperties(Div.prototype,{
	});
	
	Div.Type = new Type("Div", Div, [DOMElement.Type, IAddChild.Type]);
	return Div;
});