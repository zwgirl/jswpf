/**
 * KeyValuePair
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var KeyValuePair = declare("KeyValuePair", null,{
		constructor:function(/*TKey*/ key, /*TValue*/ value)
		{
			this.key = key;
			this.value = value;
		}
	});
	
	Object.defineProperties(KeyValuePair.prototype,{
		Key:
		{
			get:function()
			{
				return this.key;
			}
		},
		Value:
		{
			get:function()
			{
				return this.value;
			}
		}
	});
	
	KeyValuePair.Type = new Type("KeyValuePair", KeyValuePair, [Object.Type]);
	return KeyValuePair;
});
