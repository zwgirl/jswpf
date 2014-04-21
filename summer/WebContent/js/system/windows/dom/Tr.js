/**
 * Tr
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Tr = declare("Tr", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("tr");
		},
	});
	
	Object.defineProperties(Tr.prototype,{
	});
	
	Tr.Type = new Type("Tr", Tr, [DOMElement.Type, IAddChild.Type]);
	return Tr;
});