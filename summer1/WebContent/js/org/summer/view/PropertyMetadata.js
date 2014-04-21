define(["dojo/_base/declare", "dojo/_base/lang"], function(declare, lang){
	
	 var MetadataFlags =
     {
         DefaultValueModifiedID                       : 0x00000001, 
         SealedID                                     : 0x00000002,
         // Unused                                    : 0x00000004,
         // Unused                                    : 0x00000008,
         Inherited                                    : 0x00000010, 

         UI_IsAnimationProhibitedID                   : 0x00000020, // True if peer refers to an owner's animation peer property; False if Peer refers to the animation peer's owner property 

         FW_AffectsMeasureID                          : 0x00000040,
         FW_AffectsArrangeID                          : 0x00000080, 
         FW_AffectsParentMeasureID                    : 0x00000100,
         FW_AffectsParentArrangeID                    : 0x00000200,
         FW_AffectsRenderID                           : 0x00000400,
         FW_OverridesInheritanceBehaviorID            : 0x00000800, 
         FW_IsNotDataBindableID                       : 0x00001000,
         FW_BindsTwoWayByDefaultID                    : 0x00002000, 
         FW_ShouldBeJournaledID                       : 0x00004000, 
         FW_SubPropertiesDoNotAffectRenderID          : 0x00008000,
         FW_SubPropertiesDoNotAffectRenderModifiedID  : 0x00010000, 
         // Unused                                    : 0x00020000,
         // Unused                                    : 0x00040000,
         // Unused                                    : 0x00080000,
         FW_InheritsModifiedID                        : 0x00100000, 
         FW_OverridesInheritanceBehaviorModifiedID    : 0x00200000,
         // Unused                                    : 0x00400000, 
         // Unused                                    : 0x00800000, 
         FW_ShouldBeJournaledModifiedID               : 0x01000000,
         FW_UpdatesSourceOnLostFocusByDefaultID       : 0x02000000, 
         FW_DefaultUpdateSourceTriggerModifiedID      : 0x04000000,
         FW_ReadOnlyID                                : 0x08000000,
         // Unused                                    : 0x10000000,
         // Unused                                    : 0x20000000, 
         FW_DefaultUpdateSourceTriggerEnumBit1        : 0x40000000, // Must match constants used in FrameworkPropertyMetadata
         FW_DefaultUpdateSourceTriggerEnumBit2        : 0x80000000, // Must match constants used in FrameworkPropertyMetadata 
     };
	
	return declare(null, {
        constructor: function(defaultValue, propertyChangedCallback,coerceValueCallback)
        {
        	this._defaultValue=defaultValue;
        	this._propertyChangedCallback=propertyChangedCallback;
        	this._coerceValueCallback=coerceValueCallback;
        },


        get DefaultValue()
        { 
            if (this._defaultValue instanceof DefaultValueFactory) { 
                return this._defaultValue.DefaultValue;
            }
            else { 
            	return this._defaultValue;
           } 
        } ,

            set DefaultValue(value)
            {
                if (value == DependencyProperty.UnsetValue) 
                {
                    throw new Error("DefaultValueMayNotBeUnset"); 
                }

                this._defaultValue = value;
 
                SetModified(MetadataFlags.DefaultValueModifiedID);
            } ,

 
        GetDefaultValue:function(/*DependencyObject*/ owner, /*DependencyProperty*/ property) 
        {
            if (!(this._defaultValue instanceof  DefaultValueFactory))
            { 
                return this._defaultValue;
            }
            
        	var defaultFactory=_defaultValue;

            // If the owner is Sealed it must not have a cached Freezable default value, 
            // regardless of whether or not the owner is a Freezable.  The reason
            // for this is that a default created using the FreezableDefaultValueFactory 
            // will attempt to set itself as a local value if it is changed.  Since the owner 
            // is Sealed this will throw an exception.
            // 
            // The solution to this if the owner is a Freezable is to toss out all cached
            // default values when we Seal.  If the owner is not a Freezable we'll promote
            // the value to locally cached.  Either way no Sealed DO can have a cached
            // default value, so we'll return the frozen default value instead. 
            if (owner.IsSealed)
            { 
                return defaultFactory.DefaultValue; 
            }
 
            // See if we already have a valid default value that was
            // created by a prior call to GetDefaultValue.
            /*object*/ var result = this.GetCachedDefaultValue(owner, property);
 
            if (result != DependencyProperty.UnsetValue)
            { 
                // When sealing a DO we toss out all the cached values (see DependencyObject.Seal()). 
                // We technically only need to throw out cached values created via the
                // FreezableDefaultValueFactory, but it's more consistent this way. 
                Debug.Assert(!owner.IsSealed,
                    "If the owner is Sealed we should not have a cached default value");

                return result; 
            }
 
            // Otherwise we need to invoke the factory to create the DefaultValue 
            // for this property.
            result = defaultFactory.CreateDefaultValue(owner, property); 

            // Default value validation ensures that default values do not have
            // thread affinity. This is because a default value is typically
            // stored in the shared property metadata and handed out to all 
            // instances of the owning DependencyObject type.
            // 
            // DefaultValueFactory.CreateDefaultValue ensures that the default 
            // value has thread-affinity to the current thread.  We can thus
            // skip that portion of the default value validation by calling 
            // ValidateFactoryDefaultValue.

//            Debug.Assert(!(result is DispatcherObject) || ((DispatcherObject)result).Dispatcher == owner.Dispatcher);
 
            property.ValidateFactoryDefaultValue(result);
 
            // Cache the created DefaultValue so that we can consistently hand 
            // out the same default each time we are asked.
            this.SetCachedDefaultValue(owner, property, result); 

            return result;
        },
 
         /// <summary> 
        ///     Whether the DefaultValue was explictly set - needed to know if the
        /// value should be used in Register. 
        /// </summary> 
        DefaultValueWasSet:function()
        { 
            return this.IsModified(MetadataFlags.DefaultValueModifiedID);
        },

        /// <summary> 
        ///     Property changed callback
        /// </summary> 
        get PropertyChangedCallback() 
        {
            this._propertyChangedCallback; 
         },
         
        set PropertyChangedCallback(value)
        {
            this._propertyChangedCallback = value;
        },

        /// <summary>
        ///     Specialized callback invoked upon a call to UpdateValue 
        /// </summary>
        /// <remarks> 
        ///     Used for "coercing" effective property value without actually subclassing 
        /// </remarks>
        get CoerceValueCallback() 
        {
        	return _coerceValueCallback;
        },
        
        set CoerceValueCallback(value)
        { 
            this._coerceValueCallback = value;
        },
 
 
        /// <summary>
        ///     Creates a new instance of this property metadata.  This method is used 
        ///     when metadata needs to be cloned.  After CreateInstance is called the
        ///     framework will call Merge to merge metadata into the new instance.
        ///     Deriving classes must override this and return a new instance of
        ///     themselves. 
        /// </summary>
        CreateInstance:function() { 
            return new PropertyMetadata(); 
        },
 
        //
        // Returns a copy of this property metadata by calling CreateInstance
        // and then Merge
        // 
        Copy:function(/*DependencyProperty*/ dp) {
            var newMetadata = CreateInstance(); 
            newMetadata.InvokeMerge(this, dp); 
            return newMetadata;
        } ,

        /// <summary>
        ///     Merge set source state into this
        /// </summary> 
        /// <remarks>
        ///     Used when overriding metadata 
        /// </remarks> 
        /// <param name="baseMetadata">Base metadata to merge</param>
        /// <param name="dp">DependencyProperty that this metadata is being applied to</param> 
        Merge:function(/*PropertyMetadata*/ baseMetadata, /*DependencyProperty*/ dp)
        {
            if (baseMetadata == null)
            { 
                throw new ArgumentNullException("baseMetadata");
            } 
 
            if (Sealed)
            { 
                throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
            }

            // Merge source metadata into this 

            // Take source default if this default was never set 
            if (!IsModified(MetadataFlags.DefaultValueModifiedID)) 
            {
                _defaultValue = baseMetadata.DefaultValue; 
            }

            if (baseMetadata.PropertyChangedCallback != null)
            { 
                // All delegates are MulticastDelegate.  Non-multicast "Delegate"
                //  was designed and is documented in MSDN.  But for all practical 
                //  purposes, it was actually cut before v1.0 of the CLR shipped. 

                // Build the handler list such that handlers added 
                // via OverrideMetadata are called last (base invocation first)
                /*Delegate[] */handlers = baseMetadata.PropertyChangedCallback.GetInvocationList();
                if (handlers.Length > 0)
                { 
                    /*PropertyChangedCallback*/ headHandler = /*(PropertyChangedCallback)*/handlers[0];
                    for (/*int*/ var i = 1; i < handlers.Length; i++) 
                    { 
                        headHandler += (PropertyChangedCallback)handlers[i];
                    } 
                    headHandler += this._propertyChangedCallback;
                    this._propertyChangedCallback = headHandler;
                }
            } 

// 
 
            if (this._coerceValueCallback == null)
            { 
            	this._coerceValueCallback = baseMetadata.CoerceValueCallback;
            }

            // FreezeValueCallback not combined 
            if (this._freezeValueCallback == null)
            { 
            	this._freezeValueCallback = baseMetadata.FreezeValueCallback; 
            }
        } ,

        InvokeMerge:function(/*PropertyMetadata*/ baseMetadata, /*DependencyProperty*/ dp)
        {
            this.Merge(baseMetadata, dp); 
        },
 
 
        /// <summary>
        ///     Notification that this metadata has been applied to a property 
        ///     and the metadata is being sealed
        /// </summary>
        /// <remarks>
        ///     Normally, any mutability of the data structure should be marked 
        ///     as immutable at this point
        /// </remarks> 
        /// <param name="dp">DependencyProperty</param> 
        /// <param name="targetType">Type associating metadata (null if default metadata)</param>
        OnApply:function(/*DependencyProperty*/ dp, /*Type*/ targetType) 
        {
        },
 
        IsDefaultValueModified:function() { return IsModified(MetadataFlags.DefaultValueModifiedID); },
 
        IsInherited :function(){
        	return (MetadataFlags.Inherited & _flags) != 0;
        },
//        
// 
//        private object _defaultValue;
//        private PropertyChangedCallback _propertyChangedCallback; 
//        private CoerceValueCallback _coerceValueCallback; 
//        private FreezeValueCallback _freezeValueCallback;
// 
//        //


 

//        [FriendAccessAllowed] // Built into Base, also used by Core and Framework. 
       

 
        // PropertyMetadata, UIPropertyMetadata, and FrameworkPropertyMetadata.
//        [FriendAccessAllowed] // Built into Base, also used by Core and Framework.
//        internal MetadataFlags _flags;
 
        SetModified : function(/*MetadataFlags*/ id) { _flags |= id; },
        IsModified : function(/*MetadataFlags*/ id) { return (id & _flags) != 0; } ,
 
        /// <summary>
        ///     Write a flag value 
        /// </summary>
//        [FriendAccessAllowed] // Built into Base, also used by Core and Framework.
        WriteFlag : function(/*MetadataFlags*/ id, /*boolean*/ value)
        { 
            if (value)
            { 
                _flags |= id; 
            }
            else 
            {
                _flags &= (~id);
            }
        } ,

        /// <summary> 
        ///     Read a flag value 
        /// </summary>
//        [FriendAccessAllowed] // Built into Base, also used by Core and Framework. 
        /*boolean*/ ReadFlag : function(/*MetadataFlags*/ id) { return (id & _flags) != 0; },

         get Sealed(){ return ReadFlag(MetadataFlags.SealedID); } ,
         set Sealed(value){ WriteFlag(MetadataFlags.SealedID, value); } ,
 
        // We use this uncommon field to stash values created by our default value factory
        // in the owner's _localStore.
        /*private static readonly UncommonField<FrugalMapBase> _*/defaultValueFactoryCache : new UncommonField/*<FrugalMapBase>*/(),
        /*private static FrugalMapIterationCallback */_removalCallback : new FrugalMapIterationCallback(DefaultValueCacheRemovalCallback),
        /*private static FrugalMapIterationCallback*/ _promotionCallback : new FrugalMapIterationCallback(DefaultValueCachePromotionCallback)
    } 
 
    /// <summary>
    ///     GetReadOnlyValueCallback -- a very specialized callback that allows storage for read-only properties 
    ///     to be managed outside of the effective value store on a DO.  This optimization is restricted to read-only
    ///     properties because read-only properties can only have a value explicitly set by the keeper of the key, so
    ///     it eliminates the possibility of a self-managed store missing modifiers such as expressions, coercion,
    ///     and animation. 
    /// </summary>
//    [FriendAccessAllowed] // Built into Base, also used by Framework. 
//    internal delegate object GetReadOnlyValueCallback(/*DependencyObject*/ d, out /*BaseValueSourceInternal*/ source); 
});
	});