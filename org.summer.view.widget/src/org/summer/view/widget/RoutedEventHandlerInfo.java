package org.summer.view.widget;
/// <summary> 
///     Container for handler instance and other
///     invocation preferences for this handler 
///     instance 
/// </summary>
/// <remarks> 
///     RoutedEventHandlerInfo constitutes the
///     handler instance and flag that indicates if
///     or not this handler must be invoked for
///     already handled events <para/> 
///     <para/>
/// 
///     This class needs to be public because it is 
///     used by ContentElement in the Framework
///     to store Instance EventHandlers 
/// </remarks>
//CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = Microsoft./*internal*/ public.BuildInfo.WCP_PUBLIC_KEY_STRING)]
public class RoutedEventHandlerInfo
{ 
//    #region Construction

    /// <summary> 
    ///     Construtor for RoutedEventHandlerInfo
    /// </summary> 
    /// <param name="handler">
    ///     Non-null handler
    /// </param>
    /// <param name="handledEventsToo"> 
    ///     Flag that indicates if or not the handler must
    ///     be invoked for already handled events 
    /// </param> 
    /*internal*/ public RoutedEventHandlerInfo(Delegate handler, boolean handledEventsToo)
    { 
        _handler = handler;
        _handledEventsToo = handledEventsToo;
    }

//    #endregion Construction

//    #region Operations 

    /// <summary> 
    ///     Returns associated handler instance
    /// </summary>
    public Delegate Handler
    { 
        get {return _handler;}
    } 

    /// <summary>
    ///     Returns HandledEventsToo Flag 
    /// </summary>
    public boolean InvokeHandledEventsToo
    {
        get {return _handledEventsToo;} 
    }

    // Invokes handler instance as per specified 
    // invocation preferences
    /*internal*/ public void InvokeHandler(Object target, RoutedEventArgs routedEventArgs) 
    {
        if ((routedEventArgs.Handled == false) || (_handledEventsToo == true))
        {
            if (_handler instanceof RoutedEventHandler) 
            {
                // Generic RoutedEventHandler is called directly here since 
                //  we don't need the InvokeEventHandler override to cast to 
                //  the proper type - we know what it is.
                ((RoutedEventHandler)_handler)(target, routedEventArgs); 
            }
            else
            {
                // NOTE: Cannot call protected method InvokeEventHandler directly 
                routedEventArgs.InvokeHandler(_handler, target);
            } 
        } 
    }

    /// <summary>
    ///     Is the given Object equivalent to the current one
    /// </summary>
    public /*override*/ boolean Equals(Object obj) 
    {
        if (obj == null || !(obj instanceof RoutedEventHandlerInfo)) 
            return false; 

        return Equals((RoutedEventHandlerInfo)obj); 
    }

    /// <summary>
    ///     Is the given RoutedEventHandlerInfo equals the current 
    /// </summary>
    public boolean Equals(RoutedEventHandlerInfo handlerInfo) 
    { 
        return _handler == handlerInfo._handler && _handledEventsToo == handlerInfo._handledEventsToo;
    } 

    /// <summary>
    ///     Serves as a hash function for a particular type, suitable for use in
    ///     hashing algorithms and data structures like a hash table 
    /// </summary>
    public /*override*/ int GetHashCode() 
    { 
        return super.GetHashCode();
    } 

    /// <summary>
    ///     Equals operator overload
    /// </summary> 
    public static boolean operator== (RoutedEventHandlerInfo handlerInfo1, RoutedEventHandlerInfo handlerInfo2)
    { 
        return handlerInfo1.Equals(handlerInfo2); 
    }

    /// <summary>
    ///     NotEquals operator overload
    /// </summary>
    public static boolean operator!= (RoutedEventHandlerInfo handlerInfo1, RoutedEventHandlerInfo handlerInfo2) 
    {
        return !handlerInfo1.Equals(handlerInfo2); 
    } 

    /// <summary> 
    ///     Cleanup all the references within the data
    /// </summary>
    /*
    Commented out to avoid "uncalled private code" fxcop violation 
    internal public void Clear()
    { 
        _handler = null; 
        _handledEventsToo = false;
    } 
    */

//    #endregion Operations

//    #region Data

    private Delegate _handler; 
    private boolean _handledEventsToo;

//    #endregion Data
}


