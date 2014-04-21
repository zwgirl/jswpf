/**
 * Td
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Td = declare("Td", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("td");
		},
	});
	
	Object.defineProperties(Td.prototype, {
		Colspan:
		{
			get:function(){ return this.GetValue(Td.ColspanProperty);},
			set:function(value) {this.SetValue(Td.ColspanProperty, value); }
		},
		Rowspan:
		{
			get:function(){ return this.GetValue(Td.RowspanProperty);},
			set:function(value) {this.SetValue(Td.RowspanProperty, value); }
		},
		Headers:
		{
			get:function(){ return this.GetValue(Td.HeadersProperty);},
			set:function(value) {this.SetValue(Td.HeadersProperty, value); }
		},
	});
	
	Object.defineProperties(Td, {
//		colspan	number
//      public static readonly DependencyProperty 
		ColspanProperty:
		{
			get:function(){
				if(Td._ColspanProperty === undefined){
					Td._ColspanProperty= DependencyProperty.Register("Colspan", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Td._ColspanProperty._domProp = "colspan";
				}
				return Td._ColspanProperty;
			}
		},
//		rowspan	number
//      public static readonly DependencyProperty 
		RowspanProperty:
		{
			get:function(){
				if(Td._RowspanProperty === undefined){
					Td._RowspanProperty= DependencyProperty.Register("Rowspan", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Td._RowspanProperty._domProp = "rowspan";
				}
				return Td._RowspanProperty;
			}
		},
//		headers	header_id
//      public static readonly DependencyProperty 
		HeadersProperty:
		{
			get:function(){
				if(Td._HeadersProperty === undefined){
					Td._HeadersProperty= DependencyProperty.Register("Headers", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Td._HeadersProperty._domProp = "headers";
				}
				return Td._HeadersProperty;
			}
		},
	});
	
	Td.Type = new Type("Td", Td, [DOMElement.Type, IAddChild.Type]);
	return Td;
});