/**
 * H5
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var H5 = declare("H5", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("h5");
		},
	});
	
	Object.defineProperties(H5.prototype,{
	});
	
	H5.Type = new Type("H5", H5, [DOMElement.Type, IAddChild.Type]);
	return H5;
});