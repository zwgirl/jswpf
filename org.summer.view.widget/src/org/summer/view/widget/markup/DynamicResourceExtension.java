package org.summer.view.widget.markup;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.internal.Helper;
import org.summer.view.window.ResourceReferenceExpression;

/// <summary>
///  Class for Xaml markup extension for static resource references.
/// </summary> 
//[TypeConverter(typeof(DynamicResourceExtensionConverter))]
//[MarkupExtensionReturnType(typeof(Object))] 
public class DynamicResourceExtension extends MarkupExtension 
{
    /// <summary> 
    ///  Constructor that takes no parameters
    /// </summary>
    public DynamicResourceExtension()
    { 
    }

    /// <summary> 
    ///  Constructor that takes the resource key that this is a static reference to.
    /// </summary> 
    public DynamicResourceExtension(
        Object resourceKey)
    {
        if (resourceKey == null) 
        {
            throw new IllegalArgumentException("resourceKey"); 
        } 
        _resourceKey = resourceKey;
    } 


    /// <summary>
    ///  Return an Object that should be set on the targetObject's targetProperty 
    ///  for this markup extension.  For DynamicResourceExtension, this is the Object found in
    ///  a resource dictionary in the current parent chain that is keyed by ResourceKey 
    /// </summary> 
    /// <returns>
    ///  The Object to set on this property. 
    /// </returns>
    public /*override*/ Object ProvideValue(IServiceProvider serviceProvider)
    {
        if (ResourceKey == null) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionResourceKey)*/); 
        } 

        if (serviceProvider != null) 
        {
            // DynamicResourceExtensions are not allowed On CLR props except for Setter,Trigger,Condition (bugs 1183373,1572537)

            DependencyObject targetDependencyObject; 
            DependencyProperty targetDependencyProperty;
            Helper.CheckCanReceiveMarkupExtension(this, serviceProvider, /*out*/ targetDependencyObject, /*out*/ targetDependencyProperty); 
        } 

        return new ResourceReferenceExpression(ResourceKey); 
    }



    /// <summary>
    ///  The key in a Resource Dictionary used to find the Object refered to by this 
    ///  Markup Extension. 
    /// </summary>
//    [ConstructorArgument("resourceKey")] // Uses an instance descriptor 
    public Object ResourceKey
    {
        get { return _resourceKey; }
        set 
        {
            if (value == null) 
            { 
                throw new IllegalArgumentException("value");
            } 
            _resourceKey = value;
        }
    }

    private Object _resourceKey;

} 