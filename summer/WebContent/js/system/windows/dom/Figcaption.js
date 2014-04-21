/**
 * Figcaption
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Figcaption = declare("Figcaption", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("figcaption");
		},
	});
	
	Object.defineProperties(Figcaption.prototype,{
	});
	
	Figcaption.Type = new Type("Figcaption", Figcaption, [DOMElement.Type, IAddChild.Type]);
	return Figcaption;
});