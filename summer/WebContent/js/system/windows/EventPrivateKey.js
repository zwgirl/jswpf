/**
 * EventPrivateKey
 */

define(["dojo/_base/declare", "system/Type", "windows/GlobalEventManager"], function(declare, Type, GlobalEventManager){
	var EventPrivateKey = declare("EventPrivateKey", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			this._globalIndex = GlobalEventManager.GetNextAvailableGlobalIndex(this); 
		}
	});
	
	Object.defineProperties(EventPrivateKey.prototype,{
		  
//        internal int 
        GlobalIndex: 
        {
            get:function() { return this._globalIndex; } 
        }

	});
	
	EventPrivateKey.Type = new Type("EventPrivateKey", EventPrivateKey, [Object.Type]);
	return EventPrivateKey;
});
 

