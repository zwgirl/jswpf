/**
 * INotifyDataErrorInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var INotifyDataErrorInfo = declare("INotifyDataErrorInfo", null,{
		constructor:function( ){

		},
		
//		IEnumerable 
		GetErrors:function(/*string*/ propertyName){
			
		}
	});
	
	Object.defineProperties(INotifyDataErrorInfo.prototype,{
		ErrorsChanged:
		{
			get:function()
			{
				if(this._errorsChanged === undefined){
					this._errorsChanged = new MultiCastDelegate();
				}
				
				return this._errorsChanged;
			}
		},
	
//		bool 
		HasErrors:
		{
			get:function(){
				
			}
		}
	});
	
	INotifyDataErrorInfo.Type = new Type("INotifyDataErrorInfo", INotifyDataErrorInfo, [Object.Type]);
	return INotifyDataErrorInfo;
});

//using System;
//using System.Collections;
//namespace System.ComponentModel
//{
//	[__DynamicallyInvokable]
//	public interface INotifyDataErrorInfo
//	{
//		[__DynamicallyInvokable]
//		event EventHandler<DataErrorsChangedEventArgs> ErrorsChanged;
//		[__DynamicallyInvokable]
//		bool HasErrors
//		{
//			[__DynamicallyInvokable]
//			get;
//		}
//		[__DynamicallyInvokable]
//		IEnumerable GetErrors(string propertyName);
//	}
//}