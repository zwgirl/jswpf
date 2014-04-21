/**
 * Video
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Video = declare("Video", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("video");
		},
	});
	
	Object.defineProperties(Video.prototype, {
		Autoplay:
		{
			get:function(){ return this.GetValue(Video.AutoplayProperty);},
			set:function(value) {this.SetValue(Video.AutoplayProperty, value); }
		},
		Controls:
		{
			get:function(){ return this.GetValue(Video.ControlsProperty);},
			set:function(value) {this.SetValue(Video.ControlsProperty, value); }
		},
		Loop:
		{
			get:function(){ return this.GetValue(Video.LoopProperty);},
			set:function(value) {this.SetValue(Video.LoopProperty, value); }
		},
		Preload:
		{
			get:function(){ return this.GetValue(Video.PreloadProperty);},
			set:function(value) {this.SetValue(Video.PreloadProperty, value); }
		},
		Src:
		{
			get:function(){ return this.GetValue(Video.SrcProperty);},
			set:function(value) {this.SetValue(Video.SrcProperty, value); }
		},
		Width:
		{
			get:function(){ return this.GetValue(Video.WidthProperty);},
			set:function(value) {this.SetValue(Video.WidthProperty, value); }
		},
		Height:
		{
			get:function(){ return this.GetValue(Video.HeightProperty);},
			set:function(value) {this.SetValue(Video.HeightProperty, value); }
		},
	});
	
	Object.defineProperties(Video, {
//		autoplay	autoplay
//  	public static readonly DependencyProperty 
		AutoplayProperty:
		{
			get:function(){
				if(Video._AutoplayProperty === undefined){
					Video._AutoplayProperty= DependencyProperty.Register("Autoplay", String.Type, Video.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Video._AutoplayProperty._domProp = "autoplay";
				}
				return Video._AutoplayProperty;
			}
		},
//		controls	controls
//  	public static readonly DependencyProperty 
		ControlsProperty:
		{
			get:function(){
				if(Video._ControlsProperty === undefined){
					Video._ControlsProperty= DependencyProperty.Register("Controls", String.Type, Video.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Video._ControlsProperty._domProp = "controls";
				}
				return Video._ControlsProperty;
			}
		},
//		loop	loop
//  	public static readonly DependencyProperty 
		LoopProperty:
		{
			get:function(){
				if(Video._LoopProperty === undefined){
					Video._LoopProperty= DependencyProperty.Register("Loop", String.Type, Video.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Video._LoopProperty._domProp = "loop";
				}
				return Video._LoopProperty;
			}
		},
//		preload	preload	
//  	public static readonly DependencyProperty 
		PreloadProperty:
		{
			get:function(){
				if(Video._PreloadProperty === undefined){
					Video._PreloadProperty= DependencyProperty.Register("Preload", String.Type, Video.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Video._PreloadProperty._domProp = "preload";
				}
				return Video._PreloadProperty;
			}
		},
//		src	url
//  	public static readonly DependencyProperty 
		SrcProperty:
		{
			get:function(){
				if(Video._SrcProperty === undefined){
					Video._SrcProperty= DependencyProperty.Register("Src", String.Type, Video.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Video._SrcProperty._domProp = "src";
				}
				return Video._SrcProperty;
			}
		},
//    	width pixels % 
//      public static readonly DependencyProperty 
        WidthProperty:
        {
        	get:function(){
        		if(Video._WidthProperty === undefined){
        			Video._WidthProperty= DependencyProperty.Register("Width", String.Type, Video.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Video._WidthProperty._domProp = "width";
        		}
        		return Video._WidthProperty;
        	}
        },
        
//    	height	 pixels % 
//      public static readonly DependencyProperty 
        HeightProperty:
        {
        	get:function(){
        		if(Video._HeightProperty === undefined){
        			Video._HeightProperty= DependencyProperty.Register("Height", String.Type, Video.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Video._HeightProperty._domProp = "height";
        		}
        		return Video._HeightProperty;
        	}
        },
	});
	
	Video.Type = new Type("Video", Video, [DOMElement.Type, IAddChild.Type]);
	return Video;
});