/**
 * Sup
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Sup = declare("Sup", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("sup");
		},
	});
	
	Object.defineProperties(Sup.prototype,{
	});
	
	Sup.Type = new Type("Sup", Sup, [DOMElement.Type, IAddChild.Type]);
	return Sup;
});