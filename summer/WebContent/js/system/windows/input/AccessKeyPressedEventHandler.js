/**
 * AccessKeyPressedEventHandler
 */
/// <summary>
/// The delegate type for handling a FindScope event 
/// </summary>
define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var AccessKeyPressedEventHandler = declare("AccessKeyPressedEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	AccessKeyPressedEventHandler.Type = new Type("AccessKeyPressedEventHandler", AccessKeyPressedEventHandler, [Delegate.Type]);
	return AccessKeyPressedEventHandler;
}); 

//    public delegate void AccessKeyPressedEventHandler(object sender, AccessKeyPressedEventArgs e);