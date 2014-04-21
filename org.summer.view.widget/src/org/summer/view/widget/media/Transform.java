package org.summer.view.widget.media;

import org.summer.view.widget.Point;
import org.summer.view.widget.Rect;

///<summary> 
    /// Transform provides a base for all types of transformations, including matrix and list type.
    ///</summary> 
//    [Localizability(LocalizationCategory.None, Readability=Readability.Unreadable)] 
    public abstract /*partial*/ class Transform extends GeneralTransform
    { 
        /*internal*/ public Transform()
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
        /*internal*/ public abstract boolean IsIdentity {get;} 

        /*internal*/ public /*virtual*/ boolean CanSerializeToString() { return false; }

//        #region Perf Helpers 

        /*internal*/ public /*virtual*/ void TransformRect(/*ref*/ Rect rect) 
        { 
            Matrix matrix = Value;
            MatrixUtil.TransformRect(/*ref*/ rect, /*ref*/ matrix); 
        }

        /// <summary>
        /// MultiplyValueByMatrix - result is set equal to "this" * matrixToMultiplyBy. 
        /// </summary>
        /// <param name="result"> The result is stored here. </param> 
        /// <param name="matrixToMultiplyBy"> The multiplicand. </param> 
        /*internal*/ public virtual void MultiplyValueByMatrix(/*ref*/ Matrix result, /*ref*/ Matrix matrixToMultiplyBy)
        { 
            result = Value;
            MatrixUtil.MultiplyMatrix(ref result, ref matrixToMultiplyBy);
        }
 
        /// <SecurityNote>
        /// Critical -- references and writes out to memory addresses. The 
        ///             caller is safe if the pointer points to a D3DMATRIX 
        ///             value.
        /// </SecurityNote> 
//        [SecurityCritical]
        /*internal*/ public /*unsafe*/ /*virtual*/ void ConvertToD3DMATRIX(/* out */ D3DMATRIX* milMatrix)
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
        /*internal*/ public static void GetTransformValue(
            Transform transform,
            /*out*/ Matrix currentTransformValue
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
        public /*override*/ boolean TryTransform(Point inPoint, /*out*/ Point result) 
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
        public /*override*/ Rect TransformBounds(Rect rect)
        { 
            TransformRect(ref rect);
            return rect;
        }
 

        /// <summary> 
        /// Returns the inverse transform if it has an inverse, null otherwise 
        /// </summary>
        public /*override*/ GeneralTransform Inverse 
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
        /*internal*/ public /*override*/ Transform AffineTransform
        { 
//            [FriendAccessAllowed] // Built into Core, also used by Framework.
            get 
            { 
                return this;
            } 
        }
    }