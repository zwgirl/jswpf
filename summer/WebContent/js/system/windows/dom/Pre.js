/**
 * Pre
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Pre = declare("Pre", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("pre");
		},
	});
	
	Object.defineProperties(Pre.prototype,{
	});
	
	Pre.Type = new Type("Pre", Pre, [DOMElement.Type, IAddChild.Type]);
	return Pre;
});