package org.summer.view.widget.data;

import org.summer.view.widget.EventArgs;

/// <summary> 
/// Arguments for BindingValueChanged events.
/// </summary> 
/*internal*/ public class BindingValueChangedEventArgs extends EventArgs
{
    //-----------------------------------------------------
    // 
    //  Constructors
    // 
    //----------------------------------------------------- 

    /*internal*/ public BindingValueChangedEventArgs(Object oldValue, Object newValue) 
    {
    	super();
        _oldValue = oldValue;
        _newValue = newValue;
    } 

    //------------------------------------------------------ 
    // 
    //  Public Properties
    // 
    //-----------------------------------------------------

    /// <summary>
    /// The old value of the binding. 
    /// </summary>
    public Object OldValue 
    { 
        get { return _oldValue; }
    } 

    /// <summary>
    /// The new value of the binding.
    /// </summary> 
    public Object NewValue
    { 
        get { return _newValue; } 
    }

    //------------------------------------------------------
    //
    //  Private Fields
    // 
    //------------------------------------------------------

    private Object _oldValue, _newValue; 
}