/**
 * Track
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Track = declare("Track", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("track");
		},
	});
	
	Object.defineProperties(Track.prototype,{
	});
	
	Track.Type = new Type("Track", Track, [DOMElement.Type, IAddChild.Type]);
	return Track;
});