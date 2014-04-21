/**
 * Em
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Em = declare("Em", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("em");
		},
	});
	
	Object.defineProperties(Em.prototype,{
	});
	
	Em.Type = new Type("Em", Em, [DOMElement.Type, IAddChild.Type]);
	return Em;
});