/**
 * Rt
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Rt = declare("Rt", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("rt");
		},
	});
	
	Object.defineProperties(Rt.prototype,{
	});
	
	Rt.Type = new Type("Rt", Rt, [DOMElement.Type, IAddChild.Type]);
	return Rt;
});