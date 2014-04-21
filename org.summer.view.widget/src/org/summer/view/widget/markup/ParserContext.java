package org.summer.view.widget.markup;

import javax.sql.rowset.spi.XmlReader;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.Type;
import org.summer.view.widget.Uri;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.collection.Stack;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.model.TypeDescriptor;
import org.summer.view.widget.reflection.Assembly;
import org.summer.view.widget.xml.XmlNamespaceManager;
    /// <summary>
    ///  Provides all the context information required by Parser 
    /// </summary> 
//#if PBTCOMPILER
//    /*internal*/ public class ParserContext : IUriContext 
//#else
    public class ParserContext implements IUriContext
//#endif
    { 

//#region Public Methods 
 
        ///    <summary>
        ///    Constructor 
        ///    </summary>
        public ParserContext()
        {
            Initialize(); 
        }
 
        // Initialize the ParserContext to a known, default state.  DO NOT wipe out 
        // data that may be able to be shared between seperate parses, such as the
        // xamlTypeMapper and the map table. 
        /*internal*/ public void Initialize()
        {
            _xmlnsDictionary = null;    // created on its first use
//#if !PBTCOMPILER 
//            _nameScopeStack    = null;
//#endif 
            _xmlLang        = String.Empty; 
            _xmlSpace       = String.Empty;
        } 


//#if !PBTCOMPILER
        /// <summary> 
        ///    Constructor that takes the XmlParserContext.
        ///    A parserContext Object will be built based on this. 
        /// </summary> 
        /// <param name="xmlParserContext">xmlParserContext to use</param>
 
        public ParserContext(XmlParserContext xmlParserContext)
        {
            if (xmlParserContext == null)
            { 
                throw new ArgumentNullException( "xmlParserContext" );
            } 
 
            _xmlLang     = xmlParserContext.XmlLang;
 
            TypeConverter typeConverter = TypeDescriptor.GetConverter(typeof(XmlSpace));
            if (typeConverter != null)
                _xmlSpace = (String) typeConverter.ConvertToString(null, TypeConverterHelper.InvariantEnglishUS, xmlParserContext.XmlSpace);
            else 
                _xmlSpace = String.Empty;
 
            _xmlnsDictionary = new XmlnsDictionary() ; 

            if (xmlParserContext.BaseURI != null && xmlParserContext.BaseURI.Length > 0) 
            {
                _baseUri = new Uri(xmlParserContext.BaseURI, UriKind.RelativeOrAbsolute);
            }
 
            XmlNamespaceManager xmlnsManager = xmlParserContext.NamespaceManager;
 
            if (null != xmlnsManager) 
            {
                for/*each*/ (String key : xmlnsManager) 
                {
                    _xmlnsDictionary.Add(key, xmlnsManager.LookupNamespace(key));
                }
            } 
        }
//#endif 
 
//#if !PBTCOMPILER
        /// <summary> 
        /// Constructor overload that takes an XmlReader, in order to
        /// pull the BaseURI, Lang, and Space from it.
        /// </summary>
        /*internal*/ public ParserContext( XmlReader xmlReader ) 
        {
            if( xmlReader.BaseURI != null && xmlReader.BaseURI.Length != 0 ) 
            { 
                BaseUri = new Uri( xmlReader.BaseURI );
            } 

            XmlLang = xmlReader.XmlLang;

            if( xmlReader.XmlSpace != System.Xml.XmlSpace.None ) 
            {
                XmlSpace = xmlReader.XmlSpace.ToString(); 
            } 
        }
//#endif 

//#if !PBTCOMPILER
        /// <summary>
        ///    Constructor that takes the ParserContext. 
        ///    A parserContext Object will be built based on this.
        /// </summary> 
        /// <param name="parserContext">xmlParserContext to use</param> 
        /*internal*/ public ParserContext(ParserContext parserContext)
        { 
            _xmlLang     = parserContext.XmlLang;
            _xmlSpace    = parserContext.XmlSpace;
            _xamlTypeMapper      = parserContext.XamlTypeMapper;
            _mapTable    = parserContext.MapTable; 
            _baseUri     = parserContext.BaseUri;
 
            _rootElement = parserContext._rootElement; 
            if (parserContext._nameScopeStack != null)
                _nameScopeStack = (Stack)parserContext._nameScopeStack.Clone(); 
            else
                _nameScopeStack = null;

            // Don't want to force the lazy init so we just set privates 
            _skipJournaledProperties = parserContext._skipJournaledProperties;
 
            _xmlnsDictionary = null; 

            // when there are no namespace prefix mappings in incoming ParserContext, 
             // we are not going to create an empty XmlnsDictionary.
            if (parserContext._xmlnsDictionary != null &&
                parserContext._xmlnsDictionary.Count > 0)
            { 
                _xmlnsDictionary = new XmlnsDictionary();
 
                XmlnsDictionary xmlDictionaryFrom = parserContext.XmlnsDictionary; 

                if (null != xmlDictionaryFrom) 
                {
                    for/*each*/ (String key : xmlDictionaryFrom.Keys)
                    {
                        _xmlnsDictionary[key] = xmlDictionaryFrom[key]; 
                    }
                } 
            } 
        }
//#endif 

        /// <summary>
        /// Pushes the context scope stack (modifications to the ParserContext only apply to levels below
        /// the modification in the stack, except for the XamlTypeMapper property) 
        /// </summary>
        /*internal*/ public void PushScope() 
        { 
            _repeat++;
            _currentFreezeStackFrame.IncrementRepeatCount(); 

            // Wait till the context needs XmlnsDictionary, create on first use.
            if (_xmlnsDictionary != null)
                _xmlnsDictionary.PushScope(); 
        }
 
        /// <summary> 
        /// Pops the context scope stack
        /// </summary> 
        /*internal*/ public void PopScope()
        {
            // Pop state off of the _langSpaceStack
            if (_repeat > 0) 
            {
                _repeat--; 
            } 
            else
            { 
                if (null != _langSpaceStack && _langSpaceStack.Count > 0)
                {
                    _repeat = (int) _langSpaceStack.Pop();
                    _targetType = (Type) _langSpaceStack.Pop(); 
                    _xmlSpace = (String) _langSpaceStack.Pop();
                    _xmlLang = (String) _langSpaceStack.Pop(); 
                } 
            }
 
            // Pop state off of _currentFreezeStackFrame
            if (!_currentFreezeStackFrame.DecrementRepeatCount())
            {
                // If the end of the current frame has been reached, pop 
                // the next frame off the freeze stack
                _currentFreezeStackFrame = (FreezeStackFrame) _freezeStack.Pop(); 
            } 

            // Wait till the context needs XmlnsDictionary, create on first use. 
            if (_xmlnsDictionary != null)
                _xmlnsDictionary.PopScope();

        } 

        /// <summary> 
        /// XmlNamespaceDictionary 
        /// </summary>
        public XmlnsDictionary  XmlnsDictionary 
        {
            get
            {
                // Entry Point to others, initialize if null. 
                if (_xmlnsDictionary == null)
                    _xmlnsDictionary = new XmlnsDictionary(); 
 
                return _xmlnsDictionary;
            } 
        }

        /// <summary>
        /// XmlLang property 
        /// </summary>
        public String XmlLang 
        { 
            get
            { 
                return _xmlLang;
            }
            set
            { 
                EndRepeat();
                _xmlLang = (null == value ? String.Empty : value); 
            } 
        }
 
        /// <summary>
        /// XmlSpace property
        /// </summary>
        // (Why isn't this of type XmlSpace?) 
        public String XmlSpace
        { 
            get 
            {
                return _xmlSpace; 
            }
            set
            {
                EndRepeat(); 
                _xmlSpace = value;
            } 
        } 

        // 
        // TargetType
        //
        // Keep track of the Style/Template TargetType's in the current context.  This allows Setters etc
        // to interpret properties without walking up the reader stack to see it.  This is /*internal*/ public and 
        // hard-coded to target type, but the intent in the future is to generalize this so that we don't
        // have to have the custom parser, and so that the designer can provide the same contextual information. 
        // 
        /*internal*/ public Type TargetType
        { 
            get
            {
                return _targetType;
            } 

//#if !PBTCOMPILER 
            set 
            {
                EndRepeat(); 
                _targetType = value;
            }
//#endif
        } 

        // Items specific to XAML 
 
        /// <summary>
        ///  XamlTypeMapper that should be used when resolving XML 
        /// </summary>
        public XamlTypeMapper XamlTypeMapper
        {
            get 
            {
                return _xamlTypeMapper ; 
            } 
            set
            { 
                // The BamlMapTable must always be kept in [....] with the XamlTypeMapper.  If
                // the XamlTypeMapper changes, then the map table must also be reset.
                if (_xamlTypeMapper != value)
                { 
                    _xamlTypeMapper = value;
                    _mapTable = new BamlMapTable(value); 
                    _xamlTypeMapper.MapTable = _mapTable; 
                }
            } 
        }
//#if !PBTCOMPILER
        /// <summary>
        ///  Gets or sets the list of INameScopes in parent chain 
        /// </summary>
        /*internal*/ public Stack NameScopeStack 
        { 
            get
            { 
               if (_nameScopeStack == null)
                   _nameScopeStack = new Stack(2);

               return _nameScopeStack; 
            }
        } 
//#endif 

        /// <summary> 
        ///    Gets or sets the base Uri
        /// </summary>
        public Uri BaseUri
        { 
            get
            { 
                return _baseUri ; 
            }
            set 
            {
                _baseUri = value;
            }
        } 

//#if !PBTCOMPILER 
        /// <summary> 
        /// Should DependencyProperties marked with the Journal metadata flag be set or skipped?
        /// </summary> 
        /// <value></value>
        /*internal*/ public boolean SkipJournaledProperties
        {
            get { return _skipJournaledProperties; } 
            set { _skipJournaledProperties = value; }
        } 
 
        //
        // The Assembly which hosts the Baml stream. 
        //
        /// <SecurityNote>
        ///     Critical - because it sets the value of the _streamCreatedAssembly field, and that is
        ///                SecurityCritical Data as this field is used by the BamlRecordReader to 
        ///                allow legitimate /*internal*/ public types in Partial Trust.
        /// </SecurityNote> 
        /*internal*/ public Assembly StreamCreatedAssembly 
        {
            get { return _streamCreatedAssembly.Value; } 

//            [SecurityCritical]
            set { _streamCreatedAssembly.Value = value; }
        } 
//#endif
 
        /// <summary> 
        ///    Operator for Converting a ParserContext to an XmlParserContext
        /// </summary> 
        /// <param name="parserContext">ParserContext to Convert</param>
        /// <returns>XmlParserContext</returns>
        public static /*implicit*/ operator XmlParserContext(ParserContext parserContext)
        { 
            return ParserContext.ToXmlParserContext(parserContext);
        } 
 

        /// <summary> 
        ///    Operator for Converting a ParserContext to an XmlParserContext
        /// </summary>
        /// <param name="parserContext">ParserContext to Convert</param>
        /// <returns>XmlParserContext</returns> 
        public static XmlParserContext ToXmlParserContext(ParserContext parserContext)
        { 
            if (parserContext == null) 
            {
                throw new ArgumentNullException( "parserContext" ); 
            }

            XmlNamespaceManager xmlnsMgr = new XmlNamespaceManager(new NameTable());
            XmlSpace xmlSpace = System.Xml.XmlSpace.None; 

            if (parserContext.XmlSpace != null && parserContext.XmlSpace.Length != 0) 
            { 
                TypeConverter typeConverter = TypeDescriptor.GetConverter(typeof(System.Xml.XmlSpace));
                if (null != typeConverter) 
                {
                    try
                    {
                        xmlSpace = (System.Xml.XmlSpace)typeConverter.ConvertFromString(null, TypeConverterHelper.InvariantEnglishUS, parserContext.XmlSpace); 
                    }
                    catch (System.FormatException)  // If it's not a valid space value, ignore it 
                    { 
                        xmlSpace = System.Xml.XmlSpace.None;
                    } 
                }
            }

            // We start getting Keys list only if we have non-empty dictionary 

            if (parserContext._xmlnsDictionary != null) 
            { 
                for/*each*/ (String key : parserContext._xmlnsDictionary.Keys)
                { 
                    xmlnsMgr.AddNamespace(key, parserContext._xmlnsDictionary[key]);
                }
            }
 
            XmlParserContext xmlParserContext = new XmlParserContext(null, xmlnsMgr, parserContext.XmlLang, xmlSpace);
            if( parserContext.BaseUri == null) 
            { 
                xmlParserContext.BaseURI = null;
            } 
            else
            {
                String serializedSafe = parserContext.BaseUri.GetComponents(UriComponents.SerializationInfoString, UriFormat.SafeUnescaped);
                Uri sameUri = new Uri(serializedSafe); 
                String cannonicalString =  sameUri.GetComponents(UriComponents.SerializationInfoString, UriFormat.UriEscaped);
                xmlParserContext.BaseURI = cannonicalString; 
            } 

            return xmlParserContext; 
        }

//#endregion Public Methods
 
//#region Internal
 
 
        // Reset stack to default state
        private void EndRepeat() 
        {
            if (_repeat > 0)
            {
                if (null == _langSpaceStack) 
                {
                    _langSpaceStack = new Stack(1); 
                } 

                _langSpaceStack.Push(XmlLang); 
                _langSpaceStack.Push(XmlSpace);
                _langSpaceStack.Push(TargetType);
                _langSpaceStack.Push(_repeat);
                _repeat = 0; 
            }
        } 
 
        /// <summary>
        /// LineNumber for the first character in the given 
        /// stream. This is used when parsing a section of a larger file so
        /// that proper line number in the overall file can be calculated.
        /// </summary>
        /*internal*/ public int LineNumber 
        {
            get { return _lineNumber; } 
//#if !PBTCOMPILER 
            set { _lineNumber = value; }
//#endif 
        }


        /// <summary> 
        /// LinePosition for the first character in the given
        /// stream. This is used when parsing a section of a larger file so 
        /// that proper line positions in the overall file can be calculated. 
        /// </summary>
        /*internal*/ public int LinePosition 
        {
            get { return _linePosition; }
//#if !PBTCOMPILER
            set { _linePosition = value; } 
//#endif
        } 
 
//#if !PBTCOMPILER
        /*internal*/ public boolean IsDebugBamlStream 
        {
            get { return _isDebugBamlStream; }
            set { _isDebugBamlStream = value; }
        } 

        /// <summary> 
        /// Gets or sets the Object at the root of the portion of the tree 
        /// currently being parsed.  Note that this may not be the very top of the tree
        /// if the parsing operation is scoped to a specific subtree, such as in Style 
        /// parsing.
        /// </summary>
        /*internal*/ public Object RootElement
        { 
            get { return _rootElement; }
            set { _rootElement = value; } 
        } 

        // If this is false (default), then the parser does not own the stream and so if 
        // it has any defer loaded content, it needs to copy it into a byte array since
        // the owner\caller will close the stream when parsing is complete. Currently, this
        // is set to true only by the theme engine since the stream is a system-wide resource
        // an dso will always be open for teh lifetime of the process laoding the theme and so 
        // it can be re-used for perf reasons.
        /*internal*/ public boolean OwnsBamlStream 
        { 
            get { return _ownsBamlStream; }
            set { _ownsBamlStream = value; } 
        }
//#endif

        /// <summary> 
        /// Allows sharing a map table between instances of BamlReaders and Writers.
        /// </summary> 
 
        /*internal*/ public BamlMapTable MapTable
        { 
            get { return _mapTable; }
//#if !PBTCOMPILER
            set
            { 
                // The XamlTypeMapper and the map table must always be kept in [....].  If the
                // map table changes, update the XamlTypeMapper also 
                if (_mapTable != value) 
                {
                    _mapTable = value; 
                    _xamlTypeMapper = _mapTable.XamlTypeMapper;
                    _xamlTypeMapper.MapTable = _mapTable;
                }
            } 
//#endif
        } 
 
//#if !PBTCOMPILER
 


        /*internal*/ public IStyleConnector StyleConnector
        { 
            get { return _styleConnector; }
            set { _styleConnector = value; } 
        } 

        // Keep a cached ProvideValueProvider so that we don't have to keep re-creating one. 
        /*internal*/ public ProvideValueServiceProvider ProvideValueProvider
        {
            get
            { 
                if (_provideValueServiceProvider == null)
                { 
                    _provideValueServiceProvider = new ProvideValueServiceProvider(this); 
                }
 
                return _provideValueServiceProvider;
            }
        }
 
        /// <summary>
        /// This is used to resolve a StaticResourceId record within a deferred content 
        /// section against a StaticResourceExtension on the parent dictionary. 
        /// </summary>
        /*internal*/ public List<Object[]> StaticResourcesStack 
        {
            get
            {
                if (_staticResourcesStack == null) 
                {
                    _staticResourcesStack = new List<Object[]>(); 
                } 

                return _staticResourcesStack; 
            }
        }

        /// <summary> 
        /// Says if we are we currently loading deferred content
        /// </summary> 
        /*internal*/ public boolean InDeferredSection 
        {
            get { return (_staticResourcesStack != null && _staticResourcesStack.Count > 0); } 
        }
//#endif

        // Return a new Parser context that has the same instance variables as this instance, with 
        // only scope dependent variables deep copied.  Variables that are not dependent on scope
        // (such as the baml map table) are not deep copied. 
 
//#if !PBTCOMPILER
        /*internal*/ public ParserContext ScopedCopy() 
        {
            return ScopedCopy( true /* copyNameScopeStack */ );
        }
//#endif 

//#if !PBTCOMPILER 
        /// <SecurityNote> 
        ///     Critical - because it sets _streamCreatedAssembly on the ParserContext, and that is
        ///                SecurityCritical Data as this field is used by the BamlRecordReader to 
        ///                allow legitimate /*internal*/ public types in Partial Trust.
        ///     Safe - because it gets this value from a copy of itself that gets it from a stream that
        ///            implements an /*internal*/ public IStreamInfo interface and IStreamInfo.Assembly is set\
        ///            by the ResourceContainer code that is SecurityCritical, but treated as safe. 
        /// </SecurityNote>
//        [SecurityCritical, SecurityTreatAsSafe] 
        /*internal*/ public ParserContext ScopedCopy(boolean copyNameScopeStack) 
        {
            ParserContext context = new ParserContext(); 

            context._baseUri = _baseUri;
            context._skipJournaledProperties = _skipJournaledProperties;
            context._xmlLang = _xmlLang; 
            context._xmlSpace = _xmlSpace;
            context._repeat = _repeat; 
            context._lineNumber = _lineNumber; 
            context._linePosition = _linePosition;
            context._isDebugBamlStream = _isDebugBamlStream; 
            context._mapTable = _mapTable;
            context._xamlTypeMapper = _xamlTypeMapper;
            context._targetType = _targetType;
 
            context._streamCreatedAssembly.Value = _streamCreatedAssembly.Value;
            context._rootElement = _rootElement; 
            context._styleConnector = _styleConnector; 

            // Copy the name scope stack, if necessary. 

            if (_nameScopeStack != null && copyNameScopeStack)
                context._nameScopeStack = (_nameScopeStack != null) ? (Stack)_nameScopeStack.Clone() : null;
            else 
                context._nameScopeStack = null;
 
            // Deep copy only selected scope dependent instance variables 
            context._langSpaceStack = (_langSpaceStack != null) ? (Stack)_langSpaceStack.Clone() : null;
 
            if (_xmlnsDictionary != null)
                context._xmlnsDictionary = new XmlnsDictionary(_xmlnsDictionary);
            else
                context._xmlnsDictionary = null; 

            context._currentFreezeStackFrame = _currentFreezeStackFrame; 
            context._freezeStack = (_freezeStack != null) ? (Stack) _freezeStack.Clone() : null; 

            return context; 
        }
//#endif

        // 
        // This is called by a user of a parser context when it is a good time to drop unnecessary
        // references (today, just an empty stack). 
        // 

//#if !PBTCOMPILER 
        /*internal*/ public void TrimState()
        {

                if( _nameScopeStack != null && _nameScopeStack.Count == 0 ) 
                {
                    _nameScopeStack = null; 
                } 

        } 
//#endif

        // Return a new Parser context that has the same instance variables as this instance,
        // will all scoped and non-scoped complex properties deep copied. 
//#if !PBTCOMPILER
        /*internal*/ public ParserContext Clone() 
        { 
            ParserContext context = ScopedCopy();
 
            // Deep copy only selected instance variables
            context._mapTable = (_mapTable != null) ? _mapTable.Clone() : null;
            context._xamlTypeMapper = (_xamlTypeMapper != null) ? _xamlTypeMapper.Clone() : null;
 
            // Connect the XamlTypeMapper and bamlmaptable
            context._xamlTypeMapper.MapTable = context._mapTable; 
            context._mapTable.XamlTypeMapper = context._xamlTypeMapper; 

            return context; 
        }
//#endif

//#if !PBTCOMPILER 
        // Set/Get whether or not Freezables within the current scope
        // should be Frozen. 
        /*internal*/ public boolean FreezeFreezables 
        {
            get 
            {
                return _currentFreezeStackFrame.FreezeFreezables;
            }
 
            set
            { 
                // If the freeze flag isn't actually changing, we don't need to 
                // register a change
                if (value != _currentFreezeStackFrame.FreezeFreezables) 
                {
                    // When this scope was entered the repeat count was initially incremented,
                    // indicating no _freezeFreezables state changes within this scope.
                    // 
                    // Now that a state change has been found, we need to replace that no-op with
                    // a directive to restore the old state by un-doing the increment 
                    // and pushing the stack frame 
//#if DEBUG
                    boolean canDecrement = 
//#endif
                    _currentFreezeStackFrame.DecrementRepeatCount();
//#if DEBUG
                    // We're replacing a no-op with a state change.  Detect if we accidently 
                    // start replacing actual state changes.  This might happen if we allowed
                    // FreezeFreezable to be set twice within the same scope, for 
                    // example. 
                    Debug.Assert(canDecrement);
//#endif 
                    if (_freezeStack == null)
                    {
                        // Lazily allocate a _freezeStack if this is the first
                        // state change. 
                        _freezeStack = new Stack();
                    } 
 
                    // Save the old frame
                    _freezeStack.Push(_currentFreezeStackFrame); 

                    // Set the new frame
                    _currentFreezeStackFrame.Reset(value);
                } 
            }
        } 
 
        /*internal*/ public boolean TryCacheFreezable(String value, Freezable freezable)
        { 
            if (FreezeFreezables)
            {
                if (freezable.CanFreeze)
                { 
                    if (!freezable.IsFrozen)
                    { 
                        freezable.Freeze(); 
                    }
                    if (_freezeCache == null) 
                    {
                        _freezeCache = new Dictionary<String, Freezable>();
                    }
                    _freezeCache.Add(value, freezable); 
                    return true;
                } 
            } 

            return false; 
        }

        /*internal*/ public Freezable TryGetFreezable(String value)
        { 
            Freezable freezable = null;
            if (_freezeCache != null) 
            { 
                _freezeCache.TryGetValue(value, /*out*/ freezable);
            } 

            return freezable;
        }
//#endif 

//#endregion Internal 
 
//#region Date
 
        private XamlTypeMapper          _xamlTypeMapper;
        private Uri                     _baseUri;

        private XmlnsDictionary         _xmlnsDictionary; 
        private String                  _xmlLang        = String.Empty;
        private String                  _xmlSpace       = String.Empty; 
        private Stack                   _langSpaceStack; 
        private int                     _repeat;
        private Type                    _targetType; 

//#if !PBTCOMPILER
        private boolean                    _skipJournaledProperties;
        private SecurityCriticalDataForSet<Assembly> _streamCreatedAssembly; 
        private boolean                    _ownsBamlStream;
        private ProvideValueServiceProvider _provideValueServiceProvider; 
        private IStyleConnector _styleConnector; 
        private Stack                   _nameScopeStack;
        private List<Object[]>          _staticResourcesStack; 

        Object                                      _rootElement;  // RootElement for the Page scoping [temporary, should be
        // something like page name or baseUri]
 
//#endif
 
        // Struct that maintains both the freezeFreezable state & stack depth 
        // between freezeFreezable state changes
        private class FreezeStackFrame 
        {
            /*internal*/ public void IncrementRepeatCount() { _repeatCount++; }

            // Returns false when the count reaches 0 such that the decrement can not occur 
            /*internal*/ public boolean DecrementRepeatCount()
            { 
                if (_repeatCount > 0) 
                {
                    _repeatCount--; 
                    return true;
                }
                else
                { 
                    return false;
                } 
            } 

//#if !PBTCOMPILER 
            // Accessors for private state
            /*internal*/ public boolean FreezeFreezables
            {
                get { return _freezeFreezables; } 
            }
 
            // Reset's this frame to a new scope.  Only used with _currentFreezeStackFrame. 
            /*internal*/ public void Reset(boolean freezeFreezables)
            { 
                _freezeFreezables = freezeFreezables;
                _repeatCount = 0;
            }
 
            // Whether or not Freezeables with the current scope should be Frozen
            private boolean _freezeFreezables; 
 
//#endif
 
            // The number of frames until the next state change.
            // We need to know how many times PopScope() is called until the
            // state changes.  That information is tracked by _repeatCount.
            private int _repeatCount; 
        }
 
        // First frame is maintained off of the _freezeStack to avoid allocating 
        // a Stack<FreezeStackFlag> for the common case where Freeze isn't specified.
        FreezeStackFrame _currentFreezeStackFrame; 

//#if !PBTCOMPILER
        // When cloning, it isn't necessary to copy this cache of freezables.
        // This cache allows frozen freezables to use a shared instance and save on memory. 
        private Dictionary<String, Freezable> _freezeCache;
//#endif 
 
        private Stack _freezeStack = null;
 
        private int _lineNumber = 0;    // number of lines between the start of the file and
                                        // our starting point (the starting point of this context)
        private int _linePosition=0;      // default start ot left of first character which is a zero
        private BamlMapTable _mapTable; 
//#if !PBTCOMPILER
        private boolean _isDebugBamlStream = false; 
//#endif 
//#endregion Data
    } 