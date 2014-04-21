define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang){
	var DependencyObjectType = declare(null, {
		/// <summary> 
        ///     Zero-based unique identifier for constant-time array lookup operations
        /// </summary> 
        /// <remarks> 
        ///     There is no guarantee on this value. It can vary between application runs.
        /// </remarks> 
        /*public int */Id: { get:function() { return this._id; } },

        /// <summary>
        /// The system (CLR) type that this DependencyObjectType represents 
        /// </summary>
        /*public Type */SystemType: { get:function() { return this._systemType; } } ,
 
        /// <summary>
        /// The DependencyObjectType of the base class 
        /// </summary>
        /*public DependencyObjectType */BaseType:
        {
            get:function() 
            {
                return this._baseDType; 
            } 
        },
 
        /// <summary>
        ///     Returns the name of the represented system (CLR) type
        /// </summary>
        /*public string */Name: { get:function() { return SystemType.Name; } } ,

        /// <summary> 
        ///     Determines whether the specifed Object is an instance of the current DependencyObjectType 
        /// </summary>
        /// <param name="dependencyObject">The Object to compare with the current Type</param> 
        /// <returns>
        ///     true if the current DependencyObjectType is in the inheritance hierarchy of the
        ///     Object represented by the o parameter. false otherwise.
        /// </returns> 
        /*public boolean */IsInstanceOfType:function(/*DependencyObject*/ dependencyObject)
        { 
            if (dependencyObject != null) 
            {
                /*DependencyObjectType*/ var dType = dependencyObject.DependencyObjectType; 

                do
                {
                    if (dType.Id == Id) 
                    {
                        return true; 
                    } 

                    dType = dType._baseDType; 
                }
                while (dType != null);
            }
            return false; 
        },
 
        /// <summary> 
        ///     Determines whether the current DependencyObjectType derives from the
        ///     specified DependencyObjectType 
        /// </summary>
        /// <param name="dependencyObjectType">The DependencyObjectType to compare
        ///     with the current DependencyObjectType</param>
        /// <returns> 
        ///     true if the DependencyObjectType represented by the dType parameter and the
        ///     current DependencyObjectType represent classes, and the class represented 
        ///     by the current DependencyObjectType derives from the class represented by 
        ///     c; otherwise, false. This method also returns false if dType and the
        ///     current Type represent the same class. 
        /// </returns>
        /*public boolean */IsSubclassOf:function(/*DependencyObjectType*/ dependencyObjectType)
        {
            // Check for null and return false, since this type is never a subclass of null. 
            if (dependencyObjectType != null)
            { 
                // A DependencyObjectType isn't considered a subclass of itself, so start with base type 
                /*DependencyObjectType*/ var dType = this._baseDType;
 
                while (dType != null)
                {
                    if (dType.Id == dependencyObjectType.Id)
                    { 
                        return true;
                    } 
 
                    dType = dType._baseDType;
                } 
            }
            return false;
        },
 
        /// <summary>
        ///     Serves as a hash function for a particular type, suitable for use in 
        ///     hashing algorithms and data structures like a hash table 
        /// </summary>
        /// <returns>The DependencyObjectType's Id</returns> 
        /*public int */GetHashCode:function()
        {
            return this._id;
        } ,

        // DTypes may not be constructed outside of FromSystemType 
        /*private DependencyObjectType*/constructor:function() 
        {
        } 


//        private int _id;
//        private Type _systemType; 
//        private DependencyObjectType _baseDType;
// 
//        // Synchronized: Covered by DispatcherLock 
//        private static Dictionary<Type, DependencyObjectType> DTypeFromCLRType = new Dictionary<Type, DependencyObjectType>();
// 
//        // Synchronized: Covered by DispatcherLock
//        private static int DTypeCount = 0;
//
//        private static Object _lock = new Object(); 		
	});
	
	/*static DependencyObjectType */function FromSystemTypeInternal(/*Type*/ systemType)
    { 
//        Debug.Assert(systemType != null && typeof(DependencyObject).IsAssignableFrom(systemType), "Invalid systemType argument");

        /*DependencyObjectType*/ var retVal;

//        lock(_lock)
//        { 
        // Recursive routine to (set up if necessary) and use the 
        //  DTypeFromCLRType hashtable that is used for the actual lookup.
        retVal = FromSystemTypeRecursive( systemType ); 
//        }

        return retVal;
    }
	
    // The caller must wrap this routine inside a locked block. 
    //  This recursive routine manipulates the static hashtable DTypeFromCLRType 
    //  and it must not be allowed to do this across multiple threads
    //  simultaneously. 
    /*private static DependencyObjectType */function FromSystemTypeRecursive(/*Type*/ systemType)
    {
        /*DependencyObjectType*/var dType;

        // Map a CLR Type to a DependencyObjectType
        if (!DTypeFromCLRType.TryGetValue(systemType, out dType)) 
        { 
            // No DependencyObjectType found, create
            dType = new DependencyObjectType(); 

            // Store CLR type
            dType._systemType = systemType;

            // Store reverse mapping
            DTypeFromCLRType[systemType] = dType; 

            // Establish base DependencyObjectType and base property count
            if (systemType != typeof(DependencyObject)) 
            {
                // Get base type
                dType._baseDType = FromSystemTypeRecursive(systemType.BaseType);
            } 

            // Store DependencyObjectType zero-based Id 
            dType._id = DTypeCount++; 
        }

        return dType;
    }
	
	var dpType = {
		/*public static DependencyObjectType */FromSystemType:function(/*Type*/ systemType)
        { 
            if (systemType == null) 
            {
                throw new Error("systemType may not be null"); 
            }

            if (!typeof(DependencyObject).IsAssignableFrom(systemType))
            { 
//                #pragma warning suppress 6506 // systemType is obviously not null
                throw new Error("DTypeNotSupportForSystemType " +systemType.Name); 
            } 

            return FromSystemTypeInternal(systemType); 
        }	
	};
	
	return dpType;
	
});
