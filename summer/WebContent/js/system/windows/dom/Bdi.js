/**
 * Bdi
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Bdi = declare("Bdi", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("bdi");
		},
	});
	
	Object.defineProperties(Bdi.prototype,{
		Dir:
		{
			get:function(){ return this.GetValue(Bdi.DirProperty);},
			set:function(value) {this.SetValue(Bdi.DirProperty, value); }
		},
	});
	
	Object.defineProperties(Bdi,{
//		dir	 ltr| rtl| auto
//      public static readonly DependencyProperty 
		DirProperty:
		{
			get:function(){
				if(Bdi._DirProperty === undefined){
					Bdi._DirProperty= DependencyProperty.Register("Dir", String.Type, Bdi.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Bdi._DirProperty._domProp = "dir";
				}
				return Bdi._DirProperty;
			}
		},
	});
	
	Bdi.Type = new Type("Bdi", Bdi, [DOMElement.Type, IAddChild.Type]);
	return Bdi;
});