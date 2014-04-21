/**
 * Transform
 */

define(["dojo/_base/declare", "system/Type", "media/GeneralTransform", "media/Matrix"], 
		function(declare, Type, GeneralTransform, MatrixTransform, Matrix){
	
	var MatrixTransform = null;
	function EnsureMatrixTransform(){
		if(MatrixTransform == null){
			MatrixTransform = using("media/MatrixTransform");
		}
		
		return MatrixTransform;
	}
	
	var Transform = declare("Transform", GeneralTransform,{
		constructor:function(){
		},
		
//        internal virtual bool 
        CanSerializeToString:function() { return false; },

//        internal virtual void 
        TransformRect:function(/*ref Rect*/ rectRef) 
        { 
//            /*Matrix*/var matrix = this.Value;
            var matrixRef = {"matrix" : this.Value};
            MatrixUtil.TransformRect(/*ref rect*/rectRef, matrixRef); 
            this.Value = matrixRef.matrix;
        },

        /// <summary>
        /// MultiplyValueByMatrix - result is set equal to "this" * matrixToMultiplyBy. 
        /// </summary>
        /// <param name="result"> The result is stored here. </param> 
        /// <param name="matrixToMultiplyBy"> The multiplicand. </param> 
//        internal virtual void 
        MultiplyValueByMatrix:function(/*ref Matrix result*/resultRef, /*ref Matrix matrixToMultiplyBy*/matrixToMultiplyByRef)
        { 
            result = Value;
            MatrixUtil.MultiplyMatrix(/*ref result*/resultRef, /*ref matrixToMultiplyBy*/matrixToMultiplyByRef);
        },
 
        /// <SecurityNote>
        /// Critical -- references and writes out to memory addresses. The 
        ///             caller is safe if the pointer points to a D3DMATRIX 
        ///             value.
        /// </SecurityNote> 
//        internal unsafe virtual void 
//        ConvertToD3DMATRIX:function(/* out */ D3DMATRIX* milMatrix)
//        {
//            Matrix matrix = Value; 
//            MILUtilities.ConvertToD3DMATRIX(&matrix, milMatrix);
//        },
        
      /// <summary> 
        /// Transforms a point
        /// </summary> 
        /// <param name="inPoint">Input point</param>
        /// <param name="result">Output point</param>
        /// <returns>True if the point was successfully transformed</returns>
//        public override bool 
        TryTransform:function(/*Point*/ inPoint, /*out Point result*/resultOut) 
        {
            /*Matrix*/var m = this.Value; 
            resultOut.result = m.Transform(inPoint); 
            return true;
        },

        /// <summary>
        /// Transforms the bounding box to the smallest axis aligned bounding box
        /// that contains all the points in the original bounding box 
        /// </summary>
        /// <param name="rect">Bounding box</param> 
        /// <returns>The transformed bounding box</returns> 
//        public override Rect 
        TransformBounds:function(/*Rect*/ rect)
        { 
        	var rectRef = {"rect" : rect};
            TransformRect(/*ref rect*/rectRef);
            rect = rectRef.rect;
            return rect;
        },
        
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed
        ///     version for convenience. 
        /// </summary>
//        public new Transform 
        Clone:function()
        {
            return base.Clone(); 
        },
 
        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed
        ///     version for convenience. 
        /// </summary>
//        public new Transform 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue(); 
        },
	});
	
	Object.defineProperties(Transform.prototype,{
		
		///<summary> 
        /// Return the current transformation value.
        ///</summary> 
//        public abstract Matrix 
		Value: { get:function(){} },

        ///<summary>
        /// Returns true if transformation if the transformation is definitely an identity.  There are cases where it will 
        /// return false because of computational error or presence of animations (And we're interpolating through a
        /// transient identity) -- this is intentional.  This property is used internally only.  If you need to check the 
        /// current matrix value for identity, use Transform.Value.Identity. 
        ///</summary>
//        internal abstract bool 
		IsIdentity: {get:function(){}}, 
		/// <summary> 
        /// Returns the inverse transform if it has an inverse, null otherwise 
        /// </summary>
//        public override GeneralTransform 
		Inverse: 
        {
            get:function()
            {
                this.ReadPreamble(); 

                /*Matrix*/var matrix = Value; 
 
                if (!matrix.HasInverse)
                { 
                    return null;
                }

                matrix.Invert(); 
                return new MatrixTransform(matrix);
            } 
        }, 

        /// <summary> 
        /// Returns a best effort affine transform
        /// </summary>
//        internal override Transform 
		AffineTransform:
        { 
            get:function() 
            { 
                return this;
            } 
        }  
	});
	
//    private static Transform 
	var s_identity = null; //MakeIdentityTransform();
	
	Object.defineProperties(Transform,{
        ///<summary>
        /// Identity transformation. 
        ///</summary> 
//        public static Transform 
		Identity:
        { 
            get:function()
            {
                return s_identity;
            } 
        }  
	});
	
//    private static Transform 
	function MakeIdentityTransform() 
    {
        /*Transform*/var identity = new EnsureMatrixTransform()(Matrix.Identity); 
        identity.Freeze();
        return identity;
    }
    
    /// <summary>
    /// Consolidates the common logic of obtain the value of a
    /// Transform, after checking the transform for null.
    /// </summary> 
    /// <param name="transform"> Transform to obtain value of. </param>
    /// <param name="currentTransformValue"> 
    ///     Current value of 'transform'.  Matrix.Identity if 
    ///     the 'transform' parameter is null.
    /// </param> 
//    internal static void 
    GetTransformValue = function(
        /*Transform*/ transform,
        /*out Matrix currentTransformValue*/currentTransformValueOut
        ) 
    {
        if (transform != null) 
        { 
        	currentTransformValueOut.currentTransformValue = transform.Value;
        } 
        else
        {
        	currentTransformValueOut.currentTransformValue = Matrix.Identity;
        } 
    };
    
    /// <summary> 
    /// Parse - returns an instance converted from the provided string
    /// using the current culture
    /// <param name="source"> string with Transform data </param>
    /// </summary> 
//    public static Transform 
    Parse = function(/*string*/ source)
    { 
        /*IFormatProvider*/var formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS; 

        return MS.Internal.Parsers.ParseTransform(source, formatProvider); 
    };
	
	Transform.Type = new Type("Transform", Transform, [GeneralTransform.Type]);
	return Transform;
});
