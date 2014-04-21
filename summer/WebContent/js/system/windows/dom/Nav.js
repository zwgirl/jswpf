/**
 * Nav
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Nav = declare("Nav", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("nav");
		},
	});
	
	Object.defineProperties(Nav.prototype,{
	});
	
	Nav.Type = new Type("Nav", Nav, [DOMElement.Type, IAddChild.Type]);
	return Nav;
});