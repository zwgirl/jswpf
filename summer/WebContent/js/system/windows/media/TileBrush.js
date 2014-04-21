/**
 * TileBrush
 */
/// <summary>
/// TileBrush
/// The TileBrush is an abstract class of Brushes which describes 
/// a way to fill a region by tiling.  The contents of the tiles
/// are described by classes derived from TileBrush. 
/// </summary> 
define(["dojo/_base/declare", "system/Type", "media/Brush"], 
		function(declare, Type, Brush){
	var TileBrush = declare("TileBrush", Brush,{
		constructor:function(){
		},
        /// <summary>
        /// Obtains the current bounds of the brush's content 
        /// </summary> 
        /// <param name="contentBounds"> Output bounds of content </param>
//        protected abstract void GetContentBounds(out Rect contentBounds); 

        /// <summary>
        /// Obtains a matrix that maps the TileBrush's content to the coordinate
        /// space of the shape it is filling. 
        /// </summary>
        /// <param name="shapeFillBounds"> 
        ///     Fill-bounds of the shape this brush is stroking/filling 
        /// </param>
        /// <param name="tileBrushMapping"> 
        ///     Output matrix that maps the TileBrush's content to the coordinate
        ///     space of the shape it is filling
        /// </param>
        /// <SecurityNote> 
        /// Critical as this code calls UnsafeNativeMethods.MilUtility_GetTileBrushMapping
        /// and MILUtilities.ConvertFromD3DMATRIX. 
        /// Treat as safe because the first is simply a math utility function with no 
        /// critical data exposure, and the second is passed pointers to type-correct data.
        /// </SecurityNote> 
//        internal void 
		GetTileBrushMapping:function(
            /*Rect*/ shapeFillBounds,
            /*out Matrix*/ tileBrushMapping 
            )
        { 
//            Rect contentBounds = Rect.Empty; 
//            BrushMappingMode viewboxUnits = ViewboxUnits;
//            bool brushIsEmpty = false; 
//
//            // Initialize out-param
//            tileBrushMapping = Matrix.Identity;
// 
//            // Obtain content bounds for RelativeToBoundingBox ViewboxUnits
//            // 
//            // If ViewboxUnits is RelativeToBoundingBox, then the tile-brush 
//            // transform is also dependent on the bounds of the content.
//            if (viewboxUnits == BrushMappingMode.RelativeToBoundingBox) 
//            {
//                GetContentBounds(out contentBounds);
//
//                // If contentBounds is Rect.Empty then this brush renders nothing. 
//                // Set the empty flag & early-out.
//                if (contentBounds == Rect.Empty) 
//                { 
//                    brushIsEmpty = true;
//                } 
//            }
//
//            //
//            // Pass the properties to MilUtility_GetTileBrushMapping to calculate 
//            // the mapping, unless the brush is already determined to be empty
//            // 
// 
//            if (!brushIsEmpty)
//            { 
//                //
//                // Obtain properties that must be set into local variables
//                //
//                Rect viewport = Viewport;
//                Rect viewbox = Viewbox; 
//                Matrix transformValue; 
//                Matrix relativeTransformValue;
// 
//                Transform.GetTransformValue(
//                    Transform,
//                    out transformValue
//                    ); 
//
//                Transform.GetTransformValue( 
//                    RelativeTransform, 
//                    out relativeTransformValue
//                    ); 
//
//                unsafe
//                {
//                    D3DMATRIX d3dTransform; 
//                    D3DMATRIX d3dRelativeTransform;
// 
//                    D3DMATRIX d3dContentToShape; 
//                    int brushIsEmptyBOOL;
// 
//                    // Call MilUtility_GetTileBrushMapping, converting Matrix's to
//                    // D3DMATRIX's when needed.
//
//                    MILUtilities.ConvertToD3DMATRIX(&transformValue, &d3dTransform); 
//                    MILUtilities.ConvertToD3DMATRIX(&relativeTransformValue, &d3dRelativeTransform);
// 
//                    MS.Win32.PresentationCore.UnsafeNativeMethods.MilCoreApi.MilUtility_GetTileBrushMapping( 
//                        &d3dTransform,
//                        &d3dRelativeTransform, 
//                        Stretch,
//                        AlignmentX,
//                        AlignmentY,
//                        ViewportUnits, 
//                        viewboxUnits,
//                        &shapeFillBounds, 
//                        &contentBounds, 
//                        ref viewport,
//                        ref viewbox, 
//                        out d3dContentToShape,
//                        out brushIsEmptyBOOL
//                        );
// 
//                    // Convert the brushIsEmpty flag from BOOL to a bool.
//                    brushIsEmpty = (brushIsEmptyBOOL != 0); 
// 
//                    // Set output matrix if the brush isn't empty.  Otherwise, the
//                    // output of MilUtility_GetTileBrushMapping must be ignored. 
//                    if (!brushIsEmpty)
//                    {
//                        Matrix contentToShape;
//                        MILUtilities.ConvertFromD3DMATRIX(&d3dContentToShape, &contentToShape); 
//
//                        // Set the out-param to the computed tile brush mapping 
//                        tileBrushMapping = contentToShape; 
//                    }
//                } 
//            }
        },

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new TileBrush
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new TileBrush 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue();
        }
	});
	
	Object.defineProperties(TileBrush.prototype,{
		/// <summary>
        ///     ViewportUnits - BrushMappingMode.  Default value is BrushMappingMode.RelativeToBoundingBox. 
        /// </summary>
//        public BrushMappingMode 
		ViewportUnits:
        {
            get:function() 
            {
                return this.GetValue(TileBrush.ViewportUnitsProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TileBrush.ViewportUnitsProperty, value);
            }
        },
 
        /// <summary>
        ///     ViewboxUnits - BrushMappingMode.  Default value is BrushMappingMode.RelativeToBoundingBox. 
        /// </summary> 
//        public BrushMappingMode 
        ViewboxUnits:
        { 
            get:function()
            {
                return this.GetValue(TileBrush.ViewboxUnitsProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TileBrush.ViewboxUnitsProperty, value); 
            }
        },

        /// <summary>
        ///     Viewport - Rect.  Default value is new Rect(0,0,1,1).
        /// </summary> 
//        public Rect 
        Viewport:
        { 
            get:function() 
            {
                return this.GetValue(TileBrush.ViewportProperty); 
            }, 
            set:function(value)
            {
            	this.SetValueInternal(TileBrush.ViewportProperty, value); 
            }
        },
 
        /// <summary>
        ///     Viewbox - Rect.  Default value is new Rect(0,0,1,1). 
        /// </summary>
//        public Rect 
        Viewbox:
        {
            get:function()
            {
                return this.GetValue(TileBrush.ViewboxProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TileBrush.ViewboxProperty, value);
            }
        },
 
        /// <summary>
        ///     Stretch - Stretch.  Default value is Stretch.Fill. 
        /// </summary> 
//        public Stretch 
        Stretch:
        { 
            get:function()
            {
                return this.GetValue(TileBrush.StretchProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TileBrush.StretchProperty, value); 
            }
        }, 

        /// <summary>
        ///     TileMode - TileMode.  Default value is TileMode.None.
        /// </summary> 
//        public TileMode 
        TileMode:
        { 
            get:function() 
            {
                return this.GetValue(TileBrush.TileModeProperty); 
            }, 
            set:function(value)
            {
            	this.SetValueInternal(TileBrush.TileModeProperty, value); 
            }
        }, 
 
        /// <summary>
        ///     AlignmentX - AlignmentX.  Default value is AlignmentX.Center. 
        /// </summary>
//        public AlignmentX 
        AlignmentX:
        {
            get:function() 
            {
                return this.GetValue(TileBrush.AlignmentXProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TileBrush.AlignmentXProperty, value);
            }
        },
 
        /// <summary>
        ///     AlignmentY - AlignmentY.  Default value is AlignmentY.Center. 
        /// </summary> 
//        public AlignmentY 
        AlignmentY:
        { 
            get:function()
            {
                return this.GetValue(TileBrush.AlignmentYProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TileBrush.AlignmentYProperty, value); 
            }
        }   
	});
	
	Object.defineProperties(TileBrush,{
		  
	});
	
//	private static void 
	function ViewportUnitsPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        TileBrush target = ((TileBrush) d);
        d.PropertyChanged(TileBrush.ViewportUnitsProperty); 
    }
//    private static void 
	function ViewboxUnitsPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        TileBrush target = ((TileBrush) d);
        d.PropertyChanged(TileBrush.ViewboxUnitsProperty);
    }
//    private static void 
	function ViewportPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        TileBrush target = ((TileBrush) d); 
        d.PropertyChanged(TileBrush.ViewportProperty); 
    }
//    private static void 
	function ViewboxPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        TileBrush target = ((TileBrush) d); 
        d.PropertyChanged(TileBrush.ViewboxProperty); 
    }
//    private static void 
	function StretchPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        TileBrush target = ((TileBrush) d);
        d.PropertyChanged(TileBrush.StretchProperty);
    } 
//    private static void 
	function TileModePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        TileBrush target = ((TileBrush) d); 
        d.PropertyChanged(TileBrush.TileModeProperty);
    } 
//    private static void 
	function AlignmentXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        TileBrush target = ((TileBrush) d); 
        d.PropertyChanged(TileBrush.AlignmentXProperty);
    }
//    private static void 
	function AlignmentYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        TileBrush target = ((TileBrush) d);
        d.PropertyChanged(TileBrush.AlignmentYProperty);
    } 
////    private static void 
//	function CachingHintPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
//    {
////        TileBrush target = ((TileBrush) d);
//        d.PropertyChanged(RenderOptions.CachingHintProperty); 
//    } 
////    private static void 
//	function CacheInvalidationThresholdMinimumPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
//    { 
////        TileBrush target = ((TileBrush) d);
//        d.PropertyChanged(RenderOptions.CacheInvalidationThresholdMinimumProperty); 
//    }
////    private static void 
//    function CacheInvalidationThresholdMaximumPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
//    { 
////        TileBrush target = ((TileBrush) d);
//        d.PropertyChanged(RenderOptions.CacheInvalidationThresholdMaximumProperty);
//    }
    
//    /// <summary> 
//    ///     The DependencyProperty for the TileBrush.ViewportUnits property.
//    /// </summary> 
//    public static readonly DependencyProperty ViewportUnitsProperty; 
//    /// <summary>
//    ///     The DependencyProperty for the TileBrush.ViewboxUnits property. 
//    /// </summary>
//    public static readonly DependencyProperty ViewboxUnitsProperty;
//    /// <summary>
//    ///     The DependencyProperty for the TileBrush.Viewport property. 
//    /// </summary>
//    public static readonly DependencyProperty ViewportProperty; 
//    /// <summary> 
//    ///     The DependencyProperty for the TileBrush.Viewbox property.
//    /// </summary> 
//    public static readonly DependencyProperty ViewboxProperty;
//    /// <summary>
//    ///     The DependencyProperty for the TileBrush.Stretch property.
//    /// </summary> 
//    public static readonly DependencyProperty StretchProperty;
//    /// <summary> 
//    ///     The DependencyProperty for the TileBrush.TileMode property. 
//    /// </summary>
//    public static readonly DependencyProperty TileModeProperty; 
//    /// <summary>
//    ///     The DependencyProperty for the TileBrush.AlignmentX property.
//    /// </summary>
//    public static readonly DependencyProperty AlignmentXProperty; 
//    /// <summary>
//    ///     The DependencyProperty for the TileBrush.AlignmentY property. 
//    /// </summary> 
//    public static readonly DependencyProperty AlignmentYProperty;
//    internal const BrushMappingMode 
    var c_ViewportUnits = BrushMappingMode.RelativeToBoundingBox; 
//    internal const BrushMappingMode 
    var c_ViewboxUnits = BrushMappingMode.RelativeToBoundingBox; 
//    internal static Rect  
    var s_Viewport = new Rect(0,0,1,1);
//    internal static Rect 
    var s_Viewbox = new Rect(0,0,1,1); 
//    internal const Stretch 
    var c_Stretch = Stretch.Fill;
//    internal const TileMode 
    var c_TileMode = TileMode.None;
//    internal const AlignmentX 
    var c_AlignmentX = AlignmentX.Center;
//    internal const AlignmentY 
    var c_AlignmentY = AlignmentY.Center; 
//    internal const CachingHint 
    var c_CachingHint = CachingHint.Unspecified;
//    internal const double 
    var c_CacheInvalidationThresholdMinimum = 0.707; 
//    internal const double 
    var c_CacheInvalidationThresholdMaximum = 1.414; 

//    static TileBrush()
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272)
        // 
        RenderOptions.CachingHintProperty.OverrideMetadata(
            TileBrush.Type,
            new UIPropertyMetadata(CachingHint.Unspecified,
                                   new PropertyChangedCallback(null, CachingHintPropertyChanged))); 

        RenderOptions.CacheInvalidationThresholdMinimumProperty.OverrideMetadata( 
            TileBrush.Type, 
            new UIPropertyMetadata(0.707,
                                   new PropertyChangedCallback(null, CacheInvalidationThresholdMinimumPropertyChanged))); 

        RenderOptions.CacheInvalidationThresholdMaximumProperty.OverrideMetadata(
            TileBrush.Type,
            new UIPropertyMetadata(1.414, 
                                   new PropertyChangedCallback(null, CacheInvalidationThresholdMaximumPropertyChanged)));

        // Initializations 
        TileBrush.ViewportUnitsProperty = 
              RegisterProperty("ViewportUnits",
            		  BrushMappingMode.Type,
                               TileBrush.Type,
                               BrushMappingMode.RelativeToBoundingBox, 
                               new PropertyChangedCallback(null, ViewportUnitsPropertyChanged),
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsBrushMappingModeValid), 
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        TileBrush.ViewboxUnitsProperty = 
              RegisterProperty("ViewboxUnits",
            		  BrushMappingMode.Type,
                               TileBrush.Type,
                               BrushMappingMode.RelativeToBoundingBox, 
                               new PropertyChangedCallback(null, ViewboxUnitsPropertyChanged),
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsBrushMappingModeValid), 
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        TileBrush.ViewportProperty = 
              RegisterProperty("Viewport",
            		  Rect.Type,
                       TileBrush.Type,
                       new Rect(0,0,1,1), 
                       new PropertyChangedCallback(null, ViewportPropertyChanged),
                       null, 
                       /* isIndependentlyAnimated  = */ true, 
                       /* coerceValueCallback */ null);
        TileBrush.ViewboxProperty = 
              RegisterProperty("Viewbox",
                               Rect.Type,
                               TileBrush.Type,
                               new Rect(0,0,1,1), 
                               new PropertyChangedCallback(null, ViewboxPropertyChanged),
                               null, 
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null);
        TileBrush.StretchProperty = 
              RegisterProperty("Stretch",
            		  Number.Type,
                               TileBrush.Type,
                               Stretch.Fill, 
                               new PropertyChangedCallback(null, StretchPropertyChanged),
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsStretchValid), 
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        TileBrush.TileModeProperty = 
              RegisterProperty("TileMode",
            		  Number.Type,
                               TileBrush.Type,
                               TileMode.None, 
                               new PropertyChangedCallback(null, TileModePropertyChanged),
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsTileModeValid), 
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        TileBrush.AlignmentXProperty = 
              RegisterProperty("AlignmentX",
            		  Number.Type,
                               TileBrush.Type,
                               AlignmentX.Center, 
                               new PropertyChangedCallback(null, AlignmentXPropertyChanged),
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsAlignmentXValid), 
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        TileBrush.AlignmentYProperty = 
              RegisterProperty("AlignmentY",
                               Number.Type,
                               TileBrush.Type,
                               AlignmentY.Center, 
                               new PropertyChangedCallback(null, AlignmentYPropertyChanged),
                               new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsAlignmentYValid), 
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
    } 
	
	TileBrush.Type = new Type("TileBrush", TileBrush, [Brush.Type]);
	Initialize();
	
	return TileBrush;
});
