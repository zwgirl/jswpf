/**
 * Label
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Label = declare("Label", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("label");
		},
	});
	
	Object.defineProperties(Label.prototype,{
	});
	
	Label.Type = new Type("Label", Label, [DOMElement.Type, IAddChild.Type]);
	return Label;
});