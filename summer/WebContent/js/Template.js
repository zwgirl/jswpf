/**
 * TabItem
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl"], 
		function(declare, Type, HeaderedContentControl){
	var TabItem = declare("TabItem", HeaderedContentControl,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(TabItem.prototype,{
		  
	});
	
	Object.defineProperties(TabItem,{
		  
	});
	
	TabItem.Type = new Type("TabItem", TabItem, [HeaderedContentControl.Type]);
	return TabItem;
});


