/**
 * P
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var P = declare("P", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("p");
		},
	});
	
	Object.defineProperties(P.prototype,{
	});
	
	P.Type = new Type("P", P, [DOMElement.Type, IAddChild.Type]);
	return P;
});