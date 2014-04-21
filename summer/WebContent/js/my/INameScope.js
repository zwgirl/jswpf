/**
 * INameScope
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var INameScope = declare(null,{

	});

	
	INameScope.Type = new Type("INameScope", INameScope, [Object.Type]);
	return INameScope;
});
