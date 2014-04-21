/**
 * H2
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var H2 = declare("H2", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("h2");
		},
	});
	
	Object.defineProperties(H2.prototype,{
	});
	
	H2.Type = new Type("H2", H2, [DOMElement.Type, IAddChild.Type]);
	return H2;
});