/**
 * Window
 */

define(["dojo/_base/declare", "system/Type", "controls/ContentControl", "windows/IWindowService"], 
		function(declare, Type, ContentControl, IWindowService){
	
//    internal class 
	var SingleChildEnumerator =declare(IEnumerator,  
    {
        constructor:function(/*object*/ Child)
        {
            this._child = Child; 
            this._count = Child == null ? 0 : 1;
        },

//        bool IEnumerator.
        MoveNext:function() 
        {
        	this._index++; 
            return _index < this._count; 
        },
 
//        void IEnumerator.
        Reset:function()
        {
        	this._index = -1;
        } 

//        private int _index = -1; 
//        private int _count = 0; 
//        private object _child;
    }); 
	
	Object.defineProperties(SingleChildEnumerator.prototype, {
//        object IEnumerator.
		Current:
        { 
            get:function() { return (this._index == 0) ? this._child : null; }
        }
	});
	
//    private static DependencyObjectType 
	var _dType = null;
	var Window = declare("Window", ContentControl,{
		constructor:function(){
		},
		
		/// <summary>
        ///     Show the window
        /// </summary> 
        /// <remarks>
        ///     Calling Show on window is the same as setting the 
        ///     Visibility property to Visibility.Visible. 
        /// </remarks>
//        public void 
		Show:function() 
        {
 
            // Update the property value only.  Do not do anything further in 
            // _OnVisibilityInvalidate since we will synchronously call ShowHelper
            // from here. 
            UpdateVisibilityProperty(Visibility.Visible);

            ShowHelper(true);
        }, 

        /// <summary> 
        ///     Hide the window 
        /// </summary>
        /// <remarks> 
        ///     Calling Hide on window is the same as setting the
        ///     Visibility property to Visibility.Hidden
        ///     </remarks>
//        public void 
		Hide:function() 
        {
            // set Visibility to Hidden even if _isVisible is false since 
            // _isVisible can be false b/c of Visibility = Collapsed and Hide()
            // should change Visibility to Hidden. 
            // 
            // Update the property value only.  Do not do anything further in
            // _OnVisibilityInvalidate since we will synchronously call ShowHelper 
            // from here.
            UpdateVisibilityProperty(Visibility.Hidden);

            ShowHelper(BooleanBoxes.FalseBox); 
        },
 
        /// <summary> 
        ///     Closes the Window
        /// </summary> 
        /// <remarks>
        ///     Window fires the Closing event before it closes. If the
        ///     user cancels the closing event, the window is not closed.
        ///     Otherwise, the window is closed and the Closed event is 
        ///     fired.
        /// 
        ///     Callers must have UIPermission(UIPermissionWindow.AllWindows) to call this API. 
        /// </remarks>
        ///<SecurityNote> 
        ///  PublicOK: This API Demands UIPermission with AllWindows access
        ///  Critical: calls critical code (InternalClose)
        ///</SecurityNote>
//        public void 
        Close:function()
        { 
            // this call ends up throwing an exception if Close 
            // is not allowed
            InternalClose(false, false);
        }, 

        /// <summary> 
        ///     Kick off the Window's MoveWindow loop 
        /// </summary>
        /// <remarks> 
        ///     To enable custom chrome on Windows. First check if this is the Left MouseButton.
        ///     Will throw exception if it's not, otherwise, will kick off the Windows's MoveWindow loop.
        ///     Callers must have UIPermission(UIPermissionWindow.AllWindows) to call this API.
        /// </remarks> 
        ///<SecurityNote>
        ///     Critical - as this code performs an elevation via the calls to SendMessage. 
        ///     PublicOk - as there is a demand for all windows permission. 
        ///     We explicitly demand unamnaged code permission - as there's no valid scenario for this in the SEE.
        ///</SecurityNote> 
//        public void 
        DragMove:function()
        {
            // Mouse.LeftButton actually reflects the primary button user is using.
            // So we don't need to check whether the button has been swapped here. 
            if (Mouse.LeftButton == MouseButtonState.Pressed)
            {
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.DragMoveFail)); 
            }
        },

        /// <summary>
        ///     Shows the window as a modal window 
        /// </summary>
        /// <returns>bool?</returns> 
        /// <remarks> 
        ///     Callers must have UIPermission(UIPermissionWindow.AllWindows) to call this API.
        /// </remarks> 
        /// <SecurityNote>
        /// Critical: This code causes unmamanged code elevation in the call to GetWindowLong and GetDesktopWindow
        ///           which has a SUC on it. There is also a call to SetFocus which returns a window handle.
        ///           It also accesses _dialogOwnerHandle, _dialogPreviousActiveHandle and _ownerHandle. 
        /// PublicOK: There is a demand in the code
        /// </SecurityNote> 
//        public Nullable<bool> 
        ShowDialog:function()
        { 
            // this call ends up throwing an exception if ShowDialog
            // is not allowed
 
            if ( _isVisible == true )
            {
                throw new InvalidOperationException(SR.Get(SRID.ShowDialogOnVisible));
            } 
 
            // Ensure Dialog RoutedCommand is registered with CommandManager
            EnsureDialogCommand(); 

            try
            {
                _showingAsDialog = true; 
                Show();
            } 
            finally
            {
                // If the owner window belongs to another thread, the reactivation
                // of the owner may have failed within DestroyWindow().  Therefore, 
                // if the current thread is in the foreground and the owner is not
                // in the foreground we can safely set the foreground back 
                // to the owner. 
                _showingAsDialog = false; 
            }
            return _dialogResult; 
        },
        
      /// <summary>
        /// OnVisualParentChanged is called when the parent of the Visual is changed. 
        /// </summary>
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param> 
//        protected internal sealed override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent) 
        {
            base.OnVisualParentChanged(oldParent);

            // Checking for Visual parent here covers all the scenarios
            // including the following: 

            // Window w1 = new Window(); 
            // Window w2 = new WIndow(); 
            // w1.Show();
            // w2.Show(); 
            // w1.VisualChildren.Add(w2);


            // Window w1 = new Window(); 
            // Window w2 = new WIndow();
            // w1.Show(); 
            // w1.VisualChildren.Add(w2); 
            //  w2.Show();
 
            if ( VisualTreeHelper.GetParent(this) != null )
            {
                throw new InvalidOperationException(SR.Get(SRID.WindowMustBeRoot));
            } 
        },
 
        /// <summary> 
        ///     Measurement override. Implements content sizing logic.
        /// </summary> 
        /// <remarks>
        ///     Deducts the frame size from the constraint and then passes it on
        ///     to its child.  Only supports one Visual child (just like control)
        /// </remarks> 
//        protected override Size 
        MeasureOverride:function()
        { 
        }, 

        /// <summary>
        ///     ArrangeOverride allows for the customization of the positioning of children.
        /// </summary> 
        /// <remarks>
        ///     Deducts the frame size of the window from the constraint and then 
        ///     arranges its child.  Supports only one child. 
        /// </remarks>
//        protected override Size 
        ArrangeOverride:function() 
        {

            if (this.VisualChildrenCount > 0) 
            { 
                var child = this.GetVisualChild(0);
                child = child instanceof UIElement ? child : null;
                if (child != null) 
                {

                    child.Arrange(new Rect(childArrangeBounds));

                } 
            } 
            return arrangeBounds;
        }, 

        /// <summary>
        ///     This method is invoked when the Content property changes.
        /// </summary> 
        /// <param name="oldContent">The old value of the Content property.</param>
        /// <param name="newContent">The new value of the Content property.</param> 
//        protected override void 
        OnContentChanged:function(/*object*/ oldContent, /*object*/ newContent) 
        {
            base.OnContentChanged(oldContent, newContent); 

        }, 
        
        /// <summary> 
        ///     Called by ResizeGrip control to set its reference in the Window object
        /// </summary>
        /// <remarks>
        ///     RBW doesn't need ResizeGrip and hence it doesn't do 
        ///     anything in this virtual
        /// </remarks> 
//        internal virtual void 
        SetResizeGripControl:function(/*Control*/ ctrl) 
        {
            _resizeGripControl = ctrl; 
        },

//        internal virtual void 
        ClearResizeGripControl:function(/*Control*/ oldCtrl)
        { 
            if (oldCtrl == _resizeGripControl)
            { 
                _resizeGripControl = null; 
            }
        }, 
 
        /// <summary>
        ///     Send a WM_CLOSE message to close the window. When the WM_CLOSE message is
        ///     processed by the WindowFilterMessage function, the Closing event is fired.
        ///     Closing event is cancelable and thus can dismiss window closing. 
        /// </summary>
        /// <param name="shutdown">Specifies whether the app should shutdown or not</param> 
        /// <param name="ignoreCancel">Specifies whether cancelling closing should be ignored </param> 
        ///<SecurityNote>
        ///     Critical - as this code calls UnsafeSendMessage that has a SUC. 
        ///</SecurityNote>
//        internal void 
        InternalClose:function(/*bool*/ shutdown, /*bool*/ ignoreCancel)
        { 
            if (_disposed == true) 
            {
                return; 
            }

            _appShuttingDown = shutdown;
            _ignoreCancel = ignoreCancel; 

            if ( IsSourceWindowNull ) 
            { 
                _isClosing = true;
 
                // Event handler exception continuality: if exception occurs in Closing event handler, the
                // cleanup action is to finish closing.
                var e = new CancelEventArgs(false);
                try 
                {
                    OnClosing(e); 
                } 
                catch(ex)
                { 
                    CloseWindowBeforeShow();
                    throw ex;
                }
 
                if (ShouldCloseWindow(e.Cancel))
                { 
                    CloseWindowBeforeShow(); 
                }
                else 
                {
                    _isClosing = false;
                    // 03/14/2006 -- hamidm
                    // WOSB 1560557 Dialog does not close with ESC key after it has been cancelled 
                    //
                    // No need to reset DialogResult to null here since source window is null.  That means 
                    // that ShowDialog has not been called and thus no need to worry about DialogResult. 
                }
            } 
        },
 
        // NOTE: hamidm  05/18/03 -- PS # 843776
        // We fire Closing and Closed envent even if the hwnd is not
        // created yet i.e. window is not shown.
        ///<SecurityNote> 
        ///     Critical: Calls critical code: Window.InternalDispose
        ///</SecurityNote> 
//        private void 
        CloseWindowBeforeShow:function()
        { 
            InternalDispose();

            // raise Closed event
            OnClosed(EventArgs.Empty); 
        },
 
        /// <summary>
        ///     This is a callback called to set the window Visual. It is called after 
        ///     the source window has been created.
        /// </summary>
//        internal override void 
        OnAncestorChanged:function()
        { 
            base.OnAncestorChanged();
            if (Parent != null) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.WindowMustBeRoot));
            } 
        },
 
        ///<SecurityNote>
        ///     Critical - as this method accesses critical method (_swh.RootVisual)
        ///</SecurityNote>
//        internal void 
        SetRootVisual:function()
        { 
            // hamidm 01/12/2005 
            // WOSB 1010151 FxCop: ConstructorsShouldNotCallBaseClassVirtualMethods::
            // System.Windows (presentationframework.dll 2 violation) 
            //
            // We can't set IWS property in the cctor since it results
            // in calling some virtual.  So, as an alternative we set it
            // when content is changed and when we set the root visual. 
            // We set it here, b/c once RootVisual is set, the visual tree
            // can/is created and visual children can query for inherited 
            // IWS property. 
            SetIWindowService();
        }, 

        // Activate or Deactivate window
//        internal void 
        HandleActivate:function(/*bool*/ windowActivated)
        { 
            // hamidm -- 12/10/04
            // 
            // This method is called by WM_ACTIVATE msg hander for the stand alone 
            // window case.  WM_ACTIVATE is sent twice when activating a minimized
            // window by mouse click; once with window state minimized and then again 
            // with window state normal.  Thus, we have the following if conditions
            // to fire Activated/Deactivated events only if we're activating/deactivating
            // the window and the window was previously deactivated/activated.
            // 
            // Please look at WOSB 990841 (Activated event fires twice on window when
            // you minimize and restore a window) on this issue. 
            // 

            // Event handler exception continuality: if exception occurs in Activated/Deactivated event handlers, our state will not be 
            // corrupted because the state related to Activated/Deactivated, IsActive is set before the event is fired.
            // Please check Event handler exception continuality if the logic changes.
            if ((windowActivated == true) && (IsActive == false))
            { 
                SetValue(IsActivePropertyKey, BooleanBoxes.TrueBox);
                OnActivated(EventArgs.Empty); 
            } 
            else if ((windowActivated == false) && (IsActive == true))
            { 
                SetValue(IsActivePropertyKey, BooleanBoxes.FalseBox);
                OnDeactivated(EventArgs.Empty);
            }
        }, 
        
      /// <summary> 
        /// Ensure Dialog command is registered with the CommandManager
        /// </summary> 
//        private void 
        EnsureDialogCommand:function()
        {
            // _dialogCommandAdded is a static variable, however, we're not synchronizing
            // access to it.  The reason is that, CommandManager is thread safe and according 
            // to KiranKu we don't want to take the overhead of locking here.  For multiple
            // threaded cases, we could end up calling the CommandManager more than once but 
            // KiranKu is okay with that perf hit in the corner case. 
            if (!_dialogCommandAdded)
            { 
                // Right now we only have DialogCancel Command, which closes window if it's dialog and return false as the dialog's result.
                var binding = new CommandBinding(DialogCancelCommand);
                binding.Executed += new ExecutedRoutedEventHandler(OnDialogCommand);
                CommandManager.RegisterClassCommandBinding(Window.Type, binding); 

                _dialogCommandAdded = true; 
            } 
        },
        
      /// <summary> 
        /// Close window if it's dialog and return false for DialogResult.
        /// </summary> 
//        private void 
        OnDialogCancelCommand:function()
        {
            if (_showingAsDialog)
            { 
                DialogResult = false;
            } 
        }, 
        /// <summary>
        ///     sets the IWindowService attached property
        /// </summary>
//        private void 
        SetIWindowService:function() 
        {
            if (GetValue(IWindowServiceProperty) == null) 
            { 
                SetValue(IWindowServiceProperty, this);
            } 
        },
 
        /// <SecurityNote>
        /// Critical - This code calls EnableThreadWindows and accesses _dialogPreviousActiveHandle
        /// TreatAsSafe - There is a demand for unmanaged code
        /// </SecurityNote> 
//        private void 
        DoDialogHide:function() 
        { 
 
            Debug.Assert(_showingAsDialog == true, "_showingAsDialog must be true when DoDialogHide is called");

            // 03/03/2006 -- hamidm
            // Fix for 1388606 Close Dialog Window should not return null 
            //
            // The consensus here is that DialogResult should never be null when ShowDialog returns
            // As such, we coerce it to be false.  Furthermore, we don't use the DialogResult property
            // to update _dialogResult here since that does more than just updating the underlying 
            // variable
            if (_dialogResult == null) 
            { 
                _dialogResult = false;
            } 

            // clears _showingAsDialog
            _showingAsDialog = false;
 
        }, 
        
//        private void 
        OnIconChanged:function(/*ImageSource*/ newIcon) 
        {
            // No need to dispose previous _icon.
            // _icon is a ref to the ImageSource object
            // set by the developer.  Since the dev created 
            // the ImageSource object it is his responsibility to
            // dispose it. 
            _icon = newIcon; 

        },
 
        /// <SecurityNote>
        ///     Critical: This code can cause window to maximize and minimize and used hwnd 
        ///     TreatAsSafe: This has a demand 
        /// </SecurityNote>
//        private void 
        OnWindowStateChanged:function(/*WindowState*/ windowState)
        {
        },
 
//        private void 
        OnWindowStyleChanged:function(/*WindowStyle*/ windowStyle) 
        {
        },
        ///<SecurityNote>
        /// There is an explicit demand here - to enforce not being able to set this DP in Internet Zone.
        /// this should remanin here until Window spoofing work is done. 
        ///     Critical as this accesses critical data - (CriticalHandle )
        ///     TreatAsSafe - as there is a demand. 
        ///</SecurityNote> 
//        private void 
        OnTopmostChanged:function(/*bool*/ topmost) 
        {
        },
//        private void 
        OnTitleChanged:function()
        {
        },
        // We set/clear ShowKeyboardCue when Show(ShowDialog)/Hide is called.
        // We do not clear the state of ShowKeyboardCue when Window is closed.
//        private void 
        SetShowKeyboardCueState:function() 
        {
            // set property on AccessKey control indicating the 
            // invocation device 
            if (KeyboardNavigation.IsKeyboardMostRecentInputDevice())
            { 
                _previousKeyboardCuesProperty = GetValue(KeyboardNavigation.ShowKeyboardCuesProperty);
                SetValue(KeyboardNavigation.ShowKeyboardCuesProperty, BooleanBoxes.TrueBox);
                _resetKeyboardCuesProperty = true;
            } 
        },
 
        // We set/clear ShowKeyboardCue when Show(ShowDialog)/Hide is called. 
        // We do not clear the state of ShowKeyboardCue when Window is closed.
//        private void 
        ClearShowKeyboardCueState:function() 
        {
            // if we set KeyboradNavigation.ShowKeyboardCuesProperty in ShowDialog,
            // set it to false here.
            if (_resetKeyboardCuesProperty == true) 
            {
                _resetKeyboardCuesProperty = false; 
                SetValue(KeyboardNavigation.ShowKeyboardCuesProperty, BooleanBoxes.Box(_previousKeyboardCuesProperty)); 
            }
        }, 

//        private void 
        UpdateVisibilityProperty:function(/*Visibility*/ value)
        {
            // _visibilitySetInternally is used to identify a call (in _OnVisibilityInvalidated 
            // callback) for updating the property value only and not changing the actual
            // visibility state of the hwnd. 
            try 
            {
                _visibilitySetInternally = true; 
                SetValue(VisibilityProperty, value);
            }
            finally
            { 
                _visibilitySetInternally = false;
            } 
        }, 

        ///<SecurityNote>
        /// There is an explicit demand here - to enforce not being able to set this DP in Internet Zone. 
        /// this should remanin here until Window spoofing work is done.
        ///</SecurityNote> 
//        private void 
        OnHeightChanged:function(/*double*/ height) 
        {
        }, 
 
//        private void 
        OnWidthChanged:function(/*double*/ width)
        { 
            ValidateLengthForHeightWidth(width);

        },
        
//        private void 
        OnTopChanged:function(/*double*/ newTop) 
        {
        },
        // _actualLeft is used to determine if LocationChanged should be fired in WMMoveChagnged.
        // We need it b/c we need to remember the last hwnd Left location to decide whether
        // we need to fire the event or not.  Why do we need to update here?  Well, for the following
        // scenario: 
        //    Window w = new Window();
        //    w.Left = 100; 
        //    w.WindowStyle = WindowStyle.None; 
        //    w.Show();
        // 
        //  In this case, we want to not fire LocationChanged from SetWindowPos called called
        //  from CorrectStyleForBorderlessWindowCase().
        //
        //  _actualLeft is update from the following places: 
        //
        // 
        // 1) In WM_MOVE handler 
        //
        // 2) In OnLeftChanged for the case when the hwnd is not created yet. 
        //
        // 3) SetupInitialState
//        private void 
        OnLeftChanged:function(/*double*/ newLeft)
        { 
        },
 
//        private void 
        OnResizeModeChanged:function()
        {
        }, 
        /// <summary> 
        ///     Right to Left
        /// </summary> 
//        private void 
        OnFlowDirectionChanged:function()
        {
        },
        
//        /// <summary>
//        ///     This event is raised before the window is closed 
//        /// </summary>
//        /// <remarks>
//        ///     The user can set the CancelEventArg.Cancel property to true to prevent
//        ///     the window from closing. However, if the Applicaiton is shutting down 
//        ///     the window closing cannot be cancelled
//        /// </remarks> 
//        public event CancelEventHandler Closing 
//        {
//            add { Events.AddHandler(EVENT_CLOSING, value); } 
//            remove { Events.RemoveHandler(EVENT_CLOSING, value); }
//        }
//
//        /// <summary> 
//        ///     This event is raised when the window is closed.
//        /// </summary> 
//        public event EventHandler Closed 
//        {
//            add { Events.AddHandler(EVENT_CLOSED, value); } 
//            remove { Events.RemoveHandler(EVENT_CLOSED, value); }
//        }
        
        

	});
	
	Object.defineProperties(Window.prototype,{
        /// <summary>
        ///     Returns enumerator to logical children
        /// </summary> 
//        protected internal override IEnumerator 
		LogicalChildren:
        { 
            get:function() 
            {
                // Don't use UIElementCollection because we don't have a reference to content's visual parent; 
                // window has style and user can change it.
                return new SingleChildEnumerator(this.Content);
            }
        },
        /// <summary> 
        /// Whether or not the Window uses per-pixel opacity
        /// </summary> 
//        public bool 
        AllowsTransparency: 
        {
            get:function() { return this.GetValue(Window.AllowsTransparencyProperty); }, 
            set:function(value) { this.SetValue(Window.AllowsTransparencyProperty, value); }
        },
        
      /// <summary>
        ///     The data that will be displayed as the title of the window. 
        ///     Hosts are free to display the title in any manner that they
        ///     want.  For example, the browser may display the title set via 
        ///     the Title property somewhere besides the caption bar 
        /// </summary>
//        public string 
        Title:
        {
            get:function()
            { 
                return this.GetValue(Window.TitleProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(Window.TitleProperty, value); 
            }
        }, 

        /// <summary> 
        ///     Sets the Icon of the Window
        /// </summary> 
        /// <remarks> 
        ///     Following is the precedence for displaying the icon:
        /// 
        ///     1) Use ImageSource provided by the Icon property.  If Icon property is
        ///     null, see 2 below.
        ///     2) If Icon Property is not set, then use the Application icon
        ///     embedded in the exe.  Querying Icon property returns null. 
        ///     3) If no icon is embedded in the exe, then we set IntPtr.Zero
        ///     as the icon and Win32 displays its default icon.  Querying Icon 
        ///     property returns null. 
        ///
        ///     If Icon property is set, Window does not dispose that object when it 
        ///     is closed.
        ///     Callers must have UIPermission(UIPermissionWindow.AllWindows) to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///     Critical: This code causes icon value to be set. This in turn causes property invalidation
        ///               which will access unsafe native methods. 
        ///     PublicOK: There exists a demand , safe to expose 
        /// </SecurityNote>
//        public ImageSource 
        Icon: 
        {
            get:function()
            {
                return this.GetValue(Window.IconProperty);
            },
            set:function(value)
            { 
                // this call ends up throwing an exception if accessing 
                // Icon is not allowed
            	this.SetValue(Window.IconProperty, value); 
            }
        }, 

 
        /// <summary> 
        ///     Position for Top of the host window
        /// </summary> 
        /// <remarks>
        ///     The following values are valid:
        ///     Positive Doubles: sets the top location to the specified value
        ///     NaN: indicates to use the system default value. This 
        ///     is the default for Top property
        ///     PositiveInfinity, NegativeInfinity: These are invalid inputs. 
        /// </remarks> 
        /// <value></value>
//        public double 
        Top:
        {
            get:function()
            { 
                return this.GetValue(Window.TopProperty);
            },
            set:function(value)
            { 
            	this.SetValue(Window.TopProperty, value);
            } 
        },


        /// <summary> 
        ///     Position for Left edge of  coordinate of the host window
        /// </summary> 
        /// <remarks> 
        ///     The following values are valid:
        ///     Positive Doubles: sets the top location to the specified value 
        ///     NaN: indicates to use the system default value. This
        ///     is the default for Top property
        ///     PositiveInfinity, NegativeInfinity: These are invalid inputs.
        /// </remarks> 
        /// <value></value>
//        public double 
        Left: 
        {
            get:function()
            {
                return this.GetValue(Window.LeftProperty); 
            },
            set:function(value)
            {
            	this.SetValue(Window.LeftProperty, value);
            } 
        }, 
 
        /// <summary>
        ///     This enum can have following values 
        ///         Manual (default)
        ///         CenterScreen
        ///         CenterOwner
        /// 
        ///     If the WindowStartupLocation is WindowStartupLocation.Manual then
        ///     Top and Left properites are used to position the window. 
        ///     This property is used only before window creation. Once the window is 
        ///     created hiding it and showing it will not take this property into account.
        /// </summary> 
        /// <remarks>
        ///     WindowStartupLocation is used to position the window only it it is set to
        ///     WindowStartupLocation.CenterScreen or WindowStartupLocation.CenterOwner,
        ///     otherwise Top/Left is used.  Furthermore, if determining the location 
        ///     of the window is not possible when WindowStartupLocation is set to
        ///     WindowStartupLocation.CenterScreen or WindowStartupLocation.Owner, then 
        ///     Top/Left is used instead. 
        /// </remarks>
//        public WindowStartupLocation 
        WindowStartupLocation:
        {
            get:function()
            { 
                return this._windowStartupLocation;
            },
            set:function(value)
            { 
                this._windowStartupLocation = value; 
            }
        },

        /// <summary>
        /// Sets/gets DialogResult
        /// </summary> 
//        public Nullable<bool> 
        DialogResult: 
        { 
            get:function()
            { 
                return this._dialogResult; 
            },
            set:function(value) 
            {
                if (this._showingAsDialog == true)
                { 

                    // 03/03/2006 -- hamidm 
                    // Fix for 1388606 Close Dialog Window should not return null 
                    //
                    // According to the new design, setting DialogResult to its current value will not have any effect. 
                    if (this._dialogResult != value)
                    {
                    	this._dialogResult = value;
 
                        // if DialogResult is set from within a Closing event then
                        // the window is in the closing state.  Thus, if we call 
                        // Close() again from here we go into an infinite loop. 
                        //
                        // Note: Windows OS bug # 934500 Setting DialogResult 
                        // on the Closing EventHandler of a Dialog causes StackOverFlowException

                        if(this._isClosing == false)
                        { 
                        	this.Close();
                        } 
                    } 
                }
                else 
                {
                    throw new InvalidOperationException(SR.Get(SRID.DialogResultMustBeSetAfterShowDialog));

                } 
            }
        }, 
        

        /// <summary>
        ///     Defines the visual style of the window (3DBorderWindow, 
        ///     SingleBorderWindow, ToolWindow, none).
        /// </summary> 
        /// <remarks> 
        ///     Default will be SingleBorderWindow.
        /// </remarks> 
//        public WindowStyle 
        WindowStyle:
        {
            get:function()
            { 
                return this.GetValue(Window.WindowStyleProperty);
            },
            set:function(value)
            {
            	this.SetValue(Window.WindowStyleProperty, value);
            }
        },
      /// <summary> 
        ///     Current state of the window.  Valid options are Maximized, Minimized, 
        ///     or Normal.  The host window may choose to ignore a request to change
        ///     the current window state. 
        /// </summary>
//        public WindowState 
        WindowState:
        {
            get:function() 
            {
                return this.GetValue(Window.WindowStateProperty);
            },
            set:function(value)
            { 
            	this.SetValue(Window.WindowStateProperty, value);
            } 
        },
        

        /// <summary>
        ///     Current state of the window.  Valid options are Maximized, Minimized,
        ///     or Normal.  The host window may choose to ignore a request to change 
        ///     the current window state.
        /// </summary> 
//        public ResizeMode 
        ResizeMode: 
        {
            get:function() 
            {
                return this.GetValue(Window.ResizeModeProperty);
            },
            set:function(value)
            {
            	this.SetValue(Window.ResizeModeProperty, value);
            } 
        },
        
        /// <summary> 
        ///     Determines if this window is always on the top.
        /// </summary> 
//        public bool 
        Topmost:
        {
            get:function()
            { 
                return this.GetValue(Window.TopmostProperty);
            },
            set:function(value) 
            {
            	this.SetValue(Window.TopmostProperty, value);
            }
        },
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return _dType; } 
        },
        
        /// <summary>
        /// This tells whether user has set Visible or not. It's currently used in Application
        /// where if Visibility has not been set when the Window is navigated to, we set it to
        /// Visible 
        /// </summary>
//        internal bool 
        IsVisibilitySet: 
        { 
            get:function()
            { 
                return _isVisibilitySet;
            }
        }, 

//        bool IWindowService.
        UserResized:
        { 
            get:function() { return false; }
        } 
        
        
	});
	
	Object.defineProperties(Window,{
		/// <summary> 
        /// DependencyProperty for AllowsTransparency
        /// </summary>
//        public static readonly DependencyProperty 
		AllowsTransparencyProperty:
        {
        	get:function(){
        		if(Window._AllowsTransparencyProperty === undefined){
        			Window._AllowsTransparencyProperty =
                        DependencyProperty.Register( 
                                "AllowsTransparency",
                                Boolean.Type, 
                                Window.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        new PropertyChangedCallback(null, OnAllowsTransparencyChanged),
                                        new CoerceValueCallback(null, CoerceAllowsTransparency))*/
                                FrameworkPropertyMetadata.Build3CVCB(
                                        false, 
                                        new PropertyChangedCallback(null, OnAllowsTransparencyChanged),
                                        new CoerceValueCallback(null, CoerceAllowsTransparency)));
        		}
        		
        		return Window._AllowsTransparencyProperty;
        	}
        }, 
        
        /// <summary>
        ///     The DependencyProperty for TitleProperty.
        ///     Flags:              None 
        ///     Default Value:      String.Empty
        /// </summary> 
//        public static readonly DependencyProperty 
		TitleProperty:
        {
        	get:function(){
        		if(Window._TitleProperty === undefined){
        			Window._TitleProperty = 
                        DependencyProperty.Register("Title", typeof(String), Window.Type,
                                /*new FrameworkPropertyMetadata(String.Empty, 
                                        new PropertyChangedCallback(null, _OnTitleChanged))*/
                        		FrameworkPropertyMetadata.BuildWithDVandPCCB(String.Empty, 
                                        new PropertyChangedCallback(null, _OnTitleChanged)),
                                new ValidateValueCallback(null, _ValidateText)); 
        		}
        		
        		return Window._TitleProperty;
        	}
        }, 
        
        /// <summary>
        ///     The DependencyProperty for Icon 
        ///     Flags:              None
        ///     Default Value:      None
        /// </summary>
//        public static readonly DependencyProperty 
		IconProperty:
        {
        	get:function(){
        		if(Window._IconProperty === undefined){
        			Window._IconProperty = 
                        DependencyProperty.Register(
                                "Icon", 
                                String.Type, 
                                Window.Type,
                                /*new FrameworkPropertyMetadata( 
                                        new PropertyChangedCallback(null, _OnIconChanged),
                                        new CoerceValueCallback(null, VerifyAccessCoercion))*/
                                FrameworkPropertyMetadata.BuildWithPCCBandCVCB( 
                                        new PropertyChangedCallback(null, _OnIconChanged),
                                        new CoerceValueCallback(null, VerifyAccessCoercion))); 
        		}
        		
        		return Window._IconProperty;
        	}
        }, 
      /// <summary>
        /// DependencyProperty for <see cref="Top" /> property. 
        /// </summary> 

//        public static readonly DependencyProperty 
		TopProperty:
        {
        	get:function(){
        		if(Window._TopProperty === undefined){
        			Window._TopProperty = 
                        Canvas.TopProperty.AddOwner(Window.Type,
                                /*new FrameworkPropertyMetadata(
                                        Number.NaN,
                                        new PropertyChangedCallback(null, _OnTopChanged), 
                                        new CoerceValueCallback(null, CoerceTop))*/
                        		FrameworkPropertyMetadata.Build3CVCB(
                                        Number.NaN,
                                        new PropertyChangedCallback(null, _OnTopChanged), 
                                        new CoerceValueCallback(null, CoerceTop)));
        		}
        		
        		return Window._TopProperty;
        	}
        }, 
        /// <summary>
        /// DependencyProperty for <see cref="Left" /> property. 
        /// </summary>
//        public static readonly DependencyProperty 
		LeftProperty:
        {
        	get:function(){
        		if(Window._LeftProperty === undefined){
        			Window._LeftProperty = 
                        Canvas.LeftProperty.AddOwner(Window.Type, 
                                /*new FrameworkPropertyMetadata(
                                        Number.NaN, 
                                        new PropertyChangedCallback(null, _OnLeftChanged),
                                        new CoerceValueCallback(null, CoerceLeft))*/
                        		FrameworkPropertyMetadata.Build3CVCB(
                                        Number.NaN, 
                                        new PropertyChangedCallback(null, _OnLeftChanged),
                                        new CoerceValueCallback(null, CoerceLeft))); 
        		}
        		
        		return Window._LeftProperty;
        	}
        }, 
            
        /// <summary>
        ///     The DependencyProperty for WindowStyleProperty. 
        ///     Flags:              None
        ///     Default Value:      WindowStyle.SingleBorderWindow
        /// </summary>
//        public static readonly DependencyProperty 
		WindowStyleProperty:
        {
        	get:function(){
        		if(Window._WindowStyleProperty === undefined){
        			Window._WindowStyleProperty = 
                        DependencyProperty.Register("WindowStyle", typeof(WindowStyle), Window.Type,
                                /*new FrameworkPropertyMetadata( 
                                        WindowStyle.SingleBorderWindow, 
                                        new PropertyChangedCallback(null, _OnWindowStyleChanged),
                                        new CoerceValueCallback(null, CoerceWindowStyle))*/
                        		FrameworkPropertyMetadata.Build3CVCB( 
                                        WindowStyle.SingleBorderWindow, 
                                        new PropertyChangedCallback(null, _OnWindowStyleChanged),
                                        new CoerceValueCallback(null, CoerceWindowStyle)), 
                                new ValidateValueCallback(null, _ValidateWindowStyleCallback)); 
        		}
        		
        		return Window._WindowStyleProperty;
        	}
        }, 
        /// <summary>
        ///     The DependencyProperty for WindowStateProperty.
        ///     Flags:              None
        ///     Default Value:      WindowState.Normal 
        /// </summary>
//        public static readonly DependencyProperty 
		WindowStateProperty:
        {
        	get:function(){
        		if(Window._WindowStateProperty === undefined){
        			Window._WindowStateProperty = 
                        DependencyProperty.Register("WindowState", typeof(WindowState), Window.Type, 
                                /*new FrameworkPropertyMetadata(
                                        WindowState.Normal, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, _OnWindowStateChanged),
                                        new CoerceValueCallback(null, VerifyAccessCoercion))*/
                        		FrameworkPropertyMetadata.Build4(
                                        WindowState.Normal, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                        new PropertyChangedCallback(null, _OnWindowStateChanged),
                                        new CoerceValueCallback(null, VerifyAccessCoercion)),
                                new ValidateValueCallback(null, _ValidateWindowStateCallback)); 
        		}
        		
        		return Window._WindowStateProperty;
        	}
        }, 
        /// <summary> 
        ///     The DependencyProperty for the ResizeMode property.
        ///     Flags:                  AffectsMeasure 
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty 
		ResizeModeProperty:
        {
        	get:function(){
        		if(Window._ResizeModeProperty === undefined){
        			Window._ResizeModeProperty =
                        DependencyProperty.Register("ResizeMode", Number.Type, Window.Type, 
                                /*new FrameworkPropertyMetadata(ResizeMode.CanResize,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, _OnResizeModeChanged), 
                                        new CoerceValueCallback(null, VerifyAccessCoercion))*/
                        		FrameworkPropertyMetadata.Build4(ResizeMode.CanResize,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(null, _OnResizeModeChanged), 
                                        new CoerceValueCallback(null, VerifyAccessCoercion)),
                                new ValidateValueCallback(null, _ValidateResizeModeCallback)); 
        		}
        		
        		return Window._ResizeModeProperty;
        	}
        },  
        /// <summary>
        ///     The DependencyProperty for TopmostProperty. 
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary> 
//        public static readonly DependencyProperty 
		TopmostProperty:
        {
        	get:function(){
        		if(Window._TopmostProperty === undefined){
        			Window._TopmostProperty =
                        DependencyProperty.Register("Topmost", 
                                typeof(bool),
                                Window.Type,
                                /*new FrameworkPropertyMetadata(fasle,
                                        new PropertyChangedCallback(null, _OnTopmostChanged), 
                                        new CoerceValueCallback(null, VerifyAccessCoercion))*/
                                FrameworkPropertyMetadata.Build3CVCB(fasle,
                                        new PropertyChangedCallback(null, _OnTopmostChanged), 
                                        new CoerceValueCallback(null, VerifyAccessCoercion)));
        		}
        		
        		return Window._TopmostProperty;
        	}
        }, 
        
//        internal static readonly DependencyProperty 
		IWindowServiceProperty:
        {
        	get:function(){
        		if(Window._IWindowServiceProperty === undefined){
        			Window._IWindowServiceProperty = DependencyProperty.RegisterAttached("IWindowService", 
        					IWindowService.Type, Window.Type,
                            /*new FrameworkPropertyMetadata(null, 
                                    FrameworkPropertyMetadataOptions.Inherits 
                                    | FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior)*/
        					FrameworkPropertyMetadata.Build2(null, 
                                    FrameworkPropertyMetadataOptions.Inherits 
                                    | FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior)); 
        		}
        		
        		return Window._IWindowServiceProperty;
        	}
        },
      /// <summary> 
        /// DialogCancel Command. It closes window if it's dialog and return false as the dialog value.
        /// </summary> 
        /// <remarks>
        /// Right now this is only used by Cancel Button to close the dialog.
        /// </remarks>
//        internal static readonly RoutedCommand 
        DialogCancelCommand:
        {
        	get:function(){
        		if(Window._DialogCancelCommand === undefined){
        			Window._DialogCancelCommand  = new RoutedCommand("DialogCancel", Window.Type); 
        		}
        		
        		return Window._DialogCancelCommand;
        	}
        },
  
	});
	

    /// <summary>
    /// Gets Window in which the given DependecyObject is hosted in.
    /// </summary>
    /// <param name="dependencyObject">Returns the Window the given dependencyObject is hosted in.</param> 
    /// <returns>Window</returns>
//    public static Window
	GetWindow = function(/*DependencyObject*/ dependencyObject) 
    { 
        if (dependencyObject == null)
        { 
            throw new ArgumentNullException("dependencyObject");
        }

        // Window.IWindowServiceProperty is an internal inheritable dependency property 
        // Normally this value is set to the root Window element, all the element
        // inside the window view will get this value through property inheritance mechanism. 

        var result = dependencyObject.GetValue(Window.IWindowServiceProperty);
        return result instanceof Window ? result : null;
    };
    
//    private static void 
    function OnAllowsTransparencyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
    } 

//    private static object 
    function CoerceAllowsTransparency(/*DependencyObject*/ d, /*object*/ value)
    { 
        return value;
    } 
    

//    private static object 
    function CoerceWindowStyle(/*DependencyObject*/ d, /*object*/ value) 
    { 
        return value; 
    }
    
    /// <summary>
    /// Dialog Command Execute handler
    /// Right now we only have DialogCancel Command, which closes window if it's dialog and return false for DialogResult.
    /// </summary> 
    /// <param name="target"></param>
    /// <param name="e"></param> 
//    private static void 
    function OnDialogCommand(/*object*/ target, /*ExecutedRoutedEventArgs*/ e) 
    {
        //close dialog & return result 
//        var w = target as Window;

        Debug.Assert(w != null, "Target must be of type Window.");
        w.OnDialogCancelCommand(); 
    }
    
//    private static void 
    function _OnIconChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = (Window)d;
        Debug.Assert(w != null, "DependencyObject must be of type Window.");

        // We'll support most kinds of Images.  If it's not a BitmapFrame we'll rasterize it. 
        w.OnIconChanged(e.NewValue);
    }
    
//    private static void 
    function _OnTitleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        Window w = (Window)d; 
        Debug.Assert(w != null, "DependencyObject must be of type Window.");

        w.OnTitleChanged();
    } 

//    private static bool 
    function _ValidateText(/*object*/ value) 
    { 
        return (value != null);
    }
//    private static bool 
    function _ValidateWindowStateCallback(/*object*/ value)
    {
        return IsValidWindowState(value);
    } 

//    private static void 
    function _OnWindowStateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        Window w = (Window)d;

        Debug.Assert(w != null, "DependencyObject must be of type Window.");
        w.OnWindowStateChanged( e.NewValue);
    }
//    private static bool 
    function _ValidateWindowStyleCallback(/*object*/ value)
    { 
        return IsValidWindowStyle(value);
    } 

//    private static void 
    function _OnWindowStyleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = (Window)d;

        Debug.Assert(w != null, "DependencyObject must be of type Window.");
        w.OnWindowStyleChanged( e.NewValue); 
    }
//    private static void 
    function _OnTopmostChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = (Window)d;

        Debug.Assert(w != null, "DependencyObject must be of type Window."); 
        w.OnTopmostChanged( e.NewValue);
    } 
//    private static object 
    function CoerceVisibility(/*DependencyObject*/ d, /*object*/ value)
    {
//        Window w = (Window)d;

        var newValue = /*(Visibility)*/value;
        if (newValue == Visibility.Visible) 
        { 
        }

        return value;
    } 

    /// <summary>
    /// Called when VisiblityProperty is invalidated 
    /// The actual window is created when the Visibility property is set
    /// to Visibility.Visible for the first time or when Show is called.
    /// For Window, Visibility.Visible means the Window is visible.
    /// Visibility.Hidden and Visibility.Collapsed mean the Window is not visible. 
    /// Visibility.Hidden and Visibility.Collapsed are treated the same.
    /// </summary> 
//    private static void 
    function _OnVisibilityChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        Window w = (Window)d; 

        // Indicate Visibility has been set
        // This works fine because Window is always the root.  So Visibility property
        // would not be invalidated usless it is set to a value.  But if that changes, 
        // we will get invalidation when Window it added to the tree and this would be broken.
        w._isVisibilitySet = true; 

        // _visibilitySetInternally is used to identify a call from Show/Hide in
        // _OnVisibilityInvalidated callback.  If a call originates in Show/Hide, 
        // we DO NOT want to do anything in the _OnVisibilityCallback since, we
        // synchronously call ShowHelper from Show/Hide
        if (w._visibilitySetInternally == true)
        { 
            return;
        } 

        var visibilityValue = VisibilityToBool(e.NewValue);

        w.Dispatcher.BeginInvoke(
            DispatcherPriority.Normal,
            new DispatcherOperationCallback(w.ShowHelper),
            visibilityValue ? BooleanBoxes.TrueBox : BooleanBoxes.FalseBox); 
    }
    /// <summary>
    /// Validate [Max/Min]Width/Height and Top/Left value.
    /// </summary>
    /// Length takes Double; Win32 handles Int. 
    /// We throw exception when the value goes below Int32Min and Int32Max.
    /// WorkItem 26263: ValidateValueCallback needs to move to PropertyMetadata so Window can 
    /// add its own validation and validate before invalid value is set. Right now, we can only 
    /// validate this in PropertyInalidatinonCallback because of this. (We couldn't make it virtual on
    /// FrameworkELement because ValidateValueCallback doesn't provide context. Work item 25275). 
//    private static void 
    function ValidateLengthForHeightWidth(/*double*/ l)
    {
        //basically, NaN and PositiveInfinity are ok, and then anything
        //that can be converted to Int32 
        if (!Double.IsPositiveInfinity(l) && !DoubleUtil.IsNaN(l) &&
            ((l > Int32.MaxValue) || (l < Int32.MinValue))) 
        { 
            throw new ArgumentException(SR.Get(SRID.ValueNotBetweenInt32MinMax, l));
        } 
    }

//    private static void 
    function ValidateTopLeft(/*double*/ length)
    { 
        // Values not allowed: PositiveInfinity, NegativeInfinity
        // and values that are beyond the range of Int32 
        if (Double.IsPositiveInfinity(length) || 
            Double.IsNegativeInfinity(length))
        { 
            throw new ArgumentException(SR.Get(SRID.InvalidValueForTopLeft, length));
        }

        if ((length > Int32.MaxValue) || 
            (length < Int32.MinValue))
        { 
            throw new ArgumentException(SR.Get(SRID.ValueNotBetweenInt32MinMax, length)); 
        }
    } 

//    private static void 
    function _OnHeightChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        Window w = d as Window; 
        Debug.Assert(w != null, "d must be typeof Window");
        if (w._updateHwndSize) 
        { 
            w.OnHeightChanged(e.NewValue);
        } 
    }
//    private static void 
    function _OnWidthChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        Window w = d as Window; 
        Debug.Assert(w != null, "d must be typeof Window");
        if (w._updateHwndSize)
        {
            w.OnWidthChanged(e.NewValue); 
        }
    } 
    
//    private static object 
    function CoerceTop(/*DependencyObject*/ d, /*object*/ value) 
    {

        return value;
    }

//    private static void 
    function _OnTopChanged (/*DependencyObject*/ d , /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = d as Window; 
        Debug.Assert( w != null, "DependencyObject must be of type Window." );

        if (w._updateHwndLocation)
        {
            w.OnTopChanged(e.NewValue);
        } 
    }
    
    // Please see comments for CoerceTop. 
//    private static object 
    function CoerceLeft(/*DependencyObject*/ d, /*object*/ value)
    { 

        return value;
    } 

//    private static void 
    function _OnLeftChanged (/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = d as Window;
        Debug.Assert( w != null, "DependencyObject must be of type Window." );

        if (w._updateHwndLocation) 
        {
            w.OnLeftChanged(e.NewValue); 
        } 
    }
//    private static bool 
    function _ValidateResizeModeCallback(/*object*/ value) 
    {
        return IsValidResizeMode(value); 
    }

//    private static void 
    function _OnResizeModeChanged (/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = d as Window;
        Debug.Assert( w != null, "DependencyObject must be of type Window." ); 

        w.OnResizeModeChanged();
    } 
    
//    private static bool 
    function IsValidResizeMode(/*ResizeMode*/ value)
    { 
        return value == ResizeMode.NoResize 
            || value == ResizeMode.CanMinimize
            || value == ResizeMode.CanResize 
            || value == ResizeMode.CanResizeWithGrip;
    }

//    private static bool 
    function IsValidWindowStartupLocation(/*WindowStartupLocation*/ value) 
    {
        return value == WindowStartupLocation.CenterOwner 
            || value == WindowStartupLocation.CenterScreen 
            || value == WindowStartupLocation.Manual;
    } 

//    private static bool 
    function IsValidWindowState(/*WindowState*/ value)
    {
        return value == WindowState.Maximized 
            || value == WindowState.Minimized
            || value == WindowState.Normal; 
    } 

//    private static bool 
    function IsValidWindowStyle(/*WindowStyle*/ value) 
    {
        return value == WindowStyle.None
            || value == WindowStyle.SingleBorderWindow
            || value == WindowStyle.ThreeDBorderWindow 
            || value == WindowStyle.ToolWindow;
    } 

//    private static void 
    function _OnFlowDirectionChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Window w = d as Window;
        Debug.Assert(w != null, "DependencyObject must be of type Window.");

        w.OnFlowDirectionChanged(); 
    }
    
//    internal static bool VisibilityToBool(Visibility v) 
//    {
//        switch (v) 
//        { 
//            case Visibility.Visible:
//                return true; 
//            case Visibility.Hidden:
//            case Visibility.Collapsed:
//                return false;
//            default: 
//                return false;
//        } 
//    } 
    
    /// <summary> 
    ///     Initializes the dependency ids of this class
    /// </summary>
    /// <SecurityNote>
    /// Critical: Calls critical native method RegisterWindowMessage 
    /// TreatAsSafe: The class has inheritance demand and constructor is blocked in partial trust
    /// </SecurityNote> 
//    static Window()
    function Initialize()
    { 
        HeightProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnHeightChanged)));
        MinHeightProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnMinHeightChanged)));
        MaxHeightProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnMaxHeightChanged)));
        WidthProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnWidthChanged))); 
        MinWidthProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnMinWidthChanged)));
        MaxWidthProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnMaxWidthChanged))); 

        // override VisibilityProperty Metadata. For Window, Visibility.Visible means the Window is visible.
        // Visibility.Hidden and Visibility.Collapsed mean the Window is not visible. 
        // Visibility.Hidden and Visibility.Collapsed are treated the same.
        // We default to Visibility.Collapsed since RenderSize returns (0,0) only for
        // collapsed elements and not for hidden. We want to return (0,0) when window is
        // never shown. 
        VisibilityProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(Visibility.Collapsed, new PropertyChangedCallback(_OnVisibilityChanged), new CoerceValueCallback(CoerceVisibility)));

        IsTabStopProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); 
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle));
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle)); 
        KeyboardNavigation.ControlTabNavigationProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle));
        FocusManager.IsFocusScopeProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(BooleanBoxes.TrueBox));

        DefaultStyleKeyProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(Window.Type)); 
        _dType = DependencyObjectType.FromSystemTypeInternal(Window.Type);

        FlowDirectionProperty.OverrideMetadata(Window.Type, new FrameworkPropertyMetadata(new PropertyChangedCallback(_OnFlowDirectionChanged))); 
    }
	
	Window.Type = new Type("Window", Window, [ContentControl.Type, IWindowService.Type]);
	return Window;
});

//        /// <summary> 
//        ///     List of events on this Window
//        /// </summary> 
//        private EventHandlerList Events
//        {
//            get
//            { 
//                if (_events == null)
//                { 
//                    _events = new EventHandlerList(); 
//                }
//                return _events; 
//            }
//        }
//
// 
//        private Window              _ownerWindow;                       // owner window 
// 
//        // keeps track of the owner hwnd
//        // we need this one b/c a owner/parent 
//        // can be set through the WindowInteropHandler
//        // which is different than the owner Window object
//        ///<SecurityNote>
//        /// Critical - handle of the parent window; get/set considered privileged operation 
//        ///</SecurityNote>
//        private WindowCollection    _ownedWindows;
//
//        private bool                _updateStartupLocation; 
//        private bool                _isVisible;
//        private bool                _isVisibilitySet;           // use this to tell whether Visibility is set or not. 
//        private bool                _resetKeyboardCuesProperty; // true if we set ShowKeyboradCuesProperty in ShowDialog 
//        private bool                _previousKeyboardCuesProperty;
// 
//        private static bool         _dialogCommandAdded;
//
//        // 
//
//        private bool                _showingAsDialog;
//        private bool                _visibilitySetInternally; 
//
//        private double              _trackMinWidthDeviceUnits = 0; 
//        private double              _trackMinHeightDeviceUnits = 0;
//        private double              _trackMaxWidthDeviceUnits = Double.PositiveInfinity;
//        private double              _trackMaxHeightDeviceUnits = Double.PositiveInfinity;
//        private double              _windowMaxWidthDeviceUnits = Double.PositiveInfinity; 
//        private double              _windowMaxHeightDeviceUnits = Double.PositiveInfinity;
// 
//
//        private ImageSource _icon;
//
//        private bool?                       _dialogResult = null; 
//
//        private WindowStartupLocation       _windowStartupLocation = WindowStartupLocation.Manual; 
//
//        // The previous WindowState value before WindowState changes 
//        private WindowState                 _previousWindowState = WindowState.Normal; 
//        private EventHandlerList    _events; 
//
//        // reference to Resize Grip control; this is used to find out whether
//        // the mouse of over the resizegrip control 
//        private Control                 _resizeGripControl;
// 
//        // static objects for Events 
//        private static readonly object EVENT_SOURCEINITIALIZED = new object();
//        private static readonly object EVENT_CLOSING = new object();
//        private static readonly object EVENT_CLOSED = new object();
//        private static readonly object EVENT_ACTIVATED = new object(); 
//        private static readonly object EVENT_DEACTIVATED = new object();
//        private static readonly object EVENT_STATECHANGED = new object(); 
//        private static readonly object EVENT_LOCATIONCHANGED = new object(); 
//        private static readonly object EVENT_CONTENTRENDERED = new object();
// 
//        // Magic constant determined by Shell.
//        private const int c_MaximumThumbButtons = 7; 
//        private Size _overlaySize; 

