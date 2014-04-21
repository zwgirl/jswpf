/**
 * Button
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Button = declare("Button", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("button");
		},
	});
	
	Object.defineProperties(Button.prototype,{
	});
	
	Button.Type = new Type("Button", Button, [DOMElement.Type, IAddChild.Type]);
	return Button;
});