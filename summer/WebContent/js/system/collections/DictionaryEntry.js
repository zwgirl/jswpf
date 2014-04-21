/**
 * DictionaryEntry
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var DictionaryEntry = declare("DictionaryEntry", Object,{
		constructor:function(/*Object*/ key, /*Object*/ value) {
	        this._key = key; 
	        this._value = value;
	    }
	});
	
	Object.defineProperties(DictionaryEntry.prototype,{
//        public Object 
		Key: {
            get:function() { 
                return this._key;
            },

            set:function(value) { 
                this._key = value;
            } 
        }, 

//        public Object 
		Value: { 
            get:function() {
                return this._value;
            },
 
            set:function(value) {
            	this._value = value; 
            } 
        }  
	});
	
	DictionaryEntry.Type = new Type("DictionaryEntry", DictionaryEntry, [Object.Type]);
	return DictionaryEntry;
});
