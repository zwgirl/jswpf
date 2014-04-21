/**
 * SkewTransform
 */

define(["dojo/_base/declare", "system/Type", "media/Transform"], 
		function(declare, Type, Transform){
	var SkewTransform = declare("SkewTransform", Transform,{
		constructor:function(/*double*/ angleX, /*double*/ angleY, /*double*/ centerX, /*double*/ centerY)
		{
			if(angleX === undefined){
				angleX = null;
			}
			if(angleY === undefined){
				angleY = null;
			}
			if(centerX === undefined){
				centerX = null;
			}
			if(centerY === undefined){
				centerY = null;
			}
            this.AngleX = angleX; 
            this.AngleY = angleY;
            this.CenterX = centerX; 
            this.CenterY = centerY;
		},

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new SkewTransform 
		Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new SkewTransform 
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
            return new SkewTransform();
        } 
	});
	
	Object.defineProperties(SkewTransform.prototype,{
	      ///<summary> 
        /// Return the current transformation value.
        ///</summary> 
//        public override Matrix 
		Value:
        {
            get:function() 
            {
                this.ReadPreamble();

                var matrix = new Matrix(); 

                var angleX = this.AngleX; 
                var angleY = this.AngleY; 
                var centerX = this.CenterX;
                var centerY = this.CenterY; 

                var hasCenter = centerX != 0 || centerY != 0;

                if (hasCenter) 
                {
                    matrix.Translate(-centerX, -centerY); 
                } 

                matrix.Skew(angleX, angleY); 

                if (hasCenter)
                {
                    matrix.Translate(centerX, centerY); 
                }
 
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
                return this.AngleX == 0 && this.AngleY == 0 && this.CanFreeze; 
            }
        },
        
        /// <summary> 
        ///     AngleX - double.  Default value is 0.0.
        /// </summary> 
//        public double 
        AngleX: 
        {
            get:function() 
            {
                return this.GetValue(SkewTransform.AngleXProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(SkewTransform.AngleXProperty, value); 
            } 
        },
 
        /// <summary>
        ///     AngleY - double.  Default value is 0.0 .
        /// </summary>
//        public double 
        AngleY:
        {
            get:function() 
            { 
                return this.GetValue(SkewTransform.AngleYProperty);
            }, 
            set:function(value)
            {
            	this.SetValueInternal(SkewTransform.AngleYProperty, value);
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
                return this.GetValue(SkewTransform.CenterXProperty);
            }, 
            set:function(value) 
            {
            	this.SetValueInternal(SkewTransform.CenterXProperty, value); 
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
                return this.GetValue(SkewTransform.CenterYProperty);
            },
            set:function(value)
            {
            	this.SetValueInternal(SkewTransform.CenterYProperty, value); 
            } 
        }
	});
	
	Object.defineProperties(SkewTransform,{
		  
	});
	
//    private static void 
	function AngleXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        SkewTransform target = ((SkewTransform) d);
        d.PropertyChanged(SkewTransform.AngleXProperty); 
    }
//    private static void
    function AngleYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        SkewTransform target = ((SkewTransform) d);
        d.PropertyChanged(SkewTransform.AngleYProperty);
    }
//    private static void 
    function CenterXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        SkewTransform target = ((SkewTransform) d); 
        d.PropertyChanged(SkewTransform.CenterXProperty); 
    }
//    private static void 
    function CenterYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        SkewTransform target = ((SkewTransform) d); 
        d.PropertyChanged(SkewTransform.CenterYProperty); 
    }
    
//    internal const double 
    var c_AngleX = 0.0; 
//    internal const double 
    var c_AngleY = 0.0 ;
//    internal const double 
    var c_CenterX = 0.0;
//    internal const double 
    var c_CenterY = 0.0;


//    static SkewTransform()
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272) 
        //
    	SkewTransform.AngleXProperty =
              RegisterProperty("AngleX",
                               Number.Type,
                               SkewTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, AngleXPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        SkewTransform.AngleYProperty =
              RegisterProperty("AngleY",
                               Number.Type,
                               SkewTransform.Type, 
                               0.0 ,
                               new PropertyChangedCallback(null, AngleYPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        SkewTransform.CenterXProperty =
              RegisterProperty("CenterX",
                               Number.Type,
                               SkewTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, CenterXPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        SkewTransform.CenterYProperty =
              RegisterProperty("CenterY",
                               Number.Type,
                               SkewTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, CenterYPropertyChanged), 
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
    }
	
	SkewTransform.Type = new Type("SkewTransform", SkewTransform, [Transform.Type]);
	Initialize();
	
	return SkewTransform;
});

