/**
 * Legend
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Legend = declare("Legend", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("legend");
		},
	});
	
	Object.defineProperties(Legend.prototype,{
	});
	
	Legend.Type = new Type("Legend", Legend, [DOMElement.Type, IAddChild.Type]);
	return Legend;
});