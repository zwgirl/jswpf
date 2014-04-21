/**
 * Footer
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Footer = declare("Footer", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("footer");
		},
	});
	
	Object.defineProperties(Footer.prototype,{
	});
	
	Footer.Type = new Type("Footer", Footer, [DOMElement.Type, IAddChild.Type]);
	return Footer;
});