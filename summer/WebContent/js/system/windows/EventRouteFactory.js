/**
 * Second check 2013-12-15
 * EventRouteFactory
 */

define(["dojo/_base/declare", "system/Type", "windows/EventRoute"],
		function(declare, Type, EventRoute){
	
	var EventRouteFactory = declare("EventRouteFactory", null,{
		constructor:function(){
		}
	});

//    private static EventRoute[] 
    var _eventRouteStack = null; 
//    private static int 
    var _stackTop = 0;
	
    /// <summary>
    ///     Fetch a recycled object if available 
    ///     else create a new instance 
    /// </summary>
//    internal static EventRoute 
    EventRouteFactory.FetchObject = function(/*RoutedEvent*/ routedEvent) 
    {
        /*EventRoute*/var eventRoute = Pop();

        if (eventRoute == null) 
        {
            eventRoute = new EventRoute(routedEvent); 
        } 
        else
        { 
            eventRoute.RoutedEvent = routedEvent;
        }

        return eventRoute; 
    };

    /// <summary> 
    ///     Recycle the given instance of EventRoute
    /// </summary> 
//    internal static void 
    EventRouteFactory.RecycleObject = function(/*EventRoute*/ eventRoute)
    {
        // Cleanup all refernces held
        eventRoute.Clear(); 

        // Push instance on to the stack 
        Push(eventRoute); 
    };

    /// <summary>
    ///     Push the given instance of EventRoute on to the stack 
    /// </summary> 
//    private static void 
    function Push (/*EventRoute*/ eventRoute)
    { 
        // In a normal scenario it is extremely rare to
        // require more than 2 EventRoutes at the same time 
        if (_eventRouteStack == null)
        { 
            _eventRouteStack = []; //new EventRoute[2]; 
//            _eventRouteStack[0] = new EventRoute();
//            _eventRouteStack[1] = new EventRoute();
            _eventRouteStack.length = 2;
            
            _stackTop = 0;
        } 

        if (_stackTop < 2)
        {
            _eventRouteStack[_stackTop++] = eventRoute; 
        }
    } 

    /// <summary> 
    ///     Pop off the last instance of EventRoute in the stack
    /// </summary>
//    private static EventRoute 
    function Pop()
    { 
        if (_stackTop > 0) 
        {
            /*EventRoute*/var eventRoute = _eventRouteStack[--_stackTop]; 
            _eventRouteStack[_stackTop] = null;
            return eventRoute;
        }

        return null; 
    } 
	
    EventRouteFactory.Type = new Type("EventRouteFactory", EventRouteFactory, [Object.Type]);
	return EventRouteFactory;
});