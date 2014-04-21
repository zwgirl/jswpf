/**
 * ICollectionViewLiveShaping
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ICollectionViewLiveShaping = declare("EntryIndex", null,{
	});
	
	Object.defineProperties(ICollectionViewLiveShaping.prototype,{

//		bool 
		CanChangeLiveSorting:
		{
			get:function(){}
		},
//		bool 
		CanChangeLiveFiltering:
		{
			get:function(){}
		},
//		bool 
		CanChangeLiveGrouping:
		{
			get:function(){}
		},
//		bool? 
		IsLiveSorting:
		{
			get:function(){},
			set:function(value){}
		},
//		bool? 
		IsLiveFiltering:
		{
			get:function(){},
			set:function(value){}
		},
//		bool? 
		IsLiveGrouping:
		{
			get:function(){},
			set:function(value){}
		},
//		ObservableCollection<string> 
		LiveSortingProperties:
		{
			get:function(){}
		},
//		ObservableCollection<string> 
		LiveFilteringProperties:
		{
			get:function(){}
		},
//		ObservableCollection<string> 
		LiveGroupingProperties:
		{
			get:function(){}
		},
	});
	
	ICollectionViewLiveShaping.Type = new Type("ICollectionViewLiveShaping", ICollectionViewLiveShaping, [Object.Type]);
	return ICollectionViewLiveShaping;
});
