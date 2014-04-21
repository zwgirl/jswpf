/**
 * Aside
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Aside = declare("Aside", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("aside");
		},
	});
	
	Object.defineProperties(Aside.prototype,{
	});
	
	Aside.Type = new Type("Aside", Aside, [DOMElement.Type, IAddChild.Type]);
	return Aside;
});