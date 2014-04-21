/**
 * IComparer
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerable"], 
		function(declare, Type, IEnumerable){
	var IComparer = declare("IComparer", Object, {
//		int 
		Compare:function(/*object*/ x, /*object*/ y){}
	});
	
	IComparer.Type = new Type("IComparer", IComparer, [Object.Type], true);
	return IComparer;
});	
