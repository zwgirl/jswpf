package org.summer.view.widget.controls;

import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.DeferredReference;
import org.summer.view.widget.Type;
import org.summer.view.widget.controls.primitives.Selector;

//Proxy Object passed to the property system to delay load Selector.SelectedIndex 
// values. 
/*internal*/ public class DeferredSelectedIndexReference extends DeferredReference
{ 
    //-----------------------------------------------------
    //
    //  Constructors
    // 
    //-----------------------------------------------------

//    #region Constructors 

    /*internal*/ public DeferredSelectedIndexReference(Selector selector) 
    {
        _selector = selector;
    }

//    #endregion Constructors

    //------------------------------------------------------ 
    //
    //  Internal Methods 
    //
    //-----------------------------------------------------

//    #region Internal Methods 

    // Does the real work to calculate the current SelectedIndexProperty value. 
    /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource) 
    {
        return _selector.InternalSelectedIndex; 
    }

    // Gets the type of the value it represents
    /*internal*/ public /*override*/ Type GetValueType() 
    {
        return typeof(Integer); 
    } 

//    #endregion Internal Methods 

    //------------------------------------------------------
    //
    //  Private Fields 
    //
    //------------------------------------------------------ 

//    #region Private Fields

    // Selector mapped to this Object.
    private final Selector _selector;

//    #endregion Private Fields 
 }