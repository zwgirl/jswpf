/**
 * from StyleHelper
 */
/**
 * LogicalOp
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var LogicalOp = declare("LogicalOp", null,{

	});
	
	LogicalOp.Equals = 0;
	LogicalOp.NotEquals = 1;
	
//	LogicalOp.Type = new Type("LogicalOp", LogicalOp, [Object.Type]);
	return LogicalOp;
});

//   // 
//    //  Describes the logical operation to be used to test the
//    //  condition of a [Multi]Trigger 
//    // 
//    internal enum LogicalOp
//    { 
//        Equals,
//        NotEquals
//    }
 