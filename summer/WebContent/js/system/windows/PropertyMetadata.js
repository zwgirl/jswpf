/**
 * Checked 12-13
 * PropertyMetadata
 */
define(["dojo/_base/declare", 
        "windows/DependencyProperty" ,"internal/DefaultValueFactory",
        "system/Type", "windows/UncommonField", "windows/FreezeValueCallback"
        ], function(declare, 
        		DependencyProperty, DefaultValueFactory,
        		Type, UncommonField, FreezeValueCallback){
	
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
    
	var PropertyMetadata = declare("PropertyMetadata", null,{
		constructor:function(){
//	        private object _defaultValue;
//	        private PropertyChangedCallback _propertyChangedCallback; 
//	        private CoerceValueCallback _coerceValueCallback; 
//	        private FreezeValueCallback _freezeValueCallback;
	        // PropertyMetadata, UIPropertyMetadata, and FrameworkPropertyMetadata.
//	        internal MetadataFlags 
	        this._flags = 0;
		},
		  /// <summary>
		  ///     Type metadata construction 
		  /// </summary>
//		  public 
		Init:function()
		{
			this.DefaultValue = null;
			this.PropertyChangedCallback = null;
			this.CoerceValueCallback = null;
		},
		
		  /// <summary> 
		  ///     Type metadata construction 
		  /// </summary>
		  /// <param name="defaultValue">Default value of property</param> 
//		  public 
		  InitWithDefaultValue:function(/*object*/ defaultValue)
		  {
			  this.DefaultValue = defaultValue;
		  },
		
		  /// <summary> 
		  ///     Type meta construction 
		  /// </summary>
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//		  public 
		  InitWithPCCB:function(/*PropertyChangedCallback*/ propertyChangedCallback)
		  {
			  this.PropertyChangedCallback = propertyChangedCallback;
		  },
		
		  /// <summary> 
		  ///     Type meta construction 
		  /// </summary>
		  /// <param name="defaultValue">Default value of property</param> 
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//		  public 
		  InitWithDVandPCCB:function(/*object*/ defaultValue,
		                          /*PropertyChangedCallback*/ propertyChangedCallback)
		  { 
			  this.DefaultValue = defaultValue;
			  this.PropertyChangedCallback = propertyChangedCallback;
		  },
		
		  /// <summary> 
		  ///     Type meta construction
		  /// </summary>
		  /// <param name="defaultValue">Default value of property</param>
		  /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
		  /// <param name="coerceValueCallback">Called on update of value</param>
//		  public 
		  InitWithDVandPCCBandCVCB:function(/*object*/ defaultValue, 
		                          /*PropertyChangedCallback*/ propertyChangedCallback, 
		                          /*CoerceValueCallback*/ coerceValueCallback)
		  { 
			  this.DefaultValue = defaultValue;
			  this.PropertyChangedCallback = propertyChangedCallback;
			  this.CoerceValueCallback = coerceValueCallback;
		  },
		
        //
        /// <summary>
        /// GetDefaultValue returns the default value for a given owner and property. 
        /// If the default value is a DefaultValueFactory it will instantiate and cache
        /// the default value on the object.  It must never return an unfrozen default
        /// value if the owner is a frozen Freezable.
        /// </summary> 
        /// <param name="owner"></param>
        /// <param name="property"></param> 
        /// <returns></returns> 
        GetDefaultValue : function(/*DependencyObject*/ owner, /*DependencyProperty*/ property) 
        {
//            Debug.Assert(owner != null && property != null,
//                "Caller must provide owner and property or this method will throw in the event of a cache miss.");
 
            // If we are not using a DefaultValueFactory (common case)
            // just return _defaultValue 
            /*DefaultValueFactory*/var defaultFactory = this._defaultValue instanceof DefaultValueFactory ? this._defaultValue : null; 
            if (defaultFactory == null)
            { 
                return this._defaultValue;
            }

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
            var result = this.GetCachedDefaultValue(owner, property);
 
            if (result != DependencyProperty.UnsetValue)
            { 
                // When sealing a DO we toss out all the cached values (see DependencyObject.Seal()). 
                // We technically only need to throw out cached values created via the
                // FreezableDefaultValueFactory, but it's more consistent this way. 
//                Debug.Assert(!owner.IsSealed,
//                    "If the owner is Sealed we should not have a cached default value");

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
 
        // Because the frugalmap is going to be stored in an uncommon field, it would get boxed
        // to avoid this boxing, skip the struct and go straight for the class contained by the 
        // struct.  Given the simplicity of this scenario, we can get away with this. 
        GetCachedDefaultValue : function(/*DependencyObject*/ owner, /*DependencyProperty*/ property)
        { 
            /*FrugalMapBase*/var map = PropertyMetadata._defaultValueFactoryCache.GetValue(owner);

            if (map == null)
            { 
                return DependencyProperty.UnsetValue;
            } 
 
            return map.Search(property.GlobalIndex);
        },

        SetCachedDefaultValue : function(/*DependencyObject*/ owner, /*DependencyProperty*/ property, /*object*/ value)
        {
            /*FrugalMapBase*/var map = PropertyMetadata._defaultValueFactoryCache.GetValue(owner); 

            if (map == null) 
            { 
                map = new SingleObjectMap();
                PropertyMetadata._defaultValueFactoryCache.SetValue(owner, map); 
            }
            else if (!(map instanceof HashObjectMap))
            {
                /*FrugalMapBase*/var newMap = new HashObjectMap(); 
                map.Promote(newMap);
                map = newMap; 
                PropertyMetadata._defaultValueFactoryCache.SetValue(owner, map); 
            }
 
            map.InsertEntry(property.GlobalIndex, value);
        },

        /// <summary> 
        ///     This method causes the DefaultValue cache to be cleared ensuring
        ///     that CreateDefaultValue will be called next time this metadata 
        ///     is asked to participate in the DefaultValue factory pattern. 
        ///
        ///     This is internal so it can be accessed by subclasses of 
        ///     DefaultValueFactory.
        /// </summary>
        ClearCachedDefaultValue : function(/*DependencyObject*/ owner, /*DependencyProperty*/ property)
        { 
            /*FrugalMapBase*/var map = PropertyMetadata._defaultValueFactoryCache.GetValue(owner);
            if (map.Count == 1) 
            { 
            	PropertyMetadata._defaultValueFactoryCache.ClearValue(owner);
            } 
            else
            {
                map.RemoveEntry(property.GlobalIndex);
            } 
        },

        /// <summary> 
        ///     Whether the DefaultValue was explictly set - needed to know if the
        /// value should be used in Register. 
        /// </summary> 
        DefaultValueWasSet : function()
        { 
            return this.IsModified(MetadataFlags.DefaultValueModifiedID);
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
            var newMetadata = this.CreateInstance(); 
            newMetadata.InvokeMerge(this, dp); 
            return newMetadata;
        },

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
                throw new Error("ArgumentNullException(baseMetadata)");
            } 
 
            if (this.Sealed)
            { 
                throw new Error("InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)");
            }

            // Merge source metadata into this 

            // Take source default if this default was never set 
            if (!this.IsModified(MetadataFlags.DefaultValueModifiedID)) 
            {
            	this._defaultValue = baseMetadata.DefaultValue; 
            }

            if (baseMetadata.PropertyChangedCallback != null)
            { 
                // All delegates are MulticastDelegate.  Non-multicast "Delegate"
                //  was designed and is documented in MSDN.  But for all practical 
                //  purposes, it was actually cut before v1.0 of the CLR shipped. 

                // Build the handler list such that handlers added 
                // via OverrideMetadata are called last (base invocation first)
                /*Delegate[]*/
//            	var handlers = baseMetadata.PropertyChangedCallback.GetInvocationList();
//                if (handlers.length > 0)
//                { 
//                    /*PropertyChangedCallback*/
//                	var headHandler = /*(PropertyChangedCallback)*/handlers[0];
//                    for (var i = 1; i < handlers.length; i++) 
//                    { 
//                        headHandler.Combine( /*(PropertyChangedCallback)*/handlers[i]);
//                    } 
//                    headHandler.Combine(this._propertyChangedCallback);
//                    this._propertyChangedCallback = headHandler;
//                }
            	
            	
                this._propertyChangedCallback = baseMetadata.PropertyChangedCallback.Combine(this._propertyChangedCallback);;
            } 
 
            if (this._coerceValueCallback == null)
            { 
            	this._coerceValueCallback = baseMetadata.CoerceValueCallback;
            }

            // FreezeValueCallback not combined 
            if (this._freezeValueCallback == null)
            { 
            	this._freezeValueCallback = baseMetadata.FreezeValueCallback; 
            }
        },
        
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
 

        Seal:function(/*DependencyProperty*/ dp, /*Type*/ targetType) 
        { 
            // CALLBACK
            this.OnApply(dp, targetType); 

            this.Sealed = true;
        },
        
        
        SetModified:function(/*MetadataFlags*/ id) { this._flags |= id; },
        IsModified:function(/*MetadataFlags*/ id) { return (id & this._flags) != 0; }, 
 
        /// <summary>
        ///     Write a flag value 
        /// </summary>
        WriteFlag:function(/*MetadataFlags*/ id, /*bool*/ value)
        { 
            if (value)
            { 
                this._flags |= id; 
            }
            else 
            {
            	this._flags &= (~id);
            }
        },

        /// <summary> 
        ///     Read a flag value 
        /// </summary>
        ReadFlag:function(/*MetadataFlags*/ id) { return (id & this._flags) != 0; }

	});
	
//  private static FreezeValueCallback 
    var _defaultFreezeValueCallback = new FreezeValueCallback(null, DefaultFreezeValueCallback); 
	
	Object.defineProperties(PropertyMetadata.prototype, {

        /// <summary> 
        ///     Default value of property
        /// </summary>
        DefaultValue:
        { 
            get:function()
            { 
                var defaultFactory = this._defaultValue instanceof DefaultValueFactory ? this._defaultValue : null; 
                if (defaultFactory == null)
                { 
                    return this._defaultValue;
                }
                else
                { 
                    return defaultFactory.DefaultValue;
                } 
            }, 

            set:function(value) 
            {
                if (this.Sealed)
                {
                    throw new Error("InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)"); 
                }
 
                if (value == Type.UnsetValue) 
                {
                    throw new Error("ArgumentException(SR.Get(SRID.DefaultValueMayNotBeUnset)"); 
                }

                this._defaultValue = value;
 
                this.SetModified(MetadataFlags.DefaultValueModifiedID);
            } 
        },

        // 
        /// <summary>
        ///     Returns true if the default value is a DefaultValueFactory 
        /// </summary>
        UsingDefaultValueFactory: 
        { 
            get:function()
            { 
                return this._defaultValue instanceof DefaultValueFactory;
            }
        },
        /// <summary> 
        ///     Property changed callback
        /// </summary> 
        PropertyChangedCallback:
        {
            get:function() { return this._propertyChangedCallback; }, 
            set:function(value)
            {
                if (this.Sealed)
                { 
                    throw new Error("InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)");
                } 
 
                this._propertyChangedCallback = value;
            } 
        },

        /// <summary>
        ///     Specialized callback invoked upon a call to UpdateValue 
        /// </summary>
        /// <remarks> 
        ///     Used for "coercing" effective property value without actually subclassing 
        /// </remarks>
        CoerceValueCallback:
        {
            get:function() { return this._coerceValueCallback; },
            set:function(value)
            { 
                if (this.Sealed)
                { 
                    throw new Error("InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)"); 
                }
 
                this._coerceValueCallback = value;
            }
        },
 

        /// <summary> 
        ///     Specialized callback for remote storage of value for read-only properties 
        /// </summary>
        /// <remarks> 
        ///     This is used exclusively by FrameworkElement.ActualWidth and ActualHeight to save 48 bytes
        ///     of state per FrameworkElement.
        /// </remarks>
        GetReadOnlyValueCallback:
        { 
            get:function()
            {
                return null; 
            }
        },

        /// <summary> 
        ///     Specialized callback invoked for each property when a Freezable
        ///     object is frozen. 
        /// </summary> 
        /// <remarks>
        ///     Used to provide specialized behavior when freezing an object 
        ///     that a property has been set on.  This callback can be used to
        ///     decide whether to do a "deep" freeze, a "shallow" freeze, to
        ///     fail the freeze attempt, etc.
        /// </remarks> 
        FreezeValueCallback:
        { 
            get:function()
            { 
                if(this._freezeValueCallback != null)
                {
                    return this._freezeValueCallback;
                } 
                else
                { 
                    return _defaultFreezeValueCallback; 
                }
            }, 

            set:function(value)
            {
                if (this.Sealed) 
                {
                    throw new Error("InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)"); 
                } 

                this._freezeValueCallback = value; 
            }
        },
        
      /// <summary>
        ///     Determines if the metadata has been applied to a property resulting 
        ///     in the sealing (immutability) of the instance 
        /// </summary>
        IsSealed: 
        {
            get:function() { return this.Sealed; }
        },
        
        IsDefaultValueModified: { get:function() { return this.IsModified(MetadataFlags.DefaultValueModifiedID); } },
        
        IsInherited: 
        {
            get:function() { return (MetadataFlags.Inherited & this._flags) != 0; }, 
            set:function(value)
            {
                if (value)
                { 
                	this._flags |= MetadataFlags.Inherited;
                } 
                else 
                {
                	this._flags &= (~MetadataFlags.Inherited); 
                }
            }
        },
        
        Sealed:
        { 
            get:function() { return this.ReadFlag(MetadataFlags.SealedID); },
            set:function(value) { this.WriteFlag(MetadataFlags.SealedID, value); } 
        }

	});
	
	Object.defineProperties(PropertyMetadata, {
//	    private static readonly UncommonField<FrugalMapBase> 
	    _defaultValueFactoryCache:
	    {
	    	get:function(){
	    		if(PropertyMetadata.__defaultValueFactoryCache === undefined){
	    			PropertyMetadata.__defaultValueFactoryCache = new UncommonField/*<FrugalMapBase>*/();
	    		}
	    		
	    		return PropertyMetadata.__defaultValueFactoryCache;
	    	}
	    }
	    	
	});
	
	 
	PropertyMetadata.PromoteAllCachedDefaultValues = function(/*DependencyObject*/ owner) 
    {
        /*FrugalMapBase*/var map = PropertyMetadata._defaultValueFactoryCache.GetValue(owner); 

        if (map != null)
        {
            // Iterate through all the items in the map (each representing a DP) 
            // and promote them to locally-set.
            map.Iterate(null, this._promotionCallback); 
        } 
    };

    /// <summary>
    /// Removes all cached default values on an object.  It iterates though
    /// each one and, if the cached default is a Freezable, removes its
    /// Changed event handlers. This is called by DependencyObject.Seal() 
    /// for Freezable type owners.
    /// </summary> 
    /// <param name="owner"></param> 
	PropertyMetadata.RemoveAllCachedDefaultValues = function(/*Freezable*/ owner)
    { 
        /*FrugalMapBase*/var map = PropertyMetadata._defaultValueFactoryCache.GetValue(owner);

        if (map != null)
        { 
            // Iterate through all the items in the map (each representing a DP)
            // and remove the promotion handlers 
            map.Iterate(null, this._removalCallback); 

            // Now that they're all clear remove the map. 
            PropertyMetadata._defaultValueFactoryCache.ClearValue(owner);
        }
    };

    /// <summary> 
    /// Called once per iteration through the FrugalMap containing all cached default values 
    /// for a given DependencyObject. This method removes the promotion handlers on each cached
    /// default and freezes it. 
    /// </summary>
    /// <param name="list"></param>
    /// <param name="key">The DP's global index</param>
    /// <param name="value">The cached default</param> 
    PropertyMetadata.DefaultValueCacheRemovalCallback = function(/*ArrayList*/ list, /*int*/ key, /*object*/ value)
    { 
    	/*Freezable*/ var cachedDefault = value instanceof Freezable ? value : null; 

        if (cachedDefault != null) 
        {
            // Freeze fires the Changed event so we need to clear off the handlers before
            // calling it.  Otherwise the promoter would run and attempt to set the
            // cached default as a local value. 
            cachedDefault.ClearContextAndHandlers();
            cachedDefault.Freeze(); 
        } 
    };

    /// <summary>
    /// Called once per iteration through the FrugalMap containing all cached default values 
    /// for a given DependencyObject. This method promotes each of the defaults to locally-set.
    /// </summary> 
    /// <param name="list"></param> 
    /// <param name="key">The DP's global index</param>
    /// <param name="value">The cached default</param> 
    PropertyMetadata.DefaultValueCachePromotionCallback=function(/*ArrayList*/ list, /*int*/ key, /*object*/ value)
    {
        var cachedDefault = value instanceof Freezable ? value : null;

        if (cachedDefault != null)
        { 
            // The only way to promote a cached default is to fire its Changed event. 
            cachedDefault.FireChanged();
        } 
    };

    function DefaultFreezeValueCallback( 
        /*DependencyObject*/ d,
        /*DependencyProperty*/ dp, 
        /*EntryIndex*/ entryIndex, 
        /*PropertyMetadata*/ metadata,
        /*bool*/ isChecking) 
    {
        // The expression check only needs to be done when isChecking is true
        // because if we return false here the Freeze() call will fail.
        if (isChecking) 
        {
            if (d.HasExpression(entryIndex, dp)) 
            { 
                return false; 
            }
        }

        if (!dp.IsValueType) 
        {
            var value = 
                d.GetValueEntry( 
                    entryIndex,
                    dp, 
                    metadata,
                    RequestFlags.FullyResolved).Value;

            if (value != null) 
            {
                var valueAsFreezable = value instanceof Freezable ? value : null; 

                if (valueAsFreezable != null)
                { 
                    if (!valueAsFreezable.Freeze(isChecking))
                    {
                        return false; 
                    }
                } 
                else  // not a Freezable 
                {
                    var valueAsDispatcherObject = value instanceof DispatcherObject ? value : null; 

                    if (valueAsDispatcherObject != null)
                    {
                        if (valueAsDispatcherObject.Dispatcher == null) 
                        {
                            // The property is a free-threaded DispatcherObject; since it's 
                            // already free-threaded it doesn't prevent this Freezable from 
                            // becoming free-threaded too.
                            // It is up to the creator of this type to ensure that the 
                            // DispatcherObject is actually immutable
                        }
                        else
                        { 
                            // The value of this property derives from DispatcherObject and
                            // has thread affinity; return false. 
                            return false;
                        }
                    }

                    // The property isn't a DispatcherObject.  It may be immutable (such as a string)
                    // or the user may have made it thread-safe.  It's up to the creator of the type to 
                    // do the right thing; we return true as an extensibility point. 
                }
            } 
        }

        return true;
    }

	  /// <summary>
	  ///     Type metadata construction 
	  /// </summary>
	  PropertyMetadata.Build = function()
	  {
		  return new PropertyMetadata();
	  };
	
	  /// <summary> 
	  ///     Type metadata construction 
	  /// </summary>
	  /// <param name="defaultValue">Default value of property</param> 
	  PropertyMetadata.BuildWithDefaultValue = function(/*object*/ defaultValue)
	  {
		  var result = PropertyMetadata();
		  result.DefaultValue = defaultValue;
	      return result;
	  },
	
	  /// <summary> 
	  ///     Type meta construction 
	  /// </summary>
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
	  PropertyMetadata.BuildWithPropChangeCB = function(/*PropertyChangedCallback*/ propertyChangedCallback)
	  {
		  var result = PropertyMetadata();
		  result.PropertyChangedCallback = propertyChangedCallback;
	      return result;
	  };
	
	  /// <summary> 
	  ///     Type meta construction 
	  /// </summary>
	  /// <param name="defaultValue">Default value of property</param> 
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param>
	  PropertyMetadata.BuildWithDVandPCB = function(/*object*/ defaultValue,
	                          /*PropertyChangedCallback*/ propertyChangedCallback)
	  { 
		  var result = PropertyMetadata();
		  result.DefaultValue = defaultValue;
		  result.PropertyChangedCallback = propertyChangedCallback;
	      return result;
	  };
	
	  /// <summary> 
	  ///     Type meta construction
	  /// </summary>
	  /// <param name="defaultValue">Default value of property</param>
	  /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
	  /// <param name="coerceValueCallback">Called on update of value</param>
	  PropertyMetadata.BuildWithDVandPCCBandCVCB = function(/*object*/ defaultValue, 
	                          /*PropertyChangedCallback*/ propertyChangedCallback, 
	                          /*CoerceValueCallback*/ coerceValueCallback)
	  { 
		  var result = PropertyMetadata();
		  result.DefaultValue = defaultValue;
		  result.PropertyChangedCallback = propertyChangedCallback;
		  result.CoerceValueCallback = coerceValueCallback;
		  return result;
	  };
    PropertyMetadata.Type = new Type("PropertyMetadata", PropertyMetadata, [Object.Type]);
    PropertyMetadata.MetadataFlags = MetadataFlags;  
	
	return PropertyMetadata;
});
 
        // We use this uncommon field to stash values created by our default value factory
        // in the owner's _localStore.
        
//        private static FrugalMapIterationCallback _removalCallback = new FrugalMapIterationCallback(DefaultValueCacheRemovalCallback); 
//        private static FrugalMapIterationCallback _promotionCallback = new FrugalMapIterationCallback(DefaultValueCachePromotionCallback);
