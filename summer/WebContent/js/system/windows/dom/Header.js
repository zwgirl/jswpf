/**
 * Header
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Header = declare("Header", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("header");
		},
	});
	
	Object.defineProperties(Header.prototype,{
	});
	
	Header.Type = new Type("Header", Header, [DOMElement.Type, IAddChild.Type]);
	return Header;
});