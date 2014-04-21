/**
 * EmptyEnumerable
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var EmptyEnumerable = declare("EmptyEnumerable", IEnumerable,{
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
	
	Object.defineProperties(EntryIndex.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	EmptyEnumerable.Type = new Type("EmptyEnumerable", EmptyEnumerable, [IEnumerable.Type]);
	return EmptyEnumerable;
});
//---------------------------------------------------------------------------- 
//
// <copyright file="EmptyEnumerable" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: Empty enumerable 
//
// History: 
//  11/11/2004  KenLai  :   Created
//
//---------------------------------------------------------------------------
using System; 
using System.Collections;
 
namespace MS.Internal.Controls 
{
    /// <summary> 
    /// Returns an Enumerable that is empty.
    /// </summary>
    internal class EmptyEnumerable: IEnumerable
    { 
        // singleton class, private ctor
        private EmptyEnumerable() 
        { 
        }
 
        IEnumerator IEnumerable.GetEnumerator()
        {
            return EmptyEnumerator.Instance;
        } 

        /// <summary> 
        /// Read-Only instance of an Empty Enumerable. 
        /// </summary>
        public static IEnumerable Instance 
        {
            get
            {
                if (_instance == null) 
                {
                    _instance = new EmptyEnumerable(); 
                } 
                return _instance;
            } 
        }

        private static IEnumerable _instance;
    } 
}

