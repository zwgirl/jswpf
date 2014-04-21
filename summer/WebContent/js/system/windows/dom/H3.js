/**
 * H3
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var H3 = declare("H3", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("h3");
		},
	});
	
	Object.defineProperties(H3.prototype,{
	});
	
	H3.Type = new Type("H3", H3, [DOMElement.Type, IAddChild.Type]);
	return H3;
});