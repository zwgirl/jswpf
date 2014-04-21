/**
 * from StyleHelper
 */

/**
 * DataTriggerRecord
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var DataTriggerRecord = declare("DataTriggerRecord", Object,{

	});
	
	Object.defineProperties(DataTriggerRecord.prototype,{
		Dependents:{
			get:function(){
				if(this._dependents == undefined){
					this._dependents = new FrugalStructList/*<ChildPropertyDependent>*/(); 
				}
				
				return this._dependents;
			}
		}
	});
	
	DataTriggerRecord.Type = new Type("DataTriggerRecord", DataTriggerRecord, [Object.Type]);
	return DataTriggerRecord;
});

//   // 
//    //  Each Binding that appears in a condition of a data trigger has
//    //  supporting information that appears in this record. 
//    //
//    internal class DataTriggerRecord
//    {
//        public FrugalStructList<ChildPropertyDependent> Dependents = new FrugalStructList<ChildPropertyDependent>(); 
//    }