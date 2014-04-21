/**
 * B
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var B = declare("B", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("b");
		},
	});
	
	Object.defineProperties(B.prototype,{
	});
	
	B.Type = new Type("B", B, [DOMElement.Type, IAddChild.Type]);
	return B;
});