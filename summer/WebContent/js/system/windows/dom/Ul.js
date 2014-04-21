/**
 * Ul
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Ul = declare("Ul", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("ul");
		},
	});
	
	Object.defineProperties(Ul.prototype,{
	});
	
	Ul.Type = new Type("Ul", Ul, [DOMElement.Type, IAddChild.Type]);
	return Ul;
});