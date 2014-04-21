/**
 * Hyperlink
 */

define(["dojo/_base/declare", "system/Type", "documents/Span", "input/ICommandSource", "windows/FrameworkContentElement",
        "internal.commands/CommandHelpers", "windows/RoutingStrategy", "windows/EventManager", "windows/FrameworkPropertyMetadata",
        "input/CanExecuteChangedEventManager", "windows/RoutedEventArgs", "windows/RoutedEventHandler",
        "windows/PropertyChangedCallback", "windows/DependencyProperty"], 
		function(declare, Type, Span, ICommandSource, FrameworkContentElement,
				CommandHelpers, RoutingStrategy, EventManager, FrameworkPropertyMetadata,
				CanExecuteChangedEventManager, RoutedEventArgs, RoutedEventHandler,
				PropertyChangedCallback, DependencyProperty){
//    private static DependencyObjectType 
	var _dType = null;
	var Hyperlink = declare("Hyperlink", [Span, ICommandSource],{
		constructor:function(/*Inline*/ childInline){
//		       private bool 
			this._canExecute = true;
			
			this._dom = window.document.createElement('a');
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			
		},
		
        Arrange:function(parent /*DOM element*/){
           	
//           	this._dom.href = this.NavigateUri;
           	this._dom.setAttribute('href',this.NavigateUri);
        	for(var i=0; i<this.Inlines.Count; i++){	
        		var inline = this.Inlines.Get(i);
        		inline.Arrange(this._dom);
        		this._dom.appendChild(inline._dom);
        	}
		
//        	parent.appendChild(this._dom);
        },
		
        /// <summary> 
        /// This method does exactly the same operation as clicking the Hyperlink with the mouse, except the navigation is not treated as user-initiated.
        /// </summary>
//        public void 
		DoClick:function()
        { 
            this.DoNonUserInitiatedNavigation(this);
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
        	CanExecuteChangedEventManager.RemoveHandler(command, OnCanExecuteChanged); 
        	this.UpdateCanExecute();
        },
 
//        private void 
        HookCommand:function(/*ICommand*/ command)
        { 
        	CanExecuteChangedEventManager.AddHandler(command, OnCanExecuteChanged);
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
        
        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event. 
        /// </summary>
        /// <param name="e">Event arguments</param> 
        /// <remarks>Kept around for backward compatibility in derived classes.</remarks> 
//        protected internal override void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            Span.prototype.OnMouseLeftButtonDown.call(this, e);

            if (this.IsEnabled && (!this.IsEditable || ((Keyboard.Modifiers & ModifierKeys.Control) != 0)))
            { 
            	this.OnMouseLeftButtonDown(this, e);
            } 
        }, 

        /// <summary> 
        /// This is the method that responds to the MouseButtonEvent event.
        /// </summary>
        /// <param name="e">Event arguments</param>
        /// <remarks> 
        /// Added for the NavigateUri = null case, which won't have event handlers hooked
        /// up since OnNavigateUriChanged isn't ever called. However, we want to have the 
        /// sequence of commands and Click event triggered even in this case for Hyperlink. 
        /// </remarks>
        /// <SecurityNote> 
        ///     Critical - Calls critical static OnMouseLeftButtonUp.
        /// </SecurityNote>
//        protected internal override void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) 
        {
        	Span.prototype.OnMouseLeftButtonUp.call(this, e); 
 
            this.OnMouseLeftButtonUp(this, e);
        },
        
        /// <summary> 
        /// Navigate to URI specified in NavigateUri property and mark the hyperlink as visited
        /// </summary> 
        /// <remarks> 
        /// Some forms of navigation are not allowed in the internet zone.
        /// As such there are cases where this API will demand for fulltrust. 
        ///
        /// This method is kept of backward compatibility and isn't a real event handler anymore.
        /// It should remain in here however for subclasses that want to override it either to
        /// redefine behavior or to get notified about the click event. 
        /// </remarks>
//        protected virtual void 
        OnClick:function() 
        { 
        	this.DoNavigation(this); 
        	this.RaiseEvent(new RoutedEventArgs(Hyperlink.ClickEvent, this)); 

            CommandHelpers.ExecuteCommandSource(this); 
        },

        /// <summary>
        /// This is the method that responds to the KeyDown event. 
        /// </summary>
        /// <remarks> 
        /// This method is kept for backward compatibility. 
        /// </remarks>
        /// <SecurityNote> 
        ///     Critical - Calls into static critical OnKeyDown method.
        /// </SecurityNote>
//        protected internal override void 
        OnKeyDown:function(/*KeyEventArgs*/ e) 
        {
            if (!e.Handled && e.Key == Key.Enter) 
            { 
                this.OnKeyDown(this, e);
            } 
            else
            {
            	Span.prototype.OnKeyDown.call(this, e);
            } 
        },
        
        /// <summary>
        /// Add / Remove ClickEvent handler 
        /// </summary> 
//        public event RoutedEventHandler 
//        Click { 
//        	add { AddHandler(ClickEvent, value); } 
//        remove { RemoveHandler(ClickEvent, value); } 
//        } 
    	AddClick:function(value) { this.AddHandler(Hyperlink.ClickEvent, value); }, 
        RemoveClick:function(value) { this.RemoveHandler(Hyperlink.ClickEvent, value); }, 
        
        /// <summary>
        /// Add / Remove RequestNavigateEvent handler 
        /// </summary>
//        public event RequestNavigateEventHandler RequestNavigate 
//        { 
//            add
//            { 
//                AddHandler(RequestNavigateEvent, value);
//            }
//            remove
//            { 
//                RemoveHandler(RequestNavigateEvent, value);
//            } 
//        } 
        
        AddRequestNavigate:function(value)
        { 
            this.AddHandler(RequestNavigateEvent, value);
        },
        RemoveRequestNavigate:function(value)
        { 
        	this.RemoveHandler(RequestNavigateEvent, value);
        }, 

 
	});
	
	Object.defineProperties(Hyperlink.prototype,{
        /// <summary>
        /// Get or set the Command property 
        /// </summary>
//        public ICommand 
		Command:
        { 
            get:function()
            {
                return this.GetValue(Hyperlink.CommandProperty);
            }, 
            set:function(value)
            { 
                this.SetValue(Hyperlink.CommandProperty, value); 
            }
        },
        
//        private bool 
        CanExecute: 
        {
            get:function() { return this._canExecute; }, 
            set:function() 
            {
                if (this._canExecute != value) 
                {
                	this._canExecute = value;
                    CoerceValue(Hyperlink.IsEnabledProperty);
                } 
            }
        }, 
 
        // Returns true when this Hyperlink is hosted by an enabled
        // TextEditor (eg, within a RichTextBox). 
//        private bool 
        IsEditable:
        {
            get:function()
            { 
                return (this.TextContainer.TextSelection != null &&
                        !this.TextContainer.TextSelection.TextEditor.IsReadOnly); 
            } 
        },
 
        /// <summary>
        ///     Fetches the value of the IsEnabled property
        /// </summary>
        /// <remarks> 
        ///     The reason this property is overridden is so that Hyperlink
        ///     can infuse the value for CanExecute into it. 
        /// </remarks> 
//        protected override bool 
        IsEnabledCore:
        { 
            get:function()
            {
                return Span.prototype.IsEnabledCore && Hyperlink.CanExecute;
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
                return GetValue(Hyperlink.CommandParameterProperty);
            }, 
            set:function(value)
            {
                SetValue(Hyperlink.CommandParameterProperty, value);
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
                return this.GetValue(Hyperlink.CommandTargetProperty); 
            },
            set:function(value)
            {
                this.SetValue(Hyperlink.CommandTargetProperty, value); 
            }
        },
        
      /// <summary> 
        /// Provide public access to NavigateUriProperty property. Content the URI to navigate. 
        /// </summary>
//        public Uri 
        NavigateUri:
        {
            get:function()  
            {
                return this.GetValue(Hyperlink.NavigateUriProperty); 
 
            },
            set:function(value)  
            {
            	this.SetValue(Hyperlink.NavigateUriProperty, value);
            }
        }, 
        /// <summary> 
        /// Provide public access to TargetNameProperty property.  The target window to navigate.
        /// </summary> 
//        public string 
        TargetName:
        { 
            get:function() 
            { 
                return this.GetValue(Hyperlink.TargetNameProperty); 
            },
            set:function(value)  
            {
            	this.SetValue(Hyperlink.TargetNameProperty, value);
            }
        },
        
        /// <summary>
        ///    Implementation for BaseUri
        /// </summary> 
//        protected virtual Uri 
        BaseUri:
        { 
            get:function() 
            {
                return this.GetValue(BaseUriHelper.BaseUriProperty); 
            },
            set:function(value)
            {
            	this.SetValue(BaseUriHelper.BaseUriProperty, value); 
            }
        }, 
 
        /// <summary>
        /// The content spanned by this Hyperlink represented as plain text.
        /// </summary>
//        internal string 
        Text:
        { 
            get:function() 
            {
                return TextRangeBase.GetTextInternal(this.ContentStart, this.ContentEnd); 
            }
        },
        
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey: 
        { 
            get:function() { return _dType; }
        } 
        
	});
	
	Object.defineProperties(Hyperlink,{
		/// <summary>
        ///     The DependencyProperty for RoutedCommand
        /// </summary>
//        public static readonly DependencyProperty 
		CommandProperty:
        {
        	get:function(){
            	if(Hyperlink._CommandProperty === undefined){
            		Hyperlink._CommandProperty = 
                        DependencyProperty.Register(
                                "Command", 
                                ICommand.Type, 
                                Hyperlink.Type,
                                /*new FrameworkPropertyMetadata(null, 
                                    new PropertyChangedCallback(null, OnCommandChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(null, 
                                    new PropertyChangedCallback(null, OnCommandChanged)));
            	}
            	
            	return Hyperlink._CommandProperty;
        	}
        }, 
		/// <summary> 
        /// The DependencyProperty for the CommandParameter
        /// </summary> 
//        public static readonly DependencyProperty 
		CommandParameterProperty:
        {
        	get:function(){
            	if(Hyperlink._CommandParameterProperty === undefined){
            		Hyperlink._CommandParameterProperty =
                        DependencyProperty.Register(
                                "CommandParameter",
                                Object.Type, 
                                Hyperlink.Type,
                                /*new FrameworkPropertyMetadata(null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null)); 
            	}
            	
            	return Hyperlink._CommandParameterProperty;
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
            	if(Hyperlink._CommandTargetProperty === undefined){
            		Hyperlink._CommandTargetProperty =
                        DependencyProperty.Register( 
                                "CommandTarget",
                                IInputElement.Type, 
                                Hyperlink.Type, 
                                /*new FrameworkPropertyMetadata(null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
            	}
            	
            	return Hyperlink._CommandTargetProperty;
        	}
        }, 
 
        /// <summary>
        /// Contains the target URI to navigate when hyperlink is clicked
        /// </summary> 
//        public static readonly DependencyProperty 
		NavigateUriProperty:
        {
        	get:function(){
            	if(Hyperlink._NavigateUriProperty === undefined){
            		Hyperlink._NavigateUriProperty = 
                        DependencyProperty.Register( 
                                "NavigateUri",
                                String.Type, 
                                Hyperlink.Type,
                                /*new FrameworkPropertyMetadata(
                                       null,
                                       new PropertyChangedCallback(null, OnNavigateUriChanged), 
                                       new CoerceValueCallback(null, CoerceNavigateUri))*/
                                FrameworkPropertyMetadata.Build3CVCB(
                                       null,
                                       new PropertyChangedCallback(null, Hyperlink.OnNavigateUriChanged), 
                                       new CoerceValueCallback(null, Hyperlink.CoerceNavigateUri)));
            	}
            	
            	return Hyperlink._NavigateUriProperty;
        	}
        }, 
		
		 /// <summary> 
        /// Contains the target window to navigate when hyperlink is clicked 
        /// </summary>
//        public static readonly DependencyProperty 
		TargetNameProperty:
        {
        	get:function(){
            	if(Hyperlink._TargetNameProperty === undefined){
            		Hyperlink._TargetNameProperty = DependencyProperty.Register("TargetName", String.Type, Hyperlink.Type,
                            /*new FrameworkPropertyMetadata(String.Empty)*/
            				FrameworkPropertyMetadata.BuildWithDV(String.Empty));
            	}
            	
            	return Hyperlink._TargetNameProperty;
        	}
        }, 
            

        /// <summary>
        /// Navigate Event 
        /// </summary>
//        public static readonly RoutedEvent 
		RequestNavigateEvent:
        {
        	get:function(){
            	if(Hyperlink._RequestNavigateEvent === undefined){
            		Hyperlink._RequestNavigateEvent = EventManager.RegisterRoutedEvent( 
                            "RequestNavigate", 
                            RoutingStrategy.Bubble,
                            RequestNavigateEventHandler.Type, 
                            Hyperlink.Type);
            	}
            	
            	return Hyperlink._RequestNavigateEvent;
        	}
        },
		
		 /// <summary> 
        /// Event correspond to left mouse button click
        /// </summary>
//        public static readonly RoutedEvent 
		ClickEvent:
        {
        	get:function(){
            	if(Hyperlink._ClickEvent === undefined){
            		Hyperlink._ClickEvent = ButtonBase.ClickEvent.AddOwner(Hyperlink.Type);
            	}
            	
            	return Hyperlink._ClickEvent;
        	}
        }, 
 

        /// <summary>
        /// StatusBar event
        /// </summary> 
//        internal static readonly RoutedEvent 
        RequestSetStatusBarEvent:
        {
        	get:function(){
            	if(Hyperlink._RequestSetStatusBarEvent === undefined){
            		Hyperlink._RequestSetStatusBarEvent = EventManager.RegisterRoutedEvent(
                            "RequestSetStatusBar", 
                            RoutingStrategy.Bubble, 
                            RoutedEventHandler.Type,
                            Hyperlink.Type);
            	}
            	
            	return Hyperlink._RequestSetStatusBarEvent;
        	}
        }, 

        /// <summary>
        /// Records the IsPressed property attached to elements with hyperlink functionality. 
        /// </summary>
//        private static readonly DependencyProperty 
        IsHyperlinkPressedProperty:
        {
        	get:function(){
            	if(Hyperlink._IsHyperlinkPressedProperty === undefined){
            		Hyperlink._IsHyperlinkPressedProperty  =
                        DependencyProperty.Register(
                                "IsHyperlinkPressed", 
                                Boolean.Type,
                                Hyperlink.Type, 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false));
            	}
            	
            	return Hyperlink._IsHyperlinkPressedProperty;
        	}
        }, 
	});
	
    // 
    // Static Ctor to create default style sheet
    //
//    static Hyperlink()
    function Initialize(){ 
    	FrameworkContentElement.DefaultStyleKeyProperty.OverrideMetadata(Hyperlink.Type, 
        		/*new FrameworkPropertyMetadata(Hyperlink.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Hyperlink.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(Hyperlink.Type); 
        ContentElement.FocusableProperty.OverrideMetadata(Hyperlink.Type, 
        		/*new FrameworkPropertyMetadata(true)*/FrameworkPropertyMetadata.BuildWithDV(true)); 
        EventManager.RegisterClassHandler(Hyperlink.Type, Mouse.QueryCursorEvent, new QueryCursorEventHandler(null, OnQueryCursor));
    }
    
//    private static void 
    function OnCommandChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        Hyperlink h = (Hyperlink)d; 
        d.OnCommandChanged(e.OldValue, e.NewValue);
    }
    
  /// <summary> 
    /// Coerce value callback for NavigateUri.
    /// </summary> 
    /// <param name="d">Element to coerce NavigateUri for.</param>
    /// <param name="value">New value for NavigateUri.</param>
    /// <returns>Coerced value.</returns>
    /// <SecurityNote> 
    /// Critical: Implements part of the anti-spoofing feature.
    /// TreatAsSafe: This method changes no state and returns no protected info. 
    /// </SecurityNote> 
//    internal static object 
    Hyperlink.CoerceNavigateUri = function(/*DependencyObject*/ d, /*object*/ value) 
    {
        //
        // If the element for which NavigateUri is being changed is the protected element,
        // we don't let the update go through. This cancels NavigateUri modifications in 
        // the critical period when the URI is shown on the status bar.
        // An example attack: 
        //      void hl_PreviewMouseLeftButtonUp(object sender, MouseButtonEventArgs e) 
        //      {
        //          hl.NavigateUri = null; 
        //          hl.DoClick();
        //          hl.NavigateUri = new Uri("http://www.evil.com");
        //      }
        // (Or, instead of setting NavigateUri=null, add a handler for Hyperlink.RequestNavigateEvent and 
        //  set e.Handled=true.)
        // 
//        if (s_criticalNavigateUriProtectee.Value == d.GetHashCode() && ShouldPreventUriSpoofing) 
//        {
//            value = DependencyProperty.UnsetValue; 
//        }

        return value;
    };
    
  /// <summary> 
    /// Navigates to the specified URI if it matches the pre-registered cached target URI (spoofing prevention). 
    /// </summary>
    /// <param name="sourceElement">Source for the RequestNavigateEventArgs.</param> 
    /// <param name="targetUri">URI to navigate to.</param>
    /// <param name="targetWindow">Target window for the RequestNavigateEventArgs.</param>
    /// <SecurityNote>
    ///     Critical - Implements the anti-spoofing mechanism and clears the anti-spoofing cache after navigation took place. 
    ///     TreatAsSafe - Navigation is considered safe; if the target is a browser window the UserInitiatedNavigationPermission will be demanded.
    ///                   Only if navigation took place, the anti-spoofing cache will be cleared. 
    /// </SecurityNote> 
//    private static void 
    function NavigateToUri(/*IInputElement*/ sourceElement, /*Uri*/ targetUri, /*string*/ targetWindow) 
    {
//        Debug.Assert(targetUri != null);

        // 
        // This prevents against multi-threaded spoofing attacks.
        // 
        /*DependencyObject*/var dObj = sourceElement; 
        dObj.VerifyAccess();

        //
        // Spoofing countermeasure makes sure the URI hasn't changed since display in the status bar.
        //
        /*Uri*/var cachedUri = Hyperlink.s_cachedNavigateUri.Value; 
        // ShouldPreventUriSpoofing is checked last in order to avoid incurring a first-chance SecurityException
        // in common scenarios. 
        if (cachedUri == null || cachedUri.Equals(targetUri) || !ShouldPreventUriSpoofing) 
        {
            // 

            // We treat FixedPage seperately to maintain backward compatibility
            // with the original separate FixedPage implementation of this, which
            // calls the GetLinkUri method. 
            if (!(sourceElement instanceof Hyperlink))
            { 
                targetUri = FixedPage.GetLinkUri(sourceElement, targetUri); 
            }

            var navigateArgs = new RequestNavigateEventArgs(targetUri, targetWindow);
            navigateArgs.Source = sourceElement;
            sourceElement.RaiseEvent(navigateArgs);

            if (navigateArgs.Handled)
            { 
                // 
                // The browser's status bar should be cleared. Otherwise it will still show the
                // hyperlink address after navigation has completed. 
                // !! We have to do this after the current callstack is unwound in order to keep
                // the anti-spoofing state valid. A particular attach is to do a bogus call to
                // DoClick() in a mouse click preview event and then change the NavigateUri.
                // 
                dObj.Dispatcher.BeginInvoke(DispatcherPriority.Send,
                    new System.Threading.SendOrPostCallback(ClearStatusBarAndCachedUri), sourceElement); 
            } 
        }
    } 

    /// <summary>
    /// Updates the status bar to reflect the current NavigateUri.
    /// </summary> 
    /// <SecurityNote>
    ///     Critical - Sets the cached URI (CacheNavigateUri) and s_criticalNavigateUriProtectee 
    ///                which prevent spoofing attacks. 
    ///                Calls the critical RequestSetStatusBarEventArgs ctor.
    /// </SecurityNote> 
//    private static void 
    function UpdateStatusBar(/*object*/ sender)
    {
        /*IInputElement*/var element = sender; 
        /*DependencyObject*/var dObject = sender;

        /*Uri*/var targetUri = dObject.GetValue(GetNavigateUriProperty(element)); 

        // 
        // Keep the identification code for the element that's to be protected against spoofing
        // attacks because its URI is shown on the status bar.
        //
        s_criticalNavigateUriProtectee.Value = dObject.GetHashCode(); 

        // 
        // Cache URI for spoofing countermeasures. 
        //
        CacheNavigateUri(dObject, targetUri); 

        var args = new RequestSetStatusBarEventArgs(targetUri);
        element.RaiseEvent(args);
    } 

    // The implementation of Hyperlink.NavigateUri and FixedPage.NavigateUri are unified, 
    // but the DPs themselves are not. FixedPage.NavigateUri is attached; Hyperlink.Navigate 
    // is a regular DP. Use this method to get the property DP based on the element.
//    private static DependencyProperty 
    function GetNavigateUriProperty(/*object*/ element) 
    {
//        Hyperlink hl = element as Hyperlink;
        return (element == null) ? FixedPage.NavigateUriProperty : NavigateUriProperty;
    } 

    /// <summary> 
    /// Clears the status bar. 
    /// </summary>
    /// <SecurityNote> 
    ///     Critical - Clears the cached URI and s_criticalNavigateUriProtectee which prevent
    ///                spoofing attacks.
    ///                Note: Upstream spoofing should be prevented (e.g. OnMouseLeave) because
    ///                      clearing the identification code in s_criticalNavigateUriProtectee 
    ///                      will disable spoofing detection.
    /// </SecurityNote> 
//    private static void 
    function ClearStatusBarAndCachedUri(/*object*/ sender)
    { 
        /*IInputElement*/var element = sender;

        //
        // Clear the status bar first, from this point on we're not protecting against spoofing 
        // anymore.
        // 
        element.RaiseEvent(RequestSetStatusBarEventArgs.Clear); 

        // 
        // Invalidate cache URI for spoofing countermeasures.
        //
        CacheNavigateUri(sender, null);

        //
        // Clear the identification code for the element that was protected against spoofing. 
        // 
        s_criticalNavigateUriProtectee.Value = null;
    } 
    
//    internal static void 
    Hyperlink.OnNavigateUriChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        var element = d instanceof IInputElement ? d : null;

        // 
        // We only set up spoofing prevention for known objects that are IInputElements.
        // However, for backward compatibility we shouldn't make this callback fail since 
        // other places such as FixedTextBuilder use NavigateUri e.g. for serialization. 
        //
        if (element != null) 
        {
            /*Uri*/var navigateUri = e.NewValue;

            // 
            // We use a different code path for Path, Canvas, Glyphs and FixedPage to maintain backward compatibility
            // with the original separate Hyperlink implementation of this (which didn't execute CanNavigateToUri). 
            // 
            if (navigateUri != null)
            { 
                var fe = d instanceof FrameworkElement ? d : null;

                if (fe != null && ((fe instanceof Path) || (fe instanceof Canvas) || (fe instanceof Glyphs) || (fe instanceof FixedPage)))
                { 
                    if (FixedPage.CanNavigateToUri(navigateUri))
                    { 
                        SetUpNavigationEventHandlers(element); 
                        fe.Cursor = Cursors.Hand;
                    } 
                    else
                    {
                        fe.Cursor = Cursors.No;
                    } 
                }
                else 
                { 
                    var fce = d instanceof FrameworkContentElement ? d : null;

                    if (fce != null && (fce instanceof Hyperlink))
                    {
                        SetUpNavigationEventHandlers(element);
                    } 
                }
            } 
        } 
    };

    /// <SecurityNote>
    ///     Critical - Hooks up event handlers that are responsible to set up anti-spoofing mitigations
    ///                and event handlers that are critical because of the risk for replay attacks.
    ///     TreatAsSafe - We're hooking up event handlers for trusted events from the input system. 
    /// </SecurityNote>
//    private static void 
    function SetUpNavigationEventHandlers(/*IInputElement*/ element) 
    {
        // 
        // We only support FixedPage.NavigateUri to be attached to those four elements (aka pseudo-hyperlinks):
        // Path, Canvas, Glyph, FixedPage.
        //
        // We can get away with the UIElement events event for the Hyperlink which is a ContentElement 
        // because of the aliasing present on those.
        // 

        //
        // Hyperlink already has instance handlers for the following events. To avoid handling the event twice, 
        // we only hook up the static handlers for pseudo-hyperlinks.
        //
        if (!(element instanceof Hyperlink))
        { 
            SetUpEventHandler(element, UIElement.KeyDownEvent, new KeyEventHandler(OnKeyDown)); //initiates navigation
            SetUpEventHandler(element, UIElement.MouseLeftButtonDownEvent, new MouseButtonEventHandler(OnMouseLeftButtonDown)); //capture hyperlink pressed state 
            SetUpEventHandler(element, UIElement.MouseLeftButtonUpEvent, new MouseButtonEventHandler(OnMouseLeftButtonUp)); //can initiate navigation 
        }

        SetUpEventHandler(element, UIElement.MouseEnterEvent, new MouseEventHandler(OnMouseEnter)); //set status bar
        SetUpEventHandler(element, UIElement.MouseLeaveEvent, new MouseEventHandler(OnMouseLeave)); //clear status bar
    }

//    private static void 
    function SetUpEventHandler(/*IInputElement*/ element, /*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
    { 
        // 
        // Setting NavigateUri causes navigation event handlers to be set up.
        // Doing this repeatedly would keep adding handlers; therefore remove any handler first. 
        //
        element.RemoveHandler(routedEvent, handler);
        element.AddHandler(routedEvent, handler);
    } 

    /// <summary> 
    /// This is the method that responds to the KeyDown event. 
    /// </summary>
    /// <SecurityNote> 
    ///     Critical - Calls DoUserInitiatedNavigation. We also want to protect against replay attacks.
    /// </SecurityNote>
//    private static void 
    function OnKeyDown(/*object*/ sender, /*KeyEventArgs*/ e) 
    {
        if (!e.Handled && e.Key == Key.Enter) 
        { 
            //
            // Keyboard navigation doesn't reveal the URL on the status bar, so there's no spoofing 
            // attack possible. We clear the cache here and allow navigation to go through.
            //
            CacheNavigateUri(sender, null);

            if (e.UserInitiated)
            { 
                DoUserInitiatedNavigation(sender); 
            }
            else 
            {
                DoNonUserInitiatedNavigation(sender);
            }

            e.Handled = true;
        } 
    } 

    /// <summary> 
    /// This is the method that responds to the MouseLeftButtonEvent event.
    /// </summary>
//    private static void 
    function OnMouseLeftButtonDown(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
        /*IInputElement*/var element = sender;
        /*DependencyObject*/var dp = sender; 

        // Hyperlink should take focus when left mouse button is clicked on it
        // This is consistent with all ButtonBase controls and current Win32 behavior 
        element.Focus();

        // It is possible that the mouse state could have changed during all of
        // the call-outs that have happened so far. 
        if (e.ButtonState == MouseButtonState.Pressed)
        { 
            // Capture the mouse, and make sure we got it. 
            Mouse.Capture(element);
            if (element.IsMouseCaptured) 
            {
                // Though we have already checked this state, our call to CaptureMouse
                // could also end up changing the state, so we check it again.

                //
                // ISSUE - Leave this here because of 1111993. 
                // 
                if (e.ButtonState == MouseButtonState.Pressed)
                { 
                    dp.SetValue(IsHyperlinkPressedProperty, true);
                }
                else
                { 
                    // Release capture since we decided not to press the button.
                    element.ReleaseMouseCapture(); 
                } 
            }
        } 

        e.Handled = true;
    }

    /// <summary>
    /// This is the method that responds to the MouseLeftButtonUpEvent event. 
    /// </summary> 
    /// <SecurityNote>
    ///     Critical - Calls DoUserInitiatedNavigation. We also want to protect against replay attacks 
    ///                and can't assume the IsHyperlinkPressed DP hasn't been tampered with.
    /// </SecurityNote>
//    private static void 
    function OnMouseLeftButtonUp(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        /*IInputElement*/var element = sender; 
        /*DependencyObject*/var dp = sender; 

        if (element.IsMouseCaptured) 
        {
            element.ReleaseMouseCapture();
        }

        //
        // ISSUE - Leave this here because of 1111993. 
        // 
        if (dp.GetValue(IsHyperlinkPressedProperty))
        { 
            dp.SetValue(IsHyperlinkPressedProperty, false);

            // Make sure we're mousing up over the hyperlink
            if (element.IsMouseOver) 
            {
                if (e.UserInitiated) 
                { 
                    DoUserInitiatedNavigation(sender);
                } 
                else
                {
                    DoNonUserInitiatedNavigation(sender);
                } 
            }
        } 

        e.Handled = true;
    } 

    /// <summary>
    /// Fire the event to change the status bar.
    /// </summary> 
    /// <SecurityNote>
    ///     Critical - Calls UpdateStatusBar to set the cached URI that prevents spoofing attacks. 
    /// </SecurityNote> 
//    private static void 
    function OnMouseEnter(/*object*/ sender, /*MouseEventArgs*/ e) 
    {
        UpdateStatusBar(sender);
    }

    /// <summary>
    /// Set the status bar text back to empty 
    /// </summary> 
    /// <SecurityNote>
    ///     Critical - Calls ClearStatusBarAndCachedUri to clear the cached URI that prevents spoofing attacks. 
    /// </SecurityNote>
//    private static void 
    function OnMouseLeave(/*object*/ sender, /*MouseEventArgs*/ e)
    { 
        /*IInputElement*/var ee = sender;

        // 
        // Prevent against replay attacks. We expect the mouse not to be over the
        // element, otherwise someone tries to circumvent the spoofing countermeasures 
        // while we're in the critical period between OnMouseEnter and OnMouseLeave.
        //
        if (!ee.IsMouseOver)
        { 
            ClearStatusBarAndCachedUri(sender);
        } 
    } 

    /// <SecurityNote> 
    ///     Critical - Asserts UserInitatedNavigationPermission.
    /// </SecurityNote>
//    private static void 
    function DoUserInitiatedNavigation(/*object*/ sender) 
    {
//        CodeAccessPermission perm = SecurityHelper.CreateUserInitiatedNavigationPermission(); 
//        perm.Assert(); 

        try 
        {
            DispatchNavigation(sender);
        }
        finally 
        {
            CodeAccessPermission.RevertAssert(); 
        } 
    }

    /// <SecurityNote>
    ///     Critical - Sets the cached URI that prevents spoofing attacks.
    ///     TreatAsSafe - We don't prevent spoofing in non user-initiated scenarios.
    /// </SecurityNote> 
//    private static void 
    function DoNonUserInitiatedNavigation(/*object*/ sender) 
    { 
        CacheNavigateUri(sender, null);
        DispatchNavigation(sender); 
    }

    /// <summary>
    /// Dispatches navigation; if the object is a Hyperlink we go through OnClick 
    /// to preserve the original event chain, otherwise we call our DoNavigation
    /// method. 
    /// </summary> 
//    private static void 
    function DispatchNavigation(/*object*/ sender)
    { 
        var hl = sender instanceof Hyperlink ? hl : null;
        if (hl != null)
        {
            // 
            // Call the virtual OnClick on Hyperlink to keep old behavior.
            // 
            hl.OnClick(); 
        }
        else 
        {
            DoNavigation(sender);
        }
    } 

    /// <summary> 
    /// Navigate to URI specified in the object's NavigateUri property. 
    /// </summary>
//    private static void 
    function DoNavigation(/*object*/ sender) 
    {
        /*IInputElement*/var element = sender;
        /*DependencyObject*/var dObject = sender;

        /*Uri*/var inputUri = dObject.GetValue(GetNavigateUriProperty(element));
        var targetWindow = dObject.GetValue(TargetNameProperty); 
        RaiseNavigate(element, inputUri, targetWindow); 
    }

    /// <summary>
    /// Navigate to URI. Used by OnClick and by automation.
    /// </summary>
    /// <param name="sourceElement">Source for the RequestNavigateEventArgs.</param> 
    /// <param name="targetUri">URI to navigate to.</param>
    /// <param name="targetWindow">Target window for the RequestNavigateEventArgs.</param> 
//    internal static void 
    Hyperlink.RaiseNavigate = function(/*IInputElement*/ element, /*Uri*/ targetUri, /*string*/ targetWindow) 
    {
        // 
        // Do secure (spoofing countermeasures) navigation.
        //
        if (targetUri != null)
        { 
            NavigateToUri(element, targetUri, targetWindow);
        } 
    }; 
    
    // QueryCursorEvent callback.
    // If this Hyperlink is editable, use the editor cursor unless 
    // the control key is down. 
//    private static void 
    function OnQueryCursor(/*object*/ sender, /*QueryCursorEventArgs*/ e)
    { 
        /*Hyperlink*/var link = sender;

        if (link.IsEnabled && link.IsEditable)
        { 
            if ((Keyboard.Modifiers & ModifierKeys.Control) == 0)
            { 
                e.Cursor = link.TextContainer.TextSelection.TextEditor._cursor; 
                e.Handled = true;
            } 
        }
    }
	
	Hyperlink.Type = new Type("Hyperlink", Hyperlink, [Span.Type, ICommandSource.Type]);
	Initialize();
	
	return Hyperlink;
});


//        /// <summary> 
//        /// Cached URI for spoofing countermeasures.
//        /// </summary> 
//        /// <remarks> 
//        /// We keep one per thread in case multiple threads would be involved in the spoofing attack.
//        /// </remarks> 
//        /// <SecurityNote>
//        ///     Critical for set - Changing the cached URI can open up for spoofing attacks.
//        /// </SecurityNote>
//        private static SecurityCriticalDataForSet<Uri> s_cachedNavigateUri;
// 
//        /// <summary> 
//        /// Identification code of the hyperlink element currently protected against spoofing attacks.
//        /// This code is checked during the NavigateUri coerce value callback in order to protect the 
//        /// NavigateUri from changing during the critical period between showing the URI on the status
//        /// bar and clearing it, which is the timeframe where spoofing attacks can occur.
//        /// </summary>
//        /// <remarks> 
//        /// We keep one per thread in case multiple threads would be involved in the spoofing attack.
//        /// </remarks> 
//        /// <SecurityNote> 
//        ///     Critical for set - Changing the identification code will make the element vulnerable
//        ///                        for spoofing. 
//        /// </SecurityNote>
//        private static SecurityCriticalDataForSet<int?> s_criticalNavigateUriProtectee;
// 
//        /// <summary>
//        /// Caches a target URI for spoofing prevention. 
//        /// </summary> 
//        /// <param name="d">Hyperlink object for which the target URI is to be cached.</param>
//        /// <param name="targetUri">Target URI the user expects to be navigate to.</param> 
//        /// <SecurityNote>
//        ///     Critical - Sets the cached URI that prevents spoofing attacks.
//        /// </SecurityNote>
//        private static void CacheNavigateUri(DependencyObject d, Uri targetUri)
//        { 
//            // 
//            // This prevents against multi-threaded spoofing attacks.
//            // 
//            d.VerifyAccess();
//
//            s_cachedNavigateUri.Value = targetUri;
//        } 
//
// 
//        //-------------------------------------------------------------------- 
//        //
//        // Private Properties 
//        //
//        //---------------------------------------------------------------------
//
//        /// <SecurityNote> 
//        /// Critical: Sets s_shouldPreventUriSpoofing.
//        /// Not TreatAsSafe just to help prevent the remote possibility of calling this under elevation 
//        /// from framework code, since the result of the Demand is cached. 
//        /// </SecurityNote>
//        static bool ShouldPreventUriSpoofing 
//        {
//            get
//            { 
//                if (!s_shouldPreventUriSpoofing.Value.HasValue)
//                { 
//                    try 
//                    {
//                        (new System.Net.WebPermission(PermissionState.Unrestricted)).Demand(); 
//                        s_shouldPreventUriSpoofing.Value = false;
//                    }
//                    catch (SecurityException)
//                    { 
//                        s_shouldPreventUriSpoofing.Value = true;
//                    } 
//                } 
//                return (bool)s_shouldPreventUriSpoofing.Value;
//            } 
//        }
//        static SecurityCriticalDataForSet<bool?> s_shouldPreventUriSpoofing;

 
 


