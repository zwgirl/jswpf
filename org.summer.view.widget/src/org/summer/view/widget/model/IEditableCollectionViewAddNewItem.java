package org.summer.view.widget.model;
public interface IEditableCollectionViewAddNewItem extends IEditableCollectionView
	{
		boolean CanAddNewItem { get; }
		Object AddNewItem (Object newItem);
	}