/**
 * KeyboardNavigation
 */
///<summary> 
/// KeyboardNavigation class provide methods for logical (Tab) and directional (arrow) navigation between focusable controls
///</summary> 
define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty", "windows/FrameworkPropertyMetadata",
        /*"documents/Adorner",*/ "input/Key", "input/KeyboardNavigationMode", "input/TraversalRequest",
        "internal/DoubleUtil"], 
		function(declare, Type, DependencyProperty, FrameworkPropertyMetadata,
				/*Adorner,*/ Key, KeyboardNavigationMode, TraversalRequest, 
				DoubleUtil){
//    internal delegate bool EnterMenuModeEventHandler(object sender, EventArgs e); 
//    
//    // This class is used by AdornerLayer which adds it to its visual tree
//    // Once AdornerLayer and Adorner are UIElement we can remove this class and 
//    // apply FrameworkElement.FocusVisualStyle directly to AdornerLayer
//    // Note:- This class is sealed because it calls OnVisualChildrenChanged virtual in the 
//    //              constructor and it does not override it, but derived classes could. 
////    private sealed class 
//    var FocusVisualAdorner =declare(/*Adorner*/null, { 
//        constructor:function(/*UIElement*/ adornedElement, /*Style*/ focusVisualStyle){
//        	if(arguments.length ==2){
//           	   base(adornedElement);
//               var control = new Control(); 
//               control.Style = focusVisualStyle; 
//               _adorderChild = control;
//               IsClipEnabled = true; 
//               IsHitTestVisible = false;
//               IsEnabled = false;
//               AddVisualChild(_adorderChild);
//        	}else{
//        		base(adornedElementParent) 
//                _contentHostParent = contentHostParent; 
//                _adornedContentElement = adornedElement; 
//                _focusVisualStyle = focusVisualStyle;
//
//                var canvas = new Canvas();
//                _canvasChildren = canvas.Children;
//                _adorderChild = canvas;
//                AddVisualChild(_adorderChild); 
//
//                IsClipEnabled = true; 
//                IsHitTestVisible = false; 
//                IsEnabled = false;
//        	}
//        },
//
//        /// <summary>
//        /// Measure adorner. Default behavior is to size to match the adorned element.
//        /// </summary> 
////        protected override Size 
//        MeasureOverride:function(/*Size*/ constraint)
//        { 
//        	var desiredSize = new Size(); 
//
//            // If the focus visual is adorning a content element, 
//            // the child will be a canvas that doesn't need to be measured.
//            if (_adornedContentElement == null)
//            {
//                desiredSize = AdornedElement.RenderSize; 
//                constraint = desiredSize;
//            } 
//
//            // Measure the child
//            (GetVisualChild(0)).Measure(constraint); 
//
//            return desiredSize;
//       },
//
//        /// <summary>
//        ///     Default control arrangement is to only arrange 
//        ///     the first visual child. No transforms will be applied. 
//        /// </summary>
////        protected override Size 
//        ArrangeOverride:function() 
//        {
//            /*Size*/var finalSize = base.ArrangeOverride(size);
//
//            // In case we adorn ContentElement we have to update the rectangles 
//            if (_adornedContentElement != null)
//            { 
//                if (_contentRects == null) 
//                {
//                    // Clear rects 
//                    _canvasChildren.Clear();
//                }
//                else
//                { 
//                    /*IContentHost*/var contentHost = ContentHost;
//
//                    if (!(contentHost instanceof Visual) || !AdornedElement.IsAncestorOf(contentHost)) 
//                    {
//                        // Content elements is not in the tree, clear children and give up. 
//                        _canvasChildren.Clear();
//                        return new Size();
//                    }
//
//                    var desiredRect = Rect.Empty;
//
//                    /*IEnumerator<Rect>*/var enumerator = _contentRects.GetEnumerator(); 
//
//                    if (_canvasChildren.Count == _contentRects.Count) 
//                    {
//                        // Reuse the controls and update the controls position
//                        for (var i = 0; i < _canvasChildren.Count; i++)
//                        { 
//                            enumerator.MoveNext();
//                            var rect = enumerator.Current; 
//
//                            rect = _hostToAdornedElement.TransformBounds(rect);
//
//                            var control = _canvasChildren[i];
//                            control.Width = rect.Width;
//                            control.Height = rect.Height;
//                            Canvas.SetLeft(control, rect.X); 
//                            Canvas.SetTop(control, rect.Y);
//                        } 
//                        _adorderChild.InvalidateArrange(); 
//                    }
//                    else // Rebuild the visual tree to correspond to current bounding rectangles 
//                    {
//                        _canvasChildren.Clear();
//                        while (enumerator.MoveNext())
//                        { 
//                        	var rect = enumerator.Current;
//
//                            rect = _hostToAdornedElement.TransformBounds(rect); 
//
//                            var control = new Control(); 
//                            control.Style = _focusVisualStyle;
//                            control.Width = rect.Width;
//                            control.Height = rect.Height;
//                            Canvas.SetLeft(control, rect.X); 
//                            Canvas.SetTop(control, rect.Y);
//                            _canvasChildren.Add(control); 
//                        } 
//                    }
//                } 
//            }
//
//            (GetVisualChild(0)).Arrange(new Rect(new Point(), finalSize));
//
//            return finalSize;
//        }, 
//
//        /// <summary>
//        ///   Derived class must implement to support Visual children. The method must return 
//        ///    the child at the specified index. Index must be between 0 and GetVisualChildrenCount-1.
//        ///
//        ///    By default a Visual does not have any children.
//        /// 
//        ///  Remark:
//        ///       During this virtual call it is not valid to modify the Visual tree. 
//        /// </summary> 
////        protected override Visual 
//        GetVisualChild:function(/*int*/ index)
//        { 
//            if (index == 0)
//            {
//                return _adorderChild;
//            } 
//            else
//            { 
//                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
//            }
//        }, 
//
//        /// <summary> 
//        /// Says if the Adorner needs update based on the
//        /// previously cached size if the AdornedElement. 
//        /// </summary>
////        internal override bool 
//        NeedsUpdate:function(/*Size*/ oldSize)
//        {
//            if (_adornedContentElement != null) 
//            {
//                /*ReadOnlyCollection<Rect>*/var oldRects = _contentRects; 
//                _contentRects = null; 
//
//                /*IContentHost*/var contentHost = ContentHost; 
//                if (contentHost != null)
//                {
//                    _contentRects = contentHost.GetRectangles(_adornedContentElement);
//                } 
//
//                // The positions of the focus rects are dependent on the rects returned from 
//                // host.GetRectangles and the transform from the host to the adorned element 
//                var oldTransform = _hostToAdornedElement;
//
//                if (contentHost instanceof Visual && AdornedElement.IsAncestorOf(contentHost))
//                {
//                    _hostToAdornedElement = (contentHost).TransformToAncestor(AdornedElement);
//                } 
//                else
//                { 
//                    _hostToAdornedElement = Transform.Identity; 
//                }
//
//                // See if these are the same transform
//                if (oldTransform != _hostToAdornedElement)
//                {
//                    // Allow two identical matrix transforms 
//                    if (!(oldTransform instanceof MatrixTransform) ||
//                        !(_hostToAdornedElement instanceof MatrixTransform) || 
//                        !Matrix.Equals((oldTransform).Matrix, (_hostToAdornedElement).Matrix)) 
//                    {
//                        // one is a general transform or the matrices are not equal, need to update 
//                        return true;
//                    }
//                }
//
//                if (_contentRects != null && oldRects != null && _contentRects.Count == oldRects.Count)
//                { 
//                    for (var i=0; i<oldRects.Count; i++) 
//                    {
//                        if (!DoubleUtil.AreClose(oldRects[i].Size, _contentRects[i].Size)) 
//                        {
//                            return true;
//                        }
//                    } 
//
//                    return false; 
//                } 
//
//                return _contentRects != oldRects; 
//            }
//            else
//            {
//                return !DoubleUtil.AreClose(AdornedElement.RenderSize, oldSize); 
//            }
//        } 
//
//
////        GeneralTransform _hostToAdornedElement = Transform.Identity; 
////        private IContentHost _contentHostParent;
////        private ContentElement _adornedContentElement;
////        private Style _focusVisualStyle;
////        private UIElement _adorderChild; 
////        private UIElementCollection _canvasChildren;
////        private ReadOnlyCollection<Rect> _contentRects; 
//    }); 
//    
//    Object.defineProperties(FocusVisualAdorner.prototype, {
//        /// <summary>
//        ///  Derived classes override this property to enable the Visual code to enumerate 
//        ///  the Visual children. Derived classes need to return the number of children
//        ///  from this method.
//        ///
//        ///    By default a Visual does not have any children. 
//        ///
//        ///  Remark: 
//        ///      During this virtual method the Visual tree must not be modified. 
//        /// </summary>
////        protected override int 
//        VisualChildrenCount: 
//        {
//            get:function()
//            {
//                return 1; // _adorderChild created in ctor. 
//            }
//        }, 
//        
////        private IContentHost 
//        ContentHost:
//        {
//            get:function() 
//            {
//                // Re-query IContentHost if the old one was disposed 
//                if (_adornedContentElement != null && (_contentHostParent==null 
//                        || VisualTreeHelper.GetParent(_contentHostParent instanceof Visual ? _contentHostParent : null) == null)) 
//                {
//                    _contentHostParent = MS.Internal.Documents.ContentHostHelper.FindContentHost(_adornedContentElement); 
//                }
//
//                return _contentHostParent;
//            } 
//        }
//    });
    
//    private const double 
    var BASELINE_DEFAULT = Number.MinValue; 

//    private static object 
    var _fakeNull = new Object();
    
	var KeyboardNavigation = declare("KeyboardNavigation", null,{
		constructor:function(){
//            /*InputManager*/var inputManager = InputManager.Current; 

//            inputManager.PostProcessInput += new ProcessInputEventHandler(PostProcessInput);
//            inputManager.TranslateAccelerator += new KeyEventHandler(TranslateAccelerator);
            
//            private FocusVisualAdorner 
            this._focusVisualAdornerCache = null;
            
            // Used to track what the last key was pressed so that 
            // we can fire the EnterMenuMode event.
            // Will be reset to Key.None when an unmatched KeyUp or other input event happens
//            private Key 
            this._lastKeyPressed = Key.None;
     
            // List of WeakReferences to delegates to be invoked when EnterMenuMode happens
//            private WeakReferenceList 
            this._weakEnterMenuModeHandlers = null; 
            
//            private double 
            this._verticalBaseline = BASELINE_DEFAULT;
//            private double 
            this._horizontalBaseline = BASELINE_DEFAULT; 
//            private DependencyProperty 
            this._navigationProperty = null;
//            private Hashtable 
            this._containerHashtable = new Hashtable(10);
     
//            // Fix for bug 936302: (JevanSa)
//            //     The DefaultWindowProcWorker (windows/core/ntuser/kernel/dwp.c) 
//            //     listens for ALT down followed by ALT up with nothing in between.
//            //     When ALT goes down they set QF_FMENUSTATUS.  When ALT up happens,
//            //     if QF_FMENUSTATUS is still set, they open the system menu (or
//            //     menu for the window if there is one).  If any keystrokes happen 
//            //     in between, they clear QF_FMENUSTATUS.
//            // 
//            //     Consider the following sequence: 
//            //       1) KeyDown(Alt) - neither Win32 nor Avalon respond
//            //       2) KeyUp(Alt) - Avalon handles the event, Win32 is skipped 
//            //       3) KeyDown(Alt) - Avalon handles the event, Win32 is skipped
//            //       4) KeyUp(Alt) - Avalon does not respond, Win32 handles the message
//            //                       (and enters "Invisible" MenuMode)
//            // 
//            //     Here, from the point of view of the DWP, there was just ALT down
//            //     followed by ALT up.  We must fool the DWP somehow so that they 
//            //     clear clear the QF_FMENUSTATUS bit before #4. 
//            //
//            //     Currently the best way [....] and I have come up with is to 
//            //     mark the event has handled in case #4 so that the DWP
//            //     never sees the ALT up in #4.  We set this bit when #2 happens.
//            //     If we see an unhandled ALT-up and this bit is set, we mark the
//            //     event as handled.  If we see any unhandled key down or mouse up/down 
//            //     we can clear this bit.
////            private bool 
//            _win32MenuModeWorkAround = null; 
            
//            // List of WeakReferences to delegates to be invoked when EnterMenuMode happens
//            private WeakReferenceList _weakEnterMenuModeHandlers; 
//
//            private WeakReferenceList _weakFocusEnterMainFocusScopeHandlers = new WeakReferenceList();

		},
		
//        private DependencyObject 
		GetActiveElement:function(/*DependencyObject*/ d) 
        {
            return this._navigationProperty == KeyboardNavigation.ControlTabNavigationProperty ? GetControlTabOnceActiveElement(d) 
            		: KeyboardNavigation.GetTabOnceActiveElement(d); 
        }, 

//        private void 
		SetActiveElement:function(/*DependencyObject*/ d, /*DependencyObject*/ value) 
        {
            if (this._navigationProperty == KeyboardNavigation.TabNavigationProperty)
            	KeyboardNavigation.SetTabOnceActiveElement(d, value);
            else 
            	SetControlTabOnceActiveElement(d, value);
        },
        
//        internal event KeyboardFocusChangedEventHandler FocusChanged
//        {
//            AddFocusChangedEventHandler:function(value) 
//            {
//                lock (_weakFocusChangedHandlers) 
//                { 
//                    _weakFocusChangedHandlers.Add(value);
//                } 
//            },
//            RemoveFocusChangedEventHandler:function(value)
//            {
//                lock (_weakFocusChangedHandlers) 
//                {
//                    _weakFocusChangedHandlers.Remove(value); 
//                } 
//            },
//        } 
        
        AddFocusChangedEventHandler:function(value) 
        {
            _weakFocusChangedHandlers.Add(value);
        },
        RemoveFocusChangedEventHandler:function(value)
        {
            _weakFocusChangedHandlers.Remove(value); 
        },

//        internal void 
        NotifyFocusChanged:function(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e)
        {
            _weakFocusChangedHandlers.Process( 
                        /*delegate*/function(/*object*/ item)
                        { 
                            /*KeyboardFocusChangedEventHandler*/
                        	var handler = item instanceof KeyboardFocusChangedEventHandler ? item : null; 
                            if (handler != null)
                            { 
                                handler(sender, e);
                            }
                            return false;
                        } ); 
        },
 
//        internal void 
        HideFocusVisual:function()
        { 
            // Remove the existing focus visual
            if (_focusVisualAdornerCache != null)
            {
                /*AdornerLayer*/
            	var adornerlayer = VisualTreeHelper.GetParent(this._focusVisualAdornerCache);
            	adornerlayer = adornerlayer instanceof  AdornerLayer ? adornerlayer : null; 
                if (adornerlayer != null)
                { 
                    adornerlayer.Remove(this._focusVisualAdornerCache); 
                }
                this._focusVisualAdornerCache = null; 
            }
        },



//        private void 
        ShowFocusVisual:function(/*DependencyObject*/ element) 
        {
            // Always hide the existing focus visual 
        	this.HideFocusVisual(); 

            // Disable keyboard cues (accesskey underline) if keyboard device is not MostRecentInputDevice 
            if (!KeyboardNavigation.IsKeyboardMostRecentInputDevice())
            {
            	KeyboardNavigation.EnableKeyboardCues(element, false);
            } 

            // Show focus visual if system metric is true or keyboard is used last 
            if (KeyboardNavigation.AlwaysShowFocusVisual || KeyboardNavigation.IsKeyboardMostRecentInputDevice()) 
            {
 
                var fe = element instanceof FrameworkElement ? element : null;
                if (fe != null)
                {
                    var adornerlayer = AdornerLayer.GetAdornerLayer(fe); 
                    if (adornerlayer == null)
                        return; 
 
                    var fvs = fe.FocusVisualStyle;
 
                    // WORKAROUND: (Bug 1016350) If FocusVisualStyle is the "default" value
                    // then we load the default FocusVisualStyle from ResourceDictionary.
                    if (fvs == FrameworkElement.DefaultFocusVisualStyle)
                    { 
                        fvs = SystemResources.FindResourceInternal(SystemParameters.FocusVisualStyleKey);
                        fvs = fvs instanceof Style ? fvs : null;
                    } 
 
                    if (fvs != null)
                    { 
                        _focusVisualAdornerCache = new FocusVisualAdorner(fe, fvs);
                        adornerlayer.Add(_focusVisualAdornerCache);
                    }
                } 
                else // If not FrameworkElement
                { 
                    var fce = element instanceof FrameworkContentElement ? element: null; 
                    if (fce != null)
                    { 
                        /*IContentHost*/var parentICH = null;
                        var parentUIElement = GetParentUIElementFromContentElement(fce, /*ref*/ parentICH);
                        if (parentICH != null && parentUIElement != null)
                        { 
                            var adornerlayer = AdornerLayer.GetAdornerLayer(parentUIElement);
                            if (adornerlayer != null) 
                            { 
                                var fvs = fce.FocusVisualStyle;
 
                                // WORKAROUND: (Bug 1016350) If FocusVisualStyle is the "default" value
                                // then we load the default FocusVisualStyle from ResourceDictionary.
                                if (fvs == FrameworkElement.DefaultFocusVisualStyle)
                                { 
                                    fvs = SystemResources.FindResourceInternal(SystemParameters.FocusVisualStyleKey);
                                    fvs = fvs instanceof Style ? fvs : null;
                                } 
 
                                if (fvs != null)
                                { 
                                    _focusVisualAdornerCache = new FocusVisualAdorner(fce, parentUIElement, parentICH, fvs);
                                    adornerlayer.Add(_focusVisualAdornerCache);
                                }
                            } 
                        }
                    } 
                } 
            }
        }, 


//        internal static void 
        UpdateFocusedElement:function(/*DependencyObject*/ focusTarget)
        { 
            var focusScope = FocusManager.GetFocusScope(focusTarget);
            if (focusScope != null && focusScope != focusTarget)
            {
                FocusManager.SetFocusedElement(focusScope, focusTarget instanceof IInputElement ? focusTarget : null); 

                // Raise FocusEnterMainFocusScope event 
                var visualRoot = KeyboardNavigation.GetVisualRoot(focusTarget); 
                if (visualRoot != null && focusScope == visualRoot)
                { 
                    Current.NotifyFocusEnterMainFocusScope(visualRoot, EventArgs.Empty);
                }
            }
        }, 

////        internal void 
//        UpdateActiveElement:function(/*DependencyObject*/ activeElement) 
//        { 
//            // Update TabNavigation = Once groups
//            this.UpdateActiveElement(activeElement, TabNavigationProperty); 
//
//            // Update ControlTabNavigation = Once groups
//            this.UpdateActiveElement(activeElement, ControlTabNavigationProperty);
//        },
//
////        private void 
//        UpdateActiveElement:function(/*DependencyObject*/ activeElement, /*DependencyProperty*/ dp) 
//        { 
//        	this._navigationProperty = dp;
//            var container = this.GetGroupParent(activeElement); 
//            this.UpdateActiveElement(container, activeElement, dp);
//        },
//
////        internal void 
//        UpdateActiveElement:function(/*DependencyObject*/ container, /*DependencyObject*/ activeElement) 
//        {
//            // Update TabNavigation = Once groups 
//        	this.UpdateActiveElement(container, activeElement, TabNavigationProperty); 
//
//            // Update ControlTabNavigation = Once groups 
//        	this.UpdateActiveElement(container, activeElement, ControlTabNavigationProperty);
//        },
//
////        private void 
//        UpdateActiveElement:function(/*DependencyObject*/ container, /*DependencyObject*/ activeElement, /*DependencyProperty*/ dp) 
//        {
//        	this._navigationProperty = dp; 
// 
//            if (activeElement == container)
//                return; 
//
//            // Update ActiveElement only if container has TabNavigation = Once
//            if (this.GetKeyNavigationMode(container) == KeyboardNavigationMode.Once)
//            { 
//            	this.SetActiveElement(container, activeElement);
//            } 
//        }, 
        
//        private void 
        UpdateActiveElement:function(/*DependencyObject*/ container, /*DependencyObject*/ activeElement, /*DependencyProperty*/ dp) 
        {
        	if(arguments.length == 1){
                // Update TabNavigation = Once groups
                this.UpdateActiveElement(container, KeyboardNavigation.TabNavigationProperty); 

                // Update ControlTabNavigation = Once groups
                this.UpdateActiveElement(container, KeyboardNavigation.ControlTabNavigationProperty);
        		
        	}else if(arguments.length == 2){
        		if(arguments[1] instanceof DependencyProperty){
                	this._navigationProperty = arguments[1];
                    var container = this.GetGroupParent(arguments[0]); 
                    this.UpdateActiveElement(container, arguments[0], dp);
        		}else if(arguments[1] instanceof DependencyObject){
        		    // Update TabNavigation = Once groups 
                	this.UpdateActiveElement(container, activeElement, KeyboardNavigation.TabNavigationProperty); 

                    // Update ControlTabNavigation = Once groups 
                	this.UpdateActiveElement(container, activeElement, KeyboardNavigation.ControlTabNavigationProperty);
        		}
        	}else if(arguments.length == 3){
            	this._navigationProperty = dp; 
            	 
                if (activeElement == container)
                    return; 

                // Update ActiveElement only if container has TabNavigation = Once
                if (this.GetKeyNavigationMode(container) == KeyboardNavigationMode.Once)
                { 
                	this.SetActiveElement(container, activeElement);
                } 
        	}

        },

//        // Called from FrameworkElement.MoveFocus 
////        internal bool 
//        Navigate:function(/*DependencyObject*/ currentElement, /*TraversalRequest*/ request)
//        {
//            return Navigate(currentElement, request, Keyboard.Modifiers);
//        }, 
//
////        private bool 
//        Navigate:function(/*DependencyObject*/ currentElement, /*TraversalRequest*/ request, /*ModifierKeys*/ modifierKeys) 
//        { 
//            return Navigate(currentElement, request, modifierKeys, null);
//        }, 
        
////      internal bool 
//        Navigate:function(/*DependencyObject*/ sourceElement, /*Key*/ key, /*ModifierKeys*/ modifiers)
//        { 
//            var success = false; 
//
//            switch (key) 
//            {
//                // Logical (Tab) navigation
//                case Key.Tab:
//                    success = Navigate(sourceElement, 
//                        new TraversalRequest(((modifiers & ModifierKeys.Shift) == ModifierKeys.Shift) ?
//                        FocusNavigationDirection.Previous : FocusNavigationDirection.Next), modifiers); 
//                    break; 
//
//                case Key.Right: 
//                    success = Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Right), modifiers);
//                    break;
//
//                case Key.Left: 
//                    success = Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Left), modifiers);
//                    break; 
// 
//                case Key.Up:
//                    success = Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Up), modifiers); 
//                    break;
//
//                case Key.Down:
//                    success = Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Down), modifiers); 
//                    break;
// 
//            } 
//            return success;
//        }, 

//        private bool 
        Navigate:function(/*DependencyObject*/ currentElement, /*TraversalRequest*/ request, /*ModifierKeys*/ modifierKeys, /*DependencyObject*/ firstElement)
        {
        	if(arguments.length == 3){
        		if(typeof arguments[1] == "number"){
        			var key = arguments[1];
        			var sourceElement = currentElement;
                    var success = false; 

                    switch (key) 
                    {
                        // Logical (Tab) navigation
                        case Key.Tab:
                            success = this.Navigate(sourceElement, 
                                new TraversalRequest(((modifierKeys & ModifierKeys.Shift) == ModifierKeys.Shift) ?
                                FocusNavigationDirection.Previous : FocusNavigationDirection.Next), modifierKeys); 
                            break; 

                        case Key.Right: 
                            success = this.Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Right), modifierKeys);
                            break;

                        case Key.Left: 
                            success = this.Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Left), modifierKeys);
                            break; 
         
                        case Key.Up:
                            success = this.Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Up), modifierKeys); 
                            break;

                        case Key.Down:
                            success = this.Navigate(sourceElement, new TraversalRequest(FocusNavigationDirection.Down), modifierKeys); 
                            break;
         
                    } 
                    return success;
        		}
        	}
        	
        	
        	if(modifierKeys === undefined){
        		modifierKeys = Keyboard.Modifiers;
        	}
        	
           	if(firstElement === undefined){
           		firstElement = null;
        	}
        	
            /*DependencyObject*/var nextTab = null;
            /*IKeyboardInputSink*/var inputSink = null; 
 
            switch (request.FocusNavigationDirection)
            { 
                case FocusNavigationDirection.Next:
                	this._navigationProperty = (modifierKeys & ModifierKeys.Control) == ModifierKeys.Control ? KeyboardNavigation.ControlTabNavigationProperty : KeyboardNavigation.TabNavigationProperty;
                    nextTab = this.GetNextTab(currentElement, this.GetGroupParent(currentElement, true /*includeCurrent*/), false);
                    break; 

                case FocusNavigationDirection.Previous: 
                    this._navigationProperty = (modifierKeys & ModifierKeys.Control) == ModifierKeys.Control ? KeyboardNavigation.ControlTabNavigationProperty : KeyboardNavigation.TabNavigationProperty; 
                    nextTab = this.GetPrevTab(currentElement, null, false);
                    break; 

                case FocusNavigationDirection.First:
                	this._navigationProperty = (modifierKeys & ModifierKeys.Control) == ModifierKeys.Control ? KeyboardNavigation.ControlTabNavigationProperty : KeyboardNavigation.TabNavigationProperty;
                    nextTab = this.GetNextTab(null, currentElement, true); 
                    break;
 
                case FocusNavigationDirection.Last: 
                	this._navigationProperty = (modifierKeys & ModifierKeys.Control) == ModifierKeys.Control ? KeyboardNavigation.ControlTabNavigationProperty : KeyboardNavigation.TabNavigationProperty;
                    nextTab = this.GetPrevTab(null, currentElement, true); 
                    break;

                case FocusNavigationDirection.Left:
                case FocusNavigationDirection.Right: 
                case FocusNavigationDirection.Up:
                case FocusNavigationDirection.Down: 
                	this._navigationProperty = KeyboardNavigation.DirectionalNavigationProperty; 
                    nextTab = this.GetNextInDirection(currentElement, request.FocusNavigationDirection);
                    break; 
            }

            // If there are no other tabstops, try to pass focus outside PresentationSource
            if (nextTab == null) 
            {
                // If Wrapped is true we should not searach outside this container 
                if (request.Wrapped || request.FocusNavigationDirection == FocusNavigationDirection.First || request.FocusNavigationDirection == FocusNavigationDirection.Last) 
                    return false;
 
                // Try to navigate outside the PresentationSource
                var navigatedOutside = this.NavigateOutsidePresentationSource(currentElement, request);
                if (navigatedOutside)
                { 
                    return true;
                } 
                else if (request.FocusNavigationDirection == FocusNavigationDirection.Next || request.FocusNavigationDirection == FocusNavigationDirection.Previous) 
                {
                    // In case focus cannot navigate outside - we should cycle 
                    var visualRoot = KeyboardNavigation.GetVisualRoot(currentElement);
                    if (visualRoot != null)
                        return this.Navigate(visualRoot, new TraversalRequest(request.FocusNavigationDirection == FocusNavigationDirection.Next ? FocusNavigationDirection.First : FocusNavigationDirection.Last));
                } 

                return false; 
            } 

//            inputSink = nextTab instanceof IKeyboardInputSink ? nextTab : null; 
//            if (inputSink == null)
//            {
                // If target element does not support IKeyboardInputSink then we try to set focus
                // In TextBox scenario Focus() return false although the focus is set to TextBox content 
                // So we need to verify IsKeyboardFocusWithin property (bugfix 954000)
//                /*IInputElement*/var iie = nextTab instanceof IInputElement ? nextTab : null; 
            /*IInputElement*/var iie = IInputElement.Type.IsInstanceOfType(nextTab) ? nextTab : null; 
                iie.Focus(); 

                return iie.IsKeyboardFocusWithin; 
//            }
//            else
//            {
//                // If target element supports IKeyboardInputSink then we pass the focus there 
//                var traversed = false;
// 
//                if (request.FocusNavigationDirection == FocusNavigationDirection.First || request.FocusNavigationDirection == FocusNavigationDirection.Next) 
//                {
//                    traversed = inputSink.TabInto(new TraversalRequest(FocusNavigationDirection.First)); 
//                }
//                else if (request.FocusNavigationDirection == FocusNavigationDirection.Last || request.FocusNavigationDirection == FocusNavigationDirection.Previous)
//                {
//                    traversed = inputSink.TabInto(new TraversalRequest(FocusNavigationDirection.Last)); 
//                }
//                else // FocusNavigationDirection 
//                { 
//                    /*TraversalRequest*/var tr = new TraversalRequest(request.FocusNavigationDirection);
//                    tr.Wrapped = true; 
//                    traversed = inputSink.TabInto(tr);
//                }
//
//                // If we fail to navigate into IKeyboardInputSink then move to the next element 
//                if (!traversed && firstElement != nextTab)
//                { 
//                    // Navigate to next element in the tree 
//                    traversed = Navigate(nextTab, request, modifierKeys, firstElement == null ? nextTab : firstElement);
//                } 
//
//                return traversed;
//            }
        },
        
        /// <SecurityNote> 
        ///     Critical: This code accesses PresentationSource. 
        ///     TreatAsSafe: This code causes navigation to different elements within an app.
        ///     It does not expose the PresentationSource 
        ///     Critical: Asserting UnmanagedCode permission to obtain HwndSource.IKeyboardInputSink.KeyboardInputSite
        ///     TreatAsSafe: Not leaking the InputKeyboardSite obtained under elevation.
        /// </SecurityNote>
//        private bool 
        NavigateOutsidePresentationSource:function(/*DependencyObject*/ currentElement, /*TraversalRequest*/ request)
        { 
            var visual = currentElement instanceof Visual ? currentElement : null; 
            if (visual == null)
            { 
                visual = KeyboardNavigation.GetParentUIElementFromContentElement(currentElement instanceof ContentElement ? currentElement : null);
                if (visual == null)
                    return false;
            } 

            //cym comment
//            /*IKeyboardInputSink*/var inputSink = PresentationSource.CriticalFromVisual(visual);
//            inputSink = inputSink instanceof IKeyboardInputSink ? inputSink : null; 
//            if (inputSink != null) 
//            {
//                /*IKeyboardInputSite*/var ikis = null; 
//
//                new SecurityPermission(SecurityPermissionFlag.UnmanagedCode).Assert();  // BlessedAssert
//                try
//                { 
//                    ikis = inputSink.KeyboardInputSite;
//                } 
//                finally 
//                {
//                    CodeAccessPermission.RevertAssert(); 
//                }
//
//                if (ikis != null && this.ShouldNavigateOutsidePresentationSource(currentElement, request))
//                    return ikis.OnNoMoreTabStops(request); 
//            }
 
            return false; 
        },
 
//        private bool 
        ShouldNavigateOutsidePresentationSource:function(/*DependencyObject*/ currentElement, /*TraversalRequest*/ request)
        {
            // One should not navigate (directional) outside the
            // presentation source if any of the parent has 
            // Contained or Cycle navigation mode.
            if (request.FocusNavigationDirection == FocusNavigationDirection.Left || 
                request.FocusNavigationDirection == FocusNavigationDirection.Right || 
                request.FocusNavigationDirection == FocusNavigationDirection.Up ||
                request.FocusNavigationDirection == FocusNavigationDirection.Down) 
            {
                /*DependencyObject*/var parent = null;

                // The looping should stop as soon as either the GroupParent is 
                // null or is currentElement itself.
                while ((parent = this.GetGroupParent(currentElement)) != null && 
                    parent != currentElement) 
                {
                    /*KeyboardNavigationMode*/var mode = GetKeyNavigationMode(parent); 
                    if (mode == KeyboardNavigationMode.Contained || mode == KeyboardNavigationMode.Cycle)
                    {
                        return false;
                    } 
                    currentElement = parent;
                } 
            } 
            return true;
        }, 

        /////////////////////////////////////////////////////////////////////
        ///<SecurityNote>
        /// Critical: accesses e.StagingItem.Input and asserts to retrieve HwndSource
        ///</SecurityNote> 
//        private void 
        PostProcessInput:function(/*object*/ sender, /*ProcessInputEventArgs*/ e) 
        { 
            // Call Forwarded
            this.ProcessInput(e.StagingItem.Input); 
        },

        /////////////////////////////////////////////////////////////////////
        ///<SecurityNote> 
        /// Critical: asserts to retrieve HwndSource
        ///</SecurityNote> 
//        private void 
        TranslateAccelerator:function(/*object*/ sender, /*KeyEventArgs*/ e)
        { 
            // Call Forwarded
            this.ProcessInput(e);
        },
 
        /////////////////////////////////////////////////////////////////////
        ///<SecurityNote> 
        /// Critical: asserts to retrieve HwndSource 
        ///</SecurityNote>
//        private void 
        ProcessInput:function(/*InputEventArgs*/ inputEventArgs)
        {
            this.ProcessForMenuMode(inputEventArgs);
            //this.ProcessForUIState(inputEventArgs); 

            // Process keyboard navigation for keydown event for Tab,Left,Right,Up,Down keys. 
            if(inputEventArgs.RoutedEvent != Keyboard.KeyDownEvent) 
                return;
 
            /*KeyEventArgs*/var keyEventArgs = inputEventArgs;
            if (keyEventArgs.Handled)
                return;
 
            var sourceElement = keyEventArgs.OriginalSource instanceof DependencyObject ? keyEventArgs.OriginalSource : null;
 
            // For Keyboard Interop with Avalon-inside-Avalon via HwndHost. 
            // In Keyboard interop, the target (called OriginalSource here) is "forced"
            // to point at the HwndHost containing the Hwnd with focus.  This allows 
            // us to tunnel/bubble the keystroke across the outer HwndSource to the
            // child hwnd that has focus.  (see HwndSource.TranslateAccelerator)
            // But this "forced" target is wrong for Tab Navigation; eg. tabbing
            // across an inner avalon under the HwndHost.   For that we need the 
            // real original target element, which we happen to find in KeyboardDevice.Target.
            // 
            // sourceElement and innerElement I don't expect will ever be different 
            // except in this case.  And I added a check that the "forced" target
            // is an HwndHost for good measure. 
            var innerElement = keyEventArgs.KeyboardDevice.Target;
            innerElement = innerElement instanceof DependencyObject ? innerElement : null;
            if( innerElement != null && sourceElement != innerElement )
            {
//                if(sourceElement instanceof HwndHost) 
//                    sourceElement = innerElement;
            } 
 
            // When nothing has focus - we should start from the root of the visual tree
            if (sourceElement == null) 
            {

//                var hwndSource = keyEventArgs.UnsafeInputSource;
//                hwndSource = hwndSource instanceof HwndSource ? hwndSource: null;
//                if (hwndSource == null) 
//                    return;
// 
//                sourceElement = hwndSource.RootVisual; 
                if (sourceElement == null)
                    return; 
            }

            // Focus visual support
            switch (this.GetRealKey(keyEventArgs)) 
            {
//                case Key.LeftAlt: 
//                case Key.RightAlt: 
            	case Key.Alt: 
                    KeyboardNavigation.ShowFocusVisual();
                    KeyboardNavigation.EnableKeyboardCues(sourceElement, true); 
                    break;
                case Key.Tab:
                case Key.Right:
                case Key.Left: 
                case Key.Up:
                case Key.Down: 
//                	KeyboardNavigation.ShowFocusVisual(); 
                    break;
            } 

            keyEventArgs.Handled = this.Navigate(sourceElement, keyEventArgs.Key, keyEventArgs.KeyboardDevice.Modifiers);
        },

////        internal DependencyObject 
//        PredictFocusedElement:function(/*DependencyObject*/ sourceElement, /*FocusNavigationDirection*/ direction) 
//        { 
//            return PredictFocusedElement(sourceElement, direction, /*treeViewNavigation*/ false);
//        }, 

//        internal DependencyObject 
        PredictFocusedElement:function(/*DependencyObject*/ sourceElement, /*FocusNavigationDirection*/ direction, /*bool*/ treeViewNavigation)
        {
            if (sourceElement == null) 
            {
                return null; 
            }
            
            if(treeViewNavigation === undefined){
            	treeViewNavigation = false;
            }

            this._navigationProperty = KeyboardNavigation.DirectionalNavigationProperty; 
            this._verticalBaseline = BASELINE_DEFAULT;
            this._horizontalBaseline = BASELINE_DEFAULT;
            return this.GetNextInDirection(sourceElement, direction, treeViewNavigation);
        }, 

//        internal DependencyObject 
        PredictFocusedElementAtViewportEdge:function( 
            /*DependencyObject*/ sourceElement, 
            /*FocusNavigationDirection*/ direction,
            /*bool*/ treeViewNavigation, 
            /*FrameworkElement*/ viewportBoundsElement,
            /*DependencyObject*/ container)
        {
            try 
            {
                this._containerHashtable.Clear(); 
 
                return this.PredictFocusedElementAtViewportEdgeRecursive(
                    sourceElement, 
                    direction,
                    treeViewNavigation,
                    viewportBoundsElement,
                    container); 
            }
            finally 
            { 
            	this._containerHashtable.Clear();
            } 
        },

//        private DependencyObject 
        PredictFocusedElementAtViewportEdgeRecursive:function(
            /*DependencyObject*/ sourceElement, 
            /*FocusNavigationDirection*/ direction,
            /*bool*/ treeViewNavigation, 
            /*FrameworkElement*/ viewportBoundsElement, 
            /*DependencyObject*/ container)
        { 
            this._navigationProperty = KeyboardNavigation.DirectionalNavigationProperty;
            this._verticalBaseline = BASELINE_DEFAULT;
            this._horizontalBaseline = BASELINE_DEFAULT;
 
            if (container == null)
            { 
                container = this.GetGroupParent(sourceElement); 
            } 

            // If we get to the tree root, return null
            if (container == sourceElement)
                return null; 

            if (this.IsEndlessLoop(sourceElement, container)) 
                return null; 

            /*DependencyObject*/var result = this.FindElementAtViewportEdge(sourceElement, 
                viewportBoundsElement,
                container,
                direction,
                treeViewNavigation); 

            if (result != null) 
            { 
                // If the element is focusable and IsTabStop is true
                if (this.IsTabStop(result) || 
                    (treeViewNavigation && this.IsFocusableInternal(result)))
                {
                    return result;
                } 

                var groupResult = result; 
 
                // Try to find focus inside the element
                // result is not TabStop, which means it is a group 
                result = this.PredictFocusedElementAtViewportEdgeRecursive(
                    sourceElement,
                    direction,
                    treeViewNavigation, 
                    viewportBoundsElement,
                    result); 
                if (result != null) 
                {
                    return result; 
                }

                result = this.PredictFocusedElementAtViewportEdgeRecursive(
                    groupResult, 
                    direction,
                    treeViewNavigation, 
                    viewportBoundsElement, 
                    null);
            } 

            return result;
        },
 
        // Filter the visual tree and return true if: 
        // 1. visual is visible UIElement 
        // 2. visual is visible UIElement3D
        // 3. visual is IContentHost but not UIElementIsland 
        // Note: UIElementIsland is a special element that has only one child and should be excluded
//        private bool 
        IsInNavigationTree:function(/*DependencyObject*/ visual)
        {
            var uiElement = visual instanceof UIElement ? visual : null; 
            if (uiElement != null && uiElement.IsVisible)
                return true; 
 
            if (visual instanceof IContentHost && !(visual  instanceof UIElementIsland))
                return true; 

            return false; 
        }, 

//        private DependencyObject 
        GetPreviousSibling:function(/*DependencyObject*/ e) 
        {
            /*DependencyObject*/var parent = this.GetParent(e);

            // If parent is IContentHost - get next from the enumerator 
            /*IContentHost*/var ich = parent instanceof IContentHost ? parent : null;
            if (ich != null) 
            { 
                var previousElement = null;
                /*IEnumerator<IInputElement>*/var enumerator = ich.HostedElements; 
                while (enumerator.MoveNext())
                {
                    var current = enumerator.Current;
                    if (current == e) 
                        return previousElement instanceof DependencyObject ? previousElement : null;
 
                    if (current instanceof UIElement) 
                        previousElement = current;
                    else 
                    {
                        /*ContentElement*/var ce = current instanceof ContentElement ? current: null;
                        if (ce != null && this.IsTabStop(ce))
                            previousElement = current; 
                    }
                } 
                return null; 
            }
            else 
            {
                // If parent is UIElement(3D) - return visual sibling
                /*DependencyObject*/var parentAsUIElement = parent instanceof UIElement ? parent: null;
                /*DependencyObject*/var elementAsVisual = e instanceof Visual ? e : null;
 
                if (parentAsUIElement != null && elementAsVisual != null)
                { 
                    var count = VisualTreeHelper.GetChildrenCount(parentAsUIElement); 
                    var prev = null;
                    for(var i = 0; i < count; i++) 
                    {
                        var vchild = VisualTreeHelper.GetChild(parentAsUIElement, i);
                        if(vchild == elementAsVisual) break;
                        if (this.IsInNavigationTree(vchild)) 
                            prev = vchild;
                    } 
                    return prev; 
                }
            } 
            return null;
        },

//        private DependencyObject 
        GetNextSibling:function(/*DependencyObject*/ e) 
        {
            /*DependencyObject*/var parent = this.GetParent(e); 
 
            // If parent is IContentHost - get next from the enumerator
            /*IContentHost*/var ich = parent instanceof IContentHost ? parent : null; 
            if (ich != null)
            {
                /*IEnumerator<IInputElement>*/var enumerator = ich.HostedElements;
                var found = false; 
                while (enumerator.MoveNext())
                { 
                    var current = enumerator.Current; 
                    if (found)
                    { 
                        if (current instanceof UIElement)
                            return current instanceof DependencyObject ? current : null;
                        else
                        { 
                            /*ContentElement*/var ce = current instanceof ContentElement ? current : null;
                            if (ce != null && this.IsTabStop(ce)) 
                                return ce; 
                        }
                    } 
                    else if (current == e)
                    {
                        found = true;
                    } 
                }
            } 
            else 
            {
                // If parent is UIElement(3D) - return visual sibling 
                /*DependencyObject*/var parentAsUIElement = parent instanceof UIElement ? parent : null;
                /*DependencyObject*/var elementAsVisual = e instanceof Visual ? e : null; 

                if (parentAsUIElement != null && elementAsVisual != null)
                { 
                    var count = VisualTreeHelper.GetChildrenCount(parentAsUIElement);
                    var i = 0; 
                    //go till itself 
                    for(; i < count; i++)
                    { 
                        /*DependencyObject*/var vchild = VisualTreeHelper.GetChild(parentAsUIElement, i);
                        if(vchild == elementAsVisual) break;
                    }
                    i++; 
                    //search ahead
                    for(; i < count; i++) 
                    { 
                        /*DependencyObject*/var visual = VisualTreeHelper.GetChild(parentAsUIElement, i);
                        if (this.IsInNavigationTree(visual)) 
                            return visual;
                    }
                }
            } 

            return null; 
        }, 

        // For Control+Tab navigation or TabNavigation when fe is not a FocusScope: 
        // Scenarios:
        // 1. UserControl can set its FocusedElement to delegate focus when Tab navigation happens
        // 2. ToolBar or Menu (which have IsFocusScope=true) both have FocusedElement but included only in Control+Tab navigation
//        private DependencyObject 
        FocusedElement:function(/*DependencyObject*/ e) 
        {
            /*IInputElement*/var iie = e instanceof IInputElement ? e : null; 
            // Focus delegation is enabled only if keyboard focus is outside the container 
            if (iie != null && !iie.IsKeyboardFocusWithin)
            { 
                /*DependencyObject*/var focusedElement = FocusManager.GetFocusedElement(e);
                focusedElement = focusedElement instanceof DependencyObject ? focusedElement : null;
                if (focusedElement != null)
                {
                    if (this._navigationProperty == KeyboardNavigation.ControlTabNavigationProperty || !IsFocusScope(e)) 
                    {
                        // Verify if focusedElement is a visual descendant of e 
                        var visualFocusedElement = focusedElement instanceof Visual ? focusedElement : null; 
                        if (visualFocusedElement == null)
                        { 
//                            Visual3D visual3DFocusedElement = focusedElement as Visual3D;
//                            if (visual3DFocusedElement == null)
//                            {
//                                visualFocusedElement = GetParentUIElementFromContentElement(focusedElement as ContentElement); 
//                            }
//                            else 
//                            { 
//                                if (visual3DFocusedElement != e && visual3DFocusedElement.IsDescendantOf(e))
//                                { 
//                                    return focusedElement;
//                                }
//                            }
                        } 
                        if (visualFocusedElement != null && visualFocusedElement != e && visualFocusedElement.IsDescendantOf(e))
                        { 
                            return focusedElement; 
                        }
                    } 
                }
            }

            return null; 
        },
 
        // We traverse only UIElement(3D) or ContentElement 
//        private DependencyObject 
        GetFirstChild:function(/*DependencyObject*/ e)
        { 
            // If the element has a FocusedElement it should be its first child
            /*DependencyObject*/var focusedElement = this.FocusedElement(e);
            if (focusedElement != null)
                return focusedElement; 

            // If the element is IContentHost - return the first child 
            /*IContentHost*/var ich = e instanceof IContentHost ? e : null; 
            if (ich != null)
            { 
                /*IEnumerator<IInputElement>*/var enumerator = ich.HostedElements;
                while (enumerator.MoveNext())
                {
                    var current = enumerator.Current; 
                    if (current instanceof UIElement /*|| current instanceof UIElement3D*/)
                    { 
                        return current instanceof DependencyObject ? current : null; 
                    }
                    else 
                    {
                        /*ContentElement*/var ce = current instanceof ContentElement ? current : null;
                        if (ce != null && this.IsTabStop(ce))
                            return ce; 
                    }
                } 
                return null; 
            }
 
            // Return the first visible UIElement(3D) or IContentHost
            /*DependencyObject*/var uiElement = e instanceof UIElement ? e : null;
            if (uiElement == null)
            { 
                uiElement = e instanceof UIElement3D ? e : null;
            } 
 
            if (uiElement == null ||
                UIElementHelper.IsVisible(uiElement)) 
            {
                /*DependencyObject*/var elementAsVisual = e instanceof Visual ? e : null;
/*                if (elementAsVisual == null)
                { 
                    elementAsVisual = e as Visual3D;
                } 
*/ 
                if (elementAsVisual != null)
                { 
                    var count = VisualTreeHelper.GetChildrenCount(elementAsVisual);
                    for (var i = 0; i < count; i++)
                    {
                        /*DependencyObject*/var visual = VisualTreeHelper.GetChild(elementAsVisual, i); 
                        if (this.IsInNavigationTree(visual))
                            return visual; 
                        else 
                        {
                            /*DependencyObject*/var firstChild = this.GetFirstChild(visual); 
                            if (firstChild != null)
                                return firstChild;
                        }
                    } 
                }
            } 
 
            // If element is ContentElement for example
            return null; 
        },

//        private DependencyObject 
        GetLastChild:function(/*DependencyObject*/ e)
        { 
            // If the element has a FocusedElement it should be its last child
            /*DependencyObject*/var focusedElement = this.FocusedElement(e); 
            if (focusedElement != null) 
                return focusedElement;
 
            // If the element is IContentHost - return the last child
            /*IContentHost*/var ich = e instanceof  IContentHost ? e : null;
            if (ich != null)
            { 
                /*IEnumerator<IInputElement>*/var enumerator = ich.HostedElements;
                /*IInputElement*/var last = null; 
                while (enumerator.MoveNext()) 
                {
                    /*IInputElement*/var current = enumerator.Current; 
                    if (current instanceof UIElement /*|| current instanceof UIElement3D*/)
                        last = current;
                    else
                    { 
                        /*ContentElement*/var ce = current instanceof ContentElement ? current : null;
                        if (ce != null && this.IsTabStop(ce)) 
                            last = current; 
                    }
                } 
                return last instanceof DependencyObject ? last : null;
            }

            // Return the last visible UIElement(3D) or IContentHost 
            /*DependencyObject*/var uiElement = e instanceof UIElement ? e : null;
//            if (uiElement == null) 
//            { 
//                uiElement = e as UIElement3D;
//            } 

            if (uiElement == null || UIElementHelper.IsVisible(uiElement))
            {
                /*DependencyObject*/var elementAsVisual = e instanceof Visual ? e : null; 
//                if (elementAsVisual == null)
//                { 
//                    elementAsVisual = e as Visual3D; 
//                }
 
                if (elementAsVisual != null)
                {
                    var count = VisualTreeHelper.GetChildrenCount(elementAsVisual);
                    for (var i = count - 1; i >= 0; i--) 
                    {
                        /*DependencyObject*/var visual = VisualTreeHelper.GetChild(elementAsVisual, i); 
                        if (this.IsInNavigationTree(visual)) 
                            return visual;
                        else 
                        {
                            /*DependencyObject*/var lastChild = this.GetLastChild(visual);
                            if (lastChild != null)
                                return lastChild; 
                        }
                    } 
                } 
            }
 
            return null;
        },

//        private DependencyObject 
        GetParent:function(/*DependencyObject*/ e) 
        {
            // For Visual - go up the visual parent chain until we find Visual, Visual3D or IContentHost 
            if (e instanceof Visual /*|| e instanceof Visual3D*/) 
            {
                /*DependencyObject*/var visual = e; 

                while ((visual = VisualTreeHelper.GetParent(visual)) != null)
                {
                    // 
                    if (this.IsInNavigationTree(visual)) 
                        return visual;
                } 
            }
            else
            {
                // For ContentElement - return the host element (which is IContentHost) 
                /*ContentElement*/var contentElement = e instanceof ContentElement ? e : null;
                if (contentElement != null) 
                { 
                    var r = /*MS.Internal.Documents.*/ContentHostHelper.FindContentHost(contentElement);
                    return r = r instanceof DependencyObject ? r : null;
                } 
            }

            return null;
        }, 

        /***************************************************************************\ 
        * 
        * GetNextInTree(DependencyObject e, DependencyObject container)
        * Search the subtree with container root; Don't go inside TabGroups 
        *
        * Return the next Element in tree in depth order (self-child-sibling).
        *            1
        *           / \ 
        *          2   5
        *         / \ 
        *        3   4 
        *
        \***************************************************************************/ 
//        private DependencyObject 
        GetNextInTree:function(/*DependencyObject*/ e, /*DependencyObject*/ container)
        {
//            Debug.Assert(e != null, "e should not be null");
//            Debug.Assert(container != null, "container should not be null"); 

            /*DependencyObject*/var result = null; 
 
            if (e == container || !this.IsGroup(e))
                result = this.GetFirstChild(e); 

            if (result != null || e == container)
                return result;
 
            /*DependencyObject*/var parent = e;
            do 
            { 
                /*DependencyObject*/var sibling = this.GetNextSibling(parent);
                if (sibling != null) 
                    return sibling;

                parent = this.GetParent(parent);
            } while (parent != null && parent != container); 

            return null; 
        }, 

 
        /***************************************************************************\
        *
        * GetPreviousInTree(DependencyObject e, DependencyObject container)
        * Don't go inside TabGroups 
        * Return the previous Element in tree in depth order (self-child-sibling).
        *            5 
        *           / \ 
        *          4   1
        *         / \ 
        *        3   2
        \***************************************************************************/
//        private DependencyObject 
        GetPreviousInTree:function(/*DependencyObject*/ e, /*DependencyObject*/ container)
        { 
            if (e == container)
                return null; 
 
            /*DependencyObject*/var result = this.GetPreviousSibling(e);
 
            if (result != null)
            {
                if (this.IsGroup(result))
                    return result; 
                else
                    return this.GetLastInTree(result); 
            } 
            else
                return this.GetParent(e); 
        },

        // Find the last element in the subtree
//        private DependencyObject 
        GetLastInTree:function(/*DependencyObject*/ container) 
        {
            /*DependencyObject*/var result; 
            do 
            {
                result = container; 
                container = this.GetLastChild(container);
            } while (container != null && !this.IsGroup(container));

            if (container != null) 
                return container;
 
            return result; 
        },
 
////        private DependencyObject 
//        GetGroupParent:function(/*DependencyObject*/ e)
//        {
//            return GetGroupParent(e, false /*includeCurrent*/);
//        }, 

        // Go up thru the parent chain until we find TabNavigation != Continue 
        // In case all parents are Continue then return the root 
//        private DependencyObject
        GetGroupParent:function(/*DependencyObject*/ e, /*bool*/ includeCurrent)
        { 
        	if(includeCurrent === undefined){
        		includeCurrent = false;
        	}
//            Debug.Assert(e != null, "e cannot be null");

            /*DependencyObject*/var result = e; // Keep the last non null element
 
            // If we don't want to include the current element,
            // start at the parent of the element.  If the element 
            // is the root, then just return it as the group parent. 
            if (!includeCurrent)
            { 
                result = e;
                e = this.GetParent(e);
                if (e == null)
                { 
                    return result;
                } 
            } 

            while (e != null) 
            {
                if (this.IsGroup(e))
                    return e;
 
                result = e;
                e = this.GetParent(e); 
            } 

            return result; 
        },
 
//        private bool 
        IsTabStop:function(/*DependencyObject*/ e) 
        {
            /*FrameworkElement*/var fe = e instanceof FrameworkElement ? e : null; 
            if (fe != null){
                return (fe.Focusable
                && fe.GetValue(KeyboardNavigation.IsTabStopProperty) 
                && fe.IsEnabled
                && fe.IsVisible); 
            }
 
            /*FrameworkContentElement*/var fce = e instanceof FrameworkContentElement ? e : null;
            return fce != null && fce.Focusable && fce.GetValue(KeyboardNavigation.IsTabStopProperty) && fce.IsEnabled; 
        },

//        private bool 
        IsGroup:function(/*DependencyObject*/ e)
        { 
            return this.GetKeyNavigationMode(e) != KeyboardNavigationMode.Continue;
        }, 
 
//        internal bool 
        IsFocusableInternal:function(/*DependencyObject*/ element)
        { 
            var uie = element instanceof UIElement ? element : null;
            if (uie != null)
            {
                return (uie.Focusable && uie.IsEnabled && uie.IsVisible); 
            }
 
            /*ContentElement*/var ce = element instanceof ContentElement ? element : null; 
            if (ce != null)
            { 
                return (ce != null && ce.Focusable && ce.IsEnabled);
            }

            return false; 
        },
 
//        private KeyboardNavigationMode 
        GetKeyNavigationMode:function(/*DependencyObject*/ e) 
        {
            return e.GetValue(this._navigationProperty); 
        },

//        private bool 
        IsTabStopOrGroup:function(/*DependencyObject*/ e)
        { 
        	var r = this.IsTabStop(e), r2 = this.IsGroup(e);
        	return r || r2;
//            return this.IsTabStop(e) || this.IsGroup(e);
        }, 


        // Find the element with highest priority (lowest index) inside the group 
//        internal DependencyObject 
        GetFirstTabInGroup:function(/*DependencyObject*/ container) 
        {
            /*DependencyObject*/var firstTabElement = null; 
            var minIndexFirstTab = Number.MIN_INT;

            /*DependencyObject*/var currElement = container;
            while ((currElement = this.GetNextInTree(currElement, container)) != null) 
            {
                if (this.IsTabStopOrGroup(currElement)) 
                { 
                    var currPriority = GetTabIndexHelper(currElement);
 
                    if (currPriority < minIndexFirstTab || firstTabElement == null)
                    {
                        minIndexFirstTab = currPriority;
                        firstTabElement = currElement; 
                    }
                } 
            } 
            return firstTabElement;
        }, 

        // Find the element with the same TabIndex after the current element
//        private DependencyObject 
        GetNextTabWithSameIndex:function(/*DependencyObject*/ e, /*DependencyObject*/ container)
        { 
            var elementTabPriority = GetTabIndexHelper(e);
            /*DependencyObject*/var currElement = e; 
            while ((currElement = this.GetNextInTree(currElement, container)) != null) 
            {
                if (this.IsTabStopOrGroup(currElement) && GetTabIndexHelper(currElement) == elementTabPriority) 
                {
                    return currElement;
                }
            } 

            return null; 
        }, 

        // Find the element with the next TabIndex after the current element 
//        private DependencyObject 
        GetNextTabWithNextIndex:function(/*DependencyObject*/ e, /*DependencyObject*/ container, /*KeyboardNavigationMode*/ tabbingType)
        {
            // Find the next min index in the tree
            // min (index>currentTabIndex) 
        	/*DependencyObject*/var nextTabElement = null;
        	/*DependencyObject*/var firstTabElement = null; 
            var minIndexFirstTab = Number.MIN_INT; 
            var minIndex = Number.MIN_INT;
            var elementTabPriority = GetTabIndexHelper(e); 

            /*DependencyObject*/var currElement = container;
            while ((currElement = this.GetNextInTree(currElement, container)) != null)
            { 

                if (this.IsTabStopOrGroup(currElement)) 
                { 
                	var currPriority = GetTabIndexHelper(currElement);
                    if (currPriority > elementTabPriority) 
                    {
                        if (currPriority < minIndex || nextTabElement == null)
                        {
                            minIndex = currPriority; 
                            nextTabElement = currElement;
                        } 
                    } 

                    if (currPriority < minIndexFirstTab || firstTabElement == null) 
                    {
                        minIndexFirstTab = currPriority;
                        firstTabElement = currElement;
                    } 
                }
            } 
 
            // Cycle groups: if not found - return first element
            if (tabbingType == KeyboardNavigationMode.Cycle && nextTabElement == null) 
                nextTabElement = firstTabElement;

            return nextTabElement;
        }, 

//        private DependencyObject 
        GetNextTabInGroup:function(/*DependencyObject*/ e, /*DependencyObject*/ container, /*KeyboardNavigationMode*/ tabbingType) 
        { 
            // None groups: Tab navigation is not supported
            if (tabbingType == KeyboardNavigationMode.None) 
                return null;

            // e == null or e == container -> return the first TabStopOrGroup
            if (e == null || e == container) 
            {
                return this.GetFirstTabInGroup(container); 
            } 

            if (tabbingType == KeyboardNavigationMode.Once) 
                return null;

            /*DependencyObject*/var nextTabElement = this.GetNextTabWithSameIndex(e, container);
            if (nextTabElement != null) 
                return nextTabElement;
 
            return this.GetNextTabWithNextIndex(e, container, tabbingType); 
        },
 
//        private DependencyObject 
        GetNextTab:function(/*DependencyObject*/ e, /*DependencyObject*/ container, /*bool*/ goDownOnly)
        {
//            Debug.Assert(container != null, "container should not be null");
 
            var tabbingType = this.GetKeyNavigationMode(container);
 
            if (e == null) 
            {
                if (this.IsTabStop(container)) 
                    return container;

                // Using ActiveElement if set
                /*DependencyObject*/var activeElement = this.GetActiveElement(container); 
                if (activeElement != null)
                    return this.GetNextTab(null, activeElement, true); 
            } 
            else
            { 
                if (tabbingType == KeyboardNavigationMode.Once || tabbingType == KeyboardNavigationMode.None)
                {
                    if (container != e)
                    { 
                        if (goDownOnly)
                            return null; 
                        var parentContainer = this.GetGroupParent(container); 
                        return this.GetNextTab(container, parentContainer, goDownOnly);
                    } 
                }
            }

            // All groups 
            /*DependencyObject*/var loopStartElement = null;
            /*DependencyObject*/var nextTabElement = e; 
            /*KeyboardNavigationMode*/var currentTabbingType = tabbingType; 

            // Search down inside the container 
            while ((nextTabElement = this.GetNextTabInGroup(nextTabElement, container, currentTabbingType)) != null)
            {
//                Debug.Assert(IsTabStopOrGroup(nextTabElement), "nextTabElement should be IsTabStop or group");
 
                // Avoid the endless loop here for Cycle groups
                if (loopStartElement == nextTabElement) 
                    break; 
                if (loopStartElement == null)
                    loopStartElement = nextTabElement; 

                /*DependencyObject*/var firstTabElementInside = this.GetNextTab(null, nextTabElement, true);
                if (firstTabElementInside != null)
                    return firstTabElementInside; 

                // If we want to continue searching inside the Once groups, we should change the navigation mode 
                if (currentTabbingType == KeyboardNavigationMode.Once) 
                    currentTabbingType = KeyboardNavigationMode.Contained;
            } 

            // If there is no next element in the group (nextTabElement == null)

            // Search up in the tree if allowed 
            //
            if (!goDownOnly && currentTabbingType != KeyboardNavigationMode.Contained && this.GetParent(container) != null) 
            { 
                return this.GetNextTab(container, this.GetGroupParent(container), false);
            } 

            return null;
        },

//        internal DependencyObject 
        GetLastTabInGroup:function(/*DependencyObject*/ container) 
        {
        	/*DependencyObject*/var lastTabElement = null;
            var maxIndexFirstTab = Number.MAX_INT;
            /*DependencyObject*/var currElement = this.GetLastInTree(container); 
            while (currElement != null && currElement != container)
            { 
                if (this.IsTabStopOrGroup(currElement)) 
                {
                    var currPriority = GetTabIndexHelper(currElement); 

                    if (currPriority > maxIndexFirstTab || lastTabElement == null)
                    {
                        maxIndexFirstTab = currPriority; 
                        lastTabElement = currElement;
                    } 
                } 
                currElement = this.GetPreviousInTree(currElement, container);
            } 
            return lastTabElement;
        },

        // Look for element with the same TabIndex before the current element 
//        private DependencyObject 
        GetPrevTabWithSameIndex:function(/*DependencyObject*/ e, /*DependencyObject*/ container)
        { 
            var elementTabPriority = GetTabIndexHelper(e); 
            /*DependencyObject*/var currElement = this.GetPreviousInTree(e, container);
            while (currElement != null) 
            {
                if (this.IsTabStopOrGroup(currElement) && GetTabIndexHelper(currElement) == elementTabPriority && currElement != container)
                {
                    return currElement; 
                }
                currElement = this.GetPreviousInTree(currElement, container); 
            } 
            return null;
        }, 

//        private DependencyObject 
        GetPrevTabWithPrevIndex:function(/*DependencyObject*/ e, /*DependencyObject*/ container, /*KeyboardNavigationMode*/ tabbingType)
        {
            // Find the next max index in the tree 
            // max (index<currentTabIndex)
        	/*DependencyObject*/var lastTabElement = null; 
            /*DependencyObject*/var nextTabElement = null; 
            var elementTabPriority = GetTabIndexHelper(e);
            var maxIndexFirstTab = Number.MAX_INT; 
            var maxIndex = Number.MAX_INT;
            /*DependencyObject*/var currElement = this.GetLastInTree(container);
            while (currElement != null)
            { 
                if (this.IsTabStopOrGroup(currElement) && currElement != container)
                { 
                    var currPriority = GetTabIndexHelper(currElement); 
                    if (currPriority < elementTabPriority)
                    { 
                        if (currPriority > maxIndex || nextTabElement == null)
                        {
                            maxIndex = currPriority;
                            nextTabElement = currElement; 
                        }
                    } 
 
                    if (currPriority > maxIndexFirstTab || lastTabElement == null)
                    { 
                        maxIndexFirstTab = currPriority;
                        lastTabElement = currElement;
                    }
                } 

                currElement = this.GetPreviousInTree(currElement, container); 
            } 

            // Cycle groups: if not found - return first element 
            if (tabbingType == KeyboardNavigationMode.Cycle && nextTabElement == null)
                nextTabElement = lastTabElement;

            return nextTabElement; 
        },
 
//        private DependencyObject 
        GetPrevTabInGroup:function(/*DependencyObject*/ e, /*DependencyObject*/ container, /*KeyboardNavigationMode*/ tabbingType) 
        {
            // None groups: Tab navigation is not supported 
            if (tabbingType == KeyboardNavigationMode.None)
                return null;

            // Search the last index inside the group 
            if (e==null)
            { 
                return this.GetLastTabInGroup(container); 
            }
 
            if (tabbingType == KeyboardNavigationMode.Once)
                return null;

            if (e == container) 
                return null;
 
            var nextTabElement = this.GetPrevTabWithSameIndex(e, container); 
            if (nextTabElement != null)
                return nextTabElement; 

            return this.GetPrevTabWithPrevIndex(e, container, tabbingType);
        },
 
//        private DependencyObject 
        GetPrevTab:function(/*DependencyObject*/ e, /*DependencyObject*/ container, /*bool*/ goDownOnly)
        { 
//            Debug.Assert(e != null || container != null, "e or container should not be null"); 

            if (container == null) 
                container = this.GetGroupParent(e);

            /*KeyboardNavigationMode*/var tabbingType = this.GetKeyNavigationMode(container);
 
            if (e == null)
            { 
                // Using ActiveElement if set 
            	/*DependencyObject*/var activeElement = this.GetActiveElement(container);
                if (activeElement != null) 
                    return this.GetPrevTab(null, activeElement, true);
                else
                {
                    // If we Shift+Tab on a container with KeyboardNavigationMode=Once, and ActiveElement is null 
                    // then we want to go to the fist item (not last) within the container
                    if (tabbingType == KeyboardNavigationMode.Once) 
                    { 
                    	/*DependencyObject*/var firstTabElement = this.GetNextTabInGroup(null, container, tabbingType);
                        if (firstTabElement == null) 
                        {
                            if (this.IsTabStop(container))
                                return container;
                            if (goDownOnly) 
                                return null;
 
                            return this.GetPrevTab(container, null, false); 
                        }
                        else 
                        {
                            return this.GetPrevTab(null, firstTabElement, true);
                        }
                    } 
                }
            } 
            else 
            {
                if (tabbingType == KeyboardNavigationMode.Once || tabbingType == KeyboardNavigationMode.None) 
                {
                    if (goDownOnly || container==e)
                        return null;
 
                    // FocusedElement should not be e otherwise we will delegate focus to the same element
                    if (this.IsTabStop(container)) 
                        return container; 

                    return this.GetPrevTab(container, null, false); 
                }
            }

            // All groups (except Once) - continue 
            /*DependencyObject*/var loopStartElement = null;
            /*DependencyObject*/var nextTabElement = e; 
 
            // Look for element with the same TabIndex before the current element
            while ((nextTabElement = this.GetPrevTabInGroup(nextTabElement, container, tabbingType)) != null) 
            {
                if (nextTabElement == container && tabbingType == KeyboardNavigationMode.Local)
                    break;
 
                // At this point nextTabElement is TabStop or TabGroup
                // In case it is a TabStop only return the element 
                if (this.IsTabStop(nextTabElement) && !this.IsGroup(nextTabElement)) 
                    return nextTabElement;
 
                // Avoid the endless loop here
                if (loopStartElement == nextTabElement)
                    break;
                if (loopStartElement == null) 
                    loopStartElement = nextTabElement;
 
                // At this point nextTabElement is TabGroup 
                var lastTabElementInside = this.GetPrevTab(null, nextTabElement, true);
                if (lastTabElementInside != null) 
                    return lastTabElementInside;
            }

            if (tabbingType == KeyboardNavigationMode.Contained) 
                return null;
 
            if (e != container && this.IsTabStop(container)) 
                return container;
 
            // If end of the subtree is reached or there no other elements above
            if (!goDownOnly && this.GetParent(container) != null)
            {
                return this.GetPrevTab(container, null, false); 
            }
 
            return null; 
        },
        
//        // distance between two points
////        private double 
//        GetDistance:function(/*Point*/ p1, /*Point*/ p2)
//        {
//            var deltaX = p1.X - p2.X; 
//            var deltaY = p1.Y - p2.Y;
//            return Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
//        },
        
        // Example when moving down:
        // distance between sourceRect.TopLeft (or Y=vertical baseline) 
        // and targetRect.TopLeft
//        private double 
        GetDistance:function(/*Rect*/ sourceRect, /*Rect*/ targetRect, /*FocusNavigationDirection*/ direction) 
        { 
        	if(arguments.length == 2){
        		var p1= sourceRect, p2 = targetRect;
        		var deltaX = p1.X - p2.X; 
                var deltaY = p1.Y - p2.Y;
                return Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
        	}
        	
            var startPoint;
            var endPoint; 
            switch (direction)
            {
                case FocusNavigationDirection.Right :
                    startPoint = sourceRect.TopLeft; 
                    if (this._horizontalBaseline != BASELINE_DEFAULT)
                        startPoint.Y = _horizontalBaseline; 
                    endPoint = targetRect.TopLeft; 
                    break;
 
                case FocusNavigationDirection.Left :
                    startPoint = sourceRect.TopRight;
                    if (this._horizontalBaseline != BASELINE_DEFAULT)
                        startPoint.Y = _horizontalBaseline; 
                    endPoint = targetRect.TopRight;
                    break; 
 
                case FocusNavigationDirection.Up :
                    startPoint = sourceRect.BottomLeft; 
                    if (this._verticalBaseline != BASELINE_DEFAULT)
                        startPoint.X = _verticalBaseline;
                    endPoint = targetRect.BottomLeft;
                    break; 

                case FocusNavigationDirection.Down : 
                    startPoint = sourceRect.TopLeft; 
                    if (this._verticalBaseline != BASELINE_DEFAULT)
                        startPoint.X = _verticalBaseline; 
                    endPoint = targetRect.TopLeft;
                    break;

                default : 
                    throw new System.ComponentModel.InvalidEnumArgumentException("direction", direction, typeof(FocusNavigationDirection));
            } 
            return GetDistance(startPoint, endPoint); 
        },

//        private double 
        GetPerpDistance:function(/*Rect*/ sourceRect, /*Rect*/ targetRect, /*FocusNavigationDirection*/ direction) 
        {
            switch (direction)
            {
                case FocusNavigationDirection.Right : 
                    return targetRect.Left - sourceRect.Left;
 
                case FocusNavigationDirection.Left : 
                    return sourceRect.Right - targetRect.Right;
 
                case FocusNavigationDirection.Up :
                    return sourceRect.Bottom - targetRect.Bottom;

                case FocusNavigationDirection.Down : 
                    return targetRect.Top - sourceRect.Top;
 
                default : 
                    throw new System.ComponentModel.InvalidEnumArgumentException("direction", direction, typeof(FocusNavigationDirection));
            } 
        },

        // Example when moving down:
        // true if the top of the toRect is below the bottom of fromRect
//        private bool 
        IsInDirection:function(/*Rect*/ fromRect, /*Rect*/ toRect, /*FocusNavigationDirection*/ direction)
        { 
            switch (direction)
            { 
                case FocusNavigationDirection.Right: 
                    return DoubleUtil.LessThanOrClose(fromRect.Right, toRect.Left);
                case FocusNavigationDirection.Left: 
                    return DoubleUtil.GreaterThanOrClose(fromRect.Left, toRect.Right);
                case FocusNavigationDirection.Up :
                    return DoubleUtil.GreaterThanOrClose(fromRect.Top, toRect.Bottom);
                case FocusNavigationDirection.Down : 
                    return DoubleUtil.LessThanOrClose(fromRect.Bottom, toRect.Top);
                default: 
                    throw new System.ComponentModel.InvalidEnumArgumentException("direction", direction, typeof(FocusNavigationDirection)); 
            }
        }, 

        // The element is focus scope if IsFocusScope is true or it is the visual tree root
//        private bool 
        IsFocusScope:function(/*DependencyObject*/ e)
        { 
            return FocusManager.GetIsFocusScope(e) || this.GetParent(e) == null;
        }, 
 
//        private bool 
        IsAncestorOf:function(/*DependencyObject*/ sourceElement, /*DependencyObject*/ targetElement)
        { 
            /*Visual*/var sourceVisual = sourceElement instanceof Visual ? sourceElement : null;
            /*Visual*/var targetVisual = targetElement instanceof Visual ? targetElement : null;
            if (sourceVisual == null || targetVisual == null)
                return false; 

            return sourceVisual.IsAncestorOf(targetVisual); 
        }, 

        // this is like the previous method, except it works when targetElement is 
        // a ContentElement (e.g. Hyperlink).  "Works" means it gives results consistent
        // with the tree navigation methods GetParent, Get*Child, Get*Sibling.
        // [It might be correct to have only one method - this one - but we need
        // to keep the existing calls to the previous method around for compat.] 
//        internal bool
        IsAncestorOfEx:function(/*DependencyObject*/ sourceElement, /*DependencyObject*/ targetElement)
        { 
//            Debug.Assert(sourceElement != null, "sourceElement must not be null"); 

            while (targetElement != null && targetElement != sourceElement) 
            {
                targetElement = this.GetParent(targetElement);
            }
 
            return (targetElement == sourceElement);
        }, 
 
        // Example: When moving down:
        // Range is the sourceRect width extended to the vertical baseline 
        // targetRect.Top > sourceRect.Top (target is below the source)
        // targetRect.Right > sourceRect.Left || targetRect.Left < sourceRect.Right
//        private bool 
        IsInRange:function(/*DependencyObject*/ sourceElement, /*DependencyObject*/ targetElement, 
        		/*Rect*/ sourceRect, /*Rect*/ targetRect, /*FocusNavigationDirection*/ direction, /*double*/ startRange, /*double*/ endRange)
        { 
            switch (direction)
            { 
                case FocusNavigationDirection.Right : 
                case FocusNavigationDirection.Left :
                    if (this._horizontalBaseline != BASELINE_DEFAULT) 
                    {
                        startRange = Math.min(startRange, this._horizontalBaseline);
                        endRange = Math.max(endRange, this._horizontalBaseline);
                    } 

                    if (DoubleUtil.GreaterThan(targetRect.Bottom, startRange) && DoubleUtil.LessThan(targetRect.Top, endRange)) 
                    { 
                        // If there is no sourceElement - checking the range is enough
                        if (sourceElement == null) 
                            return true;

                        if (direction == FocusNavigationDirection.Right)
                            return DoubleUtil.GreaterThan(targetRect.Left, sourceRect.Left) || (DoubleUtil.AreClose(targetRect.Left, sourceRect.Left) && IsAncestorOf(sourceElement, targetElement)); 
                        else
                            return DoubleUtil.LessThan(targetRect.Right, sourceRect.Right) || (DoubleUtil.AreClose(targetRect.Right, sourceRect.Right) && IsAncestorOf(sourceElement, targetElement)); 
 
                    }
                    break; 

                case FocusNavigationDirection.Up :
                case FocusNavigationDirection.Down :
                    if (this._verticalBaseline != BASELINE_DEFAULT) 
                    {
                        startRange = Math.min(startRange, this._verticalBaseline); 
                        endRange = Math.max(endRange, this._verticalBaseline); 
                    }
 
                    if (DoubleUtil.GreaterThan(targetRect.Right, startRange) && DoubleUtil.LessThan(targetRect.Left, endRange))
                    {
                        // If there is no sourceElement - checking the range is enough
                        if (sourceElement == null) 
                            return true;
 
                        if (direction == FocusNavigationDirection.Down) 
                            return DoubleUtil.GreaterThan(targetRect.Top, sourceRect.Top) || (DoubleUtil.AreClose (targetRect.Top, sourceRect.Top) && IsAncestorOf(sourceElement, targetElement));
                        else 
                            return DoubleUtil.LessThan(targetRect.Bottom, sourceRect.Bottom) || (DoubleUtil.AreClose(targetRect.Bottom, sourceRect.Bottom) && IsAncestorOf(sourceElement, targetElement));
                    }
                    break;
 
                default :
                    throw new System.ComponentModel.InvalidEnumArgumentException("direction", direction, typeof(FocusNavigationDirection)); 
            } 

            return false; 
        },

//        private DependencyObject 
        GetNextInDirection:function(/*DependencyObject*/ sourceElement, /*FocusNavigationDirection*/ direction)
        { 
            return this.GetNextInDirection(sourceElement, direction, /*treeViewNavigation*/ false);
        },
 
//        private DependencyObject 
        GetNextInDirection:function(/*DependencyObject*/ sourceElement, /*FocusNavigationDirection*/ direction, /*bool*/ treeViewNavigation)
        { 
        	this._containerHashtable.Clear();
            /*DependencyObject*/var targetElement = this.MoveNext(sourceElement, null, direction, BASELINE_DEFAULT, BASELINE_DEFAULT, treeViewNavigation);

            if (targetElement != null) 
            {
                var sourceUIElement = sourceElement instanceof UIElement ? sourceElement : null; 
                if (sourceUIElement != null) 
                    sourceUIElement.RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(this, this._LostFocus));
                else 
                {
                    var sourceContentElement = sourceElement instanceof ContentElement ? sourceElement : null;
                    if (sourceContentElement != null)
                        sourceContentElement.RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(this, this._LostFocus)); 
                }
 
                var targetUIElement = targetElement instanceof UIElement ? targetElement : null; 
                if (targetUIElement == null)
                    targetUIElement = KeyboardNavigation.GetParentUIElementFromContentElement(targetElement instanceof ContentElement ? targetElement : null); 
                else
                {
                    var targetContentElement = targetElement instanceof ContentElement ? targetElement : null;
                    if (targetContentElement != null) 
                    {
                        // When Focus is changed we need to reset the base line 
                        targetContentElement.AddHandler(Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(this, this._LostFocus), true); 
                    }
                } 

                if (targetUIElement != null)
                {
                    // When layout is changed we need to reset the base line 
                    // Set up a layout invalidation listener.
                    targetUIElement.LayoutUpdated.Combine(new EventHandler(this, this.OnLayoutUpdated)); 
 
                    // When Focus is changed we need to reset the base line
                    if (targetElement == targetUIElement) 
                        targetUIElement.AddHandler(Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(this, this._LostFocus), true);
                }

            } 

            this._containerHashtable.Clear(); 
            return targetElement; 
        },
 
        // LayoutUpdated handler.
//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e)
        {
            var uiElement = sender instanceof UIElement ? sender : null; 
            // Disconnect the layout listener.
            if (uiElement != null) 
            { 
                uiElement.LayoutUpdated.Remove(new EventHandler(this, this.OnLayoutUpdated));
            } 

            this._verticalBaseline = BASELINE_DEFAULT;
            this._horizontalBaseline = BASELINE_DEFAULT;
        }, 

//        private void 
        _LostFocus:function(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e) 
        { 
        	this._verticalBaseline = BASELINE_DEFAULT;
        	this._horizontalBaseline = BASELINE_DEFAULT; 

            if (sender instanceof UIElement)
            	sender.RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(this, this._LostFocus));
            else if (sender instanceof ContentElement) 
            	sender.RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(this, this._LostFocus));
        }, 
 
//        private bool 
        IsEndlessLoop:function(/*DependencyObject*/ element, /*DependencyObject*/ container)
        { 
            var elementObject = element != null ? element : _fakeNull;

            // If entry exists then we have endless loop
            /*Hashtable*/
            var elementTable = this._containerHashtable.Get(container);
            elementTable = elementTable instanceof Hashtable ? elementTable : null; 
            if (elementTable != null)
            { 
                if (elementTable.Get(elementObject) != null) 
                    return true;
            } 
            else
            {
                // Adding the entry to the collection
                elementTable = new Hashtable(10); 
                this._containerHashtable.Set(container, elementTable);
            } 
 
            elementTable.Set(elementObject, true);
            return false; 
        },

//        private void 
        ResetBaseLines:function(/*double*/ value, /*bool*/ horizontalDirection)
        { 
            if (horizontalDirection)
            { 
            	this._verticalBaseline = BASELINE_DEFAULT; 
                if (this._horizontalBaseline == BASELINE_DEFAULT)
                	this._horizontalBaseline = value; 
            }
            else // vertical direction
            {
            	this._horizontalBaseline = BASELINE_DEFAULT; 
                if (this._verticalBaseline == BASELINE_DEFAULT)
                	this._verticalBaseline = value; 
            } 
        },
 
//        private DependencyObject 
        FindNextInDirection:function(/*DependencyObject*/ sourceElement,
            /*Rect*/ sourceRect,
            /*DependencyObject*/ container,
            /*FocusNavigationDirection*/ direction, 
            /*double*/ startRange,
            /*double*/ endRange, 
            /*bool*/ treeViewNavigation) 
        {
            /*DependencyObject*/var result = null; 
            var resultRect = Rect.Empty;
            var resultScore = 0;
            var searchInsideContainer = sourceElement == null;
            /*DependencyObject*/var currElement = container; 
            while ((currElement = this.GetNextInTree(currElement, container)) != null)
            { 
                if (currElement != sourceElement && 
                    (this.IsTabStopOrGroup(currElement) ||
                    (treeViewNavigation && this.IsFocusableInternal(currElement)))) 
                {
                	/*DependencyObject*/var currentRectElement = currElement;
                    if (treeViewNavigation)
                    { 
                        currentRectElement = ItemsControl.TryGetTreeViewItemHeader(currElement);
                    } 
                    var currentRect = KeyboardNavigation.GetRectangle(currentRectElement); 

                    // Consider the current element as a result candidate only if its layout is valid. 
                    if (currentRect != Rect.Empty)
                    {
                    	var isInDirection = this.IsInDirection(sourceRect, currentRect, direction);
                    	var isInRange = this.IsInRange(sourceElement, currElement, sourceRect, currentRect, direction, startRange, endRange); 
                        if (searchInsideContainer || isInDirection || isInRange)
                        { 
                        	var score = isInRange ? this.GetPerpDistance(sourceRect, currentRect, direction) : GetDistance(sourceRect, currentRect, direction); 

                            if (Number.IsNaN(score)) 
                            {
                                continue;
                            }
                            // Keep the first element in the result 
                            if (result == null)
                            { 
                                result = currElement; 
                                resultRect = currentRect;
                                resultScore = score; 
                            }
                            else if (DoubleUtil.LessThan(score, resultScore) || (DoubleUtil.AreClose(score, resultScore) && GetDistance(sourceRect, resultRect, direction) > GetDistance(sourceRect, currentRect, direction)))
                            {
                                result = currElement; 
                                resultRect = currentRect;
                                resultScore = score; 
                            } 
                        }
                    } 
                }
            }

            return result; 
        },
 
//        private DependencyObject 
        MoveNext:function(/*DependencyObject*/ sourceElement, 
            /*DependencyObject*/ container,
            /*FocusNavigationDirection*/ direction, 
            /*double*/ startRange,
            /*double*/ endRange,
            /*bool*/ treeViewNavigation)
        { 
//            Debug.Assert(!(sourceElement == null && container == null), "Both sourceElement and container cannot be null");
 
            if (container == null) 
            {
                container = this.GetGroupParent(sourceElement); 
//                Debug.Assert(container != null, "container cannot be null");
            }

            // If we get to the tree root, return null 
            if (container == sourceElement)
                return null; 
 
            if (this.IsEndlessLoop(sourceElement, container))
                return null; 

            /*KeyboardNavigationMode*/var mode = this.GetKeyNavigationMode(container);
            var searchInsideContainer = (sourceElement == null);
 
            // Don't navigate inside None containers
            if (mode == KeyboardNavigationMode.None && searchInsideContainer) 
                return null; 

            var sourceRect = KeyboardNavigation.GetRectangle(searchInsideContainer ? container 
                                            : treeViewNavigation ? ItemsControl.TryGetTreeViewItemHeader(sourceElement)
                                            : sourceElement);
            var horizontalDirection = direction == FocusNavigationDirection.Right || direction == FocusNavigationDirection.Left;
 
            // Reset the baseline when we change the direction
            this.ResetBaseLines(horizontalDirection ? sourceRect.Top : sourceRect.Left, horizontalDirection); 
 
            // If range is not set - use source rect
            if (startRange == BASELINE_DEFAULT || endRange == BASELINE_DEFAULT) 
            {
                startRange = horizontalDirection ? sourceRect.Top : sourceRect.Left;
                endRange = horizontalDirection ? sourceRect.Bottom : sourceRect.Right;
            } 

            // Navigate outside the container 
            if (mode == KeyboardNavigationMode.Once && !searchInsideContainer) 
                return this.MoveNext(container, null, direction, startRange, endRange, treeViewNavigation);
 
            /*DependencyObject*/var result = this.FindNextInDirection(sourceElement, sourceRect, container, direction, startRange, endRange, treeViewNavigation);

            // If there is no next element in current container
            if (result == null) 
            {
                switch (mode) 
                { 
                    case KeyboardNavigationMode.Cycle:
                        return this.MoveNext(null, container, direction, startRange, endRange, treeViewNavigation); 

                    case KeyboardNavigationMode.Contained:
                        return null;
 
                    default: // Continue, Once, None, Local - search outside the container
                        return this.MoveNext(container, null, direction, startRange, endRange, treeViewNavigation); 
                } 
            }
 
            // If the element is focusable and IsTabStop is true
            if (this.IsTabStop(result) ||
                (treeViewNavigation && this.IsFocusableInternal(result)))
                return result; 

            // Using ActiveElement if set 
            /*DependencyObject*/var activeElement = this.GetActiveElementChain(result, treeViewNavigation); 
            if (activeElement != null)
                return activeElement; 

            // Try to find focus inside the element
            // result is not TabStop, which means it is a group
            /*DependencyObject*/var insideElement = this.MoveNext(null, result, direction, startRange, endRange, treeViewNavigation); 
            if (insideElement != null)
                return insideElement; 
 
            return this.MoveNext(result, null, direction, startRange, endRange, treeViewNavigation);
        }, 

//        private DependencyObject 
        GetActiveElementChain:function(/*DependencyObject*/ element, /*bool*/ treeViewNavigation)
        {
        	/*DependencyObject*/var validActiveElement = null; 
        	/*DependencyObject*/var activeElement = element;
            while ((activeElement = this.GetActiveElement(activeElement)) != null) 
            { 
                if (this.IsTabStop(activeElement) ||
                    (treeViewNavigation && this.IsFocusableInternal(activeElement))) 
                    validActiveElement = activeElement;
            }

            return validActiveElement; 
        },
 
//        private DependencyObject 
        FindElementAtViewportEdge:function(
            /*DependencyObject*/ sourceElement,
            /*FrameworkElement*/ viewportBoundsElement, 
            /*DependencyObject*/ container,
            /*FocusNavigationDirection*/ direction, 
            /*bool*/ treeViewNavigation) 
        {
        	var sourceRect = new Rect(0, 0, 0, 0); 
            if (sourceElement != null)
            {
                // Find sourceElement's position wrt viewport.
                /*ElementViewportPosition*/var sourceElementPosition = ItemsControl.GetElementViewportPosition(viewportBoundsElement, 
                    ItemsControl.TryGetTreeViewItemHeader(sourceElement) instanceof UIElement ? ItemsControl.TryGetTreeViewItemHeader(sourceElement) : null,
                    direction, 
                    false /*fullyVisible*/, 
                    /*out sourceRect*/sourceRectOut);
                if (sourceElementPosition == ElementViewportPosition.None) 
                {
                    sourceRect = new Rect(0, 0, 0, 0);
                }
            } 

            /*DependencyObject*/var result = null; 
            var resultDirectionScore = double.NegativeInfinity; 
            var resultRangeScore = double.NegativeInfinity;
 
            /*DependencyObject*/var partialResult = null;
            var partialResultDirectionScore = double.NegativeInfinity;
            var partialResultRangeScore = double.NegativeInfinity;
 
            /*DependencyObject*/var currElement = container;
            while ((currElement = this.GetNextInTree(currElement, container)) != null) 
            { 
                if (this.IsTabStopOrGroup(currElement) ||
                    (treeViewNavigation && this.IsFocusableInternal(currElement))) 
                {
                	/*DependencyObject*/var currentRectElement = currElement;
                    if (treeViewNavigation)
                    { 
                        currentRectElement = ItemsControl.TryGetTreeViewItemHeader(currElement);
                    } 
 
                    var currentRectOut = {"currentRect" : null};
                    var currentViewportPosition = ItemsControl.GetElementViewportPosition( 
                        viewportBoundsElement,
                        currentRectElement instanceof UIElement ? currentRectElement : null,
                        direction,
                        false /*fullyVisible*/, 
                        /*out currentRect*/currentRectOut);
                    var currentRect = currentRectOut.currentRect;
 
                    // Compute directionScore of the current element. Higher the 
                    // directionScore more suitable the element is.
                    if (currentViewportPosition == ElementViewportPosition.CompletelyInViewport || 
                        currentViewportPosition == ElementViewportPosition.PartiallyInViewport)
                    {
                    	var directionScore = double.NegativeInfinity;
                        switch (direction) 
                        {
                            case FocusNavigationDirection.Up: 
                                directionScore = -currentRect.Top; 
                                break;
                            case FocusNavigationDirection.Down: 
                                directionScore = currentRect.Bottom;
                                break;
                            case FocusNavigationDirection.Left:
                                directionScore = -currentRect.Left; 
                                break;
                            case FocusNavigationDirection.Right: 
                                directionScore = currentRect.Right; 
                                break;
                        } 

                        // Compute the rangeScore of the current element with respect to
                        // the starting element. When directionScores of two elements match,
                        // rangeScore is used to resolve the conflict. The one with higher 
                        // rangeScore gets chosen.
                        var rangeScore = double.NegativeInfinity; 
                        switch (direction) 
                        {
                            case FocusNavigationDirection.Up: 
                            case FocusNavigationDirection.Down:
                                rangeScore = this.ComputeRangeScore(sourceRect.Left, sourceRect.Right, currentRect.Left, currentRect.Right);
                                break;
                            case FocusNavigationDirection.Left: 
                            case FocusNavigationDirection.Right:
                                rangeScore = this.ComputeRangeScore(sourceRect.Top, sourceRect.Bottom, currentRect.Top, currentRect.Bottom); 
                                break; 
                        }
 
                        if (currentViewportPosition == ElementViewportPosition.CompletelyInViewport)
                        {
                            if (result == null ||
                                DoubleUtil.GreaterThan(directionScore, resultDirectionScore) || 
                                (DoubleUtil.AreClose(directionScore, resultDirectionScore) && DoubleUtil.GreaterThan(rangeScore, resultRangeScore)))
                            { 
                                result = currElement; 
                                resultDirectionScore = directionScore;
                                resultRangeScore = rangeScore; 
                            }
                        }
                        else // currentViewportPosition == ElementViewportPosition.PartiallyInViewport
                        { 
                            if (partialResult == null ||
                                DoubleUtil.GreaterThan(directionScore, partialResultDirectionScore) || 
                                (DoubleUtil.AreClose(directionScore, partialResultDirectionScore) && DoubleUtil.GreaterThan(rangeScore, partialResultRangeScore))) 
                            {
                                partialResult = currElement; 
                                partialResultDirectionScore = directionScore;
                                partialResultRangeScore = rangeScore;
                            }
                        } 
                    }
                } 
            } 
            return result != null ? result : partialResult;
        }, 

        /// <summary>
        /// Computes RangeScore which reflects the closeness of two
        /// position ranges. 
        /// </summary>
//        private double 
        ComputeRangeScore:function(/*double*/ rangeStart1, 
            /*double*/ rangeEnd1, 
            /*double*/ rangeStart2,
            /*double*/ rangeEnd2) 
        {
//            Debug.Assert(DoubleUtil.GreaterThanOrClose(rangeEnd1, rangeStart1));
//            Debug.Assert(DoubleUtil.GreaterThanOrClose(rangeEnd2, rangeStart2));
 
            // Ensure that rangeStart1 <= rangeStart2
            if (DoubleUtil.GreaterThan(rangeStart1, rangeStart2)) 
            { 
            	var tempValue = rangeStart1;
                rangeStart1 = rangeStart2; 
                rangeStart2 = tempValue;
                tempValue = rangeEnd1;
                rangeEnd1 = rangeEnd2;
                rangeEnd2 = tempValue; 
            }
 
            if (DoubleUtil.LessThan(rangeEnd1, rangeEnd2)) 
            {
                // Computes rangeScore for scenarios where range1 
                // does not completely include range2 in itself.
                // This includes cases where the candidate range is
                // partially or totally outside the source range.
                return (rangeEnd1 - rangeStart2); 
            }
            else 
            { 
                // Computes rangesScore for scenarios where range1
                // completely includes range2 in itself. 
                // This includes cases where either the candidate range is
                // completely within the source range or the source range
                // is completely within the candidate range.
                return (rangeEnd2 - rangeStart2); 
            }
        } ,
 
        // ISSUE: how do we deal with deactivate?
 
        /////////////////////////////////////////////////////////////////////
        ///<SecurityNote> 
        /// Critical: accesses e.StagingItem.Input 
        ///</SecurityNote>
//        private void 
        ProcessForMenuMode:function(/*InputEventArgs*/ inputEventArgs)
        {
            // When ALT or F10 key up happens we should fire the EnterMenuMode event.
            // We should not fire if: 
            // * there were any handled input events in between the key down and corresponding key up.
            // * another unmatched keydown or keyup happened 
            // * an unhandled mouse down/up happens 

            if (inputEventArgs.RoutedEvent == Keyboard.LostKeyboardFocusEvent) 
            {
                /*KeyboardFocusChangedEventArgs*/
            	var args = inputEventArgs instanceof KeyboardFocusChangedEventArgs ? inputEventArgs: null;
                if (((args != null) && (args.NewFocus == null)) || inputEventArgs.Handled)
                { 
                    // Focus went to null, stop tracking the last key down
                	this._lastKeyPressed = Key.None; 
                } 
            }
            // If a key is pressed down, remember it until the corresponding 
            // key up.  Ignore repeated keydowns.
            else if (inputEventArgs.RoutedEvent == Keyboard.KeyDownEvent)
            {
                if (inputEventArgs.Handled) 
                	this._lastKeyPressed = Key.None;
                else 
                { 
                    var keyEventArgs = inputEventArgs instanceof KeyEventArgs ? inputEventArgs : null;
 
                    if (!keyEventArgs.IsRepeat)
                    {
                        if (this._lastKeyPressed == Key.None)
                        { 
                            if ((Keyboard.Modifiers & (ModifierKeys.Control | ModifierKeys.Shift | ModifierKeys.Windows)) == ModifierKeys.None)
                            { 
                            	this._lastKeyPressed = this.GetRealKey(keyEventArgs); 
                            }
                        } 
                        else
                        {
                            // Another key was pressed down in between the one that we're tracking, so reset.
                        	this._lastKeyPressed = Key.None; 
                        }
 
                        // Clear this bit, Win32 will see message and clear QF_FMENUSTATUS. 
                        this._win32MenuModeWorkAround = false;
                    } 
                }
            }
            // If a key up is received and matches the last key down
            // and is a key that would cause us to enter menumode, 
            // raise the (internal) EnterMenuMode event.
            else if (inputEventArgs.RoutedEvent == Keyboard.KeyUpEvent) 
            { 
                if (!inputEventArgs.Handled)
                { 
                    /*KeyEventArgs*/var keyEventArgs = inputEventArgs instanceof KeyEventArgs ? inputEventArgs : null;
                    var realKey = this.GetRealKey(keyEventArgs);

                    if (realKey == _lastKeyPressed && IsMenuKey(realKey)) 
                    {
                    	KeyboardNavigation.EnableKeyboardCues(keyEventArgs.Source instanceof DependencyObject ? keyEventArgs.Source : null, true); 
                        keyEventArgs.Handled = OnEnterMenuMode(keyEventArgs.Source); 
                    }
 
                    if (this._win32MenuModeWorkAround)
                    {
                        if (IsMenuKey(realKey))
                        { 
                        	this._win32MenuModeWorkAround = false;
 
                            // Mark the event args as handled so that Win32 never 
                            // sees this key up and doesn't enter menu-mode.
                            keyEventArgs.Handled = true; 
                        }
                    }
                    // If someone was listening for MenuMode and did something,
                    // we need to make sure we don't let Win32 enter menu mode. 
                    else if (keyEventArgs.Handled)
                    { 
                        // Set this bit to true, this means that we will handle 
                        // the next ALT-up if no one else does.
                    	this._win32MenuModeWorkAround = true; 
                    }
                }
                // No matter what we should reset and not track the last key anymore.
                this._lastKeyPressed = Key.None; 
            }
            // The following input events act to "cancel" the EnterMenuMode event 
            else if (inputEventArgs.RoutedEvent == Mouse.MouseDownEvent 
                  || inputEventArgs.RoutedEvent == Mouse.MouseUpEvent)
            { 
            	this._lastKeyPressed = Key.None;

                // Win32 will see this message and will set QF_FMENUSTATUS to false.
            	this._win32MenuModeWorkAround = false; 
            }
        }, 
 
//        private bool 
        IsMenuKey:function(/*Key*/ key)
        { 
            return (key == Key.LeftAlt || key == Key.RightAlt || key == Key.F10);
        },

//        private Key 
        GetRealKey:function(/*KeyEventArgs*/ e) 
        {
            return (e.Key == Key.System) ? e.SystemKey : e.Key; 
        }, 

        /// <SecurityNote> 
        ///   SecurityCritical:This code gets  PresentationSource and passes it to event handlers
        ///   TreatAsSafe: This code is safe inspite of passing the object because of 3 reasons
        ///                        1. We have a demand on adding the event handler so that no one external can attach
        ///                        2. The one event handler that we are aware of does not expose the object 
        ///                        3. This code in the worst case will cause your app to go to menu mode
        /// </SecurityNote> 
//        private bool 
        OnEnterMenuMode:function(/*object*/ eventSource)
        { 
            if (_weakEnterMenuModeHandlers == null)
                return false;

//            lock (_weakEnterMenuModeHandlers) 
//            {
                if (_weakEnterMenuModeHandlers.Count == 0) 
                { 
                    return false;
                } 

                // Bug 940610: no way to get PresentationSource of event in PostProcessInput
                // WORKAROUND: For now I will try to get the source of the event with
                //             PresentationSource.FromVisual.  If that fails, try to get the 
                //             source of the active window.
                /*PresentationSource*/var source = null; 
 
                if (eventSource != null)
                { 
                    var eventSourceVisual = eventSource instanceof Visual ? eventSource : null;
                    source = (eventSourceVisual != null) ? PresentationSource.CriticalFromVisual(eventSourceVisual) : null;
                }
                else 
                {
                    // If Keyboard.FocusedElement is null we'll have to fall back here. 
                    var activeWindow = MS.Win32.UnsafeNativeMethods.GetActiveWindow(); 

                    if (activeWindow != IntPtr.Zero) 
                    {
                        source = HwndSource.CriticalFromHwnd(activeWindow);
                    }
                } 

                // Can't fire the event if the event didn't happen in any source 
                if (source == null) 
                {
                    return false; 
                }

                var e = EventArgs.Empty;
                var handled = false; 

                _weakEnterMenuModeHandlers.Process( 
                            /*delegate*/function(/*object*/ obj) 
                            {
                                /*EnterMenuModeEventHandler*/
                            	var currentHandler = obj instanceof EnterMenuModeEventHandler ? obj : null; 

                                if (currentHandler != null)
                                {
                                    if (currentHandler(source, e)) 
                                    {
                                        handled = true; 
                                    } 
                                }
 
                                return handled;
                            });

                return handled; 
//            }
        }, 
 
        /// <summary>
        ///     Called when ALT or F10 is pressed anywhere in the global scope 
        /// </summary>
        /// <SecurityNote>
        ///     Critical: This code causes the handler attached to get an object of type presentationsource
        ///                  The add is critical, the remove is ok 
        ///     TreatAsSafe: There is a demand on this
        /// </SecurityNote> 
//        internal event EnterMenuModeEventHandler EnterMenuMode 
//        {
//			AddEnterMenuModeHandler:function(value)
//            {
//                SecurityHelper.DemandUIWindowPermission();
// 
//                if (_weakEnterMenuModeHandlers == null)
//                    _weakEnterMenuModeHandlers = new WeakReferenceList(); 
// 
//                lock (_weakEnterMenuModeHandlers)
//                { 
//                    _weakEnterMenuModeHandlers.Add(value);
//                }
//            },
//            RemoveMenuModeHandler:function(value) 
//            {
//                if (_weakEnterMenuModeHandlers != null) 
//                { 
//                    lock (_weakEnterMenuModeHandlers)
//                    { 
//                        _weakEnterMenuModeHandlers.Remove(value);
//                    }
//                }
//            }, 
//        }
        
        AddEnterMenuModeHandler:function(value)
        {
            SecurityHelper.DemandUIWindowPermission();

            if (_weakEnterMenuModeHandlers == null)
                _weakEnterMenuModeHandlers = new WeakReferenceList(); 

//            lock (_weakEnterMenuModeHandlers)
//            { 
                _weakEnterMenuModeHandlers.Add(value);
//            }
        },
        RemoveMenuModeHandler:function(value) 
        {
            if (_weakEnterMenuModeHandlers != null) 
            { 
//                lock (_weakEnterMenuModeHandlers)
//                { 
                    _weakEnterMenuModeHandlers.Remove(value);
//                }
            }
        },
 
        /// <SecurityNote>
        ///     Critical: accesses the RawUIStateInputReport 
        /// </SecurityNote>
//        private void 
        ProcessForUIState:function(/*InputEventArgs*/ inputEventArgs) 
        {
            var source; 
            var report = this.ExtractRawUIStateInputReport(inputEventArgs, InputManager.InputReportEvent);

            if (report != null && (source = report.InputSource) != null)
            { 
                // handle accelerator cue display
                if ((report.Targets & RawUIStateTargets.HideAccelerators) != 0) 
                { 
                    var root = source.RootVisual;
                    var enable = (report.Action == RawUIStateActions.Clear); 

                    KeyboardNavigation.EnableKeyboardCues(root, enable);
                }
            } 
        },
 
        /// <SecurityNote> 
        ///     Critical: accesses the RawUIStateInputReport
        /// </SecurityNote> 
//        private RawUIStateInputReport 
        ExtractRawUIStateInputReport:function(/*InputEventArgs*/ e, /*RoutedEvent*/ Event)
        {
        	var uiStateInputReport = null; 
        	var input = e instanceof InputReportEventArgs ? e : null;
 
            if (input != null) 
            {
                if (input.Report.Type == InputType.Keyboard && input.RoutedEvent == Event) 
                {
                    uiStateInputReport = input.Report instanceof RawUIStateInputReport ? input.Report : null;
                }
            } 

            return uiStateInputReport; 
        },


        // The event is raised when KeyboardFocus enters the main focus scope (visual tree root) 
        // Selector and TreeView listen for this event to update their ActiveSelection property
//        internal event EventHandler FocusEnterMainFocusScope 
//        { 
//            AddFocusEnterMainFocusScopeHandler:function(value)
//            { 
//                lock (_weakFocusEnterMainFocusScopeHandlers)
//                {
//                    _weakFocusEnterMainFocusScopeHandlers.Add(value);
//                } 
//            },
//            RemoveFocusEnterMainFocusScopeHandler:function(value) 
//            { 
//                lock (_weakFocusEnterMainFocusScopeHandlers)
//                { 
//                    _weakFocusEnterMainFocusScopeHandlers.Remove(value);
//                }
//            },
//        } 
        
        AddFocusEnterMainFocusScopeHandler:function(value)
        { 
//            lock (_weakFocusEnterMainFocusScopeHandlers)
//            {
                _weakFocusEnterMainFocusScopeHandlers.Add(value);
//            } 
        },
        RemoveFocusEnterMainFocusScopeHandler:function(value) 
        { 
//            lock (_weakFocusEnterMainFocusScopeHandlers)
//            { 
                _weakFocusEnterMainFocusScopeHandlers.Remove(value);
//            }
        },

//        private void 
        NotifyFocusEnterMainFocusScope:function(/*object*/ sender, /*EventArgs*/ e) 
        { 
            _weakFocusEnterMainFocusScopeHandlers.Process(
                        /*delegate*/function(/*object*/ item) 
                        {
                            /*EventHandler*/var handler = item instanceof EventHandler ? item : null;
                            if (handler != null)
                            { 
                                handler(sender, e);
                            } 
                            return false; 
                        } );
        } 
	});
	
//  private static bool 
	_alwaysShowFocusVisual = SystemParameters.KeyboardCues; 
	
	Object.defineProperties(KeyboardNavigation,{
        /// <summary>
        ///     The DependencyProperty for the TabIndex property. 
        ///     Flags:              Can be used in style rules 
        ///     Default Value:      Int32.MaxValue
        /// </summary> 
//        public static readonly DependencyProperty 
        TabIndexProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._TabIndexProperty === undefined)
        		{
        			KeyboardNavigation._TabIndexProperty =
                        DependencyProperty.RegisterAttached(
                                "TabIndex",
                                Number.Type, 
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(Number.MAX_INT)*/
                                FrameworkPropertyMetadata.BuildWithDV(Number.MAX_INT)); 
        		}
        		
        		return KeyboardNavigation._TabIndexProperty;
        	}
        },
 
        /// <summary>
        ///     The DependencyProperty for the IsTabStop property. 
        ///     Flags:              Can be used in style rules
        ///     Default Value:      true
        /// </summary>
//        public static readonly DependencyProperty 
        IsTabStopProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._IsTabStopProperty === undefined)
        		{
        			KeyboardNavigation._IsTabStopProperty = 
                        DependencyProperty.RegisterAttached(
                                "IsTabStop", 
                                Boolean.Type, 
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(true)*/
                                FrameworkPropertyMetadata.BuildWithDV(true));  
        		}
        		
        		return KeyboardNavigation._IsTabStopProperty;
        	}
        },
        
//        private static readonly DependencyProperty 
        TabOnceActiveElementProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._TabOnceActiveElementProperty === undefined)
        		{
        			KeyboardNavigation._TabOnceActiveElementProperty = DependencyProperty.RegisterAttached("TabOnceActiveElement", 
        					Object.Type,  //typeof(WeakReference)
        					KeyboardNavigation.Type); 
        		}
        		
        		return KeyboardNavigation._TabOnceActiveElementProperty;
        	}
        },
        
        
        // This internal property is used by GetRectagle method to deflate the bounding box of the element
        // If we expose this in the future - make sure it works with ContentElements too 
//        internal static readonly DependencyProperty 
        DirectionalNavigationMarginProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._DirectionalNavigationMarginProperty === undefined)
        		{
        			KeyboardNavigation._DirectionalNavigationMarginProperty = 
                        DependencyProperty.RegisterAttached("DirectionalNavigationMargin",
                        		Thickness.Type, 
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(new Thickness())*/
                                FrameworkPropertyMetadata.BuildWithDV(new Thickness())); 
        		}
        		
        		return KeyboardNavigation._DirectionalNavigationMarginProperty;
        	}
        }, 

        /// <summary>
        /// Controls the behavior of logical navigation on the children of the element this property is set on. 
        /// TabNavigation is invoked with the TAB key.
        /// </summary> 
//        public static readonly DependencyProperty 
        TabNavigationProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._TabNavigationProperty === undefined)  
        		{
        			KeyboardNavigation._TabNavigationProperty =
                        DependencyProperty.RegisterAttached(
                                "TabNavigation",
                                Number.Type, 
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(KeyboardNavigationMode.Continue)*/
                                FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Continue), 
                                new ValidateValueCallback(null, IsValidKeyNavigationMode)); 
        		}
        		
        		return KeyboardNavigation._TabNavigationProperty;
        	}
        }, 

        /// <summary> 
        /// Controls the behavior of logical navigation on the children of the element this property is set on.
        /// ControlTabNavigation is invoked with the CTRL+TAB key.
        /// </summary>
//        public static readonly DependencyProperty 
        ControlTabNavigationProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._ControlTabNavigationProperty === undefined)
        		{
        			KeyboardNavigation._ControlTabNavigationProperty = 
                        DependencyProperty.RegisterAttached(
                                "ControlTabNavigation", 
                                Number.Type,
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(KeyboardNavigationMode.Continue)*/
                                FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Continue),
                                new ValidateValueCallback(null, IsValidKeyNavigationMode)); 
        		}
        		
        		return KeyboardNavigation._ControlTabNavigationProperty;
        	}
        }, 

        /// <summary> 
        /// Controls the behavior of directional navigation on the children of the element this property is set on. 
        /// Directional navigation is invoked with the arrow keys.
        /// </summary> 
//        public static readonly DependencyProperty 
        DirectionalNavigationProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._DirectionalNavigationProperty === undefined)
        		{
        			KeyboardNavigation._DirectionalNavigationProperty  = 
                        DependencyProperty.RegisterAttached(
                                "DirectionalNavigation", 
                                Number.Type, 
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(KeyboardNavigationMode.Continue)*/
                                FrameworkPropertyMetadata.BuildWithDV(KeyboardNavigationMode.Continue), 
                                new ValidateValueCallback(null, IsValidKeyNavigationMode));
        		}
        		
        		return KeyboardNavigation._DirectionalNavigationProperty;
        	}
        },

        /// <summary>
        /// Attached property set on elements registered with AccessKeyManager when AccessKeyCues should be shown. 
        /// </summary>
//        internal static readonly DependencyProperty 
        ShowKeyboardCuesProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._ShowKeyboardCuesProperty === undefined)
        		{
        			KeyboardNavigation._ShowKeyboardCuesProperty = 
                        DependencyProperty.RegisterAttached( 
                                "ShowKeyboardCues",
                                Boolean.Type, 
                                KeyboardNavigation.Type,
                                /*new FrameworkPropertyMetadata(
                                        false,
                                        FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior, 
                                        null  No PropertyChangedCallback ,
                                        new CoerceValueCallback(null, CoerceShowKeyboardCues))*/
                                FrameworkPropertyMetadata.Build4(
                                        false,
                                        FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior, 
                                        null  /*No PropertyChangedCallback*/ ,
                                        new CoerceValueCallback(null, CoerceShowKeyboardCues))); 
        		}
        		
        		return KeyboardNavigation._ShowKeyboardCuesProperty;
        	}
        }, 
        
        /// <summary> 
        /// Indicates if VK_Return character is accepted by a control
        /// 
        /// Default: false.
        /// </summary>
//        public static readonly DependencyProperty 
        AcceptsReturnProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._AcceptsReturnProperty === undefined)
        		{
        			KeyboardNavigation._AcceptsReturnProperty  =
                        DependencyProperty.RegisterAttached( 
                                "AcceptsReturn",
                                Boolean.Type, 
                                KeyboardNavigation.Type, 
                                /*new FrameworkPropertyMetadata(false)*/
                                FrameworkPropertyMetadata.BuildWithDV(false));
        		}
        		
        		return KeyboardNavigation._AcceptsReturnProperty;
        	}
        },
        
//        internal static readonly DependencyProperty 
        ControlTabOnceActiveElementProperty:
        {
        	get:function(){
        		if(KeyboardNavigation._ControlTabOnceActiveElementProperty === undefined)
        		{
        			KeyboardNavigation._ControlTabOnceActiveElementProperty = DependencyProperty.RegisterAttached("ControlTabOnceActiveElement",
        					Object.Type, //typeof(WeakReference)
        					KeyboardNavigation.Type);
        		}
        		
        		return KeyboardNavigation._ControlTabOnceActiveElementProperty;
        	}
        },
        
//      internal static 
//        KeyboardNavigation 
        Current:
        {
        	get:function(){
        		return FrameworkElement.KeyboardNavigation; 
        	}
        },
        
//        internal static bool 
        AlwaysShowFocusVisual: 
        {
            get:function() 
            { 
                return KeyboardNavigation._alwaysShowFocusVisual;
            }, 
            set:function(value)
            {
            	KeyboardNavigation._alwaysShowFocusVisual = value;
            } 
        }
	});
	
//	 internal static DependencyObject 
	KeyboardNavigation.GetTabOnceActiveElement = function(/*DependencyObject*/ d) 
	{ 
//         var weakRef = d.GetValue(TabOnceActiveElementProperty);
//         if (weakRef != null && weakRef.IsAlive) 
//         {
//             var activeElement = weakRef.Target instanceof DependencyObject ? weakRef.Target : null;
//             // Verify if the element is still in the same visual tree
//             if (GetVisualRoot(activeElement) == GetVisualRoot(d)) 
//                 return activeElement;
//             else 
//                 d.SetValue(TabOnceActiveElementProperty, null); 
//         }
         
	     var activeElement = d.GetValue(KeyboardNavigation.TabOnceActiveElementProperty);
	     if(activeElement != null){
		     activeElement = activeElement instanceof DependencyObject ? activeElement : null;
		     // Verify if the element is still in the same visual tree
		     if (KeyboardNavigation.GetVisualRoot(activeElement) == KeyboardNavigation.GetVisualRoot(d)) 
		         return activeElement;
		     else 
		         d.SetValue(KeyboardNavigation.TabOnceActiveElementProperty, null); 
	     }

	     return null; 
     };

//     internal static void 
     KeyboardNavigation.SetTabOnceActiveElement = function(/*DependencyObject*/ d, /*DependencyObject*/ value)
     { 
//    	 d.SetValue(TabOnceActiveElementProperty, new WeakReference(value));
         d.SetValue(KeyboardNavigation.TabOnceActiveElementProperty, value);
     }; 
     
//     private static DependencyObject 
     function GetControlTabOnceActiveElement(/*DependencyObject*/ d)
     {
//         var weakRef = d.GetValue(KeyboardNavigation.ControlTabOnceActiveElementProperty); 
//         if (weakRef != null && weakRef.IsAlive)
//         { 
//             var activeElement = weakRef.Target instanceof DependencyObject ? weakRef.Target : null; 
//             // Verify if the element is still in the same visual tree
//             if (GetVisualRoot(activeElement) == GetVisualRoot(d)) 
//                 return activeElement;
//             else
//                 d.SetValue(KeyboardNavigation.ControlTabOnceActiveElementProperty, null);
//         } 
//         return null;
    	 
 		var activeElement = d.GetValue(KeyboardNavigation.ControlTabOnceActiveElementProperty); 
		if(activeElement != null){
			activeElement = activeElement instanceof DependencyObject ? activeElement : null; 
	        if (KeyboardNavigation.GetVisualRoot(activeElement) == KeyboardNavigation.GetVisualRoot(d)) 
	            return activeElement;
	        else
	            d.SetValue(KeyboardNavigation.ControlTabOnceActiveElementProperty, null);
		}

    	return null;
     } 

//     private static void 
     function SetControlTabOnceActiveElement(/*DependencyObject*/ d, /*DependencyObject*/ value)
     { 
         d.SetValue(ControlTabOnceActiveElementProperty, /*new WeakReference(*/value);
     }

     /// <SecurityNote>
     ///     Critical: This code retrieves PresentationSource which is a protected resource 
     ///     TreatAsSafe: It returns rootvisual which is ok and it does not expose the PresentationSource
     /// </SecurityNote>
//     internal static Visual 
	KeyboardNavigation.GetVisualRoot = function(/*DependencyObject*/ d) 
     {
         if (d instanceof Visual /*|| d instanceof Visual3D*/) 
         { 
        	 
//             var source = PresentationSource.CriticalFromVisual(d);
//
//             if (source != null)
//                 return source.RootVisual;
             //cym modified
             return InputElement.GetRootVisual(d, false);
         }
         else 
         {
             var fce = d instanceof FrameworkContentElement ? d : null; 
             if (fce != null) 
                 return KeyboardNavigation.GetVisualRoot(fce.Parent);
         } 

         return null;
     };
     
     // Coercion for ShowKeyboardCuesProperty
//     private static object 
     function CoerceShowKeyboardCues(/*DependencyObject*/ d, /*object*/ value) 
     {
         // Always return true if the user has requested that KeyboardCues always
         // be on (accessibility setting).
         return SystemParameters.KeyboardCues ? true : value; 
     }
     
     /// <summary>
     /// Writes the attached property TabIndex to the given element. 
     /// </summary> 
     /// <param name="element">The element to which to write the attached property.</param>
     /// <param name="index">The property value to set</param> 
     /// <seealso cref="KeyboardNavigation.TabIndexProperty" />
//     public static void 
     KeyboardNavigation.SetTabIndex = function(/*DependencyObject*/ element, /*int*/ index)
     {
         if (element == null) 
         {
             throw new ArgumentNullException("element"); 
         } 
         element.SetValue(KeyboardNavigation.TabIndexProperty, index);
     }; 

     /// <summary>
     /// Reads the attached property TabIndex from the given element.
     /// </summary> 
     /// <param name="element">The element from which to read the attached property.</param>
     /// <returns>The property's value.</returns> 
     /// <seealso cref="KeyboardNavigation.TabIndexProperty" /> 
//     public static int 
     KeyboardNavigation.GetTabIndex = function(/*DependencyObject*/ element) 
     {
         if (element == null)
         {
             throw new ArgumentNullException("element"); 
         }
         return GetTabIndexHelper(element); 
     }; 

     /// <summary> 
     /// Writes the attached property IsTabStop to the given element.
     /// </summary>
     /// <param name="element">The element to which to write the attached property.</param>
     /// <param name="isTabStop">The property value to set</param> 
     /// <seealso cref="KeyboardNavigation.IsTabStopProperty" />
//     public static void 
     KeyboardNavigation.SetIsTabStop = function(/*DependencyObject*/ element, /*bool*/ isTabStop) 
     { 
         if (element == null)
         { 
             throw new ArgumentNullException("element");
         }
         element.SetValue(KeyboardNavigation.IsTabStopProperty, isTabStop);
     }; 

     /// <summary> 
     /// Reads the attached property IsTabStop from the given element. 
     /// </summary>
     /// <param name="element">The element from which to read the attached property.</param> 
     /// <returns>The property's value.</returns>
     /// <seealso cref="KeyboardNavigation.IsTabStopProperty" />
//     public static bool 
     KeyboardNavigation.GetIsTabStop = function(/*DependencyObject*/ element) 
     {
         if (element == null) 
         { 
             throw new ArgumentNullException("element");
         } 
         return element.GetValue(KeyboardNavigation.IsTabStopProperty);
     };

     /// <summary> 
     /// Writes the attached property TabNavigation to the given element.
     /// </summary> 
     /// <param name="element">The element to which to write the attached property.</param> 
     /// <param name="mode">The property value to set</param>
     /// <seealso cref="KeyboardNavigation.TabNavigationProperty" /> 
//     public static void 
     KeyboardNavigation.SetTabNavigation = function(/*DependencyObject*/ element, /*KeyboardNavigationMode*/ mode)
     {
         if (element == null)
         { 
             throw new ArgumentNullException("element");
         } 
         element.SetValue(KeyboardNavigation.TabNavigationProperty, mode); 
     };

     /// <summary>
     /// Reads the attached property TabNavigation from the given element.
     /// </summary>
     /// <param name="element">The element from which to read the attached property.</param> 
     /// <returns>The property's value.</returns>
     /// <seealso cref="KeyboardNavigation.TabNavigationProperty" /> 
//     public static KeyboardNavigationMode 
     KeyboardNavigation.GetTabNavigation = function(/*DependencyObject*/ element) 
     {
         if (element == null)
         {
             throw new ArgumentNullException("element"); 
         }
         return element.GetValue(KeyboardNavigation.TabNavigationProperty); 
     }; 

     /// <summary> 
     /// Writes the attached property ControlTabNavigation to the given element.
     /// </summary>
     /// <param name="element">The element to which to write the attached property.</param>
     /// <param name="mode">The property value to set</param> 
     /// <seealso cref="KeyboardNavigation.ControlTabNavigationProperty" />
//     public static void 
     KeyboardNavigation.SetControlTabNavigation = function(/*DependencyObject*/ element, /*KeyboardNavigationMode*/ mode) 
     { 
         if (element == null)
         { 
             throw new ArgumentNullException("element");
         }
         element.SetValue(KeyboardNavigation.ControlTabNavigationProperty, mode);
     };

     /// <summary> 
     /// Reads the attached property ControlTabNavigation from the given element. 
     /// </summary>
     /// <param name="element">The element from which to read the attached property.</param> 
     /// <returns>The property's value.</returns>
     /// <seealso cref="KeyboardNavigation.ControlTabNavigationProperty" />
//     public static KeyboardNavigationMode 
     KeyboardNavigation.GetControlTabNavigation = function(/*DependencyObject*/ element)
     { 
         if (element == null) 
         {
             throw new ArgumentNullException("element"); 
         }
         return element.GetValue(KeyboardNavigation.ControlTabNavigationProperty);
     };

     /// <summary>
     /// Writes the attached property DirectionalNavigation to the given element. 
     /// </summary> 
     /// <param name="element">The element to which to write the attached property.</param>
     /// <param name="mode">The property value to set</param> 
     /// <seealso cref="KeyboardNavigation.DirectionalNavigationProperty" />
//     public static void 
     KeyboardNavigation.SetDirectionalNavigation = function(/*DependencyObject*/ element, /*KeyboardNavigationMode*/ mode)
     {
         if (element == null) 
         {
             throw new ArgumentNullException("element"); 
         } 
         element.SetValue(KeyboardNavigation.DirectionalNavigationProperty, mode);
     }; 

     /// <summary>
     /// Reads the attached property DirectionalNavigation from the given element.
     /// </summary> 
     /// <param name="element">The element from which to read the attached property.</param>
     /// <returns>The property's value.</returns> 
     /// <seealso cref="KeyboardNavigation.DirectionalNavigationProperty" /> 
//     public static KeyboardNavigationMode 
     KeyboardNavigation.GetDirectionalNavigation = function(/*DependencyObject*/ element)
     {
         if (element == null)
         { 
             throw new ArgumentNullException("element");
         } 
         return element.GetValue(KeyboardNavigation.DirectionalNavigationProperty); 
     };

     /// <summary>
     /// Writes the attached property AcceptsReturn to the given element.
     /// </summary>
     /// <param name="element">The element to which to write the attached property.</param> 
     /// <param name="enabled">The property value to set</param>
     /// <seealso cref="KeyboardNavigation.AcceptsReturnProperty" /> 
//     public static void 
     KeyboardNavigation.SetAcceptsReturn = function(/*DependencyObject*/ element, /*bool*/ enabled) 
     {
         if (element == null) 
         {
             throw new ArgumentNullException("element");
         }
         element.SetValue(KeyboardNavigation.AcceptsReturnProperty, enabled); 
     };

     /// <summary> 
     /// Reads the attached property AcceptsReturn from the given element.
     /// </summary> 
     /// <param name="element">The element from which to read the attached property.</param>
     /// <returns>The property's value.</returns>
     /// <seealso cref="KeyboardNavigation.AcceptsReturnProperty" />
//     public static bool 
     KeyboardNavigation.GetAcceptsReturn = function(/*DependencyObject*/ element)
     { 
         if (element == null) 
         {
             throw new ArgumentNullException("element"); 
         }
         return element.GetValue(KeyboardNavigation.AcceptsReturnProperty);
     };

//     private static bool 
     function IsValidKeyNavigationMode(/*object*/ o)
     { 
         return o == KeyboardNavigationMode.Contained
             || o == KeyboardNavigationMode.Continue 
             || o == KeyboardNavigationMode.Cycle
             || o == KeyboardNavigationMode.None
             || o == KeyboardNavigationMode.Once
             || o == KeyboardNavigationMode.Local; 
     }
     
////     internal static UIElement 
//     KeyboardNavigation.GetParentUIElementFromContentElement = function(/*ContentElement*/ ce) 
//     {
////         var ichParent = null;
//         return GetParentUIElementFromContentElement(ce, /*ref ichParent*/ {"ichParent" : null});
//     }; 

//     private static UIElement 
     KeyboardNavigation.GetParentUIElementFromContentElement = function(/*ContentElement*/ ce, /*ref IContentHost ichParent*/ichParentRef) 
     { 
    	 if(ichParentRef === undefined){
    		 ichParentRef = {"ichParent" : null};
    	 }
    	 
         if (ce == null)
             return null; 

         var ich = ContentHostHelper.FindContentHost(ce);
         if (ichParentRef.ichParent == null)
        	 ichParentRef.ichParent = ich; 

         var parent =  ich instanceof DependencyObject ? ich : null; 
         if(parent != null) 
         {
             // Case 1: UIElement 
             // return the element
             var eParent = parent instanceof UIElement ? parent : null;
             if(eParent != null)
                 return eParent; 

             // Case 2: Visual 
             // Walk up the visual tree until we find UIElement 
             var visualParent = parent instanceof Visual ? parent : null;
             while (visualParent != null) 
             {
                 visualParent = VisualTreeHelper.GetParent(visualParent);
                 visualParent = visualParent instanceof Visual ? visualParent : null;
                 var uielement = visualParent instanceof UIElement ? visualParent : null;
                 if (uielement != null) 
                     return uielement;
             } 

             // Case 3: ContentElement
             var ceParent = parent instanceof ContentElement ? parent : null; 
             if(ceParent != null)
                 return KeyboardNavigation.GetParentUIElementFromContentElement(ceParent, /*ref ichParent*/ichParentRef);
         }

         return null;
     };
     
     /// <SecurityNote>
     ///   Critical: This code accesses link demanded input manager 
     ///   TreatAsSafe: This code is ok to expose as it simply return boolean weather Keyboard is the last used device
     /// </SecurityNote> 
//     internal static bool 
     KeyboardNavigation.IsKeyboardMostRecentInputDevice = function()
     { 
         return InputManager.Current.MostRecentInputDevice instanceof KeyboardDevice;
     };



//     internal static void 
     KeyboardNavigation.ShowFocusVisual = function()
     { 
    	 //cym comment
//         Current.ShowFocusVisual(Keyboard.FocusedElement instanceof DependencyObject ? Keyboard.FocusedElement : null);
     };
     
     /// <summary> 
     ///     Returns the element rectange relative to the root.
     ///     Also calls UpdateLayout if the layout of element is 
     ///     not valid.
     /// </summary>
//     internal static Rect 
     KeyboardNavigation.GetRectangle = function(/*DependencyObject*/ element)
     { 
         var uiElement = element instanceof UIElement ? element : null;
         if (uiElement != null) 
         { 
             if (!uiElement.IsArrangeValid)
             { 
                 // Call UpdateLayout if qualifies.
                 uiElement.UpdateLayout();
             }

             var rootVisual = KeyboardNavigation.GetVisualRoot(uiElement);

             if (rootVisual != null) 
             {
//            	 var transform = uiElement.TransformToAncestor(rootVisual);   //cym comment
                 var deflateThickness = /*(Thickness)*/uiElement.GetValue(KeyboardNavigation.DirectionalNavigationMarginProperty);
//                 var x = -deflateThickness.Left;
//                 var y = -deflateThickness.Top;
                 var x = uiElement._dom.offsetLeft;
                 var y = uiElement._dom.offsetTop;
                 x -= deflateThickness.Left;
                 y -= deflateThickness.Top;
                 var width = uiElement.RenderSize.Width + deflateThickness.Left + deflateThickness.Right; 
                 var height = uiElement.RenderSize.Height + deflateThickness.Top + deflateThickness.Bottom;
                 if (width < 0) 
                 { 
                     x = uiElement.RenderSize.Width * 0.5;
                     width = 0; 
                 }
                 if (height < 0)
                 {
                     y = uiElement.RenderSize.Height * 0.5; 
                     height = 0;
                 } 
//                 return transform.TransformBounds(new Rect(x, y, width, height));  //cym comment
                 var result =  new Rect(x, y, width, height); 
                 var el = uiElement._dom;
                 while ( el = el.offsetParent) {
                     result.X += el.offsetLeft;
                     result.Y += el.offsetTop;
                 }
                 
                 return result;
             }
         } 
         else
         {
             var ce = element instanceof ContentElement ? element : null;
             if (ce != null) 
             {
                 /*IContentHost*/var parentICH = null; 
                 /*UIElement*/var parentUIElement = KeyboardNavigation.GetParentUIElementFromContentElement(ce, /*ref*/ parentICH); 
                 /*Visual*/var parent = parentICH instanceof Visual ? parentICH : null;
                 if (parentICH != null && parent != null && parentUIElement != null) 
                 {
                     var rootVisual = KeyboardNavigation.GetVisualRoot(parent);
                     if (rootVisual != null)
                     { 
                         if (!parentUIElement.IsMeasureValid)
                         { 
                             // Call UpdateLayout if qualifies. 
                             parentUIElement.UpdateLayout();
                         } 

                         // Note: Here we consider only the fist rectangle
                         // Do we need to consider all of them as one combined rectangle?
                         /*ReadOnlyCollection<Rect>*/var rects = parentICH.GetRectangles(ce); 
                         /*IEnumerator<Rect>*/var enumerator = rects.GetEnumerator();
                         if (enumerator.MoveNext()) 
                         { 
                             var transform = parent.TransformToAncestor(rootVisual);
                             var rect = enumerator.Current; 
                             return transform.TransformBounds(rect);
                         }
                     }
                 } 
             }
//             else 
//             { 
//                 UIElement3D uiElement3D = element as UIElement3D;
//                 if (uiElement3D != null) 
//                 {
//                     Visual rootVisual = GetVisualRoot(uiElement3D);
//                     Visual containingVisual2D = VisualTreeHelper.GetContainingVisual2D(uiElement3D);
//
//                     if (rootVisual != null && containingVisual2D != null)
//                     { 
//                         Rect rectElement = uiElement3D.Visual2DContentBounds; 
//                         GeneralTransform transform = containingVisual2D.TransformToAncestor(rootVisual);
//
//                         return transform.TransformBounds(rectElement);
//                     }
//                 }
//             } 
         }

         return Rect.Empty; 
     };
     
//     internal static void 
     KeyboardNavigation.EnableKeyboardCues = function(/*DependencyObject*/ element, /*bool*/ enable)
     { 
         var visual = element instanceof Visual ? element : null; 
         if (visual == null)
         { 
             visual = KeyboardNavigation.GetParentUIElementFromContentElement(element instanceof ContentElement ? element : null);
             if (visual == null)
                 return;
         } 

         var rootVisual = KeyboardNavigation.GetVisualRoot(visual); 
         if (rootVisual != null) 
         {
             rootVisual.SetValue(ShowKeyboardCuesProperty, enable ? true : false); 
         }
     };

//     internal static FocusNavigationDirection
     KeyboardNavigation.KeyToTraversalDirection = function(/*Key*/ key) 
     {
         switch (key) 
         { 
             case Key.Left:
                 return FocusNavigationDirection.Left; 

             case Key.Right:
                 return FocusNavigationDirection.Right;

             case Key.Up:
                 return FocusNavigationDirection.Up; 

             case Key.Down:
                 return FocusNavigationDirection.Down; 
         }

         throw new NotSupportedException();
     }; 
     
     
//   private static int 
     function GetTabIndexHelper(/*DependencyObject*/ d)
     { 
    	 return d.GetValue(KeyboardNavigation.TabIndexProperty);
     }

	
	KeyboardNavigation.Type = new Type("KeyboardNavigation", KeyboardNavigation, [Object.Type]);
	return KeyboardNavigation;
});

 
//        private WeakReferenceList _weakFocusChangedHandlers = new WeakReferenceList(); 
//
//        }

      

//        private class WeakReferenceList : DispatcherObject 
//        {
//            public int Count { get { return _list.Count; } }
//
//            // add a weak reference to the item 
//            public void Add(object item)
//            { 
//                // before growing the list, purge it of dead entries. 
//                // The expense of purging amortizes to O(1) per entry, because
//                // the the list doubles its capacity when it grows. 
//                if (_list.Count == _list.Capacity)
//                {
//                    Purge();
//                } 
//
//                _list.Add(new WeakReference(item)); 
//            } 
//
//            // remove all references to the target item 
//            public void Remove(object target)
//            {
//                bool hasDeadEntries = false;
//                for (int i=0;  i<_list.Count;  ++i) 
//                {
//                    object item = _list[i].Target; 
//                    if (item != null) 
//                    {
//                        if (item == target) 
//                        {
//                            _list.RemoveAt(i);
//                            --i;
//                        } 
//                    }
//                    else 
//                    { 
//                        hasDeadEntries = true;
//                    } 
//                }
//
//                if (hasDeadEntries)
//                { 
//                    Purge();
//                } 
//            } 
//
//            // invoke the given action on each item 
//            public void Process(Func<object, bool> action)
//            {
//                bool hasDeadEntries = false;
//                for (int i=0;  i<_list.Count;  ++i) 
//                {
//                    object item = _list[i].Target; 
//                    if (item != null) 
//                    {
//                        if (action(item)) 
//                            break;
//                    }
//                    else
//                    { 
//                        hasDeadEntries = true;
//                    } 
//                } 
//
//                if (hasDeadEntries) 
//                {
//                    // some actions cause the loop to exit early (often after
//                    // the first call.  Don't penalize them with a synchronous
//                    // purge;  instead purge later when there's nothing more 
//                    // important to do.
//                    ScheduleCleanup(); 
//                } 
//            }
// 
//            // purge the list of dead references
//            private void Purge()
//            {
//                int destIndex = 0; 
//                int n = _list.Count;
// 
//                // move valid entries toward the beginning, into one 
//                // contiguous block
//                for (int i=0; i<n; ++i) 
//                {
//                    if (_list[i].IsAlive)
//                    {
//                        _list[destIndex++] = _list[i]; 
//                    }
//                } 
// 
//                // remove the remaining entries and shrink the list
//                if (destIndex < n) 
//                {
//                    _list.RemoveRange(destIndex, n - destIndex);
//
//                    // shrink the list if it would be less than half full otherwise. 
//                    // This is more liberal than List<T>.TrimExcess(), because we're
//                    // probably in the situation where additions to the list are common. 
//                    int newCapacity = destIndex << 1; 
//                    if (newCapacity < _list.Capacity)
//                    { 
//                        _list.Capacity = newCapacity;
//                    }
//                }
//            } 
//
//            // schedule a cleanup pass 
//            private void ScheduleCleanup() 
//            {
//                if (!_isCleanupRequested) 
//                {
//                    _isCleanupRequested = true;
//                    Dispatcher.BeginInvoke(DispatcherPriority.ContextIdle,
//                            (DispatcherOperationCallback)delegate(object unused) 
//                            {
//                                lock(this) 
//                                { 
//                                    Purge();
// 
//                                    // cleanup is done
//                                    _isCleanupRequested = false;
//                                }
//                                return null; 
//                            }, null);
//                } 
//            } 
//
//            List<WeakReference> _list = new List<WeakReference>(1); 
//            bool _isCleanupRequested;
//        }


 
