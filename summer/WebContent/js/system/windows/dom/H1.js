/**
 * H1
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var H1 = declare("H1", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("h1");
		},
	});
	
	Object.defineProperties(H1.prototype,{
	});
	
	H1.Type = new Type("H1", H1, [DOMElement.Type, IAddChild.Type]);
	return H1;
});