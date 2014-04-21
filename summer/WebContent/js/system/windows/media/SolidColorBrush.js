/**
 * SolidColorBrush
 */

define(["dojo/_base/declare", "system/Type", "media/Brush", "media/Color", "media/Colors"],
		function(declare, Type, Brush, Color, Colors){
//    internal static Color 
    var s_Color = Colors.Transparent;
    
	var SolidColorBrush = declare("SolidColorBrush", Brush,{
		constructor:function(/*Color*/ color)
        {
			if(color === undefined){
				color = null;
			}
            this.Color = color;
        },
        
        
        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new SolidColorBrush 
        CloneCurrentValue:function()
        {
        	return Brush.prototype.CloneCurrentValue.call(this);
        }, 

        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function()
        { 
        	return new SolidColorBrush();
        } 
	});
	
	Object.defineProperties(SolidColorBrush.prototype,{
	       /// <summary>
        ///     Color - Color.  Default value is Colors.Transparent.
        /// </summary>
//        public Color 
        Color: 
        {
            get:function() 
            { 
                return this.GetValue(SolidColorBrush.ColorProperty);
            }, 
            set:function(value)
            {
                this.SetValueInternal(SolidColorBrush.ColorProperty, value);
            } 
        }
	});
	
	Object.defineProperties(SolidColorBrush,{
        ColorProperty:
        {
        	get:function(){
            	if(SolidColorBrush._ColorProperty === undefined){
            		SolidColorBrush._ColorProperty =
                        RegisterProperty("Color",
                                Color.Type, 
                                SolidColorBrush.Type,
                                Colors.Transparent, 
                                new PropertyChangedCallback(SolidColorBrush, ColorPropertyChanged), 
                                null,
                                /* isIndependentlyAnimated  = */ true, 
                                /* coerceValueCallback */ null);
            	}
            	
            	return SolidColorBrush._ColorProperty;
        	}
        }
	});
	
//    private static void 
    function ColorPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.PropertyChanged(SolidColorBrush.ColorProperty); 
    }
	
	var RegisterProperty = Brush.RegisterProperty;
	SolidColorBrush.Type = new Type("SolidColorBrush", SolidColorBrush, [Brush.Type]);
	return SolidColorBrush;
});



