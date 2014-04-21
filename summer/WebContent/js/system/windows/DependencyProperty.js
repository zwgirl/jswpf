/*
 * Second check 2013-12-13
 * DependencyProperty
 * 
 */  
define(["dojo/_base/declare", "system/Type", "windows/DependencyObjectType",
        "utility/ItemStructList", "windows/PropertyMetadata",
        "windows/DependencyPropertyKey", "windows/Expression", "utility/InsertionSortMap"], 
		function(declare, Type, DependencyObjectType, 
				ItemStructList, PropertyMetadata, 
				DependencyPropertyKey, Expression, InsertionSortMap){
	
	 var Flags =
	 { 
	     GlobalIndexMask                           : 0x0000FFFF,
	     IsValueType                               : 0x00010000, 
	     IsFreezableType                           : 0x00020000,
	     IsStringType                              : 0x00040000,
	     IsPotentiallyInherited                    : 0x00080000,
	     IsDefaultValueChanged                     : 0x00100000, 
	     IsPotentiallyUsingDefaultValueFactory     : 0x00200000,
	     IsObjectType                              : 0x00400000, 
	     // 0xFF800000   free bits 
	 };
     
	var FromNameKey = declare("FromNameKey", null,{
		constructor:function(/*string*/ name, /*Type*/ ownerType){
	         this._name = name;
	         this._ownerType = ownerType; 
	
	//	             this._hashCode = _name.GetHashCode() ^ _ownerType.GetHashCode();
	         this._hashCode = this._name + "__^" +  this._ownerType.Id;
		},
		
//        public FromNameKey(string name, Type ownerType)
//        { 
//            _name = name;
//            _ownerType = ownerType; 
//
//            _hashCode = _name.GetHashCode() ^ _ownerType.GetHashCode();
//        } 
//
//        public void UpdateNameKey(Type ownerType)
//        {
//            _ownerType = ownerType; 
//
//            _hashCode = _name.GetHashCode() ^ _ownerType.GetHashCode(); 
//        } 
		
	     UpdateNameKey:function(/*Type*/ ownerType)
	     {
	         this._ownerType = ownerType; 
	
	         this._hashCode = this._name + "__^" +  this._ownerType.Id; 
	     },
	     
//	     public override int 
	     GetHashCode:function() 
         {
             return this._hashCode;
         },

//         public override bool 
	     Equals:function(/*object*/ o)
         { 
             if ((o != null) && (o instanceof FromNameKey)) 
             {
            	 return (this._name.Equals(key._name) && (this._ownerType == key._ownerType));
             }
             else
             {
                 return false; 
             }
         }, 
	     
	     toString:function(){
	    	 return this._hashCode;
	     }
	});

	// Synchronized: Covered by DependencyProperty.Synchronized
	var PropertyFromName = {}; 
	
	var DependencyProperty = declare("DependencyProperty", null, {
        constructor:function(/*string*/ name, /*Type*/ propertyType, /*Type*/ ownerType, 
        		/*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback)
        {
            this._name = name; 
            this._propertyType = propertyType;
            this._ownerType = ownerType; 
            this._defaultMetadata = defaultMetadata; 
            this._validateValueCallback = validateValueCallback;
 
            var packedData =  DependencyProperty.GetUniqueGlobalIndex(ownerType, name); 

            DependencyProperty.RegisteredPropertyList.Add(this); 

            if (propertyType.IsValueType) 
            {
                packedData |= Flags.IsValueType;
            }
 
            if (propertyType == Object.Type/*typeof(Object)*/)
            { 
                packedData |= Flags.IsObjectType; 
            }
 
//            if (typeof(Freezable).IsAssignableFrom(propertyType))
//            {
//                packedData |= Flags.IsFreezableType;
//            } 

            if (propertyType == String.Type/*typeof(String)*/) 
            { 
                packedData |= Flags.IsStringType;
            } 

            this._packedData = packedData;
            
            this._metadataMap = new InsertionSortMap(); //{};
            
//          private DependencyPropertyKey 
            this._readOnlyKey = null;
     
//            private CoerceValueCallback 
            this._designerCoerceValueCallback = null; 
        },
        
        // Validate the given default value, used by PropertyMetadata.GetDefaultValue()
        // when the DefaultValue factory is used. 
        // These default values are allowed to have thread-affinity. 
        ValidateFactoryDefaultValue:function(/*object*/ defaultValue)
        { 
            ValidateDefaultValueCommon(defaultValue, this.PropertyType, this.Name, this.ValidateValueCallback, false);
        },
        
        /// <summary> 
        ///     Parameter validation for OverrideMetadata, includes code to force 
        /// all base classes of "forType" to register their metadata so we know
        /// what we are overriding. 
        /// </summary>
        SetupOverrideMetadata:function(
                /*Type*/ forType,
                /*PropertyMetadata*/ typeMetadata, 
            /*out DependencyObjectType*/ dTypeOut,
            /*out PropertyMetadata*/ baseMetadataOut 
            ) 
        { 
            if (forType == null){ 
                throw new Error("ArgumentNullException(forType)");
            }

            if (typeMetadata == null) {
                throw new Error("ArgumentNullException(typeMetadata)"); 
            } 

            if (typeMetadata.Sealed) {
                throw new Error("ArgumentException(SR.Get(SRID.TypeMetadataAlreadyInUse)");
            }
 
//            if (!DependencyObject.Type.IsAssignableFrom(forType)) { 
//                throw new new Error("ArgumentException(SR.Get(SRID.TypeMustBeDependencyObjectDerived, forType.Name)"); 
//            }
 
            // Ensure default value is a correct value (if it was supplied,
            // otherwise, the default value will be taken from the base metadata
            // which was already validated)
            if (typeMetadata.IsDefaultValueModified) {
                // Will throw ArgumentException if fails. 
                ValidateMetadataDefaultValue( typeMetadata, this.PropertyType, this.Name, this.ValidateValueCallback ); 
            }
 
            // Force all base classes to register their metadata
            dTypeOut.dType = DependencyObjectType.FromSystemType(forType);

            // Get metadata for the base type 
            baseMetadataOut.baseMetadata = this.GetMetadata(dTypeOut.dType.BaseType);
 
            // Make sure overriding metadata is the same type or derived type of 
            // the base metadata
            if (!baseMetadataOut.baseMetadata.GetType().IsAssignableFrom(typeMetadata.GetType())) {
                throw new Error("ArgumentException(SR.Get(SRID.OverridingMetadataDoesNotMatchBaseMetadataType)");
            }
        },
        
//        /// <summary> 
//        ///     Supply metadata for given type & run static constructors if needed.
//        /// </summary> 
//        /// <remarks>
//        ///     The supplied metadata will be merged with the type's base
//        ///     metadata
//        /// </remarks> 
////        public void 
//        OverrideMetadata:function(/*Type*/ forType, /*PropertyMetadata*/ typeMetadata)
//        { 
//            var dTypeOut = {"dType" : null};
//            var baseMetadataOut = {"baseMetadata" : null};
//            this.SetupOverrideMetadata(forType, typeMetadata, /*out dType*/dTypeOut, /*out baseMetadata*/baseMetadataOut);
//            /*DependencyObjectType*/var dType = dTypeOut.dType; 
//            /*PropertyMetadata*/var baseMetadata = baseMetadataOut.baseMetadata;
//
//            if (this.ReadOnly)
//            { 
//                // Readonly and no DependencyPropertyKey - not allowed.
//                throw new InvalidOperationException(SR.Get(SRID.ReadOnlyOverrideNotAllowed, Name)); 
//            } 
//
//            this.ProcessOverrideMetadata(forType, typeMetadata, dType, baseMetadata); 
//        },
//
//        /// <summary>
//        ///     Supply metadata for a given type, overriding a property that is 
//        /// read-only.  If property is not read only, tells user to use the Plain
//        /// Jane OverrideMetadata instead. 
//        /// </summary> 
////        public void 
//        OverrideMetadata:function(/*Type*/ forType, /*PropertyMetadata*/ typeMetadata, /*DependencyPropertyKey*/ key)
//        { 
//            var dTypeOut = {"dType" : null};
//            var baseMetadataOut = {"baseMetadata" : null};
//            this.SetupOverrideMetadata(forType, typeMetadata, /*out dType*/dTypeOut, /*out baseMetadata*/baseMetadataOut);
//            /*DependencyObjectType*/var dType = dTypeOut.dType; 
//            /*PropertyMetadata*/var baseMetadata = baseMetadataOut.baseMetadata; 
//
//            if (key == null) 
//            { 
//                throw new ArgumentNullException("key");
//            } 
//
//            if (this.ReadOnly)
//            {
//                // If the property is read-only, the key must match this property 
//                //  and the key must match that in the base metadata.
// 
//                if (key.DependencyProperty != this) 
//                {
//                    throw new ArgumentException(SR.Get(SRID.ReadOnlyOverrideKeyNotAuthorized, Name)); 
//                }
//
//                this.VerifyReadOnlyKey(key);
//            } 
//            else
//            { 
//                throw new InvalidOperationException(SR.Get(SRID.PropertyNotReadOnly)); 
//            }
// 
//            // Either the property doesn't require a key, or the key match was
//            //  successful.  Proceed with the metadata override.
//            this.ProcessOverrideMetadata(forType, typeMetadata, dType, baseMetadata);
//        }, 
        
        /// <summary> 
        ///     Supply metadata for given type & run static constructors if needed.
        /// </summary> 
        /// <remarks>
        ///     The supplied metadata will be merged with the type's base
        ///     metadata
        /// </remarks> 
        OverrideMetadata:function(/*Type*/ forType, /*PropertyMetadata*/ typeMetadata, /*DependencyPropertyKey*/ key)
        { 
            var dTypeOut = {"dType" : null};
            var baseMetadataOut = {"baseMetadata" : null};
            this.SetupOverrideMetadata(forType, typeMetadata, /*out dType*/dTypeOut, /*out baseMetadata*/baseMetadataOut);
            /*DependencyObjectType*/var dType = dTypeOut.dType; 
            /*PropertyMetadata*/var baseMetadata = baseMetadataOut.baseMetadata; 
        	if(arguments.length==2){
              if (this.ReadOnly) { 
                  // Readonly and no DependencyPropertyKey - not allowed.
                  throw new Error("InvalidOperationException(SR.Get(SRID.ReadOnlyOverrideNotAllowed, Name)"); 
              } 
       
        	}else if(arguments.length==3){
       		
	            if (key == null) { 
	                throw new Error("ArgumentNullException('key')");
	            } 
	
	            if (this.ReadOnly) {
	                // If the property is read-only, the key must match this property 
	                //  and the key must match that in the base metadata.
	 
	                if (key.DependencyProperty != this) {
	                    throw new Error("ArgumentException(SR.Get(SRID.ReadOnlyOverrideKeyNotAuthorized, Name)"); 
	                }
	
	                this.VerifyReadOnlyKey(key);
	            } else { 
	                throw new Error("InvalidOperationException(SR.Get(SRID.PropertyNotReadOnly)"); 
	            }
        	}

            this.ProcessOverrideMetadata(forType, typeMetadata, dType, baseMetadata); 
        },
        
        /// <summary> 
        ///     After parameters have been validated for OverrideMetadata, this 
        /// method is called to actually update the data structures.
        /// </summary> 
        ProcessOverrideMetadata:function(
            /*Type*/ forType,
            /*PropertyMetadata*/ typeMetadata,
            /*DependencyObjectType*/ dType, 
            /*PropertyMetadata*/ baseMetadata) { 

            if (Type.UnsetValue === this._metadataMap.Get(dType.Id)) {
            	this._metadataMap.Set(dType.Id, typeMetadata); 
            }  else  { 
                throw new Error("ArgumentException(SR.Get(SRID.TypeMetadataAlreadyRegistered, forType.Name)");
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

            if (typeMetadata.DefaultValueWasSet() && (typeMetadata.DefaultValue != this.DefaultMetadata.DefaultValue)) 
            { 
            	this._packedData |= Flags.IsDefaultValueChanged;
            } 

            if (typeMetadata.UsingDefaultValueFactory)
            {
            	this._packedData |= Flags.IsPotentiallyUsingDefaultValueFactory; 
            }
        }, 

//        GetDefaultValue:function(/*DependencyObjectType*/ dependencyObjectType)
//        {
//            if (!IsDefaultValueChanged)
//            { 
//                return DefaultMetadata.DefaultValue;
//            } 
// 
//            return GetMetadata(dependencyObjectType).DefaultValue;
//        }, 
//
//        GetDefaultValue:function(/*Type*/ forType)
//        { 
//            if (!IsDefaultValueChanged)
//            { 
//                return DefaultMetadata.DefaultValue; 
//            }
// 
//            return GetMetadata(DependencyObjectType.FromSystemTypeInternal(forType)).DefaultValue;
//        },
        
        GetDefaultValue:function(/*DependencyObjectType dependencyObjectType or Type forType*/)
        {
            if (!this.IsDefaultValueChanged){ 
                return this.DefaultMetadata.DefaultValue;
            } 
            
            var dependencyObjectType = arguments[0];
            if(arguments[0] instanceof Type){
            	dependencyObjectType = DependencyObjectType.FromSystemTypeInternal(arguments[0]);
            }
 
            return this.GetMetadata(dependencyObjectType).DefaultValue;
        }, 


//        /// <summary> 
//        ///     Retrieve metadata for a provided type
//        /// </summary> 
//        /// <param name="forType">Type to get metadata</param> 
//        /// <returns>Property metadata</returns>
//        GetMetadata:function(/*Type*/ forType) 
//        {
//            if (forType != null)
//            {
//                return GetMetadata(DependencyObjectType.FromSystemType(forType)); 
//            }
//            throw new Error("ArgumentNullException('forType')"); 
//        }, 
//
//        /// <summary> 
//        ///     Retrieve metadata for a provided DependencyObject
//        /// </summary>
//        /// <param name="dependencyObject">DependencyObject to get metadata</param>
//        /// <returns>Property metadata</returns> 
//        GetMetadata:function(/*DependencyObject*/ dependencyObject)
//        { 
//            if (dependencyObject != null) 
//            {
//                return GetMetadata(dependencyObject.DependencyObjectType); 
//            }
//            throw new Error("ArgumentNullException('dependencyObject')");
//        },
// 
//        /// <summary>
//        /// Reteive metadata for a DependencyObject type described by the 
//        /// given DependencyObjectType 
//        /// </summary>
//        //CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = BuildInfo.WCP_PUBLIC_KEY_STRING)] 
//        GetMetadata:function(/*DependencyObjectType*/ dependencyObjectType)
//        {
//            // All static constructors for this DType and all base types have already
//            // been run. If no overriden metadata was provided, then look up base types. 
//            // If no metadata found on base types, then return default
// 
//            if (null != dependencyObjectType) 
//            {
//                // Do we in fact have any overrides at all? 
//                var index = this._metadataMap.Count - 1;
//                var Id;
//                var value;
// 
//                if (index < 0)
//                { 
//                    // No overrides or it's the base class 
//                    return this._defaultMetadata;
//                } 
//                else if (index == 0)
//                {
//                    // Only 1 override
//                    this._metadataMap.GetKeyValuePair(index, /*out*/ Id, /*out*/ value); 
//
//                    // If there is overriden metadata, then there is a base class with 
//                    // lower or equal Id of this class, or this class is already a base class 
//                    // of the overridden one. Therefore dependencyObjectType won't ever
//                    // become null before we exit the while loop 
//                    while (dependencyObjectType.Id > Id)
//                    {
//                        dependencyObjectType = dependencyObjectType.BaseType;
//                    } 
//
//                    if (Id == dependencyObjectType.Id) 
//                    { 
//                        // Return the override
//                        return value; 
//                    }
//                    // Return default metadata
//                }
//                else 
//                {
//                    // We have more than 1 override for this class, so we will have to loop through 
//                    // both the overrides and the class Id 
//                    if (0 != dependencyObjectType.Id)
//                    { 
//                        do
//                        {
//                            // Get the Id of the most derived class with overridden metadata
//                            this._metadataMap.GetKeyValuePair(index, /*out*/ Id, /*out*/ value); 
//                            --index;
// 
//                            // If the Id of this class is less than the override, then look for an override 
//                            // with an equal or lower Id until we run out of overrides
//                            while ((dependencyObjectType.Id < Id) && (index >= 0)) 
//                            {
//                            	this._metadataMap.GetKeyValuePair(index, /*out*/ Id, /*out*/ value);
//                                --index;
//                            } 
//
//                            // If there is overriden metadata, then there is a base class with 
//                            // lower or equal Id of this class, or this class is already a base class 
//                            // of the overridden one. Therefore dependencyObjectType won't ever
//                            // become null before we exit the while loop 
//                            while (dependencyObjectType.Id > Id)
//                            {
//                                dependencyObjectType = dependencyObjectType.BaseType;
//                            } 
//
//                            if (Id == dependencyObjectType.Id) 
//                            { 
//                                // Return the override
//                                return /*(PropertyMetadata)*/value; 
//                            }
//                        }
//                        while (index >= 0);
//                    } 
//                }
//            } 
//            return _defaultMetadata; 
//        },
        
        
	      /// <summary> 
	      ///     Retrieve metadata for a provided type
	      /// </summary> 
	      /// <param name="forType">Type to get metadata</param> 
	      /// <returns>Property metadata</returns>
//	      GetMetadata:function(/*Type forType or DependencyObject dependencyObject or DependencyObjectType dependencyObjectType*/ par ) 
//	      {
//	    	  var dependencyObjectType = null;
//	          if (par instanceof Type) {
//	        	  dependencyObjectType = DependencyObjectType.FromSystemType(forType); 
//	          }else if(par.dType !==undefined/* instanceof DependencyObject*/){
//	        	  dependencyObjectType = dependencyObject.DependencyObjectType;
//	          } else {
//	        	  dependencyObjectType = par;
//	          }
// 
//	          // All static constructors for this DType and all base types have already
//	          // been run. If no overriden metadata was provided, then look up base types. 
//	          // If no metadata found on base types, then return default
//	
//	          if (null != dependencyObjectType) 
//	          {
//	              var result = this._metadataMap[dependencyObjectType];
//	              if(result != undefined ){
//	            	  return result;
//	              }
//	              dependencyObjectType = dependencyObjectType.BaseType;
//	              while(dependencyObjectType!=null && dependencyObjectType!=undefined){
//	            	  result = this._metadataMap[dependencyObjectType];
//		              if(result != undefined ){
//		            	  return result;
//		              }
//		              dependencyObjectType = dependencyObjectType.BaseType;
//	              }
//	              
//	          } 
//	          return this._defaultMetadata; 
//	      },
	      
	    /// <summary>
	        /// Reteive metadata for a DependencyObject type described by the 
	        /// given DependencyObjectType 
	        /// </summary>
	        //CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = BuildInfo.WCP_PUBLIC_KEY_STRING)] 
//	        public PropertyMetadata 
	      GetMetadata:function(/*DependencyObjectType*/ dependencyObjectType)
	      {
	          if (dependencyObjectType instanceof Type) {
	        	  dependencyObjectType = DependencyObjectType.FromSystemType(dependencyObjectType); 
	          }else if(dependencyObjectType.dType instanceof DependencyObjectType){
	        	  dependencyObjectType = dependencyObjectType.DependencyObjectType;
	          } 
//	          else {
//	        	  dependencyObjectType = dependencyObjectType;
//	          }
	    	  // All static constructors for this DType and all base types have already
	    	  // been run. If no overriden metadata was provided, then look up base types. 
	    	  // If no metadata found on base types, then return default
	 
	    	  if (null != dependencyObjectType) 
	    	  {
	    		  // Do we in fact have any overrides at all? 
	    		  var index = this._metadataMap.Count - 1;
	    		  var Id;
	    		  var value;
	    		  var keyOut = {"key" : null};
	    		  var valueOut = {"value" : null};
	 
	    		  if (index < 0)
	    		  { 
	    			  // No overrides or it's the base class 
	    			  return this._defaultMetadata;
	    		  } 
	    		  else if (index == 0)
	    		  {
	    			  // Only 1 override
	    			  this._metadataMap.GetKeyValuePair(index, /*out Id*/keyOut, /*out value*/valueOut); 
	    			  Id = keyOut.key;
	    			  value = valueOut.value;
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
	    					  this._metadataMap.GetKeyValuePair(index, /*out Id*/keyOut, /*out value*/valueOut); 
	    					  Id = keyOut.key;
	    					  value = valueOut.value;
	    					  --index;
	 
	    					  // If the Id of this class is less than the override, then look for an override 
	    					  // with an equal or lower Id until we run out of overrides
	    					  while ((dependencyObjectType.Id < Id) && (index >= 0)) 
	    					  {
	    						  this._metadataMap.GetKeyValuePair(index, /*out Id*/keyOut, /*out value*/valueOut);
	    						  Id = keyOut.key;
	    						  value = valueOut.value;
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
	    	  return this._defaultMetadata; 
	     },
 
        /// <summary> 
        ///     Associate another owner type with this property
        /// </summary> 
        /// <remarks>
        ///     The owner type is used when resolving a property by name (<see cref="FromName"/>)
        /// </remarks>
        /// <param name="ownerType">Additional owner type</param> 
        /// <param name="typeMetadata">Optional type metadata to override on owner's behalf</param>
        /// <returns>This property</returns> 
        AddOwner:function(/*Type*/ ownerType, /*PropertyMetadata*/ typeMetadata) {
            if (typeMetadata == undefined) 
            {
            	typeMetadata = null;
            }
            
            if (ownerType == null) 
            {
                throw new Error("ArgumentNullException('ownerType')");
            }
            
            // Map owner type to this property
            // Build key 
            var key = new FromNameKey(this.Name, ownerType); 

//            lock (Synchronized) 
//            {
//                if (PropertyFromName.Contains(key))
//                {
//                    throw new ArgumentException(SR.Get(SRID.PropertyAlreadyRegistered, Name, ownerType.Name)); 
//                }
//            } 
            if (PropertyFromName[key] != undefined)
            {
                throw new Error("ArgumentException(SR.Get(SRID.PropertyAlreadyRegistered, Name, ownerType.Name)"); 
            }
 
            if (typeMetadata != null){ 
                this.OverrideMetadata(ownerType, typeMetadata);
            }

//            lock (Synchronized)
//            { 
//                PropertyFromName[key] = this; 
//            }
            PropertyFromName[key] = this; 
 

            return this;
        },
        
        /// <summary>
        ///     Serves as a hash function for a particular type, suitable for use in 
        ///     hashing algorithms and data structures like a hash table
        /// </summary>
        /// <returns>The DependencyProperty's GlobalIndex</returns>
        GetHashCode:function() 
        {
            return this.GlobalIndex; 
        },

        /// <summary> 
        ///     Used to determine if given value is appropriate for the type of the property
        /// </summary>
        /// <param name="value">Value to check</param>
        /// <returns>true if value matches property type</returns> 
        IsValidType:function(/*object*/ value) { 
            return DepenencyProperty.IsValidType(value, this.PropertyType); 
        },

        /// <summary>
        ///     Used to determine if given value is appropriate for the type of the property
        ///     and the range of values (as specified via the ValidateValueCallback) within that type 
        /// </summary>
        /// <param name="value">Value to check</param> 
        /// <returns>true if value is appropriate</returns> 
        /*public bool */
        IsValidValue:function(/*object*/ value) { 
            if (!DependencyProperty.IsValidType(value, this.PropertyType))
            {
                return false;
            } 

            if (this.ValidateValueCallback != null) 
            { 
                // CALLBACK
                return this.ValidateValueCallback.Call(value); 
            }

            return true;
        } ,
 
        VerifyReadOnlyKey:function( /*DependencyPropertyKey*/ candidateKey ) {
//            Debug.Assert( ReadOnly, "Why are we trying to validate read-only key on a property that is not read-only?");
 
            if (this._readOnlyKey != candidateKey)
            { 
                throw new Error("ArgumentException(SR.Get(SRID.ReadOnlyKeyNotAuthorized)"); 
            }
        },

        /// <summary>
        ///     Internal version of IsValidValue that bypasses IsValidType check;
        ///     Called from SetValueInternal 
        /// </summary>
        /// <param name="value">Value to check</param> 
        /// <returns>true if value is appropriate</returns> 
//        internal bool 
        IsValidValueInternal:function(/*object*/ value) { 
            if (this.ValidateValueCallback != null)
            {
                // CALLBACK
                return this.ValidateValueCallback.Invoke(value); 
            }
 
            return true; 
        },
        
        /// <summary>
        ///    String representation 
        /// </summary> 
        toString:function() { 
            return this._name;
        }

	});

    ///     Register a Dependency Property 
    /// <param name="name">Name of property</param>
    /// <param name="propertyType">Type of the property</param>
    /// <param name="ownerType">Type that is registering the property</param> 
    /// <param name="typeMetadata">Metadata to use if current type doesn't specify type-specific metadata</param>
    /// <param name="validateValueCallback">Provides additional value validation outside automatic type validation</param> 
    /// <returns>Dependency Property</returns> 
    DependencyProperty.Register = function(/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, 
    		/*PropertyMetadata*/ typeMetadata, /*ValidateValueCallback*/ validateValueCallback)
    { 
    	
    	if(typeMetadata === undefined){
    		typeMetadata = null;
    	}
    	
    	if(validateValueCallback === undefined){
    		validateValueCallback = null;
    	}
    	
        RegisterParameterValidation(name, propertyType, ownerType);

        // Register an attached property
        /*PropertyMetadata*/var defaultMetadata = null; 
        if (typeMetadata != null && typeMetadata.DefaultValueWasSet())
        { 
//            defaultMetadata = new PropertyMetadata(typeMetadata.DefaultValue); 
            defaultMetadata = PropertyMetadata.BuildWithDefaultValue(typeMetadata.DefaultValue);
        }

        /*DependencyProperty*/var property = RegisterCommon(name, propertyType, ownerType, defaultMetadata, validateValueCallback);

        if (typeMetadata != null)
        { 
            // Apply type-specific metadata to owner type only
            property.OverrideMetadata(ownerType, typeMetadata); 
        } 

        return property; 
    };

    ///  Simple registration, metadata, validation, and a read-only property 
    /// key.  Calling this version restricts the property such that it can
    /// only be set via the corresponding overload of DependencyObject.SetValue.
    DependencyProperty.RegisterReadOnly = function(
    		/*String*/ name, /*Type*/ propertyType, /*Type*/ ownerType, /*PropertyMetadata*/ typeMetadata, /*ValidateValueCallback*/ validateValueCallback ) 
    {
    	if(validateValueCallback === undefined){
    		validateValueCallback = null;
    	}
    	
        RegisterParameterValidation(name, propertyType, ownerType);

        /*PropertyMetadata*/var defaultMetadata = null; 

        if (typeMetadata != null && typeMetadata.DefaultValueWasSet()){ 
//          defaultMetadata = new PropertyMetadata(typeMetadata.DefaultValue); 
            defaultMetadata = PropertyMetadata.BuildWithDefaultValue(typeMetadata.DefaultValue);
        } else {
            defaultMetadata = AutoGeneratePropertyMetadata(propertyType,validateValueCallback,name,ownerType);
        } 

        //  We create a DependencyPropertyKey at this point with a null property 
        // and set that in the _readOnlyKey field.  This is so the property is 
        // marked as requiring a key immediately.  If something fails in the
        // initialization path, the property is still marked as needing a key. 
        //  This is better than the alternative of creating and setting the key
        // later, because if that code fails the read-only property would not
        // be marked read-only.  The intent of this mildly convoluted code
        // is so we fail securely. 
        /*DependencyPropertyKey*/
        var authorizationKey = new DependencyPropertyKey(null); // No property yet, use null as placeholder.

        /*DependencyProperty*/
        var property = RegisterCommon(name, propertyType, ownerType, defaultMetadata, validateValueCallback); 

        property._readOnlyKey = authorizationKey; 

        authorizationKey.SetDependencyProperty(property);

        if (typeMetadata == null ) 
        {
            // No metadata specified, generate one so we can specify the authorized key. 
            typeMetadata = AutoGeneratePropertyMetadata(propertyType,validateValueCallback,name,ownerType); 
        }

        // Authorize registering type for read-only access, create key.
//        #pragma warning suppress 6506 // typeMetadata is never null, since we generate default metadata if none is provided.

        // Apply type-specific metadata to owner type only 
        property.OverrideMetadata(ownerType, typeMetadata, authorizationKey);

        return authorizationKey; 
    };

    ///  Simple registration, metadata, validation, and a read-only property
    /// key.  Calling this version restricts the property such that it can 
    /// only be set via the corresponding overload of DependencyObject.SetValue.
    DependencyProperty.RegisterAttachedReadOnly = function(/*string*/ name, /*Type*/ propertyType, /*Type*/ ownerType, 
    		/*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback) 
    {
        RegisterParameterValidation(name, propertyType, ownerType); 

        // Establish default metadata for all types, if none is provided
        if (defaultMetadata == null)
        { 
            defaultMetadata = AutoGeneratePropertyMetadata( propertyType, validateValueCallback, name, ownerType );
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

        var property = RegisterCommon( name, propertyType, ownerType, defaultMetadata, validateValueCallback); 

        property._readOnlyKey = authorizedKey;

        authorizedKey.SetDependencyProperty(property); 

        return authorizedKey; 
    };

    ///     Register an attached Dependency Property
    /// <param name="name">Name of property</param>
    /// <param name="propertyType">Type of the property</param> 
    /// <param name="ownerType">Type that is registering the property</param>
    /// <param name="defaultMetadata">Metadata to use if current type doesn't specify type-specific metadata</param> 
    /// <param name="validateValueCallback">Provides additional value validation outside automatic type validation</param> 
    /// <returns>Dependency Property</returns>
    DependencyProperty.RegisterAttached = function(/*string*/ name, /*Type*/ propertyType, /*Type*/ ownerType, 
    		/*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback) 
    {
    	if(validateValueCallback === undefined){
    		validateValueCallback = null;
    	}
    	
       	if(defaultMetadata === undefined){
       		defaultMetadata = null;
    	}
       	
        RegisterParameterValidation(name, propertyType, ownerType);

        return RegisterCommon( name, propertyType, ownerType, defaultMetadata, validateValueCallback ); 
    };

    function RegisterParameterValidation(/*string*/ name, /*Type*/ propertyType, /*Type*/ ownerType) 
    {
        if (name == null) 
        {
            throw new Error("ArgumentNullException('name')");
        }

        if (name.length == 0)
        { 
            throw new Error("ArgumentException(SR.Get(SRID.StringEmpty), 'name')"); 
        }

        if (ownerType == null)
        {
            throw new Error("ArgumentNullException('ownerType')");
        } 

        if (propertyType == null) 
        { 
            throw new Error("ArgumentNullException('propertyType')");
        } 
    };

    function RegisterCommon(/*string*/ name, /*Type*/ propertyType, /*Type*/ ownerType, 
    		/*PropertyMetadata*/ defaultMetadata, /*ValidateValueCallback*/ validateValueCallback)
    { 
//        FromNameKey key = new FromNameKey(name, ownerType);
//        lock (Synchronized) 
//        { 
//            if (PropertyFromName.Contains(key))
//            { 
//                throw new ArgumentException(SR.Get(SRID.PropertyAlreadyRegistered, name, ownerType.Name));
//            }
//        }
        
        var key = new FromNameKey(name, ownerType);
        if (PropertyFromName[key] != undefined){ 
            throw new Error("ArgumentException(SR.Get(SRID.PropertyAlreadyRegistered, name, ownerType.Name)");
        }

        // Establish default metadata for all types, if none is provided
        if (defaultMetadata == null) 
        { 
            defaultMetadata = AutoGeneratePropertyMetadata( propertyType, validateValueCallback, name, ownerType );
        }else // Metadata object is provided.
        {
            // If the defaultValue wasn't specified auto generate one
            if (!defaultMetadata.DefaultValueWasSet()) 
            {
                defaultMetadata.DefaultValue = AutoGenerateDefaultValue(propertyType); 
            } 

            ValidateMetadataDefaultValue( defaultMetadata, propertyType, name, validateValueCallback ); 
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


//        // Map owner type to this property
//        // Build key
//        lock (Synchronized) 
//        {
//            PropertyFromName[key] = dp; 
//        } 
        // Map owner type to this property
        // Build key
        PropertyFromName[key] = dp; 

        return dp;
    }

    function AutoGenerateDefaultValue( 
        /*Type*/ propertyType)
    { 
//        // Default per-type metadata not provided, create 
//        var defaultValue = null;
//
//        // Auto-assigned default value
//        if (propertyType.IsValueType)
//        {
//            // Value-types have default-constructed type default values 
//            defaultValue = Activator.CreateInstance(propertyType);
//        } 
//
//        return defaultValue;
      if (propertyType.IsValueType){
    	return propertyType.DefaultValue; 
      }
      
      return null;
    } 
    
//    private static object AutoGenerateDefaultValue( 
//            Type propertyType)
//    { 
//        // Default per-type metadata not provided, create 
//            object defaultValue = null;
// 
//            // Auto-assigned default value
//        if (propertyType.IsValueType)
//        {
//            // Value-types have default-constructed type default values 
//            defaultValue = Activator.CreateInstance(propertyType);
//        } 
// 
//        return defaultValue;
//    }

    
    function AutoGeneratePropertyMetadata(
        /*Type*/ propertyType,
        /*ValidateValueCallback*/ validateValueCallback, 
        /*string*/ name,
        /*Type*/ ownerType) 
    { 
        // Default per-type metadata not provided, create
        var defaultValue = AutoGenerateDefaultValue(propertyType); 

        // If a validator is passed in, see if the default value makes sense.
        if ( validateValueCallback != null &&
            !validateValueCallback.Call(defaultValue)) 
        {
            // Didn't work - require the caller to specify one. 
            throw new Error("ArgumentException(SR.Get(SRID.DefaultValueAutoAssignFailed, name, ownerType.Name)"); 
        }

        return PropertyMetadata.BuildWithDefaultValue(defaultValue);
    }

    // Validate the default value in the given metadata 
    function ValidateMetadataDefaultValue(
        /*PropertyMetadata*/ defaultMetadata, 
        /*Type*/ propertyType, 
        /*string*/ propertyName,
        /*ValidateValueCallback*/ validateValueCallback ) 
    {
        // If we are registered to use the DefaultValue factory we can
        // not validate the DefaultValue at registration time, so we
        // early exit. 
        if (defaultMetadata.UsingDefaultValueFactory)
        { 
            return; 
        }

        ValidateDefaultValueCommon(defaultMetadata.DefaultValue, propertyType,
            propertyName, validateValueCallback, /*checkThreadAffinity = */ true);
    }

    function ValidateDefaultValueCommon( 
        /*object*/ defaultValue,
        /*Type*/ propertyType, 
        /*string*/ propertyName, 
        /*ValidateValueCallback*/ validateValueCallback,
        /*bool*/ checkThreadAffinity) 
    {
        // Ensure default value is the correct type
        if (!DependencyProperty.IsValidType(defaultValue, propertyType))
        { 
            throw new Error("ArgumentException(SR.Get(SRID.DefaultValuePropertyTypeMismatch, propertyName)");
        } 

        // An Expression used as default value won't behave as expected since
        //  it doesn't get evaluated.  We explicitly fail it here. 
        if (defaultValue instanceof Expression )
        {
            throw new Error("ArgumentException(SR.Get(SRID.DefaultValueMayNotBeExpression)");
        } 
//        require(["windows/Expression"], function(Expression){
//            if (defaultValue instanceof Expression )
//            {
//                throw new Error("ArgumentException(SR.Get(SRID.DefaultValueMayNotBeExpression)");
//            } 
//        });
        

//        if (checkThreadAffinity) 
//        { 
//            // If the default value is a DispatcherObject with thread affinity
//            // we cannot accept it as a default value. If it implements ISealable 
//            // we attempt to seal it; if not we throw  an exception. Types not
//            // deriving from DispatcherObject are allowed - it is up to the user to
//            // make any custom types free-threaded.
//
//            var dispatcherObject = defaultValue instanceof DispatcherObject ? defaultValue : null;
//
//            if (dispatcherObject != null && dispatcherObject.Dispatcher != null) 
//            {
//                // Try to make the DispatcherObject free-threaded if it's an 
//                // ISealable.
//
//                /*ISealable*/var valueAsISealable = dispatcherObject instanceof ISealable ? dispatcherObject : null;
//
//                if (valueAsISealable != null && valueAsISealable.CanSeal)
//                { 
////                    Invariant.Assert (!valueAsISealable.IsSealed, 
////                           "A Sealed ISealable must not have dispatcher affinity");
//
//                    valueAsISealable.Seal();
//
////                    Invariant.Assert(dispatcherObject.Dispatcher == null,
////                        "ISealable.Seal() failed after ISealable.CanSeal returned true"); 
//                } else { 
//                    throw new Error("ArgumentException(SR.Get(SRID.DefaultValueMustBeFreeThreaded, propertyName)");
//                } 
//            }
//        }


        // After checking for correct type, check default value against
        //  validator (when one is given) 
        if ( validateValueCallback != null && 
            !validateValueCallback.Call(defaultValue))
        { 
            throw new Error("ArgumentException(SR.Get(SRID.DefaultValueInvalid, propertyName)");
        }
    };
    
    /// <summary>
    ///     Find a property from name
    /// </summary>
    /// <remarks> 
    ///     Search includes base classes of the provided type as well
    /// </remarks> 
    /// <param name="name">Name of the property</param> 
    /// <param name="ownerType">Owner type of the property</param>
    /// <returns>Dependency property</returns> 
//    internal static DependencyProperty 
    DependencyProperty.FromName = function(/*string*/ name, /*Type*/ ownerType){
        var dp = null; 

        if (name != null) { 
            if (ownerType != null){ 
                /*FromNameKey*/ key = new FromNameKey(name, ownerType);

                while ((dp == null) && (ownerType != null)) { 
//                    // Ensure static constructor of type has run
//                    MS.Internal.WindowsBase.SecurityHelper.RunClassConstructor(ownerType); 

                    // Locate property
                    key.UpdateNameKey(ownerType); 

                    dp = PropertyFromName[key]; 

                    ownerType = ownerType.BaseType; 
                }
            } else{
                throw new Error("ArgumentNullException('ownerType')");
            } 
        }else { 
            throw new Error("ArgumentNullException('name')");
        } 
        return dp;
    };
    
    // Synchronized: Covered by DependencyProperty.Synchronized 
    var GlobalIndexCount=0; 

    // Synchronized: Covered by DependencyProperty.Synchronized
    DependencyProperty.GetUniqueGlobalIndex = function(/*Type*/ ownerType, /*string*/ name) 
    { 
        // Prevent GlobalIndex from overflow. DependencyProperties are meant to be static members and are to be registered
        // only via static constructors. However there is no cheap way of ensuring this, without having to do a stack walk. Hence 
        // concievably people could register DependencyProperties via instance methods and therefore cause the GlobalIndex to
        // overflow. This check will explicitly catch this error, instead of silently malfuntioning.
        if (GlobalIndexCount >= Flags.GlobalIndexMask)
        { 
            if (ownerType != null)
            { 
                throw new Error("InvalidOperationException(SR.Get(SRID.TooManyDependencyProperties, ownerType.Name + . + name)"); 
            }
            else 
            {
                throw new Error("InvalidOperationException(SR.Get(SRID.TooManyDependencyProperties, 'ConstantProperty')");
            }
        } 

        // Covered by Synchronized by caller 
        return GlobalIndexCount++; 
    };
    
    DependencyProperty.IsValidType = function(/*object*/ value, /*Type*/ propertyType)
    { 
        if (value == null) 
        {
//            // Null values are invalid for value-types 
//            if (propertyType.IsValueType /*&&
//                !(propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == NullableType)*/)
//            {
//                return false; 
//            }
        	return true;
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
    };
	
	Object.defineProperties(DependencyProperty.prototype,{

        /// <summary> 
        ///     Name of the property 
        /// </summary>
        Name:
        {
            get:function() { return this._name; }
        },
 
        /// <summary>
        ///     Type of the property 
        /// </summary> 
        PropertyType:
        { 
            get:function() { return this._propertyType; }
        },

        /// <summary> 
        ///     Owning type of the property
        /// </summary> 
        OwnerType: 
        {
            get:function() { return this._ownerType; } 
        },

        /// <summary>
        ///     Default metadata for the property 
        /// </summary>
        DefaultMetadata: 
        { 
            get:function() { return this._defaultMetadata; }
        }, 

        /// <summary>
        ///     Value validation callback
        /// </summary> 
        ValidateValueCallback:
        { 
            get:function() { return this._validateValueCallback; } 
        },
 
        /// <summary>
        ///     Zero-based globally unique index of the property
        /// </summary>
        GlobalIndex: 
        {
            get:function() { return (this._packedData & Flags.GlobalIndexMask); } 
        }, 

        IsObjectType: 
        {
            get:function() { return (this._packedData & Flags.IsObjectType) != 0; }
        },
 
        IsValueType:
        { 
            get:function() { return (this._packedData & Flags.IsValueType) != 0; } 
        },
 
        IsFreezableType:
        {
            get:function() { return (this._packedData & Flags.IsFreezableType) != 0; }
        }, 

        IsStringType: 
        { 
            get:function() { return (this._packedData & Flags.IsStringType) != 0; }
        }, 

        IsPotentiallyInherited:
        {
            get:function() { return (this._packedData & Flags.IsPotentiallyInherited) != 0; } 
        },
 
        IsDefaultValueChanged: 
        {
            get:function() { return (this._packedData & Flags.IsDefaultValueChanged) != 0; } 
        },

        IsPotentiallyUsingDefaultValueFactory:
        { 
            get:function() { return (this._packedData & Flags.IsPotentiallyUsingDefaultValueFactory) != 0; }
        },
        
        /// <summary>
        /// This is the callback designers use to participate in the computation of property
        /// values at design time. Eg. Even if the author sets Visibility to Hidden, the designer
        /// wants to coerce the value to Visible at design time so that the element doesn't 
        /// disappear from the design surface.
        /// </summary> 
        DesignerCoerceValueCallback: 
        {
            get:function() {  return this._designerCoerceValueCallback; }, 
            set:function(value)
            {
                if (this.ReadOnly)
                { 
                    throw new Error("InvalidOperationException(SR.Get(SRID.ReadOnlyDesignerCoersionNotAllowed, Name)");
                } 

                this._designerCoerceValueCallback = value;
            } 
        },
        
        /// <summary> 
        ///     Set/Value value disabling 
        /// </summary>
        ReadOnly: 
        {
            get:function()
            {
                return (this._readOnlyKey != null); 
            }
        }, 
 
        /// <summary>
        ///     Returns the DependencyPropertyKey associated with this DP. 
        /// </summary>
        DependencyPropertyKey:
        {
            get:function() 
            {
                return this._readOnlyKey; 
            } 
        }
 
	});
	
	Object.defineProperties(DependencyProperty, {
		    /// <summary> 
    ///     Returns the number of all registered properties. 
    /// </summary>
         RegisteredPropertyCount:
         { 
        	 get:function() {
        		 return DependencyProperty.RegisteredPropertyList.Count;
        	 }
         },
         
 		RegisteredPropertyList:{
			get:function(){
				if(DependencyProperty._registeredPropertyList === undefined){
					DependencyProperty._registeredPropertyList = new ItemStructList/*<DependencyProperty>*/(768);
				}
				return DependencyProperty._registeredPropertyList;
			}
		},
		
//	    /// <summary> 
//	    ///     Returns an enumeration of properties that are 
//	    ///     currently registered.
//	    ///     Synchronized (write locks, lock-free reads): Covered by DependencyProperty.Synchronized 
//	    /// </summary>
//	    internal static IEnumerable RegisteredProperties {
//	        get {
//	            foreach(DependencyProperty dp in RegisteredPropertyList.List) { 
//	                if (dp != null) {
//	                    yield return dp; 
//	                } 
//	            }
//	        } 
//	    }
	});
	/// <summary> Standard unset value </summary>
//  public static readonly object 
	DependencyProperty.UnsetValue = Type.UnsetValue; //new NamedObject("DependencyProperty.UnsetValue"); 
	
	
	DependencyProperty.Type = new Type("DependencyProperty", DependencyProperty, [Object.Type]);
	return DependencyProperty;
});





        

