/**
 * Del
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Del = declare("Del", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("del");
		},
	});
	
	Object.defineProperties(Del.prototype, {
		Cite:
		{
			get:function(){ return this.GetValue(Del.CiteProperty);},
			set:function(value) {this.SetValue(Del.CiteProperty, value); }
		},
		Datetime:
		{
			get:function(){ return this.GetValue(Del.DatetimeProperty);},
			set:function(value) {this.SetValue(Del.DatetimeProperty, value); }
		},
	});
	
	Object.defineProperties(Del, {
//		cite	URL
//      public static readonly DependencyProperty 
		CiteProperty:
		{
			get:function(){
				if(Del._CiteProperty === undefined){
					Del._CiteProperty= DependencyProperty.Register("Cite", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Del._CiteProperty._domProp = "cite";
				}
				return Del._CiteProperty;
			}
		},
//		datetime	YYYY-MM-DDThh:mm:ssTZD
//      public static readonly DependencyProperty 
		DatetimeProperty:
		{
			get:function(){
				if(Del._DatetimeProperty === undefined){
					Del._DatetimeProperty= DependencyProperty.Register("Datetime", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Del._DatetimeProperty._domProp = "datetime";
				}
				return Del._DatetimeProperty;
			}
		},
	});
	
	Del.Type = new Type("Del", Del, [DOMElement.Type, IAddChild.Type]);
	return Del;
});