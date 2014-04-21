/**
 * LinearGradientBrush
 */

define(["dojo/_base/declare", "system/Type", "media/GradientBrush"], 
		function(declare, Type, GradientBrush){
	var LinearGradientBrush = declare("LinearGradientBrush", GradientBrush,{
		constructor:function(){
			if(arguments.length == 1){ 
				GradientBrush.prototype.constructor.call(this, arguments[0]);
			} else if(arguments.length == 2){   //GradientStopCollection gradientStopCollection, double angle
				this.EndPoint = this.EndPointFromAngle(arguments[1]);
				GradientBrush.prototype.constructor.call(this, arguments[0]);
			}else if(arguments.length == 3){ //Color startColor, Color endColor,  double angle
				if(arguments[0] instanceof Color){
					GradientBrush.prototype.constructor.call(this, null);
					
		            this.EndPoint = this.EndPointFromAngle(arguments[2]); 

		            this.GradientStops.Add(new GradientStop(arguments[0], 0.0));
		            this.GradientStops.Add(new GradientStop(arguments[1], 1.0));
				}else {  //GradientStopCollection gradientStopCollection, Point startPoint, Point endPoint
					GradientBrush.prototype.constructor.call(this, arguments[0]);
					this.StartPoint = arguments[1];
					this.EndPoint = arguments[2];
				}
			}else if(arguments.length == 4){  //Color startColor, Color endColor, Point startPoint, Point endPoint
				GradientBrush.prototype.constructor.call(this, null);
				
	            this.StartPoint = arguments[2];
	            this.EndPoint = arguments[3];

	            this.GradientStops.Add(new GradientStop(arguments[0], 0.0)); 
	            this.GradientStops.Add(new GradientStop(arguments[1], 1.0));
			}else {
				GradientBrush.prototype.constructor.call(this, null);
			}
		},
		
        
//        private Point 
        EndPointFromAngle:function(/*double*/ angle) 
        {
            // Convert the angle from degrees to radians 
            angle = angle * (1.0/180.0) * Math.PI; 

            return (new Point(Math.cos(angle), Math.sin(angle))); 

        },

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new LinearGradientBrush 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new LinearGradientBrush 
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
            return new LinearGradientBrush(); 
        }


	});
	
	Object.defineProperties(LinearGradientBrush.prototype,{
        /// <summary>
        ///     StartPoint - Point.  Default value is new Point(0,0). 
        /// </summary>
//        public Point 
		StartPoint:
        {
            get:function() 
            {
                return this.GetValue(LinearGradientBrush.StartPointProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(LinearGradientBrush.StartPointProperty, value);
            }
        },
 
        /// <summary>
        ///     EndPoint - Point.  Default value is new Point(1,1). 
        /// </summary> 
//        public Point 
        EndPoint:
        { 
            get:function()
            {
                return this.GetValue(LinearGradientBrush.EndPointProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(LinearGradientBrush.EndPointProperty, value); 
            }
        }  
	});
	
	Object.defineProperties(LinearGradientBrush,{
		  
	});
//    private static void 
	function StartPointPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        LinearGradientBrush target = ((LinearGradientBrush) d);
        d.PropertyChanged(LinearGradientBrush.StartPointProperty); 
    }
//    private static void 
	function EndPointPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        LinearGradientBrush target = ((LinearGradientBrush) d);
        d.PropertyChanged(LinearGradientBrush.EndPointProperty);
    }
    
//    internal static Point 
    var s_StartPoint = new Point(0,0); 
//    internal static Point 
    var s_EndPoint = new Point(1,1); 

//    static LinearGradientBrush()
    function Initialize()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272)
        // 
        // Initializations
    	LinearGradientBrush.StartPointProperty =
              RegisterProperty("StartPoint", 
            		  Point.Type, 
                               LinearGradientBrush.Type,
                               new Point(0,0), 
                               new PropertyChangedCallback(null, StartPointPropertyChanged),
                               null,
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
        LinearGradientBrush.EndPointProperty =
              RegisterProperty("EndPoint", 
            		  Point.Type, 
                               LinearGradientBrush.Type,
                               new Point(1,1), 
                               new PropertyChangedCallback(null, EndPointPropertyChanged),
                               null,
                               /* isIndependentlyAnimated  = */ true,
                               /* coerceValueCallback */ null); 
    }
	
	LinearGradientBrush.Type = new Type("LinearGradientBrush", LinearGradientBrush, [GradientBrush.Type]);
	Initialize();
	
	return LinearGradientBrush;
});
