/**
 * Ol
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Ol = declare("Ol", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("ol");
		},
	});
	
	Object.defineProperties(Ol.prototype,{
	});
	
	Ol.Type = new Type("Ol", Ol, [DOMElement.Type, IAddChild.Type]);
	return Ol;
});