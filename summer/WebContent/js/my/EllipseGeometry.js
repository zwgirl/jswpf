/**
 * EllipseGeometry
 */

define(["dojo/_base/declare", "system/Type", "media/Geometry"], 
		function(declare, Type, Geometry){
	var EllipseGeometry = declare("EllipseGeometry", Geometry,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(EllipseGeometry.prototype,{
		  
	});
	
	Object.defineProperties(EllipseGeometry,{
		  
	});
	
	EllipseGeometry.Type = new Type("EllipseGeometry", EllipseGeometry, [Geometry.Type]);
	return EllipseGeometry;
});



//---------------------------------------------------------------------------- 
//
// <copyright file="EllipseGeometry.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// This file was generated, please do not edit it directly. 
// 
// Please see http://wiki/default.aspx/Microsoft.Projects.Avalon/MilCodeGen.html for more information.
// 
//---------------------------------------------------------------------------

using MS.Internal;
using MS.Internal.KnownBoxes; 
using MS.Internal.Collections;
using MS.Internal.PresentationCore; 
using MS.Utility; 
using System;
using System.Collections; 
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Globalization; 
using System.Reflection;
using System.Runtime.InteropServices; 
using System.ComponentModel.Design.Serialization; 
using System.Text;
using System.Windows; 
using System.Windows.Media;
using System.Windows.Media.Effects;
using System.Windows.Media.Media3D;
using System.Windows.Media.Animation; 
using System.Windows.Media.Composition;
using System.Windows.Media.Imaging; 
using System.Windows.Markup; 
using System.Windows.Media.Converters;
using System.Security; 
using System.Security.Permissions;
using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID;
// These types are aliased to match the unamanaged names used in interop 
using BOOL = System.UInt32;
using WORD = System.UInt16; 
using Float = System.Single; 

namespace System.Windows.Media 
{


 
    sealed partial class EllipseGeometry : Geometry
    { 
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
        public new EllipseGeometry Clone()
        {
            return (EllipseGeometry)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new EllipseGeometry CloneCurrentValue()
        {
            return (EllipseGeometry)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void RadiusXPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            EllipseGeometry target = ((EllipseGeometry) d);


            target.PropertyChanged(RadiusXProperty); 
        }
        private static void RadiusYPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            EllipseGeometry target = ((EllipseGeometry) d);
 

            target.PropertyChanged(RadiusYProperty);
        }
        private static void CenterPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            EllipseGeometry target = ((EllipseGeometry) d); 
 

            target.PropertyChanged(CenterProperty); 
        }


        #region Public Properties 

        /// <summary> 
        ///     RadiusX - double.  Default value is 0.0. 
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
        ///     RadiusY - double.  Default value is 0.0. 
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
        ///     Center - Point.  Default value is new Point().
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
            return new EllipseGeometry(); 
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
            // If we're told we can skip the channel check, then we must be on channel 
            Debug.Assert(!skipOnChannelCheck || _duceResource.IsOnChannel(channel));

            if (skipOnChannelCheck || _duceResource.IsOnChannel(channel))
            { 
                base.UpdateResource(channel, skipOnChannelCheck);
 
                // Read values of properties into local variables 
                Transform vTransform = Transform;
 
                // Obtain handles for properties that implement DUCE.IResource
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
 
                // Obtain handles for animated properties
                DUCE.ResourceHandle hRadiusXAnimations = GetAnimationResourceHandle(RadiusXProperty, channel); 
                DUCE.ResourceHandle hRadiusYAnimations = GetAnimationResourceHandle(RadiusYProperty, channel); 
                DUCE.ResourceHandle hCenterAnimations = GetAnimationResourceHandle(CenterProperty, channel);
 
                // Pack & send command packet
                DUCE.MILCMD_ELLIPSEGEOMETRY data;
                unsafe
                { 
                    data.Type = MILCMD.MilCmdEllipseGeometry;
                    data.Handle = _duceResource.GetHandle(channel); 
                    data.hTransform = hTransform; 
                    if (hRadiusXAnimations.IsNull)
                    { 
                        data.RadiusX = RadiusX;
                    }
                    data.hRadiusXAnimations = hRadiusXAnimations;
                    if (hRadiusYAnimations.IsNull) 
                    {
                        data.RadiusY = RadiusY; 
                    } 
                    data.hRadiusYAnimations = hRadiusYAnimations;
                    if (hCenterAnimations.IsNull) 
                    {
                        data.Center = Center;
                    }
                    data.hCenterAnimations = hCenterAnimations; 

                    // Send packed command structure 
                    channel.SendCommand( 
                        (byte*)&data,
                        sizeof(DUCE.MILCMD_ELLIPSEGEOMETRY)); 
                }
            }
        }
        internal override DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel) 
        {
 
                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_ELLIPSEGEOMETRY)) 
                {
                    Transform vTransform = Transform; 
                    if (vTransform != null) ((DUCE.IResource)vTransform).AddRefOnChannel(channel);

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
        //    RadiusX
        //    RadiusY 
        //    Center 
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
        ///     The DependencyProperty for the EllipseGeometry.RadiusX property.
        /// </summary> 
        public static readonly DependencyProperty RadiusXProperty;
        /// <summary> 
        ///     The DependencyProperty for the EllipseGeometry.RadiusY property. 
        /// </summary>
        public static readonly DependencyProperty RadiusYProperty; 
        /// <summary>
        ///     The DependencyProperty for the EllipseGeometry.Center property.
        /// </summary>
        public static readonly DependencyProperty CenterProperty; 

        #endregion Dependency Properties 
 
        //-----------------------------------------------------
        // 
        //  Internal Fields
        //
        //------------------------------------------------------
 
        #region Internal Fields
 
 

        internal System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource(); 

        internal const double c_RadiusX = 0.0;
        internal const double c_RadiusY = 0.0;
        internal static Point s_Center = new Point(); 

        #endregion Internal Fields 
 

 
        #region Constructors

        //------------------------------------------------------
        // 
        //  Constructors
        // 
        //----------------------------------------------------- 

        static EllipseGeometry() 
        {
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw
            // if these get touched by more than one thread in the lifetime 
            // of your app.  (Windows OS Bug #947272)
            // 
 

            // Initializations 
            Type typeofThis = typeof(EllipseGeometry);
            RadiusXProperty =
                  RegisterProperty("RadiusX",
                                   typeof(double), 
                                   typeofThis,
                                   0.0, 
                                   new PropertyChangedCallback(RadiusXPropertyChanged), 
                                   null,
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null);
            RadiusYProperty =
                  RegisterProperty("RadiusY",
                                   typeof(double), 
                                   typeofThis,
                                   0.0, 
                                   new PropertyChangedCallback(RadiusYPropertyChanged), 
                                   null,
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null);
            CenterProperty =
                  RegisterProperty("Center",
                                   typeof(Point), 
                                   typeofThis,
                                   new Point(), 
                                   new PropertyChangedCallback(CenterPropertyChanged), 
                                   null,
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null);
        }

 

        #endregion Constructors 
        #region Constructors 

        /// <summary> 
        ///
        /// </summary>
        public EllipseGeometry()
        { 
        }
 
        /// <summary> 
        /// Constructor - sets the ellipse to the paramters with the given transformation
        /// </summary> 
        public EllipseGeometry(Rect rect)
        {
            if (rect.IsEmpty)
            { 
                throw new System.ArgumentException(SR.Get(SRID.Rect_Empty, "rect"));
            } 
 
            RadiusX = (rect.Right - rect.X) * (1.0 / 2.0);
            RadiusY = (rect.Bottom - rect.Y) * (1.0 / 2.0); 
            Center = new Point(rect.X + RadiusX, rect.Y + RadiusY);
        }

        /// <summary> 
        /// Constructor - sets the ellipse to the parameters
        /// </summary> 
        public EllipseGeometry( 
            Point center,
            double radiusX, 
            double radiusY)
        {
            Center = center;
            RadiusX = radiusX; 
            RadiusY = radiusY;
        } 
 
        /// <summary>
        /// Constructor - sets the ellipse to the parameters 
        /// </summary>
        public EllipseGeometry(
            Point center,
            double radiusX, 
            double radiusY,
            Transform transform) : this(center, radiusX, radiusY) 
        { 
            Transform = transform;
        } 

        #endregion

        /// <summary> 
        /// Gets the bounds of this Geometry as an axis-aligned bounding box
        /// </summary> 
        public override Rect Bounds 
        {
            get 
            {
                ReadPreamble();

                Rect boundsRect; 

                Transform transform = Transform; 
 
                if (transform == null || transform.IsIdentity)
                { 
                    Point currentCenter = Center;
                    Double currentRadiusX = RadiusX;
                    Double currentRadiusY = RadiusY;
 
                    boundsRect = new Rect(
                        currentCenter.X - Math.Abs(currentRadiusX), 
                        currentCenter.Y - Math.Abs(currentRadiusY), 
                        2.0 * Math.Abs(currentRadiusX),
                        2.0 * Math.Abs(currentRadiusY)); 
                }
                else
                {
                    // 
                    //
 
 

 

                    Matrix geometryMatrix;

                    Transform.GetTransformValue(transform, out geometryMatrix); 

                    boundsRect = EllipseGeometry.GetBoundsHelper( 
                        null /* no pen */, 
                        Matrix.Identity,
                        Center, 
                        RadiusX,
                        RadiusY,
                        geometryMatrix,
                        StandardFlatteningTolerance, 
                        ToleranceType.Absolute);
                } 
 
                return boundsRect;
            } 

        }

        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying
        /// the supplied transform (if non-null). 
        /// </summary> 
        internal override Rect GetBoundsInternal(Pen pen, Matrix matrix, double tolerance, ToleranceType type)
        { 
            Matrix geometryMatrix;

            Transform.GetTransformValue(Transform, out geometryMatrix);
 
            return EllipseGeometry.GetBoundsHelper(
                pen, 
                matrix, 
                Center,
                RadiusX, 
                RadiusY,
                geometryMatrix,
                tolerance,
                type); 
        }
 
        /// <SecurityNote> 
        /// Critical - it calls a critical method, Geometry.GetBoundsHelper and has an unsafe block
        /// TreatAsSafe - returning an EllipseGeometry's bounds is considered safe 
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe]
        internal static Rect GetBoundsHelper(Pen pen, Matrix worldMatrix, Point center, double radiusX, double radiusY,
                                             Matrix geometryMatrix, double tolerance, ToleranceType type) 
        {
            Rect rect; 
 
            Debug.Assert(worldMatrix != null);
            Debug.Assert(geometryMatrix != null); 

            if ( (pen == null || pen.DoesNotContainGaps) &&
                worldMatrix.IsIdentity && geometryMatrix.IsIdentity)
            { 
                double strokeThickness = 0.0;
 
                if (Pen.ContributesToBounds(pen)) 
                {
                    strokeThickness = Math.Abs(pen.Thickness); 
                }

                rect = new Rect(
                    center.X - Math.Abs(radiusX)-0.5*strokeThickness, 
                    center.Y - Math.Abs(radiusY)-0.5*strokeThickness,
                    2.0 * Math.Abs(radiusX)+strokeThickness, 
                    2.0 * Math.Abs(radiusY)+strokeThickness); 
            }
            else 
            {
                unsafe
                {
                    Point * pPoints = stackalloc Point[(int)c_pointCount]; 
                    EllipseGeometry.GetPointList(pPoints, c_pointCount, center, radiusX, radiusY);
 
                    fixed (byte *pTypes = EllipseGeometry.s_roundedPathTypes) 
                    {
                        rect = Geometry.GetBoundsHelper( 
                            pen,
                            &worldMatrix,
                            pPoints,
                            pTypes, 
                            c_pointCount,
                            c_segmentCount, 
                            &geometryMatrix, 
                            tolerance,
                            type, 
                            false); // skip hollows - meaningless here, this is never a hollow
                    }
                }
            } 

            return rect; 
        } 

        /// <SecurityNote> 
        /// Critical - contains unsafe block and calls critical method Geometry.ContainsInternal.
        /// TreatAsSafe - as this doesn't expose anything sensitive.
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
        internal override bool ContainsInternal(Pen pen, Point hitPoint, double tolerance, ToleranceType type)
        { 
            unsafe 
            {
                Point *pPoints = stackalloc Point[(int)GetPointCount()]; 
                EllipseGeometry.GetPointList(pPoints, GetPointCount(), Center, RadiusX, RadiusY);

                fixed (byte* pTypes = GetTypeList())
                { 
                    return ContainsInternal(
                        pen, 
                        hitPoint, 
                        tolerance,
                        type, 
                        pPoints,
                        GetPointCount(),
                        pTypes,
                        GetSegmentCount()); 
                }
            } 
        } 

        #region Public Methods 

        /// <summary>
        /// Returns true if this geometry is empty
        /// </summary> 
        public override bool IsEmpty()
        { 
            return false; 
        }
 
        /// <summary>
        /// Returns true if this geometry may have curved segments
        /// </summary>
        public override bool MayHaveCurves() 
        {
            return true; 
        } 

        /// <summary> 
        /// Gets the area of this geometry
        /// </summary>
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - realtive or absolute</param> 
        public override double GetArea(double tolerance, ToleranceType type)
        { 
            ReadPreamble(); 

            double area = Math.Abs(RadiusX * RadiusY) * Math.PI; 

            // Adjust to internal transformation
            Transform transform = Transform;
            if (transform != null && !transform.IsIdentity) 
            {
                area *= Math.Abs(transform.Value.Determinant); 
            } 

            return area; 
        }

        #endregion Public Methods
 
        internal override PathFigureCollection GetTransformedFigureCollection(Transform transform)
        { 
            Point [] points = GetPointList(); 

            // Get the combined transform argument with the internal transform 
            Matrix matrix = GetCombinedMatrix(transform);
            if (!matrix.IsIdentity)
            {
                for (int i=0; i<points.Length; i++) 
                {
                    points[i] *= matrix; 
                } 
            }
 
            PathFigureCollection figureCollection = new PathFigureCollection();
            figureCollection.Add(
                new PathFigure(
                    points[0], 
                    new PathSegment[]{
                    new BezierSegment(points[1], points[2], points[3], true, true), 
                    new BezierSegment(points[4], points[5], points[6], true, true), 
                    new BezierSegment(points[7], points[8], points[9], true, true),
                    new BezierSegment(points[10], points[11], points[12], true, true)}, 
                    true
                    )
                );
 
            return figureCollection;
        } 
 
        /// <summary>
        /// GetAsPathGeometry - return a PathGeometry version of this Geometry 
        /// </summary>
        internal override PathGeometry GetAsPathGeometry()
        {
            PathStreamGeometryContext ctx = new PathStreamGeometryContext(FillRule.EvenOdd, Transform); 
            PathGeometry.ParsePathGeometryData(GetPathGeometryData(), ctx);
 
            return ctx.GetPathGeometry(); 
        }
 
        /// <summary>
        /// GetPathGeometryData - returns a byte[] which contains this Geometry represented
        /// as a path geometry's serialized format.
        /// </summary> 
        internal override PathGeometryData GetPathGeometryData()
        { 
            if (IsObviouslyEmpty()) 
            {
                return Geometry.GetEmptyPathGeometryData(); 
            }

            PathGeometryData data = new PathGeometryData();
            data.FillRule = FillRule.EvenOdd; 
            data.Matrix = CompositionResourceManager.TransformToMilMatrix3x2D(Transform);
 
            Point[] points = GetPointList(); 

            ByteStreamGeometryContext ctx = new ByteStreamGeometryContext(); 

            ctx.BeginFigure(points[0], true /* is filled */, true /* is closed */);

            // i == 0, 3, 6, 9 
            for (int i = 0; i < 12; i += 3)
            { 
                ctx.BezierTo(points[i + 1], points[i + 2], points[i + 3], true /* is stroked */, true /* is smooth join */); 
            }
 
            ctx.Close();
            data.SerializedData = ctx.GetData();

            return data; 
        }
 
        /// <summary> 
        /// </summary>
        /// <returns></returns> 
        /// <SecurityNote>
        /// Critical - Calls critical code
        /// TreatAsSafe - returning a EllipseGeometry's point list is considered safe
        /// </SecurityNote> 
        [SecurityCritical, SecurityTreatAsSafe]
        private Point[] GetPointList() 
        { 
            Point[] points = new Point[GetPointCount()];
 
            unsafe
            {
                fixed(Point *pPoints = points)
                { 
                    EllipseGeometry.GetPointList(pPoints, GetPointCount(), Center, RadiusX, RadiusY);
                } 
            } 

            return points; 
        }

        /// <SecurityNote>
        /// Critical - Accepts pointer arguments 
        /// </SecurityNote>
        [SecurityCritical] 
        private unsafe static void GetPointList(Point * points, uint pointsCount, Point center, double radiusX, double radiusY) 
        {
            Invariant.Assert(pointsCount >= c_pointCount); 

            radiusX = Math.Abs(radiusX);
            radiusY = Math.Abs(radiusY);
 
            // Set the X coordinates
            double mid = radiusX * c_arcAsBezier; 
 
            points[0].X = points[1].X = points[11].X = points[12].X = center.X + radiusX;
            points[2].X = points[10].X = center.X + mid; 
            points[3].X = points[9].X = center.X;
            points[4].X = points[8].X = center.X - mid;
            points[5].X = points[6].X = points[7].X = center.X - radiusX;
 
            // Set the Y coordinates
            mid = radiusY * c_arcAsBezier; 
 
            points[2].Y = points[3].Y = points[4].Y = center.Y + radiusY;
            points[1].Y = points[5].Y = center.Y + mid; 
            points[0].Y = points[6].Y = points[12].Y = center.Y;
            points[7].Y = points[11].Y = center.Y - mid;
            points[8].Y = points[9].Y = points[10].Y = center.Y - radiusY;
        } 

        private byte[] GetTypeList() { return s_roundedPathTypes; } 
        private uint GetPointCount() { return c_pointCount; } 
        private uint GetSegmentCount() { return c_segmentCount; }
 
        #region Static Data

        // Approximating a 1/4 circle with a Bezier curve                _
        internal const double c_arcAsBezier = 0.5522847498307933984; // =( \/2 - 1)*4/3 

        private const UInt32 c_segmentCount = 4; 
        private const UInt32 c_pointCount = 13; 

        private const byte c_smoothBezier = (byte)MILCoreSegFlags.SegTypeBezier  | 
                                              (byte)MILCoreSegFlags.SegIsCurved    |
                                              (byte)MILCoreSegFlags.SegSmoothJoin;

        private static readonly byte[] s_roundedPathTypes = { 
            (byte)MILCoreSegFlags.SegTypeBezier |
            (byte)MILCoreSegFlags.SegIsCurved   | 
            (byte)MILCoreSegFlags.SegSmoothJoin | 
            (byte)MILCoreSegFlags.SegClosed,
            c_smoothBezier, 
            c_smoothBezier,
            c_smoothBezier
        };
 
        #endregion
    }
} 
