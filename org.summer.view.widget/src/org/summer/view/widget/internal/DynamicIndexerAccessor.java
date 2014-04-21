package org.summer.view.widget.internal;

import org.summer.view.widget.Type;
//#region DynamicIndexerAccessor

/*internal*/ public abstract class DynamicIndexerAccessor extends DynamicObjectAccessor
{ 
    protected DynamicIndexerAccessor(Type ownerType, String propertyName) 
    {
   	 super(ownerType, propertyName);
   }

    public abstract Object GetValue(Object component, Object[] args);

    public abstract void SetValue(Object component, Object[] args, Object value);
} 

//#endregion DynamicIndexerAccessor