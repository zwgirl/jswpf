/**
 * DependencyObjectType
 */

define(["dojo/_base/declare", "system/Type"/*, "windows/DependencyObject"*/], function(declare, Type/*, DependencyObject*/){

	var DependencyObject = null;
    function EnsureDependencyObject(){
    	if(DependencyObject == null){
    		DependencyObject = using("windows/DependencyObject");
    	}
    	
    	return DependencyObject;
    }
    
    // Synchronized: Covered by DispatcherLock 
    var DTypeFromCLRType = {};

    // Synchronized: Covered by DispatcherLock
    /*private static int */
    var DTypeCount = 0;
    
	var DependencyObjectType = declare("DependencyObjectType", null,{
		
        // DTypes may not be constructed outside of FromSystemType 
		constructor:function(){

		},
		
        ///     Determines whether the specifed object is an instance of the current DependencyObjectType 
        /// <param name="dependencyObject">The object to compare with the current Type</param> 
        /// <returns>
        ///     true if the current DependencyObjectType is in the inheritance hierarchy of the
        ///     object represented by the o parameter. false otherwise.
        /// </returns> 
        IsInstanceOfType:function(/*DependencyObject*/ dependencyObject)
        { 
            if (dependencyObject != null) 
            {
                /*DependencyObjectType*/
            	var dType = dependencyObject.DependencyObjectType; 

                do
                {
                    if (dType.Id == this.Id) 
                    {
                        return true; 
                    } 

                    dType = dType._baseDType; 
                }
                while (dType != null);
            }
            return false; 
        },
 
        ///     Determines whether the current DependencyObjectType derives from the
        ///     specified DependencyObjectType 
        /// <param name="dependencyObjectType">The DependencyObjectType to compare
        ///     with the current DependencyObjectType</param>
        /// <returns> 
        ///     true if the DependencyObjectType represented by the dType parameter and the
        ///     current DependencyObjectType represent classes, and the class represented 
        ///     by the current DependencyObjectType derives from the class represented by 
        ///     c; otherwise, false. This method also returns false if dType and the
        ///     current Type represent the same class. 
        /// </returns>
        IsSubclassOf:function(/*DependencyObjectType*/ dependencyObjectType)
        {
            // Check for null and return false, since this type is never a subclass of null. 
            if (dependencyObjectType != null)
            { 
                // A DependencyObjectType isn't considered a subclass of itself, so start with base type 
                /*DependencyObjectType*/
            	var dType = this._baseDType;
 
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
        
        toString:function(){
        	return this._id;
        }

	});
	
	Object.defineProperties(DependencyObjectType.prototype,{

        ///     Zero-based unique identifier for constant-time array lookup operations
        /// <remarks> 
        ///     There is no guarantee on this value. It can vary between application runs.
        /// </remarks> 
        Id: { get:function() { return this._id; } },

        /// <summary>
        /// The system (CLR) type that this DependencyObjectType represents 
        /// </summary>
        SystemType: { get:function() { return this._systemType; } }, 
 
        /// The DependencyObjectType of the base class 
        /*public DependencyObjectType */
        BaseType:
        {
            get:function() 
            {
                return this._baseDType; 
            } 
        },
 
        ///     Returns the name of the represented system (CLR) type
        Name: { get:function() { return this.SystemType.Name; } } 

	});
	
    ///     Retrieve a DependencyObjectType that represents a given system (CLR) type 
    /// <param name="systemType">The system (CLR) type to convert</param> 
    /// <returns>
    ///     A DependencyObjectType that represents the system (CLR) type (will create
    ///     a new one if doesn't exist)
    /// </returns> 
    DependencyObjectType.FromSystemType = function(/*Type*/ systemType)
    { 
        if (systemType == null) 
        {
            throw new Eror("ArgumentNullException('systemType')"); 
        }
        
//        if (!DependencyObject.Type.IsAssignableFrom(systemType))
//        { 
//            throw new Error("ArgumentException(SR.Get(SRID.DTypeNotSupportForSystemType, systemType.Name)"); 
//        } 


        return DependencyObjectType.FromSystemTypeInternal(systemType); 
    };

    ///     Helper method for the public FromSystemType call but without 
    ///     the expensive IsAssignableFrom parameter validation.
    DependencyObjectType.FromSystemTypeInternal = function(/*Type*/ systemType)
    { 
        var retVal;

        // Recursive routine to (set up if necessary) and use the 
        //  DTypeFromCLRType hashtable that is used for the actual lookup.
        retVal = FromSystemTypeRecursive( systemType ); 

        return retVal;
    };

    // The caller must wrap this routine inside a locked block. 
    //  This recursive routine manipulates the static hashtable DTypeFromCLRType 
    //  and it must not be allowed to do this across multiple threads
    //  simultaneously. 
    /*private static DependencyObjectType */
    function FromSystemTypeRecursive(/*Type*/ systemType)
    {
        /*DependencyObjectType*/
    	var dType = DTypeFromCLRType[systemType];

        // Map a CLR Type to a DependencyObjectType
        if (dType === undefined) 
        { 
            // No DependencyObjectType found, create
            dType = new DependencyObjectType(); 

            // Store CLR type
            dType._systemType = systemType;

            // Store reverse mapping
            DTypeFromCLRType[systemType] = dType; 

            // Establish base DependencyObjectType and base property count
            var DOType = EnsureDependencyObject();
            if (systemType != DOType.Type) 
            {
                // Get base type
                dType._baseDType = FromSystemTypeRecursive(systemType.BaseType);
            } 

            // Store DependencyObjectType zero-based Id 
            dType._id = DTypeCount++; 
        }

        return dType;
    };
    
	return DependencyObjectType;
});
