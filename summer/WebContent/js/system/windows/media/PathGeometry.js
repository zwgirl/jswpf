/**
 * PathGeometry
 */

define(["dojo/_base/declare", "system/Type", "media/Geometry", "windows/Point"], 
		function(declare, Type, Geometry){
	
	
//    internal enum 
	var PathGeometryInternalFlags = declare(Object, 
    { 
        
    });
	
	PathGeometryInternalFlags.None            = 0x0,
	PathGeometryInternalFlags.Invalid         = 0x1, 
	PathGeometryInternalFlags.Dirty           = 0x2, 
	PathGeometryInternalFlags.BoundsValid     = 0x4;
    
	///<summary>
    /// List of figures, populated by callbacks from unmanaged code
    ///</summary>
//    internal class 
	var FigureList =declare(Object, 
    {
        ///<summary> 
        /// Constructor 
        ///</summary>
        constructor:function() 
        {
            this._figures = new PathFigureCollection();
        },

        ///<summary> 
        /// Callback method, used for adding a figure to the list
        ///</summary>
        ///<param name="isFilled">
        /// The figure is filled 
        ///</param>
        ///<param name="isClosed"> 
        /// The figure is closed 
        ///</param>
        ///<param name="pPoints"> 
        /// The array of the figure's defining points
        ///</param>
        ///<param name="pointCount">
        /// The size of the points array 
        ///</param>
        ///<param name="pSegTypes"> 
        /// The array of the figure's defining segment types 
        ///</param>
        ///<param name="segmentCount"> 
        /// The size of the types array
        ///</param>
        /// <SecurityNote>
        ///    Critical: This code is critical because it is an unsafe code block 
        ///  </SecurityNote>
//        internal unsafe void 
        AddFigureToList:function(/*bool*/ isFilled, /*bool*/ isClosed, /*MilPoint2F**/ pPoints, /*UInt32*/ pointCount, 
        		/*byte**/ pSegTypes, /*UInt32*/ segmentCount) 
        {
            if (pointCount >=1 && segmentCount >= 1) 
            {
            	var figure = new PathFigure();

                figure.IsFilled = isFilled; 
                figure.StartPoint = new Point(pPoints.X, pPoints.Y);

                var pointIndex = 1; 
                var sameSegCount = 0;

                for (var segIndex=0; segIndex<segmentCount; segIndex += sameSegCount)
                {
                	var segType = (pSegTypes[segIndex] & MILCoreSegFlags.SegTypeMask);

                    sameSegCount = 1;

                    // Look for a run of same-type segments for a PolyXXXSegment. 
                    while (((segIndex + sameSegCount) < segmentCount) &&
                        (pSegTypes[segIndex] == pSegTypes[segIndex+sameSegCount])) 
                    {
                        sameSegCount++;
                    }

                    var fStroked = (pSegTypes[segIndex] & MILCoreSegFlags.SegIsAGap) == (byte)0;
                    var fSmooth = (pSegTypes[segIndex] & MILCoreSegFlags.SegSmoothJoin) != (byte)0; 

                    if (segType == MILCoreSegFlags.SegTypeLine)
                    { 
                        if (pointIndex+sameSegCount > pointCount)
                        {
                            throw new System.InvalidOperationException(SR.Get(SRID.PathGeometry_InternalReadBackError));
                        } 

                        if (sameSegCount>1) 
                        { 
                        	var ptCollection = new PointCollection();
                            for (var i=0; i<sameSegCount; i++) 
                            {
                                ptCollection.Add(new Point(pPoints[pointIndex+i].X, pPoints[pointIndex+i].Y));
                            }
                            ptCollection.Freeze(); 

                            /*PolyLineSegment*/var polySeg = new PolyLineSegment(ptCollection, fStroked, fSmooth); 
                            polySeg.Freeze(); 

                            figure.Segments.Add(polySeg); 
                        }
                        else
                        {
//                            Debug.Assert(sameSegCount == 1); 
                            figure.Segments.Add(new LineSegment(new Point(pPoints[pointIndex].X, pPoints[pointIndex].Y), fStroked, fSmooth));
                        } 

                        pointIndex += sameSegCount;
                    } 
                    else if (segType == MILCoreSegFlags.SegTypeBezier)
                    {
                    	var pointBezierCount = sameSegCount*3;

                        if (pointIndex+pointBezierCount > pointCount)
                        { 
                            throw new System.InvalidOperationException(SR.Get(SRID.PathGeometry_InternalReadBackError)); 
                        }

                        if (sameSegCount>1)
                        {
                        	var ptCollection = new PointCollection();
                            for (var i=0; i<pointBezierCount; i++) 
                            {
                                ptCollection.Add(new Point(pPoints[pointIndex+i].X, pPoints[pointIndex+i].Y)); 
                            } 
                            ptCollection.Freeze();

                            /*PolyBezierSegment*/var polySeg = new PolyBezierSegment(ptCollection, fStroked, fSmooth);
                            polySeg.Freeze();

                            figure.Segments.Add(polySeg); 
                        }
                        else 
                        { 
//                            Debug.Assert(sameSegCount == 1);

                            figure.Segments.Add(new BezierSegment(
                                new Point(pPoints[pointIndex].X, pPoints[pointIndex].Y),
                                new Point(pPoints[pointIndex+1].X, pPoints[pointIndex+1].Y),
                                new Point(pPoints[pointIndex+2].X, pPoints[pointIndex+2].Y), 
                                fStroked,
                                fSmooth)); 
                        } 

                        pointIndex += pointBezierCount; 
                    }
                    else
                    {
                        throw new System.InvalidOperationException(SR.Get(SRID.PathGeometry_InternalReadBackError)); 
                    }
                } 

                if (isClosed)
                { 
                    figure.IsClosed = true;
                }

                figure.Freeze(); 
                Figures.Add(figure);

                // Do not bother adding empty figures. 
            }
        },

        /// <summary>
        /// The array of figures
        /// </summary> 
//        internal PathFigureCollection _figures;
    });
	
	Object.defineProperties(FigureList.prototype, {
		        ///<summary>
        /// Figures - the array of figures 
        ///</summary> 
//        internal PathFigureCollection 
		Figures:
        { 
            get:function()
            {
                return this._figures;
            } 
        }
	});

//    internal const FillRule 
	var c_FillRule = FillRule.EvenOdd; 
//    internal static PathFigureCollection 
    var s_Figures = PathFigureCollection.Empty; 
    
	var PathGeometry = declare("PathGeometry", Geometry,{
		constructor:function(){
//	        internal PathGeometryInternalFlags 
			this._flags = PathGeometryInternalFlags.None;
//	        internal MilRectD 
			this._bounds = null;                  // Cached Bounds 
	        
			if(arguments.length == 1){
				if (figures != null) 
	            { 
	                for(var i=0; i<figures.Count; i++) //foreach (PathFigure item in figures)
	                { 
	                	var item = figures.Get(i);
	                    this.Figures.Add(item);
	                }
	            }
	            else 
	            {
	                throw new ArgumentNullException("figures"); 
	 
	            }
	 
				this.SetDirty();
			}else if(arguments.length == 3){
				this.Transform = transform;
	            if (ValidateEnums.IsFillRuleValid(fillRule)) 
	            {
	            	this.FillRule = fillRule; 
	 
	                if (figures != null)
	                { 
	                	for(var i=0; i<figures.Count; i++) //foreach (PathFigure item in figures)
		                { 
		                	var item = figures.Get(i);
		                	this.Figures.Add(item);
	                    } 
	                }
	                else 
	                { 
	                    throw new ArgumentNullException("figures");
	                } 

	                this.SetDirty();
	            }
			}
		},
        
        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary>
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function() 
        {
            return new PathGeometry(); 
        },
        
        
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.OnChanged">Freezable.OnChanged</see>.
        /// </summary>
//        protected override void 
        OnChanged:function() 
        {
            this.SetDirty(); 
 
            base.OnChanged();
        }, 

//        internal override PathFigureCollection 
        GetTransformedFigureCollection:function(/*Transform*/ transform)
        { 
            // Combine the transform argument with the internal transform
        	var matrix = GetCombinedMatrix(transform); 
 
            // Get the figure collection
            var result; 

            if (matrix.IsIdentity)
            {
                // There is no need to transform, return the figure collection 
                result = Figures;
                if (result == null) 
                { 
                    result = new PathFigureCollection();
                } 
            }
            else
            {
                // Return a transformed copy of the figure collection 
                result = new PathFigureCollection();
                var figures = Figures; 
                var count = figures != null ? figures.Count : 0; 
                for (var i = 0; i < count; ++i)
                { 
                	var figure = figures.Internal_GetItem(i);
                    result.Add(figure.GetTransformedCopy(matrix));
                }
            } 

            Debug.Assert(result != null); 
            return result; 
        },
        /// <summary>
        /// 
        /// </summary>
//        public void 
        AddGeometry:function(/*Geometry*/ geometry) 
        { 
            if (geometry == null)
            { 
                throw new System.ArgumentNullException("geometry");
            }

            if (geometry.IsEmpty()) 
            {
                return; 
            } 

            /*PathFigureCollection*/var figureCollection = geometry.GetPathFigureCollection(); 
//            Debug.Assert(figureCollection != null);

            /*PathFigureCollection*/var figures = this.Figures;
 
            if (figures == null)
            { 
                figures = this.Figures = new PathFigureCollection(); 
            }
 
            for (var i = 0; i < figureCollection.Count; ++i)
            {
                figures.Add(figureCollection.Internal_GetItem(i));
            } 
        },
        
        /// <summary> 
        /// </summary> 
        ///<SecurityNote>
        ///     Critical - calls MilUtility_GetPointAtLengthFraction that performs an elevation. 
        ///     PublicOK - This computes the location of the point x% along the way of a path (and its direction).
        ///                Progress is normalized between 0 and 1.  This math is considered safe.
        ///</SecurityNote>
//        public void 
        GetPointAtFractionLength:function(
            /*double*/ progress, 
            /*out Point point*/pointOut, 
            /*out Point tangent*/tangentOut)
        { 
            if (IsEmpty())
            {
                point = new Point();
                tangent = new Point(); 
                return;
            } 
 
//            unsafe
//            { 
//                PathGeometryData pathData = GetPathGeometryData();
//
//                fixed (byte *pbPathData = pathData.SerializedData)
//                { 
//                    Debug.Assert(pbPathData != (byte*)0);
// 
//                    HRESULT.Check(MilCoreApi.MilUtility_GetPointAtLengthFraction( 
//                        &pathData.Matrix,
//                        pathData.FillRule, 
//                        pbPathData,
//                        pathData.Size,
//                        progress,
//                        out point, 
//                        out tangent));
//                } 
//            } 
        },
        /// <summary>
        /// Returns the result of a Boolean combination of two Geometry objects. 
        /// </summary>
        /// <param name="geometry1">The first Geometry object</param> 
        /// <param name="geometry2">The second Geometry object</param> 
        /// <param name="mode">The mode in which the objects will be combined</param>
        /// <param name="transform">A transformation to apply to the result, or null</param> 
        /// <param name="tolerance">The computational error tolerance</param>
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        ///<SecurityNote>
        ///     Critical - calls code that perfoms an elevation ( MilUtility_PathGeometryCombine ) 
        ///     TreatAsSafe - the net effect of this function is to return a new PathGeometry given a transform and a combine operation.
        ///                          Considered safe. 
        /// 
        ///                          Although we call code within an unsafe block - managed objects are used to construct the unmanaged data.
        ///                          unsafe code will have to be reviewed 
        ///</SecurityNote>
//        internal static PathGeometry 
        InternalCombine:function(
            /*Geometry*/ geometry1, 
            /*Geometry*/ geometry2,
            /*GeometryCombineMode*/ mode, 
            /*Transform*/ transform, 
            /*double*/ tolerance,
            /*ToleranceType*/ type) 
        {
            /*PathGeometry*/var resultGeometry = null;

//            unsafe 
//            {
//                MilMatrix3x2D matrix = CompositionResourceManager.TransformToMilMatrix3x2D(transform); 
// 
//                PathGeometryData data1 = geometry1.GetPathGeometryData();
//                PathGeometryData data2 = geometry2.GetPathGeometryData(); 
//
//                fixed (byte* pPathData1 = data1.SerializedData)
//                {
//                    Debug.Assert(pPathData1 != (byte*)0); 
//
//                    fixed (byte* pPathData2 = data2.SerializedData) 
//                    { 
//                        Debug.Assert(pPathData2 != (byte*)0);
// 
//                        FillRule fillRule = FillRule.Nonzero;
//
//                        FigureList list = new FigureList();
//                        int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryCombine( 
//                            &matrix,
//                            &data1.Matrix, 
//                            data1.FillRule, 
//                            pPathData1,
//                            data1.Size, 
//                            &data2.Matrix,
//                            data2.FillRule,
//                            pPathData2,
//                            data2.Size, 
//                            tolerance,
//                            type == ToleranceType.Relative, 
//                            new AddFigureToListDelegate(list.AddFigureToList), 
//                            mode,
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
//                } 
//            } 

            return resultGeometry; 
        },

        /// <summary> 
        /// Remove all figures
        /// </summary> 
//        public void 
        Clear:function()
        { 
            /*PathFigureCollection*/var figures = this.Figures;

            if (figures != null)
            { 
                figures.Clear();
            } 
        }
        
	});
	
	Object.defineProperties(PathGeometry.prototype,{
		/// <summary>
        ///     FillRule - FillRule.  Default value is FillRule.EvenOdd. 
        /// </summary> 
//        public FillRule 
		FillRule:
        { 
            get:function()
            {
                return this.GetValue(PathGeometry.FillRuleProperty);
            },
            set:function(value)
            { 
            	this.SetValueInternal(PathGeometry.FillRuleProperty, value); 
            }
        }, 

        /// <summary>
        ///     Figures - PathFigureCollection.  Default value is new FreezableDefaultValueFactory(PathFigureCollection.Empty).
        /// </summary> 
//        public PathFigureCollection 
        Figures:
        { 
            get:function() 
            {
                return this.GetValue(PathGeometry.FiguresProperty); 
            },
            set:function(value)
            {
            	this.SetValueInternal(PathGeometry.FiguresProperty, value); 
            }
        }, 
        
        /// <summary>
        /// Gets the bounds of this PathGeometry as an axis-aligned bounding box
        /// </summary> 
//        public override Rect 
        Bounds:
        { 
            get:function() 
            {
                this.ReadPreamble(); 

                if (this.IsEmpty())
                {
                    return Rect.Empty; 
                }
                else 
                { 
                    if ((this._flags & PathGeometryInternalFlags.BoundsValid) == 0)
                    { 
                        // Update the cached bounds
                    	this._bounds = GetPathBoundsAsRB(
                            GetPathGeometryData(),
                            null,   // pen 
                            Matrix.Identity,
                            StandardFlatteningTolerance, 
                            ToleranceType.Absolute, 
                            false);  // Do not skip non-fillable figures
 
                    	this._flags |= PathGeometryInternalFlags.BoundsValid;
                    }

                    return this._bounds.AsRect; 
                }
            } 
        },
        
      /// <summary>
        /// Returns true if this geometry is empty
        /// </summary>
//        public override bool 
        IsEmpty:function() 
        {
            /*PathFigureCollection*/var figures = Figures; 
            return (figures == null) || (figures.Count <= 0); 
        },

        /// <summary>
        /// Returns true if this geometry may have curved segments 
        /// </summary>
//        public override bool 
        MayHaveCurves:function() 
        { 
            /*PathFigureCollection*/var figures = Figures;
 
            var count = (figures != null) ? figures.Count : 0;

            for (var i=0; i<count; i++)
            { 
                if (figures.Internal_GetItem(i).MayHaveCurves())
                { 
                    return true; 
                }
            } 

            return false;
        },
 
        /// <summary> 
        /// GetAsPathGeometry - return a PathGeometry version of this Geometry
        /// </summary> 
//        internal override PathGeometry 
        GetAsPathGeometry:function()
        {
            return CloneCurrentValue();
        },

        /// <summary> 
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in.
        /// If the provider is null, the CurrentCulture is used. 
        /// See the documentation for IFormattable for more information.
        /// </summary>
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
//        internal override string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        { 
            /*PathFigureCollection*/var figures = this.Figures;
            /*FillRule*/var fillRule = this.FillRule; 

            var figuresString = String.Empty;

            if (figures != null) 
            {
                figuresString = figures.ConvertToString(format, provider); 
            } 

            if (fillRule != FillRule.EvenOdd) 
            {
                return "F1" + figuresString;
            }
            else 
            {
                return figuresString; 
            } 
        },
 
//        internal void 
        SetDirty:function()
        {
            this._flags = PathGeometryInternalFlags.Dirty;
        }, 

        /// <summary> 
        /// GetPathGeometryData - returns a struct which contains this Geometry represented 
        /// as a path geometry's serialized format.
        /// </summary> 
//        internal override PathGeometryData 
        GetPathGeometryData:function()
        {
            /*PathGeometryData*/var data = new PathGeometryData();
            data.FillRule = FillRule; 
            data.Matrix = CompositionResourceManager.TransformToMilMatrix3x2D(Transform);
 
            if (IsObviouslyEmpty()) 
            {
                return Geometry.GetEmptyPathGeometryData(); 
            }

            /*ByteStreamGeometryContext*/var ctx = new ByteStreamGeometryContext();
 
            /*PathFigureCollection*/var figures = Figures;
 
            var figureCount = figures == null ? 0 : figures.Count; 

            for (var i = 0; i < figureCount; i++) 
            {
                figures.Internal_GetItem(i).SerializeData(ctx);
            }
 
            ctx.Close();
            data.SerializedData = ctx.GetData(); 
 
            return data;
        },
        
//        internal override void 
        TransformPropertyChangedHook:function(/*DependencyPropertyChangedEventArgs*/ e) 
        { 
            // PathGeometry caches the transformed bounds.  We hook the changed event
            // on the Transformed bounds so we can clear the cache. 
            if ((this._flags & PathGeometryInternalFlags.BoundsValid) != 0)
            {
            	this.SetDirty();
 
                // The UCE slave already has a notifier registered on its transform to
                // invalidate its cache.  No need to call InvalidateResource() here to 
                // marshal the MIL_PATHGEOMETRY.Flags. 
            }
        }, 

//        internal void 
        FiguresPropertyChangedHook:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
            // This is necessary to invalidate the cached bounds. 
        	this.SetDirty();
        } 
	});
	
	Object.defineProperties(PathGeometry,{
		  
	});
	
//    private static void 
	function FillRulePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        PathGeometry target = ((PathGeometry) d);
        d.PropertyChanged(PathGeometry.FillRuleProperty); 
    }
//    private static void 
	function FiguresPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        PathGeometry target = ((PathGeometry) d); 
        d.FiguresPropertyChangedHook(e);
        d.PropertyChanged(PathGeometry.FiguresProperty);
    } 
	
    /// <summary> 
    /// Static "CreateFromGeometry" method which creates a new PathGeometry from the Geometry specified. 
    /// </summary>
    /// <param name="geometry"> 
    /// Geometry - The Geometry which will be used as the basis for the newly created
    /// PathGeometry.  The new Geometry will be based on the current value of all properties.
    /// </param>
//    public static PathGeometry 
	PathGeometry.CreateFromGeometry = function(/*Geometry*/ geometry) 
    {
        if (geometry == null) 
        { 
            return null;
        } 

        return geometry.GetAsPathGeometry();
    };

    /// <summary>
    /// Static method which parses a PathGeometryData and makes calls into the provided context sink. 
    /// This can be used to build a PathGeometry, for readback, etc. 
    /// </summary>
    ///<SecurityNote> 
    ///     Critical - calls code that performs an elevation.
    ///     TreatAsSafe - This method reads from a pinned byte array.
    ///</SecurityNote>
//    internal static void 
    PathGeometry.ParsePathGeometryData = function(/*PathGeometryData*/ pathData, /*CapacityStreamGeometryContext*/ ctx)
    { 
        if (pathData.IsEmpty()) 
        {
            return; 
        }

//        unsafe
//        { 
//            int currentOffset = 0;
//
//            fixed (byte* pbData = pathData.SerializedData) 
//            {
//                // This assert is a logical correctness test 
//                Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_PATHGEOMETRY));
//
//                // ... while this assert tests "physical" correctness (i.e. are we running out of buffer).
//                Invariant.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_PATHGEOMETRY)); 
//
//                MIL_PATHGEOMETRY *pPathGeometry = (MIL_PATHGEOMETRY*)pbData; 
//
//                // Move the current offset to after the Path's data
//                currentOffset += sizeof(MIL_PATHGEOMETRY); 
//
//                // Are there any Figures to add?
//                if (pPathGeometry->FigureCount > 0)
//                { 
//                    // Allocate the correct number of Figures up front
//                    ctx.SetFigureCount((int)pPathGeometry->FigureCount); 
//
//                    // ... and iterate on the Figures.
//                    for (int i = 0; i < pPathGeometry->FigureCount; i++) 
//                    {
//                        // We only expect well-formed data, but we should assert that we're not reading
//                        // too much data.
//                        Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_PATHFIGURE)); 
//
//                        MIL_PATHFIGURE *pPathFigure = (MIL_PATHFIGURE*)(pbData + currentOffset); 
//
//                        // Move the current offset to the after of the Figure's data
//                        currentOffset += sizeof(MIL_PATHFIGURE); 
//
//                        ctx.BeginFigure(pPathFigure->StartPoint,
//                                        ((pPathFigure->Flags & MilPathFigureFlags.IsFillable) != 0),
//                                        ((pPathFigure->Flags & MilPathFigureFlags.IsClosed) != 0)); 
//
//                        if (pPathFigure->Count > 0) 
//                        { 
//                            // Allocate the correct number of Segments up front
//                            ctx.SetSegmentCount((int)pPathFigure->Count); 
//
//                            // ... and iterate on the Segments.
//                            for (int j = 0; j < pPathFigure->Count; j++)
//                            { 
//                                // We only expect well-formed data, but we should assert that we're not reading too much data.
//                                Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_SEGMENT)); 
//                                Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_SEGMENT)); 
//
//                                MIL_SEGMENT *pSegment = (MIL_SEGMENT*)(pbData + currentOffset); 
//
//                                switch (pSegment->Type)
//                                {
//                                case MIL_SEGMENT_TYPE.MilSegmentLine: 
//                                    {
//                                        // We only expect well-formed data, but we should assert that we're not reading too much data. 
//                                        Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_SEGMENT_LINE)); 
//                                        Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_SEGMENT_LINE));
//
//                                        MIL_SEGMENT_LINE *pSegmentLine = (MIL_SEGMENT_LINE*)(pbData + currentOffset);
//
//                                        ctx.LineTo(pSegmentLine->Point,
//                                                   ((pSegmentLine->Flags & MILCoreSegFlags.SegIsAGap) == 0), 
//                                                   ((pSegmentLine->Flags & MILCoreSegFlags.SegSmoothJoin) != 0));
//
//                                        currentOffset += sizeof(MIL_SEGMENT_LINE); 
//                                    }
//                                    break; 
//                                case MIL_SEGMENT_TYPE.MilSegmentBezier:
//                                    {
//                                        // We only expect well-formed data, but we should assert that we're not reading too much data.
//                                        Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_SEGMENT_BEZIER)); 
//                                        Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_SEGMENT_BEZIER));
//
//                                        MIL_SEGMENT_BEZIER *pSegmentBezier = (MIL_SEGMENT_BEZIER*)(pbData + currentOffset); 
//
//                                        ctx.BezierTo(pSegmentBezier->Point1, 
//                                                     pSegmentBezier->Point2,
//                                                     pSegmentBezier->Point3,
//                                                     ((pSegmentBezier->Flags & MILCoreSegFlags.SegIsAGap) == 0),
//                                                     ((pSegmentBezier->Flags & MILCoreSegFlags.SegSmoothJoin) != 0)); 
//
//                                        currentOffset += sizeof(MIL_SEGMENT_BEZIER); 
//                                    } 
//                                    break;
//                                case MIL_SEGMENT_TYPE.MilSegmentQuadraticBezier: 
//                                    {
//                                        // We only expect well-formed data, but we should assert that we're not reading too much data.
//                                        Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_SEGMENT_QUADRATICBEZIER));
//                                        Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_SEGMENT_QUADRATICBEZIER)); 
//
//                                        MIL_SEGMENT_QUADRATICBEZIER *pSegmentQuadraticBezier = (MIL_SEGMENT_QUADRATICBEZIER*)(pbData + currentOffset); 
//
//                                        ctx.QuadraticBezierTo(pSegmentQuadraticBezier->Point1,
//                                                              pSegmentQuadraticBezier->Point2, 
//                                                              ((pSegmentQuadraticBezier->Flags & MILCoreSegFlags.SegIsAGap) == 0),
//                                                              ((pSegmentQuadraticBezier->Flags & MILCoreSegFlags.SegSmoothJoin) != 0));
//
//                                        currentOffset += sizeof(MIL_SEGMENT_QUADRATICBEZIER); 
//                                    }
//                                    break; 
//                                case MIL_SEGMENT_TYPE.MilSegmentArc: 
//                                    {
//                                        // We only expect well-formed data, but we should assert that we're not reading too much data. 
//                                        Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_SEGMENT_ARC));
//                                        Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_SEGMENT_ARC));
//
//                                        MIL_SEGMENT_ARC *pSegmentArc = (MIL_SEGMENT_ARC*)(pbData + currentOffset); 
//
//                                        ctx.ArcTo(pSegmentArc->Point, 
//                                                  pSegmentArc->Size, 
//                                                  pSegmentArc->XRotation,
//                                                  (pSegmentArc->LargeArc != 0), 
//                                                  (pSegmentArc->Sweep == 0) ? SweepDirection.Counterclockwise : SweepDirection.Clockwise,
//                                                  ((pSegmentArc->Flags & MILCoreSegFlags.SegIsAGap) == 0),
//                                                  ((pSegmentArc->Flags & MILCoreSegFlags.SegSmoothJoin) != 0));
//
//                                        currentOffset += sizeof(MIL_SEGMENT_ARC);
//                                    } 
//                                    break; 
//                                case MIL_SEGMENT_TYPE.MilSegmentPolyLine:
//                                case MIL_SEGMENT_TYPE.MilSegmentPolyBezier: 
//                                case MIL_SEGMENT_TYPE.MilSegmentPolyQuadraticBezier:
//                                    {
//                                        // We only expect well-formed data, but we should assert that we're not reading too much data.
//                                        Debug.Assert(pathData.SerializedData.Length >= currentOffset + sizeof(MIL_SEGMENT_POLY)); 
//                                        Debug.Assert(pathData.Size >= currentOffset + sizeof(MIL_SEGMENT_POLY));
//
//                                        MIL_SEGMENT_POLY *pSegmentPoly = (MIL_SEGMENT_POLY*)(pbData + currentOffset); 
//
//                                        Debug.Assert(pSegmentPoly->Count <= Int32.MaxValue); 
//
//                                        if (pSegmentPoly->Count > 0)
//                                        {
//                                            List<Point> points = new List<Point>((int)pSegmentPoly->Count); 
//
//                                            // We only expect well-formed data, but we should assert that we're not reading too much data. 
//                                            Debug.Assert(pathData.SerializedData.Length >= 
//                                                         currentOffset +
//                                                         sizeof(MIL_SEGMENT_POLY) + 
//                                                         (int)pSegmentPoly->Count * sizeof(Point));
//                                            Debug.Assert(pathData.Size >=
//                                                         currentOffset +
//                                                         sizeof(MIL_SEGMENT_POLY) + 
//                                                         (int)pSegmentPoly->Count * sizeof(Point));
//
//                                            Point* pPoint = (Point*)(pbData + currentOffset + sizeof(MIL_SEGMENT_POLY)); 
//
//                                            for (uint k = 0; k < pSegmentPoly->Count; k++) 
//                                            {
//                                                points.Add(*pPoint);
//                                                pPoint++;
//                                            } 
//
//                                            switch (pSegment->Type) 
//                                            { 
//                                            case MIL_SEGMENT_TYPE.MilSegmentPolyLine:
//                                                ctx.PolyLineTo(points, 
//                                                               ((pSegmentPoly->Flags & MILCoreSegFlags.SegIsAGap) == 0),
//                                                               ((pSegmentPoly->Flags & MILCoreSegFlags.SegSmoothJoin) != 0));
//                                                break;
//                                            case MIL_SEGMENT_TYPE.MilSegmentPolyBezier: 
//                                                ctx.PolyBezierTo(points,
//                                                                 ((pSegmentPoly->Flags & MILCoreSegFlags.SegIsAGap) == 0), 
//                                                                 ((pSegmentPoly->Flags & MILCoreSegFlags.SegSmoothJoin) != 0)); 
//                                                break;
//                                            case MIL_SEGMENT_TYPE.MilSegmentPolyQuadraticBezier: 
//                                                ctx.PolyQuadraticBezierTo(points,
//                                                               ((pSegmentPoly->Flags & MILCoreSegFlags.SegIsAGap) == 0),
//                                                               ((pSegmentPoly->Flags & MILCoreSegFlags.SegSmoothJoin) != 0));
//                                                break; 
//                                            }
//                                        } 
//
//                                        currentOffset += sizeof(MIL_SEGMENT_POLY) + (int)pSegmentPoly->Count * sizeof(Point);
//                                    } 
//                                    break;
//                                }
//                            } 
//                        }
//                    }
//                }
//            } 
//        }
    };
    

    /// <summary> 
    /// Gets the bounds of this PathGeometry as an axis-aligned bounding box with pen and/or transform
    /// </summary>
//    internal static Rect 
    GetPathBounds = function(
        /*PathGeometryData*/ pathData, 
        /*Pen*/ pen,
        /*Matrix*/ worldMatrix, 
        /*double*/ tolerance, 
        /*ToleranceType*/ type,
        /*bool*/ skipHollows) 
    {
        if (pathData.IsEmpty())
        {
            return Rect.Empty; 
        }
        else 
        { 
            /*MilRectD*/var bounds = PathGeometry.GetPathBoundsAsRB(
                pathData, 
                pen,
                worldMatrix,
                tolerance,
                type, 
                skipHollows);

            return bounds.AsRect; 
        }
    } 

    /// <summary>
    /// Gets the bounds of this PathGeometry as an axis-aligned bounding box with pen and/or transform
    /// 
    /// This function should not be called with a PathGeometryData that's known to be empty, since MilRectD
    /// does not offer a standard way of representing this. 
    /// </summary> 
    ///<SecurityNote>
    ///     Critical as this code performs an elevation ( SUC on MilUtility_PathGeometryBounds) 
    ///     TreatAsSafe - the net effect of this function is to return a rect for the Path's bounds. Considered safe.
    ///                          although we call code within an unsafe block - managed objects are used to construct the unmanaged data.
    ///</SecurityNote>
//    internal static MilRectD 
    GetPathBoundsAsRB = function(
        /*PathGeometryData*/ pathData, 
        /*Pen*/ pen, 
        /*Matrix*/ worldMatrix,
        /*double*/ tolerance, 
        /*ToleranceType*/ type,
        /*bool*/ skipHollows)
    {
        // This method can't handle the empty geometry case, as it's impossible for us to 
        // return Rect.Empty. Callers should do their own check.
//        Debug.Assert(!pathData.IsEmpty()); 

//        unsafe
//        { 
//            MIL_PEN_DATA penData;
//            double[] dashArray = null;
//
//            // If we have a pen, populate the CMD struct 
//            if (pen != null)
//            { 
//                pen.GetBasicPenData(&penData, out dashArray); 
//            }
//
//            MilMatrix3x2D worldMatrix3X2 = CompositionResourceManager.MatrixToMilMatrix3x2D(ref worldMatrix);
//
//            fixed (byte *pbPathData = pathData.SerializedData)
//            { 
//                MilRectD bounds;
//
//                Debug.Assert(pbPathData != (byte*)0); 
//
//                fixed (double *pDashArray = dashArray) 
//                {
//                    int hr = UnsafeNativeMethods.MilCoreApi.MilUtility_PathGeometryBounds(
//                        (pen == null) ? null : &penData,
//                        pDashArray, 
//                        &worldMatrix3X2,
//                        pathData.FillRule, 
//                        pbPathData, 
//                        pathData.Size,
//                        &pathData.Matrix, 
//                        tolerance,
//                        type == ToleranceType.Relative,
//                        skipHollows,
//                        &bounds 
//                        );
//
//                    if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//                    {
//                        // When we encounter NaNs in the renderer, we absorb the error and draw 
//                        // nothing. To be consistent, we report that the geometry has empty bounds
//                        // (NaN will get transformed into Rect.Empty higher up).
//
//                        bounds = MilRectD.NaN; 
//                    }
//                    else 
//                    { 
//                        HRESULT.Check(hr);
//                    } 
//                }
//
//                return bounds;
//            } 
//        }
    },
    ///<SecurityNote>
    /// Critical as this calls a method that elevates (MilUtility_PathGeometryHitTestPathGeometry) 
    /// TreatAsSafe - net effect of this is to checking the relationship between two geometries. So it's considered safe.
    ///</SecurityNote> 
//    internal static IntersectionDetail 
    HitTestWithPathGeometry = function(
        /*Geometry*/ geometry1, 
        /*Geometry*/ geometry2,
        /*double*/ tolerance,
        /*ToleranceType*/ type)
    { 
        /*IntersectionDetail*/var detail = IntersectionDetail.NotCalculated;

//        unsafe 
//        {
//            PathGeometryData data1 = geometry1.GetPathGeometryData(); 
//            PathGeometryData data2 = geometry2.GetPathGeometryData();
//
//            fixed (byte *pbPathData1 = data1.SerializedData)
//            { 
//                Debug.Assert(pbPathData1 != (byte*)0);
//
//                fixed (byte *pbPathData2 = data2.SerializedData) 
//                {
//                    Debug.Assert(pbPathData2 != (byte*)0); 
//
//                    int hr = MilCoreApi.MilUtility_PathGeometryHitTestPathGeometry(
//                        &data1.Matrix,
//                        data1.FillRule, 
//                        pbPathData1,
//                        data1.Size, 
//                        &data2.Matrix, 
//                        data2.FillRule,
//                        pbPathData2, 
//                        data2.Size,
//                        tolerance,
//                        type == ToleranceType.Relative,
//                        &detail); 
//
//                    if (hr == (int)MILErrors.WGXERR_BADNUMBER) 
//                    { 
//                        // When we encounter NaNs in the renderer, we absorb the error and draw
//                        // nothing. To be consistent, we report that the geometry is never hittable. 
//                        detail = IntersectionDetail.Empty;
//                    }
//                    else
//                    { 
//                        HRESULT.Check(hr);
//                    } 
//                } 
//            }
//        } 

//        Debug.Assert(detail != IntersectionDetail.NotCalculated);

        return detail; 
    };
    
//    static PathGeometry()
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272)
        // 
//        Debug.Assert(s_Figures == null || s_Figures.IsFrozen,
//            "Detected context bound default value PathGeometry.s_Figures (See OS Bug #947272).");

        // Initializations
    	PathGeometry.FillRuleProperty = 
              RegisterProperty("FillRule",
                               Number.Type, 
                               PathGeometry.Type,
                               FillRule.EvenOdd,
                               new PropertyChangedCallback(null, FillRulePropertyChanged),
                               new ValidateValueCallback(null, /*System.Windows.Media.*/ValidateEnums.IsFillRuleValid), 
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null); 
    	PathGeometry.FiguresProperty = 
              RegisterProperty("Figures",
            		  PathFigureCollection.Type, 
                               PathGeometry.Type,
                               new FreezableDefaultValueFactory(PathFigureCollection.Empty),
                               new PropertyChangedCallback(null, FiguresPropertyChanged),
                               null, 
                               /* isIndependentlyAnimated  = */ false,
                               /* coerceValueCallback */ null); 
    } 
	
	PathGeometry.Type = new Type("PathGeometry", PathGeometry, [Geometry.Type]);
	Initialize();
	
	return PathGeometry;
});


