/**
 * from StyleHelper
 */

/**
 * InstanceStyleData
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var InstanceStyleData = declare("InstanceStyleData", null,{

	});
	
	InstanceStyleData.InstanceValues = 0;
	InstanceStyleData.ArraySize = 1;
	
	InstanceStyleData.Type = new Type("InstanceStyleData", InstanceStyleData, [Object.Type]);
	
	return InstanceStyleData;
});

//    //
//    //  This enum is used to designate different types of per-instance 
//    //  style data that we use at run-time 
//    //
//    internal enum InstanceStyleData 
//    {
//        InstanceValues,
//        ArraySize // Keep this one last - used to allocate size of array in dataField
//    } 