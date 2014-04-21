/**
 * Code
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Code = declare("Code", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("code");
		},
	});
	
	Object.defineProperties(Code.prototype,{
	});
	
	Code.Type = new Type("Code", Code, [DOMElement.Type, IAddChild.Type]);
	return Code;
});