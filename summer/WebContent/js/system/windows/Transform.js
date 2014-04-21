




/**
 * Transform
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Transform = declare("Transform", null,{

	});
	
	Object.defineProperties(Transform,{
//		transform	向元素应用 2D 或 3D 转换。	3
//        public static readonly DependencyProperty 
		TransformProperty:
        {
        	get:function(){
        		if(Transform._FontProperty === undefined){
        			Transform._FontProperty = 
                        DependencyProperty.RegisterAttached(
                                "Transform",              // Name
                                String.Type,         // Type
                                Transform.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Transform._FontProperty._cssName = "transform";
        		}
        		
        		return Transform._FontProperty;
        	}
        },	
//		transform-origin	允许你改变被转换元素的位置。	3
//        public static readonly DependencyProperty 
        OriginProperty:
        {
        	get:function(){
        		if(Transform._OriginProperty === undefined){
        			Transform._OriginProperty = 
        	            DependencyProperty.RegisterAttached("Origin",     // Name
        	            		String.Type,         // Type
        	            		Transform.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Transform._OriginProperty._cssName = "transform-origin";
        		}
        		
        		return Transform._OriginProperty;
        	}
        }, 
//		transform-style	规定被嵌套元素如何在 3D 空间中显示。	3
//        public static readonly DependencyProperty 
        StyleProperty:
        {
        	get:function(){
        		if(Transform._StyleProperty === undefined){
        			Transform._StyleProperty  =
        	            DependencyProperty.RegisterAttached("Style",       // Name 
        	            		String.Type,         // Type
        	            		Transform.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Transform._StyleProperty._cssName = "transform-style";
        		}
        		
        		return Transform._StyleProperty;
        	}
        },
//		perspective	规定 3D 元素的透视效果。	3
//        public static readonly DependencyProperty 
        PerspectiveProperty:
        {
        	get:function(){
        		if(Transform._PerspectiveProperty === undefined){
        			Transform._PerspectiveProperty = 
        	            DependencyProperty.RegisterAttached("Perspective",        // Name 
        	            		String.Type,           // Type
        	            		Transform.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Transform._PerspectiveProperty._cssName = "perspective";
        		}
        		
        		return Transform._PerspectiveProperty;
        	}
        },
        
//    	perspective-origin	规定 3D 元素的底部位置。	3
//      public static readonly DependencyProperty 
        PerspectiveOriginProperty:
        {
        	get:function(){
        		if(Transform._PerspectiveOriginProperty === undefined){
        			Transform._PerspectiveOriginProperty = 
        	            DependencyProperty.RegisterAttached("PerspectiveOrigin",        // Name 
        	            		String.Type,           // Type
        	            		Transform.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Transform._PerspectiveOriginProperty._cssName = "perspective-origin";
        		}
        		
        		return Transform._PerspectiveOriginProperty;
        	}
        },
        
//    	backface-visibility	定义元素在不面对屏幕时是否可见。
//      public static readonly DependencyProperty 
        BackfaceVisibilityProperty:
        {
        	get:function(){
        		if(Transform._BackfaceVisibilityProperty === undefined){
        			Transform._BackfaceVisibilityProperty = 
        	            DependencyProperty.RegisterAttached("BackfaceVisibility",        // Name 
        	            		String.Type,           // Type
        	            		Transform.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Transform._BackfaceVisibilityProperty._cssName = "backface-visibility";
        		}
        		
        		return Transform._BackfaceVisibilityProperty;
        	}
        },

	});
	
	Transform.Type = new Type("Transform", Transform, [Object.Type]);
	return Transform;
});