/**
 * Margin
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Margin = declare("Margin", null,{

	});

	
	Object.defineProperties(Margin,{
//		margin	设置元素的边距 (可设置四个值)	4	1	9	
//        public static readonly DependencyProperty 
		MarginProperty:
        {
        	get:function(){
        		if(Margin._MarginProperty === undefined){
        			Margin._MarginProperty = 
                        DependencyProperty.RegisterAttached(
                                "Margin",              // Name
                                String.Type,         // Type
                                Margin.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Margin._MarginProperty._cssName = "margin";
        		}
        		
        		return Margin._MarginProperty;
        	}
        },	
//		margin-bottom	设置元素的底边距	4	1	9	Yes
//        public static readonly DependencyProperty 
        BottomProperty:
        {
        	get:function(){
        		if(Margin._BottomProperty === undefined){
        			Margin._BottomProperty = 
        	            DependencyProperty.RegisterAttached("MarginBottom",     // Name
        	            		String.Type,         // Type
                                Margin.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Margin._BottomProperty._cssName = "margin-bottom";
        		}
        		
        		return Margin._BottomProperty;
        	}
        }, 
//		margin-left	设置元素的左边距	4	1	9	Yes
//        public static readonly DependencyProperty 
        LeftProperty:
        {
        	get:function(){
        		if(Margin._LeftProperty === undefined){
        			Margin._LeftProperty  =
        	            DependencyProperty.RegisterAttached("MarginLeft",       // Name 
        	            		String.Type,         // Type
                                Margin.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Margin._LeftProperty._cssName = "margin-left";
        		}
        		
        		return Margin._LeftProperty;
        	}
        },
//		margin-right	设置元素的右边据	4	1	9	Yes
//        public static readonly DependencyProperty 
        RightProperty:
        {
        	get:function(){
        		if(Margin._RightProperty === undefined){
        			Margin._RightProperty = 
        	            DependencyProperty.RegisterAttached("MarginRight",        // Name 
        	            		String.Type,           // Type
                                Margin.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Margin._RightProperty._cssName = "margin-right";
        		}
        		
        		return Margin._RightProperty;
        	}
        },
        
//    	margin-top
//      public static readonly DependencyProperty 
        TopProperty:
        {
        	get:function(){
        		if(Margin._TopProperty === undefined){
        			Margin._TopProperty = 
        	            DependencyProperty.RegisterAttached("MarginTop",        // Name 
        	            		String.Type,           // Type
                                Margin.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Margin._TopProperty._cssName = "margin-top";
        		}
        		
        		return Margin._TopProperty;
        	}
        },

	});
	
    Margin.Type = new Type("Margin", Margin, [Object.Type]);
	return Margin;
});

 


