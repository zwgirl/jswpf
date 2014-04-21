/**
 * Font
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Font = declare("Font", null,{

	});
	
	Object.defineProperties(Font,{
//		font	在一行设置所有的字体属性	4	1	9	Yes
//        public static readonly DependencyProperty 
		FontProperty:
        {
        	get:function(){
        		if(Font._FontProperty === undefined){
        			Font._FontProperty = 
                        DependencyProperty.RegisterAttached(
                                "Font",              // Name
                                String.Type,         // Type
                                Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Font._FontProperty._cssName = "font";
        		}
        		
        		return Font._FontProperty;
        	}
        },	
//		font-family	设置元素的字体系列。	4	1	9	Yes
//        public static readonly DependencyProperty 
        FontFamilyProperty:
        {
        	get:function(){
        		if(Font._FontFamilyProperty === undefined){
        			Font._FontFamilyProperty = 
        	            DependencyProperty.RegisterAttached("FontFamily",     // Name
        	            		String.Type,         // Type
        	            		Font.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Font._FontFamilyProperty._cssName = "font-family";
        		}
        		
        		return Font._FontFamilyProperty;
        	}
        }, 
//		font-size	设置元素的字体大小。	4	1	9	Yes
//        public static readonly DependencyProperty 
        FontSizeProperty:
        {
        	get:function(){
        		if(Font._FontSizeProperty === undefined){
        			Font._FontSizeProperty  =
        	            DependencyProperty.RegisterAttached("FontSize",       // Name 
        	            		String.Type,         // Type
        	            		Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Font._FontSizeProperty._cssName = "font-size";
        		}
        		
        		return Font._FontSizeProperty;
        	}
        },
//		font-size-adjust	设置/调整文本的尺寸	5M	1	No	Yes
//        public static readonly DependencyProperty 
        FontSizeAdjustProperty:
        {
        	get:function(){
        		if(Font._FontSizeAdjustProperty === undefined){
        			Font._FontSizeAdjustProperty = 
        	            DependencyProperty.RegisterAttached("FontSizeAdjust",        // Name 
        	            		String.Type,           // Type
        	            		Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Font._FontSizeAdjustProperty._cssName = "font-size-adjust";
        		}
        		
        		return Font._FontSizeAdjustProperty;
        	}
        },
        
//    	font-stretch	设置如何紧缩或伸展字体	5M	No	No	Yes
//      public static readonly DependencyProperty 
        FontStretchProperty:
        {
        	get:function(){
        		if(Font._FontStretchProperty === undefined){
        			Font._FontStretchProperty = 
        	            DependencyProperty.RegisterAttached("FontStretch",        // Name 
        	            		String.Type,           // Type
        	            		Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Font._FontStretchProperty._cssName = "font-stretch";
        		}
        		
        		return Font._FontStretchProperty;
        	}
        },
        
//    	font-style	设置元素的字体样式	4	1	9	Yes
//      public static readonly DependencyProperty 
        FontStyleProperty:
        {
        	get:function(){
        		if(Font._FontStyleProperty === undefined){
        			Font._FontStyleProperty = 
        	            DependencyProperty.RegisterAttached("FontStyle",        // Name 
        	            		String.Type,           // Type
        	            		Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Font._FontStyleProperty._cssName = "font-style";
        		}
        		
        		return Font._FontStyleProperty;
        	}
        },
        
//    	font-variant	用小型大写字母字体来显示文本	4	1	9	Yes
//      public static readonly DependencyProperty 
        FontVariantProperty:
        {
        	get:function(){
        		if(Font._FontVariantProperty === undefined){
        			Font._FontVariantProperty = 
        	            DependencyProperty.RegisterAttached("FontVariant",        // Name 
        	            		String.Type,           // Type
        	            		Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Font._FontVariantProperty._cssName = "font-variant";
        		}
        		
        		return Font._FontVariantProperty;
        	}
        },
        
//    	font-weight	设置字体的粗细	4	1	9	Yes
//      public static readonly DependencyProperty 
        FontWeightProperty:
        {
        	get:function(){
        		if(Font._FontWeightProperty === undefined){
        			Font._FontWeightProperty = 
        	            DependencyProperty.RegisterAttached("FontWeight",        // Name 
        	            		String.Type,           // Type
        	            		Font.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Font._FontWeightProperty._cssName = "font-weight";
        		}
        		
        		return Font._FontWeightProperty;
        	}
        },

	});
	
	Font.Type = new Type("Font", Font, [Object.Type]);
	return Font;
});