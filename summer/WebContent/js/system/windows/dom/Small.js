/**
 * Samp
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Samp = declare("Samp", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("samp");
		},
	});
	
	Object.defineProperties(Samp.prototype,{
	});
	
	Samp.Type = new Type("Samp", Samp, [DOMElement.Type, IAddChild.Type]);
	return Samp;
});