/**
 * H6
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var H6 = declare("H6", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("h6");
		},
	});
	
	Object.defineProperties(H6.prototype,{
	});
	
	H6.Type = new Type("H6", H6, [DOMElement.Type, IAddChild.Type]);
	return H6;
});