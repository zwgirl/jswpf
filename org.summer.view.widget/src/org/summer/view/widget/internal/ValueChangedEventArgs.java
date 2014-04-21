package org.summer.view.widget.internal;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.model.PropertyDescriptor;
//#region ValueChangedEventArgs 

/*internal*/ public class ValueChangedEventArgs extends EventArgs 
{
    /*internal*/ public ValueChangedEventArgs(PropertyDescriptor pd)
    {
        _pd = pd; 
    }

    /*internal*/ public PropertyDescriptor PropertyDescriptor 
    {
        get { return _pd; } 
    }

    private PropertyDescriptor _pd;
} 
//#endregion ValueChangedEventArgs