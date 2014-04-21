/**
 * Outline
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Outline = declare("Outline", null,{

	});
	
	Object.defineProperties(Outline,{
//		outline	设置围绕元素的轮廓颜色	5M	1	9	Yes
//      public static readonly DependencyProperty 
		OutlineProperty:
		{
	      	get:function(){
	      		if(Outline._OutlineProperty === undefined){
	      			Outline._OutlineProperty = 
	                      DependencyProperty.RegisterAttached(
	                              "Outline",              // Name
	                              String.Type,         // Type
	                              Outline.Type, // Owner 
	                              FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
	      			Outline._OutlineProperty._cssName = "outline";
	      		}
	      		
	      		return Outline._OutlineProperty;
	      	}
		},
//		outlineColor	设置围绕元素的轮廓颜色	5M	1	9	Yes
//        public static readonly DependencyProperty 
        ColorProperty:
        {
        	get:function(){
        		if(Outline._ColorProperty === undefined){
        			Outline._ColorProperty = 
                        DependencyProperty.RegisterAttached(
                                "Color",              // Name
                                String.Type,         // Type
                                Outline.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Outline._ColorProperty._cssName = "outlineColor";
        		}
        		
        		return Outline._ColorProperty;
        	}
        },	
//		outlineStyle	设置围绕元素的轮廓样式	5M	1	9	Yes
//        public static readonly DependencyProperty 
        StyleProperty:
        {
        	get:function(){
        		if(Outline._StyleProperty === undefined){
        			Outline._StyleProperty = 
        	            DependencyProperty.RegisterAttached("Style",     // Name
        	            		String.Type,         // Type
                                Outline.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Outline._StyleProperty._cssName = "outlineStyle";
        		}
        		
        		return Outline._StyleProperty;
        	}
        }, 
//		outlineWidth	设置围绕元素的轮廓宽度	5M	1	9	Yes
//        public static readonly DependencyProperty 
        WidthProperty:
        {
        	get:function(){
        		if(Outline._WidthProperty === undefined){
        			Outline._WidthProperty  =
        	            DependencyProperty.RegisterAttached("Width",       // Name 
        	            		String.Type,         // Type
                                Outline.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Outline._WidthProperty._cssName = "outlineWidth";
        		}
        		
        		return Outline._WidthProperty;
        	}
        },

	});
	
    Outline.Type = new Type("Outline", Outline, [Object.Type]);
	return Outline;
});

 


