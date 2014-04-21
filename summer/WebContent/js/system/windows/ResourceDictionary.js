/**
 * ResourceDictionary
 */

define(["dojo/_base/declare", "system/Type", "collections/IDictionary", "componentmodel/ISupportInitialize", "markup/IUriContext",
        "markup/INameScope", "collections/DictionaryEntry", "windows/ResourcesChangeInfo", "collections/IDictionaryEnumerator",
        "collections/IEnumerator", "collections/ICollection", "collections/Hashtable", "collections/ArrayList",
        "windows/ResourceDictionaryCollection"], 
		function(declare, Type, IDictionary, ISupportInitialize, IUriContext, 
				INameScope, DictionaryEntry, ResourcesChangeInfo, IDictionaryEnumerator,
				IEnumerator, ICollection, Hashtable, ArrayList,
				ResourceDictionaryCollection){
	
//    private enum 
	var PrivateFlags =declare(Object,{});
	PrivateFlags.IsInitialized               = 0x01;
	PrivateFlags.IsInitializePending         = 0x02; 
	PrivateFlags.IsReadOnly                  = 0x04;
	PrivateFlags.IsThemeDictionary           = 0x08; 
	PrivateFlags.HasImplicitStyles           = 0x10; 

        // Unused bit = 0x40;
        // Unused bit = 0x80;
    
//    private enum 
	var FallbackState = declare(Object, {});
	FallbackState.Classic=0; 
	FallbackState.Generic=1; 
	FallbackState.None=2;
	
    /// <summary>
    ///     Iterates the dictionary's entries, handling deferred content.
    /// </summary> 
//    private class 
	var ResourceDictionaryEnumerator =declare(IDictionaryEnumerator, { 
        constructor:function(/*ResourceDictionary*/ owner) 
        {
            this._owner = owner; 
            this._keysEnumerator = this._owner.Keys.GetEnumerator();
        },



//        bool IEnumerator.
		MoveNext:function()
        { 
            return this._keysEnumerator.MoveNext(); 
        },

//        void IEnumerator.
        Reset:function()
        {
        	this._keysEnumerator.Reset();
        } 

    });
	
	Object.defineProperties(ResourceDictionaryEnumerator.prototype, {
//        object IEnumerator.
		Current: 
        { 
            get:function()
            { 
                return this.Entry;
            }
        },
        
//        DictionaryEntry IDictionaryEnumerator.
        Entry:
        {
            get:function()
            { 
                var key = this._keysEnumerator.Current;
                var value = this._owner.Get(key); //[key]; 
                return new DictionaryEntry(key, value); 
            }
        }, 

//        object IDictionaryEnumerator.
        Key:
        {
            get:function() 
            {
                return this._keysEnumerator.Current; 
            } 
        },

//        object IDictionaryEnumerator.
        Value:
        {
            get:function()
            { 
                return this._owner.Get(this._keysEnumerator.Current); //[this._keysEnumerator.Current];
            } 
        }
	});

    /// <summary>
    ///     Iterator for the dictionary's Values collection, handling deferred content.
    /// </summary>
//    private class 
	var ResourceValuesEnumerator =declare(IEnumerator, {
		constructor:function(/*ResourceDictionary*/ owner) 
        { 
            this._owner = owner;
            this._keysEnumerator = this._owner.Keys.GetEnumerator(); 
        },

//        bool IEnumerator.
        MoveNext:function() 
        {
            return this._keysEnumerator.MoveNext(); 
        }, 

//        void IEnumerator.
        Reset:function() 
        {
        	this._keysEnumerator.Reset();
        }

    });
	
	Object.defineProperties(ResourceValuesEnumerator.prototype, {
//        object IEnumerator.
		Current:
        { 
            get:function() 
            {
                return this._owner[this._keysEnumerator.Current]; 
            }
        }
	});

    /// <summary> 
    ///     Represents the dictionary's Values collection, handling deferred content. 
    /// </summary>
//    private class 
	var ResourceValuesCollection =declare(ICollection, {
		constructor:function(/*ResourceDictionary*/ owner)
        {
        	this._owner = owner; 
        },

//        void ICollection.
        CopyTo:function(/*Array*/ array, /*int*/ index) 
        { 
            for/*each*/ (var i=0 ;i<this._owner.Keys.Count; i++) //object key in this._owner.Keys)
            { 
//                array.SetValue(this._owner[key], index++);
            	array[index++]=this._owner.Get(this._owner.Keys.Get(i));
            }
        },

//        IEnumerator IEnumerable.
        GetEnumerator:function()
        { 
            return new ResourceValuesEnumerator(this._owner); 
        }
    });
	
	Object.defineProperties(ResourceValuesCollection.prototype, {
//	    int ICollection.
		Count: 
        {
            get:function()
            {
                return this._owner.Count; 
            }
        } 
	});
	
	
//  private static readonly DependencyObject 
	var DummyInheritanceContext = new DependencyObject(); 
    
	var ResourceDictionary = declare("ResourceDictionary", [IDictionary, ISupportInitialize, IUriContext, INameScope],{
		constructor:function(){
			this._baseDictionary = new Hashtable();
            this.IsThemeDictionary = false; //SystemResources.IsSystemResourcesParsing;  //cym modified
            
//            internal bool 
            this.IsSourcedFromThemeDictionary = false;
//            private FallbackState 
            this._fallbackState = FallbackState.Classic;
		},
		
        /// <summary> 
        ///     Gets or sets the value associated with the specified key. 
        /// </summary>
        /// <remarks> 
        ///     Fire Invalidations only for changes made after the Init Phase
        ///     If the key is not found on this ResourceDictionary, it will look on any MergedDictionaries for it
        /// </remarks>
//        public object this[object key] 
//        {
//            get 
//            { 
////                bool canCache;
//                return canCacheGetValue(key, /*out canCache*/{"canCache" : null}); 
//            }
//
//            set
//            { 
//                // Seal styles and templates within App and Theme dictionary
//            	this.SealValue(value); 
// 
//                this.SetValueWithoutLock(key, value);
//            }
//        }
		
        Get:function(key) 
        { 
//            bool canCache;
            return this.GetValue(key, /*out canCache*/{"canCache" : null}); 
        },

        Set:function(key, value)
        { 
            // Seal styles and templates within App and Theme dictionary
        	this.SealValue(value); 

            this.SetValueWithoutLock(key, value);
        },
		
	       /// <summary>
        ///     Copies the dictionary's elements to a one-dimensional 
        ///     Array instance at the specified index.
        /// </summary> 
        /// <param name="array"> 
        ///     The one-dimensional Array that is the destination of the
        ///     DictionaryEntry objects copied from Hashtable. The Array 
        ///     must have zero-based indexing.
        /// </param>
        /// <param name="arrayIndex">
        ///     The zero-based index in array at which copying begins. 
        /// </param>
//        public void 
		CopyTo:function(/*DictionaryEntry[]*/ array, /*int*/ arrayIndex) 
        { 
			this.CopyToWithoutLock(array, arrayIndex);
        },

//        private void 
		CopyToWithoutLock:function(/*DictionaryEntry[]*/ array, /*int*/ arrayIndex)
        { 
            if (array == null)
            { 
                throw new ArgumentNullException("array"); 
            }
 
            this._baseDictionary.CopyTo(array, arrayIndex);

            var length = arrayIndex + this.Count;
            for (var i = arrayIndex; i < length; i++) 
            {
                /*DictionaryEntry*/var entry = array[i]; 
                var value = entry.Value; 
//                var canCache;
                var valueRef = {
                	"value" : value
                };
                this.OnGettingValuePrivate(entry.Key, /*ref value*/valueRef, /*out canCache*/{"canCache": null}); 
                entry.Value = valueRef.value; // refresh the entry value in case it was changed in the previous call
            }
        },

        /// <summary> 
        /// Registers the name - element combination
        /// </summary> 
        /// <param name="name">name of the element</param>
        /// <param name="scopedElement">Element where name is defined</param>
//        public void 
		RegisterName:function(/*string*/ name, /*object*/ scopedElement)
        { 
            throw new NotSupportedException(SR.Get(SRID.NamesNotSupportedInsideResourceDictionary));
        }, 
 
        /// <summary>
        /// Unregisters the name - element combination 
        /// </summary>
        /// <param name="name">Name of the element</param>
//        public void 
		UnregisterName:function(/*string*/ name)
        { 
            // Do Nothing as Names cannot be registered on ResourceDictionary
        }, 
 
        /// <summary>
        /// Find the element given name 
        /// </summary>
        /// <param name="name">Name of the element</param>
        /// <returns>null always</returns>
//        public object 
		FindName:function(/*string*/ name) 
        {
            return null; 
        }, 
//        private void 
		SetValueWithoutLock:function(/*object*/ key, /*object*/ value) 
        {
            if (this.IsReadOnly) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryIsReadOnly));
            } 

            var oldValue = this._baseDictionary.Get(key);

            if (oldValue != value) 
            {
                // We need to validate all the deferred references that refer 
                // to the old resource before we overwrite it. 
                this.ValidateDeferredResourceReferences(key);

                this._baseDictionary.Set(key, value);

                // Update the HasImplicitStyles flag 
                this.UpdateHasImplicitStyles(key);
 
                // Notify owners of the change and fire invalidate if already initialized 
                this.NotifyOwners(new ResourcesChangeInfo(key));

            }
        }, 

//        internal object 
		GetValue:function(/*object*/ key, /*out bool canCache*/canCacheOut) 
        { 
            return this.GetValueWithoutLock(key, /*out canCache*/canCacheOut);
        },

//        private object 
		GetValueWithoutLock:function(/*object*/ key, /*out bool canCache*/canCacheOut)
        { 
            var value = this._baseDictionary.Get(key); //[key];
            if (value != null) 
            { 
            	var valueRef = {
            		"value" : value
            	};
            	this.OnGettingValuePrivate(key, /*ref value*/valueRef, /*out canCache*/canCacheOut);
            	value = valueRef.value;
            } 
            else
            {
            	canCacheOut.canCache = true;
 
                //Search for the value in the Merged Dictionaries
                if (this._mergedDictionaries != null) 
                { 
                    for (var i = this.MergedDictionaries.Count - 1; (i > -1); i--)
                    { 
                        // Note that MergedDictionaries collection can also contain null values
                        /*ResourceDictionary*/var mergedDictionary = this.MergedDictionaries.Get(i);
                        if (mergedDictionary != null)
                        { 
                            value = mergedDictionary.GetValue(key, /*out canCache*/canCacheOut);
                            if (value != null) 
                            { 
                                break;
                            } 
                        }
                    }
                }
            } 

            return value; 
        }, 

        // Gets the type of the value stored at the given key 
//        internal Type 
		GetValueType:function(/*object*/ key, /*out bool found*/foundOut)
        {
			foundOut.found = false;
            /*Type*/var valueType = null; 

            var value = this._baseDictionary.Get(key); 
            if (value != null) 
            {
            	foundOut.found = true; 

                /*KeyRecord*/var keyRecord = value instanceof KeyRecord ? value : null;
                if (keyRecord != null)
                { 
//                    Debug.Assert(_numDefer > 0, "The stream was closed before all deferred content was loaded.");
                    valueType = this.GetTypeOfFirstObject(keyRecord); 
                } 
                else
                { 
                    valueType = value.GetType();
                }

            } 
            else
            { 
                // Search for the value in the Merged Dictionaries 
                if (this._mergedDictionaries != null)
                { 
                    for (var i = this.MergedDictionaries.Count - 1; (i > -1); i--)
                    {
                        // Note that MergedDictionaries collection can also contain null values
                        /*ResourceDictionary*/var mergedDictionary = this.MergedDictionaries.Get(i); //[i]; 
                        if (mergedDictionary != null)
                        { 
                            valueType = mergedDictionary.GetValueType(key, foundOut); 
                            if (foundOut.found)
                            { 
                                break;
                            }
                        }
                    } 
                }
            } 
 
            return valueType;
        },

        /// <summary> 
        ///     Adds an entry
        /// </summary>
        /// <remarks>
        ///     Fire Invalidations only for changes made after the Init Phase 
        /// </remarks>
//        public void 
		Add:function(/*object*/ key, /*object*/ value) 
        { 
            // Seal styles and templates within App and Theme dictionary
			this.SealValue(value); 

            this.AddWithoutLock(key, value);
 
        },
 
//        private void 
		AddWithoutLock:function(/*object*/ key, /*object*/ value) 
        {
            if (this.IsReadOnly) 
            {
                throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryIsReadOnly));
            }

            this._baseDictionary.Add(key, value); 
 
            // Update the HasImplicitKey flag
            this.UpdateHasImplicitStyles(key); 

            // Notify owners of the change and fire invalidate if already initialized
            this.NotifyOwners(new ResourcesChangeInfo(key));
 
        },
 
        /// <summary> 
        ///     Removes all elements from the IDictionary.
        /// </summary> 
//        public void 
		Clear:function()
        {
        	this.ClearWithoutLock();
        },
 
//        private void 
		ClearWithoutLock:function() 
        {
            if (this.IsReadOnly) 
            {
                throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryIsReadOnly));
            }
 
            if (this.Count > 0)
            { 
                // We need to validate all the deferred references that refer 
                // to the old resource before we clear it.
            	this.ValidateDeferredResourceReferences(null); 

                // remove inheritance context from all values that got it from
                // this dictionary
            	this.RemoveInheritanceContextFromValues(); 

            	this._baseDictionary.Clear(); 
 
                // Notify owners of the change and fire invalidate if already initialized
            	this.NotifyOwners(ResourcesChangeInfo.CatastrophicDictionaryChangeInfo); 
            }
        },

        /// <summary> 
        ///     Determines whether the IDictionary contains an element with the specified key.
        ///     if the Key is not contained in this ResourceDictionary, it will check in the MergedDictionaries too 
        /// </summary> 
//        public bool 
		Contains:function(/*object*/ key)
        { 
            var result = this._baseDictionary.Contains(key);

//            cym comment
//            if (result)
//            { 
//                /*KeyRecord*/var keyRecord = this._baseDictionary.Get(key);
//                keyRecord = keyRecord instanceof KeyRecord ? keyRecord : null;
//                if (keyRecord != null && this._deferredLocationList.Contains(keyRecord)) 
//                { 
//                    return false;
//                } 
//            }

            //Search for the value in the Merged Dictionaries
            if (this._mergedDictionaries != null) 
            {
                for (var i = this.MergedDictionaries.Count - 1; (i > -1) && !result; i--) 
                { 
                    // Note that MergedDictionaries collection can also contain null values
                    /*ResourceDictionary*/var mergedDictionary = this.MergedDictionaries.Get(i); //[i]; 
                    if (mergedDictionary != null)
                    {
                        result = mergedDictionary.Contains(key);
                    } 
                }
            } 
            return result; 
        },
 
        /// <summary>
        ///     Determines whether the IDictionary contains a BamlObjectFactory against the specified key.
        ///     if the Key is not contained in this ResourceDictionary, it will check in the MergedDictionaries too
        /// </summary> 
//        private bool 
		ContainsBamlObjectFactory:function(/*object*/ key)
        { 
            return this.GetBamlObjectFactory(key) != null; 
        },
 
        /// <summary>
        ///     Retrieves a KeyRecord from the IDictionary using the specified key.
        ///     If the Key is not contained in this ResourceDictionary, it will check in the MergedDictionaries too
        /// </summary> 
//        private KeyRecord 
		GetBamlObjectFactory:function(/*object*/ key)
        { 
            if (this._baseDictionary.Contains(key)) 
            {
                var r= this._baseDictionary.Get(key);
                return r = r instanceof KeyRecord ? r : null; 
            }

            //Search for the value in the Merged Dictionaries
            if (this._mergedDictionaries != null) 
            {
                for (var i = this.MergedDictionaries.Count - 1; i > -1; i--) 
                { 
                    // Note that MergedDictionaries collection can also contain null values
                    /*ResourceDictionary*/var mergedDictionary = this.MergedDictionaries.Get(i); 
                    if (mergedDictionary != null)
                    {
                        var keyRecord = mergedDictionary.GetBamlObjectFactory(key);
                        if (keyRecord != null) 
                        {
                            return keyRecord; 
                        } 
                    }
                } 
            }

            return null;
        }, 

        /// <summary> 
        ///     Returns an IDictionaryEnumerator that can iterate through the Hashtable 
        /// </summary>
        /// <returns>An IDictionaryEnumerator for the Hashtable</returns> 
//        public IDictionaryEnumerator 
		GetEnumerator:function()
        {
            return new ResourceDictionaryEnumerator(this);
        }, 

        /// <summary> 
        ///     Removes an entry 
        /// </summary>
        /// <remarks> 
        ///     Fire Invalidations only for changes made after the Init Phase
        /// </remarks>
//        public void 
		Remove:function(/*object*/ key)
        { 
            this.RemoveWithoutLock(key);
        }, 

//        private void 
		RemoveWithoutLock:function(/*object*/ key) 
        {
            if (this.IsReadOnly)
            {
                throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryIsReadOnly)); 
            }
 
            // We need to validate all the deferred references that refer 
            // to the old resource before we remove it.
            this.ValidateDeferredResourceReferences(key); 

            // remove the inheritance context from the value, if it came from
            // this dictionary
            this.RemoveInheritanceContext(this._baseDictionary.Get(key)); 

            this._baseDictionary.Remove(key); 
 
            // Notify owners of the change and fire invalidate if already initialized
            this.NotifyOwners(new ResourcesChangeInfo(key)); 
        },

//        IEnumerator IEnumerable.
		GetEnumerator:function() 
        {
            return this.GetEnumerator(); 
        }, 

        /// <summary> 
        ///     Mark the begining of the Init phase
        /// </summary> 
        /// <remarks> 
        ///     BeginInit and EndInit follow a transaction model. BeginInit marks the
        ///     dictionary uninitialized and EndInit marks it initialized. 
        /// </remarks>
//        public void 
		BeginInit:function()
        {
            // Nested BeginInits on the same instance aren't permitted 
            if (this.IsInitializePending)
            { 
                throw new InvalidOperationException(SR.Get(SRID.NestedBeginInitNotSupported)); 
            }
 
            this.IsInitializePending = true;
            this.IsInitialized = false;
        },
 
        /// <summary>
        ///     Fire Invalidation at the end of Init phase 
        /// </summary> 
        /// <remarks>
        ///     BeginInit and EndInit follow a transaction model. BeginInit marks the 
        ///     dictionary uninitialized and EndInit marks it initialized.
        /// </remarks>
//        public void 
		EndInit:function()
        { 
            // EndInit without a BeginInit isn't permitted
            if (!this.IsInitializePending) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.EndInitWithoutBeginInitNotSupported));
            } 
//            Debug.Assert(IsInitialized == false, "Dictionary should not be initialized when EndInit is called");

            this.IsInitializePending = false;
            this.IsInitialized = true; 

            // Fire Invalidations collectively for all changes made during the Init Phase 
            this.NotifyOwners(new ResourcesChangeInfo(null, this)); 
        },
 
//        private bool 
		CanCache:function(/*KeyRecord*/ keyRecord, /*object*/ value)
        { 
            if (keyRecord.SharedSet) 
            {
                return keyRecord.Shared; 
            }
            else
            {
                return true; 
            }
        }, 
 
//        private void 
		OnGettingValuePrivate:function(/*object*/ key, /*ref object value*/valueRef, /*out bool canCache*/canCacheOut)
        { 
			this.OnGettingValue(key, /*ref value*/valueRef, /*out canCache*/canCacheOut);

            if (key != null && canCacheOut.canCache)
            { 
                if (!Object.Equals(this._baseDictionary.Get(key), valueRef.value))
                { 
                    // cache the revised value, after setting its InheritanceContext 
                    if (this.InheritanceContext != null)
                    { 
                    	this.AddInheritanceContext(this.InheritanceContext, valueRef.value);
                    }

                    this._baseDictionary.Set(key, valueRef.value); 
                }
            } 
        }, 

//        protected virtual void 
		OnGettingValue:function(/*object*/ key, /*ref object value*/valueRef, /*out bool canCache*/canCacheOut) 
        {
//			cym comment
//            var keyRecord = valueRef.value instanceof KeyRecord ? value : null;
//
//            // If the value is not a key record then 
//            // it has already been realized, is not deferred and is a "ready to go" value.
//            if (keyRecord == null) 
//            { 
//            	canCacheOut.canCache = true;
//                return;   /* Not deferred content */ 
//            }
//
////            Debug.Assert(_numDefer > 0, "The stream was closed before all deferred content was loaded.");
// 
//            // We want to return null if a resource asks for itself. It should return null
//            //  <Style x:Key={x:Type Button} BasedOn={StaticResource {x:Type Button}}/> should not find itself 
//            if (this._deferredLocationList.Contains(keyRecord)) 
//            {
//            	canCacheOut.canCache = false; 
//            	valueRef.value = null;
//                return; /* Not defered content */
//            }
// 
//            this._deferredLocationList.Add(keyRecord);
// 
//        	valueRef.value = this.CreateObject(keyRecord);
//
//            this._deferredLocationList.Remove(keyRecord); 
//
//            if (key != null)
//            {
//            	canCacheOut.canCache = this.CanCache(keyRecord, valueRef.value); 
//                if (canCacheOut.canCache)
//                { 
//                    // Seal styles and templates within App and Theme dictionary 
//                	this.SealValue(valueRef.value);
// 
//                    this._numDefer--;
//
//                    if (this._numDefer == 0)
//                    { 
//                    	this.CloseReader();
//                    } 
//                } 
//            }
//            else 
//            {
//            	canCacheOut.canCache = true;
//            }
        }, 

        /// <summary> 
        ///  Add a byte array that contains deferable content 
        /// </summary>
        /// <SecurityNote> 
        /// Critical: sets critical fields _reader and _xamlLoadPermission.
        /// Safe: data comes from DeferrableContent, where it is critical to set
        /// </SecurityNote>
//        private void 
		SetDeferrableContent:function(/*DeferrableContent*/ deferrableContent)
        { 
//            Debug.Assert(deferrableContent.Stream != null); 
//            Debug.Assert(deferrableContent.SchemaContext != null);
//            Debug.Assert(deferrableContent.ObjectWriterFactory != null); 
//            Debug.Assert(deferrableContent.ServiceProvider != null);
//            Debug.Assert(deferrableContent.RootObject != null);

            /*Baml2006ReaderSettings*/
			var settings = new Baml2006ReaderSettings(deferrableContent.SchemaContext.Settings); 
            settings.IsBamlFragment = true;
            settings.OwnsStream = true; 
            settings.BaseUri = null;    // Base URI can only be set on the root object, not on deferred content. 

            /*Baml2006Reader*/
            var reader = new Baml2006Reader(deferrableContent.Stream, 
                deferrableContent.SchemaContext, settings);
            _objectWriterFactory = deferrableContent.ObjectWriterFactory;
            _objectWriterSettings = deferrableContent.ObjectWriterParentSettings;
            _deferredLocationList = new List/*<KeyRecord>*/(); 
            _rootElement = deferrableContent.RootObject;
 
            /*IList<KeyRecord>*/var keys = reader.ReadKeys(); 

            // If we already have the Source set then we can ignore 
            // this deferable content section
            if (_source == null)
            {
                if (_reader == null) 
                {
                    _reader = reader; 
                    _xamlLoadPermission = deferrableContent.LoadPermission; 
                    SetKeys(keys, deferrableContent.ServiceProvider);
                } 
                else
                {
                    throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryDuplicateDeferredContent));
                } 
            }
            else if (keys.Count > 0) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryDeferredContentFailure));
            } 
        },

//        private object 
        GetKeyValue:function(/*KeyRecord*/ key, /*IServiceProvider*/ serviceProvider)
        { 
            if (key.KeyString != null)
            { 
                return key.KeyString; 
            }
            else if (key.KeyType != null) 
            {
                return key.KeyType;
            }
            else 
            {
                /*System.Xaml.XamlReader*/var reader = key.KeyNodeList.GetReader(); 
                var value = EvaluateMarkupExtensionNodeList(reader, serviceProvider); 
                return value;
            } 
        },

//        private object 
        EvaluateMarkupExtensionNodeList:function(/*System.Xaml.XamlReader*/ reader, /*IServiceProvider*/ serviceProvider)
        { 
            /*System.Xaml.XamlObjectWriter*/var writer = _objectWriterFactory.GetXamlObjectWriter(null);
 
            System.Xaml.XamlServices.Transform(reader, writer); 

            var value = writer.Result; 
            var me = value instanceof MarkupExtension ? value : null;
            if (me != null)
            {
                value = me.ProvideValue(serviceProvider); 
            }
            return value; 
        }, 

//        private object 
        GetStaticResourceKeyValue:function(/*StaticResource*/ staticResource, /*IServiceProvider*/ serviceProvider) 
        {
            /*System.Xaml.XamlReader*/var reader = staticResource.ResourceNodeList.GetReader();
            /*XamlType*/var xamlTypeStaticResourceExtension = reader.SchemaContext.GetXamlType(typeof(StaticResourceExtension));
            /*XamlMember*/var xamlMemberResourceKey = xamlTypeStaticResourceExtension.GetMember("ResourceKey"); 
            reader.Read();
            if (reader.NodeType == Xaml.XamlNodeType.StartObject && reader.Type == xamlTypeStaticResourceExtension) 
            { 
                reader.Read();
                // Skip Members that aren't _PositionalParameters or ResourceKey 
                while (reader.NodeType == Xaml.XamlNodeType.StartMember &&
                    (reader.Member != XamlLanguage.PositionalParameters && reader.Member != xamlMemberResourceKey))
                {
                    reader.Skip(); 
                }
 
                // Process the Member Value of _PositionParameters or ResourceKey 
                if (reader.NodeType == Xaml.XamlNodeType.StartMember)
                { 
                    var value = null;
                    reader.Read();
                    if (reader.NodeType == Xaml.XamlNodeType.StartObject)
                    { 
                        /*System.Xaml.XamlReader*/var subReader = reader.ReadSubtree();
 
                        value = EvaluateMarkupExtensionNodeList(subReader, serviceProvider); 
                    }
                    else if (reader.NodeType == Xaml.XamlNodeType.Value) 
                    {
                        value = reader.Value;
                    }
                    return value; 
                }
            } 
            return null; 
        },
 
//        private void 
        SetKeys:function(/*IList<KeyRecord>*/ keyCollection, /*IServiceProvider*/ serviceProvider)
        {
        	this._numDefer = keyCollection.Count;
 
            // Allocate one StaticResourceExtension object to use as a "worker".
            /*StaticResourceExtension*/var staticResourceWorker = new StaticResourceExtension(); 
 
            // Use the array Count property to avoid range checking inside the loop
            for (var i = 0; i < keyCollection.Count; i++) 
            {
                /*KeyRecord*/var keyRecord = keyCollection[i];
                if (keyRecord != null)
                { 
                    var value = this.GetKeyValue(keyRecord, serviceProvider);
 
                    // Update the HasImplicitStyles flag 
                    this.UpdateHasImplicitStyles(value);
 
                    if (keyRecord != null && keyRecord.HasStaticResources)
                    {
                    	this.SetOptimizedStaticResources(keyRecord.StaticResources, serviceProvider, staticResourceWorker);
                    } 

                    this._baseDictionary.Add(value, keyRecord); 
 
//                    if (TraceResourceDictionary.IsEnabled)
//                    { 
//                        TraceResourceDictionary.TraceActivityItem(
//                            TraceResourceDictionary.SetKey,
//                            this,
//                            value); 
//                    }
 
                } 
                else
                { 
                    throw new ArgumentException(SR.Get(SRID.KeyCollectionHasInvalidKey));
                }
            }
 
            // Notify owners of the HasImplicitStyles flag value
            // but there is not need to fire an invalidation. 
            this.NotifyOwners(new ResourcesChangeInfo(null, this)); 
        },
 
        /// <summary>
        /// Convert the OptimizedStaticResource and StaticResource items into StaticResourceHolders.
        /// A StaticResourceHolder is derived from StaticResourceExtension and is a MarkupExtension.
        /// The differences is that it contain a DeferredResourceReference as its "PrefetchedValue". 
        /// DeferredResourceReferences hold the dictionary and the key of the resource.  It is a
        /// way of looking up the reference now (for later use) but not expanding the entry. 
        /// Also the dictionary has a reference back to the Deferrred Reference.  If dictionary entry 
        /// is modifed the DeferredResourceReference is told and it will grab the old value.
        /// StaticResourceHolder is a MarkupExtension and thus can be returned as a "Value" in the Node Stream. 
        ///
        /// Issue:  If there is a ResourceDictionary inside the deferred entry, the entries inside that
        /// RD will not be evaluated when resolving DeferredResourceReferences for a key in that same entry.
        /// Thus the OptimizedStaticResource will either be erronously "not found" or may even map to some 
        /// incorrect value higher in the parse tree.  So... In StaticResourceExtension.ProvideValue()
        /// when we have a DeferredResourceReference we search the Deferred Content for a better 
        /// closer value before using the DeferredReference. 
        /// See StaticResourceExtension.FindTheResourceDictionary() for more details.
        /// </summary> 

        // As a memory optimization this method is passed a staticResourceExtension instance to use as
        // a worker when calling TryProvideValueInternal, which saves us having to allocate on every call.
//        private void 
        SetOptimizedStaticResources:function(/*IList<object>*/ staticResources, 
        		/*IServiceProvider*/ serviceProvider, /*StaticResourceExtension*/ staticResourceWorker) 
        {
//            Debug.Assert(staticResources != null && staticResources.Count > 0); 
            for (var i = 0; i < staticResources.Count; i++) 
            {
                var keyValue = null; 

                // Process OptimizedStaticResource
                var optimizedStaticResource = staticResources.Get(i);
                optimizedStaticResource = optimizedStaticResource instanceof OptimizedStaticResource ? optimizedStaticResource : null;
                if (optimizedStaticResource != null) 
                {
                    keyValue = optimizedStaticResource.KeyValue; 
                } 
                else
                { 
                    // Process StaticResource  (it holds the NodeList of the StaticResourceExtension)
                    var staticResource = staticResources.Get(i);
                    staticResource = staticResource instanceof  StaticResource ? staticResource : null;
                    if (staticResource != null)
                    { 
                        // find and evaluate the Key value of the SR in the SR's node stream.
                        keyValue = GetStaticResourceKeyValue(staticResource, serviceProvider); 
//                        Debug.Assert(keyValue != null, "Didn't find the ResourceKey property or x:PositionalParameters directive"); 
                    }
                    else 
                    {
//                        Debug.Assert(false, "StaticResources[] entry is not a StaticResource not OptimizedStaticResource");
                        continue;  // other types of entries are not processed.
                    } 
                }
 
                // Lookup the Key in the current context.  [And return a Deferred Reference Holding SR to it] 
                // The current context is the Key table at the top of the Compiled Dictionary.
                // We will look at keys above us in this dictionary and in the dictionaries in objects above 
                // us on the parse stack.  And then look in the App and System Themems.
                // This isn't always good enough.  The Static Resource referenced inside the entry may refer
                // to a entry in a sub-dictionary inside the deferred entry.   There is other code, later
                // when evaluating StaticResourceHolders, that does an search of the part that is missed here. 
                staticResourceWorker.ResourceKey = keyValue;
                var obj = staticResourceWorker.TryProvideValueInternal(serviceProvider, true /*allowDeferredReference*/, true /* mustReturnDeferredResourceReference */); 
 
//                Debug.Assert(obj is DeferredResourceReference);
                staticResources[i] = new StaticResourceHolder(keyValue, obj instanceof DeferredResourceReference ? obj : null); 
            }
        },

//#if false 
        //
 
//        private void 
		SetStaticResources:function(/*object[]*/ staticResourceValues, /*ParserContext*/ context) 
        {
            if (staticResourceValues != null && staticResourceValues.length > 0) 
            {
                var inDeferredSection = context.InDeferredSection;

                for (var i=0; i<staticResourceValues.length; i++) 
                {
                    // If this dictionary is a top level deferred section then we lookup the parser stack 
                    // and then look in the app and theme dictionaries to resolve the current static resource. 

                    if (!inDeferredSection) 
                    {
                        staticResourceValues[i] = context.BamlReader.FindResourceInParentChain(
                            (staticResourceValues[i]).ResourceKey,
                            true /*allowDeferredResourceReference*/, 
                            true /*mustReturnDeferredResourceReference*/);
                    } 
                    else 
                    {
                        // If this dictionary is nested within another deferred section then we try to 
                        // resolve the current staticresource against the parser stack and if not
                        // able to resolve then we fallback to the pre-fetched value from the outer
                        // deferred section.
 
                        /*StaticResourceHolder*/var srHolder = staticResourceValues[i];
 
                        var value = context.BamlReader.FindResourceInParserStack( 
                            srHolder.ResourceKey,
                            true /*allowDeferredResourceReference*/, 
                            true /*mustReturnDeferredResourceReference*/);

                        if (value == DependencyProperty.UnsetValue)
                        { 
                            // If value wan't found the fallback
                            // to the prefetched value 
 
                            value = srHolder.PrefetchedValue;
                        } 

                        staticResourceValues[i] = value;
                    }
                } 
            }
        }, 
//#endif 
        /// <SecurityNote>
        /// Critical: accesses critical field _reader 
        /// Safe: field is safe to read (only critical to write)
        /// </SecurityNote>
//        private Type 
		GetTypeOfFirstObject:function(/*KeyRecord*/ keyRecord) 
        {
            /*Type*/var rootType = _reader.GetTypeOfFirstStartObject(keyRecord); 
            return rootType == null ? String.Type : rootType; 
        },
 
        /// <SecurityNote>
        /// Critical: Accesses critical fields _reader and _xamlLoadPermission
        ///           Asserts XamlLoadPermission.
        /// Safe: _xamlLoadPermission was set critically, and was demanded when the reader was received 
        ///       in DeferrableContent.ctor
        /// </SecurityNote> 
//        private object 
		CreateObject:function(/*KeyRecord*/ key)
        { 
            /*System.Xaml.XamlReader*/var xamlReader = this._reader.ReadObject(key);
            // v3 Markup Compiler will occasionally produce deferred
            // content with keys but no values.  We need to allow returning
            // null in this scenario to match v3 compat and not throw an 
            // error.
            if (xamlReader == null) 
                return null; 

            /*Uri*/var baseUri = (this._rootElement instanceof IUriContext) ? this._rootElement.BaseUri : this._baseUri; 
            if (this._xamlLoadPermission != null)
            {
                this._xamlLoadPermission.Assert();
                try 
                {
                    return WpfXamlLoader.LoadDeferredContent( 
                        xamlReader, _objectWriterFactory, false /*skipJournaledProperites*/, 
                        _rootElement, _objectWriterSettings, baseUri);
                } 
                finally
                {
                    CodeAccessPermission.RevertAssert();
                } 
            }
            else 
            { 
                return WpfXamlLoader.LoadDeferredContent(
                        xamlReader, _objectWriterFactory, false /*skipJournaledProperites*/, 
                        _rootElement, _objectWriterSettings, baseUri);
            }
        },
 
        // Moved "Lookup()" from 3.5 BamlRecordReader to 4.0 ResourceDictionary
//        internal object 
		Lookup:function(/*object*/ key, /*bool*/ allowDeferredResourceReference, 
				/*bool*/ mustReturnDeferredResourceReference, /*bool*/ canCacheAsThemeResource) 
        { 
            if (allowDeferredResourceReference)
            { 
                // Attempt to delay load resources from ResourceDictionaries
//                bool canCache;
                return this.FetchResource(key, allowDeferredResourceReference, mustReturnDeferredResourceReference, 
                		canCacheAsThemeResource, /*out canCache*/{"canCache" : null});
            } 
            else
            { 
                if (!mustReturnDeferredResourceReference) 
                {
                    return this[key]; 
                }
                else
                {
                    return new DeferredResourceReferenceHolder(key, this.Get(key)); 
                }
            } 
        }, 

        // Add an owner for this dictionary 
//        internal void 
		AddOwner:function(/*DispatcherObject*/ owner)
        { 
            if (this._inheritanceContext == null) 
            {
                // the first owner gets to be the InheritanceContext for 
                // all the values in the dictionary that want one.
                /*DependencyObject*/var inheritanceContext = owner instanceof DependencyObject ? owner : null;

                if (inheritanceContext != null) 
                {
                	this._inheritanceContext = inheritanceContext; //new WeakReference(inheritanceContext); 
 
                    // set InheritanceContext for the existing values
                	this.AddInheritanceContextToValues(); 
                }
                else
                {
                    // if the first owner is ineligible, use a dummy 
                	this._inheritanceContext = DummyInheritanceContext; //new WeakReference(DummyInheritanceContext);
 
                    // do not call AddInheritanceContextToValues - 
                    // the owner is an Application, and we'll be
                    // calling SealValues soon, which takes care 
                    // of InheritanceContext as well
                }

            } 

            /*FrameworkElement*/var fe = owner instanceof FrameworkElement ? owner : null; 
            if (fe != null) 
            {
                if (this._ownerFEs == null) 
                {
                	this._ownerFEs = new ArrayList(); // new WeakReferenceList(1); cym modified
                }
                else if (this._ownerFEs.Contains(fe) && this.ContainsCycle(this)) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryInvalidMergedDictionary)); 
                } 

                // Propagate the HasImplicitStyles flag to the new owner 
                if (this.HasImplicitStyles)
                {
                    fe.ShouldLookupImplicitStyles = true;
                } 

                this._ownerFEs.Add(fe); 
            } 
            else
            { 
                /*FrameworkContentElement*/var fce = owner instanceof FrameworkContentElement ? owner : null;
                if (fce != null)
                {
                    if (this._ownerFCEs == null) 
                    {
                    	this._ownerFCEs = new ArrayList(); // new WeakReferenceList(1); cym modified 
                    } 
                    else if (this._ownerFCEs.Contains(fce) && ContainsCycle(this))
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryInvalidMergedDictionary));
                    }

                    // Propagate the HasImplicitStyles flag to the new owner 
                    if (this.HasImplicitStyles)
                    { 
                        fce.ShouldLookupImplicitStyles = true; 
                    }
 
                    this._ownerFCEs.Add(fce);
                }
                else
                { 
                    /*Application*/var app = owner instanceof Application ? owner : null;
                    if (app != null) 
                    { 
                        if (this._ownerApps == null)
                        { 
                        	this._ownerApps = new ArrayList(); // new WeakReferenceList(1); cym modified
                        }
                        else if (this._ownerApps.Contains(app) && ContainsCycle(this))
                        { 
                            throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryInvalidMergedDictionary));
                        } 
 
                        // Propagate the HasImplicitStyles flag to the new owner
                        if (this.HasImplicitStyles) 
                        {
                            app.HasImplicitStylesInResources = true;
                        }
 
                        this._ownerApps.Add(app);
 
                        // Seal all the styles and templates in this app dictionary
                        this.SealValues();
                    }
                } 
            }
 
            this.AddOwnerToAllMergedDictionaries(owner); 

            // This dictionary will be marked initialized if no one has called BeginInit on it. 
            // This is done now because having an owner is like a parenting operation for the dictionary.
            this.TryInitialize();
        },
 
        // Remove an owner for this dictionary
//        internal void 
		RemoveOwner:function(/*DispatcherObject*/ owner) 
        { 
            /*FrameworkElement*/var fe = owner instanceof FrameworkElement ? owner : null;
            if (fe != null) 
            {
                if (this._ownerFEs != null)
                {
                	this._ownerFEs.Remove(fe); 

                    if (this._ownerFEs.Count == 0) 
                    { 
                    	this._ownerFEs = null;
                    } 
                }
            }
            else
            { 
                /*FrameworkContentElement*/var fce = owner instanceof FrameworkContentElement ? owner : null;
                if (fce != null) 
                { 
                    if (this._ownerFCEs != null)
                    { 
                    	this._ownerFCEs.Remove(fce);

                        if (this._ownerFCEs.Count == 0)
                        { 
                        	this._ownerFCEs = null;
                        } 
                    } 
                }
                else 
                {
                    /*Application*/var app = owner instanceof Application ? owner : null;
                    if (app != null)
                    { 
                        if (this._ownerApps != null)
                        { 
                        	this._ownerApps.Remove(app); 

                            if (this._ownerApps.Count == 0) 
                            {
                            	this._ownerApps = null;
                            }
                        } 
                    }
                } 
            } 

            if (owner == this.InheritanceContext) 
            {
            	this.RemoveInheritanceContextFromValues();
                this._inheritanceContext = null;
            } 

            this.RemoveOwnerFromAllMergedDictionaries(owner); 
        }, 

        // Check if the given is an owner to this dictionary 
//        internal bool 
		ContainsOwner:function(/*DispatcherObject*/ owner)
        {
            /*FrameworkElement*/var fe = owner instanceof FrameworkElement ? owner : null;
            if (fe != null) 
            {
                return (this._ownerFEs != null && this._ownerFEs.Contains(fe)); 
            } 
            else
            { 
                /*FrameworkContentElement*/var fce = owner instanceof FrameworkContentElement ? owner : null;
                if (fce != null)
                {
                    return (this._ownerFCEs != null && this._ownerFCEs.Contains(fce)); 
                }
                else 
                { 
                    /*Application*/var app = owner instanceof Application ? owner : null;
                    if (app != null) 
                    {
                        return (this._ownerApps != null && this._ownerApps.Contains(app));
                    }
                } 
            }
 
            return false; 
        },
 
        // Helper method that tries to set IsInitialized to true if BeginInit hasn't been called before this.
        // This method is called on AddOwner
//        private void 
		TryInitialize:function()
        { 
            if (!this.IsInitializePending &&
                !this.IsInitialized) 
            { 
            	this.IsInitialized = true;
            } 
        },

        // Call FrameworkElement.InvalidateTree with the right data
//        private void 
		NotifyOwners:function(/*ResourcesChangeInfo*/ info) 
        {
            var shouldInvalidate   = this.IsInitialized; 
            var hasImplicitStyles  = info.IsResourceAddOperation && this.HasImplicitStyles; 

            if (shouldInvalidate || hasImplicitStyles) 
            {
                // Invalidate all FE owners
                if (this._ownerFEs != null)
                { 
                    for/*each*/ (var i=0; i<this._ownerFEs.Count; i++) //Object o in this._ownerFEs)
                    { 
                    	var o = this._ownerFEs.Get(i);
                        /*FrameworkElement*/var fe = o instanceof FrameworkElement ? o : null; 
                        if (fe != null)
                        { 
                            // Set the HasImplicitStyles flag on the owner
                            if (hasImplicitStyles)
                                fe.ShouldLookupImplicitStyles = true;
 
                            // If this dictionary has been initialized fire an invalidation
                            // to let the tree know of this change. 
                            if (shouldInvalidate) 
                                TreeWalkHelper.InvalidateOnResourcesChange(fe, null, info);
                        } 
                    }
                }

                // Invalidate all FCE owners 
                if (this._ownerFCEs != null)
                { 
                    for/*each*/ (var i=0; i<this._ownerFCEs.Count; i++) //Object o in this._ownerFCEs) 
                    {
                    	var o = this._ownerFCEs.Get(i);
                        /*FrameworkContentElement*/var fce = o instanceof FrameworkContentElement ? o : null; 
                        if (fce != null)
                        {
                            // Set the HasImplicitStyles flag on the owner
                            if (hasImplicitStyles) 
                                fce.ShouldLookupImplicitStyles = true;
 
                            // If this dictionary has been initialized fire an invalidation 
                            // to let the tree know of this change.
                            if (shouldInvalidate) 
                                TreeWalkHelper.InvalidateOnResourcesChange(null, fce, info);
                        }
                    }
                } 

                // Invalidate all App owners 
                if (this._ownerApps != null) 
                {
                    for/*each*/ (var i=0; i<this._ownerApps; i++) //Object o in this._ownerApps) 
                    {
                    	var o = this._ownerApps.Get(i);
                        /*Application*/var app = o instanceof Application ? o : null;
                        if (app != null)
                        { 
                            // Set the HasImplicitStyles flag on the owner
                            if (hasImplicitStyles) 
                                app.HasImplicitStylesInResources = true; 

                            // If this dictionary has been initialized fire an invalidation 
                            // to let the tree know of this change.
                            if (shouldInvalidate)
                                app.InvalidateResourceReferences(info);
                        } 
                    }
                } 
            } 
        },
 
        /// <summary>
        /// Fetches the resource corresponding to the given key from this dictionary.
        /// Returns a DeferredResourceReference if the object has not been inflated yet.
        /// </summary> 
//        internal object 
		FetchResource:function(
            /*object*/      resourceKey, 
            /*bool*/        allowDeferredResourceReference, 
            /*bool*/        mustReturnDeferredResourceReference,
            /*out bool    canCache*/canCacheOut) 
        {
            return FetchResource(
                resourceKey,
                allowDeferredResourceReference, 
                mustReturnDeferredResourceReference,
                true /*canCacheAsThemeResource*/, 
                /*out canCache*/canCacheOut); 
        },
 
        /// <summary>
        /// Fetches the resource corresponding to the given key from this dictionary.
        /// Returns a DeferredResourceReference if the object has not been inflated yet.
        /// </summary> 
//        private object 
		FetchResource:function(
            /*object*/      resourceKey, 
            /*bool*/        allowDeferredResourceReference, 
            /*bool*/        mustReturnDeferredResourceReference,
            /*bool*/        canCacheAsThemeResource, 
            /*out bool    canCache*/canCacheOut)
        {
			if(arguments.length == 4){
				canCacheOut = canCacheAsThemeResource;
				canCacheAsThemeResource = true;
			}
//            Debug.Assert(resourceKey != null, "ResourceKey cannot be null");
 
            if (allowDeferredResourceReference)
            { 
//                if (this.ContainsBamlObjectFactory(resourceKey) || 
//                    (mustReturnDeferredResourceReference && this.Contains(resourceKey)))
//                { 
            	
                if (/*this.ContainsBamlObjectFactory(resourceKey) ||*/ 
                        (mustReturnDeferredResourceReference && this.Contains(resourceKey)))
                {
                    canCache = false;

                    /*DeferredResourceReference*/var deferredResourceReference;
                    if (!this.IsThemeDictionary) 
                    {
                        if (this._ownerApps != null) 
                        { 
                            deferredResourceReference = new DeferredAppResourceReference(this, resourceKey);
                        } 
                        else
                        {
                            deferredResourceReference = new DeferredResourceReference(this, resourceKey);
                        } 

                        // Cache the deferredResourceReference so that it can be validated 
                        // in case of a dictionary change prior to its inflation 
                        if (this._deferredResourceReferences == null)
                        { 
                        	this._deferredResourceReferences = new WeakReferenceList();
                        }

                        this._deferredResourceReferences.Add( deferredResourceReference, true /*SkipFind*/); 
                    }
                    else 
                    { 
                        deferredResourceReference = new DeferredThemeResourceReference(this, resourceKey, canCacheAsThemeResource);
                    } 

                    return deferredResourceReference;
                }
            } 

            return this.GetValue(resourceKey, /*out canCache*/canCacheOut); 
        }, 

        /// <summary> 
        /// Validate the deferredResourceReference with the given key. Key could be null meaning
        /// some catastrophic operation occurred so simply validate all DeferredResourceReferences
        /// </summary>
//        private void 
		ValidateDeferredResourceReferences:function(/*object*/ resourceKey) 
        {
            if (this._deferredResourceReferences != null) 
            { 
                for/*each*/ (var i=0; i< this._deferredResourceReferences.Count; i++) //Object o in this._deferredResourceReferences)
                { 
                	var o =this._deferredResourceReferences.Get(i);
                    /*DeferredResourceReference*/
                	var deferredResourceReference = o instanceof DeferredResourceReference ? o :null;
                    if (deferredResourceReference != null && (resourceKey == null || Object.Equals(resourceKey, deferredResourceReference.Key)))
                    { 
                        // This will inflate the deferred reference, causing it
                        // to be removed from the list.  The list may also be 
                        // purged of dead references. 
                        deferredResourceReference.GetValue(BaseValueSourceInternal.Unknown);
                    } 
                }
            }
        },
 

        /// <summary> 
        /// Called when the MergedDictionaries collection changes 
        /// </summary>
        /// <param name="sender"></param> 
        /// <param name="e"></param>
//        private void 
		OnMergedDictionariesChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
            /*List<ResourceDictionary>*/var oldDictionaries = null; 
            /*List<ResourceDictionary>*/var newDictionaries = null;
            /*ResourceDictionary*/var mergedDictionary; 
            /*ResourcesChangeInfo*/var info; 

            if (e.Action != NotifyCollectionChangedAction.Reset) 
            {
//                Invariant.Assert(
//                    (e.NewItems != null && e.NewItems.Count > 0) ||
//                    (e.OldItems != null && e.OldItems.Count > 0), 
//                    "The NotifyCollectionChanged event fired when no dictionaries were added or removed");
 
 
                // If one or more resource dictionaries were removed we
                // need to remove the owners they were given by their 
                // parent ResourceDictionary.

                if (e.Action == NotifyCollectionChangedAction.Remove
                    || e.Action == NotifyCollectionChangedAction.Replace) 
                {
                    oldDictionaries = new List/*<ResourceDictionary>*/(e.OldItems.Count); 
 
                    for (var i = 0; i < e.OldItems.Count; i++)
                    { 
                        mergedDictionary = e.OldItems[i];
                        oldDictionaries.Add(mergedDictionary);

                        this.RemoveParentOwners(mergedDictionary); 
                    }
                } 
 
                // If one or more resource dictionaries were added to the merged
                // dictionaries collection we need to send down the parent 
                // ResourceDictionary's owners.

                if (e.Action == NotifyCollectionChangedAction.Add
                    || e.Action == NotifyCollectionChangedAction.Replace) 
                {
                    newDictionaries = new List/*<ResourceDictionary>*/(e.NewItems.Count); 
 
                    for (var i = 0; i < e.NewItems.Count; i++)
                    { 
                        mergedDictionary = e.NewItems[i];
                        newDictionaries.Add(mergedDictionary);

                        // If the merged dictionary HasImplicitStyle mark the outer dictionary the same. 
                        if (!this.HasImplicitStyles && mergedDictionary.HasImplicitStyles)
                        { 
                        	this.HasImplicitStyles = true; 
                        }
 
                        // If the parent dictionary is a theme dictionary mark the merged dictionary the same.
                        if (this.IsThemeDictionary)
                        {
                            mergedDictionary.IsThemeDictionary = true; 
                        }
 
                        this.PropagateParentOwners(mergedDictionary); 
                    }
                } 

                info = new ResourcesChangeInfo(oldDictionaries, newDictionaries, false, false, null);
            }
            else 
            {
                // Case when MergedDictionary collection is cleared 
                info = ResourcesChangeInfo.CatastrophicDictionaryChangeInfo; 
            }
 
            // Notify the owners of the change and fire
            // invalidation if already initialized

            this.NotifyOwners(info); 
        },
 
        /// <summary> 
        /// Adds the given owner to all merged dictionaries of this ResourceDictionary
        /// </summary> 
        /// <param name="owner"></param>
//        private void 
		AddOwnerToAllMergedDictionaries:function(/*DispatcherObject*/ owner)
        {
            if (this._mergedDictionaries != null) 
            {
                for (var i = 0; i < this._mergedDictionaries.Count; i++) 
                { 
                	this._mergedDictionaries.Get(i).AddOwner(owner);
                } 
            }
        },

        /// <summary> 
        ///
        /// </summary> 
        /// <param name="owner"></param> 
//        private void 
		RemoveOwnerFromAllMergedDictionaries:function(/*DispatcherObject*/ owner)
        { 
            if (this._mergedDictionaries != null)
            {
                for (var i = 0; i < this._mergedDictionaries.Count; i++)
                { 
                	this._mergedDictionaries.Get(i).RemoveOwner(owner);
                } 
            } 
        },
 
        /// <summary>
        /// This sends down the owners of this ResourceDictionary into the given
        /// merged dictionary.  We do this because whenever a merged dictionary
        /// changes it should invalidate all owners of its parent ResourceDictionary. 
        ///
        /// Note that AddOwners throw if the merged dictionary already has one of the 
        /// parent's owners.  This implies that either we're putting a dictionary 
        /// into its own MergedDictionaries collection or we're putting the same
        /// dictionary into the collection twice, neither of which are legal. 
        /// </summary>
        /// <param name="mergedDictionary"></param>
//        private void 
		PropagateParentOwners:function(/*ResourceDictionary*/ mergedDictionary)
        { 
            if (this._ownerFEs != null)
            { 
//                Invariant.Assert(_ownerFEs.Count > 0); 

                if (mergedDictionary._ownerFEs == null) 
                {
                    mergedDictionary._ownerFEs = new WeakReferenceList(this._ownerFEs.Count);
                }
 
                for/*each*/ (var i=0; i<this._ownerFEs.Count; i++)// object o in _ownerFEs)
                { 
                	var o = this._ownerFEs.Get(i);
                    /*FrameworkElement*/var fe = o instanceof FrameworkElement ? o : null; 
                    if (fe != null)
                        mergedDictionary.AddOwner(fe); 
                }
            }

            if (this._ownerFCEs != null) 
            {
//                Invariant.Assert(_ownerFCEs.Count > 0); 
 
                if (mergedDictionary._ownerFCEs == null)
                { 
                    mergedDictionary._ownerFCEs = new WeakReferenceList(this._ownerFCEs.Count);
                }

                for/*each*/ (var i=0; i<this._ownerFCEs.Count; i++) //object o in _ownerFCEs) 
                {
                	var o = this._ownerFCEs.Get(i);
                    /*FrameworkContentElement*/var fce = o instanceof FrameworkContentElement ? o : null; 
                    if (fce != null) 
                        mergedDictionary.AddOwner(fce);
                } 
            }

            if (_ownerApps != null)
            { 
//                Invariant.Assert(_ownerApps.Count > 0);
 
                if (mergedDictionary._ownerApps == null) 
                {
                    mergedDictionary._ownerApps = new WeakReferenceList(_ownerApps.Count); 
                }

                for/*each*/ (var i=0; i<this._ownerApps.Count; i++) //object o in _ownerApps)
                { 
                	var o = this._ownerApps.Get(i);
                    /*Application*/var app = o instanceof Application ? o : null;
                    if (app != null) 
                        mergedDictionary.AddOwner(app); 
                }
            } 
        },


        /// <summary> 
        /// Removes the owners of this ResourceDictionary from the given
        /// merged dictionary.  The merged dictionary will be left with 
        /// whatever owners it had before being merged. 
        /// </summary>
        /// <param name="mergedDictionary"></param> 
//        internal void 
		RemoveParentOwners:function(/*ResourceDictionary*/ mergedDictionary)
        {
            if (this._ownerFEs != null)
            { 
                for/*each*/ (var i=0; i<this._ownerFEs.Count; i++) //Object o in this._ownerFEs)
                { 
                	var o = this._ownerFEs.Get(i);
                    /*FrameworkElement*/var fe = o instanceof FrameworkElement ? o : null; 
                    mergedDictionary.RemoveOwner(fe);
 
                }
            }

            if (this._ownerFCEs != null) 
            {
//                Invariant.Assert(_ownerFCEs.Count > 0); 
 
                for/*each*/ (var i=0; i<this._ownerFCEs.Count; i++) //(Object o in _ownerFCEs)
                { 
                  	var o = this._ownerFCEs.Get(i);
                    /*FrameworkContentElement*/var fec = o instanceof FrameworkContentElement ? o : null;
                    mergedDictionary.RemoveOwner(fec);

                } 
            }
 
            if (_ownerApps != null) 
            {
//                Invariant.Assert(_ownerApps.Count > 0); 

                for/*each*/ (var i=0; i<this._ownerApps.Count; i++) //(Object o in _ownerApps)
                {
                	var o = this._ownerApps.Get(i);
                    /*Application*/var app = o instanceof Application ? o : null; 
                    mergedDictionary.RemoveOwner(app);
 
                } 
            }
        }, 

//        private bool 
		ContainsCycle:function(/*ResourceDictionary*/ origin)
        {
            for (var i=0; i<MergedDictionaries.Count; i++) 
            {
                /*ResourceDictionary*/var mergedDictionary = MergedDictionaries[i]; 
                if (mergedDictionary == origin || mergedDictionary.ContainsCycle(origin)) 
                {
                    return true; 
                }
            }

            return false; 
        },
 
        //
        //  This method 
        //  1. Seals all the freezables/styles/templates that belong to this App/Theme/Style/Template ResourceDictionary 
        //
//        private void
		SealValues:function() 
        {
//            Debug.Assert(IsThemeDictionary || _ownerApps != null || IsReadOnly, "This must be an App/Theme/Style/Template ResourceDictionary");

            // sealing can cause DeferredResourceReferences to be replaced by the 
            // inflated values (Dev11 371997).  This changes the Values collection,
            // so we can't iterate it directly.  Instead, iterate over a copy. 
            var count = this._baseDictionary.Count; 
            if (count > 0)
            { 
                /*object[]*/var values = []; //new object[count];
                this._baseDictionary.Values.CopyTo(values, 0);

                for/*each*/ (/*object*/var v in values) 
                {
                    this.SealValue(values[v]); 
                } 
            }
        },

        //
        //  This method
        //  1. Sets the InheritanceContext of the value to the dictionary's principal owner 
        //  2. Seals the freezable/style/template that is to be placed in an App/Theme/Style/Template ResourceDictionary
        // 
//        private void 
		SealValue:function(/*object*/ value) 
        {
            /*DependencyObject*/var inheritanceContext = this.InheritanceContext; 
            if (inheritanceContext != null)
            {
            	this.AddInheritanceContext(inheritanceContext, value);
            } 

            if (this.IsThemeDictionary || this._ownerApps != null || this.IsReadOnly) 
            { 
                // If the value is a ISealable then seal it
                StyleHelper.SealIfSealable(value); 
            }
        },

        // add inheritance context to a value 
//        private void 
		AddInheritanceContext:function(/*DependencyObject*/ inheritanceContext, /*object*/ value)
        { 
            // The VisualBrush.Visual property is the "friendliest", i.e. the 
            // most likely to be accepted by the resource as FEs need to accept
            // being rooted by a VisualBrush. 
            //
            // NOTE:  Freezable.Debug_VerifyContextIsValid() contains a special
            //        case to allow this with the VisualBrush.Visual property.
            //        Changes made here will require updates in Freezable.cs 
//            if (inheritanceContext.ProvideSelfAsInheritanceContext(value, VisualBrush.VisualProperty))
//            { 
//                // if the assignment was successful, seal the value's InheritanceContext. 
//                // This makes sure the resource always gets inheritance-related information
//                // from its point of definition, not from its point of use. 
//                /*DependencyObject*/var doValue = value instanceof DependencyObject ? value : null;
//                if (doValue != null)
//                {
//                    doValue.IsInheritanceContextSealed = true; 
//                }
//            } 
        }, 

        // add inheritance context to all values that came from this dictionary 
//        private void 
		AddInheritanceContextToValues:function()
        {
            /*DependencyObject*/var inheritanceContext = this.InheritanceContext;
 
            // setting InheritanceContext can cause values to be replaced (Dev11 380869).
            // This changes the Values collection, so we can't iterate it directly. 
            // Instead, iterate over a copy. 
            var count = this._baseDictionary.Count;
            if (count > 0) 
            {
                /*object[]*/var values = []; //new object[count];
                this._baseDictionary.Values.CopyTo(values, 0);
 
                for/*each*/ (var v in values)
                { 
                	this.AddInheritanceContext(inheritanceContext, values[v]); 
                }
            } 
        },

        // remove inheritance context from a value, if it came from this dictionary
//        private void 
		RemoveInheritanceContext:function(/*object*/ value) 
        {
            /*DependencyObject*/var doValue = value instanceof DependencyObject ? value : null; 
            /*DependencyObject*/var inheritanceContext = this.InheritanceContext; 

            if (doValue != null && inheritanceContext != null && 
                doValue.IsInheritanceContextSealed &&
                doValue.InheritanceContext == inheritanceContext)
            {
                doValue.IsInheritanceContextSealed = false; 
                inheritanceContext.RemoveSelfAsInheritanceContext(doValue, VisualBrush.VisualProperty);
            } 
        }, 

        // remove inheritance context from all values that came from this dictionary 
//        private void 
		RemoveInheritanceContextFromValues:function()
        {
            for/*each*/ (var i=0; i <this._baseDictionary.Values; i++) //object value in _baseDictionary.Values)
            { 
                this.RemoveInheritanceContext(this._baseDictionary.Values.Get(i));
            } 
        }, 

 
        // Sets the HasImplicitStyles flag if the given key is of type Type.
//        private void 
		UpdateHasImplicitStyles:function(/*object*/ key)
        {
            // Update the HasImplicitStyles flag 
            if (!this.HasImplicitStyles)
            { 
            	this.HasImplicitStyles = ((key instanceof Type ? key : null) != null); 
            }
        }, 

 
//        private void 
		WritePrivateFlag:function(/*PrivateFlags*/ bit, /*bool*/ value)
        { 
            if (value) 
            {
                this._flags |= bit; 
            }
            else
            {
            	this._flags &= ~bit; 
            }
        }, 
 
//        private bool
		ReadPrivateFlag:function(/*PrivateFlags*/ bit)
        { 
            return (this._flags & bit) != 0;
        },

        /// <SecurityNote> 
        /// Critical: accesses critical field _reader
        /// Safe: keeps LoadPermission in [....] by nulling it out as well 
        /// </SecurityNote> 
//        private void 
		CloseReader:function() 
        {
			this._reader.Close();
			this._reader = null;
			this._xamlLoadPermission = null; 
        },
 
        /// <SecurityNote> 
        /// Critical: sets critical fields _reader and _xamlLoadPermission.
        /// Safe: copies them from another ResourceDictionary instance, where they were set critically. 
        /// </SecurityNote>
//        private void 
		CopyDeferredContentFrom:function(/*ResourceDictionary*/ loadedRD)
        { 
            _buffer = loadedRD._buffer;
            _bamlStream = loadedRD._bamlStream; 
            _startPosition = loadedRD._startPosition; 
            _contentSize = loadedRD._contentSize;
            _objectWriterFactory = loadedRD._objectWriterFactory; 
            _objectWriterSettings = loadedRD._objectWriterSettings;
            _rootElement = loadedRD._rootElement;
            _reader = loadedRD._reader;
            _xamlLoadPermission = loadedRD._xamlLoadPermission; 
            _numDefer = loadedRD._numDefer;
            _deferredLocationList = loadedRD._deferredLocationList; 
        }, 

//        private void  
		MoveDeferredResourceReferencesFrom:function(/*ResourceDictionary*/ loadedRD) 
        {
            // copy the list
            this._deferredResourceReferences = loadedRD._deferredResourceReferences;
 
            // redirect each entry toward its new owner
            if (this._deferredResourceReferences != null) 
            { 
                for/*each*/ (/*DeferredResourceReference*/var drr in this._deferredResourceReferences)
                { 
                    drr.Dictionary = this;
                }
            }
        } 
	});
	
	Object.defineProperties(ResourceDictionary.prototype,{
	
        ///<summary>
        ///     List of ResourceDictionaries merged into this Resource Dictionary 
        ///</summary> 
//        public Collection<ResourceDictionary> 
		MergedDictionaries:
        { 
            get:function()
            {
                if (_mergedDictionaries == null)
                { 
                    this._mergedDictionaries = new ResourceDictionaryCollection(this);
                    this._mergedDictionaries.CollectionChanged.Combine(this, this.OnMergedDictionariesChanged); 
                } 

                return this._mergedDictionaries; 
            }
        },

        ///<summary> 
        ///     Uri to load this resource from, it will clear the current state of the ResourceDictionary
        ///</summary> 
//        public Uri 
        Source:
        { 
            get:function()
            {
                return _source;
            }, 
            set:function(value)
            { 
                if (value == null || String.IsNullOrEmpty(value.OriginalString)) 
                {
                    throw new ArgumentException(SR.Get(SRID.ResourceDictionaryLoadFromFailure, value == null ? "''" : value.ToString())); 
                }

                this._source = value;
 
                this.Clear();
 
                var uri = BindUriHelper.GetResolvedUri(_baseUri, _source); 
                /*WebRequest*/var request = WpfWebRequestHelper.CreateRequest(uri);
                WpfWebRequestHelper.ConfigCachePolicy(request, false); 
                /*ContentType*/var contentType = null;
                /*Stream*/var s = null;

                try 
                {
                     s = WpfWebRequestHelper.GetResponseStream(request, /*out contentType*/contentTypeOut); 
                } 
                catch (e)
                { 
                    if (this.IsSourcedFromThemeDictionary)
                    {
                        switch (this._fallbackState)
                        { 
                            case FallbackState.Classic:
                                { 
                            		this._fallbackState = FallbackState.Generic; 
                                    var classicResourceUri = ThemeDictionaryExtension.GenerateFallbackUri(this, SystemResources.ClassicResourceName);
//                                    Debug.Assert(classicResourceUri != null); 

                                    this.Source = classicResourceUri;
                                    // After this recursive call has returned we are sure
                                    // that we have tried all fallback paths and so now 
                                    // reset the _fallbackState
                                    this._fallbackState = FallbackState.Classic; 
                                } 
                                break;
                            case FallbackState.Generic: 
                                {
                            		this._fallbackState = FallbackState.None;
                                    /*Uri*/var genericResourceUri = ThemeDictionaryExtension.GenerateFallbackUri(this, SystemResources.GenericResourceName);
 
//                                    Debug.Assert(genericResourceUri != null);
                                    this.Source = genericResourceUri; 
 
                                }
                                break; 
                        }
                        return;
                    }
/*                    else 
                    {
                        throw; 
                    } 
*/                }
 
                // MimeObjectFactory.GetObjectAndCloseStream will try to find the object converter basing on the mime type.
                // It can be a [....]/async converter. It's the converter's responsiblity to close the stream.
                // If it fails to find a convert, this call will return null.
                /*System.Windows.Markup.XamlReader*/var asyncObjectConverter; 
                /*ResourceDictionary*/var loadedRD = MimeObjectFactory.GetObjectAndCloseStream(s, contentType, uri, false, 
                		false, false /*allowAsync*/, false /*isJournalNavigation*/, /*out asyncObjectConverter*/asyncObjectConverterOut);
                
                loadedRD = loadedRD instanceof ResourceDictionary ? loadedRD : null; 
 
                if (loadedRD == null)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryLoadFromFailure, _source.ToString()));
                }

                // ReferenceCopy all the key-value pairs in the _baseDictionary 
                this._baseDictionary = loadedRD._baseDictionary;
 
                // ReferenceCopy all the entries in the MergedDictionaries collection 
                this._mergedDictionaries = loadedRD._mergedDictionaries;
 
                // ReferenceCopy all of the deferred content state
                this.CopyDeferredContentFrom(loadedRD);

                // Take over the deferred resource references 
                this.MoveDeferredResourceReferencesFrom(loadedRD);
 
                // Copy over the HasImplicitStyles flag 
                this.HasImplicitStyles = loadedRD.HasImplicitStyles;
 
                // Set inheritance context on the copied values
                if (this.InheritanceContext != null)
                {
                	this.AddInheritanceContextToValues(); 
                }
 
                // Propagate parent owners to each of the acquired merged dictionaries 
                if (this._mergedDictionaries != null)
                { 
                    for (var i = 0; i < this._mergedDictionaries.Count; i++)
                    {
                    	this.PropagateParentOwners(_mergedDictionaries[i]);
                    } 
                }
 
                if (!this.IsInitializePending) 
                {
                    // Fire Invalidations for the changes made by asigning a new Source 
                	this.NotifyOwners(new ResourcesChangeInfo(null, this));
                }
            }
        }, 

        /// <summary> 
        ///     Accessor for the base uri of the ResourceDictionary
        /// </summary> 
//        Uri System.Windows.Markup.IUriContext.
        BaseUri: 
        {
            get:function() 
            {
                return  this._baseUri;
            },
            set:function(value) 
            {
            	this._baseUri = value; 
            } 
        },
 
        /// <summary> 
        ///     Gets a value indicating whether the IDictionary has a fixed size.
        /// </summary> 
//        public bool 
        IsFixedSize:
        {
            get:function() { return this._baseDictionary.IsFixedSize; }
        }, 

        /// <summary> 
        ///     Gets a value indicating whether the ResourceDictionary is read-only. 
        /// </summary>
//        public bool 
        IsReadOnly: 
        {
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsReadOnly); },
            /*internal*/ set:function(value)
            { 
            	this.WritePrivateFlag(PrivateFlags.IsReadOnly, value);
 
                if (value == true) 
                {
                    // Seal all the styles and templates in this dictionary 
                	this.SealValues();
                }

                // Set all the merged resource dictionaries as ReadOnly 
                if (this._mergedDictionaries != null)
                { 
                    for (var i = 0; i < this._mergedDictionaries.Count; i++) 
                    {
                    	this._mergedDictionaries.Get(i).IsReadOnly = value; 
                    }
                }
            }
        }, 


        // This should only be called in the deferred BAML loading scenario.  We 
        // cache all the data that we need away and then get rid of the actual object.
        // No one needs to actually get this property so we're returning null.  This 
        // property has to be public since the XAML parser cannot set this internal 
        // property in this scenario.
//        public DeferrableContent 
        DeferrableContent:
        {
            get:function()
            { 
                return null;
            }, 
            set:function(value) 
            {
                this.SetDeferrableContent(value); 
            }
        },

        /// <summary>
        ///     Gets a copy of the ICollection containing the keys of the IDictionary.
        /// </summary> 
//        public ICollection 
        Keys:
        { 
            get:function() 
            {
                /*object[]*/var keysCollection = []; //new object[Count]; 
                this._baseDictionary.Keys.CopyTo(keysCollection, 0);
                return keysCollection;
            }
        }, 

        /// <summary> 
        ///     Gets an ICollection containing the values in the Hashtable 
        /// </summary>
        /// <value>An ICollection containing the values in the Hashtable</value> 
//        public ICollection 
        Values:
        {
            get:function()
            { 
                return new ResourceValuesCollection(this);
            } 
        },

        /// <summary> 
        ///     Gets the number of elements contained in the ICollection.
        /// </summary> 
//        public int
        Count:
        {
            get:function() { return this._baseDictionary.Count; }
        },

//        internal WeakReferenceList 
        DeferredResourceReferences:
        {
            get:function() { return this._deferredResourceReferences; } 
        },
 
//        private DependencyObject 
        InheritanceContext:
        {
            get:function() 
            {
//                return (this._inheritanceContext != null) 
//                    ? /*(DependencyObject)*/this._inheritanceContext.Target 
//                    : null;
            	
            	return this._inheritanceContext;
            } 
        },

//        private bool 
        IsInitialized:
        { 
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsInitialized); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsInitialized, value); } 
        }, 

//        private bool 
        IsInitializePending: 
        {
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsInitializePending); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsInitializePending, value); }
        }, 

//        private bool 
        IsThemeDictionary: 
        { 
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsThemeDictionary); },
            set:function(value) 
            {
                if (this.IsThemeDictionary != value)
                {
                	this.WritePrivateFlag(PrivateFlags.IsThemeDictionary, value); 
                    if (value)
                    { 
                    	this.SealValues(); 
                    }
                    if (this._mergedDictionaries != null) 
                    {
                        for (var i=0; i<this._mergedDictionaries.Count; i++)
                        {
                        	this._mergedDictionaries.Get(i).IsThemeDictionary = value; 
                        }
                    } 
                } 
            }
        }, 

//        internal bool 
        HasImplicitStyles:
        {
            get:function() { return this.ReadPrivateFlag(PrivateFlags.HasImplicitStyles); }, 
            set:function(value) { this.WritePrivateFlag(PrivateFlags.HasImplicitStyles, value); }
        } 
 
	});
	
//    static ResourceDictionary()
	ResourceDictionary.Init = function()
    { 
//        DummyInheritanceContext.DetachFromDispatcher();
    }; 
	
	ResourceDictionary.Type = new Type("ResourceDictionary", ResourceDictionary, 
			[IDictionary.Type, ISupportInitialize.Type, IUriContext.Type, INameScope.Type]);
	return ResourceDictionary;
});

//
//
//
// 
// 
//        // flag set by ThemeDictionaryExtension 
//        // to know that classic/generic Uri's should be used as fallbacks
//        // when themed dictionary is not found 
////        internal bool IsSourcedFromThemeDictionary = false;
////        private FallbackState _fallbackState = FallbackState.Classic;
//
//        private Hashtable                                 _baseDictionary = null; 
//        private WeakReferenceList                         _ownerFEs = null;
//        private WeakReferenceList                         _ownerFCEs = null; 
//        private WeakReferenceList                         _ownerApps = null; 
//        private WeakReferenceList                         _deferredResourceReferences = null;
//        private ObservableCollection<ResourceDictionary>  _mergedDictionaries = null; 
//        private Uri                                       _source = null;
//        private Uri                                       _baseUri = null;
//        private PrivateFlags                              _flags = 0;
//        private List<KeyRecord>                           _deferredLocationList = null; 
//
//        // Buffer that contains deferable content.  This may be null if a stream was passed 
//        // instead of a buffer.  If a buffer was passed, then a memory stream is made on the buffer 
//        private byte[]          _buffer;
// 
//        // Persistent Stream that contains values.
//        private Stream          _bamlStream;
//
//        // Start position in the stream where the first value record is located.  All offsets for 
//        // the keys are relative to this position.
//        private Int64           _startPosition; 
// 
//        // Size of the delay loaded content, which only includes the value section and not the keys.
//        private Int32           _contentSize; 
//
//        // The root element at the time the deferred content information was given to the dictionary.
//        private object          _rootElement;
// 
//        // The number of keys that correspond to deferred content. When this reaches 0,
//        // the stream can be closed. 
//        private int             _numDefer; 
//
//        // The object that becomes the InheritanceContext of all eligible 
//        // values in the dictionary - typically the principal owner of the dictionary.
//        // We store a weak reference so that the dictionary does not leak the owner.
//        private WeakReference   _inheritanceContext;
// 
//        // a dummy DO, used as the InheritanceContext when the dictionary's owner is
//        // not itself a DO 

//
//        XamlObjectIds _contextXamlObjectIds  = new XamlObjectIds(); 
//
//        private IXamlObjectWriterFactory _objectWriterFactory;
//        private XamlObjectWriterSettings _objectWriterSettings;
// 
//        /// <SecurityNote>
//        /// Critical: Identifies the permission of the stream in _reader. 
//        ///           Will be asserted when realizing deferred content. 
//        /// </SecurityNote>
//        private XamlLoadPermission _xamlLoadPermission;
//
//        /// <summary>
//        /// Critical: _xamlLoadPermission needs to be updated whenever this field is updated. 
//        /// </summary>
//        private Baml2006Reader _reader; 




