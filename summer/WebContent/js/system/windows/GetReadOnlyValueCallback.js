/**
 * GetReadOnlyValueCallback
 * 	internal delegate object GetReadOnlyValueCallback(DependencyObject d, out BaseValueSourceInternal source);
 */

/// <summary>
///     GetReadOnlyValueCallback -- a very specialized callback that allows storage for read-only properties 
///     to be managed outside of the effective value store on a DO.  This optimization is restricted to read-only
///     properties because read-only properties can only have a value explicitly set by the keeper of the key, so
///     it eliminates the possibility of a self-managed store missing modifiers such as expressions, coercion,
///     and animation. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var GetReadOnlyValueCallback = declare("GetReadOnlyValueCallback", Delegate,{
		constructor:function(){

		}
	});
	
	GetReadOnlyValueCallback.Type = new Type("GetReadOnlyValueCallback", GetReadOnlyValueCallback, [Delegate.Type]);
	return GetReadOnlyValueCallback;
});