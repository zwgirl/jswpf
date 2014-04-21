/**
 * IndexerPropertyInfo
 */

define(["dojo/_base/declare", "system/Type", "reflection/PropertyInfo"], 
		function(declare, Type, PropertyInfo){
	var IndexerPropertyInfo = declare("IndexerPropertyInfo", PropertyInfo,{
		constructor:function(){
		}
	});


	Object.defineProperties(IndexerPropertyInfo.prototype,{
	  
	});
	
//	private static readonly IndexerPropertyInfo 
	var _instance = new IndexerPropertyInfo();
	Object.defineProperties(IndexerPropertyInfo,{
//		internal static IndexerPropertyInfo 
		Instance:
		{
			get:function()
			{
				return _instance;
			}
		}  
	});
	
	IndexerPropertyInfo.Type = new Type("IndexerPropertyInfo", IndexerPropertyInfo, [PropertyInfo.Type]);
	return IndexerPropertyInfo;
});


