/**
 * Address
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Address = declare("Address", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("address");
		},
	});
	
	Object.defineProperties(Address.prototype,{
	});
	
	Address.Type = new Type("Address", Address, [DOMElement.Type, IAddChild.Type]);
	return Address;
});