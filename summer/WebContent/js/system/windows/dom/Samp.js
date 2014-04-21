/**
 * Small
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Small = declare("Small", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("small");
		},
	});
	
	Object.defineProperties(Small.prototype,{
	});
	
	Small.Type = new Type("Small", Small, [DOMElement.Type, IAddChild.Type]);
	return Small;
});