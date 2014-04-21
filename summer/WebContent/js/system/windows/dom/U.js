/**
 * U
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var U = declare("U", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("u");
		},
	});
	
	Object.defineProperties(U.prototype,{
	});
	
	U.Type = new Type("U", U, [DOMElement.Type, IAddChild.Type]);
	return U;
});