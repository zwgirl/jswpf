/**
 * GeneralTransform
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable"], 
		function(declare, Type, Animatable){
	var GeneralTransform = declare("GeneralTransform", Animatable,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(GeneralTransform.prototype,{
		  
	});
	
	Object.defineProperties(GeneralTransform,{
		  
	});
	
	GeneralTransform.Type = new Type("GeneralTransform", GeneralTransform, [Animatable.Type]);
	return GeneralTransform;
});



//---------------------------------------------------------------------------- 
//
// <copyright file="GeneralTransform.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: Declaration of the GeneralTransform class. 
//
//--------------------------------------------------------------------------- 

using MS.Internal;
using System;
using System.Collections; 
using System.ComponentModel;
using System.ComponentModel.Design.Serialization; 
using System.Diagnostics; 
using System.Globalization;
using System.Reflection; 
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Permissions;
using System.Windows; 
using System.Windows.Media.Animation;
using System.Windows.Media.Composition; 
using System.Windows.Markup; 
using MS.Internal.PresentationCore;
 
namespace System.Windows.Media
{
    /// <summary>
    /// GeneralTransform class provides services to transform points and rects 
    /// </summary>
    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] 
    public abstract partial class GeneralTransform : Animatable 
    {
        /// <summary> 
        /// Transform a point
        /// </summary>
        /// <param name="inPoint">Input point</param>
        /// <param name="result">Output point</param> 
        /// <returns>True if the point was transformed successfuly, false otherwise</returns>
        public abstract bool TryTransform(Point inPoint, out Point result); 
 
        /// <summary>
        /// Transform a point 
        ///
        /// If the transformation does not succeed, this will throw an InvalidOperationException.
        /// If you don't want to try/catch, call TryTransform instead and check the boolean it
        /// returns. 
        ///
        /// Note that this method will always succeed when called on a subclass of Transform 
        /// </summary> 
        /// <param name="point">Input point</param>
        /// <returns>The transformed point</returns> 
        public Point Transform(Point point)
        {
            Point transformedPoint;
 
            if (!TryTransform(point, out transformedPoint))
            { 
                throw new InvalidOperationException(SR.Get(SRID.GeneralTransform_TransformFailed, null)); 
            }
 
            return transformedPoint;
        }

        /// <summary> 
        /// Transforms the bounding box to the smallest axis aligned bounding box
        /// that contains all the points in the original bounding box 
        /// </summary> 
        /// <param name="rect">Bounding box</param>
        /// <returns>The transformed bounding box</returns> 
        public abstract Rect TransformBounds(Rect rect);


        /// <summary> 
        /// Returns the inverse transform if it has an inverse, null otherwise
        /// </summary> 
        public abstract GeneralTransform Inverse { get; } 

        /// <summary> 
        /// Returns a best effort affine transform
        /// </summary>
        internal virtual Transform AffineTransform
        { 
            [FriendAccessAllowed] // Built into Core, also used by Framework.
            get { return null; } 
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
        public new GeneralTransform Clone()
        {
            return (GeneralTransform)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new GeneralTransform CloneCurrentValue()
        {
            return (GeneralTransform)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 

 

        #region Public Properties

 

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
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary> 
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
        internal virtual string ConvertToString(string format, IFormatProvider provider)
        {
            return base.ToString(); 
        }
 
 
        #endregion Internal Properties
 
        //-----------------------------------------------------
        //
        //  Dependency Properties
        // 
        //------------------------------------------------------
 
        #region Dependency Properties 

 

        #endregion Dependency Properties

        //----------------------------------------------------- 
        //
        //  Internal Fields 
        // 
        //------------------------------------------------------
 
        #region Internal Fields


 

 
 

        #endregion Internal Fields 



        #region Constructors 

        //------------------------------------------------------ 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------


 

        #endregion Constructors 
    }
} 


