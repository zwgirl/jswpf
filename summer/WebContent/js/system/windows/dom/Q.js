/**
 * Q
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Q = declare("Q", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("q");
		},
	});
	
	Object.defineProperties(Q.prototype,{
	});
	
	Q.Type = new Type("Q", Q, [DOMElement.Type, IAddChild.Type]);
	return Q;
});