//---------------------------------------------------------------------------- 
//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
// Description: This file contains the implementation of LinearGradientBrush. 
//              The LinearGradientBrush is a GradientBrush which defines its
//              Gradient as a linear interpolation between two parallel lines. 
// 
// History:
//  05/07/2003 : [....] - Created it. 
//  09/21/2004 : timothyc - Added GradientStopCollection constructors.
//
//---------------------------------------------------------------------------
 
using MS.Internal;
using MS.Internal.PresentationCore; 
using System; 
using System.ComponentModel;
using System.ComponentModel.Design.Serialization; 
using System.Diagnostics;
using System.Reflection;
using System.Windows;
using System.Windows.Media; 
using System.Windows.Media.Animation;
using System.Runtime.InteropServices; 
using System.Windows.Media.Composition; 
using System.Security;
using System.Security.Permissions; 
using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID;

namespace System.Windows.Media 
{
    /// <summary> 
    /// LinearGradientBrush - This GradientBrush defines its Gradient as an interpolation 
    /// between two parallel lines.
    /// </summary> 
    public sealed partial class LinearGradientBrush : GradientBrush
    {
        #region Constructors
 
        /// <summary>
        /// Default constructor for LinearGradientBrush.  The resulting brush has no content. 
        /// </summary> 
        public LinearGradientBrush() : base()
        { 
        }

        /// <summary>
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with GradientStops specified at offset 0.0 and
        /// 1.0. The StartPoint is set to (0,0) and the EndPoint is derived from the angle 
        /// such that 1) the line containing the StartPoint and EndPoint is 'angle' degrees 
        /// from the horizontal in the direction of positive Y, and 2) the EndPoint lies on
        ///  the perimeter of the unit circle. 
        /// </summary>
        /// <param name="startColor"> The Color at offset 0.0. </param>
        /// <param name="endColor"> The Color at offset 1.0. </param>
        /// <param name="angle"> The angle, in degrees, that the gradient will be away from horizontal. </param> 
        public LinearGradientBrush(Color startColor,
                                   Color endColor, 
                                   double angle) : base() 
        {
            EndPoint = EndPointFromAngle(angle); 

            GradientStops.Add(new GradientStop(startColor, 0.0));
            GradientStops.Add(new GradientStop(endColor, 1.0));
        } 

        /// <summary> 
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with two colors at the specified start and end points.
        /// </summary> 
        /// <param name="startColor"> The Color at offset 0.0. </param>
        /// <param name="endColor"> The Color at offset 1.0. </param>
        /// <param name="startPoint"> The start point</param>
        /// <param name="endPoint"> The end point</param> 
        public LinearGradientBrush(Color startColor,
                                   Color endColor, 
                                   Point startPoint, 
                                   Point endPoint) : base()
        { 
            StartPoint = startPoint;
            EndPoint = endPoint;

            GradientStops.Add(new GradientStop(startColor, 0.0)); 
            GradientStops.Add(new GradientStop(endColor, 1.0));
        } 
 
        /// <summary>
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with GradientStops set to the passed-in collection.
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param>
        public LinearGradientBrush(GradientStopCollection gradientStopCollection) 
                                                : base (gradientStopCollection)
        { 
        } 

        /// <summary> 
        /// LinearGradientBrush Constructor
        /// Constructs a LinearGradientBrush with GradientStops set to the passed-in collection.
        /// Constructs a LinearGradientBrush with GradientStops specified at offset 0.0 and
        /// 1.0. The StartPoint is set to (0,0) and the EndPoint is derived from the angle 
        /// such that 1) the line containing the StartPoint and EndPoint is 'angle' degrees
        /// from the horizontal in the direction of positive Y, and 2) the EndPoint lies on 
        ///  the perimeter of the unit circle. 
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param> 
        /// <param name="angle"> The angle, in degrees, that the gradient will be away from horizontal. </param>
        public LinearGradientBrush(GradientStopCollection gradientStopCollection,
                                   double angle) : base (gradientStopCollection)
        { 
            EndPoint = EndPointFromAngle(angle);
        } 
 
        /// <summary>
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with GradientStops set to the passed-in collection.
        /// The StartPoint and EndPoint are set to the specified startPoint and endPoint.
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param> 
        /// <param name="startPoint"> The start point</param>
        /// <param name="endPoint"> The end point</param> 
        public LinearGradientBrush(GradientStopCollection gradientStopCollection, 
                                   Point startPoint,
                                   Point endPoint) : base (gradientStopCollection) 
        {
            StartPoint = startPoint;
            EndPoint = endPoint;
        } 

 
        #endregion Constructors 

        /// <SecurityNote> 
        ///     Critical: This code accesses unsafe code blocks
        ///     TreatAsSafe: This code does is safe to call but needs to be verified for correctness
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
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
                DUCE.ResourceHandle hStartPointAnimations = GetAnimationResourceHandle(StartPointProperty, channel);
                DUCE.ResourceHandle hEndPointAnimations = GetAnimationResourceHandle(EndPointProperty, channel); 

                unsafe 
                { 
                    DUCE.MILCMD_LINEARGRADIENTBRUSH data;
                    data.Type = MILCMD.MilCmdLinearGradientBrush; 
                    data.Handle = _duceResource.GetHandle(channel);
                    double tempOpacity = Opacity;
                    DUCE.CopyBytes((byte*)&data.Opacity, (byte*)&tempOpacity, 8);
                    data.hOpacityAnimations = hOpacityAnimations; 
                    data.hTransform = hTransform;
                    data.hRelativeTransform = hRelativeTransform; 
                    data.ColorInterpolationMode = ColorInterpolationMode; 
                    data.MappingMode = MappingMode;
                    data.SpreadMethod = SpreadMethod; 

                    Point tempStartPoint = StartPoint;
                    DUCE.CopyBytes((byte*)&data.StartPoint, (byte*)&tempStartPoint, 16);
                    data.hStartPointAnimations = hStartPointAnimations; 
                    Point tempEndPoint = EndPoint;
                    DUCE.CopyBytes((byte*)&data.EndPoint, (byte*)&tempEndPoint, 16); 
                    data.hEndPointAnimations = hEndPointAnimations; 

                    // NTRAID#Longhorn-1011154-2004/8/12-asecchia GradientStopCollection:  Need to enforce upper-limit of gradient stop capacity 

                    int count = (vGradientStops == null) ? 0 : vGradientStops.Count;
                    data.GradientStopsSize = (UInt32)(sizeof(DUCE.MIL_GRADIENTSTOP)*count);
 
                    channel.BeginCommand(
                        (byte*)&data, 
                        sizeof(DUCE.MILCMD_LINEARGRADIENTBRUSH), 
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

        private Point EndPointFromAngle(double angle) 
        {
            // Convert the angle from degrees to radians 
            angle = angle * (1.0/180.0) * System.Math.PI; 

            return (new Point(System.Math.Cos(angle), System.Math.Sin(angle))); 

        }
    }
} 


// File provided for Reference Use Only by Microsoft Corporation (c) 2007.
//---------------------------------------------------------------------------- 
//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
// Description: This file contains the implementation of LinearGradientBrush. 
//              The LinearGradientBrush is a GradientBrush which defines its
//              Gradient as a linear interpolation between two parallel lines. 
// 
// History:
//  05/07/2003 : [....] - Created it. 
//  09/21/2004 : timothyc - Added GradientStopCollection constructors.
//
//---------------------------------------------------------------------------
 
using MS.Internal;
using MS.Internal.PresentationCore; 
using System; 
using System.ComponentModel;
using System.ComponentModel.Design.Serialization; 
using System.Diagnostics;
using System.Reflection;
using System.Windows;
using System.Windows.Media; 
using System.Windows.Media.Animation;
using System.Runtime.InteropServices; 
using System.Windows.Media.Composition; 
using System.Security;
using System.Security.Permissions; 
using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID;

namespace System.Windows.Media 
{
    /// <summary> 
    /// LinearGradientBrush - This GradientBrush defines its Gradient as an interpolation 
    /// between two parallel lines.
    /// </summary> 
    public sealed partial class LinearGradientBrush : GradientBrush
    {
        #region Constructors
 
        /// <summary>
        /// Default constructor for LinearGradientBrush.  The resulting brush has no content. 
        /// </summary> 
        public LinearGradientBrush() : base()
        { 
        }

        /// <summary>
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with GradientStops specified at offset 0.0 and
        /// 1.0. The StartPoint is set to (0,0) and the EndPoint is derived from the angle 
        /// such that 1) the line containing the StartPoint and EndPoint is 'angle' degrees 
        /// from the horizontal in the direction of positive Y, and 2) the EndPoint lies on
        ///  the perimeter of the unit circle. 
        /// </summary>
        /// <param name="startColor"> The Color at offset 0.0. </param>
        /// <param name="endColor"> The Color at offset 1.0. </param>
        /// <param name="angle"> The angle, in degrees, that the gradient will be away from horizontal. </param> 
        public LinearGradientBrush(Color startColor,
                                   Color endColor, 
                                   double angle) : base() 
        {
            EndPoint = EndPointFromAngle(angle); 

            GradientStops.Add(new GradientStop(startColor, 0.0));
            GradientStops.Add(new GradientStop(endColor, 1.0));
        } 

        /// <summary> 
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with two colors at the specified start and end points.
        /// </summary> 
        /// <param name="startColor"> The Color at offset 0.0. </param>
        /// <param name="endColor"> The Color at offset 1.0. </param>
        /// <param name="startPoint"> The start point</param>
        /// <param name="endPoint"> The end point</param> 
        public LinearGradientBrush(Color startColor,
                                   Color endColor, 
                                   Point startPoint, 
                                   Point endPoint) : base()
        { 
            StartPoint = startPoint;
            EndPoint = endPoint;

            GradientStops.Add(new GradientStop(startColor, 0.0)); 
            GradientStops.Add(new GradientStop(endColor, 1.0));
        } 
 
        /// <summary>
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with GradientStops set to the passed-in collection.
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param>
        public LinearGradientBrush(GradientStopCollection gradientStopCollection) 
                                                : base (gradientStopCollection)
        { 
        } 

        /// <summary> 
        /// LinearGradientBrush Constructor
        /// Constructs a LinearGradientBrush with GradientStops set to the passed-in collection.
        /// Constructs a LinearGradientBrush with GradientStops specified at offset 0.0 and
        /// 1.0. The StartPoint is set to (0,0) and the EndPoint is derived from the angle 
        /// such that 1) the line containing the StartPoint and EndPoint is 'angle' degrees
        /// from the horizontal in the direction of positive Y, and 2) the EndPoint lies on 
        ///  the perimeter of the unit circle. 
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param> 
        /// <param name="angle"> The angle, in degrees, that the gradient will be away from horizontal. </param>
        public LinearGradientBrush(GradientStopCollection gradientStopCollection,
                                   double angle) : base (gradientStopCollection)
        { 
            EndPoint = EndPointFromAngle(angle);
        } 
 
        /// <summary>
        /// LinearGradientBrush Constructor 
        /// Constructs a LinearGradientBrush with GradientStops set to the passed-in collection.
        /// The StartPoint and EndPoint are set to the specified startPoint and endPoint.
        /// </summary>
        /// <param name="gradientStopCollection"> GradientStopCollection to set on this brush. </param> 
        /// <param name="startPoint"> The start point</param>
        /// <param name="endPoint"> The end point</param> 
        public LinearGradientBrush(GradientStopCollection gradientStopCollection, 
                                   Point startPoint,
                                   Point endPoint) : base (gradientStopCollection) 
        {
            StartPoint = startPoint;
            EndPoint = endPoint;
        } 

 
        #endregion Constructors 

        /// <SecurityNote> 
        ///     Critical: This code accesses unsafe code blocks
        ///     TreatAsSafe: This code does is safe to call but needs to be verified for correctness
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
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
                DUCE.ResourceHandle hStartPointAnimations = GetAnimationResourceHandle(StartPointProperty, channel);
                DUCE.ResourceHandle hEndPointAnimations = GetAnimationResourceHandle(EndPointProperty, channel); 

                unsafe 
                { 
                    DUCE.MILCMD_LINEARGRADIENTBRUSH data;
                    data.Type = MILCMD.MilCmdLinearGradientBrush; 
                    data.Handle = _duceResource.GetHandle(channel);
                    double tempOpacity = Opacity;
                    DUCE.CopyBytes((byte*)&data.Opacity, (byte*)&tempOpacity, 8);
                    data.hOpacityAnimations = hOpacityAnimations; 
                    data.hTransform = hTransform;
                    data.hRelativeTransform = hRelativeTransform; 
                    data.ColorInterpolationMode = ColorInterpolationMode; 
                    data.MappingMode = MappingMode;
                    data.SpreadMethod = SpreadMethod; 

                    Point tempStartPoint = StartPoint;
                    DUCE.CopyBytes((byte*)&data.StartPoint, (byte*)&tempStartPoint, 16);
                    data.hStartPointAnimations = hStartPointAnimations; 
                    Point tempEndPoint = EndPoint;
                    DUCE.CopyBytes((byte*)&data.EndPoint, (byte*)&tempEndPoint, 16); 
                    data.hEndPointAnimations = hEndPointAnimations; 

                    // NTRAID#Longhorn-1011154-2004/8/12-asecchia GradientStopCollection:  Need to enforce upper-limit of gradient stop capacity 

                    int count = (vGradientStops == null) ? 0 : vGradientStops.Count;
                    data.GradientStopsSize = (UInt32)(sizeof(DUCE.MIL_GRADIENTSTOP)*count);
 
                    channel.BeginCommand(
                        (byte*)&data, 
                        sizeof(DUCE.MILCMD_LINEARGRADIENTBRUSH), 
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

        private Point EndPointFromAngle(double angle) 
        {
            // Convert the angle from degrees to radians 
            angle = angle * (1.0/180.0) * System.Math.PI; 

            return (new Point(System.Math.Cos(angle), System.Math.Sin(angle))); 

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
        public new LinearGradientBrush Clone()
        {
            return (LinearGradientBrush)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new LinearGradientBrush CloneCurrentValue()
        {
            return (LinearGradientBrush)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void StartPointPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            LinearGradientBrush target = ((LinearGradientBrush) d);


            target.PropertyChanged(StartPointProperty); 
        }
        private static void EndPointPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            LinearGradientBrush target = ((LinearGradientBrush) d);
 

            target.PropertyChanged(EndPointProperty);
        }
 

        #region Public Properties 
 
        /// <summary>
        ///     StartPoint - Point.  Default value is new Point(0,0). 
        /// </summary>
        public Point StartPoint
        {
            get 
            {
                return (Point) GetValue(StartPointProperty); 
            } 
            set
            { 
                SetValueInternal(StartPointProperty, value);
            }
        }
 
        /// <summary>
        ///     EndPoint - Point.  Default value is new Point(1,1). 
        /// </summary> 
        public Point EndPoint
        { 
            get
            {
                return (Point) GetValue(EndPointProperty);
            } 
            set
            { 
                SetValueInternal(EndPointProperty, value); 
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
            return new LinearGradientBrush(); 
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

                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_LINEARGRADIENTBRUSH))
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
        //    StartPoint
        //    EndPoint 
        // 
        internal override int EffectiveValuesInitialSize
        { 
            get
            {
                return 3;
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
        ///     The DependencyProperty for the LinearGradientBrush.StartPoint property.
        /// </summary>
        public static readonly DependencyProperty StartPointProperty; 
        /// <summary>
        ///     The DependencyProperty for the LinearGradientBrush.EndPoint property. 
        /// </summary> 
        public static readonly DependencyProperty EndPointProperty;
 
        #endregion Dependency Properties

        //-----------------------------------------------------
        // 
        //  Internal Fields
        // 
        //------------------------------------------------------ 

        #region Internal Fields 



        internal System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource(); 

        internal static Point s_StartPoint = new Point(0,0); 
        internal static Point s_EndPoint = new Point(1,1); 

        #endregion Internal Fields 



        #region Constructors 

        //------------------------------------------------------ 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------

        static LinearGradientBrush()
        { 
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime 
            // of your app.  (Windows OS Bug #947272)
            // 


            // Initializations
            Type typeofThis = typeof(LinearGradientBrush); 
            StartPointProperty =
                  RegisterProperty("StartPoint", 
                                   typeof(Point), 
                                   typeofThis,
                                   new Point(0,0), 
                                   new PropertyChangedCallback(StartPointPropertyChanged),
                                   null,
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null); 
            EndPointProperty =
                  RegisterProperty("EndPoint", 
                                   typeof(Point), 
                                   typeofThis,
                                   new Point(1,1), 
                                   new PropertyChangedCallback(EndPointPropertyChanged),
                                   null,
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null); 
        }
 
 

        #endregion Constructors 
    }
} 

