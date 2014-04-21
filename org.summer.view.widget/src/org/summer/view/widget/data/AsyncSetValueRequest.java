package org.summer.view.widget.data;

/// <summary> Async request to set the value of a property on an item. </summary>
/*internal*/ 
public class AsyncSetValueRequest extends AsyncDataRequest 
{ 
    //-----------------------------------------------------
    // 
    //  Constructors
    //
    //-----------------------------------------------------

    /// <summary> Constructor. </summary>
    /*internal*/ public AsyncSetValueRequest( Object item, 
                        String propertyName, 
                        Object value,
                        Object bindingState, 
                        AsyncRequestCallback workCallback,
                        AsyncRequestCallback completedCallback,
                        /*params*/ Object[] args
                        ) 
    { 
    	super(bindingState, workCallback, completedCallback, args);
        _item = item; 
        _propertyName = propertyName;
        _value = value; 
    }

    //------------------------------------------------------
    // 
    //  Public Properties
    // 
    //----------------------------------------------------- 

    /// <summary> The item whose property is being set </summary> 
    public Object TargetItem { get { return _item; } }

    /* unused by default scheduler.  Restore for custom schedulers.
    /// <summary> The name of the property being set </summary> 
    public String PropertyName { get { return _propertyName; } }
    */ 

    /// <summary> The new value for the property </summary>
    public Object Value { get { return _value; } } 

    //------------------------------------------------------
    //
    //  Private data 
    //
    //------------------------------------------------------ 

    Object _item;
    String _propertyName; 
    Object _value;
}