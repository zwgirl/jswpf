/**
 * RotateTransform
 */

define(["dojo/_base/declare", "system/Type", "controls/Transform"], 
		function(declare, Type, Transform){
	var RotateTransform = declare("RotateTransform", Transform,{
		constructor:function(/*double*/ angle,
	            /*double*/ centerX, 
	            /*double*/ centerY){
			if(angle === undefined){
				angle = null;
			}
			
			if(centerX === undefined){
				centerX = null;
			}
			
			if(centerY === undefined){
				centerY = null;
			}
            this.Angle = angle;
            this.CenterX = centerX; 
            this.CenterY = centerY;
		},
		
        
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new RotateTransform 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new RotateTransform 
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
            return new RotateTransform(); 
        }
	});
	
	Object.defineProperties(RotateTransform.prototype,{
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
 
                m.RotateAt(this.Angle, this.CenterX, this.CenterY);

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
                return this.Angle == 0 && this.CanFreeze;
            } 
        },
        

        /// <summary> 
        ///     Angle - double.  Default value is 0.0. 
        /// </summary>
//        public double 
        Angle: 
        {
            get:function()
            {
                return this.GetValue(RotateTransform.AngleProperty); 
            },
            set:function(value)
            { 
            	this.SetValueInternal(RotateTransform.AngleProperty, value);
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
                return this.GetValue(RotateTransform.CenterXProperty);
            },
            set:function(value)
            { 
            	this.SetValueInternal(RotateTransform.CenterXProperty, value);
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
                return this.GetValue(RotateTransform.CenterYProperty); 
            },
            set:function(value) 
            {
            	this.SetValueInternal(RotateTransform.CenterYProperty, value);
            }
        } 
	});
	
	Object.defineProperties(RotateTransform,{
		  
	});
	 
//    private static void 
	function AnglePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        RotateTransform target = ((RotateTransform) d);
        d.PropertyChanged(RotateTransform.AngleProperty); 
    }
//    private static void 
	function CenterXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        RotateTransform target = ((RotateTransform) d);
        d.PropertyChanged(RotateTransform.CenterXProperty);
    }
//    private static void 
	function CenterYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        RotateTransform target = ((RotateTransform) d); 
        d.PropertyChanged(RotateTransform.CenterYProperty); 
    }


//    internal const double 
	var c_Angle = 0.0; 
//    internal const double 
	var c_CenterX = 0.0;
//    internal const double 
	var c_CenterY = 0.0; 

//    static RotateTransform()
    function Initialize()
    {
        // We check our static default fields which are of type Freezable 
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272) 
        //
    	RotateTransform.AngleProperty = 
              RegisterProperty("Angle",
            		  Number.Type, 
                               RotateTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, AnglePropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
        RotateTransform.CenterXProperty = 
              RegisterProperty("CenterX",
            		  Number.Type, 
                               RotateTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, CenterXPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
        RotateTransform.CenterYProperty = 
              RegisterProperty("CenterY",
                               Number.Type, 
                               RotateTransform.Type, 
                               0.0,
                               new PropertyChangedCallback(null, CenterYPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
    } 
	
	RotateTransform.Type = new Type("RotateTransform", RotateTransform, [Transform.Type]);
	Initialize();
	
	return RotateTransform;
});


