/**
 * Animatable
 */

define(["dojo/_base/declare", "system/Type", "windows/Freezable", "media/IAnimatable"], 
		function(declare, Type, Freezable, IAnimatable){
	var Animatable = declare("Animatable", [Freezable, IAnimatable],{
		constructor:function(/*int*/ index, /*boolean*/ found){

		}
	});
	
	Object.defineProperties(Animatable.prototype,{
		  

	});
	
	Object.defineProperties(Animatable,{
		  

	});
	
	Animatable.Type = new Type("Animatable", Animatable, [Freezable.Type, IAnimatable.Type]);
	return Animatable;
});

//------------------------------------------------------------------------------ 
//Microsoft Avalon
//Copyright (c) Microsoft Corporation, 2003
//
//File: Animatable.cs 
//-----------------------------------------------------------------------------

//Allow suppression of certain presharp messages 
#pragma warning disable 1634, 1691

using MS.Internal;
using MS.Utility;
using System;
using System.Collections; 
using System.Collections.Generic;
using System.Diagnostics; 
using System.Windows.Threading; 
using System.Windows.Media.Composition;

using SR = MS.Internal.PresentationCore.SR;
using SRID = MS.Internal.PresentationCore.SRID;

namespace System.Windows.Media.Animation 
{
/// <summary> 
/// This class derives from Freezable and adds the ability to animate properties. 
/// </summary>
public abstract partial class Animatable : Freezable, IAnimatable, DUCE.IResource 
{
    #region Constructors

    /// <summary> 
    ///
    /// </summary> 
    protected Animatable() 
    {
    } 

    #endregion
    
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

    #region Public 

    /// <summary> 
    /// Creates a copy of this Animatable. 
    /// </summary>
    /// <returns>The copy.</returns> 
    public new Animatable Clone()
    {
        return (Animatable)base.Clone();
    } 

    internal void PropertyChanged(DependencyProperty dp) 
    { 
        AnimationStorage animationStorage = AnimationStorage.GetStorage(this, dp);
        IndependentAnimationStorage independentAnimationStorage = animationStorage as IndependentAnimationStorage; 

        // If this property is independently animated and currently has
        // animations all we need to do is update the animation resource
        // that represents this property value. Otherwise we need to invalidate 
        // and and eventually update this whole object.
        if (independentAnimationStorage != null) 
        { 
            independentAnimationStorage.InvalidateResource();
        } 
        else
        {
            RegisterForAsyncUpdateResource();
        } 
    }

    internal virtual void AddRefOnChannelAnimations(DUCE.Channel channel) 
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

    internal virtual void ReleaseOnChannelAnimations(DUCE.Channel channel)
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

    #region LocalProperty/CachedValue stuff

    internal static DependencyProperty RegisterProperty(
        string name, 
        Type propertyType, 
        Type ownerType,
        object defaultValue, 
        PropertyChangedCallback changed,
        ValidateValueCallback validate,
        bool isIndependentlyAnimated,
        CoerceValueCallback coerced) 
    {
        // Override metadata for this particular object type. This defines 
        // the methods that will be called when property actions (setting, 
        // getting, invalidating) are taken for this specific object type.

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
    internal void AddRefResource(DUCE.IResource resource, DUCE.Channel channel) 
    {
        if (resource != null)
        {
            resource.AddRefOnChannel(channel); 
        }
    } 

    internal void ReleaseResource(DUCE.IResource resource, DUCE.Channel channel)
    { 
        if (resource != null)
        {
            resource.ReleaseOnChannel(channel);
        } 
    }

    #endregion LocalProperty/CachedValue stuff 

    #endregion 

    #region Protected

    /// <summary> 
    /// An Animatable will return false from this method if there are any Clocks
    /// animating any of its properties. If the Animatable has persistent animations 
    /// specified, but all of the Clocks have been removed, it may still return 
    /// true from this method if the Timelines themselves can be frozen.
    /// </summary> 
    /// <param name="isChecking">
    /// True if the Freezable should actually Freeze itself; false if
    /// the Freezable should simply return whether it can be frozen.</param>
    /// <returns>True if this object can be frozen; otherwise false.</returns> 
    protected override bool FreezeCore(bool isChecking)
    { 
        if (IAnimatable_HasAnimatedProperties) 
        {
            if (TraceFreezable.IsEnabled) 
            {
                TraceFreezable.Trace(
                    TraceEventType.Warning,
                    TraceFreezable.UnableToFreezeAnimatedProperties, 
                    this);
            } 

            return false;
        } 

        return base.FreezeCore(isChecking);
    }

    #endregion

    #region IResource 

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

    #endregion 


    #region Internal


    internal DUCE.ResourceHandle GetAnimationResourceHandle(DependencyProperty dp, DUCE.Channel channel) 
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
    internal WeakReference GetWeakReference() 
    {
        object reference = StoredWeakReferenceField.GetValue(this); 

        if (reference == null)
        {
            reference = new WeakReference(this); 

            StoredWeakReferenceField.SetValue(this, (WeakReference)reference); 
        } 

        Debug.Assert(reference is WeakReference); 

        return (WeakReference)reference;
    }

    /// <summary>
    /// IsBaseValueDefault returns true if there is no local value specified for this DP. 
    /// </summary> 
    /// <param name="dp">The property for which the local value is checked.</param>
    internal bool IsBaseValueDefault(DependencyProperty dp) 
    {
        return ReadLocalValue(dp) == DependencyProperty.UnsetValue;
    }

    /// <summary>
    /// <para>Every time something changes, we don't want to send resource 
    /// updates to the UCE, we only really want to do it once per UIThread 
    /// render.</para>
    /// <para>Calling this will make sure that a resource update request 
    /// is registered with the MediaContext.</para>
    /// <para>If this object doesn't have context affinity, it's unlikely
    /// that resource update requests would ever be made, however if they
    /// are the request will happen immediately.</para> 
    /// </summary>
    internal void RegisterForAsyncUpdateResource() 
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
    internal virtual void UpdateResource(DUCE.Channel channel, bool skipOnChannelCheck)
    {
        Animatable_IsResourceInvalidationNecessary = true; 
    }

    /// <summary> 
    /// WritePreamble for objects such as AnimationCollection and
    /// TimelineCollection which modify an Animatable from the outside. 
    /// </summary>
    internal void InternalWritePreamble()
    {
        WritePreamble(); 
    }

    #endregion 

    #region Private 

    /// <summary>
    /// We use this property to store the a WeakReference to this Animatable
    /// that can be used by anyone who needs a WeakReference.  It won't be 
    /// created until its requested using the GetWeakReference method.
    /// </summary> 
    private static readonly UncommonField<WeakReference> StoredWeakReferenceField 
        = new UncommonField<WeakReference>();

    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should
    /// be serialized.
    /// </summary> 
    [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
    public static bool ShouldSerializeStoredWeakReference(DependencyObject target) 
    { 
        return false;
    } 

    #endregion
}
} 


