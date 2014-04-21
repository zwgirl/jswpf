/**
 * IDictionary
 */

define(["dojo/_base/declare", "system/Type", "collections/ICollection"], function(declare, Type, ICollection){
	var IDictionary = declare("IDictionary", null,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(IDictionary.prototype,{
	});
	
	IDictionary.Type = new Type("IDictionary", IDictionary, [ICollection.Type], true);
	return IDictionary;
});

//	public interface IDictionary : ICollection, IEnumerable
//	{
//		[__DynamicallyInvokable]
//		object this[object key]
//		{
//			[__DynamicallyInvokable]
//			get;
//			[__DynamicallyInvokable]
//			set;
//		}
//		[__DynamicallyInvokable]
//		ICollection Keys
//		{
//			[__DynamicallyInvokable]
//			get;
//		}
//		[__DynamicallyInvokable]
//		ICollection Values
//		{
//			[__DynamicallyInvokable]
//			get;
//		}
//		[__DynamicallyInvokable]
//		bool IsReadOnly
//		{
//			[__DynamicallyInvokable]
//			get;
//		}
//		[__DynamicallyInvokable]
//		bool IsFixedSize
//		{
//			[__DynamicallyInvokable]
//			get;
//		}
//		[__DynamicallyInvokable]
//		bool Contains(object key);
//		[__DynamicallyInvokable]
//		void Add(object key, object value);
//		[__DynamicallyInvokable]
//		void Clear();
//		[__DynamicallyInvokable]
//		IDictionaryEnumerator GetEnumerator();
//		[__DynamicallyInvokable]
//		void Remove(object key);
//	}