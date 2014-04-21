package org.summer.view.widget;
//An item in the EventRoute 
	//
	// RouteItem constitutes 
	// the target Object and 
	// list of RoutedEventHandlerInfo that need
	// to be invoked upon the target Object 
	/*internal*/ public class RouteItem
	{
//	    #region Construction
	
	    // Constructor for RouteItem
	    /*internal*/ public RouteItem(Object target, RoutedEventHandlerInfo routedEventHandlerInfo) 
	    { 
	        _target = target;
	        _routedEventHandlerInfo = routedEventHandlerInfo; 
	    }
	
//	    #endregion Construction
	
//	    #region Operations
	
	    // Returns target 
	    /*internal*/ public Object Target
	    { 
	        get {return _target;}
	    }
	
	    // Invokes the associated RoutedEventHandler 
	    // on the target Object with the given
	    // RoutedEventArgs 
	    /*internal*/ public void InvokeHandler(RoutedEventArgs routedEventArgs) 
	    {
	        _routedEventHandlerInfo.InvokeHandler(_target, routedEventArgs); 
	    }
	
	    /*
	    Commented out to avoid "uncalled private code" fxcop violation 
	
	    /// <summary> 
	    ///     Cleanup all the references within the data 
	    /// </summary>
	    internal public void Clear() 
	    {
	        _target = null;
	        _routedEventHandlerInfo.Clear();
	    } 
	    */
	
	    /// <summary> 
	    ///     Is the given Object equals the current
	    /// </summary> 
	    public /*override*/ boolean Equals(Object o)
	    {
	        return Equals((RouteItem)o);
	    } 
	
	    /// <summary> 
	    ///     Is the given RouteItem equals the current 
	    /// </summary>
	    public boolean Equals(RouteItem routeItem) 
	    {
	        return (
	            routeItem._target == this._target &&
	            routeItem._routedEventHandlerInfo == this._routedEventHandlerInfo); 
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
	    public static boolean operator== (RouteItem routeItem1, RouteItem routeItem2)
	    {
	        return routeItem1.Equals(routeItem2);
	    } 
	
	    /// <summary> 
	    ///     NotEquals operator overload 
	    /// </summary>
	    public static boolean operator!= (RouteItem routeItem1, RouteItem routeItem2) 
	    {
	        return !routeItem1.Equals(routeItem2);
	    }
	
//	    #endregion Operations
	
//	    #region Data 
	
	    private Object _target; 
	    private RoutedEventHandlerInfo _routedEventHandlerInfo;
	
//	    #endregion Data
	}


