/**
 * AccessKeyManager
 */
/// <summary> 
///   AccessKeyManager object is created on demand and it is one per thread. 
/// It attached an event handler for PostProcessInput on InputManager and expose registration and
/// unregistration of access keys. When the access key is pressed in calls OnAccessKey method on the target element 
/// </summary>
define(["dojo/_base/declare", "system/Type", "input/AccessKeyPressedEventHandler"], 
		function(declare, Type, AccessKeyPressedEventHandler){
//    private enum 
	var ProcessKeyResult = {
        NoMatch:0,
        MoreMatches:1, 
        LastMatch:2 
    };
    
//    private struct
	var AccessKeyInformation = declare(Object, 
    { 
//        private object _scope; 
    });
	
//	private static AccessKeyInformation 
	var _empty = new AccessKeyInformation(); 
	
	Object.defineProperties(AccessKeyInformation, {
//        public static AccessKeyInformation 
		Empty:
        { 
            get:function()
            {
                return _empty;
            } 
        }
	});
	
	Object.defineProperties(AccessKeyInformation.prototype, {
        /// <SecurityNote>
        ///     Critical: Scope may contain an PresentationSource which we 
        ///               would not want exposed. 
        /// </SecurityNote>
//        public object 
		Scope: 
        {
            get:function()
            { 
                return this._scope;
            }, 
            set:function(value) 
            {
            	this._scope = value; 
            }
        },
        
//        public UIElement 
        target: 
        {
            get:function()
            { 
                return this._target;
            }, 
            set:function(value) 
            {
            	this._target = value; 
            }
        },
	});
	
    
	var AccessKeyManager = declare("AccessKeyManager", Object,{
		constructor:function(){
			InputManager.Current.PostProcessInput.Combine(new ProcessInputEventHandler(this, this.PostProcessInput));
	        // Map: string -> ArrayList of WeakReferences to IInputElements 
//	        private Hashtable 
			this._keyToElements = new Hashtable(10);
		},
		/// <SecurityNote>
        ///     Critical: accesses e.StagingItem.Input
        /// </SecurityNote>
//        private void 
		PostProcessInput:function(/*object*/ sender, /*ProcessInputEventArgs*/ e)
        { 
            if (e.StagingItem.Input.Handled) return; 

            if (e.StagingItem.Input.RoutedEvent == Keyboard.KeyDownEvent) 
            {
                OnKeyDown(/*(KeyEventArgs)*/e.StagingItem.Input);
            }
            else if (e.StagingItem.Input.RoutedEvent == TextCompositionManager.TextInputEvent) 
            {
                OnText(/*(TextCompositionEventArgs)*/e.StagingItem.Input); 
            } 

        },

        // Assumes key is already a single unicode character
        /// <SecurityNote>
        /// Critical - sets the userInitiated bit on a command, which is used 
        ///            for security purposes later.
        /// </SecurityNote> 
//        private ProcessKeyResult 
        ProcessKeyForSender:function(/*object*/ sender, /*string*/ key, /*bool*/ existsElsewhere, /*bool*/ userInitiated)
        { 
            // This comes from OnKeyDown or OnText and though it is a single character it might not be uppercased.
            key = key.ToUpperInvariant();

            /*IInputElement*/var inputElementSender = sender instanceof IInputElement ? sender : null; 
            /*List<IInputElement>*/var targets = GetTargetsForSender(inputElementSender, key);
 
            return ProcessKey(targets, key, existsElsewhere, userInitiated); 
        },
 
        // Assumes key is already a single unicode character AND is uppercased
        /// <SecurityNote>
        /// Critical - sets the userInitiated bit on a command, which is used
        ///            for security purposes later. 
        /// </SecurityNote>
//        private ProcessKeyResult 
        ProcessKeyForScope:function(/*object*/ scope, /*string*/ key, /*bool*/ existsElsewhere, /*bool*/ userInitiated) 
        {
            /*List<IInputElement>*/var targets = GetTargetsForScope(scope, key, null, AccessKeyInformation.Empty); 

            return ProcessKey(targets, key, existsElsewhere, userInitiated);
        },
 
        /// <SecurityNote>
        /// Critical - Sets calls AccessKeyPressedEventArgs setting the userInitiated bit which is used 
        ///            for security purposes later. 
        /// </SecurityNote>
//        private ProcessKeyResult 
        ProcessKey:function(/*List<IInputElement>*/ targets, /*string*/ key, /*bool*/ existsElsewhere, /*bool*/ userInitiated)
        {
            if (targets != null)
            { 
                var oneUIElement = true;
                /*UIElement*/var invokeUIElement = null; 
                var lastWasAccessed = false; 

                var chosenIndex = 0; 
                for (var i = 0; i < targets.Count; i++)
                {
                    /*UIElement*/var target = targets.Get(i);
                    target = target instanceof UIElement ? target : null;
//                    Debug.Assert(target != null, "Targets should only be UIElements"); 
                    if (!target.IsEnabled)
                        continue; 
 
                    if (invokeUIElement == null)
                    { 
                        invokeUIElement = target;
                        chosenIndex = i;
                    }
                    else 
                    {
                        if (lastWasAccessed) 
                        { 
                            invokeUIElement = target;
                            chosenIndex = i; 
                        }

                        oneUIElement = false;
                    } 

                    // 
                    lastWasAccessed = target.HasEffectiveKeyboardFocus; 
                }
 
                if (invokeUIElement != null)
                {
                    /*AccessKeyEventArgs*/var args = new AccessKeyEventArgs(key, !oneUIElement || existsElsewhere /* == isMultiple */,userInitiated);
                    try 
                    {
                        invokeUIElement.InvokeAccessKey(args); 
                    } 
                    finally
                    { 
                        args.ClearUserInitiated();
                    }

                    return (chosenIndex == targets.Count - 1) ? ProcessKeyResult.LastMatch : ProcessKeyResult.MoreMatches; 
                }
            } 
 
            return ProcessKeyResult.NoMatch;
        }, 

        /// <SecurityNote>
        /// Critical - Calls ProcessKeyForSender, setting the userInitiated
        ///             bit, which is used for security purposes later. 
        /// </SecurityNote>
//        private void 
        OnText:function(/*TextCompositionEventArgs*/ e) 
        {
            // AccessKeyManager handles both text and system text. 
            var text = e.Text;
            if ((text == null) || (text.length == 0))
            {
                text = e.SystemText; 
            }
 
            if ((text != null) && (text.length > 0)) 
            {
                if (ProcessKeyForSender(e.OriginalSource, text, false /* existsElsewhere */,e.UserInitiated) != ProcessKeyResult.NoMatch) 
                {
                    e.Handled = true;
                }
            } 
        },
 
        /// <SecurityNote> 
        /// Critical - Calls ProcessKeyForSender, setting the userInitiated
        ///             bit, which is used for security purposes later. 
        /// </SecurityNote>
//        private void 
        OnKeyDown:function(/*KeyEventArgs*/ e)
        { 
            /*KeyboardDevice*/var keyboard = e.Device;
 
            var text = null; 
            switch (e.RealKey)
            { 
                case Key.Enter :
                     text = "\x000D";
                     break;
 
                case Key.Escape :
                     text = "\x001B"; 
                     break; 
            }
 
            if (text != null)
            {
                if (ProcessKeyForSender(e.OriginalSource, text, false /* existsElsewhere */,e.UserInitiated) != ProcessKeyResult.NoMatch)
                { 
                    e.Handled = true;
                } 
            } 
        },
 
        /// <summary>
        /// Get the list of access key targets for the sender of the keyboard event.  If sender is null,
        /// pretend key was pressed in the active window.
        /// </summary> 
        /// <param name="sender"></param>
        /// <param name="key"></param> 
        /// <returns></returns> 
        /// <SecurityNote>
        ///     Critical: calls Critical member GetInfoForElement() and accesses Scope from AccessKeyInformation. 
        ///     TreatAsSafe:  Does not pass the sender info (which may contain a PresentationSource) out.
        /// </SecurityNote>
//        private List<IInputElement> 
        GetTargetsForSender:function(/*IInputElement*/ sender, /*string*/ key) 
        {
            // Find the scope for the sender -- will be matched against the possible targets' scopes 
            /*AccessKeyInformation*/var senderInfo = GetInfoForElement(sender, key); 

            return GetTargetsForScope(senderInfo.Scope, key, sender, senderInfo); 
        },

        /// <SecurityNote>
        ///     Critical: calls CriticalGetActiveSource() 
        ///     TreatAsSafe:  Does not pass the returned scope to any other method, nor is it
        ///                 returned from GetTargetsForScope.  Also returned value is not critical. 
        /// </SecurityNote> 
//        private List<IInputElement> 
        GetTargetsForScope:function(/*object*/ scope, /*string*/ key, /*IInputElement*/ sender, /*AccessKeyInformation*/ senderInfo) 
        {
            // null scope defaults to the active window
            if (scope == null)
            { 
                scope = CriticalGetActiveSource();
 
                // if there is no active scope then give up 
                if (scope == null)
                { 
                    return null;
                }
            }
 
            if (CoreCompatibilityPreferences.GetIsAltKeyRequiredInAccessKeyDefaultScope() &&
                (scope instanceof PresentationSource) && (Keyboard.Modifiers & ModifierKeys.Alt) != ModifierKeys.Alt) 
            { 
                // If AltKey is required and it isnt pressed then dont match against any targets
                return null; 
            }

            //Scoping:
            //    1) When key is pressed, find matching AKs -> S 
            //    3) find scope for keyevent.Source
            //    4) find scope for everything in S. throw away those that don't match. 
            //    5) Final selection uses S.  yay! 
            //
            // 
            /*List<IInputElement>*/var possibleElements;
//            lock (_keyToElements)
//            {
            var possibleElements = this._keyToElements.Get(key);
            possibleElements = possibleElements instanceof ArrayList ? possibleElements : null;
                possibleElements = CopyAndPurgeDead(possibleElements); 
//            }
 
            if (possibleElements == null) return null; 

            /*List<IInputElement>*/var finalTargets = new List/*<IInputElement>*/(1); 

            // Go through all the possible elements, find the interesting candidates
            for (var i = 0; i < possibleElements.Count;  i++)
            { 
                /*IInputElement*/var element = possibleElements.Get(i);
                if (element != sender) 
                { 
                    if (this.IsTargetable(element))
                    { 
                        /*AccessKeyInformation*/var elementInfo = GetInfoForElement(element, key);

                        if (elementInfo.target == null) continue;
 
                        if (scope == elementInfo.Scope)
                        { 
                            finalTargets.Add(elementInfo.target); 
                        }
                    } 
                }
                else
                {
                    // This is the same element that sent the event so it must be in the same scope. 
                    // Just add it to the final targets
                    if (senderInfo.target != null) 
                    { 
                        finalTargets.Add(senderInfo.target);
                    } 
                }
            }

            return finalTargets; 
        },
 
        /// <summary> 
        /// Returns scope for the given element.
        /// </summary> 
        /// <param name="element"></param>
        /// <param name="key"></param>
        /// <returns>Scope for the given element, null means the context global scope</returns>
        /// <SecurityNote> 
        ///     Critical: calls GetSourceForElement(), CriticalGetActiveSource(), and returns AccessKeyInformation.
        /// </SecurityNote> 
//        private AccessKeyInformation 
        GetInfoForElement:function(/*IInputElement*/ element, /*string*/ key)
        { 
            /*AccessKeyInformation*/var info = new AccessKeyInformation();
            if (element != null)
            {
                /*AccessKeyPressedEventArgs*/var args = new AccessKeyPressedEventArgs(key); 

                element.RaiseEvent(args); 
                info.Scope = args.Scope; 
                info.target = args.Target;
                if (info.Scope == null) 
                {
                    info.Scope = GetSourceForElement(element);
                }
            } 
            else
            { 
                info.Scope = CriticalGetActiveSource(); 
            }
            return info; 
        },

        /// <SecurityNote>
        ///     Critical: calls PresentationSource.CriticalFromVisual, and returns PresentationSource 
        /// </SecurityNote>
//        private PresentationSource 
        GetSourceForElement:function(/*IInputElement*/ element) 
        {
            /*PresentationSource*/var source = null; 
            /*DependencyObject*/var elementDO = element instanceof DependencyObject ? element : null;

            // Use internal helpers to try to find the source of the element.
            // Because IInputElements can move around without notification we need to 
            // look up the source every time.
            if (elementDO != null) 
            { 
                /*DependencyObject*/var containingVisual = InputElement.GetContainingVisual(elementDO);
 
                if (containingVisual != null)
                {
                    source = PresentationSource.CriticalFromVisual(containingVisual);
                } 
            }
 
            // NOTE: source can be null but IsTargetable(element) == true if the 
            // element is in an orphaned tree but the tree has not yet been garbage collected.
            return source; 
        },

        /// <SecurityNote>
        ///     Critical: calls UnsafeNativeMethod GetActiveWindow(), and Critical method 
        ///               HwndSource.FromHwnd().
        ///     TreatAsSafe: Does not pass any parameters to GetActiveWindow(), and does 
        ///                 not expose the return value, and HwndSource.FromHwnd will demand 
        ///                 UIPermissionWindow.AllWindows.
        /// </SecurityNote> 
//        private PresentationSource 
        GetActiveSource:function()
        {
            /*IntPtr*/var hwnd = MS.Win32.UnsafeNativeMethods.GetActiveWindow(); 
            if (hwnd != IntPtr.Zero)
                return HwndSource.FromHwnd(hwnd); 
 
            return null;
        }, 

        /// <SecurityNote>
        ///     Critical: calls UnsafeNativeMethod GetActiveWindow() and HwndSource.CriticalFromHwnd()
        /// </SecurityNote> 
//        private PresentationSource 
        CriticalGetActiveSource:function() 
        { 
            /*IntPtr*/var hwnd = MS.Win32.UnsafeNativeMethods.GetActiveWindow();
            if (hwnd != IntPtr.Zero) 
                return HwndSource.CriticalFromHwnd(hwnd);

            return null;
        }, 

 
//        private bool 
        IsTargetable:function(/*IInputElement*/ element) 
        {
            /*DependencyObject*/var uielement = InputElement.GetContainingUIElement(/*(DependencyObject)*/element); 

            // For an element to be a valid target it must be visible and enabled
            if (uielement != null
                && IsVisible(uielement) 
                && IsEnabled(uielement))
            { 
                return true; 
            }
 
            return false;
        },
        
//        private string 
        GetAccessKeyCharacter:function(/*DependencyObject*/ d) 
        {
            // See what the local value for AccessKeyElement is first and start with that. 
            /*WeakReference*/var cachedElementWeakRef = /*(WeakReference)*/d.GetValue(AccessKeyElementProperty); 
            /*IInputElement*/var accessKeyElement = (cachedElementWeakRef != null) ? /*(IInputElement)*/cachedElementWeakRef/*.Target*/ : null;
 
            if (accessKeyElement != null)
            {
                // First figure out if the target of accessKeyElement is still "d", then go find
                // the "primary" character for the accessKeyElement. 

                /*AccessKeyPressedEventArgs*/var accessKeyPressedEventArgs = new AccessKeyPressedEventArgs(); 
                accessKeyElement.RaiseEvent(accessKeyPressedEventArgs); 
                if (accessKeyPressedEventArgs.Target == d)
                { 
                    // Because there is no way to get at the access key element's character from the
                    // element (there is no interface or anything) we have to go through all registered
                    // access keys and see if this access key element is still registered and what its
                    // "primary" character is. 

                	for(var i=0; i<this.Current._keyToElements.Count; i++) //foreach (DictionaryEntry entry in Current._keyToElements) 
                    { 
                		var entry = this.Current._keyToElements.Get(i);
                        /*ArrayList*/var elements = /*(ArrayList)*/entry.Value;
                        for (var i = 0; i < elements.Count; i++) 
                        {
                            // If this element matches accessKeyElement, then return the current character
                            /*WeakReference*/var currentElementWeakRef = /*(WeakReference)*/elements.Get(i);
 
                            if (currentElementWeakRef/*.Target*/ == accessKeyElement)
                            { 
                                return /*(string)*/entry.Key; 
                            }
                        } 
                    }
                }
            }
 

            // There was no access key stored or it no longer matched.  Clear out the cache and figure it out again. 
            d.ClearValue(AccessKeyElementProperty); 

            for(var i=0; i<this.Current._keyToElements.Count; i++) //foreach (DictionaryEntry entry in Current._keyToElements) 
            {
            	var entry = this.Current._keyToElements.Get(i);
                /*ArrayList*/var elements = /*(ArrayList)*/entry.Value;
                for (var i = 0; i < elements.Count; i++)
                { 
                    // Determine the target for this element.  Cache the weak reference for the element on the target.
                    /*WeakReference*/var currentElementWeakRef = /*(WeakReference)*/elements.Get(i); 
                    /*IInputElement*/var currentElement = /*(IInputElement)*/currentElementWeakRef/*.Target*/; 

                    if (currentElement != null) 
                    {
                        /*AccessKeyPressedEventArgs*/var accessKeyPressedEventArgs = new AccessKeyPressedEventArgs();
                        currentElement.RaiseEvent(accessKeyPressedEventArgs);
 
                        // If the target was non-null, cache the access key element on the target.
                        // if the target matches "d", return the current character. 
                        if (accessKeyPressedEventArgs.Target != null) 
                        {
                            accessKeyPressedEventArgs.Target.SetValue(AccessKeyElementProperty, currentElementWeakRef); 

                            if (accessKeyPressedEventArgs.Target == d)
                            {
                                return /*(string)*/entry.Key; 
                            }
                        } 
                    } 
                }
            } 


            return String.Empty;
        } 
	
	});
	
	Object.defineProperties(AccessKeyManager.prototype,{
		  
	});
	
	Object.defineProperties(AccessKeyManager,{
	    /// <summary>
	    /// This event is used by elements that want to define a scope for accesskeys, such as Menu and Popup. 
	    /// This event will never be raised, it is used to identify classes that define new scopes. 
	    /// </summary>
//	    public static readonly RoutedEvent 
		AccessKeyPressedEvent:
        {
        	get:function(){
        		if(AccessKeyManager._AccessKeyPressedEvent === undefined){
        			AccessKeyManager._AccessKeyPressedEvent = EventManager.RegisterRoutedEvent( 
        			        "AccessKeyPressed", RoutingStrategy.Bubble, AccessKeyPressedEventHandler.Type, AccessKeyManager.Type);  
        		}
        		
        		return AccessKeyManager._AccessKeyPressedEvent;
        	}
        }, 
	       /// <summary> 
        /// Access to the current context's AccessKeyManager class
        /// </summary> 
//        private static AccessKeyManager 
		Current: 
        {
            get:function() 
            {
                if (_accessKeyManager == null)
                    _accessKeyManager = new AccessKeyManager();
                return _accessKeyManager; 
            }
        },
        
        /////////////////////////////////////////////////////////////////////////////////
        // Overview: Algorithm to look up access key from the element for which it is a target.
        // 
        //     When the AccessKeyCharacter for an element is requested we see if there
        //     is a corresponding AccessKeyElement stashed on the element.  If there is, 
        //     raise the AccessKeyPressed event on it to see if that element is  still the 
        //     target for it.  If not, go through all registered accesskeys and get their
        //     targets until we find the desired element.  The "primary" access key character 
        //     is the first one we find.
        //
        //     Note: The algorithm ends up being O(n) for each request for AccessKeyCharacter
        //     because there is no mapping from AccessKeyElement to its "primary" character. 
        //     Maintaining this would require storing a hash from AccessKeyElement to character
        //     or requiring that each element registered implement an interface or some other 
        //     kind of contract.  Because we don't keep track of this or enforce this, to find 
        //     the "primary" character we must go through all registered pairs of
        //     (character, element) to find the character -- O(n). 
        //
        //     This ends up being just fine, because in any given context there shouldn't be
        //     so many elements registered that this cost is at all noticable.
        // 
        /////////////////////////////////////////////////////////////////////////////////
 
        /// <summary> 
        ///     The primary access key element for an element.  This is stored as a WeakReference.
        /// </summary> 
//        private static readonly DependencyProperty 
        AccessKeyElementProperty:
        {
        	get:function(){
        		if(AccessKeyManager._AccessKeyElementProperty === undefined){
        			AccessKeyManager._AccessKeyElementProperty  =
        	            DependencyProperty.RegisterAttached("AccessKeyElement", /*typeof(WeakReference)*/Object.Type, 
        	            		AccessKeyManager.Type);  
        		}
        		
        		return AccessKeyManager._AccessKeyElementProperty;
        	}
        }
        
	});
	
	/// <summary>
    ///   Register the access key binding to the element that is the accesskey. 
    /// </summary> 
    /// <param name="key">When the key is pressed the element OnAccessKey method is called</param>
    /// <param name="element">The registration element</param> 
//    public static void 
	AccessKeyManager.Register = function(/*string*/ key, /*IInputElement*/ element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 
        key = NormalizeKey(key); 

        /*AccessKeyManager*/var akm = AccessKeyManager.Current; 

//        lock (akm._keyToElements)
//        {
            /*ArrayList*/var elements = /*(ArrayList)*/akm._keyToElements[key]; 

            if (elements == null) 
            { 
                elements = new ArrayList(1);
                akm._keyToElements[key] = elements; 
            }
            else
            {
                // There were some elements there, remove dead ones 
                PurgeDead(elements, null);
            } 

            elements.Add(element/*new WeakReference(element)*/);
//        } 
    };

    /// <summary>
    /// Unregister one key bound to a particular element 
    /// </summary>
    /// <param name="key"></param> 
    /// <param name="element"></param> 
//    public static void 
    AccessKeyManager.Unregister = function(/*string*/ key, /*IInputElement*/ element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 
        key = NormalizeKey(key);

        /*AccessKeyManager*/var akm = AccessKeyManager.Current; 

//        lock (akm._keyToElements) 
//        {
            // Get all elements bound to this key and remove this element
            /*ArrayList*/var elements = /*(ArrayList)*/akm._keyToElements[key];

            if (elements != null)
            { 
                PurgeDead(elements, element); 
                if (elements.Count == 0)
                { 
                    akm._keyToElements.Remove(key);
                }
            }
//        } 
    };

    /// <summary> 
    /// Tells if there is a particular key registered at the global scope in this Context.
    /// </summary> 
    /// <param name="scope">Scope to query (for example the PresentationSource of the visual)</param>
    /// <param name="key"></param>
    /// <returns></returns>
//    public static bool 
    AccessKeyManager.IsKeyRegistered = function(/*object*/ scope, /*string*/ key) 
    {
        key = NormalizeKey(key); 

        /*AccessKeyManager*/var akm = AccessKeyManager.Current;
        /*List<IInputElement>*/var targets = akm.GetTargetsForScope(scope, key, null, AccessKeyInformation.Empty); 
        return (targets != null && targets.Count > 0);
    };

    /// <summary> 
    /// Process the given key as if the key were pressed at the global scope in this context.
    /// </summary> 
    /// <param name="scope">scope in which to invoke the access key</param> 
    /// <param name="key">character being pressed</param>
    /// <param name="isMultiple">True if this key has multiple matches</param> 
    /// <returns>false if there are no more keys that match, true otherwise</returns>
    /// <summary>
    ///     Executes the command on the given command source.
    /// </summary> 
    /// <SecurityNote>
    ///     Critical - calls critical function (ProcessKeyForScope) 
    ///     PublicOK - always passes in false for userInitiated, which is safe 
    /// </SecurityNote>
//    public static bool 
    AccessKeyManager.ProcessKey = function(/*object*/ scope, /*string*/ key, /*bool*/ isMultiple)
    {
        key = NormalizeKey(key);

        /*AccessKeyManager*/var akm = AccessKeyManager.Current;
        return (akm.ProcessKeyForScope(scope, key, isMultiple,false) == ProcessKeyResult.MoreMatches); 
    }; 

    /// <summary> 
    /// Returns StringInfo.GetNextTextElement(key).ToUpperInvariant() throwing exceptions for null
    /// and multi-char strings.
    /// </summary>
    /// <param name="key"></param> 
    /// <returns></returns>
//    private static string
    function NormalizeKey(/*string*/ key) 
    { 
        if (key == null)
        { 
            throw new ArgumentNullException("key");
        }

        var firstCharacter = StringInfo.GetNextTextElement(key); 

        if (key != firstCharacter) 
        { 
            throw new ArgumentException(SR.Get(SRID.AccessKeyManager_NotAUnicodeCharacter, "key"));
        } 

        return firstCharacter.ToUpperInvariant();
    }



    /// <summary>
    ///     Adds a handler for the AccessKeyPressed attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be added</param> 
//    public static void 
    AccessKeyManager.AddAccessKeyPressedHandler = function(/*DependencyObject*/ element, /*AccessKeyPressedEventHandler*/ handler)
    { 
        UIElement.AddHandler(element, AccessKeyPressedEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the AccessKeyPressed attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void 
    AccessKeyManager.RemoveAccessKeyPressedHandler = function(/*DependencyObject*/ element, /*AccessKeyPressedEventHandler*/ handler) 
    {
        UIElement.RemoveHandler(element, AccessKeyPressedEvent, handler);
    };
    
//    private static bool 
    function IsVisible(/*DependencyObject*/ element) 
    {
        while (element != null) 
        { 
            /*Visibility*/var visibility;
            /*UIElement*/var uiElem = element instanceof UIElement ? element : null; 
//            UIElement3D uiElem3D = element as UIElement3D;

            if (uiElem != null)

            {
                visibility = uiElem.Visibility; 
            } 
//            else
//            { 
//                visibility = uiElem3D.Visibility;
//            }

            if (visibility != Visibility.Visible) 
            {
                return false; 
            } 

            element = UIElementHelper.GetUIParent(element); 
        }

        return true;
    } 

    // returns whether the given DO is enabled or not 
//    private static bool 
    function IsEnabled(/*DependencyObject*/ element) 
    {
        return (/*(bool)*/element.GetValue(UIElement.IsEnabledProperty)); 
    }
    
//    private static void 
    function PurgeDead(/*ArrayList*/ elements, /*object*/ elementToRemove)
    {
        for (var i = 0; i < elements.Count; )
        { 
            /*WeakReference*/var weakReference = /*(WeakReference)*/elements.Get(i);
            /*object*/var element = weakReference/*.Target*/; 

            if (element == null || element == elementToRemove)
            { 
                elements.RemoveAt(i);
            }
            else
            { 
                i++;
            } 
        } 
    }

    /// <summary>
    ///     Takes an ArrayList of WeakReferences, removes the dead references and returns
    ///     a generic List of IInputElements (strong references)
    /// </summary> 
//    private static List<IInputElement> 
    function CopyAndPurgeDead(/*ArrayList*/ elements)
    { 
        if (elements == null) 
        {
            return null; 
        }

        /*List<IInputElement>*/var copy = new List/*<IInputElement>*/(elements.Count);

        for (var i = 0; i < elements.Count; )
        { 
            /*WeakReference*/var weakReference = /*(WeakReference)*/elements.Get(i); 
            /*object*/var element = weakReference/*.Target*/;

            if (element == null)
            {
                elements.RemoveAt(i);
            } 
            else
            { 
//                Debug.Assert(element is IInputElement, "Element in AccessKeyManager store was not of type IInputElement"); 
                copy.Add(/*(IInputElement)*/element);
                i++; 
            }
        }

        return copy; 
    }
    
//    internal static string 
    AccessKeyManager.InternalGetAccessKeyCharacter = function(/*DependencyObject*/ d)
    { 
        return Current.GetAccessKeyCharacter(d);
    };
	
	AccessKeyManager.Type = new Type("AccessKeyManager", AccessKeyManager, [Object.Type]);
	return AccessKeyManager;
});
