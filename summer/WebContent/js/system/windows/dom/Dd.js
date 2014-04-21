/**
 * Dd
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Dd = declare("Dd", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("dd");
		},
	});
	
	Object.defineProperties(Dd.prototype,{
	});
	
	Dd.Type = new Type("Dd", Dd, [DOMElement.Type, IAddChild.Type]);
	return Dd;
});