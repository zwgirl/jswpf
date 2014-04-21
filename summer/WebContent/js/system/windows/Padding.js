/**
 * Padding
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Padding = declare("Padding", null,{

	});

	Object.defineProperties(Padding,{
//		padding	设置元素的填充 (可设置四个值)	4	1	9	Yes
//        public static readonly DependencyProperty 
		PaddingProperty:
        {
        	get:function(){
        		if(Padding._PaddingProperty === undefined){
        			Padding._PaddingProperty = 
                        DependencyProperty.RegisterAttached(
                                "Padding",              // Name
                                String.Type,         // Type
                                Padding.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Padding._PaddingProperty._cssName = "padding";
        		}
        		
        		return Padding._PaddingProperty;
        	}
        },	
//		paddingBottom	设置元素的下填充	4	1	9	Yes
//        public static readonly DependencyProperty 
        BottomProperty:
        {
        	get:function(){
        		if(Padding._BottomProperty === undefined){
        			Padding._BottomProperty = 
        	            DependencyProperty.RegisterAttached("PaddingBottom",     // Name
        	            		String.Type,         // Type
                                Padding.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Padding._BottomProperty._cssName = "paddingBottom";
        		}
        		
        		return Padding._BottomProperty;
        	}
        }, 
//		paddingLeft	设置元素的左填充	4	1	9	Yes
//        public static readonly DependencyProperty 
        LeftProperty:
        {
        	get:function(){
        		if(Padding._LeftProperty === undefined){
        			Padding._LeftProperty  =
        	            DependencyProperty.RegisterAttached("PaddingLeft",       // Name 
        	            		String.Type,         // Type
                                Padding.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Padding._LeftProperty._cssName = "paddingLeft";
        		}
        		
        		return Padding._LeftProperty;
        	}
        },
//		paddingRight	设置元素的右填充	4	1	9	Yes
//        public static readonly DependencyProperty 
        RightProperty:
        {
        	get:function(){
        		if(Padding._RightProperty === undefined){
        			Padding._RightProperty = 
        	            DependencyProperty.RegisterAttached("PaddingRight",        // Name 
        	            		String.Type,           // Type
                                Padding.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Padding._RightProperty._cssName = "paddingRight";
        		}
        		
        		return Padding._RightProperty;
        	}
        },
        
//    	paddingTop	设置元素的顶填充	4	1	9	Yes
//      public static readonly DependencyProperty 
        TopProperty:
        {
        	get:function(){
        		if(Padding._TopProperty === undefined){
        			Padding._TopProperty = 
        	            DependencyProperty.RegisterAttached("PaddingTop",        // Name 
        	            		String.Type,           // Type
                                Padding.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Padding._TopProperty._cssName = "paddingTop";
        		}
        		
        		return Padding._TopProperty;
        	}
        },

	});
	
    Padding.Type = new Type("Padding", Padding, [Object.Type]);
	return Padding;
});

 


