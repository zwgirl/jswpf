/**
 * MapChangedHandler
 */

define(["dojo/_base/declare", "system/Type", "system/Delegate"], function(declare, Type, Delegate){
	var MapChangedHandler = declare("MapChangedHandler", Delegate,{
		constructor:function(target, method){
			
		}
	});

	MapChangedHandler.Type = new Type("MapChangedHandler", MapChangedHandler, [Delegate.Type]);
	return MapChangedHandler;
});
