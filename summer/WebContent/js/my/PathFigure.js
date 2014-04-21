/**
 * PathFigure
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable"], 
		function(declare, Type, Animatable){
	var PathFigure = declare("PathFigure", Animatable,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(PathFigure.prototype,{
		  
	});
	
	Object.defineProperties(PathFigure,{
		  
	});
	
	PathFigure.Type = new Type("PathFigure", PathFigure, [Animatable.Type]);
	return PathFigure;
});



//---------------------------------------------------------------------------- 
//
// <copyright file="PathFigure.cs" company="Microsoft">
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


 
    sealed partial class PathFigure : Animatable
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
        public new PathFigure Clone()
        {
            return (PathFigure)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new PathFigure CloneCurrentValue()
        {
            return (PathFigure)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 

 

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
        ///     IsFilled - bool.  Default value is true.
        /// </summary>
        public bool IsFilled 
        {
            get 
            { 
                return (bool) GetValue(IsFilledProperty);
            } 
            set
            {
                SetValueInternal(IsFilledProperty, BooleanBoxes.Box(value));
            } 
        }
 
        /// <summary> 
        ///     Segments - PathSegmentCollection.  Default value is new FreezableDefaultValueFactory(PathSegmentCollection.Empty).
        /// </summary> 
        public PathSegmentCollection Segments
        {
            get
            { 
                return (PathSegmentCollection) GetValue(SegmentsProperty);
            } 
            set 
            {
                SetValueInternal(SegmentsProperty, value); 
            }
        }

        /// <summary> 
        ///     IsClosed - bool.  Default value is false.
        /// </summary> 
        public bool IsClosed 
        {
            get 
            {
                return (bool) GetValue(IsClosedProperty);
            }
            set 
            {
                SetValueInternal(IsClosedProperty, BooleanBoxes.Box(value)); 
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
            return new PathFigure();
        } 



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
 
        //
        //  This property finds the correct initial size for the _effectiveValues store on the 
        //  current DependencyObject as a performance optimization 
        //
        //  This includes: 
        //    StartPoint
        //    Segments
        //    IsClosed
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
        ///     The DependencyProperty for the PathFigure.StartPoint property.
        /// </summary> 
        public static readonly DependencyProperty StartPointProperty;
        /// <summary>
        ///     The DependencyProperty for the PathFigure.IsFilled property.
        /// </summary> 
        public static readonly DependencyProperty IsFilledProperty;
        /// <summary> 
        ///     The DependencyProperty for the PathFigure.Segments property. 
        /// </summary>
        public static readonly DependencyProperty SegmentsProperty; 
        /// <summary>
        ///     The DependencyProperty for the PathFigure.IsClosed property.
        /// </summary>
        public static readonly DependencyProperty IsClosedProperty; 

        #endregion Dependency Properties 
 
        //-----------------------------------------------------
        // 
        //  Internal Fields
        //
        //------------------------------------------------------
 
        #region Internal Fields
 
 

 

        internal static Point s_StartPoint = new Point();
        internal const bool c_IsFilled = true;
        internal static PathSegmentCollection s_Segments = PathSegmentCollection.Empty; 
        internal const bool c_IsClosed = false;
 
        #endregion Internal Fields 

 

        #region Constructors

        //------------------------------------------------------ 
        //
        //  Constructors 
        // 
        //-----------------------------------------------------
 
        static PathFigure()
        {
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime
            // of your app.  (Windows OS Bug #947272) 
            // 
            Debug.Assert(s_Segments == null || s_Segments.IsFrozen,
                "Detected context bound default value PathFigure.s_Segments (See OS Bug #947272)."); 


            // Initializations
            Type typeofThis = typeof(PathFigure); 
            StartPointProperty =
                  RegisterProperty("StartPoint", 
                                   typeof(Point), 
                                   typeofThis,
                                   new Point(), 
                                   null,
                                   null,
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null); 
            IsFilledProperty =
                  RegisterProperty("IsFilled", 
                                   typeof(bool), 
                                   typeofThis,
                                   true, 
                                   null,
                                   null,
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null); 
            SegmentsProperty =
                  RegisterProperty("Segments", 
                                   typeof(PathSegmentCollection), 
                                   typeofThis,
                                   new FreezableDefaultValueFactory(PathSegmentCollection.Empty), 
                                   null,
                                   null,
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null); 
            IsClosedProperty =
                  RegisterProperty("IsClosed", 
                                   typeof(bool), 
                                   typeofThis,
                                   false, 
                                   null,
                                   null,
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null); 
        }
 
 

        #endregion Constructors 
        
        #region Constructors
        /// <summary> 
        ///
        /// </summary> 
        public PathFigure() 
        {
        } 

        /// <summary>
        /// Constructor
        /// </summary> 
        /// <param name="start">The path's startpoint</param>
        /// <param name="segments">A collection of segments</param> 
        /// <param name="closed">Indicates whether the figure is closed</param> 
        public PathFigure(Point start, IEnumerable<PathSegment> segments, bool closed)
        { 
            StartPoint = start;
            PathSegmentCollection mySegments = Segments;

            if (segments != null) 
            {
                foreach (PathSegment item in segments) 
                { 
                    mySegments.Add(item);
                } 
            }
            else
            {
                throw new ArgumentNullException("segments"); 
            }
 
            IsClosed = closed; 
        }
 
        #endregion Constructors

        #region GetFlattenedPathFigure
        /// <summary> 
        /// Approximate this figure with a polygonal PathFigure
        /// </summary> 
        /// <param name="tolerance">The approximation error tolerance</param> 
        /// <param name="type">The way the error tolerance will be interpreted - relative or absolute</param>
        /// <returns>Returns the polygonal approximation as a PathFigure.</returns> 
        public PathFigure GetFlattenedPathFigure(double tolerance, ToleranceType type)
        {
            PathGeometry geometry = new PathGeometry();
            geometry.Figures.Add(this); 

            PathGeometry flattenedGeometry = geometry.GetFlattenedPathGeometry(tolerance, type); 
 
            int count = flattenedGeometry.Figures.Count;
 
            if (count == 0)
            {
                return new PathFigure();
            } 
            else if (count == 1)
            { 
                return flattenedGeometry.Figures[0]; 
            }
            else 
            {
                throw new InvalidOperationException(SR.Get(SRID.PathGeometry_InternalReadBackError));
            }
        } 

 
        /// <summary> 
        /// Approximate this figure with a polygonal PathFigure
        /// </summary> 
        /// <returns>Returns the polygonal approximation as a PathFigure.</returns>
        public PathFigure GetFlattenedPathFigure()
        {
            return GetFlattenedPathFigure(Geometry.StandardFlatteningTolerance, ToleranceType.Absolute); 
        }
 
        #endregion 

        /// <summary> 
        /// Returns true if this geometry may have curved segments
        /// </summary>
        public bool MayHaveCurves()
        { 
            PathSegmentCollection segments = Segments;
 
            if (segments == null) 
            {
                return false; 
            }

            int count = segments.Count;
 
            for (int i = 0; i < count; i++)
            { 
                if (segments.Internal_GetItem(i).IsCurved()) 
                {
                    return true; 
                }
            }

            return false; 
        }
 
        #region GetTransformedCopy 
        internal PathFigure GetTransformedCopy(Matrix matrix)
        { 
            PathSegmentCollection segments = Segments;

            PathFigure result = new PathFigure();
            Point current = StartPoint; 
            result.StartPoint = current * matrix;
 
            if (segments != null) 
            {
                int count = segments.Count; 
                for (int i=0; i<count; i++)
                {
                    segments.Internal_GetItem(i).AddToFigure(matrix, result, ref current);
                } 
            }
 
            result.IsClosed = IsClosed; 
            result.IsFilled = IsFilled;
 
            return result;
        }
        #endregion
 
        /// <summary>
        /// Creates a string representation of this object based on the current culture. 
        /// </summary> 
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
        public override string ToString()
        {
            ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls.
            return ConvertToString(null /* format string */, null /* format provider */); 
        } 

        /// <summary> 
        /// Creates a string representation of this object based on the IFormatProvider
        /// passed in.  If the provider is null, the CurrentCulture is used.
        /// </summary>
        /// <returns> 
        /// A string representation of this object.
        /// </returns> 
        public string ToString(IFormatProvider provider) 
        {
            ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls.
            return ConvertToString(null /* format string */, provider);
        }
 
        /// <summary>
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns>
        /// A string representation of this object.
        /// </returns> 
        string IFormattable.ToString(string format, IFormatProvider provider)
        { 
            ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls.
            return ConvertToString(format, provider); 
        }

        /// <summary>
        /// Can serialze "this" to a string. 
        /// This returns true iff IsFilled == c_isFilled and the segment
        /// collection can be stroked. 
        /// </summary> 
        internal bool CanSerializeToString()
        { 
            PathSegmentCollection segments = Segments;
            return (IsFilled == c_IsFilled) && ((segments == null) || segments.CanSerializeToString());
        }
 
        /// <summary>
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns>
        /// A string representation of this object.
        /// </returns> 
        internal string ConvertToString(string format, IFormatProvider provider)
        { 
            PathSegmentCollection segments = Segments; 
            return "M" +
                ((IFormattable)StartPoint).ToString(format, provider) + 
                (segments != null ? segments.ConvertToString(format, provider) : "") +
                (IsClosed ? "z" : "");
        }
 
        /// <summary>
        /// SerializeData - Serialize the contents of this Figure to the provided context. 
        /// </summary> 
        internal void SerializeData(StreamGeometryContext ctx)
        { 
            ctx.BeginFigure(StartPoint, IsFilled, IsClosed);

            PathSegmentCollection segments = Segments;
 
            int pathSegmentCount = segments == null ? 0 : segments.Count;
 
            for (int i = 0; i < pathSegmentCount; i++) 
            {
                segments.Internal_GetItem(i).SerializeData(ctx); 
            }
        }

    }
}

