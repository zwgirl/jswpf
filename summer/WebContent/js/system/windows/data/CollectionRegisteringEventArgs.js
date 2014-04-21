/**
 * CollectionRegisteringEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], 
		function(declare, Type, EventArgs){
	var CollectionRegisteringEventArgs = declare("CollectionRegisteringEventArgs", EventArgs,{
		constructor:function(/*IEnumerable*/ collection, /*object*/ parent/*=null*/)
        {
			if(parent === undefined){
				parent = null;
			}
            this._collection = collection;
            this._parent = parent; 
		}
	});
	
	Object.defineProperties(CollectionRegisteringEventArgs.prototype,{
//        public IEnumerable 
		Collection: { get:function() { return this._collection; } },

//        public object 
		Parent: { get:function() { return this._parent; } }   
	});
	
	Object.defineProperties(CollectionRegisteringEventArgs,{
		  
	});
	
	CollectionRegisteringEventArgs.Type = new Type("CollectionRegisteringEventArgs", CollectionRegisteringEventArgs, 
			[EventArgs.Type]);
	return CollectionRegisteringEventArgs;
});

