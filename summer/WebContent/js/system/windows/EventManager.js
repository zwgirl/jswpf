/**
 * EventManager
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutingStrategy", "windows/GlobalEventManager"], 
		function(declare, Type, RoutingStrategy, GlobalEventManager){
	var EventManager = declare("EventManager", null,{
	
	});
	
	Object.defineProperties(EventManager.prototype,{

	});
	
    /// <summary> 
    ///     Registers a <see cref="RoutedEvent"/>
    ///     with the given parameters
    /// </summary>
    /// <remarks> 
    ///     <see cref="RoutedEvent.Name"/> must be
    ///     unique within the <see cref="RoutedEvent.OwnerType"/> 
    ///     (super class types not considered when talking about 
    ///     uniqueness) and cannot be null <para/>
    ///     <see cref="RoutedEvent.HandlerType"/> must be a 
    ///     type of delegate and cannot be null <para/>
    ///     <see cref="RoutedEvent.OwnerType"/> must be any
    ///     object type and cannot be null <para/>
    ///     <para/> 
    ///
    ///     NOTE: Caller must be the static constructor of the 
    ///     <see cref="RoutedEvent.OwnerType"/> - 
    ///     enforced by stack walk
    /// </remarks> 
    /// <param name="name">
    ///     <see cref="RoutedEvent.Name"/>
    /// </param>
    /// <param name="routingStrategy"> 
    ///     <see cref="RoutedEvent.RoutingStrategy"/>
    /// </param> 
    /// <param name="handlerType"> 
    ///     <see cref="RoutedEvent.HandlerType"/>
    /// </param> 
    /// <param name="ownerType">
    ///     <see cref="RoutedEvent.OwnerType"/>
    /// </param>
    /// <returns> 
    ///     The new registered <see cref="RoutedEvent"/>
    /// </returns> 
    /// <ExternalAPI/> 
//    public static RoutedEvent 
    EventManager.RegisterRoutedEvent = function(
        /*string*/ name, 
        /*RoutingStrategy*/ routingStrategy,
        /*Type*/ handlerType,
        /*Type*/ ownerType)
    { 
        if (name == null)
        { 
            throw new Error('ArgumentNullException("name")'); 
        }

        if (routingStrategy != RoutingStrategy.Tunnel &&
            routingStrategy != RoutingStrategy.Bubble &&
            routingStrategy != RoutingStrategy.Direct)
        { 
            throw new Error('InvalidEnumArgumentException("routingStrategy", routingStrategy, typeof(RoutingStrategy)');
        } 

        if (handlerType == null)
        { 
            throw new Error('ArgumentNullException("handlerType")');
        }

        if (ownerType == null) 
        {
            throw new Error('ArgumentNullException("ownerType")'); 
        } 

        if (GlobalEventManager.GetRoutedEventFromName(name, ownerType, false) != null) 
        {
            throw new Error('ArgumentException(SR.Get(SRID.DuplicateEventName, name, ownerType)');
        }

        return GlobalEventManager.RegisterRoutedEvent(name, routingStrategy, handlerType, ownerType);
    }; 
    

    /// <summary>
    ///     Add a routed event handler to all instances of a
    ///     particular type inclusive of its sub-class types 
    /// </summary>
    /// <remarks> 
    ///     The handlers added thus are also known as 
    ///     an class handlers <para/>
    ///     <para/> 
    ///
    ///     Class handlers are invoked before the
    ///     instance handlers. Also see
    ///     <see cref="UIElement.AddHandler(RoutedEvent, Delegate)"/> <para/> 
    ///     Sub-class class handlers are invoked before
    ///     the super-class class handlers <para/> 
    ///     <para/> 
    ///
    ///     Input parameters classType, <see cref="RoutedEvent"/> 
    ///     and handler cannot be null <para/>
    ///     handledEventsToo input parameter when false means
    ///     that listener does not care about already handled events.
    ///     Hence the handler will not be invoked on the target if 
    ///     the RoutedEvent has already been
    ///     <see cref="RoutedEventArgs.Handled"/> <para/> 
    ///     handledEventsToo input parameter when true means 
    ///     that the listener wants to hear about all events even if
    ///     they have already been handled. Hence the handler will 
    ///     be invoked irrespective of the event being
    ///     <see cref="RoutedEventArgs.Handled"/>
    /// </remarks>
    /// <param name="classType"> 
    ///     Target object type on which the handler will be invoked
    ///     when the RoutedEvent is raised 
    /// </param> 
    /// <param name="routedEvent">
    ///     <see cref="RoutedEvent"/> for which the handler 
    ///     is attached
    /// </param>
    /// <param name="handler">
    ///     The handler that will be invoked on the target object 
    ///     when the RoutedEvent is raised
    /// </param> 
    /// <param name="handledEventsToo"> 
    ///     Flag indicating whether or not the listener wants to
    ///     hear about events that have already been handled 
    /// </param>
    /// <ExternalAPI/>
//    public static void 
    EventManager.RegisterClassHandler = function(
        /*Type*/ classType, 
        /*RoutedEvent*/ routedEvent,
        /*Delegate*/ handler, 
        /*bool*/ handledEventsToo) 
    {
        if (classType == null) 
        {
            throw new Error('ArgumentNullException("classType")');
        }

        if (routedEvent == null)
        { 
            throw new Error('ArgumentNullException("routedEvent")'); 
        }

        if (handler == null)
        {
            throw new Error('ArgumentNullException("handler")');
        } 

        if (!UIElement.Type.IsAssignableFrom(classType) && 
            !ContentElement.Type.IsAssignableFrom(classType))
        { 
            throw new Error('ArgumentException(SR.Get(SRID.ClassTypeIllegal)');
        }

        if (!routedEvent.IsLegalHandler(handler)) 
        {
            throw new Error('ArgumentException(SR.Get(SRID.HandlerTypeIllegal)'); 
        } 
        
        if(handledEventsToo === undefined){
        	handledEventsToo = false;
        }

        GlobalEventManager.RegisterClassHandler(classType, routedEvent, handler, handledEventsToo); 
    };

    /// <summary>
    ///     Returns <see cref="RoutedEvent"/>s 
    ///     that have been registered so far
    /// </summary> 
    /// <remarks> 
    ///     Also see
    ///     <see cref="EventManager.RegisterRoutedEvent"/> 
    ///     <para/>
    ///     <para/>
    ///
    ///     NOTE: There may be more 
    ///     <see cref="RoutedEvent"/>s registered later
    /// </remarks> 
    /// <returns> 
    ///     The <see cref="RoutedEvent"/>s
    ///     that have been registered so far 
    /// </returns>
    /// <ExternalAPI/>
//    public static RoutedEvent[] 
    EventManager.GetRoutedEvents = function()
    { 
        return GlobalEventManager.GetRoutedEvents();
    };

    /// <summary>
    ///     Finds <see cref="RoutedEvent"/>s for the 
    ///     given <see cref="RoutedEvent.OwnerType"/>
    /// </summary>
    /// <remarks>
    ///     More specifically finds 
    ///     <see cref="RoutedEvent"/>s starting
    ///     on the <see cref="RoutedEvent.OwnerType"/> 
    ///     and looking at its super class types <para/> 
    ///     <para/>
    /// 
    ///     If no matches are found, this method returns null
    /// </remarks>
    /// <param name="ownerType">
    ///     <see cref="RoutedEvent.OwnerType"/> to start 
    ///     search with and follow through to super class types
    /// </param> 
    /// <returns> 
    ///     Matching <see cref="RoutedEvent"/>s
    /// </returns> 
    /// <ExternalAPI/>
//    public static RoutedEvent[] 
    EventManager.GetRoutedEventsForOwner = function(/*Type*/ ownerType)
    {
        if (ownerType == null) 
        {
            throw new Error('ArgumentNullException("ownerType")'); 
        } 

        return GlobalEventManager.GetRoutedEventsForOwner(ownerType); 
    };

    /// <summary>
    ///     Finds a <see cref="RoutedEvent"/> with a 
    ///     matching <see cref="RoutedEvent.Name"/>
    ///     and <see cref="RoutedEvent.OwnerType"/> 
    /// </summary> 
    /// <remarks>
    ///     More specifically finds a 
    ///     <see cref="RoutedEvent"/> with a matching
    ///     <see cref="RoutedEvent.Name"/> starting
    ///     on the <see cref="RoutedEvent.OwnerType"/>
    ///     and looking at its super class types <para/> 
    ///     <para/>
    /// 
    ///     If no matches are found, this method returns null 
    /// </remarks>
    /// <param name="name"> 
    ///     <see cref="RoutedEvent.Name"/> to be matched
    /// </param>
    /// <param name="ownerType">
    ///     <see cref="RoutedEvent.OwnerType"/> to start 
    ///     search with and follow through to super class types
    /// </param> 
    /// <returns> 
    ///     Matching <see cref="RoutedEvent"/>
    /// </returns> 
//    internal static RoutedEvent 
    EventManager.GetRoutedEventFromName = function(/*string*/ name, /*Type*/ ownerType)
    {
        if (name == null) 
        {
            throw new Error('ArgumentNullException("name")'); 
        } 

        if (ownerType == null) 
        {
            throw new Error('ArgumentNullException("ownerType")');
        }

        return GlobalEventManager.GetRoutedEventFromName(name, ownerType, true);
    };
	
	EventManager.Type = new Type("EventManager", EventManager, [Object.Type]);
	return EventManager;
});



