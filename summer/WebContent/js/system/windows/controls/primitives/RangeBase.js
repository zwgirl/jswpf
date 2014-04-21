/**
 * RangeBase
 */
/// <summary> 
///     The RangeBase class is the base class from which all "range-like"
/// controls derive.  It defines the relevant events and properties, as 
/// well as providing handlers for the relevant input events.
/// </summary>
/// <ExternalAPI/>
define(["dojo/_base/declare", "system/Type", "controls/Control"], 
		function(declare, Type, Control){
	var RangeBase = declare("RangeBase", null,{
		constructor:function(){
		},
        /// <summary>
        ///     This method is invoked when the Minimum property changes. 
        /// </summary>
        /// <param name="oldMinimum">The old value of the Minimum property.</param>
        /// <param name="newMinimum">The new value of the Minimum property.</param>
//        protected virtual void 
        OnMinimumChanged:function(/*double*/ oldMinimum, /*double*/ newMinimum) 
        {
        }, 
 
 
        /// <summary>
        ///     This method is invoked when the Maximum property changes. 
        /// </summary>
        /// <param name="oldMaximum">The old value of the Maximum property.</param>
        /// <param name="newMaximum">The new value of the Maximum property.</param>
//        protected virtual void 
        OnMaximumChanged:function(/*double*/ oldMaximum, /*double*/ newMaximum) 
        {
        },
 
        /// <summary>
        ///     This method is invoked when the Value property changes. 
        /// </summary>
        /// <param name="oldValue">The old value of the Value property.</param>
        /// <param name="newValue">The new value of the Value property.</param>
//        protected virtual void 
        OnValueChanged:function(/*double*/ oldValue, /*double*/ newValue) 
        {
            /*RoutedPropertyChangedEventArgs<double>*/
        	var args = new RoutedPropertyChangedEventArgs/*<double>*/(oldValue, newValue); 
            args.RoutedEvent = RangeBase.ValueChangedEvent; 
            this.RaiseEvent(args);
        },

//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        { 
            if (!this.IsEnabled)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateDisabled, VisualStates.StateNormal); 
            }
            else if (this.IsMouseOver) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateMouseOver, VisualStates.StateNormal);
            }
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions); 
            } 

            if (this.IsKeyboardFocused) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateFocused, VisualStates.StateUnfocused);
            }
            else 
            {
                VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions); 
            } 

            Control.prototype.ChangeVisualState.call(this, useTransitions); 
        },
        
      /// <summary>
        ///     Gives a string representation of this object. 
        /// </summary>
//        public override string 
        ToString:function() 
        { 
            var typeText = this.GetType().ToString();
            var min = Number.NaN; 
            var max = Number.NaN;
            var val = Number.NaN;
            var valuesDefined = false;
 
            // Accessing RangeBase properties may be thread sensitive
//            if (CheckAccess()) 
//            { 
                min = this.Minimum;
                max = this.Maximum; 
                val = this.Value;
                valuesDefined = true;
//            }
//            else 
//            {
//                //Not on dispatcher, try posting to the dispatcher with 20ms timeout 
//                Dispatcher.Invoke(DispatcherPriority.Send, new TimeSpan(0, 0, 0, 0, 20), new DispatcherOperationCallback(delegate(object o) 
//                {
//                    min = Minimum; 
//                    max = Maximum;
//                    val = Value;
//                    valuesDefined = true;
//                    return null; 
//                }), null);
//            } 
 
            // If min, max, value are defined
            if (valuesDefined) 
            {
                return SR.Get(SRID.ToStringFormatString_RangeBase, typeText, min, max, val);
            }
 
            // Not able to access the dispatcher
            return typeText; 
        },
        
        /// <summary>
        /// Add / Remove ValueChangedEvent handler
        /// </summary> 
//        public event RoutedPropertyChangedEventHandler<double> ValueChanged { add { AddHandler(ValueChangedEvent, value); } 
//        remove { RemoveHandler(ValueChangedEvent, value); } } 
        
        AddValueChanged:function(value)
        { 
        	this.AddHandler(RangeBase.ValueChangedEvent, value); 
        },
        
        RemoveValueChanged:function(value)
        { 
        	this.RemoveHandler(RangeBase.ValueChangedEvent, value); 
       	} 
		
	});
	
	Object.defineProperties(RangeBase.prototype,{
        
        /// <summary> 
        ///     Minimum restricts the minimum value of the Value property
        /// </summary> 
//        public double 
        Minimum:
        {
            get:function() { return this.GetValue(RangeBase.MinimumProperty); },
            set:function(value) { this.SetValue(RangeBase.MinimumProperty, value); }
        },
 
 
        /// <summary>
        ///     Maximum restricts the maximum value of the Value property 
        /// </summary>
//        public double 
        Maximum:
        { 
            get:function() { return this.GetValue(RangeBase.MaximumProperty); },
            set:function(value) { this.SetValue(RangeBase.MaximumProperty, value); } 
        }, 


        /// <summary> 
        ///     Value property
        /// </summary>
//        public double 
        Value: 
        {
            get:function() { return this.GetValue(RangeBase.ValueProperty); },
            set:function(value) { this.SetValue(RangeBase.ValueProperty, value); } 
        },
 
        /// <summary>
        ///     LargeChange property 
        /// </summary>
//        public double 
        LargeChange:
        { 
            get:function()
            { 
                return this.GetValue(RangeBase.LargeChangeProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(RangeBase.LargeChangeProperty, value);
            }
        }, 

        /// <summary>
        ///     SmallChange property 
        /// </summary>
//        public double 
        SmallChange:
        { 
            get:function()
            { 
                return this.GetValue(RangeBase.SmallChangeProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(RangeBase.SmallChangeProperty, value);
            }
        } 
		  
	});
	
	Object.defineProperties(RangeBase,{
	       /// <summary> 
        /// Event correspond to Value changed event 
        /// </summary>
//        public static readonly RoutedEvent 
        ValueChangedEvent:
        {
        	get:function(){
        		if(RangeBase._ValueChangedEvent === undefined){
        			RangeBase._ValueChangedEvent = EventManager.RegisterRoutedEvent("ValueChanged", RoutingStrategy.Bubble, 
        					RoutedPropertyChangedEventHandler.Type, RangeBase.Type);  
        		}
        		
        		return RangeBase._ValueChangedEvent;
        	}
        },


        /// <summary>
        ///     The DependencyProperty for the Minimum property.
        ///     Flags:              none
        ///     Default Value:      0 
        /// </summary>
//        public static readonly DependencyProperty 
        MinimumProperty:
        {
        	get:function(){
        		if(RangeBase._ValueChangedEvent === undefined){
        			RangeBase._ValueChangedEvent = 
                        DependencyProperty.Register( 
                                "Minimum",
                                Number.Type, 
                                RangeBase.Type,
                                /*new FrameworkPropertyMetadata(
                                        0.0,
                                        new PropertyChangedCallback(null, OnMinimumChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                        0.0,
                                        new PropertyChangedCallback(null, OnMinimumChanged)), 
                                new ValidateValueCallback(null, IsValidDoubleValue));  
        		}
        		
        		return RangeBase._ValueChangedEvent;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the Maximum property. 
        ///     Flags:              none
        ///     Default Value:      1
        /// </summary>
//        public static readonly DependencyProperty 
        MaximumProperty:
        {
        	get:function(){
        		if(RangeBase._ValueChangedEvent === undefined){
        			RangeBase._ValueChangedEvent = 
                        DependencyProperty.Register(
                                "Maximum", 
                                Number.Type, 
                                RangeBase.Type,
                                new FrameworkPropertyMetadata( 
                                        1.0,
                                        new PropertyChangedCallback(OnMaximumChanged),
                                        new CoerceValueCallback(CoerceMaximum)),
                                new ValidateValueCallback(IsValidDoubleValue)); 
        		}
        		
        		return RangeBase._ValueChangedEvent;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the Value property. 
        ///     Flags:              None
        ///     Default Value:      0
        /// </summary>
//        public static readonly DependencyProperty 
        ValueProperty:
        {
        	get:function(){
        		if(RangeBase._ValueChangedEvent === undefined){
        			RangeBase._ValueChangedEvent = 
                        DependencyProperty.Register(
                                "Value", 
                                Number.Type, 
                                RangeBase.Type,
                                /*new FrameworkPropertyMetadata( 
                                        0.0,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(OnValueChanged),
                                        new CoerceValueCallback(ConstrainToRange))*/
                                FrameworkPropertyMetadata.Build4( 
                                        0.0,
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(null, OnValueChanged),
                                        new CoerceValueCallback(null, ConstrainToRange)), 
                                new ValidateValueCallback(null, IsValidDoubleValue));
        		}
        		
        		return RangeBase._ValueChangedEvent;
        	}
        }, 
 
        /// <summary> 
        ///     The DependencyProperty for the LargeChange property.
        /// </summary>
//        public static readonly DependencyProperty 
        LargeChangeProperty:
        {
        	get:function(){
        		if(RangeBase._ValueChangedEvent === undefined){
        			RangeBase._ValueChangedEvent = DependencyProperty.Register("LargeChange", Number.Type, RangeBase.Type, 
                            /*new FrameworkPropertyMetadata(1.0)*/
        					FrameworkPropertyMetadata.BuildWithDV(1.0),
                            new ValidateValueCallback(null, IsValidChange));  
        		}
        		
        		return RangeBase._ValueChangedEvent;
        	}
        },
             
 
        /// <summary> 
        ///     The DependencyProperty for the SmallChange property.
        /// </summary>
//        public static readonly DependencyProperty 
        SmallChangeProperty:
        {
        	get:function(){
        		if(RangeBase._ValueChangedEvent === undefined){
        			RangeBase._ValueChangedEvent = DependencyProperty.Register("SmallChange", Number.Type, RangeBase.Type, 
                            /*new FrameworkPropertyMetadata(0.1)*/
        					FrameworkPropertyMetadata.BuildWithDV(1.0),
                            new ValidateValueCallback(null, IsValidChange)); 
        		}
        		
        		return RangeBase._ValueChangedEvent;
        	}
        },
		  
	});

    /// <summary>
    ///     Called when MinimumProperty is changed on "d." 
    /// </summary>
//    private static void 
    function OnMinimumChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        RangeBase ctrl = (RangeBase) d; 

//        RangeBaseAutomationPeer peer = UIElementAutomationPeer.FromElement(ctrl) as RangeBaseAutomationPeer; 
//        if (peer != null) 
//        {
//            peer.RaiseMinimumPropertyChangedEvent((double)e.OldValue, (double)e.NewValue); 
//        }

        d.CoerceValue(RangeBase.MaximumProperty);
        d.CoerceValue(RangeBase.ValueProperty); 
        d.OnMinimumChanged(e.OldValue, e.NewValue);
    } 

//    private static object 
    function CoerceMaximum(/*DependencyObject*/ d, /*object*/ value) 
    { 
//        RangeBase ctrl = (RangeBase) d;
        /*double*/var min = d.Minimum; 
        if (value < min)
        {
            return min;
        } 
        return value;
    } 

    /// <summary> 
    ///     Called when MaximumProperty is changed on "d."
    /// </summary>
//    private static void 
    function OnMaximumChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        RangeBase ctrl = (RangeBase) d;

//        RangeBaseAutomationPeer peer = UIElementAutomationPeer.FromElement(ctrl) as RangeBaseAutomationPeer; 
//        if (peer != null)
//        { 
//            peer.RaiseMaximumPropertyChangedEvent((double)e.OldValue, (double)e.NewValue);
//        }

        d.CoerceValue(RangeBase.ValueProperty); 
        d.OnMaximumChanged(e.OldValue, e.NewValue);
    }
    // made this internal because Slider wants to leverage it 
//    internal static object 
    RangeBase.ConstrainToRange = function(/*DependencyObject*/ d, /*object*/ value)
    { 
//        RangeBase ctrl = (RangeBase) d;
        /*double*/var min = d.Minimum;
        /*double*/var v = value;
        if (v < min) 
        {
            return min; 
        } 

        /*double*/var max = d.Maximum; 
        if (v > max)
        {
            return max;
        } 

        return value; 
    };

    /// <summary>
    ///     Called when ValueID is changed on "d."
    /// </summary>
//    private static void 
    function OnValueChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        RangeBase ctrl = (RangeBase)d; 
//
//        RangeBaseAutomationPeer peer = UIElementAutomationPeer.FromElement(ctrl) as RangeBaseAutomationPeer;
//        if (peer != null) 
//        {
//            peer.RaiseValuePropertyChangedEvent((double)e.OldValue, (double)e.NewValue);
//        }

        d.OnValueChanged(e.OldValue, e.NewValue);
    } 

    /// <summary>
    /// Validate input value in RangeBase (Minimum, Maximum, and Value).
    /// </summary> 
    /// <param name="value"></param>
    /// <returns>Returns False if value is NaN or NegativeInfinity or PositiveInfinity. Otherwise, returns True.</returns> 
//    private static bool 
    function IsValidDoubleValue(/*object*/ value) 
    {
//        double d = (double)value; 

        return !(Number.IsNaN(d) || Number.IsInfinity(d));
    }

    /// <summary>
    /// Validate input value in RangeBase (SmallChange and LargeChange). 
    /// </summary> 
    /// <param name="value"></param>
    /// <returns>Returns False if value is NaN or NegativeInfinity or PositiveInfinity or negative. Otherwise, returns True.</returns> 
//    private static bool 
    function IsValidChange(/*object*/ value)
    {
//        double d = (double)value;

        return IsValidDoubleValue(value) && value >= 0.0;
    } 
    
    /// <summary> 
    /// This is the static constructor for the RangeBase class.  It
    /// hooks the changed notifications needed for visual state changes.
    /// </summary>
//    static RangeBase() 
    function Initialize()
    {
        UIElement.IsEnabledProperty.OverrideMetadata(RangeBase.Type, 
        		new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
        UIElement.IsMouseOverPropertyKey.OverrideMetadata(RangeBase.Type, 
        		new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
    }
	
	RangeBase.Type = new Type("RangeBase", RangeBase, [Control.Type]);
	Initialize();
	
	return RangeBase;
});
