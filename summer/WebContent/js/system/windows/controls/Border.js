/**
 * Border
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Border = declare("Border", null,{

	});
	
	Object.defineProperties(Border,{

//		border
//      public static readonly DependencyProperty 
        BorderProperty:
        {
        	get:function(){
        		if(Border._BorderProperty === undefined){
        			Border._BorderProperty = 
                        DependencyProperty.RegisterAttached(
                                "Border",              // Name
                                String.Type,         // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Border._BorderProperty._cssName = "border";
        		}
        		
        		return Border._BorderProperty;
        	}
        },
//        border-style
//        public static readonly DependencyProperty 
        StyleProperty:
        {
        	get:function(){
        		if(Border._StyleProperty === undefined){
        			Border._StyleProperty = 
                        DependencyProperty.RegisterAttached(
                                "Style",              // Name
                                String.Type,         // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Border._StyleProperty._cssName = "border-style";
        		}
        		
        		return Border._StyleProperty;
        	}
        },	
//		border-width
//        public static readonly DependencyProperty 
        WidthProperty:
        {
        	get:function(){
        		if(Border._WidthProperty === undefined){
        			Border._WidthProperty = 
        	            DependencyProperty.RegisterAttached("Width",     // Name
        	            		String.Type,         // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._WidthProperty._cssName = "border-width";
        		}
        		
        		return Border._WidthProperty;
        	}
        }, 
//		border-color
//        public static readonly DependencyProperty 
        ColorProperty:
        {
        	get:function(){
        		if(Border._ColorProperty === undefined){
        			Border._ColorProperty  =
        	            DependencyProperty.RegisterAttached("Color",       // Name 
        	            		String.Type,         // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._ColorProperty._cssName = "border-color";
        		}
        		
        		return Border._ColorProperty;
        	}
        },
//		border-bottom
//        public static readonly DependencyProperty 
        BottomProperty:
        {
        	get:function(){
        		if(Border._BottomProperty === undefined){
        			Border._BottomProperty = 
        	            DependencyProperty.RegisterAttached("Bottom",        // Name 
        	            		String.Type,           // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._BottomProperty._cssName = "border-bottom";
        		}
        		
        		return Border._BottomProperty;
        	}
        },
//		border-bottom-color
//        public static readonly DependencyProperty 
        BottomColorProperty:
        {
        	get:function(){
        		if(Border._BottomColorProperty === undefined){
        			Border._BottomColorProperty =
        	            DependencyProperty.RegisterAttached("BottomColor",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._BottomColorProperty._cssName = "border-bottom-color";
        		}
        		
        		return Border._BottomColorProperty;
        	}
        },
//		border-bottom-style
//      public static readonly DependencyProperty 
        BottomStyleProperty:
        {
        	get:function(){
        		if(Border._BottomStyleProperty === undefined){
        			Border._BottomStyleProperty =
        	            DependencyProperty.RegisterAttached("BottomStyle",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._BottomStyleProperty._cssName = "border-bottom-style";
        		}
        		
        		return Border._BottomStyleProperty;
        	}
        },
//      border-bottom-width  
//      public static readonly DependencyProperty 
        BottomWidthProperty:
        {
        	get:function(){
        		if(Border._BottomWidthProperty === undefined){
        			Border._BottomWidthProperty =
        	            DependencyProperty.RegisterAttached("BottomWidth",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._BottomWidthProperty._cssName = "border-bottom-width";
        		}
        		
        		return Border._BottomWidthProperty;
        	}
        },
//		border-left	简写属性，用于把左边框的所有属性设置到一个声明中。
//      public static readonly DependencyProperty 
        LeftProperty:
        {
        	get:function(){
        		if(Border._LeftProperty === undefined){
        			Border._LeftProperty =
        	            DependencyProperty.RegisterAttached("Left",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._LeftProperty._cssName = "border-left";
        		}
        		
        		return Border._LeftProperty;
        	}
        },
//		border-left-color	设置元素的左边框的颜色。
//      public static readonly DependencyProperty 
        LeftColorProperty:
        {
        	get:function(){
        		if(Border._LeftColorProperty === undefined){
        			Border._LeftColorProperty =
        	            DependencyProperty.RegisterAttached("LeftColor",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._LeftColorProperty._cssName = "border-left-color";
        		}
        		
        		return Border._LeftColorProperty;
        	}
        },
//		border-left-style	设置元素的左边框的样式。
//      public static readonly DependencyProperty 
        LeftStyleProperty:
        {
        	get:function(){
        		if(Border._LeftStyleProperty === undefined){
        			Border._LeftStyleProperty =
        	            DependencyProperty.RegisterAttached("LeftColor",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._LeftStyleProperty._cssName = "border-left-style";
        		}
        		
        		return Border._LeftStyleProperty;
        	}
        },
//		border-left-width	设置元素的左边框的宽度。//      public static readonly DependencyProperty 
        LeftWidthProperty:
        {
        	get:function(){
        		if(Border._LeftWidthProperty === undefined){
        			Border._LeftWidthProperty =
        	            DependencyProperty.RegisterAttached("LeftWidth",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._LeftWidthProperty._cssName = "border-left-width";
        		}
        		
        		return Border._LeftWidthProperty;
        	}
        },
//		border-right	简写属性，用于把右边框的所有属性设置到一个声明中。
//      public static readonly DependencyProperty 
        RightProperty:
        {
        	get:function(){
        		if(Border._RightProperty === undefined){
        			Border._RightProperty =
        	            DependencyProperty.RegisterAttached("Right",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._RightProperty._cssName = "border-right";
        		}
        		
        		return Border._RightProperty;
        	}
        },
//		border-right-color	设置元素的右边框的颜色。
//      public static readonly DependencyProperty 
        RightColorProperty:
        {
        	get:function(){
        		if(Border._RightColorProperty === undefined){
        			Border._RightColorProperty =
        	            DependencyProperty.RegisterAttached("RightColor",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._RightColorProperty._cssName = "border-right-color";
        		}
        		
        		return Border._RightColorProperty;
        	}
        },
//		border-right-style	设置元素的右边框的样式。
//      public static readonly DependencyProperty 
        RightStyleProperty:
        {
        	get:function(){
        		if(Border._RightStyleProperty === undefined){
        			Border._RightStyleProperty =
        	            DependencyProperty.RegisterAttached("RightStyle",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._RightStyleProperty._cssName = "border-right-style";
        		}
        		
        		return Border._RightStyleProperty;
        	}
        },
//		border-right-width	设置元素的右边框的宽度。
//      public static readonly DependencyProperty 
        RightWidthProperty:
        {
        	get:function(){
        		if(Border._RightWidthProperty === undefined){
        			Border._RightWidthProperty =
        	            DependencyProperty.RegisterAttached("RightWidth",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._RightWidthProperty._cssName = "border-right-width";
        		}
        		
        		return Border._RightWidthProperty;
        	}
        },
//		border-top	简写属性，用于把上边框的所有属性设置到一个声明中。
//      public static readonly DependencyProperty 
        TopProperty:
        {
        	get:function(){
        		if(Border._TopProperty === undefined){
        			Border._TopProperty =
        	            DependencyProperty.RegisterAttached("Top",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._TopProperty._cssName = "border-top";
        		}
        		
        		return Border._TopProperty;
        	}
        },
//		border-top-color	设置元素的上边框的颜色。
//      public static readonly DependencyProperty 
        TopColorProperty:
        {
        	get:function(){
        		if(Border._TopColorProperty === undefined){
        			Border._TopColorProperty =
        	            DependencyProperty.RegisterAttached("TopColor",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._TopColorProperty._cssName = "border-top-color";
        		}
        		
        		return Border._TopColorProperty;
        	}
        },
//		border-top-style	设置元素的上边框的样式。
//      public static readonly DependencyProperty 
        TopStyleProperty:
        {
        	get:function(){
        		if(Border._TopStyleProperty === undefined){
        			Border._TopStyleProperty =
        	            DependencyProperty.RegisterAttached("TopStyle",      // Name 
        	            		String.Type,      // Type
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._TopStyleProperty._cssName = "border-top-style";
        		}
        		
        		return Border._TopStyleProperty;
        	}
        },
//		border-top-width	设置元素的上边框的宽度。
//        public static readonly DependencyProperty 
        TopWidthProperty:
        {
        	get:function(){
        		if(Border._TopWidthProperty === undefined){
        			Border._TopWidthProperty =
        	            DependencyProperty.RegisterAttached("TopWidth",   // Name
        	            		String.Type,           // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._TopWidthProperty._cssName = "border-top-width";
        		}
        		
        		return Border._TopWidthProperty;
        	}
        },
//        border-radius
//        public static readonly DependencyProperty 
        RadiusProperty:
        {
        	get:function(){
        		if(Border._RadiusProperty === undefined){
        			Border._RadiusProperty =
        	            DependencyProperty.RegisterAttached("Radius",            // Name 
        	            		String.Type,  // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._RadiusProperty._cssName = "border-radius";
        		}
        		
        		return Border._RadiusProperty;
        	}
        },
        
//        border-top-left-radius:2em;
//      public static readonly DependencyProperty 
        TopLeftRadiusProperty:
        {
        	get:function(){
        		if(Border._TopLeftRadiusProperty === undefined){
        			Border._TopLeftRadiusProperty =
        	            DependencyProperty.RegisterAttached("TopLeftRadius",            // Name 
        	            		String.Type,  // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._TopLeftRadiusProperty._cssName = "border-top-left-radius";
        		}
        		
        		return Border._TopLeftRadiusProperty;
        	}
        },
//        border-top-right-radius:2em;
//      public static readonly DependencyProperty 
        TopRightRadiusProperty:
        {
        	get:function(){
        		if(Border._TopRightRadiusProperty === undefined){
        			Border._TopRightRadiusProperty =
        	            DependencyProperty.RegisterAttached("TopRightRadius",            // Name 
        	            		String.Type,  // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._TopRightRadiusProperty._cssName = "border-top-right-radius";
        		}
        		
        		return Border._TopRightRadiusProperty;
        	}
        },
//        border-bottom-right-radius:2em;
//      public static readonly DependencyProperty 
        BottomRightRadiusProperty:
        {
        	get:function(){
        		if(Border._BottomRightRadiusProperty === undefined){
        			Border._BottomRightRadiusProperty =
        	            DependencyProperty.RegisterAttached("BottomRightRadius",            // Name 
        	            		String.Type,  // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._BottomRightRadiusProperty._cssName = "border-bottom-right-radius";
        		}
        		
        		return Border._BottomRightRadiusProperty;
        	}
        },
//        border-bottom-left-radius:2em;
//      public static readonly DependencyProperty 
        BottomLeftRadiusProperty:
        {
        	get:function(){
        		if(Border._BottomLeftRadiusProperty === undefined){
        			Border._BottomLeftRadiusProperty =
        	            DependencyProperty.RegisterAttached("BottomLeftRadius",            // Name 
        	            		String.Type,  // Type
                                Border.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._BottomLeftRadiusProperty._cssName = "border-bottom-left-radius";
        		}
        		
        		return Border._BottomLeftRadiusProperty;
        	}
        },
        
//        border-image
//      public static readonly DependencyProperty 
        ImageProperty:
        {
        	get:function(){
        		if(Border._ImageProperty === undefined){
        			Border._ImageProperty =
        	            DependencyProperty.RegisterAttached("Image",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._ImageProperty._cssName = "border-image";
        		}
        		
        		return Border._ImageProperty;
        	}
        },

//        border-image-source
//      public static readonly DependencyProperty 
        ImageSourceProperty:
        {
        	get:function(){
        		if(Border._ImageSourceProperty === undefined){
        			Border._ImageSourceProperty =
        	            DependencyProperty.RegisterAttached("ImageSource",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._ImageSourceProperty._cssName = "border-image-source";
        		}
        		
        		return Border._ImageSourceProperty;
        	}
        },

//        border-image-slice
//      public static readonly DependencyProperty 
        ImageSliceProperty:
        {
        	get:function(){
        		if(Border._ImageSliceProperty === undefined){
        			Border._ImageSliceProperty =
        	            DependencyProperty.RegisterAttached("ImageSlice",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._ImageSliceProperty._cssName = "border-image-slice";
        		}
        		
        		return Border._ImageSliceProperty;
        	}
        },

//        border-image-width
//      public static readonly DependencyProperty 
        ImageWidthProperty:
        {
        	get:function(){
        		if(Border._ImageWidthProperty === undefined){
        			Border._ImageWidthProperty =
        	            DependencyProperty.RegisterAttached("ImageWidth",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Border._ImageWidthProperty._cssName = "border-image-width";
        		}
        		
        		return Border._ImageWidthProperty;
        	}
        },

//        border-image-outset
//      public static readonly DependencyProperty 
        ImageOutsetProperty:
        {
        	get:function(){
        		if(Border._ImageOutsetProperty === undefined){
        			Border._ImageOutsetProperty =
        	            DependencyProperty.RegisterAttached("ImageOutset",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._ImageOutsetProperty._cssName = "border-image-outset";
        		}
        		
        		return Border._ImageOutsetProperty;
        	}
        },

//        border-image-repeat
//      public static readonly DependencyProperty 
        ImageRepeatProperty:
        {
        	get:function(){
        		if(Border._ImageRepeatProperty === undefined){
        			Border._ImageRepeatProperty =
        	            DependencyProperty.RegisterAttached("ImageRepeat",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._ImageRepeatProperty._cssName = "border-image-repeat";
        		}
        		
        		return Border._ImageRepeatProperty;
        	}
        },

//        box-shadow
//        public static readonly DependencyProperty 
        BoxShadowProperty:
        {
        	get:function(){
        		if(Border._BoxShadowProperty === undefined){
        			Border._BoxShadowProperty =
        	            DependencyProperty.RegisterAttached("BoxShadow",       // Name 
        	            		String.Type,           // Type 
                                Border.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Border._BoxShadowProperty._cssName = "box-shadow";
        		}
        		
        		return Border._BoxShadowProperty;
        	}
        },

	});
	
    Border.Type = new Type("Border", Border, [Object.Type]);
	return Border;
});

 


