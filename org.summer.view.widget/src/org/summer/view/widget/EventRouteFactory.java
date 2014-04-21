package org.summer.view.widget;
/// <summary> 
///     Creates and recycles instance of EventRoute
/// </summary> 
/*internal*/ public /*static*/ class EventRouteFactory
{
//    #region Operations

    /// <summary>
    ///     Fetch a recycled Object if available 
    ///     else create a new instance 
    /// </summary>
    /*internal*/ public static EventRoute FetchObject(RoutedEvent routedEvent) 
    {
        EventRoute eventRoute = Pop();

        if (eventRoute == null) 
        {
            eventRoute = new EventRoute(routedEvent); 
        } 
        else
        { 
            eventRoute.RoutedEvent = routedEvent;
        }

        return eventRoute; 
    }

    /// <summary> 
    ///     Recycle the given instance of EventRoute
    /// </summary> 
    /*internal*/ public static void RecycleObject(EventRoute eventRoute)
    {
        // Cleanup all refernces held
        eventRoute.Clear(); 

        // Push instance on to the stack 
        Push(eventRoute); 
    }

//    #endregion Operations

//    #region HelperMethods

    /// <summary>
    ///     Push the given instance of EventRoute on to the stack 
    /// </summary> 
    private static void Push(EventRoute eventRoute)
    { 
        /*lock*/ synchronized(_synchronized)
        {
            // In a normal scenario it is extremely rare to
            // require more than 2 EventRoutes at the same time 
            if (_eventRouteStack == null)
            { 
                _eventRouteStack = new EventRoute[2]; 
                _stackTop = 0;
            } 

            if (_stackTop < 2)
            {
                _eventRouteStack[_stackTop++] = eventRoute; 
            }
        } 
    } 

    /// <summary> 
    ///     Pop off the last instance of EventRoute in the stack
    /// </summary>
    private static EventRoute Pop()
    { 
        /*lock*/synchronized (_synchronized)
        { 
            if (_stackTop > 0) 
            {
                EventRoute eventRoute = _eventRouteStack[--_stackTop]; 
                _eventRouteStack[_stackTop] = null;
                return eventRoute;
            }
        } 

        return null; 
    } 

//    #endregion HelperMethods 

//    #region Data

    private static EventRoute[] _eventRouteStack; 
    private static int _stackTop;
    private static Object _synchronized = new Object(); 

//    #endregion Data
} 