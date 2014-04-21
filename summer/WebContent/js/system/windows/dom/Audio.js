/**
 * Audio
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Audio = declare("Audio", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("audio");
		},
	});

	Object.defineProperties(Audio.prototype, {
		Autoplay:
		{
			get:function(){ return this.GetValue(Audio.AutoplayProperty);},
			set:function(value) {this.SetValue(Audio.AutoplayProperty, value); }
		},
		Controls:
		{
			get:function(){ return this.GetValue(Audio.ControlsProperty);},
			set:function(value) {this.SetValue(Audio.ControlsProperty, value); }
		},
		Loop:
		{
			get:function(){ return this.GetValue(Audio.LoopProperty);},
			set:function(value) {this.SetValue(Audio.LoopProperty, value); }
		},
		Preload:
		{
			get:function(){ return this.GetValue(Audio.PreloadProperty);},
			set:function(value) {this.SetValue(Audio.PreloadProperty, value); }
		},
		Src:
		{
			get:function(){ return this.GetValue(Audio.SrcProperty);},
			set:function(value) {this.SetValue(Audio.SrcProperty, value); }
		},
	});
	
	Object.defineProperties(Audio, {
//		autoplay	autoplay
//  	public static readonly DependencyProperty 
		AutoplayProperty:
		{
			get:function(){
				if(Audio._AutoplayProperty === undefined){
					Audio._AutoplayProperty= DependencyProperty.Register("Autoplay", String.Type, Audio.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Audio._AutoplayProperty._domProp = "autoplay";
				}
				return Audio._AutoplayProperty;
			}
		},
//		controls	controls
//  	public static readonly DependencyProperty 
		ControlsProperty:
		{
			get:function(){
				if(Audio._ControlsProperty === undefined){
					Audio._ControlsProperty= DependencyProperty.Register("Controls", String.Type, Audio.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Audio._ControlsProperty._domProp = "controls";
				}
				return Audio._ControlsProperty;
			}
		},
//		loop	loop
//  	public static readonly DependencyProperty 
		LoopProperty:
		{
			get:function(){
				if(Audio._LoopProperty === undefined){
					Audio._LoopProperty= DependencyProperty.Register("Loop", String.Type, Audio.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Audio._LoopProperty._domProp = "loop";
				}
				return Audio._LoopProperty;
			}
		},
//		preload	preload	
//  	public static readonly DependencyProperty 
		PreloadProperty:
		{
			get:function(){
				if(Audio._PreloadProperty === undefined){
					Audio._PreloadProperty= DependencyProperty.Register("Preload", String.Type, Audio.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Audio._PreloadProperty._domProp = "preload";
				}
				return Audio._PreloadProperty;
			}
		},
//		src	url
//  	public static readonly DependencyProperty 
		SrcProperty:
		{
			get:function(){
				if(Audio._SrcProperty === undefined){
					Audio._SrcProperty= DependencyProperty.Register("Src", String.Type, Audio.Type, 
			                  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Audio._SrcProperty._domProp = "src";
				}
				return Audio._SrcProperty;
			}
		},
	});
	
	Audio.Type = new Type("Audio", Audio, [DOMElement.Type, IAddChild.Type]);
	return Audio;
});