/**
 * Blockquote
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Blockquote = declare("Blockquote", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("blockquote");
		},
	});
	
	Object.defineProperties(Blockquote.prototype,{
		Cite:
		{
			get:function(){ return this.GetValue(Blockquote.CiteProperty);},
			set:function(value) {this.SetValue(Blockquote.CiteProperty, value); }
		},
	});
	
	Object.defineProperties(Blockquote,{
//		cite	URL
//      public static readonly DependencyProperty 
		CiteProperty:
		{
			get:function(){
				if(Blockquote._CiteProperty === undefined){
					Blockquote._CiteProperty= DependencyProperty.Register("Cite", String.Type, Blockquote.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Blockquote._CiteProperty._domProp = "cite";
				}
				return Blockquote._CiteProperty;
			}
		},
	});
	
	Blockquote.Type = new Type("Blockquote", Blockquote, [DOMElement.Type, IAddChild.Type]);
	return Blockquote;
});