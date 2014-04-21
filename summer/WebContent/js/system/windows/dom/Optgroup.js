/**
 * Optgroup
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Optgroup = declare("Optgroup", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("optgroup");
		},
	});
	
	Object.defineProperties(Optgroup.prototype,{
	});
	
	Optgroup.Type = new Type("Optgroup", Optgroup, [DOMElement.Type, IAddChild.Type]);
	return Optgroup;
});