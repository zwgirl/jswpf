/**
 * EventPrivateKey
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var EventPrivateKey = declare("EventPrivateKey", null,{
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
	
	Object.defineProperties(EventPrivateKey.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	EventPrivateKey.Type = new Type("EventPrivateKey", EventPrivateKey, [Object.Type]);
	return EventPrivateKey;
});

using System; 

namespace System.Windows
{
    /// <summary> 
    ///     This class is meant to provide identification
    ///     for Clr events whose handlers are stored 
    ///     into EventHandlersStore 
    /// </summary>
    /// <remarks> 
    ///     This type has been specifically added so that it
    ///     is easy to enforce via fxcop rules or such that
    ///     event keys of this type must be private static
    ///     fields on the declaring class. 
    /// </remarks>
    public class EventPrivateKey 
    { 
        /// <summary>
        ///     Constructor for EventPrivateKey 
        /// </summary>
        public EventPrivateKey()
        {
            _globalIndex = GlobalEventManager.GetNextAvailableGlobalIndex(this); 
        }
 
        internal int GlobalIndex 
        {
            get { return _globalIndex; } 
        }

        private int _globalIndex;
    } 
}
 

