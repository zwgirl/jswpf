package org.summer.view.window.automation.peer;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.ContentElement;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Point;
import org.summer.view.widget.Rect;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.UIElement3D;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.threading.Dispatcher;
import org.summer.view.widget.threading.DispatcherObject;

public abstract class AutomationPeer extends DispatcherObject
    { 
        ///
        static //AutomationPeer()
        {
            // Disable message processing to avoid re-entrancy (WM_GETOBJECT) 
            using (Dispatcher.CurrentDispatcher.DisableProcessing())
            { 
                Initialize(); 
            }
        } 

        //
        // VIRTUAL CALLBACKS
        // 

        /// 
        abstract protected List<AutomationPeer> GetChildrenCore(); 

        /// 
        abstract public Object GetPattern(PatternInterface patternInterface);


        // 
        // PUBLIC METHODS
        // 
 
        ///
        public void InvalidatePeer() 
        {
            if(_invalidated) return;

            Dispatcher.BeginInvoke(DispatcherPriority.Background, _updatePeer, this); 
            _invalidated = true;
        } 
 
        ///<summary>
        /// Used to check if Automation is indeed listening for the event. 
        /// Typical usage is to check this before even creating the peer that will fire the event.
        /// Basically, this is a performance measure since if the Automation does not listen for the event,
        /// it does not make sense to create a peer to fire one.
        /// NOTE: the method is static and only answers if there is some listener in Automation, 
        /// not specifically for some element. The Automation can hook up "broadcast listeners" so the
        /// per-element info is basically unavailable. 
        ///</summary> 
        static public boolean ListenerExists(AutomationEvents eventId)
        { 
            return (EventMap.HasRegisteredEvent(eventId));
        }

        ///<summary> 
        /// Used by peer implementation to raise an event for Automation
        ///</summary> 
        // Never inline, as we don't want to unnecessarily link the automation DLL. 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
        public void RaiseAutomationEvent(AutomationEvents eventId) 
        {
            AutomationEvent eventObject = EventMap.GetRegisteredEvent(eventId);

            if (eventObject == null) 
            {
                // nobody is listening to this event 
                return; 
            }
 
            IRawElementProviderSimple provider = ProviderFromPeer(this);
            if (provider != null)
            {
                AutomationInteropProvider.RaiseAutomationEvent( 
                    eventObject,
                    provider, 
                    new AutomationEventArgs(eventObject)); 
            }
        } 

        /// <summary>
        /// This method is called by implementation of the peer to raise the automation propertychange notifications
        /// Typically, the peers that implement automation patterns liek IScrollProvider need to raise events specified by 
        /// the particular pattern in case specific properties are changing.
        /// </summary> 
        // Never inline, as we don't want to unnecessarily link the automation DLL via the ScrollPattern reference. 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
        public void RaisePropertyChangedEvent(AutomationProperty property, Object oldValue, Object newValue) 
        {
            // Only send the event if there are listeners for this property change
            if (AutomationInteropProvider.ClientsAreListening)
            { 
                RaisePropertyChangedInternal(ProviderFromPeer(this), property,oldValue,newValue);
            } 
        } 

        /// <summary> 
        /// This method is called by implementation of the peer to raise the automation "async content loaded" notifications
        /// </summary>
        // Never inline, as we don't want to unnecessarily link the automation DLL.
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public void RaiseAsyncContentLoadedEvent(AsyncContentLoadedEventArgs args)
        { 
            if(args == null) 
                throw new ArgumentNullException("args");
 
            if (EventMap.HasRegisteredEvent(AutomationEvents.AsyncContentLoaded))
            {
                IRawElementProviderSimple provider = ProviderFromPeer(this);
                if(provider != null) 
                {
                    AutomationInteropProvider.RaiseAutomationEvent( 
                        AutomationElementIdentifiers.AsyncContentLoadedEvent, 
                        provider,
                        args); 
                }
            }
        }
 
        /*internal*/ public static void RaiseFocusChangedEventHelper(IInputElement newFocus)
        { 
            // Callers have only checked if automation clients are present so filter for any interest in this particular event. 
            if (EventMap.HasRegisteredEvent(AutomationEvents.AutomationFocusChanged))
            { 
                AutomationPeer peer = AutomationPeerFromInputElement(newFocus);

                if (peer != null)
                { 
                    peer.RaiseAutomationEvent(AutomationEvents.AutomationFocusChanged);
                } 
                else //non-automated element got focus, same as focus lost 
                {
                    //No focused peer. Just don't report anything. 
                }
            }
        }
 
        //  helper method. Makes attempt to find an automation peer corresponding to the given IInputElement...
        /*internal*/ public static AutomationPeer AutomationPeerFromInputElement(IInputElement focusedElement) 
        { 
            AutomationPeer peer = null;
 
            UIElement uie = focusedElement as UIElement;
            if (uie != null)
            {
                peer = UIElementAutomationPeer.CreatePeerForElement(uie); 
            }
            else 
            { 
                ContentElement ce = focusedElement as ContentElement;
                if (ce != null) 
                {
                    peer = ContentElementAutomationPeer.CreatePeerForElement(ce);
                }
                else 
                {
                    UIElement3D uie3D = focusedElement as UIElement3D; 
                    if (uie3D != null) 
                    {
                        peer = UIElement3DAutomationPeer.CreatePeerForElement(uie3D); 
                    }
                }
            }
 
            if (peer != null)
            { 
                //  ValidateConnected ensures that EventsSource is initialized 
                peer.ValidateConnected(peer);
 
                //  always use event source when available
                if (peer.EventsSource != null)
                {
                    peer = peer.EventsSource; 
                }
            } 
 
            return peer;
        } 

        // We can only return peers to UIA that are properly connected to the UIA tree already
        // This means they should have _hwnd and _parent already set and _parent should point to the
        // peer which would have this peer returned from its GetChildrenCore. This method checks if the 
        // peer is already connected, and if not then it walks the tree of peers from the top down, calling
        // GetChildren and trying to find itself in someone's children. Once this succeeds, the peer is connected 
        // (because GetChildren will connect it). In this case this method will return "this". 
        // However if the search does not find the peer, that means the peer
        // would never be exposed by specific context even though it is createable on the element (the decision to expose 
        // children is on parent peers and parent peer may decide not to expose subpart of itself). In this case,
        // this method returns null.
        // ConnectedPeer parameter is some peer which is known to be connected (typically root, but if not, this method will
        // walk up from the given connectedPeer up to find a root) 
        ///<SecurityNote>
        ///     Critical - Accessing _hwnd 
        ///     TreatAsSafe - _hwnd is used internally and not exposed. 
        ///</SecurityNote>
//        [SecurityCritical, SecurityTreatAsSafe] 
        /*internal*/ public AutomationPeer ValidateConnected(AutomationPeer connectedPeer)
        {
            if(connectedPeer == null)
                throw new ArgumentNullException("connectedPeer"); 

            if(_parent != null && _hwnd != IntPtr.Zero) return this; 
 
            if((connectedPeer._hwnd) != IntPtr.Zero)
            { 
                while(connectedPeer._parent != null) connectedPeer = connectedPeer._parent;

                //now connectedPeer is the root
                if ((connectedPeer == this) || isDescendantOf(connectedPeer)) 
                    return this;
            } 
 
            //last effort - find across all roots
            //only start fault in the tree from the root if we are not in the recursive [....] update 
            //Otherwise it will go through the peers that are currently on the stack
            ContextLayoutManager lm = ContextLayoutManager.From(this.Dispatcher);
            if(lm != null && lm.AutomationSyncUpdateCounter == 0)
            { 
                AutomationPeer[] roots = lm.GetAutomationRoots();
                for(int i = 0; i < roots.Length; i++) 
                { 
                    AutomationPeer root = roots[i];
 
                    if (root != null)
                    {
                        if((root == this) || isDescendantOf(root))
                        return this; 
                    }
                } 
            } 

            return null; 
        }

        /// <summary>
        /// This is responsible for adding parent info like the parent window handle 
        /// and the parent itself to it's child. This is by definition is a securitycritical operation
        /// for two reasons 
        /// 1. it's doing an action which is securitycritical 
        /// 2. it can not be treated as safe as it doesn't know whether
        ///    the peer is actually this objects's parent or not and must be used by methods which has 
        ///    this information and hence are[SecurityTreatAsSafe].
        /// <SecurityNote>
        /// Critical - access _hwnd
        /// </SecurityNote> 
        /// </summary>
        /// <param name="peer"></param> 
//        [SecurityCritical] 
        /*internal*/ public boolean TrySetParentInfo(AutomationPeer peer)
        { 
            Invariant.Assert((peer != null));

            if(peer._hwnd == IntPtr.Zero)
            { 
                // parent is not yet part of Automation Tree itself
                return false; 
            } 

            _hwnd = peer._hwnd; 
            _parent = peer;

            return true;
        } 

        // To determine if the peer corresponds to DataItem 
        /*virtual*/ /*internal*/ public boolean IsDataItemAutomationPeer() 
        {
            return false; 
        }

        // This is mainly for enabling ITemsControl to keep the Cache of the Item's Proxy Weak Ref to
        // re-use the item peers being passed to clinet and still exist in memory 
        /*virtual*/ /*internal*/ public void AddToParentProxyWeakRefCache()
        { 
            //do nothing 
        }
        private boolean isDescendantOf(AutomationPeer parent) 
        {
            if(parent == null)
                throw new ArgumentNullException("parent");
 
            List<AutomationPeer> children  = parent.GetChildren();
 
            if(children == null) 
                return false;
 
            int cnt = children.Count;
            for(int i = 0; i < cnt; ++i)
            {
                AutomationPeer child = children[i]; 

                //depth first 
                if(child == this || this.isDescendantOf(child)) 
                    return true;
            } 

            return false;
        }
 
        ///<summary>
        /// Outside of hosting scenarios AutomationPeers shoudl not override this method. 
        /// It is needed for peers that implement their own host HWNDs 
        /// for these HWNDs to appear in a proper place in the UIA tree.
        /// Without this interface being omplemented, the HWND is parented by UIA as a child 
        /// of the HwndSource that hosts whole Avalon app. Instead, it is usually desirable
        /// to override this defautl behavior and tell UIA to parent hosted HWND as a child
        /// somewhere in Avlaon tree where it is actually hosted.
        /// <para/> 
        /// Automation infrastructure provides necessary hookup, the AutomationPeer of the element that
        /// immediately hosts the HWND should implement this interface to be properly wired in. 
        /// In addition to that, it should return this peer as IRawElementProviderSimple as a response to 
        /// WM_GETOBJECT coming to the hosted HWND.
        /// <para/> 
        /// To obtain the IRawElementProviderSimple interface, the peer should use
        /// System.Windows.Automation.AutomationInteropProvider.HostProviderFromHandle(hwnd).
        ///</summary>
        /// <SecurityNote> 
        ///     Critical    - Calls critical AutomationPeer.Hwnd.
        ///     TreatAsSafe - Critical data is used internally and not explosed 
        /// </SecurityNote> 
//        [SecurityCritical, SecurityTreatAsSafe]
        /*virtual*/ protected HostedWindowWrapper GetHostRawElementProviderCore() 
        {
            HostedWindowWrapper host = null;

            //in normal Avalon subtrees, only root peers should return wrapped HWND 
            if(GetParent() == null)
            { 
                // this way of creating HostedWindowWrapper does not require FullTrust 
                host = HostedWindowWrapper.CreateInternal(Hwnd);
            } 

            return host;
        }
 
        /*internal*/ public HostedWindowWrapper GetHostRawElementProvider()
        { 
            return GetHostRawElementProviderCore(); 
        }
 
        ///<summary>
        /// Returns 'true' only if this is a peer that hosts HWND in Avalon (WindowsFormsHost or Popup for example).
        /// Such peers also have to override GetHostRawElementProviderCore method.
        ///</summary> 
        /*virtual*/ protected /*internal*/ public boolean IsHwndHost { get { return false; }}
 
        // 
        // P R O P E R T I E S
        // 

        ///
        abstract protected Rect GetBoundingRectangleCore();
 
        ///
        abstract protected boolean IsOffscreenCore(); 
 
        ///
        abstract protected AutomationOrientation GetOrientationCore(); 

        ///
        abstract protected String GetItemTypeCore();
 
        ///
        abstract protected String GetClassNameCore(); 
 
        ///
        abstract protected String GetItemStatusCore(); 

        ///
        abstract protected boolean IsRequiredForFormCore();
 
        ///
        abstract protected boolean IsKeyboardFocusableCore(); 
 
        ///
        abstract protected boolean HasKeyboardFocusCore(); 

        ///
        abstract protected boolean IsEnabledCore();
 
        ///
        abstract protected boolean IsPasswordCore(); 
 
        ///
        abstract protected String GetAutomationIdCore(); 

        ///
        abstract protected String GetNameCore();
 
        ///
        abstract protected AutomationControlType GetAutomationControlTypeCore(); 
 
        ///
        /*virtual*/ protected String GetLocalizedControlTypeCore() 
        {
            ControlType controlType = GetControlType();
            return controlType.LocalizedControlType;
        } 

        /// 
        abstract protected boolean IsContentElementCore(); 

        /// 
        abstract protected boolean IsControlElementCore();

        ///
        abstract protected AutomationPeer GetLabeledByCore(); 

        /// 
        abstract protected String GetHelpTextCore(); 

        /// 
        abstract protected String GetAcceleratorKeyCore();

        ///
        abstract protected String GetAccessKeyCore(); 

        /// 
        abstract protected Point GetClickablePointCore(); 

        /// 
        abstract protected void SetFocusCore();

        //
        // INTERNAL STUFF - NOT OVERRIDABLE 
        //
        /*virtual*/ /*internal*/ public Rect GetVisibleBoundingRectCore() 
        { 
            // Too late to add abstract methods, since this class has already shipped(using default definition)!
            return GetBoundingRectangle(); 
        }

        ///
        public Rect GetBoundingRectangle() 
        {
            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            {
                _publicCallInProgress = true;
                _boundingRectangle = GetBoundingRectangleCore();
            } 
            finally
            { 
                _publicCallInProgress = false; 
            }
            return _boundingRectangle; 
        }

        ///
        public boolean IsOffscreen() 
        {
            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            {
                _publicCallInProgress = true;
                _isOffscreen = IsOffscreenCore();
            } 
            finally
            { 
                _publicCallInProgress = false; 
            }
            return _isOffscreen; 
        }

        ///
        public AutomationOrientation GetOrientation() 
        {
            AutomationOrientation result; 
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try
            {
                _publicCallInProgress = true; 
                result = GetOrientationCore();
            } 
            finally 
            {
                _publicCallInProgress = false; 
            }
            return result;
        }
 
        ///
        public String GetItemType() 
        { 
            String result;
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));

            try 
            {
                _publicCallInProgress = true; 
                result = GetItemTypeCore(); 
            }
            finally 
            {
                _publicCallInProgress = false;
            }
            return result; 
        }
 
        /// 
        public String GetClassName()
        { 
            String result;

            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            { 
                _publicCallInProgress = true;
                result = GetClassNameCore(); 
            }
            finally
            {
                _publicCallInProgress = false; 
            }
            return result; 
        } 

        /// 
        public String GetItemStatus()
        {
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            { 
                _publicCallInProgress = true;
                _itemStatus = GetItemStatusCore(); 
            }
            finally
            {
                _publicCallInProgress = false; 
            }
            return _itemStatus; 
        } 

        /// 
        public boolean IsRequiredForForm()
        {
            boolean result;
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 
 
            try
            { 
                _publicCallInProgress = true;
                result = IsRequiredForFormCore();
            }
            finally 
            {
                _publicCallInProgress = false; 
            } 
            return result;
        } 

        ///
        public boolean IsKeyboardFocusable()
        { 
            boolean result;
 
            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));
 
            try
            {
                _publicCallInProgress = true;
                result = IsKeyboardFocusableCore(); 
            }
            finally 
            { 
                _publicCallInProgress = false;
            } 
            return result;
        }

        /// 
        public boolean HasKeyboardFocus()
        { 
            boolean result; 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try
            {
                _publicCallInProgress = true; 
                result = HasKeyboardFocusCore();
            } 
            finally 
            {
                _publicCallInProgress = false; 
            }
            return result;
        }
 
        ///
        public boolean IsEnabled() 
        { 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try
            {
                _publicCallInProgress = true; 
                _isEnabled = IsEnabledCore();
            } 
            finally 
            {
                _publicCallInProgress = false; 
            }
            return _isEnabled;
        }
 
        ///
        public boolean IsPassword() 
        { 
            boolean result;
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));

            try 
            {
                _publicCallInProgress = true; 
                result = IsPasswordCore(); 
            }
            finally 
            {
                _publicCallInProgress = false;
            }
            return result; 
        }
 
        /// 
        public String GetAutomationId()
        { 
            String result;

            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            { 
                _publicCallInProgress = true;
                result = GetAutomationIdCore(); 
            }
            finally
            {
                _publicCallInProgress = false; 
            }
            return result; 
        } 

        /// 
        public String GetName()
        {
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            { 
                _publicCallInProgress = true;
                _name = GetNameCore(); 
            }
            finally
            {
                _publicCallInProgress = false; 
            }
            return _name; 
        } 

        /// 
        public AutomationControlType GetAutomationControlType()
        {
            AutomationControlType result;
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 
 
            try
            { 
                _publicCallInProgress = true;
                result = GetAutomationControlTypeCore();
            }
            finally 
            {
                _publicCallInProgress = false; 
            } 
            return result;
        } 

        ///
        public String GetLocalizedControlType()
        { 
            String result;
 
            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));
 
            try
            {
                _publicCallInProgress = true;
                result = GetLocalizedControlTypeCore(); 
            }
            finally 
            { 
                _publicCallInProgress = false;
            } 
            return result;
        }

        /// 
        public boolean IsContentElement()
        { 
            boolean result; 

            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));

            try
            { 
                _publicCallInProgress = true;
 
                // As per the UIA guidelines an entity has to be a control to be able to hold content. 
                // See http://msdn.microsoft.com/en-us/library/system.windows.automation.automationelement.iscontentelementproperty.aspx
 
                result = IsControlElementPrivate() && IsContentElementCore();
            }
            finally
            { 
                _publicCallInProgress = false;
            } 
            return result; 
        }
 
        ///
        public boolean IsControlElement()
        {
            boolean result; 

            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            {
                _publicCallInProgress = true;
                result = IsControlElementPrivate();
            } 
            finally
            { 
                _publicCallInProgress = false; 
            }
            return result; 
        }

        private boolean IsControlElementPrivate()
        { 
            return IsControlElementCore();
        } 
 
        ///
        public AutomationPeer GetLabeledBy() 
        {
            AutomationPeer result;

            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));
 
            try 
            {
                _publicCallInProgress = true; 
                result = GetLabeledByCore();
            }
            finally
            { 
                _publicCallInProgress = false;
            } 
            return result; 
        }
 
        ///
        public String GetHelpText()
        {
            String result; 

            if (_publicCallInProgress) 
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            {
                _publicCallInProgress = true;
                result = GetHelpTextCore();
            } 
            finally
            { 
                _publicCallInProgress = false; 
            }
            return result; 
        }

        ///
        public String GetAcceleratorKey() 
        {
            String result; 
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try
            {
                _publicCallInProgress = true; 
                result = GetAcceleratorKeyCore();
            } 
            finally 
            {
                _publicCallInProgress = false; 
            }
            return result;
        }
 
        ///
        public String GetAccessKey() 
        { 
            String result;
 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall));

            try 
            {
                _publicCallInProgress = true; 
                result = GetAccessKeyCore(); 
            }
            finally 
            {
                _publicCallInProgress = false;
            }
            return result; 
        }
 
        /// 
        public Point GetClickablePoint()
        { 
            Point result;

            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            { 
                _publicCallInProgress = true;
                result = GetClickablePointCore(); 
            }
            finally
            {
                _publicCallInProgress = false; 
            }
            return result; 
        } 

        /// 
        public void SetFocus()
        {
            if (_publicSetFocusInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try 
            { 
                _publicSetFocusInProgress = true;
                SetFocusCore(); 
            }
            finally
            {
                _publicSetFocusInProgress = false; 
            }
        } 
 
        ///
        public AutomationPeer GetParent() 
        {
            return _parent;
        }
 
        ///
        public List<AutomationPeer> GetChildren() 
        { 
            if (_publicCallInProgress)
                throw new InvalidOperationException(SR.Get(SRID.Automation_RecursivePublicCall)); 

            try
            {
                _publicCallInProgress = true; 
                EnsureChildren();
            } 
            finally 
            {
                _publicCallInProgress = false; 
            }
            return _children;
        }
 
        ///
        public void ResetChildrenCache() 
        { 
            UpdateChildren();
        } 

        ///
        /*internal*/ public int[] GetRuntimeId()
        { 
            return new int [] { 7, SafeNativeMethods.GetCurrentProcessId(), this.GetHashCode() };
        } 
 
        ///
        /*internal*/ public String GetFrameworkId() { return ("WPF"); } 

        //
        /*internal*/ public AutomationPeer GetFirstChild()
        { 
            AutomationPeer peer = null;
 
            EnsureChildren(); 

            if (_children != null && _children.Count > 0) 
            {
                peer = _children[0];
            }
 
            return peer;
        } 
 
        //
        ///<SecurityNote> 
        ///     Critical - Accessing _hwnd
        ///     TreatAsSafe - _hwnd is used internally and not exposed.
        ///</SecurityNote>
//        [SecurityCritical, SecurityTreatAsSafe] 
        private void EnsureChildren()
        { 
            //  if !_childrenValid or _ancestorsInvalid,  indicates that the automation tree under this peer is not up to date, so requires 
            //  rebuilding before navigating. This usually is the case when the peer is re-parented because of UI changes but
            // UpdateSubtree is not called on it yet. 
            if (!_childrenValid || _ancestorsInvalid)
            {
                _children = GetChildrenCore();
                if (_children != null) 
                {
                    int count = _children.Count; 
                    for (int i = 0; i < count; ++i) 
                    {
                        _children[i]._parent = this; 
                        _children[i]._index = i;
                        _children[i]._hwnd = _hwnd;
                    }
                } 
                _childrenValid = true;
            } 
        } 

        // Use to update the Children irrespective of the _childrenValid flag. 
        /*internal*/ public void ForceEnsureChildren()
        {
            _childrenValid = false;
            EnsureChildren(); 
        }
 
        // 
        /*internal*/ public AutomationPeer GetLastChild()
        { 
            AutomationPeer peer = null;

            EnsureChildren();
 
            if (_children != null && _children.Count > 0)
            { 
                peer = _children[_children.Count - 1]; 
            }
 
            return peer;
        }

        // 
//        [FriendAccessAllowed] // Built into Core, also used by Framework.
        /*internal*/ public /*virtual*/ InteropAutomationProvider GetInteropChild() 
        { 
            return null;
        } 

        //
        /*internal*/ public AutomationPeer GetNextSibling()
        { 
            AutomationPeer sibling = null;
            AutomationPeer parent = GetParent(); 
 
            if (parent != null)
            { 
                parent.EnsureChildren();

                if (    parent._children != null
                    &&  _index + 1 < parent._children.Count 
                    &&  parent._children[_index] == this    )
                { 
                    sibling = parent._children[_index + 1]; 
                }
            } 

            return sibling;
        }
 
        //
        /*internal*/ public AutomationPeer GetPreviousSibling() 
        { 
            AutomationPeer sibling = null;
            AutomationPeer parent = GetParent(); 

            if (parent != null)
            {
                parent.EnsureChildren(); 

                if (    parent._children != null 
                    &&  _index - 1 >= 0 
                    &&  _index < parent._children.Count
                    &&  parent._children[_index] == this    ) 
                {
                    sibling = parent._children[_index - 1];
                }
            } 

            return sibling; 
        } 

        // 
        /*internal*/ public ControlType GetControlType()
        {
            ControlType controlType = null;
 
            AutomationControlType type = GetAutomationControlTypeCore();
 
            switch (type) 
            {
                case AutomationControlType.Button:        controlType = ControlType.Button;       break; 
                case AutomationControlType.Calendar:      controlType = ControlType.Calendar;     break;
                case AutomationControlType.CheckBox:      controlType = ControlType.CheckBox;     break;
                case AutomationControlType.ComboBox:      controlType = ControlType.ComboBox;     break;
                case AutomationControlType.Edit:          controlType = ControlType.Edit;         break; 
                case AutomationControlType.Hyperlink:     controlType = ControlType.Hyperlink;    break;
                case AutomationControlType.Image:         controlType = ControlType.Image;        break; 
                case AutomationControlType.ListItem:      controlType = ControlType.ListItem;     break; 
                case AutomationControlType.List:          controlType = ControlType.List;         break;
                case AutomationControlType.Menu:          controlType = ControlType.Menu;         break; 
                case AutomationControlType.MenuBar:       controlType = ControlType.MenuBar;      break;
                case AutomationControlType.MenuItem:      controlType = ControlType.MenuItem;     break;
                case AutomationControlType.ProgressBar:   controlType = ControlType.ProgressBar;  break;
                case AutomationControlType.RadioButton:   controlType = ControlType.RadioButton;  break; 
                case AutomationControlType.ScrollBar:     controlType = ControlType.ScrollBar;    break;
                case AutomationControlType.Slider:        controlType = ControlType.Slider;       break; 
                case AutomationControlType.Spinner:       controlType = ControlType.Spinner;      break; 
                case AutomationControlType.StatusBar:     controlType = ControlType.StatusBar;    break;
                case AutomationControlType.Tab:           controlType = ControlType.Tab;          break; 
                case AutomationControlType.TabItem:       controlType = ControlType.TabItem;      break;
                case AutomationControlType.Text:          controlType = ControlType.Text;         break;
                case AutomationControlType.ToolBar:       controlType = ControlType.ToolBar;      break;
                case AutomationControlType.ToolTip:       controlType = ControlType.ToolTip;      break; 
                case AutomationControlType.Tree:          controlType = ControlType.Tree;         break;
                case AutomationControlType.TreeItem:      controlType = ControlType.TreeItem;     break; 
                case AutomationControlType.Custom:        controlType = ControlType.Custom;       break; 
                case AutomationControlType.Group:         controlType = ControlType.Group;        break;
                case AutomationControlType.Thumb:         controlType = ControlType.Thumb;        break; 
                case AutomationControlType.DataGrid:      controlType = ControlType.DataGrid;     break;
                case AutomationControlType.DataItem:      controlType = ControlType.DataItem;     break;
                case AutomationControlType.Document:      controlType = ControlType.Document;     break;
                case AutomationControlType.SplitButton:   controlType = ControlType.SplitButton;  break; 
                case AutomationControlType.Window:        controlType = ControlType.Window;       break;
                case AutomationControlType.Pane:          controlType = ControlType.Pane;         break; 
                case AutomationControlType.Header:        controlType = ControlType.Header;       break; 
                case AutomationControlType.HeaderItem:    controlType = ControlType.HeaderItem;   break;
                case AutomationControlType.Table:         controlType = ControlType.Table;        break; 
                case AutomationControlType.TitleBar:      controlType = ControlType.TitleBar;     break;
                case AutomationControlType.Separator:     controlType = ControlType.Separator;    break;
                default: break;
            } 

            return controlType; 
        } 

        public AutomationPeer GetPeerFromPoint(Point point) 
        {
            return GetPeerFromPointCore(point);
        }
 
        protected /*virtual*/ AutomationPeer GetPeerFromPointCore(Point point)
        { 
            AutomationPeer found = null; 

            if(!IsOffscreen()) 
            {
                List<AutomationPeer> children = GetChildren();
                if(children != null)
                { 
                    int count = children.Count;
                    for(int i = count-1; (i >= 0) && (found == null); --i) 
                    { 
                        found = children[i].GetPeerFromPoint(point);
                    } 
                }

                if(found == null)
                { 
                    Rect bounds = GetVisibleBoundingRect();
                    if (bounds.Contains(point)) 
                        found = this; 
                }
            } 

            return found;
        }
 
        /// <summary>
        /// inherited by item peers to return just visible part of bounding rectangle. 
        /// </summary> 
        /// <returns></returns>
        /*internal*/ public Rect GetVisibleBoundingRect() 
        {
            return GetVisibleBoundingRectCore();
        }
 
        ///<Summary>
        /// Creates an element provider (proxy) from a peer. Some patterns require returning objects of type 
        /// IRawElementProviderSimple - this is an Automation-specific wrapper interface that corresponds to a peer. 
        /// To wrap an AutomationPeer into the wrapper that exposes this interface, use this method.
        ///</Summary> 
        protected /*internal*/ public IRawElementProviderSimple ProviderFromPeer(AutomationPeer peer)
        {
            AutomationPeer referencePeer = this;
 
            //replace itself with _eventsSource if we are aggregated and hidden from the UIA
            if((peer == this) && (_eventsSource != null)) 
            { 
                referencePeer = peer = _eventsSource;
            } 

            return ElementProxy.StaticWrap(peer, referencePeer);
        }
 
        private IRawElementProviderSimple ProviderFromPeerNoDelegation(AutomationPeer peer)
        { 
            AutomationPeer referencePeer = this; 
            return ElementProxy.StaticWrap(peer, referencePeer);
        } 

        ///<Summary>
        /// When one AutomationPeer is using the pattern of another AutomationPeer instead of exposing
        /// it in the children collection (example - ListBox exposes IScrollProvider from /*internal*/ public ScrollViewer 
        /// but does not expose the ScrollViewerAutomationPeer as its child) - then before returning the pattern
        /// interface from GetPattern, the "main" AutomationPeer should call this method to set up itself as 
        /// "source" for the events fired by the pattern on the subordinate AutomationPeer. 
        /// Otherwise, the hidden subordinate AutomationPeer will fire pattern's events from its own identity which
        /// will confuse UIA since its identity is not exposed to UIA. 
        ///</Summary>
        public AutomationPeer EventsSource
        {
            get { return _eventsSource; } 
            set { _eventsSource = value; }
        } 
 

        ///<Summary> 
        /// Returns AutomationPeer corresponding to the given provider.
        ///</Summary>
        protected AutomationPeer PeerFromProvider(IRawElementProviderSimple provider)
        { 
            ElementProxy proxy = provider as ElementProxy;
            if (proxy != null) 
            { 
                return (proxy.Peer);
            } 

            return null;
        }
 
        //called on a root peer of a tree when it's time to fire automation events
        //walks down the tree, updates caches and fires automation events 
        // 
        /*internal*/ public void FireAutomationEvents()
        { 
            UpdateSubtree();
        }

        // /*internal*/ public handling of structure chanegd events 
        private void RaisePropertyChangedInternal(IRawElementProviderSimple provider,
                                                             AutomationProperty propertyId, 
                                                             Object oldValue, 
                                                             Object newValue)
        { 
            // Callers have only checked if automation clients are present so filter for any interest in this particular event.
            if (  provider != null
               && EventMap.HasRegisteredEvent(AutomationEvents.PropertyChanged) )
            { 
                AutomationPropertyChangedEventArgs e = new AutomationPropertyChangedEventArgs(propertyId, oldValue, newValue);
                AutomationInteropProvider.RaiseAutomationPropertyChangedEvent(provider, e); 
            } 
        }
 
        // InvalidateLimit ?lower bound for  raising ChildrenInvalidated StructureChange event
        /*internal*/ public void UpdateChildrenInternal(int invalidateLimit)
        {
            List<AutomationPeer> oldChildren = _children; 
            List<AutomationPeer> addedChildren = null;
            Hashtable ht = null; 
 
            _childrenValid = false;
            EnsureChildren(); 

            // Callers have only checked if automation clients are present so filter for any interest in this particular event.
            if (!EventMap.HasRegisteredEvent(AutomationEvents.StructureChanged))
                return; 

            //store old children in a hashtable 
            if(oldChildren != null) 
            {
                ht =  new Hashtable(); 
                for(int count = oldChildren.Count, i = 0; i < count; i++)
                {
                    if(!ht.Contains(oldChildren[i]))
                        ht.Add(oldChildren[i], null); 
                }
            } 
 
            //walk over new children, remove the ones that were in the old collection from hash table
            //and add new ones into addedChildren list 
            int addedCount = 0;

            if(_children != null)
            { 
                for(int count = _children.Count, i = 0; i < count; i++)
                { 
                    AutomationPeer child = _children[i]; 
                    if(ht != null && ht.ContainsKey(child))
                    { 
                        ht.Remove(child); //same child, nothing to notify
                    }
                    else
                    { 
                        if(addedChildren == null) addedChildren = new List<AutomationPeer>();
 
                        //stop accumulatin new children here because the notification 
                        //is going to become "bulk anyways and exact set of chidlren is not
                        //needed, only count. 
                        ++addedCount;
                        if(addedCount <= invalidateLimit)
                            addedChildren.Add(child);
                    } 
                }
            } 
 
            //now the ht only has "removed" children. If the count does not yet
            //calls for "bulk" notification, use per-child notification, otherwise use "bulk" 
            int removedCount = (ht == null ? 0 : ht.Count);

            if(removedCount + addedCount > invalidateLimit) //bilk invalidation
            { 
                StructureChangeType flags;
 
                // Set bulk event type depending on if these were adds, removes or a mix 
                if (addedCount == 0)
                    flags = StructureChangeType.ChildrenBulkRemoved; 
                else if ( removedCount == 0 )
                    flags = StructureChangeType.ChildrenBulkAdded;
                else
                    flags = StructureChangeType.ChildrenInvalidated; 

                IRawElementProviderSimple provider = ProviderFromPeerNoDelegation(this); 
                if(provider != null) 
                {
                    int [] rid = this.GetRuntimeId(); //use runtimeID of parent for bulk notifications 

                    AutomationInteropProvider.RaiseStructureChangedEvent(
                                    provider,
                                    new StructureChangedEventArgs(flags, rid)); 
                }
            } 
            else 
            {
                if (removedCount > 0) 
                {
                    //for children removed, provider is the parent
                    IRawElementProviderSimple provider = ProviderFromPeerNoDelegation(this);
                    if (provider != null) 
                    {
                        //ht contains removed children by now 
                        foreach (Object key in ht.Keys) 
                        {
                            AutomationPeer removedChild = (AutomationPeer)key; 

                            int[] rid = removedChild.GetRuntimeId();

                            AutomationInteropProvider.RaiseStructureChangedEvent( 
                                            provider,
                                            new StructureChangedEventArgs(StructureChangeType.ChildRemoved, rid)); 
                        } 
                    }
                } 
                if (addedCount > 0)
                {
                    //ht contains removed children by now
                    foreach (AutomationPeer addedChild in addedChildren) 
                    {
                        //for children added, provider is the child itself 
                        IRawElementProviderSimple provider = ProviderFromPeerNoDelegation(addedChild); 
                        if (provider != null)
                        { 
                            int[] rid = addedChild.GetRuntimeId();

                            AutomationInteropProvider.RaiseStructureChangedEvent(
                                            provider, 
                                            new StructureChangedEventArgs(StructureChangeType.ChildAdded, rid));
                        } 
                    } 
                }
            } 
        }

        // /*internal*/ public handling of structure changed events
        /*virtual*/ /*internal*/ public void UpdateChildren() 
        {
            UpdateChildrenInternal(AutomationInteropProvider.InvalidateLimit); 
        } 

        // 



 

 
 

 


//        [FriendAccessAllowed] // Built into Core, also used by Framework.
        /*internal*/ public void UpdateSubtree() 
        {
            ContextLayoutManager lm = ContextLayoutManager.From(this.Dispatcher); 
            if(lm != null) 
            {
                lm.AutomationSyncUpdateCounter = lm.AutomationSyncUpdateCounter + 1; 

                try
                {
                    IRawElementProviderSimple provider = null; 

 
 

                    boolean notifyPropertyChanged = EventMap.HasRegisteredEvent(AutomationEvents.PropertyChanged); 
                    boolean notifyStructureChanged = EventMap.HasRegisteredEvent(AutomationEvents.StructureChanged);

                    //  did anybody ask for property changed norification?
                    if (notifyPropertyChanged) 
                    {
                        String itemStatus = GetItemStatusCore(); 
                        if (itemStatus != _itemStatus) 
                        {
                            if(provider == null) 
                                provider = ProviderFromPeerNoDelegation(this);
                            RaisePropertyChangedInternal(provider,
                                                         AutomationElementIdentifiers.ItemStatusProperty,
                                                         _itemStatus, 
                                                         itemStatus);
                            _itemStatus = itemStatus; 
                        } 

                        String name = GetNameCore(); 
                        if (name != _name)
                        {
                            if(provider == null)
                                provider = ProviderFromPeerNoDelegation(this); 
                            RaisePropertyChangedInternal(provider,
                                                         AutomationElementIdentifiers.NameProperty, 
                                                         _name, 
                                                         name);
                            _name = name; 
                        }

                        boolean isOffscreen = IsOffscreenCore();
                        if (isOffscreen != _isOffscreen) 
                        {
                            if(provider == null) 
                                provider = ProviderFromPeerNoDelegation(this); 
                            RaisePropertyChangedInternal(provider,
                                                         AutomationElementIdentifiers.IsOffscreenProperty, 
                                                         _isOffscreen,
                                                         isOffscreen);
                            _isOffscreen = isOffscreen;
                        } 

                        boolean isEnabled = IsEnabledCore(); 
                        if (isEnabled != _isEnabled) 
                        {
                            if(provider == null) 
                                provider = ProviderFromPeerNoDelegation(this);
                            RaisePropertyChangedInternal(provider,
                                                         AutomationElementIdentifiers.IsEnabledProperty,
                                                         _isEnabled, 
                                                         isEnabled);
                            _isEnabled = isEnabled; 
                        } 

                    } 

                    //  did anybody ask for structure changed norification?
                    //  if somebody asked for property changed then structure must be updated
                    if (this._childrenValid? (this.AncestorsInvalid || (ControlType.Custom == this.GetControlType())) : (notifyStructureChanged || notifyPropertyChanged)) 
                    {
                        UpdateChildren(); 
 
                        AncestorsInvalid = false;
 
                        for(AutomationPeer peer = GetFirstChild(); peer != null; peer = peer.GetNextSibling())
                        {
                            peer.UpdateSubtree();
                        } 
                    }
                    AncestorsInvalid = false; 
                    _invalidated = false; 
                }
                finally 
                {
                    lm.AutomationSyncUpdateCounter = lm.AutomationSyncUpdateCounter - 1;
                }
            } 
        }
 
        /// <summary> 
        /// propagate the new value for AncestorsInvalid through the parent chain,
        /// use EventSource (wrapper) peers whenever available as it抯 the one connected to the tree. 
        /// </summary>
        /*internal*/ public void InvalidateAncestorsRecursive()
        {
            if (!AncestorsInvalid) 
            {
                AncestorsInvalid = true; 
                if (EventsSource != null) 
                {
                    EventsSource.InvalidateAncestorsRecursive(); 
                }

                if (_parent != null)
                    _parent.InvalidateAncestorsRecursive(); 
            }
        } 
 
        private static Object UpdatePeer(Object arg)
        { 
            AutomationPeer peer = (AutomationPeer)arg;
            peer.UpdateSubtree();
            return null;
        } 

        /*internal*/ public void AddToAutomationEventList() 
        { 
            if(!_addedToEventList)
            { 
                ContextLayoutManager lm = ContextLayoutManager.From(this.Dispatcher);
                lm.AutomationEvents.Add(this); //this adds the root peer into the list of roots, for deferred event firing
                _addedToEventList = true;
            } 

        } 
 
        /// <SecurityNote>
        ///     Critical - provides access to critial data. 
        /// </SecurityNote>
        /*internal*/ public IntPtr Hwnd
        {
            [SecurityCritical] 
            get { return _hwnd; }
            [SecurityCritical] 
            set { _hwnd = value; } 
        }
 
        //
        /*internal*/ public Object GetWrappedPattern(int patternId)
        {
            Object result = null; 

            PatternInfo info = (PatternInfo)s_patternInfo[patternId]; 
 
            if (info != null)
            { 
                Object iface = GetPattern(info.PatternInterface);
                if (iface != null)
                {
                    result = info.WrapObject(this, iface); 
                }
            } 
 
            return result;
        } 

        //
        /*internal*/ public Object GetPropertyValue(int propertyId)
        { 
            Object result = null;
 
            GetProperty getProperty = (GetProperty)s_propertyInfo[propertyId]; 

            if (getProperty != null) 
            {
                result = getProperty(this);
            }
 
            return result;
        } 
 
        //
        /*internal*/ public /*virtual*/ boolean AncestorsInvalid 
        {
            get { return _ancestorsInvalid; }
            set { _ancestorsInvalid = value; }
        } 

        // 
        /*internal*/ public boolean ChildrenValid 
        {
            get { return _childrenValid; } 
            set { _childrenValid = value; }
        }

        // 
        /*internal*/ public boolean IsInteropPeer
        { 
            get { return _isInteropPeer; } 
            set { _isInteropPeer = value; }
        } 

        //
        /*internal*/ public int Index
        { 
            get { return _index; }
        } 
 
        //
        /*internal*/ public List<AutomationPeer> Children 
        {
            get { return _children; }
        }
 
        // To Keep the WeakRefernce of ElementProxy wrapper for this peer so that it can be reused
        // rather than creating the new Wrapper Object if there is need and it still exist. 
        /*internal*/ public WeakReference ElementProxyWeakReference 
        {
            get{ return _elementProxyWeakReference; } 
            set
            {
                if(value.Target as ElementProxy != null)
                    _elementProxyWeakReference = value; 
            }
        } 
 
        private static void Initialize()
        { 
            //  initializeing patterns
            s_patternInfo = new Hashtable();
            s_patternInfo[InvokePatternIdentifiers.Pattern.Id]          = new PatternInfo(InvokePatternIdentifiers.Pattern.Id,          new WrapObject(InvokeProviderWrapper.Wrap),             PatternInterface.Invoke);
            s_patternInfo[SelectionPatternIdentifiers.Pattern.Id]       = new PatternInfo(SelectionPatternIdentifiers.Pattern.Id,       new WrapObject(SelectionProviderWrapper.Wrap),          PatternInterface.Selection); 
            s_patternInfo[ValuePatternIdentifiers.Pattern.Id]           = new PatternInfo(ValuePatternIdentifiers.Pattern.Id,           new WrapObject(ValueProviderWrapper.Wrap),              PatternInterface.Value);
            s_patternInfo[RangeValuePatternIdentifiers.Pattern.Id]      = new PatternInfo(RangeValuePatternIdentifiers.Pattern.Id,      new WrapObject(RangeValueProviderWrapper.Wrap),         PatternInterface.RangeValue); 
            s_patternInfo[ScrollPatternIdentifiers.Pattern.Id]          = new PatternInfo(ScrollPatternIdentifiers.Pattern.Id,          new WrapObject(ScrollProviderWrapper.Wrap),             PatternInterface.Scroll); 
            s_patternInfo[ScrollItemPatternIdentifiers.Pattern.Id]      = new PatternInfo(ScrollItemPatternIdentifiers.Pattern.Id,      new WrapObject(ScrollItemProviderWrapper.Wrap),         PatternInterface.ScrollItem);
            s_patternInfo[ExpandCollapsePatternIdentifiers.Pattern.Id]  = new PatternInfo(ExpandCollapsePatternIdentifiers.Pattern.Id,  new WrapObject(ExpandCollapseProviderWrapper.Wrap),     PatternInterface.ExpandCollapse); 
            s_patternInfo[GridPatternIdentifiers.Pattern.Id]            = new PatternInfo(GridPatternIdentifiers.Pattern.Id,            new WrapObject(GridProviderWrapper.Wrap),               PatternInterface.Grid);
            s_patternInfo[GridItemPatternIdentifiers.Pattern.Id]        = new PatternInfo(GridItemPatternIdentifiers.Pattern.Id,        new WrapObject(GridItemProviderWrapper.Wrap),           PatternInterface.GridItem);
            s_patternInfo[MultipleViewPatternIdentifiers.Pattern.Id]    = new PatternInfo(MultipleViewPatternIdentifiers.Pattern.Id,    new WrapObject(MultipleViewProviderWrapper.Wrap),       PatternInterface.MultipleView);
            s_patternInfo[WindowPatternIdentifiers.Pattern.Id]          = new PatternInfo(WindowPatternIdentifiers.Pattern.Id,          new WrapObject(WindowProviderWrapper.Wrap),             PatternInterface.Window); 
            s_patternInfo[SelectionItemPatternIdentifiers.Pattern.Id]   = new PatternInfo(SelectionItemPatternIdentifiers.Pattern.Id,   new WrapObject(SelectionItemProviderWrapper.Wrap),      PatternInterface.SelectionItem);
            s_patternInfo[DockPatternIdentifiers.Pattern.Id]            = new PatternInfo(DockPatternIdentifiers.Pattern.Id,            new WrapObject(DockProviderWrapper.Wrap),               PatternInterface.Dock); 
            s_patternInfo[TablePatternIdentifiers.Pattern.Id]           = new PatternInfo(TablePatternIdentifiers.Pattern.Id,           new WrapObject(TableProviderWrapper.Wrap),              PatternInterface.Table); 
            s_patternInfo[TableItemPatternIdentifiers.Pattern.Id]       = new PatternInfo(TableItemPatternIdentifiers.Pattern.Id,       new WrapObject(TableItemProviderWrapper.Wrap),          PatternInterface.TableItem);
            s_patternInfo[TogglePatternIdentifiers.Pattern.Id]          = new PatternInfo(TogglePatternIdentifiers.Pattern.Id,          new WrapObject(ToggleProviderWrapper.Wrap),             PatternInterface.Toggle); 
            s_patternInfo[TransformPatternIdentifiers.Pattern.Id]       = new PatternInfo(TransformPatternIdentifiers.Pattern.Id,       new WrapObject(TransformProviderWrapper.Wrap),          PatternInterface.Transform);
            s_patternInfo[TextPatternIdentifiers.Pattern.Id]            = new PatternInfo(TextPatternIdentifiers.Pattern.Id,            new WrapObject(TextProviderWrapper.Wrap),               PatternInterface.Text);

            // To avoid the worst situation on legacy systems which may not have new unmanaged core. with this change with old unmanaged core 
            // this will these patterns will be null and won't be added and hence reponse will be as it is not present at all rather than any crash.
            if (VirtualizedItemPatternIdentifiers.Pattern != null) 
                s_patternInfo[VirtualizedItemPatternIdentifiers.Pattern.Id] = new PatternInfo(VirtualizedItemPatternIdentifiers.Pattern.Id, new WrapObject(VirtualizedItemProviderWrapper.Wrap), PatternInterface.VirtualizedItem); 
            if (ItemContainerPatternIdentifiers.Pattern != null)
                s_patternInfo[ItemContainerPatternIdentifiers.Pattern.Id] = new PatternInfo(ItemContainerPatternIdentifiers.Pattern.Id, new WrapObject(ItemContainerProviderWrapper.Wrap), PatternInterface.ItemContainer); 
            if (SynchronizedInputPatternIdentifiers.Pattern != null)
            {
                s_patternInfo[SynchronizedInputPatternIdentifiers.Pattern.Id] = new PatternInfo(SynchronizedInputPatternIdentifiers.Pattern.Id, new WrapObject(SynchronizedInputProviderWrapper.Wrap), PatternInterface.SynchronizedInput);
            } 

            //  initializeing properties 
            s_propertyInfo = new Hashtable(); 
            s_propertyInfo[AutomationElementIdentifiers.IsControlElementProperty.Id] = new GetProperty(IsControlElement);
            s_propertyInfo[AutomationElementIdentifiers.ControlTypeProperty.Id] = new GetProperty(GetControlType); 
            s_propertyInfo[AutomationElementIdentifiers.IsContentElementProperty.Id] = new GetProperty(IsContentElement);
            s_propertyInfo[AutomationElementIdentifiers.LabeledByProperty.Id] = new GetProperty(GetLabeledBy);
            s_propertyInfo[AutomationElementIdentifiers.NativeWindowHandleProperty.Id] = new GetProperty(GetNativeWindowHandle);
            s_propertyInfo[AutomationElementIdentifiers.AutomationIdProperty.Id] = new GetProperty(GetAutomationId); 
            s_propertyInfo[AutomationElementIdentifiers.ItemTypeProperty.Id] = new GetProperty(GetItemType);
            s_propertyInfo[AutomationElementIdentifiers.IsPasswordProperty.Id] = new GetProperty(IsPassword); 
            s_propertyInfo[AutomationElementIdentifiers.LocalizedControlTypeProperty.Id] = new GetProperty(GetLocalizedControlType); 
            s_propertyInfo[AutomationElementIdentifiers.NameProperty.Id] = new GetProperty(GetName);
            s_propertyInfo[AutomationElementIdentifiers.AcceleratorKeyProperty.Id] = new GetProperty(GetAcceleratorKey); 
            s_propertyInfo[AutomationElementIdentifiers.AccessKeyProperty.Id] = new GetProperty(GetAccessKey);
            s_propertyInfo[AutomationElementIdentifiers.HasKeyboardFocusProperty.Id] = new GetProperty(HasKeyboardFocus);
            s_propertyInfo[AutomationElementIdentifiers.IsKeyboardFocusableProperty.Id] = new GetProperty(IsKeyboardFocusable);
            s_propertyInfo[AutomationElementIdentifiers.IsEnabledProperty.Id] = new GetProperty(IsEnabled); 
            s_propertyInfo[AutomationElementIdentifiers.BoundingRectangleProperty.Id] = new GetProperty(GetBoundingRectangle);
            s_propertyInfo[AutomationElementIdentifiers.ProcessIdProperty.Id] = new GetProperty(GetCurrentProcessId); 
            s_propertyInfo[AutomationElementIdentifiers.RuntimeIdProperty.Id] = new GetProperty(GetRuntimeId); 
            s_propertyInfo[AutomationElementIdentifiers.ClassNameProperty.Id] = new GetProperty(GetClassName);
            s_propertyInfo[AutomationElementIdentifiers.HelpTextProperty.Id] = new GetProperty(GetHelpText); 
            s_propertyInfo[AutomationElementIdentifiers.ClickablePointProperty.Id] = new GetProperty(GetClickablePoint);
            s_propertyInfo[AutomationElementIdentifiers.CultureProperty.Id] = new GetProperty(GetCultureInfo);
            s_propertyInfo[AutomationElementIdentifiers.IsOffscreenProperty.Id] = new GetProperty(IsOffscreen);
            s_propertyInfo[AutomationElementIdentifiers.OrientationProperty.Id] = new GetProperty(GetOrientation); 
            s_propertyInfo[AutomationElementIdentifiers.FrameworkIdProperty.Id] = new GetProperty(GetFrameworkId);
            s_propertyInfo[AutomationElementIdentifiers.IsRequiredForFormProperty.Id] = new GetProperty(IsRequiredForForm); 
            s_propertyInfo[AutomationElementIdentifiers.ItemStatusProperty.Id] = new GetProperty(GetItemStatus); 
        }
 
        private delegate Object WrapObject(AutomationPeer peer, Object iface);

        private class PatternInfo
        { 
            /*internal*/ public PatternInfo(int id, WrapObject wrapObject, PatternInterface patternInterface)
            { 
                Id = id; 
                WrapObject = wrapObject;
                PatternInterface = patternInterface; 
            }

            /*internal*/ public int Id;
            /*internal*/ public WrapObject WrapObject; 
            /*internal*/ public PatternInterface PatternInterface;
        } 
 
        private delegate Object GetProperty(AutomationPeer peer);
 
        private static Object IsControlElement(AutomationPeer peer)         {   return peer.IsControlElement(); }
        private static Object GetControlType(AutomationPeer peer)           {   ControlType controlType = peer.GetControlType(); return controlType.Id;  }
        private static Object IsContentElement(AutomationPeer peer)         {   return peer.IsContentElement(); }
        private static Object GetLabeledBy(AutomationPeer peer)             {   AutomationPeer byPeer = peer.GetLabeledBy(); return ElementProxy.StaticWrap(byPeer, peer);  } 
        private static Object GetNativeWindowHandle(AutomationPeer peer)    {   return null /* not used? */;    }
        private static Object GetAutomationId(AutomationPeer peer)          {   return peer.GetAutomationId();  } 
        private static Object GetItemType(AutomationPeer peer)              {   return peer.GetItemType();      } 
        private static Object IsPassword(AutomationPeer peer)               {   return peer.IsPassword();       }
        private static Object GetLocalizedControlType(AutomationPeer peer)  {   return peer.GetLocalizedControlType();  } 
        private static Object GetName(AutomationPeer peer)                  {   return peer.GetName();          }
        private static Object GetAcceleratorKey(AutomationPeer peer)        {   return peer.GetAcceleratorKey();    }
        private static Object GetAccessKey(AutomationPeer peer)             {   return peer.GetAccessKey();     }
        private static Object HasKeyboardFocus(AutomationPeer peer)         {   return peer.HasKeyboardFocus(); } 
        private static Object IsKeyboardFocusable(AutomationPeer peer)      {   return peer.IsKeyboardFocusable();  }
        private static Object IsEnabled(AutomationPeer peer)                {   return peer.IsEnabled();        } 
        private static Object GetBoundingRectangle(AutomationPeer peer)     {   return peer.GetBoundingRectangle(); } 
        private static Object GetCurrentProcessId(AutomationPeer peer)      {   return SafeNativeMethods.GetCurrentProcessId(); }
        private static Object GetRuntimeId(AutomationPeer peer)             {   return peer.GetRuntimeId();     } 
        private static Object GetClassName(AutomationPeer peer)             {   return peer.GetClassName();     }
        private static Object GetHelpText(AutomationPeer peer)              {   return peer.GetHelpText();  }
        private static Object GetClickablePoint(AutomationPeer peer)        {   Point pt = peer.GetClickablePoint(); return new double[] {pt.X, pt.Y};  }
        private static Object GetCultureInfo(AutomationPeer peer)           {   return null;    } 
        private static Object IsOffscreen(AutomationPeer peer)              {   return peer.IsOffscreen();  }
        private static Object GetOrientation(AutomationPeer peer)           {   return peer.GetOrientation();   } 
        private static Object GetFrameworkId(AutomationPeer peer)           {   return peer.GetFrameworkId();   } 
        private static Object IsRequiredForForm(AutomationPeer peer)        {   return peer.IsRequiredForForm();    }
        private static Object GetItemStatus(AutomationPeer peer)            {   return peer.GetItemStatus();    } 

        private static Hashtable s_patternInfo;
        private static Hashtable s_propertyInfo;
 
        private int _index = -1;
        ///<SecurityNote> 
        ///     Critical - once stored, this hwnd will be used for subsequent automation operations. 
        ///</SecurityNote>
//        [SecurityCritical] 
        private IntPtr _hwnd;
        private List<AutomationPeer> _children;
        private AutomationPeer _parent;
 
        private AutomationPeer _eventsSource;
 
        private Rect _boundingRectangle; 
        private String _itemStatus;
        private String _name; 
        private boolean _isOffscreen;
        private boolean _isEnabled;
        private boolean _invalidated;
        private boolean _ancestorsInvalid; 
        private boolean _childrenValid;
        private boolean _addedToEventList; 
        private boolean _publicCallInProgress; 
        private boolean _publicSetFocusInProgress;
        private boolean _isInteropPeer; 
        private WeakReference _elementProxyWeakReference = null;

        private static DispatcherOperationCallback _updatePeer = new DispatcherOperationCallback(UpdatePeer);
 
    }