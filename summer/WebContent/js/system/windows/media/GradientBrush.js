/**
 * GradientBrush
 */

define(["dojo/_base/declare", "system/Type", "media/Brush"], 
		function(declare, Type, Brush){
	var GradientBrush = declare("GradientBrush", Brush,{
   	 	"-chains-": {
	      constructor: "manual"
	    },
	    
		constructor:function(/*GradientStopCollection*/ gradientStopCollection){
			if(gradientStopCollection === undefined){
				gradientStopCollection = null;
			}
			
			this.GradientStops = gradientStopCollection;
		},
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new GradientBrush 
		Clone:function()
        {
            return Brush.prototype.Clone.call(this);
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new GradientBrush 
        CloneCurrentValue:function()
        {
            return Brush.prototype.CloneCurrentValue.call(this);
        },

	});
	
	Object.defineProperties(GradientBrush.prototype,{
		 /// <summary>
        ///     ColorInterpolationMode - ColorInterpolationMode.  Default value is ColorInterpolationMode.SRgbLinearInterpolation. 
        /// </summary>
//        public ColorInterpolationMode 
		ColorInterpolationMode:
        {
            get:function() 
            {
                return this.GetValue(GradientBrush.ColorInterpolationModeProperty); 
            },
            set:function(value)
            { 
            	this.SetValueInternal(GradientBrush.ColorInterpolationModeProperty, value);
            }
        },
 
        /// <summary>
        ///     MappingMode - BrushMappingMode.  Default value is BrushMappingMode.RelativeToBoundingBox. 
        /// </summary> 
//        public BrushMappingMode 
		MappingMode:
        { 
            get:function()
            {
                return this.GetValue(GradientBrush.MappingModeProperty);
            },
            set:function(value)
            { 
            	this.SetValueInternal(GradientBrush.MappingModeProperty, value); 
            }
        }, 

        /// <summary>
        ///     SpreadMethod - GradientSpreadMethod.  Default value is GradientSpreadMethod.Pad.
        /// </summary> 
//        public GradientSpreadMethod 
		SpreadMethod:
        { 
            get:function() 
            {
                return this.GetValue(GradientBrush.SpreadMethodProperty); 
            },
            set:function(value)
            {
            	this.SetValueInternal(GradientBrush.SpreadMethodProperty, value); 
            }
        }, 
 
        /// <summary>
        ///     GradientStops - GradientStopCollection.  Default value is new FreezableDefaultValueFactory(GradientStopCollection.Empty). 
        /// </summary>
//        public GradientStopCollection 
		GradientStops:
        {
            get:function()
            {
                return this.GetValue(GradientBrush.GradientStopsProperty); 
            },
            set:function(value)
            { 
            	this.SetValueInternal(GradientBrush.GradientStopsProperty, value);
            }
        }  
	});
	
	Object.defineProperties(GradientBrush,{
		  
	});
	
//	 private static void 
	function ColorInterpolationModePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
     { 
//         GradientBrush target = ((GradientBrush) d);
         d.PropertyChanged(GradientBrush.ColorInterpolationModeProperty); 
     }
//     private static void 
	function MappingModePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
     { 
//         GradientBrush target = ((GradientBrush) d);
         d.PropertyChanged(GradientBrush.MappingModeProperty);
     }
//     private static void 
     function SpreadMethodPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
     {
//         GradientBrush target = ((GradientBrush) d); 
         d.PropertyChanged(GradientBrush.SpreadMethodProperty); 
     }
//     private static void 
     function GradientStopsPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
     {
//         GradientBrush target = ((GradientBrush) d);
         d.PropertyChanged(GradientBrush.GradientStopsProperty);
     }
     
//     internal const ColorInterpolationMode 
     var c_ColorInterpolationMode = ColorInterpolationMode.SRgbLinearInterpolation; 
//     internal const BrushMappingMode 
     var c_MappingMode = BrushMappingMode.RelativeToBoundingBox; 
//     internal const GradientSpreadMethod 
     var c_SpreadMethod = GradientSpreadMethod.Pad;
//     internal static GradientStopCollection 
     var s_GradientStops = GradientStopCollection.Empty; 

//     static GradientBrush()
     function Initialize()
     { 
         // We check our static default fields which are of type Freezable 
         // to make sure that they are not mutable, otherwise we will throw
         // if these get touched by more than one thread in the lifetime 
         // of your app.  (Windows OS Bug #947272)
         //
//         Debug.Assert(s_GradientStops == null || s_GradientStops.IsFrozen,
//             "Detected context bound default value GradientBrush.s_GradientStops (See OS Bug #947272)."); 


         // Initializations 
         GradientBrush.ColorInterpolationModeProperty = 
               RegisterProperty("ColorInterpolationMode",
            		   Number.Type,
                                GradientBrush.Type,
                                ColorInterpolationMode.SRgbLinearInterpolation, 
                                new PropertyChangedCallback(null, ColorInterpolationModePropertyChanged),
                                new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsColorInterpolationModeValid), 
                                /* isIndependentlyAnimated  = */ false, 
                                /* coerceValueCallback */ null);
         GradientBrush.MappingModeProperty = 
               RegisterProperty("MappingMode",
                                Number.Type,
                                GradientBrush.Type,
                                BrushMappingMode.RelativeToBoundingBox, 
                                new PropertyChangedCallback(null, MappingModePropertyChanged),
                                new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsBrushMappingModeValid), 
                                /* isIndependentlyAnimated  = */ false, 
                                /* coerceValueCallback */ null);
         GradientBrush.SpreadMethodProperty = 
               RegisterProperty("SpreadMethod",
                                Number.Type,
                                GradientBrush.Type,
                                GradientSpreadMethod.Pad, 
                                new PropertyChangedCallback(null, SpreadMethodPropertyChanged),
                                new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsGradientSpreadMethodValid), 
                                /* isIndependentlyAnimated  = */ false, 
                                /* coerceValueCallback */ null);
         GradientBrush.GradientStopsProperty = 
               RegisterProperty("GradientStops",
                                GradientStopCollection.Type,
                                GradientBrush.Type,
                                new FreezableDefaultValueFactory(null, GradientStopCollection.Empty), 
                                new PropertyChangedCallback(null, GradientStopsPropertyChanged),
                                null, 
                                /* isIndependentlyAnimated  = */ false, 
                                /* coerceValueCallback */ null);
     } 
	
	GradientBrush.Type = new Type("GradientBrush", GradientBrush, [Brush.Type]);
	Initialize();
	
	return GradientBrush;
});
