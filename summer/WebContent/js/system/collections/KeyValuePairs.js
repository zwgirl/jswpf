/**
 * KeyValuePairs
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var KeyValuePairs = declare("KeyValuePairs", Object,{
		constructor:function(/*object*/ key, /*object*/ value) {
            this.value = value;
            this.key = key;
		}
	});
	
	Object.defineProperties(KeyValuePairs.prototype,{
//        public object 
		Key: { 
            get:function() { return this.key; } 
        },
 
//        public object 
		Value: {
            get:function() { return this.value; }
        } 
	});
	
	Object.defineProperties(KeyValuePairs,{
		  
	});
	
	KeyValuePairs.Type = new Type("KeyValuePairs", KeyValuePairs, [Object.Type]);
	return KeyValuePairs;
});

