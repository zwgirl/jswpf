/**
 * Ruby
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Ruby = declare("Ruby", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("ruby");
		},
	});
	
	Object.defineProperties(Ruby.prototype,{
	});
	
	Ruby.Type = new Type("Ruby", Ruby, [DOMElement.Type, IAddChild.Type]);
	return Ruby;
});