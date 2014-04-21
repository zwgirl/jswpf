/**
 * LineGeometry
 */

define(["dojo/_base/declare", "system/Type", "media/Geometry"], 
		function(declare, Type, Geometry){
	var LineGeometry = declare("LineGeometry", Geometry,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(LineGeometry.prototype,{
		  
	});
	
	Object.defineProperties(LineGeometry,{
		  
	});
	
	LineGeometry.Type = new Type("LineGeometry", LineGeometry, [Geometry.Type]);
	return LineGeometry;
});



//---------------------------------------------------------------------------- 
//
// <copyright file="LineGeometry.cs" company="Microsoft">
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


 
    sealed partial class LineGeometry : Geometry
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
        public new LineGeometry Clone()
        {
            return (LineGeometry)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new LineGeometry CloneCurrentValue()
        {
            return (LineGeometry)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void StartPointPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            LineGeometry target = ((LineGeometry) d);


            target.PropertyChanged(StartPointProperty); 
        }
        private static void EndPointPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            LineGeometry target = ((LineGeometry) d);
 

            target.PropertyChanged(EndPointProperty);
        }
 

        #region Public Properties 
 
        /// <summary>
        ///     StartPoint - Point.  Default value is new Point(). 
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
        ///     EndPoint - Point.  Default value is new Point(). 
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
            return new LineGeometry(); 
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
                DUCE.ResourceHandle hStartPointAnimations = GetAnimationResourceHandle(StartPointProperty, channel);
                DUCE.ResourceHandle hEndPointAnimations = GetAnimationResourceHandle(EndPointProperty, channel);
 
                // Pack & send command packet
                DUCE.MILCMD_LINEGEOMETRY data; 
                unsafe 
                {
                    data.Type = MILCMD.MilCmdLineGeometry; 
                    data.Handle = _duceResource.GetHandle(channel);
                    data.hTransform = hTransform;
                    if (hStartPointAnimations.IsNull)
                    { 
                        data.StartPoint = StartPoint;
                    } 
                    data.hStartPointAnimations = hStartPointAnimations; 
                    if (hEndPointAnimations.IsNull)
                    { 
                        data.EndPoint = EndPoint;
                    }
                    data.hEndPointAnimations = hEndPointAnimations;
 
                    // Send packed command structure
                    channel.SendCommand( 
                        (byte*)&data, 
                        sizeof(DUCE.MILCMD_LINEGEOMETRY));
                } 
            }
        }
        internal override DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel)
        { 

                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_LINEGEOMETRY)) 
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
 

 


        #endregion Internal Properties
 
        //-----------------------------------------------------
        // 
        //  Dependency Properties 
        //
        //------------------------------------------------------ 

        #region Dependency Properties

        /// <summary> 
        ///     The DependencyProperty for the LineGeometry.StartPoint property.
        /// </summary> 
        public static readonly DependencyProperty StartPointProperty; 
        /// <summary>
        ///     The DependencyProperty for the LineGeometry.EndPoint property. 
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

        internal static Point s_StartPoint = new Point(); 
        internal static Point s_EndPoint = new Point();

        #endregion Internal Fields
 

 
        #region Constructors 

        //------------------------------------------------------ 
        //
        //  Constructors
        //
        //----------------------------------------------------- 

        static LineGeometry() 
        { 
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime
            // of your app.  (Windows OS Bug #947272)
            //
 

            // Initializations 
            Type typeofThis = typeof(LineGeometry); 
            StartPointProperty =
                  RegisterProperty("StartPoint", 
                                   typeof(Point),
                                   typeofThis,
                                   new Point(),
                                   new PropertyChangedCallback(StartPointPropertyChanged), 
                                   null,
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null); 
            EndPointProperty =
                  RegisterProperty("EndPoint", 
                                   typeof(Point),
                                   typeofThis,
                                   new Point(),
                                   new PropertyChangedCallback(EndPointPropertyChanged), 
                                   null,
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null); 
        }
 


        #endregion Constructors
 
    }
    
    #region Constructors 

    /// <summary> 
    ///
    /// </summary>
    public LineGeometry()
    { 
    }

    /// <summary> 
    ///
    /// </summary> 
    public LineGeometry(Point startPoint, Point endPoint)
    {
        StartPoint = startPoint;
        EndPoint = endPoint; 
    }

    /// <summary> 
    ///
    /// </summary> 
    public LineGeometry(
        Point startPoint,
        Point endPoint,
        Transform transform) : this(startPoint, endPoint) 
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

            Rect rect = new Rect(StartPoint, EndPoint);

            Transform transform = Transform; 

            if (transform != null && !transform.IsIdentity) 
            { 
                transform.TransformRect(ref rect);
            } 

            return rect;
        }
    } 

    /// <summary> 
    /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying 
    /// the supplied transform (if non-null).
    /// </summary> 
    internal override Rect GetBoundsInternal(Pen pen, Matrix worldMatrix, double tolerance, ToleranceType type)
    {
        Matrix geometryMatrix;

        Transform.GetTransformValue(Transform, out geometryMatrix);

        return LineGeometry.GetBoundsHelper( 
               pen,
               worldMatrix, 
               StartPoint,
               EndPoint,
               geometryMatrix,
               tolerance, 
               type);
    } 

    /// <SecurityNote>
    /// Critical - it calls a critical method, Geometry.GetBoundsHelper and has an unsafe block 
    /// TreatAsSafe - returning a LineGeometry's bounds is considered safe
    /// </SecurityNote>
    [SecurityCritical, SecurityTreatAsSafe]
    internal static Rect GetBoundsHelper(Pen pen, Matrix worldMatrix, Point pt1, Point pt2, 
                                         Matrix geometryMatrix, double tolerance, ToleranceType type)
    { 
        Debug.Assert(worldMatrix != null); 
        Debug.Assert(geometryMatrix != null);

        if (pen == null  &&  worldMatrix.IsIdentity && geometryMatrix.IsIdentity)
        {
            return new Rect(pt1, pt2);
        } 
        else
        { 
            unsafe 
            {
                Point* pPoints = stackalloc Point[2]; 
                pPoints[0] = pt1;
                pPoints[1] = pt2;

                fixed (byte *pTypes = LineGeometry.s_lineTypes) 
                {
                    return Geometry.GetBoundsHelper( 
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
            Point *pPoints = stackalloc Point[2]; 
            pPoints[0] = StartPoint;
            pPoints[1] = EndPoint; 

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
        return false; 
    }

    /// <summary>
    /// Gets the area of this geometry 
    /// </summary>
    /// <param name="tolerance">The computational error tolerance</param> 
    /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
    public override double GetArea(double tolerance, ToleranceType type)
    { 
        return 0.0;
    }

    private byte[] GetTypeList() { return s_lineTypes; } 

    private static byte[] s_lineTypes = new byte[] { (byte)MILCoreSegFlags.SegTypeLine }; 

    private uint GetPointCount() { return c_pointCount; }

    private uint GetSegmentCount() { return c_segmentCount; }

    /// <summary>
    /// GetAsPathGeometry - return a PathGeometry version of this Geometry 
    /// </summary>
    internal override PathGeometry GetAsPathGeometry() 
    { 
        PathStreamGeometryContext ctx = new PathStreamGeometryContext(FillRule.EvenOdd, Transform);
        PathGeometry.ParsePathGeometryData(GetPathGeometryData(), ctx); 

        return ctx.GetPathGeometry();
    }

    internal override PathFigureCollection GetTransformedFigureCollection(Transform transform)
    { 
        // This is lossy for consistency with other GetPathFigureCollection() implementations 
        // however this limitation doesn't otherwise need to exist for LineGeometry.

        Point startPoint = StartPoint;
        Point endPoint = EndPoint;

        // Apply internal transform 
        Transform internalTransform = Transform;

        if (internalTransform != null && !internalTransform.IsIdentity) 
        {
            Matrix matrix = internalTransform.Value; 

            startPoint *= matrix;
            endPoint *= matrix;
        } 

        // Apply external transform 
        if (transform != null && !transform.IsIdentity) 
        {
            Matrix matrix = transform.Value; 

            startPoint *= matrix;
            endPoint *= matrix;
        } 

        PathFigureCollection collection = new PathFigureCollection(); 
        collection.Add( 
            new PathFigure(
            startPoint, 
            new PathSegment[]{new LineSegment(endPoint, true)},
            false // ==> not closed
            )
        ); 

        return collection; 
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

        ByteStreamGeometryContext ctx = new ByteStreamGeometryContext(); 

        ctx.BeginFigure(StartPoint, true /* is filled */, false /* is closed */);
        ctx.LineTo(EndPoint, true /* is stroked */, false /* is smooth join */); 

        ctx.Close();
        data.SerializedData = ctx.GetData();

        return data;
    } 

    #region Static Data

    private const UInt32 c_segmentCount = 1;
    private const UInt32 c_pointCount = 2;

    #endregion 
} 

