/**
 * H4
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var H4 = declare("H4", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("h4");
		},
	});
	
	Object.defineProperties(H4.prototype,{
	});
	
	H4.Type = new Type("H4", H4, [DOMElement.Type, IAddChild.Type]);
	return H4;
});