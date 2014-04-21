/**
 * Bdo
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Bdo = declare("Bdo", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("bdo");
		},
	});
	
	Object.defineProperties(Bdo.prototype,{
		Dir:
		{
			get:function(){ return this.GetValue(Bdo.DirProperty);},
			set:function(value) {this.SetValue(Bdo.DirProperty, value); }
		},
	});
	
	Object.defineProperties(Bdo,{
//		dir	 ltr| rtl| auto
//      public static readonly DependencyProperty 
		DirProperty:
		{
			get:function(){
				if(Bdo._DirProperty === undefined){
					Bdo._DirProperty= DependencyProperty.Register("Dir", String.Type, Bdo.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Bdo._DirProperty._domProp = "dir";
				}
				return Bdo._DirProperty;
			}
		},
	});
	
	Bdo.Type = new Type("Bdo", Bdo, [DOMElement.Type, IAddChild.Type]);
	return Bdo;
});