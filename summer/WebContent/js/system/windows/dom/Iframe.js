/**
 * Iframe
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Iframe = declare("Iframe", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("iframe");
		},
	});
	
	Object.defineProperties(Iframe.prototype,{
	});
	
	Iframe.Type = new Type("Iframe", Iframe, [DOMElement.Type, IAddChild.Type]);
	return Iframe;
});