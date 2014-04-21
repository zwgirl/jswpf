/**
 * MatrixTransform
 */

define(["dojo/_base/declare", "system/Type", "media/Transform"], 
		function(declare, Type, Transform){
	var MatrixTransform = declare("MatrixTransform", Transform,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(MatrixTransform.prototype,{
		  
	});
	
	Object.defineProperties(MatrixTransform,{
		  
	});
	
	MatrixTransform.Type = new Type("MatrixTransform", MatrixTransform, [Transform.Type]);
	return MatrixTransform;
});



//------------------------------------------------------------------------------ 
//  Microsoft Avalon
//  Copyright (c) Microsoft Corporation, 2001
//
//  File:       MatrixTransform.cs 
//-----------------------------------------------------------------------------
 
using System.Windows.Media; 
using System;
using System.Windows; 
using System.ComponentModel;
using System.ComponentModel.Design.Serialization;
using System.Reflection;
using System.Security; 
using System.Security.Permissions;
using System.Collections; 
using MS.Internal; 
using MS.Internal.PresentationCore;
using System.Windows.Media.Animation; 
using System.Globalization;
using System.Text;
using System.Runtime.InteropServices;
using System.Windows.Media.Composition; 
using System.Diagnostics;
 
using SR=MS.Internal.PresentationCore.SR; 
using SRID=MS.Internal.PresentationCore.SRID;
 
namespace System.Windows.Media
{
    ///<summary>
    /// Create an arbitrary matrix transformation. 
    ///</summary>
    public sealed partial class MatrixTransform : Transform 
    { 
        #region Constructors
 
        ///<summary>
        ///
        ///</summary>
        public MatrixTransform() 
        {
        } 
 
        ///<summary>
        /// Create an arbitrary matrix transformation. 
        ///</summary>
        ///<param name="m11">Matrix value at position 1,1</param>
        ///<param name="m12">Matrix value at position 1,2</param>
        ///<param name="m21">Matrix value at position 2,1</param> 
        ///<param name="m22">Matrix value at position 2,2</param>
        ///<param name="offsetX">Matrix value at position 3,1</param> 
        ///<param name="offsetY">Matrix value at position 3,2</param> 
        public MatrixTransform(
            double m11, 
            double m12,
            double m21,
            double m22,
            double offsetX, 
            double offsetY
            ) 
        { 
            Matrix = new Matrix(m11, m12, m21, m22, offsetX, offsetY);
        } 

        ///<summary>
        /// Create a matrix transformation from constant transform.
        ///</summary> 
        ///<param name="matrix">The constant matrix transformation.</param>
        public MatrixTransform(Matrix matrix) 
        { 
            Matrix = matrix;
        } 

        #endregion

        ///<summary> 
        /// Return the current transformation value.
        ///</summary> 
        public override Matrix Value 
        {
            get 
            {
                ReadPreamble();

                return Matrix; 
            }
        } 
 
        #region Internal Methods
 
        ///<summary>
        /// Returns true if transformation matches the identity transform.
        ///</summary>
        internal override bool IsIdentity 
        {
            get 
            { 
                return Matrix.IsIdentity && CanFreeze;
            } 
        }

        internal override bool CanSerializeToString() { return CanFreeze; }
 
        /// <summary>
        /// Creates a string representation of this object based on the format string 
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns>
        /// A string representation of this object.
        /// </returns> 
        internal override string ConvertToString(string format, IFormatProvider provider)
        { 
            if (!CanSerializeToString()) 
            {
                return base.ConvertToString(format, provider); 
            }

            return ((IFormattable)Matrix).ToString(format, provider);
        } 

        internal override void TransformRect(ref Rect rect) 
        { 
            Matrix matrix = Matrix;
            MatrixUtil.TransformRect(ref rect, ref matrix); 
        }

        internal override void MultiplyValueByMatrix(ref Matrix result, ref Matrix matrixToMultiplyBy)
        { 
            result = Matrix;
            MatrixUtil.MultiplyMatrix(ref result, ref matrixToMultiplyBy); 
        } 

        #endregion Internal Methods 
        
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
        public new MatrixTransform Clone()
        {
            return (MatrixTransform)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new MatrixTransform CloneCurrentValue()
        {
            return (MatrixTransform)base.CloneCurrentValue();
        } 

 
 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void MatrixPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            MatrixTransform target = ((MatrixTransform) d);


            target.PropertyChanged(MatrixProperty); 
        }
 
 
        #region Public Properties
 
        /// <summary>
        ///     Matrix - Matrix.  Default value is new Matrix().
        /// </summary>
        public Matrix Matrix 
        {
            get 
            { 
                return (Matrix) GetValue(MatrixProperty);
            } 
            set
            {
                SetValueInternal(MatrixProperty, value);
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
            return new MatrixTransform();
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
 
                // Obtain handles for animated properties
                DUCE.ResourceHandle hMatrixAnimations = GetAnimationResourceHandle(MatrixProperty, channel); 

                // Pack & send command packet
                DUCE.MILCMD_MATRIXTRANSFORM data;
                unsafe 
                {
                    data.Type = MILCMD.MilCmdMatrixTransform; 
                    data.Handle = _duceResource.GetHandle(channel); 
                    if (hMatrixAnimations.IsNull)
                    { 
                        data.Matrix = CompositionResourceManager.MatrixToMilMatrix3x2D(Matrix);
                    }
                    data.hMatrixAnimations = hMatrixAnimations;
 
                    // Send packed command structure
                    channel.SendCommand( 
                        (byte*)&data, 
                        sizeof(DUCE.MILCMD_MATRIXTRANSFORM));
                } 
            }
        }
        internal override DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel)
        { 

                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_MATRIXTRANSFORM)) 
                { 

 
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
        //    Matrix
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
        ///     The DependencyProperty for the MatrixTransform.Matrix property. 
        /// </summary>
        public static readonly DependencyProperty MatrixProperty; 

        #endregion Dependency Properties

        //----------------------------------------------------- 
        //
        //  Internal Fields 
        // 
        //------------------------------------------------------
 
        #region Internal Fields


 
        internal System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource();
 
        internal static Matrix s_Matrix = new Matrix(); 

        #endregion Internal Fields 



        #region Constructors 

        //------------------------------------------------------ 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------

        static MatrixTransform()
        { 
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime 
            // of your app.  (Windows OS Bug #947272)
            // 


            // Initializations
            Type typeofThis = typeof(MatrixTransform); 
            MatrixProperty =
                  RegisterProperty("Matrix", 
                                   typeof(Matrix), 
                                   typeofThis,
                                   new Matrix(), 
                                   new PropertyChangedCallback(MatrixPropertyChanged),
                                   null,
                                   /* isIndependentlyAnimated  = */ true,
                                   /* coerceValueCallback */ null); 
        }
 
 

        #endregion Constructors 
    }
}

