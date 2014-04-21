/**
 * Embed
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Embed = declare("Embed", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("embed");
		},
	});
	
	Object.defineProperties(Embed.prototype, {
		Height:
		{
			get:function(){ return this.GetValue(Embed.HeightProperty);},
			set:function(value) {this.SetValue(Embed.HeightProperty, value); }
		},
		Src:
		{
			get:function(){ return this.GetValue(Embed.SrcProperty);},
			set:function(value) {this.SetValue(Embed.SrcProperty, value); }
		},
		Type:
		{
			get:function(){ return this.GetValue(Embed.TypeProperty);},
			set:function(value) {this.SetValue(Embed.TypeProperty, value); }
		},
		Width:
		{
			get:function(){ return this.GetValue(Embed.WidthProperty);},
			set:function(value) {this.SetValue(Embed.WidthProperty, value); }
		},
	});
	
	Object.defineProperties(Embed, {
//		height	pixels	
//      public static readonly DependencyProperty 
		HeightProperty:
		{
			get:function(){
				if(Embed._HeightProperty === undefined){
					Embed._HeightProperty= DependencyProperty.Register("Height", String.Type, Embed.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Embed._HeightProperty._domProp = "height";
				}
				return Embed._HeightProperty;
			}
		},
//		src	url	
//      public static readonly DependencyProperty 
		SrcProperty:
		{
			get:function(){
				if(Embed._SrcProperty === undefined){
					Embed._SrcProperty= DependencyProperty.Register("Src", String.Type, Embed.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Embed._SrcProperty._domProp = "src";
				}
				return Embed._SrcProperty;
			}
		},
//		type	type
//      public static readonly DependencyProperty 
		TypeProperty:
		{
			get:function(){
				if(Embed._TypeProperty === undefined){
					Embed._TypeProperty= DependencyProperty.Register("Type", String.Type, Embed.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Embed._TypeProperty._domProp = "type";
				}
				return Embed._TypeProperty;
			}
		},
//		width	pixels		
//      public static readonly DependencyProperty 
		WidthProperty:
		{
			get:function(){
				if(Embed._WidthProperty === undefined){
					Embed._WidthProperty= DependencyProperty.Register("Width", String.Type, Embed.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Embed._WidthProperty._domProp = "width";
				}
				return Embed._WidthProperty;
			}
		},
	});
	
	Embed.Type = new Type("Embed", Embed, [DOMElement.Type, IAddChild.Type]);
	return Embed;
});