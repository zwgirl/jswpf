/**
 * EventRouteFactory
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var EventRouteFactory = declare("EventRouteFactory", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(EventRouteFactory.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	EventRouteFactory.Type = new Type("EventRouteFactory", EventRouteFactory, [Object.Type]);
	return EventRouteFactory;
});

using System; 
using System.Windows;

using MS.Utility;
 
namespace System.Windows
{ 
    /// <summary> 
    ///     Creates and recycles instance of EventRoute
    /// </summary> 
    internal static class EventRouteFactory
    {
        #region Operations
 
        /// <summary>
        ///     Fetch a recycled object if available 
        ///     else create a new instance 
        /// </summary>
        internal static EventRoute FetchObject(RoutedEvent routedEvent) 
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
        internal static void RecycleObject(EventRoute eventRoute)
        {
            // Cleanup all refernces held
            eventRoute.Clear(); 

            // Push instance on to the stack 
            Push(eventRoute); 
        }
 
        #endregion Operations

        #region HelperMethods
 
        /// <summary>
        ///     Push the given instance of EventRoute on to the stack 
        /// </summary> 
        private static void Push(EventRoute eventRoute)
        { 
            lock (_synchronized)
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
            lock (_synchronized)
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

        #endregion HelperMethods 

        #region Data

        private static EventRoute[] _eventRouteStack; 
        private static int _stackTop;
        private static object _synchronized = new object(); 
 
        #endregion Data
    } 
}
