/**
 * Matrix
 */
// IMPORTANT
// 
// Rules for using matrix types. 
//
//    internal enum MatrixTypes 
//    {
//        TRANSFORM_IS_IDENTITY    = 0,
//        TRANSFORM_IS_TRANSLATION = 1,
//        TRANSFORM_IS_SCALING     = 2, 
//        TRANSFORM_IS_UNKNOWN     = 4
//    } 
// 
// 1. Matrix type must be one of 0, 1, 2, 4, or 3 (for scale and translation)
// 2. Matrix types are true but not exact!  (E.G. A scale or identity transform could be marked as unknown or scale+translate.) 
// 3. Therefore read-only operations can ignore the type with one exception
//      EXCEPTION: A matrix tagged identity might have any coefficients instead of 1,0,0,1,0,0
//                 This is the (now) classic no default constructor for structs issue
// 4. Matrix._type must be maintained by mutation operations 
// 5. MS.Internal.MatrixUtil uses unsafe code to access the private members of Matrix including _type.
// 
// In Jan 2005 the matrix types were changed from being EXACT (i.e. a 
// scale matrix is always tagged as a scale and not something more
// general.)  This resulted in about a 2% speed up in matrix 
// multiplication.
//
// The special cases for matrix multiplication speed up scale*scale
// and translation*translation by 30% compared to a single "no-branch" 
// multiplication algorithm.  Matrix multiplication of two unknown
// matrices is slowed by 20% compared to the no-branch algorithm. 
// 
// windows/wcp/DevTest/Drts/MediaApi/MediaPerf.cs includes the
// simple test of matrix multiplication speed used for these results. 
define(["dojo/_base/declare", "system/Type", "system/IFormattable", "internal/MatrixTypes"], 
		function(declare, Type, IFormattable, MatrixTypes){
	
    // The hash code for a matrix is the xor of its element's hashes.
    // Since the identity matrix has 2 1's and 4 0's its hash is 0. 
//    private const int
	var c_identityHashCode = 0;
	
	///<summary> 
    /// Matrix
    ///</summary> 
//    public partial struct
	var Matrix = declare("Matrix", IFormattable,{
	    /// <summary> 
	    /// Creates a matrix of the form 
	    ///             / m11, m12, 0 \
	    ///             | m21, m22, 0 | 
	    ///             \ offsetX, offsetY, 1 /
	    /// </summary>
		constructor:function(/*double*/ m11, /*double*/ m12,
                /*double*/ m21, /*double*/ m22, 
                /*double*/ offsetX, /*double*/ offsetY)
        { 
			this._m11 = m11; 
			this._m12 = m12;
			this._m21 = m21; 
			this._m22 = m22;
			this._offsetX = offsetX;
			this._offsetY = offsetY;
			this._type = MatrixTypes.TRANSFORM_IS_UNKNOWN; 
			this._padding = 0;
			
			// We will detect EXACT identity, scale, translation or 
			// scale+translation and use special case algorithms.
			this.DeriveMatrixType(); 

		},
		 /// <summary>
        /// Append - "this" becomes this * matrix, the same as this *= matrix.
        /// </summary> 
        /// <param name="matrix"> The Matrix to append to this Matrix </param>
//        public void 
		Append:function(/*Matrix*/ matrix) 
        { 
//            this *= matrix;
        }, 

        /// <summary>
        /// Prepend - "this" becomes matrix * this, the same as this = matrix * this.
        /// </summary> 
        /// <param name="matrix"> The Matrix to prepend to this Matrix </param>
//        public void 
        Prepend:function(/*Matrix*/ matrix) 
        { 
//            this = matrix * this;
        }, 

        /// <summary>
        /// Rotates this matrix about the origin
        /// </summary> 
        /// <param name='angle'>The angle to rotate specifed in degrees</param>
//        public void 
        Rotate:function(/*double*/ angle) 
        { 
            angle %= 360.0; // Doing the modulo before converting to radians reduces total error
//            this *= CreateRotationRadians(angle * (Math.PI/180.0)); 
        },

        /// <summary>
        /// Prepends a rotation about the origin to "this" 
        /// </summary>
        /// <param name='angle'>The angle to rotate specifed in degrees</param> 
//        public void 
        RotatePrepend:function(/*double*/ angle) 
        {
            angle %= 360.0; // Doing the modulo before converting to radians reduces total error 
//            this = CreateRotationRadians(angle * (Math.PI/180.0)) * this;
        },

        /// <summary> 
        /// Rotates this matrix about the given point
        /// </summary> 
        /// <param name='angle'>The angle to rotate specifed in degrees</param> 
        /// <param name='centerX'>The centerX of rotation</param>
        /// <param name='centerY'>The centerY of rotation</param> 
//        public void 
        RotateAt:function(/*double*/ angle, /*double*/ centerX, /*double*/ centerY)
        {
            angle %= 360.0; // Doing the modulo before converting to radians reduces total error
//            this *= CreateRotationRadians(angle * (Math.PI/180.0), centerX, centerY); 
        },
 
        /// <summary> 
        /// Prepends a rotation about the given point to "this"
        /// </summary> 
        /// <param name='angle'>The angle to rotate specifed in degrees</param>
        /// <param name='centerX'>The centerX of rotation</param>
        /// <param name='centerY'>The centerY of rotation</param>
//        public void 
        RotateAtPrepend:function(/*double*/ angle, /*double*/ centerX, /*double*/ centerY) 
        {
            angle %= 360.0; // Doing the modulo before converting to radians reduces total error 
//            this = CreateRotationRadians(angle * (Math.PI/180.0), centerX, centerY) * this; 
        },
 
        /// <summary>
        /// Scales this matrix around the origin
        /// </summary>
        /// <param name='scaleX'>The scale factor in the x dimension</param> 
        /// <param name='scaleY'>The scale factor in the y dimension</param>
//        public void 
        Scale:function(/*double*/ scaleX, /*double*/ scaleY) 
        { 
//            this *= CreateScaling(scaleX, scaleY);
        }, 

        /// <summary>
        /// Prepends a scale around the origin to "this"
        /// </summary> 
        /// <param name='scaleX'>The scale factor in the x dimension</param>
        /// <param name='scaleY'>The scale factor in the y dimension</param> 
//        public void 
        ScalePrepend:function(/*double*/ scaleX, /*double*/ scaleY) 
        {
//            this = CreateScaling(scaleX, scaleY) * this; 
        },

        /// <summary>
        /// Scales this matrix around the center provided 
        /// </summary>
        /// <param name='scaleX'>The scale factor in the x dimension</param> 
        /// <param name='scaleY'>The scale factor in the y dimension</param> 
        /// <param name="centerX">The centerX about which to scale</param>
        /// <param name="centerY">The centerY about which to scale</param> 
//        public void 
        ScaleAt:function(/*double*/ scaleX, /*double*/ scaleY, /*double*/ centerX, /*double*/ centerY)
        {
//            this *= CreateScaling(scaleX, scaleY, centerX, centerY);
        }, 

        /// <summary> 
        /// Prepends a scale around the center provided to "this" 
        /// </summary>
        /// <param name='scaleX'>The scale factor in the x dimension</param> 
        /// <param name='scaleY'>The scale factor in the y dimension</param>
        /// <param name="centerX">The centerX about which to scale</param>
        /// <param name="centerY">The centerY about which to scale</param>
//        public void 
        ScaleAtPrepend:function(/*double*/ scaleX, /*double*/ scaleY, /*double*/ centerX, /*double*/ centerY) 
        {
//            this = CreateScaling(scaleX, scaleY, centerX, centerY) * this; 
        },

        /// <summary> 
        /// Skews this matrix
        /// </summary>
        /// <param name='skewX'>The skew angle in the x dimension in degrees</param>
        /// <param name='skewY'>The skew angle in the y dimension in degrees</param> 
//        public void 
        Skew:function(/*double*/ skewX, /*double*/ skewY)
        { 
            skewX %= 360; 
            skewY %= 360;
//            this *= CreateSkewRadians(skewX * (Math.PI/180.0), 
//                                      skewY * (Math.PI/180.0));
        },

        /// <summary> 
        /// Prepends a skew to this matrix
        /// </summary> 
        /// <param name='skewX'>The skew angle in the x dimension in degrees</param> 
        /// <param name='skewY'>The skew angle in the y dimension in degrees</param>
//        public void 
        SkewPrepend:function(/*double*/ skewX, /*double*/ skewY) 
        {
            skewX %= 360;
            skewY %= 360;
//            this = CreateSkewRadians(skewX * (Math.PI/180.0), 
//                                     skewY * (Math.PI/180.0)) * this;
        }, 
 
        /// <summary>
        /// Translates this matrix 
        /// </summary>
        /// <param name='offsetX'>The offset in the x dimension</param>
        /// <param name='offsetY'>The offset in the y dimension</param>
//        public void 
        Translate:function(/*double*/ offsetX, /*double*/ offsetY) 
        {
            // 
            // / a b 0 \   / 1 0 0 \    / a      b       0 \ 
            // | c d 0 | * | 0 1 0 | = |  c      d       0 |
            // \ e f 1 /   \ x y 1 /    \ e+x    f+y     1 / 
            //
            // (where e = _offsetX and f == _offsetY)
            //
 
            if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
            { 
                // Values would be incorrect if matrix was created using default constructor. 
                // or if SetIdentity was called on a matrix which had values.
                // 
                SetMatrix(1, 0,
                          0, 1,
                          offsetX, offsetY,
                          MatrixTypes.TRANSFORM_IS_TRANSLATION); 
            }
            else if (this._type == MatrixTypes.TRANSFORM_IS_UNKNOWN) 
            { 
            	this._offsetX += offsetX;
            	this._offsetY += offsetY; 
            }
            else
            {
            	this._offsetX += offsetX; 
            	this._offsetY += offsetY;
 
                // If matrix wasn't unknown we added a translation 
            	this._type |= MatrixTypes.TRANSFORM_IS_TRANSLATION;
            } 

            Debug_CheckType();
        },
 
        /// <summary>
        /// Prepends a translation to this matrix 
        /// </summary> 
        /// <param name='offsetX'>The offset in the x dimension</param>
        /// <param name='offsetY'>The offset in the y dimension</param> 
//        public void 
        TranslatePrepend:function(/*double*/ offsetX, /*double*/ offsetY)
        {
//            this = CreateTranslation(offsetX, offsetY) * this;
        },
        
        
        /// <summary>
        /// Transform - returns the result of transforming the point by this matrix
        /// </summary>
        /// <returns> 
        /// The transformed point
        /// </returns> 
        /// <param name="point"> The Point to transform </param> 
//        public Point 
        Transform:function(/*Point*/ point)
        { 
            var newPoint = point;
            var xRef = {"x" : newPoint._x};
            var yRef = {"y" : newPoint._y};
            
            MultiplyPoint(/*ref newPoint._x*/xRef, /*ref newPoint._y*/yRef);
            newPoint._x = xRef.x;
            newPoint._y = xRef.y;
            return newPoint;
        }, 

        /// <summary> 
        /// Transform - Transforms each point in the array by this matrix 
        /// </summary>
        /// <param name="points"> The Point array to transform </param> 
//        public void 
        Transform:function(/*Point[]*/ points)
        {
            if (points != null)
            { 
                for (var i = 0; i < points.length; i++)
                { 
                    var xRef = {"x" : points[i]._x};
                    var yRef = {"y" : points[i]._y};
                    MultiplyPoint(/*ref points[i]._x*/xRef, /*ref points[i]._y*/yRef); 
                    points[i]._x = xRef.x;
                    points[i]._y = xRef.y;
                }
            } 
        },

        /// <summary>
        /// Transform - returns the result of transforming the Vector by this matrix. 
        /// </summary>
        /// <returns> 
        /// The transformed vector 
        /// </returns>
        /// <param name="vector"> The Vector to transform </param> 
//        public Vector 
        Transform:function(/*Vector*/ vector)
        {
            /*Vector*/var newVector = vector;
            var xRef = {"x" : newVector._x};
            var yRef = {"y" : newVector._y};
            MultiplyVector(/*ref newVector._x*/xRef, /*ref newVector._y*/yRef); 
            newVector._x = xRef.x;
            newVector._y = xRef.y;
            return newVector;
        }, 
 
        /// <summary>
        /// Transform - Transforms each Vector in the array by this matrix. 
        /// </summary>
        /// <param name="vectors"> The Vector array to transform </param>
//        public void 
        Transform:function(/*Vector[]*/ vectors)
        { 
            if (vectors != null)
            { 
                for (var i = 0; i < vectors.length; i++) 
                {
                    var xRef = {"x" : vectors[i]._x};
                    var yRef = {"y" : vectors[i]._y};
                    MultiplyVector(/*ref vectors[i]._x*/xRef, /*ref vectors[i]._y*/yRef); 
                    vectors[i]._x = xRef.x;
                    vectors[i]._y = xRef.y;
                }
            }
        },
        /// <summary>
        /// Replaces matrix with the inverse of the transformation.  This will throw an InvalidOperationException 
        /// if !HasInverse 
        /// </summary>
        /// <exception cref="InvalidOperationException"> 
        /// This will throw an InvalidOperationException if the matrix is non-invertable
        /// </exception>
//        public void 
        Invert:function()
        { 
            var determinant = this.Determinant;
 
            if (DoubleUtil.IsZero(determinant)) 
            {
                throw new System.InvalidOperationException(SR.Get(SRID.Transform_NotInvertible)); 
            }

            // Inversion does not change the type of a matrix.
            switch (this._type) 
            {
            case MatrixTypes.TRANSFORM_IS_IDENTITY: 
                break; 
            case MatrixTypes.TRANSFORM_IS_SCALING:
                { 
            		this._m11 = 1.0 / this._m11;
            		this._m22 = 1.0 / this._m22;
                }
                break; 
            case MatrixTypes.TRANSFORM_IS_TRANSLATION:
            	this._offsetX = -this._offsetX; 
            	this._offsetY = -this._offsetY; 
                break;
            case MatrixTypes.TRANSFORM_IS_SCALING | MatrixTypes.TRANSFORM_IS_TRANSLATION: 
                {
            		this._m11 = 1.0 / this._m11;
            		this._m22 = 1.0 / this._m22;
            		this._offsetX = -this._offsetX * this._m11; 
            		this._offsetY = -this._offsetY * this._m22;
                } 
                break; 
            default:
                { 
            		var invdet = 1.0/determinant;
                    SetMatrix(this._m22 * invdet,
                              -this._m12 * invdet,
                              -this._m21 * invdet, 
                              this._m11 * invdet,
                              (this._m21 * this._offsetY - this._offsetX * this._m22) * invdet, 
                              (this._offsetX * this._m12 - this._m11 * this._offsetY) * invdet, 
                              MatrixTypes.TRANSFORM_IS_UNKNOWN);
                } 
                break;
            }
        },
        /// <summary> 
        /// MultiplyVector 
        /// </summary>
//        internal void 
        MultiplyVector:function(/*ref double x*/xRef, /*ref double y*/yRef) 
        {
            switch (this._type)
            {
            case MatrixTypes.TRANSFORM_IS_IDENTITY: 
            case MatrixTypes.TRANSFORM_IS_TRANSLATION:
                return; 
            case MatrixTypes.TRANSFORM_IS_SCALING: 
            case MatrixTypes.TRANSFORM_IS_SCALING | MatrixTypes.TRANSFORM_IS_TRANSLATION:
            	xRef.x *= this._m11; 
            	yRef.y *= this._m22;
                break;
            default:
            	var xadd = yRef.y * this._m21; 
                var yadd = xRef.x * this._m12;
                xRef.x *= this._m11; 
                xRef.x += xadd; 
                yRef.y *= this._m22;
                yRef.y += yadd; 
                break;
            }
        },
 
        /// <summary>
        /// MultiplyPoint 
        /// </summary> 
//        internal void 
        MultiplyPoint:function(/*ref double x*/xRef, /*ref double y*/yRef)
        { 
            switch (this._type)
            {
            case MatrixTypes.TRANSFORM_IS_IDENTITY:
                return; 
            case MatrixTypes.TRANSFORM_IS_TRANSLATION:
            	xRef.x += this._offsetX; 
            	yRef.y += this._offsetY; 
                return;
            case MatrixTypes.TRANSFORM_IS_SCALING: 
            	xRef.x *= this._m11;
            	yRef.y *= this._m22;
                return;
            case MatrixTypes.TRANSFORM_IS_SCALING | MatrixTypes.TRANSFORM_IS_TRANSLATION: 
            	xRef.x *= this._m11;
            	xRef.x += this._offsetX; 
            	yRef.y *= this._m22; 
            	yRef.y += this._offsetY;
                break; 
            default:
                var xadd = yRef.y * this._m21 + this._offsetX;
            var yadd = xRef.x * this._m12 + this._offsetY;
            	xRef.x *= this._m11; 
            	xRef.x += xadd;
            	yRef.y *= this._m22; 
            	yRef.y += yadd; 
                break;
            } 
        },
        
        ///<summary>
        /// Sets the transform to
        ///             / m11, m12, 0 \ 
        ///             | m21, m22, 0 |
        ///             \ offsetX, offsetY, 1 / 
        /// where offsetX, offsetY is the translation. 
        ///</summary>
//        private void 
        SetMatrix:function(/*double*/ m11, /*double*/ m12, 
                               /*double*/ m21, /*double*/ m22,
                               /*double*/ offsetX, /*double*/ offsetY,
                               /*MatrixTypes*/ type)
        { 
            this._m11 = m11;
            this._m12 = m12; 
            this._m21 = m21; 
            this._m22 = m22;
            this._offsetX = offsetX; 
            this._offsetY = offsetY;
            this._type = type;
        },
 
        /// <summary>
        /// Set the type of the matrix based on its current contents 
        /// </summary> 
//        private void 
        DeriveMatrixType:function()
        { 
            this._type = 0;

            // Now classify our matrix.
            if (!(this._m21 == 0 && this._m12 == 0)) 
            {
            	this._type = MatrixTypes.TRANSFORM_IS_UNKNOWN; 
                return; 
            }
 
            if (!(this._m11 == 1 && this._m22 == 1))
            {
            	this._type = MatrixTypes.TRANSFORM_IS_SCALING;
            } 

            if (!(this._offsetX == 0 && this._offsetY == 0)) 
            { 
            	this._type |= MatrixTypes.TRANSFORM_IS_TRANSLATION;
            } 

            if (0 == (this._type & (MatrixTypes.TRANSFORM_IS_TRANSLATION | MatrixTypes.TRANSFORM_IS_SCALING)))
            {
                // We have an identity matrix. 
            	this._type = MatrixTypes.TRANSFORM_IS_IDENTITY;
            } 
            return; 
        },
 
        /// <summary>
        /// Asserts that the matrix tag is one of the valid options and
        /// that coefficients are correct.
        /// </summary> 
//        private void 
//        Debug_CheckType:function() 
//        { 
//            switch(this._type)
//            { 
//            case MatrixTypes.TRANSFORM_IS_IDENTITY:
//                return;
//            case MatrixTypes.TRANSFORM_IS_UNKNOWN:
//                return; 
//            case MatrixTypes.TRANSFORM_IS_SCALING:
//                Debug.Assert(_m21 == 0); 
//                Debug.Assert(_m12 == 0); 
//                Debug.Assert(_offsetX == 0);
//                Debug.Assert(_offsetY == 0); 
//                return;
//            case MatrixTypes.TRANSFORM_IS_TRANSLATION:
//                Debug.Assert(_m21 == 0);
//                Debug.Assert(_m12 == 0); 
//                Debug.Assert(_m11 == 1);
//                Debug.Assert(_m22 == 1); 
//                return; 
//            case MatrixTypes.TRANSFORM_IS_SCALING|MatrixTypes.TRANSFORM_IS_TRANSLATION:
//                Debug.Assert(_m21 == 0); 
//                Debug.Assert(_m12 == 0);
//                return;
//            default:
//                Debug.Assert(false); 
//                return;
//            } 
//        },

        /// <summary> 
        /// Equals - compares this Matrix with the passed in object.  In this equality 
        /// Double.NaN is equal to itself, unlike in numeric equality.
        /// Note that double values can acquire error when operated upon, such that 
        /// an exact comparison between two values which
        /// are logically equal may fail.
        /// </summary>
        /// <returns> 
        /// bool - true if the object is an instance of Matrix and if it's equal to "this".
        /// </returns> 
        /// <param name='o'>The object to compare to "this"</param> 
//        public override bool 
        Equals:function(/*object*/ o)
        { 
        	if ((null == o) || !(o instanceof Matrix))
        	{
        		return false;
        	} 

        	/*Matrix*/var value = o; 
        	return Matrix.Equals(this,value); 
 	    },
        
        /// <summary> 
        /// Returns the HashCode for this Matrix
        /// </summary> 
        /// <returns>
        /// int - the HashCode for this Matrix
        /// </returns>
//        public override int 
        GetHashCode:function() 
        {
        	if (this.IsDistinguishedIdentity) 
        	{ 
        		return c_identityHashCode;
        	}else
  	        {
        		// Perform field-by-field XOR of HashCodes
        		return this.M11.GetHashCode() ^ 
        		this.M12.GetHashCode() ^
	        		this.M21.GetHashCode() ^ 
	        		this.M22.GetHashCode() ^ 
	        		this.OffsetX.GetHashCode() ^
	        		this.OffsetY.GetHashCode(); 
  	        }
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
        	
        	// Delegate to the internal method which implements all ToString calls.
        	return this.ConvertToString(null /* format string */, null /* format provider */);
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
//        	
//	        // Delegate to the internal method which implements all ToString calls. 
//        	return ConvertToString(null /* format string */, provider); 
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
//        	
//        	// Delegate to the internal method which implements all ToString calls. 
//        	return ConvertToString(format, provider);
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
//        internal string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider)
        { 
        	if (IsIdentity)
        	{
        		return "Identity";
        	} 

        	// Helper to get the numeric list separator for a given culture. 
        	var separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider); 
        	return String.Format(provider,
                             "{1:" + format + "}{0}{2:" + format + "}{0}{3:" + format + "}{0}{4:" + format + "}{0}{5:" + format + "}{0}{6:" + format + "}", 
                             separator,
                             this._m11,
                             this._m12,
                             this._m21, 
                             this._m22,
                             this._offsetX, 
                             this._offsetY); 
        },
        
        /// <summary> 
        /// Sets the matrix to identity.
        /// </summary>
//        public void 
        SetIdentity:function()
        { 
            this._type = MatrixTypes.TRANSFORM_IS_IDENTITY;
        } 
        
	});
	
	Object.defineProperties(Matrix.prototype,{

        /// <summary>
        /// Tests whether or not a given transform is an identity transform 
        /// </summary>
//        public bool 
		IsIdentity:
        {
            get:function() 
            {
                return (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY || 
                        (this._m11 == 1 && this._m12 == 0 && this._m21 == 0 && this._m22 == 1 && this._offsetX == 0 && this._offsetY == 0)); 
            }
        },
        
        /// <summary> 
        /// The determinant of this matrix
        /// </summary>
//        public double 
        Determinant:
        { 
            get:function()
            { 
                switch (this._type) 
                {
                case MatrixTypes.TRANSFORM_IS_IDENTITY: 
                case MatrixTypes.TRANSFORM_IS_TRANSLATION:
                    return 1.0;
                case MatrixTypes.TRANSFORM_IS_SCALING:
                case MatrixTypes.TRANSFORM_IS_SCALING | MatrixTypes.TRANSFORM_IS_TRANSLATION: 
                    return(this._m11  * this._m22);
                default: 
                    return(this._m11  * this._m22) - (this._m12 * this._m21); 
                }
            } 
        },

        /// <summary>
        /// HasInverse Property - returns true if this matrix is invertable, false otherwise. 
        /// </summary>
//        public bool 
        HasInverse: 
        { 
            get:function()
            { 
                return !DoubleUtil.IsZero(this.Determinant);
            }
        },
        
        /// <summary> 
        /// M11
        /// </summary>
//        public double 
        M11:
        { 
            get:function()
            { 
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY) 
                {
                    return 1.0; 
                }
                else
                {
                    return this._m11; 
                }
            }, 
            set:function(value)
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY) 
                {
                    SetMatrix(value, 0,
                              0, 1,
                              0, 0, 
                              MatrixTypes.TRANSFORM_IS_SCALING);
                } 
                else 
                {
                	this._m11 = value; 
                    if (this._type != MatrixTypes.TRANSFORM_IS_UNKNOWN)
                    {
                    	this._type |= MatrixTypes.TRANSFORM_IS_SCALING;
                    } 
                }
            } 
        }, 

        /// <summary> 
        /// M12
        /// </summary>
//        public double 
        M12:
        { 
            get:function()
            { 
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY) 
                {
                    return 0; 
                }
                else
                {
                    return this._m12; 
                }
            }, 
            set:function(value)
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY) 
                {
                    SetMatrix(1, value,
                              0, 1,
                              0, 0, 
                              MatrixTypes.TRANSFORM_IS_UNKNOWN);
                } 
                else 
                {
                	this._m12 = value; 
                	this._type = MatrixTypes.TRANSFORM_IS_UNKNOWN;
                }
            }
        },

        /// <summary> 
        /// M22 
        /// </summary>
//        public double 
        M21: 
        {
            get:function()
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY) 
                {
                    return 0; 
                } 
                else
                { 
                    return this._m21;
                }
            }, 
            set:function(value)
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY) 
                { 
                    SetMatrix(1, 0,
                              value, 1, 
                              0, 0,
                              MatrixTypes.TRANSFORM_IS_UNKNOWN);
                }
                else 
                {
                	this._m21 = value; 
                	this._type = MatrixTypes.TRANSFORM_IS_UNKNOWN; 
                }
            } 
        },

        /// <summary>
        /// M22 
        /// </summary>
//        public double 
        M22: 
        { 
            get:function()
            { 
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
                {
                    return 1.0;
                } 
                else
                { 
                    return this._m22; 
                }
            }, 
            set:function(value)
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
                { 
                    SetMatrix(1, 0,
                              0, value, 
                              0, 0, 
                              MatrixTypes.TRANSFORM_IS_SCALING);
                } 
                else
                {
                	this._m22 = value;
                    if (this._type != MatrixTypes.TRANSFORM_IS_UNKNOWN) 
                    {
                    	this._type |= MatrixTypes.TRANSFORM_IS_SCALING; 
                    } 
                }
            } 
        },

        /// <summary>
        /// OffsetX 
        /// </summary>
//        public double 
        OffsetX: 
        { 
            get:function()
            { 
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
                {
                    return 0;
                } 
                else
                { 
                    return this._offsetX; 
                }
            }, 
            set:function(value)
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
                { 
                    SetMatrix(1, 0,
                              0, 1, 
                              value, 0, 
                              MatrixTypes.TRANSFORM_IS_TRANSLATION);
                } 
                else
                {
                	this._offsetX = value;
                    if (this._type != MatrixTypes.TRANSFORM_IS_UNKNOWN) 
                    {
                    	this._type |= MatrixTypes.TRANSFORM_IS_TRANSLATION; 
                    } 
                }
            } 
        },

        /// <summary>
        /// OffsetY 
        /// </summary>
//        public double 
        OffsetY: 
        { 
            get:function()
            { 
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
                {
                    return 0;
                } 
                else
                { 
                    return this._offsetY; 
                }
            }, 
            set:function(value)
            {
                if (this._type == MatrixTypes.TRANSFORM_IS_IDENTITY)
                { 
                    SetMatrix(1, 0,
                              0, 1, 
                              0, value, 
                              MatrixTypes.TRANSFORM_IS_TRANSLATION);
                } 
                else
                {
                	this._offsetY = value;
                    if (this._type != MatrixTypes.TRANSFORM_IS_UNKNOWN) 
                    {
                    	this._type |= MatrixTypes.TRANSFORM_IS_TRANSLATION; 
                    } 
                }
            } 
        },
        
        /// <summary> 
        /// Efficient but conservative test for identity.  Returns
        /// true if the the matrix is identity.  If it returns false 
        /// the matrix may still be identity. 
        /// </summary>
//        private bool 
        IsDistinguishedIdentity: 
        {
            get:function()
            {
                return this._type == MatrixTypes.TRANSFORM_IS_IDENTITY; 
            }
        } 
	});
	
    // the transform is identity by default 
    // Actually fill in the fields - some (internal) code uses the fields directly for perf.
//    private static Matrix 
	var s_identity = CreateIdentity();
	
	Object.defineProperties(Matrix,{
		/// <summary> 
        /// Identity
        /// </summary> 
//        public static Matrix 
		Identity:
        {
            get:function()
            { 
                return s_identity;
            } 
        }   
	});
    /// <summary> 
    /// Multiply 
    /// </summary>
//    public static Matrix 
	Multiply = function(/*Matrix*/ trans1, /*Matrix*/ trans2) 
    {
		var trans1Ref = {"trans1" : trans1};
		var trans2Ref = {"trans2" : trans2};
        MatrixUtil.MultiplyMatrix(/*ref trans1*/trans1Ref, /*ref trans2*/trans2Ref);
//        trans1.Debug_CheckType();
        trans1 =trans1Ref.trans1; 
        return trans1; 
    };
    
    /// <summary>
    /// Creates a rotation transformation about the given point 
    /// </summary>
    /// <param name='angle'>The angle to rotate specifed in radians</param> 
//    internal static Matrix 
	Matrix.CreateRotationRadians = function(/*double*/ angle) 
    {
        return CreateRotationRadians(angle, /* centerX = */ 0, /* centerY = */ 0); 
    };

    /// <summary>
    /// Creates a rotation transformation about the given point 
    /// </summary>
    /// <param name='angle'>The angle to rotate specifed in radians</param> 
    /// <param name='centerX'>The centerX of rotation</param> 
    /// <param name='centerY'>The centerY of rotation</param>
//    internal static Matrix 
    Matrix.CreateRotationRadians = function(/*double*/ angle, /*double*/ centerX, /*double*/ centerY) 
    {
        var matrix = new Matrix();

        var sin = Math.sin(angle); 
        var cos = Math.cos(angle);
        var dx    = (centerX * (1.0 - cos)) + (centerY * sin); 
        var dy    = (centerY * (1.0 - cos)) - (centerX * sin); 

        matrix.SetMatrix( cos, sin, 
                          -sin, cos,
                          dx,    dy,
                          MatrixTypes.TRANSFORM_IS_UNKNOWN);

        return matrix;
    }; 

    /// <summary>
    /// Creates a scaling transform around the given point 
    /// </summary>
    /// <param name='scaleX'>The scale factor in the x dimension</param>
    /// <param name='scaleY'>The scale factor in the y dimension</param>
    /// <param name='centerX'>The centerX of scaling</param> 
    /// <param name='centerY'>The centerY of scaling</param>
//    internal static Matrix 
    Matrix.CreateScaling = function(/*double*/ scaleX, /*double*/ scaleY, /*double*/ centerX, /*double*/ centerY) 
    { 
        var matrix = new Matrix();

        matrix.SetMatrix(scaleX,  0,
                         0, scaleY,
                         centerX - scaleX*centerX, centerY - scaleY*centerY,
                         MatrixTypes.TRANSFORM_IS_SCALING | MatrixTypes.TRANSFORM_IS_TRANSLATION); 

        return matrix; 
    }; 

    /// <summary> 
    /// Creates a scaling transform around the origin
    /// </summary>
    /// <param name='scaleX'>The scale factor in the x dimension</param>
    /// <param name='scaleY'>The scale factor in the y dimension</param> 
//    internal static Matrix 
    Matrix.CreateScaling = function(/*double*/ scaleX, /*double*/ scaleY)
    { 
        var matrix = new Matrix(); 
        matrix.SetMatrix(scaleX,  0,
                         0, scaleY, 
                         0, 0,
                         MatrixTypes.TRANSFORM_IS_SCALING);
        return matrix;
    }; 

    /// <summary> 
    /// Creates a skew transform 
    /// </summary>
    /// <param name='skewX'>The skew angle in the x dimension in degrees</param> 
    /// <param name='skewY'>The skew angle in the y dimension in degrees</param>
//    internal static Matrix 
    Matrix.CreateSkewRadians = function(/*double*/ skewX, /*double*/ skewY)
    {
        var matrix = new Matrix(); 

        matrix.SetMatrix(1.0,  Math.Tan(skewY), 
                         Math.Tan(skewX), 1.0, 
                         0.0, 0.0,
                         MatrixTypes.TRANSFORM_IS_UNKNOWN); 

        return matrix;
    };

    /// <summary>
    /// Sets the transformation to the given translation specified by the offset vector. 
    /// </summary> 
    /// <param name='offsetX'>The offset in X</param>
    /// <param name='offsetY'>The offset in Y</param> 
//    internal static Matrix 
    Matrix.CreateTranslation = function(/*double*/ offsetX, /*double*/ offsetY)
    {
        var matrix = new Matrix();

        matrix.SetMatrix(1, 0,
                         0, 1, 
                         offsetX, offsetY, 
                         MatrixTypes.TRANSFORM_IS_TRANSLATION);

        return matrix;
    };
    
    /// <summary> 
    /// Sets the transformation to the identity.
    /// </summary> 
//    private static Matrix 
    function CreateIdentity()
    {
        var matrix = new Matrix();
        matrix.SetMatrix(1, 0, 
                         0, 1,
                         0, 0, 
                         MatrixTypes.TRANSFORM_IS_IDENTITY); 
        return matrix;
    } 
    
    /// <summary> 
  	/// Compares two Matrix instances for object equality.  In this equality
    /// Double.NaN is equal to itself, unlike in numeric equality. 
    /// Note that double values can acquire error when operated upon, such that 
    /// an exact comparison between two values which
    /// are logically equal may fail. 
    /// </summary>
    /// <returns>
    /// bool - true if the two Matrix instances are exactly equal, false otherwise
    /// </returns> 
    /// <param name='matrix1'>The first Matrix to compare</param>
    /// <param name='matrix2'>The second Matrix to compare</param> 
//    public static bool 
    Matrix.Equals = function(/*Matrix*/ matrix1, /*Matrix*/ matrix2) 
    {
    	if (matrix1.IsDistinguishedIdentity || matrix2.IsDistinguishedIdentity) 
    	{
    		return matrix1.IsIdentity == matrix2.IsIdentity;
    	}
    	else 
    	{
    		return matrix1.M11.Equals(matrix2.M11) && 
                 	matrix1.M12.Equals(matrix2.M12) && 
                 	matrix1.M21.Equals(matrix2.M21) &&
                 	matrix1.M22.Equals(matrix2.M22) && 
                 	matrix1.OffsetX.Equals(matrix2.OffsetX) &&
                 	matrix1.OffsetY.Equals(matrix2.OffsetY);
    	}
    }
    
    /// <summary> 
    /// Parse - returns an instance converted from the provided string using
    /// the culture "en-US" 
    /// <param name="source"> string with Matrix data </param> 
    /// </summary>
//    public static Matrix 
    Matrix.Parse = function(/*string*/ source) 
    {
        /*IFormatProvider*/var formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS;

        /*TokenizerHelper*/var th = new TokenizerHelper(source, formatProvider); 

        /*Matrix*/var value; 

        /*String*/var firstToken = th.NextTokenRequired();

        // The token will already have had whitespace trimmed so we can do a
        // simple string compare.
        if (firstToken == "Identity")
        { 
            value = Identity;
        } 
        else 
        {
            value = new Matrix( 
                Convert.ToDouble(firstToken, formatProvider),
                Convert.ToDouble(th.NextTokenRequired(), formatProvider),
                Convert.ToDouble(th.NextTokenRequired(), formatProvider),
                Convert.ToDouble(th.NextTokenRequired(), formatProvider), 
                Convert.ToDouble(th.NextTokenRequired(), formatProvider),
                Convert.ToDouble(th.NextTokenRequired(), formatProvider)); 
        } 

        // There should be no more tokens in this string. 
        th.LastTokenRequired();

        return value;
    };
 
	
	Matrix.Type = new Type("Matrix", Matrix, [IFormattable.Type]);
	return Matrix;
});



 
//        internal double _m11;
//        internal double _m12; 
//        internal double _m21; 
//        internal double _m22;
//        internal double _offsetX; 
//        internal double _offsetY;
//        internal MatrixTypes _type;
//
//        // Matrix in blt'd to unmanaged code, so this is padding 
//        // to align structure. 
//        //
//        // ToDo: [....], Validate that this blt will work on 64-bit 
//        //
//        internal Int32 _padding;



