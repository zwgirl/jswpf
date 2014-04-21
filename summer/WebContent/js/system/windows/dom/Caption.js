/**
 * Cite
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Cite = declare("Cite", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("cite");
		},
	});
	
	Object.defineProperties(Cite.prototype,{
	});
	
	Cite.Type = new Type("Cite", Cite, [DOMElement.Type, IAddChild.Type]);
	return Cite;
});