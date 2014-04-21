/**
 * Dfn
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Dfn = declare("Dfn", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("dfn");
		},
	});
	
	Object.defineProperties(Dfn.prototype,{
	});
	
	Dfn.Type = new Type("Dfn", Dfn, [DOMElement.Type, IAddChild.Type]);
	return Dfn;
});