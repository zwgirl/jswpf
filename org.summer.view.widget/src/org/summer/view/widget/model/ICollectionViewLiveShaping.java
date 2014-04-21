package org.summer.view.widget.model;

import org.summer.view.widget.collection.ObservableCollection;

public interface ICollectionViewLiveShaping{
	boolean CanChangeLiveFiltering { get; }
	boolean CanChangeLiveGrouping { get; }
	boolean CanChangeLiveSorting { get; }
	boolean IsLiveFiltering { get; set; }
	boolean IsLiveGrouping { get; set; }
	boolean IsLiveSorting { get; set; }
	ObservableCollection<String> LiveFilteringProperties { get; }
	ObservableCollection<String> LiveGroupingProperties { get; }
	ObservableCollection<String> LiveSortingProperties { get; }
}
