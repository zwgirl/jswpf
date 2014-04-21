/**
 * Colgroup
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Colgroup = declare("Colgroup", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("colgroup");
		},
	});
	
	Object.defineProperties(Colgroup.prototype, {
		Span:
		{
			get:function(){ return this.GetValue(Colgroup.SpanProperty);},
			set:function(value) {this.SetValue(Colgroup.SpanProperty, value); }
		},
	});
	
	Object.defineProperties(Colgroup, {
//		span	number
//      public static readonly DependencyProperty 
		SpanProperty:
		{
			get:function(){
				if(Colgroup._SpanProperty === undefined){
					Colgroup._SpanProperty= DependencyProperty.Register("Span", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Colgroup._SpanProperty._domProp = "span";
				}
				return Colgroup._SpanProperty;
			}
		},
	});
	
	Colgroup.Type = new Type("Colgroup", Colgroup, [DOMElement.Type, IAddChild.Type]);
	return Colgroup;
});