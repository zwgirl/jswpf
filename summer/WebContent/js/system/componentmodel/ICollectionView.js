/**
 * ICollectionView
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerable", "specialized/INotifyCollectionChanged"], 
		function(declare, Type, IEnumerable, INotifyCollectionChanged){
	var ICollectionView = declare("ICollectionView", [IEnumerable, INotifyCollectionChanged],{
//		bool 
		Contains:function(/*object*/ item){},
//		void 
		Refresh:function(){},
//		IDisposable 
		DeferRefresh:function(){},
//		bool 
		MoveCurrentToFirst:function(){},
//		bool 
		MoveCurrentToLast:function(){},
//		bool 
		MoveCurrentToNext:function(){},
//		bool 
		MoveCurrentToPrevious:function(){},
//		bool 
		MoveCurrentTo:function(/*object*/ item){},
//		bool 
		MoveCurrentToPosition:function(/*int*/ position){}
	});
	
	Object.defineProperties(ICollectionView.prototype,{
//		CultureInfo 
		Culture:
		{
			get:function(){},
			set:function(value){}
		},
//		IEnumerable 
		SourceCollection:
		{
			get:function(){}
		},
		
//		Predicate<object> 
		Filter:
		{
			get:function(){},
			set:function(value){}
		},
//		bool 
		CanFilter:
		{
			get:function(){}
		},
//		SortDescriptionCollection 
		SortDescriptions:
		{
			get:function(){}
		},
//		bool 
		CanSort:
		{
			get:function(){}
		},
//		bool 
		CanGroup:
		{
			get:function(){}
		},
//		ObservableCollection<GroupDescription> 
		GroupDescriptions:
		{
			get:function(){}
		},
//		ReadOnlyObservableCollection<object> 
		Groups:
		{
			get:function(){}
		},
//		bool 
		IsEmpty:
		{
			get:function(){}
		},
//		object 
		CurrentItem:
		{
			get:function(){}
		},
//		int 
		CurrentPosition:
		{
			get:function(){}
		},
//		bool 
		IsCurrentAfterLast:
		{
			get:function(){}
		},
//		bool 
		IsCurrentBeforeFirst:
		{
			get:function(){}
		},
		
//		event CurrentChangingEventHandler 
		CurrentChanging:{
			
		},
//		event EventHandler 
		CurrentChanged:{
			
		}
	});
	
	ICollectionView.Type = new Type("ICollectionView", ICollectionView, [IEnumerable.Type, INotifyCollectionChanged.Type]);
	return ICollectionView;
});

//using System;
//using System.Collections;
//using System.Collections.ObjectModel;
//using System.Collections.Specialized;
//using System.Globalization;
//namespace System.ComponentModel
//{
//	public interface ICollectionView : IEnumerable, INotifyCollectionChanged
//	{
//		event CurrentChangingEventHandler CurrentChanging;
//		event EventHandler CurrentChanged;
//		CultureInfo Culture
//		{
//			get;
//			set;
//		}
//		IEnumerable SourceCollection
//		{
//			get;
//		}
//		Predicate<object> Filter
//		{
//			get;
//			set;
//		}
//		bool CanFilter
//		{
//			get;
//		}
//		SortDescriptionCollection SortDescriptions
//		{
//			get;
//		}
//		bool CanSort
//		{
//			get;
//		}
//		bool CanGroup
//		{
//			get;
//		}
//		ObservableCollection<GroupDescription> GroupDescriptions
//		{
//			get;
//		}
//		ReadOnlyObservableCollection<object> Groups
//		{
//			get;
//		}
//		bool IsEmpty
//		{
//			get;
//		}
//		object CurrentItem
//		{
//			get;
//		}
//		int CurrentPosition
//		{
//			get;
//		}
//		bool IsCurrentAfterLast
//		{
//			get;
//		}
//		bool IsCurrentBeforeFirst
//		{
//			get;
//		}
//		bool Contains(object item);
//		void Refresh();
//		IDisposable DeferRefresh();
//		bool MoveCurrentToFirst();
//		bool MoveCurrentToLast();
//		bool MoveCurrentToNext();
//		bool MoveCurrentToPrevious();
//		bool MoveCurrentTo(object item);
//		bool MoveCurrentToPosition(int position);
//	}
//}
