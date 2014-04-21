package org.summer.view.widget;

import org.summer.view.widget.markup.MarkupExtension;

/// <summary> 
///     Abstract base class for various resource keys.
///     Provides a common base for simple key detection in resource components. 
/// </summary>
//[MarkupExtensionReturnType(typeof(ResourceKey))]
public abstract class ResourceKey extends MarkupExtension
{ 
    /// <summary>
    ///     Used to determine where to look for the resource dictionary that holds this resource. 
    /// </summary> 
    public abstract Assembly Assembly
    { 
        get;
    }

    /// <summary> 
    ///  Return this object.  ResourceKeys are typically used as a key in a dictionary.
    /// </summary> 
    public /*override*/ Object ProvideValue(IServiceProvider serviceProvider) 
    {
        return this; 
    }
}