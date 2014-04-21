/**
 * AccessorTable
 */

define(["dojo/_base/declare", "system/Type", "internal.data/AccessorInfo"], 
		function(declare, Type, AccessorInfo){
//	private struct 
	var AccessorTableKey = declare(Object, 
    { 
        constructor:function(/*SourceValueType*/ sourceValueType, /*Type*/ type, /*string*/ name)
        { 
//            Invariant.Assert(type != null && type != null); 

            this._sourceValueType = sourceValueType; 
            this._type = type;
            this._name = name;
        },

//        public override bool 
        Equals:function(/*object*/ o)
        { 
            if (o instanceof AccessorTableKey) 
                return  this._sourceValueType == o._sourceValueType 
                &&  this._type == o._type 
                &&  this._name == o._name;
            else 
                return false;
        },

//        public override int 
        GetHashCode:function() 
        {
            return this._type.GetHashCode() + this._name.GetHashCode(); 
        },

//        SourceValueType _sourceValueType;
//        Type            _type; 
//        string          _name;
    });
	
//	private const int   
	var AgeLimit = 10;      // entries older than this get removed.
	var AccessorTable = declare("AccessorTable", null,{
		constructor:function( ){
//	        private Hashtable   
			this._table = new Hashtable();
//	        private int         
			this._generation = 0; 
//	        private bool        
			this._cleanupRequested = false;
//	        bool                
			this._traceSize = false; 
		},
		
//		// map (SourceValueType, type, name) to (accessor, propertyType, args)
//        internal AccessorInfo this[SourceValueType sourceValueType, Type type, string name]
//        { 
//            
//        } 
		
		Get:function(/*SourceValueType*/ sourceValueType, /*Type*/ type, /*string*/ name)
        { 
            if (type == null || name == null) 
                return null;

            /*AccessorInfo*/var info = this._table.Get(new AccessorTableKey(sourceValueType, type, name));

            if (info != null)
            { 
                info.Generation = this._generation;
            }
            return info; 
        },
        Set:function(/*SourceValueType*/ sourceValueType, /*Type*/ type, /*string*/ name, value)
        {
            if (type != null && name != null) 
            {
                value.Generation = this._generation; 
                this._table.Set(new AccessorTableKey(sourceValueType, type, name), value); 

                if (!this._cleanupRequested) 
                    this.RequestCleanup();
            }
        },

        // request a cleanup pass 
//        private void 
        RequestCleanup:function() 
        {
            this._cleanupRequested = true; 
//            Dispatcher.CurrentDispatcher.BeginInvoke(DispatcherPriority.ContextIdle, new DispatcherOperationCallback(CleanupOperation), null);
            this.CleanupOperation();
        },

        // run a cleanup pass 
//        private object 
        CleanupOperation:function(/*object*/ arg)
        { 
            // find entries that are sufficiently old 
            /*object[]*/var keysToRemove = []; //new object[_table.Count];
            var n = 0; 
            /*IDictionaryEnumerator*/var ide = this._table.GetEnumerator();
            while (ide.MoveNext())
            {
                /*AccessorInfo*/var info = ide.Value; 
                var age = this._generation - info.Generation;
                if (age >= AgeLimit) 
                { 
                    keysToRemove[n++] = ide.Key;
                } 
            }

            // remove those entries
            for (var i=0; i<n; ++i)
            { 
                this._table.Remove(keysToRemove[i]);
            } 
 
            ++ this._generation;
 
            this._cleanupRequested = false;
            return null;
        },
 
        // print data about how the cache behaved
//        internal void 
        PrintStats:function() 
        { 
        }

	});
	
	Object.defineProperties(AccessorTable.prototype,{
//        internal bool 
		TraceSize: 
        {
            get:function() { return _traceSize; }, 
            set:function(value) { _traceSize = value; } 
        }
	});
	
	AccessorTable.Type = new Type("AccessorTable", AccessorTable, [Object.Type]);
	return AccessorTable;
});
