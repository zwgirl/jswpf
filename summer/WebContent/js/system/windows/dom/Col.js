/**
 * Col
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Col = declare("Col", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("col");
		},
	});
	
	Object.defineProperties(Col.prototype, {
		Span:
		{
			get:function(){ return this.GetValue(Col.SpanProperty);},
			set:function(value) {this.SetValue(Col.SpanProperty, value); }
		},
	});
	
	Object.defineProperties(Col, {
//		span	number
//      public static readonly DependencyProperty 
		SpanProperty:
		{
			get:function(){
				if(Col._SpanProperty === undefined){
					Col._SpanProperty= DependencyProperty.Register("Span", String.Type, Col.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Col._SpanProperty._domProp = "span";
				}
				return Col._SpanProperty;
			}
		},
	});
	
	Col.Type = new Type("Col", Col, [DOMElement.Type, IAddChild.Type]);
	return Col;
});