package org.summer.view.widget.model;

import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IList;

/// <summary>
	/// Provides the features required to support both complex and simple scenarios when binding to a data source.
	/// </summary>
	public interface IBindingList extends IList, ICollection, IEnumerable
	{
		void AddIndex (PropertyDescriptor property);

		Object AddNew ();

		void ApplySort (PropertyDescriptor property, ListSortDirection direction);

		int Find (PropertyDescriptor property, Object key);

		void RemoveIndex (PropertyDescriptor property);

		void RemoveSort ();

		boolean AllowEdit {
			get;
		}

		boolean AllowNew {
			get;
		}

		boolean AllowRemove {
			get;
		}

		boolean IsSorted {
			get;
		}

		ListSortDirection SortDirection {
			get;
		}

		PropertyDescriptor SortProperty {
			get;
		}

		boolean SupportsChangeNotification {
			get;
		}

		boolean SupportsSearching {
			get;
		}

		boolean SupportsSorting {
			get;
		}

		/*event*/ ListChangedEventHandler ListChanged;
	}