/**
 * Positioning
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Positioning = declare("Positioning", null,{

	});
	
	Object.defineProperties(Positioning,{
//		bottom	设置元素的底边缘距离父元素底边缘的之上或之下的距离	5	1	9	Yes
//        public static readonly DependencyProperty 
		BottomProperty:
        {
        	get:function(){
        		if(Positioning._BottomProperty === undefined){
        			Positioning._BottomProperty = 
                        DependencyProperty.RegisterAttached(
                                "Bottom",              // Name
                                String.Type,         // Type
                                Positioning.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Positioning._BottomProperty._cssName = "bottom";
        		}
        		
        		return Positioning._BottomProperty;
        	}
        },	
//		left	置元素的左边缘距离父元素左边缘的左边或右边的距离	4	1	9	Yes
//        public static readonly DependencyProperty 
        LeftProperty:
        {
        	get:function(){
        		if(Positioning._LeftProperty === undefined){
        			Positioning._LeftProperty = 
        	            DependencyProperty.RegisterAttached("Left",     // Name
        	            		String.Type,         // Type
        	            		Positioning.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Positioning._LeftProperty._cssName = "left";
        		}
        		
        		return Positioning._LeftProperty;
        	}
        }, 
//		right	置元素的右边缘距离父元素右边缘的左边或右边的距离	5	1	9	Yes
//        public static readonly DependencyProperty 
        RightProperty:
        {
        	get:function(){
        		if(Positioning._RightProperty === undefined){
        			Positioning._RightProperty  =
        	            DependencyProperty.RegisterAttached("Right",       // Name 
        	            		String.Type,         // Type
        	            		Positioning.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Positioning._RightProperty._cssName = "right";
        		}
        		
        		return Positioning._RightProperty;
        	}
        },
//		top	设置元素的顶边缘距离父元素顶边缘的之上或之下的距离	4	1	9	Yes
//        public static readonly DependencyProperty 
        TopProperty:
        {
        	get:function(){
        		if(Positioning._TopProperty === undefined){
        			Positioning._TopProperty = 
        	            DependencyProperty.RegisterAttached("Top",        // Name 
        	            		String.Type,           // Type
        	            		Positioning.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Positioning._TopProperty._cssName = "top";
        		}
        		
        		return Positioning._TopProperty;
        	}
        },
        
//    	zIndex	设置元素的堆叠次序	4	1	9	Yes
//      public static readonly DependencyProperty 
        ZIndexProperty:
        {
        	get:function(){
        		if(Positioning._ZIndexProperty === undefined){
        			Positioning._ZIndexProperty = 
        	            DependencyProperty.RegisterAttached("ZIndex",        // Name 
        	            		String.Type,           // Type
        	            		Positioning.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Positioning._ZIndexProperty._cssName = "z-index";
        		}
        		
        		return Positioning._ZIndexProperty;
        	}
        },

	});
	
	Positioning.Type = new Type("Positioning", Positioning, [Object.Type]);
	return Positioning;
});