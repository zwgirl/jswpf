/**
 * RoutingStrategy
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var RoutingStrategy = declare("RoutingStrategy", null,{

	});
	
	RoutingStrategy.Tunnel = 0;
	RoutingStrategy.Bubble = 1;
	RoutingStrategy.Direct = 2;
	
//	LogicalOp.Type = new Type("LogicalOp", LogicalOp, [Object.Type]);
	return RoutingStrategy;
});
