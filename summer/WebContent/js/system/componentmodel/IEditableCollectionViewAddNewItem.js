/**
 * IEditableCollectionViewAddNewItem
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/IEditableCollectionView"], 
		function(declare, Type, IEditableCollectionView){
	var IEditableCollectionViewAddNewItem = declare("IEditableCollectionViewAddNewItem", IEditableCollectionView,{
//		object 
		AddNewItem:function(/*object*/ newItem){}
	});
	
	Object.defineProperties(IEditableCollectionViewAddNewItem.prototype,{
//		bool 
		CanAddNewItem:
		{
			get:function(){}
		}
	});
	
	IEditableCollectionViewAddNewItem.Type = new Type("IEditableCollectionViewAddNewItem", 
			IEditableCollectionViewAddNewItem, [IEditableCollectionView.Type]);
	return EntryIndex;
});
