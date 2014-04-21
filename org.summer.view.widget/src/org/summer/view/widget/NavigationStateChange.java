package org.summer.view.widget;
package = PreloadedPackages.GetPackage(packageUri); 
            if (package == null) 
            {
                Uri packUri = PackUriHelper.Create(packageUri); 
                Invariant.Assert(packUri == BaseUriHelper.PackAppBaseUri || packUri == BaseUriHelper.SiteOfOriginBaseUri,
                                "Unknown packageUri passed: "+packageUri);

                Invariant.Assert(IsApplicationObjectShuttingDown); 
                throw new InvalidOperationException(SR.Get(SRID.ApplicationShuttingDown));
            } 
            return package; 
        }
 
        /// <summary>
        ///     Creates hwndsource so that we can listen to some window msgs.
        /// </summary>
        ///<SecurityNote> 
        ///     Critical: Calls critical code: HwndSource ctor
        ///     TreatAsSafe: Doesn't expose the critical resource in this method. 
        ///                  The critical data (_parkingHwnd) is marked as critical and tracked that way. 
        ///                  This hwnd is only created to enable Activated/Deactivated events. Considered safe.
        /// 
        ///                  Note: that this event is not currently enabled for browser hosted case ( work that we won't do for v1)
        ///</SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe]
        private void EnsureHwndSource() 
        {
            // We don't support Activate, Deactivate, and SessionEnding 
            // events for browser hosted scenarios thus don't create 
            // this HwndSource if BrowserCallbackServices is valid
            if (BrowserCallbackServices == null && _parkingHwnd == null) 
            {
                // _appFilterHook needs to be member variable otherwise
                // it is GC'ed and we don't get messages from HwndWrapper
                // (HwndWrapper keeps a WeakReference to the hook) 

                _appFilterHook = new HwndWrapperHook(AppFilterMessage); 
                HwndWrapperHook[] wrapperHooks = {_appFilterHook}; 

                _parkingHwnd = new HwndWrapper( 
                                0,
                                0,
                                0,
                                0, 
                                0,
                                0, 
                                0, 
                                "",
                                IntPtr.Zero, 
                                wrapperHooks);
            }
        }
 
        private IntPtr AppFilterMessage(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        { 
            IntPtr retInt = IntPtr.Zero; 
            switch ((WindowMessage)msg)
            { 
                case WindowMessage.WM_ACTIVATEAPP:
                    handled = WmActivateApp(NativeMethods.IntPtrToInt32(wParam));
                    break;
                case WindowMessage.WM_QUERYENDSESSION : 
                    handled = WmQueryEndSession(lParam, ref retInt);
                    break; 
                default: 
                    handled = false;
                    break; 
            }
            return retInt;
        }
 
        private bool WmActivateApp(Int32 wParam)
        { 
            int temp = wParam; 
            bool isActivated = (temp == 0? false : true);
 
            // Event handler exception continuality: if exception occurs in Activate/Deactivate event handlers, our state would not
            // be corrupted because no internal state are affected by Activate/Deactivate. Please check Event handler exception continuality
            // if a state depending on those events is added.
            if (isActivated == true) 
            {
                OnActivated(EventArgs.Empty); 
            } 
            else
            { 
                OnDeactivated(EventArgs.Empty);
            }
            return false;
        } 

        /// <SecurityNote> 
        /// Critical : refInt argument can be used to prevent the user from logging off 
        /// Safe     : Demands Unmanaged code permission in critical path
        /// </SecurityNote> 
        [SecuritySafeCritical]
        private bool WmQueryEndSession(IntPtr lParam, ref IntPtr refInt)
        {
            int reason = NativeMethods.IntPtrToInt32(lParam); 
            bool retVal = false;
 
            // Event handler exception continuality: if exception occurs in SessionEnding event handlers, our state would not 
            // be corrupted because no internal state are affected by SessionEnding. Please check Event handler exception continuality
            // if a state depending on this event is added. 
            SessionEndingCancelEventArgs secEventArgs = new SessionEndingCancelEventArgs( (reason & NativeMethods.ENDSESSION_LOGOFF) != 0? ReasonSessionEnding.Logoff : ReasonSessionEnding.Shutdown );
            OnSessionEnding( secEventArgs );

            // shut down the app if not cancelled 
            if ( secEventArgs.Cancel == false )
            { 
                Shutdown(); 
                // return true to the wnd proc to signal that we can terminate properly
                refInt = new IntPtr(1); 
                retVal = false;
            }
            else
            { 
                // <SecurityNote>
                // This'll stop a user from Logging off and hence is a high trust operation. 
                // Demand high level of trust. 
                // </SecurityNote>
                SecurityHelper.DemandUnmanagedCode(); 
                refInt = IntPtr.Zero;

                // we have handled the event DefWndProc will not be called for this msg
                retVal = true; 
            }
 
            return retVal; 
        }
 
        private void InvalidateResourceReferenceOnWindowCollection(WindowCollection wc, ResourcesChangeInfo info)
        {
            bool hasImplicitStyles  = info.IsResourceAddOperation && HasImplicitStylesInResources;
 
            for (int i = 0; i < wc.Count; i++)
            { 
                // calling thread is the same as the wc[i] thread so synchronously invalidate 
                // resouces, else, post a dispatcher workitem to invalidate resources.
                if (wc[i].CheckAccess() == true) 
                {
                    // Set the ShouldLookupImplicitStyles flag on the App's windows
                    // to true if App.Resources has implicit styles.
 
                    if (hasImplicitStyles)
                        wc[i].ShouldLookupImplicitStyles = true; 
 
                    TreeWalkHelper.InvalidateOnResourcesChange(wc[i], null, info);
                } 
                else
                {
                    wc[i].Dispatcher.BeginInvoke(
                        DispatcherPriority.Send, 
                        (DispatcherOperationCallback) delegate(object obj)
                        { 
                            object[] args = obj as object[]; 

                            // Set the ShouldLookupImplicitStyles flag on the App's windows 
                            // to true if App.Resources has implicit styles.

                            if (hasImplicitStyles)
                                ((FrameworkElement)args[0]).ShouldLookupImplicitStyles = true; 

                            TreeWalkHelper.InvalidateOnResourcesChange((FrameworkElement)args[0], null, (ResourcesChangeInfo)args[1]); 
                            return null; 
                        },
                        new object[] {wc[i], info} 
                        );
                }
            }
        } 

        private void SetExitCode(int exitCode) 
        { 
            if (_exitCode != exitCode)
            { 
                _exitCode = exitCode;
                System.Environment.ExitCode = exitCode;
            }
        } 

        ///<SecurityNote> 
        ///  Critical: Calls critical code: ShutdownImpl 
        ///</SecurityNote>
        [SecurityCritical] 
        private object ShutdownCallback(object arg)
        {
            ShutdownImpl();
            return null; 
        }
        /// <summary> 
        /// This method gets called on dispatch of the Shutdown DispatcherOperationCallback 
        /// </summary>
        ///<SecurityNote> 
        ///  Critical: Calls critical code: DoShutdown, Dispatcher.CritcalInvokeShutdown()
        ///</SecurityNote>
        [SecurityCritical]
        private void ShutdownImpl() 
        {
            // Event handler exception continuality: if exception occurs in Exit event handler, 
            // our cleanup action is to finish Shutdown since Exit cannot be cancelled. We don't 
            // want user to use throw exception and catch it to cancel Shutdown.
            try 
            {
                DoShutdown();
            }
            finally 
            {
                // Quit the dispatcher if we ran our own. 
                if (_ownDispatcherStarted == true) 
                {
                    Dispatcher.CriticalInvokeShutdown(); 
                }

                ServiceProvider = null;
            } 
        }
 
        private static bool IsValidShutdownMode(ShutdownMode value) 
        {
            return value == ShutdownMode.OnExplicitShutdown 
                || value == ShutdownMode.OnLastWindowClose
                || value == ShutdownMode.OnMainWindowClose;
        }
 
        private void OnPreBPReady(object sender, BPReadyEventArgs e)
        { 
            NavService.PreBPReady -= new BPReadyEventHandler(OnPreBPReady); 
            NavService.AllowWindowNavigation = false;
 
            ConfigAppWindowAndRootElement(e.Content, e.Uri);

            NavService = null;
            e.Cancel = true; 
        }
 
        /// <SecurityNote> 
        ///     Critical:This code calls into GetAppWindow to get RBW
        ///     TreatAsSafe: The window is not exposed. 
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe]
        private void ConfigAppWindowAndRootElement(object root, Uri uri)
        { 
            Window w = root as Window;
            if (w == null) 
            { 
                //Creates and returns a NavigationWindow for standalone cases
                //For browser hosted cases, returns the RootBrowserWindow precreated by docobjhost 
                NavigationWindow appWin = GetAppWindow();

                //Since we cancel PreBPReady event here, the other navigation events won't fire twice.
                appWin.Navigate(root, new NavigateInfo(uri)); 

                // To avoid flash and re-layout, call Window.Show() asynchronously, at Normal priority, which 
                // will happen right after navigation to the content completes. 
                Dispatcher.BeginInvoke(DispatcherPriority.Normal,
                    new SendOrPostCallback((window) => 
                    {
                        if (!((Window)window).IsDisposed)
                        {
                            ((Window)window).Show(); 
                        }
                    }), appWin); 
            } 
            else
            { 
                // if Visibility has not been set, we set it to true
                // Also check whether the window is already closed when we get here - applications could close the window
                // in its constructor. See Window SE bug # 253703 (or DevDiv Dev10 bug #574222) for more details.
                if (!w.IsVisibilitySet && !w.IsDisposed) 
                {
                    w.Visibility = Visibility.Visible; 
                } 
            }
        } 

        /// <SecurityNote>
        /// Critical: Calls IBrowserCallbackServices.ChangeDownloadState which is critical
        /// TreatAsSafe: Changing the download state is safe 
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
        private void ChangeBrowserDownloadState(bool newState) 
        {
            IBrowserCallbackServices ibcs = (IBrowserCallbackServices)this.GetService(typeof(IBrowserCallbackServices)); 
            if (ibcs != null)
            {
                // start or stop waving the flag
                ibcs.ChangeDownloadState(newState); 
            }
        } 
 
        /// <summary>
        /// Plays a system sound using the PlaySound api.  This is a managed equivalent of the 
        /// internet explorer method IEPlaySoundEx() from ieplaysound.cpp.
        /// </summary>
        /// <param name="soundName">The name of the sound to play</param>
        /// <returns>true if a sound was successfully played</returns> 
        /// <SecurityNote>
        /// Critical - Calls critical dllimport methdod PlaySound() and critical method GetSystemSound() 
        /// TreatAsSafe - The input string must already exist as a system sound in the registry. 
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
        private void PlaySound(string soundName)
        {
            string soundFile = GetSystemSound(soundName);
 
            if (!string.IsNullOrEmpty(soundFile))
            { 
                UnsafeNativeMethods.PlaySound(soundFile, IntPtr.Zero, PLAYSOUND_FLAGS); 
            }
        } 

        /// <SecurityNote>
        /// Critical -  Asserts to access the registry.  May return path information which
        ///             could disclose windows directory (ie. c:\windows\media\sound.wav) 
        /// </SecurityNote>
        [SecurityCritical] 
        private string GetSystemSound(string soundName) 
        {
            string soundFile = null; 
            string regPath = string.Format(CultureInfo.InvariantCulture, SYSTEM_SOUNDS_REGISTRY_LOCATION, soundName);
            PermissionSet permissions = new PermissionSet(null);
            permissions.AddPermission(new RegistryPermission(RegistryPermissionAccess.Read, SYSTEM_SOUNDS_REGISTRY_BASE));
            permissions.AddPermission(new EnvironmentPermission(PermissionState.Unrestricted)); 
            permissions.Assert();
            try 
            { 
                using (RegistryKey soundKey = Registry.CurrentUser.OpenSubKey(regPath))
                { 
                    if (soundKey != null)
                    {
                        soundFile = (string)(soundKey.GetValue(""));
                    } 
                }
            } 
            // When the value of the register key is empty, the IndexOutofRangeException is thrown. 
            // Please see Dev10 bug 586158 for more details.
            catch (System.IndexOutOfRangeException) 
            {
            }
            finally
            { 
               CodeAccessPermission.RevertAssert();
            } 
 
            return soundFile;
        } 

        private EventHandlerList Events
        {
            get 
            {
                if (_events == null) 
                { 
                    _events = new EventHandlerList();
                } 
                return _events;
            }
        }
 

        // 
        // Check if the current Uri is for the root element in a baml stream which is processed by an 
        // outer LoadBaml.  such as it is through Navigate(uri) or LoadComoponent(uri).
        // 
        private static bool IsComponentBeingLoadedFromOuterLoadBaml(Uri curComponentUri)
        {
            bool isRootElement = false;
 
            Invariant.Assert(curComponentUri != null, "curComponentUri should not be null");
 
            if (s_NestedBamlLoadInfo != null && s_NestedBamlLoadInfo.Count > 0) 
            {
                // 
                // Get the top LoadBamlSynInfo from the stack.
                //
                NestedBamlLoadInfo loadBamlSyncInfo = s_NestedBamlLoadInfo.Peek() as NestedBamlLoadInfo;
 
                if (loadBamlSyncInfo != null && loadBamlSyncInfo.BamlUri != null &&
                    loadBamlSyncInfo.BamlStream != null && 
                    BindUriHelper.DoSchemeAndHostMatch(loadBamlSyncInfo.BamlUri, curComponentUri)) 
                {
                    string fileInBamlConvert = loadBamlSyncInfo.BamlUri.LocalPath; 
                    string fileCurrent = curComponentUri.LocalPath;

                    Invariant.Assert(fileInBamlConvert != null, "fileInBamlConvert should not be null");
                    Invariant.Assert(fileCurrent != null, "fileCurrent should not be null"); 

                    if (String.Compare(fileInBamlConvert, fileCurrent, StringComparison.OrdinalIgnoreCase) == 0) 
                    { 
                        //
                        // This is the root element of the xaml page which is being loaded to creat a tree 
                        // through LoadBaml call by BamlConverter.
                        //

                        isRootElement = true; 
                    }
                    else 
                    { 
                        // We consider Pack://application,,,/page1.xaml refers to the same component as
                        // Pack://application,,,/myapp;Component/page1.xaml. 
                        string[] bamlConvertUriSegments = fileInBamlConvert.Split(new Char[] { '/', '\\' });
                        string[] curUriSegments = fileCurrent.Split(new Char[] { '/', '\\' });

                        int l = bamlConvertUriSegments.Length; 
                        int m = curUriSegments.Length;
 
                        // The length of the segments should be at least 1, because the first one is empty. 
                        Invariant.Assert((l >= 2) && (m >= 2));
 
                        int diff = l - m;
                        // The segment length can only be different in one for myapp;Component
                        if (Math.Abs(diff) == 1)
                        { 
                            // Check whether the file name is the same.
                            if (String.Compare(bamlConvertUriSegments[l - 1], curUriSegments[m - 1], StringComparison.OrdinalIgnoreCase) == 0) 
                            { 
                                string component = (diff == 1) ? bamlConvertUriSegments[1] : curUriSegments[1];
 
                                isRootElement = BaseUriHelper.IsComponentEntryAssembly(component);
                            }
                        }
                    } 
                }
            } 
 
            return isRootElement;
        } 

        /// <SecurityNote>
        ///     Critical: This code starts dispatcher run
        /// </SecurityNote> 
        [SecurityCritical]
        [DebuggerNonUserCode] // to treat this method as non-user code even when symbols are available 
        private object StartDispatcherInBrowser(object unused) 
        {
            if (BrowserInteropHelper.IsBrowserHosted) 
            {
                BrowserInteropHelper.InitializeHostFilterInput();

                // This seemingly meaningless try-catch-throw is a workaround for a CLR deficiency/bug in 
                // exception handling. (WOSB 1936603) When an unhandled exception on the main thread crosses
                // the AppDomain boundary, the p/invoke layer catches it and throws another exception. Thus, 
                // the original exception is lost before the debugger is notified. The result is no managed 
                // callstack whatsoever. The workaround is based on a debugger/CLR feature that notifies of
                // exceptions unhandled in 'user code'. This works only when the Just My Code feature is enabled 
                // in VS.
                try
                {
                    RunDispatcher(null); 
                }
                catch 
                { 
                    throw;
                } 
            }
            return null;
        }
 
        /// <SecurityNote>
        ///     Critical: This code starts dispatcher run 
        /// </SecurityNote> 
        [SecurityCritical]
        private object RunDispatcher(object ignore) 
        {
            if (_ownDispatcherStarted)
            {
                throw new InvalidOperationException(SR.Get(SRID.ApplicationAlreadyRunning)); 
            }
            _ownDispatcherStarted = true; 
            Dispatcher.Run(); 
            return null;
        } 

        #endregion Private Methods

        //------------------------------------------------------ 
        //
        //  Private Fields 
        // 
        //-----------------------------------------------------
 
        #region Private Fields
        static private object                           _globalLock;
        static private bool                             _isShuttingDown;
        static private bool                             _appCreatedInThisAppDomain; 
        static private Application                      _appInstance;
        static private Assembly                         _resourceAssembly; 
 
        // Keep LoadBamlSyncInfo stack so that the Outer LoadBaml and Inner LoadBaml( ) for the same
        // Uri share the related information. 
        [ThreadStatic]
        private static Stack<NestedBamlLoadInfo> s_NestedBamlLoadInfo = null;

        private Uri                         _startupUri; 
        private Uri                         _applicationMarkupBaseUri;
        private HybridDictionary            _htProps; 
        private WindowCollection            _appWindowList; 
        private WindowCollection            _nonAppWindowList;
        private Window                      _mainWindow; 
        private ResourceDictionary          _resources;

        private bool                        _ownDispatcherStarted;
        private NavigationService           _navService; 

        private SecurityCriticalDataForSet<MimeType> _appMimeType; 
        private IServiceProvider            _serviceProvider; 
        private IBrowserCallbackServices    _browserCallbackServices;
        private SponsorHelper               _browserCallbackSponsor; 

        private bool                        _appIsShutdown;
        private int                         _exitCode;
 
        private ShutdownMode                _shutdownMode = ShutdownMode.OnLastWindowClose;
 
        /// <SecurityNote> 
        ///     Critical: Don't want _parkingHwnd to be exposed and used by anyone besides
        ///               this class. 
        /// </SecurityNote>
        [SecurityCritical]
        private HwndWrapper                 _parkingHwnd;
 
        /// <SecurityNote>
        ///     Critical: _appFilterHook is the hook to listen to window messages. 
        ///             We want this to be critical so that no one can get it and listen 
        ///             to window messages.
        /// </SecurityNote> 
        [SecurityCritical]
        private HwndWrapperHook             _appFilterHook;

        private EventHandlerList            _events; 
        private bool                        _hasImplicitStylesInResources;
 
        private static readonly object EVENT_STARTUP = new object(); 
        private static readonly object EVENT_EXIT = new object();
        private static readonly object EVENT_SESSIONENDING = new object(); 

        private const SafeNativeMethods.PlaySoundFlags PLAYSOUND_FLAGS = SafeNativeMethods.PlaySoundFlags.SND_FILENAME |
                                                                            SafeNativeMethods.PlaySoundFlags.SND_NODEFAULT |
                                                                            SafeNativeMethods.PlaySoundFlags.SND_ASYNC | 
                                                                            SafeNativeMethods.PlaySoundFlags.SND_NOSTOP;
        private const string SYSTEM_SOUNDS_REGISTRY_LOCATION            = @"AppEvents\Schemes\Apps\Explorer\{0}\.current\"; 
        private const string SYSTEM_SOUNDS_REGISTRY_BASE                = @"HKEY_CURRENT_USER\AppEvents\Schemes\Apps\Explorer\"; 
        private const string SOUND_NAVIGATING                           = "Navigating";
        private const string SOUND_COMPLETE_NAVIGATION                  = "ActivatingDocument"; 

        #endregion Private Fields

        //----------------------------------------------------- 
        //
        //  Private Types 
        // 
        //-----------------------------------------------------
        #region NavigationStateChange 
        internal enum NavigationStateChange : byte
        {
            Navigating,
            Completed, 
            Stopped,
        } 
        #endregion NavigationStateChange 
    }
 
    #endregion Application Class


    // 
    // In Navigation(uri) and LoadComponent(uri), below scenarios might occur:
    // 
    //   After a baml stream  is passed into LoadBaml( ) call, when instance 
    //   of the root element is created, it would call the generated InitializeComponent( )
    //   which then calls LoadBaml( ) with the baml stream created from the same uri again. 
    //
    // The LoadBaml( ) triggered by Navigation or LoadComponent(uri) is named as Outer LoadBaml.
    // The LoadBaml( ) called by IC in ctor of root Element is named as Inner LoadBaml.
    // 
    // To prevent the baml stream created from the same Uri from being loaded twice, we need
    // a way to detect whether the Outer LoadBaml and Inner LoadBaml share the same share the 
    // same stream and the same parser context. 
    //
    internal class NestedBamlLoadInfo 
    {
        //
        // ctor of NestedBamlLoadInfo
        // 
        internal NestedBamlLoadInfo(Uri uri, Stream stream, bool bSkipJournalProperty)
        { 
            _BamlUri = uri; 
            _BamlStream = stream;
            _SkipJournaledProperties = bSkipJournalProperty; 
        }

        #region internal properties
 
        //
        // OuterBamlUri property 
        // 
        internal Uri BamlUri
        { 
            get { return _BamlUri;  }
            set { _BamlUri = value; }   // Code could reset the OuterBamlUri for performance optimization.
        }
 
        //
        // OuterBamlStream property 
        // 
        internal Stream BamlStream
        { 
            get { return _BamlStream; }
        }

        // 
        // OuterSkipJournaledProperties
        // 
        internal bool SkipJournaledProperties 
        {
            get { return _SkipJournaledProperties; } 
        }

        #endregion
 

        #region private field 
 
        // Keep Uri which is being handled by Outer LoadBaml in this thread.
        private Uri _BamlUri = null; 

        // Keep the stream which is being handled by Outer LoadBaml for above Uri in this thread.
        private Stream _BamlStream = null;
 
        // Whether or not SkipJournalProperty when a baml stream is handled in Outer LoadBaml.
        private bool _SkipJournaledProperties = false; 
 
        #endregion
    } 

    #region enum ShutdownMode

    /// <summary> 
    ///     Enum for ShutdownMode
    /// </summary> 
    public enum ShutdownMode : byte 
    {
        /// <summary> 
        ///
        /// </summary>
        OnLastWindowClose = 0,
 
        /// <summary>
        /// 
        /// </summary> 
        OnMainWindowClose = 1,
 
        /// <summary>
        ///
        /// </summary>
        OnExplicitShutdown 

        // NOTE: if you add or remove any values in this enum, be sure to update Application.IsValidShutdownMode() 
    } 

    #endregion enum ShutdownMode 

    #region enum ReasonSessionEnding

    /// <summary> 
    ///     Enum for ReasonSessionEnding
    /// </summary> 
    public enum ReasonSessionEnding : byte 
    {
        /// <summary> 
        ///
        /// </summary>
        Logoff = 0,
        /// <summary> 
        ///
        /// </summary> 
        Shutdown 
    }
    #endregion enum ReasonSessionEnding 