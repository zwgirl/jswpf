package org.summer.view.window;

import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.PresentationSource;
import org.summer.view.widget.ResourceDictionary;
import org.summer.view.widget.ResourceKey;
import org.summer.view.widget.ResourcesChangeInfo;
import org.summer.view.widget.SystemResourceKey;
import org.summer.view.widget.Type;
import org.summer.view.widget.reflection.Assembly;
import org.summer.view.widget.threading.Dispatcher;
import org.summer.view.widget.threading.DispatcherObject;

/// <summary>
///     SystemResources loads system theme data into the system resources collection. 
/// </summary>
/*internal*/ public /*static*/ class SystemResources 
{ 
    // ------------------------------------------------
    // 
    // Methods
    //
    // ------------------------------------------------

//    #region Methods

    /// <summary> 
    ///     Returns a resource for the given key type from the system resources collection.
    /// </summary> 
    /// <param name="key">The resource id to search for.</param>
    /// <returns>The resource if it exists, null otherwise.</returns>
    //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
    /*internal*/ public static Object FindThemeStyle(DependencyObjectType key) 
    {
        // Find a cached theme style 
        Object resource = _themeStyleCache[key]; 
        if (resource != null)
        { 
            // Found a cached value
            if (resource == _specialNull)
            {
                // We cached a null, set it to a real null 
                return null; // Null resource found
            } 

            return resource;
        } 

        // Find the resource from the system resources collection
        resource = FindResourceInternal(key.SystemType);

        // The above read operation was lock free. Writing
        // to the cache will need a lock though 
        /*lock*/synchronized (ThemeDictionaryLock) 
        {
            if (resource != null) 
            {
                // Cache the value
                _themeStyleCache[key] = resource;
            } 
            else
            { 
                // Record nulls so we don't bother doing lookups for them later 
                // Any theme changes will clear these values
                _themeStyleCache[key] = _specialNull; 
            }
        }

        return resource; 
    }

    /// <summary> 
    ///     Returns a resource of the given name from the system resources collection.
    /// </summary> 
    /// <param name="key">The resource id to search for.</param>
    /// <returns>The resource if it exists, null otherwise.</returns>
    //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
    /*internal*/ public static Object FindResourceInternal(Object key) 
    {
        // Call Forwarded 
        return FindResourceInternal(key, false /*allowDeferredResourceReference*/, false /*mustReturnDeferredResourceReference*/); 
    }

    /*internal*/ public static Object FindResourceInternal(Object key, boolean allowDeferredResourceReference, boolean mustReturnDeferredResourceReference)
    {
        // Ensure that resource changes on this thread can be heard and handled
        EnsureResourceChangeListener(); 

        Object resource = null; 
        Type typeKey = null; 
        ResourceKey resourceKey = null;

        boolean isTraceEnabled = EventTrace.IsEnabled(EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose);

        // System resource keys can only be of type Type or of type ResourceKey
        typeKey = key as Type; 
        resourceKey = (typeKey == null) ? (key as ResourceKey) : null;

        if (isTraceEnabled) 
        {
            EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceFindBegin, 
                                                EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose,
                                                (key == null) ? "null" : key.ToString());
        }


        if ((typeKey == null) && (resourceKey == null)) 
        { 
            // Not a valid key
            if (isTraceEnabled) 
            {
                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceFindEnd, EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose);
            }
            return null; 
        }

        // Check if the value was already cached 
        if (!FindCachedResource(key, /*ref*/ resource, mustReturnDeferredResourceReference))
        { 
            // Cache miss, do a lookup
            if (isTraceEnabled)
            {
                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceCacheMiss, EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose); 
            }

            /*lock*/synchronized (ThemeDictionaryLock) 
            {
                boolean canCache = true; 
                SystemResourceKey sysKey = (resourceKey != null) ? resourceKey as SystemResourceKey : null;
                if (sysKey != null)
                {
                    // Check the list of system metrics 
                    if (!mustReturnDeferredResourceReference)
                    { 
                        resource = sysKey.Resource; 
                    }
                    else 
                    {
                        resource = new DeferredResourceReferenceHolder(sysKey, sysKey.Resource);
                    }
                    if (isTraceEnabled) 
                    {
                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceStock, EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose, sysKey.ToString()); 
                    } 
                }
                else 
                {
                    // Do a dictionary lookup
                    resource = FindDictionaryResource(key, typeKey, resourceKey, isTraceEnabled, allowDeferredResourceReference, mustReturnDeferredResourceReference, /*out*/ canCache);
                } 

                if ((canCache && !allowDeferredResourceReference) || resource == null) 
                { 
                    // Cache the resource
                    CacheResource(key, resource, isTraceEnabled); 
                }
            }
        }

        if (isTraceEnabled)
        { 
            EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceFindEnd, EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose); 
        }

        return resource;
    }

//    #endregion 

    // ------------------------------------------------ 
    // 
    // Implementation
    // 
    // ------------------------------------------------

//    #region Implementation

    //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
    /*internal*/ public static void CacheResource(Object key, Object resource, boolean isTraceEnabled) 
    { 
        // Thread safety handled by FindResourceInternal. Be sure to have locked _resourceCache.SyncRoot.

        if (resource != null)
        {
            // Cache the value
            _resourceCache[key] = resource; 

            if (isTraceEnabled) 
            { 
                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceCacheValue, EventTrace.Keyword.KeywordXamlBaml, EventTrace.Level.Verbose);
            } 
        }
        else
        {
            // Record nulls so we don't bother doing lookups for them later 
            // Any theme changes will clear these values
            _resourceCache[key] = _specialNull; 

            if (isTraceEnabled)
            { 
                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceCacheNull, EventTrace.Keyword.KeywordXamlBaml, EventTrace.Level.Verbose);
            }
        }
    } 

//    #region Resource Value Lookup 

    private static boolean FindCachedResource(Object key, /*ref*/ Object resource, boolean mustReturnDeferredResourceReference)
    { 
        // reading the cache is lock free

        resource = _resourceCache[key];
        boolean found = (resource != null); 

        if (resource == _specialNull) 
        { 
            // We cached a null, set it to a real null
            resource = null; 
        }
        else
        {
            DispatcherObject dispatcherObject = resource as DispatcherObject; 
            if (dispatcherObject != null)
            { 
                // The current thread may not have access to this Object. 
                dispatcherObject.VerifyAccess();
            } 
        }

        if (found && mustReturnDeferredResourceReference)
        { 
            resource = new DeferredResourceReferenceHolder(key, resource);
        } 

        return found;
    } 

    /// <summary>
    ///     Searches for a resource inside a ResourceDictionary.
    /// </summary> 
    /// <param name="key">The original key.</param>
    /// <param name="typeKey">The key cast to Type.</param> 
    /// <param name="resourceKey">The key cast to ResourceKey.</param> 
    /// <param name="isTraceEnabled">Tracing on/off.</param>
    /// <param name="allowDeferredResourceReference"> 
    ///     If this flag is true the resource will not actually be inflated from Baml.
    ///     Instead we will return an instance of DeferredDictionaryReference which
    ///     can later be used to query the resource
    /// </param> 
    /// <param name="mustReturnDeferredResourceReference">
    ///     If this method is true this method will always return a 
    ///     DeferredThemeResourceReference instance which envelopes the underlying resource. 
    /// </param>
    /// <param name="canCache">Whether callers can cache the value.</param> 
    /// <returns></returns>
    private static Object FindDictionaryResource(
        Object      key,
        Type        typeKey, 
        ResourceKey resourceKey,
        boolean        isTraceEnabled, 
        boolean        allowDeferredResourceReference, 
        boolean        mustReturnDeferredResourceReference,
        /*out*/ boolean    canCache) 
    {
        // Thread safety handled by FindResourceInternal. Be sure to have locked _resourceCache.SyncRoot.

//        Debug.Assert(typeKey != null || resourceKey != null, "typeKey or resourceKey should be non-null"); 

        canCache = true; 
        Object resource = null; 
        Assembly assembly = (typeKey != null) ? typeKey.Assembly : resourceKey.Assembly;

        if ((assembly == null) || IgnoreAssembly(assembly))
        {
            // Without an assembly, we can't figure out which dictionary to look at.
            // Also, ignore some common assemblies we know to not contain resources. 
            return null;
        } 

        ResourceDictionaries dictionaries = EnsureDictionarySlot(assembly);
        ResourceDictionary dictionary = dictionaries.LoadThemedDictionary(isTraceEnabled); 
        if (dictionary != null)
        {
            resource = LookupResourceInDictionary(dictionary, key, allowDeferredResourceReference, 
            		mustReturnDeferredResourceReference, /*out*/ canCache);
        } 

        if (resource == null) 
        { 
            dictionary = dictionaries.LoadGenericDictionary(isTraceEnabled);
            if (dictionary != null) 
            {
                resource = LookupResourceInDictionary(dictionary, key, allowDeferredResourceReference, 
                		mustReturnDeferredResourceReference, /*out*/ canCache);
            }
        } 

        if (resource != null) 
        { 
            // Resources coming out of the dictionary may need to be frozen
            Freeze(resource); 
        }

        return resource;
    } 

    /// <summary> 
    ///     Looks in the ResourceDictionary for the desired resource. 
    /// </summary>
    /// <param name="dictionary">The ResourceDictionary to look in.</param> 
    /// <param name="key">The key for the resource.</param>
    /// <param name="allowDeferredResourceReference">
    ///     If this flag is true the resource will not actually be inflated from Baml.
    ///     Instead we will return an instance of DeferredDictionaryReference which 
    ///     can later be used to query the resource
    /// </param> 
    /// <param name="mustReturnDeferredResourceReference"> 
    ///     If this method is true this method will always return a
    ///     DeferredThemeResourceReference instance which envelopes the underlying resource. 
    /// </param>
    /// <param name="canCache">Whether callers should cache the value.</param>
    /// <returns>The resource if found and successfully loaded, null otherwise.</returns>
    private static Object LookupResourceInDictionary( 
        ResourceDictionary  dictionary,
        Object              key, 
        boolean                allowDeferredResourceReference, 
        boolean                mustReturnDeferredResourceReference,
        /*out*/ boolean            canCache) 
    {
        Object resource = null;
        IsSystemResourcesParsing = true;

        try
        { 
            resource = dictionary.FetchResource(key, allowDeferredResourceReference, mustReturnDeferredResourceReference, /*out*/ canCache); 
        }
        finally 
        {
            IsSystemResourcesParsing = false;
        }

        return resource;
    } 

    /// <summary>
    ///     Unbinds a Freezable from its Context. 
    /// </summary>
    /// <param name="resource">The resource to freeze.</param>
    private static void Freeze(Object resource)
    { 
        Freezable freezable = resource as Freezable;
        if (freezable != null && !freezable.IsFrozen) 
        { 
            freezable.Freeze();
        } 
    }

//    #endregion

//    #region Dictionary Loading

    /// <summary> 
    ///     Returns the dictionary cache slot associated with the given assembly.
    /// </summary> 
    /// <param name="assembly">The desired assembly</param>
    /// <returns>The cache slot.</returns>
    private static ResourceDictionaries EnsureDictionarySlot(Assembly assembly)
    { 
        ResourceDictionaries dictionaries = null;
        if (_dictionaries != null) 
        { 
            _dictionaries.TryGetValue(assembly, out dictionaries);
        } 
        else
        {
            // We will be caching data, create the cache
            _dictionaries = new Dictionary<Assembly, ResourceDictionaries>(1); 
        }

        if (dictionaries == null) 
        {
            // Ensure the cache slot is created 
            dictionaries = new ResourceDictionaries(assembly);
            _dictionaries.Add(assembly, dictionaries);
        }

        return dictionaries;
    } 

    private static boolean IgnoreAssembly(Assembly assembly)
    { 
        return (assembly == MsCorLib) || (assembly == PresentationCore) || (assembly == WindowsBase);
    }

    private static Assembly MsCorLib 
    {
        get 
        { 
            if (_mscorlib == null)
            { 
                _mscorlib = typeof(String).Assembly;
            }

            return _mscorlib; 
        }
    } 

    private static Assembly PresentationFramework
    { 
        get
        {
            if (_presentationFramework == null)
            { 
                _presentationFramework = typeof(FrameworkElement).Assembly;
            } 

            return _presentationFramework;
        } 
    }

    private static Assembly PresentationCore
    { 
        get
        { 
            if (_presentationCore == null) 
            {
                _presentationCore = typeof(UIElement).Assembly; 
            }

            return _presentationCore;
        } 
    }

    private static Assembly WindowsBase 
    {
        get 
        {
            if (_windowsBase == null)
            {
                _windowsBase = typeof(DependencyObject).Assembly; 
            }

            return _windowsBase; 
        }
    } 

    /// <summary>
    ///     Loads and caches the generic and themed resource dictionaries for an assembly.
    /// </summary> 
    /*internal*/ public class ResourceDictionaries
    { 
        /// <summary> 
        ///     Creates an instance of this class.
        /// </summary> 
        /// <param name="assembly">The assembly that this class represents.</param>
        /*internal*/ public ResourceDictionaries(Assembly assembly)
        {
            _assembly = assembly; 
            if (assembly == PresentationFramework)
            { 
                // Since we know all the information about PresentationFramework in advance, 
                // we can pre-initialize that data.
                _assemblyName = PresentationFrameworkName; 

                // There is no generic dictionary
                _genericDictionary = null;
                _genericLoaded = true; 
                _genericLocation = ResourceDictionaryLocation.None;

                // Themed dictionaries are all external 
                _themedLocation = ResourceDictionaryLocation.ExternalAssembly;
                _locationsLoaded = true; 
            }
            else
            {
                _assemblyName = SafeSecurityHelper.GetAssemblyPartialName(assembly); 
            }
        } 

        /// <summary>
        ///     Resets the themed dictionaries. This is used when the theme changes. 
        /// </summary>
        /*internal*/ public void ClearThemedDictionary()
        {
            _themedLoaded = false; 
            _themedDictionary = null;
        } 

        /// <summary>
        ///     Returns the theme dictionary associated with this assembly. 
        /// </summary>
        /// <param name="isTraceEnabled">Whether debug tracing is enabled.</param>
        /// <returns>The dictionary if loaded, otherwise null.</returns>
        /*internal*/ public ResourceDictionary LoadThemedDictionary(boolean isTraceEnabled) 
        {
            if (!_themedLoaded) 
            { 
                LoadDictionaryLocations();

                if (_preventReEnter || (_themedLocation == ResourceDictionaryLocation.None))
                {
                    // We are already in the middle of parsing this resource dictionary, avoid infinite loops.
                    // OR, there are no themed resources. 
                    return null;
                } 

                IsSystemResourcesParsing = true;
                _preventReEnter = true; 
                try
                {
                    ResourceDictionary dictionary = null;

                    // Get the assembly to look inside for resources.
                    Assembly assembly; 
                    String assemblyName; 
                    boolean external = (_themedLocation == ResourceDictionaryLocation.ExternalAssembly);
                    if (external) 
                    {
                        LoadExternalAssembly(false /* classic */, false /* generic */, out assembly, out assemblyName);
                    }
                    else 
                    {
                        assembly = _assembly; 
                        assemblyName = _assemblyName; 
                    }

                    if (assembly != null)
                    {
                        dictionary = LoadDictionary(assembly, assemblyName, ThemedResourceName, isTraceEnabled);
                        if ((dictionary == null) && !external) 
                        {
                            // Themed resources should have been inside the source assembly, but failed to load. 
                            // Try falling back to external in case this is a theme that shipped later. 
                            LoadExternalAssembly(false /* classic */, false /* generic */, out assembly, out assemblyName);
                            if (assembly != null) 
                            {
                                dictionary = LoadDictionary(assembly, assemblyName, ThemedResourceName, isTraceEnabled);
                            }
                        } 
                    }

                    if ((dictionary == null) && UxThemeWrapper.IsActive) 
                    {
                        // If a non-classic dictionary failed to load, then try to load classic. 
                        if (external)
                        {
                            LoadExternalAssembly(true /* classic */, false /* generic */, out assembly, out assemblyName);
                        } 
                        else
                        { 
                            assembly = _assembly; 
                            assemblyName = _assemblyName;
                        } 

                        if (assembly != null)
                        {
                            dictionary = LoadDictionary(assembly, assemblyName, ClassicResourceName, isTraceEnabled); 
                        }
                    } 

                    _themedDictionary = dictionary;
                    _themedLoaded = true; 
                }
                finally
                {
                    _preventReEnter = false; 
                    IsSystemResourcesParsing = false;
                } 
            } 

            return _themedDictionary; 
        }

        /// <summary>
        ///     Returns the generic dictionary associated with this assembly. 
        /// </summary>
        /// <param name="isTraceEnabled">Whether debug tracing is enabled.</param> 
        /// <returns>The dictionary if loaded, otherwise null.</returns> 
        /*internal*/ public ResourceDictionary LoadGenericDictionary(boolean isTraceEnabled)
        { 
            if (!_genericLoaded)
            {
                LoadDictionaryLocations();

                if (_preventReEnter || (_genericLocation == ResourceDictionaryLocation.None))
                { 
                    // We are already in the middle of parsing this resource dictionary, avoid infinite loops. 
                    return null;
                } 

                IsSystemResourcesParsing = true;
                _preventReEnter = true;
                try 
                {
                    ResourceDictionary dictionary = null; 

                    // Get the assembly to look inside
                    Assembly assembly; 
                    String assemblyName;
                    if (_genericLocation == ResourceDictionaryLocation.ExternalAssembly)
                    {
                        LoadExternalAssembly(false /* classic */, true /* generic */, out assembly, out assemblyName); 
                    }
                    else 
                    { 
                        assembly = _assembly;
                        assemblyName = _assemblyName; 
                    }

                    if (assembly != null)
                    { 
                        dictionary = LoadDictionary(assembly, assemblyName, GenericResourceName, isTraceEnabled);
                    } 

                    _genericDictionary = dictionary;
                    _genericLoaded = true; 
                }
                finally
                {
                    _preventReEnter = false; 
                    IsSystemResourcesParsing = false;
                } 
            } 

            return _genericDictionary; 
        }

        /// <summary>
        ///     Loads the assembly attribute indicating where dictionaries are stored. 
        /// </summary>
        private void LoadDictionaryLocations() 
        { 
            if (!_locationsLoaded)
            { 
                ThemeInfoAttribute locations = ThemeInfoAttribute.FromAssembly(_assembly);
                if (locations != null)
                {
                    _themedLocation = locations.ThemeDictionaryLocation; 
                    _genericLocation = locations.GenericDictionaryLocation;
                } 
                else 
                {
                    _themedLocation = ResourceDictionaryLocation.None; 
                    _genericLocation = ResourceDictionaryLocation.None;
                }
                _locationsLoaded = true;
            } 
        }

        /// <summary> 
        ///     Loads an associated theme assembly based on a main assembly.
        /// </summary> 
        private void LoadExternalAssembly(boolean classic, boolean generic, /*out*/ Assembly assembly, /*out*/ String assemblyName)
        {
            StringBuilder sb = new StringBuilder(_assemblyName.Length + 10);

            sb.Append(_assemblyName);
            sb.Append("."); 

            if (generic)
            { 
                sb.Append("generic");
            }
            else if (classic)
            { 
                sb.Append("classic");
            } 
            else 
            {
                sb.Append(UxThemeWrapper.ThemeName); 
            }

            assemblyName = sb.ToString();
            String fullName = SafeSecurityHelper.GetFullAssemblyNameFromPartialName(_assembly, assemblyName); 

            assembly = null; 
            try 
            {
                assembly = Assembly.Load(fullName); 
            }
            // There is no Assembly.Exists API to determine if an Assembly exists.
            // There is also no way to determine if an Assembly's format is good prior to loading it.
            // So, the exception must be caught. assembly will continue to be null and returned. 
//#pragma warning disable 6502
            catch (FileNotFoundException) 
            { 
            }
            catch (BadImageFormatException) 
            {
            }

            // Wires themes KnownTypeHelper 
            if (_assemblyName == PresentationFrameworkName && assembly != null)
            { 
                Type knownTypeHelper = assembly.GetType("Microsoft.Windows.Themes.KnownTypeHelper"); 
                if (knownTypeHelper != null)
                { 
                    MS.Internal.WindowsBase.SecurityHelper.RunClassConstructor(knownTypeHelper);
                }
            }
//#pragma warning restore 6502 
        }

        /// <summary> 
        ///     The String to use as the key to load the .NET resource stream that contains themed resources.
        /// </summary> 
        /*internal*/ public static String ThemedResourceName
        {
            get
            { 
                if (_themedResourceName == null)
                { 
                    if (UxThemeWrapper.IsActive) 
                    {
                        _themedResourceName = "themes/" + UxThemeWrapper.ThemeName.ToLowerInvariant() + "." + UxThemeWrapper.ThemeColor.ToLowerInvariant(); 
                    }
                    else
                    {
                        _themedResourceName = ClassicResourceName; 
                    }
                } 

                return _themedResourceName;
            } 
        }

        /// <summary>
        ///     Loads a ResourceDictionary from within an assembly's .NET resource store. 
        /// </summary>
        /// <param name="assembly">The owning assembly.</param> 
        /// <param name="assemblyName">The name of the owning assembly.</param> 
        /// <param name="resourceName">The name of the desired theme resource.</param>
        /// <param name="isTraceEnabled">Whether tracing is enabled.</param> 
        /// <returns>The dictionary if found and loaded successfully, null otherwise.</returns>
        /// <SecurityNote>
        /// Critical: Asserts XamlLoadPermission.
        /// Safe: BAML inside an assembly is allowed to access internals in that assembly. 
        ///       We are loading the BAML directly from an assembly, so we know the source.
        /// </SecurityNote> 
//        [SecurityCritical, SecurityTreatAsSafe] 
        private ResourceDictionary LoadDictionary(Assembly assembly, String assemblyName, String resourceName, boolean isTraceEnabled)
        { 
            ResourceDictionary dictionary = null;

            // Create the resource manager that will load the byte array
            ResourceManager rm = new ResourceManager(assemblyName + ".g", assembly); 

            resourceName = resourceName + ".baml"; 
            // Load the resource stream 
            Stream stream = null;
            try 
            {
                stream = rm.GetStream(resourceName, CultureInfo.CurrentUICulture);
            }
            // There is no ResourceManager.HasManifest in order to detect this case before an exception is thrown. 
            // Likewise, there is no way to know if loading a resource will fail prior to loading it.
            // So, the exceptions must be caught. stream will continue to be null and handled accordingly later. 
//#pragma warning disable 6502 

            catch (MissingManifestResourceException) 
            {
                // No usable resources in the assembly
            }
            catch (MissingSatelliteAssemblyException) 
            {
                // No usable resources in the assembly 
            } 
//#if !DEBUG
            catch (InvalidOperationException) 
            {
                // Object not stored correctly
            }
//#endif 

//#pragma warning restore 6502 

            if (stream != null)
            { 
                Baml2006ReaderSettings settings = new Baml2006ReaderSettings();
                settings.OwnsStream = true;
                settings.LocalAssembly = assembly;

                Baml2006Reader bamlReader = new Baml2006Reader(stream, new Baml2006SchemaContext(settings.LocalAssembly), settings);

                System.Xaml.XamlObjectWriterSettings owSettings = XamlReader.CreateObjectWriterSettingsForBaml(); 
                if (assembly != null)
                { 
                    owSettings.AccessLevel = XamlAccessLevel.AssemblyAccessTo(assembly);
                }
                System.Xaml.XamlObjectWriter writer = new System.Xaml.XamlObjectWriter(bamlReader.SchemaContext, owSettings);

                if (owSettings.AccessLevel != null)
                { 
                    XamlLoadPermission loadPermission = new XamlLoadPermission(owSettings.AccessLevel); 
                    loadPermission.Assert();
                    try 
                    {
                        System.Xaml.XamlServices.Transform(bamlReader, writer);
                    }
                    finally 
                    {
                        CodeAccessPermission.RevertAssert(); 
                    } 
                }
                else 
                {
                    System.Xaml.XamlServices.Transform(bamlReader, writer);
                }
                dictionary = (ResourceDictionary)writer.Result; 

                if (isTraceEnabled && (dictionary != null)) 
                { 
                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientResourceBamlAssembly,
                                                        EventTrace.Keyword.KeywordXamlBaml, EventTrace.Level.Verbose, 
                                                        assemblyName);
                }
            }

            return dictionary;
        } 

        /*internal*/ public static void OnThemeChanged()
        { 
            _themedResourceName = null;
        }

        private ResourceDictionary _genericDictionary; 
        private ResourceDictionary _themedDictionary;
        private boolean _genericLoaded = false; 
        private boolean _themedLoaded = false; 
        private boolean _preventReEnter = false;
        private boolean _locationsLoaded = false; 
        private String _assemblyName;
        private Assembly _assembly;
        private ResourceDictionaryLocation _genericLocation;
        private ResourceDictionaryLocation _themedLocation; 

        private static String _themedResourceName; 
    } 

//    #endregion 

//    #region Value Changes

    // The hwndNotify is referenced by the _hwndNotify static field, but 
    // PreSharp will think that the hwndNotify is local and should be disposed.
//#pragma warning disable 6518 

    ///<SecurityNote>
    ///     Critical - Creates an HwndWrapper and adds a hook. 
    ///     TreatAsSafe: The _hwndNotify window is critical and this function is safe to call
    ///</SecurityNote>
//    [SecurityCritical,SecurityTreatAsSafe]
    private static void EnsureResourceChangeListener() 
    {
        // Create a new notify window if we haven't already created one for this thread. 
        if (_hwndNotify == null) 
        {
            // Create a top-level, invisible window so we can get the WM_THEMECHANGE notification 
            // and for HwndHost to park non-visible HwndHosts.
            HwndWrapper hwndNotify;
            hwndNotify = new HwndWrapper(0, NativeMethods.WS_POPUP|NativeMethods.WS_DISABLED, 0, 0, 0, 0, 0, "SystemResourceNotifyWindow", IntPtr.Zero, null);
            _hwndNotify = new SecurityCriticalDataClass<HwndWrapper>(hwndNotify); 
            _hwndNotify.Value.Dispatcher.ShutdownFinished += OnShutdownFinished;
            _hwndNotifyHook = new HwndWrapperHook(SystemThemeFilterMessage); 
            _hwndNotify.Value.AddHook(_hwndNotifyHook); 
        }
    } 

    ///<SecurityNote>
    ///     Critical - Calls dispose on the critical hwnd wrapper.
    ///     TreatAsSafe: It is safe to dispose the wrapper 
    ///</SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe] 
    private static void OnShutdownFinished(Object sender, EventArgs args) 
    {
        if (_hwndNotify != null) 
            _hwndNotify.Value.Dispose();

        _hwndNotifyHook = null;
        _hwndNotify = null; 
    }

//#pragma warning restore 6518 

    private static void OnThemeChanged() 
    {
        ResourceDictionaries.OnThemeChanged();
        UxThemeWrapper.OnThemeChanged();
        ThemeDictionaryExtension.OnThemeChanged(); 

        /*lock*/synchronized (ThemeDictionaryLock) 
        { 
            // Clear the resource cache
            _resourceCache.Clear(); 

            // Clear the themeStyleCache
            _themeStyleCache.Clear();

            // Clear the themed dictionaries
            if (_dictionaries != null) 
            { 
                for/*each*/ (ResourceDictionaries dictionaries : _dictionaries.Values)
                { 
                    dictionaries.ClearThemedDictionary();
                }
            }
        } 
    }

    private static void OnSystemValueChanged() 
    {
        lock (ThemeDictionaryLock) 
        {
            // Collect the list of keys for the values that will need to be removed
            // Note: We don't immediately remove them because the Key list is not
            // static. 

            List<SystemResourceKey> keys = new List<SystemResourceKey>(); 

            for/*each*/ (Object key : _resourceCache.Keys)
            { 
                SystemResourceKey resKey = key as SystemResourceKey;
                if (resKey != null)
                {
                    keys.Add(resKey); 
                }
            } 

            // Remove the values

            int count = keys.Count;
            for (int i = 0; i < count; i++)
            {
                _resourceCache.Remove(keys[i]); 
            }
        } 
    } 

    private static Object InvalidateTreeResources(Object args) 
    {
        Object[] argsArray = (Object[])args;
        PresentationSource source = (PresentationSource)argsArray[0];
        if (!source.IsDisposed) 
        {
            FrameworkElement fe = source.RootVisual as FrameworkElement; 
            if (fe != null) 
            {
                boolean isSysColorsOrSettingsChange = (boolean)argsArray[1]; 
                if (isSysColorsOrSettingsChange)
                {
                    TreeWalkHelper.InvalidateOnResourcesChange(fe, null, ResourcesChangeInfo.SysColorsOrSettingsChangeInfo);
                } 
                else
                { 
                    TreeWalkHelper.InvalidateOnResourcesChange(fe, null, ResourcesChangeInfo.ThemeChangeInfo); 
                }

                System.Windows.Input.KeyboardNavigation.AlwaysShowFocusVisual = SystemParameters.KeyboardCues;
                fe.CoerceValue(System.Windows.Input.KeyboardNavigation.ShowKeyboardCuesProperty);

                SystemResourcesAreChanging = true; 
                // Update FontFamily properties on root elements
                fe.CoerceValue(TextElement.FontFamilyProperty); 
                fe.CoerceValue(TextElement.FontSizeProperty); 
                fe.CoerceValue(TextElement.FontStyleProperty);
                fe.CoerceValue(TextElement.FontWeightProperty); 
                SystemResourcesAreChanging = false;

                PopupRoot popupRoot = fe as PopupRoot;
                if (popupRoot != null && popupRoot.Parent != null) 
                {
                    popupRoot.Parent.CoerceValue(Popup.HasDropShadowProperty); 
                } 
            }
        } 

        return null;
    }

    /// <summary>
    /// This method calls into PresentationCore internally to update Tabelt devices when the system settings change. 
    /// </summary> 
    /// <param name="msg"></param>
    /// <param name="wParam"></param> 
    /// <param name="lParam"></param>
    /// <SecurityNote>
    ///     Critical - Accesses the critical data.
    ///                 _hwndNotify 
    /// </SecurityNote>
//    [SecurityCritical] 
    private static void InvalidateTabletDevices(WindowMessage msg, IntPtr wParam, IntPtr lParam) 
    {
        if ( _hwndNotify != null ) 
        {
            Dispatcher dispatcher = _hwndNotify.Value.Dispatcher;
            if ( dispatcher != null && dispatcher.InputManager != null )
            { 
                ((InputManager)dispatcher.InputManager).StylusLogic.HandleMessage(msg, wParam, lParam);
            } 
        } 
    }

    ///<SecurityNote>
    ///     Critical - calls CriticalCurrentSources.
    ///     TreatAsSafe - invalidation of resources considered ok.
    ///                   Net effect is an invalidation of tree and reload of BAML from theme files. 
    ///                   Worse that could happen is a DOS attack within the app.
    ///</SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe ] 
    private static void InvalidateResources(boolean isSysColorsOrSettingsChange)
    { 
        SystemResourcesHaveChanged = true;

        Dispatcher dispatcher = isSysColorsOrSettingsChange ? null : Dispatcher.FromThread(System.Threading.Thread.CurrentThread);
        if (dispatcher != null || isSysColorsOrSettingsChange) 
        {
            for/*each*/ (PresentationSource source : PresentationSource.CriticalCurrentSources) 
            { 
                if (!source.IsDisposed && (isSysColorsOrSettingsChange || (source.Dispatcher == dispatcher)))
                { 
                    source.Dispatcher.BeginInvoke(DispatcherPriority.Normal,
                                                  new DispatcherOperationCallback(InvalidateTreeResources),
                                                  new Object[]{source, isSysColorsOrSettingsChange});
                } 
            }
        } 
    } 
    /// <SecurityNote>
    ///     Critical: This code calls into PeekMessage and can be used to spoof theme change messages 
    ///     TreatAsSafe:The call to PeekMessage is safe and no information is exposed. In the case of the
    ///     messages handled in this function, no data is passed in or out, the only form of attack possible
    ///     here is DOS by excessive calls to this.
    /// </SecurityNote> 
//    [SecurityCritical,SecurityTreatAsSafe]
    private static IntPtr SystemThemeFilterMessage(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, /*ref*/ boolean handled) 
    { 
        WindowMessage message = (WindowMessage)msg;
        switch (message) 
        {
            case WindowMessage.WM_DEVICECHANGE:
                InvalidateTabletDevices(message, wParam, lParam);

                // If there was an invalidation made to a Mouse metric,
                // then resource references need to be invalidated. 
                if (SystemParameters.InvalidateDeviceDependentCache()) 
                {
                    OnSystemValueChanged(); 
                    InvalidateResources(true); // Invalidate all resource since this should happen only once
                }
                break;

            case WindowMessage.WM_DISPLAYCHANGE:
                InvalidateTabletDevices(message, wParam, lParam); 

                // If there was an invalidation made to a Display metric,
                // then resource references need to be invalidated. 
                if (SystemParameters.InvalidateDisplayDependentCache())
                {
                    OnSystemValueChanged();
                    InvalidateResources(true); // Invalidate all resource since this should happen only once 
                }
                break; 

            case WindowMessage.WM_POWERBROADCAST:
                // If there was an invalidation made to a Power Setting, 
                // then resource references need to be invalidated.
                if (NativeMethods.IntPtrToInt32(wParam) == NativeMethods.PBT_APMPOWERSTATUSCHANGE &&
                    SystemParameters.InvalidatePowerDependentCache())
                { 
                    OnSystemValueChanged();
                    InvalidateResources(true); // Invalidate all resource since this should happen only once 
                } 
                break;

            case WindowMessage.WM_THEMECHANGED:
                SystemColors.InvalidateCache();
                SystemParameters.InvalidateCache();
                SystemParameters.InvalidateDerivedThemeRelatedProperties(); 
                OnThemeChanged();
                InvalidateResources(false); // Only invalidate this thread's resources, other threads will get a chance 
                break; 


            case WindowMessage.WM_SYSCOLORCHANGE:
                // If there was an invalidation made to a system color or brush,
                // then resource references need to be invalidated.
                if (SystemColors.InvalidateCache()) 
                {
                    OnSystemValueChanged(); 
                    InvalidateResources(true); // Invalidate all resource since this should happen only once 
                }
                break; 

            case WindowMessage.WM_SETTINGCHANGE:
                InvalidateTabletDevices(message, wParam, lParam); // Update tablet device settings

                // If there was an invalidation made to a system param or metric,
                // then resource references need to be invalidated. 
                if (SystemParameters.InvalidateCache((int)wParam)) 
                {
                    OnSystemValueChanged(); 
                    InvalidateResources(true); // Invalidate all resource since this should happen only once

                    // NOTICE-2005/06/17-WAYNEZEN,
                    // We have to invoke the below method after InvalidateResources. 
                    // So the tablet ink HighContrastHelper can pick up the correct HighContrast setting.
                    HighContrastHelper.OnSettingChanged(); 
                } 

                SystemParameters.InvalidateWindowFrameThicknessProperties(); 
                break;

            case WindowMessage.WM_TABLET_ADDED:
                InvalidateTabletDevices(message, wParam, lParam); 
                break;

            case WindowMessage.WM_TABLET_DELETED: 
                InvalidateTabletDevices(message, wParam, lParam);
                break; 

            case WindowMessage.WM_DWMNCRENDERINGCHANGED:
            case WindowMessage.WM_DWMCOMPOSITIONCHANGED:
                SystemParameters.InvalidateIsGlassEnabled(); 
                break;

            case WindowMessage.WM_DWMCOLORIZATIONCOLORCHANGED: 
                SystemParameters.InvalidateWindowGlassColorizationProperties();
                break; 
        }

        return IntPtr.Zero ;

    }

    /*internal*/ public static boolean ClearBitArray(BitArray cacheValid) 
    {
        boolean changed = false; 

        for (int i = 0; i < cacheValid.Count; i++)
        {
            if (ClearSlot(cacheValid, i)) 
            {
                changed = true; 
            } 
        }

        return changed;
    }

    /*internal*/ public static boolean ClearSlot(BitArray cacheValid, int slot) 
    {
        if (cacheValid[slot]) 
        { 
            cacheValid[slot] = false;
            return true; 
        }

        return false;
    } 

//    #endregion 

    // Flag the parser to create DeferredThemeReferences for thread safety
    /*internal*/ public static boolean IsSystemResourcesParsing 
    {
        get
        {
            return _parsing > 0; 
        }
        set 
        { 
            if (value)
            { 
                _parsing++;
            }
            else
            { 
                _parsing--;
            } 
        } 
    }

    // This is the lock used to protect access to the
    // theme dictionaries and the associated cache.
    /*internal*/ public static Object ThemeDictionaryLock
    { 
        get { return _resourceCache.SyncRoot; }
    } 

    // This is the /*internal*/ public accessor for the
    // hwnd used to watch for messages. 
    //
    // Currrently this is used by HwndHost as a place
    // to parent Child hwnds when they are disconnected
    /*internal*/ public static HwndWrapper Hwnd 
    {
//        [SecurityCritical] 
        get 
        {
            if (_hwndNotify == null) 
            {
                EnsureResourceChangeListener();
            }
            return _hwndNotify.Value; 
        }
    } 

    /// <summary>
    /// Makes sure the listener window is the last one to get the Dispatcher.ShutdownFinished notification, 
    /// thus giving any child windows a chance to respond first. See HwndHost.BuildOrReparentWindow().
    /// </summary>
    /*internal*/ public static void DelayHwndShutdown()
    { 
        if (_hwndNotify != null)
        { 
            Dispatcher d = Dispatcher.CurrentDispatcher; 
            d.ShutdownFinished -= OnShutdownFinished;
            d.ShutdownFinished += OnShutdownFinished; 
        }
    }

//    #endregion 

//    #region Data 

//  [ThreadStatic]
    private static int _parsing;

//  [ThreadStatic] 
    private static SecurityCriticalDataClass<HwndWrapper> _hwndNotify;
//  [ThreadStatic] 
//  [SecurityCritical] 
    private static HwndWrapperHook _hwndNotifyHook;

    private static Hashtable _resourceCache = new Hashtable(); 
    private static DTypeMap _themeStyleCache = new DTypeMap(100); // This is based upon the max DType.ID found in MSN scenario
    private static Dictionary<Assembly, ResourceDictionaries> _dictionaries; 
    private static Object _specialNull = new Object(); 

    /*internal*/ public final String GenericResourceName = "themes/generic"; 
    /*internal*/ public final String ClassicResourceName = "themes/classic";

    private static Assembly _mscorlib;
    private static Assembly _presentationFramework; 
    private static Assembly _presentationCore;
    private static Assembly _windowsBase; 
    /*internal*/ public final String PresentationFrameworkName = "PresentationFramework"; 

    // SystemResourcesHaveChanged indicates to FE that the font properties need to be coerced 
    // when creating a new root element
    /*internal*/ public static boolean SystemResourcesHaveChanged;

    // SystemResourcesAreChanging is used by FE when coercing the font properties to determine 
    // if it should return the current system metric or the value passed to the coerce callback
//    [ThreadStatic] 
    /*internal*/ public static boolean SystemResourcesAreChanging; 
//    #endregion
} 


 
    

 
 
