/**
 * ScaleTransform
 */

define(["dojo/_base/declare", "system/Type", "media/Transform"], 
		function(declare, Type, Transform){
	var ScaleTransform = declare("ScaleTransform", Transform,{
		constructor:function(/*double*/ scaleX,
	            /*double*/ scaleY, 
	            /*double*/ centerX,
	            /*double*/ centerY ){
			if(scaleX === undefined){
				scaleX = null;
			}
			
			if(scaleY === undefined){
				scaleY = null;
			}
			
			if(centerX === undefined){
				centerX = null;
			}
			
			if(centerY === undefined){
				centerY = null;
			}
			
            this.ScaleX = scaleX; 
            this.ScaleY = scaleY;
            this.CenterX = centerX; 
            this.CenterY = centerY;
		},
		
//        internal override void 
        TransformRect:function(/*ref Rect*/ rect)
        { 
            if (rect.IsEmpty) 
            {
                return; 
            }

            var scaleX = this.ScaleX;
            var scaleY = this.ScaleY; 
            var centerX = this.CenterX;
            var centerY = this.CenterY; 
 
            var translateCenter = centerX != 0 || centerY != 0;
 
            if (translateCenter)
            {
            	rect.X -= centerX;
            	rect.Y -= centerY; 
            }
 
            rect.Scale(scaleX, scaleY); 

            if (translateCenter) 
            {
            	rect.X += centerX;
            	rect.Y += centerY;
            } 
        },
 
        /// <summary> 
        /// MultiplyValueByMatrix - *result is set equal to "this" * matrixToMultiplyBy.
        /// </summary> 
        /// <param name="result"> The result is stored here. </param>
        /// <param name="matrixToMultiplyBy"> The multiplicand. </param>
//        internal override void 
        MultiplyValueByMatrix:function(/*ref Matrix result*/resultRef, /*ref Matrix matrixToMultiplyBy*/matrixToMultiplyByRef)
        { 
        	resultRef.result = Matrix.Identity;
 
        	resultRef.result._m11 = this.ScaleX; 
        	resultRef.result._m22 = this.ScaleY;
            var centerX = this.CenterX; 
            var centerY = this.CenterY;

            resultRef.result._type = MatrixTypes.TRANSFORM_IS_SCALING;
 
            if (centerX != 0 || centerY != 0)
            { 
            	resultRef.result._offsetX = centerX - centerX * result._m11; 
            	resultRef.result._offsetY = centerY - centerY * result._m22;
            	resultRef.result._type |= MatrixTypes.TRANSFORM_IS_TRANSLATION; 
            }

            MatrixUtil.MultiplyMatrix(resultRef, matrixToMultiplyByRef);
        }, 

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new ScaleTransform 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new ScaleTransform 
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
            return new ScaleTransform();
        } 
	});
	
	Object.defineProperties(ScaleTransform.prototype,{
		  ///<summary> 
        /// Return the current transformation value.
        ///</summary> 
//        public override Matrix 
		Value: 
        {
            get:function() 
            {
            	this.ReadPreamble();

                var m = new Matrix(); 

                m.ScaleAt(this.ScaleX, this.ScaleY, this.CenterX, this.CenterY); 
 
                return m;
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
                return this.ScaleX == 1 && this.ScaleY == 1 && this.CanFreeze;
            }
        },
        
        /// <summary> 
        ///     ScaleX - double.  Default value is 1.0.
        /// </summary> 
//        public double 
        ScaleX: 
        {
            get:function() 
            {
                return this.GetValue(ScaleTransform.ScaleXProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(ScaleTransform.ScaleXProperty, value); 
            } 
        },
 
        /// <summary>
        ///     ScaleY - double.  Default value is 1.0.
        /// </summary>
//        public double 
        ScaleY: 
        {
            get:function() 
            { 
                return this.GetValue(ScaleTransform.ScaleYProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(ScaleTransform.ScaleYProperty, value);
            } 
        },
 
        /// <summary> 
        ///     CenterX - double.  Default value is 0.0.
        /// </summary> 
//        public double 
        CenterX:
        {
            get:function()
            { 
                return this.GetValue(ScaleTransform.CenterXProperty);
            }, 
            set:function(value) 
            {
            	this.SetValueInternal(ScaleTransform.CenterXProperty, value); 
            }
        },

        /// <summary> 
        ///     CenterY - double.  Default value is 0.0.
        /// </summary> 
//        public double 
        CenterY: 
        {
            get:function() 
            {
                return this.GetValue(ScaleTransform.CenterYProperty);
            },
            set:function(value)
            {
            	this.SetValueInternal(ScaleTransform.CenterYProperty, value); 
            } 
        }
	});
	
	Object.defineProperties(ScaleTransform,{
		  
	});
//	private static void 
	function ScaleXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{ 
//	    ScaleTransform target = ((ScaleTransform) d);
	    d.PropertyChanged(ScaleTransform.ScaleXProperty); 
	}
//	private static void 
	function ScaleYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{ 
//	    ScaleTransform target = ((ScaleTransform) d);
	    d.PropertyChanged(ScaleTransform.ScaleYProperty);
	}
//	private static void 
	function CenterXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{
//	    ScaleTransform target = ((ScaleTransform) d); 
	    d.PropertyChanged(ScaleTransform.CenterXProperty); 
	}
//	private static void 
	function CenterYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{
//	    ScaleTransform target = ((ScaleTransform) d); 
	    d.PropertyChanged(ScaleTransform.CenterYProperty); 
	}
	 
//    internal const double 
	var c_ScaleX = 1.0; 
//    internal const double 
	var c_ScaleY = 1.0;
//    internal const double 
	var c_CenterX = 0.0;
//    internal const double 
	var c_CenterY = 0.0;

//    static ScaleTransform()
	function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272) 
        //


        // Initializations
        Type typeofThis = typeof(ScaleTransform); 
        ScaleXProperty =
              RegisterProperty("ScaleX",
            		  Number.Type,
                               ScaleTransform.Type, 
                               1.0,
                               new PropertyChangedCallback(null, ScaleXPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        ScaleYProperty =
              RegisterProperty("ScaleY",
            		  Number.Type,
                               ScaleTransform.Type, 
                               1.0,
                               new PropertyChangedCallback(null, ScaleYPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        CenterXProperty =
              RegisterProperty("CenterX",
            		  Number.Type,
                               ScaleTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, CenterXPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        CenterYProperty =
              RegisterProperty("CenterY",
                               Number.Type,
                               ScaleTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, CenterYPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
    }
	
	ScaleTransform.Type = new Type("ScaleTransform", ScaleTransform, [Transform.Type]);
	INitialize();
	
	return ScaleTransform;
});