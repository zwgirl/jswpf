/**
 * Kbd
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Kbd = declare("Kbd", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("kbd");
		},
	});
	
	Object.defineProperties(Kbd.prototype,{
	});
	
	Kbd.Type = new Type("Kbd", Kbd, [DOMElement.Type, IAddChild.Type]);
	return Kbd;
});