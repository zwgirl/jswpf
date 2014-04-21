package org.summer.view.widget;
// Proxy object passed to the property system to delay load values.
// 
// The property system will make a GetValue callback (dereferencing the 
// reference) inside DependencyProperty.GetValue calls, or before
// coercion callbacks to derived classes. 
//
// DeferredReference instances are passed directly to ValidateValue
// callbacks (which always go to the DependencyProperty owner class),
// and also to CoerceValue callbacks on the owner class only.  THEREFORE, 
// IT IS

//[FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
/*internal*/ public abstract class DeferredReference
{ 
    //-----------------------------------------------------
    //
    //  /*internal*/ public Methods
    // 
    //-----------------------------------------------------

//    #region /*internal*/ public Methods 

    // Deferences a property value on demand. 
    /*internal*/ public abstract Object GetValue(BaseValueSourceInternal valueSource);

    // Gets the type of the value it represents
    /*internal*/ public abstract Type GetValueType(); 

//    #endregion /*internal*/ public Methods 
} 
