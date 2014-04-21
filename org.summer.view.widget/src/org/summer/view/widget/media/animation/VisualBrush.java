package org.summer.view.widget.media.animation;

import java.awt.image.renderable.RenderContext;

import javax.xml.crypto.dsig.Transform;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Size;
import org.summer.view.widget.Type;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.widget.threading.Dispatcher;
import org.summer.view.widget.threading.DispatcherOperation;

/// <summary>
    /// VisualBrush - This TileBrush defines its content as a Visual
    /// </summary> 
    public /*sealed*/ /*partial*/ class VisualBrush extends TileBrush implements ICyclicBrush
    { 
    	
    	 //----------------------------------------------------- 
        //
        //  Public Methods 
        //
        //-----------------------------------------------------

//        #region Public Methods 

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public /*new*/ VisualBrush Clone()
        {
            return (VisualBrush)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public /*new*/ VisualBrush CloneCurrentValue()
        {
            return (VisualBrush)base.CloneCurrentValue();
        } 

 
 

//        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void VisualPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            VisualBrush target = ((VisualBrush) d);


            Visual oldV = (Visual) e.OldValue; 

            // 
            // If the Visual required layout but it is changed before we do Layout 
            // on that Visual, then we dont want the async LayoutCallback method to run,
            // nor do we want the LayoutUpdated handler to run. So we abort/remove them. 
            //
            if (target._pendingLayout)
            {
                // 
                // Visual has to be a UIElement since _pendingLayout flag is
                // true only if we added the LayoutUpdated handler which can 
                // only be done on UIElement. 
                //
                UIElement element = (UIElement)oldV; 
                Debug.Assert(element != null);
                element.LayoutUpdated -= target.OnLayoutUpdated;

                Debug.Assert(target._DispatcherLayoutResult != null); 
                Debug.Assert(target._DispatcherLayoutResult.Status == System.Windows.Threading.DispatcherOperationStatus.Pending);
                boolean abortStatus = target._DispatcherLayoutResult.Abort(); 
                Debug.Assert(abortStatus); 

                target._pendingLayout = false; 
            }

            Visual newV = (Visual) e.NewValue;
            System.Windows.Threading.Dispatcher dispatcher = target.Dispatcher; 

            if (dispatcher != null) 
            { 
                DUCE.IResource targetResource = (DUCE.IResource)target;
                using (CompositionEngineLock.Acquire()) 
                {
                    int channelCount = targetResource.GetChannelCount();

                    for (int channelIndex = 0; channelIndex < channelCount; channelIndex++) 
                    {
                        DUCE.Channel channel = targetResource.GetChannel(channelIndex); 
                        Debug.Assert(!channel.IsOutOfBandChannel); 
                        Debug.Assert(!targetResource.GetHandle(channel).IsNull);
                        target.ReleaseResource(oldV,channel); 
                        target.AddRefResource(newV,channel);
                    }
                }
            } 

            target.PropertyChanged(VisualProperty); 
        } 
        private static void AutoLayoutContentPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            VisualBrush target = ((VisualBrush) d);


            target.PropertyChanged(AutoLayoutContentProperty); 
        }
 
 
//        #region Public Properties
 
        /// <summary>
        ///     Visual - Visual.  Default value is null.
        /// </summary>
        public Visual Visual 
        {
            get 
            { 
                return (Visual) GetValue(VisualProperty);
            } 
            set
            {
                SetValueInternal(VisualProperty, value);
            } 
        }
 
        /// <summary> 
        ///     AutoLayoutContent - boolean.  Default value is true.
        ///     If this property is true, this Brush will run layout on the contents of this Brush 
        ///     if the Visual is a non-parented UIElement.
        /// </summary>
        public boolean AutoLayoutContent
        { 
            get
            { 
                return (boolean) GetValue(AutoLayoutContentProperty); 
            }
            set 
            {
                SetValueInternal(AutoLayoutContentProperty, BooleanBoxes.Box(value));
            }
        } 

//        #endregion Public Properties 
 
        //------------------------------------------------------
        // 
        //  Protected Methods
        //
        //------------------------------------------------------
 
//        #region Protected Methods
 
        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary> 
        /// <returns>The new Freezable.</returns>
        protected /*override*/ Freezable CreateInstanceCore()
        {
            return new VisualBrush(); 
        }
 
 

//        #endregion ProtectedMethods 

        //-----------------------------------------------------
        //
        //  Internal Methods 
        //
        //------------------------------------------------------ 
 
//        #region Internal Methods
 
        /// <SecurityNote>
        ///     Critical: This code calls into an unsafe code block
        ///     TreatAsSafe: This code does not return any critical data.It is ok to expose
        ///     Channels are safe to call into and do not go cross domain and cross process 
        /// </SecurityNote>
//        [SecurityCritical,SecurityTreatAsSafe] 
        /*internal*/ public /*override*/ void UpdateResource(DUCE.Channel channel, boolean skipOnChannelCheck) 
        {
            // If we're told we can skip the channel check, then we must be on channel 
            Debug.Assert(!skipOnChannelCheck || _duceResource.IsOnChannel(channel));

            if (skipOnChannelCheck || _duceResource.IsOnChannel(channel))
            { 
                base.UpdateResource(channel, skipOnChannelCheck);
 
                // Read values of properties into local variables 
                Transform vTransform = Transform;
                Transform vRelativeTransform = RelativeTransform; 
                Visual vVisual = Visual;

                // Obtain handles for properties that implement DUCE.IResource
                DUCE.ResourceHandle hTransform; 
                if (vTransform == null ||
                    Object.ReferenceEquals(vTransform, Transform.Identity) 
                    ) 
                {
                    hTransform = DUCE.ResourceHandle.Null; 
                }
                else
                {
                    hTransform = ((DUCE.IResource)vTransform).GetHandle(channel); 
                }
                DUCE.ResourceHandle hRelativeTransform; 
                if (vRelativeTransform == null || 
                    Object.ReferenceEquals(vRelativeTransform, Transform.Identity)
                    ) 
                {
                    hRelativeTransform = DUCE.ResourceHandle.Null;
                }
                else 
                {
                    hRelativeTransform = ((DUCE.IResource)vRelativeTransform).GetHandle(channel); 
                } 

                // Obtain handles for properties that implement DUCE.IResource 
                DUCE.ResourceHandle  hVisual = vVisual != null ? ((DUCE.IResource)vVisual).GetHandle(channel) : DUCE.ResourceHandle.Null;

                // Obtain handles for animated properties
                DUCE.ResourceHandle hOpacityAnimations = GetAnimationResourceHandle(OpacityProperty, channel); 
                DUCE.ResourceHandle hViewportAnimations = GetAnimationResourceHandle(ViewportProperty, channel);
                DUCE.ResourceHandle hViewboxAnimations = GetAnimationResourceHandle(ViewboxProperty, channel); 
 
                // Pack & send command packet
                DUCE.MILCMD_VISUALBRUSH data; 
                unsafe
                {
                    data.Type = MILCMD.MilCmdVisualBrush;
                    data.Handle = _duceResource.GetHandle(channel); 
                    if (hOpacityAnimations.IsNull)
                    { 
                        data.Opacity = Opacity; 
                    }
                    data.hOpacityAnimations = hOpacityAnimations; 
                    data.hTransform = hTransform;
                    data.hRelativeTransform = hRelativeTransform;
                    data.ViewportUnits = ViewportUnits;
                    data.ViewboxUnits = ViewboxUnits; 
                    if (hViewportAnimations.IsNull)
                    { 
                        data.Viewport = Viewport; 
                    }
                    data.hViewportAnimations = hViewportAnimations; 
                    if (hViewboxAnimations.IsNull)
                    {
                        data.Viewbox = Viewbox;
                    } 
                    data.hViewboxAnimations = hViewboxAnimations;
                    data.Stretch = Stretch; 
                    data.TileMode = TileMode; 
                    data.AlignmentX = AlignmentX;
                    data.AlignmentY = AlignmentY; 
                    data.CachingHint = (CachingHint)GetValue(RenderOptions.CachingHintProperty);
                    data.CacheInvalidationThresholdMinimum = (double)GetValue(RenderOptions.CacheInvalidationThresholdMinimumProperty);
                    data.CacheInvalidationThresholdMaximum = (double)GetValue(RenderOptions.CacheInvalidationThresholdMaximumProperty);
                    data.hVisual = hVisual; 

                    // Send packed command structure 
                    channel.SendCommand( 
                        (byte*)&data,
                        sizeof(DUCE.MILCMD_VISUALBRUSH)); 
                }
            }
        }
        /*internal*/ public /*override*/ DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel) 
        {
 
                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_VISUALBRUSH)) 
                {
                    Transform vTransform = Transform; 
                    if (vTransform != null) ((DUCE.IResource)vTransform).AddRefOnChannel(channel);
                    Transform vRelativeTransform = RelativeTransform;
                    if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).AddRefOnChannel(channel);
                    Visual vVisual = Visual; 
                    if (vVisual != null) vVisual.AddRefOnChannelForCyclicBrush(this, channel);
                    AddRefOnChannelAnimations(channel); 
 

                    UpdateResource(channel, true /* skip "on channel" check - we already know that we're on channel */ ); 
                }

                return _duceResource.GetHandle(channel);
 
        }
        /*internal*/ public /*override*/ void ReleaseOnChannelCore(DUCE.Channel channel) 
        { 

                Debug.Assert(_duceResource.IsOnChannel(channel)); 

                if (_duceResource.ReleaseOnChannel(channel))
                {
                    Transform vTransform = Transform; 
                    if (vTransform != null) ((DUCE.IResource)vTransform).ReleaseOnChannel(channel);
                    Transform vRelativeTransform = RelativeTransform; 
                    if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).ReleaseOnChannel(channel); 
                    Visual vVisual = Visual;
                    if (vVisual != null) vVisual.ReleaseOnChannelForCyclicBrush(this, channel); 
                    ReleaseOnChannelAnimations(channel);

                }
 
        }
        /*internal*/ public /*override*/ DUCE.ResourceHandle GetHandleCore(DUCE.Channel channel) 
        { 
            // Note that we are in a lock here already.
            return _duceResource.GetHandle(channel); 
        }
        /*internal*/ public /*override*/ int GetChannelCountCore()
        {
            // must already be in composition lock here 
            return _duceResource.GetChannelCount();
        } 
        /*internal*/ public /*override*/ DUCE.Channel GetChannelCore(int index) 
        {
            // Note that we are in a lock here already. 
            return _duceResource.GetChannel(index);
        }

 
//        #endregion Internal Methods
 
        //----------------------------------------------------- 
        //
        //  Internal Properties 
        //
        //-----------------------------------------------------

//        #region Internal Properties 

        // 
        //  This property finds the correct initial size for the _effectiveValues store on the 
        //  current DependencyObject as a performance optimization
        // 
        //  This includes:
        //    Visual
        //
        /*internal*/ public /*override*/ int EffectiveValuesInitialSize 
        {
            get 
            { 
                return 1;
            } 
        }


 
//        #endregion Internal Properties
 
        //----------------------------------------------------- 
        //
        //  Dependency Properties 
        //
        //------------------------------------------------------

//        #region Dependency Properties 

        /// <summary> 
        ///     The DependencyProperty for the VisualBrush.Visual property. 
        /// </summary>
        public static final DependencyProperty VisualProperty; 
        /// <summary>
        ///     The DependencyProperty for the VisualBrush.AutoLayoutContent property.
        /// </summary>
        public static final DependencyProperty AutoLayoutContentProperty; 

//        #endregion Dependency Properties 
 
        //-----------------------------------------------------
        // 
        //  Internal Fields
        //
        //------------------------------------------------------
 
//        #region Internal Fields
 
 

        /*internal*/ public System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource(); 

        /*internal*/ public /*const*/static final boolean c_AutoLayoutContent = true;

//        #endregion Internal Fields 

 
 
//        #region Constructors
 
        //------------------------------------------------------
        //
        //  Constructors
        // 
        //-----------------------------------------------------
 
        static //VisualBrush() 
        {
            // We check our static default fields which are of type Freezable 
            // to make sure that they are not mutable, otherwise we will throw
            // if these get touched by more than one thread in the lifetime
            // of your app.  (Windows OS Bug #947272)
            // 

 
            // Initializations 
            Type typeofThis = typeof(VisualBrush);
            VisualProperty = 
                  RegisterProperty("Visual",
                                   typeof(Visual),
                                   typeofThis,
                                   null, 
                                   new PropertyChangedCallback(VisualPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
            AutoLayoutContentProperty = 
                  RegisterProperty("AutoLayoutContent",
                                   typeof(boolean),
                                   typeofThis,
                                   true, 
                                   new PropertyChangedCallback(AutoLayoutContentPropertyChanged),
                                   null, 
                                   /* isIndependentlyAnimated  = */ false, 
                                   /* coerceValueCallback */ null);
        } 



//        #endregion Constructors 
//        #region Constructors 

        /// <summary> 
        /// Default constructor for VisualBrush.  The resulting Brush has no content.
        /// </summary>
        public VisualBrush()
        { 

        } 
 
        /// <summary>
        /// VisualBrush Constructor where the image is set to the parameter's value 
        /// </summary>
        /// <param name="visual"> The Visual representing the contents of this Brush. </param>
        public VisualBrush(Visual visual)
        { 
            if (this.Dispatcher != null)
            { 
                MediaSystem.AssertSameContext(this, visual); 
                Visual = visual;
            } 
        }
//        #endregion Constructors

        public void /*ICyclicBrush.*/FireOnChanged() 
        {
            // Simple loop detection to avoid stack overflow in cyclic VisualBrush 
            // scenarios. This fix is only aimed at mitigating a very common 
            // VisualBrush scenario.
 
            boolean canEnter = Enter();

            if (canEnter)
            { 
                try
                { 
                    _isCacheDirty = true; 
                    FireChanged();
 
                    // Register brush's visual tree for Render().
                    RegisterForAsyncRenderForCyclicBrush();
                }
                finally 
                {
                    Exit(); 
                } 
            }
        } 

        /// <summary>
        /// Calling this will make sure that the render request
        /// is registered with the MediaContext. 
        /// </summary>
        private void RegisterForAsyncRenderForCyclicBrush() 
        { 
            DUCE.IResource resource = this as DUCE.IResource;
 
            if (resource != null)
            {
                if ((Dispatcher != null) && !_isAsyncRenderRegistered)
                { 
                    MediaContext mediaContext = MediaContext.From(Dispatcher);
 
                    // 
                    // Only register for a deferred render if this visual brush
                    // is actually on the channel. 
                    //
                    if (!resource.GetHandle(mediaContext.Channel).IsNull)
                    {
                        // Add this handler to this event means that the handler will be 
                        // called on the next UIThread render for this Dispatcher.
                        ICyclicBrush cyclicBrush = this as ICyclicBrush; 
                        mediaContext.ResourcesUpdated += new MediaContext.ResourcesUpdatedHandler(cyclicBrush.RenderForCyclicBrush); 
                        _isAsyncRenderRegistered = true;
                    } 
                }
            }
        }
 
       void /*ICyclicBrush.*/RenderForCyclicBrush(DUCE.Channel channel, boolean skipChannelCheck)
       { 
 
            Visual vVisual = Visual;
 
            // The Visual may have been registered for an asynchronous render, but may have been
            // disconnected from the VisualBrush since then.  If so, don't bother to render here, if
            // the Visual is visible it will be rendered elsewhere.
            if (vVisual != null && vVisual.CheckFlagsAnd(VisualFlags.NodeIsCyclicBrushRoot)) 
            {
                // ----------------------------------------------------------------------------------- 
                // 1) Prepare the visual for rendering. 
                //
                // Updates bounding boxes. 
                //

                vVisual.Precompute();
 

                // ----------------------------------------------------------------------------------- 
                // 2) Prepare the render context. 
                //
 
                RenderContext rc = new RenderContext();

                rc.Initialize(channel, DUCE.ResourceHandle.Null);
 

                // ------------------------------------------------------------------------------------ 
                // 3) Compile the scene. 

                if (channel.IsConnected) 
                {
                    vVisual.Render(rc, 0);
                }
                else 
                {
                    // We can issue the release here instead of putting it in queue 
                    // since we are already in Render walk. 
                    ((DUCE.IResource)vVisual).ReleaseOnChannel(channel);
                } 
            }

            _isAsyncRenderRegistered = false;
        } 

 
        // Implement functions used to addref and release resources in codegen that need 
        // to be specialized for Visual which doesn't implement DUCE.IResource
        /*internal*/ public void AddRefResource(Visual visual, DUCE.Channel channel) 
        {
            if (visual != null)
            {
                visual.AddRefOnChannelForCyclicBrush(this, channel); 
            }
        } 
 
        /*internal*/ public void ReleaseResource(Visual visual, DUCE.Channel channel)
        { 
            if (visual != null)
            {
                visual.ReleaseOnChannelForCyclicBrush(this, channel);
            } 
        }
 
        /// <summary> 
        /// Implementation of <see cref="System.Windows.DependencyObject.OnPropertyChanged">DependencyObject.OnPropertyInvalidated</see>.
        /// If the property is the Visual or the AutoLayoutContent property, we re-layout the Visual if 
        /// possible.
        /// </summary>
        protected /*override*/ void OnPropertyChanged(DependencyPropertyChangedEventArgs e)
        { 
            super.OnPropertyChanged(e);
 
            if (e.IsAValueChange || e.IsASubPropertyChange) 
            {
                if ((e.Property == VisualProperty) || (e.Property == AutoLayoutContentProperty)) 
                {
                    // Should we initiate a layout on this Visual?
                    // Yes, if AutoLayoutContent is true and if the Visual is a UIElement not already in
                    // another tree (i.e. the parent is null) or its not the hwnd root. 
                    if (AutoLayoutContent)
                    { 
                        Debug.Assert(!_pendingLayout); 
                        UIElement element = Visual as UIElement;
 
                        if ((element != null)
                              &&
                              ((VisualTreeHelper.GetParent(element) == null && !(element.IsRootElement))
                               || (VisualTreeHelper.GetParent(element) is Visual3D))) 
                        {
                            // 
                            // We need 2 ways of initiating layout on the VisualBrush root. 
                            // 1. We add a handler such that when the layout is done for the
                            // main tree and LayoutUpdated is fired, then we do layout for the 
                            // VisualBrush tree.
                            // However, this can fail in the case where the main tree is composed
                            // of just Visuals and never does layout nor fires LayoutUpdated. So
                            // we also need the following approach. 
                            // 2. We do a BeginInvoke to start layout on the Visual. This approach
                            // alone, also falls short in the scenario where if we are already in 
                            // MediaContext.DoWork() then we will do layout (for main tree), then look 
                            // at Loaded callbacks, then render, and then finally the Dispather will
                            // fire us for layout. So during loaded callbacks we would not have done 
                            // layout on the VisualBrush tree.
                            //
                            // Depending upon which of the two layout passes comes first, we cancel
                            // the other layout pass. 
                            //
                            element.LayoutUpdated += OnLayoutUpdated; 
                            _DispatcherLayoutResult = Dispatcher.BeginInvoke( 
                                DispatcherPriority.Normal,
                                new DispatcherOperationCallback(LayoutCallback), 
                                element);
                            _pendingLayout = true;
                        }
                    } 
                }
            } 
        } 

        /// <summary> 
        /// We initiate the layout on the tree rooted at the Visual to which VisualBrush points.
        /// </summary>
        private void DoLayout(UIElement element)
        { 
            Debug.Assert(element != null);
 
            DependencyObject parent = VisualTreeHelper.GetParent(element); 
            if (!(element.IsRootElement)
                && (parent == null || parent is Visual3D)) 
            {
                //
                // PropagateResumeLayout sets the LayoutSuspended flag to false if it were true.
                // 
                UIElement.PropagateResumeLayout(null, element);
                element.Measure(new Size(Double.PositiveInfinity, Double.PositiveInfinity)); 
                element.Arrange(new Rect(element.DesiredSize)); 
            }
        } 

        /// <summary>
        /// LayoutUpdate event handler.
        /// </summary> 
        /// <param name="sender">event sender (not used)</param>
        /// <param name="args">event arguments (not used)</param> 
        private void OnLayoutUpdated(Object sender, EventArgs args) 
        {
            Debug.Assert(_pendingLayout); 

            // Visual has to be a UIElement since the handler was added to it.
            UIElement element = (UIElement)Visual;
            Debug.Assert(element != null); 

            // Unregister for the event 
            element.LayoutUpdated -= OnLayoutUpdated; 
            _pendingLayout = false;
 
            //
            // Since we are in this function that means that layoutUpdated fired before
            // Dispatcher.BeginInvoke fired. So we can abort the DispatcherOperation as
            // we will do the layout here. 
            //
            Debug.Assert(_DispatcherLayoutResult != null); 
            Debug.Assert(_DispatcherLayoutResult.Status == DispatcherOperationStatus.Pending); 
            boolean abortStatus = _DispatcherLayoutResult.Abort();
            Debug.Assert(abortStatus); 

            DoLayout(element);
        }
 

        /// <summary> 
        /// DispatcherOperation callback to initiate layout. 
        /// </summary>
        /// <param name="arg">The Visual root</param> 
        private Object LayoutCallback(Object arg)
        {
            Debug.Assert(_pendingLayout);
 
            UIElement element = arg as UIElement;
            Debug.Assert(element != null); 
 
            //
            // Since we are in this function that means that Dispatcher.BeginInvoke fired 
            // before LayoutUpdated fired. So we can remove the LayoutUpdated handler as
            // we will do the layout here.
            //
            element.LayoutUpdated -= OnLayoutUpdated; 
            _pendingLayout = false;
 
            DoLayout(element); 

            return null; 
        }

        /// <summary>
        /// Enter is used for simple cycle detection in VisualBrush. If the method returns false 
        /// the brush has already been entered and cannot be entered again. Matching invocation of Exit
        /// must be skipped if Enter returns false. 
        /// </summary> 
        /*internal*/ public boolean Enter()
        { 
            if (_reentrancyFlag)
            {
                return false;
            } 
            else
            { 
                _reentrancyFlag = true; 
                return true;
            } 
        }

        /// <summary>
        /// Exits the VisualBrush. For more details see Enter method. 
        /// </summary>
        /*internal*/ public void Exit() 
        { 
            Debug.Assert(_reentrancyFlag); // Exit must be matched with Enter. See Enter comments.
            _reentrancyFlag = false; 
        }

        /// <summary>
        /// Obtains the current bounds of the brush's content 
        /// </summary>
        /// <param name="contentBounds"> Output bounds of content</param> 
        protected /*override*/ void GetContentBounds(out Rect contentBounds) 
        {
            // Obtain the current visual's outer space bounding box. We return the outer space 
            // bounding box because we want to have the bounding box of the Visual tree including
            // transform/offset at the root.
            if (_isCacheDirty)
            { 
                _bbox = Visual.CalculateSubgraphBoundsOuterSpace();
                _isCacheDirty = false; 
            } 

            contentBounds = _bbox; 
        }

        private DispatcherOperation _DispatcherLayoutResult;
        private boolean _pendingLayout; 
        private boolean _reentrancyFlag;
 
        private boolean _isAsyncRenderRegistered = false; 

        // Whether we need to re-calculate our content bounds. 
        private boolean _isCacheDirty = true;

        // Keep our content bounds cached.
        private Rect _bbox = Rect.Empty; 
    }