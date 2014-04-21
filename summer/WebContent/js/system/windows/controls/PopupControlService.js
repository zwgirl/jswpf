/**
 * PopupControlService
 */

define(["dojo/_base/declare", "system/Type", "windows/IInputElement", "controls/FindToolTipEventArgs",
        "controls/ToolTipEventArgs", "windows/RoutedEventHandler"], 
		function(declare, Type, IInputElement, FindToolTipEventArgs,
				ToolTipEventArgs, RoutedEventHandler){
	
	var ToolTip = null;
	function EnsureToolTip(){
		if(ToolTip === null){
			ToolTip = using("controls/ToolTip");
		}
		
		return ToolTip;
	}
	
	var ContentControl = null;
	function EnsureContentControl(){
		if(ContentControl == null){
			ContentControl = using("controls/ContentControl");
		}
		
		return ContentControl;
	}
	
	
	var FrameworkElement = null;
	function EnsureFrameworkElement(){
		if(FrameworkElement == null){
			FrameworkElement = using("windows/FrameworkElement");
		}
		
		return FrameworkElement;
	}
	
	var PopupControlService = declare("PopupControlService", Object,{
		constructor:function(){
//			InputManager.Current.PostProcessInput += new ProcessInputEventHandler(OnPostProcessInput);
		},
		
	       ///<SecurityNote> 
        /// Critical: accesses e.StagingItem.Input. Also this code revieves an event that has
        ///           user initiated set. Also calls PresentationSource.CriticalFromVisual. 
        ///</SecurityNote> 
//        private void 
        OnPostProcessInput:function(/*object*/ sender, /*ProcessInputEventArgs*/ e) 
        {
            if (e.StagingItem.Input.RoutedEvent == InputManager.InputReportEvent)
            {
                /*InputReportEventArgs*/var report = e.StagingItem.Input; 
                if (!report.Handled)
                { 
                    if (report.Report.Type == InputType.Mouse) 
                    {
                        /*RawMouseInputReport*/var mouseReport = report.Report; 
                        if ((mouseReport.Actions & RawMouseActions.AbsoluteMove) == RawMouseActions.AbsoluteMove)
                        {
                            if ((Mouse.LeftButton == MouseButtonState.Pressed) ||
                                (Mouse.RightButton == MouseButtonState.Pressed)) 
                            {
                                RaiseToolTipClosingEvent(true /* reset */); 
                            } 
                            else
                            { 
                                /*IInputElement*/var directlyOver = Mouse.PrimaryDevice.RawDirectlyOver;
                                if (directlyOver != null)
                                {
                                    /*Point*/var pt = Mouse.PrimaryDevice.GetPosition(directlyOver); 

                                    // If possible, check that the mouse position is within the render bounds 
                                    // (avoids mouse capture confusion). 
                                    if (Mouse.CapturedMode != CaptureMode.None)
                                    { 
                                        // Get the root visual
                                        /*PresentationSource*/var source = PresentationSource.CriticalFromVisual(directlyOver);
                                        /*UIElement*/
                                        var rootAsUIElement = source != null ? 
                                        		(source.RootVisual instanceof UIElement ? source.RootVisual : null) : null;
                                        if (rootAsUIElement != null) 
                                        {
                                            // Get mouse position wrt to root 
                                            pt = Mouse.PrimaryDevice.GetPosition(rootAsUIElement); 

                                            // Hittest to find the element the mouse is over 
                                            /*IInputElement*/var enabledHit;
                                            var enabledHitOut = {
                                            	"enabledHit" : enabledHit
                                            };
                                            
                                            var directlyOverOut = {
                                            	"directlyOver" : directlyOver
                                            };
                                            
                                            rootAsUIElement.InputHitTest(pt, /*out enabledHit*/enabledHitOut, /*out directlyOver*/directlyOverOut);
                                            enabledHit = enabledHitOut.enabledHit;
                                            directlyOver = directlyOverOut.directlyOver;
                                            // Find the position of the mouse relative the element that the mouse is over 
                                            pt = Mouse.PrimaryDevice.GetPosition(directlyOver);
                                        } 
                                        else 
                                        {
                                            directlyOver = null; 
                                        }
                                    }

                                    if (directlyOver != null) 
                                    {
                                        // Process the mouse move 
                                        OnMouseMove(directlyOver, pt); 
                                    }
                                } 
                            }
                        }
                        else if ((mouseReport.Actions & RawMouseActions.Deactivate) == RawMouseActions.Deactivate)
                        { 
                            if (this.LastMouseDirectlyOver != null)
                            { 
                            	this.LastMouseDirectlyOver = null; 
                                if (this.LastMouseOverWithToolTip != null)
                                { 
                                	this.RaiseToolTipClosingEvent(true /* reset */);

                                    // When the user moves the cursor outside of the window,
                                    // clear the LastMouseOverWithToolTip property so if the user returns 
                                    // the mouse to the same item, the tooltip will reappear.  If
                                    // the deactivation is coming from a window grabbing capture 
                                    // (such as Drag and Drop) do not clear the property. 
                                    if (MS.Win32.SafeNativeMethods.GetCapture() == IntPtr.Zero)
                                    { 
                                    	this.LastMouseOverWithToolTip = null;
                                    }
                                }
                            } 
                        }
                    } 
                } 
            }
//            else if (e.StagingItem.Input.RoutedEvent == Keyboard.KeyDownEvent) 
//            {
//                ProcessKeyDown(sender, e.StagingItem.Input);
//            }
//            else if (e.StagingItem.Input.RoutedEvent == Keyboard.KeyUpEvent) 
//            {
//                ProcessKeyUp(sender, e.StagingItem.Input); 
//            } 
//            else if (e.StagingItem.Input.RoutedEvent == Mouse.MouseUpEvent)
//            { 
//                ProcessMouseUp(sender, e.StagingItem.Input);
//            }
//            else if (e.StagingItem.Input.RoutedEvent == Mouse.MouseDownEvent)
//            { 
//                RaiseToolTipClosingEvent(true /* reset */);
//            } 
        },
        
//      private void 
        OnPostProcessInput1:function(/*object*/ sender, e) 
        {
        	
            /*IInputElement*/var directlyOver = Mouse.PrimaryDevice.DirectlyOver;
            if (directlyOver != null)
            {
//            	/*Point*/var pt = Mouse.PrimaryDevice.GetPosition(directlyOver); 
                PopupControlService.Current.OnMouseMove(directlyOver/*, pt*/); 
            } 
//            else if (e.StagingItem.Input.RoutedEvent == Keyboard.KeyDownEvent) 
//            {
//                ProcessKeyDown(sender, e.StagingItem.Input);
//            }
//            else if (e.StagingItem.Input.RoutedEvent == Keyboard.KeyUpEvent) 
//            {
//                ProcessKeyUp(sender, e.StagingItem.Input); 
//            } 
//            else if (e.StagingItem.Input.RoutedEvent == Mouse.MouseUpEvent)
//            { 
//                ProcessMouseUp(sender, e.StagingItem.Input);
//            }
//            else if (e.StagingItem.Input.RoutedEvent == Mouse.MouseDownEvent)
//            { 
//                RaiseToolTipClosingEvent(true /* reset */);
//            } 
        },

//        private void 
        OnMouseMove:function(/*IInputElement*/ directlyOver, /*Point*/ pt) 
        {
            if (directlyOver != this.LastMouseDirectlyOver)
            {
            	this.LastMouseDirectlyOver = directlyOver; 
                if (directlyOver != this.LastMouseOverWithToolTip)
                { 
                    this.InspectElementForToolTip(directlyOver instanceof DependencyObject ? directlyOver : null); 
                }
            } 
        },
        /////////////////////////////////////////////////////////////////////
        ///<SecurityNote>
        /// Critical: This has the ability to spoof input for paste 
        ///</SecurityNote>
//        private void 
        ProcessMouseUp:function(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
        {
        	this.RaiseToolTipClosingEvent(false /* reset */); 

            if (!e.Handled)
            {
                if ((e.ChangedButton == MouseButton.Right) && 
                    (e.RightButton == MouseButtonState.Released))
                { 
                    /*IInputElement*/var directlyOver = Mouse.PrimaryDevice.RawDirectlyOver; 
                    if (directlyOver != null)
                    { 
                        /*Point*/var pt = Mouse.PrimaryDevice.GetPosition(directlyOver);
                        if (RaiseContextMenuOpeningEvent(directlyOver, pt.X, pt.Y,e.UserInitiated))
                        {
                            e.Handled = true; 
                        }
                    } 
                } 
            }
        },

        /////////////////////////////////////////////////////////////////////
        ///<SecurityNote>
        /// Critical: This has the ability to spoof input for paste 
        ///</SecurityNote>
//        private void 
        ProcessKeyDown:function(/*object*/ sender, /*KeyEventArgs*/ e) 
        {
            if (!e.Handled) 
            {
                if ((e.SystemKey == Key.F10) && ((Keyboard.Modifiers & ModifierKeys.Shift) == ModifierKeys.Shift))
                {
                	this.RaiseContextMenuOpeningEvent(e); 
                }
            } 
        }, 

        ///////////////////////////////////////////////////////////////////// 
        ///<SecurityNote>
        /// Critical: This has the ability to spoof input for paste
        ///</SecurityNote>
//        private void 
        ProcessKeyUp:function(/*object*/ sender, /*KeyEventArgs*/ e)
        { 
            if (!e.Handled) 
            {
                if (e.Key == Key.Apps) 
                {
                	this.RaiseContextMenuOpeningEvent(e);
                }
            } 
        },
 

//        private void 
        InspectElementForToolTip:function(/*DependencyObject*/ o)
        {
            /*DependencyObject*/var origObj = o; 
            var oRef = {
            	"o" : o
            };
            
            var r = this.LocateNearestToolTip(/*ref o*/oRef);
            o = oRef.o;
            if (r)
            { 
                // Show the ToolTip on "o" or keep the current ToolTip active 
                if (o != null) 
                {
                    // A ToolTip value was found and is enabled, proceed to firing the event

                    if (this.LastMouseOverWithToolTip != null) 
                    {
                        // If a ToolTip is active, don't show it anymore 
                        this.RaiseToolTipClosingEvent(true /* reset */); 
                    }
 
                    this.LastChecked = origObj;
                    this.LastMouseOverWithToolTip = o;

                    /*bool*/var quickShow = this._quickShow; // ResetToolTipTimer may reset _quickShow 
                    this.ResetToolTipTimer();
 
                    if (quickShow) 
                    {
                    	this._quickShow = false; 
                    	this.RaiseToolTipOpeningEvent();
                    }
                    else
                    { 
                    	this.ToolTipTimer = new DispatcherTimer();
                    	this.ToolTipTimer.Interval = new TimeSpan(0,0,0,0,500); //TimeSpan.FromMilliseconds(ToolTipService.GetInitialShowDelay(o)); 
                    	this.ToolTipTimer.Tag = true; // should open 
                    	this.ToolTipTimer.Tick.Combine( new EventHandler(this, this.OnRaiseToolTipOpeningEvent));
                    	this.ToolTipTimer.Start(); 
                    }
                }
            }
            else 
            {
                // If a ToolTip is active, don't show it anymore 
            	this.RaiseToolTipClosingEvent(true /* reset */); 

                // No longer over an item with a tooltip 
            	this.LastMouseOverWithToolTip = null;
            }
        },
 
        /// <summary>
        ///     Finds the nearest element with an enabled tooltip. 
        /// </summary> 
        /// <param name="o">
        ///     The most "leaf" element to start looking at. 
        ///     This element will be replaced with the element that
        ///     contains an active tooltip OR null if the element
        ///     is already in play.
        /// </param> 
        /// <returns>True if there is an active tooltip in play.</returns>
//        private bool 
        LocateNearestToolTip:function(/*ref DependencyObject*/ oRef) 
        { 
            /*IInputElement*/var element = IInputElement.Type.IsInstanceOfType(oRef.o) ? oRef.o : null;//oRef.o instanceof IInputElement ? oRef.o : null;
            if (element != null) 
            {
                /*FindToolTipEventArgs*/var args = new FindToolTipEventArgs();
                element.RaiseEvent(args);
 
                if (args.TargetElement != null)
                { 
                    // Open this element's ToolTip 
                	oRef.o = args.TargetElement;
                    return true; 
                }
                else if (args.KeepCurrentActive)
                {
                    // Keep the current ToolTip active 
                	oRef.o = null;
                    return true; 
                } 
            }
 
            // Close any existing ToolTips
            return false;
        },
 
//        internal bool 
        StopLookingForToolTip:function(/*DependencyObject*/ o)
        { 
            if ((o == this.LastChecked) || (o == this.LastMouseOverWithToolTip) || (o == this._currentToolTip) || this.WithinCurrentToolTip(o)) 
            {
                // In this case, don't show the ToolTip, but the current ToolTip is still OK to show. 
                return true;
            }

            return false; 
        },
 
//        private bool 
        WithinCurrentToolTip:function(/*DependencyObject*/ o) 
        {
            // If no current tooltip, then no need to look 
            if (this._currentToolTip == null)
            {
                return false;
            } 

            /*DependencyObject*/var v = o instanceof Visual ? o : null; 
            if (v == null) 
            {
                /*ContentElement*/var ce = o instanceof ContentElement ? o : null; 
                if (ce != null)
                {
                    v = this.FindContentElementParent(ce);
                } 
                else
                { 
                    v = o instanceof Visual3D ? o : null; 
                }
            } 

            return (v != null) &&
                   ((v instanceof Visual && (v).IsDescendantOf(this._currentToolTip))); 
        },
 
//        private void 
        ResetToolTipTimer:function() 
        {
            if (this._toolTipTimer != null) 
            {
            	this._toolTipTimer.Stop();
            	this._toolTipTimer = null;
                this._quickShow = false; 
            }
        }, 
 
//        internal void 
        OnRaiseToolTipOpeningEvent:function(/*object*/ sender, /*EventArgs*/ e)
        { 
        	this.RaiseToolTipOpeningEvent();
        },

//        private void 
        RaiseToolTipOpeningEvent:function() 
        {
        	this.ResetToolTipTimer(); 
 
            if (this._forceCloseTimer != null)
            { 
            	this.OnForceClose(null, EventArgs.Empty);
            }

            /*DependencyObject*/var o = this.LastMouseOverWithToolTip; 
            if (o != null)
            { 
                var show = true; 

                /*IInputElement*/var element = IInputElement.Type.IsInstanceOfType(o) ? o : null; 
                if (element != null)
                {
                    /*ToolTipEventArgs*/var args = new ToolTipEventArgs(true);
                    element.RaiseEvent(args); 

                    show = !args.Handled; 
                } 

                if (show) 
                {
                    /*object*/var tooltip = ToolTipService.GetToolTip(o);
                    /*ToolTip*/var tip = tooltip instanceof EnsureToolTip() ? tooltip : null;
                    if (tip != null) 
                    {
                        this._currentToolTip = tip; 
                        this._ownToolTip = false; 
                    }
                    else if ((this._currentToolTip == null) || !this._ownToolTip) 
                    {
                    	this._currentToolTip = new EnsureToolTip()();
                    	this._ownToolTip = true;
                    	this._currentToolTip.SetValue(PopupControlService.ServiceOwnedProperty, true); 

                        // Bind the content of the tooltip to the ToolTip attached property 
                        /*Binding*/var binding = new Binding(); 
                        binding.Path = new PropertyPath(ToolTipService.ToolTipProperty);
                        binding.Mode = BindingMode.OneWay; 
                        binding.Source = o;
                        this._currentToolTip.SetBinding(EnsureContentControl().ContentProperty, binding);
                        
                        //cym add
//                        this._currentToolTip.PlacementTarget = o;   
                    }
 
                    if (!this._currentToolTip.StaysOpen)
                    { 
                        // The popup takes capture in this case, which causes us to hit test to the wrong window. 
                        // We do not support this scenario. Cleanup and then throw and exception.
                        throw new NotSupportedException(SR.Get(SRID.ToolTipStaysOpenFalseNotAllowed)); 
                    }

                    this._currentToolTip.SetValue(PopupControlService.OwnerProperty, o);
//                    this._currentToolTip.Closed.Combine(new Delegate(this, this.OnToolTipClosed)); 
                    this._currentToolTip.AddClosedHandler(new RoutedEventHandler(this, this.OnToolTipClosed)); 
                    this._currentToolTip.IsOpen = true;
 
                    this.ToolTipTimer = new DispatcherTimer(/*DispatcherPriority.Normal*/); 
                    this.ToolTipTimer.Interval = TimeSpan.FromMilliseconds(ToolTipService.GetShowDuration(o));
                    this.ToolTipTimer.Tick.Combine(new RoutedEventHandler(this, this.OnRaiseToolTipClosingEvent)); 
                    this.ToolTipTimer.Start();
                }
            }
        }, 

//        internal void 
        OnRaiseToolTipClosingEvent:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
        	this.RaiseToolTipClosingEvent(false /* reset */);
        }, 

        /// <summary>
        ///     Closes the current tooltip, firing a Closing event if necessary.
        /// </summary> 
        /// <param name="reset">
        ///     When false, will continue to treat input as if the tooltip were open so that 
        ///     the tooltip of the current element won't re-open. Example: Clicking on a button 
        ///     will hide the tooltip, but when the mouse is released, the tooltip should not
        ///     appear unless the mouse is moved off and then back on the button. 
        /// </param>
//        private void 
        RaiseToolTipClosingEvent:function(/*bool*/ reset)
        {
        	this.ResetToolTipTimer(); 

            if (reset) 
            { 
            	this.LastChecked = null;
            } 

            /*DependencyObject*/var o = this.LastMouseOverWithToolTip;
            if (o != null)
            { 
                if (this._currentToolTip != null)
                { 
                    /*bool*/var isOpen = this._currentToolTip.IsOpen; 

                    try 
                    {
                        if (isOpen)
                        {
                            /*IInputElement*/var element = o instanceof IInputElement ? o : null; 
                            if (element != null)
                            { 
                                element.RaiseEvent(new ToolTipEventArgs(false)); 
                            }
                        } 
                    }
                    finally
                    {
                        if (isOpen) 
                        {
                        	this._currentToolTip.IsOpen = false; 
 
                            // Setting IsOpen makes call outs to app code. So it is possible that
                            // the _currentToolTip is ----d as a result of an action there. If that 
                            // were the case we do not need to set off the timer to close the tooltip.
                            if (this._currentToolTip != null)
                            {
                                // Keep references and owner set for the fade out or slide animation 
                                // Owner is released when animation completes
                            	this._forceCloseTimer = new DispatcherTimer(); 
                            	this._forceCloseTimer.Interval = Popup.AnimationDelayTime; 
                                this._forceCloseTimer.Tick.Combine(new EventHandler(this, this.OnForceClose));
                                this._forceCloseTimer.Tag = this._currentToolTip; 
                                this._forceCloseTimer.Start();
                            }

                            this._quickShow = true; 
                            this.ToolTipTimer = new DispatcherTimer();
                            this.ToolTipTimer.Interval = TimeSpan.FromMilliseconds(ToolTipService.GetBetweenShowDelay(o)); 
                            this.ToolTipTimer.Tick.Combine(new EventHandler(this, this.OnBetweenShowDelay)); 
                            this.ToolTipTimer.Start();
                        } 
                        else
                        {
                            // Release owner now
                        	this._currentToolTip.ClearValue(PopupControlService.OwnerProperty); 

                            if (this._ownToolTip) 
                                BindingOperations.ClearBinding(this._currentToolTip, EnsureContentControl().ContentProperty); 
                        }
 
                        this._currentToolTip = null;
                    }
                }
            } 
        },
 
        // Clear owner when tooltip has closed 
//        private void 
        OnToolTipClosed:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            /*ToolTip*/var toolTip = sender;
            toolTip.Closed.Remove(new Delegate(this, this.OnToolTipClosed));
            toolTip.ClearValue(PopupControlService.OwnerProperty);
 
            if (toolTip.GetValue(PopupControlService.ServiceOwnedProperty))
            { 
                BindingOperations.ClearBinding(toolTip, EnsureContentControl().ContentProperty); 
            }
        }, 

        // The previous tooltip hasn't closed and we are trying to open a new one
//        private void 
        OnForceClose:function(/*object*/ sender, /*EventArgs*/ e)
        { 
        	this._forceCloseTimer.Stop();
            /*ToolTip*/var toolTip = this._forceCloseTimer.Tag; 
            toolTip.ForceClose(); 
            this._forceCloseTimer = null;
        }, 

//        private void 
        OnBetweenShowDelay:function(/*object*/ source, /*EventArgs*/ e)
        {
        	this.ResetToolTipTimer(); 
        },
        
        ///<SecurityNote>
        /// Critical: This has the ability to spoof input for paste since it passes user initiated bit 
        ///</SecurityNote> 
//        private void 
        RaiseContextMenuOpeningEvent:function(/*KeyEventArgs*/ e) 
        {
            /*IInputElement*/var source = e.OriginalSource instanceof IInputElement ? e.OriginalSource : null;
            if (source != null)
            { 
                if (this.RaiseContextMenuOpeningEvent(source, -1.0, -1.0,e.UserInitiated))
                { 
                    e.Handled = true; 
                }
            } 
        },

        ///<SecurityNote>
        /// Critical: This has the ability to spoof input for paste since it passes user initiated bit 
        ///</SecurityNote>
//        private bool 
        RaiseContextMenuOpeningEvent:function(/*IInputElement*/ source, /*double*/ x, /*double*/ y,/*bool*/ userInitiated) 
        {
            // Fire the event 
            /*ContextMenuEventArgs*/var args = new ContextMenuEventArgs(source, true /* opening */, x, y);
            /*DependencyObject*/var sourceDO = source instanceof DependencyObject ? source: null;
            if (userInitiated && sourceDO != null)
            { 
                if (InputElement.IsUIElement(sourceDO))
                { 
                	sourceDO.RaiseEvent(args, userInitiated); 
                }
                else if (InputElement.IsContentElement(sourceDO)) 
                {
                	sourceDO.RaiseEvent(args, userInitiated);
                }
                else
                { 
                    source.RaiseEvent(args);
                }
            }
            else 
            {
                source.RaiseEvent(args); 
            } 

 
            if (!args.Handled)
            {
                // No one handled the event, auto show any available ContextMenus
 
                // Saved from the bubble up the tree where we looked for a set ContextMenu property
                /*DependencyObject*/var o = args.TargetElement; 
                if ((o != null) && ContextMenuService.ContextMenuIsEnabled(o)) 
                {
                    // Retrieve the value 
                    /*object*/var menu = ContextMenuService.GetContextMenu(o);
                    /*ContextMenu*/var cm = menu instanceof ContextMenu ? menu : null;
                    cm.SetValue(PopupControlService.OwnerProperty, o);
                    cm.Closed.Combine(new RoutedEventHandler(this, this.OnContextMenuClosed)); 

                    if ((x == -1.0) && (y == -1.0)) 
                    { 
                        // We infer this to mean that the ContextMenu was opened with the keyboard
                        cm.Placement = PlacementMode.Center; 
                    }
                    else
                    {
                        // If there is a CursorLeft and CursorTop, it was opened with the mouse. 
                        cm.Placement = PlacementMode.MousePoint;
                    } 
 
                    // Clear any open tooltips
                    this.RaiseToolTipClosingEvent(true /*reset */); 

                    cm.SetCurrentValueInternal(ContextMenu.IsOpenProperty, true);

                    return true; // A menu was opened 
                }
 
                return false; // There was no menu to open 
            }
 
            // Clear any open tooltips since someone else opened one
            this.RaiseToolTipClosingEvent(true /*reset */);

            return true; // The event was handled by someone else 
        },
 
 
//        private void 
        OnContextMenuClosed:function(/*object*/ source, /*RoutedEventArgs*/ e)
        { 
            /*ContextMenu*/var cm = source instanceof ContextMenu ? source : null;
            if (cm != null)
            {
                cm.Closed.Remove(new Delegate(this, this.OnContextMenuClosed)); 

                /*DependencyObject*/var o = cm.GetValue(PopupControlService.OwnerProperty); 
                if (o != null) 
                {
                    cm.ClearValue(PopupControlService.OwnerProperty); 

                    /*UIElement*/var uie = this.GetTarget(o);
                    if (uie != null)
                    { 
                        if (!this.IsPresentationSourceNull(uie))
                        { 
                            /*IInputElement*/
                        	var inputElement = (o instanceof ContentElement) ? o : uie; 
                            /*ContextMenuEventArgs*/
                        	var args = new ContextMenuEventArgs(inputElement, false /*opening */);
                            inputElement.RaiseEvent(args); 
                        }
                    }
                }
            } 
        }
	});
	
	Object.defineProperties(PopupControlService.prototype,{
//		private IInputElement 
		LastMouseDirectlyOver: 
		{
			get:function() 
			{
				return this._lastMouseDirectlyOver; //this._lastMouseDirectlyOver.Target; 
            },
 
            set:function(value)
            {
            	this._lastMouseDirectlyOver = value; /*new WeakReference(value);*/ 
            } 
        }, 

//        private DependencyObject 
        LastMouseOverWithToolTip:
        {
            get:function()
            {
                return this._lastMouseOverWithToolTip; 
            },
 
            set:function(value)
            { 
            	this._lastMouseOverWithToolTip = value; //new WeakReference(value); 
            }
        }, 

//        private DependencyObject 
        LastChecked:
        {
            get:function() 
            {
                return this._lastChecked;
            },
 
            set:function(value)
            { 
            	this._lastChecked = value; 
            }
        },
        
//        internal ToolTip 
        CurrentToolTip:
        { 
            get:function()
            { 
                return this._currentToolTip; 
            }
        }, 

//        private DispatcherTimer 
        ToolTipTimer:
        {
            get:function() 
            {
                return this._toolTipTimer; 
            },
 
            set:function(value)
            { 
            	this.ResetToolTipTimer();
            	this._toolTipTimer = value;
            }
        } 
	});
	
	Object.defineProperties(PopupControlService, {
        /// <summary>
        ///     Event that fires on ContextMenu when it opens. 
        ///     Located here to avoid circular dependencies.
        /// </summary>
//        internal static readonly RoutedEvent 
        ContextMenuOpenedEvent:
        {
        	get:function(){
        		if(PopupControlService._ContextMenuOpenedEvent === undefined){
        			PopupControlService._ContextMenuOpenedEvent =
        	            EventManager.RegisterRoutedEvent("Opened", RoutingStrategy.Bubble, 
        	            		RoutedEventHandler.Type, PopupControlService.Type); 
        		}
        		
        		return PopupControlService._ContextMenuOpenedEvent;
        	}
        },

        /// <summary> 
        ///     Event that fires on ContextMenu when it closes. 
        ///     Located here to avoid circular dependencies.
        /// </summary> 
//        internal static readonly RoutedEvent 
        ContextMenuClosedEvent:
        {
        	get:function(){
        		if(PopupControlService._ContextMenuClosedEvent === undefined){
        			PopupControlService._ContextMenuClosedEvent =
        	            EventManager.RegisterRoutedEvent("Closed", RoutingStrategy.Bubble, 
        	            		RoutedEventHandler.Type, PopupControlService.Type);
        		}
        		
        		return PopupControlService._ContextMenuClosedEvent;
        	}
        },
        
//        internal static PopupControlService 
        Current: 
        {
            get:function()
            { 
                return EnsureFrameworkElement().PopupControlService;
            } 
        },
        
        /// <summary>
        ///     Indicates whether the service owns the tooltip
        /// </summary> 
//        internal static readonly DependencyProperty 
        ServiceOwnedProperty:
        {
        	get:function(){
        		if(PopupControlService._ServiceOwnedProperty === undefined){
        			PopupControlService._ServiceOwnedProperty =
        	            DependencyProperty.RegisterAttached("ServiceOwned",                 // Name 
                                Boolean.Type,                   // Type 
                                PopupControlService.Type,    // Owner
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false)); 
        		}
        		
        		return PopupControlService._ServiceOwnedProperty;
        	}
        },

        /// <summary>
        ///     Stores the original element on which to fire the closed event
        /// </summary> 
//        internal static readonly DependencyProperty 
        OwnerProperty:
        {
        	get:function(){
        		if(PopupControlService._OwnerProperty === undefined){
        			PopupControlService._OwnerProperty  =
        	            DependencyProperty.RegisterAttached("Owner",                        // Name 
        	            		DependencyObject.Type,       // Type 
        	            		PopupControlService.Type,    // Owner
                                /*new FrameworkPropertyMetadata(null, // Default Value 
                                                               new PropertyChangedCallback(null, OnOwnerChanged))*/
        	            		FrameworkPropertyMetadata.BuildWithDVandPCCB(null, // Default Value 
                                                               new PropertyChangedCallback(null, OnOwnerChanged))); 
        		}
        		
        		return PopupControlService._OwnerProperty;
        	}
        },
	});
	
    /// <SecurityNote> 
    /// Critical - as this gets PresentationSource.
    /// Safe - as the value is not returned but is only checked for null. 
    /// </SecurityNote>
//    private static bool 
    function IsPresentationSourceNull(/*DependencyObject*/ uie)
    { 
        return PresentationSource.CriticalFromVisual(uie) == null;
    } 

//    internal static DependencyObject 
    PopupControlService.FindParent = function(/*DependencyObject*/ o)
    { 
        // see if o is a Visual or a Visual3D
        /*DependencyObject*/var v = o instanceof Visual ? o : null; 
        if (v == null) 
        {
            v = o instanceof Visual3D ? o : null; 
        }

        /*ContentElement*/var ce = (v == null) ? (o instanceof ContentElement ? o : null) : null;

        if (ce != null)
        { 
            o = ContentOperations.GetParent(ce); 
            if (o != null)
            { 
                return o;
            }
            else
            { 
                /*FrameworkContentElement*/var fce = ce instanceof FrameworkContentElement ? ce : null;
                if (fce != null) 
                { 
                    return fce.Parent;
                } 
            }
        }
        else if (v != null)
        { 
            return VisualTreeHelper.GetParent(v);
        } 

        return null;
    }; 

//    internal static DependencyObject 
    PopupControlService.FindContentElementParent = function(/*ContentElement*/ ce)
    {
        /*DependencyObject*/var nearestVisual = null; 
        /*DependencyObject*/var o = ce;

        while (o != null) 
        {
            nearestVisual = o instanceof Visual ? o : null; 
            if (nearestVisual != null)
            {
                break;
            } 

            nearestVisual = o instanceof Visual3D ? o : null; 
            if (nearestVisual != null) 
            {
                break; 
            }

            ce = o instanceof ContentElement ? o : null;
            if (ce != null) 
            {
                o = ContentOperations.GetParent(ce); 
                if (o == null) 
                {
                    /*FrameworkContentElement*/var fce = ce instanceof FrameworkContentElement ? ce : null; 
                    if (fce != null)
                    {
                        o = fce.Parent;
                    } 
                }
            } 
            else 
            {
                // This could be application. 
                break;
            }
        }

        return nearestVisual;
    };

//    internal static bool 
    PopupControlService.IsElementEnabled = function(/*DependencyObject*/ o)
    { 
        var enabled = true;
        var uie = o instanceof UIElement ? o : null;
        /*ContentElement*/var ce = (uie == null) ? (o instanceof ContentElement ? o : null) : null;

        if (uie != null) 
        { 
            enabled = uie.IsEnabled;
        } 
        else if (ce != null)
        {
            enabled = ce.IsEnabled;
        } 

        return enabled;
    };
    
    /// <summary> 
    ///     Returns the UIElement target 
    /// </summary>
//    private static UIElement 
    function GetTarget(/*DependencyObject*/ o) 
    {
        /*UIElement*/var uie = o instanceof UIElement ? o : null;
        if (uie == null)
        { 
            /*ContentElement*/var ce = o instanceof ContentElement ? o : null;
            if (ce != null) 
            { 
                /*DependencyObject*/var ceParent = FindContentElementParent(ce);

                // attempt to cast to a UIElement
                uie = ceParent instanceof UIElement ? ceParent : null;
            }
        } 

        return uie;
    } 
    
    // When the owner changes, coerce all attached properties from the service
//    private static void 
    function OnOwnerChanged(/*DependencyObject*/ o, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (o instanceof ContextMenu) 
        { 
            o.CoerceValue(ContextMenu.HorizontalOffsetProperty);
            o.CoerceValue(ContextMenu.VerticalOffsetProperty); 
            o.CoerceValue(ContextMenu.PlacementTargetProperty);
            o.CoerceValue(ContextMenu.PlacementRectangleProperty);
            o.CoerceValue(ContextMenu.PlacementProperty);
            o.CoerceValue(ContextMenu.HasDropShadowProperty); 
        }
        else if (o instanceof EnsureToolTip()) 
        { 
            o.CoerceValue(EnsureToolTip().HorizontalOffsetProperty);
            o.CoerceValue(EnsureToolTip().VerticalOffsetProperty); 
            o.CoerceValue(EnsureToolTip().PlacementTargetProperty);
            o.CoerceValue(EnsureToolTip().PlacementRectangleProperty);
            o.CoerceValue(EnsureToolTip().PlacementProperty);
            o.CoerceValue(EnsureToolTip().HasDropShadowProperty); 
        }
    } 

    // Returns the value of dp on the Owner if it is set there,
    // otherwise returns the value set on o (the tooltip or contextmenu) 
//    internal static object 
    PopupControlService.CoerceProperty = function(/*DependencyObject*/ o, /*object*/ value, /*DependencyProperty*/ dp)
    {
        /*DependencyObject*/var owner = o.GetValue(PopupControlService.OwnerProperty);
        if (owner != null) 
        {
            var hasModifiers; 
            
            var hasModifiersOut = {
            	"hasModifiers" : hasModifiers
            };
            var r = owner.GetValueSource(dp, null, /*out hasModifiers*/hasModifiersOut);
            hasModifiers = hasModifiersOut.hasModifiers;
            if ( r!= BaseValueSourceInternal.Default || hasModifiers) 
            {
                // Return a value if it is set on the owner 
                return owner.GetValue(dp);
            }
            else if (dp == EnsureToolTip().PlacementTargetProperty || dp == ContextMenu.PlacementTargetProperty)
            { 
                /*UIElement*/var uie = GetTarget(owner);

                // If it is the PlacementTarget property, return the owner itself 
                if (uie != null)
                    return uie; 
            }
        }
        return value;
    }; 
	
	PopupControlService.Type = new Type("PopupControlService", PopupControlService, [Object.Type]);
	return PopupControlService;
});




 

//        private DispatcherTimer _toolTipTimer;
//        private bool _quickShow = false;
//        private WeakReference _lastMouseDirectlyOver;
//        private WeakReference _lastMouseOverWithToolTip; 
//        private WeakReference _lastChecked;
//        private ToolTip _currentToolTip; 
//        private DispatcherTimer _forceCloseTimer; 
//        private bool _ownToolTip;
 
 
