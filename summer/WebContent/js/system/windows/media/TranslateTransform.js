/**
 * TranslateTransform
 */

define(["dojo/_base/declare", "system/Type", "media/Transform"], 
		function(declare, Type, Transform){
	var TranslateTransform = declare("TranslateTransform", Transform,{
		constructor:function(
	            /*double*/ offsetX,
	            /*double*/ offsetY){
			
			if(offsetX === undefined){
				offsetX = 0;
			}
			if(offsetY === undefined){
				offsetY = 0;
			}
			
            this.X = offsetX; 
            this.Y = offsetY;
		},
        
//        internal override void 
		TransformRect:function(/*ref Rect*/ rect)
        { 
            if (!rect.IsEmpty) 
            {
                rect.Offset(X, Y); 
            }
        },

        /// <summary> 
        /// MultiplyValueByMatrix - result is set equal to "this" * matrixToMultiplyBy.
        /// </summary> 
        /// <param name="result"> The result is stored here. </param> 
        /// <param name="matrixToMultiplyBy"> The multiplicand. </param>
//        internal override void 
        MultiplyValueByMatrix:function(/*ref Matrix result*/resultRef, /*ref Matrix matrixToMultiplyBy*/matrixToMultiplyByRef) 
        {
        	resultRef.result = Matrix.Identity;

            // Set the translate + type 
        	resultRef.result._offsetX = X;
        	resultRef.result._offsetY = Y; 
        	resultRef.result._type = MatrixTypes.TRANSFORM_IS_TRANSLATION; 

            MatrixUtil.MultiplyMatrix(resultRef, matrixToMultiplyByRef); 
        },

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new TranslateTransform
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new TranslateTransform 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue();
        },
        

        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns> 
//        protected override Freezable 
        CreateInstanceCore:function() 
        {
            return new TranslateTransform(); 
        }
	});
	
	Object.defineProperties(TranslateTransform.prototype,{
		///<summary>
        /// Return the current transformation value.
        ///</summary> 
//        public override Matrix 
		Value:
        { 
            get:function() 
            {
                this.ReadPreamble(); 

                var matrix = Matrix.Identity;

                matrix.Translate(this.X, this.Y); 

                return matrix; 
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
                return this.X == 0 && this.Y == 0 && this.CanFreeze;
            } 
        },

      /// <summary>
        ///     X - double.  Default value is 0.0. 
        /// </summary>
//        public double 
        X:
        {
            get:function() 
            {
                return this.GetValue(TranslateTransform.XProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TranslateTransform.XProperty, value);
            }
        },
 
        /// <summary>
        ///     Y - double.  Default value is 0.0. 
        /// </summary> 
//        public double 
        Y:
        { 
            get:function()
            {
                return this.GetValue(TranslateTransform.YProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(TranslateTransform.YProperty, value); 
            }
        }
	});
	
	Object.defineProperties(TranslateTransform,{
		  
	});
//	private static void 
	function XPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{ 
//	    TranslateTransform target = ((TranslateTransform) d);
	    d.PropertyChanged(TranslateTransform.XProperty); 
	}
//	private static void 
	function YPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{ 
//	    TranslateTransform target = ((TranslateTransform) d);
	    d.PropertyChanged(TranslateTransform.YProperty);
	}

//	internal const double 
	var c_X = 0.0;
//	internal const double 
	var c_Y = 0.0; 

//	static TranslateTransform()
	function Initialize()
	{ 
	    // We check our static default fields which are of type Freezable 
	    // to make sure that they are not mutable, otherwise we will throw
	    // if these get touched by more than one thread in the lifetime 
	    // of your app.  (Windows OS Bug #947272)
	    //


	    // Initializations
	    Type typeofThis = typeof(TranslateTransform); 
	    XProperty = 
	          RegisterProperty("X",
	                           Number.Type, 
	                           TranslateTransform.Type,
	                           0.0,
	                           new PropertyChangedCallback(null, XPropertyChanged),
	                           null, 
	                           /* isIndependentlyAnimated  = */ true,
	                           /* coerceValueCallback */ null); 
	    YProperty = 
	          RegisterProperty("Y",
	        		  Number.Type, 
	        		  TranslateTransform.Type,
	                           0.0,
	                           new PropertyChangedCallback(null, YPropertyChanged),
	                           null, 
	                           /* isIndependentlyAnimated  = */ true,
	                           /* coerceValueCallback */ null); 
	}
	  
	
	TranslateTransform.Type = new Type("TranslateTransform", TranslateTransform, [Transform.Type]);
	Initialize();
	
	return TranslateTransform;
});


