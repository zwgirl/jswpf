/**
 * Select
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Select = declare("Select", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("select");
		},
	});
	
	Object.defineProperties(Select.prototype,{
	});
	
	Select.Type = new Type("Select", Select, [DOMElement.Type, IAddChild.Type]);
	return Select;
});