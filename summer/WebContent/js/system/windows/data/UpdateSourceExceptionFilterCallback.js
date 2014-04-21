/**
 * From BindingExpression
 * UpdateSourceExceptionFilterCallback
 */
/// <summary> 
/// called whenever any exception is encountered when trying to update
/// the value to the source. The application author can provide its own
/// handler for handling exceptions here. If the delegate returns
///     null - dont throw an error or provide a ValidationError. 
///     Exception - returns the exception itself, we will fire the exception using Async exception model.
///     ValidationError - it will set itself as the BindingInError and add it to the elements Validation errors. 
/// </summary> 
//    public delegate object UpdateSourceExceptionFilterCallback(object bindExpression, Exception exception);
define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var UpdateSourceExceptionFilterCallback = declare("UpdateSourceExceptionFilterCallback", Delegate,{
		constructor:function(method){
		}
	});

	
	UpdateSourceExceptionFilterCallback.Type = new Type("UpdateSourceExceptionFilterCallback", 
			UpdateSourceExceptionFilterCallback, [Delegate.Type]);
	return UpdateSourceExceptionFilterCallback;
});
