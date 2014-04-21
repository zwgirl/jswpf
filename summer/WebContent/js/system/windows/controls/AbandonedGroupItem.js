/**
 * AbandonedGroupItem
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var AbandonedGroupItem = declare("AbandonedGroupItem", null,{
		constructor:function(/*LiveShapingItem*/ lsi, /*CollectionViewGroupInternal*/ group)
        {
            this._lsi = lsi; 
            this._group = group;
        }
	});
	
	Object.defineProperties(AbandonedGroupItem.prototype,{
//        public LiveShapingItem 
        Item: { get:function() { return this._lsi; } },
//        public CollectionViewGroupInternal 
        Group: { get:function() { return this._group; } } 
	});
	
	AbandonedGroupItem.Type = new Type("AbandonedGroupItem", AbandonedGroupItem, [Object.Type]);
	return AbandonedGroupItem;
});
