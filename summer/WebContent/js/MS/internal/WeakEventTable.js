/**
 * WeakEventTable
 */

define(["dojo/_base/declare", "system/Type", "threading/DispatcherObject", "collections/Hashtable"], 
		function(declare, Type, DispatcherObject, Hashtable){
	
    // the key for the data table:  <manager, ((source)), hashcode> 
//    private struct 
	var EventKey =declare(null, {
        constructor:function(/*WeakEventManager*/ manager, /*object*/ source)
        { 
            this._manager = manager;
            this._source = source; 
            this._hashcode = manager.GetHashCode() + source.GetHashCode(); 
        },

//        public override int 
        GetHashCode:function() 
        {
            return this._hashcode;
        }, 

//        public override bool 
        Equals:function(/*object*/ o) 
        { 
            if (o instanceof EventKey)
            { 
                if (this._manager != o._manager || this._hashcode != o._hashcode) 
                    return false;

                return (this._source == o._source); 
            } 
            else
            { 
                return false;
            }
        }
    });
	
	Object.defineProperties(EventKey.prototype, {
//	      internal object 
		Source:
        { 
            get:function() { return (this._source).Target; }
        },

//	        internal WeakEventManager 
		Manager: 
        {
            get:function() { return this._manager; } 
        },
	});

    // the key for the event name table:  <ownerType, eventName>
//    private struct 
    var EventNameKey =declare(null, { 
        constructor:function(/*Type*/ eventSourceType, /*string*/ eventName)
        { 
            this._eventSourceType = eventSourceType; 
            this._eventName = eventName;
        }, 

//        public override int 
        GetHashCode:function()
        {
            return this._eventSourceType.GetHashCode() + this._eventName.GetHashCode(); 
        },

//        public override bool 
        Equals:function(/*object*/ o) 
        {
            if (o instanceof EventNameKey) 
            {
                return (this._eventSourceType == o._eventSourceType && this._eventName == o._eventName);
            } 
            else
                return false; 
        } 
    });
    
	var WeakEventTable = declare("WeakEventTable", DispatcherObject,{
		constructor:function(){
//			private Hashtable 
			this._managerTable = new Hashtable();  // maps manager type -> instance 
//			private Hashtable 
			this._dataTable = new Hashtable();     // maps EventKey -> data
//			private Hashtable 
			this._eventNameTable = new Hashtable(); // maps <Type,name> -> manager 
		},
		
//	    /// <summary> 
//	    /// Get or set the manager instance for the given event.
//	    /// </summary>
//	    /*internal*/ public WeakEventManager this[Type eventSourceType, String eventName]
//	    { 
//	        get
//	        { 
//	            EventNameKey key = new EventNameKey(eventSourceType, eventName); 
//	            return (WeakEventManager)_eventNameTable[key];
//	        } 
//
//	        set
//	        {
//	            EventNameKey key = new EventNameKey(eventSourceType, eventName); 
//	            _eventNameTable[key] = value;
//	        } 
//	    } 
		
        GetEventManager:function(eventSourceType, eventName)
        { 
            var key = new EventNameKey(eventSourceType, eventName); 
            return this._eventNameTable.Get(key);
        }, 

        SetEventManager:function(eventSourceType, eventName)
        {
            var key = new EventNameKey(eventSourceType, eventName); 
            this._eventNameTable.Set(key, value);
        },
        
//        /// <summary> 
//        /// Get or set the data stored by the given manager for the given source.
//        /// </summary>
//        /*internal*/ public Object this[WeakEventManager manager, Object source]
//        { 
//            get
//            { 
//                EventKey key = new EventKey(manager, source); 
//                Object result = _dataTable[key];
//                return result; 
//            }
//
//            set
//            { 
//                EventKey key = new EventKey(manager, source, true);
//                _dataTable[key] = value; 
//            } 
//        }
        
        GetObject:function(manager, source)
        { 
            var key = new EventKey(manager, source); 
            return this._dataTable.Get(key);
        },

        SetObject:function(manager, source, value)
        { 
            var key = new EventKey(manager, source);
            this._dataTable.Set(key, value); 
        },
        
//        /// <summary> 
//        /// Get or set the manager instance for the given type.
//        /// </summary>
//        /*internal*/ public WeakEventManager this[Type managerType]
//        { 
//            get { return (WeakEventManager)_managerTable[managerType]; }
//            set { _managerTable[managerType] = value; } 
//        } 
        
        Get:function(/*WeakEventManager*/ managerType) { return this._managerTable.Get(managerType); },
        Set:function(/*WeakEventManager*/managerType, value) { this._managerTable.Set(managerType, value); }, 
		
	     /// <summary>
        /// Remove the data for the given manager and source. 
        /// </summary> 
//        internal void 
		Remove:function(/*WeakEventManager*/ manager, /*object*/ source)
        { 
            var key = new EventKey(manager, source);
            this._dataTable.Remove(key);
        }
 
	});
	
	Object.defineProperties(WeakEventTable,{
        /// <summary> 
        /// Return the WeakEventTable for the current thread
        /// </summary> 
//        internal static WeakEventTable 
		CurrentWeakEventTable:
        {
            get:function()
            { 
                // _currentTable is [ThreadStatic], so there's one per thread
                if (WeakEventTable._currentTable == null) 
                { 
                	WeakEventTable._currentTable = new WeakEventTable();
                } 

                return WeakEventTable._currentTable;
            }
        }
 
	});
	
	WeakEventTable.Type = new Type("WeakEventTable", WeakEventTable, [DispatcherObject.Type]);
	return WeakEventTable;
});

   
