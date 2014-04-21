/**
 * Figure
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Figure = declare("Figure", [DOMElement, IAddChild], {
		constructor:function(text){
			if(text === undefined){
				text = null;
			}
			
			this._dom = document.createElement("figure");
			
			if(text !=null){
				this._dom.appendChild(document.createTextNode(text));
			}
		},
	});
	
	Object.defineProperties(Figure.prototype,{
	});
	
	Figure.Type = new Type("Figure", Figure, [DOMElement.Type, IAddChild.Type]);
	return Figure;
});