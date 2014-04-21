/**
 * RadialGradientBrush
 */

define(["dojo/_base/declare", "system/Type", "media/GradientBrush"], 
		function(declare, Type, GradientBrush){
	
//    internal static Point 
	var s_Center = new Point(0.5,0.5);
//    internal const double 
	var c_RadiusX = 0.5;
//    internal const double 
	var c_RadiusY = 0.5; 
//    internal static Point 
	var s_GradientOrigin = new Point(0.5,0.5);
    
	var RadialGradientBrush = declare("RadialGradientBrush", GradientBrush,{
		constructor:function(){
			if(arguments.length == 0){
				GradientBrush.prototype.constructor.call(this, null);
			}else if(arguments.length == 1){
				GradientBrush.prototype.constructor.call(this, arguments[0]);
			}else if(arguments.length == 2){
				GradientBrush.prototype.constructor.call(this, null);
				
				this.GradientStops.Add(new GradientStop(arguments[0], 0.0)); 
				this.GradientStops.Add(new GradientStop(arguments[1], 1.0));
			}
		},
		
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new RadialGradientBrush 
        Clone:function()
        {
            return GradientBrush.prototype.Clone.call(this);
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new RadialGradientBrush 
        CloneCurrentValue:function()
        {
            return GradientBrush.prototype.CloneCurrentValue.call(this);
        },
        
      /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary> 
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function() 
        { 
            return new RadialGradientBrush();
        } 
	});
	
	Object.defineProperties(RadialGradientBrush.prototype,{
		/// <summary> 
        ///     Center - Point.  Default value is new Point(0.5,0.5).
        /// </summary> 
//        public Point 
		Center: 
        {
            get:function() 
            {
                return this.GetValue(RadialGradientBrush.CenterProperty);
            },
            set:function(value)  
            {
            	this.SetValueInternal(RadialGradientBrush.CenterProperty, value); 
            } 
        },
 
        /// <summary>
        ///     RadiusX - double.  Default value is 0.5.
        /// </summary>
//        public double 
        RadiusX: 
        {
            get:function() 
            { 
                return this.GetValue(RadialGradientBrush.RadiusXProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(RadialGradientBrush.RadiusXProperty, value);
            } 
        },
 
        /// <summary> 
        ///     RadiusY - double.  Default value is 0.5.
        /// </summary> 
//        public double 
        RadiusY:
        {
            get:function()
            { 
                return this.GetValue(RadialGradientBrush.RadiusYProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(RadialGradientBrush.RadiusYProperty, value); 
            }
        },

        /// <summary> 
        ///     GradientOrigin - Point.  Default value is new Point(0.5,0.5).
        /// </summary> 
//        public Point 
        GradientOrigin: 
        {
            get:function() 
            {
                return this.GetValue(RadialGradientBrush.GradientOriginProperty);
            },
            set:function(value) 
            {
            	this.SetValueInternal(RadialGradientBrush.GradientOriginProperty, value); 
            } 
        }
	});
	
	Object.defineProperties(RadialGradientBrush,{
		  
	});
	
//	 private static void 
	function CenterPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{ 
//		RadialGradientBrush target = ((RadialGradientBrush) d);
		d.PropertyChanged(RadialGradientBrush.CenterProperty); 
	}
//	private static void 
	function RadiusXPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{ 
//		RadialGradientBrush target = ((RadialGradientBrush) d);
		d.PropertyChanged(RadialGradientBrush.RadiusXProperty);
	}
//	private static void 
	function RadiusYPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
	{
//		RadialGradientBrush target = ((RadialGradientBrush) d); 
		d.PropertyChanged(RadialGradientBrush.RadiusYProperty); 
	}	
//	private static void 
	function GradientOriginPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
	{
//		RadialGradientBrush target = ((RadialGradientBrush) d); 
		d.PropertyChanged(RadialGradientBrush.GradientOriginProperty); 
	}
	
//	static RadialGradientBrush()
	function Initialize()
    {
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272) 
        // Initializations
		RadialGradientBrush.CenterProperty =
              RegisterProperty("Center", 
            		  Point.Type,
                               RadialGradientBrush.Type, 
                               new Point(0.5,0.5), 
                               new PropertyChangedCallback(null, CenterPropertyChanged),
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
        RadialGradientBrush.RadiusXProperty =
              RegisterProperty("RadiusX", 
            		  Number.Type,
                               RadialGradientBrush.Type, 
                               0.5, 
                               new PropertyChangedCallback(null, RadiusXPropertyChanged),
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
        RadialGradientBrush.RadiusYProperty =
              RegisterProperty("RadiusY", 
                               Number.Type,
                               RadialGradientBrush.Type, 
                               0.5, 
                               new PropertyChangedCallback(null, RadiusYPropertyChanged),
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
        RadialGradientBrush.GradientOriginProperty =
              RegisterProperty("GradientOrigin", 
            		  Point.Type,
                               RadialGradientBrush.Type, 
                               new Point(0.5,0.5), 
                               new PropertyChangedCallback(null, GradientOriginPropertyChanged),
                               null, 
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null);
    }
	
	RadialGradientBrush.Type = new Type("RadialGradientBrush", RadialGradientBrush, [GradientBrush.Type]);
	Initialize();
	
	return RadialGradientBrush;
});
