/**
 * Strong
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Strong = declare("Strong", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("strong");
		},
	});
	
	Object.defineProperties(Strong.prototype,{
	});
	
	Strong.Type = new Type("Strong", Strong, [DOMElement.Type, IAddChild.Type]);
	return Strong;
});