/**
 * Ins
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Ins = declare("Ins", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("ins");
		},
	});
	
	Object.defineProperties(Ins.prototype, {
		Cite:
		{
			get:function(){ return this.GetValue(Ins.CiteProperty);},
			set:function(value) {this.SetValue(Ins.CiteProperty, value); }
		},
		Datetime:
		{
			get:function(){ return this.GetValue(Ins.DatetimeProperty);},
			set:function(value) {this.SetValue(Ins.DatetimeProperty, value); }
		},
	});
	
	Object.defineProperties(Ins, {
//		cite	URL
//      public static readonly DependencyProperty 
		CiteProperty:
		{
			get:function(){
				if(Ins._CiteProperty === undefined){
					Ins._CiteProperty= DependencyProperty.Register("Cite", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Ins._CiteProperty._domProp = "cite";
				}
				return Ins._CiteProperty;
			}
		},
//		datetime	YYYY-MM-DDThh:mm:ssTZD
//      public static readonly DependencyProperty 
		DatetimeProperty:
		{
			get:function(){
				if(Ins._DatetimeProperty === undefined){
					Ins._DatetimeProperty= DependencyProperty.Register("Datetime", String.Type, Colgroup.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Ins._DatetimeProperty._domProp = "datetime";
				}
				return Ins._DatetimeProperty;
			}
		},
	});
	
	Ins.Type = new Type("Ins", Ins, [DOMElement.Type, IAddChild.Type]);
	return Ins;
});