//---------------------------------------------------------------------------- 
//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
// Description: This file contains the implementation of RadialGradientBrush. 
//              The RadialGradientBrush is a GradientBrush which defines its
//              Gradient as a radial interpolation within an Ellipse. 
// 
// History:
//  05/08/2003 : [....] - Created it. 
//  09/21/2004 : timothyc - Added GradientStopCollection constructor.
//
//---------------------------------------------------------------------------
 
using MS.Internal;
using MS.Internal.PresentationCore; 
using System; 
using System.ComponentModel;
using System.ComponentModel.Design.Serialization; 
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows; 
using System.Windows.Media.Animation;
using System.Windows.Media.Composition; 
using System.Security; 
using System.Security.Permissions;
 
using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID;

namespace System.Windows.Media 
{
    /// <summary> 
    /// RadialGradientBrush - This GradientBrush defines its Gradient as an interpolation 
    /// within an Ellipse.
    /// </summary> 
    public sealed partial class RadialGradientBrush : GradientBrush
    {
        #region Constructors
 
        /// <summary>
        /// Default constructor for RadialGradientBrush.  The resulting brush has no content. 
        /// </summary> 
        public RadialGradientBrush() : base()
        { 
        }

        /// <summary>
        /// RadialGradientBrush Constructor 
        /// Constructs a RadialGradientBrush with two colors specified for GradientStops at
        /// offsets 0.0 and 1.0. 
        /// </summary> 
        /// <param name="startColor"> The Color at offset 0.0. </param>
        /// <param name="endColor"> The Color at offset 1.0. </param> 
        public RadialGradientBrush(Color startColor,
                                   Color endColor) : base()
        {
            GradientStops.Add(new GradientStop(startColor, 0.0)); 
            GradientStops.Add(new GradientStop(endColor, 1.0));
        } 
 
        /// <summary>
        /// RadialGradientBrush Constructor 
        /// Constructs a RadialGradientBrush with GradientStops set to the passed-in
        /// collection.
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param> 
        public RadialGradientBrush(GradientStopCollection gradientStopCollection)
                                                   : base(gradientStopCollection) 
        { 
        }
 

        #endregion Constructors

        /// <SecurityNote> 
        ///   Critical: This code acceses an unsafe code block
        ///   TreatAsSafe: This does not expose any data uses all local variables. 
        ///   Sending instructions to the channel is considered a safe operation.Also 
        ///   all calls to copybytes have been verified so the operation is safe
        /// </SecurityNote> 
        [SecurityCritical,SecurityTreatAsSafe]
        private void ManualUpdateResource(DUCE.Channel channel, bool skipOnChannelCheck)
        {
            // If we're told we can skip the channel check, then we must be on channel 
            Debug.Assert(!skipOnChannelCheck || _duceResource.IsOnChannel(channel));
 
            if (skipOnChannelCheck || _duceResource.IsOnChannel(channel)) 
            {
                Transform vTransform = Transform; 
                Transform vRelativeTransform = RelativeTransform;
                GradientStopCollection vGradientStops = GradientStops;

                DUCE.ResourceHandle hTransform; 
                if (vTransform == null ||
                    Object.ReferenceEquals(vTransform, Transform.Identity) 
                    ) 
                {
                    hTransform = DUCE.ResourceHandle.Null; 
                }
                else
                {
                    hTransform = ((DUCE.IResource)vTransform).GetHandle(channel); 
                }
                DUCE.ResourceHandle hRelativeTransform; 
                if (vRelativeTransform == null || 
                    Object.ReferenceEquals(vRelativeTransform, Transform.Identity)
                    ) 
                {
                    hRelativeTransform = DUCE.ResourceHandle.Null;
                }
                else 
                {
                    hRelativeTransform = ((DUCE.IResource)vRelativeTransform).GetHandle(channel); 
                } 
                DUCE.ResourceHandle hOpacityAnimations = GetAnimationResourceHandle(OpacityProperty, channel);
                DUCE.ResourceHandle hCenterAnimations = GetAnimationResourceHandle(CenterProperty, channel); 
                DUCE.ResourceHandle hRadiusXAnimations = GetAnimationResourceHandle(RadiusXProperty, channel);
                DUCE.ResourceHandle hRadiusYAnimations = GetAnimationResourceHandle(RadiusYProperty, channel);
                DUCE.ResourceHandle hGradientOriginAnimations = GetAnimationResourceHandle(GradientOriginProperty, channel);
 
                DUCE.MILCMD_RADIALGRADIENTBRUSH data;
                unsafe 
                { 
                    data.Type = MILCMD.MilCmdRadialGradientBrush;
                    data.Handle = _duceResource.GetHandle(channel); 
                    double tempOpacity = Opacity;
                    DUCE.CopyBytes((byte*)&data.Opacity, (byte*)&tempOpacity, 8);
                    data.hOpacityAnimations = hOpacityAnimations;
                    data.hTransform = hTransform; 
                    data.hRelativeTransform = hRelativeTransform;
                    data.ColorInterpolationMode = ColorInterpolationMode; 
                    data.MappingMode = MappingMode; 
                    data.SpreadMethod = SpreadMethod;
 
                    Point tempCenter = Center;
                    DUCE.CopyBytes((byte*)&data.Center, (byte*)&tempCenter, 16);
                    data.hCenterAnimations = hCenterAnimations;
                    double tempRadiusX = RadiusX; 
                    DUCE.CopyBytes((byte*)&data.RadiusX, (byte*)&tempRadiusX, 8);
                    data.hRadiusXAnimations = hRadiusXAnimations; 
                    double tempRadiusY = RadiusY; 
                    DUCE.CopyBytes((byte*)&data.RadiusY, (byte*)&tempRadiusY, 8);
                    data.hRadiusYAnimations = hRadiusYAnimations; 
                    Point tempGradientOrigin = GradientOrigin;
                    DUCE.CopyBytes((byte*)&data.GradientOrigin, (byte*)&tempGradientOrigin, 16);
                    data.hGradientOriginAnimations = hGradientOriginAnimations;
 
                    // NTRAID#Longhorn-1011154-2004/8/12-asecchia GradientStopCollection:  Need to enforce upper-limit of gradient stop capacity
 
                    int count = (vGradientStops == null) ? 0 : vGradientStops.Count; 
                    data.GradientStopsSize = (UInt32)(sizeof(DUCE.MIL_GRADIENTSTOP)*count);
 
                    channel.BeginCommand(
                        (byte*)&data,
                        sizeof(DUCE.MILCMD_RADIALGRADIENTBRUSH),
                        sizeof(DUCE.MIL_GRADIENTSTOP)*count 
                        );
 
                    for (int i=0; i<count; i++) 
                    {
                        DUCE.MIL_GRADIENTSTOP stopCmd; 
                        GradientStop gradStop = vGradientStops.Internal_GetItem(i);

                        double temp = gradStop.Offset;
                        DUCE.CopyBytes((byte*)&stopCmd.Position,(byte*)&temp, sizeof(double)); 
                        stopCmd.Color = CompositionResourceManager.ColorToMilColorF(gradStop.Color);
 
                        channel.AppendCommandData( 
                            (byte*)&stopCmd,
                            sizeof(DUCE.MIL_GRADIENTSTOP) 
                            );
                    }

                    channel.EndCommand(); 
                }
            } 
        } 
    }
} 


// File provided for Reference Use Only by Microsoft Corporation (c) 2007.
//---------------------------------------------------------------------------- 
//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
// Description: This file contains the implementation of RadialGradientBrush. 
//              The RadialGradientBrush is a GradientBrush which defines its
//              Gradient as a radial interpolation within an Ellipse. 
// 
// History:
//  05/08/2003 : [....] - Created it. 
//  09/21/2004 : timothyc - Added GradientStopCollection constructor.
//
//---------------------------------------------------------------------------
 
using MS.Internal;
using MS.Internal.PresentationCore; 
using System; 
using System.ComponentModel;
using System.ComponentModel.Design.Serialization; 
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows; 
using System.Windows.Media.Animation;
using System.Windows.Media.Composition; 
using System.Security; 
using System.Security.Permissions;
 
using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID;

namespace System.Windows.Media 
{
    /// <summary> 
    /// RadialGradientBrush - This GradientBrush defines its Gradient as an interpolation 
    /// within an Ellipse.
    /// </summary> 
    public sealed partial class RadialGradientBrush : GradientBrush
    {
        #region Constructors
 
        /// <summary>
        /// Default constructor for RadialGradientBrush.  The resulting brush has no content. 
        /// </summary> 
        public RadialGradientBrush() : base()
        { 
        }

        /// <summary>
        /// RadialGradientBrush Constructor 
        /// Constructs a RadialGradientBrush with two colors specified for GradientStops at
        /// offsets 0.0 and 1.0. 
        /// </summary> 
        /// <param name="startColor"> The Color at offset 0.0. </param>
        /// <param name="endColor"> The Color at offset 1.0. </param> 
        public RadialGradientBrush(Color startColor,
                                   Color endColor) : base()
        {
            GradientStops.Add(new GradientStop(startColor, 0.0)); 
            GradientStops.Add(new GradientStop(endColor, 1.0));
        } 
 
        /// <summary>
        /// RadialGradientBrush Constructor 
        /// Constructs a RadialGradientBrush with GradientStops set to the passed-in
        /// collection.
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param> 
        public RadialGradientBrush(GradientStopCollection gradientStopCollection)
                                                   : base(gradientStopCollection) 
        { 
        }
 

        #endregion Constructors

        /// <SecurityNote> 
        ///   Critical: This code acceses an unsafe code block
        ///   TreatAsSafe: This does not expose any data uses all local variables. 
        ///   Sending instructions to the channel is considered a safe operation.Also 
        ///   all calls to copybytes have been verified so the operation is safe
        /// </SecurityNote> 
        [SecurityCritical,SecurityTreatAsSafe]
        private void ManualUpdateResource(DUCE.Channel channel, bool skipOnChannelCheck)
        {
            // If we're told we can skip the channel check, then we must be on channel 
            Debug.Assert(!skipOnChannelCheck || _duceResource.IsOnChannel(channel));
 
            if (skipOnChannelCheck || _duceResource.IsOnChannel(channel)) 
            {
                Transform vTransform = Transform; 
                Transform vRelativeTransform = RelativeTransform;
                GradientStopCollection vGradientStops = GradientStops;

                DUCE.ResourceHandle hTransform; 
                if (vTransform == null ||
                    Object.ReferenceEquals(vTransform, Transform.Identity) 
                    ) 
                {
                    hTransform = DUCE.ResourceHandle.Null; 
                }
                else
                {
                    hTransform = ((DUCE.IResource)vTransform).GetHandle(channel); 
                }
                DUCE.ResourceHandle hRelativeTransform; 
                if (vRelativeTransform == null || 
                    Object.ReferenceEquals(vRelativeTransform, Transform.Identity)
                    ) 
                {
                    hRelativeTransform = DUCE.ResourceHandle.Null;
                }
                else 
                {
                    hRelativeTransform = ((DUCE.IResource)vRelativeTransform).GetHandle(channel); 
                } 
                DUCE.ResourceHandle hOpacityAnimations = GetAnimationResourceHandle(OpacityProperty, channel);
                DUCE.ResourceHandle hCenterAnimations = GetAnimationResourceHandle(CenterProperty, channel); 
                DUCE.ResourceHandle hRadiusXAnimations = GetAnimationResourceHandle(RadiusXProperty, channel);
                DUCE.ResourceHandle hRadiusYAnimations = GetAnimationResourceHandle(RadiusYProperty, channel);
                DUCE.ResourceHandle hGradientOriginAnimations = GetAnimationResourceHandle(GradientOriginProperty, channel);
 
                DUCE.MILCMD_RADIALGRADIENTBRUSH data;
                unsafe 
                { 
                    data.Type = MILCMD.MilCmdRadialGradientBrush;
                    data.Handle = _duceResource.GetHandle(channel); 
                    double tempOpacity = Opacity;
                    DUCE.CopyBytes((byte*)&data.Opacity, (byte*)&tempOpacity, 8);
                    data.hOpacityAnimations = hOpacityAnimations;
                    data.hTransform = hTransform; 
                    data.hRelativeTransform = hRelativeTransform;
                    data.ColorInterpolationMode = ColorInterpolationMode; 
                    data.MappingMode = MappingMode; 
                    data.SpreadMethod = SpreadMethod;
 
                    Point tempCenter = Center;
                    DUCE.CopyBytes((byte*)&data.Center, (byte*)&tempCenter, 16);
                    data.hCenterAnimations = hCenterAnimations;
                    double tempRadiusX = RadiusX; 
                    DUCE.CopyBytes((byte*)&data.RadiusX, (byte*)&tempRadiusX, 8);
                    data.hRadiusXAnimations = hRadiusXAnimations; 
                    double tempRadiusY = RadiusY; 
                    DUCE.CopyBytes((byte*)&data.RadiusY, (byte*)&tempRadiusY, 8);
                    data.hRadiusYAnimations = hRadiusYAnimations; 
                    Point tempGradientOrigin = GradientOrigin;
                    DUCE.CopyBytes((byte*)&data.GradientOrigin, (byte*)&tempGradientOrigin, 16);
                    data.hGradientOriginAnimations = hGradientOriginAnimations;
 
                    // NTRAID#Longhorn-1011154-2004/8/12-asecchia GradientStopCollection:  Need to enforce upper-limit of gradient stop capacity
 
                    int count = (vGradientStops == null) ? 0 : vGradientStops.Count; 
                    data.GradientStopsSize = (UInt32)(sizeof(DUCE.MIL_GRADIENTSTOP)*count);
 
                    channel.BeginCommand(
                        (byte*)&data,
                        sizeof(DUCE.MILCMD_RADIALGRADIENTBRUSH),
                        sizeof(DUCE.MIL_GRADIENTSTOP)*count 
                        );
 
                    for (int i=0; i<count; i++) 
                    {
                        DUCE.MIL_GRADIENTSTOP stopCmd; 
                        GradientStop gradStop = vGradientStops.Internal_GetItem(i);

                        double temp = gradStop.Offset;
                        DUCE.CopyBytes((byte*)&stopCmd.Position,(byte*)&temp, sizeof(double)); 
                        stopCmd.Color = CompositionResourceManager.ColorToMilColorF(gradStop.Color);
 
                        channel.AppendCommandData( 
                            (byte*)&stopCmd,
                            sizeof(DUCE.MIL_GRADIENTSTOP) 
                            );
                    }

                    channel.EndCommand(); 
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
        public new RadialGradientBrush Clone()
        {
            return (RadialGradientBrush)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new RadialGradientBrush CloneCurrentValue()
        {
            return (RadialGradientBrush)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void CenterPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            RadialGradientBrush target = ((RadialGradientBrush) d);


            target.PropertyChanged(CenterProperty); 
        }
        private static void RadiusXPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            RadialGradientBrush target = ((RadialGradientBrush) d);
 

            target.PropertyChanged(RadiusXProperty);
        }
        private static void RadiusYPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            RadialGradientBrush target = ((RadialGradientBrush) d); 
 

            target.PropertyChanged(RadiusYProperty); 
        }
        private static void GradientOriginPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            RadialGradientBrush target = ((RadialGradientBrush) d); 

 
            target.PropertyChanged(GradientOriginProperty); 
        }
 

        #region Public Properties

        /// <summary> 
        ///     Center - Point.  Default value is new Point(0.5,0.5).
        /// </summary> 
        public Point Center 
        {
            get 
            {
                return (Point) GetValue(CenterProperty);
            }
            set 
            {
                SetValueInternal(CenterProperty, value); 
            } 
        }
 
        /// <summary>
        ///     RadiusX - double.  Default value is 0.5.
        /// </summary>
        public double RadiusX 
        {
            get 
            { 
                return (double) GetValue(RadiusXProperty);
            } 
            set
            {
                SetValueInternal(RadiusXProperty, value);
            } 
        }
 
        /// <summary> 
        ///     RadiusY - double.  Default value is 0.5.
        /// </summary> 
        public double RadiusY
        {
            get
            { 
                return (double) GetValue(RadiusYProperty);
            } 
            set 
            {
                SetValueInternal(RadiusYProperty, value); 
            }
        }

        /// <summary> 
        ///     GradientOrigin - Point.  Default value is new Point(0.5,0.5).
        /// </summary> 
        public Point GradientOrigin 
        {
            get 
            {
                return (Point) GetValue(GradientOriginProperty);
            }
            set 
            {
                SetValueInternal(GradientOriginProperty, value); 
            } 
        }
 
        #endregion Public Properties

        //------------------------------------------------------
        // 
        //  Protected Methods
        // 
        //------------------------------------------------------ 

        #region Protected Methods 

        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary> 
        /// <returns>The new Freezable.</returns>
        protected override Freezable CreateInstanceCore() 
        { 
            return new RadialGradientBrush();
        } 



        #endregion ProtectedMethods 

        //----------------------------------------------------- 
        // 
        //  Internal Methods
        // 
        //------------------------------------------------------

        #region Internal Methods
 
        /// <SecurityNote>
        ///     Critical: This code calls into an unsafe code block 
        ///     TreatAsSafe: This code does not return any critical data.It is ok to expose 
        ///     Channels are safe to call into and do not go cross domain and cross process
        /// </SecurityNote> 
        [SecurityCritical,SecurityTreatAsSafe]
        internal override void UpdateResource(DUCE.Channel channel, bool skipOnChannelCheck)
        {
            ManualUpdateResource(channel, skipOnChannelCheck); 
            base.UpdateResource(channel, skipOnChannelCheck);
        } 
        internal override DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel) 
        {
 
                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_RADIALGRADIENTBRUSH))
                {
                    Transform vTransform = Transform;
                    if (vTransform != null) ((DUCE.IResource)vTransform).AddRefOnChannel(channel); 
                    Transform vRelativeTransform = RelativeTransform;
                    if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).AddRefOnChannel(channel); 
 
                    AddRefOnChannelAnimations(channel);
 

                    UpdateResource(channel, true /* skip "on channel" check - we already know that we're on channel */ );
                }
 
                return _duceResource.GetHandle(channel);
 
        } 
        internal override void ReleaseOnChannelCore(DUCE.Channel channel)
        { 

                Debug.Assert(_duceResource.IsOnChannel(channel));

                if (_duceResource.ReleaseOnChannel(channel)) 
                {
                    Transform vTransform = Transform; 
                    if (vTransform != null) ((DUCE.IResource)vTransform).ReleaseOnChannel(channel); 
                    Transform vRelativeTransform = RelativeTransform;
                    if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).ReleaseOnChannel(channel); 

                    ReleaseOnChannelAnimations(channel);

                } 

        } 
        internal override DUCE.ResourceHandle GetHandleCore(DUCE.Channel channel) 
        {
            // Note that we are in a lock here already. 
            return _duceResource.GetHandle(channel);
        }
        internal override int GetChannelCountCore()
        { 
            // must already be in composition lock here
            return _duceResource.GetChannelCount(); 
        } 
        internal override DUCE.Channel GetChannelCore(int index)
        { 
            // Note that we are in a lock here already.
            return _duceResource.GetChannel(index);
        }
 

        #endregion Internal Methods 
 
        //-----------------------------------------------------
        // 
        //  Internal Properties
        //
        //-----------------------------------------------------
 
        #region Internal Properties
 
        // 
        //  This property finds the correct initial size for the _effectiveValues store on the
        //  current DependencyObject as a performance optimization 
        //
        //  This includes:
        //    GradientStops
        // 
        internal override int EffectiveValuesInitialSize
        { 
            get 
            {
                return 1; 
            }
        }

 

        #endregion Internal Properties 
 
        //-----------------------------------------------------
        // 
        //  Dependency Properties
        //
        //------------------------------------------------------
 
        #region Dependency Properties
 
        /// <summary> 
        ///     The DependencyProperty for the RadialGradientBrush.Center property.
        /// </summary> 
        public static readonly DependencyProperty CenterProperty;
        /// <summary>
        ///     The DependencyProperty for the RadialGradientBrush.RadiusX property.
        /// </summary> 
        public static readonly DependencyProperty RadiusXProperty;
        /// <summary> 
        ///     The DependencyProperty for the RadialGradientBrush.RadiusY property. 
        /// </summary>
        public static readonly DependencyProperty RadiusYProperty; 
        /// <summary>
        ///     The DependencyProperty for the RadialGradientBrush.GradientOrigin property.
        /// </summary>
        public static readonly DependencyProperty GradientOriginProperty; 

        #endregion Dependency Properties 
 
        //-----------------------------------------------------
        // 
        //  Internal Fields
        //
        //------------------------------------------------------
 
        #region Internal Fields
 
 

        internal System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource(); 

        internal static Point s_Center = new Point(0.5,0.5);
        internal const double c_RadiusX = 0.5;
        internal const double c_RadiusY = 0.5; 
        internal static Point s_GradientOrigin = new Point(0.5,0.5);
 
        #endregion Internal Fields 

 

        #region Constructors

        //------------------------------------------------------ 
        //
        //  Constructors 
        // 
        //-----------------------------------------------------
 
        static RadialGradientBrush()
        {
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime
            // of your app.  (Windows OS Bug #947272) 
            // 

 
            // Initializations
            Type typeofThis = typeof(RadialGradientBrush);
            CenterProperty =
                  RegisterProperty("Center", 
                                   typeof(Point),
                                   typeofThis, 
                                   new Point(0.5,0.5), 
                                   new PropertyChangedCallback(CenterPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null);
            RadiusXProperty =
                  RegisterProperty("RadiusX", 
                                   typeof(double),
                                   typeofThis, 
                                   0.5, 
                                   new PropertyChangedCallback(RadiusXPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null);
            RadiusYProperty =
                  RegisterProperty("RadiusY", 
                                   typeof(double),
                                   typeofThis, 
                                   0.5, 
                                   new PropertyChangedCallback(RadiusYPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null);
            GradientOriginProperty =
                  RegisterProperty("GradientOrigin", 
                                   typeof(Point),
                                   typeofThis, 
                                   new Point(0.5,0.5), 
                                   new PropertyChangedCallback(GradientOriginPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null);
        }
 

 
        #endregion Constructors 
    }
} 


// File provided for Reference Use Only by Microsoft Corporation (c) 2007.
