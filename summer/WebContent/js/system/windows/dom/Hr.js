/**
 * Hr
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Hr = declare("Hr", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("hr");
		},
	});
	
	Object.defineProperties(Hr.prototype,{
	});
	
	Hr.Type = new Type("Hr", Hr, [DOMElement.Type, IAddChild.Type]);
	return Hr;
});