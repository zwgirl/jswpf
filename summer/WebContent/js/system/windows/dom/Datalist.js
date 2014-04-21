/**
 * Datalist
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Datalist = declare("Datalist", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("datalist");
		},
	});
	
	Object.defineProperties(Datalist.prototype, {
		Span:
		{
			get:function(){ return this.GetValue(Datalist.OpenProperty);},
			set:function(value) {this.SetValue(Datalist.OpenProperty, value); }
		},
	});
	
	Object.defineProperties(Datalist, {
//		open	open
//      public static readonly DependencyProperty 
		OpenProperty:
		{
			get:function(){
				if(Datalist._OpenProperty === undefined){
					Datalist._OpenProperty= DependencyProperty.Register("Open", String.Type, Datalist.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Datalist._OpenProperty._domProp = "open";
				}
				return Datalist._OpenProperty;
			}
		},
	});
	
	Datalist.Type = new Type("Datalist", Datalist, [DOMElement.Type, IAddChild.Type]);
	return Datalist;
});