/**
 * Thead
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Thead = declare("Thead", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("thead");
		},
	});
	
	Object.defineProperties(Thead.prototype,{
	});
	
	Thead.Type = new Type("Thead", Thead, [DOMElement.Type, IAddChild.Type]);
	return Thead;
});