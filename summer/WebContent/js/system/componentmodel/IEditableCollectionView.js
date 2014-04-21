/**
 * IEditableCollectionView
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IEditableCollectionView = declare("IEditableCollectionView", null,{
//		object 
		AddNew:function(){},
//		void 
		CommitNew:function(){},
//		void 
		CancelNew:function(){},
//		void 
		RemoveAt:function(/*int*/ index){},
//		void 
		Remove:function(/*object*/ item){},
//		void 
		EditItem:function(/*object*/ item){},
//		void 
		CommitEdit:function(){},
//		void 
		CancelEdit:function(){},
	});
	
	Object.defineProperties(IEditableCollectionView.prototype,{
		  
//		NewItemPlaceholderPosition 
		NewItemPlaceholderPosition:
		{
			get:function(){},
			set:function(value){}
		},
//		bool 
		CanAddNew:
		{
			get:function(){}
		},
//		bool 
		IsAddingNew:
		{
			get:function(){}
		},
//		object 
		CurrentAddItem:
		{
			get:function(){}
		},
//		bool 
		CanRemove:
		{
			get:function(){}
		},
//		bool 
		CanCancelEdit:
		{
			get:function(){}
		},
//		bool 
		IsEditingItem:
		{
			get:function(){}
		},
//		object 
		CurrentEditItem:
		{
			get:function(){}
		}
	});
	
	IEditableCollectionView.Type = new Type("IEditableCollectionView", IEditableCollectionView, [Object.Type]);
	return IEditableCollectionView;
});
