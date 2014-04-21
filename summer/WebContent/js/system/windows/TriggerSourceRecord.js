/**
 * from StyleHelper
 */
/**
 * TriggerSourceRecord
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var TriggerSourceRecord = declare("TriggerSourceRecord", Object,{
		constructor:function(){
			this._childPropertyDependents = new FrugalStructList();
		}
	});
	
	Object.defineProperties(TriggerSourceRecord.prototype,{
//		public FrugalStructList<ChildPropertyDependent> 
		ChildPropertyDependents:
		{
			get:function(){
				return this._childPropertyDependents;
			},
			set:function(value){
				this._childPropertyDependents = value;
			}
		}
	});
	
	TriggerSourceRecord.Type = new Type("TriggerSourceRecord", TriggerSourceRecord, [Object.Type]);
	return TriggerSourceRecord;
});

//    // 
//    //  Stores a list of all those properties that need to be invalidated whenever 
//    //  a trigger driver property is invalidated on the source node.
//    // 
//    internal struct TriggerSourceRecord
//    {
//        public FrugalStructList<ChildPropertyDependent> ChildPropertyDependents;
//    } 