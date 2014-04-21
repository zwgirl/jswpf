package org.summer.view.widget.internal;

import org.summer.view.widget.Type;
//#region DynamicPropertyAccessor

/*internal*/ public abstract class DynamicPropertyAccessor extends DynamicObjectAccessor 
{
    protected DynamicPropertyAccessor(Type ownerType, String propertyName) 
    {
    	 super(ownerType, propertyName);
    }

    public abstract Object GetValue(Object component);

    public abstract void SetValue(Object component, Object value); 
}

//#endregion DynamicPropertyAccessor