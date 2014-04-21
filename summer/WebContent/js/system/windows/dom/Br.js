/**
 * Br
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Br = declare("Br", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("br");
		},
	});
	
	Object.defineProperties(Br.prototype,{
	});
	
	Br.Type = new Type("Br", Br, [DOMElement.Type, IAddChild.Type]);
	return Br;
});