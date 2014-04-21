/**
 * Canvas
 */

define(["dojo/_base/declare", "system/Type", "dom/DOMElement", 
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DOMElement, 
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Canvas = declare("Canvas", [DOMElement, IAddChild], {
		constructor:function(){
			this._dom = document.createElement("canvas");
		},
	});
	
	Object.defineProperties(Canvas.prototype, {
		Width:
		{
			get:function(){ return this.GetValue(Canvas.WidthProperty);},
			set:function(value) {this.SetValue(Canvas.WidthProperty, value); }
		},
		Height:
		{
			get:function(){ return this.GetValue(Canvas.HeightProperty);},
			set:function(value) {this.SetValue(Canvas.HeightProperty, value); }
		},
	});
	
	Object.defineProperties(Canvas, {
//    	width pixels %  
//      public static readonly DependencyProperty 
        WidthProperty:
        {
        	get:function(){
        		if(Canvas._WidthProperty === undefined){
        			Canvas._WidthProperty= DependencyProperty.Register("Width", String.Type, Canvas.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Canvas._WidthProperty._domProp = "width";
        		}
        		return Canvas._WidthProperty;
        	}
        },
        
//    	height	 pixels % 
//      public static readonly DependencyProperty 
        HeightProperty:
        {
        	get:function(){
        		if(Canvas._HeightProperty === undefined){
        			Canvas._HeightProperty= DependencyProperty.Register("Height", String.Type, Canvas.Type, 
                            FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
        			Canvas._HeightProperty._domProp = "height";
        		}
        		return Canvas._HeightProperty;
        	}
        },
	});
	
	Canvas.Type = new Type("Canvas", Canvas, [DOMElement.Type, IAddChild.Type]);
	return Canvas;
});