/**
 * Caption
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Caption = declare("Caption", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("caption");
		},
	});
	
	Object.defineProperties(Caption.prototype,{
	});
	
	Caption.Type = new Type("Caption", Caption, [DOMElement.Type, IAddChild.Type]);
	return Caption;
});