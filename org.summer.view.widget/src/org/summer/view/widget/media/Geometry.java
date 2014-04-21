package org.summer.view.widget.media;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.Point;
import org.summer.view.widget.Rect;
import org.summer.view.widget.media.animation.Animatable;

/// <summary> 
    /// This is the base class for all Geometry classes.  A geometry has bounds, 
    /// can be used to clip, fill or stroke.
    /// </summary> 
//    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)]
    public abstract /*partial*/ class Geometry extends Animatable implements DUCE.IResource
    {
//        #region Constructors 

        /*internal*/ public Geometry() 
        { 
        }
 
//        #endregion

//        #region Public properties
        /// <summary> 
        ///     Singleton empty model.
        /// </summary> 
        public static Geometry Empty 
        {
            get 
            {
                return s_empty;
            }
        } 

        /// <summary> 
        /// Gets the bounds of this Geometry as an axis-aligned bounding box 
        /// </summary>
        public /*virtual*/ Rect Bounds 
        {
            get
            {
                return PathGeometry.GetPathBounds( 
                    GetPathGeometryData(),
                    null,   // pen 
                    Matrix.Identity, 
                    StandardFlatteningTolerance,
                    ToleranceType.Absolute, 
                    false); // Do not skip non-fillable figures
            }
        }
 
        /// <summary>
        /// Standard error tolerance (0.25) used for polygonal approximation of curved segments 
        /// </summary> 
        public static double StandardFlatteningTolerance
        { 
            get
            {
                return c_tolerance;
            } 
        }
 
//        #endregion Public properties 

//        #region GetRenderBounds 
        /// <summary>
        /// Returns the axis-aligned bounding rectangle when stroked with a pen.
        /// </summary>
        /// <param name="pen">The pen</param> 
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
        public /*virtual*/ Rect GetRenderBounds(Pen pen, double tolerance, ToleranceType type) 
        {
            ReadPreamble(); 

            Matrix matrix = Matrix.Identity;
            return GetBoundsInternal(pen, matrix, tolerance, type);
        } 

        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen. 
        /// </summary>
        /// <param name="pen">The pen</param> 
        public Rect GetRenderBounds(Pen pen)
        {
            ReadPreamble();
 
            Matrix matrix = Matrix.Identity;
            return GetBoundsInternal(pen, matrix, StandardFlatteningTolerance, ToleranceType.Absolute); 
        } 

//        #endregion GetRenderBounds 


//        #region Internal Methods
 
        /// <summary>
        ///     Used to optimize Visual.ChangeVisualClip. This is not meant 
        ///     to be used generically since not all geometries implement 
        ///     the method (currently only RectangleGeometry is implemented).
        /// </summary> 
        /*internal*/ public /*virtual*/ boolean AreClose(Geometry geometry)
        {
           return false;
        } 

        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying 
        /// the supplied transform (if non-null).
        /// </summary> 
        /*internal*/ public /*virtual*/ Rect GetBoundsInternal(Pen pen, Matrix matrix, double tolerance, ToleranceType type)
        {
            if (IsObviouslyEmpty())
            { 
                return Rect.Empty;
            } 
 
            PathGeometryData pathData = GetPathGeometryData();
 
            return PathGeometry.GetPathBounds(
                pathData,
                pen,
                matrix, 
                tolerance,
                type, 
                true); /* skip hollows */ 
        }
 
        /// <summary>
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying
        /// the supplied transform (if non-null).
        /// </summary> 
        /*internal*/ public Rect GetBoundsInternal(Pen pen, Matrix matrix)
        { 
            return GetBoundsInternal(pen, matrix, StandardFlatteningTolerance, ToleranceType.Absolute); 
        }
 

        /// <SecurityNote>
        /// Critical - it does an elevation in calling MilUtility_PolygonBounds and is unsafe
        /// </SecurityNote> 
//        [SecurityCritical]
        /*internal*/ public /*unsafe*/ static Rect GetBoundsHelper( 
            Pen pen, 
            Matrix *pWorldMatrix,
            Point* pPoints, 
            byte *pTypes,
            uint pointCount,
            uint segmentCount,
            Matrix *pGeometryMatrix, 
            double tolerance,
            ToleranceType type, 
            boolean fSkipHollows) 
        {
            MIL_PEN_DATA penData; 
            double[] dashArray = null;

            // If the pen contributes to the bounds, populate the CMD struct
            boolean fPenContributesToBounds = Pen.ContributesToBounds(pen); 

            if (fPenContributesToBounds) 
            { 
                pen.GetBasicPenData(&penData, out dashArray);
            } 

            MilMatrix3x2D geometryMatrix;
            if (pGeometryMatrix != null)
            { 
                geometryMatrix = CompositionResourceManager.MatrixToMilMatrix3x2D(ref (*pGeometryMatrix));
            } 
 
            Debug.Assert(pWorldMatrix != null);
            MilMatrix3x2D worldMatrix = 
                CompositionResourceManager.MatrixToMilMatrix3x2D(ref (*pWorldMatrix));

            Rect bounds;
 
            fixed (double *pDashArray = dashArray)
            { 
                int hr = MilCoreApi.MilUtility_PolygonBounds( 
                    &worldMatrix,
                    (fPenContributesToBounds) ? &penData : null, 
                    (dashArray == null) ? null : pDashArray,
                    pPoints,
                    pTypes,
                    pointCount, 
                    segmentCount,
                    (pGeometryMatrix == null) ? null : &geometryMatrix, 
                    tolerance, 
                    type == ToleranceType.Relative,
                    fSkipHollows, 
                    &bounds
                );

                if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
                {
                    // When we encounter NaNs in the renderer, we absorb the error and draw 
                    // nothing. To be consistent, we report that the geometry has empty bounds. 
                    bounds = Rect.Empty;
                } 
                else
                {
                    HRESULT.Check(hr);
                } 
            }
 
            return bounds; 
        }
 
        /*internal*/ public /*virtual*/ void TransformPropertyChangedHook(DependencyPropertyChangedEventArgs e)
        {
            // Do nothing here -- Overriden by PathGeometry to clear cached bounds.
        } 

        /*internal*/ public Geometry GetTransformedCopy(Transform transform) 
        { 
            Geometry copy = Clone();
            Transform internalTransform = Transform; 

            if (transform != null && !transform.IsIdentity)
            {
                if (internalTransform == null || internalTransform.IsIdentity) 
                {
                    copy.Transform = transform; 
                } 
                else
                { 
                    copy.Transform = new MatrixTransform(internalTransform.Value * transform.Value);
                }
            }
 
            return copy;
        } 
 
//        #endregion Internal Methods
 
        /// <summary>
        /// ShouldSerializeTransform - this is called by the serializer to determine whether or not to
        /// serialize the Transform property.
        /// </summary> 
//        [EditorBrowsable(EditorBrowsableState.Never)]
        public boolean ShouldSerializeTransform() 
        { 
            Transform transform = Transform;
            return transform != null && !(transform.IsIdentity); 
        }

//        #region Public Methods
 
        /// <summary>
        /// Gets the area of this geometry 
        /// <param name="tolerance">The computational error tolerance</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// </summary> 
        ///<SecurityNote>
        /// Critical as this calls a method that elevates (MilUtility_GeometryGetArea)
        /// TreatAsSafe - net effect of this is to calculate the area of a geometry, so it's considered safe.
        ///</SecurityNote> 
//        [SecurityCritical]
        public /*virtual*/ double GetArea(double tolerance, ToleranceType type) 
        { 
            ReadPreamble();
 
            if (IsObviouslyEmpty())
            {
                return 0;
            } 

            PathGeometryData pathData = GetPathGeometryData(); 
 
            if (pathData.IsEmpty())
            { 
                return 0;
            }

            double area; 

            unsafe 
            { 
                // Call the core method on the path data
                fixed (byte* pbPathData = pathData.SerializedData) 
                {
                    Debug.Assert(pbPathData != (byte*)0);

                    int hr = MilCoreApi.MilUtility_GeometryGetArea( 
                        pathData.FillRule,
                        pbPathData, 
                        pathData.Size, 
                        &pathData.Matrix,
                        tolerance, 
                        type == ToleranceType.Relative,
                        &area);

                    if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
                    {
                        // When we encounter NaNs in the renderer, we absorb the error and draw 
                        // nothing. To be consistent, we report that the geometry has 0 area. 
                        area = 0.0;
                    } 
                    else
                    {
                        HRESULT.Check(hr);
                    } 
                }
            } 
 
            return area;
        } 

        /// <summary>
        /// Gets the area of this geometry
        /// </summary> 
        public double GetArea()
        { 
            return GetArea(StandardFlatteningTolerance, ToleranceType.Absolute); 
        }
 
        /// <summary>
        /// Returns true if this geometry is empty
        /// </summary>
        public abstract boolean IsEmpty(); 

        /// <summary> 
        /// Returns true if this geometry may have curved segments 
        /// </summary>
        public abstract boolean MayHaveCurves(); 

//        #endregion Public Methods

//        #region Hit Testing 
        /// <summary>
        /// Returns true if point is inside the fill region defined by this geometry. 
        /// </summary> 
        /// <param name="hitPoint">The point tested for containment</param>
        /// <param name="tolerance">Acceptable margin of error in distance computation</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        public boolean FillContains(Point hitPoint, double tolerance, ToleranceType type)
        {
            return ContainsInternal(null, hitPoint, tolerance, type); 
        }
 
        /// <summary> 
        /// Returns true if point is inside the fill region defined by this geometry.
        /// </summary> 
        /// <param name="hitPoint">The point tested for containment</param>
        public boolean FillContains(Point hitPoint)
        {
            return ContainsInternal(null, hitPoint, StandardFlatteningTolerance, ToleranceType.Absolute); 
        }
 
        /// <summary> 
        /// Returns true if point is inside the stroke of a pen on this geometry.
        /// </summary> 
        /// <param name="pen">The pen used to define the stroke</param>
        /// <param name="hitPoint">The point tested for containment</param>
        /// <param name="tolerance">Acceptable margin of error in distance computation</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
        public boolean StrokeContains(Pen pen, Point hitPoint, double tolerance, ToleranceType type)
        { 
            if (pen == null) 
            {
                return false; 
            }

            return ContainsInternal(pen, hitPoint, tolerance, type);
        } 

        /// <summary> 
        /// Returns true if point is inside the stroke of a pen on this geometry. 
        /// </summary>
        /// <param name="pen">The pen used to define the stroke</param> 
        /// <param name="hitPoint">The point tested for containment</param>
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// <SecurityNote> 
        /// Critical - as this does an elevation in calling MilUtility_PathGeometryHitTest.
        /// TreatAsSafe - as this doesn't expose anything sensitive. 
        /// </SecurityNote> 
//        [SecurityCritical, SecurityTreatAsSafe]
        /*internal*/ public /*virtual*/ boolean ContainsInternal(Pen pen, Point hitPoint, double tolerance, ToleranceType type) 
        {
            if (IsObviouslyEmpty())
            {
                return false; 
            }
 
            PathGeometryData pathData = GetPathGeometryData(); 

            if (pathData.IsEmpty()) 
            {
                return false;
            }
 
            boolean contains = false;
 
            unsafe 
            {
                MIL_PEN_DATA penData; 
                double[] dashArray = null;

                // If we have a pen, populate the CMD struct
                if (pen != null) 
                {
                    pen.GetBasicPenData(&penData, out dashArray); 
                } 

                fixed (byte* pbPathData = pathData.SerializedData) 
                {
                    Debug.Assert(pbPathData != (byte*)0);

                    fixed (double * dashArrayFixed = dashArray) 
                    {
                        int hr = MilCoreApi.MilUtility_PathGeometryHitTest( 
                                &pathData.Matrix, 
                                (pen == null) ? null : &penData,
                                dashArrayFixed, 
                                pathData.FillRule,
                                pbPathData,
                                pathData.Size,
                                tolerance, 
                                type == ToleranceType.Relative,
                                &hitPoint, 
                                out contains); 

                        if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
                        {
                            // When we encounter NaNs in the renderer, we absorb the error and draw
                            // nothing. To be consistent, we report that the geometry is never hittable.
                            contains = false; 
                        }
                        else 
                        { 
                            HRESULT.Check(hr);
                        } 
                    }
                }
            }
 
            return contains;
        } 
 
        /// <summary>
        /// Helper method to be used by derived implementations of ContainsInternal. 
        /// </summary>
        /// <SecurityNote>
        /// Critical - Accepts pointers, does an elevation in calling MilUtility_PolygonHitTest.
        /// </SecurityNote> 
//        [SecurityCritical]
        /*internal*/ public unsafe boolean ContainsInternal(Pen pen, Point hitPoint, double tolerance, ToleranceType type, 
                                                Point *pPoints, uint pointCount, byte *pTypes, uint typeCount) 
        {
            boolean contains = false; 

            MilMatrix3x2D matrix = CompositionResourceManager.TransformToMilMatrix3x2D(Transform);

            MIL_PEN_DATA penData; 
            double[] dashArray = null;
 
            if (pen != null) 
            {
                pen.GetBasicPenData(&penData, out dashArray); 
            }

            fixed (double *dashArrayFixed = dashArray)
            { 
                int hr = MilCoreApi.MilUtility_PolygonHitTest(
                        &matrix, 
                        (pen == null) ? null : &penData, 
                        dashArrayFixed,
                        pPoints, 
                        pTypes,
                        pointCount,
                        typeCount,
                        tolerance, 
                        type == ToleranceType.Relative,
                        &hitPoint, 
                        out contains); 

                if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
                {
                    // When we encounter NaNs in the renderer, we absorb the error and draw
                    // nothing. To be consistent, we report that the geometry is never hittable.
                    contains = false; 
                }
                else 
                { 
                    HRESULT.Check(hr);
                } 
            }

            return contains;
        } 

        /// <summary> 
        /// Returns true if point is inside the stroke of a pen on this geometry. 
        /// </summary>
        /// <param name="pen">The pen used to define the stroke</param> 
        /// <param name="hitPoint">The point tested for containment</param>
        public boolean StrokeContains(Pen pen, Point hitPoint)
        {
            return StrokeContains(pen, hitPoint, StandardFlatteningTolerance, ToleranceType.Absolute); 
        }
 
        /// <summary> 
        /// Returns true if a given geometry is contained inside this geometry.
        /// </summary> 
        /// <param name="geometry">The geometry tested for containment</param>
        /// <param name="tolerance">Acceptable margin of error in distance computation</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        public boolean FillContains(Geometry geometry, double tolerance, ToleranceType type) 
        {
            IntersectionDetail detail = FillContainsWithDetail(geometry, tolerance, type); 
 
            return (detail == IntersectionDetail.FullyContains);
        } 

        /// <summary>
        /// Returns true if a given geometry is contained inside this geometry.
        /// </summary> 
        /// <param name="geometry">The geometry tested for containment</param>
        public boolean FillContains(Geometry geometry) 
        { 
            return FillContains(geometry, StandardFlatteningTolerance, ToleranceType.Absolute);
        } 

        /// <summary>
        /// Returns true if a given geometry is inside this geometry.
        /// <param name="geometry">The geometry to test for containment in this Geometry</param> 
        /// <param name="tolerance">Acceptable margin of error in distance computation</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
        /// </summary> 
        public /*virtual*/ IntersectionDetail FillContainsWithDetail(Geometry geometry, double tolerance, ToleranceType type)
        { 
            ReadPreamble();

            if (IsObviouslyEmpty() || geometry == null || geometry.IsObviouslyEmpty())
            { 
                return IntersectionDetail.Empty;
            } 
 
            return PathGeometry.HitTestWithPathGeometry(this, geometry, tolerance, type);
        } 


        /// <summary>
        /// Returns if geometry is inside this geometry. 
        /// <param name="geometry">The geometry to test for containment in this Geometry</param>
        /// </summary> 
        public IntersectionDetail FillContainsWithDetail(Geometry geometry) 
        {
            return FillContainsWithDetail(geometry, StandardFlatteningTolerance, ToleranceType.Absolute); 
        }

        /// <summary>
        /// Returns if a given geometry is inside the stroke defined by a given pen on this geometry. 
        /// <param name="pen">The pen</param>
        /// <param name="geometry">The geometry to test for containment in this Geometry</param> 
        /// <param name="tolerance">Acceptable margin of error in distance computation</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// </summary> 
        public IntersectionDetail StrokeContainsWithDetail(Pen pen, Geometry geometry, double tolerance, ToleranceType type)
        {
            if (IsObviouslyEmpty() || geometry == null || geometry.IsObviouslyEmpty() || pen == null)
            { 
                return IntersectionDetail.Empty;
            } 
 
            PathGeometry pathGeometry1 = GetWidenedPathGeometry(pen);
 
            return PathGeometry.HitTestWithPathGeometry(pathGeometry1, geometry, tolerance, type);
        }

        /// <summary> 
        /// Returns if a given geometry is inside the stroke defined by a given pen on this geometry.
        /// <param name="pen">The pen</param> 
        /// <param name="geometry">The geometry to test for containment in this Geometry</param> 
        /// </summary>
        public IntersectionDetail StrokeContainsWithDetail(Pen pen, Geometry geometry) 
        {
            return StrokeContainsWithDetail(pen, geometry, StandardFlatteningTolerance, ToleranceType.Absolute);
        }
 
//        #endregion
 
//        #region Geometric Flatten 

        /// <summary> 
        /// Approximate this geometry with a polygonal PathGeometry
        /// </summary>
        /// <param name="tolerance">The approximation error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
        /// <returns>Returns the polygonal approximation as a PathGeometry.</returns>
        ///<SecurityNote> 
        ///     Critical - calls code that performs an elevation. 
        ///     PublicOK - net effect of this code is to create an "flattened" shape from the current one.
        ///                          to "flatten" means to approximate with polygons. 
        ///                             ( in effect creating a different flavor of this shape from this one).
        ///                          Considered safe.
        ///</SecurityNote>
//        [SecurityCritical] 
        public /*virtual*/ PathGeometry GetFlattenedPathGeometry(double tolerance, ToleranceType type)
        { 
            ReadPreamble(); 

            if (IsObviouslyEmpty()) 
            {
                return new PathGeometry();
            }
 
            PathGeometryData pathData = GetPathGeometryData();
 
            if (pathData.IsEmpty()) 
            {
                return new PathGeometry(); 
            }

            PathGeometry resultGeometry = null;
 
            unsafe
            { 
                fixed (byte *pbPathData = pathData.SerializedData) 
                {
                    Debug.Assert(pbPathData != (byte*)0); 

                    FillRule fillRule = FillRule.Nonzero;

                    PathGeometry.FigureList list = new PathGeometry.FigureList(); 

                    int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryFlatten( 
                        &pathData.Matrix, 
                        pathData.FillRule,
                        pbPathData, 
                        pathData.Size,
                        tolerance,
                        type == ToleranceType.Relative,
                        new PathGeometry.AddFigureToListDelegate(list.AddFigureToList), 
                        out fillRule);
 
                    if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
                    {
                        // When we encounter NaNs in the renderer, we absorb the error and draw 
                        // nothing. To be consistent, we return an empty geometry.
                        resultGeometry = new PathGeometry();
                    }
                    else 
                    {
                        HRESULT.Check(hr); 
 
                        resultGeometry = new PathGeometry(list.Figures, fillRule, null);
                    } 
                }

                return resultGeometry;
            } 
        }
 
        /// <summary> 
        /// Approximate this geometry with a polygonal PathGeometry
        /// </summary> 
        /// <returns>Returns the polygonal approximation as a PathGeometry.</returns>
        public PathGeometry GetFlattenedPathGeometry()
        {
            // Use the default tolerance interpreted as absolute 
            return GetFlattenedPathGeometry(StandardFlatteningTolerance, ToleranceType.Absolute);
        } 
 
//        #endregion Flatten
 
//        #region Geometric Widen

        /// <summary>
        /// Create the contour of the stroke defined by given pen when it draws this path 
        /// </summary>
        /// <param name="pen">The pen used for stroking this path</param> 
        /// <param name="tolerance">The computational error tolerance</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// <returns>Returns the contour as a PathGeometry.</returns> 
        ///<SecurityNote>
        /// Critical as this calls a method that elevates ( SUC on PathGeometryWiden).
        /// PublicOK - net effect of this is to create a new PathGeometry "widened" with a new pen.
        ///                      To "widen" a path is what we do internally when we draw a path with a pen: we generate the contour of the stroke and then fill it. 
        ///                         The exposed method returns that contour as a PathGeometry.
        ///                         In effect we're creating a different flavor of the current shape from this one. 
        /// 
        ///                      Considered safe.
        ///</SecurityNote> 
//        [SecurityCritical]
        public /*virtual*/ PathGeometry GetWidenedPathGeometry(Pen pen, double tolerance, ToleranceType type)
        {
            ReadPreamble(); 

            if (pen == null) 
            { 
                throw new System.ArgumentNullException("pen");
            } 

            if (IsObviouslyEmpty())
            {
                return new PathGeometry(); 
            }
 
            PathGeometryData pathData = GetPathGeometryData(); 

            if (pathData.IsEmpty()) 
            {
                return new PathGeometry();
            }
 
            PathGeometry resultGeometry = null;
 
            unsafe 
            {
                MIL_PEN_DATA penData; 
                double[] dashArray = null;

                pen.GetBasicPenData(&penData, out dashArray);
 
                fixed (byte *pbPathData = pathData.SerializedData)
                { 
                    Debug.Assert(pbPathData != (byte*)0); 

                    FillRule fillRule = FillRule.Nonzero; 

                    PathGeometry.FigureList list = new PathGeometry.FigureList();

                    // The handle to the pDashArray, if we have one. 
                    // Since the dash array is optional, we may not need to Free it.
                    GCHandle handle = new GCHandle(); 
 
                    // Pin the pDashArray, if we have one.
                    if (dashArray != null) 
                    {
                        handle = GCHandle.Alloc(dashArray, GCHandleType.Pinned);
                    }
 
                    try
                    { 
                        int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryWiden( 
                            &penData,
                            (dashArray == null) ? null : (double*)handle.AddrOfPinnedObject(), 
                            &pathData.Matrix,
                            pathData.FillRule,
                            pbPathData,
                            pathData.Size, 
                            tolerance,
                            type == ToleranceType.Relative, 
                            new PathGeometry.AddFigureToListDelegate(list.AddFigureToList), 
                            out fillRule);
 
                        if (hr == (int)MILErrors.WGXERR_BADNUMBER)
                        {
                            // When we encounter NaNs in the renderer, we absorb the error and draw
                            // nothing. To be consistent, we return an empty geometry. 
                            resultGeometry = new PathGeometry();
                        } 
                        else 
                        {
                            HRESULT.Check(hr); 

                            resultGeometry = new PathGeometry(list.Figures, fillRule, null);
                        }
                    } 
                    finally
                    { 
                        if (handle.IsAllocated) 
                        {
                            handle.Free(); 
                        }
                    }

                } 

                return resultGeometry; 
            } 
        }
 
        /// <summary>
        /// Create the contour of the stroke defined by given pen when it draws this path
        /// </summary>
        /// <param name="pen">The pen used for stroking this path</param> 
        /// <returns>Returns the contour as a PathGeometry.</returns>
        public PathGeometry GetWidenedPathGeometry(Pen pen) 
        { 
            // Use the default tolerance interpreted as absolute
            return GetWidenedPathGeometry(pen, StandardFlatteningTolerance, ToleranceType.Absolute); 
        }

//        #endregion Widen
 
//        #region Combine
 
        /// <summary> 
        /// Returns the result of a Boolean combination of two Geometry objects.
        /// </summary> 
        /// <param name="geometry1">The first Geometry object</param>
        /// <param name="geometry2">The second Geometry object</param>
        /// <param name="mode">The mode in which the objects will be combined</param>
        /// <param name="transform">A transformation to apply to the result, or null</param> 
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
        public static PathGeometry Combine( 
            Geometry geometry1,
            Geometry geometry2, 
            GeometryCombineMode mode,
            Transform transform,
            double tolerance,
            ToleranceType type) 
        {
            return PathGeometry.InternalCombine(geometry1, geometry2, mode, transform, tolerance, type); 
        } 

        /// <summary> 
        /// Returns the result of a Boolean combination of two Geometry objects.
        /// </summary>
        /// <param name="geometry1">The first Geometry object</param>
        /// <param name="geometry2">The second Geometry object</param> 
        /// <param name="mode">The mode in which the objects will be combined</param>
        /// <param name="transform">A transformation to apply to the result, or null</param> 
        public static PathGeometry Combine( 
            Geometry geometry1,
            Geometry geometry2, 
            GeometryCombineMode mode,
            Transform transform)
        {
            return PathGeometry.InternalCombine( 
                geometry1,
                geometry2, 
                mode, 
                transform,
                Geometry.StandardFlatteningTolerance, 
                ToleranceType.Absolute);
        }

//        #endregion Combine 

//        #region Outline 
 
        /// <summary>
        /// Get a simplified contour of the filled region of this PathGeometry 
        /// </summary>
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// <returns>Returns an equivalent geometry, properly oriented with no self-intersections.</returns> 
        /// <SecurityNote>
        /// Critical - as this calls GetGlyphs() which is critical. 
        /// Safe - as this doesn't expose font information but just gives out a Geometry. 
        /// </SecurityNote>
//        [SecurityCritical] 
        public /*virtual*/ PathGeometry GetOutlinedPathGeometry(double tolerance, ToleranceType type)
        {
            ReadPreamble();
 
            if (IsObviouslyEmpty())
            { 
                return new PathGeometry(); 
            }
 
            PathGeometryData pathData = GetPathGeometryData();

            if (pathData.IsEmpty())
            { 
                return new PathGeometry();
            } 
 
            PathGeometry resultGeometry = null;
 
            unsafe
            {
                fixed (byte* pbPathData = pathData.SerializedData)
                { 
                    Invariant.Assert(pbPathData != (byte*)0);
 
                    FillRule fillRule = FillRule.Nonzero; 
                    PathGeometry.FigureList list = new PathGeometry.FigureList();
 
                    int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryOutline(
                        &pathData.Matrix,
                        pathData.FillRule,
                        pbPathData, 
                        pathData.Size,
                        tolerance, 
                        type == ToleranceType.Relative, 
                        new PathGeometry.AddFigureToListDelegate(list.AddFigureToList),
                        out fillRule); 

                    if (hr == (int)MILErrors.WGXERR_BADNUMBER)
                    {
                        // When we encounter NaNs in the renderer, we absorb the error and draw 
                        // nothing. To be consistent, we return an empty geometry.
                        resultGeometry = new PathGeometry(); 
                    } 
                    else
                    { 
                        HRESULT.Check(hr);

                        resultGeometry = new PathGeometry(list.Figures, fillRule, null);
                    } 
                }
            } 
 
            return resultGeometry;
        } 

        /// <summary>
        /// Get a simplified contour of the filled region of this PathGeometry
        /// </summary> 
        /// <returns>Returns an equivalent geometry, properly oriented with no self-intersections.</returns>
        public PathGeometry GetOutlinedPathGeometry() 
        { 
            return GetOutlinedPathGeometry(StandardFlatteningTolerance, ToleranceType.Absolute);
        } 

//        #endregion Outline

//        #region Internal 

        /*internal*/ public abstract PathGeometry GetAsPathGeometry(); 
 
        /// <summary>
        /// GetPathGeometryData - returns a struct which contains this Geometry represented 
        /// as a path geometry's serialized format.
        /// </summary>
        /*internal*/ public abstract PathGeometryData GetPathGeometryData();
 
        /*internal*/ public PathFigureCollection GetPathFigureCollection()
        { 
            return GetTransformedFigureCollection(null); 
        }
 
        // Get the combination of the /*internal*/ public transform with a given transform.
        // Return true if the result is nontrivial.
        /*internal*/ public Matrix GetCombinedMatrix(Transform transform)
        { 
            Matrix matrix = Matrix.Identity;
            Transform internalTransform = Transform; 
 
            if (internalTransform != null && !internalTransform.IsIdentity)
            { 
                matrix = internalTransform.Value;

                if (transform != null && !transform.IsIdentity)
                { 
                    matrix *= transform.Value;
                } 
            } 
            else if (transform != null && !transform.IsIdentity)
            { 
                matrix = transform.Value;
            }

            return matrix; 
        }
 
        /*internal*/ public abstract PathFigureCollection GetTransformedFigureCollection(Transform transform); 

        // This method is used for eliminating unnecessary work when the geometry is obviously empty. 
        // For most Geometry types the definite IsEmpty() query is just as cheap.  The exceptions will
        // be CombinedGeometry and GeometryGroup.
        /*internal*/ public /*virtual*/ boolean IsObviouslyEmpty() { return IsEmpty(); }
 
        /// <summary>
        /// Can serialize "this" to a string 
        /// </summary> 
        /*internal*/ public /*virtual*/ boolean CanSerializeToString()
        { 
            return false;
        }

        /*internal*/ public class PathGeometryData 
        {
            ///<SecurityNote> 
            /// Critical as this has an unsafe block. 
            /// TreatAsSafe - net effect is simply to read data.
            ///</SecurityNote> 
//            [SecurityCritical, SecurityTreatAsSafe]
            /*internal*/ public boolean IsEmpty()
            {
                if ((SerializedData == null) || (SerializedData.Length <= 0)) 
                {
                    return true; 
                } 

                unsafe 
                {
                    fixed (byte *pbPathData = SerializedData)
                    {
                        MIL_PATHGEOMETRY* pPathGeometry = (MIL_PATHGEOMETRY*)pbPathData; 

                        return pPathGeometry->FigureCount <= 0; 
                    } 
                }
            } 

            /*internal*/ public FillRule FillRule;
            /*internal*/ public MilMatrix3x2D Matrix;
            /*internal*/ public byte[] SerializedData; 

            /// <SecurityNote> 
            ///     Critical: Manipulates unsafe code 
            ///     TreatAsSafe - net effect is simply to read data.
            /// </SecurityNote> 
            /*internal*/ public uint Size
            {
                [SecurityCritical, SecurityTreatAsSafe]
                get 
                {
                    if ((SerializedData == null) || (SerializedData.Length <= 0)) 
                    { 
                        return 0;
                    } 

                    unsafe
                    {
                        fixed (byte *pbPathData = SerializedData) 
                        {
                            MIL_PATHGEOMETRY* pPathGeometryData = (MIL_PATHGEOMETRY*)pbPathData; 
                            uint size = pPathGeometryData == null ? 0 : pPathGeometryData->Size; 

                            Invariant.Assert(size <= (uint)SerializedData.Length); 

                            return size;
                        }
                    } 
                }
            } 
        } 

        /*internal*/ public static PathGeometryData GetEmptyPathGeometryData() 
        {
            return s_emptyPathGeometryData;
        }
 
//        #endregion Internal
 
//        #region Private 

        ///<SecurityNote> 
        /// Critical as this has an unsafe block.
        /// TreatAsSafe - This allocates a buffer locally and writes to it.
        ///</SecurityNote>
//        [SecurityCritical, SecurityTreatAsSafe] 
        private static PathGeometryData MakeEmptyPathGeometryData()
        { 
            PathGeometryData data = new PathGeometryData(); 
            data.FillRule = FillRule.EvenOdd;
            data.Matrix = CompositionResourceManager.MatrixToMilMatrix3x2D(Matrix.Identity); 

            unsafe
            {
                int size = sizeof(MIL_PATHGEOMETRY); 

                data.SerializedData = new byte[size]; 
 
                fixed (byte *pbData = data.SerializedData)
                { 
                    MIL_PATHGEOMETRY *pPathGeometry = (MIL_PATHGEOMETRY*)pbData;

                    // implicitly set pPathGeometry->Flags = 0;
                    pPathGeometry->FigureCount = 0; 
                    pPathGeometry->Size = (UInt32)size;
                } 
            } 

            return data; 
        }

        private static Geometry MakeEmptyGeometry()
        { 
            Geometry empty = new StreamGeometry();
            empty.Freeze(); 
            return empty; 
        }
 
        private /*const*/static final double c_tolerance = 0.25;

        private static Geometry s_empty = MakeEmptyGeometry();
        private static PathGeometryData s_emptyPathGeometryData = MakeEmptyPathGeometryData(); 
//        #endregion Private
    } 