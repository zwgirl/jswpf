package org.summer.view.widget.markup;

import org.summer.view.widget.IServiceProvider;

/// <summary>
///  Class for Xaml markup extension for Null.
/// </summary>
//[MarkupExtensionReturnType(typeof(object))]
public class NullExtension extends MarkupExtension
{
    /// <summary>
    ///  Default constructor
    /// </summary>
    public NullExtension()
    {
    }

    /// <summary>
    ///  Return an object that should be set on the targetObject's targetProperty
    ///  for this markup extension.  In this case it is simply null.
    /// </summary>
    /// <param name="serviceProvider">Object that can provide services for the markup extension.
    /// <returns>
    ///  The object to set on this property.
    /// </returns>
    public /*override*/ Object ProvideValue(IServiceProvider serviceProvider)
    {
        return null;
    }

}