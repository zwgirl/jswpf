/**
 * Sub
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Sub = declare("Sub", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("sub");
		},
	});
	
	Object.defineProperties(Sub.prototype,{
	});
	
	Sub.Type = new Type("Sub", Sub, [DOMElement.Type, IAddChild.Type]);
	return Sub;
});