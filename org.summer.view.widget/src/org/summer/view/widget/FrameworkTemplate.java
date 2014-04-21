package org.summer.view.widget;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.baml2006.WpfXamlMember;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.collection.FrugalStructList;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.context.XamlContextStack;
import org.summer.view.widget.context.XamlFrame;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingExpressionBase;
import org.summer.view.widget.data.BindingMode;
import org.summer.view.widget.data.Expression;
import org.summer.view.widget.data.RelativeSource;
import org.summer.view.widget.internal.Helper;
import org.summer.view.widget.markup.IComponentConnector;
import org.summer.view.widget.markup.INameScope;
import org.summer.view.widget.markup.IQueryAmbient;
import org.summer.view.widget.markup.IStyleConnector;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.markup.ParserContext;
import org.summer.view.widget.markup.ProvideValueServiceProvider;
import org.summer.view.widget.navigation.BaseUriHelper;
import org.summer.view.widget.threading.DispatcherObject;
import org.summer.view.widget.utils.FrugalMap;
import org.summer.view.widget.utils.ItemStructMap;
import org.summer.view.widget.xaml.XamlLanguage;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlObjectWriter;
import org.summer.view.widget.xaml.XamlObjectWriterSettings;
import org.summer.view.widget.xaml.XamlParseException;
import org.summer.view.widget.xaml.XamlReader;
import org.summer.view.widget.xaml.XamlType;
import org.summer.view.window.ResourceReferenceExpression;
import org.summer.view.window.SystemResources;
/// <summary>
///     A generic class that allow instantiation of a 
///     tree of Framework[Content]Elements.
/// </summary>

/// <summary>
///     A generic class that allow instantiation of a 
///     tree of Framework[Content]Elements.
/// </summary>

// The ContentProperty really isn't VisualTree in WPF4 and later.  Right now, we continue to lie for compat with Cider. 
//[ContentProperty("VisualTree")]
//[Localizability(LocalizationCategory.NeverLocalize)] // All properties on template are not localizable 
public abstract class FrameworkTemplate extends DispatcherObject implements INameScope, ISealable, IHaveResources, IQueryAmbient 
{

    /// <summary>
    /// </summary>
    protected FrameworkTemplate()
    { 
//#if DEBUG
//        _debugInstanceCounter = ++_globalDebugInstanceCounter; 
//#endif 
    }

//    #region PublicMethods



    /// <summary>
    ///     Subclasses must override this method if they need to 
    ///     impose additional rules for the TemplatedParent 
    /// </summary>
    protected /*virtual*/ void ValidateTemplatedParent(FrameworkElement templatedParent) 
    {
//        Debug.Assert(templatedParent != null,
//            "Must have a non-null FE TemplatedParent.");
    } 

//    #endregion PublicMethods 

//    #region PublicProperties

    /// <summary>
    ///     Says if this template has been sealed
    /// </summary>
    public boolean IsSealed 
    {
        get 
        { 
            // Verify Context Access
            VerifyAccess(); 

            return _sealed;
        }
    } 

    /// <summary> 
    ///     Root node of the template 
    /// </summary>
    public FrameworkElementFactory VisualTree 
    {
        get
        {
            // Verify Context Access 
            VerifyAccess();

            return _templateRoot; 
        }
        set 
        {
            // Verify Context Access
            VerifyAccess();

            CheckSealed();
            ValidateVisualTree(value); 

            _templateRoot = value;

        }
    }


    /// <summary>
    /// Indicates if the VisualTree property should be serialized. 
    /// </summary> 
//    [EditorBrowsable(EditorBrowsableState.Never)]
    public boolean ShouldSerializeVisualTree() 
    {
        // Verify Context Access
        VerifyAccess();

        return HasContent || VisualTree != null;
    } 



    /*
    /// <summary>
    /// The content of this template.  The alternate form of template content is the VisualTree property.
    /// One of these two properties may be set, but not both.  Note that getting this property can cause 
    /// the content to created, which could be expensive.  So to merely check if Content is set to a non-null
    /// value, use the HasContent property. 
    /// </summary> 

    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
    public FrameworkElement Content
    {
        get
        { 
            // Verify Context Access
            VerifyAccess(); 

            if( HasContent )
            { 
                return LoadTemplateContent() as FrameworkElement;
            }
            else
            { 
                return null;
            } 
        } 
    }


    /// <summary>
    /// Returns true if the Content property should be serialized
    /// </summary> 
    [EditorBrowsable(EditorBrowsableState.Never)]
    public boolean ShouldSerializeContent() 
    { 
        // Verify Context Access
        VerifyAccess(); 

        return HasContent || VisualTree != null;
    }


    /// <summary> 
    /// Resets the Content property to null; 
    /// </summary>
    [EditorBrowsable(EditorBrowsableState.Never)] 
    public void ResetContent()
    {
        // Verify Context Access
        VerifyAccess(); 

        _templateRoot = null; 
    } 

    */ 


    /// <summary>
    /// The property which records/plays the XamlNodes for the template. 
    /// </summary>
//    [Ambient] 
//    [DefaultValue(null)] 
    public TemplateContent Template
    { 
        get
        {
            return _templateHolder;
        } 
        set
        { 
            CheckSealed(); 

            if (!_hasXamlNodeContent) 
            {
           	
                value.OwnerTemplate = this;
                ((TemplateContent)value).ParseXaml();
                _templateHolder = value; 
                _hasXamlNodeContent = true;
            } 
            else 
            {
                throw new /*System.Windows.Markup.*/XamlParseException(/*SR.Get(SRID.TemplateContentSetTwice)*/); 
            }
        }
    }

    /// <summary>
    ///     The collection of resources that can be 
    ///     consumed by the container and its sub-tree. 
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
//    [Ambient]
    public ResourceDictionary Resources
    {
        get 
        {
            // Verify Context Access 
            VerifyAccess(); 

            if ( _resources == null ) 
            {
                _resources = new ResourceDictionary();

                // A Template ResourceDictionary can be accessed across threads 
                _resources.CanBeAccessedAcrossThreads = true;
            } 

            if ( IsSealed )
            { 
                _resources.IsReadOnly = true;
            }

            return _resources; 
        }
        set 
        { 
            // Verify Context Access
            VerifyAccess(); 

            if ( IsSealed )
            {
                throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "Template")*/); 
            }

            _resources = value; 

            if (_resources != null) 
            {
                // A Template ResourceDictionary can be accessed across threads
                _resources.CanBeAccessedAcrossThreads = true;
            } 
        }
    } 

//    ResourceDictionary IHaveResources.Resources
//    { 
//        get { return Resources; }
//        set { Resources = value; }
//    }

    /// <summary>
    ///     Tries to find a Reosurce for the given resourceKey in the current 
    ///     template's ResourceDictionary. 
    /// </summary>
    /*internal*/ Object FindResource(Object resourceKey, boolean allowDeferredResourceReference, boolean mustReturnDeferredResourceReference) 
    {
        if ((_resources != null) && _resources.Contains(resourceKey))
        {
            boolean canCache; 
            return _resources.FetchResource(resourceKey, allowDeferredResourceReference, 
            		mustReturnDeferredResourceReference, /*out*/ canCache);
        } 
        return DependencyProperty.UnsetValue; 
    }

    public boolean /*IQueryAmbient.*/IsAmbientPropertyAvailable(String propertyName)
    {
        // We want to make sure that StaticResource resolution checks the .Resources
        // Ie.  The Ambient search should look at Resources if it is set. 
        // Even if it wasn't set from XAML (eg. the Ctor (or derived Ctor) added stuff)
        if (propertyName == "Resources" && _resources == null) 
        { 
            return false;
        } 
        else if (propertyName == "Template" && !_hasXamlNodeContent)
        {
            return false;
        } 

        return true; 
    } 

    /// <summary> 
    /// FindName - Finds the element associated with the id defined under this control template.
    ///          Context of the FrameworkElement where this template is applied will be passed
    ///          as parameter.
    /// </summary> 
    /// <param name="name">String name</param>
    /// <param name="templatedParent">context where this template is applied</param> 
    /// <returns>the element associated with the Name</returns> 
    public Object FindName(String name, FrameworkElement templatedParent)
    { 
        // Verify Context Access
        VerifyAccess();

        if (templatedParent == null) 
        {
            throw new IllegalArgumentException("templatedParent"); 
        } 

        if (this != templatedParent.TemplateInternal) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.TemplateFindNameInInvalidElement)*/);
        }

        return StyleHelper.FindNameInTemplateContent(templatedParent, name, this);
    } 

//    #endregion PublicProperties


//    #region INameScope

    /// <summary> 
    /// Registers the name - Context combination
    /// </summary> 
    /// <param name="name">Name to register</param> 
    /// <param name="scopedElement">Element where name is defined</param>
    public void RegisterName(String name, Object scopedElement) 
    {
        // Verify Context Access
        VerifyAccess();

        _nameScope.RegisterName(name, scopedElement);
    } 

    /// <summary>
    /// Unregisters the name - element combination 
    /// </summary>
    /// <param name="name">Name of the element</param>
    public void UnregisterName(String name)
    { 
        // Verify Context Access
        VerifyAccess(); 

        _nameScope.UnregisterName(name);
    } 

    /// <summary>
    /// Find the element given name
    /// </summary> 
    /// <param name="name">Name of the element</param>
    public Object /*INameScope.*/FindName(String name) 
    { 
        // Verify Context Access
        VerifyAccess(); 

        return _nameScope.FindName(name);
    }

    private NameScope _nameScope = new NameScope();

//    #endregion INameScope 




//    #region NonPublicMethods


    //  =========================================================================== 
    //  Validation methods 
    //  ===========================================================================

    // Validate against the following rules
    // 1. The VisualTree's root must be a FrameworkElement.
    private void ValidateVisualTree(FrameworkElementFactory templateRoot)
    { 
        // The VisualTree's root must be a FrameworkElement.
        if (templateRoot != null && 
            typeof(FrameworkContentElement).IsAssignableFrom(templateRoot.Type)) 
        {
            throw new IllegalArgumentException(/*SR.Get(SRID.VisualTreeRootIsFrameworkElement, 
                typeof(FrameworkElement).Name, templateRoot.Type.Name)*/);
        }
    }

    //  ============================================================================
    //  These methods are invoked when a Template is being sealed 
    //  =========================================================================== 

//    #region Seal 

    /*internal*/ /*virtual*/ public void ProcessTemplateBeforeSeal()
    {
    } 



    /// <summary>
    /// Seal this FrameworkTemplate 
    /// </summary>
    public void Seal()
    {
        // Verify Context Access 
        VerifyAccess();

        StyleHelper.SealTemplate( 
            this,
            /*ref*/ _sealed, 
            _templateRoot,
            TriggersInternal,
            _resources,
            ChildIndexFromChildName, 
            /*ref*/ ChildRecordFromChildIndex,
            /*ref*/ TriggerSourceRecordFromChildIndex, 
            /*ref*/ ContainerDependents, 
            /*ref*/ ResourceDependents,
            /*ref*/ EventDependents, 
            /*ref*/ _triggerActions,
            /*ref*/ _dataTriggerRecordFromBinding,
            /*ref*/ _hasInstanceValues,
            /*ref*/ _eventHandlersStore); 

        //Let go of the TemplateContent Object to reduce survived allocations. 
        //Need to keep while parsing due to ambient lookup of DependencyPropertyConverter. 
        if (_templateHolder != null)
        { 
            _templateHolder.ResetTemplateLoadData();
        }
    }

    // Subclasses need to call this method before any changes to their state.
    /*internal*/ void CheckSealed() 
    { 
        if (_sealed)
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "Template")*/);
        }
    }

    // compute and cache the flags for ResourceReferences
    /*internal*/ void SetResourceReferenceState() 
    { 
//        Debug.Assert(!_sealed, "call this method before template is sealed");

        StyleHelper.SortResourceDependents(/*ref*/ ResourceDependents);

        for (int i = 0; i < ResourceDependents.Count; ++i)
        { 
            if (ResourceDependents[i].ChildIndex == 0)
            { 
                WriteInternalFlag(InternalFlags.HasContainerResourceReferences, true); 
            }
            else 
            {
                WriteInternalFlag(InternalFlags.HasChildResourceReferences, true);
            }
        } 
    }

//    #endregion Seal 

    //  ============================================================================ 
    //  These methods are invoked to during a call call to
    //  FE.EnsureVisual or FCE.EnsureLogical
    //  ============================================================================

//    #region InstantiateSubTree

    // 
    //  This method
    //  Creates the VisualTree 
    //
    //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
    /*internal*/public boolean ApplyTemplateContent(
        UncommonField<HybridDictionary[]> templateDataField, 
        FrameworkElement container)
    { 
//#if STYLE_TRACE 
//        _timer.Begin();
//#endif 

//        if (TraceDependencyProperty.IsEnabled)
//        {
//            TraceDependencyProperty.Trace( 
//                TraceEventType.Start,
//                TraceDependencyProperty.ApplyTemplateContent, 
//                container, 
//                this);
//        } 


        ValidateTemplatedParent(container);

        boolean visualsCreated = StyleHelper.ApplyTemplateContent(templateDataField, container,
            _templateRoot, _lastChildIndex, 
            ChildIndexFromChildName, this); 

//        if (TraceDependencyProperty.IsEnabled) 
//        {
//            TraceDependencyProperty.Trace(
//                TraceEventType.Stop,
//                TraceDependencyProperty.ApplyTemplateContent, 
//                container,
//                this); 
//        } 


//#if STYLE_TRACE
//        _timer.End();
//        if (visualsCreated)
//        { 
//            String label = container.ID;
//            if (label == null || label.Length == 0) 
//                label = container.GetHashCode().ToString(); 
//            Console.WriteLine("  Style.VT created for {0} {1} in {2:f2} msec",
//                container.GetType().Name, label, _timer.TimeOfLastPeriod); 
//        }
//#endif

        return visualsCreated; 
    }

//    #endregion InstantiateSubTree 




    //+-----------------------------------------------------------------------------------------------------
    // 
    //  LoadContent
    // 
    //  Load the content of a template, returning the root element of the content.  The second version 
    //  loads the template content for use on an FE (i.e. under FrameworkElement.ApplyTemplate).  The
    //  first version is used by the Content property for serialization, no optimization is 
    //  performed, and TemplateBinding's show up as TemplateBindingExpression's.  So it's just a normal
    //  tree.
    //
    //+------------------------------------------------------------------------------------------------------ 

    /// <summary> 
    /// Load the content of a template as an instance of an Object.  Calling this multiple times 
    /// will return separate instances.
    /// </summary> 
    public DependencyObject LoadContent()
    {
        // Verify Context Access
        VerifyAccess(); 

        if (VisualTree != null) 
        { 
            FrameworkObject frameworkObject = VisualTree.InstantiateUnoptimizedTree();
            return frameworkObject.DO; 
        }
        else
        {
            return LoadContent(null, null); 
        }
    } 


    /*internal*/public DependencyObject LoadContent( 
        DependencyObject container,
        List<DependencyObject> affectedChildren)
    {
        if (!HasContent) 
        {
            return null; 
        } 

        // We can't let multiple threads in simultaneously since SchemaContext 
        // is not totally thread safe right now.
        /*lock*/synchronized (SystemResources.ThemeDictionaryLock)
        {
            return LoadOptimizedTemplateContent(container, null, this._styleConnector, affectedChildren, null); 
        }
    } 

    // The v3 main parser didn't treat ResourceDictionary as a NameScope, so
    // GetXamlType(typeof(ResourceDictionary).IsNameScope returns false. However, 
    // the v3 template parser did treat RD as a NameScope. So we need to special-case it.
    /*internal*/public static boolean IsNameScope(XamlType type)
    {
        if (typeof(ResourceDictionary).IsAssignableFrom(type.UnderlyingType)) 
        {
            return true; 
        } 
        return type.IsNameScope;
    } 


    /// <summary>
    /// Indicate if this template has optimized content. 
    /// </summary>
    public boolean HasContent 
    { 
        get
        { 
            // Verify Context Access
            VerifyAccess();

            return _hasXamlNodeContent; 
        }
    } 

    //  ===========================================================================
    //  These methods are invoked when the template has an alternate
    //  mechanism of generating a visual tree. 
    //  ===========================================================================

//    #region BuildVisualTree 

    // 
    //  This method
    //  1. Is an alternative approach to building a visual tree from a FEF
    //  2. Is used by ContentPresenter and Hyperlink to host their content
    // 
    //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
    /*internal*/ /*virtual*/ public boolean BuildVisualTree(FrameworkElement container) 
    { 
        return false;
    } 

    //
    //  This property
    //  1. Says if this Template is meant to use BuildVisualTree mechanism 
    //     to generate a visual tree.
    //  2. Is used in the following scenario. 
    //     We need to preserve the treeState cache on a container node 
    //     even after all its logical children have been added. This is so that
    //     construction of the style visual tree nodes can consume the cache. 
    //     This method helps us know whether we should retain the cache for
    //     special scenarios when the visual tree is being built via BuildVisualTree
    //
    /*internal*/ public boolean CanBuildVisualTree 
    {
        get { return ReadInternalFlag(InternalFlags.CanBuildVisualTree); } 
        set { WriteInternalFlag(InternalFlags.CanBuildVisualTree, value); } 
    }


//    #endregion BuildVisualTree


    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should 
    /// be serialized. 
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeResources(XamlDesignerSerializationManager manager)
    {
        // Verify Context Access
        VerifyAccess(); 

        boolean shouldSerialize = true; 

        if (manager != null)
        { 
            shouldSerialize = (manager.XmlWriter == null);
        }

        return shouldSerialize; 
    }

    // Extracts the required flag and returns 
    // boolean to indicate if it is set or unset
    private boolean ReadInternalFlag(InternalFlags reqFlag) 
    {
        return (_flags & reqFlag) != 0;
    }

    // Sets or Unsets the required flag based on
    // the boolean argument 
    private void WriteInternalFlag(InternalFlags reqFlag, boolean set) 
    {
        if (set) 
        {
            _flags |= reqFlag;
        }
        else 
        {
            _flags &= (~reqFlag); 
        } 
    }

//    #endregion NonPublicMethods

//    #region NonPublicProperties

    private class Frame extends XamlFrame
    { 
        public Frame() { } 
        public XamlType Type { get; set; }
        public XamlMember Property { get; set; } 
        public boolean InsideNameScope { get; set; }
        public Object Instance { get; set; }

        public override void Reset() 
        {
            Type = null; 
            Property = null; 
            Instance = null;

            if (InsideNameScope)
            {
                InsideNameScope = false;
            } 
        }
    } 

    private XamlContextStack<Frame> Names;

    private boolean ReceivePropertySet(Object targetObject, XamlMember member,
        Object value, DependencyObject templatedParent)
    {
        DependencyObject dependencyObject = targetObject as DependencyObject; 
        DependencyProperty dependencyProperty;
       /* System.Windows.Baml2006.*/WpfXamlMember wpfMember = member as /*System.Windows.Baml2006.*/WpfXamlMember; 
        if (wpfMember != null) 
        {
            dependencyProperty = wpfMember.DependencyProperty; 
        }
        else
        {
            // All DP backed XamlMembers must be wrapped by the WpfXamlMember.  If it isn't wrapped, then it's not a DP 
            return false;
        } 

        //If we're not dealing with a DO or a DP, we cannot set an EffectiveValueEntry
        if (dependencyProperty == null || dependencyObject == null) 
        {
            return false;
        }

        FrameworkObject fo = new FrameworkObject(dependencyObject);

        // If this isn't an FE that we're optimizing, defer to base. 
        //
        // Similarly, if we don't have a templated parent, we're not optimizing, and defer to base 
        // (This happens when FrameworkTemplate.LoadContent() is called.)

        if ((fo.TemplatedParent == null) || (templatedParent == null))
        { 
            return false;
        } 

        // For template content, we skip the automatic BaseUriProperty and the UidProperty
        // (Implementation note:  Doing this here because this is what we did with FEFs, 
        // and because automation gets confused if the Uid isn't unique in the whole tree).

        if (dependencyProperty == /*System.Windows.Navigation.*/BaseUriHelper.BaseUriProperty)
        { 
            // We only skip the automatic BaseUri property.  If it's set explicitely,
            // that's passed through. 

            if (!fo.IsInitialized)
            { 
                return true;
            }
        }

        else if (dependencyProperty == UIElement.UidProperty)
        { 
            return true; 
        }

//        Debug.Assert(fo.TemplatedParent == templatedParent);

        // Set the value onto the FE/FCE.
        HybridDictionary parentTemplateValues; 
        if (!fo.StoresParentTemplateValues)
        { 
            parentTemplateValues = new HybridDictionary(); 
            StyleHelper.ParentTemplateValuesField.SetValue(dependencyObject, parentTemplateValues);
            fo.StoresParentTemplateValues = true; 
        }
        else
        {
            parentTemplateValues = StyleHelper.ParentTemplateValuesField.GetValue(dependencyObject); 
        }

        // Check if it is an expression 

        Expression expr; 
        int childIndex = fo.TemplateChildIndex;


        if ((expr = value as Expression) != null) 
        {
            BindingExpressionBase bindingExpr; 
            TemplateBindingExpression templateBindingExpr; 

            if ((bindingExpr = expr as BindingExpressionBase) != null) 
            {
                // If this is a BindingExpression then we need to store the corresponding
                // MarkupExtension into the per instance store for the unshared DP value.

                // Allocate a slot for this unshared DP value in the per-instance store for MarkupExtensions

                HybridDictionary instanceValues = StyleHelper.EnsureInstanceData(StyleHelper.TemplateDataField, templatedParent, InstanceStyleData.InstanceValues); 
                StyleHelper.ProcessInstanceValue(dependencyObject, childIndex, instanceValues, dependencyProperty, StyleHelper.UnsharedTemplateContentPropertyIndex, true /*apply*/);

                value = bindingExpr.ParentBindingBase;
            }
            else if ((templateBindingExpr = expr as TemplateBindingExpression) != null)
            { 
                // If this is a TemplateBindingExpression then we create an equivalent Binding
                // MarkupExtension and store that in the per instance store for the unshared DP 
                // value. We use Binding here because it has all the wiring in place to handle 
                // change notifications through DependencySource and such.

                TemplateBindingExtension templateBindingExtension = templateBindingExpr.TemplateBindingExtension;

                // Allocate a slot for this unshared DP value in the per-instance store for MarkupExtensions

                HybridDictionary instanceValues = StyleHelper.EnsureInstanceData(StyleHelper.TemplateDataField, templatedParent, InstanceStyleData.InstanceValues);
                StyleHelper.ProcessInstanceValue(dependencyObject, childIndex, instanceValues, dependencyProperty, StyleHelper.UnsharedTemplateContentPropertyIndex, true /*apply*/); 

                // Create a Binding equivalent to the TemplateBindingExtension

                Binding binding = new Binding();
                binding.Mode = BindingMode.OneWay;
                binding.RelativeSource = RelativeSource.TemplatedParent;
                binding.Path = new PropertyPath(templateBindingExtension.Property); 
                binding.Converter = templateBindingExtension.Converter;
                binding.ConverterParameter = templateBindingExtension.ConverterParameter; 

                value = binding;

            }
            else
            {
                Debug.Assert(false, "We do not have support for DynamicResource within unshared template content"); 
            }
        } 

        boolean isMarkupExtension = value instanceof MarkupExtension;
        // Value needs to be valid for the DP, or Binding/MultiBinding/PriorityBinding/TemplateBinding. 
        if (!dependencyProperty.IsValidValue(value))
        {
            if (!isMarkupExtension && !(value instanceof DeferredReference))
            { 
                throw new ArgumentException(/*SR.Get(SRID.InvalidPropertyValue, value, dependencyProperty.Name)*/);
            } 
        } 

        parentTemplateValues[dependencyProperty] = value; 

        dependencyObject.ProvideSelfAsInheritanceContext(value, dependencyProperty);

        EffectiveValueEntry entry = new EffectiveValueEntry(dependencyProperty); 
        entry.BaseValueSourceInternal = BaseValueSourceInternal.ParentTemplate;
        entry.Value = value; 

        if (isMarkupExtension)
        { 
            // entry will be updated to hold the value
            StyleHelper.GetInstanceValue(
                        StyleHelper.TemplateDataField,
                        templatedParent, 
                        fo.FE,
                        fo.FCE, 
                        childIndex, 
                        dependencyProperty,
                        StyleHelper.UnsharedTemplateContentPropertyIndex, 
                        /*ref*/ entry);
        }

        dependencyObject.UpdateEffectiveValue( 
                dependencyObject.LookupEntry(dependencyProperty.GlobalIndex),
                dependencyProperty, 
                dependencyProperty.GetMetadata(dependencyObject.DependencyObjectType), 
                new EffectiveValueEntry() /* oldEntry */,
            /*ref*/ entry, 
                false /* coerceWithDeferredReference */,
                false /* coerceWithCurrentValue */,
                OperationType.Unknown);

        return true;
    } 

    // The ordering of how things are created and which methods are called are ABSOLUTELY critical
    // Getting this order slightly off will result in several issues that are very hard to debug. 
    //
    // The order must be:
    //      Register name to the TemplateNameScope (Either the real name specified by x:Name or
    //              RuntimeNameProperty or a fake name that we have to generate to call 
    //              RegisterName.  This is CRUCIAL since RegisterName sets the TemplatedParent
    //              and the TemplateChildIndex on the Object 
    //      If we're dealing with the root, wire the Object to the parent (via FE.TemplateChild 
    //          if we're dealing with an FE as the container or using FEF if it's not an FE)
    //      Invalidate properties on the Object 
    private DependencyObject LoadOptimizedTemplateContent(DependencyObject container,
        IComponentConnector componentConnector,
        IStyleConnector styleConnector, List<DependencyObject> affectedChildren, UncommonField<Hashtable> templatedNonFeChildrenField)
    { 
        if (Names == null)
        { 
            Names = new XamlContextStack<Frame>(/*() => new Frame() cym comment*/ null ); 
        }
        DependencyObject rootObject = null; 

//        if (TraceMarkup.IsEnabled)
//        {
//            TraceMarkup.Trace(TraceEventType.Start, TraceMarkup.Load); 
//        }

        FrameworkElement feContainer = container as FrameworkElement; 
        boolean isTemplatedParentAnFE = feContainer != null;

        TemplateNameScope nameScope = new TemplateNameScope(container, affectedChildren, this);
        XamlObjectWriterSettings settings = org.summer.view.widget.markup.XamlReader.CreateObjectWriterSettings(_templateHolder.ObjectWriterParentSettings);
        settings.ExternalNameScope = nameScope;
        settings.RegisterNamesOnExternalNamescope = true; 

        IEnumerator<String> nameEnumerator = ChildNames.GetEnumerator(); 

        // Delegate for AfterBeginInit event
        //cym add new
        settings.AfterBeginInitHandler = new
            delegate(Object sender, XamlObjectEventArgs args)
            {
                HandleAfterBeginInit(args.Instance, /*ref*/ rootObject, container, feContainer, nameScope, nameEnumerator);
            }; 
        // Delegate for BeforeProperties event
            //cym add new
        settings.BeforePropertiesHandler = new
            delegate(Object sender, XamlObjectEventArgs args) 
            {
                HandleBeforeProperties(args.Instance, /*ref*/ rootObject, container, feContainer, nameScope); 
            };
        // Delegate for XamlSetValue event
        //cym add new
        settings.XamlSetValueHandler =
            new delegate(Object sender, XamlSetValueEventArgs setArgs) 
        {
            setArgs.Handled = ReceivePropertySet(sender, setArgs.Member, setArgs.Value, container); 
        }; 

        XamlObjectWriter objectWriter = _templateHolder.ObjectWriterFactory.GetXamlObjectWriter(settings); 

        try
        {
            LoadTemplateXaml(objectWriter); 
        }
        finally 
        { 
            if (TraceMarkup.IsEnabled)
            { 
                TraceMarkup.Trace(TraceEventType.Stop, TraceMarkup.Load, rootObject);
            }
        }
        return rootObject; 
    }

    /// <SecurityNote> 
    /// Critical: Accesses and asserts critical LoadPermission
    /// Safe: The XAML to load comes from _templateHolder.PlayXaml, which is SecurityCritcal and 
    ///       guaranteed to have demanded _templateHolder.LoadPermission before being set.
    /// </SecurityNote>
//    [SecurityCritical, SecurityTreatAsSafe]
    private void LoadTemplateXaml(XamlObjectWriter objectWriter) 
    {
        /*System.Xaml.*/XamlReader templateReader = _templateHolder.PlayXaml(); 
//        Debug.Assert(templateReader != null, "PlayXaml returned null"); 
        if (_templateHolder.LoadPermission != null)
        { 
            _templateHolder.LoadPermission.Assert();
            try
            {
                LoadTemplateXaml(templateReader, objectWriter); 
            }
            finally 
            { 
                CodeAccessPermission.RevertAssert();
            } 
        }
        else
        {
            LoadTemplateXaml(templateReader, objectWriter); 
        }
    } 

    private void LoadTemplateXaml(/*System.Xaml.*/XamlReader templateReader, XamlObjectWriter currentWriter)
    { 
        try
        {
            int nestedTemplateDepth = 0;

            while (templateReader.Read())
            { 
                // We need to call the ObjectWriter first because x:Name & RNPA needs to be registered 
                // before we call InvalidateProperties.
                currentWriter.WriteNode(templateReader); 

                switch (templateReader.NodeType)
                {
                    case /*System.Xaml.XamlNodeType.*/None: 
                    case /*System.Xaml.XamlNodeType.*/NamespaceDeclaration:
                        break; 
                    case /*System.Xaml.XamlNodeType.*/StartObject: 
                        {
                            // If parent is a namescope or was inside a nested namescope, make the new frame inside a nested namescope 
                            // See usage in HandleAfterBeginInit()
                            boolean isInsideNameScope = Names.Depth > 0 && (IsNameScope(Names.CurrentFrame.Type) || Names.CurrentFrame.InsideNameScope);
                            Names.PushScope();
                            Names.CurrentFrame.Type = templateReader.Type; 
                            if (isInsideNameScope)
                            { 
                                Names.CurrentFrame.InsideNameScope = true; 
                            }
                        } 
                        break;

                    case /*System.Xaml.XamlNodeType.*/GetObject:
                        { 
                            // If parent is a namescope or was inside a nested namescope, make the new frame inside a nested namescope
                            boolean isInsideNameScope = IsNameScope(Names.CurrentFrame.Type) || Names.CurrentFrame.InsideNameScope; 
                            Names.PushScope(); 
                            Names.CurrentFrame.Type = Names.PreviousFrame.Property.Type;
                            if (isInsideNameScope) 
                            {
                                Names.CurrentFrame.InsideNameScope = true;
                            }
                        } 
                        break;

                    case /*System.Xaml.XamlNodeType.*/StartMember: 
                        Names.CurrentFrame.Property = templateReader.Member;
                        if (templateReader.Member.DeferringLoader != null) 
                        {
                            nestedTemplateDepth += 1;
                        }
                        break; 

                    case /*System.Xaml.XamlNodeType.*/EndMember: 
                        if (Names.CurrentFrame.Property.DeferringLoader != null) 
                        {
                            nestedTemplateDepth -= 1; 
                        }
                        Names.CurrentFrame.Property = null;
                        break;

                    case /*System.Xaml.XamlNodeType.*/EndObject:
                        Names.PopScope(); 
                        break; 

                    case /*System.Xaml.XamlNodeType.*/Value: 
                        if (nestedTemplateDepth == 0)
                        {
                            if (Names.CurrentFrame.Property == XamlLanguage.ConnectionId)
                            { 
                                if (_styleConnector != null)
                                { 
                                    _styleConnector.Connect((int)templateReader.Value, Names.CurrentFrame.Instance); 
                                }
                            } 
                        }
                        break;

                    default: 
//                        Debug.Assert(false, "Unknown enum value");
                        break; 
                } 
            }
        } 
        catch (Exception e)
        {
            if (/*CriticalExceptions.IsCriticalException(e) ||*/ e instanceof /*System.Windows.Markup.*/XamlParseException)
            { 
                throw e;
            } 
            org.summer.view.widget.markup.XamlReader.RewrapException(e, null); 
        }
    } 

    /*internal*/public static boolean IsNameProperty(XamlMember member, XamlType owner)
    {
        if (member == owner.GetAliasedProperty(XamlLanguage.Name) 
             || XamlLanguage.Name == member)
        { 
            return true; 
        }
        return false; 
    }

    private void HandleAfterBeginInit(Object createdObject,
        /*ref*/ DependencyObject rootObject, 
        DependencyObject container,
        FrameworkElement feContainer, 
        TemplateNameScope nameScope, 
        IEnumerator<String> nameEnumerator)
    { 
        // We need to wire names for all FEs and FCEs.  We do this as soon as the Object is
        // initalized since it needs to happen before we assign any properties or wire to the parent
        if (!Names.CurrentFrame.InsideNameScope &&
            (createdObject instanceof FrameworkElement || createdObject instanceof FrameworkContentElement)) 
        {
            nameEnumerator.MoveNext(); 
            nameScope.RegisterNameInternal(nameEnumerator.Current, createdObject); 
        }

        Names.CurrentFrame.Instance = createdObject;
    }

    private void HandleBeforeProperties(Object createdObject, 
        /*ref*/ DependencyObject rootObject,
        DependencyObject container, 
        FrameworkElement feContainer, 
        INameScope nameScope)
    { 
        if (createdObject instanceof FrameworkElement || createdObject instanceof FrameworkContentElement)
        {
            // We want to set TemplateChild on the parent if we are dealing with the root
            // We MUST wait until the Object is wired into the Template vis TemplateNameScope.RegisterName 
            if (rootObject == null)
            { 
                rootObject = WireRootObjectToParent(createdObject, rootObject, container, feContainer, nameScope); 
            }

            InvalidatePropertiesOnTemplate(container, createdObject);
        }
    }

    private static DependencyObject WireRootObjectToParent(Object createdObject, 
    		DependencyObject rootObject, DependencyObject container, FrameworkElement feContainer, INameScope nameScope)
    { 
        rootObject = createdObject as DependencyObject; 
        if (rootObject != null)
        { 
            // Add the root to the appropriate tree.
            if (feContainer != null)
            {
                // Put the root Object into FE.Templatechild (must be a UIElement). 
                UIElement rootElement = rootObject as UIElement;
                if (rootElement == null) 
                { 
                    throw new InvalidOperationException(/*SR.Get(SRID.TemplateMustBeFE, new Object[] { rootObject.GetType().FullName })*/);
                } 
                feContainer.TemplateChild = rootElement;

//                Debug.Assert(!(rootElement is FrameworkElement) ||
//                    ((FrameworkElement)rootElement).TemplateChildIndex != -1); 
            }
            // If we have a container that is not a FE, add to the logical tree of the FEF 
            else if (container != null) 
            {
                FrameworkElement feResult; 
                FrameworkContentElement fceResult;
                Helper.DowncastToFEorFCE(rootObject, /*out*/ feResult, /*out*/ fceResult, true);
                FrameworkElementFactory.AddNodeToLogicalTree((FrameworkContentElement)container,
                    rootObject.GetType(), feResult != null, feResult, fceResult); 
            }


            // Set the TemplateNameScope on the root
            if (NameScope.GetNameScope(rootObject) == null) 
            {
                NameScope.SetNameScope(rootObject, nameScope);
            }
        } 
        return rootObject;
    } 

    private void InvalidatePropertiesOnTemplate(DependencyObject container, Object currentObject)
    { 
        if (container != null)
        {
            DependencyObject dObject = currentObject as DependencyObject;
            if (dObject != null) 
            {
                FrameworkObject child = new FrameworkObject(dObject); 
                if (child.IsValid) 
                {
                    int templateChildIndex = child.TemplateChildIndex; 

                    // the template may have resource references for this child
                    if (StyleHelper.HasResourceDependentsForChild(templateChildIndex, /*ref*/ this.ResourceDependents))
                    { 
                        child.HasResourceReference = true;
                    } 

                    // Invalidate properties on the element that come from the template.

                    StyleHelper.InvalidatePropertiesOnTemplateNode(container,
                        child, templateChildIndex, /*ref*/ this.ChildRecordFromChildIndex, false, this.VisualTree);
                }

            }
        } 
    } 

    //+--------------------------------------------------------------------------------------------------------------- 
    //
    //  SetTemplateParentValues
    //
    //  This method takes the "template parent values" (those that look like local values in the template), which 
    //  are ordinarily shared, and sets them as local values on the FE/FCE that was just created.  This is used
    //  during serialization. 
    // 
    //+----------------------------------------------------------------------------------------------------------------

    /*internal*/public static void SetTemplateParentValues(String name,
                                                      Object element,
                                                      FrameworkTemplate frameworkTemplate, 
                                                      /*ref*/ ProvideValueServiceProvider provideValueServiceProvider)
    { 
        int childIndex; 

        // Loop through the shared values, and set them onto the element. 

        FrugalStructList<ChildRecord> childRecordFromChildIndex;
        HybridDictionary childIndexFromChildName;

        // Seal the template, and get the name->index and index->ChildRecord mappings

        if (!frameworkTemplate.IsSealed) 
        {
            frameworkTemplate.Seal(); 
        }

        childIndexFromChildName = frameworkTemplate.ChildIndexFromChildName;
        childRecordFromChildIndex = frameworkTemplate.ChildRecordFromChildIndex; 


        // Calculate the child index 

        childIndex = StyleHelper.QueryChildIndexFromChildName(name, childIndexFromChildName); 

        // Do we have a ChildRecord for this index (i.e., there's some property set on it)?

        if (childIndex < childRecordFromChildIndex.Count) 
        {
            // Yes, get the record. 

            ChildRecord child = (ChildRecord)childRecordFromChildIndex[childIndex];

            // Loop through the properties which are in some way set on this child

            for (int i = 0; i < child.ValueLookupListFromProperty.Count; i++)
            { 
                // And for each of those properties, loop through the potential values specified in the template
                // for that property on that child. 

                for (int j = 0; j < child.ValueLookupListFromProperty.Entries[i].Value.Count; j++)
                { 
                    // Get this value (in valueLookup)

                    ChildValueLookup valueLookup;
                    valueLookup = (ChildValueLookup)child.ValueLookupListFromProperty.Entries[i].Value.List[j]; 

                    // See if this value is one that is considered to be locally set on the child element 

                    if (valueLookup.LookupType == ValueLookupType.Simple
                        ||valueLookup.LookupType == ValueLookupType.Resource
                        ||valueLookup.LookupType == ValueLookupType.TemplateBinding)
                    { 

                        // This shared value is for this element, so we'll set it. 

                        Object value = valueLookup.Value;

                        // If this is a TemplateBinding, put on an expression for it, so that it can
                        // be represented correctly (e.g. for serialization).  Otherwise, keep it as an ME.

                        if (valueLookup.LookupType == ValueLookupType.TemplateBinding) 
                        {
                            value = new TemplateBindingExpression(value as TemplateBindingExtension); 

                        }

                        // Dynamic resources need to be converted to an expression also.

                        else if (valueLookup.LookupType == ValueLookupType.Resource)
                        { 
                            value = new ResourceReferenceExpression(value);
                        } 

                        // Bindings are handled as just an ME

                        // Set the value directly onto the element.

                        MarkupExtension me = value as MarkupExtension;

                        if (me != null)
                        { 
                            // This is provided for completeness, but really there's only a few 
                            // MEs that survive TemplateBamlRecordReader.  E.g. NullExtension would
                            // have been converted to a null by now.  There's only a few MEs that 
                            // are preserved, e.g. Binding and DynamicResource.  Other MEs, such as
                            // StaticResource, wouldn't be able to ProvideValue here, because we don't
                            // have a ParserContext.

                            if (provideValueServiceProvider == null)
                            { 
                                provideValueServiceProvider = new ProvideValueServiceProvider(); 
                            }

                            provideValueServiceProvider.SetData(element, valueLookup.Property);
                            value = me.ProvideValue(provideValueServiceProvider);
                            provideValueServiceProvider.ClearData();
                        } 

                        (element as DependencyObject).SetValue(valueLookup.Property, value); //sharedDp.Dp, value ); 

                    }
                } 
            }
        }
    }



    //
    //  TargetType for ControlTemplate
    //
    /*internal*/ /*virtual*/public Type TargetTypeInternal 
    {
        get { return null; } 
    } 

    // Subclasses must provide a way for the parser to directly set the 
    // target type.
    /*internal*/ public abstract void SetTargetTypeInternal(Type targetType);

    // 
    //  DataType for DataTemplate
    // 
    /*internal*/ /*virtual*/public Object DataTypeInternal 
    {
        get { return null; } 
    }

//    #region ISealable

    /// <summary>
    /// Can this template be sealed 
    /// </summary> 
    public boolean /*ISealable.*/CanSeal
    { 
        get { return true; }
    }

    /// <summary> 
    /// Is this template sealed
    /// </summary> 
//    boolean ISealable.IsSealed 
//    {
//        get { return IsSealed; } 
//    }

    /// <summary>
    /// Seal this template 
    /// </summary>
//    void ISealable.Seal() 
//    { 
//        Seal();
//    } 

//    #endregion ISealable

    // 
    //  Collection of Triggers for a ControlTemplate
    // 
    /*internal*/ /*virtual*/public TriggerCollection TriggersInternal 
    {
        get { return null; } 
    }

    //
    //  Says if this template contains any resource references 
    //
    /*internal*/public boolean HasResourceReferences 
    { 
        get { return ResourceDependents.Count > 0; }
    } 

    //
    //  Says if this template contains any resource references for properties on the container
    // 
    /*internal*/public boolean HasContainerResourceReferences
    { 
        get { return ReadInternalFlag(InternalFlags.HasContainerResourceReferences); } 
    }

    //
    //  Says if this template contains any resource references for properties on children
    //
    /*internal*/public boolean HasChildResourceReferences 
    {
        get { return ReadInternalFlag(InternalFlags.HasChildResourceReferences); } 
    } 

    // 
    //  Says if this template contains any event handlers
    //
    /*internal*/public boolean HasEventDependents
    { 
        get { return (EventDependents.Count > 0); }
    } 

    //
    //  Says if this template contains any per-instance values 
    //
    /*internal*/public boolean HasInstanceValues
    {
        get { return _hasInstanceValues; } 
    }

    // 
    // Says if we have anything listening for the Loaded or Unloaded
    // event (used for an optimization in FrameworkElement). 
    //
    /*internal*/public boolean HasLoadedChangeHandler
    {
        get { return ReadInternalFlag(InternalFlags.HasLoadedChangeHandler); } 
        set { WriteInternalFlag(InternalFlags.HasLoadedChangeHandler, value); }
    } 


    // 
    // Give the template its own copy of the parser context.  It needs a copy, because it's
    // going to use it later on every application.
    //
    /*internal*/public void CopyParserContext(ParserContext parserContext) 
    {
        _parserContext = parserContext.ScopedCopy(false /*copyNameScopeStack*/ ); 

        // We need to clear the Journal bit, because we know we won't be able to honor it correctly.
        // Journaling journals the properties in the logical tree, so doesn't journal properties in the 
        // Template/Resources.  This shouldn't be hard-coded here, but is an /*internal*/ solution for V1.
        _parserContext.SkipJournaledProperties = false;
    }

    //
    // ParserContext cached with this template. 
    // 
    /*internal*/public ParserContext ParserContext
    { 
        get { return _parserContext; }
    }


    //
    //  Store all the event handlers for this Style TargetType 
    // 
    /*internal*/public EventHandlersStore EventHandlersStore
    { 
        get { return _eventHandlersStore; }
    }

    // 
    // Style and component connectors used during template
    // application. 
    // 
    /*internal*/public IStyleConnector StyleConnector
    { 
        get { return _styleConnector; }
        set { _styleConnector = value; }
    }
    /*internal*/public IComponentConnector ComponentConnector 
    {
        get { return _componentConnector; } 
        set { _componentConnector = value; } 
    }


    //
    // Prefetched values for static resources
    // 
    /*internal*/public Object[] StaticResourceValues
    { 
        get { return _staticResourceValues; } 
        set { _staticResourceValues = value; }
    } 

    /*internal*/public boolean HasXamlNodeContent
    {
        get { return _hasXamlNodeContent; } 
    }

    /*internal*/public HybridDictionary ChildIndexFromChildName 
    {
        get { return _childIndexFromChildName; } 
    }

    /*internal*/public Dictionary<Integer, Type> ChildTypeFromChildIndex
    { 
        get { return _childTypeFromChildIndex; }
    } 

    /*internal*/public int LastChildIndex
    { 
        get { return _lastChildIndex; }
        set { _lastChildIndex = value; }
    }

    /*internal*/public List<String> ChildNames
    { 
        get { return _childNames; } 
    }

//    #endregion NonPublicProperties

//    #region Data

    private InternalFlags _flags;
    private boolean _sealed;    // passed by ref, so cannot use flags 
    /*internal*/ boolean _hasInstanceValues; // passed by ref, so cannot use flags 

    private ParserContext _parserContext; 
    private IStyleConnector _styleConnector;
    private IComponentConnector _componentConnector;

    // If we're a FEF-based template, we'll have a _templateRoot. 

    private FrameworkElementFactory _templateRoot; 
    private TemplateContent _templateHolder; 
    private boolean _hasXamlNodeContent;

    //
    //  Used to generate childIndex for each TemplateNode
    //
    private HybridDictionary _childIndexFromChildName = new HybridDictionary(); 
    private Dictionary<Integer, Type> _childTypeFromChildIndex = new Dictionary<Integer, Type>();
    private int _lastChildIndex = 1; // 0 means "self" (container), no instance ever has index 0 
    private List<String> _childNames = new List<String>(); 

    // 
    // Resource dictionary associated with this template.
    //
    /*internal*/public ResourceDictionary _resources = null;

    //
    //  Used by EventTrigger: Maps a RoutedEventID to a set of TriggerAction objects 
    //  to be performed. 
    //
    /*internal*/public HybridDictionary _triggerActions = null; 

    //
    // Shared tables used during GetValue
    // 
    /*internal*/public FrugalStructList<ChildRecord> ChildRecordFromChildIndex = new FrugalStructList<ChildRecord>(); // Indexed by Child.ChildIndex

    // 
    // Shared tables used during OnTriggerSourcePropertyInvalidated
    // 
    /*internal*/public FrugalStructList<ItemStructMap<TriggerSourceRecord>> TriggerSourceRecordFromChildIndex = new FrugalStructList<ItemStructMap<TriggerSourceRecord>>();

    // Dictionary of property triggers that have TriggerActions, keyed via DP.GlobalIndex affecting those triggers.
    //  Each trigger can be listed multiple times, if they are dependent on multiple properties. 
    /*internal*/public FrugalMap PropertyTriggersWithActions;

    // 
    // Shared tables used during OnStyleInvalidated/OnTemplateInvalidated/InvalidateTree
    // 

    // Properties driven on the container (by the Style) that should be
    // invalidated when the style gets applied/unapplied. These properties
    // could have been set via Style.SetValue or VisualTrigger.SetValue 
    /*internal*/public FrugalStructList<ContainerDependent> ContainerDependents = new FrugalStructList<ContainerDependent>();

    // Properties driven by a resource that should be invalidated 
    // when a resource dictionary changes or when the tree changes
    // or when a Style is Invalidated 
    /*internal*/public FrugalStructList<ChildPropertyDependent> ResourceDependents = new FrugalStructList<ChildPropertyDependent>();

    // Data trigger information.  An entry for each Binding that appears in a
    // condition of a data trigger. 
    // Synchronized: Covered by Style instance
    /*internal*/public HybridDictionary _dataTriggerRecordFromBinding; 

    // An entry for each Binding that appears in a DataTrigger with EnterAction or ExitAction
    //  This overlaps but should not be the same as _dataTriggerRecordFromBinding above: 
    //   A DataTrigger can have Setters but no EnterAction/ExitAction.  (The reverse can also be true.)
    /*internal*/public HybridDictionary DataTriggersWithActions = null;

    // It is possible for trigger events to occur before template expansion has 
    //  taken place.  In these cases, we cannot resolve the appropriate target name
    //  at that time.  We defer invoking these actions until template expansion 
    //  is complete. 
    // The key to the dictionary are the individual Object instances that this
    //  template applies to.  (We might be holding deferred actions for multiple 
    //  objects.)
    // The value of the dictionary is the trigger Object and one of its action
    //  lists stored in the struct DeferredAction.
    /*internal*/public ConditionalWeakTable<DependencyObject,List<DeferredAction>> DeferredActions = null; 


    // Keep track of the template children elements for which the template has a Loaded 
    // or Unloaded listener.

    /*internal*/ class TemplateChildLoadedFlags
    {
        public boolean HasLoadedChangedHandler;
        public boolean HasUnloadedChangedHandler; 
    }

    /*internal*/ HybridDictionary _TemplateChildLoadedDictionary = new HybridDictionary(); 


    //
    // Shared tables used during Event Routing
    //

    // Events driven by a this style. An entry for every childIndex that has associated events.
    // childIndex '0' is used to represent events set ont he style's TargetType. This data-structure 
    // will be frequently looked up during event routing. 
    /*internal*/ ItemStructList<ChildEventDependent> EventDependents = new ItemStructList<ChildEventDependent>(1);

    // Used to store a private delegate that called back during event
    // routing so we can process EventTriggers
    private EventHandlersStore _eventHandlersStore = null;

    // Prefetched values for StaticResources
    private Object[] _staticResourceValues = null; 

//#if STYLE_TRACE
//    // Time that is used only when style tracing is enabled 
//    private MS.Internal.Utility.HFTimer _timer = new MS.Internal.Utility.HFTimer();
//#endif

//#if DEBUG 
//    // Debug counter for intelligent breakpoints.
//    static private int _globalDebugInstanceCounter = 0; 
//    private int        _debugInstanceCounter; 
//#endif

//    [Flags]
    private enum InternalFlags //: uint
    {
        //Sealed                          = 0x00000001, 
        //HasInstanceValues               = 0x00000002,
        CanBuildVisualTree ,//= 0x00000004, 
        HasLoadedChangeHandler ,//= 0x00000008, 
        HasContainerResourceReferences ,//= 0x00000010,
        HasChildResourceReferences ,//= 0x00000020, 
    }

//    #endregion Data
} 