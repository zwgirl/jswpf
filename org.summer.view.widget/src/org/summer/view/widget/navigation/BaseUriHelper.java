package org.summer.view.widget.navigation;

import org.osgi.framework.Version;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.ContentElement;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.PropertyMetadata;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.Uri;
import org.summer.view.widget.markup.IUriContext;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.widget.reflection.Assembly;

/// <summary>
/// BaseUriHelper class provides BaseUri related property, methods.
/// </summary> 
public /*static*/ class BaseUriHelper
{ 
    private final String SOOBASE = "SiteOfOrigin://"; 
    private static final Uri _siteOfOriginBaseUri = PackUriHelper.Create(new Uri(SOOBASE));
    private final String APPBASE = "application://"; 
    private static final Uri _packAppBaseUri = PackUriHelper.Create(new Uri(APPBASE));

    private static SecurityCriticalDataForSet<Uri> _baseUri;

    // Cached result of calling
    // PackUriHelper.GetPackageUri(BaseUriHelper.PackAppBaseUri).GetComponents( 
    // UriComponents.AbsoluteUri, 
    // UriFormat.UriEscaped);
    private final String _packageApplicationBaseUriEscaped = "application:///"; 
    private final String _packageSiteOfOriginBaseUriEscaped = "siteoforigin:///";

    /// <SecurityNote>
    /// Critical: because it sets critical data. 
    ///         Adds SiteOfOriginContainer to PreloadedPackages.
    /// TreatAsSafe: because it is the static ctor, and the data doesn't go anywhere. 
    ///         SiteOfOriginContainer is a well-known package and allowed to be added 
    ///         to PreloadedPackages. Also, the package is not going to be handed out
    ///         from this API surface and as such will be protected 
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe]
    static //BaseUriHelper()
    { 
        _baseUri = new SecurityCriticalDataForSet<Uri>(_packAppBaseUri);
        // Add an instance of the ResourceContainer to PreloadedPackages so that PackWebRequestFactory can find it 
        // and mark it as thread-safe so PackWebResponse won't protect returned streams with a synchronizing wrapper 
        PreloadedPackages.AddPackage(PackUriHelper.GetPackageUri(SiteOfOriginBaseUri), new SiteOfOriginContainer(), true);
    } 

//    #region public property and method

    /// <summary> 
    ///     The DependencyProperty for BaseUri of current Element.
    /// 
    ///     Flags: None 
    ///     Default Value: null.
    /// </summary> 
    public static final DependencyProperty BaseUriProperty =
                DependencyProperty.RegisterAttached(
                            "BaseUri",
                            typeof(Uri), 
                            typeof(BaseUriHelper),
                            new PropertyMetadata((Object)null)); 


    /// <summary> 
    /// Get BaseUri for a dependency Object inside a tree.
    ///
    /// </summary>
    /// <param name="element">Dependency Object</param> 
    /// <returns>BaseUri for the element</returns>
    /// <remarks> 
    ///     Callers must have FileIOPermission(FileIOPermissionAccess.PathDiscovery) for the given Uri to call this API. 
    /// </remarks>
    /// <SecurityNote> 
    /// Critical: as it access the BaseUri, which is critcal
    /// PublicOK: calls GetBaseUriCore that does a demand
    /// Not available from the Internet zone
    /// </SecurityNote> 
//    [SecurityCritical]
    public static Uri GetBaseUri(DependencyObject element) 
    { 
        Uri baseUri = GetBaseUriCore(element);

        //
        // Manipulate BaseUri after tree searching is done.
        //

        if (baseUri == null)
        { 
            // If no BaseUri information is found from the current tree, 
            // just take the Application's BaseUri.
            // Application's BaseUri must be an absolute Uri. 

            baseUri = BaseUriHelper.BaseUri;
        }
        else 
        {
            if (baseUri.IsAbsoluteUri == false) 
            { 
                // Most likely the BaseUriDP in element or IUriContext.BaseUri
                // is set to a relative Uri programmatically in user's code. 
                // For this case, we should resolve this relative Uri to PackAppBase
                // to generate an absolute Uri.

                // 
                // BamlRecordReader now always sets absolute Uri for UriContext
                // element when the tree is generated from baml/xaml stream, this 
                // code path would not run for parser-loaded tree. 
                //

                baseUri = new Uri(BaseUriHelper.BaseUri, baseUri);
            }
        }

        return baseUri;
    } 


//   #endregion public property and method 

//    #region /*internal*/ public properties and methods

    static /*internal*/ public Uri SiteOfOriginBaseUri 
    {
//        [FriendAccessAllowed] 
        get 
        {
            return _siteOfOriginBaseUri; 
        }
    }

    static /*internal*/ public Uri PackAppBaseUri 
    {
//        [FriendAccessAllowed] 
        get 
        {
            return _packAppBaseUri; 
        }
    }

    /// <summary> 
    /// Checks whether the input uri is in the "pack://application:,,," form
    /// </summary> 
    /*internal*/ public static boolean IsPackApplicationUri(Uri uri) 
    {
        return 
            // Is the "outer" URI absolute?
            uri.IsAbsoluteUri &&

            // Does the "outer" URI have the pack: scheme? 
            SecurityHelper.AreStringTypesEqual(uri.Scheme, PackUriHelper.UriSchemePack) &&

            // Does the "inner" URI have the application: scheme 
            SecurityHelper.AreStringTypesEqual(
                PackUriHelper.GetPackageUri(uri).GetComponents(UriComponents.AbsoluteUri, UriFormat.UriEscaped), 
                _packageApplicationBaseUriEscaped);
    }

    // The method accepts a relative or absolute Uri and returns the appropriate assembly. 
    //
    // For absolute Uri, it accepts only "pack://application:,,,/...", throw exception for 
    // any other absolute Uri. 
    //
    // If the first segment of that Uri contains ";component", returns the assembly whose 
    // assembly name matches the text String in the first segment. otherwise, this method
    // would return EntryAssembly in the AppDomain.
    //
//    [FriendAccessAllowed] 
    /*internal*/ public static void GetAssemblyAndPartNameFromPackAppUri(Uri uri, out Assembly assembly, out String partName)
    { 
        // The input Uri is assumed to be a valid absolute pack application Uri. 
        // The caller should guarantee that.
        // Perform a sanity check to make sure the assumption stays. 
        Debug.Assert(uri != null && uri.IsAbsoluteUri && SecurityHelper.AreStringTypesEqual(uri.Scheme, PackUriHelper.UriSchemePack) && IsPackApplicationUri(uri));

        // Generate a relative Uri which gets rid of the pack://application:,,, authority part.
        Uri partUri = new Uri(uri.AbsolutePath, UriKind.Relative); 

        String assemblyName; 
        String assemblyVersion; 
        String assemblyKey;

        GetAssemblyNameAndPart(partUri, out partName, out assemblyName, out assemblyVersion, out assemblyKey);

        if (String.IsNullOrEmpty(assemblyName))
        { 
            // The uri doesn't contain ";component". it should map to the enty application assembly.
            assembly = ResourceAssembly; 

            // The partName returned from GetAssemblyNameAndPart should be escaped.
            Debug.Assert(String.Compare(partName, uri.GetComponents(UriComponents.Path, UriFormat.UriEscaped), StringComparison.OrdinalIgnoreCase) == 0); 
        }
        else
        {
            assembly = GetLoadedAssembly(assemblyName, assemblyVersion, assemblyKey); 
        }
    } 


    // 
    //
//    [FriendAccessAllowed]
    /*internal*/ public static Assembly GetLoadedAssembly(String assemblyName, String assemblyVersion, String assemblyKey)
    { 
        Assembly assembly;
        AssemblyName asmName = new AssemblyName(assemblyName); 

        // We always use the primary assembly (culture neutral) for resource manager.
        // if the required resource lives in satellite assembly, ResourceManager can find 
        // the right satellite assembly later.
        asmName.CultureInfo = new CultureInfo(String.Empty);

        if (!String.IsNullOrEmpty(assemblyVersion)) 
        {
            asmName.Version = new Version(assemblyVersion); 
        } 

        if (!String.IsNullOrEmpty(assemblyKey)) 
        {
            int byteCount = assemblyKey.Length / 2;
            byte[] keyToken = new byte[byteCount];
            for (int i = 0; i < byteCount; i++) 
            {
                String byteString = assemblyKey.Substring(i * 2, 2); 
                keyToken[i] = byte.Parse(byteString, NumberStyles.HexNumber, CultureInfo.InvariantCulture); 
            }

            asmName.SetPublicKeyToken(keyToken);
        }

        assembly = SafeSecurityHelper.GetLoadedAssembly(asmName); 

        if (assembly == null) 
        { 
            // The assembly is not yet loaded to the AppDomain, try to load it with information specified in resource Uri.
            assembly = Assembly.Load(asmName); 
        }

        return assembly;
    } 

    // 
    // Return assembly Name, Version, Key and package Part from a relative Uri. 
    //
//    [FriendAccessAllowed] 
    /*internal*/ public static void GetAssemblyNameAndPart(Uri uri, out String partName, out String assemblyName, out String assemblyVersion, out String assemblyKey)
    {
        Invariant.Assert(uri != null && uri.IsAbsoluteUri == false, "This method accepts relative uri only.");

        String original = uri.ToString(); // only relative Uri here (enforced by Package)

        // Start and end points for the first segment in the Uri. 
        int start = 0;
        int end; 

        if (original[0] == '/')
        {
            start = 1; 
        }

        partName = original.Substring(start); 

        assemblyName = String.Empty; 
        assemblyVersion = String.Empty;
        assemblyKey = String.Empty;

        end = original.IndexOf('/', start); 

        String firstSegment = String.Empty; 
        boolean fHasComponent = false; 

        if (end > 0) 
        {
            // get the first section
            firstSegment = original.Substring(start, end - start);

            // The resource comes from dll
            if (firstSegment.EndsWith(COMPONENT, StringComparison.OrdinalIgnoreCase)) 
            { 
                partName = original.Substring(end + 1);
                fHasComponent = true; 
            }
        }

        if (fHasComponent) 
        {
            String[] assemblyInfo = firstSegment.Split(new char[] { COMPONENT_DELIMITER }); 

            int count = assemblyInfo.Length;

            if ((count > 4) || (count < 2))
            {
                throw new UriFormatException(SR.Get(SRID.WrongFirstSegment));
            } 

            // 
            // if the uri contains escaping character, 
            // Convert it back to normal unicode String
            // so that the String as assembly name can be 
            // recognized by Assembly.Load later.
            //
            assemblyName = Uri.UnescapeDataString(assemblyInfo[0]);

            for (int i = 1; i < count - 1; i++)
            { 
                if (assemblyInfo[i].StartsWith(VERSION, StringComparison.OrdinalIgnoreCase)) 
                {
                    if (String.IsNullOrEmpty(assemblyVersion)) 
                    {
                        assemblyVersion = assemblyInfo[i].Substring(1);  // Get rid of the leading "v"
                    }
                    else 
                    {
                        throw new UriFormatException(SR.Get(SRID.WrongFirstSegment)); 
                    } 
                }
                else 
                {
                    if (String.IsNullOrEmpty(assemblyKey))
                    {
                        assemblyKey = assemblyInfo[i]; 
                    }
                    else 
                    { 
                        throw new UriFormatException(SR.Get(SRID.WrongFirstSegment));
                    } 
                }
            } // end of for loop

        } // end of if fHasComponent 
    }

//    [FriendAccessAllowed] 
    static /*internal*/ public boolean IsComponentEntryAssembly(String component)
    { 
        if (component.EndsWith(COMPONENT, StringComparison.OrdinalIgnoreCase))
        {
            String[] assemblyInfo = component.Split(new Char[] { COMPONENT_DELIMITER });
            // Check whether the assembly name is the same as the EntryAssembly. 
            int count = assemblyInfo.Length;
            if ((count >= 2) && (count <= 4)) 
            { 
                String assemblyName = Uri.UnescapeDataString(assemblyInfo[0]);

                Assembly assembly = ResourceAssembly;

                if (assembly != null)
                { 
                    return (String.Compare(SafeSecurityHelper.GetAssemblyPartialName(assembly), assemblyName, StringComparison.OrdinalIgnoreCase) == 0);
                } 
                else 
                {
                    return false; 
                }
            }
        }
        return false; 
    }

//    [FriendAccessAllowed] 
    static /*internal*/ public Uri GetResolvedUri(Uri baseUri, Uri orgUri)
    { 
        return new Uri(baseUri, orgUri);
    }

//    [FriendAccessAllowed] 
    static /*internal*/ public Uri MakeRelativeToSiteOfOriginIfPossible(Uri sUri)
    { 
        if (Uri.Compare(sUri, SiteOfOriginBaseUri, UriComponents.Scheme, UriFormat.UriEscaped, StringComparison.OrdinalIgnoreCase) == 0) 
        {
            Uri packageUri; 
            Uri partUri;
            PackUriHelper.ValidateAndGetPackUriComponents(sUri, out packageUri, out partUri);

            if (String.Compare(packageUri.GetComponents(UriComponents.AbsoluteUri, UriFormat.UriEscaped), _packageSiteOfOriginBaseUriEscaped, StringComparison.OrdinalIgnoreCase) == 0) 
            {
                return (new Uri(sUri.GetComponents(UriComponents.SchemeAndServer, UriFormat.UriEscaped))).MakeRelativeUri(sUri); 
            } 
        }

        return sUri;
    }

//    [FriendAccessAllowed] 
    static /*internal*/ public Uri ConvertPackUriToAbsoluteExternallyVisibleUri(Uri packUri)
    { 
        Invariant.Assert(packUri.IsAbsoluteUri && SecurityHelper.AreStringTypesEqual(packUri.Scheme, PackAppBaseUri.Scheme)); 

        Uri relative = MakeRelativeToSiteOfOriginIfPossible(packUri); 

        if (! relative.IsAbsoluteUri)
        {
            return new Uri(SiteOfOriginContainer.SiteOfOrigin, relative); 
        }
        else 
        { 
           throw new InvalidOperationException(SR.Get(SRID.CannotNavigateToApplicationResourcesInWebBrowser, packUri));
        } 
    }

    // If a Uri is constructed with a legacy path such as c:\foo\bar then the Uri
    // Object will not correctly resolve relative Uris in some cases.  This method 
    // detects and fixes this by constructing a new Uri with an original String
    // that contains the scheme file://. 
//    [FriendAccessAllowed] 
    static /*internal*/ public Uri FixFileUri(Uri uri)
    { 
        if (uri != null && uri.IsAbsoluteUri && SecurityHelper.AreStringTypesEqual(uri.Scheme, Uri.UriSchemeFile) &&
            String.Compare(uri.OriginalString, 0, Uri.UriSchemeFile, 0, Uri.UriSchemeFile.Length, StringComparison.OrdinalIgnoreCase) != 0)
        {
            return new Uri(uri.AbsoluteUri); 
        }

        return uri; 
    }

    /// <SecurityNote>
    /// Critical: as it sets the baseUri
    /// </SecurityNote>
    static /*internal*/ public Uri BaseUri 
    {
//        [FriendAccessAllowed] 
        get 
        {
            return _baseUri.Value; 
        }
//        [FriendAccessAllowed]
        [SecurityCritical]
        set 
        {
            // This setter should only be called from Framework through 
            // BindUriHelper.set_BaseUri. 
            _baseUri.Value = value;
        } 
    }

    static /*internal*/ public Assembly ResourceAssembly
    { 
        get
        { 
            if (_resourceAssembly == null) 
            {
                _resourceAssembly = Assembly.GetEntryAssembly(); 
            }
            return _resourceAssembly;
        }
//        [FriendAccessAllowed] 
        set
        { 
            // This should only be called from Framework through Application.ResourceAssembly setter. 
            _resourceAssembly = value;
        } 
    }

//    #endregion /*internal*/ public properties and methods

//    #region private methods

    /// <summary> 
    /// Get BaseUri for a dependency Object inside a tree.
    /// 
    /// </summary>
    /// <param name="element">Dependency Object</param>
    /// <returns>BaseUri for the element</returns>
    /// <remarks> 
    ///     Callers must have FileIOPermission(FileIOPermissionAccess.PathDiscovery) for the given Uri to call this API.
    /// </remarks> 
    /// <SecurityNote> 
    /// Critical: as it access the BaseUri, which is critcal
    /// TreatAsSafe: since it demands File read write and path dicovery  permission. 
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe]
    /*internal*/ public static Uri GetBaseUriCore(DependencyObject element)
    { 
        Uri baseUri = null;
        DependencyObject doCurrent; 

        if (element == null)
        { 
            throw new ArgumentNullException("element");
        }

        try 
        {
            // 
            // Search the tree to find the closest parent which implements 
            // IUriContext or have set value for BaseUri property.
            // 
            doCurrent = element;

            while (doCurrent != null)
            { 
                // Try to get BaseUri property value from current node.
                baseUri = doCurrent.GetValue(BaseUriProperty) as Uri; 

                if (baseUri != null)
                { 
                    // Got the right node which is the closest to original element.
                    // Stop searching here.
                    break;
                } 

                IUriContext uriContext = doCurrent as IUriContext; 

                if (uriContext != null)
                { 
                    // If the element implements IUriContext, and if the BaseUri
                    // is not null, just take the BaseUri from there.
                    // and stop the search loop.
                    baseUri = uriContext.BaseUri; 

                    if (baseUri != null) 
                        break; 
                }

                //
                // The current node doesn't contain BaseUri value,
                // try its parent node in the tree.

                UIElement uie = doCurrent as UIElement;

                if (uie != null) 
                {
                    // Do the tree walk up 
                    doCurrent = uie.GetUIParent(true);
                }
                else
                { 
                    ContentElement ce = doCurrent as ContentElement;

                    if (ce != null) 
                    {
                        doCurrent = ce.Parent; 
                    }
                    else
                    {
                        Visual vis = doCurrent as Visual; 

                        if (vis != null) 
                        { 
                            // Try the Visual tree search
                            doCurrent = VisualTreeHelper.GetParent(vis); 
                        }
                        else
                        {
                            // Not a Visual. 
                            // Stop here for the tree searching to aviod an infinite loop.
                            break; 
                        } 
                    }
                } 
            }
        }
        finally
        { 
            //
            // Putting the permission demand in finally block can prevent from exposing a bogus 
            // and dangerous uri to the code in upper frame. 
            //
            if (baseUri != null) 
            {
                SecurityHelper.DemandUriDiscoveryPermission(baseUri);
            }
        } 

        return baseUri; 
    } 

//    #endregion 

    private final String COMPONENT = ";component";
    private final String VERSION = "v";
    private final char COMPONENT_DELIMITER = ';'; 

    private static Assembly _resourceAssembly; 
} 
 
