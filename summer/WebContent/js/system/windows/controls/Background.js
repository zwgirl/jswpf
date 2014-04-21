/**
 * Background
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Background = declare("Background", null,{

	});
	
	Object.defineProperties(Background,{
//		background
//      public static readonly DependencyProperty 
	  BackgroundProperty:
      {
      	get:function(){
      		if(Background._BackgroundProperty === undefined){
      			Background._BackgroundProperty = 
                      DependencyProperty.RegisterAttached(
                              "Background",              // Name
                              String.Type,         // Type
                              Background.Type, // Owner 
                              FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
      			Background._BackgroundProperty._cssName = "background";
      		}
      		
      		return Background._BackgroundProperty;
      	}
      },
//		background-color
//        public static readonly DependencyProperty 
        ColorProperty:
        {
        	get:function(){
        		if(Background._ColorProperty === undefined){
        			Background._ColorProperty = 
                        DependencyProperty.RegisterAttached(
                                "Color",              // Name
                                String.Type,         // Type
                                Background.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Background._ColorProperty._cssName = "background-color";
        		}
        		
        		return Background._ColorProperty;
        	}
        },	

//		background-position
//        public static readonly DependencyProperty 
        PositionProperty:
        {
        	get:function(){
        		if(Background._PositionProperty === undefined){
        			Background._PositionProperty = 
        	            DependencyProperty.RegisterAttached("Position",     // Name
        	            		String.Type,         // Type
                                Background.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Background._PositionProperty._cssName = "background-position";
        		}
        		
        		return Background._PositionProperty;
        	}
        }, 
//		background-size	
//        public static readonly DependencyProperty 
        SizeProperty:
        {
        	get:function(){
        		if(Background._SizeProperty === undefined){
        			Background._SizeProperty  =
        	            DependencyProperty.RegisterAttached("Size",       // Name 
        	            		String.Type,         // Type
                                Background.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Background._SizeProperty._cssName = "background-size";
        		}
        		
        		return Background._SizeProperty;
        	}
        },
//      background-repeat
//        public static readonly DependencyProperty 
        RepeatProperty:
        {
        	get:function(){
        		if(Background._RepeatProperty === undefined){
        			Background._RepeatProperty = 
        	            DependencyProperty.RegisterAttached("Repeat",        // Name 
        	            		String.Type,           // Type
                                Background.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Background._RepeatProperty._cssName = "background-repeat";
        		}
        		
        		return Background._RepeatProperty;
        	}
        },
//        background-origin
//        public static readonly DependencyProperty 
        OriginProperty:
        {
        	get:function(){
        		if(Background._OriginProperty === undefined){
        			Background._OriginProperty =
        	            DependencyProperty.RegisterAttached("Origin",      // Name 
        	            		String.Type,      // Type
                                Background.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Background._OriginProperty._cssName = "background-origin";
        		}
        		
        		return Background._OriginProperty;
        	}
        },
//		background-clip
//        public static readonly DependencyProperty 
        ClipProperty:
        {
        	get:function(){
        		if(Background._ClipProperty === undefined){
        			Background._ClipProperty =
        	            DependencyProperty.RegisterAttached("Clip",   // Name
        	            		String.Type,           // Type
                                Background.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Background._ClipProperty._cssName = "background-clip";
        		}
        		
        		return Background._ClipProperty;
        	}
        },
//        background-attachment
//        public static readonly DependencyProperty 
        AttachmentProperty:
        {
        	get:function(){
        		if(Background._AttachmentProperty === undefined){
        			Background._AttachmentProperty =
        	            DependencyProperty.RegisterAttached("Attachment",            // Name 
        	            		String.Type,  // Type
                                Background.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Background._AttachmentProperty._cssName = "background-attachment";
        		}
        		
        		return Background._AttachmentProperty;
        	}
        },
//        background-image
//        public static readonly DependencyProperty 
        ImageProperty:
        {
        	get:function(){
        		if(Background._ImageProperty === undefined){
        			Background._ImageProperty =
        	            DependencyProperty.RegisterAttached("Image",       // Name 
        	            		String.Type,           // Type 
                                Background.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Background._ImageProperty._cssName = "background-image";
        		}
        		
        		return Background._ImageProperty;
        	}
        },

	});
	
    Background.Type = new Type("Background", Background, [Object.Type]);
	return Background;
});

 


