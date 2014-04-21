/**
 * MatrixTransform
 */

define(["dojo/_base/declare", "system/Type", "media/Transform", "animation/Animatable"], 
		function(declare, Type, Transform){
	var MatrixTransform = declare("MatrixTransform", Transform,{
		constructor:function(/*double*/ m11, 
	            /*double*/ m12,
	            /*double*/ m21,
	            /*double*/ m22,
	            /*double*/ offsetX, 
	            /*double*/ offsetY){
			if(arguments.length == 6){
				this.Matrix = new Matrix(m11, m12, m21, m22, offsetX, offsetY);
			}else if(arguments.length == 1){
				this.Matrix = m11;
			}
			
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
            return this.Matrix.ToString(format, provider);
        }, 

//        internal override void 
        TransformRect:function(/*ref Rect */rectRef) 
        { 
            var matrix = this.Matrix;
            MatrixUtil.TransformRect(/*ref rect*/rectRef, /*ref matrix*/matrixRef); 
        },

//        internal override void 
        MultiplyValueByMatrix:function(/*ref Matrix */resultRef, /*ref Matrix matrixToMultiplyBy*/matrixToMultiplyByRef)
        { 
        	resultRef.result = Matrix;
            MatrixUtil.MultiplyMatrix(/*ref result*/resultRef, /*ref matrixToMultiplyBy*/matrixToMultiplyByRef); 
        },
        
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function()
        { 
            return new MatrixTransform();
        } 

	});
	
	Object.defineProperties(MatrixTransform.prototype,{
        ///<summary> 
        /// Return the current transformation value.
        ///</summary> 
//        public override Matrix 
		Value: 
        {
            get:function()  
            {
            	this.ReadPreamble();

                return this.Matrix; 
            }
        }, 
 
        ///<summary>
        /// Returns true if transformation matches the identity transform.
        ///</summary>
//        internal override bool 
        IsIdentity: 
        {
            get:function() 
            { 
                return Matrix.IsIdentity && this.CanFreeze;
            } 
        },
        /// <summary>
        ///     Matrix - Matrix.  Default value is new Matrix().
        /// </summary>
//        public Matrix 
        Matrix:
        {
            get:function() 
            { 
                return this.GetValue(MatrixTransform.MatrixProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(MatrixTransform.MatrixProperty, value);
            } 
        }
	});
	
	Object.defineProperties(MatrixTransform,{
		  
	});
	
//	private static void 
	function MatrixPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{ 
//	    MatrixTransform target = ((MatrixTransform) d);
	    d.PropertyChanged(MatrixTransform.MatrixProperty); 
	}
	
//    internal static Matrix 
	var s_Matrix = new Matrix(); 

//    static MatrixTransform()
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272)
        // 
    	MatrixTransform.MatrixProperty =
    		Animatable.RegisterProperty("Matrix", 
                               Matrix.Type, 
                               MatrixTransform.Type,
                               new Matrix(), 
                               new PropertyChangedCallback(null, MatrixPropertyChanged),
                               null,
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
    }
	
	MatrixTransform.Type = new Type("MatrixTransform", MatrixTransform, [Transform.Type]);
	Initialize();
	
	return MatrixTransform;
});
