package org.summer.view.widget;

import org.summer.view.widget.data.IValueConverter;
import org.summer.view.widget.markup.MarkupExtension;

/// <summary>
///  Class for Xaml markup extension for TemplateBindings that
///  can be set on the nodes of the Template VisualTree.
/// </summary> 
//[TypeConverter(typeof(TemplateBindingExtensionConverter))]
//[MarkupExtensionReturnType(typeof(Object))] 
public class TemplateBindingExtension extends MarkupExtension 
{
    /// <summary> 
    ///  Constructor that takes no parameters
    /// </summary>
    public TemplateBindingExtension()
    { 
    }

    /// <summary> 
    ///  Constructor that takes the resource key that this is a static reference to.
    /// </summary> 
    public TemplateBindingExtension(
        DependencyProperty property)
    {
        if (property != null) 
        {
            _property = property; 
        } 
        else
        { 
            throw new ArgumentNullException("property");
        }
    }

    /// <summary>
    ///  Return an Object that should be set on the targetObject's targetProperty 
    ///  for this markup extension.  For TemplateBindingExtension, this is the Object found in 
    ///  a resource dictionary in the current parent chain that is keyed by ResourceKey
    /// </summary> 
    /// <param name="serviceProvider">ServiceProvider that can be queried for services.</param>
    /// <returns>
    ///  The Object to set on this property.
    /// </returns> 
    public /*override*/ Object ProvideValue(IServiceProvider serviceProvider)
    { 
        if (Property == null) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionProperty)*/); 
        }

        return new TemplateBindingExpression(this);
    } 

    /// <summary> 
    ///     Property we are binding to 
    /// </summary>
//    [ConstructorArgument("property")] 
    public DependencyProperty Property
    {
        get { return _property; }
        set 
        {
            if (value == null) 
            { 
                throw new ArgumentNullException("value");
            } 
            _property = value;
        }
    }

    /// <summary>
    ///     ValueConverter to interpose between the source and target properties 
    /// </summary> 
//    [DefaultValue(null)]
    public IValueConverter Converter 
    {
        get { return _converter; }
        set
        { 
            if (value == null)
            { 
                throw new ArgumentNullException("value"); 
            }
            _converter = value; 
        }
    }

    /// <summary> 
    ///     ConverterParameter we are binding to
    /// </summary> 
//    [DefaultValue(null)] 
    public Object ConverterParameter
    { 
        get { return _parameter; }
        set { _parameter = value; }
    }

    private DependencyProperty _property;
    private IValueConverter _converter; 
    private Object _parameter; 
}