package org.summer.view.widget;

import java.awt.im.spi.InputMethod;

import org.summer.view.widget.collection.FrugalObjectList;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.input.CommandBindingCollection;
import org.summer.view.widget.input.FocusManager;
import org.summer.view.widget.input.FocusNavigationDirection;
import org.summer.view.widget.input.InputBindingCollection;
import org.summer.view.widget.input.InputElement;
import org.summer.view.widget.input.InputManager;
import org.summer.view.widget.input.KeyEventArgs;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.input.MouseButtonEventArgs;
import org.summer.view.widget.input.MouseEventArgs;
import org.summer.view.widget.input.Stylus;
import org.summer.view.widget.input.StylusEventArgs;
import org.summer.view.widget.input.TextCompositionEventArgs;
import org.summer.view.widget.input.TraversalRequest;
import org.summer.view.widget.internal.EventHandler;
import org.summer.view.widget.internal.SynchronizedInputHelper;
import org.summer.view.widget.internal.SynchronizedInputStates;
import org.summer.view.widget.media.animation.AnimationClock;
import org.summer.view.widget.media.animation.AnimationTimeline;
import org.summer.view.widget.media.animation.HandoffBehavior;
import org.summer.view.widget.media.animation.IAnimatable;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary> 
    ///     ContentElement Class is a DependencyObject with IFE - input, focus, and events 
    /// </summary>
    /// <ExternalAPI/> 
public /*partial*/ class ContentElement extends DependencyObject implements IInputElement, IAnimatable
{
	
	static private final Type _typeofThis = typeof(ContentElement); 

//    #region IAnimatable 

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
    public void ApplyAnimationClock(
        DependencyProperty dp,
        AnimationClock clock) 
    {
        ApplyAnimationClock(dp, clock, HandoffBehavior.SnapshotAndReplace); 
    } 

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
    public void ApplyAnimationClock(
        DependencyProperty dp, 
        AnimationClock clock,
        HandoffBehavior handoffBehavior)
    {
        if (dp == null) 
        {
            throw new ArgumentNullException("dp"); 
        } 

        if (!AnimationStorage.IsPropertyAnimatable(this, dp)) 
        {
//    #pragma warning disable 56506 // Suppress presharp warning: Parameter 'dp' to this public method must be validated:  A null-dereference can occur here.
            throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp");
//    #pragma warning restore 56506 
        }

        if (clock != null 
            && !AnimationStorage.IsAnimationValid(dp, clock.Timeline))
        { 
//    #pragma warning disable 56506 // Suppress presharp warning: Parameter 'dp' to this public method must be validated:  A null-dereference can occur here.
            throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, clock.Timeline.GetType(), dp.Name, dp.PropertyType), "clock");
//    #pragma warning restore 56506
        } 

        if (!HandoffBehaviorEnum.IsDefined(handoffBehavior)) 
        { 
            throw new ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior));
        } 

        if (IsSealed)
        {
            throw new InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO, dp, this.GetType())); 
        }

        AnimationStorage.ApplyAnimationClock(this, dp, clock, handoffBehavior); 
    }

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
    public void BeginAnimation(DependencyProperty dp, AnimationTimeline animation) 
    { 
        BeginAnimation(dp, animation, HandoffBehavior.SnapshotAndReplace);
    } 

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
    public void BeginAnimation(DependencyProperty dp, AnimationTimeline animation, HandoffBehavior handoffBehavior)
    {
        if (dp == null) 
        {
            throw new ArgumentNullException("dp"); 
        } 

        if (!AnimationStorage.IsPropertyAnimatable(this, dp)) 
        {
//    #pragma warning disable 56506 // Suppress presharp warning: Parameter 'dp' to this public method must be validated:  A null-dereference can occur here.
            throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp");
//    #pragma warning restore 56506 
        }

        if (   animation != null 
            && !AnimationStorage.IsAnimationValid(dp, animation))
        { 
            throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, animation.GetType(), dp.Name, dp.PropertyType), "animation");
        }

        if (!HandoffBehaviorEnum.IsDefined(handoffBehavior)) 
        {
            throw new ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior)); 
        } 

        if (IsSealed) 
        {
            throw new InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO, dp, this.GetType()));
        }

        AnimationStorage.BeginAnimation(this, dp, animation, handoffBehavior);
    } 

    /// <summary>
    /// Returns true if any properties on this DependencyObject have a 
    /// persistent animation or the Object has one or more clocks associated
    /// with any of its properties.
    /// </summary>
    public boolean HasAnimatedProperties 
    {
        get 
        { 
            VerifyAccess();

            return IAnimatable_HasAnimatedProperties;
        }
    }

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
    public Object GetAnimationBaseValue(DependencyProperty dp) 
    {
        if (dp == null) 
        {
            throw new ArgumentNullException("dp");
        }

        return this.GetValueEntry(
                LookupEntry(dp.GlobalIndex), 
                dp, 
                null,
                RequestFlags.AnimationBaseValue).Value; 
    }

//    #endregion IAnimatable

//    #region Animation

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
//    [UIPermissionAttribute(SecurityAction.InheritanceDemand, Window=UIPermissionWindow.AllWindows)] 
    /*internal*/ public /*sealed*/ /*override*/ void EvaluateAnimatedValueCore(
            DependencyProperty  dp,
            PropertyMetadata    metadata,
        /*ref*/ EffectiveValueEntry entry) 
    {
        if (IAnimatable_HasAnimatedProperties) 
        { 
            AnimationStorage storage = AnimationStorage.GetStorage(this, dp);

            if (storage != null)
            {
                storage.EvaluateAnimatedValue(metadata, /*ref*/ entry);
            } 
        }
    } 

//    #endregion Animation

//    #region Commands
    /// <summary>
    /// Instance level InputBinding collection, initialized on first use.
    /// To have commands handled (QueryEnabled/Execute) on an element instance, 
    /// the user of this method can add InputBinding with handlers thru this
    /// method. 
    /// </summary> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
    public InputBindingCollection InputBindings 
    {
        get
        {
            VerifyAccess(); 
            InputBindingCollection bindings = InputBindingCollectionField.GetValue(this);
            if (bindings == null) 
            { 
                bindings = new InputBindingCollection(this);
                InputBindingCollectionField.SetValue(this, bindings); 
            }

            return bindings;
        } 
    }

    // Used by CommandManager to avoid instantiating an empty collection 
    /*internal*/ public InputBindingCollection InputBindingsInternal
    { 
        get
        {
            VerifyAccess();
            return InputBindingCollectionField.GetValue(this); 
        }
    } 

    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should 
    /// be serialized.
    /// </summary>
    // for serializer to serialize only when InputBindings is not empty
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeInputBindings()
    { 
        InputBindingCollection bindingCollection = InputBindingCollectionField.GetValue(this); 
        if (bindingCollection != null && bindingCollection.Count > 0)
        { 
            return true;
        }

        return false; 
    }

    /// <summary> 
    /// Instance level CommandBinding collection, initialized on first use.
    /// To have commands handled (QueryEnabled/Execute) on an element instance, 
    /// the user of this method can add CommandBinding with handlers thru this
    /// method.
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
    public CommandBindingCollection CommandBindings
    { 
        get 
        {
            VerifyAccess(); 
            CommandBindingCollection bindings = CommandBindingCollectionField.GetValue(this);
            if (bindings == null)
            {
                bindings = new CommandBindingCollection(); 
                CommandBindingCollectionField.SetValue(this, bindings);
            } 

            return bindings;
        } 
    }

    // Used by CommandManager to avoid instantiating an empty collection
    /*internal*/ public CommandBindingCollection CommandBindingsInternal 
    {
        get 
        { 
            VerifyAccess();
            return CommandBindingCollectionField.GetValue(this); 
        }
    }

    /// <summary> 
    /// This method is used by TypeDescriptor to determine if this property should
    /// be serialized. 
    /// </summary> 
    // for serializer to serialize only when CommandBindings is not empty
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeCommandBindings()
    {
        CommandBindingCollection bindingCollection = CommandBindingCollectionField.GetValue(this);
        if (bindingCollection != null && bindingCollection.Count > 0) 
        {
            return true; 
        } 

        return false; 
    }

//    #endregion Commands

//    #region Events

    /// <summary> 
    ///     Allows ContentElement to augment the
    ///     <see cref="EventRoute"/> 
    /// </summary>
    /// <remarks>
    ///     Sub-classes of ContentElement can override
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
    /*internal*/ /*virtual*/ boolean BuildRouteCore(EventRoute route, RoutedEventArgs args)
    { 
        return false;
    } 

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
    /*internal*/ public void BuildRoute(EventRoute route, RoutedEventArgs args)
    {
        UIElement.BuildRouteHelper(this, route, args); 
    }

    /// <summary> 
    ///     Raise the events specified by
    ///     <see cref="RoutedEventArgs.RoutedEvent"/> 
    /// </summary>
    /// <remarks>
    ///     This method is a shorthand for
    ///     <see cref="ContentElement.BuildRoute"/> and 
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
    public void RaiseEvent(RoutedEventArgs e) 
    { 
        // VerifyAccess();

        if (e == null)
        {
            throw new ArgumentNullException("e");
        } 
        e.ClearUserInitiated();

        UIElement.RaiseEventImpl(this, e); 
    }

    /// <summary>
    ///     "Trusted" internal flavor of RaiseEvent.
    ///     Used to set the User-initated RaiseEvent.
    /// </summary> 
    ///<SecurityNote>
    ///     Critical - sets the MarkAsUserInitiated bit. 
    ///</SecurityNote> 
//    [SecurityCritical]
    /*internal*/ public void RaiseEvent(RoutedEventArgs args, boolean trusted) 
    {
        if (args == null)
        {
            throw new ArgumentNullException("args"); 
        }

        if (trusted) 
        {
            RaiseTrustedEvent(args); 
        }
        else
        {
            args.ClearUserInitiated(); 

            UIElement.RaiseEventImpl(this, args); 
        } 
    }

    ///<SecurityNote>
    ///     Critical - sets the MarkAsUserInitiated bit.
    ///</SecurityNote>
//    [SecurityCritical] 
//    [MS.Internal.Permissions.UserInitiatedRoutedEventPermissionAttribute(SecurityAction.Assert)]
    /*internal*/ public void RaiseTrustedEvent(RoutedEventArgs args) 
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
    } 


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
    /*internal*/ /*virtual*/ Object AdjustEventSource(RoutedEventArgs args) 
    {
        return null;
    }

    /// <summary>
    ///     See overloaded method for details 
    /// </summary> 
    /// <remarks>
    ///     handledEventsToo defaults to false <para/> 
    ///     See overloaded method for details
    /// </remarks>
    /// <param name="routedEvent"/>
    /// <param name="handler"/> 
    public void AddHandler(RoutedEvent routedEvent, Delegate handler)
    { 
        // HandledEventToo defaults to false 
        // Call forwarded
        AddHandler(routedEvent, handler, false); 
    }

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
    ///     The handler that will be invoked on this Object 
    ///     when the RoutedEvent is raised
    /// </param> 
    /// <param name="handledEventsToo">
    ///     Flag indicating whether or not the listener wants to
    ///     hear about events that have already been handled
    /// </param> 
    public void AddHandler(
        RoutedEvent routedEvent, 
        Delegate handler, 
        boolean handledEventsToo)
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
            throw new ArgumentException(/*SR.Get(SRID.HandlerTypeIllegal)*/); 
        } 

        EnsureEventHandlersStore(); 
        EventHandlersStore.AddRoutedEventHandler(routedEvent, handler, handledEventsToo);

        OnAddHandler (routedEvent, handler);
    } 

    /// <summary> 
    ///     Notifies subclass of a new routed event handler.  Note that this is 
    ///     called once for each handler added, but OnRemoveHandler is only called
    ///     on the last removal. 
    /// </summary>
    /*internal*/ public /*virtual*/ void OnAddHandler(
        RoutedEvent routedEvent,
        Delegate handler) 
    {
    } 

    /// <summary>
    ///     Removes all instances of the specified routed 
    ///     event handler for this Object instance
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
    ///     The handler for this Object instance to be removed 
    /// </param>
    public void RemoveHandler(RoutedEvent routedEvent, Delegate handler) 
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
            throw new ArgumentException(/*SR.Get(SRID.HandlerTypeIllegal)*/); 
        }

        EventHandlersStore store = EventHandlersStore; 
        if (store != null)
        { 
            store.RemoveRoutedEventHandler(routedEvent, handler);

            OnRemoveHandler (routedEvent, handler);

            if (store.Count == 0)
            { 
                // last event handler was removed -- throw away underlying EventHandlersStore 
                EventHandlersStoreField.ClearValue(this);
                WriteFlag(CoreFlags.ExistsEventHandlersStore, false); 
            }

        }
    } 

    /// <summary> 
    ///     Notifies subclass of an event for which a handler has been removed. 
    /// </summary>
    /*internal*/ /*virtual*/ void OnRemoveHandler( 
        RoutedEvent routedEvent,
        Delegate handler)
    {
    } 

    private void EventHandlersStoreAdd(EventPrivateKey key, Delegate handler) 
    { 
        EnsureEventHandlersStore();
        EventHandlersStore.Add(key, handler); 
    }

    private void EventHandlersStoreRemove(EventPrivateKey key, Delegate handler)
    { 
        EventHandlersStore store = EventHandlersStore;
        if (store != null) 
        { 
            store.Remove(key, handler);
            if (store.Count == 0) 
            {
                // last event handler was removed -- throw away underlying EventHandlersStore
                EventHandlersStoreField.ClearValue(this);
                WriteFlag(CoreFlags.ExistsEventHandlersStore, false); 
            }
        } 
    } 

    /// <summary> 
    ///     Add the event handlers for this element to the route.
    /// </summary>
    public void AddToEventRoute(EventRoute route, RoutedEventArgs e)
    { 
        if (route == null)
        { 
            throw new ArgumentNullException("route"); 
        }
        if (e == null) 
        {
            throw new ArgumentNullException("e");
        }

        // Get class listeners for this ContentElement
        RoutedEventHandlerInfoList classListeners = 
            GlobalEventManager.GetDTypedClassListeners(this.DependencyObjectType, e.RoutedEvent); 

        // Add all class listeners for this ContentElement 
        while (classListeners != null)
        {
            for(int i = 0; i < classListeners.Handlers.length; i++)
            { 
                route.Add(this, classListeners.Handlers[i].Handler, classListeners.Handlers[i].InvokeHandledEventsToo);
            } 

            classListeners = classListeners.Next;
        } 

        // Get instance listeners for this ContentElement
        FrugalObjectList<RoutedEventHandlerInfo> instanceListeners = null;
        EventHandlersStore store = EventHandlersStore; 
        if (store != null)
        { 
            instanceListeners = store[e.RoutedEvent]; 

            // Add all instance listeners for this ContentElement 
            if (instanceListeners != null)
            {
                for (int i = 0; i < instanceListeners.Count; i++)
                { 
                    route.Add(this, instanceListeners[i].Handler, instanceListeners[i].InvokeHandledEventsToo);
                } 
            } 
        }

        // Allow Framework to add event handlers in styles
        AddToEventRouteCore(route, e);
    }

    /// <summary>
    ///     This virtual method is to be overridden in Framework 
    ///     to be able to add handlers for styles 
    /// </summary>
    /*internal*/ /*virtual*/ void AddToEventRouteCore(EventRoute route, RoutedEventArgs args) 
    {
    }

    /// <summary> 
    ///     Event Handlers Store
    /// </summary> 
    /// <remarks> 
    ///     The idea of exposing this property is to allow
    ///     elements in the Framework to generically use 
    ///     EventHandlersStore for Clr events as well.
    /// </remarks>
    /*internal*/ public EventHandlersStore EventHandlersStore
    { 
//        [FriendAccessAllowed] // Built into Core, also used by Framework.
        get 
        { 
            if(!ReadFlag(CoreFlags.ExistsEventHandlersStore))
            { 
                return null;
            }
            return EventHandlersStoreField.GetValue(this);
        } 
    }

    /// <summary> 
    ///     Ensures that EventHandlersStore will return
    ///     non-null when it is called. 
    /// </summary>
//    [FriendAccessAllowed] // Built into Core, also used by Framework.
    /*internal*/ public void EnsureEventHandlersStore()
    { 
        if (EventHandlersStore == null)
        { 
            EventHandlersStoreField.SetValue(this, new EventHandlersStore()); 
            WriteFlag(CoreFlags.ExistsEventHandlersStore, true);
        } 
    }

//    #endregion Events



    private static void RegisterProperties() 
    {
        UIElement.IsMouseDirectlyOverPropertyKey.OverrideMetadata( 
                            _typeofThis,
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox, // default value
                                        new PropertyChangedCallback(IsMouseDirectlyOver_Changed))); 

        UIElement.IsMouseOverPropertyKey.OverrideMetadata( 
                            _typeofThis, 
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox)); 

        UIElement.IsStylusOverPropertyKey.OverrideMetadata(
                            _typeofThis,
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox));

        UIElement.IsKeyboardFocusWithinPropertyKey.OverrideMetadata( 
                            _typeofThis,
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox));

        UIElement.IsMouseCapturedPropertyKey.OverrideMetadata(
                            _typeofThis, 
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox, // default value 
                                        new PropertyChangedCallback(IsMouseCaptured_Changed))); 

        UIElement.IsMouseCaptureWithinPropertyKey.OverrideMetadata( 
                            _typeofThis,
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox));

        UIElement.IsStylusDirectlyOverPropertyKey.OverrideMetadata(
                            _typeofThis, 
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox, // default value
                                        new PropertyChangedCallback(IsStylusDirectlyOver_Changed))); 

        UIElement.IsStylusCapturedPropertyKey.OverrideMetadata(
                            _typeofThis,
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox, // default value
                                        new PropertyChangedCallback(IsStylusCaptured_Changed))); 

        UIElement.IsStylusCaptureWithinPropertyKey.OverrideMetadata(
                            _typeofThis, 
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox));

        UIElement.IsKeyboardFocusedPropertyKey.OverrideMetadata( 
                            _typeofThis,
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox, // default value 
                                        new PropertyChangedCallback(IsKeyboardFocused_Changed)));

        UIElement.AreAnyTouchesDirectlyOverPropertyKey.OverrideMetadata(
                            _typeofThis,
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox)); 

        UIElement.AreAnyTouchesOverPropertyKey.OverrideMetadata( 
                            _typeofThis, 
                            new PropertyMetadata(
                                        BooleanBoxes.FalseBox)); 

        UIElement.AreAnyTouchesCapturedPropertyKey.OverrideMetadata(
                            _typeofThis,
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox));

        UIElement.AreAnyTouchesCapturedWithinPropertyKey.OverrideMetadata( 
                            _typeofThis,
                            new PropertyMetadata( 
                                        BooleanBoxes.FalseBox));
    }



    /// <summary> 
    ///     Alias to the Mouse.PreviewMouseDownEvent. 
    /// </summary>
    public static final RoutedEvent PreviewMouseDownEvent = Mouse.PreviewMouseDownEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the mouse button was pressed
    /// </summary> 
    public /*event*/ MouseButtonEventHandler PreviewMouseDown
    { 
        add { AddHandler(Mouse.PreviewMouseDownEvent, value, false); } 
        remove { RemoveHandler(Mouse.PreviewMouseDownEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the mouse button was pressed
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewMouseDown(MouseButtonEventArgs e) {}

    /// <summary> 
    ///     Alias to the Mouse.MouseDownEvent.
    /// </summary> 
    public static final RoutedEvent MouseDownEvent = Mouse.MouseDownEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the mouse button was pressed 
    /// </summary>
    public /*event*/ MouseButtonEventHandler MouseDown 
    { 
        add { AddHandler(Mouse.MouseDownEvent, value, false); }
        remove { RemoveHandler(Mouse.MouseDownEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the mouse button was pressed 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnMouseDown(MouseButtonEventArgs e) {} 

    /// <summary>
    ///     Alias to the Mouse.PreviewMouseUpEvent. 
    /// </summary>
    public static final RoutedEvent PreviewMouseUpEvent = Mouse.PreviewMouseUpEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the mouse button was released
    /// </summary> 
    public /*event*/ MouseButtonEventHandler PreviewMouseUp 
    {
        add { AddHandler(Mouse.PreviewMouseUpEvent, value, false); } 
        remove { RemoveHandler(Mouse.PreviewMouseUpEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting the mouse button was released
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewMouseUp(MouseButtonEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Mouse.MouseUpEvent.
    /// </summary>
    public static final RoutedEvent MouseUpEvent = Mouse.MouseUpEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the mouse button was released 
    /// </summary> 
    public /*event*/ MouseButtonEventHandler MouseUp
    { 
        add { AddHandler(Mouse.MouseUpEvent, value, false); }
        remove { RemoveHandler(Mouse.MouseUpEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting the mouse button was released 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnMouseUp(MouseButtonEventArgs e) {}

    /// <summary>
    ///     Alias to the UIElement.PreviewMouseLeftButtonDownEvent.
    /// </summary>
    public static final RoutedEvent PreviewMouseLeftButtonDownEvent = UIElement.PreviewMouseLeftButtonDownEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the left mouse button was pressed 
    /// </summary>
    public /*event*/ MouseButtonEventHandler PreviewMouseLeftButtonDown 
    {
        add { AddHandler(UIElement.PreviewMouseLeftButtonDownEvent, value, false); }
        remove { RemoveHandler(UIElement.PreviewMouseLeftButtonDownEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting the left mouse button was pressed 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewMouseLeftButtonDown(MouseButtonEventArgs e) {} 

    /// <summary>
    ///     Alias to the UIElement.MouseLeftButtonDownEvent.
    /// </summary> 
    public static final RoutedEvent MouseLeftButtonDownEvent = UIElement.MouseLeftButtonDownEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the left mouse button was pressed
    /// </summary> 
    public /*event*/ MouseButtonEventHandler MouseLeftButtonDown
    {
        add { AddHandler(UIElement.MouseLeftButtonDownEvent, value, false); }
        remove { RemoveHandler(UIElement.MouseLeftButtonDownEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting the left mouse button was pressed
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnMouseLeftButtonDown(MouseButtonEventArgs e) {}

    /// <summary>
    ///     Alias to the UIElement.PreviewMouseLeftButtonUpEvent. 
    /// </summary>
    public static final RoutedEvent PreviewMouseLeftButtonUpEvent = UIElement.PreviewMouseLeftButtonUpEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the left mouse button was released 
    /// </summary>
    public /*event*/ MouseButtonEventHandler PreviewMouseLeftButtonUp
    {
        add { AddHandler(UIElement.PreviewMouseLeftButtonUpEvent, value, false); } 
        remove { RemoveHandler(UIElement.PreviewMouseLeftButtonUpEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the left mouse button was released 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewMouseLeftButtonUp(MouseButtonEventArgs e) {}

    /// <summary> 
    ///     Alias to the UIElement.MouseLeftButtonUpEvent.
    /// </summary> 
    public static final RoutedEvent MouseLeftButtonUpEvent = UIElement.MouseLeftButtonUpEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the left mouse button was released
    /// </summary>
    public /*event*/ MouseButtonEventHandler MouseLeftButtonUp
    { 
        add { AddHandler(UIElement.MouseLeftButtonUpEvent, value, false); }
        remove { RemoveHandler(UIElement.MouseLeftButtonUpEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting the left mouse button was released
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnMouseLeftButtonUp(MouseButtonEventArgs e) {}

    /// <summary>
    ///     Alias to the UIElement.PreviewMouseRightButtonDownEvent. 
    /// </summary> 
    public static final RoutedEvent PreviewMouseRightButtonDownEvent = UIElement.PreviewMouseRightButtonDownEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the right mouse button was pressed
    /// </summary>
    public /*event*/ MouseButtonEventHandler PreviewMouseRightButtonDown 
    {
        add { AddHandler(UIElement.PreviewMouseRightButtonDownEvent, value, false); } 
        remove { RemoveHandler(UIElement.PreviewMouseRightButtonDownEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the right mouse button was pressed
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewMouseRightButtonDown(MouseButtonEventArgs e) {} 

    /// <summary> 
    ///     Alias to the UIElement.MouseRightButtonDownEvent. 
    /// </summary>
    public static final RoutedEvent MouseRightButtonDownEvent = UIElement.MouseRightButtonDownEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the right mouse button was pressed
    /// </summary> 
    public /*event*/ MouseButtonEventHandler MouseRightButtonDown
    { 
        add { AddHandler(UIElement.MouseRightButtonDownEvent, value, false); } 
        remove { RemoveHandler(UIElement.MouseRightButtonDownEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the right mouse button was pressed
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnMouseRightButtonDown(MouseButtonEventArgs e) {}

    /// <summary> 
    ///     Alias to the UIElement.PreviewMouseRightButtonUpEvent.
    /// </summary> 
    public static final RoutedEvent PreviewMouseRightButtonUpEvent = UIElement.PreviewMouseRightButtonUpEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the right mouse button was released 
    /// </summary>
    public /*event*/ MouseButtonEventHandler PreviewMouseRightButtonUp 
    { 
        add { AddHandler(UIElement.PreviewMouseRightButtonUpEvent, value, false); }
        remove { RemoveHandler(UIElement.PreviewMouseRightButtonUpEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the right mouse button was released 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewMouseRightButtonUp(MouseButtonEventArgs e) {} 

    /// <summary>
    ///     Alias to the UIElement.MouseRightButtonUpEvent. 
    /// </summary>
    public static final RoutedEvent MouseRightButtonUpEvent = UIElement.MouseRightButtonUpEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the right mouse button was released
    /// </summary> 
    public /*event*/ MouseButtonEventHandler MouseRightButtonUp 
    {
        add { AddHandler(UIElement.MouseRightButtonUpEvent, value, false); } 
        remove { RemoveHandler(UIElement.MouseRightButtonUpEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting the right mouse button was released
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnMouseRightButtonUp(MouseButtonEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Mouse.PreviewMouseMoveEvent.
    /// </summary>
    public static final RoutedEvent PreviewMouseMoveEvent = Mouse.PreviewMouseMoveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a mouse move 
    /// </summary> 
    public /*event*/ MouseEventHandler PreviewMouseMove
    { 
        add { AddHandler(Mouse.PreviewMouseMoveEvent, value, false); }
        remove { RemoveHandler(Mouse.PreviewMouseMoveEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting a mouse move 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewMouseMove(MouseEventArgs e) {}

    /// <summary>
    ///     Alias to the Mouse.MouseMoveEvent.
    /// </summary>
    public static final RoutedEvent MouseMoveEvent = Mouse.MouseMoveEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting a mouse move 
    /// </summary>
    public /*event*/ MouseEventHandler MouseMove 
    {
        add { AddHandler(Mouse.MouseMoveEvent, value, false); }
        remove { RemoveHandler(Mouse.MouseMoveEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting a mouse move 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnMouseMove(MouseEventArgs e) {} 

    /// <summary>
    ///     Alias to the Mouse.PreviewMouseWheelEvent.
    /// </summary> 
    public static final RoutedEvent PreviewMouseWheelEvent = Mouse.PreviewMouseWheelEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting a mouse wheel rotation
    /// </summary> 
    public /*event*/ MouseWheelEventHandler PreviewMouseWheel
    {
        add { AddHandler(Mouse.PreviewMouseWheelEvent, value, false); }
        remove { RemoveHandler(Mouse.PreviewMouseWheelEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting a mouse wheel rotation
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewMouseWheel(MouseWheelEventArgs e) {}

    /// <summary>
    ///     Alias to the Mouse.MouseWheelEvent. 
    /// </summary>
    public static final RoutedEvent MouseWheelEvent = Mouse.MouseWheelEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting a mouse wheel rotation 
    /// </summary>
    public /*event*/ MouseWheelEventHandler MouseWheel
    {
        add { AddHandler(Mouse.MouseWheelEvent, value, false); } 
        remove { RemoveHandler(Mouse.MouseWheelEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a mouse wheel rotation 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnMouseWheel(MouseWheelEventArgs e) {}

    /// <summary> 
    ///     Alias to the Mouse.MouseEnterEvent.
    /// </summary> 
    public static final RoutedEvent MouseEnterEvent = Mouse.MouseEnterEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the mouse entered this element
    /// </summary>
    public /*event*/ MouseEventHandler MouseEnter
    { 
        add { AddHandler(Mouse.MouseEnterEvent, value, false); }
        remove { RemoveHandler(Mouse.MouseEnterEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting the mouse entered this element
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnMouseEnter(MouseEventArgs e) {}

    /// <summary>
    ///     Alias to the Mouse.MouseLeaveEvent. 
    /// </summary> 
    public static final RoutedEvent MouseLeaveEvent = Mouse.MouseLeaveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the mouse left this element
    /// </summary>
    public /*event*/ MouseEventHandler MouseLeave 
    {
        add { AddHandler(Mouse.MouseLeaveEvent, value, false); } 
        remove { RemoveHandler(Mouse.MouseLeaveEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the mouse left this element
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnMouseLeave(MouseEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Mouse.GotMouseCaptureEvent. 
    /// </summary>
    public static final RoutedEvent GotMouseCaptureEvent = Mouse.GotMouseCaptureEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting that this element got the mouse capture
    /// </summary> 
    public /*event*/ MouseEventHandler GotMouseCapture
    { 
        add { AddHandler(Mouse.GotMouseCaptureEvent, value, false); } 
        remove { RemoveHandler(Mouse.GotMouseCaptureEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting that this element got the mouse capture
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnGotMouseCapture(MouseEventArgs e) {}

    /// <summary> 
    ///     Alias to the Mouse.LostMouseCaptureEvent.
    /// </summary> 
    public static final RoutedEvent LostMouseCaptureEvent = Mouse.LostMouseCaptureEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting that this element lost the mouse capture 
    /// </summary>
    public /*event*/ MouseEventHandler LostMouseCapture 
    { 
        add { AddHandler(Mouse.LostMouseCaptureEvent, value, false); }
        remove { RemoveHandler(Mouse.LostMouseCaptureEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting that this element lost the mouse capture 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnLostMouseCapture(MouseEventArgs e) {} 

    /// <summary>
    ///     Alias to the Mouse.QueryCursorEvent. 
    /// </summary>
    public static final RoutedEvent QueryCursorEvent = Mouse.QueryCursorEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the cursor to display was requested
    /// </summary> 
    public /*event*/ QueryCursorEventHandler QueryCursor 
    {
        add { AddHandler(Mouse.QueryCursorEvent, value, false); } 
        remove { RemoveHandler(Mouse.QueryCursorEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting the cursor to display was requested
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnQueryCursor(QueryCursorEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Stylus.PreviewStylusDownEvent.
    /// </summary>
    public static final RoutedEvent PreviewStylusDownEvent = Stylus.PreviewStylusDownEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a stylus-down 
    /// </summary> 
    public /*event*/ StylusDownEventHandler PreviewStylusDown
    { 
        add { AddHandler(Stylus.PreviewStylusDownEvent, value, false); }
        remove { RemoveHandler(Stylus.PreviewStylusDownEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting a stylus-down 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewStylusDown(StylusDownEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.StylusDownEvent.
    /// </summary>
    public static final RoutedEvent StylusDownEvent = Stylus.StylusDownEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting a stylus-down 
    /// </summary>
    public /*event*/ StylusDownEventHandler StylusDown 
    {
        add { AddHandler(Stylus.StylusDownEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusDownEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting a stylus-down 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnStylusDown(StylusDownEventArgs e) {} 

    /// <summary>
    ///     Alias to the Stylus.PreviewStylusUpEvent.
    /// </summary> 
    public static final RoutedEvent PreviewStylusUpEvent = Stylus.PreviewStylusUpEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting a stylus-up
    /// </summary> 
    public /*event*/ StylusEventHandler PreviewStylusUp
    {
        add { AddHandler(Stylus.PreviewStylusUpEvent, value, false); }
        remove { RemoveHandler(Stylus.PreviewStylusUpEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting a stylus-up
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewStylusUp(StylusEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.StylusUpEvent. 
    /// </summary>
    public static final RoutedEvent StylusUpEvent = Stylus.StylusUpEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting a stylus-up 
    /// </summary>
    public /*event*/ StylusEventHandler StylusUp
    {
        add { AddHandler(Stylus.StylusUpEvent, value, false); } 
        remove { RemoveHandler(Stylus.StylusUpEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a stylus-up 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnStylusUp(StylusEventArgs e) {}

    /// <summary> 
    ///     Alias to the Stylus.PreviewStylusMoveEvent.
    /// </summary> 
    public static final RoutedEvent PreviewStylusMoveEvent = Stylus.PreviewStylusMoveEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting a stylus move
    /// </summary>
    public /*event*/ StylusEventHandler PreviewStylusMove
    { 
        add { AddHandler(Stylus.PreviewStylusMoveEvent, value, false); }
        remove { RemoveHandler(Stylus.PreviewStylusMoveEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting a stylus move
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewStylusMove(StylusEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.StylusMoveEvent. 
    /// </summary> 
    public static final RoutedEvent StylusMoveEvent = Stylus.StylusMoveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a stylus move
    /// </summary>
    public /*event*/ StylusEventHandler StylusMove 
    {
        add { AddHandler(Stylus.StylusMoveEvent, value, false); } 
        remove { RemoveHandler(Stylus.StylusMoveEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting a stylus move
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnStylusMove(StylusEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Stylus.PreviewStylusInAirMoveEvent. 
    /// </summary>
    public static final RoutedEvent PreviewStylusInAirMoveEvent = Stylus.PreviewStylusInAirMoveEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting a stylus-in-air-move
    /// </summary> 
    public /*event*/ StylusEventHandler PreviewStylusInAirMove
    { 
        add { AddHandler(Stylus.PreviewStylusInAirMoveEvent, value, false); } 
        remove { RemoveHandler(Stylus.PreviewStylusInAirMoveEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a stylus-in-air-move
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewStylusInAirMove(StylusEventArgs e) {}

    /// <summary> 
    ///     Alias to the Stylus.StylusInAirMoveEvent.
    /// </summary> 
    public static final RoutedEvent StylusInAirMoveEvent = Stylus.StylusInAirMoveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a stylus-in-air-move 
    /// </summary>
    public /*event*/ StylusEventHandler StylusInAirMove 
    { 
        add { AddHandler(Stylus.StylusInAirMoveEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusInAirMoveEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting a stylus-in-air-move 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnStylusInAirMove(StylusEventArgs e) {} 

    /// <summary>
    ///     Alias to the Stylus.StylusEnterEvent. 
    /// </summary>
    public static final RoutedEvent StylusEnterEvent = Stylus.StylusEnterEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the stylus entered this element
    /// </summary> 
    public /*event*/ StylusEventHandler StylusEnter 
    {
        add { AddHandler(Stylus.StylusEnterEvent, value, false); } 
        remove { RemoveHandler(Stylus.StylusEnterEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting the stylus entered this element
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnStylusEnter(StylusEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Stylus.StylusLeaveEvent.
    /// </summary>
    public static final RoutedEvent StylusLeaveEvent = Stylus.StylusLeaveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the stylus left this element 
    /// </summary> 
    public /*event*/ StylusEventHandler StylusLeave
    { 
        add { AddHandler(Stylus.StylusLeaveEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusLeaveEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting the stylus left this element 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnStylusLeave(StylusEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.PreviewStylusInRangeEvent.
    /// </summary>
    public static final RoutedEvent PreviewStylusInRangeEvent = Stylus.PreviewStylusInRangeEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the stylus is now in range of the digitizer 
    /// </summary>
    public /*event*/ StylusEventHandler PreviewStylusInRange 
    {
        add { AddHandler(Stylus.PreviewStylusInRangeEvent, value, false); }
        remove { RemoveHandler(Stylus.PreviewStylusInRangeEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting the stylus is now in range of the digitizer 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewStylusInRange(StylusEventArgs e) {} 

    /// <summary>
    ///     Alias to the Stylus.StylusInRangeEvent.
    /// </summary> 
    public static final RoutedEvent StylusInRangeEvent = Stylus.StylusInRangeEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the stylus is now in range of the digitizer
    /// </summary> 
    public /*event*/ StylusEventHandler StylusInRange
    {
        add { AddHandler(Stylus.StylusInRangeEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusInRangeEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting the stylus is now in range of the digitizer
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnStylusInRange(StylusEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.PreviewStylusOutOfRangeEvent. 
    /// </summary>
    public static final RoutedEvent PreviewStylusOutOfRangeEvent = Stylus.PreviewStylusOutOfRangeEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the stylus is now out of range of the digitizer 
    /// </summary>
    public /*event*/ StylusEventHandler PreviewStylusOutOfRange
    {
        add { AddHandler(Stylus.PreviewStylusOutOfRangeEvent, value, false); } 
        remove { RemoveHandler(Stylus.PreviewStylusOutOfRangeEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the stylus is now out of range of the digitizer 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewStylusOutOfRange(StylusEventArgs e) {}

    /// <summary> 
    ///     Alias to the Stylus.StylusOutOfRangeEvent.
    /// </summary> 
    public static final RoutedEvent StylusOutOfRangeEvent = Stylus.StylusOutOfRangeEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the stylus is now out of range of the digitizer
    /// </summary>
    public /*event*/ StylusEventHandler StylusOutOfRange
    { 
        add { AddHandler(Stylus.StylusOutOfRangeEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusOutOfRangeEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting the stylus is now out of range of the digitizer
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnStylusOutOfRange(StylusEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.PreviewStylusSystemGestureEvent. 
    /// </summary> 
    public static final RoutedEvent PreviewStylusSystemGestureEvent = Stylus.PreviewStylusSystemGestureEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a stylus system gesture
    /// </summary>
    public /*event*/ StylusSystemGestureEventHandler PreviewStylusSystemGesture 
    {
        add { AddHandler(Stylus.PreviewStylusSystemGestureEvent, value, false); } 
        remove { RemoveHandler(Stylus.PreviewStylusSystemGestureEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting a stylus system gesture
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewStylusSystemGesture(StylusSystemGestureEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Stylus.StylusSystemGestureEvent. 
    /// </summary>
    public static final RoutedEvent StylusSystemGestureEvent = Stylus.StylusSystemGestureEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting a stylus system gesture
    /// </summary> 
    public /*event*/ StylusSystemGestureEventHandler StylusSystemGesture
    { 
        add { AddHandler(Stylus.StylusSystemGestureEvent, value, false); } 
        remove { RemoveHandler(Stylus.StylusSystemGestureEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a stylus system gesture
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnStylusSystemGesture(StylusSystemGestureEventArgs e) {}

    /// <summary> 
    ///     Alias to the Stylus.GotStylusCaptureEvent.
    /// </summary> 
    public static final RoutedEvent GotStylusCaptureEvent = Stylus.GotStylusCaptureEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting that this element got the stylus capture 
    /// </summary>
    public /*event*/ StylusEventHandler GotStylusCapture 
    { 
        add { AddHandler(Stylus.GotStylusCaptureEvent, value, false); }
        remove { RemoveHandler(Stylus.GotStylusCaptureEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting that this element got the stylus capture 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnGotStylusCapture(StylusEventArgs e) {} 

    /// <summary>
    ///     Alias to the Stylus.LostStylusCaptureEvent. 
    /// </summary>
    public static final RoutedEvent LostStylusCaptureEvent = Stylus.LostStylusCaptureEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting that this element lost the stylus capture
    /// </summary> 
    public /*event*/ StylusEventHandler LostStylusCapture 
    {
        add { AddHandler(Stylus.LostStylusCaptureEvent, value, false); } 
        remove { RemoveHandler(Stylus.LostStylusCaptureEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting that this element lost the stylus capture
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnLostStylusCapture(StylusEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Stylus.StylusButtonDownEvent.
    /// </summary>
    public static final RoutedEvent StylusButtonDownEvent = Stylus.StylusButtonDownEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the stylus button is down 
    /// </summary> 
    public /*event*/ StylusButtonEventHandler StylusButtonDown
    { 
        add { AddHandler(Stylus.StylusButtonDownEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusButtonDownEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting the stylus button is down 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnStylusButtonDown(StylusButtonEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.StylusButtonUpEvent.
    /// </summary>
    public static final RoutedEvent StylusButtonUpEvent = Stylus.StylusButtonUpEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the stylus button is up 
    /// </summary>
    public /*event*/ StylusButtonEventHandler StylusButtonUp 
    {
        add { AddHandler(Stylus.StylusButtonUpEvent, value, false); }
        remove { RemoveHandler(Stylus.StylusButtonUpEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting the stylus button is up 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnStylusButtonUp(StylusButtonEventArgs e) {} 

    /// <summary>
    ///     Alias to the Stylus.PreviewStylusButtonDownEvent.
    /// </summary> 
    public static final RoutedEvent PreviewStylusButtonDownEvent = Stylus.PreviewStylusButtonDownEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the stylus button is down
    /// </summary> 
    public /*event*/ StylusButtonEventHandler PreviewStylusButtonDown
    {
        add { AddHandler(Stylus.PreviewStylusButtonDownEvent, value, false); }
        remove { RemoveHandler(Stylus.PreviewStylusButtonDownEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting the stylus button is down
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewStylusButtonDown(StylusButtonEventArgs e) {}

    /// <summary>
    ///     Alias to the Stylus.PreviewStylusButtonUpEvent. 
    /// </summary>
    public static final RoutedEvent PreviewStylusButtonUpEvent = Stylus.PreviewStylusButtonUpEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the stylus button is up 
    /// </summary>
    public /*event*/ StylusButtonEventHandler PreviewStylusButtonUp
    {
        add { AddHandler(Stylus.PreviewStylusButtonUpEvent, value, false); } 
        remove { RemoveHandler(Stylus.PreviewStylusButtonUpEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the stylus button is up 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewStylusButtonUp(StylusButtonEventArgs e) {}

    /// <summary> 
    ///     Alias to the Keyboard.PreviewKeyDownEvent.
    /// </summary> 
    public static final RoutedEvent PreviewKeyDownEvent = Keyboard.PreviewKeyDownEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting a key was pressed
    /// </summary>
    public /*event*/ KeyEventHandler PreviewKeyDown
    { 
        add { AddHandler(Keyboard.PreviewKeyDownEvent, value, false); }
        remove { RemoveHandler(Keyboard.PreviewKeyDownEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting a key was pressed
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewKeyDown(KeyEventArgs e) {}

    /// <summary>
    ///     Alias to the Keyboard.KeyDownEvent. 
    /// </summary> 
    public static final RoutedEvent KeyDownEvent = Keyboard.KeyDownEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a key was pressed
    /// </summary>
    public /*event*/ KeyEventHandler KeyDown 
    {
        add { AddHandler(Keyboard.KeyDownEvent, value, false); } 
        remove { RemoveHandler(Keyboard.KeyDownEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting a key was pressed
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnKeyDown(KeyEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Keyboard.PreviewKeyUpEvent. 
    /// </summary>
    public static final RoutedEvent PreviewKeyUpEvent = Keyboard.PreviewKeyUpEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting a key was released
    /// </summary> 
    public /*event*/ KeyEventHandler PreviewKeyUp
    { 
        add { AddHandler(Keyboard.PreviewKeyUpEvent, value, false); } 
        remove { RemoveHandler(Keyboard.PreviewKeyUpEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a key was released
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewKeyUp(KeyEventArgs e) {}

    /// <summary> 
    ///     Alias to the Keyboard.KeyUpEvent.
    /// </summary> 
    public static final RoutedEvent KeyUpEvent = Keyboard.KeyUpEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a key was released 
    /// </summary>
    public /*event*/ KeyEventHandler KeyUp 
    { 
        add { AddHandler(Keyboard.KeyUpEvent, value, false); }
        remove { RemoveHandler(Keyboard.KeyUpEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting a key was released 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnKeyUp(KeyEventArgs e) {} 

    /// <summary>
    ///     Alias to the Keyboard.PreviewGotKeyboardFocusEvent. 
    /// </summary>
    public static final RoutedEvent PreviewGotKeyboardFocusEvent = Keyboard.PreviewGotKeyboardFocusEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting that the keyboard is focused on this element
    /// </summary> 
    public /*event*/ KeyboardFocusChangedEventHandler PreviewGotKeyboardFocus 
    {
        add { AddHandler(Keyboard.PreviewGotKeyboardFocusEvent, value, false); } 
        remove { RemoveHandler(Keyboard.PreviewGotKeyboardFocusEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting that the keyboard is focused on this element
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewGotKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Keyboard.GotKeyboardFocusEvent.
    /// </summary>
    public static final RoutedEvent GotKeyboardFocusEvent = Keyboard.GotKeyboardFocusEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting that the keyboard is focused on this element 
    /// </summary> 
    public /*event*/ KeyboardFocusChangedEventHandler GotKeyboardFocus
    { 
        add { AddHandler(Keyboard.GotKeyboardFocusEvent, value, false); }
        remove { RemoveHandler(Keyboard.GotKeyboardFocusEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting that the keyboard is focused on this element 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnGotKeyboardFocus(KeyboardFocusChangedEventArgs e) {}

    /// <summary>
    ///     Alias to the Keyboard.PreviewLostKeyboardFocusEvent.
    /// </summary>
    public static final RoutedEvent PreviewLostKeyboardFocusEvent = Keyboard.PreviewLostKeyboardFocusEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
    /// </summary>
    public /*event*/ KeyboardFocusChangedEventHandler PreviewLostKeyboardFocus 
    {
        add { AddHandler(Keyboard.PreviewLostKeyboardFocusEvent, value, false); }
        remove { RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewLostKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 

    /// <summary>
    ///     Alias to the Keyboard.LostKeyboardFocusEvent.
    /// </summary> 
    public static final RoutedEvent LostKeyboardFocusEvent = Keyboard.LostKeyboardFocusEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed
    /// </summary> 
    public /*event*/ KeyboardFocusChangedEventHandler LostKeyboardFocus
    {
        add { AddHandler(Keyboard.LostKeyboardFocusEvent, value, false); }
        remove { RemoveHandler(Keyboard.LostKeyboardFocusEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnLostKeyboardFocus(KeyboardFocusChangedEventArgs e) {}

    /// <summary>
    ///     Alias to the TextCompositionManager.PreviewTextInputEvent. 
    /// </summary>
    public static final RoutedEvent PreviewTextInputEvent = TextCompositionManager.PreviewTextInputEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting text composition 
    /// </summary>
    public /*event*/ TextCompositionEventHandler PreviewTextInput
    {
        add { AddHandler(TextCompositionManager.PreviewTextInputEvent, value, false); } 
        remove { RemoveHandler(TextCompositionManager.PreviewTextInputEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting text composition 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewTextInput(TextCompositionEventArgs e) {}

    /// <summary> 
    ///     Alias to the TextCompositionManager.TextInputEvent.
    /// </summary> 
    public static final RoutedEvent TextInputEvent = TextCompositionManager.TextInputEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting text composition
    /// </summary>
    public /*event*/ TextCompositionEventHandler TextInput
    { 
        add { AddHandler(TextCompositionManager.TextInputEvent, value, false); }
        remove { RemoveHandler(TextCompositionManager.TextInputEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting text composition
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnTextInput(TextCompositionEventArgs e) {}

    /// <summary>
    ///     Alias to the DragDrop.PreviewQueryContinueDragEvent. 
    /// </summary> 
    public static final RoutedEvent PreviewQueryContinueDragEvent = DragDrop.PreviewQueryContinueDragEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the preview query continue drag is going to happen
    /// </summary>
    public /*event*/ QueryContinueDragEventHandler PreviewQueryContinueDrag 
    {
        add { AddHandler(DragDrop.PreviewQueryContinueDragEvent, value, false); } 
        remove { RemoveHandler(DragDrop.PreviewQueryContinueDragEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the preview query continue drag is going to happen
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewQueryContinueDrag(QueryContinueDragEventArgs e) {} 

    /// <summary> 
    ///     Alias to the DragDrop.QueryContinueDragEvent. 
    /// </summary>
    public static final RoutedEvent QueryContinueDragEvent = DragDrop.QueryContinueDragEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the query continue drag is going to happen
    /// </summary> 
    public /*event*/ QueryContinueDragEventHandler QueryContinueDrag
    { 
        add { AddHandler(DragDrop.QueryContinueDragEvent, value, false); } 
        remove { RemoveHandler(DragDrop.QueryContinueDragEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the query continue drag is going to happen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnQueryContinueDrag(QueryContinueDragEventArgs e) {}

    /// <summary> 
    ///     Alias to the DragDrop.PreviewGiveFeedbackEvent.
    /// </summary> 
    public static final RoutedEvent PreviewGiveFeedbackEvent = DragDrop.PreviewGiveFeedbackEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the preview give feedback is going to happen 
    /// </summary>
    public /*event*/ GiveFeedbackEventHandler PreviewGiveFeedback 
    { 
        add { AddHandler(DragDrop.PreviewGiveFeedbackEvent, value, false); }
        remove { RemoveHandler(DragDrop.PreviewGiveFeedbackEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the preview give feedback is going to happen 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewGiveFeedback(GiveFeedbackEventArgs e) {} 

    /// <summary>
    ///     Alias to the DragDrop.GiveFeedbackEvent. 
    /// </summary>
    public static final RoutedEvent GiveFeedbackEvent = DragDrop.GiveFeedbackEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the give feedback is going to happen
    /// </summary> 
    public /*event*/ GiveFeedbackEventHandler GiveFeedback 
    {
        add { AddHandler(DragDrop.GiveFeedbackEvent, value, false); } 
        remove { RemoveHandler(DragDrop.GiveFeedbackEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting the give feedback is going to happen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnGiveFeedback(GiveFeedbackEventArgs e) {} 

    /// <summary> 
    ///     Alias to the DragDrop.PreviewDragEnterEvent.
    /// </summary>
    public static final RoutedEvent PreviewDragEnterEvent = DragDrop.PreviewDragEnterEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the preview drag enter is going to happen 
    /// </summary> 
    public /*event*/ DragEventHandler PreviewDragEnter
    { 
        add { AddHandler(DragDrop.PreviewDragEnterEvent, value, false); }
        remove { RemoveHandler(DragDrop.PreviewDragEnterEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting the preview drag enter is going to happen 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewDragEnter(DragEventArgs e) {}

    /// <summary>
    ///     Alias to the DragDrop.DragEnterEvent.
    /// </summary>
    public static final RoutedEvent DragEnterEvent = DragDrop.DragEnterEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the drag enter is going to happen 
    /// </summary>
    public /*event*/ DragEventHandler DragEnter 
    {
        add { AddHandler(DragDrop.DragEnterEvent, value, false); }
        remove { RemoveHandler(DragDrop.DragEnterEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting the drag enter is going to happen 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnDragEnter(DragEventArgs e) {} 

    /// <summary>
    ///     Alias to the DragDrop.PreviewDragOverEvent.
    /// </summary> 
    public static final RoutedEvent PreviewDragOverEvent = DragDrop.PreviewDragOverEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the preview drag over is going to happen
    /// </summary> 
    public /*event*/ DragEventHandler PreviewDragOver
    {
        add { AddHandler(DragDrop.PreviewDragOverEvent, value, false); }
        remove { RemoveHandler(DragDrop.PreviewDragOverEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting the preview drag over is going to happen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewDragOver(DragEventArgs e) {}

    /// <summary>
    ///     Alias to the DragDrop.DragOverEvent. 
    /// </summary>
    public static final RoutedEvent DragOverEvent = DragDrop.DragOverEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the drag over is going to happen 
    /// </summary>
    public /*event*/ DragEventHandler DragOver
    {
        add { AddHandler(DragDrop.DragOverEvent, value, false); } 
        remove { RemoveHandler(DragDrop.DragOverEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the drag over is going to happen 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnDragOver(DragEventArgs e) {}

    /// <summary> 
    ///     Alias to the DragDrop.PreviewDragLeaveEvent.
    /// </summary> 
    public static final RoutedEvent PreviewDragLeaveEvent = DragDrop.PreviewDragLeaveEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting the preview drag leave is going to happen
    /// </summary>
    public /*event*/ DragEventHandler PreviewDragLeave
    { 
        add { AddHandler(DragDrop.PreviewDragLeaveEvent, value, false); }
        remove { RemoveHandler(DragDrop.PreviewDragLeaveEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting the preview drag leave is going to happen
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewDragLeave(DragEventArgs e) {}

    /// <summary>
    ///     Alias to the DragDrop.DragLeaveEvent. 
    /// </summary> 
    public static final RoutedEvent DragLeaveEvent = DragDrop.DragLeaveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the drag leave is going to happen
    /// </summary>
    public /*event*/ DragEventHandler DragLeave 
    {
        add { AddHandler(DragDrop.DragLeaveEvent, value, false); } 
        remove { RemoveHandler(DragDrop.DragLeaveEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the drag leave is going to happen
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnDragLeave(DragEventArgs e) {} 

    /// <summary> 
    ///     Alias to the DragDrop.PreviewDropEvent. 
    /// </summary>
    public static final RoutedEvent PreviewDropEvent = DragDrop.PreviewDropEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the preview drop is going to happen
    /// </summary> 
    public /*event*/ DragEventHandler PreviewDrop
    { 
        add { AddHandler(DragDrop.PreviewDropEvent, value, false); } 
        remove { RemoveHandler(DragDrop.PreviewDropEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting the preview drop is going to happen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewDrop(DragEventArgs e) {}

    /// <summary> 
    ///     Alias to the DragDrop.DropEvent.
    /// </summary> 
    public static final RoutedEvent DropEvent = DragDrop.DropEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting the drag enter is going to happen 
    /// </summary>
    public /*event*/ DragEventHandler Drop 
    { 
        add { AddHandler(DragDrop.DropEvent, value, false); }
        remove { RemoveHandler(DragDrop.DropEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the drag enter is going to happen 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnDrop(DragEventArgs e) {} 

    /// <summary>
    ///     Alias to the Touch.PreviewTouchDownEvent. 
    /// </summary>
    public static final RoutedEvent PreviewTouchDownEvent = Touch.PreviewTouchDownEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting a finger touched the screen
    /// </summary> 
//    [CustomCategory(SRID.Touch_Category)] 
    public /*event*/ EventHandler<TouchEventArgs> PreviewTouchDown
    { 
        add { AddHandler(Touch.PreviewTouchDownEvent, value, false); }
        remove { RemoveHandler(Touch.PreviewTouchDownEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting a finger touched the screen 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewTouchDown(TouchEventArgs e) {}

    /// <summary>
    ///     Alias to the Touch.TouchDownEvent.
    /// </summary>
    public static final RoutedEvent TouchDownEvent = Touch.TouchDownEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting a finger touched the screen 
    /// </summary>
//    [CustomCategory(SRID.Touch_Category)] 
    public /*event*/ EventHandler<TouchEventArgs> TouchDown
    {
        add { AddHandler(Touch.TouchDownEvent, value, false); }
        remove { RemoveHandler(Touch.TouchDownEvent, value); } 
    }

    /// <summary> 
    ///     Virtual method reporting a finger touched the screen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnTouchDown(TouchEventArgs e) {}

    /// <summary>
    ///     Alias to the Touch.PreviewTouchMoveEvent. 
    /// </summary>
    public static final RoutedEvent PreviewTouchMoveEvent = Touch.PreviewTouchMoveEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting a finger moved across the screen 
    /// </summary>
//    [CustomCategory(SRID.Touch_Category)]
    public /*event*/ EventHandler<TouchEventArgs> PreviewTouchMove
    { 
        add { AddHandler(Touch.PreviewTouchMoveEvent, value, false); }
        remove { RemoveHandler(Touch.PreviewTouchMoveEvent, value); } 
    } 

    /// <summary> 
    ///     Virtual method reporting a finger moved across the screen
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnPreviewTouchMove(TouchEventArgs e) {}

    /// <summary>
    ///     Alias to the Touch.TouchMoveEvent. 
    /// </summary> 
    public static final RoutedEvent TouchMoveEvent = Touch.TouchMoveEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a finger moved across the screen
    /// </summary>
//    [CustomCategory(SRID.Touch_Category)] 
    public /*event*/ EventHandler<TouchEventArgs> TouchMove
    { 
        add { AddHandler(Touch.TouchMoveEvent, value, false); } 
        remove { RemoveHandler(Touch.TouchMoveEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a finger moved across the screen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnTouchMove(TouchEventArgs e) {}

    /// <summary> 
    ///     Alias to the Touch.PreviewTouchUpEvent.
    /// </summary> 
    public static final RoutedEvent PreviewTouchUpEvent = Touch.PreviewTouchUpEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a finger lifted off the screen 
    /// </summary>
//    [CustomCategory(SRID.Touch_Category)] 
    public /*event*/ EventHandler<TouchEventArgs> PreviewTouchUp 
    {
        add { AddHandler(Touch.PreviewTouchUpEvent, value, false); } 
        remove { RemoveHandler(Touch.PreviewTouchUpEvent, value); }
    }

    /// <summary> 
    ///     Virtual method reporting a finger lifted off the screen
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnPreviewTouchUp(TouchEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Touch.TouchUpEvent.
    /// </summary>
    public static final RoutedEvent TouchUpEvent = Touch.TouchUpEvent.AddOwner(_typeofThis);

    /// <summary>
    ///     Event reporting a finger lifted off the screen 
    /// </summary> 
//    [CustomCategory(SRID.Touch_Category)]
    public /*event*/ EventHandler<TouchEventArgs> TouchUp 
    {
        add { AddHandler(Touch.TouchUpEvent, value, false); }
        remove { RemoveHandler(Touch.TouchUpEvent, value); }
    } 

    /// <summary> 
    ///     Virtual method reporting a finger lifted off the screen 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnTouchUp(TouchEventArgs e) {} 

    /// <summary>
    ///     Alias to the Touch.GotTouchCaptureEvent.
    /// </summary> 
    public static final RoutedEvent GotTouchCaptureEvent = Touch.GotTouchCaptureEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting a finger was captured to an element
    /// </summary> 
//    [CustomCategory(SRID.Touch_Category)]
    public /*event*/ EventHandler<TouchEventArgs> GotTouchCapture
    {
        add { AddHandler(Touch.GotTouchCaptureEvent, value, false); } 
        remove { RemoveHandler(Touch.GotTouchCaptureEvent, value); }
    } 

    /// <summary>
    ///     Virtual method reporting a finger was captured to an element 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnGotTouchCapture(TouchEventArgs e) {}

    /// <summary> 
    ///     Alias to the Touch.LostTouchCaptureEvent.
    /// </summary> 
    public static final RoutedEvent LostTouchCaptureEvent = Touch.LostTouchCaptureEvent.AddOwner(_typeofThis); 

    /// <summary> 
    ///     Event reporting a finger is no longer captured to an element
    /// </summary>
//    [CustomCategory(SRID.Touch_Category)]
    public /*event*/ EventHandler<TouchEventArgs> LostTouchCapture 
    {
        add { AddHandler(Touch.LostTouchCaptureEvent, value, false); } 
        remove { RemoveHandler(Touch.LostTouchCaptureEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting a finger is no longer captured to an element
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnLostTouchCapture(TouchEventArgs e) {} 

    /// <summary> 
    ///     Alias to the Touch.TouchEnterEvent. 
    /// </summary>
    public static final RoutedEvent TouchEnterEvent = Touch.TouchEnterEvent.AddOwner(_typeofThis); 

    /// <summary>
    ///     Event reporting the mouse entered this element
    /// </summary> 
//    [CustomCategory(SRID.Touch_Category)]
    public /*event*/ EventHandler<TouchEventArgs> TouchEnter 
    { 
        add { AddHandler(Touch.TouchEnterEvent, value, false); }
        remove { RemoveHandler(Touch.TouchEnterEvent, value); } 
    }

    /// <summary>
    ///     Virtual method reporting the mouse entered this element 
    /// </summary>
    protected /*internal*/ /*virtual*/ void OnTouchEnter(TouchEventArgs e) {} 

    /// <summary>
    ///     Alias to the Touch.TouchLeaveEvent. 
    /// </summary>
    public static final RoutedEvent TouchLeaveEvent = Touch.TouchLeaveEvent.AddOwner(_typeofThis);

    /// <summary> 
    ///     Event reporting the mouse left this element
    /// </summary> 
//    [CustomCategory(SRID.Touch_Category)] 
    public /*event*/ EventHandler<TouchEventArgs> TouchLeave
    { 
        add { AddHandler(Touch.TouchLeaveEvent, value, false); }
        remove { RemoveHandler(Touch.TouchLeaveEvent, value); }
    }

    /// <summary>
    ///     Virtual method reporting the mouse left this element 
    /// </summary> 
    protected /*internal*/ /*virtual*/ void OnTouchLeave(TouchEventArgs e) {}

    /// <summary>
    ///     The dependency property for the IsMouseDirectlyOver property.
    /// </summary>
    public static final DependencyProperty IsMouseDirectlyOverProperty = UIElement.IsMouseDirectlyOverProperty.AddOwner(_typeofThis); 

    private static void IsMouseDirectlyOver_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    { 
        ((ContentElement) d).RaiseIsMouseDirectlyOverChanged(e);
    } 

    /// <summary>
    ///     An /*event*/ reporting that the IsMouseDirectlyOver property changed.
    /// </summary> 
    public /*event*/ DependencyPropertyChangedEventHandler IsMouseDirectlyOverChanged
    { 
        add    { EventHandlersStoreAdd(UIElement.IsMouseDirectlyOverChangedKey, value); } 
        remove { EventHandlersStoreRemove(UIElement.IsMouseDirectlyOverChangedKey, value); }
    } 

    /// <summary>
    ///     An /*event*/ reporting that the IsMouseDirectlyOver property changed.
    /// </summary> 
    protected /*virtual*/ void OnIsMouseDirectlyOverChanged(DependencyPropertyChangedEventArgs e)
    { 
    } 

    private void RaiseIsMouseDirectlyOverChanged(DependencyPropertyChangedEventArgs args) 
    {
        // Call the virtual method first.
        OnIsMouseDirectlyOverChanged(args);

        // Raise the public event second.
        RaiseDependencyPropertyChanged(UIElement.IsMouseDirectlyOverChangedKey, args); 
    } 

    /// <summary> 
    ///     The dependency property for the IsMouseOver property.
    /// </summary>
    public static final DependencyProperty IsMouseOverProperty = UIElement.IsMouseOverProperty.AddOwner(_typeofThis);

    /// <summary>
    ///     The dependency property for the IsStylusOver property. 
    /// </summary> 
    public static final DependencyProperty IsStylusOverProperty = UIElement.IsStylusOverProperty.AddOwner(_typeofThis);

    /// <summary>
    ///     The dependency property for the IsKeyboardFocusWithin property.
    /// </summary>
    public static final DependencyProperty IsKeyboardFocusWithinProperty = UIElement.IsKeyboardFocusWithinProperty.AddOwner(_typeofThis); 

    /// <summary> 
    ///     An event reporting that the IsKeyboardFocusWithin property changed. 
    /// </summary>
    public /*event*/ DependencyPropertyChangedEventHandler IsKeyboardFocusWithinChanged 
    {
        add    { EventHandlersStoreAdd(UIElement.IsKeyboardFocusWithinChangedKey, value); }
        remove { EventHandlersStoreRemove(UIElement.IsKeyboardFocusWithinChangedKey, value); }
    } 

    /// <summary> 
    ///     An event reporting that the IsKeyboardFocusWithin property changed. 
    /// </summary>
    protected /*virtual*/ void OnIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs e) 
    {
    }

    /*internal*/ public void RaiseIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs args) 
    {
        // Call the virtual method first. 
        OnIsKeyboardFocusWithinChanged(args); 

        // Raise the public event second. 
        RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusWithinChangedKey, args);
    }

    /// <summary> 
    ///     The dependency property for the IsMouseCaptured property.
    /// </summary> 
    public static final DependencyProperty IsMouseCapturedProperty = UIElement.IsMouseCapturedProperty.AddOwner(_typeofThis); 

    private static void IsMouseCaptured_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        ((ContentElement) d).RaiseIsMouseCapturedChanged(e);
    }

    /// <summary>
    ///     An event reporting that the IsMouseCaptured property changed. 
    /// </summary> 
    public /*event*/ DependencyPropertyChangedEventHandler IsMouseCapturedChanged
    { 
        add    { EventHandlersStoreAdd(UIElement.IsMouseCapturedChangedKey, value); }
        remove { EventHandlersStoreRemove(UIElement.IsMouseCapturedChangedKey, value); }
    }

    /// <summary>
    ///     An event reporting that the IsMouseCaptured property changed. 
    /// </summary> 
    protected /*virtual*/ void OnIsMouseCapturedChanged(DependencyPropertyChangedEventArgs e)
    { 
    }

    private void RaiseIsMouseCapturedChanged(DependencyPropertyChangedEventArgs args)
    { 
        // Call the virtual method first.
        OnIsMouseCapturedChanged(args); 

        // Raise the public event second.
        RaiseDependencyPropertyChanged(UIElement.IsMouseCapturedChangedKey, args); 
    }

    /// <summary>
    ///     The dependency property for the IsMouseCaptureWithin property. 
    /// </summary>
    public static final DependencyProperty IsMouseCaptureWithinProperty = UIElement.IsMouseCaptureWithinProperty.AddOwner(_typeofThis); 

    /// <summary>
    ///     An event reporting that the IsMouseCaptureWithin property changed. 
    /// </summary>
    public /*event*/ DependencyPropertyChangedEventHandler IsMouseCaptureWithinChanged
    {
        add    { EventHandlersStoreAdd(UIElement.IsMouseCaptureWithinChangedKey, value); } 
        remove { EventHandlersStoreRemove(UIElement.IsMouseCaptureWithinChangedKey, value); }
    } 

    /// <summary>
    ///     An event reporting that the IsMouseCaptureWithin property changed. 
    /// </summary>
    protected /*virtual*/ void OnIsMouseCaptureWithinChanged(DependencyPropertyChangedEventArgs e)
    {
    } 

    /*internal*/ public void RaiseIsMouseCaptureWithinChanged(DependencyPropertyChangedEventArgs args) 
    { 
        // Call the virtual method first.
        OnIsMouseCaptureWithinChanged(args); 

        // Raise the public event second.
        RaiseDependencyPropertyChanged(UIElement.IsMouseCaptureWithinChangedKey, args);
    } 

    /// <summary> 
    ///     The dependency property for the IsStylusDirectlyOver property. 
    /// </summary>
    public static final DependencyProperty IsStylusDirectlyOverProperty = UIElement.IsStylusDirectlyOverProperty.AddOwner(_typeofThis); 

    private static void IsStylusDirectlyOver_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        ((ContentElement) d).RaiseIsStylusDirectlyOverChanged(e); 
    }

    /// <summary> 
    ///     An event reporting that the IsStylusDirectlyOver property changed.
    /// </summary> 
    public /*event*/ DependencyPropertyChangedEventHandler IsStylusDirectlyOverChanged
    {
        add    { EventHandlersStoreAdd(UIElement.IsStylusDirectlyOverChangedKey, value); }
        remove { EventHandlersStoreRemove(UIElement.IsStylusDirectlyOverChangedKey, value); } 
    }

    /// <summary> 
    ///     An event reporting that the IsStylusDirectlyOver property changed.
    /// </summary> 
    protected /*virtual*/ void OnIsStylusDirectlyOverChanged(DependencyPropertyChangedEventArgs e)
    {
    }

    private void RaiseIsStylusDirectlyOverChanged(DependencyPropertyChangedEventArgs args)
    { 
        // Call the virtual method first. 
        OnIsStylusDirectlyOverChanged(args);

        // Raise the public event second.
        RaiseDependencyPropertyChanged(UIElement.IsStylusDirectlyOverChangedKey, args);
    }

    /// <summary>
    ///     The dependency property for the IsStylusCaptured property. 
    /// </summary> 
    public static final DependencyProperty IsStylusCapturedProperty = UIElement.IsStylusCapturedProperty.AddOwner(_typeofThis);

    private static void IsStylusCaptured_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        ((ContentElement) d).RaiseIsStylusCapturedChanged(e);
    } 

    /// <summary> 
    ///     An event reporting that the IsStylusCaptured property changed. 
    /// </summary>
    public /*event*/ DependencyPropertyChangedEventHandler IsStylusCapturedChanged 
    {
        add    { EventHandlersStoreAdd(UIElement.IsStylusCapturedChangedKey, value); }
        remove { EventHandlersStoreRemove(UIElement.IsStylusCapturedChangedKey, value); }
    } 

    /// <summary> 
    ///     An event reporting that the IsStylusCaptured property changed. 
    /// </summary>
    protected /*virtual*/ void OnIsStylusCapturedChanged(DependencyPropertyChangedEventArgs e) 
    {
    }

    private void RaiseIsStylusCapturedChanged(DependencyPropertyChangedEventArgs args) 
    {
        // Call the virtual method first. 
        OnIsStylusCapturedChanged(args); 

        // Raise the public event second. 
        RaiseDependencyPropertyChanged(UIElement.IsStylusCapturedChangedKey, args);
    }

    /// <summary> 
    ///     The dependency property for the IsStylusCaptureWithin property.
    /// </summary> 
    public static final DependencyProperty IsStylusCaptureWithinProperty = UIElement.IsStylusCaptureWithinProperty.AddOwner(_typeofThis); 

    /// <summary> 
    ///     An event reporting that the IsStylusCaptureWithin property changed.
    /// </summary>
    public /*event*/ DependencyPropertyChangedEventHandler IsStylusCaptureWithinChanged
    { 
        add    { EventHandlersStoreAdd(UIElement.IsStylusCaptureWithinChangedKey, value); }
        remove { EventHandlersStoreRemove(UIElement.IsStylusCaptureWithinChangedKey, value); } 
    } 

    /// <summary> 
    ///     An event reporting that the IsStylusCaptureWithin property changed.
    /// </summary>
    protected /*virtual*/ void OnIsStylusCaptureWithinChanged(DependencyPropertyChangedEventArgs e)
    { 
    }

    /*internal*/ public void RaiseIsStylusCaptureWithinChanged(DependencyPropertyChangedEventArgs args) 
    {
        // Call the virtual method first. 
        OnIsStylusCaptureWithinChanged(args);

        // Raise the public event second.
        RaiseDependencyPropertyChanged(UIElement.IsStylusCaptureWithinChangedKey, args); 
    }

    /// <summary> 
    ///     The dependency property for the IsKeyboardFocused property.
    /// </summary> 
    public static final DependencyProperty IsKeyboardFocusedProperty = UIElement.IsKeyboardFocusedProperty.AddOwner(_typeofThis);

    private static void IsKeyboardFocused_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        ((ContentElement) d).RaiseIsKeyboardFocusedChanged(e);
    } 

    /// <summary>
    ///     An event reporting that the IsKeyboardFocused property changed. 
    /// </summary>
    public /*event*/ DependencyPropertyChangedEventHandler IsKeyboardFocusedChanged
    {
        add    { EventHandlersStoreAdd(UIElement.IsKeyboardFocusedChangedKey, value); } 
        remove { EventHandlersStoreRemove(UIElement.IsKeyboardFocusedChangedKey, value); }
    } 

    /// <summary>
    ///     An event reporting that the IsKeyboardFocused property changed. 
    /// </summary>
    protected /*virtual*/ void OnIsKeyboardFocusedChanged(DependencyPropertyChangedEventArgs e)
    {
    } 

    private void RaiseIsKeyboardFocusedChanged(DependencyPropertyChangedEventArgs args) 
    { 
        // Call the virtual method first.
        OnIsKeyboardFocusedChanged(args); 

        // Raise the public event second.
        RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusedChangedKey, args);
    } 

    /// <summary> 
    ///     The dependency property for the AreAnyTouchesDirectlyOver property. 
    /// </summary>
    public static final DependencyProperty AreAnyTouchesDirectlyOverProperty = UIElement.AreAnyTouchesDirectlyOverProperty.AddOwner(_typeofThis); 

    /// <summary>
    ///     The dependency property for the AreAnyTouchesOver property.
    /// </summary> 
    public static final DependencyProperty AreAnyTouchesOverProperty = UIElement.AreAnyTouchesOverProperty.AddOwner(_typeofThis);

    /// <summary> 
    ///     The dependency property for the AreAnyTouchesCaptured property.
    /// </summary> 
    public static final DependencyProperty AreAnyTouchesCapturedProperty = UIElement.AreAnyTouchesCapturedProperty.AddOwner(_typeofThis);

    /// <summary>
    ///     The dependency property for the AreAnyTouchesCapturedWithin property. 
    /// </summary>
    public static final DependencyProperty AreAnyTouchesCapturedWithinProperty = UIElement.AreAnyTouchesCapturedWithinProperty.AddOwner(_typeofThis); 

    /*internal*/ public boolean ReadFlag(CoreFlags field)
    { 
        return (_flags & field) != 0;
    }

    /*internal*/ public void WriteFlag(CoreFlags field,boolean value) 
    {
        if (value) 
        { 
             _flags |= field;
        } 
        else
        {
             _flags &= (~field);
        } 
    }

    private CoreFlags       _flags; 

//    #region Construction

    /// <summary>
    ///     Static Constructor for ContentElement 
    /// </summary> 
    /// <SecurityNote>
    ///     Critical: This hooks up a bunch of thunks which are all critical since they 
    ///     can be used to spoof input
    ///     TreatAsSafe: Since it does not expose the thunks
    /// </SecurityNote>
//    [SecurityCritical,SecurityTreatAsSafe] 
    static //ContentElement()
    { 
        UIElement.RegisterEvents(typeof(ContentElement)); 
        RegisterProperties();

        UIElement.IsFocusedPropertyKey.OverrideMetadata(
            typeof(ContentElement),
            new PropertyMetadata(
                BooleanBoxes.FalseBox, // default value 
                new PropertyChangedCallback(IsFocused_Changed)));
    } 

//    #endregion Construction

//    #region DependencyObject

//    #endregion

    /// <summary>
    /// Helper, gives the UIParent under control of which 
    /// the OnMeasure or OnArrange are currently called. 
    /// This may be implemented as a tree walk up until
    /// LayoutElement is found. 
    /// </summary>
    /*internal*/ public DependencyObject GetUIParent()
    {
        return GetUIParent(false); 
    }

    /*internal*/ public DependencyObject GetUIParent(boolean continuePastVisualTree) 
    {
        DependencyObject e = null; 

        // Try to find a UIElement parent in the visual ancestry.
        e = InputElement.GetContainingInputElement(_parent) as DependencyObject;

        // If there was no InputElement parent in the visual ancestry,
        // check along the logical branch. 
        if(e == null && continuePastVisualTree) 
        {
            DependencyObject doParent = GetUIParentCore(); 
            e = InputElement.GetContainingInputElement(doParent) as DependencyObject;
        }

        return e; 
    }

    /// <summary> 
    ///     Called to get the UI parent of this element when there is
    ///     no visual parent. 
    /// </summary>
    /// <returns>
    ///     Returns a non-null value when some framework implementation
    ///     of this method has a non-visual parent connection, 
    /// </returns>
    protected /*virtual*/ /*internal*/ DependencyObject GetUIParentCore() 
    { 
        return null;
    } 

    /*internal*/ public DependencyObject Parent
    {
        get 
        {
            return _parent; 
        } 
    }

    /// <summary>
    /// OnContentParentChanged is called when the parent of the content element is changed.
    /// </summary>
    /// <param name="oldParent">Old parent or null if the content element did not have a parent before.</param> 
//    [FriendAccessAllowed] // Built into Core, also used by Framework.
    /*internal*/ public /*virtual*/ void OnContentParentChanged(DependencyObject oldParent) 
    { 
        SynchronizeReverseInheritPropertyFlags(oldParent, true);
    } 

//    #region Automation

    /// <summary> 
    /// Called by the Automation infrastructure when AutomationPeer
    /// is requested for this element. The element can return null or 
    /// the instance of AutomationPeer-derived clas, if it supports UI Automation 
    /// </summary>
    protected /*virtual*/ AutomationPeer OnCreateAutomationPeer() { return null; } 

    /// <summary>
    /// Called by the Automation infrastructure or Control author
    /// to make sure the AutomationPeer is created. The element may 
    /// create AP or return null, depending on OnCreateAutomationPeer override.
    /// </summary> 
    /*internal*/ public AutomationPeer CreateAutomationPeer() 
    {
        VerifyAccess(); //this will ensure the AP is created in the right context 

        AutomationPeer ap = null;

        if (HasAutomationPeer) 
        {
            ap = AutomationPeerField.GetValue(this); 
        } 
        else
        { 
            ap = OnCreateAutomationPeer();

            if (ap != null)
            { 
                AutomationPeerField.SetValue(this, ap);
                HasAutomationPeer = true; 
            } 
        }
        return ap; 
    }

    /// <summary>
    /// Returns AutomationPeer if one exists. 
    /// The AutomationPeer may not exist if not yet created by Automation infrastructure
    /// or if this element is not supposed to have one. 
    /// </summary> 
    /*internal*/ public AutomationPeer GetAutomationPeer()
    { 
        VerifyAccess();

        if (HasAutomationPeer)
            return AutomationPeerField.GetValue(this); 

        return null; 
    } 

    // If this element is currently listening to synchronized input, add a pre-opportunity handler to keep track of event routed through this element. 
    /*internal*/ public void AddSynchronizedInputPreOpportunityHandler(EventRoute route, RoutedEventArgs args)
    {
        if (InputManager.IsSynchronizedInput)
        { 
            if (SynchronizedInputHelper.IsListening(this, args))
            { 
                RoutedEventHandler eventHandler = new RoutedEventHandler(this.SynchronizedInputPreOpportunityHandler); 
                SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, false);
            } 
        }
    }

    // If this element is currently listening to synchronized input, add a handler to post process the synchronized input otherwise 
    // add a synchronized input pre-opportunity handler from parent if parent is listening.
    /*internal*/ public void AddSynchronizedInputPostOpportunityHandler(EventRoute route, RoutedEventArgs args) 
    { 
        if (InputManager.IsSynchronizedInput)
        { 
            if (SynchronizedInputHelper.IsListening(this, args))
            {
                RoutedEventHandler eventHandler = new RoutedEventHandler(this.SynchronizedInputPostOpportunityHandler);
                SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, true); 
            }
            else 
            { 
                // Add a preview handler from the parent.
                SynchronizedInputHelper.AddParentPreOpportunityHandler(this, route, args); 
            }
        }

    } 

    // This event handler to be called before all the class & instance handlers for this element. 
    /*internal*/ public void SynchronizedInputPreOpportunityHandler(Object sender, RoutedEventArgs args) 
    {
        if (!args.Handled) 
        {
            SynchronizedInputHelper.PreOpportunityHandler(sender, args);
        }
    } 
    // This event handler to be called after class & instance handlers for this element.
    /*internal*/ public void SynchronizedInputPostOpportunityHandler(Object sender, RoutedEventArgs args) 
    { 
        if (args.Handled && (InputManager.SynchronizedInputState == SynchronizedInputStates.HadOpportunity))
        { 
            SynchronizedInputHelper.PostOpportunityHandler(sender, args);
        }
    }


    // Called by automation peer, when called this element will be the listening element for synchronized input. 
    /*internal*/ public boolean StartListeningSynchronizedInput(SynchronizedInputType inputType) 
    {
        if (InputManager.IsSynchronizedInput) 
        {
            return false;
        }
        else 
        {
            InputManager.StartListeningSynchronizedInput(this, inputType); 
            return true; 
        }
    } 

    // When called, input processing will return to normal mode.
    /*internal*/ public void CancelSynchronizedInput()
    { 
        InputManager.CancelSynchronizedInput();
    } 

//    #endregion Automation

//    #region Input

    /// <summary>
    ///     A property indicating if the mouse is over this element or not. 
    /// </summary>
    public boolean IsMouseDirectlyOver 
    { 
        get
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
            return IsMouseDirectlyOver_ComputeValue();
        } 
    }

    private boolean IsMouseDirectlyOver_ComputeValue() 
    {
        return (Mouse.DirectlyOver == this); 
    }

    /// <summary>
    ///     Asynchronously re-evaluate the reverse-inherited properties. 
    /// </summary>
//    [FriendAccessAllowed] 
    /*internal*/ public void SynchronizeReverseInheritPropertyFlags(DependencyObject oldParent, boolean isCoreParent) 
    {
        if(IsKeyboardFocusWithin) 
        {
            Keyboard.PrimaryDevice.ReevaluateFocusAsync(this, oldParent, isCoreParent);
        }

        // Reevelauate the stylus properties first to guarentee that our property change
        // notifications fire before mouse properties. 
        if(IsStylusOver) 
        {
            StylusLogic.CurrentStylusLogicReevaluateStylusOver(this, oldParent, isCoreParent); 
        }

        if(IsStylusCaptureWithin)
        { 
            StylusLogic.CurrentStylusLogicReevaluateCapture(this, oldParent, isCoreParent);
        } 

        if(IsMouseOver)
        { 
            Mouse.PrimaryDevice.ReevaluateMouseOver(this, oldParent, isCoreParent);
        }

        if(IsMouseCaptureWithin) 
        {
            Mouse.PrimaryDevice.ReevaluateCapture(this, oldParent, isCoreParent); 
        } 

        if (AreAnyTouchesOver) 
        {
            TouchDevice.ReevaluateDirectlyOver(this, oldParent, isCoreParent);
        }

        if (AreAnyTouchesCapturedWithin)
        { 
            TouchDevice.ReevaluateCapturedWithin(this, oldParent, isCoreParent); 
        }
    } 

    /// <summary>
        /// BlockReverseInheritance method when overriden stops reverseInheritProperties from updating their parent level properties.
    /// </summary> 
    /*internal*/ public /*virtual*/ boolean BlockReverseInheritance()
    { 
        return false; 
    }

    /// <summary>
    ///     A property indicating if the mouse is over this element or not.
    /// </summary>
    public boolean IsMouseOver 
    {
        get 
        { 
            return ReadFlag(CoreFlags.IsMouseOverCache);
        } 
    }

    /// <summary>
    ///     A property indicating if the stylus is over this element or not. 
    /// </summary>
    public boolean IsStylusOver 
    { 
        get
        { 
            return ReadFlag(CoreFlags.IsStylusOverCache);
        }
    }

    /// <summary>
    ///     Indicates if Keyboard Focus is anywhere 
    ///     within in the subtree starting at the 
    ///     current instance
    /// </summary> 
    public boolean IsKeyboardFocusWithin
    {
        get
        { 
            return ReadFlag(CoreFlags.IsKeyboardFocusWithinCache);
        } 
    } 

    /// <summary> 
    ///     A property indicating if the mouse is captured to this element or not.
    /// </summary>
    public boolean IsMouseCaptured
    { 
        get { return (boolean) GetValue(IsMouseCapturedProperty); }
    } 

    /// <summary>
    ///     Captures the mouse to this element. 
    /// </summary>
    public boolean CaptureMouse()
    {
        return Mouse.Capture(this); 
    }

    /// <summary> 
    ///     Releases the mouse capture.
    /// </summary> 
    public void ReleaseMouseCapture()
    {
        Mouse.Capture(null);
    } 

    /// <summary> 
    ///     Indicates if mouse capture is anywhere within in the subtree 
    ///     starting at the current instance
    /// </summary> 
    public boolean IsMouseCaptureWithin
    {
        get
        { 
            return ReadFlag(CoreFlags.IsMouseCaptureWithinCache);
        } 
    } 

    /// <summary> 
    ///     A property indicating if the stylus is over this element or not.
    /// </summary>
    public boolean IsStylusDirectlyOver
    { 
        get
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
            return IsStylusDirectlyOver_ComputeValue(); 
        }
    }

    private boolean IsStylusDirectlyOver_ComputeValue() 
    {
        return (Stylus.DirectlyOver == this); 
    } 

    /// <summary> 
    ///     A property indicating if the stylus is captured to this element or not.
    /// </summary>
    public boolean IsStylusCaptured
    { 
        get { return (boolean) GetValue(IsStylusCapturedProperty); }
    } 

    /// <summary>
    ///     Captures the stylus to this element. 
    /// </summary>
    public boolean CaptureStylus()
    {
        return Stylus.Capture(this); 
    }

    /// <summary> 
    ///     Releases the stylus capture.
    /// </summary> 
    public void ReleaseStylusCapture()
    {
        Stylus.Capture(null);
    } 

    /// <summary> 
    ///     Indicates if stylus capture is anywhere within in the subtree 
    ///     starting at the current instance
    /// </summary> 
    public boolean IsStylusCaptureWithin
    {
        get
        { 
            return ReadFlag(CoreFlags.IsStylusCaptureWithinCache);
        } 
    } 

    /// <summary> 
    ///     A property indicating if the keyboard is focused on this
    ///     element or not.
    /// </summary>
    public boolean IsKeyboardFocused 
    {
        get 
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
            return IsKeyboardFocused_ComputeValue();
        }
    }

    private boolean IsKeyboardFocused_ComputeValue()
    { 
        return (Keyboard.FocusedElement == this); 
    }

    /// <summary>
    ///     Focuses the keyboard on this element.
    /// </summary>
    public boolean Focus() 
    {
        return Keyboard.Focus(this) == this; 
    } 

    /// <summary> 
    ///     Request to move the focus from this element to another element
    /// </summary>
    /// <param name="request">Determine how to move the focus</param>
    /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns> 
    public /*virtual*/ boolean MoveFocus(TraversalRequest request)
    { 
        return false; 
    }

    /// <summary>
    ///     Request to predict the element that should receive focus relative to this element for a
    /// given direction, without actually moving focus to it.
    /// </summary> 
    /// <param name="direction">The direction for which focus should be predicted</param>
    /// <returns> 
    ///     Returns the next element that focus should move to for a given FocusNavigationDirection. 
    /// Returns null if focus cannot be moved relative to this element.
    /// </returns> 
    public /*virtual*/ DependencyObject PredictFocus(FocusNavigationDirection direction)
    {
        return null;
    } 

    /// <summary> 
    ///     GotFocus event 
    /// </summary>
    public static final RoutedEvent GotFocusEvent = FocusManager.GotFocusEvent.AddOwner(typeof(ContentElement)); 

    /// <summary>
    ///     An event announcing that IsFocused changed to true.
    /// </summary> 
    public /*event*/ RoutedEventHandler GotFocus
    { 
        add { AddHandler(GotFocusEvent, value); } 
        remove { RemoveHandler(GotFocusEvent, value); }
    } 

    /// <summary>
    ///     LostFocus event
    /// </summary> 
    public static final RoutedEvent LostFocusEvent = FocusManager.LostFocusEvent.AddOwner(typeof(ContentElement));

    /// <summary> 
    ///     An event announcing that IsFocused changed to false.
    /// </summary> 
    public /*event*/ RoutedEventHandler LostFocus
    {
        add { AddHandler(LostFocusEvent, value); }
        remove { RemoveHandler(LostFocusEvent, value); } 
    }

    /// <summary> 
    ///     The DependencyProperty for IsFocused.
    ///     Flags:              None 
    ///     Read-Only:          true
    /// </summary>
    public static final DependencyProperty IsFocusedProperty =
                UIElement.IsFocusedProperty.AddOwner( 
                            typeof(ContentElement));

    private static void IsFocused_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        ContentElement ce = ((ContentElement) d); 

        if ((boolean) e.NewValue)
        {
            ce.OnGotFocus(new RoutedEventArgs(GotFocusEvent, ce)); 
        }
        else 
        { 
            ce.OnLostFocus(new RoutedEventArgs(LostFocusEvent, ce));
        } 
    }

    /// <summary>
    ///     This method is invoked when the IsFocused property changes to true 
    /// </summary>
    /// <param name="e">RoutedEventArgs</param> 
    protected /*virtual*/ void OnGotFocus(RoutedEventArgs e) 
    {
        RaiseEvent(e); 
    }

    /// <summary>
    ///     This method is invoked when the IsFocused property changes to false 
    /// </summary>
    /// <param name="e">RoutedEventArgs</param> 
    protected /*virtual*/ void OnLostFocus(RoutedEventArgs e) 
    {
        RaiseEvent(e); 
    }

    /// <summary>
    ///     Gettor for IsFocused Property 
    /// </summary>
    public boolean IsFocused 
    { 
        get { return (boolean) GetValue(IsFocusedProperty); }
    } 

    /// <summary>
    ///     The DependencyProperty for the IsEnabled property.
    /// </summary> 
    public static final DependencyProperty IsEnabledProperty =
                UIElement.IsEnabledProperty.AddOwner( 
                            typeof(ContentElement), 
                            new UIPropertyMetadata(
                                        BooleanBoxes.TrueBox, // default value 
                                        new PropertyChangedCallback(OnIsEnabledChanged),
                                        new CoerceValueCallback(CoerceIsEnabled)));


    /// <summary>
    ///     A property indicating if this element is enabled or not. 
    /// </summary> 
    public boolean IsEnabled
    { 
        get { return (boolean) GetValue(IsEnabledProperty); }
        set { SetValue(IsEnabledProperty, BooleanBoxes.Box(value)); }
    }

    /// <summary>
    ///     IsEnabledChanged event 
    /// </summary> 
    public /*event*/ DependencyPropertyChangedEventHandler IsEnabledChanged
    { 
        add { EventHandlersStoreAdd(UIElement.IsEnabledChangedKey, value); }
        remove { EventHandlersStoreRemove(UIElement.IsEnabledChangedKey, value); }
    }

    /// <summary>
    ///     Fetches the value that IsEnabled should be coerced to. 
    /// </summary> 
    /// <remarks>
    ///     This method is /*virtual*/ is so that controls derived from UIElement 
    ///     can combine additional requirements into the coersion logic.
    ///     <P/>
    ///     It is important for anyone overriding this property to also
    ///     call CoerceValue when any of their dependencies change. 
    /// </remarks>
    protected /*virtual*/ boolean IsEnabledCore 
    { 
        get
        { 
            // As of 1/25/2006, the following controls override this method:
            // Hyperlink.IsEnabledCore: CanExecute
            return true;
        } 
    }

    private static Object CoerceIsEnabled(DependencyObject d, Object value) 
    {
        ContentElement ce = (ContentElement) d; 

        // We must be false if our parent is false, but we can be
        // either true or false if our parent is true.
        // 
        // Another way of saying this is that we can only be true
        // if our parent is true, but we can always be false. 
        if((boolean) value) 
        {
            // Use the "logical" parent.  This is different that UIElement, which 
            // uses the visual parent.  But the "content parent" is not a complete
            // tree description (for instance, we don't track "content children"),
            // so the best we can do is use the logical tree for ContentElements.
            // 
            // Note: we assume the "logical" parent of a ContentElement is either
            // a UIElement or ContentElement.  We explicitly assume that there 
            // is never a raw Visual as the parent. 

            DependencyObject parent = ce.GetUIParentCore(); 

            if(parent == null || (boolean)parent.GetValue(IsEnabledProperty))
            {
                return BooleanBoxes.Box(ce.IsEnabledCore); 
            }
            else 
            { 
                return BooleanBoxes.FalseBox;
            } 
        }
        else
        {
            return BooleanBoxes.FalseBox; 
        }
    } 

    private static void OnIsEnabledChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        ContentElement ce = (ContentElement)d;

        // Raise the public changed event.
        ce.RaiseDependencyPropertyChanged(UIElement.IsEnabledChangedKey, e); 

        // Invalidate the children so that they will inherit the new value. 
        ce.InvalidateForceInheritPropertyOnChildren(e.Property); 

        // The input manager needs to re-hittest because something changed 
        // that is involved in the hit-testing we do, so a different result
        // could be returned.
        InputManager.SafeCurrentNotifyHitTestInvalidated();
    } 

    //********************************************************************** 
//    #region Focusable Property 
    //*********************************************************************

    /// <summary>
    ///     The DependencyProperty for the Focusable property.
    /// </summary>
//    [CommonDependencyProperty] 
    public static final DependencyProperty FocusableProperty =
            UIElement.FocusableProperty.AddOwner( 
                    typeof(ContentElement), 
                    new UIPropertyMetadata(
                            BooleanBoxes.FalseBox, // default value 
                            new PropertyChangedCallback(OnFocusableChanged)));

    /// <summary>
    ///     Gettor and Settor for Focusable Property 
    /// </summary>
    public boolean Focusable 
    { 
        get { return (boolean) GetValue(FocusableProperty); }
        set { SetValue(FocusableProperty, BooleanBoxes.Box(value)); } 
    }

    /// <summary>
    ///     FocusableChanged event 
    /// </summary>
    public /*event*/ DependencyPropertyChangedEventHandler FocusableChanged 
    { 
        add {EventHandlersStoreAdd(UIElement.FocusableChangedKey, value);}
        remove {EventHandlersStoreRemove(UIElement.FocusableChangedKey, value);} 
    }

    private static void OnFocusableChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        ContentElement ce = (ContentElement) d;

        // Raise the public changed event. 
        ce.RaiseDependencyPropertyChanged(UIElement.FocusableChangedKey, e);
    } 

    //*********************************************************************
//    #endregion Focusable Property
    //********************************************************************* 

    /// <summary> 
    ///     A property indicating if the inptu method is enabled. 
    /// </summary>
    public boolean IsInputMethodEnabled 
    {
        get { return (boolean) GetValue(InputMethod.IsInputMethodEnabledProperty); }
    }


//    #endregion Input 

//    #region Operations

    private void RaiseMouseButtonEvent(EventPrivateKey key, MouseButtonEventArgs e)
    {
        EventHandlersStore store = EventHandlersStore;
        if (store != null) 
        {
            Delegate handler = store.Get(key); 
            if (handler != null) 
            {
                ((MouseButtonEventHandler)handler)(this, e); 
            }
        }
    }

    // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
    private void RaiseDependencyPropertyChanged(EventPrivateKey key, DependencyPropertyChangedEventArgs args) 
    { 
        EventHandlersStore store = EventHandlersStore;
        if (store != null) 
        {
            Delegate handler = store.Get(key);
            if (handler != null)
            { 
                ((DependencyPropertyChangedEventHandler)handler)(this, args);
            } 
        } 
    }

//    #endregion Operations

//    #region AllowDrop

    /// <summary>
    ///     The DependencyProperty for the AllowDrop property. 
    /// </summary> 
    public static final DependencyProperty AllowDropProperty =
                UIElement.AllowDropProperty.AddOwner( 
                            typeof(ContentElement),
                            new PropertyMetadata(BooleanBoxes.FalseBox));

    /// <summary> 
    ///     A dependency property that allows the drop Object as DragDrop target.
    /// </summary> 
    public boolean AllowDrop 
    {
        get { return (boolean) GetValue(AllowDropProperty); } 
        set { SetValue(AllowDropProperty, BooleanBoxes.Box(value)); }
    }

//    #endregion AllowDrop 

//    #region ForceInherit property support 

    // This has to be /*virtual*/, since there is no concept of "core" content children,
    // so we have no choice by to rely on FrameworkContentElement to use logical 
    // children instead.
    /*internal*/ public /*virtual*/ void InvalidateForceInheritPropertyOnChildren(DependencyProperty property)
    {
    } 

//    #endregion 

//    #region Touch

    /// <summary>
    ///     A property indicating if any touch devices are over this element or not.
    /// </summary>
    public boolean AreAnyTouchesOver 
    {
        get { return ReadFlag(CoreFlags.TouchesOverCache); } 
    } 

    /// <summary> 
    ///     A property indicating if any touch devices are directly over this element or not.
    /// </summary>
    public boolean AreAnyTouchesDirectlyOver
    { 
        get { return (boolean)GetValue(AreAnyTouchesDirectlyOverProperty); }
    } 

    /// <summary>
    ///     A property indicating if any touch devices are captured to elements in this subtree. 
    /// </summary>
    public boolean AreAnyTouchesCapturedWithin
    {
        get { return ReadFlag(CoreFlags.TouchesCapturedWithinCache); } 
    }

    /// <summary> 
    ///     A property indicating if any touch devices are captured to this element.
    /// </summary> 
    public boolean AreAnyTouchesCaptured
    {
        get { return (boolean)GetValue(AreAnyTouchesCapturedProperty); }
    } 

    /// <summary> 
    ///     Captures the specified device to this element. 
    /// </summary>
    /// <param name="touchDevice">The touch device to capture.</param> 
    /// <returns>True if capture was taken.</returns>
    public boolean CaptureTouch(TouchDevice touchDevice)
    {
        if (touchDevice == null) 
        {
            throw new ArgumentNullException("touchDevice"); 
        } 

        return touchDevice.Capture(this); 
    }

    /// <summary>
    ///     Releases capture from the specified touch device. 
    /// </summary>
    /// <param name="touchDevice">The device that is captured to this element.</param> 
    /// <returns>true if capture was released, false otherwise.</returns> 
    public boolean ReleaseTouchCapture(TouchDevice touchDevice)
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
    } 

    /// <summary>
    ///     Releases capture on any touch devices captured to this element. 
    /// </summary>
    public void ReleaseAllTouchCaptures()
    {
        TouchDevice.ReleaseAllCaptures(this); 
    }

    /// <summary> 
    ///     The touch devices captured to this element.
    /// </summary> 
    public IEnumerable<TouchDevice> TouchesCaptured
    {
        get
        { 
            return TouchDevice.GetCapturedTouches(this, /* includeWithin = */ false);
        } 
    } 

    /// <summary> 
    ///     The touch devices captured to this element and any elements in the subtree.
    /// </summary>
    public IEnumerable<TouchDevice> TouchesCapturedWithin
    { 
        get
        { 
            return TouchDevice.GetCapturedTouches(this, /* includeWithin = */ true); 
        }
    } 

    /// <summary>
    ///     The touch devices which are over this element and any elements in the subtree.
    ///     This is particularly relevant to elements which dont take capture (like Label). 
    /// </summary>
    public IEnumerable<TouchDevice> TouchesOver 
    { 
        get
        { 
            return TouchDevice.GetTouchesOver(this, /* includeWithin = */ true);
        }
    }

    /// <summary>
    ///     The touch devices which are directly over this element. 
    ///     This is particularly relevant to elements which dont take capture (like Label). 
    /// </summary>
    public IEnumerable<TouchDevice> TouchesDirectlyOver 
    {
        get
        {
            return TouchDevice.GetTouchesOver(this, /* includeWithin = */ false); 
        }
    } 

//    #endregion

    /*internal*/ public boolean HasAutomationPeer
    {
        get { return ReadFlag(CoreFlags.HasAutomationPeer); }
        set { WriteFlag(CoreFlags.HasAutomationPeer, value); } 
    }

//    #region Data 

    /*internal*/ public DependencyObject _parent; 

    ///// ATTACHED STORAGE /////
    /*internal*/ public static final UncommonField<EventHandlersStore> EventHandlersStoreField = UIElement.EventHandlersStoreField;
    /*internal*/ public static final UncommonField<InputBindingCollection> InputBindingCollectionField = UIElement.InputBindingCollectionField; 
    /*internal*/ public static final UncommonField<CommandBindingCollection> CommandBindingCollectionField = UIElement.CommandBindingCollectionField;
    private static final UncommonField<AutomationPeer> AutomationPeerField = new UncommonField<AutomationPeer>(); 

    // Caches the ContentElement's DependencyObjectType
    private static DependencyObjectType ContentElementType = DependencyObjectType.FromSystemTypeInternal(typeof(ContentElement)); 

//    #endregion Data
}