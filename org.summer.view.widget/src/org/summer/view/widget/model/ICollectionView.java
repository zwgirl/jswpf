package org.summer.view.widget.model;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.INotifyCollectionChanged;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.collection.ReadOnlyObservableCollection;

public interface ICollectionView extends IEnumerable, INotifyCollectionChanged
  {
    boolean CanFilter { get; }
    boolean CanGroup { get; }
    boolean CanSort { get; }
    CultureInfo Culture { get; set; }
    Object CurrentItem { get; }
    int CurrentPosition { get; }
    Predicate<Object> Filter {get; set; }
    ObservableCollection<GroupDescription> GroupDescriptions { get; }
    ReadOnlyObservableCollection<Object> Groups { get; }
    boolean IsCurrentAfterLast { get; }
    boolean IsCurrentBeforeFirst { get; }
    boolean IsEmpty { get; }
    SortDescriptionCollection SortDescriptions { get; }
    IEnumerable SourceCollection { get; }

    /*event*/ EventHandler CurrentChanged;
    /*event*/ CurrentChangingEventHandler CurrentChanging;

    boolean Contains (Object item);
    IDisposable DeferRefresh ();
    boolean MoveCurrentTo (Object item);
    boolean MoveCurrentToFirst ();
    boolean MoveCurrentToLast ();
    boolean MoveCurrentToNext ();
    boolean MoveCurrentToPosition (int position);
    boolean MoveCurrentToPrevious ();
    void Refresh ();
  }
