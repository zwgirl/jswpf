package org.summer.view.widget;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.stream.Stream;

import org.eclipse.core.internal.content.ContentType;
import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.ThemeDictionaryExtension;
import org.summer.view.appmodel.MimeObjectFactory;
import org.summer.view.widget.baml2006.Baml2006Reader;
import org.summer.view.widget.baml2006.KeyRecord;
import org.summer.view.widget.baml2006.OptimizedStaticResource;
import org.summer.view.widget.baml2006.StaticResource;
import org.summer.view.widget.collection.Collection;
import org.summer.view.widget.collection.DictionaryEntry;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IDictionary;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.internal.WeakReferenceList;
import org.summer.view.widget.markup.INameScope;
import org.summer.view.widget.markup.IUriContext;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.markup.ParserContext;
import org.summer.view.widget.markup.StaticResourceExtension;
import org.summer.view.widget.markup.StaticResourceHolder;
import org.summer.view.widget.markup.WpfXamlLoader;
import org.summer.view.widget.markup.XamlReader;
import org.summer.view.widget.media.animation.VisualBrush;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.permission.XamlLoadPermission;
import org.summer.view.widget.threading.DispatcherObject;
import org.summer.view.widget.xaml.IXamlObjectWriterFactory;
import org.summer.view.widget.xaml.XamlLanguage;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlObjectWriter;
import org.summer.view.widget.xaml.XamlObjectWriterSettings;
import org.summer.view.widget.xaml.XamlType;
import org.summer.view.window.DeferredAppResourceReference;
import org.summer.view.window.DeferredResourceReference;
import org.summer.view.window.DeferredResourceReferenceHolder;
import org.summer.view.window.DeferredThemeResourceReference;
import org.summer.view.window.SystemResources;

/// <summary>
///     Dictionary that holds Resources for Framework components.
/// </summary> 
//[Localizability(LocalizationCategory.Ignore)]
//	    [Ambient] 
// [UsableDuringInitialization(true)]
public class ResourceDictionary implements IDictionary, ISupportInitialize, IUriContext, INameScope
{ 
//    #region Constructor

    /// <summary>
    ///     Constructor for ResourceDictionary 
    /// </summary>
    public ResourceDictionary() 
    { 
        _baseDictionary = new Hashtable();
        IsThemeDictionary = SystemResources.IsSystemResourcesParsing; 
    }

    static //ResourceDictionary()
    { 
        DummyInheritanceContext.DetachFromDispatcher();
    } 

//    #endregion Constructor/

//    #region PublicAPIs

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
    public void CopyTo(DictionaryEntry[] array, int arrayIndex) 
    { 
        if (CanBeAccessedAcrossThreads)
        { 
            /*lock*/synchronized(((ICollection)this).SyncRoot)
            {
                CopyToWithoutLock(array, arrayIndex);
            } 
        }
        else 
        { 
            CopyToWithoutLock(array, arrayIndex);
        } 
    }

    private void CopyToWithoutLock(DictionaryEntry[] array, int arrayIndex)
    { 
        if (array == null)
        { 
            throw new IllegalArgumentException("array"); 
        }

        _baseDictionary.CopyTo(array, arrayIndex);

        int length = arrayIndex + Count;
        for (int i = arrayIndex; i < length; i++) 
        {
            DictionaryEntry entry = array[i]; 
            Object value = entry.Value; 
            boolean canCache;
            OnGettingValuePrivate(entry.Key, /*ref*/ value, /*out*/ canCache); 
            entry.Value = value; // refresh the entry value in case it was changed in the previous call
        }
    }

    ///<summary>
    ///     List of ResourceDictionaries merged into this Resource Dictionary 
    ///</summary> 
    public Collection<ResourceDictionary> MergedDictionaries
    { 
        get
        {
            if (_mergedDictionaries == null)
            { 
                _mergedDictionaries = new ResourceDictionaryCollection(this);
                _mergedDictionaries.CollectionChanged += OnMergedDictionariesChanged; 
            } 

            return _mergedDictionaries; 
        }
    }

    ///<summary> 
    ///     Uri to load this resource from, it will clear the current state of the ResourceDictionary
    ///</summary> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
    public Uri Source
    { 
        get
        {
            return _source;
        } 
        set
        { 
            if (value == null || String.IsNullOrEmpty(value.OriginalString)) 
            {
                throw new ArgumentException(/*SR.Get(SRID.ResourceDictionaryLoadFromFailure, value == null ? "''" : value.ToString())*/); 
            }

            _source = value;

            Clear();

            Uri uri = BindUriHelper.GetResolvedUri(_baseUri, _source); 
            WebRequest request = WpfWebRequestHelper.CreateRequest(uri);
            WpfWebRequestHelper.ConfigCachePolicy(request, false); 
            ContentType contentType = null;
            Stream s = null;

            try 
            {
                 s = WpfWebRequestHelper.GetResponseStream(request, /*out*/ contentType); 
            } 
            catch (IOException ex)
            { 
                if (IsSourcedFromThemeDictionary)
                {
                    switch (_fallbackState)
                    { 
                        case /*FallbackState.*/Classic:
                            { 
                                _fallbackState = FallbackState.Generic; 
                                Uri classicResourceUri = ThemeDictionaryExtension.GenerateFallbackUri(this, SystemResources.ClassicResourceName);
                                Debug.Assert(classicResourceUri != null); 

                                Source = classicResourceUri;
                                // After this recursive call has returned we are sure
                                // that we have tried all fallback paths and so now 
                                // reset the _fallbackState
                                _fallbackState = FallbackState.Classic; 
                            } 
                            break;
                        case /*FallbackState.*/Generic: 
                            {
                                _fallbackState = FallbackState.None;
                                Uri genericResourceUri = ThemeDictionaryExtension.GenerateFallbackUri(this, SystemResources.GenericResourceName);

                                Debug.Assert(genericResourceUri != null);
                                Source = genericResourceUri; 

                            }
                            break; 
                    }
                    return;
                }
                else 
                {
                    throw ex; 
                } 
            }

            // MimeObjectFactory.GetObjectAndCloseStream will try to find the Object converter basing on the mime type.
            // It can be a [....]/async converter. It's the converter's responsiblity to close the stream.
            // If it fails to find a convert, this call will return null.
            XamlReader asyncObjectConverter; 
            ResourceDictionary loadedRD = MimeObjectFactory.GetObjectAndCloseStream(s, contentType, uri, false, false, false /*allowAsync*/, 
            		false /*isJournalNavigation*/, /*out*/ asyncObjectConverter)
                                        as ResourceDictionary; 

            if (loadedRD == null)
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.ResourceDictionaryLoadFromFailure, _source.ToString())*/);
            }

            // ReferenceCopy all the key-value pairs in the _baseDictionary 
            _baseDictionary = loadedRD._baseDictionary;

            // ReferenceCopy all the entries in the MergedDictionaries collection 
            _mergedDictionaries = loadedRD._mergedDictionaries;

            // ReferenceCopy all of the deferred content state
            CopyDeferredContentFrom(loadedRD);

            // Take over the deferred resource references 
            MoveDeferredResourceReferencesFrom(loadedRD);

            // Copy over the HasImplicitStyles flag 
            HasImplicitStyles = loadedRD.HasImplicitStyles;

            // Set inheritance context on the copied values
            if (InheritanceContext != null)
            {
                AddInheritanceContextToValues(); 
            }

            // Propagate parent owners to each of the acquired merged dictionaries 
            if (_mergedDictionaries != null)
            { 
                for (int i = 0; i < _mergedDictionaries.Count; i++)
                {
                    PropagateParentOwners(_mergedDictionaries[i]);
                } 
            }

            if (!IsInitializePending) 
            {
                // Fire Invalidations for the changes made by asigning a new Source 
                NotifyOwners(new ResourcesChangeInfo(null, this));
            }
        }
    } 

//    #region INameScope 
    /// <summary> 
    /// Registers the name - element combination
    /// </summary> 
    /// <param name="name">name of the element</param>
    /// <param name="scopedElement">Element where name is defined</param>
    public void RegisterName(String name, Object scopedElement)
    { 
        throw new NotSupportedException(/*SR.Get(SRID.NamesNotSupportedInsideResourceDictionary)*/);
    } 

    /// <summary>
    /// Unregisters the name - element combination 
    /// </summary>
    /// <param name="name">Name of the element</param>
    public void UnregisterName(String name)
    { 
        // Do Nothing as Names cannot be registered on ResourceDictionary
    } 

    /// <summary>
    /// Find the element given name 
    /// </summary>
    /// <param name="name">Name of the element</param>
    /// <returns>null always</returns>
    public Object FindName(String name) 
    {
        return null; 
    } 

//    #endregion INameScope 

//    #region IUriContext

    /// <summary> 
    ///     Accessor for the base uri of the ResourceDictionary
    /// </summary> 
    Uri /*System.Windows.Markup.IUriContext.*/BaseUri 
    {
        get 
        {
            return  _baseUri;
        }
        set 
        {
            _baseUri = value; 
        } 
    }

//    #endregion IUriContext

//    #endregion PublicAPIs

//    #region IDictionary

    /// <summary> 
    ///     Gets a value indicating whether the IDictionary has a fixed size.
    /// </summary> 
    public boolean IsFixedSize
    {
        get { return _baseDictionary.IsFixedSize; }
    } 

    /// <summary> 
    ///     Gets a value indicating whether the ResourceDictionary is read-only. 
    /// </summary>
    public boolean IsReadOnly 
    {
        get { return ReadPrivateFlag(PrivateFlags.IsReadOnly); }
        /*internal*/ set
        { 
            WritePrivateFlag(PrivateFlags.IsReadOnly, value);

            if (value == true) 
            {
                // Seal all the styles and templates in this dictionary 
                SealValues();
            }

            // Set all the merged resource dictionaries as ReadOnly 
            if (_mergedDictionaries != null)
            { 
                for (int i = 0; i < _mergedDictionaries.Count; i++) 
                {
                    _mergedDictionaries[i].IsReadOnly = value; 
                }
            }
        }
    } 

    /// <summary> 
    ///     Gets or sets the value associated with the specified key. 
    /// </summary>
    /// <remarks> 
    ///     Fire Invalidations only for changes made after the Init Phase
    ///     If the key is not found on this ResourceDictionary, it will look on any MergedDictionaries for it
    /// </remarks>
    public Object this[Object key] 
    {
        get 
        { 
            boolean canCache;
            return GetValue(key, /*out*/ canCache); 
        }

        set
        { 
            // Seal styles and templates within App and Theme dictionary
            SealValue(value); 

            if (CanBeAccessedAcrossThreads)
            { 
                /*lock*/ synchronized(((ICollection)this).SyncRoot)
                {
                    SetValueWithoutLock(key, value);
                } 
            }
            else 
            { 
                SetValueWithoutLock(key, value);
            } 
        }
    }

    // This should only be called in the deferred BAML loading scenario.  We 
    // cache all the data that we need away and then get rid of the actual Object.
    // No one needs to actually get this property so we're returning null.  This 
    // property has to be public since the XAML parser cannot set this /*internal*/ 
    // property in this scenario.
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
    public DeferrableContent DeferrableContent
    {
        get
        { 
            return null;
        } 
        set 
        {
            this.SetDeferrableContent(value); 
        }
    }

    private void SetValueWithoutLock(Object key, Object value) 
    {
        if (IsReadOnly) 
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.ResourceDictionaryIsReadOnly)*/);
        } 

        Object oldValue = _baseDictionary[key];

        if (oldValue != value) 
        {
            // We need to validate all the deferred references that refer 
            // to the old resource before we overwrite it. 
            ValidateDeferredResourceReferences(key);

//            if( TraceResourceDictionary.IsEnabled )
//            {
//                TraceResourceDictionary.Trace( TraceEventType.Start,
//                                               TraceResourceDictionary.AddResource, 
//                                               this,
//                                               key, 
//                                               value ); 
//            }


            _baseDictionary[key] = value;

            // Update the HasImplicitStyles flag 
            UpdateHasImplicitStyles(key);

            // Notify owners of the change and fire invalidate if already initialized 
            NotifyOwners(new ResourcesChangeInfo(key));

//            if( TraceResourceDictionary.IsEnabled )
//            {
//                TraceResourceDictionary.Trace(
//                                              TraceEventType.Stop, 
//                                              TraceResourceDictionary.AddResource,
//                                              this, 
//                                              key, 
//                                              value );
//            } 
        }
    } 

    /*internal*/ public Object GetValue(Object key, /*out*/ boolean canCache) 
    { 
        if (CanBeAccessedAcrossThreads)
        { 
            /*lock*/synchronized(((ICollection)this).SyncRoot)
            {
                return GetValueWithoutLock(key, /*out*/ canCache);
            } 
        }
        else 
        { 
            return GetValueWithoutLock(key, /*out*/ canCache);
        } 
    }

    private Object GetValueWithoutLock(Object key, /*out*/ boolean canCache)
    { 
        Object value = _baseDictionary[key];
        if (value != null) 
        { 
            OnGettingValuePrivate(key, /*ref*/ value, /*out*/ canCache);
        } 
        else
        {
            canCache = true;

            //Search for the value in the Merged Dictionaries
            if (_mergedDictionaries != null) 
            { 
                for (int i = MergedDictionaries.Count - 1; (i > -1); i--)
                { 
                    // Note that MergedDictionaries collection can also contain null values
                    ResourceDictionary mergedDictionary = MergedDictionaries[i];
                    if (mergedDictionary != null)
                    { 
                        value = mergedDictionary.GetValue(key, /*out*/ canCache);
                        if (value != null) 
                        { 
                            break;
                        } 
                    }
                }
            }
        } 

        return value; 
    } 

    // Gets the type of the value stored at the given key 
    /*internal*/ Type GetValueType(Object key, /*out*/ boolean found)
    {
        found = false;
        Type valueType = null; 

        Object value = _baseDictionary[key]; 
        if (value != null) 
        {
            found = true; 

            KeyRecord keyRecord = value as KeyRecord;
            if (keyRecord != null)
            { 
//                Debug.Assert(_numDefer > 0, "The stream was closed before all deferred content was loaded.");
                valueType = GetTypeOfFirstObject(keyRecord); 
            } 
            else
            { 
                valueType = value.GetType();
            }

        } 
        else
        { 
            // Search for the value in the Merged Dictionaries 
            if (_mergedDictionaries != null)
            { 
                for (int i = MergedDictionaries.Count - 1; (i > -1); i--)
                {
                    // Note that MergedDictionaries collection can also contain null values
                    ResourceDictionary mergedDictionary = MergedDictionaries[i]; 
                    if (mergedDictionary != null)
                    { 
                        valueType = mergedDictionary.GetValueType(key, /*out*/ found); 
                        if (found)
                        { 
                            break;
                        }
                    }
                } 
            }
        } 

        return valueType;
    } 

    /// <summary>
    ///     Gets a copy of the ICollection containing the keys of the IDictionary.
    /// </summary> 
    public ICollection Keys
    { 
        get 
        {
            Object[] keysCollection = new Object[Count]; 
            _baseDictionary.Keys.CopyTo(keysCollection, 0);
            return keysCollection;
        }
    } 

    /// <summary> 
    ///     Gets an ICollection containing the values in the Hashtable 
    /// </summary>
    /// <value>An ICollection containing the values in the Hashtable</value> 
    public ICollection Values
    {
        get
        { 
            return new ResourceValuesCollection(this);
        } 
    } 

    /// <summary> 
    ///     Adds an entry
    /// </summary>
    /// <remarks>
    ///     Fire Invalidations only for changes made after the Init Phase 
    /// </remarks>
    public void Add(Object key, Object value) 
    { 
        // Seal styles and templates within App and Theme dictionary
        SealValue(value); 

        if (CanBeAccessedAcrossThreads)
        {
        	/*lock*/synchronized(((ICollection)this).SyncRoot) 
            {
                AddWithoutLock(key, value); 
            } 
        }
        else 
        {
            AddWithoutLock(key, value);
        }

    }

    private void AddWithoutLock(Object key, Object value) 
    {
        if (IsReadOnly) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.ResourceDictionaryIsReadOnly)*/);
        }

//        if( TraceResourceDictionary.IsEnabled )
//        { 
//            TraceResourceDictionary.Trace( TraceEventType.Start, 
//                                           TraceResourceDictionary.AddResource,
//                                           this, 
//                                           key,
//                                           value );
//        }


        _baseDictionary.Add(key, value); 

        // Update the HasImplicitKey flag
        UpdateHasImplicitStyles(key); 

        // Notify owners of the change and fire invalidate if already initialized
        NotifyOwners(new ResourcesChangeInfo(key));

//        if( TraceResourceDictionary.IsEnabled )
//        { 
//            TraceResourceDictionary.Trace( TraceEventType.Stop, 
//                                           TraceResourceDictionary.AddResource,
//                                           this, 
//                                           key,
//                                           value );
//        }

    }

    /// <summary> 
    ///     Removes all elements from the IDictionary.
    /// </summary> 
    public void Clear()
    {
        if (CanBeAccessedAcrossThreads)
        { 
        	/*lock*/synchronized(((ICollection)this).SyncRoot)
            { 
                ClearWithoutLock(); 
            }
        } 
        else
        {
            ClearWithoutLock();
        } 
    }

    private void ClearWithoutLock() 
    {
        if (IsReadOnly) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.ResourceDictionaryIsReadOnly)*/);
        }

        if (Count > 0)
        { 
            // We need to validate all the deferred references that refer 
            // to the old resource before we clear it.
            ValidateDeferredResourceReferences(null); 

            // remove inheritance context from all values that got it from
            // this dictionary
            RemoveInheritanceContextFromValues(); 

            _baseDictionary.Clear(); 

            // Notify owners of the change and fire invalidate if already initialized
            NotifyOwners(ResourcesChangeInfo.CatastrophicDictionaryChangeInfo); 
        }
    }

    /// <summary> 
    ///     Determines whether the IDictionary contains an element with the specified key.
    ///     if the Key is not contained in this ResourceDictionary, it will check in the MergedDictionaries too 
    /// </summary> 
    public boolean Contains(Object key)
    { 
        boolean result = _baseDictionary.Contains(key);

        if (result)
        { 
            KeyRecord keyRecord = _baseDictionary[key] as KeyRecord;
            if (keyRecord != null && _deferredLocationList.Contains(keyRecord)) 
            { 
                return false;
            } 
        }

        //Search for the value in the Merged Dictionaries
        if (_mergedDictionaries != null) 
        {
            for (int i = MergedDictionaries.Count - 1; (i > -1) && !result; i--) 
            { 
                // Note that MergedDictionaries collection can also contain null values
                ResourceDictionary mergedDictionary = MergedDictionaries[i]; 
                if (mergedDictionary != null)
                {
                    result = mergedDictionary.Contains(key);
                } 
            }
        } 
        return result; 
    }

    /// <summary>
    ///     Determines whether the IDictionary contains a BamlObjectFactory against the specified key.
    ///     if the Key is not contained in this ResourceDictionary, it will check in the MergedDictionaries too
    /// </summary> 
    private boolean ContainsBamlObjectFactory(Object key)
    { 
        return GetBamlObjectFactory(key) != null; 
    }

    /// <summary>
    ///     Retrieves a KeyRecord from the IDictionary using the specified key.
    ///     If the Key is not contained in this ResourceDictionary, it will check in the MergedDictionaries too
    /// </summary> 
    private KeyRecord GetBamlObjectFactory(Object key)
    { 
        if (_baseDictionary.Contains(key)) 
        {
            return _baseDictionary[key] as KeyRecord; 
        }

        //Search for the value in the Merged Dictionaries
        if (_mergedDictionaries != null) 
        {
            for (int i = MergedDictionaries.Count - 1; i > -1; i--) 
            { 
                // Note that MergedDictionaries collection can also contain null values
                ResourceDictionary mergedDictionary = MergedDictionaries[i]; 
                if (mergedDictionary != null)
                {
                    KeyRecord keyRecord = mergedDictionary.GetBamlObjectFactory(key);
                    if (keyRecord != null) 
                    {
                        return keyRecord; 
                    } 
                }
            } 
        }

        return null;
    } 

    /// <summary> 
    ///     Returns an IDictionaryEnumerator that can iterate through the Hashtable 
    /// </summary>
    /// <returns>An IDictionaryEnumerator for the Hashtable</returns> 
    public IDictionaryEnumerator GetEnumerator()
    {
        return new ResourceDictionaryEnumerator(this);
    } 

    /// <summary> 
    ///     Removes an entry 
    /// </summary>
    /// <remarks> 
    ///     Fire Invalidations only for changes made after the Init Phase
    /// </remarks>
    public void Remove(Object key)
    { 
        if (CanBeAccessedAcrossThreads)
        { 
        	/*lock*/synchronized(((ICollection)this).SyncRoot) 
            {
                RemoveWithoutLock(key); 
            }
        }
        else
        { 
            RemoveWithoutLock(key);
        } 
    } 

    private void RemoveWithoutLock(Object key) 
    {
        if (IsReadOnly)
        {
            throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryIsReadOnly)); 
        }

        // We need to validate all the deferred references that refer 
        // to the old resource before we remove it.
        ValidateDeferredResourceReferences(key); 

        // remove the inheritance context from the value, if it came from
        // this dictionary
        RemoveInheritanceContext(_baseDictionary[key]); 

        _baseDictionary.Remove(key); 

        // Notify owners of the change and fire invalidate if already initialized
        NotifyOwners(new ResourcesChangeInfo(key)); 
    }

//    #endregion IDictionary

//    #region ICollection

    /// <summary> 
    ///     Gets the number of elements contained in the ICollection.
    /// </summary> 
    public int Count
    {
        get { return _baseDictionary.Count; }
    } 

    /// <summary> 
    ///     Gets a value indicating whether access to the ICollection is synchronized (thread-safe). 
    /// </summary>
    boolean /*ICollection.*/IsSynchronized 
    {
        get { return _baseDictionary.IsSynchronized; }
    }

    /// <summary>
    ///     Gets an Object that can be used to synchronize access to the ICollection. 
    /// </summary> 
    Object /*ICollection.*/SyncRoot
    { 
        get
        {
            if (CanBeAccessedAcrossThreads)
            { 
                // Notice that we are acquiring the ThemeDictionaryLock. This
                // is because the _parserContext used for template expansion 
                // shares data-structures such as the BamlMapTable and 
                // XamlTypeMapper with the parent ParserContext that was used
                // to build the template in the first place. So if this template 
                // is from the App.Resources then the ParserContext that is used for
                // loading deferred content in the app dictionary and the
                // _parserContext used to load template content share the same
                // instances of BamlMapTable and XamlTypeMapper. Hence we need to 
                // make sure that we lock on the same Object inorder to serialize
                // access to these data-structures in multi-threaded scenarios. 
                // Look at comment in Frameworktemplate.LoadContent to understand 
                // why we use the ThemeDictionaryLock for template expansion.

                return SystemResources.ThemeDictionaryLock;
            }
            else
            { 
                return _baseDictionary.SyncRoot;
            } 
        } 
    }

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
    void /*ICollection.*/CopyTo(Array array, int arrayIndex) 
    {
        CopyTo(array as DictionaryEntry[], arrayIndex); 
    } 

//    #endregion ICollection 

//    #region IEnumerable

//    IEnumerator /*IEnumerable.*/GetEnumerator() 
//    {
//        return ((IDictionary)this).GetEnumerator(); 
//    } 

//    #endregion IEnumerable 

//    #region ISupportInitialize

    /// <summary> 
    ///     Mark the begining of the Init phase
    /// </summary> 
    /// <remarks> 
    ///     BeginInit and EndInit follow a transaction model. BeginInit marks the
    ///     dictionary uninitialized and EndInit marks it initialized. 
    /// </remarks>
    public void BeginInit()
    {
        // Nested BeginInits on the same instance aren't permitted 
        if (IsInitializePending)
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.NestedBeginInitNotSupported)*/); 
        }

        IsInitializePending = true;
        IsInitialized = false;
    }

    /// <summary>
    ///     Fire Invalidation at the end of Init phase 
    /// </summary> 
    /// <remarks>
    ///     BeginInit and EndInit follow a transaction model. BeginInit marks the 
    ///     dictionary uninitialized and EndInit marks it initialized.
    /// </remarks>
    public void EndInit()
    { 
        // EndInit without a BeginInit isn't permitted
        if (!IsInitializePending) 
        { 
            throw new InvalidOperationException(SR.Get(SRID.EndInitWithoutBeginInitNotSupported));
        } 
//        Debug.Assert(IsInitialized == false, "Dictionary should not be initialized when EndInit is called");

        IsInitializePending = false;
        IsInitialized = true; 

        // Fire Invalidations collectively for all changes made during the Init Phase 
        NotifyOwners(new ResourcesChangeInfo(null, this)); 
    }

//    #endregion ISupportInitialize

//    #region DeferContent

    private boolean CanCache(KeyRecord keyRecord, Object value)
    { 
        if (keyRecord.SharedSet) 
        {
            return keyRecord.Shared; 
        }
        else
        {
            return true; 
        }
    } 

    private void OnGettingValuePrivate(Object key, /*ref*/ Object value, /*out*/ boolean canCache)
    { 
        OnGettingValue(key, /*ref*/ value, /*out*/ canCache);

        if (key != null && canCache)
        { 
            if (!Object.Equals(_baseDictionary[key], value))
            { 
                // cache the revised value, after setting its InheritanceContext 
                if (InheritanceContext != null)
                { 
                    AddInheritanceContext(InheritanceContext, value);
                }

                _baseDictionary[key] = value; 
            }
        } 
    } 

    protected /*virtual*/ void OnGettingValue(Object key, /*ref*/ Object value, /*out*/ boolean canCache) 
    {
        KeyRecord keyRecord = value as KeyRecord;

        // If the value is not a key record then 
        // it has already been realized, is not deferred and is a "ready to go" value.
        if (keyRecord == null) 
        { 
            canCache = true;
            return;   /* Not deferred content */ 
        }

//        Debug.Assert(_numDefer > 0, "The stream was closed before all deferred content was loaded.");

        // We want to return null if a resource asks for itself. It should return null
        //  <Style x:Key={x:Type Button} BasedOn={StaticResource {x:Type Button}}/> should not find itself 
        if (_deferredLocationList.Contains(keyRecord)) 
        {
            canCache = false; 
            value = null;
            return; /* Not defered content */
        }

        _deferredLocationList.Add(keyRecord);

        try 
        {
//            if (TraceResourceDictionary.IsEnabled) 
//            {
//                TraceResourceDictionary.Trace(
//                    TraceEventType.Start,
//                    TraceResourceDictionary.RealizeDeferContent, 
//                    this,
//                    key, 
//                    value); 
//            }

            value = CreateObject(keyRecord);

        }
        finally 
        {
//            if (TraceResourceDictionary.IsEnabled) 
//            { 
//                TraceResourceDictionary.Trace(
//                    TraceEventType.Stop, 
//                    TraceResourceDictionary.RealizeDeferContent,
//                    this,
//                    key,
//                    value); 
//            }

        } 

        _deferredLocationList.Remove(keyRecord); 

        if (key != null)
        {
            canCache = CanCache(keyRecord, value); 
            if (canCache)
            { 
                // Seal styles and templates within App and Theme dictionary 
                SealValue(value);

                _numDefer--;

                if (_numDefer == 0)
                { 
                        CloseReader();
                } 
            } 
        }
        else 
        {
            canCache = true;
        }
    } 

    /// <summary> 
    ///  Add a byte array that contains deferable content 
    /// </summary>
    /// <SecurityNote> 
    /// Critical: sets critical fields _reader and _xamlLoadPermission.
    /// Safe: data comes from DeferrableContent, where it is critical to set
    /// </SecurityNote>
//    [SecurityTreatAsSafe, SecurityCritical] 
    private void SetDeferrableContent(DeferrableContent deferrableContent)
    { 
//        Debug.Assert(deferrableContent.Stream != null); 
//        Debug.Assert(deferrableContent.SchemaContext != null);
//        Debug.Assert(deferrableContent.ObjectWriterFactory != null); 
//        Debug.Assert(deferrableContent.ServiceProvider != null);
//        Debug.Assert(deferrableContent.RootObject != null);

        Baml2006ReaderSettings settings = new Baml2006ReaderSettings(deferrableContent.SchemaContext.Settings); 
        settings.IsBamlFragment = true;
        settings.OwnsStream = true; 
        settings.BaseUri = null;    // Base URI can only be set on the root Object, not on deferred content. 

        Baml2006Reader reader = new Baml2006Reader(deferrableContent.Stream, 
            deferrableContent.SchemaContext, settings);
        _objectWriterFactory = deferrableContent.ObjectWriterFactory;
        _objectWriterSettings = deferrableContent.ObjectWriterParentSettings;
        _deferredLocationList = new List<KeyRecord>(); 
        _rootElement = deferrableContent.RootObject;

        IList<KeyRecord> keys = reader.ReadKeys(); 

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
    }

    private Object GetKeyValue(KeyRecord key, IServiceProvider serviceProvider)
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
            org.summer.view.widget.markup.XamlReader reader = key.KeyNodeList.GetReader(); 
            Object value = EvaluateMarkupExtensionNodeList(reader, serviceProvider); 
            return value;
        } 
    }

    private Object EvaluateMarkupExtensionNodeList(org.summer.view.widget.markup.XamlReader reader, IServiceProvider serviceProvider)
    { 
        /*System.Xaml.*/XamlObjectWriter writer = _objectWriterFactory.GetXamlObjectWriter(null);

        /*System.Xaml.*/XamlServices.Transform(reader, writer); 

        Object value = writer.Result; 
        MarkupExtension me = value as MarkupExtension;
        if (me != null)
        {
            value = me.ProvideValue(serviceProvider); 
        }
        return value; 
    } 

    private Object GetStaticResourceKeyValue(StaticResource staticResource, IServiceProvider serviceProvider) 
    {
        org.summer.view.widget.markup.XamlReader reader = staticResource.ResourceNodeList.GetReader();
        XamlType xamlTypeStaticResourceExtension = reader.SchemaContext.GetXamlType(typeof(StaticResourceExtension));
        XamlMember xamlMemberResourceKey = xamlTypeStaticResourceExtension.GetMember("ResourceKey"); 
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
                Object value = null;
                reader.Read();
                if (reader.NodeType == Xaml.XamlNodeType.StartObject)
                { 
                    org.summer.view.widget.markup.XamlReader subReader = reader.ReadSubtree();

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
    }

    private void SetKeys(IList<KeyRecord> keyCollection, IServiceProvider serviceProvider)
    {
        _numDefer = keyCollection.Count;

        // Allocate one StaticResourceExtension Object to use as a "worker".
        StaticResourceExtension staticResourceWorker = new StaticResourceExtension(); 

        // Use the array Count property to avoid range checking inside the loop
        for (int i = 0; i < keyCollection.Count; i++) 
        {
            KeyRecord keyRecord = keyCollection[i];
            if (keyRecord != null)
            { 
                Object value = GetKeyValue(keyRecord, serviceProvider);

                // Update the HasImplicitStyles flag 
                UpdateHasImplicitStyles(value);

                if (keyRecord != null && keyRecord.HasStaticResources)
                {
                    SetOptimizedStaticResources(keyRecord.StaticResources, serviceProvider, staticResourceWorker);
                } 

                _baseDictionary.Add(value, keyRecord); 

//                if (TraceResourceDictionary.IsEnabled)
//                { 
//                    TraceResourceDictionary.TraceActivityItem(
//                        TraceResourceDictionary.SetKey,
//                        this,
//                        value); 
//                }

            } 
            else
            { 
                throw new ArgumentException(/*SR.Get(SRID.KeyCollectionHasInvalidKey)*/);
            }
        }

        // Notify owners of the HasImplicitStyles flag value
        // but there is not need to fire an invalidation. 
        NotifyOwners(new ResourcesChangeInfo(null, this)); 
    }

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
    private void SetOptimizedStaticResources(IList<Object> staticResources, IServiceProvider serviceProvider, StaticResourceExtension staticResourceWorker) 
    {
//        Debug.Assert(staticResources != null && staticResources.Count > 0); 
        for (int i = 0; i < staticResources.Count; i++) 
        {
            Object keyValue = null; 

            // Process OptimizedStaticResource
            OptimizedStaticResource optimizedStaticResource = staticResources[i] as OptimizedStaticResource;
            if (optimizedStaticResource != null) 
            {
                keyValue = optimizedStaticResource.KeyValue; 
            } 
            else
            { 
                // Process StaticResource  (it holds the NodeList of the StaticResourceExtension)
            	StaticResource staticResource = staticResources[i] as StaticResource;
                if (staticResource != null)
                { 
                    // find and evaluate the Key value of the SR in the SR's node stream.
                    keyValue = GetStaticResourceKeyValue(staticResource, serviceProvider); 
//                    Debug.Assert(keyValue != null, "Didn't find the ResourceKey property or x:PositionalParameters directive"); 
                }
                else 
                {
//                    Debug.Assert(false, "StaticResources[] entry is not a StaticResource not OptimizedStaticResource");
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
            Object obj = staticResourceWorker.TryProvideValueInternal(serviceProvider, true /*allowDeferredReference*/, true /* mustReturnDeferredResourceReference */); 

//            Debug.Assert(obj is DeferredResourceReference);
            staticResources[i] = new StaticResourceHolder(keyValue, obj as DeferredResourceReference); 
        }
    }

//#if false 
    //

    private void SetStaticResources(Object[] staticResourceValues, ParserContext context) 
    {
        if (staticResourceValues != null && staticResourceValues.length > 0) 
        {
            boolean inDeferredSection = context.InDeferredSection;

            for (int i=0; i<staticResourceValues.length; i++) 
            {
                // If this dictionary is a top level deferred section then we lookup the parser stack 
                // and then look in the app and theme dictionaries to resolve the current static resource. 

                if (!inDeferredSection) 
                {
                    staticResourceValues[i] = context.BamlReader.FindResourceInParentChain(
                        ((StaticResourceExtension)staticResourceValues[i]).ResourceKey,
                        true /*allowDeferredResourceReference*/, 
                        true /*mustReturnDeferredResourceReference*/);
                } 
                else 
                {
                    // If this dictionary is nested within another deferred section then we try to 
                    // resolve the current staticresource against the parser stack and if not
                    // able to resolve then we fallback to the pre-fetched value from the outer
                    // deferred section.

                    StaticResourceHolder srHolder = (StaticResourceHolder)staticResourceValues[i];

                    Object value = context.BamlReader.FindResourceInParserStack( 
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
    } 
//#endif 
    /// <SecurityNote>
    /// Critical: accesses critical field _reader 
    /// Safe: field is safe to read (only critical to write)
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe]
    private Type GetTypeOfFirstObject(KeyRecord keyRecord) 
    {
        Type rootType = _reader.GetTypeOfFirstStartObject(keyRecord); 
        return rootType ?? typeof(String); 
    }

    /// <SecurityNote>
    /// Critical: Accesses critical fields _reader and _xamlLoadPermission
    ///           Asserts XamlLoadPermission.
    /// Safe: _xamlLoadPermission was set critically, and was demanded when the reader was received 
    ///       in DeferrableContent.ctor
    /// </SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe] 
    private Object CreateObject(KeyRecord key)
    { 
        XamlReader xamlReader = _reader.ReadObject(key);
        // v3 Markup Compiler will occasionally produce deferred
        // content with keys but no values.  We need to allow returning
        // null in this scenario to match v3 compat and not throw an 
        // error.
        if (xamlReader == null) 
            return null; 

        Uri baseUri = (_rootElement instanceof IUriContext) ? ((IUriContext)_rootElement).BaseUri : _baseUri; 
        if (_xamlLoadPermission != null)
        {
            _xamlLoadPermission.Assert();
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
    }

    // Moved "Lookup()" from 3.5 BamlRecordReader to 4.0 ResourceDictionary
    /*internal*/ Object Lookup(Object key, boolean allowDeferredResourceReference, boolean mustReturnDeferredResourceReference, boolean canCacheAsThemeResource) 
    { 
        if (allowDeferredResourceReference)
        { 
            // Attempt to delay load resources from ResourceDictionaries
            boolean canCache;
            return FetchResource(key, allowDeferredResourceReference, mustReturnDeferredResourceReference, canCacheAsThemeResource, out canCache);
        } 
        else
        { 
            if (!mustReturnDeferredResourceReference) 
            {
                return this[key]; 
            }
            else
            {
                return new DeferredResourceReferenceHolder(key, this[key]); 
            }
        } 
    } 

//    #endregion DeferContent 

//    #region HelperMethods

    // Add an owner for this dictionary 
    /*internal*/public void AddOwner(DispatcherObject owner)
    { 
        if (_inheritanceContext == null) 
        {
            // the first owner gets to be the InheritanceContext for 
            // all the values in the dictionary that want one.
            DependencyObject inheritanceContext = owner as DependencyObject;

            if (inheritanceContext != null) 
            {
                _inheritanceContext = new WeakReference(inheritanceContext); 

                // set InheritanceContext for the existing values
                AddInheritanceContextToValues(); 
            }
            else
            {
                // if the first owner is ineligible, use a dummy 
                _inheritanceContext = new WeakReference(DummyInheritanceContext);

                // do not call AddInheritanceContextToValues - 
                // the owner is an Application, and we'll be
                // calling SealValues soon, which takes care 
                // of InheritanceContext as well
            }

        } 

        FrameworkElement fe = owner as FrameworkElement; 
        if (fe != null) 
        {
            if (_ownerFEs == null) 
            {
                _ownerFEs = new WeakReferenceList(1);
            }
            else if (_ownerFEs.Contains(fe) && ContainsCycle(this)) 
            {
                throw new InvalidOperationException(/*SR.Get(SRID.ResourceDictionaryInvalidMergedDictionary)*/); 
            } 

            // Propagate the HasImplicitStyles flag to the new owner 
            if (HasImplicitStyles)
            {
                fe.ShouldLookupImplicitStyles = true;
            } 

            _ownerFEs.Add(fe); 
        } 
        else
        { 
            FrameworkContentElement fce = owner as FrameworkContentElement;
            if (fce != null)
            {
                if (_ownerFCEs == null) 
                {
                    _ownerFCEs = new WeakReferenceList(1); 
                } 
                else if (_ownerFCEs.Contains(fce) && ContainsCycle(this))
                { 
                    throw new InvalidOperationException(SR.Get(SRID.ResourceDictionaryInvalidMergedDictionary));
                }

                // Propagate the HasImplicitStyles flag to the new owner 
                if (HasImplicitStyles)
                { 
                    fce.ShouldLookupImplicitStyles = true; 
                }

                _ownerFCEs.Add(fce);
            }
            else
            { 
                Application app = owner as Application;
                if (app != null) 
                { 
                    if (_ownerApps == null)
                    { 
                        _ownerApps = new WeakReferenceList(1);
                    }
                    else if (_ownerApps.Contains(app) && ContainsCycle(this))
                    { 
                        throw new InvalidOperationException(/*SR.Get(SRID.ResourceDictionaryInvalidMergedDictionary)*/);
                    } 

                    // Propagate the HasImplicitStyles flag to the new owner
                    if (HasImplicitStyles) 
                    {
                        app.HasImplicitStylesInResources = true;
                    }

                    _ownerApps.Add(app);

                    // An Application ResourceDictionary can be accessed across threads 
                    CanBeAccessedAcrossThreads = true;

                    // Seal all the styles and templates in this app dictionary
                    SealValues();
                }
            } 
        }

        AddOwnerToAllMergedDictionaries(owner); 

        // This dictionary will be marked initialized if no one has called BeginInit on it. 
        // This is done now because having an owner is like a parenting operation for the dictionary.
        TryInitialize();
    }

    // Remove an owner for this dictionary
    /*internal*/public void RemoveOwner(DispatcherObject owner) 
    { 
        FrameworkElement fe = owner as FrameworkElement;
        if (fe != null) 
        {
            if (_ownerFEs != null)
            {
                _ownerFEs.Remove(fe); 

                if (_ownerFEs.Count == 0) 
                { 
                    _ownerFEs = null;
                } 
            }
        }
        else
        { 
            FrameworkContentElement fce = owner as FrameworkContentElement;
            if (fce != null) 
            { 
                if (_ownerFCEs != null)
                { 
                    _ownerFCEs.Remove(fce);

                    if (_ownerFCEs.Count == 0)
                    { 
                        _ownerFCEs = null;
                    } 
                } 
            }
            else 
            {
                Application app = owner as Application;
                if (app != null)
                { 
                    if (_ownerApps != null)
                    { 
                        _ownerApps.Remove(app); 

                        if (_ownerApps.Count == 0) 
                        {
                            _ownerApps = null;
                        }
                    } 
                }
            } 
        } 

        if (owner == InheritanceContext) 
        {
            RemoveInheritanceContextFromValues();
            _inheritanceContext = null;
        } 

        RemoveOwnerFromAllMergedDictionaries(owner); 
    } 

    // Check if the given is an owner to this dictionary 
    /*internal*/ boolean ContainsOwner(DispatcherObject owner)
    {
        FrameworkElement fe = owner as FrameworkElement;
        if (fe != null) 
        {
            return (_ownerFEs != null && _ownerFEs.Contains(fe)); 
        } 
        else
        { 
            FrameworkContentElement fce = owner as FrameworkContentElement;
            if (fce != null)
            {
                return (_ownerFCEs != null && _ownerFCEs.Contains(fce)); 
            }
            else 
            { 
                Application app = owner as Application;
                if (app != null) 
                {
                    return (_ownerApps != null && _ownerApps.Contains(app));
                }
            } 
        }

        return false; 
    }

    // Helper method that tries to set IsInitialized to true if BeginInit hasn't been called before this.
    // This method is called on AddOwner
    private void TryInitialize()
    { 
        if (!IsInitializePending &&
            !IsInitialized) 
        { 
            IsInitialized = true;
        } 
    }

    // Call FrameworkElement.InvalidateTree with the right data
    private void NotifyOwners(ResourcesChangeInfo info) 
    {
        boolean shouldInvalidate   = IsInitialized; 
        boolean hasImplicitStyles  = info.IsResourceAddOperation && HasImplicitStyles; 

        if (shouldInvalidate || hasImplicitStyles) 
        {
            // Invalidate all FE owners
            if (_ownerFEs != null)
            { 
                for/*each*/ (Object o : _ownerFEs)
                { 
                    FrameworkElement fe = o as FrameworkElement; 
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
            if (_ownerFCEs != null)
            { 
                for/*each*/ (Object o : _ownerFCEs) 
                {
                    FrameworkContentElement fce = o as FrameworkContentElement; 
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
            if (_ownerApps != null) 
            {
                for/*each*/ (Object o : _ownerApps) 
                {
                    Application app = o as Application;
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
    }

    /// <summary>
    /// Fetches the resource corresponding to the given key from this dictionary.
    /// Returns a DeferredResourceReference if the Object has not been inflated yet.
    /// </summary> 
    /*internal*/ public Object FetchResource(
        Object      resourceKey, 
        boolean        allowDeferredResourceReference, 
        boolean        mustReturnDeferredResourceReference,
        /*out*/ boolean    canCache) 
    {
        return FetchResource(
            resourceKey,
            allowDeferredResourceReference, 
            mustReturnDeferredResourceReference,
            true /*canCacheAsThemeResource*/, 
            /*out*/ canCache); 
    }

    /// <summary>
    /// Fetches the resource corresponding to the given key from this dictionary.
    /// Returns a DeferredResourceReference if the Object has not been inflated yet.
    /// </summary> 
    private Object FetchResource(
        Object      resourceKey, 
        boolean        allowDeferredResourceReference, 
        boolean        mustReturnDeferredResourceReference,
        boolean        canCacheAsThemeResource, 
        /*out*/ boolean    canCache)
    {
//        Debug.Assert(resourceKey != null, "ResourceKey cannot be null");

        if (allowDeferredResourceReference)
        { 
            if (ContainsBamlObjectFactory(resourceKey) || 
                (mustReturnDeferredResourceReference && Contains(resourceKey)))
            { 
                canCache = false;

                DeferredResourceReference deferredResourceReference;
                if (!IsThemeDictionary) 
                {
                    if (_ownerApps != null) 
                    { 
                        deferredResourceReference = new DeferredAppResourceReference(this, resourceKey);
                    } 
                    else
                    {
                        deferredResourceReference = new DeferredResourceReference(this, resourceKey);
                    } 

                    // Cache the deferredResourceReference so that it can be validated 
                    // in case of a dictionary change prior to its inflation 
                    if (_deferredResourceReferences == null)
                    { 
                        _deferredResourceReferences = new WeakReferenceList();
                    }

                    _deferredResourceReferences.Add( deferredResourceReference, true /*SkipFind*/); 
                }
                else 
                { 
                    deferredResourceReference = new DeferredThemeResourceReference(this, resourceKey, canCacheAsThemeResource);
                } 

                return deferredResourceReference;
            }
        } 

        return GetValue(resourceKey, /*out*/ canCache); 
    } 

    /// <summary> 
    /// Validate the deferredResourceReference with the given key. Key could be null meaning
    /// some catastrophic operation occurred so simply validate all DeferredResourceReferences
    /// </summary>
    private void ValidateDeferredResourceReferences(Object resourceKey) 
    {
        if (_deferredResourceReferences != null) 
        { 
            for/*each*/ (Object o : _deferredResourceReferences)
            { 

                DeferredResourceReference deferredResourceReference = o as DeferredResourceReference;
                if (deferredResourceReference != null && (resourceKey == null || Object.Equals(resourceKey, deferredResourceReference.Key)))
                { 
                    // This will inflate the deferred reference, causing it
                    // to be removed from the list.  The list may also be 
                    // purged of dead references. 
                    deferredResourceReference.GetValue(BaseValueSourceInternal.Unknown);
                } 
            }
        }
    }


    /// <summary> 
    /// Called when the MergedDictionaries collection changes 
    /// </summary>
    /// <param name="sender"></param> 
    /// <param name="e"></param>
    private void OnMergedDictionariesChanged(Object sender, NotifyCollectionChangedEventArgs e)
    {
        List<ResourceDictionary> oldDictionaries = null; 
        List<ResourceDictionary> newDictionaries = null;
        ResourceDictionary mergedDictionary; 
        ResourcesChangeInfo info; 

        if (e.Action != NotifyCollectionChangedAction.Reset) 
        {
//            Invariant.Assert(
//                (e.NewItems != null && e.NewItems.Count > 0) ||
//                (e.OldItems != null && e.OldItems.Count > 0), 
//                "The NotifyCollectionChanged event fired when no dictionaries were added or removed");


            // If one or more resource dictionaries were removed we
            // need to remove the owners they were given by their 
            // parent ResourceDictionary.

            if (e.Action == NotifyCollectionChangedAction.Remove
                || e.Action == NotifyCollectionChangedAction.Replace) 
            {
                oldDictionaries = new List<ResourceDictionary>(e.OldItems.Count); 

                for (int i = 0; i < e.OldItems.Count; i++)
                { 
                    mergedDictionary = (ResourceDictionary)e.OldItems[i];
                    oldDictionaries.Add(mergedDictionary);

                    RemoveParentOwners(mergedDictionary); 
                }
            } 

            // If one or more resource dictionaries were added to the merged
            // dictionaries collection we need to send down the parent 
            // ResourceDictionary's owners.

            if (e.Action == NotifyCollectionChangedAction.Add
                || e.Action == NotifyCollectionChangedAction.Replace) 
            {
                newDictionaries = new List<ResourceDictionary>(e.NewItems.Count); 

                for (int i = 0; i < e.NewItems.Count; i++)
                { 
                    mergedDictionary = (ResourceDictionary)e.NewItems[i];
                    newDictionaries.Add(mergedDictionary);

                    // If the merged dictionary HasImplicitStyle mark the outer dictionary the same. 
                    if (!HasImplicitStyles && mergedDictionary.HasImplicitStyles)
                    { 
                        HasImplicitStyles = true; 
                    }

                    // If the parent dictionary is a theme dictionary mark the merged dictionary the same.
                    if (IsThemeDictionary)
                    {
                        mergedDictionary.IsThemeDictionary = true; 
                    }

                    PropagateParentOwners(mergedDictionary); 
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

        NotifyOwners(info); 
    }

    /// <summary> 
    /// Adds the given owner to all merged dictionaries of this ResourceDictionary
    /// </summary> 
    /// <param name="owner"></param>
    private void AddOwnerToAllMergedDictionaries(DispatcherObject owner)
    {
        if (_mergedDictionaries != null) 
        {
            for (int i = 0; i < _mergedDictionaries.Count; i++) 
            { 
                _mergedDictionaries[i].AddOwner(owner);
            } 
        }
    }

    /// <summary> 
    ///
    /// </summary> 
    /// <param name="owner"></param> 
    private void RemoveOwnerFromAllMergedDictionaries(DispatcherObject owner)
    { 
        if (_mergedDictionaries != null)
        {
            for (int i = 0; i < _mergedDictionaries.Count; i++)
            { 
                _mergedDictionaries[i].RemoveOwner(owner);
            } 
        } 
    }

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
    private void PropagateParentOwners(ResourceDictionary mergedDictionary)
    { 
        if (_ownerFEs != null)
        { 
//            Invariant.Assert(_ownerFEs.Count > 0); 

            if (mergedDictionary._ownerFEs == null) 
            {
                mergedDictionary._ownerFEs = new WeakReferenceList(_ownerFEs.Count);
            }

            for/*each*/ (Object o : _ownerFEs)
            { 
                FrameworkElement fe = o as FrameworkElement; 
                if (fe != null)
                    mergedDictionary.AddOwner(fe); 
            }
        }

        if (_ownerFCEs != null) 
        {
//            Invariant.Assert(_ownerFCEs.Count > 0); 

            if (mergedDictionary._ownerFCEs == null)
            { 
                mergedDictionary._ownerFCEs = new WeakReferenceList(_ownerFCEs.Count);
            }

            for/*each*/ (Object o : _ownerFCEs) 
            {
                FrameworkContentElement fce = o as FrameworkContentElement; 
                if (fce != null) 
                    mergedDictionary.AddOwner(fce);
            } 
        }

        if (_ownerApps != null)
        { 
//            Invariant.Assert(_ownerApps.Count > 0);

            if (mergedDictionary._ownerApps == null) 
            {
                mergedDictionary._ownerApps = new WeakReferenceList(_ownerApps.Count); 
            }

            for/*each*/ (Object o : _ownerApps)
            { 
                Application app = o as Application;
                if (app != null) 
                    mergedDictionary.AddOwner(app); 
            }
        } 
    }


    /// <summary> 
    /// Removes the owners of this ResourceDictionary from the given
    /// merged dictionary.  The merged dictionary will be left with 
    /// whatever owners it had before being merged. 
    /// </summary>
    /// <param name="mergedDictionary"></param> 
    /*internal*/ void RemoveParentOwners(ResourceDictionary mergedDictionary)
    {
        if (_ownerFEs != null)
        { 
            for/*each*/ (Object o : _ownerFEs)
            { 
                FrameworkElement fe = o as FrameworkElement; 
                mergedDictionary.RemoveOwner(fe);

            }
        }

        if (_ownerFCEs != null) 
        {
//            Invariant.Assert(_ownerFCEs.Count > 0); 

            for/*each*/ (Object o : _ownerFCEs)
            { 
                FrameworkContentElement fec = o as FrameworkContentElement;
                mergedDictionary.RemoveOwner(fec);

            } 
        }

        if (_ownerApps != null) 
        {
//            Invariant.Assert(_ownerApps.Count > 0); 

            for/*each*/ (Object o : _ownerApps)
            {
                Application app = o as Application; 
                mergedDictionary.RemoveOwner(app);

            } 
        }
    } 

    private boolean ContainsCycle(ResourceDictionary origin)
    {
        for (int i=0; i<MergedDictionaries.Count; i++) 
        {
            ResourceDictionary mergedDictionary = MergedDictionaries[i]; 
            if (mergedDictionary == origin || mergedDictionary.ContainsCycle(origin)) 
            {
                return true; 
            }
        }

        return false; 
    }

//    #endregion HelperMethods 

//    #region Properties 

    /*internal*/ public WeakReferenceList DeferredResourceReferences
    {
        get { return _deferredResourceReferences; } 
    }

//    #endregion Properties 

//    #region Enumeration 

    /// <summary>
    ///     Iterates the dictionary's entries, handling deferred content.
    /// </summary> 
    private class ResourceDictionaryEnumerator implements IDictionaryEnumerator
    { 
        /*internal*/ ResourceDictionaryEnumerator(ResourceDictionary owner) 
        {
            _owner = owner; 
            _keysEnumerator = _owner.Keys.GetEnumerator();
        }

//        #region IEnumerator 

        public Object /*IEnumerator.*/Current 
        { 
            get
            { 
                return ((IDictionaryEnumerator)this).Entry;
            }
        }

        boolean /*IEnumerator.*/MoveNext()
        { 
            return _keysEnumerator.MoveNext(); 
        }

        void /*IEnumerator.*/Reset()
        {
            _keysEnumerator.Reset();
        } 

//        #endregion 

//        #region IDictionaryEnumerator

        DictionaryEntry /*IDictionaryEnumerator.*/Entry
        {
            get
            { 
                Object key = _keysEnumerator.Current;
                Object value = _owner[key]; 
                return new DictionaryEntry(key, value); 
            }
        } 

        Object /*IDictionaryEnumerator.*/Key
        {
            get 
            {
                return _keysEnumerator.Current; 
            } 
        }

        Object /*IDictionaryEnumerator.*/Value
        {
            get
            { 
                return _owner[_keysEnumerator.Current];
            } 
        } 

//        #endregion 

//        #region Data

        private ResourceDictionary _owner; 
        private IEnumerator _keysEnumerator;

//        #endregion 
    }

    /// <summary>
    ///     Iterator for the dictionary's Values collection, handling deferred content.
    /// </summary>
    class ResourceValuesEnumerator implements IEnumerator 
    {
        /*internal*/ ResourceValuesEnumerator(ResourceDictionary owner) 
        { 
            _owner = owner;
            _keysEnumerator = _owner.Keys.GetEnumerator(); 
        }

//        #region IEnumerator

        public Object /*IEnumerator.*/Current
        { 
            get 
            {
                return _owner[_keysEnumerator.Current]; 
            }
        }

        public boolean /*IEnumerator.*/MoveNext() 
        {
            return _keysEnumerator.MoveNext(); 
        } 

        public void /*IEnumerator.*/Reset() 
        {
            _keysEnumerator.Reset();
        }

//        #endregion

//        #region Data 

        private ResourceDictionary _owner; 
        private IEnumerator _keysEnumerator;

//        #endregion
    } 

    /// <summary> 
    ///     Represents the dictionary's Values collection, handling deferred content. 
    /// </summary>
    private class ResourceValuesCollection implements ICollectionView 
    {
        /*internal*/ ResourceValuesCollection(ResourceDictionary owner)
        {
            _owner = owner; 
        }

//        #region ICollection 

        public int /*ICollection.*/Count 
        {
            get
            {
                return _owner.Count; 
            }
        } 

        public boolean /*ICollection.*/IsSynchronized
        { 
            get
            {
                return false;
            } 
        }

        public Object /*ICollection.*/SyncRoot 
        {
            get 
            {
                return this;
            }
        } 

        public void /*ICollection.*/CopyTo(Array array, int index) 
        { 
            for/*each*/ (Object key : _owner.Keys)
            { 
                array.SetValue(_owner[key], index++);
            }
        }

        public IEnumerator /*IEnumerable.*/GetEnumerator()
        { 
            return new ResourceValuesEnumerator(_owner); 
        }

//        #endregion

//        #region Data

        private ResourceDictionary _owner;

//        #endregion 
    }

//    #endregion Enumeration

//    #region PrivateMethods

    //
    //  This method 
    //  1. Seals all the freezables/styles/templates that belong to this App/Theme/Style/Template ResourceDictionary 
    //
    private void SealValues() 
    {
//        Debug.Assert(IsThemeDictionary || _ownerApps != null || IsReadOnly, "This must be an App/Theme/Style/Template ResourceDictionary");

        // sealing can cause DeferredResourceReferences to be replaced by the 
        // inflated values (Dev11 371997).  This changes the Values collection,
        // so we can't iterate it directly.  Instead, iterate over a copy. 
        int count = _baseDictionary.Count; 
        if (count > 0)
        { 
            Object[] values = new Object[count];
            _baseDictionary.Values.CopyTo(values, 0);

            for/*each*/ (Object value : values) 
            {
                SealValue(value); 
            } 
        }
    } 

    //
    //  This method
    //  1. Sets the InheritanceContext of the value to the dictionary's principal owner 
    //  2. Seals the freezable/style/template that is to be placed in an App/Theme/Style/Template ResourceDictionary
    // 
    private void SealValue(Object value) 
    {
        DependencyObject inheritanceContext = InheritanceContext; 
        if (inheritanceContext != null)
        {
            AddInheritanceContext(inheritanceContext, value);
        } 

        if (IsThemeDictionary || _ownerApps != null || IsReadOnly) 
        { 
            // If the value is a ISealable then seal it
            StyleHelper.SealIfSealable(value); 
        }
    }

    // add inheritance context to a value 
    private void AddInheritanceContext(DependencyObject inheritanceContext, Object value)
    { 
        // The VisualBrush.Visual property is the "friendliest", i.e. the 
        // most likely to be accepted by the resource as FEs need to accept
        // being rooted by a VisualBrush. 
        //
        // NOTE:  Freezable.Debug_VerifyContextIsValid() contains a special
        //        case to allow this with the VisualBrush.Visual property.
        //        Changes made here will require updates in Freezable.cs 
        if (inheritanceContext.ProvideSelfAsInheritanceContext(value, VisualBrush.VisualProperty))
        { 
            // if the assignment was successful, seal the value's InheritanceContext. 
            // This makes sure the resource always gets inheritance-related information
            // from its point of definition, not from its point of use. 
            DependencyObject doValue = value as DependencyObject;
            if (doValue != null)
            {
                doValue.IsInheritanceContextSealed = true; 
            }
        } 
    } 

    // add inheritance context to all values that came from this dictionary 
    private void AddInheritanceContextToValues()
    {
        DependencyObject inheritanceContext = InheritanceContext;

        // setting InheritanceContext can cause values to be replaced (Dev11 380869).
        // This changes the Values collection, so we can't iterate it directly. 
        // Instead, iterate over a copy. 
        int count = _baseDictionary.Count;
        if (count > 0) 
        {
            Object[] values = new Object[count];
            _baseDictionary.Values.CopyTo(values, 0);

            for/*each*/ (Object value : values)
            { 
                AddInheritanceContext(inheritanceContext, value); 
            }
        } 
    }

    // remove inheritance context from a value, if it came from this dictionary
    private void RemoveInheritanceContext(Object value) 
    {
        DependencyObject doValue = value as DependencyObject; 
        DependencyObject inheritanceContext = InheritanceContext; 

        if (doValue != null && inheritanceContext != null && 
            doValue.IsInheritanceContextSealed &&
            doValue.InheritanceContext == inheritanceContext)
        {
            doValue.IsInheritanceContextSealed = false; 
            inheritanceContext.RemoveSelfAsInheritanceContext(doValue, VisualBrush.VisualProperty);
        } 
    } 

    // remove inheritance context from all values that came from this dictionary 
    private void RemoveInheritanceContextFromValues()
    {
        for/*each*/ (Object value : _baseDictionary.Values)
        { 
            RemoveInheritanceContext(value);
        } 
    } 


    // Sets the HasImplicitStyles flag if the given key is of type Type.
    private void UpdateHasImplicitStyles(Object key)
    {
        // Update the HasImplicitStyles flag 
        if (!HasImplicitStyles)
        { 
            HasImplicitStyles = ((key as Type) != null); 
        }
    } 

    private DependencyObject InheritanceContext
    {
        get 
        {
            return (_inheritanceContext != null) 
                ? (DependencyObject)_inheritanceContext.Target 
                : null;
        } 
    }

    private boolean IsInitialized
    { 
        get { return ReadPrivateFlag(PrivateFlags.IsInitialized); }
        set { WritePrivateFlag(PrivateFlags.IsInitialized, value); } 
    } 

    private boolean IsInitializePending 
    {
        get { return ReadPrivateFlag(PrivateFlags.IsInitializePending); }
        set { WritePrivateFlag(PrivateFlags.IsInitializePending, value); }
    } 

    private boolean IsThemeDictionary 
    { 
        get { return ReadPrivateFlag(PrivateFlags.IsThemeDictionary); }
        set 
        {
            if (IsThemeDictionary != value)
            {
                WritePrivateFlag(PrivateFlags.IsThemeDictionary, value); 
                if (value)
                { 
                    SealValues(); 
                }
                if (_mergedDictionaries != null) 
                {
                    for (int i=0; i<_mergedDictionaries.Count; i++)
                    {
                        _mergedDictionaries[i].IsThemeDictionary = value; 
                    }
                } 
            } 
        }
    } 

    /*internal*/public boolean HasImplicitStyles
    {
        get { return ReadPrivateFlag(PrivateFlags.HasImplicitStyles); } 
        set { WritePrivateFlag(PrivateFlags.HasImplicitStyles, value); }
    } 

    /*internal*/public boolean CanBeAccessedAcrossThreads
    { 
        get { return ReadPrivateFlag(PrivateFlags.CanBeAccessedAcrossThreads); }
        set { WritePrivateFlag(PrivateFlags.CanBeAccessedAcrossThreads, value); }
    }

    private void WritePrivateFlag(PrivateFlags bit, boolean value)
    { 
        if (value) 
        {
            _flags |= bit; 
        }
        else
        {
            _flags &= ~bit; 
        }
    } 

    private boolean ReadPrivateFlag(PrivateFlags bit)
    { 
        return (_flags & bit) != 0;
    }

    /// <SecurityNote> 
    /// Critical: accesses critical field _reader
    /// Safe: keeps LoadPermission in [....] by nulling it out as well 
    /// </SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe]
    private void CloseReader() 
    {
        _reader.Close();
        _reader = null;
        _xamlLoadPermission = null; 
    }

    /// <SecurityNote> 
    /// Critical: sets critical fields _reader and _xamlLoadPermission.
    /// Safe: copies them from another ResourceDictionary instance, where they were set critically. 
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe]
    private void CopyDeferredContentFrom(ResourceDictionary loadedRD)
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
    } 

    private void  MoveDeferredResourceReferencesFrom(ResourceDictionary loadedRD) 
    {
        // copy the list
        _deferredResourceReferences = loadedRD._deferredResourceReferences;

        // redirect each entry toward its new owner
        if (_deferredResourceReferences != null) 
        { 
            for/*each*/ (DeferredResourceReference drr : _deferredResourceReferences)
            { 
                drr.Dictionary = this;
            }
        }
    } 

//    #endregion PrivateMethods 

//    #region PrivateDataStructures

    /*private*/ enum PrivateFlags //: byte
    {
        IsInitialized               ,//= 0x01,
        IsInitializePending         ,//= 0x02, 
        IsReadOnly                  ,//= 0x04,
        IsThemeDictionary           ,//= 0x08, 
        HasImplicitStyles           ,//= 0x10, 
        CanBeAccessedAcrossThreads  ,//= 0x20,

        // Unused bit = 0x40,
        // Unused bit = 0x80,
    }

//    #endregion PrivateDataStructures

    // flag set by ThemeDictionaryExtension 
    // to know that classic/generic Uri's should be used as fallbacks
    // when themed dictionary is not found 
    /*internal*/public boolean IsSourcedFromThemeDictionary = false;
    private FallbackState _fallbackState = FallbackState.Classic;

    private enum FallbackState 
    {
        Classic, 
        Generic, 
        None
    } 

//    #region Data

    private Hashtable                                 _baseDictionary = null; 
    private WeakReferenceList                         _ownerFEs = null;
    private WeakReferenceList                         _ownerFCEs = null; 
    private WeakReferenceList                         _ownerApps = null; 
    private WeakReferenceList                         _deferredResourceReferences = null;
    private ObservableCollection<ResourceDictionary>  _mergedDictionaries = null; 
    private Uri                                       _source = null;
    private Uri                                       _baseUri = null;
    private PrivateFlags                              _flags = 0;
    private List<KeyRecord>                           _deferredLocationList = null; 

    // Buffer that contains deferable content.  This may be null if a stream was passed 
    // instead of a buffer.  If a buffer was passed, then a memory stream is made on the buffer 
    private byte[]          _buffer;

    // Persistent Stream that contains values.
    private Stream          _bamlStream;

    // Start position in the stream where the first value record is located.  All offsets for 
    // the keys are relative to this position.
    private Int64           _startPosition; 

    // Size of the delay loaded content, which only includes the value section and not the keys.
    private Int32           _contentSize; 

    // The root element at the time the deferred content information was given to the dictionary.
    private Object          _rootElement;

    // The number of keys that correspond to deferred content. When this reaches 0,
    // the stream can be closed. 
    private int             _numDefer; 

    // The Object that becomes the InheritanceContext of all eligible 
    // values in the dictionary - typically the principal owner of the dictionary.
    // We store a weak reference so that the dictionary does not leak the owner.
    private WeakReference   _inheritanceContext;

    // a dummy DO, used as the InheritanceContext when the dictionary's owner is
    // not itself a DO 
    private static final DependencyObject DummyInheritanceContext = new DependencyObject(); 

    XamlObjectIds _contextXamlObjectIds  = new XamlObjectIds(); 

    private IXamlObjectWriterFactory _objectWriterFactory;
    private XamlObjectWriterSettings _objectWriterSettings;

    /// <SecurityNote>
    /// Critical: Identifies the permission of the stream in _reader. 
    ///           Will be asserted when realizing deferred content. 
    /// </SecurityNote>
//    [SecurityCritical] 
    private XamlLoadPermission _xamlLoadPermission;

    /// <summary>
    /// Critical: _xamlLoadPermission needs to be updated whenever this field is updated. 
    /// </summary>
//    [SecurityCritical] 
    private Baml2006Reader _reader; 

//    #endregion Data 
}