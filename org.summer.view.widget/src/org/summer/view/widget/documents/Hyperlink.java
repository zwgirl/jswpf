package org.summer.view.widget.documents;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkContentElement;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.RoutedEventHandler;
import org.summer.view.widget.RoutingStrategy;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.Uri;
import org.summer.view.widget.input.ICommand;
import org.summer.view.widget.input.ICommandSource;
import org.summer.view.widget.input.Key;
import org.summer.view.widget.input.KeyEventArgs;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.ModifierKeys;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.input.MouseButtonEventArgs;
import org.summer.view.widget.input.MouseEventArgs;
import org.summer.view.widget.internal.EventHandler;
import org.summer.view.widget.markup.IUriContext;
import org.summer.view.widget.navigation.BaseUriHelper;
import org.summer.view.window.automation.peer.AutomationEvents;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary>
    /// Implements a Hyperlink element 
    /// </summary>
//    [UIPermissionAttribute(SecurityAction.InheritanceDemand, Unrestricted = true)] 
//    [TextElementEditingBehaviorAttribute(IsMergeable = false, IsTypographicOnly = false)] 
    public class Hyperlink extends Span implements ICommandSource, IUriContext
    { 
        //-------------------------------------------------------------------
        //
        // Constructors
        // 
        //---------------------------------------------------------------------
 
//        #region Constructors 

        // 
        // Static Ctor to create default style sheet
        //
        static //Hyperlink()
        { 
            DefaultStyleKeyProperty.OverrideMetadata(typeof(Hyperlink), new FrameworkPropertyMetadata(typeof(Hyperlink)));
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(Hyperlink)); 
            FocusableProperty.OverrideMetadata(typeof(Hyperlink), new FrameworkPropertyMetadata(true)); 
            EventManager.RegisterClassHandler(typeof(Hyperlink), Mouse.QueryCursorEvent, new QueryCursorEventHandler(OnQueryCursor));
        } 

        /// <summary>
        /// Initializes a new instance of Hyperlink element.
        /// </summary> 
        /// <remarks>
        /// To become fully functional this element requires at least one other Inline element 
        /// as its child, typically Run with some text. 
        /// </remarks>
        public Hyperlink() 
        {
        	super() ;
        }

        /// <summary> 
        /// Initializes a new instance of Hyperlink element and adds a given Inline element as its first child.
        /// </summary> 
        /// <param name="childInline"> 
        /// Inline element added as an initial child to this Hyperlink element
        /// </param> 
        public Hyperlink(Inline childInline) 
        {
        	super(childInline);
        }
 
        /// <summary>
        /// Creates a new Span instance. 
        /// </summary> 
        /// <param name="childInline">
        /// Optional child Inline for the new Span.  May be null. 
        /// </param>
        /// <param name="insertionPosition">
        /// Optional position at which to insert the new Span.  May be null.
        /// </param> 
        public Hyperlink(Inline childInline, TextPointer insertionPosition) 
        { 
        	super(childInline, insertionPosition);
        } 

        /// <summary> 
        /// Creates a new Hyperlink instance covering existing content.
        /// </summary>
        /// <param name="start">
        /// Start position of the new Hyperlink. 
        /// </param>
        /// <param name="end"> 
        /// End position of the new Hyperlink. 
        /// </param>
        /// <remarks> 
        /// start and end must both be parented by the same Paragraph, otherwise
        /// the method will raise an ArgumentException.
        /// </remarks>
        public Hyperlink(TextPointer start, TextPointer end) 
        {
        	super(start, end) ;
            // After inserting this Hyperlink, we need to extract any child Hyperlinks. 
 
            TextPointer navigator = this.ContentStart.CreatePointer();
            TextPointer stop = this.ContentEnd; 

            while (navigator.CompareTo(stop) < 0)
            {
                Hyperlink hyperlink = navigator.GetAdjacentElement(LogicalDirection.Forward) as Hyperlink; 

                if (hyperlink != null) 
                { 
                    hyperlink.Reposition(null, null);
                } 
                else
                {
                    navigator.MoveToNextContextPosition(LogicalDirection.Forward);
                } 
            }
        } 
 
//        #endregion Constructors
 
        //--------------------------------------------------------------------
        //
        // Public Methods
        // 
        //---------------------------------------------------------------------
 
//        #region Public Methods 

        /// <summary> 
        /// This method does exactly the same operation as clicking the Hyperlink with the mouse, except the navigation is not treated as user-initiated.
        /// </summary>
        public void DoClick()
        { 
            DoNonUserInitiatedNavigation(this);
        } 
 
//        #region ICommandSource
 
        /// <summary>
        ///     The DependencyProperty for RoutedCommand
        /// </summary>
        public static final DependencyProperty CommandProperty = 
                DependencyProperty.Register(
                        "Command", 
                        typeof(ICommand), 
                        typeof(Hyperlink),
                        new FrameworkPropertyMetadata((ICommand)null, 
                            new PropertyChangedCallback(OnCommandChanged)));

        /// <summary>
        /// Get or set the Command property 
        /// </summary>
//        [Bindable(true), Category("Action")] 
//        [Localizability(LocalizationCategory.NeverLocalize)] 
        public ICommand Command
        { 
            get
            {
                return (ICommand)GetValue(CommandProperty);
            } 
            set
            { 
                SetValue(CommandProperty, value); 
            }
        } 

        private static void OnCommandChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            Hyperlink h = (Hyperlink)d; 
            h.OnCommandChanged((ICommand)e.OldValue, (ICommand)e.NewValue);
        } 
 
        private void OnCommandChanged(ICommand oldCommand, ICommand newCommand)
        { 
            if (oldCommand != null)
            {
                UnhookCommand(oldCommand);
            } 
            if (newCommand != null)
            { 
                HookCommand(newCommand); 
            }
        } 

        private void UnhookCommand(ICommand command)
        {
            EventHandler handler = CanExecuteChangedHandler.GetValue(this); 
            if (handler != null)
            { 
                command.CanExecuteChanged -= handler; 
                CanExecuteChangedHandler.ClearValue(this);
            } 
            UpdateCanExecute();
        }

        private void HookCommand(ICommand command) 
        {
            EventHandler handler = new EventHandler(OnCanExecuteChanged); 
            CanExecuteChangedHandler.SetValue(this, handler); 
            command.CanExecuteChanged += handler;
            UpdateCanExecute(); 
        }

        private void OnCanExecuteChanged(Object sender, EventArgs e)
        { 
            UpdateCanExecute();
        } 
 
        private void UpdateCanExecute()
        { 
            if (Command != null)
            {
                CanExecute = MS.Internal.Commands.CommandHelpers.CanExecuteCommandSource(this);
            } 
            else
            { 
                CanExecute = true; 
            }
        } 

        private boolean CanExecute
        {
            get { return _canExecute; } 
            set
            { 
                if (_canExecute != value) 
                {
                    _canExecute = value; 
                    CoerceValue(IsEnabledProperty);
                }
            }
        } 

        // Returns true when this Hyperlink is hosted by an enabled 
        // TextEditor (eg, within a RichTextBox). 
        private boolean IsEditable
        { 
            get
            {
                return (this.TextContainer.TextSelection != null &&
                        !this.TextContainer.TextSelection.TextEditor.IsReadOnly); 
            }
        } 
 
        /// <summary>
        ///     Fetches the value of the IsEnabled property 
        /// </summary>
        /// <remarks>
        ///     The reason this property is overridden is so that Hyperlink
        ///     can infuse the value for CanExecute into it. 
        /// </remarks>
        protected /*override*/ boolean IsEnabledCore 
        { 
            get
            { 
                return base.IsEnabledCore && CanExecute;
            }
        }
 
        /// <summary>
        /// The DependencyProperty for the CommandParameter 
        /// </summary> 
        public static final DependencyProperty CommandParameterProperty =
                DependencyProperty.Register( 
                        "CommandParameter",
                        typeof(Object),
                        typeof(Hyperlink),
                        new FrameworkPropertyMetadata((Object)null)); 

        /// <summary> 
        /// Reflects the parameter to pass to the CommandProperty upon execution. 
        /// </summary>
//        [Bindable(true), Category("Action")] 
//        [Localizability(LocalizationCategory.NeverLocalize)]
        public Object CommandParameter
        {
            get 
            {
                return GetValue(CommandParameterProperty); 
            } 
            set
            { 
                SetValue(CommandParameterProperty, value);
            }
        }
 
        /// <summary>
        ///     The DependencyProperty for Target property 
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary> 
        public static final DependencyProperty CommandTargetProperty =
                DependencyProperty.Register(
                        "CommandTarget",
                        typeof(IInputElement), 
                        typeof(Hyperlink),
                        new FrameworkPropertyMetadata((IInputElement)null)); 
 
        /// <summary>
        ///     The target element on which to fire the command. 
        /// </summary>
//        [Bindable(true), Category("Action")]
        public IInputElement CommandTarget
        { 
            get
            { 
                return (IInputElement)GetValue(CommandTargetProperty); 
            }
            set 
            {
                SetValue(CommandTargetProperty, value);
            }
        } 

//        #endregion 
 
//        #endregion Public Methods
 
        //--------------------------------------------------------------------
        //
        // Public Properties
        // 
        //----------------------------------------------------------------------
 
//        #region Public Properties 

        /// <summary> 
        /// Contains the target URI to navigate when hyperlink is clicked
        /// </summary>
//        [CommonDependencyProperty]
        public static final DependencyProperty NavigateUriProperty = 
            DependencyProperty.Register(
                      "NavigateUri", 
                      typeof(Uri), 
                      typeof(Hyperlink),
                      new FrameworkPropertyMetadata( 
                             (Uri)null,
                             new PropertyChangedCallback(OnNavigateUriChanged),
                             new CoerceValueCallback(CoerceNavigateUri)));
 
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
//        [SecurityCritical, SecurityTreatAsSafe] 
        /*internal*/ public static Object CoerceNavigateUri(DependencyObject d, Object value) 
        {
            // 
            // If the element for which NavigateUri is being changed is the protected element,
            // we don't let the update go through. This cancels NavigateUri modifications in
            // the critical period when the URI is shown on the status bar.
            // An example attack: 
            //      void hl_PreviewMouseLeftButtonUp(Object sender, MouseButtonEventArgs e)
            //      { 
            //          hl.NavigateUri = null; 
            //          hl.DoClick();
            //          hl.NavigateUri = new Uri("http://www.evil.com"); 
            //      }
            // (Or, instead of setting NavigateUri=null, add a handler for Hyperlink.RequestNavigateEvent and
            //  set e.Handled=true.)
            // 
            if (s_criticalNavigateUriProtectee.Value == d.GetHashCode() && ShouldPreventUriSpoofing)
            { 
                value = DependencyProperty.UnsetValue; 
            }
 
            return value;
        }

        /// <summary> 
        /// Provide public access to NavigateUriProperty property. Content the URI to navigate.
        /// </summary> 
//        [Bindable(true), CustomCategory("Navigation")] 
//        [Localizability(LocalizationCategory.Hyperlink)]
        public Uri NavigateUri 
        {
            get
            {
                return (Uri)GetValue(NavigateUriProperty); 

            } 
            set 
            {
                SetValue(NavigateUriProperty, value); 
            }
        }

        /// <summary> 
        /// Contains the target window to navigate when hyperlink is clicked
        /// </summary> 
        public static final DependencyProperty TargetNameProperty 
            = DependencyProperty.Register("TargetName", typeof(String), typeof(Hyperlink),
                                          new FrameworkPropertyMetadata(String.Empty)); 

        /// <summary>
        /// Provide public access to TargetNameProperty property.  The target window to navigate.
        /// </summary> 
//        [Bindable(true), CustomCategory("Navigation")]
//        [Localizability( 
//            LocalizationCategory.None, 
//            Modifiability = Modifiability.Unmodifiable)
//        ] 
        public String TargetName
        {
            get
            { 
                return (String)GetValue(TargetNameProperty);
            } 
            set 
            {
                SetValue(TargetNameProperty, value); 
            }
        }

//        #endregion Public Properties 

        //------------------------------------------------------------------- 
        // 
        // Public Events
        // 
        //----------------------------------------------------------------------

//        #region Public Events
 
        // **
        /// <summary>
        /// Navigate Event
        /// </summary>
        public static final RoutedEvent RequestNavigateEvent = EventManager.RegisterRoutedEvent( 
                                                    "RequestNavigate",
                                                    RoutingStrategy.Bubble, 
                                                    typeof(RequestNavigateEventHandler), 
                                                    typeof(Hyperlink));
 
        /// <summary>
        /// Add / Remove RequestNavigateEvent handler
        /// </summary>
        public /*event*/ RequestNavigateEventHandler RequestNavigate 
        {
            add 
            { 
                AddHandler(RequestNavigateEvent, value);
            } 
            remove
            {
                RemoveHandler(RequestNavigateEvent, value);
            } 
        }
 
        /// <summary> 
        /// Event correspond to left mouse button click
        /// </summary> 
        public static final RoutedEvent ClickEvent = System.Windows.Controls.Primitives.ButtonBase.ClickEvent.AddOwner(typeof(Hyperlink));

        /// <summary>
        /// Add / Remove ClickEvent handler 
        /// </summary>
//        [Category("Behavior")] 
        public /*event*/ RoutedEventHandler Click { add { AddHandler(ClickEvent, value); } remove { RemoveHandler(ClickEvent, value); } } 

        /// <summary> 
        /// StatusBar event
        /// </summary>
        /*internal*/ public static final RoutedEvent RequestSetStatusBarEvent = EventManager.RegisterRoutedEvent(
                                                    "RequestSetStatusBar", 
                                                    RoutingStrategy.Bubble,
                                                    typeof(RoutedEventHandler), 
                                                    typeof(Hyperlink)); 

//        #endregion Public Events 

        //-------------------------------------------------------------------
        //
        // Protected Methods 
        //
        //--------------------------------------------------------------------- 
 
//        #region Protected Methods
 
        /// <summary>
        /// This is the method that responds to the MouseButtonEvent event.
        /// </summary>
        /// <param name="e">Event arguments</param> 
        /// <remarks>Kept around for backward compatibility in derived classes.</remarks>
        protected /*internal*/ /*override*/ void OnMouseLeftButtonDown(MouseButtonEventArgs e) 
        { 
            base.OnMouseLeftButtonDown(e);
 
            if (IsEnabled && (!IsEditable || ((Keyboard.Modifiers & ModifierKeys.Control) != 0)))
            {
                OnMouseLeftButtonDown(this, e);
            } 
        }
 
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
//        [SecurityCritical]
        protected /*internal*/ /*override*/ void OnMouseLeftButtonUp(MouseButtonEventArgs e)
        {
            base.OnMouseLeftButtonUp(e); 

            OnMouseLeftButtonUp(this, e); 
        } 

//        #region Spoofing prevention and status bar access 

        /// <summary>
        /// Cached URI for spoofing countermeasures.
        /// </summary> 
        /// <remarks>
        /// We keep one per thread in case multiple threads would be involved in the spoofing attack. 
        /// </remarks> 
        /// <SecurityNote>
        ///     Critical for set - Changing the cached URI can open up for spoofing attacks. 
        /// </SecurityNote>
//        [ThreadStatic]
        private static SecurityCriticalDataForSet<Uri> s_cachedNavigateUri;
 
        /// <summary>
        /// Identification code of the hyperlink element currently protected against spoofing attacks. 
        /// This code is checked during the NavigateUri coerce value callback in order to protect the 
        /// NavigateUri from changing during the critical period between showing the URI on the status
        /// bar and clearing it, which is the timeframe where spoofing attacks can occur. 
        /// </summary>
        /// <remarks>
        /// We keep one per thread in case multiple threads would be involved in the spoofing attack.
        /// </remarks> 
        /// <SecurityNote>
        ///     Critical for set - Changing the identification code will make the element vulnerable 
        ///                        for spoofing. 
        /// </SecurityNote>
//        [ThreadStatic] 
        private static SecurityCriticalDataForSet<int?> s_criticalNavigateUriProtectee;

        /// <summary>
        /// Caches a target URI for spoofing prevention. 
        /// </summary>
        /// <param name="d">Hyperlink Object for which the target URI is to be cached.</param> 
        /// <param name="targetUri">Target URI the user expects to be navigate to.</param> 
        /// <SecurityNote>
        ///     Critical - Sets the cached URI that prevents spoofing attacks. 
        /// </SecurityNote>
//        [SecurityCritical]
        private static void CacheNavigateUri(DependencyObject d, Uri targetUri)
        { 
            //
            // This prevents against multi-threaded spoofing attacks. 
            // 
            d.VerifyAccess();
 
            s_cachedNavigateUri.Value = targetUri;
        }

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
//        [SecurityCritical, SecurityTreatAsSafe] 
        private static void NavigateToUri(IInputElement sourceElement, Uri targetUri, String targetWindow) 
        {
            Debug.Assert(targetUri != null); 

            //
            // This prevents against multi-threaded spoofing attacks.
            // 
            DependencyObject dObj = (DependencyObject)sourceElement;
            dObj.VerifyAccess(); 
 
            //
            // Spoofing countermeasure makes sure the URI hasn't changed since display in the status bar. 
            //
            Uri cachedUri = Hyperlink.s_cachedNavigateUri.Value;
            // ShouldPreventUriSpoofing is checked last in order to avoid incurring a first-chance SecurityException
            // in common scenarios. 
            if (cachedUri == null || cachedUri.Equals(targetUri) || !ShouldPreventUriSpoofing)
            { 
                // 

                // We treat FixedPage seperately to maintain backward compatibility 
                // with the original separate FixedPage implementation of this, which
                // calls the GetLinkUri method.
                if (!(sourceElement is Hyperlink))
                { 
                    targetUri = FixedPage.GetLinkUri(sourceElement, targetUri);
                } 
 
                RequestNavigateEventArgs navigateArgs = new RequestNavigateEventArgs(targetUri, targetWindow);
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
//        [SecurityCritical]
        private static void UpdateStatusBar(Object sender) 
        {
            IInputElement element = (IInputElement)sender;
            DependencyObject dObject = (DependencyObject)sender;
 
            Uri targetUri = (Uri)dObject.GetValue(GetNavigateUriProperty(element));
 
            // 
            // Keep the identification code for the element that's to be protected against spoofing
            // attacks because its URI is shown on the status bar. 
            //
            s_criticalNavigateUriProtectee.Value = dObject.GetHashCode();

            // 
            // Cache URI for spoofing countermeasures.
            // 
            CacheNavigateUri(dObject, targetUri); 

            RequestSetStatusBarEventArgs args = new RequestSetStatusBarEventArgs(targetUri); 
            element.RaiseEvent(args);
        }

        // The implementation of Hyperlink.NavigateUri and FixedPage.NavigateUri are unified, 
        // but the DPs themselves are not. FixedPage.NavigateUri is attached; Hyperlink.Navigate
        // is a regular DP. Use this method to get the property DP based on the element. 
        private static DependencyProperty GetNavigateUriProperty(Object element) 
        {
            Hyperlink hl = element as Hyperlink; 
            return (hl == null) ? FixedPage.NavigateUriProperty : NavigateUriProperty;
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
//        [SecurityCritical]
        private static void ClearStatusBarAndCachedUri(Object sender) 
        { 
            IInputElement element = (IInputElement)sender;
 
            //
            // Clear the status bar first, from this point on we're not protecting against spoofing
            // anymore.
            // 
            element.RaiseEvent(RequestSetStatusBarEventArgs.Clear);
 
            // 
            // Invalidate cache URI for spoofing countermeasures.
            // 
            CacheNavigateUri((DependencyObject)sender, null);

            //
            // Clear the identification code for the element that was protected against spoofing. 
            //
            s_criticalNavigateUriProtectee.Value = null; 
        } 

//        #endregion 

        /// <summary>
        /// Navigate to URI specified in NavigateUri property and mark the hyperlink as visited
        /// </summary> 
        /// <remarks>
        /// Some forms of navigation are not allowed in the internet zone. 
        /// As such there are cases where this API will demand for fulltrust. 
        ///
        /// This method is kept of backward compatibility and isn't a real event handler anymore. 
        /// It should remain in here however for subclasses that want to /*override*/ it either to
        /// redefine behavior or to get notified about the click event.
        /// </remarks>
        protected /*virtual*/ void OnClick() 
        {
            if (AutomationPeer.ListenerExists(AutomationEvents.InvokePatternOnInvoked)) 
            { 
                AutomationPeer peer = ContentElementAutomationPeer.CreatePeerForElement(this);
                if (peer != null) 
                    peer.RaiseAutomationEvent(AutomationEvents.InvokePatternOnInvoked);
            }

            DoNavigation(this); 
            RaiseEvent(new RoutedEventArgs(Hyperlink.ClickEvent, this));
 
            MS.Internal.Commands.CommandHelpers.ExecuteCommandSource(this); 
        }
 
        /// <summary>
        /// This is the method that responds to the KeyDown event.
        /// </summary>
        /// <remarks> 
        /// This method is kept for backward compatibility.
        /// </remarks> 
        /// <SecurityNote> 
        ///     Critical - Calls into static critical OnKeyDown method.
        /// </SecurityNote> 
//        [SecurityCritical]
        protected /*internal*/ public /*override*/ void OnKeyDown(KeyEventArgs e)
        {
            if (!e.Handled && e.Key == Key.Enter) 
            {
                OnKeyDown(this, e); 
            } 
            else
            { 
                super.OnKeyDown(e);
            }
        }
 
        //
        //  This property 
        //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject 
        //  2. This is a performance optimization
        // 
        /*internal*/ public /*override*/ int EffectiveValuesInitialSize
        {
            get { return 19; }
        } 

        /// <summary> 
        /// Creates AutomationPeer (<see cref="ContentElement.OnCreateAutomationPeer"/>) 
        /// </summary>
        protected /*override*/ System.Windows.Automation.Peers.AutomationPeer OnCreateAutomationPeer() 
        {
            return new System.Windows.Automation.Peers.HyperlinkAutomationPeer(this);
        }
 
//        #endregion Protected Methods
 
//        #region IUriContext implementation 

        /// <summary> 
        /// IUriContext interface is implemented by Hyperlink element so that it
        /// can hold on to the base URI used by parser.
        /// The base URI is needed to resolve NavigateUri property
        /// </summary> 
        /// <value>Base Uri</value>
        Uri IUriContext.BaseUri 
        { 
            get
            { 
                return  BaseUri;
            }
            set
            { 
                BaseUri = value;
            } 
        } 

        /// <summary> 
        ///    Implementation for BaseUri
        /// </summary>
        protected /*virtual*/ Uri BaseUri
        { 
            get
            { 
                return (Uri)GetValue(BaseUriHelper.BaseUriProperty); 
            }
            set 
            {
                SetValue(BaseUriHelper.BaseUriProperty, value);
            }
        } 

//        #endregion IUriContext implementation 
 

        //------------------------------------------------------------------- 
        //
        // Internal Properties
        //
        //---------------------------------------------------------------------- 

//        #region Internal Properties 
 
        /// <summary>
        /// The content spanned by this Hyperlink represented as plain text. 
        /// </summary>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        /*internal*/ public String Text
        { 
            get
            { 
                return TextRangeBase.GetTextInternal(this.ContentStart, this.ContentEnd); 
            }
        } 

//        #endregion Internal Properties

        //------------------------------------------------------------------- 
        //
        // Private Methods 
        // 
        //----------------------------------------------------------------------
 
//        #region Private Methods

        // QueryCursorEvent callback.
        // If this Hyperlink is editable, use the editor cursor unless 
        // the control key is down.
        private static void OnQueryCursor(Object sender, QueryCursorEventArgs e) 
        { 
            Hyperlink link = (Hyperlink)sender;
 
            if (link.IsEnabled && link.IsEditable)
            {
                if ((Keyboard.Modifiers & ModifierKeys.Control) == 0)
                { 
                    e.Cursor = link.TextContainer.TextSelection.TextEditor._cursor;
                    e.Handled = true; 
                } 
            }
        } 

//        #endregion Private Methods

//        #region Private Properties 
        //--------------------------------------------------------------------
        // 
        // Private Properties 
        //
        //--------------------------------------------------------------------- 

        /// <SecurityNote>
        /// Critical: Sets s_shouldPreventUriSpoofing.
        /// Not TreatAsSafe just to help prevent the remote possibility of calling this under elevation 
        /// from framework code, since the result of the Demand is cached.
        /// </SecurityNote> 
        static boolean ShouldPreventUriSpoofing 
        {
//            [SecurityCritical] 
            get
            {
                if (!s_shouldPreventUriSpoofing.Value.HasValue)
                { 
                    try
                    { 
                        (new System.Net.WebPermission(PermissionState.Unrestricted)).Demand(); 
                        s_shouldPreventUriSpoofing.Value = false;
                    } 
                    catch (SecurityException)
                    {
                        s_shouldPreventUriSpoofing.Value = true;
                    } 
                }
                return (boolean)s_shouldPreventUriSpoofing.Value; 
            } 
        }
        static SecurityCriticalDataForSet<boolean?> s_shouldPreventUriSpoofing; 

//        #endregion Private Properties

        //-------------------------------------------------------------------- 
        //
        // Private Fields 
        // 
        //---------------------------------------------------------------------
 
//        #region Private Fields

        private boolean _canExecute = true;
 
        private static readonly UncommonField<EventHandler> CanExecuteChangedHandler = new UncommonField<EventHandler>();
 
//        #endregion Private Fields 

        //------------------------------------------------------------------- 
        //
        // Navigation control
        //
        //--------------------------------------------------------------------- 

//        #region Navigation control 
 
        /// <summary>
        /// Records the IsPressed property attached to elements with hyperlink functionality. 
        /// </summary>
        private static final DependencyProperty IsHyperlinkPressedProperty =
                DependencyProperty.Register(
                        "IsHyperlinkPressed", 
                        typeof(boolean),
                        typeof(Hyperlink), 
                        new FrameworkPropertyMetadata(false)); 

        /*internal*/ public static void OnNavigateUriChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            IInputElement element = d as IInputElement;

            // 
            // We only set up spoofing prevention for known objects that are IInputElements.
            // However, for backward compatibility we shouldn't make this callback fail since 
            // other places such as FixedTextBuilder use NavigateUri e.g. for serialization. 
            //
            if (element != null) 
            {
                Uri navigateUri = (Uri)e.NewValue;

                // 
                // We use a different code path for Path, Canvas, Glyphs and FixedPage to maintain backward compatibility
                // with the original separate Hyperlink implementation of this (which didn't execute CanNavigateToUri). 
                // 
                if (navigateUri != null)
                { 
                    FrameworkElement fe = d as FrameworkElement;

                    if (fe != null && ((fe is Path) || (fe is Canvas) || (fe is Glyphs) || (fe is FixedPage)))
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
                        FrameworkContentElement fce = d as FrameworkContentElement;
 
                        if (fce != null && (fce is Hyperlink))
                        {
                            SetUpNavigationEventHandlers(element);
                        } 
                    }
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical - Hooks up event handlers that are responsible to set up anti-spoofing mitigations
        ///                and event handlers that are critical because of the risk for replay attacks.
        ///     TreatAsSafe - We're hooking up event handlers for trusted events from the input system. 
        /// </SecurityNote>
//        [SecurityCritical, SecurityTreatAsSafe] 
        private static void SetUpNavigationEventHandlers(IInputElement element) 
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
 
        private static void SetUpEventHandler(IInputElement element, RoutedEvent routedEvent, Delegate handler)
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
//        [SecurityCritical]
        private static void OnKeyDown(Object sender, KeyEventArgs e) 
        {
            if (!e.Handled && e.Key == Key.Enter) 
            { 
                //
                // Keyboard navigation doesn't reveal the URL on the status bar, so there's no spoofing 
                // attack possible. We clear the cache here and allow navigation to go through.
                //
                CacheNavigateUri((DependencyObject)sender, null);
 
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
        private static void OnMouseLeftButtonDown(Object sender, MouseButtonEventArgs e)
        { 
            IInputElement element = (IInputElement)sender;
            DependencyObject dp = (DependencyObject)sender; 
 
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
//        [SecurityCritical]
        private static void OnMouseLeftButtonUp(Object sender, MouseButtonEventArgs e) 
        {
            IInputElement element = (IInputElement)sender; 
            DependencyObject dp = (DependencyObject)sender; 

            if (element.IsMouseCaptured) 
            {
                element.ReleaseMouseCapture();
            }
 
            //
            // ISSUE - Leave this here because of 1111993. 
            // 
            if ((boolean)dp.GetValue(IsHyperlinkPressedProperty))
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
//        [SecurityCritical]
        private static void OnMouseEnter(Object sender, MouseEventArgs e) 
        {
            UpdateStatusBar(sender);
        }
 
        /// <summary>
        /// Set the status bar text back to empty 
        /// </summary> 
        /// <SecurityNote>
        ///     Critical - Calls ClearStatusBarAndCachedUri to clear the cached URI that prevents spoofing attacks. 
        /// </SecurityNote>
//        [SecurityCritical]
        private static void OnMouseLeave(Object sender, MouseEventArgs e)
        { 
            IInputElement ee = (IInputElement)sender;
 
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
//        [SecurityCritical]
        private static void DoUserInitiatedNavigation(Object sender) 
        {
            CodeAccessPermission perm = SecurityHelper.CreateUserInitiatedNavigationPermission(); 
            perm.Assert(); 

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
//        [SecurityCritical, SecurityTreatAsSafe]
        private static void DoNonUserInitiatedNavigation(Object sender) 
        { 
            CacheNavigateUri((DependencyObject)sender, null);
            DispatchNavigation(sender); 
        }

        /// <summary>
        /// Dispatches navigation; if the Object is a Hyperlink we go through OnClick 
        /// to preserve the original event chain, otherwise we call our DoNavigation
        /// method. 
        /// </summary> 
        private static void DispatchNavigation(Object sender)
        { 
            Hyperlink hl = sender as Hyperlink;
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
        /// Navigate to URI specified in the Object's NavigateUri property. 
        /// </summary>
        private static void DoNavigation(Object sender) 
        {
            IInputElement element = (IInputElement)sender;
            DependencyObject dObject = (DependencyObject)sender;
 
            Uri inputUri = (Uri)dObject.GetValue(GetNavigateUriProperty(element));
            String targetWindow = (String)dObject.GetValue(TargetNameProperty); 
            RaiseNavigate(element, inputUri, targetWindow); 
        }
 
        /// <summary>
        /// Navigate to URI. Used by OnClick and by automation.
        /// </summary>
        /// <param name="sourceElement">Source for the RequestNavigateEventArgs.</param> 
        /// <param name="targetUri">URI to navigate to.</param>
        /// <param name="targetWindow">Target window for the RequestNavigateEventArgs.</param> 
        /*internal*/ public static void RaiseNavigate(IInputElement element, Uri targetUri, String targetWindow) 
        {
            // 
            // Do secure (spoofing countermeasures) navigation.
            //
            if (targetUri != null)
            { 
                NavigateToUri(element, targetUri, targetWindow);
            } 
        } 

//        #endregion 

//        #region DTypeThemeStyleKey

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default 
        // value. Controls will /*override*/ this method to return approriate types.
        /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey 
        { 
            get { return _dType; }
        } 

        private static DependencyObjectType _dType;

//        #endregion DTypeThemeStyleKey 
    }