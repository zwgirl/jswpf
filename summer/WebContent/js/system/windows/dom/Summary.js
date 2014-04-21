/**
 * Summary
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Summary = declare("Summary", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("summary");
		},
	});
	
	Object.defineProperties(Summary.prototype,{
	});
	
	Summary.Type = new Type("Summary", Summary, [DOMElement.Type, IAddChild.Type]);
	return Summary;
});