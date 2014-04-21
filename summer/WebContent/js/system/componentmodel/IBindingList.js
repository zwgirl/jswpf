/**
 * IBindingList
 */

define(["dojo/_base/declare", "system/Type",
        "collections/IList", "collections/ICollection", "collections/IEnumerable"], 
		function(declare, Type,
				IList, ICollection, IEnumerable){
	var IBindingList = declare("IBindingList", [IList, ICollection, IEnumerable],{
	});
	
	IBindingList.Type = new Type("IBindingList", IBindingList, [IList.Type, ICollection.Type, IEnumerable.Type]);
	return IBindingList;
});
//
//public interface IBindingList : IList, ICollection, IEnumerable
//	{
//		event ListChangedEventHandler ListChanged;
//		bool AllowNew
//		{
//			get;
//		}
//		bool AllowEdit
//		{
//			get;
//		}
//		bool AllowRemove
//		{
//			get;
//		}
//		bool SupportsChangeNotification
//		{
//			get;
//		}
//		bool SupportsSearching
//		{
//			get;
//		}
//		bool SupportsSorting
//		{
//			get;
//		}
//		bool IsSorted
//		{
//			get;
//		}
//		PropertyDescriptor SortProperty
//		{
//			get;
//		}
//		ListSortDirection SortDirection
//		{
//			get;
//		}
//		object AddNew();
//		void AddIndex(PropertyDescriptor property);
//		void ApplySort(PropertyDescriptor property, ListSortDirection direction);
//		int Find(PropertyDescriptor property, object key);
//		void RemoveIndex(PropertyDescriptor property);
//		void RemoveSort();
//	}