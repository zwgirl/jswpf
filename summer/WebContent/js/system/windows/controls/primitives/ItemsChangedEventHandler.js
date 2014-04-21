/**
 * from ItemsChangedEventArgs
 * ItemsChangedEventHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var ItemsChangedEventHandler = declare("ItemsChangedEventHandler", Delegate,{
		constructor:function(target, method){
			
		}
	});

	ItemsChangedEventHandler.Type = new Type("ItemsChangedEventHandler", ItemsChangedEventHandler, [Delegate.Type]);
	return ItemsChangedEventHandler;
});
