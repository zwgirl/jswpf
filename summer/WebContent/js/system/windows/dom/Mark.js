/**
 * Mark
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Mark = declare("Mark", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("mark");
		},
	});
	
	Object.defineProperties(Mark.prototype,{
	});
	
	Mark.Type = new Type("Mark", Mark, [DOMElement.Type, IAddChild.Type]);
	return Mark;
});