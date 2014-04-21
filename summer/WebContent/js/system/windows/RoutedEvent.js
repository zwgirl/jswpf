/**
 * RoutedEvent
 */

define(["dojo/_base/declare", "system/Type", "windows/RoutedEventHandler" ], 
		function(declare, Type, RoutedEventHandler){
	var GlobalEventManager =null;
	function EnsureGlobalEventManager(){
		if(GlobalEventManager==null){
			GlobalEventManager = using("windows/GlobalEventManager");
		}
		
		return GlobalEventManager;
	}
	
	var RoutedEvent = declare("RoutedEvent", null,{
		constructor:function(/*string*/ name,
	            /*RoutingStrategy*/ routingStrategy,
	            /*Type*/ handlerType,
	            /*Type*/ ownerType) 
	        {
	            this._name = name; 
	            this._routingStrategy = routingStrategy; 
	            this._handlerType = handlerType;
	            this._ownerType = ownerType; 

	            this._globalIndex = EnsureGlobalEventManager().GetNextAvailableGlobalIndex(this);
		},
		
        /// <summary>
        ///     Associate another owner type with this event.
        /// </summary>
        /// <remarks> 
        ///     The owner type is used when resolving an event by name.
        /// </remarks> 
        /// <param name="ownerType">Additional owner type</param> 
        /// <returns>This event.</returns>
//        public RoutedEvent 
        AddOwner:function(/*Type*/ ownerType) 
        {
        	EnsureGlobalEventManager().AddOwner(this, ownerType);
            return this;
        },
        
        // Check to see if the given delegate is a legal handler for this type. 
        //  It either needs to be a type that the registering class knows how to 
        //  handle, or a RoutedEventHandler which we can handle without the help
        //  of the registering class. 
//        internal bool 
        IsLegalHandler:function( /*Delegate*/ handler )
        {
            var handlerType = handler.GetType();
 
            return ( handlerType == this.HandlerType ||
                     handlerType == RoutedEventHandler.Type); 
        } 

	});
	
	Object.defineProperties(RoutedEvent.prototype,{
        /// <summary> 
        ///     Returns the Name of the RoutedEvent 
        /// </summary>
        /// <remarks> 
        ///     RoutedEvent Name is unique within the
        ///     OwnerType (super class types not considered
        ///     when talking about uniqueness)
        /// </remarks> 
        /// <ExternalAPI/>
//        public string 
        Name: 
        { 
            get:function() {return this._name;}
        },
        
        /// <summary>
        ///     Returns the <see cref="RoutingStrategy"/>
        ///     of the RoutedEvent 
        /// </summary>
        /// <ExternalAPI/> 
//        public RoutingStrategy 
        RoutingStrategy:
        {
            get:function() {return this._routingStrategy;} 
        },

        /// <summary>
        ///     Returns Type of Handler for the RoutedEvent 
        /// </summary>
        /// <remarks> 
        ///     HandlerType is a type of delegate 
        /// </remarks>
        /// <ExternalAPI/> 
//        public Type 
        HandlerType:
        {
            get:function() {return this._handlerType;}
        },
        

        /// <summary> 
        ///     Returns Type of Owner for the RoutedEvent
        /// </summary>
        /// <remarks>
        ///     OwnerType is any object type 
        /// </remarks>
        /// <ExternalAPI/> 
//        public Type 
        OwnerType: 
        {
            get:function() {return this._ownerType;} 
        },
        
        /// <summary>
        ///    Index in GlobalEventManager 
        /// </summary> 
//        internal int 
        GlobalIndex:
        { 
            get:function() { return this._globalIndex; }
        }
	});
	
	RoutedEvent.Type = new Type("RoutedEvent", RoutedEvent, [Object.Type]);
	return RoutedEvent;
});
