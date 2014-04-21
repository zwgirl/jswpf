/**
 * InnerItemCollectionView
 */

define(["dojo/_base/declare", "system/Type", "data/CollectionView", "collections/IList" , "collections/ArrayList",
        "componentmodel/SortDescriptionCollection", "windows/LogicalTreeHelper", 
        "specialized/NotifyCollectionChangedEventArgs"],
		function(declare, Type, CollectionView, IList, ArrayList,
				SortDescriptionCollection, LogicalTreeHelper, 
				NotifyCollectionChangedEventArgs){
	var InnerItemCollectionView = declare("InnerItemCollectionView", [CollectionView, IList],{
   	 	"-chains-": {
   	 		constructor: "manual"
    	},
		constructor:function(/*int*/ capacity, /*ItemCollection*/ itemCollection)
        { 
//			base(EmptyEnumerable.Instance, false)
			CollectionView.prototype.constructor.call(this, EmptyEnumerable.Instance, false);
            // This list is cloned and diverged when Sort/Filter is applied.
            this._rawList = this._viewList = new ArrayList(capacity); 
			this._itemCollection = itemCollection; 
        },
        Get:function()
        {
            return GetItemAt(index); 
        },
        Set:function(value) 
        { 
            // will throw an exception if item already has a model parent
            /*DependencyObject*/var node = this.AssertPristineModelChild(value); 

            var changingCurrentItem = (this.CurrentPosition == index);

            // getter checks index and will throw out of range exception 
            var originalItem = this._viewList.Get(index);

            // add new item into list for now, but might be rolled back if things go wrong 
            this._viewList.Set(index, value);

            var originalIndexR = -1;
            if (IsCachedMode)
            {
                originalIndexR = this._rawList.IndexOf(originalItem); 
                this._rawList.Set(originalIndexR, value);
            } 

            // try setting model parent, be prepared to rollback item from ItemCollection
            var isAddSuccessful = true; 
            if (node != null)
            {
                isAddSuccessful = false;
                try 
                {
                	this.SetModelParent(value); 
                    isAddSuccessful = true; 
                }
                finally 
                {
                    if (!isAddSuccessful)
                    {
                        // failed to set new model parent, back new item out of collection 
                        // and keep old item in collection (note: its parent hasn't been cleared yet!)
                    	this._viewList.Set(index, originalItem); 
                        if (originalIndexR > 0) 
                        {
                        	this._rawList.Set(originalIndexR, originalItem); 
                        }
                    }
                    else
                    { 
                        // was able to parent new item, now cleanup old item
                    	this.ClearModelParent(originalItem); 
                    } 
                }
            } 

            if (!isAddSuccessful)
                return;

            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.AOOI(NotifyCollectionChangedAction.Replace, value, originalItem, index));
            this.SetIsModified(); 
        },
        

        /// <summary>
        /// Return true if the item belongs to this view.  No assumptions are 
        /// made about the item. This method will behave similarly to IList.Contains()
        /// and will do an exhaustive search through all items in the view.
        /// If the caller knows that the item belongs to the
        /// underlying collection, it is more efficient to call PassesFilter. 
        /// </summary>
//        public override bool 
        Contains:function(/*object*/ item) 
        { 
            return this._viewList.Contains(item);
        },
 
        // always adds at the end of list and view
//        public int 
        Add:function(/*object*/ item)
        { 
            // will throw an exception if item already has a model parent
            /*DependencyObject*/var node = this.AssertPristineModelChild(item); 
 
            // add to collection before attempting to set model parent
            var indexV = this._viewList.Add(item); 
            var indexR = -1;
            if (this.IsCachedMode)
            {
                indexR = this._rawList.Add(item); 
            }
 
            // try setting model parent, be prepared to rollback item from ItemCollection 
            var isAddSuccessful = true;
            if (node != null) 
            {
                isAddSuccessful = false;
                try
                { 
                	this.SetModelParent(item);
                    isAddSuccessful  = true; 
                } 
                finally
                { 
                    if (!isAddSuccessful)
                    {
                        // failed to set new model parent, back item out of collection
                    	this._viewList.RemoveAt(indexV); 
                        if (indexR >= 0)
                        { 
                        	this._rawList.RemoveAt(indexR); 
                        }
                        // also roll back the parent set 
                        this.ClearModelParent(item);
                        indexV = -1;
                    }
                } 
            }
 
            if (!isAddSuccessful) 
                return -1;
 
            this.AdjustCurrencyForAdd(indexV);
            this.SetIsModified();
            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, item, indexV));
            return indexV; 
        },
 
        /// <summary> 
        ///     Clears the collection.  Releases the references on all items
        /// currently in the collection. 
        /// </summary>
        /// <exception cref="InvalidOperationException">
        /// the ItemCollection is read-only because it is in ItemsSource mode
        /// </exception> 
//        public void 
        Clear:function()
        { 
            try 
            {
                for (var i = this._rawList.Count - 1; i >=0; --i) 
                {
                	this.ClearModelParent(this._rawList.Get(i));
                }
            } 
            finally
            { 
            	this._rawList.Clear(); 

                // Refresh will [....] the _viewList to the cleared _rawList 
            	this.RefreshOrDefer();
            }
        },
 
//        public void 
        Insert:function(/*int*/ index, /*object*/ item)
        { 
            // will throw an exception if item already has a model parent 
            /*DependencyObject*/var node = this.AssertPristineModelChild(item);
 
            // add to collection before attempting to set model parent
            this._viewList.Insert(index, item);
            var indexR = -1;
            if (this.IsCachedMode) 
            {
                indexR = this._rawList.Add(item); 
            } 

            // try setting model parent, be prepared to rollback item from ItemCollection 
            var isAddSuccessful = true;
            if (node != null)
            {
                isAddSuccessful = false; 
                try
                { 
                	this.SetModelParent(item); 
                    isAddSuccessful = true;
                } 
                finally
                {
                    if (!isAddSuccessful)
                    { 
                        // failed to set new model parent, back item out of collection
                    	this._viewList.RemoveAt(index); 
                        if (indexR >= 0) 
                        {
                        	this._rawList.RemoveAt(indexR); 
                        }
                        // also roll back the parent set
                        this.ClearModelParent(item);
                    } 
                }
            } 
            if (!isAddSuccessful) 
                return;
 
            this.AdjustCurrencyForAdd(index);
            this.SetIsModified();
            this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Add, item, index));
        }, 

//        public void 
        Remove:function(/*object*/ item) 
        { 
            var indexV = this._viewList.IndexOf(item);
            var indexR = -1; 
            if (this.IsCachedMode)
            {
                indexR = this._rawList.IndexOf(item);
            } 

            this._RemoveAt(indexV, indexR, item); 
        },

//        public void 
        RemoveAt:function(/*int*/ index) 
        {
            if ((0 <= index) && (index < ViewCount))
            {
                var item = this.Get(index); //[index]; 
                var indexR = -1;
                if (this.IsCachedMode) 
                { 
                    indexR = this._rawList.IndexOf(item);
                } 
                this._RemoveAt(index, indexR, item);
            }
            else
            { 
                throw new ArgumentOutOfRangeException("index",
                            SR.Get(SRID.ItemCollectionRemoveArgumentOutOfRange)); 
            } 
        },
 
 
 
        ///<summary>
        /// Copies all the elements of the current collection (view) to the specified one-dimensional Array. 
        ///</summary> 
//        void ICollection.
        CopyTo:function(/*Array*/ array, /*int*/ index)
        { 
        	this._viewList.CopyTo(array, index);
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
//        public override int 
        IndexOf:function(/*object*/ item) 
        {
            return this._viewList.IndexOf(item); 
        },

        /// <summary>
        /// Retrieve item at the given zero-based index in this CollectionView. 
        /// </summary>
        /// <remarks> 
        /// <p>The index is evaluated with any SortDescriptions or Filter being set on this CollectionView.</p> 
        /// </remarks>
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// Thrown if index is out of range
        /// </exception>
//        public override object 
        GetItemAt:function(/*int*/ index)
        { 
            return this._viewList.Get(index);
        }, 
 
        /// <summary>
        /// Move <seealso cref="CollectionView.CurrentItem"/> to the given item. 
        /// If the item is not found, move to BeforeFirst.
        /// </summary>
        /// <param name="item">Move CurrentItem to this item.</param>
        /// <returns>true if <seealso cref="CollectionView.CurrentItem"/> points to an item within the view.</returns> 
//        public override bool 
        MoveCurrentTo:function(/*object*/ item)
        { 
            // if already on item, don't do anything 
            if (Object.Equals(this.CurrentItem, item))
            { 
                // also check that we're not fooled by a false null CurrentItem
                if (item != null || this.IsCurrentInView)
                    return this.IsCurrentInView;
            } 

            return this.MoveCurrentToPosition(this.IndexOf(item)); 
        },

        /// <summary> 
        /// Move <seealso cref="CollectionView.CurrentItem"/> to the item at the given index.
        /// </summary>
        /// <param name="position">Move CurrentItem to this index</param>
        /// <returns>true if <seealso cref="CollectionView.CurrentItem"/> points to an item within the view.</returns> 
//        public override bool 
        MoveCurrentToPosition:function(/*int*/ position)
        { 
            if (position < -1 || position > this.ViewCount) 
                throw new ArgumentOutOfRangeException("position");
 
            if (position != this.CurrentPosition && this.OKToChangeCurrent())
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
        /// Re-create the view, using any <seealso cref="CollectionView.SortDescriptions"/> and/or <seealso cref="CollectionView.Filter"/>. 
        /// </summary> 
//        protected override void 
        RefreshOverride:function()
        { 
            var wasEmpty = this.IsEmpty;
            var oldCurrentItem = this.CurrentItem;
            var oldIsCurrentAfterLast = this.IsCurrentAfterLast;
            var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst; 
            var oldCurrentPosition = this.CurrentPosition;
 
            // force currency off the collection (gives user a chance to save dirty information) 
            this.OnCurrentChanging();
 
            if (this.SortDescriptions.Count > 0 || this.Filter != null)
            {
                // filter the view list
                if (this.Filter == null) 
                {
                	this._viewList = new ArrayList(this._rawList); 
                } 
                else
                { 
                    // optimized for footprint: initialize to size 0 and let AL amortize cost of growth
                	this._viewList = new ArrayList();
                    for (var k = 0; k < this._rawList.Count; ++k)
                    { 
                        if (Filter(this._rawList.Get(k)))
                        	this._viewList.Add(this._rawList.Get(k)); 
                    } 
                }
 
                // sort the view list
                if (this._sort != null && this._sort.Count > 0 && this.ViewCount > 0)
                {
                	this.SortFieldComparer.SortHelper(this._viewList, new SortFieldComparer(this._sort, Culture)); 
                }
 
            } 
            else    // no sort or filter
            { 
            	this._viewList = this._rawList;
            }

            if (this.IsEmpty || oldIsCurrentBeforeFirst) 
            {
            	this._MoveCurrentToPosition(-1); 
            } 
            else if (oldIsCurrentAfterLast)
            { 
            	this._MoveCurrentToPosition(ViewCount);
            }
            else if (oldCurrentItem != null) // set currency back to old current item, or first if not found
            { 
                var index = this._viewList.IndexOf(oldCurrentItem);
                if (index  < 0) 
                { 
                    index  = 0;
                } 
                this._MoveCurrentToPosition(index);
            }

            this.ClearIsModified(); 
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
//        protected override IEnumerator 
        GetEnumerator:function() 
        { 
            return this._viewList.GetEnumerator();
        },

        // called when making any modifying action on the collection that could cause a refresh to be needed.
//        private void 
        SetIsModified:function()
        { 
            if (this.IsCachedMode)
            	this._isModified = true; 
        }, 

//        private void 
        ClearIsModified:function() 
        {
        	this._isModified = false;
        },
 
//        private void 
        _RemoveAt:function(/*int*/ index, /*int*/ indexR, /*object*/ item)
        { 
            if (index >=0) 
            	this._viewList.RemoveAt(index);
            if (indexR >= 0) 
            	this._rawList.RemoveAt(indexR);

            try
            { 
                // removing the model parent could throw, but we'd be left in a consistent state:
                // item is already removed from this collection when unparenting throws 
            	this.ClearModelParent(item); 
            }
            finally 
            {
                if (index >= 0)
                {
                	this.AdjustCurrencyForRemove(index); 
                    //SetIsModified();  // A Remove is not affected by the view's sort and filter
                	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithAOI(NotifyCollectionChangedAction.Remove, item, index)); 
 
                    // currency has to change after firing the deletion event,
                    // so event handlers have the right picture 
                    if (this._currentElementWasRemoved)
                    {
                    	this.MoveCurrencyOffDeletedElement();
                    } 
                }
            } 
        }, 

        // check that item is not already parented 
        // throws an exception if already parented
//        DependencyObject 
        AssertPristineModelChild:function(/*object*/ item)
        {
            /*DependencyObject*/var node = item instanceof DependencyObject ? item : null; 
            if (node == null)
            { 
                return null; 
            }
 
            // refuse a child which already has a different model parent!
            // NOTE: model tree spec would allow reparenting if the parent does not change
            //  but this code will throw: this is a efficient way to catch
            //  an attempt to add the same element twice to the collection 
            if (LogicalTreeHelper.GetParent(node) != null)
            { 
                throw new InvalidOperationException(SR.Get(SRID.ReparentModelChildIllegal)); 
            }
            return node; 
        },

        // NOTE: Only change the item's logical links if the host is a Visual (bug 986386)
//        void 
        SetModelParent:function(/*object*/ item) 
        {
            // to avoid the unnecessary, expensive code in AddLogicalChild, check for DO first 
            if ((this.ModelParentFE != null) && (item instanceof DependencyObject)) 
                LogicalTreeHelper.AddLogicalChild(this.ModelParentFE, null, item);
        }, 

        // if item implements IModelTree, clear model parent
//        void 
        ClearModelParent:function(/*object*/ item)
        { 
            // ClearModelParent is also called for items that are not a DependencyObject;
            // to avoid the unnecessary, expensive code in RemoveLogicalChild, check for DO first 
            if ((this.ModelParentFE != null) && (item instanceof DependencyObject)) 
                LogicalTreeHelper.RemoveLogicalChild(this.ModelParentFE, null, item);
        },

        // set new SortDescription collection; rehook collection change notification handler
//        private void 
        SetSortDescriptions:function(/*SortDescriptionCollection*/ descriptions)
        { 
            if (this._sort != null)
            { 
                /*((INotifyCollectionChanged)_sort)*/
            	this._sort.CollectionChanged.Remove(new NotifyCollectionChangedEventHandler(this, this.SortDescriptionsChanged)); 
            }
 
            this._sort = descriptions;

            if (this._sort != null)
            { 
//                Invariant.Assert(_sort.Count == 0, "must be empty SortDescription collection");
                /*((INotifyCollectionChanged)_sort)*/
            	this._sort.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.SortDescriptionsChanged)); 
            } 
        },
 
        // SortDescription was added/removed, refresh CollectionView
//        private void 
        SortDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
            this.RefreshOrDefer(); 
        },
 
        // Just move it.  No argument check, no events, just move current to position. 
//        private void 
        _MoveCurrentToPosition:function(/*int*/ position)
        { 
            if (position < 0)
            {
            	this.SetCurrent(null, -1);
            } 
            else if (position >= this.ViewCount)
            { 
            	this.SetCurrent(null, this.ViewCount); 
            }
            else 
            {
            	this.SetCurrent(this._viewList.Get(position), position);
            }
        },

        // fix up CurrentPosition and CurrentItem after a collection change 
//        private void 
        AdjustCurrencyForAdd:function(/*int*/ index) 
        {
            if (index < 0) 
                return;

            if (this.ViewCount == 1)
            { 
                // added first item; set current at BeforeFirst
            	this.SetCurrent(null, -1); 
            } 
            else if (index <= this.CurrentPosition) // adjust current index if insertion is earlier
            { 
                var newCurrentPosition = this.CurrentPosition + 1;
                if (newCurrentPosition < this.ViewCount)
                {
                    // CurrentItem might be out of [....] if underlying list is not INCC 
                    // or if this Add is the result of a Replace (Rem + Add)
                	this.SetCurrent(this._viewList.Get(newCurrentPosition), newCurrentPosition); 
                } 
                else
                { 
                	this.SetCurrent(null, this.ViewCount);
                }
            }
        },

        // fix up CurrentPosition and CurrentItem after a collection change 
//        private void 
        AdjustCurrencyForRemove:function(/*int*/ index) 
        {
            if (index < 0) 
                return;

            // adjust current index if deletion is earlier
            if (index < this.CurrentPosition) 
            {
                var newCurrentPosition = this.CurrentPosition - 1; 
                this.SetCurrent(this._viewList.Get(newCurrentPosition), newCurrentPosition); 
            }
            // move currency off the deleted element 
            else if (index == this.CurrentPosition)
            {
            	this._currentElementWasRemoved = true;
            } 
        },
 
        // set CurrentItem to the item at CurrentPosition 
//        private void 
        MoveCurrencyOffDeletedElement:function()
        { 
            var lastPosition = this.ViewCount - 1;   // OK if last is -1
            // if position falls beyond last position, move back to last position
            var newPosition = (this.CurrentPosition < lastPosition) ? this.CurrentPosition : lastPosition;
 
            // reset this before raising events to avoid problems in re-entrancy
            this._currentElementWasRemoved = false; 
 
            // ignore cancel, there's no choice in this currency change
            this.OnCurrentChanging(); 
            // update CurrentItem to match new position
            this._MoveCurrentToPosition(newPosition);

            this.OnCurrentChanged(); 
        },
 
        /// <summary> 
        /// Helper to raise a PropertyChanged event  />).
        /// </summary> 
//        private void 
        OnPropertyChanged:function(/*string*/ propertyName)
        {
        	CollectionView.prototype.OnPropertyChanged.call(this, new PropertyChangedEventArgs(propertyName));
        } 

	});
	
	Object.defineProperties(InnerItemCollectionView.prototype,{
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
//        public override SortDescriptionCollection 
        SortDescriptions: 
        {
            get:function() 
            {
                if (this._sort == null)
                	this.SetSortDescriptions(new SortDescriptionCollection());
                return this._sort; 
            }
        },
 
        /// <summary>
        /// Test if this ICollectionView supports sorting before adding 
        /// to <seealso cref="SortDescriptions"/>.
        /// </summary>
//        public override bool 
        CanSort:
        { 
            get:function() { return true; }
        },
        

//        public bool 
        IsReadOnly:
        {
            get:function() { return false; }
        },

//        public bool 
        IsFixedSize:
        { 
            get:function() { return false; }
        },
        
//        public override IEnumerable 
        SourceCollection:
        { 
            get:function() { return this; } 
        },
 
        /// <summary>
        /// Return the number of records in (filtered) view
        /// </summary>
//        public override int 
        Count: 
        {
            get:function() 
            { 
                return this.ViewCount;
            } 
        },

        /// <summary>
        /// Returns true if the resulting (filtered) view is emtpy. 
        /// </summary>
//        public override bool 
        IsEmpty:
        { 
            get:function()
            { 
                return this.ViewCount == 0;
            }
        },
 
//        public override bool 
        NeedsRefresh:
        { 
            get:function()
            {
//                return base.NeedsRefresh || this._isModified; 
            	return CollectionView.prototype.NeedsRefresh || this._isModified; 
            }
        },

//        internal ItemCollection 
        ItemCollection:
        { 
            get:function() { return this._itemCollection; }
        }, 
 
//        internal IEnumerator 
        LogicalChildren:
        { 
            get:function()
            {
                return this._rawList.GetEnumerator();
            } 
        },
 
//        internal int 
        RawCount:
        { 
            get:function() { return this._rawList.Count; }
        },

//        private int 
        ViewCount: 
        {
            get:function() { return this._viewList.Count; } 
        }, 

        // Cached Mode is when two lists are maintained. 
//        private bool 
        IsCachedMode:
        {
            get:function() { return this._viewList != this._rawList; }
        },

//        private FrameworkElement 
        ModelParentFE:
        { 
            get:function() { return this.ItemCollection.ModelParentFE; }
        }, 

//        private bool 
        IsCurrentInView:
        {
            get:function() 
            {
                return (0 <= this.CurrentPosition && this.CurrentPosition < this.ViewCount); 
            } 
        }
 
	});
	
	InnerItemCollectionView.Type = new Type("InnerItemCollectionView", InnerItemCollectionView, 
			[CollectionView.Type, IList.Type]);
	return InnerItemCollectionView;
});
//        // InnerItemCollectionView will return itself as SourceCollection (SourceCollection property is overridden); 
//        // shouldProcessCollectionChanged is turned off because this class will handle its own events.
//        public InnerItemCollectionView(int capacity, ItemCollection itemCollection)
//            : base(EmptyEnumerable.Instance, false)
//        { 
//            // This list is cloned and diverged when Sort/Filter is applied.
//            _rawList = _viewList = new ArrayList(capacity); 
//            _itemCollection = itemCollection; 
//        }
//
//  
// 
//        SortDescriptionCollection _sort;
//        ArrayList _viewList, _rawList; 
//        ItemCollection _itemCollection; 
//        bool _isModified;
//        bool _currentElementWasRemoved = false; // true if we need to MoveCurrencyOffDeletedElement 


