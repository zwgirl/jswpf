/**
 * Map
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Map = declare("Map", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("map");
		},
	});
	
	Map.Type = new Type("Map", Map, [DOMElement.Type, IAddChild.Type]);
	return Map;
});