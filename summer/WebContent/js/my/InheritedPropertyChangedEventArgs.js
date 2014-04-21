/**
 * InheritedPropertyChangedEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var InheritedPropertyChangedEventArgs = declare("InheritedPropertyChangedEventArgs", EventArgs,{
		constructor:function(/*ref InheritablePropertyChangeInfo*/ info) 
        {
            this._info = info;
		}
	});
	
	Object.defineProperties(InheritedPropertyChangedEventArgs.prototype,{
//        internal InheritablePropertyChangeInfo 
		Info:
        { 
            get:function() { return this._info; } 
        }  
	});
	
	InheritedPropertyChangedEventArgs.Type = new Type("InheritedPropertyChangedEventArgs", InheritedPropertyChangedEventArgs,
			[EventArgs.Type]);
	return InheritedPropertyChangedEventArgs;
});



//---------------------------------------------------------------------------- 
//
// <copyright file="InheritedPropertyChangedEventArgs.cs" company="Microsoft">
//    Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// Description: Event args for the (internal) InheritedPropertyChanged event 
// 
//---------------------------------------------------------------------------
 
using System;
using System.Windows;

namespace MS.Internal 
{
    // Event args for the (internal) InheritedPropertyChanged event 
    internal class InheritedPropertyChangedEventArgs : EventArgs 
    {
        internal InheritedPropertyChangedEventArgs(ref InheritablePropertyChangeInfo info) 
        {
            _info = info;
        }
 
        internal InheritablePropertyChangeInfo Info
        { 
            get { return _info; } 
        }
 
        private InheritablePropertyChangeInfo _info;
    }

    // Handler delegate for the (internal) InheritedPropertyChanged event 
    internal delegate void InheritedPropertyChangedEventHandler(object sender, InheritedPropertyChangedEventArgs e);
} 

