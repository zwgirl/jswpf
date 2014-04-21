/**
 * Dl
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Dl = declare("Dl", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("dl");
		},
	});
	
	Object.defineProperties(Dl.prototype,{
	});
	
	Dl.Type = new Type("Dl", Dl, [DOMElement.Type, IAddChild.Type]);
	return Dl;
});