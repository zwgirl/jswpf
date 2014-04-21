/**
 * IEnumerable
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator"], 
		function(declare, Type, IEnumerator){
	var IEnumerable = declare("IEnumerable", null,{
		GetEnumerator:function(){
			
		}
	});
	
	IEnumerable.Type = new Type("IEnumerable", IEnumerable, [Object.Type], true);
	return IEnumerable;
});

//using System;
//using System.Runtime.InteropServices;
//namespace System.Collections
//{
//	[__DynamicallyInvokable, ComVisible(true), Guid("496B0ABE-CDEE-11d3-88E8-00902754C43A")]
//	public interface IEnumerable
//	{
//		[__DynamicallyInvokable, DispId(-4)]
//		IEnumerator GetEnumerator();
//	}
//}