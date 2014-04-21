package org.summer.view.widget.markup;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.ResourceDictionary;
import org.summer.view.widget.SystemResourceKey;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.xaml.AmbientPropertyValue;
import org.summer.view.widget.xaml.IAmbientProvider;
import org.summer.view.widget.xaml.IXamlSchemaContextProvider;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlSchemaContext;
import org.summer.view.widget.xaml.XamlType;
import org.summer.view.window.DeferredResourceReference;
import org.summer.view.window.DeferredResourceReferenceHolder;
import org.summer.view.window.SystemResources;

/// <summary>
///  Class for Xaml markup extension for static resource references. 
/// </summary> 
//[MarkupExtensionReturnType(typeof(Object))]
//[Localizability(LocalizationCategory.NeverLocalize)] // cannot be localized 
public class StaticResourceExtension extends MarkupExtension
{
    /// <summary>
    ///  Constructor that takes no parameters 
    /// </summary>
    public StaticResourceExtension() 
    { 
    }

    /// <summary>
    ///  Constructor that takes the resource key that this is a static reference to.
    /// </summary>
    public StaticResourceExtension( 
        Object resourceKey)
    { 
        if (resourceKey == null) 
        {
            throw new ArgumentNullException("resourceKey"); 
        }
        _resourceKey = resourceKey;
    }

    /// <summary>
    ///  Return an Object that should be set on the targetObject's targetProperty 
    ///  for this markup extension.  For StaticResourceExtension, this is the Object found in 
    ///  a resource dictionary in the current parent chain that is keyed by ResourceKey
    /// </summary> 
    /// <param name="serviceProvider">Object that can provide services for the markup extension.</param>
    /// <returns>
    ///  The Object to set on this property.
    /// </returns> 
    public /*override*/ Object ProvideValue(IServiceProvider serviceProvider)
    { 
        if (ResourceKey instanceof SystemResourceKey) 
        {
            return (ResourceKey as SystemResourceKey).Resource; 
        }

        return ProvideValueInternal(serviceProvider, false);
    } 

    /// <summary> 
    ///  The key in a Resource Dictionary used to find the Object refered to by this 
    ///  Markup Extension.
    /// </summary> 
//    [ConstructorArgument("resourceKey")]
    public Object ResourceKey
    {
        get { return _resourceKey; } 
        set
        { 
            if (value == null) 
            {
                throw new ArgumentNullException("value"); 
            }
            _resourceKey = value;
        }
    } 

    /// <summary> 
    /// This value is used to resolved StaticResourceIds 
    /// </summary>
    /*internal*/ public /*virtual*/ DeferredResourceReference PrefetchedValue 
    {
        get { return null; }
    }

    /*internal*/ public Object ProvideValueInternal(IServiceProvider serviceProvider, boolean allowDeferredReference)
    { 
        Object value = TryProvideValueInternal(serviceProvider, allowDeferredReference, false /* mustReturnDeferredResourceReference */); 

        if (value == DependencyProperty.UnsetValue) 
        {
            throw new Exception(/*SR.Get(SRID.ParserNoResource, ResourceKey.ToString())*/);
        }
        return value; 
    }

    /*internal*/ public Object TryProvideValueInternal(IServiceProvider serviceProvider, boolean allowDeferredReference, 
    		boolean mustReturnDeferredResourceReference) 
    {
        // Get prefetchedValue 
        DeferredResourceReference prefetchedValue = PrefetchedValue;

        Object value;
        if (prefetchedValue == null) 
        {
            // Do a normal look up. 
            value = FindResourceInEnviroment(serviceProvider, allowDeferredReference, mustReturnDeferredResourceReference); 
        }
        else 
        {
            // If we have a Deferred Value, first check the current parse stack for a better (nearer)
            // value.  This happens when this is a parse of deferred content and there is another
            // Resource Dictionary availible above this, yet still part of this deferred content. 
            // This searches up to the outer most enclosing resource dictionary.
            value = FindResourceInDeferredContent(serviceProvider, allowDeferredReference, mustReturnDeferredResourceReference); 

            // If we didn't find a new value in this part of deferred content
            // then use the existing prefetchedValue (DeferredResourceReference) 
            if (value == DependencyProperty.UnsetValue)
            {
                value = allowDeferredReference
                         ? prefetchedValue 
                         : prefetchedValue.GetValue(BaseValueSourceInternal.Unknown);
            } 

        }
        return value; 
    }

    private ResourceDictionary FindTheResourceDictionary(IServiceProvider serviceProvider, boolean isDeferredContentSearch)
    { 
    	IXamlSchemaContextProvider schemaContextProvider = serviceProvider.GetService(typeof(IXamlSchemaContextProvider)) as IXamlSchemaContextProvider;
        if (schemaContextProvider == null) 
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionNoContext, GetType().Name, "IXamlSchemaContextProvider")*/);
        } 

        IAmbientProvider ambientProvider = serviceProvider.GetService(typeof(IAmbientProvider)) as IAmbientProvider;
        if (ambientProvider == null)
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionNoContext, GetType().Name, "IAmbientProvider")*/);
        } 

        XamlSchemaContext schemaContext = schemaContextProvider.SchemaContext;

        // This seems like a lot of work to do on every Provide Value
        // but that types and properties are cached in the schema.
        //
        XamlType feXType = schemaContext.GetXamlType(typeof(FrameworkElement)); 
        XamlType styleXType = schemaContext.GetXamlType(typeof(Style));
        XamlType templateXType = schemaContext.GetXamlType(typeof(FrameworkTemplate)); 
        XamlType appXType = schemaContext.GetXamlType(typeof(Application)); 
        XamlType fceXType = schemaContext.GetXamlType(typeof(FrameworkContentElement));

        XamlMember fceResourcesProperty = fceXType.GetMember("Resources");
        XamlMember feResourcesProperty = feXType.GetMember("Resources");
        XamlMember styleResourcesProperty = styleXType.GetMember("Resources");
        XamlMember styleBasedOnProperty = styleXType.GetMember("BasedOn"); 
        XamlMember templateResourcesProperty = templateXType.GetMember("Resources");
        XamlMember appResourcesProperty = appXType.GetMember("Resources"); 

        XamlType[] types = new XamlType[1] { schemaContext.GetXamlType(typeof(ResourceDictionary)) };

        IEnumerable<AmbientPropertyValue> ambientValues = null;

        ambientValues = ambientProvider.GetAllAmbientValues(null,    // ceilingTypes
                                                            isDeferredContentSearch, 
                                                            types,
                                                            fceResourcesProperty, 
                                                            feResourcesProperty, 
                                                            styleResourcesProperty,
                                                            styleBasedOnProperty, 
                                                            templateResourcesProperty,
                                                            appResourcesProperty);

        List<AmbientPropertyValue> ambientList; 
        ambientList = ambientValues as List<AmbientPropertyValue>;
//        Debug.Assert(ambientList != null, "IAmbientProvider.GetAllAmbientValues no longer returns List<>, please copy the list"); 

        for(int i=0; i<ambientList.Count; i++)
        { 
            AmbientPropertyValue ambientValue = ambientList[i];

            if (ambientValue.Value instanceof ResourceDictionary)
            { 
            	ResourceDictionary resourceDictionary = (ResourceDictionary)ambientValue.Value;
                if (resourceDictionary.Contains(ResourceKey)) 
                { 
                    return resourceDictionary;
                } 
            }
            if (ambientValue.Value instanceof Style)
            {
            	Style style = (Style)ambientValue.Value; 
            	ResourceDictionary resourceDictionary = style.FindResourceDictionary(ResourceKey);
                if (resourceDictionary != null) 
                { 
                    return resourceDictionary;
                } 
            }
        }
        return null;
    } 

    /*internal*/ public Object FindResourceInDeferredContent(IServiceProvider serviceProvider, boolean allowDeferredReference, boolean mustReturnDeferredResourceReference) 
    { 
        ResourceDictionary dictionaryWithKey = FindTheResourceDictionary(serviceProvider, /* isDeferredContentSearch */ true);
        Object value = DependencyProperty.UnsetValue; 

        if (dictionaryWithKey != null)
        {
            value = dictionaryWithKey.Lookup(ResourceKey, allowDeferredReference, mustReturnDeferredResourceReference, /*canCacheAsThemeResource:*/false); 
        }
        if (mustReturnDeferredResourceReference && value == DependencyProperty.UnsetValue) 
        { 
            value = new DeferredResourceReferenceHolder(ResourceKey, value);
        } 
        return value;
    }

    /// <summary> 
    /// Search just the App and Theme Resources.
    /// </summary> 
    /// <param name="serviceProvider"></param> 
    /// <param name="allowDeferredReference"></param>
    /// <param name="mustReturnDeferredResourceReference"></param> 
    /// <returns></returns>
    private Object FindResourceInAppOrSystem(IServiceProvider serviceProvider,
                                            boolean allowDeferredReference,
                                            boolean mustReturnDeferredResourceReference) 
    {
        Object val; 
        if (!SystemResources.IsSystemResourcesParsing) 
        {
            Object source; 
            val = FrameworkElement.FindResourceFromAppOrSystem(ResourceKey,
                                                               /*out*/ source,
                                                               false,  // disableThrowOnResourceFailure
                                                               allowDeferredReference, 
                                                               mustReturnDeferredResourceReference);
        } 
        else 
        {
            val = SystemResources.FindResourceInternal(ResourceKey, 
                                                       allowDeferredReference,
                                                       mustReturnDeferredResourceReference);
        }
        return val; 
    }


    private Object FindResourceInEnviroment(IServiceProvider serviceProvider,
                                            boolean allowDeferredReference, 
                                            boolean mustReturnDeferredResourceReference)
    {
        ResourceDictionary dictionaryWithKey = FindTheResourceDictionary(serviceProvider, /* isDeferredContentSearch */ false);

        if (dictionaryWithKey != null)
        { 
            Object value = dictionaryWithKey.Lookup(ResourceKey, allowDeferredReference, mustReturnDeferredResourceReference, /*canCacheAsThemeResource:*/false); 
            return value;
        } 

        // Look at app or themes
        Object val = FindResourceInAppOrSystem(serviceProvider, allowDeferredReference, mustReturnDeferredResourceReference);
        if (val == null) 
        {
            val = DependencyProperty.UnsetValue; 
        } 

        if (mustReturnDeferredResourceReference) 
        {
            if (!(val instanceof DeferredResourceReference))
            {
                val = new DeferredResourceReferenceHolder(ResourceKey, val); 
            }
        } 
        return val; 
    }

    private Object _resourceKey;
}