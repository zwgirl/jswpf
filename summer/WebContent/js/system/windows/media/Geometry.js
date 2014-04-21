/**
 * Geometry
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable", "media/Transform"], 
		function(declare, Type, Animatable, Transform){
	
//	internal struct 
	var PathGeometryData = declare(Object, 
	{
		///<SecurityNote> 
		/// Critical as this has an unsafe block. 
		/// TreatAsSafe - net effect is simply to read data.
		///</SecurityNote> 
//		internal bool 
		IsEmpty:function()
		{
			if ((this.SerializedData == null) || (this.SerializedData.length <= 0)) 
			{
				return true; 
			} 

//			unsafe 
//			{
//				fixed (byte *pbPathData = SerializedData)
//				{
//					MIL_PATHGEOMETRY* pPathGeometry = (MIL_PATHGEOMETRY*)pbPathData; 
//
//					return pPathGeometry->FigureCount <= 0; 
//				} 
//			}
		}, 

//		internal FillRule FillRule;
//		internal MilMatrix3x2D Matrix;
//		internal byte[] SerializedData; 
	});
	
	Object.defineProperties(PathGeometryData.prototype, {
		/// <SecurityNote> 
		///     Critical: Manipulates unsafe code 
		///     TreatAsSafe - net effect is simply to read data.
		/// </SecurityNote> 
//		internal uint 
		Size:
		{
			get:function() 
			{
				if ((SerializedData == null) || (SerializedData.Length <= 0)) 
				{ 
					return 0;
				} 

//				unsafe
//				{
//					fixed (byte *pbPathData = SerializedData) 
// 					{
//						MIL_PATHGEOMETRY* pPathGeometryData = (MIL_PATHGEOMETRY*)pbPathData; 
//						uint size = pPathGeometryData == null ? 0 : pPathGeometryData->Size; 
//
//						Invariant.Assert(size <= (uint)SerializedData.Length); 
//
//						return size;
// 					}
//				} 
			}
		} 
	});
	 
//	private const double 
	var c_tolerance = 0.25;

//	private static Geometry 
//	var s_empty = MakeEmptyGeometry();
//	private static PathGeometryData 
//	var s_emptyPathGeometryData = MakeEmptyPathGeometryData();  
	var Geometry = declare("Geometry", Animatable,{
		constructor:function(){
		},
		
		 /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed
        ///     version for convenience. 
        /// </summary>
//        public new Geometry 
		Clone:function()
        {
            return base.Clone(); 
        },
 
        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed
        ///     version for convenience. 
        /// </summary>
//        public new Geometry 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue(); 
        },
        
        
        /// <summary> 
        /// Creates a string representation of this object based on the current culture.
        /// </summary> 
        /// <returns>
        /// A string representation of this object.
        /// </returns>
//        public override string 
        ToString:function() 
        {
            this.ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls. 
            return ConvertToString(null /* format string */, null /* format provider */);
        },

        /// <summary>
        /// Creates a string representation of this object based on the IFormatProvider
        /// passed in.  If the provider is null, the CurrentCulture is used. 
        /// </summary>
        /// <returns> 
        /// A string representation of this object. 
        /// </returns>
//        public string ToString(IFormatProvider provider) 
//        {
//            ReadPreamble();
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(null /* format string */, provider); 
//        }
 
        /// <summary> 
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information.
        /// </summary>
        /// <returns> 
        /// A string representation of this object.
        /// </returns> 
//        string IFormattable.ToString(string format, IFormatProvider provider) 
//        {
//            ReadPreamble(); 
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(format, provider);
//        }
 
        /// <summary>
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns>
        /// A string representation of this object.
        /// </returns> 
//        internal virtual string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
        { 
            return base.ToString(); 
        },
        
        /// <summary>
        /// Returns the axis-aligned bounding rectangle when stroked with a pen.
        /// </summary>
        /// <param name="pen">The pen</param> 
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
//        public virtual Rect 
        GetRenderBounds:function(/*Pen*/ pen, /*double*/ tolerance, /*ToleranceType*/ type) 
        {
            this.ReadPreamble(); 

            /*Matrix*/var matrix = Matrix.Identity;
            return GetBoundsInternal(pen, matrix, tolerance, type);
        }, 

        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen. 
        /// </summary>
        /// <param name="pen">The pen</param> 
//        public Rect 
        GetRenderBounds:function(/*Pen*/ pen)
        {
            this.ReadPreamble();
 
            var matrix = Matrix.Identity;
            return GetBoundsInternal(pen, matrix, StandardFlatteningTolerance, ToleranceType.Absolute); 
        }, 
 
        /// <summary>
        ///     Used to optimize Visual.ChangeVisualClip. This is not meant 
        ///     to be used generically since not all geometries implement 
        ///     the method (currently only RectangleGeometry is implemented).
        /// </summary> 
//        internal virtual bool 
        AreClose:function(/*Geometry*/ geometry)
        {
           return false;
        }, 

        /// <summary> 
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying 
        /// the supplied transform (if non-null).
        /// </summary> 
//        internal virtual Rect 
        GetBoundsInternal:function(/*Pen*/ pen, /*Matrix*/ matrix, /*double*/ tolerance, /*ToleranceType*/ type)
        {
            if (this.IsObviouslyEmpty())
            { 
                return Rect.Empty;
            } 
 
            var pathData = GetPathGeometryData();
 
            return PathGeometry.GetPathBounds(
                pathData,
                pen,
                matrix, 
                tolerance,
                type, 
                true); /* skip hollows */ 
        },
 
        /// <summary>
        /// Returns the axis-aligned bounding rectangle when stroked with a pen, after applying
        /// the supplied transform (if non-null).
        /// </summary> 
//        internal Rect 
        GetBoundsInternal:function(/*Pen*/ pen, /*Matrix*/ matrix)
        { 
            return GetBoundsInternal(pen, matrix, StandardFlatteningTolerance, ToleranceType.Absolute); 
        },
//        internal virtual void 
        TransformPropertyChangedHook:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
            // Do nothing here -- Overriden by PathGeometry to clear cached bounds.
        }, 

//        internal Geometry 
        GetTransformedCopy:function(/*Transform*/ transform) 
        { 
        	var copy = this.Clone();
        	var internalTransform = this.Transform; 

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
        }, 
 
        /// <summary>
        /// Gets the area of this geometry 
        /// <param name="tolerance">The computational error tolerance</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// </summary> 
        ///<SecurityNote>
        /// Critical as this calls a method that elevates (MilUtility_GeometryGetArea)
        /// TreatAsSafe - net effect of this is to calculate the area of a geometry, so it's considered safe.
        ///</SecurityNote> 
//        public virtual double 
        GetArea:function(/*double*/ tolerance, /*ToleranceType*/ type) 
        { 
            this.ReadPreamble();
 
            if (this.IsObviouslyEmpty())
            {
                return 0;
            } 

            var pathData = GetPathGeometryData(); 
 
            if (pathData.IsEmpty())
            { 
                return 0;
            }

            var area; 

//            unsafe 
//            { 
//                // Call the core method on the path data
//                fixed (byte* pbPathData = pathData.SerializedData) 
//                {
//                    Debug.Assert(pbPathData != (byte*)0);
//
//                    int hr = MilCoreApi.MilUtility_GeometryGetArea( 
//                        pathData.FillRule,
//                        pbPathData, 
//                        pathData.Size, 
//                        &pathData.Matrix,
//                        tolerance, 
//                        type == ToleranceType.Relative,
//                        &area);
//
//                    if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//                    {
//                        // When we encounter NaNs in the renderer, we absorb the error and draw 
//                        // nothing. To be consistent, we report that the geometry has 0 area. 
//                        area = 0.0;
//                    } 
//                    else
//                    {
//                        HRESULT.Check(hr);
//                    } 
//                }
//            } 
 
            return area;
        }, 

        /// <summary>
        /// Gets the area of this geometry
        /// </summary> 
//        public double 
        GetArea:function()
        { 
            return GetArea(StandardFlatteningTolerance, ToleranceType.Absolute); 
        },
 
        /// <summary>
        /// Returns true if this geometry is empty
        /// </summary>
//        public abstract bool 
        IsEmpty:function(){}, 

        /// <summary> 
        /// Returns true if this geometry may have curved segments 
        /// </summary>
//        public abstract bool 
        MayHaveCurves:function(){}, 
        /// <summary>
        /// Returns true if point is inside the fill region defined by this geometry. 
        /// </summary> 
        /// <param name="hitPoint">The point tested for containment</param>
        /// <param name="tolerance">Acceptable margin of error in distance computation</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
//        public bool 
        FillContains:function(/*Point*/ hitPoint, /*double*/ tolerance, /*ToleranceType*/ type)
        {
            return ContainsInternal(null, hitPoint, tolerance, type); 
        },
 
        /// <summary> 
        /// Returns true if point is inside the fill region defined by this geometry.
        /// </summary> 
        /// <param name="hitPoint">The point tested for containment</param>
//        public bool 
        FillContains:function(/*Point*/ hitPoint)
        {
            return ContainsInternal(null, hitPoint, StandardFlatteningTolerance, ToleranceType.Absolute); 
        },
 
        /// <summary> 
        /// Returns true if point is inside the stroke of a pen on this geometry.
        /// </summary> 
        /// <param name="pen">The pen used to define the stroke</param>
        /// <param name="hitPoint">The point tested for containment</param>
        /// <param name="tolerance">Acceptable margin of error in distance computation</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
//        public bool 
        StrokeContains:function(/*Pen*/ pen, /*Point*/ hitPoint, /*double*/ tolerance, /*ToleranceType*/ type)
        { 
            if (pen == null) 
            {
                return false; 
            }

            return ContainsInternal(pen, hitPoint, tolerance, type);
        },

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
//        internal virtual bool 
        ContainsInternal:function(/*Pen*/ pen, /*Point*/ hitPoint, /*double*/ tolerance, /*ToleranceType*/ type) 
        {
            if (this.IsObviouslyEmpty())
            {
                return false; 
            }
 
            /*PathGeometryData*/var pathData = GetPathGeometryData(); 

            if (pathData.IsEmpty()) 
            {
                return false;
            }
 
            var contains = false;
 
//            unsafe 
//            {
//                MIL_PEN_DATA penData; 
//                double[] dashArray = null;
//
//                // If we have a pen, populate the CMD struct
//                if (pen != null) 
//                {
//                    pen.GetBasicPenData(&penData, out dashArray); 
//                } 
//
//                fixed (byte* pbPathData = pathData.SerializedData) 
//                {
//                    Debug.Assert(pbPathData != (byte*)0);
//
//                    fixed (double * dashArrayFixed = dashArray) 
//                    {
//                        int hr = MilCoreApi.MilUtility_PathGeometryHitTest( 
//                                &pathData.Matrix, 
//                                (pen == null) ? null : &penData,
//                                dashArrayFixed, 
//                                pathData.FillRule,
//                                pbPathData,
//                                pathData.Size,
//                                tolerance, 
//                                type == ToleranceType.Relative,
//                                &hitPoint, 
//                                out contains); 
//
//                        if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//                        {
//                            // When we encounter NaNs in the renderer, we absorb the error and draw
//                            // nothing. To be consistent, we report that the geometry is never hittable.
//                            contains = false; 
//                        }
//                        else 
//                        { 
//                            HRESULT.Check(hr);
//                        } 
//                    }
//                }
//            }
 
            return contains;
        }, 
 
        /// <summary>
        /// Helper method to be used by derived implementations of ContainsInternal. 
        /// </summary>
        /// <SecurityNote>
        /// Critical - Accepts pointers, does an elevation in calling MilUtility_PolygonHitTest.
        /// </SecurityNote> 
//        internal unsafe bool 
        ContainsInternal:function(/*Pen*/ pen, /*Point*/ hitPoint, /*double*/ tolerance, /*ToleranceType*/ type, 
                                                /*Point **/pPoints, /*uint*/ pointCount, /*byte **/pTypes, /*uint*/ typeCount) 
        {
//            bool contains = false; 
//
//            MilMatrix3x2D matrix = CompositionResourceManager.TransformToMilMatrix3x2D(Transform);
//
//            MIL_PEN_DATA penData; 
//            double[] dashArray = null;
// 
//            if (pen != null) 
//            {
//                pen.GetBasicPenData(&penData, out dashArray); 
//            }
//
//            fixed (double *dashArrayFixed = dashArray)
//            { 
//                int hr = MilCoreApi.MilUtility_PolygonHitTest(
//                        &matrix, 
//                        (pen == null) ? null : &penData, 
//                        dashArrayFixed,
//                        pPoints, 
//                        pTypes,
//                        pointCount,
//                        typeCount,
//                        tolerance, 
//                        type == ToleranceType.Relative,
//                        &hitPoint, 
//                        out contains); 
//
//                if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//                {
//                    // When we encounter NaNs in the renderer, we absorb the error and draw
//                    // nothing. To be consistent, we report that the geometry is never hittable.
//                    contains = false; 
//                }
//                else 
//                { 
//                    HRESULT.Check(hr);
//                } 
//            }

            return contains;
        },

        /// <summary> 
        /// Returns true if point is inside the stroke of a pen on this geometry. 
        /// </summary>
        /// <param name="pen">The pen used to define the stroke</param> 
        /// <param name="hitPoint">The point tested for containment</param>
//        public bool 
        StrokeContains:function(/*Pen*/ pen, /*Point*/ hitPoint)
        {
            return StrokeContains(pen, hitPoint, StandardFlatteningTolerance, ToleranceType.Absolute); 
        },
 
        /// <summary> 
        /// Returns true if a given geometry is contained inside this geometry.
        /// </summary> 
        /// <param name="geometry">The geometry tested for containment</param>
        /// <param name="tolerance">Acceptable margin of error in distance computation</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
//        public bool 
        FillContains:function(/*Geometry*/ geometry, /*double*/ tolerance, /*ToleranceType*/ type) 
        {
            /*IntersectionDetail*/var detail = FillContainsWithDetail(geometry, tolerance, type); 
 
            return (detail == IntersectionDetail.FullyContains);
        },

        /// <summary>
        /// Returns true if a given geometry is contained inside this geometry.
        /// </summary> 
        /// <param name="geometry">The geometry tested for containment</param>
//        public bool 
        FillContains:function(/*Geometry*/ geometry) 
        { 
            return FillContains(geometry, StandardFlatteningTolerance, ToleranceType.Absolute);
        }, 

        /// <summary>
        /// Returns true if a given geometry is inside this geometry.
        /// <param name="geometry">The geometry to test for containment in this Geometry</param> 
        /// <param name="tolerance">Acceptable margin of error in distance computation</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
        /// </summary> 
//        public virtual IntersectionDetail 
        FillContainsWithDetail:function(/*Geometry*/ geometry, /*double*/ tolerance, /*ToleranceType*/ type)
        { 
        	this.ReadPreamble();

            if (this.IsObviouslyEmpty() || geometry == null || geometry.IsObviouslyEmpty())
            { 
                return IntersectionDetail.Empty;
            } 
 
            return PathGeometry.HitTestWithPathGeometry(this, geometry, tolerance, type);
        }, 


        /// <summary>
        /// Returns if geometry is inside this geometry. 
        /// <param name="geometry">The geometry to test for containment in this Geometry</param>
        /// </summary> 
//        public IntersectionDetail 
        FillContainsWithDetail:function(/*Geometry*/ geometry) 
        {
            return FillContainsWithDetail(geometry, StandardFlatteningTolerance, ToleranceType.Absolute); 
        },

        /// <summary>
        /// Returns if a given geometry is inside the stroke defined by a given pen on this geometry. 
        /// <param name="pen">The pen</param>
        /// <param name="geometry">The geometry to test for containment in this Geometry</param> 
        /// <param name="tolerance">Acceptable margin of error in distance computation</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// </summary> 
//        public IntersectionDetail 
        StrokeContainsWithDetail:function(/*Pen*/ pen, /*Geometry*/ geometry, /*double*/ tolerance, /*ToleranceType*/ type)
        {
            if (this.IsObviouslyEmpty() || geometry == null || geometry.IsObviouslyEmpty() || pen == null)
            { 
                return IntersectionDetail.Empty;
            } 
 
            /*PathGeometry*/var pathGeometry1 = GetWidenedPathGeometry(pen);
 
            return PathGeometry.HitTestWithPathGeometry(pathGeometry1, geometry, tolerance, type);
        },

        /// <summary> 
        /// Returns if a given geometry is inside the stroke defined by a given pen on this geometry.
        /// <param name="pen">The pen</param> 
        /// <param name="geometry">The geometry to test for containment in this Geometry</param> 
        /// </summary>
//        public IntersectionDetail 
        StrokeContainsWithDetail:function(/*Pen*/ pen, /*Geometry*/ geometry) 
        {
            return StrokeContainsWithDetail(pen, geometry, StandardFlatteningTolerance, ToleranceType.Absolute);
        },

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
//        public virtual PathGeometry 
        GetFlattenedPathGeometry:function(/*double*/ tolerance, /*ToleranceType*/ type)
        { 
        	this.ReadPreamble(); 

            if (this.IsObviouslyEmpty()) 
            {
                return new PathGeometry();
            }
 
            var pathData = this.GetPathGeometryData();
 
            if (pathData.IsEmpty()) 
            {
                return new PathGeometry(); 
            }

            /*PathGeometry*/var resultGeometry = null;
 
//            unsafe
//            { 
//                fixed (byte *pbPathData = pathData.SerializedData) 
//                {
//                    Debug.Assert(pbPathData != (byte*)0); 
//
//                    FillRule fillRule = FillRule.Nonzero;
//
//                    PathGeometry.FigureList list = new PathGeometry.FigureList(); 
//
//                    int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryFlatten( 
//                        &pathData.Matrix, 
//                        pathData.FillRule,
//                        pbPathData, 
//                        pathData.Size,
//                        tolerance,
//                        type == ToleranceType.Relative,
//                        new PathGeometry.AddFigureToListDelegate(list.AddFigureToList), 
//                        out fillRule);
// 
//                    if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//                    {
//                        // When we encounter NaNs in the renderer, we absorb the error and draw 
//                        // nothing. To be consistent, we return an empty geometry.
//                        resultGeometry = new PathGeometry();
//                    }
//                    else 
//                    {
//                        HRESULT.Check(hr); 
// 
//                        resultGeometry = new PathGeometry(list.Figures, fillRule, null);
//                    } 
//                }
//
//                return resultGeometry;
//            } 
        },
 
        /// <summary> 
        /// Approximate this geometry with a polygonal PathGeometry
        /// </summary> 
        /// <returns>Returns the polygonal approximation as a PathGeometry.</returns>
//        public PathGeometry 
        GetFlattenedPathGeometry:function()
        {
            // Use the default tolerance interpreted as absolute 
            return GetFlattenedPathGeometry(StandardFlatteningTolerance, ToleranceType.Absolute);
        }, 

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
//        public virtual PathGeometry 
        GetWidenedPathGeometry:function(/*Pen*/ pen, /*double*/ tolerance, /*ToleranceType*/ type)
        {
        	this.ReadPreamble(); 

            if (pen == null) 
            { 
                throw new System.ArgumentNullException("pen");
            } 

            if (this.IsObviouslyEmpty())
            {
                return new PathGeometry(); 
            }
 
            /*PathGeometryData*/var pathData = GetPathGeometryData(); 

            if (pathData.IsEmpty()) 
            {
                return new PathGeometry();
            }
 
            /*PathGeometry*/var resultGeometry = null;
 
//            unsafe 
//            {
//                MIL_PEN_DATA penData; 
//                double[] dashArray = null;
//
//                pen.GetBasicPenData(&penData, out dashArray);
// 
//                fixed (byte *pbPathData = pathData.SerializedData)
//                { 
//                    Debug.Assert(pbPathData != (byte*)0); 
//
//                    FillRule fillRule = FillRule.Nonzero; 
//
//                    PathGeometry.FigureList list = new PathGeometry.FigureList();
//
//                    // The handle to the pDashArray, if we have one. 
//                    // Since the dash array is optional, we may not need to Free it.
//                    GCHandle handle = new GCHandle(); 
// 
//                    // Pin the pDashArray, if we have one.
//                    if (dashArray != null) 
//                    {
//                        handle = GCHandle.Alloc(dashArray, GCHandleType.Pinned);
//                    }
// 
//                    try
//                    { 
//                        int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryWiden( 
//                            &penData,
//                            (dashArray == null) ? null : (double*)handle.AddrOfPinnedObject(), 
//                            &pathData.Matrix,
//                            pathData.FillRule,
//                            pbPathData,
//                            pathData.Size, 
//                            tolerance,
//                            type == ToleranceType.Relative, 
//                            new PathGeometry.AddFigureToListDelegate(list.AddFigureToList), 
//                            out fillRule);
// 
//                        if (hr == (int)MILErrors.WGXERR_BADNUMBER)
//                        {
//                            // When we encounter NaNs in the renderer, we absorb the error and draw
//                            // nothing. To be consistent, we return an empty geometry. 
//                            resultGeometry = new PathGeometry();
//                        } 
//                        else 
//                        {
//                            HRESULT.Check(hr); 
//
//                            resultGeometry = new PathGeometry(list.Figures, fillRule, null);
//                        }
//                    } 
//                    finally
//                    { 
//                        if (handle.IsAllocated) 
//                        {
//                            handle.Free(); 
//                        }
//                    }
//
//                } 
//
//                return resultGeometry; 
//            } 
        },
 
        /// <summary>
        /// Create the contour of the stroke defined by given pen when it draws this path
        /// </summary>
        /// <param name="pen">The pen used for stroking this path</param> 
        /// <returns>Returns the contour as a PathGeometry.</returns>
//        public PathGeometry 
        GetWidenedPathGeometry:function(/*Pen*/ pen) 
        { 
            // Use the default tolerance interpreted as absolute
            return GetWidenedPathGeometry(pen, StandardFlatteningTolerance, ToleranceType.Absolute); 
        },
        
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
//        public virtual PathGeometry 
        GetOutlinedPathGeometry:function(/*double*/ tolerance, /*ToleranceType*/ type)
        {
            this.ReadPreamble();
 
            if (this.IsObviouslyEmpty())
            { 
                return new PathGeometry(); 
            }
 
            /*PathGeometryData*/var pathData = this.GetPathGeometryData();

            if (pathData.IsEmpty())
            { 
                return new PathGeometry();
            } 
 
            /*PathGeometry*/var resultGeometry = null;
 
//            unsafe
//            {
//                fixed (byte* pbPathData = pathData.SerializedData)
//                { 
//                    Invariant.Assert(pbPathData != (byte*)0);
// 
//                    FillRule fillRule = FillRule.Nonzero; 
//                    PathGeometry.FigureList list = new PathGeometry.FigureList();
// 
//                    int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryOutline(
//                        &pathData.Matrix,
//                        pathData.FillRule,
//                        pbPathData, 
//                        pathData.Size,
//                        tolerance, 
//                        type == ToleranceType.Relative, 
//                        new PathGeometry.AddFigureToListDelegate(list.AddFigureToList),
//                        out fillRule); 
//
//                    if (hr == (int)MILErrors.WGXERR_BADNUMBER)
//                    {
//                        // When we encounter NaNs in the renderer, we absorb the error and draw 
//                        // nothing. To be consistent, we return an empty geometry.
//                        resultGeometry = new PathGeometry(); 
//                    } 
//                    else
//                    { 
//                        HRESULT.Check(hr);
//
//                        resultGeometry = new PathGeometry(list.Figures, fillRule, null);
//                    } 
//                }
//            } 
 
            return resultGeometry;
        }, 

        /// <summary>
        /// Get a simplified contour of the filled region of this PathGeometry
        /// </summary> 
        /// <returns>Returns an equivalent geometry, properly oriented with no self-intersections.</returns>
//        public PathGeometry 
        GetOutlinedPathGeometry:function() 
        { 
            return GetOutlinedPathGeometry(StandardFlatteningTolerance, ToleranceType.Absolute);
        }, 

//        internal abstract PathGeometry 
        GetAsPathGeometry:function(){}, 
 
        /// <summary>
        /// GetPathGeometryData - returns a struct which contains this Geometry represented 
        /// as a path geometry's serialized format.
        /// </summary>
//        internal abstract PathGeometryData 
        GetPathGeometryData:function(){},
 
//        internal PathFigureCollection 
        GetPathFigureCollection:function()
        { 
            return GetTransformedFigureCollection(null); 
        },
 
        // Get the combination of the internal transform with a given transform.
        // Return true if the result is nontrivial.
//        internal Matrix 
        GetCombinedMatrix:function(/*Transform*/ transform)
        { 
            var matrix = Matrix.Identity;
            var internalTransform = this.Transform; 
 
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
        },
 
//        internal abstract PathFigureCollection 
        GetTransformedFigureCollection:function(/*Transform*/ transform){}, 

        // This method is used for eliminating unnecessary work when the geometry is obviously empty. 
        // For most Geometry types the definite IsEmpty() query is just as cheap.  The exceptions will
        // be CombinedGeometry and GeometryGroup.
//        internal virtual bool 
        IsObviouslyEmpty:function() { return this.IsEmpty(); },
 
        /// <summary>
        /// Can serialize "this" to a string 
        /// </summary> 
//        internal virtual bool 
        CanSerializeToString:function()
        { 
            return false;
        }
	});
	
	Object.defineProperties(Geometry.prototype,{
		/// <summary> 
        ///     Transform - Transform.  Default value is Transform.Identity.
        /// </summary>
//        public Transform 
		Transform:
        { 
            get:function()
            { 
                return this.GetValue(TransformProperty); 
            },
            set:function(value) 
            {
            	this.SetValueInternal(TransformProperty, value);
            }
        },
        
        /// <summary> 
        /// Gets the bounds of this Geometry as an axis-aligned bounding box 
        /// </summary>
//        public virtual Rect 
        Bounds:
        {
            get:function()
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
 

	});
	
	Object.defineProperties(Geometry,{
		/// <summary> 
        ///     Singleton empty model.
        /// </summary> 
//        public static Geometry 
		Empty: 
        {
            get:function() 
            {
                return s_empty;
            }
        },
        /// <summary>
        /// Standard error tolerance (0.25) used for polygonal approximation of curved segments 
        /// </summary> 
//        public static double 
        StandardFlatteningTolerance:
        { 
            get:function()
            {
                return c_tolerance;
            } 
        }
	});
	
    /// <SecurityNote>
    /// Critical - it does an elevation in calling MilUtility_PolygonBounds and is unsafe
    /// </SecurityNote> 
//    internal unsafe static Rect 
	GetBoundsHelper = function( 
        /*Pen*/ pen, 
        /*Matrix **/pWorldMatrix,
        /*Point**/ pPoints, 
        /*byte **/pTypes,
        /*uint*/ pointCount,
        /*uint*/ segmentCount,
        /*Matrix **/pGeometryMatrix, 
        /*double*/ tolerance,
        /*ToleranceType*/ type, 
        /*bool*/ fSkipHollows) 
    {
        /*MIL_PEN_DATA*/var penData; 
        /*double[]*/var dashArray = null;

        // If the pen contributes to the bounds, populate the CMD struct
        var fPenContributesToBounds = Pen.ContributesToBounds(pen); 

//        if (fPenContributesToBounds) 
//        { 
//            pen.GetBasicPenData(&penData, out dashArray);
//        } 
//
//        /*MilMatrix3x2D*/var geometryMatrix;
//        if (pGeometryMatrix != null)
//        { 
//            geometryMatrix = CompositionResourceManager.MatrixToMilMatrix3x2D(ref (*pGeometryMatrix));
//        } 

//        Debug.Assert(pWorldMatrix != null);
//        /*MilMatrix3x2D*/var worldMatrix = 
//            CompositionResourceManager.MatrixToMilMatrix3x2D(ref (*pWorldMatrix));
//
//        /*Rect*/var bounds;
//
//        fixed (double *pDashArray = dashArray)
//        { 
//            int hr = MilCoreApi.MilUtility_PolygonBounds( 
//                &worldMatrix,
//                (fPenContributesToBounds) ? &penData : null, 
//                (dashArray == null) ? null : pDashArray,
//                pPoints,
//                pTypes,
//                pointCount, 
//                segmentCount,
//                (pGeometryMatrix == null) ? null : &geometryMatrix, 
//                tolerance, 
//                type == ToleranceType.Relative,
//                fSkipHollows, 
//                &bounds
//            );
//
//            if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//            {
//                // When we encounter NaNs in the renderer, we absorb the error and draw 
//                // nothing. To be consistent, we report that the geometry has empty bounds. 
//                bounds = Rect.Empty;
//            } 
//            else
//            {
//                HRESULT.Check(hr);
//            } 
//        }

        return bounds; 
     };
     
	/// <summary> 
    /// Returns the result of a Boolean combination of two Geometry objects.
    /// </summary> 
    /// <param name="geometry1">The first Geometry object</param>
    /// <param name="geometry2">The second Geometry object</param>
    /// <param name="mode">The mode in which the objects will be combined</param>
    /// <param name="transform">A transformation to apply to the result, or null</param> 
    /// <param name="tolerance">The computational error tolerance</param>
    /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param> 
//    public static PathGeometry 
	Geometry.Combine = function( 
        /*Geometry*/ geometry1,
        /*Geometry*/ geometry2, 
        /*GeometryCombineMode*/ mode,
        /*Transform*/ transform,
        /*double*/ tolerance,
        /*ToleranceType*/ type) 
    {
        return PathGeometry.InternalCombine(geometry1, geometry2, mode, transform, tolerance, type); 
    };

    /// <summary> 
    /// Returns the result of a Boolean combination of two Geometry objects.
    /// </summary>
    /// <param name="geometry1">The first Geometry object</param>
    /// <param name="geometry2">The second Geometry object</param> 
    /// <param name="mode">The mode in which the objects will be combined</param>
    /// <param name="transform">A transformation to apply to the result, or null</param> 
//    public static PathGeometry 
    Geometry.Combine = function( 
        /*Geometry*/ geometry1,
        /*Geometry*/ geometry2, 
        /*GeometryCombineMode*/ mode,
        /*Transform*/ transform)
    {
        return PathGeometry.InternalCombine( 
            geometry1,
            geometry2, 
            mode, 
            transform,
            Geometry.StandardFlatteningTolerance, 
            ToleranceType.Absolute);
    };
    
//	 private static void 
    function TransformPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
     {
         /*Geometry*/var target =  d;
         target.TransformPropertyChangedHook(e); 

         // The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children)
         // will promote the property value from a default value to a local value. This is technically a sub-property
         // change because the collection was changed and not a new collection set (GeometryGroup.Children.
         // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled 
         // the default value to the compositor. If the property changes from a default value, the new local value
         // needs to be marshalled to the compositor. We detect this scenario with the second condition 
         // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be 
         // Default and the NewValueSource will be Local.
         if (e.IsASubPropertyChange && 
            (e.OldValueSource == e.NewValueSource))
         {
             return;
         } 

         /*Transform*/var oldV = e.OldValue;
         /*Transform*/var newV = e.NewValue; 
         /*System.Windows.Threading.Dispatcher*/var dispatcher = target.Dispatcher;

         if (dispatcher != null)
         { 
//             DUCE.IResource targetResource = (DUCE.IResource)target;
//             using (CompositionEngineLock.Acquire()) 
//             { 
//                 int channelCount = targetResource.GetChannelCount();
//
//                 for (int channelIndex = 0; channelIndex < channelCount; channelIndex++)
//                 {
//                     DUCE.Channel channel = targetResource.GetChannel(channelIndex);
//                     Debug.Assert(!channel.IsOutOfBandChannel); 
//                     Debug.Assert(!targetResource.GetHandle(channel).IsNull);
//                     target.ReleaseResource(oldV,channel); 
//                     target.AddRefResource(newV,channel); 
//                 }
//             } 
         }

         target.PropertyChanged(Geometry.TransformProperty);
     } 
	 
     /// <summary> 
     /// Parse - returns an instance converted from the provided string
     /// using the current culture
     /// <param name="source"> string with Geometry data </param>
     /// </summary> 
//     public static Geometry 
	 Geometry.Parse = function(/*string*/ source)
     { 
         var formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS; 

         return MS.Internal.Parsers.ParseGeometry(source, formatProvider); 
     };
     
//     internal static PathGeometryData 
     Geometry.GetEmptyPathGeometryData = function() 
     {
         return s_emptyPathGeometryData;
     };

     ///<SecurityNote> 
     /// Critical as this has an unsafe block.
     /// TreatAsSafe - This allocates a buffer locally and writes to it.
     ///</SecurityNote>
//     private static PathGeometryData 
     function MakeEmptyPathGeometryData()
     { 
         var data = new PathGeometryData(); 
         data.FillRule = FillRule.EvenOdd;
         data.Matrix = CompositionResourceManager.MatrixToMilMatrix3x2D(Matrix.Identity); 

//         unsafe
//         {
//             int size = sizeof(MIL_PATHGEOMETRY); 
//
//             data.SerializedData = new byte[size]; 
//
//             fixed (byte *pbData = data.SerializedData)
//             { 
//                 MIL_PATHGEOMETRY *pPathGeometry = (MIL_PATHGEOMETRY*)pbData;
//
//                 // implicitly set pPathGeometry->Flags = 0;
//                 pPathGeometry->FigureCount = 0; 
//                 pPathGeometry->Size = (UInt32)size;
//             } 
//         } 

         return data; 
     }

//     private static Geometry 
     function MakeEmptyGeometry()
     { 
         var empty = new StreamGeometry();
         empty.Freeze(); 
         return empty; 
     }

     /// <summary> 
     ///     The DependencyProperty for the Geometry.Transform property.
     /// </summary> 
//     public static readonly DependencyProperty 
     var TransformProperty = null; 

//     internal static Transform 
     var s_Transform = Transform.Identity;
     
//     static Geometry()
     function Initialize()
     {
         // We check our static default fields which are of type Freezable
         // to make sure that they are not mutable, otherwise we will throw 
         // if these get touched by more than one thread in the lifetime
         // of your app.  (Windows OS Bug #947272) 
         // 
//         Debug.Assert(s_Transform == null || s_Transform.IsFrozen,
//             "Detected context bound default value Geometry.s_Transform (See OS Bug #947272)."); 

         // Initializations
    	 Geometry.TransformProperty =
    		 Animatable.RegisterProperty("Transform", 
                                Transform.Type, 
                                Geometry.Type,
                                Transform.Identity, 
                                new PropertyChangedCallback(null, TransformPropertyChanged),
                                null,
                                /* isIndependentlyAnimated  = */ false,
                                /* coerceValueCallback */ null); 
     }

	
	Geometry.Type = new Type("Geometry", Geometry, [Animatable.Type, IFormattable.Type]);
	Initialize();
	
	return Geometry;
});
