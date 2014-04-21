package org.summer.view.widget.model;

import org.summer.view.widget.Type;

public class ItemPropertyInfo
{
    /// <summary> Creates a new instance of ItemPropertyInfo. </summary>
    public ItemPropertyInfo(String name, Type type, Object descriptor)
    {
        _name = name;
        _type = type;
        _descriptor = descriptor;
    }
 
    /// <summary> The property's name. </summary>
    public String  Name { get { return _name; } }
 
    /// <summary> The property's type. </summary>
    public Type    PropertyType { get { return _type; } }
 
    /// <summary> More information about the property.  This may be null,
    /// the view is unable to provide any more information.  Or it may be
    /// an object that describes the property, such as a PropertyDescriptor,
    /// a PropertyInfo, or the like.
    /// </summary>
    public Object  Descriptor { get { return _descriptor; } }
  
    String _name;
    Type _type;
    Object _descriptor;
}