/**
 * Second Check 2013-12-14
 * GlobalEventManager
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObjectType", "windows/DependencyObject", 
        "utility/DTypeMap", "windows/RoutedEvent", "collections/ArrayList", "collections/Hashtable", "utility/FrugalObjectList",
        "windows/ClassHandlersStore"], 
		function(declare, Type, DependencyObjectType, DependencyObject, 
				DTypeMap, RoutedEvent, ArrayList, Hashtable, FrugalObjectList,
				ClassHandlersStore){ 
	
    // must be used within a lock of GlobalEventManager.Synchronized 
//    private static ArrayList
	var _globalIndexToEventMap = new ArrayList(100); //

    // This is an efficient  Hashtable of ItemLists keyed on DType 
    // Each ItemList holds the registered RoutedEvents for that OwnerType
//    private static DTypeMap 
	var _dTypedRoutedEventList = new DTypeMap(10); // Initialization sizes based on typical MSN scenario 

    // This is a Hashtable of ItemLists keyed on OwnerType
    // Each ItemList holds the registered RoutedEvents for that OwnerType
//    private static Hashtable 
	var _ownerTypedRoutedEventList = new Hashtable(10); // Initialization sizes based on typical MSN scenario 

    // This member keeps a count of the total number of Routed Events registered so far 
    // The member also serves as the internally used ComputedEventIndex that indexes 
    // EventListenersListss that store class handler information for a class type
//    private static int 
	var _countRoutedEvents = 0; 

    // This is an efficient Hashtable of ItemLists keyed on DType
    // Each ItemList holds the registered RoutedEvent class handlers for that ClassType
//    private static DTypeMap 
	var _dTypedClassListeners = new DTypeMap(100); // Initialization sizes based on typical Expression Blend startup scenario 

    // This is the cached value for the DType of DependencyObject 
//    private static DependencyObjectType 
	var _dependencyObjectType = DependencyObjectType.FromSystemTypeInternal(DependencyObject.Type);
	
    
	var GlobalEventManager = declare("GlobalEventManager", Object,{
		constructor:function(){
		}
	});
	
    // Registers a RoutedEvent with the given details
    // NOTE: The Name must be unique within the given OwnerType 
//    internal static RoutedEvent 
	GlobalEventManager.RegisterRoutedEvent = function( 
        /*string*/ name,
        /*RoutingStrategy*/ routingStrategy, 
        /*Type*/ handlerType,
        /*Type*/ ownerType)
    {
//        Debug.Assert(GetRoutedEventFromName(name, ownerType, false) == null, 
//                            "RoutedEvent name must be unique within a given OwnerType");

        // Create a new RoutedEvent 
        // Requires GlobalLock to access _countRoutedEvents
        var routedEvent = new RoutedEvent(
            name,
            routingStrategy, 
            handlerType,
            ownerType); 

            // Increment the count for registered RoutedEvents
        // Requires GlobalLock to access _countRoutedEvents 
        _countRoutedEvents++;

        GlobalEventManager.AddOwner(routedEvent, ownerType);

        return routedEvent;
    }; 

    
    // Register a Class Handler 
    // NOTE: Handler Type must be the
    // same as the one specified when
    // registering the corresponding RoutedEvent
//    internal static void 
    GlobalEventManager.RegisterClassHandler = function( 
        /*Type*/ classType,
        /*RoutedEvent*/ routedEvent, 
        /*Delegate*/ handler, 
        /*bool*/ handledEventsToo)
    { 
//        Debug.Assert(
//            typeof(UIElement).IsAssignableFrom(classType) ||
//            typeof(ContentElement).IsAssignableFrom(classType) ||
//            typeof(UIElement3D).IsAssignableFrom(classType), 
//            "Class Handlers can be registered only for UIElement/ContentElement/UIElement3D and their sub types");
//        Debug.Assert(routedEvent.IsLegalHandler(handler), 
//                            "Handler Type mismatch"); 

        // We map the classType to a DType use DTypeMap for storage
        /*DependencyObjectType*/var dType = DependencyObjectType.FromSystemTypeInternal(classType); 

        var classListenersListsOut = {
        	"classListenersLists" : null
        };
        
        var indexOut = {
        	"index" : 0
        };
        // Get the updated EventHandlersStore for the given DType 
        GlobalEventManager.GetDTypedClassListeners(dType, routedEvent, /*out classListenersLists*/classListenersListsOut, /*out index*/indexOut); 
        /*ClassHandlersStore*/var classListenersLists = classListenersListsOut.classListenersLists; 
        var index = indexOut.index;
        // Reuired to update storage 
        // Add new routed event handler and get the updated set of handlers
        /*RoutedEventHandlerInfoList*/var updatedClassListeners = 
            classListenersLists.AddToExistingHandlers(index, handler, handledEventsToo);

        // Update Sub Classes 
        /*ItemStructList<DependencyObjectType>*/var keys = _dTypedClassListeners.ActiveDTypes;

        for (var i=0; i<keys.Count; i++)
        {
            if (keys.List[i].IsSubclassOf(dType) == true)
            { 
                classListenersLists = /*(ClassHandlersStore)*/_dTypedClassListeners.Get(keys.List[i]);
                classListenersLists.UpdateSubClassHandlers(routedEvent, updatedClassListeners); 
            } 
        }
    };
    
    // Returns a copy of the list of registered RoutedEvents
    // Returns a copy of the list so the original cannot be modified 
//    internal static RoutedEvent[] 
    GlobalEventManager.GetRoutedEvents = function()
    { 
        /*RoutedEvent[]*/var routedEvents; 

        // Requires GlobalLock to access _countRoutedEvents
        routedEvents = []; //new RoutedEvent[_countRoutedEvents];

        // Enumerate through all of the RoutedEvents in the DTypeMap
        // Requires GlobalLock to access _dTypedRoutedEventList 
        /*ItemStructList<DependencyObjectType>*/var keys = _dTypedRoutedEventList.ActiveDTypes; 

        var destIndex = 0; 
        for (var i=0; i<keys.Count; i++)
        {
            /*FrugalObjectList<RoutedEvent>*/var dTypedRoutedEventList = _dTypedRoutedEventList.Get(keys.List[i]);

            for(var j = 0; j < dTypedRoutedEventList.Count; j++)
            { 
                /*RoutedEvent*/var routedEvent = dTypedRoutedEventList.Get(j); 

//                if(Array.IndexOf(routedEvents, routedEvent) < 0) 
                if(routedEvents.indexOf(routedEvent) < 0) 
                {
                    routedEvents[destIndex++] = routedEvent;
                }
            } 
        }

        // Enumerate through all of the RoutedEvents in the Hashtable 
        // Requires GlobalLock to access _ownerTypedRoutedEventList
        /*IDictionaryEnumerator*/var htEnumerator = _ownerTypedRoutedEventList.GetEnumerator(); 

        while(htEnumerator.MoveNext() == true)
        {
            /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList = htEnumerator.Value; 

            for(var j = 0; j < ownerRoutedEventList.Count; j++) 
            { 
                /*RoutedEvent*/var routedEvent = ownerRoutedEventList.Get(j);

//                if(Array.IndexOf(routedEvents, routedEvent) < 0)
                if(routedEvents.indexOf(routedEvent) < 0)
                {
                    routedEvents[destIndex++] = routedEvent;
                } 
            }
        } 

        return routedEvents; 
    };

//    internal static void 
    GlobalEventManager.AddOwner = function(/*RoutedEvent*/ routedEvent, /*Type*/ ownerType)
    { 
        // If the ownerType is a subclass of DependencyObject
        // we map it to a DType use DTypeMap for storage else 
        // we use the more generic Hashtable. 
        if ((ownerType == DependencyObject.Type) || ownerType.IsSubclassOf(DependencyObject.Type))
        { 
            /*DependencyObjectType*/var dType = DependencyObjectType.FromSystemTypeInternal(ownerType);

            // Get the ItemList of RoutedEvents for the given OwnerType
            // Requires GlobalLock to access _dTypedRoutedEventList 
            var ownerRoutedEventListObj = _dTypedRoutedEventList.Get(dType);
            /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList; 
            if (ownerRoutedEventListObj == null) 
            {
                // Create an ItemList of RoutedEvents for the 
                // given OwnerType if one does not already exist
                ownerRoutedEventList = new FrugalObjectList/*<RoutedEvent>*/(1);
                _dTypedRoutedEventList.Set(dType, ownerRoutedEventList);
            } 
            else
            { 
                ownerRoutedEventList = ownerRoutedEventListObj; 
            }

            // Add the newly created
            // RoutedEvent to the ItemList
            // Requires GlobalLock to access ownerRoutedEventList
            if(!ownerRoutedEventList.Contains(routedEvent)) 
            {
                ownerRoutedEventList.Add(routedEvent); 
            } 
        }
        else 
        {
            // Get the ItemList of RoutedEvents for the given OwnerType
            // Requires GlobalLock to access _ownerTypedRoutedEventList
            var ownerRoutedEventListObj = _ownerTypedRoutedEventList.Get(ownerType); 
            /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList;
            if (ownerRoutedEventListObj == null) 
            { 
                // Create an ItemList of RoutedEvents for the
                // given OwnerType if one does not already exist 
                ownerRoutedEventList = new FrugalObjectList/*<RoutedEvent>*/(1);
                _ownerTypedRoutedEventList.Set(ownerType, ownerRoutedEventList);
            }
            else 
            {
                ownerRoutedEventList = /*(FrugalObjectList<RoutedEvent>)*/ownerRoutedEventListObj; 
            } 

            // Add the newly created 
            // RoutedEvent to the ItemList
            // Requires GlobalLock to access ownerRoutedEventList
            if(!ownerRoutedEventList.Contains(routedEvent))
            { 
                ownerRoutedEventList.Add(routedEvent);
            } 
        } 
    };

    // Returns a RoutedEvents that match
    // the ownerType input param
    // If not found returns null
//    internal static RoutedEvent[] 
    GlobalEventManager.GetRoutedEventsForOwner = function(/*Type*/ ownerType) 
    {
        if ((ownerType == DependencyObject.Type) || ownerType.IsSubclassOf(DependencyObject.Type)) 
        { 
            // Search DTypeMap
            /*DependencyObjectType*/var dType = DependencyObjectType.FromSystemTypeInternal(ownerType); 

            // Get the ItemList of RoutedEvents for the given DType
            /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList = _dTypedRoutedEventList.Get(dType);
            if (ownerRoutedEventList != null) 
            {
                return ownerRoutedEventList.ToArray(); 
            } 
        }
        else // Search Hashtable 
        {
            // Get the ItemList of RoutedEvents for the given OwnerType
            /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList = _ownerTypedRoutedEventList.Get(ownerType);
            if (ownerRoutedEventList != null) 
            {
                return ownerRoutedEventList.ToArray(); 
            } 
        }

        // No match found
        return null;
    };
    
    // Returns a RoutedEvents that match
    // the name and ownerType input params 
    // If not found returns null 
//    internal static RoutedEvent 
    GlobalEventManager.GetRoutedEventFromName = function(
        /*string*/ name, 
        /*Type*/ ownerType,
        /*bool*/ includeSupers)
    {
        if ((ownerType == DependencyObject.Type) || ownerType.IsSubclassOf(DependencyObject.Type)) 
        {
            // Search DTypeMap 
            /*DependencyObjectType*/var dType = DependencyObjectType.FromSystemTypeInternal(ownerType); 

            while (dType != null) 
            {
                // Get the ItemList of RoutedEvents for the given DType
                /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList = _dTypedRoutedEventList[dType];
                if (ownerRoutedEventList != null) 
                {
                    // Check for RoutedEvent with matching name in the ItemList 
                    for (var i=0; i<ownerRoutedEventList.Count; i++) 
                    {
                        /*RoutedEvent*/var routedEvent = ownerRoutedEventList[i]; 
                        if (routedEvent.Name.Equals(name))
                        {
                            // Return if found match
                            return routedEvent; 
                        }
                    } 
                } 

                // If not found match yet check for BaseType if specified to do so 
                dType = includeSupers ? dType.BaseType : null;
            }
        }
        else 
        {
            // Search Hashtable 
            while (ownerType != null) 
            {
                // Get the ItemList of RoutedEvents for the given OwnerType 
                /*FrugalObjectList<RoutedEvent>*/var ownerRoutedEventList = _ownerTypedRoutedEventList[ownerType];
                if (ownerRoutedEventList != null)
                {
                    // Check for RoutedEvent with matching name in the ItemList 
                    for (var i=0; i<ownerRoutedEventList.Count; i++)
                    { 
                        /*RoutedEvent*/var routedEvent = ownerRoutedEventList[i]; 
                        if (routedEvent.Name.Equals(name))
                        { 
                            // Return if found match
                            return routedEvent;
                        }
                    } 
                }

                // If not found match yet check for BaseType if specified to do so 
                ownerType = includeSupers?ownerType.BaseType : null;
            } 
        }

        // No match found
        return null; 
    };

    // Returns the list of class listeners for the given 
    // DType and RoutedEvent
    // NOTE: Returns null if no matches found 
    // Helper method for GetClassListeners
    // Invoked only when trying to build the event route
////    internal static RoutedEventHandlerInfoList 
//    GlobalEventManager.GetDTypedClassListeners = function(
//        /*DependencyObjectType*/ dType, 
//        /*RoutedEvent*/ routedEvent)
//    { 
////        /*ClassHandlersStore*/var classListenersLists; 
////        int index;
//
//        // Class Forwarded
//        return GetDTypedClassListeners(dType, routedEvent, 
//        		/*out classListenersLists*/{"classListenersLists": null}, /*out index*/{"index" : null});
//    };

    // Returns the list of class listeners for the given
    // DType and RoutedEvent 
    // NOTE: Returns null if no matches found 
    // Helper method for GetClassListeners
    // Invoked when trying to build the event route 
    // as well as when registering a new class handler
//    internal static RoutedEventHandlerInfoList 
    GlobalEventManager.GetDTypedClassListeners = function(
        /*DependencyObjectType*/ dType,
        /*RoutedEvent*/ routedEvent, 
        /*out ClassHandlersStore classListenersLists*/classListenersListsOut,
        /*out int index*/indexOut) 
    { 
    	if(classListenersListsOut === undefined){
    		classListenersListsOut = {"classListenersLists": null};
    	}
    	
    	if(indexOut === undefined){
    		indexOut = {"index" : 0};
    	}
    	
        // Get the ClassHandlersStore for the given DType
    	classListenersListsOut.classListenersLists = _dTypedClassListeners.Get(dType); 
        /*RoutedEventHandlerInfoList*/var handlers;
        if (classListenersListsOut.classListenersLists != null)
        {
            // Get the handlers for the given DType and RoutedEvent 
            index = classListenersListsOut.classListenersLists.GetHandlersIndex(routedEvent);
            if (index != -1) 
            { 
                handlers = classListenersListsOut.classListenersLists.GetExistingHandlers(index);
                return handlers; 
            }
        }

        // Search the DTypeMap for the list of matching RoutedEventHandlerInfo 
        handlers = GetUpdatedDTypedClassListeners(dType, routedEvent, 
        		/*out classListenersLists*/classListenersListsOut, /*out index*/indexOut); 

        return handlers;
    };
    
    // Helper method for GetDTypedClassListeners 
    // Returns updated list of class listeners for the given
    // DType and RoutedEvent 
    // NOTE: Returns null if no matches found 
    // Invoked when trying to build the event route
    // as well as when registering a new class handler 
//    private static RoutedEventHandlerInfoList 
    function GetUpdatedDTypedClassListeners(
        /*DependencyObjectType*/ dType,
        /*RoutedEvent*/ routedEvent,
        /*out ClassHandlersStore classListenersLists*/classListenersListsOut, 
        /*out int index*/indexOut)
    { 
        // Get the ClassHandlersStore for the given DType 
    	classListenersListsOut.classListenersLists = _dTypedClassListeners.Get(dType);
        /*RoutedEventHandlerInfoList*/var handlers; 
        if (classListenersListsOut.classListenersLists != null)
        {
            // Get the handlers for the given DType and RoutedEvent
        	indexOut.index = classListenersListsOut.classListenersLists.GetHandlersIndex(routedEvent); 
            if (indexOut.index != -1)
            { 
                handlers = classListenersListsOut.classListenersLists.GetExistingHandlers(indexOut.index); 
                return handlers;
            } 
        }
        // Since matching handlers were not found at this level
        // browse base classes to check for registered class handlers 
        /*DependencyObjectType*/var tempDType = dType;
        /*ClassHandlersStore*/var tempClassListenersLists = null; 
        /*RoutedEventHandlerInfoList*/var tempHandlers = null; 
        var tempIndex = -1;
        while (tempIndex == -1 && tempDType.Id != _dependencyObjectType.Id) 
        {
            tempDType = tempDType.BaseType;
            tempClassListenersLists = _dTypedClassListeners.Get(tempDType);
            if (tempClassListenersLists != null) 
            {
                // Get the handlers for the DType and RoutedEvent 
                tempIndex = tempClassListenersLists.GetHandlersIndex(routedEvent); 
                if (tempIndex != -1)
                { 
                    tempHandlers = tempClassListenersLists.GetExistingHandlers(tempIndex);
                }
            }
        } 

        if (classListenersListsOut.classListenersLists == null) 
        { 
            if (dType.SystemType == UIElement.Type || dType.SystemType == ContentElement.Type)
            { 
            	classListenersListsOut.classListenersLists = new ClassHandlersStore(80); // Based on the number of class handlers for these classes
            }
            else
            { 
            	classListenersListsOut.classListenersLists = new ClassHandlersStore(1);
            } 

            _dTypedClassListeners.Set(dType, classListenersListsOut.classListenersLists);
        } 

        indexOut.index = classListenersListsOut.classListenersLists.CreateHandlersLink(routedEvent, tempHandlers);

        return tempHandlers; 
    }

//    internal static int 
    GlobalEventManager.GetNextAvailableGlobalIndex = function(/*object*/ value)
    {
        // Prevent GlobalIndex from overflow. RoutedEvents are meant to be static members and are to be registered 
        // only via static constructors. However there is no cheap way of ensuring this, without having to do a stack walk. Hence
        // concievably people could register RoutedEvents via instance methods and therefore cause the GlobalIndex to 
        // overflow. This check will explicitly catch this error, instead of silently malfuntioning.
        if (_globalIndexToEventMap.Count >= Number.MAX_INT)
        {
            throw new InvalidOperationException(SR.Get(SRID.TooManyRoutedEvents)); 
        }

        var index = _globalIndexToEventMap.Add(value); 
        return index; 
    };

    // Must be called from within a lock of GlobalEventManager.Synchronized
//    internal static object 
    GlobalEventManager.EventFromGlobalIndex = function(/*int*/ globalIndex) 
    {
        return _globalIndexToEventMap.Get(globalIndex); 
    };
	
	GlobalEventManager.Type = new Type("GlobalEventManager", GlobalEventManager, [Object.Type]);
	return GlobalEventManager;
});

        

        
//
//        internal static void AddOwner(RoutedEvent routedEvent, Type ownerType)
//        { 
//            // If the ownerType is a subclass of DependencyObject
//            // we map it to a DType use DTypeMap for storage else 
//            // we use the more generic Hashtable. 
//            if ((ownerType == typeof(DependencyObject)) || ownerType.IsSubclassOf(typeof(DependencyObject)))
//            { 
//                DependencyObjectType dType = DependencyObjectType.FromSystemTypeInternal(ownerType);
//
//                // Get the ItemList of RoutedEvents for the given OwnerType
//                // Requires GlobalLock to access _dTypedRoutedEventList 
//                object ownerRoutedEventListObj = _dTypedRoutedEventList[dType];
//                FrugalObjectList<RoutedEvent> ownerRoutedEventList; 
//                if (ownerRoutedEventListObj == null) 
//                {
//                    // Create an ItemList of RoutedEvents for the 
//                    // given OwnerType if one does not already exist
//                    ownerRoutedEventList = new FrugalObjectList<RoutedEvent>(1);
//                    _dTypedRoutedEventList[dType] = ownerRoutedEventList;
//                } 
//                else
//                { 
//                    ownerRoutedEventList = (FrugalObjectList<RoutedEvent>)ownerRoutedEventListObj; 
//                }
// 
//                // Add the newly created
//                // RoutedEvent to the ItemList
//                // Requires GlobalLock to access ownerRoutedEventList
//                if(!ownerRoutedEventList.Contains(routedEvent)) 
//                {
//                    ownerRoutedEventList.Add(routedEvent); 
//                } 
//            }
//            else 
//            {
//                // Get the ItemList of RoutedEvents for the given OwnerType
//                // Requires GlobalLock to access _ownerTypedRoutedEventList
//                object ownerRoutedEventListObj = _ownerTypedRoutedEventList[ownerType]; 
//                FrugalObjectList<RoutedEvent> ownerRoutedEventList;
//                if (ownerRoutedEventListObj == null) 
//                { 
//                    // Create an ItemList of RoutedEvents for the
//                    // given OwnerType if one does not already exist 
//                    ownerRoutedEventList = new FrugalObjectList<RoutedEvent>(1);
//                    _ownerTypedRoutedEventList[ownerType] = ownerRoutedEventList;
//                }
//                else 
//                {
//                    ownerRoutedEventList = (FrugalObjectList<RoutedEvent>)ownerRoutedEventListObj; 
//                } 
//
//                // Add the newly created 
//                // RoutedEvent to the ItemList
//                // Requires GlobalLock to access ownerRoutedEventList
//                if(!ownerRoutedEventList.Contains(routedEvent))
//                { 
//                    ownerRoutedEventList.Add(routedEvent);
//                } 
//            } 
//        }
// 
//        // Returns a RoutedEvents that match
//        // the ownerType input param
//        // If not found returns null
//        internal static RoutedEvent[] GetRoutedEventsForOwner(Type ownerType) 
//        {
//            if ((ownerType == typeof(DependencyObject)) || ownerType.IsSubclassOf(typeof(DependencyObject))) 
//            { 
//                // Search DTypeMap
//                DependencyObjectType dType = DependencyObjectType.FromSystemTypeInternal(ownerType); 
//
//                // Get the ItemList of RoutedEvents for the given DType
//                FrugalObjectList<RoutedEvent> ownerRoutedEventList = (FrugalObjectList<RoutedEvent>)_dTypedRoutedEventList[dType];
//                if (ownerRoutedEventList != null) 
//                {
//                    return ownerRoutedEventList.ToArray(); 
//                } 
//            }
//            else // Search Hashtable 
//            {
//                // Get the ItemList of RoutedEvents for the given OwnerType
//                FrugalObjectList<RoutedEvent> ownerRoutedEventList = (FrugalObjectList<RoutedEvent>)_ownerTypedRoutedEventList[ownerType];
//                if (ownerRoutedEventList != null) 
//                {
//                    return ownerRoutedEventList.ToArray(); 
//                } 
//            }
// 
//            // No match found
//            return null;
//        }
// 
//        // Returns a RoutedEvents that match
//        // the name and ownerType input params 
//        // If not found returns null 
//        internal static RoutedEvent GetRoutedEventFromName(
//            string name, 
//            Type ownerType,
//            bool includeSupers)
//        {
//            if ((ownerType == typeof(DependencyObject)) || ownerType.IsSubclassOf(typeof(DependencyObject))) 
//            {
//                // Search DTypeMap 
//                DependencyObjectType dType = DependencyObjectType.FromSystemTypeInternal(ownerType); 
//
//                while (dType != null) 
//                {
//                    // Get the ItemList of RoutedEvents for the given DType
//                    FrugalObjectList<RoutedEvent> ownerRoutedEventList = (FrugalObjectList<RoutedEvent>)_dTypedRoutedEventList[dType];
//                    if (ownerRoutedEventList != null) 
//                    {
//                        // Check for RoutedEvent with matching name in the ItemList 
//                        for (int i=0; i<ownerRoutedEventList.Count; i++) 
//                        {
//                            RoutedEvent routedEvent = ownerRoutedEventList[i]; 
//                            if (routedEvent.Name.Equals(name))
//                            {
//                                // Return if found match
//                                return routedEvent; 
//                            }
//                        } 
//                    } 
//
//                    // If not found match yet check for BaseType if specified to do so 
//                    dType = includeSupers ? dType.BaseType : null;
//                }
//            }
//            else 
//            {
//                // Search Hashtable 
//                while (ownerType != null) 
//                {
//                    // Get the ItemList of RoutedEvents for the given OwnerType 
//                    FrugalObjectList<RoutedEvent> ownerRoutedEventList = (FrugalObjectList<RoutedEvent>)_ownerTypedRoutedEventList[ownerType];
//                    if (ownerRoutedEventList != null)
//                    {
//                        // Check for RoutedEvent with matching name in the ItemList 
//                        for (int i=0; i<ownerRoutedEventList.Count; i++)
//                        { 
//                            RoutedEvent routedEvent = ownerRoutedEventList[i]; 
//                            if (routedEvent.Name.Equals(name))
//                            { 
//                                // Return if found match
//                                return routedEvent;
//                            }
//                        } 
//                    }
// 
//                    // If not found match yet check for BaseType if specified to do so 
//                    ownerType = includeSupers?ownerType.BaseType : null;
//                } 
//            }
//
//            // No match found
//            return null; 
//        }
// 
//        // Returns the list of class listeners for the given 
//        // DType and RoutedEvent
//        // NOTE: Returns null if no matches found 
//        // Helper method for GetClassListeners
//        // Invoked only when trying to build the event route
//        internal static RoutedEventHandlerInfoList GetDTypedClassListeners(
//            DependencyObjectType dType, 
//            RoutedEvent routedEvent)
//        { 
//            ClassHandlersStore classListenersLists; 
//            int index;
// 
//            // Class Forwarded
//            return GetDTypedClassListeners(dType, routedEvent, out classListenersLists, out index);
//        }
// 
//        // Returns the list of class listeners for the given
//        // DType and RoutedEvent 
//        // NOTE: Returns null if no matches found 
//        // Helper method for GetClassListeners
//        // Invoked when trying to build the event route 
//        // as well as when registering a new class handler
//        internal static RoutedEventHandlerInfoList GetDTypedClassListeners(
//            DependencyObjectType dType,
//            RoutedEvent routedEvent, 
//            out ClassHandlersStore classListenersLists,
//            out int index) 
//        { 
//            // Get the ClassHandlersStore for the given DType
//            classListenersLists = (ClassHandlersStore)_dTypedClassListeners[dType]; 
//            RoutedEventHandlerInfoList handlers;
//            if (classListenersLists != null)
//            {
//                // Get the handlers for the given DType and RoutedEvent 
//                index = classListenersLists.GetHandlersIndex(routedEvent);
//                if (index != -1) 
//                { 
//                    handlers = classListenersLists.GetExistingHandlers(index);
//                    return handlers; 
//                }
//            }
//
//            lock (Synchronized) 
//            {
//                // Search the DTypeMap for the list of matching RoutedEventHandlerInfo 
//                handlers = GetUpdatedDTypedClassListeners(dType, routedEvent, out classListenersLists, out index); 
//            }
// 
//            return handlers;
//        }
//
//        // Helper method for GetDTypedClassListeners 
//        // Returns updated list of class listeners for the given
//        // DType and RoutedEvent 
//        // NOTE: Returns null if no matches found 
//        // Invoked when trying to build the event route
//        // as well as when registering a new class handler 
//        private static RoutedEventHandlerInfoList GetUpdatedDTypedClassListeners(
//            DependencyObjectType dType,
//            RoutedEvent routedEvent,
//            out ClassHandlersStore classListenersLists, 
//            out int index)
//        { 
//            // Get the ClassHandlersStore for the given DType 
//            classListenersLists = (ClassHandlersStore)_dTypedClassListeners[dType];
//            RoutedEventHandlerInfoList handlers; 
//            if (classListenersLists != null)
//            {
//                // Get the handlers for the given DType and RoutedEvent
//                index = classListenersLists.GetHandlersIndex(routedEvent); 
//                if (index != -1)
//                { 
//                    handlers = classListenersLists.GetExistingHandlers(index); 
//                    return handlers;
//                } 
//            }
//
//            // Since matching handlers were not found at this level
//            // browse base classes to check for registered class handlers 
//            DependencyObjectType tempDType = dType;
//            ClassHandlersStore tempClassListenersLists = null; 
//            RoutedEventHandlerInfoList tempHandlers = null; 
//            int tempIndex = -1;
//            while (tempIndex == -1 && tempDType.Id != _dependencyObjectType.Id) 
//            {
//                tempDType = tempDType.BaseType;
//                tempClassListenersLists = (ClassHandlersStore)_dTypedClassListeners[tempDType];
//                if (tempClassListenersLists != null) 
//                {
//                    // Get the handlers for the DType and RoutedEvent 
//                    tempIndex = tempClassListenersLists.GetHandlersIndex(routedEvent); 
//                    if (tempIndex != -1)
//                    { 
//                        tempHandlers = tempClassListenersLists.GetExistingHandlers(tempIndex);
//                    }
//                }
//            } 
//
//            if (classListenersLists == null) 
//            { 
//                if (dType.SystemType == typeof(UIElement) || dType.SystemType == typeof(ContentElement))
//                { 
//                    classListenersLists = new ClassHandlersStore(80); // Based on the number of class handlers for these classes
//                }
//                else
//                { 
//                    classListenersLists = new ClassHandlersStore(1);
//                } 
// 
//                _dTypedClassListeners[dType] = classListenersLists;
//            } 
//
//            index = classListenersLists.CreateHandlersLink(routedEvent, tempHandlers);
//
//            return tempHandlers; 
//        }
 

