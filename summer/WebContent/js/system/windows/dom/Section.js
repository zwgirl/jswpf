/**
 * Section
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Section = declare("Section", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("section");
		},
	});
	
	Object.defineProperties(Section.prototype,{
	});
	
	Section.Type = new Type("Section", Section, [DOMElement.Type, IAddChild.Type]);
	return Section;
});