/**
 * Span
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Span = declare("Span", [DOMElement, IAddChild], {
		constructor:function(text){
			if(text === undefined){
				text = null;
			}
			
			this._dom = document.createElement("span");
			
			if(text !=null){
				this._dom.appendChild(document.createTextNode(text));
			}
		},
	});
	
	Object.defineProperties(Span.prototype,{
	});
	
	Span.Type = new Type("Span", Span, [DOMElement.Type, IAddChild.Type]);
	return Span;
});