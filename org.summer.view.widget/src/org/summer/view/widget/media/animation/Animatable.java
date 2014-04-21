package org.summer.view.widget.media.animation;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.CoerceValueCallback;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.Type;
import org.summer.view.widget.UIPropertyMetadata;
import org.summer.view.widget.UncommonField;
import org.summer.view.widget.ValidateValueCallback;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.utils.FrugalMap;

/// <summary> 
    /// This class derives from Freezable and adds the ability to animate properties. 
    /// </summary>
    public abstract /*partial*/ class Animatable extends  Freezable implements IAnimatable, DUCE.IResource 
    {
//        #region Constructors

        /// <summary> 
        ///
        /// </summary> 
        protected Animatable() 
        {
        } 

//        #endregion

//        #region Public 

        /// <summary> 
        /// Creates a copy of this Animatable. 
        /// </summary>
        /// <returns>The copy.</returns> 
        public /*new*/ Animatable Clone()
        {
            return (Animatable)super.Clone();
        } 

        /*internal*/ public void PropertyChanged(DependencyProperty dp) 
        { 
            AnimationStorage animationStorage = AnimationStorage.GetStorage(this, dp);
            IndependentAnimationStorage independentAnimationStorage = animationStorage as IndependentAnimationStorage; 

            // If this property is independently animated and currently has
            // animations all we need to do is update the animation resource
            // that represents this property value. Otherwise we need to invalidate 
            // and and eventually update this whole Object.
            if (independentAnimationStorage != null) 
            { 
                independentAnimationStorage.InvalidateResource();
            } 
            else
            {
                RegisterForAsyncUpdateResource();
            } 
        }
 
        /*internal*/ public /*virtual*/ void AddRefOnChannelAnimations(DUCE.Channel channel) 
        {
            if (IAnimatable_HasAnimatedProperties) 
            {
                FrugalMap animatedPropertiesMap = AnimationStorage.GetAnimatedPropertiesMap(this);

                Debug.Assert(animatedPropertiesMap.Count > 0); 

                for (int i = 0; i < animatedPropertiesMap.Count; i++) 
                { 
                    Int32   dpGlobalIndex;
                    Object  storageObject; 

                    animatedPropertiesMap.GetKeyValuePair(i, out dpGlobalIndex, out storageObject);

                    DUCE.IResource storage = storageObject as DUCE.IResource; 

                    if (storage != null) 
                    { 
                        storage.AddRefOnChannel(channel);
                    } 
                }
            }
        }
 
        /*internal*/ public /*virtual*/ void ReleaseOnChannelAnimations(DUCE.Channel channel)
        { 
            if (IAnimatable_HasAnimatedProperties) 
            {
                FrugalMap animatedPropertiesMap = AnimationStorage.GetAnimatedPropertiesMap(this); 

                Debug.Assert(animatedPropertiesMap.Count > 0);

                for (int i = 0; i < animatedPropertiesMap.Count; i++) 
                {
                    Int32 dpGlobalIndex; 
                    Object storageObject; 

                    animatedPropertiesMap.GetKeyValuePair(i, out dpGlobalIndex, out storageObject); 

                    DUCE.IResource storage = storageObject as DUCE.IResource;

                    if (storage != null) 
                    {
                        storage.ReleaseOnChannel(channel); 
                    } 
                }
            } 
        }

//        #region LocalProperty/CachedValue stuff
 
        /*internal*/ public static DependencyProperty RegisterProperty(
            String name, 
            Type propertyType, 
            Type ownerType,
            Object defaultValue, 
            PropertyChangedCallback changed,
            ValidateValueCallback validate,
            boolean isIndependentlyAnimated,
            CoerceValueCallback coerced) 
        {
            // Override metadata for this particular Object type. This defines 
            // the methods that will be called when property actions (setting, 
            // getting, invalidating) are taken for this specific Object type.
 
            UIPropertyMetadata propertyMetadata;

            // If this property is animated using a property resource, we create
            // AnimatablePropertyMetadata instead of UIPropertyMetadata. 

            if (isIndependentlyAnimated) 
            { 
                propertyMetadata = new IndependentlyAnimatedPropertyMetadata(defaultValue);
            } 
            else
            {
                propertyMetadata = new UIPropertyMetadata(defaultValue);
            } 

            propertyMetadata.PropertyChangedCallback = changed; 
 
            if (coerced != null)
            { 
                propertyMetadata.CoerceValueCallback = coerced;
            }

            // Register property with passed in default metadata.  The type of 
            // defaultMetadata will determine whether this property is animatable.
            DependencyProperty dp = DependencyProperty.Register( 
                name, 
                propertyType,
                ownerType, 
                propertyMetadata,
                validate);

            return dp; 
        }
 
        // Helpers for addref and release of local properties.  Subclasses can provide 
        // overloads.
        /*internal*/ public void AddRefResource(DUCE.IResource resource, DUCE.Channel channel) 
        {
            if (resource != null)
            {
                resource.AddRefOnChannel(channel); 
            }
        } 
 
        /*internal*/ public void ReleaseResource(DUCE.IResource resource, DUCE.Channel channel)
        { 
            if (resource != null)
            {
                resource.ReleaseOnChannel(channel);
            } 
        }
 
//        #endregion LocalProperty/CachedValue stuff 

//        #endregion 

//        #region Protected

        /// <summary> 
        /// An Animatable will return false from this method if there are any Clocks
        /// animating any of its properties. If the Animatable has persistent animations 
        /// specified, but all of the Clocks have been removed, it may still return 
        /// true from this method if the Timelines themselves can be frozen.
        /// </summary> 
        /// <param name="isChecking">
        /// True if the Freezable should actually Freeze itself; false if
        /// the Freezable should simply return whether it can be frozen.</param>
        /// <returns>True if this Object can be frozen; otherwise false.</returns> 
        protected /*override*/ boolean FreezeCore(boolean isChecking)
        { 
            if (IAnimatable_HasAnimatedProperties) 
            {
//                if (TraceFreezable.IsEnabled) 
//                {
//                    TraceFreezable.Trace(
//                        TraceEventType.Warning,
//                        TraceFreezable.UnableToFreezeAnimatedProperties, 
//                        this);
//                } 
 
                return false;
            } 

            return super.FreezeCore(isChecking);
        }
 
//        #endregion
 
//        #region IResource 

        /// <summary> 
        /// Derived classes implement this function.
        /// </summary>
        DUCE.ResourceHandle DUCE.IResource.AddRefOnChannel(DUCE.Channel channel)
        { 
            // Just return null instead of throwing an exception, since some
            // derived classes like BitmapEffect do their own addref/release. 
            return DUCE.ResourceHandle.Null; 
        }
 
        /// <summary>
        /// Derived classes implement this function.
        /// </summary>
        void DUCE.IResource.ReleaseOnChannel(DUCE.Channel channel) 
        {
            // Just return instead of throwing an exception, since some 
            // derived classes like BitmapEffect do their own addref/release. 
        }
 
        /// <summary>
        /// Derived classes implement this function.
        /// </summary>
        DUCE.ResourceHandle DUCE.IResource.GetHandle(DUCE.Channel channel) 
        {
            // Just return null instead of throwing an exception, since some 
            // derived classes like BitmapEffect do their own addref/release. 
            return DUCE.ResourceHandle.Null;
        } 

        /// <summary>
        /// Derived classes implement this function.
        /// </summary> 
        int DUCE.IResource.GetChannelCount()
        { 
            return 0; 
        }
 
        /// <summary>
        /// Derived classes implement this function.
        /// </summary>
        DUCE.Channel DUCE.IResource.GetChannel(int index) 
        {
            return null; 
        } 

        /// <summary> 
        /// This is only implemented by Visual and Visual3D.
        /// </summary>
        DUCE.ResourceHandle DUCE.IResource.Get3DHandle(DUCE.Channel channel)
        { 
            throw new NotImplementedException();
        } 
 
        /// <summary>
        /// This is only implemented by Visual and Visual3D. 
        /// </summary>
        void DUCE.IResource.RemoveChildFromParent(DUCE.IResource parent, DUCE.Channel channel)
        {
            throw new NotImplementedException(); 
        }
 
//        #endregion 

 
//        #region Internal


        /*internal*/ public DUCE.ResourceHandle GetAnimationResourceHandle(DependencyProperty dp, DUCE.Channel channel) 
        {
            if (channel != null && IAnimatable_HasAnimatedProperties) 
            { 
                return IndependentAnimationStorage.GetResourceHandle(this, dp, channel);
            } 
            else
            {
                return DUCE.ResourceHandle.Null;
            } 
        }
 
        /// <summary> 
        /// Returns a WeakReference to this Animatable that can be used by
        /// anyone who needs one. 
        /// </summary>
        /// <remarks>
        /// The WeakReference isn't created or stored until this method is
        /// called. 
        /// </remarks>
        /// <returns>A WeakReference to this Animtable.</returns> 
        /*internal*/ public WeakReference GetWeakReference() 
        {
            Object reference = StoredWeakReferenceField.GetValue(this); 

            if (reference == null)
            {
                reference = new WeakReference(this); 

                StoredWeakReferenceField.SetValue(this, (WeakReference)reference); 
            } 

            Debug.Assert(reference instanceof WeakReference); 

            return (WeakReference)reference;
        }
 
        /// <summary>
        /// IsBaseValueDefault returns true if there is no local value specified for this DP. 
        /// </summary> 
        /// <param name="dp">The property for which the local value is checked.</param>
        /*internal*/ public boolean IsBaseValueDefault(DependencyProperty dp) 
        {
            return ReadLocalValue(dp) == DependencyProperty.UnsetValue;
        }
 
        /// <summary>
        /// <para>Every time something changes, we don't want to send resource 
        /// updates to the UCE, we only really want to do it once per UIThread 
        /// render.</para>
        /// <para>Calling this will make sure that a resource update request 
        /// is registered with the MediaContext.</para>
        /// <para>If this Object doesn't have context affinity, it's unlikely
        /// that resource update requests would ever be made, however if they
        /// are the request will happen immediately.</para> 
        /// </summary>
        /*internal*/ public void RegisterForAsyncUpdateResource() 
        { 
            DUCE.IResource resource = this as DUCE.IResource;
 
            if (resource != null)
            {
                if ((Dispatcher != null) && Animatable_IsResourceInvalidationNecessary)
                { 
                    MediaContext mediaContext = MediaContext.From(Dispatcher);
 
                    // 
                    // Only register for a deferred resource update if this
                    // is actually on the channel. 
                    //
                    if (!resource.GetHandle(mediaContext.Channel).IsNull)
                    {
 
                        // Add this handler to this event means that the handler will be
                        // called on the next UIThread render for this Dispatcher. 
                        mediaContext.ResourcesUpdated += new MediaContext.ResourcesUpdatedHandler(UpdateResource); 
                        Animatable_IsResourceInvalidationNecessary = false;
                    } 
                }
            }
        }
 
        /// <summary>
        /// UpdateResource - this implements the prototype required by ResourcesUpdatedHandler 
        /// The method which implements this prototype is also often called in situations where 
        /// the resource is known to be "on channel" - in those cases, "true" is passed for the second
        /// parameter (allowing the implementation to skip the check). 
        /// </summary>
        /*internal*/ public /*virtual*/ void UpdateResource(DUCE.Channel channel, boolean skipOnChannelCheck)
        {
            Animatable_IsResourceInvalidationNecessary = true; 
        }
 
        /// <summary> 
        /// WritePreamble for objects such as AnimationCollection and
        /// TimelineCollection which modify an Animatable from the outside. 
        /// </summary>
        /*internal*/ public void InternalWritePreamble()
        {
            WritePreamble(); 
        }
 
//        #endregion 

//        #region Private 

        /// <summary>
        /// We use this property to store the a WeakReference to this Animatable
        /// that can be used by anyone who needs a WeakReference.  It won't be 
        /// created until its requested using the GetWeakReference method.
        /// </summary> 
        private static final UncommonField<WeakReference> StoredWeakReferenceField 
            = new UncommonField<WeakReference>();
 
        /// <summary>
        /// This method is used by TypeDescriptor to determine if this property should
        /// be serialized.
        /// </summary> 
//        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        public static boolean ShouldSerializeStoredWeakReference(DependencyObject target) 
        { 
            return false;
        } 

//        #endregion
    }