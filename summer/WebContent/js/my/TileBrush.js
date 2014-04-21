/**
 * TileBrush
 */

define(["dojo/_base/declare", "system/Type", "media/Brush"], 
		function(declare, Type, Brush){
	var TileBrush = declare("TileBrush", Brush,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(TileBrush.prototype,{
		  
	});
	
	Object.defineProperties(TileBrush,{
		  
	});
	
	TileBrush.Type = new Type("TileBrush", TileBrush, [Brush.Type]);
	return TileBrush;
});




//---------------------------------------------------------------------------- 
//
// Copyright (C) Microsoft Corporation.  All rights reserved.
//
// File: TileBrush.cs 
//
// Description: This file contains the implementation of TileBrush. 
//              The TileBrush is an abstract class of Brushes which describes 
//              a way to fill a region by tiling.  The contents of the tiles
//              are described by classes derived from TileBrush. 
//
// History:
//  04/29/2003 : [....] - Created it.
// 
//---------------------------------------------------------------------------
 
using System; 
using System.ComponentModel;
using System.Diagnostics; 
using System.Security;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Animation; 
using System.Windows.Media.Composition;
using MS.Internal; 
using System.Runtime.InteropServices; 

namespace System.Windows.Media 
{
    /// <summary>
    /// TileBrush
    /// The TileBrush is an abstract class of Brushes which describes 
    /// a way to fill a region by tiling.  The contents of the tiles
    /// are described by classes derived from TileBrush. 
    /// </summary> 
    public abstract partial class TileBrush : Brush
    { 
        #region Constructors

        /// <summary>
        /// Protected constructor for TileBrush. 
        /// Sets all values to their defaults.
        /// To set property values, use the constructor which accepts paramters 
        /// </summary> 
        protected TileBrush()
        { 
        }

        #endregion Constructors
 
        /// <summary>
        /// Obtains the current bounds of the brush's content 
        /// </summary> 
        /// <param name="contentBounds"> Output bounds of content </param>
        protected abstract void GetContentBounds(out Rect contentBounds); 

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
        [SecurityCritical,SecurityTreatAsSafe]
        internal void GetTileBrushMapping(
            Rect shapeFillBounds,
            out Matrix tileBrushMapping 
            )
        { 
            Rect contentBounds = Rect.Empty; 
            BrushMappingMode viewboxUnits = ViewboxUnits;
            bool brushIsEmpty = false; 

            // Initialize out-param
            tileBrushMapping = Matrix.Identity;
 
            // Obtain content bounds for RelativeToBoundingBox ViewboxUnits
            // 
            // If ViewboxUnits is RelativeToBoundingBox, then the tile-brush 
            // transform is also dependent on the bounds of the content.
            if (viewboxUnits == BrushMappingMode.RelativeToBoundingBox) 
            {
                GetContentBounds(out contentBounds);

                // If contentBounds is Rect.Empty then this brush renders nothing. 
                // Set the empty flag & early-out.
                if (contentBounds == Rect.Empty) 
                { 
                    brushIsEmpty = true;
                } 
            }

            //
            // Pass the properties to MilUtility_GetTileBrushMapping to calculate 
            // the mapping, unless the brush is already determined to be empty
            // 
 
            if (!brushIsEmpty)
            { 
                //
                // Obtain properties that must be set into local variables
                //
 
                Rect viewport = Viewport;
                Rect viewbox = Viewbox; 
                Matrix transformValue; 
                Matrix relativeTransformValue;
 
                Transform.GetTransformValue(
                    Transform,
                    out transformValue
                    ); 

                Transform.GetTransformValue( 
                    RelativeTransform, 
                    out relativeTransformValue
                    ); 

                unsafe
                {
                    D3DMATRIX d3dTransform; 
                    D3DMATRIX d3dRelativeTransform;
 
                    D3DMATRIX d3dContentToShape; 
                    int brushIsEmptyBOOL;
 
                    // Call MilUtility_GetTileBrushMapping, converting Matrix's to
                    // D3DMATRIX's when needed.

                    MILUtilities.ConvertToD3DMATRIX(&transformValue, &d3dTransform); 
                    MILUtilities.ConvertToD3DMATRIX(&relativeTransformValue, &d3dRelativeTransform);
 
                    MS.Win32.PresentationCore.UnsafeNativeMethods.MilCoreApi.MilUtility_GetTileBrushMapping( 
                        &d3dTransform,
                        &d3dRelativeTransform, 
                        Stretch,
                        AlignmentX,
                        AlignmentY,
                        ViewportUnits, 
                        viewboxUnits,
                        &shapeFillBounds, 
                        &contentBounds, 
                        ref viewport,
                        ref viewbox, 
                        out d3dContentToShape,
                        out brushIsEmptyBOOL
                        );
 
                    // Convert the brushIsEmpty flag from BOOL to a bool.
                    brushIsEmpty = (brushIsEmptyBOOL != 0); 
 
                    // Set output matrix if the brush isn't empty.  Otherwise, the
                    // output of MilUtility_GetTileBrushMapping must be ignored. 
                    if (!brushIsEmpty)
                    {
                        Matrix contentToShape;
                        MILUtilities.ConvertFromD3DMATRIX(&d3dContentToShape, &contentToShape); 

                        // Set the out-param to the computed tile brush mapping 
                        tileBrushMapping = contentToShape; 
                    }
                } 
            }
        }
        
        //----------------------------------------------------- 
        //
        //  Public Methods 
        //
        //-----------------------------------------------------

        #region Public Methods 

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new TileBrush Clone()
        {
            return (TileBrush)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new TileBrush CloneCurrentValue()
        {
            return (TileBrush)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void ViewportUnitsPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            TileBrush target = ((TileBrush) d);


            target.PropertyChanged(ViewportUnitsProperty); 
        }
        private static void ViewboxUnitsPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            TileBrush target = ((TileBrush) d);
 

            target.PropertyChanged(ViewboxUnitsProperty);
        }
        private static void ViewportPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            TileBrush target = ((TileBrush) d); 
 

            target.PropertyChanged(ViewportProperty); 
        }
        private static void ViewboxPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            TileBrush target = ((TileBrush) d); 

 
            target.PropertyChanged(ViewboxProperty); 
        }
        private static void StretchPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            TileBrush target = ((TileBrush) d);

 
            target.PropertyChanged(StretchProperty);
        } 
        private static void TileModePropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            TileBrush target = ((TileBrush) d); 


            target.PropertyChanged(TileModeProperty);
        } 
        private static void AlignmentXPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            TileBrush target = ((TileBrush) d); 

 
            target.PropertyChanged(AlignmentXProperty);
        }
        private static void AlignmentYPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            TileBrush target = ((TileBrush) d);
 
 
            target.PropertyChanged(AlignmentYProperty);
        } 
        private static void CachingHintPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            TileBrush target = ((TileBrush) d);
 

            target.PropertyChanged(RenderOptions.CachingHintProperty); 
        } 
        private static void CacheInvalidationThresholdMinimumPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            TileBrush target = ((TileBrush) d);


            target.PropertyChanged(RenderOptions.CacheInvalidationThresholdMinimumProperty); 
        }
        private static void CacheInvalidationThresholdMaximumPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            TileBrush target = ((TileBrush) d);
 

            target.PropertyChanged(RenderOptions.CacheInvalidationThresholdMaximumProperty);
        }
 

        #region Public Properties 
 
        /// <summary>
        ///     ViewportUnits - BrushMappingMode.  Default value is BrushMappingMode.RelativeToBoundingBox. 
        /// </summary>
        public BrushMappingMode ViewportUnits
        {
            get 
            {
                return (BrushMappingMode) GetValue(ViewportUnitsProperty); 
            } 
            set
            { 
                SetValueInternal(ViewportUnitsProperty, value);
            }
        }
 
        /// <summary>
        ///     ViewboxUnits - BrushMappingMode.  Default value is BrushMappingMode.RelativeToBoundingBox. 
        /// </summary> 
        public BrushMappingMode ViewboxUnits
        { 
            get
            {
                return (BrushMappingMode) GetValue(ViewboxUnitsProperty);
            } 
            set
            { 
                SetValueInternal(ViewboxUnitsProperty, value); 
            }
        } 

        /// <summary>
        ///     Viewport - Rect.  Default value is new Rect(0,0,1,1).
        /// </summary> 
        public Rect Viewport
        { 
            get 
            {
                return (Rect) GetValue(ViewportProperty); 
            }
            set
            {
                SetValueInternal(ViewportProperty, value); 
            }
        } 
 
        /// <summary>
        ///     Viewbox - Rect.  Default value is new Rect(0,0,1,1). 
        /// </summary>
        public Rect Viewbox
        {
            get 
            {
                return (Rect) GetValue(ViewboxProperty); 
            } 
            set
            { 
                SetValueInternal(ViewboxProperty, value);
            }
        }
 
        /// <summary>
        ///     Stretch - Stretch.  Default value is Stretch.Fill. 
        /// </summary> 
        public Stretch Stretch
        { 
            get
            {
                return (Stretch) GetValue(StretchProperty);
            } 
            set
            { 
                SetValueInternal(StretchProperty, value); 
            }
        } 

        /// <summary>
        ///     TileMode - TileMode.  Default value is TileMode.None.
        /// </summary> 
        public TileMode TileMode
        { 
            get 
            {
                return (TileMode) GetValue(TileModeProperty); 
            }
            set
            {
                SetValueInternal(TileModeProperty, value); 
            }
        } 
 
        /// <summary>
        ///     AlignmentX - AlignmentX.  Default value is AlignmentX.Center. 
        /// </summary>
        public AlignmentX AlignmentX
        {
            get 
            {
                return (AlignmentX) GetValue(AlignmentXProperty); 
            } 
            set
            { 
                SetValueInternal(AlignmentXProperty, value);
            }
        }
 
        /// <summary>
        ///     AlignmentY - AlignmentY.  Default value is AlignmentY.Center. 
        /// </summary> 
        public AlignmentY AlignmentY
        { 
            get
            {
                return (AlignmentY) GetValue(AlignmentYProperty);
            } 
            set
            { 
                SetValueInternal(AlignmentYProperty, value); 
            }
        } 

        #endregion Public Properties

        //------------------------------------------------------ 
        //
        //  Protected Methods 
        // 
        //------------------------------------------------------
 
        #region Protected Methods


 

 
        #endregion ProtectedMethods 

        //----------------------------------------------------- 
        //
        //  Internal Methods
        //
        //------------------------------------------------------ 

        #region Internal Methods 
 

 



 

 
        #endregion Internal Methods 

        //----------------------------------------------------- 
        //
        //  Internal Properties
        //
        //----------------------------------------------------- 

        #region Internal Properties 
 

 


        #endregion Internal Properties
 
        //-----------------------------------------------------
        // 
        //  Dependency Properties 
        //
        //------------------------------------------------------ 

        #region Dependency Properties

        /// <summary> 
        ///     The DependencyProperty for the TileBrush.ViewportUnits property.
        /// </summary> 
        public static readonly DependencyProperty ViewportUnitsProperty; 
        /// <summary>
        ///     The DependencyProperty for the TileBrush.ViewboxUnits property. 
        /// </summary>
        public static readonly DependencyProperty ViewboxUnitsProperty;
        /// <summary>
        ///     The DependencyProperty for the TileBrush.Viewport property. 
        /// </summary>
        public static readonly DependencyProperty ViewportProperty; 
        /// <summary> 
        ///     The DependencyProperty for the TileBrush.Viewbox property.
        /// </summary> 
        public static readonly DependencyProperty ViewboxProperty;
        /// <summary>
        ///     The DependencyProperty for the TileBrush.Stretch property.
        /// </summary> 
        public static readonly DependencyProperty StretchProperty;
        /// <summary> 
        ///     The DependencyProperty for the TileBrush.TileMode property. 
        /// </summary>
        public static readonly DependencyProperty TileModeProperty; 
        /// <summary>
        ///     The DependencyProperty for the TileBrush.AlignmentX property.
        /// </summary>
        public static readonly DependencyProperty AlignmentXProperty; 
        /// <summary>
        ///     The DependencyProperty for the TileBrush.AlignmentY property. 
        /// </summary> 
        public static readonly DependencyProperty AlignmentYProperty;
 
        #endregion Dependency Properties

        //-----------------------------------------------------
        // 
        //  Internal Fields
        // 
        //------------------------------------------------------ 

        #region Internal Fields 



 

        internal const BrushMappingMode c_ViewportUnits = BrushMappingMode.RelativeToBoundingBox; 
        internal const BrushMappingMode c_ViewboxUnits = BrushMappingMode.RelativeToBoundingBox; 
        internal static Rect s_Viewport = new Rect(0,0,1,1);
        internal static Rect s_Viewbox = new Rect(0,0,1,1); 
        internal const Stretch c_Stretch = Stretch.Fill;
        internal const TileMode c_TileMode = TileMode.None;
        internal const AlignmentX c_AlignmentX = AlignmentX.Center;
        internal const AlignmentY c_AlignmentY = AlignmentY.Center; 
        internal const CachingHint c_CachingHint = CachingHint.Unspecified;
        internal const double c_CacheInvalidationThresholdMinimum = 0.707; 
        internal const double c_CacheInvalidationThresholdMaximum = 1.414; 

        #endregion Internal Fields 



        #region Constructors 

        //------------------------------------------------------ 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------

        static TileBrush()
        { 
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime 
            // of your app.  (Windows OS Bug #947272)
            // 
            RenderOptions.CachingHintProperty.OverrideMetadata(
                typeof(TileBrush),
                new UIPropertyMetadata(CachingHint.Unspecified,
                                       new PropertyChangedCallback(CachingHintPropertyChanged))); 

            RenderOptions.CacheInvalidationThresholdMinimumProperty.OverrideMetadata( 
                typeof(TileBrush), 
                new UIPropertyMetadata(0.707,
                                       new PropertyChangedCallback(CacheInvalidationThresholdMinimumPropertyChanged))); 

            RenderOptions.CacheInvalidationThresholdMaximumProperty.OverrideMetadata(
                typeof(TileBrush),
                new UIPropertyMetadata(1.414, 
                                       new PropertyChangedCallback(CacheInvalidationThresholdMaximumPropertyChanged)));
 
            // Initializations 
            Type typeofThis = typeof(TileBrush);
            ViewportUnitsProperty = 
                  RegisterProperty("ViewportUnits",
                                   typeof(BrushMappingMode),
                                   typeofThis,
                                   BrushMappingMode.RelativeToBoundingBox, 
                                   new PropertyChangedCallback(ViewportUnitsPropertyChanged),
                                   new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsBrushMappingModeValid), 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
            ViewboxUnitsProperty = 
                  RegisterProperty("ViewboxUnits",
                                   typeof(BrushMappingMode),
                                   typeofThis,
                                   BrushMappingMode.RelativeToBoundingBox, 
                                   new PropertyChangedCallback(ViewboxUnitsPropertyChanged),
                                   new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsBrushMappingModeValid), 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
            ViewportProperty = 
                  RegisterProperty("Viewport",
                                   typeof(Rect),
                                   typeofThis,
                                   new Rect(0,0,1,1), 
                                   new PropertyChangedCallback(ViewportPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null);
            ViewboxProperty = 
                  RegisterProperty("Viewbox",
                                   typeof(Rect),
                                   typeofThis,
                                   new Rect(0,0,1,1), 
                                   new PropertyChangedCallback(ViewboxPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null);
            StretchProperty = 
                  RegisterProperty("Stretch",
                                   typeof(Stretch),
                                   typeofThis,
                                   Stretch.Fill, 
                                   new PropertyChangedCallback(StretchPropertyChanged),
                                   new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsStretchValid), 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
            TileModeProperty = 
                  RegisterProperty("TileMode",
                                   typeof(TileMode),
                                   typeofThis,
                                   TileMode.None, 
                                   new PropertyChangedCallback(TileModePropertyChanged),
                                   new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsTileModeValid), 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
            AlignmentXProperty = 
                  RegisterProperty("AlignmentX",
                                   typeof(AlignmentX),
                                   typeofThis,
                                   AlignmentX.Center, 
                                   new PropertyChangedCallback(AlignmentXPropertyChanged),
                                   new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsAlignmentXValid), 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
            AlignmentYProperty = 
                  RegisterProperty("AlignmentY",
                                   typeof(AlignmentY),
                                   typeofThis,
                                   AlignmentY.Center, 
                                   new PropertyChangedCallback(AlignmentYPropertyChanged),
                                   new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsAlignmentYValid), 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
        } 



        #endregion Constructors 
    }
} 


