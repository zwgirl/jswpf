/**
 * Brush
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable", "system/IFormattable"], 
		function(declare, Type, Animatable, IFormattable){
	
//    internal const double 
	var c_Opacity = 1.0;
//    internal static Transform s_Transform = Transform.Identity; 
//    internal static Transform s_RelativeTransform = Transform.Identity; 
    
	var Brush = declare("Brush", [Animatable, IFormattable],{
		constructor:function(){
		},
		
        /// <summary> 
        /// Can serialze "this" to a string 
        /// </summary>
//        internal virtual bool 
		CanSerializeToString:function() 
        {
            return false;
        },
 
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed
        ///     version for convenience. 
        /// </summary>
//        public new Brush 
		Clone:function()
        {
            return Animatable.prototype.Clone.call(this); 
        },
 
        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed
        ///     version for convenience. 
        /// </summary>
//        public new Brush 
        CloneCurrentValue:function()
        {
            return Animatable.prototype.CloneCurrentValue.call(this); 
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
            this.ReadPreamble();
            // Delegate to the internal method which implements all ToString calls. 
            return ConvertToString(null /* format string */, null /* format provider */);
        },

        /// <summary> 
        /// Creates a string representation of this object based on the IFormatProvider
        /// passed in.  If the provider is null, the CurrentCulture is used. 
        /// </summary> 
        /// <returns>
        /// A string representation of this object. 
        /// </returns>
//        public string 
        ToString:function(/*IFormatProvider*/ provider)
        {
            this.ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls.
            return ConvertToString(null /* format string */, provider); 
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
//        string IFormattable.
        ToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        {
        	this.ReadPreamble();
            // Delegate to the internal method which implements all ToString calls.
            return ConvertToString(format, provider); 
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
//        internal virtual string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        {
            return base.ToString(); 
        }
	});
	
	Object.defineProperties(Brush.prototype,{
	
        /// <summary>
        ///     Opacity - double.  Default value is 1.0. 
        /// </summary>
//        public double 
		Opacity:
        {
            get:function() 
            {
                return this.GetValue(Brush.OpacityProperty); 
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(Brush.OpacityProperty, value);
            }
        },
 
        /// <summary>
        ///     Transform - Transform.  Default value is Transform.Identity. 
        /// </summary> 
//        public Transform 
        Transform:
        { 
            get:function()
            {
                return this.GetValue(Brush.TransformProperty);
            }, 
            set:function(value)
            { 
            	this.SetValueInternal(Brush.TransformProperty, value); 
            }
        }, 

        /// <summary>
        ///     RelativeTransform - Transform.  Default value is Transform.Identity.
        /// </summary> 
//        public Transform 
        RelativeTransform:
        { 
            get:function() 
            {
                return this.GetValue(Brush.RelativeTransformProperty); 
            }, 
            set:function(value)
            {
            	this.SetValueInternal(Brush.RelativeTransformProperty, value); 
            }
        } 

	});
	
	Object.defineProperties(Brush,{
	       /// <summary>
        ///     The DependencyProperty for the Brush.Opacity property. 
        /// </summary> 
//        public static readonly DependencyProperty 
		OpacityProperty:
        {
        	get:function(){
        		if(Brush._HorizontalContentAlignmentProperty === undefined){
        			Brush._HorizontalContentAlignmentProperty =
        	              RegisterProperty("Opacity",
                                  Number.Type, 
                                  Brush.Type,
                                  1.0, 
                                  new PropertyChangedCallback(Brush, OpacityPropertyChanged), 
                                  null,
                                  /* isIndependentlyAnimated  = */ true, 
                                  /* coerceValueCallback */ null);  
        		}
        		
        		return Brush._HorizontalContentAlignmentProperty;
        	}
        },
        /// <summary> 
        ///     The DependencyProperty for the Brush.Transform property.
        /// </summary>
//        public static readonly DependencyProperty 
		TransformProperty:
        {
        	get:function(){
        		if(Brush._HorizontalContentAlignmentProperty === undefined){
        			Brush._HorizontalContentAlignmentProperty =
        	              RegisterProperty("Transform",
        	            		  Transform.Type, 
                                  Brush.Type,
                                  Transform.Identity, 
                                  new PropertyChangedCallback(Brush, TransformPropertyChanged), 
                                  null,
                                  /* isIndependentlyAnimated  = */ false, 
                                  /* coerceValueCallback */ null);  
        		}
        		
        		return Brush._HorizontalContentAlignmentProperty;
        	}
        },
        /// <summary> 
        ///     The DependencyProperty for the Brush.RelativeTransform property.
        /// </summary> 
//        public static readonly DependencyProperty 
		RelativeTransformProperty:
        {
        	get:function(){
        		if(Brush._HorizontalContentAlignmentProperty === undefined){
        			Brush._HorizontalContentAlignmentProperty =
        	              RegisterProperty("RelativeTransform",
        	            		  Transform.Type, 
                                  Brush.Type,
                                  Transform.Identity, 
                                  new PropertyChangedCallback(Brush, RelativeTransformPropertyChanged), 
                                  null,
                                  /* isIndependentlyAnimated  = */ false, 
                                  /* coerceValueCallback */ null); 
        		}
        		
        		return Brush._HorizontalContentAlignmentProperty;
        	}
        }, 
	});
	/// <summary> 
    /// Parse - this method is called by the type converter to parse a Brush's string 
    /// (provided in "value") with the given IFormatProvider.
    /// </summary> 
    /// <returns>
    /// A Brush which was created by parsing the "value".
    /// </returns>
    /// <param name="value"> String representation of a Brush.  Cannot be null/empty. </param> 
    /// <param name="context"> The ITypeDescriptorContext for this call. </param>
//    internal static Brush 
	Brush.Parse = function(/*string*/ value, /*ITypeDescriptorContext*/ context) 
    { 
        var brush;
        var freezer = null; 
        if (context != null)
        {
            freezer = context.GetService(typeof(IFreezeFreezables));
            if ((freezer != null) && freezer.FreezeFreezables) 
            {
                brush = freezer.TryGetFreezable(value); 
                if (brush != null) 
                {
                    return brush; 
                }
            }
        }

        brush = Parsers.ParseBrush(value, System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS, context);

        if ((brush != null) && (freezer != null) && (freezer.FreezeFreezables)) 
        {
            freezer.TryFreeze(value, brush); 
        }

        return brush;
    }; 

 
//    private static void 
    function OpacityPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.PropertyChanged(Brush.OpacityProperty);
    } 
//    private static void 
    function TransformPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        // The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children) 
        // will promote the property value from a default value to a local value. This is technically a sub-property
        // change because the collection was changed and not a new collection set (GeometryGroup.Children. 
        // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled 
        // the default value to the compositor. If the property changes from a default value, the new local value
        // needs to be marshalled to the compositor. We detect this scenario with the second condition 
        // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be
        // Default and the NewValueSource will be Local.
        if (e.IsASubPropertyChange &&
           (e.OldValueSource == e.NewValueSource)) 
        {
            return; 
        } 

        d.PropertyChanged(Brush.TransformProperty);
    } 
//    private static void 
    function RelativeTransformPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        // The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children) 
        // will promote the property value from a default value to a local value. This is technically a sub-property
        // change because the collection was changed and not a new collection set (GeometryGroup.Children. 
        // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled
        // the default value to the compositor. If the property changes from a default value, the new local value
        // needs to be marshalled to the compositor. We detect this scenario with the second condition
        // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be 
        // Default and the NewValueSource will be Local.
        if (e.IsASubPropertyChange && 
           (e.OldValueSource == e.NewValueSource)) 
        {
            return; 
        }

        d.PropertyChanged(Brush.RelativeTransformProperty);
    }

	Brush.RegisterProperty = Animatable.RegisterProperty;
	Brush.Type = new Type("Brush", Brush, [Animatable.Type, IFormattable.Type]);
	return Brush;
});
