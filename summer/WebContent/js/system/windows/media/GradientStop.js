/**
 * GradientStop
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable"], 
		function(declare, Type, Animatable){
	var GradientStop = declare("GradientStop", Animatable,{
		constructor:function(/*Color*/ color, /*double*/ offset){
			if(color === undefined){
				color = null;
			}
			
			if(offset === undefined){
				offset = 0;
			}
			
            this.Color = color; 
            this.Offset = offset;
		},
        
        /// <summary>
        ///     Shadows inherited Clone() with a strongly typed
        ///     version for convenience.
        /// </summary> 
//        public new GradientStop 
        Clone:function()
        { 
            return base.Clone(); 
        },
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed
        ///     version for convenience.
        /// </summary> 
//        public new GradientStop 
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
            return new GradientStop(); 
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
            ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls. 
            return ConvertToString(null /* format string */, null /* format provider */);
        }, 

//        /// <summary>
//        /// Creates a string representation of this object based on the IFormatProvider
//        /// passed in.  If the provider is null, the CurrentCulture is used. 
//        /// </summary>
//        /// <returns> 
//        /// A string representation of this object. 
//        /// </returns>
////        public string 
//        ToString:function(IFormatProvider provider) 
//        {
//            ReadPreamble();
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(null /* format string */, provider); 
//        },
// 
//        /// <summary> 
//        /// Creates a string representation of this object based on the format string
//        /// and IFormatProvider passed in. 
//        /// If the provider is null, the CurrentCulture is used.
//        /// See the documentation for IFormattable for more information.
//        /// </summary>
//        /// <returns> 
//        /// A string representation of this object.
//        /// </returns> 
//        string IFormattable.ToString(string format, IFormatProvider provider) 
//        {
//            ReadPreamble(); 
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(format, provider);
//        },
 
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
            // Helper to get the numeric list separator for a given culture. 
            var separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider);
            return String.Format(provider, 
                                 "{1:" + format + "}{0}{2:" + format + "}",
                                 separator,
                                 Color,
                                 Offset); 
        }
	});
	
	Object.defineProperties(GradientStop.prototype,{
		/// <summary>
        ///     Color - Color.  Default value is Colors.Transparent. 
        /// </summary>
//        public Color 
		Color:
        {
            get:function() 
            {
                return this.GetValue(GradientStop.ColorProperty); 
            },
            set:function(value)
            { 
            	this.SetValueInternal(GradientStop.ColorProperty, value);
            }
        },
 
        /// <summary>
        ///     Offset - double.  Default value is 0.0. 
        /// </summary> 
//        public double 
		Offset:
        { 
            get:function()
            {
                return this.GetValue(GradientStop.OffsetProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(GradientStop.OffsetProperty, value); 
            }
        }   
	});
	
	Object.defineProperties(GradientStop,{
		   /// <summary>
        ///     The DependencyProperty for the GradientStop.Color property.
        /// </summary>
//        public static readonly DependencyProperty 
		ColorProperty:
        {
        	get:function(){
        		if(GradientStop._ColorProperty === undefined){
        			GradientStop._ColorProperty = RegisterProperty("Color",
        					Color.Type, 
        					GradientStop.Type, 
                            Colors.Transparent,
                            null, 
                            null,
                            /* isIndependentlyAnimated  = */ false,
                            /* coerceValueCallback */ null);
        		}
        		
        		return GradientStop._ColorProperty;
        	}
        }, 
            
        /// <summary> 
        ///     The DependencyProperty for the GradientStop.Offset property.
        /// </summary> 
//        public static readonly DependencyProperty 
		OffsetProperty:
        {
        	get:function(){
        		if(GradientStop._OffsetProperty === undefined){
        			GradientStop._OffsetProperty = RegisterProperty("Offset",
                            Number.Type, 
                            GradientStop.Type,
                            0.0,
                            null,
                            null, 
                            /* isIndependentlyAnimated  = */ false,
                            /* coerceValueCallback */ null);  
        		}
        		
        		return GradientStop._OffsetProperty;
        	}
        }, 
            
  
	});
	
	GradientStop.Type = new Type("GradientStop", GradientStop, [Animatable.Type, IFormattable.Type]);
	return GradientStop;
});