package org.summer.view.widget.media;

import java.awt.image.renderable.RenderContext;

import javax.xml.crypto.dsig.Transform;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Size;
import org.summer.view.widget.Type;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.UIPropertyMetadata;
import org.summer.view.widget.threading.DispatcherOperation;

public /*partial*/ class BitmapCacheBrush extends Brush implements ICyclicBrush
{
	
	//----------------------------------------------------- 
    //
    //  Public Methods 
    //
    //-----------------------------------------------------

//    #region Public Methods 

    /// <summary> 
    ///     Shadows inherited Clone() with a strongly typed 
    ///     version for convenience.
    /// </summary> 
    public /*new*/ BitmapCacheBrush Clone()
    {
        return (BitmapCacheBrush)base.Clone();
    } 

    /// <summary> 
    ///     Shadows inherited CloneCurrentValue() with a strongly typed 
    ///     version for convenience.
    /// </summary> 
    public /*new*/ BitmapCacheBrush CloneCurrentValue()
    {
        return (BitmapCacheBrush)base.CloneCurrentValue();
    } 




//    #endregion Public Methods 

    //------------------------------------------------------
    //
    //  Public Properties 
    //
    //----------------------------------------------------- 

    private static void TargetPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        BitmapCacheBrush target = ((BitmapCacheBrush) d);


        target.PropertyChanged(TargetProperty); 
    }
    private static void BitmapCachePropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    { 




        // The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children)
        // will promote the property value from a default value to a local value. This is technically a sub-property 
        // change because the collection was changed and not a new collection set (GeometryGroup.Children.
        // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled 
        // the default value to the compositor. If the property changes from a default value, the new local value 
        // needs to be marshalled to the compositor. We detect this scenario with the second condition
        // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be 
        // Default and the NewValueSource will be Local.
        if (e.IsASubPropertyChange &&
           (e.OldValueSource == e.NewValueSource))
        { 
            return;
        } 


        BitmapCacheBrush target = ((BitmapCacheBrush) d); 


        BitmapCache oldV = (BitmapCache) e.OldValue;
        BitmapCache newV = (BitmapCache) e.NewValue; 
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

        target.PropertyChanged(BitmapCacheProperty); 
    }
    private static void AutoLayoutContentPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        BitmapCacheBrush target = ((BitmapCacheBrush) d);


        target.PropertyChanged(AutoLayoutContentProperty);
    } 
    private static void InternalTargetPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        BitmapCacheBrush target = ((BitmapCacheBrush) d); 


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

        target.PropertyChanged(InternalTargetProperty);
    } 
    private static void AutoWrapTargetPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        BitmapCacheBrush target = ((BitmapCacheBrush) d); 


        target.PropertyChanged(AutoWrapTargetProperty);
    } 


//    #region Public Properties 

    /// <summary> 
    ///     Target - Visual.  Default value is null.
    /// </summary>
    public Visual Target
    { 
        get
        { 
            return (Visual) GetValue(TargetProperty); 
        }
        set 
        {
            SetValueInternal(TargetProperty, value);
        }
    } 

    /// <summary> 
    ///     BitmapCache - BitmapCache.  Default value is null. 
    /// </summary>
    public BitmapCache BitmapCache 
    {
        get
        {
            return (BitmapCache) GetValue(BitmapCacheProperty); 
        }
        set 
        { 
            SetValueInternal(BitmapCacheProperty, value);
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

    /// <summary>
    ///     InternalTarget - Visual.  Default value is null.
    /// </summary> 
    /*internal*/ public Visual InternalTarget
    { 
        get 
        {
            return (Visual) GetValue(InternalTargetProperty); 
        }
        set
        {
            SetValueInternal(InternalTargetProperty, value); 
        }
    } 

    /// <summary>
    ///     AutoWrapTarget - boolean.  Default value is false. 
    ///     If true, this Brush wrap its Target visual in a ContainerVisual, which will allow
    ///     the brush to support rendering all properties on the visual above the cache to
    ///     match VisualBrush's behavior.
    /// </summary> 
    /*internal*/ public boolean AutoWrapTarget
    { 
        get 
        {
            return (boolean) GetValue(AutoWrapTargetProperty); 
        }
        set
        {
            SetValueInternal(AutoWrapTargetProperty, BooleanBoxes.Box(value)); 
        }
    } 

//    #endregion Public Properties

    //------------------------------------------------------
    //
    //  Protected Methods
    // 
    //------------------------------------------------------

//    #region Protected Methods 

    /// <summary> 
    /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
    /// </summary>
    /// <returns>The new Freezable.</returns>
    protected /*override*/ Freezable CreateInstanceCore() 
    {
        return new BitmapCacheBrush(); 
    } 



//    #endregion ProtectedMethods

    //----------------------------------------------------- 
    //
    //  Internal Methods 
    // 
    //------------------------------------------------------

//    #region Internal Methods

    /// <SecurityNote>
    ///     Critical: This code calls into an unsafe code block 
    ///     TreatAsSafe: This code does not return any critical data.It is ok to expose
    ///     Channels are safe to call into and do not go cross domain and cross process 
    /// </SecurityNote> 
//    [SecurityCritical,SecurityTreatAsSafe]
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
            BitmapCache vBitmapCache = BitmapCache;
            Visual vInternalTarget = InternalTarget; 

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
            DUCE.ResourceHandle hBitmapCache = vBitmapCache != null ? ((DUCE.IResource)vBitmapCache).GetHandle(channel) : DUCE.ResourceHandle.Null;

            // Obtain handles for properties that implement DUCE.IResource 
            DUCE.ResourceHandle  hInternalTarget = vInternalTarget != null ? ((DUCE.IResource)vInternalTarget).GetHandle(channel) : DUCE.ResourceHandle.Null;

            // Obtain handles for animated properties 
            DUCE.ResourceHandle hOpacityAnimations = GetAnimationResourceHandle(OpacityProperty, channel);

            // Pack & send command packet
            DUCE.MILCMD_BITMAPCACHEBRUSH data;
            unsafe
            { 
                data.Type = MILCMD.MilCmdBitmapCacheBrush;
                data.Handle = _duceResource.GetHandle(channel); 
                if (hOpacityAnimations.IsNull) 
                {
                    data.Opacity = Opacity; 
                }
                data.hOpacityAnimations = hOpacityAnimations;
                data.hTransform = hTransform;
                data.hRelativeTransform = hRelativeTransform; 
                data.hBitmapCache = hBitmapCache;
                data.hInternalTarget = hInternalTarget; 

                // Send packed command structure
                channel.SendCommand( 
                    (byte*)&data,
                    sizeof(DUCE.MILCMD_BITMAPCACHEBRUSH));
            }
        } 
    }
    /*internal*/ public /*override*/ DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel) 
    { 

            if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_BITMAPCACHEBRUSH)) 
            {
                Transform vTransform = Transform;
                if (vTransform != null) ((DUCE.IResource)vTransform).AddRefOnChannel(channel);
                Transform vRelativeTransform = RelativeTransform; 
                if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).AddRefOnChannel(channel);
                BitmapCache vBitmapCache = BitmapCache; 
                if (vBitmapCache != null) ((DUCE.IResource)vBitmapCache).AddRefOnChannel(channel); 
                Visual vInternalTarget = InternalTarget;
                if (vInternalTarget != null) vInternalTarget.AddRefOnChannelForCyclicBrush(this, channel); 
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
                BitmapCache vBitmapCache = BitmapCache;
                if (vBitmapCache != null) ((DUCE.IResource)vBitmapCache).ReleaseOnChannel(channel); 
                Visual vInternalTarget = InternalTarget;
                if (vInternalTarget != null) vInternalTarget.ReleaseOnChannelForCyclicBrush(this, channel); 
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


//    #endregion Internal Methods

    //----------------------------------------------------- 
    //
    //  Internal Properties 
    // 
    //-----------------------------------------------------

//    #region Internal Properties

    //
    //  This property finds the correct initial size for the _effectiveValues store on the 
    //  current DependencyObject as a performance optimization
    // 
    //  This includes: 
    //    Target
    // 
    /*internal*/ public /*override*/ int EffectiveValuesInitialSize
    {
        get
        { 
            return 1;
        } 
    } 



//    #endregion Internal Properties

    //----------------------------------------------------- 
    //
    //  Dependency Properties 
    // 
    //------------------------------------------------------

//    #region Dependency Properties

    /// <summary>
    ///     The DependencyProperty for the BitmapCacheBrush.Target property. 
    /// </summary>
    public static final DependencyProperty TargetProperty; 
    /// <summary> 
    ///     The DependencyProperty for the BitmapCacheBrush.BitmapCache property.
    /// </summary> 
    public static final DependencyProperty BitmapCacheProperty;
    /// <summary>
    ///     The DependencyProperty for the BitmapCacheBrush.AutoLayoutContent property.
    /// </summary> 
    public static final DependencyProperty AutoLayoutContentProperty;
    /// <summary> 
    ///     The DependencyProperty for the BitmapCacheBrush.InternalTarget property. 
    /// </summary>
    /*internal*/ public static final DependencyProperty InternalTargetProperty; 
    /// <summary>
    ///     The DependencyProperty for the BitmapCacheBrush.AutoWrapTarget property.
    /// </summary>
    /*internal*/ public static final DependencyProperty AutoWrapTargetProperty; 

//    #endregion Dependency Properties 

    //-----------------------------------------------------
    // 
    //  Internal Fields
    //
    //------------------------------------------------------

//    #region Internal Fields



    /*internal*/ public System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource(); 

    /*internal*/ public /*const*/static final boolean c_AutoLayoutContent = true;
    /*internal*/ public /*const*/static final boolean c_AutoWrapTarget = false;

//    #endregion Internal Fields



//    #region Constructors 

    //------------------------------------------------------
    //
    //  Constructors 
    //
    //----------------------------------------------------- 

    static //BitmapCacheBrush()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272) 
        //


        // Initializations
        Type typeofThis = typeof(BitmapCacheBrush); 
        StaticInitialize(typeofThis);
        TargetProperty =
              RegisterProperty("Target",
                               typeof(Visual), 
                               typeofThis,
                               null, 
                               new PropertyChangedCallback(TargetPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        BitmapCacheProperty =
              RegisterProperty("BitmapCache",
                               typeof(BitmapCache), 
                               typeofThis,
                               null, 
                               new PropertyChangedCallback(BitmapCachePropertyChanged), 
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
        InternalTargetProperty =
              RegisterProperty("InternalTarget",
                               typeof(Visual), 
                               typeofThis,
                               null, 
                               new PropertyChangedCallback(InternalTargetPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        AutoWrapTargetProperty =
              RegisterProperty("AutoWrapTarget",
                               typeof(boolean), 
                               typeofThis,
                               false, 
                               new PropertyChangedCallback(AutoWrapTargetPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
    }



//    #endregion Constructors 

//    #region Constructors 
    public BitmapCacheBrush()
    { 

    }

    /// <summary>
    /// VisualBrush Constructor where the image is set to the parameter's value
    /// </summary>
    /// <param name="visual"> The Visual representing the contents of this Brush. </param> 
    public BitmapCacheBrush(Visual visual)
    { 
        if (this.Dispatcher != null) 
        {
            MediaSystem.AssertSameContext(this, visual); 
            Target = visual;
        }
    }
//    #endregion Constructors 

    private ContainerVisual AutoWrapVisual 
    { 
        get
        { 
            // Lazily create the dummy visual instance.
            if (_dummyVisual == null)
            {
                _dummyVisual = new ContainerVisual(); 
            }

            return _dummyVisual; 
        }
    } 

    // NOTE:  This class is basically identical to VisualBrush, it should be refactored to
    //        a common place to prevent code duplication (maybe Brush.cs?)
    void ICyclicBrush.FireOnChanged() 
    {
        // Simple loop detection to avoid stack overflow in cyclic VisualBrush 
        // scenarios. This fix is only aimed at mitigating a very common 
        // VisualBrush scenario.

        boolean canEnter = Enter();

        if (canEnter)
        { 
            try
            { 
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

   void ICyclicBrush.RenderForCyclicBrush(DUCE.Channel channel, boolean skipChannelCheck) 
   {

        Visual vVisual = InternalTarget; 

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
            if ((e.Property == TargetProperty) || (e.Property == AutoLayoutContentProperty)) 
            {
                // Should we wrap the visual in a dummy visual node for rendering? 
                if (e.Property == TargetProperty && e.IsAValueChange)
                {
                    if (AutoWrapTarget)
                    { 
                        Debug.Assert(InternalTarget == AutoWrapVisual,
                            "InternalTarget should point to our dummy visual AutoWrapVisual when AutoWrapTarget is true."); 

                        // Change the value being wrapped by AutoWrapVisual.
                        AutoWrapVisual.Children.Remove((Visual)e.OldValue); 
                        AutoWrapVisual.Children.Add((Visual)e.NewValue);
                    }
                    else
                    { 
                        // Target just passes through to InternalTarget.
                        InternalTarget = Target; 
                    } 
                }

                // Should we initiate a layout on this Visual?
                // Yes, if AutoLayoutContent is true and if the Visual is a UIElement not already in
                // another tree (i.e. the parent is null) or its not the hwnd root.
                if (AutoLayoutContent) 
                {
                    Debug.Assert(!_pendingLayout); 
                    UIElement element = Target as UIElement; 

                    if ((element != null) 
                          &&
                          ((VisualTreeHelper.GetParent(element) == null && !(element.IsRootElement)) // element is not connected to visual tree, OR
                           || (VisualTreeHelper.GetParent(element) is Visual3D) // element is a 2D child of a 3D Object, OR
                           || (VisualTreeHelper.GetParent(element) == InternalTarget))) // element is only connected to visual tree via our wrapper Visual 
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
            else if (e.Property == AutoWrapTargetProperty) 
            { 
                // If our AutoWrap behavior changed, wrap/unwrap the target here.
                if (AutoWrapTarget) 
                {
                    InternalTarget = AutoWrapVisual;
                    AutoWrapVisual.Children.Add(Target);
                } 
                else
                { 
                    AutoWrapVisual.Children.Remove(Target); 
                    InternalTarget = Target;
                } 
            }
        }
    }

    /// <summary>
    /// We initiate the layout on the tree rooted at the Visual to which BitmapCacheBrush points. 
    /// </summary> 
    private void DoLayout(UIElement element)
    { 
        Debug.Assert(element != null);

        DependencyObject parent = VisualTreeHelper.GetParent(element);
        if (!(element.IsRootElement) 
            && (parent == null || parent is Visual3D || parent == InternalTarget))
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
    private void OnLayoutUpdated(Object sender, EventArgs args)
    {
        Debug.Assert(_pendingLayout);

        // Target has to be a UIElement since the handler was added to it.
        UIElement element = (UIElement)Target; 
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
    /// Enter is used for simple cycle detection in BitmapCacheBrush. If the method returns false 
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
    /// Exits the BitmapCacheBrush. For more details see Enter method. 
    /// </summary>
    /*internal*/ public void Exit() 
    {
        Debug.Assert(_reentrancyFlag); // Exit must be matched with Enter. See Enter comments.
        _reentrancyFlag = false;
    } 

    private static Object CoerceOpacity(DependencyObject d, Object value) 
    { 
        if ((double)value != (double)OpacityProperty.GetDefaultValue(typeof(BitmapCacheBrush)))
        { 
            throw new InvalidOperationException(SR.Get(SRID.BitmapCacheBrush_OpacityChanged));
        }
        return 1.0;
    } 

    private static Object CoerceTransform(DependencyObject d, Object value) 
    { 
        if ((Transform)value != (Transform)TransformProperty.GetDefaultValue(typeof(BitmapCacheBrush)))
        { 
            throw new InvalidOperationException(SR.Get(SRID.BitmapCacheBrush_TransformChanged));
        }
        return null;
    } 

    private static Object CoerceRelativeTransform(DependencyObject d, Object value) 
    { 
        if ((Transform)value != (Transform)RelativeTransformProperty.GetDefaultValue(typeof(BitmapCacheBrush)))
        { 
            throw new InvalidOperationException(SR.Get(SRID.BitmapCacheBrush_RelativeTransformChanged));
        }
        return null;
    } 

    private static void StaticInitialize(Type typeofThis) 
    { 
        OpacityProperty.OverrideMetadata(typeofThis, new IndependentlyAnimatedPropertyMetadata(1.0, /* PropertyChangedHandle */ null, CoerceOpacity));
        TransformProperty.OverrideMetadata(typeofThis, new UIPropertyMetadata(null, /* PropertyChangedHandle */ null, CoerceTransform)); 
        RelativeTransformProperty.OverrideMetadata(typeofThis, new UIPropertyMetadata(null, /* PropertyChangedHandle */ null, CoerceRelativeTransform));
    }

    private ContainerVisual _dummyVisual; 

    private DispatcherOperation _DispatcherLayoutResult; 
    private boolean _pendingLayout; 
    private boolean _reentrancyFlag;

    private boolean _isAsyncRenderRegistered = false;
}