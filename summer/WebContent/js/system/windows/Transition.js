/**
 * Transition
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Transition = declare("Transition", null,{

	});
	
	Object.defineProperties(Transition,{
//		The ‘transition’
//      public static readonly DependencyProperty 
		TransitionProperty:
		{
			get:function(){
				if(Transition._TransitionProperty === undefined){
					Transition._TransitionProperty = 
						DependencyProperty.RegisterAttached(
                          "Transition",              // Name
                          String.Type,         // Type
                          Transition.Type, // Owner 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
					Transition._TransitionProperty._cssName = "transition";
				}
  		
				return Transition._TransitionProperty;
			}
		},	
//		The ‘transition-property’ Property
//        public static readonly DependencyProperty 
		PropertyProperty:
        {
        	get:function(){
        		if(Transition._PropertyProperty === undefined){
        			Transition._PropertyProperty = 
                        DependencyProperty.RegisterAttached(
                                "Property",              // Name
                                String.Type,         // Type
                                Transition.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Transition._PropertyProperty._cssName = "transition-property";
        		}
        		
        		return Transition._PropertyProperty;
        	}
        },	
//		The ‘transition-duration’ Property
//        public static readonly DependencyProperty 
        DurationProperty:
        {
        	get:function(){
        		if(Transition._DurationProperty === undefined){
        			Transition._DurationProperty = 
        	            DependencyProperty.RegisterAttached("Duration",     // Name
        	            		String.Type,         // Type
                                Transition.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Transition._DurationProperty._cssName = "transition-duration";
        		}
        		
        		return Transition._DurationProperty;
        	}
        }, 
//		The ‘transition-timing-function’ Property
//        public static readonly DependencyProperty 
        TimingFunctionProperty:
        {
        	get:function(){
        		if(Transition._TimingFunctionProperty === undefined){
        			Transition._TimingFunctionProperty  =
        	            DependencyProperty.RegisterAttached("TimingFunction",       // Name 
        	            		String.Type,         // Type
                                Transition.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Transition._TimingFunctionProperty._cssName = "transition-timing-function";
        		}
        		
        		return Transition._TimingFunctionProperty;
        	}
        },
//		The ‘transition-delay’ Property
//        public static readonly DependencyProperty 
        DelayProperty:
        {
        	get:function(){
        		if(Transition._DelayProperty === undefined){
        			Transition._DelayProperty = 
        	            DependencyProperty.RegisterAttached("Delay",        // Name 
        	            		String.Type,           // Type
                                Transition.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Transition._DelayProperty._cssName = "transition-delay";
        		}
        		
        		return Transition._DelayProperty;
        	}
        },

	});
	
    Transition.Type = new Type("Transition", Transition, [Object.Type]);
	return Transition;
});

 


