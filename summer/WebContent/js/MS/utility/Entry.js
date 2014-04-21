define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
//    internal struct 
    var Entry = declare("Entry", null,{});
    Object.defineProperties(Entry.prototype,{
    	Key:
		{
			get:function() { return this._key; },
			set:function(value) {this._key = value;}
		},
		 
		Value:
		{
			get:function() { return this._value; },
			set:function(value) {this._value = value;}
		}
	});
    
    return Entry;
});