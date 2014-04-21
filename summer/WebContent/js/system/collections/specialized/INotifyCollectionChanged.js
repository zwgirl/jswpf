/**
 * INotifyCollectionChanged
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var INotifyCollectionChanged = declare("INotifyCollectionChanged", null,{

	});
	
	var _CollectionChanged = null;
	Object.defineProperties(INotifyCollectionChanged,{
//		event NotifyCollectionChangedEventHandler 
		CollectionChanged:
		{
			get:function()
			{
				if(_CollectionChanged == null){
					_CollectionChanged = new Delegate();
				}
				
				return _CollectionChanged;
			}
		}

	});
	
	INotifyCollectionChanged.Type = new Type("INotifyCollectionChanged", INotifyCollectionChanged, [Object.Type]);
	return INotifyCollectionChanged;
});

//using System;
//using System.Runtime.CompilerServices;
//namespace System.Collections.Specialized
//{
//	[__DynamicallyInvokable, TypeForwardedFrom("WindowsBase, Version=3.0.0.0, Culture=Neutral, PublicKeyToken=31bf3856ad364e35")]
//	public interface INotifyCollectionChanged
//	{
//		[__DynamicallyInvokable]
//		event NotifyCollectionChangedEventHandler CollectionChanged;
//	}
//}
