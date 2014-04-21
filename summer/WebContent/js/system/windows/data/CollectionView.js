/**
 * Second check 12-08
 * CollectionView
 */

define(["dojo/_base/declare", "system/Type", "collections/IEnumerator", "threading/DispatcherObject", "specialized/INotifyCollectionChanged",
        "internal.data/DataBindEngine", "componentmodel/ICollectionView", "componentmodel/INotifyPropertyChanged",
        "data/BindingOperations", "collections/ArrayList", "system/IDisposable", "componentmodel/CurrentChangingEventArgs"], 
		function(declare, Type, IEnumerator, DispatcherObject, INotifyCollectionChanged,
				DataBindEngine, ICollectionView, INotifyPropertyChanged,
				BindingOperations, ArrayList, IDisposable, CurrentChangingEventArgs){
	
//    [Flags] 
//    private enum 
    var CollectionViewFlags = declare("CollectionViewFlags", Object, {});
	CollectionViewFlags.UpdatedOutsideDispatcher        =   0x2;
	CollectionViewFlags.ShouldProcessCollectionChanged  =   0x4;
	CollectionViewFlags.IsCurrentBeforeFirst            =   0x8;
	CollectionViewFlags.IsCurrentAfterLast              =   0x10; 
	CollectionViewFlags.IsDynamic                       =   0x20;
	CollectionViewFlags.IsDataInGroupOrder              =   0x40; 
	CollectionViewFlags.NeedsRefresh                    =   0x80; 
	CollectionViewFlags.AllowsCrossThreadChanges        =   0x100;
	CollectionViewFlags.CachedIsEmpty                   =   0x200; 
    
	
	var Position = declare("Position", Object, {});
	Position.BeforePlaceholder = 0; 
	Position.OnPlaceholder = 1; 
	Position.OnNewItem = 2; 
	Position.AfterPlaceholder = 3;
	
//	internal class 
	var PlaceholderAwareEnumerator = declare("PlaceholderAwareEnumerator", IEnumerator, {
		constructor:function(/*CollectionView*/ collectionView, /*IEnumerator*/ baseEnumerator, 
				/*NewItemPlaceholderPosition*/ placeholderPosition, /*object*/ newItem)
        {
            this._collectionView = collectionView;
            this._timestamp = collectionView.Timestamp; 
            this._baseEnumerator = baseEnumerator;
            this._placeholderPosition = placeholderPosition; 
            this._newItem = newItem; 
			
		},
		
//	    public bool 
	    MoveNext:function()
        {
            if (this._timestamp != this._collectionView.Timestamp)
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 

            switch (this._position) 
            { 
                case Position.BeforePlaceholder:
                    // AtBeginning - move to the placeholder 
                    if (this._placeholderPosition == NewItemPlaceholderPosition.AtBeginning)
                    {
                    	this._position = Position.OnPlaceholder;
                    } 
                    // None or AtEnd - advance base, skipping the new item
                    else if (this._baseEnumerator.MoveNext() && 
                                (this._newItem == CollectionView.NoNewItem || this._baseEnumerator.Current != this._newItem 
                                        || this._baseEnumerator.MoveNext()))
                    { 
                    }
                    // if base has reached the end, move to new item or placeholder
                    else if (this._newItem != CollectionView.NoNewItem)
                    { 
                    	this._position = Position.OnNewItem;
                    } 
                    else if (this._placeholderPosition == NewItemPlaceholderPosition.None) 
                    {
                        return false; 
                    }
                    else
                    {
                    	this._position = Position.OnPlaceholder; 
                    }
                    return true; 

                case Position.OnPlaceholder:
                    // AtBeginning - move from placeholder to new item (if present) 
                    if (this._newItem != CollectionView.NoNewItem && this._placeholderPosition == NewItemPlaceholderPosition.AtBeginning)
                    {
                    	this._position = Position.OnNewItem;
                        return true; 
                    }
                    break; 

                case Position.OnNewItem:
                    // AtEnd - move from new item to placeholder 
                    if (this._placeholderPosition == NewItemPlaceholderPosition.AtEnd)
                    {
                    	this._position = Position.OnPlaceholder;
                        return true; 
                    }
                    break; 
            } 

            // in all other cases, simply advance base, skipping the new item 
            this._position = Position.AfterPlaceholder;
            return (this._baseEnumerator.MoveNext() &&
                        (this._newItem == CollectionView.NoNewItem || this._baseEnumerator.Current != this._newItem
                                        || this._baseEnumerator.MoveNext())); 
        },
        
//        public void 
        Reset:function()
        { 
        	this._position = Position.BeforePlaceholder;
        	this._baseEnumerator.Reset();
        }
	});
	
	Object.defineProperties(PlaceholderAwareEnumerator.prototype, {
//        public object 
        Current: 
        {
            get:function()
            {
                return  (this._position == Position.OnPlaceholder) ? CollectionView.NewItemPlaceholder
                    :   (this._position == Position.OnNewItem)   ?   this._newItem
                    :                                           this._baseEnumerator.Current; 
            }
        }
	});
	
    var DeferHelper = declare("DeferHelper", IDisposable, {
    	constructor:function(/*CollectionView*/ collectionView) 
        {
            this._collectionView = collectionView;
        },
        
//        public void 
        Dispose:function()
        { 
            if (this._collectionView != null) 
            {
            	this._collectionView.EndDefer(); 
            	this._collectionView = null;
            }

//            GC.SuppressFinalize(this); 
        }
    });
    
    DeferHelper.Type = new Type("DeferHelper", DeferHelper, [IDisposable.Type]);

//    // this class helps prevent reentrant calls
//    private class SimpleMonitor : IDisposable
//    { 
//        public bool Enter()
//        { 
//            if (_entered) 
//                return false;
//
//            _entered = true;
//            return true;
//        }
//
//        public void Dispose()
//        { 
//            _entered = false; 
//            GC.SuppressFinalize(this);
//        } 
//
//        public bool Busy { get { return _entered; } }
//
//        bool _entered; 
//    }

    var BindingListCollectionView = null;
    function EnsureBindingListCollectionView(){
    	if(BindingListCollectionView == null){
    		BindingListCollectionView = using("data/BindingListCollectionView");
    	}
    	
    	return BindingListCollectionView;
    }
    
	
	var CollectionView = declare("CollectionView", [DispatcherObject, ICollectionView, INotifyPropertyChanged], {
		constructor:function(collection, second){
//	        ArrayList               
	        this._changeLog = new ArrayList(); 
//	        ArrayList               
	        this._tempChangeLog = CollectionView.EmptyArrayList;
//	        DataBindOperation       
	        this._databindOperation = null; 
//	        object                  
	        this._vmData = null;            // view manager's private data 
//	        IEnumerable             
	        this._sourceCollection = null;  // the underlying collection
//	        CultureInfo             
	        this._culture = null;           // culture to use when sorting 
//	        int                     
	        this._deferLevel = 0;
//	        IndexedEnumerable       
	        this._enumerableWrapper = null;
//	        Predicate<object>       
	        this._filter = null; 
//	        object                  
	        this._currentItem = null;
//	        int                     
	        this._currentPosition = 0; 
//	        CollectionViewFlags     
	        this._flags = CollectionViewFlags.ShouldProcessCollectionChanged | 
	                                        CollectionViewFlags.NeedsRefresh;
//	        bool                    
	        this._currentElementWasRemovedOrReplaced; 

//	        DataBindEngine          
	        this._engine = null;
//	        int                     
	        this._timestamp = 0; 
			
			if(arguments.length == 1){
				this.initialize(collection, 0);
			}else{
				if(typeof second == 'boolean'){
					this.SetFlag(CollectionViewFlags.ShouldProcessCollectionChanged, second/*shouldProcessCollectionChanged*/);
				}
				this.initialize(collection, 0);
			}
		},

//        internal CollectionView
        initialize:function(/*IEnumerable*/ collection, /*int*/ moveToFirst) 
        {
            if (collection == null)
                throw new ArgumentNullException("collection");
 
            // Constructing a CollectionView itself (as opposed to a derived class)
            // is deprecated in NetFx3.5.  This used to use IndexedEnumerable to 
            // support a view over a plain IEnumerable, but this scenario is now 
            // supported by the EnumerableCollectionView derived class.  Internal
            // code does not create a CollectionView, but it is still 
            // possible for an app to call "new CollectionView(myCollection)"
            // directly;  this is public API that we cannot remove.  Such an app
            // will continue to get the old behavior with IndexedEnumerable, bugs
            // and all.  As a courtesy, we detect this here and warn the user about 
            // it through the tracing channel.
            if (this.GetType() == CollectionView.Type) 
            { 
            } 

            this._engine = DataBindEngine.CurrentDataBindEngine; 
 
            if (!this._engine.IsShutDown)
            { 
//                /*SynchronizationInfo*/var syncInfo = this._engine.ViewManager.GetSynchronizationInfo(collection);
//                this.SetFlag(CollectionViewFlags.AllowsCrossThreadChanges, syncInfo.IsSynchronized);
            }
            else 
            {
                // WPF doesn't really support doing anything on a thread whose dispatcher 
                // has been shut down.  But for app-compat we should limp along 
                // as well as we did in 4.0.  This means avoiding anything that
                // touches the ViewManager. 
                moveToFirst = -1;
            }

            this._sourceCollection = collection; 

            // forward collection change events from underlying collection to our listeners. 
//            INotifyCollectionChanged
            var incc = collection.isInstanceOf(INotifyCollectionChanged) ? collection : null; 
            if (incc != null)
            { 
                // BindingListCollectionView already listens to IBindingList.ListChanged;
                // Don't double-subscribe (bug 452474, 607512)
                /*IBindingList*/var ibl;
                if (!(this instanceof EnsureBindingListCollectionView()) || 
                    ((ibl = collection instanceof IBindingList ? collection : null) != null && !ibl.SupportsChangeNotification))
                { 
                    incc.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnCollectionChanged)); 
                }
                this.SetFlag(CollectionViewFlags.IsDynamic, true); 
            }

            // set currency to the first item if available
            /*object*/var currentItem = null; 
            var currentPosition = -1;
            if (moveToFirst >= 0) 
            { 
//                BindingOperations.AccessCollection(collection,
//                    function() 
//                    {
//                        /*IEnumerator*/var e = collection.GetEnumerator();
//                        if (e.MoveNext())
//                        { 
//                            currentItem = e.Current;
//                            currentPosition = 0; 
//                        } 
//                        
//                        var d = e instanceof IDisposable ? e : null; 
//                        if (d != null)
//                        {
//                            d.Dispose();
//                        } 
//                    },
//                    false); 
            	
//            	function() 
//                {
                    /*IEnumerator*/var e = collection.GetEnumerator();
                    if (e.MoveNext())
                    { 
                        currentItem = e.Current;
                        currentPosition = 0; 
                    } 
                    
                    var d = e instanceof IDisposable ? e : null; 
                    if (d != null)
                    {
                        d.Dispose();
                    } 
//                }
            } 

            this._currentItem = currentItem; 
            this._currentPosition = currentPosition;
            this.SetFlag(CollectionViewFlags.IsCurrentBeforeFirst,  this._currentPosition < 0);
            this.SetFlag(CollectionViewFlags.IsCurrentAfterLast,  this._currentPosition < 0);
            this.SetFlag(CollectionViewFlags.CachedIsEmpty, this._currentPosition < 0); 
        },
        
        /// <summary> 
        /// Return true if the item belongs to this view.  No assumptions are
        /// made about the item. This method will behave similarly to IList.Contains().
        /// </summary>
        /// <remarks> 
        /// <p>If the caller knows that the item belongs to the
        /// underlying collection, it is more efficient to call PassesFilter. 
        /// If the underlying collection is only of type IEnumerable, this method 
        /// is a O(N) operation</p>
        /// </remarks> 
//        public virtual bool 
        Contains:function(/*object*/ item)
        {
        	this.VerifyRefreshNotDeferred();
 
            return (this.IndexOf(item) >= 0);
        },

        /// <summary>
        /// Re-create the view, using any <seealso cref="SortDescriptions"/> and/or <seealso cref="Filter"/>. 
        /// </summary>
//        public virtual void 
        Refresh:function() 
        { 
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null;
            if (ecv != null && (ecv.IsAddingNew || ecv.IsEditingItem)) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Refresh"));

            this.RefreshInternal();
        }, 

//        internal void 
        RefreshInternal:function() 
        { 
        	this.RefreshOverride();

        	this.SetFlag(CollectionViewFlags.NeedsRefresh, false); 
        },
 
        /// <summary> 
        /// Enter a Defer Cycle.
        /// Defer cycles are used to coalesce changes to the ICollectionView. 
        /// </summary>
//        public virtual IDisposable 
        DeferRefresh:function()
        {
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null; 
            if (ecv != null && (ecv.IsAddingNew || ecv.IsEditingItem))
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "DeferRefresh")); 

            ++ this._deferLevel;
            return new DeferHelper(this);
        }, 

        /// <summary>
        /// Move <seealso cref="CurrentItem"/> to the first item. 
        /// </summary>
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns> 
//        public virtual bool 
        MoveCurrentToFirst:function() 
        {
        	this.VerifyRefreshNotDeferred(); 

            var index = 0;
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null;
            if (ecv != null && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) 
            {
                index = 1; 
            } 

            return this.MoveCurrentToPosition(index); 
        },

        /// <summary>
        /// Move <seealso cref="CurrentItem"/> to the last item. 
        /// </summary>
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns> 
//        public virtual bool 
        MoveCurrentToLast:function() 
        {
        	this.VerifyRefreshNotDeferred(); 

            var index = this.Count - 1;
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null;
            if (ecv != null && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd) 
            {
                index -= 1; 
            } 

            return this.MoveCurrentToPosition(index); 
        },

        /// <summary>
        /// Move <seealso cref="CurrentItem"/> to the next item. 
        /// </summary>
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns> 
//        public virtual bool 
        MoveCurrentToNext:function() 
        {
        	this.VerifyRefreshNotDeferred(); 

            var index = this.CurrentPosition + 1;
            var count = this.Count;
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null; 

            if (ecv != null && index == 0 && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) 
            { 
                index = 1;
            } 
            if (ecv != null && index == count-1 && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd)
            {
                index = count;
            } 

            if (index <= count) 
            { 
                return this.MoveCurrentToPosition(index);
            } 
            else
            {
                return false;
            } 
        },
 
        /// <summary> 
        /// Move <seealso cref="CurrentItem"/> to the previous item.
        /// </summary> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public virtual bool 
        MoveCurrentToPrevious:function()
        {
        	this.VerifyRefreshNotDeferred(); 

            var index = this.CurrentPosition - 1; 
            var count = this.Count; 
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null;
 
            if (ecv != null && index == count-1 && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd)
            {
                index = count-2;
            } 
            if (ecv != null && index == 0 && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
            { 
                index = -1; 
            }
 
            if (index >= -1)
            {
                return this.MoveCurrentToPosition(index);
            } 
            else
            { 
                return false; 
            }
        }, 

        /// <summary>
        /// Move <seealso cref="CurrentItem"/> to the given item.
        /// If the item is not found, move to BeforeFirst. 
        /// </summary>
        /// <param name="item">Move CurrentItem to this item.</param> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns> 
//        public virtual bool 
        MoveCurrentTo:function(/*object*/ item)
        { 
        	this.VerifyRefreshNotDeferred();

            // if already on item, or item is the placeholder, don't do anything
            if (Object.Equals(this.CurrentItem, item) || Object.Equals(this.NewItemPlaceholder, item)) 
            {
                // also check that we're not fooled by a false null _currentItem 
                if (item != null || this.IsCurrentInView) 
                    return this.IsCurrentInView;
            } 

            var index = -1;
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null;
            var isNewItem = (ecv != null && ecv.IsAddingNew && Object.Equals(item, ecv.CurrentAddItem)); 
            if (isNewItem || this.PassesFilter(item))
            { 
                // if the item is not found IndexOf() will return -1, and 
                // the MoveCurrentToPosition() below will move current to BeforeFirst
                index = this.IndexOf(item); 
            }

            return this.MoveCurrentToPosition(index);
        }, 

        /// <summary> 
        /// Move <seealso cref="CurrentItem"/> to the item at the given index. 
        /// </summary>
        /// <param name="position">Move CurrentItem to this index</param> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public virtual bool 
        MoveCurrentToPosition:function(/*int*/ position)
        {
        	this.VerifyRefreshNotDeferred(); 

            if (position < -1 || position > this.Count) 
                throw new ArgumentOutOfRangeException("position"); 

            // ignore request to move onto the placeholder 
            /*IEditableCollectionView*/var ecv = this instanceof IEditableCollectionView ? this : null;
            if (ecv != null &&
                    ((position == 0 && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ||
                     (position == this.Count-1 && ecv.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd))) 
            {
                return this.IsCurrentInView; 
            } 

            if ((position != this.CurrentPosition || !this.IsCurrentInSync) 
                && this.OKToChangeCurrent())
            {
                var oldIsCurrentAfterLast = this.IsCurrentAfterLast;
                var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst; 

                this._MoveCurrentToPosition(position); 
                this.OnCurrentChanged(); 

                if (this.IsCurrentAfterLast != oldIsCurrentAfterLast) 
                	this.OnPropertyChanged(CollectionView.IsCurrentAfterLastPropertyName);

                if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
                	this.OnPropertyChanged(CollectionView.IsCurrentBeforeFirstPropertyName); 

                this.OnPropertyChanged(CollectionView.CurrentPositionPropertyName); 
                this.OnPropertyChanged(CollectionView.CurrentItemPropertyName); 
            }
 
            return this.IsCurrentInView;
        },

        /// <summary>
        /// Return true if the item belongs to this view.  The item is assumed to belong to the
        /// underlying DataCollection;  this method merely takes filters into account. 
        /// It is commonly used during collection-changed notifications to determine if the added/removed
        /// item requires processing. 
        /// Returns true if no filter is set on collection view. 
        /// </summary>
//        public virtual bool 
        PassesFilter:function(/*object*/ item) 
        {
            if (this.CanFilter && this.Filter != null)
                return this.Filter(item);
 
            return true;
        }, 
 
        /// <summary> Return the index where the given item belongs, or -1 if this index is unknown.
        /// </summary> 
        /// <remarks>
        /// If this method returns an index other than -1, it must always be true that
        /// view[index-1] &lt; item &lt;= view[index], where the comparisons are done via
        /// the view's IComparer.Compare method (if any). 
        /// (This method is used by a listener's (e.g. System.Windows.Controls.ItemsControl)
        /// CollectionChanged event handler to speed up its reaction to insertion and deletion of items. 
        /// If IndexOf is  not implemented, a listener does a binary search using IComparer.Compare.) 
        /// </remarks>
        /// <param name="item">data item</param> 
//        public virtual int 
        IndexOf:function(/*object*/ item)
        {
        	this.VerifyRefreshNotDeferred();
 
            return this.EnumerableWrapper.IndexOf(item);
        }, 
 
        /// <summary>
        /// Retrieve item at the given zero-based index in this CollectionView. 
        /// </summary>
        /// <remarks>
        /// <p>The index is evaluated with any SortDescriptions or Filter being set on this CollectionView.
        /// If the underlying collection is only of type IEnumerable, this method 
        /// is a O(N) operation.</p>
        /// <p>When deriving from CollectionView, override this method to provide 
        /// a more efficient implementation.</p> 
        /// </remarks>
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// Thrown if index is out of range
        /// </exception>
//        public virtual object 
        GetItemAt:function(/*int*/ index)
        { 
            // only check lower bound because Count could be expensive
            if (index < 0) 
                throw new ArgumentOutOfRangeException("index"); 

            return this.EnumerableWrapper.Get(index); 
        },

        /// <summary>
        /// Detach from the source collection.  (I.e. stop listening to the collection's 
        /// events, or anything else that makes the CollectionView ineligible for
        /// garbage collection.) 
        /// </summary> 
//        public virtual void 
        DetachFromSourceCollection:function()
        { 
            /*INotifyCollectionChanged*/
        	var incc = this._sourceCollection instanceof INotifyCollectionChanged ? this._sourceCollection : null;
            if (incc != null)
            {
                /*IBindingList*/var ibl; 
                if (!(this instanceof EnsureBindingListCollectionView()) ||
                    ((ibl = this._sourceCollection instanceof IBindingList ? this._sourceCollection : null) != null 
                    		&& !ibl.SupportsChangeNotification)) 
                { 
                    incc.CollectionChanged.Remove(new NotifyCollectionChangedEventHandler(this, this.OnCollectionChanged));
                } 
            }

            this._sourceCollection = null;
        },

        /// <summary>
        /// Re-create the view, using any <seealso cref="SortDescriptions"/> and/or <seealso cref="Filter"/>.
        /// </summary>
//        protected virtual void 
        RefreshOverride:function() 
        {
            if (this.SortDescriptions.Count > 0) 
                throw new InvalidOperationException(SR.Get(SRID.ImplementOtherMembersWithSort, "Refresh()")); 

            var oldCurrentItem = this._currentItem; 
            var oldIsCurrentAfterLast = this.CheckFlag(CollectionViewFlags.IsCurrentAfterLast);
            var oldIsCurrentBeforeFirst = this.CheckFlag(CollectionViewFlags.IsCurrentBeforeFirst);
            var oldCurrentPosition = this._currentPosition;
 
            // force currency off the collection (gives user a chance to save dirty information)
            this.OnCurrentChanging(); 
 
            this.InvalidateEnumerableWrapper();
 
            if (this.IsEmpty || oldIsCurrentBeforeFirst)
            {
            	this._MoveCurrentToPosition(-1);
            } 
            else if (oldIsCurrentAfterLast)
            { 
            	this._MoveCurrentToPosition(this.Count); 
            }
            else if (oldCurrentItem != null) // set currency back to old current item, or first if not found 
            {
                var index = this.EnumerableWrapper.IndexOf(oldCurrentItem);
                if (index  < 0)
                { 
                    index  = 0;
                } 
                this._MoveCurrentToPosition(index); 
            }
 

            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithA(NotifyCollectionChangedAction.Reset));
            this.OnCurrentChanged();
 
            if (this.IsCurrentAfterLast != oldIsCurrentAfterLast)
            	this.OnPropertyChanged(CollectionView.IsCurrentAfterLastPropertyName); 
 
            if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
            	this.OnPropertyChanged(CollectionView.IsCurrentBeforeFirstPropertyName); 

            if (oldCurrentPosition != this.CurrentPosition)
            	this.OnPropertyChanged(CollectionView.CurrentPositionPropertyName);
 
            if (oldCurrentItem != this.CurrentItem)
            	this.OnPropertyChanged(CollectionView.CurrentItemPropertyName); 
        }, 

        /// <summary> 
        /// Returns an object that enumerates the items in this view.
        /// </summary>
//        protected virtual IEnumerator 
        GetEnumerator:function()
        { 
        	this.VerifyRefreshNotDeferred();
 
            if (this.SortDescriptions.Count > 0) 
                throw new InvalidOperationException(SR.Get(SRID.ImplementOtherMembersWithSort, "GetEnumerator()"));
 
            return this.EnumerableWrapper.GetEnumerator();
        },

 
//        /// <summary>
//        ///     Notify listeners that this View has changed 
//        /// </summary> 
//        /// <remarks>
//        ///     CollectionViews (and sub-classes) should take their filter/sort/grouping 
//        ///     into account before calling this method to forward CollectionChanged events.
//        /// </remarks>
//        /// <param name="args">
//        ///     The NotifyCollectionChangedEventArgs to be passed to the EventHandler 
//        /// </param>
////        protected virtual void 
//        OnCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args) 
//        { 
//        	
//            if (args == null)
//                throw new ArgumentNullException("args"); 
//
//            ++ this._timestamp;
//
//            if (this.CollectionChanged != null) 
//            	this.CollectionChanged.Invoke(this, args);
// 
//            // Collection changes change the count unless an item is being 
//            // replaced or moved within the collection.
//            if (args.Action != NotifyCollectionChangedAction.Replace && 
//                args.Action != NotifyCollectionChangedAction.Move)
//            {
//            	this.OnPropertyChanged(CountPropertyName);
//            } 
//
//            var isEmpty = this.IsEmpty; 
//            if (isEmpty != this.CheckFlag(CollectionViewFlags.CachedIsEmpty)) 
//            {
//            	this.SetFlag(CollectionViewFlags.CachedIsEmpty, isEmpty); 
//            	this.OnPropertyChanged(this.IsEmptyPropertyName);
//            }
//        },
//        
//        ///<summary>
//        ///     Handle CollectionChanged events.
//        /// 
//        ///     Calls ProcessCollectionChanged() or
//        ///     posts the change to the Dispatcher to process on the correct thread. 
//        ///</summary> 
//        /// <remarks>
//        ///     User should override <see cref="ProcessCollectionChanged"/> 
//        /// </remarks>
//        /// <param name="sender">
//        /// </param>
//        /// <param name="args"> 
//        /// </param>
////        protected void 
//        OnCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ args) 
//        { 
//        	if(arguments.length == 1){
//        		
//        	}
//            if (this.CheckFlag(CollectionViewFlags.ShouldProcessCollectionChanged))
//            { 
//                if (!this.AllowsCrossThreadChanges)
//                {
//                    if (!this.CheckAccess())
//                        throw new NotSupportedException(SR.Get(SRID.MultiThreadedCollectionChangeNotSupported)); 
//                    this.ProcessCollectionChanged(args);
//                } 
//                else 
//                {
//                	this.PostChange(args); 
//                }
//            }
//        },
        
        OnCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ args) 
        { 
        	if(arguments.length == 1){
        		args = sender;
        		if (args == null)
                    throw new ArgumentNullException("args"); 

                ++ this._timestamp;

                if (this.CollectionChanged != null) 
                	this.CollectionChanged.Invoke(this, args);
     
                // Collection changes change the count unless an item is being 
                // replaced or moved within the collection.
                if (args.Action != NotifyCollectionChangedAction.Replace && 
                    args.Action != NotifyCollectionChangedAction.Move)
                {
                	this.OnPropertyChanged(CollectionView.CountPropertyName);
                } 

                var isEmpty = this.IsEmpty; 
                if (isEmpty != this.CheckFlag(CollectionViewFlags.CachedIsEmpty)) 
                {
                	this.SetFlag(CollectionViewFlags.CachedIsEmpty, isEmpty); 
                	this.OnPropertyChanged(CollectionView.IsEmptyPropertyName);
                }
        	}else{
                if (this.CheckFlag(CollectionViewFlags.ShouldProcessCollectionChanged))
                { 
                    if (!this.AllowsCrossThreadChanges)
                    {
                        if (!this.CheckAccess())
                            throw new NotSupportedException(SR.Get(SRID.MultiThreadedCollectionChangeNotSupported)); 
                        this.ProcessCollectionChanged(args);
                    } 
                    else 
                    {
                    	this.PostChange(args); 
                    }
                }
        	}
        },
 
        /// <summary>
        /// set CurrentItem and CurrentPosition, no questions asked! 
        /// </summary> 
        /// <remarks>
        /// CollectionViews (and sub-classes) should use this method to update 
        /// the Current__ values.
        /// </remarks>
//        protected void 
//        SetCurrent:function(/*object*/ newItem, /*int*/ newPosition)
//        { 
//            var count = (newItem != null) ? 0 : this.IsEmpty ? 0 : this.Count;
//            this.SetCurrent(newItem, newPosition, count); 
//        }, 

        /// <summary> 
        /// set CurrentItem and CurrentPosition, no questions asked!
        /// </summary>
        /// <remarks>
        /// This method can be called from a constructor - it does not call 
        /// any virtuals.  The 'count' parameter is substitute for the real Count,
        /// used only when newItem is null. 
        /// In that case, this method sets IsCurrentAfterLast to true if and only 
        /// if newPosition >= count.  This distinguishes between a null belonging
        /// to the view and the dummy null when CurrentPosition is past the end. 
        /// </remarks>
//        protected void 
        SetCurrent:function(/*object*/ newItem, /*int*/ newPosition, /*int*/ count)
        {
        	if(count === undefined){
        		count = (newItem != null) ? 0 : this.IsEmpty ? 0 : this.Count;
        	}
        	
            if (newItem != null) 
            {
                // non-null item implies position is within range. 
                // We ignore count - it's just a placeholder 
            	this.SetFlag(CollectionViewFlags.IsCurrentBeforeFirst, false);
            	this.SetFlag(CollectionViewFlags.IsCurrentAfterLast, false); 
            }
            else if (count == 0)
            {
                // empty collection - by convention both flags are true and position is -1 
            	this.SetFlag(CollectionViewFlags.IsCurrentBeforeFirst, true);
            	this.SetFlag(CollectionViewFlags.IsCurrentAfterLast, true); 
                newPosition = -1; 
            }
            else 
            {
                // null item, possibly within range.
            	this.SetFlag(CollectionViewFlags.IsCurrentBeforeFirst, newPosition < 0);
            	this.SetFlag(CollectionViewFlags.IsCurrentAfterLast, newPosition >= count); 
            }
 
            this._currentItem = newItem; 
            this._currentPosition = newPosition;
        }, 

        /// <summary>
        /// ask listeners (via <seealso cref="ICollectionView.CurrentChanging"/> event) if it's OK to change currency
        /// </summary> 
        /// <returns>false if a listener cancels the change, true otherwise</returns>
//        protected bool 
        OKToChangeCurrent:function() 
        { 
            /*CurrentChangingEventArgs*/var args = new CurrentChangingEventArgs();
            this.OnCurrentChanging(args); 
            return (!args.Cancel);
        },

        /// <summary> 
        /// Raise a CurrentChanging event that is not cancelable.
        /// Internally, CurrentPosition is set to -1. 
        /// This is called by CollectionChanges (Remove and Refresh) that affect the CurrentItem. 
        /// </summary>
        /// <exception cref="InvalidOperationException"> 
        /// This CurrentChanging event cannot be canceled.
        /// </exception>
//        protected void 
        OnCurrentChanging:function(args)
        { 
        	if(args === undefined){
            	this._currentPosition = -1;
            	this.OnCurrentChanging(CollectionView.uncancelableCurrentChangingEventArgs); 
        	}else{
//                if (this._currentChangedMonitor.Busy) 
//                {
//                    if (args.IsCancelable) 
//                        args.Cancel = true;
//                    return;
//                }
     
                if (this.CurrentChanging != null)
                { 
                	this.CurrentChanging.Invoke(this, args); 
                }
        	}

        }, 

//        /// <summary> 
//        /// Raises the CurrentChanging event
//        /// </summary>
//        /// <param name="args">
//        ///     CancelEventArgs used by the consumer of the event.  args.Cancel will 
//        ///     be true after this call if the CurrentItem should not be changed for
//        ///     any reason. 
//        /// </param> 
//        /// <exception cref="InvalidOperationException">
//        ///     This CurrentChanging event cannot be canceled. 
//        /// </exception>
////        protected virtual void 
//        OnCurrentChanging:function(/*CurrentChangingEventArgs*/ args)
//        {
//            if (args == null) 
//                throw new ArgumentNullException("args");
// 
//            if (this._currentChangedMonitor.Busy) 
//            {
//                if (args.IsCancelable) 
//                    args.Cancel = true;
//                return;
//            }
// 
//            if (this.CurrentChanging != null)
//            { 
//            	this.CurrentChanging.Invoke(this, args); 
//            }
//        }, 

        /// <summary>
        /// Raises the CurrentChanged event
        /// </summary> 
//        protected virtual void 
        OnCurrentChanged:function()
        { 
            if (this.CurrentChanged != null /*&& this._currentChangedMonitor.Enter()*/) 
            {
                this.CurrentChanged.Invoke(this, EventArgs.Empty);
            } 
        },
 
        /// <summary> 
        ///     Must be implemented by the derived classes to process a single change on the
        ///     UI thread.  The UI thread will have already been entered by now. 
        /// </summary>
        /// <param name="args">
        ///     The NotifyCollectionChangedEventArgs to be processed.
        /// </param> 
//        protected virtual void 
        ProcessCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args)
        { 
            // 
            // Steps for ProcessCollectionChanged:
            // 
            // 1) Validate that the values in the args are acceptable.
            // 2) Translate the indices if necessary.
            // 3) Raise CollectionChanged.
            // 4) Adjust Currency. 
            // 5) Raise any PropertyChanged events that apply.
            // 
 
        	this.ValidateCollectionChangedEventArgs(args);
 
            var oldCurrentItem = this._currentItem;
            var oldIsCurrentAfterLast = this.CheckFlag(CollectionViewFlags.IsCurrentAfterLast);
            var oldIsCurrentBeforeFirst = this.CheckFlag(CollectionViewFlags.IsCurrentBeforeFirst);
            var oldCurrentPosition = this._currentPosition; 
            var raiseChanged = false;
 
            switch (args.Action) 
            {
                case NotifyCollectionChangedAction.Add: 
                    if (this.PassesFilter(args.NewItems.Get(0)))
                    {
                        raiseChanged = true;
                        this.AdjustCurrencyForAdd(args.NewStartingIndex); 
                    }
                    break; 
 
                case NotifyCollectionChangedAction.Remove:
                    if (this.PassesFilter(args.OldItems.Get(0)))
                    {
                        raiseChanged = true;
                        this.AdjustCurrencyForRemove(args.OldStartingIndex);
                    } 
                    break;
 
                case NotifyCollectionChangedAction.Replace: 
                    if (this.PassesFilter(args.OldItems.Get(0)) || this.PassesFilter(args.NewItems.Get(0)))
                    { 
                        raiseChanged = true;
                        this.AdjustCurrencyForReplace(args.OldStartingIndex);
                    }
                    break; 

                case NotifyCollectionChangedAction.Move: 
                    if (this.PassesFilter(args.NewItems.Get(0))) 
                    {
                        raiseChanged = true; 
                        this.AdjustCurrencyForMove(args.OldStartingIndex, args.NewStartingIndex);
                    }
                    break;
 
                case NotifyCollectionChangedAction.Reset:
                    // collection has completely changed 
                	this.RefreshOrDefer(); 
                    return;     // Refresh already raises the event
            } 

            // we've already returned if (args.Action == NotifyCollectionChangedAction.Reset) above
            if (raiseChanged)
            	this.OnCollectionChanged(args); 

            // currency has to change after firing the deletion event, 
            // so event handlers have the right picture 
            if (this._currentElementWasRemovedOrReplaced)
            { 
            	this.MoveCurrencyOffDeletedElement();
            	this._currentElementWasRemovedOrReplaced = false;
            }
 

            // notify that the properties have changed. 
            if (this.IsCurrentAfterLast != oldIsCurrentAfterLast) 
            	this.OnPropertyChanged(CollectionView.IsCurrentAfterLastPropertyName);
 
            if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
            	this.OnPropertyChanged(CollectionView.IsCurrentBeforeFirstPropertyName);

            if (this._currentPosition != oldCurrentPosition) 
            	this.OnPropertyChanged(CollectionView.CurrentPositionPropertyName);
 
            if (this._currentItem != oldCurrentItem) 
            	this.OnPropertyChanged(CollectionView.CurrentItemPropertyName);
        }, 

     
 
        /// <summary>
        ///     This method is called when the value of AllowsCrossThreadChanges 
        ///     is changed.   It gives a derived class an opportunity to 
        ///     initialize its support for cross-thread changes (or to retire
        ///     that support). 
        /// </summary>
        /// <notes>
        ///     This method will only be called if the application chooses to
        ///     change the synchronization information for a collection after 
        ///     creating one or more collection views for that collection.
        ///     This is an unusual situation - most applications will register 
        ///     the synchronization information for a collection before creating 
        ///     any collection views, and never change it.   If so,
        ///     this method will not be called. 
        /// </notes>
//        protected virtual void 
        OnAllowsCrossThreadChangesChanged:function()
        {
        }, 

        /// <summary> 
        ///     Clear any pending changes. 
        /// </summary>
        /// <notes> 
        ///     When AllowsCrossThreadChanges is true, CollectionChanged events
        ///     received from the source collection are held in a buffer until
        ///     the Dispatcher's thread can process them.  A when a derived class
        ///     resets itself to the current content of the source collection 
        ///     (e.g. during RefreshOverride), it should discard these pending
        ///     changes by calling this method. 
        /// </notes> 
//        protected void 
        ClearPendingChanges:function()
        { 
        	this._changeLog.Clear();
        	this._tempChangeLog.Clear(); 
        }, 
 
        /// <summary>
        ///     Process all the pending changes 
        /// </summary>
        /// <notes>
        ///     A derived class would call this method when it needs to bring
        ///     the collection view up-to-date with respect to the underlying 
        ///     collection.  This is often required before modifying
        ///     the underlying collection (e.g. via AddNew, Remove, RemoveAt), 
        ///     so that the derived class can supply the correct index. 
        /// </notes>
//        protected void 
        ProcessPendingChanges:function() 
        {
        	this.ProcessChangeLog(this._changeLog, true); 
        	this._changeLog.Clear();
        }, 

        /// <summary> 
        ///     Obsolete.   Retained for compatibility.
        ///     Use OnAllowsCrossThreadChangesChanged instead.
        /// </summary.
        /// <param name="args"> 
        ///     The NotifyCollectionChangedEventArgs that is added to the change log
        /// </param> 
//        protected virtual void 
        OnBeginChangeLogging:function(/*NotifyCollectionChangedEventArgs*/ args)
        { 
        },

        /// <summary>
        ///     Obsolete.   Retained for compatibility. 
        ///     Use ClearPendingChanges instead.
        /// </summary> 
//        protected void 
        ClearChangeLog:function()
        { 
        	this.ClearPendingChanges();
        },

        /// <summary> 
        ///     Refresh, or mark that refresh is needed when defer cycle completes.
        /// </summary> 
//        protected void 
        RefreshOrDefer:function() 
        {
            if (this.IsRefreshDeferred) 
            {
            	this.SetFlag(CollectionViewFlags.NeedsRefresh, true);
            }
            else 
            {
            	this.RefreshInternal(); 
            } 
        },
//        internal void 
        SetAllowsCrossThreadChanges:function(/*bool*/ value)
        { 
            var oldValue = this.CheckFlag(CollectionViewFlags.AllowsCrossThreadChanges);
            if (oldValue == value) 
                return; 

            this.SetFlag(CollectionViewFlags.AllowsCrossThreadChanges, value); 
            this.OnAllowsCrossThreadChangesChanged();
        },
 
 
        /// <summary>
        /// This method is for use by an agent that manages a set of 
        /// one or more views.  Normal applications should not use it directly.
        /// </summary>
        /// <remarks>
        /// It is used to control the lifetime of the view, so that it gets 
        /// garbage-collected at the right time.
        /// </remarks> 
//        internal void 
        SetViewManagerData:function(/*object*/ value) 
        {
            /*object[]*/var array; 

            if (this._vmData == null)
            {
                // 90% case - store a single value directly 
            	this._vmData = value;
            } 
            else if ((array = this._vmData instanceof Array ? this._vmData : null) == null) 
            {
                // BindingListCollectionView appears in the table for both 
                // DataTable and DataView - keep both references (bug 1745899)
            	this._vmData = [this._vmData, value];
            }
            else 
            {
//                // in case a view is held by more than two tables, keep all 
//                // references.  This doesn't happen in current code, but there's 
//                // nothing preventing it, either.
//                /*object[]*/var newArray = new object[array.Length + 1]; 
//                array.CopyTo(newArray, 0);
//                newArray[array.Length] = value;
//                this._vmData = newArray;
                
                this._vmData.push(value);
            } 
        },
 
 
        // determine whether the items have reliable hash codes
//        internal virtual bool 
        HasReliableHashCodes:function() 
        {
            // default implementation - sample the first item
        	if(this.IsEmpty){
        		return true;
        	}
        	var item = this.GetItemAt(0);
        	if(item == null){
        		return false;
        	}
        	
        	return false;
//            return (this.IsEmpty || HashHelper.HasReliableHashCode(this.GetItemAt(0)));
        }, 

        // helper to validate that we are not in the middle of a DeferRefresh 
        // and throw if that is the case. 
//        internal void 
        VerifyRefreshNotDeferred:function()
        { 
            // If the Refresh is being deferred to change filtering or sorting of the 
            // data by this CollectionView, then CollectionView will not reflect the correct
            // state of the underlying data. 

            if (this.IsRefreshDeferred)
                throw new InvalidOperationException(SR.Get(SRID.NoCheckOrChangeWhenDeferred));
 
        }, 

//        internal void 
        InvalidateEnumerableWrapper:function() 
        {
//            /*IndexedEnumerable*/var wrapper =  Interlocked.Exchange(/*ref*/ this._enumerableWrapper, null);
            /*IndexedEnumerable*/var wrapper =  this._enumerableWrapper;
            this._enumerableWrapper =  null;
            if (wrapper != null)
            { 
                wrapper.Invalidate();
            } 
        }, 

//        internal ReadOnlyCollection<ItemPropertyInfo> 
        GetItemProperties:function() 
        {
            /*IEnumerable*/var collection = this.SourceCollection;
            if (collection == null)
                return null; 

            /*IEnumerable*/var properties = null; 
 
            /*ITypedList*/var itl = collection instanceof ITypedList ?  collection : null;
            /*Type*/var itemType; 
            /*object*/var item;

            if (itl != null)
            { 
                // ITypedList has the information
                properties = itl.GetItemProperties(null); 
            } 
            else if ((itemType = this.GetItemType(false)) != null)
            { 
                // If we know the item type, use its properties.
                properties = TypeDescriptor.GetProperties(itemType);
            }
            else if ((item = this.GetRepresentativeItem()) != null) 
            {
                // If we have a representative item, use its properties. 
                // It's cheaper to use the item type, but we cannot do that 
                // when all we know is a representative item.  If the item
                // has synthetic properties (via ICustomTypeDescriptor or 
                // TypeDescriptorProvider), they don't show up on the type -
                // only on the item.
                /*ICustomTypeProvider*/var ictp = item instanceof ICustomTypeProvider ? item : null;
                if (ictp == null) 
                {
                    properties = TypeDescriptor.GetProperties(item); 
                } 
                else
                { 
                    properties = ictp.GetCustomType().GetProperties();
                }
            }
 
            if (properties == null)
                return null; 
 
            // convert the properties to ItemPropertyInfo
            /*List<ItemPropertyInfo>*/var list = new List/*<ItemPropertyInfo>*/(); 
            for (var property in properties)
            {
                /*PropertyDescriptor*/var pd;
                /*PropertyInfo*/var pi; 

                if ((pd = property instanceof PropertyDescriptor ? property : null) != null) 
                { 
                    list.Add(new ItemPropertyInfo(pd.Name, pd.PropertyType, pd));
                } 
                else if ((pi = property instanceof PropertyInfo ? property : null) != null)
                {
                    list.Add(new ItemPropertyInfo(pi.Name, pi.PropertyType, pi));
                } 
            }
 
            // return the result as a read-only collection 
            return new ReadOnlyCollection/*<ItemPropertyInfo>*/(list);
        }, 

//        internal Type 
        GetItemType:function(/*bool*/ useRepresentativeItem)
        {
            /*Type*/
        	var collectionType = this.SourceCollection.GetType(); 
            /*Type[]*/
        	var interfaces = collectionType.GetInterfaces();
 
            // Look for IEnumerable<T>.  All generic collections should implement 
            // this.  We loop through the interface list, rather than call
            // GetInterface(IEnumerableT), so that we handle an ambiguous match 
            // (by using the first match) without an exception.
            for (var i=0; i<interfaces.Length; ++i)
            {
                /*Type*/var interfaceType = interfaces[i]; 

                if (interfaceType.Name == IEnumerableT) 
                { 
                    // found IEnumerable<>, extract T
                    /*Type[]*/var typeParameters = interfaceType.GetGenericArguments(); 
                    if (typeParameters.Length == 1)
                    {
                        /*Type*/var type = typeParameters[0];
 
                        if (ICustomTypeProvider.Type.IsAssignableFrom(type))
                        { 
                            // if the item type can point to a custom type 
                            // for reflection, we need the custom type.
                            // We can only get it from a representative item. 
                            break;
                        }

                        if (type == Object.Type) 
                        {
                            // IEnumerable<Object> is useless;  we need a representative 
                            // item.   But keep going - perhaps IEnumerable<T> shows up later. 
                            continue;
                        } 

                        return type;
                    }
                } 
            }
 
            // No generic information found.  Use a representative item instead. 
            if (useRepresentativeItem)
            { 
                // get type of a representative item
                /*object*/var item = this.GetRepresentativeItem();
                return System.Windows.Markup.ReflectionHelper.GetReflectionType(item);
            } 

            return null; 
        }, 

//        internal object 
        GetRepresentativeItem:function() 
        {
            if (this.IsEmpty)
                return null;
 
            var result = null;
            var ie = this.GetEnumerator(); 
            while (ie.MoveNext()) 
            {
                var item = ie.Current; 
                if (item != null && item != this.NewItemPlaceholder)
                {
                    result = item;
                    break; 
                }
            } 
            
            var d = ie instanceof IDisposable ? d : null;
            if (d != null) 
            {
                d.Dispose();
            }
 
            return result;
        }, 
 
//        internal virtual void 
        GetCollectionChangedSources:function(/*int*/ level, /*Action<int, object, bool?, List<string>>*/ format, /*List<string>*/ sources)
        { 
            format(level, this, null, sources);
            if (this._sourceCollection != null)
            {
                format(level+1, this._sourceCollection, null, sources); 
            }
        },
        
        // Just move it.  No argument check, no events, just move current to position.
//        private void 
        _MoveCurrentToPosition:function(/*int*/ position)
        { 
            if (position < 0)
            { 
            	this.SetFlag(CollectionViewFlags.IsCurrentBeforeFirst, true); 
            	this.SetCurrent(null, -1);
            } 
            else if (position >= this.Count)
            {
            	this.SetFlag(CollectionViewFlags.IsCurrentAfterLast, true);
            	this.SetCurrent(null, Count); 
            }
            else 
            { 
            	this.SetFlag(CollectionViewFlags.IsCurrentBeforeFirst | CollectionViewFlags.IsCurrentAfterLast, false);
            	this.SetCurrent(EnumerableWrapper.Get(position), position); 
            }
        },

//        private void 
        MoveCurrencyOffDeletedElement:function() 
        {
            var lastPosition = this.Count - 1; 
            // if position falls beyond last position, move back to last position 
            var newPosition = (this._currentPosition < lastPosition) ? this._currentPosition : lastPosition;
 
            // ignore cancel, there's no choice in this currency change
            this.OnCurrentChanging();
            this._MoveCurrentToPosition(newPosition);
            this.OnCurrentChanged(); 
        },
 
//        private void 
        EndDefer:function() 
        {
            -- this._deferLevel; 

            if (this._deferLevel == 0 && this.CheckFlag(CollectionViewFlags.NeedsRefresh))
            {
            	this.Refresh(); 
            }
        }, 
 
        /// <summary>
        ///     DeferProcessing is to be called from OnCollectionChanged by derived classes  that 
        ///     wish to process the remainder of a changeLog after allowing other events to be
        ///     processed.
        /// </summary>
        /// <param name="changeLog"> 
        ///     ArrayList of NotifyCollectionChangedEventArgs that could not be precessed.
        /// </param> 
//        private void 
        DeferProcessing:function(/*ICollection*/ changeLog) 
        {
            if (this._changeLog == null) 
            { 
            	this._changeLog = new ArrayList(changeLog);
            } 
            else
            {
            	this._changeLog.InsertRange(0, changeLog);
            } 

            if (this._databindOperation != null) 
            { 
            	this._engine.ChangeCost(this._databindOperation, changeLog.Count);
            } 
            else
            {
            	this._databindOperation = this._engine.Marshal(new DispatcherOperationCallback(ProcessInvoke), null, changeLog.Count);
            } 
        }, 

        /// <summary> 
        ///     Must be implemented by the derived classes to process changes on the
        ///     UI thread.  Called by ProcessInvoke wich is called by the Dispatcher, so
        ///     the UI thread will have allready been entered by now.
        /// </summary> 
        /// <param name="changeLog">
        ///     List of NotifyCollectionChangedEventArgs that is to be processed. 
        /// </param> 
//        private ICollection 
        ProcessChangeLog:function(/*ArrayList*/ changeLog, /*bool*/ processAll/*=false*/)
        { 
        	if(processAll === undefined){
        		processAll = false;
        	}
        	
            var currentIndex = 0;
            var mustDeferProcessing = false;
            var beginTime = DateTime.Now.Ticks;
            var startCount = changeLog.Count; 

            for ( ; currentIndex < changeLog.Count && !(mustDeferProcessing); currentIndex++) 
            { 
                /*NotifyCollectionChangedEventArgs*/
            	var args = changeLog.Get(currentIndex);
            	args = args instanceof NotifyCollectionChangedEventArgs ? args : null;
 
                if (args != null)
                {
                	this.ProcessCollectionChanged(args);
                } 

                if (!processAll) 
                { 
                    mustDeferProcessing = DateTime.Now.Ticks - beginTime > DataBindEngine.CrossThreadThreshold;
                } 
            }

            if (mustDeferProcessing && currentIndex < changeLog.Count)
            { 
                // create an unprocessed subset of changeLog
                changeLog.RemoveRange(0,currentIndex); 
                return changeLog; 
            }
 
            return null;
        },

        // returns true if ANY flag in flags is set. 
//        private bool 
        CheckFlag:function(/*CollectionViewFlags*/ flags)
        { 
            return (this._flags & flags) != 0; 
        },
 
//        private void 
        SetFlag:function(/*CollectionViewFlags*/ flags, /*bool*/ value)
        {
            if (value)
            { 
            	this._flags = this._flags | flags;
            } 
            else 
            {
            	this._flags = this._flags & ~flags; 
            }
        },

        // Post a change on the UI thread Dispatcher and updated the _changeLog. 
//        private void 
        PostChange:function(/*NotifyCollectionChangedEventArgs*/ args)
        { 
            // we can ignore everything before a Reset
            if (args.Action == NotifyCollectionChangedAction.Reset)
            { 
            	this._changeLog.Clear();
            } 
 
            if (this._changeLog.Count == 0 && this.CheckAccess())
            { 
                // when a change arrives on the UI thread and there are
                // no pending cross-thread changes, process the event
                // synchronously.   This is important for editing operations
                // (AddNew, Remove), which expect to get notified about 
                // the changes they make directly.
            	this.ProcessCollectionChanged(args); 
            } 
            else
            { 
                // the change (or another pending change) arrived on the
                // wrong thread.  Marshal it to the UI thread.
            	this._changeLog.Add(args);
 
                if(this._databindOperation == null)
                { 
                	this._databindOperation = this._engine.Marshal( 
                        new DispatcherOperationCallback(ProcessInvoke),
                        null, this._changeLog.Count); 
                }
            }
        },
 
        // Callback that is passed to Dispatcher.BeginInvoke in PostChange 
//        private object 
        ProcessInvoke:function(/*object*/ arg)
        { 
            // work on a private copy of the change log, so that other threads
            // can add to the main change log
        	this._databindOperation = null; 
        	this._tempChangeLog = _changeLog;
        	this._changeLog = new ArrayList(); 

            // process the changes 
            /*ICollection*/var unprocessedChanges = this.ProcessChangeLog(this._tempChangeLog);
 
            // if changes remain (because we ran out of time), reschedule them 
            if (unprocessedChanges != null && unprocessedChanges.Count > 0)
            { 
            	this.DeferProcessing(unprocessedChanges);
            }

            this._tempChangeLog = CollectionView.EmptyArrayList; 

            return null; 
        }, 

//        private void 
        ValidateCollectionChangedEventArgs:function(/*NotifyCollectionChangedEventArgs*/ e) 
        {

            switch (e.Action)
            { 
                case NotifyCollectionChangedAction.Add:
                    if (e.NewItems.Count != 1) 
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
                    break;
 
                case NotifyCollectionChangedAction.Remove:
                    if (e.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));
                    if (e.OldStartingIndex < 0) 
                        throw new InvalidOperationException(SR.Get(SRID.RemovedItemNotFound));
                    break; 
 
                case NotifyCollectionChangedAction.Replace:
                    if (e.NewItems.Count != 1 || e.OldItems.Count != 1) 
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));
                    break;

                case NotifyCollectionChangedAction.Move: 
                    if (e.NewItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
                    if (e.NewStartingIndex < 0) 
                        throw new InvalidOperationException(SR.Get(SRID.CannotMoveToUnknownPosition));
                    break; 

                case NotifyCollectionChangedAction.Reset:
                    break;
 
                default:
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action)); 
            } 
        },
 
        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForAdd:function(/*int*/ index)
        {
            // adjust current index if insertion is earlier 
            if (this.Count == 1)
            	this._currentPosition = -1; 
            else if (index <= this._currentPosition) 
            {
                ++this._currentPosition; 

                if (this._currentPosition < this.Count)
                {
                	this._currentItem = EnumerableWrapper.Get(this._currentPosition); 
                }
            } 
        }, 

        // Fix up CurrentPosition and CurrentItem after an item was removed. 
//        private void 
        AdjustCurrencyForRemove:function(/*int*/ index)
        {
            // adjust current index if deletion is earlier
            if (index < this._currentPosition) 
                --this._currentPosition;
 
            // move currency off the deleted element 
            else if (index == this._currentPosition)
            { 
            	this._currentElementWasRemovedOrReplaced = true;
            }
        },
 
        // Fix up CurrentPosition and CurrentItem after an item was moved.
//        private void 
        AdjustCurrencyForMove:function(/*int*/ oldIndex, /*int*/ newIndex) 
        { 
            // if entire move was before or after current item, then there
            // is nothing that needs to be done. 
            if ((oldIndex < this.CurrentPosition && newIndex < this.CurrentPosition)
                || (oldIndex > this.CurrentPosition && newIndex > this.CurrentPosition))
                return;
 
            if (oldIndex <= this.CurrentPosition)
            	this.AdjustCurrencyForRemove(oldIndex); 
            else if (newIndex <= this.CurrentPosition) 
            	this.AdjustCurrencyForAdd(newIndex);
 
        },


        // fix up CurrentPosition and CurrentItem after a collection change 
//        private void 
        AdjustCurrencyForReplace:function(/*int*/ index)
        { 
            // CurrentItem was replaced 
            if (index == this._currentPosition)
            { 
            	this._currentElementWasRemovedOrReplaced = true;
            }
        },
 
        /// <summary>
        /// Helper to raise a PropertyChanged event  />). 
        /// </summary> 
//        private void 
        OnPropertyChanged:function(/*string propertyName*/ par)
        { 
        	var args = null;
        	if(par instanceof PropertyChangedEventArgs){
        		args = par;
        	}else if(typeof(par) == "string"){
        		args = new PropertyChangedEventArgs(par);
        	}
            if (this.PropertyChanged != null)
            { 
                this.PropertyChanged.Invoke(this, args); 
            }
        },
        
//        /// <summary> 
//        /// Raises a PropertyChanged event (per <see cref="INotifyPropertyChanged"/>).
//        /// </summary>
////        protected virtual void 
//        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ e)
//        { 
//            if (this.PropertyChanged != null)
//            { 
//            	this.PropertyChanged.Invoke(this, e); 
//            }
//        }, 
 
	});
	
	Object.defineProperties(CollectionView.prototype,{
        /// <summary> 
        /// Culture to use during sorting.
        /// </summary> 
//        public virtual CultureInfo 
        Culture:
        {
            get:function() { return this._culture; }, 
            set:function(value)
            { 
                if (value == null) 
                    throw new ArgumentNullException("value");
 
                if (this._culture != value)
                {
                	this._culture = value;
                	this.OnPropertyChanged(CollectionView.CulturePropertyName); 
                }
            } 
        },
        /// <summary>
        /// Returns the underlying collection. 
        /// </summary>
//        public virtual IEnumerable 
        SourceCollection:
        {
            get:function() { return this._sourceCollection; } 
        },
        
        /// <summary> 
        /// Filter is a callback set by the consumer of the ICollectionView
        /// and used by the implementation of the ICollectionView to determine if an 
        /// item is suitable for inclusion in the view.
        /// </summary>
        /// <exception cref="NotSupportedException">
        /// Simpler implementations do not support filtering and will throw a NotSupportedException. 
        /// Use <seealso cref="CanFilter"/> property to test if filtering is supported before
        /// assigning a non-null value. 
        /// </exception> 
//        public virtual Predicate<object> 
        Filter:
        { 
            get:function()
            {
                return this._filter;
            }, 
            set:function(value)
            { 
                if (!this.CanFilter) 
                    throw new NotSupportedException();
 
                this._filter = value;

                this.RefreshOrDefer();
            } 
        },
 
        /// <summary> 
        /// Indicates whether or not this ICollectionView can do any filtering.
        /// When false, set <seealso cref="Filter"/> will throw an exception. 
        /// </summary>
//        public virtual bool 
        CanFilter:
        {
            get:function() 
            {
                return true; 
            } 
        },
        
        /// <summary>
        /// Collection of Sort criteria to sort items in this view over the SourceCollection.
        /// </summary>
        /// <remarks> 
        /// <p>
        /// Simpler implementations do not support sorting and will return an empty 
        /// and immutable / read-only SortDescription collection. 
        /// Attempting to modify such a collection will cause NotSupportedException.
        /// Use <seealso cref="CanSort"/> property on CollectionView to test if sorting is supported 
        /// before modifying the returned collection.
        /// </p>
        /// <p>
        /// One or more sort criteria in form of <seealso cref="SortDescription"/> 
        /// can be added, each specifying a property and direction to sort by.
        /// </p> 
        /// </remarks> 
//        public virtual SortDescriptionCollection 
        SortDescriptions:
        { 
            get:function() { return SortDescriptionCollection.Empty; }
        },

        /// <summary> 
        /// Test if this ICollectionView supports sorting before adding
        /// to <seealso cref="SortDescriptions"/>. 
        /// </summary> 
//        public virtual bool 
        CanSort:
        { 
            get:function() { return false; }
        },

        /// <summary> 
        /// Returns true if this view really supports grouping.
        /// When this returns false, the rest of the interface is ignored. 
        /// </summary> 
//        public virtual bool 
        CanGroup:
        { 
            get:function() { return false; }
        },

        /// <summary> 
        /// The description of grouping, indexed by level.
        /// </summary> 
//        public virtual ObservableCollection<GroupDescription> 
        GroupDescriptions:
        {
            get:function() { return null; } 
        },

        /// <summary>
        /// The top-level groups, constructed according to the descriptions 
        /// given in GroupDescriptions.
        /// </summary> 
//        public virtual ReadOnlyObservableCollection<object> 
        Groups: 
        {
            get:function() { return null; } 
        },
        /// <summary> 
        /// Return the "current item" for this view 
        /// </summary>
        /// <remarks> 
        /// Only wrapper classes (those that pass currency handling calls to another internal
        /// CollectionView) should override CurrentItem; all other derived classes
        /// should use SetCurrent() to update the current values stored in the base class.
        /// </remarks> 
//        public virtual object 
        CurrentItem:
        { 
            get:function() 
            {
            	this.VerifyRefreshNotDeferred(); 

                return this._currentItem;
            }
        }, 

        /// <summary> 
        /// The ordinal position of the <seealso cref="CurrentItem"/> within the (optionally 
        /// sorted and filtered) view.
        /// </summary> 
        /// <returns>
        /// -1 if the CurrentPosition is unknown, because the collection does not have an
        /// effective notion of indices, or because CurrentPosition is being forcibly changed
        /// due to a CollectionChange. 
        /// </returns>
        /// <remarks> 
        /// Only wrapper classes (those that pass currency handling calls to another internal 
        /// CollectionView) should override CurrenPosition; all other derived classes
        /// should use SetCurrent() to update the current values stored in the base class. 
        /// </remarks>
//        public virtual int 
        CurrentPosition:
        {
            get:function() 
            {
            	this.VerifyRefreshNotDeferred(); 
 
                return this._currentPosition;
            } 
        },

        /// <summary>
        /// Return true if <seealso cref="CurrentItem"/> is beyond the end (End-Of-File). 
        /// </summary>
//        public virtual bool 
        IsCurrentAfterLast: 
        { 
            get:function()
            { 
            	this.VerifyRefreshNotDeferred();

                return this.CheckFlag(CollectionViewFlags.IsCurrentAfterLast);
            } 
        },
 
 
        /// <summary>
        /// Return true if <seealso cref="CurrentItem"/> is before the beginning (Beginning-Of-File). 
        /// </summary>
//        public virtual bool 
        IsCurrentBeforeFirst:
        {
            get:function() 
            {
            	this.VerifyRefreshNotDeferred(); 
 
                return this.CheckFlag(CollectionViewFlags.IsCurrentBeforeFirst);
            } 
        },
        
        /// <summary> 
        /// Return the number of items (or -1, meaning "don't know");
        /// if a Filter is set, this counts only items that pass the filter. 
        /// </summary>
        /// <remarks>
        /// <p>If the underlying collection is only of type IEnumerable, this count
        /// is a O(N) operation; this Count value will be cached until the 
        /// collection changes again.</p>
        /// <p>When deriving from CollectionView, override this property to provide 
        /// a more efficient implementation.</p> 
        /// </remarks>
//        public virtual int 
        Count: 
        {
            get:function()
            {
            	this.VerifyRefreshNotDeferred(); 

                return this.EnumerableWrapper.Count; 
            } 
        },
 
        /// <summary>
        /// Returns true if the resulting (filtered) view is emtpy.
        /// </summary>
//        public virtual bool 
        IsEmpty: 
        {
            get:function() { return this.EnumerableWrapper.IsEmpty; } 
        }, 

        /// <summary> 
        /// Return an object that compares items in this view.
        /// </summary>
//        public virtual IComparer 
        Comparer:
        { 
            get:function() { return this instanceof IComparer ? this : null; }
        }, 
 
        /// <summary>
        ///     Returns true if this view needs to be refreshed. 
        /// </summary>
//        public virtual bool 
        NeedsRefresh:
        {
            get:function() { return this.CheckFlag(CollectionViewFlags.NeedsRefresh); } 
        },
 
        /// <summary> 
        ///     Returns true if this view is in use (i.e. if anyone
        ///     is listening to its events). 
        /// </summary>
//        public virtual bool 
        IsInUse:
        {
            get:function() { return this.CollectionChanged != null || this.PropertyChanged != null || 
                        this.CurrentChanged != null || this.CurrentChanging != null; }
        }, 
 
        /// <summary>
        ///     returns true if the underlying collection provides change notifications
        ///     the collection view is listening to the change events. 
        /// </summary>
//        protected bool 
        IsDynamic: 
        { 
            get:function()
            { 
                return this.CheckFlag(CollectionViewFlags.IsDynamic);
            }
        },
 
        /// <summary>
        ///     Returns true if this view supports CollectionChanged events raised 
        ///     by the source collection on a foreign thread (a thread different 
        ///     from the Dispatcher's thread).
        /// </summary> 
        /// <notes>
        ///     The value of this property depends on the synchronization information
        ///     registered for the source collection via
        ///     BindingOperations.EnableCollectionSynchronization. 
        ///     The value is set when the view is created.
        /// </notes> 
//        protected bool 
        AllowsCrossThreadChanges: 
        {
            get:function() { return this.CheckFlag(CollectionViewFlags.AllowsCrossThreadChanges); } 
        },

        /// <summary> 
        ///     Obsolete.   Retained for compatibility.
        ///     Use AllowsCrossThreadChanges instead. 
        /// </summary> 
//        protected bool 
        UpdatedOutsideDispatcher:
        { 
            get:function() { return this.AllowsCrossThreadChanges; }
        },

        /// <summary> 
        /// IsRefreshDeferred returns true if there
        /// is still an outstanding DeferRefresh in 
        /// use.  If at all possible, derived classes 
        /// should not call Refresh if IsRefreshDeferred
        /// is true. 
        /// </summary>
//        protected bool 
        IsRefreshDeferred:
        {
            get:function() 
            {
                return this._deferLevel > 0; 
            } 
        },
 
        /// <summary>
        /// IsCurrentInSync returns true if CurrentItem and CurrentPosition are
        /// up-to-date with the state and content of the collection.
        /// </summary> 
//        protected bool 
        IsCurrentInSync:
        { 
            get:function() 
            {
                if (this.IsCurrentInView) 
                    return this.GetItemAt(this.CurrentPosition) == this.CurrentItem;
                else
                    return this.CurrentItem == null;
            } 
        },

        // Timestamp is used by the PlaceholderAwareEnumerator to determine if a 
        // collection change has occurred since the enumerator began.  (If so, 
        // MoveNext should throw.)
//        internal int 
        Timestamp: 
        {
            get:function() { return this._timestamp; }
        },
        
//        private bool 
        IsCurrentInView:
        { 
            get:function() 
            {
            	this.VerifyRefreshNotDeferred(); 
                return (0 <= this.CurrentPosition && this.CurrentPosition < this.Count);
            }
        },
 
//        private IndexedEnumerable 
        EnumerableWrapper:
        { 
            get:function() 
            {
                if (this._enumerableWrapper == null) 
                {
                    /*IndexedEnumerable*/var newWrapper = new IndexedEnumerable(this.SourceCollection, new Predicate/*<object>*/(this.PassesFilter));
//                    Interlocked.CompareExchange(/*ref*/ this._enumerableWrapper, newWrapper, null);
                    this._enumerableWrapper = newWrapper;
                } 

                return this._enumerableWrapper; 
            } 
        },
        
        ///<summary> 
        /// Raise this event before changing currency.
        ///</summary> 
//        public virtual event CurrentChangingEventHandler 
        CurrentChanging:
        {
        	get:function(){
        		if(this._CurrentChanging === undefined){
        			this._CurrentChanging = new Delegate();
        		}
        		
        		return this._CurrentChanging;
        	}
        },

        ///<summary> 
        ///Raise this event after changing currency.
        ///</summary>
//        public virtual event EventHandler  
        CurrentChanged:
        {
        	get:function(){
        		if(this._CurrentChanged === undefined){
        			this._CurrentChanged = new Delegate();
        		}
        		
        		return this._CurrentChanged;
        	}
        },
 

        /// <summary> 
        /// Raise this event when the (filtered) view changes 
        /// </summary>
//        protected virtual event NotifyCollectionChangedEventHandler 
        CollectionChanged:
        {
        	get:function(){
        		if(this._CollectionChanged === undefined){
        			this._CollectionChanged = new Delegate();
        		}
        		
        		return this._CollectionChanged;
        	}
        }, 

//        /*event*/ PropertyChangedEventHandler INotifyPropertyChanged.
        PropertyChanged:
        {
        	get:function(){
        		if(this._PropertyChanged === undefined){
        			this._PropertyChanged = new Delegate();
        		}
        		
        		return this._PropertyChanged;
        	}
        }
        
	});
	
//        internal const string 
	CollectionView.CountPropertyName = "Count"; 
//        internal const string 
    CollectionView.IsEmptyPropertyName = "IsEmpty";
//        internal const string 
    CollectionView.CulturePropertyName = "Culture"; 
//        internal const string 
    CollectionView.CurrentPositionPropertyName = "CurrentPosition"; 
//        internal const string 
    CollectionView.CurrentItemPropertyName = "CurrentItem";
//        internal const string 
    CollectionView.IsCurrentBeforeFirstPropertyName = "IsCurrentBeforeFirst"; 
//        internal const string 
    CollectionView.IsCurrentAfterLastPropertyName = "IsCurrentAfterLast";
    
//  static object           
    CollectionView._newItemPlaceholder= {"name" : "NewItemPlaceholder"};
    
//    internal static readonly object 
    CollectionView.NoNewItem = {"name" : "NoNewItem"};
    
//    static readonly string 
    CollectionView.IEnumerableT = IEnumerable.Type.Name; 
    
 // since there's nothing in the uncancelable event args that is mutable, 
    // just create one instance to be used universally.
//    static readonly CurrentChangingEventArgs 
    CollectionView.uncancelableCurrentChangingEventArgs = new CurrentChangingEventArgs(false);
    
//    static readonly ArrayList 
    CollectionView.EmptyArrayList = new ArrayList();
    
    Object.defineProperties(CollectionView, {
    	
//      public static object 
        NewItemPlaceholder:
        { 
            get:function() { return CollectionView._newItemPlaceholder; }
        }

    });
	
	CollectionView.Type = new Type("CollectionView", CollectionView, [DispatcherObject.Type, ICollectionView.Type, INotifyPropertyChanged.Type]);
	return CollectionView;
});




//        DataBindOperation       _databindOperation; 
//        object                  _vmData;            // view manager's private data 
//        IEnumerable             _sourceCollection;  // the underlying collection
//        CultureInfo             _culture;           // culture to use when sorting 
//        int                     _deferLevel;
//        IndexedEnumerable       _enumerableWrapper;
//        Predicate<object>       _filter; 
//        object                  _currentItem;
//        int                     _currentPosition; 
//        
//        bool                    _currentElementWasRemovedOrReplaced; 
//       
//        DataBindEngine          _engine;
//        int                     _timestamp; 

  


        





