/**
 * from StyleHelper
 */

/**
 * ChildRecord
 */
 // 
//  Stores a list of properties set via explicit SetValue or Triggers or 
//  Storyboards on a TemplateNode.
// 
//	internal struct
define(["dojo/_base/declare", "system/Type", "utility/ItemStructMap"], function(declare, Type, ItemStructMap){
	var ChildRecord = declare("ChildRecord", null,{
		constructor:function(){
			this._valueLookupListFromProperty = new ItemStructMap();
		}
	});
	
	Object.defineProperties(ChildRecord.prototype,{
		ValueLookupListFromProperty:
		{
			get:function(){
				return this._valueLookupListFromProperty;
			},
			set:function(value)
			{
				this._valueLookupListFromProperty = value;
			}
		}
	});
	
	ChildRecord.Type = new Type("ChildRecord", ChildRecord, [Object.Type]);
	return ChildRecord;
});

//// 
////  Stores a list of properties set via explicit SetValue or Triggers or 
////  Storyboards on a TemplateNode.
//// 
//internal struct ChildRecord
//{
//    public ItemStructMap<ItemStructList<ChildValueLookup>> ValueLookupListFromProperty;  // Indexed by DP.GlobalIndex
//} 
