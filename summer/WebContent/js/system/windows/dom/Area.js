/**
 * Area
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Area = declare("Area", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("area");
		},
	});
	
	Object.defineProperties(Area.prototype,{
		Alt:
		{
			get:function(){ return this.GetValue(Area.AltProperty);},
			set:function(value) {this.SetValue(Area.AltProperty, value); }
		},
		Href:
		{
			get:function(){ return this.GetValue(Area.HrefProperty);},
			set:function(value) {this.SetValue(Area.HrefProperty, value); }
		},
		Hreflang:
		{
			get:function(){ return this.GetValue(Area.HreflangProperty);},
			set:function(value) {this.SetValue(Area.HreflangProperty, value); }
		},
		Media:
		{
			get:function(){ return this.GetValue(Area.MediaProperty);},
			set:function(value) {this.SetValue(Area.MediaProperty, value); }
		},
		Rel:
		{
			get:function(){ return this.GetValue(Area.RelProperty);},
			set:function(value) {this.SetValue(Area.RelProperty, value); }
		},
		Target:
		{
			get:function(){ return this.GetValue(Area.TargetProperty);},
			set:function(value) {this.SetValue(Area.TargetProperty, value); }
		},
		Type:
		{
			get:function(){ return this.GetValue(Area.TypeProperty);},
			set:function(value) {this.SetValue(Area.TypeProperty, value); }
		},
		Coords:
		{
			get:function(){ return this.GetValue(Area.CoordsProperty);},
			set:function(value) {this.SetValue(Area.CoordsProperty, value); }
		},
		Shape:
		{
			get:function(){ return this.GetValue(Area.ShapeProperty);},
			set:function(value) {this.SetValue(Area.ShapeProperty, value); }
		},
	});
	
	Object.defineProperties(Area, {
//		alt	text	规定图像的替代文本。
//      public static readonly DependencyProperty 
		AltProperty:
		{
			get:function(){
				if(Area._AltProperty === undefined){
					Area._AltProperty= DependencyProperty.Register("Alt", String.Type, Area.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._AltProperty._domProp = "alt";
				}
				return Area._AltProperty;
			}
		},
//		href	URL	链接的目标 URL。
//  	public static readonly DependencyProperty 
		HrefProperty:
		{
			get:function(){
				if(Area._HrefProperty === undefined){
					Area._HrefProperty= DependencyProperty.Register("Href", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._HrefProperty._domProp = "href";
				}
				return Area._HrefProperty;
			}
		},
//		hreflang	language_code	规定目标 URL 的基准语言。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		HreflangProperty:
		{
			get:function(){
				if(Area._HreflangProperty === undefined){
					Area._HreflangProperty= DependencyProperty.Register("Hreflang", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._HreflangProperty._domProp = "hreflang";
				}
				return Area._HreflangProperty;
			}
		},
//		media	media query	规定目标 URL 的媒介类型。 默认值：all。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		MediaProperty:
		{
			get:function(){
				if(Area._MediaProperty === undefined){
					Area._MediaProperty= DependencyProperty.Register("Media", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._MediaProperty._domProp = "media";
				}
				return Area._MediaProperty;
			}
		},
//		rel	alternate  up	规定当前文档与目标 URL 之间的关系。 仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		RelProperty:
		{
			get:function(){
				if(Area._RelProperty === undefined){
					Area._RelProperty= DependencyProperty.Register("Rel", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._RelProperty._domProp = "href";
				}
				return Area._RelProperty;
			}
		},
//		target	_blank  _parent _self _top	在何处打开目标 URL。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		TargetProperty:
		{
			get:function(){
				if(Area._TargetProperty === undefined){
					Area._TargetProperty= DependencyProperty.Register("Target", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._TargetProperty._domProp = "target";
				}
				return Area._TargetProperty;
			}
		},
//		type	mime_type	规定目标 URL 的 MIME 类型。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		TypeProperty:
		{
			get:function(){
				if(Area._TypeProperty === undefined){
					Area._TypeProperty= DependencyProperty.Register("Type", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._TypeProperty._domProp = "type";
				}
				return Area._HrefProperty;
			}
		},
//		shape	rect rectangle circle poly polygon	规定区域的形状。
//  	public static readonly DependencyProperty 
		ShapeProperty:
		{
			get:function(){
				if(Area._ShapeProperty === undefined){
					Area._ShapeProperty= DependencyProperty.Register("Shape", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._ShapeProperty._domProp = "shape";
				}
				return Area._ShapeProperty;
			}
		},
//		coords	coordinates	规定区域的坐标。
//  	public static readonly DependencyProperty 
		CoordsProperty:
		{
			get:function(){
				if(Area._CoordsProperty === undefined){
					Area._CoordsProperty= DependencyProperty.Register("Coords", String.Type, Area.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Area._CoordsProperty._domProp = "coords";
				}
				return Area._CoordsProperty;
			}
		},
	});
	
	Area.Type = new Type("Area", Area, [DOMElement.Type, IAddChild.Type]);
	return Area;
});