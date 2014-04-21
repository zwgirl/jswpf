/**
 * IList
 */

define(["dojo/_base/declare", "system/Type",
        "collections/IEnumerable", "collections/ICollection"], 
        function(declare, Type,
        		IEnumerable, ICollection){
	var IList = declare("IList", [ICollection, IEnumerable],{
		Set:function(index, value){
			
		},
		Get:function(index){
			
		},
		
//		int 
		Add:function(/*object*/ value){
			
		},
//		bool 
		Contains:function(/*object*/ value){
			
		},
//		void 
		Clear:function(){
			
		},
//		int 
		IndexOf:function(/*object*/ value){
			
		},
//		void 
		Insert:function(/*int*/ index, /*object*/ value){
			
		},
//		void 
		Remove:function(/*object*/ value){
			
		},
//		void 
		RemoveAt:function(/*int*/ index){
			
		}
	});
	
	Object.defineProperties(IList.prototype,{
//		bool 
		IsReadOnly:
		{
			get:function(){
				
			}
		},
//		bool 
		IsFixedSize:
		{
			get:function(){
				
			}
		}
	});
	
	IList.Type = new Type("IList", IList, [ICollection.Type, IEnumerable.Type]);
	return IList;
});

//using System;
//using System.Runtime.InteropServices;
//namespace System.Collections
//{
//	[__DynamicallyInvokable, ComVisible(true)]
//	public interface IList : ICollection, IEnumerable
//	{
//		[__DynamicallyInvokable]
//		object this[int index]
//		{
//			[__DynamicallyInvokable]
//			get;
//			[__DynamicallyInvokable]
//			set;
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
//		int Add(object value);
//		[__DynamicallyInvokable]
//		bool Contains(object value);
//		[__DynamicallyInvokable]
//		void Clear();
//		[__DynamicallyInvokable]
//		int IndexOf(object value);
//		[__DynamicallyInvokable]
//		void Insert(int index, object value);
//		[__DynamicallyInvokable]
//		void Remove(object value);
//		[__DynamicallyInvokable]
//		void RemoveAt(int index);
//	}
//}