package org.summer.view.widget.controls;

import org.summer.view.window.TemplateKey;

/// <summary> Resource key for a ItemContainerTemplate</summary>
public class ItemContainerTemplateKey extends TemplateKey 
{
    /// <summary> Constructor</summary>
    /// <remarks>
    /// When constructed without dataType (e.g. in XAML), 
    /// the DataType must be specified as a property.
    /// </remarks> 
    public ItemContainerTemplateKey() 
    { 
    	super(TemplateType.TableTemplate); // This should be TemplateType.ItemContainerTemplate
    }

    /// <summary> Constructor</summary>
    public ItemContainerTemplateKey(Object dataType) 
    { 
    	super(TemplateType.TableTemplate, dataType); // This should be TemplateType.ItemContainerTemplate
    } 
}