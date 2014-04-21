/**
 * Tfoot
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Tfoot = declare("Tfoot", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("tfoot");
		},
	});
	
	Object.defineProperties(Tfoot.prototype,{
	});
	
	Tfoot.Type = new Type("Tfoot", Tfoot, [DOMElement.Type, IAddChild.Type]);
	return Tfoot;
});