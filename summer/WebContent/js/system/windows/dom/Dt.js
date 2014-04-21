/**
 * Dt
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Dt = declare("Dt", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("dt");
		},
	});
	
	Object.defineProperties(Dt.prototype,{
	});
	
	Dt.Type = new Type("Dt", Dt, [DOMElement.Type, IAddChild.Type]);
	return Dt;
});