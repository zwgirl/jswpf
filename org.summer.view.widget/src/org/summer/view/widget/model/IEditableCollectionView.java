package org.summer.view.widget.model;
public interface IEditableCollectionView {
		void EditItem (Object item);
		Object AddNew ();

		void CancelEdit ();
		void CancelNew ();

		void CommitEdit ();
		void CommitNew ();

		void Remove (Object item);
		void RemoveAt (int index);

		Object CurrentAddItem { get; }
		Object CurrentEditItem { get; }

		boolean CanAddNew { get; }
		boolean CanCancelEdit { get; }
		boolean CanRemove { get; }

		boolean IsAddingNew { get; }
		boolean IsEditingItem { get; }

		NewItemPlaceholderPosition NewItemPlaceholderPosition { get; set; }
	}