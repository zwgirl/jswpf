package org.summer.view.window;
/// <summary> Resource key for a DataTemplate</summary> 
public class DataTemplateKey extends TemplateKey 
{
    /// <summary> Constructor</summary> 
    /// <remarks>
    /// When constructed without dataType (e.g. in XAML),
    /// the DataType must be specified as a property.
    /// </remarks> 
    public DataTemplateKey()
    { 
    	super(TemplateType.DataTemplate) ;
    }

    /// <summary> Constructor</summary>
    public DataTemplateKey(Object dataType)
    { 
    	super(TemplateType.DataTemplate, dataType);
    }
}