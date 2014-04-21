package org.summer.view.widget;
 public /*partial*/ class Uri implements ISerializable { 

        public static final String UriSchemeFile = UriParser.FileUri.SchemeName; 
        public static final String UriSchemeFtp = UriParser.FtpUri.SchemeName; 
        public static final String UriSchemeGopher = UriParser.GopherUri.SchemeName;
        public static final String UriSchemeHttp = UriParser.HttpUri.SchemeName; 
        public static final String UriSchemeHttps = UriParser.HttpsUri.SchemeName;
        /*internal*/ public static final String UriSchemeWs = UriParser.WsUri.SchemeName;
        /*internal*/ public static final String UriSchemeWss = UriParser.WssUri.SchemeName;
        public static final String UriSchemeMailto = UriParser.MailToUri.SchemeName; 
        public static final String UriSchemeNews = UriParser.NewsUri.SchemeName;
        public static final String UriSchemeNntp = UriParser.NntpUri.SchemeName; 
        public static final String UriSchemeNetTcp = UriParser.NetTcpUri.SchemeName; 
        public static final String UriSchemeNetPipe = UriParser.NetPipeUri.SchemeName;
        public static final String SchemeDelimiter = "://"; 


        private /*const*/ static final int c_Max16BitUtf8SequenceLength = 3+3+3+3; //each unicode byte takes 3 escaped chars
        /*internal*/ public /*const*/ static fi/*const*/ static finalnt c_MaxUriBufferSize = 0xFFF0; 
        private /*const*/ static final int c_MaxUriSchemeName = 1024;
 
        // untouched user String unless String has unicode chars and iriparsing is enabled 
        // or idn is on and we have unicode host or idn host
        // In that case, this String is normalized, stripped of bidi chars, and validated 
        // with char limits
        private String      m_String;

        // untouched user String if String has unicode with iri on or unicode/idn host with idn on 
        private String      m_originalUnicodeString;
 
        private UriParser m_Syntax;   // This is a whole Uri syntax, not only the scheme name 
        // temporarily stores dnssafe host when we have unicode/idn host and idn is on
        private String m_DnsSafeHost = null; 

//        [Flags]
        /*private*/ enum Flags //: ulong {
            Zero                ,//= 0x00000000, 

            SchemeNotCanonical     ,//= 0x1, 
            UserNotCanonical       ,//= 0x2, 
            HostNotCanonical       ,//= 0x4,
            PortNotCanonical       ,//= 0x8, 
            PathNotCanonical       ,//= 0x10,
            QueryNotCanonical      ,//= 0x20,
            FragmentNotCanonical   ,//= 0x40,
            CannotDisplayCanonical ,//= 0x7F, 

            E_UserNotCanonical      ,//= 0x80, 
            E_HostNotCanonical      ,//= 0x100, 
            E_PortNotCanonical      ,//= 0x200,
            E_PathNotCanonical      ,//= 0x400, 
            E_QueryNotCanonical     ,//= 0x800,
            E_FragmentNotCanonical  ,//= 0x1000,
            E_CannotDisplayCanonical ,//= 0x1F80,
 

            ShouldBeCompressed      ,//= 0x2000, 
            FirstSlashAbsent        ,//= 0x4000, 
            BackslashInPath         ,//= 0x8000,
 
            IndexMask           ,//= 0x0000FFFF,
            HostTypeMask        ,//= 0x00070000,
            HostNotParsed   ,//= 0x00000000,
            IPv6HostType    ,//= 0x00010000, 
            IPv4HostType    ,//= 0x00020000,
            DnsHostType     ,//= 0x00030000, 
//#if !PLATFORM_UNIX 
            UncHostType     ,//= 0x00040000,
//#endif // !PLATFORM_UNIX 
            BasicHostType   ,//= 0x00050000,
            UnusedHostType  ,//= 0x00060000,
            UnknownHostType ,//= 0x00070000,
 
            UserEscaped         ,//= 0x00080000,
            AuthorityFound      ,//= 0x00100000, 
            HasUserInfo         ,//= 0x00200000, 
            LoopbackHost        ,//= 0x00400000,
            NotDefaultPort      ,//= 0x00800000, 

            UserDrivenParsing   ,//= 0x01000000,
            CanonicalDnsHost    ,//= 0x02000000,
            ErrorOrParsingRecursion ,//= 0x04000000,   // Used to signal a default parser error and alsoe to confirm Port 
                                                    // and Host values in case of a custom user Parser
//#if !PLATFORM_UNIX 
            DosPath             ,//= 0x08000000, 
            UncPath             ,//= 0x10000000,
//#endif // !PLATFORM_UNIX 
            ImplicitFile        ,//= 0x20000000,
            MinimalUriInfoSet   ,//= 0x40000000,
            AllUriInfoSet       ,//= unchecked(0x80000000),
            IdnHost             ,//= 0x100000000, 
            HasUnicode          ,//= 0x200000000,
            HostUnicodeNormalized ,//= 0x400000000, 
            RestUnicodeNormalized ,//= 0x800000000, 
            UnicodeHost         ,//= 0x1000000000,
            IntranetUri         ,//= 0x2000000000, 
            UseOrigUncdStrOffset,//= 0x4000000000,
            // Is this component Iri canonical
            UserIriCanonical ,//=          0x8000000000,
            PathIriCanonical ,//=          0x10000000000, 
            QueryIriCanonical ,//=         0x20000000000,
            FragmentIriCanonical ,//=      0x40000000000, 
            IriCanonical ,//=              0x78000000000, 
        }
 
        private Flags       m_Flags;
        private UriInfo     m_Info;

        private class UriInfo { 
            public String   Host;
            public String   ScopeId;        //only IP v6 may need this 
            public String   String; 
            public Offset   Offset;
            public String   DnsSafeHost;    // stores dns safe host when idn is on and we have unicode or idn host 
            public MoreInfo MoreInfo;       // Multi-threading: This field must be always accessed through a _local_
                                            // stack copy of m_Info.
        };
 
//        [StructLayout(LayoutKind.Sequential, Pack=1)]
        private class Offset { 
            public short  Scheme; 
            public short  User;
            public short  Host; 
            public short  PortValue;
            public short  Path;
            public short  Query;
            public short  Fragment; 
            public short  End;
        }; 
 
        private class MoreInfo {
            public String   Path; 
            public String   Query;
            public String   Fragment;
            public String   AbsoluteUri;
            public int      Hash; 
            public String   RemoteUrl;
        }; 
 
        private boolean IsImplicitFile {
            get {return (m_Flags & Flags.ImplicitFile) != 0;} 
        }

        private boolean IsUncOrDosPath {
//#if !PLATFORM_UNIX 
//            get {return (m_Flags & (Flags.UncPath|Flags.DosPath)) != 0;}
//#else 
            get {return false;} 
//#endif // !PLATFORM_UNIX
        } 

        private boolean IsDosPath {
//#if !PLATFORM_UNIX
//            get {return (m_Flags & Flags.DosPath) != 0;} 
//#else
            get {return false;} 
//#endif // !PLATFORM_UNIX 
        }
 
        private boolean IsUncPath {
//#if !PLATFORM_UNIX
//            get {return (m_Flags & Flags.UncPath) != 0;}
//#else 
            get {return false;}
//#endif // !PLATFORM_UNIX 
        } 

        private Flags HostType { 
            get {return m_Flags & Flags.HostTypeMask;}
        }

        private UriParser Syntax { 
            get {
                return m_Syntax; 
            } 
        }
 
        private boolean IsNotAbsoluteUri {
            get {return (Object) m_Syntax == null;}
        }
 
        //
        // Checks if Iri parsing is allowed by the syntax & by config 
        // 
        private boolean m_iriParsing;
 
        //
        // Statically checks if Iri parsing is allowed by the syntax & by config
        //
        /*internal*/ public static boolean IriParsingStatic( UriParser syntax ) 
        {
            return (s_IriParsing && (((syntax != null) && syntax.InFact(UriSyntaxFlags.AllowIriParsing)) || 
                   (syntax == null))); 
        }
 
        //
        // Checks if Idn is allowed by the syntax & by config
        //
        private boolean AllowIdn 
        {
            get { return    ((m_Syntax != null) && ((m_Syntax.Flags & UriSyntaxFlags.AllowIdn) != 0) && 
                            ((s_IdnScope == UriIdnScope.All) || ((s_IdnScope == UriIdnScope.AllExceptIntranet) 
                                                                                && NotAny(Flags.IntranetUri)))); }
        } 

        //
        // Checks statically if Idn is allowed by the syntax & by config
        // 
        private boolean AllowIdnStatic(UriParser syntax, Flags flags)
        { 
            return ((syntax != null) && ((syntax.Flags & UriSyntaxFlags.AllowIdn) != 0) && 
                   ((s_IdnScope == UriIdnScope.All) || ((s_IdnScope == UriIdnScope.AllExceptIntranet)
                                                                            && StaticNotAny(flags, Flags.IntranetUri)))); 
        }

        //
        // check if the scheme + host are in intranet or not 
        // Used to determine of we apply idn or not
        // 
        private static volatile IInternetSecurityManager s_ManagerRef = null; 
        private static Object s_IntranetLock = new Object();
 
        private boolean IsIntranet(String schemeHost)
        {
            boolean error = false;
            int zone = -1; 
            int E_FAIL = unchecked((int)0x80004005);
 
            // MapUrlToZone call below fails on scheme length > 32 so we consider this 
            // not be be intranet
            // 
            if (m_Syntax.SchemeName.Length > 32)
                return false;

            if (s_ManagerRef == null){ 
                lock (s_IntranetLock){
                    if(s_ManagerRef == null) 
                    { 
//#if !FEATURE_PAL
                        // Go through CoCreateInstance as creating arbitary COM Object is no longer supported in AppX scenario 
                        Guid clsid = typeof(InternetSecurityManager).GUID;
                        Guid iid = typeof(IInternetSecurityManager).GUID;

                        Object managerRef; 
                        UnsafeNclNativeMethods.CoCreateInstance(
                            /*ref*/ clsid , 
                            IntPtr.Zero, 
                            UnsafeNclNativeMethods.CLSCTX_SERVER,
                            /*ref*/ iid, 
                            /*out*/ managerRef
                            );
                        s_ManagerRef = managerRef as IInternetSecurityManager;
//#else 
                        s_ManagerRef = (IInternetSecurityManager)new InternetSecurityManager();
//#endif // !FEATURE_PAL 
                    } 
                }
            } 

            try{
                s_ManagerRef.MapUrlToZone(schemeHost.TrimStart(_WSchars), /*out*/ zone, 0);
            } 
            catch (COMException ex){
                if (ex.ErrorCode == E_FAIL){    // E_FAIL 
                    error = true; 
                }
            } 
            // If s_ManagerRef was initilized on an STA thread then it cannot be accessed from other threads.
            // Visual Studio Unit Tests are the primary scenario for this.
            catch (InvalidComObjectException) {
                error = true; 
            }
 
            if(zone == (int) SecurityZone.Intranet) 
                return true;
 
            // Do dot check for intranet if zone is trusted or untrusted
            // since an intranet zone may be in these zones as well
            if ((zone == (int)SecurityZone.Trusted) ||
                (zone == (int)SecurityZone.Untrusted) || error) 
            {
                // do dot check 
                for (int i = 0; i < schemeHost.Length; ++i) 
                {
                    if (schemeHost[i] == '.') 
                        return false;
                }
                return true;
            } 
            return false;
        } 
 
        /*internal*/ public boolean UserDrivenParsing
        { 
            get {
                return (m_Flags & Flags.UserDrivenParsing) != 0;
            }
        } 
        private void SetUserDrivenParsing()
        { 
            // we use = here to clear all parsing flags for a uri that we think is invalid. 
            m_Flags = Flags.UserDrivenParsing | (m_Flags & Flags.UserEscaped);
        } 

        private short SecuredPathIndex {
            get {
                // This is one more trouble with a Dos Path. 
                // This property gets "safe" first path slash that is not the first if path = c:\
                if (IsDosPath) { 
                    char ch = m_String[m_Info.Offset.Path]; 
                    return (short)((ch == '/' || ch == '\\')? 3 :2);
                } 
                return (short)0;
            }
        }
 
        private boolean NotAny(Flags flags) {
            return (m_Flags & flags) == 0; 
        } 

        private boolean InFact(Flags flags) { 
            return (m_Flags & flags) != 0;
        }

        private static boolean StaticNotAny(Flags allFlags, Flags checkFlags) { 
            return (allFlags & checkFlags) == 0;
        } 
 
        private static boolean StaticInFact(Flags allFlags, Flags checkFlags) {
            return (allFlags & checkFlags) != 0; 
        }

        //
        // 
        private UriInfo EnsureUriInfo() {
            Flags cF = m_Flags; 
            if ((m_Flags & Flags.MinimalUriInfoSet) == 0) { 
                CreateUriInfo(cF);
            } 
            return m_Info;
        }
        //
        // 
        private void EnsureParseRemaining() {
            if ((m_Flags & Flags.AllUriInfoSet) == 0) { 
                ParseRemaining(); 
            }
        } 
        //
        //
        private void EnsureHostString(boolean allowDnsOptimization) {
            EnsureUriInfo(); 
            if ((Object)m_Info.Host == null) {
                if (allowDnsOptimization && InFact(Flags.CanonicalDnsHost)) { 
                    /* Optimization for a canonical DNS name 
                    *  ATTN: the host String won't be created,
                    *  Hence ALL m_Info.Host callers first call EnsureHostString(false) 
                    *  For example IsLoopBack property is one of such callers.
                    */
                    return;
                } 
                CreateHostString();
            } 
        } 

        // 
        // Uri(String)
        //
        //  We expect to create a Uri from a display name - e.g. that was typed by
        //  a user, or that was copied & pasted from a document. That is, we do not 
        //  expect already encoded URI to be supplied.
        // 
        public Uri(String uriString){ 
            if ((Object)uriString == null)
                throw new ArgumentNullException("uriString"); 

            CreateThis(uriString, false, UriKind.Absolute);
        }
 

        // 
        // Uri(String, boolean) 
        //
        //  Uri constructor. Assumes that input String is canonically escaped 
        //
//        [Obsolete("The constructor has been deprecated. Please use new Uri(String). The dontEscape parameter is deprecated and is always false. http://go.microsoft.com/fwlink/?linkid=14202")]
        public Uri(String uriString, boolean dontEscape) {
            if ((Object)uriString == null) 
                throw new ArgumentNullException("uriString");
 
            CreateThis(uriString, dontEscape, UriKind.Absolute); 
        }
 
        //
        // Uri(Uri, String, boolean)
        //
        //  Uri combinatorial constructor. Do not perform character escaping if 
        //  DontEscape is true
        // 
//        [Obsolete("The constructor has been deprecated. Please new Uri(Uri, String). The dontEscape parameter is deprecated and is always false. http://go.microsoft.com/fwlink/?linkid=14202")] 
        public Uri(Uri baseUri, String relativeUri, boolean dontEscape){
            if ((Object)baseUri == null) 
                throw new ArgumentNullException("baseUri");

            if (!baseUri.IsAbsoluteUri)
                throw new ArgumentOutOfRangeException("baseUri"); 

            CreateUri(baseUri, relativeUri, dontEscape); 
        } 

        // 
        // Uri(String, UriKind);
        //
        public Uri(String uriString, UriKind uriKind)
        { 
            if ((Object)uriString == null)
                throw new ArgumentNullException("uriString"); 
 
            CreateThis(uriString, false, uriKind);
        } 


        //
        // Uri(Uri, String) 
        //
        //  Construct a new Uri from a base and relative URI. The relative URI may 
        //  also be an absolute URI, in which case the resultant URI is constructed 
        //  entirely from it
        // 
        public Uri(Uri baseUri, String relativeUri){
            if ((Object)baseUri == null)
                throw new ArgumentNullException("baseUri");
 
            if (!baseUri.IsAbsoluteUri)
                throw new ArgumentOutOfRangeException("baseUri"); 
 
            CreateUri(baseUri, relativeUri, false);
        } 

        private void CreateUri(Uri baseUri, String relativeUri, boolean dontEscape)
        {
            // Parse relativeUri and populate Uri /*internal*/ public data. 
            CreateThis(relativeUri, dontEscape, UriKind.RelativeOrAbsolute);
 
            UriFormatException e; 
            if (baseUri.Syntax.IsSimple)
            { 
                // Resolve Uris if possible OR get merged Uri String to re-parse below
                Uri uriResult = ResolveHelper(baseUri, this, /*ref*/ relativeUri, /*ref*/ dontEscape, /*out*/ e);

                if (e != null) 
                    throw e;
 
                // If resolved into a Uri then we build from that Uri 
                if (uriResult != null)
                { 
                    if ((Object)uriResult != (Object)this)
                        CreateThisFromUri(uriResult);

                    return; 
                }
            } 
            else 
            {
                dontEscape = false; 
                relativeUri = baseUri.Syntax.InternalResolve(baseUri, this, /*out*/ e);
                if (e != null)
                    throw e;
            } 

            m_Flags = Flags.Zero; 
            m_Info = null; 
            m_Syntax = null;
            // If not resolved, we reparse modified Uri String and populate Uri /*internal*/ public data. 
            CreateThis(relativeUri, dontEscape, UriKind.Absolute);
        }

        // 
        // Uri(Uri , Uri )
        // Note: a static Create() method should be used by users, not this .ctor 
        // 
        public Uri(Uri baseUri, Uri relativeUri)
        { 
            if ((Object)baseUri == null)
                throw new ArgumentNullException("baseUri");

            if (!baseUri.IsAbsoluteUri) 
                throw new ArgumentOutOfRangeException("baseUri");
 
            CreateThisFromUri(relativeUri); 

            String newUriString = null; 
            UriFormatException e;
            boolean dontEscape;

            if (baseUri.Syntax.IsSimple) 
            {
                dontEscape = InFact(Flags.UserEscaped); 
                relativeUri = ResolveHelper(baseUri, this, /*ref*/ newUriString, /*ref*/ dontEscape, /*out*/ e); 

                if (e != null) 
                    throw e;

                if (relativeUri != null)
                { 
                    if ((Object)relativeUri != (Object)this)
                        CreateThisFromUri(relativeUri); 
 
                    return;
                } 
            }
            else
            {
                dontEscape = false; 
                newUriString = baseUri.Syntax.InternalResolve(baseUri, this, /*out*/ e);
                if (e != null) 
                    throw e; 
            }
 
            m_Flags = Flags.Zero;
            m_Info = null;
            m_Syntax = null;
            CreateThis(newUriString, dontEscape, UriKind.Absolute); 
        }
 
        // 
        // This method is shared by base+relative Uris constructors and is only called from them.
        // The assumptions: 
        //  - baseUri is a valid absolute Uri
        //  - relative part is not null and not empty
        private /*unsafe*/ static ParsingError GetCombinedString(Uri baseUri, String relativeStr,
            boolean dontEscape, /*ref*/ String result) 
        {
            // NB: This is not RFC2396 compliant although it is inline with w3c.org recommendations 
            // This parser will allow the relativeStr to be an absolute Uri with the different scheme 
            // In fact this is strict violation of RFC2396
            // 
            for (int i=0; i < relativeStr.Length; ++i)
            {
                if (relativeStr[i] == '/' || relativeStr[i] == '\\' || relativeStr[i] == '?' || relativeStr[i] == '#')
                { 
                    break;
                } 
                else if (relativeStr[i] == ':') 
                {
                    if (i < 2) 
                    {
                        // Note we don't support one-letter Uri schemes.
                        // Hence anything like x:sdsd is a relative path and be added to the baseUri Path
                        break; 
                    }
                    String scheme =  relativeStr.Substring(0, i); 
                    fixed (char* sptr = scheme) { 
                        UriParser syntax = null;
                        if (CheckSchemeSyntax(sptr, (short) scheme.Length, /*ref*/ syntax) == ParsingError.None) { 
                            if (baseUri.Syntax == syntax) {
                                //Remove the scheme for backward Uri parsers compatibility
                                if (i+1 < relativeStr.Length) {
                                    relativeStr = relativeStr.Substring(i+1); 
                                }
                                else { 
                                    relativeStr = String.Empty; 
                                }
                            } 
                            else {
                                // This is the place where we switch the scheme.
                                // Return relative part as the result Uri.
                                result = relativeStr; 
                                return ParsingError.None;
                            } 
                        } 
                    }
                    break; 
                }
            }

            if (relativeStr.Length == 0) { 
                result = baseUri.OriginalString;
                return ParsingError.None; 
            } 

            result = CombineUri(baseUri, relativeStr, dontEscape? UriFormat.UriEscaped: UriFormat.SafeUnescaped); 
            return ParsingError.None;
        }
        //
        private static UriFormatException GetException(ParsingError err) 
        {
            switch (err) 
            { 
                case ParsingError.None:
                    return null; 
                // Could be OK for Relative Uri
                case ParsingError.BadFormat:
                    return new UriFormatException(SR.GetString(SR.net_uri_BadFormat));
                case ParsingError.BadScheme: 
                    return new UriFormatException(SR.GetString(SR.net_uri_BadScheme));
                case ParsingError.BadAuthority: 
                    return new UriFormatException(SR.GetString(SR.net_uri_BadAuthority)); 
                case ParsingError.EmptyUriString:
                    return new UriFormatException(SR.GetString(SR.net_uri_EmptyUri)); 
                // Fatal
                case ParsingError.SchemeLimit:
                    return new UriFormatException(SR.GetString(SR.net_uri_SchemeLimit));
                case ParsingError.SizeLimit: 
                    return new UriFormatException(SR.GetString(SR.net_uri_SizeLimit));
                case ParsingError.MustRootedPath: 
                    return new UriFormatException(SR.GetString(SR.net_uri_MustRootedPath)); 
                // Derived class controllable
                case ParsingError.BadHostName: 
                    return new UriFormatException(SR.GetString(SR.net_uri_BadHostName));
                case ParsingError.NonEmptyHost: //unix-only
                    return new UriFormatException(SR.GetString(SR.net_uri_BadFormat));
                case ParsingError.BadPort: 
                    return new UriFormatException(SR.GetString(SR.net_uri_BadPort));
                case ParsingError.BadAuthorityTerminator: 
                    return new UriFormatException(SR.GetString(SR.net_uri_BadAuthorityTerminator)); 
                case ParsingError.CannotCreateRelative:
                    return new UriFormatException(SR.GetString(SR.net_uri_CannotCreateRelative)); 
                default:
                    break;
            }
            return new UriFormatException(SR.GetString(SR.net_uri_BadFormat)); 
        }
 
//        #region !Silverlight 

        // 
        // ISerializable constructor
        //
        protected Uri(SerializationInfo serializationInfo, StreamingContext streamingContext)
        { 
            String uriString = serializationInfo.GetString("AbsoluteUri");
 
            if (uriString.Length != 0) 
            {
                CreateThis(uriString, false, UriKind.Absolute); 
                return;
            }

            uriString = serializationInfo.GetString("RelativeUri"); 
            if ((Object)uriString == null)
                throw new ArgumentNullException("uriString"); 
 
            CreateThis(uriString, false, UriKind.Relative);
        } 

        //
        // ISerializable method
        // 
        /// <internalonly/>
//        [SuppressMessage("Microsoft.Security", "CA2123:OverrideLinkDemandsShouldBeIdenticalToBase", Justification = "System.dll is still using pre-v4 security model and needs this demand")] 
//        [SecurityPermission(SecurityAction.LinkDemand, SerializationFormatter=true)] 
        void ISerializable.GetObjectData(SerializationInfo serializationInfo, StreamingContext streamingContext)
        { 
            GetObjectData(serializationInfo, streamingContext);
        }

        // 
        // FxCop: provide some way for derived classes to access GetObjectData even if the derived class
        // explicitly re-inherits ISerializable. 
        // 
//        [SecurityPermission(SecurityAction.LinkDemand, SerializationFormatter=true)]
        protected void GetObjectData(SerializationInfo serializationInfo, StreamingContext streamingContext) 
        {

            if (IsAbsoluteUri)
                serializationInfo.AddValue("AbsoluteUri", GetParts(UriComponents.SerializationInfoString, UriFormat.UriEscaped)); 
            else
            { 
                serializationInfo.AddValue("AbsoluteUri", String.Empty); 
                serializationInfo.AddValue("RelativeUri", GetParts(UriComponents.SerializationInfoString, UriFormat.UriEscaped));
            } 
        }

//        #endregion !Silverlight
 
        //
        // 
        // 
        public String AbsolutePath {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                }
 
                String path = PrivateAbsolutePath;
                // 
                // 

 
                if (IsDosPath && path[0] == '/') {
                    path =  path.Substring(1);
                }
                return path; 
            }
        } 
        // 
        private String PrivateAbsolutePath {
            get { 
                UriInfo info = EnsureUriInfo();
                if ((Object) info.MoreInfo == null) {
                    info.MoreInfo = new MoreInfo();
                } 
                String result = info.MoreInfo.Path;
                if ((Object) result == null) { 
                    result = GetParts(UriComponents.Path | UriComponents.KeepDelimiter, UriFormat.UriEscaped); 
                    info.MoreInfo.Path = result;
                } 
                return result;
            }
        }
 
        //
        // 
        // 
        public String AbsoluteUri {
            get { 
                if (m_Syntax == null){
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                }
 
                UriInfo info = EnsureUriInfo();
                if ((Object) info.MoreInfo == null) { 
                    info.MoreInfo = new MoreInfo(); 
                }
                String result = info.MoreInfo.AbsoluteUri; 
                if ((Object) result == null) {
                    result = GetParts(UriComponents.AbsoluteUri, UriFormat.UriEscaped);
                    info.MoreInfo.AbsoluteUri = result;
                } 
                return result;
            } 
        } 

        // 
        // LocalPath
        //
        //  Returns a 'local' version of the path. This is mainly for file: URI
        //  such that DOS and UNC paths are returned with '/' converted back to 
        //  '\', and any escape sequences converted
        // 
        //  The form of the returned path is in NOT Escaped 
        //
        public String LocalPath { 
            get {
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                } 
                return GetLocalPath();
            } 
        } 

//        #region !Silverlight 
        //
        //
        // The result is of the form "hostname[:port]" Port is omitted if default
        // 
        public String Authority {
            get { 
                if (IsNotAbsoluteUri) { 
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                } 

                //
                return GetParts(UriComponents.Host | UriComponents.Port, UriFormat.UriEscaped);
            } 
        }
        // 
        // 
        public UriHostNameType HostNameType {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                }
 
                if (m_Syntax.IsSimple)
                    EnsureUriInfo(); 
                else 
                {
                    // For a custom parser we request HostString creation to confirm HostType 
                    EnsureHostString(false);
                }

                switch (HostType) { 
                    case Flags.DnsHostType:   return UriHostNameType.Dns;
                    case Flags.IPv4HostType:  return UriHostNameType.IPv4; 
                    case Flags.IPv6HostType:  return UriHostNameType.IPv6; 
                    case Flags.BasicHostType: return UriHostNameType.Basic;
//#if !PLATFORM_UNIX 
//                    case Flags.UncHostType:   return UriHostNameType.Basic; //return (UriHostNameType)(UriHostNameType.Basic+10);
//#endif // !PLATFORM_UNIX
                    case Flags.UnknownHostType: return UriHostNameType.Unknown;
                    default: 
                        break;
                } 
                return UriHostNameType.Unknown; 
            }
        } 
        //
        //
        public boolean IsDefaultPort {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
                } 
                if (m_Syntax.IsSimple)
                    EnsureUriInfo(); 
                else
                {
                    // For a custom parser we request HostString creation that will aso set the port
                    EnsureHostString(false); 
                }
 
                return NotAny(Flags.NotDefaultPort); 
            }
        } 
        //
        //
        public boolean IsFile {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
                } 

                return (Object)m_Syntax.SchemeName == (Object)UriSchemeFile; 
            }
        }
        //
        // 
        public boolean IsLoopback {
            get { 
                if (IsNotAbsoluteUri) { 
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                } 

                EnsureHostString(false);

                return InFact(Flags.LoopbackHost); 
            }
        } 
 
        //
        // 
        //  Gets the escaped Uri.AbsolutePath and Uri.Query
        //  properties separated by a "?" character.
        public String PathAndQuery {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
                } 

                String result = GetParts(UriComponents.PathAndQuery, UriFormat.UriEscaped); 
                //
                //

 
                if (IsDosPath && result[0] == '/') {
                    result = result.Substring(1); 
                } 
                return result;
            } 
        }

        //
        // 
        //  Gets an array of the segments that make up a URI.
        public String[] Segments { 
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
                }

                String[] segments = null; // used to be a class cached result
                if (segments == null) { 

                    String path = PrivateAbsolutePath; 
 
                    if (path.Length == 0) {
                        segments = new String[0]; 
                    }
                    else {
                        System.Collections.ArrayList pathSegments = new System.Collections.ArrayList();
                        int current = 0; 
                        while (current < path.Length) {
                            int next = path.IndexOf('/', current); 
                            if (next == -1) { 
                                next = path.Length - 1;
                            } 
                            pathSegments.Add(path.Substring(current, (next - current) + 1));
                            current = next + 1;
                        }
                        segments = (String[])(pathSegments.ToArray(typeof(String))); 
                    }
                } 
                return segments; 
            }
        } 

//        #endregion !Silverlight

        // 
        //
        public boolean IsUnc { 
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
                }
                return IsUncPath;
            }
        } 

        // 
        // Gets a hostname part (special formatting for IPv6 form) 
        public String Host {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                }
 
                return GetParts(UriComponents.Host, UriFormat.UriEscaped);
            } 
        } 

        private static boolean StaticIsFile(UriParser syntax) 
        {
            return syntax.InFact(UriSyntaxFlags.FileLikeUri);
        }
 
        private static volatile boolean s_ConfigInitialized; // Have the config values been initalized from config file
        private static volatile boolean s_ConfigInitializing; // used for recursion detection while init. config values 
 
        // Value from config Uri section
        // The use of this IDN mechanic is discouraged on Win8+ due to native platform improvements. 
        private static volatile UriIdnScope s_IdnScope = IdnElement.EnabledDefaultValue;

        // Value from config Uri section
        // On by default in .NET 4.5+ and cannot be disabled by config. 
        private static volatile boolean s_IriParsing =
            (UriParser.ShouldUseLegacyV2Quirks ? IriParsingElement.EnabledDefaultValue : true); 
 
        private static Object s_initLock;
 
        private static Object InitializeLock {
            get {
                if (s_initLock == null) {
                    Object o = new Object(); 
                    Interlocked.CompareExchange(/*ref*/ s_initLock, o, null);
                } 
                return s_initLock; 
            }
        } 

        //
        // Reads values from config uri section
        // 
        // This method is called if:
        // - a Uri is constructed, we parse the String and we find '%', >127 chars, or 'xn--' 
        // - we parse the host and figure /*out*/ if it is an IPv6 address 
        private static void InitializeUriConfig()
        { 
            if (!s_ConfigInitialized) {
                lock(InitializeLock) {
                    if (!s_ConfigInitialized && !s_ConfigInitializing) {
 
                        // setting s_ConfigInitializing to true makes sure, that in web scenarios,
                        // where Uri instances may be created while parsing the web.config files, will not 
                        // call into this code block again. We'll enter the following code only once per 
                        // AppDomain.
                        s_ConfigInitializing = true; 
                        UriSectionInternal section = UriSectionInternal.GetSection();

                        if (section != null) {
                            s_IdnScope = section.IdnScope; 
                            // Iri can no longer be altered by the config, it is always on.
                            if (UriParser.ShouldUseLegacyV2Quirks) { 
                                s_IriParsing = section.IriParsing; 
                            }
 
                            SetEscapedDotSlashSettings(section, "http");
                            SetEscapedDotSlashSettings(section, "https");
                            SetEscapedDotSlashSettings(section, Uri.UriSchemeWs);
                            SetEscapedDotSlashSettings(section, Uri.UriSchemeWss); 
                        }
 
                        s_ConfigInitialized = true; 
                        s_ConfigInitializing = false;
                    } 
                }
            }
        }
 
        // Legacy - This no longer has any affect in .NET 4.5 (non-quirks). See UriParser.HttpSyntaxFlags.
        private static void SetEscapedDotSlashSettings(UriSectionInternal uriSection, String scheme) 
        { 
            // Currently we only support setting DontUnescapePathDotsAndSlashes for HTTP and HTTPS schemes.
            // We ignore all other values. We won't throw for two reasons: 
            // - backward compatibility: Uri didn't throw so far.
            // - the config section gets only read if we actually find e.g. a %-character in the Uri. If not, this
            //   code never gets executed, resulting in a weird behavior for the customer: If one application run
            //   doesn't use Uris with %-characters, it doesn't throw, if another run uses %-characters it throws. 
            //   => If we want to throw we have to rethink the current implementation.
            SchemeSettingInternal schemeSetting = uriSection.GetSchemeSetting(scheme); 
            if (schemeSetting != null) { 
                // We check for equality, not if Options contains DontUnescapePathDotsAndSlashes:
                // Currently we only support this flag. If more than this flag are set, then it is an invalid 
                // setting and we ignore it.
                if (schemeSetting.Options == GenericUriParserOptions.DontUnescapePathDotsAndSlashes) {
                    UriParser parser = UriParser.GetSyntax(scheme);
                    parser.SetUpdatableFlags(UriSyntaxFlags.None); 
                }
            } 
        } 

        private String GetLocalPath(){ 
            EnsureParseRemaining();

            //Other cases will get a Unix-style path
            if (IsUncOrDosPath) 
            {
                EnsureHostString(false); 
                int start; 

                // Do we have a valid local path right in m_string? 
                if (NotAny(Flags.HostNotCanonical|Flags.PathNotCanonical|Flags.ShouldBeCompressed)) {

                    start = IsUncPath? m_Info.Offset.Host-2 :m_Info.Offset.Path;
 
                    String str = (IsImplicitFile && m_Info.Offset.Host == (IsDosPath ? 0 : 2) &&
                        m_Info.Offset.Query == m_Info.Offset.End) 
                            ? m_String 
                            : (IsDosPath && (m_String[start] == '/' || m_String[start] == '\\'))
                                ? m_String.Substring(start + 1, m_Info.Offset.Query - start - 1) 
                                : m_String.Substring(start, m_Info.Offset.Query - start);

                    // Should be a rare case, convert c|\ into c:\
                    if (IsDosPath && str[1] == '|') { 
                        // Sadly, today there is no method for replacong just one occurrence
                        str = str.Remove(1, 1); 
                        str = str.Insert(1, ":"); 
                    }
 
                    // check for all back slashes (though may be String.Replace is smart?)
                    for (int i = 0; i < str.Length; ++i) {
                        if (str[i] == '/') {
                            str = str.Replace('/', '\\'); 
                            break;
                        } 
                    } 

                    return str; 
                }

                // Not everything went well, trying harder
 
                char[] result;
                int count = 0; 
                start = m_Info.Offset.Path; 

                String host = m_Info.Host; 
                result = new char [host.Length + 3 + m_Info.Offset.Fragment - m_Info.Offset.Path ];

                if (IsUncPath)
                { 
                    result[0] = '\\';
                    result[1] = '\\'; 
                    count = 2; 

                    UriHelper.UnescapeString(host, 0, host.Length, result, /*ref*/ count, c_DummyChar, c_DummyChar, 
                        c_DummyChar, UnescapeMode.CopyOnly, m_Syntax, false);

                }
                else { 
                    // Dos path
                    if(m_String[start] == '/' ||  m_String[start] == '\\') { 
                        // Skip leading slash for a DOS path 
                        ++start;
                    } 
                }


                short pathStart = (short)count; //save for optional Compress() call 

                UnescapeMode mode = (InFact(org.summer.view.widget.documents.PathNotCanonical) && !IsImplicitFile) 
                    ? (UnescapeMode.Unescape | UnescapeMode.UnescapeAll): UnescapeMode.CopyOnly; 
                UriHelper.UnescapeString(m_String, start, m_Info.Offset.Query, result, /*ref*/ count, c_DummyChar,
                    c_DummyChar, c_DummyChar, mode, m_Syntax, true); 

                // Possibly convert c|\ into c:\
                if (result[1] == '|')
                    result[1] = ':'; 

                if (InFact(Flags.ShouldBeCompressed)) { 
                    // suspecting not compressed path 
                    // For a dos path we won't compress the "x:" part if found /../ sequences
                    result = Compress(result, (short)(IsDosPath? pathStart + 2: pathStart), /*ref*/ count, m_Syntax); 
                }

                // We don't know whether all slashes were the back ones
                // Plus going through Compress will turn them into / anyway 
                // Converting / back into \
                for (short i = 0; i < (short) count; ++i) { 
                    if (result[i] == '/') { 
                        result[i] = '\\';
                    } 
                }

                return new String(result, 0, count);
 
            }
            else { 
                // Return unescaped canonical path 
                // Note we cannot call GetParts here because it has circular dependancy on GelLocalPath method
                return GetUnescapedParts(UriComponents.Path | UriComponents.KeepDelimiter, UriFormat.Unescaped); 
            }
        }

        // 
        //
        // 
        // 
        public int Port {
            get { 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                }
 
                if (m_Syntax.IsSimple)
                    EnsureUriInfo(); 
                else 
                {
                    // For a custom parser we request HostString creation that will aso set the port 
                    EnsureHostString(false);
                }

                if (InFact(Flags.NotDefaultPort)) { 
                    return (int)m_Info.Offset.PortValue;
                } 
                return m_Syntax.DefaultPort; 
            }
        } 
        //
        //
        //
        //  Gets the escaped query. 
        public String Query {
            get { 
                if (IsNotAbsoluteUri) { 
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                } 

                UriInfo info = EnsureUriInfo();
                if ((Object)info.MoreInfo == null) {
                    info.MoreInfo = new MoreInfo(); 
                }
                String result = info.MoreInfo.Query; 
                if ((Object)result == null) { 
                    result = GetParts(UriComponents.Query | UriComponents.KeepDelimiter, UriFormat.UriEscaped);
                    info.MoreInfo.Query = result; 
                }
                return result;
            }
        } 
        //
        // 
        // 
        //    Gets the escaped fragment.
        public String Fragment { 
            get {
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                } 

                UriInfo info = EnsureUriInfo(); 
                if ((Object)info.MoreInfo == null) { 
                    info.MoreInfo = new MoreInfo();
                } 
                String result = info.MoreInfo.Fragment;
                if ((Object)result == null) {
                    result = GetParts(UriComponents.Fragment | UriComponents.KeepDelimiter, UriFormat.UriEscaped);
                    info.MoreInfo.Fragment = result; 
                }
                return result; 
            } 
        }
 
        //
        //  Gets the Scheme String of this Uri
        //
        // 
        public String Scheme {
            get { 
                if (IsNotAbsoluteUri) { 
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                } 

                return m_Syntax.SchemeName;
            }
        } 

        // 
        //  Was the original String switched from m_String to m_OriginalUnicodeString 
        //  Will happen when Iri is turned on and we have unicode chars or of idn is
        //  is on and we have an idn or unicode host. 
        //
        private boolean OriginalStringSwitched
        {
            get{return ((m_iriParsing && InFact(Flags.HasUnicode)) || 
                        (AllowIdn && (InFact(Flags.IdnHost) || InFact(Flags.UnicodeHost))));}
        } 
        // 
        //    Gets the exact String passed by a user.
        public String OriginalString { 
            get {
                return OriginalStringSwitched ? m_originalUnicodeString : m_String;
            }
        } 

        // 
        //    Gets the host String that is unescaped and if it's Ipv6 host, 
        //    then the returned String is suitable for DNS lookup.
        // 
        //    For Ipv6 this will strip [] and add ScopeId if was found in the original String
        public String DnsSafeHost {
            get {
 
                if (IsNotAbsoluteUri) {
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
                } 

                if (AllowIdn && (((m_Flags & Flags.IdnHost) != 0) || ((m_Flags & Flags.UnicodeHost) != 0))){ 
                    // return pre generated idn
                    EnsureUriInfo();
                    return m_Info.DnsSafeHost;
                } 

                EnsureHostString(false); 
 
                if (!String.IsNullOrEmpty(m_Info.DnsSafeHost)) {
                    // Cached 
                    return m_Info.DnsSafeHost;
                } else if (m_Info.Host.Length == 0) {
                    // Empty host, no possible processing
                    return String.Empty; 
                }
 
                // Special case, will include ScopeID and strip [] around IPv6 
                // This will also unescape the host String
                String ret = m_Info.Host; 

                if (HostType == Flags.IPv6HostType) {
                    ret = ret.Substring(1, ret.Length - 2);
                    if ((Object)m_Info.ScopeId != null) { 
                        ret += m_Info.ScopeId;
                    } 
                } 
                // Validate that this basic host qualifies as Dns safe,
                // It has looser parsing rules that might allow otherwise. 
                // It might be a registry-based host from RFC 2396 Section 3.2.1
                else if (HostType == Flags.BasicHostType
                    && InFact(Flags.HostNotCanonical | Flags.E_HostNotCanonical)) {
                    // Unescape everything 
                    char[] dest = new char[ret.Length];
                    int count = 0; 
                    UriHelper.UnescapeString(ret, 0, ret.Length, dest, /*ref*/ count, c_DummyChar, c_DummyChar, 
                        c_DummyChar, UnescapeMode.Unescape | UnescapeMode.UnescapeAll, m_Syntax, false);
                    ret = new String(dest, 0, count); 
                }

                m_Info.DnsSafeHost = ret;
 
                return ret;
            } 
        } 

        // The same as DnsSafeHost, except that it always returns the punycode form regardless of the app.config. 
        /*internal*/ public String IdnHost {
            get {
                String host = m_Info.DnsSafeHost;
 
                if (HostType == Flags.DnsHostType) {
                    host = DomainNameHelper.IdnEquivalent(host); 
                } 

                return host; 
            }
        }

        // 
        //  Returns false if the String passed in the constructor cannot be parsed as
        //  valid AbsoluteUri. This could be a relative Uri instead. 
        // 
        public boolean IsAbsoluteUri {
            get { 
                return m_Syntax != null;
            }
        }
        // 
        //
        //  Returns 'true' if the 'dontEscape' parameter was set to 'true ' when the Uri instance was created. 
        public boolean UserEscaped { 
            get {
                return InFact(Flags.UserEscaped); 
            }
        }
        //
        // 
        //  Gets the user name, password, and other user specific information associated
        //  with the Uniform Resource Identifier (URI). 
        public String UserInfo { 
            get {
                if (IsNotAbsoluteUri) { 
                    throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
                }

                return GetParts(UriComponents.UserInfo, UriFormat.UriEscaped); 
            }
        } 
 
//        #region !Silverlight
 
        //
        // CheckHostName
        //
        //  Determines whether a host name authority is a valid Host name according 
        //  to DNS naming rules
        // 
        // Returns: 
        //  true if <name> is valid else false
        // 
        // Throws:
        //  Nothing
        //
        public static UriHostNameType CheckHostName(String name) { 

            if ((Object)name == null || name.Length == 0 || name.Length > short.MaxValue) { 
                return UriHostNameType.Unknown; 
            }
            int end = name.Length; 
            /*unsafe*/
                fixed (char* fixedName = name) {

                    if (name[0] == '[' && name[name.Length-1] == ']') { 
                        // we require that _entire_ name is recognized as ipv6 address
                        if (IPv6AddressHelper.IsValid(fixedName, 1, /*ref*/ end) && end == name.Length) { 
                            return UriHostNameType.IPv6; 
                        }
                    } 
                    end = name.Length;
                    if (IPv4AddressHelper.IsValid(fixedName, 0 , /*ref*/ end, false, false) && end == name.Length) {
                        return UriHostNameType.IPv4;
                    } 
                    end = name.Length;
                    boolean dummyBool = false; 
                    if (DomainNameHelper.IsValid(fixedName, 0, /*ref*/ end, /*ref*/ dummyBool, false) && end == name.Length) { 
                        return UriHostNameType.Dns;
                    } 

                    end = name.Length;
                    dummyBool = false;
                    if (DomainNameHelper.IsValidByIri(fixedName, 0, /*ref*/ end, /*ref*/ dummyBool, false) 
                        && end == name.Length) {
                        return UriHostNameType.Dns; 
                    } 
                }
 
                //This checks the form without []
                end = name.Length+2;
                // we require that _entire_ name is recognized as ipv6 address
                name = "["+name+"]"; 
                fixed (char* newFixedName = name) {
                    if (IPv6AddressHelper.IsValid(newFixedName, 1, /*ref*/ end) && end == name.Length) { 
                        return UriHostNameType.IPv6; 
                    }
                } 
            }
            return UriHostNameType.Unknown;
        }
 
        //
        // GetLeftPart 
        // 
        //  Returns part of the URI based on the parameters:
        // 
        // Inputs:
        //  <argument>  part
        //      Which part of the URI to return
        // 
        // Returns:
        //  The requested substring 
        // 
        // Throws:
        //  UriFormatException if URI type doesn't have host-port or authority parts 
        //
        public String GetLeftPart(UriPartial part) {
            if (IsNotAbsoluteUri) {
                throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute)); 
            }
 
            EnsureUriInfo(); 
            /*const*/ static final UriComponents NonPathPart = (UriComponents.Scheme | UriComponents.UserInfo | UriComponents.Host | UriComponents.Port);
 
            switch (part) {
                case UriPartial.Scheme:

                    return GetParts(UriComponents.Scheme | UriComponents.KeepDelimiter, UriFormat.UriEscaped); 

                case UriPartial.Authority: 
 
                    if (NotAny(Flags.AuthorityFound) || IsDosPath) {
 
                        //


 
                        // From V1.0 comments:
 
                        // anything that didn't have "//" after the scheme name 
                        // (mailto: and news: e.g.) doesn't have an authority
                        // 

                        return String.Empty;
                    }
                    return GetParts(NonPathPart, UriFormat.UriEscaped); 

                case UriPartial.Path: 
                    return GetParts(NonPathPart | UriComponents.Path, UriFormat.UriEscaped); 

                case UriPartial.Query: 
                    return GetParts(NonPathPart | UriComponents.Path | UriComponents.Query, UriFormat.UriEscaped);

            }
            throw new ArgumentException("part"); 
        }
 
        // 
        //
        /// Transforms a character into its hexadecimal representation. 
        public static String HexEscape(char character) {
            if (character > '\xff') {
                throw new ArgumentOutOfRangeException("character");
            } 
            char[] chars = new char[3];
            int pos = 0; 
            UriHelper.EscapeAsciiChar(character, chars, /*ref*/ pos); 
            return new String(chars);
        } 

        //
        // HexUnescape
        // 
        //  Converts a substring of the form "%XX" to the single character represented
        //  by the hexadecimal value XX. If the substring s[Index] does not conform to 
        //  the hex encoding format then the character at s[Index] is returned 
        //
        // Inputs: 
        //  <argument>  pattern
        //      String from which to read the hexadecimal encoded substring
        //
        //  <argument>  index 
        //      Offset within <pattern> from which to start reading the hexadecimal
        //      encoded substring 
        // 
        // Outputs:
        //  <argument>  index 
        //      Incremented to the next character position within the String. This
        //      may be EOS if this was the last character/encoding within <pattern>
        //
        // Returns: 
        //  Either the converted character if <pattern>[<index>] was hex encoded, or
        //  the character at <pattern>[<index>] 
        // 
        // Throws:
        //  ArgumentOutOfRangeException 
        //

        public static char HexUnescape(String pattern, /*ref*/ int index) {
            if ((index < 0) || (index >= pattern.Length)) { 
                throw new ArgumentOutOfRangeException("index");
            } 
            if ((pattern[index] == '%') 
                && (pattern.Length - index >= 3)) {
                char ret = UriHelper.EscapedAscii(pattern[index + 1], pattern[index + 2]); 
                if (ret != c_DummyChar) {
                    index += 3;
                    return ret;
                } 
            }
            return pattern[index++]; 
        } 

        // 
        // IsHexEncoding
        //
        //  Determines whether a substring has the URI hex encoding format of '%'
        //  followed by 2 hexadecimal characters 
        //
        // Inputs: 
        //  <argument>  pattern 
        //      String to check
        // 
        //  <argument>  index
        //      Offset in <pattern> at which to check substring for hex encoding
        //
        // Assumes: 
        //  0 <= <index> < <pattern>.Length
        // 
        // Returns: 
        //  true if <pattern>[<index>] is hex encoded, else false
        // 
        // Throws:
        //  Nothing
        //
        public static boolean IsHexEncoding(String pattern, int index) { 
            if ((pattern.Length - index) < 3) {
                return false; 
            } 
            if ((pattern[index] == '%') && UriHelper.EscapedAscii(pattern[index + 1], pattern[index + 2]) != c_DummyChar) {
                return true; 
            }
            return false;
        }
 
        //
        // Is this a gen delim char from RFC 3986 
        // 
        /*internal*/ public static boolean IsGenDelim(char ch)
        { 
            return (ch == ':' || ch == '/' || ch == '?' || ch == '#' || ch == '[' || ch == ']' || ch == '@');
        }

//        #endregion !Silverlight 

        // 
        // CheckSchemeName 
        //
        //  Determines whether a String is a valid scheme name according to RFC 2396. 
        //  Syntax is:
        //      scheme = alpha *(alpha | digit | '+' | '-' | '.')
        //
        public static boolean CheckSchemeName(String schemeName) { 
            if (((Object)schemeName == null)
                || (schemeName.Length == 0) 
                || !IsAsciiLetter(schemeName[0])) { 
                return false;
            } 
            for (int i = schemeName.Length - 1; i > 0; --i) {
                if (!(IsAsciiLetterOrDigit(schemeName[i])
                    || (schemeName[i] == '+')
                    || (schemeName[i] == '-') 
                    || (schemeName[i] == '.'))) {
                    return false; 
                } 
            }
            return true; 
        }

        //
        // IsHexDigit 
        //
        //  Determines whether a character is a valid hexadecimal digit in the range 
        //  [0..9] | [A..F] | [a..f] 
        //
        // Inputs: 
        //  <argument>  character
        //      Character to test
        //
        // Returns: 
        //  true if <character> is a hexadecimal digit character
        // 
        // Throws: 
        //  Nothing
        // 
        public static boolean IsHexDigit(char character) {
            return ((character >= '0') && (character <= '9'))
                || ((character >= 'A') && (character <= 'F'))
                || ((character >= 'a') && (character <= 'f')); 
        }
 
        // 
        // Returns:
        //  Number in the range 0..15 
        //
        // Throws:
        //  ArgumentException
        // 
        public static int FromHex(char digit) {
            if (((digit >= '0') && (digit <= '9')) 
                || ((digit >= 'A') && (digit <= 'F')) 
                || ((digit >= 'a') && (digit <= 'f'))) {
                return  (digit <= '9') 
                    ? ((int)digit - (int)'0')
                    : (((digit <= 'F')
                    ? ((int)digit - (int)'A')
                    : ((int)digit - (int)'a')) 
                    + 10);
            } 
            throw new ArgumentException("digit"); 
        }
        // 
        // GetHashCode
        //
        //  Overrides default function (in Object class)
        // 
        //
//        [SecurityPermission(SecurityAction.InheritanceDemand, Flags=SecurityPermissionFlag.Infrastructure)] 
        public override int GetHashCode() { 
            if (IsNotAbsoluteUri)
            { 
                return CalculateCaseInsensitiveHashCode(OriginalString);
            }

            // Consider moving hash code storage from m_Info.MoreInfo to m_Info 
            UriInfo info = EnsureUriInfo();
            if ((Object)info.MoreInfo == null) { 
                info.MoreInfo = new MoreInfo(); 
            }
            int tempHash = info.MoreInfo.Hash; 
            if (tempHash == 0) {
                String chkString = info.MoreInfo.RemoteUrl;
                if ((Object) chkString == null)
                    chkString = GetParts(UriComponents.HttpRequestUrl, UriFormat.SafeUnescaped); 
                tempHash = CalculateCaseInsensitiveHashCode(chkString);
                if (tempHash == 0) { 
                    tempHash = 0x1000000;   //making it not zero still large enough to be maped to zero by a hashtable 
                }
                info.MoreInfo.Hash = tempHash; 
            }
            return tempHash;
        }
 
        //
        // ToString 
        // 
        // The better implementation would be just
        // 
        private /*const*/ static final UriFormat V1ToStringUnescape = (UriFormat)0x7FFF;

//        [SecurityPermission(SecurityAction.InheritanceDemand, Flags=SecurityPermissionFlag.Infrastructure)]
        public override String ToString() 
        {
            if (m_Syntax == null) { 
                return (m_iriParsing && InFact(Flags.HasUnicode)) ? m_String : OriginalString; 
            }
 
            EnsureUriInfo();
            if ((Object)m_Info.String == null)
            {
 
                // V1.1 compat unless #353711 is appoved, otheriwse it should be just a call into GetParts() as shown below
                // m_Info.String = GetParts(UriComponents.AbsoluteUri, UriFormat.SafeUnescaped); 
 
                if (Syntax.IsSimple)
                    m_Info.String = GetComponentsHelper(UriComponents.AbsoluteUri, V1ToStringUnescape); 
                else
                    m_Info.String = GetParts(UriComponents.AbsoluteUri, UriFormat.SafeUnescaped);

            } 
            return m_Info.String;
        } 
 
        //
        // 
        //  A static shortcut to Uri.Equals
        //
//        [SecurityPermission(SecurityAction.InheritanceDemand, Flags=SecurityPermissionFlag.Infrastructure)]
        public static boolean operator == (Uri uri1, Uri uri2) { 
            if ((Object)uri1 == (Object)uri2) {
                return true; 
            } 
            if ((Object)uri1 == null || (Object)uri2 == null) {
                return false; 
            }
            return uri2.Equals(uri1);
        }
 
        //
        // 
        //  A static shortcut to !Uri.Equals 
        //
//        [SecurityPermission(SecurityAction.InheritanceDemand, Flags=SecurityPermissionFlag.Infrastructure)] 
        public static boolean operator != (Uri uri1, Uri uri2) {
            if ((Object)uri1 == (Object)uri2) {
                return false;
            } 

            if ((Object)uri1 == null || (Object)uri2 == null) { 
                return true; 
            }
 
            return !uri2.Equals(uri1);
        }

 

        // 
        // Equals 
        //
        //  Overrides default function (in Object class) 
        //
        // Assumes:
        //  <comparand> is an Object of class Uri
        // 
        // Returns:
        //  true if objects have the same value, else false 
        // 
        // Throws:
        //  Nothing 
        //
//        [SecurityPermission(SecurityAction.InheritanceDemand, Flags=SecurityPermissionFlag.Infrastructure)]
        public override boolean Equals(Object comparand) {
            if ((Object) comparand == null) { 
                return false;
            } 
 
            if ((Object)this == (Object)comparand) {
                return true; 
            }

            Uri obj = comparand as Uri;
 
            //
            // we allow comparisons of Uri and String objects only. If a String 
            // is passed, convert to Uri. This is inefficient, but allows us to 
            // canonicalize the comparand, making comparison possible
            // 
            if ((Object)obj == null) {
                String s = comparand as String;

                if ((Object)s == null) 
                    return false;
 
                if (!TryCreate(s, UriKind.RelativeOrAbsolute, /*out*/ obj)) 
                    return false;
            } 

            // Since v1.0 two Uris are equal if everything but fragment and UserInfo does match

            // This check is for a case where we already fixed up the equal references 
            if ((Object)this.m_String == (Object)obj.m_String) {
                return true; 
            } 

            if (IsAbsoluteUri != obj.IsAbsoluteUri) 
                return false;

            if (IsNotAbsoluteUri)
                return OriginalString.Equals(obj.OriginalString); 

            if (NotAny(Flags.AllUriInfoSet) || obj.NotAny(Flags.AllUriInfoSet)) { 
                // Try raw compare for m_Strings as the last chance to keep the working set small 
                if (!IsUncOrDosPath ) {
                    if (m_String.Length == obj.m_String.Length) { 
                        /*unsafe*/ {
                            // Try case sensitive compare on m_Strings
                            fixed (char* pMe = m_String) {
                                fixed (char* pShe = obj.m_String) { 
                                    // This will never go negative since m_String is checked to be a valid URI
                                    int i = (m_String.Length-1); 
                                    for ( ;i >= 0 ; --i) { 
                                        if (*(pMe+i) != *(pShe+i)) {
                                            break; 
                                        }
                                    }
                                    if (i == -1) {
                                        return true; 
                                    }
                                } 
                            } 
                        }
                    } 
                }
                else if (String.Compare(m_String, obj.m_String, StringComparison.OrdinalIgnoreCase) == 0) {
                    return true;
                } 
            }
 
            // Note that equality test will bring the working set of both 
            // objects up to creation of m_Info.MoreInfo member
            EnsureUriInfo(); 
            obj.EnsureUriInfo();

            if (!UserDrivenParsing && !obj.UserDrivenParsing && Syntax.IsSimple && obj.Syntax.IsSimple)
            { 
                // Optimization of canonical DNS names by avoiding host String creation.
                // Note there could be explicit ports specified that would invalidate path offsets 
                if (InFact(Flags.CanonicalDnsHost) && obj.InFact(Flags.CanonicalDnsHost)) { 
                    short i1 = m_Info.Offset.Host;
                    short end1 = m_Info.Offset.Path; 

                    short i2 = obj.m_Info.Offset.Host;
                    short end2 = obj.m_Info.Offset.Path;
                    String str = obj.m_String; 
                    //Taking the shortest part
                    if (end1-i1 > end2-i2) { 
                        end1 = (short)(i1 + end2-i2); 
                    }
                    // compare and break on ':' if found 
                    while (i1 < end1) {
                        if (m_String[i1] != str[i2]) {
                            return false;
                        } 
                        if (str[i2] == ':') {
                            // The other must have ':' too to have equal host 
                            break; 
                        }
                        ++i1;++i2; 
                    }

                    // The longest host must have ':' or be of the same size
                    if (i1 < m_Info.Offset.Path && m_String[i1] != ':') { 
                        return false;
                    } 
                    if (i2 < end2 && str[i2] != ':') { 
                        return false;
                    } 
                    //hosts are equal!
                }
                else {
                    EnsureHostString(false); 
                    obj.EnsureHostString(false);
                    if (!m_Info.Host.Equals(obj.m_Info.Host)) { 
                        return false; 
                    }
                } 

                if (Port != obj.Port) {
                    return false;
                } 
            }
 
            // see Whidbey#21590 
            // We want to cache RemoteUrl to improve perf for Uri as a key.
            // We should consider reducing the overall working set by not caching some other properties mentioned in MoreInfo 

            // Mutli-threading!
            UriInfo meInfo  = m_Info;
            UriInfo sheInfo = obj.m_Info; 
            if ((Object)meInfo.MoreInfo == null) {
                meInfo.MoreInfo = new MoreInfo(); 
            } 
            if ((Object)sheInfo.MoreInfo == null) {
                sheInfo.MoreInfo = new MoreInfo(); 
            }

            // NB: To avoid a race condition when creating MoreInfo field
            // "meInfo" and "sheInfo" shall remain as local copies. 
            String me = meInfo.MoreInfo.RemoteUrl;
            if ((Object)me == null) { 
                me = GetParts(UriComponents.HttpRequestUrl, UriFormat.SafeUnescaped); 
                meInfo.MoreInfo.RemoteUrl = me;
            } 
            String she = sheInfo.MoreInfo.RemoteUrl;
            if ((Object)she == null) {
                she = obj.GetParts(UriComponents.HttpRequestUrl, UriFormat.SafeUnescaped);
                sheInfo.MoreInfo.RemoteUrl = she; 
            }
 
            if (!IsUncOrDosPath ) { 
                if (me.Length != she.Length) {
                    return false; 
                }
                /*unsafe*/ {
                    // Try case sensitive compare on m_Strings
                    fixed (char* pMe = me) { 
                        fixed (char* pShe = she) {
                            char *endMe  = pMe  + me.Length; 
                            char *endShe = pShe + me.Length; 
                            while (endMe != pMe) {
                                if (*--endMe != *--endShe) { 
                                    return false;
                                }
                            }
                            return true; 
                        }
                    } 
                } 
            }
 

            // if IsUncOrDosPath is true then we ignore case in the path comparison
            // Get Unescaped form as most safe for the comparison
            // Fragment AND UserInfo are ignored 
            //
            return (String.Compare(meInfo.MoreInfo.RemoteUrl, 
                                   sheInfo.MoreInfo.RemoteUrl, 
                                   IsUncOrDosPath ? StringComparison.OrdinalIgnoreCase : StringComparison.Ordinal ) == 0);
        } 
        //
        public Uri MakeRelativeUri(Uri uri)
        {
            if ((Object)uri == null) 
                throw new ArgumentNullException("uri");
 
            if (IsNotAbsoluteUri || uri.IsNotAbsoluteUri) 
                throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
 
            // Note that the UserInfo part is ignored when computing a relative Uri.
            if ((Scheme == uri.Scheme) && (Host == uri.Host) && (Port == uri.Port))
            {
                String otherPath = uri.AbsolutePath; 

                // Relative Path 
                String relativeUriString = PathDifference(AbsolutePath, otherPath, !IsUncOrDosPath); 

                // Relative Uri's cannot have a colon ':' in the first path segment (RFC 3986, Section 4.2) 
                if (CheckForColonInFirstPathSegment(relativeUriString)
                    // Except for full implicit dos file paths
                    && !(uri.IsDosPath && otherPath.Equals(relativeUriString, StringComparison.Ordinal)))
                    relativeUriString = "./" + relativeUriString; 

                // Query & Fragment 
                relativeUriString += uri.GetParts(UriComponents.Query | UriComponents.Fragment, UriFormat.UriEscaped); 

                return new Uri(relativeUriString, UriKind.Relative); 
            }
            return uri;
        }
 
        //
        // http://www.ietf.org/rfc/rfc3986.txt 
        // 
        // 3.3.  Path
        // In addition, a URI reference (Section 4.1) may be a relative-path reference, in which case the  first 
        // path segment cannot contain a colon (":") character.
        //
        // 4.2.  Relative Reference
        // A path segment that contains a colon character (e.g., "this:that") cannot be used as the first segment 
        // of a relative-path reference, as it would be mistaken for a scheme name.  Such a segment must be
        // preceded by a dot-segment (e.g., "./this:that") to make a relative-path reference. 
        // 
        // 5.4.2. Abnormal Examples
        // http:(relativeUri) may be considered a valid relative Uri. 
        //
        // Returns true if a colon is found in the first path segment, false otherwise
        //
        private static boolean CheckForColonInFirstPathSegment(String uriString) 
        {
            // Check for anything that may terminate the first regular path segment 
            // or an illegal colon 
            char[] pathDelims = new char[] { ':', '\\', '/', '?', '#' };
            int index = uriString.IndexOfAny(pathDelims); 

            return (index >= 0 && uriString[index] == ':');
        }
        // This is used by UriBuilder, 

        /*internal*/ public /*unsafe*/ static String InternalEscapeString(String rawString) { 
            if ((Object)rawString == null) 
                return String.Empty;
 
            int position = 0;
            char[] dest = UriHelper.EscapeString(rawString, 0, rawString.Length, null, /*ref*/ position, true, '?', '#', '%');
            if ((Object)dest == null)
                return rawString; 

            return new String(dest, 0, position); 
        } 

        // 
        //  This method is called first to figure /*out*/ the scheme or a simple file path
        //  Is called only at the .ctor time
        //
        private static /*unsafe*/ ParsingError ParseScheme(String uriString, /*ref*/ Flags flags, /*ref*/ UriParser syntax) 
        {
            int length = uriString.Length; 
            if (length == 0) 
                return ParsingError.EmptyUriString;
 
            // we don;t work with >= 64k Uris
            if (length >= c_MaxUriBufferSize)
                return ParsingError.SizeLimit;
 
            //STEP1: parse scheme, lookup this Uri Syntax or create one using UnknownV1SyntaxFlags uri syntax template
            fixed (char* pUriString = uriString) 
            { 
                ParsingError err = ParsingError.None;
                short idx = ParseSchemeCheckImplicitFile(pUriString, (short)length, /*ref*/ err, /*ref*/ flags, /*ref*/ syntax); 

                if (err != ParsingError.None)
                    return err;
 
                flags |= (Flags)idx;
             } 
             return ParsingError.None; 
        }
 
        //
        // A wrapper for ParseMinimal() called from a user parser
        // It signals back that the call has been done
        // plus it communicates back a flag for an error if any 
        //
        /*internal*/ public UriFormatException ParseMinimal() 
        { 
            ParsingError result = PrivateParseMinimal();
            if (result == ParsingError.None) 
                return null;

            // Means the we think the Uri is invalid, bu that can be later overriden by a user parser
            m_Flags |= Flags.ErrorOrParsingRecursion; 

            return GetException(result); 
        } 
        //
        // 
        //  This method tries to parse the minimal information needed to certify the valifity
        //  of a uri String
        //
        //      scheme://userinfo@host:Port/Path?Query#Fragment 
        //
        //  The method must be called only at the .ctor time 
        // 
        //  Returns ParsingError.None if the Uri syntax is valid, an error otheriwse
        // 
        private /*unsafe*/ ParsingError PrivateParseMinimal()
        {
            short idx = (short) (m_Flags & org.summer.view.widget.documents.IndexMask);
            short length = (short) m_String.Length; 
            String newHost = null;      // stores newly parsed host when original strings are being switched
 
            // Means a custom UriParser did call "base" InitializeAndValidate() 
            m_Flags &= ~(Flags.IndexMask | Flags.UserDrivenParsing);
 
            //STEP2: Parse up to the port

            fixed (char* pUriString =   ((m_iriParsing &&
                                        ((m_Flags & Flags.HasUnicode)!=0) && 
                                        ((m_Flags & Flags.HostUnicodeNormalized) == 0)) ? m_originalUnicodeString : m_String))
            { 
                // Cut trailing spaces in m_String 
                if (length > idx && IsLWS(pUriString[length-1]))
                { 
                    --length;
                    while (length != idx && IsLWS(pUriString[--length]))
                        ;
                    ++length; 
                }
 
                // [....] codereview: 
                // Old Uri parser tries to figure /*out*/ on a DosPath in all cases.
                // Hence http://c:/ is treated as as DosPath without the host while it should be a host "c", port 80 
                //
                // This block is compatible with Old Uri parser in terms it will look for the DosPath if the scheme
                // syntax allows both empty hostnames and DosPath
                // 
//#if !PLATFORM_UNIX
                if (m_Syntax.IsAllSet(UriSyntaxFlags.AllowEmptyHost | UriSyntaxFlags.AllowDOSPath) 
                    && NotAny(Flags.ImplicitFile) && (idx + 1 < length)) { 

                    char c; 
                    short i = (short) idx;

                    // V1 Compat: Allow _compression_ of > 3 slashes only for File scheme, see VsWhidbey 87448.
                    // This will skip all slashes and if their number is 2+ it sets the AuthorityFound flag 
                    for (; i < length; ++i) {
                        if (!((c=pUriString[i])== '\\' || c == '/')) 
                            break; 
                    }
 
                    if (m_Syntax.InFact(UriSyntaxFlags.FileLikeUri) || i-idx <= 3) {
                        // if more than one slash after the scheme, the authority is present
                        if (i-idx >= 2) {
                            m_Flags |= Flags.AuthorityFound; 
                        }
                        // DOS-like path? 
                        if (i+1 < (short) length  && ((c=pUriString[i+1]) == ':' || c == '|') && 
                            IsAsciiLetter(pUriString[i])) {
 
                            if (i+2 >= (short) length || ((c=pUriString[i+2]) != '\\' && c != '/'))
                            {
                                // report an error but only for a file: scheme
                                if (m_Syntax.InFact(UriSyntaxFlags.FileLikeUri)) 
                                    return ParsingError.MustRootedPath;
                            } 
                            else 
                            {
                                // This will set IsDosPath 
                                m_Flags |= Flags.DosPath;

                                if (m_Syntax.InFact(UriSyntaxFlags.MustHaveAuthority)) {
                                    // when DosPath found and Authority is required, set this flag even if Authority is empty 
                                    m_Flags |= Flags.AuthorityFound;
                                } 
                                if (i != idx && i-idx != 2) { 
                                    //This will remember that DosPath is rooted
                                    idx = (short)(i-1); 
                                }
                                else {
                                    idx = i;
                                } 
                            }
                        } 
                        else if (m_Syntax.InFact(UriSyntaxFlags.FileLikeUri) && (i - idx >= 2 && i - idx != 3 && 
                            i < length && pUriString[i] != '?' && pUriString[i] != '#'))
                        { 
                            // see VsWhidbey#226745 V1.0 did not support file:///, fixing it with minimal behavior change impact
                            // Only FILE scheme may have UNC Path flag set
                            m_Flags |= Flags.UncPath;
                            idx = i; 
                        }
                    } 
                } 
//#endif // !PLATFORM_UNIX
                // 
                //STEP 1.5 decide on the Authority component
                //
//#if !PLATFORM_UNIX
//                if ((m_Flags & (Flags.UncPath|Flags.DosPath)) != 0) { 
//                }
//#else 
                if ((m_Flags & Flags.ImplicitFile) != 0) { 
                    // Already parsed up to the path
                } 
//#endif // !PLATFORM_UNIX
                else if ((idx+2) <= length) {
                    char first  = pUriString[idx];
                    char second = pUriString[idx+1]; 

                    if (m_Syntax.InFact(UriSyntaxFlags.MustHaveAuthority)) { 
                        // (V1.0 compatiblity) This will allow http:\\ http:\/ http:/\ 
//#if !PLATFORM_UNIX
//                        if ((first == '/' || first == '\\') && (second == '/' || second == '\\')) 
//#else
                        if (first == '/' && second == '/')
//#endif // !PLATFORM_UNIX
                        { 
                            m_Flags |= Flags.AuthorityFound;
                            idx+=2; 
                        } 
                        else {
                            return ParsingError.BadAuthority; 
                        }
                    }
                    else if (m_Syntax.InFact(UriSyntaxFlags.OptionalAuthority) && (InFact(Flags.AuthorityFound) ||
                        (first == '/' && second == '/'))) { 
                        m_Flags |= Flags.AuthorityFound;
                        idx+=2; 
                    } 
                    else if (m_Syntax.NotAny(UriSyntaxFlags.MailToLikeUri)) {
                        // There is no Authority component, save the Path index 
                        //
                        m_Flags |= ((Flags)idx | Flags.UnknownHostType);
                        return ParsingError.None;
                    } 
                }
                else if (m_Syntax.InFact(UriSyntaxFlags.MustHaveAuthority)) { 
                    return ParsingError.BadAuthority; 
                }
                else if (m_Syntax.NotAny(UriSyntaxFlags.MailToLikeUri)) { 
                    // There is no Authority component, save the Path index
                    //
                    m_Flags |= ((Flags)idx | Flags.UnknownHostType);
                    return ParsingError.None; 
                }
 
//#if !PLATFORM_UNIX 
//                // The following sample taken from the original parser comments makes the whole story sad
//                // vsmacros://c:\path\file 
//                // Note that two slashes say there must be an Authority but instead the path goes
//                // Fro V1 compat the next block allow this case but not for schemes like http
//                if (InFact(Flags.DosPath)) {
// 
//                    m_Flags |= (((m_Flags & Flags.AuthorityFound)!= 0)? Flags.BasicHostType :Flags.UnknownHostType);
//                    m_Flags |= (Flags)idx; 
//                    return ParsingError.None; 
//                }
//#endif // !PLATFORM_UNIX 

                //STEP 2: Check the syntax of authority expecting at least one character in it
                //
                // Note here we do know that there is an authority in the String OR it's a DOS path 

                // We may find a userInfo and the port when parsing an authority 
                // Also we may find a registry based authority. 
                // We must ensure that known schemes do use a server-based authority
            { 
                ParsingError err = ParsingError.None;
                idx = CheckAuthorityHelper(pUriString, idx, (short)length, /*ref*/ err, /*ref*/ m_Flags, m_Syntax, /*ref*/ newHost);
                if (err != ParsingError.None)
                    return err; 

                // This will disallow '\' as the host terminator for any scheme that is not implicitFile or cannot have a Dos Path 
                if ((idx < (short)length && pUriString[idx] == '\\') && NotAny(Flags.ImplicitFile) && 
                    m_Syntax.NotAny(UriSyntaxFlags.AllowDOSPath)) {
                    return ParsingError.BadAuthorityTerminator; 
                }

            }
 
                // The Path (or Port) parsing index is reloaded on demand in CreateUriInfo when accessing a Uri property
                m_Flags |= (Flags)idx; 
 
                // The rest of the String will be parsed on demand
                // The Host/Authorty is all checked, the type is known but the host value String 
                // is not created/canonicalized at this point.
            }

            if((s_IdnScope != UriIdnScope.None) || m_iriParsing) 
                PrivateParseMinimalIri(newHost, idx);
 
            return ParsingError.None; 
        }
 
        private void PrivateParseMinimalIri(String newHost, short idx)
        {
            // we have a new host!
            if (newHost != null) 
                m_String = newHost;
 
            // conditions where we dont need to go to parseremaining, so we copy the rest of the 
            // original String.. and switch offsets
            if ((!m_iriParsing && AllowIdn && (((m_Flags & Flags.IdnHost) != 0) || ((m_Flags & Flags.UnicodeHost) != 0))) || 
                (m_iriParsing && ((m_Flags & Flags.HasUnicode) == 0) && AllowIdn && ((m_Flags & Flags.IdnHost) != 0))){
                // update the start of path from the end of new String
                m_Flags &= ~(Flags.IndexMask);
                m_Flags |= (Flags)m_String.Length; 

                m_String += m_originalUnicodeString.Substring(idx, m_originalUnicodeString.Length - idx); 
            } 

            // Indicate to createuriinfo that offset is in m_originalUnicodeString 
            if (m_iriParsing && ((m_Flags & Flags.HasUnicode) != 0)){
                // offset in Flags.IndexMask refers to m_originalUnicodeString
                m_Flags |= Flags.UseOrigUncdStrOffset;
            } 
        }
 
        // 
        //
        // The method is called when we have to access m_Info members 
        // This will create the m_Info based on the copied parser context
        // Under milti-threading ---- this method may do duplicated yet harmless work
        //
        private /*unsafe*/ void CreateUriInfo(Flags cF) { 

            UriInfo info = new UriInfo(); 
 
            // This will be revisited in ParseRemaining but for now just have it at least m_String.Length
            info.Offset.End = (short)m_String.Length; 

            if (UserDrivenParsing)
                goto Done;
 
            short idx;
            boolean notCanonicalScheme = false; 
 
            // The m_String may have leading spaces, figure that /*out*/
            // plus it will set idx value for next steps 
            if ((cF & Flags.ImplicitFile) != 0) {
                idx = (short)0;
                while (IsLWS(m_String[idx])) {
                    ++idx; 
                    ++info.Offset.Scheme;
                } 
 
//#if !PLATFORM_UNIX
//                if (StaticInFact(cF, Flags.UncPath)) { 
//                    // For implicit file AND Unc only
//                    idx += 2;
//                    //skip any other slashes (compatibility with V1.0 parser)
//                    while(idx < (short)(cF & Flags.IndexMask) && (m_String[idx] == '/' || m_String[idx] == '\\')) { 
//                        ++idx;
//                    } 
//                } 
//#endif // !PLATFORM_UNIX
            } 
            else {
                // This is NOT an ImplicitFile uri
                idx = (short)m_Syntax.SchemeName.Length;
 
                while (m_String[idx++] != ':') {
                    ++info.Offset.Scheme; 
                } 

                if ((cF & Flags.AuthorityFound) != 0) 
                {
                    if (m_String[idx] == '\\' || m_String[idx+1] == '\\')
                        notCanonicalScheme = true;
 
                    idx+=2;
//#if !PLATFORM_UNIX 
//                    if ((cF & (Flags.UncPath|Flags.DosPath)) != 0) { 
//                        // Skip slashes if it was allowed during ctor time
//                        // NB: Today this is only allowed if a Unc or DosPath was found after the scheme 
//                        while( idx < (short)(cF & Flags.IndexMask) && (m_String[idx] == '/' || m_String[idx] == '\\')) {
//                            notCanonicalScheme = true;
//                            ++idx;
//                        } 
//                    }
//#endif // !PLATFORM_UNIX 
                } 
            }
 
            // This is weird but some schemes (mailto) do not have Authority-based syntax, still they do have a port
            if (m_Syntax.DefaultPort != UriParser.NoDefaultPort)
                info.Offset.PortValue = (short)m_Syntax.DefaultPort;
 
            //Here we set the indexes for already parsed components
            if ((cF & Flags.HostTypeMask) == Flags.UnknownHostType 
//#if !PLATFORM_UNIX 
//                || StaticInFact(cF, Flags.DosPath)
//#endif // !PLATFORM_UNIX 
                ) {
                //there is no Authotity component defined
                info.Offset.User  = (short) (cF & Flags.IndexMask);
                info.Offset.Host = info.Offset.User; 
                info.Offset.Path = info.Offset.User;
                cF &= ~Flags.IndexMask; 
                if (notCanonicalScheme) { 
                    cF |= Flags.SchemeNotCanonical;
                } 
                goto Done;
            }

            info.Offset.User = idx; 

            //Basic Host Type does not have userinfo and port 
            if (HostType == Flags.BasicHostType) { 
                info.Offset.Host = idx;
                info.Offset.Path = (short) (cF & Flags.IndexMask); 
                cF &= ~Flags.IndexMask;
                goto Done;
            }
 
            if ((cF & Flags.HasUserInfo) != 0) {
                // we previously found a userinfo, get it again 
                while (m_String[idx] != '@') { 
                    ++idx;
                } 
                ++idx;
                info.Offset.Host = idx;
            }
            else { 
                info.Offset.Host = idx;
            } 
 
            //Now reload the end of the parsed host
 
            idx = (short) (cF & Flags.IndexMask);

            //From now on we do not need IndexMask bits, and reuse the space for X_NotCanonical flags
            //clear them now 
            cF &= ~Flags.IndexMask;
 
            // If this is not canonical, don't count on user input to be good 
            if (notCanonicalScheme) {
                cF |= Flags.SchemeNotCanonical; 
            }

            //Guessing this is a path start
            info.Offset.Path = idx; 

            // parse Port if any. The new spec allows a port after ':' to be empty (assuming default?) 
            boolean notEmpty = false; 
            // Note we already checked on general port syntax in ParseMinimal()
 
            // If iri parsing is on with unicode chars then the end of parsed host
            // points to m_[....] String and not m_String

            boolean UseOrigUnicodeStrOffset = ((cF& org.summer.view.widget.documents.UseOrigUncdStrOffset) != 0); 
            // This should happen only once. Reset it
            cF &= ~Flags.UseOrigUncdStrOffset; 
 
            if (UseOrigUnicodeStrOffset)
                info.Offset.End = (short)m_originalUnicodeString.Length; 

            if (idx < info.Offset.End ){
                fixed (char* userString = UseOrigUnicodeStrOffset ? m_originalUnicodeString : m_String){
                    if (userString[idx] == ':'){ 
                        int port = 0;
 
                        //Check on some noncanonical cases http://host:0324/, http://host:03, http://host:0, etc 
                        if (++idx < info.Offset.End){
                            port = (short)(userString[idx] - '0'); 
                            if (!(port == unchecked((short)('/' - '0')) || port == (short)('?' - '0') ||
                                port == unchecked((short)('#' - '0')))) {
                                notEmpty = true;
                                if (port == 0){ 
                                    cF |= (Flags.PortNotCanonical | Flags.E_PortNotCanonical);
                                } 
                                for (++idx; idx < info.Offset.End; ++idx){ 
                                    short val = (short)((short)userString[idx] - (short)'0');
                                    if (val == unchecked((short)('/' - '0')) || val == (short)('?' - '0') || 
                                        val == unchecked((short)('#' - '0'))){
                                        break;
                                    }
                                    port = (port * 10 + val); 
                                }
                            } 
                        } 
                        if (notEmpty && info.Offset.PortValue != (short)port){
                            info.Offset.PortValue = (short)port; 
                            cF |= Flags.NotDefaultPort;
                        }
                        else{
                            //This will tell that we do have a ':' but the port value does 
                            //not follow to canonical rules
                            cF |= (Flags.PortNotCanonical | Flags.E_PortNotCanonical); 
                        } 
                        info.Offset.Path = (short)idx;
                    } 
                }
            }

        Done: 
            cF |= Flags.MinimalUriInfoSet;
/********* 
            // The spinlock would be better than below lock but it's too late for Beta2, consider for RTM 
            // Also DON'T forget to check EnsureUriInfo method
            int copyF = m_Flags; 
            while ((copyF & Flags.MinimalUriInfoSet) == 0)
            {
               if (copyF != (copyF = Interlocked.CompareExchange(/*ref*/ m_Flags, cF | (copyF & ~Flags.IndexMask), copyF))
                   continue; 
               m_Info  = info;
            } 
*********/ 
            info.DnsSafeHost = m_DnsSafeHost;
            lock (m_String) 
            {
                if (( m_Flags & Flags.MinimalUriInfoSet) == 0)
                {
                    m_Info  = info; 
                    m_Flags = (m_Flags & ~Flags.IndexMask) | cF;
                } 
            } 

        } 

        //
        // This will create a Host String. The validity has been already checked
        // 
        // Assuming: UriInfo memeber is already set at this point
        private /*unsafe*/ void CreateHostString() { 
            // 
            // Mutlithrreading!
            // 
            if (!m_Syntax.IsSimple)
            {
                lock (m_Info)
                { 
                    // ATTN: Avoid possible recursion through
                    // CreateHostString->Syntax.GetComponents->Uri.GetComponentsHelper->CreateHostString 
                    if (NotAny(Flags.ErrorOrParsingRecursion)) 
                    {
                        m_Flags |= Flags.ErrorOrParsingRecursion; 
                        // Need to get host String through the derived type
                        GetHostViaCustomSyntax();
                        m_Flags &= ~Flags.ErrorOrParsingRecursion;
                        return; 
                    }
                } 
            } 
            Flags flags = m_Flags;
            String host = CreateHostStringHelper(m_String, m_Info.Offset.Host, m_Info.Offset.Path, /*ref*/ flags, /*ref*/ m_Info.ScopeId); 

            // now check on canonical host representation
            if (host.Length != 0)
            { 
                // An Authority may need escaping except when it's an inet server address
                // 
                // We do not escape UNC names and will get rid of this type when switching to IDN spec 
                //
                if (HostType == Flags.BasicHostType) { 
                    short idx = 0;
                    Check result;
                    fixed (char* pHost = host) {
                        result = CheckCanonical(pHost, /*ref*/ idx, (short)host.Length, c_DummyChar); 
                    }
 
                    if ((result & Check.DisplayCanonical) == 0) { 
                        // For implicit file the user String must be in perfect display format,
                        // Hence, ignoring complains from CheckCanonical() 
                        if (NotAny(Flags.ImplicitFile) || (result & Check.ReservedFound) != 0) {
                            flags |= Flags.HostNotCanonical;
                        }
                    } 

                    if (InFact(Flags.ImplicitFile) && (result & (Check.ReservedFound | Check.EscapedCanonical)) != 0) { 
                        // need to re-escape this host if any escaped sequence was found 
                        result &= ~Check.EscapedCanonical;
                    } 

                    if ((result & (Check.EscapedCanonical|Check.BackslashInPath)) != Check.EscapedCanonical) {
                        // we will make a canonical host in m_Info.Host, but mark that m_String holds wrong data
                        flags |= Flags.E_HostNotCanonical; 
                        if (NotAny(Flags.UserEscaped))
                        { 
                            int position = 0; 
                            char[] dest = UriHelper.EscapeString(host, 0, host.Length, null, /*ref*/ position, true, '?',
                                '#', IsImplicitFile ? c_DummyChar : '%'); 
                            if ((Object)dest != null)
                                host = new String(dest, 0, position);
                        }
                        else { 
                            //
 
                        } 
                    }
                } 
                else if (NotAny(Flags.CanonicalDnsHost)){
                    // Check to see if we can take the canonical host String /*out*/ of m_String
                    if ((Object)m_Info.ScopeId != null) {
                        // IPv6 ScopeId is included when serializing a Uri 
                        flags |= (Flags.HostNotCanonical | Flags.E_HostNotCanonical);
                    } 
                    else { 
                        for (short i=0 ; i < host.Length; ++i) {
                             if ((m_Info.Offset.Host + i) >= m_Info.Offset.End || 
                                 host[i] != m_String[m_Info.Offset.Host + i]) {
                                 flags |= (Flags.HostNotCanonical | Flags.E_HostNotCanonical);
                                 break;
                             } 
                         }
                    } 
                } 
            }
 
            m_Info.Host = host;
            lock (m_Info)
            {
                m_Flags |= flags; 
            }
        } 
        // 
        private static String CreateHostStringHelper(String str, short idx, short end, /*ref*/ Flags flags, /*ref*/ String scopeId)
        { 
            boolean loopback = false;
            String host;
            switch (flags & Flags.HostTypeMask) {
 
                case Flags.DnsHostType:
                    host = DomainNameHelper.ParseCanonicalName(str, idx, end, /*ref*/ loopback); 
                    break; 

                case Flags.IPv6HostType: 
                    //[....] codereview
                    // The helper will return [...] String that is not suited for Dns.Resolve()
                    host = IPv6AddressHelper.ParseCanonicalName(str, idx, /*ref*/ loopback, /*ref*/ scopeId);
                    break; 

                case Flags.IPv4HostType: 
                    host = IPv4AddressHelper.ParseCanonicalName(str, idx, end, /*ref*/ loopback); 
                    break;
 
//#if !PLATFORM_UNIX
//                case Flags.UncHostType:
//                    host = UncNameHelper.ParseCanonicalName(str, idx, end, /*ref*/ loopback);
//                    break; 
//#endif // !PLATFORM_UNIX
 
                case Flags.BasicHostType: 
//#if !PLATFORM_UNIX
//                    if (StaticInFact(flags, Flags.DosPath)) { 
//                        host = String.Empty;
//                    }
//                    else
//#endif // !PLATFORM_UNIX 
                    {
                        // This is for a registry-based authority, not relevant for known schemes 
                        host = str.Substring(idx, end-idx); 
                    }
                    // A empty host would count for a loopback 
                    if (host.Length == 0) {
                        loopback = true;
                    }
                    //there will be no port 
                    break;
 
                case Flags.UnknownHostType: 
                    //means the host is *not expected* for this uri type
                    host = String.Empty; 
                    break;

                default: //it's a bug
                    throw GetException(ParsingError.BadHostName); 
            }
 
            if (loopback) { 
                flags |= Flags.LoopbackHost;
            } 
            return host;
        }
        //
        // Called under lock() 
        //
        private /*unsafe*/ void GetHostViaCustomSyntax() 
        { 
            // A multithreading check
            if (m_Info.Host != null) 
                return;

            String host = m_Syntax.InternalGetComponents(this, UriComponents.Host, UriFormat.UriEscaped);
 
            // ATTN: Check on whether recursion has not happened
            if ((Object)m_Info.Host == null) 
            { 
                if (host.Length >= c_MaxUriBufferSize)
                    throw GetException(ParsingError.SizeLimit); 

                ParsingError err = ParsingError.None;
                Flags flags = m_Flags & ~org.summer.view.widget.documents.HostTypeMask;
 
                fixed (char *pHost = host)
                { 
                    String newHost = null; 
                    if (CheckAuthorityHelper(pHost, 0, (short)host.Length, /*ref*/ err, /*ref*/ flags, m_Syntax, /*ref*/ newHost) !=
                        (short)host.Length) 
                    {
                        // We cannot parse the entire host String
                        flags &= ~Flags.HostTypeMask;
                        flags |= Flags.UnknownHostType; 
                    }
                } 
 
                if (err != ParsingError.None || (flags & Flags.HostTypeMask) == Flags.UnknownHostType)
                { 
                    // Well, custom parser has returned a not known host type, take it as Basic then.
                    m_Flags = (m_Flags & ~Flags.HostTypeMask) | Flags.BasicHostType;
                }
                else 
                {
                    host = CreateHostStringHelper(host, 0, (short)host.Length, /*ref*/ flags, /*ref*/ m_Info.ScopeId); 
                    for (short i=0 ; i < host.Length; ++i) { 
                             if ((m_Info.Offset.Host + i) >= m_Info.Offset.End || host[i] != m_String[m_Info.Offset.Host + i]) {
                                 m_Flags |= (Flags.HostNotCanonical | Flags.E_HostNotCanonical); 
                                 break;
                             }
                         }
                    m_Flags = (m_Flags & ~Flags.HostTypeMask) | (flags & Flags.HostTypeMask); 
                }
            } 
            // 
            // This is a chance for a custom parser to report a different port value
            // 
            String portStr = m_Syntax.InternalGetComponents(this, UriComponents.StrongPort, UriFormat.UriEscaped);
            int port = 0;
            if ((Object)portStr == null || portStr.Length == 0)
            { 
                // It's like no port
                m_Flags &= ~Flags.NotDefaultPort; 
                m_Flags |= (Flags.PortNotCanonical|Flags.E_PortNotCanonical); 
                m_Info.Offset.PortValue = 0;
            } 
            else
            {
                for (int idx=0; idx < portStr.Length; ++idx)
                { 
                    int val = portStr[idx] - '0';
                    if (val < 0 || val > 9 || (port = (port * 10 + val)) > 0xFFFF) 
                        throw new UriFormatException(SR.GetString(SR.net_uri_PortOutOfRange, m_Syntax.GetType().FullName, portStr)); 
                }
                if (port != m_Info.Offset.PortValue) 
                {
                    if (port == m_Syntax.DefaultPort)
                        m_Flags &= ~Flags.NotDefaultPort;
                    else 
                        m_Flags |= Flags.NotDefaultPort;
 
                    m_Flags |= (Flags.PortNotCanonical|Flags.E_PortNotCanonical); 
                    m_Info.Offset.PortValue = (short) port;
                } 
            }
            // This must be done as the last thing in this method
            m_Info.Host = host;
        } 
        //
        // An /*internal*/ public shortcut into Uri extenisiblity API 
        // 
        /*internal*/ public String GetParts(UriComponents uriParts, UriFormat formatAs)
        { 
            return GetComponents(uriParts, formatAs);
        }

        // 
        //
        // 
        private String GetEscapedParts(UriComponents uriParts) { 
            // Which Uri parts are not escaped canonically ?
            // Notice that public UriPart and private Flags must me in [....] so below code can work 
            //
            short  nonCanonical = (short)(((short)m_Flags & ((short)org.summer.view.widget.documents.CannotDisplayCanonical<<7)) >> 6);
            if (InFact(Flags.SchemeNotCanonical)) {
                nonCanonical |= (short)Flags.SchemeNotCanonical; 
            }
 
            // We keep separate flags for some of path canonicalization facts 
            if ((uriParts & UriComponents.Path) != 0) {
                if (InFact(Flags.ShouldBeCompressed|Flags.FirstSlashAbsent|Flags.BackslashInPath)) { 
                    nonCanonical |= (short)Flags.PathNotCanonical;
                }
                else if (IsDosPath && m_String[m_Info.Offset.Path + SecuredPathIndex - 1] == '|') {
                    // A rare case of c|\ 
                    nonCanonical |= (short)Flags.PathNotCanonical;
                } 
            } 

            if (((short)uriParts & nonCanonical) == 0) { 
                String ret = GetUriPartsFromUserString(uriParts);
                if ((Object)ret != null) {
                    return ret;
                } 
            }
 
            return ReCreateParts(uriParts, nonCanonical, UriFormat.UriEscaped); 
        }
 
        private String GetUnescapedParts(UriComponents uriParts, UriFormat formatAs) {
            // Which Uri parts are not escaped canonically ?
            // Notice that public UriComponents and private Uri.Flags must me in [....] so below code can work
            // 
            short  nonCanonical = (short)((short)m_Flags & (short)org.summer.view.widget.documents.CannotDisplayCanonical);
 
            // We keep separate flags for some of path canonicalization facts 
            if ((uriParts & UriComponents.Path) != 0) {
                if ((m_Flags & (Flags.ShouldBeCompressed|Flags.FirstSlashAbsent|Flags.BackslashInPath)) !=0) { 
                    nonCanonical |= (short)Flags.PathNotCanonical;
                }
                else if (IsDosPath && m_String[m_Info.Offset.Path + SecuredPathIndex - 1] == '|') {
                    // A rare case of c|\ 
                    nonCanonical |= (short)Flags.PathNotCanonical;
                } 
 
            }
 
            if (((short)uriParts & nonCanonical) == 0) {
                String ret = GetUriPartsFromUserString(uriParts);
                if ((Object)ret != null) {
                    return ret; 
                }
            } 
 
            return ReCreateParts(uriParts, nonCanonical, formatAs);
        } 

        //
        //
        // 
        private String ReCreateParts(UriComponents parts, short nonCanonical, UriFormat formatAs)
        { 
            // going hard core 
            EnsureHostString(false);
            String stemp = (parts & UriComponents.Host) == 0? String.Empty: m_Info.Host; 
            // we reserve more space than required because a canonical Ipv6 Host
            // may take more characteres than in original m_String
            // Also +3 is for :// and +1 is for absent first slash
            // Also we may escape every character, hence multiplying by 12 
            // UTF-8 can use up to 4 bytes per char * 3 chars per byte (%A4) = 12 encoded chars
            int count = (m_Info.Offset.End-m_Info.Offset.User) * (formatAs == UriFormat.UriEscaped?12:1); 
            char[] chars = new char[stemp.Length + count + m_Syntax.SchemeName.Length + 3 + 1]; 
            count = 0;
 
            //Scheme and slashes
            if ((parts & UriComponents.Scheme) != 0) {
                m_Syntax.SchemeName.CopyTo(0, chars, count, m_Syntax.SchemeName.Length);
                count += m_Syntax.SchemeName.Length; 
                if (parts != UriComponents.Scheme) {
                    chars[count++] = ':'; 
                    if (InFact(Flags.AuthorityFound)) { 
                        chars[count++] = '/';
                        chars[count++] = '/'; 
                    }
                }
            }
 
            //UserInfo
            if ((parts & UriComponents.UserInfo) != 0 && InFact(Flags.HasUserInfo)) 
            { 
                if ((nonCanonical & (short)UriComponents.UserInfo) != 0) {
                    switch (formatAs) { 
                        case UriFormat.UriEscaped:
                            if (NotAny(Flags.UserEscaped))
                            {
                                chars = UriHelper.EscapeString(m_String, m_Info.Offset.User, m_Info.Offset.Host, chars, 
                                    /*ref*/ count, true, '?', '#', '%');
                            } 
                            else { 
                                if (InFact(Flags.E_UserNotCanonical)) {
                                    // 

                                }
                                m_String.CopyTo(m_Info.Offset.User, chars, count, m_Info.Offset.Host - m_Info.Offset.User);
                                count += (m_Info.Offset.Host - m_Info.Offset.User); 
                            }
                            break; 
 
                        case UriFormat.SafeUnescaped:
                            chars = UriHelper.UnescapeString(m_String, m_Info.Offset.User, m_Info.Offset.Host - 1, 
                                chars, /*ref*/ count, '@', '/', '\\', InFact(Flags.UserEscaped) ? UnescapeMode.Unescape :
                                UnescapeMode.EscapeUnescape, m_Syntax, false);
                            chars[count++] = '@';
                            break; 

                        case UriFormat.Unescaped: 
                            chars = UriHelper.UnescapeString(m_String, m_Info.Offset.User, m_Info.Offset.Host, chars, 
                                /*ref*/ count, c_DummyChar, c_DummyChar, c_DummyChar,
                                UnescapeMode.Unescape | UnescapeMode.UnescapeAll, m_Syntax, false); 
                            break;

                        default: //V1ToStringUnescape
                            chars = UriHelper.UnescapeString(m_String, m_Info.Offset.User, m_Info.Offset.Host, chars, 
                                /*ref*/ count, c_DummyChar, c_DummyChar, c_DummyChar, UnescapeMode.CopyOnly, m_Syntax,
                                false); 
                            break; 
                    }
                } 
                else {
                    UriHelper.UnescapeString(m_String, m_Info.Offset.User, m_Info.Offset.Host, chars, /*ref*/ count,
                        c_DummyChar, c_DummyChar, c_DummyChar, UnescapeMode.CopyOnly, m_Syntax, false);
                } 
                if (parts == UriComponents.UserInfo)
                { 
                    //strip '@' delimiter 
                    --count;
                } 
            }

            // Host
            if ((parts & UriComponents.Host) != 0 && stemp.Length != 0) 
            {
                UnescapeMode mode; 
                if (formatAs != UriFormat.UriEscaped && HostType == Flags.BasicHostType 
                    && (nonCanonical & (short)UriComponents.Host) != 0) {
                    // only Basic host could be in the escaped form 
                    mode = formatAs == UriFormat.Unescaped
                        ? (UnescapeMode.Unescape | UnescapeMode.UnescapeAll) :
                            (InFact(Flags.UserEscaped) ? UnescapeMode.Unescape : UnescapeMode.EscapeUnescape);
 
                }
                else { 
                    mode = UnescapeMode.CopyOnly; 
                }
                // NormalizedHost 
                if ((parts & UriComponents.NormalizedHost) != 0)
                {
                    /*unsafe*/
                    { 
                        fixed (char* hostPtr = stemp)
                        { 
                            boolean allAscii = false; 
                            boolean atLeastOneValidIdn = false;
                            try 
                            {
                                // Upconvert any punycode to unicode, xn--pck -> ?
                                stemp = DomainNameHelper.UnicodeEquivalent(
                                    hostPtr, 0, stemp.Length, /*ref*/ allAscii, /*ref*/ atLeastOneValidIdn); 
                            }
                            // The host may be invalid punycode (www.xn--?-pck.com), 
                            // but we shouldn't throw after the constructor. 
                            catch (UriFormatException) { }
                        } 
                    }
                }
                chars = UriHelper.UnescapeString(stemp, 0, stemp.Length, chars, /*ref*/ count, '/', '?', '#', mode,
                    m_Syntax, false); 

                // A fix up only for SerializationInfo and IpV6 host with a scopeID 
                if ((parts & UriComponents.SerializationInfoString) != 0 && HostType == Flags.IPv6HostType && 
                    (Object)m_Info.ScopeId != null)
                { 
                    m_Info.ScopeId.CopyTo(0, chars, count-1, m_Info.ScopeId.Length);
                    count += m_Info.ScopeId.Length;
                    chars[count-1] = ']';
                } 
            }
 
            //Port (always wants a ':' delimiter if got to this method) 
            if ((parts & UriComponents.Port) != 0)
            { 
                if ((nonCanonical & (short)UriComponents.Port) == 0) {
                    //take it from m_String
                    if (InFact(Flags.NotDefaultPort)) {
                        short start = m_Info.Offset.Path; 
                        while (m_String[--start] != ':') {
                            ; 
                        } 
                        m_String.CopyTo(start, chars, count, m_Info.Offset.Path - start);
                        count += (m_Info.Offset.Path - start); 
                    }
                    else if ((parts & UriComponents.StrongPort) != 0 && m_Syntax.DefaultPort != UriParser.NoDefaultPort) {
                        chars[count++]= ':';
                        stemp = m_Info.Offset.PortValue.ToString(CultureInfo.InvariantCulture); 
                        stemp.CopyTo(0, chars, count, stemp.Length);
                        count += stemp.Length; 
                    } 
                }
                else if (InFact(Flags.NotDefaultPort) || ((parts & UriComponents.StrongPort) != 0 && 
                    m_Syntax.DefaultPort != UriParser.NoDefaultPort)) {
                    // recreate String from port value
                    chars[count++]= ':';
                    stemp = m_Info.Offset.PortValue.ToString(CultureInfo.InvariantCulture); 
                    stemp.CopyTo(0, chars, count, stemp.Length);
                    count += stemp.Length; 
                } 
            }
 
            short delimiterAwareIndex;

            //Path
            if ((parts & UriComponents.Path) != 0) 
            {
                chars = GetCanonicalPath(chars, /*ref*/ count, formatAs); 
 
                // (possibly strip the leading '/' delimiter)
                if (parts == UriComponents.Path) 
                {
                    if (InFact(Flags.AuthorityFound) && count !=0 && chars[0] == '/')
                    {
                        delimiterAwareIndex = 1; --count; 
                    }
                    else 
                    { 
                        delimiterAwareIndex = 0;
                    } 
                    return count == 0? String.Empty: new String(chars, delimiterAwareIndex, count);
                }
            }
 
            //Query (possibly strip the '?' delimiter)
            if ((parts & UriComponents.Query) != 0 && m_Info.Offset.Query < m_Info.Offset.Fragment) 
            { 
                delimiterAwareIndex = (short)(m_Info.Offset.Query+1);
                if(parts != UriComponents.Query) 
                    chars[count++] = '?';   //see Fragment+1 below

                if ((nonCanonical & (short)UriComponents.Query) != 0)
                { 
                    switch (formatAs)
                    { 
                    case UriFormat.UriEscaped: 
                        //Can Assert IsImplicitfile == false
                        if (NotAny(Flags.UserEscaped)) 
                            chars = UriHelper.EscapeString(m_String, delimiterAwareIndex, m_Info.Offset.Fragment, chars,
                                /*ref*/ count, true, '#', c_DummyChar, '%');
                        else
                        { 
                            //
 
 
                            UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.Fragment, chars,
                                /*ref*/ count, c_DummyChar, c_DummyChar, c_DummyChar, UnescapeMode.CopyOnly, m_Syntax, 
                                true);
                        }
                        break;
 
                    case V1ToStringUnescape:
 
                        chars = UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.Fragment, chars, 
                            /*ref*/ count, '#', c_DummyChar, c_DummyChar, (InFact(Flags.UserEscaped) ?
                            UnescapeMode.Unescape : UnescapeMode.EscapeUnescape) | UnescapeMode.V1ToStringFlag, 
                            m_Syntax, true);
                        break;

                    case UriFormat.Unescaped: 

                        chars = UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.Fragment, chars, 
                            /*ref*/ count, '#', c_DummyChar, c_DummyChar, 
                            (UnescapeMode.Unescape | UnescapeMode.UnescapeAll), m_Syntax, true);
                        break; 

                    default: // UriFormat.SafeUnescaped

                        chars = UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.Fragment, chars, 
                            /*ref*/ count, '#', c_DummyChar, c_DummyChar, (InFact(Flags.UserEscaped) ?
                            UnescapeMode.Unescape : UnescapeMode.EscapeUnescape), m_Syntax, true); 
                        break; 
                    }
                } 
                else
                {
                    UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.Fragment, chars, /*ref*/ count,
                        c_DummyChar, c_DummyChar, c_DummyChar, UnescapeMode.CopyOnly, m_Syntax, true); 
                }
            } 
 
            //Fragment (possibly strip the '#' delimiter)
            if ((parts & UriComponents.Fragment) != 0 && m_Info.Offset.Fragment < m_Info.Offset.End) 
            {
                delimiterAwareIndex = (short)(m_Info.Offset.Fragment+1);
                if(parts != UriComponents.Fragment)
                    chars[count++] = '#';   //see Fragment+1 below 

                if ((nonCanonical & (short)UriComponents.Fragment) != 0) 
                { 
                    switch (formatAs) {
                    case UriFormat.UriEscaped: 
                            if (NotAny(Flags.UserEscaped))
                                chars = UriHelper.EscapeString(m_String, delimiterAwareIndex, m_Info.Offset.End, chars,
                                    /*ref*/ count, true, UriParser.ShouldUseLegacyV2Quirks ? '#' : c_DummyChar, c_DummyChar, '%');
                            else 
                            {
                                // 
 

                                UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.End, chars, 
                                    /*ref*/ count, c_DummyChar, c_DummyChar, c_DummyChar, UnescapeMode.CopyOnly, m_Syntax,
                                    false);
                            }
                            break; 

                    case V1ToStringUnescape: 
 
                            chars = UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.End, chars,
                                /*ref*/ count, '#', c_DummyChar, c_DummyChar, (InFact(Flags.UserEscaped) ? 
                                UnescapeMode.Unescape : UnescapeMode.EscapeUnescape) | UnescapeMode.V1ToStringFlag,
                                m_Syntax, false);
                        break;
                    case UriFormat.Unescaped: 

                        chars = UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.End, chars, 
                            /*ref*/ count, '#', c_DummyChar, c_DummyChar, 
                            UnescapeMode.Unescape | UnescapeMode.UnescapeAll, m_Syntax, false);
                        break; 

                    default: // UriFormat.SafeUnescaped

                        chars = UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.End, chars, 
                            /*ref*/ count, '#', c_DummyChar, c_DummyChar, (InFact(Flags.UserEscaped) ?
                            UnescapeMode.Unescape : UnescapeMode.EscapeUnescape), m_Syntax, false); 
                        break; 
                    }
                } 
                else
                {
                    UriHelper.UnescapeString(m_String, delimiterAwareIndex, m_Info.Offset.End, chars, /*ref*/ count,
                        c_DummyChar, c_DummyChar, c_DummyChar, UnescapeMode.CopyOnly, m_Syntax, false); 
                }
            } 
 
            return new String(chars, 0, count);
        } 

        //
        // This method is called only if the user String has a canonical representation
        // of requested parts 
        //
        private String GetUriPartsFromUserString(UriComponents uriParts) { 
 
            short delimiterAwareIdx;
 
            switch (uriParts & ~UriComponents.KeepDelimiter) {
                    // For FindServicePoint perf
                case UriComponents.Scheme | UriComponents.Host | UriComponents.Port:
                    if (!InFact(Flags.HasUserInfo)) 
                        return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.Path - m_Info.Offset.Scheme);
 
                    return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.User - m_Info.Offset.Scheme) 
                         + m_String.Substring(m_Info.Offset.Host, m_Info.Offset.Path - m_Info.Offset.Host);
 
                    // For HttpWebRequest.ConnectHostAndPort perf
                case UriComponents.HostAndPort:  //Host|StrongPort

                    if (!InFact(Flags.HasUserInfo)) 
                        goto case UriComponents.StrongAuthority;
 
                    if (InFact(Flags.NotDefaultPort) || m_Syntax.DefaultPort == UriParser.NoDefaultPort) 
                        return m_String.Substring(m_Info.Offset.Host, m_Info.Offset.Path - m_Info.Offset.Host);
 
                    return m_String.Substring(m_Info.Offset.Host, m_Info.Offset.Path - m_Info.Offset.Host)
                        + ':' + m_Info.Offset.PortValue.ToString(CultureInfo.InvariantCulture);

                    // For an obvious common case perf 
                case UriComponents.AbsoluteUri:     //Scheme|UserInfo|Host|Port|Path|Query|Fragment,
                    if (m_Info.Offset.Scheme == 0 && m_Info.Offset.End == m_String.Length) 
                        return m_String; 

                    return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.End - m_Info.Offset.Scheme); 

                    // For Uri.Equals() and HttpWebRequest through a proxy perf
                case UriComponents.HttpRequestUrl:   //Scheme|Host|Port|Path|Query,
                    if (InFact(Flags.HasUserInfo)) { 
                        return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.User - m_Info.Offset.Scheme)
                            + m_String.Substring(m_Info.Offset.Host, m_Info.Offset.Fragment - m_Info.Offset.Host); 
                    } 
                    if (m_Info.Offset.Scheme == 0 && m_Info.Offset.Fragment == m_String.Length)
                        return m_String; 

                    return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.Fragment - m_Info.Offset.Scheme);

                    // For CombineUri() perf 
                case UriComponents.SchemeAndServer|UriComponents.UserInfo:
                    return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.Path - m_Info.Offset.Scheme); 
 
                    // For Cache perf
                case (UriComponents.AbsoluteUri & ~UriComponents.Fragment): 
                    if (m_Info.Offset.Scheme == 0 && m_Info.Offset.Fragment == m_String.Length)
                        return m_String;

                    return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.Fragment - m_Info.Offset.Scheme); 

 
                // Strip scheme delimiter if was not requested 
                case UriComponents.Scheme:
                        if (uriParts != UriComponents.Scheme) 
                            return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.User - m_Info.Offset.Scheme);

                        return m_Syntax.SchemeName;
 
                // KeepDelimiter makes no sense for this component
                case UriComponents.Host: 
                    short idx = m_Info.Offset.Path; 
                    if (InFact(Flags.NotDefaultPort|Flags.PortNotCanonical)) {
                        //Means we do have ':' after the host 
                        while (m_String[--idx] != ':')
                            ;
                    }
                    return (idx - m_Info.Offset.Host == 0)? String.Empty: m_String.Substring(m_Info.Offset.Host, 
                        idx - m_Info.Offset.Host);
 
                case UriComponents.Path: 

                    // Strip the leading '/' for a hierarchical URI if no delimiter was requested 
                    if (uriParts == UriComponents.Path && InFact(Flags.AuthorityFound) &&
                        m_Info.Offset.End > m_Info.Offset.Path && m_String[m_Info.Offset.Path] == '/')
                        delimiterAwareIdx = (short)(m_Info.Offset.Path + 1);
                    else 
                        delimiterAwareIdx = m_Info.Offset.Path;
 
                    if (delimiterAwareIdx >= m_Info.Offset.Query) 
                        return String.Empty;
 

                    return m_String.Substring(delimiterAwareIdx, m_Info.Offset.Query - delimiterAwareIdx);

                case UriComponents.Query: 
                    // Strip the '?' if no delimiter was requested
                    if (uriParts == UriComponents.Query) 
                        delimiterAwareIdx = (short)(m_Info.Offset.Query + 1); 
                    else
                        delimiterAwareIdx = m_Info.Offset.Query; 

                    if (delimiterAwareIdx >= m_Info.Offset.Fragment)
                        return String.Empty;
 
                    return m_String.Substring(delimiterAwareIdx, m_Info.Offset.Fragment - delimiterAwareIdx);
 
                case UriComponents.Fragment: 
                    // Strip the '#' if no delimiter was requested
                    if (uriParts == UriComponents.Fragment) 
                        delimiterAwareIdx = (short)(m_Info.Offset.Fragment + 1);
                    else
                        delimiterAwareIdx = m_Info.Offset.Fragment;
 
                    if (delimiterAwareIdx >= m_Info.Offset.End)
                        return String.Empty; 
 
                    return m_String.Substring(delimiterAwareIdx, m_Info.Offset.End - delimiterAwareIdx);
 
                case UriComponents.UserInfo | UriComponents.Host | UriComponents.Port:
                    return (m_Info.Offset.Path - m_Info.Offset.User == 0) ? String.Empty :
                        m_String.Substring(m_Info.Offset.User, m_Info.Offset.Path - m_Info.Offset.User);
 
                case UriComponents.StrongAuthority:  //UserInfo|Host|StrongPort
                    if (InFact(Flags.NotDefaultPort) || m_Syntax.DefaultPort == UriParser.NoDefaultPort) 
                        goto case UriComponents.UserInfo | UriComponents.Host | UriComponents.Port; 

                    return m_String.Substring(m_Info.Offset.User, m_Info.Offset.Path - m_Info.Offset.User) 
                        + ':' + m_Info.Offset.PortValue.ToString(CultureInfo.InvariantCulture);

                case UriComponents.PathAndQuery:        //Path|Query,
                    return m_String.Substring(m_Info.Offset.Path, m_Info.Offset.Fragment - m_Info.Offset.Path); 

                case UriComponents.HttpRequestUrl|UriComponents.Fragment: //Scheme|Host|Port|Path|Query|Fragment, 
                    if (InFact(Flags.HasUserInfo)) { 
                        return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.User - m_Info.Offset.Scheme)
                            + m_String.Substring(m_Info.Offset.Host, m_Info.Offset.End - m_Info.Offset.Host); 
                    }
                    if (m_Info.Offset.Scheme == 0 && m_Info.Offset.End == m_String.Length)
                        return m_String;
 
                    return m_String.Substring(m_Info.Offset.Scheme, m_Info.Offset.End - m_Info.Offset.Scheme);
 
                case UriComponents.PathAndQuery|UriComponents.Fragment:  //LocalUrl|Fragment 
                    return m_String.Substring(m_Info.Offset.Path, m_Info.Offset.End - m_Info.Offset.Path);
 
                case UriComponents.UserInfo:
                        // Strip the '@' if no delimiter was requested

                    if (NotAny(Flags.HasUserInfo)) 
                        return String.Empty;
 
                    if (uriParts == UriComponents.UserInfo) 
                        delimiterAwareIdx = (short)(m_Info.Offset.Host - 1);
                    else 
                        delimiterAwareIdx = m_Info.Offset.Host;

                    if (m_Info.Offset.User >= delimiterAwareIdx)
                        return String.Empty; 

                    return m_String.Substring(m_Info.Offset.User, delimiterAwareIdx - m_Info.Offset.User); 
 
                default:
                    return null; 
            }
        }

 
        //
        //This method does: 
        //  - Creates m_Info member 
        //  - checks all componenets up to path on their canonical representation
        //  - continues parsing starting the path position 
        //  - Sets the offsets of remaining components
        //  - Sets the Canonicalization flags if applied
        //  - Will NOT create MoreInfo members
        // 
        private /*unsafe*/ void ParseRemaining() {
 
            // ensure we parsed up to the path 
            EnsureUriInfo();
 
            Flags cF = org.summer.view.widget.documents.Zero;

            if (UserDrivenParsing)
                goto Done; 

            // Do we have to continue building Iri'zed String from original String 
            boolean buildIriStringFromPath = m_iriParsing && ((m_Flags & org.summer.view.widget.documents.HasUnicode) != 0) && ((m_Flags & org.summer.view.widget.documents.RestUnicodeNormalized) == 0); 

            short origIdx;     // stores index to switched original String 
            short idx = m_Info.Offset.Scheme;
            short length = (short)m_String.Length;
            Check result = Check.None;
            UriSyntaxFlags syntaxFlags = org.summer.view.widget.documents.Flags;    // perf 

            // Multithreading! 
            // m_Info.Offset values may be parsed twice but we lock only on m_Flags update. 

            fixed (char* str = m_String){ 
                // Cut trailing spaces in m_String
                if (length > idx && IsLWS(str[length - 1]))
                {
                    --length; 
                    while (length != idx && IsLWS(str[--length]))
                        ; 
                    ++length; 
                }
 
                if (IsImplicitFile){
                    cF |= Flags.SchemeNotCanonical;
                }
                else { 
                    short i = 0;
                    short syntaxLength = (short)m_Syntax.SchemeName.Length; 
                    for (; i < syntaxLength; ++i) 
                    {
                        if (m_Syntax.SchemeName[i] != str[idx + i]) 
                            cF |= Flags.SchemeNotCanonical;
                    }
                    // For an authority Uri only // after the scheme would be canonical
                    // (compatibility bug http:\\host) 
                    if (((m_Flags & Flags.AuthorityFound) != 0) && (idx + i + 3 >= length || str[idx + i + 1] != '/' ||
                        str[idx + i + 2] != '/')) 
                    { 
                        cF |= Flags.SchemeNotCanonical;
                    } 
                }


                //Check the form of the user info 
                if ((m_Flags & Flags.HasUserInfo) != 0){
                    idx = m_Info.Offset.User; 
                    result = CheckCanonical(str, /*ref*/ idx, m_Info.Offset.Host, '@'); 
                    if ((result & Check.DisplayCanonical) == 0){
                        cF |= Flags.UserNotCanonical; 
                    }
                    if ((result & (Check.EscapedCanonical | Check.BackslashInPath)) != Check.EscapedCanonical){
                        cF |= Flags.E_UserNotCanonical;
                    } 
                    if (m_iriParsing && ((result & (Check.DisplayCanonical | Check.EscapedCanonical | Check.BackslashInPath
                                                    | Check.FoundNonAscii | Check.NotIriCanonical)) 
                                                    == (Check.DisplayCanonical | Check.FoundNonAscii))){ 
                        cF |= Flags.UserIriCanonical;
                    } 
                }
            }
            //
            // Delay canonical Host checking to avoid creation of a host String 
            // Will do that on demand.
            // 
 

            // 
            //We have already checked on the port in EnsureUriInfo() that calls CreateUriInfo
            //

            // 
            // Parsing the Path if any
            // 
 
            // For iri parsing if we found unicode the idx has offset into m_[....] String..
            // so restart parsing from there and make m_Info.Offset.Path as m_string.length 

            idx = m_Info.Offset.Path;
            origIdx = m_Info.Offset.Path;
 
            //Some uris do not have a query
            //    When '?' is passed as delimiter, then it's special case 
            //    so both '?' and '#' will work as delimiters 
            if (buildIriStringFromPath){
 
                // Dos paths have no host.  Other schemes cleared/set m_String with host information in PrivateParseMinimal.
                if (IsDosPath) {
                    if (IsImplicitFile) {
                        m_String = String.Empty; 
                    }
                    else { 
                        m_String = m_Syntax.SchemeName + SchemeDelimiter; 
                    }
                } 

                m_Info.Offset.Path = (short)m_String.Length;
                idx = m_Info.Offset.Path;
 
                short offset = origIdx;
                if (IsImplicitFile || ((syntaxFlags & (UriSyntaxFlags.MayHaveQuery | UriSyntaxFlags.MayHaveFragment)) == 0)){ 
                    FindEndOfComponent(m_originalUnicodeString, /*ref*/ origIdx, (short)m_originalUnicodeString.Length, c_DummyChar); 
                }
                else{ 
                    FindEndOfComponent(m_originalUnicodeString, /*ref*/ origIdx, (short)m_originalUnicodeString.Length,
                   (m_Syntax.InFact(UriSyntaxFlags.MayHaveQuery) ? '?' : m_Syntax.InFact(UriSyntaxFlags.MayHaveFragment) ? '#' : c_EOL));
                }
 
                // Correctly escape unescape
                String escapedPath = EscapeUnescapeIri(m_originalUnicodeString, offset, origIdx, UriComponents.Path); 
 
                // Normalize path
                try{ 
                    if (UriParser.ShouldUseLegacyV2Quirks)
                        m_String += escapedPath.Normalize(NormalizationForm.FormC);
                    else
                        m_String += escapedPath; 
                }
                catch (ArgumentException){ 
                    UriFormatException e = GetException(ParsingError.BadFormat); 
                    throw e;
                } 

                length = (short)m_String.Length;
            }
 
            fixed (char* str = m_String){
                if (IsImplicitFile || ((syntaxFlags & (UriSyntaxFlags.MayHaveQuery | UriSyntaxFlags.MayHaveFragment)) == 0)){ 
                    result = CheckCanonical(str, /*ref*/ idx, length, c_DummyChar); 
                }
                else { 
                    result = CheckCanonical(str, /*ref*/ idx, length, (((syntaxFlags & UriSyntaxFlags.MayHaveQuery) != 0)
                        ? '?' : m_Syntax.InFact(UriSyntaxFlags.MayHaveFragment) ? '#' : c_EOL));
                }
 
                // ATTN:
                // This may render problems for unknown schemes, but in general for an authority based Uri 
                // (that has slashes) a path should start with "/" 
                // This becomes more interesting knowning how a file uri is used in "file://c:/path"
                // It will be converted to file:///c:/path 
                //
                // However, even more interesting is that vsmacros://c:\path will not add the third slash in the _canoical_ case
                // (vsmacros inventors have violated the RFC)
                // 
                // We use special syntax flag to check if the path is rooted, i.e. has a first slash
                // 
                if (((m_Flags & Flags.AuthorityFound) != 0) && ((syntaxFlags & UriSyntaxFlags.PathIsRooted) != 0) 
                    && (m_Info.Offset.Path == length || (str[m_Info.Offset.Path] != '/' && str[m_Info.Offset.Path] != '\\'))){
                    cF |= Flags.FirstSlashAbsent; 
                }
            }
            // Check the need for compression or backslashes conversion
            // we included IsDosPath since it may come with other than FILE uri, for ex. scheme://C:\path 
            // (This is very unfortunate that the original design has included that feature)
            boolean nonCanonical = false; 
            if (IsDosPath || (((m_Flags & Flags.AuthorityFound) != 0) && 
                (((syntaxFlags & (UriSyntaxFlags.CompressPath | UriSyntaxFlags.ConvertPathSlashes)) != 0) ||
                m_Syntax.InFact(UriSyntaxFlags.UnEscapeDotsAndSlashes)))) 
            {
                if (((result & Check.DotSlashEscaped) != 0) && m_Syntax.InFact(UriSyntaxFlags.UnEscapeDotsAndSlashes))
                {
                    cF |= (Flags.E_PathNotCanonical | Flags.PathNotCanonical); 
                    nonCanonical = true;
                } 
 
                if (((syntaxFlags & (UriSyntaxFlags.ConvertPathSlashes)) != 0) && (result & Check.BackslashInPath) != 0){
                    cF |= (Flags.E_PathNotCanonical | Flags.PathNotCanonical); 
                    nonCanonical = true;
                }

                if (((syntaxFlags & (UriSyntaxFlags.CompressPath)) != 0) && ((cF & Flags.E_PathNotCanonical) != 0 || 
                    (result & Check.DotSlashAttn) != 0))
                { 
                    cF |= Flags.ShouldBeCompressed; 
                }
 
                if ((result & Check.BackslashInPath) != 0)
                    cF |= Flags.BackslashInPath;

            } 
            else if ((result & Check.BackslashInPath) != 0){
                // for a "generic" path '\' should be escaped 
                cF |= Flags.E_PathNotCanonical; 
                nonCanonical = true;
            } 

            if ((result & Check.DisplayCanonical) == 0){
                // For implicit file the user String is usually in perfect display format,
                // Hence, ignoring complains from CheckCanonical() 
                //
 
                if (((m_Flags & Flags.ImplicitFile) == 0) || ((m_Flags & Flags.UserEscaped) != 0) || 
                    (result & Check.ReservedFound) != 0) {
                    //means it's found as escaped or has unescaped Reserved Characters 
                    cF |= Flags.PathNotCanonical;
                    nonCanonical = true;
                }
            } 

            if (((m_Flags & Flags.ImplicitFile) != 0) && (result & (Check.ReservedFound | Check.EscapedCanonical)) != 0){ 
                // need to escape reserved chars or re-escape '%' if an "escaped sequence" was found 
                result &= ~Check.EscapedCanonical;
            } 

            if ((result & Check.EscapedCanonical) == 0){
                //means it's found as not completely escaped
                cF |= Flags.E_PathNotCanonical; 
            }
 
            if (m_iriParsing && !nonCanonical & ((result & (Check.DisplayCanonical | Check.EscapedCanonical 
                            | Check.FoundNonAscii | Check.NotIriCanonical))
                            == (Check.DisplayCanonical | Check.FoundNonAscii))){ 
                cF |= Flags.PathIriCanonical;
            }

            // 
            //Now we've got to parse the Query if any. Note that Query requires the presence of '?'
            // 
           if (buildIriStringFromPath){ 
               short offset = origIdx;
 
               if (origIdx < m_originalUnicodeString.Length && m_originalUnicodeString[origIdx] == '?'){
                   ++origIdx; // This is to exclude first '?' character from checking
                   FindEndOfComponent(m_originalUnicodeString, /*ref*/ origIdx, (short)m_originalUnicodeString.Length, ((syntaxFlags &(UriSyntaxFlags.MayHaveFragment)) != 0) ? '#' : c_EOL);
 
                   // Correctly escape unescape
                   String escapedPath = EscapeUnescapeIri(m_originalUnicodeString, offset, origIdx, UriComponents.Query); 
 
                   // Normalize path
                   try{ 
                       if (UriParser.ShouldUseLegacyV2Quirks)
                           m_String += escapedPath.Normalize(NormalizationForm.FormC);
                       else
                           m_String += escapedPath; 
                   }
                   catch (ArgumentException){ 
                       UriFormatException e = GetException(ParsingError.BadFormat); 
                       throw e;
                   } 

                   length = (short)m_String.Length;
               }
            } 

            m_Info.Offset.Query = idx; 
 
            fixed (char* str = m_String){
                if (idx < length && str[idx] == '?'){ 
                    ++idx; // This is to exclude first '?' character from checking
                    result = CheckCanonical(str, /*ref*/ idx, length, ((syntaxFlags & (UriSyntaxFlags.MayHaveFragment)) != 0)
                        ? '#' : c_EOL);
                    if ((result & Check.DisplayCanonical) == 0){ 
                        cF |= Flags.QueryNotCanonical;
                    } 
 
                    if ((result & (Check.EscapedCanonical | Check.BackslashInPath)) != Check.EscapedCanonical){
                        cF |= Flags.E_QueryNotCanonical; 
                    }

                    if (m_iriParsing && ((result & (Check.DisplayCanonical | Check.EscapedCanonical | Check.BackslashInPath
                                | Check.FoundNonAscii | Check.NotIriCanonical)) 
                                == (Check.DisplayCanonical | Check.FoundNonAscii))){
                        cF |= Flags.QueryIriCanonical; 
                    } 

                } 
            }
            //
            //Now we've got to parse the Fragment if any. Note that Fragment requires the presense of '#'
            // 
            if (buildIriStringFromPath){
                short offset = origIdx; 
 
                if (origIdx < m_originalUnicodeString.Length && m_originalUnicodeString[origIdx] == '#')
                { 
                    ++origIdx; // This is to exclude first '#' character from checking
                    FindEndOfComponent(m_originalUnicodeString, /*ref*/ origIdx, (short)m_originalUnicodeString.Length, c_EOL);

                    // Correctly escape unescape 
                    String escapedPath = EscapeUnescapeIri(m_originalUnicodeString, offset, origIdx, UriComponents.Fragment);
 
                    // Normalize path 
                    try{
                        if (UriParser.ShouldUseLegacyV2Quirks) 
                            m_String += escapedPath.Normalize(NormalizationForm.FormC);
                        else
                            m_String += escapedPath;
                    } 
                    catch (ArgumentException){
                        UriFormatException e = GetException(ParsingError.BadFormat); 
                        throw e; 
                    }
 
                    length = (short)m_String.Length;
                }
            }
 
            m_Info.Offset.Fragment = idx;
 
            fixed (char* str = m_String){ 
                if (idx < length && str[idx] == '#'){
                    ++idx; // This is to exclude first '#' character from checking 
                    //We don't using c_DummyChar since want to allow '?' and '#' as unescaped
                    result = CheckCanonical(str, /*ref*/ idx, length, c_EOL);
                    if ((result & Check.DisplayCanonical) == 0){
                        cF |= Flags.FragmentNotCanonical; 
                    }
 
                    if ((result & (Check.EscapedCanonical | Check.BackslashInPath)) != Check.EscapedCanonical){ 
                        cF |= Flags.E_FragmentNotCanonical;
                    } 

                    if (m_iriParsing && ((result & (Check.DisplayCanonical | Check.EscapedCanonical | Check.BackslashInPath
                                | Check.FoundNonAscii | Check.NotIriCanonical))
                                == (Check.DisplayCanonical | Check.FoundNonAscii))){ 
                        cF |= Flags.FragmentIriCanonical;
                    } 
 
                }
            } 
                m_Info.Offset.End = idx;
        Done:

            cF |= Flags.AllUriInfoSet; 
            lock (m_Info)
            { 
                m_Flags |= cF; 
            }
            m_Flags |= Flags.RestUnicodeNormalized; 
        }

        //
        // 
        // verifies the syntax of the scheme part
        // Checks on implicit File: scheme due to simple Dos/Unc path passed 
        // returns the start of the next component  position 
        // throws UriFormatException if invalid scheme
        // 
        /*unsafe*/ static private short ParseSchemeCheckImplicitFile(char /***/ uriString, short length,
            /*ref*/ ParsingError err, /*ref*/ Flags flags, /*ref*/ UriParser syntax) {

            short idx = 0; 

            //skip whitespaces 
            while(idx < length && IsLWS(uriString[idx])) { 
                ++idx;
            } 

            // sets the recognizer for well known registered schemes
            // file, ftp, http, https, uuid, etc
            // Note that we don't support one-letter schemes that will be put into a DOS path bucket 

            // 
            short end = idx; 
            while (end < length && uriString[end] != ':') {
                ++end; 
            }

            // NB: On 64-bits we will use less optimized code from CheckSchemeSyntax()
            // 
            if (IntPtr.Size == 4) {
                // long = 4chars: The minimal size of a known scheme is 2 + ':' 
                if (end != length && end >= idx+2 && 
                    CheckKnownSchemes((long*) (uriString + idx), (short)(end-idx), /*ref*/ syntax)) {
                    return (short)(end+1); 
                }
            }

            //NB: A String must have at least 3 characters and at least 1 before ':' 
            if (idx+2 >= length || end == idx) {
                err = ParsingError.BadFormat; 
                return 0; 
            }
 
            //Check for supported special cases like a DOS file path OR a UNC share path
            //NB: A String may not have ':' if this is a UNC path
        {
            char c; 
            if ((c=uriString[idx+1]) == ':' || c == '|') {
//#if !PLATFORM_UNIX 
//                //DOS-like path? 
//                if (IsAsciiLetter(uriString[idx])) {
//                    if((c=uriString[idx+2]) == '\\' || c== '/') { 
//                        flags |= (Flags.DosPath|Flags.ImplicitFile|Flags.AuthorityFound);
//                        syntax = UriParser.FileUri;
//                        return idx;
//                    } 
//                    err = ParsingError.MustRootedPath;
//                    return 0; 
//                } 
//#endif // !PLATFORM_UNIX
                if (c == ':') 
                    err = ParsingError.BadScheme;
                else
                    err = ParsingError.BadFormat;
                return 0; 
            }
//#if !PLATFORM_UNIX 
//            else if ((c=uriString[idx]) == '/' || c == '\\') { 
//                //UNC share ?
//                if ((c=uriString[idx+1]) == '\\' || c == '/') { 
//                    flags |= (Flags.UncPath|Flags.ImplicitFile|Flags.AuthorityFound);
//                    syntax = UriParser.FileUri;
//                    idx+=2;
//                    // V1.1 compat this will simply eat any slashes prepended to a UNC path 
//                    while (idx < length && ((c=uriString[idx]) == '/' ||  c == '\\'))
//                        ++idx; 
// 
//                    return idx;
//                } 
//                err = ParsingError.BadFormat;
//                return 0;
//            }
//#else 
            else if (uriString[idx] == '/') {
                // On UNIX an implicit file has the form /<path> or scheme:///<path> 
                if (idx == 0 || uriString[idx-1] != ':' ) { 
                    // No scheme present; implicit /<path> starting at idx
                    flags |= (Flags.ImplicitFile|Flags.AuthorityFound); 
                    syntax = UriParser.FileUri;
                    return idx;
                } else if (uriString[idx+1] == '/' && uriString[idx+2] == '/') {
                    // scheme present; rooted path starts at idx + 2 
                    flags |= (Flags.ImplicitFile|Flags.AuthorityFound);
                    syntax = UriParser.FileUri; 
                    idx+=2; 
                    return idx;
                } 
            }
            else if (uriString[idx] == '\\') {
                err = ParsingError.BadFormat;
                return 0; 
            }
//#endif // !PLATFORM_UNIX 
        } 

            if (end == length) { 
                err = ParsingError.BadFormat;
                return 0;
            }
 
            // Here could be a possibly valid, and not well-known scheme
            // Finds the scheme delimiter 
            // we don;t work with the schemes names > c_MaxUriSchemeName (should be ~1k) 
            if ((end-idx) > c_MaxUriSchemeName) {
                err = ParsingError.SchemeLimit; 
                return 0;
            }

            //Check the syntax, canonicalize  and avoid a GC call 
            char* schemePtr = stackalloc char[end-idx];
            for (length = 0; idx < end; ++idx) { 
                schemePtr[length++] = uriString[idx]; 
            }
            err = CheckSchemeSyntax(schemePtr, length, /*ref*/ syntax); 
            if (err != ParsingError.None) {
                return 0;
            }
            return (short)(end+1); 
        }
        // 
        // Quickly parses well known schemes. 
        // nChars does not include the last ':'. Assuming there is one at the end of passed buffer
        /*unsafe*/ static private boolean CheckKnownSchemes(long *lptr, short nChars, /*ref*/ UriParser syntax) { 
            //NOTE beware of too short input buffers!

            /*const*/ static final long _HTTP_Mask0   = 'h'|('t'<<16)|((long)'t'<<32)|((long)'p'<<48);
            /*const*/ static final char _HTTPS_Mask1  = 's'; 
            /*const*/ static final int  _WS_Mask      = 'w'|('s'<<16);
            /*const*/ static final long _WSS_Mask     = 'w'|('s'<<16)|((long)'s'<<32)|((long)':'<<48); 
            /*const*/ static final long _FTP_Mask     = 'f'|('t'<<16)|((long)'p'<<32)|((long)':'<<48); 
            /*const*/ static final long _FILE_Mask0   = 'f'|('i'<<16)|((long)'l'<<32)|((long)'e'<<48);
            /*const*/ static final long _GOPHER_Mask0 = 'g'|('o'<<16)|((long)'p'<<32)|((long)'h'<<48); 
            /*const*/ static final int  _GOPHER_Mask1 = 'e'|('r'<<16);
            /*const*/ static final long _MAILTO_Mask0 = 'm'|('a'<<16)|((long)'i'<<32)|((long)'l'<<48);
            /*const*/ static final int  _MAILTO_Mask1 = 't'|('o'<<16);
            /*const*/ static final long _NEWS_Mask0   = 'n'|('e'<<16)|((long)'w'<<32)|((long)'s'<<48); 
            /*const*/ static final long _NNTP_Mask0   = 'n'|('n'<<16)|((long)'t'<<32)|((long)'p'<<48);
            /*const*/ static final long _UUID_Mask0   = 'u'|('u'<<16)|((long)'i'<<32)|((long)'d'<<48); 
 
            /*const*/ static final long _TELNET_Mask0 = 't'|('e'<<16)|((long)'l'<<32)|((long)'n'<<48);
            /*const*/ static final int  _TELNET_Mask1 = 'e'|('t'<<16); 

            /*const*/ static final long _NETXXX_Mask0 = 'n'|('e'<<16)|((long)'t'<<32)|((long)'.'<<48);
            /*const*/ static final long _NETTCP_Mask1 = 't'|('c'<<16)|((long)'p'<<32)|((long)':'<<48);
            /*const*/ static final long _NETPIPE_Mask1 = 'p'|('i'<<16)|((long)'p'<<32)|((long)'e'<<48); 

            /*const*/ static final long _LDAP_Mask0   = 'l'|('d'<<16)|((long)'a'<<32)|((long)'p'<<48); 
 

            /*const*/ static final long _LOWERCASE_Mask = 0x0020002000200020L; 
            /*const*/ static final int  _INT_LOWERCASE_Mask = 0x00200020;

            if (nChars == 2) {
                // This is the only known scheme of length 2 
                if ((((int)*lptr) | _INT_LOWERCASE_Mask) == _WS_Mask) {
                    syntax = UriParser.WsUri; 
                    return true; 
                }
                return false; 
            }

            //Map to a known scheme if possible
            //upgrade 4 letters to ASCII lower case, keep a false case to stay false 
            switch (*lptr | _LOWERCASE_Mask) {
                case _HTTP_Mask0: 
                    if (nChars == 4) { 
                        syntax = UriParser.HttpUri;
                        return true; 
                    }
                    if (nChars == 5 && ((*(char*)(lptr+1))|0x20) == _HTTPS_Mask1) {
                        syntax = UriParser.HttpsUri;
                        return true; 
                    }
                    break; 
                case _WSS_Mask: 
                    if (nChars == 3)
                    { 
                        syntax = UriParser.WssUri;
                        return true;
                    }
                    break; 
                case _FILE_Mask0:
                    if (nChars == 4) { 
                        syntax = UriParser.FileUri; 
                        return true;
                    } 
                    break;
                case _FTP_Mask:
                    if (nChars == 3) {
                        syntax = UriParser.FtpUri; 
                        return true;
                    } 
                    break; 

                case _NEWS_Mask0: 
                    if (nChars == 4) {
                        syntax = UriParser.NewsUri;
                        return true;
                    } 
                    break;
 
                case _NNTP_Mask0: 
                    if (nChars == 4) {
                        syntax = UriParser.NntpUri; 
                        return true;
                    }
                    break;
 
                case _UUID_Mask0:
                    if (nChars == 4) { 
                        syntax = UriParser.UuidUri; 
                        return true;
                    } 
                    break;

                case _GOPHER_Mask0:
                    if (nChars == 6 && (*(int*)(lptr+1)|_INT_LOWERCASE_Mask) == _GOPHER_Mask1) { 
                        syntax = UriParser.GopherUri;
                        return true; 
                    } 
                    break;
                case _MAILTO_Mask0: 
                    if (nChars == 6 && (*(int*)(lptr+1)|_INT_LOWERCASE_Mask) == _MAILTO_Mask1) {
                        syntax = UriParser.MailToUri;
                        return true;
                    } 
                    break;
 
                case _TELNET_Mask0: 
                    if (nChars == 6 && (*(int*)(lptr+1)|_INT_LOWERCASE_Mask) == _TELNET_Mask1) {
                        syntax = UriParser.TelnetUri; 
                        return true;
                    }
                    break;
 
                case _NETXXX_Mask0:
                    if (nChars == 8 && (*(lptr+1)|_LOWERCASE_Mask) == _NETPIPE_Mask1) { 
                        syntax = UriParser.NetPipeUri; 
                        return true;
                    } 
                    else if (nChars == 7 && (*(lptr+1)|_LOWERCASE_Mask) == _NETTCP_Mask1) {
                        syntax = UriParser.NetTcpUri;
                        return true;
                    } 
                    break;
 
                case _LDAP_Mask0: 
                    if (nChars == 4) {
                        syntax = UriParser.LdapUri; 
                        return true;
                    }
                    break;
                default:    break; 
            }
            return false; 
        } 

        // 
        //
        // This will check whether a scheme String follows the rules
        //
        /*unsafe*/ static private ParsingError CheckSchemeSyntax(char* ptr, short length, /*ref*/ UriParser syntax) { 
            //First character must be an alpha
        { 
            char c = *ptr; 
            if (c >= 'a' && c <= 'z') {
                ; 
            } else if (c >= 'A' && c <= 'Z') {
                *ptr = (char)(c | 0x20);    //make it lowercase
            } else {
                return ParsingError.BadScheme; 
            }
        } 
 
            for (short i = 1; i < length; ++i) {
                char c = ptr[i]; 
                if (c >= 'a' && c <= 'z') {
                    ;
                } else if (c >= 'A' && c <= 'Z') {
                    ptr[i] = (char)(c | 0x20);    //make it lowercase 
                } else if (c >= '0' && c <= '9') {
                    ; 
                } else if (c == '+' || c == '-' || c == '.') { 
                    ;
                } else { 
                    return ParsingError.BadScheme;
                }
            }
            // A not well-known scheme, needs String creation 
            // Note it is already in the lower case as required.
            String str  =  new String(ptr, 0, length); 
            syntax = UriParser.FindOrFetchAsUnknownV1Syntax(str); 
            return ParsingError.None;
        } 
        //
        //
        // Checks the syntax of an authority component. It may also get a userInfo if present
        // Returns an error if no/mailformed authority found 
        // Does not NOT touch m_Info
        // Returns position of the Path component 
        // 
        // Must be called in the ctor only
        private /*unsafe*/ short CheckAuthorityHelper( char* pString, short idx, short length, 
            /*ref*/ ParsingError err, /*ref*/ Flags flags, UriParser syntax, /*ref*/ String newHost )
        {
            int end = length;
            char ch; 
            int startInput = idx;
            short start = idx; 
            newHost = null; 
            boolean justNormalized = false;
            boolean iriParsing = (s_IriParsing && IriParsingStatic(syntax)); // perf 
            boolean hasUnicode = ((flags & org.summer.view.widget.documents.HasUnicode) != 0); // perf
            boolean hostNotUnicodeNormalized = ((flags & org.summer.view.widget.documents.HostUnicodeNormalized) == 0); // perf
            UriSyntaxFlags syntaxFlags = org.summer.view.widget.documents.Flags;
 
            // need to build new Iri'zed String
            if (hasUnicode && iriParsing && hostNotUnicodeNormalized){ 
                newHost = m_originalUnicodeString.Substring(0, startInput); 
            }
 
            //Special case is an empty authority
            if (idx == length || ((ch=pString[idx]) == '/' || (ch == '\\' && StaticIsFile(syntax)) || ch == '#' || ch == '?'))
            {
                if (syntax.InFact(UriSyntaxFlags.AllowEmptyHost)) 
                {
                    flags &= ~Flags.UncPath;    //UNC cannot have an empty hostname 
                    if (StaticInFact(flags, Flags.ImplicitFile)) 
                        err = ParsingError.BadHostName;
                    else 
                        flags |= Flags.BasicHostType;
                }
                else
                    err = ParsingError.BadHostName; 

                if (hasUnicode && iriParsing && hostNotUnicodeNormalized){ 
                    flags |= Flags.HostUnicodeNormalized;// no host 
                }
 
                 return idx;
            }

//#if PLATFORM_UNIX 
//            if (StaticIsFile(syntax) && ch != '/') {
//                // On UNIX a file URL may only have an empty authority 
//                err = ParsingError.NonEmptyHost; 
//                return idx;
//            } 
//#endif // PLATFORM_UNIX

            String userInfoString = null;
            // Attempt to parse user info first 

            if ((syntaxFlags & UriSyntaxFlags.MayHaveUserInfo) != 0) 
            { 
                for (; start < end; ++start)
                { 
                    if (start == end - 1 || pString[start] == '?' || pString[start] == '#' || pString[start] == '\\' ||
                        pString[start] == '/')
                    {
                        start = idx; 
                        break;
                    } 
                    else if (pString[start] == '@') 
                    {
                        flags |= Flags.HasUserInfo; 

                        // Iri'ze userinfo
                        if (iriParsing || (s_IdnScope != UriIdnScope.None)){
                            if (iriParsing && hasUnicode && hostNotUnicodeNormalized){ 
                                // Normalize user info
                                userInfoString = EscapeUnescapeIri(pString, startInput, start + 1, UriComponents.UserInfo); 
                                try{ 
                                    if (UriParser.ShouldUseLegacyV2Quirks)
                                        userInfoString = userInfoString.Normalize(NormalizationForm.FormC); 
                                }
                                catch (ArgumentException){
                                    err = ParsingError.BadFormat;
                                    return idx; 
                                }
 
                                newHost += userInfoString; 
                            }
                            else{ 
                                userInfoString = new String(pString, startInput, start - startInput + 1);
                            }
                        }
                        ++start; 
                        ch = pString[start];
                        break; 
                    } 
                }
            } 

            // DNS name only optimization
            // Fo an overriden parsing the optimization is suppressed since hostname can be changed to anything
            boolean dnsNotCanonical = ((syntaxFlags & UriSyntaxFlags.SimpleUserSyntax) == 0); 

            if (ch == '[' && syntax.InFact(UriSyntaxFlags.AllowIPv6Host) 
                && IPv6AddressHelper.IsValid(pString, (int)start+1, /*ref*/ end)) 
            {
                flags |= Flags.IPv6HostType; 

                // Force load config here if config not loaded earlier since we handle IsWellFormed differently
                // for IPv6 if the iri parsing flag is on or off
                if (!s_ConfigInitialized) { 
                    InitializeUriConfig();
                    m_iriParsing = (s_IriParsing && IriParsingStatic(syntax)); 
                } 

                if (hasUnicode && iriParsing && hostNotUnicodeNormalized) { 
                    newHost += new String(pString, start, end - start);
                    flags |= Flags.HostUnicodeNormalized;
                    justNormalized = true;
                } 
            }
            else if ( ch <= '9' && ch >= '0' && syntax.InFact(UriSyntaxFlags.AllowIPv4Host) && 
                IPv4AddressHelper.IsValid(pString, (int) start, /*ref*/ end, false, StaticNotAny(flags, Flags.ImplicitFile))) 
            {
                flags |= Flags.IPv4HostType; 

                if (hasUnicode && iriParsing && hostNotUnicodeNormalized){
                    newHost += new String(pString, start, end - start);
                    flags |= Flags.HostUnicodeNormalized; 
                    justNormalized = true;
                } 
            } 
            else if (((syntaxFlags & UriSyntaxFlags.AllowDnsHost)!= 0) && !iriParsing &&
           DomainNameHelper.IsValid(pString, start, /*ref*/ end, /*ref*/ dnsNotCanonical, StaticNotAny(flags, Flags.ImplicitFile))) 
            {
                // comes here if there are only ascii chars in host with original parsing and no Iri

                flags |= Flags.DnsHostType; 
                if (!dnsNotCanonical) {
                    flags |= Flags.CanonicalDnsHost; 
                } 

                if ((s_IdnScope != UriIdnScope.None)){ 
                    // check if intranet
                    //
                    if ((s_IdnScope == UriIdnScope.AllExceptIntranet) && IsIntranet(new String(pString, 0, end))){
                        flags |= Flags.IntranetUri; 
                    }
                    if (AllowIdnStatic(syntax, flags)){ 
                        boolean allAscii = true; 
                        boolean atLeastOneIdn = false;
 
                        String idnValue = DomainNameHelper.UnicodeEquivalent(pString, start, end, /*ref*/ allAscii, /*ref*/ atLeastOneIdn);

                        // did we find at least one valid idn
                        if (atLeastOneIdn) 
                        {
                            // need to switch String here since we didnt know before hand there there was an idn host 
                            if (StaticNotAny(flags, Flags.HasUnicode)) 
                                m_originalUnicodeString = m_String; // lazily switching strings
                            flags |= Flags.IdnHost; 

                            // need to build String for this special scenario
                            newHost = m_originalUnicodeString.Substring(0, startInput) + userInfoString + idnValue;
                            flags |= Flags.CanonicalDnsHost; 
                            m_DnsSafeHost = new String(pString, start, end - start);
                            justNormalized = true; 
                        } 
                        flags |= Flags.HostUnicodeNormalized;
                    } 
                }
            }
            else if (((syntaxFlags & UriSyntaxFlags.AllowDnsHost) != 0)
                    && ((syntax.InFact(UriSyntaxFlags.AllowIriParsing) && hostNotUnicodeNormalized) 
                            || syntax.InFact(UriSyntaxFlags.AllowIdn))
                    && DomainNameHelper.IsValidByIri(pString, start, /*ref*/ end, /*ref*/ dnsNotCanonical, 
                                            StaticNotAny(flags, Flags.ImplicitFile))) 
            {
                CheckAuthorityHelperHandleDnsIri(pString, start, end, startInput, iriParsing, hasUnicode, syntax, 
                    userInfoString, /*ref*/ flags, /*ref*/ justNormalized, /*ref*/ newHost, /*ref*/ err);
            }
#if !PLATFORM_UNIX
            else if ((syntaxFlags & UriSyntaxFlags.AllowUncHost) != 0) 
            {
                // 
                // This must remain as the last check befor BasicHost type 
                //
                if (UncNameHelper.IsValid(pString, start, /*ref*/ end, StaticNotAny(flags, Flags.ImplicitFile))) 
                {
                    if (end - start <= UncNameHelper.MaximumInternetNameLength)
                        flags |= Flags.UncHostType;
                } 
            }
#endif // !PLATFORM_UNIX 
 
            // The deal here is that we won't allow '\' host terminator except for the File scheme
            // If we see '\' we try to make it a part of of a Basic host 
            if (end < length && pString[end] == '\\' && (flags & Flags.HostTypeMask) != Flags.HostNotParsed
                && !StaticIsFile(syntax))
            {
                if (syntax.InFact(UriSyntaxFlags.V1_UnknownUri)) 
                {
                    err = ParsingError.BadHostName; 
                    flags |= Flags.UnknownHostType; 
                    return (short) end;
                } 
                flags &= ~Flags.HostTypeMask;
            }
            // Here we have checked the syntax up to the end of host
            // The only thing that can cause an exception is the port value 
            // Spend some (duplicated) cycles on that.
            else if (end < length && pString[end] == ':') 
            { 
                if (syntax.InFact(UriSyntaxFlags.MayHavePort))
                { 
                    int port = 0;
                    int startPort = end;
                    for (idx = (short)(end+1); idx < length; ++idx) {
                        short val = (short)((short)pString[idx] - (short)'0'); 
                        if ((val >= 0) && (val <= 9))
                        { 
                            if ((port = (port * 10 + val)) > 0xFFFF) 
                                break;
                        } 
                        else if (val == unchecked((short)('/' - '0')) || val == (short)('?' - '0')
                            || val == unchecked((short)('#' - '0')))
                        {
                            break; 
                        }
                        else 
                        { 
                            // The second check is to keep compatibility with V1 until the UriParser is registered
                            if(syntax.InFact(UriSyntaxFlags.AllowAnyOtherHost) 
                                && syntax.NotAny(UriSyntaxFlags.V1_UnknownUri))
                            {
                                flags &= ~Flags.HostTypeMask;
                                break; 
                            }
                            else 
                            { 
                                err = ParsingError.BadPort;
                                return idx; 
                            }
                        }
                    }
                    // check on 0-ffff range 
                    if (port > 0xFFFF)
                    { 
                        if (syntax.InFact(UriSyntaxFlags.AllowAnyOtherHost)) 
                        {
                            flags &= ~Flags.HostTypeMask; 
                        }
                        else
                        {
                            err = ParsingError.BadPort; 
                            return idx;
                        } 
                    } 

                    if (iriParsing && hasUnicode && justNormalized){ 
                        newHost += new String(pString, startPort, idx - startPort);
                    }
                }
                else 
                {
                    flags &= ~Flags.HostTypeMask; 
                } 

            } 

            // check on whether nothing has worked /*out*/
            if ((flags & Flags.HostTypeMask) == Flags.HostNotParsed)
            { 
                //No user info for a Basic hostname
                flags &= ~Flags.HasUserInfo; 
                // Some schemes do not allow HostType = Basic (plus V1 almost never understands this cause of a bug) 
                //
                if(syntax.InFact(UriSyntaxFlags.AllowAnyOtherHost)) 
                {
                    flags |= Flags.BasicHostType;
                    for (end = idx; end < length; ++end) {
                        if (pString[end] == '/' || (pString[end] == '?' || pString[end] == '#')) { 
                            break;
                        } 
                    } 
                    CheckAuthorityHelperHandleAnyHostIri(pString, startInput, end, iriParsing, hasUnicode, syntax,
                                                            /*ref*/ flags, /*ref*/ newHost, /*ref*/ err); 
                }
                else
                {
                    // 
                    // ATTN V1 compat: V1 supports hostnames like ".." and ".", and so we do but only for unknown schemes.
                    //                 (VsWhidbey#438821) 
                    if (syntax.InFact(UriSyntaxFlags.V1_UnknownUri)) 
                    {
                        // Can assert here that the host is not empty so we will set dotFound 
                        // at least once or fail before exiting the loop
                        boolean dotFound = false;
                        int startOtherHost = idx;
                        for (end = idx; end < length; ++end) 
                        {
                            if (dotFound && (pString[end] == '/' || pString[end] == '?' || pString[end] == '#')) 
                                break; 
                            else if (end < (idx + 2) && pString[end] == '.')
                            { 
                                // allow one or two dots
                                dotFound = true;
                            }
                            else 
                            {
                                //failure 
                                err = ParsingError.BadHostName; 
                                flags |= Flags.UnknownHostType;
                                return idx; 
                            }
                        }
                        //success
                        flags |= Flags.BasicHostType; 

                        if (iriParsing && hasUnicode 
                            && StaticNotAny(flags, Flags.HostUnicodeNormalized)){ 
                            // Normalize any other host
                            String user = new String(pString, startOtherHost, startOtherHost - end); 
                            try
                            {
                                newHost += user.Normalize(NormalizationForm.FormC);
                            } 
                            catch (ArgumentException){
                                err = ParsingError.BadFormat; 
                                return idx; 
                            }
 
                            flags |= Flags.HostUnicodeNormalized;
                        }
                    }
                    else if (syntax.InFact(UriSyntaxFlags.MustHaveAuthority) || 
                             (syntax.InFact(UriSyntaxFlags.MailToLikeUri) && !UriParser.ShouldUseLegacyV2Quirks))
                    { 
                        err = ParsingError.BadHostName; 
                        flags |= Flags.UnknownHostType;
                        return idx; 
                    }
                }
            }
            return (short) end; 
        }
 
        /*unsafe*/ void CheckAuthorityHelperHandleDnsIri( char* pString, short start, int end, int startInput, 
            boolean iriParsing, boolean hasUnicode, UriParser syntax, String userInfoString, /*ref*/ Flags flags,
            /*ref*/ boolean justNormalized, /*ref*/ String newHost, /*ref*/ ParsingError err) 
        {
            // comes here only if host has unicode chars and iri is on or idn is allowed

            flags |= Flags.DnsHostType; 

            // check if intranet 
            // 
            if ((s_IdnScope == UriIdnScope.AllExceptIntranet) && IsIntranet(new String(pString, 0, end)))
            { 
                flags |= Flags.IntranetUri;
            }

            if (AllowIdnStatic(syntax, flags)) 
            {
                boolean allAscii = true; 
                boolean atLeastOneIdn = false; 

                String idnValue = DomainNameHelper.IdnEquivalent(pString, start, end, /*ref*/ allAscii, /*ref*/ atLeastOneIdn); 
                String UniEquvlt = DomainNameHelper.UnicodeEquivalent(idnValue, pString, start, end);

                if (!allAscii)
                    flags |= Flags.UnicodeHost; // we have a unicode host 

                if (atLeastOneIdn) 
                    flags |= Flags.IdnHost;   // we have at least one valid idn label 

                if (allAscii && atLeastOneIdn && StaticNotAny(flags, Flags.HasUnicode)) 
                {
                    // original String location changed lazily
                    m_originalUnicodeString = m_String;
                    newHost = m_originalUnicodeString.Substring(0, startInput) + 
                        (StaticInFact(flags, Flags.HasUserInfo) ? userInfoString : null);
                    justNormalized = true; 
                } 
                else if (!iriParsing && (StaticInFact(flags, Flags.UnicodeHost) || StaticInFact(flags, Flags.IdnHost)))
                { 
                    // original String location changed lazily
                    m_originalUnicodeString = m_String;
                    newHost = m_originalUnicodeString.Substring(0, startInput) +
                        (StaticInFact(flags, Flags.HasUserInfo) ? userInfoString : null); 
                    justNormalized = true;
                } 
 
                if (!(allAscii && !atLeastOneIdn))
                { 
                    m_DnsSafeHost = idnValue;
                    newHost += UniEquvlt;
                    justNormalized = true;
                } 
                else if (allAscii && !atLeastOneIdn && iriParsing && hasUnicode)
                { 
                    newHost += UniEquvlt; 
                    justNormalized = true;
                } 
            }
            else
            {
                if (hasUnicode) 
                {
                    String temp = StripBidiControlCharacter(pString, start, end - start); 
                    try{ 
                        newHost += ((temp != null) ? temp.Normalize(NormalizationForm.FormC) : null);
                    } 
                    catch (ArgumentException){
                        err = ParsingError.BadHostName;
                    }
                    justNormalized = true; 
                }
            } 
            flags |= Flags.HostUnicodeNormalized; 
        }
 
        /*unsafe*/ void CheckAuthorityHelperHandleAnyHostIri(char* pString, int startInput, int end,
                                            boolean iriParsing, boolean hasUnicode, UriParser syntax,
                                            /*ref*/ Flags flags, /*ref*/ String newHost, /*ref*/ ParsingError err)
        { 
            if (StaticNotAny(flags, Flags.HostUnicodeNormalized) && (AllowIdnStatic(syntax, flags) ||
                (iriParsing && hasUnicode))) 
            { 
                // Normalize any other host or do idn
                String user = new String(pString, startInput, end - startInput); 

                if (AllowIdnStatic(syntax, flags))
                {
                    boolean allAscii = true; 
                    boolean atLeastOneIdn = false;
 
                    String UniEquvlt = DomainNameHelper.UnicodeEquivalent(pString, startInput, end, /*ref*/ allAscii, 
                        /*ref*/ atLeastOneIdn);
 
                    if (((allAscii && atLeastOneIdn) || !allAscii) && !(iriParsing && hasUnicode))
                    {
                        // original String location changed lazily
                        m_originalUnicodeString = m_String; 
                        newHost = m_originalUnicodeString.Substring(0, startInput);
                        flags |= Flags.HasUnicode; 
                    } 
                    if (atLeastOneIdn || !allAscii)
                    { 
                        newHost += UniEquvlt;
                        String bidiStrippedHost = null;
                        m_DnsSafeHost = DomainNameHelper.IdnEquivalent(pString, startInput, end, /*ref*/  allAscii,
                            /*ref*/ bidiStrippedHost); 
                        if (atLeastOneIdn)
                            flags |= Flags.IdnHost; 
                        if (!allAscii) 
                            flags |= Flags.UnicodeHost;
                    } 
                    else if (iriParsing && hasUnicode)
                    {
                        newHost += user;
 
                    }
                } 
                else 
                {
                    try{ 
                        newHost += user.Normalize(NormalizationForm.FormC);
                    }
                    catch (ArgumentException){
                        err = ParsingError.BadHostName; 
                    }
                } 
 
                flags |= Flags.HostUnicodeNormalized;
            } 
        }

        //
        // 
        // The method checks whether a String needs transformation before going to display or wire
        // 
        // Parameters: 
        // - escaped   true = treat all valid escape sequences as escaped sequences, false = escape all %
        // - delim     a character signalling the termination of the component being checked 
        //
        // When delim=='?', then '#' character is also considered as delimiter additionally to passed '?'.
        //
        // The method pays attention to the dots and slashes so to signal potential Path compression action needed. 
        // Even that is not required for other components, the cycles are still spent (little inefficiency)
        // 
 
        /*internal*/ public /*const*/ static final char c_DummyChar = (char) 0xFFFF;     //An Invalid Unicode character used as a dummy char passed into the parameter
        /*internal*/ public const char c_EOL       = (char) 0xFFFE;     //An Invalid Unicode character used by CheckCanonical as "no delimiter condition" 
        [Flags]
        private enum Check {
            None            = 0x0,
            EscapedCanonical= 0x1, 
            DisplayCanonical= 0x2,
            DotSlashAttn    = 0x4, 
            DotSlashEscaped = 0x80, 
            BackslashInPath = 0x10,
            ReservedFound   = 0x20, 
            NotIriCanonical = 0x40,
            FoundNonAscii =    0x8
        }
 
        //
        // Finds the end of component 
        // 

        private /*unsafe*/ void FindEndOfComponent(String input, /*ref*/ short idx, short end, char delim) 
        {
            fixed (char* str = input)
            {
                FindEndOfComponent(str, /*ref*/ idx, end, delim); 
            }
        } 
        private /*unsafe*/ void FindEndOfComponent(char* str, /*ref*/ short idx, short end, char delim) 
        {
            char c = c_DummyChar; 
            short i=idx;
            for (; i < end; ++i)
            {
                c = str[i]; 
                if (c == delim)
                { 
                    break; 
                }
                else if (delim == '?' && c == '#' && (m_Syntax != null && m_Syntax.InFact(UriSyntaxFlags.MayHaveFragment))) 
                {
                    // this is a special case when deciding on Query/Fragment
                    break;
                } 
            }
            idx = i; 
        } 

        // 
        // Used by ParseRemaining as well by InternalIsWellFormedOriginalString
        //
        private /*unsafe*/ Check CheckCanonical(char* str, /*ref*/ short idx, short end, char delim) {
            Check res = Check.None; 
            boolean needsEscaping = false;
            boolean foundEscaping = false; 
 
            char c = c_DummyChar;
            short i=idx; 
            for (; i < end; ++i)
            {
                c = str[i];
                // Control chars usually should be escaped in any case 
                if (c <= '\x1F' || (c >= '\x7F' && c <= '\x9F'))
                { 
                    needsEscaping = true; 
                    foundEscaping = true;
                    res |= Check.ReservedFound; 
                }
                else if (c > 'z' && c != '~') {
                    if(m_iriParsing){
                        boolean valid = false; 
                        res |= Check.FoundNonAscii;
 
                        if (Char.IsHighSurrogate(c)){ 
                            if ((i + 1) < end){
                                boolean surrPair = false; 
                                valid = CheckIriUnicodeRange(c, str[i + 1], /*ref*/ surrPair, true);
                            }
                        }
                        else{ 
                            valid = CheckIriUnicodeRange(c, true);
                        } 
                        if (!valid) res |= Check.NotIriCanonical; 
                    }
 
                    if (!needsEscaping) needsEscaping = true;
                }
                else if (c == delim) {
                    break; 
                }
                else if (delim == '?' && c == '#' && (m_Syntax != null && m_Syntax.InFact(UriSyntaxFlags.MayHaveFragment))) { 
                    // this is a special case when deciding on Query/Fragment 
                    break;
                } 
                else if (c == '?') {
                    if (IsImplicitFile || (m_Syntax != null && !m_Syntax.InFact(UriSyntaxFlags.MayHaveQuery)
                        && delim != c_EOL))
                    { 
                        // VsWhidbey#87423
                        // If found as reserved this char is not suitable for safe unescaped display 
                        // Will need to escape it when both escaping and unescaping the String 
                        res |= Check.ReservedFound;
                        foundEscaping = true; 
                        needsEscaping = true;
                    }
                }
                else if (c == '#') { 
                    needsEscaping = true;
                    if (IsImplicitFile || (m_Syntax != null && !m_Syntax.InFact(UriSyntaxFlags.MayHaveFragment))) { 
                        // VsWhidbey#87423, 122037 
                        // If found as reserved this char is not suitable for safe unescaped display
                        // Will need to escape it when both escaping and unescaping the String 
                        res |= Check.ReservedFound;
                        foundEscaping = true;
                    }
                } 
                else if (c == '/' || c == '\\') {
                    if ((res & Check.BackslashInPath) == 0 && c == '\\') { 
                        res |= Check.BackslashInPath; 
                    }
                    if ((res & Check.DotSlashAttn) == 0 && i+1 != end && (str[i+1] == '/' || str[i+1] == '\\' )) { 
                        res |= Check.DotSlashAttn;
                    }
                }
                else if (c == '.') { 
                    if ((res & Check.DotSlashAttn) == 0 && i+1 == end || str[i+1] == '.' || str[i+1] == '/'
                        || str[i+1] == '\\' || str[i+1] == '?' || str[i+1] == '#') { 
                        res |= Check.DotSlashAttn; 
                    }
                } 
                else if (!needsEscaping && ((c <= '"' && c != '!') || (c >= '[' && c <= '^') || c == '>'
                    || c == '<' || c == '`')) {
                    needsEscaping = true;
                } 
                else if (c == '%') {
                    if (!foundEscaping) foundEscaping = true; 
                    //try unescape a byte hex escaping 
                    if (i + 2 < end && (c = UriHelper.EscapedAscii(str[i + 1], str[i + 2])) != c_DummyChar)
                    { 
                        if (c == '.' || c == '/' || c == '\\') {
                            res |= Check.DotSlashEscaped;
                        }
                        i+=2; 
                        continue;
                    } 
                    // otherwise we follow to non escaped case 
                    if (!needsEscaping) {
                        needsEscaping = true; 
                    }
                }
            }
 
            if (foundEscaping) {
                if (!needsEscaping) { 
                    res |= Check.EscapedCanonical; 
                }
            } 
            else {
                res |= Check.DisplayCanonical;
                if (!needsEscaping) {
                    res |= Check.EscapedCanonical; 
                }
            } 
            idx = i; 
            return res;
        } 

        //
        // Returns the escaped and canonicalized path String
        // the passed array must be long enough to hold at least 
        // canonical unescaped path representation (allocated by the caller)
        // 
        private /*unsafe*/ char[] GetCanonicalPath(char[] dest, /*ref*/ int pos, UriFormat formatAs) 
        {
 
            if (InFact(Flags.FirstSlashAbsent))
                dest[pos++] = '/';

            if (m_Info.Offset.Path == m_Info.Offset.Query) 
                return dest;
 
            int end = pos; 

            int dosPathIdx = SecuredPathIndex; 

            // Note that unescaping and then escapig back is not transitive hence not safe.
            // We are vulnerable due to the way the UserEscaped flag is processed (see NDPWhidbey#10612 bug).
            // Try to unescape only needed chars. 
            if (formatAs == UriFormat.UriEscaped)
            { 
                if (InFact(Flags.ShouldBeCompressed)) 
                {
                    m_String.CopyTo(m_Info.Offset.Path, dest, end, m_Info.Offset.Query - m_Info.Offset.Path); 
                    end += (m_Info.Offset.Query - m_Info.Offset.Path);

                    // If the path was found as needed compression and contains escaped characters, unescape only
                    // interesting characters (safe) 

                    if (m_Syntax.InFact(UriSyntaxFlags.UnEscapeDotsAndSlashes) && InFact(Flags.PathNotCanonical) 
                        && !IsImplicitFile) 
                    {
                        fixed (char* pdest = dest) 
                        {
                            UnescapeOnly(pdest, pos, /*ref*/ end, '.', '/',
                                m_Syntax.InFact(UriSyntaxFlags.ConvertPathSlashes) ? '\\' : c_DummyChar);
                        } 
                    }
                } 
                else 
                {
                    // 
                    if (InFact(Flags.E_PathNotCanonical) && NotAny(Flags.UserEscaped)) {
                        String str = m_String;

                        // Check on not canonical disk designation like C|\, should be rare, rare case 
                        if (dosPathIdx != 0 && str[dosPathIdx + m_Info.Offset.Path -1] == '|')
                        { 
                            str = str.Remove(dosPathIdx + m_Info.Offset.Path -1, 1); 
                            str = str.Insert(dosPathIdx + m_Info.Offset.Path -1, ":");
                        } 
                        dest = UriHelper.EscapeString(str, m_Info.Offset.Path, m_Info.Offset.Query, dest, /*ref*/ end, true,
                            '?', '#', IsImplicitFile? c_DummyChar: '%');
                    }
                    else { 
                        m_String.CopyTo(m_Info.Offset.Path, dest, end, m_Info.Offset.Query - m_Info.Offset.Path);
                        end += (m_Info.Offset.Query - m_Info.Offset.Path); 
                    } 
                }
            } 
            else
            {
                m_String.CopyTo(m_Info.Offset.Path, dest, end, m_Info.Offset.Query - m_Info.Offset.Path);
                end += (m_Info.Offset.Query - m_Info.Offset.Path); 

                if (InFact(Flags.ShouldBeCompressed)) 
                { 
                    // If the path was found as needed compression and contains escaped characters,
                    // unescape only interesting characters (safe) 

                    if (m_Syntax.InFact(UriSyntaxFlags.UnEscapeDotsAndSlashes) && InFact(Flags.PathNotCanonical)
                        && !IsImplicitFile)
                    { 
                        fixed (char* pdest = dest)
                        { 
                            UnescapeOnly(pdest, pos, /*ref*/ end, '.', '/', 
                                m_Syntax.InFact(UriSyntaxFlags.ConvertPathSlashes) ? '\\' : c_DummyChar);
                        } 
                    }
                }
            }
 
            // Here we already got output data as copied into dest array
            // We just may need more processing of that data 
 
            //
            // if this URI is using 'non-proprietary' disk drive designation, convert to MS-style 
            //
            // (path is already  >= 3 chars if recognized as a DOS-like)
            //
            if (dosPathIdx != 0 && dest[dosPathIdx + pos - 1] == '|') 
                dest[dosPathIdx + pos - 1] = ':';
 
            if (InFact(Flags.ShouldBeCompressed)) 
            {
                // It will also convert back slashes if needed 
                dest = Compress(dest, (short)(pos + dosPathIdx), /*ref*/ end, m_Syntax);
                if (dest[pos] == '\\')
                    dest[pos] = '/';
 
                // Escape path if requested and found as not fully escaped
                if (formatAs == UriFormat.UriEscaped && NotAny(Flags.UserEscaped) && InFact(Flags.E_PathNotCanonical)) { 
                    // 
                    String srcString = new String(dest, pos, end-pos);
                    dest = UriHelper.EscapeString(srcString, 0, end - pos, dest, /*ref*/ pos, true, '?', '#', 
                        IsImplicitFile ? c_DummyChar : '%');
                    end = pos;
                }
            } 
            else if (m_Syntax.InFact(UriSyntaxFlags.ConvertPathSlashes) && InFact(Flags.BackslashInPath))
            { 
                for (int i = pos; i < end; ++i) 
                    if (dest[i] == '\\') dest[i] = '/';
            } 

            if (formatAs != UriFormat.UriEscaped && InFact(Flags.PathNotCanonical))
            {
                UnescapeMode mode; 
                if (InFact(Flags.PathNotCanonical))
                { 
                    switch (formatAs) 
                    {
                    case V1ToStringUnescape: 

                        mode = (InFact(Flags.UserEscaped) ? UnescapeMode.Unescape : UnescapeMode.EscapeUnescape)
                            | UnescapeMode.V1ToStringFlag;
                        if (IsImplicitFile) 
                            mode &= ~UnescapeMode.Unescape;
                        break; 
 
                    case UriFormat.Unescaped:
                        mode = IsImplicitFile ? UnescapeMode.CopyOnly 
                            : UnescapeMode.Unescape | UnescapeMode.UnescapeAll;
                        break;

                    default: // UriFormat.SafeUnescaped 

                        mode = InFact(Flags.UserEscaped)? UnescapeMode.Unescape: UnescapeMode.EscapeUnescape; 
                        if (IsImplicitFile) 
                            mode &= ~UnescapeMode.Unescape;
                        break; 
                    }
                }
                else {
                    mode = UnescapeMode.CopyOnly; 
                }
 
                char[] dest1 = new char[dest.Length]; 
                Buffer.BlockCopy(dest, 0, dest1, 0, end<<1);
                fixed (char *pdest = dest1) 
                {
                    dest = UriHelper.UnescapeString(pdest, pos, end, dest, /*ref*/ pos, '?', '#', c_DummyChar, mode,
                        m_Syntax, false);
                } 
            }
            else 
            { 
                pos = end;
            } 

            return dest;
        }
 
        // works only with ASCII characters, used to partially unescape path before compressing
        private /*unsafe*/ static void UnescapeOnly(char* pch, int start, /*ref*/ int end, char ch1, char ch2, char ch3) { 
            if (end - start < 3) { 
                //no chance that something is escaped
                return; 
            }

            char *pend = pch + end-2;
            pch += start; 
            char *pnew = null;
 
            over: 

            // Just looking for a interested escaped char 
            if (pch >= pend)    goto done;
            if(*pch++ != '%')   goto over;

            char ch = UriHelper.EscapedAscii(*pch++, *pch++); 
            if (!(ch == ch1 || ch == ch2 || ch == ch3)) goto over;
 
            // Here we found something and now start copying the scanned chars 
            pnew = pch-2;
            *(pnew-1) = ch; 

            over_new:

            if (pch >= pend)                goto done; 
            if((*pnew++ = *pch++) != '%')   goto over_new;
 
            ch = UriHelper.EscapedAscii((*pnew++ = *pch++), (*pnew++ = *pch++)); 
            if (!(ch == ch1 || ch == ch2 || ch == ch3)) {
                goto over_new; 
            }

            pnew -= 2;
            *(pnew-1) = ch; 

            goto over_new; 
 
            done:
            pend+=2; 

            if (pnew == null) {
                //nothing was found
                return; 
            }
 
            //the tail may be already processed 
            if(pch == pend) {
                end -= (int) (pch-pnew); 
                return;
            }

            *pnew++ = *pch++; 
            if(pch == pend) {
                end -= (int) (pch-pnew); 
                return; 
            }
            *pnew++ = *pch++; 
            end -= (int) (pch-pnew);
        }

        // 
        //
        // This will compress any "\" "/../" "/./" "///" "/..../" /XXX.../, etc found in the input 
        // 
        // The passed syntax controls whether to use agressive compression or the one specified in RFC 2396
        // 
        //
        private static char[] Compress(char[] dest, short start, /*ref*/ int destLength, UriParser syntax)
        {
            short  slashCount      = 0; 
            short  lastSlash       = 0;
            short  dotCount        = 0; 
            short  removeSegments  = 0; 

            unchecked { 
                //short i == -1 and start == -1 overflow is ok here
                short  i = (short)((short)destLength - (short)1);
                start = (short)(start-1);
 
                for (; i != start ; --i) {
                    char ch = dest[i]; 
                    if (ch == '\\' && syntax.InFact(UriSyntaxFlags.ConvertPathSlashes)) { 
                        dest[i] = ch = '/';
                    } 

                    //
                    // compress multiple '/' for file URI
                    // 
                    if (ch == '/') {
                        ++slashCount; 
                        /* 
                        QFE 4390 - remove the compression of multiple slashes to a single slash
                        if (slashCount > 1) { 
                            continue;
                        }
 			*/
                    } 
                    else {
                        if (slashCount > 1) { 
                            /* 
                            QFE 4390 - remove the compression of multiple slashes to a single slash
                            if (syntax.InFact(UriSyntaxFlags.CanonicalizeAsFilePath)) 
                            {
                                // We saw > 1 slashes so remove all but the last one
                                // dest.Remove(i+1, slashCount -1);
                                Buffer.BlockCopy(dest, (i + slashCount) << 1, dest, (i + 1) << 1, 
                                    (destLength - (i + slashCount)) << 1);
                                destLength -= (slashCount - 1); 
                            } 
			    */
                            // else preserve repeated slashes 
                            lastSlash = (short)(i + 1);
                        }
                        slashCount = 0;
                    } 

                    if (ch == '.') { 
                        ++dotCount; 
                        continue;
                    } 
                    else if (dotCount != 0) {

                        boolean skipSegment = syntax.NotAny(UriSyntaxFlags.CanonicalizeAsFilePath)
                            && (dotCount > 2 || ch != '/' || i == start); 

                        // 
                        // Cases: 
                        // /./                  = remove this segment
                        // /../                 = remove this segment, mark next for removal 
                        // /....x               = DO NOT TOUCH, leave as is
                        // x.../                = DO NOT TOUCH, leave as is, except for V2 legacy mode
                        //
                        if (!skipSegment && ch == '/') { 
                            if ((lastSlash == i + dotCount + 1 // "/..../"
                                    || (lastSlash == 0 && i + dotCount + 1 == destLength)) // "/..." 
                                && (UriParser.ShouldUseLegacyV2Quirks || dotCount <= 2)) { 
                                //
                                //  /./ or /.<eos> or /../ or /..<eos> 
                                //
                                // just reusing a variable slot we perform //dest.Remove(i+1, dotCount + (lastSlash==0?0:1));
                                lastSlash = (short)(i + 1 + dotCount + (lastSlash==0?0:1));
                                Buffer.BlockCopy(dest, lastSlash<<1, dest, (i+1)<<1, (destLength - lastSlash)<<1); 
                                destLength -= (lastSlash-i-1);
 
                                lastSlash = i; 
                                if (dotCount == 2) {
                                    // 
                                    // We have 2 dots in between like /../ or /..<eos>,
                                    // Mark next segment for removal and remove this /../ or /..
                                    //
                                    ++removeSegments; 
                                }
                                dotCount = 0; 
                                continue; 
                            }
                        } 
                        else if (UriParser.ShouldUseLegacyV2Quirks
                            && !skipSegment
                            && (removeSegments == 0)
                            && (lastSlash == i+dotCount+1 || (lastSlash == 0 && i+dotCount+1 == destLength))) { 
                            //
                            // Note if removeSegments!=0, then ignore and remove the whole segment later 
                            // 
                            // x.../  or  x...<eos>
                            // remove trailing dots 
                            //
                            //
                            // just reusing a variable slot we perform //dest.Remove(i+1, dotCount);
                            dotCount = (short)(i + 1 + dotCount); 
                            Buffer.BlockCopy(dest, dotCount<<1, dest, (i+1)<<1, (destLength - dotCount)<<1);
                            destLength -= (dotCount-i-1); 
                            lastSlash = 0;  //the other dots in this segment will stay intact 
                            dotCount = 0;
                            continue; 
                        }
                            // .NET 4.5 no longer removes trailing dots in a path segment x.../  or  x...<eos>
                            dotCount = 0;
 
                        //
                        // Here all other cases go such as 
                        // x.[..]y or /.[..]x or (/x.[...][/] && removeSegments !=0) 
                    }
 
                    //
                    // Now we may want to remove a segment because of previous /../
                    //
                    if (ch == '/') { 
                        if (removeSegments  != 0) {
                            --removeSegments; 
 
                            // just reusing a variable slot we perform //dest.Remove(i+1, lastSlash - i);
                            lastSlash = (short)(lastSlash + 1); 
                            Buffer.BlockCopy(dest, lastSlash<<1, dest, (i+1)<<1, (destLength - lastSlash)<<1);
                            destLength -= (lastSlash-i-1);
                        }
                    lastSlash = i; 
                    }
                } 
 
               start = (short)((short)start + (short)1);
            } //end of unchecked 

            // Dead Code?
            if ((short)destLength > start && syntax.InFact(UriSyntaxFlags.CanonicalizeAsFilePath))
            { 
                if (slashCount > 1) {
		    /* 
                    Buffer.BlockCopy(dest, lastSlash << 1, dest, start << 1, (destLength - lastSlash) << 1); 
                    destLength -= (slashCount - 1);
                    */ 
                    //QFE 4390 - Fall through for compat after not multiple slashes to a single slashl
                }
                else if (removeSegments != 0 && dest[start] != '/') {
                    //remove first not rooted segment 
                    // dest.Remove(i+1, lastSlash - i);
                    lastSlash = (short)(lastSlash + 1); 
                    Buffer.BlockCopy(dest, lastSlash<<1, dest, start<<1, (destLength - lastSlash)<<1); 
                    destLength -= lastSlash;
                } 
                else if (dotCount != 0) {
                    // If final String starts with a segment looking like .[...]/ or .[...]<eos>
                    // then we remove this fisrt segment
                    if (lastSlash == dotCount+1 || (lastSlash == 0 && dotCount + 1 == destLength)) { 
                        //dest.Remove(0, dotCount + (lastSlash==0?0:1));
                        dotCount = (short)(dotCount + (lastSlash==0?0:1)); 
                        Buffer.BlockCopy(dest, dotCount<<1, dest, start<<1, (destLength - dotCount)<<1); 
                        destLength -= dotCount;
                    } 
                }
            }
            return dest;
        } 

        //used by DigestClient 
        /*internal*/ public static final char[] HexLowerChars = { 
                                   '0', '1', '2', '3', '4', '5', '6', '7',
                                   '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' 
                                   };

        /*internal*/ public static int CalculateCaseInsensitiveHashCode(String text)
        { 
            return StringComparer.InvariantCultureIgnoreCase.GetHashCode(text);
        } 
        // 
        // CombineUri
        // 
        //  Given 2 URI strings, combine them into a single resultant URI String
        //
        // Inputs:
        //  <argument>  basePart 
        //      Base URI to combine with
        // 
        //  <argument>  relativePart 
        //      String expected to be relative URI
        // 
        // Assumes:
        //  <basePart> is in canonic form
        //
        // Returns: 
        //  Resulting combined URI String
        // 
        private static String CombineUri(Uri basePart, String relativePart, UriFormat uriFormat) { 
           //NB: relativePart is ensured as not empty by the caller
           //    Another assumption is that basePart is an AbsoluteUri 

           // This method was not optimized for efficiency
           // Means a relative Uri ctor may be relatively slow plus it increases the footprint of the baseUri
 
           char c1 = relativePart[0];
 
//#if !PLATFORM_UNIX 
//           //check a special case for the base as DOS path and a rooted relative String
//           if ( basePart.IsDosPath && 
//               (c1 == '/' || c1 == '\\') &&
//               (relativePart.Length == 1 || (relativePart[1] != '/' && relativePart[1] != '\\')))
//           {
//               // take relative part appended to the base String after the drive letter 
//               int idx = basePart.OriginalString.IndexOf(':');
//               if (basePart.IsImplicitFile) { 
//                   return basePart.OriginalString.Substring(0, idx+1 ) + relativePart; 
//               }
//               // The basePart has explicit scheme (could be not file:), take the DOS drive ':' position 
//               idx = basePart.OriginalString.IndexOf(':', idx+1);
//               return basePart.OriginalString.Substring(0, idx+1 ) + relativePart;
//           }
//#endif // !PLATFORM_UNIX 

           // Check special case for Unc or absolute path in relativePart when base is FILE 
           if (StaticIsFile(basePart.Syntax)) 
           {
 
                if (c1 == '\\' || c1 == '/') {

                    if(relativePart.Length >= 2 && (relativePart[1] == '\\' || relativePart[1] == '/')) {
                        //Assuming relative is a Unc path and base is a file uri. 
                        return basePart.IsImplicitFile? relativePart: "file:" + relativePart;
                    } 
 
                    // here we got an absolute path in relativePart,
                    // For compatibility with V1.0 parser we restrict the compression scope to Unc Share, i.e. \\host\share\ 
                    if (basePart.IsUnc) {
                        String share = basePart.GetParts(UriComponents.Path | UriComponents.KeepDelimiter,
                            UriFormat.Unescaped);
                        for (int i = 1; i < share.Length; ++i) { 
                            if (share[i] == '/') {
                                share = share.Substring(0, i); 
                                break; 
                            }
                        } 
                        if (basePart.IsImplicitFile) {
                            return  @"\\"
                                    + basePart.GetParts(UriComponents.Host, UriFormat.Unescaped)
                                    + share 
                                    + relativePart;
                        } 
                        return  "file://" 
                                + basePart.GetParts(UriComponents.Host, uriFormat)
                                + share 
                                + relativePart;

                    }
                    // It's not obvious but we've checked (for this relativePart format) that baseUti is nor UNC nor DOS path 
                    //
                    // Means base is a Unix style path and, btw, IsImplicitFile cannot be the case either 
                    return "file://" + relativePart; 
               }
           } 

           // If we are here we did not recognize absolute DOS/UNC path for a file: base uri
           // Note that DOS path may still happen in the relativePart and if so it may override the base uri scheme.
 
           boolean convBackSlashes =  basePart.Syntax.InFact(UriSyntaxFlags.ConvertPathSlashes);
 
           String left = null; 

           // check for network or local absolute path 
           if (c1 == '/' || (c1 == '\\' && convBackSlashes)) {
               if (relativePart.Length >= 2 && relativePart[1] == '/') {
                   // got an authority in relative path and the base scheme is not file (checked)
                   return basePart.Scheme + ':' + relativePart; 
               }
 
               // Got absolute relative path, and the base is nor FILE nor a DOS path (checked at the method start) 
               if (basePart.HostType == Flags.IPv6HostType) {
                   left =  basePart.GetParts(UriComponents.Scheme|UriComponents.UserInfo, uriFormat) 
                                    + '[' + basePart.DnsSafeHost + ']'
                                    + basePart.GetParts(UriComponents.KeepDelimiter|UriComponents.Port, uriFormat);
               }
               else { 
                   left =  basePart.GetParts(UriComponents.SchemeAndServer|UriComponents.UserInfo, uriFormat);
               } 
               //VsWhidbey#241426 
               if (convBackSlashes && c1 == '\\')
                   relativePart = '/' + relativePart.Substring(1); 

               return left + relativePart;
           }
 
           // Here we got a relative path
           // Need to run path Compression because this is how relative Uri combining works 
 
           // Take the base part path up to and including the last slash
           left = basePart.GetParts(UriComponents.Path | UriComponents.KeepDelimiter, 
               basePart.IsImplicitFile ? UriFormat.Unescaped : uriFormat);
           int length = left.Length;
           char[] path = new char[length + relativePart.Length];
 
           if (length > 0) {
               left.CopyTo(0, path, 0, length); 
               while(length > 0) { 
                   if (path[--length] == '/') {
                       ++length; 
                       break;
                   }
               }
           } 

           //Append relative path to the result 
           relativePart.CopyTo(0, path, length, relativePart.Length); 

           // Split relative on path and extra (for compression) 
           c1 = basePart.Syntax.InFact(UriSyntaxFlags.MayHaveQuery)? '?': c_DummyChar;

           // The  implcit file check is to avoid a fragment in the implicit file combined uri.
           // The behavior change request is tracked vis VsWhidbey#261387 ans that was approved through VsWhidbey#266417. 
           char c2 = (!basePart.IsImplicitFile && basePart.Syntax.InFact(UriSyntaxFlags.MayHaveFragment)) ? '#' :
               c_DummyChar; 
           String extra = String.Empty; 

           // assuming c_DummyChar may not happen in an unicode uri String 
           if (!(c1 == c_DummyChar && c2 == c_DummyChar)) {
               int i=0;
               for (;i < relativePart.Length; ++i) {
                   if (path[length + i] == c1 || path[length + i] == c2) { 
                       break;
                   } 
               } 
               if (i == 0) {
                   extra = relativePart; 
               }
               else if (i < relativePart.Length) {
                   extra = relativePart.Substring(i);
               } 
               length += i;
           } 
           else { 
               length += relativePart.Length;
           } 

           // Take the base part up to the path
           if (basePart.HostType == Flags.IPv6HostType) {
               if (basePart.IsImplicitFile) { 
                   left =  @"\\[" + basePart.DnsSafeHost + ']';
               } 
               else { 
                   left =  basePart.GetParts(UriComponents.Scheme|UriComponents.UserInfo, uriFormat)
                           + '[' + basePart.DnsSafeHost + ']' 
                           + basePart.GetParts(UriComponents.KeepDelimiter|UriComponents.Port, uriFormat);
               }
           }
           else { 
               if (basePart.IsImplicitFile) {
//#if !PLATFORM_UNIX 
//                   if (basePart.IsDosPath) { 
//                       // The FILE DOS path comes as /c:/path, we have to exclude first 3 chars from compression
//                       path = Compress(path, 3, /*ref*/ length, basePart.Syntax); 
//                       return new String(path, 1, length-1) + extra;
//                   }
//                   else {
//                       left =  @"\\" + basePart.GetParts(UriComponents.Host, UriFormat.Unescaped); 
//                   }
//#else 
                   left =  basePart.GetParts(UriComponents.Host, UriFormat.Unescaped); 
//#endif // !PLATFORM_UNIX
 
               }
               else {
                   left =  basePart.GetParts(UriComponents.SchemeAndServer|UriComponents.UserInfo, uriFormat);
               } 
           }
           //compress the path 
           path = Compress(path, basePart.SecuredPathIndex, /*ref*/ length, basePart.Syntax); 
           return left + new String(path, 0, length) + extra;
        } 

        //
        // PathDifference
        // 
        //  Performs the relative path calculation for MakeRelative()
        // 
        // Inputs: 
        //  <argument>  path1
        //  <argument>  path2 
        //      Paths for which we calculate the difference
        //
        //  <argument>  compareCase
        //      False if we consider characters that differ only in case to be 
        //      equal
        // 
        // Returns: 
        //  A String which is the relative path difference between <path1> and
        //  <path2> such that if <path1> and the calculated difference are used 
        //  as arguments to Combine(), <path2> is returned
        //
        // Throws:
        //  Nothing 
        //
        private static String PathDifference(String path1, String path2, boolean compareCase) { 
 
            int i;
            int si = -1; 

            for (i = 0; (i < path1.Length) && (i < path2.Length); ++i) {
                if ((path1[i] != path2[i])
                    && (compareCase 
                        || (Char.ToLower(path1[i], CultureInfo.InvariantCulture)
                            != Char.ToLower(path2[i], CultureInfo.InvariantCulture)))) 
                { 
                    break;
 
                } else if (path1[i] == '/') {
                    si = i;
                }
            } 

            if (i == 0) { 
                return path2; 
            }
            if ((i == path1.Length) && (i == path2.Length)) { 
                return String.Empty;
            }

            StringBuilder relPath = new StringBuilder(); 
            // Walk down several dirs
            for (; i < path1.Length; ++i) { 
                if (path1[i] == '/') { 
                    relPath.Append("../");
                } 
            }
            // Same path except that path1 ended with a file name and path2 didn't
            if (relPath.Length == 0 && path2.Length - 1 == si)
                return "./"; // Truncate the file name 
            return relPath.ToString() + path2.Substring(si + 1);
        } 
 
        //Used by Uribuilder
        /*internal*/ public boolean HasAuthority { 
            get {
                return InFact(Flags.AuthorityFound);
            }
        } 

        private static final char[] _WSchars = new char[] {' ', '\n', '\r', '\t'}; 
        private static boolean IsLWS(char ch) { 

            return (ch <= ' ') && (ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t'); 
        }

        //Only consider ASCII characters
        private static boolean IsAsciiLetter(char character) { 

            return (character >= 'a' && character <= 'z') || 
                   (character >= 'A' && character <= 'Z'); 
        }
 
        /*internal*/ public static boolean IsAsciiLetterOrDigit(char character) {
            return IsAsciiLetter(character) || (character >= '0' && character <= '9');
        }
 
        //
        // Is this a Bidirectional control char.. These get stripped 
        // 
        /*internal*/ public static boolean IsBidiControlCharacter(char ch)
        { 
            return (ch == '\u200E' /*LRM*/ || ch == '\u200F' /*RLM*/ || ch == '\u202A' /*LRE*/ ||
                    ch == '\u202B' /*RLE*/ || ch == '\u202C' /*PDF*/ || ch == '\u202D' /*LRO*/ ||
                    ch == '\u202E' /*RLO*/);
        } 

        // 
        // Strip Bidirectional control charcters from this String 
        //
        /*internal*/ public static /*unsafe*/ String StripBidiControlCharacter(char* strToClean, int start, int length) 
        {
            if (length <= 0) return "";

            char [] cleanStr = new char[length]; 
            int count = 0;
            for (int i = 0; i < length; ++i){ 
                char c = strToClean[start + i]; 
                if (c < '\u200E' || c > '\u202E' || !IsBidiControlCharacter(c)){
                    cleanStr[count++] = c; 
                }
            }
            return new String(cleanStr, 0, count);
        } 

        // 
        // MakeRelative (toUri) 
        //
        //  Return a relative path which when applied to this Uri would create the 
        //  resulting Uri <toUri>
        //
        // Inputs:
        //  <argument>  toUri 
        //      Uri to which we calculate the transformation from this Uri
        // 
        // Returns: 
        //  If the 2 Uri are common except for a relative path difference, then that
        //  difference, else the display name of this Uri 
        //
        // Throws:
        //  ArgumentNullException, InvalidOperationException
        // 
//        [Obsolete("The method has been deprecated. Please use MakeRelativeUri(Uri uri). http://go.microsoft.com/fwlink/?linkid=14202")]
        public String MakeRelative(Uri toUri) 
        { 
            if ((Object)toUri == null)
                throw new ArgumentNullException("toUri"); 

            if (IsNotAbsoluteUri || toUri.IsNotAbsoluteUri)
                throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));
 
            if ((Scheme == toUri.Scheme) && (Host == toUri.Host) && (Port == toUri.Port))
                return PathDifference(AbsolutePath, toUri.AbsolutePath, !IsUncOrDosPath); 
 
            return toUri.ToString();
        } 

        /// <internalonly/>
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")]
        protected /*virtual*/ void Parse() 
        {
            // [....] cr: In V1-Everett this method if suppressed by the derived class 
            // would lead to an unconstructed Uri instance. 
            // It does not make any sense and violates Fxcop on calling a /*virtual*/ method in the ctor.
            // Should be deprecated and removed asap. 
        }
        /// <internalonly/>
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")]
        protected /*virtual*/ void Canonicalize() 
        {
            // [....] cr: In V1-Everett this method if suppressed by the derived class 
            // would lead to supressing of a path compression 
            // It does not make much sense and violates Fxcop on calling a /*virtual*/ method in the ctor.
            // Should be deprecated and removed asap. 
        }
        /// <internalonly/>
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")]
        protected /*virtual*/ void Escape() 
        {
            // [....] cr: In V1-Everett this method if suppressed by the derived class 
            // would lead to the same effect as dontEscape=true. 
            // It does not make much sense and violates Fxcop on calling a /*virtual*/ method in the ctor.
            // Should be deprecated and removed asap. 
        }
        //
        // Unescape
        // 
        //  Convert any escape sequences in <path>. Escape sequences can be
        //  hex encoded reserved characters (e.g. %40 == '@') or hex encoded 
        //  UTF-8 sequences (e.g. %C4%D2 == 'Latin capital Ligature Ij') 
        //
        /// <internalonly/> 
//        [Obsolete("The method has been deprecated. Please use GetComponents() or static UnescapeDataString() to unescape a Uri component or a String. http://go.microsoft.com/fwlink/?linkid=14202")]
        protected /*virtual*/ String Unescape(String path) {

            // [....] cr: This method is dangerous since it gives path unescaping control 
            // to the derived class without any permission demand.
            // Should be deprecated and removed asap. 
 
            char[] dest = new char[path.Length];
            int count = 0; 
            dest = UriHelper.UnescapeString(path, 0, path.Length, dest, /*ref*/ count, c_DummyChar, c_DummyChar,
                c_DummyChar, UnescapeMode.Unescape | UnescapeMode.UnescapeAll, null, false);
            return new String(dest, 0, count);
        } 

//        [Obsolete("The method has been deprecated. Please use GetComponents() or static EscapeUriString() to escape a Uri component or a String. http://go.microsoft.com/fwlink/?linkid=14202")] 
        protected static String EscapeString(String str) { 

            // [....] cr: This method just does not make sense sa protected 
            // It should go public static asap

            if ((Object)str == null) {
                return String.Empty; 
            }
 
            int destStart = 0; 
            char[] dest = UriHelper.EscapeString(str, 0, str.Length, null, /*ref*/ destStart, true, '?', '#', '%');
            if ((Object)dest == null) 
                return str;
            return new String(dest, 0, destStart);
        }
 
        //
        // CheckSecurity 
        // 
        //  Check for any invalid or problematic character sequences
        // 
        /// <internalonly/>
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")]
        protected /*virtual*/ void CheckSecurity()  {
 
            // [....] cr: This method just does not make sense
            // Should be deprecated and removed asap. 
 
            if (Scheme == "telnet") {
 
                //
                // remove everything after ';' for telnet
                //
 
            }
        } 
 
        //
        // IsReservedCharacter 
        //
        //  Determine whether a character is part of the reserved set
        //
        // Returns: 
        //  true if <character> is reserved else false
        // 
        /// <internalonly/> 
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")]
        protected /*virtual*/ boolean IsReservedCharacter(char character) { 

            // [....] cr: This method just does not make sense as /*virtual*/ protected
            // It should go public static asap
 
            return (character == ';')
                || (character == '/') 
                || (character == ':') 
                || (character == '@')   // OK FS char
                || (character == '&') 
                || (character == '=')
                || (character == '+')   // OK FS char
                || (character == '$')   // OK FS char
                || (character == ',') 
                ;
        } 
 
        //
        // IsExcludedCharacter 
        //
        //  Determine if a character should be exluded from a URI and therefore be
        //  escaped
        // 
        // Returns:
        //  true if <character> should be escaped else false 
        // 
        /// <internalonly/>
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")] 
        protected static boolean IsExcludedCharacter(char character) {

            // [....] cr: This method just does not make sense sa protected
            // It should go public static asap 

            // 
            // the excluded characters... 
            //
 
            return (character <= 0x20)
                || (character >= 0x7f)
                || (character == '<')
                || (character == '>') 
                || (character == '#')
                || (character == '%') 
                || (character == '"') 

                // 
                // the 'unwise' characters...
                //

                || (character == '{') 
                || (character == '}')
                || (character == '|') 
                || (character == '\\') 
                || (character == '^')
                || (character == '[') 
                || (character == ']')
                || (character == '`')
                ;
        } 

        // 
        // IsBadFileSystemCharacter 
        //
        //  Determine whether a character would be an invalid character if used in 
        //  a file system name. Note, this is really based on NTFS rules
        //
        // Returns:
        //  true if <character> would be a treated as a bad file system character 
        //  else false
        // 
//        [Obsolete("The method has been deprecated. It is not used by the system. http://go.microsoft.com/fwlink/?linkid=14202")] 
        protected /*virtual*/ boolean IsBadFileSystemCharacter(char character) {
 
            // [....] cr: This method just does not make sense sa protected /*virtual*/
            // It should go public static asap

            return (character < 0x20) 
                || (character == ';')
                || (character == '/') 
                || (character == '?') 
                || (character == ':')
                || (character == '&') 
                || (character == '=')
                || (character == ',')
                || (character == '*')
                || (character == '<') 
                || (character == '>')
                || (character == '"') 
                || (character == '|') 
                || (character == '\\')
                || (character == '^') 
                ;
        }

 
    } // class Uri
} // namespace System 
 