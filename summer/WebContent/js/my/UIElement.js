/**
 * UIElement
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var UIElement = declare(Visual,{
		constructor:function( ){

		}
	});
	
	Object.defineProperties(UIElement.prototype,{

	});
	
	UIElement.Type = new Type("UIElement", UIElement, [Visual.Type]);
	return UIElement;
});


//------------------------------------------------------------------------------ 
//
// <copyright file="UIElement.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
//----------------------------------------------------------------------------- 
 
using MS.Internal;
using MS.Internal.KnownBoxes; 
using MS.Internal.Media;
using MS.Internal.PresentationCore;
using MS.Utility;
using System; 
using System.Collections;
using System.Collections.Generic; 
using System.ComponentModel; 
using System.Diagnostics;
using System.Security; 
using System.Security.Permissions;
using System.Windows.Automation;
using System.Windows.Automation.Peers;
using System.Windows.Input; 
using System.Windows.Input.StylusPlugIns;
using System.Windows.Interop; 
using System.Windows.Markup; 
using System.Windows.Media;
using System.Windows.Media.Animation; 
using System.Windows.Media.Composition;
using System.Windows.Media.Effects;
using System.Windows.Media.Media3D;
using System.Windows.Threading; 
using System.Runtime.InteropServices;
using MS.Win32; 
 
namespace System.Windows
{ 
    /// <summary>
    /// Visibility - Enum which describes 3 possible visibility options.
    /// </summary>
    /// <seealso cref="UIElement" /> 
    public enum Visibility : byte
    { 
        /// <summary> 
        /// Normally visible.
        /// </summary> 
        Visible = 0,

        /// <summary>
        /// Occupies space in the layout, but is not visible (completely transparent). 
        /// </summary>
        Hidden, 
 
        /// <summary>
        /// Not visible and does not occupy any space in layout, as if it doesn't exist. 
        /// </summary>
        Collapsed
    }
 
    // PreSharp uses message numbers that the C# compiler doesn't know about.
    // Disable the C# complaints, per the PreSharp documentation. 
#pragma warning disable 1634, 1691 

    /// <summary> 
    /// UIElement is the base class for frameworks building on the Windows Presentation Core.
    /// </summary>
    /// <remarks>
    /// UIElement adds to the base visual class "LIFE" - Layout, Input, Focus, and Eventing. 
    /// UIElement can be considered roughly equivalent to an HWND in Win32, or an Element in Trident.
    /// UIElements can render (because they derive from Visual), visually size and position their children, 
    /// respond to user input (including control of where input is getting sent to), 
    /// and raise events that traverse the physical tree.<para/>
    /// 
    /// UIElement is the most functional type in the Windows Presentation Core.
    /// </remarks>

    [UidProperty("Uid")] 
    public partial class UIElement : Visual, IInputElement, IAnimatable
    { 
        /// <SecurityNote> 
        ///  Critical: This code is used to register various thunks that are used to send input to the tree
        ///  TreatAsSafe: This code attaches handlers that are inside the class and private. Not configurable or overridable 
        /// </SecurityNote>
        [SecurityCritical,SecurityTreatAsSafe]
        static UIElement()
        { 
            UIElement.RegisterEvents(typeof(UIElement));
 
            RenderOptions.EdgeModeProperty.OverrideMetadata( 
                typeof(UIElement),
                new UIPropertyMetadata(new PropertyChangedCallback(EdgeMode_Changed))); 

            RenderOptions.BitmapScalingModeProperty.OverrideMetadata(
                typeof(UIElement),
                new UIPropertyMetadata(new PropertyChangedCallback(BitmapScalingMode_Changed))); 

            RenderOptions.ClearTypeHintProperty.OverrideMetadata( 
                typeof(UIElement), 
                new UIPropertyMetadata(new PropertyChangedCallback(ClearTypeHint_Changed)));
 
            TextOptionsInternal.TextHintingModeProperty.OverrideMetadata(
                typeof(UIElement),
                new UIPropertyMetadata(new PropertyChangedCallback(TextHintingMode_Changed)));
 
            EventManager.RegisterClassHandler(typeof(UIElement), ManipulationStartingEvent, new EventHandler<ManipulationStartingEventArgs>(OnManipulationStartingThunk));
            EventManager.RegisterClassHandler(typeof(UIElement), ManipulationStartedEvent, new EventHandler<ManipulationStartedEventArgs>(OnManipulationStartedThunk)); 
            EventManager.RegisterClassHandler(typeof(UIElement), ManipulationDeltaEvent, new EventHandler<ManipulationDeltaEventArgs>(OnManipulationDeltaThunk)); 
            EventManager.RegisterClassHandler(typeof(UIElement), ManipulationInertiaStartingEvent, new EventHandler<ManipulationInertiaStartingEventArgs>(OnManipulationInertiaStartingThunk));
            EventManager.RegisterClassHandler(typeof(UIElement), ManipulationBoundaryFeedbackEvent, new EventHandler<ManipulationBoundaryFeedbackEventArgs>(OnManipulationBoundaryFeedbackThunk)); 
            EventManager.RegisterClassHandler(typeof(UIElement), ManipulationCompletedEvent, new EventHandler<ManipulationCompletedEventArgs>(OnManipulationCompletedThunk));
        }

        /// <summary> 
        /// Constructor. This form of constructor will encounter a slight perf hit since it needs to initialize Dispatcher for the instance.
        /// </summary> 
        public UIElement() 
        {
            Initialize(); 
        }

        private void Initialize()
        { 
            BeginPropertyInitialization();
            NeverMeasured = true; 
            NeverArranged = true; 

            SnapsToDevicePixelsCache = (bool) SnapsToDevicePixelsProperty.GetDefaultValue(DependencyObjectType); 
            ClipToBoundsCache        = (bool) ClipToBoundsProperty.GetDefaultValue(DependencyObjectType);
            VisibilityCache          = (Visibility) VisibilityProperty.GetDefaultValue(DependencyObjectType);

            SetFlags(true, VisualFlags.IsUIElement); 

            // Note: IsVisibleCache is false by default. 
 
            if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose))
            { 
                PerfService.GetPerfElementID(this);
            }
        }
        
        static private readonly Type _typeofThis = typeof(UIElement); 

        #region IAnimatable 
 
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
        #pragma warning disable 56506 // Suppress presharp warning: Parameter 'dp' to this public method must be validated:  A null-dereference can occur here.
                throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp");
        #pragma warning restore 56506 
            }
 
            if (clock != null 
                && !AnimationStorage.IsAnimationValid(dp, clock.Timeline))
            { 
        #pragma warning disable 56506 // Suppress presharp warning: Parameter 'dp' to this public method must be validated:  A null-dereference can occur here.
                throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, clock.Timeline.GetType(), dp.Name, dp.PropertyType), "clock");
        #pragma warning restore 56506
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
        #pragma warning disable 56506 // Suppress presharp warning: Parameter 'dp' to this public method must be validated:  A null-dereference can occur here.
                throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp");
        #pragma warning restore 56506 
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
        /// persistent animation or the object has one or more clocks associated
        /// with any of its properties.
        /// </summary>
        public bool HasAnimatedProperties 
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
        public object GetAnimationBaseValue(DependencyProperty dp) 
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

        #endregion IAnimatable
 
        #region Animation
 
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
        [UIPermissionAttribute(SecurityAction.InheritanceDemand, Window=UIPermissionWindow.AllWindows)] 
        internal sealed override void EvaluateAnimatedValueCore(
                DependencyProperty  dp,
                PropertyMetadata    metadata,
            ref EffectiveValueEntry entry) 
        {
            if (IAnimatable_HasAnimatedProperties) 
            { 
                AnimationStorage storage = AnimationStorage.GetStorage(this, dp);
 
                if (storage != null)
                {
                    storage.EvaluateAnimatedValue(metadata, ref entry);
                } 
            }
        } 
 
        #endregion Animation
 
        #region Commands
        /// <summary>
        /// Instance level InputBinding collection, initialized on first use.
        /// To have commands handled (QueryEnabled/Execute) on an element instance, 
        /// the user of this method can add InputBinding with handlers thru this
        /// method. 
        /// </summary> 
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
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
        internal InputBindingCollection InputBindingsInternal
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
        [EditorBrowsable(EditorBrowsableState.Never)] 
        public bool ShouldSerializeInputBindings()
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
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
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
        internal CommandBindingCollection CommandBindingsInternal 
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
        [EditorBrowsable(EditorBrowsableState.Never)] 
        public bool ShouldSerializeCommandBindings()
        {
            CommandBindingCollection bindingCollection = CommandBindingCollectionField.GetValue(this);
            if (bindingCollection != null && bindingCollection.Count > 0) 
            {
                return true; 
            } 

            return false; 
        }

        #endregion Commands
 
        #region Events
 
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
        internal virtual bool BuildRouteCore(EventRoute route, RoutedEventArgs args)
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
        internal void BuildRoute(EventRoute route, RoutedEventArgs args)
        {
            UIElement.BuildRouteHelper(this, route, args); 
        }
 
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
        [SecurityCritical]
        internal void RaiseEvent(RoutedEventArgs args, bool trusted) 
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
        [SecurityCritical] 
        [MS.Internal.Permissions.UserInitiatedRoutedEventPermissionAttribute(SecurityAction.Assert)]
        internal void RaiseTrustedEvent(RoutedEventArgs args) 
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
        internal virtual object AdjustEventSource(RoutedEventArgs args) 
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
        ///     The handler that will be invoked on this object 
        ///     when the RoutedEvent is raised
        /// </param> 
        /// <param name="handledEventsToo">
        ///     Flag indicating whether or not the listener wants to
        ///     hear about events that have already been handled
        /// </param> 
        public void AddHandler(
            RoutedEvent routedEvent, 
            Delegate handler, 
            bool handledEventsToo)
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

            EnsureEventHandlersStore(); 
            EventHandlersStore.AddRoutedEventHandler(routedEvent, handler, handledEventsToo);

            OnAddHandler (routedEvent, handler);
        } 

        /// <summary> 
        ///     Notifies subclass of a new routed event handler.  Note that this is 
        ///     called once for each handler added, but OnRemoveHandler is only called
        ///     on the last removal. 
        /// </summary>
        internal virtual void OnAddHandler(
            RoutedEvent routedEvent,
            Delegate handler) 
        {
        } 
 
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
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
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
        internal virtual void OnRemoveHandler( 
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
 
            // Get class listeners for this UIElement
            RoutedEventHandlerInfoList classListeners = 
                GlobalEventManager.GetDTypedClassListeners(this.DependencyObjectType, e.RoutedEvent); 

            // Add all class listeners for this UIElement 
            while (classListeners != null)
            {
                for(int i = 0; i < classListeners.Handlers.Length; i++)
                { 
                    route.Add(this, classListeners.Handlers[i].Handler, classListeners.Handlers[i].InvokeHandledEventsToo);
                } 
 
                classListeners = classListeners.Next;
            } 

            // Get instance listeners for this UIElement
            FrugalObjectList<RoutedEventHandlerInfo> instanceListeners = null;
            EventHandlersStore store = EventHandlersStore; 
            if (store != null)
            { 
                instanceListeners = store[e.RoutedEvent]; 

                // Add all instance listeners for this UIElement 
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
        internal virtual void AddToEventRouteCore(EventRoute route, RoutedEventArgs args) 
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
        internal EventHandlersStore EventHandlersStore
        { 
            [FriendAccessAllowed] // Built into Core, also used by Framework.
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
        [FriendAccessAllowed] // Built into Core, also used by Framework.
        internal void EnsureEventHandlersStore()
        { 
            if (EventHandlersStore == null)
            { 
                EventHandlersStoreField.SetValue(this, new EventHandlersStore()); 
                WriteFlag(CoreFlags.ExistsEventHandlersStore, true);
            } 
        }

        #endregion Events
 
        internal virtual bool InvalidateAutomationAncestorsCore(Stack<DependencyObject> branchNodeStack, out bool continuePastVisualTree)
        { 
            continuePastVisualTree = false; 
            return true;
        } 

        /// <summary>
        /// Used by UIElement, ContentElement, and UIElement3D to register common Events.
        /// </summary> 
        /// <SecurityNote>
        ///  Critical: This code is used to register various thunks that are used to send input to the tree 
        ///  TreatAsSafe: This code attaches handlers that are inside the class and private. Not configurable or overridable 
        /// </SecurityNote>
        [SecurityCritical,SecurityTreatAsSafe] 
        internal static void RegisterEvents(Type type)
        {
            EventManager.RegisterClassHandler(type, Mouse.PreviewMouseDownEvent, new MouseButtonEventHandler(UIElement.OnPreviewMouseDownThunk), true);
            EventManager.RegisterClassHandler(type, Mouse.MouseDownEvent, new MouseButtonEventHandler(UIElement.OnMouseDownThunk), true); 
            EventManager.RegisterClassHandler(type, Mouse.PreviewMouseUpEvent, new MouseButtonEventHandler(UIElement.OnPreviewMouseUpThunk), true);
            EventManager.RegisterClassHandler(type, Mouse.MouseUpEvent, new MouseButtonEventHandler(UIElement.OnMouseUpThunk), true); 
            EventManager.RegisterClassHandler(type, UIElement.PreviewMouseLeftButtonDownEvent, new MouseButtonEventHandler(UIElement.OnPreviewMouseLeftButtonDownThunk), false); 
            EventManager.RegisterClassHandler(type, UIElement.MouseLeftButtonDownEvent, new MouseButtonEventHandler(UIElement.OnMouseLeftButtonDownThunk), false);
            EventManager.RegisterClassHandler(type, UIElement.PreviewMouseLeftButtonUpEvent, new MouseButtonEventHandler(UIElement.OnPreviewMouseLeftButtonUpThunk), false); 
            EventManager.RegisterClassHandler(type, UIElement.MouseLeftButtonUpEvent, new MouseButtonEventHandler(UIElement.OnMouseLeftButtonUpThunk), false);
            EventManager.RegisterClassHandler(type, UIElement.PreviewMouseRightButtonDownEvent, new MouseButtonEventHandler(UIElement.OnPreviewMouseRightButtonDownThunk), false);
            EventManager.RegisterClassHandler(type, UIElement.MouseRightButtonDownEvent, new MouseButtonEventHandler(UIElement.OnMouseRightButtonDownThunk), false);
            EventManager.RegisterClassHandler(type, UIElement.PreviewMouseRightButtonUpEvent, new MouseButtonEventHandler(UIElement.OnPreviewMouseRightButtonUpThunk), false); 
            EventManager.RegisterClassHandler(type, UIElement.MouseRightButtonUpEvent, new MouseButtonEventHandler(UIElement.OnMouseRightButtonUpThunk), false);
            EventManager.RegisterClassHandler(type, Mouse.PreviewMouseMoveEvent, new MouseEventHandler(UIElement.OnPreviewMouseMoveThunk), false); 
            EventManager.RegisterClassHandler(type, Mouse.MouseMoveEvent, new MouseEventHandler(UIElement.OnMouseMoveThunk), false); 
            EventManager.RegisterClassHandler(type, Mouse.PreviewMouseWheelEvent, new MouseWheelEventHandler(UIElement.OnPreviewMouseWheelThunk), false);
            EventManager.RegisterClassHandler(type, Mouse.MouseWheelEvent, new MouseWheelEventHandler(UIElement.OnMouseWheelThunk), false); 
            EventManager.RegisterClassHandler(type, Mouse.MouseEnterEvent, new MouseEventHandler(UIElement.OnMouseEnterThunk), false);
            EventManager.RegisterClassHandler(type, Mouse.MouseLeaveEvent, new MouseEventHandler(UIElement.OnMouseLeaveThunk), false);
            EventManager.RegisterClassHandler(type, Mouse.GotMouseCaptureEvent, new MouseEventHandler(UIElement.OnGotMouseCaptureThunk), false);
            EventManager.RegisterClassHandler(type, Mouse.LostMouseCaptureEvent, new MouseEventHandler(UIElement.OnLostMouseCaptureThunk), false); 
            EventManager.RegisterClassHandler(type, Mouse.QueryCursorEvent, new QueryCursorEventHandler(UIElement.OnQueryCursorThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusDownEvent, new StylusDownEventHandler(UIElement.OnPreviewStylusDownThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.StylusDownEvent, new StylusDownEventHandler(UIElement.OnStylusDownThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusUpEvent, new StylusEventHandler(UIElement.OnPreviewStylusUpThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.StylusUpEvent, new StylusEventHandler(UIElement.OnStylusUpThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusMoveEvent, new StylusEventHandler(UIElement.OnPreviewStylusMoveThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.StylusMoveEvent, new StylusEventHandler(UIElement.OnStylusMoveThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusInAirMoveEvent, new StylusEventHandler(UIElement.OnPreviewStylusInAirMoveThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.StylusInAirMoveEvent, new StylusEventHandler(UIElement.OnStylusInAirMoveThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.StylusEnterEvent, new StylusEventHandler(UIElement.OnStylusEnterThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.StylusLeaveEvent, new StylusEventHandler(UIElement.OnStylusLeaveThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusInRangeEvent, new StylusEventHandler(UIElement.OnPreviewStylusInRangeThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.StylusInRangeEvent, new StylusEventHandler(UIElement.OnStylusInRangeThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusOutOfRangeEvent, new StylusEventHandler(UIElement.OnPreviewStylusOutOfRangeThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.StylusOutOfRangeEvent, new StylusEventHandler(UIElement.OnStylusOutOfRangeThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusSystemGestureEvent, new StylusSystemGestureEventHandler(UIElement.OnPreviewStylusSystemGestureThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.StylusSystemGestureEvent, new StylusSystemGestureEventHandler(UIElement.OnStylusSystemGestureThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.GotStylusCaptureEvent, new StylusEventHandler(UIElement.OnGotStylusCaptureThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.LostStylusCaptureEvent, new StylusEventHandler(UIElement.OnLostStylusCaptureThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.StylusButtonDownEvent, new StylusButtonEventHandler(UIElement.OnStylusButtonDownThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.StylusButtonUpEvent, new StylusButtonEventHandler(UIElement.OnStylusButtonUpThunk), false); 
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusButtonDownEvent, new StylusButtonEventHandler(UIElement.OnPreviewStylusButtonDownThunk), false);
            EventManager.RegisterClassHandler(type, Stylus.PreviewStylusButtonUpEvent, new StylusButtonEventHandler(UIElement.OnPreviewStylusButtonUpThunk), false); 
            EventManager.RegisterClassHandler(type, Keyboard.PreviewKeyDownEvent, new KeyEventHandler(UIElement.OnPreviewKeyDownThunk), false);
            EventManager.RegisterClassHandler(type, Keyboard.KeyDownEvent, new KeyEventHandler(UIElement.OnKeyDownThunk), false);
            EventManager.RegisterClassHandler(type, Keyboard.PreviewKeyUpEvent, new KeyEventHandler(UIElement.OnPreviewKeyUpThunk), false);
            EventManager.RegisterClassHandler(type, Keyboard.KeyUpEvent, new KeyEventHandler(UIElement.OnKeyUpThunk), false); 
            EventManager.RegisterClassHandler(type, Keyboard.PreviewGotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(UIElement.OnPreviewGotKeyboardFocusThunk), false);
            EventManager.RegisterClassHandler(type, Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(UIElement.OnGotKeyboardFocusThunk), false); 
            EventManager.RegisterClassHandler(type, Keyboard.PreviewLostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(UIElement.OnPreviewLostKeyboardFocusThunk), false); 
            EventManager.RegisterClassHandler(type, Keyboard.LostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(UIElement.OnLostKeyboardFocusThunk), false);
            EventManager.RegisterClassHandler(type, TextCompositionManager.PreviewTextInputEvent, new TextCompositionEventHandler(UIElement.OnPreviewTextInputThunk), false); 
            EventManager.RegisterClassHandler(type, TextCompositionManager.TextInputEvent, new TextCompositionEventHandler(UIElement.OnTextInputThunk), false);
            EventManager.RegisterClassHandler(type, CommandManager.PreviewExecutedEvent, new ExecutedRoutedEventHandler(UIElement.OnPreviewExecutedThunk), false);
            EventManager.RegisterClassHandler(type, CommandManager.ExecutedEvent, new ExecutedRoutedEventHandler(UIElement.OnExecutedThunk), false);
            EventManager.RegisterClassHandler(type, CommandManager.PreviewCanExecuteEvent, new CanExecuteRoutedEventHandler(UIElement.OnPreviewCanExecuteThunk), false); 
            EventManager.RegisterClassHandler(type, CommandManager.CanExecuteEvent, new CanExecuteRoutedEventHandler(UIElement.OnCanExecuteThunk), false);
            EventManager.RegisterClassHandler(type, CommandDevice.CommandDeviceEvent, new CommandDeviceEventHandler(UIElement.OnCommandDeviceThunk), false); 
            EventManager.RegisterClassHandler(type, DragDrop.PreviewQueryContinueDragEvent, new QueryContinueDragEventHandler(UIElement.OnPreviewQueryContinueDragThunk), false); 
            EventManager.RegisterClassHandler(type, DragDrop.QueryContinueDragEvent, new QueryContinueDragEventHandler(UIElement.OnQueryContinueDragThunk), false);
            EventManager.RegisterClassHandler(type, DragDrop.PreviewGiveFeedbackEvent, new GiveFeedbackEventHandler(UIElement.OnPreviewGiveFeedbackThunk), false); 
            EventManager.RegisterClassHandler(type, DragDrop.GiveFeedbackEvent, new GiveFeedbackEventHandler(UIElement.OnGiveFeedbackThunk), false);
            EventManager.RegisterClassHandler(type, DragDrop.PreviewDragEnterEvent, new DragEventHandler(UIElement.OnPreviewDragEnterThunk), false);
            EventManager.RegisterClassHandler(type, DragDrop.DragEnterEvent, new DragEventHandler(UIElement.OnDragEnterThunk), false);
            EventManager.RegisterClassHandler(type, DragDrop.PreviewDragOverEvent, new DragEventHandler(UIElement.OnPreviewDragOverThunk), false); 
            EventManager.RegisterClassHandler(type, DragDrop.DragOverEvent, new DragEventHandler(UIElement.OnDragOverThunk), false);
            EventManager.RegisterClassHandler(type, DragDrop.PreviewDragLeaveEvent, new DragEventHandler(UIElement.OnPreviewDragLeaveThunk), false); 
            EventManager.RegisterClassHandler(type, DragDrop.DragLeaveEvent, new DragEventHandler(UIElement.OnDragLeaveThunk), false); 
            EventManager.RegisterClassHandler(type, DragDrop.PreviewDropEvent, new DragEventHandler(UIElement.OnPreviewDropThunk), false);
            EventManager.RegisterClassHandler(type, DragDrop.DropEvent, new DragEventHandler(UIElement.OnDropThunk), false); 
            EventManager.RegisterClassHandler(type, Touch.PreviewTouchDownEvent, new EventHandler<TouchEventArgs>(UIElement.OnPreviewTouchDownThunk), false);
            EventManager.RegisterClassHandler(type, Touch.TouchDownEvent, new EventHandler<TouchEventArgs>(UIElement.OnTouchDownThunk), false);
            EventManager.RegisterClassHandler(type, Touch.PreviewTouchMoveEvent, new EventHandler<TouchEventArgs>(UIElement.OnPreviewTouchMoveThunk), false);
            EventManager.RegisterClassHandler(type, Touch.TouchMoveEvent, new EventHandler<TouchEventArgs>(UIElement.OnTouchMoveThunk), false); 
            EventManager.RegisterClassHandler(type, Touch.PreviewTouchUpEvent, new EventHandler<TouchEventArgs>(UIElement.OnPreviewTouchUpThunk), false);
            EventManager.RegisterClassHandler(type, Touch.TouchUpEvent, new EventHandler<TouchEventArgs>(UIElement.OnTouchUpThunk), false); 
            EventManager.RegisterClassHandler(type, Touch.GotTouchCaptureEvent, new EventHandler<TouchEventArgs>(UIElement.OnGotTouchCaptureThunk), false); 
            EventManager.RegisterClassHandler(type, Touch.LostTouchCaptureEvent, new EventHandler<TouchEventArgs>(UIElement.OnLostTouchCaptureThunk), false);
            EventManager.RegisterClassHandler(type, Touch.TouchEnterEvent, new EventHandler<TouchEventArgs>(UIElement.OnTouchEnterThunk), false); 
            EventManager.RegisterClassHandler(type, Touch.TouchLeaveEvent, new EventHandler<TouchEventArgs>(UIElement.OnTouchLeaveThunk), false);
        }

 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewMouseDownThunk(object sender, MouseButtonEventArgs e)
        {
            if(!e.Handled)
            { 
                UIElement uie = sender as UIElement;
 
                if (uie != null) 
                {
                    uie.OnPreviewMouseDown(e); 
                }
                else
                {
                    ContentElement ce = sender as ContentElement; 

                    if (ce != null) 
                    { 
                        ce.OnPreviewMouseDown(e);
                    } 
                    else
                    {
                        ((UIElement3D)sender).OnPreviewMouseDown(e);
                    } 
                }
            } 
 
            // Always raise this "sub-event", but we pass along the handledness.
            UIElement.CrackMouseButtonEventAndReRaiseEvent((DependencyObject)sender, e); 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnMouseDownThunk(object sender, MouseButtonEventArgs e) 
        {
            if(!e.Handled) 
            {
                CommandManager.TranslateInput((IInputElement)sender, e);
            }
 
            if(!e.Handled)
            { 
                UIElement uie = sender as UIElement; 

                if (uie != null) 
                {
                    uie.OnMouseDown(e);
                }
                else 
                {
                    ContentElement ce = sender as ContentElement; 
 
                    if (ce != null)
                    { 
                        ce.OnMouseDown(e);
                    }
                    else
                    { 
                        ((UIElement3D)sender).OnMouseDown(e);
                    } 
                } 
            }
 
            // Always raise this "sub-event", but we pass along the handledness.
            UIElement.CrackMouseButtonEventAndReRaiseEvent((DependencyObject)sender, e);
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewMouseUpThunk(object sender, MouseButtonEventArgs e) 
        {
            if(!e.Handled)
            {
                UIElement uie = sender as UIElement; 

                if (uie != null) 
                { 
                    uie.OnPreviewMouseUp(e);
                } 
                else
                {
                    ContentElement ce = sender as ContentElement;
 
                    if (ce != null)
                    { 
                        ce.OnPreviewMouseUp(e); 
                    }
                    else 
                    {
                        ((UIElement3D)sender).OnPreviewMouseUp(e);
                    }
                } 
            }
 
            // Always raise this "sub-event", but we pass along the handledness. 
            UIElement.CrackMouseButtonEventAndReRaiseEvent((DependencyObject)sender, e);
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnMouseUpThunk(object sender, MouseButtonEventArgs e) 
        { 
            if(!e.Handled)
            { 
                UIElement uie = sender as UIElement;

                if (uie != null)
                { 
                    uie.OnMouseUp(e);
                } 
                else 
                {
                    ContentElement ce = sender as ContentElement; 

                    if (ce != null)
                    {
                        ce.OnMouseUp(e); 
                    }
                    else 
                    { 
                        ((UIElement3D)sender).OnMouseUp(e);
                    } 
                }
            }

            // Always raise this "sub-event", but we pass along the handledness. 
            UIElement.CrackMouseButtonEventAndReRaiseEvent((DependencyObject)sender, e);
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewMouseLeftButtonDownThunk(object sender, MouseButtonEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnPreviewMouseLeftButtonDown(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnPreviewMouseLeftButtonDown(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnPreviewMouseLeftButtonDown(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnMouseLeftButtonDownThunk(object sender, MouseButtonEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnMouseLeftButtonDown(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnMouseLeftButtonDown(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnMouseLeftButtonDown(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewMouseLeftButtonUpThunk(object sender, MouseButtonEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnPreviewMouseLeftButtonUp(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnPreviewMouseLeftButtonUp(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnPreviewMouseLeftButtonUp(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnMouseLeftButtonUpThunk(object sender, MouseButtonEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnMouseLeftButtonUp(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnMouseLeftButtonUp(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnMouseLeftButtonUp(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewMouseRightButtonDownThunk(object sender, MouseButtonEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnPreviewMouseRightButtonDown(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnPreviewMouseRightButtonDown(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnPreviewMouseRightButtonDown(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnMouseRightButtonDownThunk(object sender, MouseButtonEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnMouseRightButtonDown(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnMouseRightButtonDown(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnMouseRightButtonDown(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewMouseRightButtonUpThunk(object sender, MouseButtonEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnPreviewMouseRightButtonUp(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnPreviewMouseRightButtonUp(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnPreviewMouseRightButtonUp(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnMouseRightButtonUpThunk(object sender, MouseButtonEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnMouseRightButtonUp(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnMouseRightButtonUp(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnMouseRightButtonUp(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewMouseMoveThunk(object sender, MouseEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnPreviewMouseMove(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnPreviewMouseMove(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnPreviewMouseMove(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnMouseMoveThunk(object sender, MouseEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnMouseMove(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnMouseMove(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnMouseMove(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewMouseWheelThunk(object sender, MouseWheelEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnPreviewMouseWheel(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnPreviewMouseWheel(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewMouseWheel(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnMouseWheelThunk(object sender, MouseWheelEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            CommandManager.TranslateInput((IInputElement)sender, e);

            if(!e.Handled) 
            {
                UIElement uie = sender as UIElement; 
 
                if (uie != null)
                { 
                    uie.OnMouseWheel(e);
                }
                else
                { 
                    ContentElement ce = sender as ContentElement;
 
                    if (ce != null) 
                    {
                        ce.OnMouseWheel(e); 
                    }
                    else
                    {
                        ((UIElement3D)sender).OnMouseWheel(e); 
                    }
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnMouseEnterThunk(object sender, MouseEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnMouseEnter(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnMouseEnter(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnMouseEnter(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnMouseLeaveThunk(object sender, MouseEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnMouseLeave(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnMouseLeave(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnMouseLeave(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnGotMouseCaptureThunk(object sender, MouseEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnGotMouseCapture(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnGotMouseCapture(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnGotMouseCapture(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnLostMouseCaptureThunk(object sender, MouseEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnLostMouseCapture(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnLostMouseCapture(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnLostMouseCapture(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnQueryCursorThunk(object sender, QueryCursorEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnQueryCursor(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnQueryCursor(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnQueryCursor(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewStylusDownThunk(object sender, StylusDownEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnPreviewStylusDown(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnPreviewStylusDown(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnPreviewStylusDown(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnStylusDownThunk(object sender, StylusDownEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnStylusDown(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnStylusDown(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnStylusDown(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewStylusUpThunk(object sender, StylusEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnPreviewStylusUp(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnPreviewStylusUp(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnPreviewStylusUp(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnStylusUpThunk(object sender, StylusEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnStylusUp(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnStylusUp(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnStylusUp(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewStylusMoveThunk(object sender, StylusEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnPreviewStylusMove(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnPreviewStylusMove(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewStylusMove(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnStylusMoveThunk(object sender, StylusEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnStylusMove(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnStylusMove(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnStylusMove(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewStylusInAirMoveThunk(object sender, StylusEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnPreviewStylusInAirMove(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnPreviewStylusInAirMove(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnPreviewStylusInAirMove(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnStylusInAirMoveThunk(object sender, StylusEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnStylusInAirMove(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnStylusInAirMove(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnStylusInAirMove(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnStylusEnterThunk(object sender, StylusEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnStylusEnter(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnStylusEnter(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnStylusEnter(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnStylusLeaveThunk(object sender, StylusEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnStylusLeave(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnStylusLeave(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnStylusLeave(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnPreviewStylusInRangeThunk(object sender, StylusEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnPreviewStylusInRange(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnPreviewStylusInRange(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewStylusInRange(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnStylusInRangeThunk(object sender, StylusEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnStylusInRange(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnStylusInRange(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnStylusInRange(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewStylusOutOfRangeThunk(object sender, StylusEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnPreviewStylusOutOfRange(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnPreviewStylusOutOfRange(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnPreviewStylusOutOfRange(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnStylusOutOfRangeThunk(object sender, StylusEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnStylusOutOfRange(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnStylusOutOfRange(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnStylusOutOfRange(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewStylusSystemGestureThunk(object sender, StylusSystemGestureEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnPreviewStylusSystemGesture(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnPreviewStylusSystemGesture(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnPreviewStylusSystemGesture(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnStylusSystemGestureThunk(object sender, StylusSystemGestureEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnStylusSystemGesture(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnStylusSystemGesture(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnStylusSystemGesture(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnGotStylusCaptureThunk(object sender, StylusEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnGotStylusCapture(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnGotStylusCapture(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnGotStylusCapture(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnLostStylusCaptureThunk(object sender, StylusEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnLostStylusCapture(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnLostStylusCapture(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnLostStylusCapture(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnStylusButtonDownThunk(object sender, StylusButtonEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnStylusButtonDown(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnStylusButtonDown(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnStylusButtonDown(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnStylusButtonUpThunk(object sender, StylusButtonEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnStylusButtonUp(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnStylusButtonUp(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnStylusButtonUp(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewStylusButtonDownThunk(object sender, StylusButtonEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnPreviewStylusButtonDown(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnPreviewStylusButtonDown(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnPreviewStylusButtonDown(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewStylusButtonUpThunk(object sender, StylusButtonEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnPreviewStylusButtonUp(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnPreviewStylusButtonUp(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnPreviewStylusButtonUp(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewKeyDownThunk(object sender, KeyEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnPreviewKeyDown(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnPreviewKeyDown(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewKeyDown(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnKeyDownThunk(object sender, KeyEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            CommandManager.TranslateInput((IInputElement)sender, e);

            if(!e.Handled) 
            {
                UIElement uie = sender as UIElement; 
 
                if (uie != null)
                { 
                    uie.OnKeyDown(e);
                }
                else
                { 
                    ContentElement ce = sender as ContentElement;
 
                    if (ce != null) 
                    {
                        ce.OnKeyDown(e); 
                    }
                    else
                    {
                        ((UIElement3D)sender).OnKeyDown(e); 
                    }
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewKeyUpThunk(object sender, KeyEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnPreviewKeyUp(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnPreviewKeyUp(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewKeyUp(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnKeyUpThunk(object sender, KeyEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnKeyUp(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnKeyUp(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnKeyUp(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewGotKeyboardFocusThunk(object sender, KeyboardFocusChangedEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnPreviewGotKeyboardFocus(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnPreviewGotKeyboardFocus(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnPreviewGotKeyboardFocus(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnGotKeyboardFocusThunk(object sender, KeyboardFocusChangedEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnGotKeyboardFocus(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnGotKeyboardFocus(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnGotKeyboardFocus(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewLostKeyboardFocusThunk(object sender, KeyboardFocusChangedEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnPreviewLostKeyboardFocus(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnPreviewLostKeyboardFocus(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnPreviewLostKeyboardFocus(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnLostKeyboardFocusThunk(object sender, KeyboardFocusChangedEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnLostKeyboardFocus(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnLostKeyboardFocus(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnLostKeyboardFocus(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnPreviewTextInputThunk(object sender, TextCompositionEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnPreviewTextInput(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnPreviewTextInput(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewTextInput(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnTextInputThunk(object sender, TextCompositionEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnTextInput(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnTextInput(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnTextInput(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewExecutedThunk(object sender, ExecutedRoutedEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            // Command Manager will determine if preview or regular event. 
            CommandManager.OnExecuted(sender, e);
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnExecutedThunk(object sender, ExecutedRoutedEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            // Command Manager will determine if preview or regular event.
            CommandManager.OnExecuted(sender, e);
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewCanExecuteThunk(object sender, CanExecuteRoutedEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            // Command Manager will determine if preview or regular event. 
            CommandManager.OnCanExecute(sender, e);
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnCanExecuteThunk(object sender, CanExecuteRoutedEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            // Command Manager will determine if preview or regular event. 
            CommandManager.OnCanExecute(sender, e);
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnCommandDeviceThunk(object sender, CommandDeviceEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            // Command Manager will determine if preview or regular event.
            CommandManager.OnCommandDevice(sender, e);
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewQueryContinueDragThunk(object sender, QueryContinueDragEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnPreviewQueryContinueDrag(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnPreviewQueryContinueDrag(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnPreviewQueryContinueDrag(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnQueryContinueDragThunk(object sender, QueryContinueDragEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnQueryContinueDrag(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnQueryContinueDrag(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnQueryContinueDrag(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewGiveFeedbackThunk(object sender, GiveFeedbackEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnPreviewGiveFeedback(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnPreviewGiveFeedback(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnPreviewGiveFeedback(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnGiveFeedbackThunk(object sender, GiveFeedbackEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnGiveFeedback(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnGiveFeedback(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnGiveFeedback(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnPreviewDragEnterThunk(object sender, DragEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnPreviewDragEnter(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnPreviewDragEnter(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewDragEnter(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnDragEnterThunk(object sender, DragEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnDragEnter(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnDragEnter(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnDragEnter(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnPreviewDragOverThunk(object sender, DragEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnPreviewDragOver(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnPreviewDragOver(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnPreviewDragOver(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnDragOverThunk(object sender, DragEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnDragOver(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnDragOver(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnDragOver(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewDragLeaveThunk(object sender, DragEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnPreviewDragLeave(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnPreviewDragLeave(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnPreviewDragLeave(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnDragLeaveThunk(object sender, DragEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnDragLeave(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnDragLeave(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnDragLeave(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewDropThunk(object sender, DragEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnPreviewDrop(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnPreviewDrop(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnPreviewDrop(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnDropThunk(object sender, DragEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnDrop(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnDrop(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnDrop(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnPreviewTouchDownThunk(object sender, TouchEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnPreviewTouchDown(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnPreviewTouchDown(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnPreviewTouchDown(e);
                } 
            }
        }

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical] 
        private static void OnTouchDownThunk(object sender, TouchEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement;
 
            if (uie != null)
            { 
                uie.OnTouchDown(e); 
            }
            else 
            {
                ContentElement ce = sender as ContentElement;

                if (ce != null) 
                {
                    ce.OnTouchDown(e); 
                } 
                else
                { 
                    ((UIElement3D)sender).OnTouchDown(e);
                }
            }
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewTouchMoveThunk(object sender, TouchEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;
 
            if (uie != null) 
            {
                uie.OnPreviewTouchMove(e); 
            }
            else
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                { 
                    ce.OnPreviewTouchMove(e);
                } 
                else
                {
                    ((UIElement3D)sender).OnPreviewTouchMove(e);
                } 
            }
        } 
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnTouchMoveThunk(object sender, TouchEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement; 

            if (uie != null) 
            {
                uie.OnTouchMove(e);
            }
            else 
            {
                ContentElement ce = sender as ContentElement; 
 
                if (ce != null)
                { 
                    ce.OnTouchMove(e);
                }
                else
                { 
                    ((UIElement3D)sender).OnTouchMove(e);
                } 
            } 
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnPreviewTouchUpThunk(object sender, TouchEventArgs e)
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 

            if (uie != null)
            {
                uie.OnPreviewTouchUp(e); 
            }
            else 
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                {
                    ce.OnPreviewTouchUp(e);
                } 
                else
                { 
                    ((UIElement3D)sender).OnPreviewTouchUp(e); 
                }
            } 
        }

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote>
        [SecurityCritical] 
        private static void OnTouchUpThunk(object sender, TouchEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement;

            if (uie != null) 
            {
                uie.OnTouchUp(e); 
            } 
            else
            { 
                ContentElement ce = sender as ContentElement;

                if (ce != null)
                { 
                    ce.OnTouchUp(e);
                } 
                else 
                {
                    ((UIElement3D)sender).OnTouchUp(e); 
                }
            }
        }
 
        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input 
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnGotTouchCaptureThunk(object sender, TouchEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");

            UIElement uie = sender as UIElement; 

            if (uie != null) 
            { 
                uie.OnGotTouchCapture(e);
            } 
            else
            {
                ContentElement ce = sender as ContentElement;
 
                if (ce != null)
                { 
                    ce.OnGotTouchCapture(e); 
                }
                else 
                {
                    ((UIElement3D)sender).OnGotTouchCapture(e);
                }
            } 
        }
 
        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnLostTouchCaptureThunk(object sender, TouchEventArgs e)
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 

            UIElement uie = sender as UIElement; 
 
            if (uie != null)
            { 
                uie.OnLostTouchCapture(e);
            }
            else
            { 
                ContentElement ce = sender as ContentElement;
 
                if (ce != null) 
                {
                    ce.OnLostTouchCapture(e); 
                }
                else
                {
                    ((UIElement3D)sender).OnLostTouchCapture(e); 
                }
            } 
        } 

        /// <SecurityNote> 
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote>
        [SecurityCritical]
        private static void OnTouchEnterThunk(object sender, TouchEventArgs e) 
        {
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled."); 
 
            UIElement uie = sender as UIElement;
 
            if (uie != null)
            {
                uie.OnTouchEnter(e);
            } 
            else
            { 
                ContentElement ce = sender as ContentElement; 

                if (ce != null) 
                {
                    ce.OnTouchEnter(e);
                }
                else 
                {
                    ((UIElement3D)sender).OnTouchEnter(e); 
                } 
            }
        } 

        /// <SecurityNote>
        ///     Critical: This code can be used to spoof input
        /// </SecurityNote> 
        [SecurityCritical]
        private static void OnTouchLeaveThunk(object sender, TouchEventArgs e) 
        { 
            Invariant.Assert(!e.Handled, "Unexpected: Event has already been handled.");
 
            UIElement uie = sender as UIElement;

            if (uie != null)
            { 
                uie.OnTouchLeave(e);
            } 
            else 
            {
                ContentElement ce = sender as ContentElement; 

                if (ce != null)
                {
                    ce.OnTouchLeave(e); 
                }
                else 
                { 
                    ((UIElement3D)sender).OnTouchLeave(e);
                } 
            }
        }

        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseDownEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewMouseDownEvent = Mouse.PreviewMouseDownEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the mouse button was pressed
        /// </summary>
        public event MouseButtonEventHandler PreviewMouseDown
        { 
            add { AddHandler(Mouse.PreviewMouseDownEvent, value, false); }
            remove { RemoveHandler(Mouse.PreviewMouseDownEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting the mouse button was pressed
        /// </summary>
        protected virtual void OnPreviewMouseDown(MouseButtonEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Mouse.MouseDownEvent. 
        /// </summary> 
        public static readonly RoutedEvent MouseDownEvent = Mouse.MouseDownEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting the mouse button was pressed
        /// </summary>
        public event MouseButtonEventHandler MouseDown 
        {
            add { AddHandler(Mouse.MouseDownEvent, value, false); } 
            remove { RemoveHandler(Mouse.MouseDownEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting the mouse button was pressed
        /// </summary>
        protected virtual void OnMouseDown(MouseButtonEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseUpEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewMouseUpEvent = Mouse.PreviewMouseUpEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting the mouse button was released
        /// </summary> 
        public event MouseButtonEventHandler PreviewMouseUp
        { 
            add { AddHandler(Mouse.PreviewMouseUpEvent, value, false); } 
            remove { RemoveHandler(Mouse.PreviewMouseUpEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting the mouse button was released
        /// </summary> 
        protected virtual void OnPreviewMouseUp(MouseButtonEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Mouse.MouseUpEvent.
        /// </summary> 
        public static readonly RoutedEvent MouseUpEvent = Mouse.MouseUpEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting the mouse button was released 
        /// </summary>
        public event MouseButtonEventHandler MouseUp 
        { 
            add { AddHandler(Mouse.MouseUpEvent, value, false); }
            remove { RemoveHandler(Mouse.MouseUpEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting the mouse button was released 
        /// </summary>
        protected virtual void OnMouseUp(MouseButtonEventArgs e) {} 
 
        /// <summary>
        ///     Declaration of the routed event reporting the left mouse button was pressed 
        /// </summary>
        public static readonly RoutedEvent PreviewMouseLeftButtonDownEvent = EventManager.RegisterRoutedEvent("PreviewMouseLeftButtonDown", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis);

        /// <summary> 
        ///     Event reporting the left mouse button was pressed
        /// </summary> 
        public event MouseButtonEventHandler PreviewMouseLeftButtonDown 
        {
            add { AddHandler(UIElement.PreviewMouseLeftButtonDownEvent, value, false); } 
            remove { RemoveHandler(UIElement.PreviewMouseLeftButtonDownEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting the left mouse button was pressed
        /// </summary> 
        protected virtual void OnPreviewMouseLeftButtonDown(MouseButtonEventArgs e) {} 

        /// <summary> 
        ///     Declaration of the routed event reporting the left mouse button was pressed
        /// </summary>
        public static readonly RoutedEvent MouseLeftButtonDownEvent = EventManager.RegisterRoutedEvent("MouseLeftButtonDown", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis);
 
        /// <summary>
        ///     Event reporting the left mouse button was pressed 
        /// </summary> 
        public event MouseButtonEventHandler MouseLeftButtonDown
        { 
            add { AddHandler(UIElement.MouseLeftButtonDownEvent, value, false); }
            remove { RemoveHandler(UIElement.MouseLeftButtonDownEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting the left mouse button was pressed 
        /// </summary> 
        protected virtual void OnMouseLeftButtonDown(MouseButtonEventArgs e) {}
 
        /// <summary>
        ///     Declaration of the routed event reporting the left mouse button was released
        /// </summary>
        public static readonly RoutedEvent PreviewMouseLeftButtonUpEvent = EventManager.RegisterRoutedEvent("PreviewMouseLeftButtonUp", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis); 

        /// <summary> 
        ///     Event reporting the left mouse button was released 
        /// </summary>
        public event MouseButtonEventHandler PreviewMouseLeftButtonUp 
        {
            add { AddHandler(UIElement.PreviewMouseLeftButtonUpEvent, value, false); }
            remove { RemoveHandler(UIElement.PreviewMouseLeftButtonUpEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting the left mouse button was released 
        /// </summary>
        protected virtual void OnPreviewMouseLeftButtonUp(MouseButtonEventArgs e) {} 

        /// <summary>
        ///     Declaration of the routed event reporting the left mouse button was released
        /// </summary> 
        public static readonly RoutedEvent MouseLeftButtonUpEvent = EventManager.RegisterRoutedEvent("MouseLeftButtonUp", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis);
 
        /// <summary> 
        ///     Event reporting the left mouse button was released
        /// </summary> 
        public event MouseButtonEventHandler MouseLeftButtonUp
        {
            add { AddHandler(UIElement.MouseLeftButtonUpEvent, value, false); }
            remove { RemoveHandler(UIElement.MouseLeftButtonUpEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting the left mouse button was released
        /// </summary> 
        protected virtual void OnMouseLeftButtonUp(MouseButtonEventArgs e) {}

        /// <summary>
        ///     Declaration of the routed event reporting the right mouse button was pressed 
        /// </summary>
        public static readonly RoutedEvent PreviewMouseRightButtonDownEvent = EventManager.RegisterRoutedEvent("PreviewMouseRightButtonDown", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis); 
 
        /// <summary>
        ///     Event reporting the right mouse button was pressed 
        /// </summary>
        public event MouseButtonEventHandler PreviewMouseRightButtonDown
        {
            add { AddHandler(UIElement.PreviewMouseRightButtonDownEvent, value, false); } 
            remove { RemoveHandler(UIElement.PreviewMouseRightButtonDownEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting the right mouse button was pressed 
        /// </summary>
        protected virtual void OnPreviewMouseRightButtonDown(MouseButtonEventArgs e) {}

        /// <summary> 
        ///     Declaration of the routed event reporting the right mouse button was pressed
        /// </summary> 
        public static readonly RoutedEvent MouseRightButtonDownEvent = EventManager.RegisterRoutedEvent("MouseRightButtonDown", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis); 

        /// <summary> 
        ///     Event reporting the right mouse button was pressed
        /// </summary>
        public event MouseButtonEventHandler MouseRightButtonDown
        { 
            add { AddHandler(UIElement.MouseRightButtonDownEvent, value, false); }
            remove { RemoveHandler(UIElement.MouseRightButtonDownEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting the right mouse button was pressed
        /// </summary>
        protected virtual void OnMouseRightButtonDown(MouseButtonEventArgs e) {}
 
        /// <summary>
        ///     Declaration of the routed event reporting the right mouse button was released 
        /// </summary> 
        public static readonly RoutedEvent PreviewMouseRightButtonUpEvent = EventManager.RegisterRoutedEvent("PreviewMouseRightButtonUp", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis);
 
        /// <summary>
        ///     Event reporting the right mouse button was released
        /// </summary>
        public event MouseButtonEventHandler PreviewMouseRightButtonUp 
        {
            add { AddHandler(UIElement.PreviewMouseRightButtonUpEvent, value, false); } 
            remove { RemoveHandler(UIElement.PreviewMouseRightButtonUpEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting the right mouse button was released
        /// </summary>
        protected virtual void OnPreviewMouseRightButtonUp(MouseButtonEventArgs e) {} 

        /// <summary> 
        ///     Declaration of the routed event reporting the right mouse button was released 
        /// </summary>
        public static readonly RoutedEvent MouseRightButtonUpEvent = EventManager.RegisterRoutedEvent("MouseRightButtonUp", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), _typeofThis); 

        /// <summary>
        ///     Event reporting the right mouse button was released
        /// </summary> 
        public event MouseButtonEventHandler MouseRightButtonUp
        { 
            add { AddHandler(UIElement.MouseRightButtonUpEvent, value, false); } 
            remove { RemoveHandler(UIElement.MouseRightButtonUpEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting the right mouse button was released
        /// </summary> 
        protected virtual void OnMouseRightButtonUp(MouseButtonEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseMoveEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewMouseMoveEvent = Mouse.PreviewMouseMoveEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting a mouse move 
        /// </summary>
        public event MouseEventHandler PreviewMouseMove 
        { 
            add { AddHandler(Mouse.PreviewMouseMoveEvent, value, false); }
            remove { RemoveHandler(Mouse.PreviewMouseMoveEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting a mouse move 
        /// </summary>
        protected virtual void OnPreviewMouseMove(MouseEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the Mouse.MouseMoveEvent. 
        /// </summary>
        public static readonly RoutedEvent MouseMoveEvent = Mouse.MouseMoveEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting a mouse move
        /// </summary> 
        public event MouseEventHandler MouseMove 
        {
            add { AddHandler(Mouse.MouseMoveEvent, value, false); } 
            remove { RemoveHandler(Mouse.MouseMoveEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting a mouse move
        /// </summary> 
        protected virtual void OnMouseMove(MouseEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseWheelEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewMouseWheelEvent = Mouse.PreviewMouseWheelEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting a mouse wheel rotation 
        /// </summary> 
        public event MouseWheelEventHandler PreviewMouseWheel
        { 
            add { AddHandler(Mouse.PreviewMouseWheelEvent, value, false); }
            remove { RemoveHandler(Mouse.PreviewMouseWheelEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting a mouse wheel rotation 
        /// </summary> 
        protected virtual void OnPreviewMouseWheel(MouseWheelEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Mouse.MouseWheelEvent.
        /// </summary>
        public static readonly RoutedEvent MouseWheelEvent = Mouse.MouseWheelEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting a mouse wheel rotation 
        /// </summary>
        public event MouseWheelEventHandler MouseWheel 
        {
            add { AddHandler(Mouse.MouseWheelEvent, value, false); }
            remove { RemoveHandler(Mouse.MouseWheelEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting a mouse wheel rotation 
        /// </summary>
        protected virtual void OnMouseWheel(MouseWheelEventArgs e) {} 

        /// <summary>
        ///     Alias to the Mouse.MouseEnterEvent.
        /// </summary> 
        public static readonly RoutedEvent MouseEnterEvent = Mouse.MouseEnterEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting the mouse entered this element
        /// </summary> 
        public event MouseEventHandler MouseEnter
        {
            add { AddHandler(Mouse.MouseEnterEvent, value, false); }
            remove { RemoveHandler(Mouse.MouseEnterEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting the mouse entered this element
        /// </summary> 
        protected virtual void OnMouseEnter(MouseEventArgs e) {}

        /// <summary>
        ///     Alias to the Mouse.MouseLeaveEvent. 
        /// </summary>
        public static readonly RoutedEvent MouseLeaveEvent = Mouse.MouseLeaveEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting the mouse left this element 
        /// </summary>
        public event MouseEventHandler MouseLeave
        {
            add { AddHandler(Mouse.MouseLeaveEvent, value, false); } 
            remove { RemoveHandler(Mouse.MouseLeaveEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting the mouse left this element 
        /// </summary>
        protected virtual void OnMouseLeave(MouseEventArgs e) {}

        /// <summary> 
        ///     Alias to the Mouse.GotMouseCaptureEvent.
        /// </summary> 
        public static readonly RoutedEvent GotMouseCaptureEvent = Mouse.GotMouseCaptureEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting that this element got the mouse capture
        /// </summary>
        public event MouseEventHandler GotMouseCapture
        { 
            add { AddHandler(Mouse.GotMouseCaptureEvent, value, false); }
            remove { RemoveHandler(Mouse.GotMouseCaptureEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting that this element got the mouse capture
        /// </summary>
        protected virtual void OnGotMouseCapture(MouseEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Mouse.LostMouseCaptureEvent. 
        /// </summary> 
        public static readonly RoutedEvent LostMouseCaptureEvent = Mouse.LostMouseCaptureEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting that this element lost the mouse capture
        /// </summary>
        public event MouseEventHandler LostMouseCapture 
        {
            add { AddHandler(Mouse.LostMouseCaptureEvent, value, false); } 
            remove { RemoveHandler(Mouse.LostMouseCaptureEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting that this element lost the mouse capture
        /// </summary>
        protected virtual void OnLostMouseCapture(MouseEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Mouse.QueryCursorEvent. 
        /// </summary>
        public static readonly RoutedEvent QueryCursorEvent = Mouse.QueryCursorEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting the cursor to display was requested
        /// </summary> 
        public event QueryCursorEventHandler QueryCursor
        { 
            add { AddHandler(Mouse.QueryCursorEvent, value, false); } 
            remove { RemoveHandler(Mouse.QueryCursorEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting the cursor to display was requested
        /// </summary> 
        protected virtual void OnQueryCursor(QueryCursorEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusDownEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewStylusDownEvent = Stylus.PreviewStylusDownEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting a stylus-down 
        /// </summary>
        public event StylusDownEventHandler PreviewStylusDown 
        { 
            add { AddHandler(Stylus.PreviewStylusDownEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusDownEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting a stylus-down 
        /// </summary>
        protected virtual void OnPreviewStylusDown(StylusDownEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the Stylus.StylusDownEvent. 
        /// </summary>
        public static readonly RoutedEvent StylusDownEvent = Stylus.StylusDownEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting a stylus-down
        /// </summary> 
        public event StylusDownEventHandler StylusDown 
        {
            add { AddHandler(Stylus.StylusDownEvent, value, false); } 
            remove { RemoveHandler(Stylus.StylusDownEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting a stylus-down
        /// </summary> 
        protected virtual void OnStylusDown(StylusDownEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusUpEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewStylusUpEvent = Stylus.PreviewStylusUpEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting a stylus-up 
        /// </summary> 
        public event StylusEventHandler PreviewStylusUp
        { 
            add { AddHandler(Stylus.PreviewStylusUpEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusUpEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting a stylus-up 
        /// </summary> 
        protected virtual void OnPreviewStylusUp(StylusEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Stylus.StylusUpEvent.
        /// </summary>
        public static readonly RoutedEvent StylusUpEvent = Stylus.StylusUpEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting a stylus-up 
        /// </summary>
        public event StylusEventHandler StylusUp 
        {
            add { AddHandler(Stylus.StylusUpEvent, value, false); }
            remove { RemoveHandler(Stylus.StylusUpEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting a stylus-up 
        /// </summary>
        protected virtual void OnStylusUp(StylusEventArgs e) {} 

        /// <summary>
        ///     Alias to the Stylus.PreviewStylusMoveEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewStylusMoveEvent = Stylus.PreviewStylusMoveEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting a stylus move
        /// </summary> 
        public event StylusEventHandler PreviewStylusMove
        {
            add { AddHandler(Stylus.PreviewStylusMoveEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusMoveEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting a stylus move
        /// </summary> 
        protected virtual void OnPreviewStylusMove(StylusEventArgs e) {}

        /// <summary>
        ///     Alias to the Stylus.StylusMoveEvent. 
        /// </summary>
        public static readonly RoutedEvent StylusMoveEvent = Stylus.StylusMoveEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting a stylus move 
        /// </summary>
        public event StylusEventHandler StylusMove
        {
            add { AddHandler(Stylus.StylusMoveEvent, value, false); } 
            remove { RemoveHandler(Stylus.StylusMoveEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting a stylus move 
        /// </summary>
        protected virtual void OnStylusMove(StylusEventArgs e) {}

        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusInAirMoveEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewStylusInAirMoveEvent = Stylus.PreviewStylusInAirMoveEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting a stylus-in-air-move
        /// </summary>
        public event StylusEventHandler PreviewStylusInAirMove
        { 
            add { AddHandler(Stylus.PreviewStylusInAirMoveEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusInAirMoveEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting a stylus-in-air-move
        /// </summary>
        protected virtual void OnPreviewStylusInAirMove(StylusEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Stylus.StylusInAirMoveEvent. 
        /// </summary> 
        public static readonly RoutedEvent StylusInAirMoveEvent = Stylus.StylusInAirMoveEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting a stylus-in-air-move
        /// </summary>
        public event StylusEventHandler StylusInAirMove 
        {
            add { AddHandler(Stylus.StylusInAirMoveEvent, value, false); } 
            remove { RemoveHandler(Stylus.StylusInAirMoveEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting a stylus-in-air-move
        /// </summary>
        protected virtual void OnStylusInAirMove(StylusEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Stylus.StylusEnterEvent. 
        /// </summary>
        public static readonly RoutedEvent StylusEnterEvent = Stylus.StylusEnterEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting the stylus entered this element
        /// </summary> 
        public event StylusEventHandler StylusEnter
        { 
            add { AddHandler(Stylus.StylusEnterEvent, value, false); } 
            remove { RemoveHandler(Stylus.StylusEnterEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting the stylus entered this element
        /// </summary> 
        protected virtual void OnStylusEnter(StylusEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Stylus.StylusLeaveEvent.
        /// </summary> 
        public static readonly RoutedEvent StylusLeaveEvent = Stylus.StylusLeaveEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting the stylus left this element 
        /// </summary>
        public event StylusEventHandler StylusLeave 
        { 
            add { AddHandler(Stylus.StylusLeaveEvent, value, false); }
            remove { RemoveHandler(Stylus.StylusLeaveEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting the stylus left this element 
        /// </summary>
        protected virtual void OnStylusLeave(StylusEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusInRangeEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewStylusInRangeEvent = Stylus.PreviewStylusInRangeEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting the stylus is now in range of the digitizer
        /// </summary> 
        public event StylusEventHandler PreviewStylusInRange 
        {
            add { AddHandler(Stylus.PreviewStylusInRangeEvent, value, false); } 
            remove { RemoveHandler(Stylus.PreviewStylusInRangeEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting the stylus is now in range of the digitizer
        /// </summary> 
        protected virtual void OnPreviewStylusInRange(StylusEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Stylus.StylusInRangeEvent.
        /// </summary>
        public static readonly RoutedEvent StylusInRangeEvent = Stylus.StylusInRangeEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting the stylus is now in range of the digitizer 
        /// </summary> 
        public event StylusEventHandler StylusInRange
        { 
            add { AddHandler(Stylus.StylusInRangeEvent, value, false); }
            remove { RemoveHandler(Stylus.StylusInRangeEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting the stylus is now in range of the digitizer 
        /// </summary> 
        protected virtual void OnStylusInRange(StylusEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusOutOfRangeEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewStylusOutOfRangeEvent = Stylus.PreviewStylusOutOfRangeEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the stylus is now out of range of the digitizer 
        /// </summary>
        public event StylusEventHandler PreviewStylusOutOfRange 
        {
            add { AddHandler(Stylus.PreviewStylusOutOfRangeEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusOutOfRangeEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting the stylus is now out of range of the digitizer 
        /// </summary>
        protected virtual void OnPreviewStylusOutOfRange(StylusEventArgs e) {} 

        /// <summary>
        ///     Alias to the Stylus.StylusOutOfRangeEvent.
        /// </summary> 
        public static readonly RoutedEvent StylusOutOfRangeEvent = Stylus.StylusOutOfRangeEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting the stylus is now out of range of the digitizer
        /// </summary> 
        public event StylusEventHandler StylusOutOfRange
        {
            add { AddHandler(Stylus.StylusOutOfRangeEvent, value, false); }
            remove { RemoveHandler(Stylus.StylusOutOfRangeEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting the stylus is now out of range of the digitizer
        /// </summary> 
        protected virtual void OnStylusOutOfRange(StylusEventArgs e) {}

        /// <summary>
        ///     Alias to the Stylus.PreviewStylusSystemGestureEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewStylusSystemGestureEvent = Stylus.PreviewStylusSystemGestureEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting a stylus system gesture 
        /// </summary>
        public event StylusSystemGestureEventHandler PreviewStylusSystemGesture
        {
            add { AddHandler(Stylus.PreviewStylusSystemGestureEvent, value, false); } 
            remove { RemoveHandler(Stylus.PreviewStylusSystemGestureEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting a stylus system gesture 
        /// </summary>
        protected virtual void OnPreviewStylusSystemGesture(StylusSystemGestureEventArgs e) {}

        /// <summary> 
        ///     Alias to the Stylus.StylusSystemGestureEvent.
        /// </summary> 
        public static readonly RoutedEvent StylusSystemGestureEvent = Stylus.StylusSystemGestureEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting a stylus system gesture
        /// </summary>
        public event StylusSystemGestureEventHandler StylusSystemGesture
        { 
            add { AddHandler(Stylus.StylusSystemGestureEvent, value, false); }
            remove { RemoveHandler(Stylus.StylusSystemGestureEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting a stylus system gesture
        /// </summary>
        protected virtual void OnStylusSystemGesture(StylusSystemGestureEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Stylus.GotStylusCaptureEvent. 
        /// </summary> 
        public static readonly RoutedEvent GotStylusCaptureEvent = Stylus.GotStylusCaptureEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting that this element got the stylus capture
        /// </summary>
        public event StylusEventHandler GotStylusCapture 
        {
            add { AddHandler(Stylus.GotStylusCaptureEvent, value, false); } 
            remove { RemoveHandler(Stylus.GotStylusCaptureEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting that this element got the stylus capture
        /// </summary>
        protected virtual void OnGotStylusCapture(StylusEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Stylus.LostStylusCaptureEvent. 
        /// </summary>
        public static readonly RoutedEvent LostStylusCaptureEvent = Stylus.LostStylusCaptureEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting that this element lost the stylus capture
        /// </summary> 
        public event StylusEventHandler LostStylusCapture
        { 
            add { AddHandler(Stylus.LostStylusCaptureEvent, value, false); } 
            remove { RemoveHandler(Stylus.LostStylusCaptureEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting that this element lost the stylus capture
        /// </summary> 
        protected virtual void OnLostStylusCapture(StylusEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Stylus.StylusButtonDownEvent.
        /// </summary> 
        public static readonly RoutedEvent StylusButtonDownEvent = Stylus.StylusButtonDownEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting the stylus button is down 
        /// </summary>
        public event StylusButtonEventHandler StylusButtonDown 
        { 
            add { AddHandler(Stylus.StylusButtonDownEvent, value, false); }
            remove { RemoveHandler(Stylus.StylusButtonDownEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting the stylus button is down 
        /// </summary>
        protected virtual void OnStylusButtonDown(StylusButtonEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the Stylus.StylusButtonUpEvent. 
        /// </summary>
        public static readonly RoutedEvent StylusButtonUpEvent = Stylus.StylusButtonUpEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting the stylus button is up
        /// </summary> 
        public event StylusButtonEventHandler StylusButtonUp 
        {
            add { AddHandler(Stylus.StylusButtonUpEvent, value, false); } 
            remove { RemoveHandler(Stylus.StylusButtonUpEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting the stylus button is up
        /// </summary> 
        protected virtual void OnStylusButtonUp(StylusButtonEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Stylus.PreviewStylusButtonDownEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewStylusButtonDownEvent = Stylus.PreviewStylusButtonDownEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting the stylus button is down 
        /// </summary> 
        public event StylusButtonEventHandler PreviewStylusButtonDown
        { 
            add { AddHandler(Stylus.PreviewStylusButtonDownEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusButtonDownEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting the stylus button is down 
        /// </summary> 
        protected virtual void OnPreviewStylusButtonDown(StylusButtonEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Stylus.PreviewStylusButtonUpEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewStylusButtonUpEvent = Stylus.PreviewStylusButtonUpEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the stylus button is up 
        /// </summary>
        public event StylusButtonEventHandler PreviewStylusButtonUp 
        {
            add { AddHandler(Stylus.PreviewStylusButtonUpEvent, value, false); }
            remove { RemoveHandler(Stylus.PreviewStylusButtonUpEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting the stylus button is up 
        /// </summary>
        protected virtual void OnPreviewStylusButtonUp(StylusButtonEventArgs e) {} 

        /// <summary>
        ///     Alias to the Keyboard.PreviewKeyDownEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewKeyDownEvent = Keyboard.PreviewKeyDownEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting a key was pressed
        /// </summary> 
        public event KeyEventHandler PreviewKeyDown
        {
            add { AddHandler(Keyboard.PreviewKeyDownEvent, value, false); }
            remove { RemoveHandler(Keyboard.PreviewKeyDownEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting a key was pressed
        /// </summary> 
        protected virtual void OnPreviewKeyDown(KeyEventArgs e) {}

        /// <summary>
        ///     Alias to the Keyboard.KeyDownEvent. 
        /// </summary>
        public static readonly RoutedEvent KeyDownEvent = Keyboard.KeyDownEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting a key was pressed 
        /// </summary>
        public event KeyEventHandler KeyDown
        {
            add { AddHandler(Keyboard.KeyDownEvent, value, false); } 
            remove { RemoveHandler(Keyboard.KeyDownEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting a key was pressed 
        /// </summary>
        protected virtual void OnKeyDown(KeyEventArgs e) {}

        /// <summary> 
        ///     Alias to the Keyboard.PreviewKeyUpEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewKeyUpEvent = Keyboard.PreviewKeyUpEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting a key was released
        /// </summary>
        public event KeyEventHandler PreviewKeyUp
        { 
            add { AddHandler(Keyboard.PreviewKeyUpEvent, value, false); }
            remove { RemoveHandler(Keyboard.PreviewKeyUpEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting a key was released
        /// </summary>
        protected virtual void OnPreviewKeyUp(KeyEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Keyboard.KeyUpEvent. 
        /// </summary> 
        public static readonly RoutedEvent KeyUpEvent = Keyboard.KeyUpEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting a key was released
        /// </summary>
        public event KeyEventHandler KeyUp 
        {
            add { AddHandler(Keyboard.KeyUpEvent, value, false); } 
            remove { RemoveHandler(Keyboard.KeyUpEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting a key was released
        /// </summary>
        protected virtual void OnKeyUp(KeyEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Keyboard.PreviewGotKeyboardFocusEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewGotKeyboardFocusEvent = Keyboard.PreviewGotKeyboardFocusEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting that the keyboard is focused on this element
        /// </summary> 
        public event KeyboardFocusChangedEventHandler PreviewGotKeyboardFocus
        { 
            add { AddHandler(Keyboard.PreviewGotKeyboardFocusEvent, value, false); } 
            remove { RemoveHandler(Keyboard.PreviewGotKeyboardFocusEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting that the keyboard is focused on this element
        /// </summary> 
        protected virtual void OnPreviewGotKeyboardFocus(KeyboardFocusChangedEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Keyboard.GotKeyboardFocusEvent.
        /// </summary> 
        public static readonly RoutedEvent GotKeyboardFocusEvent = Keyboard.GotKeyboardFocusEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting that the keyboard is focused on this element 
        /// </summary>
        public event KeyboardFocusChangedEventHandler GotKeyboardFocus 
        { 
            add { AddHandler(Keyboard.GotKeyboardFocusEvent, value, false); }
            remove { RemoveHandler(Keyboard.GotKeyboardFocusEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting that the keyboard is focused on this element 
        /// </summary>
        protected virtual void OnGotKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the Keyboard.PreviewLostKeyboardFocusEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewLostKeyboardFocusEvent = Keyboard.PreviewLostKeyboardFocusEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed
        /// </summary> 
        public event KeyboardFocusChangedEventHandler PreviewLostKeyboardFocus 
        {
            add { AddHandler(Keyboard.PreviewLostKeyboardFocusEvent, value, false); } 
            remove { RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed
        /// </summary> 
        protected virtual void OnPreviewLostKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Keyboard.LostKeyboardFocusEvent.
        /// </summary>
        public static readonly RoutedEvent LostKeyboardFocusEvent = Keyboard.LostKeyboardFocusEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
        /// </summary> 
        public event KeyboardFocusChangedEventHandler LostKeyboardFocus
        { 
            add { AddHandler(Keyboard.LostKeyboardFocusEvent, value, false); }
            remove { RemoveHandler(Keyboard.LostKeyboardFocusEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
        /// </summary> 
        protected virtual void OnLostKeyboardFocus(KeyboardFocusChangedEventArgs e) {}
 
        /// <summary>
        ///     Alias to the TextCompositionManager.PreviewTextInputEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewTextInputEvent = TextCompositionManager.PreviewTextInputEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting text composition 
        /// </summary>
        public event TextCompositionEventHandler PreviewTextInput 
        {
            add { AddHandler(TextCompositionManager.PreviewTextInputEvent, value, false); }
            remove { RemoveHandler(TextCompositionManager.PreviewTextInputEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting text composition 
        /// </summary>
        protected virtual void OnPreviewTextInput(TextCompositionEventArgs e) {} 

        /// <summary>
        ///     Alias to the TextCompositionManager.TextInputEvent.
        /// </summary> 
        public static readonly RoutedEvent TextInputEvent = TextCompositionManager.TextInputEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting text composition
        /// </summary> 
        public event TextCompositionEventHandler TextInput
        {
            add { AddHandler(TextCompositionManager.TextInputEvent, value, false); }
            remove { RemoveHandler(TextCompositionManager.TextInputEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting text composition
        /// </summary> 
        protected virtual void OnTextInput(TextCompositionEventArgs e) {}

        /// <summary>
        ///     Alias to the DragDrop.PreviewQueryContinueDragEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewQueryContinueDragEvent = DragDrop.PreviewQueryContinueDragEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting the preview query continue drag is going to happen 
        /// </summary>
        public event QueryContinueDragEventHandler PreviewQueryContinueDrag
        {
            add { AddHandler(DragDrop.PreviewQueryContinueDragEvent, value, false); } 
            remove { RemoveHandler(DragDrop.PreviewQueryContinueDragEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting the preview query continue drag is going to happen 
        /// </summary>
        protected virtual void OnPreviewQueryContinueDrag(QueryContinueDragEventArgs e) {}

        /// <summary> 
        ///     Alias to the DragDrop.QueryContinueDragEvent.
        /// </summary> 
        public static readonly RoutedEvent QueryContinueDragEvent = DragDrop.QueryContinueDragEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the query continue drag is going to happen
        /// </summary>
        public event QueryContinueDragEventHandler QueryContinueDrag
        { 
            add { AddHandler(DragDrop.QueryContinueDragEvent, value, false); }
            remove { RemoveHandler(DragDrop.QueryContinueDragEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting the query continue drag is going to happen
        /// </summary>
        protected virtual void OnQueryContinueDrag(QueryContinueDragEventArgs e) {}
 
        /// <summary>
        ///     Alias to the DragDrop.PreviewGiveFeedbackEvent. 
        /// </summary> 
        public static readonly RoutedEvent PreviewGiveFeedbackEvent = DragDrop.PreviewGiveFeedbackEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting the preview give feedback is going to happen
        /// </summary>
        public event GiveFeedbackEventHandler PreviewGiveFeedback 
        {
            add { AddHandler(DragDrop.PreviewGiveFeedbackEvent, value, false); } 
            remove { RemoveHandler(DragDrop.PreviewGiveFeedbackEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting the preview give feedback is going to happen
        /// </summary>
        protected virtual void OnPreviewGiveFeedback(GiveFeedbackEventArgs e) {} 

        /// <summary> 
        ///     Alias to the DragDrop.GiveFeedbackEvent. 
        /// </summary>
        public static readonly RoutedEvent GiveFeedbackEvent = DragDrop.GiveFeedbackEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting the give feedback is going to happen
        /// </summary> 
        public event GiveFeedbackEventHandler GiveFeedback
        { 
            add { AddHandler(DragDrop.GiveFeedbackEvent, value, false); } 
            remove { RemoveHandler(DragDrop.GiveFeedbackEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting the give feedback is going to happen
        /// </summary> 
        protected virtual void OnGiveFeedback(GiveFeedbackEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the DragDrop.PreviewDragEnterEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewDragEnterEvent = DragDrop.PreviewDragEnterEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting the preview drag enter is going to happen 
        /// </summary>
        public event DragEventHandler PreviewDragEnter 
        { 
            add { AddHandler(DragDrop.PreviewDragEnterEvent, value, false); }
            remove { RemoveHandler(DragDrop.PreviewDragEnterEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting the preview drag enter is going to happen 
        /// </summary>
        protected virtual void OnPreviewDragEnter(DragEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the DragDrop.DragEnterEvent. 
        /// </summary>
        public static readonly RoutedEvent DragEnterEvent = DragDrop.DragEnterEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting the drag enter is going to happen
        /// </summary> 
        public event DragEventHandler DragEnter 
        {
            add { AddHandler(DragDrop.DragEnterEvent, value, false); } 
            remove { RemoveHandler(DragDrop.DragEnterEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting the drag enter is going to happen
        /// </summary> 
        protected virtual void OnDragEnter(DragEventArgs e) {} 

        /// <summary> 
        ///     Alias to the DragDrop.PreviewDragOverEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewDragOverEvent = DragDrop.PreviewDragOverEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting the preview drag over is going to happen 
        /// </summary> 
        public event DragEventHandler PreviewDragOver
        { 
            add { AddHandler(DragDrop.PreviewDragOverEvent, value, false); }
            remove { RemoveHandler(DragDrop.PreviewDragOverEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting the preview drag over is going to happen 
        /// </summary> 
        protected virtual void OnPreviewDragOver(DragEventArgs e) {}
 
        /// <summary>
        ///     Alias to the DragDrop.DragOverEvent.
        /// </summary>
        public static readonly RoutedEvent DragOverEvent = DragDrop.DragOverEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the drag over is going to happen 
        /// </summary>
        public event DragEventHandler DragOver 
        {
            add { AddHandler(DragDrop.DragOverEvent, value, false); }
            remove { RemoveHandler(DragDrop.DragOverEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting the drag over is going to happen 
        /// </summary>
        protected virtual void OnDragOver(DragEventArgs e) {} 

        /// <summary>
        ///     Alias to the DragDrop.PreviewDragLeaveEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewDragLeaveEvent = DragDrop.PreviewDragLeaveEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting the preview drag leave is going to happen
        /// </summary> 
        public event DragEventHandler PreviewDragLeave
        {
            add { AddHandler(DragDrop.PreviewDragLeaveEvent, value, false); }
            remove { RemoveHandler(DragDrop.PreviewDragLeaveEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting the preview drag leave is going to happen
        /// </summary> 
        protected virtual void OnPreviewDragLeave(DragEventArgs e) {}

        /// <summary>
        ///     Alias to the DragDrop.DragLeaveEvent. 
        /// </summary>
        public static readonly RoutedEvent DragLeaveEvent = DragDrop.DragLeaveEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting the drag leave is going to happen 
        /// </summary>
        public event DragEventHandler DragLeave
        {
            add { AddHandler(DragDrop.DragLeaveEvent, value, false); } 
            remove { RemoveHandler(DragDrop.DragLeaveEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting the drag leave is going to happen 
        /// </summary>
        protected virtual void OnDragLeave(DragEventArgs e) {}

        /// <summary> 
        ///     Alias to the DragDrop.PreviewDropEvent.
        /// </summary> 
        public static readonly RoutedEvent PreviewDropEvent = DragDrop.PreviewDropEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the preview drop is going to happen
        /// </summary>
        public event DragEventHandler PreviewDrop
        { 
            add { AddHandler(DragDrop.PreviewDropEvent, value, false); }
            remove { RemoveHandler(DragDrop.PreviewDropEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting the preview drop is going to happen
        /// </summary>
        protected virtual void OnPreviewDrop(DragEventArgs e) {}
 
        /// <summary>
        ///     Alias to the DragDrop.DropEvent. 
        /// </summary> 
        public static readonly RoutedEvent DropEvent = DragDrop.DropEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting the drag enter is going to happen
        /// </summary>
        public event DragEventHandler Drop 
        {
            add { AddHandler(DragDrop.DropEvent, value, false); } 
            remove { RemoveHandler(DragDrop.DropEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting the drag enter is going to happen
        /// </summary>
        protected virtual void OnDrop(DragEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Touch.PreviewTouchDownEvent. 
        /// </summary>
        public static readonly RoutedEvent PreviewTouchDownEvent = Touch.PreviewTouchDownEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting a finger touched the screen
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<TouchEventArgs> PreviewTouchDown 
        { 
            add { AddHandler(Touch.PreviewTouchDownEvent, value, false); }
            remove { RemoveHandler(Touch.PreviewTouchDownEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting a finger touched the screen 
        /// </summary>
        protected virtual void OnPreviewTouchDown(TouchEventArgs e) {} 
 
        /// <summary>
        ///     Alias to the Touch.TouchDownEvent. 
        /// </summary>
        public static readonly RoutedEvent TouchDownEvent = Touch.TouchDownEvent.AddOwner(_typeofThis);

        /// <summary> 
        ///     Event reporting a finger touched the screen
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<TouchEventArgs> TouchDown
        { 
            add { AddHandler(Touch.TouchDownEvent, value, false); }
            remove { RemoveHandler(Touch.TouchDownEvent, value); }
        }
 
        /// <summary>
        ///     Virtual method reporting a finger touched the screen 
        /// </summary> 
        protected virtual void OnTouchDown(TouchEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Touch.PreviewTouchMoveEvent.
        /// </summary>
        public static readonly RoutedEvent PreviewTouchMoveEvent = Touch.PreviewTouchMoveEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting a finger moved across the screen 
        /// </summary>
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<TouchEventArgs> PreviewTouchMove
        {
            add { AddHandler(Touch.PreviewTouchMoveEvent, value, false); }
            remove { RemoveHandler(Touch.PreviewTouchMoveEvent, value); } 
        }
 
        /// <summary> 
        ///     Virtual method reporting a finger moved across the screen
        /// </summary> 
        protected virtual void OnPreviewTouchMove(TouchEventArgs e) {}

        /// <summary>
        ///     Alias to the Touch.TouchMoveEvent. 
        /// </summary>
        public static readonly RoutedEvent TouchMoveEvent = Touch.TouchMoveEvent.AddOwner(_typeofThis); 
 
        /// <summary>
        ///     Event reporting a finger moved across the screen 
        /// </summary>
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<TouchEventArgs> TouchMove
        { 
            add { AddHandler(Touch.TouchMoveEvent, value, false); }
            remove { RemoveHandler(Touch.TouchMoveEvent, value); } 
        } 

        /// <summary> 
        ///     Virtual method reporting a finger moved across the screen
        /// </summary>
        protected virtual void OnTouchMove(TouchEventArgs e) {}
 
        /// <summary>
        ///     Alias to the Touch.PreviewTouchUpEvent. 
        /// </summary> 
        public static readonly RoutedEvent PreviewTouchUpEvent = Touch.PreviewTouchUpEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting a finger lifted off the screen
        /// </summary>
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<TouchEventArgs> PreviewTouchUp
        { 
            add { AddHandler(Touch.PreviewTouchUpEvent, value, false); } 
            remove { RemoveHandler(Touch.PreviewTouchUpEvent, value); }
        } 

        /// <summary>
        ///     Virtual method reporting a finger lifted off the screen
        /// </summary> 
        protected virtual void OnPreviewTouchUp(TouchEventArgs e) {}
 
        /// <summary> 
        ///     Alias to the Touch.TouchUpEvent.
        /// </summary> 
        public static readonly RoutedEvent TouchUpEvent = Touch.TouchUpEvent.AddOwner(_typeofThis);

        /// <summary>
        ///     Event reporting a finger lifted off the screen 
        /// </summary>
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<TouchEventArgs> TouchUp 
        {
            add { AddHandler(Touch.TouchUpEvent, value, false); } 
            remove { RemoveHandler(Touch.TouchUpEvent, value); }
        }

        /// <summary> 
        ///     Virtual method reporting a finger lifted off the screen
        /// </summary> 
        protected virtual void OnTouchUp(TouchEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Touch.GotTouchCaptureEvent.
        /// </summary>
        public static readonly RoutedEvent GotTouchCaptureEvent = Touch.GotTouchCaptureEvent.AddOwner(_typeofThis);
 
        /// <summary>
        ///     Event reporting a finger was captured to an element 
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<TouchEventArgs> GotTouchCapture 
        {
            add { AddHandler(Touch.GotTouchCaptureEvent, value, false); }
            remove { RemoveHandler(Touch.GotTouchCaptureEvent, value); }
        } 

        /// <summary> 
        ///     Virtual method reporting a finger was captured to an element 
        /// </summary>
        protected virtual void OnGotTouchCapture(TouchEventArgs e) {} 

        /// <summary>
        ///     Alias to the Touch.LostTouchCaptureEvent.
        /// </summary> 
        public static readonly RoutedEvent LostTouchCaptureEvent = Touch.LostTouchCaptureEvent.AddOwner(_typeofThis);
 
        /// <summary> 
        ///     Event reporting a finger is no longer captured to an element
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<TouchEventArgs> LostTouchCapture
        {
            add { AddHandler(Touch.LostTouchCaptureEvent, value, false); } 
            remove { RemoveHandler(Touch.LostTouchCaptureEvent, value); }
        } 
 
        /// <summary>
        ///     Virtual method reporting a finger is no longer captured to an element 
        /// </summary>
        protected virtual void OnLostTouchCapture(TouchEventArgs e) {}

        /// <summary> 
        ///     Alias to the Touch.TouchEnterEvent.
        /// </summary> 
        public static readonly RoutedEvent TouchEnterEvent = Touch.TouchEnterEvent.AddOwner(_typeofThis); 

        /// <summary> 
        ///     Event reporting the mouse entered this element
        /// </summary>
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<TouchEventArgs> TouchEnter 
        {
            add { AddHandler(Touch.TouchEnterEvent, value, false); } 
            remove { RemoveHandler(Touch.TouchEnterEvent, value); } 
        }
 
        /// <summary>
        ///     Virtual method reporting the mouse entered this element
        /// </summary>
        protected virtual void OnTouchEnter(TouchEventArgs e) {} 

        /// <summary> 
        ///     Alias to the Touch.TouchLeaveEvent. 
        /// </summary>
        public static readonly RoutedEvent TouchLeaveEvent = Touch.TouchLeaveEvent.AddOwner(_typeofThis); 

        /// <summary>
        ///     Event reporting the mouse left this element
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<TouchEventArgs> TouchLeave 
        { 
            add { AddHandler(Touch.TouchLeaveEvent, value, false); }
            remove { RemoveHandler(Touch.TouchLeaveEvent, value); } 
        }

        /// <summary>
        ///     Virtual method reporting the mouse left this element 
        /// </summary>
        protected virtual void OnTouchLeave(TouchEventArgs e) {} 
 
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsMouseDirectlyOverPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsMouseDirectlyOver", 
                                typeof(bool),
                                _typeofThis, 
                                new PropertyMetadata( 
                                            BooleanBoxes.FalseBox, // default value
                                            new PropertyChangedCallback(IsMouseDirectlyOver_Changed))); 

        /// <summary>
        ///     The dependency property for the IsMouseDirectlyOver property.
        /// </summary> 
        public static readonly DependencyProperty IsMouseDirectlyOverProperty =
            IsMouseDirectlyOverPropertyKey.DependencyProperty; 
 
        private static void IsMouseDirectlyOver_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            ((UIElement) d).RaiseIsMouseDirectlyOverChanged(e);
        }

        /// <summary> 
        ///     IsMouseDirectlyOverChanged private key
        /// </summary> 
        internal static readonly EventPrivateKey IsMouseDirectlyOverChangedKey = new EventPrivateKey(); 

 
        /// <summary>
        ///     An event reporting that the IsMouseDirectlyOver property changed.
        /// </summary>
        public event DependencyPropertyChangedEventHandler IsMouseDirectlyOverChanged 
        {
            add    { EventHandlersStoreAdd(UIElement.IsMouseDirectlyOverChangedKey, value); } 
            remove { EventHandlersStoreRemove(UIElement.IsMouseDirectlyOverChangedKey, value); } 
        }
 
        /// <summary>
        ///     An event reporting that the IsMouseDirectlyOver property changed.
        /// </summary>
        protected virtual void OnIsMouseDirectlyOverChanged(DependencyPropertyChangedEventArgs e) 
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
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsMouseOverPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsMouseOver", 
                                typeof(bool),
                                _typeofThis, 
                                new PropertyMetadata( 
                                            BooleanBoxes.FalseBox));
 
        /// <summary>
        ///     The dependency property for the IsMouseOver property.
        /// </summary>
        public static readonly DependencyProperty IsMouseOverProperty = 
            IsMouseOverPropertyKey.DependencyProperty;
 
        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        internal static readonly DependencyPropertyKey IsStylusOverPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsStylusOver",
                                typeof(bool), 
                                _typeofThis,
                                new PropertyMetadata( 
                                            BooleanBoxes.FalseBox)); 

        /// <summary> 
        ///     The dependency property for the IsStylusOver property.
        /// </summary>
        public static readonly DependencyProperty IsStylusOverProperty =
            IsStylusOverPropertyKey.DependencyProperty; 

        /// <summary> 
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsKeyboardFocusWithinPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "IsKeyboardFocusWithin",
                                typeof(bool),
                                _typeofThis, 
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox)); 
 
        /// <summary>
        ///     The dependency property for the IsKeyboardFocusWithin property. 
        /// </summary>
        public static readonly DependencyProperty IsKeyboardFocusWithinProperty =
            IsKeyboardFocusWithinPropertyKey.DependencyProperty;
 
        /// <summary>
        ///     IsKeyboardFocusWithinChanged private key 
        /// </summary> 
        internal static readonly EventPrivateKey IsKeyboardFocusWithinChangedKey = new EventPrivateKey();
 

        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed.
        /// </summary> 
        public event DependencyPropertyChangedEventHandler IsKeyboardFocusWithinChanged
        { 
            add    { EventHandlersStoreAdd(UIElement.IsKeyboardFocusWithinChangedKey, value); } 
            remove { EventHandlersStoreRemove(UIElement.IsKeyboardFocusWithinChangedKey, value); }
        } 

        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed.
        /// </summary> 
        protected virtual void OnIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs e)
        { 
        } 

        internal void RaiseIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs args) 
        {
            // Call the virtual method first.
            OnIsKeyboardFocusWithinChanged(args);
 
            // Raise the public event second.
            RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusWithinChangedKey, args); 
        } 

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary>
        internal static readonly DependencyPropertyKey IsMouseCapturedPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "IsMouseCaptured",
                                typeof(bool), 
                                _typeofThis, 
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox, // default value 
                                            new PropertyChangedCallback(IsMouseCaptured_Changed)));

        /// <summary>
        ///     The dependency property for the IsMouseCaptured property. 
        /// </summary>
        public static readonly DependencyProperty IsMouseCapturedProperty = 
            IsMouseCapturedPropertyKey.DependencyProperty; 

        private static void IsMouseCaptured_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            ((UIElement) d).RaiseIsMouseCapturedChanged(e);
        }
 
        /// <summary>
        ///     IsMouseCapturedChanged private key 
        /// </summary> 
        internal static readonly EventPrivateKey IsMouseCapturedChangedKey = new EventPrivateKey();
 

        /// <summary>
        ///     An event reporting that the IsMouseCaptured property changed.
        /// </summary> 
        public event DependencyPropertyChangedEventHandler IsMouseCapturedChanged
        { 
            add    { EventHandlersStoreAdd(UIElement.IsMouseCapturedChangedKey, value); } 
            remove { EventHandlersStoreRemove(UIElement.IsMouseCapturedChangedKey, value); }
        } 

        /// <summary>
        ///     An event reporting that the IsMouseCaptured property changed.
        /// </summary> 
        protected virtual void OnIsMouseCapturedChanged(DependencyPropertyChangedEventArgs e)
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
        ///     The key needed set a read-only property.
        /// </summary>
        internal static readonly DependencyPropertyKey IsMouseCaptureWithinPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "IsMouseCaptureWithin",
                                typeof(bool), 
                                _typeofThis, 
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox)); 

        /// <summary>
        ///     The dependency property for the IsMouseCaptureWithin property.
        /// </summary> 
        public static readonly DependencyProperty IsMouseCaptureWithinProperty =
            IsMouseCaptureWithinPropertyKey.DependencyProperty; 
 
        /// <summary>
        ///     IsMouseCaptureWithinChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey IsMouseCaptureWithinChangedKey = new EventPrivateKey();

 
        /// <summary>
        ///     An event reporting that the IsMouseCaptureWithin property changed. 
        /// </summary> 
        public event DependencyPropertyChangedEventHandler IsMouseCaptureWithinChanged
        { 
            add    { EventHandlersStoreAdd(UIElement.IsMouseCaptureWithinChangedKey, value); }
            remove { EventHandlersStoreRemove(UIElement.IsMouseCaptureWithinChangedKey, value); }
        }
 
        /// <summary>
        ///     An event reporting that the IsMouseCaptureWithin property changed. 
        /// </summary> 
        protected virtual void OnIsMouseCaptureWithinChanged(DependencyPropertyChangedEventArgs e)
        { 
        }

        internal void RaiseIsMouseCaptureWithinChanged(DependencyPropertyChangedEventArgs args)
        { 
            // Call the virtual method first.
            OnIsMouseCaptureWithinChanged(args); 
 
            // Raise the public event second.
            RaiseDependencyPropertyChanged(UIElement.IsMouseCaptureWithinChangedKey, args); 
        }

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsStylusDirectlyOverPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsStylusDirectlyOver",
                                typeof(bool), 
                                _typeofThis,
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox, // default value
                                            new PropertyChangedCallback(IsStylusDirectlyOver_Changed))); 

        /// <summary> 
        ///     The dependency property for the IsStylusDirectlyOver property. 
        /// </summary>
        public static readonly DependencyProperty IsStylusDirectlyOverProperty = 
            IsStylusDirectlyOverPropertyKey.DependencyProperty;

        private static void IsStylusDirectlyOver_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            ((UIElement) d).RaiseIsStylusDirectlyOverChanged(e);
        } 
 
        /// <summary>
        ///     IsStylusDirectlyOverChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey IsStylusDirectlyOverChangedKey = new EventPrivateKey();

 
        /// <summary>
        ///     An event reporting that the IsStylusDirectlyOver property changed. 
        /// </summary> 
        public event DependencyPropertyChangedEventHandler IsStylusDirectlyOverChanged
        { 
            add    { EventHandlersStoreAdd(UIElement.IsStylusDirectlyOverChangedKey, value); }
            remove { EventHandlersStoreRemove(UIElement.IsStylusDirectlyOverChangedKey, value); }
        }
 
        /// <summary>
        ///     An event reporting that the IsStylusDirectlyOver property changed. 
        /// </summary> 
        protected virtual void OnIsStylusDirectlyOverChanged(DependencyPropertyChangedEventArgs e)
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
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsStylusCapturedPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsStylusCaptured",
                                typeof(bool), 
                                _typeofThis,
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox, // default value
                                            new PropertyChangedCallback(IsStylusCaptured_Changed))); 

        /// <summary> 
        ///     The dependency property for the IsStylusCaptured property. 
        /// </summary>
        public static readonly DependencyProperty IsStylusCapturedProperty = 
            IsStylusCapturedPropertyKey.DependencyProperty;

        private static void IsStylusCaptured_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            ((UIElement) d).RaiseIsStylusCapturedChanged(e);
        } 
 
        /// <summary>
        ///     IsStylusCapturedChanged private key 
        /// </summary>
        internal static readonly EventPrivateKey IsStylusCapturedChangedKey = new EventPrivateKey();

 
        /// <summary>
        ///     An event reporting that the IsStylusCaptured property changed. 
        /// </summary> 
        public event DependencyPropertyChangedEventHandler IsStylusCapturedChanged
        { 
            add    { EventHandlersStoreAdd(UIElement.IsStylusCapturedChangedKey, value); }
            remove { EventHandlersStoreRemove(UIElement.IsStylusCapturedChangedKey, value); }
        }
 
        /// <summary>
        ///     An event reporting that the IsStylusCaptured property changed. 
        /// </summary> 
        protected virtual void OnIsStylusCapturedChanged(DependencyPropertyChangedEventArgs e)
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
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsStylusCaptureWithinPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsStylusCaptureWithin",
                                typeof(bool), 
                                _typeofThis,
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox));
 
        /// <summary>
        ///     The dependency property for the IsStylusCaptureWithin property. 
        /// </summary> 
        public static readonly DependencyProperty IsStylusCaptureWithinProperty =
            IsStylusCaptureWithinPropertyKey.DependencyProperty; 

        /// <summary>
        ///     IsStylusCaptureWithinChanged private key
        /// </summary> 
        internal static readonly EventPrivateKey IsStylusCaptureWithinChangedKey = new EventPrivateKey();
 
 
        /// <summary>
        ///     An event reporting that the IsStylusCaptureWithin property changed. 
        /// </summary>
        public event DependencyPropertyChangedEventHandler IsStylusCaptureWithinChanged
        {
            add    { EventHandlersStoreAdd(UIElement.IsStylusCaptureWithinChangedKey, value); } 
            remove { EventHandlersStoreRemove(UIElement.IsStylusCaptureWithinChangedKey, value); }
        } 
 
        /// <summary>
        ///     An event reporting that the IsStylusCaptureWithin property changed. 
        /// </summary>
        protected virtual void OnIsStylusCaptureWithinChanged(DependencyPropertyChangedEventArgs e)
        {
        } 

        internal void RaiseIsStylusCaptureWithinChanged(DependencyPropertyChangedEventArgs args) 
        { 
            // Call the virtual method first.
            OnIsStylusCaptureWithinChanged(args); 

            // Raise the public event second.
            RaiseDependencyPropertyChanged(UIElement.IsStylusCaptureWithinChangedKey, args);
        } 

        /// <summary> 
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsKeyboardFocusedPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "IsKeyboardFocused",
                                typeof(bool),
                                _typeofThis, 
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox, // default value 
                                            new PropertyChangedCallback(IsKeyboardFocused_Changed))); 

        /// <summary> 
        ///     The dependency property for the IsKeyboardFocused property.
        /// </summary>
        public static readonly DependencyProperty IsKeyboardFocusedProperty =
            IsKeyboardFocusedPropertyKey.DependencyProperty; 

        private static void IsKeyboardFocused_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            ((UIElement) d).RaiseIsKeyboardFocusedChanged(e);
        } 

        /// <summary>
        ///     IsKeyboardFocusedChanged private key
        /// </summary> 
        internal static readonly EventPrivateKey IsKeyboardFocusedChangedKey = new EventPrivateKey();
 
 
        /// <summary>
        ///     An event reporting that the IsKeyboardFocused property changed. 
        /// </summary>
        public event DependencyPropertyChangedEventHandler IsKeyboardFocusedChanged
        {
            add    { EventHandlersStoreAdd(UIElement.IsKeyboardFocusedChangedKey, value); } 
            remove { EventHandlersStoreRemove(UIElement.IsKeyboardFocusedChangedKey, value); }
        } 
 
        /// <summary>
        ///     An event reporting that the IsKeyboardFocused property changed. 
        /// </summary>
        protected virtual void OnIsKeyboardFocusedChanged(DependencyPropertyChangedEventArgs e)
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
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey AreAnyTouchesDirectlyOverPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "AreAnyTouchesDirectlyOver",
                                typeof(bool),
                                _typeofThis, 
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox)); 
 
        /// <summary>
        ///     The dependency property for the AreAnyTouchesDirectlyOver property. 
        /// </summary>
        public static readonly DependencyProperty AreAnyTouchesDirectlyOverProperty =
            AreAnyTouchesDirectlyOverPropertyKey.DependencyProperty;
 
        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary> 
        internal static readonly DependencyPropertyKey AreAnyTouchesOverPropertyKey =
                    DependencyProperty.RegisterReadOnly( 
                                "AreAnyTouchesOver",
                                typeof(bool),
                                _typeofThis,
                                new PropertyMetadata( 
                                            BooleanBoxes.FalseBox));
 
        /// <summary> 
        ///     The dependency property for the AreAnyTouchesOver property.
        /// </summary> 
        public static readonly DependencyProperty AreAnyTouchesOverProperty =
            AreAnyTouchesOverPropertyKey.DependencyProperty;

        /// <summary> 
        ///     The key needed set a read-only property.
        /// </summary> 
        internal static readonly DependencyPropertyKey AreAnyTouchesCapturedPropertyKey = 
                    DependencyProperty.RegisterReadOnly(
                                "AreAnyTouchesCaptured", 
                                typeof(bool),
                                _typeofThis,
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox)); 

        /// <summary> 
        ///     The dependency property for the AreAnyTouchesCaptured property. 
        /// </summary>
        public static readonly DependencyProperty AreAnyTouchesCapturedProperty = 
            AreAnyTouchesCapturedPropertyKey.DependencyProperty;

        /// <summary>
        ///     The key needed set a read-only property. 
        /// </summary>
        internal static readonly DependencyPropertyKey AreAnyTouchesCapturedWithinPropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "AreAnyTouchesCapturedWithin",
                                typeof(bool), 
                                _typeofThis,
                                new PropertyMetadata(
                                            BooleanBoxes.FalseBox));
 
        /// <summary>
        ///     The dependency property for the AreAnyTouchesCapturedWithin property. 
        /// </summary> 
        public static readonly DependencyProperty AreAnyTouchesCapturedWithinProperty =
            AreAnyTouchesCapturedWithinPropertyKey.DependencyProperty; 

        internal bool ReadFlag(CoreFlags field)
        {
            return (_flags & field) != 0; 
        }
 
        internal void WriteFlag(CoreFlags field,bool value) 
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
    }
 
        #region AllowDrop
 
        /// <summary> 
        ///     The DependencyProperty for the AllowDrop property.
        /// </summary> 
        public static readonly DependencyProperty AllowDropProperty =
                    DependencyProperty.Register(
                                "AllowDrop",
                                typeof(bool), 
                                typeof(UIElement),
                                new PropertyMetadata(BooleanBoxes.FalseBox)); 
 
        /// <summary>
        ///     A dependency property that allows the drop object as DragDrop target. 
        /// </summary>
        public bool AllowDrop
        {
            get { return (bool) GetValue(AllowDropProperty); } 
            set { SetValue(AllowDropProperty, BooleanBoxes.Box(value)); }
        } 
 
        #endregion AllowDrop
 
        /// <summary>
        /// Get the StylusPlugInCollection associated with the UIElement
        /// </summary>
        protected StylusPlugInCollection StylusPlugIns 
        {
            get 
            { 
                StylusPlugInCollection stylusCollection = StylusPlugInsField.GetValue(this);
                if (stylusCollection == null) 
                {
                    stylusCollection = new StylusPlugInCollection(this);
                    StylusPlugInsField.SetValue(this, stylusCollection);
                } 
                return stylusCollection;
            } 
        } 

        /// <summary> 
        /// Returns the size the element computed during the Measure pass.
        /// This is only valid if IsMeasureValid is true.
        /// </summary>
        public Size DesiredSize 
        {
            get 
            { 
                if(this.Visibility == Visibility.Collapsed)
                    return new Size(0,0); 
                else
                    return _desiredSize;
            }
        } 

        internal Size PreviousConstraint 
        { 
            get
            { 
                return _previousAvailableSize;
            }
        }
 
        // This is needed to prevent dirty elements from drawing and crashing while doing so.
        private bool IsRenderable() 
        { 
            //elements that were created but never invalidated/measured are clean
            //from layout perspective, but we still don't want to render them 
            //because they don't have state build up enough for that.
            if(NeverMeasured || NeverArranged)
                return false;
 
            //if element is collapsed, no rendering is needed
            //it is not only perf optimization, but also protection from 
            //UIElement to break itself since RenderSize is reported as (0,0) 
            //when UIElement is Collapsed
            if(ReadFlag(CoreFlags.IsCollapsed)) 
                return false;

            return IsMeasureValid && IsArrangeValid;
        } 

        internal void InvalidateMeasureInternal() 
        { 
            MeasureDirty = true;
        } 

        internal void InvalidateArrangeInternal()
        {
            ArrangeDirty = true; 
        }
 
        /// <summary> 
        /// Determines if the DesiredSize is valid.
        /// </summary> 
        /// <remarks>
        /// A developer can force arrangement to be invalidated by calling InvalidateMeasure.
        /// IsArrangeValid and IsMeasureValid are related,
        /// in that arrangement cannot be valid without measurement first being valid. 
        /// </remarks>
        public bool IsMeasureValid 
        { 
            get { return !MeasureDirty; }
        } 

        /// <summary>
        /// Determines if the RenderSize and position of child elements is valid.
        /// </summary> 
        /// <remarks>
        /// A developer can force arrangement to be invalidated by calling InvalidateArrange. 
        /// IsArrangeValid and IsMeasureValid are related, in that arrangement cannot be valid without measurement first 
        /// being valid.
        /// </remarks> 
        public bool IsArrangeValid
        {
            get { return !ArrangeDirty; }
        } 

 
        /// <summary> 
        /// Invalidates the measurement state for the element.
        /// This has the effect of also invalidating the arrange state for the element. 
        /// The element will be queued for an update layout that will occur asynchronously.
        /// </summary>
        public void InvalidateMeasure()
        { 
            if(     !MeasureDirty
                &&  !MeasureInProgress ) 
            { 
                Debug.Assert(MeasureRequest == null, "can't be clean and still have MeasureRequest");
 
//                 VerifyAccess();

                if(!NeverMeasured) //only measured once elements are allowed in *update* queue
                { 
                    ContextLayoutManager ContextLayoutManager = ContextLayoutManager.From(Dispatcher);
                    if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose)) 
                    { 
                        // Knowing when the layout queue goes from clean to dirty is interesting.
                        if (ContextLayoutManager.MeasureQueue.IsEmpty) 
                        {
                            EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientLayoutInvalidated, EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, PerfService.GetPerfElementID(this));
                        }
                    } 

                    ContextLayoutManager.MeasureQueue.Add(this); 
                } 
                MeasureDirty = true;
            } 
        }

        /// <summary>
        /// Invalidates the arrange state for the element. 
        /// The element will be queued for an update layout that will occur asynchronously.
        /// MeasureCore will not be called unless InvalidateMeasure is also called - or that something 
        /// else caused the measure state to be invalidated. 
        /// </summary>
        public void InvalidateArrange() 
        {
            if(   !ArrangeDirty
               && !ArrangeInProgress)
            { 
                Debug.Assert(ArrangeRequest == null, "can't be clean and still have MeasureRequest");
 
//                 VerifyAccess(); 

                if(!NeverArranged) 
                {
                    ContextLayoutManager ContextLayoutManager = ContextLayoutManager.From(Dispatcher);
                    ContextLayoutManager.ArrangeQueue.Add(this);
                } 

 
                ArrangeDirty = true; 
            }
        } 

        /// <summary>
        /// Invalidates the rendering of the element.
        /// Causes <see cref="System.Windows.UIElement.OnRender"/> to be called at a later time. 
        /// </summary>
        public void InvalidateVisual() 
        { 
            InvalidateArrange();
            RenderingInvalidated = true; 
        }


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
        protected virtual void OnChildDesiredSizeChanged(UIElement child)
        { 
            if(IsMeasureValid) 
            {
                InvalidateMeasure(); 
            }
        }

        /// <summary> 
        /// This event fires every time Layout updates the layout of the trees associated with current Dispatcher.
        /// Layout update can happen as a result of some propety change, window resize or explicit user request. 
        /// </summary> 
        public event EventHandler LayoutUpdated
        { 
            add
            {
                LayoutEventList.ListItem item = getLayoutUpdatedHandler(value);
 
                if(item == null)
                { 
                    //set a weak ref in LM 
                    item = ContextLayoutManager.From(Dispatcher).LayoutEvents.Add(value);
                    addLayoutUpdatedHandler(value, item); 
                }
            }
            remove
            { 
                LayoutEventList.ListItem item = getLayoutUpdatedHandler(value);
 
                if(item != null) 
                {
                    removeLayoutUpdatedHandler(value); 
                    //remove a weak ref from LM
                    ContextLayoutManager.From(Dispatcher).LayoutEvents.Remove(item);
                }
            } 
        }
 
 
        private void addLayoutUpdatedHandler(EventHandler handler, LayoutEventList.ListItem item)
        { 
            object cachedLayoutUpdatedItems = LayoutUpdatedListItemsField.GetValue(this);

            if(cachedLayoutUpdatedItems == null)
            { 
               LayoutUpdatedListItemsField.SetValue(this, item);
               LayoutUpdatedHandlersField.SetValue(this, handler); 
            } 
            else
            { 
                EventHandler cachedLayoutUpdatedHandler = LayoutUpdatedHandlersField.GetValue(this);
                if(cachedLayoutUpdatedHandler != null)
                {
                    //second unique handler is coming in. 
                    //allocate a datastructure
                    Hashtable list = new Hashtable(2); 
 
                    //add previously cached handler
                    list.Add(cachedLayoutUpdatedHandler, cachedLayoutUpdatedItems); 

                    //add new handler
                    list.Add(handler, item);
 
                    LayoutUpdatedHandlersField.ClearValue(this);
                    LayoutUpdatedListItemsField.SetValue(this,list); 
                } 
                else //already have a list
                { 
                    Hashtable list = (Hashtable)cachedLayoutUpdatedItems;
                    list.Add(handler, item);
                }
            } 
        }
 
        private LayoutEventList.ListItem getLayoutUpdatedHandler(EventHandler d) 
        {
            object cachedLayoutUpdatedItems = LayoutUpdatedListItemsField.GetValue(this); 

            if(cachedLayoutUpdatedItems == null)
            {
               return null; 
            }
            else 
            { 
                EventHandler cachedLayoutUpdatedHandler = LayoutUpdatedHandlersField.GetValue(this);
                if(cachedLayoutUpdatedHandler != null) 
                {
                    if(cachedLayoutUpdatedHandler == d) return (LayoutEventList.ListItem)cachedLayoutUpdatedItems;
                }
                else //already have a list 
                {
                    Hashtable list = (Hashtable)cachedLayoutUpdatedItems; 
                    LayoutEventList.ListItem item = (LayoutEventList.ListItem)(list[d]); 
                    return item;
                } 
                return null;
            }
        }
 
        private void removeLayoutUpdatedHandler(EventHandler d)
        { 
            object cachedLayoutUpdatedItems = LayoutUpdatedListItemsField.GetValue(this); 
            EventHandler cachedLayoutUpdatedHandler = LayoutUpdatedHandlersField.GetValue(this);
 
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
                Hashtable list = (Hashtable)cachedLayoutUpdatedItems;
                list.Remove(d);
            } 
        }
 
        /// <summary> 
        /// Recursively propagates IsLayoutSuspended flag down to the whole v's sub tree.
        /// </summary> 
        internal static void PropagateSuspendLayout(Visual v)
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
                UIElement e = (UIElement)v;
                Invariant.Assert(!e.MeasureInProgress && !e.ArrangeInProgress); 
            } 

            v.SetFlags(true, VisualFlags.IsLayoutSuspended); 
            v.TreeLevel = 0;

            int count = v.InternalVisualChildrenCount;
 
            for (int i = 0; i < count; i++)
            { 
                Visual cv = v.InternalGetVisualChild(i); 
                if (cv != null)
                { 
                    PropagateSuspendLayout(cv);
                }
            }
        } 

        /// <summary> 
        /// Recursively resets IsLayoutSuspended flag on all visuals of the whole v's sub tree. 
        /// For UIElements also re-inserts the UIElement into Measure and / or Arrange update queues
        /// if necessary. 
        /// </summary>
        internal static void PropagateResumeLayout(Visual parent, Visual v)
        {
            if(v.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot)) return; 

            //the subtree is already active - happens when new elements are added to the active tree 
            //elements are created layout-active so they don't need to be specifically unsuspended 
            //no need to walk down in this case
            //if(!v.CheckFlagsAnd(VisualFlags.IsLayoutSuspended)) return; 

            //that can be true only on top of recursion, if suspended v is being connected to suspended parent.
            bool parentIsSuspended = parent == null ? false : parent.CheckFlagsAnd(VisualFlags.IsLayoutSuspended);
            uint parentTreeLevel   = parent == null ? 0     : parent.TreeLevel; 

            if(parentIsSuspended) return; 
 
            v.SetFlags(false, VisualFlags.IsLayoutSuspended);
            v.TreeLevel = parentTreeLevel + 1; 

            if (v.CheckFlagsAnd(VisualFlags.IsUIElement))
            {
                //  re-insert UIElement into the update queues 
                UIElement e = (UIElement)v;
 
                Invariant.Assert(!e.MeasureInProgress && !e.ArrangeInProgress); 

                bool requireMeasureUpdate = e.MeasureDirty && !e.NeverMeasured && (e.MeasureRequest == null); 
                bool requireArrangeUpdate = e.ArrangeDirty && !e.NeverArranged && (e.ArrangeRequest == null);
                ContextLayoutManager contextLayoutManager = (requireMeasureUpdate || requireArrangeUpdate)
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
 
            int count = v.InternalVisualChildrenCount;
 
            for (int i = 0; i < count; i++)
            {
                Visual cv = v.InternalGetVisualChild(i);
                if (cv != null) 
                {
                    PropagateResumeLayout(v, cv); 
                } 
            }
        } 

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
        public void Measure(Size availableSize) 
        {
            bool etwTracingEnabled = false;
            long perfElementID = 0;
            ContextLayoutManager ContextLayoutManager = ContextLayoutManager.From(Dispatcher); 
            if (ContextLayoutManager.AutomationEvents.Count != 0)
                UIElementHelper.InvalidateAutomationAncestors(this); 
 
            if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose))
            { 
                perfElementID = PerfService.GetPerfElementID(this);

                etwTracingEnabled = true;
                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientMeasureElementBegin, EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, perfElementID, availableSize.Width, availableSize.Height); 
            }
            try 
            { 
                //             VerifyAccess();
 
                // Disable reentrancy during the measure pass.  This is because much work is done
                // during measure - such as inflating templates, formatting PTS stuff, creating
                // fonts, etc.  Generally speaking, we cannot survive reentrancy in these code
                // paths. 
                using (Dispatcher.DisableProcessing())
                { 
                    //enforce that Measure can not receive NaN size . 
                    if (DoubleUtil.IsNaN(availableSize.Width) || DoubleUtil.IsNaN(availableSize.Height))
                        throw new InvalidOperationException(SR.Get(SRID.UIElement_Layout_NaNMeasure)); 

                    bool neverMeasured = NeverMeasured;

                    if (neverMeasured) 
                    {
                        switchVisibilityIfNeeded(this.Visibility); 
                        //to make sure effects are set correctly - otherwise it's not used 
                        //simply because it is never pulled by anybody
                        pushVisualEffects(); 
                    }

                    bool isCloseToPreviousMeasure = DoubleUtil.AreClose(availableSize, _previousAvailableSize);
 

                    //if Collapsed, we should not Measure, keep dirty bit but remove request 
                    if (this.Visibility == Visibility.Collapsed 
                        || ((Visual)this).CheckFlagsAnd(VisualFlags.IsLayoutSuspended))
                    { 
                        //reset measure request.
                        if (MeasureRequest != null)
                            ContextLayoutManager.From(Dispatcher).MeasureQueue.Remove(this);
 
                        //  remember though that parent tried to measure at this size
                        //  in case when later this element is called to measure incrementally 
                        //  it has up-to-date information stored in _previousAvailableSize 
                        if (!isCloseToPreviousMeasure)
                        { 
                            //this will ensure that element will be actually re-measured at the new available size
                            //later when it becomes visible.
                            InvalidateMeasureInternal();
 
                            _previousAvailableSize = availableSize;
                        } 
 
                        return;
                    } 


                    //your basic bypass. No reason to calc the same thing.
                    if (IsMeasureValid                       //element is clean 
                        && !neverMeasured                       //previously measured
                        && isCloseToPreviousMeasure) //and contraint matches 
                    { 
                        return;
                    } 

                    NeverMeasured = false;
                    Size prevSize = _desiredSize;
 
                    //we always want to be arranged, ensure arrange request
                    //doing it before OnMeasure prevents unneeded requests from children in the queue 
                    InvalidateArrange(); 
                    //_measureInProgress prevents OnChildDesiredSizeChange to cause the elements be put
                    //into the queue. 

                    MeasureInProgress = true;

                    Size desiredSize = new Size(0, 0); 

                    ContextLayoutManager layoutManager = ContextLayoutManager.From(Dispatcher); 
 
                    bool gotException = true;
 
                    try
                    {
                        layoutManager.EnterMeasure();
                        desiredSize = MeasureCore(availableSize); 

                        gotException = false; 
                    } 
                    finally
                    { 
                        // reset measure in progress
                        MeasureInProgress = false;

                        _previousAvailableSize = availableSize; 

                        layoutManager.ExitMeasure(); 
 
                        if (gotException)
                        { 
                            // we don't want to reset last exception element on layoutManager if it's been already set.
                            if (layoutManager.GetLastExceptionElement() == null)
                            {
                                layoutManager.SetLastExceptionElement(this); 
                            }
                        } 
                    } 

                    //enforce that MeasureCore can not return PositiveInfinity size even if given Infinte availabel size. 
                    //Note: NegativeInfinity can not be returned by definition of Size structure.
                    if (double.IsPositiveInfinity(desiredSize.Width) || double.IsPositiveInfinity(desiredSize.Height))
                        throw new InvalidOperationException(SR.Get(SRID.UIElement_Layout_PositiveInfinityReturned, this.GetType().FullName));
 
                    //enforce that MeasureCore can not return NaN size .
                    if (DoubleUtil.IsNaN(desiredSize.Width) || DoubleUtil.IsNaN(desiredSize.Height)) 
                        throw new InvalidOperationException(SR.Get(SRID.UIElement_Layout_NaNReturned, this.GetType().FullName)); 

                    //reset measure dirtiness 

                    MeasureDirty = false;
                    //reset measure request.
                    if (MeasureRequest != null) 
                        ContextLayoutManager.From(Dispatcher).MeasureQueue.Remove(this);
 
                    //cache desired size 
                    _desiredSize = desiredSize;
 
                    //notify parent if our desired size changed (watefall effect)
                    if (!MeasureDuringArrange
                       && !DoubleUtil.AreClose(prevSize, desiredSize))
                    { 
                        UIElement p;
                        IContentHost ich; 
                        GetUIParentOrICH(out p, out ich); //only one will be returned 
                        if (p != null && !p.MeasureInProgress) //this is what differs this code from signalDesiredSizeChange()
                            p.OnChildDesiredSizeChanged(this); 
                        else if (ich != null)
                            ich.OnChildDesiredSizeChanged(this);
                    }
                } 
            }
            finally 
            { 
                if (etwTracingEnabled == true)
                { 
                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientMeasureElementEnd, EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, perfElementID, _desiredSize.Width, _desiredSize.Height);
                }
            }
        } 

         //only one will be returned, whichever found first 
        internal void GetUIParentOrICH(out UIElement uiParent, out IContentHost ich) 
        {
            ich = null; 
            uiParent = null;

            for(Visual v = VisualTreeHelper.GetParent(this) as Visual; v != null; v = VisualTreeHelper.GetParent(v) as Visual)
            { 
                ich = v as IContentHost;
                if (ich != null) break; 
 
                if(v.CheckFlagsAnd(VisualFlags.IsUIElement))
                { 
                    uiParent = (UIElement)v;
                    break;
                }
            } 
        }
 
         //walks visual tree up to find UIElement parent within Element Layout Island, so stops the walk if the island's root is found 
        internal UIElement GetUIParentWithinLayoutIsland()
        { 
            UIElement uiParent = null;

            for(Visual v = VisualTreeHelper.GetParent(this) as Visual; v != null; v = VisualTreeHelper.GetParent(v) as Visual)
            { 
                if (v.CheckFlagsAnd(VisualFlags.IsLayoutIslandRoot))
                { 
                    break; 
                }
 
                if(v.CheckFlagsAnd(VisualFlags.IsUIElement))
                {
                    uiParent = (UIElement)v;
                    break; 
                }
            } 
            return uiParent; 
        }
 

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
        public void Arrange(Rect finalRect)
        { 
            bool etwTracingEnabled = false; 
            long perfElementID = 0;
 
            ContextLayoutManager ContextLayoutManager = ContextLayoutManager.From(Dispatcher);
            if (ContextLayoutManager.AutomationEvents.Count != 0)
                UIElementHelper.InvalidateAutomationAncestors(this);
 
            if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose))
            { 
                perfElementID = PerfService.GetPerfElementID(this); 

                etwTracingEnabled = true; 
                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientArrangeElementBegin, EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, perfElementID, finalRect.Top, finalRect.Left, finalRect.Width, finalRect.Height);
            }

            try 
            {
                //             VerifyAccess(); 
 
                // Disable reentrancy during the arrange pass.  This is because much work is done
                // during arrange - such as formatting PTS stuff, creating 
                // fonts, etc.  Generally speaking, we cannot survive reentrancy in these code
                // paths.
                using (Dispatcher.DisableProcessing())
                { 
                    //enforce that Arrange can not come with Infinity size or NaN
                    if (double.IsPositiveInfinity(finalRect.Width) 
                        || double.IsPositiveInfinity(finalRect.Height) 
                        || DoubleUtil.IsNaN(finalRect.Width)
                        || DoubleUtil.IsNaN(finalRect.Height) 
                      )
                    {
                        DependencyObject parent = GetUIParent() as UIElement;
                        throw new InvalidOperationException( 
                            SR.Get(
                                SRID.UIElement_Layout_InfinityArrange, 
                                    (parent == null ? "" : parent.GetType().FullName), 
                                    this.GetType().FullName));
                    } 


                    //if Collapsed, we should not Arrange, keep dirty bit but remove request
                    if (this.Visibility == Visibility.Collapsed 
                        || ((Visual)this).CheckFlagsAnd(VisualFlags.IsLayoutSuspended))
                    { 
                        //reset arrange request. 
                        if (ArrangeRequest != null)
                            ContextLayoutManager.From(Dispatcher).ArrangeQueue.Remove(this); 

                        //  remember though that parent tried to arrange at this rect
                        //  in case when later this element is called to arrange incrementally
                        //  it has up-to-date information stored in _finalRect 
                        _finalRect = finalRect;
 
                        return; 
                    }
 
                    //in case parent did not call Measure on a child, we call it now.
                    //parent can skip calling Measure on a child if it does not care about child's size
                    //passing finalSize practically means "set size" because that's what Measure(sz)/Arrange(same_sz) means
                    //Note that in case of IsLayoutSuspended (temporarily out of the tree) the MeasureDirty can be true 
                    //while it does not indicate that we should re-measure - we just came of Measure that did nothing
                    //because of suspension 
                    if (MeasureDirty 
                       || NeverMeasured)
                    { 
                        try
                        {
                            MeasureDuringArrange = true;
                            //If never measured - that means "set size", arrange-only scenario 
                            //Otherwise - the parent previosuly measured the element at constriant
                            //and the fact that we are arranging the measure-dirty element now means 
                            //we are not in the UpdateLayout loop but rather in manual sequence of Measure/Arrange 
                            //(like in HwndSource when new RootVisual is attached) so there are no loops and there could be
                            //measure-dirty elements left after previosu single Measure pass) - so need to use cached constraint 
                            if (NeverMeasured)
                                Measure(finalRect.Size);
                            else
                            { 
                                Measure(PreviousConstraint);
                            } 
                        } 
                        finally
                        { 
                            MeasureDuringArrange = false;
                        }
                    }
 
                    //bypass - if clean and rect is the same, no need to re-arrange
                    if (!IsArrangeValid 
                        || NeverArranged 
                        || !DoubleUtil.AreClose(finalRect, _finalRect))
                    { 
                        bool firstArrange = NeverArranged;
                        NeverArranged = false;
                        ArrangeInProgress = true;
 
                        ContextLayoutManager layoutManager = ContextLayoutManager.From(Dispatcher);
 
                        Size oldSize = RenderSize; 
                        bool sizeChanged = false;
                        bool gotException = true; 

                        // If using layout rounding, round final size before calling ArrangeCore.
                        if (CheckFlagsAnd(VisualFlags.UseLayoutRounding))
                        { 
                            EnsureDpiScale();
                            finalRect = RoundLayoutRect(finalRect, _dpiScaleX, _dpiScaleY); 
                        } 

                        try 
                        {
                            layoutManager.EnterArrange();

                            //This has to update RenderSize 
                            ArrangeCore(finalRect);
 
                            //to make sure Clip is tranferred to Visual 
                            ensureClip(finalRect.Size);
 
                            //  see if we need to call OnRenderSizeChanged on this element
                            sizeChanged = markForSizeChangedIfNeeded(oldSize, RenderSize);

                            gotException = false; 
                        }
                        finally 
                        { 
                            ArrangeInProgress = false;
                            layoutManager.ExitArrange(); 

                            if (gotException)
                            {
                                // we don't want to reset last exception element on layoutManager if it's been already set. 
                                if (layoutManager.GetLastExceptionElement() == null)
                                { 
                                    layoutManager.SetLastExceptionElement(this); 
                                }
                            } 

                        }

                        _finalRect = finalRect; 

                        ArrangeDirty = false; 
 
                        //reset request.
                        if (ArrangeRequest != null) 
                            ContextLayoutManager.From(Dispatcher).ArrangeQueue.Remove(this);

                        if ((sizeChanged || RenderingInvalidated || firstArrange) && IsRenderable())
                        { 
                            DrawingContext dc = RenderOpen();
                            try 
                            { 
                                bool etwGeneralEnabled = EventTrace.IsEnabled(EventTrace.Keyword.KeywordGraphics | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose);
                                if (etwGeneralEnabled == true) 
                                {
                                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientOnRenderBegin, EventTrace.Keyword.KeywordGraphics | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose, perfElementID);
                                }
 
                                try
                                { 
                                    OnRender(dc); 
                                }
                                finally 
                                {
                                    if (etwGeneralEnabled == true)
                                    {
                                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientOnRenderEnd, EventTrace.Keyword.KeywordGraphics | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose, perfElementID); 
                                    }
                                } 
                            } 
                            finally
                            { 
                                dc.Close();
                                RenderingInvalidated = false;
                            }
 
                            updatePixelSnappingGuidelines();
                        } 
 
                        if (firstArrange)
                        { 
                            EndPropertyInitialization();
                        }
                    }
                } 
            }
            finally 
            { 
                if (etwTracingEnabled == true)
                { 
                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientArrangeElementEnd, EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, perfElementID, finalRect.Top, finalRect.Left, finalRect.Width, finalRect.Height);
                }
            }
        } 

        /// <summary> 
        /// OnRender is called by the base class when the rendering instructions of the UIElement are required. 
        /// Note: the drawing instructions sent to DrawingContext are not rendered immediately on the screen
        /// but rather stored and later passed to the rendering engine at proper time. 
        /// Derived classes override this method to draw the content of the UIElement.
        /// </summary>
        protected virtual void OnRender(DrawingContext drawingContext)
        { 
        }
 
        private void updatePixelSnappingGuidelines() 
        {
            if((!SnapsToDevicePixels) || (_drawingContent == null)) 
            {
                this.VisualXSnappingGuidelines = this.VisualYSnappingGuidelines = null;
            }
            else 
            {
                DoubleCollection xLines = this.VisualXSnappingGuidelines; 
 
                if(xLines == null)
                { 
                    xLines = new DoubleCollection();
                    xLines.Add(0d);
                    xLines.Add(this.RenderSize.Width);
                    this.VisualXSnappingGuidelines = xLines; 
                }
                else 
                { 
                // xLines[0] = 0d;  - this already should be so
                // check to avoid potential dirtiness in renderer 
                    int lastGuideline = xLines.Count - 1;
                    if(!DoubleUtil.AreClose(xLines[lastGuideline], this.RenderSize.Width))
                        xLines[lastGuideline] = this.RenderSize.Width;
                } 

                DoubleCollection yLines = this.VisualYSnappingGuidelines; 
                if(yLines == null) 
                {
                    yLines = new DoubleCollection(); 
                    yLines.Add(0d);
                    yLines.Add(this.RenderSize.Height);
                    this.VisualYSnappingGuidelines = yLines;
                } 
                else
                { 
                // yLines[0] = 0d;  - this already should be so 
                // check to avoid potential dirtiness in renderer
                    int lastGuideline = yLines.Count - 1; 
                    if(!DoubleUtil.AreClose(yLines[lastGuideline], this.RenderSize.Height))
                        yLines[lastGuideline] = this.RenderSize.Height;
                }
            } 
        }
 
        private bool markForSizeChangedIfNeeded(Size oldSize, Size newSize) 
        {
            //already marked for SizeChanged, simply update the newSize 
            bool widthChanged = !DoubleUtil.AreClose(oldSize.Width, newSize.Width);
            bool heightChanged = !DoubleUtil.AreClose(oldSize.Height, newSize.Height);

            SizeChangedInfo info = sizeChangedInfo; 

            if(info != null) 
            { 
                info.Update(widthChanged, heightChanged);
                return true; 
            }
            else if(widthChanged || heightChanged)
            {
                info = new SizeChangedInfo(this, oldSize, widthChanged, heightChanged); 
                sizeChangedInfo = info;
                ContextLayoutManager.From(Dispatcher).AddToSizeChangedChain(info); 
 
                //
                // This notifies Visual layer that hittest boundary potentially changed 
                //

                PropagateFlags(
                    this, 
                    VisualFlags.IsSubtreeDirtyForPrecompute,
                    VisualProxyFlags.IsSubtreeDirtyForRender); 
 
                return true;
            } 

            //this result is used to determine if we need to call OnRender after Arrange
            //OnRender is called for 2 reasons - someone called InvalidateVisual - then OnRender is called
            //on next Arrange, or the size changed. 
            return false;
        } 
 
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
        internal static Size RoundLayoutSize(Size size, double dpiScaleX, double dpiScaleY) 
        {
            return new Size(RoundLayoutValue(size.Width, dpiScaleX), RoundLayoutValue(size.Height, dpiScaleY));
        }
 
        /// <summary>
        /// Calculates the value to be used for layout rounding at high DPI. 
        /// </summary> 
        /// <param name="value">Input value to be rounded.</param>
        /// <param name="dpiScale">Ratio of screen's DPI to layout DPI</param> 
        /// <returns>Adjusted value that will produce layout rounding on screen at high dpi.</returns>
        /// <remarks>This is a layout helper method. It takes DPI into account and also does not return
        /// the rounded value if it is unacceptable for layout, e.g. Infinity or NaN. It's a helper associated with
        /// UseLayoutRounding  property and should not be used as a general rounding utility.</remarks> 
        internal static double RoundLayoutValue(double value, double dpiScale)
        { 
            double newValue; 

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
        internal static Rect RoundLayoutRect(Rect rect, double dpiScaleX, double dpiScaleY)
        { 
            return new Rect(RoundLayoutValue(rect.X, dpiScaleX),
                            RoundLayoutValue(rect.Y, dpiScaleY), 
                            RoundLayoutValue(rect.Width, dpiScaleX), 
                            RoundLayoutValue(rect.Height, dpiScaleY)
                            ); 
        }

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
        [SecurityCritical, SecurityTreatAsSafe] 
        private static void EnsureDpiScale() 
        {
            if (_setDpi) 
            {
                _setDpi = false;
                int dpiX, dpiY;
                HandleRef desktopWnd = new HandleRef(null, IntPtr.Zero); 

                // Win32Exception will get the Win32 error code so we don't have to 
#pragma warning disable 6523 
                IntPtr dc = UnsafeNativeMethods.GetDC(desktopWnd);
 
                // Detecting error case from unmanaged call, required by PREsharp to throw a Win32Exception
#pragma warning disable 6503
                if (dc == IntPtr.Zero)
                { 
                    throw new Win32Exception();
                } 
#pragma warning restore 6503 
#pragma warning restore 6523
 
                try
                {
                    dpiX = UnsafeNativeMethods.GetDeviceCaps(new HandleRef(null, dc), NativeMethods.LOGPIXELSX);
                    dpiY = UnsafeNativeMethods.GetDeviceCaps(new HandleRef(null, dc), NativeMethods.LOGPIXELSY); 
                    _dpiScaleX = (double)dpiX / 96.0;
                    _dpiScaleY = (double)dpiY / 96.0; 
                } 
                finally
                { 
                    UnsafeNativeMethods.ReleaseDC(desktopWnd, new HandleRef(null, dc));
                }
            }
        } 

        /// <summary> 
        /// This is invoked after layout update before rendering if the element's RenderSize 
        /// has changed as a result of layout update.
        /// </summary> 
        /// <param name="info">Packaged parameters (<seealso cref="SizeChangedInfo"/>, includes
        /// old and new sizes and which dimension actually changes. </param>
        protected internal virtual void OnRenderSizeChanged(SizeChangedInfo info)
        {} 

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
        protected virtual Size MeasureCore(Size availableSize) 
        {
            //can not return availableSize here - this is too "greedy" and can cause the Infinity to be 
            //returned. So the next "reasonable" choice is (0,0). 
            return new Size(0,0);
        } 

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
        protected virtual void ArrangeCore(Rect finalRect)
        {
            // Set the element size. 
            RenderSize = finalRect.Size;
 
            //Set transform to reflect the offset of finalRect - parents that have multiple children 
            //pass offset in the finalRect to communicate the location of this child withing the parent.
            Transform renderTransform = RenderTransform; 
            if(renderTransform == Transform.Identity)
                renderTransform = null;

            Vector oldOffset = VisualOffset; 
            if (!DoubleUtil.AreClose(oldOffset.X, finalRect.X) ||
                !DoubleUtil.AreClose(oldOffset.Y, finalRect.Y)) 
            { 
                VisualOffset = new Vector(finalRect.X, finalRect.Y);
            } 

            if (renderTransform != null)
            {
                //render transform + layout offset, create a collection 
                TransformGroup t = new TransformGroup();
 
                Point origin = RenderTransformOrigin; 
                bool hasOrigin = (origin.X != 0d || origin.Y != 0d);
                if (hasOrigin) 
                    t.Children.Add(new TranslateTransform(-(finalRect.Width * origin.X), -(finalRect.Height * origin.Y)));

                t.Children.Add(renderTransform);
 
                if (hasOrigin)
                    t.Children.Add(new TranslateTransform(finalRect.Width * origin.X, 
                                                          finalRect.Height * origin.Y)); 

                VisualTransform = t; 
            }
            else
            {
                VisualTransform = null; 
            }
        } 
 
        /// <summary>
        /// This is a public read-only property that returns size of the UIElement. 
        /// This size is typcally used to find out where ink of the element will go.
        /// </summary>
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Size RenderSize 
        {
            get 
            { 
                if (this.Visibility == Visibility.Collapsed)
                    return new Size(); 
                else
                    return _size;
            }
            set 
            {
                _size = value; 
                InvalidateHitTestBounds(); 
            }
        } 

        /// <summary>
        /// This method returns the hit-test bounds of a UIElement to the underlying Visual layer.
        /// </summary> 
        internal override Rect GetHitTestBounds()
        { 
            Rect hitBounds = new Rect(_size); 

            if (_drawingContent != null) 
            {
                MediaContext mediaContext = MediaContext.From(Dispatcher);
                BoundsDrawingContextWalker ctx = mediaContext.AcquireBoundsDrawingContextWalker();
 
                Rect resultRect = _drawingContent.GetContentBounds(ctx);
                mediaContext.ReleaseBoundsDrawingContextWalker(ctx); 
 
                hitBounds.Union(resultRect);
            } 

            return hitBounds;
        }
 
        /// <summary>
        /// The RenderTransform dependency property. 
        /// </summary> 
        /// <seealso cref="UIElement.RenderTransform" />
        [CommonDependencyProperty] 
        public static readonly DependencyProperty RenderTransformProperty =
                    DependencyProperty.Register(
                                "RenderTransform",
                                typeof(Transform), 
                                typeof(UIElement),
                                new PropertyMetadata( 
                                            Transform.Identity, 
                                            new PropertyChangedCallback(RenderTransform_Changed)));
 

        /// <summary>
        /// The RenderTransform property defines the transform that will be applied to UIElement during rendering of its content.
        /// This transform does not affect layout of the panel into which the UIElement is nested - the layout does not take this 
        /// transform into account to determine the location and RenderSize of the UIElement.
        /// </summary> 
        public Transform RenderTransform 
        {
            get { return (Transform) GetValue(RenderTransformProperty); } 
            set { SetValue(RenderTransformProperty, value); }
        }

        private static void RenderTransform_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            UIElement uie = (UIElement)d; 
 
            //if never measured, then nothing to do, it should be measured at some point
            if(!uie.NeverMeasured && !uie.NeverArranged) 
            {
                // If the change is simply a subproperty change, there is no
                //  need to Arrange. (which combines RenderTransform with all the
                //  other transforms.) 
                if (!e.IsASubPropertyChange)
                { 
                    uie.InvalidateArrange(); 
                    uie.AreTransformsClean = false;
                } 
            }
        }

        /// <summary> 
        /// The RenderTransformOrigin dependency property.
        /// </summary> 
        /// <seealso cref="UIElement.RenderTransformOrigin" /> 
        public static readonly DependencyProperty RenderTransformOriginProperty =
                    DependencyProperty.Register( 
                                "RenderTransformOrigin",
                                typeof(Point),
                                typeof(UIElement),
                                new PropertyMetadata( 
                                            new Point(0d,0d),
                                            new PropertyChangedCallback(RenderTransformOrigin_Changed)), 
                                new ValidateValueCallback(IsRenderTransformOriginValid)); 

 
        private static bool IsRenderTransformOriginValid(object value)
        {
            Point v = (Point)value;
            return (    (!DoubleUtil.IsNaN(v.X) && !Double.IsPositiveInfinity(v.X) && !Double.IsNegativeInfinity(v.X)) 
                     && (!DoubleUtil.IsNaN(v.Y) && !Double.IsPositiveInfinity(v.Y) && !Double.IsNegativeInfinity(v.Y)));
        } 
 

        /// <summary> 
        /// The RenderTransformOrigin property defines the center of the RenderTransform relative to
        /// bounds of the element. It is a Point and both X and Y components are between 0 and 1.0 - the
        /// (0,0) is the default value and specified top-left corner of the element, (0.5, 0.5) is the center of element
        /// and (1,1) is the bottom-right corner of element. 
        /// </summary>
        public Point RenderTransformOrigin 
        { 
            get { return (Point)GetValue(RenderTransformOriginProperty); }
            set { SetValue(RenderTransformOriginProperty, value); } 
        }

        private static void RenderTransformOrigin_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            UIElement uie = (UIElement)d;
 
            //if never measured, then nothing to do, it should be measured at some point 
            if(!uie.NeverMeasured && !uie.NeverArranged)
            { 
                uie.InvalidateArrange();
                uie.AreTransformsClean = false;
            }
        } 

        /// <summary> 
        /// OnVisualParentChanged is called when the parent of the Visual is changed. 
        /// </summary>
        /// <param name="oldParent">Old parent or null if the Visual did not have a parent before.</param> 
        protected internal override void OnVisualParentChanged(DependencyObject oldParent)
        {
            // Synchronize ForceInherit properties
            if (_parent != null) 
            {
                DependencyObject parent = _parent; 
 
                if (!InputElement.IsUIElement(parent) && !InputElement.IsUIElement3D(parent))
                { 
                    Visual parentAsVisual = parent as Visual;

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
                    else
                    { 
                        Visual3D parentAsVisual3D = parent as Visual3D; 

                        if (parentAsVisual3D != null) 
                        {
                            // We are being plugged into a non-UIElement visual. This
                            // means that our parent doesn't play by the same rules we
                            // do, so we need to track changes to our ancestors in 
                            // order to bridge the gap.
                            parentAsVisual3D.VisualAncestorChanged += new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 
 
                            // Try to find a UIElement ancestor to use for coersion.
                            parent = InputElement.GetContainingUIElement(parentAsVisual3D); 
                        }
                    }
                }
 
                if (parent != null)
                { 
                    SynchronizeForceInheritProperties(this, null, null, parent); 
                }
                else 
                {
                    // We don't have a UIElement parent or ancestor, so no
                    // coersions are necessary at this time.
                } 
            }
            else 
            { 
                DependencyObject parent = oldParent;
 
                if (!InputElement.IsUIElement(parent) && !InputElement.IsUIElement3D(parent))
                {
                    // We are being unplugged from a non-UIElement visual. This
                    // means that our parent didn't play by the same rules we 
                    // do, so we started track changes to our ancestors in
                    // order to bridge the gap.  Now we can stop. 
                    if (oldParent is Visual) 
                    {
                        ((Visual) oldParent).VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 
                    }
                    else if (oldParent is Visual3D)
                    {
                        ((Visual3D) oldParent).VisualAncestorChanged -= new AncestorChangedEventHandler(OnVisualAncestorChanged_ForceInherit); 
                    }
 
                    // Try to find a UIElement ancestor to use for coersion. 
                    parent = InputElement.GetContainingUIElement(oldParent);
                } 

                if (parent != null)
                {
                    SynchronizeForceInheritProperties(this, null, null, parent); 
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
        } 

        private void OnVisualAncestorChanged_ForceInherit(object sender, AncestorChangedEventArgs e)
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
 
            DependencyObject parent = null;
            if(e.OldParent == null) 
            { 
                // We were plugged into something.
 
                // Find our nearest UIElement parent.
                parent = InputElement.GetContainingUIElement(_parent);

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
                SynchronizeForceInheritProperties(this, null, null, parent); 
            }
        }

        internal void OnVisualAncestorChanged(object sender, AncestorChangedEventArgs e) 
        {
            UIElement uie = sender as UIElement; 
            if(null != uie) 
                PresentationSource.OnVisualAncestorChanged(uie, e);
        } 

        /// <summary>
        /// Helper, gives the UIParent under control of which
        /// the OnMeasure or OnArrange are currently called. 
        /// This may be implemented as a tree walk up until
        /// LayoutElement is found. 
        /// </summary> 
        internal DependencyObject GetUIParent()
        { 
            return UIElementHelper.GetUIParent(this, false);
        }

        internal DependencyObject GetUIParent(bool continuePastVisualTree) 
        {
            return UIElementHelper.GetUIParent(this, continuePastVisualTree); 
        } 

        internal DependencyObject GetUIParentNo3DTraversal() 
        {
            DependencyObject parent = null;

            // Try to find a UIElement parent in the visual ancestry. 
            DependencyObject myParent = InternalVisualParent;
            parent = InputElement.GetContainingUIElement(myParent, true); 
 
            return parent;
        } 

        /// <summary>
        ///     Called to get the UI parent of this element when there is
        ///     no visual parent. 
        /// </summary>
        /// <returns> 
        ///     Returns a non-null value when some framework implementation 
        ///     of this method has a non-visual parent connection,
        /// </returns> 
        protected virtual internal DependencyObject GetUIParentCore()
        {
            return null;
        } 

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
        public void UpdateLayout()
        { 
//             VerifyAccess();
            ContextLayoutManager.From(Dispatcher).UpdateLayout();
        }
 
        internal static void BuildRouteHelper(DependencyObject e, EventRoute route, RoutedEventArgs args)
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
                UIElement uiElement = e as UIElement;
                ContentElement contentElement = null; 
                UIElement3D uiElement3D = null;
 
                if (uiElement == null) 
                {
                    contentElement = e as ContentElement; 

                    if (contentElement == null)
                    {
                        uiElement3D = e as UIElement3D; 
                    }
                } 
 
                // Add this element to route
                if (uiElement != null) 
                {
                    uiElement.AddToEventRoute(route, args);
                }
                else if (contentElement != null) 
                {
                    contentElement.AddToEventRoute(route, args); 
                } 
                else if (uiElement3D != null)
                { 
                    uiElement3D.AddToEventRoute(route, args);
                }
            }
            else 
            {
                int cElements = 0; 
 
                while (e != null)
                { 
                    UIElement uiElement = e as UIElement;
                    ContentElement contentElement = null;
                    UIElement3D uiElement3D = null;
 
                    if (uiElement == null)
                    { 
                        contentElement = e as ContentElement; 

                        if (contentElement == null) 
                        {
                            uiElement3D = e as UIElement3D;
                        }
                    } 

                    // Protect against infinite loops by limiting the number of elements 
                    // that we will process. 
                    if (cElements++ > MAX_ELEMENTS_IN_ROUTE)
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.TreeLoop));
                    }

                    // Allow the element to adjust source 
                    object newSource = null;
                    if (uiElement != null) 
                    { 
                        newSource = uiElement.AdjustEventSource(args);
                    } 
                    else if (contentElement != null)
                    {
                        newSource = contentElement.AdjustEventSource(args);
                    } 
                    else if (uiElement3D != null)
                    { 
                        newSource = uiElement3D.AdjustEventSource(args); 
                    }
 
                    // Add changed source information to the route
                    if (newSource != null)
                    {
                        route.AddSource(newSource); 
                    }
 
                    // Invoke BuildRouteCore 
                    bool continuePastVisualTree = false;
                                        if (uiElement != null) 
                    {
                        //Add a Synchronized input pre-opportunity handler just before the class and instance handlers
                        uiElement.AddSynchronizedInputPreOpportunityHandler(route, args);
 
                        continuePastVisualTree = uiElement.BuildRouteCore(route, args);
 
                        // Add this element to route 
                        uiElement.AddToEventRoute(route, args);
 
                        //Add a Synchronized input post-opportunity handler just after class and instance handlers
                        uiElement.AddSynchronizedInputPostOpportunityHandler(route, args);

                        // Get element's visual parent 
                        e = uiElement.GetUIParent(continuePastVisualTree);
                    } 
                    else if (contentElement != null) 
                    {
                        //Add a Synchronized input pre-opportunity handler just before the class and instance handlers 
                        contentElement.AddSynchronizedInputPreOpportunityHandler(route, args);

                        continuePastVisualTree = contentElement.BuildRouteCore(route, args);
 
                        // Add this element to route
                        contentElement.AddToEventRoute(route, args); 
 
                        //Add a Synchronized input post-opportunity handler just after the class and instance handlers
                        contentElement.AddSynchronizedInputPostOpportunityHandler(route, args); 

                        // Get element's visual parent
                        e = (DependencyObject)contentElement.GetUIParent(continuePastVisualTree);
                    } 
                    else if (uiElement3D != null)
                    { 
                        //Add a Synchronized input pre-opportunity handler just before the class and instance handlers 
                        uiElement3D.AddSynchronizedInputPreOpportunityHandler(route, args);
 
                        continuePastVisualTree = uiElement3D.BuildRouteCore(route, args);

                        // Add this element to route
                        uiElement3D.AddToEventRoute(route, args); 

                        //Add a Synchronized input post-opportunity handler just after the class and instance handlers 
                        uiElement3D.AddSynchronizedInputPostOpportunityHandler(route, args); 

                        // Get element's visual parent 
                        e = uiElement3D.GetUIParent(continuePastVisualTree);
                    }

                    // If the BuildRouteCore implementation changed the 
                    // args.Source to the route parent, respect it in
                    // the actual route. 
                    if (e == args.Source) 
                    {
                        route.AddSource(e); 
                    }
                }
            }
        } 

        // If this element is currently listening to synchronized input, add a pre-opportunity handler to keep track of event routed through this element. 
        internal void AddSynchronizedInputPreOpportunityHandler(EventRoute route, RoutedEventArgs args) 
        {
            if (InputManager.IsSynchronizedInput) 
            {
                if (SynchronizedInputHelper.IsListening(this, args))
                {
                    RoutedEventHandler eventHandler = new RoutedEventHandler(this.SynchronizedInputPreOpportunityHandler); 
                    SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, false);
                } 
                else 
                {
                    AddSynchronizedInputPreOpportunityHandlerCore(route, args); 
                }
            }
        }
 
        // Helper to add pre-opportunity handler for templated parent of this element in case parent is listening
        // for synchronized input. 
        internal virtual void AddSynchronizedInputPreOpportunityHandlerCore(EventRoute route, RoutedEventArgs args) 
        {
 
        }

        // If this element is currently listening to synchronized input, add a handler to post process the synchronized input otherwise
        // add a synchronized input pre-opportunity handler from parent if parent is listening. 
        internal void AddSynchronizedInputPostOpportunityHandler(EventRoute route, RoutedEventArgs args)
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
        internal void SynchronizedInputPreOpportunityHandler(object sender, RoutedEventArgs args)
        { 
            SynchronizedInputHelper.PreOpportunityHandler(sender, args); 
        }
 
        // This event handler to be called after class & instance handlers for this element.
        internal void SynchronizedInputPostOpportunityHandler(object sender, RoutedEventArgs args)
        {
            if (args.Handled && (InputManager.SynchronizedInputState == SynchronizedInputStates.HadOpportunity)) 
            {
                SynchronizedInputHelper.PostOpportunityHandler(sender, args); 
            } 
        }
 
        // Called by automation peer, when called this element will be the listening element for synchronized input.
        internal bool StartListeningSynchronizedInput(SynchronizedInputType inputType)
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
        } 

        // When called, input processing will return to normal mode. 
        internal void CancelSynchronizedInput() 
        {
            InputManager.CancelSynchronizedInput(); 
        }

        /// <summary>
        ///     Adds a handler for the given attached event 
        /// </summary>
        [FriendAccessAllowed] // Built into Core, also used by Framework. 
        internal static void AddHandler(DependencyObject d, RoutedEvent routedEvent, Delegate handler) 
        {
            if (d == null) 
            {
                throw new ArgumentNullException("d");
            }
 
            Debug.Assert(routedEvent != null, "RoutedEvent must not be null");
 
            UIElement uiElement = d as UIElement; 
            if (uiElement != null)
            { 
                uiElement.AddHandler(routedEvent, handler);
            }
            else
            { 
                ContentElement contentElement = d as ContentElement;
                if (contentElement != null) 
                { 
                    contentElement.AddHandler(routedEvent, handler);
                } 
                else
                {
                    UIElement3D uiElement3D = d as UIElement3D;
                    if (uiElement3D != null) 
                    {
                        uiElement3D.AddHandler(routedEvent, handler); 
                    } 
                    else
                    { 
                        throw new ArgumentException(SR.Get(SRID.Invalid_IInputElement, d.GetType()));
                    }
                }
            } 
        }
 
        /// <summary> 
        ///     Removes a handler for the given attached event
        /// </summary> 
        [FriendAccessAllowed] // Built into Core, also used by Framework.
        internal static void RemoveHandler(DependencyObject d, RoutedEvent routedEvent, Delegate handler)
        {
            if (d == null) 
            {
                throw new ArgumentNullException("d"); 
            } 

            Debug.Assert(routedEvent != null, "RoutedEvent must not be null"); 

            UIElement uiElement = d as UIElement;
            if (uiElement != null)
            { 
                uiElement.RemoveHandler(routedEvent, handler);
            } 
            else 
            {
                ContentElement contentElement = d as ContentElement; 
                if (contentElement != null)
                {
                    contentElement.RemoveHandler(routedEvent, handler);
                } 
                else
                { 
                    UIElement3D uiElement3D = d as UIElement3D; 
                    if (uiElement3D != null)
                    { 
                        uiElement3D.RemoveHandler(routedEvent, handler);
                    }
                    else
                    { 
                        throw new ArgumentException(SR.Get(SRID.Invalid_IInputElement, d.GetType()));
                    } 
                } 
            }
        } 

        #region LoadedAndUnloadedEvents

        ///<summary> 
        ///     Initiate the processing for [Un]Loaded event broadcast starting at this node
        /// </summary> 
        internal virtual void OnPresentationSourceChanged(bool attached) 
        {
            // Reset the FocusedElementProperty in order to get LostFocus event 
            if (!attached && FocusManager.GetFocusedElement(this)!=null)
                FocusManager.SetFocusedElement(this, null);
        }
 
        #endregion LoadedAndUnloadedEvents
 
        /// <summary> 
        ///     Translates a point relative to this element to coordinates that
        ///     are relative to the specified element. 
        /// </summary>
        /// <remarks>
        ///     Passing null indicates that coordinates should be relative to
        ///     the root element in the tree that this element belongs to. 
        /// </remarks>
        public Point TranslatePoint(Point point, UIElement relativeTo) 
        { 
            return InputElement.TranslatePoint(point, this, relativeTo);
        } 

        /// <summary>
        ///     Returns the input element within this element that is
        ///     at the specified coordinates relative to this element. 
        /// </summary>
        public IInputElement InputHitTest(Point point) 
        { 
            IInputElement enabledHit;
            IInputElement rawHit; 
            InputHitTest(point, out enabledHit, out rawHit);

            return enabledHit;
        } 

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
        internal void InputHitTest(Point pt, out IInputElement enabledHit, out IInputElement rawHit) 
        {
            HitTestResult rawHitResult; 
            InputHitTest(pt, out enabledHit, out rawHit, out rawHitResult); 
        }
 
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
        internal void InputHitTest(Point pt, out IInputElement enabledHit, out IInputElement rawHit, out HitTestResult rawHitResult)
        {
            PointHitTestParameters hitTestParameters = new PointHitTestParameters(pt); 

            // We store the result of the hit testing here.  Note that the 
            // HitTestResultCallback is an instance method on this class 
            // so that it can store the element we hit.
            InputHitTestResult result = new InputHitTestResult(); 
            VisualTreeHelper.HitTest(this,
                                     new HitTestFilterCallback(InputHitTestFilterCallback),
                                     new HitTestResultCallback(result.InputHitTestResultCallback),
                                     hitTestParameters); 

            DependencyObject candidate = result.Result; 
            rawHit = candidate as IInputElement; 
            rawHitResult = result.HitTestResult;
            enabledHit = null; 
            while (candidate != null)
            {
                IContentHost contentHost = candidate as IContentHost;
                if (contentHost != null) 
                {
                    // Do not call IContentHost.InputHitTest if the containing UIElement 
                    // is not enabled. 
                    DependencyObject containingElement = InputElement.GetContainingUIElement(candidate);
 
                    if ((bool)containingElement.GetValue(IsEnabledProperty))
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

                UIElement element = candidate as UIElement; 
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

                UIElement3D element3D = candidate as UIElement3D;
                if (element3D != null) 
                {
                    if (rawHit == null) 
                    { 
                        // Earlier we hit a non-IInputElement. This is the first one
                        // we've found, so use that as rawHit. 
                        rawHit = element3D;
                        rawHitResult = null;
                    }
                    if (element3D.IsEnabled) 
                    {
                        enabledHit = element3D; 
                        break; 
                    }
                } 

                if (candidate == this)
                {
                    // We are at the element where the hit-test was initiated. 
                    // If we haven't found the hit element by now, we missed
                    // everything. 
                    break; 
                }
 

                candidate = VisualTreeHelper.GetParentInternal(candidate);
            }
        } 

        private HitTestFilterBehavior InputHitTestFilterCallback(DependencyObject currentNode) 
        { 
            HitTestFilterBehavior behavior = HitTestFilterBehavior.Continue;
 
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
        }

        private class InputHitTestResult 
        {
            public HitTestResultBehavior InputHitTestResultCallback(HitTestResult result) 
            { 
                _result = result;
                return HitTestResultBehavior.Stop; 
            }


            public DependencyObject Result 
            {
                get 
                { 
                    return _result != null ? _result.VisualHit : null;
                } 
            }

            public HitTestResult HitTestResult
            { 
                get
                { 
                    return _result; 
                }
            } 

            private HitTestResult _result;
        }
 
        //
        // Left/Right Mouse Button Cracking Routines: 
        // 

        private static RoutedEvent CrackMouseButtonEvent(MouseButtonEventArgs e) 
        {
            RoutedEvent newEvent = null;

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

        private static void CrackMouseButtonEventAndReRaiseEvent(DependencyObject sender, MouseButtonEventArgs e) 
        { 
            RoutedEvent newEvent = CrackMouseButtonEvent(e);
 
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
        private static void ReRaiseEventAs(DependencyObject sender, RoutedEventArgs args, RoutedEvent newEvent)
        {
            // Preseve and change the RoutedEvent 
            RoutedEvent preservedRoutedEvent = args.RoutedEvent;
            args.OverrideRoutedEvent( newEvent ); 
 
            // Preserve Source
            object preservedSource = args.Source; 

            EventRoute route = EventRouteFactory.FetchObject(args.RoutedEvent);

            if( TraceRoutedEvent.IsEnabled ) 
            {
                TraceRoutedEvent.Trace( 
                    TraceEventType.Start, 
                    TraceRoutedEvent.ReRaiseEventAs,
                    args.RoutedEvent, 
                    sender,
                    args,
                    args.Handled );
            } 

            try 
            { 
                // Build the route and invoke the handlers
                UIElement.BuildRouteHelper(sender, route, args); 

                route.ReInvokeHandlers(sender, args);

                // Restore Source 
                args.OverrideSource(preservedSource);
 
                // Restore RoutedEvent 
                args.OverrideRoutedEvent(preservedRoutedEvent);
 
            }

            finally
            { 
                if( TraceRoutedEvent.IsEnabled )
                { 
                    TraceRoutedEvent.Trace( 
                        TraceEventType.Stop,
                        TraceRoutedEvent.ReRaiseEventAs, 
                        args.RoutedEvent,
                        sender,
                        args,
                        args.Handled ); 
                }
            } 
 
            // Recycle the route object
            EventRouteFactory.RecycleObject(route); 
        }

        /// <summary>
        ///     Implementation of RaiseEvent. 
        ///     Called by both the trusted and non-trusted flavors of RaiseEvent.
        /// </summary> 
        internal static void RaiseEventImpl(DependencyObject sender, RoutedEventArgs args) 
        {
            EventRoute route = EventRouteFactory.FetchObject(args.RoutedEvent); 

            if( TraceRoutedEvent.IsEnabled )
            {
                TraceRoutedEvent.Trace( 
                    TraceEventType.Start,
                    TraceRoutedEvent.RaiseEvent, 
                    args.RoutedEvent, 
                    sender,
                    args, 
                    args.Handled );
            }

            try 
            {
                // Set Source 
                args.Source = sender; 

                UIElement.BuildRouteHelper(sender, route, args); 

                route.InvokeHandlers(sender, args);

                // Reset Source to OriginalSource 
                args.Source = args.OriginalSource;
            } 
 
            finally
            { 
                if( TraceRoutedEvent.IsEnabled )
                {
                    TraceRoutedEvent.Trace(
                        TraceEventType.Stop, 
                        TraceRoutedEvent.RaiseEvent,
                        args.RoutedEvent, 
                        sender, 
                        args,
                        args.Handled ); 
                }
            }

            EventRouteFactory.RecycleObject(route); 
        }
 
        /// <summary> 
        ///     A property indicating if the mouse is over this element or not.
        /// </summary> 
        public bool IsMouseDirectlyOver
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

        private bool IsMouseDirectlyOver_ComputeValue()
        {
            return (Mouse.DirectlyOver == this); 
        }
 
#region new 
        /// <summary>
        ///     Asynchronously re-evaluate the reverse-inherited properties. 
        /// </summary>
        [FriendAccessAllowed]
        internal void SynchronizeReverseInheritPropertyFlags(DependencyObject oldParent, bool isCoreParent)
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
        ///     Controls like popup want to control updating parent properties. This method
        ///     provides an opportunity for those controls to participate and block it. 
        /// </summary>
        internal virtual bool BlockReverseInheritance()
        {
            return false; 
        }
 
        /// <summary> 
        ///     A property indicating if the mouse is over this element or not.
        /// </summary> 
        public bool IsMouseOver
        {
            get
            { 
                return ReadFlag(CoreFlags.IsMouseOverCache);
            } 
        } 

        /// <summary> 
        ///     A property indicating if the stylus is over this element or not.
        /// </summary>
        public bool IsStylusOver
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
        public bool IsKeyboardFocusWithin 
        {
            get 
            {
                return ReadFlag(CoreFlags.IsKeyboardFocusWithinCache);
            }
        } 

#endregion new 
 
        /// <summary>
        ///     A property indicating if the mouse is captured to this element or not. 
        /// </summary>
        public bool IsMouseCaptured
        {
            get { return (bool) GetValue(IsMouseCapturedProperty); } 
        }
 
        /// <summary> 
        ///     Captures the mouse to this element.
        /// </summary> 
        public bool CaptureMouse()
        {
            return Mouse.Capture(this);
        } 

        /// <summary> 
        ///     Releases the mouse capture. 
        /// </summary>
        public void ReleaseMouseCapture() 
        {
            if (Mouse.Captured == this)
            {
                Mouse.Capture(null); 
            }
        } 
 
        /// <summary>
        ///     Indicates if mouse capture is anywhere within the subtree 
        ///     starting at the current instance
        /// </summary>
        public bool IsMouseCaptureWithin
        { 
            get
            { 
                return ReadFlag(CoreFlags.IsMouseCaptureWithinCache); 
            }
        } 

        /// <summary>
        ///     A property indicating if the stylus is over this element or not.
        /// </summary> 
        public bool IsStylusDirectlyOver
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

        private bool IsStylusDirectlyOver_ComputeValue() 
        { 
            return (Stylus.DirectlyOver == this);
        } 

        /// <summary>
        ///     A property indicating if the stylus is captured to this element or not.
        /// </summary> 
        public bool IsStylusCaptured
        { 
            get { return (bool) GetValue(IsStylusCapturedProperty); } 
        }
 
        /// <summary>
        ///     Captures the stylus to this element.
        /// </summary>
        public bool CaptureStylus() 
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
        ///     Indicates if stylus capture is anywhere within the subtree 
        ///     starting at the current instance
        /// </summary>
        public bool IsStylusCaptureWithin
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
        public bool IsKeyboardFocused 
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
 
        private bool IsKeyboardFocused_ComputeValue() 
        {
            return (Keyboard.FocusedElement == this); 
        }

        /// <summary>
        ///     Set a logical focus on the element. If the current keyboard focus is within the same scope move the keyboard on this element. 
        /// </summary>
        public bool Focus() 
        { 
            if (Keyboard.Focus(this) == this)
            { 
                // Successfully setting the keyboard focus updated the logical focus as well
                return true;
            }
 
            if (Focusable && IsEnabled)
            { 
                // If we cannot set keyboard focus then set the logical focus only 
                // Find element's FocusScope and set its FocusedElement if not already set
                // If FocusedElement is already set we don't want to steal focus for that scope 
                DependencyObject focusScope = FocusManager.GetFocusScope(this);
                if (FocusManager.GetFocusedElement(focusScope) == null)
                {
                    FocusManager.SetFocusedElement(focusScope, (IInputElement)this); 
                }
            } 
 
            // Return false because current KeyboardFocus is not set on the element - only the logical focus is set
            return false; 
        }

        /// <summary>
        ///     Request to move the focus from this element to another element 
        /// </summary>
        /// <param name="request">Determine how to move the focus</param> 
        /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns> 
        public virtual bool MoveFocus(TraversalRequest request)
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
        public virtual DependencyObject PredictFocus(FocusNavigationDirection direction) 
        {
            return null; 
        } 

        /// <summary> 
        ///     The access key for this element was invoked. Base implementation sets focus to the element.
        /// </summary>
        /// <param name="e">The arguments to the access key event</param>
        protected virtual void OnAccessKey(AccessKeyEventArgs e) 
        {
            this.Focus(); 
        } 

 
        /// <summary>
        ///     A property indicating if the inptu method is enabled.
        /// </summary>
        public bool IsInputMethodEnabled 
        {
            get { return (bool) GetValue(InputMethod.IsInputMethodEnabledProperty); } 
        } 

        /// <summary> 
        ///     The Opacity property.
        /// </summary>
        public static readonly DependencyProperty OpacityProperty =
                    DependencyProperty.Register( 
                                "Opacity",
                                typeof(double), 
                                typeof(UIElement), 
                                new UIPropertyMetadata(
                                            1.0d, 
                                            new PropertyChangedCallback(Opacity_Changed)));


        private static void Opacity_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            UIElement uie = (UIElement) d; 
            uie.pushOpacity(); 
        }
 
        /// <summary>
        /// Opacity applied to the rendered content of the UIElement.  When set, this opacity value
        /// is applied uniformly to the entire UIElement.
        /// </summary> 
        [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)]
        public double Opacity 
        { 
            get { return (double) GetValue(OpacityProperty); }
            set { SetValue(OpacityProperty, value); } 
        }

        private void pushOpacity()
        { 
            if(this.Visibility == Visibility.Visible)
            { 
                base.VisualOpacity = Opacity; 
            }
        } 

        /// <summary>
        ///     The OpacityMask property.
        /// </summary> 
        public static readonly DependencyProperty OpacityMaskProperty
            = DependencyProperty.Register("OpacityMask", typeof(Brush), typeof(UIElement), 
                                          new UIPropertyMetadata(new PropertyChangedCallback(OpacityMask_Changed))); 

        private static void OpacityMask_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            UIElement uie = (UIElement) d;
            uie.pushOpacityMask();
        } 

        /// <summary> 
        /// OpacityMask applied to the rendered content of the UIElement.  When set, the alpha channel 
        /// of the Brush's rendered content is applied to the rendered content of the UIElement.
        /// The other channels of the Brush's rendered content (e.g., Red, Green, or Blue) are ignored. 
        /// </summary>
        public Brush OpacityMask
        {
            get { return (Brush) GetValue(OpacityMaskProperty); } 
            set { SetValue(OpacityMaskProperty, value); }
        } 
 
        private void pushOpacityMask()
        { 
            base.VisualOpacityMask = OpacityMask;
        }

        /// <summary> 
        ///     The BitmapEffect property.
        /// </summary> 
        public static readonly DependencyProperty BitmapEffectProperty = 
                DependencyProperty.Register(
                        "BitmapEffect", 
                        typeof(BitmapEffect),
                        typeof(UIElement),
                        new UIPropertyMetadata(new PropertyChangedCallback(OnBitmapEffectChanged)));
 
        private static void OnBitmapEffectChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            UIElement uie = (UIElement)d; 
            uie.pushBitmapEffect();
        } 

        /// <summary>
        /// BitmapEffect applied to the rendered content of the UIElement.
        /// </summary> 
        [Obsolete(MS.Internal.Media.VisualTreeUtils.BitmapEffectObsoleteMessage)]
        public BitmapEffect BitmapEffect 
        { 
            get { return (BitmapEffect) GetValue(BitmapEffectProperty); }
            set { SetValue(BitmapEffectProperty, value); } 
        }

        private void pushBitmapEffect()
        { 
#pragma warning disable 0618
            base.VisualBitmapEffect = BitmapEffect; 
#pragma warning restore 0618 
        }
 

        /// <summary>
        ///     The Effect property.
        /// </summary> 
        public static readonly DependencyProperty EffectProperty =
                DependencyProperty.Register( 
                        "Effect", 
                        typeof(Effect),
                        typeof(UIElement), 
                        new UIPropertyMetadata(new PropertyChangedCallback(OnEffectChanged)));

        private static void OnEffectChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            UIElement uie = (UIElement)d;
            uie.pushEffect(); 
        } 

        /// <summary> 
        /// Effect applied to the rendered content of the UIElement.
        /// </summary>
        public Effect Effect
        { 
            get { return (Effect) GetValue(EffectProperty); }
            set { SetValue(EffectProperty, value); } 
        } 

        private void pushEffect() 
        {
            base.VisualEffect = Effect;
        }
 
        /// <summary>
        ///     The BitmapEffectInput property. 
        /// </summary> 
        public static readonly DependencyProperty BitmapEffectInputProperty =
                DependencyProperty.Register( 
                        "BitmapEffectInput",
                        typeof(BitmapEffectInput),
                        typeof(UIElement),
                        new UIPropertyMetadata(new PropertyChangedCallback(OnBitmapEffectInputChanged))); 

        private static void OnBitmapEffectInputChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            ((UIElement) d).pushBitmapEffectInput((BitmapEffectInput) e.NewValue);
        } 

        /// <summary>
        /// BitmapEffectInput accessor.
        /// </summary> 
        [Obsolete(MS.Internal.Media.VisualTreeUtils.BitmapEffectObsoleteMessage)]
        public BitmapEffectInput BitmapEffectInput 
        { 
            get { return (BitmapEffectInput) GetValue(BitmapEffectInputProperty); }
            set { SetValue(BitmapEffectInputProperty, value); } 
        }


        private void pushBitmapEffectInput(BitmapEffectInput newValue) 
        {
#pragma warning disable 0618 
            base.VisualBitmapEffectInput = newValue; 
#pragma warning restore 0618
        } 

        private static void EdgeMode_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            UIElement uie = (UIElement) d; 
            uie.pushEdgeMode();
        } 
 
        private void pushEdgeMode()
        { 
            base.VisualEdgeMode = RenderOptions.GetEdgeMode(this);
        }

        private static void BitmapScalingMode_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            UIElement uie = (UIElement) d; 
            uie.pushBitmapScalingMode(); 
        }
 
        private void pushBitmapScalingMode()
        {
            base.VisualBitmapScalingMode = RenderOptions.GetBitmapScalingMode(this);
        } 

        private static void ClearTypeHint_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            UIElement uie = (UIElement) d;
            uie.pushClearTypeHint(); 
        }

        private void pushClearTypeHint()
        { 
            base.VisualClearTypeHint = RenderOptions.GetClearTypeHint(this);
        } 
 
        private static void TextHintingMode_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            UIElement uie = (UIElement) d;
            uie.pushTextHintingMode();
        }
 
        private void pushTextHintingMode()
        { 
            base.VisualTextHintingMode = TextOptionsInternal.GetTextHintingMode(this); 
        }
 
        /// <summary>
        ///     The CacheMode property.
        /// </summary>
        public static readonly DependencyProperty CacheModeProperty = 
                DependencyProperty.Register(
                        "CacheMode", 
                        typeof(CacheMode), 
                        typeof(UIElement),
                        new UIPropertyMetadata(new PropertyChangedCallback(OnCacheModeChanged))); 

        private static void OnCacheModeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            UIElement uie = (UIElement)d; 
            uie.pushCacheMode();
        } 
 
        /// <summary>
        /// The CacheMode specifies parameters used to create a persistent cache of the UIElement and its subtree 
        /// in order to increase rendering performance for content that is expensive to realize.
        /// </summary>
        public CacheMode CacheMode
        { 
            get { return (CacheMode) GetValue(CacheModeProperty); }
            set { SetValue(CacheModeProperty, value); } 
        } 

        private void pushCacheMode() 
        {
            base.VisualCacheMode = CacheMode;
        }
 
        /// <summary>
        /// pushVisualEffects - helper to propagate cacheMode, Opacity, OpacityMask, BitmapEffect, BitmapScalingMode and EdgeMode 
        /// </summary> 
        private void pushVisualEffects()
        { 
            pushCacheMode();
            pushOpacity();
            pushOpacityMask();
            pushBitmapEffect(); 
            pushEdgeMode();
            pushBitmapScalingMode(); 
            pushClearTypeHint(); 
            pushTextHintingMode();
        } 

        #region Uid
        /// <summary>
        /// Uid can be specified in xaml at any point using the xaml language attribute x:Uid. 
        /// This is a long lasting (persisted in source) unique id for an element.
        /// </summary> 
        static public readonly DependencyProperty UidProperty = 
                    DependencyProperty.Register(
                                "Uid", 
                                typeof(string),
                                typeof(UIElement),
                                new UIPropertyMetadata(String.Empty));
 
        /// <summary>
        /// Uid can be specified in xaml at any point using the xaml language attribute x:Uid. 
        /// This is a long lasting (persisted in source) unique id for an element. 
        /// </summary>
        public string Uid 
        {
            get { return (string)GetValue(UidProperty); }
            set { SetValue(UidProperty, value); }
        } 
        #endregion Uid
 
        /// <summary> 
        ///     The Visibility property.
        /// </summary> 
        [CommonDependencyProperty]
        public static readonly DependencyProperty VisibilityProperty =
                DependencyProperty.Register(
                        "Visibility", 
                        typeof(Visibility),
                        typeof(UIElement), 
                        new PropertyMetadata( 
                                VisibilityBoxes.VisibleBox,
                                new PropertyChangedCallback(OnVisibilityChanged)), 
                        new ValidateValueCallback(ValidateVisibility));

        private static void OnVisibilityChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            UIElement uie = (UIElement) d;
 
            Visibility newVisibility = (Visibility) e.NewValue; 
            uie.VisibilityCache = newVisibility;
            uie.switchVisibilityIfNeeded(newVisibility); 

            // The IsVisible property depends on this property.
            uie.UpdateIsVisibleCache();
        } 

        private static bool ValidateVisibility(object o) 
        { 
            Visibility value = (Visibility) o;
            return (value == Visibility.Visible) || (value == Visibility.Hidden) || (value == Visibility.Collapsed); 
        }

        /// <summary>
        ///     Visibility accessor 
        /// </summary>
        [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] 
        public Visibility Visibility 
        {
            get { return VisibilityCache; } 
            set { SetValue(VisibilityProperty, VisibilityBoxes.Box(value)); }
        }

        private void switchVisibilityIfNeeded(Visibility visibility) 
        {
            switch(visibility) 
            { 
                case Visibility.Visible:
                    ensureVisible(); 
                    break;

                case Visibility.Hidden:
                    ensureInvisible(false); 
                    break;
 
                case Visibility.Collapsed: 
                    ensureInvisible(true);
                    break; 
            }
        }

        private void ensureVisible() 
        {
            if(ReadFlag(CoreFlags.IsOpacitySuppressed)) 
            { 
                //restore Opacity
                base.VisualOpacity = Opacity; 

                if(ReadFlag(CoreFlags.IsCollapsed))
                {
                    WriteFlag(CoreFlags.IsCollapsed, false); 

                    //invalidate parent if needed 
                    signalDesiredSizeChange(); 

                    //we are suppressing rendering (see IsRenderable) of collapsed children (to avoid 
                    //confusion when they see RenderSize=(0,0) reported for them)
                    //so now we should invalidate to re-render if some rendering props
                    //changed while UIElement was Collapsed (Arrange will cause re-rendering)
                    InvalidateVisual(); 
                }
 
                WriteFlag(CoreFlags.IsOpacitySuppressed, false); 
            }
        } 

        private void ensureInvisible(bool collapsed)
        {
            if(!ReadFlag(CoreFlags.IsOpacitySuppressed)) 
            {
                base.VisualOpacity = 0; 
                WriteFlag(CoreFlags.IsOpacitySuppressed, true); 
            }
 
            if(!ReadFlag(CoreFlags.IsCollapsed) && collapsed) //Hidden or Visible->Collapsed
            {
                WriteFlag(CoreFlags.IsCollapsed, true);
 
                //invalidate parent
                signalDesiredSizeChange(); 
            } 
            else if(ReadFlag(CoreFlags.IsCollapsed) && !collapsed) //Collapsed -> Hidden
            { 
                WriteFlag(CoreFlags.IsCollapsed, false);

                //invalidate parent
                signalDesiredSizeChange(); 
            }
        } 
 
        private void signalDesiredSizeChange()
        { 
            UIElement p;
            IContentHost ich;

            GetUIParentOrICH(out p, out ich); //only one will be returned 

            if(p != null) 
                p.OnChildDesiredSizeChanged(this); 
            else if(ich != null)
                ich.OnChildDesiredSizeChanged(this); 
        }

        private void ensureClip(Size layoutSlotSize)
        { 
            Geometry clipGeometry = GetLayoutClip(layoutSlotSize);
 
            if(Clip != null) 
            {
                if(clipGeometry == null) 
                    clipGeometry = Clip;
                else
                {
                    CombinedGeometry cg = new CombinedGeometry( 
                        GeometryCombineMode.Intersect,
                        clipGeometry, 
                        Clip); 

                    clipGeometry = cg; 
                }
            }

            ChangeVisualClip(clipGeometry, true /* dontSetWhenClose */); 
        }
 
        /// <summary> 
        /// HitTestCore implements precise hit testing against render contents
        /// </summary> 
        protected override HitTestResult HitTestCore(PointHitTestParameters hitTestParameters)
        {
            if (_drawingContent != null)
            { 
                if (_drawingContent.HitTestPoint(hitTestParameters.HitPoint))
                { 
                    return new PointHitTestResult(this, hitTestParameters.HitPoint); 
                }
            } 

            return null;
        }
 
        /// <summary>
        /// HitTestCore implements precise hit testing against render contents 
        /// </summary> 
        protected override GeometryHitTestResult HitTestCore(GeometryHitTestParameters hitTestParameters)
        { 
            if ((_drawingContent != null) && GetHitTestBounds().IntersectsWith(hitTestParameters.Bounds))
            {
                IntersectionDetail intersectionDetail;
 
                intersectionDetail = _drawingContent.HitTestGeometry(hitTestParameters.InternalHitGeometry);
                Debug.Assert(intersectionDetail != IntersectionDetail.NotCalculated); 
 
                if (intersectionDetail != IntersectionDetail.Empty)
                { 
                    return new GeometryHitTestResult(this, intersectionDetail);
                }
            }
 
            return null;
        } 
 
        /// <summary>
        /// Opens the DrawingVisual for rendering. The returned DrawingContext can be used to 
        /// render into the DrawingVisual.
        /// </summary>
        [FriendAccessAllowed]
        internal DrawingContext RenderOpen() 
        {
            return new VisualDrawingContext(this); 
        } 

        /// <summary> 
        /// Called from the DrawingContext when the DrawingContext is closed.
        /// </summary>
        internal override void RenderClose(IDrawingContent newContent)
        { 
            IDrawingContent oldContent = _drawingContent;
 
            //this element does not render - return 
            if(oldContent == null && newContent == null)
                return; 

            //
            // First cleanup the old content and the state associate with this node
            // related to it's content. 
            //
 
            _drawingContent = null; 

            if (oldContent != null) 
            {
                //
                // Remove the notification handlers.
                // 

                oldContent.PropagateChangedHandler(ContentsChangedHandler, false /* remove */); 
 

                // 
                // Disconnect the old content from this visual.
                //

                DisconnectAttachedResource( 
                    VisualProxyFlags.IsContentConnected,
                    ((DUCE.IResource)oldContent)); 
            } 

 
            //
            // Prepare the new content.
            //
 
            if (newContent != null)
            { 
                // Propagate notification handlers. 
                newContent.PropagateChangedHandler(ContentsChangedHandler, true /* adding */);
            } 

            _drawingContent = newContent;

 
            //
            // Mark the visual dirty on all channels and propagate 
            // the flags up the parent chain. 
            //
 
            SetFlagsOnAllChannels(true, VisualProxyFlags.IsContentDirty);

            PropagateFlags(
                this, 
                VisualFlags.IsSubtreeDirtyForPrecompute,
                VisualProxyFlags.IsSubtreeDirtyForRender); 
        } 

        /// <summary> 
        /// Overriding this function to release DUCE resources during Dispose and during removal of a subtree.
        /// </summary>
        /// <SecurityNote>
        /// Critical - calls other critical code (base) 
        /// </SecurityNote>
        [SecurityCritical] 
        internal override void FreeContent(DUCE.Channel channel) 
        {
            Debug.Assert(_proxy.IsOnChannel(channel)); 

            if (_drawingContent != null)
            {
                if (CheckFlagsAnd(channel, VisualProxyFlags.IsContentConnected)) 
                {
                    DUCE.CompositionNode.SetContent( 
                        _proxy.GetHandle(channel), 
                        DUCE.ResourceHandle.Null,
                        channel); 

                    ((DUCE.IResource)_drawingContent).ReleaseOnChannel(channel);

                    SetFlags(channel, false, VisualProxyFlags.IsContentConnected); 
                }
            } 
 
            // Call the base method too
            base.FreeContent(channel); 
        }

        /// <summary>
        /// Returns the bounding box of the content. 
        /// </summary>
        internal override Rect GetContentBounds() 
        { 
            if (_drawingContent != null)
            { 
                Rect resultRect = Rect.Empty;
                MediaContext mediaContext = MediaContext.From(Dispatcher);
                BoundsDrawingContextWalker ctx = mediaContext.AcquireBoundsDrawingContextWalker();
 
                resultRect = _drawingContent.GetContentBounds(ctx);
                mediaContext.ReleaseBoundsDrawingContextWalker(ctx); 
 
                return resultRect;
            } 
            else
            {
                return Rect.Empty;
            } 
        }
 
        /// <summary> 
        /// WalkContent - method which walks the content (if present) and calls out to the
        /// supplied DrawingContextWalker. 
        /// </summary>
        /// <param name="walker">
        ///   DrawingContextWalker - the target of the calls which occur during
        ///   the content walk. 
        /// </param>
        internal void WalkContent(DrawingContextWalker walker) 
        { 
            VerifyAPIReadOnly();
 
            if (_drawingContent != null)
            {
                _drawingContent.WalkContent(walker);
            } 
        }
 
        /// <summary> 
        /// RenderContent is implemented by derived classes to hook up their
        /// content. The implementer of this function can assert that the visual 
        /// resource is valid on a channel when the function is executed.
        /// </summary>
        internal override void RenderContent(RenderContext ctx, bool isOnChannel)
        { 
            DUCE.Channel channel = ctx.Channel;
 
            Debug.Assert(!CheckFlagsAnd(channel, VisualProxyFlags.IsContentConnected)); 
            Debug.Assert(_proxy.IsOnChannel(channel));
 

            //
            // Create the content on the channel.
            // 

            if (_drawingContent != null) 
            { 
                DUCE.IResource drawingContent = (DUCE.IResource)_drawingContent;
 
                drawingContent.AddRefOnChannel(channel);

                // Hookup it up to the composition node.
 
                DUCE.CompositionNode.SetContent(
                    _proxy.GetHandle(channel), 
                    drawingContent.GetHandle(channel), 
                    channel);
 
                SetFlags(
                    channel,
                    true,
                    VisualProxyFlags.IsContentConnected); 
            }
            else if (isOnChannel) /* _drawingContent == null */ 
            { 
                DUCE.CompositionNode.SetContent(
                    _proxy.GetHandle(channel), 
                    DUCE.ResourceHandle.Null,
                    channel);
            }
        } 

        /// <summary> 
        /// GetDrawing - Returns the drawing content of this Visual. 
        /// </summary>
        /// <remarks> 
        /// Changes to this DrawingGroup will not be propagated to the Visual's content.
        /// This method is called by both the Drawing property, and VisualTreeHelper.GetDrawing()
        /// </remarks>
        internal override DrawingGroup GetDrawing() 
        {
            // 
 

            VerifyAPIReadOnly(); 

            DrawingGroup drawingGroupContent = null;

            // Convert our content to a DrawingGroup, if content exists 
            if (_drawingContent != null)
            { 
                drawingGroupContent = DrawingServices.DrawingGroupFromRenderData((RenderData) _drawingContent); 
            }
 
            return drawingGroupContent;
        }

 
        /// <summary>
        /// This method supplies an additional (to the <seealso cref="Clip"/> property) clip geometry 
        /// that is used to intersect Clip in case if <seealso cref="ClipToBounds"/> property is set to "true". 
        /// Typcally, this is a size of layout space given to the UIElement.
        /// </summary> 
        /// <returns>Geometry to use as additional clip if ClipToBounds=true</returns>
        protected virtual Geometry GetLayoutClip(Size layoutSlotSize)
        {
            if(ClipToBounds) 
            {
                RectangleGeometry rect = new RectangleGeometry(new Rect(RenderSize)); 
                rect.Freeze(); 
                return rect;
            } 
            else
                return null;
        }
 
        /// <summary>
        /// ClipToBounds Property 
        /// </summary> 
        [CommonDependencyProperty]
        public static readonly DependencyProperty ClipToBoundsProperty = 
                    DependencyProperty.Register(
                                "ClipToBounds",
                                typeof(bool),
                                typeof(UIElement), 
                                new PropertyMetadata(
                                        BooleanBoxes.FalseBox, // default value 
                                        new PropertyChangedCallback(ClipToBounds_Changed))); 

        private static void ClipToBounds_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            UIElement uie = (UIElement) d;
            uie.ClipToBoundsCache = (bool) e.NewValue;
 
            //if never measured, then nothing to do, it should be measured at some point
            if(!uie.NeverMeasured || !uie.NeverArranged) 
            { 
                uie.InvalidateArrange();
            } 
        }

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
        public bool ClipToBounds 
        {
            get { return ClipToBoundsCache; } 
            set { SetValue(ClipToBoundsProperty, BooleanBoxes.Box(value)); } 
        }
 

        /// <summary>
        /// Clip Property
        /// </summary> 
        public static readonly DependencyProperty ClipProperty =
                    DependencyProperty.Register( 
                                "Clip", 
                                typeof(Geometry),
                                typeof(UIElement), 
                                new PropertyMetadata(
                                            (Geometry) null,
                                            new PropertyChangedCallback(Clip_Changed)));
 
        private static void Clip_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            UIElement uie = (UIElement) d; 

            // if never measured, then nothing to do, it should be measured at some point 
            if(!uie.NeverMeasured || !uie.NeverArranged)
            {
                uie.InvalidateArrange();
            } 
        }
 
        /// <summary> 
        /// Clip Property
        /// </summary> 
        public Geometry Clip
        {
            get { return (Geometry) GetValue(ClipProperty); }
            set { SetValue(ClipProperty, value); } 
        }
 
        /// <summary> 
        /// Align Property
        /// </summary> 
        public static readonly DependencyProperty SnapsToDevicePixelsProperty =
                DependencyProperty.Register(
                        "SnapsToDevicePixels",
                        typeof(bool), 
                        typeof(UIElement),
                        new PropertyMetadata( 
                                BooleanBoxes.FalseBox, 
                                new PropertyChangedCallback(SnapsToDevicePixels_Changed)));
 
        private static void SnapsToDevicePixels_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            UIElement uie = (UIElement) d;
            uie.SnapsToDevicePixelsCache = (bool) e.NewValue; 

            // if never measured, then nothing to do, it should be measured at some point 
            if(!uie.NeverMeasured || !uie.NeverArranged) 
            {
                uie.InvalidateArrange(); 
            }
        }

        /// <summary> 
        /// SnapsToDevicePixels Property
        /// </summary> 
        public bool SnapsToDevicePixels 
        {
            get { return SnapsToDevicePixelsCache; } 
            set { SetValue(SnapsToDevicePixelsProperty, value); }
        }

        /// <summary> 
        ///     Indicates if the element has effectively focus.
        ///     Used by AccessKeyManager to determine starting 
        ///     element in case of duplicate access keys. This 
        ///     helps when the focus is delegated to some
        ///     other element in the tree. 
        /// </summary>
        protected internal virtual bool HasEffectiveKeyboardFocus
        {
            get 
            {
                return IsKeyboardFocused; 
            } 
        }
 
        // Internal accessor for AccessKeyManager class
        internal void InvokeAccessKey(AccessKeyEventArgs e)
        {
            OnAccessKey(e); 
        }
 
        /// <summary> 
        ///     GotFocus event
        /// </summary> 
        public static readonly RoutedEvent GotFocusEvent = FocusManager.GotFocusEvent.AddOwner(typeof(UIElement));

        /// <summary>
        ///     An event announcing that IsFocused changed to true. 
        /// </summary>
        public event RoutedEventHandler GotFocus 
        { 
            add { AddHandler(GotFocusEvent, value); }
            remove { RemoveHandler(GotFocusEvent, value); } 
        }

        /// <summary>
        ///     LostFocus event 
        /// </summary>
        public static readonly RoutedEvent LostFocusEvent = FocusManager.LostFocusEvent.AddOwner(typeof(UIElement)); 
 
        /// <summary>
        ///     An event announcing that IsFocused changed to false. 
        /// </summary>
        public event RoutedEventHandler LostFocus
        {
            add { AddHandler(LostFocusEvent, value); } 
            remove { RemoveHandler(LostFocusEvent, value); }
        } 
 
        /// <summary>
        ///     The DependencyProperty for the IsFocused property. 
        /// </summary>
        internal static readonly DependencyPropertyKey IsFocusedPropertyKey =
                    DependencyProperty.RegisterReadOnly(
                                "IsFocused", 
                                typeof(bool),
                                typeof(UIElement), 
                                new PropertyMetadata( 
                                            BooleanBoxes.FalseBox, // default value
                                            new PropertyChangedCallback(IsFocused_Changed))); 

        /// <summary>
        ///     The DependencyProperty for IsFocused.
        ///     Flags:              None 
        ///     Read-Only:          true
        /// </summary> 
        public static readonly DependencyProperty IsFocusedProperty 
            = IsFocusedPropertyKey.DependencyProperty;
 
        private static void IsFocused_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            UIElement uiElement = ((UIElement)d);
 
            if ((bool) e.NewValue)
            { 
                uiElement.OnGotFocus(new RoutedEventArgs(GotFocusEvent, uiElement)); 
            }
            else 
            {
                uiElement.OnLostFocus(new RoutedEventArgs(LostFocusEvent, uiElement));
            }
        } 

        /// <summary> 
        ///     This method is invoked when the IsFocused property changes to true 
        /// </summary>
        /// <param name="e">RoutedEventArgs</param> 
        protected virtual void OnGotFocus(RoutedEventArgs e)
        {
            RaiseEvent(e);
        } 

        /// <summary> 
        ///     This method is invoked when the IsFocused property changes to false 
        /// </summary>
        /// <param name="e">RoutedEventArgs</param> 
        protected virtual void OnLostFocus(RoutedEventArgs e)
        {
            RaiseEvent(e);
        } 

        /// <summary> 
        ///     Gettor for IsFocused Property 
        /// </summary>
        public bool IsFocused 
        {
            get { return (bool) GetValue(IsFocusedProperty); }
        }
 
        //*********************************************************************
        #region IsEnabled Property 
        //********************************************************************* 

        /// <summary> 
        ///     The DependencyProperty for the IsEnabled property.
        /// </summary>
        [CommonDependencyProperty]
        public static readonly DependencyProperty IsEnabledProperty = 
                    DependencyProperty.Register(
                                "IsEnabled", 
                                typeof(bool), 
                                typeof(UIElement),
                                new UIPropertyMetadata( 
                                            BooleanBoxes.TrueBox, // default value
                                            new PropertyChangedCallback(OnIsEnabledChanged),
                                            new CoerceValueCallback(CoerceIsEnabled)));
 

        /// <summary> 
        ///     A property indicating if this element is enabled or not. 
        /// </summary>
        public bool IsEnabled 
        {
            get { return (bool) GetValue(IsEnabledProperty);}
            set { SetValue(IsEnabledProperty, BooleanBoxes.Box(value)); }
        } 

        /// <summary> 
        ///     IsEnabledChanged event 
        /// </summary>
        public event DependencyPropertyChangedEventHandler IsEnabledChanged 
        {
            add {EventHandlersStoreAdd(IsEnabledChangedKey, value);}
            remove {EventHandlersStoreRemove(IsEnabledChangedKey, value);}
        } 
        internal static readonly EventPrivateKey IsEnabledChangedKey = new EventPrivateKey(); // Used by ContentElement
 
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
        protected virtual bool IsEnabledCore
        { 
            get
            {
                // As of 1/25/2006, the following controls override this method:
                // ButtonBase.IsEnabledCore: CanExecute 
                // MenuItem.IsEnabledCore:   CanExecute
                // ScrollBar.IsEnabledCore:  _canScroll 
                return true; 
            }
        } 

        private static object CoerceIsEnabled(DependencyObject d, object value)
        {
            UIElement uie = (UIElement) d; 

            // We must be false if our parent is false, but we can be 
            // either true or false if our parent is true. 
            //
            // Another way of saying this is that we can only be true 
            // if our parent is true, but we can always be false.
            if((bool) value)
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
                DependencyObject parent = uie.GetUIParentCore() as ContentElement; 
                if(parent == null)
                { 
                    parent = InputElement.GetContainingUIElement(uie._parent); 
                }
 
                if(parent == null || (bool)parent.GetValue(IsEnabledProperty))
                {
                    return BooleanBoxes.Box(uie.IsEnabledCore);
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
            UIElement uie = (UIElement)d; 

            // Raise the public changed event.
            uie.RaiseDependencyPropertyChanged(IsEnabledChangedKey, e);
 
            // Invalidate the children so that they will inherit the new value.
            InvalidateForceInheritPropertyOnChildren(uie, e.Property); 
 
            // The input manager needs to re-hittest because something changed
            // that is involved in the hit-testing we do, so a different result 
            // could be returned.
            InputManager.SafeCurrentNotifyHitTestInvalidated();

            //Notify Automation in case it is interested. 
            AutomationPeer peer = uie.GetAutomationPeer();
            if(peer != null) 
                peer.InvalidatePeer(); 

        } 


        //**********************************************************************
        #endregion IsEnabled Property 
        //*********************************************************************
 
        //********************************************************************** 
        #region IsHitTestVisible Property
        //********************************************************************** 

        /// <summary>
        ///     The DependencyProperty for the IsHitTestVisible property.
        /// </summary> 
        public static readonly DependencyProperty IsHitTestVisibleProperty =
                    DependencyProperty.Register( 
                                "IsHitTestVisible", 
                                typeof(bool),
                                typeof(UIElement), 
                                new UIPropertyMetadata(
                                            BooleanBoxes.TrueBox, // default value
                                            new PropertyChangedCallback(OnIsHitTestVisibleChanged),
                                            new CoerceValueCallback(CoerceIsHitTestVisible))); 

        /// <summary> 
        ///     A property indicating if this element is hit test visible or not. 
        /// </summary>
        public bool IsHitTestVisible 
        {
            get { return (bool) GetValue(IsHitTestVisibleProperty); }
            set { SetValue(IsHitTestVisibleProperty, BooleanBoxes.Box(value)); }
        } 

        /// <summary> 
        ///     IsHitTestVisibleChanged event 
        /// </summary>
        public event DependencyPropertyChangedEventHandler IsHitTestVisibleChanged 
        {
            add {EventHandlersStoreAdd(IsHitTestVisibleChangedKey, value);}
            remove {EventHandlersStoreRemove(IsHitTestVisibleChangedKey, value);}
        } 
        internal static readonly EventPrivateKey IsHitTestVisibleChangedKey = new EventPrivateKey(); // Used by ContentElement
 
        private static object CoerceIsHitTestVisible(DependencyObject d, object value) 
        {
            UIElement uie = (UIElement) d; 

            // We must be false if our parent is false, but we can be
            // either true or false if our parent is true.
            // 
            // Another way of saying this is that we can only be true
            // if our parent is true, but we can always be false. 
            if((bool) value) 
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
                DependencyObject parent = InputElement.GetContainingUIElement(uie._parent);
 
                if (parent == null || UIElementHelper.IsHitTestVisible(parent))
                { 
                    return BooleanBoxes.TrueBox; 
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

        private static void OnIsHitTestVisibleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            UIElement uie = (UIElement)d; 

            // Raise the public changed event. 
            uie.RaiseDependencyPropertyChanged(IsHitTestVisibleChangedKey, e); 

            // Invalidate the children so that they will inherit the new value. 
            InvalidateForceInheritPropertyOnChildren(uie, e.Property);

            // The input manager needs to re-hittest because something changed
            // that is involved in the hit-testing we do, so a different result 
            // could be returned.
            InputManager.SafeCurrentNotifyHitTestInvalidated(); 
        } 

 
        //*********************************************************************
        #endregion IsHitTestVisible Property
        //**********************************************************************
 
        //*********************************************************************
        #region IsVisible Property 
        //********************************************************************* 

        // The IsVisible property is a read-only reflection of the Visibility 
        // property.
        private static PropertyMetadata _isVisibleMetadata = new ReadOnlyPropertyMetadata(BooleanBoxes.FalseBox,
                                                                                          new GetReadOnlyValueCallback(GetIsVisible),
                                                                                          new PropertyChangedCallback(OnIsVisibleChanged)); 

        internal static readonly DependencyPropertyKey IsVisiblePropertyKey = 
                    DependencyProperty.RegisterReadOnly( 
                                "IsVisible",
                                typeof(bool), 
                                typeof(UIElement),
                                _isVisibleMetadata);

        /// <summary> 
        ///     The DependencyProperty for the IsVisible property.
        /// </summary> 
        public static readonly DependencyProperty IsVisibleProperty = IsVisiblePropertyKey.DependencyProperty; 

        /// <summary> 
        ///     A property indicating if this element is Visible or not.
        /// </summary>
        public bool IsVisible
        { 
            get { return ReadFlag(CoreFlags.IsVisibleCache); }
        } 
        private static object GetIsVisible(DependencyObject d, out BaseValueSourceInternal source) 
        {
            source = BaseValueSourceInternal.Local; 
            return ((UIElement)d).IsVisible ? BooleanBoxes.TrueBox : BooleanBoxes.FalseBox;
        }

        /// <summary> 
        ///     IsVisibleChanged event
        /// </summary> 
        public event DependencyPropertyChangedEventHandler IsVisibleChanged 
        {
            add {EventHandlersStoreAdd(IsVisibleChangedKey, value);} 
            remove {EventHandlersStoreRemove(IsVisibleChangedKey, value);}
        }
        internal static readonly EventPrivateKey IsVisibleChangedKey = new EventPrivateKey(); // Used by ContentElement
 
        /// <SecurityNote>
        /// Critical - Calls a critical method (PresentationSource.CriticalFromVisual) 
        /// TreatAsSafe - No exposure 
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
        internal void UpdateIsVisibleCache() // Called from PresentationSource
        {
            // IsVisible is a read-only property.  It derives its "base" value
            // from the Visibility property. 
            bool isVisible = (Visibility == Visibility.Visible);
 
            // We must be false if our parent is false, but we can be 
            // either true or false if our parent is true.
            // 
            // Another way of saying this is that we can only be true
            // if our parent is true, but we can always be false.
            if(isVisible)
            { 
                bool constraintAllowsVisible = false;
 
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
                DependencyObject parent = InputElement.GetContainingUIElement(_parent);

                if(parent != null)
                { 
                    constraintAllowsVisible = UIElementHelper.IsVisible(parent);
                } 
                else 
                {
                    // We cannot be visible if we have no visual parent, unless: 
                    // 1) We are the root, connected to a PresentationHost.
                    PresentationSource presentationSource = PresentationSource.CriticalFromVisual(this);
                    if(presentationSource != null)
                    { 
                        constraintAllowsVisible = true;
                    } 
                    else 
                    {
                        // CODE 

                    }

                } 

                if(!constraintAllowsVisible) 
                { 
                    isVisible = false;
                } 
            }

            if(isVisible != IsVisible)
            { 
                // Our IsVisible force-inherited property has changed.  Update our
                // cache and raise a change notification. 
 
                WriteFlag(CoreFlags.IsVisibleCache, isVisible);
                NotifyPropertyChange(new DependencyPropertyChangedEventArgs(IsVisibleProperty, _isVisibleMetadata, BooleanBoxes.Box(!isVisible), BooleanBoxes.Box(isVisible))); 
            }
        }

        private static void OnIsVisibleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            UIElement uie = (UIElement) d; 
 
            // Raise the public changed event.
            uie.RaiseDependencyPropertyChanged(IsVisibleChangedKey, e); 

            // Invalidate the children so that they will inherit the new value.
            InvalidateForceInheritPropertyOnChildren(uie, e.Property);
 
            // The input manager needs to re-hittest because something changed
            // that is involved in the hit-testing we do, so a different result 
            // could be returned. 
            InputManager.SafeCurrentNotifyHitTestInvalidated();
        } 

        //*********************************************************************
        #endregion IsVisible Property
        //********************************************************************** 

        //********************************************************************* 
        #region Focusable Property 
        //**********************************************************************
 
        /// <summary>
        ///     The DependencyProperty for the Focusable property.
        /// </summary>
        [CommonDependencyProperty] 
        public static readonly DependencyProperty FocusableProperty =
                DependencyProperty.Register( 
                        "Focusable", 
                        typeof(bool),
                        typeof(UIElement), 
                        new UIPropertyMetadata(
                                BooleanBoxes.FalseBox, // default value
                                new PropertyChangedCallback(OnFocusableChanged)));
 
        /// <summary>
        ///     Gettor and Settor for Focusable Property 
        /// </summary> 
        public bool Focusable
        { 
            get { return (bool) GetValue(FocusableProperty); }
            set { SetValue(FocusableProperty, BooleanBoxes.Box(value)); }
        }
 
        /// <summary>
        ///     FocusableChanged event 
        /// </summary> 
        public event DependencyPropertyChangedEventHandler FocusableChanged
        { 
            add {EventHandlersStoreAdd(FocusableChangedKey, value);}
            remove {EventHandlersStoreRemove(FocusableChangedKey, value);}
        }
        internal static readonly EventPrivateKey FocusableChangedKey = new EventPrivateKey(); // Used by ContentElement 

        private static void OnFocusableChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        { 
            UIElement uie = (UIElement) d;
 
            // Raise the public changed event.
            uie.RaiseDependencyPropertyChanged(FocusableChangedKey, e);
        }
 
        //**********************************************************************
        #endregion Focusable Property 
        //********************************************************************* 

        /// <summary> 
        /// Called by the Automation infrastructure when AutomationPeer
        /// is requested for this element. The element can return null or
        /// the instance of AutomationPeer-derived clas, if it supports UI Automation
        /// </summary> 
        protected virtual AutomationPeer OnCreateAutomationPeer() { return null; }
 
        /// <summary> 
        /// Called by the Automation infrastructure or Control author
        /// to make sure the AutomationPeer is created. The element may 
        /// create AP or return null, depending on OnCreateAutomationPeer override.
        /// </summary>
        internal AutomationPeer CreateAutomationPeer()
        { 
            VerifyAccess(); //this will ensure the AP is created in the right context
 
            AutomationPeer ap = null; 

            if(HasAutomationPeer) 
            {
                ap = AutomationPeerField.GetValue(this);
            }
            else 
            {
                ap = OnCreateAutomationPeer(); 
 
                if(ap != null)
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
        internal AutomationPeer GetAutomationPeer() 
        {
            VerifyAccess(); 
 
            if(HasAutomationPeer)
                return AutomationPeerField.GetValue(this); 

            return null;
        }
 
        /// <summary>
        /// Called by the Automation infrastructure only in the case when the UIElement does not have a specific 
        /// peer (does not override OnCreateAutomationPeer) but we still want some generic peer to be created and cached. 
        /// For example, this is needed when HwndTarget contains a Panel and 2 Buttons underneath - the Panel
        /// normally does not have a peer so only one of the Buttons is visible in the tree. 
        /// </summary>
        internal AutomationPeer CreateGenericRootAutomationPeer()
        {
            VerifyAccess(); //this will ensure the AP is created in the right context 

            AutomationPeer ap = null; 
 
            // If some peer was already created, specific or generic - use it.
            if(HasAutomationPeer) 
            {
                ap = AutomationPeerField.GetValue(this);
            }
            else 
            {
                ap = new GenericRootAutomationPeer(this); 
 
                AutomationPeerField.SetValue(this, ap);
                HasAutomationPeer = true; 
            }

            return ap;
        } 

 
        /// <summary> 
        /// This is used by the parser and journaling to uniquely identify a given element
        /// in a deterministic fashion, i.e., each time the same XAML/BAML is parsed/read, 
        /// the items will be given the same PersistId.
        /// </summary>
        /// To keep PersistId from being serialized the set has been removed from the property and a separate
        /// set method has been created. 
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Obsolete("PersistId is an obsolete property and may be removed in a future release.  The value of this property is not defined.")] 
        public int PersistId 
        {
            get { return _persistId; } 
        }

        /// <summary>
        /// This is used by the parser and journaling to uniquely identify a given element 
        /// in a deterministic fashion, i.e., each time the same XAML/BAML is parsed/read,
        /// the items will be given the same PersistId. 
        /// </summary> 
        /// <param name="value"></param>
        /// To keep PersistId from being serialized the set has been removed from the property and a separate 
        /// set method has been created.
        [FriendAccessAllowed] // Built into Core, also used by Framework.
        internal void SetPersistId(int value)
        { 
            _persistId = value;
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

        internal Rect PreviousArrangeRect 
        {
            //  called from PresentationFramework!System.Windows.Controls.Primitives.LayoutInformation.GetLayoutSlot() 
            [FriendAccessAllowed] 
            get
            { 
                return _finalRect;
            }
        }
 
        // Cache for the Visibility property.  Storage is in Visual._nodeProperties.
        private Visibility VisibilityCache 
        { 
            get
            { 
                if (CheckFlagsAnd(VisualFlags.VisibilityCache_Visible))
                {
                    return Visibility.Visible;
                } 
                else if (CheckFlagsAnd(VisualFlags.VisibilityCache_TakesSpace))
                { 
                    return Visibility.Hidden; 
                }
                else 
                {
                    return Visibility.Collapsed;
                }
            } 
            set
            { 
                Debug.Assert(value == Visibility.Visible || value == Visibility.Hidden || value == Visibility.Collapsed); 

                switch (value) 
                {
                    case Visibility.Visible:
                        SetFlags(true,  VisualFlags.VisibilityCache_Visible);
                        SetFlags(false, VisualFlags.VisibilityCache_TakesSpace); 
                        break;
 
                    case Visibility.Hidden: 
                        SetFlags(false, VisualFlags.VisibilityCache_Visible);
                        SetFlags(true,  VisualFlags.VisibilityCache_TakesSpace); 
                        break;

                    case Visibility.Collapsed:
                        SetFlags(false, VisualFlags.VisibilityCache_Visible); 
                        SetFlags(false, VisualFlags.VisibilityCache_TakesSpace);
                        break; 
                } 
            }
        } 

        #region ForceInherit property support

        // Also called by FrameworkContentElement 
        internal static void SynchronizeForceInheritProperties(
            UIElement        uiElement, 
            ContentElement   contentElement, 
            UIElement3D      uiElement3D,
            DependencyObject parent) 
        {
            if(uiElement != null || uiElement3D != null)
            {
                bool parentValue = (bool) parent.GetValue(IsEnabledProperty); 
                if(!parentValue)
                { 
                    // For Read/Write force-inherited properties, use the standard coersion pattern. 
                    //
                    // The IsEnabled property must be coerced false if the parent is false. 
                    if (uiElement != null)
                    {
                        uiElement.CoerceValue(IsEnabledProperty);
                    } 
                    else
                    { 
                        uiElement3D.CoerceValue(IsEnabledProperty); 
                    }
                } 

                parentValue = (bool) parent.GetValue(IsHitTestVisibleProperty);
                if(!parentValue)
                { 
                    // For Read/Write force-inherited properties, use the standard coersion pattern.
                    // 
                    // The IsHitTestVisible property must be coerced false if the parent is false. 
                    if (uiElement != null)
                    { 
                        uiElement.CoerceValue(IsHitTestVisibleProperty);
                    }
                    else
                    { 
                        uiElement3D.CoerceValue(IsHitTestVisibleProperty);
                    } 
                } 

                parentValue = (bool) parent.GetValue(IsVisibleProperty); 
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
                bool parentValue = (bool) parent.GetValue(IsEnabledProperty); 
                if(!parentValue)
                {
                    // The IsEnabled property must be coerced false if the parent is false.
                    contentElement.CoerceValue(IsEnabledProperty); 
                }
            } 
        } 

        // This is called from the force-inherit property changed events. 
        internal static void InvalidateForceInheritPropertyOnChildren(Visual v, DependencyProperty property)
        {
            int cChildren = v.InternalVisual2DOr3DChildrenCount;
            for (int iChild = 0; iChild < cChildren; iChild++) 
            {
                DependencyObject child = v.InternalGet2DOr3DVisualChild(iChild); 
 
                Visual vChild = child as Visual;
                if (vChild != null) 
                {
                    UIElement element = vChild as UIElement;

                    if (element != null) 
                    {
                        if(property == IsVisibleProperty) 
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
                        InvalidateForceInheritPropertyOnChildren(vChild, property); 
                    }
                } 
                else 
                {
                    Visual3D v3DChild = child as Visual3D; 

                    if (v3DChild != null)
                    {
                        UIElement3D element3D = v3DChild as UIElement3D; 

                        if(element3D != null) 
                        { 
                            if(property == IsVisibleProperty)
                            { 
                                // For Read-Only force-inherited properties, use
                                // a private update method.
                                element3D.UpdateIsVisibleCache();
                            } 
                            else
                            { 
                                // For Read/Write force-inherited properties, use 
                                // the standard coersion pattern.
                                element3D.CoerceValue(property); 
                            }
                        }
                        else
                        { 
                            // We have to "walk through" non-UIElement visuals.
                            UIElement3D.InvalidateForceInheritPropertyOnChildren(v3DChild, property); 
                        } 
                    }
                } 
            }
        }

        #endregion 

        #region Manipulation 
 
        /// <summary>
        ///     The dependency property for the IsManipulationEnabled property. 
        /// </summary>
        public static readonly DependencyProperty IsManipulationEnabledProperty =
            DependencyProperty.Register(
                "IsManipulationEnabled", 
                typeof(bool),
                typeof(UIElement), 
                new PropertyMetadata(BooleanBoxes.FalseBox, new PropertyChangedCallback(OnIsManipulationEnabledChanged))); 

        /// <summary> 
        ///     Whether manipulations are enabled on this element or not.
        /// </summary>
        /// <remarks>
        ///     Handle the ManipulationStarting event to customize the behavior of manipulations. 
        ///     Setting to false will immediately complete any current manipulation or inertia
        ///     on this element and raise a ManipulationCompleted event. 
        /// </remarks> 
        [CustomCategory(SRID.Touch_Category)]
        public bool IsManipulationEnabled 
        {
            get
            {
                return (bool)GetValue(IsManipulationEnabledProperty); 
            }
            set 
            { 
                SetValue(IsManipulationEnabledProperty, value);
            } 
        }

        private static void OnIsManipulationEnabledChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            if ((bool)e.NewValue)
            { 
                ((UIElement)d).CoerceStylusProperties(); 
            }
            else 
            {
                Manipulation.TryCompleteManipulation((UIElement)d);
            }
        } 

        private void CoerceStylusProperties() 
        { 
            // When manipulation is enabled, disable Stylus.IsFlicksEnabled property.
            // This property, when active, produces visible effects that don't apply 
            // and are distracting during a manipulation.
            //
            // Not using coercion to avoid adding the cost of doing the callback
            // on all elements, even when they don't need it. 
            if (IsDefaultValue(this, Stylus.IsFlicksEnabledProperty))
            { 
                SetCurrentValueInternal(Stylus.IsFlicksEnabledProperty, BooleanBoxes.FalseBox); 
            }
        } 

        private static bool IsDefaultValue(DependencyObject dependencyObject, DependencyProperty dependencyProperty)
        {
            bool hasModifiers, isExpression, isAnimated, isCoerced, isCurrent; 
            BaseValueSourceInternal source = dependencyObject.GetValueSource(dependencyProperty, null, out hasModifiers, out isExpression, out isAnimated, out isCoerced, out isCurrent);
            return (source == BaseValueSourceInternal.Default) && !isExpression && !isAnimated && !isCoerced; 
        } 

        /// <summary> 
        ///     Indicates that a manipulation is about to start and allows for configuring its behavior.
        /// </summary>
        public static readonly RoutedEvent ManipulationStartingEvent = Manipulation.ManipulationStartingEvent.AddOwner(typeof(UIElement));
 
        /// <summary>
        ///     Indicates that a manipulation is about to start and allows for configuring its behavior. 
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<ManipulationStartingEventArgs> ManipulationStarting 
        {
            add { AddHandler(ManipulationStartingEvent, value, false); }
            remove { RemoveHandler(ManipulationStartingEvent, value); }
        } 

        private static void OnManipulationStartingThunk(object sender, ManipulationStartingEventArgs e) 
        { 
            ((UIElement)sender).OnManipulationStarting(e);
        } 

        /// <summary>
        ///     Indicates that a manipulation has started.
        /// </summary> 
        protected virtual void OnManipulationStarting(ManipulationStartingEventArgs e) { }
 
        /// <summary> 
        ///     Indicates that a manipulation has started.
        /// </summary> 
        public static readonly RoutedEvent ManipulationStartedEvent = Manipulation.ManipulationStartedEvent.AddOwner(typeof(UIElement));

        /// <summary>
        ///     Indicates that a manipulation has started. 
        /// </summary>
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<ManipulationStartedEventArgs> ManipulationStarted 
        {
            add { AddHandler(ManipulationStartedEvent, value, false); } 
            remove { RemoveHandler(ManipulationStartedEvent, value); }
        }

        private static void OnManipulationStartedThunk(object sender, ManipulationStartedEventArgs e) 
        {
            ((UIElement)sender).OnManipulationStarted(e); 
        } 

        /// <summary> 
        ///     Indicates that a manipulation has started.
        /// </summary>
        protected virtual void OnManipulationStarted(ManipulationStartedEventArgs e) { }
 
        /// <summary>
        ///     Provides data regarding changes to a currently occurring manipulation. 
        /// </summary> 
        public static readonly RoutedEvent ManipulationDeltaEvent = Manipulation.ManipulationDeltaEvent.AddOwner(typeof(UIElement));
 
        /// <summary>
        ///     Provides data regarding changes to a currently occurring manipulation.
        /// </summary>
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<ManipulationDeltaEventArgs> ManipulationDelta
        { 
            add { AddHandler(ManipulationDeltaEvent, value, false); } 
            remove { RemoveHandler(ManipulationDeltaEvent, value); }
        } 

        private static void OnManipulationDeltaThunk(object sender, ManipulationDeltaEventArgs e)
        {
            ((UIElement)sender).OnManipulationDelta(e); 
        }
 
        /// <summary> 
        ///     Provides data regarding changes to a currently occurring manipulation.
        /// </summary> 
        protected virtual void OnManipulationDelta(ManipulationDeltaEventArgs e) { }

        /// <summary>
        ///     Allows a handler to customize the parameters of an inertia processor. 
        /// </summary>
        public static readonly RoutedEvent ManipulationInertiaStartingEvent = Manipulation.ManipulationInertiaStartingEvent.AddOwner(typeof(UIElement)); 
 
        /// <summary>
        ///     Allows a handler to customize the parameters of an inertia processor. 
        /// </summary>
        [CustomCategory(SRID.Touch_Category)]
        public event EventHandler<ManipulationInertiaStartingEventArgs> ManipulationInertiaStarting
        { 
            add { AddHandler(ManipulationInertiaStartingEvent, value, false); }
            remove { RemoveHandler(ManipulationInertiaStartingEvent, value); } 
        } 

        private static void OnManipulationInertiaStartingThunk(object sender, ManipulationInertiaStartingEventArgs e) 
        {
            ((UIElement)sender).OnManipulationInertiaStarting(e);
        }
 
        /// <summary>
        ///     Allows a handler to customize the parameters of an inertia processor. 
        /// </summary> 
        protected virtual void OnManipulationInertiaStarting(ManipulationInertiaStartingEventArgs e) { }
 
        /// <summary>
        ///     Allows a handler to provide feedback when a manipulation has encountered a boundary.
        /// </summary>
        public static readonly RoutedEvent ManipulationBoundaryFeedbackEvent = Manipulation.ManipulationBoundaryFeedbackEvent.AddOwner(typeof(UIElement)); 

        /// <summary> 
        ///     Allows a handler to provide feedback when a manipulation has encountered a boundary. 
        /// </summary>
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<ManipulationBoundaryFeedbackEventArgs> ManipulationBoundaryFeedback
        {
            add { AddHandler(ManipulationBoundaryFeedbackEvent, value, false); }
            remove { RemoveHandler(ManipulationBoundaryFeedbackEvent, value); } 
        }
 
        private static void OnManipulationBoundaryFeedbackThunk(object sender, ManipulationBoundaryFeedbackEventArgs e) 
        {
            ((UIElement)sender).OnManipulationBoundaryFeedback(e); 
        }

        /// <summary>
        ///     Allows a handler to provide feedback when a manipulation has encountered a boundary. 
        /// </summary>
        protected virtual void OnManipulationBoundaryFeedback(ManipulationBoundaryFeedbackEventArgs e) { } 
 
        /// <summary>
        ///     Indicates that a manipulation has completed. 
        /// </summary>
        public static readonly RoutedEvent ManipulationCompletedEvent = Manipulation.ManipulationCompletedEvent.AddOwner(typeof(UIElement));

        /// <summary> 
        ///     Indicates that a manipulation has completed.
        /// </summary> 
        [CustomCategory(SRID.Touch_Category)] 
        public event EventHandler<ManipulationCompletedEventArgs> ManipulationCompleted
        { 
            add { AddHandler(ManipulationCompletedEvent, value, false); }
            remove { RemoveHandler(ManipulationCompletedEvent, value); }
        }
 
        private static void OnManipulationCompletedThunk(object sender, ManipulationCompletedEventArgs e)
        { 
            ((UIElement)sender).OnManipulationCompleted(e); 
        }
 
        /// <summary>
        ///     Indicates that a manipulation has completed.
        /// </summary>
        protected virtual void OnManipulationCompleted(ManipulationCompletedEventArgs e) { } 

        #endregion 
 
        #region Touch
 
        /// <summary>
        ///     A property indicating if any touch devices are over this element or not.
        /// </summary>
        public bool AreAnyTouchesOver 
        {
            get { return ReadFlag(CoreFlags.TouchesOverCache); } 
        } 

        /// <summary> 
        ///     A property indicating if any touch devices are directly over this element or not.
        /// </summary>
        public bool AreAnyTouchesDirectlyOver
        { 
            get { return (bool)GetValue(AreAnyTouchesDirectlyOverProperty); }
        } 
 
        /// <summary>
        ///     A property indicating if any touch devices are captured to elements in this subtree. 
        /// </summary>
        public bool AreAnyTouchesCapturedWithin
        {
            get { return ReadFlag(CoreFlags.TouchesCapturedWithinCache); } 
        }
 
        /// <summary> 
        ///     A property indicating if any touch devices are captured to this element.
        /// </summary> 
        public bool AreAnyTouchesCaptured
        {
            get { return (bool)GetValue(AreAnyTouchesCapturedProperty); }
        } 

        /// <summary> 
        ///     Captures the specified device to this element. 
        /// </summary>
        /// <param name="touchDevice">The touch device to capture.</param> 
        /// <returns>True if capture was taken.</returns>
        public bool CaptureTouch(TouchDevice touchDevice)
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
        public bool ReleaseTouchCapture(TouchDevice touchDevice)
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
 
        #endregion
 
        ///// LAYOUT DATA /////

        private Rect _finalRect;
        private Size _desiredSize; 
        private Size _previousAvailableSize;
        private IDrawingContent _drawingContent; 
 
        //right after creation all elements are Clean so go Invalidate at least one
 
        internal ContextLayoutManager.LayoutQueue.Request MeasureRequest;
        internal ContextLayoutManager.LayoutQueue.Request ArrangeRequest;

        // See PersistId property 
        private int _persistId = 0;
 
        // Device transform 
        private static double _dpiScaleX = 1.0;
        private static double _dpiScaleY = 1.0; 
        private static bool _setDpi = true;

        ///// ATTACHED STORAGE /////
 
        // Perf analysis showed we were not using these fields enough to warrant
        // bloating each instance with the field, so storage is created on-demand 
        // in the local store. 
        internal static readonly UncommonField<EventHandlersStore> EventHandlersStoreField = new UncommonField<EventHandlersStore>();
        internal static readonly UncommonField<InputBindingCollection> InputBindingCollectionField = new UncommonField<InputBindingCollection>(); 
        internal static readonly UncommonField<CommandBindingCollection> CommandBindingCollectionField = new UncommonField<CommandBindingCollection>();
        private  static readonly UncommonField<object> LayoutUpdatedListItemsField = new UncommonField<object>();
        private  static readonly UncommonField<EventHandler> LayoutUpdatedHandlersField = new UncommonField<EventHandler>();
        private  static readonly UncommonField<StylusPlugInCollection> StylusPlugInsField = new UncommonField<StylusPlugInCollection>(); 
        private  static readonly UncommonField<AutomationPeer> AutomationPeerField = new UncommonField<AutomationPeer>();
 
        internal SizeChangedInfo sizeChangedInfo; 

        internal bool HasAutomationPeer 
        {
            get { return ReadFlag(CoreFlags.HasAutomationPeer); }
            set { WriteFlag(CoreFlags.HasAutomationPeer, value); }
        } 
        private bool RenderingInvalidated
        { 
            get { return ReadFlag(CoreFlags.RenderingInvalidated); } 
            set { WriteFlag(CoreFlags.RenderingInvalidated, value); }
        } 

        internal bool SnapsToDevicePixelsCache
        {
            get { return ReadFlag(CoreFlags.SnapsToDevicePixelsCache); } 
            set { WriteFlag(CoreFlags.SnapsToDevicePixelsCache, value); }
        } 
 
        internal bool ClipToBoundsCache
        { 
            get { return ReadFlag(CoreFlags.ClipToBoundsCache); }
            set { WriteFlag(CoreFlags.ClipToBoundsCache, value); }
        }
 
        internal bool MeasureDirty
        { 
            get { return ReadFlag(CoreFlags.MeasureDirty); } 
            set { WriteFlag(CoreFlags.MeasureDirty, value); }
        } 

        internal bool ArrangeDirty
        {
            get { return ReadFlag(CoreFlags.ArrangeDirty); } 
            set { WriteFlag(CoreFlags.ArrangeDirty, value); }
        } 
 
        internal bool MeasureInProgress
        { 
            get { return ReadFlag(CoreFlags.MeasureInProgress); }
            set { WriteFlag(CoreFlags.MeasureInProgress, value); }
        }
 
        internal bool ArrangeInProgress
        { 
            get { return ReadFlag(CoreFlags.ArrangeInProgress); } 
            set { WriteFlag(CoreFlags.ArrangeInProgress, value); }
        } 

        internal bool NeverMeasured
        {
            get { return ReadFlag(CoreFlags.NeverMeasured); } 
            set { WriteFlag(CoreFlags.NeverMeasured, value); }
        } 
 
        internal bool NeverArranged
        { 
            get { return ReadFlag(CoreFlags.NeverArranged); }
            set { WriteFlag(CoreFlags.NeverArranged, value); }
        }
 
        internal bool MeasureDuringArrange
        { 
            get { return ReadFlag(CoreFlags.MeasureDuringArrange); } 
            set { WriteFlag(CoreFlags.MeasureDuringArrange, value); }
        } 

        internal bool AreTransformsClean
        {
            get { return ReadFlag(CoreFlags.AreTransformsClean); } 
            set { WriteFlag(CoreFlags.AreTransformsClean, value); }
        } 
 
        internal static readonly FocusWithinProperty FocusWithinProperty = new FocusWithinProperty();
        internal static readonly MouseOverProperty MouseOverProperty = new MouseOverProperty(); 
        internal static readonly MouseCaptureWithinProperty MouseCaptureWithinProperty = new MouseCaptureWithinProperty();
        internal static readonly StylusOverProperty StylusOverProperty = new StylusOverProperty();
        internal static readonly StylusCaptureWithinProperty StylusCaptureWithinProperty = new StylusCaptureWithinProperty();
        internal static readonly TouchesOverProperty TouchesOverProperty = new TouchesOverProperty(); 
        internal static readonly TouchesCapturedWithinProperty TouchesCapturedWithinProperty = new TouchesCapturedWithinProperty();
        private Size               _size; 
        internal const int MAX_ELEMENTS_IN_ROUTE = 4096; 
    }
 
    [Flags]
    internal enum CoreFlags : uint
    {
        None                            = 0x00000000, 
        SnapsToDevicePixelsCache        = 0x00000001,
        ClipToBoundsCache               = 0x00000002, 
        MeasureDirty                    = 0x00000004, 
        ArrangeDirty                    = 0x00000008,
        MeasureInProgress               = 0x00000010, 
        ArrangeInProgress               = 0x00000020,
        NeverMeasured                   = 0x00000040,
        NeverArranged                   = 0x00000080,
        MeasureDuringArrange            = 0x00000100, 
        IsCollapsed                     = 0x00000200,
        IsKeyboardFocusWithinCache      = 0x00000400, 
        IsKeyboardFocusWithinChanged    = 0x00000800, 
        IsMouseOverCache                = 0x00001000,
        IsMouseOverChanged              = 0x00002000, 
        IsMouseCaptureWithinCache       = 0x00004000,
        IsMouseCaptureWithinChanged     = 0x00008000,
        IsStylusOverCache               = 0x00010000,
        IsStylusOverChanged             = 0x00020000, 
        IsStylusCaptureWithinCache      = 0x00040000,
        IsStylusCaptureWithinChanged    = 0x00080000, 
        HasAutomationPeer               = 0x00100000, 
        RenderingInvalidated            = 0x00200000,
        IsVisibleCache                  = 0x00400000, 
        AreTransformsClean              = 0x00800000,
        IsOpacitySuppressed             = 0x01000000,
        ExistsEventHandlersStore        = 0x02000000,
        TouchesOverCache                = 0x04000000, 
        TouchesOverChanged              = 0x08000000,
        TouchesCapturedWithinCache      = 0x10000000, 
        TouchesCapturedWithinChanged    = 0x20000000, 
        TouchLeaveCache                 = 0x40000000,
        TouchEnterCache                 = 0x80000000, 
    }
}



