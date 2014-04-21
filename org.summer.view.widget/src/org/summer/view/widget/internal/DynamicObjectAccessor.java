package org.summer.view.widget.internal;

import org.summer.view.widget.Type;
//#region DynamicObjectAccessor 

/*internal*/ public class DynamicObjectAccessor
{ 
    protected DynamicObjectAccessor(Type ownerType, String propertyName)
    {
        _ownerType = ownerType;
        _propertyName = propertyName; 
    }

    public Type OwnerType { get { return _ownerType; } } 
    public String PropertyName { get { return _propertyName; } }
    public boolean IsReadOnly { get { return false; } } 
    public Type PropertyType { get { return typeof(Object); } }

    public static String MissingMemberErrorString(Object target, String name)
    { 
        return SW.SR.Get(SW.SRID.PropertyPathNoProperty, target, "Items");
    } 

    Type _ownerType;
    String _propertyName; 
}

//#endregion DynamicObjectAccessor
