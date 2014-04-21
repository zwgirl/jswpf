/**
 * Transform
 */

define(["dojo/_base/declare", "system/Type", "media/GeneralTransform"], 
		function(declare, Type, GeneralTransform){
	var Transform = declare("Transform", GeneralTransform,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(Transform.prototype,{
		  
	});
	
	Object.defineProperties(Transform,{
		  
	});
	
	Transform.Type = new Type("Transform", Transform, [GeneralTransform.Type]);
	return Transform;
});



/****************************************************************************\ 
*
* File: Transform.cs
*
* Description: 
* Transform.cs defines the "Transform" object, translate, rotate and scale.
* 
* Copyright (C) 2002 by Microsoft Corporation.  All rights reserved. 
*
\***************************************************************************/ 

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
    #region Transform
    ///<summary> 
    /// Transform provides a base for all types of transformations, including matrix and list type.
    ///</summary> 
    [Localizability(LocalizationCategory.None, Readability=Readability.Unreadable)] 
    public abstract partial class Transform : GeneralTransform
    { 
        internal Transform()
        {
        }
 
        ///<summary>
        /// Identity transformation. 
        ///</summary> 
        public static Transform Identity
        { 
            get
            {
                return s_identity;
            } 
        }
 
        private static Transform MakeIdentityTransform() 
        {
            Transform identity = new MatrixTransform(Matrix.Identity); 
            identity.Freeze();
            return identity;
        }
 
        private static Transform s_identity = MakeIdentityTransform();
 
        ///<summary> 
        /// Return the current transformation value.
        ///</summary> 
        public abstract Matrix Value { get; }

        ///<summary>
        /// Returns true if transformation if the transformation is definitely an identity.  There are cases where it will 
        /// return false because of computational error or presence of animations (And we're interpolating through a
        /// transient identity) -- this is intentional.  This property is used internally only.  If you need to check the 
        /// current matrix value for identity, use Transform.Value.Identity. 
        ///</summary>
        internal abstract bool IsIdentity {get;} 

        internal virtual bool CanSerializeToString() { return false; }

        #region Perf Helpers 

        internal virtual void TransformRect(ref Rect rect) 
        { 
            Matrix matrix = Value;
            MatrixUtil.TransformRect(ref rect, ref matrix); 
        }

        /// <summary>
        /// MultiplyValueByMatrix - result is set equal to "this" * matrixToMultiplyBy. 
        /// </summary>
        /// <param name="result"> The result is stored here. </param> 
        /// <param name="matrixToMultiplyBy"> The multiplicand. </param> 
        internal virtual void MultiplyValueByMatrix(ref Matrix result, ref Matrix matrixToMultiplyBy)
        { 
            result = Value;
            MatrixUtil.MultiplyMatrix(ref result, ref matrixToMultiplyBy);
        }
 
        /// <SecurityNote>
        /// Critical -- references and writes out to memory addresses. The 
        ///             caller is safe if the pointer points to a D3DMATRIX 
        ///             value.
        /// </SecurityNote> 
        [SecurityCritical]
        internal unsafe virtual void ConvertToD3DMATRIX(/* out */ D3DMATRIX* milMatrix)
        {
            Matrix matrix = Value; 
            MILUtilities.ConvertToD3DMATRIX(&matrix, milMatrix);
        } 
 
        #endregion
 
        /// <summary>
        /// Consolidates the common logic of obtain the value of a
        /// Transform, after checking the transform for null.
        /// </summary> 
        /// <param name="transform"> Transform to obtain value of. </param>
        /// <param name="currentTransformValue"> 
        ///     Current value of 'transform'.  Matrix.Identity if 
        ///     the 'transform' parameter is null.
        /// </param> 
        internal static void GetTransformValue(
            Transform transform,
            out Matrix currentTransformValue
            ) 
        {
            if (transform != null) 
            { 
                currentTransformValue = transform.Value;
            } 
            else
            {
                currentTransformValue = Matrix.Identity;
            } 
        }
 
        /// <summary> 
        /// Transforms a point
        /// </summary> 
        /// <param name="inPoint">Input point</param>
        /// <param name="result">Output point</param>
        /// <returns>True if the point was successfully transformed</returns>
        public override bool TryTransform(Point inPoint, out Point result) 
        {
            Matrix m = Value; 
            result = m.Transform(inPoint); 
            return true;
        } 

        /// <summary>
        /// Transforms the bounding box to the smallest axis aligned bounding box
        /// that contains all the points in the original bounding box 
        /// </summary>
        /// <param name="rect">Bounding box</param> 
        /// <returns>The transformed bounding box</returns> 
        public override Rect TransformBounds(Rect rect)
        { 
            TransformRect(ref rect);
            return rect;
        }
 

        /// <summary> 
        /// Returns the inverse transform if it has an inverse, null otherwise 
        /// </summary>
        public override GeneralTransform Inverse 
        {
            get
            {
                ReadPreamble(); 

                Matrix matrix = Value; 
 
                if (!matrix.HasInverse)
                { 
                    return null;
                }

                matrix.Invert(); 
                return new MatrixTransform(matrix);
            } 
        } 

        /// <summary> 
        /// Returns a best effort affine transform
        /// </summary>
        internal override Transform AffineTransform
        { 
            [FriendAccessAllowed] // Built into Core, also used by Framework.
            get 
            { 
                return this;
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
        public new Transform Clone()
        {
            return (Transform)base.Clone(); 
        }
 
        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed
        ///     version for convenience. 
        /// </summary>
        public new Transform CloneCurrentValue()
        {
            return (Transform)base.CloneCurrentValue(); 
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

 
        internal abstract DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel);
 
        /// <summary> 
        /// AddRefOnChannel
        /// </summary> 
        DUCE.ResourceHandle DUCE.IResource.AddRefOnChannel(DUCE.Channel channel)
        {
            // Reconsider the need for this lock when removing the MultiChannelResource.
            using (CompositionEngineLock.Acquire()) 
            {
                return AddRefOnChannelCore(channel); 
            } 
        }
        internal abstract void ReleaseOnChannelCore(DUCE.Channel channel); 

        /// <summary>
        /// ReleaseOnChannel
        /// </summary> 
        void DUCE.IResource.ReleaseOnChannel(DUCE.Channel channel)
        { 
            // Reconsider the need for this lock when removing the MultiChannelResource. 
            using (CompositionEngineLock.Acquire())
            { 
                ReleaseOnChannelCore(channel);
            }
        }
        internal abstract DUCE.ResourceHandle GetHandleCore(DUCE.Channel channel); 

        /// <summary> 
        /// GetHandle 
        /// </summary>
        DUCE.ResourceHandle DUCE.IResource.GetHandle(DUCE.Channel channel) 
        {
            DUCE.ResourceHandle handle;

            using (CompositionEngineLock.Acquire()) 
            {
                handle = GetHandleCore(channel); 
            } 

            return handle; 
        }
        internal abstract int GetChannelCountCore();

        /// <summary> 
        /// GetChannelCount
        /// </summary> 
        int DUCE.IResource.GetChannelCount() 
        {
            // must already be in composition lock here 
            return GetChannelCountCore();
        }
        internal abstract DUCE.Channel GetChannelCore(int index);
 
        /// <summary>
        /// GetChannel 
        /// </summary> 
        DUCE.Channel DUCE.IResource.GetChannel(int index)
        { 
            // must already be in composition lock here
            return GetChannelCore(index);
        }
 

        #endregion Internal Methods 
 
        //-----------------------------------------------------
        // 
        //  Internal Properties
        //
        //-----------------------------------------------------
 
        #region Internal Properties
 
 

        /// <summary> 
        /// Parse - returns an instance converted from the provided string
        /// using the current culture
        /// <param name="source"> string with Transform data </param>
        /// </summary> 
        public static Transform Parse(string source)
        { 
            IFormatProvider formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS; 

            return MS.Internal.Parsers.ParseTransform(source, formatProvider); 
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
    #endregion
} 

 
