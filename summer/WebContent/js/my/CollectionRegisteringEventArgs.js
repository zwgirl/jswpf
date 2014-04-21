/**
 * CollectionRegisteringEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var CollectionRegisteringEventArgs = declare("CollectionRegisteringEventArgs", EventArgs,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(CollectionRegisteringEventArgs.prototype,{
		  
	});
	
	Object.defineProperties(CollectionRegisteringEventArgs,{
		  
	});
	
	CollectionRegisteringEventArgs.Type = new Type("CollectionRegisteringEventArgs", CollectionRegisteringEventArgs, 
			[EventArgs.Type]);
	return CollectionRegisteringEventArgs;
});



//---------------------------------------------------------------------------- 
//
// <copyright file="CollectionRegisteringEventArgs.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// Description: Arguments to the CollectionRegistering event (see BindingOperations). 
// 
// See spec at http://sharepoint/sites/WPF/Specs/Shared%20Documents/v4.5/Cross-thread%20Collections.docx
// 
//---------------------------------------------------------------------------

using System;
using System.Collections; 

namespace System.Windows.Data 
{ 
    public class CollectionRegisteringEventArgs : EventArgs
    { 
        internal CollectionRegisteringEventArgs(IEnumerable collection, object parent=null)
        {
            _collection = collection;
            _parent = parent; 
        }
 
        public IEnumerable Collection { get { return _collection; } } 

        public object Parent { get { return _parent; } } 

        IEnumerable _collection;
        object _parent;
    } 
}

