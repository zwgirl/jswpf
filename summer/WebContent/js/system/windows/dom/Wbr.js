/**
 * Wbr
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Wbr = declare("Wbr", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("wbr");
		},
	});
	
	Object.defineProperties(Wbr.prototype,{
	});
	
	Wbr.Type = new Type("Wbr", Wbr, [DOMElement.Type, IAddChild.Type]);
	return Wbr;
});