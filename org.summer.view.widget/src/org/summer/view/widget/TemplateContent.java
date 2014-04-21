package org.summer.view.widget;

import org.summer.view.widget.baml2006.WpfXamlMember;
import org.summer.view.widget.collection.FrugalObjectList;
import org.summer.view.widget.collection.FrugalStructList;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.context.XamlContextStack;
import org.summer.view.widget.context.XamlFrame;
import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.widget.controls.GridViewRowPresenter;
import org.summer.view.widget.controls.ItemsPanelTemplate;
import org.summer.view.widget.controls.Panel;
import org.summer.view.widget.data.BindingBase;
import org.summer.view.widget.markup.DynamicResourceExtension;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.markup.StaticResourceExtension;
import org.summer.view.widget.markup.StaticResourceHolder;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.permission.XamlLoadPermission;
import org.summer.view.widget.utils.ItemStructMap;
import org.summer.view.widget.xaml.IRootObjectProvider;
import org.summer.view.widget.xaml.IXamlIndexingReader;
import org.summer.view.widget.xaml.IXamlObjectWriterFactory;
import org.summer.view.widget.xaml.NamespaceDeclaration;
import org.summer.view.widget.xaml.XamlLanguage;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlNodeList;
import org.summer.view.widget.xaml.XamlNodeType;
import org.summer.view.widget.xaml.XamlObjectWriter;
import org.summer.view.widget.xaml.XamlObjectWriterSettings;
import org.summer.view.widget.xaml.XamlParseException;
import org.summer.view.widget.xaml.XamlReader;
import org.summer.view.widget.xaml.XamlSchemaContext;
import org.summer.view.widget.xaml.XamlType;
import org.summer.view.widget.xaml.XamlWriter;
import org.summer.view.widget.xaml.permissions.XamlAccessLevel;
import org.summer.view.window.DeferredResourceReference;

//TemplateContent is meant to hold any data that is needed during TemplateLoad and TemplateApply.
// _templateLoadData holds all other data.
//[XamlDeferLoad(typeof(TemplateContentLoader), typeof(FrameworkElement))]
public class TemplateContent 
{
    /*internal*/ class Frame extends XamlFrame 
    { 
        private FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> _namespaces;
        private /*System.Xaml.*/XamlType _xamlType; 

        public Frame() { }

        public XamlType Type 
        {
            get { return _xamlType; } 
            set 
            {
                // can't change the type (except from null) 
//                Debug.Assert(_xamlType == null);

                _xamlType = value;
            } 
        }

        public XamlMember Property { get; set; } 
        public String Name { get; set; }
        public boolean NameSet { get; set; } 
        public boolean IsInNameScope { get; set; }
        public boolean IsInStyleOrTemplate { get; set; }
        public Object Instance { get; set; }

        //ContentPresenter
        public boolean ContentSet { get; set; } 
        public boolean ContentSourceSet { get; set; } 
        public String ContentSource { get; set; }
        public boolean ContentTemplateSet { get; set; } 
        public boolean ContentTemplateSelectorSet { get; set; }
        public boolean ContentStringFormatSet { get; set; }

        //GridViewRowPresenter 
        public boolean ColumnsSet { get; set; }

        public /*override*/ void Reset() 
        {
            _xamlType = null; 
            Property = null;
            Name = null;
            NameSet = false;
            IsInNameScope = false; 
            Instance = null;
            ContentSet = false; 
            ContentSourceSet = false; 
            ContentSource = null;
            ContentTemplateSet = false; 
            ContentTemplateSelectorSet = false;
            ContentStringFormatSet = false;
            IsInNameScope = false;
            if (HasNamespaces) 
            {
                _namespaces = null; 
            } 
        }

        public FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> Namespaces
        {
            get
            { 
                if (_namespaces == null)
                { 
                    _namespaces = new FrugalObjectList</*System.Xaml.*/NamespaceDeclaration>(); 
                }
                return _namespaces; 
            }
        }

        public boolean HasNamespaces { get { return _namespaces != null && _namespaces.Count > 0; } } 

        public /*override*/ String ToString() 
        { 
            String type = (this.Type == null) ? String.Empty : this.Type.Name;
            String prop = (this.Property == null) ? "-" : this.Property.Name; 
            String inst = (Instance == null) ? "-" : "*";
            String res = String.Format(CultureInfo.InvariantCulture,
                "{0}.{1} inst={2}", type, prop, inst);
            return res; 
        }
    } 

    /*internal*/ class StackOfFrames extends XamlContextStack<Frame>
    { 
        public StackOfFrames()  { base(()=>new Frame()); }

        public void Push(/*System.Xaml.*/XamlType xamlType, String name)
        { 
            boolean isInNameScope = false;
            boolean isInStyleOrTemplate = false; 

            if (Depth > 0)
            { 
                isInNameScope = CurrentFrame.IsInNameScope || (CurrentFrame.Type != null && FrameworkTemplate.IsNameScope(CurrentFrame.Type));
                isInStyleOrTemplate = CurrentFrame.IsInStyleOrTemplate ||
                    (CurrentFrame.Type != null &&
                        (typeof(FrameworkTemplate).IsAssignableFrom(CurrentFrame.Type.UnderlyingType) || 
                         typeof(Style).IsAssignableFrom(CurrentFrame.Type.UnderlyingType)));
            } 

            if (Depth == 0 || CurrentFrame.Type != null)
            { 
                super.PushScope();
            }

            CurrentFrame.Type = xamlType; 
            CurrentFrame.Name = name;
            CurrentFrame.IsInNameScope = isInNameScope; 
            CurrentFrame.IsInStyleOrTemplate = isInStyleOrTemplate; 
        }

        public void AddNamespace(/*System.Xaml.*/NamespaceDeclaration nsd)
        {
            boolean isInNameScope = false;
            boolean isInStyleOrTemplate = false; 

            if (Depth > 0) 
            { 
                isInNameScope = CurrentFrame.IsInNameScope || (CurrentFrame.Type != null && FrameworkTemplate.IsNameScope(CurrentFrame.Type));
                isInStyleOrTemplate = CurrentFrame.IsInStyleOrTemplate || 
                    (CurrentFrame.Type != null &&
                        (typeof(FrameworkTemplate).IsAssignableFrom(CurrentFrame.Type.UnderlyingType) ||
                         typeof(Style).IsAssignableFrom(CurrentFrame.Type.UnderlyingType)));
            } 

            if (Depth == 0 || CurrentFrame.Type != null) 
            { 
                super.PushScope();
            } 

            CurrentFrame.Namespaces.Add(nsd);
            CurrentFrame.IsInNameScope = isInNameScope;
            CurrentFrame.IsInStyleOrTemplate = isInStyleOrTemplate; 
        }

        public FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> InScopeNamespaces 
        {
            get 
            {
                FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> allNamespaces = null;
                Frame iteratorFrame = this.CurrentFrame;

                while (iteratorFrame != null)
                { 
                    if (iteratorFrame.HasNamespaces) 
                    {
                        if (allNamespaces == null)  // late allocation cause there is often nothing. 
                        {
                            allNamespaces = new FrugalObjectList</*System.Xaml.*/NamespaceDeclaration>();
                        }
                        for (int idx = 0; idx < iteratorFrame.Namespaces.Count; idx++) 
                        {
                            allNamespaces.Add(iteratorFrame.Namespaces[idx]); 
                        } 
                    }
                    iteratorFrame = (Frame)iteratorFrame.Previous; 
                }
                return allNamespaces;
            }
        } 
    }

    /// <SecurityNote> 
    /// Critical: Sets critical property LoadPermission so we can assert the right permission
    ///           when instantiating the template. 
    ///           Sets critical field _templateLoadData.Reader, which needs to be kept in [....] with LoadPermission.
    /// Safe: Demands the requested permission before setting the fields. Sets both fields together
    ///       so they stay in [....].
    /// </SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe]
    /*internal*/public TemplateContent(/*System.Xaml.*/XamlReader xamlReader, IXamlObjectWriterFactory factory, 
        IServiceProvider context) 
    {
        TemplateLoadData = new TemplateLoadData(); 
        ObjectWriterFactory = factory;
        SchemaContext = xamlReader.SchemaContext;
        ObjectWriterParentSettings = factory.GetParentSettings();

        XamlAccessLevel accessLevel = ObjectWriterParentSettings.AccessLevel;
        if (accessLevel != null) 
        { 
            XamlLoadPermission loadPermission = new XamlLoadPermission(accessLevel);
            loadPermission.Demand(); 
            LoadPermission = loadPermission;
        }
        TemplateLoadData.Reader = xamlReader;

        Initialize(context);
    } 

    private void Initialize(IServiceProvider context)
    { 
        XamlObjectWriterSettings settings = org.summer.view.widget.markup.XamlReader.
            CreateObjectWriterSettings(ObjectWriterParentSettings);
        settings.AfterBeginInitHandler = new /*cym add new*/ delegate(Object sender, /*System.Xaml.*/XamlObjectEventArgs args)
        { 
            //In several situations this even will happen with Stack == null.
            //If this event was on the XOW, perhaps we could stop listening in some circumstances? 
            if (Stack != null && Stack.Depth > 0) 
            {
                Stack.CurrentFrame.Instance = args.Instance; 
            }
        };
        settings.SkipProvideValueOnRoot = true;
        TemplateLoadData.ObjectWriter = ObjectWriterFactory.GetXamlObjectWriter(settings); 
        TemplateLoadData.ServiceProviderWrapper = new ServiceProviderWrapper(context, SchemaContext);

        IRootObjectProvider irop = context.GetService(typeof(IRootObjectProvider)) as IRootObjectProvider; 
        if (irop != null)
        { 
            TemplateLoadData.RootObject = irop.RootObject;
        }
    }

    // This needs to take the XamlReader passed in and sort it into things that
    // can be shared and can't be shared.  Anything that can't be shared 
    // needs to be stored away so that we can instantiate at template load time. 
    // Shared values need to be stored into the shared value tables.
    /*internal*/public void ParseXaml() 
    {
//        Debug.Assert(TemplateLoadData.Reader != null);
        StackOfFrames stack = new StackOfFrames();

        TemplateLoadData.ServiceProviderWrapper.Frames = stack;

        OwnerTemplate.StyleConnector = TemplateLoadData.RootObject as IStyleConnector; 
        TemplateLoadData.RootObject = null;

        List<PropertyValue> sharedProperties = new List<PropertyValue>();

        int nameNumber = 1;
        ParseTree(stack, sharedProperties, /*ref*/ nameNumber); 

        // Items panel templates have special rules 
        if (OwnerTemplate instanceof ItemsPanelTemplate) 
        {
            PropertyValue pv = new PropertyValue(); 
            pv.ValueType = PropertyValueType.Set;
            pv.ChildName = TemplateLoadData.RootName;
            pv.ValueInternal = true;
            pv.Property = Panel.IsItemsHostProperty; 

            sharedProperties.Add(pv); 
        } 

        // Add all the shared properties to the special table 
        for (int i = 0; i < sharedProperties.Count; i++)
        {
            PropertyValue value = sharedProperties[i];

            if (value.ValueInternal instanceof TemplateBindingExtension)  // Use ValueInternal to avoid creating deferred resource references
            { 
                value.ValueType = PropertyValueType.TemplateBinding; 
            }
            else if (value.ValueInternal instanceof DynamicResourceExtension) // Use ValueInternal to avoid creating deferred resource references 
            {
                DynamicResourceExtension dynamicResource = value.Value as DynamicResourceExtension;

                value.ValueType = PropertyValueType.Resource; 
                value.ValueInternal = dynamicResource.ResourceKey;
            } 
            else 
            {
                StyleHelper.SealIfSealable(value.ValueInternal); 
            }

            StyleHelper.UpdateTables(/*ref*/ value, /*ref*/ OwnerTemplate.ChildRecordFromChildIndex, 
            		/*ref*/ OwnerTemplate.TriggerSourceRecordFromChildIndex,
                /*ref*/ OwnerTemplate.ResourceDependents, /*ref*/ OwnerTemplate._dataTriggerRecordFromBinding, 
                OwnerTemplate.ChildIndexFromChildName, /*ref*/ OwnerTemplate._hasInstanceValues); 
        }

        //We don't need to use this Object writer anymore so let's clear it out. 
        TemplateLoadData.ObjectWriter = null;
    } 

    /// <SecurityNote>
    /// Critical: FrameworkTemplate relies on the integrity of this reader to assert LoadPermission.
    ///           Accesses critical field _xamlNodeList. 
    /// Safe: _xamlNodeList integrity is guarded by SecurityCritical.
    ///       Doesn't leak _xamlNodeList.Writer, just provides a reader. 
    /// </SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe]
    /*internal*/ /*System.Xaml.*/XamlReader PlayXaml() 
    {
        return _xamlNodeList.GetReader();
    }

    /// <SecurityNote>
    /// Critical to write: Specifies the permission that can be asserted when loading the XAML 
    ///                    from PlayXaml() or TemplateLoadData.Reader, to allow it to access non-public members. 
    /// Critical to read: Can be mutated via FromXml method.
    /// </SecurityNote> 
    /*internal*/ XamlLoadPermission LoadPermission
    {
//        [SecurityCritical]
        get; 
//        [SecurityCritical]
        set; 
    } 

    //Called by FrameworkTemplate.Seal() to let go of the data used for Template Load. 
    /// <SecurityNote>
    /// Critical: Resets _templateLoadData to null, which contains the critical Reader.
    /// Safe: It is ok to cause this Object to be GCable, to preserve memory, as the data
    ///       from Reader has been transferred to the critical _xamlNodeList. 
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe] 
    /*internal*/ void ResetTemplateLoadData() 
    {
        TemplateLoadData = null; 
    }

    //+------------------------------------------------------------------------------------------
    // 
    //  UpdateSharedList
    // 
    //  Update the last items on the shared DependencyProperty list with the 
    //  name of the current element.
    // 
    //+-----------------------------------------------------------------------------------------
    private void UpdateSharedPropertyNames(String name, List<PropertyValue> sharedProperties, XamlType type)
    {
//#if DEBUG 
//        int lastIndex = OwnerTemplate.LastChildIndex;
//#endif 

        // Generate an index for this name
        int childIndex = StyleHelper.CreateChildIndexFromChildName(name, OwnerTemplate); 

        OwnerTemplate.ChildNames.Add(name);
        OwnerTemplate.ChildTypeFromChildIndex.Add(childIndex, type.UnderlyingType);

//#if DEBUG
//        Debug.Assert(childIndex == lastIndex); 
//#endif 

        // The tail of the _sharedProperties list has the properties for this element, 
        // all with no name.  Fill in the name now.

        for (int i = sharedProperties.Count - 1; i >= 0; i--)
        { 
            PropertyValue sdp = sharedProperties[i];

            if (sdp.ChildName == null) 
            {
                sdp.ChildName = name; 
            }
            else
            {
                break; 
            }

            sharedProperties[i] = sdp; 
        }
    } 

    /// <SecurityNote>
    /// Critical: Asserts LoadPermission
    /// Safe: The node stream that we pass to the ObjectWriter (and copy into _xamlNodeList) 
    ///       comes from _reader, and we demanded LoadPermission when that was passed in
    ///       (in the constructor). 
    /// </SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe]
    private void ParseTree( 
        StackOfFrames stack,
        List<PropertyValue> sharedProperties,
        /*ref*/ int nameNumber)
    { 
        if (LoadPermission != null)
        { 
            LoadPermission.Assert(); 
            try
            { 
                ParseNodes(stack, sharedProperties, /*ref*/ nameNumber);
            }
            finally
            { 
                CodeAccessPermission.RevertAssert();
            } 
        } 
        else
        { 
            ParseNodes(stack, sharedProperties, /*ref*/ nameNumber);
        }
    }

    /// <SecurityNote>
    /// Critical: Accesses critical TemplateLoadData.Reader and _xamlNodeList 
    /// Safe: The node stream that we copy into critical _xamlNodeList comes from the critical Reader. 
    ///       At this point, it is ok to null out the reader, to release the memory.
    /// </SecurityNote> 
//    [SecurityCritical, SecurityTreatAsSafe]
    private void ParseNodes(
        StackOfFrames stack,
        List<PropertyValue> sharedProperties, 
        /*ref*/ int nameNumber)
    { 
        _xamlNodeList = new XamlNodeList(SchemaContext); 
        /*System.Xaml.*/XamlWriter writer = _xamlNodeList.Writer;
        /*System.Xaml.*/XamlReader reader = TemplateLoadData.Reader; 
        while (reader.Read())
        {
            Object newValue;
            boolean reProcessOnApply = ParseNode(reader, stack, sharedProperties, /*ref*/ nameNumber, /*out*/ newValue); 
            if (reProcessOnApply)
            { 
                if (newValue == DependencyProperty.UnsetValue) 
                {
                    writer.WriteNode(reader); 
                }
                else
                {
                    writer.WriteValue(newValue); 
                }
            } 
        } 
        writer.Close();
        TemplateLoadData.Reader = null; 
    }

    // Returns true if the node should be re-processed on template apply. If the value is
    // shareable, the node doesn't need to be reprocessed, so we return false. 
    private boolean ParseNode(/*System.Xaml.*/XamlReader xamlReader,
        StackOfFrames stack, 
        List<PropertyValue> sharedProperties, 
        /*ref*/ int nameNumber,
        /*out*/ Object newValue) 
    {
        newValue = DependencyProperty.UnsetValue;
        switch (xamlReader.NodeType)
        { 
            case /*System.Xaml.XamlNodeType.*/StartObject:
                { 
                    // Process the load-time binding of StaticResources. 
                    // SR usage in RD's will be instance Values coming from the BAML reader.
                    // SR in node list form are from inline templates.  (or XML text) 
                    // V3 also hard codes type EQUALITY against StaticResourceExtension
                    if (xamlReader.Type.UnderlyingType == typeof(StaticResourceExtension))
                    {
                        // Use the shared XamlObjectWriter but clear the state first 
                        XamlObjectWriter writer = TemplateLoadData.ObjectWriter;
                        writer.Clear(); 
                        WriteNamespaces(writer, stack.InScopeNamespaces, null); 

                        // newValue is an out parameter that will change the value in the processed node stream. 
                        newValue = LoadTimeBindUnshareableStaticResource(xamlReader, writer);
                        return true;
                    }

                    // Check to see if the parent Object needs to have the name set
                    if (stack.Depth > 0 && 
                        stack.CurrentFrame.NameSet == false && 
                        stack.CurrentFrame.Type != null &&
                        !stack.CurrentFrame.IsInNameScope && 
                        !stack.CurrentFrame.IsInStyleOrTemplate)
                    {
                        // FEs and FCEs need to be added to the name to index map
                        if (typeof(FrameworkElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType) || 
                            typeof(FrameworkContentElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                        { 
                            // All FEs and FCEs must have a name.  We assign a default if there was no name provided 
                            String name = nameNumber++.ToString(CultureInfo.InvariantCulture) + "_T";
                            UpdateSharedPropertyNames(name, sharedProperties, stack.CurrentFrame.Type); 
                            stack.CurrentFrame.Name = name;
                        }
                        stack.CurrentFrame.NameSet = true;
                    } 

                    if (RootType == null) 
                    { 
                        RootType = xamlReader.Type;
                    } 
                    stack.Push(xamlReader.Type, null);
                }
                break;
            case /*System.Xaml.XamlNodeType.*/GetObject: 
                {
                    // Check to see if the parent Object needs to have the name set 
                    if (stack.Depth > 0 && 
                        stack.CurrentFrame.NameSet == false &&
                        stack.CurrentFrame.Type != null && 
                        !stack.CurrentFrame.IsInNameScope &&
                        !stack.CurrentFrame.IsInStyleOrTemplate)
                    {
                        // FEs and FCEs need to be added to the name to index map 
                        if (typeof(FrameworkElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType) ||
                            typeof(FrameworkContentElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType)) 
                        { 
                            // All FEs and FCEs must have a name.  We assign a default if there was no name provided
                            String name = nameNumber++.ToString(CultureInfo.InvariantCulture) + "_T"; 
                            UpdateSharedPropertyNames(name, sharedProperties, stack.CurrentFrame.Type);
                            stack.CurrentFrame.Name = name;
                        }
                        stack.CurrentFrame.NameSet = true; 
                    }

                    XamlType type = stack.CurrentFrame.Property.Type; 
                    if (RootType == null)
                    { 
                        RootType = type;
                    }
                    stack.Push(type, null);
                } 
                break;
            case /*System.Xaml.XamlNodeType.*/EndObject: 
                if (!stack.CurrentFrame.IsInStyleOrTemplate) 
                {
                    if (stack.CurrentFrame.NameSet == false && !stack.CurrentFrame.IsInNameScope) 
                    {
                        // FEs and FCEs need to be added to the name to index map
                        if (typeof(FrameworkElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType) ||
                            typeof(FrameworkContentElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType)) 
                        {
                            // All FEs and FCEs must have a name.  We assign a default if there was no name provided 
                            String name = nameNumber++.ToString(CultureInfo.InvariantCulture) + "_T"; 
                            UpdateSharedPropertyNames(name, sharedProperties, stack.CurrentFrame.Type);
                            stack.CurrentFrame.Name = name; 
                        }
                        stack.CurrentFrame.NameSet = true;
                    }

                    if (TemplateLoadData.RootName == null && stack.Depth == 1)
                    { 
                        TemplateLoadData.RootName = stack.CurrentFrame.Name; 
                    }

                    // ContentPresenters have special rules for aliasing Content
                    if (typeof(ContentPresenter).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                    {
                        AutoAliasContentPresenter( 
                            OwnerTemplate.TargetTypeInternal,
                            stack.CurrentFrame.ContentSource, 
                            stack.CurrentFrame.Name, 
                            /*ref*/ OwnerTemplate.ChildRecordFromChildIndex,
                            /*ref*/ OwnerTemplate.TriggerSourceRecordFromChildIndex, 
                            /*ref*/ OwnerTemplate.ResourceDependents,
                            /*ref*/ OwnerTemplate._dataTriggerRecordFromBinding,
                            /*ref*/ OwnerTemplate._hasInstanceValues,
                            OwnerTemplate.ChildIndexFromChildName, 
                            stack.CurrentFrame.ContentSet,
                            stack.CurrentFrame.ContentSourceSet, 
                            stack.CurrentFrame.ContentTemplateSet, 
                            stack.CurrentFrame.ContentTemplateSelectorSet,
                            stack.CurrentFrame.ContentStringFormatSet 
                            );
                    }

                    // GridViewRowPresenters have special rules for aliasing Content 
                    if (typeof(GridViewRowPresenter).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                    { 
                        AutoAliasGridViewRowPresenter( 
                            OwnerTemplate.TargetTypeInternal,
                            stack.CurrentFrame.ContentSource, 
                            stack.CurrentFrame.Name,
                            /*ref*/ OwnerTemplate.ChildRecordFromChildIndex,
                            /*ref*/ OwnerTemplate.TriggerSourceRecordFromChildIndex,
                            /*ref*/ OwnerTemplate.ResourceDependents, 
                            /*ref*/ OwnerTemplate._dataTriggerRecordFromBinding,
                            /*ref*/ OwnerTemplate._hasInstanceValues, 
                            OwnerTemplate.ChildIndexFromChildName, 
                            stack.CurrentFrame.ContentSet,
                            stack.CurrentFrame.ColumnsSet 
                            );
                    }
                }

                stack.PopScope();
                break; 

            case /*System.Xaml.XamlNodeType.*/StartMember:
                stack.CurrentFrame.Property = xamlReader.Member; 

                if (!stack.CurrentFrame.IsInStyleOrTemplate)
                {

                    // Need to know if these properties are set for
                    // autoaliasing. 
                    if (typeof(GridViewRowPresenter).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType)) 
                    {
                        if (xamlReader.Member.Name == "Content") 
                            stack.CurrentFrame.ContentSet = true;
                        else if (xamlReader.Member.Name == "Columns")
                            stack.CurrentFrame.ColumnsSet = true;
                    } 
                    else if (typeof(ContentPresenter).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                    { 
                        if (xamlReader.Member.Name == "Content") 
                            stack.CurrentFrame.ContentSet = true;
                        else if (xamlReader.Member.Name == "ContentTemplate") 
                            stack.CurrentFrame.ContentTemplateSet = true;
                        else if (xamlReader.Member.Name == "ContentTemplateSelector")
                            stack.CurrentFrame.ContentTemplateSelectorSet = true;
                        else if (xamlReader.Member.Name == "ContentStringFormat") 
                            stack.CurrentFrame.ContentStringFormatSet = true;
                        else if (xamlReader.Member.Name == "ContentSource") 
                            stack.CurrentFrame.ContentSourceSet = true; 
                    }

                    if (!stack.CurrentFrame.IsInNameScope &&
                        xamlReader.Member.IsDirective == false)
                    {

                        // Try to see if the property is shareable
                        PropertyValue/*?*/ sharedValue; 
                        IXamlIndexingReader iReader = xamlReader as IXamlIndexingReader; 
//                        Debug.Assert(iReader != null, "Template's Reader is not a Indexing Reader");

                        boolean sharable = false;
                        int savedIdx = iReader.CurrentIndex;

                        try 
                        {
                            sharable = TrySharingProperty(xamlReader, 
                                    stack.CurrentFrame.Type, 
                                    stack.CurrentFrame.Name,
                                    stack.InScopeNamespaces, 
                                    /*out*/ sharedValue);
                        }
                        catch(Exception e)
                        { 
                            sharable = false;
                            sharedValue = null; 
                        } 

                        // Property is NOT shareable. 
                        // Back-up and add the unsharable section.
                        if (!sharable)
                        {
                            iReader.CurrentIndex = savedIdx; 
                            break;
                        } 
                        else 
                        {
                            // Value can be shared. 
                            // Add it to the shared properties list

//                            Debug.Assert(sharedValue != null);
                            sharedProperties.Add(sharedValue.Value); 

                            if (typeof(GridViewRowPresenter). 
                                IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType) || 
                                typeof(ContentPresenter).
                                IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType)) 
                            {
                                if (sharedValue.Value.Property.Name == "ContentSource")
                                {
                                    stack.CurrentFrame.ContentSource = 
                                        sharedValue.Value.ValueInternal as String;

                                    // 



                                    if (!(sharedValue.Value.ValueInternal is String) &&
                                        sharedValue.Value.ValueInternal != null)
                                    { 
                                        stack.CurrentFrame.ContentSourceSet = false;
                                    } 
                                } 
                            }
                        } 
                        return false;
                    }
                }
                break; 

            case /*System.Xaml.XamlNodeType.*/EndMember: 
                stack.CurrentFrame.Property = null; 
                break;

            case /*System.Xaml.XamlNodeType.*/Value:
                if (!stack.CurrentFrame.IsInStyleOrTemplate)
                {
                    if (FrameworkTemplate.IsNameProperty(stack.CurrentFrame.Property, stack.CurrentFrame.Type)) 
                    {
                        String name = xamlReader.Value as String; 

                        stack.CurrentFrame.Name = name;
                        stack.CurrentFrame.NameSet = true; 

                        if (TemplateLoadData.RootName == null)
                        {
                            TemplateLoadData.RootName = name; 
                        }

                        if (!stack.CurrentFrame.IsInNameScope) 
                        {
                            // FEs and FCEs need to be added to the name to index map 
                            if (typeof(FrameworkElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType) ||
                                typeof(FrameworkContentElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                            {
                                TemplateLoadData.NamedTypes.Add(name, stack.CurrentFrame.Type); 

                                // All FEs and FCEs must have a name.  We assign a default if there was no name provided 
                                UpdateSharedPropertyNames(name, sharedProperties, stack.CurrentFrame.Type); 
                            }
                        } 
                    }

                    if (typeof(ContentPresenter).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType)
                        && stack.CurrentFrame.Property.Name == "ContentSource") 
                    {
                        stack.CurrentFrame.ContentSource = xamlReader.Value as String; 
                    } 
                }
                Object value = xamlReader.Value; 
                StaticResourceExtension staticResource = value as StaticResourceExtension;
                // Process the load-time binding of StaticResources.
                // If this is a simple inline template then the StaticResources will be StaticResourcesExtensions
                // [They also might be node-lists, see LoadTimeBindUnshareableStaticResource()] 
                // and we do a full search for the location of the value and hold a deferred reference to it.
                // If the template was in a Resource Dictionary, the RD would have already replaced the 
                // StaticResource with a StaticResourceHolder and we need to do a "live stack only" walk 
                // to look for RD's that might be closer, for better values.
                if (staticResource != null) 
                {
                    Object obj = null;

                    // Inline Template case: 
                    if (staticResource.GetType() == typeof(StaticResourceExtension))
                    { 
                        obj = staticResource.TryProvideValueInternal(TemplateLoadData.ServiceProviderWrapper, true/*allowDeferredReference*/, true/*mustReturnDeferredResourceReference*/); 
                    }

                    // Template in a Resource Dictionary entry case:
                    else if (staticResource.GetType() == typeof(StaticResourceHolder))
                    {
                        obj = staticResource.FindResourceInDeferredContent(TemplateLoadData.ServiceProviderWrapper, true/*allowDeferredReference*/, false/*mustReturnDeferredResourceReference*/); 
                        if (obj == DependencyProperty.UnsetValue)
                        { 
                            obj = null;  // value is only interesting if it improves the previous value. 
                        }
                    } 
                    if (obj != null)
                    {
                    	DeferredResourceReference deferredResourceReference = obj as DeferredResourceReference;

                        // newValue is an out parameter that will change the value in the processed node stream.
                        newValue = new StaticResourceHolder(staticResource.ResourceKey, deferredResourceReference); 
                    } 
                }
                break; 

            case /*System.Xaml.XamlNodeType.*/NamespaceDeclaration:

                // *** This code assumes that NamespaceDeclarations can only come before [Start|Get]Object. *** 
                // This needs to be updated in the future to support it before properties & Values.

                if (!stack.CurrentFrame.IsInStyleOrTemplate) 
                {
                    // Check to see if the parent Object needs to have the name set 
                    if (stack.Depth > 0 && stack.CurrentFrame.NameSet == false && stack.CurrentFrame.Type != null && !stack.CurrentFrame.IsInNameScope)
                    {
                        // FEs and FCEs need to be added to the name to index map
                        if (typeof(FrameworkElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType) || 
                            typeof(FrameworkContentElement).IsAssignableFrom(stack.CurrentFrame.Type.UnderlyingType))
                        { 
                            // All FEs and FCEs must have a name.  We assign a default if there was no name provided 
                            String name = nameNumber++.ToString(CultureInfo.InvariantCulture) + "_T";
                            UpdateSharedPropertyNames(name, sharedProperties, stack.CurrentFrame.Type); 
                            stack.CurrentFrame.Name = name;
                        }
                        stack.CurrentFrame.NameSet = true;
                    } 
                }

                stack.AddNamespace(xamlReader.Namespace); 
                break;
            case /*System.Xaml.XamlNodeType.*/None: 
                break;
        }
        return true;
    } 

    private StaticResourceExtension LoadTimeBindUnshareableStaticResource(XamlReader xamlReader, XamlObjectWriter writer) 
    { 
//        Debug.Assert(xamlReader.NodeType == Xaml.XamlNodeType.StartObject);
//        Debug.Assert(xamlReader.Type.UnderlyingType == typeof(StaticResourceExtension)); 

        // Loop through the nodes and create the StaticResource.  Since objects could be nested inside the SRE, we need to keep
        // track of the number of start and end objects.
        int elementDepth = 0; 
        do
        { 
            writer.WriteNode(xamlReader); 
            switch (xamlReader.NodeType)
            { 
                case /*Xaml.XamlNodeType.*/StartObject:
                case /*Xaml.XamlNodeType.*/GetObject:
                    elementDepth++;
                    break; 
                case /*Xaml.XamlNodeType.*/EndObject:
                    elementDepth--; 
                    break; 
            }
        } 
        while (elementDepth > 0 && xamlReader.Read());

        StaticResourceExtension resource = writer.Result as StaticResourceExtension;
//        Debug.Assert(resource != null); 

        // If the StaicResource was in NodeList form then it would not have been pre-resolved. 
        // So do a full walk now, not a Live-Stack only. 
        // Resolve the StaticResource value including lookup to the app and the theme
        DeferredResourceReference value = (DeferredResourceReference)resource.TryProvideValueInternal(TemplateLoadData.ServiceProviderWrapper, true/*allowDeferredReference*/, true/*mustReturnDeferredResourceReference*/); 

        // Return the value that will be written out the unshareable node list;
        return new StaticResourceHolder(resource.ResourceKey, value);
    } 

    // Tries to see if the property can be shared.  Returns true property is shared. 
    // Caller is responsible for bookmarking. 
    //
    // Only property values can be shared.  We try to share anything that is a Freezable, 
    // ME, Style, Template.  However, if the parent type is named, we can't share anything.
    // However, TemplateBindingExtension are ALWAYS shared
    private boolean TrySharingProperty(/*System.Xaml.*/XamlReader xamlReader,
        XamlType parentType, 
        String parentName,
        FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> previousNamespaces, 
        /*out*/ PropertyValue/*?*/ sharedValue) 
    {
//        Debug.Assert(xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.StartMember); 
        // All DependencyPropertys are wrapped in WpfXamlMembers.  If it's not a WpfXamlMember, it's not a DependencyProperty
        WpfXamlMember xamlProperty = xamlReader.Member as WpfXamlMember;
        if (xamlProperty == null)
        { 
            sharedValue = null;
            return false; 
        } 
        DependencyProperty property = xamlProperty.DependencyProperty;

        // We can only share DPs.  Return the node pipe with just the SP in it
        if (property == null)
        {
            sharedValue = null; 
            return false;
        } 
        // Also, we cannot share the name property 
        if (xamlReader.Member == parentType.GetAliasedProperty(XamlLanguage.Name))
        { 
            sharedValue = null;
            return false;
        }
        // We can only share properties on FEs and FCEs 
        if (!typeof(FrameworkElement).IsAssignableFrom(parentType.UnderlyingType) &&
             !typeof(FrameworkContentElement).IsAssignableFrom(parentType.UnderlyingType)) 
        { 
            sharedValue = null;
            return false; 
        }

        // Check if the value is shareable.
        // We are in a StartMember so we assume there is another node to read. 
        xamlReader.Read();

        // Check if the value is shareable. 
        if (xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.Value)
        { 
            // Null would be shareable but when 4.0 shipped a null Value caused
            // an exception to be thrown here.
            //    xamlReader.Value.GetType();
            // Throwning an exceptions will mark item as unshareable.  So for compability, 
            // Null is not shareable.
            // But the much more common case of a NullExtension Object is sharable. 
            if (xamlReader.Value == null) 
            {
                sharedValue = null; 
                return false;
            }
            Type typeofValue = xamlReader.Value.GetType();
            if (!CheckSpecialCasesShareable(typeofValue, property)) 
            {
                sharedValue = null; 
                return false; 
            }
            if (!(xamlReader.Value instanceof String)) 
            {
                return TrySharingValue(property, xamlReader.Value,
                    parentName, xamlReader, true, /*out*/ sharedValue);
            } 
            else
            { 
                Object value = xamlReader.Value; 

                TypeConverter converter = null; 
                if (xamlProperty.TypeConverter != null)
                {
                    converter = xamlProperty.TypeConverter.ConverterInstance;
                } 
                else if (xamlProperty.Type.TypeConverter != null)
                { 
                    converter = xamlProperty.Type.TypeConverter.ConverterInstance; 
                }

                if (converter != null)
                {
                    value = converter.ConvertFrom(TemplateLoadData.ServiceProviderWrapper, CultureInfo.InvariantCulture, value);
                } 

                return TrySharingValue(property, value, parentName, xamlReader, true, /*out*/ sharedValue); 
            } 
        }
        else if (xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.StartObject 
            || xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.NamespaceDeclaration)
        {
            FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> localNamespaces = null;
            if (xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.NamespaceDeclaration) 
            {
                localNamespaces = new FrugalObjectList<Xaml.NamespaceDeclaration>(); 
                while (xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.NamespaceDeclaration) 
                {
                    localNamespaces.Add(xamlReader.Namespace); 
                    xamlReader.Read();
                }
            }

//            Debug.Assert(xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.StartObject);

            Type typeofValue = xamlReader.Type.UnderlyingType; 
            if (!CheckSpecialCasesShareable(typeofValue, property))
            { 
                sharedValue = null;
                return false;
            }
            if (!IsTypeShareable(xamlReader.Type.UnderlyingType)) 
            {
                sharedValue = null; 
                return false; 
            }
            else 
            {
                // Keep track of the number of SOs and EOs
                // Perf note: This stack may be sharable if this gets hit multiple times per TemplateContent.
                StackOfFrames frames = new StackOfFrames(); 
                frames.Push(xamlReader.Type, null);

                boolean insideTemplate = false; 
                boolean insideStyle = false;

                // We don't care about named elements inside of Templates or Styles.  We allow it to just work.
                if (typeof(FrameworkTemplate).IsAssignableFrom(xamlReader.Type.UnderlyingType))
                {
                    insideTemplate = true; 
                    Stack = frames;
                } 
                else if (typeof(Style).IsAssignableFrom(xamlReader.Type.UnderlyingType)) 
                {
                    insideStyle = true; 
                    Stack = frames;
                }

                try 
                {

                    //Setup ObjectWriter to be able to create the right values 
                    XamlObjectWriter writer = TemplateLoadData.ObjectWriter;
                    writer.Clear(); 
                    WriteNamespaces(writer, previousNamespaces, localNamespaces);
                    writer.WriteNode(xamlReader);

                    boolean done = false; 
                    while (!done && xamlReader.Read())
                    { 
                        SkipFreeze(xamlReader); 
                        writer.WriteNode(xamlReader);
                        switch (xamlReader.NodeType) 
                        {
                            case /*System.Xaml.XamlNodeType.*/StartObject:
                                if (typeof(StaticResourceExtension).IsAssignableFrom(xamlReader.Type.UnderlyingType))
                                { 
                                    sharedValue = null;
                                    return false; 
                                } 
                                frames.Push(xamlReader.Type, null);
                                break; 

                            case /*System.Xaml.XamlNodeType.*/GetObject:
                                XamlType type = frames.CurrentFrame.Property.Type;
                                frames.Push(type, null); 
                                break;

                            case /*System.Xaml.XamlNodeType.*/EndObject: 
                                if (frames.Depth == 1)
                                { 
                                    return TrySharingValue(property, writer.Result, parentName,
                                        xamlReader, true, /*out*/ sharedValue);
                                }
                                frames.PopScope(); 
                                break;

                            case /*System.Xaml.XamlNodeType.*/StartMember: 
                                // Anything that is named cannot be shared
                                if (!(insideStyle || insideTemplate) && FrameworkTemplate.IsNameProperty(xamlReader.Member, frames.CurrentFrame.Type)) 
                                {
                                    done = true;
                                    break;
                                } 
                                frames.CurrentFrame.Property = xamlReader.Member;
                                break; 

                            case /*System.Xaml.XamlNodeType.*/Value:
                                if (xamlReader.Value != null && typeof(StaticResourceExtension).IsAssignableFrom(xamlReader.Value.GetType())) 
                                {
                                    sharedValue = null;
                                    return false;
                                } 
                                // We want to wire EventSetters for Styles but not wire
                                // events inside of a FramewokrTemplate 
                                if (!insideTemplate && frames.CurrentFrame.Property == XamlLanguage.ConnectionId) 
                                {
                                    if (OwnerTemplate.StyleConnector != null) 
                                    {
                                        OwnerTemplate.StyleConnector.Connect((int)xamlReader.Value, frames.CurrentFrame.Instance);
                                    }
                                } 
                                break;
                        } 
                    } 

                    // We've broken out of the while loop and haven't returned 
                    // The property is NOT shareable.
                    sharedValue = null;
                    return false;
                } 
                finally
                { 
                    Stack = null; 
                }
            } 
        }
        else if (xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.GetObject)
        {
            sharedValue = null; 
            return false;
        } 
        else 
        {
            // Should never happen 
            throw new /*System.Windows.Markup.*/XamlParseException(/*SR.Get(SRID.ParserUnexpectedEndEle)*/);
        }
    }

    private static boolean CheckSpecialCasesShareable(Type typeofValue, DependencyProperty property)
    { 
        if (typeofValue != typeof(DynamicResourceExtension) 
            && typeofValue != typeof(TemplateBindingExtension)
            && typeofValue != typeof(TypeExtension) 
            && typeofValue != typeof(StaticExtension))
        {
            // Do not share in the case property type <: IList, Array, IDictionary to maintain compat with v3
            // They wrapped with BamlCollectionHolder in these 3 cases so the value isn't shared. 
            if (typeof(IList).IsAssignableFrom(property.PropertyType))
            { 
                return false; 
            }
            if (property.PropertyType.IsArray) 
            {
                return false;
            }
            if (typeof(IDictionary).IsAssignableFrom(property.PropertyType)) 
            {
                return false; 
            } 
        }
        return true; 
    }

    private static boolean IsFreezableDirective(/*System.Xaml.*/XamlReader reader)
    { 
        /*System.Xaml.*/XamlNodeType nodeType = reader.NodeType;
        if (nodeType == /*System.Xaml.*/XamlNodeType.StartMember) 
        { 
            /*System.Xaml.*/XamlMember member = reader.Member;
            return (member.IsUnknown && member.IsDirective && member.Name == "Freeze"); 
        }
        return false;
    }

    private static void SkipFreeze(/*System.Xaml.*/XamlReader reader)
    { 
        if (IsFreezableDirective(reader)) 
        {
            reader.Read();  // V 
            reader.Read();  // EM
            reader.Read();  // Next
        }
    } 

    private boolean TrySharingValue(DependencyProperty property, 
                                 Object value, 
                                 String parentName,
                                 /*System.Xaml.*/XamlReader xamlReader, 
                                 boolean allowRecursive,
                                 /*out*/ PropertyValue/*?*/ sharedValue)
    {
        sharedValue = null; 

        // Null is sharable. 
        if (value != null && !IsTypeShareable(value.GetType())) 
        {
            return false; 
        }

        boolean isValueShareable = true;

        if (value instanceof Freezable)
        { 
            // Check if it's a freezable and we can freeze it 
            Freezable freezable = value as Freezable;
            if (freezable != null) 
            {
                if (freezable.CanFreeze)
                {
                    freezable.Freeze(); 
                }
                else 
                { 
                    // Object is not freezable, which means its
                    // not shareable. 
                    isValueShareable = false;
                }
            }
        } 
        else if (value instanceof CollectionViewSource)
        { 
            CollectionViewSource viewSource = value as CollectionViewSource; 
            if (viewSource != null)
            { 
                isValueShareable = viewSource.IsShareableInTemplate();
            }
        }
        else if (value instanceof MarkupExtension) 
        {
            // Share the actual ME directly for these 3. 
            if (value instanceof BindingBase || 
                value instanceof TemplateBindingExtension ||
                value instanceof DynamicResourceExtension) 
            {
                isValueShareable = true;
            }
            else if ((value instanceof StaticResourceExtension) || (value instanceof StaticResourceHolder)) 
            {
                isValueShareable = false; 
            } 
            else
            { 
                TemplateLoadData.ServiceProviderWrapper.SetData(_sharedDpInstance, property);
                value = (value as MarkupExtension).ProvideValue(TemplateLoadData.ServiceProviderWrapper);
                TemplateLoadData.ServiceProviderWrapper.Clear();

                if (allowRecursive)
                { 
                    // Terminate recursive checking of provided value to prevent infinite loop 
                    return TrySharingValue(property, value, parentName, xamlReader, false, /*out*/ sharedValue);
                } 
                else
                {
                    isValueShareable = true;
                } 
            }
        } 

        if (isValueShareable)
        { 
            // If we're here, that means the property can be shared
            PropertyValue propertyValue = new PropertyValue();
            propertyValue.Property = property;
            propertyValue.ChildName = parentName; 
            propertyValue.ValueInternal = value;
            propertyValue.ValueType = PropertyValueType.Set; 

            sharedValue = propertyValue;

            // Read the EndProperty so it's not going to be read by the outer reader
            xamlReader.Read();
//            Debug.Assert(xamlReader.NodeType == /*System.Xaml.*/XamlNodeType.EndMember);
        } 

        return isValueShareable; 
    } 

    private boolean IsTypeShareable(Type type) 
    {
        if ( // We handle Freezables on an per-instance basis.
            typeof(Freezable).IsAssignableFrom(type)
            || 
            // Well-known immutable CLR types
            type == typeof(String) || type == typeof(Uri) || type == typeof(Type) 
            || 
            // We assume MEs are shareable; the host Object is responsible
            // for ensuring immutability.  The exception is static resource 
            // references, for which we have special support in templates.
            (typeof(MarkupExtension).IsAssignableFrom(type)
                &&
                !typeof(StaticResourceExtension).IsAssignableFrom(type)) 
            ||
            // Styles & Templates are mostly shareable 
            typeof(Style).IsAssignableFrom(type) 
            ||
            typeof(FrameworkTemplate).IsAssignableFrom(type) 
            ||
            // CVS might be shareable, wait for the instance check
            typeof(System.Windows.Data.CollectionViewSource).IsAssignableFrom(type)
            || 
            // Value types are immutable by nature
            (type != null && type.IsValueType)) 
            return true; 

        return false; 
    }

    private void WriteNamespaces(/*System.Xaml.*/XamlWriter writer,
                                 FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> previousNamespaces, 
                                 FrugalObjectList</*System.Xaml.*/NamespaceDeclaration> localNamespaces)
    { 
        if (previousNamespaces != null) 
        {
            for (int idx = 0; idx < previousNamespaces.Count; idx++) 
            {
                writer.WriteNamespace(previousNamespaces[idx]);
            }
        } 
        if (localNamespaces != null)
        { 
            for (int idx = 0; idx < localNamespaces.Count; idx++) 
            {
                writer.WriteNamespace(localNamespaces[idx]); 
            }
        }
    }


    private static void AutoAliasContentPresenter( 
        Type targetType, 
        String contentSource,
        String templateChildName, 
        /*ref*/ FrugalStructList<ChildRecord> childRecordFromChildIndex,
        /*ref*/ FrugalStructList<ItemStructMap<TriggerSourceRecord>> triggerSourceRecordFromChildIndex,
        /*ref*/ FrugalStructList<ChildPropertyDependent> resourceDependents,
        /*ref*/ HybridDictionary dataTriggerRecordFromBinding, 
        /*ref*/ boolean hasInstanceValues,
        HybridDictionary childIndexFromChildName, 
        boolean isContentPropertyDefined, 
        boolean isContentSourceSet,
        boolean isContentTemplatePropertyDefined, 
        boolean isContentTemplateSelectorPropertyDefined,
        boolean isContentStringFormatPropertyDefined
        )
    { 
        if (String.IsNullOrEmpty(contentSource) && isContentSourceSet == false)
            contentSource = "Content"; 

        if (!String.IsNullOrEmpty(contentSource) && !isContentPropertyDefined)
        { 
//            Debug.Assert(templateChildName != null);

            DependencyProperty dpContent = DependencyProperty.FromName(contentSource, targetType);
            DependencyProperty dpContentTemplate = DependencyProperty.FromName(contentSource + "Template", targetType); 
            DependencyProperty dpContentTemplateSelector = DependencyProperty.FromName(contentSource + "TemplateSelector", targetType);
            DependencyProperty dpContentStringFormat = DependencyProperty.FromName(contentSource + "StringFormat", targetType); 

            if (dpContent == null && isContentSourceSet)
            { 
                throw new InvalidOperationException(SR.Get(SRID.MissingContentSource, contentSource, targetType));
            }

            if (dpContent != null) 
            {
                PropertyValue pv = new PropertyValue(); 
                pv.ValueType = PropertyValueType.TemplateBinding; 
                pv.ChildName = templateChildName;
                pv.ValueInternal = new TemplateBindingExtension(dpContent); 
                pv.Property = ContentPresenter.ContentProperty;

                StyleHelper.UpdateTables(/*ref*/ pv, /*ref*/ childRecordFromChildIndex,
                    /*ref*/ triggerSourceRecordFromChildIndex, 
                    /*ref*/ resourceDependents,
                    /*ref*/ dataTriggerRecordFromBinding, 
                    childIndexFromChildName, 
                    /*ref*/ hasInstanceValues);

            }

            if (!isContentTemplatePropertyDefined &&
                !isContentTemplateSelectorPropertyDefined && 
                !isContentStringFormatPropertyDefined)
            { 
                if (dpContentTemplate != null) 
                {
                    PropertyValue pv = new PropertyValue(); 
                    pv.ValueType = PropertyValueType.TemplateBinding;
                    pv.ChildName = templateChildName;
                    pv.ValueInternal = new TemplateBindingExtension(dpContentTemplate);
                    pv.Property = ContentPresenter.ContentTemplateProperty; 

                    StyleHelper.UpdateTables(/*ref*/ pv, /*ref*/ childRecordFromChildIndex, 
                           /*ref*/ triggerSourceRecordFromChildIndex, 
                           /*ref*/ resourceDependents,
                           /*ref*/ dataTriggerRecordFromBinding, 
                           childIndexFromChildName,
                           /*ref*/ hasInstanceValues);
                }

                if (dpContentTemplateSelector != null)
                { 
                    PropertyValue pv = new PropertyValue(); 
                    pv.ValueType = PropertyValueType.TemplateBinding;
                    pv.ChildName = templateChildName; 
                    pv.ValueInternal = new TemplateBindingExtension(dpContentTemplateSelector);
                    pv.Property = ContentPresenter.ContentTemplateSelectorProperty;

                    StyleHelper.UpdateTables(/*ref*/ pv, /*ref*/ childRecordFromChildIndex, 
                           /*ref*/ triggerSourceRecordFromChildIndex,
                           /*ref*/ resourceDependents, 
                           /*ref*/ dataTriggerRecordFromBinding, 
                           childIndexFromChildName,
                           /*ref*/ hasInstanceValues); 
                }

                if (dpContentStringFormat != null)
                { 
                    PropertyValue pv = new PropertyValue();
                    pv.ValueType = PropertyValueType.TemplateBinding; 
                    pv.ChildName = templateChildName; 
                    pv.ValueInternal = new TemplateBindingExtension(dpContentStringFormat);
                    pv.Property = ContentPresenter.ContentStringFormatProperty; 


                    StyleHelper.UpdateTables(/*ref*/ pv, /*ref*/ childRecordFromChildIndex,
                         /*ref*/ triggerSourceRecordFromChildIndex, 
                         /*ref*/ resourceDependents,
                         /*ref*/ dataTriggerRecordFromBinding, 
                         childIndexFromChildName, 
                         /*ref*/ hasInstanceValues);
                } 
            }
        }
    }


    private static void AutoAliasGridViewRowPresenter( 
            Type targetType, 
            String contentSource,
            String childName, 
            /*ref*/ FrugalStructList<ChildRecord> childRecordFromChildIndex,
            /*ref*/ FrugalStructList<ItemStructMap<TriggerSourceRecord>> triggerSourceRecordFromChildIndex,
            /*ref*/ FrugalStructList<ChildPropertyDependent> resourceDependents,
            /*ref*/ HybridDictionary dataTriggerRecordFromBinding, 
            /*ref*/ boolean hasInstanceValues,
            HybridDictionary childIndexFromChildID, 
            boolean isContentPropertyDefined, 
            boolean isColumnsPropertyDefined
            ) 
    {
        // <GridViewRowPresenter Content="{TemplateBinding Property=Content}" .../>
        if (!isContentPropertyDefined)
        { 
            DependencyProperty dpContent = DependencyProperty.FromName("Content", targetType);

            if (dpContent != null) 
            {
                PropertyValue propertyValue = new PropertyValue(); 
                propertyValue.ValueType = PropertyValueType.TemplateBinding;
                propertyValue.ChildName = childName;
                propertyValue.ValueInternal = new TemplateBindingExtension(dpContent);
                propertyValue.Property = GridViewRowPresenter.ContentProperty; 

                StyleHelper.UpdateTables(/*ref*/ propertyValue, 
                                         /*ref*/ childRecordFromChildIndex, 
                                         /*ref*/ triggerSourceRecordFromChildIndex,
                                         /*ref*/ resourceDependents, 
                                         /*ref*/ dataTriggerRecordFromBinding,
                                         childIndexFromChildID,
                                         /*ref*/ hasInstanceValues);
            } 
        }

        // <GridViewRowPresenter Columns="{TemplateBinding Property=GridView.ColumnCollection}" .../> 
        if (!isColumnsPropertyDefined)
        { 
            PropertyValue propertyValue = new PropertyValue();
            propertyValue.ValueType = PropertyValueType.TemplateBinding;
            propertyValue.ChildName = childName;
            propertyValue.ValueInternal = new TemplateBindingExtension(GridView.ColumnCollectionProperty); 
            propertyValue.Property = GridViewRowPresenter.ColumnsProperty;

            StyleHelper.UpdateTables(/*ref*/ propertyValue, 
                                     /*ref*/ childRecordFromChildIndex,
                                     /*ref*/ triggerSourceRecordFromChildIndex, 
                                     /*ref*/ resourceDependents,
                                     /*ref*/ dataTriggerRecordFromBinding,
                                     childIndexFromChildID,
                                     /*ref*/ hasInstanceValues); 
        }
    } 

    /*internal*/ public XamlType RootType { get; private set; }

    /*internal*/ XamlType GetTypeForName(String name)
    {
        return TemplateLoadData.NamedTypes[name];
    } 

    /*internal*/ FrameworkTemplate OwnerTemplate { get; set; } 
    /*internal*/ IXamlObjectWriterFactory ObjectWriterFactory { get; private set; } 
    /*internal*/ XamlObjectWriterSettings ObjectWriterParentSettings { get; private set; }

    /*internal*/ public XamlSchemaContext SchemaContext { get; private set; }

    /// <SecurityNote>
    /// Critical to write: The XAML in this field is loaded with the privilege specified in LoadPermission. 
    /// Critical to read: Consumers can modify the contents of this Object via its Writer property.
    /// </SecurityNote> 
    //_xamlNodeList is the postProcessed list, not the original template nodes.  TemplateContentConverter 
    // and TemplateContent do that processing.
//    [SecurityCritical] 
    /*internal*/ XamlNodeList _xamlNodeList = null;

    private static SharedDp _sharedDpInstance = new SharedDp(null, null, null);
    private StackOfFrames Stack 
    {
        get 
        { 
            return TemplateLoadData.Stack;
        } 
        set
        {
            TemplateLoadData.Stack = value;
        } 
    }

    //This will be nulled out when the FrameworkTemplate is sealed. 
    /// <SecurityNote>
    /// Critical to write: The Reader in the TemplateLoadData stored on this Object 
    ///                    is security critical.
    /// </SecurityNote>
    /*internal*/public TemplateLoadData TemplateLoadData
    { 
        get;
//        [SecurityCritical] 
        set; 
    }

    
}

