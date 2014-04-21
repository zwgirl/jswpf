package org.summer.view.widget.markup;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.Uri;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.context.XamlContextStack;
import org.summer.view.widget.xaml.IXamlObjectWriterFactory;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlObjectWriter;
import org.summer.view.widget.xaml.XamlObjectWriterSettings;
import org.summer.view.widget.xaml.XamlSchemaContext;

/*internal*/ public class WpfXamlLoader
{ 
    private static Lazy<XamlMember> XmlSpace = new Lazy<XamlMember>(/*() => new WpfXamlMember(XmlAttributeProperties.XmlSpaceProperty, true) cym comment*/);

    public static Object Load(/*System.Xaml.*/XamlReader xamlReader, boolean skipJournaledProperties, Uri baseUri) 
    {
        XamlObjectWriterSettings settings = XamlReader.CreateObjectWriterSettings(); 
        Object result = WpfXamlLoader.Load(xamlReader, null, skipJournaledProperties, null, settings, baseUri);
        EnsureXmlNamespaceMaps(result, xamlReader.SchemaContext);
        return result;
    } 

    public static Object LoadDeferredContent(/*System.Xaml.*/XamlReader xamlReader, IXamlObjectWriterFactory writerFactory, 
        boolean skipJournaledProperties, Object rootObject, XamlObjectWriterSettings parentSettings, Uri baseUri) 
    {
        XamlObjectWriterSettings settings = XamlReader.CreateObjectWriterSettings(parentSettings); 
        // Don't set settings.RootObject because this isn't the real root
        return Load(xamlReader, writerFactory, skipJournaledProperties, rootObject, settings, baseUri);
    }

    public static Object LoadBaml(/*System.Xaml.*/XamlReader xamlReader, boolean skipJournaledProperties,
        Object rootObject, XamlAccessLevel accessLevel, Uri baseUri) 
    { 
        XamlObjectWriterSettings settings = XamlReader.CreateObjectWriterSettingsForBaml();
        settings.RootObjectInstance = rootObject; 
        settings.AccessLevel = accessLevel;
        Object result = Load(xamlReader, null, skipJournaledProperties, rootObject, settings, baseUri);
        EnsureXmlNamespaceMaps(result, xamlReader.SchemaContext);
        return result; 
    }

    /*internal*/ public static void EnsureXmlNamespaceMaps(Object rootObject, XamlSchemaContext schemaContext) 
    {
        DependencyObject depObj = rootObject as DependencyObject; 
        if (depObj == null)
        {
            return;
        } 
        // If a user passed in custom mappings via XamlTypeMapper, we need to preserve thos
        // in the XmlNamespaceMaps property. Otherwise, we can just leave it empty and let all 
        // type resolutions fall back to the shared SchemaContext. 
        XamlTypeMapperSchemaContext typeMapperContext = schemaContext as XamlTypeMapper.XamlTypeMapperSchemaContext;
        Hashtable namespaceMaps; 
        if (typeMapperContext == null)
        {
            namespaceMaps = new Hashtable();
        } 
        else
        { 
            namespaceMaps = typeMapperContext.GetNamespaceMapHashList(); 
        }
        depObj.SetValue(XmlAttributeProperties.XmlNamespaceMapsProperty, namespaceMaps); 
    }

    private static Object Load(/*System.Xaml.*/XamlReader xamlReader, IXamlObjectWriterFactory writerFactory,
        boolean skipJournaledProperties, Object rootObject, XamlObjectWriterSettings settings, Uri baseUri) 
    {
        XamlObjectWriter xamlWriter = null; 
        XamlContextStack<WpfXamlFrame> stack = new XamlContextStack<WpfXamlFrame>(() => new WpfXamlFrame()); 
        int persistId = 1;

        settings.AfterBeginInitHandler = delegate(Object sender, /*System.Xaml.*/XamlObjectEventArgs args)
        {
            if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose))
            { 
                IXamlLineInfo ixli = xamlReader as IXamlLineInfo;

                int lineNumber = -1; 
                int linePosition = -1;

                if (ixli != null && ixli.HasLineInfo)
                {
                    lineNumber = ixli.LineNumber;
                    linePosition = ixli.LinePosition; 
                }

                EventTrace.EventProvider.TraceEvent( 
                    EventTrace.Event.WClientParseXamlBamlInfo,
                    EventTrace.Keyword.KeywordXamlBaml | EventTrace.Keyword.KeywordPerf, EventTrace.Level.Verbose, 
                    args.Instance == null ? 0 : PerfService.GetPerfElementID(args.Instance),
                    lineNumber,
                    linePosition);
            } 

            UIElement uiElement = args.Instance as UIElement; 
            if (uiElement != null) 
            {
                uiElement.SetPersistId(persistId++); 
            }

            DependencyObject dObject = args.Instance as DependencyObject;
            if (dObject != null && stack.CurrentFrame.XmlnsDictionary != null) 
            {
                XmlnsDictionary dictionary = stack.CurrentFrame.XmlnsDictionary; 
                dictionary.Seal(); 

                XmlAttributeProperties.SetXmlnsDictionary(dObject, dictionary); 
            }

            stack.CurrentFrame.Instance = args.Instance;
        }; 
        if (writerFactory != null)
        { 
            xamlWriter = writerFactory.GetXamlObjectWriter(settings); 
        }
        else 
        {
            xamlWriter = new /*System.Xaml.*/XamlObjectWriter(xamlReader.SchemaContext, settings);
        }

        IXamlLineInfo xamlLineInfo = null;
        try 
        { 
            //Handle Line Numbers
            xamlLineInfo = xamlReader as IXamlLineInfo; 
            IXamlLineInfoConsumer xamlLineInfoConsumer = xamlWriter as IXamlLineInfoConsumer;
            boolean shouldPassLineNumberInfo = false;
            if ((xamlLineInfo != null && xamlLineInfo.HasLineInfo)
                && (xamlLineInfoConsumer != null && xamlLineInfoConsumer.ShouldProvideLineInfo)) 
            {
                shouldPassLineNumberInfo = true; 
            } 

            IStyleConnector styleConnector = rootObject as IStyleConnector; 
            TransformNodes(xamlReader, xamlWriter,
                false /*onlyLoadOneNode*/,
                skipJournaledProperties,
                shouldPassLineNumberInfo, xamlLineInfo, xamlLineInfoConsumer, 
                stack, styleConnector);
            xamlWriter.Close(); 
            return xamlWriter.Result; 
        }
        catch (Exception e) 
        {
            // Don't wrap critical exceptions or already-wrapped exceptions.
            if(MS.Internal.CriticalExceptions.IsCriticalException(e) || !XamlReader.ShouldReWrapException(e, baseUri))
            { 
                throw null ; //cym add null
            } 
            XamlReader.RewrapException(e, xamlLineInfo, baseUri); 
            return null;    // this should never be executed
        } 
    }

    /*internal*/ public static void TransformNodes(/*System.Xaml.*/XamlReader xamlReader, /*System.Xaml.*/XamlObjectWriter xamlWriter,
                                     boolean onlyLoadOneNode, 
                                     boolean skipJournaledProperties,
                                     boolean shouldPassLineNumberInfo, IXamlLineInfo xamlLineInfo, IXamlLineInfoConsumer xamlLineInfoConsumer, 
                                     XamlContextStack<WpfXamlFrame> stack, 
                                     IStyleConnector styleConnector)
    { 
        while (xamlReader.Read())
        {
            if (shouldPassLineNumberInfo)
            { 
                if (xamlLineInfo.LineNumber != 0)
                { 
                    xamlLineInfoConsumer.SetLineInfo(xamlLineInfo.LineNumber, xamlLineInfo.LinePosition); 
                }
            } 

            switch (xamlReader.NodeType)
            {
            case /*System.Xaml.*/XamlNodeType.NamespaceDeclaration: 
                xamlWriter.WriteNode(xamlReader);
                if (stack.Depth == 0 || stack.CurrentFrame.Type != null) 
                { 
                    stack.PushScope();
                    // Need to create an XmlnsDictionary. 
                    // Look up stack to see if we have one earlier
                    //  If so, use that.  Otherwise new a xmlnsDictionary
                    WpfXamlFrame iteratorFrame = stack.CurrentFrame;
                    while (iteratorFrame != null) 
                    {
                        if (iteratorFrame.XmlnsDictionary != null) 
                        { 
                            stack.CurrentFrame.XmlnsDictionary =
                                new XmlnsDictionary(iteratorFrame.XmlnsDictionary); 
                            break;
                        }
                        iteratorFrame = (WpfXamlFrame)iteratorFrame.Previous;
                    } 
                    if (stack.CurrentFrame.XmlnsDictionary == null)
                    { 
                        stack.CurrentFrame.XmlnsDictionary = 
                                 new XmlnsDictionary();
                    } 
                }
                stack.CurrentFrame.XmlnsDictionary.Add(xamlReader.Namespace.Prefix, xamlReader.Namespace.Namespace);
                break;
            case /*System.Xaml.*/XamlNodeType.StartObject: 
                xamlWriter.WriteNode(xamlReader);
                // If there's a frame but no Type, that means there 
                // was a namespace. Just set the Type 
                if (stack.Depth != 0 && stack.CurrentFrame.Type == null)
                { 
                    stack.CurrentFrame.Type = xamlReader.Type;
                }
                else
                { 
                    // Propagate the FreezeFreezable property from the current stack frame
                    stack.PushScope(); 
                    stack.CurrentFrame.Type = xamlReader.Type; 
                    if (stack.PreviousFrame.FreezeFreezable)
                    { 
                        stack.CurrentFrame.FreezeFreezable = true;
                    }
                }
                break; 
            case /*System.Xaml.*/XamlNodeType.GetObject:
                xamlWriter.WriteNode(xamlReader); 
                // If there wasn't a namespace node before this get Object, need to pushScope. 
                if (stack.CurrentFrame.Type != null)
                { 
                    stack.PushScope();
                }
                stack.CurrentFrame.Type = stack.PreviousFrame.Property.Type;
                break; 
            case /*System.Xaml.*/XamlNodeType.EndObject:
                xamlWriter.WriteNode(xamlReader); 
                // Freeze if required 
                if (stack.CurrentFrame.FreezeFreezable)
                { 
                    Freezable freezable = xamlWriter.Result as Freezable;
                    if (freezable != null && freezable.CanFreeze)
                    {
                        freezable.Freeze(); 
                    }
                } 
                DependencyObject dependencyObject = xamlWriter.Result as DependencyObject; 
                if (dependencyObject != null && stack.CurrentFrame.XmlSpace.HasValue)
                { 
                    XmlAttributeProperties.SetXmlSpace(dependencyObject, stack.CurrentFrame.XmlSpace.Value ? "default" : "preserve");
                }
                stack.PopScope();
                break; 
            case /*System.Xaml.*/XamlNodeType.StartMember:
                // ObjectWriter should NOT process PresentationOptions:Freeze directive since it is Unknown 
                // The space directive node stream should not be written because it induces Object instantiation, 
                // and the Baml2006Reader can produce space directives prematurely.
                if (!(xamlReader.Member.IsDirective && xamlReader.Member == XamlReaderHelper.Freeze) && 
                    xamlReader.Member != XmlSpace.Value &&
                    xamlReader.Member != XamlLanguage.Space)
                {
                    xamlWriter.WriteNode(xamlReader); 
                }

                stack.CurrentFrame.Property = xamlReader.Member; 
                if (skipJournaledProperties)
                { 
                    if (!stack.CurrentFrame.Property.IsDirective)
                    {
                        System.Windows.Baml2006.WpfXamlMember wpfMember = stack.CurrentFrame.Property as System.Windows.Baml2006.WpfXamlMember;
                        if (wpfMember != null) 
                        {
                            DependencyProperty prop = wpfMember.DependencyProperty; 

                            if (prop != null)
                            { 
                                FrameworkPropertyMetadata metadata = prop.GetMetadata(stack.CurrentFrame.Type.UnderlyingType) as FrameworkPropertyMetadata;
                                if (metadata != null && metadata.Journal == true)
                                {
                                    // 
                                    int count = 1;
                                    while (xamlReader.Read()) 
                                    { 
                                        switch (xamlReader.NodeType)
                                        { 
                                        case /*System.Xaml.*/XamlNodeType.StartMember:
                                            count++;
                                            break;
                                        case /*System.Xaml.*/XamlNodeType.EndMember: 
                                            count--;
                                            if (count == 0) 
                                            { 
                                                xamlWriter.WriteNode(xamlReader);
                                            } 
                                            break;
                                        }
                                        if (count == 0)
                                            break; 
                                    }
                                    // shouldn't this have been a XamlReader.Skip()? 
                                    System.Diagnostics.Debug.Assert(count == 0, "Mismatch StartMember/EndMember"); 
                                }
                            } 
                        }
                    }
                }
                break; 
            case /*System.Xaml.*/XamlNodeType.EndMember:
                WpfXamlFrame currentFrame = stack.CurrentFrame; 
                XamlMember currentProperty = currentFrame.Property; 
                // ObjectWriter should not process PresentationOptions:Freeze directive nodes since it is unknown
                // The space directive node stream should not be written because it induces Object instantiation, 
                // and the Baml2006Reader can produce space directives prematurely.
                if (!(currentProperty.IsDirective && currentProperty == XamlReaderHelper.Freeze) &&
                    currentProperty != XmlSpace.Value &&
                    currentProperty != XamlLanguage.Space) 
                {
                    xamlWriter.WriteNode(xamlReader); 
                } 
                currentFrame.Property = null;
                break; 
            case /*System.Xaml.*/XamlNodeType.Value:
                if (stack.CurrentFrame.Property.IsDirective && stack.CurrentFrame.Property == XamlLanguage.Shared)
                {
                    boolean isShared; 
                    if (boolean.TryParse(xamlReader.Value as String, out isShared))
                    { 
                        if (!isShared) 
                        {
                            if (!(xamlReader is Baml2006Reader)) 
                            {
                                throw new XamlParseException(SR.Get(SRID.SharedAttributeInLooseXaml));
                            }
                        } 
                    }
                } 
                // ObjectWriter should not process PresentationOptions:Freeze directive nodes since it is unknown 
                if (stack.CurrentFrame.Property.IsDirective && stack.CurrentFrame.Property == XamlReaderHelper.Freeze)
                { 
                    boolean freeze = Convert.ToBoolean(xamlReader.Value, TypeConverterHelper.InvariantEnglishUS);
                    stack.CurrentFrame.FreezeFreezable = freeze;
                    Baml2006Reader bamlReader = xamlReader as System.Windows.Baml2006.Baml2006Reader;
                    if (bamlReader != null) 
                    {
                        bamlReader.FreezeFreezables = freeze; 
                    } 
                }
                // The space directive node stream should not be written because it induces Object instantiation, 
                // and the Baml2006Reader can produce space directives prematurely.
                else if (stack.CurrentFrame.Property == XmlSpace.Value || stack.CurrentFrame.Property == XamlLanguage.Space)
                {
                    if (typeof(DependencyObject).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType)) 
                    {
                        System.Diagnostics.Debug.Assert(xamlReader.Value is String, "XmlAttributeProperties.XmlSpaceProperty has the type String."); 
                        stack.CurrentFrame.XmlSpace = (String)xamlReader.Value == "default"; 
                    }
                } 
                else
                {
                    // Ideally we should check if we're inside FrameworkTemplate's Content and not register those.
                    // However, checking if the instance is null accomplishes the same with a much smaller perf impact. 
                    if (styleConnector != null &&
                        stack.CurrentFrame.Instance != null && 
                        stack.CurrentFrame.Property == XamlLanguage.ConnectionId && 
                        typeof(Style).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                    { 
                        styleConnector.Connect((int)xamlReader.Value, stack.CurrentFrame.Instance);
                    }

                    xamlWriter.WriteNode(xamlReader); 
                }
                break; 
            default: 
                xamlWriter.WriteNode(xamlReader);
                break; 
            }

            //Only do this loop for one node if loadAsync
            if (onlyLoadOneNode) 
            {
                return; 
            } 
        }
    } 
}