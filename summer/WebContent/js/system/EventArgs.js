/**
 * EventArgs
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var EventArgs = declare("EventArgs", null,{

	});
	
	var _Empty = null;
	Object.defineProperties(EventArgs, {
		Empty:
		{
			get:function(){
				if(_Empty == null){
					_Empty = new EventArgs();
				}
				
				return _Empty;
			}
			
		}
	});
	
	EventArgs.Type = new Type("EventArgs", EventArgs, [Object.Type]);
	return EventArgs;
});

//// ==++== 
////
////   Copyright (c) Microsoft Corporation.  All rights reserved.
////
//// ==--== 
//namespace System {
// 
//    using System; 
//    // The base class for all event classes.
//    [Serializable] 
//    [System.Runtime.InteropServices.ComVisible(true)]
//    public class EventArgs {
//        public static readonly EventArgs Empty = new EventArgs();
// 
//        public EventArgs()
//        { 
//        } 
//    }
//} 
