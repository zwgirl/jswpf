/**
 * Img
 */
define(["dojo/_base/declare", "system/Type", "dom/DOMElement", "markup/IAddChild",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, IAddChild,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Img = declare("Img", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("img");
		},
	});
	
	Object.defineProperties(Img.prototype,{
		Alt:
		{
			get:function(){ return this.GetValue(Img.AltProperty);},
			set:function(value) {this.SetValue(Img.AltProperty, value); }
		},
		Src:
		{
			get:function(){ return this.GetValue(Img.SrcProperty);},
			set:function(value) {this.SetValue(Img.SrcProperty, value); }
		},
		Ismap:
		{
			get:function(){ return this.GetValue(Img.IsmapProperty);},
			set:function(value) {this.SetValue(Img.IsmapProperty, value); }
		},
		Usemap:
		{
			get:function(){ return this.GetValue(Img.UsemapProperty);},
			set:function(value) {this.SetValue(Img.UsemapProperty, value); }
		},
		Width:
		{
			get:function(){ return this.GetValue(Img.WidthProperty);},
			set:function(value) {this.SetValue(Img.WidthProperty, value); }
		},
		Height:
		{
			get:function(){ return this.GetValue(Img.HeightProperty);},
			set:function(value) {this.SetValue(Img.HeightProperty, value); }
		},
	});
	
	Object.defineProperties(Img,{
//		alt	text
//        public static readonly DependencyProperty 
        AltProperty:
        {
        	get:function(){
        		if(Img._AltProperty === undefined){
        			Img._AltProperty= DependencyProperty.Register("Alt", String.Type, Img.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Img._AltProperty._domProp = "alt";
        		}
        		return Img._AltProperty;
        	}
        },
//    	ismap	ismap
//      public static readonly DependencyProperty 
        IsmapProperty:
        {
        	get:function(){
        		if(Img._IsmapProperty === undefined){
        			Img._IsmapProperty= DependencyProperty.Register("Ismap", String.Type, Img.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Img._AltProperty._domProp = "alt";
        		}
        		return Img._IsmapProperty;
        	}
        },
//    	src	URL 
//      public static readonly DependencyProperty 
        SrcProperty:
        {
        	get:function(){
        		if(Img._SrcProperty === undefined){
        			Img._SrcProperty= DependencyProperty.Register("Src", String.Type, Img.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Img._SrcProperty._domProp = "src";
        			
        		}
        		return Img._SrcProperty;
        	}
        },
//    	usemap	#mapname	
//      public static readonly DependencyProperty 
        UsemapProperty:
        {
        	get:function(){
        		if(Img._UsemapProperty === undefined){
        			Img._UsemapProperty= DependencyProperty.Register("Usemap", String.Type, Img.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Img._UsemapProperty._domProp = "usemap";
        		}
        		return Img._UsemapProperty;
        	}
        },
//    	width pixels % 
//      public static readonly DependencyProperty 
        WidthProperty:
        {
        	get:function(){
        		if(Img._WidthProperty === undefined){
        			Img._WidthProperty= DependencyProperty.Register("Width", String.Type, Img.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Img._WidthProperty._domProp = "width";
        		}
        		return Img._WidthProperty;
        	}
        },
        
//    	height	 pixels % 
//      public static readonly DependencyProperty 
        HeightProperty:
        {
        	get:function(){
        		if(Img._HeightProperty === undefined){
        			Img._HeightProperty= DependencyProperty.Register("Height", String.Type, Img.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Img._HeightProperty._domProp = "height";
        		}
        		return Img._HeightProperty;
        	}
        },
	});
	
	Img.Type = new Type("Img", Img, [DOMElement.Type, IAddChild.Type]);
	return Img;
});