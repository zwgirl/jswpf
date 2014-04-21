/**
 * Button
 */

define(["dojo/_base/declare", "system/Type", "primitives/ButtonBase"], 
		function(declare, Type, ButtonBase){
	var Button = declare("Button", ButtonBase, {
		constructor:function(){
		},
//        private void 
        OnFocusChanged:function(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e) 
        {
            this.UpdateIsDefaulted(Keyboard.FocusedElement);
        },
        
//      public bool 
//        ApplyTemplate:function() 
//        {
//        	ButtonBase.prototype.ApplyTemplate.call(this);
//        },
  
//        private void 
        UpdateIsDefaulted:function(/*IInputElement*/ focus)
        { 
            // If it's not a default button, or nothing is focused, or it's disabled then it's not defaulted. 
            if (!IsDefault || focus == null || !IsEnabled)
            { 
            	this.SetValue(IsDefaultedPropertyKey, BooleanBoxes.FalseBox);
                return;
            }
 
            /*DependencyObject*/var focusDO = focus instanceof DependencyObject ? focus : null;
            /*object*/var thisScope, focusScope; 
 
            // If the focused thing is not in this scope then IsDefaulted = false
            /*AccessKeyPressedEventArgs*/var e; 

            /*object*/var isDefaulted = false;
            try
            { 
                // Step 1: Determine the AccessKey scope from currently focused element
                e = new AccessKeyPressedEventArgs(); 
                focus.RaiseEvent(e); 
                focusScope = e.Scope;
 
                // Step 2: Determine the AccessKey scope from this button
                e = new AccessKeyPressedEventArgs();
                this.RaiseEvent(e);
                thisScope = e.Scope; 

                // Step 3: Compare scopes 
                if (thisScope == focusScope && (focusDO == null || focusDO.GetValue(KeyboardNavigation.AcceptsReturnProperty) == false)) 
                {
                    isDefaulted = true; 
                }
            }
            finally
            { 
            	this.SetValue(IsDefaultedPropertyKey, isDefaulted);
            } 
 
        },

        /// <summary> 
        /// This method is called when button is clicked.
        /// </summary> 
//        protected override void 
        OnClick:function() 
        {
            // base.OnClick should be called first. 
            // Our default command for Cancel Button to close dialog should happen
            // after Button's click event handler has been called. 
            // If there is excption and it's a Cancel button and RoutedCommand is null,
            // We will raise Window.DialogCancelCommand.
            try
            { 
                ButtonBase.prototype.OnClick.call(this);
            } 
            finally 
            {
                // When the Button RoutedCommand is null, if it's a Cancel Button, Window.DialogCancelCommand will 
                // be the default command. Do not assign Window.DialogCancelCommand to Button.Command.
                // If in Button click handler user nulls the Command, we still want to provide the default behavior.
                if ((this.Command == null) && this.IsCancel)
                { 
                    // Can't invoke Window.DialogCancelCommand directly. Have to raise event.
                    // Filed bug 936090: Commanding perf issue: can't directly invoke a command. 
                    CommandHelpers.ExecuteCommand(Window.DialogCancelCommand, null, this); 
                }
            } 
        }
	});
	
	Object.defineProperties(Button.prototype,{

        /// <summary>
        /// Specifies whether or not this button is the default button.
        /// </summary> 
        /// <value></value>
//	        public bool 
        IsDefault: 
        { 
            get:function() { return  this.GetValue(Button.IsDefaultProperty); },
            set:function(value) { this.SetValue(Button.IsDefaultProperty, value); } 
        },

        /// <summary>
        /// Specifies whether or not this button is the cancel button. 
        /// </summary>
        /// <value></value> 
//	        public bool 
        IsCancel:
        {
            get:function() { return  this.GetValue(Button.IsCancelProperty); }, 
            set:function(value) { this.SetValue(Button.IsCancelProperty, value); }
        },

        /// <summary> 
        /// Specifies whether or not this button is the button that would be invoked when Enter is pressed.
        /// </summary>
        /// <value></value>
//	        public bool 
        IsDefaulted:
        {
            get:function() 
            { 
                return this.GetValue(Button.IsDefaultedProperty);
            } 
        },

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
//	        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return this._dType; }
        } 
	});
	
	Object.defineProperties(Button,{

	 
	        /// <summary>
	        ///     The DependencyProperty for the IsDefault property.
	        ///     Flags:              None
	        ///     Default Value:      false 
	        /// </summary>
//	        public static readonly DependencyProperty 
	        IsDefaultProperty:
	        {
	        	get:function(){
	        		if(Button._IsDefaultProperty === undefined){
	        			Button._IsDefaultProperty= DependencyProperty.Register("IsDefault", Boolean.Type, Button.Type, 
                                new FrameworkPropertyMetadata(false,
                                        new PropertyChangedCallback(OnIsDefaultChanged))); 
	        		}
	        		return Button._IsDefaultProperty;
	        	}
	        },
	            

	        /// <summary> 
	        ///     The DependencyProperty for the IsCancel property.
	        ///     Flags:              None 
	        ///     Default Value:      false
	        /// </summary>
//	        public static readonly DependencyProperty 
	        IsCancelProperty:
	        {
	        	get:function(){
	        		if(Button._IsCancelProperty === undefined){
	        			Button._IsCancelProperty=
	    	                DependencyProperty.Register( 
	    	                        "IsCancel",
	    	                        Boolean.Type, 
	    	                        Button.Type, 
	    	                        new FrameworkPropertyMetadata(
	    	                                false, 
	    	                                new PropertyChangedCallback(OnIsCancelChanged))); 
	        		}
	        		return Button._IsCancelProperty;
	        	}
	        },
	

	        /// <summary>
	        ///     The key needed set a read-only property. 
	        /// </summary>
//	        private static readonly DependencyPropertyKey 
	        IsDefaultedPropertyKey:
	        {
	        	get:function(){
	        		if(Button._IsDefaultedPropertyKey === undefined){
	        			Button._IsDefaultedPropertyKey= DependencyProperty.RegisterReadOnly("IsDefaulted", Boolean.Type, Button.Type, 
                                new FrameworkPropertyMetadata(false)); 
	        		}
	        		return Button._IsDefaultedPropertyKey;
	        	}
	        },
	            
	 
	        /// <summary>
	        ///     The DependencyProperty for the IsDefaulted property.
	        ///     Flags:              None
	        ///     Default Value:      false 
	        /// </summary>
//	        public static readonly DependencyProperty 
	        IsDefaultedProperty:
	        {
	        	get:function(){
	        		if(Button._IsDefaultedProperty === undefined){
	        			Button._IsDefaultedProperty = IsDefaultedPropertyKey.DependencyProperty;  
	        		}
	        		return Button._IsDefaultedProperty;
	        	}
	        },
	            

	 
	        // This field is used to hang on to the event handler that we
	        // hand out to KeyboardNavigation.  On the KeyNav side it's tracked 
	        // as a WeakReference so when we hand it out we need to make sure
	        // that we hold a strong reference ourselves.  We only need this
	        // handler when we are a Default button (very uncommon).
//	        private static readonly UncommonField<KeyboardFocusChangedEventHandler> 
	        FocusChangedEventHandlerField:
	        {
	        	get:function(){
	        		if(Button._FocusChangedEventHandlerField === undefined){
	        			Button._FocusChangedEventHandlerField= new UncommonField/*<KeyboardFocusChangedEventHandler>*/(); 
	        		}
	        		return Button._FocusChangedEventHandlerField;
	        	}
	        }
	        	 

	 
//	        private static DependencyObjectType _dType;
	});
	
//    static Button() 
//    {
//        DefaultStyleKeyProperty.OverrideMetadata(typeof(Button), new FrameworkPropertyMetadata(typeof(Button))); 
//        _dType = DependencyObjectType.FromSystemTypeInternal(typeof(Button));
//
//        // WORKAROUND: the following if statement is a workaround to get the ButtonBase cctor to run before we
//        // override metadata. 
//        if (ButtonBase.CommandProperty != null)
//        { 
//            IsEnabledProperty.OverrideMetadata(typeof(Button), new FrameworkPropertyMetadata(new PropertyChangedCallback(OnIsEnabledChanged))); 
//        }
//    } 


//    private static void 
    function OnIsDefaultChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*Button*/var b = d instanceof Button ? d : null;
        /*KeyboardFocusChangedEventHandler*/var focusChangedEventHandler = FocusChangedEventHandlerField.GetValue(b); 
        if (focusChangedEventHandler == null) 
        {
            focusChangedEventHandler = new KeyboardFocusChangedEventHandler(b.OnFocusChanged); 
            FocusChangedEventHandlerField.SetValue(b, focusChangedEventHandler);
        }

        if ( e.NewValue) 
        {
            AccessKeyManager.Register("\x000D", b); 
            KeyboardNavigation.Current.FocusChanged += focusChangedEventHandler; 
            b.UpdateIsDefaulted(Keyboard.FocusedElement);
        } 
        else
        {
            AccessKeyManager.Unregister("\x000D", b);
            KeyboardNavigation.Current.FocusChanged -= focusChangedEventHandler; 
            b.UpdateIsDefaulted(null);
        } 
    } 

//    private static void 
    function OnIsEnabledChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        // This value is cached in FE, so all we have to do here is look at the new value
        /*Button*/var b = d;

        // If it's not a default button we don't need to update the IsDefaulted property
        if (b.IsDefault) 
        { 
            b.UpdateIsDefaulted(Keyboard.FocusedElement);
        } 
    }

//    private static void 
    function OnIsCancelChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*Button*/var b = d instanceof Button ? d : null;
        if ( e.NewValue) 
        {
            AccessKeyManager.Register("\x001B", b); 
        }
        else
        {
            AccessKeyManager.Unregister("\x001B", b); 
        }
    } 
	
	Button.Type = new Type("Button", Button, [ButtonBase.Type]);
	return Button;
});

 
 
