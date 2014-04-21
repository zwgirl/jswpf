/**
 * IWeakEventListener
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IWeakEventListener = declare("IWeakEventListener", null,{
//		bool 
		ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e){
			
		}
	});
	
	
	IWeakEventListener.Type = new Type("IWeakEventListener", IWeakEventListener, [Object.Type], true);
	return IWeakEventListener;
});

//using System;
//namespace System.Windows
//{
//	public interface IWeakEventListener
//	{
//		bool ReceiveWeakEvent(Type managerType, object sender, EventArgs e);
//	}
//}