/**
 * DependencyObjectType
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObject"], function(declare, Type, DependencyObject){
	var DependencyObjectType = declare(null,{
		
        // DTypes may not be constructed outside of FromSystemType 
		constructor:function(){

		},
		

        /// <summary> 
        ///     Determines whether the specifed object is an instance of the current DependencyObjectType 
        /// </summary>
        /// <param name="dependencyObject">The object to compare with the current Type</param> 
        /// <returns>
        ///     true if the current DependencyObjectType is in the inheritance hierarchy of the
        ///     object represented by the o parameter. false otherwise.
        /// </returns> 
        IsInstanceOfType:function(/*DependencyObject*/ dependencyObject)
        { 
            if (dependencyObject != null) 
            {
                /*DependencyObjectType*/var dType = dependencyObject.DependencyObjectType; 

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
        IsSubclassOf:function(/*DependencyObjectType*/ dependencyObjectType)
        {
            // Check for null and return false, since this type is never a subclass of null. 
            if (dependencyObjectType != null)
            { 
                // A DependencyObjectType isn't considered a subclass of itself, so start with base type 
                /*DependencyObjectType*/var dType = this._baseDType;
 
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
        GetHashCode:function()
        {
            return this._id;
        } 


	});
	
	Object.defineProperties(DependencyObjectType.prototype,{

        /// <summary> 
        ///     Zero-based unique identifier for constant-time array lookup operations
        /// </summary> 
        /// <remarks> 
        ///     There is no guarantee on this value. It can vary between application runs.
        /// </remarks> 
        Id: { get:function() { return this._id; } },

        /// <summary>
        /// The system (CLR) type that this DependencyObjectType represents 
        /// </summary>
        SystemType: { get:function() { return this._systemType; } }, 
 
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
        Name: { get:function() { return this.SystemType.Name; } } 

	});
	
    /// <summary> 
    ///     Retrieve a DependencyObjectType that represents a given system (CLR) type 
    /// </summary>
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

    /// <summary>
    ///     Helper method for the public FromSystemType call but without 
    ///     the expensive IsAssignableFrom parameter validation.
    /// </summary> 
    DependencyObjectType.FromSystemTypeInternal = function(/*Type*/ systemType)
    { 
//        Debug.Assert(systemType != null && typeof(DependencyObject).IsAssignableFrom(systemType), "Invalid systemType argument");

        var retVal;

//        lock(_lock)
//        { 
            // Recursive routine to (set up if necessary) and use the 
            //  DTypeFromCLRType hashtable that is used for the actual lookup.
            retVal = FromSystemTypeRecursive( systemType ); 
//        }

        return retVal;
    };

    // The caller must wrap this routine inside a locked block. 
    //  This recursive routine manipulates the static hashtable DTypeFromCLRType 
    //  and it must not be allowed to do this across multiple threads
    //  simultaneously. 
    /*private static DependencyObjectType */FromSystemTypeRecursive = function(/*Type*/ systemType)
    {
        /*DependencyObjectType*/var dType = DTypeFromCLRType[systemType];

        // Map a CLR Type to a DependencyObjectType
        if (dType ==null && dType === undefined) 
        { 
            // No DependencyObjectType found, create
            dType = new DependencyObjectType(); 

            // Store CLR type
            dType._systemType = systemType;

            // Store reverse mapping
            DTypeFromCLRType[systemType] = dType; 

            // Establish base DependencyObjectType and base property count
            if (systemType != DependencyObject.Type) 
            {
                // Get base type
                dType._baseDType = FromSystemTypeRecursive(systemType.BaseType);
            } 

            // Store DependencyObjectType zero-based Id 
            dType._id = DTypeCount++; 
        }

        return dType;
    };
    

//
//    private int _id;
//    private Type _systemType; 
//    private DependencyObjectType _baseDType;

    // Synchronized: Covered by DispatcherLock 
    var DTypeFromCLRType = new Object();

    // Synchronized: Covered by DispatcherLock
    /*private static int */var DTypeCount = 0;

	
	return DependencyObjectType;
});

using System; 
using System.Collections.Generic;
using System.Diagnostics;
using System.Windows.Threading;
using MS.Utility; 
using MS.Internal.WindowsBase;
 
#pragma warning disable 1634, 1691  // suppressing PreSharp warnings 

namespace System.Windows 
{
    /// <summary>
    ///     Type cache for all DependencyObject derived types
    /// </summary> 
    /// <remarks>
    ///     Every <see cref="DependencyObject"/> stores a reference to its DependencyObjectType. 
    ///     This is an object that represents a specific system (CLR) Type.<para/> 
    ///
    ///     DTypes have 2 purposes: 
    ///     <list type="number">
    ///         <item>
    ///             More performant type operations (especially for Expressions that
    ///             rely heavily on type inspection) 
    ///         </item>
    ///         <item> 
    ///             Forces static constructors of base types to always run first. This 
    ///             consistancy is necessary for components (such as Expressions) that
    ///             rely on static construction order for correctness. 
    ///         </item>
    ///     </list>
    /// </remarks>
    public class DependencyObjectType 
    {
        /// <summary> 
        ///     Retrieve a DependencyObjectType that represents a given system (CLR) type 
        /// </summary>
        /// <param name="systemType">The system (CLR) type to convert</param> 
        /// <returns>
        ///     A DependencyObjectType that represents the system (CLR) type (will create
        ///     a new one if doesn't exist)
        /// </returns> 
        public static DependencyObjectType FromSystemType(Type systemType)
        { 
            if (systemType == null) 
            {
                throw new ArgumentNullException("systemType"); 
            }

            if (!typeof(DependencyObject).IsAssignableFrom(systemType))
            { 
                #pragma warning suppress 6506 // systemType is obviously not null
                throw new ArgumentException(SR.Get(SRID.DTypeNotSupportForSystemType, systemType.Name)); 
            } 

            return FromSystemTypeInternal(systemType); 
        }

        /// <summary>
        ///     Helper method for the public FromSystemType call but without 
        ///     the expensive IsAssignableFrom parameter validation.
        /// </summary> 
        [FriendAccessAllowed] // Built into Base, also used by Framework. 
        internal static DependencyObjectType FromSystemTypeInternal(Type systemType)
        { 
            Debug.Assert(systemType != null && typeof(DependencyObject).IsAssignableFrom(systemType), "Invalid systemType argument");

            DependencyObjectType retVal;
 
            lock(_lock)
            { 
                // Recursive routine to (set up if necessary) and use the 
                //  DTypeFromCLRType hashtable that is used for the actual lookup.
                retVal = FromSystemTypeRecursive( systemType ); 
            }

            return retVal;
        } 

        // The caller must wrap this routine inside a locked block. 
        //  This recursive routine manipulates the static hashtable DTypeFromCLRType 
        //  and it must not be allowed to do this across multiple threads
        //  simultaneously. 
        private static DependencyObjectType FromSystemTypeRecursive(Type systemType)
        {
            DependencyObjectType dType;
 
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

        /// <summary> 
        ///     Zero-based unique identifier for constant-time array lookup operations
        /// </summary> 
        /// <remarks> 
        ///     There is no guarantee on this value. It can vary between application runs.
        /// </remarks> 
        public int Id { get { return _id; } }

        /// <summary>
        /// The system (CLR) type that this DependencyObjectType represents 
        /// </summary>
        public Type SystemType { get { return _systemType; } } 
 
        /// <summary>
        /// The DependencyObjectType of the base class 
        /// </summary>
        public DependencyObjectType BaseType
        {
            get 
            {
                return _baseDType; 
            } 
        }
 
        /// <summary>
        ///     Returns the name of the represented system (CLR) type
        /// </summary>
        public string Name { get { return SystemType.Name; } } 

        /// <summary> 
        ///     Determines whether the specifed object is an instance of the current DependencyObjectType 
        /// </summary>
        /// <param name="dependencyObject">The object to compare with the current Type</param> 
        /// <returns>
        ///     true if the current DependencyObjectType is in the inheritance hierarchy of the
        ///     object represented by the o parameter. false otherwise.
        /// </returns> 
        public bool IsInstanceOfType(DependencyObject dependencyObject)
        { 
            if (dependencyObject != null) 
            {
                DependencyObjectType dType = dependencyObject.DependencyObjectType; 

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
        }
 
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
        public bool IsSubclassOf(DependencyObjectType dependencyObjectType)
        {
            // Check for null and return false, since this type is never a subclass of null. 
            if (dependencyObjectType != null)
            { 
                // A DependencyObjectType isn't considered a subclass of itself, so start with base type 
                DependencyObjectType dType = _baseDType;
 
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
        }
 
        /// <summary>
        ///     Serves as a hash function for a particular type, suitable for use in 
        ///     hashing algorithms and data structures like a hash table 
        /// </summary>
        /// <returns>The DependencyObjectType's Id</returns> 
        public override int GetHashCode()
        {
            return _id;
        } 

        // DTypes may not be constructed outside of FromSystemType 
        private DependencyObjectType() 
        {
        } 


        private int _id;
        private Type _systemType; 
        private DependencyObjectType _baseDType;
 
        // Synchronized: Covered by DispatcherLock 
        private static Dictionary<Type, DependencyObjectType> DTypeFromCLRType = new Dictionary<Type, DependencyObjectType>();
 
        // Synchronized: Covered by DispatcherLock
        private static int DTypeCount = 0;

        private static object _lock = new object(); 
    }
} 