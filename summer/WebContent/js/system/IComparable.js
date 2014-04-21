/**
 * IComparable
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IComparable = declare("IComparable", null,{
	});
	
	IComparable.Type = new Type("IComparable", IComparable, [Object.Type], true);
	return IComparable;
});
//public interface IComparable
//	{
//		int CompareTo(object obj);
//	}