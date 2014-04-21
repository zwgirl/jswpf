/**
 * A
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", 
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, 
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var A = declare("A", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("a");
		},
	});
	
	Object.defineProperties(A.prototype,{
		Href:
		{
			get:function(){ return this.GetValue(A.HrefProperty);},
			set:function(value) {this.SetValue(A.HrefProperty, value); }
		},
		Hreflang:
		{
			get:function(){ return this.GetValue(A.HreflangProperty);},
			set:function(value) {this.SetValue(A.HreflangProperty, value); }
		},
		Media:
		{
			get:function(){ return this.GetValue(A.MediaProperty);},
			set:function(value) {this.SetValue(A.MediaProperty, value); }
		},
		Rel:
		{
			get:function(){ return this.GetValue(A.RelProperty);},
			set:function(value) {this.SetValue(A.RelProperty, value); }
		},
		Target:
		{
			get:function(){ return this.GetValue(A.TargetProperty);},
			set:function(value) {this.SetValue(A.TargetProperty, value); }
		},
		Type:
		{
			get:function(){ return this.GetValue(A.TypeProperty);},
			set:function(value) {this.SetValue(A.TypeProperty, value); }
		},
	});
	
	Object.defineProperties(A,{
//		href	URL	链接的目标 URL。
//  	public static readonly DependencyProperty 
		HrefProperty:
		{
			get:function(){
				if(A._HrefProperty === undefined){
					A._HrefProperty= DependencyProperty.Register("Href", String.Type, A.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					A._HrefProperty._domProp = "href";
				}
				return A._HrefProperty;
			}
		},
//		hreflang	language_code	规定目标 URL 的基准语言。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		HreflangProperty:
		{
			get:function(){
				if(A._HreflangProperty === undefined){
					A._HreflangProperty= DependencyProperty.Register("Hreflang", String.Type, A.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					A._HreflangProperty._domProp = "hreflang";
				}
				return A._HreflangProperty;
			}
		},
//		media	media query	规定目标 URL 的媒介类型。 默认值：all。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		MediaProperty:
		{
			get:function(){
				if(A._MediaProperty === undefined){
					A._MediaProperty= DependencyProperty.Register("Media", String.Type, A.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					A._MediaProperty._domProp = "media";
				}
				return A._MediaProperty;
			}
		},
//		rel	alternate  up	规定当前文档与目标 URL 之间的关系。 仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		RelProperty:
		{
			get:function(){
				if(A._RelProperty === undefined){
					A._RelProperty= DependencyProperty.Register("Rel", String.Type, A.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					A._RelProperty._domProp = "href";
				}
				return A._RelProperty;
			}
		},
//		target	_blank  _parent _self _top	在何处打开目标 URL。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		TargetProperty:
		{
			get:function(){
				if(A._TargetProperty === undefined){
					A._TargetProperty= DependencyProperty.Register("Target", String.Type, A.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					A._TargetProperty._domProp = "target";
				}
				return A._TargetProperty;
			}
		},
//		type	mime_type	规定目标 URL 的 MIME 类型。仅在 href 属性存在时使用。
//  	public static readonly DependencyProperty 
		TypeProperty:
		{
			get:function(){
				if(A._TypeProperty === undefined){
					A._TypeProperty= DependencyProperty.Register("Type", String.Type, A.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					A._TypeProperty._domProp = "type";
				}
				return A._HrefProperty;
			}
		},
	});
	
	A.Type = new Type("A", A, [DOMElement.Type, IAddChild.Type]);
	return A;
});

