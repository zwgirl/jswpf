/**
 * ToggleButton
 */

define(["dojo/_base/declare", "system/Type", "primitives/ButtonBase", "windows/EventManager", "windows/RoutingStrategy",
        "windows/RoutedEventHandler", "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions",
        "windows/PropertyChangedCallback"], 
		function(declare, Type, ButtonBase, EventManager, RoutingStrategy,
				RoutedEventHandler, FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions,
				PropertyChangedCallback){
	
//    private static DependencyObjectType 
	var _dType = null; 
    
	var ToggleButton = declare("ToggleButton", ButtonBase,{
		constructor:function(){
		},
		

        /// <summary>
        ///     Add / Remove Checked handler 
        /// </summary>
//        public event RoutedEventHandler Checked
//        { 
//            add
//            { 
//                AddHandler(CheckedEvent, value); 
//            }
// 
//            remove
//            {
//                RemoveHandler(CheckedEvent, value);
//            } 
//        }
		
        AddChecked:function(value)
        { 
            this.AddHandler(ToggleButton.CheckedEvent, value); 
        },

        RemoveChecked:function(value)
        {
        	this.RemoveHandler(ToggleButton.CheckedEvent, value);
        }, 
 
        /// <summary> 
        ///     Add / Remove Unchecked handler
        /// </summary> 
//        public event RoutedEventHandler Unchecked
//        {
//            add 
//            {
//                AddHandler(UncheckedEvent, value); 
//            } 
//
//            remove 
//            {
//                RemoveHandler(UncheckedEvent, value);
//            }
//        } 
		
        AddUnchecked:function(value) 
        {
            this.AddHandler(ToggleButton.UncheckedEvent, value); 
        }, 

        RemoveUnchecked:function(value) 
        {
        	this.RemoveHandler(ToggleButton.UncheckedEvent, value);
        },

        /// <summary> 
        ///     Add / Remove Indeterminate handler 
        /// </summary>
//        public event RoutedEventHandler Indeterminate
//        {
//            add
//            { 
//                AddHandler(IndeterminateEvent, value);
//            } 
// 
//            remove
//            { 
//                RemoveHandler(IndeterminateEvent, value);
//            }
//        },
        
        AddIndeterminate:function(value)
        { 
            this.AddHandler(ToggleButton.IndeterminateEvent, value);
        }, 

        RemoveIndeterminate:function(value)
        { 
        	this.RemoveHandler(ToggleButton.IndeterminateEvent, value);
        },
        
        /// <summary>
        ///     Called when IsChecked becomes true. 
        /// </summary>
        /// <param name="e">Event arguments for the routed event that is raised by the default implementation of this method.</param>
//        protected virtual void 
        OnChecked:function(/*RoutedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        },
 
        /// <summary>
        ///     Called when IsChecked becomes false. 
        /// </summary>
        /// <param name="e">Event arguments for the routed event that is raised by the default implementation of this method.</param>
//        protected virtual void 
        OnUnchecked:function(/*RoutedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        }, 
 
        /// <summary>
        ///     Called when IsChecked becomes null. 
        /// </summary>
        /// <param name="e">Event arguments for the routed event that is raised by the default implementation of this method.</param>
//        protected virtual void 
        OnIndeterminate:function(/*RoutedEventArgs*/ e)
        { 
            this.RaiseEvent(e);
        },
        
        /// <summary> 
        /// This override method is called when the control is clicked by mouse or keyboard
        /// </summary> 
//        protected override void 
        OnClick:function()
        {
            this.OnToggle();
            ButtonBase.prototype.OnClick.call(this); 
        },

//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        {
        	ButtonBase.prototype.ChangeVisualState.call(this, useTransitions); 

            // Update the Check state group 
            var isChecked = this.IsChecked; 
            if (isChecked == true)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateChecked, useTransitions);
            }
            else if (isChecked == false)
            { 
                VisualStateManager.GoToState(this, VisualStates.StateUnchecked, useTransitions);
            } 
            else 
            {
                // isChecked is null 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateIndeterminate, VisualStates.StateUnchecked);
            }
        },
 
        /// <summary>
        ///     Gives a string representation of this object. 
        /// </summary> 
//        public override string 
        ToString:function()
        { 
            var typeText = this.GetType().ToString();
            var contentText = String.Empty;
            /*bool?*/var isChecked = false;
            /*bool*/var valuesDefined = false; 

//            // Accessing ToggleButton properties may be thread sensitive 
//            if (CheckAccess()) 
//            {
//                contentText = GetPlainText(); 
//                isChecked = IsChecked;
//                valuesDefined = true;
//            }
//            else 
//            {
//                //Not on dispatcher, try posting to the dispatcher with 20ms timeout 
//                Dispatcher.Invoke(DispatcherPriority.Send, new TimeSpan(0, 0, 0, 0, 20), new DispatcherOperationCallback(delegate(object o) 
//                {
//                    contentText = GetPlainText(); 
//                    isChecked = IsChecked;
//                    valuesDefined = true;
//                    return null;
//                }), null); 
//            }
// 
//            // If Content and isChecked are defined 
//            if (valuesDefined)
//            { 
//                return SR.Get(SRID.ToStringFormatString_ToggleButton, typeText, contentText, isChecked.HasValue ? isChecked.Value.ToString() : "null");
//            }

            // Not able to access the dispatcher 
            return typeText;
        }, 

        /// <summary>
        /// This vitrual method is called from OnClick(). ToggleButton toggles IsChecked property. 
        /// Subclasses can override this method to implement their own toggle behavior
        /// </summary> 
//        protected internal virtual void 
        OnToggle:function() 
        {
            // If IsChecked == true && IsThreeState == true   --->  IsChecked = null 
            // If IsChecked == true && IsThreeState == false  --->  IsChecked = false
            // If IsChecked == false                          --->  IsChecked = true
            // If IsChecked == null                           --->  IsChecked = false
            /*bool?*/var isChecked; 
            if (this.IsChecked == true)
                isChecked = this.IsThreeState ? /*(bool?)*/null : /*(bool?)*/false; 
            else // false or null 
                isChecked = !this.IsChecked; // HasValue returns true if IsChecked==false
            
            try{
            	this.SetCurrentValueInternal(ToggleButton.IsCheckedProperty, isChecked); 
            }catch(ex){
            	console.log(ex);
            }
            
        }
	});
	
	Object.defineProperties(ToggleButton.prototype,{
	       /// <summary>
        ///     Indicates whether the ToggleButton is checked
        /// </summary> 
//        public bool? 
		IsChecked:
        { 
            get:function()
            {
                // Because Nullable<bool> unboxing is very slow (uses reflection) first we cast to bool
//                var value = GetValue(IsCheckedProperty); 
//                if (value == null)
//                    return new Nullable<bool>(); 
//                else 
//                    return new Nullable<bool>((bool)value);
            	return this.GetValue(ToggleButton.IsCheckedProperty); 
            },
            set:function(value)
            {
                this.SetValue(ToggleButton.IsCheckedProperty, value/*.HasValue ? BooleanBoxes.Box(value.Value) : null*/);
            } 
        },
        
        /// <summary>
        ///     The IsThreeState property determines whether the control supports two or three states.
        ///     IsChecked property can be set to null as a third state when IsThreeState is true 
        /// </summary>
//        public bool 
        IsThreeState:
        {
            get:function() { return this.GetValue(ToggleButton.IsThreeStateProperty); },
            set:function(value) { this.SetValue(ToggleButton.IsThreeStateProperty, value); }
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return _dType; }
        }
	});
	
	Object.defineProperties(ToggleButton,{
        /// <summary>
        ///     Checked event
        /// </summary> 
//        public static readonly RoutedEvent 
		CheckedEvent:
        {
        	get:function(){
        		if(ToggleButton._CheckedEvent === undefined){
        			ToggleButton._CheckedEvent= EventManager.RegisterRoutedEvent("Checked", RoutingStrategy.Bubble, 
        	        		RoutedEventHandler.Type, ToggleButton.Type);
        		}
        		
        		return ToggleButton._CheckedEvent;
        	}
        	 
        }, 
 
        /// <summary> 
        ///     Unchecked event
        /// </summary> 
//        public static readonly RoutedEvent 
		UncheckedEvent:
        {
        	get:function(){
        		if(ToggleButton._UncheckedEvent === undefined){
        			ToggleButton._UncheckedEvent = EventManager.RegisterRoutedEvent("Unchecked", RoutingStrategy.Bubble, 
        	        		RoutedEventHandler.Type, ToggleButton.Type);
        		}
        		
        		return ToggleButton._UncheckedEvent;
        	}
        	 
        },

        /// <summary>
        ///     Indeterminate event 
        /// </summary>
//        public static readonly RoutedEvent 
		IndeterminateEvent:
        {
        	get:function(){
        		if(ToggleButton._IndeterminateEvent === undefined){
        			ToggleButton._IndeterminateEvent = EventManager.RegisterRoutedEvent("Indeterminate", RoutingStrategy.Bubble, 
        	        		RoutedEventHandler.Type, ToggleButton.Type);  
        		}
        		
        		return ToggleButton._IndeterminateEvent;
        	}
        	 
        },
        
        /// <summary>
        ///     The DependencyProperty for the IsChecked property. 
        ///     Flags:              BindsTwoWayByDefault 
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
		IsCheckedProperty:
        {
        	get:function(){
        		if(ToggleButton._IsCheckedProperty === undefined){
        			ToggleButton._IsCheckedProperty =
                        DependencyProperty.Register(
                                "IsChecked",
                                Boolean.Type, 
                                ToggleButton.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault 
                                        | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(null, OnIsCheckedChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault 
                                        | FrameworkPropertyMetadataOptions.Journal,
                                        new PropertyChangedCallback(null, OnIsCheckedChanged))); 
        		}
        		
        		return ToggleButton._IsCheckedProperty;
        	}
        	 
        }, 
        
        /// <summary>
        ///     The DependencyProperty for the IsThreeState property. 
        ///     Flags:              None
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty 
		IsThreeStateProperty:
        {
        	get:function(){
        		if(ToggleButton._IsThreeStateProperty === undefined){
        			ToggleButton._IsThreeStateProperty = 
                        DependencyProperty.Register(
                                "IsThreeState", 
                                Boolean.Type, 
                                ToggleButton.Type,
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false));
        		}
        		
        		return ToggleButton._IsThreeStateProperty;
        	}
        	 
        }, 
	});
	
//    static ToggleButton() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(ToggleButton.Type, 
        		/*new FrameworkPropertyMetadata(ToggleButton.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(ToggleButton.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(ToggleButton.Type);
    } 
	
//    private static object 
	function OnGetIsChecked(/*DependencyObject*/ d) {return d.IsChecked;} 

    /// <summary> 
    ///     Called when IsChecked is changed on "d."
    /// </summary>
    /// <param name="d">The object on which the property was changed.</param>
    /// <param name="e">EventArgs that contains the old and new values for this property</param> 
//    private static void 
	function OnIsCheckedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        ToggleButton button = (ToggleButton)d; 
        /*bool?*/var oldValue = e.OldValue;
        /*bool?*/var newValue = e.NewValue; 

        if (newValue == true)
        {
            d.OnChecked(new RoutedEventArgs(ToggleButton.CheckedEvent));
        } 
        else if (newValue == false)
        { 
            d.OnUnchecked(new RoutedEventArgs(ToggleButton.UncheckedEvent)); 
        }
        else 
        {
            d.OnIndeterminate(new RoutedEventArgs(ToggleButton.IndeterminateEvent));
        }

        d.UpdateVisualState();
    } 
	
	ToggleButton.Type = new Type("ToggleButton", ToggleButton, [ButtonBase.Type]);
	Initialize();
	
	return ToggleButton;
});