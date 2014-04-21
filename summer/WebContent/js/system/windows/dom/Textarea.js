/**
 * Textarea
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Textarea = declare("Textarea", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("textarea");
		},
	});
	
	Object.defineProperties(Textarea.prototype,{
	});
	
	Textarea.Type = new Type("Textarea", Textarea, [DOMElement.Type, IAddChild.Type]);
	return Textarea;
});