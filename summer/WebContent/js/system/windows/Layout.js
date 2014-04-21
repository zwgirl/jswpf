/**
 * Layout
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Layout = declare("Layout", null,{

	});

	
	Object.defineProperties(Layout,{
//		clear	设置在元素的哪边不允许其他的浮动元素	4	1	9	Yes
//        public static readonly DependencyProperty 
		ClearProperty:
        {
        	get:function(){
        		if(Layout._ClearProperty === undefined){
        			Layout._ClearProperty = 
                        DependencyProperty.RegisterAttached(
                                "Clear",              // Name
                                String.Type,         // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Layout._ClearProperty._cssName = "clear";
        		}
        		
        		return Layout._ClearProperty;
        	}
        },	
//		clip	设置元素的形状	4	1	9	Yes
//        public static readonly DependencyProperty 
        ClipProperty:
        {
        	get:function(){
        		if(Layout._ClipProperty === undefined){
        			Layout._ClipProperty = 
        	            DependencyProperty.RegisterAttached("Clip",     // Name
        	            		String.Type,         // Type
                                Layout.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			
        			Layout._ClipProperty._cssName = "clip";
        		}
        		
        		return Layout._ClipProperty;
        	}
        }, 
//		content	设置元信息	5M	1	 	Yes
//        public static readonly DependencyProperty 
        ContentProperty:
        {
        	get:function(){
        		if(Layout._ContentProperty === undefined){
        			Layout._ContentProperty  =
        	            DependencyProperty.RegisterAttached("Content",       // Name 
        	            		String.Type,         // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Layout._ContentProperty._cssName = "content";
        		}
        		
        		return Layout._ContentProperty;
        	}
        },

//		counter-increment	设置其后是正数的计数器名称的列表。其中整数指示每当元素出现时计数器的增量。默认是1。	5M	1	 	Yes
//        public static readonly DependencyProperty 
        CounterIncrementProperty:
        {
        	get:function(){
        		if(Layout._CounterIncrementProperty === undefined){
        			Layout._CounterIncrementProperty = 
        	            DependencyProperty.RegisterAttached("CounterIncrement",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._CounterIncrementProperty._cssName = "counter-increment";
        		}
        		
        		return Layout._CounterIncrementProperty;
        	}
        },
        
//    	counter-reset	设置其后是正数的计数器名称的列表。其中整数指示每当元素出现时计数器被设置的值。默认是0。	5M	1	 	Yes
//      public static readonly DependencyProperty 
        CounterResetProperty:
        {
        	get:function(){
        		if(Layout._CounterResetProperty === undefined){
        			Layout._CounterResetProperty = 
        	            DependencyProperty.RegisterAttached("CounterReset",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._CounterResetProperty._cssName = "counter-reset";
        		}
        		
        		return Layout._CounterResetProperty;
        	}
        },
        
//    	float	设置图像或文本将出现（浮动）在另一元素中的何处。	5M	1	9	Yes
//      public static readonly DependencyProperty 
        FloatProperty:
        {
        	get:function(){
        		if(Layout._FloatProperty === undefined){
        			Layout._FloatProperty = 
        	            DependencyProperty.RegisterAttached("Float",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._FloatProperty._cssName = "float";
        		}
        		
        		return Layout._FloatProperty;
        	}
        },
//        cursor	设置显示的指针类型	4	1	9	Yes
//      public static readonly DependencyProperty 
        CursorProperty:
        {
        	get:function(){
        		if(Layout._CursorProperty === undefined){
        			Layout._CursorProperty = 
        	            DependencyProperty.RegisterAttached("Cursor",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._CursorProperty._cssName = "cursor";
        		}
        		
        		return Layout._CursorProperty;
        	}
        },
//      direction	设置元素的文本方向	5	1	9	Yes
//      public static readonly DependencyProperty 
        DirectionProperty:
        {
        	get:function(){
        		if(Layout._DirectionProperty === undefined){
        			Layout._DirectionProperty = 
        	            DependencyProperty.RegisterAttached("Direction",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._DirectionProperty._cssName = "direction";
        		}
        		
        		return Layout._DirectionProperty;
        	}
        },
//      display	设置元素如何被显示	4	1	9	Yes
//      public static readonly DependencyProperty 
        DisplayProperty:
        {
        	get:function(){
        		if(Layout._DisplayProperty === undefined){
        			Layout._DisplayProperty = 
        	            DependencyProperty.RegisterAttached("Display",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._DisplayProperty._cssName = "display";
        		}
        		
        		return Layout._DisplayProperty;
        	}
        },
//      height	设置元素的高度	4	1	9	Yes
//      public static readonly DependencyProperty 
        HeightProperty:
        {
        	get:function(){
        		if(Layout._HeightProperty === undefined){
        			Layout._HeightProperty = 
        	            DependencyProperty.RegisterAttached("Height",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._HeightProperty._cssName = "height";
        		}
        		
        		return Layout._HeightProperty;
        	}
        },
//      markerOffset	设置marker box的principal box距离其最近的边框边缘的距离	5M	1	 	Yes
//      public static readonly DependencyProperty 
        MarkerOffsetProperty:
        {
        	get:function(){
        		if(Layout._MarkerOffsetProperty === undefined){
        			Layout._MarkerOffsetProperty = 
        	            DependencyProperty.RegisterAttached("MarkerOffset",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._MarkerOffsetProperty._cssName = "marker-offset";
        		}
        		
        		return Layout._MarkerOffsetProperty;
        	}
        },
//      marks	设置是否cross marks或crop marks应仅仅被呈现于page box边缘之外	5M	1	 	Yes
//      public static readonly DependencyProperty 
        MarksProperty:
        {
        	get:function(){
        		if(Layout._MarksProperty === undefined){
        			Layout._MarksProperty = 
        	            DependencyProperty.RegisterAttached("Marks",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._MarksProperty._cssName = "marks";
        		}
        		
        		return Layout._MarksProperty;
        	}
        },

//      maxHeight	设置元素的最大高度	5M	1	9	Yes
        MaxHeightProperty:
        {
        	get:function(){
        		if(Layout._MaxHeightProperty === undefined){
        			Layout._MaxHeightProperty = 
        	            DependencyProperty.RegisterAttached("MaxHeight",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._MaxHeightProperty._cssName = "max-height";
        		}
        		
        		return Layout._MaxHeightProperty;
        	}
        },
//      maxWidth	设置元素的最大宽度	5M	1	9	Yes
        MaxWidthProperty:
        {
        	get:function(){
        		if(Layout._MaxWidthProperty === undefined){
        			Layout._MaxWidthProperty = 
        	            DependencyProperty.RegisterAttached("MaxWidth",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._MaxWidthProperty._cssName = "max-width";
        		}
        		
        		return Layout._MaxWidthProperty;
        	}
        },
//      minHeight	设置元素的最小高度	5M	1	9	Yes
        MinHeightProperty:
        {
        	get:function(){
        		if(Layout._MinHeightProperty === undefined){
        			Layout._MinHeightProperty = 
        	            DependencyProperty.RegisterAttached("MinHeight",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._MinHeightProperty._cssName = "min-height";
        		}
        		
        		return Layout._MinHeightProperty;
        	}
        },
//      minWidth	设置元素的最小宽度	5M	1	9	Yes
        MinWidthProperty:
        {
        	get:function(){
        		if(Layout._MinWidthProperty === undefined){
        			Layout._MinWidthProperty = 
        	            DependencyProperty.RegisterAttached("MinWidth",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._MinWidthProperty._cssName = "min-width";
        		}
        		
        		return Layout._MinWidthProperty;
        	}
        },
//      overflow	规定如何处理不适合元素盒的内容	4	1	9	Yes
        OverflowProperty:
        {
        	get:function(){
        		if(Layout._OverflowProperty === undefined){
        			Layout._OverflowProperty = 
        	            DependencyProperty.RegisterAttached("Overflow",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._OverflowProperty._cssName = "overflow";
        		}
        		
        		return Layout._OverflowProperty;
        	}
        },
//        verticalAlign	设置对元素中的内容进行垂直排列	4	1	No	Yes
        VerticalAlignProperty:
        {
        	get:function(){
        		if(Layout._VerticalAlignProperty === undefined){
        			Layout._VerticalAlignProperty = 
        	            DependencyProperty.RegisterAttached("VerticalAlign",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout._VerticalAlignProperty._cssName = "vertical-align";
        		}
        		
        		return Layout._VerticalAlignProperty;
        	}
        },
//      visibility	设置元素是否可见	4	1	9	Yes
        VisibilityProperty:
        {
        	get:function(){
        		if(Layout._VisibilityProperty === undefined){
        			Layout._VisibilityProperty = 
        	            DependencyProperty.RegisterAttached("Visibility",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout.VisibilityProperty._cssName = "visibility";
        		}
        		
        		return Layout._VisibilityProperty;
        	}
        },
//        width	设置元素的宽度	4	1	9	Yes
        WidthProperty:
        {
        	get:function(){
        		if(Layout._WidthProperty === undefined){
        			Layout._WidthProperty = 
        	            DependencyProperty.RegisterAttached("Width",        // Name 
        	            		String.Type,           // Type
                                Layout.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Layout.WidthProperty._cssName = "width";
        		}
        		
        		return Layout._WidthProperty;
        	}
        },
	});
	
    Layout.Type = new Type("Layout", Layout, [Object.Type]);
	return Layout;
});

 


