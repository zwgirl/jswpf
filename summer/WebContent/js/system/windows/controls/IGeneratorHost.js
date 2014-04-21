/**
 * IGeneratorHost
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IGeneratorHost = declare("IGeneratorHost", null,{
		
//		bool 
		IsItemItsOwnContainer:function(/*object*/ item){},
//		DependencyObject 
		GetContainerForItem:function(/*object*/ item){},
//		void 
		PrepareItemContainer:function(/*DependencyObject*/ container, /*object*/ item){},
//		void 
		ClearContainerForItem:function(/*DependencyObject*/ container, /*object*/ item){},
//		bool 
		IsHostForItemContainer:function(/*DependencyObject*/ container){},
//		GroupStyle 
		GetGroupStyle:function(/*CollectionViewGroup*/ group, /*int*/ level){},
//		void 
		SetIsGrouping:function(/*bool*/ isGrouping){}
	});
	
	Object.defineProperties(IGeneratorHost.prototype,{
//		ItemCollection 
		View:
		{
			get:function(){
				
			}
		},
//		int 
		AlternationCount:
		{
			get:function(){
				
			}
		}
	});
	
	IGeneratorHost.Type = new Type("IGeneratorHost", IGeneratorHost, [Object.Type], true);
	return IGeneratorHost;
});
