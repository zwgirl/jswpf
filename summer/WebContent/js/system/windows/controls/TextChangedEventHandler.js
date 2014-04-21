/**
 * TextChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var TextChangedEventHandler = declare("TextChangedEventHandler", Delegate,{
		constructor:function(){

		}
	});

	
	TextChangedEventHandler.Type = new Type("TextChangedEventHandler", TextChangedEventHandler, [Delegate.Type]);
	return TextChangedEventHandler;
});