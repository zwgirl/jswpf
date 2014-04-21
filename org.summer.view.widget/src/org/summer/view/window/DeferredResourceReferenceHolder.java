package org.summer.view.window;

import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Type;

/// <summary>
/// This signifies a DeferredResourceReference that is used as a place holder 
/// for the front loaded StaticResource within a deferred content section.
/// </summary>
/*internal*/ public class DeferredResourceReferenceHolder extends DeferredResourceReference
{ 
//    #region Constructor

    /*internal*/ public DeferredResourceReferenceHolder(Object resourceKey, Object value) 
    { 
    	super(null, null);
        _keyOrValue = new Object[]{resourceKey, value};
    }

//    #endregion Constructor 

//    #region Methods 

    /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource)
    { 
        return Value;
    }

    // Gets the type of the value it represents 
    /*internal*/ public /*override*/ Type GetValueType()
    { 
        Object value = Value; 
        return value != null ? value.GetType() : null;
    } 

//    #endregion Methods

//    #region Properties 

    /*internal*/ public /*override*/ Object Key 
    { 
        get { return ((Object[])_keyOrValue)[0]; }
    } 

    /*internal*/ public /*override*/ Object Value
    {
        get { return ((Object[])_keyOrValue)[1]; } 
        set { ((Object[])_keyOrValue)[1] = value; }
    } 

    /*internal*/ public /*override*/ boolean IsUnset
    { 
        get { return Value == DependencyProperty.UnsetValue; }
    }

//    #endregion Properties 
}