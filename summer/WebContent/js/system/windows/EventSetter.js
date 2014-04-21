/**
 * EventSetter
 */

define(["dojo/_base/declare", "system/Type", "windows/SetterBase"], 
		function(declare, Type, SetterBase){
	var EventSetter = declare("EventSetter", SetterBase,{
		constructor:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
        { 
			if(routedEvent === undefined){
				routedEvent = null;
			}
			
			if(handler === undefined){
				handler = null;
			}
			
            if (routedEvent == null)
            { 
                throw new ArgumentNullException("routedEvent"); 
            }
            if (handler == null) 
            {
                throw new ArgumentNullException("handler");
            }
 
            this._event = routedEvent;
            this._handler = handler; 
            this._handledEventsToo = false;
        },
        
        // 
        //  Do the error checking that we can only do once all of the properties have been
        //  set, then call up to base. 
        //

//        internal override void 
        Seal:function()
        { 

            if (this._event == null) 
            { 
                throw new ArgumentException(SR.Get(SRID.NullPropertyIllegal, "EventSetter.Event"));
            } 
            if (this._handler == null)
            {
                throw new ArgumentException(SR.Get(SRID.NullPropertyIllegal, "EventSetter.Handler"));
            } 
            if (this._handler.GetType() != this._event.HandlerType)
            { 
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
            }
 
            SetterBase.prototype.Seal.call(this);

        }
	});
	
	Object.defineProperties(EventSetter.prototype,{
        /// <summary> 
        ///    Event that is being set by this setter
        /// </summary>
//        public RoutedEvent 
		Event:
        { 
            get:function() { return this._event; },
            set:function(value) 
            { 
                if (value == null)
                { 
                    throw new ArgumentNullException("value");
                }

                CheckSealed(); 
                this._event = value;
            } 
        }, 

        /// <summary> 
        ///    Handler delegate that is being set by this setter
        /// </summary>
//        public Delegate 
		Handler: 
        {
            get:function() { return this._handler; },
            set:function(value) 
            {
                if (value == null) 
                {
                    throw new ArgumentNullException("value");
                }
 
                this.CheckSealed();
                this._handler = value; 
            } 
        },
 
        /// <summary>
        ///     HandledEventsToo flag that is being set by this setter
        /// </summary>
//        public bool 
		HandledEventsToo:
        { 
            get:function() { return this._handledEventsToo; }, 
            set:function(value)
            { 
            	this.CheckSealed();
            	this._handledEventsToo = value;
            }
        }   
	});
	
	EventSetter.Type = new Type("EventSetter", EventSetter, [SetterBase.Type]);
	return EventSetter;
});
