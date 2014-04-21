/**
 * BindingListCollView
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/SortDescriptionCollection", "data/CollectionView",
        "componentmodel/IEditableCollectionView", "componentmodel/ICollectionViewLiveShaping", "componentmodel/IItemProperties"], 
		function(declare, Type, SortDescriptionCollection, CollectionView, 
				IEditableCollectionView, ICollectionViewLiveShaping, IItemProperties){
//	private class 
	var BindingListSortDescriptionCollection =declare(SortDescriptionCollection, {
		constructor:function(/*bool*/ allowMultipleDescriptions)
        { 
            this._allowMultipleDescriptions = allowMultipleDescriptions;
        },
        
        /// <summary>
        /// called by base class ObservableCollection&lt;T&gt; when an item is added to list; 
        /// </summary>
//        protected override void 
        InsertItem:function(/*int*/ index, /*SortDescription*/ item)
        {
            if (!this._allowMultipleDescriptions && (this.Count > 0)) 
            {
                throw new InvalidOperationException(SR.Get(SRID.BindingListCanOnlySortByOneProperty)); 
            } 
//            base.InsertItem(index, item);
            SortDescriptionCollection.prototype.InsertItem.call(this, index, item);
        } 
	});
	 
	var BindingListCollView = declare("BindingListCollView", 
			[CollectionView, IEditableCollectionView, ICollectionViewLiveShaping, IItemProperties],{
		constructor:function(/*IBindingList*/ list) 
        { 
//            : base(list)
			CollectionView.prototype.constructor.call(this, list);
			
//	        private CollectionViewGroupRoot 
			this._group = null;
			
//	        private bool                
			this._isGrouping = false; 
			
//	        private IBindingListView    
			this._blv = null; 
			
//	        private BindingListSortDescriptionCollection 
			this._sort = null;
			
//	        private IList               
			this._shadowList = null; 
			
//	        private bool                
			this._isSorted = false;
			
//	        private IComparer           
			this._comparer = null;
			
//	        private string              
			this._customFilter = null;
			
//	        private bool                
			this._isFiltered = false; 
			
//	        private bool                
			this._ignoreInnerRefresh = false;
			
//	        private bool?               
			this._itemsRaisePropertyChanged = false; 
			
//	        private bool                
			this._isDataView = false; 
			
//	        private object              
			this._newItem = NoNewItem;
			
//	        private object              
			this._editItem = null; 
			
//	        private int                 
			this._newItemIndex = 0;  // position of _newItem in the source collection
			
//	        private NewItemPlaceholderPosition 
			this._newItemPlaceholderPosition = null;
			
//	        private List<Action>        
			this._deferredActions = null;
			
//	        bool                        
			this._isRemoving = null; 
			
//	        private bool?               
			this._isLiveGrouping = false;
			
//	        private bool                
			this._isLiveShapingDirty = false; 
			
//	        private ObservableCollection<string>    
			this._liveSortingProperties = null; 
			
//	        private ObservableCollection<string>    
			this._liveFilteringProperties = null;
			
//	        private ObservableCollection<string>    
			this._liveGroupingProperties = null; 

	        // to handle ItemRemoved directly, we need to remember the items -
	        // IBL's event args tell us the index, not the item itself
//	        private IList               
			this._cachedList = null; 
			
            this.InternalList = list; 
            this._blv = list instanceof IBindingListView ? list : null;
            this._isDataView = SystemDataHelper.IsDataView(list); 

            this.SubscribeToChanges();

            this._group = new CollectionViewGroupRoot(this); 
            this._group.GroupDescriptionChanged.Combine(new EventHandler(this, this.OnGroupDescriptionChanged));
            this._group.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupChanged)); 
			this._group.GroupDescriptions.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnGroupByChanged)); 
        },
        
      /// <summary> 
        /// Return true if the item belongs to this view.  The item is assumed to belong to the
        /// underlying DataCollection;  this method merely takes filters into account. 
        /// It is commonly used during collection-changed notifications to determine if the added/removed
        /// item requires processing.
        /// Returns true if no filter is set on collection view.
        /// </summary> 
//        public override bool 
        PassesFilter:function(/*object*/ item)
        { 
            if (this.IsCustomFilterSet) 
                return this.Contains(item);  // need to ask inner list, not cheap but only way to determine
            else 
                return true;    // every item is contained
        },

        /// <summary> 
        /// Return true if the item belongs to this view.  No assumptions are
        /// made about the item. This method will behave similarly to IList.Contains(). 
        /// </summary> 
//        public override bool 
        Contains:function(/*object*/ item)
        { 
        	this.VerifyRefreshNotDeferred();

            return (item == this.NewItemPlaceholder) ? (this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None)
                                                : this.CollectionProxy.Contains(item); 
        },
 
        /// <summary> 
        /// Move <seealso cref="CollectionView.CurrentItem"/> to the item at the given index.
        /// </summary> 
        /// <param name="position">Move CurrentItem to this index</param>
        /// <returns>true if <seealso cref="CollectionView.CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentToPosition:function(/*int*/ position)
        { 
        	this.VerifyRefreshNotDeferred();
 
            if (position < -1 || position > this.InternalCount) 
                throw new ArgumentOutOfRangeException("position");
 
            this._MoveTo(position);
            return this.IsCurrentInView;
        },


        /// <summary> Return -, 0, or +, according to whether o1 occurs before, at, or after o2 (respectively)
        /// </summary>
        /// <param name="o1">first object</param> 
        /// <param name="o2">second object</param>
        /// <remarks> 
        /// Compares items by their resp. index in the IList. 
        /// </remarks>
//        int IComparer.
        Compare:function(/*object*/ o1, /*object*/ o2) 
        {
            var i1 = this.InternalIndexOf(o1);
            var i2 = this.InternalIndexOf(o2);
            return (i1 - i2); 
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
        	this.VerifyRefreshNotDeferred(); 

            return this.InternalIndexOf(item); 
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
        	this.VerifyRefreshNotDeferred();

            return this.InternalItemAt(index); 
        },
 
        /// <summary> 
        /// Implementation of IEnumerable.GetEnumerator().
        /// This provides a way to enumerate the members of the collection 
        /// without changing the currency.
        /// </summary>
//        protected override IEnumerator 
        GetEnumerator:function()
        { 
        	this.VerifyRefreshNotDeferred();
 
            return this.InternalGetEnumerator(); 
        },
 
        /// <summary>
        /// Detach from the source collection.  (I.e. stop listening to the collection's
        /// events, or anything else that makes the CollectionView ineligible for
        /// garbage collection.) 
        /// </summary>
//        public override void 
        DetachFromSourceCollection:function() 
        { 
            if (this.InternalList != null && this.InternalList.SupportsChangeNotification)
            { 
            	this.InternalList.ListChanged.Remove(new ListChangedEventHandler(this, this.OnListChanged));
            }

            this.InternalList = null; 

            CollectionView.prototype.DetachFromSourceCollection.call(this); 
        },
 
        /// <summary>
        /// Add a new item to the underlying collection.  Returns the new item. 
        /// After calling AddNew and changing the new item as desired, either 
        /// <seealso cref="CommitNew"/> or <seealso cref="CancelNew"/> should be
        /// called to complete the transaction. 
        /// </summary>
//        public object 
        AddNew:function()
        {
        	this.VerifyRefreshNotDeferred(); 

            if (this.IsEditingItem) 
            { 
            	this.CommitEdit();   // implicitly close a previous EditItem
            } 

            this.CommitNew();        // implicitly close a previous AddNew

            if (!CanAddNew) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "AddNew"));
 
            var newItem = null; 
            BindingOperations.AccessCollection(this.InternalList,
                /*() =>*/function() 
                {
            		this.ProcessPendingChanges();

            		this._newItemIndex = -2; // this is a signal that the next ItemAdded event comes from AddNew 
                    newItem = this.InternalList.AddNew();
                }, 
                true); 

//            Debug.Assert(_newItemIndex != -2 && newItem == _newItem, "AddNew did not raise expected events"); 

            this.MoveCurrentTo(newItem);

            /*ISupportInitialize*/var isi = newItem instanceof ISupportInitialize ? newItem : null; 
            if (isi != null)
            { 
                isi.BeginInit(); 
            }
 
            // DataView.AddNew calls BeginEdit on the new item, but other implementations
            // of IBL don't.  Make up for them.
            if (!this.IsDataView)
            { 
                /*IEditableObject*/var ieo = newItem instanceof IEditableObject ? newItem : null;
                if (ieo != null) 
                { 
                    ieo.BeginEdit();
                } 
            }

            return newItem;
        }, 

        // Calling IBL.AddNew() will raise an ItemAdded event.  We handle this specially 
        // to adjust the position of the new item in the view (it should be adjacent 
        // to the placeholder), and cache the new item for use by the other APIs
        // related to AddNew.  This method is called from ProcessCollectionChanged. 
        // The index gives the adjusted position of the newItem in the view;  this
        // differs from its position in the source collection by 1 if we've added
        // a placeholder at the beginning.
//        void 
        BeginAddNew:function(/*object*/ newItem, /*int*/ index) 
        {
//            Debug.Assert(_newItemIndex == -2 && _newItem == NoNewItem, "unexpected call to BeginAddNew"); 
 
            // remember the new item and its position in the underlying list
        	this.SetNewItem(newItem); 
        	this._newItemIndex = index;

            // adjust the position of the new item
            // (not needed when grouping, as we'll be inserting into the group structure) 
            var position = index;
            if (!this._isGrouping) 
            { 
                switch (NewItemPlaceholderPosition)
                { 
                    case NewItemPlaceholderPosition.None:
                        break;
                    case NewItemPlaceholderPosition.AtBeginning:
                        -- this._newItemIndex; 
                        position = 1;
                        break; 
                    case NewItemPlaceholderPosition.AtEnd: 
                        position = this.InternalCount - 2;
                        break; 
                }
            }

            // raise events as if the new item appeared in the adjusted position 
            this.ProcessCollectionChanged(new NotifyCollectionChangedEventArgs(
                                            NotifyCollectionChangedAction.Add, 
                                            newItem, 
                                            position));
        }, 

        /// <summary>
        /// Complete the transaction started by <seealso cref="AddNew"/>.  The new
        /// item remains in the collection, and the view's sort, filter, and grouping 
        /// specifications (if any) are applied to the new item.
        /// </summary> 
//        public void 
        CommitNew:function() 
        {
            if (this.IsEditingItem) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CommitNew", "EditItem"));
            this.VerifyRefreshNotDeferred();

            if (this._newItem == CollectionView.NoNewItem) 
                return;
 
            // commit the new item 
            /*ICancelAddNew*/var ican = this.InternalList instanceof ICancelAddNew ? this.InternalList : null;
            /*IEditableObject*/var ieo; 

            BindingOperations.AccessCollection(InternalList,
                /*() =>*/function()
                { 
                    ProcessPendingChanges();
 
                    if (ican != null) 
                    {
                        ican.EndNew(_newItemIndex); 
                    }
                    else if ((ieo = this._newItem instanceof IEditableObject ? this._newItem : null) != null)
                    {
                        ieo.EndEdit(); 
                    }
                }, 
                true); 

            // DataView raises events that cause us to update the view 
            // correctly (including leaving AddNew mode).  BindingList<T> does not
            // raise these events.  If they haven't happened, do the work now.
            if (this._newItem != CollectionView.NoNewItem)
            { 
                var delta = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
                /*NotifyCollectionChangedEventArgs*/var args = this.ProcessCommitNew(this._newItemIndex, this._newItemIndex + delta); 
                if (args != null) 
                {
//                    base.OnCollectionChanged(InternalList, args); 
                    CollectionView.prototype.OnCollectionChanged.call(this, this.InternalList, args);
                }
            }
        },
 
        /// <summary>
        /// Complete the transaction started by <seealso cref="AddNew"/>.  The new 
        /// item is removed from the collection. 
        /// </summary>
//        public void 
        CancelNew:function() 
        {
            if (this.IsEditingItem)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CancelNew", "EditItem"));
            this.VerifyRefreshNotDeferred(); 

            if (this._newItem == CollectionView.NoNewItem) 
                return; 

            // cancel the AddNew 
            /*ICancelAddNew*/var ican = this.InternalList instanceof ICancelAddNew ? this.InternalList : null;
            /*IEditableObject*/var ieo;

            BindingOperations.AccessCollection(this.InternalList, 
                /*() =>*/function()
                { 
                    ProcessPendingChanges(); 

                    if (ican != null) 
                    {
                        ican.CancelNew(this._newItemIndex);
                    }
                    else if ((ieo = this._newItem instanceof IEditableObject ? this._newItem : null) != null) 
                    {
                        ieo.CancelEdit(); 
                    } 
                },
                true); 

            // DataView raises events that cause us to update the view
            // correctly (including leaving AddNew mode).  BindingList<T> does not
            // raise these events.  If they haven't happened, do the work now. 
            if (this._newItem != CollectionView.NoNewItem)
            { 
//                Debug.Assert(true); 
            }
        }, 

        // Common functionality used by CommitNew, CancelNew, and when the
        // new item is removed by Remove or Refresh.
//        object 
        EndAddNew:function(/*bool*/ cancel) 
        {
            /*object*/var newItem = this._newItem; 
 
            this.SetNewItem(NoNewItem);  // leave "adding-new" mode
 
            /*IEditableObject*/var ieo = newItem instanceof IEditableObject ? newItem : null;
            if (ieo != null)
            {
                if (cancel) 
                {
                    ieo.CancelEdit(); 
                } 
                else
                { 
                    ieo.EndEdit();
                }
            }
 
            /*ISupportInitialize*/var isi = newItem instanceof ISupportInitialize ? newItem : null;
            if (isi != null) 
            { 
                isi.EndInit();
            } 

            return newItem;
        },
 
//        NotifyCollectionChangedEventArgs 
        ProcessCommitNew:function(/*int*/ fromIndex, /*int*/ toIndex)
        { 
            if (this._isGrouping) 
            {
            	this.CommitNewForGrouping(); 
                return null;
            }

            // CommitNew either causes the list to raise an event, or not. 
            // In either case, leave AddNew mode and raise a Move event if needed.
            switch (this.NewItemPlaceholderPosition) 
            { 
                case NewItemPlaceholderPosition.None:
                    break; 
                case NewItemPlaceholderPosition.AtBeginning:
                    fromIndex = 1;
                    break;
                case NewItemPlaceholderPosition.AtEnd: 
                    fromIndex = this.InternalCount - 2;
                    break; 
            } 

            var newItem = this.EndAddNew(false); 

            /*NotifyCollectionChangedEventArgs*/var result = null;
            if (fromIndex != toIndex)
            { 
                result = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, newItem, toIndex, fromIndex);
            } 
 
            return result;
        },

//        void 
        CommitNewForGrouping:function()
        {
            // for grouping we cannot pretend that the new item moves to a different position, 
            // since it may actually appear in several new positions (belonging to several groups).
            // Instead, we remove the item from its temporary position, then add it to the groups 
            // as if it had just been added to the underlying collection. 
            var index;
            switch (this.NewItemPlaceholderPosition) 
            {
                case NewItemPlaceholderPosition.None:
                default:
                    index = this._group.Items.Count - 1; 
                    break;
                case NewItemPlaceholderPosition.AtBeginning: 
                    index = 1; 
                    break;
                case NewItemPlaceholderPosition.AtEnd: 
                    index = this._group.Items.Count - 2;
                    break;
            }
 
            // End the AddNew transaction
            var newItem = this.EndAddNew(false); 
 
            // remove item from its temporary position
            this._group.RemoveSpecialItem(index, newItem, false /*loading*/); 

            // add it to the groups
            this.AddItemToGroups(newItem);
        }, 

//        void 
        SetNewItem:function(/*object*/ item)
        { 
            if (!Object.Equals(item, this._newItem)) 
            {
            	this._newItem = item; 

            	this.OnPropertyChanged("CurrentAddItem");
            	this.OnPropertyChanged("IsAddingNew");
            	this.OnPropertyChanged("CanRemove"); 
            }
        }, 

        /// <summary>
        /// Remove the item at the given index from the underlying collection. 
        /// The index is interpreted with respect to the view (not with respect to
        /// the underlying collection). 
        /// </summary> 
//        public void 
        RemoveAt:function(/*int*/ index)
        { 
            if (this.IsEditingItem || this.IsAddingNew)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "RemoveAt"));
            this.VerifyRefreshNotDeferred();
 
            this.RemoveImpl(this.GetItemAt(index), index);
        }, 
 
        /// <summary>
        /// Remove the given item from the underlying collection. 
        /// </summary>
//        public void 
        Remove:function(/*object*/ item)
        {
            if (this.IsEditingItem || this.IsAddingNew) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Remove"));
            this.VerifyRefreshNotDeferred(); 
 
            var index = this.InternalIndexOf(item);
            if (index >= 0) 
            {
            	this.RemoveImpl(item, index);
            }
        }, 

//        void 
        RemoveImpl:function(/*object*/ item, /*int*/ index) 
        { 
            if (item == CollectionView.NewItemPlaceholder)
                throw new InvalidOperationException(SR.Get(SRID.RemovingPlaceholder)); 

            BindingOperations.AccessCollection(InternalList,
                /*() =>*/function()
                { 
            		this.ProcessPendingChanges();
 
                    // the pending changes may have moved (or even removed) the 
                    // item.   Verify the index.
                    if (index >= this.InternalList.Count || !Object.Equals(item, this.GetItemAt(index))) 
                    {
                        index = this.InternalList.IndexOf(item);
                        if (index < 0)
                            return; 
                    }
 
                    // convert the index from "view-relative" to "list-relative" 
                    if (this._isGrouping)
                    { 
                        index = this.InternalList.IndexOf(item);
                    }
                    else
                    { 
                        var delta = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
                        index = index - delta; 
                    } 

                    // remove the item from the list 
                    try
                    {
                    	this._isRemoving = true;
                    	this.InternalList.RemoveAt(index); 
                    }
                    finally 
                    { 
                    	this._isRemoving = false;
                    	this.DoDeferredActions(); 
                    }
                },
                true);
        }, 

        /// <summary>
        /// Begins an editing transaction on the given item.  The transaction is
        /// completed by calling either <seealso cref="CommitEdit"/> or
        /// <seealso cref="CancelEdit"/>.  Any changes made to the item during 
        /// the transaction are considered "pending", provided that the view supports
        /// the notion of "pending changes" for the given item. 
        /// </summary> 
//        public void 
        EditItem:function(/*object*/ item)
        { 
        	this.VerifyRefreshNotDeferred();

            if (item == this.NewItemPlaceholder)
                throw new ArgumentException(SR.Get(SRID.CannotEditPlaceholder), "item"); 

            if (this.IsAddingNew) 
            { 
                if (Object.Equals(item, this._newItem))
                    return;     // EditItem(newItem) is a no-op 

                this.CommitNew();    // implicitly close a previous AddNew
            }
 
            this.CommitEdit();   // implicitly close a previous EditItem transaction
 
            this.SetEditItem(item); 

            /*IEditableObject*/var ieo = item instanceof IEditableObject ? item : null; 
            if (ieo != null)
            {
                ieo.BeginEdit();
            } 
        },
 
        /// <summary> 
        /// Complete the transaction started by <seealso cref="EditItem"/>.
        /// The pending changes (if any) to the item are committed. 
        /// </summary>
//        public void 
        CommitEdit:function()
        {
            if (this.IsAddingNew) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CommitEdit", "AddNew"));
            this.VerifyRefreshNotDeferred(); 
 
            if (this._editItem == null)
                return; 

            /*IEditableObject*/var ieo = this._editItem instanceof IEditableObject ? this._editItem : null;
            var editItem = this._editItem;
            this.SetEditItem(null); 

            if (ieo != null) 
            { 
                BindingOperations.AccessCollection(InternalList,
                    /*() => */function()
                    {
                	this.ProcessPendingChanges();
                        ieo.EndEdit();
                    }, 
                    true);
            } 
 
            // editing may change the item's group names (and we can't tell whether
            // it really did).  The best we can do is remove the item and re-insert 
            // it.
            if (this._isGrouping)
            {
            	this.RemoveItemFromGroups(editItem); 
            	this.AddItemToGroups(editItem);
                return; 
            } 
        },
 
        /// <summary>
        /// Complete the transaction started by <seealso cref="EditItem"/>.
        /// The pending changes (if any) to the item are discarded.
        /// </summary> 
//        public void 
        CancelEdit:function()
        { 
            if (this.IsAddingNew) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "CancelEdit", "AddNew"));
            this.VerifyRefreshNotDeferred(); 

            if (this._editItem == null)
                return;
 
            /*IEditableObject*/var ieo = this._editItem instanceof IEditableObject ? this._editItem : null;
            this.SetEditItem(null); 
 
            if (ieo != null)
            { 
                ieo.CancelEdit();
            }
            else
                throw new InvalidOperationException(SR.Get(SRID.CancelEditNotSupported)); 
        },
 
//        private void 
        ImplicitlyCancelEdit:function() 
        {
            /*IEditableObject*/var ieo = this._editItem instanceof IEditableObject ? this._editItem : null; 
            this.SetEditItem(null);

            if (ieo != null)
            { 
                ieo.CancelEdit();
            } 
        }, 

//        void 
        SetEditItem:function(/*object*/ item)
        { 
            if (!Object.Equals(item, this._editItem))
            { 
            	this._editItem = item; 

            	this.OnPropertyChanged("CurrentEditItem"); 
            	this.OnPropertyChanged("IsEditingItem");
            	this.OnPropertyChanged("CanCancelEdit");
            	this.OnPropertyChanged("CanAddNew");
            	this.OnPropertyChanged("CanRemove"); 
            }
        },

//        void 
        OnLivePropertyListChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (this.IsLiveGrouping == true) 
            { 
            	this.RefreshOrDefer();
            } 
        },
        /// <summary>
        /// Re-create the view over the associated IList
        /// </summary> 
        /// <remarks>
        /// Any sorting and filtering will take effect during Refresh. 
        /// </remarks> 
//        protected override void 
        RefreshOverride:function()
        { 
            var oldCurrentItem = this.CurrentItem;
            var oldCurrentPosition = this.IsEmpty ? 0 : this.CurrentPosition;
            var oldIsCurrentAfterLast = this.IsCurrentAfterLast;
            var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst; 

            // force currency off the collection (gives user a chance to save dirty information) 
            this.OnCurrentChanging(); 

            // changing filter and sorting will cause the inner IBindingList(View) to 
            // raise refresh action; ignore those until done setting filter/sort
            this._ignoreInnerRefresh = true;

            // IBindingListView can support filtering 
            if (this.IsCustomFilterSet || this._isFiltered)
            { 
                BindingOperations.AccessCollection(this.InternalList, 
                    /*() =>*/function()
                    { 
                        if (this.IsCustomFilterSet)
                        {
                        	this._isFiltered = true;
                        	this._blv.Filter = this._customFilter; 
                        }
                        else if (this._isFiltered) 
                        { 
                            // app has cleared filter
                        	this._isFiltered = false; 
                        	this._blv.RemoveFilter();
                        }
                    },
                    true); 
            }
 
            if ((this._sort != null) && (this._sort.Count > 0) && (this.CollectionProxy != null) && (this.CollectionProxy.Count > 0)) 
            {
                // convert Avalon SortDescription collection to .Net 
                // (i.e. string property names become PropertyDescriptors)
                /*ListSortDescriptionCollection*/var sorts = this.ConvertSortDescriptionCollection(this._sort);

                if (sorts.Count > 0) 
                {
                	this._isSorted = true; 
                    BindingOperations.AccessCollection(InternalList, 
                       /* () =>*/function()
                        { 
                            if (this._blv == null)
                            	this.InternalList.ApplySort(sorts.Get(0).PropertyDescriptor, sorts.Get(0).SortDirection);
                            else
                            	this._blv.ApplySort(sorts); 
                        },
                        true); 
                } 
                this.ActiveComparer = new SortFieldComparer(this._sort, Culture);
            } 
            else if (this._isSorted)
            {
                // undo any previous sorting
            	this._isSorted = false; 
                BindingOperations.AccessCollection(this.InternalList,
                    /*() => */function()
                    { 
                        InternalList.RemoveSort();
                    }, 
                    true);
                this.ActiveComparer = null;
            }
 
            this.InitializeGrouping();
 
            // refresh cached list with any changes 
            this.PrepareCachedList();
 
            this.PrepareGroups();

            // reset currency
            if (oldIsCurrentBeforeFirst || this.IsEmpty) 
            {
            	this.SetCurrent(null, -1); 
            } 
            else if (oldIsCurrentAfterLast)
            { 
            	this.SetCurrent(null, this.InternalCount);
            }
            else
            { 
                // oldCurrentItem may be null
 
                // if there are duplicates, use the position of the first matching item 
                //ISSUE windows#868101 DataRowView.IndexOf(oldCurrentItem) returns wrong index, wrong current item gets restored
                var newPosition = this.InternalIndexOf(oldCurrentItem); 

                if (newPosition < 0)
                {
                    // oldCurrentItem not found: move to first item 
                    var newItem;
                    newPosition = (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 
                                1 : 0; 
                    if (newPosition < this.InternalCount && (newItem = this.InternalItemAt(newPosition)) != this.NewItemPlaceholder)
                    { 
                    	this.SetCurrent(newItem, newPosition);
                    }
                    else
                    { 
                    	this.SetCurrent(null, -1);
                    } 
                } 
                else
                { 
                	this.SetCurrent(oldCurrentItem, newPosition);
                }
            }
 
            this._ignoreInnerRefresh = false;
 
            // tell listeners everything has changed 
            this.OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
 
            this.OnCurrentChanged();

            if (this.IsCurrentAfterLast != oldIsCurrentAfterLast)
            	this.OnPropertyChanged(this.IsCurrentAfterLastPropertyName); 

            if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst) 
            	this.OnPropertyChanged(this.IsCurrentBeforeFirstPropertyName); 

            if (oldCurrentPosition != this.CurrentPosition) 
            	this.OnPropertyChanged(CurrentPositionPropertyName);

            if (oldCurrentItem != this.CurrentItem)
            	this.OnPropertyChanged(CurrentItemPropertyName); 
        },
 
//        protected override void 
        OnAllowsCrossThreadChangesChanged:function() 
        {
        	this.PrepareCachedList(); 
        },

//        void 
        PrepareCachedList:function()
        { 
            if (this.AllowsCrossThreadChanges)
            { 
                BindingOperations.AccessCollection(InternalList, 
                    /*() =>*/function()
                    { 
                	this.RebuildLists();
                    },
                    false);
            } 
            else
            { 
            	this.RebuildListsCore(); 
            }
        }, 

        // this must be called under read-access protection to InternalList
//        void 
        RebuildLists:function()
        { 
        	this.ClearPendingChanges(); 
        	this.RebuildListsCore();
        },

//        void 
        RebuildListsCore:function()
        { 
        	this._cachedList = new ArrayList(this.InternalList);
            /*LiveShapingList*/var lsList = this._shadowList instanceof LiveShapingList ?  this._shadowList : null; 
 
            if (lsList != null)
                lsList.LiveShapingDirty -= new EventHandler(this.OnLiveShapingDirty); 

            if (this._isGrouping && this.IsLiveGrouping == true)
            {
            	this._shadowList = lsList = new LiveShapingList(this, this.GetLiveShapingFlags(), this.ActiveComparer); 

                for/*each*/ (var i=0; i<this.InternalList.Count; i++) 
                { 
                	this.lsList.Add(this.InternalList.Get(i));
                } 

                this.lsList.LiveShapingDirty += new EventHandler(this.OnLiveShapingDirty);
            }
            else if (this.AllowsCrossThreadChanges) 
            {
            	this._shadowList = new ArrayList(this.InternalList); 
            } 
            else
            { 
            	this._shadowList = null;
            }
        },
 
        /// <summary>
        ///     Obsolete.   Retained for compatibility. 
        ///     Use OnAllowsCrossThreadChangesChanged instead. 
        /// </summary>
        /// <param name="args"> 
        ///     The NotifyCollectionChangedEventArgs that is added to the change log
        /// </param>
//        protected override void 
        OnBeginChangeLogging:function(/*NotifyCollectionChangedEventArgs*/ args) 
        {
        }, 
 

        /// <summary> 
        ///     Must be implemented by the derived classes to process a single change on the
        ///     UIContext.  The UIContext will have allready been entered by now.
        /// </summary>
        /// <param name="args"> 
        ///     The NotifyCollectionChangedEventArgs to be processed.
        /// </param> 
//        protected override void 
        ProcessCollectionChanged:function(/*NotifyCollectionChangedEventArgs*/ args) 
        {
            var shouldRaiseEvent = false; 

            this.ValidateCollectionChangedEventArgs(args);

            var originalCurrentPosition = this.CurrentPosition; 
            var oldCurrentPosition = this.CurrentPosition;
            var oldCurrentItem = this.CurrentItem; 
            var oldIsCurrentAfterLast = this.IsCurrentAfterLast; 
            var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;
            var moveCurrency = false; 

            switch (args.Action)
            {
                case NotifyCollectionChangedAction.Add: 
                    if (_newItemIndex == -2)
                    { 
                        // The ItemAdded event came from AddNew. 
                    	this.BeginAddNew(args.NewItems[0], args.NewStartingIndex);
                        return; 
                    }
                    else if (this._isGrouping)
                    	this.AddItemToGroups(args.NewItems[0]);
                    else 
                    {
                    	this.AdjustCurrencyForAdd(args.NewStartingIndex); 
                        shouldRaiseEvent = true; 
                    }
                    break; 

                case NotifyCollectionChangedAction.Remove:
                    if (this._isGrouping)
                    	this.RemoveItemFromGroups(args.OldItems[0]); 
                    else
                    { 
                        moveCurrency = this.AdjustCurrencyForRemove(args.OldStartingIndex); 
                        shouldRaiseEvent = true;
                    } 
                    break;

                case NotifyCollectionChangedAction.Replace:
                    if (this._isGrouping) 
                    {
                    	this.RemoveItemFromGroups(args.OldItems[0]); 
                    	this.AddItemToGroups(args.NewItems[0]); 
                    }
                    else 
                    {
                        moveCurrency = this.AdjustCurrencyForReplace(args.NewStartingIndex);
                        shouldRaiseEvent = true;
                    } 
                    break;
 
                case NotifyCollectionChangedAction.Move: 
                    if (!this._isGrouping)
                    { 
                    	this.AdjustCurrencyForMove(args.OldStartingIndex, args.NewStartingIndex);
                        shouldRaiseEvent = true;
                    }
                    else 
                    {
                    	this._group.MoveWithinSubgroups(args.OldItems[0], null, InternalList, args.OldStartingIndex, args.NewStartingIndex); 
                    } 
                    break;
 
                case NotifyCollectionChangedAction.Reset:
                    if (this._isGrouping)
                    	this.RefreshOrDefer();
                    else 
                        shouldRaiseEvent = true;
                    break; 
 
                default:
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, args.Action)); 
            }

            if (this.AllowsCrossThreadChanges)
            { 
            	this.AdjustShadowCopy(args);
            } 
 

            // remember whether scalar properties of the view have changed. 
            // They may change again during the collection change event, so we
            // need to do the test before raising that event.
            var afterLastHasChanged = (this.IsCurrentAfterLast != oldIsCurrentAfterLast);
            var beforeFirstHasChanged = (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst); 
            var currentPositionHasChanged = (this.CurrentPosition != oldCurrentPosition);
            var currentItemHasChanged = (this.CurrentItem != oldCurrentItem); 
 
            // take a new snapshot of the scalar properties, so that we can detect
            // changes made during the collection change event 
            oldIsCurrentAfterLast = this.IsCurrentAfterLast;
            oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;
            oldCurrentPosition = this.CurrentPosition;
            oldCurrentItem = this.CurrentItem; 

            if (shouldRaiseEvent) 
            { 
            	this.OnCollectionChanged(args);
 
                // Any scalar properties that changed don't need a further notification,
                // but do need a new snapshot
                if (this.IsCurrentAfterLast != oldIsCurrentAfterLast)
                { 
                    afterLastHasChanged = false;
                    oldIsCurrentAfterLast = this.IsCurrentAfterLast; 
                } 
                if (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
                { 
                    beforeFirstHasChanged = false;
                    oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;
                }
                if (this.CurrentPosition != oldCurrentPosition) 
                {
                    currentPositionHasChanged = false; 
                    oldCurrentPosition = this.CurrentPosition; 
                }
                if (this.CurrentItem != oldCurrentItem) 
                {
                    currentItemHasChanged = false;
                    oldCurrentItem = this.CurrentItem;
                } 
            }
 
            // currency has to change after firing the deletion event, 
            // so event handlers have the right picture
            if (moveCurrency) 
            {
            	this.MoveCurrencyOffDeletedElement(originalCurrentPosition);

                // changes to the scalar properties need notification 
                afterLastHasChanged = afterLastHasChanged || (this.IsCurrentAfterLast != oldIsCurrentAfterLast);
                beforeFirstHasChanged = beforeFirstHasChanged || (this.IsCurrentBeforeFirst != oldIsCurrentBeforeFirst); 
                currentPositionHasChanged = currentPositionHasChanged || (this.CurrentPosition != oldCurrentPosition); 
                currentItemHasChanged = currentItemHasChanged || (this.CurrentItem != oldCurrentItem);
            } 

            // notify that the properties have changed.  We may end up doing
            // double notification for properties that change during the collection
            // change event, but that's not harmful.  Detecting the double change 
            // is more trouble than it's worth.
            if (afterLastHasChanged) 
            	this.OnPropertyChanged(this.IsCurrentAfterLastPropertyName); 

            if (beforeFirstHasChanged) 
            	this.OnPropertyChanged(this.IsCurrentBeforeFirstPropertyName);

            if (currentPositionHasChanged)
            	this.OnPropertyChanged(this.CurrentPositionPropertyName); 

            if (currentItemHasChanged) 
            	this.OnPropertyChanged(this.CurrentItemPropertyName); 
        },

        /// <summary>
        /// Return index of item in the internal list. 
        /// </summary> 
//        private int 
        InternalIndexOf:function(/*object*/ item)
        { 
            if (this._isGrouping)
            {
                return this._group.LeafIndexOf(item);
            } 

            if (item == this.NewItemPlaceholder) 
            { 
                switch (this.NewItemPlaceholderPosition)
                { 
                    case NewItemPlaceholderPosition.None:
                        return -1;

                    case NewItemPlaceholderPosition.AtBeginning: 
                        return 0;
 
                    case NewItemPlaceholderPosition.AtEnd: 
                        return this.InternalCount - 1;
                } 
            }
            else if (this.IsAddingNew && Object.Equals(item, this._newItem))
            {
                switch (this.NewItemPlaceholderPosition) 
                {
                    case NewItemPlaceholderPosition.None: 
                        break; 

                    case NewItemPlaceholderPosition.AtBeginning: 
                        return 1;

                    case NewItemPlaceholderPosition.AtEnd:
                        return this.InternalCount - 2; 
                }
            } 
 
            var index = this.CollectionProxy.IndexOf(item);
 
            // When you delete the last item from the list,
            // ADO returns a bad value.  Item will be "invalid", in the
            // sense that it is not connected to a table.  But IndexOf(item)
            // returns 10, even though there are only 10 entries in the list. 
            // Looks like they're just returning item.Index without checking
            // anything.  So we have to do the checking for them. 
            if (index >= this.CollectionProxy.Count) 
            {
                index = -1; 
            }

            if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning && index >= 0)
            { 
                index += this.IsAddingNew ? 2 : 1;
            } 
 
            return index;
        }, 

        /// <summary>
        /// Return item at the given index in the internal list.
        /// </summary> 
//        private object 
        InternalItemAt:function(/*int*/ index)
        { 
            if (this._isGrouping) 
            {
                return this._group.LeafAt(index); 
            }

            switch (this.NewItemPlaceholderPosition)
            { 
                case NewItemPlaceholderPosition.None:
                    break; 
 
                case NewItemPlaceholderPosition.AtBeginning:
                    if (index == 0) 
                        return NewItemPlaceholder;
                    --index;

                    if (this.IsAddingNew) 
                    {
                        if (index == 0) 
                            return _newItem; 
                        if (index <= _newItemIndex+1)
                            -- index; 
                    }
                    break;

                case NewItemPlaceholderPosition.AtEnd: 
                    if (index == this.InternalCount - 1)
                        return NewItemPlaceholder; 
                    if (this.IsAddingNew && index == this.InternalCount-2) 
                        return _newItem;
                    break; 
            }

            return this.CollectionProxy.Get(index);
        },

        /// <summary> 
        /// Return true if internal list contains the item. 
        /// </summary>
//        private bool 
        InternalContains:function(/*object*/ item) 
        {
            if (item == this.NewItemPlaceholder)
                return (this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.None);
 
            return (!this._isGrouping) ? this.CollectionProxy.Contains(item) : (this._group.LeafIndexOf(item) >= 0);
        }, 
 
        /// <summary>
        /// Return an enumerator for the internal list. 
        /// </summary>
//        private IEnumerator 
        InternalGetEnumerator:function()
        {
            if (!this._isGrouping) 
            {
                return new PlaceholderAwareEnumerator(this, CollectionProxy.GetEnumerator(), NewItemPlaceholderPosition, _newItem); 
            } 
            else
            { 
                return this._group.GetLeafEnumerator();
            }
        },
 
        // Adjust the ShadowCopy so that it accurately reflects the state of the
        // Data Collection immediately after the CollectionChangeEvent 
//        private void 
        AdjustShadowCopy:function(/*NotifyCollectionChangedEventArgs*/ e) 
        {
            switch (e.Action) 
            {
                case NotifyCollectionChangedAction.Add:
                	this._shadowList.Insert(e.NewStartingIndex, e.NewItems[0]);
                    break; 
                case NotifyCollectionChangedAction.Remove:
                	this._shadowList.RemoveAt(e.OldStartingIndex); 
                    break; 
                case NotifyCollectionChangedAction.Replace:
                	this._shadowList[e.OldStartingIndex] = e.NewItems[0]; 
                    break;
                case NotifyCollectionChangedAction.Move:
                    _shadowList.Move(e.OldStartingIndex, e.NewStartingIndex);
                    break; 
            }
        }, 
 
        // move to a given index
//        private void 
        _MoveTo:function(/*int*/ proposed) 
        { 
            if (proposed == this.CurrentPosition || this.IsEmpty)
                return; 

            /*object*/var proposedCurrentItem = (0 <= proposed && proposed < this.InternalCount) ? this.GetItemAt(proposed) : null;

            if (proposedCurrentItem == this.NewItemPlaceholder) 
                return;         // ignore moves to the placeholder
 
            if (this.OKToChangeCurrent()) 
            {
                var oldIsCurrentAfterLast = this.IsCurrentAfterLast; 
                var oldIsCurrentBeforeFirst = this.IsCurrentBeforeFirst;

                this.SetCurrent(proposedCurrentItem, proposed);
 
                this.OnCurrentChanged();
 
                // notify that the properties have changed. 
                if (this.IsCurrentAfterLast != oldIsCurrentAfterLast)
                	this.OnPropertyChanged(this.IsCurrentAfterLastPropertyName); 

                if (IsCurrentBeforeFirst != oldIsCurrentBeforeFirst)
                	this.OnPropertyChanged(this.IsCurrentBeforeFirstPropertyName);
 
                this.OnPropertyChanged(this.CurrentPositionPropertyName);
                this.OnPropertyChanged(this.CurrentItemPropertyName); 
            } 
        },
 
        // subscribe to change notifications
//        private void 
        SubscribeToChanges:function()
        {
            if (this.InternalList.SupportsChangeNotification) 
            {
                BindingOperations.AccessCollection(this.InternalList, 
                    /*() => */function()
                    {
                		this.InternalList.ListChanged += new ListChangedEventHandler(this.OnListChanged); 
                		this.RebuildLists();
                    },
                    false);
            } 
        },
 
        // IBindingList has changed 
        // At this point we may not have entered the UIContext, but
        // the call to base.OnCollectionChanged will marshall the change over 
//        private void 
        OnListChanged:function(/*object*/ sender, /*ListChangedEventArgs*/ args)
        {
            if (this._ignoreInnerRefresh && (args.ListChangedType == ListChangedType.Reset))
                return; 

            /*NotifyCollectionChangedEventArgs*/var forwardedArgs = null; 
            var item = null; 
            var delta = _isGrouping ? 0 : (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning) ? 1 : 0;
            var index = args.NewIndex; 

            switch (args.ListChangedType)
            {
            case ListChangedType.ItemAdded: 
                // Some implementations of IBindingList raise an extra ItemAdded event
                // when the new item (from a previous call to AddNew) is "committed". 
                // [The IBindingList documentation suggests that all implementations 
                // should do this, but only DataView seems to obey this rather
                // bizarre requirement.]  We will ignore these extra events, unless 
                // they arise from a commit that we initiated.  There's
                // no way to detect them from the event args;  we do it the same
                // way [....].DataGridView does - by comparing counts.
                if (this.InternalList.Count == this._cachedList.Count) 
                {
                    if (this.IsAddingNew && index == this._newItemIndex) 
                    { 
//                        Debug.Assert(_newItem == InternalList[index], "unexpected item while committing AddNew");
                        forwardedArgs = this.ProcessCommitNew(index + delta, index + delta); 
                    }
                }
                else
                { 
                    // normal ItemAdded event
                    item = this.InternalList[index]; 
                    forwardedArgs = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, item, index + delta); 
                    this._cachedList.Insert(index, item);
                    if (this.InternalList.Count != this._cachedList.Count) 
                        throw new InvalidOperationException(SR.Get(SRID.InconsistentBindingList, InternalList, args.ListChangedType));
                    if (index <= this._newItemIndex)
                    {
                        ++ this._newItemIndex; 
                    }
                } 
                break; 

            case ListChangedType.ItemDeleted: 
                item = this._cachedList[index];
                this._cachedList.RemoveAt(index);
                if (this.InternalList.Count != this._cachedList.Count)
                    throw new InvalidOperationException(SR.Get(SRID.InconsistentBindingList, InternalList, args.ListChangedType)); 
                if (index < this._newItemIndex)
                { 
                    -- this._newItemIndex; 
                }
 
                // implicitly cancel AddNew and/or EditItem transactions if the relevant item is removed
                if (item == this.CurrentEditItem)
                {
                	this.ImplicitlyCancelEdit(); 
                }
                if (item == this.CurrentAddItem) 
                { 
                	this.EndAddNew(true);
 
                    switch (this.NewItemPlaceholderPosition)
                    {
                        case NewItemPlaceholderPosition.AtBeginning:
                            index = 0; 
                            break;
                        case NewItemPlaceholderPosition.AtEnd: 
                            index = this.InternalCount - 1; 
                            break;
                    } 
                }

                forwardedArgs = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, item, index + delta);
                break; 

            case ListChangedType.ItemMoved: 
                if (this.IsAddingNew && args.OldIndex == this._newItemIndex) 
                {
                    // ItemMoved applied to the new item.  We assume this is the result 
                    // of committing a new item when a sort is in effect - the item
                    // moves to its sorted position.  There's no way to verify this assumption.
                    item = this._newItem;
//                    Debug.Assert(item == InternalList[index], "unexpected item while committing AddNew"); 
                    forwardedArgs = this.ProcessCommitNew(args.OldIndex, index + delta);
                } 
                else 
                {
                    // normal ItemMoved event 
                    item = InternalList.Get(index);
                    forwardedArgs = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Move, item, index+delta, args.OldIndex+delta);
                    if (args.OldIndex < this._newItemIndex && this._newItemIndex < args.NewIndex)
                    { 
                        -- this._newItemIndex;
                    } 
                    else if (args.NewIndex <= this._newItemIndex && this._newItemIndex < args.OldIndex) 
                    {
                        ++ this._newItemIndex; 
                    }
                }

                this._cachedList.RemoveAt(args.OldIndex); 
                this._cachedList.Insert(args.NewIndex, item);
                if (this.InternalList.Count != this._cachedList.Count) 
                    throw new InvalidOperationException(SR.Get(SRID.InconsistentBindingList, InternalList, args.ListChangedType)); 
                break;
 
            case ListChangedType.ItemChanged:
                if (!this._itemsRaisePropertyChanged.HasValue)
                {
                    // check whether individual items raise PropertyChanged events 
                    // (DataRowView does)
                    item = this.InternalList[args.NewIndex]; 
                    this._itemsRaisePropertyChanged = (item instanceof INotifyPropertyChanged); 
                }
 
                // if items raise PropertyChanged, we can ignore ItemChanged;
                // otherwise, treat it like a Reset
//                if (!this._itemsRaisePropertyChanged.Value)
//                { 
//                    goto case ListChangedType.Reset;
//                } 
//                break; 
                if (this._itemsRaisePropertyChanged.Value)
                { 
                    break;
                } 

            case ListChangedType.Reset: 
            // treat all other changes like Reset
            case ListChangedType.PropertyDescriptorAdded:
            case ListChangedType.PropertyDescriptorChanged:
            case ListChangedType.PropertyDescriptorDeleted: 
                // implicitly cancel EditItem transactions
                if (this.IsEditingItem) 
                { 
                	this.ImplicitlyCancelEdit();
                } 

                // adjust AddNew transactions, depending on whether the new item
                // survived the Reset
                if (this.IsAddingNew) 
                {
                	this._newItemIndex = this.InternalList.IndexOf(_newItem); 
                    if (this._newItemIndex < 0) 
                    {
                    	this.EndAddNew(true); 
                    }
                }

                this.RefreshOrDefer(); 
                break;
            } 
 
            if (forwardedArgs != null)
            { 
//                base.OnCollectionChanged(sender, forwardedArgs);
            	CollectionView.prototype.OnCollectionChanged.call(this, sender, forwardedArgs);
            }
        },
 
        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForAdd:function(/*int*/ index) 
        { 
            if (this.InternalCount == 1)
            { 
                // added first item; set current at BeforeFirst
            	this.SetCurrent(null, -1);
            }
            else if (index <= this.CurrentPosition)  // adjust current index if insertion is earlier 
            {
                var newPosition = this.CurrentPosition + 1; 
                if (newPosition < this.InternalCount) 
                {
                    // CurrentItem might be out of [....] if underlying list is not INCC 
                    // or if this Add is the result of a Replace (Rem + Add)
                	this.SetCurrent(this.GetItemAt(newPosition), newPosition);
                }
                else 
                {
                	this.SetCurrent(null, this.InternalCount); 
                } 
            }
        },

        // fix up CurrentPosition and CurrentItem after a collection change
        // return true if the current item was removed
//        private bool 
        AdjustCurrencyForRemove:function(/*int*/ index) 
        {
            var result = (index == this.CurrentPosition); 
 
            // adjust current index if deletion is earlier
            if (index < this.CurrentPosition) 
            {
            	this.SetCurrent(this.CurrentItem, this.CurrentPosition - 1);
            }
 
            return result;
        },
 
        // fix up CurrentPosition and CurrentItem after a collection change
//        private void 
        AdjustCurrencyForMove:function(/*int*/ oldIndex, /*int*/ newIndex) 
        {
            if (oldIndex == this.CurrentPosition)
            {
                // moving the current item - currency moves with the item (bug 1942184) 
            	this.SetCurrent(this.GetItemAt(newIndex), newIndex);
            } 
            else if (oldIndex < this.CurrentPosition && this.CurrentPosition <= newIndex) 
            {
                // moving an item from before current position to after - 
                // current item shifts back one position
            	this.SetCurrent(this.CurrentItem, this.CurrentPosition - 1);
            }
            else if (newIndex <= this.CurrentPosition && this.CurrentPosition < oldIndex) 
            {
                // moving an item from after current position to before - 
                // current item shifts ahead one position 
            	this.SetCurrent(this.CurrentItem, this.CurrentPosition + 1);
            } 
            // else no change necessary
        },

        // fix up CurrentPosition and CurrentItem after a collection change 
        // return true if the current item was replaced
//        private bool 
        AdjustCurrencyForReplace:function(/*int*/ index) 
        { 
            var result = (index == this.CurrentPosition);
 
            if (result)
            {
            	this.SetCurrent(this.GetItemAt(index), index);
            } 

            return result; 
        }, 

//        private void 
        MoveCurrencyOffDeletedElement:function(/*int*/ oldCurrentPosition) 
        {
            var lastPosition = this.InternalCount - 1;   // OK if last is -1
            // if position falls beyond last position, move back to last position
            var newPosition = (oldCurrentPosition < lastPosition) ? oldCurrentPosition : lastPosition; 

            this.OnCurrentChanging(); 
 
            if (newPosition < 0)
            	this.SetCurrent(null, newPosition); 
            else
            	this.SetCurrent(this.InternalItemAt(newPosition), newPosition);

            this.OnCurrentChanged(); 
        },

        // SortDescription was added/removed, refresh CollView 
//        private void 
        SortDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (this.IsAddingNew || this.IsEditingItem) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Sorting"));

            this.RefreshOrDefer();
        }, 

        // convert from Avalon SortDescriptions to the corresponding .NET collection 
//        private ListSortDescriptionCollection 
        ConvertSortDescriptionCollection:function(/*SortDescriptionCollection*/ sorts) 
        {
            /*PropertyDescriptorCollection*/var pdc; 
            /*ITypedList*/var itl;
            /*Type*/var itemType;

            if ((itl = this.InternalList instanceof ITypedList) != null) 
            {
                pdc = itl.GetItemProperties(null); 
            } 
            else if ((itemType = this.GetItemType(true)) != null)
            { 
                pdc = TypeDescriptor.GetProperties(itemType);
            }
            else
            { 
                pdc = null;
            } 
 
            if ((pdc == null) || (pdc.Count == 0))
                throw new ArgumentException(SR.Get(SRID.CannotDetermineSortByPropertiesForCollection)); 

            /*ListSortDescription[]*/var sortDescriptions = new ListSortDescription[sorts.Count];
            for (var i = 0; i < sorts.Count; i++)
            { 
                /*PropertyDescriptor*/var dd = pdc.Find(sorts[i].PropertyName, true);
                if (dd == null) 
                { 
                    var typeName = itl.GetListName(null);
                    throw new ArgumentException(SR.Get(SRID.PropertyToSortByNotFoundOnType, typeName, sorts[i].PropertyName)); 
                }
                /*ListSortDescription*/var sd = new ListSortDescription(dd, sorts[i].Direction);
                sortDescriptions[i] = sd;
            } 

            return new ListSortDescriptionCollection(sortDescriptions); 
        }, 

        // initialization for grouping that should happen before preparing the local array
//        void 
        InitializeGrouping:function()
        { 
            // discard old groups
        	this._group.Clear(); 
 
            // initialize the synthetic top level group
        	this._group.Initialize(); 

        	this._isGrouping = (this._group.GroupBy != null);
        },
 

        // divide the data items into groups 
//        void 
        PrepareGroups:function() 
        {
            if (!this._isGrouping) 
                return;

            /*IList*/var list = this.CollectionProxy;
 
            // reset the grouping comparer
            /*IComparer*/var comparer = this.ActiveComparer; 
            if (comparer != null) 
            {
            	this._group.ActiveComparer = comparer; 
            }
            else
            {
                /*CollectionViewGroupInternal.IListComparer*/
            	var ilc = this._group.ActiveComparer instanceof IListComparer ? this._group.ActiveComparer : null; 
                if (ilc != null)
                { 
                    ilc.ResetList(list); 
                }
                else 
                {
                	this._group.ActiveComparer = new CollectionViewGroupInternal.IListComparer(list);
                }
            } 

            // loop through the sorted/filtered list of items, dividing them 
            // into groups (with special cases for placeholder and new item) 
            if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtBeginning)
            { 
            	this._group.InsertSpecialItem(0, this.NewItemPlaceholder, true /*loading*/);
                if (this.IsAddingNew)
                {
                	this._group.InsertSpecialItem(1, this._newItem, true /*loading*/); 
                }
            } 
 
            var isLiveGrouping = (this.IsLiveGrouping == true);
            /*LiveShapingList*/var lsList = list instanceof LiveShapingList ? list : null; 

            for (var k=0, n=list.Count;  k<n;  ++k)
            {
                var item = list.Get(k); 
                /*LiveShapingItem*/var lsi = isLiveGrouping ? lsList.ItemAt(k) : null;
 
                if (!this.IsAddingNew || !Object.Equals(this._newItem, item)) 
                {
                	this._group.AddToSubgroups(item, lsi, true /*loading*/); 
                }
            }

            if (this.IsAddingNew && this.NewItemPlaceholderPosition != NewItemPlaceholderPosition.AtBeginning) 
            {
            	this._group.InsertSpecialItem(this._group.Items.Count, this._newItem, true /*loading*/); 
            } 
            if (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.AtEnd)
            { 
            	this._group.InsertSpecialItem(this._group.Items.Count, this.NewItemPlaceholder, true /*loading*/);
            }
        },
 
        // For the Group to report collection changed
//        void 
        OnGroupChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        { 
            if (e.Action == NotifyCollectionChangedAction.Add)
            { 
            	this.AdjustCurrencyForAdd(e.NewStartingIndex);
            }
            else if (e.Action == NotifyCollectionChangedAction.Remove)
            { 
            	this.AdjustCurrencyForRemove(e.OldStartingIndex);
            } 
            this.OnCollectionChanged(e); 
        },
 
        // The GroupDescriptions collection changed
//        void 
        OnGroupByChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
            if (this.IsAddingNew || this.IsEditingItem) 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Grouping"));
 
            // This is a huge change.  Just refresh the view. 
            this.RefreshOrDefer();
        }, 

        // A group description for one of the subgroups changed
//        void 
        OnGroupDescriptionChanged:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            if (this.IsAddingNew || this.IsEditingItem)
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "Grouping")); 
 
            // This is a huge change.  Just refresh the view.
            this.RefreshOrDefer(); 
        },

        // An item was inserted into the collection.  Update the groups.
//        void 
        AddItemToGroups:function(/*object*/ item) 
        {
            if (this.IsAddingNew && item == this._newItem) 
            { 
                var index;
                switch (this.NewItemPlaceholderPosition) 
                {
                    case NewItemPlaceholderPosition.None:
                    default:
                        index = this._group.Items.Count; 
                        break;
                    case NewItemPlaceholderPosition.AtBeginning: 
                        index = 1; 
                        break;
                    case NewItemPlaceholderPosition.AtEnd: 
                        index = this._group.Items.Count - 1;
                        break;
                }
 
                this._group.InsertSpecialItem(index, item, false /*loading*/);
            } 
            else 
            {
            	this._group.AddToSubgroups(item, null, false /*loading*/); 
            }
        },

        // An item was removed from the collection.  Update the groups. 
//        void 
        RemoveItemFromGroups:function(/*object*/ item)
        { 
            if (this.CanGroupNamesChange || this._group.RemoveFromSubgroups(item)) 
            {
                // the item didn't appear where we expected it to. 
            	this._group.RemoveItemFromSubgroupsByExhaustiveSearch(item);
            }
        },
 
//        LiveShapingFlags 
        GetLiveShapingFlags:function() 
        {
            /*LiveShapingFlags*/var result = 0;

            if (this.IsLiveGrouping == true) 
                result = result | LiveShapingFlags.Grouping;
 
            return result; 
        },
 
//        internal void 
        RestoreLiveShaping:function()
        {
            /*LiveShapingList*/var list = this.CollectionProxy instanceof LiveShapingList ? this.CollectionProxy : null;
            if (list == null) 
                return;
 
            // restore grouping 
            if (this._isGrouping)
            { 
                /*List<AbandonedGroupItem>*/var deleteList = new List/*<AbandonedGroupItem>*/();
                for/*each*/ (var i= 0; i<list.GroupDirtyItems.Count; i++)
                {
                	var lsi = list.GroupDirtyItems.Get(index);
                    if (!lsi.IsDeleted) 
                    {
                        this._group.RestoreGrouping(lsi, deleteList); 
                        lsi.IsGroupDirty = false; 
                    }
                } 

                this._group.DeleteAbandonedGroupItems(deleteList);
            }
 
            list.GroupDirtyItems.Clear();
 
            this.IsLiveShapingDirty = false; 
        },
 
//        void 
        OnLiveShapingDirty:function(/*object*/ sender, /*EventArgs*/ e)
        { 
        	this.IsLiveShapingDirty = true;
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

        /// <summary> 
        /// Helper to raise a PropertyChanged event  />). 
        /// </summary>
//        private void 
        OnPropertyChanged:function(/*string*/ propertyName) 
        {
            Collection.prototype.OnPropertyChanged.call(this, new PropertyChangedEventArgs(propertyName));
        },
 
        // defer work until the current activity completes 
//        private void 
        DeferAction:function(/*Action*/ action)
        { 
            if (this._deferredActions == null)
            {
            	this._deferredActions = new List/*<Action>*/();
            } 
            this._deferredActions.Add(action);
        },
 
        // perform the deferred work, if any
//        private void 
        DoDeferredActions:function() 
        {
            if (this._deferredActions != null)
            {
                /*List<Action>*/var deferredActions = this._deferredActions; 
                this._deferredActions = null;
 
//                foreach(Action action in deferredActions) 
//                {
//                    action(); 
//                }
                
                for(var i = 0; i<deferredActions.Count; i++) 
                {
                	deferredActions.Get(i)(); 
                }
            }
        }
	});
	
	Object.defineProperties(BindingListCollView.prototype,{
 
        /// <summary>
        /// Collection of Sort criteria to sort items in this view over the inner IBindingList. 
        /// </summary> 
        /// <remarks>
        /// <p> 
        /// If the underlying SourceCollection only implements IBindingList,
        /// then only one sort criteria in form of a <seealso cref="SortDescription"/>
        /// can be added, specifying a property and direction to sort by.
        /// Adding more than one SortDescription will cause a InvalidOperationException. 
        /// One such class is Generic BindingList
        /// </p> 
        /// <p> 
        /// Classes like ADO's DataView (the view around a DataTable) do implement
        /// IBindingListView which can support sorting by more than one property 
        /// and also filtering <seealso cref="CustomFilter" />
        /// </p>
        /// <p>
        /// Some IBindingList implementations do not support sorting; for those this property 
        /// will return an empty and immutable / read-only SortDescription collection.
        /// Attempting to modify such a collection will cause NotSupportedException. 
        /// Use <seealso cref="CanSort"/> property on this CollectionView to test if sorting is supported 
        /// before modifying the returned collection.
        /// </p> 
        /// </remarks>
//        public override SortDescriptionCollection 
        SortDescriptions:
        {
            get:function() 
            {
                if (this.InternalList.SupportsSorting) 
                { 
                    if (this._sort == null)
                    { 
                        var allowAdvancedSorting = this._blv != null && this._blv.SupportsAdvancedSorting;
                        this._sort = new BindingListSortDescriptionCollection(allowAdvancedSorting);
                        this._sort.CollectionChanged += new NotifyCollectionChangedEventHandler(SortDescriptionsChanged);
                    } 
                    return this._sort;
                } 
                else 
                    return this.SortDescriptionCollection.Empty;
            } 
        },

        /// <summary>
        /// Test if this ICollectionView supports sorting before adding 
        /// to <seealso cref="SortDescriptions"/>.
        /// </summary> 
        /// <remarks> 
        /// ListCollectionView does implement an IComparer based sorting.
        /// </remarks> 
//        public override bool 
        CanSort:
        {
            get:function()
            { 
                return this.InternalList.SupportsSorting;
            } 
        }, 

//        private IComparer 
        ActiveComparer: 
        {
            get:function() { return this._comparer; },
            set:function(value)
            { 
            	this._comparer = value;
            } 
        }, 

        /// <summary> 
        /// BindingListCollectionView does not support callback-based filtering.
        /// Use <seealso cref="CustomFilter" /> instead.
        /// </summary>
//        public override bool 
        CanFilter: 
        {
            get:function() 
            { 
                return false;
            } 
        },

        /// <summary>
        /// Gets or sets the filter to be used to exclude items from the collection of items returned by the data source . 
        /// </summary>
        /// <remarks> 
        /// Before assigning, test if this CollectionView supports custom filtering 
        /// <seealso cref="CanCustomFilter"/>.
        /// The actual syntax depends on the implementer of IBindingListView. ADO's DataView is 
        /// a common example, see System.Data.DataView.RowFilter for its supported
        /// filter expression syntax.
        /// </remarks>
//        public string 
        CustomFilter: 
        {
            get:function() { return this._customFilter; },
            set:function(value) 
            {
                if (!this.CanCustomFilter) 
                    throw new NotSupportedException(SR.Get(SRID.BindingListCannotCustomFilter));
                if (this.IsAddingNew || this.IsEditingItem)
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "CustomFilter"));
//                if (AllowsCrossThreadChanges) 
//                    VerifyAccess();
 
                this._customFilter = value; 

                this.RefreshOrDefer(); 
            }
        },

        /// <summary> 
        /// Test if this CollectionView supports custom filtering before assigning
        /// a filter string to <seealso cref="CustomFilter"/>. 
        /// </summary> 
//        public bool 
        CanCustomFilter:
        { 
            get:function()
            {
                return ((this._blv != null) && this._blv.SupportsFiltering);
            } 
        },
 
        /// <summary> 
        /// Returns true if this view really supports grouping.
        /// When this returns false, the rest of the interface is ignored. 
        /// </summary>
//        public override bool 
        CanGroup:
        {
            get:function() { return true; } 
        },
 
        /// <summary> 
        /// The description of grouping, indexed by level.
        /// </summary> 
//        public override ObservableCollection<GroupDescription> 
        GroupDescriptions:
        {
            get:function() { return this._group.GroupDescriptions; }
        },

        /// <summary> 
        /// The top-level groups, constructed according to the descriptions 
        /// given in GroupDescriptions and/or GroupBySelector.
        /// </summary> 
//        public override ReadOnlyObservableCollection<object> 
        Groups:
        {
            get:function() { return (this._isGrouping) ? this._group.Items : null; }
        }, 

        /// <summary>
        /// A delegate to select the group description as a function of the 
        /// parent group and its level.
        /// </summary>
//        public GroupDescriptionSelectorCallback 
        GroupBySelector: 
        {
            get:function() { return this._group.GroupBySelector; },
            set:function(value) 
            {
                if (!this.CanGroup) 
                    throw new NotSupportedException();
                if (this.IsAddingNew || this.IsEditingItem)
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringAddOrEdit, "GroupBySelector"));
 
                this._group.GroupBySelector = value;
 
                this.RefreshOrDefer(); 
            }
        }, 

        /// <summary>
        /// Return the estimated number of records (or -1, meaning "don't know").
        /// </summary> 
//        public override int 
        Count:
        { 
            get:function() 
            {
            	this.VerifyRefreshNotDeferred(); 

                return this.InternalCount;
            }
        }, 

        /// <summary> 
        /// Returns true if the resulting (filtered) view is emtpy. 
        /// </summary>
//        public override bool 
        IsEmpty: 
        {
            get:function() { return (this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.None &&
            		this.CollectionProxy.Count == 0); }
        },

        /// <summary> 
        /// Setting this to true informs the view that the list of items 
        /// (after applying the sort and filter, if any) is already in the
        /// correct order for grouping.  This allows the view to use a more 
        /// efficient algorithm to build the groups.
        /// </summary>
//        public bool 
        IsDataInGroupOrder:
        { 
            get:function() { return this._group.IsDataInGroupOrder; },
            set:function(value) { this._group.IsDataInGroupOrder = value; } 
        },

        /// <summary> 
        /// Indicates whether to include a placeholder for a new item, and if so, 
        /// where to put it.
        /// </summary> 
//        public NewItemPlaceholderPosition 
        NewItemPlaceholderPosition:
        {
            get:function() { return _newItemPlaceholderPosition; },
            set:function(value)
            {
            	this.VerifyRefreshNotDeferred(); 
 
                if (value != this._newItemPlaceholderPosition && this.IsAddingNew)
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedDuringTransaction, "NewItemPlaceholderPosition", "AddNew")); 

                if (value != this._newItemPlaceholderPosition && this._isRemoving)
                {
                	this.DeferAction(/*() =>*/function() { this.NewItemPlaceholderPosition = value; }); 
                    return;
                } 
 
                /*NotifyCollectionChangedEventArgs*/var args = null;
                var oldIndex=-1, newIndex=-1; 

                // we're adding, removing, or moving the placeholder.
                // Determine the appropriate events.
                switch (value) 
                {
                    case NewItemPlaceholderPosition.None: 
                        switch (_newItemPlaceholderPosition) 
                        {
                            case NewItemPlaceholderPosition.None: 
                                break;
                            case NewItemPlaceholderPosition.AtBeginning:
                                oldIndex = 0;
                                args = new NotifyCollectionChangedEventArgs( 
                                                NotifyCollectionChangedAction.Remove,
                                                this.NewItemPlaceholder, 
                                                oldIndex); 
                                break;
                            case NewItemPlaceholderPosition.AtEnd: 
                                oldIndex = InternalCount - 1;
                                args = new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Remove,
                                                this.NewItemPlaceholder, 
                                                oldIndex);
                                break; 
                        } 
                        break;
 
                    case NewItemPlaceholderPosition.AtBeginning:
                        switch (_newItemPlaceholderPosition)
                        {
                            case NewItemPlaceholderPosition.None: 
                                newIndex = 0;
                                args = new NotifyCollectionChangedEventArgs( 
                                                NotifyCollectionChangedAction.Add, 
                                                this.NewItemPlaceholder,
                                                newIndex); 
                                break;
                            case NewItemPlaceholderPosition.AtBeginning:
                                break;
                            case NewItemPlaceholderPosition.AtEnd: 
                                oldIndex = this.InternalCount - 1;
                                newIndex = 0; 
                                args = new NotifyCollectionChangedEventArgs( 
                                                NotifyCollectionChangedAction.Move,
                                                this.NewItemPlaceholder, 
                                                newIndex,
                                                oldIndex);
                                break;
                        } 
                        break;
 
                    case NewItemPlaceholderPosition.AtEnd: 
                        switch (this._newItemPlaceholderPosition)
                        { 
                            case NewItemPlaceholderPosition.None:
                                newIndex = this.InternalCount;
                                args = new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Add, 
                                                this.NewItemPlaceholder,
                                                newIndex); 
                                break; 
                            case NewItemPlaceholderPosition.AtBeginning:
                                oldIndex = 0; 
                                newIndex = this.InternalCount - 1;
                                args = new NotifyCollectionChangedEventArgs(
                                                NotifyCollectionChangedAction.Move,
                                                this.NewItemPlaceholder, 
                                                newIndex,
                                                oldIndex); 
                                break; 
                            case NewItemPlaceholderPosition.AtEnd:
                                break; 
                        }
                        break;
                }
 
                // now make the change and raise the events
                if (args != null) 
                { 
                	this._newItemPlaceholderPosition = value;
 
                    if (!this._isGrouping)
                    {
//                        base.OnCollectionChanged(null, args);
                    	CollectionView.prototype.OnCollectionChanged.call(this, null, args);
                    } 
                    else
                    { 
                        if (oldIndex >= 0) 
                        {
                            var index = (oldIndex == 0) ? 0 : this._group.Items.Count - 1; 
                            this._group.RemoveSpecialItem(index, NewItemPlaceholder, false /*loading*/);
                        }
                        if (newIndex >= 0)
                        { 
                            var index = (newIndex == 0) ? 0 : this._group.Items.Count;
                            this._group.InsertSpecialItem(index, NewItemPlaceholder, false /*loading*/); 
                        } 
                    }
 
                    this.OnPropertyChanged("NewItemPlaceholderPosition");
                }
            }
        },

        /// <summary> 
        /// Return true if the view supports <seealso cref="AddNew"/>. 
        /// </summary>
//        public bool 
        CanAddNew:
        {
            get:function() { return !this.IsEditingItem && this.InternalList.AllowNew; }
        },
 
        /// <summary> 
        /// Returns true if an </seealso cref="AddNew"> transaction is in progress. 
        /// </summary>
//        public bool 
        IsAddingNew: 
        {
            get:function() { return (this._newItem != CollectionView.NoNewItem); }
        },
 
        /// <summary>
        /// When an </seealso cref="AddNew"> transaction is in progress, this property 
        /// returns the new item.  Otherwise it returns null. 
        /// </summary>
//        public object 
        CurrentAddItem: 
        {
            get:function() { return this.IsAddingNew ? this._newItem : null; }
        },
 
        /// <summary>
        /// Return true if the view supports <seealso cref="Remove"/> and 
        /// <seealso cref="RemoveAt"/>.
        /// </summary> 
//        public bool 
        CanRemove: 
        {
            get:function() { return !this.IsEditingItem && !this.IsAddingNew && this.InternalList.AllowRemove; } 
        },

        /// <summary> 
        /// Returns true if the view supports the notion of "pending changes" on the
        /// current edit item.  This may vary, depending on the view and the particular
        /// item.  For example, a view might return true if the current edit item
        /// implements <seealso cref="IEditableObject"/>, or if the view has special 
        /// knowledge about the item that it can use to support rollback of pending
        /// changes. 
        /// </summary> 
//        public bool 
        CanCancelEdit:
        { 
            get:function() { return (this._editItem instanceof IEditableObject); }
        },

        /// <summary> 
        /// Returns true if an </seealso cref="EditItem"> transaction is in progress.
        /// </summary> 
//        public bool 
        IsEditingItem: 
        {
            get:function() { return (this._editItem != null); } 
        },

        /// <summary>
        /// When an </seealso cref="EditItem"> transaction is in progress, this property 
        /// returns the affected item.  Otherwise it returns null.
        /// </summary> 
//        public object 
        CurrentEditItem: 
        {
            get:function() { return this._editItem; } 
        },

        ///<summary>
        /// Gets a value that indicates whether this view supports turning live sorting on or off. 
        ///</summary> 
//        public bool 
        CanChangeLiveSorting:
        { get:function() { return false; } }, 

        ///<summary>
        /// Gets a value that indicates whether this view supports turning live filtering on or off.
        ///</summary> 
//        public bool 
        CanChangeLiveFiltering:
        { get:function() { return false; } }, 
 
        ///<summary>
        /// Gets a value that indicates whether this view supports turning live grouping on or off. 
        ///</summary>
//        public bool 
        CanChangeLiveGrouping:
        { get:function() { return true; } },
 

        ///<summary> 
        /// Gets or sets a value that indicates whether live sorting is enabled. 
        /// The value may be null if the view does not know whether live sorting is enabled.
        /// Calling the setter when CanChangeLiveSorting is false will throw an 
        /// InvalidOperationException.
        ///</summary
//        public bool? 
        IsLiveSorting:
        { 
            get:function() { return this.IsDataView ? true : null; },
            set:function(value) { throw new InvalidOperationException(SR.Get(SRID.CannotChangeLiveShaping, "IsLiveSorting", "CanChangeLiveSorting")); } 
        }, 

        ///<summary> 
        /// Gets or sets a value that indicates whether live filtering is enabled.
        /// The value may be null if the view does not know whether live filtering is enabled.
        /// Calling the setter when CanChangeLiveFiltering is false will throw an
        /// InvalidOperationException. 
        ///</summary>
//        public bool? 
        IsLiveFiltering: 
        { 
            get:function() { return this.IsDataView ? true : null; },
            set:function(value) { throw new InvalidOperationException(SR.Get(SRID.CannotChangeLiveShaping, "IsLiveFiltering", "CanChangeLiveFiltering")); } 
        },

        ///<summary>
        /// Gets or sets a value that indicates whether live grouping is enabled. 
        /// The value may be null if the view does not know whether live grouping is enabled.
        /// Calling the setter when CanChangeLiveGrouping is false will throw an 
        /// InvalidOperationException. 
        ///</summary>
//        public bool? 
        IsLiveGrouping: 
        {
            get:function() { return _isLiveGrouping; },
            set:function(value)
            { 
                if (value == null)
                    throw new ArgumentNullException("value"); 
 

                if (value != this._isLiveGrouping) 
                {
                	this._isLiveGrouping = value;
                	this.RefreshOrDefer();
 
                	this.OnPropertyChanged("IsLiveGrouping");
                } 
            } 
        },
 
        ///<summary>
        /// Gets a collection of strings describing the properties that
        /// trigger a live-sorting recalculation.
        /// The strings use the same format as SortDescription.PropertyName. 
        ///</summary>
        ///<notes> 
        /// When the underlying view implements ICollectionViewLiveShaping, 
        /// this collection is used to set the underlying view's LiveSortingProperties.
        /// When this collection is empty, the view will use the PropertyName strings 
        /// from its SortDescriptions.
        ///</notes>
//        public ObservableCollection<string> 
        LiveSortingProperties:
        { 
            get:function()
            { 
                if (this._liveSortingProperties == null) 
                {
                	this._liveSortingProperties = new ObservableCollection/*<string>*/(); 
                }
                return this._liveSortingProperties;
            }
        }, 

        ///<summary> 
        /// Gets a collection of strings describing the properties that 
        /// trigger a live-filtering recalculation.
        /// The strings use the same format as SortDescription.PropertyName. 
        ///</summary>
        ///<notes>
        /// When the underlying view implements ICollectionViewLiveShaping,
        /// this collection is used to set the underlying view's LiveFilteringProperties. 
        ///</notes>
//        public ObservableCollection<string> 
        LiveFilteringProperties: 
        { 
            get:function()
            { 
                if (this._liveFilteringProperties == null)
                {
                	this._liveFilteringProperties = new ObservableCollection/*<string>*/();
                } 
                return this._liveFilteringProperties;
            } 
        }, 

        ///<summary> 
        /// Gets a collection of strings describing the properties that
        /// trigger a live-grouping recalculation.
        /// The strings use the same format as PropertyGroupDescription.PropertyName.
        ///</summary> 
        ///<notes>
        /// When the underlying view implements ICollectionViewLiveShaping, 
        /// this collection is used to set the underlying view's LiveGroupingProperties. 
        ///</notes>
//        public ObservableCollection<string> 
        LiveGroupingProperties: 
        {
            get:function()
            {
                if (this._liveGroupingProperties == null) 
                {
                	this._liveGroupingProperties = new ObservableCollection/*<string>*/(); 
                	this._liveGroupingProperties.CollectionChanged += new NotifyCollectionChangedEventHandler(OnLivePropertyListChanged); 
                }
                return this._liveGroupingProperties; 
            }
        },

        /// <summary>
        /// Returns information about the properties available on items in the 
        /// underlying collection.  This information may come from a schema, from
        /// a type descriptor, from a representative item, or from some other source
        /// known to the view.
        /// </summary> 
//        public ReadOnlyCollection<ItemPropertyInfo> 
        ItemProperties:
        { 
            get:function() { return this.GetItemProperties(); } 
        },
 

        /// <summary>
        /// Protected accessor to private count.
        /// </summary> 
//        private int 
        InternalCount:
        { 
            get:function() 
            {
                if (_this.isGrouping) 
                    return this._group.ItemCount;

                return ((this.NewItemPlaceholderPosition == NewItemPlaceholderPosition.None) ? 0 : 1) +
                	this.CollectionProxy.Count; 
            }
        }, 
 
//        private bool 
        IsDataView:
        { 
            get:function() { return this._isDataView; }
        },

        // true if CurrentPosition points to item within view
//        private bool 
        IsCurrentInView: 
        {
            get:function() { return (0 <= this.CurrentPosition && this.CurrentPosition < this.InternalCount); }
        },
 
//        private IList 
        CollectionProxy: 
        {
            get:function() 
            {
                if (this._shadowList != null)
                    return this._shadowList;
                else 
                    return this.InternalList;
            } 
        }, 
        /// <summary>
        /// Accessor to private _internalList field. 
        /// </summary>
//        private IBindingList 
        InternalList:
        {
            get:function() { return this._internalList; },
            set:function(value) { this._internalList = value; }
        }, 
 
//        private bool 
        IsCustomFilterSet:
        { 
            get:function() { return ((this._blv != null) && !String.IsNullOrEmpty(this._customFilter)); }
        },

        // can the group name(s) for an item change after we've grouped the item? 
//        private bool 
        CanGroupNamesChange:
        { 
            // There's no way we can deduce this - the app has to tell us. 
            // If this is true, removing a grouped item is quite difficult.
            // We cannot rely on its group names to tell us which group we inserted 
            // it into (they may have been different at insertion time), so we
            // have to do a linear search.
            get:function() { return true; }
        }, 
   
//        internal bool 
        IsLiveShapingDirty:
        {
            get:function() { return this._isLiveShapingDirty; },
            set:function(value) 
            {
                if (value == this._isLiveShapingDirty) 
                    return; 

                this._isLiveShapingDirty = value; 
                if (value)
                {
                    Dispatcher.BeginInvoke(DispatcherPriority.DataBind, RestoreLiveShaping);
                } 
            }
        } 
       
	});
	
	BindingListCollView.Type = new Type("BindingListCollView", BindingListCollView, 
			[CollectionView.Type, IEditableCollectionView.Type, ICollectionViewLiveShaping.Type, IItemProperties.Type]);
	return BindingListCollView;
});
