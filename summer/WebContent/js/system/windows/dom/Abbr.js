/**
 * Abbr
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Abbr = declare("Abbr", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("abbr");
		},
	});
	
	Object.defineProperties(Abbr.prototype,{
	});
	
	Abbr.Type = new Type("Abbr", Abbr, [DOMElement.Type, IAddChild.Type]);
	return Abbr;
});