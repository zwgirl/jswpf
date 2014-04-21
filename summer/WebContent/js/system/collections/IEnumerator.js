/**
 * IEnumerator
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IEnumerator = declare("IEnumerator", null,{
		constructor:function( ){

		},
		
		MoveNext:function(){
			
		},
		Reset:function(){
			
		}
	});
	
	Object.defineProperties(IEnumerator.prototype,{
		Current:
		{
			get:function(){
				
			}
		}
	});
	
	IEnumerator.Type = new Type("IEnumerator", IEnumerator, [Object.Type], true);
	return IEnumerator;
});

//using System;
//using System.Runtime.InteropServices;
//namespace System.Collections
//{
//	[__DynamicallyInvokable, ComVisible(true), Guid("496B0ABF-CDEE-11d3-88E8-00902754C43A")]
//	public interface IEnumerator
//	{
//		[__DynamicallyInvokable]
//		object Current
//		{
//			[__DynamicallyInvokable]
//			get;
//		}
//		[__DynamicallyInvokable]
//		bool MoveNext();
//		[__DynamicallyInvokable]
//		void Reset();
//	}
//}
