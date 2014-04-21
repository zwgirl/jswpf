/**
 * ButtonBase
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentControl", "internal.commands/CommandHelpers"
        , "windows/RoutedEventArgs", "controls/ClickMode", "input/ICommand", "input/ICommandSource",
        "input/CanExecuteChangedEventManager", "windows/UIElement", "input/MouseButtonState"], 
		function(declare, Type, ContentControl, CommandHelpers
				, RoutedEventArgs, ClickMode, ICommand, ICommandSource,
				CanExecuteChangedEventManager, UIElement, MouseButtonState){
	var ButtonBase = declare("ButtonBase", [ContentControl, ICommandSource], {
		constructor:function(){
			
        	this._dom = window.document.createElement('div');
        	this._dom.id = 'ButtonBase';
        	this._dom._source = this;
        	this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},

        /// <summary>
        /// This virtual method is called when button is clicked and it raises the Click event 
        /// </summary>
//        protected virtual void 
        OnClick:function()
        {
            /*RoutedEventArgs*/
        	var newEvent = new RoutedEventArgs(ButtonBase.ClickEvent, this); 
        	this.RaiseEvent(newEvent);
 
            CommandHelpers.ExecuteCommandSource(this); 
        },
        /// <summary>
        ///     This method is invoked when the IsPressed property changes.
        /// </summary> 
        /// <param name="e">DependencyPropertyChangedEventArgs.</param>
//        protected virtual void 
        OnIsPressedChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        { 
        	Control.OnVisualStatePropertyChanged(this, e);
        },


//        private void 
        SetIsPressed:function(/*bool*/ pressed) 
        {
            if (pressed)
            {
                this.SetValue(ButtonBase.IsPressedPropertyKey, pressed); 
            }
            else 
            { 
            	this.ClearValue(ButtonBase.IsPressedPropertyKey);
            } 
        },

//        private void 
        OnCommandChanged:function(/*ICommand*/ oldCommand, /*ICommand*/ newCommand)
        { 
            if (oldCommand != null)
            {
                this.UnhookCommand(oldCommand);
            } 
            if (newCommand != null)
            { 
            	this.HookCommand(newCommand); 
            }
        }, 

//        private void 
        UnhookCommand:function(/*ICommand*/ command)
        {
            CanExecuteChangedEventManager.RemoveHandler(command, this.OnCanExecuteChanged); 
            this.UpdateCanExecute();
        },
 
//        private void 
        HookCommand:function(/*ICommand*/ command)
        { 
            CanExecuteChangedEventManager.AddHandler(command, this.OnCanExecuteChanged);
            this.UpdateCanExecute();
        },
 
//        private void 
        OnCanExecuteChanged:function(/*object*/ sender, /*EventArgs*/ e)
        { 
        	this.UpdateCanExecute(); 
        },
 
//        private void 
        UpdateCanExecute:function()
        {
            if (this.Command != null)
            { 
            	this.CanExecute = CommandHelpers.CanExecuteCommandSource(this);
            } 
            else 
            {
            	this.CanExecute = true; 
            }
        },

        /// This is the method that responds to the MouseButtonEvent event.
        /// </summary> 
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            // Ignore when in hover-click mode.
            if (this.ClickMode != ClickMode.Hover)
            {
                e.Handled = true; 

                // Always set focus on itself 
                // In case ButtonBase is inside a nested focus scope we should restore the focus OnLostMouseCapture 
                this.Focus();
 
                // It is possible that the mouse state could have changed during all of
                // the call-outs that have happened so far.
                if (e.ButtonState == MouseButtonState.Pressed)
                { 
                    // Capture the mouse, and make sure we got it.
                    // WARNING: callout 
                	this.CaptureMouse(); 
                    if (this.IsMouseCaptured)
                    { 
                        // Though we have already checked this state, our call to CaptureMouse
                        // could also end up changing the state, so we check it again.
                        if (e.ButtonState == MouseButtonState.Pressed)
                        { 
                            if (!this.IsPressed)
                            { 
                            	this. SetIsPressed(true); 
                            }
                        } 
                        else
                        {
                            // Release capture since we decided not to press the button.
                        	this.ReleaseMouseCapture(); 
                        }
                    } 
                } 

                if (this.ClickMode == ClickMode.Press) 
                {
                    /*bool*/var exceptionThrown = true;
                    try
                    { 
                    	this.OnClick();
                        exceptionThrown = false; 
                    } 
                    finally
                    { 
                        if (exceptionThrown)
                        {
                            // Cleanup the buttonbase state
                        	this.SetIsPressed(false); 
                        	this.ReleaseMouseCapture();
                        } 
                    } 
                }
            } 

            ContentControl.prototype.OnMouseLeftButtonDown.call(this, e);
        },
 
        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event. 
        /// </summary> 
        /// <param name="e">Event arguments</param>
//        protected override void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) 
        {
            // Ignore when in hover-click mode.
            if (this.ClickMode != ClickMode.Hover)
            { 
                e.Handled = true;
                var shouldClick = !this.IsSpaceKeyDown && this.IsPressed && this.ClickMode == ClickMode.Release; 
 
                if (this.IsMouseCaptured && !this.IsSpaceKeyDown)
                { 
                	this.ReleaseMouseCapture();
                }

                if (shouldClick) 
                {
                	this.OnClick(); 
                } 
            }
 
            ContentControl.prototype.OnMouseLeftButtonUp.call(this, e);
        },

        /// <summary> 
        /// This is the method that responds to the MouseEvent event.
        /// </summary> 
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnMouseMove:function(/*MouseEventArgs*/ e)
        { 
        	ContentControl.prototype.OnMouseMove.call(this, e);
            if ((this.ClickMode != ClickMode.Hover) &&
                ((this.IsMouseCaptured && (Mouse.PrimaryDevice.LeftButton == MouseButtonState.Pressed) && !this.IsSpaceKeyDown)))
            { 
            	this.UpdateIsPressed();
 
                e.Handled = true; 
            }
        }, 

        /// <summary>
        ///     Called when this element loses mouse capture.
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnLostMouseCapture:function(/*MouseEventArgs*/ e) 
        { 
            ContentControl.prototype.OnLostMouseCapture.call(this, e);
 
            if ((e.OriginalSource == this) && (this.ClickMode != ClickMode.Hover) && !this.IsSpaceKeyDown)
            {
                // If we are inside a nested focus scope - we should restore the focus to the main focus scope
                // This will cover the scenarios like ToolBar buttons 
                if (this.IsKeyboardFocused && !this.IsInMainFocusScope)
                    Keyboard.Focus(null); 
 
                // When we lose capture, the button should not look pressed anymore
                // -- unless the spacebar is still down, in which case we are still pressed. 
                this.SetIsPressed(false);
            }
        },
 
        /// <summary>
        ///     An event reporting the mouse entered this element. 
        /// </summary> 
        /// <param name="e">Event arguments</param>
//        protected override void 
        OnMouseEnter:function(/*MouseEventArgs*/ e) 
        {
            ContentControl.prototype.OnMouseEnter.call(this, e);
            if (this.HandleIsMouseOverChanged())
            { 
                e.Handled = true;
            } 
        }, 

        /// <summary> 
        ///     An event reporting the mouse left this element.
        /// </summary>
        /// <param name="e">Event arguments</param>
//        protected override void 
        OnMouseLeave:function(/*MouseEventArgs*/ e) 
        {
        	ContentControl.prototype.OnMouseLeave.call(this, e); 
            if (this.HandleIsMouseOverChanged()) 
            {
                e.Handled = true; 
            }
        },

        /// <summary> 
        ///     An event reporting that the IsMouseOver property changed.
        /// </summary> 
//        private bool 
        HandleIsMouseOverChanged:function() 
        {
            if (this.ClickMode == ClickMode.Hover) 
            {
                if (this.IsMouseOver)
                {
                    // Hovering over the button will click in the OnHover click mode 
                	this.SetIsPressed(true);
                    this.OnClick(); 
                } 
                else
                { 
                	this.SetIsPressed(false);
                }

                return true; 
            }
 
            return false; 
        },
 
        /// <summary>
        /// This is the method that responds to the KeyDown event.
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
        	ContentControl.prototype.OnKeyDown.call(this, e); 

            if (this.ClickMode == ClickMode.Hover) 
            {
                // Ignore when in hover-click mode.
                return;
            } 

            if (e.Key == Key.Space) 
            { 
                // Alt+Space should bring up system menu, we shouldn't handle it.
                if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Alt)) != ModifierKeys.Alt) 
                {
                    if ((!this.IsMouseCaptured) && (e.OriginalSource == this))
                    {
                    	this.IsSpaceKeyDown = true; 
                    	this.SetIsPressed(true);
                    	this.CaptureMouse(); 
 
                        if (this.ClickMode == ClickMode.Press)
                        { 
                    		console.log("OnClick");
                        	this.OnClick();
                        }

                        e.Handled = true; 
                    }
                } 
            } 
            else if (e.Key == Key.Enter && this.GetValue(KeyboardNavigation.AcceptsReturnProperty))
            { 
                if (e.OriginalSource == this)
                {
                	this.IsSpaceKeyDown = false;
                	this.SetIsPressed(false); 
                    if (this.IsMouseCaptured)
                    { 
                    	this.ReleaseMouseCapture(); 
                    }
 
                    this.OnClick();
                    e.Handled = true;
                }
            } 
            else
            { 
                // On any other key we set IsPressed to false only if Space key is pressed 
                if (this.IsSpaceKeyDown)
                { 
                	this.SetIsPressed(false);
                	this.IsSpaceKeyDown = false;
                    if (this.IsMouseCaptured)
                    { 
                    	this.ReleaseMouseCapture();
                    } 
                } 
            }
        }, 

        /// <summary>
        /// This is the method that responds to the KeyUp event.
        /// </summary> 
        /// <param name="e">Event arguments</param>
//        protected override void 
        OnKeyUp:function(/*KeyEventArgs*/ e) 
        { 
        	ContentControl.prototype.OnKeyUp.call(this, e);
 
            if (this.ClickMode == ClickMode.Hover)
            {
                // Ignore when in hover-click mode.
                return; 
            }
 
            if ((e.Key == Key.Space) && this.IsSpaceKeyDown) 
            {
                // Alt+Space should bring up system menu, we shouldn't handle it. 
                if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Alt)) != ModifierKeys.Alt)
                {
                	this.IsSpaceKeyDown = false;
                    if (this.GetMouseLeftButtonReleased()) 
                    {
                        var shouldClick = this.IsPressed && this.ClickMode == ClickMode.Release; 
 
                        // Release mouse capture if left mouse button is not pressed
                        if (this.IsMouseCaptured) 
                        {
                            // OnLostMouseCapture set IsPressed to false
                        	this.ReleaseMouseCapture();
                        } 

                        if (shouldClick) 
                        	this.OnClick(); 
                    }
                    else 
                    {
                        // IsPressed state is updated only if mouse is captured (bugfix 919349)
                        if (this.IsMouseCaptured)
                        	this.UpdateIsPressed(); 
                    }
 
                    e.Handled = true; 
                }
            } 
        },

        /// <summary>
        ///     An event announcing that the keyboard is no longer focused 
        /// </summary>
        /// <param name="e">Event arguments</param> 
//        protected override void 
        OnLostKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) 
        {
        	ContentControl.prototype.OnLostKeyboardFocus.call(this, e); 

            if (this.ClickMode == ClickMode.Hover)
            {
                // Ignore when in hover-click mode. 
                return;
            } 
 
            if (e.OriginalSource == this)
            { 
                if (this.IsPressed)
                {
                	this.SetIsPressed(false);
                } 

                if (this.IsMouseCaptured) 
                	this.ReleaseMouseCapture(); 

                this.IsSpaceKeyDown = false; 
            }
        },

        /// <summary> 
        /// The Access key for this control was invoked.
        /// </summary> 
//        protected override void 
        OnAccessKey:function(/*AccessKeyEventArgs*/ e) 
        {
            if (e.IsMultiple) 
            {
            	ContentControl.prototype.OnAccessKey.call(this, e);
            }
            else 
            {
                // Don't call the base b/c we don't want to take focus 
            	this.OnClick(); 
            }
        },
        
        /// <SecurityNote>
        /// Critical - calling critical InputManager.Current
        /// Safe - InputManager.Current is not exposed and used temporary to determine the mouse state 
        /// </SecurityNote>
//        private bool 
        GetMouseLeftButtonReleased:function() 
        {
            return InputManager.Current.PrimaryMouseDevice.LeftButton == MouseButtonState.Released; 
        },
        
        AddClickHandler:function(value) { 
        	this.AddHandler(ButtonBase.ClickEvent, value);
        },
        
        RemoveClickHandler:function(value){
        	this.RemoveHandler(ButtonBase.ClickEvent, value);
        }

	});
	
	Object.defineProperties(ButtonBase.prototype,{


//        private bool 
        IsInMainFocusScope: 
        { 
            get:function()
            { 
                var focusScope = FocusManager.GetFocusScope(this);
                focusScope = focusScope instanceof Visual ? focusScope : null;
                return focusScope == null || VisualTreeHelper.GetParent(focusScope) == null;
            }
        }, 
 
        /// <summary>
        ///     IsPressed is the state of a button indicates that left mouse button is pressed or space key is pressed over the button. 
        /// </summary>
//        public bool 
        IsPressed:
        { 
            get:function() { return this.GetValue(ButtonBase.IsPressedProperty); },
            /*protected*/ set:function(value) { this.SetValue(ButtonBase.IsPressedPropertyKey, value); } 
        }, 

        /// <summary>
        /// Get or set the Command property 
        /// </summary>
//        public ICommand 
        Command:
        { 
            get:function()
            {
                return this.GetValue(ButtonBase.CommandProperty);
            }, 
            set:function(value)
            { 
            	this.SetValue(ButtonBase.CommandProperty, value); 
            }
        },

        /// <summary> 
        ///     Fetches the value of the IsEnabled property
        /// </summary> 
        /// <remarks> 
        ///     The reason this property is overridden is so that Button
        ///     can infuse the value for CanExecute into it. 
        /// </remarks>
//        protected override bool 
        IsEnabledCore:
        {
            get:function() 
            {
                return ContentControl.prototype.IsEnabledCore && this.CanExecute; 
            } 
        },
 
        /// <summary>
        /// Reflects the parameter to pass to the CommandProperty upon execution.
        /// </summary>
//        public object 
        CommandParameter: 
        { 
            get:function()
            { 
                return this.GetValue(ButtonBase.CommandParameterProperty);
            },
            set:function(value)
            { 
            	this.SetValue(ButtonBase.CommandParameterProperty, value);
            } 
        }, 

        /// <summary> 
        ///     The target element on which to fire the command.
        /// </summary>
//        public IInputElement 
        CommandTarget: 
        {
            get:function() 
            { 
                return this.GetValue(ButtonBase.CommandTargetProperty);
            }, 
            set:function(value)
            {
            	this.SetValue(ButtonBase.CommandTargetProperty, value);
            } 
        },
 
        /// <summary>
        ///     ClickMode specify when the Click event should fire 
        /// </summary>
//        public ClickMode 
        ClickMode: 
        {
            get:function()
            {
                return this.GetValue(ButtonBase.ClickModeProperty);
            },
            set:function(value) 
            {
            	this.SetValue(ButtonBase.ClickModeProperty, value); 
            } 
        },
 

//        private bool 
        IsSpaceKeyDown:
        { 
            get:function() { return this.ReadControlFlag(ControlBoolFlags.IsSpaceKeyDown); },
            set:function(value) { this.WriteControlFlag(ControlBoolFlags.IsSpaceKeyDown, value); } 
        }, 

//        private bool 
        CanExecute:
        {
            get:function() { return !this.ReadControlFlag(ControlBoolFlags.CommandDisabled); },
            set:function(value)
            { 
                if (value != this.CanExecute)
                { 
                	this.WriteControlFlag(ControlBoolFlags.CommandDisabled, !value); 
                	this.CoerceValue(UIElement.IsEnabledProperty);
                } 
            }
        }

	});
	
	Object.defineProperties(ButtonBase,{

        /// <summary>
        /// Event correspond to left mouse button click 
        /// </summary>
//        public static readonly RoutedEvent 
        ClickEvent:
        {
        	get:function(){
        		if(ButtonBase._ClickEvent === undefined){
        			ButtonBase._ClickEvent= EventManager.RegisterRoutedEvent("Click", RoutingStrategy.Bubble, 
        					RoutedEventHandler.Type, ButtonBase.Type);
        		}
        		
        		return ButtonBase._ClickEvent;
        	}
        	 
        },
 
        /// <summary>
        ///     The DependencyProperty for RoutedCommand 
        /// </summary> 
//        public static readonly DependencyProperty 
        CommandProperty:
        {
        	get:function(){
        		if(ButtonBase._CommandProperty === undefined){
        			ButtonBase._CommandProperty= 
                        DependencyProperty.Register(
                                "Command",
                                ICommand.Type,
                                ButtonBase.Type, 
                                /*new FrameworkPropertyMetadata(null,
                                    new PropertyChangedCallback(ButtonBase, OnCommandChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(null,
                                    new PropertyChangedCallback(ButtonBase, OnCommandChanged))
                                );
        		}
        		
        		return ButtonBase._CommandProperty;
        	}
        	 
        },
 
        /// <summary>
        /// The DependencyProperty for the CommandParameter 
        /// </summary>
//        public static readonly DependencyProperty 
        CommandParameterProperty:
        {
        	get:function(){
        		if(ButtonBase._CommandParameterProperty === undefined){
        			ButtonBase._CommandParameterProperty=
                        DependencyProperty.Register( 
                                "CommandParameter",
                                Object.Type, 
                                ButtonBase.Type, 
                                /*new FrameworkPropertyMetadata( null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return ButtonBase._CommandParameterProperty;
        	}
        
        },
        /// <summary>
        ///     The DependencyProperty for Target property
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        CommandTargetProperty:
        {
        	get:function(){
        		if(ButtonBase._CommandTargetProperty === undefined){
        			ButtonBase._CommandTargetProperty= 
                        DependencyProperty.Register(
                                "CommandTarget", 
                                IInputElement.Type,
                                ButtonBase.Type,
                                /*new FrameworkPropertyMetadata( null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return ButtonBase._CommandTargetProperty;
        	}
        },
        
 
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        IsPressedPropertyKey:
        {
        	get:function(){
        		if(ButtonBase._IsPressedPropertyKey === undefined){
        			ButtonBase._IsPressedPropertyKey=
                        DependencyProperty.RegisterReadOnly( 
                                "IsPressed",
                                Boolean.Type,
                                ButtonBase.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false,
                                        new PropertyChangedCallback(OnIsPressedChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        false,
                                        new PropertyChangedCallback(ButtonBase, OnIsPressedChanged))
                                ); 
        		}
        		
        		return ButtonBase._IsPressedPropertyKey;
        	}
        },
        	
 
        /// <summary>
        ///     The DependencyProperty for the IsPressed property. 
        ///     Flags:              None
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty 
        IsPressedProperty:
        {
        	get:function(){
        		return ButtonBase.IsPressedPropertyKey.DependencyProperty; 
        	}
        },
        	
 
 
        /// <summary> 
        ///     The DependencyProperty for the ClickMode property.
        ///     Flags:              None 
        ///     Default Value:      ClickMode.Release
        /// </summary>
//        public static readonly DependencyProperty 
        ClickModeProperty:
        {
        	get:function(){
        		if(ButtonBase._ClickModeProperty === undefined){
        			ButtonBase._ClickModeProperty=
                        DependencyProperty.Register( 
                                "ClickMode",
                                Number.Type, 
                                ButtonBase.Type, 
                                /*new FrameworkPropertyMetadata(ClickMode.Release)*/
                                FrameworkPropertyMetadata.BuildWithDV(ClickMode.Press),
                                new ValidateValueCallback(ButtonBase, IsValidClickMode)); 
        		}
        		
        		return ButtonBase._ClickModeProperty;
        	}
        }

	});
	
//    private static bool 
    function IsValidClickMode(/*object*/ o)
    { 
        return o == ClickMode.Press
            || o == ClickMode.Release 
            || o == ClickMode.Hover;
    }

    /// <summary>
    ///     Called when IsPressedProperty is changed on "d."
    /// </summary> 
//    private static void 
    function OnIsPressedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.OnIsPressedChanged(e);
    } 

//    private static void 
    function OnAccessKeyPressed(/*object*/ sender, /*AccessKeyPressedEventArgs*/ e)
    {
        if (!e.Handled && e.Scope == null && e.Target == null) 
        {
            e.Target = sender; 
        } 
    }


//    private static void 
    function OnCommandChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        d.OnCommandChanged(/*(ICommand)*/e.OldValue, /*(ICommand)*/e.NewValue);
    } 

//  static ButtonBase()
	function Initialize()
    { 
        EventManager.RegisterClassHandler(ButtonBase.Type, AccessKeyManager.AccessKeyPressedEvent, 
        		new AccessKeyPressedEventHandler(OnAccessKeyPressed)); 
        KeyboardNavigation.AcceptsReturnProperty.OverrideMetadata(ButtonBase.Type, 
        		/*new FrameworkPropertyMetadata(true)*/
        		FrameworkPropertyMetadata.BuildWithDV(true));

//        // Disable IME on button.
//        //  - key typing should not be eaten by IME.
//        //  - when the button has a focus, IME's disabled status should be indicated as
//        //    grayed buttons on the language bar. 
//        InputMethod.IsInputMethodEnabledProperty.OverrideMetadata(ButtonBase.Type, 
//        		/*new FrameworkPropertyMetadata(false, FrameworkPropertyMetadataOptions.Inherits)*/
//        		FrameworkPropertyMetadata.Build2(false, FrameworkPropertyMetadataOptions.Inherits));

        UIElement.IsMouseOverPropertyKey.OverrideMetadata(ButtonBase.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged))); 
        UIElement.IsEnabledProperty.OverrideMetadata(ButtonBase.Type, 
        		/*new UIPropertyMetadata(new PropertyChangedCallback(null, OnVisualStatePropertyChanged))*/
        		UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
    }
	
	ButtonBase.Type = new Type("ButtonBase", ButtonBase, [ContentControl.Type, ICommandSource.Type]);
	Initialize();
	
	return ButtonBase;
});

