package org.summer.view.widget.internal;

import java.awt.Point;
import java.beans.EventHandler;
import java.util.function.Predicate;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.Application;
import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.Condition;
import org.summer.view.widget.ContentElement;
import org.summer.view.widget.DataTrigger;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EffectiveValueEntry;
import org.summer.view.widget.EntryIndex;
import org.summer.view.widget.FrameworkContentElement;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkTemplate;
import org.summer.view.widget.FullValueSource;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.LogicalTreeHelper;
import org.summer.view.widget.PropertyMetadata;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Setter;
import org.summer.view.widget.Size;
import org.summer.view.widget.Style;
import org.summer.view.widget.Type;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.UncommonField;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.KeyValuePair;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.controls.ComboBox;
import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.widget.controls.DataTemplateSelector;
import org.summer.view.widget.controls.Expander;
import org.summer.view.widget.controls.GroupItem;
import org.summer.view.widget.controls.HierarchicalVirtualizationItemDesiredSizes;
import org.summer.view.widget.controls.IContainItemStorage;
import org.summer.view.widget.controls.IGeneratorHost;
import org.summer.view.widget.controls.IHierarchicalVirtualizationAndScrollInfo;
import org.summer.view.widget.controls.ItemsControl;
import org.summer.view.widget.controls.Panel;
import org.summer.view.widget.controls.StyleSelector;
import org.summer.view.widget.controls.TextBox;
import org.summer.view.widget.controls.TreeViewItem;
import org.summer.view.widget.controls.VirtualizingStackPanel;
import org.summer.view.widget.controls.primitives.TextBoxBase;
import org.summer.view.widget.data.XmlDataProvider;
import org.summer.view.widget.documents.TextEditor;
import org.summer.view.widget.markup.IProvideValueTarget;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.media.VisualTreeHelper;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.reflection.MemberInfo;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.widget.threading.Dispatcher;
import org.summer.view.widget.xaml.XamlParseException;
import org.summer.view.window.DoubleUtil;
import org.summer.view.window.ResourceReferenceExpression;
import org.summer.view.window.SystemResources;
import org.summer.view.window.Thickness;

// Miscellaneous (and internal) helper functions.
    /*static*/ public class Helper 
    { 

        public static Object ResourceFailureThrow(Object key) 
        {
            FindResourceHelper helper = new FindResourceHelper(key);
            return helper.TryCatchWhen();
        } 

        private class FindResourceHelper 
        { 
            Object TryCatchWhen()
            { 
                Dispatcher.CurrentDispatcher.WrappedInvoke(new DispatcherOperationCallback(DoTryCatchWhen),
                                                                                            null,
                                                                                            1,
                                                                                            new DispatcherOperationCallback(CatchHandler)); 
                return _resource;
            } 
 
            private Object DoTryCatchWhen(Object arg)
            { 
                throw new ResourceReferenceKeyNotFoundException(SR.Get(SRID.MarkupExtensionResourceNotFound, _name), _name);
            }

            private Object CatchHandler(Object arg) 
            {
                _resource = DependencyProperty.UnsetValue; 
                return null; 
            }
 
            public FindResourceHelper(Object name)
            {
                _name = name;
                _resource = null; 
            }
 
            private Object _name; 
            private Object _resource;
        } 


        // Find a data template (or table template) resource
        public static Object FindTemplateResourceFromAppOrSystem(DependencyObject target, ArrayList keys, int exactMatch, /*ref*/ int bestMatch) 
        {
            Object resource = null; 
            int k; 

            // Comment out below three lines code. 
            // For now, we will always get the resource from Application level
            // if the resource exists.
            //
            // But we do need to have a right design in the future that can make 
            // sure the tree get the right resource updated while the Application
            // level resource is changed later dynamically. 
            // 
            //
  
            Application app = Application.Current;
            if (app != null) 
            { 
                // If the element is rooted to a Window and App exists, defer to App.
                for (k = 0;  k < bestMatch;  ++k) 
                {
                    Object appResource = Application.Current.FindResourceInternal(keys[k]);
                    if (appResource != null)
                    { 
                        bestMatch = k;
                        resource = appResource; 
 
                        if (bestMatch < exactMatch)
                            return resource; 
                    }
                }
            }
 
            // if best match is not found from the application level,
            // try it from system level. 
            if (bestMatch >= exactMatch) 
            {
                // Try the system resource collection. 
                for (k = 0;  k < bestMatch;  ++k)
                {
                    Object sysResource = SystemResources.FindResourceInternal(keys[k]);
                    if (sysResource != null) 
                    {
                        bestMatch = k; 
                        resource = sysResource; 

                        if (bestMatch < exactMatch) 
                            return resource;
                    }
                }
            } 

            return resource; 
        } 

            // 
/*
        // Returns the absolute root of the tree by walking through frames.
        static DependencyObject GetAbsoluteRoot(DependencyObject iLogical)
        { 
            DependencyObject currentRoot = iLogical;
            Visual visual; 
            Visual parentVisual; 
            boolean bDone = false;
 
            if (currentRoot == null)
            {
                return null;
            } 

            while (!bDone) 
            { 
                // Try logical parent.
                DependencyObject parent = LogicalTreeHelper.GetParent(currentRoot); 

                if (parent != null)
                {
                    currentRoot = parent; 
                }
                else 
                { 
                    // Try visual parent
                    Visual visual = currentRoot as Visual; 
                    if (visual != null)
                    {
                        Visual parentVisual = VisualTreeHelper.GetParent(visual);
                        if (parentVisual != null) 
                        {
                            currentRoot = parentVisual; 
                            continue; 
                        }
                    } 

                    // No logical or visual parent, so we're done.
                    bDone = true;
                } 
            }
 
            return currentRoot; 
        }
*/ 

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
        public static DependencyObject FindMentor(DependencyObject d)
        { 
            // Find the nearest FE/FCE InheritanceContext
            while (d != null) 
            { 
                FrameworkElement fe;
                FrameworkContentElement fce; 
                Helper.DowncastToFEorFCE(d, /*out*/ fe, /*out*/ fce, false);

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
        } 

        /// <summary>
        /// Return true if the given property is not set locally or from a style
        /// </summary> 
        public static boolean HasDefaultValue(DependencyObject d, DependencyProperty dp)
        { 
            return HasDefaultOrInheritedValueImpl(d, dp, false, true); 
        }
 
        /// <summary>
        /// Return true if the given property is not set locally or from a style or by inheritance
        /// </summary>
        static boolean HasDefaultOrInheritedValue(DependencyObject d, DependencyProperty dp) 
        {
            return HasDefaultOrInheritedValueImpl(d, dp, true, true); 
        } 

        /// <summary> 
        /// Return true if the given property is not set locally or from a style
        /// </summary>
        public static boolean HasUnmodifiedDefaultValue(DependencyObject d, DependencyProperty dp)
        { 
            return HasDefaultOrInheritedValueImpl(d, dp, false, false);
        } 
 
        /// <summary>
        /// Return true if the given property is not set locally or from a style or by inheritance 
        /// </summary>
        public static boolean HasUnmodifiedDefaultOrInheritedValue(DependencyObject d, DependencyProperty dp)
        {
            return HasDefaultOrInheritedValueImpl(d, dp, true, false); 
        }
 
        /// <summary> 
        /// Return true if the given property is not set locally or from a style
        /// </summary> 
        private static boolean HasDefaultOrInheritedValueImpl(DependencyObject d, DependencyProperty dp,
                                                                boolean checkInherited,
                                                                boolean ignoreModifiers)
        { 
            PropertyMetadata metadata = dp.GetMetadata(d);
            boolean hasModifiers; 
            BaseValueSourceInternal source = d.GetValueSource(dp, metadata, /*out*/ hasModifiers); 

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
        public static void DowncastToFEorFCE(DependencyObject d, 
                                    /*out*/ FrameworkElement fe, /*out*/ FrameworkContentElement fce,
                                    boolean throwIfNeither) 
        {
            if (FrameworkElement.DType.IsInstanceOfType(d))
            {
                fe = (FrameworkElement)d; 
                fce = null;
            } 
            else if (FrameworkContentElement.DType.IsInstanceOfType(d)) 
            {
                fe = null; 
                fce = (FrameworkContentElement)d;
            }
            else if (throwIfNeither)
            { 
                throw new InvalidOperationException(SR.Get(SRID.MustBeFrameworkDerived, d.GetType()));
            } 
            else 
            {
                fe = null; 
                fce = null;
            }
        }
 

        /// <summary> 
        /// Issue a trace message if both the xxxStyle and xxxStyleSelector 
        /// properties are set on the given element.
        /// </summary> 
        public static void CheckStyleAndStyleSelector(String name,
                                                        DependencyProperty styleProperty,
                                                        DependencyProperty styleSelectorProperty,
                                                        DependencyObject d) 
        {
            // Issue a trace message if user defines both xxxStyle and xxxStyleSelector 
            // (bugs 1007020, 1019240).  Only explicit local values or resource 
            // references count;  data-bound or styled values don't count.
            // Do not throw here (bug 1434271), because it's very confusing if the 
            // user tries to continue from this exception.
            if (TraceData.IsEnabled)
            {
                Object styleSelector = d.ReadLocalValue(styleSelectorProperty); 

                if (styleSelector != DependencyProperty.UnsetValue && 
                    (styleSelector instanceof StyleSelector || styleSelector instanceof ResourceReferenceExpression)) 
                {
                    Object style = d.ReadLocalValue(styleProperty); 

                    if (style != DependencyProperty.UnsetValue &&
                        (style instanceof Style || style instanceof ResourceReferenceExpression))
                    { 
                        TraceData.Trace(TraceEventType.Error, TraceData.StyleAndStyleSelectorDefined(name), d);
                    } 
                } 
            }
        } 

        /// <summary>
        /// Issue a trace message if both the xxxTemplate and xxxTemplateSelector
        /// properties are set on the given element. 
        /// </summary>
        public static void CheckTemplateAndTemplateSelector(String name, 
                                                        DependencyProperty templateProperty, 
                                                        DependencyProperty templateSelectorProperty,
                                                        DependencyObject d) 
        {
            // Issue a trace message if user defines both xxxTemplate and xxxTemplateSelector
            // (bugs 1007020, 1019240).  Only explicit local values or resource
            // references count;  data-bound or templated values don't count. 
            // Do not throw here (bug 1434271), because it's very confusing if the
            // user tries to continue from this exception. 
//            if (TraceData.IsEnabled) 
//            {
//                if (IsTemplateSelectorDefined(templateSelectorProperty, d)) 
//                {
//                    if (IsTemplateDefined(templateProperty, d))
//                    {
//                        TraceData.Trace(TraceEventType.Error, TraceData.TemplateAndTemplateSelectorDefined(name), d); 
//                    }
//                } 
//            } 
        }
 
        /// <summary>
        /// Check whether xxxTemplateSelector property is set on the given element.
        /// Only explicit local values or resource references count;  data-bound or templated values don't count.
        /// </summary> 
        static boolean IsTemplateSelectorDefined(DependencyProperty templateSelectorProperty, DependencyObject d)
        { 
            // Check whether xxxTemplateSelector property is set on the given element. 
            Object templateSelector = d.ReadLocalValue(templateSelectorProperty);
            // the checks for UnsetValue and null are for perf: 
            // they're redundant to the type checks, but they're cheaper
            return (templateSelector != DependencyProperty.UnsetValue &&
                    templateSelector != null &&
                   (templateSelector instanceof DataTemplateSelector || 
                    templateSelector instanceof ResourceReferenceExpression));
        } 
 
        /// <summary>
        /// Check whether xxxTemplate property is set on the given element. 
        /// Only explicit local values or resource references count;  data-bound or templated values don't count.
        /// </summary>
        static boolean IsTemplateDefined(DependencyProperty templateProperty, DependencyObject d)
        { 
            // Check whether xxxTemplate property is set on the given element.
            Object template = d.ReadLocalValue(templateProperty); 
            // the checks for UnsetValue and null are for perf: 
            // they're redundant to the type checks, but they're cheaper
            return (template != DependencyProperty.UnsetValue && 
                    template != null &&
                    (template instanceof FrameworkTemplate ||
                    template instanceof ResourceReferenceExpression));
        } 

        ///<summary> 
        ///     Helper method to find an Object by name inside a template 
        ///</summary>
        static Object FindNameInTemplate(String name, DependencyObject templatedParent) 
        {
            FrameworkElement fe = templatedParent as FrameworkElement;
//            Debug.Assert( fe != null );
 
            return fe.TemplateInternal.FindName(name, fe);
        } 
 
        /// <summary>
        /// Find the IGeneratorHost that is responsible (possibly indirectly) 
        /// for the creation of the given DependencyObject.
        /// </summary>
        static IGeneratorHost GeneratorHostForElement(DependencyObject element)
        { 
            DependencyObject d = null;
            DependencyObject parent = null; 
 
            // 1. Follow the TemplatedParent chain to the end.  This should be
            // the ItemContainer. 
            while (element != null)
            {
                while (element != null)
                { 
                    d = element;
                    element= GetTemplatedParent(element); 
 
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
                        ComboBox cb = element as /*System.Windows.Controls.*/ComboBox;
                        if (cb != null) 
                        {
                            return cb; 
                        } 
                    }
                } 

                Visual v = d as Visual;
                if (v != null)
                { 
                    parent = VisualTreeHelper.GetParent(v);
 
                    // In ListView, we should rise through a GridView*RowPresenter 
                    // even though it is not the TemplatedParent (bug 1937470)
                    element = parent as /*System.Windows.Controls.Primitives.*/GridViewRowPresenterBase; 
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
                ItemsControl ic = ItemsControl.GetItemsOwner(parent);
                if (ic != null) 
                    return ic;
            } 
 
            return null;
        } 

        static DependencyObject GetTemplatedParent(DependencyObject d)
        {
            FrameworkElement fe; 
            FrameworkContentElement fce;
            DowncastToFEorFCE(d, /*out*/ fe, /*out*/ fce, false); 
            if (fe != null) 
                return fe.TemplatedParent;
            else if (fce != null) 
                return fce.TemplatedParent;

            return null;
        } 

        /// <summary> 
        /// Find the XmlDataProvider (if any) that is associated with the 
        /// given DependencyObject.
        /// This method only works when the DO is part of the generated content 
        /// of an ItemsControl or TableRowGroup.
        /// </summary>
        static XmlDataProvider XmlDataProviderForElement(DependencyObject d)
        { 
            MS.Internal.Controls.IGeneratorHost host = Helper.GeneratorHostForElement(d);
            System.Windows.Controls.ItemCollection ic = (host != null) ? host.View : null; 
            ICollectionView icv = (ic != null) ? ic.CollectionView : null; 
            MS.Internal.Data.XmlDataCollection xdc = (icv != null) ? icv.SourceCollection as MS.Internal.Data.XmlDataCollection : null;
 
            return (xdc != null) ? xdc.ParentXmlDataProvider : null;
        }

//#if CF_Envelope_Activation_Enabled 
//        /// <summary>
//        /// Indicates whether our content is inside an old-style container 
//        /// </summary> 
//        /// <value></value>
//        ///<SecurityNote> 
//        /// Critical as it accesses the container Object
//        /// TreatAsSafe as it only returns safe data
//        ///</SecurityNote>
// 
//        static boolean IsContainer
//        { 
//            [SecurityCritical, SecurityTreatAsSafe] 
//            get
//            { 
//                return BindUriHelper.Container != null;
//            }
//        }
//#endif 

        /// <summary> 
        /// Measure a simple element with a single child. 
        /// </summary>
        public static Size MeasureElementWithSingleChild(UIElement element, Size constraint) 
        {
            UIElement child = (VisualTreeHelper.GetChildrenCount(element) > 0) ? VisualTreeHelper.GetChild(element, 0) as UIElement : null;

            if (child != null) 
            {
                child.Measure(constraint); 
                return child.DesiredSize; 
            }
 
            return new Size();
        }

 
        /// <summary>
        /// Arrange a simple element with a single child. 
        /// </summary> 
        public static Size ArrangeElementWithSingleChild(UIElement element, Size arrangeSize)
        { 
            UIElement child = (VisualTreeHelper.GetChildrenCount(element) > 0) ? VisualTreeHelper.GetChild(element, 0) as UIElement : null;

            if (child != null)
            { 
                child.Arrange(new Rect(arrangeSize));
            } 
 
            return arrangeSize;
        } 

        /// <summary>
        /// Helper method used for double parameter validation.  Returns false
        /// if the value is either Infinity (positive or negative) or NaN. 
        /// </summary>
        /// <param name="value">The double value to test</param> 
        /// <returns>Whether the value is a valid double.</returns> 
        static boolean IsDoubleValid(double value)
        { 
            return !(Double.IsInfinity(value) || Double.IsNaN(value));
        }

        /// <summary> 
        /// Checks if the given IProvideValueTarget can receive
        /// a DynamicResource or Binding MarkupExtension. 
        /// </summary> 
        public static void CheckCanReceiveMarkupExtension(
                MarkupExtension     markupExtension, 
                IServiceProvider    serviceProvider,
            /*out*/ DependencyObject    targetDependencyObject,
            /*out*/ DependencyProperty  targetDependencyProperty)
        { 
            targetDependencyObject = null;
            targetDependencyProperty = null; 
 
            IProvideValueTarget provideValueTarget = serviceProvider.GetService(typeof(IProvideValueTarget)) as IProvideValueTarget;
            if (provideValueTarget == null) 
            {
                return;
            }
 
            Object targetObject = provideValueTarget.TargetObject;
 
            if (targetObject == null) 
            {
                return; 
            }

            Type targetType = targetObject.GetType();
            Object targetProperty = provideValueTarget.TargetProperty; 

            if (targetProperty != null) 
            { 
                targetDependencyProperty = targetProperty as DependencyProperty;
                if (targetDependencyProperty != null) 
                {
                    // This is the DependencyProperty case

                    targetDependencyObject = targetObject as DependencyObject; 
//                    Debug.Assert(targetDependencyObject != null, "DependencyProperties can only be set on DependencyObjects");
                } 
                else 
                {
                    MemberInfo targetMember = targetProperty as MemberInfo; 
                    if (targetMember != null)
                    {
                        // This is the Clr Property case
                        PropertyInfo propertyInfo = targetMember as PropertyInfo; 

                        // Setters, Triggers, DataTriggers & Conditions are the special cases of 
                        // Clr properties where DynamicResource & Bindings are allowed. Normally 
                        // these cases are handled by the parser calling the appropriate
                        // ReceiveMarkupExtension method.  But a custom MarkupExtension 
                        // that delegates ProvideValue will end up here (see Dev11 117372).
                        // So we handle it similarly to how the parser does it.

                        EventHandler<System.Windows.Markup.XamlSetMarkupExtensionEventArgs> setMarkupExtension 
                            = LookupSetMarkupExtensionHandler(targetType);
 
                        if (setMarkupExtension != null && propertyInfo != null) 
                        {
                            System.Xaml.IXamlSchemaContextProvider scp = serviceProvider.GetService(typeof(System.Xaml.IXamlSchemaContextProvider)) as System.Xaml.IXamlSchemaContextProvider; 
                            if (scp != null)
                            {
                                System.Xaml.XamlSchemaContext sc = scp.SchemaContext;
                                System.Xaml.XamlType xt = sc.GetXamlType(targetType); 
                                if (xt != null)
                                { 
                                    System.Xaml.XamlMember member = xt.GetMember(propertyInfo.Name); 
                                    if (member != null)
                                    { 
                                        var eventArgs = new System.Windows.Markup.XamlSetMarkupExtensionEventArgs(member, markupExtension, serviceProvider);

                                        // ask the target Object whether it accepts MarkupExtension
                                        setMarkupExtension(targetObject, eventArgs); 
                                        if (eventArgs.Handled)
                                            return;     // if so, all is well 
                                    } 
                                }
                            } 

                        }

 
                        // Find the MemberType
 
                        Debug.Assert(targetMember is PropertyInfo || targetMember is MethodInfo, 
                            "TargetMember is either a Clr property or an attached static settor method");
 
                        Type memberType;

                        if (propertyInfo != null)
                        { 
                            memberType = propertyInfo.PropertyType;
                        } 
                        else 
                        {
                            MethodInfo methodInfo = (MethodInfo)targetMember; 
                            ParameterInfo[] parameterInfos = methodInfo.GetParameters();
                            Debug.Assert(parameterInfos.Length == 2, "The signature of a static settor must contain two parameters");
                            memberType = parameterInfos[1].ParameterType;
                        } 

                        // Check if the MarkupExtensionType is assignable to the given MemberType 
                        // This check is to allow properties such as the following 
                        // - DataTrigger.Binding
                        // - Condition.Binding 
                        // - HierarchicalDataTemplate.ItemsSource
                        // - GridViewColumn.DisplayMemberBinding

                        if (!typeof(MarkupExtension).IsAssignableFrom(memberType) || 
                             !memberType.IsAssignableFrom(markupExtension.GetType()))
                        { 
                            throw new XamlParseException(SR.Get(SRID.MarkupExtensionDynamicOrBindingOnClrProp, 
                                                                markupExtension.GetType().Name,
                                                                targetMember.Name, 
                                                                targetType.Name));
                        }
                    }
                    else 
                    {
                        // This is the Collection ContentProperty case 
                        // Example: 
                        // <DockPanel>
                        //   <Button /> 
                        //   <DynamicResource ResourceKey="foo" />
                        // </DockPanel>

                        // Collection<BindingBase> used in MultiBinding is a special 
                        // case of a Collection that can contain a Binding.
 
                        if (!typeof(BindingBase).IsAssignableFrom(markupExtension.GetType()) || 
                            !typeof(Collection<BindingBase>).IsAssignableFrom(targetProperty.GetType()))
                        { 
                            throw new XamlParseException(SR.Get(SRID.MarkupExtensionDynamicOrBindingInCollection,
                                                                markupExtension.GetType().Name,
                                                                targetProperty.GetType().Name));
                        } 
                    }
                } 
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

                if (!typeof(BindingBase).IsAssignableFrom(markupExtension.GetType()) || 
                    !typeof(Collection<BindingBase>).IsAssignableFrom(targetType))
                { 
                    throw new XamlParseException(SR.Get(SRID.MarkupExtensionDynamicOrBindingInCollection, 
                                                        markupExtension.GetType().Name,
                                                        targetType.Name)); 
                }
            }
        }
 
        static EventHandler</*System.Windows.Markup.*/XamlSetMarkupExtensionEventArgs> LookupSetMarkupExtensionHandler(Type type)
        { 
            if (typeof(Setter).IsAssignableFrom(type)) 
            {
                return Setter.ReceiveMarkupExtension; 
            }
            else if (typeof(DataTrigger).IsAssignableFrom(type))
            {
                return DataTrigger.ReceiveMarkupExtension; 
            }
            else if (typeof(Condition).IsAssignableFrom(type)) 
            { 
                return Condition.ReceiveMarkupExtension;
            } 
            return null;
        }

        // build a format String suitable for String.Format from the given argument, 
        // by expanding the convenience form, if necessary
        public static String GetEffectiveStringFormat(String stringFormat) 
        { 
            if (stringFormat.IndexOf('{') < 0)
            { 
                // convenience syntax - build a composite format String with one parameter
                stringFormat = @"{0:" + stringFormat + @"}";
            }
 
            return stringFormat;
        } 
 
//        #region ItemValueStorage common methods
 
        public static Object ReadItemValue(DependencyObject owner, Object item, int dpIndex)
        {
            if (item != null)
            { 
                List<KeyValuePair<Integer, Object>> itemValues = GetItemValues(owner, item);
 
                if (itemValues != null) 
                {
                    for (int i = 0; i < itemValues.Count; i++) 
                    {
                        if (itemValues[i].Key == dpIndex)
                        {
                            return itemValues[i].Value; 
                        }
                    } 
                } 
            }
 
            return null;
        }

 
        public static void StoreItemValue(DependencyObject owner, Object item, int dpIndex, Object value)
        { 
            if (item != null) 
            {
                List<KeyValuePair<Integer, Object>> itemValues = EnsureItemValues(owner, item); 

                //
                // Find the key, if it exists, and modify its value.  Since the number of DPs we want to store
                // is typically very small, using a List in this manner is faster than hashing 
                //
 
                boolean found = false; 
                KeyValuePair<Integer, Object> keyValue = new KeyValuePair<Integer, Object>(dpIndex, value);
 
                for (int j = 0; j < itemValues.Count; j++)
                {
                    if (itemValues[j].Key == dpIndex)
                    { 
                        itemValues[j] = keyValue;
                        found = true; 
                        break; 
                    }
                } 

                if (!found)
                {
                    itemValues.Add(keyValue); 
                }
            } 
        } 

        public static void ClearItemValue(DependencyObject owner, Object item, int dpIndex) 
        {
            if (item != null)
            {
                List<KeyValuePair<Integer, Object>> itemValues = GetItemValues(owner, item); 

                if (itemValues != null) 
                { 
                    for (int i = 0; i < itemValues.Count; i++)
                    { 
                        if (itemValues[i].Key == dpIndex)
                        {
                            itemValues.RemoveAt(i);
                            break; 
                        }
                    } 
                } 
            }
        } 

        /// <summary>
        /// Returns the ItemValues list for a given item.  May return null if one hasn't been set yet.
        /// </summary> 
        /// <param name="item"></param>
        /// <returns></returns> 
        static List<KeyValuePair<Integer, Object>> GetItemValues(DependencyObject owner, Object item) 
        {
            return GetItemValues(owner, item, ItemValueStorageField.GetValue(owner)); 
        }

        static List<KeyValuePair<Integer, Object>> GetItemValues(DependencyObject owner, Object item,
                                                              WeakDictionary<Object, List<KeyValuePair<Integer, Object>>> itemValueStorage) 
        {
//            Debug.Assert(item != null); 
            List<KeyValuePair<Integer, Object>> itemValues = null; 

            if (itemValueStorage != null) 
            {
                itemValueStorage.TryGetValue(item, /*out*/ itemValues);
            }
 
            return itemValues;
        } 
 

        static List<KeyValuePair<Integer, Object>> EnsureItemValues(DependencyObject owner, Object item) 
        {
            WeakDictionary<Object, List<KeyValuePair<Integer, Object>>> itemValueStorage = EnsureItemValueStorage(owner);
            List<KeyValuePair<Integer, Object>> itemValues = GetItemValues(owner, item, itemValueStorage);
 
            if (itemValues == null && HashHelper.HasReliableHashCode(item))
            { 
                itemValues = new List<KeyValuePair<Integer, Object>>(3);    // So far the only use of this is to store three values. 
                itemValueStorage[item] = itemValues;
            } 

            return itemValues;
        }
 

        static WeakDictionary<Object, List<KeyValuePair<Integer, Object>>> EnsureItemValueStorage(DependencyObject owner) 
        { 
            WeakDictionary<Object, List<KeyValuePair<Integer, Object>>> itemValueStorage = ItemValueStorageField.GetValue(owner);
 
            if (itemValueStorage == null)
            {
                itemValueStorage = new WeakDictionary<Object, List<KeyValuePair<Integer, Object>>>();
                ItemValueStorageField.SetValue(owner, itemValueStorage); 
            }
 
            return itemValueStorage; 
        }
 
        /// <summary>
        /// Sets all values saved in ItemValueStorage for the given item onto the container
        /// </summary>
        /// <param name="container"></param> 
        /// <param name="item"></param>
        public static void SetItemValuesOnContainer(DependencyObject owner, DependencyObject container, Object item) 
        { 
            int[] dpIndices = ItemValueStorageIndices;
            List<KeyValuePair<Integer, Object>> itemValues = GetItemValues(owner, item); 

            if (itemValues != null)
            {
                for (int i = 0; i < itemValues.Count; i++) 
                {
                    int dpIndex = itemValues[i].Key; 
 
                    for (int j = 0; j < dpIndices.length; j++)
                    { 
                        if (dpIndex == dpIndices[j])
                        {
                            Object value = itemValues[i].Value;
                            EntryIndex entryIndex = container.LookupEntry(dpIndex); 
                            ModifiedItemValue modifiedItemValue = value as ModifiedItemValue;
                            DependencyProperty dp = DependencyProperty.RegisteredPropertyList.List[dpIndex]; 
 
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
        } 

        /// <summary> 
        /// Stores the value of a container for the given item and set of dependency properties
        /// </summary>
        /// <param name="container"></param>
        /// <param name="item"></param> 
        /// <param name="dpIndices"></param>
        static void StoreItemValues(IContainItemStorage owner, DependencyObject container, Object item) 
        { 
            int[] dpIndices = ItemValueStorageIndices;
 
            DependencyObject ownerDO = (DependencyObject)owner;

            //
            // Loop through all DPs we care about storing.  If the container has a current-value or locally-set value we'll store it. 
            //
            for (int i = 0; i < dpIndices.length; i++) 
            { 
                int dpIndex = dpIndices[i];
                EntryIndex entryIndex = container.LookupEntry(dpIndex); 

                if (entryIndex.Found)
                {
                    EffectiveValueEntry entry = container.EffectiveValues[entryIndex.Index]; 

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
        } 

        public static void ClearItemValueStorage(DependencyObject owner)
        {
            ItemValueStorageField.ClearValue(owner); 
        }
 
        public static void ClearItemValueStorage(DependencyObject owner, int[] dpIndices) 
        {
            ClearItemValueStorageRecursive(ItemValueStorageField.GetValue(owner), dpIndices); 
        }

        private static void ClearItemValueStorageRecursive(WeakDictionary<Object, List<KeyValuePair<Integer, Object>>> itemValueStorage, int[] dpIndices)
        { 
            if (itemValueStorage != null)
            { 
                for/*each*/ (List<KeyValuePair<Integer, Object>> itemValuesList : itemValueStorage.Values) 
                {
                    for (int i=0; i<itemValuesList.Count; i++) 
                    {
                        KeyValuePair<Integer, Object> itemValue = itemValuesList[i];
                        if (itemValue.Key == ItemValueStorageField.GlobalIndex)
                        { 
                            ClearItemValueStorageRecursive((WeakDictionary<Object, List<KeyValuePair<int, Object>>>)itemValue.Value, dpIndices);
                        } 
 
                        for (int j=0; j<dpIndices.Length; j++)
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

        static void ApplyCorrectionFactorToPixelHeaderSize(
            ItemsControl scrollingItemsControl, 
            FrameworkElement virtualizingElement,
            Panel itemsHost, 
            /*ref*/ Size headerSize) 
        {
            boolean shouldApplyItemsCorrectionFactor = itemsHost != null && itemsHost.IsVisible; 
            if (shouldApplyItemsCorrectionFactor)
            {
                Thickness itemsCorrectionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
                headerSize.Height = Math.Max(itemsCorrectionFactor.Top, headerSize.Height); 
            }
            else 
            { 
                headerSize.Height = Math.Max(virtualizingElement.DesiredSize.Height, headerSize.Height);
            } 
            headerSize.Width = Math.Max(virtualizingElement.DesiredSize.Width, headerSize.Width);
        }

        static HierarchicalVirtualizationItemDesiredSizes ApplyCorrectionFactorToItemDesiredSizes( 
            FrameworkElement virtualizingElement,
            Panel itemsHost) 
        { 
            HierarchicalVirtualizationItemDesiredSizes itemDesiredSizes =
                GroupItem.HierarchicalVirtualizationItemDesiredSizesField.GetValue(virtualizingElement); 

            if (itemsHost != null && itemsHost.IsVisible)
            {
                Size itemPixelSize = itemDesiredSizes.PixelSize; 
                Size itemPixelSizeInViewport = itemDesiredSizes.PixelSizeInViewport;
                Size itemPixelSizeBeforeViewport = itemDesiredSizes.PixelSizeBeforeViewport; 
                Size itemPixelSizeAfterViewport = itemDesiredSizes.PixelSizeAfterViewport; 
                boolean correctionComputed = false;
                Thickness correctionFactor = new Thickness(0); 
                Size desiredSize = virtualizingElement.DesiredSize;

                if (DoubleUtil.GreaterThan(itemPixelSize.Height, 0))
                { 
                    correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
                    itemPixelSize.Height += correctionFactor.Bottom; 
                    correctionComputed = true; 
                }
                itemPixelSize.Width = Math.Max(desiredSize.Width, itemPixelSize.Width); 

                if (DoubleUtil.AreClose(itemDesiredSizes.PixelSizeAfterViewport.Height, 0) &&
                    DoubleUtil.AreClose(itemDesiredSizes.PixelSizeInViewport.Height, 0) &&
                    DoubleUtil.GreaterThan(itemDesiredSizes.PixelSizeBeforeViewport.Height, 0)) 
                {
                    if (!correctionComputed) 
                    { 
                        correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
                    } 
                    itemPixelSizeBeforeViewport.Height += correctionFactor.Bottom;
                    correctionComputed = true;
                }
                itemPixelSizeBeforeViewport.Width = Math.Max(desiredSize.Width, itemPixelSizeBeforeViewport.Width); 

                if (DoubleUtil.AreClose(itemDesiredSizes.PixelSizeAfterViewport.Height, 0) && 
                    DoubleUtil.GreaterThan(itemDesiredSizes.PixelSizeInViewport.Height, 0)) 
                {
                    if (!correctionComputed) 
                    {
                        correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
                    }
                    itemPixelSizeInViewport.Height += correctionFactor.Bottom; 
                    correctionComputed = true;
                } 
                itemPixelSizeInViewport.Width = Math.Max(desiredSize.Width, itemPixelSizeInViewport.Width); 

                if (DoubleUtil.GreaterThan(itemDesiredSizes.PixelSizeAfterViewport.Height, 0)) 
                {
                    if (!correctionComputed)
                    {
                        correctionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement); 
                    }
                    itemPixelSizeAfterViewport.Height += correctionFactor.Bottom; 
                    correctionComputed = true; 
                }
                itemPixelSizeAfterViewport.Width = Math.Max(desiredSize.Width, itemPixelSizeAfterViewport.Width); 

                itemDesiredSizes = new HierarchicalVirtualizationItemDesiredSizes(itemDesiredSizes.LogicalSize,
                    itemDesiredSizes.LogicalSizeInViewport,
                    itemDesiredSizes.LogicalSizeBeforeViewport, 
                    itemDesiredSizes.LogicalSizeAfterViewport,
                    itemPixelSize, 
                    itemPixelSizeInViewport, 
                    itemPixelSizeBeforeViewport,
                    itemPixelSizeAfterViewport); 
            }
            return itemDesiredSizes;
        }
 
        static void ComputeCorrectionFactor(
            ItemsControl scrollingItemsControl, 
            FrameworkElement virtualizingElement, 
            Panel itemsHost,
            FrameworkElement headerElement) 
        {
            Rect parentRect = new Rect(new Point(), virtualizingElement.DesiredSize);
            boolean remeasure = false;
 
            if (itemsHost != null)
            { 
                Thickness itemsCorrectionFactor = new Thickness(); 

                if (itemsHost.IsVisible) 
                {
                    Rect itemsRect = itemsHost.TransformToAncestor(virtualizingElement).TransformBounds(new Rect(new Point(), itemsHost.DesiredSize));
                    itemsCorrectionFactor.Top = itemsRect.Top;
                    itemsCorrectionFactor.Bottom = parentRect.Bottom - itemsRect.Bottom; 

                    // the correction is supposed to be non-negative, but there's some 
                    // kind of race condition that occasionally results in a negative 
                    // value that eventually crashes in ApplyCorrectionFactorToItemDesiredSizes
                    // by setting a rect.Height to a negative number (Dev11 bugs 
                    // 381371, 409473, 411192).  We haven't been able to repro the ----,
                    // so to avoid the crash we'll artificially clamp the correction.
                    if (itemsCorrectionFactor.Bottom < 0)
                    { 
//                        #if DEBUG
//                        Debugger.Break(); 
//                        // Debug.Assert would be better, but we're in layout where 
//                        // Dispatcher events are disabled - can't pop up a dialog
//                        #endif 
                        itemsCorrectionFactor.Bottom = 0;
                    }
                }
 
                Thickness oldItemsCorrectionFactor = GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GetValue(virtualizingElement);
 
                if (!(DoubleUtil.AreClose(itemsCorrectionFactor.Top, oldItemsCorrectionFactor.Top) && 
                      DoubleUtil.AreClose(itemsCorrectionFactor.Bottom, oldItemsCorrectionFactor.Bottom)))
                { 
                    remeasure = true;
                    GroupItem.DesiredPixelItemsSizeCorrectionFactorField.SetValue(virtualizingElement, itemsCorrectionFactor);
                }
            } 

            if (remeasure) 
            { 
                if (scrollingItemsControl != null)
                { 
                    itemsHost = scrollingItemsControl.ItemsHost;
                    if (itemsHost != null)
                    {
                        VirtualizingStackPanel vsp = itemsHost as VirtualizingStackPanel; 
                        if (vsp != null)
                        { 
                            vsp.AnchoredInvalidateMeasure(); 
                        }
                        else 
                        {
                            itemsHost.InvalidateMeasure();
                        }
                    } 
                }
            } 
        } 

        // This class reprents an item value that arises from a non-local source (e.g. current-value) 
        private class ModifiedItemValue
        {
            public ModifiedItemValue(Object value, FullValueSource valueSource)
            { 
                _value = value;
                _valueSource = valueSource; 
            } 

            public Object Value { get { return _value; } } 

            public boolean IsCoercedWithCurrentValue
            {
                get { return (_valueSource & FullValueSource.IsCoercedWithCurrentValue) != 0; } 
            }
 
            Object _value; 
            FullValueSource _valueSource;
        } 

//        #endregion

        public static void ClearVirtualizingElement(IHierarchicalVirtualizationAndScrollInfo virtualizingElement) 
        {
//            Debug.Assert(virtualizingElement != null, "Must have a virtualizingElement to clear"); 
 
            virtualizingElement.ItemDesiredSizes = new HierarchicalVirtualizationItemDesiredSizes();
            virtualizingElement.MustDisableVirtualization = false; 
        }

        /// <summary>
        /// Walk through the templated chilren tree of an element until a child of type T is found. 
        /// </summary>
        /// <typeparam name="T"></typeparam> 
        /// <param name="searchStart">element from where the tree walk starts</param> 
        /// <param name="templatedParent">TemplatedParent of all elements</param>
        /// <returns></returns> 
        public static /*T */FindTemplatedDescendant/*<T>*/(FrameworkElement searchStart, FrameworkElement templatedParent) //where T : FrameworkElement
        {
            FrameworkElement descendant = null;
            T found = null; 
            // Do a DFS among templated children
            int count = VisualTreeHelper.GetChildrenCount(searchStart); 
            for (int i = 0; (i < count) && (found == null); i++) 
            {
                descendant = VisualTreeHelper.GetChild(searchStart, i) as FrameworkElement; 
                if (descendant != null && descendant.TemplatedParent == templatedParent)
                {
                    T returnTypeElement = descendant as T;
                    if (returnTypeElement != null) 
                    {
                        found = returnTypeElement; 
                    } 
                    else
                    { 
                        found = FindTemplatedDescendant<T>(descendant, templatedParent);
                    }
                }
            } 

            return found; 
        } 

        /// <summary> 
        ///     Walks up the visual parent tree looking for a parent type.
        /// </summary>
        static T FindVisualAncestor/*<T>*/(DependencyObject element, Func<DependencyObject, Boolean> shouldContinueFunc) //where T : DependencyObject
        { 
            while (element != null)
            { 
                element = VisualTreeHelper.GetParent(element); 
                T correctlyTyped = element as T;
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
        }

        /// <summary> 
        /// Invalidates measure on visual tree from pathStartElement to pathEndElement
        /// </summary> 
        /// <param name="pathStartElement">descendant to start invalidation from</param> 
        /// <param name="pathEndElement">ancestor to stop invalidation at</param>
        public static void InvalidateMeasureOnPath(DependencyObject pathStartElement, DependencyObject pathEndElement, boolean duringMeasure) 
        {
            InvalidateMeasureOnPath(pathStartElement, pathEndElement, duringMeasure, false /*includePathEnd*/);
        }
 
        /// <summary>
        /// Invalidates measure on visual tree from pathStartElement to pathEndElement 
        /// </summary> 
        /// <param name="pathStartElement">descendant to start invalidation from</param>
        /// <param name="pathEndElement">ancestor to stop invalidation at</param> 
        static void InvalidateMeasureOnPath(DependencyObject pathStartElement, 
        		DependencyObject pathEndElement, boolean duringMeasure, boolean includePathEnd)
        {
//            Debug.Assert(VisualTreeHelper.IsAncestorOf(pathEndElement, pathStartElement), "pathEndElement should be an ancestor of pathStartElement");
 
            DependencyObject element = pathStartElement;
 
            // Includes pathStartElement 
            // Includes pathEndElement conditionally
            while (element != null) 
            {
                if (!includePathEnd &&
                    element == pathEndElement)
                { 
                    break;
                } 
                UIElement uiElement = element as UIElement; 
                if (uiElement != null)
                { 
                    //
                    //Please note that this method makes an call because
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
        } 
 
        static void InvalidateMeasureForSubtree(DependencyObject d)
        { 
            UIElement element = d as UIElement;
            if (element != null)
            {
                if (element.MeasureDirty) 
                {
                    return; 
                } 

                // 
                //Please note that this method makes an call because
                // it is expected to only be called when in a measure pass and
                // hence doesnt require these items to be explicitly added to
                // the layout queue. 
                //
                element.InvalidateMeasureInternal(); 
            } 

            int childrenCount = VisualTreeHelper.GetChildrenCount(d); 
            for (int i=0; i<childrenCount; i++)
            {
                DependencyObject child = VisualTreeHelper.GetChild(d, i);
                if (child != null) 
                {
                    InvalidateMeasureForSubtree(child); 
                } 
            }
        } 

        /// <summary>
        ///     Walks up the visual parent tree looking ancestor.
        ///     If we are out of visual parent it switches over to the logical parent. 
        /// </summary>
        /// <param name="ancestor"></param> 
        /// <param name="element"></param> 
        /// <returns></returns>
        static boolean IsAnyAncestorOf(DependencyObject ancestor, DependencyObject element) 
        {
            if (ancestor == null || element == null)
            {
                return false; 
            }
            return FindAnyAncestor(element, new/*cym add new*/ delegate(DependencyObject d) { return d == ancestor; }) != null; 
        } 

        /// <summary> 
        ///     Walks up the visual parent tree matching the given predicate.
        ///     If we are out of visual parents it switches over to the logical parent.
        /// </summary>
        static DependencyObject FindAnyAncestor(DependencyObject element, 
            Predicate<DependencyObject> predicate)
        { 
            while (element != null) 
            {
                element = GetAnyParent(element); 
                if (element != null && predicate(element))
                {
                    return element;
                } 
            }
            return null; 
        } 

        /// <summary> 
        ///     Returns visual parent if possible else
        ///     logical parent of the element.
        /// </summary>
        static DependencyObject GetAnyParent(DependencyObject element) 
        {
            DependencyObject parent = null; 
            if (!(element instanceof ContentElement)) 
            {
                parent = VisualTreeHelper.GetParent(element); 
            }
            if (parent == null)
            {
                parent = LogicalTreeHelper.GetParent(element); 
            }
            return parent; 
        } 

        /// <summary> 
        ///     Returns if the value source of the given property
        ///     on the given element is Default or not.
        /// </summary>
        static boolean IsDefaultValue(DependencyProperty dp, DependencyObject element) 
        {
            boolean hasModifiers; 
            return element.GetValueSource(dp, null, /*out*/ hasModifiers) == BaseValueSourceInternal.Default; 
        }
 

        /// <summary>
        ///     Return true if a TSF composition is in progress on the given
        ///     property of the given element. 
        /// </summary>
        public static boolean IsComposing(DependencyObject d, DependencyProperty dp) 
        { 
            if (dp != TextBox.TextProperty)
                return false; 

            return IsComposing(d as TextBoxBase);
        }
 
        static boolean IsComposing(TextBoxBase tbb)
        { 
            if (tbb == null) 
                return false;
 
            TextEditor te = tbb.TextEditor;
            if (te == null)
                return false;
 
            TextStore ts = te.TextStore;
            if (ts == null) 
                return false; 

            return ts.IsEffectivelyComposing; 
        }


        // The following unused API has been removed (caught by FxCop).  If needed, recall from history. 
        //
        // static Condition BuildCondition(DependencyProperty property, Object value) 
        // 
        // static MultiTrigger BuildMultiTrigger(ArrayList triggerCollection,
        //                                  String target, DP targetProperty, Object targetValue) 
        //
        // static Trigger BuildTrigger( DependencyProperty triggerProperty, Object triggerValue,
        //                              String target, DependencyProperty targetProperty, Object targetValue )
        // 
        // static boolean CheckWriteableContainerStatus()
        // 
        // static boolean IsCallerOfType(Type type) 
        //
        // public static boolean IsInStaticConstructorOfType(Type t) 
        //
        // private static boolean IsInWindowCollection(Object window)
        //
        // static boolean IsMetroContainer 
        //
        // static boolean IsRootElement(DependencyObject node) 
 
        //-----------------------------------------------------
        // 
        //  Private Enums, Structs, Constants
        //
        //-----------------------------------------------------
 
        static final Type   NullableType = Type.GetType("System.Nullable`1");
        // ItemValueStorage.  For each data item it stores a list of (DP, value) pairs that we want to preserve on the container. 
        private static final UncommonField<WeakDictionary<Object, List<KeyValuePair<Integer, Object>>>> ItemValueStorageField = 
                            new UncommonField<WeakDictionary<Object, List<KeyValuePair<Integer, Object>>>>();
 
        // Since ItemValueStorage is private and only used for TreeView and Grouping virtualization we hardcode the DPs that we'll store in it.
        // If we make this available as a service to the rest of the platform we'd come up with some sort of DP registration mechanism.
        private static final int[] ItemValueStorageIndices = new int[] {
            ItemValueStorageField.GlobalIndex, 
            TreeViewItem.IsExpandedProperty.GlobalIndex,
            Expander.IsExpandedProperty.GlobalIndex, 
            GroupItem.DesiredPixelItemsSizeCorrectionFactorField.GlobalIndex}; 
    }