/**
 * Second Check 12-16
 * Helper
 */
define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty", "windows/DependencyObject"], 
		function(declare, Type, DependencyProperty, DependencyObject){
	
	
    var FindResourceHelper  = declare("FindResourceHelper", null,{
    	constructor:function(/*object*/ name)
	    {
	        this._name = name;
	        this._resource = null; 
	    }
    });
//    internal object 
    FindResourceHelper.TryCatchWhen = function()
    { 
        Dispatcher.CurrentDispatcher.WrappedInvoke(new DispatcherOperationCallback(DoTryCatchWhen),
                                                                                    null,
                                                                                    1,
                                                                                    new DispatcherOperationCallback(CatchHandler)); 
        return _resource;
    };

//    private object 
    function DoTryCatchWhen(/*object*/ arg)
    { 
        throw new ResourceReferenceKeyNotFoundException(SR.Get(SRID.MarkupExtensionResourceNotFound, _name), _name);
    }

//    private object 
    function CatchHandler(/*object*/ arg) 
    {
        this._resource = Type.UnsetValue; 
        return null; 
    }
    
    
    // This class reprents an item value that arises from a non-local source (e.g. current-value) 
    var ModifiedItemValue  = declare("ModifiedItemValue", null,{
    	constructor:function(/*object*/ value, /*FullValueSource*/ valueSource)
        { 
            this._value = value;
            this._valueSource = valueSource; 
        } 
    });
    
    Object.defineProperties(ModifiedItemValue, {
//        public object 
        Value: { get:function() { return this._value; } },

//        public bool 
        IsCoercedWithCurrentValue:
        {
            get:function() { return (this._valueSource & FullValueSource.IsCoercedWithCurrentValue) != 0; } 
        }
    });
    
	   // ItemValueStorage.  For each data item it stores a list of (DP, value) pairs that we want to preserve on the container. 
//  private static readonly UncommonField<WeakDictionary<object, List<KeyValuePair<int, object>>>> 
    var ItemValueStorageField = new UncommonField/*<WeakDictionary<object, List<KeyValuePair<int, object>>>>*/();

	var Helper = declare("Helper", null,{});
	
//	internal static object 
	Helper.ResourceFailureThrow = function(/*object*/ key) 
    {
        var helper = new FindResourceHelper(key);
        return helper.TryCatchWhen();
    };


    // Find a data template (or table template) resource
//    internal static object 
    Helper.FindTemplateResourceFromAppOrSystem = function(/*DependencyObject*/ target, /*ArrayList*/ keys, 
    		/*int*/ exactMatch, /*ref int bestMatch*/bestMatchRef) 
    {
        /*object*/var resource = null; 
        var k; 

        // Comment out below three lines code. 
        // For now, we will always get the resource from Application level
        // if the resource exists.
        //
        // But we do need to have a right design in the future that can make 
        // sure the tree get the right resource updated while the Application
        // level resource is changed later dynamically. 
        // 
        //
        /*Application*/var app = Application.Current;
        if (app != null) 
        { 
            // If the element is rooted to a Window and App exists, defer to App.
            for (k = 0;  k < bestMatchRef.bestMatch;  ++k) 
            {
                /*object*/var appResource = Application.Current.FindResourceInternal(keys.Get(k));
                if (appResource != null)
                { 
                	bestMatchRef.bestMatch = k;
                    resource = appResource; 

                    if (bestMatchRef.bestMatch < exactMatch)
                        return resource; 
                }
            }
        }

        // if best match is not found from the application level,
        // try it from system level. 
        if (bestMatchRef.bestMatch >= exactMatch) 
        {
            // Try the system resource collection. 
            for (k = 0;  k < bestMatchRef.bestMatch;  ++k)
            {
                /*object*/var sysResource = SystemResources.FindResourceInternal(keys.Get(k));
                if (sysResource != null) 
                {
                	bestMatchRef.bestMatch = k; 
                    resource = sysResource; 

                    if (bestMatchRef.bestMatch < exactMatch) 
                        return resource;
                }
            }
        } 

        return resource; 
    };

    /// <summary>
    ///     This method finds the mentor by looking up the InheritanceContext
    ///     links starting from the given node until it finds an FE/FCE. This 
    ///     mentor will be used to do a FindResource call while evaluating this
    ///     expression. 
    /// </summary> 
    /// <remarks>
    ///     This method is invoked by the ResourceReferenceExpression 
    ///     and BindingExpression
    /// </remarks>
//    internal static DependencyObject 
    Helper.FindMentor = function(/*DependencyObject*/ d)
    { 
        // Find the nearest FE/FCE InheritanceContext
        while (d != null) 
        { 
            var feOut = {
            	"fe" : fe
            };
            
            var fceOut = {
            	"fce" : fce
            };
            Helper.DowncastToFEorFCE(d, /*out fe*/feOut, /*out fce*/fceOut, false);
            /*FrameworkElement*/var fe = feOut.fe;
            /*FrameworkContentElement*/var fce = fceOut.fce;

            if (fe != null)
            { 
                return fe;
            } 
            else if (fce != null) 
            {
                return fce; 
            }
            else
            {
                d = d.InheritanceContext; 
            }
        } 

        return null;
    }; 

    /// <summary>
    /// Return true if the given property is not set locally or from a style
    /// </summary> 
//    internal static bool 
    Helper.HasDefaultValue = function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
    { 
        return HasDefaultOrInheritedValueImpl(d, dp, false, true); 
    };

    /// <summary>
    /// Return true if the given property is not set locally or from a style or by inheritance
    /// </summary>
//    internal static bool 
    Helper.HasDefaultOrInheritedValue = function(/*DependencyObject*/ d, /*DependencyProperty*/ dp) 
    {
        return HasDefaultOrInheritedValueImpl(d, dp, true, true); 
    }; 

    /// <summary> 
    /// Return true if the given property is not set locally or from a style
    /// </summary>
//    internal static bool 
    Helper.HasUnmodifiedDefaultValue = function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
    { 
        return HasDefaultOrInheritedValueImpl(d, dp, false, false);
    };

    /// <summary>
    /// Return true if the given property is not set locally or from a style or by inheritance 
    /// </summary>
//    internal static bool 
    Helper.HasUnmodifiedDefaultOrInheritedValue = function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
    {
        return HasDefaultOrInheritedValueImpl(d, dp, true, false); 
    };

    /// <summary> 
    /// Return true if the given property is not set locally or from a style
    /// </summary> 
//    private static bool 
    function HasDefaultOrInheritedValueImpl(/*DependencyObject*/ d, /*DependencyProperty*/ dp,
                                                            /*bool*/ checkInherited,
                                                            /*bool*/ ignoreModifiers)
    { 
        /*PropertyMetadata*/var metadata = dp.GetMetadata(d);
        var hasModifiers; 
        var hasModifiersOut = {
        	"hasModifiers" : hasModifiers
        };
        /*BaseValueSourceInternal*/var source = d.GetValueSource(dp, metadata, hasModifiersOut/*out hasModifiers*/);
        hasModifiers = hasModifiersOut.hasModifiers;

        if (source == BaseValueSourceInternal.Default || 
            (checkInherited && source == BaseValueSourceInternal.Inherited))
        {
            if (ignoreModifiers)
            { 
                // ignore modifiers on FE/FCE, for back-compat
                if (d instanceof FrameworkElement || d instanceof FrameworkContentElement) 
                { 
                    hasModifiers = false;
                } 
            }

            // a default or inherited value might be animated or coerced.  We should
            // return false in that case - the hasModifiers flag tests this. 
            // (An expression modifier can't apply to a default or inherited value.)
            return !hasModifiers; 
        } 

        return false; 
    }

    /// <summary>
    /// Downcast the given DependencyObject into FrameworkElement or 
    /// FrameworkContentElement, as appropriate.
    /// </summary> 
//    internal static void 
    Helper.DowncastToFEorFCE = function(/*DependencyObject*/ d, 
                                /*out FrameworkElement fe*/feOut, /*out FrameworkContentElement fce*/fceOut,
                                /*bool*/ throwIfNeither) 
    {
        if (FrameworkElement.DType.IsInstanceOfType(d))
        {
        	feOut.fe = d; 
        	fceOut.fce = null;
        } 
        else if (FrameworkContentElement.DType.IsInstanceOfType(d)) 
        {
        	feOut.fe = null; 
        	fceOut.fce = d;
        }
        else if (throwIfNeither)
        { 
            throw new InvalidOperationException(SR.Get(SRID.MustBeFrameworkDerived, d.GetType()));
        } 
        else 
        {
        	feOut.fe = null; 
        	fceOut.fce = null;
        }
    };

    /// <summary> 
    /// Issue a trace message if both the xxxStyle and xxxStyleSelector 
    /// properties are set on the given element.
    /// </summary> 
//    internal static void 
    Helper.CheckStyleAndStyleSelector = function(/*string*/ name,
                                                    /*DependencyProperty*/ styleProperty,
                                                    /*DependencyProperty*/ styleSelectorProperty,
                                                    /*DependencyObject*/ d) 
    {
        // Issue a trace message if user defines both xxxStyle and xxxStyleSelector 
        // (bugs 1007020, 1019240).  Only explicit local values or resource 
        // references count;  data-bound or styled values don't count.
        // Do not throw here (bug 1434271), because it's very confusing if the 
        // user tries to continue from this exception.
//        if (TraceData.IsEnabled)
//        {
//            object styleSelector = d.ReadLocalValue(styleSelectorProperty); 
//
//            if (styleSelector != DependencyProperty.UnsetValue && 
//                (styleSelector is System.Windows.Controls.StyleSelector || styleSelector is ResourceReferenceExpression)) 
//            {
//                object style = d.ReadLocalValue(styleProperty); 
//
//                if (style != DependencyProperty.UnsetValue &&
//                    (style is Style || style is ResourceReferenceExpression))
//                { 
//                    TraceData.Trace(TraceEventType.Error, TraceData.StyleAndStyleSelectorDefined(name), d);
//                } 
//            } 
//        }
    }; 

    /// <summary>
    /// Issue a trace message if both the xxxTemplate and xxxTemplateSelector
    /// properties are set on the given element. 
    /// </summary>
//    internal static void 
    Helper.CheckTemplateAndTemplateSelector = function(/*string*/ name, 
                                                    /*DependencyProperty*/ templateProperty, 
                                                    /*DependencyProperty*/ templateSelectorProperty,
                                                    /*DependencyObject*/ d) 
    {
        // Issue a trace message if user defines both xxxTemplate and xxxTemplateSelector
        // (bugs 1007020, 1019240).  Only explicit local values or resource
        // references count;  data-bound or templated values don't count. 
        // Do not throw here (bug 1434271), because it's very confusing if the
        // user tries to continue from this exception. 
//        if (TraceData.IsEnabled) 
//        {
//            if (IsTemplateSelectorDefined(templateSelectorProperty, d)) 
//            {
//                if (IsTemplateDefined(templateProperty, d))
//                {
//                    TraceData.Trace(TraceEventType.Error, TraceData.TemplateAndTemplateSelectorDefined(name), d); 
//                }
//            } 
//        } 
    };

    /// <summary>
    /// Check whether xxxTemplateSelector property is set on the given element.
    /// Only explicit local values or resource references count;  data-bound or templated values don't count.
    /// </summary> 
//    internal static bool 
    Helper.IsTemplateSelectorDefined = function(/*DependencyProperty*/ templateSelectorProperty, /*DependencyObject*/ d)
    { 
        // Check whether xxxTemplateSelector property is set on the given element. 
        var templateSelector = d.ReadLocalValue(templateSelectorProperty);
        // the checks for UnsetValue and null are for perf: 
        // they're redundant to the type checks, but they're cheaper
        return (templateSelector != Type.UnsetValue &&
                templateSelector != null &&
               (templateSelector instanceof /*System.Windows.Controls.*/DataTemplateSelector || 
                templateSelector instanceof ResourceReferenceExpression));
    };

    /// <summary>
    /// Check whether xxxTemplate property is set on the given element. 
    /// Only explicit local values or resource references count;  data-bound or templated values don't count.
    /// </summary>
//    internal static bool 
    Helper.IsTemplateDefined = function(/*DependencyProperty*/ templateProperty, /*DependencyObject*/ d)
    { 
        // Check whether xxxTemplate property is set on the given element.
        var template = d.ReadLocalValue(templateProperty); 
        // the checks for UnsetValue and null are for perf: 
        // they're redundant to the type checks, but they're cheaper
        return (template != Type.UnsetValue && 
                template != null &&
                (template instanceof FrameworkTemplate ||
                template instanceof ResourceReferenceExpression));
    };
    ///<summary> 
    ///     Helper method to find an object by name inside a template 
    ///</summary>
//    internal static object 
    Helper.FindNameInTemplate = function(/*string*/ name, /*DependencyObject*/ templatedParent) 
    {
        /*FrameworkElement*/var fe = templatedParent instanceof FrameworkElement ? templatedParent : null;
        return fe.TemplateInternal.FindName(name, fe);
    };

    /// <summary>
    /// Find the IGeneratorHost that is responsible (possibly indirectly) 
    /// for the creation of the given DependencyObject.
    /// </summary>
//    internal static MS.Internal.Controls.IGeneratorHost 
    Helper.GeneratorHostForElement = function(/*DependencyObject*/ element)
    { 
        /*DependencyObject*/var d = null;
        /*DependencyObject*/var parent = null; 

        // 1. Follow the TemplatedParent chain to the end.  This should be
        // the ItemContainer. 
        while (element != null)
        {
            while (element != null)
            { 
                d = element;
                element= Helper.GetTemplatedParent(element); 

                // Special case to display the selected item in a ComboBox, when
                // the items are XmlNodes and the DisplayMemberPath is an XPath 
                // that uses namespace prefixes (Dev10 bug 459976).  We need an
                // XmlNamespaceManager to map prefixes to namespaces, and in this
                // special case we should use the ComboBox itself, rather than any
                // surrounding ItemsControl.  There's no elegant way to detect 
                // this situation;  the following code is a child of necessity.
                // It relies on the fact that the "selection box" is implemented 
                // by a ContentPresenter in the ComboBox's control template, and 
                // any ContentPresenter whose TemplatedParent is a ComboBox is
                // playing the role of "selection box". 
                if (d instanceof ContentPresenter)
                {
                    /*ComboBox*/var cb = element instanceof ComboBox ? element : null;
                    if (cb != null) 
                    {
                        return cb; 
                    } 
                }
            } 

            /*Visual*/var v = d instanceof Visual ? d: null;
            if (v != null)
            { 
                parent = VisualTreeHelper.GetParent(v);

                // In ListView, we should rise through a GridView*RowPresenter 
                // even though it is not the TemplatedParent (bug 1937470)
                element = parent instanceof GridViewRowPresenterBase ? parent : null; 
            }
            else
            {
                parent = null; 
            }
        } 

        // 2. In an ItemsControl, the container's parent is the "ItemsHost"
        // panel, from which we get to the ItemsControl by public API. 
        if (parent != null)
        {
            /*ItemsControl*/var ic = ItemsControl.GetItemsOwner(parent);
            if (ic != null) 
                return ic;
        } 

        return null;
    };
    
//    internal static DependencyObject 
    Helper.GetTemplatedParent = function(/*DependencyObject*/ d)
    {
        var feOut = {"fe" : null};
        var fceOut = {"fce" : null};
        
        Helper.DowncastToFEorFCE(d, /*out fe*/feOut, /*out fce*/fceOut, false); 
        /*FrameworkElement*/var fe = feOut.fe;
        /*FrameworkContentElement*/ fce = fceOut.fce;
        if (fe != null) 
            return fe.TemplatedParent;
        else if (fce != null) 
            return fce.TemplatedParent;

        return null;
    };

    /// <summary> 
    /// Find the XmlDataProvider (if any) that is associated with the 
    /// given DependencyObject.
    /// This method only works when the DO is part of the generated content 
    /// of an ItemsControl or TableRowGroup.
    /// </summary>
//    internal static System.Windows.Data.XmlDataProvider 
    Helper.XmlDataProviderForElement = function(/*DependencyObject*/ d)
    { 
        /*IGeneratorHost*/var host = Helper.GeneratorHostForElement(d);
        /*ItemCollection*/var ic = (host != null) ? host.View : null; 
        /*ICollectionView*/var icv = (ic != null) ? ic.CollectionView : null; 
        /*XmlDataCollection*/var xdc = (icv != null) ? (icv.SourceCollection instanceof XmlDataCollection ? icv.SourceCollection : null): null;

        return (xdc != null) ? xdc.ParentXmlDataProvider : null;
    };

    /// <summary> 
    /// Measure a simple element with a single child. 
    /// </summary>
//    internal static Size 
    Helper.MeasureElementWithSingleChild = function(/*UIElement*/ element) 
    {
    	var child = null;
        /*UIElement*/ var create = VisualTreeHelper.GetChildrenCount(element) > 0;
        if(create){
            child = VisualTreeHelper.GetChild(element, 0);
            child = child instanceof UIElement ? child : null;
        }


        if (child != null) 
        {
            child.Measure(); 
        }
    };

    /// <summary>
    /// Arrange a simple element with a single child. 
    /// </summary> 
//    internal static Size 
    Helper.ArrangeElementWithSingleChild = function(/*UIElement*/ element)
    { 
    	var child = null;
        /*UIElement*/ var create = VisualTreeHelper.GetChildrenCount(element) > 0;
        if(create){
            child = VisualTreeHelper.GetChild(element, 0);
            child = child instanceof UIElement ? child : null;
        }
        
        if (child != null)
        { 
            child.Arrange();
            
            element._dom.appendChild(child._dom);
        } 
    };

    /// <summary>
    /// Helper method used for double parameter validation.  Returns false
    /// if the value is either Infinity (positive or negative) or NaN. 
    /// </summary>
    /// <param name="value">The double value to test</param> 
    /// <returns>Whether the value is a valid double.</returns> 
//    internal static bool 
    Helper.IsDoubleValid = function(/*double*/ value)
    { 
//        return !(Double.IsInfinity(value) || Double.IsNaN(value));
    };

    /// <summary> 
    /// Checks if the given IProvideValueTarget can receive
    /// a DynamicResource or Binding MarkupExtension. 
    /// </summary> 
//    internal static void 
    Helper.CheckCanReceiveMarkupExtension = function(
            /*MarkupExtension*/     markupExtension, 
            /*IServiceProvider*/    serviceProvider,
        /*out DependencyObject    targetDependencyObject*/targetDependencyObjectOut,
        /*out DependencyProperty  targetDependencyProperty*/targetDependencyPropertyOut)
    { 
    	targetDependencyObjectOut.targetDependencyObject = null;
    	targetDependencyPropertyOut.targetDependencyProperty = null; 

        /*IProvideValueTarget*/var provideValueTarget = serviceProvider.GetService(IProvideValueTarget.Type);
        provideValueTarget = provideValueTarget.isInstanceOf(IProvideValueTarget) ? provideValueTarget : null;
        if (provideValueTarget == null) 
        {
            return;
        }

        var targetObject = provideValueTarget.TargetObject;

        if (targetObject == null) 
        {
            return; 
        }

        var targetType = targetObject.GetType();
        var targetProperty = provideValueTarget.TargetProperty; 

        if (targetProperty != null) 
        { 
        	targetDependencyPropertyOut.targetDependencyProperty = targetProperty instanceof DependencyProperty ? targetProperty : null;
            if (targetDependencyPropertyOut.targetDependencyProperty != null) 
            {
                // This is the DependencyProperty case

            	targetDependencyObjectOut.targetDependencyObject = targetObject instanceof DependencyObject ? targetObject : null; 
//                Debug.Assert(targetDependencyObject != null, "DependencyProperties can only be set on DependencyObjects");
            } 
//            else 
//            {
//                var targetMember = targetProperty instanceof MemberInfo ? targetProperty : null; 
//                if (targetMember != null)
//                {
//                    // This is the Clr Property case
//                    var propertyInfo = targetMember instanceof PropertyInfo ? targetMember : null; 
//
//                    // Setters, Triggers, DataTriggers & Conditions are the special cases of 
//                    // Clr properties where DynamicResource & Bindings are allowed. Normally 
//                    // these cases are handled by the parser calling the appropriate
//                    // ReceiveMarkupExtension method.  But a custom MarkupExtension 
//                    // that delegates ProvideValue will end up here (see Dev11 117372).
//                    // So we handle it similarly to how the parser does it.
//
//                    /*EventHandler<System.Windows.Markup.XamlSetMarkupExtensionEventArgs>*/var setMarkupExtension 
//                        = LookupSetMarkupExtensionHandler(targetType);
//
//                    if (setMarkupExtension != null && propertyInfo != null) 
//                    {
//                        /*System.Xaml.IXamlSchemaContextProvider*/
//                    	var scp = serviceProvider.GetService(/*System.Xaml.*/IXamlSchemaContextProvider.Type);
//                    	scp = scp instanceof /*System.Xaml.*/IXamlSchemaContextProvider ? scp : null; 
//                        if (scp != null)
//                        {
//                            /*System.Xaml.XamlSchemaContext*/var sc = scp.SchemaContext;
//                            /*System.Xaml.XamlType*/var xt = sc.GetXamlType(targetType); 
//                            if (xt != null)
//                            { 
//                                /*System.Xaml.XamlMember*/var member = xt.GetMember(propertyInfo.Name); 
//                                if (member != null)
//                                { 
//                                    var eventArgs = new System.Windows.Markup.XamlSetMarkupExtensionEventArgs(member, markupExtension, serviceProvider);
//
//                                    // ask the target object whether it accepts MarkupExtension
//                                    setMarkupExtension(targetObject, eventArgs); 
//                                    if (eventArgs.Handled)
//                                        return;     // if so, all is well 
//                                } 
//                            }
//                        } 
//
//                    }
//
//
//                    // Find the MemberType
//
////                    Debug.Assert(targetMember is PropertyInfo || targetMember is MethodInfo, 
////                        "TargetMember is either a Clr property or an attached static settor method");
//
//                    /*Type*/var memberType;
//
//                    if (propertyInfo != null)
//                    { 
//                        memberType = propertyInfo.PropertyType;
//                    } 
//                    else 
//                    {
//                        /*MethodInfo*/var methodInfo = /*(MethodInfo)*/targetMember; 
//                        /*ParameterInfo[]*/var parameterInfos = methodInfo.GetParameters();
////                        Debug.Assert(parameterInfos.Length == 2, "The signature of a static settor must contain two parameters");
//                        memberType = parameterInfos[1].ParameterType;
//                    } 
//
//                    // Check if the MarkupExtensionType is assignable to the given MemberType 
//                    // This check is to allow properties such as the following 
//                    // - DataTrigger.Binding
//                    // - Condition.Binding 
//                    // - HierarchicalDataTemplate.ItemsSource
//                    // - GridViewColumn.DisplayMemberBinding
//
//                    if (!MarkupExtension.Type.IsAssignableFrom(memberType) || 
//                         !memberType.IsAssignableFrom(markupExtension.GetType()))
//                    { 
//                        throw new XamlParseException(SR.Get(SRID.MarkupExtensionDynamicOrBindingOnClrProp, 
//                                                            markupExtension.GetType().Name,
//                                                            targetMember.Name, 
//                                                            targetType.Name));
//                    }
//                }
//                else 
//                {
//                    // This is the Collection ContentProperty case 
//                    // Example: 
//                    // <DockPanel>
//                    //   <Button /> 
//                    //   <DynamicResource ResourceKey="foo" />
//                    // </DockPanel>
//
//                    // Collection<BindingBase> used in MultiBinding is a special 
//                    // case of a Collection that can contain a Binding.
//
//                    if (!BindingBase.Type.IsAssignableFrom(markupExtension.GetType()) || 
//                        !Collection.Type.IsAssignableFrom(targetProperty.GetType()))
//                    { 
//                        throw new XamlParseException(SR.Get(SRID.MarkupExtensionDynamicOrBindingInCollection,
//                                                            markupExtension.GetType().Name,
//                                                            targetProperty.GetType().Name));
//                    } 
//                }
//            } 
        } 
        else
        { 
            // This is the explicit Collection Property case
            // Example:
            // <DockPanel>
            // <DockPanel.Children> 
            //   <Button />
            //   <DynamicResource ResourceKey="foo" /> 
            // </DockPanel.Children> 
            // </DockPanel>

            // Collection<BindingBase> used in MultiBinding is a special
            // case of a Collection that can contain a Binding.

            if (!BindingBase.Type.IsAssignableFrom(markupExtension.GetType()) || 
                !Collection.Type.IsAssignableFrom(targetType))
            { 
                throw new XamlParseException(SR.Get(SRID.MarkupExtensionDynamicOrBindingInCollection, 
                                                    markupExtension.GetType().Name,
                                                    targetType.Name)); 
            }
        }
    };

////    static EventHandler<System.Windows.Markup.XamlSetMarkupExtensionEventArgs> 
//    Helper.LookupSetMarkupExtensionHandler = function(/*Type*/ type)
//    { 
//        if (Setter.Type.IsAssignableFrom(type)) 
//        {
//            return Setter.ReceiveMarkupExtension; 
//        }
//        else if (typeof(DataTrigger).IsAssignableFrom(type))
//        {
//            return DataTrigger.ReceiveMarkupExtension; 
//        }
//        else if (typeof(Condition).IsAssignableFrom(type)) 
//        { 
//            return Condition.ReceiveMarkupExtension;
//        } 
//        return null;
//    ;
//
//    // build a format string suitable for String.Format from the given argument, 
//    // by expanding the convenience form, if necessary
////    internal static string 
//    Helper.GetEffectiveStringFormat = function(/*string*/ stringFormat) 
//    { 
//        if (stringFormat.IndexOf('{') < 0)
//        { 
//            // convenience syntax - build a composite format string with one parameter
//            stringFormat = @"{0:" + stringFormat + @"}";
//        }
//
//        return stringFormat;
//    };


//    internal static object 
    Helper.ReadItemValue = function(/*DependencyObject*/ owner, /*object*/ item, /*int*/ dpIndex)
    {
        if (item != null)
        { 
            /*List<KeyValuePair<int, object>>*/var itemValues = Helper.GetItemValues(owner, item);

            if (itemValues != null) 
            {
                for (var i = 0; i < itemValues.Count; i++) 
                {
                    if (itemValues.Get(i).Key == dpIndex)
                    {
                        return itemValues.Get(i).Value; 
                    }
                } 
            } 
        }

        return null;
    };

//    internal static void 
    Helper.StoreItemValue = function(/*DependencyObject*/ owner, /*object*/ item, /*int*/ dpIndex, /*object*/ value)
    { 
        if (item != null) 
        {
            /*List<KeyValuePair<int, object>>*/var itemValues = Helper.EnsureItemValues(owner, item); 

            //
            // Find the key, if it exists, and modify its value.  Since the number of DPs we want to store
            // is typically very small, using a List in this manner is faster than hashing 
            //

            var found = false; 
            /*KeyValuePair<int, object>*/var keyValue = new KeyValuePair/*<int, object>*/(dpIndex, value);

            for (var j = 0; j < itemValues.Count; j++)
            {
                if (itemValues.Get(j).Key == dpIndex)
                { 
                    itemValues.Set(j, keyValue);
                    found = true; 
                    break; 
                }
            } 

            if (!found)
            {
                itemValues.Add(keyValue); 
            }
        } 
    };

//    internal static void 
    Helper.ClearItemValue = function(/*DependencyObject*/ owner, /*object*/ item, /*int*/ dpIndex) 
    {
        if (item != null)
        {
            /*List<KeyValuePair<int, object>>*/var itemValues = Helper.GetItemValues(owner, item); 

            if (itemValues != null) 
            { 
                for (var i = 0; i < itemValues.Count; i++)
                { 
                    if (itemValues.Get(i).Key == dpIndex)
                    {
                        itemValues.RemoveAt(i);
                        break; 
                    }
                } 
            } 
        }
    };

    /// <summary>
    /// Returns the ItemValues list for a given item.  May return null if one hasn't been set yet.
    /// </summary> 
    /// <param name="item"></param>
    /// <returns></returns> 
//    internal static List<KeyValuePair<int, object>> 
//    Helper.GetItemValues = function(/*DependencyObject*/ owner, /*object*/ item) 
//    {
//        return GetItemValues(owner, item, ItemValueStorageField.GetValue(owner)); 
//    };

//    internal static List<KeyValuePair<int, object>> 
    Helper.GetItemValues = function(/*DependencyObject*/ owner, /*object*/ item,
                                                          /*WeakDictionary<object, List<KeyValuePair<int, object>>>*/ itemValueStorage) 
    {
    	if(itemValueStorage === undefined){
    		itemValueStorage = ItemValueStorageField.GetValue(owner);
    	}
//        Debug.Assert(item != null); 
        /*List<KeyValuePair<int, object>>*/var itemValues = null; 
        
        var itemValuesOut = {
        	"itemValues" : itemValues	
        };
        if (itemValueStorage != null) 
        {
            itemValueStorage.TryGetValue(item, itemValuesOut/*out itemValues*/);
            itemValues = itemValuesOut.itemValues;
        }

        return itemValues;
    }; 


//    internal static List<KeyValuePair<int, object>> 
    Helper.EnsureItemValues = function(/*DependencyObject*/ owner, /*object*/ item) 
    {
        /*WeakDictionary<object, List<KeyValuePair<int, object>>>*/var itemValueStorage = Helper.EnsureItemValueStorage(owner);
        /*List<KeyValuePair<int, object>>*/var itemValues = Helper.GetItemValues(owner, item, itemValueStorage);

        if (itemValues == null && HashHelper.HasReliableHashCode(item))
        { 
            itemValues = new List/*<KeyValuePair<int, object>>*/(3);    // So far the only use of this is to store three values. 
            itemValueStorage.Set(item, itemValues);
        } 

        return itemValues;
    };


//    internal static WeakDictionary<object, List<KeyValuePair<int, object>>> 
    Helper.EnsureItemValueStorage = function(/*DependencyObject*/ owner) 
    { 
        /*WeakDictionary<object, List<KeyValuePair<int, object>>>*/var itemValueStorage = ItemValueStorageField.GetValue(owner);

        if (itemValueStorage == null)
        {
            itemValueStorage = new WeakDictionary/*<object, List<KeyValuePair<int, object>>>*/();
            ItemValueStorageField.SetValue(owner, itemValueStorage); 
        }

        return itemValueStorage; 
    };

    /// <summary>
    /// Sets all values saved in ItemValueStorage for the given item onto the container
    /// </summary>
    /// <param name="container"></param> 
    /// <param name="item"></param>
//    internal static void 
    Helper.SetItemValuesOnContainer = function(/*DependencyObject*/ owner, /*DependencyObject*/ container, /*object*/ item) 
    { 
        /*int[]*/var dpIndices = ItemValueStorageIndices;
        /*List<KeyValuePair<int, object>>*/var itemValues = Helper.GetItemValues(owner, item); 

        if (itemValues != null)
        {
            for (var i = 0; i < itemValues.Count; i++) 
            {
                var dpIndex = itemValues.Get(i).Key; 

                for (var j = 0; j < dpIndices.length; j++)
                { 
                    if (dpIndex == dpIndices[j])
                    {
                        var value = itemValues.Get(i).Value;
                        /*EntryIndex*/var entryIndex = container.LookupEntry(dpIndex); 
                        /*ModifiedItemValue*/var modifiedItemValue = value instanceof ModifiedItemValue ? value: null;
                        /*DependencyProperty*/var dp = DependencyProperty.RegisteredPropertyList.List[dpIndex]; 

                        if (modifiedItemValue == null)
                        { 
                            // set as local value
                            if (dp != null)
                            {
                                // for real properties, call SetValue so that the property's 
                                // change-callback is called
                                container.SetValue(dp, value); 
                            } 
                            else
                            { 
                                // for "fake" properties (no corresponding DP - e.g. VSP's desired-size),
                                // set the property directly into the effective value table
                                container.SetEffectiveValue(entryIndex, null /*dp*/, dpIndex, null /*metadata*/, value, BaseValueSourceInternal.Local);
                            } 
                        }
                        else if (modifiedItemValue.IsCoercedWithCurrentValue) 
                        { 
                            // set as current-value
                            container.SetCurrentValue(dp, modifiedItemValue.Value); 
                        }
                        break;
                    }
                } 
            }
        } 
    };

    /// <summary> 
    /// Stores the value of a container for the given item and set of dependency properties
    /// </summary>
    /// <param name="container"></param>
    /// <param name="item"></param> 
    /// <param name="dpIndices"></param>
//    internal static void 
    Helper.StoreItemValues = function(/*IContainItemStorage*/ owner, /*DependencyObject*/ container, /*object*/ item) 
    { 
        /*int[]*/var dpIndices = ItemValueStorageIndices;

        /*DependencyObject*/var ownerDO = owner;

        //
        // Loop through all DPs we care about storing.  If the container has a current-value or locally-set value we'll store it. 
        //
        for (var i = 0; i < dpIndices.length; i++) 
        { 
            var dpIndex = dpIndices[i];
            /*EntryIndex*/var entryIndex = container.LookupEntry(dpIndex); 

            if (entryIndex.Found)
            {
                /*EffectiveValueEntry*/var entry = container.EffectiveValues[entryIndex.Index]; 

                if ((entry.BaseValueSourceInternal == BaseValueSourceInternal.Local || 
                     entry.BaseValueSourceInternal == BaseValueSourceInternal.ParentTemplate) && 
                     !entry.HasModifiers)
                { 
                    // store local values that aren't modified
                    StoreItemValue(ownerDO, item, dpIndex, entry.Value);
                }
                else if (entry.IsCoercedWithCurrentValue) 
                {
                    // store current-values 
                    StoreItemValue(ownerDO, item, 
                                    dpIndex,
                                    new ModifiedItemValue(entry.ModifiedValue.CoercedValue, FullValueSource.IsCoercedWithCurrentValue)); 
                }
                else
                {
                    ClearItemValue(ownerDO, item, dpIndex); 
                }
            } 

        }
    }; 

//    internal static void 
//    Helper.ClearItemValueStorage = function(/*DependencyObject*/ owner)
//    {
//        ItemValueStorageField.ClearValue(owner); 
//    };

//    internal static void 
    Helper.ClearItemValueStorage = function(/*DependencyObject*/ owner, /*int[]*/ dpIndices) 
    {
    	if(arguments.length == 1){
    		ItemValueStorageField.ClearValue(owner);
    	}else{
    		 ClearItemValueStorageRecursive(ItemValueStorageField.GetValue(owner), dpIndices); 
    	}
    };

//    private static void 
    function ClearItemValueStorageRecursive(/*WeakDictionary<object, List<KeyValuePair<int, object>>>*/ itemValueStorage, 
    		/*int[]*/ dpIndices)
    { 
        if (itemValueStorage != null)
        { 
//            foreach (/*List<KeyValuePair<int, object>>*/var itemValuesList in itemValueStorage.Values) 
            for (/*List<KeyValuePair<int, object>>*/var itemValuesList in itemValueStorage.Values) 
            {
                for (var i=0; i<itemValuesList.Count; i++) 
                {
                    /*KeyValuePair<int, object>*/var itemValue = itemValuesList[i];
                    if (itemValue.Key == ItemValueStorageField.GlobalIndex)
                    { 
                        ClearItemValueStorageRecursive(/*(WeakDictionary<object, List<KeyValuePair<int, object>>>)*/itemValue.Value, dpIndices);
                    } 

                    for (var j=0; j<dpIndices.length; j++)
                    { 
                        if (itemValue.Key == dpIndices[j])
                        {
                            itemValuesList.RemoveAt(i--);
                            break; 
                        }
                    } 
                } 
            }
        } 
    }
//
////    internal static void 
//    Helper.ApplyCorrectionFactorToPixelHeaderSize = function(
//        /*ItemsControl*/ scrollingItemsControl, 
//        /*FrameworkElement*/ virtualizingElement,
//        /*Panel*/ itemsHost, 
//        ref Size headerSize) 
//    {
//        bool shouldApplyItemsCorrectionFactor = itemsHost != null && itemsHost.IsVisible; 
//        if (shouldApplyItemsCorrectionFactor)
//        {
//            Thickness itemsCorrectionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
//            headerSize.Height = Math.Max(itemsCorrectionFactor.Top, headerSize.Height); 
//        }
//        else 
//        { 
//            headerSize.Height = Math.Max(virtualizingElement.DesiredSize.Height, headerSize.Height);
//        } 
//        headerSize.Width = Math.Max(virtualizingElement.DesiredSize.Width, headerSize.Width);
//    };
//
////    internal static HierarchicalVirtualizationItemDesiredSizes 
//    Helper.ApplyCorrectionFactorToItemDesiredSizes = function( 
//        /*FrameworkElement*/ virtualizingElement,
//        /*Panel*/ itemsHost) 
//    { 
//        /*HierarchicalVirtualizationItemDesiredSizes*/var itemDesiredSizes =
//            GroupItem.HierarchicalVirtualizationItemDesiredSizesField.GetValue(virtualizingElement); 
//
//        if (itemsHost != null && itemsHost.IsVisible)
//        {
//            Size itemPixelSize = itemDesiredSizes.PixelSize; 
//            Size itemPixelSizeInViewport = itemDesiredSizes.PixelSizeInViewport;
//            Size itemPixelSizeBeforeViewport = itemDesiredSizes.PixelSizeBeforeViewport; 
//            Size itemPixelSizeAfterViewport = itemDesiredSizes.PixelSizeAfterViewport; 
//            bool correctionComputed = false;
//            Thickness correctionFactor = new Thickness(0); 
//            Size desiredSize = virtualizingElement.DesiredSize;
//
//            if (DoubleUtil.GreaterThan(itemPixelSize.Height, 0))
//            { 
//                correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
//                itemPixelSize.Height += correctionFactor.Bottom; 
//                correctionComputed = true; 
//            }
//            itemPixelSize.Width = Math.Max(desiredSize.Width, itemPixelSize.Width); 
//
//            if (DoubleUtil.AreClose(itemDesiredSizes.PixelSizeAfterViewport.Height, 0) &&
//                DoubleUtil.AreClose(itemDesiredSizes.PixelSizeInViewport.Height, 0) &&
//                DoubleUtil.GreaterThan(itemDesiredSizes.PixelSizeBeforeViewport.Height, 0)) 
//            {
//                if (!correctionComputed) 
//                { 
//                    correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
//                } 
//                itemPixelSizeBeforeViewport.Height += correctionFactor.Bottom;
//                correctionComputed = true;
//            }
//            itemPixelSizeBeforeViewport.Width = Math.Max(desiredSize.Width, itemPixelSizeBeforeViewport.Width); 
//
//            if (DoubleUtil.AreClose(itemDesiredSizes.PixelSizeAfterViewport.Height, 0) && 
//                DoubleUtil.GreaterThan(itemDesiredSizes.PixelSizeInViewport.Height, 0)) 
//            {
//                if (!correctionComputed) 
//                {
//                    correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
//                }
//                itemPixelSizeInViewport.Height += correctionFactor.Bottom; 
//                correctionComputed = true;
//            } 
//            itemPixelSizeInViewport.Width = Math.Max(desiredSize.Width, itemPixelSizeInViewport.Width); 
//
//            if (DoubleUtil.GreaterThan(itemDesiredSizes.PixelSizeAfterViewport.Height, 0)) 
//            {
//                if (!correctionComputed)
//                {
//                    correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement); 
//                }
//                itemPixelSizeAfterViewport.Height += correctionFactor.Bottom; 
//                correctionComputed = true; 
//            }
//            itemPixelSizeAfterViewport.Width = Math.Max(desiredSize.Width, itemPixelSizeAfterViewport.Width); 
//
//            itemDesiredSizes = new HierarchicalVirtualizationItemDesiredSizes(itemDesiredSizes.LogicalSize,
//                itemDesiredSizes.LogicalSizeInViewport,
//                itemDesiredSizes.LogicalSizeBeforeViewport, 
//                itemDesiredSizes.LogicalSizeAfterViewport,
//                itemPixelSize, 
//                itemPixelSizeInViewport, 
//                itemPixelSizeBeforeViewport,
//                itemPixelSizeAfterViewport); 
//        }
//        return itemDesiredSizes;
//    };

//    internal static void 
    Helper.ComputeCorrectionFactor = function(
        /*ItemsControl*/ scrollingItemsControl, 
        /*FrameworkElement*/ virtualizingElement, 
        /*Panel*/ itemsHost,
        /*FrameworkElement*/ headerElement) 
    {
//        Rect parentRect = new Rect(new Point(), virtualizingElement.DesiredSize);
//        bool remeasure = false;
//
//        if (itemsHost != null)
//        { 
//            Thickness itemsCorrectionFactor = new Thickness(); 
//
//            if (itemsHost.IsVisible) 
//            {
//                Rect itemsRect = itemsHost.TransformToAncestor(virtualizingElement).TransformBounds(new Rect(new Point(), itemsHost.DesiredSize));
//                itemsCorrectionFactor.Top = itemsRect.Top;
//                itemsCorrectionFactor.Bottom = parentRect.Bottom - itemsRect.Bottom; 
//
//                // the correction is supposed to be non-negative, but there's some 
//                // kind of race condition that occasionally results in a negative 
//                // value that eventually crashes in ApplyCorrectionFactorToItemDesiredSizes
//                // by setting a rect.Height to a negative number (Dev11 bugs 
//                // 381371, 409473, 411192).  We haven't been able to repro the ----,
//                // so to avoid the crash we'll artificially clamp the correction.
//                if (itemsCorrectionFactor.Bottom < 0)
//                { 
//                    #if DEBUG
//                    Debugger.Break(); 
//                    // Debug.Assert would be better, but we're in layout where 
//                    // Dispatcher events are disabled - can't pop up a dialog
//                    #endif 
//                    itemsCorrectionFactor.Bottom = 0;
//                }
//            }
//
//            Thickness oldItemsCorrectionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
//
//            if (!(DoubleUtil.AreClose(itemsCorrectionFactor.Top, oldItemsCorrectionFactor.Top) && 
//                  DoubleUtil.AreClose(itemsCorrectionFactor.Bottom, oldItemsCorrectionFactor.Bottom)))
//            { 
//                remeasure = true;
//                GroupItem.DesiredPixelItemsSizeCorrectionFactorField.SetValue(virtualizingElement, itemsCorrectionFactor);
//            }
//        } 
//
//        if (remeasure) 
//        { 
//            if (scrollingItemsControl != null)
//            { 
//                itemsHost = scrollingItemsControl.ItemsHost;
//                if (itemsHost != null)
//                {
//                    VirtualizingStackPanel vsp = itemsHost as VirtualizingStackPanel; 
//                    if (vsp != null)
//                    { 
//                        vsp.AnchoredInvalidateMeasure(); 
//                    }
//                    else 
//                    {
//                        itemsHost.InvalidateMeasure();
//                    }
//                } 
//            }
//        } 
    }; 

//    internal static void 
    Helper.ClearVirtualizingElement = function(/*IHierarchicalVirtualizationAndScrollInfo*/ virtualizingElement) 
    {
//        Debug.Assert(virtualizingElement != null, "Must have a virtualizingElement to clear"); 
    	
    	//cym comment
//        virtualizingElement.ItemDesiredSizes = new HierarchicalVirtualizationItemDesiredSizes();
//        virtualizingElement.MustDisableVirtualization = false; 
    };

    /// <summary>
    /// Walk through the templated chilren tree of an element until a child of type T is found. 
    /// </summary>
    /// <typeparam name="T"></typeparam> 
    /// <param name="searchStart">element from where the tree walk starts</param> 
    /// <param name="templatedParent">TemplatedParent of all elements</param>
    /// <returns></returns> 
//    internal static T 
    Helper.FindTemplatedDescendant/*<T>*/ = function(/*FrameworkElement*/ searchStart, 
    		/*FrameworkElement*/ templatedParent, /*Type*/ T)// where T : FrameworkElement
    {
        /*FrameworkElement*/var descendant = null;
        var found = null; 
        // Do a DFS among templated children
        var count = VisualTreeHelper.GetChildrenCount(searchStart); 
        for (var i = 0; (i < count) && (found == null); i++) 
        {
            descendant = VisualTreeHelper.GetChild(searchStart, i);
            descendant = descendant instanceof FrameworkElement ? descendant : null; 
            if (descendant != null && descendant.TemplatedParent == templatedParent)
            {
                var returnTypeElement = descendant instanceof T ? descendant : null;
                if (returnTypeElement != null) 
                {
                    found = returnTypeElement; 
                } 
                else
                { 
                    found = Helper.FindTemplatedDescendant/*<T>*/(descendant, templatedParent, T);
                }
            }
        } 

        return found; 
    };

    /// <summary> 
    ///     Walks up the visual parent tree looking for a parent type.
    /// </summary>
//    internal static T 
    Helper.FindVisualAncestor/*<T>*/ = function(/*DependencyObject*/ element, 
    		/*Func<DependencyObject, bool>*/ shouldContinueFunc, /*Type*/ T) // where T : DependencyObject
    { 
        while (element != null)
        { 
            element = VisualTreeHelper.GetParent(element); 
            var correctlyTyped = element instanceof T ? element : null;
            if (correctlyTyped != null) 
            {
                return correctlyTyped;
            }
            if (!shouldContinueFunc(element)) 
            {
                break; 
            } 
        }

        return null;
    };

//    /// <summary> 
//    /// Invalidates measure on visual tree from pathStartElement to pathEndElement
//    /// </summary> 
//    /// <param name="pathStartElement">descendant to start invalidation from</param> 
//    /// <param name="pathEndElement">ancestor to stop invalidation at</param>
////    internal static void 
//    Helper.InvalidateMeasureOnPath = function(/*DependencyObject*/ pathStartElement, 
//    		/*DependencyObject*/ pathEndElement, /*bool*/ duringMeasure) 
//    {
//        InvalidateMeasureOnPath(pathStartElement, pathEndElement, duringMeasure, false /*includePathEnd*/);
//    };

    /// <summary>
    /// Invalidates measure on visual tree from pathStartElement to pathEndElement 
    /// </summary> 
    /// <param name="pathStartElement">descendant to start invalidation from</param>
    /// <param name="pathEndElement">ancestor to stop invalidation at</param> 
//    internal static void 
    Helper.InvalidateMeasureOnPath = function(/*DependencyObject*/ pathStartElement, 
    		/*DependencyObject*/ pathEndElement, /*bool*/ duringMeasure, /*bool*/ includePathEnd)
    {
    	if(includePathEnd === undefined){
    		includePathEnd = false;
    	}
//        Debug.Assert(VisualTreeHelper.IsAncestorOf(pathEndElement, pathStartElement), "pathEndElement should be an ancestor of pathStartElement");

        /*DependencyObject*/var element = pathStartElement;

        // Includes pathStartElement 
        // Includes pathEndElement conditionally
        while (element != null) 
        {
            if (!includePathEnd &&
                element == pathEndElement)
            { 
                break;
            } 
            /*UIElement*/var uiElement = element instanceof UIElement ? element : null; 
            if (uiElement != null)
            { 
                //
                //Please note that this method makes an internal call because
                // it is expected to only be called when in a measure pass and
                // hence doesnt require these items to be explicitly added to 
                // the layout queue.
                // 
                if (duringMeasure) 
                {
                    uiElement.InvalidateMeasureInternal(); 
                }
                else
                {
                    uiElement.InvalidateMeasure(); 
                }
            } 

            if (element == pathEndElement)
            { 
                break;
            }

            element = VisualTreeHelper.GetParent(element); 
        }
    };

//    internal static void 
    Helper.InvalidateMeasureForSubtree = function(/*DependencyObject*/ d)
    { 
        /*UIElement*/var  element = d instanceof UIElement ? d : null;
        if (element != null)
        {
            if (element.MeasureDirty) 
            {
                return; 
            } 

            // 
            //Please note that this method makes an internal call because
            // it is expected to only be called when in a measure pass and
            // hence doesnt require these items to be explicitly added to
            // the layout queue. 
            //
            element.InvalidateMeasureInternal(); 
        } 

        var childrenCount = VisualTreeHelper.GetChildrenCount(d); 
        for (var i=0; i<childrenCount; i++)
        {
            /*DependencyObject*/var child = VisualTreeHelper.GetChild(d, i);
            if (child != null) 
            {
                InvalidateMeasureForSubtree(child); 
            } 
        }
    };

    /// <summary>
    ///     Walks up the visual parent tree looking ancestor.
    ///     If we are out of visual parent it switches over to the logical parent. 
    /// </summary>
    /// <param name="ancestor"></param> 
    /// <param name="element"></param> 
    /// <returns></returns>
//    internal static bool 
    Helper.IsAnyAncestorOf = function(/*DependencyObject*/ ancestor, /*DependencyObject*/ element) 
    {
        if (ancestor == null || element == null)
        {
            return false; 
        }
        return Helper.FindAnyAncestor(element, function(/*DependencyObject*/ d) { return d == ancestor; }) != null; 
    };

    /// <summary> 
    ///     Walks up the visual parent tree matching the given predicate.
    ///     If we are out of visual parents it switches over to the logical parent.
    /// </summary>
//    internal static DependencyObject 
    Helper.FindAnyAncestor = function(/*DependencyObject*/ element, 
        /*Predicate<DependencyObject>*/ predicate)
    { 
        while (element != null) 
        {
            element = Helper.GetAnyParent(element); 
            if (element != null && predicate(element))
            {
                return element;
            } 
        }
        return null; 
    }; 

    /// <summary> 
    ///     Returns visual parent if possible else
    ///     logical parent of the element.
    /// </summary>
//    internal static DependencyObject 
    Helper.GetAnyParent = function(/*DependencyObject*/ element) 
    {
        /*DependencyObject*/var parent = null; 
        if (!(element instanceof ContentElement)) 
        {
            parent = VisualTreeHelper.GetParent(element); 
        }
        if (parent == null)
        {
            parent = LogicalTreeHelper.GetParent(element); 
        }
        return parent; 
    };

    /// <summary> 
    ///     Returns if the value source of the given property
    ///     on the given element is Default or not.
    /// </summary>
//    internal static bool 
    Helper.IsDefaultValue = function(/*DependencyProperty*/ dp, /*DependencyObject*/ element) 
    {
//        bool hasModifiers; 
        return element.GetValueSource(dp, null, /*out hasModifiers*/{"hasModifiers" : null}) == BaseValueSourceInternal.Default; 
    };

//    /// <summary>
//    ///     Return true if a TSF composition is in progress on the given
//    ///     property of the given element. 
//    /// </summary>
////    internal static bool 
//    Helper.IsComposing = function(/*DependencyObject*/ d, /*DependencyProperty*/ dp) 
//    { 
//        if (dp != TextBox.TextProperty)
//            return false; 
//
//        return IsComposing(d instanceof TextBoxBase ? d: null);
//    };
//
////    internal static bool 
//    Helper.IsComposing = function(/*TextBoxBase*/ tbb)
//    { 
//        if (tbb == null) 
//            return false;
//
//        /*TextEditor*/var te = tbb.TextEditor;
//        if (te == null)
//            return false;
//
//        /*TextStore*/var ts = te.TextStore;
//        if (ts == null) 
//            return false; 
//
//        return ts.IsEffectivelyComposing; 
//    };
    
    /// <summary>
    ///     Return true if a TSF composition is in progress on the given
    ///     property of the given element. 
    /// </summary>
//    internal static bool 
    Helper.IsComposing = function(/*DependencyObject*/ d, /*DependencyProperty*/ dp) 
    { 
    	if(arguments.length == 2){
            if (dp != TextBox.TextProperty)
                return false; 

            return IsComposing(d instanceof TextBoxBase ? d: null);
    	}else{
    		tbb = d;
    		if (tbb == null) 
                return false;

            /*TextEditor*/var te = tbb.TextEditor;
            if (te == null)
                return false;

            /*TextStore*/var ts = te.TextStore;
            if (ts == null) 
                return false; 

            return ts.IsEffectivelyComposing; 
    	}

    };

    Object.defineProperties(Helper, {
 
        // Since ItemValueStorage is private and only used for TreeView and Grouping virtualization we hardcode the DPs that we'll store in it.
        // If we make this available as a service to the rest of the platform we'd come up with some sort of DP registration mechanism.
//        private static readonly int[] 
        ItemValueStorageIndices:
        {
        	get:function(){
        		if(Helper._ItemValueStorageIndices === undefined){
        			Helper._ItemValueStorageIndices = [
        		            ItemValueStorageField.GlobalIndex, 
        		            TreeViewItem.IsExpandedProperty.GlobalIndex,
        		            Expander.IsExpandedProperty.GlobalIndex, 
        		            GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GlobalIndex]; 
        		}
        		
        		return Helper._ItemValueStorageIndices;
        	}
        }
    });

	
	Helper.Type = new Type("Helper", Helper, [Object.Type]);
	return Helper;
});



