package org.summer.view.widget.data;

import org.summer.view.widget.CollectionChangedEventManager;
import org.summer.view.widget.CollectionViewSource;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.INotifyCollectionChanged;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.IndexedEnumerable;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.model.ICollectionView;

/// <summary> 
    /// Holds an existing collection structure
    /// (e.g. ObservableCollection or DataSet) for use under a CompositeCollection. 
    /// </summary>
    public class CollectionContainer extends DependencyObject implements INotifyCollectionChanged, IWeakEventListener
    {
 
        //-----------------------------------------------------
        // 
        //  Dynamic properties and events 
        //
        //----------------------------------------------------- 

        /// <summary>
        /// Collection to be added into flattened ItemCollection
        /// </summary> 
        public static final DependencyProperty CollectionProperty =
                DependencyProperty.Register( 
                        "Collection", 
                        typeof(IEnumerable),
                        typeof(CollectionContainer), 
                        new FrameworkPropertyMetadata(new PropertyChangedCallback(OnCollectionChanged)));


        //------------------------------------------------------ 
        //
        //  Constructors 
        // 
        //-----------------------------------------------------
 
        static// CollectionContainer()
        {
        }
 
        //------------------------------------------------------
        // 
        //  Public Properties 
        //
        //------------------------------------------------------ 

//        #region Public Properties

        //ISSUE/[....]/030820 perf will potentially degrade if assigned collection 
        //                      is only IEnumerable, but will improve if it
        //                      implements ICollection (for Count property), or, 
        //                      better yet IList (for IndexOf and forward/backward enum using indexer) 
        /// <summary>
        /// Collection to be added into flattened ItemCollection. 
        /// </summary>
        public IEnumerable Collection
        {
            get { return (IEnumerable) GetValue(CollectionContainer.CollectionProperty); } 
            set { SetValue(CollectionContainer.CollectionProperty, value); }
        } 
 
        /// <summary>
        /// This method is used by TypeDescriptor to determine if this property should 
        /// be serialized.
        /// </summary>
//        [EditorBrowsable(EditorBrowsableState.Never)]
        public boolean ShouldSerializeCollection() 
        {
            if (Collection == null) 
            { 
                return false;
            } 

            // Try to see if there is an item in the Collection without
            // creating an enumerator.
            ICollection collection = Collection as ICollection; 
            if (collection != null && collection.Count == 0)
            { 
                return false; 
            }
 
            // If MoveNext returns true, then the enumerator is non-empty.
            IEnumerator enumerator = Collection.GetEnumerator();
            return enumerator.MoveNext();
        } 

//        #endregion Public Properties 
 
        //-----------------------------------------------------
        // 
        //  Internal Properties
        //
        //------------------------------------------------------
 
//        #region Internal Properties
 
        /*internal*/ public ICollectionView View 
        {
            get 
            {
                return _view;
            }
        } 

        /*internal*/ public int ViewCount 
        { 
            get
            { 
                if (View == null)
                    return 0;

                CollectionView cv = View as CollectionView; 
                if (cv != null)
                    return cv.Count; 
 
                ICollection coll = View as ICollection;
                if (coll != null) 
                    return coll.Count;

                // As a last resort, use the IList interface or IndexedEnumerable to find the count.
                if (ViewList != null) 
                    return ViewList.Count;
 
                return 0; 
            }
        } 

        /*internal*/ public boolean ViewIsEmpty
        {
            get 
            {
                if (View == null) 
                    return true; 

                ICollectionView cv = View as ICollectionView; 
                if (cv != null)
                    return cv.IsEmpty;

                ICollection coll = View as ICollection; 
                if (coll != null)
                    return (coll.Count == 0); 
 
                // As a last resort, use the IList interface or IndexedEnumerable to find the count.
                if (ViewList != null) 
                {
                    IndexedEnumerable le = ViewList as IndexedEnumerable;
                    if (le != null)
                        return le.IsEmpty; 
                    else
                        return (ViewList.Count == 0); 
                } 

                return true; 
            }
        }

//        #endregion Internal Properties 

        //----------------------------------------------------- 
        // 
        //  Internal Methods
        // 
        //-----------------------------------------------------

//        #region Internal Methods
 
        /*internal*/ public Object ViewItem(int index)
        { 
            Invariant.Assert(index >= 0 && View != null); 

            CollectionView cv = View as CollectionView; 
            if (cv != null)
            {
                return cv.GetItemAt(index);
            } 

            // As a last resort, use the IList interface or IndexedEnumerable to iterate to the nth item. 
            if (ViewList != null) 
                return ViewList[index];
 
            return null;
        }

        /*internal*/ public int ViewIndexOf(Object item) 
        {
            if (View == null) 
                return -1; 

            CollectionView cv = View as CollectionView; 
            if (cv != null)
            {
                return cv.IndexOf(item);
            } 

            // As a last resort, use the IList interface or IndexedEnumerable to look for the item. 
            if (ViewList != null) 
                return ViewList.IndexOf(item);
 
            return -1;
        }

//        #endregion Internal Methods 

//        #region INotifyCollectionChanged 
 
        /// <summary>
        /// Occurs when the contained collection changes 
        /// </summary>
        event NotifyCollectionChangedEventHandler INotifyCollectionChanged.CollectionChanged
        {
            add     { CollectionChanged += value; } 
            remove  { CollectionChanged -= value; }
        } 
 
        /// <summary>
        /// Occurs when the contained collection changes 
        /// </summary>
        protected /*virtual*/ event NotifyCollectionChangedEventHandler CollectionChanged;

        /// <summary> 
        /// Called when the contained collection changes
        /// </summary> 
        protected /*virtual*/ void OnContainedCollectionChanged(NotifyCollectionChangedEventArgs args) 
        {
            if (CollectionChanged != null) 
                CollectionChanged(this, args);
        }

//        #endregion INotifyCollectionChanged 

//        #region IWeakEventListener 
 
        /// <summary>
        /// Handle events from the centralized event table 
        /// </summary>
        boolean IWeakEventListener.ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
        {
            return ReceiveWeakEvent(managerType, sender, e); 
        }
 
        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary> 
        protected /*virtual*/ boolean ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
        {
            if (managerType == typeof(CollectionChangedEventManager))
            { 
                // forward the event to CompositeCollections that use this container
                OnContainedCollectionChanged((NotifyCollectionChangedEventArgs)e); 
            } 
            else
            { 
                return false;       // unrecognized event
            }

            return true; 
        }
 
//        #endregion IWeakEventListener 

        //----------------------------------------------------- 
        //
        //  Private Properties
        //
        //------------------------------------------------------ 

//        #region Private Properties 
 
        private IndexedEnumerable ViewList
        { 
            get
            {
                if (_viewList == null && View != null)
                { 
                    _viewList = new IndexedEnumerable(View);
                } 
                return _viewList; 
            }
        } 

//        #endregion

        //----------------------------------------------------- 
        //
        //  Private Methods 
        // 
        //------------------------------------------------------
 
//        #region Private Methods

        // called when value of CollectionProperty is required by property store
        private static Object OnGetCollection(DependencyObject d) 
        {
            return ((CollectionContainer) d).Collection; 
        } 

        // Called when CollectionProperty is changed on "d." 
        private static void OnCollectionChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            CollectionContainer cc = (CollectionContainer) d;
            cc.HookUpToCollection((IEnumerable) e.NewValue, true); 
        }
 
        // To prevent CollectionContainer memory leak: 
        // HookUpToCollection() is called to start listening to CV only when
        // the Container is being used by a CompositeCollectionView. 
        // When the last CCV stops using the container (or the CCV is GC'ed),
        // HookUpToCollection() is called to stop listening to its CV, so that
        // this container can be GC'ed if no one else is holding on to it.
 
        // unhook old collection/view and hook up new collection/view
        private void HookUpToCollection(IEnumerable newCollection, boolean shouldRaiseChangeEvent) 
        { 
            // clear cached helper
            _viewList = null; 

            // unhook from the old collection view
            if (View != null)
            { 
                CollectionChangedEventManager.RemoveListener(View, this);
 
                if (_traceLog != null) 
                    _traceLog.Add("Unsubscribe to CollectionChange from {0}",
                            TraceLog.IdFor(View)); 
            }

            // change to the new view
            if (newCollection != null) 
                _view = CollectionViewSource.GetDefaultCollectionView(newCollection, this);
            else 
                _view = null; 

            // hook up to the new collection view 
            if (View != null)
            {
                CollectionChangedEventManager.AddListener(View, this);
 
                if (_traceLog != null)
                    _traceLog.Add("Subscribe to CollectionChange from {0}", TraceLog.IdFor(View)); 
            } 

            if (shouldRaiseChangeEvent) // it's as if this were a refresh of the container's collection 
                OnContainedCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
        }

//        #endregion Private Methods 

        // this method is here just to avoid the compiler error 
        // error CS0649: Warning as Error: Field '..._traceLog' is never assigned to, and will always have its default value null 
        void InitializeTraceLog()
        { 
            _traceLog = new TraceLog(20);
        }

        //------------------------------------------------------ 
        //
        //  Private Fields 
        // 
        //-----------------------------------------------------
 
//        #region Private Fields

        private TraceLog        _traceLog;
        private ICollectionView _view; 
        private IndexedEnumerable _viewList;      // cache of list wrapper for view
 
//        #endregion Private Fields 
    }