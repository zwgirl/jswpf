/**
 * IDictionaryEnumerator
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator"], function(declare, Type, IEnumerator){
	var IDictionaryEnumerator = declare("EntryIndex", null,{
	});
	
	Object.defineProperties(IDictionaryEnumerator.prototype,{
//		object 
		Key:
		{
			get:function(){}
		},
//		object 
		Value:
		{
			get:function(){}
		},
//		DictionaryEntry 
		Entry:
		{
			get:function(){}
		},
	});
	
	IDictionaryEnumerator.Type = new Type("IDictionaryEnumerator", IDictionaryEnumerator, [IEnumerator.Type], true);
	return IDictionaryEnumerator;
});
