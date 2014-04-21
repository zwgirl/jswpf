/**
 * I
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var I = declare("I", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("i");
		},
	});
	
	Object.defineProperties(I.prototype,{
	});
	
	I.Type = new Type("I", I, [DOMElement.Type, IAddChild.Type]);
	return I;
});