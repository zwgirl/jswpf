/**
 * Popup
 */
/// <summary> 
///     A control that creates a fly-out window that contains content. 
/// </summary>
/// <remarks> 
///     Popup creates a new top-level window to display content that can move beyond the bounds of
///     an application's window.
///     The Popup content is not affected by styles and properties in other trees
///     unless specifically bound to them. 
/// </remarks>
define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "markup/IAddChild", "internal.controls/ModelTreeEnumerator",
        "windows/DragDrop", "windows/Visibility", "system/TimeSpan", "windows/Window", "specialized/BitVector32",
        "primitives/PopupAnimation", "windows/DependencyPropertyHelper", "primitives/CustomPopupPlacementCallback",
        "generic/List"],
		function(declare, Type, FrameworkElement, IAddChild, ModelTreeEnumerator,
				DragDrop, Visibility, TimeSpan, Window, BitVector32,
				PopupAnimation, DependencyPropertyHelper, CustomPopupPlacementCallback,
				List){
	
//    private enum
    var CacheBits = declare(null, {});
    CacheBits.CaptureEngaged          = 0x01; 
    CacheBits.IsTransparent           = 0x02;
    CacheBits.OnClosedHandlerReopen   = 0x04; 
    CacheBits.DropOppositeSet         = 0x08; 
    CacheBits.DropOpposite            = 0x10;
    CacheBits.AnimateFromRight        = 0x20; 
    CacheBits.AnimateFromBottom       = 0x40;
    CacheBits.HitTestable             = 0x80;  // False for tooltips
    CacheBits.IsDragDropActive        = 0x100;
    

    

    // Indicies into InterestPoint point array 
//    private enum 
    var InterestPoint = declare(null, {
    	
    });
    InterestPoint.TopLeft     = 0;
    InterestPoint.TopRight    = 1;
    InterestPoint.BottomLeft  = 2;
    InterestPoint.BottomRight = 3; 
    InterestPoint.Center      = 4;

    // This struct is returned by GetPointCombination to indicate
    // which points on the target can align with points on the child 
//    private struct 
    var PointCombination = declare(null, {
    	constructor:function(/*InterestPoint*/ targetInterestPoint, /*InterestPoint*/ childInterestPoint)
        { 
            this.TargetInterestPoint = targetInterestPoint;
            this.ChildInterestPoint = childInterestPoint; 
    	}
    });
    
    Object.defineProperties(PointCombination.prototype, {
//        public InterestPoint 
        TargetInterestPoint:{
        	get:function(){
        		return this._TargetInterestPoint;
        	},
        	set:function(value){
        		this._TargetInterestPoint = value;
        	}
        },
//        public InterestPoint 
        ChildInterestPoint:{
        	get:function(){
        		return this._ChildInterestPoint;
        	},
        	set:function(value){
        		this._ChildInterestPoint = value;
        	}
        }
    });

//    private class 
    var PositionInfo = declare(null, {
    	constructor:function(){
    		this.MouseRect = Rect.Empty;
    	}
    }); 
    
    Object.defineProperties(PositionInfo.prototype, {
        // The position of the upper left corner of the popup after nudging 
//        public int 
        X:
        {
        	get:function(){
        		return this._X;
        	},
        	set:function(value){
        		this._X = value;
        	}
        },
//        public int 
        Y:
        {
        	get:function(){
        		return this._Y;
        	},
        	set:function(value){
        		this._Y = value;
        	}
        },
        // The size of the popup
//        public Size 
        ChildSize:
        {
        	get:function(){
        		return this._ChildSize;
        	},
        	set:function(value){
        		this._ChildSize = value;
        	}
        },
        // The screen rect of the mouse 
//        public Rect 
        MouseRect:
        {
        	get:function(){
        		return this._MouseRect;
        	},
        	set:function(value){
        		this._MouseRect = value;
        	}
        },
    });
    
//  private class 
    var PopupModelTreeEnumerator =declare(ModelTreeEnumerator, {
   	 	"-chains-": {
	      constructor: "manual"
	    },
    	constructor:function(/*Popup*/ popup, /*object*/ child){
//    		 base(child)
    		ModelTreeEnumerator.prototype.constructor.call(this, child);
            this._popup = popup; 
    	}
    });
    
    Object.defineProperties(PopupModelTreeEnumerator.prototype, {
//        protected override bool 
    	IsUnchanged: 
        {
            get:function() 
            {
                return Object.ReferenceEquals(this.Content, this._popup.Child);
            }
        }

    });
    
//    private const int 
    var AnimationDelay = 150;
//    internal static TimeSpan 
    var AnimationDelayTime = new TimeSpan(0, 0, 0, 0, AnimationDelay); 
    
    // When an exception aborts the measure of PopupRoot's subtree, we save 
    // it in an uncommon field.  The exception can cause a null-reference much
    // later on (during a subsequent and unrelated layout pass), by which time 
    // it's impossible to determine what happened.   We mitigate this by 
    // reporting the original exception as the InnerException of the null-ref.

//    private static readonly UncommonField<Exception> 
    var SavedExceptionField = new UncommonField/*<Exception>*/();

    
	var Popup = declare("Popup", [FrameworkElement, IAddChild ],{
		constructor:function(){
            // create popup's security helper 
//            this._secHelper = new PopupSecurityHelper(); 
            this._cacheValid = new BitVector32(0);   // Condense booleanean bits 
    		this._dom = document.createElement("div");
    		this._dom.id = "Popup";
		},
 
//        internal override void 
        pushTextRenderingMode:function()
        {
            //
            // TextRenderingMode is inherited both in the UIElement tree and the graphics tree. 
            // This means we don't need to set VisualTextRenderingMode on every single node, we only
            // want to set it on a Visual when it is explicitly set, or set in a manner other than inheritance. 
            // The sole exception to this is PopupRoot, which needs to propagate the value to its Visual, because 
            // the graphics tree does not inherit across CompositionTarget boundaries.
            // 
        	
        	//cym comment
//            if (this.Child != null)
//            {
//               /* System.Windows.ValueSource*/
//            	var vs = DependencyPropertyHelper.GetValueSource(this.Child, TextOptions.TextRenderingModeProperty);
//                if (vs.BaseValueSource <= BaseValueSource.Inherited) 
//                {
//                        Child.VisualTextRenderingMode = TextOptions.GetTextRenderingMode(this); 
//                } 
//            }
        }, 
 
        /// <summary>
        /// Updates the popup's placement target registration. 
        /// This method is only called when IsOpen changes or when PlacementTarget changes,
        /// When IsOpen changes, your before/after is either PlacementTarget or null. When PlacementTarget changes, the before/after are stored in the event args.
        /// </summary>
//        private void 
        UpdatePlacementTargetRegistration:function(/*UIElement*/ oldValue, /*UIElement*/ newValue) 
        {
            // A popup will be registered with its placement target to enable the descendent walker 
            // to traverse into the popup. This is required for style sheet invalidations, etc. 
            //
            // To avoid life-time issues, the popup will only be registered with the placement target 
            // if the popup is in the Open state. Otherwise the strong-ref from the placement target
            // back to the popup could potentially keep the popup alive even though it has long
            // been closed.
 
            if (oldValue != null)
            { 
                UnregisterPopupFromPlacementTarget(this, oldValue); 

                if (newValue == null && VisualTreeHelper.GetParent(this) == null) 
                {
                    TreeWalkHelper.InvalidateOnTreeChange(this, null, oldValue, false);
                }
            } 
            if (newValue != null)
            { 
                //Only register with PlacementTarget if we aren't in a tree 
                if (VisualTreeHelper.GetParent(this) == null)
                { 
                    RegisterPopupWithPlacementTarget(this, newValue);

                    // A Popup using its placement target as its InheritanceParent is dicey
                    // because the inheritable property or tree change invalidation storm 
                    // for the the PlacementTarget is separate from that for the Popup itself.
                    // This causes Popup and its descedents to miss some change notifications. 
                    // Thus a Popup that isnt connected to the tree in any way should be 
                    // designated standalone and thus IsSelfInheritanceParent = true. Please
                    // see Dev11 bug# 246558 for manifestation of these missing invalidations. 
                    if (!this.IsSelfInheritanceParent)
                    {
                        this.SetIsSelfInheritanceParent();
                    } 

                    // Invalidate relevant properties for this subtree 
                    TreeWalkHelper.InvalidateOnTreeChange(this, null, newValue, true); 
               }
            } 
        },

//        private void 
        RegisterToOpenOnLoad:function()
        {
            this.AddLoadedHandler(new RoutedEventHandler(this, this.OpenOnLoad)); 
        },
 
//        private void 
        OpenOnLoad:function(/*object*/ sender, /*RoutedEventArgs*/ e) 
        {
            // Open popup after main tree has rendered (Loaded is fired before 1st render) 
            Dispatcher.BeginInvoke(DispatcherPriority.Input, new DispatcherOperationCallback(function(/*object*/ param)
            {
                CoerceValue(Popup.IsOpenProperty);
 
                return null;
            }), null); 
        }, 

        /// <summary> 
        ///     Called when IsOpen becomes true on this popup.
        /// </summary> 
        /// <param name="e">Empty event arguments.</param>
//        protected virtual void 
        OnOpened:function(/*EventArgs*/ e)
        {
            this.RaiseClrEvent(Popup.OpenedKey, e); 
        },
 
        /// <summary> 
        ///     Called when IsOpen becomes false on this popup.
        /// </summary> 
        /// <param name="e">Empty event arguments.</param>
//        protected virtual void 
        OnClosed:function(/*EventArgs*/ e)
        {
            this._cacheValid.Set(CacheBits.OnClosedHandlerReopen, true); 
            try
            { 
                this.RaiseClrEvent(Popup.ClosedKey, e); 
            }
            finally 
            {
                this._cacheValid.Set(CacheBits.OnClosedHandlerReopen, false);
            }
        },

//        private void 
        ClearDropOpposite:function() 
        {
            this._cacheValid.Set(CacheBits.DropOppositeSet, false); 
        },

//        private void 
        FirePopupCouldClose:function() 
        {
            if (this.PopupCouldClose != null) 
            {
                this.PopupCouldClose(this, EventArgs.Empty);
            }
        },
//        /// <summary>
//        ///     Invoked when remeasuring the control is required. 
//        ///     The Popup will always return a size of zero because its content is not within this
//        ///     visual tree. The content is inside a different window/visual tree.
//        /// </summary>
//        /// <param name="availableSize">The control cannot return a size larger than the constraint.</param> 
//        /// <returns>The size (always zero for Popup)</returns>
//        protected override Size 
        MeasureOverride:function(/*Size*/ availableSize) 
        { 
            // Popup is always zero size. It's the content inside the window that has a size.
            return new Size(); 
        },
        
        /// <summary>
        ///     ArrangeOverride allows for the customization of the positioning of children. 
        /// </summary> 
        /// <param name="arrangeSize">The final size that element should use to arrange itself and its children.</param>
//        protected /*override*/ Size 
//        ArrangeOverride:function(/*Size*/ arrangeSize) 
//        {
//        	if (this.Child != null)
//            {
//            	this.Child.Arrange(this._dom);
//            	
//            	this._dom.appendChild(this.Child._dom);
//            }
//        },

        /// <summary>
        ///     Called when the mouse left button is pressed on this subtree 
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnPreviewMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e)
        { 
            this.OnPreviewMouseButton(e);
            FrameworkElement.prototype.OnPreviewMouseLeftButtonDown.call(this, e); 
        }, 

        /// <summary> 
        ///     Called when the mouse right button is pressed on this subtree
        /// </summary>
        /// <param name="e"></param>
//        protected override void 
        OnPreviewMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e) 
        {
        	FrameworkElement.prototype.OnPreviewMouseRightButtonDown.call(this, e); 
 
            this.OnPreviewMouseButton(e);
        }, 

        /// <summary>
        ///     Called when the mouse left button is released on this subtree
        /// </summary> 
        /// <param name="e"></param>
//        protected override void 
        OnPreviewMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) 
        { 
            this.OnPreviewMouseButton(e);
            FrameworkElement.prototype.OnPreviewMouseLeftButtonUp.call(this, e); 
        },

        /// <summary>
        ///     Called when the mouse right button is released on this subtree 
        /// </summary>
        /// <param name="e"></param> 
//        protected override void 
        OnPreviewMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e) 
        {
        	FrameworkElement.prototype.OnPreviewMouseRightButtonUp.call(this, e); 

        	this.OnPreviewMouseButton(e);
        },
 
//        private void 
        OnPreviewMouseButton:function(/*MouseButtonEventArgs*/ e)
        { 
            // We should only react to mouse buttons if we are in an auto close mode (where we have capture) 
            if (this._cacheValid.Get(CacheBits.CaptureEngaged) && !this.StaysOpen)
            { 
//                Debug.Assert( Mouse.Captured == _popupRoot, "_cacheValid[(int)CacheBits.CaptureEngaged] == true but Mouse.Captured != _popupRoot");

                // If we got a mouse press/release and the mouse isn't on the popup (popup root), dismiss.
                // When captured to subtree, source will be the captured element for events outside the popup. 
                if (this._popupRoot != null && e.OriginalSource == this._popupRoot)
                { 
                    // When we have capture we will get all mouse button up/down messages. 
                    // We should close if the press was outside.  The MouseButtonEventArgs don't tell whether we get this
                    // message because we have capture or if it was legit, so we have to do a hit test. 
                    if (this._popupRoot.InputHitTest(e.GetPosition(this._popupRoot)) == null)
                    {
                        // The hit test didn't find any element; that means the click happened outside the popup.
                        this.SetCurrentValueInternal(Popup.IsOpenProperty, false); 
                    }
                } 
            } 
        },
 
//        private void 
        EstablishPopupCapture:function()
        {
            if (!this._cacheValid.Get(CacheBits.CaptureEngaged) && (this._popupRoot != null) &&
                (!StaysOpen) && (Mouse.Captured == null)) 
            {
                // When the mouse is not already captured, we will consider the following: 
                // In all cases but Modeless, we want the popup and subtree to receive 
                // mouse events and prevent other elements from receiving those messages.
                Mouse.Capture(this._popupRoot, CaptureMode.SubTree); 
                this._cacheValid.Set(CacheBits.CaptureEngaged, true);
            }
        },
 
//        private void 
        ReleasePopupCapture:function()
        { 
            if (this._cacheValid.Get(CacheBits.CaptureEngaged)) 
            {
                // Popup's default implementation did not take capture from anyone, so it doesn't need to return capture. 
                // Only give up focus if we have it (someone may have taken it from us).
                if (Mouse.Captured == this._popupRoot)
                {
                    Mouse.Capture(null); 
                }
                this._cacheValid.Set(CacheBits.CaptureEngaged, false); 
            } 
        },

        ///<summary> 
        /// Called to Add the object as a Child. 
        ///</summary>
        ///<param name="value"> 
        /// Object to add as a child
        ///</param>
//        void IAddChild.
        AddChild:function(/*Object*/ value)
        { 
            /*UIElement*/var element = value instanceof UIElement ? value : null;
            if (element == null && value != null) 
            { 
                throw new ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(UIElement)), "value");
            } 

            this.Child = element;
        },
 
        ///<summary>
        /// Called when text appears under the tag in markup 
        ///</summary> 
        ///<param name="text">
        /// Text to Add to the Object 
        ///</param>
//        void IAddChild.
        AddText:function(/*string*/ text)
        {
            /*TextBlock*/var lbl = new TextBlock(); 
            lbl.Text = text;
 
           this. Child = lbl; 
        },
 
        // Invalidate resources on the popup root
//        internal override void 
        OnThemeChanged:function() 
        { 
            if (this._popupRoot != null)
                TreeWalkHelper.InvalidateOnResourcesChange(this._popupRoot, null, ResourcesChangeInfo.ThemeChangeInfo); 
        },

        /// <summary>
        /// Blocks ReverseInherited properties from propagating changes to logical/visual parents. 
        /// </summary>
//        internal override bool 
        BlockReverseInheritance:function() 
        { 
            // We want the popup to block reverse inheritance in most cases.
            // In the case that the Popup has a TemplatedParent we don't want 
            // to block reverse inheritance because the Popup is considered
            // part of that tree.
            return this.TemplatedParent == null;
        }, 

        /// <summary> 
        ///     Called to get the UI parent of this element when there is 
        ///     no visual parent.
        /// </summary> 
        /// <returns>
        ///     Returns a non-null value when some framework implementation
        ///     of this method has a non-visual parent connection,
        /// </returns> 
//        protected internal override DependencyObject 
        GetUIParentCore:function()
        { 
            // If we are in the ether or otherwise the root of the tree and there is a 
            // PlacementTarget, then send the event route over there.
            if (this.Parent == null) // We already know we don't have a visual parent, check logical as well 
            {
                /*UIElement*/var placementTarget = this.PlacementTarget;
                // Use the placement target as the logical parent while the popup is open
                if (placementTarget != null && (this.IsOpen /*|| _secHelper.IsWindowAlive()*/)) 
                {
                    return placementTarget; 
                } 
            }
 
            return FrameworkElement.prototype.GetUIParentCore.call(this);
        },

//        internal override bool 
        IgnoreModelParentBuildRoute:function(/*RoutedEventArgs*/ e) 
        {
            // When we don't have a parent, we should not be passing 
            // input events to our model parent (the placement target) 
            // Except for LostMouseCaptureEvents needed for menu/combobox subcapture
 
            return this.Parent == null &&
                e.RoutedEvent != Mouse.LostMouseCaptureEvent;
        },

        // Returns the element the popup should position relative to 
//        private Visual 
        GetTarget:function()
        {
            var targetVisual = this.PlacementTarget;
 
            if (targetVisual == null)
            { 
                targetVisual = VisualTreeHelper.GetContainingVisual2D(VisualTreeHelper.GetParent(this)); 
            }
 
            return targetVisual;
        },

//        private void 
        SetHitTestable:function(/*bool*/ hitTestable) 
        {
            this._popupRoot.IsHitTestVisible = hitTestable; 
 
            if (this.IsTransparent)
            { 
                // Make the Win32 window transparent so input is routed under the popup (for tooltips)
                this._secHelper.SetHitTestable(hitTestable);
            }
        },

        /// <SecurityNote> 
        ///     Critical: Sets rootvisual from popuproot 
        ///     TreatAsSafe: It initializes this to new value of the popuproot and
        ///     this should not cause any untowards behavior since it is not configurable 
        /// </SecurityNote>
//        private void 
        CreateNewPopupRoot:function()
        { 
            if (this._popupRoot == null)
            { 
            	this._popupRoot = new PopupRoot(); 
                this.AddLogicalChild(this._popupRoot);
                // Allow users to set Width/Height properties on the Popup and have them 
                // apply to the content.
                this._popupRoot.SetupLayoutBindings(this);
            }
        },

//        private void 
        CreateWindow:function(/*bool*/ asyncCall) 
        { 
            // Clear any previously cached value and let the current setup make a new determination
            this.ClearDropOpposite(); 

            // get target's visual
            /*Visual*/var targetVisual = this.GetTarget();
            // defer creation? 
//            if ((targetVisual != null) && PopupSecurityHelper.IsVisualPresentationSourceNull(targetVisual))
//            { 
//                // This is a case where the Popup is in a tree and its target is not hooked up to a window. 
//                if (!asyncCall)
//                { 
//                    // We'll defer until later if not already in an async call.
//                    this._asyncCreate = Dispatcher.BeginInvoke(DispatcherPriority.Input, new DispatcherOperationCallback(AsyncCreateWindow), this);
//                }
// 
//                return;
//            } 
// 
//            // Clear previously saved position info when opening the window
//            if (this._positionInfo != null) 
//            {
//            	this._positionInfo.MouseRect = Rect.Empty;
//            	this._positionInfo.ChildSize = Size.Empty;
//            } 
//
//            // create a new window? 
//            var makeNewWindow = !_secHelper.IsWindowAlive(); 
//            if (makeNewWindow)
//            { 
//                // create the window
//            	this.BuildWindow(targetVisual);
//            	this.CreateNewPopupRoot();
//            } 
//
//            /*UIElement*/var child = this.Child; 
//            if (this._popupRoot.Child != child) 
//            {
//            	this._popupRoot.Child = child; 
//            }

            // When opening, set the placement target registration
            this.UpdatePlacementTargetRegistration(null, this.PlacementTarget); 

//            this.UpdateTransform(); 
 
//            var isWindowAlive = true;
//            if (makeNewWindow) 
//            {
//                // Setting popup root will cause window to resize and reposition
//                SetRootVisualToPopupRoot();
// 
//                // It is possible that the popup is destroyed while setting the RootVisual
//                isWindowAlive = _secHelper.IsWindowAlive(); 
//                if (isWindowAlive) 
//                {
//                    _secHelper.ForceMsaaToUiaBridge(this._popupRoot); 
//                }
//            }
//            else
//            { 
//                // Update position manually
//                UpdatePosition(); 
//                isWindowAlive = _secHelper.IsWindowAlive(); 
//            }
// 
//            if (isWindowAlive)
//            {
                this.ShowWindow();
                this.OnOpened(EventArgs.Empty); 
//            }
        }, 
 
        /// <SecurityNote>
        ///     Critical:This code sets the rootvisual to popup root 
        ///     TreatAsSafe:popuproot is critical for set so that you cannot set it to
        ///     arbitrary values
        /// </SecurityNote>
//        private void 
        SetRootVisualToPopupRoot:function()
        { 
            if (this.PopupAnimation != PopupAnimation.None && this.IsTransparent) 
            {
                // When the Popup is transparent, hide the content. 
                // Later when the window is made visible, opacity is set to 1
                // This is to prevent the first frame of the popup animations
                // from displaying
            	this._popupRoot.Opacity = 0.0; 
            }
 
            _secHelper.SetWindowRootVisual(this._popupRoot); 
        },
 
        /// <SecurityNote>
        /// Critical - it calls a critical method (BuildWindow)
        /// TreatAsSafe - it calls it passing hooks defined in this class
        /// </SecurityNote> 
//        private void 
        BuildWindow:function(/*Visual*/ targetVisual) 
        { 
            // AllowsTransparency is applied to popup only at creation time
            CoerceValue(Popup.AllowsTransparencyProperty); 
            CoerceValue(Popup.HasDropShadowProperty);
            this.IsTransparent = this.AllowsTransparency;

            // We many not have attempted to position the popup yet 
            /*int*/var x = _positionInfo == null ? 0 : _positionInfo.X;
            /*int*/var y = _positionInfo == null ? 0 : _positionInfo.Y; 
            _secHelper.BuildWindow(x, y, targetVisual, IsTransparent, PopupFilterMessage, OnWindowResize); 
        },
 
        /// <SecurityNote>
        /// Critical - it calls a critical method (DestroyWindow)
        /// TreatAsSafe - it calls it passing hooks defined in this class
        /// </SecurityNote> 
//        private void 
        DestroyWindow:function() 
        { 
            if (_secHelper.IsWindowAlive())
            { 
                _secHelper.DestroyWindow(PopupFilterMessage, OnWindowResize);
                this.ReleasePopupCapture();

                // Raise closed event after popup has actually closed 
                this.OnClosed(EventArgs.Empty);
 
                // When closing, clear the placement target registration 
                this.UpdatePlacementTargetRegistration(this.PlacementTarget, null);
            } 
        },

        // Open the window
//        private void 
        ShowWindow:function() 
        {
//            if (_secHelper.IsWindowAlive()) 
//            { 
//                this._popupRoot.Opacity = 1.0;
// 
//                this.SetupAnimations(true);
//
//                // Always set hittestable for non layered windows
//                this.SetHitTestable(HitTestable || !this.IsTransparent); 
//                this.EstablishPopupCapture();
// 
//                _secHelper.ShowWindow(); 
//            }
        	
//        	if(this._dom ===undefined){

//        		this.PlacementTarget.Parent._dom.appendChild(this._dom);
        		
//        		var p = document.createElement("p");
//        		
//        		var text = document.createTextNode('this.Text');
//        		p.appendChild(text);
//        		this._dom.appendChild(p);
        		
        		this.Child.Arrange();
        		
        		this._dom.appendChild(this.Child._dom);
        		
        		this._dom.style.setProperty("position", "absolute");
        		var x = this.PlacementTarget._dom.offsetLeft;
        		var y = this.PlacementTarget._dom.offsetTop;
        		this._dom.style.setProperty("position", "absolute");
        		this._dom.style.setProperty("left", x + "px");
        		this._dom.style.setProperty("top", y + this.PlacementTarget._dom.offsetHeight + "px");
        		this._dom.style.setProperty("zindex", 100);
//        	}
        }, 

        // Close the window
//        private void 
        HideWindow:function()
        { 
            var animating = SetupAnimations(false);
 
            this.SetHitTestable(false); 
            this.ReleasePopupCapture();
 
            // NOTE: It is important that we destroy the windows at less than Render priority because Menus will allow
            //       all Render-priority queue items to be processed before firing the click event and we don't want
            //       to have disposed the window at the time that we route the event.
            //       Setting to inactive to allow any animations in ShowWindow to take effect first. 

            this._asyncDestroy = new DispatcherTimer(DispatcherPriority.Input); 
            this._asyncDestroy.Tick += function(/*object*/ sender, /*EventArgs*/ args) 
            {
            	this._asyncDestroy.Stop(); 
            	this._asyncDestroy = null;

            	this.DestroyWindow();
            }; 

            // Wait for the animation (if any) to complete before destroying the window 
            this._asyncDestroy.Interval = animating ? AnimationDelayTime : TimeSpan.Zero; 
            this._asyncDestroy.Start();
 
            if (!animating)
                _secHelper.HideWindow();
        },
 
        // Starts animations on the popup root
//        private bool 
        SetupAnimations:function(/*bool*/ visible) 
        { 
            /*PopupAnimation*/var animation = PopupAnimation;
 
            this._popupRoot.StopAnimations();

            // Only animate if popup is transparent
            if (animation != PopupAnimation.None && IsTransparent) 
            {
                if (animation == PopupAnimation.Fade) 
                { 
                    this._popupRoot.SetupFadeAnimation(AnimationDelayTime, visible);
                    return true; 
                }
                else if (visible) // only translate when showing popup
                {
                    // translate the content 
                    this._popupRoot.SetupTranslateAnimations(animation, AnimationDelayTime, AnimateFromRight, AnimateFromBottom);
                    return true; 
                } 
            }
            return false; 
        },

//        private void 
        CancelAsyncCreate:function()
        { 
            if (this._asyncCreate != null)
            { 
            	this._asyncCreate.Abort(); 
            	this._asyncCreate = null;
            } 
        },

//        private void 
        CancelAsyncDestroy:function()
        { 
            if (this._asyncDestroy != null)
            { 
            	this._asyncDestroy.Stop(); 
            	this._asyncDestroy = null;
            } 
        },

//        internal void 
        ForceClose:function()
        { 
            if (this._asyncDestroy != null)
            { 
            	this.CancelAsyncDestroy(); 
            	this.DestroyWindow();
            } 
        },

 
//        private object 
        HandleDeactivateApphandled:function(/*object*/ arg)
        {
            if (!this.StaysOpen)
            { 
                // If we are in an auto-close mode and the app is deactivating, close the popup.
                this.SetCurrentValueInternal(Popup.IsOpenProperty, false); 
            } 

            FirePopupCouldClose(); 

            return null;
        },
 
        // Updates the transform applied to the decorator in PopupRoot
        // For non transparent windows, this is restricted to scale transforms only 
//        private void 
        UpdateTransform:function() 
        {
            // Directly apply layout and render transforms for the popup because collapsed 
            // elements' transforms are not accounted for in TransformToAncestor
            /*Matrix*/var popupTransform = LayoutTransform.Value * RenderTransform.Value;

            // When the popup is not in a visual tree, do not apply the transform from target to root 
            /*DependencyObject*/var parent = VisualTreeHelper.GetParent(this);
 
            // Sometimes it is possible that the Popup isn't connected to the root through purely 
            // visual links. In that case, we can't calculate a transform matrix and we'll get
            // an InvalidOperationException from TransformToAncestor. 
            // Since this isn't an illegal state for Popup to be in, we're walking the
            // target's visual parent chain to find the top-most root possible.
            // Catching the exception was rejected by architects.
            /*Visual*/var rootVisual = parent == null ? null : GetRootVisual(this); 
            if (rootVisual != null)
            { 
                // Apply all transforms from target to window coordinate space 
                popupTransform = popupTransform *                                         //Transform applied directly to popup
                                 TransformToAncestor(rootVisual).AffineTransform.Value *  //Transform between popup and root (Affine only) 
                                 PointUtil.GetVisualTransform(rootVisual);                //Transform applied directly to root
            }

            // Transparent popups can have any type of transforms applied to them 
            // For non-transparent popups, generate a scale matrix from the original transform
            if (this.IsTransparent) 
            { 
                // Undo mirror transform from Flow Direction - popup root will get its own
                if (parent != null && /*(FlowDirection)*/parent.GetValue(FlowDirectionProperty) == FlowDirection.RightToLeft) 
                {
                    // Undo FlowDirection Mirror
                    popupTransform.Scale(-1.0, 1.0);
 
                }
            } 
            else 
            {
                // Only apply scaling transforms 
                // Estimate the scale by seeing how much sides on a square grew
                /*Vector*/var transformedUnitX = popupTransform.Transform(new Vector(1.0, 0.0));
                /*Vector*/var transformedUnitY = popupTransform.Transform(new Vector(0.0, 1.0));
 
                // replace the transform with a scale only transform
                popupTransform = new Matrix(); 
                popupTransform.Scale(transformedUnitX.Length, transformedUnitY.Length); 
            }
 
            this._popupRoot.Transform = new MatrixTransform(popupTransform);
        },

//        private void 
        OnWindowResize:function(/*object*/ sender, /*AutoResizedEventArgs*/ e) 
        {
            // _positionInfo can be null if an exception aborted the measure process. 
            // We can't recover from this, but we can let the app/user know what 
            // caused the original exception.
            if (_positionInfo == null) 
            {
                /*Exception*/var nre = new NullReferenceException();
                throw new NullReferenceException(nre.Message, SavedException);
            } 
            else
            { 
                // if the app has recovered from original exception, clear the field 
                SavedExceptionField.ClearValue(this);
            } 

            if (e.Size != _positionInfo.ChildSize)
            {
                _positionInfo.ChildSize = e.Size; 

                // Reposition the popup 
                Reposition(); 
            }
        },

        /// <summary> 
        /// Reposition the Popup
        /// </summary> 
//        internal void 
        Reposition:function() 
        {
            if (this.IsOpen && _secHelper.IsWindowAlive()) 
            {
                if (CheckAccess())
                {
                    UpdatePosition(); 
                }
                else 
                { 
                    Dispatcher.BeginInvoke(DispatcherPriority.Normal, new DispatcherOperationCallback(/*delegate*/function(/*object*/ param)
                    { 
//                        Debug.Assert(CheckAccess(), "AsyncReposition not called on the dispatcher thread.");

                        Reposition();
 
                        return null;
                    }), null); 
                } 
            }
        }, 
 
 
        // To position the popup, we find the InterestPoints of the placement rectangle/point
        // in the screen coordinate space.  We also find the InterestPoints of the child in 
        // the popup's space.  Then we attempt all valid combinations of matching InterestPoints
        // (based on PlacementMode) to find the position that best fits on the screen.
        // NOTE: any reference to the screen implies the monitor for full trust and
        //       the browser area for partial trust 
//        private void 
        UpdatePosition:function()
        { 
            if (this._popupRoot == null) 
                return;
 
            /*PlacementMode*/var placement = Placement;

            // Get a list of the corners of the target/child in screen space
            /*Point[]*/var placementTargetInterestPoints = GetPlacementTargetInterestPoints(placement); 
            /*Point[]*/var childInterestPoints = GetChildInterestPoints(placement);
 
            // Find bounds of screen and child in screen space 
            /*Rect*/var targetBounds = GetBounds(placementTargetInterestPoints);
            /*Rect*/var screenBounds; 
            /*Rect*/var childBounds = GetBounds(childInterestPoints);

            /*double*/var childArea = childBounds.Width * childBounds.Height;
 
            // Rank possible positions
            var bestIndex = -1; 
            /*Vector*/var bestTranslation = new Vector(_positionInfo.X, _positionInfo.Y); 
            var bestScore = -1;
            /*PopupPrimaryAxis*/var bestAxis = PopupPrimaryAxis.None; 

            var positions;

            /*CustomPopupPlacement[]*/var customPlacements = null; 

            // Find the number of possible positions 
            if (placement == PlacementMode.Custom) 
            {
                /*CustomPopupPlacementCallback*/var customCallback = CustomPopupPlacementCallback; 
                if (customCallback != null)
                {
                    customPlacements = customCallback(childBounds.Size, targetBounds.Size, new Point(HorizontalOffset, VerticalOffset));
                } 
                positions = customPlacements == null ? 0 : customPlacements.Length;
 
                // Return if callback closed the popup 
                if (!IsOpen)
                    return; 
            }
            else
            {
                positions = GetNumberOfCombinations(placement); 
            }
 
            // Try each position until the best one is found 
            for (var i = 0; i < positions; i++)
            { 
                /*Vector*/var popupTranslation;

                var animateFromRight = false;
                var animateFromBottom = false; 

                /*PopupPrimaryAxis*/var axis; 
 
                // Get the ith Position to rank
                if (placement == PlacementMode.Custom) 
                {
                    // The custom callback only calculates relative to 0,0
                    // so the placementTarget's top/left need to be re-applied.
                    popupTranslation = (placementTargetInterestPoints[InterestPoint.TopLeft]) 
                                      + (customPlacements[i].Point);  // vector from origin
 
                    axis = customPlacements[i].PrimaryAxis; 
                }
                else 
                {
                    /*PointCombination*/var pointCombination = GetPointCombination(placement, i, /*out*/ axis);

                    /*InterestPoint*/var targetInterestPoint = pointCombination.TargetInterestPoint; 
                    /*InterestPoint*/var childInterestPoint = pointCombination.ChildInterestPoint;
 
                    // Compute the vector from the screen origin to the top left corner of the popup 
                    // that will cause the the two interest points to overlap
                    popupTranslation = placementTargetInterestPoints[targetInterestPoint] 
                                       - childInterestPoints[childInterestPoint];

                    // Check the matching points to see which direction to animate
                    animateFromRight = childInterestPoint == InterestPoint.TopRight || childInterestPoint == InterestPoint.BottomRight; 
                    animateFromBottom = childInterestPoint == InterestPoint.BottomLeft || childInterestPoint == InterestPoint.BottomRight;
                } 
 
                // Find percent of popup on screen by translating the popup bounds
                // and calculating the percent of the bounds that is on screen 
                // Note: this score is based on the percent of the popup that is on screen
                //       not the percent of the child that is on screen.  For certain
                //       scenarios, this may produce in counter-intuitive results.
                //       If this is a problem, more complex scoring is needed 
                /*Rect*/var tranlsatedChildBounds = Rect.Offset(childBounds, popupTranslation);
                screenBounds = GetScreenBounds(targetBounds, placementTargetInterestPoints[InterestPoint.TopLeft]); 
                /*Rect*/var currentIntersection = Rect.Intersect(screenBounds, tranlsatedChildBounds); 

                // Calculate area of intersection 
                /*double*/var score = currentIntersection != Rect.Empty ? currentIntersection.Width * currentIntersection.Height : 0;

                // If current score is better than the best score so far, save the position info
                if (score - bestScore > Tolerance) 
                {
                    bestIndex = i; 
                    bestTranslation = popupTranslation; 
                    bestScore = score;
                    bestAxis = axis; 

                    this.AnimateFromRight = animateFromRight;
                    this.AnimateFromBottom = animateFromBottom;
 
                    // Stop when we find a popup that is completely on screen
                    if (Math.Abs(score - childArea) < Tolerance) 
                    { 
                        break;
                    } 
                }
            }

            // When going left/right, if the edge of the monitor is hit 
            // the next popup going left/right must also go in the opposite direction
            if ((bestIndex >= 2) && (placement == PlacementMode.Right || placement == PlacementMode.Left)) 
            { 
                // We switched sides, so flip the DropOpposite flag
                DropOpposite = !DropOpposite; 
            }

            // Check to see if the pop needs to be nudged onto the screen.
            // Popups are not nudged if their axes do not align with the screen axes 

            // Use the size of the popupRoot in case it is clipping the popup content 
            childBounds = new Rect(_secHelper.GetTransformToDevice().Transform(_popupRoot.RenderSize)); 

            childBounds.Offset(bestTranslation); 
            screenBounds = GetScreenBounds(targetBounds, placementTargetInterestPoints[InterestPoint.TopLeft]);
            /*Rect*/var intersection = Rect.Intersect(screenBounds, childBounds);

            // See if width/height of intersection are less than child's 
            if (Math.Abs(intersection.Width - childBounds.Width) > Tolerance ||
                Math.Abs(intersection.Height - childBounds.Height) > Tolerance) 
            { 

                // Nudge Horizontally 
                /*Point*/var topLeft = placementTargetInterestPoints[InterestPoint.TopLeft];
                /*Point*/var topRight = placementTargetInterestPoints[InterestPoint.TopRight];

                // Create a vector pointing from the top of the placement target to the bottom 
                // to determine which direction the popup should be nudged in.
                // If the vector is zero (NaN's after normalization), nudge horizontally 
                /*Vector*/var horizontalAxis = topRight - topLeft; 
                horizontalAxis.Normalize();
 
                // See if target's horizontal axis is aligned with screen
                // (For opaque windows always translate horizontally)
                if (!IsTransparent || double.IsNaN(horizontalAxis.Y) || Math.Abs(horizontalAxis.Y) < Tolerance)
                { 
                    // Nudge horizontally
                    if (childBounds.Right > screenBounds.Right) 
                    { 
                        bestTranslation.X = screenBounds.Right - childBounds.Width;
                    } 
                    else if (childBounds.Left < screenBounds.Left)
                    {
                        bestTranslation.X = screenBounds.Left;
                    } 
                }
                else if (IsTransparent && Math.Abs(horizontalAxis.X) < Tolerance) 
                { 
                    // Nudge vertically, limit horizontally
                    if (childBounds.Bottom > screenBounds.Bottom) 
                    {
                        bestTranslation.Y = screenBounds.Bottom - childBounds.Height;
                    }
                    else if (childBounds.Top < screenBounds.Top) 
                    {
                        bestTranslation.Y = screenBounds.Top; 
                    } 
                }
 
                // Nudge Vertically
                /*Point*/var bottomLeft = placementTargetInterestPoints[InterestPoint.BottomLeft];

                // Create a vector pointing from the top of the placement target to the bottom 
                // to determine which direction the popup should be nudged in
                // If the vector is zero (NaN's after normalization), nudge vertically 
                /*Vector*/var verticalAxis = topLeft - bottomLeft; 
                verticalAxis.Normalize();
 
                // Axis is aligned with screen, nudge
                if (!IsTransparent || double.IsNaN(verticalAxis.X) || Math.Abs(verticalAxis.X) < Tolerance)
                {
                    if (childBounds.Bottom > screenBounds.Bottom) 
                    {
                        bestTranslation.Y = screenBounds.Bottom - childBounds.Height; 
                    } 
                    else if (childBounds.Top < screenBounds.Top)
                    { 
                        bestTranslation.Y = screenBounds.Top;
                    }
                }
                else if (IsTransparent && Math.Abs(verticalAxis.Y) < Tolerance) 
                {
                    if (childBounds.Right > screenBounds.Right) 
                    { 
                        bestTranslation.X = screenBounds.Right - childBounds.Width;
                    } 
                    else if (childBounds.Left < screenBounds.Left)
                    {
                        bestTranslation.X = screenBounds.Left;
                    } 
                }
            } 
 
            // Finally, take the best position and apply it to the popup
            var bestX = DoubleUtil.DoubleToInt(bestTranslation.X); 
            var bestY = DoubleUtil.DoubleToInt(bestTranslation.Y);
            if (bestX != _positionInfo.X || bestY != _positionInfo.Y)
            {
                _positionInfo.X = bestX; 
                _positionInfo.Y = bestY;
                _secHelper.SetPopupPos(true, bestX, bestY, false, 0, 0); 
            } 
        },
 
        // Finds the screen size and limiting dimension.
        // Popups are restricted in the orthogonal dimension to the primary/nudge axis
        // This prevents the popup from overlapping the placement target.
//        private void 
        GetPopupRootLimits:function(/*out Rect targetBounds*/targetBoundsOut, /*out Rect screenBounds*/screenBoundsOut, 
        		/*out Size limitSize*/limitSizeOut) 
        {
            /*PlacementMode*/var placement = Placement; 
 
            // Get a list of the corners of the target/child in screen space
            /*Point[]*/var placementTargetInterestPoints = GetPlacementTargetInterestPoints(placement); 

            // Find bounds of screen and child in screen space
            targetBounds = GetBounds(placementTargetInterestPoints);
            screenBounds = GetScreenBounds(targetBounds, placementTargetInterestPoints[InterestPoint.TopLeft]); 

            /*PopupPrimaryAxis*/var nudgeAxis = GetPrimaryAxis(placement); 
 
            limitSize = new Size(Double.PositiveInfinity, Double.PositiveInfinity);
 
            if (nudgeAxis == PopupPrimaryAxis.Horizontal)
            {
                // limit vertically
                /*Point*/var topLeft = placementTargetInterestPoints[InterestPoint.TopLeft]; 
                /*Point*/var bottomLeft = placementTargetInterestPoints[InterestPoint.BottomLeft];
 
                // Create a vector pointing from the top of the placement target to the bottom 
                // to determine which direction the popup should be restricted in
                // If the vector is zero (NaN's after normalization), restrict vertically 
                /*Vector*/var verticalAxis = bottomLeft - topLeft;
                verticalAxis.Normalize();

                // Axis is aligned with screen, limit 
                if (!IsTransparent || double.IsNaN(verticalAxis.X) || Math.Abs(verticalAxis.X) < Tolerance)
                { 
                    limitSize.Height = Math.Max(0.0, Math.Max(screenBounds.Bottom - targetBounds.Bottom, targetBounds.Top - screenBounds.Top)); 
                }
                else if (IsTransparent && Math.Abs(verticalAxis.Y) < Tolerance) 
                {
                    limitSize.Width = Math.Max(0.0, Math.Max(screenBounds.Right - targetBounds.Right, targetBounds.Left - screenBounds.Left));
                }
            } 
            else if (nudgeAxis == PopupPrimaryAxis.Vertical)
            { 
                // limit horizontally 
                /*Point*/var topLeft = placementTargetInterestPoints[InterestPoint.TopLeft];
                /*Point*/var topRight = placementTargetInterestPoints[InterestPoint.TopRight]; 

                // Create a vector pointing from the left of the placement target to the right
                // to determine which direction the popup should be restricted in
                // If the vector is zero (NaN's after normalization), restrict horizontally 
                /*Vector*/var horizontalAxis = topRight - topLeft;
                horizontalAxis.Normalize(); 
 
                // Axis is aligned with screen, limit
                if (!IsTransparent || double.IsNaN(horizontalAxis.X) || Math.Abs(horizontalAxis.Y) < Tolerance) 
                {
                    limitSize.Width = Math.Max(0.0, Math.Max(screenBounds.Right - targetBounds.Right, targetBounds.Left - screenBounds.Left));
                }
                else if (IsTransparent && Math.Abs(horizontalAxis.X) < Tolerance) 
                {
                    limitSize.Height = Math.Max(0.0, Math.Max(screenBounds.Bottom - targetBounds.Bottom, targetBounds.Top - screenBounds.Top)); 
                } 
            }
        }, 

        // Retrieves a list of the interesting points of the popup target in screen space
//        private Point[] 
        GetPlacementTargetInterestPoints:function(/*PlacementMode*/ placement)
        { 
            if (_positionInfo == null)
            { 
                _positionInfo = new PositionInfo(); 
            }
 
            // Calculate the placement rectangle, which is the rectangle that popup will position relative to.
            /*Rect*/var placementRect = PlacementRectangle;

            /*Point[]*/var interestPoints; 

            /*UIElement*/var target = GetTarget();
            target = target instanceof UIElement ? target : null; 
 
            /*Vector*/var offset = new Vector(HorizontalOffset, VerticalOffset);
 
            // Popup positioning is based on the PlacementTarget or the Placement mode
            if (target == null || IsAbsolutePlacementMode(placement))
            {
                // When the Mode is Mouse, the placement rectangle is the mouse position 
                if (placement == PlacementMode.Mouse || placement == PlacementMode.MousePoint)
                { 
                    if (_positionInfo.MouseRect == Rect.Empty) 
                    {
                        // Everytime something changes we will reposition the popup.  We generally don't 
                        // want to get a new position for the mouse at every reposition (for example,
                        // if the popup's content size is animated the popup will keep repositioning,
                        // but we should not pick up a new position for the mouse).
                        _positionInfo.MouseRect = GetMouseRect(placement); 
                    }
 
                    placementRect = _positionInfo.MouseRect; 
                }
                else if (placementRect == Rect.Empty) 
                {
                    placementRect = new Rect();
                }
 
                offset = _secHelper.GetTransformToDevice().Transform(offset);
 
                // Offset the rect 
                placementRect.Offset(offset);
 
                // These points are already positioned in screen coordinates
                // no transformations are necessary
                interestPoints = InterestPointsFromRect(placementRect);
            } 
            else
            { 
                // If no rectangle was given, then use the render bounds of the target 
                if (placementRect == Rect.Empty)
                { 
                    if (placement != PlacementMode.Relative && placement != PlacementMode.RelativePoint)
                        placementRect = new Rect(0.0, 0.0, target.RenderSize.Width, target.RenderSize.Height);
                    else // For relative and relative point use upperleft corner of target
                        placementRect = new Rect(); 
                }
 
                // Offset the rect 
                placementRect.Offset(offset);
 
                // Get the points int the target's coordinate space
                interestPoints = InterestPointsFromRect(placementRect);

                // Next transform from the target's space to the screen space 
                /*Visual*/var rootVisual = GetRootVisual(target);
                /*GeneralTransform*/var targetToClientTransform = TransformToClient(target, rootVisual); 
 
                // transform point to the screen coordinate space
                for (var i = 0; i < 5; i++) 
                {
                    targetToClientTransform.TryTransform(interestPoints[i], /*out interestPoints[i]*/interestPointsOut[i]);

                    interestPoints[i] = _secHelper.ClientToScreen(rootVisual, interestPoints[i]); 
                }
            } 
 
            return interestPoints;
        },

        // Retrieves a list of the interesting points of the popups child in the popup window space 
//        private Point[] 
        GetChildInterestPoints:function(/*PlacementMode*/ placement)
        {
            /*UIElement*/var child = Child;
 
            if (child == null)
            { 
                return InterestPointsFromRect(new Rect()); 
            }
 
            /*Point[]*/var interestPoints = InterestPointsFromRect(new Rect(new Point(), child.RenderSize));


            /*UIElement*/var target = GetTarget();
            target =target instanceof UIElement ? target : null; 

            // Popup positioning is based on the PlacementTarget or the Placement mode 
            if (target != null && !IsAbsolutePlacementMode(placement)) 
            {
                // In scenarios where the flow direction is different between the 
                // child and target, the child rect should be treated as it is flipped
                if (target.GetValue(FlowDirectionProperty) !=
                    child.GetValue(FlowDirectionProperty))
                { 
                    SwapPoints(/*ref*/ interestPoints[InterestPoint.TopLeft], /*ref*/ interestPoints[InterestPoint.TopRight]);
                    SwapPoints(/*ref*/ interestPoints[InterestPoint.BottomLeft], /*ref */interestPoints[InterestPoint.BottomRight]); 
                } 
            }
 
            // Use remove the render transform translation from the child
            /*Vector*/var offset = this._popupRoot.AnimationOffset;

            // Transform InterestPoints to popup's space 
            /*GeneralTransform*/var childToPopupTransform = TransformToClient(child, _popupRoot);
 
            for (var i = 0; i < 5; i++) 
            {
                // subtract Animation offset and transform point to the screen coordinate space 
                childToPopupTransform.TryTransform(interestPoints[i] - offset, /*out*/ interestPoints[i]);
            }

            return interestPoints; 
        },

        // Gets the smallest rectangle that contains all points in the list
//        private Rect 
        GetBounds:function(/*Point[]*/ interestPoints) 
        {
            /*double*/var left, right, top, bottom; 
 
            left = right = interestPoints[0].X;
            top = bottom = interestPoints[0].Y; 

            for (var i = 1; i < interestPoints.Length; i++)
            {
                /*double*/var x = interestPoints[i].X; 
                /*double*/var y = interestPoints[i].Y;
                if (x < left)   left = x; 
                if (x > right)  right = x; 
                if (y < top)    top = y;
                if (y > bottom) bottom = y; 
            }
            return new Rect(left, top, right - left, bottom - top);
        },

        // Returns the ith possible alignment for the given PlacementMode 
//        private PointCombination 
        GetPointCombination:function(/*PlacementMode*/ placement, /*int*/ i, /*out PopupPrimaryAxis axis*/axisOut) 
        {
//            Debug.Assert(i >= 0 && i < GetNumberOfCombinations(placement)); 

            var dropFromRight = SystemParameters.MenuDropAlignment;

            switch (placement) 
            {
                case PlacementMode.Bottom: 
                case PlacementMode.Mouse: 
                    axis = PopupPrimaryAxis.Horizontal;
                    if (dropFromRight) 
                    {
                        if (i == 0) return new PointCombination(InterestPoint.BottomRight, InterestPoint.TopRight);
                        if (i == 1) return new PointCombination(InterestPoint.TopRight, InterestPoint.BottomRight);
                    } 
                    else
                    { 
                        if (i == 0) return new PointCombination(InterestPoint.BottomLeft, InterestPoint.TopLeft); 
                        if (i == 1) return new PointCombination(InterestPoint.TopLeft, InterestPoint.BottomLeft);
                    } 
                    break;


                case PlacementMode.Top: 
                    axis = PopupPrimaryAxis.Horizontal;
                    if (dropFromRight) 
                    { 
                        if (i == 0) return new PointCombination(InterestPoint.TopRight, InterestPoint.BottomRight);
                        if (i == 1) return new PointCombination(InterestPoint.BottomRight, InterestPoint.TopRight); 

                    }
                    else
                    { 
                        if (i == 0) return new PointCombination(InterestPoint.TopLeft, InterestPoint.BottomLeft);
                        if (i == 1) return new PointCombination(InterestPoint.BottomLeft, InterestPoint.TopLeft); 
 
                    }
                    break; 


                case PlacementMode.Right:
                case PlacementMode.Left: 
                    axis = PopupPrimaryAxis.Vertical;
                    dropFromRight |= DropOpposite; 
 
                    if ((dropFromRight && placement == PlacementMode.Right) ||
                        (!dropFromRight && placement == PlacementMode.Left)) 
                    {
                        if (i == 0) return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopRight);
                        if (i == 1) return new PointCombination(InterestPoint.BottomLeft, InterestPoint.BottomRight);
                        if (i == 2) return new PointCombination(InterestPoint.TopRight, InterestPoint.TopLeft); 
                        if (i == 3) return new PointCombination(InterestPoint.BottomRight, InterestPoint.BottomLeft);
                    } 
                    else 
                    {
                        if (i == 0) return new PointCombination(InterestPoint.TopRight, InterestPoint.TopLeft); 
                        if (i == 1) return new PointCombination(InterestPoint.BottomRight, InterestPoint.BottomLeft);
                        if (i == 2) return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopRight);
                        if (i == 3) return new PointCombination(InterestPoint.BottomLeft, InterestPoint.BottomRight);
                    } 
                    break;
 
                case PlacementMode.Relative: 
                case PlacementMode.RelativePoint:
                case PlacementMode.MousePoint: 
                case PlacementMode.AbsolutePoint:
                    axis = PopupPrimaryAxis.Horizontal;
                    if (dropFromRight)
                    { 
                        if (i == 0) return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopRight);
                        if (i == 1) return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopLeft); 
                        if (i == 2) return new PointCombination(InterestPoint.TopLeft, InterestPoint.BottomRight); 
                        if (i == 3) return new PointCombination(InterestPoint.TopLeft, InterestPoint.BottomLeft);
                    } 
                    else
                    {
                        if (i == 0) return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopLeft);
                        if (i == 1) return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopRight); 
                        if (i == 2) return new PointCombination(InterestPoint.TopLeft, InterestPoint.BottomLeft);
                        if (i == 3) return new PointCombination(InterestPoint.TopLeft, InterestPoint.BottomRight); 
                    } 
                    break;
 
                case PlacementMode.Center:
                    axis = PopupPrimaryAxis.None;
                    return new PointCombination(InterestPoint.Center, InterestPoint.Center);
 
                case PlacementMode.Absolute:
                case PlacementMode.Custom: 
                default: 
                    axis = PopupPrimaryAxis.None;
                    return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopLeft); 
            }

            return new PointCombination(InterestPoint.TopLeft, InterestPoint.TopRight);
        },
 
        // Limit size to 75% of maxDimension's area and restrict to be smaller than limitDimension
//        internal Size 
        RestrictSize:function(/*Size*/ desiredSize) 
        { 
            // Make sure screen bounds and limit dimensions are up to date
            /*Rect*/var targetBounds, screenBounds; 
            /*Size*/var limitSize;
            GetPopupRootLimits(/*out*/ targetBounds, /*out*/ screenBounds, /*out*/ limitSize);

            // Convert from popup's space to screen space 
            desiredSize = _secHelper.GetTransformToDevice().Transform(desiredSize);
 
            desiredSize.Width = Math.Min(desiredSize.Width, screenBounds.Width); 
            desiredSize.Width = Math.Min(desiredSize.Width, limitSize.Width);
 
            /*double*/var maxHeight = RestrictPercentage * screenBounds.Width * screenBounds.Height / desiredSize.Width;

            desiredSize.Height = Math.Min(desiredSize.Height, screenBounds.Height);
            desiredSize.Height = Math.Min(desiredSize.Height, maxHeight); 
            desiredSize.Height = Math.Min(desiredSize.Height, limitSize.Height);
 
            // Convert back from screen space to popup's space 
            desiredSize = _secHelper.GetTransformFromDevice().Transform(desiredSize);
 
            return desiredSize;
        },

        // Paramter: Point p should be the most interesting point of a pop up positioning.  The top left. 
        // Return the maximum boundingRect for the popup.
        // If this is not a child-popup 
        //      and the Point p passed in is inside of the Work Area then return the monitor work area rect 
        //          A tooltip opened above the taskbar will never display over/under the taskbar.
        //          To accomodate this the work area of the screen is returned to allow the pop up to 
        //          respect the reserved area of the teskbar.
        //       and the Point p passed in is outside of the work area then return the monitor rect
        //          this can happen If the program is an appbar program (http://msdn.microsoft.com/en-us/library/cc144177(VS.85).aspx)
        //          and the tooltip is in the area removed from the work area.  In this case the tooltip can 
        //          be placed without regard for the work area bounds.
        // Else this is the BoundingRect of either the placement target's window or the parent of the popup's window. 
//        private Rect 
        GetScreenBounds:function(/*Rect*/ boundingBox, /*Point*/ p) 
        {
            if (_secHelper.IsChildPopup) 
            {
                // The "monitor" is the main window for child windows.
                return _secHelper.GetParentWindowRect();
            } 

            /*NativeMethods.RECT*/var rect = new NativeMethods.RECT(0, 0, 0, 0); 
 
            /*NativeMethods.RECT*/var nativeBounds = PointUtil.FromRect(boundingBox);
            /*IntPtr*/var monitor = SafeNativeMethods.MonitorFromRect(/*ref*/ nativeBounds, NativeMethods.MONITOR_DEFAULTTONEAREST); 

            if (monitor != IntPtr.Zero)
            {
                /*NativeMethods.MONITORINFOEX*/var monitorInfo = new NativeMethods.MONITORINFOEX(); 

                monitorInfo.cbSize = Marshal.SizeOf(typeof(NativeMethods.MONITORINFOEX)); 
                SafeNativeMethods.GetMonitorInfo(new HandleRef(null, monitor), monitorInfo); 

                //If this is a pop up for a menu or ToolTip then respect the work area if opening in the work area. 
                if (((this.Child instanceof MenuBase)
                    || (this.Child instanceof ToolTip)
                    || (this.TemplatedParent instanceof MenuItem))
                    && ((p.X >= monitorInfo.rcWork.left) 
                        && (p.X <= monitorInfo.rcWork.right)
                        && (p.Y >= monitorInfo.rcWork.top) 
                        && (p.Y <= monitorInfo.rcWork.bottom))) 
                {
                    // Context Menus, MenuItems, and ToolTips shouldn't go over the Taskbar 
                    rect = monitorInfo.rcWork;
                }
                else
                { 
                    rect = monitorInfo.rcMonitor;
                } 
            } 

            return PointUtil.ToRect(rect); 

        },

//        private Rect 
        GetMouseRect:function(/*PlacementMode*/ placement) 
        {
            /*NativeMethods.POINT*/var mousePoint = _secHelper.GetMouseCursorPos(GetTarget()); 
 
            if (placement == PlacementMode.Mouse)
            { 
                // In Mouse mode, the bounding box of the mouse cursor becomes the target
                var cursorWidth, cursorHeight, hotX, hotY;
                GetMouseCursorSize(/*out*/ cursorWidth, /*out*/ cursorHeight, /*out*/ hotX, /*out*/ hotY);
 
                // Add a margin of 1 px above and below the mouse
                return new Rect(mousePoint.x, mousePoint.y - 1, Math.Max(0, cursorWidth - hotX), Math.Max(0, cursorHeight - hotY + 2)); 
            } 
            else
            { 
                // In MousePoint mode, the mouse position is the target
                return new Rect(mousePoint.x, mousePoint.y, 0, 0);
            }
        },
        
        /// <summary>
        ///     Event indicating that IsOpen has changed to true. 
        /// </summary> 
//        public event EventHandler Opened
//        { 
//            add { EventHandlersStoreAdd(Popup.OpenedKey, value); }
//            remove { EventHandlersStoreRemove(Popup.OpenedKey, value); }
//        },
        AddOpened:function(value) { this.EventHandlersStoreAdd(Popup.OpenedKey, value); },
        RemoveOpened:function(value) { this.EventHandlersStoreRemove(Popup.OpenedKey, value); },

        /// <summary> 
        ///     Event indicating that IsOpen has changed to false. 
        /// </summary>
//        public event EventHandler Closed
//        {
//            add { this.EventHandlersStoreAdd(Popup.ClosedKey, value); }
//            remove { this.EventHandlersStoreRemove(Popup.ClosedKey, value); }
//        }, 
        
        AddClosed:function(value) { this.EventHandlersStoreAdd(Popup.ClosedKey, value); },
        RemoveClosed:function(value) { this.EventHandlersStoreRemove(Popup.ClosedKey, value); },
	});
	
	Object.defineProperties(Popup.prototype,{
 
        /// <summary>
        ///     The content of the Popup
        /// </summary>
//        public UIElement 
        Child:
        { 
            get:function() { return this.GetValue(Popup.ChildProperty); },
            set:function(value) { this.SetValue(Popup.ChildProperty, value); }
        }, 

        /// <summary>
        /// Indicates whether the Popup is visible.
        /// </summary> 
//        public bool 
        IsOpen: 
        { 
            get:function() { return this.GetValue(Popup.IsOpenProperty); },
            set:function(value) { this.SetValue(Popup.IsOpenProperty, value); } 
        },


        /// <summary> 
        ///     Chooses the behavior of where the Popup should be placed on screen.
        /// </summary>
//        public PlacementMode 
        Placement: 
        {
            get:function() { return this.GetValue(Popup.PlacementProperty); },
            set:function(value) { this.SetValue(Popup.PlacementProperty, value); } 
        },
 
        /// <summary> 
        ///     Chooses the behavior of where the Popup should be placed on screen.
        /// </summary> 
//        public CustomPopupPlacementCallback 
        CustomPopupPlacementCallback:
        { 
            get:function() { return this.GetValue(Popup.CustomPopupPlacementCallbackProperty); },
            set:function(value) { this.SetValue(Popup.CustomPopupPlacementCallbackProperty, value); }
        },
 
        /// <summary>
        ///     Chooses the behavior of when the Popup should automatically close.
        /// </summary>
//        public bool 
        StaysOpen:
        { 
            get:function() { return this.GetValue(Popup.StaysOpenProperty); },
            set:function(value) { this.SetValue(Popup.StaysOpenProperty, value); }
        }, 

        /// <summary> 
        ///     Offset from the left of the desired location based on the Placement property.
        ///     Percentages are based on the visual parent, if one exists.
        /// </summary>
//        public double 
        HorizontalOffset: 
        { 
            get:function() { return this.GetValue(Popup.HorizontalOffsetProperty); },
            set:function(value) { this.SetValue(Popup.HorizontalOffsetProperty, value); } 
        },

        /// <summary> 
        ///     Offset from the top of the desired location based on the Placement property.
        ///     Percentages are based on the visual parent, if one exists.
        /// </summary>
//        public double 
        VerticalOffset: 
        { 
            get:function() { return this.GetValue(Popup.VerticalOffsetProperty); },
            set:function(value) { this.SetValue(Popup.VerticalOffsetProperty, value); } 
        },
 
        /// <summary> 
        /// The UIElement relative to which the Popup will be displayed. If PlacementTarget is null (which
        /// it is by default), the Popup is displayed relative to its visual parent. 
        /// </summary>
//        public UIElement 
        PlacementTarget: 
        {
            get:function() { return this.GetValue(Popup.PlacementTargetProperty); },
            set:function(value) { this.SetValue(Popup.PlacementTargetProperty, value); } 
        },
 
        /// <summary> 
        /// The rectangle relative to which the Popup will be displayed. If PlacementRectangle is null (which 
        /// it is by default), the Popup is displayed relative to its visual parent.
        /// </summary> 
//        public Rect 
        PlacementRectangle:
        {
            get:function() { return this.GetValue(Popup.PlacementRectangleProperty); },
            set:function(value) { this.SetValue(Popup.PlacementRectangleProperty, value); }
        }, 
 
        /// <summary>
        ///     Indicates whether Right and Left placement modes should drop 
        ///     the opposite of normal. This happens when they hit the edge
        ///     of the monitor and have to flip. The next popup needs to know
        ///     to continue going in the opposite direction.
        /// </summary> 
//        internal bool 
        DropOpposite:
        { 
            get:function() 
            {
                var opposite = false; 

                if (this._cacheValid.Get(CacheBits.DropOppositeSet))
                {
                    opposite = this._cacheValid.Get(CacheBits.DropOpposite); 
                }
                else 
                { 
                    /*DependencyObject*/var parent = this;
                    do 
                    {
                        parent = VisualTreeHelper.GetParent(parent);
                        /*PopupRoot*/var popupRoot = parent instanceof PopupRoot ? popupRoot : null;
                        if (popupRoot != null) 
                        {
                            /*Popup*/var popup = popupRoot.Parent instanceof Popup ? popupRoot.Parent : null; 
                            parent = popup; 
                            if (popup != null)
                            { 
                                if (popup._cacheValid.Get(CacheBits.DropOppositeSet))
                                {
                                    opposite = popup._cacheValid.Get(CacheBits.DropOpposite);
                                    break; 
                                }
                            } 
                        } 
                    }
                    while (parent != null); 
                }

                return opposite;
            },
            set:function(value) 
            { 
            	this._cacheValid.Set(CacheBits.DropOpposite, value);
                this._cacheValid.Set(CacheBits.DropOppositeSet, true); 
            }
        },
 
        /// <summary> 
        ///     The animation type of the popup.
        ///     This value of this property will take effect the next time the popup opens. 
        /// </summary>
//        public PopupAnimation 
        PopupAnimation:
        { 
            get:function() { return this.GetValue(Popup.PopupAnimationProperty); },
            set:function(value) { this.SetValue(Popup.PopupAnimationProperty, value); } 
        },

        /// <summary> 
        /// Whether or not the "popup" allows transparent content
        /// </summary> 
//        public bool 
        AllowsTransparency:
        {
            get:function() { return this.GetValue(Popup.AllowsTransparencyProperty); },
            set:function(value) { this.SetValue(Popup.AllowsTransparencyProperty, value); } 
        },
 
        /// <summary> 
        /// Whether or not the "popup" should have a drop shadow according to
        /// the DropShadow system parameters 
        /// </summary>
//        public bool 
        HasDropShadow:
        {
            get:function() { return this.GetValue(Popup.HasDropShadowProperty); } 
        },
 
 
        /// <summary>
        ///     Returns enumerator to logical children. 
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function()
            {
                var content = this.Child;
 
                if (content == null)
                { 
                    return EmptyEnumerator.Instance; 
                }
 
                return new PopupModelTreeEnumerator(this, content);
            }
        },

//        internal Exception 
        SavedException:
        { 
            get:function() { return SavedExceptionField.GetValue(this); },
            set:function(value) { SavedExceptionField.SetValue(this, value); } 
        }, 

//        private bool 
        IsTransparent: 
        {
            get:function() { return this._cacheValid.Get(CacheBits.IsTransparent); },
            set:function(value) { this._cacheValid.Set(CacheBits.IsTransparent, value); } 
        },
 
//        private bool 
        AnimateFromRight:
        {
            get:function() { return this._cacheValid.Get(CacheBits.AnimateFromRight); },
            set:function(value) { this._cacheValid.Set(CacheBits.AnimateFromRight, value); } 
        },
 
//        private bool 
        AnimateFromBottom: 
        {
            get:function() { return this._cacheValid.Get(CacheBits.AnimateFromBottom); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.AnimateFromBottom, value); }
        },

//        internal bool 
        HitTestable: 
        {
            // Store complement of value so default is true 
            get:function() { return !this._cacheValid.Get(CacheBits.HitTestable); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.HitTestable, !value); }
        }, 

//        private bool 
        IsDragDropActive:
        {
            get:function() { return this._cacheValid.Get(CacheBits.IsDragDropActive); }, 
            set:function(value) { this._cacheValid.Set(CacheBits.IsDragDropActive, value); }
        },
        
        /// <summary> 
        /// 
//        internal event EventHandler 
        PopupCouldClose:
        {
        	get:function(){
        		if(Popup._PopupCouldClose === undefined){
        			Popup._PopupCouldClose = new Delegate(); 
        		}
        		
        		return Popup._PopupCouldClose;
        	}	
        },
	});
	
	Object.defineProperties(Popup,{
        /// <summary>
        ///     The DependencyProperty for the Child property. 
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
        ChildProperty:
        {
        	get:function(){
        		if(Popup._ChildProperty === undefined){
        			Popup._ChildProperty =
                        DependencyProperty.Register(
                                "Child",
                                UIElement.Type, 
                                Popup.Type,
                                /*new FrameworkPropertyMetadata( 
                                        (object) null, 
                                        new PropertyChangedCallback(null, OnChildChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        null, 
                                        new PropertyChangedCallback(null, OnChildChanged)));
        		}
        		
        		return Popup._ChildProperty;
        	}
        },

        /// <summary> 
        /// The attached property maintains an array list of popups registered with an element. The
        /// attached property can be attached to any element. 
        /// </summary> 
//        internal static readonly UncommonField<List<Popup>> 
        RegisteredPopupsField:
        {
        	get:function(){
        		if(Popup._RegisteredPopupsField === undefined){
        			Popup._RegisteredPopupsField = new UncommonField/*<List<Popup>>*/();
        		}
        		
        		return Popup._RegisteredPopupsField;
        	}
        }, 

        /// <summary>
        ///     The DependencyProperty for the IsOpen property. 
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary> 
//        public static readonly DependencyProperty 
        IsOpenProperty:
        {
        	get:function(){
        		if(Popup._IsOpenProperty === undefined){
        			Popup._IsOpenProperty  = 
                        DependencyProperty.Register(
                                "IsOpen",
                                Boolean.Type,
                                Popup.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                                        new PropertyChangedCallback(OnIsOpenChanged),
                                        new CoerceValueCallback(CoerceIsOpen))*/
                                FrameworkPropertyMetadata.Build4(
                                        false, 
                                        FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, 
                                        new PropertyChangedCallback(null, OnIsOpenChanged),
                                        new CoerceValueCallback(null, CoerceIsOpen))); 
        		}
        		
        		return Popup._IsOpenProperty;
        	}
        },

        /// <summary>
        ///     The DependencyProperty for the Placement property.
        ///     Flags:              None 
        ///     Default Value:      PlacementMode.Bottom
        /// </summary> 
//        public static readonly DependencyProperty 
        PlacementProperty:
        {
        	get:function(){
        		if(Popup._PlacementProperty === undefined){
        			Popup._PlacementProperty =
                        DependencyProperty.Register( 
                                "Placement",
                                /*typeof(PlacementMode)*/Number.Type,
                                Popup.Type,
                                /*new FrameworkPropertyMetadata( 
                                        PlacementMode.Bottom,
                                        new PropertyChangedCallback(OnPlacementChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        PlacementMode.Bottom,
                                        new PropertyChangedCallback(null, OnPlacementChanged)), 
                                new ValidateValueCallback(null, IsValidPlacementMode)); 
        		}
        		
        		return Popup._PlacementProperty;
        	}
        },

        /// <summary>
        ///     The DependencyProperty for the CustomPopupPlacementCallback property.
        ///     Flags:              None
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        CustomPopupPlacementCallbackProperty:
        {
        	get:function(){
        		if(Popup._CustomPopupPlacementCallbackProperty === undefined){
        			Popup._CustomPopupPlacementCallbackProperty = 
                        DependencyProperty.Register( 
                                "CustomPopupPlacementCallback",
                                CustomPopupPlacementCallback.Type, 
                                Popup.Type,
                                /*new FrameworkPropertyMetadata((object) null)*/
                                FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return Popup._CustomPopupPlacementCallbackProperty;
        	}
        },

        /// <summary>
        ///     The DependencyProperty for the StaysOpen property. 
        ///     Flags:              None 
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
        StaysOpenProperty:
        {
        	get:function(){
        		if(Popup._StaysOpenProperty === undefined){
        			Popup._StaysOpenProperty =
                        DependencyProperty.Register(
                                "StaysOpen",
                                /*typeof(bool)*/Boolean.Type, 
                                Popup.Type,
                                /*new FrameworkPropertyMetadata( 
                                        true, 
                                        new PropertyChangedCallback(OnStaysOpenChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                        true, 
                                        new PropertyChangedCallback(null, OnStaysOpenChanged)));
        		}
        		
        		return Popup._StaysOpenProperty;
        	}
        },
 
        /// <summary> 
        ///     The DependencyProperty for the HorizontalOffset property.
        ///     Flags:              None 
        ///     Default Value:      0 
        /// </summary>
//        public static readonly DependencyProperty 
        HorizontalOffsetProperty:
        {
        	get:function(){
        		if(Popup._HorizontalOffsetProperty === undefined){
        			Popup._HorizontalOffsetProperty = 
                        DependencyProperty.Register(
                                "HorizontalOffset",
                                Number.Type,
                                Popup.Type, 
                                /*new FrameworkPropertyMetadata(
                                        0, 
                                        new PropertyChangedCallback(OnOffsetChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                        0, 
                                        new PropertyChangedCallback(null, OnOffsetChanged))); 
        		}
        		
        		return Popup._HorizontalOffsetProperty;
        	}
        }, 

        /// <summary> 
        ///     The DependencyProperty for the VerticalOffset property.
        ///     Flags:              None 
        ///     Default Value:      0 
        /// </summary>
//        public static readonly DependencyProperty 
        VerticalOffsetProperty:
        {
        	get:function(){
        		if(Popup._VerticalOffsetProperty === undefined){
        			Popup._VerticalOffsetProperty  = 
                        DependencyProperty.Register(
                                "VerticalOffset",
                                Number.Type,
                                Popup.Type, 
                                /*new FrameworkPropertyMetadata(
                                        0, 
                                        new PropertyChangedCallback(OnOffsetChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                        0, 
                                        new PropertyChangedCallback(null, OnOffsetChanged))); 
        		}
        		
        		return Popup._VerticalOffsetProperty;
        	}
        },

        /// <summary>
        /// The DependencyProperty for the PlacementTarget property 
        /// Default value: null
        /// </summary> 
//        public static readonly DependencyProperty 
        PlacementTargetProperty:
        {
        	get:function(){
        		if(Popup._PlacementTargetProperty === undefined){
        			Popup._PlacementTargetProperty = 
                        DependencyProperty.Register(
                                "PlacementTarget", 
                                UIElement.Type,
                                Popup.Type,
                                /*new FrameworkPropertyMetadata(
                                    (object) null, 
                                    new PropertyChangedCallback(OnPlacementTargetChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                    null, 
                                    new PropertyChangedCallback(null, OnPlacementTargetChanged)));
        		}
        		
        		return Popup._PlacementTargetProperty;
        	}
        }, 
 
        /// <summary>
        /// The DependencyProperty for the PlacementRectangle property
        /// Default value: Rect.Empty 
        /// </summary>
//        public static readonly DependencyProperty 
        PlacementRectangleProperty:
        {
        	get:function(){
        		if(Popup._PlacementRectangleProperty === undefined){
        			Popup._PlacementRectangleProperty  = 
                        DependencyProperty.Register( 
                                "PlacementRectangle",
                                Rect.Type, 
                                Popup.Type,
                                /*new FrameworkPropertyMetadata(
                                        Rect.Empty,
                                        new PropertyChangedCallback(OnOffsetChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                        Rect.Empty,
                                        new PropertyChangedCallback(null, OnOffsetChanged))); 
        		}
        		
        		return Popup._PlacementRectangleProperty;
        	}
        },

        /// <summary> 
        ///     The DependencyProperty for the PopupAnimation property.
        ///     Flags:              None
        ///     Default Value:      Fade
        /// </summary> 
//        public static readonly DependencyProperty 
        PopupAnimationProperty:
        {
        	get:function(){
        		if(Popup._PopupAnimationProperty === undefined){
        			Popup._PopupAnimationProperty = 
                        DependencyProperty.Register( 
                                "PopupAnimation",
                                Number.Type, 
                                Popup.Type,
                                /*new FrameworkPropertyMetadata(PopupAnimation.None,
                                                              null,
                                                              new CoerceValueCallback(CoercePopupAnimation))*/
                                FrameworkPropertyMetadata.Build3CVCB(PopupAnimation.None,
                                                              null,
                                                              new CoerceValueCallback(null, CoercePopupAnimation)), 
                                new ValidateValueCallback(null, IsValidPopupAnimation));
        		}
        		
        		return Popup._PopupAnimationProperty;
        	}
        },

        /// <summary> 
        /// DependencyProperty for AllowsTransparency 
        /// </summary>
//        public static readonly DependencyProperty 
        AllowsTransparencyProperty:
        {
        	get:function(){
        		if(Popup._AllowsTransparencyProperty === undefined){
        			Popup._AllowsTransparencyProperty = 
                        Window.AllowsTransparencyProperty.AddOwner(Popup.Type,
                                /*new FrameworkPropertyMetadata(
                                        false,
                                        new PropertyChangedCallback(null, OnAllowsTransparencyChanged), 
                                        new CoerceValueCallback(null, CoerceAllowsTransparency))*/
                        		FrameworkPropertyMetadata.Build3CVCB(
                                        false,
                                        new PropertyChangedCallback(null, OnAllowsTransparencyChanged), 
                                        new CoerceValueCallback(null, CoerceAllowsTransparency)));
        		}
        		
        		return Popup._AllowsTransparencyProperty;
        	}
        }, 
 

//        private static readonly DependencyPropertyKey 
        HasDropShadowPropertyKey:
        {
        	get:function(){
        		if(Popup._HasDropShadowPropertyKey === undefined){
        			Popup._HasDropShadowPropertyKey  = 
                        DependencyProperty.RegisterReadOnly(
                                "HasDropShadow",
                                Boolean.Type,
                                Popup.Type, 
                                /*new FrameworkPropertyMetadata(
                                        false, 
                                        null, 
                                        new CoerceValueCallback(CoerceHasDropShadow))*/
                                FrameworkPropertyMetadata.Build3CVCB(
                                        false, 
                                        null, 
                                        new CoerceValueCallback(null, CoerceHasDropShadow)));
        		}
        		
        		return Popup._HasDropShadowPropertyKey;
        	}
        },
//        private static readonly EventPrivateKey 
        OpenedKey:
        {
        	get:function(){
        		if(Popup._OpenedKey === undefined){
        			Popup._OpenedKey = new EventPrivateKey(); 
        		}
        		
        		return Popup._OpenedKey;
        	}
        }, 
//        private static readonly EventPrivateKey 
        ClosedKey:
        {
        	get:function(){
        		if(Popup._ClosedKey === undefined){
        			Popup._ClosedKey  = new EventPrivateKey();
        		}
        		
        		return Popup._ClosedKey;
        	}
        },

	});
	
//    private static void 
    function OnChildChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*Popup*/var popup = d; 

        /*UIElement*/var oldChild = e.OldValue; 
        /*UIElement*/var newChild =  e.NewValue; 

        if ((popup._popupRoot != null) && popup.IsOpen) 
        {
            popup._popupRoot.Child = newChild;
        }

        popup.RemoveLogicalChild(oldChild);

        popup.AddLogicalChild(newChild); 
        popup.Reposition();

        popup.pushTextRenderingMode();
    }

    /// <summary>
    /// Registers this popup with the specified placement target. The descendant walker requires this so that
    /// it can traverse into the popup's element tree. 
    /// </summary>
//    private static void 
    function RegisterPopupWithPlacementTarget(/*Popup*/ popup, /*UIElement*/ placementTarget) 
    { 
//        Debug.Assert(popup != null, "Popup must be non-null");
//        Debug.Assert(placementTarget != null, "Placement target must be non-null."); 

        //
        // The registered popups are stored in an array list on the specified element (which is
        // typically the placement target). 
        // The array list for storing the registered popups on the placement target is lazily created.
        // 

        /*List<Popup>*/var registeredPopups = Popup.RegisteredPopupsField.GetValue(placementTarget);
        if (registeredPopups == null) 
        {
            registeredPopups = new List/*<Popup>*/();
            Popup.RegisteredPopupsField.SetValue(placementTarget, registeredPopups);
        } 
        if (!registeredPopups.Contains(popup))
        { 
            registeredPopups.Add(popup); 
        }
    } 

    /// <summary>
    /// Unregisters the popup from the spefied placement target. For more details see comments on
    /// RegisterPopupWithPlacementTarget. 
    /// </summary>
//    private static void 
    function UnregisterPopupFromPlacementTarget(/*Popup*/ popup, /*UIElement*/ placementTarget) 
    { 
//        Debug.Assert(popup != null, "Popup must be non-null");
//        Debug.Assert(placementTarget != null, "Placement target must be non-null."); 

        /*List<Popup>*/var registeredPopups = Popup.RegisteredPopupsField.GetValue(placementTarget);

        if (registeredPopups != null) 
        {
            registeredPopups.Remove(popup); 

            // If after removing this popup from the placement targets popup registration list, no more
            // popups are left, we can also get rid of the array list. 
            if (registeredPopups.Count == 0)
            {
            	Popup.RegisteredPopupsField.SetValue(placementTarget, null);
            } 
        }
    } 

//    private static object 
    function CoerceIsOpen(/*DependencyObject*/ d, /*object*/ value)
    { 
    	// cym comment
//        if (value)
//        { 
//            /*Popup*/var popup = /*(Popup)*/d; 
//
//            // For popups in the tree, don't open until it is loaded 
//            if (!popup.IsLoaded && VisualTreeHelper.GetParent(popup) != null)
//            {
//                popup.RegisterToOpenOnLoad();
//                return /*BooleanBoxes.FalseBox*/false; 
//            }
//        } 

        return value;
    } 

    /// <summary> 
    ///     Called when IsOpenProperty is changed on "d."
    /// </summary>
//    private static void 
    function OnIsOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*Popup*/var popup = /*(Popup)*/d;

        // This is actually the current state and not necessary the desired state (i.e. old value) 
        var currentVisible = false; //(popup._secHelper.IsWindowAlive() && (popup._asyncDestroy == null)) || (popup._asyncCreate != null);
        var visible = /*(bool)*/ e.NewValue; 

        if (visible != currentVisible)
        {
            if (visible) 
            {
                // The popup wants to be visible 

                if (popup._cacheValid.Get(CacheBits.OnClosedHandlerReopen))
                    throw new InvalidOperationException(SR.Get(SRID.PopupReopeningNotAllowed)); 

//                popup.CancelAsyncDestroy();
//
//                // Cancel any pending async create requests, we're creating now 
//                popup.CancelAsyncCreate();
                popup.CreateWindow(false /*asyncCall*/); 

//                // It is possible that the popup is destroyed by CreateWindow or one of its callbacks
//                if (popup._secHelper.IsWindowAlive()) 
//                {
//                    // Close the popup when it is unloaded from the visual tree
//                    if (CloseOnUnloadedHandler == null)
//                    { 
//                        CloseOnUnloadedHandler = new RoutedEventHandler(CloseOnUnloaded);
//                    } 
//
//                    popup.Unloaded += CloseOnUnloadedHandler;
//                } 
            }
            else
            {
                // The popup wants to hide 
                popup.CancelAsyncCreate();

                if (popup._secHelper.IsWindowAlive() && (popup._asyncDestroy == null)) 
                {
                    // The popup window still exists, get rid of it 
                    // There are also no other async destroy requests

                    // Hide the window (synchronously). This will cause repaint messages to be sent
                    // to underlying windows and Render work items to be queued. 
                    popup.HideWindow();

                    if (CloseOnUnloadedHandler != null) 
                    {
                        popup.Unloaded -= CloseOnUnloadedHandler; 
                    }
                }
            }
        } 
    }

//    private static void 
    function CloseOnUnloaded(/*object*/ sender, /*RoutedEventArgs*/ e) 
    { 
        sender.SetCurrentValueInternal(Popup.IsOpenProperty, false);
    } 

    /// <summary>
    ///     Called when Placement is changed on "d."
    /// </summary>
//    private static void 
    function OnPlacementChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.Reposition();
    } 

//    private static bool 
    function IsValidPlacementMode(/*object*/ o)
    {
        /*PlacementMode*/var value = /*(PlacementMode)*/o; 
        return value == PlacementMode.Absolute
            || value == PlacementMode.AbsolutePoint 
            || value == PlacementMode.Bottom 
            || value == PlacementMode.Center
            || value == PlacementMode.Mouse 
            || value == PlacementMode.MousePoint
            || value == PlacementMode.Relative
            || value == PlacementMode.RelativePoint
            || value == PlacementMode.Right 
            || value == PlacementMode.Left
            || value == PlacementMode.Top 
            || value == PlacementMode.Custom; 
    }

    /// <summary>
    ///     Called when StaysOpen property is changed on "d."
    /// </summary> 
//    private static void 
    function OnStaysOpenChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*Popup*/var popup = /*(Popup)*/d; 

        if (popup.IsOpen) 
        {
            if (e.NewValue)
            {
                popup.ReleasePopupCapture(); 
            }
            else 
            { 
                popup.EstablishPopupCapture();
            } 
        }
    }

    /// <summary>
    ///     Called when HorizontalOffset, VerticalOffset, or PlacementRectangle is changed on "d." 
    /// </summary>
//    private static void 
    function OnOffsetChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.Reposition();
    }

    /// <summary>
    /// When the placement target changes the popup has to be unregistered from its old placement
    /// target and registered with the new placement target.
    /// </summary> 
//    private static void 
    function OnPlacementTargetChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        if (d.IsOpen)
        { 
            // When PlacementTarget changes, the before/after are stored in the event args.
            d.UpdatePlacementTargetRegistration(e.OldValue, e.NewValue);
        }
        else if (e.OldValue != null) 
        {
            UnregisterPopupFromPlacementTarget(d, e.OldValue); 
        } 
    }
    // Coerce animation to None if popup is not transparent 
//    private static object 
    function CoercePopupAnimation(/*DependencyObject*/ o, /*object*/ value)
    {
        return o.AllowsTransparency ? value : PopupAnimation.None;
    } 

//    private static bool 
    function IsValidPopupAnimation(/*object*/ o) 
    { 
        /*PopupAnimation*/var value = /*(PopupAnimation)*/o;
        return value == PopupAnimation.None 
            || value == PopupAnimation.Fade
            || value == PopupAnimation.Slide
            || value == PopupAnimation.Scroll;
    } 

//    private static void 
    function OnAllowsTransparencyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.CoerceValue(Popup.PopupAnimationProperty); 
    }

//    private static object 
    function CoerceAllowsTransparency(/*DependencyObject*/ d, /*object*/ value)
    { 
//        return d._secHelper.IsChildPopup ? false : value;
        
        return value;
    } 

//    private static object 
    function CoerceHasDropShadow(/*DependencyObject*/ d, /*object*/ value) 
    {
        return SystemParameters.DropShadow && d.AllowsTransparency; 
    }

    /// <summary> 
    ///     Hooks up a Popup to a child.
    ///     The child will be required to implement the following properties: 
    ///         Popup.IsOpenProperty
    ///         Popup.PlacementProperty
    ///         Popup.PlacementRectangleProperty
    ///         Popup.PlacementTargetProperty 
    ///         Popup.HorizontalOffsetProperty
    ///         Popup.VerticalOffsetProperty 
    /// </summary> 
    /// <param name="popup">The parent popup that the child will be hooked up to.</param>
    /// <param name="child">The element to be the child of the popup.</param> 
//    public static void 
    Popup.CreateRootPopup = function(/*Popup*/ popup, /*UIElement*/ child)
    {
        if (popup == null)
        { 
            throw new ArgumentNullException("popup");
        } 
        if (child == null) 
        {
            throw new ArgumentNullException("child"); 
        }

        // When we get here, the Child must not have already been visually or logically parented.
        /*object*/var currentParent = null; 
        if ((currentParent = LogicalTreeHelper.GetParent(child)) != null)
        { 
            throw new InvalidOperationException(SR.Get(SRID.CreateRootPopup_ChildHasLogicalParent, child, currentParent)); 
        }

        if ((currentParent = VisualTreeHelper.GetParent(child)) != null)
        {
            throw new InvalidOperationException(SR.Get(SRID.CreateRootPopup_ChildHasVisualParent, child, currentParent));
        } 

        // PlacementTarget must be set before hooking up the child so that resource 
        // lookups can work.  The Popup for tooltip and context menu isn't in the tree 
        // so FE relies on GetUIParentCore to return the placement target as the
        // effective logical parent 
        /*Binding*/var binding = new Binding("PlacementTarget");
        binding.Mode = BindingMode.OneWay;
        binding.Source = child;
        popup.SetBinding(Popup.PlacementTargetProperty, binding); 

        // NOTE: this will hook up child as a logical child of Popup. 
        // If at a later date this is not desired, then modify the hookup to avoid the logical hookup. 
        //
        // NOTE: Logical linking is necessary if property invalidations are to propagate down 
        // the tree into the child (unless at a later date an alternate method has been created).
        popup.Child = child;

        binding = new Binding("VerticalOffset"); 
        binding.Mode = BindingMode.OneWay;
        binding.Source = child; 
        popup.SetBinding(Popup.VerticalOffsetProperty, binding); 

        binding = new Binding("HorizontalOffset"); 
        binding.Mode = BindingMode.OneWay;
        binding.Source = child;
        popup.SetBinding(Popup.HorizontalOffsetProperty, binding);

        binding = new Binding("PlacementRectangle");
        binding.Mode = BindingMode.OneWay; 
        binding.Source = child; 
        popup.SetBinding(Popup.PlacementRectangleProperty, binding);

        binding = new Binding("Placement");
        binding.Mode = BindingMode.OneWay;
        binding.Source = child;
        popup.SetBinding(Popup.PlacementProperty, binding); 

        binding = new Binding("StaysOpen"); 
        binding.Mode = BindingMode.OneWay; 
        binding.Source = child;
        popup.SetBinding(Popup.StaysOpenProperty, binding); 

        binding = new Binding("CustomPopupPlacementCallback");
        binding.Mode = BindingMode.OneWay;
        binding.Source = child; 
        popup.SetBinding(Popup.CustomPopupPlacementCallbackProperty, binding);

        // Note: IsOpen should always be last in this method 
        binding = new Binding("IsOpen");
        binding.Mode = BindingMode.OneWay; 
        binding.Source = child;
        popup.SetBinding(Popup.IsOpenProperty, binding);
    };

    // This is to check if ContextMenu and ToolTip are still setup properly inside a Popup
//    internal static bool 
    Popup.IsRootedInPopup = function(/*Popup*/ parentPopup, /*UIElement*/ element) 
    { 
        // Look for a logical parent first
        /*object*/var logicalParent = LogicalTreeHelper.GetParent(element); 

        // If there's no logical parent, we better not have a visual parent
        if (logicalParent == null && VisualTreeHelper.GetParent(element) != null)
        { 
            return false;
        } 

        // If the logical parent doesn't match the Popup created by CreateRootPopup,
        // then we should return false. 
        if (logicalParent != parentPopup)
        {
            return false;
        } 

        return true; 

    };

    /// <summary>
    ///     Called when this element loses capture.
    /// </summary>
    /// <param name="sender">The instance of Popup that caught the event.</param> 
    /// <param name="e">Event arguments.</param>
//    private static void 
    function OnLostMouseCapture(/*object*/ sender, /*MouseEventArgs*/ e) 
    { 
        /*Popup*/var popup = sender instanceof Popup ? sender : null;

        // Try to accomplish "subcapture" -- allowing elements within our
        // subtree to take mouse capture and reclaim it when they lose capture.
        // This is a workaround until we can get real subcapture:
        //   * Bug 940198: Need real solution for subcapture 
        //
        if (!popup.StaysOpen) 
        { 
            /*PopupRoot*/var root = popup._popupRoot;

            // Reestablish capture if an element within us lost capture
            // (hence we receive the LostCapture routed event) and capture
            // is not being acquired anywhere else.
            // 
            // Note we do not reestablish capture if we are losing capture
            // ourselves. 
            var reestablishCapture = e.OriginalSource != root && Mouse.Captured == null && MS.Win32.SafeNativeMethods.GetCapture() == IntPtr.Zero; 

            if(reestablishCapture) 
            {
                popup.EstablishPopupCapture();
                e.Handled = true;
            } 
            else
            { 
                if(Mouse.Captured != root) 
                {
                    popup._cacheValid.Set(CacheBits.CaptureEngaged, false); 
                }

                /*bool*/var newCaptureInsidePopup = Mouse.Captured != null 
                && MenuBase.IsDescendant(root, Mouse.Captured instanceof DependencyObject ? Mouse.Captured : null);
                /*bool*/var newCaptureOutsidePopup = !newCaptureInsidePopup && Mouse.Captured != root; 
                if(newCaptureOutsidePopup && !popup.IsDragDropActive)
                { 
                    // Capture is moving outside the popup, and we are not 
                    // in a drag/drop operation, so we will lose the ability to
                    // know about mouse actions that should dismiss the 
                    // popup, so we proactively dismiss the popup now.
                    popup.SetCurrentValueInternal(Popup.IsOpenProperty, false);
                }
            } 
        }
    } 

//    private static void 
    function OnDragDropStarted(/*object*/ sender, /*RoutedEventArgs*/ e)
    { 
        sender.IsDragDropActive = true;
    }

//    private static void 
    function OnDragDropCompleted(/*object*/ sender, /*RoutedEventArgs*/ e)
    { 
    	sender.IsDragDropActive = false;

        if (!sender.StaysOpen)
        {
            // A drag drop operation steals capture from the Popup because
            // there is an intermediate hwnd created internally by OleDragDrop 
            // which holds capture temporarily.  So upon completion of the
            // operation we re-establish capture. See Dev11 bug#290233. 
        	sender.EstablishPopupCapture(); 
        }
    } 

    // Gets the root visual of the tree containing child 
//    private static Visual 
    function GetRootVisual(/*Visual*/ child)
    { 
//        Debug.Assert(child != null, "child should be non-null"); 

        /*DependencyObject*/var parent; 
        /*DependencyObject*/var root = child;
        while ((parent = VisualTreeHelper.GetParent(root)) != null)
        {
            root = parent; 
        }
        return root instanceof Visual ? root : null; 
    } 

//    private static object 
    function AsyncCreateWindow(/*object*/ arg) 
    { 
        arg._asyncCreate = null; 
        arg.CreateWindow(true /*asyncCall*/);

        return null;
    } 

//    private static bool 
    function IsAbsolutePlacementMode(/*PlacementMode*/ placement)
    {
        switch (placement) 
        {
            case PlacementMode.MousePoint: 
            case PlacementMode.Mouse: 
            case PlacementMode.AbsolutePoint:
            case PlacementMode.Absolute: 
                return true;
        }

        return false; 
    }

//    private static void 
    function SwapPoints(/*ref Point p1*/p1Ref, /*ref Point p2*/p2Ref)
    {
        var temp = p1Ref.p1; 
        p1Ref.p1 = p2Ref.p2;
        p2Ref.p2 = temp; 
    } 

    // Returns an array of the InterestPoints of the Rect, each displaced by offset 
//    private static Point[] 
    function InterestPointsFromRect(/*Rect*/ rect)
    { 
        /*Point[]*/var points = []; //Point[5];

        points[InterestPoint.TopLeft] = rect.TopLeft;
        points[InterestPoint.TopRight] = rect.TopRight; 
        points[InterestPoint.BottomLeft] = rect.BottomLeft;
        points[InterestPoint.BottomRight] = rect.BottomRight; 
        points[InterestPoint.Center] = new Point(rect.Left + rect.Width / 2.0, 
                                                      rect.Top + rect.Height / 2.0);

        return points;
    }

    // Returns a transform from visual to client area of the window 
//    private static GeneralTransform 
    function TransformToClient(/*Visual*/ visual, /*Visual*/ rootVisual)
    { 
        /*GeneralTransformGroup*/var visualToClientTransform = new GeneralTransformGroup(); 

        // Add transform from visual to root 
        visualToClientTransform.Children.Add(visual.TransformToAncestor(rootVisual));

        // Add root and composition target's transfrom
        visualToClientTransform.Children.Add(new MatrixTransform( 
            PointUtil.GetVisualTransform(rootVisual) *
            PopupSecurityHelper.GetTransformToDevice(rootVisual) 
            )); 

        return visualToClientTransform; 
    }

    // Gets the number of InterestPoint combinations for the given placement
//    private static int 
    function GetNumberOfCombinations(/*PlacementMode*/ placement) 
    { 
        switch (placement)
        { 
            case PlacementMode.Bottom:
            case PlacementMode.Top:
            case PlacementMode.Mouse:
                return 2; 

            case PlacementMode.Right: 
            case PlacementMode.Left: 
            case PlacementMode.RelativePoint:
            case PlacementMode.MousePoint: 
            case PlacementMode.AbsolutePoint:
                return 4;

            case PlacementMode.Custom: 
                return 0;

            case PlacementMode.Absolute: 
            case PlacementMode.Relative:
            case PlacementMode.Center: 
            default:
                return 1;
        }
    } 

    // Gets the primary axis for the specified placement mode 
//    private static PopupPrimaryAxis 
    function GetPrimaryAxis(/*PlacementMode*/ placement) 
    {
        switch (placement) 
        {
            case PlacementMode.Right:
            case PlacementMode.Left:
                return PopupPrimaryAxis.Vertical; 

            case PlacementMode.Bottom: 
            case PlacementMode.Top: 
            case PlacementMode.RelativePoint:
            case PlacementMode.AbsolutePoint: 
                return PopupPrimaryAxis.Horizontal;

            case PlacementMode.Relative:
            case PlacementMode.Mouse: 
            case PlacementMode.MousePoint:
            case PlacementMode.Center: 
            case PlacementMode.Absolute: 
            case PlacementMode.Custom:
            default: 
                return PopupPrimaryAxis.None;
        }
    }

    /// <summary> 
    ///     Returns information about the mouse cursor size.
    /// </summary>
    /// <param name="width">The width of the mouse cursor.</param>
    /// <param name="height">The height of the mouse cursor.</param> 
    /// <param name="hotX">The X position of the hotspot.</param>
    /// <param name="hotY">The Y position of the hotspot.</param> 
    /// <SecurityNote> 
    ///     Critical: This code causes elevation to unmanaged code (GetIconInfo and GetObject)
    ///     TreatAsSafe: It does not expose any of the data retrieved essentially the bitmap. 
    ///     What it does expose is hotx and hoty which are ok to give out since they signify
    ///      hot area on mouse cursor or icon
    /// </SecurityNote>
//    private static void 
    function GetMouseCursorSize(/*out int width*/widthOut, /*out int height*/heightOut, /*out int hotX*/hotXOut, /*out int hotY*/hotYOut)
    { 
        /* 
            The code for this function is based upon
            shell\comctl32\v6\tooltips.cpp _GetHcursorPdy3 
            -------------------------------------------------------------------------
            With the current mouse drivers that allow you to customize the mouse
            pointer size, GetSystemMetrics returns useless values regarding
            that pointer size. 

            Assumption: 
            1. The pointer's width is equal to its height. We compute 
               its height and infer its width.

            This function looks at the mouse pointer bitmap
            to find out the dimensions of the mouse pointer and the
            hot spot location.
            ------------------------------------------------------------------------- 
        */

        // If there is no mouse cursor, these should be 0 
        width = height = hotX = hotY = 0;

        // First, retrieve the mouse cursor
        /*IntPtr*/var hCursor = SafeNativeMethods.GetCursor();
        if (hCursor != IntPtr.Zero)
        { 
            // In case we can't figure out the dimensions, this is a best guess
            width = height = 16; 

            // Get the cursor information
            /*NativeMethods.ICONINFO*/var iconInfo = new NativeMethods.ICONINFO(); 
            var gotIconInfo = true;
            try
            {
                UnsafeNativeMethods.GetIconInfo(new HandleRef(null, hCursor), /*out iconInfo*/iconInfoOut); 
            }
            catch(Win32Exception) 
            { 
                gotIconInfo = false;
            } 

            if(gotIconInfo)
            {
                // Get a handle to the bitmap 
                /*NativeMethods.BITMAP*/var bm = new NativeMethods.BITMAP();
                var resultOfGetObject=0; 


                new SecurityPermission(SecurityPermissionFlag.UnmanagedCode).Assert(); //Blessed Assert 
                try
                {
                    resultOfGetObject = UnsafeNativeMethods.GetObject(iconInfo.hbmMask.MakeHandleRef(null), Marshal.SizeOf(typeof(NativeMethods.BITMAP)), bm);
                } 
                finally
                { 
                    SecurityPermission.RevertAssert(); 
                }

                if (resultOfGetObject != 0)
                {
                    // Extract the bitmap bits
                    var max = (bm.bmWidth * bm.bmHeight / 8); 
                    /*byte[]*/var curMask = []; //new byte[max * 2]; // Enough space for the mask and the xor mask
                    if (UnsafeNativeMethods.GetBitmapBits(iconInfo.hbmMask.MakeHandleRef(null), curMask.Length, curMask) != 0) 
                    { 
                    	var hasXORMask = false;
                        if (iconInfo.hbmColor.IsInvalid) 
                        {
                            // if no color bitmap, then the hbmMask is a double height bitmap
                            // with the cursor and the mask stacked.
                            hasXORMask = true; 
                            max /= 2;
                        } 

                        // Go through the bitmap looking for the bottom of the image and/or mask
                        var empty = true; 
                        var bottom = max;
                        for (bottom--; bottom >= 0; bottom--)
                        {
                            if (curMask[bottom] != 0xFF || (hasXORMask && (curMask[bottom + max] != 0))) 
                            {
                                empty = false; 
                                break; 
                            }
                        } 

                        if (!empty)
                        {
                            // Go through the bitmap looking for the top of the image and/or mask 
                            var top;
                            for (top = 0; top < max; top++) 
                            { 
                                if (curMask[top] != 0xFF || (hasXORMask && (curMask[top + max] != 0)))
                                    break; 
                            }

                            // Calculate the left, right, top, bottom points

                            // byteWidth = bytes per row AND bytes per vertical pixel
                            var byteWidth = bm.bmWidth / 8; 
                            var right /*px*/ = (bottom /*bytes*/ % byteWidth) * 8 /*px/byte*/; 
                            bottom /*px*/ = bottom /*bytes*/ / byteWidth /*bytes/px*/;
                            var left /*px*/ = top /*bytes*/ % byteWidth * 8 /*px/byte*/; 
                            top /*px*/ = top /*bytes*/ / byteWidth /*bytes/px*/;

                            // (Final value) Convert LRTB to Width and Height
                            width = right - left + 1; 
                            height = bottom - top + 1;

                            // (Final value) Calculate the hotspot relative to top/left 
                            hotX = iconInfo.xHotspot - left;
                            hotY = iconInfo.yHotspot - top; 
                        }
                        else
                        {
                            // (Final value) We didn't find anything in the bitmap. 
                            // So, we'll make a guess with the information that we have.
                            // Note: This seems to happen on I-Beams and Cross-hairs -- cursors that 
                            // are all inverted. Strangely, their hbmColor is non-null. 
                            width = bm.bmWidth;
                            height = bm.bmHeight; 
                            hotX = iconInfo.xHotspot;
                            hotY = iconInfo.yHotspot;
                        }
                    } 
                }

                iconInfo.hbmColor.Dispose(); 
                iconInfo.hbmMask.Dispose();
            } 
        }
    }
    
    // Force Popup to always be collapsed - computing transform of child assumes popup is collapsed 
//    private static object 
    function CoerceVisibility(/*DependencyObject*/ d, /*object*/ value)
    { 
        return Visibility.Collapsed; 
    }
    
    //static Popup() 
    function Initialize()
    {
        EventManager.RegisterClassHandler(Popup.Type, Mouse.LostMouseCaptureEvent, new MouseEventHandler(null, OnLostMouseCapture)); 
        EventManager.RegisterClassHandler(Popup.Type, DragDrop.DragDropStartedEvent, new RoutedEventHandler(null, OnDragDropStarted), true); 
        EventManager.RegisterClassHandler(Popup.Type, DragDrop.DragDropCompletedEvent, new RoutedEventHandler(null, OnDragDropCompleted), true);

        UIElement.VisibilityProperty.OverrideMetadata(Popup.Type, 
        		/*new FrameworkPropertyMetadata(Visibility.Collapsed, null, 
        				new CoerceValueCallback(null, CoerceVisibility))*/
        		FrameworkPropertyMetadata.Build3CVCB(Visibility.Collapsed, null, 
        				new CoerceValueCallback(null, CoerceVisibility)));
    }
	
    Popup.AnimationDelayTime = AnimationDelayTime;
	Popup.Type = new Type("Popup", Popup, [FrameworkElement.Type, IAddChild.Type]);
	Initialize();
	
	return Popup;
});
 




