/**
 * Rp
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Rp = declare("Rp", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("rp");
		},
	});
	
	Object.defineProperties(Rp.prototype,{
	});
	
	Rp.Type = new Type("Rp", Rp, [DOMElement.Type, IAddChild.Type]);
	return Rp;
});