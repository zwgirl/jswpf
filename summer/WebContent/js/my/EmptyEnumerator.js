/**
 * EmptyEnumerator
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var EmptyEnumerator = declare(null,{
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
	
	Object.defineProperties(EmptyEnumerator.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	EmptyEnumerator.Type = new Type("EmptyEnumerator", EmptyEnumerator, [Object.Type]);
	return EmptyEnumerator;
});


//---------------------------------------------------------------------------- 
//
// <copyright file="EmptyEnumerator" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: Empty enumerator 
//
// History: 
//  02/26/2004 : JeffBog stole from ItemsView (and stole comments from UIAutomation)
//
//---------------------------------------------------------------------------
using System; 
using System.Collections;
 
namespace MS.Internal.Controls 
{
    /// <summary> 
    /// Returns an Enumerator that enumerates over nothing.
    /// </summary>
    internal class EmptyEnumerator: IEnumerator
    { 
        // singleton class, private ctor
        private EmptyEnumerator() 
        { 
        }
 
        /// <summary>
        /// Read-Only instance of an Empty Enumerator.
        /// </summary>
        public static IEnumerator Instance 
        {
            get 
            { 
                if (_instance == null)
                { 
                    _instance = new EmptyEnumerator();
                }
                return _instance;
            } 
        }
 
        /// <summary> 
        /// Does nothing.
        /// </summary> 
        public void Reset() { }

        /// <summary>
        /// Returns false. 
        /// </summary>
        /// <returns>false</returns> 
        public bool MoveNext() { return false; } 

 
#pragma warning disable 1634, 1691  // about to use PreSharp message numbers - unknown to C#

        /// <summary>
        /// Returns null. 
        /// </summary>
        public object Current { 
            get 
            {
                #pragma warning disable 6503 // "Property get methods should not throw exceptions." 

                throw new InvalidOperationException();

                #pragma warning restore 6503 
            }
        } 
#pragma warning restore 1634, 1691 

        private static IEnumerator _instance; 
    }
}

// File provided for Reference Use Only by Microsoft Corporation (c) 2007.
// Copyright (c) Microsoft Corporation. All rights reserved.
//---------------------------------------------------------------------------- 
//
// <copyright file="EmptyEnumerator" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: Empty enumerator 
//
// History: 
//  02/26/2004 : JeffBog stole from ItemsView (and stole comments from UIAutomation)
//
//---------------------------------------------------------------------------
using System; 
using System.Collections;
 
namespace MS.Internal.Controls 
{
    /// <summary> 
    /// Returns an Enumerator that enumerates over nothing.
    /// </summary>
    internal class EmptyEnumerator: IEnumerator
    { 
        // singleton class, private ctor
        private EmptyEnumerator() 
        { 
        }
 
        /// <summary>
        /// Read-Only instance of an Empty Enumerator.
        /// </summary>
        public static IEnumerator Instance 
        {
            get 
            { 
                if (_instance == null)
                { 
                    _instance = new EmptyEnumerator();
                }
                return _instance;
            } 
        }
 
        /// <summary> 
        /// Does nothing.
        /// </summary> 
        public void Reset() { }

        /// <summary>
        /// Returns false. 
        /// </summary>
        /// <returns>false</returns> 
        public bool MoveNext() { return false; } 

 
#pragma warning disable 1634, 1691  // about to use PreSharp message numbers - unknown to C#

        /// <summary>
        /// Returns null. 
        /// </summary>
        public object Current { 
            get 
            {
                #pragma warning disable 6503 // "Property get methods should not throw exceptions." 

                throw new InvalidOperationException();

                #pragma warning restore 6503 
            }
        } 
#pragma warning restore 1634, 1691 

        private static IEnumerator _instance; 
    }
}

// File provided for Reference Use Only by Microsoft Corporation (c) 2007.
// Copyright (c) Microsoft Corporation. All rights reserved.
