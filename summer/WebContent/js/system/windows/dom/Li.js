/**
 * Li
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Li = declare("Li", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("li");
		},
	});
	
	Object.defineProperties(Li.prototype,{
	});
	
	Li.Type = new Type("Li", Li, [DOMElement.Type, IAddChild.Type]);
	return Li;
});