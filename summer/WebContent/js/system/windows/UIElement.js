/**
 * UIElement
 * 
 *      PreSharp uses message numbers that the C# compiler doesn't know about.
     Disable the C# complaints, per the PreSharp documentation. 

     <summary> 
     UIElement is the base class for frameworks building on the Windows Presentation Core.
     </summary>
     <remarks>
     UIElement adds to the base visual class "LIFE" - Layout, Input, Focus, and Eventing. 
     UIElement can be considered roughly equivalent to an HWND in Win32, or an Element in Trident.
     UIElements can render (because they derive from Visual), visually size and position their children, 
     respond to user input (including control of where input is getting sent to), 
     and raise events that traverse the physical tree.<para/>
     
     UIElement is the most functional type in the Windows Presentation Core.
     </remarks>
 */

define(["dojo/_base/declare", "system/Type", "media/Visual", "media/VisualFlags", "windows/RequestFlags",
        "windows/DependencyProperty", "windows/PropertyMetadata", "windows/Visibility", "windows/PropertyChangedCallback",
        "windows/ValidateValueCallback", "input/Mouse", "input/Keyboard", "input/InputElement", "windows/CoerceValueCallback",
        "windows/ReadOnlyPropertyMetadata", "windows/GetReadOnlyValueCallback", "windows/EventRouteFactory",
        "internal/UIElementHelper", "input/CommandManager", "input/CommandBindingCollection", 
        "windows/CoreFlags", "windows/IInputElement",
        "animation/IAnimatable", "windows/MouseOverProperty", "input/MouseEventHandler", "input/MouseButtonEventHandler",
        "input/MouseWheelEventHandler"/*, "windows/DragDrop"*/,
        "windows/GiveFeedbackEventHandler", "windows/DragEventHandler", "windows/QueryContinueDragEventHandler",
        "windows/FocusWithinProperty", "input/FocusManager", "input/MouseButton"], 
		function(declare, Type, Visual, VisualFlags, RequestFlags,
				DependencyProperty, PropertyMetadata, Visibility, PropertyChangedCallback,
				ValidateValueCallback, Mouse, Keyboard, InputElement, CoerceValueCallback,
				ReadOnlyPropertyMetadata, GetReadOnlyValueCallback, EventRouteFactory,
				UIElementHelper, CommandManager, CommandBindingCollection, 
				CoreFlags, IInputElement, 
				IAnimatable, MouseOverProperty, MouseEventHandler, MouseButtonEventHandler,
				MouseWheelEventHandler/*, DragDrop*/,
				GiveFeedbackEventHandler, DragEventHandler, QueryContinueDragEventHandler,
				FocusWithinProperty, FocusManager, MouseButton){
	
//    private class 
	var InputHitTestResult = declare(null, {
		
//        public HitTestResultBehavior 
		InputHitTestResultCallback:function(/*HitTestResult*/ result) 
        { 
            this._result = result;
            return HitTestResultBehavior.Stop; 
        }
 

//        private HitTestResult _result;
    });
	
	Object.defineProperties(InputHitTestResult.prototype, {
//        public DependencyObject 
		Result: 
        {
            get:function() 
            { 
                return this._result != null ? this._result.VisualHit : null;
            } 
        },

//        public HitTestResult 
		HitTestResult:
        { 
            get:function()
            { 
                return this._result; 
            }
        }
	});
    
    // Perf analysis showed we were not using these fields enough to warrant
    // bloating each instance with the field, so storage is created on-demand 
    // in the local store. 
//    internal static readonly UncommonField<EventHandlersStore> 
    var EventHandlersStoreField = new UncommonField/*<EventHandlersStore>*/();
//    internal static readonly UncommonField<InputBindingCollection> 
    var InputBindingCollectionField = new UncommonField/*<InputBindingCollection>*/(); 
//    internal static readonly UncommonField<CommandBindingCollection> 
    var CommandBindingCollectionField = new UncommonField/*<CommandBindingCollection>*/();
//    private  static readonly UncommonField<object> 
    var LayoutUpdatedListItemsField = new UncommonField/*<object>*/();
//    private  static readonly UncommonField<EventHandler> 
    var LayoutUpdatedHandlersField = new UncommonField/*<EventHandler>*/();
//    private  static readonly UncommonField<StylusPlugInCollection> 
    var StylusPlugInsField = new UncommonField/*<StylusPlugInCollection>*/(); 
//    internal static readonly FocusWithinProperty FocusWithinProperty = new FocusWithinProperty();
//    internal static readonly MouseOverProperty MouseOverProperty = new MouseOverProperty(); 
//    internal static readonly MouseCaptureWithinProperty MouseCaptureWithinProperty = new MouseCaptureWithinProperty();
//    internal static readonly StylusOverProperty StylusOverProperty = new StylusOverProperty();
//    internal static readonly StylusCaptureWithinProperty StylusCaptureWithinProperty = new StylusCaptureWithinProperty();
//    internal static readonly TouchesOverProperty TouchesOverProperty = new TouchesOverProperty(); 
//    internal static readonly TouchesCapturedWithinProperty TouchesCapturedWithinProperty = new TouchesCapturedWithinProperty();


//  internal const int 
    var MAX_ELEMENTS_IN_ROUTE = 4096; 
    var UIElement = declare("UIElement", [Visual, IInputElement, IAnimatable],{
		constructor:function( ){
	        this.Initialize(); 
	      	this._flags1 = 0;
	      	
	      	this.ArrangeDirty = true;
		},
		
        Initialize:function()
        { 
//            this.BeginPropertyInitialization();
            this.NeverMeasured = true; 
            this.NeverArranged = true; 

//            this.SnapsToDevicePixelsCache = SnapsToDevicePixelsProperty.GetDefaultValue(this.DependencyObjectType); 
//            this.ClipToBoundsCache        = ClipToBoundsProperty.GetDefaultValue(this.DependencyObjectType);
            this.VisibilityCache          = UIElement.VisibilityProperty.GetDefaultValue(this.DependencyObjectType);

            this.SetFlags(true, VisualFlags.IsUIElement); 

        },
        
        AddDomEventListener:function(){
        	EventListenerManager.AddDefaultEventListeners(this._dom);
        },
        
		SetUpStyle:function(){
//        	Visual.prototype.SetUpStyle.call(this);
        	
//        	var width = this.Width;
//        	if(width != null){
//        		this._dom.style.setProperty("width", width, "");
//        	}
//        	
//           	var height = this.Height;
//        	if(height != null){
//        		this._dom.style.setProperty("height", Height, "");
//        	}
//        	
//           	var cursor = this.Cursor;
//        	if(cursor != null){
//        		this._dom.style.setProperty("cursor", cursor, "");
//        	}
        	
        },
        
        /// <summary>
        /// Applies an AnimationClock to a DepencencyProperty which will 
        /// replace the current animations on the property using the snapshot
        /// and replace HandoffBehavior.
        /// </summary>
        /// <param name="dp"> 
        /// The DependencyProperty to animate.
        /// </param> 
        /// <param name="clock"> 
    	/// The AnimationClock that will animate the property. If this is null
        /// then all animations will be removed from the property. 
        /// </param>
//	    public void 
        ApplyAnimationClock:function(
        		/*DependencyProperty*/ dp,
        		/*AnimationClock*/ clock) 
		{
        	this.ApplyAnimationClock(dp, clock, HandoffBehavior.SnapshotAndReplace); 
		},

	    /// <summary> 
		/// Applies an AnimationClock to a DependencyProperty. The effect of
		/// the new AnimationClock on any current animations will be determined by
		/// the value of the handoffBehavior parameter.
		/// </summary> 
		/// <param name="dp">
		/// The DependencyProperty to animate. 
		/// </param> 
		/// <param name="clock">
		/// The AnimationClock that will animate the property. If parameter is null 
		/// then animations will be removed from the property if handoffBehavior is
		/// SnapshotAndReplace; otherwise the method call will have no result.
		/// </param>
		/// <param name="handoffBehavior"> 
		/// Determines how the new AnimationClock will transition from or
		/// affect any current animations on the property. 
		/// </param> 
//	      public void 
		ApplyAnimationClock:function(
				/*DependencyProperty*/ dp, 
				/*AnimationClock*/ clock,
				/*HandoffBehavior*/ handoffBehavior)
		{
			if (dp == null) 
			{
				throw new Error('ArgumentNullException("dp")'); 
			} 
			
			if (!AnimationStorage.IsPropertyAnimatable(this, dp)) 
			{
				throw new Error('ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp")');
			}

			if (clock != null 
	        		  && !AnimationStorage.IsAnimationValid(dp, clock.Timeline))
			{ 
				throw new Error('ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, clock.Timeline.GetType(), dp.Name, dp.PropertyType), "clock")');
			} 
			
			if (!HandoffBehaviorEnum.IsDefined(handoffBehavior)) 
			{ 
				throw new Error('ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior)');
			} 

			if (this.IsSealed)
			{
				throw new Error('InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO, dp, this.GetType())'); 
			}

			AnimationStorage.ApplyAnimationClock(this, dp, clock, handoffBehavior); 
		},

		/// <summary>
		/// Starts an animation for a DependencyProperty. The animation will
		/// begin when the next frame is rendered. 
		/// </summary>
		/// <param name="dp"> 
		/// The DependencyProperty to animate. 
		/// </param>
		/// <param name="animation"> 
		/// <para>The AnimationTimeline to used to animate the property.</para>
		/// <para>If the AnimationTimeline's BeginTime is null, any current animations
		/// will be removed and the current value of the property will be held.</para>
		/// <para>If this value is null, all animations will be removed from the property 
		/// and the property value will revert back to its base value.</para>
		/// </param> 
		/// <param name="handoffBehavior"> 
		/// Specifies how the new animation should interact with any current
		/// animations already affecting the property value. 
		/// </param>
//	      public void 
		BeginAnimation:function(/*DependencyProperty*/ dp, /*AnimationTimeline*/ animation, /*HandoffBehavior*/ handoffBehavior)
		{
			if (dp == null) 
			{
				throw new Error('ArgumentNullException("dp")'); 
			} 

			if (!AnimationStorage.IsPropertyAnimatable(this, dp)) 
			{
				throw new Error('ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp")');
			}

			if (   animation != null 
					&& !AnimationStorage.IsAnimationValid(dp, animation))
			{ 
				throw new Error('ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, animation.GetType(), dp.Name, dp.PropertyType), "animation")');
			}

			if(handoffBehavior ===undefined){
				handoffBehavior= HandoffBehavior.SnapshotAndReplace;
			}
	          
			if (!HandoffBehaviorEnum.IsDefined(handoffBehavior)) 
			{
				throw new Error('ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior)'); 
			} 

			if (IsSealed) 
			{
				throw new Error('InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO, dp, this.GetType())');
			}

			AnimationStorage.BeginAnimation(this, dp, animation, handoffBehavior);
		},



		/// <summary>
		///   If the dependency property is animated this method will 
		///   give you the value as if it was not animated. 
		/// </summary>
		/// <param name="dp">The DependencyProperty</param> 
		/// <returns>
		///   The value that would be returned if there were no
		///   animations attached.  If there aren't any attached, then
		///   the result will be the same as that returned from 
		///   GetValue.
		/// </returns> 
//	      public object 
		GetAnimationBaseValue:function(/*DependencyProperty*/ dp) 
		{
			if (dp == null) 
			{
				throw new Error('ArgumentNullException("dp")');
			}

			return this.GetValueEntry(
	                  LookupEntry(dp.GlobalIndex), 
	                  dp, 
	                  null,
	                  RequestFlags.AnimationBaseValue).Value; 
		},

		/// <summary> 
		///     Allows subclasses to participate in property animated value computation
		/// </summary> 
		/// <param name="dp"></param>
		/// <param name="metadata"></param>
		/// <param name="entry">EffectiveValueEntry computed by base</param>
		/// <SecurityNote> 
		///     Putting an InheritanceDemand as a defense-in-depth measure,
		///     as this provides a hook to the property system that we don't 
		///     want exposed under PartialTrust. 
		/// </SecurityNote>
//	      internal sealed override void 
		EvaluateAnimatedValueCore:function(
				/*DependencyProperty*/  dp,
				/*PropertyMetadata*/    metadata,
				entryRef
		/*ref EffectiveValueEntry entry*/) 
		{
			if (this.IAnimatable_HasAnimatedProperties) 
			{ 
				/*AnimationStorage*/var storage = AnimationStorage.GetStorage(this, dp);

				if (storage != null)
				{
					storage.EvaluateAnimatedValue(metadata, entryRef/*ref entry*/);
				} 
			}
		}, 
	      
        /// <summary> 
        ///     Allows UIElement to augment the
        ///     <see cref="EventRoute"/> 
        /// </summary>
        /// <remarks>
        ///     Sub-classes of UIElement can override
        ///     this method to custom augment the route 
        /// </remarks>
        /// <param name="route"> 
        ///     The <see cref="EventRoute"/> to be 
        ///     augmented
        /// </param> 
        /// <param name="args">
        ///     <see cref="RoutedEventArgs"/> for the
        ///     RoutedEvent to be raised post building
        ///     the route 
        /// </param>
        /// <returns> 
        ///     Whether or not the route should continue past the visual tree. 
        ///     If this is true, and there are no more visual parents, the route
        ///     building code will call the GetUIParentCore method to find the 
        ///     next non-visual parent.
        /// </returns>
//        internal virtual bool 
		BuildRouteCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args)
        { 
            return false;
        }, 
 
        /// <summary>
        ///     Builds the <see cref="EventRoute"/> 
        /// </summary>
        /// <param name="route">
        ///     The <see cref="EventRoute"/> being
        ///     built 
        /// </param>
        /// <param name="args"> 
        ///     <see cref="RoutedEventArgs"/> for the 
        ///     RoutedEvent to be raised post building
        ///     the route 
        /// </param>
//        internal void 
        BuildRoute:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args)
        {
            UIElement.BuildRouteHelper(this, route, args); 
        },
 
        /// <summary> 
        ///     Raise the events specified by
        ///     <see cref="RoutedEventArgs.RoutedEvent"/> 
        /// </summary>
        /// <remarks>
        ///     This method is a shorthand for
        ///     <see cref="UIElement.BuildRoute"/> and 
        ///     <see cref="EventRoute.InvokeHandlers"/>
        /// </remarks> 
        /// <param name="e"> 
        ///     <see cref="RoutedEventArgs"/> for the event to
        ///     be raised 
        /// </param>
        ///<SecurityNote>
        ///     By default clears the user initiated bit.
        ///     To guard against "replay" attacks. 
        ///</SecurityNote>
//        public void 
//        RaiseEvent(/*RoutedEventArgs*/ e) 
//        { 
//            // VerifyAccess();
// 
//            if (e == null)
//            {
//                throw new ArgumentNullException("e");
//            } 
//            e.ClearUserInitiated();
// 
//            UIElement.RaiseEventImpl(this, e); 
//        },
 
        /// <summary>
        ///     "Trusted" internal flavor of RaiseEvent.
        ///     Used to set the User-initated RaiseEvent.
        /// </summary> 
        ///<SecurityNote>
        ///     Critical - sets the MarkAsUserInitiated bit. 
        ///</SecurityNote> 
//        internal void 
        RaiseEvent:function(/*RoutedEventArgs*/ args, /*bool*/ trusted) 
        {
        	if(trusted === undefined){
        		trusted = false;
        	}
        	
            if (args == null)
            {
                throw new ArgumentNullException("args"); 
            }
 
            if (trusted) 
            {
                this.RaiseTrustedEvent(args); 
            }
            else
            {
                args.ClearUserInitiated(); 

                UIElement.RaiseEventImpl(this, args); 
            } 
        },
 
        ///<SecurityNote>
        ///     Critical - sets the MarkAsUserInitiated bit.
        ///</SecurityNote>
//        internal void 
        RaiseTrustedEvent:function(/*RoutedEventArgs*/ args) 
        { 
            if (args == null)
            { 
                throw new ArgumentNullException("args");
            }

            // Try/finally to ensure that UserInitiated bit is cleared. 
            args.MarkAsUserInitiated();
 
            try 
            {
                UIElement.RaiseEventImpl(this, args); 
            }
            finally
            {
                // Clear the bit - just to guarantee it's not used again 
                args.ClearUserInitiated();
            } 
        },

        /// <summary>
        ///     Allows adjustment to the event source
        /// </summary>
        /// <remarks> 
        ///     Subclasses must override this method
        ///     to be able to adjust the source during 
        ///     route invocation <para/> 
        ///
        ///     NOTE: Expected to return null when no 
        ///     change is made to source
        /// </remarks>
        /// <param name="args">
        ///     Routed Event Args 
        /// </param>
        /// <returns> 
        ///     Returns new source 
        /// </returns>
//        internal virtual object 
        AdjustEventSource:function(/*RoutedEventArgs*/ args) 
        {
            return null;
        },
        
        /// <summary>
        ///     See overloaded method for details 
        /// </summary> 
        /// <remarks>
        ///     handledEventsToo defaults to false <para/> 
        ///     See overloaded method for details
        /// </remarks>
        /// <param name="routedEvent"/>
        /// <param name="handler"/> 
//        public void 
//        AddHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
//        { 
//            // HandledEventToo defaults to false 
//            // Call forwarded
//            AddHandler(routedEvent, handler, false); 
//        },
        
        /// <summary>
        ///     Adds a routed event handler for the particular 
        ///     <see cref="RoutedEvent"/>
        /// </summary> 
        /// <remarks> 
        ///     The handler added thus is also known as
        ///     an instance handler <para/> 
        ///     <para/>
        ///
        ///     NOTE: It is not an error to add a handler twice
        ///     (handler will simply be called twice) <para/> 
        ///     <para/>
        /// 
        ///     Input parameters <see cref="RoutedEvent"/> 
        ///     and handler cannot be null <para/>
        ///     handledEventsToo input parameter when false means 
        ///     that listener does not care about already handled events.
        ///     Hence the handler will not be invoked on the target if
        ///     the RoutedEvent has already been
        ///     <see cref="RoutedEventArgs.Handled"/> <para/> 
        ///     handledEventsToo input parameter when true means
        ///     that the listener wants to hear about all events even if 
        ///     they have already been handled. Hence the handler will 
        ///     be invoked irrespective of the event being
        ///     <see cref="RoutedEventArgs.Handled"/> 
        /// </remarks>
        /// <param name="routedEvent">
        ///     <see cref="RoutedEvent"/> for which the handler
        ///     is attached 
        /// </param>
        /// <param name="handler"> 
        ///     The handler that will be invoked on this object 
        ///     when the RoutedEvent is raised
        /// </param> 
        /// <param name="handledEventsToo">
        ///     Flag indicating whether or not the listener wants to
        ///     hear about events that have already been handled
        /// </param> 
//        public void
        AddHandler:function(
            /*RoutedEvent*/ routedEvent, 
            /*Delegate*/ handler, 
            /*bool*/ handledEventsToo)
        { 
        	if(handledEventsToo === undefined){
        		handledEventsToo = false;
        	}
            // VerifyAccess();

            if (routedEvent == null)
            { 
                throw new ArgumentNullException("routedEvent");
            } 
 
            if (handler == null)
            { 
                throw new ArgumentNullException("handler");
            }

            if (!routedEvent.IsLegalHandler(handler)) 
            {
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
            } 

            this.EnsureEventHandlersStore(); 
            this.EventHandlersStore.AddRoutedEventHandler(routedEvent, handler, handledEventsToo);

            this.OnAddHandler (routedEvent, handler);
        }, 

        /// <summary> 
        ///     Notifies subclass of a new routed event handler.  Note that this is 
        ///     called once for each handler added, but OnRemoveHandler is only called
        ///     on the last removal. 
        /// </summary>
//        internal virtual void 
        OnAddHandler:function(
            /*RoutedEvent*/ routedEvent,
            /*Delegate*/ handler) 
        {
        }, 
 
        /// <summary>
        ///     Removes all instances of the specified routed 
        ///     event handler for this object instance
        /// </summary>
        /// <remarks>
        ///     The handler removed thus is also known as 
        ///     an instance handler <para/>
        ///     <para/> 
        /// 
        ///     NOTE: This method does nothing if there were
        ///     no handlers registered with the matching 
        ///     criteria <para/>
        ///     <para/>
        ///
        ///     Input parameters <see cref="RoutedEvent"/> 
        ///     and handler cannot be null <para/>
        ///     This method ignores the handledEventsToo criterion 
        /// </remarks> 
        /// <param name="routedEvent">
        ///     <see cref="RoutedEvent"/> for which the handler 
        ///     is attached
        /// </param>
        /// <param name="handler">
        ///     The handler for this object instance to be removed 
        /// </param>
//        public void 
        RemoveHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler) 
        { 
            // VerifyAccess();
 
            if (routedEvent == null)
            {
                throw new ArgumentNullException("routedEvent");
            } 

            if (handler == null) 
            { 
                throw new ArgumentNullException("handler");
            } 

            if (!routedEvent.IsLegalHandler(handler))
            {
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
            }
 
            var store = this.EventHandlersStore; 
            if (store != null)
            { 
                store.RemoveRoutedEventHandler(routedEvent, handler);

                this.OnRemoveHandler (routedEvent, handler);
 
                if (store.Count == 0)
                { 
                    // last event handler was removed -- throw away underlying EventHandlersStore 
                    EventHandlersStoreField.ClearValue(this);
                    this.WriteFlag(CoreFlags.ExistsEventHandlersStore, false); 
                }

            }
        }, 

        /// <summary> 
        ///     Notifies subclass of an event for which a handler has been removed. 
        /// </summary>
//        internal virtual void 
        OnRemoveHandler:function( 
            /*RoutedEvent*/ routedEvent,
            /*Delegate*/ handler)
        {
        }, 

//        private void 
        EventHandlersStoreAdd:function(/*EventPrivateKey*/ key, /*Delegate*/ handler) 
        { 
            this.EnsureEventHandlersStore();
            this.EventHandlersStore.Add(key, handler); 
        },

//        private void 
        EventHandlersStoreRemove:function(/*EventPrivateKey*/ key, /*Delegate*/ handler)
        { 
            var store = this.EventHandlersStore;
            if (store != null) 
            { 
                store.Remove(key, handler);
                if (store.Count == 0) 
                {
                    // last event handler was removed -- throw away underlying EventHandlersStore
                    EventHandlersStoreField.ClearValue(this);
                    this.WriteFlag(CoreFlags.ExistsEventHandlersStore, false); 
                }
            } 
        }, 

        ///     Add the event handlers for this element to the route.
//        public void 
        AddToEventRoute:function(/*EventRoute*/ route, /*RoutedEventArgs*/ e)
        { 
            if (route == null)
            { 
                throw new ArgumentNullException("route"); 
            }
            if (e == null) 
            {
                throw new ArgumentNullException("e");
            }
 
            // Get class listeners for this UIElement
            /*RoutedEventHandlerInfoList*/var classListeners = 
                GlobalEventManager.GetDTypedClassListeners(this.DependencyObjectType, e.RoutedEvent); 

            // Add all class listeners for this UIElement 
            while (classListeners != null)
            {
                for(var i = 0; i < classListeners.Handlers.length; i++)
                { 
                    route.Add(this, classListeners.Handlers[i].Handler, classListeners.Handlers[i].InvokeHandledEventsToo);
                } 
 
                classListeners = classListeners.Next;
            } 

            // Get instance listeners for this UIElement
            /*FrugalObjectList<RoutedEventHandlerInfo>*/var instanceListeners = null;
            var store = this.EventHandlersStore; 
            if (store != null)
            { 
                instanceListeners = store.Get(e.RoutedEvent); 

                // Add all instance listeners for this UIElement 
                if (instanceListeners != null)
                {
                    for (var i = 0; i < instanceListeners.Count; i++)
                    { 
                        route.Add(this, instanceListeners.Get(i).Handler, instanceListeners.Get(i).InvokeHandledEventsToo);
                    } 
                } 
            }
 
            // Allow Framework to add event handlers in styles
            this.AddToEventRouteCore(route, e);
        },
 
        ///     This virtual method is to be overridden in Framework 
        ///     to be able to add handlers for styles 
//        internal virtual void 
        AddToEventRouteCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        {
        },
        ///     Ensures that EventHandlersStore will return
        ///     non-null when it is called. 
//        internal void 
        EnsureEventHandlersStore:function()
        { 
            if (this.EventHandlersStore == null)
            { 
                EventHandlersStoreField.SetValue(this, new EventHandlersStore()); 
                this.WriteFlag(CoreFlags.ExistsEventHandlersStore, true);
            } 
        },

 
//        internal virtual bool 
        InvalidateAutomationAncestorsCore:function(/*Stack<DependencyObject>*/ branchNodeStack, /*out bool continuePastVisualTree*/continuePastVisualTreeOut)
        { 
            continuePastVisualTree = false; 
            return true;
        }, 
     
        /// <summary> 
        ///     Virtual method reporting the mouse button was pressed
        /// </summary>
//        protected virtual void 
        OnPreviewMouseDown:function(/*MouseButtonEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the mouse button was pressed
        /// </summary>
//        protected virtual void 
        OnMouseDown:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the mouse button was released
        /// </summary> 
//        protected virtual void 
        OnPreviewMouseUp:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the mouse button was released 
        /// </summary>
//        protected virtual void 
        OnMouseUp:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the left mouse button was pressed
        /// </summary> 
//        protected virtual void 
        OnPreviewMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) {}, 
 
        /// <summary>
        ///     Virtual method reporting the left mouse button was pressed 
        /// </summary> 
//        protected virtual void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) {},
        
        /// <summary> 
        ///     Virtual method reporting the left mouse button was released
        /// </summary> 
//        protected virtual void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the right mouse button was pressed 
        /// </summary>
//        protected virtual void 
        OnPreviewMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the right mouse button was pressed
        /// </summary>
//        protected virtual void 
        OnMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the right mouse button was released
        /// </summary>
//        protected virtual void 
        OnPreviewMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the right mouse button was released
        /// </summary> 
//        protected virtual void 
        OnMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting a mouse move 
        /// </summary>
//        protected virtual void 
        OnPreviewMouseMove:function(/*MouseEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting a mouse move
        /// </summary> 
//        protected virtual void 
        OnMouseMove:function(/*MouseEventArgs*/ e) {}, 
 
        /// <summary>
        ///     Virtual method reporting a mouse wheel rotation 
        /// </summary> 
//        protected virtual void 
        OnPreviewMouseWheel:function(/*MouseWheelEventArgs*/ e) {},
 
        /// <summary> 
        ///     Virtual method reporting the left mouse button was released 
        /// </summary>
//        protected virtual void 
        OnPreviewMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting a mouse wheel rotation 
        /// </summary>
//        protected virtual void 
        OnMouseWheel:function(/*MouseWheelEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the mouse entered this element
        /// </summary> 
//        protected virtual void 
        OnMouseEnter:function(/*MouseEventArgs*/ e) {},
    
        /// <summary>
        ///     Virtual method reporting the mouse left this element 
        /// </summary>
//        protected virtual void 
        OnMouseLeave:function(/*MouseEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting that this element got the mouse capture
        /// </summary>
//        protected virtual void 
        OnGotMouseCapture:function(/*MouseEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting that this element lost the mouse capture
        /// </summary>
//        protected virtual void 
        OnLostMouseCapture:function(/*MouseEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the cursor to display was requested
        /// </summary> 
//        protected virtual void 
        OnQueryCursor:function(/*QueryCursorEventArgs*/ e) {},
        
        /// <summary>
        ///     Virtual method reporting a stylus-down 
        /// </summary>
//        protected virtual void 
        OnPreviewStylusDown:function(/*StylusDownEventArgs*/ e) {}, 
        
        /// <summary> 
        ///     Virtual method reporting a stylus-down
        /// </summary> 
//        protected virtual void 
        OnStylusDown:function(/*StylusDownEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting a stylus-up 
        /// </summary> 
//        protected virtual void 
        OnPreviewStylusUp:function(/*StylusEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting a stylus-up 
        /// </summary>
//        protected virtual void 
        OnStylusUp:function(/*StylusEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting a stylus move
        /// </summary> 
//        protected virtual void 
        OnPreviewStylusMove:function(/*StylusEventArgs*/ e) {},
        /// <summary>
        ///     Virtual method reporting a stylus move 
        /// </summary>
//        protected virtual void 
        OnStylusMove:function(/*StylusEventArgs*/ e) {},
        
        /// <summary> 
        ///     Virtual method reporting a stylus-in-air-move
        /// </summary>
//        protected virtual void 
        OnPreviewStylusInAirMove:function(/*StylusEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting a stylus-in-air-move
        /// </summary>
//        protected virtual void 
        OnStylusInAirMove:function(/*StylusEventArgs*/ e) {}, 
        /// <summary>
        ///     Virtual method reporting the stylus entered this element
        /// </summary> 
//        protected virtual void 
        OnStylusEnter:function(/*StylusEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the stylus left this element 
        /// </summary>
//        protected virtual void 
        OnStylusLeave:function(/*StylusEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting the stylus is now in range of the digitizer
        /// </summary> 
//        protected virtual void 
        OnPreviewStylusInRange:function(/*StylusEventArgs*/ e) {}, 
     
        /// <summary>
        ///     Virtual method reporting the stylus is now in range of the digitizer 
        /// </summary> 
//        protected virtual void 
        OnStylusInRange:function(/*StylusEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the stylus is now out of range of the digitizer 
        /// </summary>
//        protected virtual void 
        OnPreviewStylusOutOfRange:function(/*StylusEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting the stylus is now out of range of the digitizer
        /// </summary> 
//        protected virtual void 
        OnStylusOutOfRange:function(/*StylusEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting a stylus system gesture 
        /// </summary>
//        protected virtual void 
        OnPreviewStylusSystemGesture:function(/*StylusSystemGestureEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting a stylus system gesture
        /// </summary>
//        protected virtual void 
        OnStylusSystemGesture:function(/*StylusSystemGestureEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting that this element got the stylus capture
        /// </summary>
//        protected virtual void 
        OnGotStylusCapture:function(/*StylusEventArgs*/ e) {}, 
        
        /// <summary>
        ///     Virtual method reporting that this element lost the stylus capture
        /// </summary> 
//        protected virtual void 
        OnLostStylusCapture:function(/*StylusEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the stylus button is down 
        /// </summary>
//        protected virtual void 
        OnStylusButtonDown:function(/*StylusButtonEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the stylus button is up
        /// </summary> 
//        protected virtual void 
        OnStylusButtonUp:function(/*StylusButtonEventArgs*/ e) {}, 
        /// <summary>
        ///     Virtual method reporting the stylus button is down 
        /// </summary> 
//        protected virtual void 
        OnPreviewStylusButtonDown:function(/*StylusButtonEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the stylus button is up 
        /// </summary>
//        protected virtual void 
        OnPreviewStylusButtonUp:function(/*StylusButtonEventArgs*/ e) {}, 
    
        /// <summary> 
        ///     Virtual method reporting a key was pressed
        /// </summary> 
//        protected virtual void 
        OnPreviewKeyDown:function(/*KeyEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting a key was pressed 
        /// </summary>
//        protected virtual void 
        OnKeyDown:function(/*KeyEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting a key was released
        /// </summary>
//        protected virtual void 
        OnPreviewKeyUp:function(/*KeyEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting a key was released
        /// </summary>
//        protected virtual void 
        OnKeyUp:function(/*KeyEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting that the keyboard is focused on this element
        /// </summary> 
//        protected virtual void 
        OnPreviewGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting that the keyboard is focused on this element 
        /// </summary>
//        protected virtual void 
        OnGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed
        /// </summary> 
//        protected virtual void 
        OnPreviewLostKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {}, 
 
 
        /// <summary>
        ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
        /// </summary> 
//        protected virtual void 
        OnLostKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting text composition 
        /// </summary>
//        protected virtual void 
        OnPreviewTextInput:function(/*TextCompositionEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting text composition
        /// </summary> 
//        protected virtual void 
        OnTextInput:function(/*TextCompositionEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the preview query continue drag is going to happen 
        /// </summary>
//        protected virtual void 
        OnPreviewQueryContinueDrag:function(/*QueryContinueDragEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the query continue drag is going to happen
        /// </summary>
//        protected virtual void 
        OnQueryContinueDrag:function(/*QueryContinueDragEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the preview give feedback is going to happen
        /// </summary>
//        protected virtual void 
        OnPreviewGiveFeedback:function(/*GiveFeedbackEventArgs*/ e) {}, 
   
        /// <summary>
        ///     Virtual method reporting the give feedback is going to happen
        /// </summary> 
//        protected virtual void 
        OnGiveFeedback:function(/*GiveFeedbackEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the preview drag enter is going to happen 
        /// </summary>
//        protected virtual void 
        OnPreviewDragEnter:function(/*DragEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the drag enter is going to happen
        /// </summary> 
//        protected virtual void 
        OnDragEnter:function(/*DragEventArgs*/ e) {}, 
 
        /// <summary>
        ///     Virtual method reporting the preview drag over is going to happen 
        /// </summary> 
//        protected virtual void 
        OnPreviewDragOver:function(/*DragEventArgs*/ e) {},
        
        /// <summary> 
        ///     Virtual method reporting the drag over is going to happen 
        /// </summary>
//        protected virtual void 
        OnDragOver:function(/*DragEventArgs*/ e) {}, 
 
        /// <summary>
        ///     Virtual method reporting the drag leave is going to happen 
        /// </summary>
//        protected virtual void 
        OnDragLeave:function(/*DragEventArgs*/ e) {},
   
        /// <summary> 
        ///     Virtual method reporting the preview drag leave is going to happen
        /// </summary> 
//        protected virtual void 
        OnPreviewDragLeave:function(/*DragEventArgs*/ e) {},
        
        /// <summary> 
        ///     Virtual method reporting the preview drop is going to happen
        /// </summary>
//        protected virtual void 
        OnPreviewDrop:function(/*DragEventArgs*/ e) {},
      
        /// <summary>
        ///     Virtual method reporting the drag enter is going to happen
        /// </summary>
//        protected virtual void 
        OnDrop:function(/*DragEventArgs*/ e) {}, 
       
        /// <summary>
        ///     Virtual method reporting a finger touched the screen 
        /// </summary>
//        protected virtual void 
        OnPreviewTouchDown:function(/*TouchEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting a finger touched the screen 
        /// </summary> 
//        protected virtual void 
        OnTouchDown:function(/*TouchEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting a finger moved across the screen
        /// </summary> 
//        protected virtual void 
        OnPreviewTouchMove:function(/*TouchEventArgs*/ e) {},
 
        /// <summary> 
        ///     Virtual method reporting a finger moved across the screen
        /// </summary>
//        protected virtual void 
        OnTouchMove:function(/*TouchEventArgs*/ e) {},
  
        /// <summary>
        ///     Virtual method reporting a finger lifted off the screen
        /// </summary> 
//        protected virtual void 
        OnPreviewTouchUp:function(/*TouchEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting a finger lifted off the screen
        /// </summary> 
//        protected virtual void 
        OnTouchUp:function(/*TouchEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting a finger was captured to an element 
        /// </summary>
//        protected virtual void 
        OnGotTouchCapture:function(/*TouchEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting a finger is no longer captured to an element 
        /// </summary>
//        protected virtual void 
        OnLostTouchCapture:function(/*TouchEventArgs*/ e) {},
       
        /// <summary>
        ///     Virtual method reporting the mouse entered this element
        /// </summary>
//        protected virtual void 
        OnTouchEnter:function(/*TouchEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the mouse left this element 
        /// </summary>
//        protected virtual void 
        OnTouchLeave:function(/*TouchEventArgs*/ e) {}, 
 
        /// <summary>
        ///     An event reporting that the IsMouseDirectlyOver property changed.
        /// </summary>
//        protected virtual void 
        OnIsMouseDirectlyOverChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        {
        },
 
//        private void 
        RaiseIsMouseDirectlyOverChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        { 
            // Call the virtual method first.
            this.OnIsMouseDirectlyOverChanged(args);

            // Raise the public event second. 
            this.RaiseDependencyPropertyChanged(UIElement.IsMouseDirectlyOverChangedKey, args);
        },
 
        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed.
        /// </summary> 
//        protected virtual void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        }, 

//        internal void 
        RaiseIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ args) 
        {
            // Call the virtual method first.
            this.OnIsKeyboardFocusWithinChanged(args);
 
            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusWithinChangedKey, args); 
        }, 

        /// <summary>
        ///     An event reporting that the IsMouseCaptured property changed.
        /// </summary> 
//        protected virtual void 
        OnIsMouseCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        }, 

//        private void 
        RaiseIsMouseCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ args) 
        {
            // Call the virtual method first.
            this.OnIsMouseCapturedChanged(args);
 
            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsMouseCapturedChangedKey, args); 
        }, 
 
        /// <summary>
        ///     An event reporting that the IsMouseCaptureWithin property changed. 
        /// </summary> 
//        protected virtual void 
        OnIsMouseCaptureWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        },

//        internal void 
        RaiseIsMouseCaptureWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        { 
            // Call the virtual method first.
            this.OnIsMouseCaptureWithinChanged(args); 
 
            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsMouseCaptureWithinChangedKey, args); 
        },
     
        /// <summary>
        ///     An event reporting that the IsStylusDirectlyOver property changed. 
        /// </summary> 
//        protected virtual void 
        OnIsStylusDirectlyOverChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        },

//        private void 
        RaiseIsStylusDirectlyOverChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        { 
            // Call the virtual method first.
            this.OnIsStylusDirectlyOverChanged(args); 
 
            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsStylusDirectlyOverChangedKey, args); 
        },
 
        /// <summary>
        ///     An event reporting that the IsStylusCaptured property changed. 
        /// </summary> 
//        protected virtual void 
        OnIsStylusCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        },

//        private void 
        RaiseIsStylusCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        { 
            // Call the virtual method first.
            this.OnIsStylusCapturedChanged(args); 
 
            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsStylusCapturedChangedKey, args); 
        },
 
        /// <summary>
        ///     An event reporting that the IsStylusCaptureWithin property changed. 
        /// </summary>
//        protected virtual void 
        OnIsStylusCaptureWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
        }, 

//        internal void 
        RaiseIsStylusCaptureWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ args) 
        { 
            // Call the virtual method first.
            this.OnIsStylusCaptureWithinChanged(args); 

            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsStylusCaptureWithinChangedKey, args);
        }, 
 
        /// <summary>
        ///     An event reporting that the IsKeyboardFocused property changed. 
        /// </summary>
//        protected virtual void 
        OnIsKeyboardFocusedChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
        }, 

//        private void 
        RaiseIsKeyboardFocusedChanged:function(/*DependencyPropertyChangedEventArgs*/ args) 
        { 
            // Call the virtual method first.
            this.OnIsKeyboardFocusedChanged(args); 

            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusedChangedKey, args);
        }, 

//        internal bool 
        ReadFlag:function(/*CoreFlags*/ field)
        {
            return (this._flags1 & field) != 0; 
        },
 
//        internal void 
        WriteFlag:function(/*CoreFlags*/ field,/*bool*/ value) 
        {
            if (value) 
            {
            	this._flags1 |= field;
            }
            else 
            {
            	this._flags1 &= (~field); 
            } 
        },
 
//        private CoreFlags       _flags;
 
        
 
        // This is needed to prevent dirty elements from drawing and crashing while doing so.
//        private bool 
        IsRenderable:function() 
        { 
            //elements that were created but never invalidated/measured are clean
            //from layout perspective, but we still don't want to render them 
            //because they don't have state build up enough for that.
            if(this.NeverMeasured || this.NeverArranged)
                return false;
 
            //if element is collapsed, no rendering is needed
            //it is not only perf optimization, but also protection from 
            //UIElement to break itself since RenderSize is reported as (0,0) 
            //when UIElement is Collapsed
            if(this.ReadFlag(CoreFlags.IsCollapsed)) 
                return false;

            return IsMeasureValid && IsArrangeValid;
        }, 

//        internal void 
        InvalidateMeasureInternal:function() 
        { 
            this.MeasureDirty = true;
        }, 

//        internal void 
        InvalidateArrangeInternal:function()
        {
            this.ArrangeDirty = true; 
        },
        
        /// <summary> 
        /// Invalidates the measurement state for the element.
        /// This has the effect of also invalidating the arrange state for the element. 
        /// The element will be queued for an update layout that will occur asynchronously.
        /// </summary>
//        public void 
        InvalidateMeasure:function()
        { 
            if(!this.MeasureDirty
                &&  !this.MeasureInProgress ) 
            { 
//                Debug.Assert(MeasureRequest == null, "can't be clean and still have MeasureRequest");
 
                if(!this.NeverMeasured) //only measured once elements are allowed in *update* queue
                { 
//                    /*ContextLayoutManager*/var ContextLayoutManager = ContextLayoutManager.From(Dispatcher);
//                    ContextLayoutManager.MeasureQueue.Add(this); 
                } 
                this.MeasureDirty = true;
            }
            
//            var p = VisualTreeHelper.GetParent(this); 
//            this.Arrange(p._dom);
        },

        /// <summary>
        /// Invalidates the arrange state for the element. 
        /// The element will be queued for an update layout that will occur asynchronously.
        /// MeasureCore will not be called unless InvalidateMeasure is also called - or that something 
        /// else caused the measure state to be invalidated. 
        /// </summary>
//        public void 
        InvalidateArrange:function() 
        {
            if(   !this.ArrangeDirty
               && !this.ArrangeInProgress)
            { 
//                Debug.Assert(ArrangeRequest == null, "can't be clean and still have MeasureRequest");
 
                if(!this.NeverArranged) 
                {
//                    var ContextLayoutManager = ContextLayoutManager.From(Dispatcher);
//                    ContextLayoutManager.ArrangeQueue.Add(this);
                } 

 
                this.ArrangeDirty = true; 
            }
        	this.LayoutUpdated.Invoke(this, EventArgs.Empty);  //cym add 2014-01-04
        }, 

        /// <summary>
        /// Invalidates the rendering of the element.
        /// Causes <see cref="System.Windows.UIElement.OnRender"/> to be called at a later time. 
        /// </summary>
//        public void 
        InvalidateVisual:function() 
        { 
            this.InvalidateArrange();
            this.RenderingInvalidated = true; 
        },


        /// <summary> 
        /// Notification that is called by Measure of a child when
        /// it ends up with different desired size for the child. 
        /// </summary> 
        /// <remarks>
        /// Default implementation simply calls invalidateMeasure(), assuming that layout of a 
        /// parent should be updated after child changed its size.<para/>
        /// Finer point: this method can only be called in the scenario when the system calls Measure on a child,
        /// not when parent calls it since if parent calls it, it means parent has dirty layout and is recalculating already.
        /// </remarks> 
//        protected virtual void 
        OnChildDesiredSizeChanged:function(/*UIElement*/ child)
        { 
            if(this.IsMeasureValid) 
            {
            	this.InvalidateMeasure(); 
            }
        },

 
//        private void 
        addLayoutUpdatedHandler:function(/*EventHandler*/ handler, /*LayoutEventList.ListItem*/ item)
        { 
            var cachedLayoutUpdatedItems = LayoutUpdatedListItemsField.GetValue(this);

            if(cachedLayoutUpdatedItems == null)
            { 
               LayoutUpdatedListItemsField.SetValue(this, item);
               LayoutUpdatedHandlersField.SetValue(this, handler); 
            } 
            else
            { 
                var cachedLayoutUpdatedHandler = LayoutUpdatedHandlersField.GetValue(this);
                if(cachedLayoutUpdatedHandler != null)
                {
                    //second unique handler is coming in. 
                    //allocate a datastructure
                    var list = new Hashtable(2); 
 
                    //add previously cached handler
                    list.Add(cachedLayoutUpdatedHandler, cachedLayoutUpdatedItems); 

                    //add new handler
                    list.Add(handler, item);
 
                    LayoutUpdatedHandlersField.ClearValue(this);
                    LayoutUpdatedListItemsField.SetValue(this,list); 
                } 
                else //already have a list
                { 
                    var list = cachedLayoutUpdatedItems;
                    list.Add(handler, item);
                }
            } 
        },
 
//        private LayoutEventList.ListItem 
        getLayoutUpdatedHandler:function(/*EventHandler*/ d) 
        {
            var cachedLayoutUpdatedItems = LayoutUpdatedListItemsField.GetValue(this); 

            if(cachedLayoutUpdatedItems == null)
            {
               return null; 
            }
            else 
            { 
                var cachedLayoutUpdatedHandler = LayoutUpdatedHandlersField.GetValue(this);
                if(cachedLayoutUpdatedHandler != null) 
                {
                    if(cachedLayoutUpdatedHandler == d) return cachedLayoutUpdatedItems;
                }
                else //already have a list 
                {
                    var list = cachedLayoutUpdatedItems; 
                    var item = /*(LayoutEventList.ListItem)*/(list.Get(d)); 
                    return item;
                } 
                return null;
            }
        },
 
//        private void 
        removeLayoutUpdatedHandler:function(/*EventHandler*/ d)
        { 
            var cachedLayoutUpdatedItems = LayoutUpdatedListItemsField.GetValue(this); 
            var cachedLayoutUpdatedHandler = LayoutUpdatedHandlersField.GetValue(this);
 
            if(cachedLayoutUpdatedHandler != null) //single handler
            {
                if(cachedLayoutUpdatedHandler == d)
                { 
                    LayoutUpdatedListItemsField.ClearValue(this);
                    LayoutUpdatedHandlersField.ClearValue(this); 
                } 
            }
            else //there is an ArrayList allocated 
            {
                var list = /*(Hashtable)*/cachedLayoutUpdatedItems;
                list.Remove(d);
            } 
        },

        /// <summary>
        /// Updates DesiredSize of the UIElement. Must be called by parents from theor MeasureCore, to form recursive update.
        /// This is first pass of layout update. 
        /// </summary>
        /// <remarks> 
        /// Measure is called by parents on their children. Internally, Measure calls MeasureCore override on the same object, 
        /// giving it opportunity to compute its DesiredSize.<para/>
        /// This method will return immediately if child is not Dirty, previously measured 
        /// and availableSize is the same as cached. <para/>
        /// This method also resets the IsMeasureinvalid bit on the child.<para/>
        /// In case when "unbounded measure to content" is needed, parent can use availableSize
        /// as double.PositiveInfinity. Any returned size is OK in this case. 
        /// </remarks>
        /// <param name="availableSize">Available size that parent can give to the child. May be infinity (when parent wants to 
        /// measure to content). This is soft constraint. Child can return bigger size to indicate that it wants bigger space and hope 
        /// that parent can throw in scrolling...</param>
//        public void 
        Measure:function() 
        {
        	this.MeasureCore(); 
        }, 

         //only one will be returned, whichever found first 
//        internal void 
        GetUIParentOrICH:function(/*out UIElement uiParent*/uiParentOut, /*out IContentHost ich*/ichOut) 
        {
        	ichOut.ich = null; 
        	uiParentOut.uiParent = null;

            for(var v = (VisualTreeHelper.GetParent(this) instanceof Visual ? VisualTreeHelper.GetParent(this): null) ; 
            	v != null; v = (VisualTreeHelper.GetParent(v) instanceof Visual ? VisualTreeHelper.GetParent(v) : null))
            { 
            	ichOut.ich = v instanceof IContentHost ? v : null;
                if (ichOut.ich != null) break; 
 
                if(v.CheckFlagsAnd(VisualFlags.IsUIElement))
                { 
                	uiParentOut.uiParent = v;
                    break;
                }
            } 
        },
 
         //walks visual tree up to find UIElement parent within Element Layout Island, so stops the walk if the island's root is found 
//        internal UIElement 
        GetUIParentWithinLayoutIsland:function()
        { 
            var uiParent = null;

            for(var v = (VisualTreeHelper.GetParent(this) instanceof Visual ? VisualTreeHelper.GetParent(this): null); 
            	v != null; v = v = (VisualTreeHelper.GetParent(v) instanceof Visual ? VisualTreeHelper.GetParent(v) : null))
            { 
                if (v.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                { 
                    break; 
                }
 
                if(v.CheckFlagsAnd(VisualFlags.IsUIElement))
                {
                    uiParent = v;
                    break; 
                }
            } 
            return uiParent; 
        },
 

        /// <summary>
        /// Parents or system call this method to arrange the internals of children on a second pass of layout update.
        /// </summary> 
        /// <remarks>
        /// This method internally calls ArrangeCore override, giving the derived class opportunity 
        /// to arrange its children and/or content using final computed size. 
        /// In their ArrangeCore overrides, derived class is supposed to create its visual structure and
        /// prepare itself for rendering. Arrange is called by parents 
        /// from their implementation of ArrangeCore or by system when needed.
        /// This method sets Bounds=finalSize before calling ArrangeCore.
        /// </remarks>
        /// <param name="finalRect">This is the final size and location that parent or system wants this UIElement to assume.</param> 
//        public void 
        Arrange:function(/*DOMElement*/ parent)
        { 
        	this.UpdateIsVisibleCache();
        	this.Measure(parent);

            this.ArrangeCore(parent);
            
            this.InvalidateArrange();
        }, 

////        private void 
//        updatePixelSnappingGuidelines:function() 
//        {
//            if((!this.SnapsToDevicePixels) || (this._drawingContent == null)) 
//            {
//                this.VisualXSnappingGuidelines = this.VisualYSnappingGuidelines = null;
//            }
//            else 
//            {
//                var xLines = this.VisualXSnappingGuidelines; 
// 
//                if(xLines == null)
//                { 
//                    xLines = new DoubleCollection();
//                    xLines.Add(0);
//                    xLines.Add(this.RenderSize.Width);
//                    this.VisualXSnappingGuidelines = xLines; 
//                }
//                else 
//                { 
//                // xLines[0] = 0d;  - this already should be so
//                // check to avoid potential dirtiness in renderer 
//                    var lastGuideline = xLines.Count - 1;
//                    if(!DoubleUtil.AreClose(xLines[lastGuideline], this.RenderSize.Width))
//                        xLines[lastGuideline] = this.RenderSize.Width;
//                } 
//
//                var yLines = this.VisualYSnappingGuidelines; 
//                if(yLines == null) 
//                {
//                    yLines = new DoubleCollection(); 
//                    yLines.Add(0);
//                    yLines.Add(this.RenderSize.Height);
//                    this.VisualYSnappingGuidelines = yLines;
//                } 
//                else
//                { 
//                // yLines[0] = 0d;  - this already should be so 
//                // check to avoid potential dirtiness in renderer
//                    var lastGuideline = yLines.Count - 1; 
//                    if(!DoubleUtil.AreClose(yLines[lastGuideline], this.RenderSize.Height))
//                        yLines[lastGuideline] = this.RenderSize.Height;
//                }
//            } 
//        },
// 
////        private bool 
//        markForSizeChangedIfNeeded:function(/*Size*/ oldSize, /*Size*/ newSize) 
//        {
//            //already marked for SizeChanged, simply update the newSize 
//            var widthChanged = !DoubleUtil.AreClose(oldSize.Width, newSize.Width);
//            var heightChanged = !DoubleUtil.AreClose(oldSize.Height, newSize.Height);
//
//            var info = sizeChangedInfo; 
//
//            if(info != null) 
//            { 
//                info.Update(widthChanged, heightChanged);
//                return true; 
//            }
//            else if(widthChanged || heightChanged)
//            {
//                info = new SizeChangedInfo(this, oldSize, widthChanged, heightChanged); 
//                sizeChangedInfo = info;
//                ContextLayoutManager.From(Dispatcher).AddToSizeChangedChain(info); 
// 
//                //
//                // This notifies Visual layer that hittest boundary potentially changed 
//                //
//
//                this.PropagateFlags(
//                    this, 
//                    VisualFlags.IsSubtreeDirtyForPrecompute,
//                    VisualProxyFlags.IsSubtreeDirtyForRender); 
// 
//                return true;
//            } 
//
//            //this result is used to determine if we need to call OnRender after Arrange
//            //OnRender is called for 2 reasons - someone called InvalidateVisual - then OnRender is called
//            //on next Arrange, or the size changed. 
//            return false;
//        }, 

        /// <summary> 
        /// This is invoked after layout update before rendering if the element's RenderSize 
        /// has changed as a result of layout update.
        /// </summary> 
        /// <param name="info">Packaged parameters (<seealso cref="SizeChangedInfo"/>, includes
        /// old and new sizes and which dimension actually changes. </param>
//        protected internal virtual void 
        OnRenderSizeChanged:function(/*SizeChangedInfo*/ info){}, 

        /// <summary> 
        /// Measurement override. Implement your size-to-content logic here. 
        /// </summary>
        /// <remarks> 
        /// MeasureCore is designed to be the main customizability point for size control of layout.
        /// Element authors should override this method, call Measure on each child element,
        /// and compute their desired size based upon the measurement of the children.
        /// The return value should be the desired size.<para/> 
        /// Note: It is required that a parent element calls Measure on each child or they won't be sized/arranged.
        /// Typical override follows a pattern roughly like this (pseudo-code): 
        /// <example> 
        ///     <code lang="C#">
        /// <![CDATA[ 
        ///
        /// protected override Size MeasureCore(Size availableSize)
        /// {
        ///     foreach (UIElement child in ...) 
        ///     {
        ///         child.Measure(availableSize); 
        ///         availableSize.Deflate(child.DesiredSize); 
        ///         _cache.StoreInfoAboutChild(child);
        ///     } 
        ///
        ///     Size desired = CalculateBasedOnCache(_cache);
        ///     return desired;
        /// } 
        /// ]]>
        ///     </code> 
        /// </example> 
        /// The key aspects of this snippet are:
        ///     <list type="bullet"> 
        /// <item>You must call Measure on each child element</item>
        /// <item>It is common to cache measurement information between the MeasureCore and ArrangeCore method calls</item>
        /// <item>Calling base.MeasureCore is not required.</item>
        /// <item>Calls to Measure on children are passing either the same availableSize as the parent, or a subset of the area depending 
        /// on the type of layout the parent will perform (for example, it would be valid to remove the area
        /// for some border or padding).</item> 
        ///     </list> 
        /// </remarks>
        /// <param name="availableSize">Available size that parent can give to the child. May be infinity (when parent wants to 
        /// measure to content). This is soft constraint. Child can return bigger size to indicate that it wants bigger space and hope
        /// that parent can throw in scrolling...</param>
        /// <returns>Desired Size of the control, given available size passed as parameter.</returns>
//        protected virtual Size 
        MeasureCore:function() 
        {
        },

        /// <summary>
        /// ArrangeCore allows for the customization of the final sizing and positioning of children.
        /// </summary> 
        /// <remarks>
        /// Element authors should override this method, call Arrange on each visible child element, 
        /// to size and position each child element by passing a rectangle reserved for the child within parent space. 
        /// Note: It is required that a parent element calls Arrange on each child or they won't be rendered.
        /// Typical override follows a pattern roughly like this (pseudo-code): 
        /// <example>
        ///     <code lang="C#">
        /// <![CDATA[
        /// 
        /// protected override Size ArrangeCore(Rect finalRect)
        /// { 
        ///     //Call base, it will set offset and _size to the finalRect: 
        ///     base.ArrangeCore(finalRect);
        /// 
        ///     foreach (UIElement child in ...)
        ///     {
        ///         child.Arrange(new Rect(childX, childY, childWidth, childHeight);
        ///     } 
        /// }
        /// ]]> 
        ///     </code> 
        /// </example>
        /// </remarks> 
        /// <param name="finalRect">The final area within the parent that element should use to arrange itself and its children.</param>
//        protected virtual void 
        ArrangeCore:function(/*DOMElement*/ )
        {
        }, 

        /// <summary>
        /// This method returns the hit-test bounds of a UIElement to the underlying Visual layer.
        /// </summary> 
//        internal override Rect 
        GetHitTestBounds:function()
        { 
            var hitBounds = new Rect(_size); 

            if (this._drawingContent != null) 
            {
                var mediaContext = MediaContext.From(Dispatcher);
                var ctx = mediaContext.AcquireBoundsDrawingContextWalker();
 
                var resultRect = this._drawingContent.GetContentBounds(ctx);
                mediaContext.ReleaseBoundsDrawingContextWalker(ctx); 
 
                hitBounds.Union(resultRect);
            } 

            return hitBounds;
        },
        
        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed. 
        /// </summary>
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param> 
//        protected internal override void 
        OnVisualParentChanged:function(/*DependencyObject*/ oldParent)
        {
            // Synchronize ForceInherit properties
            if (this._parent != null) 
            {
                var parent = this._parent; 
 
                if (!InputElement.IsUIElement(parent) && !InputElement.IsUIElement3D(parent))
                { 
                    var parentAsVisual = parent instanceof Visual ? parent : null;

                    if (parentAsVisual != null)
                    { 
                        // We are being plugged into a non-UIElement visual. This
                        // means that our parent doesn't play by the same rules we 
                        // do, so we need to track changes to our ancestors in 
                        // order to bridge the gap.
                        parentAsVisual.VisualAncestorChanged += new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 

                        // Try to find a UIElement ancestor to use for coersion.
                        parent = InputElement.GetContainingUIElement(parentAsVisual);
                    } 
//                    else
//                    { 
//                        Visual3D parentAsVisual3D = parent as Visual3D; 
//
//                        if (parentAsVisual3D != null) 
//                        {
//                            // We are being plugged into a non-UIElement visual. This
//                            // means that our parent doesn't play by the same rules we
//                            // do, so we need to track changes to our ancestors in 
//                            // order to bridge the gap.
//                            parentAsVisual3D.VisualAncestorChanged += new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 
// 
//                            // Try to find a UIElement ancestor to use for coersion.
//                            parent = InputElement.GetContainingUIElement(parentAsVisual3D); 
//                        }
//                    }
                }
 
                if (parent != null)
                { 
                	UIElement.SynchronizeForceInheritProperties(this, null, null, parent); 
                }
                else 
                {
                    // We don't have a UIElement parent or ancestor, so no
                    // coersions are necessary at this time.
                } 
            }
            else 
            { 
                var parent = oldParent;
 
                if (!InputElement.IsUIElement(parent) && !InputElement.IsUIElement3D(parent))
                {
                    // We are being unplugged from a non-UIElement visual. This
                    // means that our parent didn't play by the same rules we 
                    // do, so we started track changes to our ancestors in
                    // order to bridge the gap.  Now we can stop. 
                    if (oldParent instanceof Visual) 
                    {
                        oldParent.VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 
                    }
//                    else if (oldParent is Visual3D)
//                    {
//                        ((Visual3D) oldParent).VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 
//                    }
 
                    // Try to find a UIElement ancestor to use for coersion. 
                    parent = InputElement.GetContainingUIElement(oldParent);
                } 

                if (parent != null)
                {
                	UIElement.SynchronizeForceInheritProperties(this, null, null, parent); 
                }
                else 
                { 
                    // We don't have a UIElement parent or ancestor, so no
                    // coersions are necessary at this time. 
                }
            }

            // Synchronize ReverseInheritProperty Flags 
            //
            // NOTE: do this AFTER synchronizing force-inherited flags, since 
            // they often effect focusability and such. 
            this.SynchronizeReverseInheritPropertyFlags(oldParent, true);
        }, 

//        private void 
        OnVisualAncestorChanged_ForceInherit:function(/*object*/ sender, /*AncestorChangedEventArgs*/ e)
        {
            // NOTE: 
            //
            // We are forced to listen to AncestorChanged events because 
            // a UIElement may have raw Visuals between it and its nearest 
            // UIElement parent.  We only care about changes that happen
            // to the visual tree BETWEEN this UIElement and its nearest 
            // UIElement parent.  This is because we can rely on our
            // nearest UIElement parent to notify us when its force-inherit
            // properties change.
 
            var parent = null;
            if(e.OldParent == null) 
            { 
                // We were plugged into something.
 
                // Find our nearest UIElement parent.
                parent = InputElement.GetContainingUIElement(this._parent);

                // See if this parent is a child of the ancestor who's parent changed. 
                // If so, we don't care about changes that happen above us.
                if(parent != null && VisualTreeHelper.IsAncestorOf(e.Ancestor, parent)) 
                { 
                    parent = null;
                } 
            }
            else
            {
                // we were unplugged from something. 

                // Find our nearest UIElement parent. 
                parent = InputElement.GetContainingUIElement(_parent); 

                if(parent != null) 
                {
                    // If we found a UIElement parent in our subtree, the
                    // break in the visual tree must have been above it,
                    // so we don't need to respond. 
                    parent = null;
                } 
                else 
                {
                    // There was no UIElement parent in our subtree, so we 
                    // may be detaching from some UIElement parent above
                    // the break point in the tree.
                    parent = InputElement.GetContainingUIElement(e.OldParent);
                } 
            }
 
            if(parent != null) 
            {
            	UIElement.SynchronizeForceInheritProperties(this, null, null, parent); 
            }
        },

//        internal void 
        OnVisualAncestorChanged:function(/*object*/ sender, /*AncestorChangedEventArgs*/ e) 
        {
            var uie = sender instanceof UIElement ? sender : null; 
            if(null != uie) 
                PresentationSource.OnVisualAncestorChanged(uie, e);
        }, 

//        /// <summary>
//        /// Helper, gives the UIParent under control of which
//        /// the OnMeasure or OnArrange are currently called. 
//        /// This may be implemented as a tree walk up until
//        /// LayoutElement is found. 
//        /// </summary> 
////        internal DependencyObject 
//        GetUIParent:function()
//        { 
//            return UIElementHelper.GetUIParent(this, false);
//        },
//
////        internal DependencyObject 
//        GetUIParent:function(/*bool*/ continuePastVisualTree) 
//        {
//            return UIElementHelper.GetUIParent(this, continuePastVisualTree); 
//        }, 
        

//        internal DependencyObject 
        GetUIParent:function(/*bool*/ continuePastVisualTree) 
        {
        	if(continuePastVisualTree === undefined){
        		continuePastVisualTree = false;	
        	}
        	
            return UIElementHelper.GetUIParent(this, continuePastVisualTree); 
        }, 

//        internal DependencyObject 
        GetUIParentNo3DTraversal:function() 
        {
            var parent = null;

            // Try to find a UIElement parent in the visual ancestry. 
            var myParent = this.InternalVisualParent;
            parent = InputElement.GetContainingUIElement(myParent, true); 
 
            return parent;
        }, 

        /// <summary>
        ///     Called to get the UI parent of this element when there is
        ///     no visual parent. 
        /// </summary>
        /// <returns> 
        ///     Returns a non-null value when some framework implementation 
        ///     of this method has a non-visual parent connection,
        /// </returns> 
//        protected virtual internal DependencyObject 
        GetUIParentCore:function()
        {
            return null;
        }, 

        /// <summary> 
        /// Call this method to ensure that the whoel subtree of elements that includes this UIElement 
        /// is properly updated.
        /// </summary> 
        /// <remarks>
        /// This ensures that UIElements with IsMeasureInvalid or IsArrangeInvalid will
        /// get call to their MeasureCore and ArrangeCore, and all computed sizes will be validated.
        /// This method does nothing if layout is clean but it does work if layout is not clean so avoid calling 
        /// it after each change in the element tree. It makes sense to either never call it (system will do this
        /// in a deferred manner) or only call it if you absolutely need updated sizes and positions after you do all changes. 
        /// </remarks> 
//        public void 
        UpdateLayout:function()
        { 
//             VerifyAccess();
        	
        	//cym comment
//            ContextLayoutManager.From(Dispatcher).UpdateLayout();
        },

        // If this element is currently listening to synchronized input, add a pre-opportunity handler to keep track of event routed through this element. 
//        internal void 
        AddSynchronizedInputPreOpportunityHandler:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        {
            if (InputManager.IsSynchronizedInput) 
            {
                if (SynchronizedInputHelper.IsListening(this, args))
                {
                    var eventHandler = new RoutedEventHandler(this.SynchronizedInputPreOpportunityHandler); 
                    SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, false);
                } 
                else 
                {
                    AddSynchronizedInputPreOpportunityHandlerCore(route, args); 
                }
            }
        },
 
        // Helper to add pre-opportunity handler for templated parent of this element in case parent is listening
        // for synchronized input. 
//        internal virtual void 
        AddSynchronizedInputPreOpportunityHandlerCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        {
 
        },

        // If this element is currently listening to synchronized input, add a handler to post process the synchronized input otherwise
        // add a synchronized input pre-opportunity handler from parent if parent is listening. 
//        internal void 
        AddSynchronizedInputPostOpportunityHandler:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args)
        { 
            if (InputManager.IsSynchronizedInput) 
            {
                if (SynchronizedInputHelper.IsListening(this, args)) 
                {
                    var eventHandler = new RoutedEventHandler(this.SynchronizedInputPostOpportunityHandler);
                    SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, true);
                } 
                else
                { 
                    // Add a preview handler from the parent. 
                    SynchronizedInputHelper.AddParentPreOpportunityHandler(this, route, args);
                } 
            }
        },

        // This event handler to be called before all the class & instance handlers for this element. 
//        internal void 
        SynchronizedInputPreOpportunityHandler:function(/*object*/ sender, /*RoutedEventArgs*/ args)
        { 
            SynchronizedInputHelper.PreOpportunityHandler(sender, args); 
        },
 
        // This event handler to be called after class & instance handlers for this element.
//        internal void 
        SynchronizedInputPostOpportunityHandler:function(/*object*/ sender, /*RoutedEventArgs*/ args)
        {
            if (args.Handled && (InputManager.SynchronizedInputState == SynchronizedInputStates.HadOpportunity)) 
            {
                SynchronizedInputHelper.PostOpportunityHandler(sender, args); 
            } 
        },
 
        // Called by automation peer, when called this element will be the listening element for synchronized input.
//        internal bool 
        StartListeningSynchronizedInput:function(/*SynchronizedInputType*/ inputType)
        {
            if(InputManager.IsSynchronizedInput) 
            {
                return false; 
            } 
            else
            { 
                InputManager.StartListeningSynchronizedInput(this, inputType);
                return true;
            }
        }, 

        // When called, input processing will return to normal mode. 
//        internal void 
        CancelSynchronizedInput:function() 
        {
            InputManager.CancelSynchronizedInput(); 
        },

        ///<summary> 
        ///     Initiate the processing for [Un]Loaded event broadcast starting at this node
        /// </summary> 
//        internal virtual void 
        OnPresentationSourceChanged:function(/*bool*/ attached) 
        {
            // Reset the FocusedElementProperty in order to get LostFocus event 
            if (!attached && FocusManager.GetFocusedElement(this)!=null)
                FocusManager.SetFocusedElement(this, null);
        },
 
 
        /// <summary> 
        ///     Translates a point relative to this element to coordinates that
        ///     are relative to the specified element. 
        /// </summary>
        /// <remarks>
        ///     Passing null indicates that coordinates should be relative to
        ///     the root element in the tree that this element belongs to. 
        /// </remarks>
//        public Point 
        TranslatePoint:function(/*Point*/ point, /*UIElement*/ relativeTo) 
        { 
            return InputElement.TranslatePoint(point, this, relativeTo);
        }, 

        /// <summary>
        ///     Returns the input element within this element that is
        ///     at the specified coordinates relative to this element. 
        /// </summary>
//        public IInputElement 
        InputHitTest:function(/*Point*/ point) 
        { 
            var enabledHit;
            var rawHit; 
            var enabledHitOut={
               "enabledHit" : enabledHit 
            };
            
            var rawHitOut={
               "rawHit" : rawHit 
            };
            
            InputHitTest(point, /*out enabledHit*/enabledHitOut, /*out rawHit*/rawHitOut);
            enabledHit = enabledHitOut.enabledHit;
            rawHit = rawHitOut.rawHit;
            return enabledHit;
        }, 

        /// <summary> 
        ///     Returns the input element within this element that is 
        ///     at the specified coordinates relative to this element.
        /// </summary> 
        /// <param name="pt">
        ///     This is the coordinate, relative to this element, at which
        ///     to look for elements within this one.
        /// </param> 
        /// <param name="enabledHit">
        ///     This element is the deepest enabled input element that is at the 
        ///     specified coordinates. 
        /// </param>
        /// <param name="rawHit"> 
        ///     This element is the deepest input element (not necessarily enabled)
        ///     that is at the specified coordinates.
        /// </param>
//        internal void 
        InputHitTest:function(/*Point*/ pt, /*out IInputElement enabledHit*/enabledHitOut, /*out IInputElement rawHit*/rawHitOut) 
        {
            var rawHitResult; 
            var rawHitResultOut = {
            	"rawHitResult" : rawHitResult	
            };
            InputHitTest(pt, /*out enabledHit*/enabledHitOut, /*out rawHit*/rawHitOut, /*out rawHitResult*/rawHitResultOut); 

        },
 
        /// <summary>
        ///     Returns the input element within this element that is
        ///     at the specified coordinates relative to this element.
        /// </summary> 
        /// <param name="pt">
        ///     This is the coordinate, relative to this element, at which 
        ///     to look for elements within this one. 
        /// </param>
        /// <param name="enabledHit"> 
        ///     This element is the deepest enabled input element that is at the
        ///     specified coordinates.
        /// </param>
        /// <param name="rawHit"> 
        ///     This element is the deepest input element (not necessarily enabled)
        ///     that is at the specified coordinates. 
        /// </param> 
        /// <param name="rawHitResult">
        ///     Visual hit test result for the rawHit element 
        /// </param>
//        internal void 
        InputHitTest:function(/*Point*/ pt, /*out IInputElement enabledHit*/enabledHitOut, /*out IInputElement rawHit*/rawHitOut, 
        		/*out HitTestResult rawHitResult*/rawHitResultOut)
        {
            var hitTestParameters = new PointHitTestParameters(pt); 

            // We store the result of the hit testing here.  Note that the 
            // HitTestResultCallback is an instance method on this class 
            // so that it can store the element we hit.
            var result = new InputHitTestResult(); 
            VisualTreeHelper.HitTest(this,
                                     new HitTestFilterCallback(InputHitTestFilterCallback),
                                     new HitTestResultCallback(result.InputHitTestResultCallback),
                                     hitTestParameters); 

            var candidate = result.Result; 
            rawHit = candidate instanceof IInputElement ? candidate : null; 
            rawHitResult = result.HitTestResult;
            enabledHit = null; 
            while (candidate != null)
            {
                var contentHost = candidate instanceof IContentHost ? candidate : null;
                if (contentHost != null) 
                {
                    // Do not call IContentHost.InputHitTest if the containing UIElement 
                    // is not enabled. 
                    var containingElement = InputElement.GetContainingUIElement(candidate);
 
                    if (containingElement.GetValue(IsEnabledProperty))
                    {
                        pt = InputElement.TranslatePoint(pt, this, candidate);
                        enabledHit = rawHit = contentHost.InputHitTest(pt); 
                        rawHitResult = null;
                        if (enabledHit != null) 
                        { 
                            break;
                        } 
                    }
                }

                var element = candidate instanceof UIElement ? candidate : null; 
                if (element != null)
                { 
                    if (rawHit == null) 
                    {
                        // Earlier we hit a non-IInputElement. This is the first one 
                        // we've found, so use that as rawHit.
                        rawHit = element;
                        rawHitResult = null;
                    } 
                    if (element.IsEnabled)
                    { 
                        enabledHit = element; 
                        break;
                    } 
                }

//                UIElement3D element3D = candidate as UIElement3D;
//                if (element3D != null) 
//                {
//                    if (rawHit == null) 
//                    { 
//                        // Earlier we hit a non-IInputElement. This is the first one
//                        // we've found, so use that as rawHit. 
//                        rawHit = element3D;
//                        rawHitResult = null;
//                    }
//                    if (element3D.IsEnabled) 
//                    {
//                        enabledHit = element3D; 
//                        break; 
//                    }
//                } 

                if (candidate == this)
                {
                    // We are at the element where the hit-test was initiated. 
                    // If we haven't found the hit element by now, we missed
                    // everything. 
                    break; 
                }
 

                candidate = VisualTreeHelper.GetParentInternal(candidate);
            }
        }, 

//        private HitTestFilterBehavior 
        InputHitTestFilterCallback:function(/*DependencyObject*/ currentNode) 
        { 
            var behavior = HitTestFilterBehavior.Continue;
 
            if(UIElementHelper.IsUIElementOrUIElement3D(currentNode))
            {
                if(!UIElementHelper.IsVisible(currentNode))
                { 
                    // The element we are currently processing is not visible,
                    // so we do not allow hit testing to continue down this 
                    // subtree. 
                    behavior = HitTestFilterBehavior.ContinueSkipSelfAndChildren;
                } 
                if(!UIElementHelper.IsHitTestVisible(currentNode))
                {
                    // The element we are currently processing is not visible for hit testing,
                    // so we do not allow hit testing to continue down this 
                    // subtree.
                    behavior = HitTestFilterBehavior.ContinueSkipSelfAndChildren; 
                } 
            }
            else 
            {
                // This is just a raw Visual, so it cannot receive input.
                // We allow the hit testing to continue through this visual.
                // 
                // When we report the final input, we will return the containing
                // UIElement. 
                behavior = HitTestFilterBehavior.Continue; 
            }
 
            return behavior;
        },
        

//        private bool 
        IsMouseDirectlyOver_ComputeValue:function()
        {
            return (Mouse.DirectlyOver == this); 
        },
 
        /// <summary>
        ///     Asynchronously re-evaluate the reverse-inherited properties. 
        /// </summary>
//        internal void 
        SynchronizeReverseInheritPropertyFlags:function(/*DependencyObject*/ oldParent, /*bool*/ isCoreParent)
        { 
            if(this.IsKeyboardFocusWithin)
            { 
                Keyboard.PrimaryDevice.ReevaluateFocusAsync(this, oldParent, isCoreParent); 
            }
 
            // Reevelauate the stylus properties first to guarentee that our property change
            // notifications fire before mouse properties.
            if(this.IsStylusOver)
            { 
                StylusLogic.CurrentStylusLogicReevaluateStylusOver(this, oldParent, isCoreParent);
            } 
 
            if(this.IsStylusCaptureWithin)
            { 
                StylusLogic.CurrentStylusLogicReevaluateCapture(this, oldParent, isCoreParent);
            }

            if(this.IsMouseOver) 
            {
                Mouse.PrimaryDevice.ReevaluateMouseOver(this, oldParent, isCoreParent); 
            } 

            if(this.IsMouseCaptureWithin) 
            {
                Mouse.PrimaryDevice.ReevaluateCapture(this, oldParent, isCoreParent);
            }
 
            if (this.AreAnyTouchesOver)
            { 
                TouchDevice.ReevaluateDirectlyOver(this, oldParent, isCoreParent); 
            }
 
            if (this.AreAnyTouchesCapturedWithin)
            {
                TouchDevice.ReevaluateCapturedWithin(this, oldParent, isCoreParent);
            } 
        },
 
        /// <summary> 
        ///     Controls like popup want to control updating parent properties. This method
        ///     provides an opportunity for those controls to participate and block it. 
        /// </summary>
//        internal virtual bool 
        BlockReverseInheritance:function()
        {
            return false; 
        },
 
        /// <summary> 
        ///     Captures the mouse to this element.
        /// </summary> 
//        public bool 
        CaptureMouse:function()
        {
            return Mouse.Capture(this);
        }, 

        /// <summary> 
        ///     Releases the mouse capture. 
        /// </summary>
//        public void 
        ReleaseMouseCapture:function() 
        {
            if (Mouse.Captured == this)
            {
                Mouse.Capture(null); 
            }
        }, 

//        private bool 
        IsStylusDirectlyOver_ComputeValue:function() 
        { 
            return (Stylus.DirectlyOver == this);
        }, 
 
        /// <summary>
        ///     Captures the stylus to this element.
        /// </summary>
//        public bool 
        CaptureStylus:function() 
        {
            return Stylus.Capture(this); 
        }, 

        /// <summary> 
        ///     Releases the stylus capture.
        /// </summary>
//        public void 
        ReleaseStylusCapture:function()
        { 
            Stylus.Capture(null);
        }, 
         
//        private bool 
        IsKeyboardFocused_ComputeValue:function() 
        {
            return (Keyboard.FocusedElement == this); 
        },

        /// <summary>
        ///     Set a logical focus on the element. If the current keyboard focus is within the same scope move the keyboard on this element. 
        /// </summary>
//        public bool 
        Focus:function() 
        { 
            if (Keyboard.Focus(this) == this)
            { 
                // Successfully setting the keyboard focus updated the logical focus as well
                return true;
            }
 
            if (this.Focusable && this.IsEnabled)
            { 
                // If we cannot set keyboard focus then set the logical focus only 
                // Find element's FocusScope and set its FocusedElement if not already set
                // If FocusedElement is already set we don't want to steal focus for that scope 
                var focusScope = FocusManager.GetFocusScope(this);
                if (FocusManager.GetFocusedElement(focusScope) == null)
                {
                    FocusManager.SetFocusedElement(focusScope, this); 
                }
            } 
 
            // Return false because current KeyboardFocus is not set on the element - only the logical focus is set
            return false; 
        },

        /// <summary>
        ///     Request to move the focus from this element to another element 
        /// </summary>
        /// <param name="request">Determine how to move the focus</param> 
        /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns> 
//        public virtual bool 
        MoveFocus:function(/*TraversalRequest*/ request)
        { 
            return false;
        },

        /// <summary> 
        ///     Request to predict the element that should receive focus relative to this element for a
        /// given direction, without actually moving focus to it. 
        /// </summary> 
        /// <param name="direction">The direction for which focus should be predicted</param>
        /// <returns> 
        ///     Returns the next element that focus should move to for a given FocusNavigationDirection.
        /// Returns null if focus cannot be moved relative to this element.
        /// </returns>
//        public virtual DependencyObject 
        PredictFocus:function(/*FocusNavigationDirection*/ direction) 
        {
            return null; 
        }, 

        /// <summary> 
        ///     The access key for this element was invoked. Base implementation sets focus to the element.
        /// </summary>
        /// <param name="e">The arguments to the access key event</param>
//        protected virtual void 
        OnAccessKey:function(/*AccessKeyEventArgs*/ e) 
        {
            this.Focus(); 
        }, 
    

//        private void 
        pushOpacity:function()
        { 
            if(this.Visibility == Visibility.Visible)
            { 
                base.VisualOpacity = Opacity; 
            }
        }, 

//        private void 
        pushOpacityMask:function()
        { 
            base.VisualOpacityMask = OpacityMask;
        },
        
//        private void 
        pushBitmapEffect:function()
        { 
            base.VisualBitmapEffect = BitmapEffect; 
        },
        
//        private void 
        pushEffect:function() 
        {
            base.VisualEffect = Effect;
        },
        
//        private void 
        pushBitmapEffectInput:function(/*BitmapEffectInput*/ newValue) 
        {
            base.VisualBitmapEffectInput = newValue; 
        }, 
      
//        private void 
        pushEdgeMode:function()
        { 
            base.VisualEdgeMode = RenderOptions.GetEdgeMode(this);
        },
 
//        private void 
        pushBitmapScalingMode:function()
        {
            base.VisualBitmapScalingMode = RenderOptions.GetBitmapScalingMode(this);
        }, 

//        private void 
        pushClearTypeHint:function()
        { 
            base.VisualClearTypeHint = RenderOptions.GetClearTypeHint(this);
        }, 
 
//        private void 
        pushTextHintingMode:function()
        { 
            base.VisualTextHintingMode = TextOptionsInternal.GetTextHintingMode(this); 
        },
        
//        private void 
        pushCacheMode:function() 
        {
            base.VisualCacheMode = CacheMode;
        },
 
        /// <summary>
        /// pushVisualEffects - helper to propagate cacheMode, Opacity, OpacityMask, BitmapEffect, BitmapScalingMode and EdgeMode 
        /// </summary> 
//        private void 
        pushVisualEffects:function()
        { 
            pushCacheMode();
            pushOpacity();
            pushOpacityMask();
            pushBitmapEffect(); 
            pushEdgeMode();
            pushBitmapScalingMode(); 
            pushClearTypeHint(); 
            pushTextHintingMode();
        }, 

//        private void 
        switchVisibilityIfNeeded:function(/*Visibility*/ visibility) 
        {
            switch(visibility) 
            { 
                case Visibility.Visible:
                    this.ensureVisible(); 
                    break;

                case Visibility.Hidden:
                	this.ensureInvisible(false); 
                    break;
 
                case Visibility.Collapsed: 
                	this.ensureInvisible(true);
                    break; 
            }
        },

//        private void 
        ensureVisible:function() 
        {
            if(this.ReadFlag(CoreFlags.IsOpacitySuppressed)) 
            { 
                //restore Opacity
                Visual.prototype.VisualOpacity = this.Opacity; 

                if(this.ReadFlag(CoreFlags.IsCollapsed))
                {
                	this.WriteFlag(CoreFlags.IsCollapsed, false); 

                    //invalidate parent if needed 
                	this.signalDesiredSizeChange(); 

                    //we are suppressing rendering (see IsRenderable) of collapsed children (to avoid 
                    //confusion when they see RenderSize=(0,0) reported for them)
                    //so now we should invalidate to re-render if some rendering props
                    //changed while UIElement was Collapsed (Arrange will cause re-rendering)
                    this.InvalidateVisual(); 
                }
 
                this.WriteFlag(CoreFlags.IsOpacitySuppressed, false); 
            }
        }, 

//        private void 
        ensureInvisible:function(/*bool*/ collapsed)
        {
            if(!this.ReadFlag(CoreFlags.IsOpacitySuppressed)) 
            {
//                base.VisualOpacity = 0;   //cym comment
                this.WriteFlag(CoreFlags.IsOpacitySuppressed, true); 
            }
 
            if(!this.ReadFlag(CoreFlags.IsCollapsed) && collapsed) //Hidden or Visible->Collapsed
            {
            	this.WriteFlag(CoreFlags.IsCollapsed, true);
 
                //invalidate parent
            	this.signalDesiredSizeChange(); 
            } 
            else if(this.ReadFlag(CoreFlags.IsCollapsed) && !collapsed) //Collapsed -> Hidden
            { 
            	this.WriteFlag(CoreFlags.IsCollapsed, false);

                //invalidate parent
            	this.signalDesiredSizeChange(); 
            }
        }, 
 
//        private void 
        signalDesiredSizeChange:function()
        { 
            var p;
            var ich;
            var pOut = {
                "p":p
            };
            
            var ichOut = {
                "ich" : ich
            };
            this.GetUIParentOrICH(/*out p*/pOut, /*out ich*/ichOut); //only one will be returned 
            p = pOut.p;
            ich = ichOut.ich;
            if(p != null) 
                p.OnChildDesiredSizeChanged(this); 
            else if(ich != null)
                ich.OnChildDesiredSizeChanged(this); 
        },

//        private void 
        ensureClip:function(/*Size*/ layoutSlotSize)
        { 
            var clipGeometry = this.GetLayoutClip(layoutSlotSize);
 
            if(this.Clip != null) 
            {
                if(clipGeometry == null) 
                    clipGeometry = Clip;
                else
                {
                    var cg = new CombinedGeometry( 
                        GeometryCombineMode.Intersect,
                        clipGeometry, 
                        Clip); 

                    clipGeometry = cg; 
                }
            }

            ChangeVisualClip(clipGeometry, true /* dontSetWhenClose */); 
        },
 
        /// <summary> 
        /// HitTestCore implements precise hit testing against render contents
        /// </summary> 
//        protected override HitTestResult 
        HitTestCore:function(/*PointHitTestParameters*/ hitTestParameters)
        {
            if (this._drawingContent != null)
            { 
                if (this._drawingContent.HitTestPoint(hitTestParameters.HitPoint))
                { 
                    return new PointHitTestResult(this, hitTestParameters.HitPoint); 
                }
            } 

            return null;
        },
 
        /// <summary>
        /// HitTestCore implements precise hit testing against render contents 
        /// </summary> 
//        protected override GeometryHitTestResult 
        HitTestCore:function(/*GeometryHitTestParameters*/ hitTestParameters)
        { 
            if ((this._drawingContent != null) && GetHitTestBounds().IntersectsWith(hitTestParameters.Bounds))
            {
                var intersectionDetail;
 
                intersectionDetail = _drawingContent.HitTestGeometry(hitTestParameters.InternalHitGeometry);
//                Debug.Assert(intersectionDetail != IntersectionDetail.NotCalculated); 
 
                if (intersectionDetail != IntersectionDetail.Empty)
                { 
                    return new GeometryHitTestResult(this, intersectionDetail);
                }
            }
 
            return null;
        }, 
 
        /// <summary>
        /// Opens the DrawingVisual for rendering. The returned DrawingContext can be used to 
        /// render into the DrawingVisual.
        /// </summary>
//        internal DrawingContext 
        RenderOpen:function() 
        {
//            return new VisualDrawingContext(this); 
        },

        /// <summary> 
        /// Called from the DrawingContext when the DrawingContext is closed.
        /// </summary>
//        internal override void 
        RenderClose:function(/*IDrawingContent*/ newContent)
        { 
//            IDrawingContent oldContent = _drawingContent;
// 
//            //this element does not render - return 
//            if(oldContent == null && newContent == null)
//                return; 
//
//            //
//            // First cleanup the old content and the state associate with this node
//            // related to it's content. 
//            //
// 
//            _drawingContent = null; 
//
//            if (oldContent != null) 
//            {
//                //
//                // Remove the notification handlers.
//                // 
//                oldContent.PropagateChangedHandler(ContentsChangedHandler, false /* remove */); 
//
//                // 
//                // Disconnect the old content from this visual.
//                //
//                DisconnectAttachedResource( 
//                    VisualProxyFlags.IsContentConnected,
//                    ((DUCE.IResource)oldContent)); 
//            } 
//
// 
//            //
//            // Prepare the new content.
//            //
//            if (newContent != null)
//            { 
//                // Propagate notification handlers. 
//                newContent.PropagateChangedHandler(ContentsChangedHandler, true /* adding */);
//            } 
//
//            _drawingContent = newContent;
//
// 
//            //
//            // Mark the visual dirty on all channels and propagate 
//            // the flags up the parent chain. 
//            //
//            SetFlagsOnAllChannels(true, VisualProxyFlags.IsContentDirty);
//
//            PropagateFlags(
//                this, 
//                VisualFlags.IsSubtreeDirtyForPrecompute,
//                VisualProxyFlags.IsSubtreeDirtyForRender); 
        }, 

        /// <summary> 
        /// Overriding this function to release DUCE resources during Dispose and during removal of a subtree.
        /// </summary>
        /// <SecurityNote>
        /// Critical - calls other critical code (base) 
        /// </SecurityNote>
//        internal override void 
        FreeContent:function(/*DUCE.Channel*/ channel) 
        {
//            Debug.Assert(_proxy.IsOnChannel(channel)); 
//
//            if (_drawingContent != null)
//            {
//                if (CheckFlagsAnd(channel, VisualProxyFlags.IsContentConnected)) 
//                {
//                    DUCE.CompositionNode.SetContent( 
//                        _proxy.GetHandle(channel), 
//                        DUCE.ResourceHandle.Null,
//                        channel); 
//
//                    ((DUCE.IResource)_drawingContent).ReleaseOnChannel(channel);
//
//                    SetFlags(channel, false, VisualProxyFlags.IsContentConnected); 
//                }
//            } 
// 
//            // Call the base method too
//            base.FreeContent(channel); 
        },

        /// <summary>
        /// Returns the bounding box of the content. 
        /// </summary>
//        internal override Rect 
        GetContentBounds:function() 
        { 
//            if (_drawingContent != null)
//            { 
//                Rect resultRect = Rect.Empty;
//                MediaContext mediaContext = MediaContext.From(Dispatcher);
//                BoundsDrawingContextWalker ctx = mediaContext.AcquireBoundsDrawingContextWalker();
// 
//                resultRect = _drawingContent.GetContentBounds(ctx);
//                mediaContext.ReleaseBoundsDrawingContextWalker(ctx); 
// 
//                return resultRect;
//            } 
//            else
//            {
//                return Rect.Empty;
//            } 
        },
 
        /// <summary> 
        /// WalkContent - method which walks the content (if present) and calls out to the
        /// supplied DrawingContextWalker. 
        /// </summary>
        /// <param name="walker">
        ///   DrawingContextWalker - the target of the calls which occur during
        ///   the content walk. 
        /// </param>
//        internal void 
        WalkContent:function(/*DrawingContextWalker*/ walker) 
        { 
//            VerifyAPIReadOnly();
// 
//            if (_drawingContent != null)
//            {
//                _drawingContent.WalkContent(walker);
//            } 
        },
 
        /// <summary> 
        /// RenderContent is implemented by derived classes to hook up their
        /// content. The implementer of this function can assert that the visual 
        /// resource is valid on a channel when the function is executed.
        /// </summary>
//        internal override void 
        RenderContent:function(/*RenderContext*/ ctx, /*bool*/ isOnChannel)
        { 
//            DUCE.Channel channel = ctx.Channel;
// 
//            Debug.Assert(!CheckFlagsAnd(channel, VisualProxyFlags.IsContentConnected)); 
//            Debug.Assert(_proxy.IsOnChannel(channel));
//            //
//            // Create the content on the channel.
//            // 
//
//            if (_drawingContent != null) 
//            { 
//                DUCE.IResource drawingContent = (DUCE.IResource)_drawingContent;
// 
//                drawingContent.AddRefOnChannel(channel);
//
//                // Hookup it up to the composition node.
// 
//                DUCE.CompositionNode.SetContent(
//                    _proxy.GetHandle(channel), 
//                    drawingContent.GetHandle(channel), 
//                    channel);
// 
//                SetFlags(
//                    channel,
//                    true,
//                    VisualProxyFlags.IsContentConnected); 
//            }
//            else if (isOnChannel) /* _drawingContent == null */ 
//            { 
//                DUCE.CompositionNode.SetContent(
//                    _proxy.GetHandle(channel), 
//                    DUCE.ResourceHandle.Null,
//                    channel);
//            }
        },

        /// <summary> 
        /// GetDrawing - Returns the drawing content of this Visual. 
        /// </summary>
        /// <remarks> 
        /// Changes to this DrawingGroup will not be propagated to the Visual's content.
        /// This method is called by both the Drawing property, and VisualTreeHelper.GetDrawing()
        /// </remarks>
//        internal override DrawingGroup 
        GetDrawing:function() 
        {
            // 
            VerifyAPIReadOnly(); 

            var drawingGroupContent = null;

            // Convert our content to a DrawingGroup, if content exists 
            if (_drawingContent != null)
            { 
                drawingGroupContent = DrawingServices.DrawingGroupFromRenderData( _drawingContent); 
            }
 
            return drawingGroupContent;
        },

 
        /// <summary>
        /// This method supplies an additional (to the <seealso cref="Clip"/> property) clip geometry 
        /// that is used to intersect Clip in case if <seealso cref="ClipToBounds"/> property is set to "true". 
        /// Typcally, this is a size of layout space given to the UIElement.
        /// </summary> 
        /// <returns>Geometry to use as additional clip if ClipToBounds=true</returns>
//        protected virtual Geometry 
        GetLayoutClip:function(/*Size*/ layoutSlotSize)
        {
            if(this.ClipToBounds) 
            {
                var rect = new RectangleGeometry(new Rect(RenderSize)); 
                rect.Freeze(); 
                return rect;
            } 
            else
                return null;
        },
 
        // Internal accessor for AccessKeyManager class
//        internal void 
        InvokeAccessKey:function(/*AccessKeyEventArgs*/ e)
        {
        	this.OnAccessKey(e); 
        },

        /// <summary> 
        ///     This method is invoked when the IsFocused property changes to true 
        /// </summary>
        /// <param name="e">RoutedEventArgs</param> 
//        protected virtual void 
        OnGotFocus:function(/*RoutedEventArgs*/ e)
        {
        	this.RaiseEvent(e);
        }, 

        /// <summary> 
        ///     This method is invoked when the IsFocused property changes to false 
        /// </summary>
        /// <param name="e">RoutedEventArgs</param> 
//        protected virtual void 
        OnLostFocus:function(/*RoutedEventArgs*/ e)
        {
            this.RaiseEvent(e);
        }, 
        
        /// <SecurityNote>
        /// Critical - Calls a critical method (PresentationSource.CriticalFromVisual) 
        /// TreatAsSafe - No exposure 
        /// </SecurityNote>
//        internal void 
        UpdateIsVisibleCache:function() // Called from PresentationSource
        {
            // IsVisible is a read-only property.  It derives its "base" value
            // from the Visibility property. 
            var isVisible = (this.Visibility == Visibility.Visible);
 
            // We must be false if our parent is false, but we can be 
            // either true or false if our parent is true.
            // 
            // Another way of saying this is that we can only be true
            // if our parent is true, but we can always be false.
            if(isVisible)
            { 
                var constraintAllowsVisible = false;
 
                // Our parent can constrain us.  We can be plugged into either 
                // a "visual" or "content" tree.  If we are plugged into a
                // "content" tree, the visual tree is just considered a 
                // visual representation, and is normally composed of raw
                // visuals, not UIElements, so we prefer the content tree.
                //
                // The content tree uses the "logical" links.  But not all 
                // "logical" links lead to a content tree.
                // 
                // However, ContentElements don't understand IsVisible, 
                // so we ignore them.
                // 
                var parent = InputElement.GetContainingUIElement(this._parent);

                if(parent != null)
                { 
                    constraintAllowsVisible = UIElementHelper.IsVisible(parent);
                } 
                else 
                {
//                    // We cannot be visible if we have no visual parent, unless: 
//                    // 1) We are the root, connected to a PresentationHost.
//                    var presentationSource = PresentationSource.CriticalFromVisual(this);
//                    if(presentationSource != null)
//                    { 
                        constraintAllowsVisible = true;
//                    } 
//                    else 
//                    {
//                        // CODE 
//
//                    }

                } 

                if(!constraintAllowsVisible) 
                { 
                    isVisible = false;
                } 
            }

            if(isVisible != this.IsVisible)
            { 
                // Our IsVisible force-inherited property has changed.  Update our
                // cache and raise a change notification. 
 
                this.WriteFlag(CoreFlags.IsVisibleCache, isVisible);
                this.NotifyPropertyChange(/*new DependencyPropertyChangedEventArgs(UIElement.IsVisibleProperty, 
                		UIElement._isVisibleMetadata, !isVisible, isVisible)*/
                		DependencyPropertyChangedEventArgs.BuildPMOO(UIElement.IsVisibleProperty, 
                		UIElement._isVisibleMetadata, !isVisible, isVisible)); 
            }
        },
 
        /// <summary>
        /// This is used by the parser and journaling to uniquely identify a given element 
        /// in a deterministic fashion, i.e., each time the same XAML/BAML is parsed/read,
        /// the items will be given the same PersistId. 
        /// </summary> 
        /// <param name="value"></param>
        /// To keep PersistId from being serialized the set has been removed from the property and a separate 
        /// set method has been created.
//        internal void 
        SetPersistId:function(/*int*/ value)
        { 
            this._persistId = value;
        }, 
 
        // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
//        private void 
        RaiseDependencyPropertyChanged:function(/*EventPrivateKey*/ key, /*DependencyPropertyChangedEventArgs*/ args) 
        {
            var store = this.EventHandlersStore;
            if (store != null)
            { 
                var handler = store.Get(key);
                if (handler != null) 
                { 
                    handler.Invoke(this, args);
                } 
            }
        },

//        private void 
        CoerceStylusProperties:function() 
        { 
            // When manipulation is enabled, disable Stylus.IsFlicksEnabled property.
            // This property, when active, produces visible effects that don't apply 
            // and are distracting during a manipulation.
            //
            // Not using coercion to avoid adding the cost of doing the callback
            // on all elements, even when they don't need it. 
            if (IsDefaultValue(this, Stylus.IsFlicksEnabledProperty))
            { 
                SetCurrentValueInternal(Stylus.IsFlicksEnabledProperty, false); 
            }
        }, 
        
        /// <summary>
        ///     Indicates that a manipulation has started.
        /// </summary> 
//        protected virtual void 
        OnManipulationStarting:function(/*ManipulationStartingEventArgs*/ e) { },
 
        /// <summary> 
        ///     Provides data regarding changes to a currently occurring manipulation.
        /// </summary> 
//        protected virtual void 
        OnManipulationDelta:function(/*ManipulationDeltaEventArgs*/ e) { },

        /// <summary> 
        ///     Indicates that a manipulation has started.
        /// </summary>
//        protected virtual void 
        OnManipulationStarted:function(/*ManipulationStartedEventArgs*/ e) { },
        /// <summary>
        ///     Allows a handler to customize the parameters of an inertia processor. 
        /// </summary> 
//        protected virtual void 
        OnManipulationInertiaStarting:function(/*ManipulationInertiaStartingEventArgs*/ e) { },

        /// <summary>
        ///     Allows a handler to provide feedback when a manipulation has encountered a boundary. 
        /// </summary>
//        protected virtual void 
        OnManipulationBoundaryFeedback:function(/*ManipulationBoundaryFeedbackEventArgs*/ e) { }, 
 
        /// <summary>
        ///     Indicates that a manipulation has completed.
        /// </summary>
//        protected virtual void 
        OnManipulationCompleted:function(/*ManipulationCompletedEventArgs*/ e) { }, 

        /// <summary> 
        ///     Captures the specified device to this element. 
        /// </summary>
        /// <param name="touchDevice">The touch device to capture.</param> 
        /// <returns>True if capture was taken.</returns>
//        public bool 
        CaptureTouch:function(/*TouchDevice*/ touchDevice)
        {
            if (touchDevice == null) 
            {
                throw new ArgumentNullException("touchDevice"); 
            } 

            return touchDevice.Capture(this); 
        },

        /// <summary>
        ///     Releases capture from the specified touch device. 
        /// </summary>
        /// <param name="touchDevice">The device that is captured to this element.</param> 
        /// <returns>true if capture was released, false otherwise.</returns> 
//        public bool 
        ReleaseTouchCapture:function(/*TouchDevice*/ touchDevice)
        { 
            if (touchDevice == null)
            {
                throw new ArgumentNullException("touchDevice");
            } 

            if (touchDevice.Captured == this) 
            { 
                touchDevice.Capture(null);
                return true; 
            }
            else
            {
                return false; 
            }
        }, 
 
        /// <summary>
        ///     Releases capture on any touch devices captured to this element. 
        /// </summary>
//        public void 
        ReleaseAllTouchCaptures:function()
        {
            TouchDevice.ReleaseAllCaptures(this); 
        },
 
         
 
        ///// LAYOUT DATA /////

//        private Rect _finalRect;
//        private Size _desiredSize; 
//        private Size _previousAvailableSize;
//        private IDrawingContent _drawingContent; 
// 
//        //right after creation all elements are Clean so go Invalidate at least one
// 
//        internal ContextLayoutManager.LayoutQueue.Request MeasureRequest;
//        internal ContextLayoutManager.LayoutQueue.Request ArrangeRequest;
//
//        // See PersistId property 
//        private int _persistId = 0;
// 
//        // Device transform 
//        private static double _dpiScaleX = 1.0;
//        private static double _dpiScaleY = 1.0; 
//        private static bool _setDpi = true;
//
// 
//        internal SizeChangedInfo sizeChangedInfo; 
//
//        private Size _size; 
        
        /// <summary>
        ///     FocusableChanged event 
        /// </summary> 
//        public event DependencyPropertyChangedEventHandler 
//        FocusableChanged:
//        { 
            AddFocusableChanged:function(value) {this.EventHandlersStoreAdd(UIElement.FocusableChangedKey, value);},
            RemoveFocusableChanged:function(value) {this.EventHandlersStoreRemove(UIElement.FocusableChangedKey, value);},
//        }
        /// <summary>
        ///     An event announcing that IsFocused changed to true. 
        /// </summary>
//        public event RoutedEventHandler GotFocus 
//        { 
            AddGotFocus:function(value) { this.AddHandler(UIElement.GotFocusEvent, value); },
            RemoveGotFocus:function(value) { this.RemoveHandler(UIElement.GotFocusEvent, value); }, 
//        }
        
        /// <summary>
        ///     An event announcing that IsFocused changed to false. 
        /// </summary>
//        public event RoutedEventHandler LostFocus
//        {
            AddLostFocus:function(value) { this.AddHandler(UIElement.LostFocusEvent, value); }, 
            RemoveLostFocus:function(value) { this.RemoveHandler(UIElement.LostFocusEvent, value); },
//        } 

        /// <summary> 
        ///     IsEnabledChanged event 
        /// </summary>
//        public event DependencyPropertyChangedEventHandler IsEnabledChanged 
//        {
            AddIsEnabledChanged:function(value) {this.EventHandlersStoreAdd(UIElement.IsEnabledChangedKey, value);},
            RemoveIsEnabledChanged:function(value) {this.EventHandlersStoreRemove(UIElement.IsEnabledChangedKey, value);},
//        } 

        ///     IsHitTestVisibleChanged event 
        /// </summary>
//        public event DependencyPropertyChangedEventHandler IsHitTestVisibleChanged 
//        {
//            AddIsHitTestVisibleChanged:function(value) {EventHandlersStoreAdd(IsHitTestVisibleChangedKey, value);}
//            RemoveIsHitTestVisibleChanged:function(value) {EventHandlersStoreRemove(IsHitTestVisibleChangedKey, value);}
//        } 

        /// <summary> 
        ///     IsVisibleChanged event
        /// </summary> 
//        public event DependencyPropertyChangedEventHandler IsVisibleChanged 
//        {
            AddIsVisibleChanged:function(value) {this.EventHandlersStoreAdd(UIElement.IsVisibleChangedKey, value);}, 
            RemoveIsVisibleChanged:function(value) {this.EventHandlersStoreRemove(UIElement.IsVisibleChangedKey, value);},
//        }
        
//      /// <summary>
//      ///     Indicates that a manipulation is about to start and allows for configuring its behavior. 
//      /// </summary> 
//      public event EventHandler<ManipulationStartingEventArgs> ManipulationStarting 
//      {
//          AddManipulationStarting:function(value) { AddHandler(ManipulationStartingEvent, value, false); },
//          RemoveManipulationStarting:function(value) { RemoveHandler(ManipulationStartingEvent, value); }
//      }     
//      /// <summary>
//      ///     Indicates that a manipulation has started. 
//      /// </summary>
//      public event EventHandler<ManipulationStartedEventArgs> ManipulationStarted 
//      {
//          AddManipulationStarted:function(value) { AddHandler(ManipulationStartedEvent, value, false); }, 
//          RemoveManipulationStarted:function(value) { RemoveHandler(ManipulationStartedEvent, value); }
//      }      
//      /// <summary>
//      ///     Provides data regarding changes to a currently occurring manipulation.
//      /// </summary>
//      public event EventHandler<ManipulationDeltaEventArgs> ManipulationDelta
//      { 
//          AddManipulationDelta:function(value) { AddHandler(ManipulationDeltaEvent, value, false); }, 
//          RemoveManipulationDelta:function(value) { RemoveHandler(ManipulationDeltaEvent, value); }
//      } 
//      /// <summary>
//      ///     Allows a handler to customize the parameters of an inertia processor. 
//      /// </summary>
//      public event EventHandler<ManipulationInertiaStartingEventArgs> ManipulationInertiaStarting
//      { 
//          AddManipulationInertiaStarting:function(value) { AddHandler(ManipulationInertiaStartingEvent, value, false); },
//          RemoveManipulationInertiaStarting:function(value) { RemoveHandler(ManipulationInertiaStartingEvent, value); } 
//      } 
//      /// <summary> 
//      ///     Allows a handler to provide feedback when a manipulation has encountered a boundary. 
//      /// </summary>
//      public event EventHandler<ManipulationBoundaryFeedbackEventArgs> ManipulationBoundaryFeedback
//      {
//          AddManipulationBoundaryFeedback:function(value) { AddHandler(ManipulationBoundaryFeedbackEvent, value, false); },,
//          RemoveManipulationBoundaryFeedback:function(value) { RemoveHandler(ManipulationBoundaryFeedbackEvent, value); },
//      }
//      
//      
//      /// <summary> 
//      ///     Indicates that a manipulation has completed.
//      /// </summary> 
//      public event EventHandler<ManipulationCompletedEventArgs> ManipulationCompleted
//      { 
//          AddManipulationCompleted:function(value) { AddHandler(ManipulationCompletedEvent, value, false); },,
//          RemoveManipulationCompleted:function(value) { RemoveHandler(ManipulationCompletedEvent, value); },
//      }
  	   
      
      /// <summary> 
      /// This event fires every time Layout updates the layout of the trees associated with current Dispatcher.
      /// Layout update can happen as a result of some propety change, window resize or explicit user request. 
      /// </summary> 
//      public event EventHandler LayoutUpdated
//      { 
          AddLayoutUpdated:function(value)
          {
//              var item = this.getLayoutUpdatedHandler(value);
//
//              if(item == null)
//              { 
//                  //set a weak ref in LM 
//                  item = ContextLayoutManager.From(Dispatcher).LayoutEvents.Add(value);
//                  addLayoutUpdatedHandler(value, item); 
//              }
          },
          RemoveLayoutUpdated:function(value)
          { 
//              var item = this.getLayoutUpdatedHandler(value);
//
//              if(item != null) 
//              {
//                  removeLayoutUpdatedHandler(value); 
//                  //Remove a weak ref from LM
//                  ContextLayoutManager.From(Dispatcher).LayoutEvents.Remove(item);
//              }
          }, 
//      }

//      /// <summary> 
//      ///     Event reporting the mouse button was pressed
//      /// </summary>
//      public event MouseButtonEventHandler PreviewMouseDown
//      { 
          AddPreviewMouseDown:function(value) { this.AddHandler(Mouse.PreviewMouseDownEvent, value, false); },
          RemovePreviewMouseDown:function(value) { this.RemoveHandler(Mouse.PreviewMouseDownEvent, value); },
//      }, 
//      
//      /// <summary>
//      ///     Event reporting the mouse button was pressed
//      /// </summary>
//      public event MouseButtonEventHandler MouseDown 
//      {
          AddPreviewMouseUp:function(value) { this.AddHandler(Mouse.MouseDownEvent, value, false); }, 
          RemoveMouseDown:function(value) { this.RemoveHandler(Mouse.MouseDownEvent, value); },
//      },
//      
//      /// <summary>
//      ///     Event reporting the mouse button was released
//      /// </summary> 
//      public event MouseButtonEventHandler PreviewMouseUp
//      { 
          AddPreviewMouseUp:function(value) { this.AddHandler(Mouse.PreviewMouseUpEvent, value, false); }, 
          RemovePreviewMouseUp:function(value) { this.RemoveHandler(Mouse.PreviewMouseUpEvent, value); },
//      }, 
//      
//      /// <summary>
//      ///     Event reporting the mouse button was released 
//      /// </summary>
//      public event MouseButtonEventHandler MouseUp 
//      { 
          AddMouseUp:function(value) { this.AddHandler(Mouse.MouseUpEvent, value, false); },
          RemoveMouseUp:function(value) { this.RemoveHandler(Mouse.MouseUpEvent, value); }, 
//      }
//      /// <summary> 
//      ///     Event reporting the left mouse button was pressed
//      /// </summary> 
//      public event MouseButtonEventHandler PreviewMouseLeftButtonDown 
//      {
          AddPreviewMouseLeftButtonDown:function(value) { this.AddHandler(UIElement.PreviewMouseLeftButtonDownEvent, value, false); }, 
          RemovePreviewMouseLeftButtonDown:function(value) { this.RemoveHandler(UIElement.PreviewMouseLeftButtonDownEvent, value); },
//      }
//      
//      /// <summary> 
//      ///     Event reporting the left mouse button was released 
//      /// </summary>
//      public event MouseButtonEventHandler PreviewMouseLeftButtonUp 
//      {
          AddPreviewMouseLeftButtonUp:function(value) { this.AddHandler(UIElement.PreviewMouseLeftButtonUpEvent, value, false); },
          RemovePreviewMouseLeftButtonUp:function(value) { this.RemoveHandler(UIElement.PreviewMouseLeftButtonUpEvent, value); },
//      } 
//
//      /// <summary> 
//      ///     Event reporting the left mouse button was released
//      /// </summary> 
//      public event MouseButtonEventHandler MouseLeftButtonUp
//      {
          AddMouseLeftButtonUp:function(value) { this.AddHandler(UIElement.MouseLeftButtonUpEvent, value, false); },
          RemoveMouseLeftButtonUp:function(value) { this.RemoveHandler(UIElement.MouseLeftButtonUpEvent, value); }, 
//      }
//      
//      /// <summary>
//      ///     Event reporting the left mouse button was pressed 
//      /// </summary> 
//      public event MouseButtonEventHandler MouseLeftButtonDown
//      { 
          AddMouseLeftButtonDown:function(value) { this.AddHandler(UIElement.MouseLeftButtonDownEvent, value, false); },
          RemoveMouseLeftButtonDown:function(value) { this.RemoveHandler(UIElement.MouseLeftButtonDownEvent, value); },
//      }
//      /// <summary>
//      ///     Event reporting the right mouse button was pressed 
//      /// </summary>
//      public event MouseButtonEventHandler PreviewMouseRightButtonDown
//      {
          AddPreviewMouseRightButtonDown:function(value) { this.AddHandler(UIElement.PreviewMouseRightButtonDownEvent, value, false); }, 
          RemovePreviewMouseRightButtonDown:function(value) { this.RemoveHandler(UIElement.PreviewMouseRightButtonDownEvent, value); },
//      } 
//      
//      /// <summary> 
//      ///     Event reporting the right mouse button was pressed
//      /// </summary>
//      public event MouseButtonEventHandler MouseRightButtonDown
//      { 
          AddMouseRightButtonDown:function(value) { this.AddHandler(UIElement.MouseRightButtonDownEvent, value, false); },
          RemoveMouseRightButtonDown:function(value) { this.RemoveHandler(UIElement.MouseRightButtonDownEvent, value); }, 
//      } 
//      
//      
//      /// <summary>
//      ///     Event reporting the right mouse button was released
//      /// </summary>
//      public event MouseButtonEventHandler PreviewMouseRightButtonUp 
//      {
          AddPreviewMouseRightButtonUp:function(value) { this.AddHandler(UIElement.PreviewMouseRightButtonUpEvent, value, false); }, 
          RemovePreviewMouseRightButtonUp:function(value) { this.RemoveHandler(UIElement.PreviewMouseRightButtonUpEvent, value); }, 
//      }
//
//      /// <summary>
//      ///     Event reporting the right mouse button was released
//      /// </summary> 
//      public event MouseButtonEventHandler MouseRightButtonUp
//      { 
          AddMouseRightButtonUp:function(value) { this.AddHandler(UIElement.MouseRightButtonUpEvent, value, false); }, 
          RemoveMouseRightButtonUp:function(value) { this.RemoveHandler(UIElement.MouseRightButtonUpEvent, value); },
//      } 
//
//      /// <summary>
//      ///     Event reporting a mouse move 
//      /// </summary>
//      public event MouseEventHandler PreviewMouseMove 
//      { 
          AddPreviewMouseMove:function(value) { this.AddHandler(Mouse.PreviewMouseMoveEvent, value, false); },
          RemovePreviewMouseMove:function(value) { this.RemoveHandler(Mouse.PreviewMouseMoveEvent, value); }, 
//      }
//      
//      /// <summary> 
//      ///     Event reporting a mouse move
//      /// </summary> 
//      public event MouseEventHandler MouseMove 
//      {
          AddMouseMove:function(value) { this.AddHandler(Mouse.MouseMoveEvent, value, false); }, 
          RemoveMouseMove:function(value) { this.RemoveHandler(Mouse.MouseMoveEvent, value); },
//      }
//      
//      /// <summary>
//      ///     Event reporting a mouse wheel rotation 
//      /// </summary> 
//      public event MouseWheelEventHandler PreviewMouseWheel
//      { 
          AddPreviewMouseWheel:function(value) { this.AddHandler(Mouse.PreviewMouseWheelEvent, value, false); },
          RemovePreviewMouseWheel:function(value) { this.RemoveHandler(Mouse.PreviewMouseWheelEvent, value); },
//      }
//
//      /// <summary> 
//      ///     Event reporting a mouse wheel rotation 
//      /// </summary>
//      public event MouseWheelEventHandler MouseWheel 
//      {
          AddMouseWheel:function(value) { this.AddHandler(Mouse.MouseWheelEvent, value, false); },
          RemoveMouseWheel:function(value) { this.RemoveHandler(Mouse.MouseWheelEvent, value); },
//      } 
//
//      /// <summary> 
//      ///     Event reporting the mouse entered this element
//      /// </summary> 
//      public event MouseEventHandler MouseEnter
//      {
          AddMouseEnter:function(value) { this.AddHandler(Mouse.MouseEnterEvent, value, false); },
          RemoveMouseEnter:function(value) { this.RemoveHandler(Mouse.MouseEnterEvent, value); }, 
//      }
//      /// <summary>
//      ///     Event reporting the mouse left this element 
//      /// </summary>
//      public event MouseEventHandler MouseLeave
//      {
          AddMouseLeave:function(value) { this.AddHandler(Mouse.MouseLeaveEvent, value, false); }, 
          RemoveMouseLeave:function(value) { this.RemoveHandler(Mouse.MouseLeaveEvent, value); },
//      } 
//      
//      /// <summary> 
//      ///     Event reporting that this element got the mouse capture
//      /// </summary>
//      public event MouseEventHandler GotMouseCapture
//      { 
          AddGotMouseCapture:function(value) { this.AddHandler(Mouse.GotMouseCaptureEvent, value, false); },
          RemoveGotMouseCapture:function(value) { this.RemoveHandler(Mouse.GotMouseCaptureEvent, value); }, 
//      } 
//      
//      /// <summary>
//      ///     Event reporting that this element lost the mouse capture
//      /// </summary>
//      public event MouseEventHandler LostMouseCapture 
//      {
          AddLostMouseCapture:function(value) { this.AddHandler(Mouse.LostMouseCaptureEvent, value, false); }, 
          RemoveLostMouseCapture:function(value) { this.RemoveHandler(Mouse.LostMouseCaptureEvent, value); }, 
//      }
//      /// <summary>
//      ///     Event reporting the cursor to display was requested
//      /// </summary> 
//      public event QueryCursorEventHandler QueryCursor
//      { 
          AddQueryCursor:function(value) { this.AddHandler(Mouse.QueryCursorEvent, value, false); }, 
          RemoveQueryCursor:function(value) { this.RemoveHandler(Mouse.QueryCursorEvent, value); },
//      } 
//
//      /// <summary> 
//      ///     Event reporting a key was pressed
//      /// </summary> 
//      public event KeyEventHandler PreviewKeyDown
//      {
          AddPreviewKeyDown:function(value) { this.AddHandler(Keyboard.PreviewKeyDownEvent, value, false); },
          RemovePreviewKeyDown:function(value) { this.RemoveHandler(Keyboard.PreviewKeyDownEvent, value); }, 
//      }
//      /// <summary>
//      ///     Event reporting a key was pressed 
//      /// </summary>
//      public event KeyEventHandler KeyDown
//      {
          AddKeyDown:function(value) { this.AddHandler(Keyboard.KeyDownEvent, value, false); }, 
          RemoveKeyDown:function(value) { this.RemoveHandler(Keyboard.KeyDownEvent, value); },
//      } 
//      /// <summary> 
//      ///     Event reporting a key was released
//      /// </summary>
//      public event KeyEventHandler PreviewKeyUp
//      { 
          AddPreviewKeyUp:function(value) { this.AddHandler(Keyboard.PreviewKeyUpEvent, value, false); },
          RemovePreviewKeyUp:function(value) { this.RemoveHandler(Keyboard.PreviewKeyUpEvent, value); }, 
//      } 
//      
//      /// <summary>
//      ///     Event reporting a key was released
//      /// </summary>
//      public event KeyEventHandler KeyUp 
//      {
          AddKeyUp:function(value) { this.AddHandler(Keyboard.KeyUpEvent, value, false); }, 
          RemoveKeyUp:function(value) { this.RemoveHandler(Keyboard.KeyUpEvent, value); }, 
//      }     
//
//      /// <summary>
//      ///     Event reporting that the keyboard is focused on this element
//      /// </summary> 
//      public event KeyboardFocusChangedEventHandler PreviewGotKeyboardFocus
//      { 
          AddPreviewGotKeyboardFocus:function(value) { this.AddHandler(Keyboard.PreviewGotKeyboardFocusEvent, value, false); }, 
          RemovePreviewGotKeyboardFocus:function(value) { this.RemoveHandler(Keyboard.PreviewGotKeyboardFocusEvent, value); },
//      } 
//      
//      /// <summary>
//      ///     Event reporting that the keyboard is focused on this element 
//      /// </summary>
//      public event KeyboardFocusChangedEventHandler GotKeyboardFocus 
//      { 
          AddGotKeyboardFocus:function(value) { this.AddHandler(Keyboard.GotKeyboardFocusEvent, value, false); },
          RemoveGotKeyboardFocus:function(value) { this.RemoveHandler(Keyboard.GotKeyboardFocusEvent, value); }, 
//      }  
//
//      /// <summary> 
//      ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed
//      /// </summary> 
//      public event KeyboardFocusChangedEventHandler PreviewLostKeyboardFocus 
//      {
          AddPreviewLostKeyboardFocus:function(value) { this.AddHandler(Keyboard.PreviewLostKeyboardFocusEvent, value, false); }, 
          RemovePreviewLostKeyboardFocus:function(value) { this.RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, value); },
//      }
//
//      /// <summary>
//      ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
//      /// </summary> 
//      public event KeyboardFocusChangedEventHandler LostKeyboardFocus
//      { 
          AddLostKeyboardFocus:function(value) { this.AddHandler(Keyboard.LostKeyboardFocusEvent, value, false); },
          RemoveLostKeyboardFocus:function(value) { this.RemoveHandler(Keyboard.LostKeyboardFocusEvent, value); },
//      }
//      
//
//      /// <summary> 
//      ///     Event reporting text composition 
//      /// </summary>
//      public event TextCompositionEventHandler PreviewTextInput 
//      {
//          AddPreviewTextInput:function(value) { this.AddHandler(TextCompositionManager.PreviewTextInputEvent, value, false); },
//          RemovePreviewTextInput:function(value) { this.RemoveHandler(TextCompositionManager.PreviewTextInputEvent, value); },
//      } 
//
//      /// <summary> 
//      ///     Event reporting text composition
//      /// </summary> 
//      public event TextCompositionEventHandler TextInput
//      {
//          AddTextInput:function(value) { AddHandler(TextCompositionManager.TextInputEvent, value, false); },
//          RemoveTextInput:function(value) { RemoveHandler(TextCompositionManager.TextInputEvent, value); }, 
//      }
//
//      /// <summary>
//      ///     Event reporting the preview query continue drag is going to happen 
//      /// </summary>
//      public event QueryContinueDragEventHandler PreviewQueryContinueDrag
//      {
          AddPreviewQueryContinueDrag:function(value) { this.AddHandler(DragDrop.PreviewQueryContinueDragEvent, value, false); }, 
          RemovePreviewQueryContinueDrag:function(value) { this.RemoveHandler(DragDrop.PreviewQueryContinueDragEvent, value); },
//      } 
//
//      /// <summary> 
//      ///     Event reporting the query continue drag is going to happen
//      /// </summary>
//      public event QueryContinueDragEventHandler QueryContinueDrag
//      { 
          AddQueryContinueDrag:function(value) { this.AddHandler(DragDrop.QueryContinueDragEvent, value, false); },
          RemoveQueryContinueDrag:function(value) { this.RemoveHandler(DragDrop.QueryContinueDragEvent, value); }, 
//      } 
//
//      /// <summary>
//      ///     Event reporting the preview give feedback is going to happen
//      /// </summary>
//      public event GiveFeedbackEventHandler PreviewGiveFeedback 
//      {
          AddPreviewGiveFeedback:function(value) { this.AddHandler(DragDrop.PreviewGiveFeedbackEvent, value, false); }, 
          RemovePreviewGiveFeedback:function(value) { this.RemoveHandler(DragDrop.PreviewGiveFeedbackEvent, value); }, 
//      }
//      
//      /// <summary>
//      ///     Event reporting the give feedback is going to happen
//      /// </summary> 
//      public event GiveFeedbackEventHandler GiveFeedback
//      { 
          AddGiveFeedback:function(value) { this.AddHandler(DragDrop.GiveFeedbackEvent, value, false); }, 
          RemoveGiveFeedback:function(value) { this.RemoveHandler(DragDrop.GiveFeedbackEvent, value); },
//      } 
//
//      /// <summary>
//      ///     Event reporting the preview drag enter is going to happen 
//      /// </summary>
//      public event DragEventHandler PreviewDragEnter 
//      { 
          AddPreviewDragEnter:function(value) { this.AddHandler(DragDrop.PreviewDragEnterEvent, value, false); },
          RemovePreviewDragEnter:function(value) { this.RemoveHandler(DragDrop.PreviewDragEnterEvent, value); }, 
//      }
//
//      /// <summary> 
//      ///     Event reporting the drag enter is going to happen
//      /// </summary> 
//      public event DragEventHandler DragEnter 
//      {
          AddDragEnter:function(value) { this.AddHandler(DragDrop.DragEnterEvent, value, false); }, 
          RemoveDragEnter:function(value) { this.RemoveHandler(DragDrop.DragEnterEvent, value); },
//      }
//
//      /// <summary>
//      ///     Event reporting the preview drag over is going to happen 
//      /// </summary> 
//      public event DragEventHandler PreviewDragOver
//      { 
          AddPreviewDragOver:function(value) { this.AddHandler(DragDrop.PreviewDragOverEvent, value, false); },
          RemovePreviewDragOver:function(value) { this.RemoveHandler(DragDrop.PreviewDragOverEvent, value); },
//      }
//      
//    /// <summary> 
//      ///     Event reporting the drag over is going to happen 
//      /// </summary>
//      public event DragEventHandler DragOver 
//      {
          AddDragOver:function(value) { this.AddHandler(DragDrop.DragOverEvent, value, false); },
          RemoveDragOver:function(value) { this.RemoveHandler(DragDrop.DragOverEvent, value); },
//      } 
//      
//      /// <summary> 
//      ///     Event reporting the preview drag leave is going to happen
//      /// </summary> 
//      public event DragEventHandler PreviewDragLeave
//      {
          AddPreviewDragLeave:function(value) { this.AddHandler(DragDrop.PreviewDragLeaveEvent, value, false); },
          RemovePreviewDragLeave:function(value) { this.RemoveHandler(DragDrop.PreviewDragLeaveEvent, value); }, 
//      }
//
//      /// <summary>
//      ///     Event reporting the drag leave is going to happen 
//      /// </summary>
//      public event DragEventHandler DragLeave
//      {
          AddDragLeave:function(value) { this.AddHandler(DragDrop.DragLeaveEvent, value, false); }, 
          RemoveDragLeave:function(value) { this.RemoveHandler(DragDrop.DragLeaveEvent, value); },
//      } 
//      
//      /// <summary> 
//      ///     Event reporting the preview drop is going to happen
//      /// </summary>
//      public event DragEventHandler PreviewDrop
//      { 
          AddPreviewDrop:function(value) { this.AddHandler(DragDrop.PreviewDropEvent, value, false); },
          RemovePreviewDrop:function(value) { this.RemoveHandler(DragDrop.PreviewDropEvent, value); }, 
//      } 
//
//      /// <summary>
//      ///     Event reporting the drag enter is going to happen
//      /// </summary>
//      public event DragEventHandler Drop 
//      {
          AddDrop:function(value) { this.AddHandler(DragDrop.DropEvent, value, false); }, 
          RemoveDrop:function(value) { this.RemoveHandler(DragDrop.DropEvent, value); }, 
//      }
//      /// <summary>
//      ///     An event reporting that the IsMouseDirectlyOver property changed.
//      /// </summary>
//      public event DependencyPropertyChangedEventHandler IsMouseDirectlyOverChanged 
//      {
          AddIsMouseDirectlyOverChanged:function(value)    { EventHandlersStore.Add(UIElement.IsMouseDirectlyOverChangedKey, value); }, 
          RemoveIsMouseDirectlyOverChanged:function(value) { EventHandlersStore.Remove(UIElement.IsMouseDirectlyOverChangedKey, value); }, 
//      }
//      
//      /// <summary>
//      ///     An event reporting that the IsKeyboardFocusWithin property changed.
//      /// </summary> 
//      public event DependencyPropertyChangedEventHandler IsKeyboardFocusWithinChanged
//      { 
          AddIsKeyboardFocusWithinChanged:function(value)    { EventHandlersStore.Add(UIElement.IsKeyboardFocusWithinChangedKey, value); }, 
          RemoveIsKeyboardFocusWithinChanged:function(value) { EventHandlersStore.Remove(UIElement.IsKeyboardFocusWithinChangedKey, value); },
//      } 
//
//      /// <summary>
//      ///     An event reporting that the IsMouseCaptured property changed.
//      /// </summary> 
//      public event DependencyPropertyChangedEventHandler IsMouseCapturedChanged
//      { 
          AddIsMouseCapturedChanged:function(value)    { EventHandlersStore.Add(UIElement.IsMouseCapturedChangedKey, value); }, 
          RemoveIsMouseCapturedChanged:function(value) { EventHandlersStore.Remove(UIElement.IsMouseCapturedChangedKey, value); },
//      } 
//
//      /// <summary>
//      ///     An event reporting that the IsMouseCaptureWithin property changed. 
//      /// </summary> 
//      public event DependencyPropertyChangedEventHandler IsMouseCaptureWithinChanged
//      { 
          AddIsMouseCaptureWithinChanged:function(value)    { EventHandlersStore.Add(UIElement.IsMouseCaptureWithinChangedKey, value); },
          RemoveIsMouseCaptureWithinChanged:function(value) { EventHandlersStore.Remove(UIElement.IsMouseCaptureWithinChangedKey, value); },
//      }
//      /// <summary>
//      ///     An event reporting that the IsStylusDirectlyOver property changed. 
//      /// </summary> 
//      public event DependencyPropertyChangedEventHandler IsStylusDirectlyOverChanged
//      { 
          AddIsStylusDirectlyOverChanged:function(value)    { EventHandlersStore.Add(UIElement.IsStylusDirectlyOverChangedKey, value); },
          RemoveIsStylusDirectlyOverChanged:function(value) { EventHandlersStore.Remove(UIElement.IsStylusDirectlyOverChangedKey, value); },
//      },
//
//      /// <summary>
//      ///     An event reporting that the IsStylusCaptured property changed. 
//      /// </summary> 
//      public event DependencyPropertyChangedEventHandler IsStylusCapturedChanged
//      { 
          AddIsStylusCapturedChanged:function(value)    { EventHandlersStore.Add(UIElement.IsStylusCapturedChangedKey, value); },
          RemoveIsStylusCapturedChanged:function(value) { EventHandlersStore.Remove(UIElement.IsStylusCapturedChangedKey, value); },
//      },
//
//      /// <summary>
//      ///     An event reporting that the IsStylusCaptureWithin property changed. 
//      /// </summary>
//      public event DependencyPropertyChangedEventHandler IsStylusCaptureWithinChanged
//      {
          AddIsStylusCaptureWithinChanged:function(value)    { EventHandlersStore.Add(UIElement.IsStylusCaptureWithinChangedKey, value); }, 
          RemoveIsStylusCaptureWithinChanged:function(value) { EventHandlersStore.Remove(UIElement.IsStylusCaptureWithinChangedKey, value); },
//      } 
//      /// <summary>
//      ///     An event reporting that the IsKeyboardFocused property changed. 
//      /// </summary>
//      public event DependencyPropertyChangedEventHandler IsKeyboardFocusedChanged
//      {
          AddIsKeyboardFocusedChanged:function(value)    { EventHandlersStore.Add(UIElement.IsKeyboardFocusedChangedKey, value); }, 
          RemoveIsKeyboardFocusedChanged:function(value) { EventHandlersStore.Remove(UIElement.IsKeyboardFocusedChangedKey, value); },
//      }, 


    });
            
    
    Object.defineProperties(UIElement.prototype, {
    	
//    	public event EventHandler 
    	LayoutUpdated:
    	{
    		get:function(){
        		if(this._LayoutUpdated === undefined){
        			this._LayoutUpdated = new Delegate();
        		}
        		
        		return this._LayoutUpdated;
    		}
    	},
    		
    	/// <summary>
        /// Opacity applied to the rendered content of the UIElement.  When set, this opacity value
        /// is applied uniformly to the entire UIElement.
        /// </summary> 
        /*public double */Opacity: 
        { 
            get:function() { return this.GetValue(UIElement.OpacityProperty); },
            set:function(value) { this.SetValue(UIElement.OpacityProperty, value); } 
        },
        /// <summary>
        ///     A dependency property that allows the drop object as DragDrop target. 
        /// </summary>
        /*public bool*/ AllowDrop:
        {
            get:function() { return this.GetValue(UIElement.AllowDropProperty); }, 
            set:function(value) { this.SetValue(UIElement.AllowDropProperty, value); }
        }, 
 
 
        /// <summary>
        /// Get the StylusPlugInCollection associated with the UIElement
        /// </summary>
       /* protected StylusPlugInCollection*/ 
        StylusPlugIns: 
        {
            get:function() 
            { 
                var stylusCollection = StylusPlugInsField.GetValue(this);
                if (stylusCollection == null) 
                {
                    stylusCollection = new StylusPlugInCollection(this);
                    StylusPlugInsField.SetValue(this, stylusCollection);
                } 
                return stylusCollection;
            } 
        }, 

        /// <summary> 
        /// Returns the size the element computed during the Measure pass.
        /// This is only valid if IsMeasureValid is true.
        /// </summary>
//        public Size 
        DesiredSize: 
        {
            get:function() 
            { 
                if(this.Visibility == Visibility.Collapsed)
                    return new Size(0,0); 
                else
                    return this._desiredSize;
            }
        }, 

//        internal Size 
        PreviousConstraint: 
        { 
            get:function()
            { 
                return this._previousAvailableSize;
            }
        },
 
        /// <summary> 
        /// Determines if the DesiredSize is valid.
        /// </summary> 
        /// <remarks>
        /// A developer can force arrangement to be invalidated by calling InvalidateMeasure.
        /// IsArrangeValid and IsMeasureValid are related,
        /// in that arrangement cannot be valid without measurement first being valid. 
        /// </remarks>
        /*public bool*/ 
        IsMeasureValid: 
        { 
            get:function() { return !this.MeasureDirty; }
        }, 

        /// <summary>
        /// Determines if the RenderSize and position of child elements is valid.
        /// </summary> 
        /// <remarks>
        /// A developer can force arrangement to be invalidated by calling InvalidateArrange. 
        /// IsArrangeValid and IsMeasureValid are related, in that arrangement cannot be valid without measurement first 
        /// being valid.
        /// </remarks> 
        /*public bool*/ 
        IsArrangeValid:
        {
            get:function() { return !this.ArrangeDirty; }
        },

        /// <summary>
        /// This is a public read-only property that returns size of the UIElement. 
        /// This size is typcally used to find out where ink of the element will go.
        /// </summary>
//        public Size 
        RenderSize: 
        {
            get:function() 
            { 
                if (this.Visibility == Visibility.Collapsed)
                    return new Size(); 
                else
                	if(this._size == undefined){
                		this._size = new Size(this._dom.offsetWidth, this._dom.offsetHeight);
                	}
                    return this._size;
            },
            set:function(value) 
            {
            	this._size = value; 
            	this.InvalidateHitTestBounds(); 
            }
        }, 
        /// <summary>
        /// The RenderTransform property defines the transform that will be applied to UIElement during rendering of its content.
        /// This transform does not affect layout of the panel into which the UIElement is nested - the layout does not take this 
        /// transform into account to determine the location and RenderSize of the UIElement.
        /// </summary> 
//        public Transform 
        RenderTransform: 
        {
            get:function() { return this.GetValue(UIElement.RenderTransformProperty); },
            set:function(value) { this.SetValue(UIElement.RenderTransformProperty, value); }
        },
        /// <summary> 
        /// The RenderTransformOrigin property defines the center of the RenderTransform relative to
        /// bounds of the element. It is a Point and both X and Y components are between 0 and 1.0 - the
        /// (0,0) is the default value and specified top-left corner of the element, (0.5, 0.5) is the center of element
        /// and (1,1) is the bottom-right corner of element. 
        /// </summary>
//        public Point 
        RenderTransformOrigin: 
        { 
            get:function() { return this.GetValue(UIElement.RenderTransformOriginProperty); },
            set:function(value) { this.SetValue(UIElement.RenderTransformOriginProperty, value); } 
        },

        /// <summary> 
        ///     A property indicating if the mouse is over this element or not.
        /// </summary> 
        /*public bool*/ 
        IsMouseDirectlyOver:
        {
            get:function()
            { 
                // We do not return the cached value of reverse-inherited seed properties.
                // 
                // The cached value is only used internally to detect a "change". 
                //
                // More Info: 
                // The act of invalidating the seed property of a reverse-inherited property
                // on the first side of the path causes the invalidation of the
                // reverse-inherited properties on both sides.  The input system has not yet
                // invalidated the seed property on the second side, so its cached value can 
                // be incorrect.
                // 
                return this.IsMouseDirectlyOver_ComputeValue(); 
            }
        } ,
        /// <summary> 
        ///     A property indicating if the mouse is over this element or not.
        /// </summary> 
        /*public bool*/ IsMouseOver:
        {
            get:function()
            { 
                return this.ReadFlag(CoreFlags.IsMouseOverCache);
            } 
        }, 

        /// <summary> 
        ///     A property indicating if the stylus is over this element or not.
        /// </summary>
        /*public bool*/ 
        IsStylusOver:
        { 
            get:function()
            { 
                return this.ReadFlag(CoreFlags.IsStylusOverCache); 
            }
        }, 

        /// <summary>
        ///     Indicates if Keyboard Focus is anywhere
        ///     within in the subtree starting at the 
        ///     current instance
        /// </summary> 
        /*public bool*/ 
        IsKeyboardFocusWithin: 
        {
            get:function() 
            {
                return this.ReadFlag(CoreFlags.IsKeyboardFocusWithinCache);
            }
        }, 

 
        /// <summary>
        ///     A property indicating if the mouse is captured to this element or not. 
        /// </summary>
        /*public bool*/ 
        IsMouseCaptured:
        {
            get:function() { return this.GetValue(UIElement.IsMouseCapturedProperty); } 
        },
        /// <summary>
        ///     Indicates if mouse capture is anywhere within the subtree 
        ///     starting at the current instance
        /// </summary>
        /*public bool*/ 
        IsMouseCaptureWithin:
        { 
            get:function()
            { 
                return this.ReadFlag(CoreFlags.IsMouseCaptureWithinCache); 
            }
        }, 

        /// <summary>
        ///     A property indicating if the stylus is over this element or not.
        /// </summary> 
        /*public bool*/ 
        IsStylusDirectlyOver:
        { 
            get:function() 
            {
                // We do not return the cached value of reverse-inherited seed properties. 
                //
                // The cached value is only used internally to detect a "change".
                //
                // More Info: 
                // The act of invalidating the seed property of a reverse-inherited property
                // on the first side of the path causes the invalidation of the 
                // reverse-inherited properties on both sides.  The input system has not yet 
                // invalidated the seed property on the second side, so its cached value can
                // be incorrect. 
                //
                return this.IsStylusDirectlyOver_ComputeValue();
            }
        },
        /// <summary>
        ///     A property indicating if the stylus is captured to this element or not.
        /// </summary> 
        /*public bool*/ 
        IsStylusCaptured:
        { 
            get:function() { return this.GetValue(UIElement.IsStylusCapturedProperty); } 
        },
        /// <summary>
        ///     Indicates if stylus capture is anywhere within the subtree 
        ///     starting at the current instance
        /// </summary>
        /*public bool*/ 
        IsStylusCaptureWithin:
        { 
            get:function()
            { 
                return this.ReadFlag(CoreFlags.IsStylusCaptureWithinCache); 
            }
        }, 

        /// <summary>
        ///     A property indicating if the keyboard is focused on this
        ///     element or not. 
        /// </summary>
        /*public bool*/ 
        IsKeyboardFocused:
        { 
            get:function()
            { 
                // We do not return the cached value of reverse-inherited seed properties.
                //
                // The cached value is only used internally to detect a "change".
                // 
                // More Info:
                // The act of invalidating the seed property of a reverse-inherited property 
                // on the first side of the path causes the invalidation of the 
                // reverse-inherited properties on both sides.  The input system has not yet
                // invalidated the seed property on the second side, so its cached value can 
                // be incorrect.
                //
                return this.IsKeyboardFocused_ComputeValue();
            } 
        },
        /// <summary>
        ///     A property indicating if the inptu method is enabled.
        /// </summary>
        /*public bool*/ 
        IsInputMethodEnabled: 
        {
            get:function() { return this.GetValue(InputMethod.IsInputMethodEnabledProperty); } 
        },
    	/// <summary> 
        /// OpacityMask applied to the rendered content of the UIElement.  When set:function(value), the alpha channel 
        /// of the Brush's rendered content is applied to the rendered content of the UIElement.
        /// The other channels of the Brush's rendered content (e.g., Red, Green, or Blue) are ignored. 
        /// </summary>
        /*public Brush */
        OpacityMask:
        {
            get:function() { return this.GetValue(UIElement.OpacityMaskProperty); }, 
            set:function(value) { this.SetValue(UIElement.OpacityMaskProperty, value); }
        }, 
      /// <summary>
        /// BitmapEffect applied to the rendered content of the UIElement.
        /// </summary> 
        /*public BitmapEffect*/ 
        BitmapEffect: 
        { 
            get:function() { return this.GetValue(UIElement.BitmapEffectProperty); },
            set:function(value) { this.SetValue(UIElement.BitmapEffectProperty, value); } 
        },
      /// <summary> 
        /// Effect applied to the rendered content of the UIElement.
        /// </summary>
        /*public Effect*/ 
        Effect:
        { 
            get:function() { return this.GetValue(UIElement.EffectProperty); },
            set:function(value) { this.SetValue(UIElement.EffectProperty, value); } 
        }, 
        /// <summary>
        /// BitmapEffectInput accessor.
        /// </summary> 
        /*public BitmapEffectInput*/ 
        BitmapEffectInput: 
        { 
            get:function() { return this.GetValue(UIElement.BitmapEffectInputProperty); },
            set:function(value) { this.SetValue(UIElement.BitmapEffectInputProperty, value); } 
        },
      /// <summary>
        /// The CacheMode specifies parameters used to create a persistent cache of the UIElement and its subtree 
        /// in order to increase rendering performance for content that is expensive to realize.
        /// </summary>
        /*public CacheMode*/ 
        CacheMode:
        { 
            get:function() { return this.GetValue(UIElement.CacheModeProperty); },
            set:function(value) { this.SetValue(UIElement.CacheModeProperty, value); } 
        }, 
        /// <summary>
        /// Uid can be specified in xaml at any point using the xaml language attribute x:Uid. 
        /// This is a long lasting (persisted in source) unique id for an element. 
        /// </summary>
        /*public string*/ 
        Uid: 
        {
            get:function() { return this.GetValue(UIElement.UidProperty); },
            set:function(value) { this.SetValue(UIElement.UidProperty, value); }
        }, 
        
        /// <summary>
        ///     Visibility accessor 
        /// </summary>
       /* public Visibility*/ 
        Visibility: 
        {
            get:function() { return this.VisibilityCache; }, 
            set:function(value) { this.SetValue(UIElement.VisibilityProperty, value); }
        },
    	/// <summary>
        /// ClipToBounds Property 
        /// </summary>
        /// <remarks> 
        /// This property enables the content of this UIElement to be clipped by automatic Layout 
        /// in order to "fit" into small space even if the content is larger.
        /// For example, if a text string is longer then available space, and Layout can not give it the 
        /// "full" space to render, setting this property to "true" will ensure that the part of text string that
        /// does not fit will be automatically clipped.
        /// </remarks>
        /*public bool*/ ClipToBounds: 
        {
            get:function() { return this.ClipToBoundsCache; }, 
            set:function(value) { this.SetValue(UIElement.ClipToBoundsProperty, value); } 
        },
 
        /// <summary> 
        /// Clip Property
        /// </summary> 
        /*public Geometry*/ Clip:
        {
            get:function() { return this.GetValue(UIElement.ClipProperty); },
            set:function(value) { this.SetValue(UIElement.ClipProperty, value); } 
        },
 
        /// SnapsToDevicePixels Property
        /// </summary> 
        /*public bool*/ SnapsToDevicePixels: 
        {
            get:function() { return this.SnapsToDevicePixelsCache; }, 
            set:function(value) { this.SetValue(UIElement.SnapsToDevicePixelsProperty, value); }
        },

        /// <summary> 
        ///     Indicates if the element has effectively focus.
        ///     Used by AccessKeyManager to determine starting 
        ///     element in case of duplicate access keys. This 
        ///     helps when the focus is delegated to some
        ///     other element in the tree. 
        /// </summary>
        /*protected internal virtual bool*/ HasEffectiveKeyboardFocus:
        {
            get:function() 
            {
                return this.IsKeyboardFocused; 
            } 
        },
    	/// <summary>
        /// Returns true if any properties on this DependencyObject have a 
        /// persistent animation or the object has one or more clocks associated
        /// with any of its properties.
        /// </summary>
        /*public bool*/ HasAnimatedProperties: 
        {
            get:function() 
            { 
                return IAnimatable_HasAnimatedProperties;
            }
        },
        /// <summary>
        /// Instance level InputBinding collection, initialized on first use.
        /// To have commands handled (QueryEnabled/Execute) on an element instance, 
        /// the user of this method can add InputBinding with handlers thru this
        /// method. 
        /// </summary> 
        /*public InputBindingCollection*/ InputBindings: 
        {
            get:function()
            {
                var bindings = InputBindingCollectionField.GetValue(this);
                if (bindings == null) 
                { 
                    bindings = new InputBindingCollection(this);
                    InputBindingCollectionField.SetValue(this, bindings); 
                }

                return bindings;
            } 
        },
 
        // Used by CommandManager to avoid instantiating an empty collection 
        /*internal InputBindingCollection*/ InputBindingsInternal:
        { 
            get:function()
            {
                return InputBindingCollectionField.GetValue(this); 
            }
        }, 
        /// <summary> 
        /// Instance level CommandBinding collection, initialized on first use.
        /// To have commands handled (QueryEnabled/Execute) on an element instance, 
        /// the user of this method can add CommandBinding with handlers thru this
        /// method.
        /// </summary>
        /*public CommandBindingCollection*/ CommandBindings:
        { 
            get:function() 
            {
                var bindings = CommandBindingCollectionField.GetValue(this);
                if (bindings == null)
                {
                    bindings = new CommandBindingCollection(); 
                    CommandBindingCollectionField.SetValue(this, bindings);
                } 
 
                return bindings;
            } 
        },

        // Used by CommandManager to avoid instantiating an empty collection
        /*internal CommandBindingCollection*/ CommandBindingsInternal:
        {
            get:function() 
            { 
                return CommandBindingCollectionField.GetValue(this); 
            }
        },
        /// <summary> 
        ///     Event Handlers Store
        /// </summary> 
        /// <remarks> 
        ///     The idea of exposing this property is to allow
        ///     elements in the Framework to generically use 
        ///     EventHandlersStore for Clr events as well.
        /// </remarks>
        /*internal EventHandlersStore*/ EventHandlersStore:
        { 
            get:function() 
            { 
                if(!this.ReadFlag(CoreFlags.ExistsEventHandlersStore))
                { 
                    return null;
                }
                return EventHandlersStoreField.GetValue(this);
            } 
        },
    	 /// <summary> 
        ///     Gettor for IsFocused Property 
        /// </summary>
        /*public bool*/ IsFocused: 
        {
            get:function() { return this.GetValue(UIElement.IsFocusedProperty); }
        },
 
        /// <summary> 
        ///     A property indicating if this element is enabled or not. 
        /// </summary>
        /*public bool*/ IsEnabled: 
        {
            get:function() { return this.GetValue(UIElement.IsEnabledProperty);},
            set:function(value) { this.SetValue(UIElement.IsEnabledProperty, value); }
        }, 
        
        /// <summary> 
        ///     Fetches the value that IsEnabled should be coerced to.
        /// </summary> 
        /// <remarks>
        ///     This method is virtual is so that controls derived from UIElement
        ///     can combine additional requirements into the coersion logic.
        ///     <P/> 
        ///     It is important for anyone overriding this property to also
        ///     call CoerceValue when any of their dependencies change. 
        /// </remarks> 
        /*protected virtual bool*/ IsEnabledCore:
        { 
            get:function()
            {
                // As of 1/25/2006, the following controls override this method:
                // ButtonBase.IsEnabledCore: CanExecute 
                // MenuItem.IsEnabledCore:   CanExecute
                // ScrollBar.IsEnabledCore:  _canScroll 
                return true; 
            }
        }, 
    	/// <summary> 
        ///     A property indicating if this element is hit test visible or not. 
        /// </summary>
        /*public bool*/ IsHitTestVisible: 
        {
            get:function() { return this.GetValue(UIElement.IsHitTestVisibleProperty); },
            set:function(value) { this.SetValue(UIElement.IsHitTestVisibleProperty, value); }
        }, 
        /// <summary> 
        ///     A property indicating if this element is Visible or not.
        /// </summary>
        /*public bool*/ IsVisible:
        { 
            get:function() { return this.ReadFlag(CoreFlags.IsVisibleCache); }
        }, 
        
        /// <summary>
        ///     Gettor and Settor for Focusable Property 
        /// </summary> 
        /*public bool*/ Focusable:
        { 
            get:function() { return this.GetValue(UIElement.FocusableProperty); },
            set:function(value) { this.SetValue(UIElement.FocusableProperty, value); }
        },
        /// <summary> 
        /// This is used by the parser and journaling to uniquely identify a given element
        /// in a deterministic fashion, i.e., each time the same XAML/BAML is parsed/read, 
        /// the items will be given the same PersistId.
        /// </summary>
        /// To keep PersistId from being serialized the set has been removed from the property and a separate
        /// set method has been created. 
        /*public int*/ PersistId: 
        {
            get:function() { return this._persistId; } 
        },
        /*internal Rect*/ PreviousArrangeRect:
        {
             //  called from PresentationFramework!System.Windows.Controls.Primitives.LayoutInformation.GetLayoutSlot() 
             get:function()
             { 
                 return this._finalRect;
             }
        },
  
         // Cache for the Visibility property.  Storage is in Visual._nodeProperties.
         /*private Visibility*/ VisibilityCache: 
         { 
             get:function()
             { 
                 if (this.CheckFlagsAnd(VisualFlags.VisibilityCache_Visible))
                 {
                     return Visibility.Visible;
                 } 
                 else if (this.CheckFlagsAnd(VisualFlags.VisibilityCache_TakesSpace))
                 { 
                     return Visibility.Hidden; 
                 }
                 else 
                 {
                     return Visibility.Collapsed;
                 }
             }, 
             set:function(value)
             { 
//                 Debug.Assert(value == Visibility.Visible || value == Visibility.Hidden || value == Visibility.Collapsed); 

                 switch (value) 
                 {
                     case Visibility.Visible:
                    	 this.SetFlags(true,  VisualFlags.VisibilityCache_Visible);
                         this.SetFlags(false, VisualFlags.VisibilityCache_TakesSpace); 
                         break;
  
                     case Visibility.Hidden: 
                    	 this.SetFlags(false, VisualFlags.VisibilityCache_Visible);
                    	 this.SetFlags(true,  VisualFlags.VisibilityCache_TakesSpace); 
                         break;

                     case Visibility.Collapsed:
                    	 this.SetFlags(false, VisualFlags.VisibilityCache_Visible); 
                    	 this.SetFlags(false, VisualFlags.VisibilityCache_TakesSpace);
                         break; 
                 } 
             }
         }, 
  
         /// <summary> 
         ///     Whether manipulations are enabled on this element or not.
         /// </summary>
         /// <remarks>
         ///     Handle the ManipulationStarting event to customize the behavior of manipulations. 
         ///     Setting to false will immediately complete any current manipulation or inertia
         ///     on this element and raise a ManipulationCompleted event. 
         /// </remarks> 
         /*public bool*/ IsManipulationEnabled: 
         {
             get:function()
             {
                 return this.GetValue(UIElement.IsManipulationEnabledProperty); 
             },
             set:function(value) 
             { 
            	 this.SetValue(UIElement.IsManipulationEnabledProperty, value);
             } 
         },
    	/// <summary>
        ///     A property indicating if any touch devices are over this element or not.
        /// </summary>
        /*public bool*/ AreAnyTouchesOver: 
        {
            get:function() { return this.ReadFlag(CoreFlags.TouchesOverCache); } 
        }, 

        /// <summary> 
        ///     A property indicating if any touch devices are directly over this element or not.
        /// </summary>
        /*public bool*/ AreAnyTouchesDirectlyOver:
        { 
            get:function() { return this.GetValue(UIElement.AreAnyTouchesDirectlyOverProperty); }
        }, 
 
        /// <summary>
        ///     A property indicating if any touch devices are captured to elements in this subtree. 
        /// </summary>
        /*public bool*/ AreAnyTouchesCapturedWithin:
        {
            get:function() { return this.ReadFlag(CoreFlags.TouchesCapturedWithinCache); } 
        },
 
        /// <summary> 
        ///     A property indicating if any touch devices are captured to this element.
        /// </summary> 
        /*public bool*/ AreAnyTouchesCaptured:
        {
            get:function() { return this.GetValue(UIElement.AreAnyTouchesCapturedProperty); }
        },
    	/// <summary> 
        ///     The touch devices captured to this element.
        /// </summary> 
        /*public IEnumerable<TouchDevice>*/ TouchesCaptured:
        {
            get:function()
            { 
                return TouchDevice.GetCapturedTouches(this, /* includeWithin = */ false);
            } 
        }, 

        /// <summary> 
        ///     The touch devices captured to this element and any elements in the subtree.
        /// </summary>
        /*public IEnumerable<TouchDevice>*/ TouchesCapturedWithin:
        { 
            get:function()
            { 
                return TouchDevice.GetCapturedTouches(this, /* includeWithin = */ true); 
            }
        }, 

        /// <summary>
        ///     The touch devices which are over this element and any elements in the subtree.
        ///     This is particularly relevant to elements which dont take capture (like Label). 
        /// </summary>
        /*public IEnumerable<TouchDevice>*/ TouchesOver: 
        { 
            get:function()
            { 
                return TouchDevice.GetTouchesOver(this, /* includeWithin = */ true);
            }
        },
 
        /// <summary>
        ///     The touch devices which are directly over this element. 
        ///     This is particularly relevant to elements which dont take capture (like Label). 
        /// </summary>
        /*public IEnumerable<TouchDevice>*/ TouchesDirectlyOver: 
        {
            get:function()
            {
                return TouchDevice.GetTouchesOver(this, /* includeWithin = */ false); 
            }
        },
        /*private bool*/ RenderingInvalidated:
        { 
            get:function() { return this.ReadFlag(CoreFlags.RenderingInvalidated); }, 
            set:function(value) { this.WriteFlag(CoreFlags.RenderingInvalidated, value); }
        }, 

        /*internal bool*/ SnapsToDevicePixelsCache:
        {
            get:function() { return this.ReadFlag(CoreFlags.SnapsToDevicePixelsCache); }, 
            set:function(value) { this.WriteFlag(CoreFlags.SnapsToDevicePixelsCache, value); }
        }, 
 
        /*internal bool*/ ClipToBoundsCache:
        { 
            get:function() { return this.ReadFlag(CoreFlags.ClipToBoundsCache); },
            set:function(value) { this.WriteFlag(CoreFlags.ClipToBoundsCache, value); }
        },
 
        /*internal bool*/ MeasureDirty:
        { 
            get:function() { return this.ReadFlag(CoreFlags.MeasureDirty); }, 
            set:function(value) { this.WriteFlag(CoreFlags.MeasureDirty, value); }
        },

        /*internal bool*/ ArrangeDirty:
        {
            get:function() { return this.ReadFlag(CoreFlags.ArrangeDirty); }, 
            set:function(value) { this.WriteFlag(CoreFlags.ArrangeDirty, value); }
        }, 
 
        /*internal bool*/ MeasureInProgress:
        { 
            get:function() { return this.ReadFlag(CoreFlags.MeasureInProgress); },
            set:function(value) { this.WriteFlag(CoreFlags.MeasureInProgress, value); }
        },
 
        /*internal bool*/ ArrangeInProgress:
        { 
            get:function() { return this.ReadFlag(CoreFlags.ArrangeInProgress); }, 
            set:function(value) { this.WriteFlag(CoreFlags.ArrangeInProgress, value); }
        }, 

        /*internal bool*/ NeverMeasured:
        {
            get:function() { return this.ReadFlag(CoreFlags.NeverMeasured); }, 
            set:function(value) { this.WriteFlag(CoreFlags.NeverMeasured, value); }
        }, 
 
        /*internal bool*/ NeverArranged:
        { 
            get:function() { return this.ReadFlag(CoreFlags.NeverArranged); },
            set:function(value) { this.WriteFlag(CoreFlags.NeverArranged, value); }
        },
 
       /* internal bool*/ MeasureDuringArrange:
        { 
            get:function() { return this.ReadFlag(CoreFlags.MeasureDuringArrange); }, 
            set:function(value) { this.WriteFlag(CoreFlags.MeasureDuringArrange, value); }
        }, 

        /*internal bool*/ AreTransformsClean:
        {
            get:function() { return this.ReadFlag(CoreFlags.AreTransformsClean); }, 
            set:function(value) { this.WriteFlag(CoreFlags.AreTransformsClean, value); }
        }	
    });
    
    Object.defineProperties(UIElement, {
        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseDownEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewMouseDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseDownEvent === undefined){
	    			UIElement._PreviewMouseDownEvent  = Mouse.PreviewMouseDownEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewMouseDownEvent;
	    	}   
	    },
        /// <summary>
        ///     Alias to the Mouse.MouseDownEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ MouseDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseDownEvent === undefined){
	    			UIElement._MouseDownEvent = Mouse.MouseDownEvent.AddOwner(UIElement.Type);
	    		}
	    		
	    		return UIElement._MouseDownEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseUpEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewMouseUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseUpEvent === undefined){
	    			UIElement._PreviewMouseUpEvent = Mouse.PreviewMouseUpEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewMouseUpEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the Mouse.MouseUpEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ MouseUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseUpEvent === undefined){
	    			UIElement._MouseUpEvent = Mouse.MouseUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._MouseUpEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Declaration of the routed event reporting the left mouse button was pressed 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewMouseLeftButtonDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseLeftButtonDownEvent === undefined){
	    			UIElement._PreviewMouseLeftButtonDownEvent = EventManager.RegisterRoutedEvent("PreviewMouseLeftButtonDown",
	    		    		RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewMouseLeftButtonDownEvent;
	    	}   
	    }, 

        /// <summary> 
        ///     Declaration of the routed event reporting the left mouse button was pressed
        /// </summary>
        /*public static readonly RoutedEvent*/ MouseLeftButtonDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseLeftButtonDownEvent === undefined){
	    			UIElement._MouseLeftButtonDownEvent = EventManager.RegisterRoutedEvent("MouseLeftButtonDown", 
	    		    		RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);  
	    		}
	    		
	    		return UIElement._MouseLeftButtonDownEvent;
	    	}   
	    }, 
 
        /// <summary>
        ///     Declaration of the routed event reporting the left mouse button was released
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewMouseLeftButtonUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseLeftButtonUpEvent === undefined){
	    			UIElement._PreviewMouseLeftButtonUpEvent = EventManager.RegisterRoutedEvent("PreviewMouseLeftButtonUp", 
	    		    		RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewMouseLeftButtonUpEvent;
	    	}   
	    }, 

        /// <summary>
        ///     Declaration of the routed event reporting the left mouse button was released
        /// </summary> 
        /*public static readonly RoutedEvent*/ MouseLeftButtonUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseLeftButtonUpEvent === undefined){
	    			UIElement._MouseLeftButtonUpEvent  = EventManager.RegisterRoutedEvent("MouseLeftButtonUp", 
	    					RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);
	    		}
	    		
	    		return UIElement._MouseLeftButtonUpEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Declaration of the routed event reporting the right mouse button was pressed 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewMouseRightButtonDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseRightButtonDownEvent === undefined){
	    			UIElement._PreviewMouseRightButtonDownEvent = EventManager.RegisterRoutedEvent("PreviewMouseRightButtonDown",
	    					RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewMouseRightButtonDownEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Declaration of the routed event reporting the right mouse button was pressed
        /// </summary> 
        /*public static readonly RoutedEvent*/ MouseRightButtonDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseRightButtonDownEvent === undefined){
	    			UIElement._MouseRightButtonDownEvent = EventManager.RegisterRoutedEvent("MouseRightButtonDown", 
	    					RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);
	    		}
	    		
	    		return UIElement._MouseRightButtonDownEvent;
	    	}   
	    },  
        /// <summary>
        ///     Declaration of the routed event reporting the right mouse button was released 
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewMouseRightButtonUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseRightButtonUpEvent === undefined){
	    			UIElement._PreviewMouseRightButtonUpEvent = EventManager.RegisterRoutedEvent("PreviewMouseRightButtonUp",
	    					RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewMouseRightButtonUpEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Declaration of the routed event reporting the right mouse button was released 
        /// </summary>
        /*public static readonly RoutedEvent*/ MouseRightButtonUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseRightButtonUpEvent === undefined){
	    			UIElement._MouseRightButtonUpEvent = EventManager.RegisterRoutedEvent("MouseRightButtonUp", 
	    					RoutingStrategy.Direct, MouseButtonEventHandler.Type, UIElement.Type);  
	    		}
	    		
	    		return UIElement._MouseRightButtonUpEvent;
	    	}   
	    },  

        /// <summary>
        ///     Alias to the Mouse.MouseWheelEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ MouseWheelEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseWheelEvent === undefined){
	    			UIElement._MouseWheelEvent = Mouse.MouseWheelEvent.AddOwner(UIElement.Type);   
	    		}
	    		
	    		return UIElement._MouseWheelEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseMoveEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewMouseMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseMoveEvent === undefined){
	    			UIElement._PreviewMouseMoveEvent = Mouse.PreviewMouseMoveEvent.AddOwner(UIElement.Type);
	    		}
	    		
	    		return UIElement._PreviewMouseMoveEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Mouse.MouseMoveEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ MouseMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseMoveEvent === undefined){
	    			UIElement._MouseMoveEvent = Mouse.MouseMoveEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._MouseMoveEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseWheelEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewMouseWheelEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewMouseWheelEvent === undefined){
	    			UIElement._PreviewMouseWheelEvent = Mouse.PreviewMouseWheelEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewMouseWheelEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Mouse.MouseEnterEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ MouseEnterEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseEnterEvent === undefined){
	    			UIElement._MouseEnterEvent = Mouse.MouseEnterEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._MouseEnterEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Mouse.MouseLeaveEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ MouseLeaveEvent:
	    {
	    	get:function(){
	    		if(UIElement._MouseLeaveEvent === undefined){
	    			UIElement._MouseLeaveEvent = Mouse.MouseLeaveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._MouseLeaveEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Mouse.GotMouseCaptureEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ GotMouseCaptureEvent:
	    {
	    	get:function(){
	    		if(UIElement._GotMouseCaptureEvent === undefined){
	    			UIElement._GotMouseCaptureEvent = Mouse.GotMouseCaptureEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._GotMouseCaptureEvent;
	    	}   
	    },  
        /// <summary>
        ///     Alias to the Mouse.LostMouseCaptureEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ LostMouseCaptureEvent:
	    {
	    	get:function(){
	    		if(UIElement._LostMouseCaptureEvent === undefined){
	    			UIElement._LostMouseCaptureEvent = Mouse.LostMouseCaptureEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._LostMouseCaptureEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Mouse.QueryCursorEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ QueryCursorEvent:
	    {
	    	get:function(){
	    		if(UIElement._QueryCursorEvent === undefined){
	    			UIElement._QueryCursorEvent = Mouse.QueryCursorEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._QueryCursorEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the Stylus.StylusLeaveEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ StylusLeaveEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusLeaveEvent === undefined){
	    			UIElement._StylusLeaveEvent = Stylus.StylusLeaveEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusLeaveEvent;
	    	}   
	    }, 
 
        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusDownEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewStylusDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusDownEvent === undefined){
	    			UIElement._PreviewStylusDownEvent = Stylus.PreviewStylusDownEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewStylusDownEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.StylusDownEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ StylusDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusDownEvent === undefined){
	    			UIElement._StylusDownEvent = Stylus.StylusDownEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusDownEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusUpEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewStylusUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusUpEvent === undefined){
	    			UIElement._PreviewStylusUpEvent = Stylus.PreviewStylusUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewStylusUpEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.StylusUpEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ StylusUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusUpEvent === undefined){
	    			UIElement._StylusUpEvent = Stylus.StylusUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusUpEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusMoveEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewStylusMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusMoveEvent === undefined){
	    			UIElement._PreviewStylusMoveEvent = Stylus.PreviewStylusMoveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewStylusMoveEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.StylusMoveEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ StylusMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusMoveEvent === undefined){
	    			UIElement._StylusMoveEvent = Stylus.StylusMoveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._StylusMoveEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusInAirMoveEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewStylusInAirMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusInAirMoveEvent === undefined){
	    			UIElement._PreviewStylusInAirMoveEvent = Stylus.PreviewStylusInAirMoveEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewStylusInAirMoveEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.StylusInAirMoveEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ StylusInAirMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusInAirMoveEvent === undefined){
	    			UIElement._StylusInAirMoveEvent = Stylus.StylusInAirMoveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._StylusInAirMoveEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Stylus.StylusEnterEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ StylusEnterEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusEnterEvent === undefined){
	    			UIElement._StylusEnterEvent = Stylus.StylusEnterEvent.AddOwner(UIElement.Type);   
	    		}
	    		
	    		return UIElement._StylusEnterEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusInRangeEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewStylusInRangeEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusInRangeEvent === undefined){
	    			UIElement._PreviewStylusInRangeEvent = Stylus.PreviewStylusInRangeEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewStylusInRangeEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Stylus.StylusInRangeEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ StylusInRangeEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusInRangeEvent === undefined){
	    			UIElement._StylusInRangeEvent = Stylus.StylusInRangeEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusInRangeEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusOutOfRangeEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewStylusOutOfRangeEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusOutOfRangeEvent === undefined){
	    			UIElement._PreviewStylusOutOfRangeEvent = Stylus.PreviewStylusOutOfRangeEvent.AddOwner(UIElement.Type);   
	    		}
	    		
	    		return UIElement._PreviewStylusOutOfRangeEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.StylusOutOfRangeEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ StylusOutOfRangeEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusOutOfRangeEvent === undefined){
	    			UIElement._StylusOutOfRangeEvent = Stylus.StylusOutOfRangeEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusOutOfRangeEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusSystemGestureEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewStylusSystemGestureEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusSystemGestureEvent === undefined){
	    			UIElement._PreviewStylusSystemGestureEvent = Stylus.PreviewStylusSystemGestureEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewStylusSystemGestureEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the Stylus.StylusSystemGestureEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ StylusSystemGestureEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusSystemGestureEvent === undefined){
	    			UIElement._StylusSystemGestureEvent = Stylus.StylusSystemGestureEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._StylusSystemGestureEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.GotStylusCaptureEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ GotStylusCaptureEvent:
	    {
	    	get:function(){
	    		if(UIElement._GotStylusCaptureEvent === undefined){
	    			UIElement._GotStylusCaptureEvent = Stylus.GotStylusCaptureEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._GotStylusCaptureEvent;
	    	}   
	    }, 
        
        /// <summary> 
        ///     Alias to the Stylus.LostStylusCaptureEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ LostStylusCaptureEvent:
	    {
	    	get:function(){
	    		if(UIElement._LostStylusCaptureEvent === undefined){
	    			UIElement._LostStylusCaptureEvent = Stylus.LostStylusCaptureEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._LostStylusCaptureEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Stylus.StylusButtonDownEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ StylusButtonDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusButtonDownEvent === undefined){
	    			UIElement._StylusButtonDownEvent = Stylus.StylusButtonDownEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusButtonDownEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.StylusButtonUpEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ StylusButtonUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._StylusButtonUpEvent === undefined){
	    			UIElement._StylusButtonUpEvent= Stylus.StylusButtonUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._StylusButtonUpEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusButtonDownEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewStylusButtonDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusButtonDownEvent === undefined){
	    			UIElement._PreviewStylusButtonDownEvent = Stylus.PreviewStylusButtonDownEvent.AddOwner(UIElement.Type);
	    		}
	    		
	    		return UIElement._PreviewStylusButtonDownEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusButtonUpEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewStylusButtonUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewStylusButtonUpEvent === undefined){
	    			UIElement._PreviewStylusButtonUpEvent = Stylus.PreviewStylusButtonUpEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewStylusButtonUpEvent;
	    	}   
	    },
        /// <summary>
        ///     Alias to the Keyboard.PreviewKeyDownEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewKeyDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewKeyDownEvent === undefined){
	    			UIElement._PreviewKeyDownEvent = Keyboard.PreviewKeyDownEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewKeyDownEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Keyboard.KeyDownEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ KeyDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._KeyDownEvent === undefined){
	    			UIElement._KeyDownEvent = Keyboard.KeyDownEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._KeyDownEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the Keyboard.PreviewKeyUpEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewKeyUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewKeyUpEvent === undefined){
	    			UIElement._PreviewKeyUpEvent = Keyboard.PreviewKeyUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewKeyUpEvent;
	    	}   
	    },  
        /// <summary>
        ///     Alias to the Keyboard.KeyUpEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ KeyUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._KeyUpEvent === undefined){
	    			UIElement._KeyUpEvent = Keyboard.KeyUpEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._KeyUpEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Keyboard.PreviewGotKeyboardFocusEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewGotKeyboardFocusEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewGotKeyboardFocusEvent === undefined){
	    			UIElement._PreviewGotKeyboardFocusEvent = Keyboard.PreviewGotKeyboardFocusEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewGotKeyboardFocusEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the Keyboard.GotKeyboardFocusEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ GotKeyboardFocusEvent:
	    {
	    	get:function(){
	    		if(UIElement._GotKeyboardFocusEvent === undefined){
	    			UIElement._GotKeyboardFocusEvent = Keyboard.GotKeyboardFocusEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._GotKeyboardFocusEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Keyboard.PreviewLostKeyboardFocusEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewLostKeyboardFocusEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewLostKeyboardFocusEvent === undefined){
	    			UIElement._PreviewLostKeyboardFocusEvent = Keyboard.PreviewLostKeyboardFocusEvent.AddOwner(UIElement.Type);
	    		}
	    		
	    		return UIElement._PreviewLostKeyboardFocusEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Keyboard.LostKeyboardFocusEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ LostKeyboardFocusEvent:
	    {
	    	get:function(){
	    		if(UIElement._LostKeyboardFocusEvent === undefined){
	    			UIElement._LostKeyboardFocusEvent = Keyboard.LostKeyboardFocusEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._LostKeyboardFocusEvent;
	    	}   
	    }, 
        
        /// <summary>
        ///     Alias to the TextCompositionManager.PreviewTextInputEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewTextInputEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewTextInputEvent === undefined){
	    			UIElement._PreviewTextInputEvent = TextCompositionManager.PreviewTextInputEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewTextInputEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the TextCompositionManager.TextInputEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ TextInputEvent:
	    {
	    	get:function(){
	    		if(UIElement._TextInputEvent === undefined){
	    			UIElement._TextInputEvent = TextCompositionManager.TextInputEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._TextInputEvent;
	    	}   
	    },
        /// <summary>
        ///     Alias to the DragDrop.PreviewQueryContinueDragEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewQueryContinueDragEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewQueryContinueDragEvent === undefined){
	    			UIElement._PreviewQueryContinueDragEvent = DragDrop.PreviewQueryContinueDragEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewQueryContinueDragEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the DragDrop.QueryContinueDragEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ QueryContinueDragEvent:
	    {
	    	get:function(){
	    		if(UIElement._QueryContinueDragEvent === undefined){
	    			UIElement._QueryContinueDragEvent = DragDrop.QueryContinueDragEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._QueryContinueDragEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the DragDrop.PreviewGiveFeedbackEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewGiveFeedbackEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewGiveFeedbackEvent === undefined){
	    			UIElement._PreviewGiveFeedbackEvent = DragDrop.PreviewGiveFeedbackEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewGiveFeedbackEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the DragDrop.GiveFeedbackEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ GiveFeedbackEvent:
	    {
	    	get:function(){
	    		if(UIElement._GiveFeedbackEvent === undefined){
	    			UIElement._GiveFeedbackEvent = DragDrop.GiveFeedbackEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._GiveFeedbackEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the DragDrop.PreviewDragEnterEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewDragEnterEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewDragEnterEvent === undefined){
	    			UIElement._PreviewDragEnterEvent = DragDrop.PreviewDragEnterEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewDragEnterEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the DragDrop.DragEnterEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ DragEnterEvent:
	    {
	    	get:function(){
	    		if(UIElement._DragEnterEvent === undefined){
	    			UIElement._DragEnterEvent = DragDrop.DragEnterEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._DragEnterEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the DragDrop.PreviewDragOverEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewDragOverEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewDragOverEvent === undefined){
	    			UIElement._PreviewDragOverEvent = DragDrop.PreviewDragOverEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewDragOverEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the DragDrop.DragOverEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ DragOverEvent:
	    {
	    	get:function(){
	    		if(UIElement._DragOverEvent === undefined){
	    			UIElement._DragOverEvent = DragDrop.DragOverEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._DragOverEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the DragDrop.PreviewDragLeaveEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewDragLeaveEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewDragLeaveEvent === undefined){
	    			UIElement._PreviewDragLeaveEvent = DragDrop.PreviewDragLeaveEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewDragLeaveEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the DragDrop.DragLeaveEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ DragLeaveEvent:
	    {
	    	get:function(){
	    		if(UIElement._DragLeaveEvent === undefined){
	    			UIElement._DragLeaveEvent = DragDrop.DragLeaveEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._DragLeaveEvent;
	    	}   
	    },  
        /// <summary> 
        ///     Alias to the DragDrop.PreviewDropEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewDropEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewDropEvent === undefined){
	    			UIElement._PreviewDropEvent = DragDrop.PreviewDropEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewDropEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the DragDrop.DropEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ DropEvent:
	    {
	    	get:function(){
	    		if(UIElement._DropEvent === undefined){
	    			UIElement._DropEvent = DragDrop.DropEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._DropEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Touch.PreviewTouchDownEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewTouchDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewTouchDownEvent === undefined){
	    			UIElement._PreviewTouchDownEvent = Touch.PreviewTouchDownEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewTouchDownEvent;
	    	}   
	    },  
        /// <summary>
        ///     Alias to the Touch.TouchDownEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ TouchDownEvent:
	    {
	    	get:function(){
	    		if(UIElement._TouchDownEvent === undefined){
	    			UIElement._TouchDownEvent = Touch.TouchDownEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._TouchDownEvent;
	    	}   
	    },         
        /// <summary>
        ///     Alias to the Touch.PreviewTouchMoveEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ PreviewTouchMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewTouchMoveEvent === undefined){
	    			UIElement._PreviewTouchMoveEvent = Touch.PreviewTouchMoveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._PreviewTouchMoveEvent;
	    	}   
	    },  
        /// <summary>
        ///     Alias to the Touch.TouchMoveEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ TouchMoveEvent:
	    {
	    	get:function(){
	    		if(UIElement._TouchMoveEvent === undefined){
	    			UIElement._TouchMoveEvent = Touch.TouchMoveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._TouchMoveEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Touch.PreviewTouchUpEvent. 
        /// </summary> 
        /*public static readonly RoutedEvent*/ PreviewTouchUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._PreviewTouchUpEvent === undefined){
	    			UIElement._PreviewTouchUpEvent = Touch.PreviewTouchUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._PreviewTouchUpEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Touch.TouchUpEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ TouchUpEvent:
	    {
	    	get:function(){
	    		if(UIElement._TouchUpEvent === undefined){
	    			UIElement._TouchUpEvent = Touch.TouchUpEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._TouchUpEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Touch.GotTouchCaptureEvent.
        /// </summary>
        /*public static readonly RoutedEvent*/ GotTouchCaptureEvent:
	    {
	    	get:function(){
	    		if(UIElement._GotTouchCaptureEvent === undefined){
	    			UIElement._GotTouchCaptureEvent = Touch.GotTouchCaptureEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._GotTouchCaptureEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Alias to the Touch.LostTouchCaptureEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ LostTouchCaptureEvent:
	    {
	    	get:function(){
	    		if(UIElement._LostTouchCaptureEvent === undefined){
	    			UIElement._LostTouchCaptureEvent  = Touch.LostTouchCaptureEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._LostTouchCaptureEvent;
	    	}   
	    },
        /// <summary> 
        ///     Alias to the Touch.TouchEnterEvent.
        /// </summary> 
        /*public static readonly RoutedEvent*/ TouchEnterEvent:
	    {
	    	get:function(){
	    		if(UIElement._TouchEnterEvent === undefined){
	    			UIElement._TouchEnterEvent = Touch.TouchEnterEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._TouchEnterEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Alias to the Touch.TouchLeaveEvent. 
        /// </summary>
        /*public static readonly RoutedEvent*/ TouchLeaveEvent:
	    {
	    	get:function(){
	    		if(UIElement._TouchLeaveEvent === undefined){
	    			UIElement._TouchLeaveEvent  = Touch.TouchLeaveEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._TouchLeaveEvent;
	    	}   
	    },  
        /// <summary>
        ///     The key needed set a read-only set:function(value)perty. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsMouseDirectlyOverPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseDirectlyOverPropertyKey === undefined){
	    			UIElement._IsMouseDirectlyOverPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsMouseDirectlyOver", 
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata( 
                                            false, // default value
                                            new PropertyChangedCallback(null, IsMouseDirectlyOver_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB( 
                                        false, // default value
                                        new PropertyChangedCallback(null, IsMouseDirectlyOver_Changed))); 
	    		}
	    		
	    		return UIElement._IsMouseDirectlyOverPropertyKey;
	    	}  
	    },

        /// <summary>
        ///     The dependency property for the IsMouseDirectlyOver property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsMouseDirectlyOverProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseDirectlyOverProperty === undefined){
	    			UIElement._IsMouseDirectlyOverProperty =
	    				UIElement.IsMouseDirectlyOverPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return UIElement._IsMouseDirectlyOverProperty;
	    	}  
	    },
        
        /// <summary> 
        ///     IsMouseDirectlyOverChanged private key
        /// </summary> 
//        internal static readonly EventPrivateKey 
        IsMouseDirectlyOverChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseDirectlyOverChangedKey === undefined){
	    			UIElement._IsMouseDirectlyOverChangedKey= new EventPrivateKey();  
	    		}
	    		
	    		return UIElement._IsMouseDirectlyOverChangedKey;
	    	}  
	    },
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsMouseOverPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseOverPropertyKey === undefined){
	    			UIElement._IsMouseOverPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsMouseOver", 
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false)); 
	    		}
	    		
	    		return UIElement._IsMouseOverPropertyKey;
	    	}  
	    },
 
        /// <summary>
        ///     The dependency property for the IsMouseOver property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsMouseOverProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseOverProperty === undefined){
	    			UIElement._IsMouseOverProperty = 
	    				UIElement.IsMouseOverPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return UIElement._IsMouseOverProperty;
	    	}  
	    },
 
        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        IsStylusOverPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusOverPropertyKey === undefined){
	    			UIElement._IsStylusOverPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsStylusOver",
                                Boolean.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));  
	    		}
	    		
	    		return UIElement._IsStylusOverPropertyKey;
	    	}  
	    },

        /// <summary> 
        ///     The dependency property for the IsStylusOver property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsStylusOverProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusOverProperty === undefined){
	    			UIElement._IsStylusOverProperty =
	    				UIElement.IsStylusOverPropertyKey.DependencyProperty;   
	    		}
	    		
	    		return UIElement._IsStylusOverProperty;
	    	}  
	    },

        /// <summary> 
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsKeyboardFocusWithinPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsKeyboardFocusWithinPropertyKey === undefined){
	    			UIElement._IsKeyboardFocusWithinPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "IsKeyboardFocusWithin",
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));  
	    		}
	    		
	    		return UIElement._IsKeyboardFocusWithinPropertyKey;
	    	}  
	    },
 
        /// <summary>
        ///     The dependency property for the IsKeyboardFocusWithin property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsKeyboardFocusWithinProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsKeyboardFocusWithinProperty === undefined){
	    			UIElement._IsKeyboardFocusWithinProperty =
	    				UIElement.IsKeyboardFocusWithinPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return UIElement._IsKeyboardFocusWithinProperty;
	    	}  
	    },
 
        /// <summary>
        ///     IsKeyboardFocusWithinChanged private key 
        /// </summary> 
//        internal static readonly EventPrivateKey 
        IsKeyboardFocusWithinChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsKeyboardFocusWithinChangedKey === undefined){
	    			UIElement._IsKeyboardFocusWithinChangedKey = new EventPrivateKey(); 
	    		}
	    		
	    		return UIElement._IsKeyboardFocusWithinChangedKey;
	    	}  
	    },
      /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsMouseCapturedPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseCapturedPropertyKey === undefined){
	    			UIElement._IsMouseCapturedPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "IsMouseCaptured",
                                Boolean.Type, 
                                UIElement.Type, 
                                /*new PropertyMetadata(
                                            false, // default value 
                                            new PropertyChangedCallback(IsMouseCaptured_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB(
                                        false, // default value 
                                        new PropertyChangedCallback(null, IsMouseCaptured_Changed))); 
	    		}
	    		
	    		return UIElement._IsMouseCapturedPropertyKey;
	    	}  
	    },

        /// <summary>
        ///     The dependency property for the IsMouseCaptured property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsMouseCapturedProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseCapturedProperty === undefined){
	    			UIElement._IsMouseCapturedProperty = 
	    				UIElement.IsMouseCapturedPropertyKey.DependencyProperty;   
	    		}
	    		
	    		return UIElement._IsMouseCapturedProperty;
	    	}  
	    },

        /// <summary>
        ///     IsMouseCapturedChanged private key 
        /// </summary> 
//        internal static readonly EventPrivateKey 
        IsMouseCapturedChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseCapturedChangedKey === undefined){
	    			UIElement._IsMouseCapturedChangedKey= new EventPrivateKey();  
	    		}
	    		
	    		return UIElement._IsMouseCapturedChangedKey;
	    	}  
	    },
        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsMouseCaptureWithinPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseCaptureWithinPropertyKey === undefined){
	    			UIElement._IsMouseCaptureWithinPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "IsMouseCaptureWithin",
                                Boolean.Type, 
                                UIElement.Type, 
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));  
	    		}
	    		
	    		return UIElement._IsMouseCaptureWithinPropertyKey;
	    	}  
	    },

        /// <summary>
        ///     The dependency property for the IsMouseCaptureWithin property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsMouseCaptureWithinProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseCaptureWithinProperty === undefined){
	    			UIElement._IsMouseCaptureWithinProperty =
	    				UIElement.IsMouseCaptureWithinPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return UIElement._IsMouseCaptureWithinProperty;
	    	}  
	    },
 
        /// <summary>
        ///     IsMouseCaptureWithinChanged private key 
        /// </summary>
//        internal static readonly EventPrivateKey 
        IsMouseCaptureWithinChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsMouseCaptureWithinChangedKey === undefined){
	    			UIElement._IsMouseCaptureWithinChangedKey= new EventPrivateKey();  
	    		}
	    		
	    		return UIElement._IsMouseCaptureWithinChangedKey;
	    	}  
	    },

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsStylusDirectlyOverPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusDirectlyOverPropertyKey === undefined){
	    			UIElement._IsStylusDirectlyOverPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsStylusDirectlyOver",
                                Boolean.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata(
                                            false, // default value
                                            new PropertyChangedCallback(IsStylusDirectlyOver_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB(
                                        false, // default value
                                        new PropertyChangedCallback(null, IsStylusDirectlyOver_Changed)));  
	    		}
	    		
	    		return UIElement._IsStylusDirectlyOverPropertyKey;
	    	}  
	    },

        /// <summary> 
        ///     The dependency property for the IsStylusDirectlyOver property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsStylusDirectlyOverProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusDirectlyOverProperty === undefined){
	    			UIElement._IsStylusDirectlyOverProperty = 
	    				UIElement.IsStylusDirectlyOverPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return UIElement._IsStylusDirectlyOverProperty;
	    	}  
	    },
        /// <summary>
        ///     IsStylusDirectlyOverChanged private key 
        /// </summary>
//        internal static readonly EventPrivateKey 
        IsStylusDirectlyOverChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusDirectlyOverChangedKey === undefined){
	    			UIElement._IsStylusDirectlyOverChangedKey= new EventPrivateKey();  
	    		}
	    		
	    		return UIElement._IsStylusDirectlyOverChangedKey;
	    	}  
	    },
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsStylusCapturedPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusCapturedPropertyKey === undefined){
	    			UIElement._IsStylusCapturedPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsStylusCaptured",
                                Boolean.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata(
                                            false, // default value
                                            new PropertyChangedCallback(IsStylusCaptured_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB(
                                        false, // default value
                                        new PropertyChangedCallback(null, IsStylusCaptured_Changed))); 
	    		}
	    		
	    		return UIElement._IsStylusCapturedPropertyKey;
	    	}  
	    },

        /// <summary> 
        ///     The dependency property for the IsStylusCaptured property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsStylusCapturedProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusCapturedProperty === undefined){
	    			UIElement._IsStylusCapturedProperty = 
	    				UIElement.IsStylusCapturedPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return UIElement._IsStylusCapturedProperty;
	    	}  
	    },

        /// <summary>
        ///     IsStylusCapturedChanged private key 
        /// </summary>
//        internal static readonly EventPrivateKey 
        IsStylusCapturedChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusCapturedChangedKey === undefined){
	    			UIElement._IsStylusCapturedChangedKey= new EventPrivateKey();  
	    		}
	    		
	    		return UIElement._IsStylusCapturedChangedKey;
	    	}  
	    },
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsStylusCaptureWithinPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusCaptureWithinPropertyKey === undefined){
	    			UIElement._IsStylusCaptureWithinPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsStylusCaptureWithin",
                                Boolean.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));  
	    		}
	    		
	    		return UIElement._IsStylusCaptureWithinPropertyKey;
	    	}  
	    },
        /// <summary>
        ///     The dependency property for the IsStylusCaptureWithin property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        IsStylusCaptureWithinProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusCaptureWithinProperty === undefined){
	    			UIElement._IsStylusCaptureWithinProperty =
	    				UIElement.IsStylusCaptureWithinPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return UIElement._IsStylusCaptureWithinProperty;
	    	}  
	    },

        /// <summary>
        ///     IsStylusCaptureWithinChanged private key
        /// </summary> 
//        internal static readonly EventPrivateKey 
        IsStylusCaptureWithinChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsStylusCaptureWithinChangedKey === undefined){
	    			UIElement._IsStylusCaptureWithinChangedKey = new EventPrivateKey(); 
	    		}
	    		
	    		return UIElement._IsStylusCaptureWithinChangedKey;
	    	}  
	    },
        /// <summary> 
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsKeyboardFocusedPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsKeyboardFocusedPropertyKey === undefined){
	    			UIElement._IsKeyboardFocusedPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "IsKeyboardFocused",
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata(
                                            false, // default value 
                                            new PropertyChangedCallback(IsKeyboardFocused_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB(
                                        false, // default value 
                                        new PropertyChangedCallback(null, IsKeyboardFocused_Changed)));  
	    		}
	    		
	    		return UIElement._IsKeyboardFocusedPropertyKey;
	    	}  
	    }, 

        /// <summary> 
        ///     The dependency property for the IsKeyboardFocused property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsKeyboardFocusedProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsKeyboardFocusedProperty === undefined){
	    			UIElement._IsKeyboardFocusedProperty =
	    				UIElement.IsKeyboardFocusedPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return UIElement._IsKeyboardFocusedProperty;
	    	}  
	    }, 

        /// <summary>
        ///     IsKeyboardFocusedChanged private key
        /// </summary> 
//        internal static readonly EventPrivateKey 
        IsKeyboardFocusedChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsKeyboardFocusedChangedKey === undefined){
	    			UIElement._IsKeyboardFocusedChangedKey = new EventPrivateKey();
	    		}
	    		
	    		return UIElement._IsKeyboardFocusedChangedKey;
	    	}  
	    }, 
        /// <summary> 
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        AreAnyTouchesDirectlyOverPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesDirectlyOverPropertyKey === undefined){
	    			UIElement._AreAnyTouchesDirectlyOverPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "AreAnyTouchesDirectlyOver",
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata( false)*/
                                PropertyMetadata.BuildWithDefaultValue(false)); 
	    		}
	    		
	    		return UIElement._AreAnyTouchesDirectlyOverPropertyKey;
	    	}  
	    }, 
 
        /// <summary>
        ///     The dependency property for the AreAnyTouchesDirectlyOver property. 
        /// </summary>
//        public static readonly DependencyProperty 
        AreAnyTouchesDirectlyOverProperty:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesDirectlyOverProperty === undefined){
	    			UIElement._AreAnyTouchesDirectlyOverProperty =
	    				UIElement.AreAnyTouchesDirectlyOverPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return UIElement._AreAnyTouchesDirectlyOverProperty;
	    	}  
	    }, 
 
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        AreAnyTouchesOverPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesOverPropertyKey === undefined){
	    			UIElement._AreAnyTouchesOverPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "AreAnyTouchesOver",
                                Boolean.Type,
                                UIElement.Type,
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));  
	    		}
	    		
	    		return UIElement._AreAnyTouchesOverPropertyKey;
	    	}  
	    },
 
        /// <summary> 
        ///     The dependency property for the AreAnyTouchesOver property.
        /// </summary> 
//        public static readonly DependencyProperty 
        AreAnyTouchesOverProperty:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesOverProperty === undefined){
	    			UIElement._AreAnyTouchesOverProperty =
	    	            AreAnyTouchesOverPropertyKey.DependencyProperty;  
	    		}
	    		
	    		return UIElement._AreAnyTouchesOverProperty;
	    	}  
	    },

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
//        internal static readonly DependencyPropertyKey 
        AreAnyTouchesCapturedPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesCapturedPropertyKey === undefined){
	    			UIElement._AreAnyTouchesCapturedPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "AreAnyTouchesCaptured", 
                                Boolean.Type,
                                UIElement.Type,
                                /*new PropertyMetadata(
                                            false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));   
	    		}
	    		
	    		return UIElement._AreAnyTouchesCapturedPropertyKey;
	    	}  
	    },

        /// <summary> 
        ///     The dependency property for the AreAnyTouchesCaptured property. 
        /// </summary>
//        public static readonly DependencyProperty 
        AreAnyTouchesCapturedProperty:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesCapturedProperty === undefined){
	    			UIElement._AreAnyTouchesCapturedProperty = 
	    				UIElement.AreAnyTouchesCapturedPropertyKey.DependencyProperty;
	    		}
	    		
	    		return UIElement._AreAnyTouchesCapturedProperty;
	    	}  
	    },

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        AreAnyTouchesCapturedWithinPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesCapturedWithinPropertyKey === undefined){
	    			UIElement._AreAnyTouchesCapturedWithinPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "AreAnyTouchesCapturedWithin",
                                Boolean.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata(
                                            false)*/
                                PropertyMetadata.BuildWithDefaultValue(false));
	    		}
	    		
	    		return UIElement._AreAnyTouchesCapturedWithinPropertyKey;
	    	}  
	    },
        /// <summary> 
        ///     The DependencyProperty for the AllowDrop property.
        /// </summary> 
//        public static readonly DependencyProperty 
        AllowDropProperty:
	    {
	    	get:function(){
	    		if(UIElement._AllowDropProperty === undefined){
	    			UIElement._AllowDropProperty =
                    DependencyProperty.Register(
                                "AllowDrop",
                                Boolean.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false)); 
	    		}
	    		
	    		return UIElement._AllowDropProperty;
	    	}  
	    },
        /// <summary>
        ///     The dependency property for the AreAnyTouchesCapturedWithin property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        AreAnyTouchesCapturedWithinProperty:
	    {
	    	get:function(){
	    		if(UIElement._AreAnyTouchesCapturedWithinProperty === undefined){
	    			UIElement._AreAnyTouchesCapturedWithinProperty =
	    				UIElement.AreAnyTouchesCapturedWithinPropertyKey.DependencyProperty; 
	    		}
	    		
	    		return UIElement._AreAnyTouchesCapturedWithinProperty;
	    	}  
	    },
        /// <summary>
        /// The RenderTransform dependency property. 
        /// </summary> 
        /// <seealso cref="UIElement.RenderTransform" />
//        public static readonly DependencyProperty 
        RenderTransformProperty:
	    {
	    	get:function(){
	    		if(UIElement._RenderTransformProperty === undefined){
	    			UIElement._RenderTransformProperty =
                    DependencyProperty.Register(
                                "RenderTransform",
                                Transform.Type, 
                                UIElement.Type,
                                /*new PropertyMetadata( 
                                            Transform.Identity, 
                                            new PropertyChangedCallback(RenderTransform_Changed))*/
                                UIPropertyMetadata.BuildWithDVandPCCB( 
                                        Transform.Identity, 
                                        new PropertyChangedCallback(null, RenderTransform_Changed)));
	    		}
	    		
	    		return UIElement._RenderTransformProperty;
	    	}  
	    },
        /// <summary> 
        /// The RenderTransformOrigin dependency property.
        /// </summary> 
        /// <seealso cref="UIElement.RenderTransformOrigin" /> 
//        public static readonly DependencyProperty 
        RenderTransformOriginProperty:
	    {
	    	get:function(){
	    		if(UIElement._RenderTransformOriginProperty === undefined){
	    			UIElement._RenderTransformOriginProperty =
                    DependencyProperty.Register( 
                                "RenderTransformOrigin",
                                Point.Type,
                                UIElement.Type,
                                /*new PropertyMetadata( 
                                            new Point(0,0),
                                            new PropertyChangedCallback(RenderTransformOrigin_Changed))*/
                                UIPropertyMetadata.BuildWithDVandPCCB( 
                                        new Point(0,0),
                                        new PropertyChangedCallback(null, RenderTransformOrigin_Changed)), 
                                new ValidateValueCallback(null, IsRenderTransformOriginValid)); 
	    		}
	    		
	    		return UIElement._RenderTransformOriginProperty;
	    	}  
	    },
        /// <summary> 
        ///     The Opacity property.
        /// </summary>
//        public static readonly DependencyProperty 
        OpacityProperty:
	    {
	    	get:function(){
	    		if(UIElement._OpacityProperty === undefined){
	    			UIElement._OpacityProperty =
                    DependencyProperty.Register( 
                                "Opacity",
                                Number.Type, 
                                UIElement.Type, 
                                /*new UIPropertyMetadata(
                                            1.0, 
                                            new PropertyChangedCallback(Opacity_Changed))*/
                                UIPropertyMetadata.BuildWithDVandPCCB(
                                        1.0, 
                                        new PropertyChangedCallback(null, Opacity_Changed)));
	    		}
	    		
	    		return UIElement._OpacityProperty;
	    	}  
	    },
        /// <summary>
        ///     The OpacityMask property.
        /// </summary> 
//        public static readonly DependencyProperty 
        OpacityMaskProperty:
	    {
	    	get:function(){
	    		if(UIElement._OpacityMaskProperty === undefined){
	    			UIElement._OpacityMaskProperty = DependencyProperty.Register("OpacityMask", 
	    					Brush.Type, UIElement.Type, 
                            /*new UIPropertyMetadata(new PropertyChangedCallback(OpacityMask_Changed))*/
	    					UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OpacityMask_Changed)));
	    		}
	    		
	    		return UIElement._OpacityMaskProperty;
	    	}  
	    },
            
        /// <summary> 
        ///     The BitmapEffect property.
        /// </summary> 
//        public static readonly DependencyProperty 
        BitmapEffectProperty:
	    {
	    	get:function(){
	    		if(UIElement._BitmapEffectProperty === undefined){
	    			UIElement._BitmapEffectProperty = 
	                    DependencyProperty.Register(
	                            "BitmapEffect", 
	                            BitmapEffect.Type,
	                            UIElement.Type,
	                            /*new UIPropertyMetadata(new PropertyChangedCallback(OnBitmapEffectChanged))*/
	                            UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnBitmapEffectChanged))
	                            );  
	    		}
	    		
	    		return UIElement._BitmapEffectProperty;
	    	}  
	    },
        /// <summary>
        ///     The Effect property.
        /// </summary> 
//        public static readonly DependencyProperty 
        EffectProperty:
	    {
	    	get:function(){
	    		if(UIElement._EffectProperty === undefined){
	    			UIElement._EffectProperty =
	                    DependencyProperty.Register( 
	                            "Effect", 
	                            Effect.Type,
	                            UIElement.Type, 
	                            /*new UIPropertyMetadata(new PropertyChangedCallback(OnEffectChanged))*/
	                            UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnEffectChanged))); 
	    		}
	    		
	    		return UIElement._EffectProperty;
	    	}  
	    },
      /// <summary>
        ///     The BitmapEffectInput property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        BitmapEffectInputProperty:
	    {
	    	get:function(){
	    		if(UIElement._BitmapEffectInputProperty === undefined){
	    			UIElement._BitmapEffectInputProperty =
	                    DependencyProperty.Register( 
	                            "BitmapEffectInput",
	                            BitmapEffectInput.Type,
	                            UIElement.Type,
	                            /*new UIPropertyMetadata(new PropertyChangedCallback(OnBitmapEffectInputChanged))*/
	                            UIPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnBitmapEffectInputChanged)));   
	    		}
	    		
	    		return UIElement._BitmapEffectInputProperty;
	    	}  
	    },
        /// <summary>
        ///     The CacheMode property.
        /// </summary>
//        public static readonly DependencyProperty 
        CacheModeProperty:
	    {
	    	get:function(){
	    		if(UIElement._CacheModeProperty === undefined){
	    			UIElement._CacheModeProperty = 
	                    DependencyProperty.Register(
	                            "CacheMode", 
	                            Number.Type, 
	                            UIElement.Type,
	                            /*new UIPropertyMetadata(new PropertyChangedCallback(OnCacheModeChanged))*/
	                            UIPropertyMetadata.BuildWithPCCB(
	                            		new PropertyChangedCallback(null, OnCacheModeChanged)));   
	    		}
	    		
	    		return UIElement._CacheModeProperty;
	    	}  
	    },
        /// <summary>
        /// Uid can be specified in xaml at any point using the xaml language attribute x:Uid. 
        /// This is a long lasting (persisted in source) unique id for an element.
        /// </summary> 
//        static public readonly DependencyProperty 
        UidProperty:
	    {
	    	get:function(){
	    		if(UIElement._UidProperty === undefined){
	    			UIElement._UidProperty = 
                    DependencyProperty.Register(
                                "Uid", 
                                String.Type,
                                UIElement.Type,
                                /*new UIPropertyMetadata(String.Empty)*/
                                UIPropertyMetadata.BuildWithDV(String.Empty));  
	    		}
	    		
	    		return UIElement._UidProperty;
	    	}  
	    },
 
        /// <summary> 
        ///     The Visibility property.
        /// </summary> 
//        public static readonly DependencyProperty 
        VisibilityProperty:
	    {
	    	get:function(){
	    		if(UIElement._VisibilityProperty === undefined){
	    			UIElement._VisibilityProperty =
	                    DependencyProperty.Register(
	                            "Visibility", 
	                            Number.Type,
	                            UIElement.Type, 
	                            /*new PropertyMetadata( 
	                                    VisibilityBoxes.VisibleBox,
	                                    new PropertyChangedCallback(OnVisibilityChanged))*/
	                            PropertyMetadata.BuildWithDVandPCB( 
	                                    Visibility.Visible,
	                                    new PropertyChangedCallback(null, OnVisibilityChanged)), 
	                            new ValidateValueCallback(null, ValidateVisibility)); 
	    		}
	    		
	    		return UIElement._VisibilityProperty;
	    	}  
	    },
    	/// <summary>
        /// ClipToBounds Property 
        /// </summary> 
//        public static readonly DependencyProperty 
        ClipToBoundsProperty:
	    {
	    	get:function(){
	    		if(UIElement._ClipToBoundsProperty === undefined){
	    			UIElement._ClipToBoundsProperty = 
                    DependencyProperty.Register(
                                "ClipToBounds",
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata(
                                        false, // default value 
                                        new PropertyChangedCallback(ClipToBounds_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB(
                                        false, // default value 
                                        new PropertyChangedCallback(null, ClipToBounds_Changed))); 
	    		}
	    		
	    		return UIElement._ClipToBoundsProperty;
	    	}  
	    },
      /// <summary>
        /// Clip Property
        /// </summary> 
//        public static readonly DependencyProperty 
        ClipProperty:
	    {
	    	get:function(){
	    		if(UIElement._ClipProperty === undefined){
	    			UIElement._ClipProperty =
                    DependencyProperty.Register( 
                                "Clip", 
                                Geometry.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata(
                                            null,
                                            new PropertyChangedCallback(Clip_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB(
                                        null,
                                        new PropertyChangedCallback(null, Clip_Changed))); 
	    		}
	    		
	    		return UIElement._ClipProperty;
	    	}  
	    },
        /// <summary> 
        /// Align Property
        /// </summary> 
//        public static readonly DependencyProperty 
        SnapsToDevicePixelsProperty:
	    {
	    	get:function(){
	    		if(UIElement._SnapsToDevicePixelsProperty === undefined){
	    			UIElement._SnapsToDevicePixelsProperty =
	                    DependencyProperty.Register(
	                            "SnapsToDevicePixels",
	                            Boolean.Type, 
	                            UIElement.Type,
	                            /*new PropertyMetadata( 
	                                    false, 
	                                    new PropertyChangedCallback(SnapsToDevicePixels_Changed))*/
	                            PropertyMetadata.BuildWithDVandPCB( 
	                                    false, 
	                                    new PropertyChangedCallback(null, SnapsToDevicePixels_Changed)));  
	    		}
	    		
	    		return UIElement._SnapsToDevicePixelsProperty;
	    	}  
	    },
        /// <summary> 
        ///     GotFocus event
        /// </summary> 
//        public static readonly RoutedEvent 
        GotFocusEvent:
	    {
	    	get:function(){
	    		if(UIElement._GotFocusEvent === undefined){
	    			UIElement._GotFocusEvent = FocusManager.GotFocusEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._GotFocusEvent;
	    	}  
	    },
    	
    	/// <summary>
        ///     LostFocus event 
        /// </summary>
//        public static readonly RoutedEvent 
        LostFocusEvent:
	    {
	    	get:function(){
	    		if(UIElement._LostFocusEvent === undefined){
	    			UIElement._LostFocusEvent = FocusManager.LostFocusEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._LostFocusEvent;
	    	}  
	    },
        /// <summary>
        ///     The DependencyProperty for the IsFocused property. 
        /// </summary>
//        internal static readonly DependencyPropertyKey 
        IsFocusedPropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsFocusedPropertyKey === undefined){
	    			UIElement._IsFocusedPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsFocused", 
                                Boolean.Type,
                                UIElement.Type, 
                                /*new PropertyMetadata( 
                                            false, // default value
                                            new PropertyChangedCallback(IsFocused_Changed))*/
                                PropertyMetadata.BuildWithDVandPCB( 
                                        false, // default value
                                        new PropertyChangedCallback(null, IsFocused_Changed))); 
	    		}
	    		
	    		return UIElement._IsFocusedPropertyKey;
	    	}  
	    },

        /// <summary>
        ///     The DependencyProperty for IsFocused.
        ///     Flags:              None 
        ///     Read-Only:          true
        /// </summary> 
//        public static readonly DependencyProperty 
        IsFocusedProperty:
	    {
	    	get:function(){
	    		return UIElement.IsFocusedPropertyKey.DependencyProperty;
	    	}  
	    }, 
          
        
      /// <summary> 
        ///     The DependencyProperty for the IsEnabled property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsEnabledProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsEnabledProperty === undefined){
	    			UIElement._IsEnabledProperty = 
                    DependencyProperty.Register(
                                "IsEnabled", 
                                Boolean.Type, 
                                UIElement.Type,
                                /*new UIPropertyMetadata( 
                                            true, // default value
                                            new PropertyChangedCallback(OnIsEnabledChanged),
                                            new CoerceValueCallback(CoerceIsEnabled))*/
                                UIPropertyMetadata.BuildWithDVandPCCBandCVCB( 
                                        true, // default value
                                        new PropertyChangedCallback(null, OnIsEnabledChanged),
                                        new CoerceValueCallback(null, CoerceIsEnabled))); 
	    		}
	    		
	    		return UIElement._IsEnabledProperty;
	    	}  
	    },
        
//        internal static readonly EventPrivateKey 
        IsEnabledChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsEnabledChangedKey === undefined){
	    			UIElement._IsEnabledChangedKey = new EventPrivateKey(); // Used by ContentElement
	    		}
	    		
	    		return UIElement._IsEnabledChangedKey;
	    	}  
	    },
        /// <summary>
        ///     The DependencyProperty for the IsHitTestVisible property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsHitTestVisibleProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsHitTestVisibleProperty === undefined){
	    			UIElement._IsHitTestVisibleProperty =
                    DependencyProperty.Register( 
                                "IsHitTestVisible", 
                                Boolean.Type,
                                UIElement.Type, 
                                /*new UIPropertyMetadata(
                                            true, // default value
                                            new PropertyChangedCallback(OnIsHitTestVisibleChanged),
                                            new CoerceValueCallback(CoerceIsHitTestVisible))*/
                                UIPropertyMetadata.BuildWithDVandPCCBandCVCB(true, // default value
                                        new PropertyChangedCallback(null, OnIsHitTestVisibleChanged),
                                        new CoerceValueCallback(null, CoerceIsHitTestVisible))); 
	    		}
	    		
	    		return UIElement._IsHitTestVisibleProperty;
	    	}  
	    }, 
        
//        internal static readonly EventPrivateKey 
        IsHitTestVisibleChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsHitTestVisibleChangedKey === undefined){
	    			UIElement._IsHitTestVisibleChangedKey = new EventPrivateKey(); // Used by ContentElement
	    		}
	    		
	    		return UIElement._IsHitTestVisibleChangedKey;
	    	}  
	    },
    	 // The IsVisible property is a read-only reflection of the Visibility 
        // property.
//        private static PropertyMetadata 
        _isVisibleMetadata:
	    {
	    	get:function(){
	    		if(UIElement.__isVisibleMetadata === undefined){
	    			UIElement.__isVisibleMetadata = new ReadOnlyPropertyMetadata(false,
                            new GetReadOnlyValueCallback(null, GetIsVisible),
                            new PropertyChangedCallback(null, OnIsVisibleChanged)); 
	    		}
	    		
	    		return UIElement.__isVisibleMetadata;
	    	}  
	    },

//        internal static readonly DependencyPropertyKey 
        IsVisiblePropertyKey:
	    {
	    	get:function(){
	    		if(UIElement._IsVisiblePropertyKey === undefined){
	    			UIElement._IsVisiblePropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsVisible",
                                Boolean.Type, 
                                UIElement.Type,
                                UIElement._isVisibleMetadata); 
	    		}
	    		
	    		return UIElement._IsVisiblePropertyKey;
	    	}  
	    },
        /// <summary>
        ///     The DependencyProperty for the Focusable property.
        /// </summary>
//        public static readonly DependencyProperty 
        FocusableProperty:
	    {
	    	get:function(){
	    		if(UIElement._FocusableProperty === undefined){
	    			UIElement._FocusableProperty =
	                    DependencyProperty.Register( 
	                            "Focusable", 
	                            Boolean.Type,
	                            UIElement.Type, 
	                            /*new UIPropertyMetadata(
	                                    false, // default value
	                                    new PropertyChangedCallback(OnFocusableChanged))*/
	                            UIPropertyMetadata.BuildWithDVandPCCB(
	                                    false, // default value
	                                    new PropertyChangedCallback(null, OnFocusableChanged))); 
	    		}
	    		
	    		return UIElement._FocusableProperty;
	    	}  
	    },
        /// <summary>
        ///     The dependency property for the IsManipulationEnabled property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsManipulationEnabledProperty:
	    {
	    	get:function(){
	    		if(UIElement._IsManipulationEnabledProperty === undefined){
	    			UIElement._IsManipulationEnabledProperty =
	    	            DependencyProperty.Register(
	    	                    "IsManipulationEnabled", 
	    	                    Boolean.Type,
	    	                    UIElement.Type, 
	    	                    /*new PropertyMetadata(false, new PropertyChangedCallback(OnIsManipulationEnabledChanged))*/
	    	                    PropertyMetadata.BuildWithDVandPCCB(false, new PropertyChangedCallback(null, OnIsManipulationEnabledChanged)));   
	    		}
	    		
	    		return UIElement._IsManipulationEnabledProperty;
	    	}  
	    },
        /// <summary> 
        ///     The DependencyProperty for the IsVisible property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsVisibleProperty:
	    {
	    	get:function(){
	    		return UIElement.IsVisiblePropertyKey.DependencyProperty; 
	    	}  
	    },
//        internal static readonly EventPrivateKey 
        IsVisibleChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._IsVisibleChangedKey === undefined){
	    			UIElement._IsVisibleChangedKey = new EventPrivateKey(); // Used by ContentElement
	    		}
	    		
	    		return UIElement._IsVisibleChangedKey;
	    	}  
	    },
//        internal static readonly EventPrivateKey 
        FocusableChangedKey:
	    {
	    	get:function(){
	    		if(UIElement._FocusableChangedKey === undefined){
	    			UIElement._FocusableChangedKey = new EventPrivateKey(); // Used by ContentElement  
	    		}
	    		
	    		return UIElement._FocusableChangedKey;
	    	}  
	    },
    	/// <summary> 
        ///     Indicates that a manipulation is about to start and allows for configuring its behavior.
        /// </summary>
//        public static readonly RoutedEvent 
        ManipulationStartingEvent:
	    {
	    	get:function(){
	    		if(UIElement._ManipulationStartingEvent === undefined){
	    			UIElement._ManipulationStartingEvent = Manipulation.ManipulationStartingEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._ManipulationStartingEvent;
	    	}   
	    }, 
        /// <summary> 
        ///     Indicates that a manipulation has started.
        /// </summary> 
//        public static readonly RoutedEvent 
        ManipulationStartedEvent:
	    {
	    	get:function(){
	    		if(UIElement._ManipulationStartedEvent === undefined){
	    			UIElement._ManipulationStartedEvent = Manipulation.ManipulationStartedEvent.AddOwner(UIElement.Type);  
	    		}
	    		
	    		return UIElement._ManipulationStartedEvent;
	    	}   
	    }, 
      /// <summary>
        ///     Provides data regarding changes to a currently occurring manipulation. 
        /// </summary> 
//        public static readonly RoutedEvent 
        ManipulationDeltaEvent:
	    {
	    	get:function(){
	    		if(UIElement._ManipulationDeltaEvent === undefined){
	    			UIElement._ManipulationDeltaEvent = Manipulation.ManipulationDeltaEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._ManipulationDeltaEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Allows a handler to customize the parameters of an inertia processor. 
        /// </summary>
//        public static readonly RoutedEvent 
        ManipulationInertiaStartingEvent:
	    {
	    	get:function(){
	    		if(UIElement._ManipulationInertiaStartingEvent === undefined){
	    			UIElement._ManipulationInertiaStartingEvent = Manipulation.ManipulationInertiaStartingEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._ManipulationInertiaStartingEvent;
	    	}   
	    },  
        /// <summary>
        ///     Indicates that a manipulation has completed. 
        /// </summary>
//        public static readonly RoutedEvent 
        ManipulationCompletedEvent:
	    {
	    	get:function(){
	    		if(UIElement._ManipulationCompletedEvent === undefined){
	    			UIElement._ManipulationCompletedEvent = Manipulation.ManipulationCompletedEvent.AddOwner(UIElement.Type);
	    		}
	    		
	    		return UIElement._ManipulationCompletedEvent;
	    	}   
	    }, 
        /// <summary>
        ///     Allows a handler to provide feedback when a manipulation has encountered a boundary.
        /// </summary>
//        public static readonly RoutedEvent 
        ManipulationBoundaryFeedbackEvent:
	    {
	    	get:function(){
	    		if(UIElement._ManipulationBoundaryFeedbackEvent === undefined){
	    			UIElement._ManipulationBoundaryFeedbackEvent = Manipulation.ManipulationBoundaryFeedbackEvent.AddOwner(UIElement.Type); 
	    		}
	    		
	    		return UIElement._ManipulationBoundaryFeedbackEvent;
	    	}   
	    }, 
	    
	    MouseOverProperty:{
	    	get:function(){
	    		if(UIElement._MouseOverProperty === undefined){
	    			UIElement._MouseOverProperty = new MouseOverProperty();
	    		}
	    		return UIElement._MouseOverProperty;
	    	}
	    },
	    
	    FocusWithinProperty:{
	    	get:function(){
	    		if(UIElement._FocusWithinProperty === undefined){
	    			UIElement._FocusWithinProperty = new FocusWithinProperty();
	    		}
	    		return UIElement._FocusWithinProperty;
	    	}
	    },

//        // Perf analysis showed we were not using these fields enough to warrant
//        // bloating each instance with the field, so storage is created on-demand 
//        // in the local store. 
//        internal static readonly UncommonField<EventHandlersStore> EventHandlersStoreField = new UncommonField/*<EventHandlersStore>*/();
//        internal static readonly UncommonField<InputBindingCollection> InputBindingCollectionField = new UncommonField/*<InputBindingCollection>*/(); 
//        internal static readonly UncommonField<CommandBindingCollection> CommandBindingCollectionField = new UncommonField/*<CommandBindingCollection>*/();
//        private  static readonly UncommonField<object> LayoutUpdatedListItemsField = new UncommonField/*<object>*/();
//        private  static readonly UncommonField<EventHandler> LayoutUpdatedHandlersField = new UncommonField/*<EventHandler>*/();
//        private  static readonly UncommonField<StylusPlugInCollection> StylusPlugInsField = new UncommonField/*<StylusPlugInCollection>*/(); 
//        internal static readonly FocusWithinProperty FocusWithinProperty = new FocusWithinProperty();
//        internal static readonly MouseOverProperty MouseOverProperty = new MouseOverProperty(); 
//        internal static readonly MouseCaptureWithinProperty MouseCaptureWithinProperty = new MouseCaptureWithinProperty();
//        internal static readonly StylusOverProperty StylusOverProperty = new StylusOverProperty();
//        internal static readonly StylusCaptureWithinProperty StylusCaptureWithinProperty = new StylusCaptureWithinProperty();
//        internal static readonly TouchesOverProperty TouchesOverProperty = new TouchesOverProperty(); 
//        internal static readonly TouchesCapturedWithinProperty TouchesCapturedWithinProperty = new TouchesCapturedWithinProperty();
    });
    
    /*private static void*/ function ClipToBounds_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement) d;
        d.ClipToBoundsCache = e.NewValue;

        //if never measured, then nothing to do, it should be measured at some point
        if(!d.NeverMeasured || !d.NeverArranged) 
        { 
            d.InvalidateArrange();
        } 
    }
    /*private static void*/ function Clip_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        UIElement uie = (UIElement) d; 

        // if never measured, then nothing to do, it should be measured at some point 
        if(!s.NeverMeasured || !s.NeverArranged)
        {
            s.InvalidateArrange();
        } 
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewMouseDownThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    {
        if(!e.Handled)
        { 
        	sender.OnPreviewMouseDown(e);
        } 

        // Always raise this "sub-event", but we pass along the handledness.
        CrackMouseButtonEventAndReRaiseEvent(sender, e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnMouseDownThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        if(!e.Handled) 
        {
            CommandManager.TranslateInput(/*(IInputElement)*/sender, e);
        }

        if(!e.Handled)
        { 
        	sender.OnMouseDown(e);
        }

        // Always raise this "sub-event", but we pass along the handledness.
        CrackMouseButtonEventAndReRaiseEvent(sender, e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewMouseUpThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
        if(!e.Handled)
        {
        	sender.OnPreviewMouseUp(e); 
        }

        // Always raise this "sub-event", but we pass along the handledness. 
        CrackMouseButtonEventAndReRaiseEvent(sender, e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnMouseUpThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    { 
        if(!e.Handled)
        { 
        	sender.OnMouseUp(e);
        }

        // Always raise this "sub-event", but we pass along the handledness. 
        CrackMouseButtonEventAndReRaiseEvent(sender, e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewMouseLeftButtonDownThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
    	sender.OnPreviewMouseLeftButtonDown(e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnMouseLeftButtonDownThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
    	sender.OnMouseLeftButtonDown(e);  
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewMouseLeftButtonUpThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
    	sender.OnPreviewMouseLeftButtonUp(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnMouseLeftButtonUpThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
    	sender.OnMouseLeftButtonUp(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewMouseRightButtonDownThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    {
    	sender.OnPreviewMouseRightButtonDown(e);  
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnMouseRightButtonDownThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    {
    	sender.OnMouseRightButtonDown(e); 
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewMouseRightButtonUpThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e) 
    { 
    	sender.OnPreviewMouseRightButtonUp(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnMouseRightButtonUpThunk(/*object*/ sender, /*MouseButtonEventArgs*/ e)
    { 
    	sender.OnMouseRightButtonUp(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewMouseMoveThunk(/*object*/ sender, /*MouseEventArgs*/ e)
    {
    	sender.OnPreviewMouseMove(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnMouseMoveThunk(/*object*/ sender, /*MouseEventArgs*/ e)
    { 
    	sender.OnMouseMove(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewMouseWheelThunk(/*object*/ sender, /*MouseWheelEventArgs*/ e)
    { 
    	sender.OnPreviewMouseWheel(e);  
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnMouseWheelThunk(/*object*/ sender, /*MouseWheelEventArgs*/ e) 
    {
    	sender.OnMouseWheel(e);  
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnMouseEnterThunk(/*object*/ sender, /*MouseEventArgs*/ e)
    { 
    	sender.OnMouseEnter(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnMouseLeaveThunk(/*object*/ sender, /*MouseEventArgs*/ e) 
    {
    	sender.OnMouseLeave(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnGotMouseCaptureThunk(/*object*/ sender, /*MouseEventArgs*/ e) 
    {
    	sender.OnGotMouseCapture(e); 
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnLostMouseCaptureThunk(/*object*/ sender, /*MouseEventArgs*/ e)
    {
    	sender.OnLostMouseCapture(e);  
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnQueryCursorThunk(/*object*/ sender, /*QueryCursorEventArgs*/ e) 
    {
    	sender.OnQueryCursor(e); 
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewStylusDownThunk(/*object*/ sender, /*StylusDownEventArgs*/ e) 
    { 
    	sender.OnPreviewStylusDown(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnStylusDownThunk(/*object*/ sender, /*StylusDownEventArgs*/ e)
    { 
    	sender.OnStylusDown(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewStylusUpThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    {
    	sender.OnPreviewStylusUp(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnStylusUpThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    { 
    	sender.OnStylusUp(e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewStylusMoveThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    { 
    	sender.OnPreviewStylusMove(e);  
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnStylusMoveThunk(/*object*/ sender, /*StylusEventArgs*/ e) 
    {
    	sender.OnStylusMove(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewStylusInAirMoveThunk(/*object*/ sender, /*StylusEventArgs*/ e) 
    {
    	sender.OnPreviewStylusInAirMove(e); 
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnStylusInAirMoveThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    {
    	sender.OnStylusInAirMove(e); 
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnStylusEnterThunk(/*object*/ sender, /*StylusEventArgs*/ e) 
    {
    	sender.OnStylusEnter(e); 
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnStylusLeaveThunk(/*object*/ sender, /*StylusEventArgs*/ e) 
    { 
    	sender.OnStylusLeave(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewStylusInRangeThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    { 
    	sender.OnPreviewStylusInRange(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnStylusInRangeThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    {
    	sender.OnStylusInRange(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewStylusOutOfRangeThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    { 
    	sender.OnPreviewStylusOutOfRange(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnStylusOutOfRangeThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    { 
    	sender.OnStylusOutOfRange(e);  
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewStylusSystemGestureThunk(/*object*/ sender, /*StylusSystemGestureEventArgs*/ e) 
    {
    	sender.OnPreviewStylusSystemGesture(e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnStylusSystemGestureThunk(/*object*/ sender, /*StylusSystemGestureEventArgs*/ e) 
    {
    	sender.OnStylusSystemGesture(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnGotStylusCaptureThunk(/*object*/ sender, /*StylusEventArgs*/ e)
    {
    	sender.OnGotStylusCapture(e);  
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnLostStylusCaptureThunk(/*object*/ sender, /*StylusEventArgs*/ e) 
    {
    	sender.OnLostStylusCapture(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnStylusButtonDownThunk(/*object*/ sender, /*StylusButtonEventArgs*/ e) 
    { 
    	sender.OnStylusButtonDown(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnStylusButtonUpThunk(/*object*/ sender, /*StylusButtonEventArgs*/ e)
    { 
    	sender.OnStylusButtonUp(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewStylusButtonDownThunk(/*object*/ sender, /*StylusButtonEventArgs*/ e)
    {
    	sender.OnPreviewStylusButtonDown(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewStylusButtonUpThunk(/*object*/ sender, /*StylusButtonEventArgs*/ e)
    { 
    	sender.OnPreviewStylusButtonUp(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewKeyDownThunk(/*object*/ sender, /*KeyEventArgs*/ e)
    { 
    	sender.OnPreviewKeyDown(e);  
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnKeyDownThunk(/*object*/ sender, /*KeyEventArgs*/ e) 
    {
        CommandManager.TranslateInput(/*(IInputElement)*/sender, e);
    	sender.OnKeyDown(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewKeyUpThunk(/*object*/ sender, /*KeyEventArgs*/ e)
    { 
    	sender.OnPreviewKeyUp(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnKeyUpThunk(/*object*/ sender, /*KeyEventArgs*/ e) 
    {
    	sender.OnKeyUp(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewGotKeyboardFocusThunk(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e) 
    {
    	sender.OnPreviewGotKeyboardFocus(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnGotKeyboardFocusThunk(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e)
    {
    	sender.OnGotKeyboardFocus(e); 
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewLostKeyboardFocusThunk(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e) 
    {
    	sender.OnPreviewLostKeyboardFocus(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnLostKeyboardFocusThunk(/*object*/ sender, /*KeyboardFocusChangedEventArgs*/ e) 
    { 
    	sender.OnLostKeyboardFocus(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewTextInputThunk(/*object*/ sender, /*TextCompositionEventArgs*/ e)
    { 
    	sender.OnPreviewTextInput(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnTextInputThunk(/*object*/ sender, /*TextCompositionEventArgs*/ e)
    {
    	sender.OnTextInput(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewExecutedThunk(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e)
    { 
//        Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

        // Command Manager will determine if preview or regular event. 
        CommandManager.OnExecuted(sender, e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnExecutedThunk(/*object*/ sender, /*ExecutedRoutedEventArgs*/ e) 
    { 
//        Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

        // Command Manager will determine if preview or regular event.
        CommandManager.OnExecuted(sender, e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewCanExecuteThunk(/*object*/ sender, /*CanExecuteRoutedEventArgs*/ e) 
    {
//        Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

        // Command Manager will determine if preview or regular event. 
        CommandManager.OnCanExecute(sender, e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnCanExecuteThunk(/*object*/ sender, /*CanExecuteRoutedEventArgs*/ e)
    { 
//        Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

        // Command Manager will determine if preview or regular event. 
        CommandManager.OnCanExecute(sender, e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnCommandDeviceThunk(/*object*/ sender, /*CommandDeviceEventArgs*/ e) 
    { 
//        Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

        // Command Manager will determine if preview or regular event.
        CommandManager.OnCommandDevice(sender, e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewQueryContinueDragThunk(/*object*/ sender, /*QueryContinueDragEventArgs*/ e) 
    {
    	sender.OnPreviewQueryContinueDrag(e); 
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnQueryContinueDragThunk(/*object*/ sender, /*QueryContinueDragEventArgs*/ e)
    {
//        Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

        sender.OnQueryContinueDrag(e); 
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewGiveFeedbackThunk(/*object*/ sender, /*GiveFeedbackEventArgs*/ e) 
    {
    	sender.OnPreviewGiveFeedback(e); 
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnGiveFeedbackThunk(/*object*/ sender, /*GiveFeedbackEventArgs*/ e) 
    { 
    	sender.OnGiveFeedback(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewDragEnterThunk(/*object*/ sender, /*DragEventArgs*/ e)
    { 
    	sender.OnPreviewDragEnter(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnDragEnterThunk(/*object*/ sender, /*DragEventArgs*/ e)
    {
    	sender.OnDragEnter(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewDragOverThunk(/*object*/ sender, /*DragEventArgs*/ e)
    { 
    	sender.OnPreviewDragOver(e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnDragOverThunk(/*object*/ sender, /*DragEventArgs*/ e)
    { 
    	sender.OnDragOver(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewDragLeaveThunk(/*object*/ sender, /*DragEventArgs*/ e) 
    {
    	sender.OnPreviewDragLeave(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnDragLeaveThunk(/*object*/ sender, /*DragEventArgs*/ e) 
    {
    	sender.OnDragLeave(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewDropThunk(/*object*/ sender, /*DragEventArgs*/ e)
    {
    	sender.OnPreviewDrop(e); 
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnDropThunk(/*object*/ sender, /*DragEventArgs*/ e) 
    {
    	sender.OnDrop(e); 
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnPreviewTouchDownThunk(/*object*/ sender, /*TouchEventArgs*/ e) 
    { 
    	sender.OnPreviewTouchDown(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnTouchDownThunk(/*object*/ sender, /*TouchEventArgs*/ e)
    { 
    	sender.OnTouchDown(e);
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnPreviewTouchMoveThunk(/*object*/ sender, /*TouchEventArgs*/ e)
    {
    	sender.OnPreviewTouchMove(e);
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnTouchMoveThunk(/*object*/ sender, /*TouchEventArgs*/ e)
    { 
    	sender.OnTouchMove(e);
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnPreviewTouchUpThunk(/*object*/ sender, /*TouchEventArgs*/ e)
    { 
    	sender.OnPreviewTouchUp(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote>
    /*private static void*/ function OnTouchUpThunk(/*object*/ sender, /*TouchEventArgs*/ e) 
    {
    	sender.OnTouchUp(e); 
    }

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input 
    /// </SecurityNote> 
    /*private static void*/ function OnGotTouchCaptureThunk(/*object*/ sender, /*TouchEventArgs*/ e) 
    {
    	sender.OnGotTouchCapture(e);
    }

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnLostTouchCaptureThunk(/*object*/ sender, /*TouchEventArgs*/ e)
    {
    	sender.OnLostTouchCapture(e); 
    } 

    /// <SecurityNote> 
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote>
    /*private static void*/ function OnTouchEnterThunk(/*object*/ sender, /*TouchEventArgs*/ e) 
    {
    	sender.OnTouchEnter(e); 
    } 

    /// <SecurityNote>
    ///     Critical: This code can be used to spoof input
    /// </SecurityNote> 
    /*private static void*/ function OnTouchLeaveThunk(/*object*/ sender, /*TouchEventArgs*/ e) 
    { 
    	sender.OnTouchLeave(e);
    }
    /*private static void*/ function IsMouseDirectlyOver_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.RaiseIsMouseDirectlyOverChanged(e);
    }
    /*private static void*/ function IsMouseCaptured_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.RaiseIsMouseCapturedChanged(e);
    }
    /*private static void*/ function IsStylusDirectlyOver_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.RaiseIsStylusDirectlyOverChanged(e);
    } 
    /*private static void*/ function IsStylusCaptured_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.RaiseIsStylusCapturedChanged(e);
    } 
    
    /*private static void*/ function IsKeyboardFocused_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.RaiseIsKeyboardFocusedChanged(e);
    } 
    /// <summary> 
    /// Recursively propagates IsLayoutSuspended flag down to the whole v's sub tree.
    /// </summary> 
//    internal static void 
    UIElement.PropagateSuspendLayout = function(/*Visual*/ v)
    {
        if(v.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot)) return;

        //the subtree is already suspended - happens when already suspended tree is further disassembled
        //no need to walk down in this case 
        if(v.CheckFlagsAnd(VisualFlags.IsLayoutSuspended)) return; 

        //  (bug # 1623922) assert that a UIElement has not being 
        //  removed from the visual tree while updating layout.
        if (    Invariant.Strict
            &&  v.CheckFlagsAnd(VisualFlags.IsUIElement)    )
        { 
            var e = /*(UIElement)*/v;
//            Invariant.Assert(!e.MeasureInProgress && !e.ArrangeInProgress); 
        } 

        v.SetFlags(true, VisualFlags.IsLayoutSuspended); 
        v.TreeLevel = 0;

        var count = v.InternalVisualChildrenCount;

        for (var i = 0; i < count; i++)
        { 
            /*Visual*/var cv = v.InternalGetVisualChild(i); 
            if (cv != null)
            { 
                PropagateSuspendLayout(cv);
            }
        }
    }; 

    /// <summary> 
    /// Recursively resets IsLayoutSuspended flag on all visuals of the whole v's sub tree. 
    /// For UIElements also re-inserts the UIElement into Measure and / or Arrange update queues
    /// if necessary. 
    /// </summary>
//    internal static void 
    UIElement.PropagateResumeLayout = function(/*Visual*/ parent, /*Visual*/ v)
    {
        if(v.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot)) return; 

        //the subtree is already active - happens when new elements are added to the active tree 
        //elements are created layout-active so they don't need to be specifically unsuspended 
        //no need to walk down in this case
        //if(!v.CheckFlagsAnd(VisualFlags.IsLayoutSuspended)) return; 

        //that can be true only on top of recursion, if suspended v is being connected to suspended parent.
        var parentIsSuspended = parent == null ? false : parent.CheckFlagsAnd(VisualFlags.IsLayoutSuspended);
        var parentTreeLevel   = parent == null ? 0     : parent.TreeLevel; 

        if(parentIsSuspended) return; 

        v.SetFlags(false, VisualFlags.IsLayoutSuspended);
        v.TreeLevel = parentTreeLevel + 1; 

        if (v.CheckFlagsAnd(VisualFlags.IsUIElement))
        {
            //  re-insert UIElement into the update queues 
            var  e = /*(UIElement)*/v;

//            Invariant.Assert(!e.MeasureInProgress && !e.ArrangeInProgress); 

            var requireMeasureUpdate = e.MeasureDirty && !e.NeverMeasured && (e.MeasureRequest == null); 
            var requireArrangeUpdate = e.ArrangeDirty && !e.NeverArranged && (e.ArrangeRequest == null);
            /*ContextLayoutManager*/var contextLayoutManager = (requireMeasureUpdate || requireArrangeUpdate)
                ? ContextLayoutManager.From(e.Dispatcher)
                : null; 

            if (requireMeasureUpdate) 
            { 
                contextLayoutManager.MeasureQueue.Add(e);
            } 

            if (requireArrangeUpdate)
            {
                contextLayoutManager.ArrangeQueue.Add(e); 
            }
        } 

        var count = v.InternalVisualChildrenCount;

        for (var i = 0; i < count; i++)
        {
            /*Visual*/var cv = v.InternalGetVisualChild(i);
            if (cv != null) 
            {
                PropagateResumeLayout(v, cv); 
            } 
        }
    }; 
    /// <summary>
    /// Rounds a size to integer values for layout purposes, compensating for high DPI screen coordinates. 
    /// </summary>
    /// <param name="size">Input size.</param>
    /// <param name="dpiScaleX">DPI along x-dimension.</param>
    /// <param name="dpiScaleY">DPI along y-dimension.</param> 
    /// <returns>Value of size that will be rounded under screen DPI.</returns>
    /// <remarks>This is a layout helper method. It takes DPI into account and also does not return 
    /// the rounded value if it is unacceptable for layout, e.g. Infinity or NaN. It's a helper associated with 
    /// UseLayoutRounding  property and should not be used as a general rounding utility.</remarks>
//    internal static Size 
    UIElement.RoundLayoutSize = function(/*Size*/ size, /*double*/ dpiScaleX, /*double*/ dpiScaleY) 
    {
        return new Size(RoundLayoutValue(size.Width, dpiScaleX), RoundLayoutValue(size.Height, dpiScaleY));
    };

    /// <summary>
    /// Calculates the value to be used for layout rounding at high DPI. 
    /// </summary> 
    /// <param name="value">Input value to be rounded.</param>
    /// <param name="dpiScale">Ratio of screen's DPI to layout DPI</param> 
    /// <returns>Adjusted value that will produce layout rounding on screen at high dpi.</returns>
    /// <remarks>This is a layout helper method. It takes DPI into account and also does not return
    /// the rounded value if it is unacceptable for layout, e.g. Infinity or NaN. It's a helper associated with
    /// UseLayoutRounding  property and should not be used as a general rounding utility.</remarks> 
//    internal static double 
    UIElement.RoundLayoutValue = function(/*double*/ value, /*double*/ dpiScale)
    { 
        var newValue; 

        // If DPI == 1, don't use DPI-aware rounding. 
        if (!DoubleUtil.AreClose(dpiScale, 1.0))
        {
            newValue = Math.Round(value * dpiScale) / dpiScale;
            // If rounding produces a value unacceptable to layout (NaN, Infinity or MaxValue), use the original value. 
            if (DoubleUtil.IsNaN(newValue) ||
                Double.IsInfinity(newValue) || 
                DoubleUtil.AreClose(newValue, Double.MaxValue)) 
            {
                newValue = value; 
            }
        }
        else
        { 
            newValue = Math.Round(value);
        } 

        return newValue;
    }; 
    
  /// <summary>
    /// Ensures that _dpiScaleX and _dpiScaleY are set. 
    /// </summary>
    /// <remarks> 
    /// Should be called before reading _dpiScaleX and _dpiScaleY 
    /// </remarks>
    /// <SecurityNote> 
    /// Critical - as this calls PresentationSource.CriticalFromVisual()
    ///            under elevation.
    /// Safe - as this doesn't expose the information retrieved from that API,
    ///        it only uses it for calculation of screen coordinates. 
    ///</SecurityNote>
    /*private static void*/ function EnsureDpiScale() 
    {
        if (this._setDpi) 
        {
        	this._setDpi = false;
            var dpiX, dpiY;
            var desktopWnd = new HandleRef(null, IntPtr.Zero); 

            // Win32Exception will get the Win32 error code so we don't have to 
            var dc = UnsafeNativeMethods.GetDC(desktopWnd);

            // Detecting error case from unmanaged call, required by PREsharp to throw a Win32Exception
            if (dc == IntPtr.Zero)
            { 
                throw new Win32Exception();
            } 

            try
            {
                dpiX = UnsafeNativeMethods.GetDeviceCaps(new HandleRef(null, dc), NativeMethods.LOGPIXELSX);
                dpiY = UnsafeNativeMethods.GetDeviceCaps(new HandleRef(null, dc), NativeMethods.LOGPIXELSY); 
                this._dpiScaleX = dpiX / 96.0;
                this._dpiScaleY = dpiY / 96.0; 
            } 
            finally
            { 
                UnsafeNativeMethods.ReleaseDC(desktopWnd, new HandleRef(null, dc));
            }
        }
    } 

    /// <summary>
    /// If layout rounding is in use, rounds the size and offset of a rect.
    /// </summary> 
    /// <param name="rect">Rect to be rounded.</param>
    /// <param name="dpiScaleX">DPI along x-dimension.</param> 
    /// <param name="dpiScaleY">DPI along y-dimension.</param> 
    /// <returns>Rounded rect.</returns>
    /// <remarks>This is a layout helper method. It takes DPI into account and also does not return 
    /// the rounded value if it is unacceptable for layout, e.g. Infinity or NaN. It's a helper associated with
    /// UseLayoutRounding  property and should not be used as a general rounding utility.</remarks>
//    internal static Rect 
    UIElement.RoundLayoutRect = function(/*Rect*/ rect, /*double*/ dpiScaleX, /*double*/ dpiScaleY)
    { 
        return new Rect(RoundLayoutValue(rect.X, dpiScaleX),
                        RoundLayoutValue(rect.Y, dpiScaleY), 
                        RoundLayoutValue(rect.Width, dpiScaleX), 
                        RoundLayoutValue(rect.Height, dpiScaleY)
                        ); 
    };
    //
    // Left/Right Mouse Button Cracking Routines: 
    // 
   /* private static RoutedEvent */
    function CrackMouseButtonEvent(/*MouseButtonEventArgs*/ e) 
    {
        var newEvent = null;

        switch(e.ChangedButton) 
        {
            case MouseButton.Left: 
                if(e.RoutedEvent == Mouse.PreviewMouseDownEvent) 
                    newEvent = UIElement.PreviewMouseLeftButtonDownEvent;
                else if(e.RoutedEvent == Mouse.MouseDownEvent) 
                    newEvent = UIElement.MouseLeftButtonDownEvent;
                else if(e.RoutedEvent == Mouse.PreviewMouseUpEvent)
                    newEvent = UIElement.PreviewMouseLeftButtonUpEvent;
                else 
                    newEvent = UIElement.MouseLeftButtonUpEvent;
                break; 
            case MouseButton.Right: 
                if(e.RoutedEvent == Mouse.PreviewMouseDownEvent)
                    newEvent = UIElement.PreviewMouseRightButtonDownEvent; 
                else if(e.RoutedEvent == Mouse.MouseDownEvent)
                    newEvent = UIElement.MouseRightButtonDownEvent;
                else if(e.RoutedEvent == Mouse.PreviewMouseUpEvent)
                    newEvent = UIElement.PreviewMouseRightButtonUpEvent; 
                else
                    newEvent = UIElement.MouseRightButtonUpEvent; 
                break; 
            default:
                // No wrappers exposed for the other buttons. 
                break;
        }
        return ( newEvent );
    } 

    /*private static void*/ function CrackMouseButtonEventAndReRaiseEvent(/*DependencyObject*/ sender, /*MouseButtonEventArgs*/ e) 
    { 
        /*RoutedEvent*/var newEvent = CrackMouseButtonEvent(e);

        if (newEvent != null)
        {
            ReRaiseEventAs(sender, e, newEvent);
        } 
    }

    /// <summary> 
    ///     Re-raises an event with as a different RoutedEvent.
    /// </summary> 
    /// <remarks>
    ///     Only used internally.  Added to support cracking generic MouseButtonDown/Up events
    ///     into MouseLeft/RightButtonDown/Up events.
    /// </remarks> 
    /// <param name="args">
    ///     RoutedEventsArgs to re-raise with a new RoutedEvent 
    /// </param> 
    /// <param name="newEvent">
    ///     The new RoutedEvent to be associated with the RoutedEventArgs 
    /// </param>
    /*private static void*/ function ReRaiseEventAs(/*DependencyObject*/ sender, /*RoutedEventArgs*/ args, /*RoutedEvent*/ newEvent)
    {
        // Preseve and change the RoutedEvent 
        var preservedRoutedEvent = args.RoutedEvent;
        args.OverrideRoutedEvent( newEvent ); 

        // Preserve Source
        var preservedSource = args.Source; 

        /*EventRoute*/var route = EventRouteFactory.FetchObject(args.RoutedEvent);

        // Build the route and invoke the handlers
        UIElement.BuildRouteHelper(sender, route, args); 

        route.ReInvokeHandlers(sender, args);

        // Restore Source 
        args.OverrideSource(preservedSource);

        // Restore RoutedEvent 
        args.OverrideRoutedEvent(preservedRoutedEvent);


        // Recycle the route object
        EventRouteFactory.RecycleObject(route); 
    }

    /// <summary>
    ///     Implementation of RaiseEvent. 
    ///     Called by both the trusted and non-trusted flavors of RaiseEvent.
    /// </summary> 
//    internal static void 
    UIElement.RaiseEventImpl = function(/*DependencyObject*/ sender, /*RoutedEventArgs*/ args) 
    {
        /*EventRoute*/var route = EventRouteFactory.FetchObject(args.RoutedEvent); 

        // Set Source 
        args.Source = sender; 

        UIElement.BuildRouteHelper(sender, route, args); 

        route.InvokeHandlers(sender, args);

        // Reset Source to OriginalSource 
        args.Source = args.OriginalSource;

        EventRouteFactory.RecycleObject(route); 
    };
    
    /*private static void*/ function Opacity_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement) d; 
        d.pushOpacity(); 
    }
    /*private static void*/ function OpacityMask_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement) d;
        d.pushOpacityMask();
    } 
    
    /*private static void*/ function OnBitmapEffectChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        UIElement uie = (UIElement)d; 
        d.pushBitmapEffect();
    } 
    /*private static void*/ function OnEffectChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        UIElement uie = (UIElement)d;
        d.pushEffect(); 
    } 
    /*private static void*/ function ClearTypeHint_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        UIElement uie = (UIElement) d;
        d.pushClearTypeHint(); 
    }
    
    /*private static void*/ function RenderTransform_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement)d; 

        //if never measured, then nothing to do, it should be measured at some point
        if(!d.NeverMeasured && !d.NeverArranged) 
        {
            // If the change is simply a subproperty change, there is no
            //  need to Arrange. (which combines RenderTransform with all the
            //  other transforms.) 
            if (!e.IsASubPropertyChange)
            { 
                d.InvalidateArrange(); 
                d.AreTransformsClean = false;
            } 
        }
    }
   /* private static bool */function IsRenderTransformOriginValid(/*object*/ value)
    {
//        Point v = (Point)value;
        return (    (!DoubleUtil.IsNaN(value.X) && !Double.IsPositiveInfinity(value.X) && !Double.IsNegativeInfinity(value.X)) 
                 && (!DoubleUtil.IsNaN(value.Y) && !Double.IsPositiveInfinity(value.Y) && !Double.IsNegativeInfinity(value.Y)));
    } 
    /*private static void*/ function RenderTransformOrigin_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        UIElement uie = (UIElement)d;

        //if never measured, then nothing to do, it should be measured at some point 
        if(!d.NeverMeasured && !d.NeverArranged)
        { 
            d.InvalidateArrange();
            d.AreTransformsClean = false;
        }
    }
//  internal static void 
    UIElement.BuildRouteHelper = function(/*DependencyObject*/ e, /*EventRoute*/ route, /*RoutedEventArgs*/ args)
    { 
        if (route == null) 
        {
            throw new ArgumentNullException("route"); 
        }

        if (args == null)
        { 
            throw new ArgumentNullException("args");
        } 

        if (args.Source == null)
        { 
            throw new ArgumentException(SR.Get(SRID.SourceNotSet));
        }

        if (args.RoutedEvent != route.RoutedEvent) 
        {
            throw new ArgumentException(SR.Get(SRID.Mismatched_RoutedEvent)); 
        } 

        // Route via visual tree 
        if (args.RoutedEvent.RoutingStrategy == RoutingStrategy.Direct)
        {
      	  e.AddToEventRoute(route, args);
        }
        else 
        {
            var cElements = 0; 

            while (e != null)
            { 
                // Protect against infinite loops by limiting the number of elements 
                // that we will process. 
                if (cElements++ > MAX_ELEMENTS_IN_ROUTE)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.TreeLoop));
                }

                // Allow the element to adjust source 
                /*object*/var newSource = e.AdjustEventSource(args);

                // Add changed source information to the route
                if (newSource != null)
                {
                    route.AddSource(newSource); 
                }

                // Invoke BuildRouteCore 
                var continuePastVisualTree = false;

                continuePastVisualTree = e.BuildRouteCore(route, args);

                // Add this element to route
                e.AddToEventRoute(route, args); 

                // Get element's visual parent 
                e = e.GetUIParent(continuePastVisualTree);
                

                // If the BuildRouteCore implementation changed the 
                // args.Source to the route parent, respect it in
                // the actual route. 
                if (e == args.Source) 
                {
                    route.AddSource(e); 
                }
            }
        }
    }; 
    
    /// <summary>
    ///     Adds a handler for the given attached event 
    /// </summary>
//    internal static void 
    UIElement.AddHandler = function(/*DependencyObject*/ d, /*RoutedEvent*/ routedEvent, /*Delegate*/ handler) 
    {
        if (d == null) 
        {
            throw new ArgumentNullException("d");
        }
        

//        Debug.Assert(routedEvent != null, "RoutedEvent must not be null");

//        var uiElement = d instanceof UIElement ? d : null; 
//        if (uiElement != null)
//        { 
//            uiElement.AddHandler(routedEvent, handler);
//        }
//        else
//        { 
//            var contentElement = d instanceof ContentElement ? d : null; 
//            if (contentElement != null) 
//            { 
//                contentElement.AddHandler(routedEvent, handler);
//            } 
//            else
//            {
//                var uiElement3D = d instanceof UIElement3D ? d: null;
//                if (uiElement3D != null) 
//                {
//                    uiElement3D.AddHandler(routedEvent, handler); 
//                } 
//                else
//                { 
//                    throw new ArgumentException(SR.Get(SRID.Invalid_IInputElement, d.GetType()));
//                }
//            }
//        } 
        d.AddHandler(routedEvent, handler);
    };

    /// <summary> 
    ///     Removes a handler for the given attached event
    /// </summary> 
//    internal static void 
    UIElement.RemoveHandler = function(/*DependencyObject*/ d, /*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
    {
        if (d == null) 
        {
            throw new ArgumentNullException("d"); 
        } 

//        Debug.Assert(routedEvent != null, "RoutedEvent must not be null"); 

        var uiElement = d instanceof UIElement ? d : null;
        if (uiElement != null)
        { 
            uiElement.RemoveHandler(routedEvent, handler);
        } 
        else 
        {
            var contentElement = d instanceof ContentElement ? d : null; 
            if (contentElement != null)
            {
                contentElement.RemoveHandler(routedEvent, handler);
            } 
//            else
//            { 
//                UIElement3D uiElement3D = d as UIElement3D; 
//                if (uiElement3D != null)
//                { 
//                    uiElement3D.RemoveHandler(routedEvent, handler);
//                }
//                else
//                { 
//                    throw new ArgumentException(SR.Get(SRID.Invalid_IInputElement, d.GetType()));
//                } 
//            } 
        }
    };
    
    /*private static void*/ function OnBitmapEffectInputChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.pushBitmapEffectInput(/*(BitmapEffectInput)*/ e.NewValue);
    } 

    /*private static void*/ function EdgeMode_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        UIElement uie = (UIElement) d; 
        d.pushEdgeMode();
    } 
    /*private static void*/ function BitmapScalingMode_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement) d; 
        d.pushBitmapScalingMode(); 
    }
    /*private static void*/ function TextHintingMode_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        UIElement uie = (UIElement) d;
        d.pushTextHintingMode();
    }
    /*private static void*/ function OnCacheModeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        UIElement uie = (UIElement)d; 
        d.pushCacheMode();
    }
    /*private static void*/ function OnVisibilityChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        UIElement uie = (UIElement) d;

        /*Visibility*/var newVisibility = e.NewValue; 
        d.VisibilityCache = newVisibility;
        d.switchVisibilityIfNeeded(newVisibility); 

        // The IsVisible property depends on this property.
        d.UpdateIsVisibleCache();
        
        //cym add
        if(newVisibility == Visibility.Collapsed){
        	d._dom.setAttribute("hidden", "hidden");
        }else{
        	d._dom.removeAttribute("hidden");
        	
        }
    } 

    /*private static bool*/function ValidateVisibility(/*object*/ o) 
    { 
//        Visibility value = (Visibility) o;
        return (o == Visibility.Visible) || (o == Visibility.Hidden) || (o == Visibility.Collapsed); 
    }
    
    /*private static void*/ function SnapsToDevicePixels_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        UIElement uie = (UIElement) d;
        d.SnapsToDevicePixelsCache = e.NewValue; 

        // if never measured, then nothing to do, it should be measured at some point 
        if(!d.NeverMeasured || !d.NeverArranged) 
        {
            d.InvalidateArrange(); 
        }
    }
    /*private static void*/ function IsFocused_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        UIElement uiElement = ((UIElement)d);

        if (e.NewValue)
        { 
            d.OnGotFocus(new RoutedEventArgs(UIElement.GotFocusEvent, d)); 
        }
        else 
        {
            d.OnLostFocus(new RoutedEventArgs(UIElement.LostFocusEvent, d));
        }
    } 
    /*private static object*/function CoerceIsEnabled(/*DependencyObject*/ d, /*object*/ value)
    {
//        UIElement uie = (UIElement) d; 

        // We must be false if our parent is false, but we can be 
        // either true or false if our parent is true. 
        //
        // Another way of saying this is that we can only be true 
        // if our parent is true, but we can always be false.
        if( value)
        {
            // Our parent can constrain us.  We can be plugged into either 
            // a "visual" or "content" tree.  If we are plugged into a
            // "content" tree, the visual tree is just considered a 
            // visual representation, and is normally composed of raw 
            // visuals, not UIElements, so we prefer the content tree.
            // 
            // The content tree uses the "logical" links.  But not all
            // "logical" links lead to a content tree.
            //
            /*DependencyObject*/var parent = d.GetUIParentCore();
            parent = parent instanceof ContentElement ? parent : null; 
            if(parent == null)
            { 
                parent = InputElement.GetContainingUIElement(d._parent); 
            }

            if(parent == null || parent.GetValue(UIElement.IsEnabledProperty))
            {
                return d.IsEnabledCore;
            } 
            else
            { 
                return false; 
            }
        } 
        else
        {
            return false;
        } 
    }
    /*private static void*/ function OnIsEnabledChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement)d; 

        // Raise the public changed event.
        d.RaiseDependencyPropertyChanged(UIElement.IsEnabledChangedKey, e);

        // Invalidate the children so that they will inherit the new value.
        UIElement.InvalidateForceInheritPropertyOnChildren(d, e.Property); 

        // The input manager needs to re-hittest because something changed
        // that is involved in the hit-testing we do, so a different result 
        // could be returned.
        InputManager.SafeCurrentNotifyHitTestInvalidated();

//        //Notify Automation in case it is interested. 
//        AutomationPeer peer = uie.GetAutomationPeer();
//        if(peer != null) 
//            peer.InvalidatePeer(); 

    }
   /* private static object*/function CoerceIsHitTestVisible(/*DependencyObject*/ d, /*object*/ value) 
    {
//        UIElement uie = (UIElement) d; 

        // We must be false if our parent is false, but we can be
        // either true or false if our parent is true.
        // 
        // Another way of saying this is that we can only be true
        // if our parent is true, but we can always be false. 
        if( value) 
        {
            // Our parent can constrain us.  We can be plugged into either 
            // a "visual" or "content" tree.  If we are plugged into a
            // "content" tree, the visual tree is just considered a
            // visual representation, and is normally composed of raw
            // visuals, not UIElements, so we prefer the content tree. 
            //
            // The content tree uses the "logical" links.  But not all 
            // "logical" links lead to a content tree. 
            //
            // However, ContentElements don't understand IsHitTestVisible, 
            // so we ignore them.
            //
            /*DependencyObject*/var parent = InputElement.GetContainingUIElement(uie._parent);

            if (parent == null || UIElementHelper.IsHitTestVisible(parent))
            { 
                return true; 
            }
            else 
            {
                return false;
            }
        } 
        else
        { 
            return false; 
        }
    } 

    /*private static void*/ function OnIsHitTestVisibleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
//        UIElement uie = (UIElement)d; 

        // Raise the public changed event. 
        d.RaiseDependencyPropertyChanged(UIElement.IsHitTestVisibleChangedKey, e); 

        // Invalidate the children so that they will inherit the new value. 
        UIElement.InvalidateForceInheritPropertyOnChildren(d, e.Property);

        // The input manager needs to re-hittest because something changed
        // that is involved in the hit-testing we do, so a different result 
        // could be returned.
        InputManager.SafeCurrentNotifyHitTestInvalidated(); 
    } 
    
    /*private static object*/ function GetIsVisible(/*DependencyObject*/ d, /*out BaseValueSourceInternal source*/sourceOut) 
    {
        sourceOut.source = BaseValueSourceInternal.Local; 
        return d.IsVisible ? true : false;
    }
    
    /*private static void*/ function OnIsVisibleChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        UIElement uie = (UIElement) d; 

        // Raise the public changed event.
        d.RaiseDependencyPropertyChanged(UIElement.IsVisibleChangedKey, e); 

        // Invalidate the children so that they will inherit the new value.
        UIElement.InvalidateForceInheritPropertyOnChildren(d, e.Property);

        // The input manager needs to re-hittest because something changed
        // that is involved in the hit-testing we do, so a different result 
        // could be returned. 
        InputManager.SafeCurrentNotifyHitTestInvalidated();
        
    } 
    
    /*private static void*/ function OnFocusableChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
//        UIElement uie = (UIElement) d;

        // Raise the public changed event.
        d.RaiseDependencyPropertyChanged(UIElement.FocusableChangedKey, e);
    }
    
    // Also called by FrameworkContentElement 
    //  internal static void 
    UIElement.SynchronizeForceInheritProperties = function(
    	/*UIElement*/        uiElement, 
    	/*ContentElement*/   contentElement, 
    	/*UIElement3D*/      uiElement3D,
    	/*DependencyObject*/ parent) 
	{
    	if(uiElement != null || uiElement3D != null)
    	{
    		var parentValue = parent.GetValue(UIElement.IsEnabledProperty); 
    		if(!parentValue)
    		{ 
    			// For Read/Write force-inherited properties, use the standard coersion pattern. 
    			//
    			// The IsEnabled property must be coerced false if the parent is false. 
    			if (uiElement != null)
    			{
    				uiElement.CoerceValue(UIElement.IsEnabledProperty);
    			} 
    			else
    			{ 
    				uiElement3D.CoerceValue(UIElement.IsEnabledProperty); 
    			}
    		} 

    		parentValue =  parent.GetValue(UIElement.IsVisibleProperty); 
    		if(parentValue)
    		{
    			// For Read-Only force-inherited properties, use a private update method.
    			// 
    			// The IsVisible property can only be true if the parent is true.
    			if (uiElement != null) 
    			{ 
    				uiElement.UpdateIsVisibleCache();
    			} 
    			else
    			{
    				uiElement3D.UpdateIsVisibleCache();
    			} 
    		}
    	} 
    	else if(contentElement != null) 
    	{
    		var parentValue =  parent.GetValue(UIElement.IsEnabledProperty); 
    		if(!parentValue)
    		{
    			// The IsEnabled property must be coerced false if the parent is false.
    			contentElement.CoerceValue(UIElement.IsEnabledProperty); 
    		}
    	} 
  	};

    // This is called from the force-inherit property changed events. 
//    internal static void 
    UIElement.InvalidateForceInheritPropertyOnChildren = function(/*Visual*/ v, /*DependencyProperty*/ property)
    {
//    	int cChildren = v.InternalVisual2DOr3DChildrenCount;
//        for (int iChild = 0; iChild < cChildren; iChild++) 
//        {
//            DependencyObject child = v.InternalGet2DOr3DVisualChild(iChild); 
//
//            Visual vChild = child as Visual;
//            if (vChild != null) 
//            {
//                UIElement element = vChild as UIElement;
//
//                if (element != null) 
//                {
//                    if(property == IsVisibleProperty) 
//                    { 
//                        // For Read-Only force-inherited properties, use
//                        // a private update method. 
//                        element.UpdateIsVisibleCache();
//                    }
//                    else
//                    { 
//                        // For Read/Write force-inherited properties, use
//                        // the standard coersion pattern. 
//                        element.CoerceValue(property); 
//                    }
//                } 
//                else
//                {
//                    // We have to "walk through" non-UIElement visuals.
//                    InvalidateForceInheritPropertyOnChildren(vChild, property); 
//                }
//            } 
//            else 
//            {
//                Visual3D v3DChild = child as Visual3D; 
//
//                if (v3DChild != null)
//                {
//                    UIElement3D element3D = v3DChild as UIElement3D; 
//
//                    if(element3D != null) 
//                    { 
//                        if(property == IsVisibleProperty)
//                        { 
//                            // For Read-Only force-inherited properties, use
//                            // a private update method.
//                            element3D.UpdateIsVisibleCache();
//                        } 
//                        else
//                        { 
//                            // For Read/Write force-inherited properties, use 
//                            // the standard coersion pattern.
//                            element3D.CoerceValue(property); 
//                        }
//                    }
//                    else
//                    { 
//                        // We have to "walk through" non-UIElement visuals.
//                        UIElement3D.InvalidateForceInheritPropertyOnChildren(v3DChild, property); 
//                    } 
//                }
//            } 
//        }
    	
        var cChildren = v.InternalVisual2DOr3DChildrenCount;
        for (var iChild = 0; iChild < cChildren; iChild++) 
        {
            /*DependencyObject*/var child = v.InternalGet2DOr3DVisualChild(iChild); 

            /*Visual*/var vChild = child instanceof Visual ? child : null;
            if (vChild != null) 
            {
                /*UIElement*/var element = vChild instanceof UIElement ? vChild : null;

                if (element != null) 
                {
                    if(property == UIElement.IsVisibleProperty) 
                    { 
                        // For Read-Only force-inherited properties, use
                        // a private update method. 
                        element.UpdateIsVisibleCache();
                    }
                    else
                    { 
                        // For Read/Write force-inherited properties, use
                        // the standard coersion pattern. 
                        element.CoerceValue(property); 
                    }
                } 
                else
                {
                    // We have to "walk through" non-UIElement visuals.
                	UIElement.InvalidateForceInheritPropertyOnChildren(vChild, property); 
                }
            } 
        }
    };
    
    /*private static void*/ 
    function OnIsManipulationEnabledChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        if (e.NewValue)
        { 
            d.CoerceStylusProperties(); 
        }
        else 
        {
            Manipulation.TryCompleteManipulation(d);
        }
    } 
//  private static bool 
    function IsDefaultValue(/*DependencyObject*/ dependencyObject, /*DependencyProperty*/ dependencyProperty)
    {
    	var parObj = {
    		"hasModifiers": null,
    		"isExpression": null,
    		"isAnimated": null,
    		"isCoerced": null,
    		"isCurrent": null
    	};
        /*BaseValueSourceInternal*/var source = 
        	dependencyObject.GetValueSource(dependencyProperty, null, parObj
        			/*out hasModifiers, out isExpression, out isAnimated, out isCoerced, out isCurrent*/);
        
        /*bool*/var hasModifiers = parObj.hasModifiers, isExpression= parObj.isExpression, isAnimated = parObj.isAnimated, 
        isCoerced = parObj.isCoerced, isCurrent = parObj.isCurrent; 
        return (source == BaseValueSourceInternal.Default) && !isExpression && !isAnimated && !isCoerced; 
    }
    
    /*private static void*/ function OnManipulationStartingThunk(/*object*/ sender, /*ManipulationStartingEventArgs*/ e) 
    { 
        sender.OnManipulationStarting(e);
    } 
    /*private static void*/ function OnManipulationStartedThunk(/*object*/ sender, /*ManipulationStartedEventArgs*/ e) 
    {
        sender.OnManipulationStarted(e); 
    } 
    /*private static void*/ function OnManipulationDeltaThunk(/*object*/ sender, /*ManipulationDeltaEventArgs*/ e)
    {
        sender.OnManipulationDelta(e); 
    }
    /*private static void*/ function OnManipulationInertiaStartingThunk(/*object*/ sender, /*ManipulationInertiaStartingEventArgs*/ e) 
    {
        sender.OnManipulationInertiaStarting(e);
    }

    /*private static void*/ function OnManipulationBoundaryFeedbackThunk(/*object*/ sender, /*ManipulationBoundaryFeedbackEventArgs*/ e) 
    {
        sender.OnManipulationBoundaryFeedback(e); 
    }
    
    /*private static void*/function OnManipulationCompletedThunk(/*object*/ sender, /*ManipulationCompletedEventArgs*/ e)
    { 
        sender.OnManipulationCompleted(e); 
    }
    
    /// Used by UIElement, ContentElement, and UIElement3D to register common Events.
    ///  Critical: This code is used to register various thunks that are used to send input to the tree 
    ///  TreatAsSafe: This code attaches handlers that are inside the class and private. Not configurable or overridable 
//    internal static void 
    UIElement.RegisterEvents = function(/*Type*/ type)
    {
        EventManager.RegisterClassHandler(type, Mouse.PreviewMouseDownEvent, new MouseButtonEventHandler(null, OnPreviewMouseDownThunk), true);
        EventManager.RegisterClassHandler(type, Mouse.MouseDownEvent, new MouseButtonEventHandler(null, OnMouseDownThunk), true); 
        EventManager.RegisterClassHandler(type, Mouse.PreviewMouseUpEvent, new MouseButtonEventHandler(null, OnPreviewMouseUpThunk), true);
        EventManager.RegisterClassHandler(type, Mouse.MouseUpEvent, new MouseButtonEventHandler(null, OnMouseUpThunk), true); 
        EventManager.RegisterClassHandler(type, UIElement.PreviewMouseLeftButtonDownEvent, new MouseButtonEventHandler(null, OnPreviewMouseLeftButtonDownThunk), false); 
        EventManager.RegisterClassHandler(type, UIElement.MouseLeftButtonDownEvent, new MouseButtonEventHandler(null, OnMouseLeftButtonDownThunk), false);
        EventManager.RegisterClassHandler(type, UIElement.PreviewMouseLeftButtonUpEvent, new MouseButtonEventHandler(null, OnPreviewMouseLeftButtonUpThunk), false); 
        EventManager.RegisterClassHandler(type, UIElement.MouseLeftButtonUpEvent, new MouseButtonEventHandler(null, OnMouseLeftButtonUpThunk), false);
        EventManager.RegisterClassHandler(type, UIElement.PreviewMouseRightButtonDownEvent, new MouseButtonEventHandler(null, OnPreviewMouseRightButtonDownThunk), false);
        EventManager.RegisterClassHandler(type, UIElement.MouseRightButtonDownEvent, new MouseButtonEventHandler(null, OnMouseRightButtonDownThunk), false);
        EventManager.RegisterClassHandler(type, UIElement.PreviewMouseRightButtonUpEvent, new MouseButtonEventHandler(null, OnPreviewMouseRightButtonUpThunk), false); 
        EventManager.RegisterClassHandler(type, UIElement.MouseRightButtonUpEvent, new MouseButtonEventHandler(null, OnMouseRightButtonUpThunk), false);
        EventManager.RegisterClassHandler(type, Mouse.PreviewMouseMoveEvent, new MouseEventHandler(null, OnPreviewMouseMoveThunk), false); 
        EventManager.RegisterClassHandler(type, Mouse.MouseMoveEvent, new MouseEventHandler(null, OnMouseMoveThunk), false); 
        EventManager.RegisterClassHandler(type, Mouse.PreviewMouseWheelEvent, new MouseWheelEventHandler(null, OnPreviewMouseWheelThunk), false);
        EventManager.RegisterClassHandler(type, Mouse.MouseWheelEvent, new MouseWheelEventHandler(null, OnMouseWheelThunk), false); 
        EventManager.RegisterClassHandler(type, Mouse.MouseEnterEvent, new MouseEventHandler(null, OnMouseEnterThunk), false);
        EventManager.RegisterClassHandler(type, Mouse.MouseLeaveEvent, new MouseEventHandler(null, OnMouseLeaveThunk), false);
        EventManager.RegisterClassHandler(type, Mouse.GotMouseCaptureEvent, new MouseEventHandler(null, OnGotMouseCaptureThunk), false);
        EventManager.RegisterClassHandler(type, Mouse.LostMouseCaptureEvent, new MouseEventHandler(null, OnLostMouseCaptureThunk), false); 
        EventManager.RegisterClassHandler(type, Mouse.QueryCursorEvent, new QueryCursorEventHandler(null, OnQueryCursorThunk), false);
        EventManager.RegisterClassHandler(type, Keyboard.PreviewKeyDownEvent, new KeyEventHandler(null, OnPreviewKeyDownThunk), false);
        EventManager.RegisterClassHandler(type, Keyboard.KeyDownEvent, new KeyEventHandler(null, OnKeyDownThunk), false);
        EventManager.RegisterClassHandler(type, Keyboard.PreviewKeyUpEvent, new KeyEventHandler(null, OnPreviewKeyUpThunk), false);
        EventManager.RegisterClassHandler(type, Keyboard.KeyUpEvent, new KeyEventHandler(null, OnKeyUpThunk), false); 
        EventManager.RegisterClassHandler(type, Keyboard.PreviewGotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnPreviewGotKeyboardFocusThunk), false);
        EventManager.RegisterClassHandler(type, Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnGotKeyboardFocusThunk), false); 
        EventManager.RegisterClassHandler(type, Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnPreviewLostKeyboardFocusThunk), false); 
        EventManager.RegisterClassHandler(type, Keyboard.LostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(null, OnLostKeyboardFocusThunk), false);
//        EventManager.RegisterClassHandler(type, TextCompositionManager.PreviewTextInputEvent, new TextCompositionEventHandler(null, OnPreviewTextInputThunk), false); 
//        EventManager.RegisterClassHandler(type, TextCompositionManager.TextInputEvent, new TextCompositionEventHandler(null, OnTextInputThunk), false);
        EventManager.RegisterClassHandler(type, CommandManager.PreviewExecutedEvent, new ExecutedRoutedEventHandler(null, OnPreviewExecutedThunk), false);
        EventManager.RegisterClassHandler(type, CommandManager.ExecutedEvent, new ExecutedRoutedEventHandler(null, OnExecutedThunk), false);
        EventManager.RegisterClassHandler(type, CommandManager.PreviewCanExecuteEvent, new CanExecuteRoutedEventHandler(null, OnPreviewCanExecuteThunk), false); 
        EventManager.RegisterClassHandler(type, CommandManager.CanExecuteEvent, new CanExecuteRoutedEventHandler(null, OnCanExecuteThunk), false);
//        EventManager.RegisterClassHandler(type, CommandDevice.CommandDeviceEvent, new CommandDeviceEventHandler(null, OnCommandDeviceThunk), false); 
//        EventManager.RegisterClassHandler(type, DragDrop.PreviewQueryContinueDragEvent, new QueryContinueDragEventHandler(null, OnPreviewQueryContinueDragThunk), false); 
//        EventManager.RegisterClassHandler(type, DragDrop.QueryContinueDragEvent, new QueryContinueDragEventHandler(null, OnQueryContinueDragThunk), false);
//        EventManager.RegisterClassHandler(type, DragDrop.PreviewGiveFeedbackEvent, new GiveFeedbackEventHandler(null, OnPreviewGiveFeedbackThunk), false); 
//        EventManager.RegisterClassHandler(type, DragDrop.GiveFeedbackEvent, new GiveFeedbackEventHandler(null, OnGiveFeedbackThunk), false);
//        EventManager.RegisterClassHandler(type, DragDrop.PreviewDragEnterEvent, new DragEventHandler(null, OnPreviewDragEnterThunk), false);
//        EventManager.RegisterClassHandler(type, DragDrop.DragEnterEvent, new DragEventHandler(null, OnDragEnterThunk), false);
//        EventManager.RegisterClassHandler(type, DragDrop.PreviewDragOverEvent, new DragEventHandler(null, OnPreviewDragOverThunk), false); 
//        EventManager.RegisterClassHandler(type, DragDrop.DragOverEvent, new DragEventHandler(null, OnDragOverThunk), false);
//        EventManager.RegisterClassHandler(type, DragDrop.PreviewDragLeaveEvent, new DragEventHandler(null, OnPreviewDragLeaveThunk), false); 
//        EventManager.RegisterClassHandler(type, DragDrop.DragLeaveEvent, new DragEventHandler(null, OnDragLeaveThunk), false); 
//        EventManager.RegisterClassHandler(type, DragDrop.PreviewDropEvent, new DragEventHandler(null, OnPreviewDropThunk), false);
//        EventManager.RegisterClassHandler(type, DragDrop.DropEvent, new DragEventHandler(null, OnDropThunk), false); 
    };
    
    /// <SecurityNote> 
    ///  Critical: This code is used to register various thunks that are used to send input to the tree
    ///  TreatAsSafe: This code attaches handlers that are inside the class and private. Not configurable or overridable 
    /// </SecurityNote>
//    static UIElement()
	function Initialize()
    { 
        UIElement.RegisterEvents(UIElement.Type);

//        RenderOptions.EdgeModeProperty.OverrideMetadata( 
//            UIElement.Type,
//            new UIPropertyMetadata(new PropertyChangedCallback(EdgeMode_Changed))); 
//
//        RenderOptions.BitmapScalingModeProperty.OverrideMetadata(
//            UIElement.Type,
//            new UIPropertyMetadata(new PropertyChangedCallback(BitmapScalingMode_Changed))); 
//
//        RenderOptions.ClearTypeHintProperty.OverrideMetadata( 
//            UIElement.Type, 
//            new UIPropertyMetadata(new PropertyChangedCallback(ClearTypeHint_Changed)));
//
//        TextOptionsInternal.TextHintingModeProperty.OverrideMetadata(
//            UIElement.Type,
//            new UIPropertyMetadata(new PropertyChangedCallback(TextHintingMode_Changed)));

//        EventManager.RegisterClassHandler(UIElement.Type, ManipulationStartingEvent, new EventHandler<ManipulationStartingEventArgs>(OnManipulationStartingThunk));
//        EventManager.RegisterClassHandler(UIElement.Type, ManipulationStartedEvent, new EventHandler<ManipulationStartedEventArgs>(OnManipulationStartedThunk)); 
//        EventManager.RegisterClassHandler(UIElement.Type, ManipulationDeltaEvent, new EventHandler<ManipulationDeltaEventArgs>(OnManipulationDeltaThunk)); 
//        EventManager.RegisterClassHandler(UIElement.Type, ManipulationInertiaStartingEvent, new EventHandler<ManipulationInertiaStartingEventArgs>(OnManipulationInertiaStartingThunk));
//        EventManager.RegisterClassHandler(UIElement.Type, ManipulationBoundaryFeedbackEvent, new EventHandler<ManipulationBoundaryFeedbackEventArgs>(OnManipulationBoundaryFeedbackThunk)); 
//        EventManager.RegisterClassHandler(UIElement.Type, ManipulationCompletedEvent, new EventHandler<ManipulationCompletedEventArgs>(OnManipulationCompletedThunk));
    }
	
	UIElement.Type = new Type("UIElement", UIElement, [Visual.Type, IInputElement.Type, IAnimatable.Type]);
	Initialize();
	return UIElement;
});
 



