/**
 * IDisposable
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IDisposable = declare("IDisposable", null,{
//		void 
		Dispose:function(){
			
		}
	});
	
	Object.defineProperties(IDisposable.prototype,{

	});
	
	IDisposable.Type = new Type("IDisposable", IDisposable, [Object.Type], true);
	return IDisposable;
});

//using System;
//using System.Runtime.InteropServices;
//namespace System
//{
//	[__DynamicallyInvokable, ComVisible(true)]
//	public interface IDisposable
//	{
//		[__DynamicallyInvokable]
//		void Dispose();
//	}
//}