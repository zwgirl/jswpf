/**
 * List
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var List = declare("List", null,{

	});
	
	Object.defineProperties(List,{
//		listStyle	在一行设置列表的所有属性	4	1	9	Yes
//        public static readonly DependencyProperty 
		StyleProperty:
        {
        	get:function(){
        		if(List._StyleProperty === undefined){
        			List._StyleProperty = 
                        DependencyProperty.RegisterAttached(
                                "Style",              // Name
                                String.Type,         // Type
                                List.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			List._StyleProperty._cssName = "listStyle";
        		}
        		
        		return List._StyleProperty;
        	}
        },	
//		listStyleImage	把图像设置为列表项标记	4	1	No	Yes
//        public static readonly DependencyProperty 
        StyleImageProperty:
        {
        	get:function(){
        		if(List._StyleImageProperty === undefined){
        			List._StyleImageProperty = 
        	            DependencyProperty.RegisterAttached("StyleImage",     // Name
        	            		String.Type,         // Type
        	            		List.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			List._StyleImageProperty._cssName = "listStyleImage";
        		}
        		
        		return List._StyleImageProperty;
        	}
        }, 
//		listStylePosition	改变列表项标记的位置	4	1	9	Yes
//        public static readonly DependencyProperty 
        StylePositionProperty:
        {
        	get:function(){
        		if(List._StylePositionProperty === undefined){
        			List._StylePositionProperty  =
        	            DependencyProperty.RegisterAttached("StylePosition",       // Name 
        	            		String.Type,         // Type
        	            		List.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			List._StylePositionProperty._cssName = "listStylePosition";
        		}
        		
        		return List._StylePositionProperty;
        	}
        },
//		listStyleType
//        public static readonly DependencyProperty 
        StyleTypeProperty:
        {
        	get:function(){
        		if(List._StyleTypeProperty === undefined){
        			List._StyleTypeProperty = 
        	            DependencyProperty.RegisterAttached("StyleType",        // Name 
        	            		String.Type,           // Type
        	            		List.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			List._StyleTypeProperty._cssName = "listStyleType";
        		}
        		
        		return List._StyleTypeProperty;
        	}
        },

	});
	
	List.Type = new Type("List", List, [Object.Type]);
	return List;
});