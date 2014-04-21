define(["dojo/_base/declare", "dojo/_base/lang"], function(declare, lang){
	
//    private class FromNameKey
    var FromNameKey=declare(null, {
    	constructor:function(/*String*/ name, /*Type*/ ownerType) 
        {
            this._name = name; 
            this._ownerType = ownerType; 

            this._hashCode = _name.GetHashCode() ^ _ownerType.GetHashCode(); 
        },

        UpdateNameKey:function(/*Type*/ ownerType)
        { 
            this._ownerType = ownerType;

            this._hashCode = _name.GetHashCode() ^ _ownerType.GetHashCode(); 
        },

        get HashCode()
        {
            return this._hashCode;
        } ,

        Equals:function(/*Object*/ o) 
        { 
            if ((o != null) && (o instanceof FromNameKey))
            { 
            	return (this._name.Equals(key._name) && (this._ownerType == key._ownerType));
            }
            else
            { 
                return false;
            } 
        }
    }
    );
    
    var Flags = {
	  GlobalIndexMask :                           0x0000FFFF, 
	  IsValueType 	 :	                          0x00010000,
	  IsFreezableType :                           0x00020000,
	  IsStringType      :                         0x00040000,
	  IsPotentiallyInherited :                    0x00080000, 
	  IsDefaultValueChanged :                     0x00100000,
	  IsPotentiallyUsingDefaultValueFactory :     0x00200000, 
	  IsObjectType     :                          0x00400000
	  // 0xFF800000   free bits
	};
    
  return declare(null, {

  		Register:function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, /*PropertyMetadata*/ typeMetadata, /*ValidateValueCallback*/ validateValueCallback) 
        {
            RegisterParameterValidation(name, propertyType, ownerType);

            // Register an attached property 
            var defaultMetadata = null;
            if (typeMetadata != null && typeMetadata.DefaultValueWasSet()) 
            { 
                defaultMetadata = new PropertyMetadata(typeMetadata.DefaultValue);
            } 

            var property = RegisterCommon(name, propertyType, ownerType, defaultMetadata, validateValueCallback);

            if (typeMetadata != null) 
            {
                // Apply type-specific metadata to owner type only 
                property.OverrideMetadata(ownerType, typeMetadata); 
            }
 
            return property;
        },


        RegisterReadOnly:function(
            /*String*/ name, 
            /*Type*/ propertyType, 
            /*Type*/ ownerType,
            /*PropertyMetadata*/ typeMetadata, 
            /*ValidateValueCallback*/ validateValueCallback )
        {
            this.RegisterParameterValidation(name, propertyType, ownerType);
 
            var defaultMetadata = null;
 
            if (typeMetadata != null && typeMetadata.DefaultValueWasSet()) 
            {
                defaultMetadata = new PropertyMetadata(typeMetadata.DefaultValue); 
            }
            else
            {
                defaultMetadata = this.AutoGeneratePropertyMetadata(propertyType,validateValueCallback,name,ownerType); 
            }
 
            //  We create a DependencyPropertyKey at this point with a null property 
            // and set that in the _readOnlyKey field.  This is so the property is
            // marked as requiring a key immediately.  If something fails in the 
            // initialization path, the property is still marked as needing a key.
            //  This is better than the alternative of creating and setting the key
            // later, because if that code fails the read-only property would not
            // be marked read-only.  The intent of this mildly convoluted code 
            // is so we fail securely.
            var authorizationKey = new DependencyPropertyKey(null); // No property yet, use null as placeholder. 
 
            var property = this.RegisterCommon(name, propertyType, ownerType, defaultMetadata, validateValueCallback);
 
            property._readOnlyKey = authorizationKey;

            authorizationKey.SetDependencyProperty(property);
 
            if (typeMetadata == null )
            { 
                // No metadata specified, generate one so we can specify the authorized key. 
                typeMetadata = this.AutoGeneratePropertyMetadata(propertyType,validateValueCallback,name,ownerType);
            } 
 
            // Apply type-specific metadata to owner type only
            property.OverrideMetadata(ownerType, typeMetadata, authorizationKey); 
 
            return authorizationKey;
        },

        RegisterAttachedReadOnly:function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, /*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback)
        { 
            RegisterParameterValidation(name, propertyType, ownerType);

            // Establish default metadata for all types, if none is provided
            if (defaultMetadata == null) 
            {
                defaultMetadata = this.AutoGeneratePropertyMetadata( propertyType, validateValueCallback, name, ownerType ); 
            } 

            //  We create a DependencyPropertyKey at this point with a null property 
            // and set that in the _readOnlyKey field.  This is so the property is
            // marked as requiring a key immediately.  If something fails in the
            // initialization path, the property is still marked as needing a key.
            //  This is better than the alternative of creating and setting the key 
            // later, because if that code fails the read-only property would not
            // be marked read-only.  The intent of this mildly convoluted code 
            // is so we fail securely. 
            var authorizedKey = new DependencyPropertyKey(null);
 
            var property = this.RegisterCommon( name, propertyType, ownerType, defaultMetadata, validateValueCallback);

            property._readOnlyKey = authorizedKey;
 
            authorizedKey.SetDependencyProperty(property);
 
            return authorizedKey; 
        },
 

        RegisterAttached:function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, /*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback)
        {
            RegisterParameterValidation(name, propertyType, ownerType);
 
            return RegisterCommon( name, propertyType, ownerType, defaultMetadata, validateValueCallback );
        },
 
        RegisterParameterValidation:function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType)
        { 
            if (name == null || name.length==0)
            {
                throw new Error("name may not be null or empty");
            } 

            if (ownerType == null)
            {
                throw new Error("ownerType may not be null"); 
            }
 
            if (propertyType == null) 
            {
                throw new Error("propertyType may not be null"); 
            }
        },

        RegisterCommon:function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, /*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback) 
        {
            var key = new FromNameKey(name, ownerType); 

            if (PropertyFromName.Contains(key)) 
            {
                 throw new Error(name, ownerType.Name);
            } 

            // Establish default metadata for all types, if none is provided 
            if (defaultMetadata == null) 
            {
                defaultMetadata = this.AutoGeneratePropertyMetadata( propertyType, validateValueCallback, name, ownerType ); 
            }
            else // Metadata Object is provided.
            {
                // If the defaultValue wasn't specified auto generate one 
                if (!defaultMetadata.DefaultValueWasSet())
                { 
                    defaultMetadata.DefaultValue = this.AutoGenerateDefaultValue(propertyType); 
                }
 
                this.ValidateMetadataDefaultValue( defaultMetadata, propertyType, name, validateValueCallback );
            }

            // Create property 
            var dp = new DependencyProperty(name, propertyType, ownerType, defaultMetadata, validateValueCallback);
 
            // Seal (null means being used for default metadata, calls OnApply) 
            defaultMetadata.Seal(dp, null);
 
            if (defaultMetadata.IsInherited)
            {
                dp._packedData |= Flags.IsPotentiallyInherited;
            } 

            if (defaultMetadata.UsingDefaultValueFactory) 
            { 
                dp._packedData |= Flags.IsPotentiallyUsingDefaultValueFactory;
            } 


            PropertyFromName[key] = dp; 

            return dp;
        },
 
        AutoGenerateDefaultValue:function(/*Type*/ propertyType) 
        { 
            // Default per-type metadata not provided, create
            var defaultValue = null; 

            // Auto-assigned default value
            if (propertyType.IsValueType)
            { 
                // Value-types have default-constructed type default values
                defaultValue = new propertyType(); 
            } 

            return defaultValue; 
        },

        AutoGeneratePropertyMetadata:function(/*Type*/ propertyType, /*ValidateValueCallback*/ validateValueCallback,
            /*String*/ name, /*Type*/ ownerType) 
        {
            // Default per-type metadata not provided, create 
            var defaultValue = this.AutoGenerateDefaultValue(propertyType);

            // If a validator is passed in, see if the default value makes sense.
            if ( validateValueCallback != null && 
                !this.validateValueCallback(defaultValue))
            { 
                // Didn't work - require the caller to specify one. 
                throw new Error(name, ownerType.Name);
            } 

            return new PropertyMetadata(defaultValue);
        },
 
        // Validate the default value in the given metadata
        ValidateMetadataDefaultValue:function( 
            /*PropertyMetadata*/ defaultMetadata, 
            /*Type*/ propertyType,
            /*String*/ propertyName, 
            /*ValidateValueCallback*/ validateValueCallback )
        {
            // If we are registered to use the DefaultValue factory we can
            // not validate the DefaultValue at registration time, so we 
            // early exit.
            if (defaultMetadata.UsingDefaultValueFactory) 
            { 
                return;
            } 

            this.ValidateDefaultValueCommon(defaultMetadata.DefaultValue, propertyType,
                propertyName, validateValueCallback, /*checkThreadAffinity = */ true);
        },

        // Validate the given default value, used by PropertyMetadata.GetDefaultValue() 
        // when the DefaultValue factory is used. 
        // These default values are allowed to have thread-affinity.
        ValidateFactoryDefaultValue:function(/*Object*/ defaultValue) 
        {
        	this.ValidateDefaultValueCommon(defaultValue, PropertyType, Name, ValidateValueCallback, false);
        },
 
        ValidateDefaultValueCommon:function(
            /*Object*/ defaultValue, 
            /*Type*/ propertyType, 
            /*String*/ propertyName,
            /*ValidateValueCallback*/ validateValueCallback, 
            /*boolean*/ checkThreadAffinity)
        {
            // Ensure default value is the correct type
            if (!IsValidType(defaultValue, propertyType)) 
            {
                throw new Error(propertyName); 
            } 

            // After checking for correct type, check default value against 
            //  validator (when one is given) 
            if ( validateValueCallback != null &&
                !this.validateValueCallback(defaultValue)) 
            {
                throw new Error(propertyName);
            }
        },

 
        /// <summary> 
        ///     Parameter validation for OverrideMetadata, includes code to force
        /// all base classes of "forType" to register their metadata so we know 
        /// what we are overriding.
        /// </summary>
        SetupOverrideMetadata:function(
                /*Type*/ forType, 
                /*PropertyMetadata*/ typeMetadata,
            /*DependencyObjectType*/ dType, 
            /*PropertyMetadata*/ baseMetadata ) 
        {
            if (forType == null) 
            {
                throw new Error("forType");
            }
 
            if (typeMetadata == null)
            { 
                throw new Error("typeMetadata"); 
            }
 
            if (typeMetadata.Sealed)
            {
                throw new Error(SR.Get(SRID.TypeMetadataAlreadyInUse));
            } 

            if (!typeof(DependencyObject).IsAssignableFrom(forType)) 
            { 
                throw new Error(SR.Get(SRID.TypeMustBeDependencyObjectDerived, forType.Name));
            } 

            // Ensure default value is a correct value (if it was supplied,
            // otherwise, the default value will be taken from the base metadata
            // which was already validated) 
            if (typeMetadata.IsDefaultValueModified)
            { 
                // Will throw ArgumentException if fails. 
            	this.ValidateMetadataDefaultValue( typeMetadata, PropertyType, Name, ValidateValueCallback );
            } 

            // Force all base classes to register their metadata
            dType = DependencyObjectType.FromSystemType(forType);
 
            // Get metadata for the base type
            baseMetadata = this.GetMetadata(dType.BaseType); 
 
            // Make sure overriding metadata is the same type or derived type of
            // the base metadata 
            if (!baseMetadata.GetType().IsAssignableFrom(typeMetadata.GetType()))
            {
                throw new ArgumentException(SR.Get(SRID.OverridingMetadataDoesNotMatchBaseMetadataType));
            } 
        },
 
 
        /// <summary>
        ///     Supply metadata for given type & run static constructors if needed. 
        /// </summary>
        /// <remarks>
        ///     The supplied metadata will be merged with the type's base
        ///     metadata 
        /// </remarks>
        OverrideMetadata:function(/*Type*/ forType, /*PropertyMetadata*/ typeMetadata) 
        { 
            var dType=new DependencyObjectType();
            var baseMetadata=new PropertyMetadata(); 

            this.SetupOverrideMetadata(forType, typeMetadata, dType, baseMetadata);
 
            this.ProcessOverrideMetadata(forType, typeMetadata, dType, baseMetadata);
        },

        OverrideMetadata:function(/*Type*/ forType, /*PropertyMetadata*/ typeMetadata, /*DependencyPropertyKey*/ key) 
        {
            DependencyObjectType dType;
            PropertyMetadata baseMetadata;
 
            this.SetupOverrideMetadata(forType, typeMetadata, dType, baseMetadata);
 
            if (key == null) 
            {
                throw new Error("key"); 
            }

            if (final)
            { 
                // If the property is read-only, the key must match this property
                //  and the key must match that in the base metadata. 
 
                if (key.DependencyProperty != this)
                { 
                    throw new Error(Name);
                }

                this.VerifyReadOnlyKey(key); 
            }
            else 
            { 
                throw new Error();
            } 

            // Either the property doesn't require a key, or the key match was
            //  successful.  Proceed with the metadata override.
            ProcessOverrideMetadata(forType, typeMetadata, dType, baseMetadata); 
        },

        ProcessOverrideMetadata:function(
            /*Type*/ forType,
            /*PropertyMetadata*/ typeMetadata, 
            /*DependencyObjectType*/ dType,
            /*PropertyMetadata*/ baseMetadata) 
        { 
        	if (DependencyProperty.UnsetValue == this._metadataMap[dType.Id])
            { 
                this._metadataMap[dType.Id] = typeMetadata;
            } 
            else 
            {
                throw new Error(forType.Name); 
            }

            // Merge base's metadata into this metadata 
            // CALLBACK
            typeMetadata.InvokeMerge(baseMetadata, this); 
 
            // Type metadata may no longer change (calls OnApply)
            typeMetadata.Seal(this, forType); 

            if (typeMetadata.IsInherited)
            {
            	this._packedData |= Flags.IsPotentiallyInherited; 
            }
 
            if (typeMetadata.DefaultValueWasSet() && (typeMetadata.DefaultValue != DefaultMetadata.DefaultValue)) 
            {
            	this._packedData |= Flags.IsDefaultValueChanged; 
            }

            if (typeMetadata.UsingDefaultValueFactory)
            { 
            	this._packedData |= Flags.IsPotentiallyUsingDefaultValueFactory;
            } 
        },

 
        GetDefaultValue:function(/*DependencyObjectType*/ dependencyObjectType)
        {
            if (!IsDefaultValueChanged) 
            {
                return DefaultMetadata.DefaultValue; 
            } 

            return this.GetMetadata(dependencyObjectType).DefaultValue; 
        },

        GetDefaultValueForType:function(/*Type*/ forType) 
        {
            if (!IsDefaultValueChanged) 
            { 
                return DefaultMetadata.DefaultValue;
            } 

            return this.GetMetadata(DependencyObjectType.FromSystemTypeInternal(forType)).DefaultValue;
        },
 
        GetMetadata:function(/*Type*/ forType)
        {
            if (forType != null)
            { 
                return this.GetMetadata(DependencyObjectType.FromSystemType(forType));
            } 
            throw new error("forType"); 
        },
 
        /// <summary>
        ///     Retrieve metadata for a provided DependencyObject
        /// </summary>
        /// <param name="dependencyObject">DependencyObject to get metadata</param> 
        /// <returns>Property metadata</returns>
        GetMetadata:function(/*DependencyObject*/ dependencyObject) 
        { 
            if (dependencyObject != null)
            { 
                return this.GetMetadata(dependencyObject.DependencyObjectType);
            }
            throw new Error("dependencyObject");
        } ,

        /// <summary> 
        /// Reteive metadata for a DependencyObject type described by the 
        /// given DependencyObjectType
        /// </summary> 
        //CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
        GetMetadata:function(/*DependencyObjectType*/ dependencyObjectType)
        {
            // All static constructors for this DType and all base types have already 
            // been run. If no overriden metadata was provided, then look up base types.
            // If no metadata found on base types, then return default 
 
            if (null != dependencyObjectType)
            { 
                // Do we in fact have any overrides at all?
                var index = _metadataMap.Count - 1;
                var Id;
                var value={}; 

                if (index < 0) 
                { 
                    // No overrides or it's the base class
                    return _defaultMetadata; 
                }
                else if (index == 0)
                {
                    // Only 1 override 
                    _metadataMap.GetKeyValuePair(index, Id, value);
 
                    // If there is overriden metadata, then there is a base class with 
                    // lower or equal Id of this class, or this class is already a base class
                    // of the overridden one. Therefore dependencyObjectType won't ever 
                    // become null before we exit the while loop
                    while (dependencyObjectType.Id > Id)
                    {
                        dependencyObjectType = dependencyObjectType.BaseType; 
                    }
 
                    if (Id == dependencyObjectType.Id) 
                    {
                        // Return the override 
                        return value;
                    }
                    // Return default metadata
                } 
                else
                { 
                    // We have more than 1 override for this class, so we will have to loop through 
                    // both the overrides and the class Id
                    if (0 != dependencyObjectType.Id) 
                    {
                        do
                        {
                            // Get the Id of the most derived class with overridden metadata 
                            this._metadataMap.GetKeyValuePair(index, Id, value);
                            --index; 
 
                            // If the Id of this class is less than the override, then look for an override
                            // with an equal or lower Id until we run out of overrides 
                            while ((dependencyObjectType.Id < Id) && (index >= 0))
                            {
                            	this._metadataMap.GetKeyValuePair(index, Id, value);
                                --index; 
                            }
 
                            // If there is overriden metadata, then there is a base class with 
                            // lower or equal Id of this class, or this class is already a base class
                            // of the overridden one. Therefore dependencyObjectType won't ever 
                            // become null before we exit the while loop
                            while (dependencyObjectType.Id > Id)
                            {
                                dependencyObjectType = dependencyObjectType.BaseType; 
                            }
 
                            if (Id == dependencyObjectType.Id) 
                            {
                                // Return the override 
                                return /*(PropertyMetadata)*/value;
                            }
                        }
                        while (index >= 0); 
                    }
                } 
            } 
            return _defaultMetadata;
        } ,


        /// <summary>
        ///     Associate another owner type with this property 
        /// </summary>
        /// <remarks> 
        ///     The owner type is used when resolving a property by name (<see cref="FromName"/>) 
        /// </remarks>
        /// <param name="ownerType">Additional owner type</param> 
        /// <returns>This property</returns>
        AddOwner:function(/*Type*/ ownerType)
        {
            // Forwarding 
            return this.AddOwner(ownerType, null);
        } ,
 
        /// <summary>
        ///     Associate another owner type with this property 
        /// </summary>
        /// <remarks>
        ///     The owner type is used when resolving a property by name (<see cref="FromName"/>)
        /// </remarks> 
        /// <param name="ownerType">Additional owner type</param>
        /// <param name="typeMetadata">Optional type metadata to override on owner's behalf</param> 
        /// <returns>This property</returns> 
        AddOwner:function(/*Type*/ ownerType, /*PropertyMetadata*/ typeMetadata)
        { 
            if (ownerType == null)
            {
                throw new Error("ownerType");
            } 

            // Map owner type to this property 
            // Build key 
            var key = new FromNameKey(Name, ownerType);
 
            if (this.PropertyFromName.Contains(key))
            { 
            	throw new Error(Name, ownerType.Name);
            } 

            if (typeMetadata != null) 
            {
            	this.OverrideMetadata(ownerType, typeMetadata);
            }
 

            this.PropertyFromName[key] = this;


            return this;
        } ,

 
        /// <summary> 
        ///     Name of the property
        /// </summary> 
        getName:function()
        {
        	this._name; 
        } ,

        /// <summary> 
        ///     Type of the property 
        /// </summary>
        get PropertyType()
        {
            return this._propertyType; 
        },
 
        /// <summary>
        ///     Owning type of the property 
        /// </summary> 
        get OwnerType()
        { 
            return this._ownerType; 
        },

        /// <summary> 
        ///     Default metadata for the property
        /// </summary> 
        get DefaultMetadata()
        {
            return _defaultMetadata; 
        },

        /// <summary>
        ///     Value validation callback 
        /// </summary>
        get ValidateValueCallback ()
        { 
        	this._validateValueCallback; 
        } ,

        /// <summary>
        ///     Zero-based globally unique index of the property
        /// </summary> 
        get GlobalIndex()
        { 
            return this._packedData & Flags.GlobalIndexMask; 
        },
 
        get IsObjectType()
        {
            return (this._packedData & Flags.IsObjectType) != 0;
        } ,

        get IsValueType()
        { 
            return (this._packedData & Flags.IsValueType) != 0; 
        } ,

        get IsFreezableType()
        {
            return (this._packedData & Flags.IsFreezableType) != 0; 
        },
 
        get IsStringType()
        {
            return (this._packedData & Flags.IsStringType) != 0; 
        },

        get IsPotentiallyInherited()
        { 
            return (this._packedData & Flags.IsPotentiallyInherited) != 0;
        } ,
 
        get IsDefaultValueChanged()
        { 
            return (this._packedData & Flags.IsDefaultValueChanged) != 0;
        },

        get IsPotentiallyUsingDefaultValueFactory()
        {
            return (this._packedData & Flags.IsPotentiallyUsingDefaultValueFactory) != 0; 
        } ,

        /// <summary> 
        ///     Serves as a hash function for a particular type, suitable for use in
        ///     hashing algorithms and data structures like a hash table
        /// </summary>
        /// <returns>The DependencyProperty's GlobalIndex</returns> 
        get HashCode()
        { 
            return this.GlobalIndex; 
        },
 
        /// <summary>
        ///     Used to determine if given value is appropriate for the type of the property
        /// </summary>
        /// <param name="value">Value to check</param> 
        /// <returns>true if value matches property type</returns>
        IsValidType:function(/*Object*/ value) 
        { 
            return this.IsValidType(value, PropertyType);
        } ,


        /// <summary>
        ///     Used to determine if given value is appropriate for the type of the property 
        ///     and the range of values (as specified via the ValidateValueCallback) within that type
        /// </summary> 
        /// <param name="value">Value to check</param> 
        /// <returns>true if value is appropriate</returns>
        IsValidValue:function(/*Object*/ value) 
        {
            if (!this.IsValidType(value, PropertyType))
            {
                return false; 
            }
 
            if (this.ValidateValueCallback != null) 
            {
                // CALLBACK 
                return this.ValidateValueCallback(value);
            }

            return true; 
        },
 
//        /// <summary> 
//        ///     Set/Value value disabling
//        /// </summary> 
//        public boolean final
//        {
//            get
//            { 
//                return (_readOnlyKey != null);
//            } 
//        } ,

        /// <summary> 
        ///     Returns the DependencyPropertyKey associated with this DP.
        /// </summary>
        get DependencyPropertyKey()
        { 
            return this._readOnlyKey; 
        } ,

        VerifyReadOnlyKey:function( /*DependencyPropertyKey*/ candidateKey )
        {
            if (this._readOnlyKey != candidateKey) 
            { 
                throw new Error();
            } 
        },

        /// <summary>
        ///     Internal version of IsValidValue that bypasses IsValidType check; 
        ///     Called from SetValueInternal
        /// </summary> 
        /// <param name="value">Value to check</param> 
        /// <returns>true if value is appropriate</returns>
        IsValidValueInternal:function(/*Object*/ value) 
        {
            if (this.ValidateValueCallback != null)
            {
                // CALLBACK 
                return this.ValidateValueCallback(value);
            } 
 
            return true;
        } ,

        /// <summary>
        ///     Find a property from name
        /// </summary> 
        /// <remarks>
        ///     Search includes base classes of the provided type as well 
        /// </remarks> 
        /// <param name="name">Name of the property</param>
        /// <param name="ownerType">Owner type of the property</param> 
        /// <returns>Dependency property</returns>
        FromName:function(/*String*/ name, /*Type*/ ownerType)
        { 
            var dp = null;
 
            if (name != null) 
            {
                if (ownerType != null) 
                {
                    var key = new FromNameKey(name, ownerType);

                    while ((dp == null) && (ownerType != null)) 
                    {
                        // Locate property 
                        key.UpdateNameKey(ownerType);

                        dp = /*(DependencyProperty)*/PropertyFromName[key];
 
                        ownerType = ownerType.BaseType;
                    } 
                }
                else
                {
                    throw new Error("ownerType"); 
                }
            } 
            else 
            {
                throw new Error("name"); 
            }
            return dp;
        },
 

        /// <summary> 
        ///    String representation 
        /// </summary>
        toString:function() 
        {
            return this._name;
        },
 

        IsValidType:function(/*Object*/ value, /*Type*/ propertyType) 
        { 
            if (value == null)
            { 
                // Null values are invalid for value-types
                if (propertyType.IsValueType &&
                    !(propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == NullableType))
                { 
                    return false;
                } 
            } 
            else
            { 
                // Non-null default value, ensure its the correct type
                if (!propertyType.IsInstanceOfType(value))
                {
                    return false; 
                }
            } 
 
            return true;
        } ,




        constructor:function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, /*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback)
        { 
            this._name = name;
            this._propertyType = propertyType; 
            this._ownerType = ownerType; 
            this._defaultMetadata = defaultMetadata;
            this._validateValueCallback = validateValueCallback; 

            this._packedData = this.GetUniqueGlobalIndex(ownerType, name);
 
            this.RegisteredPropertyList.Add(this); 
 
            if (propertyType.IsValueType)
            {
            	this._packedData |= Flags.IsValueType;
            } 

            if (propertyType == typeof(Object)) 
            { 
            	this._packedData |= Flags.IsObjectType;
            } 

            if (typeof(Freezable).IsAssignableFrom(propertyType))
            {
                this._packedData |= Flags.IsFreezableType; 
            }
 
            if (propertyType == typeof(String)) 
            {
            	this._packedData |= Flags.IsStringType; 
            }
        } ,


        GetUniqueGlobalIndex:function(/*Type*/ ownerType, /*String*/ name) 
        {
            return this.GlobalIndexCount++;
        } ,

        UnsetValue : new Object("DependencyProperty.UnsetValue"),
        RegisteredPropertyList:new Array(768),
        PropertyFromName:{},

 
        /// <summary> 
        ///     Returns the number of all registered properties.
        /// </summary> 
        RegisteredPropertyCount:function() {
            return this.RegisteredPropertyList.length;
        },
 
        /// <summary> 
        ///     Returns an enumeration of properties that are
        ///     currently registered. 
        ///     Synchronized (write locks, lock-free reads): Covered by DependencyProperty.Synchronized
        /// </summary>
        RegisteredProperties :function(){
        	return this.RegisteredPropertyList;
        }
        
  });
});